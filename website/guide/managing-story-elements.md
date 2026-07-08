# Managing Story Elements

The **Story Elements** sidebar is your command center for everything that makes up your visual novel beyond raw code. It lives on the right side of the IDE and uses a two-level tab layout: a row of icon tabs across the top selects the category, and within each category you find the relevant tools and data.

The categories and their sub-tabs are:

| Category | Sub-tabs |
|----------|----------|
| Story Data | Characters, Variables, Screens |
| Assets | Images, Audio |
| Composers | Scenes, ImageMaps, Screen Layouts |
| Tools | Snippets, Menus, Colors |

We will cover Assets and Composers in later chapters. This chapter focuses on Story Data and Tools.

## Characters

The **Characters** tab shows every character defined in your project -- every `define` statement that creates a `Character()` object. Each entry displays the character's tag (the variable name you use in code, like `e`), their display name (like `"Eileen"`), their assigned color as a small swatch, and a count of how many dialogue lines they have across the project.

![The Characters tab listing defined characters with tags and colors](/story-elements-characters.png)

From here you can:

- **Add a new character** using the `+ New` button, which opens a form for the tag, display name, and color
- **Edit a character** by clicking their entry, which opens the Character Profile Editor
- **Find usages** to see every file and line where the character speaks or is referenced

### The Character Profile Editor

Click on any character to open their dedicated **Character Profile Editor** as a full tab. This is far more than a name-and-color picker. It exposes every parameter that Ren'Py's `Character()` constructor accepts:

