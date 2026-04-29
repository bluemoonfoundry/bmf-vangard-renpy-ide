# Canvas Architecture

Ren'IDE has three canvases, each serving a distinct level of narrative abstraction. They share a common drag-and-drop model and layout infrastructure but differ in what they display, how they highlight, and what keyboard/overlay features they expose.

---

## 1. The Three Canvases

| | Project Canvas | Flow Canvas | Choices Canvas |
|--|---|---|---|
| **Component** | `StoryCanvas.tsx` | `RouteCanvas.tsx` | `ChoiceCanvas.tsx` |
| **Granularity** | File (`.rpy` blocks) | Label definitions | Player decisions |
| **Node types** | `CodeBlock`, `GroupContainer`, `StickyNote` | `LabelBlock` or `FileBlock` | SVG `<g>` + choice pills |
| **Edge types** | Jump / call links | Jump / call / implicit links | Choice edges, fan-out arrows |
| **Layout file** | `storyCanvasLayout.ts` | `routeCanvasLayout.ts` | `routeCanvasLayout.ts` |

### 1.1 Project Canvas (`StoryCanvas.tsx`)

Shows one draggable block per `.rpy` file. Primary workspace for organizing files.

**Unique features:**
- Block types: story, screen, and config (visually distinct borders — teal for screen, red for config)
- Block color derived from label hash; persists in `.renide/project.json`
- `GroupContainer` — a resizable rectangle that holds multiple blocks; drag moves the group and all children
- Character filter — dropdown filters the canvas to blocks containing dialogue from a chosen character
- Minimap — thumbnail of the full canvas, positioned bottom-right
- Call arrows rendered with a circle at the source to distinguish them from jump arrows
- Sticky notes with full Markdown rendering, resizable, color-customizable

**State machine** (9 states):

```
idle → panning
     → rubber-band (marquee select)
     → dragging-blocks
     → dragging-groups
     → dragging-notes
     → resizing-block
     → resizing-group
     → resizing-note
```

### 1.2 Flow Canvas (`RouteCanvas.tsx`)

Shows one node per label definition (or one per file in file view). Designed for understanding narrative structure at a script level.

**Unique features:**
- **View level toggle** — `'label'` (one node per label) vs `'file'` (one node per `.rpy` file, aggregates labels)
- **Focus modes** — filter to `'downstream'`, `'upstream'`, or `'connected'` subgraph from the selection via BFS
- **Overlay modes** — tint nodes by structural complexity:
  - `'hubs'` — ≥3 incoming links
  - `'branch-points'` — ≥3 outgoing non-implicit links
  - `'menu-heavy'` — ≥2 distinct menu groups
  - `'call-heavy'` — ≥2 incoming calls
- **Trace mode** — step through an identified route interactively, with choice selection
- **Edge filters** — `hideImplicit` (fall-through edges) and `showOnlyCalls` toggles
- **Menu Inspector** — sidebar listing all reachable targets from a menu node, with source/target line numbers

**State machine** (4 states):

```
idle → panning
     → rubber-band (start: Position)
     → dragging-nodes (dragStartPositions: Map<string, Position>)
```

### 1.3 Choices Canvas (`ChoiceCanvas.tsx`)

Renders the decision tree formed by `menu:` blocks. Emphasizes player agency with visual choice pills.

**Unique features:**
- **Choice pills** — colored buttons below menu nodes, one per choice destination (6-color rotation via `PILL_COLORS`)
- **Dialogue snippets** — first line of dialogue shown below each label name (`buildSnippetMap()`)
- **Trunk-branch connectors** — T-junction SVG paths connect a menu node's pill column to its destinations
- **Pill collision avoidance** — multi-pass layout loop adjusts node positions to prevent pill stacks from overlapping
- **Choice Inspector** — sidebar showing all choices for the selected menu (count, conditional count, unique targets)
- **Implicit edge toggle** — fall-through connections between consecutive labels can be hidden

