# Writing Code

Vangard Studio is built around a professional code editor. Not a stripped-down textarea, not a "good enough" embedded widget -- the actual Monaco editor, the same engine that powers Visual Studio Code. If you have ever used VS Code, the editing experience will feel immediately familiar. If you have not, you are about to discover why millions of developers swear by it.

## The Monaco Editor

Every `.rpy` file you open lands in a full Monaco editing surface. You get line numbers, a scrollable minimap on the right margin, and all the small refinements you would expect from a mature code editor: auto-indentation that respects Ren'Py's whitespace rules, bracket matching for parentheses and curly braces in Python blocks, code folding on `label`, `screen`, `init`, `if/elif/else`, and `menu` blocks, plus multi-cursor editing (`Alt+Click` to place additional cursors, `Ctrl+D` / `Cmd+D` to select the next occurrence of a word).

None of these features require configuration. They work from the moment you open your first file.

![The Monaco code editor with Ren'Py syntax highlighting](/code-editor.png)

## Split Panes

When you are cross-referencing two files -- say, writing a scene in `chapter3.rpy` while checking your character definitions in `characters.rpy` -- you can split the editor into two side-by-side panes. Drag any editor tab toward the left or right edge of the editing area and the IDE will offer a split drop target. Release the tab, and now both files are visible simultaneously.

You can drag tabs freely between panes, close either pane independently, and resize them by dragging the divider. This is especially useful when a scene references images or labels defined elsewhere -- you can keep the definition visible in one pane while writing the scene in the other.

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

The completion provider detects what you are writing and adjusts its suggestions accordingly:

- After `jump` or `call`, it suggests all known label names in your project
- After `show`, `scene`, or `hide`, it suggests defined image names
- After `call screen` or `show screen`, it suggests screen names along with their parameters
- At the start of a dialogue line, it suggests character tags
- Inside `$` expressions or Python blocks, it suggests `define`/`default` variable names
- For general editing, it suggests Ren'Py keywords and your custom snippets

Each suggestion includes a detail annotation (the label's file, the character's display name, the variable's initial value) so you can distinguish between similarly named items. Type a few characters and press `Tab` or `Enter` to accept a suggestion.

## Go to Definition

Hold `Ctrl` (or `Cmd` on macOS) and click on a label name, character tag, or screen reference, and the editor will jump directly to where that symbol is defined -- even if the definition lives in a different `.rpy` file. Vangard Studio opens the target file in a new editor tab (or switches to it if already open) and scrolls to the exact line.

This works for:

- **Labels**: `Ctrl+Click` on `jump cafe_scene` takes you to `label cafe_scene:`
- **Characters**: `Ctrl+Click` on a character tag in a dialogue line takes you to the `define` statement
- **Screens**: `Ctrl+Click` on a screen name takes you to the `screen` definition

For large projects with dozens of files, this one feature can save you hours of manual searching.

## Dialogue Preview

Below the code editor sits a collapsible panel called **Dialogue Preview** (labeled "Player View" in the interface). This is one of Vangard Studio's most distinctive features.

As you move your cursor through dialogue lines, the preview panel renders a mock Ren'Py textbox showing exactly what the player would see. The character's name appears in a colored badge (using their defined color), and the dialogue text is rendered with Ren'Py text tag formatting -- `{b}bold{/b}`, `{i}italic{/i}`, `{color=#ff0000}colored text{/color}`, even `{s}strikethrough{/s}`. Variable interpolations like `[player_name]` appear as dimmed placeholder brackets so you can see where dynamic text will be inserted.

When your cursor is inside a `menu:` block, the preview switches to a **Choice Preview** that shows the menu prompt and all available choices as clickable-looking buttons. Conditional guards (`if has_key`) appear as small annotations beside each choice, and jump destinations are shown with an arrow indicator.

This means you can proofread your dialogue, check text tag formatting, and verify menu layouts without launching the game. For visual novel writing, where the presentation of text is as important as the words themselves, this is a significant time saver.

Toggle the preview panel open or closed by clicking its header bar. It remembers its state per session.

## Snippets

Vangard Studio ships with **28+ built-in code snippets** covering the most common Ren'Py patterns. Snippets are reusable code templates with tab-stop placeholders -- type a trigger prefix, select the snippet from the IntelliSense menu, and then press `Tab` to jump between placeholder fields and fill in your specific values.

For example, typing `menu` in the editor triggers a snippet that expands to:

```renpy
menu:
    "What should I do?"
    "Go to the park.":
        jump park_scene
    "Stay home.":
        jump home_scene
```

The cursor lands on the first placeholder (the menu prompt text). Type your prompt, press `Tab`, and the cursor jumps to the first choice text. Continue tabbing through each placeholder until the snippet is fully customized.

Built-in snippets are organized into categories:

- **Dialogue & Narration** -- standard dialogue, narration, NVL mode, dialogue with attributes
- **Logic & Control Flow** -- if/else, choice menus, jumps, calls
- **Images** -- show, scene, hide with transitions
- **Audio** -- play music, play sound, queue audio, stop/fadeout
- **Variables** -- define, default, Python assignments
- **Screens** -- screen definitions, common UI patterns

Snippets also appear in the `Story Elements` sidebar under the `Snippets` tab (covered in [Managing Story Elements](/guide/managing-story-elements)), where you can browse the full library visually. You can define your own custom snippets too -- the brief version is that user-defined snippets use `${1:placeholder}` syntax for tab stops and are stored in `.renide/snippets.json` within your project folder. That chapter covers the details.

## Project-wide Search and Replace

Press `Ctrl+Shift+F` (`Cmd+Shift+F` on macOS) to open the **Project-wide Search** panel. This searches across every file in your project using a fast ripgrep-backed engine.

![The Project-wide Search panel showing results grouped by file](/search-panel.png)

The search panel offers several options:

- **Match Case** -- distinguish between `Eileen` and `eileen`
- **Whole Word** -- match `end` without matching `ending` or `friend`
- **Regex** -- use regular expressions for complex pattern matching (e.g., `jump\s+chapter_\d+` to find all numbered chapter jumps)

Results appear grouped by file, with matching text highlighted in context. Click any result to jump directly to that line in the editor.

For replacement, type your replacement text and choose between replacing one occurrence at a time (with a preview of each change) or replacing all matches in bulk. Bulk replacement asks for confirmation before modifying files, so you will not accidentally rewrite your entire project. The search panel also remembers your recent queries, so repeating a previous search is just a click away.
