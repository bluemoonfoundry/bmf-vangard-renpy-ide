# Autosave Recovery Snapshots and Startup Recovery Prompt

**Status:** Draft (pending review)
**Date:** 2026-10-11
**Beads:** `bmf-vangard-renpy-ide-b70a.2.3` (parent `b70a.2`; docs follow-up `b70a.2.4`)

## Problem

Nothing autosaves today. If Vangard Studio crashes, is killed, or the machine loses power, every unsaved `.rpy` buffer, every dirty untitled draft, and all unsaved workspace state is lost. Workspace state includes sticky notes, notecards, scene and imagemap compositions, character notes, and canvas layout. Much of that is hand-authored content, not UI state.

b70a.2.2 made *saving* crash-safe: Save All is now an all-or-nothing transaction. It did nothing for work that was never saved.

## Goals

- After a crash, opening the project offers to recover the unsaved work. The user can restore it, deliberately discard it, or defer the decision.
- Restoring never writes to disk. Recovered work comes back as **unsaved changes**, and the user saves it through the normal Save flow. This keeps the roadmap rule that a metadata or recovery action must never imply a source write.
- Files that changed on disk after the snapshot are visibly flagged and not restored by default. A stale buffer must not overwrite newer disk content on the next Save All.
- Snapshot storage is bounded per project, across projects, and over time.
- Autosave never interrupts typing: no toasts, no blocking, and no new on-disk state in the project folder.

## Non-Goals

- **Version history or local history.** Snapshots hold only unsaved work and are deleted once that work is saved or intentionally discarded.
- **Cross-machine recovery.** Snapshots live in the per-user app data folder, so a project copied to another machine after a crash brings no recovery with it. This was a deliberate trade-off so that unsaved work never lands in the project tree, where git, cloud sync or a Ren'Py build could pick it up.
- **Writing recovered content to disk automatically**, even when a file is unchanged on disk.
- **Per-hunk merging** of a changed-on-disk file. The choice is per file: restore the buffer, or keep disk.

## Decisions (agreed during brainstorming)

| Decision | Choice |
|---|---|
| Storage location | App data folder: `userData/recovery/<project-id>/` |
| Captured scope | Unsaved scripts, dirty untitled drafts, and the unsaved `project.ide.json` payload |
| Conflict handling | Per-file checkboxes; changed or deleted on disk is flagged and unchecked by default |
| Architecture | The renderer builds snapshots; the main process stores them and enforces limits (approach A) |
| Cadence | 5 s after the last change, with a 60 s cap while there are unsaved changes |
| Bounds | 25 MB per snapshot; 3 session files per project; 200 MB in total; 30-day expiry |
| Dialog actions | Restore selected / Discard… (confirmed) / Decide later (also Esc) |

## Design

### 1. Storage and lifecycle (main process, `src/lib/recoveryStore.js`)

An ESM module like `atomicFileWrite.js` and `saveTransaction.js`, importable by `electron.js` and by Vitest. Filesystem primitives are injectable for tests.

**Session-scoped files.** Each time a project is opened, the renderer generates a random `sessionId` (a UUID). That session writes only to its own file:

```
userData/recovery/<project-id>/session-<sessionId>.json
```

- `<project-id>` is the sha256 hex of the canonical project path, lowercased on Windows. The full path is also stored inside the file, for display and for a mismatch check.
- A crash leaves that session's file behind. On the next open, any session file for the project that **isn't the current session's own** counts as pending recovery.
- Because a session only ever writes its own file, a new session can never overwrite or delete a pending crash snapshot. This is what makes "Decide later" safe.
- **Live-instance guard.** The app has no single-instance lock, so each snapshot records the main-process `pid` and the OS boot time. A pid from an earlier boot is always treated as dead, since pids are reused after a reboot. The size limits never evict a live instance's file. `listPending` skips a snapshot whose `pid` is a different process that is still alive (`process.kill(pid, 0)` succeeds), so a second instance never offers the first instance's live session. Snapshots from the same process with a different `sessionId` (an earlier session in this run) are treated as pending.

**Snapshot format** (`version: 1`):

