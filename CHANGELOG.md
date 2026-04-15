# Changelog

All notable changes to Vangard Ren'Py IDE are documented here. Note that this is a rolling changelog that gets periodically updated as a release is being worked. Items that are listed under a version that is marked (Not Yet Released) are not formally part of a release. They are available as part of the "latest" commits in the codebase and are likely to be part of the next release, but are not guaranteed to be so.

---

## [v0.7.1] — — Public Beta 4 (Not Yet Released)

### New Features

#### Ctrl+G Go-to-Label Command Palette
- **Global label navigation** — press `Ctrl+G` (or `Cmd+G` on Mac) from any canvas tab to open a compact command palette at the top of the screen. Type a label name, press `Enter` or click to jump directly to that node on the active canvas. `Escape` or clicking the backdrop dismisses it.
- **Fuzzy search with smart ranking** — exact matches rank first, followed by prefix matches, substring matches, and finally fuzzy character-sequence matches. The active canvas name (Story / Route / Choice) is displayed in the palette header so context is always clear.
- Works on all three canvases; navigating from the palette always zooms the view in to at least scale 1.0 so the target is clearly visible.

#### Go-to-Label Search in Canvas Toolboxes
- **Story Canvas** — a "Go to Label" search box in the canvas toolbox lets you filter and jump to any label in the project. Clicking a result centers and zooms to the block containing that label.
- **Choice Canvas** — same search box added to the Choice Canvas toolbox, navigating to the corresponding choice node.
- Route Canvas already had this feature; all three canvases are now consistent.

#### Diagnostic Glow on Story Canvas Blocks
- Blocks that contain diagnostics now display a colored outer glow when zoomed out: **red** for errors, **amber** for warnings. This makes problem areas visible at a glance even when the canvas is fully zoomed out to show the whole project graph.

#### Version Display in Status Bar
- The app version (e.g. `v0.7.1`) is now shown at the right end of the status bar at all times. When a `BUILD_NUMBER` environment variable is set at build time, the build number is also shown in parentheses.

#### Auto-Center Canvas on First Open
- When a project is first opened, each canvas (Story, Route, Choice) automatically centers and zooms to the `start` label node. This behavior is persisted per project so reopening the project does not re-center again.

#### Story Elements — Two-Level Tab Navigation
- The Story Elements right sidebar has been redesigned with a two-level tab layout: a primary row of section tabs (Characters, Variables, Images, etc.) and a scrollable content area below. This replaces the previous accordion design and makes better use of vertical space.
- The Menus tab now has a dedicated visual **Menu Builder** with support for custom code blocks inside menu choices.

#### Canvas Controls Consolidation
- All three canvases now share a consistent **CanvasToolbox** component in the top-left with standardized layout and grouping controls, and a **CanvasNavControls** cluster in the bottom-right with fit-to-screen and go-to-start buttons. This replaces the previously inconsistent per-canvas control placements.

### Improvements

#### Canvas Navigation — Zoom on Go-To
- All "go to" actions (flag/start button, toolbox label search, Ctrl+G palette) now snap the viewport up to at least scale 1.0 when the canvas is currently more zoomed out. Navigating to a label no longer leaves it as a tiny unreadable dot. Affects all three canvases.

#### Canvas Grouping — Auto-Switch Layout Mode
- Selecting "Group by connected components" or "Group by file prefix" in Story Canvas or Route Canvas now automatically switches the layout mode to `Clustered Flow` (the only mode that renders grouping). Previously, clicking a grouping option had no visible effect unless you had already manually selected the Clustered Flow layout mode.
- Clearing a grouping while in Clustered Flow mode reverts the layout to the default flow. Switching away from Clustered Flow resets the grouping selection to none.

#### Stats Tab — Deferred Loading with Spinners
- The Stats tab now opens immediately. The four heavy computations (total word count, per-character word counts, path depth stats, and asset coverage) are deferred to run asynchronously after the initial render, each showing an inline spinner until their result is ready. Previously, opening Stats for large projects caused a noticeable delay before the tab appeared at all.

#### Graph Layout — Improved Cycle Handling
- The BFS layer-assignment algorithm used for cyclic story graphs now uses progressive cycle-breaking: when the BFS queue stalls (all remaining nodes are part of a cycle), the algorithm seeds from the unvisited node with the lowest in-degree rather than an arbitrary node. This produces more readable layouts where back-edges render as left-pointing arrows instead of all cycle participants being dumped into a single crowded column.

### Bug Fixes

