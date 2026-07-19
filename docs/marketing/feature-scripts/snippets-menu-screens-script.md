# Vangard Studio — Feature Script: Snippets, Menu Constructor & Screens Composer

Part of the per-feature deep-dive set (see `bmf-vangard-renpy-ide-whfs`).
Bundled into one script since all three are lighter-weight, "convenience
tooling" features that don't individually carry a full 1:30 video — grouped
here as one video with three short chapters rather than three thin ones.
IDs namespaced `sm-*`.

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

### Chapter 3: Screens Composer (preview)

| Time (rough) | ID | VO (narrator) | On-screen / visual cue |
|---|---|---|---|
| 1:25–1:38 | sm-screens-hook | "Custom screens are powerful, but hard to picture just from reading the `screen` statement." | Raw `screen` statement code, dense and hard to visually parse |
| 1:38–1:55 | sm-screens-preview | "The Screens tab renders a live preview of your custom screens, resolving your actual style and `gui.*` values — so you see what it really looks like, not just the code that describes it." | Screens tab, live-rendered preview of a real project screen |
| 1:55–2:05 | sm-close | "Snippets, Menu Constructor, and Screen Preview — three smaller tools, all aimed at the same thing: less time translating an idea into Ren'Py syntax by hand." | Quick cut across all three panels |

## Notes for the VO service

- Use a brief pause (0.5-1s) at each chapter boundary — these are meant to
  feel like distinct segments within one video, not one continuous feature.

## Capture notes

- Screens tab is **read-only preview only** — no "+ New" creation flow exists
  in the app (confirmed against `src/` as of the 2026-07-12 docs audit,
  see beads memory `docs-code-mismatch-screen-layout-composer`). Do not
  script or capture a screen-creation flow for `sm-screens-preview`.
- Menu Constructor capture should show at least one conditional choice
  (an `if` guard on a menu option), not just plain unconditional choices —
  that's the actual value proposition over hand-writing it.
