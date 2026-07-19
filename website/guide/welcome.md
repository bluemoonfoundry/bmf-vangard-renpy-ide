# Welcome to Vangard Studio

![Vangard Studio welcome screen](/welcome-screen.png)

<div class="tldr-grid">
  <div class="tldr-card">
    <div class="tldr-icon">🧭</div>
    <h3>Why it exists</h3>
    <p>Broken jumps and orphaned labels hide silently in a folder of <code>.rpy</code> files until they blow up in testing. Vangard Studio puts the whole story on a canvas so you catch them first.</p>
  </div>
  <div class="tldr-card">
    <div class="tldr-icon">🌱</div>
    <h3>New to Ren'Py?</h3>
    <p>Skip memorizing folder structure and <code>jump</code>/<code>call</code> syntax by hand. Drag blocks, build scenes visually, and let diagnostics catch typos for you.</p>
  </div>
  <div class="tldr-card">
    <div class="tldr-icon">⌨️</div>
    <h3>Already experienced?</h3>
    <p>It's a real editor (the Monaco engine behind VS Code) with Ren'Py-aware autocomplete and project-wide diagnostics — ignore every visual feature and still come out ahead.</p>
  </div>
  <div class="tldr-card">
    <div class="tldr-icon">🔓</div>
    <h3>Not another engine</h3>
    <p>Vangard Studio reads and writes plain <code>.rpy</code> files — no proprietary format, no export step. Stop using it tomorrow and your project is unchanged.</p>
  </div>
</div>

<div class="tldr-banner">
  <div class="tldr-icon">💝</div>
  <div>
    <h3>Free and open source. Forever.</h3>
    <p>No paid tiers, no subscriptions, no account required. Vangard Studio is licensed <a href="https://github.com/bluemoonfoundry/bmf-vangard-renpy-ide/blob/main/LICENSE">AGPL-3.0</a> — the source stays open, and it always will.</p>
  </div>
</div>

## What Is Vangard Studio?

Vangard Studio is a desktop application that turns your Ren'Py project into something you can *see*. Every `.rpy` file becomes a draggable block on a visual canvas; every `jump` and `call` becomes an arrow connecting those blocks. Instead of holding a sprawling narrative in your head, you hold it on screen -- the entire branching structure of your visual novel, laid out like a map. You write code in a full-featured editor (the same engine that powers Visual Studio Code), and the canvas updates in real time to reflect your changes.

But Vangard Studio is more than a pretty diagram. It is an integrated development environment built specifically for visual novels: a code editor with Ren'Py-aware autocomplete and diagnostics, visual composers for scenes and image maps, asset management for images and audio, and three distinct canvases that show your project from the file level, the label level, and the player's perspective. It runs on Windows, macOS, and Linux.

## The Problem

If you have built a visual novel of any size, you already know the pain. Your `game/`
folder fills up with dozens of `.rpy` files. You rename a label in one file and break a
`jump` in another. You define a character you never use. You lose track of which routes
reach an ending and which dead-end silently. An artist adds a batch of new sprites, but
nobody can tell which ones the script actually references. A writer restructures the
second act, and the programmer discovers three broken screen calls a week later during
QA.

Tracking these connections in a text editor is like trying to read a subway map printed
as a list of station names. You can technically derive the information, but the format
works against you.

Vangard Studio makes those connections visible. Broken jumps glow red on the canvas before you
ever launch the game. Unreachable labels are flagged automatically. Missing images and
undefined characters appear in a diagnostics panel you can click to jump straight to the
source. The goal is simple: catch structural problems early, navigate large projects
instantly, and give every team member -- writer, artist, programmer -- a shared picture of
how the story fits together.

## No Lock-In

Vangard Studio works *alongside* the Ren'Py SDK, not instead of it. Your `.rpy` files stay as
`.rpy` files. There is no proprietary format, no export step, no conversion. You can open
a Vangard Studio project in any text editor, and you can open any existing Ren'Py project in
Vangard Studio. The only files Vangard Studio adds to your project live in a `.renide/` directory
(canvas positions, IDE settings, snippets) that Ren'Py ignores completely.

This philosophy extends to every feature. The Scene Composer generates standard Ren'Py
`scene` and `show` statements. The Menu Constructor produces ordinary `menu:` blocks.
Screens are written directly as `screen` code, with the Screen Preview panel rendering
it back to you as you go. Nothing is hidden behind a proprietary runtime. If you decide
to stop using Vangard Studio tomorrow, your project is exactly the same set of `.rpy`
files it always was.

You still need the Ren'Py SDK installed to run your game. Vangard Studio is the place where you
write, visualize, and debug -- then you press `F5` and the SDK launches your game as
usual.

## About This Site

This documentation site is a work in progress: the Welcome, Getting Started, and Three
Canvases chapters below are fully migrated with screenshots. The remaining chapters and
the full reference section are still being ported over from the previous single-document
user guide — use the sidebar to see what's live today.
