# Editor Reference

### 4.1 Syntax Highlighting

The editor uses a two-layer highlighting system:

| Layer | Technology | Purpose |
|-------|-----------|---------|
| TextMate tokenization | Oniguruma WASM + `renpy.tmLanguage.json` | Structural syntax coloring (keywords, strings, comments, operators) |
| Semantic token overlays | Monaco `DocumentSemanticTokensProvider` | Context-aware coloring based on live analysis data |

The TextMate grammar loads lazily on first editor mount. Semantic tokens update whenever the analysis result changes.

### 4.2 Semantic Token Types

The semantic overlay defines 9 token types. "Known" means the identifier resolves to a definition found in the project. "Unknown/Undefined" means no matching definition was found.

| Index | Token Type | Description | Coloring |
|-------|-----------|-------------|----------|
| 0 | `renpyLabel` | Label reference that resolves to a defined label | Known (valid) color |
| 1 | `renpyLabelUndefined` | Label reference with no matching `label` definition | Undefined (warning) color |
| 2 | `renpyCharacter` | Character tag in dialogue that resolves to a `define Character(...)` | Known color |
| 3 | `renpyCharacterUnknown` | Character tag in dialogue with no matching definition | Unknown color |
| 4 | `renpyImage` | Image name after `show`/`scene`/`hide` that resolves to a known image | Known color |
| 5 | `renpyImageUnknown` | Image name with no matching image definition or file | Unknown color |
| 6 | `renpyScreen` | Screen name that resolves to a defined `screen` | Known color |
| 7 | `renpyScreenUnknown` | Screen name with no matching `screen` definition | Unknown color |
| 8 | `renpyVariable` | Variable name in `$` expressions that matches a `define`/`default` declaration | Known color |

### 4.3 IntelliSense Contexts

Only a small set of line prefixes narrow the completion list. Everything else falls back to one unified "general" context.

| Context | Trigger | Completions Offered |
|---------|---------|-------------------|
| Jump / Call targets | Typing after `jump ` or `call ` (not `call screen `) | Only defined label names in the project |
| Call screen | Typing after `call screen ` | Only defined `screen` names, with their parameters |
| Image names | Typing after `show `, `scene `, or `hide ` | Only known image tags (from `image` statements and scanned files) |
| Variables | Typing in `$` expressions or a `python` block | Only `define`/`default` variable names |
| Inside a quoted string | Cursor sits inside an open `"..."` or `'...'` on the current line (dialogue text, filenames, etc.) | No suggestions -- see below |
| General (everything else) | Any other position, including the start of a dialogue line | Ren'Py keyword snippets, character tags, label names, variables, screen names, and user snippets, all returned together in a single list |

There is no dedicated "character tags only" or "screen names only" context outside of `call screen `. `show screen ` and `hide screen ` are matched by the broader `show `/`hide ` prefix check before any screen-specific check runs, so typing after them offers image names, not screen names.

Suggestions are intentionally suppressed while the cursor is inside a quoted string. Space and `$` are registered as completion trigger characters (so the general context can offer suggestions as you type a keyword), but the same trigger characters would otherwise fire on every space typed while writing dialogue prose, dumping the entire keyword/character/label/variable list mid-sentence. The editor detects open-quote context per line (accounting for `\"`-escaped quotes) and returns no suggestions there instead.

### 4.4 Dialogue Preview

The **Player View** panel appears below the editor when editing `.rpy` files. It renders a mock Ren'Py textbox that simulates how dialogue will look in-game.

- Updates in real time as the cursor moves through the file
- Shows the character name (with defined color) and dialogue text for the current line
- Renders `menu:` blocks as choice button previews
- Scrolls to follow the cursor position

### 4.5 Go to Definition

`Ctrl+Click` (Windows/Linux) or `Cmd+Click` (macOS) on a label target navigates to its definition.

| Target | Navigates To |
|--------|-------------|
| Label name (in `jump`/`call` statements) | The `label` definition line |

Character tags and screen names do not support Ctrl+Click navigation -- there is no click handler for them. Use Project-wide Search (Section 4.9) to locate a `define Character(...)` statement or a `screen` definition instead.

### 4.6 Built-in Snippets

Vangard Studio ships with 33 built-in snippets organized into 6 categories.

| Category | Count | Examples |
|----------|-------|---------|
| Dialogue & Narration | 4 | Standard Dialogue, Dialogue with Attributes, Narration, NVL-Mode Dialogue |
| Logic & Control Flow | 5 | Simple If/Else, If/Elif/Else, Choice Menu, Jump to Label, Call Label |
| Images | 10 | Show Image, Show at Position, Scene Statement, Hide Image, Image Definition, Solid Color, Placeholder, Simple Animation, Condition Switch, Layered Image |
| Visuals & Effects | 3 | Scene with Transition, Simple Transition, Pause |
| ATL & Transforms | 7 | Basic Transform, Linear Movement, Fade In/Out, Zoom Pop, Repeating Bobbing, Parallel Animation, On Show/Hide Events |
| Audio | 4 | Play Music, Play Sound Effect, Stop Music, Queue Music |

### 4.7 User Snippet Format

Vangard Studio distinguishes two different snippet shapes:

