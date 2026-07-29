# Editor Tab Context Menu: Create-From-Selection Actions

**Date:** 2026-07-28
**Status:** Approved
**Related beads:** bmf-vangard-renpy-ide-d1zl, bmf-vangard-renpy-ide-a512, bmf-vangard-renpy-ide-zcoh
**Source:** GH #202 (walkthrough testing for 1.0.0 RC)

## Summary

Add three new right-click context menu actions to the Monaco code editor, each acting on the user's current text selection:

1. **New File** — create a new file (same directory, same extension as the current tab) named after the selection.
2. **Create Variable** — create a `default` variable named after the selection with value `0`, skipping the existing Add Variable dialog when possible.
3. **Create Character** — open the character editor tab pre-filled with the selection as both display name and code tag.

## Background

The Monaco editor (`src/components/EditorView.tsx`) already registers custom context-menu actions via `editor.addAction(...)` in the `renpy` context-menu group: `save-block`, `create-menu`, `insert-menu-template`, `warp-to-here`. `warp-to-here` demonstrates the precondition pattern: a Monaco context key (`renpyCanWarpHere`) computed in an `onContextMenu` listener, used to enable/disable the action before the menu renders.

Existing creation flows this design builds on:
- **Files**: `useFileSystemManager.ts:handleCreateNode` — `writeFile` + `addBlock` (if `.rpy`) + tree reload. Currently has zero name validation.
- **Variables**: `analysisResult.variables` (parsed, not separate state). Dialog: `VariableManager.tsx`'s inline "Add New Variable" form → `useStoryElementsPanel.ts:handleAddVariable`. Name regex: `/^[a-zA-Z_][a-zA-Z0-9_.]*$/`.
- **Characters**: `analysisResult.characters` (parsed). No modal — a full tab, `CharacterEditorView.tsx`, opened via `useCharacterManagement.ts:handleOpenCharacterEditor(tag)`. Tag regex: `/^[a-zA-Z0-9_]+$/`.

No general-purpose slugify/sanitize utility exists for these identifiers today (`templateProcessor.js`'s `slugify`/`sanitizeBuildName` are used only for project-name/build-name, not reused here).

## Design

### Shared utilities — `src/lib/editorSelectionActions.ts`

```
sanitizeIdentifier(text: string, allowDot = false): string
```
Collapses whitespace/newlines to `_`, strips characters outside `[A-Za-z0-9_]` (plus `.` when `allowDot` is true, for `persistent.` prefixes), prefixes a leading digit with `_`, trims. Returns `''` if nothing survives a fully-symbolic selection.

```
sanitizeFileName(text: string): string
```
Collapses whitespace/newlines to a single space, strips filesystem-reserved characters (`< > : " / \ | ? *`), trims.

### Monaco wiring — `EditorView.tsx`

- Extend the existing `onContextMenu` handler to compute and set a new Monaco context key `renpyHasSelection` (mirrors `renpyCanWarpHere`), true when `editor.getSelection()` is non-empty.
- Register three new `editor.addAction` entries in the `renpy` context-menu group, orders 5–7 (after `insert-copied-code`), each with `precondition: 'renpyHasSelection'` so they grey out (stay visible, disabled) rather than disappear when there's no selection.
- Each action reads selected text via `editor.getModel().getValueInRange(editor.getSelection())`.

### Feature 1: New File

1. Read selection, run `sanitizeFileName`.
2. Append the current tab's file extension (e.g. `.rpy`) to the sanitized name.
3. Resolve target directory from the current tab's file path.
4. **Direct-create path**: if the sanitized name equals the raw selection (no changes needed) AND no file with that name already exists in the directory → create directly via the existing `handleCreateNode` path (`writeFile`, `addBlock` if `.rpy`, tree reload), then open the new file in a new editor tab immediately.
5. **Fallback path**: if sanitization changed the name, or a file with that name already exists → open a new `QuickCreateFileModal` component (follows existing Modal conventions: `createPortal` to `document.body` + `useModalAccessibility`), showing the target directory and an editable filename field pre-filled with the sanitized name. Submit runs the same creation path as step 4, then opens the tab.
6. If `sanitizeFileName` returns `''` (fully symbolic selection), do nothing but surface a toast/error — no blank-named file.

### Feature 2: Create Variable

1. Read selection, run `sanitizeIdentifier(text, allowDot=true)`.
2. **Direct-create path**: if sanitized === raw selection AND the name isn't already a key in `analysisResult.variables` → call `handleAddVariable` directly with `name = selection`, `initialValue = '0'`, `type = 'default'`. No dialog is shown (per bead requirement to skip the Add dialog).
3. **Fallback path**: if sanitization changed the value, or the name collides with an existing variable → open `VariableManager`'s existing "Add New Variable" form pre-filled with the sanitized name and value `0`, letting the user adjust before saving.
4. If sanitization yields `''`, do nothing but surface a toast/error.

### Feature 3: Create Character

1. Read selection as `rawName`. Compute `tag = sanitizeIdentifier(rawName)` (no dot allowed).
2. Extend `handleOpenCharacterEditor` to accept optional pre-fill params: `initialTag` and `initialDisplayName`.
3. Always open the `CharacterEditorView` tab (same mechanism as the existing "+ Add" button), pre-filled: tag field = sanitized value, display-name field = `rawName` (unsanitized — display names have no format restriction). Both fields remain editable before save.
4. If `tag` already exists as a character tag, the tab still opens pre-filled; the existing duplicate-tag inline validation in `CharacterEditorView` (already present for the general "+ Add" flow) surfaces the error — no new logic needed here.
5. If `tag` sanitizes to `''` (fully symbolic selection), still open the tab but leave the tag field empty so the existing "tag required" validation catches it — no separate error path needed.

## Testing Plan

- **Unit tests** for `sanitizeIdentifier` / `sanitizeFileName`: multi-line selection, leading digit, all-symbols/empty result, already-valid input passthrough, dot-prefixed `persistent.` names, filesystem-reserved characters.
- **Component/hook tests** (Vitest + JSDOM, following `src/test/` conventions):
  - `EditorView`: the three actions are registered, gated by `renpyHasSelection`, and invoke the correct handler with sanitized text (mock `editor.getSelection` / `getValueInRange`).
  - New File: direct-create case and modal-fallback case (collision, and needs-sanitizing), via `useFileSystemManager` / new `QuickCreateFileModal`.
  - Create Variable: direct-`handleAddVariable` case vs. pre-filled-form-fallback case (collision, and needs-sanitizing).
  - Create Character: `handleOpenCharacterEditor` called with correct `initialTag`/`initialDisplayName`; duplicate-tag case surfaces existing validation.
- No e2e/manual-only scope — everything here is unit/component-testable in the existing setup.

## Out of Scope

- Changing file-name validation rules for the *existing* file-explorer "New File" flow (unrelated to this selection-driven entry point).
- A general-purpose slugify utility beyond what these three features need.
- Undo/redo integration beyond what `handleAddVariable`/`handleCreateNode`/character-save already provide.
