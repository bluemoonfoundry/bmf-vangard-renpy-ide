# Used-But-Undefined Variable Detection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Detect Ren'Py variables that are referenced (via `[varname]` text interpolation or in `if`/`elif`/`while` conditions) but never defined anywhere in the project, and surface that as an editor squiggle, a Diagnostics tab entry, and a Statistics tab count.

**Architecture:** A single new pure-function module (`src/lib/renpyIdentifiers.ts`) does the identifier extraction and "is this name known" check, shared by three consumers: `useDiagnostics.ts` (new "Source 14" diagnostic rule, modeled on the existing "undefined-character"/"undefined-screen" rules), `EditorView.tsx` (a new Monaco marker effect, modeled on the existing `renpy-jumps` marker effect), and `StatsView.tsx` (a new stat card). No changes to `RenpyAnalysisResult`, the analysis worker, or `useRenpyAnalysis.ts` are needed — detection works directly off `block.content` plus the already-computed `variables`/`characters`/`screens` maps, exactly like the existing undefined-character/undefined-screen diagnostics do.

**Tech Stack:** TypeScript, Vitest + `@testing-library/react` (`renderHook`), Monaco Editor (`monaco.editor.setModelMarkers`), existing `src/test/mocks/sampleData.ts` factories.

## Global Constraints

