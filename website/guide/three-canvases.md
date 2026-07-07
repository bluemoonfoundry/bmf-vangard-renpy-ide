# Seeing Your Story — The Three Canvases

The canvases are the heart of Vangard Studio. They take the invisible structure of your visual
novel -- the web of labels, jumps, calls, and choices buried across `.rpy` files -- and
make it something you can see, navigate, and rearrange. Each of the three canvases shows
your project from a different angle. Together, they answer the three fundamental questions
of visual novel development: *How are my files organized?* *How does the narrative flow?*
and *What does the player experience?*

## Project Canvas

![The Project Canvas showing .rpy files as connected blocks](/story-canvas-basic.png)

The **Project Canvas** is what you see first when you open a project. Each `.rpy` file in
your `game/` directory appears as a rectangular block on the canvas. The blocks are
color-coded -- each block's color is deterministically derived from its title through a
string hash, so the same file always gets the same color, and different files get visually
distinct hues. This makes it easy to spot a particular file on a crowded canvas even
before you read its name.

### Blocks and Arrows

When your code contains a `jump` or `call` statement that targets a label defined in a
different file, Vangard Studio draws an arrow from the source block to the target block. This
means you can *see* the connections between your script files without reading a single
line of code.

Consider this scenario. You have a file called `chapter1.rpy`:

```renpy
label chapter1_end:
    "The chapter draws to a close."
    jump chapter2_start
```

And a file called `chapter2.rpy`:

```renpy
label chapter2_start:
    "A new day begins."
```

On the Project Canvas, you will see an arrow drawn from the `chapter1` block to the
`chapter2` block, representing that `jump` connection. If you later rename
`chapter2_start` to `chapter2_intro` but forget to update the `jump` in `chapter1.rpy`,
the arrow disappears and the `chapter1` block begins to glow red -- a diagnostic warning
that a jump target does not exist. You found the bug in seconds, without running the
game.

### Diagnostic Glow

Blocks on the Project Canvas glow to indicate problems in their underlying file:

- A **red glow** means the file contains at least one error-level diagnostic (such as a
  jump to a nonexistent label, a reference to a missing image, or a syntax error).
- An **amber glow** means there are warnings but no errors (such as an unused character
  definition or a potentially unreachable label).
- **No glow** means the file is clean.

This gives you an at-a-glance health check for your entire project. Open the Project
Canvas, scan for color -- any red or amber blocks need attention. You do not need to open
the diagnostics panel unless you want details.

### Organizing the Canvas

You can drag blocks freely to arrange them however makes sense to you -- by chapter, by
route, by character involvement, or any scheme you like. Block positions are saved
automatically to `.renide/project.json`, so your layout persists between sessions.

When you want a quick automatic layout instead of manual positioning, click the
**Organize Layout** button in the toolbar. Vangard Studio offers four layout algorithms:

- **Flow (Left to Right)** -- arranges blocks in a left-to-right flow following jump
  connections. Good for linear or mostly-linear stories.
- **Flow (Top to Down)** -- the same logic, but oriented top to bottom. Some users
  find vertical flow easier to read for stories with many parallel branches.
- **Connected Components** -- groups blocks that are connected by jumps and calls into
  clusters, separating isolated parts of the project. Useful for projects with distinct
  arcs or standalone utility files.
- **Clustered Flow** -- combines flow direction with clustering, giving you both
  left-to-right ordering and visual grouping. The best default for complex projects.

Pick the algorithm that suits your project's shape. You can always drag blocks afterward
to fine-tune the result. Experiment freely -- `Ctrl+Z` / `Cmd+Z` undoes canvas layout
changes.

### Character Filter and Role Tinting

Large projects might have dozens of blocks on screen at once, and not all of them are
relevant to what you are working on right now. The **character filter** helps you focus.
Select a character from the filter dropdown, and only the blocks containing dialogue for
that character remain fully visible; everything else fades into the background.

This is particularly useful when you are reviewing a specific character's arc across the
game. Select "Elena" and immediately see which files she appears in and how they connect
-- without the visual noise of the other 40 blocks.

**Role tinting** takes this a step further by coloring blocks according to which
characters appear in them. Instead of the default hash-derived colors, each block takes
on a tint based on its cast. This turns the canvas into a character map: you can see at a
glance which parts of the story feature which characters, and spot sections where a
character drops out of the narrative unexpectedly.

### Groups

When you want to visually bundle related blocks -- say, all the files that belong to
"Chapter 3" or "Romance Route" -- select the blocks (rubber-band or `Ctrl+Click`) and
press `G`. This creates a **group**: a labeled rectangle drawn behind the selected blocks.

