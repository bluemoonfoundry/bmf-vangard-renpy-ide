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

| Context | Trigger | Completions Offered |
|---------|---------|-------------------|
| Jump / Call targets | Typing after `jump ` or `call ` | All defined label names in the project |
| Image names | Typing after `show `, `scene `, or `hide ` | All known image tags (from `image` statements and scanned files) |
| Character tags | Typing at dialogue position (indented identifier before a string) | All defined `Character()` tags |
| Screen names | Typing after `call screen `, `show screen `, or `hide screen ` | All defined `screen` names |
| Variables | Typing in `$` expressions | All `define`/`default` variable names |

### 4.4 Dialogue Preview

The **Player View** panel appears below the editor when editing `.rpy` files. It renders a mock Ren'Py textbox that simulates how dialogue will look in-game.

- Updates in real time as the cursor moves through the file
- Shows the character name (with defined color) and dialogue text for the current line
- Renders `menu:` blocks as choice button previews
- Scrolls to follow the cursor position

### 4.5 Go to Definition

`Ctrl+Click` (Windows/Linux) or `Cmd+Click` (macOS) on a reference navigates to its definition.

| Target | Navigates To |
|--------|-------------|
| Label name (in `jump`/`call` statements) | The `label` definition line |
| Character tag (in dialogue) | The `define Character(...)` statement |
| Screen name (in `show screen`/`call screen`) | The `screen` definition |

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

User snippets are stored as JSON files:
- **Project-specific:** `.renide/snippets.json` in the project directory
- **Global:** loaded from user data directory

Each snippet file follows this structure:

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

**Placeholder syntax:**

| Syntax | Meaning |
|--------|---------|
| `${1:text}` | First tab stop with default text `text` |
| `${2:text}` | Second tab stop with default text `text` |
| `$0` | Final cursor position after all tab stops are visited |

When multiple snippet sources exist, categories with the same name are merged. Priority order: built-in (lowest) < user global < project-specific (highest).

### 4.8 Editor Features

| Feature | Description |
|---------|-------------|
| Split panes | Drag a tab to the side of the editor area to create a split view |
| Tab dragging | Reorder tabs or drag between panes |
| Code folding | Collapse/expand indented blocks using gutter arrows |
| Find / Replace | In-file search with regex, match case, and whole word options |
| Multi-cursor | `Alt+Click` / `Option+Click` to place additional cursors |
| Column selection | `Shift+Alt+Drag` / `Shift+Option+Drag` for rectangular selection |
| Move line | `Alt+Up/Down` / `Option+Up/Down` to move the current line |
| Delete line | `Ctrl+Shift+K` / `Cmd+Shift+K` |
| Toggle comment | `Ctrl+/` / `Cmd+/` toggles `#` line comments |
| Bracket matching | Matching brackets are highlighted when the cursor is adjacent |
| Auto-indentation | New lines automatically match the indentation context |

### 4.9 Search & Replace Panel

Opened with `Ctrl+Shift+F` / `Cmd+Shift+F`. Searches across all `.rpy` files in the project using ripgrep.

| Option | Description |
|--------|-------------|
| Regex | Interpret the search pattern as a regular expression |
| Match Case | Case-sensitive matching |
| Whole Word | Match only complete word boundaries |

**Replace actions:**
- Replace individual occurrences one at a time with preview
- Replace all matching occurrences in bulk (with confirmation dialog)

Search history is preserved within the session. Results appear grouped by file with line numbers and context snippets. Clicking a result opens the file in the editor and navigates to the matching line.
