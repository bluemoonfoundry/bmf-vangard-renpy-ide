# Story Elements Reference

### 5.1 Overview

The Story Elements sidebar uses a single, flat tab layout: a vertical icon nav (`role="tablist"`) lists all ten tabs directly, with no category grouping.

| Tab (tooltip label) | Contents | Key Actions |
|----------|----------|-------------|
| Characters | All `define Character(...)` definitions with name, tag, color, dialogue count | Add, Edit, Find Usages, Open Profile Editor |
| Variables | All `define`/`default` global variables with current values | Find Usages |
| Screens | All `screen` definitions | Jump to Definition (read-only list -- no creation UI) |
| Images | Folder tree of project images with thumbnails | Scan External Directory, Copy `scene`/`show` Statement, Drag to Composers |
| Audio | Folder tree of project audio files | Scan External Directory, Copy `play music`/`play sound`/`queue audio`, Play Preview |
| Scene Compositions | Scene Composer instances | Create, Edit, Delete, Copy Ren'Py Code, Export PNG |
| Image Maps | ImageMap Composer instances | Create, Edit, Delete, Copy Screen Code |
| Code Snippets | Grid library of code snippets with fuzzy search | Insert at Cursor, Filter by Category |
| Menu Templates | Menu Constructor and saved templates | Create Menu, Save Template, Load Template, Copy Code |
| Color Palette | Color picker with a palette dropdown | Insert at Cursor, Wrap in `{color}` Tags, Copy Hex, Drag Swatch |

### 5.2 Character Profile Editor

Opened by selecting a character and clicking Edit (or double-clicking). Provides a dedicated view for the character's editable fields.

| Field Group | Fields |
|----------------|--------|
| Primary attributes | Display Name, Code Tag, Name Color, Dialogue Color (with an Override toggle -- unchecked uses the theme default), Image Tag (search box + picker), Profile / Notes (free-text, IDE-only, not written to `.rpy`) |
| Name Label formatting (Advanced) | Name Prefix (`who_prefix`), Name Suffix (`who_suffix`) |
| Dialogue Text formatting (Advanced) | Dialogue Prefix (`what_prefix`), Dialogue Suffix (`what_suffix`) |
| Text Speed (Advanced) | Use Slow Text toggle (`slow`), Text Speed in chars/sec (`slow_speed`), Player can skip slow text (`slow_abortable`) |
| Click-to-Continue (Advanced) | CTC Displayable (`ctc`), CTC Position (`ctc_position`: nestled or fixed) |

There are no font, size, bold, italic, outline, or window-background/style fields -- those `Character()` parameters are not exposed by the editor and must be hand-edited in `.rpy` if needed.

### 5.3 Custom Snippets

Snippets are merge-loaded from three sources, in priority order (higher overrides lower for same-named categories):

| Source | File location | Priority |
|--------|---------------|----------|
| Built-in | `snippets/default-snippets.json` (bundled with the app) | Lowest |
| User-global | `snippets/custom.json` inside the Electron userData directory (e.g. `%APPDATA%\vangard-studio\snippets\custom.json` on Windows) | Middle |
| Project-specific | `<project>/.vangard/snippets.json` | Highest |

Snippets you create from the sidebar's `+ New` button (the "My Snippets" section) are stored separately, in `appSettings.userSnippets` inside the single global `app-settings.json` file in the Electron userData directory. These are global to your machine, not project-scoped -- they do not travel with the project.

| Property | Details |
|----------|---------|
| Format | JSON with `version`, `categories` array (see [Editor Reference §4.7](/reference/editor-reference)) |
| Trigger | Select from Snippets grid and click Insert, or use category filter + fuzzy search |
| Placeholder syntax | `${1:text}`, `${2:text}`, `$0` for tab stops and final cursor |

### 5.4 Menu Templates

The Menu Constructor allows building `menu:` blocks visually and saving them as reusable templates.

| Action Type | Ren'Py Output |
|-------------|--------------|
| `jump` | `jump label_name` -- transfers control to target label |
| `call` | `call label_name` -- transfers with return |
| `pass` | `pass` -- no action (placeholder choice) |
| `return` | `return` -- returns from current call |
| `code` | Custom code block -- arbitrary Ren'Py statements |

Templates are saved to `appSettings.menuTemplates`, persisted in the global `app-settings.json` file in the Electron userData directory (the same global file that stores custom snippets), and persist across sessions. Each template stores the full menu structure including choice text, conditions, and action configuration.

**Menu Constructor workflow:**
1. Add choice items with player-visible text
2. Optionally add `if` condition guards to choices
3. Set the action type and target for each choice
4. Optionally add custom code blocks within choices
5. Preview the generated Ren'Py code
6. Copy to clipboard or save as a reusable template

### 5.5 Color Picker Palettes

| Palette | Description |
|---------|-------------|
| Ren'Py Standard | Colors commonly used in Ren'Py projects (e.g., `#fff`, `#000`, `#f00`) |
| HTML Named | All 140+ standard HTML/CSS named colors |
| Material 500 | Google Material Design 500-weight palette |
| Pastel | Soft pastel tones suitable for character colors and UI |
| Project Theme | Auto-scanned hex color literals from all `.rpy` files in the current project (updates live) |

**Color actions:**
- Insert at cursor -- places the hex value at the editor cursor position
- Wrap in `{color}` tags -- wraps selected text with Ren'Py color markup `{color=#hex}...{/color}`
- Copy hex -- copies the hex string to clipboard
- Drag swatch -- drag a color onto any `ColorDropTarget` input in the IDE