```jsonc
{
  "version": 1,
  "sessionId": "…",
  "pid": 12345,
  "bootTime": 1760200000000,
  "projectRoot": "C:\\Users\\me\\Ren'Py Projects\\ゲーム",
  "updatedAt": "2026-10-11T20:15:03.120Z",
  "files": [
    // diskSha256: sha256 of this file's on-disk content when the snapshot was
    // written, or null if the file didn't exist on disk then
    { "relativePath": "game/script.rpy", "content": "…", "diskSha256": "…" }
  ],
  "untitled": [ { "id": "untitled-1", "title": "Untitled-1", "content": "…" } ],
  "settings": { /* project.ide.json payload */ },   // or null when not unsaved
  "settingsDiskSha256": "…"                         // or null
}
```

**Disk fingerprints are taken by the main process at write time.** The renderer has no record of each file's on-disk content. Instead, `recovery:write` reads each listed file (and `game/project.ide.json` when `settings` is present) and stores its sha256 alongside the snapshot. At restore time a mismatch means the file changed *after* the snapshot. Only unsaved files are read, so the cost is proportional to what's unsaved.

**Write path.** The renderer sends the payload without the fingerprint fields; the main process adds them, serialises, checks the size limit, and writes atomically with `atomicWriteFile`.

**Bounds**, enforced on every write:
1. If the serialised snapshot is over **25 MB**, skip the write and log a warning once per session. The previous snapshot, if any, is kept.
2. Keep at most **3** session files per project; delete the oldest by `updatedAt`, never the current session's file.
3. Keep at most **200 MB** across all projects. Delete whole session files, least recently updated first, never the current session's file.
4. On app start, delete session files (including `.corrupt` ones) not modified for **30 days**, and remove empty project folders.

Limit 2 can delete a deferred pending snapshot. That only happens if the user chooses "Decide later" and the app then crashes with new unsaved work more than twice in a row. The limit wins in that case; storage stays bounded, and the newest work is always kept.

