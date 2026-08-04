# File Menu: New Untitled File

**Status:** Approved
**Date:** 2026-08-03

## Problem

The File menu has no way to start a blank file. The only "New File" action today lives in the Explorer context menu (and its File-menu mirror, `explorer-new-file`), which requires a folder to be selected first and writes to disk immediately with a name chosen up front. That's a different, less-familiar interaction than the standard editor pattern of opening a blank scratch tab and being prompted for a name/location on first save.

## Goals

- File menu → "New File" opens a blank, unsaved "Untitled-N" editor tab immediately, no folder selection or upfront naming required (only needs a project open, since saved files must live inside one).
- First save (Ctrl+S or the tab's save action) prompts a native save dialog, defaulting into the project's `game/` folder, with no extension forced — the user names the file and picks its extension there.
- After a successful save, the tab behaves exactly like any other opened file (appears on the Project canvas, tracked by analysis/diagnostics, etc.).
- Reuses the existing Monaco/`EditorView` editing experience — no new editor component.

## Non-Goals

- No changes to the existing Explorer-scoped "New File" flow (`explorer-new-file` / `CreateBlockModal`) — it keeps its current upfront-prompt behavior; this is a second, distinct entry point.
- No inclusion of untitled tabs in `Save All`, "Close Others/All", or the app-quit unsaved-changes prompt. These are all built around the `dirtyBlockIds`/`dirtyEditors` Sets, which are keyed to real `Block`s in `blocks[]`. Retrofitting them to also drive N sequential native save dialogs is materially riskier than this feature warrants for v1. An untitled tab is protected only by its own explicit Ctrl+S.
  - This is not a new regression: the plain "X" tab-close button already discards unsaved edits on any tab type with no prompt today.
  - Tracked as a fast-follow, not blocking this change.
- No support for saving outside the open project — the backend's `fs:writeFile` guard (`guardProjectPath`) already rejects paths outside the current project root, so this isn't a new restriction, just inherited.

## Design

### 1. Data model (`src/types.ts`)

- `EditorTab.type` union gets a new member: `'untitled'`.
- `EditorTab` gets a new optional field: `title?: string` — set once at tab creation (e.g. `"Untitled-1"`), used only by untitled tabs so `getTabLabel` doesn't need a second lookup map.

### 2. Untitled file state (new hook `src/hooks/useUntitledFiles.ts`)

Owns everything about in-progress scratch content, deliberately kept out of `blocks[]` so an unsaved file never appears on the Project canvas graph, StoryCanvas, or analysis/diagnostics pipeline before it's saved.

```ts
interface UntitledFileState {
  title: string;    // "Untitled-1"
  content: string;
  isDirty: boolean;
}

// useState<Map<string, UntitledFileState>>, not persisted
```

Exposed functions:
- `createUntitledFile()` — generates a tab id (`untitled-${Date.now()}`) and title (monotonic counter in a ref, e.g. `Untitled-1`, `Untitled-2`, ...), seeds the map with empty content, opens the tab pane-aware (mirrors `handleOpenCharacterEditor`'s existing split/active-pane logic in `App.tsx`).
- `updateUntitledContent(tabId, content)` — updates content, sets `isDirty: true`.
- `saveUntitledFile(tabId)` — orchestrates the save-as flow (see below).
- `discardUntitledFile(tabId)` — removes the map entry (called after a successful save, once the tab has been converted to a real block).

### 3. Save-as flow

Triggered by `onTriggerSave` (the same prop `EditorView` already uses for Ctrl+S) wired to `saveUntitledFile(tabId)` instead of `handleSaveBlock`:

1. `window.electronAPI.showSaveDialog({ title: 'Save File', defaultPath: '<projectRoot>/game', filters: [{ name: "Ren'Py Script", extensions: ['rpy'] }, { name: 'All Files', extensions: ['*'] }] })`.
2. If canceled, no-op — tab stays open and dirty.
3. If confirmed: `window.electronAPI.writeFile(absPath, content)`. On failure, toast the error and stop (tab stays open and dirty, exactly like a failed save on a real block today).
4. On success: compute the path relative to `projectRootPath` (same slicing already used elsewhere, e.g. `useBlockManagement.handleCreateBlockConfirm`), call the existing `addBlock(relativePath, content, undefined, { markDirty: false })` to register it as a real tracked block, refresh `fileSystemTree` (same `loadProject` + `setFileSystemTree` pattern used in `useCharacterManagement`/`useBlockManagement`).
5. Swap the tab in place: find it by id in `openTabs`/`secondaryOpenTabs` (whichever pane holds it) and replace it with `{ id: newBlockId, type: 'editor', blockId: newBlockId }`, preserving position; if it was the active tab, keep it active under the new id.
6. `discardUntitledFile(tabId)`, toast success.

### 4. Rendering (`useTabContentRenderer.tsx`)

- `getTabLabel`: `if (tab.type === 'untitled') return tab.title ?? 'Untitled';`
- `renderTabContent`: for `tab.type === 'untitled'`, look up the map entry and build a synthetic `Block` (`{ id: tab.id, content, title: tab.title, filePath: undefined, position: {x:0,y:0}, width: 320, height: 200 }`), passed into the same `EditorView` used for real editor tabs, with:
  - `onSave` / `onContentChange` → `updateUntitledContent(tab.id, content)`
  - `onTriggerSave` → `saveUntitledFile(tab.id)`
  - `onDirtyChange` → updates the map's `isDirty` (not the global `dirtyEditors` Set)
  - all other props (theme, font, snippets, selection-creation callbacks, etc.) passed through identically to the real-editor branch, for full feature parity while editing.
- Tab-bar dirty dot (~line 527 today): extend the existing condition to also check `tab.type === 'untitled' && untitledFiles.get(tab.id)?.isDirty`.

### 5. Menu wiring

- `electron.js`: new File-menu item, `id: 'new-untitled-file'`, label `"New File"`, accelerator `CmdOrCtrl+Alt+N` (`CmdOrCtrl+N` is already bound to "New Project"), `enabled: false` initially, sends command `new-untitled-file`. Placed near the top of the File menu, distinct from the existing Explorer-scoped `"New File"` item (which keeps its current label/behavior).
- Enablement: extend the existing `explorer:update-menu-state` IPC payload with `canNewUntitledFile`, and extend `setExplorerMenuState`'s id map with `'new-untitled-file': canNewUntitledFile`. Renderer side, the existing `App.tsx` effect that computes `hasFolderSelected` (~line 1529) also computes `canNewUntitledFile: projectRootPath !== null` and includes it in the `updateExplorerMenuState` call; add `projectRootPath` to that effect's dependency array.
- `useMenuCommandDispatch.ts`: add `onNewUntitledFile: () => void` to `MenuCommandHandlers`, dispatch `if (data.command === 'new-untitled-file') h.onNewUntitledFile();`.
- `App.tsx`: wire `onNewUntitledFile: createUntitledFile` into the `useMenuCommandDispatch` call.

### 6. Types / preload

- `src/types.ts`: extend the `updateExplorerMenuState` electronAPI type with `canNewUntitledFile?: boolean`.
- No new IPC channels — `showSaveDialog`, `writeFile`, `path.join`, `loadProject` are all already exposed via `preload.js`.

## Testing

- `useUntitledFiles.test.ts` (new): `createUntitledFile` generates sequential titles and opens pane-aware; `updateUntitledContent` marks dirty; `saveUntitledFile` happy path (dialog confirmed → write succeeds → block added → tab swapped → map entry removed), cancel path (dialog canceled → tab unchanged, still dirty), and write-failure path (toast shown, tab stays open and dirty).
- `useMenuCommandDispatch.test.ts`: add `['new-untitled-file', 'onNewUntitledFile']` to the existing table-driven dispatch test.
- `useTabContentRenderer` tab-bar tests: label renders `tab.title` for untitled tabs; dirty dot reflects the untitled map instead of the global Sets.
- Manual verification (Electron, per existing project convention): File → New File with a project open creates an "Untitled-1" tab; typing content and hitting Ctrl+S opens the save dialog defaulting to `game/`; saving as `test.rpy` converts the tab, and the file now appears in the Explorer tree and on the Project canvas; canceling the dialog leaves the tab open and dirty; File → New File is disabled with no project open.

## Risks / Considerations

- The known gap around `Save All`/bulk-close/quit not covering untitled tabs (see Non-Goals) should be filed as a follow-up bead once this lands, so it isn't lost.
- `guardProjectPath` will reject a save-as path outside the project root; `game/` as the default path keeps users inside it in the common case, but a user who navigates the native dialog elsewhere in the project tree (or outside it) needs a clear error toast on write failure rather than a silent no-op — covered by step 3 of the save-as flow.
