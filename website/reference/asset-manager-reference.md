# Asset Manager Reference

### 6.1 Image Assets

| Property | Details |
|----------|---------|
| Supported formats | `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.bmp`, `.svg` |
| Display | Folder tree mirroring the project `images/` directory structure |
| Thumbnails | Auto-generated for all supported image formats |
| Scan external directories | Add image folders outside the project without copying files |

**Right-click actions:**

| Action | Output |
|--------|--------|
| Copy `scene` statement | `scene <image_tag>` (for backgrounds) |
| Copy `show` statement | `show <image_tag>` (for sprites/overlays) |

**Drag targets:**

| Target | Effect |
|--------|--------|
| Scene Composer stage | Adds image as a new layer |
| Screen Layout Composer stage | Adds as an `image` widget |
| ImageMap Composer | Sets as ground or hover image |

**Tag/metadata editing:** Right-click an image to edit its display tag or add metadata notes. Tags are stored in `.renide/ide-settings.json`.

**Image viewer:** Double-clicking an image in the Assets panel opens it in a dedicated Image Editor View tab. The viewer displays the image at full resolution with zoom controls and file metadata (dimensions, file size, format) in a sidebar.

### 6.2 Audio Assets

| Property | Details |
|----------|---------|
| Supported formats | `.ogg`, `.mp3`, `.wav`, `.opus`, `.flac` |
| Display | Folder tree mirroring the project `audio/` directory structure |
| Scan external directories | Add audio folders outside the project without copying files |

**Right-click actions:**

| Action | Output |
|--------|--------|
| Copy `play music` | `play music "<path>"` |
| Copy `play sound` | `play sound "<path>"` |
| Copy `queue audio` | `queue music "<path>"` |

**Audio player features:**

| Feature | Description |
|---------|-------------|
| Web Audio API | Custom player replaces native browser audio controls |
| Play / Pause | Glowing button with visual feedback |
| Seek bar | Custom styled progress bar with click-to-seek |
| Volume control | Slider with visual feedback |
| 64-bar equalizer | Real-time frequency visualization with cyan-to-blue-to-violet gradient, peak dots, and scanline overlay |
| Layout | Flex-row: player controls on left, metadata sidebar on right |

### 6.3 Drafting Mode

Drafting Mode generates temporary placeholders so the game can run even when image and audio assets are missing.

| Property | Details |
|----------|---------|
| Toggle location | Toolbar (Drafting Mode button) |
| Image placeholders | Gray rectangles with the image tag name displayed as text |
| Audio placeholders | Silent audio tracks (no audible output) |
| Persistence | Session only -- no files are written to disk, placeholders exist only in memory |
| Effect on game | Missing `show`/`scene` images render as labeled gray boxes; missing `play music`/`play sound` statements execute without error |
| Disable | Toggle off in toolbar or close the application |

**When to use Drafting Mode:**
- Early development when art and sound assets have not been created yet
- Testing story flow and branching logic without asset dependencies
- Running the game on a machine that does not have all assets available

### 6.4 Asset Scanning Behavior

| Behavior | Details |
|----------|---------|
| Initial scan | Runs automatically when a project is opened |
| Scan directories | Project `images/` and `audio/` folders, plus any externally linked directories |
| External directory linking | Add folders outside the project tree via the Scan External Directory option. Files are referenced by path, not copied. |
| Refresh | Manual refresh via `File > Refresh Project` or Project Explorer context menu. Reconciles all assets with current disk state. |
| File change detection | External changes to asset files are detected by the file watcher (400ms debounce). New files appear automatically; deleted files are removed from the tree. |
| Metadata storage | Image/audio metadata (tags, notes) stored in `.renide/ide-settings.json`. Asset files themselves are never modified by the IDE. |
