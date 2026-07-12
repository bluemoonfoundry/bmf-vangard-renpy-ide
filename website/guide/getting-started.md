# Getting Started

## Quick Start

New to Vangard Studio? Here's a 5-minute quick start to get you up and running.

### 1. Install Vangard Studio

**Download the latest release:**
- Visit [GitHub Releases](https://github.com/bluemoonfoundry/bmf-vangard-renpy-ide/releases/latest)
- Download the installer for your platform (Windows `.exe`, macOS `.dmg`, Linux `.AppImage`/`.deb`)
- Run the installer and follow the prompts

*Detailed installation instructions are below.*

### 2. Launch and Open a Project

- Open Vangard Studio from your applications folder or start menu
- You'll see the Welcome Screen
- Click **"Open Project"** to open a Ren'Py project folder
- Or click **"New Project"** to start from scratch

### 3. Explore the Interface

- **Center:** The Project Canvas showing your `.rpy` files as blocks
- **Left:** Project Explorer with your file tree
- **Right:** Story Elements panel with characters, images, audio, and more
- **Bottom:** Code editor (appears when you open a file)

### 4. Navigate Your Story

- Drag blocks on the canvas to organize them
- Double-click a block to open its file in the editor
- Press **Ctrl+G** (or **Cmd+G** on Mac) to quickly jump to any label
- Switch between the **Project**, **Flow**, and **Choices** canvas tabs to see different views

### 5. Start Creating

- Press **N** to create a new `.rpy` file
- Right-click an image in the Images tab and select "Add `show` statement" (or "Add `scene` statement" for backgrounds) to insert it into your code
- Use the Menu Constructor (Menu Templates tab) to visually design branching choices
- Check the Diagnostics panel for errors and warnings

![Vangard Studio immediately after opening a project](/project-opened.png)

## Installation

Vangard Studio runs on Windows, macOS, and Linux. No runtime dependencies are required for end
users -- just download and run.

### Windows

Download the `.exe` installer from the releases page and run it. Windows may show a
**SmartScreen** warning because the application is not yet signed with an Extended
Validation certificate. This is a standard Windows security prompt for new software.
Click `More info`, then `Run anyway`. The installer will guide you through choosing an
installation directory and creating shortcuts. Once installed, launch Vangard Studio from the
Start menu or desktop shortcut.

### macOS

Download the `.dmg` file, open it, and drag the Vangard Studio icon into your `Applications`
folder. On first launch, macOS **Gatekeeper** will block the app because it is from an
unidentified developer. To bypass this:

1. Right-click (or Control-click) the Vangard Studio app in your Applications folder.
2. Choose `Open` from the context menu.
3. Click `Open` in the confirmation dialog.

You only need to do this once. On subsequent launches, the app opens normally. If the
right-click method does not work on your macOS version, go to `System Settings` >
`Privacy & Security` and click `Open Anyway` next to the Vangard Studio entry.

### Linux

Download the `.AppImage` file. Make it executable and run it:

```bash
chmod +x Vangard_Studio_Linux_*.AppImage
./Vangard_Studio_Linux_*.AppImage
```

AppImage requires **FUSE** to be installed on your system. On most modern distributions
it is already present. If you see an error about FUSE, install it via your package
manager:

- Debian/Ubuntu: `sudo apt install fuse`
- Fedora: `sudo dnf install fuse`
- Arch: `sudo pacman -S fuse2`

Optionally, you can integrate the AppImage with your desktop environment using a tool
like AppImageLauncher, which adds it to your application menu.

## First Launch and the Tutorial

The first time you open Vangard Studio with a project loaded, a **6-step interactive tutorial**
walks you through the interface. Each step highlights a region of the screen with a
spotlight overlay and explains what it does:

1. **Getting Started** -- points to the project menu and explains how to open or create a
   project.
2. **Three Canvas Types** -- highlights the canvas switcher in the center of the toolbar
   and introduces Project, Flow, and Choices canvases.
3. **Project Canvas** -- explains the main canvas view where your `.rpy` files appear as
   blocks.
4. **Create Scene** -- shows the `New Scene` button and mentions the `N` keyboard
   shortcut.
5. **Story Elements** -- points to the right sidebar where characters, assets, composers,
   and tools live.
6. **You're Ready** -- final tips, including the `Ctrl+G` / `Cmd+G` shortcut to jump to
   any label instantly.

Navigate the tutorial with arrow keys or `Enter`, and skip it at any time with `Escape`.
If you dismiss it and want to see it again later, go to `Help` > `Show Tutorial`. The
tutorial state is stored in your browser's local storage, so it only appears once per
machine unless you explicitly replay it.

## Migrating from Ren'IDE

If Vangard Studio detects an existing Ren'IDE installation on your computer, it shows an
**"Import settings from Ren'IDE?"** dialog the first time it launches. Choosing
`Import Settings` copies over your theme, SDK path, recent projects list, editor
preferences, and stored API keys, so you don't have to re-enter them. Choosing `Skip`
dismisses the dialog permanently -- it only ever appears once per machine, whichever
option you pick.

## Opening an Existing Project

If you already have a Ren'Py project, open it from the welcome screen or via `File` >
`Open Project`. Browse to the project's root directory -- the folder that contains the
`game/` subdirectory. Vangard Studio will scan for all `.rpy` files, build the file tree in the
Project Explorer, and populate the Project Canvas with one block per file. Arrows
representing `jump` and `call` connections appear automatically.

The initial analysis takes a moment on large projects. You will see a loading overlay
with progress indicators while Vangard Studio parses every file, extracts labels and characters,
identifies connections, and runs diagnostics. Once complete, the canvas is fully
interactive.

Vangard Studio creates a `game/project.ide.json` file inside your project folder to store
canvas positions, sticky notes, compositions, and other IDE-specific project metadata, plus
a `.vangard/snippets.json` file for project-specific code snippets. These files are safe to
commit to version control -- they contain only JSON with stable, mergeable keys.
Alternatively, add them to your `.gitignore` if you prefer each team member to maintain
their own canvas layout. (A `.renide/` directory is also created, but only holds
diagnostics/canvas screenshots.)

## Creating a New Project

If you are starting from scratch and have the Ren'Py SDK path configured (see below),
click `New Project` on the welcome screen or use `File` > `New Project`. The **New
Project Wizard** walks you through three steps:

**Step 1: Name and Location.** Enter a project name and choose a parent directory.
Vangard Studio will create a subfolder with the project name. If you have created projects
before, the wizard remembers your last-used directory.

**Step 2: Resolution.** Pick a resolution preset for your game window:

- `1280x720 (HD)` -- the most common choice for visual novels
- `1920x1080 (Full HD)` -- for high-resolution displays
- `2560x1440 (2K)` and `3840x2160 (4K)` -- for very high-resolution projects
- `Custom` -- enter any width and height you need

This sets the `config.screen_width` and `config.screen_height` in your Ren'Py
configuration. You can change it later in the generated `gui.rpy` file.

**Step 3: Theme and Color.** Choose between a dark or light UI theme for your game's
default GUI, and pick an accent color from the provided swatches (10 dark-theme colors,
10 light-theme colors). These map to Ren'Py's built-in `gui.accent_color` and related
GUI settings.

Click `Create Project` and Vangard Studio invokes the Ren'Py SDK to generate a standard project
structure with all the default files (`script.rpy`, `options.rpy`, `gui.rpy`, `screens.rpy`,
etc.), then opens the project automatically. The generated project is fully
SDK-compatible -- you can open it in the Ren'Py launcher, another text editor, or share
it with teammates who use different tools.

## Configuring the Ren'Py SDK Path

Several features require the Ren'Py SDK to be installed on your machine:

- **Running your game** (`F5`) -- Vangard Studio launches the Ren'Py process as a child of the
  IDE, so you can start and stop the game without switching windows.
- **Creating new projects** -- the wizard uses the SDK's project generation.
- **Generating translation scaffolding** -- the Translation Dashboard needs the SDK to
  create `tl/` directories.
- **Warping to a label** -- the Warp feature writes a temporary hook file that the SDK
  picks up at launch.

To configure it, open `Settings` (`Ctrl+,` / `Cmd+,`) and set the **Ren'Py SDK Path** to
the root directory of your Ren'Py installation. On Windows, this is the folder containing
`renpy.exe`. On macOS and Linux, it is the folder containing `renpy.sh`. Vangard Studio
supports both Ren'Py 7.x and 8.x.

If you do not have the SDK installed, everything else in Vangard Studio still works -- the code
editor, the canvases, the diagnostics, the composers, the asset browser. You simply will
not be able to run the game or create new projects from the wizard.

## Building from Source

Most users will never need this section. But if you want to run Vangard Studio from source --
for contributing to development, customizing the tool, or building your own distributable
-- you need **Node.js 18+** and npm installed. Then:

```bash
git clone https://github.com/bluemoonfoundry/bmf-vangard-renpy-ide.git
cd bmf-vangard-renpy-ide
npm install
npm run electron:start    # Build and launch the full Electron app
```

For a development workflow with hot reload on code changes:

```bash
npm run dev               # Starts the Vite dev server at http://localhost:5173
```

To run the test suite: `npm test`. To produce a distributable package for your platform
(DMG on macOS, NSIS installer on Windows, AppImage/deb on Linux): `npm run dist`. The output
appears in the `release/` directory.
