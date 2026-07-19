# Vangard Studio — Feature Script: Script Statistics & Search

Part of the per-feature deep-dive set (see `bmf-vangard-renpy-ide-whfs`).
IDs namespaced `ss-*`.

**Target runtime:** ~1:20-1:40
**Tone:** practical demo-style, same as the other feature scripts.

## Script

| Time (rough) | ID | VO (narrator) | On-screen / visual cue |
|---|---|---|---|
| 0:00–0:12 | ss-hook | "How long is your game, actually? How many branches does a player realistically see? Those questions are hard to answer just by scrolling through files." | Illustrative: scrolling through a long file tree, looking overwhelmed |
| 0:12–0:26 | ss-open | "Script Statistics gives you a full breakdown of your project — word counts, branch counts, estimated playtime." | Script Statistics panel opening, overview numbers visible |
| 0:26–0:42 | ss-breakdown | "Break it down by chapter or route to see where your story is heaviest, or where a branch might be thinner than you thought." | Drilling into a per-chapter/route breakdown |
| 0:42–0:55 | ss-switch | "And when you need to find something specific — a line, a variable, a character reference — global Search covers the whole project, not just the open file." | Switching to Search panel |
| 0:55–1:12 | ss-search | "Type a query and get every match across every file, with enough context to know which result is the one you actually want." | Typing a search query, results list with context snippets |
| 1:12–1:25 | ss-jump | "Click a result and jump straight to it — same click-through behavior as diagnostics." | Clicking a search result, editor jumps to the line |
| 1:25–1:40 | ss-close | "Statistics and Search — for knowing the shape of your story, and finding anything in it in seconds." | Statistics panel overview, held |

## Notes for the VO service

- Numbers-heavy section (`ss-breakdown`) — keep pace slightly slower so a
  viewer can actually read the on-screen figures before the cut.

## Capture notes

- Use a project large enough that the statistics are non-trivial (multiple
  chapters/routes, a few hundred lines) — a tiny demo project makes this
  feature look pointless.
- For `ss-search`, pick a query that returns results across at least 3
  different files to demonstrate the "whole project" claim.
