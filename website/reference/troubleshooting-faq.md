# Troubleshooting and FAQ

### 11.1 Troubleshooting

#### Installation

| Problem | Solution |
|---------|----------|
| Windows SmartScreen blocks the installer. | Click `More info`, then click `Run anyway`. The application is not code-signed with an EV certificate, which triggers this warning. |
| macOS Gatekeeper blocks the application. | Right-click the app and select `Open`, then confirm. Alternatively: System Preferences > Security & Privacy > `Open Anyway`. |
| Linux AppImage does not execute. | Ensure FUSE is installed (`sudo apt install libfuse2` on Ubuntu/Debian). Make the file executable: `chmod +x Vangard_Studio_Linux_*.AppImage`. |

#### Performance

| Problem | Solution |
|---------|----------|
| Large projects load slowly on first open. | The IDE processes all `.rpy` files during initial load. Projects with 500+ files may take longer. Subsequent analysis runs are incremental and faster. |
| Canvas feels laggy when panning or zooming. | Reduce visible blocks using the character filter or zoom out. Check `Stats` > `IDE Performance` for canvas FPS and memory metrics. |
| High memory usage reported. | Close unused editor tabs (each mounted tab retains its Monaco instance). Check the JS heap size in `Stats` > `IDE Performance`. |

#### SDK and Game

| Problem | Solution |
|---------|----------|
| "SDK path not found" or game fails to launch. | Open Settings (`Ctrl+,` / `Cmd+,`) and verify the Ren'Py SDK path points to the SDK root directory -- the folder that contains `renpy.exe` (Windows) or `renpy.sh` (macOS/Linux). |
| Game launches but crashes immediately. | Ensure your Ren'Py SDK version is compatible (7.x or 8.x). Check the IDE console output for error details. |
| Warp to Label fails. | The target label must exist in your project. If using variable overrides, ensure each value is a valid Python expression. If your project already defines `label after_warp:`, the IDE warns about the conflict -- rename or remove the existing label. |

#### Files and Assets

| Problem | Solution |
|---------|----------|
| Images do not appear in the asset manager. | Use `File` > `Refresh Project` or right-click in the Project Explorer and select `Refresh`. Verify images are inside `game/images/` or a scanned directory. |
| Audio files will not play. | Ensure the file format is supported by the Web Audio API: MP3, OGG, WAV. Other formats may not play in the IDE's audio player. |
| External file changes are not detected. | The file watcher uses a 400ms debounce. Wait a moment and check again. If changes still do not appear, use `File` > `Refresh Project` to manually reconcile all files with disk state. |

#### Editor

| Problem | Solution |
|---------|----------|
| IntelliSense does not suggest completions. | Ensure the file has a `.rpy` extension and that the analysis has completed (no spinner in the toolbar). The completion provider requires a fully parsed project. |
| Syntax highlighting looks incorrect or plain. | The TextMate grammar loads asynchronously via Oniguruma WASM on the first editor mount. Close the tab and reopen it. If the problem persists, restart the application. |
| User snippets do not appear in autocomplete. | Verify that `.renide/snippets.json` contains valid JSON and that each snippet has a `prefix` field matching what you type. The prefix is the trigger string. |

#### Canvas

| Problem | Solution |
|---------|----------|
| Blocks are missing or overlapping after editing files externally. | Use `Organize Layout` from the toolbar to auto-position blocks, or `File` > `Refresh Project` to reconcile block state with disk. |
| Arrows are not drawn between blocks. | Arrows represent `jump` and `call` statements in your code. Verify the statements exist, are correctly spelled, and target labels that are defined in the project. |
| Go-to-Label (`Ctrl+G` / `Cmd+G`) cannot find a label. | The label must be defined with the `label name:` syntax in a `.rpy` file within the project. Dynamic labels (computed at runtime) are not indexed. |
| Minimap is not visible. | The minimap is toggled from the canvas toolbar. Click the minimap icon to show or hide it. It is hidden by default. |
| Diagnostic glow not appearing on blocks. | Diagnostic glow only appears for error (red) and warning (amber) severity. Info-level diagnostics do not produce a glow. Verify the diagnostics panel shows the expected issues. |