Groups are purely organizational. They do not affect your code, the analysis, or the
arrows. You can name groups, resize them, and recolor them. Drag the group header to move
all contained blocks at once, keeping the spatial relationship intact. This is helpful for
maintaining a neat canvas as your project grows.

### The Legend

If you are ever unsure what a particular arrow color or style means, toggle the **legend
overlay** on the canvas. It shows a visual key explaining the different arrow types (jump
vs. call), what the glow colors mean, and any other visual conventions. Think of it as
the key in the corner of a map.

## Flow Canvas

![The Flow Canvas showing label-level narrative flow](/route-canvas-basic.png)

The **Flow Canvas** shifts the granularity from files to labels. Instead of one block per
`.rpy` file, you see one node per `label` statement in your entire project. Every `jump`,
`call`, and fall-through between labels becomes a visible edge. This is the narrative flow
of your visual novel, drawn as a directed graph.

The distinction matters. A single `.rpy` file might contain five labels. On the Project
Canvas, all five are represented by one block. On the Flow Canvas, each label is its own
node with its own connections. This finer granularity lets you trace the exact path a
player takes through the narrative.

### Edge Types

The edges use visual styling to distinguish connection types:

- **Solid lines** represent `jump` statements. Execution moves from one label to another
  and does not return. In narrative terms, the player has permanently left the source
  scene.
- **Dashed lines** represent `call` statements. Execution moves to the target label but
  will return to the caller when it hits a `return` statement. This is common for
  reusable scenes like flashbacks or minigames.
- **Dotted lines** represent fall-throughs -- cases where one label ends without a `jump`
  or `return`, and execution simply continues to the next label defined below it in the
  same file.

Understanding these edge types at a glance saves you from having to read the code. When
you see a cluster of dashed lines converging on a single node, you know that node is a
shared subroutine called from multiple places. When you see a chain of dotted lines, you
know those labels are sequential within the same file.

### Unreachable Labels

If the analysis determines that a label cannot be reached from any other label -- no
`jump`, `call`, or fall-through leads to it -- the Flow Canvas flags it visually. These
unreachable labels often indicate dead code: a scene you wrote but forgot to connect, a
label you renamed without updating all the references, or an old branch you meant to
delete.

The diagnostics panel lists unreachable labels too, but seeing them on the canvas makes
the problem spatially obvious. The orphaned node sits alone, unconnected, while the rest
of the graph is woven together.

### Menu Nodes

When your code contains a `menu:` block with player choices, the Flow Canvas represents
it as a special **menu node** distinct from ordinary label nodes. Hover over a menu node
and the **Menu Inspector** popover appears, showing:

- Every choice in the menu.
- The label each choice jumps or calls to.
- Any `if` conditions that guard the choice (making it conditional on game state).

For example, given this code:

```renpy
label confrontation:
    "You stare at the letter in your hands."

    menu:
        "Tell the truth":
            jump confession
        "Stay silent" if has_secret:
            jump silence
        "Change the subject":
            jump deflection
```

The Flow Canvas shows a menu node for `confrontation` with three outgoing edges. The
popover reveals the choice text for each edge, and "Stay silent" is annotated with its
`if has_secret` condition. You can see the branching logic without opening the file.

### Route Highlighting

Complex visual novels have many interleaving routes -- a romance path, a friendship path,
a rivalry path, each weaving through shared and unique scenes. The Flow Canvas can
highlight specific **routes** in distinct colors. Open the route panel, select a route,
and the nodes and edges that belong to it light up while everything else dims.

This is invaluable for verification. You can trace a single route from start to finish
and confirm it reaches a proper ending, without being distracted by the nodes that belong
to other paths. Switch to a different route and a different color highlights a different
path through the same graph.

### Node Badges

Each node on the Flow Canvas carries a small **role badge** indicating its structural
function in the narrative:

- **Start** -- a label that serves as an entry point (typically `label start` or a label
  explicitly identified as a route beginning).
- **End** -- a label that contains a `return` statement or ends the game.
- **Choice** -- a label that contains a `menu:` block offering player decisions.
- **Decision** -- a label that branches based on conditional logic (Python `if` blocks
  with `jump` statements), without presenting a visible choice to the player.
- **Story** -- a standard narrative label with no special structural role.

These badges let you scan the graph quickly and identify the decision points, the
endpoints, and the spine of the narrative. When you are debugging a path that seems to
skip an ending, look for nodes with the End badge and check whether any route actually
reaches them.

## Choices Canvas

![The Choices Canvas showing player-facing decision pills](/choice-canvas-basic.png)

The **Choices Canvas** answers the question that matters most to your players: *What will
I see?*

Where the Flow Canvas shows code-level structure -- every label, every control flow edge,
every implementation detail -- the Choices Canvas strips away the implementation and shows
only what the player encounters. Menu nodes fan out into color-coded **choice pills**,
each displaying the exact text the player will read.

