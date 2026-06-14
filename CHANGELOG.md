# Changelog

All notable changes to Ren'IDE are documented here.

## [Unreleased]

## [0.9.0]

### Added
- **NEW:** E2E smoke test suite (Playwright + Electron) — 5 automated smoke tests run in CI before every release build
- **NEW:** Coverage gate in CI — per-file statement thresholds enforced on key modules (`storyCanvasLayout`, `useRenpyAnalysis`, `MarkdownPreviewView`, `ipcSecurity`)
- **NEW:** Synthwave editor theme
- **NEW:** Keyboard Shortcuts button in toolbar — the shortcuts reference is now discoverable without knowing Ctrl+/
- **NEW:** `RELEASE_CHECKLIST.md` — go/no-go gate for production releases
- **NEW:** `SUPPORT.md` — post-release support runbook with log paths, known first-launch issues, and rollback guidance

### Security
- **FIXED:** Project-root path guard added to all `fs:*` IPC handlers — prevents path traversal outside the open project directory

### Accessibility
- **FIXED:** `role="dialog"` and `aria-modal` now applied to the correct (inner content) element across all 8 modal dialogs — screen readers no longer announce the backdrop overlay as the dialog

### Fixed
- Stale planning and implementation summary files removed from repository

## [0.8.3]

### Added
- **NEW:** Centralized logging system using electron-log - Logs persist to disk for bug reports and debugging (#137)
- **NEW:** Help → Show Logs menu item - Opens log directory for easy access to diagnostic logs

### Security
- **FIXED:** XSS vulnerability in Markdown preview - Added DOMPurify sanitization to prevent potential script injection through user-controlled Markdown files (#134)

### Fixed
- **FIXED:** Memory leak in CanvasNodeContextMenu - Event listeners no longer re-register on every prop change, preventing memory leaks during canvas interactions (#138)

### Changed
- **IMPROVED:** Console logging replaced with structured file-based logging system for better debugging and support

### Accessibility
- **IMPROVED:** GoToLabelModal now uses useModalAccessibility hook for proper focus management and ESC handling (#140)
- **IMPROVED:** TranslationDashboard generate modal now uses useModalAccessibility hook for better keyboard accessibility (#140)

## [0.8.0]

### Added

- Three canvases for story structure, route flow, and player choice flow
- Monaco editor with split panes, Ren'Py syntax highlighting, autocomplete, and snippets
- Story Elements tools for characters, variables, screens, assets, composers, snippets, menu templates, and colors
- Diagnostics, stats, and translation dashboard tabs
- Project Explorer actions for create, rename, delete, refresh, and clipboard workflows
- Project search and replace with regex and whole-word support
- Markdown preview for `.md` files
- Run Project and Warp to Label launch support
- Drafting Mode for placeholder assets during development
- First-run tutorial, bundled user guide, keyboard shortcuts help, and auto-updater support
- External file change detection so outside edits are noticed automatically

### Improved

- Go-to-label navigation is available from the canvases and the global `Ctrl+G` palette
- `Ctrl+W` closes the active tab instead of quitting the app
- The Stats tab includes live project performance metrics
- The File menu exposes explorer actions for keyboard-first workflows
- Translation generation is available through the configured Ren'Py SDK

### Removed

- AI story generation and its related settings

## [0.7.0]

### Highlights

- Introduced the ImageMap Composer
- Introduced the Screen Layout Composer
- Added the diagnostics panel and the stats dashboard
- Added user snippets and markdown preview
- Expanded accessibility, performance, and project tooling

## [0.6.0]

### Highlights

- Two-pane split editor
- Image viewer zoom and pan
- Script statistics dashboard
- Configurable canvas and mouse preferences
- Error boundary and auto-updater support

---

Older release history remains in git history and can be restored if needed.