#### Composers

| Problem | Solution |
|---------|----------|
| Scene Composer does not show the background image. | Verify the image file exists at the referenced path. Supported formats: PNG, JPG, WEBP. If the file was moved or renamed externally, remove and re-add the background. |
| Generated Ren'Py code does not include visual effects. | Only non-default values are included in the generated code. If all sliders are at their default positions (saturation 1.0, brightness 0, contrast 1.0, invert 0, color mode None), no `matrixcolor` line is emitted. |
| Screen Layout Composer shows a screen as read-only. | Screens defined in your `.rpy` files are displayed as read-only. Click `Duplicate` to create an editable copy. |

### 11.2 FAQ

#### General

**Q: What Ren'Py versions does Vangard Studio support?**
A: Both Ren'Py 7.x and 8.x.

**Q: Does Vangard Studio replace the Ren'Py SDK?**
A: No. Vangard Studio works alongside the SDK. You still need the Ren'Py SDK installed to run and test your game.

**Q: Can I use Vangard Studio offline?**
A: Yes. The IDE is fully offline. No internet connection is required for any feature. The only network activity is the optional auto-update check on launch.

**Q: Is my project locked into Vangard Studio?**
A: No. Your `.rpy` files are standard Ren'Py files. The IDE stores its own data in a `.renide/` folder that Ren'Py ignores. Delete the `.renide/` folder and your project is exactly as Ren'Py expects it.

#### Projects

**Q: How large a project can Vangard Studio handle?**
A: It has been tested with projects containing 500+ files. Performance may vary with very large projects; check `Stats` > `IDE Performance` for metrics.

**Q: Can multiple people work on the same project?**
A: Yes. Project files are Git-friendly. Each team member can use Vangard Studio independently. The `.renide/` folder can be committed to version control to share canvas layouts, compositions, and task lists.

**Q: What happens to my project if I stop using Vangard Studio?**
A: Nothing. Delete the `.renide/` folder and your project remains a standard Ren'Py project with no traces of the IDE.

#### Features

**Q: Can I customize the keyboard shortcuts?**
A: The keyboard shortcuts are currently fixed. Custom keybindings are planned for a future release.

**Q: Does the Dialogue Preview show everything Ren'Py can render?**
A: It shows a simplified mock of the textbox and choice menus. Complex transforms, ATL animations, and custom screens are not previewed.

**Q: Can I export my canvas layout as an image?**
A: Canvas export is not currently supported. Use your operating system's screenshot tool as a workaround.

**Q: Are tab size and word wrap configurable?**
A: Tab size and word wrap are controlled by the Monaco editor's built-in settings, accessible via the editor's command palette (`F1` inside the editor). These are not currently exposed in the Settings dialog.

**Q: What image formats are supported?**
A: PNG, JPG/JPEG, and WEBP for the asset manager and visual composers. The IDE displays thumbnails for all three formats. Ren'Py itself may support additional formats depending on the SDK version.

**Q: What audio formats are supported?**
A: The IDE's built-in audio player supports MP3, OGG, and WAV via the Web Audio API. These are also the most common formats used by Ren'Py projects.

**Q: How do I reset the canvas layout?**
A: Click `Organize Layout` in the toolbar and choose one of the four layout algorithms. This repositions all blocks or nodes automatically. Your previous positions are stored in the undo stack if you need to revert.

**Q: Can I undo changes to canvas positions?**
A: Yes. `Ctrl+Z` / `Cmd+Z` undoes block moves, creation, and deletion on the Project Canvas. The undo stack holds up to 50 actions. Note that editor text changes, settings, and asset imports are not covered by canvas undo.
