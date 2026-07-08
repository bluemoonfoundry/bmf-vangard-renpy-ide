# Toolbar Reference

Buttons are listed in order from left to right. The center group contains the canvas switchers. All other buttons sit on the left or right side of the toolbar.

| Position | Icon | Button | Function | Shortcut |
|----------|------|--------|----------|----------|
| Left 1 | Curved arrow left | **Undo** | Undo last canvas action (block move, create, delete) | `Ctrl+Z` / `Cmd+Z` |
| Left 2 | Curved arrow right | **Redo** | Redo last undone canvas action | `Ctrl+Y` / `Cmd+Y` |
| Left 3 | Plus with "N" | **New Scene** | Open the Create Block modal to add a new `.rpy` file | `N` (canvas focused) |
| Left 4 | Sticky note | **Add Note** | Place a sticky note on the active canvas | -- |
| Left 5 | Grid / tree | **Organize Layout** | Run auto-layout algorithm on the active canvas | -- |
| Left 6 | Warning triangle | **Diagnostics** | Open the Diagnostics tab. Red badge shows active error count | -- |
| Left 7 | Globe | **Translations** | Open the Translation Dashboard | -- |
| Left 8 | Bar chart | **Stats** | Open the Project Statistics tab | -- |
| Center 1 | Canvas icon | **Project Canvas** | Switch to the file-level Project Canvas | -- |
| Center 2 | Flow icon | **Flow Canvas** | Switch to the label-level Flow Canvas | -- |
| Center 3 | Branch icon | **Choices Canvas** | Switch to the player-perspective Choices Canvas | -- |
| Right 1 | Dashed rectangle | **Drafting Mode** | Toggle placeholder generation for missing assets | -- |
| Right 2 | Target / warp | **Warp to Label** | Open the Warp to Label picker | `Ctrl+Shift+G` / `Cmd+Shift+G` |
| Right 3 | Play triangle | **Run** | Launch the Ren'Py game via SDK | `F5` |
| Right 3 (alt) | Square stop | **Stop** | Stop the running game | `Shift+F5` |
| Right 4 | Floppy disk | **Save All** | Save all modified files to disk | `Ctrl+S` / `Cmd+S` |
| Right 5 | Gear | **Settings** | Open the Settings panel | `Ctrl+,` / `Cmd+,` |

**Notes:**
- The Diagnostics badge only appears when one or more errors exist. The count reflects errors only, not warnings or info items.
- The Run button changes to a Stop button while a game is running.
- Drafting Mode is a session-only toggle -- it does not persist between application restarts.
- The canvas switcher in the center highlights the currently active canvas. Only one canvas is visible at a time.
