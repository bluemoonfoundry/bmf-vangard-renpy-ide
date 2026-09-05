# IPC Architecture and Patterns

Vangard Studio is an Electron app split across two OS processes. The **main process** (`electron.js`) owns the file system, OS dialogs, the game subprocess, and encryption. The **renderer process** (React/TypeScript) owns the UI. They communicate exclusively through IPC — direct Node.js API calls from renderer code are not available.

---

## 1. Three-Layer Stack

```
Renderer (React)          Preload (preload.js)        Main (electron.js)
──────────────────        ───────────────────        ──────────────────
window.electronAPI   ←→   contextBridge              ipcMain.handle()
  .writeFile()             ipcRenderer.invoke()       ipcMain.on()
  .onGameStarted()         ipcRenderer.on()           webContents.send()
```

- **`preload.js`** runs in a sandboxed context with access to both `ipcRenderer` and `contextBridge`. It exposes `window.electronAPI` to the renderer — the only sanctioned communication surface.
- **`electron.js`** registers handlers with `ipcMain` and sends push events via `mainWindow.webContents.send()`.
- **`src/types.ts`** declares the `window.electronAPI` TypeScript interface (global `Window` augmentation, lines ~1105–1174) so the renderer has type-safe access.

---

## 2. Channel Naming

All channels follow `namespace:action`:

| Namespace | Owns |
|---|---|
| `fs:` | File read/write, directory operations, file existence checks |
| `project:` | Project load, refresh, search |
| `dialog:` | OS file/folder dialogs, project creation wizard |
| `app:` | App settings, API key storage, log access, startup args |
| `game:` | Ren'Py process launch and control |
| `renpy:` | Ren'Py SDK validation and translation generation |
| `path:` | Node.js `path.join` (renderer has no path module) |
| `shell:` | Opening external URLs via OS default browser |
| `explorer:` | File explorer context menu state |
| `window:` | Popout window lifecycle (create, close, redock notification) -- main process is the broker |
| `popout:` | Popout ↔ main-window state/RPC relay (see Section 6) -- main process forwards these between the two renderer processes, it doesn't act on them itself |

---

## 3. Request / Response (`ipcMain.handle`)

The standard pattern for operations that return a result:

**Main process (`electron.js`):**
```javascript
ipcMain.handle('fs:writeFile', async (event, filePath, content, encoding) => {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, encoding);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

**Preload (`preload.js`):**
```javascript
writeFile: (path, content, encoding) =>
  ipcRenderer.invoke('fs:writeFile', path, content, encoding),
```

**Renderer (`src/`):**
```typescript
const result = await window.electronAPI.writeFile(filePath, content);
if (!result.success) { /* show error */ }
```

### Error convention

Handlers return `{ success: boolean; error?: string }` for mutable operations. Read operations either return data directly or re-throw (Electron serialises the exception to the renderer as a rejected Promise). There are no custom error classes.

---

## 4. Fire-and-Forget (`ipcRenderer.send`)

Used for commands that don't need a response — game control, exit acknowledgements, log writes:

```javascript
// Preload
runGame: (renpyPath, projectPath, warpTarget) =>
  ipcRenderer.send('game:run', renpyPath, projectPath, warpTarget),
```

These are registered on the main side with `ipcMain.on()` (not `handle`). No return value, no error propagation.

---

## 5. Push Events (Main → Renderer)

The main process initiates some events: file-system changes, game process lifecycle, project load progress, app menu commands, exit flow, and auto-updater status.

**Main process:**
```javascript
mainWindow.webContents.send('fs:file-changed-externally', { relativePath, absolutePath });
```

**Preload — returns an unsubscribe function:**
```javascript
onFileChangedExternally: (callback) => {
  const handler = (_event, data) => callback(data);
  ipcRenderer.on('fs:file-changed-externally', handler);
  return () => ipcRenderer.removeListener('fs:file-changed-externally', handler);
},
```

**Renderer — called in `useEffect`, unsubscribe on unmount:**
```typescript
useEffect(() => {
  const unsub = window.electronAPI.onFileChangedExternally(({ relativePath }) => {
    handleExternalChange(relativePath);
  });
  return unsub;
}, []);
```

All `on*` methods return an unsubscribe function. Always call it in the `useEffect` cleanup to prevent listener leaks on re-mount.

### Push event reference

| Channel | Fired when |
|---|---|
| `fs:file-changed-externally` | External `.rpy` edit detected (400ms debounced, 3s self-write suppression) |
| `game-started` | Ren'Py subprocess spawned |
| `game-stopped` | Ren'Py subprocess exited |
| `game-error` | Ren'Py subprocess failed to spawn |
| `project:load-progress` | During `project:load` (value 0–92, message string) |
| `menu-command` | Application menu item clicked |
| `check-unsaved-changes-before-exit` | OS quit triggered; renderer must reply |
| `show-exit-modal` | Forces exit confirmation modal |
| `save-ide-state-before-quit` | Renderer must persist state then call `ideStateSavedForQuit()` |
| `update-available` / `update-downloaded` / `update-error` | Auto-updater lifecycle |

---

## 6. Popout Window RPC Relay

A popped-out tab (`window:popout-tab`, opened from `useTabLifecycle.ts`'s `handlePopOutTab`) runs in its own `BrowserWindow` and renderer process, but the **main window remains the sole owner of app state**. The main process doesn't act on this data itself -- it's purely a relay between the two renderer processes, so this is a fourth pattern distinct from the three above: neither a simple request/response nor a one-way push, but a two-way state-and-RPC bridge with the main process as broker.

```
Popout renderer          Main process (relay only)       Main-window renderer
────────────────         ──────────────────────────      ─────────────────────
usePopoutTabClient   ←──  popout:props-update        ←──  useMainWindowPopoutSync
  .callHandler()     ──→  popout:call-handler         ──→   (the real handler runs)
                     ←──  popout:handler-result       ←──  ── returns its result
