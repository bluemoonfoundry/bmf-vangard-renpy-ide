# Translations

Visual novels have a global audience. A game written in English might find passionate players in Japan, France, Brazil, or Korea -- but only if it speaks their language. Ren'Py has a mature translation system built in, and Vangard Studio wraps that system in a visual dashboard that makes it practical to manage translations across multiple languages, track progress file by file, and spot gaps before they reach players.

Managing translations in a visual novel is not like translating a simple application. A game might have thousands of dialogue lines, each tied to a specific character voice and emotional context. Some lines are narrator text, some are spoken dialogue, and some are player choice text that needs to be concise enough to fit inside a button. Keeping track of all this across multiple languages -- especially as the source script evolves -- is a significant project management challenge. The Translation Dashboard is designed specifically for this.

## Opening the Translation Dashboard

Click the globe icon in the toolbar to open the **Translation Dashboard**. It fills the panel with three sections stacked vertically: language overview cards at the top, a file breakdown table in the middle, and a string-level view at the bottom.

If your project does not have any translations yet, the dashboard shows an empty state with a brief explanation of how Ren'Py's translation system works and a button to generate your first translation scaffolding.

## Language Overview Cards

The top section displays one card per detected language in your project. Each card shows:

- The **language name**, matching the directory name under `game/tl/`. Ren'Py uses plain names like `french`, `japanese`, or `spanish` -- whatever you chose when generating the translation files.
- The **total string count** -- how many translatable strings exist in your project across all files.
- The **translated count** -- how many of those strings have translations in this language.
- The **stale count** -- translations where the translated text is identical to the source text. This is the dashboard's way of telling you "this string has a translation file entry, but nobody has actually translated it yet." When Ren'Py generates translation scaffolding, it copies the source text as a placeholder. Until a translator replaces it with the target language, it counts as stale.
- A **completion percentage bar** that gives you an instant visual read on progress. The bar turns green above 80%, yellow between 40% and 80%, and red below 40%.

Click any language card to select it as the active language. The file breakdown and string-level sections below update to show data specific to that language.

## File Breakdown Table

The middle section is a sortable table with one row per source file in your project. The columns are:

| Column | What it shows |
|--------|---------------|
| File | The source `.rpy` file path |
| Total | Total translatable strings in that file |
| Translated | Strings with actual (non-stale) translations |
| Untranslated | Strings still needing translation |
| Stale | Translations identical to source text |
| Completion | Percentage bar for this specific file |

Click any column header to sort by that column. Click again to toggle between ascending and descending order. This is how you find the files that need the most attention -- sort by `Untranslated` in descending order, and the biggest gaps float to the top. Or sort by `Stale` to find files where the scaffolding was generated but the actual translation work has not started.

## String-Level View

The bottom section lists every individual translatable string in your project. This is a virtual-scrolling list, meaning it renders only the visible rows at any given time -- so even a project with thousands of dialogue lines stays responsive.

Each row displays:

- A **type badge** -- `dialogue`, `narration`, or `choice` -- so you can immediately see what kind of string you are looking at. Dialogue has a character speaking, narration is narrator text, and choices are menu options the player clicks.
- The **character tag** (if any, shown in bold) and the **source text**.
- The **file path and line number** in small text below.
- **Language status badges** for each detected language -- green if translated, amber if stale, red if missing. Click any badge to jump to that translation in the editor.

Filter controls at the top of the string list let you narrow what you see:

- **Language pills** -- click to switch the active language context.
- **Status filter** -- choose between `All Status`, `Translated`, `Untranslated`, or `Stale`.
- **Text search** -- type a word or phrase to filter by string content or file path. Useful when a translator asks "where is the line that says X?"

Click any string row to jump directly to its translation in the code editor. If a translation exists for the selected language, you land on the translated line. If the string is untranslated, you land on the source string instead, so you can see what needs translating.

This click-to-navigate behavior is what elevates the dashboard from a passive status report to an active working tool. Instead of scrolling through translation files hunting for a specific string, you find it in the searchable dashboard and click once. The editor opens, scrolls to the right line, and you are editing immediately.

## Generating Translation Scaffolding

Starting a new language? Click the `Generate Translations` button in the top-right corner of the dashboard. A modal appears asking for the language code.

Enter the language name in lowercase -- `french`, `japanese`, `brazilian_portuguese`, or whatever identifier you prefer. The code must use only lowercase letters, numbers, and underscores, and must start with a letter. The modal validates your input in real time and shows an error if the format is invalid.

When you confirm, the IDE invokes Ren'Py's built-in translation generator through the SDK. This creates the `game/tl/<language>/` directory structure and populates it with translation stubs for every translatable string in your project. Each stub contains the source text as a placeholder, ready for a translator to replace.

This feature requires a valid Ren'Py SDK path in your settings. If the SDK is not configured, the `Generate Translations` button is disabled with a tooltip explaining why.

After generation completes, the dashboard updates to show the new language card. Every string starts as stale (since the scaffolding just copies the source text), so you will see 0% effective completion. From here, hand the generated `.rpy` files to your translators. They are standard text files that any editor can open.

## How the Parser Works

The Translation Dashboard requires no manual configuration. The IDE's analysis engine handles detection automatically:

1. It scans your project for `game/tl/<language>/` directories to discover which languages exist.
2. It parses the translation blocks inside those directories and matches them back to source strings using Ren'Py's translation ID system.
3. It identifies stale translations by comparing each translated string to its source string -- if they are character-for-character identical, the translation has not actually been done yet.

This detection runs as part of the normal project analysis, so the dashboard stays up to date as you and your translators work.

## The Translation Workflow

A typical multilingual visual novel workflow looks like this:

1. Write your visual novel in your base language. Focus on the story first.
2. When you are ready to localize, open the Translation Dashboard and click `Generate Translations` for each target language.
3. Hand the generated files (under `game/tl/`) to your translators. Because these are standard `.rpy` files, translators do not need the IDE -- they can use any text editor.
4. As translated files come back, copy them into your project folder (or merge them via Git).
5. Use the dashboard to track progress across every language. Find untranslated strings, identify stale translations, and see which files are finished and which still need work.
6. When you update source dialogue (fixing a typo or rewriting a line), the corresponding translation becomes stale -- the dashboard catches this automatically so you can flag it for re-translation.

The dashboard is a read-only tracking and navigation tool. It does not edit translation files for you -- that is the translator's job. What it does is give you a complete, real-time picture of every string across every language, so nothing falls through the cracks.

This separation of concerns is deliberate. Translation is a specialized task that requires understanding context, tone, and cultural nuance. The IDE's role is logistics -- making sure every string has a place, tracking which strings are done, and helping you navigate to the right location when something needs attention. The actual craft of translation stays in the hands of the people who know the language.

One practical tip: if you are managing multiple translators working on the same language (perhaps one handling Chapter 1-3 and another handling Chapter 4-6), use the file breakdown table to track each person's progress independently. Sort by file name and you can see exactly which files are done and which are still pending.
