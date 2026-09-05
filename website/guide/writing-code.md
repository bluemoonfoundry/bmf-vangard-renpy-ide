# Writing Code

Vangard Studio is built around a professional code editor. Not a stripped-down textarea, not a "good enough" embedded widget -- the actual Monaco editor, the same engine that powers Visual Studio Code. If you have ever used VS Code, the editing experience will feel immediately familiar. If you have not, you are about to discover why millions of developers swear by it.

## The Monaco Editor

Every `.rpy` file you open lands in a full Monaco editing surface. You get line numbers, a scrollable minimap on the right margin, and all the small refinements you would expect from a mature code editor: auto-indentation that respects Ren'Py's whitespace rules, bracket matching for parentheses and curly braces in Python blocks, code folding on `label`, `screen`, `init`, `if/elif/else`, and `menu` blocks, plus multi-cursor editing (`Alt+Click` to place additional cursors, `Ctrl+D` / `Cmd+D` to select the next occurrence of a word).

None of these features require configuration. They work from the moment you open your first file.

![The Monaco code editor with Ren'Py syntax highlighting](/code-editor.png)

## Split Panes

When you are cross-referencing two files -- say, writing a scene in `chapter3.rpy` while checking your character definitions in `characters.rpy` -- you can split the editor into two panes. Right-click any editor tab and choose **Open in Split Right** or **Open in Split Bottom** from the context menu. The active tab moves into the new secondary pane, and both files are visible simultaneously.

You can drag tabs freely between panes, close either pane independently, and resize them by dragging the divider. This is especially useful when a scene references images or labels defined elsewhere -- you can keep the definition visible in one pane while writing the scene in the other.

Any tab can also leave the main window entirely: drag it off the tab bar (or right-click it and choose **Pop Out to Window**) to detach it into its own movable OS window, useful for a second monitor or comparing a canvas against the code side by side. See [Popping Out Tabs](/reference/editor-reference#_4-9-popping-out-tabs) for details, including how the popout window stays in sync with the main window.

## Syntax Highlighting

Vangard Studio provides two layers of syntax coloring that work together.

The first layer is **TextMate grammar tokenization**. This is the same technology VS Code uses for its syntax highlighting. Vangard Studio ships a custom `renpy.tmLanguage.json` grammar that tokenizes Ren'Py keywords, strings, comments, Python expressions, ATL blocks, and screen language constructs. The grammar is parsed using Oniguruma (loaded as a WebAssembly module for performance), so even complex nested constructs -- triple-quoted strings inside `init python` blocks, for instance -- are colored correctly.

The second layer is **semantic token overlays**. While TextMate tokenization colors syntax structurally (it knows a word after `jump` is probably a label), semantic tokens use your project's live analysis data to color things by meaning. There are nine semantic token types:

- **Labels** (known) -- label names after `jump` or `call` that exist somewhere in your project
- **Labels** (undefined) -- label targets that do not match any defined label, typically highlighted in a warning color
- **Characters** (known) -- character tags in dialogue lines that match a `define` statement
- **Characters** (unknown) -- character tags that have no corresponding definition
- **Images** (known and unknown) -- image names after `show`, `scene`, or `hide`
- **Screens** (known and unknown) -- screen names after `call screen` or `show screen`
- **Variables** -- recognized `define`/`default` variable names in `$` expressions

The practical result: when you type `jump cafe_scene` and `cafe_scene` does not exist yet, the label name appears in a distinct "undefined" color. The moment you create that label somewhere in your project, the color changes to the "known label" styling -- no save required, no manual refresh. The analysis runs continuously in the background.

## IntelliSense

As you type, Vangard Studio offers context-aware autocomplete suggestions -- what Monaco calls **IntelliSense**. The completions are not generic; they are drawn from your project's live analysis results.

The completion provider looks at a handful of specific prefixes on the current line and narrows its suggestions only in those cases:

- After `jump` or `call` (but not `call screen`), it suggests only known label names in your project
- After `call screen`, it suggests only screen names along with their parameters
- After `show`, `scene`, or `hide`, it suggests only defined image names
- Inside `$` expressions or `python` blocks, it suggests only `define`/`default` variable names

For everything else -- which in practice covers most typing positions, including the start of a dialogue line -- Vangard Studio falls back to one unified list that mixes Ren'Py keyword snippets, character tags, label names, variables, screen names, and your custom snippets all together. It is not scoped down to "just character tags" or "just keywords"; you will see all of these candidate types at once and rely on the label text (and Monaco's fuzzy filtering as you type) to narrow the list.

That fallback list does not follow you into a quoted string, though. Once the cursor is actually inside the `"..."` of a dialogue line (or any other quoted text, like a filename), suggestions are suppressed entirely -- so typing a sentence of ordinary prose never gets interrupted by a popup full of keywords and label names every time you hit a space.

Each suggestion includes a short detail annotation to help you distinguish between similarly named items -- for example a label shows `Label (label)`, a character tag shows `Character: <display name>`, and a variable shows its type and initial value. Label suggestions do **not** show which file the label is defined in. Type a few characters and press `Tab` or `Enter` to accept a suggestion.

## Go to Definition

Hold `Ctrl` (or `Cmd` on macOS) and click on a label target inside a `jump` or `call` statement, and the editor will jump directly to where that label is defined -- even if the definition lives in a different `.rpy` file. Vangard Studio opens the target file in a new editor tab (or switches to it if already open) and scrolls to the exact line.

This currently works for:

- **Labels**: `Ctrl+Click` on `jump cafe_scene` or `call cafe_scene` takes you to `label cafe_scene:`

Character tags and screen names are not click-to-navigate targets today -- there is no Ctrl+Click handling for them. Use Project-wide Search (below) to locate a `define Character(...)` statement or a `screen` definition.

For large projects with dozens of files, this feature can save you hours of manual searching.

## Dialogue Preview

Below the code editor sits a collapsible panel called **Dialogue Preview** (labeled "Player View" in the interface). This is one of Vangard Studio's most distinctive features.

As you move your cursor through dialogue lines, the preview panel renders a mock Ren'Py textbox showing exactly what the player would see. The character's name appears in a colored badge (using their defined color), and the dialogue text is rendered with Ren'Py text tag formatting -- `{b}bold{/b}`, `{i}italic{/i}`, `{color=#ff0000}colored text{/color}`, even `{s}strikethrough{/s}`. Variable interpolations like `[player_name]` appear as dimmed placeholder brackets so you can see where dynamic text will be inserted.

When your cursor is inside a `menu:` block, the preview switches to a **Choice Preview** that shows the menu prompt and all available choices as clickable-looking buttons. Conditional guards (`if has_key`) appear as small annotations beside each choice, and jump destinations are shown with an arrow indicator.

This means you can proofread your dialogue, check text tag formatting, and verify menu layouts without launching the game. For visual novel writing, where the presentation of text is as important as the words themselves, this is a significant time saver.

Toggle the preview panel open or closed by clicking its header bar. It remembers its state per session.

## Snippets

Vangard Studio ships with **33 built-in code snippets** covering the most common Ren'Py patterns. Snippets are reusable code templates with tab-stop placeholders -- type a trigger prefix, select the snippet from the IntelliSense menu, and then press `Tab` to jump between placeholder fields and fill in your specific values.

For example, typing `menu` in the editor triggers a lightweight keyword snippet template with three tab stops:

```
menu:
    "${1:What do you do?}":
        "${2:Choice 1}":
            $0
```

Press `Tab` to move from the prompt/choice text (`What do you do?`) to the choice label (`Choice 1`), then to the cursor position inside that choice's body (`$0`), where you continue writing the rest of the menu by hand. This keyword-triggered snippet is intentionally minimal -- for a complete, ready-to-edit two-choice menu with two labelled jump targets, browse the **Choice Menu** snippet in the Snippets sidebar instead (see below), which fills in a full working example.

Built-in snippets are organized into categories:

- **Dialogue & Narration** (4) -- standard dialogue, narration, NVL mode, dialogue with attributes
- **Logic & Control Flow** (5) -- if/else, if/elif/else, choice menus, jumps, calls
- **Images** (10) -- show, show at position, scene, hide, image definitions, solid color, placeholder, simple animation, condition switch, layered image
- **Visuals & Effects** (3) -- scene with transition, simple transition, pause
- **ATL & Transforms** (7) -- basic transform, linear movement, fade in/out, zoom pop, repeating bobbing, parallel animation, on show/hide events
- **Audio** (4) -- play music, play sound effect, stop music, queue music

Snippets also appear in the `Story Elements` sidebar under the `Snippets` tab (covered in [Managing Story Elements](/guide/managing-story-elements)), where you can browse the full library visually. You can define your own custom snippets too -- the brief version is that user-defined snippets use `${1:placeholder}` syntax for tab stops and are stored in `<project>/.vangard/snippets.json` within your project folder. That chapter covers the details.

## Project-wide Search and Replace

Press `Ctrl+Shift+F` (`Cmd+Shift+F` on macOS) to open the **Project-wide Search** panel. This searches across every file in your project using a fast ripgrep-backed engine.

![The Project-wide Search panel showing results grouped by file](/search-panel.png)

The search panel offers several options:

- **Match Case** -- distinguish between `Eileen` and `eileen`
- **Whole Word** -- match `end` without matching `ending` or `friend`
- **Regex** -- use regular expressions for complex pattern matching (e.g., `jump\s+chapter_\d+` to find all numbered chapter jumps)

Results appear grouped by file, with matching text highlighted in context. Click any result to jump directly to that line in the editor.

To replace matches, click the chevron next to the search box to reveal the replace row, then type your replacement text. **Replace All** replaces every occurrence of the current search query across all matching files, after asking for confirmation (showing how many occurrences and files are affected). There is no per-occurrence preview mode -- Replace All is the only replacement action. Replacements happen in memory and mark the affected files as unsaved; use Save or Save All to write the changes to disk.
