# Vangard Studio — Sizzle Reel Script (v2, locked)

Supersedes the original v1 script (~78s, single-table format) -- see git
history for that version. v2 extends runtime to cover more features, moves
the hook/product-intro VO off live app footage and onto a black intro card,
and adds "For Writers / For Artists / For Developers" divider cards between
feature groups.

**Target runtime:** ~3:00-3:30
**Pace assumption:** v1's actual ElevenLabs VO ran ~35% faster than the
145wpm estimate (65s of scripted windows produced ~48s of real audio) — the
times below are rough pacing guides, not hard targets. `generate_vo.js`
reports real per-line duration and the assembly script sizes each segment to
that, so drift here doesn't break anything downstream.
**Tone:** friendly, casual, conversational — not hard-sell
**CTA:** single CTA, shared across both the Itch.io and YouTube cuts
**Structural change from v1:** the hook and product-intro lines (first ~18s)
now play over a black intro card, not live app footage — clicking/window
chrome under "so your visual novel's grown out of control" read as jarring
rather than relatable. Real app footage doesn't start until the narration is
actually describing something on screen. Three new divider cards ("For
Writers" / "For Artists" / "For Developers") group the added features and
double as transition beats between sections.
**Music:** not scripted yet — silent beats reserved at 0:00–0:03 and in the
feature montage near the end, once a track is chosen.

## Script

### Cold open (intro card, black background — no app footage)

| Time (rough) | VO (narrator) | On-screen / visual cue |
|---|---|---|
| 0:00–0:03 | *(silent)* | Black background, Vangard Studio logo fades in |
| 0:03–0:12 | "So your visual novel's grown a little out of control — hundreds of labels, dozens of branches, and no easy way to see it all." | Logo holds on black; no app UI yet |
| 0:12–0:18 | "That's where Vangard Studio comes in — a visual development app made just for Ren'Py." | Logo settles/animates subtly; card dissolves into the running app on the next line |

### Core tour (app footage begins here)

| Time (rough) | VO (narrator) | On-screen / visual cue |
|---|---|---|
| 0:18–0:29 | "It turns your whole story into a map you can actually see — every scene, every choice, every branch, all connected." | Project Canvas (settled, no navigation clicks visible) → Flow Canvas → Choices Canvas |
| 0:29–0:41 | "Got a broken jump, or a missing character reference? Vangard flags it right on the canvas, before your players ever hit it — click straight through to the exact line that needs fixing." | Diagnostics red glow on a block → Diagnostics panel list → click a diagnostic to jump to the line |
| 0:41–0:49 | "Write your code in a real editor with Ren'Py-smart autocomplete... or skip the typing altogether." | Monaco editor, IntelliSense popup appearing mid-type |
| 0:49–1:04 | "Swap in a new background, drag your sprites into place, position them exactly where you want — the Scene Composer writes the show and scene code for you, live, as you work." | Scene Composer: swap background, drag sprite onto stage, reposition, code preview updates live |
| 1:04–1:11 | "Need to jump straight to chapter five? Just warp there — no replaying the whole game." | Warp to Label modal, fuzzy search, game window jumps in |
| 1:11–1:19 | "And it's still just Ren'Py underneath. No lock-in, no weird formats — your project stays yours." | Split screen: same file open in Vangard and in a plain text editor |

### For Writers (divider card + feature)

| Time (rough) | VO (narrator) | On-screen / visual cue |
|---|---|---|
| 1:19–1:22 | *(silent)* | "For Writers" divider card, black background |
| 1:22–1:34 | "Every character and every variable your story tracks, organized in one place and globally searchable/changeable so you're never digging through files to remember what you named that flag." | Character Manager (edit a character) → cut to Variables tab |

### For Artists (divider card + feature)

| Time (rough) | VO (narrator) | On-screen / visual cue |
|---|---|---|
| 1:34–1:37 | *(silent)* | "For Artists" divider card, black background |
| 1:37–1:51 | "Build interactive image maps without writing a single hotspot by hand, and preview your soundtrack and sound effects right inside the project — no alt-tabbing to another player." | Image Maps composer (hotspot drawn) → cut to Audio Editor View, equalizer animating |

### For Developers (divider card + feature)

| Time (rough) | VO (narrator) | On-screen / visual cue |
|---|---|---|
| 1:51–1:54 | *(silent)* | "For Developers" divider card, black background |
| 1:54–2:09 | "Get a full breakdown of your script — word counts, branch counts, playtime estimates — and find anything in the whole project in seconds." | Script Statistics panel → cut to global Search panel, a query typed in |

### Feature montage + close

| Time (rough) | VO (narrator) | On-screen / visual cue |
|---|---|---|
| 2:09–2:24 | *(silent — music swell / feature montage)* | Quick cuts: Translation Dashboard, Snippets grid, Menu Constructor, Drafting Mode toggle |
| 2:24–2:32 | "Vangard Studio. Come build your story — and watch it come to life." | Outro card, black background: logo + "Free on Itch.io" + GitHub link, lingers to end |

## Notes for the VO service

- Deliver at a warm, conversational pace — not a hard-sell trailer voice.
- Natural pauses are fine between lines; the visual cuts already carry some of the pacing.
- Silent beats (cold-open logo hold, each divider card, and the closing feature montage) need no VO.
- Timing above is a rough pacing guide only -- actual pacing will drift, and that's fine; `generate_vo.js` + `assemble_reel.js` size the cut to real line durations automatically.

## Next steps

- [ ] Regenerate VO via `generate_vo.js` for all new/changed lines
- [ ] Add capture entries for the new segments to `capture_broll.js` (Character Manager, Variables, Image Maps, Audio Editor, Script Statistics, Search) and expand Diagnostics/Scene Composer/Statistics dwell time
- [ ] Redesign `capture_broll.js` to record a `trimStart` per clip (time spent on setup/navigation before the "settled" feature state) so the assembler can cut away the app-reopening/clicking-around footage instead of showing it on screen
- [ ] Redesign `assemble_reel.js`: crossfade (`xfade`/`acrossfade`) transitions between segments instead of hard cuts, plus render the new intro/outro/divider cards
- [ ] Source/license background music for the silent beats
- [ ] Assemble updated draft cut, review pacing
