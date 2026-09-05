# Canvas Reference

### 3.1 Project Canvas

The Project Canvas displays one block per `.rpy` file. Blocks are connected by arrows derived from `jump` and `call` statements in the code.

**Node type:** `.rpy` file blocks

**Edge types:**

| Arrow Style | Meaning |
|-------------|---------|
| Solid line | `jump` -- control transfers to target, does not return |
| Solid line + circle marker at source | `call` -- control transfers to target, returns when done. Styled the same as a jump line, distinguished only by the circle marker. |

**Block appearance:**

| Property | Source |
|----------|--------|
| Color | User-selected from a fixed palette via the block's color-picker popover (defaults to gray; not derived from the title) |
| Title | First `label` name found in the file |
| Diagnostic glow (red) | File contains one or more errors |
| Diagnostic glow (amber) | File contains warnings but no errors |

**Features:**
- Character filter -- show only blocks containing dialogue for a selected character
- Groups -- select multiple blocks and press `G` to create a named visual group
- Legend panel -- shows meaning of arrow styles (Jump/Call), Block Roles (start/end/branching), and Block Types (Story/Screen/Config); does not cover the diagnostic glow colors, which are documented separately above
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
| Solid line + circle marker at source | `call` -- transfer with return. Same solid styling as jump; the circle marker is the only visual difference. |
| Long-dashed line | Fall-through (implicit edge) -- control passes to the next label in the same file without an explicit jump |

**Node status styling:**

| Style | Meaning |
|-------|---------|
| Green border/background | `isEntry` -- entry point label |
| Orange border/background | `isUnreachable` -- no jump, call, or fall-through leads to this label |
| Amber dashed border/background | `isDeadEnd` -- label has no outgoing jumps |
| Default gray | No special status |

**Structural overlay badges** (shown when an overlay mode is active, with a numeric count):

| Badge | Meaning |
|-------|---------|
| Hub (sky blue) | Label with many incoming paths |
| Branch (violet) | Label with many outgoing paths |
| Menu-heavy (rose) | Label containing multiple choice menus |
| Call-heavy (teal) | Label with many incoming calls |

**Features:**
- Unreachable label flagging -- labels with no incoming edges are visually flagged
- Menu pills -- outgoing edges from a label with a `menu:` block carry a clickable pill; clicking one opens the Menu Inspector as a persistent side panel (not a hover popover) showing the menu text and option list
- Route highlighting -- click a route in the Route List panel to highlight its path
- Route List panel -- enumerates all distinct paths through the story

### 3.3 Choices Canvas

The Choices Canvas shows the story from the player's perspective. Only labels that contain or are reached through `menu:` statements appear.

**Node type:** Menu labels

**Choice pills:**
- Each menu option renders as a colored pill extending from its parent menu node
- 6-color rotation (pills cycle through 6 distinct colors for visual differentiation)
- Each pill displays the player-visible choice text
- Pills with an `if` condition show a generic warning icon (not the condition text); hover the pill to see the actual condition (e.g. `if has_key`) in a tooltip

**Purpose:** Visualize the player experience -- what choices appear, what conditions gate them, and where each choice leads. Complements the Flow Canvas, which shows code structure rather than player-facing content.

**Edge types:**

| Arrow Style | Meaning |
|-------------|---------|
| Solid line | `jump` or `call` -- player choice leads to this label. Both use the same solid connector; a direct (non-pill) `call` target additionally gets a small "call" text label printed above its card. |

**Key differences from Flow Canvas:**
- Only labels involved in or reachable from `menu:` statements appear
- Choice pills replace generic edge labels, showing the actual text the player reads
- Condition guards are shown as an icon on the pill, with the condition text available on hover

### 3.4 Shared Canvas Features

These features are available on all three canvases, with one exception noted below (Minimap).

| Feature | Shortcut / Trigger | Description |
|---------|--------------------|-------------|
| Go-to-Label | `Ctrl+G` / `Cmd+G` | Fuzzy-search command palette. Selecting a label pans and zooms the canvas to that node at 100% zoom. |
| Keyboard Pan/Zoom | Hold `W`/`A`/`S`/`D` to pan, `Q`/`E` to zoom toward viewport center | Continuous game-camera-style motion while held. Scoped to whichever canvas is hovered or focused (a split view only moves the active pane); suppressed while typing in any text field, sticky note, or the Monaco editor |
| Toolbox Search | Search field in Toolbox panel | Filter visible nodes by name |
| Fit-to-Screen | Floating button (bottom-right of canvas) or `F` | Adjusts zoom and pan to fit all nodes in the viewport |
| Go-to-Start | Floating button (bottom-right of canvas) | Pans to the `label start` node |
| Auto-Center | Automatic on navigate | Canvas centers on the target node when navigating from other panels |
| Minimap | Toggle in canvas toolbar (**Project Canvas only**) | Small overlay showing the full canvas with a viewport indicator rectangle. On **Project Canvas** it is on by default and can be toggled via a checkbox. On **Flow Canvas** and **Choices Canvas** it always renders with no toggle to hide it. |
| Sticky Notes | Sticky-note toolbar button or context menu | Colored notes (6 colors) with Markdown rendering. Can be promoted to Diagnostics Tasks via checkbox. Each canvas has its own set of notes. |
| Keyboard Navigation | `Arrow Keys`, `Enter`, `Escape` | Full keyboard traversal of canvas nodes (see Canvas shortcuts in [Keyboard Shortcuts](/reference/keyboard-shortcuts)) |
| ARIA Accessibility | Automatic | All blocks and nodes carry descriptive ARIA labels for screen readers (NVDA, VoiceOver, JAWS) |

**Sticky note details:**

| Property | Details |
|----------|---------|
| Colors available | 6 colors (yellow, blue, green, pink, purple, red) |
| Content format | Markdown (rendered via `marked`) |
| Storage | Three separate arrays, one per canvas. Saved to `game/project.ide.json` |
| Promote to task | Toggle checkbox on a note to convert it to a Diagnostics Task |
| Positioning | Drag to reposition freely on the canvas |

**Context menu actions (right-click on canvas):**

| Action | Description |
|--------|-------------|
| Story Block / Screen Block / Config Block | Create a new block of that type at the click location (Project Canvas only) |
| Sticky Note | Place a new sticky note at the click location |

Fit to Screen and Go to Start are not context-menu items -- they are standalone floating icon buttons docked in the bottom-right corner of the canvas. Organize Layout (running an auto-layout algorithm) is triggered from the Canvas Layout Controls widget in the canvas's own top-left toolbox, not the right-click menu.

| Action | Description |
|--------|-------------|
| Center on Canvas | (Right-click a block in Project Explorer) Navigate to that block on the canvas |
