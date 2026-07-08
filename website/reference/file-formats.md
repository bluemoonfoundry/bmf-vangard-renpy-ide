# File Formats

### 10.1 Project Files (`.renide/` directory)

These files are created inside your Ren'Py project root under `.renide/`. Ren'Py ignores this directory entirely. All files use JSON format.

| File | Purpose | Key Contents |
|------|---------|-------------|
| `project.json` | Canvas state and task tracking. | Block positions and sizes, block groups, sticky notes (three arrays: project/flow/choices canvas), diagnostics tasks, ignored diagnostic rules, character profiles, canvas layout modes and fingerprints, open tabs and active tab, split layout state. |
| `ide-settings.json` | Asset and composition metadata. | Scanned image/audio directory paths, scene compositions, imagemap compositions, screen layout compositions, scene display names, story elements tab state. |
| `snippets.json` | Project-specific code snippets. | Array of snippet objects with `id`, `title`, `prefix`, `description`, `code`, and optional `monacoBody`. |

#### `project.json` Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `draftingMode` | boolean | Whether drafting mode is currently enabled. |
| `storyCanvasLayoutMode` | string | Layout algorithm for the Project Canvas (`flow-lr`, `flow-td`, `connected-components`, `clustered-flow`). |
| `storyBlockLayouts` | object | Map of block ID to saved position (`x`, `y`) and dimensions (`width`, `height`). |
| `openTabs` | array | Currently open editor tabs with type, ID, and metadata. |
| `activeTabId` | string | ID of the tab that is currently visible. |
| `splitLayout` | string | Editor split mode: `none`, `right`, or `bottom`. |
| `stickyNotes` | array | Sticky notes on the Project Canvas (each has `id`, `x`, `y`, `width`, `height`, `color`, `text`). |
| `routeStickyNotes` | array | Sticky notes on the Flow Canvas. Same structure as above. |
| `choiceStickyNotes` | array | Sticky notes on the Choices Canvas. Same structure as above. |
| `diagnosticsTasks` | array | Tracked tasks with `id`, `title`, `description`, `status` (`open`/`completed`), optional `stickyNoteId`, and `createdAt` timestamp. |
| `ignoredDiagnostics` | array | Suppression rules for diagnostics. Each rule matches by `category`, `message`, `filePath`, or a combination. |
| `characterProfiles` | object | Map of character tag to profile notes (free-text). |

#### `ide-settings.json` Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `scannedImagePaths` | array of strings | Directories scanned for image assets. |
| `scannedAudioPaths` | array of strings | Directories scanned for audio assets. |
| `sceneCompositions` | object | Map of composition ID to `SceneComposition` (background image, sprite array, resolution). |
| `sceneNames` | object | Map of composition ID to a human-readable display name. |
| `imagemapCompositions` | object | Map of composition ID to `ImageMapComposition` (ground image, hover image, hotspot array). |
| `screenLayoutCompositions` | object | Map of composition ID to `ScreenLayoutComposition` (screen name, modal, zorder, widget tree). |

#### `snippets.json` Structure

Each entry in the array has the following fields:

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique identifier (UUID recommended). |
| `title` | Yes | Display name shown in the Snippets panel. |
| `prefix` | Yes | Trigger string for Monaco autocomplete. Typing this prefix in the editor shows the snippet as a suggestion. |
| `description` | Yes | Short description displayed alongside the suggestion. |
| `code` | Yes | The snippet body with `$1`, `$2`, etc. for tab-stop placeholders. |
| `monacoBody` | No | Alternative body format as a string array (one element per line). If absent, `code` is used. |

### 10.2 Temporary Files

| File | Purpose | Lifecycle |
|------|---------|-----------|
| `_ide_after_warp.rpy` | Warp variable overrides. Contains a `label after_warp:` block that sets variable values before warped execution begins. | Created when warping to a label with variable overrides. Automatically deleted when the game process stops. |

### 10.3 App-Level Files

| File | Location | Purpose |
|------|----------|---------|
| `app-settings.json` | Electron `userData` directory | Theme, editor font, sidebar dimensions, Ren'Py SDK path, recent project list, mouse gesture preferences, global user snippets, menu templates. |

The `userData` directory location varies by platform:
- **Windows**: `%APPDATA%/ren-ide/`
- **macOS**: `~/Library/Application Support/ren-ide/`
- **Linux**: `~/.config/ren-ide/`

#### `app-settings.json` Key Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `theme` | string | `system` | One of the 11 theme identifiers. |
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
    audio/              # Audio assets (MP3, OGG, WAV)
    tl/
      <language>/       # Translation files per language
  .renide/              # IDE metadata (created by Vangard Studio)
```

All `.rpy` files remain standard Ren'Py files at all times. Deleting the `.renide/` folder removes only the IDE metadata. Your project works with or without Vangard Studio.
