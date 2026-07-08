# Settings Reference

### 9.1 Settings Table

| Setting | Section | Description | Default |
|---------|---------|-------------|---------|
| Color Theme | General | UI color scheme applied across the entire application. | `system` (follows OS preference) |
| Editor Font Family | Editor Appearance | Monaco editor font. Accepts any CSS font-family string. | `'Consolas', 'Courier New', monospace` |
| Editor Font Size | Editor Appearance | Font size in pixels, range 8 -- 72. | 14 |
| Canvas Pan Gesture | Canvas and Mouse | How to pan the canvas. | `Shift + Drag` |
| Middle Mouse Also Pans | Canvas and Mouse | Whether middle mouse button pans regardless of gesture setting. | Off |
| Zoom Scroll Direction | Canvas and Mouse | Scroll up = zoom in (normal) or zoom out (inverted). | Normal |
| Zoom Scroll Sensitivity | Canvas and Mouse | Zoom speed multiplier, range 0.5x -- 2.0x. | 1.0x |
| Ren'Py SDK Directory | SDK | Path to the Ren'Py SDK root folder (contains `renpy.exe` or `renpy.sh`). Required for running the game, warping, and generating translations. | (not set) |

Settings are opened with `Ctrl+,` / `Cmd+,` or from the toolbar gear icon.

### 9.2 Themes

| Theme | Style |
|-------|-------|
| `system` | Follows operating system light/dark preference. |
| `light` | Standard light theme with white backgrounds. |
| `dark` | Standard dark theme with dark gray backgrounds. |
| `solarized-light` | Light variant of the Solarized color palette. |
| `solarized-dark` | Dark variant of the Solarized color palette. |
| `colorful` | Vibrant accent colors on a dark background. |
| `colorful-light` | Vibrant accent colors on a light background. |
| `neon-dark` | High-contrast neon accents on deep black. |
| `ocean-dark` | Cool blue tones on a dark background. |
| `candy-light` | Pastel pink and purple accents on a light background. |
| `forest-light` | Earthy green accents on a light background. |
| `synthwave` | Neon magenta and pink accents on a midnight-purple background. |

### 9.3 Auto-Updater

The application checks for new releases on launch. When an update is available, a notification appears with the new version number and an option to download and install. Updates are applied after restarting.

### 9.4 Status Bar

| Position | Content |
|----------|---------|
| Left | Cursor position (`Ln`, `Col`) when a code editor tab is active. |
| Right | Application version (e.g., `v0.7.1`). |