- **Canvas grouping had no effect** — `handleChangeStoryCanvasGroupingMode` and `handleChangeRouteCanvasGroupingMode` passed the current (non-clustered) layout mode to the layout engine, which silently ignores grouping in all modes except `clustered-flow`. Fixed by auto-switching as described above.
- **Find-usages highlight not clearing on canvas click** — clicking on a dimmed block (30% opacity, indistinguishable from empty space) left `interactionState` as `idle` in `handlePointerDown`, so `handlePointerUp` never reached the rubber-band branch that cleared the highlight. Added a general distance ≤ 5 check at the end of `handlePointerUp` that fires regardless of interaction state.
- **Go-to-label modal not finding "start"** — the score function used negative values (exact = −1000, substring ≈ 0) but sorted descending, making exact matches rank last and get cut off by the 10-result limit. Redesigned with positive scores (exact = 1000, prefix ≈ 500+, contains ≈ 200 − idx, fuzzy = 10).
- **Choice Canvas go-to not zooming** — `centerOnChoiceNode` and `centerOnStart` preserved the current zoom level; navigating to a node while zoomed out left it invisible. Both now snap up to at least scale 1.0.

---

## [v0.7.0]

### New Features

#### ImageMap Composer
- **Visual imagemap editor** — draw, resize, and manage clickable hotspot rectangles over a ground image with optional hover overlay. Each hotspot has a configurable action type (`jump` or `call`) and target label.
- **Drag-and-drop images** — ground and hover images are set by dragging from the Image Assets panel.
- **Ren'Py code generation** — generates `imagebutton`/`imagemap` screen code ready to copy into your project.
- Compositions are persisted in `project.ide.json` and managed from the "Composers" tab in Story Elements.

#### Screen Layout Composer
- **Visual screen builder** — lay out Ren'Py screen widgets (vbox, hbox, text, imagebutton, etc.) with a drag-and-drop interface and live preview.
- **Asset drag-and-drop** — drag images from the Image Assets panel directly onto screen widgets.
- **Locked-screen workflow** — existing screens can be viewed in read-only mode; duplicate to create an editable copy.
- **Code generation** — generates Ren'Py `screen` code with copy-to-clipboard support.

#### Story Canvas Enhancements
- **Fit-to-screen** — a button to automatically zoom and pan so all blocks fit within the viewport.
- **Call arrows** — `call` connections are now visually distinct from `jump` arrows.
- **Character filter** — hide blocks that don't involve a selected character for focused story review.
- **Role tinting** — blocks are color-tinted based on character roles for quick visual identification.
- **Legend overlay** — a floating legend explains the arrow types and role colors on the canvas.
- **Route Canvas button** — quick-access button to open the Route Canvas directly from the Story Canvas.

#### Route Canvas Enhancements
- **Unreachable label detection** — labels not reachable from the start are highlighted as warnings.
- **Call vs. jump distinction** — call arrows are rendered differently from jump arrows for clearer flow analysis.
- **Menu decision inspector** — hover over menu nodes to see a popover with all choices and their targets.
- **Route names & node roles** — routes display descriptive names; nodes show their role (start, end, choice, etc.).
- **Collapsible panel** — the route list panel can be collapsed for more canvas space.
- **Hover-to-expand** — route list entries expand on hover to show full details.

#### TextMate Syntax Highlighting
- **Proper Ren'Py grammar** — replaced basic keyword highlighting with a full TextMate grammar (`renpy.tmLanguage.json`) for accurate, context-aware syntax coloring of Ren'Py code.
- **Semantic tokens** — additional semantic token provider for enhanced highlighting of labels, variables, and screen references.

#### Diagnostics Panel
- **Code diagnostics tab** — a new panel showing errors, warnings, and info issues across your project files. Click an issue to jump directly to the relevant file and line.
- **Task tracking** — integrated task list within the diagnostics panel for managing code-related TODOs.
- **Severity filtering** — filter diagnostics by severity level (error, warning, info).

#### Stats Tab Improvements
- Enhanced statistics dashboard with additional metrics and improved chart visualizations.

### Improvements

#### Performance (Tier 2)
- **Web worker analysis** — Ren'Py analysis now runs in a background web worker, keeping the UI responsive during large project scans.
- **Virtual list rendering** — long lists in the file explorer and story elements panels use virtualized rendering for smoother scrolling with large datasets.
- **Debounced updates** — file change handlers are debounced to prevent redundant analysis passes during rapid editing.
- **Memoization** — expensive computations and component renders are memoized to reduce unnecessary re-renders.

