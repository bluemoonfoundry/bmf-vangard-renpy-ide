# Glossary

**Block** -- A visual representation of a `.rpy` file on the Project Canvas. Each file becomes one block. Blocks display the file's first label name as a title and are colored deterministically based on that title.

**Call** -- A Ren'Py statement (`call label_name`) that transfers control to a label and returns to the calling point when the called label executes `return`. Shown as dashed arrows on canvases.

**Canvas** -- One of three visual views of your project: Project Canvas (file-level), Flow Canvas (label-level flow), or Choices Canvas (player-facing choices).

**Choice Pill** -- A colored capsule on the Choices Canvas representing a single player-visible menu choice. Each pill shows the choice text and, if present, an `if` condition guard badge.

**Composition** -- A saved arrangement of images and properties in the Scene Composer, ImageMap Composer, or Screen Layout Composer. Compositions persist in `.renide/ide-settings.json`.

**Diagnostic** -- An issue detected by the IDE's analysis engine. Diagnostics have three severity levels: error, warning, and info.

**Drafting Mode** -- A mode that generates placeholder assets for missing images (gray rectangles) and audio (silence) so the game can run during development without all final assets in place. Toggled from the toolbar.

**Edge** -- A line connecting two nodes on a canvas, representing a jump, call, or fall-through relationship between code elements.

**Fall-through** -- When execution continues from one label directly into the next without an explicit jump or call statement. Shown as dotted lines on the Flow Canvas.

**Group** -- A named rectangular container on the Project Canvas that visually groups related blocks together. Groups do not affect story flow; they are purely organizational.

**IntelliSense** -- The autocomplete and suggestion system in the code editor, powered by live analysis of the entire project. Provides completions for labels, characters, screens, variables, and image tags.

**Interpolated Variable** -- A variable referenced in Ren'Py dialogue text using bracket syntax, such as `[mc_name]`. The Warp to Label feature allows setting values for these variables before warped execution.

**Jump** -- A Ren'Py statement (`jump label_name`) that permanently transfers control to a label. Unlike `call`, there is no return. Shown as solid arrows on canvases.

**Label** -- A named entry point in Ren'Py code, defined with `label name:` syntax. Labels are the primary nodes on the Flow and Choices Canvases. Examples: `label start:`, `label chapter_1:`.

**Node** -- A visual element on a canvas representing either a block (Project Canvas) or a label (Flow and Choices Canvases).

**Role Tinting** -- A Project Canvas feature that adjusts block colors based on which characters speak within them, providing a visual map of character presence across the project.

**Route** -- A specific path through the story's branching structure, from a starting point to an endpoint. Routes are identified and color-coded on the Flow Canvas.

**Semantic Token** -- A syntax highlighting overlay that colors code elements (labels, characters, images, screens, variables) based on live analysis of the project. Known elements are colored differently from unknown ones.

**Stale Translation** -- A translation entry where the translated text is identical to the source text, indicating it has not actually been translated yet. Flagged in the Translation Dashboard.

**Sticky Note** -- A draggable, resizable markdown note that can be placed on any of the three canvases. Available in six colors: yellow, blue, green, pink, purple, and red. Notes can be promoted to diagnostics tasks.

**TextMate Grammar** -- The syntax definition format used for base-level Ren'Py syntax highlighting in the editor. Loaded via the Oniguruma WASM engine from `renpy.tmLanguage.json`.

**Tab Stop** -- A numbered placeholder (`$1`, `$2`, etc.) inside a code snippet. After inserting a snippet, pressing `Tab` moves the cursor to the next placeholder, allowing rapid customization of the template.

**Variable Override** -- A value assigned to a Ren'Py `default` variable or interpolated text variable before a warped game session begins. Configured in the Warp to Label modal. Written to a temporary `_ide_after_warp.rpy` file and cleaned up when the game stops.

**Warp** -- Launching the game at a specific label using Ren'Py's `--warp` flag, skipping all preceding content. Accessed via `Ctrl+Shift+G` / `Cmd+Shift+G`, the toolbar button, editor context menu, or canvas node context menu.

**Widget Tree** -- The hierarchical structure of UI widgets in a Screen Layout Composer composition. Container widgets (`vbox`, `hbox`, `frame`, `button`) hold child widgets, forming a tree that maps directly to indented Ren'Py screen code.

**Z-Order** -- A numeric property on screens and visual layers that determines rendering priority. Higher z-order values are drawn on top of lower values.