**Basic properties**: tag, display name, name color, and an optional character image (searchable from your project's imported images).

**Dialogue styling**: you can override the dialogue text color separately from the name color. If your character is a ghost who speaks in pale blue text, set `what_color` here rather than wrapping every line in `{color}` tags.

**Text formatting**: the `who_prefix` and `who_suffix` fields let you add characters around the speaker name (e.g., setting `who_suffix` to `":"` makes the name display as `Eileen:` in the textbox). Similarly, `what_prefix` and `what_suffix` wrap the dialogue text.

**Slow text**: enable the `slow` toggle to make this character's dialogue appear letter by letter. Set `slow_speed` to control how many characters per second appear, and `slow_abortable` to let the player click to skip the animation.

**Click-to-Continue (CTC)**: specify a displayable for the "click to continue" indicator and choose whether it appears nestled at the end of the text or at a fixed screen position.

All changes made in the Character Profile Editor update the corresponding `define` statement in your `.rpy` file. You do not need to hand-edit the code -- the IDE writes it for you.

## Variables

The **Variables** tab lists every `define` and `default` statement in your project. Each entry shows the variable name, its initial value, and which file it is defined in.

![The Variables tab showing define and default statements across the project](/writer-variables.png)

Click `Find Usages` on any variable to see everywhere it appears across your project -- assignments, conditionals, dialogue interpolations. This is invaluable for tracking game state. If you have a variable called `affection_points` and you want to make sure it is being incremented in all the right places, the usage search gives you a complete picture.

You can also add new variables directly from this tab, which generates the appropriate `define` or `default` statement in the target file.

## Screens

The **Screens** tab lists all `screen` definitions found across your project. Each entry shows the screen name and its source file. Click any screen to jump directly to its definition in the code editor.

![The Screens tab listing screen definitions across the project](/dev-screens-tab.png)

The `+ New` button creates a new screen with boilerplate code -- a minimal `screen` block with a `frame` and `vbox` to get you started. This saves you from remembering the exact syntax every time.

## The Snippets Tab

The **Snippets** tab in the Tools category provides a visual, grid-based browser for the full snippet library. Where the editor's IntelliSense shows snippets one at a time as you type, this tab lets you explore the entire collection.

![The Snippets tab showing built-in and user-defined snippets](/dev-snippets-tab.png)

At the top of the tab, **category filter chips** let you narrow the display: click `Logic & Control Flow` to see only branching and flow snippets, or `Audio` to see only music and sound patterns. A **search box** with fuzzy matching lets you find snippets by title, description, or even code content -- type "fade" and you will see every snippet that involves a fade transition.

Each snippet card shows its title, a brief description, and an expandable code preview. Click a card to expand it and see the full code. A copy button on each card puts the code on your clipboard, ready to paste into your editor.

### User-Defined Snippets

Below the built-in library, the `My Snippets` section shows your custom snippets. Click `+ New` to create one. The creation form asks for:

- **Title** -- a descriptive name like "Chapter Header with BGM"
- **Prefix** -- the trigger text for IntelliSense (e.g., `chapterbgm`)
- **Description** -- a brief explanation shown in the IntelliSense tooltip
- **Code** -- the snippet body, which supports tab-stop placeholder syntax

Placeholder syntax uses the Monaco snippet format:

```
label ${1:label_name}:
    scene ${2:bg_image}
    play music "${3:track.ogg}" fadein ${4:1.0}
    "${5:Opening narration goes here.}"
    $0
```

`${1:label_name}` is the first tab stop with default text "label_name". `${2:bg_image}` is the second, and so on. `$0` marks where the cursor lands after all placeholders have been filled. When you trigger this snippet in the editor, you tab through each field in order.

User snippets are saved to `.renide/snippets.json` within your project folder, so they travel with the project. The snippet manager also supports editing and deleting existing custom snippets.

## The Menu Designer

The **Menus** tab houses the **Menu Constructor**, a visual tool for building Ren'Py `menu:` blocks without writing them by hand.

The constructor starts with a caption field (the prompt text shown to the player) and two default choices. For each choice, you fill in:

- **Choice text** -- what the player sees as a clickable option
- **Condition** (optional) -- a Python expression that must be true for the choice to appear (e.g., `has_key`)
- **Logic** -- what happens when the player picks this choice

The logic field supports several action types:

- `jump label_name` -- unconditional jump to a label
- `call label_name` -- call a label as a subroutine and return
- `pass` -- do nothing (continue to the next line)
- `return` -- return from the current call
- Custom code -- any multi-line Ren'Py or Python code block

As you edit, the constructor **validates in real time** against your project data. If you type `jump cafe_scene` and `cafe_scene` is not a defined label, the constructor highlights the issue. Known labels autocomplete as you type.

The generated code appears in a live preview pane. You can copy it to insert into your editor, or insert it directly at the cursor position.

### Menu Templates

If you find yourself building similar menu structures repeatedly -- say, every chapter ends with a "Continue / Save / Quit" choice -- you can **save a menu as a template**. Templates store the full menu structure (caption, choices, conditions, logic) and can be loaded from the template picker the next time you need one. This is particularly useful for recurring UI patterns across your visual novel.

## The Color Picker

The **Colors** tab provides a **Color Picker** with five palettes for working with hex colors in your Ren'Py code:

![The Colors tab showing the color picker with palette swatches](/dev-colors-tab.png)

- **Ren'Py Standard** -- the named colors that Ren'Py recognizes natively
- **HTML Named** -- the full set of CSS/HTML named colors
- **Material 500** -- Google Material Design's mid-weight color set
- **Pastel** -- a softer palette for UI work
- **Project Theme** -- automatically scanned from your `.rpy` files, this palette shows every hex color literal that appears in your codebase

Click a swatch to select it. The preview area at the bottom shows the selected color with its hex value and three action buttons:

- **Insert at Cursor** -- types the hex code directly into the active editor at the cursor position
- **Wrap Selection** -- wraps the currently selected text in `{color=#hex}...{/color}` tags, perfect for inline dialogue coloring
- **Copy Hex** -- copies the hex value to your clipboard

Double-clicking a swatch immediately inserts its hex value at the cursor, combining selection and insertion into a single gesture.

The Project Theme palette updates automatically as you add or remove hex colors in your code. It provides a quick way to maintain visual consistency -- if you have been using `#4A90D9` for your UI accent color, you can find it in the Project Theme palette rather than remembering the hex value.
