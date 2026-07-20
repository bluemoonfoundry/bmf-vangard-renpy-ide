# Vangard Studio — Gentle Intro Script (v1)

Companion to `sizzle-reel-script.md`, not a replacement. The sizzle reel is a
broad feature trailer; this is a narrower, slower "here's what this actually
is" video meant to sit in the v1.0.0 community announcement post for someone
who has never seen the app. It intentionally does NOT try to show every
panel — see the "What this deliberately skips" note at the end.

**Target runtime:** ~1:15-1:30
**Tone:** warm, reassuring, first-person-plural ("we") rather than trailer-voice.
Slower cuts than the sizzle reel — let each screen breathe for a beat before
the next VO line starts.
**CTA:** same single CTA as the sizzle reel (Itch.io / GitHub), but softer —
this video's job is to lower anxiety, not to sell features.
**Reuses:** same VO pipeline (`generate_vo.js` / `generate_vo_local.js`) and
the same manual-capture workflow the sizzle reel settled on (see that
script's "Next steps" — no automated broll/assemble step). Footage can be
freshly recorded, or in a couple of spots reuse the same clips as the sizzle
reel's `canvas-tour` / `diagnostics` / `scene-composer` sections since the
visual beat is nearly identical, just with different VO pacing over it.

**ID column:** IDs are namespaced `gentle-*` so they never collide with the
sizzle reel's IDs if both scripts are ever fed through the same pipeline
tooling.

## Script

### Cold open (intro card, black background — no app footage)

| Time (rough) | ID | VO (narrator) | On-screen / visual cue |
|---|---|---|---|
| 0:00–0:03 | - | *(silent)* | Black background, Vangard Studio logo fades in |
| 0:03–0:10 | gentle-hook | "Vangard Studio has a lot of panels, a lot of buttons, and — if you're new here — that can look like a lot." | Logo holds on black |
| 0:10–0:18 | gentle-reassure | "So before we show you everything it can do, let's show you the one thing you actually need to know to get started." | Logo settles; card begins to dissolve into the app |

### The one idea (core mental model)

| Time (rough) | ID | VO (narrator) | On-screen / visual cue |
|---|---|---|---|
| 0:18–0:30 | gentle-file-to-block | "Every `.rpy` file in your project becomes one block on a canvas. That's it. That's the whole idea — your project, laid out in front of you instead of buried in a file tree." | Split/cut: a folder of `.rpy` files → same files as blocks on Project Canvas |
| 0:30–0:40 | gentle-canvas-settle | "Drag them around, group them however makes sense to you — this is just a map of what you already have." | Project Canvas, a block being dragged, no other UI chrome visible |

### Follow one small thread end-to-end

| Time (rough) | ID | VO (narrator) | On-screen / visual cue |
|---|---|---|---|
| 0:40–0:52 | gentle-write-a-line | "Open a block and you're in a real code editor, with Ren'Py-aware autocomplete — write a line of dialogue, add a choice..." | Monaco editor open on a block, typing a `menu:` choice, autocomplete popup appears |
| 0:52–1:04 | gentle-see-it-branch | "...and that choice shows up right away as a branch you can see, on the Flow canvas — so you always know where every path leads." | Cut to Flow Canvas, the new choice rendered as a branch/connector |
| 1:04–1:12 | gentle-safety-net | "And if something's broken — a jump to a label that doesn't exist, a typo in a variable — Vangard tells you before your players ever find it." | Diagnostics red glow on a block, quick cut to the diagnostics panel entry |

### Close

| Time (rough) | ID | VO (narrator) | On-screen / visual cue |
|---|---|---|---|
| 1:12–1:24 | gentle-close | "That's the whole starting point: your files, as blocks, on a map. Everything else — the composers, the translation tools, the statistics — is there when you're ready for it, not before." | Quick, silent 2-3 shot glimpse of other panels (scene composer, translations) as a soft teaser, no lingering |
| 1:24–1:30 | gentle-cta | "Vangard Studio 1.0 is out now, free on Itch.io. Come build your story." | Outro card, same branding as sizzle reel |

## Notes for the VO service

- Warmer and slightly slower delivery than the sizzle reel — this is a
  reassurance piece, not a trailer.
- Leave more silence between lines than the sizzle reel script; let visuals
  sit for a beat before the next line starts.

## What this deliberately skips

Per the original discussion: diagnostics panel gets one line and one glimpse
only (not a full walkthrough), sticky notes, image maps, screens, snippets,
menu constructor, translations, statistics/search, and audio editor are not
demoed at all — only teased in the closing montage shot. Each of those is a
candidate for its own entry in the per-feature deep-dive script set (see
beads `bmf-vangard-renpy-ide-whfs`).

## Next steps

- [ ] Confirm the per-feature script list (tracked separately) so the
      "teaser" shots in the close section point at footage that will
      eventually get its own full script, rather than orphaned clips.
- [ ] Generate VO via the existing local/elevenlabs pipeline, ID-prefixed
      `gentle-*`.
- [ ] Screen-record fresh footage for `gentle-file-to-block` and
      `gentle-write-a-line` (no direct sizzle-reel equivalent); the other
      beats can likely reuse sizzle-reel footage/timing as a starting point.
- [ ] Manual edit pass, same workflow as the sizzle reel (no automated
      assemble step).
