# Notecard Canvas — Design

## Context

Vangard Studio has three canvases (Project, Flow, Choices), all of which map directly to Ren'Py script structure — blocks, labels, and routes derived from `.rpy` file content. Users have asked for a fourth, unstructured canvas: a Twine-like scratchpad where they can jot notes, sketch ideas, and link them freely, without any of it being interpreted as or tied to Ren'Py script content. This is purely an authoring aid — outlining plot beats, character notes, worldbuilding — that must never be parsed, validated, or treated as source-of-truth script data the way blocks are.

The goal of this design is a fourth canvas tab, "Notecard Canvas," that lets users create, edit, resize, recolor, delete, and link freeform notecards, with its own minimap and its own local search, while persisting alongside the other canvas data in the existing project save file so the project remains a single shareable unit.

## Data Model

Added to `src/types.ts`:

```ts
type NoteColor = 'yellow' | 'blue' | 'green' | 'pink' | 'purple' | 'red'; // existing enum, reused

interface Notecard {
  id: string;
  title: string;
  content: string;          // markdown body, rendered via `marked` like StickyNote
  position: { x: number; y: number };
  width: number;
  height: number;
  color: NoteColor;
}

interface NotecardLink {
  id: string;
  fromId: string;            // Notecard.id
  toId: string;              // Notecard.id
  label?: string;             // optional short text label
}
```

Notecards and links are intentionally decoupled from `Block`, `RenpyAnalysisResult`, and every other Ren'Py-derived structure. Nothing in the analysis worker, diagnostics engine, or `.rpy` file writers ever reads or writes these types.

## Persistence

`notecards: Notecard[]` and `notecardLinks: NotecardLink[]` are added as new top-level fields on `ProjectSettings` (`src/types.ts`), following the exact pattern already used by `stickyNotes`, `sceneCompositions`, etc.

- **Write**: `useProjectIO.ts`'s existing bundling logic (`~line 169-197`) picks these up automatically once added to the `ProjectSettings` shape and the settings-assembly object; written to `game/project.ide.json` in the same `writeFile` call as every other canvas array. No new IPC handlers.
- **Read**: the inverse path in `useProjectLoad.ts` restores them into `useImmer` state the same way.
- **Why bundle rather than a separate sidecar file**: `project.ide.json` is already IDE-only metadata, never a file Ren'Py itself reads or writes, so bundling notecards there does not violate "must not conflict with Ren'Py files." Keeping all IDE canvas state in one file also means a single `project.ide.json` remains the complete, shareable unit for collaborators — splitting notecards into a second file would fragment that.

State ownership in `App.tsx`: new `useImmer` arrays `notecards` and `notecardLinks`, managed through a new hook `src/hooks/useNotecards.ts` mirroring `useStickyNotes.ts`'s shape (add/update/delete/move/resize/recolor for cards, add/update/delete for links), including the same viewport-centered default-placement logic for newly created cards.

## Canvas Component

New `src/components/NotecardCanvas.tsx`, structurally mirroring `StoryCanvas.tsx` / `RouteCanvas.tsx` / `ChoiceCanvas.tsx` since there is no shared base canvas component in this codebase to inherit from — each existing canvas independently implements pan/zoom/drag/resize via a local `useRef<InteractionState>` state machine with `requestAnimationFrame`-batched native pointer events, and this canvas follows the same pattern for consistency. It uses `useCanvasInteraction` for shared transform/selection/center/flash state, same as the other three.

Interactions:

- **Create**: double-click empty canvas space, or right-click empty space → context menu → "New Notecard." Both place the new card at the click point in canvas-space (accounting for current pan/zoom transform).
- **Edit**: clicking into a card opens inline editing for title + markdown body (textarea/preview toggle), matching `StickyNote.tsx`'s existing edit/preview UX.
- **Delete**: per-card delete affordance plus `Delete` key on selection — consistent with existing block/sticky-note deletion.
- **Resize**: a `.resize-handle` corner element, detected by the canvas's pointer-down handler via `closest('.resize-handle')`, entering a `resizing-notecard` interaction state — same mechanism as `StoryCanvas.tsx`'s `resizing-note` handling.
- **Recolor**: small swatch popover reusing the same 6 `NoteColor` swatches and Tailwind color mapping already defined for sticky notes (`StickyNote.tsx`'s `COLORS`).
- **Link**: dragging from a small connector handle on a card's edge onto another card creates a directional `NotecardLink`. Links render as SVG arrows on the canvas, in the same layer style used for `analysisResult.links[]` / `routeLinks[]` in the other canvases. Double-clicking a link opens a small inline editor for its optional `label`.

## Minimap

Reuse `src/components/Minimap.tsx` unmodified in structure — extend the `MinimapItem['type']` union with `'notecard'`, and extend `ITEM_COLORS` so a notecard's minimap dot reflects its own `NoteColor` rather than one fixed minimap color. No other minimap changes are required; it is already generic over `{ id, position, width, height, type, color? }` and already supports click-to-pan and drag-viewport panning.

## Search

The existing `SearchContext` searches on-disk project files (`.rpy` content) via `window.electronAPI.searchInProject` and has no notion of in-memory sticky-note or notecard content — it is not a fit to extend. Notecard search is a small, self-contained feature local to `NotecardCanvas.tsx`: a search input filtering the in-memory `notecards` array by title/content substring, dimming non-matching cards and optionally centering the viewport on the first match. It is not wired into the global `SearchContext` or global search shortcut.

## Tab Integration

- Extend `EditorTab['type']` (`src/types.ts`) with `'notecard-canvas'`.
- Add `handleOpenNotecardCanvasTab` in `src/hooks/useTabOpeners.ts`, mirroring the existing static-tab openers (dedupe by `id === type`, push onto `openTabs`/`secondaryOpenTabs`).
- Add a tab-label case and a `tab.type === 'notecard-canvas'` render branch in `src/hooks/useTabContentRenderer.tsx`, mounting `NotecardCanvas.tsx` with the same prop-passing pattern used for Route/Choice Canvas.
- The tab appears in the same tab bar as Project/Flow/Choices Canvas, discoverable in the same place, though visually distinguished (e.g. a distinct icon/tint) to signal it holds freeform scratch content rather than script-derived structure.

## Out of Scope (v1)

- Multiple notecard boards per project (single shared board only, matching the other canvases' one-board-per-project model).
- Any interpretation of notecard content by the analysis worker, diagnostics engine, or Ren'Py export/build pipeline.
- Free hex-color picking for notecards (uses the same fixed 6-color enum as sticky notes, not `ColorDropTarget`).
- Wiring notecard search into the global `SearchContext` or global search UI/shortcut.

## Testing

- Unit tests for `useNotecards.ts` (add/update/delete/link/move/resize/recolor, default placement).
- Component tests for `NotecardCanvas.tsx` covering create (double-click, context menu), delete, resize, recolor, link creation/label edit, and local search filtering — following existing patterns in `src/test/` for the other canvases (`createMockElectronAPI()`, sample-data factories).
- Round-trip test: `notecards`/`notecardLinks` survive a `useProjectIO` save → `useProjectLoad` load cycle inside `project.ide.json`, alongside existing arrays.
- Minimap test: notecard items render correctly and are click/drag-pannable, extending existing `Minimap.test.tsx` coverage if present.
