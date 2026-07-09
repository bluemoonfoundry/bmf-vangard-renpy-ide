# Managing Story Elements

The **Story Elements** sidebar is your command center for everything that makes up your visual novel beyond raw code. It lives on the right side of the IDE as a single flat vertical icon nav -- there is no category grouping; all tabs sit at the same level and you switch directly between them.

The tabs are, top to bottom:

<table class="story-elements-tab-table">
<tbody>
<tr><td><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg></td><td>Characters</td></tr>
<tr><td><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.745 3A23.933 23.933 0 003 12c0 3.183.62 6.22 1.745 9M19.5 3c.967 2.782 1.5 5.771 1.5 9s-.533 6.218-1.5 9M8.25 8.885l1.444-.89a.75.75 0 011.105.402l2.402 7.206a.75.75 0 001.104.401l1.445-.889m-8.25.75l.213.09a1.687 1.687 0 002.062-.617l4.45-6.676a1.688 1.688 0 012.062-.618l.213.09" /></svg></td><td>Variables</td></tr>
<tr><td><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" /></svg></td><td>Screens</td></tr>
<tr><td><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg></td><td>Images</td></tr>
<tr><td><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" /></svg></td><td>Audio</td></tr>
<tr><td><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-1.5-3.75h-6" /></svg></td><td>Scene Compositions</td></tr>
<tr><td><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg></td><td>Image Maps</td></tr>
<tr><td><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875c-1.243 0-2.25.84-2.25 1.875 0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" /></svg></td><td>Code Snippets</td></tr>
<tr><td><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg></td><td>Menu Templates</td></tr>
<tr><td><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" /></svg></td><td>Color Palette</td></tr>
</tbody>
</table>

We will cover Images/Audio and the Composer tabs in later chapters. This chapter focuses on Characters, Variables, Screens, Code Snippets, and Menu Templates.

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

This tab is read-only -- there is no button to create a new screen from it. To add a screen, write the `screen` block directly in a `.rpy` file; it will then appear here.

## The Snippets Tab

The **Code Snippets** tab provides a visual, grid-based browser for the full snippet library. Where the editor's IntelliSense shows snippets one at a time as you type, this tab lets you explore the entire collection.

![The Snippets tab showing built-in and user-defined snippets](/dev-snippets-tab.png)

At the top of the tab, **category filter chips** let you narrow the display: click `Logic & Control Flow` to see only branching and flow snippets, or `Audio` to see only music and sound patterns. A **search box** with fuzzy matching lets you find snippets by title, description, or even code content -- type "fade" and you will see every snippet that involves a fade transition.

Each snippet card shows its title, a brief description, and an expandable code preview. Click a card to expand it and see the full code. A copy button on each card puts the code on your clipboard, ready to paste into your editor.

### User-Defined Snippets

Above the built-in library, the `My Snippets` section shows your custom snippets. Click `+ New` to create one. The creation form asks for:

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

User snippets created here are saved to `appSettings.userSnippets` in the single global `app-settings.json` file in your Electron userData directory -- they are global to your machine, not scoped to the current project, so they do **not** travel with the project. (The Snippets tab separately merges in project-specific snippets from `<project>/.vangard/snippets.json` and user-global snippets from `~/.vangard-ide/snippets/custom.json` if those files exist -- see [Story Elements Reference §5.3](/reference/story-elements-reference).) The snippet manager also supports editing and deleting existing custom snippets.

## The Menu Designer

The **Menu Templates** tab houses the **Menu Constructor**, a visual tool for building Ren'Py `menu:` blocks without writing them by hand.

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

The **Color Palette** tab provides a **Color Picker** with five palettes (selected via a dropdown, not tabs) for working with hex colors in your Ren'Py code:

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
