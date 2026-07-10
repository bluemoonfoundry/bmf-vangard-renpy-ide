# Vangard Studio — Sizzle Reel Script (v1, locked)

**Target runtime:** ~78 seconds (fits comfortably in a 1–2 minute window for both Itch.io and YouTube)
**Pace assumption:** ~145 words/minute (natural trailer-VO speed) — flag this to the VO service so timing lines up
**Tone:** friendly, casual, conversational — not hard-sell
**CTA:** single CTA, shared across both the Itch.io and YouTube cuts
**Music:** not scripted yet — a silent beat is reserved at 1:00–1:10 for a music swell / feature montage once a track is chosen

## Script

| Time | VO (narrator) | On-screen / visual cue |
|---|---|---|
| 0:00–0:03 | *(silent — visual only)* | Fast, slightly chaotic montage: wall of `.rpy` code, tangled folder tree |
| 0:03–0:11 | "So your visual novel's grown a little out of control — hundreds of files, dozens of branches, and no easy way to see it all." | Cut continues, then whip-pan toward a monitor |
| 0:11–0:16 | "That's where Vangard Studio comes in — a visual IDE made just for Ren'Py." | Logo reveal → Project Canvas populating with blocks and arrows |
| 0:16–0:25 | "It turns your whole story into a map you can actually see — every scene, every choice, every branch, all connected." | Pan/zoom across Project Canvas; cut to Flow Canvas branching; cut to Choices Canvas |
| 0:25–0:32 | "Got a broken jump, or a missing character? Vangard catches it before your players ever do." | Diagnostics red glow on a block → Diagnostics panel list |
| 0:32–0:39 | "Write your code in a real editor with Ren'Py-smart autocomplete... or skip the typing altogether." | Monaco editor, IntelliSense popup appearing mid-type |
| 0:39–0:47 | "Drop in a background, add your sprites, and let the Scene Composer write the code for you." | Scene Composer: drag sprite onto stage, code preview updates live |
| 0:47–0:53 | "Need to jump straight to chapter five? Just warp there — no replaying the whole game." | Warp to Label modal, fuzzy search, cut to game window jumping in |
| 0:53–1:00 | "And it's still just Ren'Py underneath. No lock-in, no weird formats — your project stays yours." | Split screen: same file open in Vangard and in a plain text editor |
| 1:00–1:10 | *(silent — music swell / feature montage)* | Quick cuts: Translation Dashboard, Snippets grid, Menu Constructor, Drafting Mode toggle |
| 1:10–1:18 | "Vangard Studio. Come build your story — and watch it come to life." | Logo + "Free on Itch.io" + GitHub link card, lingers to end |

## Notes for the VO service

- Deliver at a warm, conversational pace — not a hard-sell trailer voice.
- Natural pauses are fine between lines; the visual cuts already carry some of the pacing.
- Two silent beats (0:00–0:03 and 1:00–1:10) need no VO at all.
- If the VO service's natural pace runs faster or slower than ~145 wpm, the on-screen timing above will need to shift accordingly — send back actual line durations once recorded so the edit can match cuts to speech.

## Next steps

- [ ] Send this script to the VO service, get timed audio back per line
- [ ] Capture b-roll clips for each visual cue (Playwright video recording against DemoProject is a good fit for most of these — reuses the same app-driving infrastructure as `docs/capture_screenshots.js`)
- [ ] Source/license background music for the two silent beats
- [ ] Assemble final cut (single edit works for both Itch.io and YouTube since CTA is shared)
