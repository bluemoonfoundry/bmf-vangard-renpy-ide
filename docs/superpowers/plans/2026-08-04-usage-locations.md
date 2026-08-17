# Usage Locations: Character & Variable Coverage Tables — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add canvas-independent ways to see where a character's dialogue and a
variable are referenced: a "Usage Locations" table in the Character tab, and a
new "Variable Coverage" section in StatsView.

**Architecture:** A shared pure helper (`src/lib/usageLocations.ts`) resolves raw
`{blockId, line}` occurrences into grouped `{file, label, count}` rows using data
already produced by the analysis pipeline (`LabelNode[]`, `Block[]`). Both UI
surfaces consume this helper and use the existing `onOpenEditor(blockId, line)`
callback to jump straight into Monaco — no new IPC, no canvas involvement.

**Tech Stack:** React + TypeScript, Tailwind CSS, Vitest + Testing Library.

## Global Constraints

- Use the `@/` path alias for all imports (never relative `../`), per `CLAUDE.md`.
- `src/types.ts` is the single source of truth for data shapes — add no new
  ad-hoc interfaces there; `UsageLocationGroup` lives in `src/lib/usageLocations.ts`.
- Dark mode via Tailwind's `class` strategy — every new element needs a
  `dark:` variant matching its light-mode counterpart, consistent with
  surrounding code in the files being edited.
- Test files match `**/*.test.{ts,tsx}` and use `src/test/mocks/sampleData.ts`
  factories instead of constructing raw objects.
- Out of scope: do not modify `findUsagesHighlightIds`, the magnifying-glass
  canvas-highlight behavior, or `handleFindUsages` in `App.tsx`. This plan adds
  a second, independent way to find usages; it does not touch the first.

---

### Task 1: Shared usage-location resolver

**Files:**
- Create: `src/lib/usageLocations.ts`
- Test: `src/lib/usageLocations.test.ts`

**Interfaces:**
- Consumes: `Block` (`id`, `filePath`), `LabelNode` (`blockId`, `label`, `startLine`) from `@/types`.
- Produces:
  ```ts
  export interface UsageLocationGroup {
    blockId: string;
    filePath: string;
    fileName: string;
    label: string | null;
    firstLine: number;
    count: number;
  }
  export function findLabelForLine(blockId: string, line: number, labelNodes: LabelNode[]): LabelNode | undefined;
  export function groupUsageLocations(occurrences: { blockId: string; line: number }[], blocks: Block[], labelNodes: LabelNode[]): UsageLocationGroup[];
  ```
  Task 2 (CharacterEditorView) and Task 4 (StatsView) both import `groupUsageLocations` and the `UsageLocationGroup` type from `@/lib/usageLocations`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/usageLocations.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { findLabelForLine, groupUsageLocations } from '@/lib/usageLocations';
import { createBlock, createLabelNode } from '@/test/mocks/sampleData';

describe('findLabelForLine', () => {
  it('returns the label whose startLine is at or before the given line', () => {
    const labelNodes = [
      createLabelNode({ id: 'block-1:start', label: 'start', blockId: 'block-1', startLine: 1 }),
      createLabelNode({ id: 'block-1:chapter1', label: 'chapter1', blockId: 'block-1', startLine: 10 }),
    ];
    expect(findLabelForLine('block-1', 5, labelNodes)?.label).toBe('start');
    expect(findLabelForLine('block-1', 12, labelNodes)?.label).toBe('chapter1');
  });

  it('returns undefined when the line is before any label in the block', () => {
    const labelNodes = [createLabelNode({ blockId: 'block-1', startLine: 10 })];
    expect(findLabelForLine('block-1', 5, labelNodes)).toBeUndefined();
  });

  it('ignores labels from other blocks', () => {
    const labelNodes = [createLabelNode({ id: 'block-2:start', label: 'start', blockId: 'block-2', startLine: 1 })];
    expect(findLabelForLine('block-1', 5, labelNodes)).toBeUndefined();
  });
});

