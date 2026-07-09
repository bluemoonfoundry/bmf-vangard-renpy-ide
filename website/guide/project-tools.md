# Project Tools

Beyond the canvases, the code editor, and the visual composers, Vangard Studio includes a set of project management tools that handle the day-to-day logistics of working with files, tracking changes, and keeping your project organized. These tools are not glamorous, but they make the difference between a smooth development workflow and a frustrating one. A visual novel project can grow to dozens or hundreds of files over months of development, and managing that structure well is a silent prerequisite for finishing the game.

## Project Explorer

The **Project Explorer** lives in the left sidebar. It displays your project's file tree with every `.rpy` file, image, audio file, and subdirectory organized in a familiar hierarchical view.

You have full file management capabilities here:

- **Create** new files and folders via right-click context menus. Need a new chapter file? Right-click the `game/` directory, select `New File`, and name it `chapter6.rpy`.
- **Rename** files by right-clicking and selecting `Rename`.
- **Delete** files and folders with a confirmation dialog to prevent accidents. Deleted files are removed from disk permanently -- this is not a recycle bin operation -- which is why the confirmation step is important.
- **Cut, copy, and paste** files between directories using `Ctrl+X` / `Ctrl+C` / `Ctrl+V` (or the macOS equivalents). Cut-and-paste is how you reorganize your project structure, moving script files between subdirectories as your story grows.
- **Drag and drop** files to move them between folders, reorganizing your project structure visually.

One particularly useful feature: right-click any `.rpy` file and choose `Center on Canvas`. The IDE switches to the Project Canvas and pans directly to that file's block, zooming in so you can see it in the context of its neighbors and connections. This is the fastest way to go from "I know the file name" to "I can see how it connects to the rest of my project."

The file tree updates in real time as you create, rename, or delete files through the IDE. It also reflects changes made through the `Refresh Project` command when files are modified outside the IDE. The explorer uses lazy rendering for large file trees, so even projects with hundreds of files stay responsive.

### Refresh Project

Sometimes you make changes outside the IDE. Maybe you edited a file in VS Code, pulled updates from a Git repository, ran a batch rename script, or your artist dropped new sprites into the `images/` folder. The **Refresh Project** command reconciles everything the IDE knows with what is actually on disk.

Trigger it from the `File` menu or from the Project Explorer's right-click context menu. The IDE re-reads all project files, detects files that were added or removed since the last scan, updates the image and audio asset lists, and re-runs the full analysis. Blocks on the canvas update to reflect any content changes, and new files appear as new blocks.

If any files that you had open in the editor were also modified externally, you will see conflict warnings handled by the external file change detection system described below.

## External File Change Detection

The IDE runs a file watcher in the background that monitors your project folder for `.rpy` file changes. This watcher uses a 400-millisecond debounce to avoid reacting to rapid intermediate saves (like those from format-on-save tools).

When an external change is detected, the IDE's response depends on the state of your editor buffer for that file:

- **Clean files** -- files where you have no unsaved changes in the IDE -- reload silently. The editor content updates, the analysis refreshes, and the canvases redraw. You will not even notice unless you happen to be looking at the file when it changes.
- **Dirty files** -- files where you have unsaved edits -- trigger a persistent warning bar at the top of the editor pane. The bar presents two clear options: `Reload` to accept the external version (your unsaved IDE changes are discarded), or `Keep` to hold onto your version (the external change is ignored until the next save or refresh).

The IDE also suppresses false positives. When it writes a file itself (for example, when you press `Ctrl+S`), it briefly ignores change events for that file so its own save does not trigger a "file changed externally" warning.

This system is essential for team workflows. If a collaborator pushes changes that modify a file you are actively editing, you will see the warning immediately. No silent overwrites, no lost work.

A common scenario: you pull from a shared Git repository and several `.rpy` files change on disk at once. Clean files in the editor update silently. If one of those files happens to be open with unsaved edits, you get the warning bar for just that file -- the rest update without interruption. The debounce interval also means that running `git pull` (which writes files in rapid succession) does not flood you with dozens of individual change notifications.

## Markdown Preview

Visual novel projects often include design documents, worldbuilding notes, changelogs, or contributor guidelines written in Markdown. Double-click any `.md` file in the Project Explorer to open it in a **GitHub-style rendered preview**.

![A Markdown file rendered in GitHub-style preview, with the Project Explorer file tree visible on the left](/markdown-preview.png)

The preview renders headings, bold, italic, lists, code blocks, links, tables, and other standard Markdown formatting. It respects your current IDE theme, so dark mode users get a properly themed dark background rather than a jarring white panel.

