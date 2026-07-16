# Customization

Vangard Studio is designed to be comfortable for long writing sessions. A visual novel can take months -- sometimes years -- to write, and the tool you spend hours in every day should look and feel exactly the way you want it. Personal preferences matter more than most developers realize: the right font size reduces eye strain, the right theme reduces fatigue during late-night writing sessions, and the right mouse configuration prevents the small frustrations that accumulate over time. This chapter covers every way to make the IDE yours.

## Themes

Open `Settings` (`Ctrl+,` / `Cmd+,`) and look at the `Color Theme` dropdown. There are 12 themes available:

![The Settings modal showing the Color Theme dropdown, Editor Appearance, and Canvas & Mouse sections](/settings-modal.png)

| Theme | Description |
|-------|-------------|
| `System Default` | Follows your operating system's light/dark preference automatically |
| `Light` | Clean white background with dark text |
| `Dark` | Dark background with light text -- easy on the eyes at night |
| `Solarized Light` | The classic Solarized palette, light variant |
| `Solarized Dark` | The classic Solarized palette, dark variant |
| `Colorful (Dark)` | Dark background with vibrant, saturated accent colors |
| `Colorful (Light)` | Light background with vibrant, saturated accent colors |
| `Neon Dark` | High-contrast neon accents on a deep dark background |
| `Ocean Dark` | Cool blue and teal tones on a dark background |
| `Candy Light` | Warm pastel pinks and purples on a light background |
| `Forest Light` | Green-tinted earth tones on a light background |
| `Synthwave` | Neon magenta and pink accents on a midnight-purple background -- a cyber-minimalist, retro-futuristic look |

The theme applies across the entire application: the toolbar, all three canvases, the code editor, the sidebar panels, every modal and dialog. The Monaco code editor automatically switches between its own dark and light internal color schemes to match the IDE theme, so syntax highlighting always looks correct against the background.

Pick a theme that matches your environment. Writing late at night? `Dark`, `Neon Dark`, `Ocean Dark`, or `Synthwave` will be much kinder to your eyes than any light theme. Presenting your project to collaborators in a bright conference room? `Light`, `Candy Light`, or `Forest Light` will be more legible on a projector. The `System Default` option is a good middle ground -- it follows your OS preference, so the IDE automatically switches between light and dark when your system does.

Switching themes is instant -- the entire interface redraws immediately with no flickering or reload. Feel free to try every option until you find one that suits your taste. Themes are purely cosmetic; they have no effect on your project files or how your game looks when it runs.

## Editor Preferences

In the same Settings modal, you will find options to adjust the code editor:

- **Font**: choose the font family for the Monaco editor. Monospace fonts like Fira Code, JetBrains Mono, or Consolas work best for Ren'Py code, but you have the freedom to use whatever font you prefer.
- **Font size**: increase or decrease the text size. Larger sizes are easier to read during long writing sessions; smaller sizes let you see more code at once when working on complex logic.

Tab size and word wrap are not exposed in the Settings dialog -- they're controlled by the Monaco editor's own built-in settings, accessible via the editor's command palette (`F1` while focused in an editor tab).

All of these settings apply to every open editor tab and take effect immediately -- no restart required. Experiment until you find the combination that feels right.

Your settings persist across sessions. Close the IDE, reopen it days later, and everything is exactly as you left it -- theme, font, and all. App-level settings are stored separately from project data, so your personal preferences follow you regardless of which project you open.

## Mouse Preferences

Canvas navigation should feel natural and intuitive. The Settings modal includes a dedicated section for mouse preferences that let you fine-tune panning and zooming across all three canvases:

- **Canvas pan gesture**: configure which mouse interaction pans the canvas viewport. The default is `Shift+Drag` -- hold Shift and drag to move around the canvas. You can change this if your workflow calls for a different modifier key or gesture.
- **Middle mouse panning**: enable this option to let middle-click drag always pan the canvas, regardless of the pan gesture setting above. If you have a mouse with a clickable scroll wheel, this provides a quick, modifier-free way to navigate.
- **Zoom scroll direction**: choose whether scrolling up zooms in (`normal`) or zooms out (`inverted`). Different applications use different conventions, and this setting lets you stay consistent with whatever you are used to.
- **Zoom scroll sensitivity**: adjust how far each scroll tick zooms. A lower value gives you finer, more precise control over zoom level. A higher value lets you zoom quickly when navigating a large canvas with many blocks or nodes spread across a wide area.