describe('groupUsageLocations', () => {
  it('groups multiple occurrences in the same file/label into one row with a count', () => {
    const blocks = [createBlock({ id: 'block-1', filePath: 'game/script.rpy' })];
    const labelNodes = [createLabelNode({ blockId: 'block-1', label: 'start', startLine: 1 })];
    const occurrences = [
      { blockId: 'block-1', line: 2 },
      { blockId: 'block-1', line: 4 },
    ];
    const result = groupUsageLocations(occurrences, blocks, labelNodes);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ fileName: 'script.rpy', label: 'start', firstLine: 2, count: 2 });
  });

  it('assigns label: null for occurrences before the first label', () => {
    const blocks = [createBlock({ id: 'block-1', filePath: 'game/script.rpy' })];
    const labelNodes = [createLabelNode({ blockId: 'block-1', label: 'start', startLine: 10 })];
    const result = groupUsageLocations([{ blockId: 'block-1', line: 2 }], blocks, labelNodes);
    expect(result[0].label).toBeNull();
  });

  it('skips occurrences referencing a block that no longer exists', () => {
    const blocks = [createBlock({ id: 'block-1' })];
    const result = groupUsageLocations([{ blockId: 'stale-block', line: 1 }], blocks, []);
    expect(result).toHaveLength(0);
  });

  it('sorts groups by file name then label', () => {
    const blocks = [
      createBlock({ id: 'block-1', filePath: 'game/b.rpy' }),
      createBlock({ id: 'block-2', filePath: 'game/a.rpy' }),
    ];
    const labelNodes = [
      createLabelNode({ id: 'block-1:z', blockId: 'block-1', label: 'z', startLine: 1 }),
      createLabelNode({ id: 'block-2:a', blockId: 'block-2', label: 'a', startLine: 1 }),
    ];
    const occurrences = [
      { blockId: 'block-1', line: 2 },
      { blockId: 'block-2', line: 2 },
    ];
    const result = groupUsageLocations(occurrences, blocks, labelNodes);
    expect(result.map(r => r.fileName)).toEqual(['a.rpy', 'b.rpy']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/usageLocations.test.ts`
Expected: FAIL — `Cannot find module '@/lib/usageLocations'` (file doesn't exist yet).

- [ ] **Step 3: Write the implementation**

Create `src/lib/usageLocations.ts`:

```ts
/**
 * @file lib/usageLocations.ts
 * @description Resolves raw {blockId, line} occurrences (dialogue lines, variable
 * usages) into grouped, human-readable locations: which file, which label, how
 * many times. Backs CharacterEditorView's usage table and StatsView's Variable
 * Coverage section — both surface "where is this used" independent of the
 * canvas find-usages highlight.
 */
import type { Block, LabelNode } from '@/types';

export interface UsageLocationGroup {
  blockId: string;
  filePath: string;
  fileName: string;
  label: string | null;
  firstLine: number;
  count: number;
}

export function findLabelForLine(
  blockId: string,
  line: number,
  labelNodes: LabelNode[],
): LabelNode | undefined {
  const labelsInBlock = labelNodes
    .filter(n => n.blockId === blockId)
    .sort((a, b) => a.startLine - b.startLine);
  return labelsInBlock.slice().reverse().find(l => l.startLine <= line);
}

export function groupUsageLocations(
  occurrences: { blockId: string; line: number }[],
  blocks: Block[],
  labelNodes: LabelNode[],
): UsageLocationGroup[] {
  const groups = new Map<string, UsageLocationGroup>();

  for (const occ of occurrences) {
    const block = blocks.find(b => b.id === occ.blockId);
    if (!block) continue;

    const label = findLabelForLine(occ.blockId, occ.line, labelNodes)?.label ?? null;
    const key = `${occ.blockId}:${label ?? ''}`;
    const filePath = block.filePath ?? occ.blockId;
    const fileName = filePath.split(/[/\\]/).pop() ?? filePath;

    const existing = groups.get(key);
    if (existing) {
      existing.count += 1;
      if (occ.line < existing.firstLine) existing.firstLine = occ.line;
    } else {
      groups.set(key, { blockId: occ.blockId, filePath, fileName, label, firstLine: occ.line, count: 1 });
    }
  }

  return Array.from(groups.values()).sort((a, b) => {
    const fileCompare = a.fileName.localeCompare(b.fileName);
    if (fileCompare !== 0) return fileCompare;
    return (a.label ?? '').localeCompare(b.label ?? '');
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/usageLocations.test.ts`
Expected: PASS — all 7 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/usageLocations.ts src/lib/usageLocations.test.ts
git commit -m "feat: add shared usage-location grouping helper"
```

---

### Task 2: Character tab — Usage Locations table

**Files:**
- Modify: `src/components/CharacterEditorView.tsx`
- Modify: `src/components/CharacterEditorView.test.tsx`

**Interfaces:**
- Consumes: `groupUsageLocations`, `UsageLocationGroup` from `@/lib/usageLocations` (Task 1); `RenpyAnalysisResult`, `Block` from `@/types`.
- Produces: `CharacterEditorView` now requires three new props —
  `analysisResult: RenpyAnalysisResult`, `blocks: Block[]`,
  `onOpenEditor: (blockId: string, line?: number) => void`. Task 3 wires these
  from `useTabContentRenderer.tsx`.

- [ ] **Step 1: Write the failing tests**

Replace the full contents of `src/components/CharacterEditorView.test.tsx` with:

```tsx
/**
 * @file CharacterEditorView.test.tsx
 * @description Tests for CharacterEditorView's initialTag/initialName prefill behavior
 * and its Usage Locations table.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CharacterEditorView from '@/components/CharacterEditorView';
import { createEmptyAnalysisResult, createBlock, createCharacter, createLabelNode } from '@/test/mocks/sampleData';

describe('CharacterEditorView — initialTag/initialName prefill', () => {
  it('pre-fills tag and name from initialTag/initialName when character is undefined', () => {
    render(
      <CharacterEditorView
        character={undefined}
        onSave={vi.fn()}
        existingTags={[]}
        projectImages={[]}
        imageMetadata={new Map()}
        initialTag="captain_rex"
        initialName="Captain Rex"
        analysisResult={createEmptyAnalysisResult()}
        blocks={[]}
        onOpenEditor={vi.fn()}
      />
    );
    expect((screen.getByLabelText(/tag/i) as HTMLInputElement).value).toBe('captain_rex');
    expect((screen.getByLabelText(/name/i) as HTMLInputElement).value).toBe('Captain Rex');
  });

  it('leaves tag/name blank when neither character nor initial props are given (existing + Add flow)', () => {
    render(
      <CharacterEditorView
        character={undefined}
        onSave={vi.fn()}
        existingTags={[]}
        projectImages={[]}
        imageMetadata={new Map()}
        analysisResult={createEmptyAnalysisResult()}
        blocks={[]}
        onOpenEditor={vi.fn()}
      />
    );
    expect((screen.getByLabelText(/tag/i) as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText(/name/i) as HTMLInputElement).value).toBe('');
  });
});

describe('CharacterEditorView — Usage Locations', () => {
  const eileen = createCharacter({ tag: 'e', name: 'Eileen' });

  it('renders a usage row grouped by file and label', () => {
    const block = createBlock({ id: 'block-1', filePath: 'game/script.rpy' });
    const analysisResult = createEmptyAnalysisResult({
      dialogueLines: new Map([['block-1', [{ line: 2, tag: 'e' }, { line: 4, tag: 'e' }]]]),
      labelNodes: [createLabelNode({ blockId: 'block-1', label: 'start', startLine: 1 })],
    });

    render(
      <CharacterEditorView
        character={eileen}
        onSave={vi.fn()}
        existingTags={['e']}
        projectImages={[]}
        imageMetadata={new Map()}
        analysisResult={analysisResult}
        blocks={[block]}
        onOpenEditor={vi.fn()}
      />
    );

    expect(screen.getByText('Usage Locations')).toBeInTheDocument();
    expect(screen.getByText('script.rpy')).toBeInTheDocument();
    expect(screen.getByText('start')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Lines count column
  });

  it('shows an empty state when the character has no dialogue lines', () => {
    render(
      <CharacterEditorView
        character={eileen}
        onSave={vi.fn()}
        existingTags={['e']}
        projectImages={[]}
        imageMetadata={new Map()}
        analysisResult={createEmptyAnalysisResult()}
        blocks={[]}
        onOpenEditor={vi.fn()}
      />
    );

    expect(screen.getByText('No dialogue found for this character yet.')).toBeInTheDocument();
  });

  it('calls onOpenEditor with the block id and first occurrence line when a row is clicked', () => {
    const block = createBlock({ id: 'block-1', filePath: 'game/script.rpy' });
    const analysisResult = createEmptyAnalysisResult({
      dialogueLines: new Map([['block-1', [{ line: 2, tag: 'e' }]]]),
      labelNodes: [createLabelNode({ blockId: 'block-1', label: 'start', startLine: 1 })],
    });
    const onOpenEditor = vi.fn();

    render(
      <CharacterEditorView
        character={eileen}
        onSave={vi.fn()}
        existingTags={['e']}
        projectImages={[]}
        imageMetadata={new Map()}
        analysisResult={analysisResult}
        blocks={[block]}
        onOpenEditor={onOpenEditor}
      />
    );

    fireEvent.click(screen.getByText('script.rpy'));
    expect(onOpenEditor).toHaveBeenCalledWith('block-1', 2);
  });

  it('does not render a Usage Locations section for a new (unsaved) character', () => {
    render(
      <CharacterEditorView
        character={undefined}
        onSave={vi.fn()}
        existingTags={[]}
        projectImages={[]}
        imageMetadata={new Map()}
        analysisResult={createEmptyAnalysisResult()}
        blocks={[]}
        onOpenEditor={vi.fn()}
      />
    );

    expect(screen.queryByText('Usage Locations')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify the new ones fail**

Run: `npx vitest run src/components/CharacterEditorView.test.tsx`
Expected: the two prefill tests still PASS (extra props are simply unused by
the current component); the five new "Usage Locations" tests FAIL because
`CharacterEditorView` doesn't render that section yet.

- [ ] **Step 3: Implement the Usage Locations section**

In `src/components/CharacterEditorView.tsx`:

1. Update the type import (currently `import type { Character, ProjectImage, ImageMetadata } from '@/types';`) to:

```ts
import type { Character, ProjectImage, ImageMetadata, RenpyAnalysisResult, Block } from '@/types';
import { groupUsageLocations } from '@/lib/usageLocations';
```

2. Add three props to `CharacterEditorViewProps`:

```ts
interface CharacterEditorViewProps {
  character?: Character;
  onSave: (char: Character, oldTag?: string) => void;
  existingTags: string[];
  projectImages: ProjectImage[];
  imageMetadata: Map<string, ImageMetadata>;
  initialTag?: string;
  initialName?: string;
  analysisResult: RenpyAnalysisResult;
  blocks: Block[];
  onOpenEditor: (blockId: string, line?: number) => void;
}
```

3. Destructure the new props in the component signature:

```ts
const CharacterEditorView: React.FC<CharacterEditorViewProps> = ({ character, onSave, existingTags, projectImages, imageMetadata, initialTag, initialName, analysisResult, blocks, onOpenEditor }) => {
```

4. Add the computed usage-locations list, alongside the other `useMemo` (near `imageOptions`):

```ts
    const usageLocations = useMemo(() => {
        if (!character) return [];
        const occurrences: { blockId: string; line: number }[] = [];
        analysisResult.dialogueLines.forEach((dialogues, blockId) => {
            dialogues.forEach(d => {
                if (d.tag === character.tag) occurrences.push({ blockId, line: d.line });
            });
        });
        return groupUsageLocations(occurrences, blocks, analysisResult.labelNodes);
    }, [character, analysisResult.dialogueLines, analysisResult.labelNodes, blocks]);
```

5. In the JSX, in the right column (`{/* Right Column — Advanced Properties (collapsible) */}`), insert a new section right after the `{advancedExpanded && (...)}` block closes and before the column's closing `</div>`:

```tsx
                    {/* Usage Locations */}
                    {character && (
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold border-b pb-2 border-gray-300 dark:border-gray-700">Usage Locations</h3>
                            {usageLocations.length === 0 ? (
                                <p className="text-sm text-gray-400 dark:text-gray-500">No dialogue found for this character yet.</p>
                            ) : (
                                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs">
                                                <th className="px-3 py-2 text-left font-semibold">File</th>
                                                <th className="px-3 py-2 text-left font-semibold">Label</th>
                                                <th className="px-3 py-2 text-right font-semibold w-16">Lines</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {usageLocations.map((loc, i) => (
                                                <tr
                                                    key={`${loc.blockId}:${loc.label ?? ''}`}
                                                    className={`border-b border-gray-100 dark:border-gray-800 last:border-0 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950/30 ${i % 2 === 1 ? 'bg-gray-50/50 dark:bg-gray-800/30' : ''}`}
                                                    onClick={() => onOpenEditor(loc.blockId, loc.firstLine)}
                                                    title="Open in editor"
                                                >
                                                    <td className="px-3 py-2 text-xs text-gray-700 dark:text-gray-300 truncate max-w-[160px]" title={loc.filePath}>{loc.fileName}</td>
                                                    <td className="px-3 py-2 font-mono text-xs text-gray-700 dark:text-gray-300">{loc.label ?? '—'}</td>
                                                    <td className="px-3 py-2 text-right tabular-nums text-xs text-gray-500 dark:text-gray-400">{loc.count}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/CharacterEditorView.test.tsx`
Expected: all 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/CharacterEditorView.tsx src/components/CharacterEditorView.test.tsx
git commit -m "feat: add Usage Locations table to the Character tab"
```

---

### Task 3: Wire the new props through useTabContentRenderer

**Files:**
- Modify: `src/hooks/useTabContentRenderer.tsx:483-488`

**Interfaces:**
- Consumes: `analysisResultWithProfiles: RenpyAnalysisResult`, `blocks: Block[]`,
  `handleOpenEditor: (blockId: string, line?: number) => void` — all three are
  already destructured at the top of `useTabContentRenderer` (lines 232, 235, 257
  respectively); no new hook params are needed.
- Produces: `CharacterEditorView` receives fully live data instead of failing to
  compile against Task 2's new required props.

- [ ] **Step 1: Update the render call**

In `src/hooks/useTabContentRenderer.tsx`, the existing block:

```tsx
      return <CharacterEditorView character={char} onSave={handleUpdateCharacter}
        existingTags={characterTagsArray}
        projectImages={imagesArray} imageMetadata={imageMetadata}
        initialTag={char ? undefined : tab.initialCharacterTag}
        initialName={char ? undefined : tab.initialCharacterName}
      />;
```

becomes:

```tsx
      return <CharacterEditorView character={char} onSave={handleUpdateCharacter}
        existingTags={characterTagsArray}
        projectImages={imagesArray} imageMetadata={imageMetadata}
        initialTag={char ? undefined : tab.initialCharacterTag}
        initialName={char ? undefined : tab.initialCharacterName}
        analysisResult={analysisResultWithProfiles}
        blocks={blocks}
        onOpenEditor={handleOpenEditor}
      />;
```

- [ ] **Step 2: Type-check the project**

Run: `npx tsc --noEmit`
Expected: no new errors. (This confirms Task 2's now-required props are
satisfied everywhere `CharacterEditorView` is instantiated — `App.tsx` renders
it only through this one call site.)

- [ ] **Step 3: Run the full test suite**

Run: `npx vitest run`
Expected: all tests PASS (no existing suite constructs `<CharacterEditorView>`
directly except `CharacterEditorView.test.tsx`, already updated in Task 2).

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useTabContentRenderer.tsx
git commit -m "feat: pass analysis result and open-editor callback into CharacterEditorView"
```

---

### Task 4: Variable Coverage section in StatsView

**Files:**
- Modify: `src/components/StatsView.tsx`
- Modify: `src/components/StatsView.test.tsx`

**Interfaces:**
- Consumes: `groupUsageLocations`, `UsageLocationGroup` from `@/lib/usageLocations`
  (Task 1); existing destructured `variables: Map<string, Variable>`,
  `variableUsages: Map<string, VariableUsage[]>` (from `analysisResult`),
  `labelNodes: LabelNode[]` (from `routeAnalysisResult`), `blocks: Block[]`, and
  the existing optional `onOpenEditor?: (blockId: string, line?: number) => void`
  prop — all already present in `StatsView`, no prop-surface changes.
- Produces: a new `<section>` with heading text `"Variable Coverage"`, rendered
  only when at least one variable exists.

- [ ] **Step 1: Write the failing tests**

Add to `src/components/StatsView.test.tsx`. First, extend the import line:

```ts
import { createBlock, createCharacter, createEmptyAnalysisResult, createVariable, createLabelNode } from '@/test/mocks/sampleData';
```

and the render-helper import:

```ts
import { render, screen, act, fireEvent, within } from '@testing-library/react';
```

Then add this block right before the final closing `});` of the `describe('StatsView', ...)` block:

```tsx
  // ── Variable Coverage ────────────────────────────────────────────────────────

  describe('Variable Coverage', () => {
    function coverageSection() {
      return screen.getByText('Variable Coverage').closest('section') as HTMLElement;
    }

    it('renders a referenced row with its file/label location', () => {
      const block = createBlock({ id: 'block-1', filePath: 'game/script.rpy' });
      const analysisResult = createEmptyAnalysisResult({
        variables: new Map([['coverage_var', createVariable({ name: 'coverage_var' })]]),
        variableUsages: new Map([['coverage_var', [{ blockId: 'block-1', line: 2 }]]]),
        labelNodes: [createLabelNode({ blockId: 'block-1', label: 'start', startLine: 1 })],
      });
      renderStats({ blocks: [block], analysisResult });

      const section = within(coverageSection());
      expect(section.getByText('coverage_var')).toBeInTheDocument();
      expect(section.getByText('Referenced')).toBeInTheDocument();
    });

    it('marks a variable with no usages as Unreferenced', () => {
      const analysisResult = createEmptyAnalysisResult({
        variables: new Map([['unused_var', createVariable({ name: 'unused_var' })]]),
      });
      renderStats({ analysisResult });

      const section = within(coverageSection());
      expect(section.getByText('unused_var')).toBeInTheDocument();
      expect(section.getByText('Unreferenced')).toBeInTheDocument();
    });

    it('expands a row to show its locations and calls onOpenEditor when a location is clicked', () => {
      const block = createBlock({ id: 'block-1', filePath: 'game/script.rpy' });
      const analysisResult = createEmptyAnalysisResult({
        variables: new Map([['coverage_var', createVariable({ name: 'coverage_var' })]]),
        variableUsages: new Map([['coverage_var', [{ blockId: 'block-1', line: 2 }]]]),
        labelNodes: [createLabelNode({ blockId: 'block-1', label: 'start', startLine: 1 })],
      });
      const onOpenEditor = vi.fn();
      renderStats({ blocks: [block], analysisResult, onOpenEditor });

      const section = within(coverageSection());
      fireEvent.click(section.getByText('coverage_var'));
      expect(section.getByText('script.rpy')).toBeInTheDocument();

      fireEvent.click(section.getByText('script.rpy'));
      expect(onOpenEditor).toHaveBeenCalledWith('block-1', 2);
    });

    it('filters to only unreferenced variables when that status pill is clicked', () => {
      const analysisResult = createEmptyAnalysisResult({
        variables: new Map([
          ['used_var', createVariable({ name: 'used_var' })],
          ['unused_var', createVariable({ name: 'unused_var' })],
        ]),
        variableUsages: new Map([['used_var', [{ blockId: 'block-1', line: 2 }]]]),
      });
      renderStats({ analysisResult });

      const section = within(coverageSection());
      fireEvent.click(section.getByRole('button', { name: 'unreferenced' }));
      expect(section.getByText('unused_var')).toBeInTheDocument();
      expect(section.queryByText('used_var')).not.toBeInTheDocument();
    });

    it('does not render the section when there are no variables', () => {
      renderStats();
      expect(screen.queryByText('Variable Coverage')).not.toBeInTheDocument();
    });
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/StatsView.test.tsx`
Expected: the 5 new tests FAIL — `screen.getByText('Variable Coverage')` throws
because the section doesn't exist yet. All pre-existing tests still PASS.

- [ ] **Step 3: Implement the Variable Coverage section**

In `src/components/StatsView.tsx`:

1. Add the import (alongside the existing `@/lib/renpyIdentifiers` import):

```ts
import { groupUsageLocations, type UsageLocationGroup } from '@/lib/usageLocations';
```

2. Add new filter/sort types near the existing `Coverage*` types (after `type CoverageSortDir = 'asc' | 'desc';`):

```ts
type VariableCoverageStatusFilter = 'all' | 'referenced' | 'unreferenced';
type VariableCoverageSortKey = 'name' | 'status';
type VariableCoverageSortDir = 'asc' | 'desc';

interface VariableCoverageRow {
  name: string;
  type: string;
  status: 'referenced' | 'unreferenced';
  locations: UsageLocationGroup[];
}
```

3. Add new state, alongside the existing coverage state declarations:

```ts
  const [varCoverageStatusFilter, setVarCoverageStatusFilter] = useState<VariableCoverageStatusFilter>('all');
  const [varCoverageTextFilter, setVarCoverageTextFilter] = useState('');
  const [varCoverageSortKey, setVarCoverageSortKey] = useState<VariableCoverageSortKey>('name');
  const [varCoverageSortDir, setVarCoverageSortDir] = useState<VariableCoverageSortDir>('asc');
  const [expandedVarNames, setExpandedVarNames] = useState<Set<string>>(new Set());
```

4. Add the computation, right after `topVariables` (which already exists at line ~462-469):

```ts
  const variableCoverageRows = useMemo(() => {
    const rows: VariableCoverageRow[] = [];
    variables.forEach((v, name) => {
      const usages = variableUsages.get(name) ?? [];
      const locations = groupUsageLocations(usages, blocks, labelNodes);
      rows.push({ name, type: v.type, status: usages.length > 0 ? 'referenced' : 'unreferenced', locations });
    });
    return rows;
  }, [variables, variableUsages, blocks, labelNodes]);

  const filteredVariableCoverageRows = useMemo(() => {
    let list = variableCoverageRows;
    if (varCoverageStatusFilter !== 'all') list = list.filter(r => r.status === varCoverageStatusFilter);
    if (varCoverageTextFilter) {
      const lower = varCoverageTextFilter.toLowerCase();
      list = list.filter(r => r.name.toLowerCase().includes(lower));
    }
    return [...list].sort((a, b) => {
      const mul = varCoverageSortDir === 'asc' ? 1 : -1;
      if (varCoverageSortKey === 'name') return mul * a.name.localeCompare(b.name);
      const statusOrder = { referenced: 0, unreferenced: 1 };
      return mul * (statusOrder[a.status] - statusOrder[b.status]);
    });
  }, [variableCoverageRows, varCoverageStatusFilter, varCoverageTextFilter, varCoverageSortKey, varCoverageSortDir]);

  function toggleVarCoverageSort(key: VariableCoverageSortKey) {
    if (varCoverageSortKey === key) setVarCoverageSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setVarCoverageSortKey(key); setVarCoverageSortDir('asc'); }
  }

  function toggleVarExpanded(name: string) {
    setExpandedVarNames(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  }
```

5. In the JSX, insert a new section right after Asset Coverage's closing `</section>` (the one immediately followed by `{performanceMetrics && (`):

```tsx
      {/* Variable Coverage */}
      {variableCoverageRows.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Variable Coverage</h2>

          {/* Coverage bar */}
          {(() => {
            const total = variableCoverageRows.length;
            const referenced = variableCoverageRows.filter(r => r.status === 'referenced').length;
            const unreferenced = total - referenced;
            const pct = total > 0 ? Math.round((referenced / total) * 100) : 0;
            return (
              <div className="bg-secondary rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-primary">Variables</span>
                  <span className="text-xs text-secondary tabular-nums">{referenced}/{total} referenced ({pct}%)</span>
                </div>
                <div className="h-2 bg-tertiary rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center gap-3 text-xs text-secondary">
                  {unreferenced > 0 ? (
                    <span className="text-gray-400">{unreferenced} unreferenced</span>
                  ) : (
                    <span className="text-green-500">All variables referenced</span>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="flex rounded-md border border-primary overflow-hidden text-xs flex-none">
              {(['all', 'referenced', 'unreferenced'] as VariableCoverageStatusFilter[]).map(s => (
                <button
                  key={s}
                  onClick={() => setVarCoverageStatusFilter(s)}
                  className={`px-2.5 py-1 capitalize border-r border-primary last:border-0 transition-colors ${varCoverageStatusFilter === s ? 'bg-indigo-500 text-white' : 'bg-secondary text-secondary hover:bg-tertiary'}`}
                >
                  {s === 'all' ? 'All Status' : s}
                </button>
              ))}
            </div>
            <div className="relative flex-1 min-w-[140px]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Filter variables…"
                value={varCoverageTextFilter}
                onChange={e => setVarCoverageTextFilter(e.target.value)}
                className="w-full pl-7 pr-2 py-1 text-xs bg-secondary border border-primary rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-primary placeholder:text-secondary"
              />
            </div>
            <span className="text-xs text-secondary flex-none">{filteredVariableCoverageRows.length} variable{filteredVariableCoverageRows.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Coverage table */}
          <div className="overflow-x-auto rounded-lg border border-primary">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-tertiary border-b border-primary text-secondary text-xs">
                  <th className="px-3 py-2 text-left font-semibold cursor-pointer select-none" onClick={() => toggleVarCoverageSort('name')}>
                    Variable {varCoverageSortKey === 'name' ? (varCoverageSortDir === 'asc' ? '↑' : '↓') : <span className="opacity-40">↕</span>}
                  </th>
                  <th className="px-3 py-2 text-left font-semibold w-24">Type</th>
                  <th className="px-3 py-2 text-left font-semibold cursor-pointer select-none w-36" onClick={() => toggleVarCoverageSort('status')}>
                    Status {varCoverageSortKey === 'status' ? (varCoverageSortDir === 'asc' ? '↑' : '↓') : <span className="opacity-40">↕</span>}
                  </th>
                  <th className="px-3 py-2 text-left font-semibold w-28">Locations</th>
                </tr>
              </thead>
              <tbody>
                {filteredVariableCoverageRows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-secondary text-xs">No variables match the current filter</td>
                  </tr>
                )}
                {filteredVariableCoverageRows.map((row, i) => (
                  <React.Fragment key={row.name}>
                    <tr
                      className={`border-b border-primary last:border-0 ${i % 2 === 1 ? 'bg-secondary/20' : ''} ${row.locations.length > 0 ? 'cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950/30' : ''}`}
                      onClick={row.locations.length > 0 ? () => toggleVarExpanded(row.name) : undefined}
                    >
                      <td className="px-3 py-2 font-mono text-xs text-primary truncate max-w-xs">{row.name}</td>
                      <td className="px-3 py-2 text-xs text-secondary capitalize">{row.type}</td>
                      <td className="px-3 py-2">
                        {row.status === 'referenced' ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            Referenced
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                            Unreferenced
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs text-secondary">
                        {row.locations.length > 0 ? (
                          <span className="inline-flex items-center gap-1">
                            {row.locations.length} location{row.locations.length !== 1 ? 's' : ''}
                            <svg className={`w-3 h-3 transition-transform ${expandedVarNames.has(row.name) ? '' : '-rotate-90'}`} viewBox="0 0 12 12" fill="none">
                              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        ) : '—'}
                      </td>
                    </tr>
                    {expandedVarNames.has(row.name) && row.locations.length > 0 && (
                      <tr className="border-b border-primary last:border-0 bg-tertiary/40">
                        <td colSpan={4} className="px-3 py-2">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-secondary">
                                <th className="text-left font-semibold pb-1">File</th>
                                <th className="text-left font-semibold pb-1">Label</th>
                                <th className="text-right font-semibold pb-1 w-16">Lines</th>
                              </tr>
                            </thead>
                            <tbody>
                              {row.locations.map(loc => (
                                <tr
                                  key={`${loc.blockId}:${loc.label ?? ''}`}
                                  className={onOpenEditor ? 'cursor-pointer hover:text-indigo-500' : ''}
                                  onClick={onOpenEditor ? (e) => { e.stopPropagation(); onOpenEditor(loc.blockId, loc.firstLine); } : undefined}
                                >
                                  <td className="py-1 text-primary truncate max-w-[200px]" title={loc.filePath}>{loc.fileName}</td>
                                  <td className="py-1 font-mono text-primary">{loc.label ?? '—'}</td>
                                  <td className="py-1 text-right tabular-nums text-secondary">{loc.count}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/StatsView.test.tsx`
Expected: all tests PASS, including the 5 new Variable Coverage tests and every
pre-existing StatsView test (unaffected — Variable Coverage is a new, separate
section).

- [ ] **Step 5: Type-check and run the full suite**

Run: `npx tsc --noEmit && npx vitest run`
Expected: no type errors; full test suite green.

- [ ] **Step 6: Commit**

```bash
git add src/components/StatsView.tsx src/components/StatsView.test.tsx
git commit -m "feat: add Variable Coverage section to StatsView"
```

---

## Plan Self-Review Notes

- **Spec coverage:** Shared helper (spec §"Shared helper") → Task 1. Character
  tab table (spec §"Character tab") → Task 2 + Task 3 (wiring). Variable
  Coverage (spec §"Variable Coverage") → Task 4. Testing section of the spec →
  covered by the test steps in Tasks 1, 2, 4 (Task 3 has no new logic to unit
  test, only wiring, verified via `tsc` + full suite run).
- **Type consistency:** `UsageLocationGroup`, `findLabelForLine`, and
  `groupUsageLocations` are defined once in Task 1 and referenced with the same
  names/signatures in Tasks 2 and 4. `onOpenEditor(blockId: string, line?: number)`
  matches the existing `handleOpenEditor` signature used throughout the codebase
  (`useTabOpeners.ts`, `RouteCanvas.tsx`, etc.) — no new signature invented.
- **No placeholders:** every step above contains full, runnable code — no TODOs
  or "handle this later" markers.
