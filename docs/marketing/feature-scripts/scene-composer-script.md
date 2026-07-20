# Vangard Studio — Feature Script: Scene Composer

Part of the per-feature deep-dive set (see `bmf-vangard-renpy-ide-whfs`).
Companion to `sizzle-reel-script.md` (which gives this feature ~15s) and
`gentle-intro-script.md` (which doesn't show it at all) — this is the full
walkthrough for someone who's ready to actually use the feature.

**Target runtime:** ~1:45-2:15
**Tone:** practical, demo-style — "here's how you'd actually do this," not
trailer voice. Slower pace than either other script; narration can trail
slightly behind the action instead of leading it, like a real screencast.
**Audience:** someone who already knows what Vangard Studio is (watched the
gentle intro or sizzle reel) and now wants to know if this specific feature
solves their problem.
**Reuses:** same VO pipeline and manual-capture workflow as the other
scripts. IDs namespaced `sc-*`.

## Script

| Time (rough) | ID | VO (narrator) | On-screen / visual cue |
|---|---|---|---|
| 0:00–0:10 | sc-hook | "Writing `show` and `scene` statements by hand means guessing at coordinates and re-running the game just to see if a sprite's in the right spot. The Scene Composer skips that guesswork entirely." | Cut from a hand-written `show eileen happy at truecenter` line to the Scene Composer opening on that same block |
| 0:10–0:22 | sc-open | "Open any label from the canvas, and if it has a scene in it, you can jump straight into the composer — no separate mode to hunt for." | Right-click / toolbar action opening Scene Composer from a canvas block |
| 0:22–0:38 | sc-background | "Start with a background — pick one from your project's images, and the stage updates immediately." | Background picker, selecting an image, stage view updates live |
| 0:38–0:55 | sc-sprite-drag | "Drag a character sprite onto the stage and drop it wherever you want — Vangard figures out the position code for you." | Dragging a sprite from the palette onto the stage, snapping into place |
| 0:55–1:15 | sc-reposition | "Need it further left, or larger? Just grab it again — every change updates a live code preview underneath, so you can see exactly what Ren'Py code you're about to write." | Repositioning/resizing a sprite; code preview panel visibly updating each drag |
| 1:15–1:35 | sc-multiple | "Layer in a second character, adjust who's in front, and the composer keeps the z-order and both positions straight — the kind of thing that's fiddly to get right by hand." | Adding a second sprite, adjusting layer order |
| 1:35–1:50 | sc-apply | "When it looks right, apply it — the generated code drops straight into your label, in place, no copy-pasting." | Clicking Apply/Confirm; cut to the Monaco editor showing the inserted `show`/`scene` lines |
| 1:50–2:05 | sc-why | "It's not a separate art tool bolted on — it's reading and writing the same Ren'Py code your project already has, so nothing about your file changes except the lines you actually meant to add." | Split view: composer stage next to the resulting plain-text `.rpy` lines |
| 2:05–2:15 | sc-close | "That's the Scene Composer — for when you'd rather see the scene than imagine the coordinates." | Stage view held on final composed scene |

## Notes for the VO service

- Pace should feel like narrating a live demo, not reading ad copy — slightly
  more filler-word-tolerant phrasing is fine if the TTS engine supports it.
- No hard sell language ("powerful", "seamless") — keep it functional.

## Capture notes

- Use a project with at least two named characters and 2-3 background
  images already imported, so the palette isn't empty on camera.
- Capture the code-preview panel in the same take as the drag — this is the
  feature's core "why," don't cut away from it.
- If re-using any sizzle-reel Scene Composer footage: that clip only covers
  `sc-background` through `sc-sprite-drag` roughly — the multi-character
  layering and Apply/code-diff beats need fresh capture.
