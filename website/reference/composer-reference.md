# Composer Reference

## 7.1 Scene Composer

Open from the `Scenes` sub-tab under Composers in the Story Elements sidebar. Each composition is a named arrangement of a background image and one or more sprite layers.

### Stage Resolution Presets

| Preset | Dimensions | Aspect Ratio |
|--------|-----------|--------------|
| Full HD | 1920 x 1080 | 16:9 |
| HD | 1280 x 720 | 16:9 |
| XGA | 1024 x 768 | 4:3 |
| SVGA | 800 x 600 | 4:3 |
| Custom | User-defined | Any |

The default resolution is 1920 x 1080. Change it via the resolution dropdown at the top of the composer. Custom values accept any positive integer pair.

### Sprite Controls

| Control | Range / Type | Default | Description |
|---------|-------------|---------|-------------|
| X Position | 0.0 -- 1.0 (float) | 0.5 | Horizontal alignment. 0 = left edge, 1 = right edge. |
| Y Position | 0.0 -- 1.0 (float) | 0.5 | Vertical alignment. 0 = top edge, 1 = bottom edge. |
| Zoom | 0.1+ (float) | 1.0 | Scale factor. Values below 1 shrink; above 1 enlarge. |
| Flip Horizontal | Toggle (boolean) | Off | Mirrors the sprite left-to-right. |
| Flip Vertical | Toggle (boolean) | Off | Mirrors the sprite top-to-bottom. |
| Rotation | Integer (degrees) | 0 | Clockwise rotation angle. |
| Opacity | 0.0 -- 1.0 (float, step 0.05) | 1.0 | Alpha transparency. 0 = invisible, 1 = fully opaque. |
| Blur | 0 -- 50 (integer, pixels) | 0 | Gaussian blur radius in CSS pixels. |
| Locked | Toggle (boolean) | Off | Prevents accidental edits to the layer. |
| Visible | Toggle (boolean) | On | Hides the sprite from preview without removing it. |

### Visual Effects

Visual effects are applied per-sprite via the `Color Effects` and `Shaders` control groups in the properties panel.

**Color Grading Controls**

| Control | Range | Step | Default | Description |
|---------|-------|------|---------|-------------|
| Saturation | 0.0 -- 2.0 | 0.05 | 1.0 | Color intensity. 0 = greyscale, 2 = oversaturated. Visible only when a color mode is active. |
| Brightness | -1.0 -- 1.0 | 0.05 | 0.0 | Additive brightness shift. Negative values darken; positive values lighten. |
| Contrast | 0.1 -- 3.0 | 0.05 | 1.0 | Contrast multiplier. Values below 1 flatten; above 1 sharpen tonal range. |
| Invert | 0.0 -- 1.0 | 0.1 | 0.0 | Color inversion amount. 1 = fully inverted. |

**Color Modes**

| Mode | Description |
|------|-------------|
| None | No color overlay. Grading controls (brightness, contrast, invert) still apply. |
| Tint | Applies a single color overlay to the entire sprite. Set the tint color with the color swatch. Generates `TintMatrix` in Ren'Py output. |
| Colorize | Remaps the sprite's tonal range from a shadow color (black) to a highlight color (white). Set both via color swatches. Generates `ColorizeMatrix` in Ren'Py output. |

**Matrix Presets**

The `Presets` popover provides one-click application of common visual effect combinations. Presets are organized into five categories:

| Category | Presets |
|----------|---------|
| Environmental and Time of Day | Night, Sunset, Evening / Dusk, Early Morning, Midday / Harsh Sun |
| Flashbacks and Memory | Classic Sepia, Greyscale, Noir, Faded Memory |
| Character State | Silhouette, Dimmed (Inactive), Ghost / Spirit, Blushing, Cold / Sick |
| Horror and Special Effects | Invert, Blood Red, Toxic / Poison, Night Vision |
| UI and Technical | Disabled, Highlighted / Glow |

Selecting a preset sets the color mode, tint/colorize colors, saturation, brightness, contrast, and invert values in one operation. You can fine-tune any value after applying a preset.

**Shader Support**

