# Vangard Studio — Feature Script: Translations / Localization

Part of the per-feature deep-dive set (see `bmf-vangard-renpy-ide-whfs`).
IDs namespaced `tr-*`.

**Target runtime:** ~1:20-1:40
**Tone:** practical demo-style, same as the other feature scripts.

## Script

| Time (rough) | ID | VO (narrator) | On-screen / visual cue |
|---|---|---|---|
| 0:00–0:12 | tr-hook | "Adding a second language to a Ren'Py project usually means running a console command, then manually tracking which of hundreds of lines actually got translated." | Illustrative: terminal running Ren'Py's translation-generation command |
| 0:12–0:26 | tr-open | "The Translation Dashboard tracks coverage for every language your project supports, without leaving the app." | Translation Dashboard, language coverage cards visible |
| 0:26–0:40 | tr-coverage | "See at a glance which language is fully translated, and which still has gaps — down to how many lines are missing." | Coverage card showing a percentage/count for an incomplete language |
| 0:40–0:55 | tr-generate | "Adding a new language is one click — Vangard scaffolds the translation files for you instead of you running a command and hoping you remembered the right flags." | Clicking "Generate Translations" / add-language action |
| 0:55–1:10 | tr-drill | "Drill into a language to see exactly which lines still need attention." | Clicking into a language's detail view, list of untranslated/stale lines |
| 1:10–1:25 | tr-close | "Translations — so shipping in more languages doesn't mean losing track of which ones are actually ready." | Translation Dashboard, held on an overview with multiple languages |

## Notes for the VO service

- Keep confident but not oversold — this is a tracking/organization tool,
  it doesn't do the actual translation work for you.

## Capture notes

- Use a demo project pre-seeded with at least 2 languages at different
  completion states (e.g., one at ~90%, one just scaffolded) so the
  coverage-gap visual actually has contrast to show.
