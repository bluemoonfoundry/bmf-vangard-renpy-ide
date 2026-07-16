# Keyboard Shortcuts

## Global

| Action | Windows / Linux | macOS |
|--------|----------------|-------|
| Save All | `Ctrl+S` | `Cmd+S` |
| Close Active Tab | `Ctrl+W` | `Cmd+W` |
| Quit | `Ctrl+Q` | `Cmd+Q` |
| Run Project | `F5` | `F5` |
| Stop Project | `Shift+F5` | `Shift+F5` |
| Warp to Label | `Ctrl+Shift+G` | `Cmd+Shift+G` |
| Search in Files | `Ctrl+Shift+F` | `Cmd+Shift+F` |
| Go to Label | `Ctrl+G` | `Cmd+G` |
| Settings | `Ctrl+,` | `Cmd+,` |
| Keyboard Shortcuts | `Ctrl+/` | `Cmd+/` |

## Canvas

| Action | Windows / Linux | macOS |
|--------|----------------|-------|
| New Block | `N` | `N` |
| Group Selected Blocks | `G` | `G` |
| Pan Canvas | `Shift+Drag` | `Shift+Drag` |
| Zoom In / Out | `Mouse Scroll` | `Mouse Scroll` |
| Select Multiple | `Ctrl+Click` or rubber-band | `Cmd+Click` or rubber-band |
| Delete Selected | `Delete` | `Delete` |
| Fit to Screen | `F` | `F` |
| Navigate Back (Flow Canvas) | `[` | `[` |
| Navigate Forward (Flow Canvas) | `]` | `]` |
| Spatial Navigation | `Arrow Keys` | `Arrow Keys` |
| Open Focused Block | `Enter` | `Enter` |
| Open Block in Editor | `Double Click` | `Double Click` |
| Deselect All | `Escape` | `Escape` |

## Editor

| Action | Windows / Linux | macOS |
|--------|----------------|-------|
| Go to Definition | `Ctrl+Click` | `Cmd+Click` |
| Find in File | `Ctrl+F` | `Cmd+F` |
| Find / Replace | `Ctrl+H` | `Cmd+H` |
| Toggle Line Comment | `Ctrl+/` | `Cmd+/` |
| Move Line Up | `Alt+Up` | `Option+Up` |
| Move Line Down | `Alt+Down` | `Option+Down` |
| Delete Line | `Ctrl+Shift+K` | `Cmd+Shift+K` |
| Multi-Cursor Add | `Alt+Click` | `Option+Click` |
| Column Selection | `Shift+Alt+Drag` | `Shift+Option+Drag` |

## Undo/Redo Scope

Canvas-level Undo and Redo are triggered from the **Undo**/**Redo** buttons in the toolbar -- there is no keyboard shortcut wired to them; `Ctrl+Z`/`Ctrl+Y` only perform standard text-field undo/redo when focus is inside an editor or input, they do not affect canvas state. The following table clarifies what canvas undo/redo covers.

| Covered by Undo/Redo | Not Covered |
|-----------------------|-------------|
| Block creation and deletion | Editor text changes (Monaco has its own undo stack) |
| Block moves and resizing | File system operations (create/rename/delete files) |
| Composition edits | Settings and preferences |
| | Asset imports and scans |
| | Canvas zoom and pan transforms |

The undo stack has no fixed size limit. Undo is unavailable at the initial project state.
