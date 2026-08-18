# Plan: Address GitHub Issue #205 — AST Support Roadmap

## Context

GitHub issue #205 ("Future consideration: AST parser vs regex-based analysis") proposes evaluating when/whether to transition Vangard Studio's code analysis from regex patterns to Abstract Syntax Tree (AST) parsing.

**Current state**: Analysis engine (`src/hooks/useRenpyAnalysis.ts`, 869 LOC) uses ~10 regex patterns to extract labels, jumps, characters, variables, screens, menus. Works via Web Worker with content-hash caching. Known workarounds:
- Triple-quote string masking (`src/lib/renpyTripleQuotes.ts`)
- Manual paren/quote balancing for character args
- Indent-based scope tracking for menu choices
- String sanitization to prevent false matches

**Issue #205 argument**: AST parsing would eliminate workarounds and enable:
1. Screen Language Editor (button position extraction, action parsing)
2. Dynamic jump expressions (complex conditionals)
3. Refactoring tools (scope-aware renaming, code extraction)
4. Timeline Editor (ATL animation syntax parsing)
5. Advanced diagnostics (unused variables, type inference)

**Issue #205 recommendation**: Incremental adoption — keep regex for existing features, add AST for specialized tasks (screen blocks, Python expressions, ATL).

## Exploration Findings

### Existing AST-Related Work

