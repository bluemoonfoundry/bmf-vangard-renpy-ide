# Story Elements Reference

### 5.1 Overview

The Story Elements sidebar uses a two-level tab layout. The top level has four category tabs; each category contains sub-tabs.

| Category | Sub-tab | Contents | Key Actions |
|----------|---------|----------|-------------|
| Story Data | Characters | All `define Character(...)` definitions with name, tag, color, dialogue count | Add, Edit, Find Usages, Open Profile Editor |
| Story Data | Variables | All `define`/`default` global variables with current values | Find Usages |
| Story Data | Screens | All `screen` definitions | Jump to Definition, Add with Boilerplate |
| Assets | Images | Folder tree of project images with thumbnails | Scan External Directory, Copy `scene`/`show` Statement, Drag to Composers |
| Assets | Audio | Folder tree of project audio files | Scan External Directory, Copy `play music`/`play sound`/`queue audio`, Play Preview |
| Composers | Scenes | Scene Composer instances | Create, Edit, Delete, Copy Ren'Py Code, Export PNG |
| Composers | ImageMaps | ImageMap Composer instances | Create, Edit, Delete, Copy Screen Code |
| Composers | Screen Layouts | Screen Layout Composer instances | Create, Duplicate to Edit, Delete, Copy Screen Code |
| Tools | Snippets | Grid library of code snippets with fuzzy search | Insert at Cursor, Filter by Category |
| Tools | Menus | Menu Constructor and saved templates | Create Menu, Save Template, Load Template, Copy Code |
| Tools | Colors | Color picker with palette tabs | Insert at Cursor, Wrap in `{color}` Tags, Copy Hex, Drag Swatch |

### 5.2 Character Profile Editor

Opened by selecting a character and clicking Edit (or double-clicking). Provides a dedicated view for all `Character()` parameters.

| Parameter Group | Fields |
|----------------|--------|
| Name styling | `name` display text, `who_color`, `who_font`, `who_size`, `who_bold`, `who_italic`, `who_outlines` |
| Dialogue styling | `what_color`, `what_font`, `what_size`, `what_bold`, `what_italic`, `what_outlines`, `what_prefix`, `what_suffix` |
| Text speed | `what_slow_cps` (characters per second), `what_slow_abortable` |
| Click-to-continue (CTC) | `ctc` displayable, `ctc_pause` displayable, `ctc_position` |
| Window properties | `window_background`, `window_style` |
| Notes | Free-text notes field (IDE-only, not written to `.rpy`) |

### 5.3 Custom Snippets

| Property | Details |
|----------|---------|
| File location (project) | `.renide/snippets.json` |
| File location (global) | User data directory (platform-specific) |
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

Templates are saved to `.renide/ide-settings.json` and persist across sessions. Each template stores the full menu structure including choice text, conditions, and action configuration.

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