**State machine** (3 states):

```
idle → panning
     → node (nodeId: string)
```

---

## 2. Shared Drag-and-Drop Model

All three canvases use native pointer events — **not** React synthetic events — during drag for performance. This bypasses React's reconciler entirely while the pointer is moving.

### 2.1 Pointer Event Attachment

| Canvas | Attachment strategy |
|---|---|
| **Project Canvas** | Global `window.addEventListener('pointermove' / 'pointerup')` attached on `pointerdown`, removed on `pointerup` |
| **Flow Canvas** | `onPointerMove` / `onPointerUp` on the SVG element; `e.currentTarget.setPointerCapture()` |
| **Choices Canvas** | `onPointerMove` / `onPointerUp` on the SVG element for panning; per-element handlers for sticky note drag |

The Project Canvas uses `canvasEl.setPointerCapture(e.pointerId)` to ensure events continue delivering to the canvas even when the pointer leaves the window boundary.

### 2.2 Drag State Machine Pattern

At `pointerdown`, the canvas transitions from `idle` into the appropriate drag state and records the initial positions of all affected elements:

```typescript
// Project Canvas (StoryCanvas.tsx)
const dragInitialPositions = new Map<string, Position>();
blocks.forEach(b => {
  if (currentSelection.includes(b.id))
    dragInitialPositions.set(b.id, { ...b.position });
});

// Flow Canvas (RouteCanvas.tsx)
const dragStartPositions = new Map<string, Position>();
// populated at drag-start per selected node
```

On each `pointermove`, the delta from the drag-start world position is applied to every initial position, then written **directly to the DOM** to skip React rendering:

```typescript
// During pointermove (StoryCanvas.tsx)
const blockEl = blockRefs.current.get(id);
if (blockEl) {
  blockEl.style.left = `${newX}px`;
  blockEl.style.top  = `${newY}px`;
}
// Arrow SVG paths updated via setAttribute during drag
```

On `pointerup`, the canvas dispatches the final positions to React state (triggering one re-render to persist), removes the global listeners, and returns to `idle`.

### 2.3 Rubber-Band Selection

Project Canvas and Flow Canvas both support drag-to-select (rubber band). On `pointerdown` on the canvas background:
1. State transitions to `rubber-band`, storing the start world coordinate.
2. `pointermove` recomputes the selection rectangle in world space.
3. `pointerup` finalizes the selection: all nodes whose bounding box intersects the rectangle are added to `selectedBlockIds` / `selectedNodeIds`.

---

## 3. Layout Algorithms

Both layout files (`storyCanvasLayout.ts`, `routeCanvasLayout.ts`) expose the same four modes, delegating to shared generic helpers in `graphLayout.ts`.

### 3.1 Available Modes

| Mode | Description | Complexity |
|---|---|---|
| `'flow-lr'` | Left-to-right Sugiyama layered layout (default) | O(n log n) typical |
| `'flow-td'` | Top-down Sugiyama layered layout | O(n log n) typical |
| `'connected-components'` | Left-to-right with disconnected sub-graphs spaced apart | O(n log n) typical |
| `'clustered-flow'` | Two-level hierarchical: clusters by filename prefix, then layouts within each cluster | O(n²) worst case |

### 3.2 Clustered-Flow Clustering

`'clustered-flow'` first groups nodes by a filename prefix extracted from their `filePath` (or `containerName` for label nodes). The prefix extractor supports five patterns:

1. **Named episode/chapter** — `ep1`, `chapter_02`, `act3`, `day_1`, `part4`, `scene5`, `vol2`, `section1`, `arc3`
2. **Route prefix** — `route_luna`, `route_bad`, `route_<name>`
3. **Numeric leading prefix** — `01_intro`, `02_main` → normalized to `n_01`, `n_02`
4. **Generic word+number prefix** — `prologue1_scene`, `intro2_text` → `prologue1`, `intro2`
5. **No match** — node becomes a singleton cluster

