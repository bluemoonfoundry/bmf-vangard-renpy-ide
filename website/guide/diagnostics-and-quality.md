# Diagnostics and Quality

You have written ten thousand words of dialogue, set up branching paths, composed scenes, and defined a cast of characters. Everything feels right -- until a playtester hits a `jump` to a label that does not exist, or a `show` statement references an image you renamed last week. These are the kinds of errors that Ren'Py itself will catch at runtime, crashing the game with a traceback. Vangard Studio's diagnostics system catches them before your players do.

## What Diagnostics Check

The diagnostics engine continuously analyzes your project and flags issues across several categories:

- **Invalid jumps** -- `jump cafe_scene` where `cafe_scene` is not a defined label anywhere in the project
- **Missing images** -- `show eileen happy` where no image with that tag has been registered
- **Missing audio** -- `play music "audio/theme.ogg"` where the referenced file does not exist
- **Undefined characters** -- a dialogue line attributed to a character tag that has no `define` statement
- **Undefined screens** -- `call screen inventory` where no `screen inventory` definition exists
- **Unused characters** -- characters that are defined but never speak and are never referenced
- **Unreachable labels** -- labels that no `jump`, `call`, or fall-through path can reach from `label start`
- **Dead-end labels** -- labels with no outgoing `jump`, `call`, or `return`, where the story flow stops
- **Syntax errors** -- structural problems like missing colons after `if` statements or malformed triple-quoted strings

Each issue is classified by severity: **error** (will crash the game), **warning** (likely a bug), or **info** (worth reviewing but possibly intentional).

## The Diagnostics Panel

Open the Diagnostics panel from the toolbar button (it has a red badge showing the error count when issues exist) or from the corresponding toolbar icon. The panel has two views: **Issues** and **Tasks**.

![The Diagnostics panel listing issues with severity icons and category badges](/diagnostics-panel-full.png)

The **Issues** view lists every detected problem. Each entry shows:

- A severity icon (red circle for errors, yellow triangle for warnings, blue circle for info)
- A category badge (e.g., "Invalid Jump", "Missing Image", "Syntax")
- A description of the problem
- The file and line number where the issue occurs

Click any issue to jump directly to the source -- Vangard Studio opens the file, scrolls to the line, and highlights the problematic code. This one-click navigation means you can work through a list of issues methodically, fixing each one without manually searching.

**Filter by severity** using the filter controls at the top of the panel. When you are in bug-fixing mode, filter to errors only. When you are polishing, include warnings and info.

If a diagnostic is intentional -- perhaps you have an unreachable label that serves as a developer testing area -- you can **suppress it**. Right-click the issue and choose to ignore that specific rule. Suppression rules are stored in your project settings and can be managed (re-enabled) at any time.

## Tasks

The **Tasks** view turns diagnostics into a checklist. Convert any diagnostic issue into a task item by promoting it, giving you a trackable to-do list for your quality assurance pass.

Sticky notes on any of the three canvases can also be promoted to tasks via their checkbox. This connects your visual planning (sticky notes on the canvas saying "fix this transition") with your structured quality tracking (the tasks checklist).

Tasks persist in `.renide/project.json` and survive IDE restarts. Check them off as you resolve them.

## Diagnostics on the Canvas

You do not need to have the Diagnostics panel open to see problems. On the **Project Canvas**, blocks with issues display a **colored outer glow**:

- **Red glow** -- the block contains at least one error-severity diagnostic
- **Amber glow** -- the block contains warnings but no errors

This gives you an immediate visual sense of project health as you look at the canvas. A project with no glow effects on any block is a clean project. A sea of red means it is time to open the Diagnostics panel and start working through the list.

The **toolbar badge** reinforces this: a small red circle on the Diagnostics button shows the total error count. When it reads zero, you know you are in good shape.

## Project Statistics

Beyond finding problems, Vangard Studio helps you understand your project's scope and shape through the **Project Statistics** view. Open it from the toolbar.

![The Project Statistics panel showing story metrics and per-character breakdown](/project-statistics.png)

The statistics dashboard presents several categories of data, each loading independently with inline spinners (so you see numbers as they become available rather than waiting for everything to compute):

**Story metrics**:

- **Total word count** -- words across all dialogue and narration lines
- **Estimated play time** -- a rough calculation based on average reading speed
- **Lines of dialogue** -- the raw count of dialogue lines in the project
- **Label count** and **menu count** -- structural measures of your story's scope

**Per-character dialogue breakdown**: a sortable table showing each character's word count, their share of total dialogue as a percentage, and a colored progress bar. For projects with more than six characters, the table becomes sortable by name or word count. This is revealing -- you might discover that your supposed secondary character actually speaks more than your protagonist.

**Branching complexity**: Vangard Studio calculates a complexity score based on the ratio of branching points to total story blocks and the number of identified routes. The score falls into one of four buckets:

- **Linear** -- mainly one path through the story
- **Branching** -- several distinct story paths
- **Complex** -- many intersecting routes and choices
- **Non-linear** -- highly interconnected with a large route space

Each bucket is color-coded (green through red) and includes a brief description. This gives you an at-a-glance sense of your story's structural complexity.

**Path statistics**: the number of story endings (dead-end labels reachable from `start`), plus the shortest and longest paths through the narrative graph. If your shortest path is 3 labels and your longest is 47, you know some players will see far more content than others.

**Asset coverage**: a filterable, sortable table showing every image and audio reference in your project, categorized as "referenced" (used and present), "missing" (referenced in code but not found), or "orphaned" (present in assets but never referenced in code). This helps you clean up unused assets and catch missing ones.

### IDE Performance

At the bottom of the statistics view, an **IDE Performance** section reports technical metrics for the current session:

- **Project load time** -- how long it took to open and index your project
- **Analysis worker duration** -- how long the most recent full analysis took
- **Asset scan time** -- how long image and audio scanning took
- **Canvas FPS** -- the current rendering frame rate for the active canvas (measured as a rolling 60-frame average)
- **JS heap memory** -- the current memory usage of the IDE process

Each metric shows its value against a target threshold where applicable (e.g., analysis should complete in under a certain time). Green means the target is met; red means it is exceeded. This is primarily useful if you notice the IDE feeling sluggish on a large project -- the performance section helps you identify whether the bottleneck is analysis, asset scanning, or rendering.
