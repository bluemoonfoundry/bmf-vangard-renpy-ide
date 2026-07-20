# Vangard Studio — Feature Script: Image Maps Composer

Part of the per-feature deep-dive set (see `bmf-vangard-renpy-ide-whfs`).
IDs namespaced `im-*`.

**Target runtime:** ~1:20-1:40
**Tone:** practical demo-style, same as the other feature scripts.
**Audience:** someone building an interactive menu/map screen (chapter
select, inventory, dialogue-tree hub) who's hit Ren'Py's `imagemap` statement
and its manual hotspot coordinates.

## Script

| Time (rough) | ID | VO (narrator) | On-screen / visual cue |
|---|---|---|---|
| 0:00–0:12 | im-hook | "An `imagemap` screen needs pixel-perfect hotspot coordinates for every clickable area — get one number wrong and the click lands on nothing." | Hand-written `imagemap` block with `hotspot` coordinate lines highlighted |
| 0:12–0:24 | im-open | "The Image Maps composer lets you draw the hotspot instead of calculating it." | Opening Image Maps composer, base image loaded on canvas |
| 0:24–0:42 | im-draw | "Click and drag directly on the image to define a clickable region — the coordinates are generated from where you actually drew, not the other way around." | Drawing a rectangular/polygon hotspot over a specific area of the image |
| 0:42–0:58 | im-assign | "Assign it an action — jump to a label, set a variable — right there on the hotspot, no separate lookup table to keep in sync." | Assigning a jump/action to the drawn hotspot via a properties panel |
| 0:58–1:15 | im-preview | "Preview the map live to check hover and click states before you ever run the game." | Hover/click state preview directly in the composer |
| 1:15–1:30 | im-code | "And underneath, it's still plain `imagemap` Ren'Py code — open in a text editor and it reads like you wrote it by hand, just without the manual math." | Cut to generated `.rpy` code for the imagemap |
| 1:30–1:40 | im-close | "Image Maps — draw the hotspot, skip the coordinate math." | Final composed image map, held |

## Notes for the VO service

- Keep the "hand-written coordinates" pain point in `im-hook` vivid but
  brief — one bad-coordinate example is enough, don't dwell.

## Capture notes

- Use an image with clearly distinct regions (a map, a UI mockup with
  buttons) so hotspot boundaries are visually obvious on camera.
- Capture at least one polygon (non-rectangular) hotspot if the tool
  supports it — reinforces that this isn't just four-corner rectangles.
