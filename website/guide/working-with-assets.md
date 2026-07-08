# Working with Assets

Visual novels run on images and audio. Vangard Studio provides dedicated management tools for both, accessible through the Assets category in the Story Elements sidebar.

## Image Assets

The **Images** tab shows all images that have been registered with your project. Images display as a folder tree with thumbnails, making it easy to browse backgrounds, character sprites, and UI elements visually.

![The Images tab showing a folder tree of registered project images with thumbnails](/artist-images-tab.png)

### Scanning Images

You do not need to copy image files into a specific folder structure for Vangard Studio to find them. The scan feature lets you point at any directory on your system -- your art assets folder, a shared Dropbox directory, a downloaded asset pack -- and Vangard Studio will index the images it finds. The files stay where they are; the IDE only records references and generates thumbnails.

This is particularly useful during development when your artist is delivering files to a shared folder and you want to reference them in your script before the final project structure is decided.

### Working with Images

Right-click any image to access its context menu:

- **Add `scene` statement** -- copies `scene bg_park` (or whatever the image's Ren'Py tag is) to your clipboard, ready to paste into your script
- **Add `show` statement** -- copies `show eileen happy` for character sprites
- **Drag to composer** -- drag an image directly from the sidebar into the Scene Composer or Screen Layout Composer (covered in the next chapter)

Double-click an image to open its **Image Editor View**, where you can manage its Ren'Py tag (the name used in `show`/`scene` statements), assign metadata tags for organization, and see the image at full resolution.

## Audio Assets

The **Audio** tab follows the same pattern as images: a browsable folder tree, a scan feature for indexing external directories, and metadata management.

![The Audio tab showing the folder tree and audio player with equalizer visualization](/artist-audio-tab.png)

What sets the audio tab apart is its custom **audio player**. When you select an audio file, the player appears with:

- A glowing play/pause button
- A custom seek bar for scrubbing through the track
- A **64-bar equalizer visualization** -- a real-time frequency display rendered using the Web Audio API, with bars colored in a cyan-to-blue-to-violet gradient, complete with peak dots that hold briefly at each bar's maximum level and a subtle scanline overlay
- A volume slider with visual feedback

This is not just cosmetic. Being able to audition tracks directly in the IDE, with proper visualization, means you can evaluate background music and sound effects without switching to an external audio application. You can hear whether a track loops cleanly, whether a sound effect has the right energy, and whether the volume levels feel right relative to each other.

Right-click an audio file for quick-copy options:

- **`play audio`** -- copies `play audio "audio/theme.ogg"` for immediate playback
- **`queue audio`** -- copies `queue audio "audio/next_track.ogg"` for playlist-style sequencing

## How Assets Connect to Everything Else

Assets are not isolated in their sidebar tab. They integrate with the rest of the IDE:

- **Scene Composer**: drag images from the Images tab directly onto the Scene Composer stage to add them as layers
- **Screen Layout Composer**: drag images into screen layouts for UI elements
- **Diagnostics**: if your script references `scene bg_park` but no image with that tag exists, the diagnostics system flags it as a "missing image" warning
- **IntelliSense**: image and audio names appear in autocomplete suggestions when you type `show`, `scene`, `play music`, or `play sound`
