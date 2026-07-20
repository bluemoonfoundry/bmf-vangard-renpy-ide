# Gentle Intro — Manual Capture Checklist

Companion to `gentle-intro-script.md`. Use this while manually
screen-recording (OBS or similar) — no scripted driving, you click through
each beat yourself. Record everything as one continuous take per section
below (or all in one go), then cut in the editor afterward.

## One-time setup

1. **Don't use the committed `DemoProject/` as-is for the diagnostics shot.**
   Make a disposable copy first (e.g. copy `DemoProject/` to a temp folder)
   so you can deliberately break something without touching the shared
   fixture other scripts/tests rely on.
2. In the copy, open `game/scenes/stage1/stage1_choice.rpy` and change the
   first `jump stage1_evening` to a typo, e.g. `jump stage1_evenning`. This
   gives Diagnostics something real to flag on that block. Save.
3. Open the copied project in Vangard Studio, full-screen the window.

## Shot list

**1. `gentle-canvas-settle`** (~14s) — Project Canvas, no other panels open.
Use Ctrl+G → type `stage1_choice` → Enter to center that block at a
readable zoom. Let it sit a beat, then drag the block a short distance by
its drag-handle (top strip, not the code inside it).

*Pair in the editor with a separate OS-file-explorer recording of the same
project's `.rpy` files for `gentle-file-to-block` — that's not an app shot.*

**2. `gentle-write-a-line`** (~16s) — Double-click the `stage1_choice.rpy`
block to open it in Monaco. Click into the editor, go to the end of the
file (Ctrl+End), press Enter, and type:
```
        jump
```
(with a trailing space) and pause — the label-name autocomplete popup
should appear. Hold a beat on camera. When done, press Escape then Ctrl+Z a
few times to revert — **do not save**.

**3. `gentle-see-it-branch`** (~12s) — Switch to the Flow Canvas (toolbar
canvas switcher). The branch out of `stage1_choice` should be visible
connecting to its jump targets. Let it settle, no clicking needed.

**4. `gentle-safety-net`** (~16s) — Switch back to Project Canvas. Ctrl+G to
`stage1_choice` again — you should see a red diagnostic glow on the block
(from the typo'd jump). Click the Diagnostics button in the toolbar, find
the entry for `stage1_choice.rpy`, and click its "Open" (jump-to-line)
icon to demonstrate the click-through.

**5. `gentle-close-teaser`** (~10s) — Quick glimpses only, don't linger:
open the Translation Dashboard for a couple seconds, then Escape. (Scene
Composer teaser can be captured separately if it's easier to reach from a
different block.)

## After recording

- Delete the disposable project copy — the broken jump should never be
  committed or reused in the real `DemoProject/`.
- Hand footage + `docs/marketing/export/audio/` VO lines (or freshly
  generated `gentle-*` VO once written) to the editor for the cut described
  in `gentle-intro-script.md`.