**1. ATL Parser Deferral (Issue #38)**
- **File**: `plans/option-3-4-atl-presets-and-timeline.md`
- **Decision**: Full ATL parser (Option 0) deferred to post-release work
- **Current approach**: Preset templates avoid parsing; one-way generation (canvas → code)
- **Risk mitigation**: Avoids "round-trip editing" (code → visual) complexity

**2. Screen Language Editor (Post-1.0)**
- **Status**: Types exist (`ScreenComponent`, `ScreenModel` in `src/types.ts:283-301`) but marked REVIEW/unused
- **v1.0.0 decision**: Screen Composer UI removed from release (CHANGELOG.md)
- **Current capability**: Read-only screen list with jump-to-source only

**3. Debug System (Planned)**
- **File**: `.github/ISSUE_TEMPLATE/debug-feature-issues.md`
- **Requirement**: Track source location from Ren'Py's `renpy.ast.Node` execution hooks
- **Note**: Uses Ren'Py's **own AST**, not Vangard-side parsing

**4. Undefined Variable Detection (v1.0.0 — No AST)**
- **File**: `docs/superpowers/plans/2026-07-29-undefined-variable-detection.md`
- **Explicit decision**: "Deliberately does not attempt full Python-expression parsing... only `[interpolation]` and `if/elif/while` conditions"
- **Reason**: "Matches the codebase's existing line-regex analysis style (**no AST**)"

**5. Dynamic Jump Expressions (Implemented — No AST)**
- **Pattern**: `JUMP_CALL_EXPRESSION_REGEX` supports `jump expression "target"` / `jump expression target_var`
- **Test**: `src/test/renpyAnalysis.test.ts:104` — "records a dynamic jump expression with a bare identifier"
- **Coverage**: Regex-based; handles quoted strings + bare identifiers

### Missing Features from Issue #205

**Not in roadmap/codebase**:
- Refactoring tools (scope-aware variable/label renaming)
- Code extraction (conflicts with "code-first, one-way generation" philosophy)
- Full Screen Language parsing (deferred post-1.0)
- Full ATL parsing (deferred post-1.0)
- Type inference beyond interpolation/conditions (explicitly out-of-scope)

## Analysis: When AST Would Be Necessary

### Features **NOT** Requiring AST (Already Implemented)

✅ **Label/jump extraction** — Regex adequate (`LABEL_REGEX`, `JUMP_CALL_STATIC_REGEX`)  
✅ **Character definitions** — Regex + manual paren/quote balancing (`parseCharacterArgs`)  
✅ **Variable declarations** — Regex (`DEFINE_DEFAULT_REGEX`, `$ var = value` pattern)  
✅ **Screen discovery** — Regex (`SCREEN_REGEX`) finds screen names/parameters  
✅ **Route analysis** — Graph traversal over regex-extracted labels/jumps  
✅ **Undefined variable detection** — Regex-based interpolation/condition scanning  
✅ **Dynamic jump expressions** — Regex with string sanitization  
✅ **Translation analysis** — Regex-based dialogue/narration extraction

### Features Requiring AST (From Issue #205)

#### 1. **Screen Language Editor** (Post-1.0 Feature)
**Need**: Extract button positions, nested layout hierarchy, Python-expression actions
**Example**: Parse `screen main_menu(): vbox: xalign 0.5 yalign 0.5 textbutton "Start" action Start()`
**Current blocker**: No parser for screen-language DSL (not Ren'Py Python, not standard Python)
**AST scope**: Screen-language-specific grammar (indentation-based DSL with Python expressions)

#### 2. **Timeline Editor / ATL Parsing** (Deferred, Issue #38 Option 0)
**Need**: Parse animation transforms (`linear 2.0 xalign 1.0 alpha 0.5`)
**Example**: `transform fade_in: alpha 0.0 linear 1.0 alpha 1.0`
**Current blocker**: ATL is Python-like but not Python (custom grammar)
**AST scope**: ATL-specific grammar

#### 3. **Refactoring Tools: Scope-Aware Renaming**
**Need**: Rename variable across all uses while respecting Python scope rules
**Example**: Rename `persistent.score` → `persistent.player_score` without touching string literals
**Current blocker**: Regex doesn't understand Python block scope, string context, or expression trees
**AST scope**: Full Python expression + statement parsing

#### 4. **Refactoring Tools: Extract Method/Function**
**Need**: Select code region, wrap in function, infer parameters
**Example**: Extract dialogue block → `call helper_scene` with auto-generated label
**Current blocker**: Requires understanding statement boundaries, local vs. closure scope
**AST scope**: Full Ren'Py statement-level AST

#### 5. **Advanced Diagnostics: Control Flow Analysis**
**Need**: Detect unreachable code after `return`/`jump`, variables used before definition
**Example**: Warn if code appears after unconditional `jump` in a label
**Current blocker**: Regex sees lines, not control flow paths
**AST scope**: Statement-level AST with control-flow graph

#### 6. **Type Inference Beyond Interpolation**
**Need**: Infer that `$ x = 5` means `x` is int, `$ x = "hello"` is string
**Example**: Warn about `$ result = score + name` (int + str)
**Current blocker**: Requires Python expression evaluation context
**AST scope**: Full Python expression AST + type-inference rules

## Recommendation: Incremental AST Adoption Strategy

### Phase 0: No Action Required (Current v1.0.0)
**Why**: All shipped features work with regex. No user-facing pain points.
**When to revisit**: User requests for Screen Editor, Timeline Editor, or refactoring tools.

### Phase 1: Identify AST Library (When Post-1.0 Feature Prioritized)
**Trigger**: User demand for Screen Editor OR Timeline Editor
**Options**:
1. **Ren'Py's own AST** (`renpy.ast` module) — requires Python bridge via subprocess or Ren'Py SDK integration
2. **Custom parser** — Lezer, PEG.js, ANTLR grammar for Ren'Py syntax
3. **Python AST (`ast` module)** — only parses `$ python_code` lines, not Ren'Py DSL statements

**Decision criteria**:
- Screen Language Editor → needs custom Ren'Py DSL parser (neither Python AST nor Ren'Py's AST covers screen DSL fully)
- ATL Timeline Editor → needs custom ATL parser
- Refactoring tools → needs full Ren'Py statement parser (closest: Ren'Py's own AST via bridge)

### Phase 2: Hybrid Architecture (Recommended by Issue #205)
**Keep regex for**:
- Label/jump extraction (fast, proven)
- Character discovery
- Variable declaration lists
- Block-level classification (root/leaf/branching)

**Add AST for**:
- Screen block content parsing (when Screen Editor built)
- ATL transform parsing (when Timeline Editor built)
- Python expression evaluation (when type inference needed)
- Statement-level refactoring (when rename/extract tools built)

**Integration point**: `performRenpyAnalysis()` in `src/hooks/useRenpyAnalysis.ts`
- Step 1: Regex pass (as current) extracts high-level structure
- Step 2: AST pass (new) parses content within regex-identified blocks
- Result: `RenpyAnalysisResult` extended with `screenAST?: Map<string, ScreenAST>`, `atlTransforms?: Map<string, ATLNode[]>`

### Phase 3: Full AST Migration (Optional, Long-Term)
**Only if**: Regex workarounds become unmaintainable OR Ren'Py syntax changes break regex patterns
**Effort**: High (~2-4 weeks for parser + tests + migration)
**Benefit**: Eliminates workarounds (triple-quote masking, indent tracking, paren balancing)
**Risk**: Performance regression (AST parsing slower than regex for simple cases)

## Critical Files

If AST work begins:

| File | Current Role | AST Extension Point |
|------|--------------|---------------------|
| `src/hooks/useRenpyAnalysis.ts` | Main regex analysis engine | Add `performASTAnalysis()` phase after regex pass |
| `src/types.ts` | Type definitions | Extend `RenpyAnalysisResult` with AST node types |
| `src/workers/renpyAnalysis.worker.ts` | Web Worker wrapper | Add AST parsing in worker thread |
| `src/lib/renpyTripleQuotes.ts` | Workaround for triple-quote masking | Obsolete if full AST adopted |
| `src/lib/renpyLabelGuards.ts` | Indent-based scope tracking | Obsolete if control-flow AST adopted |
| `src/test/renpyAnalysis.test.ts` | Regex analysis tests | Add AST parsing tests |

New files (if AST adopted):
- `src/lib/renpyParser.ts` — AST parser entry point
- `src/lib/renpyAST.ts` — AST node type definitions
- `src/lib/screenLanguageParser.ts` — Screen DSL parser (if Screen Editor built)
- `src/lib/atlParser.ts` — ATL transform parser (if Timeline Editor built)

## Verification

When AST work begins:

1. **Performance**: Benchmark AST parsing vs. regex on large `.rpy` files (1000+ lines)
   - Target: <500ms for full project re-analysis on change
   - Test: Load sample Ren'Py game with 50+ `.rpy` files
2. **Accuracy**: Compare AST-extracted labels/jumps against regex baseline
   - Use `src/test/renpyAnalysis.test.ts` as regression suite
3. **Compatibility**: Test against official Ren'Py sample games (The Question, Tutorial)
4. **Feature coverage**: Build prototype Screen Editor/Timeline Editor to validate AST sufficiency

## Non-Goals (Out of Scope for Issue #205)

- ❌ Building Screen Editor or Timeline Editor (separate features)
- ❌ Implementing refactoring tools (no user demand established)
- ❌ Full Python type inference (explicitly scoped out in v1.0.0)
- ❌ Migrating existing regex analysis to AST (unless user pain points emerge)

## Next Steps (When Issue #205 Work Begins)

1. **Decide trigger**: Which post-1.0 feature (Screen Editor, Timeline Editor, refactoring) is prioritized?
2. **Research parser libraries**: Evaluate Ren'Py AST bridge, Lezer, PEG.js, ANTLR
3. **Prototype**: Build minimal AST parser for one syntax domain (screen language OR ATL)
4. **Benchmark**: Compare performance against regex baseline
5. **Integrate**: Add AST pass to `performRenpyAnalysis()` as Phase 2 in RenpyAnalysisResult
6. **Test**: Regression suite + new AST-specific tests

## Decision Point

**Current recommendation**: No action until post-1.0 feature roadmap clarifies demand for Screen Editor, Timeline Editor, or refactoring tools. Issue #205 is a **planning document**, not an actionable task.

**If Screen Editor prioritized**: Begin Phase 1 (identify screen-language parser library)  
**If Timeline Editor prioritized**: Begin Phase 1 (identify ATL parser library)  
**If refactoring tools prioritized**: Begin Phase 1 (evaluate Ren'Py AST bridge via subprocess)  
**If no demand**: Close issue #205 as "deferred indefinitely; regex adequate for current scope"
