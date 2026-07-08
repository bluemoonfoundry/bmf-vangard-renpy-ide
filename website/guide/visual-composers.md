# Visual Composers

Not everything in a visual novel is best expressed as text. Scene layouts and clickable image maps are inherently visual -- and editing them as raw code means constantly running the game to check whether your coordinates and layouts look right. Vangard Studio's two visual composers, Scene Composer and ImageMap Composer, let you design these elements graphically and generate correct Ren'Py code automatically. (An earlier third composer for building UI screens visually has been removed; screens are authored directly in `.rpy` source -- see below.)

## Scene Composer

The **Scene Composer** is where you arrange backgrounds and character sprites into complete scenes. Think of it as a stage: you set the backdrop, position your actors, and adjust the lighting.

![The Scene Composer showing the stage, layer list, and properties panel](/artist-scenes-composer.png)

### Building a Scene

Create a new scene composition from the Scenes sub-tab in Story Elements, or open an existing one. The composer opens as a full editor tab with three areas: the **stage** (the large preview area), the **layer list** (on the side), and the **properties panel** (below the layer list).

Drag an image from the Images tab onto the stage to add it as a layer. The first image you add is typically the background -- it fills the entire stage area. Subsequent images layer on top as sprites.

The stage displays at your project's configured resolution. You can choose from preset resolutions -- 1920x1080, 1280x720, 1024x768, 800x600 -- or enter a custom size. The preview scales to fit your screen while maintaining the correct aspect ratio.

### Per-Sprite Controls

Select any sprite on the stage (or click its entry in the layer list) to reveal its property controls:

- **Position** -- drag the sprite on the stage, or type exact X/Y coordinates
- **Zoom** -- scale the sprite up or down (useful for perspective effects or adjusting character sizes)
- **Flip** -- mirror the sprite horizontally or vertically
- **Rotation** -- rotate by any angle
- **Alpha** -- adjust transparency from fully opaque to invisible
- **Blur** -- apply a Gaussian blur (useful for depth-of-field effects or dream sequences)

### Visual Effects

The **Visual Effects** panel opens up Ren'Py's powerful `matrixcolor` system through an intuitive interface.

**Color grading** sliders let you adjust:

- **Saturation** -- from fully desaturated (greyscale) to oversaturated
- **Brightness** -- darken or lighten the entire sprite
- **Contrast** -- flatten or sharpen tonal differences
- **Invert** -- partially or fully invert the color values

**Color modes** provide two approaches to color transformation:

- **Tint** -- applies a single color overlay to the entire sprite. Set a warm orange tint for sunset scenes or a cold blue for night.
- **Colorize** -- remaps the sprite's luminance range between two colors. Black pixels become one color, white pixels become another, and everything in between blends. This is perfect for silhouette effects or stylized flashbacks.

**Matrix presets** offer one-click access to common cinematic looks: Night, Sunset, Sepia, Greyscale, Noir, Faded, Silhouette, and more. These are organized by category in a popover, so you can quickly audition different moods. Each preset sets the appropriate combination of saturation, brightness, contrast, and color mode values.

The stage preview updates in real time as you adjust effects, using CSS filter approximations of Ren'Py's `matrixcolor` transforms. What you see in the composer is a close match to what the player will see in-game.

### Layer Management

The layer list shows all sprites in stacking order. You can:

- **Reorder layers** by dragging them up or down in the list
- **Lock a layer** to prevent accidental edits (the lock icon toggles per layer)
- **Delete or make background** using the inline action icons that appear when you hover over a layer row

### Output

When your scene looks right, you have two output options:

- **Copy Ren'Py Code** -- generates the complete `scene`/`show` statements with ATL transforms, `matrixcolor` expressions, and shader uniforms. Paste this directly into your script.
- **Export PNG** -- renders the composed scene to a PNG image file, useful for promotional materials or documentation.

Here is an example of generated code for a scene with a sunset background, a tinted character sprite, and a blurred foreground element:

```renpy
scene bg_park_sunset
show eileen happy at center:
    zoom 1.1
    matrixcolor TintMatrix("#ff9944") * BrightnessMatrix(0.10)
show overlay_leaves at top:
    blur 3.0
    alpha 0.7
```

## ImageMap Composer

An **imagemap** in Ren'Py is a screen where the player clicks regions of an image to make choices -- like a point-and-click adventure map or a visual menu. The **ImageMap Composer** lets you draw those clickable regions visually.

![The ImageMap Composer showing hotspots drawn over a ground image](/artist-imagemaps-composer.png)

### Setting Up

Start by choosing a **ground image** -- the base image that the player sees. Optionally, set a **hover overlay** -- an alternate image that reveals hotspot highlights when the mouse moves over them. Both images can be dragged in from the Images tab.

### Drawing Hotspots

Click and drag on the ground image to draw a rectangular hotspot. The rectangle appears with a semi-transparent overlay so you can see where it sits relative to the image. You can resize a hotspot by dragging its edges, move it by dragging its center, or delete it with the `Delete` key.

For each hotspot, configure:

- **Action type** -- `jump` to move to a label, or `call` to invoke a label as a subroutine
- **Target label** -- the destination, with autocomplete suggestions drawn from your project's known labels

You can have as many hotspots as you need. They can overlap (the topmost hotspot in the layer order takes priority), and each one generates its own action.

### Generated Code

The composer generates a complete Ren'Py `imagemap` screen definition. The hotspot coordinates are calculated in pixels relative to the ground image's resolution, so the generated code is ready to use:

```renpy
screen my_map():
    imagemap:
        ground "images/world_map.png"
        hover "images/world_map_hover.png"
        hotspot (120, 340, 200, 180) action Jump("forest_path")
        hotspot (450, 200, 220, 160) action Jump("mountain_village")
        hotspot (700, 400, 180, 150) action Jump("coastal_town")
```

## Screens: View and Edit in Source

There is no visual Screen Layout Composer in the current version of Vangard Studio. An
earlier visual screen-building tool was deliberately removed from the codebase; screens
are now authored and edited directly as Ren'Py `screen` blocks in your `.rpy` files.

The **Screens** tab in the Story Elements sidebar lists every `screen` definition found
across your project. It is read-only: there is no "+ New" or drag-and-drop widget
builder. Click a screen entry's "Go to definition" action to jump straight to its
`screen` block in the code editor, where you write and edit the screen language by hand
(with the usual Monaco autocomplete and syntax highlighting to help).
