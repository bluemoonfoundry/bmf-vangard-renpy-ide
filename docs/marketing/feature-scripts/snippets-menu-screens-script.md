# Vangard Studio — Feature Script: Snippets, Menu Constructor & Screens Tab

Part of the per-feature deep-dive set (see `bmf-vangard-renpy-ide-whfs`).
Bundled into one script since all three are lighter-weight, "convenience
tooling" features that don't individually carry a full 1:30 video — grouped
here as one video with three short chapters rather than three thin ones.
IDs namespaced `sm-*`.

**v1.0.0 note:** the richer "live-rendered screen preview" capability
(`ScreenPreview`/`ScreenPreviewTab`, resolving named styles and `gui.*`
values) exists in the codebase but has no wired-up entry point in this
release — it is not reachable by a user, so it must not be filmed or
described as a feature. Chapter 3 below covers only what's actually
reachable: the Story Elements "Screens" tab, which is a plain read-only
list (`ScreenManager`) of parsed `screen` definitions with a jump-to-source
action — not a preview/composer. See beads memory
`docs-code-mismatch-screen-layout-composer` and the website's
`composer-reference.md` §7.3 ("Screens — No Visual Composer").

**Target runtime:** ~1:45-2:05 (roughly 35-40s per sub-feature)
**Tone:** practical demo-style, same as the other feature scripts. Use a
short title card or on-screen label at each chapter boundary since this
script covers three distinct things back to back.

## Script

### Chapter 1: Snippets

| Time (rough) | ID | VO (narrator) | On-screen / visual cue |
|---|---|---|---|
| 0:00–0:10 | sm-snippets-hook | "Some bits of Ren'Py code you end up retyping in project after project — a fade transition, a common menu pattern." | Illustrative: retyping the same boilerplate code block |
| 0:10–0:25 | sm-snippets-use | "Snippets keeps a library of those, ready to drop into any label with one click, instead of copy-pasting from an old project." | Snippets panel, browsing a list, inserting one into the editor |
| 0:25–0:35 | sm-snippets-save | "Write something once, save it as a snippet, and it's there for the next label — or the next project." | Saving a newly-written block as a snippet |

### Chapter 2: Menu Constructor

| Time (rough) | ID | VO (narrator) | On-screen / visual cue |
|---|---|---|---|
| 0:40–0:52 | sm-menu-hook | "A branching choice menu is simple in theory, but nesting conditions and `if` guards by hand gets messy fast." | Hand-written nested `menu:`/`if` block |
| 0:52–1:10 | sm-menu-build | "The Menu Constructor builds the menu structure visually — add a choice, add a condition on it, reorder — and it writes the nested code for you." | Menu Constructor modal, adding choices, attaching a condition |
| 1:10–1:20 | sm-menu-close | "Same menu, same Ren'Py underneath — just built without hand-tracking the indentation." | Generated menu code shown in editor |

### Chapter 3: Screens tab

| Time (rough) | ID | VO (narrator) | On-screen / visual cue |
|---|---|---|---|
| 1:25–1:36 | sm-screens-hook | "Custom screens live scattered across your files — easy to lose track of which ones you've already written." | Scrolling through several files, each containing one `screen` block |
| 1:36–1:50 | sm-screens-list | "The Screens tab lists every custom screen your project defines, in one place." | Story Elements Screens tab, list of parsed `screen` definitions |
| 1:50–2:00 | sm-screens-jump | "Click one and jump straight to its code — no hunting through files to find where a screen is actually written." | Clicking a screen entry, editor jumps to that `screen` block |
| 2:00–2:10 | sm-close | "Snippets, Menu Constructor, and the Screens tab — three smaller tools, all aimed at the same thing: less time hunting for things you already wrote." | Quick cut across all three panels |

## Notes for the VO service

- Use a brief pause (0.5-1s) at each chapter boundary — these are meant to
  feel like distinct segments within one video, not one continuous feature.

## Capture notes

- The Screens tab is a **plain read-only list** (`ScreenManager`) — no
  live-rendered preview, no "+ New" creation/composer flow. Do not script or
  capture anything that implies screens can be visually built or previewed
  in-app; only "list + jump to source" is real in v1.0.0 (confirmed against
  `src/` — see beads memory `docs-code-mismatch-screen-layout-composer`).
- Menu Constructor capture should show at least one conditional choice
  (an `if` guard on a menu option), not just plain unconditional choices —
  that's the actual value proposition over hand-writing it.
