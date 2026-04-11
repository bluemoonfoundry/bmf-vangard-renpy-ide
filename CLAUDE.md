# CLAUDE.md

## Project Overview
Vangard Ren'Py IDE is an Electron + React/TypeScript desktop application for visual novel development. It maps `.rpy` files to draggable blocks, provides integrated Monaco editors, and includes visual composers for scenes and screens.

## Build & Run Commands
- `npm run dev` / `npm run electron:start` - Launch app
- `npm run build` / `npm run dist` - Build/Package
- `npm test` / `npm run test:watch` - Testing (Vitest + JSDOM)
- `npm run lint:fix` - Linting

## Architecture & State
- **Main Process (`electron.js`)**: IPC handlers, FS operations, Ren'Py process management, encrypted API keys.
- **Preload (`preload.js`)**: Secure bridge via `window.electronAPI`.
- **State Hub (`App.tsx`)**: Central state using `useImmer`. Top-level state includes `blocks`, `characters`, `variables`, and `ProjectSettings`.
- **Data Models (`types.ts`)**: The single source of truth for all interfaces (Block, Link, Diagnostic, Composition, etc.).

## Key Systems
- **Ren'Py Analysis (`hooks/useRenpyAnalysis.ts`)**: Regex-based parser for labels, jumps, assets, and flow.
- **Canvas System**: `StoryCanvas` (file-level) and `RouteCanvas` (label-level) using custom layout engines in `lib/storyCanvasLayout.ts` and `lib/routeCanvasLayout.ts`.
- **Split Pane**: Supports side-by-side/bottom splits with persisted layout in `ProjectSettings`.
- **File System**: Managed via `FileSystemContext`, supporting local FS (Electron) and ZIP fallback.

## Visual Composers
- **Scene Composer**: Layout backgrounds/sprites, generates `show` code.
- **ImageMap Composer**: Create clickable hotspots on images.
- **Screen Layout Composer**: Visual DSL builder for Ren'Py screens (`vbox`, `hbox`, etc.) via `lib/screenCodeGenerator.ts`.

## Context Providers
- `AssetContext`: Image/audio metadata and scanning.
- `FileSystemContext`: File tree CRUD and clipboard state.
- `SearchContext`: Global search/replace logic.
- `ToastContext`: UI notifications.

## Conventions
- **State**: Always use `useImmer` drafts; never mutate state directly.
- **IPC**: Use `namespace:action` pattern (e.g., `fs:readFile`).
- **Modals**: Use `createPortal()` and the `useModalAccessibility` hook.
- **Styling**: Tailwind CSS + Dark mode (class strategy).
- **Clipboard**: Use `components/CopyButton.tsx` for all "copy to clipboard" UI.
- **Files**: One `.rpy` file = one `Block` on the canvas.

## Key Hooks
- `useHistory<T>`: Generic undo/redo logic.
- `useDiagnostics`: Generates issues (missing assets, invalid jumps) from analysis.
- `useAssetManager`: Pipeline for copying/syncing project assets.