```

- **State flows down**: `useMainWindowPopoutSync` (main window) serializes just the slice of state a given tab type needs into a `PopoutSnapshot` and sends it via `sendPopoutStateUpdate` (`popout:state-update`) whenever that state changes. The main process relays it to the popout as `popout:props-update`. `usePopoutTabClient` (popout window) holds the latest snapshot and re-renders from it -- the popout never computes its own state.
- **Actions flow up**: when the user edits something in the popout, it calls `callPopoutHandler(tabId, handlerName, args)` (`popout:call-handler`) instead of mutating local state. The main process relays this to the main window, which invokes the *real* handler (the same `updateBlock`, `handleSaveBlock`, etc. a main-window edit would call) and replies with the result via `popout:handler-result`. This keeps a single writer for all app state regardless of which window an edit originated in.
- **Snapshot bootstrapping**: a newly opened popout sends `requestPopoutSnapshot` (`popout:request-snapshot`) to get its first `PopoutSnapshot` immediately, rather than waiting for the next state change in the main window.
- **Close-time flush**: before the main window's close cascade proceeds, it sends `popout:flush-requested` to every open popout and waits for `acknowledgePopoutFlush` (`popout:flush-complete`) from each, so a pending debounced edit in a popout is written to disk instead of silently dropped.
- **Redocking**: closing a popout window (or its own redock action) sends `window:tab-redocked` back to the main window, which reinserts the tab at its original pane/index via `useTabLifecycle.ts`'s `handleRedockTab`.

See `src/hooks/usePopoutSync.ts` for the full snapshot-serialization logic per tab type, and `src/PopoutTabRoot.tsx` for the popout window's entry point.

## 7. Adding a New IPC Channel

Every new channel requires changes in all three files:

**1. Register the handler in `electron.js`:**
```javascript
ipcMain.handle('namespace:action', async (event, arg1, arg2) => {
  try {
    const result = doWork(arg1, arg2);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

**2. Expose it in `preload.js`:**
```javascript
// Inside the contextBridge.exposeInMainWorld('electronAPI', { ... }) object:
myAction: (arg1, arg2) => ipcRenderer.invoke('namespace:action', arg1, arg2),
```

**3. Add it to the TypeScript interface in `src/types.ts`:**
```typescript
// Inside the Window.electronAPI interface:
myAction: (arg1: string, arg2: number) => Promise<{ success: boolean; data?: string; error?: string }>;
```

For a push event (main → renderer), add a `webContents.send()` call in `electron.js`, an `onX: (callback) => { ... }` wrapper in `preload.js`, and the corresponding `onX` method signature in `src/types.ts`.

---

## 8. Security Considerations

Electron's `contextBridge` ensures renderer JavaScript cannot call Node.js APIs directly — `window.electronAPI` is the only bridge. This is correct and should not be changed (do not disable `contextIsolation` or `sandbox`).

However, the current IPC handlers apply **no path validation** on file arguments. The `fs:writeFile`, `fs:moveFile`, and `fs:copyEntry` handlers accept any absolute path and write to it without restriction. The app relies on OS-level permissions as the only guard. This is an acceptable trade-off for a local desktop tool where the user controls the file system, but it means:

- Do not expose these IPC channels to untrusted content (e.g., user-loaded HTML files rendered in a `<webview>`).
- If adding handlers that accept paths, document that paths come from user selection (dialogs) or known project roots — not from untrusted user text input.
- `shell:openExternal` accepts arbitrary URLs; only call it with values sourced from trusted locations (not user-typed strings displayed in the UI).
