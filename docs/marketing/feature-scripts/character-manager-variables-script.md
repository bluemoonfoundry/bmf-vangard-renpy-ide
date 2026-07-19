# Vangard Studio — Feature Script: Character Manager & Variables

Part of the per-feature deep-dive set (see `bmf-vangard-renpy-ide-whfs`).
Covers two Story Elements panel tabs together since they solve the same
underlying problem (losing track of names/flags across a growing project)
and are adjacent tabs in the UI.

**Target runtime:** ~1:30-1:50
**Tone:** practical demo-style, same as the other feature scripts.
**Audience:** someone already sold on the app, deciding if this solves a
specific pain point (renaming a character, finding where a flag is used).
IDs namespaced `cv-*`.

## Script

| Time (rough) | ID | VO (narrator) | On-screen / visual cue |
|---|---|---|---|
| 0:00–0:12 | cv-hook | "Fifty scenes in, you rename a character — and now you're doing a find-and-replace across dozens of files, hoping you don't miss one or clobber a similar word." | Text editor, manual find-replace across multiple files (illustrative, can be a mockup) |
| 0:12–0:24 | cv-open | "The Character Manager keeps every character defined in one place — open it from Story Elements, and every character your project uses is already listed." | Story Elements panel, Characters tab open, list of characters |
| 0:24–0:40 | cv-edit | "Edit a name, a color, a display tag here, and it updates everywhere that character is referenced — not just in one file." | Editing a character's display name/color; cut to a canvas block showing the updated reference |
| 0:40–0:55 | cv-search | "And because it's centralized, you can search by character across the whole project, not just within whatever file you happen to have open." | Global search scoped to a character name, results across multiple files |
| 0:55–1:08 | cv-variables-switch | "Variables work the same way — every flag and variable your story sets, tracked in one tab instead of scattered across labels." | Switch to Variables tab in Story Elements |
| 1:08–1:25 | cv-variables-find | "Forgot what you named the flag for 'has the letter'? Search it here instead of scrolling through every branch that might set it." | Searching/filtering the Variables list, clicking through to a usage |
| 1:25–1:40 | cv-why | "It's less about any one feature and more about not having to hold your whole project's naming scheme in your head." | Wide shot of both tabs side by side or in quick succession |
| 1:40–1:50 | cv-close | "Character Manager and Variables — for keeping track of what you called everything, so you don't have to." | Story Elements panel, held on either tab |

## Notes for the VO service

- Keep this one grounded and low-key — it's a "quality of life" feature, not
  a wow-moment, and shouldn't be oversold as one.

## Capture notes

- Use a project with at least 3-4 characters (varied names/colors) and a
  handful of variables with realistic names (flags, counters) rather than
  placeholder `var1`/`var2` — the pain point only reads if the names look real.
- The rename-propagates-everywhere beat (`cv-edit`) is the one shot worth
  re-taking until it's clean; it's the strongest "why" moment in this script.
