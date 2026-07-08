# Canvas Reference

### 3.1 Project Canvas

The Project Canvas displays one block per `.rpy` file. Blocks are connected by arrows derived from `jump` and `call` statements in the code.

**Node type:** `.rpy` file blocks

**Edge types:**

| Arrow Style | Meaning |
|-------------|---------|
| Solid line | `jump` -- control transfers to target, does not return |
| Dashed line | `call` -- control transfers to target, returns when done |

**Block appearance:**

| Property | Source |
|----------|--------|
| Color | Deterministic hash of the block title (auto-assigned, consistent across sessions) |
| Title | First `label` name found in the file |
| Diagnostic glow (red) | File contains one or more errors |
| Diagnostic glow (amber) | File contains warnings but no errors |
| Role tinting | Tint overlay based on dominant character in the file |

**Features:**
- Character filter -- show only blocks containing dialogue for a selected character
- Groups -- select multiple blocks and press `G` to create a named visual group
- Legend overlay -- shows meaning of edge styles and glow colors
- 4 auto-layout algorithms (see below)

**Layout algorithms:**

| Algorithm | Description |
|-----------|-------------|
| Flow LR | Left-to-right flow layout following jump/call connections |
| Flow TD | Top-to-bottom flow layout following jump/call connections |
| Connected Components | Separates disconnected subgraphs into distinct clusters |
| Clustered Flow | Groups tightly-connected blocks into clusters, then arranges clusters in flow order |

### 3.2 Flow Canvas

The Flow Canvas displays one node per `label` definition. It shows the full narrative flow, including fall-through connections between adjacent labels.

**Node type:** Labels

**Edge types:**

| Arrow Style | Meaning |
|-------------|---------|
| Solid line | `jump` -- unconditional transfer |
| Dashed line | `call` -- transfer with return |
| Dotted line | Fall-through -- control passes to the next label in the same file without an explicit jump |

**Node role badges:**

| Badge | Meaning |
|-------|---------|
| Start | Entry point label (e.g., `label start`) |
| End | Label that terminates with `return` and has no outgoing jumps |
| Choice | Label containing a `menu:` statement |
| Decision | Label with conditional branching (`if`/`elif`/`else` leading to jumps) |
| Story | Standard narrative label (no special role) |

**Features:**
- Unreachable label flagging -- labels with no incoming edges are visually flagged
- Menu node hover popover -- hovering a Choice node shows the menu text and option list
- Route highlighting -- click a route in the Route List panel to highlight its path
- Route List panel -- enumerates all distinct paths through the story

### 3.3 Choices Canvas

The Choices Canvas shows the story from the player's perspective. Only labels that contain or are reached through `menu:` statements appear.

**Node type:** Menu labels

**Choice pills:**
- Each menu option renders as a colored pill extending from its parent menu node
- 6-color rotation (pills cycle through 6 distinct colors for visual differentiation)
- Each pill displays the player-visible choice text
- Condition guard badges appear on pills that have `if` conditions (e.g., `if has_key`)

**Purpose:** Visualize the player experience -- what choices appear, what conditions gate them, and where each choice leads. Complements the Flow Canvas, which shows code structure rather than player-facing content.

**Edge types:**

| Arrow Style | Meaning |
|-------------|---------|
| Solid line | `jump` -- player choice leads to this label |
| Dashed line | `call` -- player choice calls this label, then returns |

**Key differences from Flow Canvas:**
- Only labels involved in or reachable from `menu:` statements appear
- Choice pills replace generic edge labels, showing the actual text the player reads
- Condition guards are shown inline so you can see which choices require game state

### 3.4 Shared Canvas Features

These features are available on all three canvases.

| Feature | Shortcut / Trigger | Description |
|---------|--------------------|-------------|
| Go-to-Label | `Ctrl+G` / `Cmd+G` | Fuzzy-search command palette. Selecting a label pans and zooms the canvas to that node at 100% zoom. |
| Toolbox Search | Search field in Toolbox panel | Filter visible nodes by name |
| Fit-to-Screen | Toolbar or context menu | Adjusts zoom and pan to fit all nodes in the viewport |
| Go-to-Start | Toolbar or context menu | Pans to the `label start` node |
| Auto-Center | Automatic on navigate | Canvas centers on the target node when navigating from other panels |
| Minimap | Toggle in canvas toolbar | Small overlay showing the full canvas with a viewport indicator rectangle |
| Sticky Notes | Add Note button or context menu | Colored notes (6 colors) with Markdown rendering. Can be promoted to Diagnostics Tasks via checkbox. Each canvas has its own set of notes. |
| Keyboard Navigation | `Tab`, `Arrow Keys`, `Enter`, `Escape` | Full keyboard traversal of canvas nodes (see Canvas shortcuts in [Keyboard Shortcuts](/reference/keyboard-shortcuts)) |
| ARIA Accessibility | Automatic | All blocks and nodes carry descriptive ARIA labels for screen readers (NVDA, VoiceOver, JAWS) |

**Sticky note details:**

| Property | Details |
|----------|---------|
| Colors available | 6 colors (yellow, blue, green, pink, orange, purple) |
| Content format | Markdown (rendered via `marked`) |
| Storage | Three separate arrays, one per canvas. Saved to `.renide/project.json` |
| Promote to task | Toggle checkbox on a note to convert it to a Diagnostics Task |
| Positioning | Drag to reposition freely on the canvas |

**Context menu actions (right-click on canvas):**

| Action | Description |
|--------|-------------|
| Add Note | Place a new sticky note at the click location |
| Fit to Screen | Zoom and pan to show all nodes |
| Go to Start | Navigate to `label start` |
| Organize Layout | Run the selected auto-layout algorithm |
| Center on Canvas | (Right-click a block in Project Explorer) Navigate to that block on the canvas |