Need to make a quick edit? Toggle to edit mode, and the preview switches to a full Monaco editor with Markdown syntax highlighting. Make your changes, then toggle back to preview mode to verify the formatting looks right.

This is handy for maintaining a `README.md` in your project root, especially if you are sharing the project through GitHub or another Git hosting platform. Write the readme without leaving the IDE, and preview it to make sure it looks the way you intend.

## Undo and Redo

`Ctrl+Z` undoes your last action. `Ctrl+Y` redoes it. (On macOS, `Cmd+Z` and `Cmd+Y`.)

The undo system covers canvas-level and project-level operations:

- Moving blocks or nodes on any canvas.
- Creating or deleting blocks.
- Modifying composition data in the Scene Composer or ImageMap Composer.

The canvas/project-level history stack has no fixed size limit -- it grows for the duration of your session. (The Scene Composer's own internal undo stack, used only while editing a scene composition, is capped at 50 actions.) If you need to go further back than the undo history retains, consider using a version control system like Git -- it is the right tool for long-term history across your entire project.

There are two important boundaries to understand:

- **Code editor changes** have their own separate undo stack. Monaco (the editor engine) manages text undo independently from canvas undo. When you are typing in the editor, `Ctrl+Z` undoes text changes. When the canvas has focus, the same shortcut undoes canvas operations. The IDE routes the shortcut to the correct system based on which panel is active. This means you will never accidentally undo a canvas move while editing code, or undo a line of dialogue while rearranging blocks. The two systems are fully independent -- undoing editor text does not affect the canvas history, and vice versa.

- **File system operations, settings changes, and asset imports** are not undoable through the undo system. Deleting a file from the Project Explorer, changing a theme in Settings, or scanning a new image directory are all operations that take immediate effect. Destructive actions like file deletion always show a confirmation dialog first, so you have a chance to reconsider before anything is permanent.

## New Project Wizard

Starting a new visual novel from scratch? The **New Project Wizard** walks you through a clean 3-step setup process.

**Step 1: Name and Location.** Enter your project name and choose where to save it on disk. The IDE remembers your last project directory, so the file browser opens in a familiar location rather than the system default. The name you enter becomes the folder name on disk.

**Step 2: Resolution.** Pick a resolution preset for your game window:

![Step 2 of the New Project Wizard, showing the resolution preset choices with 1920x1080 selected](/new-project-wizard.png)

- 1280 x 720 (HD) -- the most common choice for visual novels, balancing quality with performance
- 1920 x 1080 (Full HD) -- the standard for modern displays, ideal if your art assets are high-resolution
- 2560 x 1440 (2K) -- for high-DPI presentations or premium productions
- 3840 x 2160 (4K) -- maximum fidelity for large displays
- Custom -- enter any width and height you want for non-standard aspect ratios

The resolution you choose here sets the `config.screen_width` and `config.screen_height` values in your project's `options.rpy`. You can always change it later, but getting it right from the start saves you from resizing all your art assets down the road. Most visual novels target 1920x1080 or 1280x720. If you are unsure, start with 1920x1080 -- it is the standard for modern displays, and scaling down for lower-resolution devices is straightforward, while scaling up from 720p can make artwork look blurry.

**Step 3: Theme and Colors.** Choose between a light or dark GUI scheme for your game's interface, then pick an accent color from a curated palette of 10 swatches (different swatches for light and dark schemes). The accent color tints the textbox, choice buttons, and other UI elements in your game. This gives your visual novel a distinct look right from the start.

When you click create, the IDE calls the Ren'Py SDK to generate a complete, SDK-compatible project structure. You get a `game/` directory populated with `script.rpy` (your starting script), `options.rpy` (game configuration), `gui.rpy` (visual styling), and all the standard Ren'Py boilerplate files. The new project opens in the IDE immediately -- the Project Canvas shows your first block, and you can start writing right away.

A useful detail: because the wizard generates standard Ren'Py project files, the result is fully compatible with both the IDE and the stock Ren'Py launcher. You can open the same project in either tool at any time. Nothing about the wizard's output locks you into using Vangard Studio -- it simply gives you a faster, more visual way to set up the boilerplate that every new Ren'Py project needs.

If you already have an existing Ren'Py project that you created outside the IDE, you do not need the wizard at all. Just open the project folder directly through `File` then `Open Project`. The IDE reads the `.rpy` files it finds, builds the canvas from your existing labels and jumps, and you are up and running.
