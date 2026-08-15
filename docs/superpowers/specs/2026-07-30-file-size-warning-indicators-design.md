# Visual File-Size Warning Indicator System

**Status:** Approved
**Date:** 2026-07-30

## Problem

`.rpy` script files can grow unbounded with no visual feedback, leading to unwieldy files and increased Git merge-conflict risk. Developers need an at-a-glance signal, on the graph and in the editor, when a file is getting too large — plus configurable thresholds since "too large" varies by team/project.

## Goals

- User-configurable line-count thresholds defining four severity zones: Green (Ideal), Yellow (Healthy), Orange (Warning), Red (Critical).
- Visual indicator on graph nodes (ProjectCanvas) that doesn't collide with existing border/box-shadow states (selection, diagnostics, block type).
- Rich hover tooltip on graph nodes: file name, line count / threshold limit, status, label/jump counts.
- Colored dot on editor tabs reflecting the open file's severity.
- Line count + status shown in the status bar for the active file.
- Updates automatically on save, with no perceptible UI cost.

## Non-Goals

- No background-thread/worker computation — line counting is proven cheap (sub-ms via `content.split('\n').length`, already done synchronously in `CodeBlock.tsx` today).
- No per-project threshold overrides — thresholds are a single global `AppSettings` value.
- No changes to the analysis worker's data model (`RenpyAnalysisResult`) — label/jump counts per block are already derivable from existing `labelNodes`/`jumps` keyed by `blockId`.

## Design

### 1. Threshold configuration

Add to `AppSettings` (`src/types.ts`):

```ts
fileSizeThresholds?: {
  healthy: number;   // green ends / yellow starts, default 500
  warning: number;   // yellow ends / orange starts, default 1000
  critical: number;  // orange ends / red starts, default 1500
};
```

- Default applied in `useSettingsManagement.ts` alongside other defaults (~line 81-98) and in `resetAppSettings()` (~line 214-231).
- New setter `updateFileSizeThresholds(partial)` following the `updateEditorFont` pattern (~line 144).
- Persisted transparently via existing `app:save-settings` / `app-settings.json` flow — no IPC changes needed.

### 2. Severity utility (pure, shared)

New file `src/lib/fileSizeSeverity.ts`:

```ts
export type FileSizeSeverity = 'green' | 'yellow' | 'orange' | 'red';

export function getFileSizeSeverity(lineCount: number, t: FileSizeThresholds): FileSizeSeverity {
  if (lineCount <= t.healthy) return 'green';
  if (lineCount <= t.warning) return 'yellow';
  if (lineCount <= t.critical) return 'orange';
  return 'red';
}

export function getSeverityLabel(s: FileSizeSeverity): string; // "Ideal" | "Healthy" | "Warning" | "Critical"
export function getSeverityColor(s: FileSizeSeverity): { dot: string; text: string }; // Tailwind classes, dark-mode aware
export function getSeverityLimit(s: FileSizeSeverity, t: FileSizeThresholds): number; // the threshold this zone is measured against, for tooltip "N / limit"
```

Every consumer (graph node, tab, status bar) computes `lineCount` the same way: `useMemo(() => block.content.split('\n').length, [block.content])`. No shared state, no worker involvement — this stays a pure derived value, consistent with how `CodeBlock.tsx` already computes line count today.

### 3. Graph node indicator (`CodeBlock.tsx`)

- A small corner badge/dot (top-right corner of the node), colored via `getSeverityColor(...).dot`, rendered as a sibling to existing content — **not** part of the `borderClass` priority chain and **not** part of the `boxShadow` diagnostic styling, so it never visually competes with selection/error/type states.
- Only rendered when severity is not green (avoids visual noise on the common case), OR always rendered per user preference — default: only show for yellow/orange/red to reduce clutter at the "ideal" size. *(Confirmed default: hide the dot entirely at Green.)*
- New `FileSizeTooltip.tsx` component: small custom tooltip, portal-rendered to `document.body` (matching the `createPortal` modal convention in CLAUDE.md), dark-mode aware, appearing on hover over the badge (not the whole node, to avoid conflicting with the node's existing native `title=` attributes elsewhere). Content:
  - File name
  - `"{lineCount} / {limit} lines"` — limit is the threshold this zone is measured against (e.g. Orange shows `/ 1500`, meaning "1500 is the ceiling before Critical")
  - Status label (Ideal/Healthy/Warning/Critical)
  - Label count and jump count, computed via `analysisResult.labelNodes.filter(n => n.blockId === block.id).length` and `analysisResult.jumps[block.id]?.length ?? 0`

### 4. Editor tab indicator (`useTabContentRenderer.tsx`)

- Colored dot added next to the file name in the tab, alongside the existing dirty-state dot and error-count pill (~line 500-509). Same "hide at Green" rule as the graph node badge, for visual consistency.
- Tooltip: reuse native `title=` here (tabs are small, dense, and already keep tooltips lightweight) with a one-line summary: `"{lineCount} / {limit} lines — {Status}"`.

### 5. Status bar (`StatusBar.tsx`)

- For the currently active tab's block, show `"{lineCount} lines"` with severity-colored text, next to the existing error/warning counts (~line 134-150), following the same conditional-span pattern. Omitted when no file is active or the active tab isn't a code block.

### 6. Settings UI (`SettingsModal.tsx`)

- Three labeled number inputs: "Healthy starts at", "Warning starts at", "Critical starts at" (the fourth zone, Critical/Red, has no upper bound). Validation: each value must be strictly greater than the previous; invalid input blocks save with inline error text, following existing form-validation conventions in the modal.

## Data Flow

`handleSaveBlock` (App.tsx) updates `block.content` → `blocks[]` state updates → every memoized `lineCount` computation re-derives automatically on next render. No file watcher, no new save hook, no worker round-trip required.

## Testing

- Unit tests for `fileSizeSeverity.ts`: boundary values (exactly at each threshold), default thresholds, custom thresholds.
- `CodeBlock.test.tsx`: badge renders/hides correctly per severity, tooltip shows correct computed values (label/jump counts from mock `analysisResult`).
- `useTabContentRenderer` / tab bar tests: dot renders correct color, hidden at Green.
- `StatusBar.test.tsx`: line count + severity color shown for active block, omitted when no block active.
- `useSettingsManagement.test.ts`: default thresholds present, `updateFileSizeThresholds` persists and validates ordering.
- `SettingsModal.test.tsx`: threshold inputs render, reject out-of-order values.
- Manual verification: open a project, create/grow a file past each threshold, confirm graph badge, tab dot, tooltip, and status bar all update on save without a full app reload.

## Risks / Considerations

- Badge placement must not overlap existing corner UI (e.g. block-type icons) on `CodeBlock.tsx` — verify visually against existing node layouts (config/screen/root/leaf variants) during implementation.
- Ensure dark-mode contrast on all four severity colors (soft desaturated pastels per spec, not harsh neon) meets basic legibility — check against existing Tailwind dark-mode patterns used elsewhere in the app.
