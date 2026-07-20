# Vangard Studio — Feature Script: Diagnostics

Part of the per-feature deep-dive set (see `bmf-vangard-renpy-ide-whfs`). Both
`sizzle-reel-script.md` and `gentle-intro-script.md` show a quick glimpse of
this feature (broken jump → red glow → click through) — this script is the
full version of that same beat, with more failure types and the actual
click-to-fix loop shown start to finish.

**Target runtime:** ~1:20-1:40
**Tone:** practical demo-style, same as the other feature scripts.
IDs namespaced `dx-*`.

## Script

| Time (rough) | ID | VO (narrator) | On-screen / visual cue |
|---|---|---|---|
| 0:00–0:12 | dx-hook | "A jump to a label that got renamed, or deleted, doesn't error out until a player actually reaches it — sometimes hours into a playtest." | Illustrative: Ren'Py console error from a missing label, mid-playtest |
| 0:12–0:26 | dx-glow | "Vangard checks for that continuously — a block with a problem gets flagged right on the canvas, before you ever hit run." | Canvas block showing a red diagnostic glow/badge |
| 0:26–0:40 | dx-panel | "Open the Diagnostics panel and every issue in the project is listed — broken jumps, missing character or image references, unused labels." | Diagnostics panel list, a few different issue types visible |
| 0:40–0:55 | dx-clickthrough | "Click one, and it jumps straight to the exact line — no hunting through the file to find what it's talking about." | Clicking a diagnostic entry, editor scrolls/highlights the exact line |
| 0:55–1:10 | dx-fix | "Fix it, and the flag clears itself — no separate re-scan step to remember." | Editing the broken line; diagnostic badge disappears from the canvas |
| 1:10–1:25 | dx-ignore | "Some warnings aren't worth acting on right now — those can be dismissed individually so they stop cluttering the list without silencing everything." | Dismissing/ignoring a specific diagnostic entry |
| 1:25–1:40 | dx-close | "Diagnostics — catching the broken stuff while it's still cheap to fix." | Diagnostics panel, clean/mostly-clear state |

## Notes for the VO service

- This is the closest thing the app has to a safety-net pitch — fine to lean
  slightly more confident/reassuring here than in other feature scripts.

## Capture notes

- Deliberately break 2-3 different things in a demo project ahead of time
  (a renamed label still referenced elsewhere, a typo'd character id, an
  image reference to a file that was deleted) so the panel shows variety,
  not just one repeated issue type.
- `dx-ignore` needs the ignored-diagnostics list state visible somewhere so
  it doesn't read as the issue silently vanishing/being lost.
