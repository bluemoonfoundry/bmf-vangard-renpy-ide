# State Persistence Architecture

Vangard Studio splits persisted state across several locations, each with a different owner, scope, and write trigger.

---

## 1. Overview

| Location | Scope | Written by | When |
|---|---|---|---|
| `<project>/game/project.ide.json` | Per-project | Renderer → IPC → Main | Save All, app exit |
| `<project>/**/*.rpy` | Per-file | Renderer → IPC → Main | Save All, app exit, tab close |
| `<project>/.renide/save-journal.json` | Per-project, transient | Main process | Only while a Save All is in flight (§6.2) |
| `userData/recovery/` | Per-project, per-session | Renderer → IPC → Main | 5 s after unsaved edits, at least every 60 s while editing (§6.4) |
| `userData/app-settings.json` | Global (all projects) | Main process | Settings change |
| `userData/api-keys.enc` | Global | Main process (encrypted) | API key save |

`userData` is the Electron user data directory (`app.getPath('userData')`): `%APPDATA%\vangard-studio` on Windows, `~/Library/Application Support/vangard-studio` on macOS, `~/.config/vangard-studio` on Linux. (The folder is the kebab-case `package.json` `name`, not the "Vangard Studio" display name — confirmed against the packaged app's `app.asar`.)

---

## 2. Project Settings (`game/project.ide.json`)

A single JSON file in the project's `game/` directory holds all IDE-specific project metadata. It is never read by Ren'Py — only by the IDE.

**What lives here:**

| Category | Examples |
|---|---|
| Canvas layout | Block positions, sizes, colors; layout mode and fingerprint; group containers |
| Sticky notes | Content, position, color for all three canvases |
| Compositions | Scene and imagemap composer data (a screen-layout-compositions slot exists in the schema but is unused — no in-app composer writes to it) |
| Character profiles | Tag → display name mappings |
| Diagnostics tasks | Task list (migrated from legacy `punchlistMetadata`) |
| Ignored diagnostics | Suppression rules |
| Open tabs / active tab | Session state (restored on reopen) |

**Decision rule for new state:** If the data is meaningful only within a specific project (canvas positions, compositions, tasks), it belongs here. If it applies across all projects (theme, font, Ren'Py path), it belongs in `app-settings.json`.

### Save triggers

Project settings are **not saved on a timer**. They are written to disk when:
- The user presses **Ctrl+S / Save All**
- A dirty tab is closed (before close confirmation)
- The app receives the `save-ide-state-before-quit` event (just before exit)

Individual `.rpy` files follow the same triggers — dirty file content is written at Save All or exit, not periodically.

Unsaved work *is* copied periodically, but never into the project: crash-recovery snapshots go to `userData/recovery/` (§6.4) and only become project files when the user saves after restoring them.

### Layout versioning

Canvas layouts are fingerprinted on load:

```
computeStoryLayoutFingerprint(blocks, links, layoutMode, groupingMode)
getStoryLayoutVersion()
```

If the stored fingerprint doesn't match the current algorithm version, the layout is recalculated automatically and the new positions are offered to the user. This is the mechanism for non-breaking layout algorithm upgrades.

---

## 3. App Settings (`userData/app-settings.json`)

Stores user preferences that are not project-specific. Written by the main process whenever a preference changes.

**What lives here:** theme, sidebar widths, editor font family and size, Ren'Py SDK path, mouse gesture settings, recent projects list (capped at 25), last browsed directory.

An `RENIDE_SETTINGS_OVERRIDE` environment variable (JSON string) is merged over the saved file at startup, which is useful for CI and testing without touching the actual settings file.

---

## 4. API Keys (`userData/api-keys.enc`)

API keys are encrypted using Electron's `safeStorage` API, which delegates to the OS keychain (Windows DPAPI, macOS Keychain, Linux libsecret). The stored file contains the entire key payload as a single encrypted blob — decrypted only in the main process, never sent to the renderer in plaintext.

**IPC interface:**
- `app:load-api-keys` → main decrypts and returns the key map
- `app:save-api-key` → main encrypts and writes the updated map

If `safeStorage.isEncryptionAvailable()` returns false (e.g., headless Linux without a keyring), the handlers degrade gracefully — keys are not persisted rather than stored in plaintext.

---

## 5. File Watcher

The main process watches the project folder for external `.rpy` changes using Node's `fs.watch()` with two guards to prevent false positives.

### Debounce

File system events are debounced at `WATCH_DEBOUNCE_MS = 400 ms`. Rapid successive events for the same file (common during editor saves) collapse into one notification.

### Self-write suppression

When the IDE writes a file via the `fs:writeFile` IPC handler, it records a timestamp in `recentSelfWrites` (a `Map<path, timestamp>`). The watcher ignores any change event for that path within `SELF_WRITE_SUPPRESS_MS = 3000 ms` of that timestamp. This prevents the IDE from reacting to its own writes.

```
pointerdown on Save
  → fs:writeFile (renderer → main)
      → file written to disk
      → recentSelfWrites.set(path, Date.now())
  fs.watch fires (within 3 s)
      → suppressed (self-write guard)
```

### Renderer response

When an external change passes both guards, the main process fires `fs:file-changed-externally` with `{ relativePath, absolutePath }`. The renderer then:
- **Auto-reloads silently** if the block's editor is clean (no unsaved changes)
- **Shows a warning bar** ("Reload" / "Keep my changes") if the editor is dirty

### Refresh Project

The `project:refresh` IPC handler performs a full reconciliation — re-reads all `.rpy` files, images, and audio assets from disk and returns the same structure as `project:load`. The renderer merges the result with current state, queueing dirty-file conflict warnings for any files that changed externally while the editor has unsaved edits. This is triggered by **File → Refresh Project** or the Project Explorer context menu.

---

## 6. Crash Safety and Recovery

Four layers, from a single file up to work that was never saved:

| Layer | Protects against | Code |
|---|---|---|
| Atomic single-file write | A file truncated by a crash mid-write | `src/lib/atomicFileWrite.js` |
| Save transaction | A Save All cut off half-way, leaving some `.rpy` files new and some old | `src/lib/saveTransaction.js` |
| Corrupt-settings backup | An unreadable `project.ide.json` being overwritten with defaults | `PROJECT_LOAD_WORKER_CODE` in `electron.js` |
| Recovery snapshots | Unsaved edits lost to a crash, forced kill or power cut | `src/lib/recoveryStore.js`, `src/hooks/useRecoverySnapshots.ts` |

### 6.1 Atomic single-file writes

The `fs:writeFile` IPC handler (used for `game/project.ide.json` and other single-file writes) writes atomically: content goes to a temp file in the same directory (`.<filename>.tmp-<uuid>`), then `fs.rename()`s it over the destination. `fs.rename` is a single atomic directory-entry update on both POSIX and NTFS, so a crash, forced kill, or power loss mid-save can only ever leave one of two outcomes for the destination file:

- **Before the rename completes:** the destination still has its old content, untouched. A stray `.tmp-*` file may be left next to it — harmless, safe to delete manually if ever seen.
- **After the rename completes:** the destination has the full new content. There is no window where it can be partially written or truncated.

`cleanupStaleTempFiles` (`src/lib/atomicFileWrite.js`) runs automatically on `project:load`, recursively removing any leftover `.tmp-*` files from a previous crashed session. This is pure tidy-up — the files those temp files were meant to replace were never touched, so nothing needs to be recovered from them.

### 6.2 Transactional Save All

Atomic writes make each file all-or-nothing, but not a *batch* of files. Save All therefore sends every dirty `.rpy` file to the `project:saveFiles` IPC handler, which commits them as one transaction with a write-ahead journal at `<project>/.renide/save-journal.json`:

1. Write the journal with `state: "staging"` and, for each file, its target path, temp path and SHA-256.
2. Stage every new content to a sibling temp file named `.<file>.txn-<txid>`, fsync'd.
3. Rewrite the journal with `state: "committed"`. **This is the commit point.**
4. Rename each temp over its target.
5. Delete the journal.

On the next `project:load` — before any file is read — `recoverSaveTransaction` inspects a leftover journal:

| Journal state | Action | Toast |
|---|---|---|
| `staging` | Roll back: delete the staged temps. Every target still has its old content. | "An interrupted save from last session was discarded; N files kept their previous saved content." |
| `committed` | Roll forward: rename the remaining temps into place, verifying each checksum. | "An interrupted save from last session was completed (N files)." |
| Unreadable, malformed, or a staged file fails its checksum | Nothing is deleted; the journal is kept so recovery is retried next time. | "…could not be recovered: …. Saving is blocked until .renide/save-journal.json is resolved." |

While a journal is unresolved, Save All refuses to start ("A previous save could not be completed and must be resolved first") rather than stacking a new transaction on an unfinished one. To unblock it manually, close the project and open `.renide/save-journal.json`. Each `.txn-` file it lists holds the full new content of its target. Copy any content you want to keep into the target `.rpy` files, then delete the journal and the `.txn-` files.

Journal paths are stored relative to the project root, so a project folder moved or renamed after a crash still recovers. `.txn-` temps are deliberately not matched by `cleanupStaleTempFiles`: after the commit point a temp may be the only copy of the saved content, so only transaction recovery may remove it.

If the commit succeeded but a rename failed (for example, a file locked by another program), the save counts as done but shows a warning ("…some files are still being finalized…"). The next save or project load finishes the remaining renames.

#### Save All result reporting

`handleSaveAll` (`src/hooks/useProjectIO.ts`) only clears dirty state and reports "All changes saved" if the transaction **and** the `game/project.ide.json` write both succeeded. `project.ide.json` is written after the scripts and is not part of the transaction. If only that write fails, the toast reads "Script files were saved, but workspace settings were not" and settings stay dirty so the user can retry. If the transaction fails, nothing is cleared and the toast names the underlying error.

### 6.3 Unreadable `project.ide.json`

Sometimes `game/project.ide.json` exists but isn't valid JSON, or doesn't contain a JSON object. The load worker then copies it to `game/project.ide.json.corrupt-<ISO timestamp>.bak` (colons and dots replaced by `-`), and the project opens with default settings. The warning toast shows the backup path. The next save rewrites `project.ide.json` from defaults, so the backup is the only copy of the old content. `.rpy` files are never written by the load path.

Because the backup lives under `game/`, a Ren'Py build would package it. Delete the backup once you no longer need it, or exclude backups in `options.rpy` with `build.classify('**.bak', None)`.

A missing `project.ide.json` (`ENOENT`) is normal for a new project and is silent. A permission error is reported as a warning but no backup is made.

### 6.4 Crash-recovery snapshots

Unsaved work is copied to the Electron user data directory while you edit, so a crash, forced kill or power cut loses at most a few seconds of it. Snapshots are never written into the project folder.

**What is captured:**
- The unsaved buffer of every dirty `.rpy` file, with the SHA-256 of that file's on-disk content at snapshot time.
- Every dirty untitled draft.
- When workspace settings are unsaved, the full `project.ide.json` payload the next save would write.

**Where:** `userData/recovery/<project id>/session-<session id>.json`.
- The project id is the SHA-256 of the normalized project root path: forward slashes, no trailing slash, lower-cased on Windows.
- The session id is a fresh UUID for each project open.

Each session only ever writes its own file, so a new session can never overwrite a crashed one's snapshot.

**When:** `useRecoverySnapshots` writes 5 s after the last unsaved change, and at least every 60 s during continuous editing. Once nothing is dirty any more (after Save All), the session's file is deleted. On an intentional quit, including choosing **Don't Save**, the main process also deletes the current session's file. Only an abnormal exit leaves one behind.

**Limits** (`RECOVERY_LIMITS` in `src/lib/recoveryStore.js`):

| Limit | Value | When exceeded |
|---|---|---|
| Snapshot size | 25 MB | That snapshot is skipped; the previous one is kept |
| Files per project | 3 | Oldest other sessions' files are deleted |
| Total size | 200 MB | Least recently updated files (any project) are deleted |
| Age | 30 days | Deleted by a sweep at app start |

These limits never evict the current session's own file, or a file belonging to another app instance that is still running (see below). Unreadable or unknown-version snapshot files are renamed to `.corrupt` and never offered.

**On the next open** of the same project, after `project:load` succeeds, `recovery:listPending` returns the newest snapshot from another session, skipping any that belong to a live instance. The **Recover unsaved work** dialog lists each item with a checkbox:

- Files unchanged on disk since the snapshot are checked.
- Files **changed on disk since** the snapshot are flagged and unchecked by default, because restoring them would discard the newer disk content.
- Files **deleted from disk** are unchecked and restore as an untitled draft named "(recovered)".
- Untitled drafts are checked.
- **Workspace changes** (notes, notecards, compositions, layout) covers the unsaved `project.ide.json` payload, including Project-canvas block positions, sizes and colours. It is checked unless `project.ide.json` changed on disk since the snapshot.

| Action | Effect |
|---|---|
| **Restore selected** | Selected items are applied as **unsaved** changes; nothing is written to disk. The snapshot file is kept until this session's own first snapshot, which holds the restored work, has been written. It's deleted after that. |
| **Discard…** | After confirmation, deletes the offered snapshot file. |
| **Decide later** (also Esc and backdrop click) | Leaves the snapshot in place; it is offered again on the next open. |

Restore and Discard only ever remove the snapshot that was shown. Several crashed sessions can be pending, for example after a second crash following **Decide later**. In that case the older ones are offered on later opens. Autosave for the new session starts only after the dialog is resolved.

**Multiple instances:** each snapshot records the writer's process id and the OS boot time. If that process is still running *in the same boot*, the snapshot belongs to a live instance and is neither offered nor deleted. A process id recorded during an earlier boot is always treated as dead, because process ids are reused after a reboot.

**Clearing snapshots manually:** close Vangard Studio and delete `userData/recovery/` (or one project's subfolder). Nothing in a project depends on it.

The main-process store is exposed through four IPC handlers: `recovery:write`, `recovery:clear`, `recovery:listPending` and `recovery:discardPending`. Every session id is bound to the project root it was opened for, so a write can never land in another project's folder.

---

## 7. Schema Versioning and Migrations

`game/project.ide.json` carries a top-level integer `schemaVersion`. The current version is `PROJECT_SETTINGS_SCHEMA_VERSION` in `src/lib/projectSerializer.ts` (currently `1`). A file without the field is version 0 — everything written before versioning existed. A non-integer or negative value is logged and treated as version 0.

On load, `migrateProjectSettings` walks the raw JSON forward through `PROJECT_SETTINGS_MIGRATIONS` one step at a time until it reaches the current version. Migrations run in memory only; the upgraded file is written by the next save.

**Rules every migration step follows:**

- **Pure:** takes the raw object and returns a new one; no I/O.
- **Lossless:** never drops data it doesn't understand.
- **Tolerant:** accepts partially populated input — any field may be missing.

**To change the on-disk shape:**

1. Bump `PROJECT_SETTINGS_SCHEMA_VERSION`.
2. Append a `{ from: N, to: N + 1, description, migrate }` step to `PROJECT_SETTINGS_MIGRATIONS`.
3. Add a fixture under `src/test/fixtures/projectSettings/` and a case to `src/lib/projectSettingsMigration.test.ts`.
4. If you added a field to `ProjectSettings`, list it in `KNOWN_PROJECT_SETTINGS_KEYS` (the compiler enforces this).

A gap in the registry (no step starting at the current version) throws. That's a programming error, not bad input.

**Unknown fields** are top-level keys this build doesn't recognise. They're kept in `ProjectSettingsMeta.unknownFields` and written back on save by `buildProjectSettingsForSave`, so opening a project in an older build never strips data a newer build added. If a key collides, the known field wins.

**Newer files:** sometimes a file's `schemaVersion` is higher than this build supports. It's loaded unmigrated and its version is **not** downgraded on save. The user sees "This project was saved by a newer version of Vangard Studio. Settings this version does not recognise will be kept, but may not take effect."

**Existing migrations:**

| Step | Changes |
|---|---|
| v0 → v1 | Single scene composition (`sceneComposition`) → multi-scene `sceneCompositions` map keyed by `'scene-default'`, only when the new map is absent. `punchlistMetadata` → `diagnosticsTasks` array, only when tasks are absent (`punchlistMetadata` is kept). Tab type/id `'punchlist'` → `'diagnostics'` in both panes, de-duplicated. |

The layout fingerprint system (Section 2) handles layout algorithm upgrades without a schema migration — it just recalculates.