- Imports use the `@/` path alias everywhere (never relative `../`), per `CLAUDE.md`.
- `src/types.ts` is the single source of truth for data shapes — no ad-hoc shadow types.
- Bead for this work: `bmf-vangard-renpy-ide-141b`. Claim it (`bd update bmf-vangard-renpy-ide-141b --claim`) before starting Task 1, close it after Task 6's commit.
- Do not touch `RenpyAnalysisResult`, `useRenpyAnalysis.ts`, or `renpyAnalysis.worker.ts` — this feature is deliberately scoped to reuse the existing `variables`/`characters`/`screens` maps as the "known names" source, not to add new analysis-worker output.
- Follow TDD: write the failing test, watch it fail, implement, watch it pass, commit.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/lib/renpyIdentifiers.ts` (new) | `buildKnownIdentifierSet()` + `extractUndefinedVariableReferences()` — the one place that knows what "used but undefined" means. |
| `src/lib/renpyIdentifiers.test.ts` (new) | Unit tests for the extraction logic in isolation. |
| `src/hooks/useDiagnostics.ts` (modify) | New "Source 14" rule pushing `category: 'undefined-variable'` issues; `STATEMENT_KEYWORDS` moves to the new lib file and is imported back. |
| `src/hooks/useDiagnostics.test.ts` (modify) | Tests for the new diagnostic rule. |
| `src/components/DiagnosticsPanel.tsx` (modify) | Register `'undefined-variable'` in `CATEGORY_LABELS` / `CATEGORY_COLORS`. |
| `src/components/StatsView.tsx` (modify) | New "Undefined variable usages" stat, computed the same way as the diagnostic. |
| `src/components/EditorView.tsx` (modify) | New Monaco marker effect (`'renpy-undefined-vars'`) mirroring the existing `'renpy-jumps'` effect. |

---

### Task 1: Identifier extraction library

**Files:**
- Create: `src/lib/renpyIdentifiers.ts`
- Test: `src/lib/renpyIdentifiers.test.ts`

**Interfaces:**
- Consumes: `RenpyAnalysisResult` type from `@/types` (only reads `.variables`, `.characters`, `.screens`).
- Produces (used by Tasks 2, 4, 5):
  - `export const STATEMENT_KEYWORDS: Set<string>` — moved verbatim from `src/hooks/useDiagnostics.ts:21-27`.
  - `export interface UndefinedVariableRef { name: string; line: number; columnStart: number; columnEnd: number }` — `line` is 1-indexed; `columnStart`/`columnEnd` are 0-indexed (same convention as `JumpLocation` in `src/types.ts`, i.e. Monaco callers must `+1`).
  - `export function buildKnownIdentifierSet(analysisResult: RenpyAnalysisResult): Set<string>` — union of `analysisResult.variables.keys()`, `analysisResult.characters` tags (`Array.from(analysisResult.characters.keys())`), `analysisResult.screens.keys()`, `STATEMENT_KEYWORDS`, and a fixed allowlist of Python/Ren'Py globals: `['renpy', 'config', 'gui', 'persistent', 'store', 'True', 'False', 'None', '_', '__']`.
  - `export function extractUndefinedVariableReferences(content: string, knownNames: Set<string>): UndefinedVariableRef[]` — scans `content` line by line for two reference contexts and returns **every** occurrence (no de-duplication; callers decide whether to dedupe):
    1. Text interpolation `[varname]` or `[varname!q]` anywhere on the line (Ren'Py only expands these inside strings, but a line-level scan is consistent with how the rest of the codebase's line-based regexes work — see `useDiagnostics.ts` Source 5/6).
    2. A bare identifier appearing as (or as part of, via `and`/`or`/`not`) the condition of an `if`/`elif`/`while` statement, with string-literal contents stripped first so identifiers inside quoted strings are never flagged, and identifiers immediately followed by `(` (function/method calls) skipped since call targets aren't tracked as "variables".
    - For both contexts, an identifier is flagged only if it is **not** in `knownNames`, does not match `/^[a-zA-Z_]\w*\.[a-zA-Z_]/` where the root (`persistent`, `store`, etc.) is in `knownNames` (dotted access on a known root, e.g. `persistent.foo`, is not double-flagged), and is not immediately preceded by a `.` (i.e. it's not an attribute access like `foo.bar` where `bar` is being read off some other object — only flag the base identifier).

- [ ] **Step 1: Write the failing tests**

```typescript
// src/lib/renpyIdentifiers.test.ts
import { describe, it, expect } from 'vitest';
import {
  STATEMENT_KEYWORDS,
  buildKnownIdentifierSet,
  extractUndefinedVariableReferences,
} from './renpyIdentifiers';
import { createEmptyAnalysisResult, createVariable, createCharacter, createScreen } from '@/test/mocks/sampleData';

describe('buildKnownIdentifierSet', () => {
  it('includes variable names, character tags, screen names, and statement keywords', () => {
    const analysis = createEmptyAnalysisResult({
      variables: new Map([['player_name', createVariable({ name: 'player_name' })]]),
      characters: new Map([['e', createCharacter({ tag: 'e' })]]),
      screens: new Map([['main_menu', createScreen({ name: 'main_menu' })]]),
    });
    const known = buildKnownIdentifierSet(analysis);
    expect(known.has('player_name')).toBe(true);
    expect(known.has('e')).toBe(true);
    expect(known.has('main_menu')).toBe(true);
    expect(known.has('if')).toBe(true); // from STATEMENT_KEYWORDS
    expect(known.has('persistent')).toBe(true); // allowlisted root
  });
});

describe('extractUndefinedVariableReferences', () => {
  const known = new Set(['player_name', ...STATEMENT_KEYWORDS, 'renpy', 'persistent', 'True', 'False', 'None']);

  it('flags an undefined variable used in [interpolation]', () => {
    const refs = extractUndefinedVariableReferences('    "Hello [playre_name]!"\n', known);
    expect(refs).toHaveLength(1);
    expect(refs[0]).toMatchObject({ name: 'playre_name', line: 1 });
  });

  it('does not flag a known variable used in [interpolation]', () => {
    const refs = extractUndefinedVariableReferences('    "Hello [player_name]!"\n', known);
    expect(refs).toHaveLength(0);
  });

  it('flags an undefined variable in an if condition', () => {
    const refs = extractUndefinedVariableReferences('    if has_met_eileen:\n        pass\n', known);
    expect(refs).toHaveLength(1);
    expect(refs[0]).toMatchObject({ name: 'has_met_eileen', line: 1 });
  });

  it('does not flag identifiers inside string literals within a condition', () => {
    const refs = extractUndefinedVariableReferences('    if player_name == "mystery_guest":\n', known);
    expect(refs).toHaveLength(0);
  });

  it('does not flag a function call target', () => {
    const refs = extractUndefinedVariableReferences('    if renpy.seen_label("start"):\n', known);
    expect(refs).toHaveLength(0);
  });

  it('does not flag dotted access off a known root', () => {
    const refs = extractUndefinedVariableReferences('    if persistent.unlocked_gallery:\n', known);
    expect(refs).toHaveLength(0);
  });

  it('reports 0-indexed column positions for interpolation matches', () => {
    const refs = extractUndefinedVariableReferences('"Hi [oops]"', known);
    expect(refs[0].columnStart).toBe(4);
    expect(refs[0].columnEnd).toBe(8);
  });

  it('flags multiple bare identifiers joined by and/or', () => {
    const refs = extractUndefinedVariableReferences('    if flag_one and flag_two:\n', known);
    const names = refs.map(r => r.name).sort();
    expect(names).toEqual(['flag_one', 'flag_two']);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/lib/renpyIdentifiers.test.ts`
Expected: FAIL with "Cannot find module './renpyIdentifiers'" (file doesn't exist yet).

- [ ] **Step 3: Write the implementation**

```typescript
// src/lib/renpyIdentifiers.ts
import type { RenpyAnalysisResult } from '@/types';

// ---------------------------------------------------------------------------
// Ren'Py statement keywords — these should not be treated as undefined names.
// (Moved here from useDiagnostics.ts so both the diagnostics rule and the
// editor marker / stats consumers share one definition.)
// ---------------------------------------------------------------------------
export const STATEMENT_KEYWORDS = new Set([
  'show', 'hide', 'scene', 'play', 'queue', 'stop', 'pause', 'with', 'window',
  'define', 'default', 'init', 'label', 'jump', 'call', 'return', 'if', 'elif',
  'else', 'for', 'while', 'pass', 'menu', 'image', 'transform', 'style', 'screen',
  'python', 'translate', 'nvl', 'voice', 'renpy', 'config', 'gui', 'at', 'as',
  'behind', 'onlayer', 'zorder', 'expression', 'extend', 'camera',
]);

const ALLOWLISTED_ROOTS = ['renpy', 'config', 'gui', 'persistent', 'store', 'True', 'False', 'None', '_', '__'];

const PYTHON_LOGIC_WORDS = new Set(['and', 'or', 'not', 'in', 'is', 'True', 'False', 'None']);

export interface UndefinedVariableRef {
  name: string;
  line: number;
  columnStart: number;
  columnEnd: number;
}

export function buildKnownIdentifierSet(analysisResult: RenpyAnalysisResult): Set<string> {
  const known = new Set<string>(STATEMENT_KEYWORDS);
  analysisResult.variables.forEach((_v, name) => known.add(name));
  analysisResult.characters.forEach((_c, tag) => known.add(tag));
  analysisResult.screens.forEach((_s, name) => known.add(name));
  ALLOWLISTED_ROOTS.forEach(r => known.add(r));
  return known;
}

const INTERPOLATION_REGEX = /\[([a-zA-Z_]\w*)(?:!\w+)?\]/g;
const IF_WHILE_REGEX = /^\s*(?:if|elif|while)\s+(.+?):\s*$/;
const BARE_IDENTIFIER_REGEX = /\b[a-zA-Z_]\w*\b/g;

function stripStringLiterals(line: string): string {
  return line
    .replace(/"[^"\\]*(?:\\.[^"\\]*)*"/g, m => ' '.repeat(m.length))
    .replace(/'[^'\\]*(?:\\.[^'\\]*)*'/g, m => ' '.repeat(m.length));
}

export function extractUndefinedVariableReferences(content: string, knownNames: Set<string>): UndefinedVariableRef[] {
  const refs: UndefinedVariableRef[] = [];
  const lines = content.split('\n');

  lines.forEach((rawLine, index) => {
    const lineNumber = index + 1;

    // --- Interpolation: [varname] / [varname!q] ---
    INTERPOLATION_REGEX.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = INTERPOLATION_REGEX.exec(rawLine)) !== null) {
      const name = m[1];
      if (!knownNames.has(name)) {
        const nameStart = m.index + 1; // skip the '['
        refs.push({ name, line: lineNumber, columnStart: nameStart, columnEnd: nameStart + name.length });
      }
    }

    // --- if/elif/while condition ---
    const condMatch = IF_WHILE_REGEX.exec(rawLine);
    if (condMatch) {
      const conditionStart = condMatch.index + rawLine.indexOf(condMatch[1], condMatch.index);
      const strippedCondition = stripStringLiterals(condMatch[1]);
      BARE_IDENTIFIER_REGEX.lastIndex = 0;
      let cm: RegExpExecArray | null;
      while ((cm = BARE_IDENTIFIER_REGEX.exec(strippedCondition)) !== null) {
        const name = cm[0];
        if (PYTHON_LOGIC_WORDS.has(name) || knownNames.has(name)) continue;

        const precedingChar = strippedCondition[cm.index - 1];
        if (precedingChar === '.') continue; // attribute access, e.g. foo.bar

        const followingChar = strippedCondition[cm.index + name.length];
        if (followingChar === '(') continue; // function/method call

        const nameStart = conditionStart + cm.index;
        refs.push({ name, line: lineNumber, columnStart: nameStart, columnEnd: nameStart + name.length });
      }
    }
  });

  return refs;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/lib/renpyIdentifiers.test.ts`
Expected: PASS (9 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/renpyIdentifiers.ts src/lib/renpyIdentifiers.test.ts
git commit -m "feat: add undefined-variable-reference identifier extraction"
```

---

### Task 2: Diagnostics rule ("Source 14: used-but-undefined variables")

**Files:**
- Modify: `src/hooks/useDiagnostics.ts`
- Test: `src/hooks/useDiagnostics.test.ts`

**Interfaces:**
- Consumes (from Task 1): `STATEMENT_KEYWORDS`, `buildKnownIdentifierSet`, `extractUndefinedVariableReferences`, `UndefinedVariableRef` from `@/lib/renpyIdentifiers`.
- Produces: `DiagnosticIssue` entries with `category: 'undefined-variable'`, `severity: 'warning'`, `id: 'undefined-variable:${name}'` — same id/dedup convention as the existing `undefined-character`/`undefined-screen` rules at `useDiagnostics.ts:203-252`.

- [ ] **Step 1: Write the failing test**

Add to `src/hooks/useDiagnostics.test.ts` (place near the existing `describe('undefined screens', ...)` block, following the same structure as that block, which starts around line 262):

```typescript
  describe('undefined variables', () => {
    it('generates a warning when [interpolation] references an undefined variable', () => {
      const blocks = [createBlock({
        id: 'b1',
        content: 'label start:\n    "Hello [player_nmae]!"\n',
        filePath: 'game/script.rpy',
      })];
      const analysis = createEmptyAnalysisResult();

      const { result } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map())
      );

      const varIssues = result.current.issues.filter(i => i.category === 'undefined-variable');
      expect(varIssues).toHaveLength(1);
      expect(varIssues[0].severity).toBe('warning');
      expect(varIssues[0].message).toContain('player_nmae');
      expect(varIssues[0].line).toBe(2);
    });

    it('does not flag a variable that is defined', () => {
      const blocks = [createBlock({
        id: 'b1',
        content: 'label start:\n    "Hello [player_name]!"\n',
        filePath: 'game/script.rpy',
      })];
      const analysis = createEmptyAnalysisResult({
        variables: new Map([['player_name', createVariable({ name: 'player_name' })]]),
      });

      const { result } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map())
      );

      expect(result.current.issues.filter(i => i.category === 'undefined-variable')).toHaveLength(0);
    });

    it('deduplicates repeated references to the same undefined variable', () => {
      const blocks = [createBlock({
        id: 'b1',
        content: 'label start:\n    if has_flag:\n        "Set: [has_flag]"\n',
        filePath: 'game/script.rpy',
      })];
      const analysis = createEmptyAnalysisResult();

      const { result } = renderHook(() =>
        useDiagnostics(blocks, analysis, new Map(), new Map(), new Map(), new Map())
      );

      expect(result.current.issues.filter(i => i.category === 'undefined-variable' && i.message.includes('has_flag'))).toHaveLength(1);
    });
  });
```

Also add `createVariable` to the existing import line at the top of the test file if not already imported (`import { createBlock, createEmptyAnalysisResult, createCharacter, createVariable } from '@/test/mocks/sampleData';` — this import already exists per the file header, so no change needed there).

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/hooks/useDiagnostics.test.ts -t "undefined variables"`
Expected: FAIL — 0 issues found instead of 1 (rule doesn't exist yet).

- [ ] **Step 3: Implement the rule**

First, replace the local `STATEMENT_KEYWORDS` definition with an import. In `src/hooks/useDiagnostics.ts`, change the import block (lines 1-16):

```typescript
import { useMemo } from 'react';
import type {
  Block,
  RenpyAnalysisResult,
  ProjectImage,
  RenpyAudio,
  ImageMetadata,
  AudioMetadata,
  DiagnosticIssue,
  DiagnosticsResult,
  DiagnosticsTask,
  IgnoredDiagnosticRule,
  PunchlistMetadata,
} from '@/types';
import { validateRenpyCode } from '@/lib/renpyValidator';
import { matchesIgnoredDiagnostic } from '@/lib/diagnosticIgnores';
import { STATEMENT_KEYWORDS, buildKnownIdentifierSet, extractUndefinedVariableReferences } from '@/lib/renpyIdentifiers';
```

Then delete the now-duplicate local declaration at lines 21-27 (`const STATEMENT_KEYWORDS = new Set([...]);`) — keep the two regex consts (`RE_CHAR_DIALOGUE`, `RE_SCREEN_REF`) that follow it.

Then add the new rule directly after "Source 6: Undefined screens" (after line 252, before "Source 7: Unused characters"):

```typescript
    // -----------------------------------------------------------------------
    // Source 14: Used-but-undefined variables ([interpolation] / if-conditions
    // referencing a name that never appears in a define/default/$ statement)
    // -----------------------------------------------------------------------
    const knownIdentifiers = buildKnownIdentifierSet(analysisResult);
    const seenUndefinedVars = new Set<string>();
    for (const block of blocks) {
      if (!block.content) continue;
      const refs = extractUndefinedVariableReferences(block.content, knownIdentifiers);
      for (const ref of refs) {
        if (seenUndefinedVars.has(ref.name)) continue;
        seenUndefinedVars.add(ref.name);
        issues.push({
          id: `undefined-variable:${ref.name}`,
          severity: 'warning',
          category: 'undefined-variable',
          message: `Variable "${ref.name}" is used but never defined`,
          blockId: block.id,
          filePath: block.filePath,
          line: ref.line,
        });
      }
    }
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/hooks/useDiagnostics.test.ts`
Expected: PASS (all existing tests plus the 3 new ones — confirms `STATEMENT_KEYWORDS` re-export didn't break Source 5).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useDiagnostics.ts src/hooks/useDiagnostics.test.ts
git commit -m "feat: flag used-but-undefined variables in Diagnostics tab"
```

---

### Task 3: Diagnostics panel category label/color

**Files:**
- Modify: `src/components/DiagnosticsPanel.tsx`

**Interfaces:**
- Consumes: `category: 'undefined-variable'` string produced by Task 2.
- Produces: nothing new consumed elsewhere — purely presentational.

- [ ] **Step 1: Add the category entries**

In `src/components/DiagnosticsPanel.tsx`, add one line to each map (around lines 62-76 and 78-92):

```typescript
const CATEGORY_LABELS: Record<string, string> = {
  'invalid-jump':          'Invalid Jump',
  'syntax':                'Syntax',
  'missing-image':         'Missing Image',
  'missing-audio':         'Missing Audio',
  'undefined-character':   'Undefined Character',
  'undefined-screen':      'Undefined Screen',
  'undefined-variable':    'Undefined Variable',
  'unused-character':      'Unused Character',
  'unreachable-label':     'Unreachable Label',
  'dead-end-label':        'Dead-End Label',
  'unused-variable':       'Unused Variable',
  'pickle-unsafe-variable':'Pickle Unsafe',
  'define-mutated':        'Define Mutated',
  'implicit-variable':     'Implicit Variable',
};

const CATEGORY_COLORS: Record<string, string> = {
  'invalid-jump':           'bg-red-50    text-red-700    dark:bg-red-900/30    dark:text-red-300',
  'syntax':                 'bg-red-50    text-red-700    dark:bg-red-900/30    dark:text-red-300',
  'missing-image':          'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'missing-audio':          'bg-pink-50   text-pink-700   dark:bg-pink-900/30   dark:text-pink-300',
  'undefined-character':    'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  'undefined-screen':       'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'undefined-variable':     'bg-rose-50   text-rose-700   dark:bg-rose-900/30   dark:text-rose-300',
  'unused-character':       'bg-blue-50   text-blue-700   dark:bg-blue-900/30   dark:text-blue-300',
  'unreachable-label':      'bg-gray-100  text-gray-600   dark:bg-gray-700      dark:text-gray-300',
  'dead-end-label':         'bg-teal-50   text-teal-700   dark:bg-teal-900/30   dark:text-teal-300',
  'unused-variable':        'bg-gray-100  text-gray-600   dark:bg-gray-700      dark:text-gray-300',
  'pickle-unsafe-variable': 'bg-amber-50  text-amber-700  dark:bg-amber-900/30  dark:text-amber-300',
  'define-mutated':         'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'implicit-variable':      'bg-blue-50   text-blue-700   dark:bg-blue-900/30   dark:text-blue-300',
};
```

- [ ] **Step 2: Verify with the full suite**

Run: `npm test -- src/hooks/useDiagnostics.test.ts`
Expected: PASS — this file has no dedicated component test, so the diagnostics-rule tests from Task 2 are the coverage; confirm no regression there.

- [ ] **Step 3: Commit**

```bash
git add src/components/DiagnosticsPanel.tsx
git commit -m "feat: add Undefined Variable category styling to Diagnostics panel"
```

---

### Task 4: Statistics tab count

**Files:**
- Modify: `src/components/StatsView.tsx`
- Test: `src/components/StatsView.test.tsx`

**Interfaces:**
- Consumes (from Task 1): `buildKnownIdentifierSet`, `extractUndefinedVariableReferences` from `@/lib/renpyIdentifiers`.
- Produces: a rendered stat labeled "Undefined Variable Usages" with a `data-testid="stat-undefined-variables"` for testability, next to the existing variable stats section (`variableStats`, `StatsView.tsx:430-444`).

- [ ] **Step 1: Inspect the existing variable stat card's rendering**

Before writing the test, read `src/components/StatsView.tsx` around where `variableStats.total` / `variableStats.persistent` etc. are rendered (search for `variableStats.total` in the JSX, likely a `<StatCard>`-style component) to match its exact markup pattern and find the right insertion point. Use the same stat-card component and prop names already used there — do not invent a new card style.

- [ ] **Step 2: Write the failing test**

Add to `src/components/StatsView.test.tsx` (check the existing file first for its render-helper pattern — it will already construct `blocks` + `analysisResult` props via the same `sampleData.ts` factories used elsewhere in this plan):

```typescript
  it('shows a count of undefined variable usages', () => {
    const blocks = [createBlock({
      id: 'b1',
      content: 'label start:\n    "Hello [oops_typo]!"\n',
      filePath: 'game/script.rpy',
    })];
    const analysisResult = createEmptyAnalysisResult({ storyBlockIds: new Set(['b1']) });

    render(<StatsView {...defaultProps} blocks={blocks} analysisResult={analysisResult} />);

    expect(screen.getByTestId('stat-undefined-variables')).toHaveTextContent('1');
  });
```

(Match this to whatever `render(...)` helper / `defaultProps` pattern the existing tests in this file already use — read the file's first ~40 lines before writing this so prop names line up exactly.)

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- src/components/StatsView.test.tsx -t "undefined variable usages"`
Expected: FAIL — `getByTestId('stat-undefined-variables')` not found.

- [ ] **Step 4: Implement the stat**

In `src/components/StatsView.tsx`, add the import:

```typescript
import { buildKnownIdentifierSet, extractUndefinedVariableReferences } from '@/lib/renpyIdentifiers';
```

Add a memoized count near `variableStats` (after `StatsView.tsx:444`):

```typescript
  const undefinedVariableCount = useMemo(() => {
    const known = buildKnownIdentifierSet(analysisResult);
    const seen = new Set<string>();
    blocks.forEach(block => {
      if (!block.content) return;
      extractUndefinedVariableReferences(block.content, known).forEach(ref => seen.add(ref.name));
    });
    return seen.size;
  }, [blocks, analysisResult]);
```

Then render it next to the existing variable stat card, using whichever stat-card component/markup Step 1 identified, with `data-testid="stat-undefined-variables"` on the element that contains the number, e.g.:

```tsx
<StatCard label="Undefined Variable Usages" value={undefinedVariableCount} testId="stat-undefined-variables" />
```

(Adjust prop names to match the real `StatCard` signature found in Step 1 — this plan cannot guess its exact props without reading the file, so the implementer must align this call to the component actually in use.)

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- src/components/StatsView.test.tsx`
Expected: PASS (all existing tests plus the new one).

- [ ] **Step 6: Commit**

```bash
git add src/components/StatsView.tsx src/components/StatsView.test.tsx
git commit -m "feat: show undefined variable usage count in Statistics tab"
```

---

### Task 5: Editor squiggle marker

**Files:**
- Modify: `src/components/EditorView.tsx`

**Interfaces:**
- Consumes (from Task 1): `buildKnownIdentifierSet`, `extractUndefinedVariableReferences` from `@/lib/renpyIdentifiers`.
- Produces: Monaco markers under the `'renpy-undefined-vars'` owner id, visible as squiggles + in Monaco's Problems panel, alongside the existing `'renpy-jumps'` and `'renpy-syntax'` marker sets.

There is no existing `EditorView.test.tsx` (Monaco isn't unit-tested in this codebase — confirmed no such file exists). Verification for this task is manual, via the dev server, per Step 3 below.

- [ ] **Step 1: Add the import**

In `src/components/EditorView.tsx`, add near the other `@/lib/...` imports:

```typescript
import { buildKnownIdentifierSet, extractUndefinedVariableReferences } from '@/lib/renpyIdentifiers';
```

- [ ] **Step 2: Add the marker effect**

Add a new `useEffect` immediately after the existing `renpy-jumps` marker effect (`EditorView.tsx:1053-1087`), mirroring its structure but computing from live editor content (matching the pattern used by the decorations effect at `EditorView.tsx:1089-1289`, which also recomputes from `model.getValue()` rather than from stale analysis-result positions):

```typescript
  useEffect(() => {
      if (!isMounted || !editorRef.current || !monacoRef.current) return;

      const monacoInstance = monacoRef.current;
      const model = editorRef.current.getModel();
      if (!model) return;

      const knownIdentifiers = buildKnownIdentifierSet(analysisResult);
      const refs = extractUndefinedVariableReferences(model.getValue(), knownIdentifiers);

      const markers: monaco.editor.IMarkerData[] = refs.map(ref => ({
          startLineNumber: ref.line,
          startColumn: ref.columnStart + 1,
          endLineNumber: ref.line,
          endColumn: ref.columnEnd + 1,
          message: `Variable "${ref.name}" is used but never defined.`,
          severity: monacoInstance.MarkerSeverity.Warning,
      }));

      monacoInstance.editor.setModelMarkers(model, 'renpy-undefined-vars', markers);
  }, [analysisResult, block.id, isMounted, block.content]);
```

- [ ] **Step 3: Manually verify in the running app**

Run: `npm run electron:start`

1. Open any `.rpy` file in the editor.
2. Add a line `"Hello [totally_undefined_var]!"` inside a label.
3. Confirm a yellow/warning squiggle appears under `totally_undefined_var` and hovering shows the message `Variable "totally_undefined_var" is used but never defined.`
4. Open the Diagnostics tab and confirm a matching "Undefined Variable" entry appears and clicking it navigates to the line.
5. Open the Statistics tab and confirm the new "Undefined Variable Usages" count reflects it.
6. Add `default totally_undefined_var = True` elsewhere in the project, save, and confirm the squiggle, Diagnostics entry, and Stats count all clear once analysis re-runs (~500ms debounce).
7. Add `if some_flag:` with `some_flag` undefined and confirm the same three surfaces flag it.

- [ ] **Step 4: Run the full test suite to confirm no regressions**

Run: `npm test`
Expected: PASS — all suites green, matching the baseline before this plan (no worker/type changes were made, so this is a smoke check, not a place bugs are expected).

- [ ] **Step 5: Commit**

```bash
git add src/components/EditorView.tsx
git commit -m "feat: underline used-but-undefined variables in the code editor"
```

---

### Task 6: Close out the bead

**Files:** none (bead tracker only)

- [ ] **Step 1: Run lint and the full test suite one more time**

Run: `npm run lint:fix && npm test`
Expected: 0 lint errors, all tests passing.

- [ ] **Step 2: Update and close the bead**

```bash
bd update bmf-vangard-renpy-ide-141b --notes="Implemented via src/lib/renpyIdentifiers.ts (shared extraction) + useDiagnostics Source 14 + EditorView renpy-undefined-vars marker + StatsView undefined-variable-usages stat. Scope: [interpolation] references and if/elif/while bare-identifier conditions only (not general Python-expression scanning)."
bd close bmf-vangard-renpy-ide-141b --reason="Editor squiggle, Diagnostics entry, and Stats count all ship for used-but-undefined variables"
```

- [ ] **Step 3: Push**

```bash
git pull --rebase
git push
git status  # MUST show "up to date with origin"
```

---

## Self-Review Notes

- **Spec coverage:** Acceptance criteria required (a) an editor indicator — Task 5; (b) a Diagnostics tab entry — Task 2/3; (c) Statistics tab reflecting undefined-variable usages — Task 4. All three covered.
- **Scope boundary:** Deliberately does not attempt full Python-expression parsing (e.g. bare identifiers inside `$ x = y + 1` on the right-hand side, or inside screen-language Python blocks) — only `[interpolation]` and `if/elif/while` conditions, the two highest-value/lowest-false-positive-risk contexts. This matches the codebase's existing line-regex analysis style (no AST) and keeps the false-positive rate low. If broader coverage is wanted later, file a follow-up bead rather than expanding this plan's scope.
- **Type consistency:** `UndefinedVariableRef` (Task 1) is the one shape threaded through Tasks 2, 4, and 5 — `.name`/`.line`/`.columnStart`/`.columnEnd` field names are used identically in all three call sites above.