| Shader | Uniforms | IDE Preview |
|--------|----------|-------------|
| `renpy.blur` | `u_renpy_blur_log2` (0 -- 5) | Yes (CSS blur approximation) |
| `renpy.dissolve` | `u_renpy_dissolve` (0 -- 1) | No (code-only) |
| `renpy.imagedissolve` | `u_renpy_dissolve_offset` (0 -- 1), `u_renpy_dissolve_multiplier` (0 -- 2) | No (code-only) |
| `renpy.mask` | `u_renpy_mask_multiplier` (0 -- 2), `u_renpy_mask_offset` (-1 -- 1) | No (code-only) |
| `renpy.pixelize` | `u_amount` (0.001 -- 0.1) | Yes (pixelated downscale) |
| Custom | User-defined name and uniforms | No |

Shaders without IDE preview display a "No IDE preview" badge. The generated Ren'Py code includes the correct `shader` and uniform lines regardless of preview support.

### Layer Features

- **Drag reorder**: drag layer rows in the layers panel to change z-order.
- **Lock layer**: click the lock icon to prevent position/property changes.
- **Inline actions**: hover over a layer row to reveal `Delete` and `Make BG` (promote to background) buttons.
- **Background layer**: exactly one sprite can be the background. Use `Make BG` or drag an image onto the background drop zone.

### Generated Ren'Py Code

The `Copy Ren'Py Code` button produces `scene` and `show` statements with full ATL property blocks. A sprite with visual effects produces code like:

```renpy
show eileen happy:
    xpos 0.5
    ypos 0.8
    zoom 1.2
    rotate 0
    alpha 0.9
    matrixcolor TintMatrix("#ff8844") * SaturationMatrix(1.20) * BrightnessMatrix(0.10)
    shader "renpy.blur"
    u_renpy_blur_log2 2.0
```

The `matrixcolor` line chains matrix functions with the `*` operator. Only non-default values are emitted. Shader lines include the shader name and all uniform key-value pairs.

### Output Options

| Action | Description |
|--------|-------------|
| Copy Ren'Py Code | Copies all `scene`/`show` statements with ATL properties to clipboard. |
| Export PNG | Renders the current composition to a PNG image via the system save dialog. The export uses the composition's configured resolution. |

---

## 7.2 ImageMap Composer

Open from the `ImageMaps` sub-tab under Composers.

### Workflow

1. Drag an image from the Assets panel onto the `Ground Image` drop zone (or click to browse).
2. Optionally set a `Hover Image` that displays when the mouse hovers over any hotspot.
3. Draw rectangular hotspot regions on the ground image by clicking and dragging.
4. Configure each hotspot's action type and target label.

### Hotspot Properties

| Property | Type | Options | Description |
|----------|------|---------|-------------|
| Action Type | Select | `jump`, `call` | What happens when the player clicks the hotspot. |
| Target Label | Text | Any label name | The label to jump to or call when clicked. |
| Position (x, y) | Integer (pixels) | -- | Top-left corner of the hotspot rectangle, relative to the ground image. |
| Size (width, height) | Integer (pixels) | -- | Dimensions of the hotspot rectangle. |

Hotspots are drawn directly on the ground image preview. Click and drag to create a new rectangle; click an existing rectangle to select and resize it. Selected hotspots display grab handles on all four corners and edges.

### Output

Generates a Ren'Py `screen` block containing `imagebutton` or `imagemap` statements with ground/hover images and hotspot coordinates. Use `Copy to Clipboard` or `Insert at Cursor` to place the code in your project.

---

## 7.3 Screens (No Visual Composer)

There is no Screen Layout Composer in the current version of Vangard Studio. The prior
`ScreenLayoutComposer.tsx`/`ScreenLayoutComposerV2.tsx` components and their "+ New"
creation flow, widget palette, and per-widget property editor described in earlier
documentation have been removed from the codebase; there is no in-app replacement UI for
building screens by dragging widgets.

Screens are authored and edited directly as Ren'Py `screen` blocks in `.rpy` source
files, using the Monaco code editor's Ren'Py-aware autocomplete and syntax highlighting.

The **Screens** tab (in the Story Elements sidebar) lists every `screen` definition
found across the project and lets you jump to its definition in the editor; it does not
support creating or editing screens visually.
