# Usage Locations: Character & Variable Coverage Tables

## Problem

The "find usages" magnifying glass (characters and variables) highlights matching
blocks on the canvas via `findUsagesHighlightIds`, but the highlight disappears as
soon as the cursor moves, and it only works from the canvas view. There is no
canvas-independent way to see where a character or variable is actually used.

## Goals

1. Character tab (`CharacterEditorView.tsx`): show a table of files/label blocks
   where the currently-edited character speaks.
2. StatsView: add a "Variable Coverage" section, structurally mirroring the
   existing "Asset Coverage" section, showing referenced/unreferenced status per
   variable and the file/label locations where each is referenced.
3. Both features let the user jump directly into the Monaco editor at the usage
   line (`onOpenEditor`), rather than relying on the canvas highlight.

Out of scope: fixing/replacing the existing magnifying-glass canvas-highlight
behavior itself. These tables are an additional, canvas-independent way to find
usages, not a replacement for `findUsagesHighlightIds`.

## Shared helper — `src/lib/usageLocations.ts`

```ts
export interface UsageLocationGroup {
  blockId: string;
  filePath: string;
  fileName: string;
  label: string | null; // null if the occurrence is before any label in the block
  firstLine: number;     // earliest occurrence line in this group, for jump-to-editor
  count: number;          // number of occurrences in this file/label group
}

export function findLabelForLine(
  blockId: string,
  line: number,
  labelNodes: LabelNode[],
): LabelNode | undefined;

export function groupUsageLocations(
  occurrences: { blockId: string; line: number }[],
  blocks: Block[],
  labelNodes: LabelNode[],
): UsageLocationGroup[];
```

- `findLabelForLine` mirrors the existing nearest-label-at-or-before-line logic in
  `useRenpyAnalysis.ts` (`labelsInBlock.slice().reverse().find(l => l.startLine <= line)`),
  scoped to labels in the given block.
- `groupUsageLocations` resolves each occurrence's block to a `Block` (for
  `filePath`/`fileName`) and label, groups by `(blockId, label)`, and sorts by
  `fileName` then `label` then `firstLine`. Blocks that no longer exist (stale
  `blockId`) are skipped.
- Unit tested directly (multiple occurrences in the same label collapse into one
  group with `count`; occurrences before the first label get `label: null`;
  sorting is stable).

## Character tab — `CharacterEditorView.tsx`

- New props: `analysisResult: RenpyAnalysisResult`, `blocks: Block[]`,
  `onOpenEditor: (blockId: string, line?: number) => void`.
- New "Usage Locations" section in the right column, immediately after the
  Advanced Properties disclosure block (visible whether Advanced is expanded or
  collapsed — this is the whitespace area today).
- Skipped entirely when `isNew` (no character to look up yet).
- `useMemo`: filter `analysisResult.dialogueLines` entries down to
  `{ blockId, line }` where `dialogues.some(d => d.tag === character.tag)`,
  producing one occurrence per matching dialogue line, then
  `groupUsageLocations(...)`.
- Table columns: **File | Label | Lines** (occurrence count). Row click calls
  `onOpenEditor(blockId, firstLine)`. Empty state: "No dialogue found for this
  character yet."
- `useTabContentRenderer.tsx` passes `analysisResultWithProfiles`, `blocks`, and
  `handleOpenEditor` into the existing `<CharacterEditorView>` call.

## Variable Coverage — `StatsView.tsx`

New section placed immediately after "Asset Coverage", reusing the same visual
language (coverage bar, status filter pills, text search, sortable table).

- No new props — StatsView already destructures `variables`, `variableUsages`
  from `analysisResult` and `labelNodes` from `routeAnalysisResult`, and already
  has `blocks` and optional `onOpenEditor`.
- New computed type:
  ```ts
  interface VariableCoverageRow {
    name: string;
    type: string;                 // Variable.type, as already shown in "Top 10 Variables"
    status: 'referenced' | 'unreferenced';
    locations: UsageLocationGroup[];
  }
  ```
  Built via `useMemo` over `variables`/`variableUsages` (Map iteration only, no
  regex scanning — unlike asset coverage this doesn't need the `setTimeout`
  deferral).
- New local state: `varCoverageStatusFilter` (`all`/`referenced`/`unreferenced`),
  `varCoverageTextFilter`, `varCoverageSortKey` (`name`/`status`),
  `varCoverageSortDir`, `expandedVarNames: Set<string>`.
- Coverage bar: single bar, "Variables — N/total referenced (X%)", with an
  "M unreferenced" note when `M > 0` (parallel to the Images/Audio bars, but one
  bar since there's one variable category).
- Table columns: **Variable | Type | Status | Locations**. "Locations" shows a
  count badge; clicking anywhere on the row toggles an inline expansion showing
  a nested mini-table (File | Label | Lines) built from `row.locations`, with
  each nested row calling `onOpenEditor(blockId, firstLine)` when `onOpenEditor`
  is provided (same optional-prop guard pattern already used for Unreachable
  Labels).
- Variables with zero usages render with `status: 'unreferenced'` and an empty
  `locations` array (no expand affordance).

## Testing

- `src/lib/usageLocations.test.ts` (new): grouping, label resolution edge cases
  (before first label, multiple labels, stale blockId), sorting.
- `CharacterEditorView.test.tsx`: renders usage table for a character with
  dialogue lines, empty state when none, row click calls `onOpenEditor`.
- `StatsView.test.tsx`: Variable Coverage bar/table renders, status filter,
  expand/collapse, row click calls `onOpenEditor`.