If a choice has an `if` condition guard, it appears as a small badge on the pill. This
tells you at a glance which options are always available and which depend on game state.
For example, a pill reading "Confront the villain" with a badge `if courage >= 5` makes
it clear that this option is conditional -- the player needs enough courage points to see
it.

The choice pills use a rotation of six colors to distinguish branches visually. As you
follow the pills across the canvas, you are tracing the player's decision tree -- not the
developer's label graph. This view is particularly useful during playtesting discussions
("if the player picks option A at this fork, where do they end up three choices later?")
and for writers who want to verify that every path offers meaningful decisions rather than
illusory ones.

The difference between the Flow Canvas and the Choices Canvas is perspective. The Flow
Canvas is for developers who need to understand the code. The Choices Canvas is for
storytellers who need to understand the experience.

## Shared Canvas Features

All three canvases share a set of navigation, annotation, and accessibility tools. These
work identically regardless of which canvas is active.

### Go-to-Label Palette

Press `Ctrl+G` (Windows/Linux) or `Cmd+G` (macOS) from any canvas to open the
**Go-to-Label** command palette. A search field appears at the top of the screen. Start
typing a label name and the palette filters results with fuzzy matching -- you do not need
to type the full name, just enough characters to narrow it down.

Select a label from the results and the canvas pans and zooms to center it on screen,
automatically setting the zoom level to 100% so you can read the details. On the Flow and
Choices canvases, it highlights the target node. On the Project Canvas, it centers the
block that contains the label.

This is the fastest way to navigate a large project. Instead of scrolling and searching
visually across a canvas with hundreds of nodes, you type a few characters and arrive
instantly.

### Toolbox Label Search

Each canvas also has a persistent search box in the **Canvas Toolbox** (a floating panel
at the edge of the canvas that you can toggle on and off). This works like Go-to-Label
but stays open, letting you search and jump repeatedly without reopening a modal each
time. It is useful when you are actively tracing a path through the story and need to hop
between labels in quick succession.

### Sticky Notes

Click the `Add Note` button in the toolbar (or right-click the canvas background and
choose `Add Note`) to place a **sticky note** on the canvas. Notes come in six colors --
yellow, blue, green, pink, purple, and red -- and support Markdown formatting in their
content. Use them however you like:

- "TODO: add CG for the sunset scene here"
- "This route needs a third ending before the beta"
- "Reviewed by Sarah, April 15 -- dialogue approved"

Each canvas maintains its own set of sticky notes, so your Project Canvas annotations do
not clutter the Flow Canvas. Drag notes to reposition them. Resize them if you need more
space.

If a note represents actual work to be done, check the **Promote to task** checkbox to
convert it into a **diagnostics task** that appears in the Diagnostics panel alongside
your code issues. This bridges the gap between informal canvas annotations and a
trackable task list that the whole team can see.

### Canvas Minimap

Toggle the **minimap** to show a small overview of the entire canvas in the corner of the
screen. The minimap displays a shaded rectangle representing your current viewport
position, so you always know where you are relative to the full project. Click or drag on
the minimap to jump to a different region instantly. This is especially useful on large
projects where the canvas extends far beyond a single screen.

### Keyboard Navigation and Accessibility

All three canvases are fully navigable by keyboard, which matters both for efficiency and
for accessibility:

- `Tab` moves focus to the next block or node. `Shift+Tab` moves backward.
- Arrow keys navigate spatially: press `Right` to move focus to the nearest block to the
  right, `Down` to move to the nearest block below, and so on.
- `Enter` opens the focused block in the code editor.
- `Escape` deselects the current selection.

Every block and node carries ARIA labels describing its content, connections, and
diagnostic state. Users of screen readers (NVDA, VoiceOver, JAWS) can navigate the canvas
and understand the story structure without relying on visual cues alone. The canvas
announces block names, connection counts, and diagnostic summaries as focus moves.

### Fit-to-Screen, Go-to-Start, and Auto-Center

The canvas navigation controls (available in the floating toolbox and via keyboard
shortcuts) include three quick-navigation actions:

- **Fit-to-Screen** -- zooms out and pans to show every block or node on the canvas
  within the current viewport. Useful when you have been zoomed into one corner and want
  to see the big picture again.
- **Go-to-Start** -- pans directly to the `label start` node (or the entry point of
  your project). One click to return to the beginning.
- **Auto-Center** -- centers the viewport on the currently selected block or node,
  adjusting zoom if needed.

These are small conveniences that add up over a long editing session. When you are deep in
a corner of a 200-block canvas and need to jump back to the beginning, `Go-to-Start`
saves you from scrolling blindly through the graph.
