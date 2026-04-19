# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Vangard Ren'Py IDE is an Electron + React/TypeScript desktop application for visual novel development. It maps `.rpy` files to draggable blocks on a canvas, provides integrated Monaco editors, and includes visual composers for scenes, image maps, and screens.

## Commands
```bash
npm run dev                        # Vite dev server (http://localhost:5173)
npm run electron:start             # Build + launch full Electron app
npm run build                      # Production build to dist/
npm run dist                       # Package to release/ (DMG/NSIS/AppImage)
npm test                           # Vitest once
npm run test:watch                 # Vitest watch mode
npx vitest run hooks/useHistory.test.ts  # Run a single test file
npm run test:coverage              # Coverage report (v8)
npm run lint:fix                   # ESLint auto-fix
```

## Architecture & State

### State Hub (`App.tsx`)
All core state lives in `App.tsx` using `useImmer`. Key state categories:

| State | Hook | Persisted To |
|-------|------|-------------|
| `blocks[]` | `useHistory` (undo/redo) | Individual `.rpy` files + `.renide/project.json` (positions) |
| `groups[]`, `stickyNotes[]` | `useImmer` | `.renide/project.json` |
| `imageMetadata`, `audioMetadata` | `useState` | `.renide/ide-settings.json` |
| `sceneCompositions`, `screenLayoutCompositions` | `useImmer` | `.renide/ide-settings.json` |
| `analysisResult`, `diagnosticsResult` | derived/computed | Never — recalculated on change |
| `openTabs[]`, `activeTabId`, `selectedBlockIds[]` | `useState` | Never — session-only |

**Undo/redo** (`useHistory`) only covers `blocks[]`. It does not affect editor text (Monaco handles that), canvas transforms, or project settings. It also prevents undoing past the initial state (`canUndo` only if `past.length > 1`).

### Block Lifecycle
1. User opens `CreateBlockModal` → inputs name, type (`story|screen|config`), folder
2. `handleCreateBlockConfirm()` writes file to disk via IPC, pushes a new `Block` to state, opens an editor tab
3. `debouncedBlocks` (500ms debounce) feeds `useRenpyAnalysis` — **only passes `{ id, content, filePath }`**, not position/width/color, so drag events never trigger re-analysis
4. Analysis extracts the first label name → sets `block.title`; color is deterministically derived from title via string hash
5. Block position/size persist to `.renide/project.json` every ~2 seconds

### IPC Pattern
All cross-process calls use `namespace:action` strings:
```typescript
// Renderer
await window.electronAPI.fs.readFile(path);
// Main (electron.js)
ipcMain.handle('fs:readFile', async (event, path) => fs.readFile(path, 'utf-8'));
```
Namespaces: `fs`, `project`, `dialog`, `game`, `renpy`, `app`, `path`, `shell`, `explorer`. Async push events from main (file watcher, game lifecycle) arrive via `ipcRenderer.on` and are exposed as `electronAPI.on*` callbacks.

### External File Watcher
Main process watches the project folder for `.rpy` changes. If the block is clean in the editor, it auto-reloads silently. If dirty, it shows a persistent warning bar ("Reload" / "Keep"). Main suppresses change events for 3 seconds after the app writes a file to avoid false positives.

### Tab System
`openTabs: EditorTab[]` tracks open panels. Tabs mount lazily on first activation, then stay mounted-but-hidden to preserve Monaco scroll/state. Valid tab types: `canvas`, `route-canvas`, `choice-canvas`, `editor`, `image`, `audio`, `character`, `scene-composer`, `stats`, `diagnostics`, `punchlist`.

### Context Providers
All four wrap the entire app in `App.tsx`:
- **`AssetContext`** — `projectImages: Map<path, ProjectImage>`, `projectAudios`, `imageMetadata`, `audioMetadata`. Tags and Ren'Py names (`renpyName`) are stored in metadata separately from file paths.
- **`FileSystemContext`** — file tree CRUD, clipboard state, drag-drop; delegates FS ops to Electron via IPC.
- **`SearchContext`** — offloads search state from App to avoid prop drilling; delegates to `electronAPI.searchInProject` for ripgrep-backed search.
- **`ToastContext`** — `addToast(message, type)` renders a portal at bottom-right.

### Memoization Discipline
`App.tsx` aggressively memoizes derived arrays/sets to prevent canvas re-renders on unrelated state changes:
```typescript
const imagesArray = useMemo(() => Array.from(images.values()), [images]);
const menuLabels  = useMemo(() => new Set(Object.keys(analysisResult.labels)), [analysisResult.labels]);
```
Without this, every tab switch recalculates arrays and re-renders the full canvas.

### Key `lib/` Modules
| Module | Purpose |
|--------|---------|
| `storyCanvasLayout.ts` | Auto-layout algorithms (flow-lr, flow-td, connected-components, clustered-flow) |
| `routeCanvasLayout.ts` | Label-node positioning for Route Canvas |
| `graphLayout.ts` | Generic DAG layout + route enumeration for menus/routes |
| `renpyValidator.ts` | Syntax validation (triple quotes, logical lines, label guards) |
| `renpyCompletionProvider.ts` | Monaco autocomplete: labels, characters, screens, variables |
| `renpySemanticTokens.ts` | Syntax highlighting via Monaco semantic tokens |
| `screenCodeGenerator.ts` | Converts Screen Layout Composer tree → Ren'Py screen code |

## Conventions
- **State mutation**: Always use `useImmer` drafts; never mutate state directly.
- **IPC**: Use `namespace:action` pattern in both `preload.js` and `electron.js`.
- **Modals**: Use `createPortal()` to `document.body` + the `useModalAccessibility` hook (focus trap, ESC, ARIA).
- **Styling**: Tailwind CSS + dark mode via `class` strategy.
- **Clipboard UI**: Use `components/CopyButton.tsx`.
- **Sticky notes**: Three separate arrays (`stickyNotes`, `routeStickyNotes`, `choiceStickyNotes`), one per canvas. Content renders as Markdown via `marked`. Notes can be promoted to `DiagnosticsTask` via checkbox.
- **Tests**: Vitest + JSDOM. Setup in `test/setup.ts`. Test files match `**/*.test.{ts,tsx}`.
- **Data models**: `types.ts` is the single source of truth for all interfaces (Block, Link, Diagnostic, Composition, etc.).
