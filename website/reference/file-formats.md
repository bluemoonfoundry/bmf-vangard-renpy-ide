# File Formats

### 10.1 Project Files

Vangard Studio persists project-level state in two locations inside your Ren'Py project root. Ren'Py ignores both entirely. See [State Persistence Architecture](../architecture/STATE_PERSISTENCE.md) for the full write/read model.

| File | Purpose | Key Contents |
|------|---------|-------------|
| `game/project.ide.json` | Single combined file holding all IDE-specific project metadata — canvas state, sticky notes, compositions, tasks, session state. | See field table below. |
| `.vangard/snippets.json` | Project-specific code snippets. | `version` string plus a `categories` array of `{ name, snippets: [{ title, description, code }] }`. |
| `.renide/screenshots/` | Saved diagnostics/canvas screenshots. | Not a data file — a directory of image files. |
| `.renide/save-journal.json` | Write-ahead journal for Save All. Exists only while a save is in progress, or after one was interrupted. | `version`, `txid`, `state` (`staging`/`committed`), `createdAt`, and `entries: [{ target, temp, sha256 }]` with project-relative paths. See [State Persistence § Transactional Save All](../architecture/STATE_PERSISTENCE.md#_6-2-transactional-save-all). |

#### `game/project.ide.json` Key Fields

Written by `handleSaveProjectSettings` in `src/hooks/useProjectIO.ts` on Save All / dirty tab close / app exit; read on project load. The `ProjectSettings` interface (`src/types.ts`) is the source of truth.

The file is versioned. Older files are upgraded in memory when the project opens, and the upgraded version is written by the next save. Top-level keys this version of Vangard Studio doesn't recognise are kept and written back unchanged. A file saved by a newer version is never downgraded. See [State Persistence § Schema Versioning and Migrations](../architecture/STATE_PERSISTENCE.md#_7-schema-versioning-and-migrations).

If the file can't be read as JSON, Vangard Studio copies it to `game/project.ide.json.corrupt-<timestamp>.bak` before opening the project with default settings. The warning toast shows the backup path. The next save overwrites `project.ide.json`, so copy anything you need from the backup first. Ren'Py packages files under `game/` into builds, so delete the backup when you're done, or add `build.classify('**.bak', None)` to `options.rpy`.

| Field | Type | Description |
|-------|------|-------------|
| `schemaVersion` | integer | Format version of this file (currently `1`). Absent in files written before versioning, which are treated as version 0. |
| `draftingMode` | boolean | Whether drafting mode is currently enabled. |
| `storyCanvasLayoutMode` | string | Layout algorithm for the Project Canvas (`flow-lr`, `flow-td`, `connected-components`, `clustered-flow`). |
| `storyCanvasGroupingMode` | string | Grouping algorithm for the Project Canvas (`none`, `connected-component`, `filename-prefix`). |
| `storyCanvasLayoutFingerprint` / `storyCanvasLayoutVersion` / `storyCanvasLayoutWasUserAdjusted` | string / number / boolean | Layout versioning fields (see State Persistence Architecture § Layout versioning). |
| `storyBlockLayouts` | object | Map of block ID to saved position, dimensions, and optional color. |
| `storyCanvasHasAutocentered` | boolean | Whether the Project Canvas has already auto-centered once. |
| `routeCanvasLayoutMode` / `routeCanvasGroupingMode` / `routeCanvasLayoutFingerprint` / `routeCanvasLayoutVersion` / `routeCanvasLayoutWasUserAdjusted` / `routeCanvasHasAutocentered` | — | Same set of layout/versioning fields as above, for the Flow Canvas. |
| `routeNodeLayouts` | object | Map of label node ID to saved position, for the Flow Canvas. |
| `choiceCanvasLayoutMode` / `choiceCanvasGroupingMode` / `choiceCanvasHasAutocentered` | — | Layout fields for the Choices Canvas (no fingerprint/version — it reuses route layout data). |
| `openTabs` / `activeTabId` | array / string | Currently open editor tabs and the active tab ID (primary split pane). |
| `splitLayout` | string | Editor split mode: `none`, `right`, or `bottom`. |
| `splitPrimarySize` | number | Size of the primary split pane. |
| `secondaryOpenTabs` / `secondaryActiveTabId` | array / string | Open tabs and active tab ID for the secondary split pane. |
| `stickyNotes` | array | Sticky notes on the Project Canvas. Each has `id`, `content` (markdown), `position: {x, y}`, `width`, `height`, `color`. |
| `routeStickyNotes` | array | Sticky notes on the Flow Canvas. Same shape as above. |
| `choiceStickyNotes` | array | Sticky notes on the Choices Canvas. Same shape as above. |
| `characterProfiles` | object | Map of character tag to profile notes (free-text). |
| `punchlistMetadata` | object | Legacy task tracking map, migrated to `diagnosticsTasks` on load (see State Persistence Architecture § Migration Patterns). |
| `diagnosticsTasks` | array | Tracked tasks with `id`, `title`, optional `description`, `status` (`open`/`completed`), optional `blockId`, `line`, `stickyNoteId`, and `createdAt` timestamp. |
| `ignoredDiagnostics` | array | Suppression rules for diagnostics. Each has `category`, `message`, and optional `filePath` / `blockId` / `line` to narrow the match. |
| `sceneCompositions` | object | Map of composition ID to a serialized `SceneComposition` (background image path, sprite array, resolution). |
| `sceneNames` | object | Map of composition ID to a human-readable display name. |
| `imagemapCompositions` | object | Map of composition ID to a serialized `ImageMapComposition` (ground/hover image paths, hotspot array). |
| `scannedImagePaths` / `scannedAudioPaths` | array of strings | Directories scanned for image/audio assets. |
| `storyElementsTabState` | object | Last-active tab/sub-tab in the Story Elements panel, restored on reopen. |
| `dismissedImplicitVariableHint` | boolean | Whether the user has dismissed the implicit-variable diagnostics hint. |
| `completedMilestones` | array of strings | IDs of onboarding/milestone prompts the user has already completed. |

There is no persisted screen layout composition — screens are generated from and parsed directly out of `.rpy` files (`src/lib/screenParser.ts`, `screenCodeGenerator.ts`), not stored as a composition object.

#### `.vangard/snippets.json` Structure

```json
{
  "version": "1.0",
  "categories": [
    {
      "name": "Dialogue",
      "snippets": [
        { "title": "Say", "description": "Basic dialogue line", "code": "..." }
      ]
    }
  ]
}
```

This is a different shape from `UserSnippet` (used for global snippets in `app-settings.json`'s `userSnippets` field — see § 10.3), which has `id`, `title`, `prefix`, `description`, `code`, and optional `monacoBody`. Project snippets have no `id` or `prefix`; they are grouped into named categories instead.

### 10.2 Temporary Files

| File | Purpose | Lifecycle |
|------|---------|-----------|
| `_ide_after_warp.rpy` | Warp variable overrides. Contains a `label after_warp:` block that sets variable values before warped execution begins. | Created when warping to a label with variable overrides. Automatically deleted when the game process stops. |
| `.<file>.tmp-<uuid>` | Temp file for a single atomic write, next to its target. | Renamed over the target when the write finishes. Leftovers from a crash are deleted automatically on the next project load. |
| `.<file>.txn-<id>` | Staged new content of a file during Save All, next to its target. | Renamed over the target when the save finishes. After a crash, the next project load either completes the save or discards these files. Don't delete them while `.renide/save-journal.json` exists: one may be the only copy of what you saved. |
| `game/project.ide.json.corrupt-<timestamp>.bak` | Copy of an unreadable `project.ide.json`. | Created on project load when the settings file isn't valid JSON. Never deleted automatically. |

### 10.3 App-Level Files

| File | Location | Purpose |
|------|----------|---------|
| `app-settings.json` | Electron `userData` directory | Theme, editor font, sidebar dimensions, Ren'Py SDK path, recent project list, mouse gesture preferences, global user snippets, menu templates. |
| `recovery/<project id>/session-<id>.json` | Electron `userData` directory | Crash-recovery snapshots of unsaved work, one file per app session per project. Deleted when you save everything or quit normally; otherwise kept for at most 30 days. Safe to delete while Vangard Studio is closed. See [State Persistence § Crash-recovery snapshots](../architecture/STATE_PERSISTENCE.md#_6-4-crash-recovery-snapshots). |

The `userData` directory location varies by platform:
- **Windows**: `%APPDATA%/vangard-studio/`
- **macOS**: `~/Library/Application Support/vangard-studio/`
- **Linux**: `~/.config/vangard-studio/`

#### `app-settings.json` Key Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `theme` | string | `system` | One of the 12 theme identifiers (see [Customization](/guide/customization) for the full list). |
| `editorFontFamily` | string | `'Consolas', 'Courier New', monospace` | CSS font-family string for the Monaco editor. |
| `editorFontSize` | number | 14 | Font size in pixels (range 8--72). |
| `renpyPath` | string | `""` | Absolute path to the Ren'Py SDK root directory. |
| `recentProjects` | array of strings | `[]` | Most-recently-opened project paths, newest first. |
| `mouseGestures` | object | (see Settings table) | Canvas pan gesture, middle mouse behavior, zoom direction and sensitivity. |
| `userSnippets` | array | `[]` | Global user-defined snippets (same structure as `snippets.json` entries). |
| `menuTemplates` | array | `[]` | Saved menu constructor templates. |
| `lastProjectDir` | string | (none) | Last directory used in the New Project wizard, pre-filled on next use. |

### 10.4 Expected Ren'Py Project Structure

The IDE expects a standard Ren'Py project layout:

```
my-project/
  game/
    script.rpy          # Main story files (.rpy)
    options.rpy         # Game configuration
    gui.rpy             # GUI configuration
    images/             # Image assets (PNG, JPG, WEBP)
    audio/              # Audio assets (MP3, OGG, WAV, OPUS)
    tl/
      <language>/       # Translation files per language
    project.ide.json    # IDE project metadata (created by Vangard Studio)
  .vangard/              # Project-specific snippets (created by Vangard Studio)
  .renide/               # Screenshots and the Save All journal (created by Vangard Studio)
```

All `.rpy` files remain standard Ren'Py files at all times. Deleting `game/project.ide.json`, `.vangard/`, and `.renide/` removes only IDE metadata. Your project works with or without Vangard Studio.
