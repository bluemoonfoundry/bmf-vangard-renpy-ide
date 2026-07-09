# Who This Is For

Vangard Studio is designed for anyone developing visual novels with Ren'Py. The features span a
wide range -- from visual story mapping to low-level code editing -- so different people
will gravitate toward different parts of the tool. Here is how it fits into five common
roles.

## Writers

You are the person building the story: the branching paths, the character arcs, the
choices that make the player agonize. Your biggest challenge is not writing a single
scene -- it is keeping dozens of scenes, routes, and endings organized in your head.
Which label does the "forgive" choice jump to? Is there a path from the prologue to the
true ending that skips the side quest? Did you accidentally orphan an entire subplot when
you renamed that label last Tuesday?

Vangard Studio gives you visual answers. The **Project Canvas** shows every `.rpy` file as a
block with arrows drawn between them based on your `jump` and `call` statements. The
**Flow Canvas** goes deeper, showing every label as a node so you can trace specific
paths through the narrative. The **Choices Canvas** flips the perspective entirely,
showing what the *player* sees: the choice text, the conditions that hide or reveal
options, and where each decision leads. You will find these canvases covered in depth in
[Chapter 5](/guide/three-canvases).

Beyond visualization, the sidebar's Characters tab tracks every character you have
defined -- their dialogue count, their color, everywhere they appear. The Menu Constructor
lets you design branching choices visually without writing `menu:` blocks by hand. And the
diagnostics system catches broken jumps and unreachable labels before you waste time
testing manually. See [Chapter 5](/guide/three-canvases) and [Chapter 6](/guide/writing-code) for the full story.

## Artists

You work with images: character sprites, backgrounds, CGs, UI elements. Your challenge is
getting those assets into the game correctly -- making sure the right sprite appears at the
right position with the right transform, and that nothing is misspelled or missing. You
may not be comfortable writing Ren'Py code, but you still need a way to see how your art
fits into the project.

Vangard Studio's **Images tab** gives you a browsable, thumbnail-rich view of every image in
your project. You can scan external directories to reference assets without copying them
into the project folder. Right-click any image to copy a ready-made `scene` or `show`
statement to your clipboard. The **Scene Composer** goes further: drag backgrounds and
sprites onto a visual stage, adjust zoom, flip, rotation, and opacity, apply visual
effects like color grading and matrix presets (Sepia, Night, Noir, and more), then copy
the generated Ren'Py code into the script. The **Audio tab** offers the same workflow for
music and sound effects, complete with a custom audio player and visual equalizer.
Chapters 8 and 9 cover assets and composers in detail.

## Developers and Programmers

You are comfortable with code. You may be writing custom screens, managing variables, or
building the technical scaffolding that holds a complex visual novel together. You want a
proper code editor, not a toy -- and you want your tooling to understand Ren'Py
specifically, not just treat it as generic Python.

Vangard Studio's editor is powered by Monaco -- the same engine behind Visual Studio Code. You
get TextMate-grade syntax highlighting with a custom Ren'Py grammar, semantic token
overlays that color labels and characters differently depending on whether they are
defined or undefined, context-aware IntelliSense for `jump` targets and `show` images,
`Ctrl+Click` go-to-definition, split panes, and 28+ built-in code snippets with tab-stop
placeholders. The **Screen Preview** panel renders your hand-written `screen` blocks back
to you as you edit, resolving named styles and `gui.*` variables so you can see the
layout without leaving the editor. The **Diagnostics** panel is
your project-wide linter: it catches syntax errors, undefined references, and unused
definitions across every file simultaneously. See [Chapter 6](/guide/writing-code), [Chapter 7](/guide/managing-story-elements), and [Chapter 10](/guide/diagnostics-and-quality) for the
technical details.

## Solo Creators

You are all three of the above, and probably a project manager too. The advantage of
Vangard Studio for you is consolidation. Instead of bouncing between a text editor, a file
manager, an image viewer, and a spreadsheet of TODOs, you have one window.

Write dialogue in the code editor. Check the canvas to see how the scene connects to the
rest of the story. Drag a sprite into the Scene Composer to prototype a shot. Run the
game with `F5`. Check the diagnostics panel to see what you forgot. Switch to the Stats
view to see your word count and estimated play time. All without leaving the application.
Every chapter in this guide is relevant to you.

## Teams

When multiple people work on the same visual novel, the biggest bottleneck is shared
understanding. The writer renames a label and the programmer's screen code breaks. The
artist adds sprites that nobody references in the script. Everyone has a different mental
model of how the story is structured, and those models diverge further every week.

Vangard Studio's canvas gives the team a shared visual language. The `.renide/` directory is
Git-friendly (JSON files with stable keys), so canvas positions and project settings
merge cleanly alongside your `.rpy` files. Every team member sees the same block layout,
the same arrows, the same diagnostic warnings. The writer can point to a block on the
canvas during a meeting and say "this scene needs a new background," and the artist knows
exactly where it fits in the story. Diagnostics catch cross-file problems -- a renamed
label, a missing image -- immediately, before they become merge-day surprises.

The project has been tested with 500+ files, so it scales to production-size visual
novels without performance issues.