- **Built-in / project & global snippet files** -- the bundled `snippets/default-snippets.json` library, plus any project- or user-level JSON files that follow the same `{version, categories: [{name, snippets: [{title, description, code}]}]}` shape:
  - **Project-specific:** `<project>/.vangard/snippets.json`
  - **Global:** `<user data directory>/snippets/custom.json`

  ```json
  {
    "version": "1.0",
    "categories": [
      {
        "name": "Category Name",
        "snippets": [
          {
            "title": "Snippet Title",
            "description": "What this snippet does.",
            "code": "label ${1:label_name}:\n    ${2:dialogue}\n    $0"
          }
        ]
      }
    ]
  }
  ```

  When multiple sources of this kind exist, categories with the same name are merged. Priority order: built-in (lowest) < user global < project-specific (highest).

- **User-created snippets** (added via the Snippet Manager panel and offered by Monaco autocomplete in the general IntelliSense context) -- stored as `UserSnippet` objects in app settings, not as a standalone category file. Each entry has this shape:

  | Field | Type | Meaning |
  |-------|------|---------|
  | `id` | `string` | Unique identifier |
  | `title` | `string` | Display name shown in the Snippet Manager and completion list |
  | `prefix` | `string` | Trigger prefix shown in the Snippet Manager UI |
  | `description` | `string` | Shown as the completion item's documentation text |
  | `code` | `string` | Plain-text snippet body, used if `monacoBody` is absent |
  | `monacoBody` | `string` (optional) | Monaco snippet syntax (with `${1:...}`/`$0` tab stops); when present, this drives tab-stop insertion instead of `code` |

**Placeholder syntax** (used in both `code`/`monacoBody` snippet text):

| Syntax | Meaning |
|--------|---------|
| `${1:text}` | First tab stop with default text `text` |
| `${2:text}` | Second tab stop with default text `text` |
| `$0` | Final cursor position after all tab stops are visited |

### 4.8 Editor Features

| Feature | Description |
|---------|-------------|
| Split panes | Right-click a tab and choose "Open in Split Right" or "Open in Split Bottom" to create a split view |
| Tab dragging | Reorder tabs, or drag a tab to move it between two already-existing panes (dragging does not create a new split). Drag a tab off the tab bar entirely to pop it out into its own window -- see 4.9 |
| Code folding | Collapse/expand indented blocks using gutter arrows |
| Find / Replace | In-file search with regex, match case, and whole word options |
| Multi-cursor | `Alt+Click` / `Option+Click` to place additional cursors |
| Column selection | `Shift+Alt+Drag` / `Shift+Option+Drag` for rectangular selection |
| Move line | `Alt+Up/Down` / `Option+Up/Down` to move the current line |
| Delete line | `Ctrl+Shift+K` / `Cmd+Shift+K` |
| Toggle comment | `Ctrl+/` / `Cmd+/` toggles `#` line comments |
| Bracket matching | Matching brackets are highlighted when the cursor is adjacent |
| Auto-indentation | New lines automatically match the indentation context |

### 4.9 Popping Out Tabs

Any tab -- editor, canvas, composer, or panel -- can be detached into its own independent, movable OS window, then redocked back into its original pane later.

**To pop out a tab:**
- Drag the tab off the tab bar, or
- Right-click the tab and choose **Pop Out to Window**

**To redock a popped-out tab**, close its window -- it reinserts at its original pane and position.

| Detail | Behavior |
|--------|----------|
| Supported tab types | All 16: editor, untitled, markdown, image, audio, character, diagnostics/punchlist, translations, stats, screen-preview, Project/Flow/Choices canvas, notecard-canvas, scene-composer, imagemap-composer |
| State ownership | The main window remains the sole owner of app state. A popout is a thin remote view -- every edit still flows through the same handlers, undo history, and autosave as if it happened in the main window |
| Window size/position | Remembered per tab *type* (not per tab id), so every popped-out editor, for example, reuses the last size/position of any previously popped-out editor |
| Native menu commands | `Cmd+W` / `Ctrl+W` (close tab) and Save All work correctly when a popout window has OS focus |
| Closing the main window | Any popout with a pending edit is flushed to disk before the main window's close cascade proceeds, so in-flight changes in a popout are never silently dropped |
| The Project Canvas tab | Poppable like any other tab, except when it's the only tab left open in its pane -- popping it out then would leave that pane empty with no way back short of opening a second canvas tab |

### 4.10 Search & Replace Panel

Opened with `Ctrl+Shift+F` / `Cmd+Shift+F`. Searches across all `.rpy` files in the project using ripgrep.

| Option | Description |
|--------|-------------|
| Regex | Interpret the search pattern as a regular expression |
| Match Case | Case-sensitive matching |
| Whole Word | Match only complete word boundaries |

**Replace actions:**
- Replace All -- replaces every occurrence of the current search query across all matching files, after a confirmation dialog showing how many occurrences and files are affected. There is no per-occurrence preview mode. Replacements happen in memory and mark the affected files as unsaved; save them to write the changes to disk.

Search history is preserved within the session. Results appear grouped by file with line numbers and context snippets. Clicking a result opens the file in the editor and navigates to the matching line.