Each cluster is laid out independently (Sugiyama), then clusters are arranged on a grid.

### 3.3 Project Canvas vs Flow Canvas Configs

```typescript
// storyCanvasLayout.ts
const STORY_CONFIG = { paddingX: 150, paddingY: 50, defaultWidth: 120, defaultHeight: 120, ... };

// routeCanvasLayout.ts
const ROUTE_CONFIG = { paddingX: 140, paddingY: 70, defaultWidth: 220, defaultHeight: 110, ... };
```

Flow Canvas nodes are wider (label text is longer than block names) and shorter.

### 3.4 Layout Fingerprints

Both layout files expose a `computeStoryLayoutFingerprint` / `computeRouteCanvasLayoutFingerprint` function that produces a short hash of the current block/node set, link topology, and layout mode. This is used to detect whether a persisted layout is stale and a re-layout should be offered to the user.

---

## 4. Rendering Optimizations

### 4.1 Memoization Strategy

Canvas components use `useMemo` extensively so that unrelated state changes (e.g., a tab switch or editor keystroke) do not recompute expensive derived data or re-render the full canvas.

**Key memoized values by canvas:**

**Project Canvas:**
- `visibleBlocks` — filtered by story/screen/config type toggles in `canvasFilters`
- `visibleBlockIds` — `Set<string>` for O(1) membership checks in link filtering
- `visibleLinks` — only links between currently-visible blocks
- `characterFilterBlockIds` — blocks containing dialogue from the selected character
- `svgBounds` — SVG viewport computed from block positions (drives the `<svg>` width/height)
- `minimapItems` — positions/dimensions for minimap thumbnail

**Flow Canvas:**
- `fileGraph` — aggregated file-level graph (re-layouted when view level switches to `'file'`)
- `nodeMap` — routes to `labelNodeMap` or `fileGraph.nodes` depending on view level
- `outgoingLinksByNode` / `incomingLinksByNode` — adjacency lists for BFS focus mode
- `focusedNodeIds` — BFS result set; recomputed only when focus mode or selection changes
- `hubData`, `branchData`, `menuHeavyData`, `callHeavyData` — overlay node sets with per-node counts
- `renderedLinks` — edge-filtered view (applies `hideImplicit` and `showOnlyCalls`)

**Choices Canvas:**
- `baseLayoutNodes` — Sugiyama-positioned nodes before pill collision avoidance
- `menuReserveBoxes` — bounding boxes of pill stacks (used as obstacles in collision loop)
- `layoutedNodes` — final positions after collision resolution
- `snippetMap` — first dialogue line per label (built once from `buildSnippetMap()`)
- `highlightedNodeIds` / `highlightedLinkIds` — depth-1 neighborhood of clicked node

### 4.2 DOM Bypass During Drag

Project Canvas and Flow Canvas write position changes directly to DOM `style` properties during drag, bypassing React entirely. This eliminates reconciler overhead on every `pointermove` event.

After `pointerup`, a single `setState` call commits the final positions to React state, which triggers one re-render to persist the layout.

Choices Canvas does not use DOM bypass — its nodes are SVG `<g>` elements managed by React, and drag-to-pan moves a `transform` on the root `<g>` rather than individual node positions.

### 4.3 Analysis Decoupling

`useRenpyAnalysis` receives only `{ id, content, filePath }` per block — **not** position, color, or width. This means drag events, color changes, and resize operations never re-trigger the parser. Re-analysis only fires when file content changes.

---

## 5. Keyboard Navigation

Project Canvas and Choices Canvas support full keyboard navigation. Flow Canvas does not currently implement arrow-key navigation.

### 5.1 Focus Cycling (Tab / Shift+Tab)

All interactive canvas nodes (blocks, label nodes, choice pills) are `tabIndex={0}` and receive browser-native Tab focus cycling.

### 5.2 Arrow Key Spatial Navigation

