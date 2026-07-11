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

**ID column:** `build_reel.js --vo-match=content` matches VO lines to their
slot in `assemble_reel.js`'s timeline by this ID instead of table position --
use it if you're inserting/removing/reordering rows and want everything
downstream to keep pointing at the right line. Rewording a line in place
doesn't need an ID change either way. Rows with no ID (silent beats) use `-`.
Semantic IDs here must match the ones `assemble_reel.js`'s `buildTimeline()`
references, or content mode will fail loudly (add a new feature's clip and ID
together — see docs/capture_broll.js's CLIPS array and this file's "Next
steps").

## Script

### Cold open (intro card, black background — no app footage)

| Time (rough) | ID | VO (narrator) | On-screen / visual cue |
|---|---|---|---|
| 0:00–0:03 | - | *(silent)* | Black background, Vangard Studio logo fades in |
| 0:03–0:12 | hook | "So your visual novel's grown a little out of control — hundreds of labels, dozens of branches, and no easy way to see it all." | Logo holds on black; no app UI yet |
| 0:12–0:18 | product-intro | "That's where Vangard Studio comes in — a visual development app made just for Ren'Py." | Logo settles/animates subtly; card dissolves into the running app on the next line |

### Core tour (app footage begins here)

| Time (rough) | ID | VO (narrator) | On-screen / visual cue |
|---|---|---|---|
| 0:18–0:29 | canvas-tour | "It turns your whole story into a map you can actually see — every scene, every choice, every branch, all connected." | Project Canvas (settled, no navigation clicks visible) → Flow Canvas → Choices Canvas |
| 0:29–0:41 | diagnostics | "Got a broken jump, or a missing character reference? Vangard flags it right on the canvas, before your players ever hit it — click straight through to the exact line that needs fixing." | Diagnostics red glow on a block → Diagnostics panel list → click a diagnostic to jump to the line |
| 0:41–0:49 | editor | "Write your code in a real editor with Ren'Py-smart autocomplete... or skip the typing altogether." | Monaco editor, IntelliSense popup appearing mid-type |
| 0:49–1:04 | scene-composer | "Swap in a new background, drag your sprites into place, position them exactly where you want — the Scene Composer writes the show and scene code for you, live, as you work." | Scene Composer: swap background, drag sprite onto stage, reposition, code preview updates live |
| 1:04–1:11 | warp-to-label | "Need to jump straight to chapter five? Just warp there — no replaying the whole game." | Warp to Label modal, fuzzy search, game window jumps in |
| 1:11–1:19 | still-renpy | "And it's still just Ren'Py underneath. No lock-in, no weird formats — your project stays yours." | Split screen: same file open in Vangard and in a plain text editor |

### For Writers (divider card + feature)

| Time (rough) | ID | VO (narrator) | On-screen / visual cue |
|---|---|---|---|
| 1:19–1:22 | - | *(silent)* | "For Writers" divider card, black background |
| 1:22–1:34 | writers | "Every character and every variable your story tracks, organized in one place and globally searchable/changeable so you're never digging through files to remember what you named that flag." | Character Manager (edit a character) → cut to Variables tab |

### For Artists (divider card + feature)

| Time (rough) | ID | VO (narrator) | On-screen / visual cue |
|---|---|---|---|
| 1:34–1:37 | - | *(silent)* | "For Artists" divider card, black background |
| 1:37–1:51 | artists | "Build interactive image maps without writing a single hotspot by hand, and preview your soundtrack and sound effects right inside the project — no alt-tabbing to another player." | Image Maps composer (hotspot drawn) → cut to Audio Editor View, equalizer animating |

### For Developers (divider card + feature)

| Time (rough) | ID | VO (narrator) | On-screen / visual cue |
|---|---|---|---|
| 1:51–1:54 | - | *(silent)* | "For Developers" divider card, black background |
| 1:54–2:09 | developers | "Get a full breakdown of your script — word counts, branch counts, playtime estimates — and find anything in the whole project in seconds." | Script Statistics panel → cut to global Search panel, a query typed in |
| 2:09–2:19 | localization | "And when it's time to localize, Vangard tracks translation coverage for every language, and scaffolds new ones with a single click." | Translation Dashboard: language coverage cards → click Generate Translations |

### Feature montage + close

| Time (rough) | ID | VO (narrator) | On-screen / visual cue |
|---|---|---|---|
| 2:19–2:34 | - | *(silent — music swell / feature montage)* | Quick cuts: Snippets grid, Menu Constructor, Drafting Mode toggle |
| 2:34–2:42 | outro | "Vangard Studio. Come build your story — and watch it come to life." | Outro card, black background: logo + "Free on Itch.io" + GitHub link, lingers to end |

## Notes for the VO service

- Deliver at a warm, conversational pace — not a hard-sell trailer voice.
- Natural pauses are fine between lines; the visual cuts already carry some of the pacing.
- Silent beats (cold-open logo hold, each divider card, and the closing feature montage) need no VO.
- Timing above is a rough pacing guide only -- actual pacing will drift, and that's fine; `generate_vo.js` + `assemble_reel.js` size the cut to real line durations automatically.

## Next steps

**Workflow change:** the automated pipeline (`capture_broll.js` scripted
Playwright capture + `assemble_reel.js` ffmpeg crossfade/duck assembly +
`build_reel.js` orchestration) is retired in favor of manual editing --- VO
sync drift and jarring auto-crossfades weren't worth debugging further.
`generate_vo.js` is still used (it renders each VO line as an isolated clip,
never live-captured alongside footage, which is the whole point), but app
footage is now a manual screen recording, and final assembly happens by hand
in real video editing software.

- [x] Generate VO via `generate_vo.js` --- one `.mp3` per line in
      `docs/marketing/vo/`, named by script ID (e.g. `04-diagnostics.mp3`),
      with `cue-sheet.csv` (order/ID/duration/text) and
      `timing-summary.json` (same data) alongside for reference while
      aligning clips in the editor.
- [ ] Screen-record the app footage yourself, section by section, following
      this script's visual cues -- no need for one continuous take per
      `capture_broll.js`'s old "main"/"montage" split; record however's
      easiest to redo/reshoot a section.
- [ ] Source/license background music for the silent beats (candidate:
      `docs/marketing/music/ambient-technology-corporate.mp3`)
- [ ] Replace the placeholder intro/divider/outro cards with real branding
- [ ] Align VO clips to footage, cut, duck music under VO, and do the final
      edit pass in real video editing software