**Deletion rules:**
1. **The session cleans up after itself:** the renderer calls `recovery:clear(sessionId)` when nothing is unsaved any more, but only if that session has written a snapshot. A freshly opened project therefore never deletes anything.
2. **Intentional quit:** when the existing quit flow sets `forceQuit` (no unsaved work, or the user chose Save or Don't Save), the main process deletes the current session's file. "Don't Save" is an explicit discard. To do this, the main process records `currentRecoverySessionId`, the `sessionId` from the most recent `recovery:listPending` or `recovery:write` for `currentProjectRoot`, and resets it when a different project is loaded.
3. **Dialog outcome:** Restore and Discard delete **only the offered snapshot**. Older pending files are *not* superseded by it: after "Decide later" a newer session never contains the deferred work, so they stay and are offered on later opens. After a Restore, the offered file is deleted only once this session's first snapshot, which holds the restored work, has reached disk. Decide later deletes nothing. *(Revised after final review: the original "delete all pending files" rule could delete deferred crash work the user had never seen.)*

**IPC** (`namespace:action`, in `preload.js` as `electronAPI.recovery.*`). Every handler works only on `currentProjectRoot`, which `project:load` has already vetted. Paths are built only inside the main process, and `sessionId` must match a UUID pattern, so a renderer can't steer writes elsewhere.

| Channel | Purpose |
|---|---|
| `recovery:write(sessionId, payload)` | Fingerprint, apply limits, atomic write. Returns `{ success, skipped?: 'too-large', error? }` |
| `recovery:clear(sessionId)` | Delete this session's file, if present |
| `recovery:listPending(sessionId)` | Newest pending snapshot for the open project (see below), or `null` |
| `recovery:discardPending(sessionId)` | Delete every pending file for the open project except this session's own |

`listPending` returns the snapshot with each entry's **disk status already worked out**: `'unchanged' | 'changed' | 'deleted'` for files, and `'unchanged' | 'changed' | null` for settings. File entries whose content equals the current disk content are dropped (for example, a crash right after a save), because there's nothing to recover. If no entries remain, it returns `null`.

### 2. Capture (renderer, `src/hooks/useRecoverySnapshots.ts`)

**Inputs:**
- `projectRootPath`
- The unsaved-state refs: `dirtyBlockIdsRef`, `dirtyEditorsRef`, `untitledFilesRef`
- `hasUnsavedSettings`
- `blocksRef` and `editorInstances`
- `buildSettingsPayload()`
- `enabled`

The hook restarts its timer whenever `blocks`, `untitledFiles`, the dirty sets, `hasUnsavedSettings`, or the identity of the memoised settings builder change. Editor keystrokes reach `blocks` via the existing 800 ms `onContentChange` debounce, so no separate `notifyEdit()` call is needed.

- **Turning it on:** `enabled` stays `false` until the startup recovery check for this project has finished. That means `listPending` returned `null`, or the user chose Restore, Discard or Decide later. A new `sessionId` is created whenever `projectRootPath` changes.
- **Timing:**
  - Any change to the unsaved state, `blocks` or `untitledFiles` restarts a 5 s timer.
  - A 60 s cap guarantees a snapshot during long continuous typing.
  - No snapshot starts while one is already being written; a change that arrives meanwhile schedules one more pass.
  - Nothing runs when nothing is unsaved.
- **Building a snapshot:**
  - **Files:** for each id in the unsaved sets with a `filePath`, use the live text of its Monaco instance, falling back to `block.content`. This is the same precedence Save All uses.
  - **Untitled drafts:** every entry with `isDirty`.
  - **Settings:** `buildSettingsPayload()` only when `hasUnsavedSettings` is true.
- **Deleting the session's file:** when the unsaved state goes from something to nothing, call `recovery:clear(sessionId)`, but only if this session has written a snapshot.
- **Failures** are logged once per session at warn level, with no toast.

**Popout windows:** edits made in a popout during its 800 ms debounce may be missing from the snapshot taken at that moment; the next snapshot picks them up. That's accepted. Snapshots don't flush popouts, to avoid IPC round trips on every timer tick.

**Refactor:** the settings object built inline in `useProjectIO.handleSaveProjectSettings` moves into an exported pure function, `buildProjectSettingsPayload(params)`. `handleSaveProjectSettings` and the snapshot hook both use it, so a restored payload always has exactly the shape a save produces. `buildProjectSettingsForSave`, which adds `schemaVersion` and unknown fields (b70a.2.1), is applied to it in both places.

### 3. Restore flow (renderer)

**Triggering the dialog.**
1. `useProjectLoad.loadProject` hydrates and shows the existing save-recovery and settings-warning toasts.
2. It calls `recovery:listPending(sessionId)`. A non-null result is stored in App state (`pendingRecovery`), which opens `RecoveryModal`.
3. A `null` result marks recovery as resolved for this project, which enables autosave.
4. If `listPending` fails, log the error, mark recovery resolved, and continue. Recovery must never block opening a project.

**`RecoveryModal`** (`src/components/RecoveryModal.tsx`; `createPortal` to `document.body` with `useModalAccessibility`):

- **Header:** "Recover unsaved work from {relative time} ({absolute time})?"
- **Rows**, each a checkbox with a badge:

  | Item | Badge | Default |
  |---|---|---|
  | Script, unchanged on disk | "unchanged on disk" | checked |
  | Script, changed since | "changed on disk since" | unchecked |
  | Script, deleted from disk | "deleted from disk" (restored as an untitled draft) | unchecked |
  | Untitled draft | "untitled draft" | checked |
  | Workspace changes (notes, notecards, compositions, layout) | "changed on disk since" when the settings fingerprint differs | checked unless changed |

- **Actions:**
  - **Restore selected** (primary; disabled when nothing is checked).
  - **Discard…** shows an inline confirmation, "This permanently deletes the recovered work", then calls `recovery:discardPending`.
  - **Decide later** keeps everything; the dialog appears again on the next open. **Esc and the close button mean Decide later**, so dismissing the dialog is never destructive.

**Applying a restore.** A pure function `applyRecoverySnapshot(snapshot, selection, deps)` in `src/lib/recoveryRestore.ts` takes setters and refs as `deps`. It writes nothing to disk. Items are applied in this order:

1. **Workspace changes, first**, so later layout hydration can't overwrite restored file text.
   - Build a `ProjectLoadResult` from the current in-memory files plus `snapshot.settings`.
   - Run `deserializeProjectData`. Blocks keep their ids because `existingBlocksMap` matches on file path.
   - Apply only the settings-derived state through the existing hydration setters: notes (all three canvases), notecards and links, timeline, character profiles and portraits, punchlist and tasks, ignored diagnostics, scene and imagemap compositions, route layout cache, canvas settings and tabs.
   - Store `settingsMeta` in `projectSettingsMetaRef`, then set `hasUnsavedSettings(true)`.
2. **Scripts (unchanged or changed on disk):** set the block's content, call `model.setValue` on the open editor if there is one, and add the id to `dirtyBlockIds`.
3. **Scripts deleted from disk:** create an untitled draft titled with the original file name and the recovered content, marked unsaved. Recreating the file silently would undo a deletion the user may have meant.
4. **Untitled drafts:** recreate them as untitled tabs with their content, marked unsaved.

`useUntitledFiles` gets a small addition, `createUntitledFile({ title, content })`, for steps 3 and 4.

**After a restore:**
- **If every selected item applied:** delete the pending files (`discardPending`), mark recovery resolved so autosave starts and its first snapshot protects the restored work, and show the toast "Restored N items — review and save when ready".
- **If any item failed:** report the failures in one error toast, keep the pending files so recovery is offered again next time, and still mark recovery resolved for this session.

### 4. Error handling

- **An unreadable or corrupt snapshot:** `listPending` renames it to `session-<id>.json.corrupt`, logs a warning, and skips it. It never blocks the project from opening, never deletes data silently, and stays subject to the size limits and expiry.
- **A project mismatch:** a snapshot whose stored `projectRoot` doesn't match the open root, compared after normalising (lowercase on Windows, unified separators), is ignored. This guards against hash collisions or a copied app data folder.
- **An unknown `version`:** treated like a corrupt file and moved aside.
- **A write that fails** (disk full, permissions): logged once; the previous snapshot is kept.
- **A crash during the startup dialog:** nothing changed, because pending files are only deleted after a successful restore or a confirmed discard.

## Testing

| Test file | Covers |
|---|---|
| `src/lib/recoveryStore.test.ts` | Real temp folders whose names contain spaces and non-ASCII characters. Covers: write and list; the session's own file isn't pending; all bounds (per-project count, global total, single-file size, 30-day expiry); disk status unchanged, changed and deleted; entries equal to disk dropped; corrupt and unknown-version files moved aside; project mismatch ignored; invalid `sessionId` rejected; `clear` and `discardPending` never touch the current session's file. |
| `src/hooks/useRecoverySnapshots.test.ts` | Fake timers: 5 s timer, 60 s cap, no overlapping writes, nothing while disabled or when nothing is unsaved, live editor text preferred, settings included only when unsaved, the session's file deleted only after it has written one, a new `sessionId` per project. |
| `src/lib/recoveryRestore.test.ts` | Restored items come back as unsaved and nothing is written to disk; workspace changes applied before file text; a deleted file becomes an untitled draft; partial failure keeps pending files; a clean restore discards them. |
| `src/components/RecoveryModal.test.tsx` | Checkbox defaults per status; Restore disabled when nothing is checked; Esc and close mean Decide later; Discard needs confirmation; the Restore selection contains only checked items. |
| `src/hooks/useProjectIO.test.ts` | Regression: `buildProjectSettingsPayload` produces the same payload `handleSaveProjectSettings` wrote before the refactor. |
| `src/hooks/useProjectLoad.test.ts` | A pending snapshot opens the dialog state; `null` or an error marks recovery resolved. |
| `e2e/smoke/34-crash-recovery.spec.ts` | Acceptance. Type an unsaved edit, wait for the snapshot file, then kill Electron (`forceExit`, which skips clean-quit cleanup). Relaunch: the dialog appears, Restore brings the edit back as unsaved, and the file on disk is unchanged. Second case: Discard, relaunch, no dialog and no snapshot files. |

## Files

| File | Change |
|---|---|
| `src/lib/recoveryStore.js` | **New**: storage, fingerprints, limits, pending-snapshot lookup |
| `src/lib/recoveryRestore.ts` | **New**: `applyRecoverySnapshot` |
| `src/hooks/useRecoverySnapshots.ts` | **New**: capture hook |
| `src/components/RecoveryModal.tsx` | **New**: startup dialog |
| `electron.js` | `recovery:*` IPC handlers; delete the session file on `forceQuit`; expiry sweep on app start |
| `preload.js` | `electronAPI.recovery.*` |
| `src/types.ts` | `RecoverySnapshot`, `PendingRecovery`, `RecoveryEntryStatus`, IPC typings |
| `src/hooks/useProjectIO.ts` | Extract `buildProjectSettingsPayload` |
| `src/hooks/useProjectLoad.ts` | Call `listPending` after hydrate; recovery-resolved signal |
| `src/hooks/useUntitledFiles.ts` | `createUntitledFile({ title, content })` |
| `src/App.tsx` | Wire the hook, `pendingRecovery` state, the modal |
| `src/test/mocks/electronAPI.ts` | Mock `recovery.*` |

## Open Questions

None. All decisions above were agreed during brainstorming on 2026-10-11.