These preferences apply uniformly to the Project Canvas, Flow Canvas, and Choices Canvas. You set them once and they feel consistent across every visual view in the IDE.

## Auto-Updater

Vangard Studio checks for new releases automatically when you launch the application. The check runs a few seconds after startup so it does not slow down your initial load. If an update is available, a notification appears with the new version number and an option to download and install it.

You can also check manually at any time from the `Help` menu by clicking `Check for Updates`. The updater downloads the new version in the background. Once the download completes, it prompts you to restart the application to apply the update.

The auto-updater only runs in packaged builds (the installed application). If you are running from source with `npm run dev`, it is automatically disabled to avoid interfering with your development workflow.

Updates are incremental and generally quick to download. The updater handles the entire process -- download, verification, and installation -- so you do not need to visit a website or manually replace files. After the restart, your projects, settings, and session state are preserved exactly as they were.

## First-Run Tutorial

The first time you launch Vangard Studio, a 6-step interactive tutorial walks you through the core features. Each step highlights a specific area of the interface with an animated SVG spotlight effect, drawing your attention to the relevant button or panel while dimming the rest of the screen.

The six steps are:

1. **Welcome** -- introduces the IDE and explains how to create or open a project.
2. **Three canvases** -- presents the Project Canvas, Flow Canvas, and Choices Canvas and explains what each one shows.
3. **Project Canvas** -- demonstrates the bird's-eye view of your script files as draggable blocks with connection arrows.
4. **New Scene button** -- shows how to create your first block and open it in the editor.
5. **Story Elements panel** -- introduces the sidebar where you manage characters, assets, composers, and tools.
6. **Final tips** -- covers the essential keyboard shortcuts to get you productive quickly.

Navigate through the tutorial with `Enter` to advance, arrow keys to move between steps, or `Escape` to skip entirely and go straight to the IDE. If you prefer to explore on your own, skipping is perfectly fine -- you can always come back to it later.

The tutorial state is stored in your local browser storage, so it only appears automatically on first launch.

If you ever want to revisit it -- to refresh your memory, or to walk a collaborator through the interface -- open `Help` and click `Show Tutorial`. It replays from the beginning, identical to the first-run experience.

The tutorial is designed to take less than a minute for a quick skim, or a few minutes if you read every description carefully. It covers just enough to orient you without overwhelming you with detail -- the rest you learn naturally as you work with your first project.

## Bundled User Guide

A complete HTML user guide ships inside every packaged copy of Vangard Studio. Access it from `Help` then `User Guide`. It opens in a new tab within the IDE itself, so you have reference documentation available without leaving your workspace or opening a browser.

This means you always have documentation available, even when working offline or on a machine without internet access. The guide covers every feature in detail and is searchable within the tab. Need to look up how the Scene Composer's visual effects work? Open the guide, search for "visual effects," and you have a full explanation without switching out of your project.

## Version in Status Bar

The current version of Vangard Studio is always visible in the status bar at the bottom of the window. This is a small but practical detail -- when reporting a bug, sharing a screenshot with a collaborator, or checking whether your update went through, a glance at the bottom of the screen tells you exactly which build you are running.

## Looking Ahead

Throughout this guide, you have encountered keyboard shortcuts mentioned alongside their features -- `F5` for Run, `Ctrl+G` for Go to Label, `Ctrl+Shift+F` for project-wide search, and many more. The full keyboard shortcuts reference, with every shortcut listed in a single scannable table, appears in the Reference section of this guide. You can also view it at any time inside the IDE by pressing `Ctrl+/` (`Cmd+/` on macOS) to open the Keyboard Shortcuts panel.

The Reference section also contains the complete reference for every panel, every setting, every diagnostic rule, and every composer -- organized for quick scanning rather than narrative reading. It is the place to go when you know what you are looking for and just need the precise details.