Both Project Canvas and Choices Canvas use an **angular scoring** algorithm on `keydown` (Arrow keys):

```typescript
// Given: focused node center (cx, cy), direction unit vector (dx, dy)
// For each candidate node at (nx, ny):
const dot  = (nx - cx) * dx + (ny - cy) * dy;        // must be positive (correct direction)
const perp = Math.abs((nx - cx) * dy - (ny - cy) * dx); // perpendicular distance
const dist = Math.hypot(nx - cx, ny - cy);
const score = dist + perp * 1.5;                       // penalizes wide angles
// → focus the candidate with the lowest score
```

The `1.5` perpendicular penalty biases navigation toward straight-line neighbors over diagonal ones. The winning node is focused imperatively via `blockRefs.current.get(id)?.focus()` (Project Canvas) or `svgRef.current?.querySelector('[data-ccnid="${id}"]')` (Choices Canvas).

**Additional shortcuts:**
- `Escape` — clear selection, announce "Selection cleared"
- `Enter` — open editor tab for the focused node

### 5.3 ARIA Implementation

| Element | Role / attributes |
|---|---|
| Canvas container | `role="application"` `aria-label="Story canvas"` / `"Choice canvas"` |
| Live announce region | `role="status"` `aria-live="polite"` `aria-atomic="true"` `class="sr-only"` |
| Canvas blocks / label nodes | `role="button"` `tabIndex={0}` `aria-label="<name>"` `aria-pressed={isSelected}` |
| Choice pills | `role="button"` `tabIndex={0}` `aria-label="Choice: <label>"` |

The announce region is updated with a text string (e.g., `"intro_scene focused"`) after each arrow-key navigation, enabling screen readers (NVDA, VoiceOver, JAWS) to read out the new focus.

---

## 6. When to Modify Each Canvas

| Task | Where to look |
|---|---|
| Add a new block-level visual (badge, icon, color) | `StoryCanvas.tsx` → `CodeBlock.tsx` |
| Add a new label-level overlay or filter | `RouteCanvas.tsx` — add to `overlayMode` union and compute a new `useMemo` set |
| Add a new choice visualization | `ChoiceCanvas.tsx` — update `choicePillsByMenu` memo and pill rendering loop |
| Change layout spacing or padding | `STORY_CONFIG` / `ROUTE_CONFIG` constants in the layout files |
| Add a new layout algorithm | Implement in `graphLayout.ts`, add a new case to `computeStoryLayout` / `computeRouteCanvasLayout`, extend `StoryCanvasLayoutMode` in `types.ts` |
| Extend drag to a new element type | Add a state to the canvas `InteractionState` union, handle in `pointerdown`, `pointermove`, and `pointerup`; store initial positions in a new `Map` |
| Add keyboard navigation to Flow Canvas | Follow the arrow-key pattern in `StoryCanvas.tsx:943-998` — angular scoring with `data-` attribute for focus targeting |

---

## 7. Performance Considerations

- **Never pass position/size props through `useRenpyAnalysis`** — the hook signature is intentionally narrow (`{ id, content, filePath }`) to prevent drag from triggering re-analysis.
- **Use `useMemo` for any derived set or array** passed as props to canvas children. Without memoization, every parent re-render produces a new array reference, causing all canvas blocks to re-render simultaneously.
- **Prefer DOM writes over `setState` during drag.** `pointermove` can fire at 60–120 Hz. A single `setState` per event frame would saturate React's scheduler. Commit state only on `pointerup`.
- **Keep `GroupContainer` child lists stable.** Group membership is a `string[]` of block IDs. Rebuilding this array on every render defeats `React.memo` on `CodeBlock`.
- **The Choices Canvas collision-avoidance loop** is O(n²) in the number of nodes. For projects with >200 labels the loop may take 10–30 ms. If this becomes a bottleneck, gate the loop behind a node-count threshold and fall back to `baseLayoutNodes`.