#### UX
- **Standardized copy-to-clipboard** — all copy-to-clipboard interactions across the app now use a shared `CopyButton` component with consistent visual feedback (checkmark + "Copied!" confirmation).
- **"Composers" tab** — the former "Scenes" tab in Story Elements has been renamed to "Composers" to reflect both Scene Composer and ImageMap Composer. The tab badge shows the combined count of scenes and imagemaps.

#### Developer
- **New `useDebounce` hook** — reusable debounce hook with test coverage.
- **Ren'Py validator** — `lib/renpyValidator.ts` provides structured code validation with test suite.
- **Pre-dist cleanup** — a `predist` script cleans the release folder before electron-builder runs.

### Bug Fixes

- **ImageMap serialization error** — fixed a serialization issue that prevented projects from loading after adding an imagemap composition. ([#76](https://github.com/bluemoonfoundry/vangard-renpy-ide/issues/76))
- **ImageMap labels access** — fixed `Map.keys()` usage where `Object.keys()` was needed, preventing label suggestions from appearing in the ImageMap Composer.
- **Fit button and Legend clicks** — fixed event propagation issue where the fit-to-screen button and legend overlay did not respond to clicks on the canvas.
- **Flaky snippet test** — stabilized a timing-dependent test for UserSnippetModal in CI environments.

#### IntelliSense & Autocomplete
- **Context-aware autocomplete** — the Monaco editor now provides intelligent completions as you type. The system detects your cursor context (after `jump`, `call`, `show`, `scene`, etc.) and offers relevant suggestions: labels, screen names, image tags, character tags, or variables.
- **28 built-in keyword snippets** — common Ren'Py patterns (menu, if/else, screen layouts, transitions, transforms, etc.) are available as expandable snippets with tab-stop placeholders.

#### User Code Snippets
- **Custom snippet library** — create, edit, and delete your own reusable code snippets from the Snippets tab in Story Elements. Each snippet has a title, trigger prefix, description, and code body.
- **Monaco placeholder support** — opt into VS Code-style tab-stop placeholders (`$1`, `${1:default}`, `$0`) for interactive snippet expansion.
- **IntelliSense integration** — user snippets appear in the autocomplete dropdown when you type their prefix, alongside built-in snippets.

#### Markdown Preview
- **Dual-mode `.md` viewer** — double-click any `.md` file (README, CHANGELOG, etc.) in the Project Explorer to open it in a new tab. A toolbar toggle switches between rendered preview and Monaco edit mode.
- **GitHub-style rendering** — the preview uses GitHub-Flavored Markdown with styled headings, code blocks, tables, blockquotes, lists, and links, with full dark mode support.
- **Edit and save** — edit markdown in the Monaco editor and save with Ctrl+S. A "Modified" indicator shows unsaved changes.

### Improvements

#### Accessibility
- **Modal accessibility overhaul** — all 7 application modals now use a shared `useModalAccessibility` hook providing focus trapping (Tab/Shift+Tab cycling), Escape key dismissal, auto-focus on open, and focus restoration on close.
- **ARIA attributes** — modals include `role="dialog"`, `aria-modal`, and `aria-labelledby`. Icon-only buttons have `aria-label` attributes.

#### Architecture
- **SearchContext extraction** — project-wide search/replace state and logic have been extracted from App.tsx into a dedicated `SearchContext` React context, reducing coupling and prop drilling.
- **Type safety improvements** — replaced `any` types with specific interfaces (`ProjectLoadResult`, `ScanDirectoryResult`, `SerializedSprite`, `SerializedSceneComposition`) across IPC boundaries.
- **Screen editor types** — added `ScreenModel` and `ScreenComponent` interfaces to `types.ts` for the upcoming visual screen editor.

#### Developer
- **Expanded test suite** — 260 tests across 14 test files (up from 161 tests across 5 files), covering modals, toolbar, search, snippets, toast, and the completion provider.
- **`fs:readFile` IPC channel** — new channel for reading arbitrary file content from the renderer process.

### Bug Fixes

- **Conditional hook call in SettingsModal** — `useModalAccessibility` was called after an early return, violating React's rules of hooks. Moved the hook call before the guard so it executes unconditionally on every render. ([lint error])
- **False-positive editor diagnostics** — fixed incorrect diagnostic highlighting in the editor where valid code was marked as having errors. Added a Ren'Py project structure check before applying diagnostics. ([#73](https://github.com/bluemoonfoundry/vangard-renpy-ide/issues/73))

---

## [v0.6.0] — Public Beta 3

### New Features

#### Editor & Workspace
- **Two-pane split editor** — split the center area right or bottom to view two tabs simultaneously. Tabs can be dragged between panes or moved via the right-click context menu. Closing a pane automatically merges its tabs back into the other pane.
- **Tab bar scroll buttons** — `‹` and `›` chevrons appear when there are more tabs than fit on screen, keeping the close-pane and filter buttons always visible.
- **Cursor position in status bar** — the status bar now shows `Ln N, Col N` for the active editor tab.
- **Minimap toggle** — a Minimap checkbox has been added to the canvas View Filters panel, letting you hide the minimap to reclaim space.

#### Image Viewer
- **Zoom and pan** — scroll to zoom in/out, drag to pan. A toolbar provides `−`/`+` buttons, a zoom percentage display, a **Fit** button, and a **1:1** (actual pixels) button. The image dimensions are also shown in the toolbar.

#### Story Analysis
- **Script statistics dashboard** — a new **Stats** tab shows total word count, estimated play time, per-character word breakdown (bar chart), lines-per-file chart, and a branching complexity score. Powered by Recharts.

#### Settings & Preferences
- **Configurable canvas/mouse preferences** — a new "Canvas & Mouse" section in Settings lets you choose:
  - Pan gesture: Shift+drag, drag, or middle-mouse drag
  - Middle mouse always pans (override)
  - Scroll zoom direction: normal or inverted
  - Scroll zoom sensitivity (0.5×–2.0×)

#### Stability & Distribution
- **Error boundary** — unhandled render errors now show a recovery UI instead of a blank screen.
- **Auto-updater** — the app checks for updates 5 seconds after launch (packaged builds only) and shows a toast when an update is available or ready to install. "Check for Updates" is also available in the Help menu.
- **Menu bar overhaul** — the menu bar now follows standard IDE conventions: Save All, Settings, Stop Project, Find in Files, and a Help menu with Keyboard Shortcuts, Documentation, and About.
- **Empty-canvas onboarding** — a hint overlay is shown on a blank canvas describing the key shortcuts (N, Shift+drag, Scroll, G).
- **In-app documentation link** — the About modal now includes a Documentation button that opens the GitHub wiki.

#### Developer
- **Vitest test suite** — 161 unit tests covering the Ren'Py analysis parser, undo/redo history hook, and file tree utilities.
- **ESLint** — flat config with TypeScript and react-hooks rules; `lint` and `lint:fix` scripts added.
- **CI gating** — GitHub Actions now runs lint and tests on every push/PR to `main`.

---

### Improvements

#### Character Editor
- **Dialogue color override** — dialogue color is now a separate opt-in with a checkbox. When unchecked, the field shows "Theme default" rather than sending an invisible `#ffffff` override to Ren'Py.
- **Slow-text controls** — slow text speed (chars/sec) and the "player can skip" checkbox are now revealed only when slow text is enabled, reducing visual noise.
- **Collapsible advanced section** — the right column (name/dialogue prefixes and suffixes, slow text, click-to-continue) is collapsed by default and can be expanded when needed.
- **Help text** — all advanced fields now have explanatory help text directly below them.
- **gui/ images excluded from Image Tag dropdown** — the dropdown no longer lists standard Ren'Py UI assets from the `game/gui/` folder.

#### Image & Audio Managers
- The default source view is now **Project** (was "All"), so project assets are shown immediately without filtering.
- Project view hides `game/gui/` assets by default. A "Show UI assets (gui/)" toggle is available when the Project source is selected.

---

### Bug Fixes

- **`call screen` parser false positive** — `call screen foo()` no longer produces an "Invalid jump: Label 'screen' not found" error. `screen` is a Ren'Py keyword in this context, not a label name; the parser now skips it the same way it already skipped `call expression`. ([#69](https://github.com/bluemoonfoundry/vangard-renpy-ide/issues/69))
- **Image viewer left-edge scroll** — zooming into an image no longer prevents scrolling to the left edge. The previous flex-centering approach clipped left-side overflow; replaced with computed padding so all four edges are equally reachable.
- **Character editor reset** — switching to "New Character" now correctly resets all 13 fields (previously only 5 core fields were reset, leaving stale values from the last edited character).
- **Keyboard Shortcuts modal** — the modal now reflects the user's current gesture settings rather than showing hardcoded defaults.
- **Auto-updater on first run** — gracefully handles the case where `latest.yml` does not exist yet (pre-release / no published release), avoiding an uncaught error on startup.
- **electron-updater import** — fixed CJS compatibility issue with the default import for `electron-updater`.

---

## [v0.5.0-beta] — prior release

The v0.5.0 beta introduced the Scene Editor visual designer, configurable UI themes, an Audio Manager with waveform preview, expanded Ren'Py analysis (screens, transforms, styles), and drag-and-drop asset import.
