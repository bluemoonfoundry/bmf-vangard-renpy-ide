# The Interface at a Glance

When you open a project in Vangard Studio for the first time, the window arranges itself into
several clear regions. This chapter gives you a quick orientation so you know what
everything is called and where to find it. Later chapters explore each area in depth.

Think of this chapter as a labeled photograph. We will point to each region, name it, and
tell you enough to get started -- then move on.

![Vangard Studio's main window layout](/app-layout.png)

## The Toolbar

The toolbar runs along the top of the window. It is divided into three logical sections.

**Left section** -- editing and canvas actions:
- `Undo` and `Redo` buttons (for canvas operations like moving blocks and creating
  scenes; the code editor has its own undo stack).
- `New Scene` -- creates a new `.rpy` file and block. The keyboard shortcut `N` does
  the same thing from the canvas.
- `Add Note` -- places a sticky note on the current canvas.
- `Organize Layout` -- runs the active canvas's auto-layout algorithm immediately (no
  dropdown). The four underlying layout algorithms (flow left-to-right, flow top-down,
  connected-components, and clustered-flow) exist in `storyCanvasLayout.ts` and can be
  selected via the separate Canvas Layout Controls surface, not from this toolbar
  button.
- `Diagnostics` -- opens the diagnostics panel. When there are errors in your project, a
  red badge shows the count.
- `Script Statistics` -- opens the Script Statistics view.
- `Translation Dashboard` -- opens the Translation Dashboard.

**Center section** -- three canvas tabs: **Project Canvas**, **Flow Canvas**, and
**Choices Canvas**. Click a tab to switch the main view to that canvas. The currently
active tab is highlighted.

**Right section** -- run controls and settings:
- `Drafting Mode` toggle -- enables placeholder generation for missing assets so your
  game can run during development.
- `Warp to Label` -- launches the game and jumps directly to a specific label.
- `Run` / `Stop` -- starts or stops the Ren'Py game process. `Run` is `F5`; `Stop` is
  `Shift+F5`.
- `Save All` -- writes every unsaved file to disk at once (`Ctrl+S` / `Cmd+S`).
- `Settings` -- opens the settings modal for theme, font, SDK path, and other
  preferences.

A button-by-button reference for every toolbar item appears in Part Two. For now, just
know that the toolbar is your command center for project-wide actions that are not
specific to a single file or editor.

## The Project Explorer

The left sidebar is the **Project Explorer** -- a hierarchical file tree showing every
file and folder in your project. It works like the file explorer in any desktop IDE. You
can:

- Create new files and folders.
- Rename, delete, copy, cut, and paste files.
- Drag and drop files between folders.
- Right-click a `.rpy` file for context options like `Center on Canvas` (which pans the
  Project Canvas to that file's block), `New File...`, `New Folder...`, `Rename`,
  `Delete`, `Cut`, `Copy`, and `Paste`.

The explorer also has a `Refresh` option (in its context menu and the `File`
menu) that reconciles the file tree with what is actually on disk. This is useful when
you have been editing or adding files outside of Vangard Studio -- for example, in a terminal or
another editor. The refresh detects new files, removed files, and externally modified
content, updating the IDE state to match reality.

## The Canvas Area

The large central region is the **canvas area**. This is where the visual representation
of your project lives. Which canvas you see depends on the tab selected in the toolbar:

- **Project Canvas** -- blocks representing `.rpy` files, with arrows for `jump`/`call`
  connections.
- **Flow Canvas** -- nodes representing individual labels, with edges for every control
  flow transition.
- **Choices Canvas** -- the player's decision tree, with color-coded choice pills.

You can pan the canvas by holding `Shift` and dragging (or by configuring your preferred
pan behavior in Settings). Zoom in and out with the mouse scroll wheel. Select items by
clicking, or drag a rubber-band rectangle to select multiple items at once. Hold `Ctrl`
(or `Cmd` on macOS) and click to add individual items to your selection.

When no canvas tab is active -- for example, when you have clicked into a code editor tab
or an asset viewer -- the canvas area shows that view instead. The canvas and the editor
share the same central space, switching based on which tab is focused.

## The Code Editor

Click any block on the Project Canvas (or double-click a `.rpy` file in the Project
Explorer) and a code editor tab opens in the central area. The editor is Monaco-based --
the same engine behind Visual Studio Code -- so you get the full suite of modern editor
features:

- Syntax highlighting tuned specifically for Ren'Py (TextMate grammar + semantic tokens).
- Context-aware autocomplete for labels, characters, images, screens, and variables.
- Find-and-replace with regex support.
- Multi-cursor editing and column selection.
- Code folding.
- Split panes (drag a tab to the edge of the editor to create a side-by-side layout).

You can have multiple files open in tabs simultaneously. Tabs are lazy-loaded on first
activation and stay mounted in the background to preserve your scroll position and cursor
state when you switch between them. [Chapter 6](/guide/writing-code) covers the editor in full depth.

## The Story Elements Sidebar

The right sidebar is called **Story Elements**. It uses a single flat tab layout: one
vertical icon nav lists all ten tabs side by side, with no category grouping.

| Tabs |
|------|
| Characters, Variables, Screens |
| Images, Audio |
| Scene Compositions, Image Maps |
| Code Snippets, Menu Templates, Color Palette |

This is where you browse and manage everything beyond the code itself. The Characters
tab lists every `define Character(...)` in your project. The Images tab shows
thumbnails of your art assets. The Scene Compositions and Image Maps tabs open visual
editors for building scenes and imagemaps. The Code Snippets, Menu Templates, and
Color Palette tabs give you access to your snippet library, the menu constructor, and a
color picker with multiple palettes.

Each tab is covered in its relevant chapter later in the guide. For now, the key
point is that the Story Elements sidebar is always one click away on the right edge of
the window, and it lists everything that is not source code as a single flat set of tabs.

## The Status Bar

At the very bottom of the window, a thin status bar shows contextual information: an
activity label (`Ready`, `Saving...`, `Analyzing...`, `Scanning assets...`, or
`Save failed...`), a screenshot counter, error/warning counts, a file/block count, and
the app version. There is no cursor position or selection range display anywhere in the
IDE, and the idle state reads "Ready", not "Saved..". It is unobtrusive by design -- a
quick reference line you glance at rather than interact with.
