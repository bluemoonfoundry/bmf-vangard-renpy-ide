# Editor Tab Context Menu: Create-From-Selection Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three Monaco editor context-menu actions — New File, Create Variable, Create Character — that act on the user's current text selection, per the approved spec at `docs/superpowers/specs/2026-07-28-editor-selection-context-menu-design.md`.

**Architecture:** A shared sanitizer library normalizes selected text into valid identifiers/filenames. `EditorView.tsx` gains a `renpyHasSelection` Monaco context key and three `editor.addAction` entries that call new callback props. Each of the three features has a "direct create" fast path (when the sanitized name needs no changes and doesn't collide) and a "fallback" path that opens an existing (or new, for files) pre-filled UI for the user to confirm/edit.

**Tech Stack:** React 18 + TypeScript, Monaco editor (`@monaco-editor/react`), Vitest + JSDOM, existing IPC (`window.electronAPI`) via Electron.

## Global Constraints

- Follow `@/` import alias convention everywhere (no `../`).
- State mutation via `useImmer` drafts only where existing state already uses immer (`updateAppSettings`) — do not convert unrelated state.
- New modal (`QuickCreateFileModal`) must use `createPortal` + `useModalAccessibility`, matching `CreateBlockModal.tsx`/`GoToLabelModal.tsx` conventions.
- No behavior change to the existing "+ Add" character flow or existing file-explorer "New File" flow — new optional props/params must default to `undefined`/prior behavior.
- Every new exported function needs a corresponding Vitest unit/component test in `src/test`-style co-located `*.test.ts(x)` files.
- Run `npm test` and `npx tsc --noEmit` (or equivalent existing typecheck script) before each commit that changes `.ts`/`.tsx` files.

---

## Task 1: Shared sanitize utilities

**Files:**
- Create: `src/lib/editorSelectionActions.ts`
- Test: `src/lib/editorSelectionActions.test.ts`

**Interfaces:**
- Produces: `sanitizeIdentifier(text: string, allowDot?: boolean): string`, `sanitizeFileName(text: string): string` — both pure functions, no dependencies on other app code. Later tasks import these two names from `@/lib/editorSelectionActions`.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/editorSelectionActions.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { sanitizeIdentifier, sanitizeFileName } from '@/lib/editorSelectionActions';

describe('sanitizeIdentifier', () => {
  it('passes through an already-valid identifier unchanged', () => {
    expect(sanitizeIdentifier('valid_name')).toBe('valid_name');
  });

  it('replaces spaces with underscores', () => {
    expect(sanitizeIdentifier('the golden sword')).toBe('the_golden_sword');
  });

  it('collapses newlines and multiple spaces into single underscores', () => {
    expect(sanitizeIdentifier('line one\nline   two')).toBe('line_one_line_two');
  });

  it('prefixes a leading digit with an underscore', () => {
    expect(sanitizeIdentifier('123abc')).toBe('_123abc');
  });

  it('strips punctuation', () => {
    expect(sanitizeIdentifier('player: "hi"')).toBe('player_hi');
  });

  it('returns empty string for a fully symbolic selection', () => {
    expect(sanitizeIdentifier('!!!')).toBe('');
  });

  it('returns empty string for whitespace-only selection', () => {
    expect(sanitizeIdentifier('   ')).toBe('');
  });

  it('strips dots by default (allowDot=false)', () => {
    expect(sanitizeIdentifier('persistent.seen_ending')).toBe('persistent_seen_ending');
  });

  it('keeps dots when allowDot=true', () => {
    expect(sanitizeIdentifier('persistent.seen_ending', true)).toBe('persistent.seen_ending');
  });
});

describe('sanitizeFileName', () => {
  it('passes through an already-valid filename unchanged', () => {
    expect(sanitizeFileName('chapter_one')).toBe('chapter_one');
  });

  it('preserves internal spaces (filenames allow spaces)', () => {
    expect(sanitizeFileName('the golden sword')).toBe('the golden sword');
  });

  it('collapses multiple spaces and trims edges', () => {
    expect(sanitizeFileName('  spaced   out  ')).toBe('spaced out');
  });

  it('replaces filesystem-reserved characters with underscores', () => {
    expect(sanitizeFileName('a:b*c')).toBe('a_b_c');
  });

  it('returns empty string for a fully reserved-character selection', () => {
    expect(sanitizeFileName('???')).toBe('');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/editorSelectionActions.test.ts`
Expected: FAIL — `Cannot find module '@/lib/editorSelectionActions'`

- [ ] **Step 3: Implement the sanitizers**

Create `src/lib/editorSelectionActions.ts`:

```typescript
/**
 * @file editorSelectionActions.ts
 * @description Pure text-sanitizing helpers for turning arbitrary editor
 * selections into valid identifiers or filenames, used by the Monaco
 * "create from selection" context-menu actions in EditorView.
 */

function isDegenerate(s: string): boolean {
  return s.length === 0 || /^_+$/.test(s);
}

/**
 * Converts arbitrary text into a valid Ren'Py identifier: letters, digits,
 * underscores (and dots when allowDot is set, for `persistent.` names).
 * Returns '' if nothing usable survives (e.g. a fully symbolic selection).
 */
export function sanitizeIdentifier(text: string, allowDot = false): string {
  const collapsed = text.trim().replace(/\s+/g, '_');
  const invalidPattern = allowDot ? /[^A-Za-z0-9_.]+/g : /[^A-Za-z0-9_]+/g;
  let result = collapsed.replace(invalidPattern, '_');
  if (isDegenerate(result)) return '';
  if (/^[0-9]/.test(result)) result = `_${result}`;
  return result;
}

/**
 * Converts arbitrary text into a filesystem-safe filename (base name,
 * without extension). Filenames allow spaces, so only whitespace runs are
 * collapsed and filesystem-reserved characters are replaced.
 */
export function sanitizeFileName(text: string): string {
  const collapsed = text.trim().replace(/\s+/g, ' ');
  const result = collapsed.replace(/[<>:"/\\|?*]+/g, '_');
  return isDegenerate(result) ? '' : result;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/editorSelectionActions.test.ts`
Expected: PASS (all cases)

- [ ] **Step 5: Commit**

```bash
git add src/lib/editorSelectionActions.ts src/lib/editorSelectionActions.test.ts
git commit -m "feat: add sanitizeIdentifier/sanitizeFileName helpers for editor selection actions"
```

---

## Task 2: Monaco context-menu wiring (New File / Create Variable / Create Character actions)

**Files:**
- Modify: `src/components/EditorView.tsx`
- Modify: `src/components/editorAndExplorer.test.tsx`

**Interfaces:**
- Consumes: nothing new from other tasks (props are plain callbacks the caller supplies).
- Produces: `EditorViewProps` gains three new **required** callbacks:
  - `onCreateFileFromSelection: (blockId: string, selectedText: string) => void`
  - `onCreateVariableFromSelection: (selectedText: string) => void`
  - `onCreateCharacterFromSelection: (selectedText: string) => void`
  Later tasks (3, 4, 5) wire these to real App.tsx handlers via `useTabContentRenderer.tsx`.

- [ ] **Step 1: Write the failing tests**

In `src/components/editorAndExplorer.test.tsx`, update `createMockEditorInstance` (around line 283) to add selection mocking, and `makeEditorViewProps` (around line 360) to supply the three new required props. Locate:

```typescript
function createMockEditorInstance(content = '') {
  const mockModel = {
    getValue: vi.fn(() => content),
    setValue: vi.fn(),
    updateOptions: vi.fn(),
    detectIndentation: vi.fn(),
    getLanguageId: vi.fn(() => 'renpy'),
  };
```

Replace with (adds `getValueInRange` to the model mock, and `getSelection` to the editor mock):

```typescript
function createMockEditorInstance(content = '', selectedText = '') {
  const mockSelection = selectedText ? { isEmpty: () => false } : null;
  const mockModel = {
    getValue: vi.fn(() => content),
    setValue: vi.fn(),
    updateOptions: vi.fn(),
    detectIndentation: vi.fn(),
    getLanguageId: vi.fn(() => 'renpy'),
    getValueInRange: vi.fn(() => selectedText),
  };
```

Then, further down in the same function, add `getSelection: vi.fn(() => mockSelection),` to the `mockEd` object (alongside the existing `getPosition: vi.fn(() => null),` line).

In `makeEditorViewProps` (around line 360), add the three new required props:

```typescript
    onWarpToLabel: vi.fn(),
    onCreateFileFromSelection: vi.fn(),
    onCreateVariableFromSelection: vi.fn(),
    onCreateCharacterFromSelection: vi.fn(),
```

Then add new tests at the end of the `describe('EditorView', ...)` block (after the existing `'creates warp context key on mount'` test, before `'calls onEditorUnmount after mount + unmount'`):

```typescript
  it('creates the has-selection context key on mount', async () => {
    const props = makeEditorViewProps();
    const { mockEd } = await renderAndMount(props);
    expect(mockEd.createContextKey).toHaveBeenCalledWith('renpyHasSelection', false);
  });

  it('registers the three create-from-selection actions on mount', async () => {
    const props = makeEditorViewProps();
    const { mockEd } = await renderAndMount(props);
    const actionIds = mockEd.addAction.mock.calls.map((c: unknown[]) => (c[0] as { id: string }).id);
    expect(actionIds).toContain('create-file-from-selection');
    expect(actionIds).toContain('create-variable-from-selection');
    expect(actionIds).toContain('create-character-from-selection');
  });

  it('gates the three create-from-selection actions on renpyHasSelection', async () => {
    const props = makeEditorViewProps();
    const { mockEd } = await renderAndMount(props);
    const actions = mockEd.addAction.mock.calls.map((c: unknown[]) => c[0] as { id: string; precondition?: string });
    const gated = actions.filter(a => ['create-file-from-selection', 'create-variable-from-selection', 'create-character-from-selection'].includes(a.id));
    expect(gated).toHaveLength(3);
    gated.forEach(a => expect(a.precondition).toBe('renpyHasSelection'));
  });

  it('calls onCreateFileFromSelection with blockId and selected text when the action runs', async () => {
    const onCreateFileFromSelection = vi.fn();
    const props = makeEditorViewProps({ onCreateFileFromSelection });
    const { mockEd } = await renderAndMount({ ...props, block: { ...props.block, content: 'label start:\n    "the golden sword"\n    return\n' } });
    // Re-render/mount already happened; simulate a selection on this editor instance.
    (mockEd.getModel() as { getValueInRange: ReturnType<typeof vi.fn> }).getValueInRange.mockReturnValue('the golden sword');
    (mockEd.getSelection as ReturnType<typeof vi.fn>).mockReturnValue({ isEmpty: () => false });
    const action = mockEd.addAction.mock.calls.find((c: unknown[]) => (c[0] as { id: string }).id === 'create-file-from-selection')?.[0] as { run: (ed: unknown) => void };
    action.run(mockEd);
    expect(onCreateFileFromSelection).toHaveBeenCalledWith('block-1', 'the golden sword');
  });

  it('calls onCreateVariableFromSelection with selected text when the action runs', async () => {
    const onCreateVariableFromSelection = vi.fn();
    const props = makeEditorViewProps({ onCreateVariableFromSelection });
    const { mockEd } = await renderAndMount(props);
    (mockEd.getModel() as { getValueInRange: ReturnType<typeof vi.fn> }).getValueInRange.mockReturnValue('player_score');
    (mockEd.getSelection as ReturnType<typeof vi.fn>).mockReturnValue({ isEmpty: () => false });
    const action = mockEd.addAction.mock.calls.find((c: unknown[]) => (c[0] as { id: string }).id === 'create-variable-from-selection')?.[0] as { run: (ed: unknown) => void };
    action.run(mockEd);
    expect(onCreateVariableFromSelection).toHaveBeenCalledWith('player_score');
  });

  it('calls onCreateCharacterFromSelection with selected text when the action runs', async () => {
    const onCreateCharacterFromSelection = vi.fn();
    const props = makeEditorViewProps({ onCreateCharacterFromSelection });
    const { mockEd } = await renderAndMount(props);
    (mockEd.getModel() as { getValueInRange: ReturnType<typeof vi.fn> }).getValueInRange.mockReturnValue('Captain Rex');
    (mockEd.getSelection as ReturnType<typeof vi.fn>).mockReturnValue({ isEmpty: () => false });
    const action = mockEd.addAction.mock.calls.find((c: unknown[]) => (c[0] as { id: string }).id === 'create-character-from-selection')?.[0] as { run: (ed: unknown) => void };
    action.run(mockEd);
    expect(onCreateCharacterFromSelection).toHaveBeenCalledWith('Captain Rex');
  });

  it('does not call the callback when selection is empty', async () => {
    const onCreateVariableFromSelection = vi.fn();
    const props = makeEditorViewProps({ onCreateVariableFromSelection });
    const { mockEd } = await renderAndMount(props);
    (mockEd.getSelection as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const action = mockEd.addAction.mock.calls.find((c: unknown[]) => (c[0] as { id: string }).id === 'create-variable-from-selection')?.[0] as { run: (ed: unknown) => void };
    action.run(mockEd);
    expect(onCreateVariableFromSelection).not.toHaveBeenCalled();
  });

  it('syncs renpyHasSelection context key on context menu open', async () => {
    const props = makeEditorViewProps();
    const { mockEd, mockMonaco } = await renderAndMount(props);
    const hasSelectionKey = mockEd.createContextKey.mock.results.find(
      (r: { value: unknown }, i: number) => mockEd.createContextKey.mock.calls[i][0] === 'renpyHasSelection'
    )?.value as { set: ReturnType<typeof vi.fn> };
    const contextMenuListener = mockEd.onContextMenu.mock.calls[0][0] as (e: unknown) => void;
    (mockEd.getSelection as ReturnType<typeof vi.fn>).mockReturnValue({ isEmpty: () => false });
    act(() => { contextMenuListener({ target: { position: null } }); });
    expect(hasSelectionKey.set).toHaveBeenCalledWith(true);
    void mockMonaco;
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/editorAndExplorer.test.tsx`
Expected: FAIL — `onCreateFileFromSelection` etc. missing from props type / `renpyHasSelection` never created / action ids not found.

- [ ] **Step 3: Implement the Monaco wiring**

In `src/components/EditorView.tsx`:

1. No new import is needed here: `EditorView.tsx` passes the raw selected text straight through to the callback props below — sanitization happens in the App.tsx handlers added in Tasks 3–5, not in this file.

2. Extend `EditorViewProps` (after `onWarpToLabel: (labelName: string) => void;` at line 51):

```typescript
  onWarpToLabel: (labelName: string) => void;
  onCreateFileFromSelection: (blockId: string, selectedText: string) => void;
  onCreateVariableFromSelection: (selectedText: string) => void;
  onCreateCharacterFromSelection: (selectedText: string) => void;
```

3. Add a module-level helper near the other top-level helpers (after `getIndent`, around line 77):

```typescript
function getSelectedText(ed: monaco.editor.IStandaloneCodeEditor): string {
  const selection = ed.getSelection();
  const model = ed.getModel();
  if (!selection || !model || selection.isEmpty()) return '';
  return model.getValueInRange(selection);
}
```

4. Destructure the new props in the component (after `onWarpToLabel,` at line 248):

```typescript
    onWarpToLabel,
    onCreateFileFromSelection,
    onCreateVariableFromSelection,
    onCreateCharacterFromSelection,
```

5. Add refs (after `onWarpToLabelRef` at line 285):

```typescript
  const onWarpToLabelRef = useRef(onWarpToLabel);
  const onCreateFileFromSelectionRef = useRef(onCreateFileFromSelection);
  const onCreateVariableFromSelectionRef = useRef(onCreateVariableFromSelection);
  const onCreateCharacterFromSelectionRef = useRef(onCreateCharacterFromSelection);
```

6. Sync the refs in the existing prop-sync `useEffect` (lines 294-309) — add inside the effect body (after `onWarpToLabelRef.current = onWarpToLabel;` at line 304) and to its dependency array:

```typescript
    onWarpToLabelRef.current = onWarpToLabel;
    onCreateFileFromSelectionRef.current = onCreateFileFromSelection;
    onCreateVariableFromSelectionRef.current = onCreateVariableFromSelection;
    onCreateCharacterFromSelectionRef.current = onCreateCharacterFromSelection;
    onContentChangeRef.current = onContentChange;
    userSnippetsRef.current = props.userSnippets;
    menuTemplatesRef.current = props.menuTemplates;
    onSaveMenuTemplateRef.current = props.onSaveMenuTemplate;
  }, [onDirtyChange, onTriggerSave, block, onSwitchFocusBlock, analysisResult, onEditorUnmount, onCursorPositionChange, onWarpToLabel, onCreateFileFromSelection, onCreateVariableFromSelection, onCreateCharacterFromSelection, onContentChange, props.userSnippets, props.menuTemplates, props.onSaveMenuTemplate]);
```

7. Add a ref for the new context key (after `warpLabelContextKeyRef` at line 291):

```typescript
  const warpLabelContextKeyRef = useRef<monaco.editor.IContextKey<boolean> | null>(null);
  const hasSelectionContextKeyRef = useRef<monaco.editor.IContextKey<boolean> | null>(null);
```

8. Create the context key on mount (after `warpLabelContextKeyRef.current = editor.createContextKey('renpyCanWarpHere', false);` at line 713):

```typescript
    warpLabelContextKeyRef.current = editor.createContextKey('renpyCanWarpHere', false);
    hasSelectionContextKeyRef.current = editor.createContextKey('renpyHasSelection', false);
    syncWarpContext(editor.getPosition()?.lineNumber ?? null);
```

9. Sync the context key from `onContextMenu` (replace the existing handler at lines 801-808):

```typescript
    editor.onContextMenu((e) => {
      if (e.target.position) {
        editor.setPosition(e.target.position);
        syncWarpContext(e.target.position.lineNumber);
      } else {
        syncWarpContext(null);
      }
      const selection = editor.getSelection();
      hasSelectionContextKeyRef.current?.set(!!selection && !selection.isEmpty());
    });
```

10. Register the three actions, right after the `insert-copied-code` action's closing `});` (after line 908, before `editor.onMouseDown((e) => {` at line 910):

```typescript
    editor.addAction({
        id: 'create-file-from-selection',
        label: 'New File from Selection',
        contextMenuGroupId: 'renpy',
        contextMenuOrder: 5,
        precondition: 'renpyHasSelection',
        run: (ed) => {
            const selectedText = getSelectedText(ed);
            if (!selectedText) return;
            onCreateFileFromSelectionRef.current(blockRef.current.id, selectedText);
        },
    });

    editor.addAction({
        id: 'create-variable-from-selection',
        label: 'Create Variable from Selection',
        contextMenuGroupId: 'renpy',
        contextMenuOrder: 6,
        precondition: 'renpyHasSelection',
        run: (ed) => {
            const selectedText = getSelectedText(ed);
            if (!selectedText) return;
            onCreateVariableFromSelectionRef.current(selectedText);
        },
    });

    editor.addAction({
        id: 'create-character-from-selection',
        label: 'Create Character from Selection',
        contextMenuGroupId: 'renpy',
        contextMenuOrder: 7,
        precondition: 'renpyHasSelection',
        run: (ed) => {
            const selectedText = getSelectedText(ed);
            if (!selectedText) return;
            onCreateCharacterFromSelectionRef.current(selectedText);
        },
    });
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/editorAndExplorer.test.tsx`
Expected: PASS (all EditorView tests, including the new ones)

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors. (`useTabContentRenderer.tsx`'s `<EditorView>` call will now be missing the three new required props — this is expected and fixed in Tasks 3–5. If this is the only remaining error category, proceed; do not add temporary stub props here.)

- [ ] **Step 6: Commit**

```bash
git add src/components/EditorView.tsx src/components/editorAndExplorer.test.tsx
git commit -m "feat: add renpyHasSelection context key and create-from-selection Monaco actions"
```

---

## Task 3: "New File" feature

**Files:**
- Modify: `src/hooks/useFileSystemManager.ts`
- Modify: `src/hooks/useFileSystemManager.test.ts`
- Create: `src/components/QuickCreateFileModal.tsx`
- Create: `src/components/QuickCreateFileModal.test.tsx`
- Modify: `src/hooks/useTabContentRenderer.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `sanitizeFileName` from `@/lib/editorSelectionActions` (Task 1); `EditorView`'s `onCreateFileFromSelection` prop (Task 2).
- Produces: `handleCreateNode` now returns `Promise<{ blockId: string | null; relativePath: string } | null>` instead of `Promise<void>`. `QuickCreateFileModal` component with props `{ isOpen, directoryPath, extension, initialFileName, onConfirm, onClose }`. App.tsx gains `handleCreateFileFromSelection(blockId: string, selectedText: string): Promise<void>`, passed to `useTabContentRenderer` as `onCreateFileFromSelection`.

- [ ] **Step 1: Write the failing test for `handleCreateNode`'s new return value**

Open `src/hooks/useFileSystemManager.test.ts` and find the existing test(s) around `handleCreateNode` (search for `'creates a file'` or similar — inspect the file first to match its existing mock-setup style, e.g. `window.electronAPI` mocking). Add a new test in the same `describe` block for `handleCreateNode`:

```typescript
  it('returns the new block id and relative path when creating an .rpy file', async () => {
    const addBlock = vi.fn(() => 'new-block-id');
    const { result } = renderHook(() => useFileSystemManager({
      projectRootPath: '/project',
      setFileSystemTree: vi.fn(),
      blocks: [],
      addBlock,
      deleteBlock: vi.fn(),
      clipboard: { mode: null, paths: [] },
      setClipboard: vi.fn(),
      openDeleteConfirmModal: vi.fn(),
      addToast: vi.fn(),
    }));

    const created = await act(async () => result.current.handleCreateNode('game', 'chapter_two.rpy', 'file'));

    expect(created).toEqual({ blockId: 'new-block-id', relativePath: 'game/chapter_two.rpy' });
  });

  it('returns a null blockId when creating a non-.rpy file', async () => {
    const { result } = renderHook(() => useFileSystemManager({
      projectRootPath: '/project',
      setFileSystemTree: vi.fn(),
      blocks: [],
      addBlock: vi.fn(),
      deleteBlock: vi.fn(),
      clipboard: { mode: null, paths: [] },
      setClipboard: vi.fn(),
      openDeleteConfirmModal: vi.fn(),
      addToast: vi.fn(),
    }));

    const created = await act(async () => result.current.handleCreateNode('game', 'notes.txt', 'file'));

    expect(created).toEqual({ blockId: null, relativePath: 'game/notes.txt' });
  });
```

Match these to the file's actual `window.electronAPI` mock (check how existing tests in this file stub `window.electronAPI.path.join`, `writeFile`, `loadProject` before adding these — reuse the same `beforeEach` setup already present in the file rather than re-mocking inline).

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useFileSystemManager.test.ts`
Expected: FAIL — `created` is `undefined`, not the expected object.

- [ ] **Step 3: Update `handleCreateNode` to return creation info**

In `src/hooks/useFileSystemManager.ts`, update the return type in `UseFileSystemManagerReturn` (line 70):

```typescript
export interface UseFileSystemManagerReturn {
  handleCreateNode: (parentPath: string, name: string, type: 'file' | 'folder') => Promise<{ blockId: string | null; relativePath: string } | null>;
  handleRenameNode: (oldPath: string, newName: string) => Promise<void>;
  handleDeleteNode: (paths: string[]) => void;
  handleMoveNode: (sourcePaths: string[], targetPath: string) => Promise<void>;
  handleCut: (paths: string[]) => void;
  handleCopy: (paths: string[]) => void;
  handlePaste: (targetPath: string) => Promise<void>;
}
```

Replace the `handleCreateNode` implementation (lines 87-110):

```typescript
  const handleCreateNode = useCallback(async (parentPath: string, name: string, type: 'file' | 'folder') => {
    if (!window.electronAPI || !projectRootPath) return null;
    try {
        const fullPath = await window.electronAPI.path.join(projectRootPath, parentPath, name);
        const relativePath = parentPath ? `${parentPath}/${name}` : name;
        let blockId: string | null = null;
        if (type === 'folder') {
            await window.electronAPI.createDirectory(fullPath);
        } else {
            await window.electronAPI.writeFile(fullPath, '');

            // If it's an .rpy file, create a corresponding block
            if (name.toLowerCase().endsWith('.rpy')) {
                const content = ''; // Empty content for newly created files
                blockId = addBlock(relativePath, content, undefined, { markDirty: false });
                addToast(`Created block for ${name}`, 'success');
            }
        }
        const projData = await window.electronAPI.loadProject(projectRootPath);
        setFileSystemTree(projData.tree);
        return { blockId, relativePath };
    } catch (err) {
        logger.error('Failed to create file/folder:', err);
        addToast(`Failed to create ${type}: ${name}`, 'error');
        return null;
    }
  }, [projectRootPath, addBlock, addToast, setFileSystemTree]);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useFileSystemManager.test.ts`
Expected: PASS (including all pre-existing tests in this file — the return-type change is additive and must not break callers that ignore the return value)

- [ ] **Step 5: Write the failing test for `QuickCreateFileModal`**

Create `src/components/QuickCreateFileModal.test.tsx`:

```typescript
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuickCreateFileModal from './QuickCreateFileModal';

describe('QuickCreateFileModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <QuickCreateFileModal isOpen={false} directoryPath="game" extension=".rpy" initialFileName="the_golden_sword" onConfirm={vi.fn()} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('pre-fills the filename input with initialFileName when opened', () => {
    render(
      <QuickCreateFileModal isOpen={true} directoryPath="game" extension=".rpy" initialFileName="the_golden_sword" onConfirm={vi.fn()} onClose={vi.fn()} />
    );
    const input = screen.getByLabelText(/file name/i) as HTMLInputElement;
    expect(input.value).toBe('the_golden_sword');
  });

  it('shows the target directory and extension', () => {
    render(
      <QuickCreateFileModal isOpen={true} directoryPath="game/chapters" extension=".rpy" initialFileName="foo" onConfirm={vi.fn()} onClose={vi.fn()} />
    );
    expect(screen.getByText(/game\/chapters/)).toBeTruthy();
    expect(screen.getByText('.rpy')).toBeTruthy();
  });

  it('calls onConfirm with the full filename (base + extension) on submit', () => {
    const onConfirm = vi.fn();
    render(
      <QuickCreateFileModal isOpen={true} directoryPath="game" extension=".rpy" initialFileName="the_golden_sword" onConfirm={onConfirm} onClose={vi.fn()} />
    );
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(onConfirm).toHaveBeenCalledWith('the_golden_sword.rpy');
  });

  it('allows editing the pre-filled name before confirming', () => {
    const onConfirm = vi.fn();
    render(
      <QuickCreateFileModal isOpen={true} directoryPath="game" extension=".rpy" initialFileName="the_golden_sword" onConfirm={onConfirm} onClose={vi.fn()} />
    );
    const input = screen.getByLabelText(/file name/i);
    fireEvent.change(input, { target: { value: 'renamed_file' } });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(onConfirm).toHaveBeenCalledWith('renamed_file.rpy');
  });

  it('calls onClose when Cancel is clicked', () => {
    const onClose = vi.fn();
    render(
      <QuickCreateFileModal isOpen={true} directoryPath="game" extension=".rpy" initialFileName="foo" onConfirm={vi.fn()} onClose={onClose} />
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('does not confirm with an empty filename', () => {
    const onConfirm = vi.fn();
    render(
      <QuickCreateFileModal isOpen={true} directoryPath="game" extension=".rpy" initialFileName="foo" onConfirm={onConfirm} onClose={vi.fn()} />
    );
    const input = screen.getByLabelText(/file name/i);
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/components/QuickCreateFileModal.test.tsx`
Expected: FAIL — `Cannot find module './QuickCreateFileModal'`

- [ ] **Step 7: Implement `QuickCreateFileModal`**

Create `src/components/QuickCreateFileModal.tsx` (modeled directly on `CreateBlockModal.tsx`):

```typescript
/**
 * @file QuickCreateFileModal.tsx
 * @description Lightweight modal for confirming/editing a filename generated
 * from an editor-selection "New File" context-menu action, when the sanitized
 * name differs from the raw selection or collides with an existing file.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useModalAccessibility } from '@/hooks/useModalAccessibility';

interface QuickCreateFileModalProps {
  isOpen: boolean;
  directoryPath: string;
  extension: string;
  initialFileName: string;
  onConfirm: (fileName: string) => void;
  onClose: () => void;
}

const QuickCreateFileModal: React.FC<QuickCreateFileModalProps> = ({ isOpen, directoryPath, extension, initialFileName, onConfirm, onClose }) => {
  const [baseName, setBaseName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { modalProps, contentRef } = useModalAccessibility({ isOpen, onClose, titleId: 'quick-create-file-title' });

  useEffect(() => {
    if (isOpen) {
      setBaseName(initialFileName);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialFileName]);

  const handleConfirm = () => {
    const trimmed = baseName.trim();
    if (!trimmed) return;
    onConfirm(`${trimmed}${extension}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleConfirm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div
        ref={contentRef}
        {...modalProps}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md m-4 flex flex-col border border-gray-200 dark:border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="quick-create-file-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">New File</h2>
        </header>

        <main className="p-6 space-y-4">
          <div>
            <label htmlFor="quick-create-file-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              File Name
            </label>
            <div className="flex items-center">
              <input
                ref={inputRef}
                id="quick-create-file-name"
                type="text"
                value={baseName}
                onChange={e => setBaseName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 p-2 rounded-l bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <span className="p-2 rounded-r bg-gray-100 dark:bg-gray-700 border border-l-0 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 text-sm">
                {extension}
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            Creating in: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">{directoryPath || '(project root)'}</span>
          </div>
        </main>

        <footer className="bg-gray-50 dark:bg-gray-700 p-4 rounded-b-lg flex justify-end items-center space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-sm"
          >
            Create
          </button>
        </footer>
      </div>
    </div>
  );
};

export default QuickCreateFileModal;
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run src/components/QuickCreateFileModal.test.tsx`
Expected: PASS

- [ ] **Step 9: Wire `onCreateFileFromSelection` through `useTabContentRenderer.tsx`**

In `src/hooks/useTabContentRenderer.tsx`:

1. Add to `UseTabContentRendererParams` (after `handleSaveMenuTemplate: (template: MenuTemplate) => void;` at line 193):

```typescript
  handleSaveMenuTemplate: (template: MenuTemplate) => void;
  onCreateFileFromSelection: (blockId: string, selectedText: string) => void;
  onCreateVariableFromSelection: (selectedText: string) => void;
  onCreateCharacterFromSelection: (selectedText: string) => void;
```

(Add all three now — Tasks 4 and 5 will use `onCreateVariableFromSelection`/`onCreateCharacterFromSelection`, but declaring the full trio here avoids touching this interface three times.)

2. Destructure them in the function body (after `handleSaveMenuTemplate,` at line 254):

```typescript
    setEditorCursorPosition, setEditorCursorBlockId, addToast, handleSaveMenuTemplate,
    onCreateFileFromSelection, onCreateVariableFromSelection, onCreateCharacterFromSelection,
    characterTagsArray, handleUpdateCharacter,
```

3. Pass them to `<EditorView>` (in the `tab.type === 'editor'` block, after `onWarpToLabel={handleWarpToLabel}` at line 393):

```typescript
        onWarpToLabel={handleWarpToLabel}
        onCreateFileFromSelection={onCreateFileFromSelection}
        onCreateVariableFromSelection={onCreateVariableFromSelection}
        onCreateCharacterFromSelection={onCreateCharacterFromSelection}
```

- [ ] **Step 10: Implement `handleCreateFileFromSelection` in App.tsx and render the modal**

In `src/App.tsx`:

1. Add the import (alongside other `@/lib` imports near the top of the file):

```typescript
import { sanitizeFileName } from '@/lib/editorSelectionActions';
```

2. Add new state (near other modal-state `useState` calls — place it directly above the `useFileSystemManager` call at line 1356):

```typescript
  const [quickCreateFileModal, setQuickCreateFileModal] = useState<{
    directoryPath: string;
    extension: string;
    initialFileName: string;
  } | null>(null);
```

3. After the `useFileSystemManager` destructure (after line 1362, `});`), add:

```typescript
  const handleConfirmQuickCreateFile = useCallback(async (fileName: string) => {
    if (!quickCreateFileModal) return;
    const result = await handleCreateNode(quickCreateFileModal.directoryPath, fileName, 'file');
    if (result?.blockId) {
      handleOpenEditor(result.blockId);
    }
    setQuickCreateFileModal(null);
  }, [quickCreateFileModal, handleCreateNode, handleOpenEditor]);

  const handleCreateFileFromSelection = useCallback(async (blockId: string, selectedText: string) => {
    const sourceBlock = blocksRef.current.find(b => b.id === blockId);
    if (!sourceBlock?.filePath) return;

    const lastSlash = sourceBlock.filePath.lastIndexOf('/');
    const directoryPath = lastSlash === -1 ? '' : sourceBlock.filePath.slice(0, lastSlash);
    const extensionMatch = sourceBlock.filePath.match(/\.[^./]+$/);
    const extension = extensionMatch ? extensionMatch[0] : '.rpy';

    const sanitizedBase = sanitizeFileName(selectedText);
    if (!sanitizedBase) {
      addToast('Selected text has no usable characters for a file name.', 'error');
      return;
    }

    const fileName = `${sanitizedBase}${extension}`;
    const relativePath = directoryPath ? `${directoryPath}/${fileName}` : fileName;
    const nameWasSanitized = sanitizedBase !== selectedText.trim();
    const collides = blocksRef.current.some(b => b.filePath === relativePath);

    if (!nameWasSanitized && !collides) {
      const result = await handleCreateNode(directoryPath, fileName, 'file');
      if (result?.blockId) {
        handleOpenEditor(result.blockId);
      }
      return;
    }

    setQuickCreateFileModal({ directoryPath, extension, initialFileName: sanitizedBase });
  }, [addToast, handleCreateNode, handleOpenEditor]);
```

4. Pass `handleCreateFileFromSelection` into the `useTabContentRenderer` call. This task only wires this one of the three callbacks — Tasks 4 and 5 add the other two to the same object literal. Add after `handleSaveMenuTemplate,` in the `useTabContentRenderer({...})` call (around line 1636):

```typescript
    setEditorCursorPosition, setEditorCursorBlockId, addToast, handleSaveMenuTemplate,
    onCreateFileFromSelection: handleCreateFileFromSelection,
```

5. Render the modal, right after the `<CreateBlockModal ... />` block (after line 2092):

```typescript
      <QuickCreateFileModal
        isOpen={quickCreateFileModal !== null}
        directoryPath={quickCreateFileModal?.directoryPath ?? ''}
        extension={quickCreateFileModal?.extension ?? '.rpy'}
        initialFileName={quickCreateFileModal?.initialFileName ?? ''}
        onConfirm={handleConfirmQuickCreateFile}
        onClose={() => setQuickCreateFileModal(null)}
      />
```

6. Add the import for the modal component near the other component imports (alongside the `CreateBlockModal` import):

```typescript
import QuickCreateFileModal from '@/components/QuickCreateFileModal';
```

- [ ] **Step 11: Typecheck**

Run: `npx tsc --noEmit`
Expected: No errors related to `onCreateFileFromSelection` (still missing `onCreateVariableFromSelection`/`onCreateCharacterFromSelection` on the `useTabContentRenderer` call and `<EditorView>` props — expected until Tasks 4 and 5 land; if those are the only remaining errors, proceed)

- [ ] **Step 12: Run the full test suite for touched files**

Run: `npx vitest run src/hooks/useFileSystemManager.test.ts src/components/QuickCreateFileModal.test.tsx`
Expected: PASS

- [ ] **Step 13: Commit**

```bash
git add src/hooks/useFileSystemManager.ts src/hooks/useFileSystemManager.test.ts src/components/QuickCreateFileModal.tsx src/components/QuickCreateFileModal.test.tsx src/hooks/useTabContentRenderer.tsx src/App.tsx
git commit -m "feat: add New File from selection context-menu action"
```

---

## Task 4: "Create Variable" feature

**Files:**
- Modify: `src/components/VariableManager.tsx`
- Modify: `src/components/VariableManager.test.tsx` (create if it does not already exist — check first with a file search)
- Modify: `src/components/StoryElementsPanel.tsx`
- Modify: `src/hooks/useTabContentRenderer.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `sanitizeIdentifier` from `@/lib/editorSelectionActions` (Task 1); `handleAddVariable` (existing, from `useStoryElementsPanel`); `EditorView`'s `onCreateVariableFromSelection` prop (Task 2); `onCreateVariableFromSelection` param already declared on `UseTabContentRendererParams` in Task 3, Step 9.
- Produces: `VariableManager` gains optional props `prefill?: { name: string; initialValue: string } | null` and `onPrefillConsumed?: () => void`. `StoryElementsPanel` gains optional props `pendingVariablePrefill?: { name: string; initialValue: string } | null` and `onVariablePrefillConsumed?: () => void`. App.tsx gains `handleCreateVariableFromSelection(selectedText: string): void`.

- [ ] **Step 1: Check for an existing `VariableManager.test.tsx`**

Run: `ls src/components/VariableManager.test.tsx` (or use Glob). If it exists, read it fully first and add the new tests into its existing structure/mock conventions instead of the standalone file below — adapt prop names accordingly. If it does not exist, create it fresh with the tests below.

- [ ] **Step 2: Write the failing tests**

Add to (or create) `src/components/VariableManager.test.tsx`:

```typescript
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VariableManager from './VariableManager';
import { createEmptyAnalysisResult } from '@/test/mocks/sampleData';

function baseProps(overrides = {}) {
  return {
    analysisResult: createEmptyAnalysisResult(),
    onAddVariable: vi.fn(),
    onEditVariable: vi.fn(),
    onFindUsages: vi.fn(),
    onHoverHighlightStart: vi.fn(),
    onHoverHighlightEnd: vi.fn(),
    dismissedImplicitVarHint: true,
    onDismissImplicitVarHint: vi.fn(),
    onOpenDiagnostics: vi.fn(),
    ...overrides,
  };
}

describe('VariableManager prefill', () => {
  it('switches to add mode and pre-fills the form when a prefill is provided', () => {
    render(<VariableManager {...baseProps({ prefill: { name: 'the_golden_sword', initialValue: '0' } })} />);
    expect(screen.getByDisplayValue('the_golden_sword')).toBeTruthy();
    expect(screen.getByDisplayValue('0')).toBeTruthy();
  });

  it('does not enter add mode when prefill is null', () => {
    render(<VariableManager {...baseProps({ prefill: null })} />);
    expect(screen.queryByText('Add New Variable')).toBeNull();
  });

  it('calls onAddVariable and onPrefillConsumed when the pre-filled form is saved', () => {
    const onAddVariable = vi.fn();
    const onPrefillConsumed = vi.fn();
    render(<VariableManager {...baseProps({
      prefill: { name: 'the_golden_sword', initialValue: '0' },
      onAddVariable,
      onPrefillConsumed,
    })} />);
    fireEvent.click(screen.getByRole('button', { name: /^save$/i }));
    expect(onAddVariable).toHaveBeenCalledWith({ name: 'the_golden_sword', type: 'default', initialValue: '0' });
    expect(onPrefillConsumed).toHaveBeenCalled();
  });

  it('calls onPrefillConsumed when the pre-filled form is cancelled', () => {
    const onPrefillConsumed = vi.fn();
    render(<VariableManager {...baseProps({
      prefill: { name: 'the_golden_sword', initialValue: '0' },
      onPrefillConsumed,
    })} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onPrefillConsumed).toHaveBeenCalled();
  });
});
```

Check `@/test/mocks/sampleData.ts` for the exact name of the empty-analysis-result factory before using `createEmptyAnalysisResult` — adjust the import if the actual export is named differently (e.g. `createSampleAnalysisResult()` with no variables). This was already confirmed to exist and be used by `editorAndExplorer.test.tsx` (`createEmptyAnalysisResult`), so use it as-is.

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run src/components/VariableManager.test.tsx`
Expected: FAIL — `prefill` prop unknown to `VariableManagerProps` / form not pre-filled.

- [ ] **Step 4: Implement prefill support in `VariableManager.tsx`**

In `src/components/VariableManager.tsx`:

1. Extend `VariableManagerProps` (after `onOpenDiagnostics: () => void;` at line 25):

```typescript
    onOpenDiagnostics: () => void;
    prefill?: { name: string; initialValue: string } | null;
    onPrefillConsumed?: () => void;
```

2. Extend the `VariableEditor` inner component's props and default-state logic (lines 64-73):

```typescript
const VariableEditor: React.FC<{
    onSave: (variable: Omit<Variable, 'definedInBlockId' | 'line'>) => void;
    onCancel: () => void;
    existingNames: string[];
    editing?: Variable;
    prefillName?: string;
    prefillInitialValue?: string;
}> = ({ onSave, onCancel, existingNames, editing, prefillName, prefillInitialValue }) => {
    const [name, setName] = useState(editing?.name ?? prefillName ?? '');
    // Convert implicit to default when editing (implicit vars can't be manually created)
    const [type, setType] = useState<'define' | 'default'>(editing?.type === 'implicit' ? 'default' : (editing?.type ?? 'default'));
    const [initialValue, setInitialValue] = useState(editing?.initialValue ?? prefillInitialValue ?? 'False');
    const [nameError, setNameError] = useState('');
```

3. Destructure the new top-level props in `VariableManager` (line 134):

```typescript
const VariableManager: React.FC<VariableManagerProps> = ({ analysisResult, onAddVariable, onEditVariable, onFindUsages, onHoverHighlightStart, onHoverHighlightEnd, dismissedImplicitVarHint, onDismissImplicitVarHint, onOpenDiagnostics, prefill, onPrefillConsumed }) => {
```

4. Add a `useEffect` that switches to add mode when a prefill arrives (right after the `mode`/`editingVariable`/`filterStoryVars` state declarations, around line 138):

```typescript
    const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
    const [editingVariable, setEditingVariable] = useState<Variable | null>(null);
    const [filterStoryVars, setFilterStoryVars] = useState(true);

    React.useEffect(() => {
        if (prefill) {
            setMode('add');
        }
    }, [prefill]);
```

5. Update the `'add'` mode render block (lines 344-350) to pass prefill values and consume on save/cancel:

```typescript
            {mode === 'add' && (
                <VariableEditor
                    onSave={(variable) => { handleSave(variable); onPrefillConsumed?.(); }}
                    onCancel={() => { setMode('list'); onPrefillConsumed?.(); }}
                    existingNames={Array.from(variables.keys())}
                    prefillName={prefill?.name}
                    prefillInitialValue={prefill?.initialValue}
                />
            )}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/components/VariableManager.test.tsx`
Expected: PASS

- [ ] **Step 6: Thread the prefill through `StoryElementsPanel.tsx`**

In `src/components/StoryElementsPanel.tsx`:

1. Extend `StoryElementsPanelProps` (after `onFindVariableUsages: (variableName: string) => void;` at line 93):

```typescript
    onFindVariableUsages: (variableName: string) => void;
    pendingVariablePrefill?: { name: string; initialValue: string } | null;
    onVariablePrefillConsumed?: () => void;
```

2. Destructure them in the component (after `onAddVariable, onEditVariable, onFindVariableUsages,` at line 168):

```typescript
    onAddVariable, onEditVariable, onFindVariableUsages,
    pendingVariablePrefill, onVariablePrefillConsumed,
```

3. Add a `useEffect` that switches the sidebar to the Variables sub-tab when a prefill arrives (after the existing `activeSubTab` persistence effect, lines 189-194):

```typescript
    useEffect(() => {
        onUpdateProjectSettings(draft => {
            if (!draft.storyElementsTabState) draft.storyElementsTabState = {} as typeof draft.storyElementsTabState;
            draft.storyElementsTabState.activeSubTab = activeSubTab;
        });
    }, [activeSubTab, onUpdateProjectSettings]);

    useEffect(() => {
        if (pendingVariablePrefill) {
            setActiveSubTab('variables');
        }
    }, [pendingVariablePrefill]);
```

4. Pass the prefill props to `<VariableManager>` (lines 291-301):

```typescript
                        <VariableManager
                            analysisResult={analysisResult}
                            onAddVariable={onAddVariable}
                            onEditVariable={onEditVariable}
                            onFindUsages={onFindVariableUsages}
                            onHoverHighlightStart={onHoverHighlightStart}
                            onHoverHighlightEnd={onHoverHighlightEnd}
                            dismissedImplicitVarHint={dismissedImplicitVarHint}
                            onDismissImplicitVarHint={onDismissImplicitVarHint}
                            onOpenDiagnostics={onOpenDiagnostics}
                            prefill={pendingVariablePrefill}
                            onPrefillConsumed={onVariablePrefillConsumed}
                        />
```

- [ ] **Step 7: Implement `handleCreateVariableFromSelection` in App.tsx**

In `src/App.tsx`:

1. Extend the `sanitizeFileName` import from Task 3 to also import `sanitizeIdentifier`:

```typescript
import { sanitizeFileName, sanitizeIdentifier } from '@/lib/editorSelectionActions';
```

2. Add new state (near `quickCreateFileModal` from Task 3):

```typescript
  const [pendingVariablePrefill, setPendingVariablePrefill] = useState<{ name: string; initialValue: string } | null>(null);
```

3. Add the handler, after `handleCreateFileFromSelection` (Task 3, Step 10):

```typescript
  const handleCreateVariableFromSelection = useCallback((selectedText: string) => {
    const sanitized = sanitizeIdentifier(selectedText, true);
    if (!sanitized) {
      addToast('Selected text has no usable characters for a variable name.', 'error');
      return;
    }
    const nameWasSanitized = sanitized !== selectedText.trim();
    const collides = analysisResult.variables.has(sanitized);

    if (!nameWasSanitized && !collides) {
      handleAddVariable({ name: sanitized, initialValue: '0' });
      return;
    }

    updateAppSettings(draft => { draft.isRightSidebarOpen = true; });
    setPendingVariablePrefill({ name: sanitized, initialValue: '0' });
  }, [addToast, analysisResult.variables, handleAddVariable, updateAppSettings]);
```

4. Add `onCreateVariableFromSelection: handleCreateVariableFromSelection,` to the `useTabContentRenderer({...})` call, next to `onCreateFileFromSelection: handleCreateFileFromSelection,` (added in Task 3, Step 10.4):

```typescript
    onCreateFileFromSelection: handleCreateFileFromSelection,
    onCreateVariableFromSelection: handleCreateVariableFromSelection,
```

5. Pass the new props to `<StoryElementsPanel>` (after `onFindVariableUsages={(name) => handleFindUsages(name, 'variable')}` at line 1977):

```typescript
                onFindVariableUsages={(name) => handleFindUsages(name, 'variable')}
                pendingVariablePrefill={pendingVariablePrefill}
                onVariablePrefillConsumed={() => setPendingVariablePrefill(null)}
```

- [ ] **Step 8: Typecheck**

Run: `npx tsc --noEmit`
Expected: No errors related to variable-prefill wiring (still missing `onCreateCharacterFromSelection` on `<EditorView>` — expected until Task 5)

- [ ] **Step 9: Run the full test suite for touched files**

Run: `npx vitest run src/components/VariableManager.test.tsx src/components/StoryElementsPanel.test.tsx`

(If `StoryElementsPanel.test.tsx` does not exist, skip it — do not create a new test file for it in this task; the sub-tab-switch effect is exercised indirectly via `VariableManager`'s tests plus manual verification in Task 5's final integration check.)

Expected: PASS

- [ ] **Step 10: Commit**

```bash
git add src/components/VariableManager.tsx src/components/VariableManager.test.tsx src/components/StoryElementsPanel.tsx src/hooks/useTabContentRenderer.tsx src/App.tsx
git commit -m "feat: add Create Variable from selection context-menu action"
```

---

## Task 5: "Create Character" feature

**Files:**
- Modify: `src/types.ts`
- Modify: `src/hooks/useCharacterManagement.ts`
- Modify: `src/hooks/useCharacterManagement.test.ts` (create if it does not already exist — check first)
- Modify: `src/components/CharacterEditorView.tsx`
- Modify: `src/components/CharacterEditorView.test.tsx` (create if it does not already exist — check first)
- Modify: `src/hooks/useTabContentRenderer.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `sanitizeIdentifier` from `@/lib/editorSelectionActions` (Task 1); `handleOpenCharacterEditor` (existing, extended below); `EditorView`'s `onCreateCharacterFromSelection` prop (Task 2); `onCreateCharacterFromSelection` param already declared on `UseTabContentRendererParams` in Task 3, Step 9.
- Produces: `EditorTab` gains optional `initialCharacterTag?: string` and `initialCharacterName?: string`. `handleOpenCharacterEditor` signature becomes `(tag: string, prefill?: { initialTag: string; initialName: string }) => void`. `CharacterEditorView` gains optional props `initialTag?: string` and `initialName?: string`. App.tsx gains `handleCreateCharacterFromSelection(selectedText: string): void`.

- [ ] **Step 1: Add the new `EditorTab` fields**

In `src/types.ts`, update the `EditorTab` interface (lines 643-652):

```typescript
export interface EditorTab {
  id: string;
  type: 'canvas' | 'route-canvas' | 'choice-canvas' | 'punchlist' | 'diagnostics' | 'editor' | 'image' | 'audio' | 'character' | 'scene-composer' | 'imagemap-composer' | 'screen-preview' | 'stats' | 'markdown' | 'translations';
  blockId?: string;
  filePath?: string;
  characterTag?: string;
  initialCharacterTag?: string;
  initialCharacterName?: string;
  sceneId?: string;
  imagemapId?: string;
  scrollRequest?: { line: number; key: number };
}
```

Also update the JSDoc block directly above it (lines 632-642) to add:

```
 * @property {string} [characterTag] - Character tag for character editor tabs
 * @property {string} [initialCharacterTag] - Pre-filled tag for a new character tab opened from an editor selection
 * @property {string} [initialCharacterName] - Pre-filled display name for a new character tab opened from an editor selection
```

- [ ] **Step 2: Check for existing `useCharacterManagement.test.ts`**

Run: `ls src/hooks/useCharacterManagement.test.ts` (or Glob). If found, read it fully and add the tests below into its existing structure. If not found, create it fresh.

- [ ] **Step 3: Write the failing test for `handleOpenCharacterEditor` prefill**

Add to (or create) `src/hooks/useCharacterManagement.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCharacterManagement } from './useCharacterManagement';
import { createEmptyAnalysisResult } from '@/test/mocks/sampleData';

function baseParams(overrides = {}) {
  return {
    blocks: [],
    analysisResult: createEmptyAnalysisResult(),
    projectRootPath: null,
    updateBlock: vi.fn(),
    addBlock: vi.fn(),
    setFileSystemTree: vi.fn(),
    setCharacterProfiles: vi.fn(),
    setHasUnsavedSettings: vi.fn(),
    addToast: vi.fn(),
    pendingTagRenameRef: { current: null },
    openTabs: [],
    secondaryOpenTabs: [],
    activePaneId: 'primary' as const,
    splitLayout: 'none' as const,
    setOpenTabs: vi.fn(),
    setActiveTabId: vi.fn(),
    setSecondaryOpenTabs: vi.fn(),
    setSecondaryActiveTabId: vi.fn(),
    setActivePaneId: vi.fn(),
    ...overrides,
  };
}

describe('handleOpenCharacterEditor prefill', () => {
  it('opens a new tab with no prefill fields when called without a prefill argument', () => {
    const setOpenTabs = vi.fn();
    const { result } = renderHook(() => useCharacterManagement(baseParams({ setOpenTabs })));
    act(() => { result.current.handleOpenCharacterEditor('new_character'); });
    const updater = setOpenTabs.mock.calls[0][0] as (prev: unknown[]) => unknown[];
    const tabs = updater([]);
    expect(tabs[0]).toEqual({ id: 'char-new_character', type: 'character', characterTag: 'new_character' });
  });

  it('opens a new tab with initialCharacterTag/initialCharacterName when a prefill is given', () => {
    const setOpenTabs = vi.fn();
    const { result } = renderHook(() => useCharacterManagement(baseParams({ setOpenTabs })));
    act(() => {
      result.current.handleOpenCharacterEditor('captain_rex', { initialTag: 'captain_rex', initialName: 'Captain Rex' });
    });
    const updater = setOpenTabs.mock.calls[0][0] as (prev: unknown[]) => unknown[];
    const tabs = updater([]);
    expect(tabs[0]).toEqual({
      id: 'char-captain_rex',
      type: 'character',
      characterTag: 'captain_rex',
      initialCharacterTag: 'captain_rex',
      initialCharacterName: 'Captain Rex',
    });
  });
});
```

- [ ] **Step 4: Run tests to verify they fail**

Run: `npx vitest run src/hooks/useCharacterManagement.test.ts`
Expected: FAIL — `handleOpenCharacterEditor` doesn't accept a second argument, tab shape doesn't include the new fields.

- [ ] **Step 5: Extend `handleOpenCharacterEditor`**

In `src/hooks/useCharacterManagement.ts`:

1. Update `UseCharacterManagementReturn` (line 31):

```typescript
export interface UseCharacterManagementReturn {
  handleOpenCharacterEditor: (tag: string, prefill?: { initialTag: string; initialName: string }) => void;
  handleUpdateCharacter: (char: Character, oldTag?: string) => Promise<void>;
}
```

2. Update the implementation (lines 57-69):

```typescript
  const handleOpenCharacterEditor = useCallback((tag: string, prefill?: { initialTag: string; initialName: string }) => {
    const tabId = `char-${tag}`;
    if (openTabs.find(t => t.id === tabId)) { setActiveTabId(tabId); setActivePaneId('primary'); return; }
    if (secondaryOpenTabs.find(t => t.id === tabId)) { setSecondaryActiveTabId(tabId); setActivePaneId('secondary'); return; }
    const newTab: EditorTab = {
      id: tabId,
      type: 'character',
      characterTag: tag,
      ...(prefill && { initialCharacterTag: prefill.initialTag, initialCharacterName: prefill.initialName }),
    };
    if (activePaneId === 'secondary' && splitLayout !== 'none') {
      setSecondaryOpenTabs(prev => [...prev, newTab]);
      setSecondaryActiveTabId(tabId);
    } else {
      setOpenTabs(prev => [...prev, newTab]);
      setActiveTabId(tabId);
    }
  }, [openTabs, secondaryOpenTabs, activePaneId, splitLayout, setActivePaneId, setActiveTabId, setOpenTabs, setSecondaryActiveTabId, setSecondaryOpenTabs]);
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/hooks/useCharacterManagement.test.ts`
Expected: PASS

- [ ] **Step 7: Check for existing `CharacterEditorView.test.tsx`**

Run: `ls src/components/CharacterEditorView.test.tsx` (or Glob). If found, read it fully and add the tests below into its existing structure/mock conventions (match its existing `baseProps`-style helper). If not found, create it fresh — first read `CharacterEditorView.tsx` in full to confirm required props (`character?`, `onSave`, `existingTags`, `projectImages`, `imageMetadata`) for a minimal harness.

- [ ] **Step 8: Write the failing test for prefill rendering**

Add to (or create) `src/components/CharacterEditorView.test.tsx`:

```typescript
  it('pre-fills tag and name from initialTag/initialName when character is undefined', () => {
    render(
      <CharacterEditorView
        character={undefined}
        onSave={vi.fn()}
        existingTags={[]}
        projectImages={[]}
        imageMetadata={new Map()}
        initialTag="captain_rex"
        initialName="Captain Rex"
      />
    );
    expect((screen.getByLabelText(/tag/i) as HTMLInputElement).value).toBe('captain_rex');
    expect((screen.getByLabelText(/^name/i) as HTMLInputElement).value).toBe('Captain Rex');
  });

  it('leaves tag/name blank when neither character nor initial props are given (existing + Add flow)', () => {
    render(
      <CharacterEditorView
        character={undefined}
        onSave={vi.fn()}
        existingTags={[]}
        projectImages={[]}
        imageMetadata={new Map()}
      />
    );
    expect((screen.getByLabelText(/tag/i) as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText(/^name/i) as HTMLInputElement).value).toBe('');
  });
```

If this is a new test file, wrap these in the necessary imports/`describe` block, matching the conventions already established in `editorAndExplorer.test.tsx` (React import, `vi`/`describe`/`it`/`expect` from vitest, `render`/`screen` from `@testing-library/react`). Check the actual `<label>`/`htmlFor` text used for the tag and name fields in `CharacterEditorView.tsx` before finalizing the `getByLabelText` regexes — adjust to match exactly.

- [ ] **Step 9: Run tests to verify they fail**

Run: `npx vitest run src/components/CharacterEditorView.test.tsx`
Expected: FAIL — `initialTag`/`initialName` not recognized, fields render empty.

- [ ] **Step 10: Add `initialTag`/`initialName` support to `CharacterEditorView.tsx`**

In `src/components/CharacterEditorView.tsx`:

1. Extend the props interface (lines 12-18):

```typescript
interface CharacterEditorViewProps {
  character?: Character;
  onSave: (char: Character, oldTag?: string) => void;
  existingTags: string[];
  projectImages: ProjectImage[];
  imageMetadata: Map<string, ImageMetadata>;
  initialTag?: string;
  initialName?: string;
}
```

2. Update the component's prop destructure and initial `tag`/`name` state (find the component's function signature and lines 28-29 shown earlier):

```typescript
    const [tag, setTag] = useState(character?.tag || initialTag || '');
    const [name, setName] = useState(character?.name || initialName || '');
```

(Add `initialTag, initialName` to whatever destructure pattern the component uses for its props — read the component's opening lines first to match its existing style, e.g. `const CharacterEditorView: React.FC<CharacterEditorViewProps> = ({ character, onSave, existingTags, projectImages, imageMetadata, initialTag, initialName }) => {`.)

- [ ] **Step 11: Run tests to verify they pass**

Run: `npx vitest run src/components/CharacterEditorView.test.tsx`
Expected: PASS

- [ ] **Step 12: Wire `initialTag`/`initialName` through `useTabContentRenderer.tsx`**

In `src/hooks/useTabContentRenderer.tsx`, update the character-tab render block (lines 416-431):

```typescript
    if (tab.type === 'character' && tab.characterTag) {
      // Primary lookup by the tab's characterTag.  During the one-render window between
      // analysis losing the old tag and the deferred useEffect flipping the tab ID, fall
      // back to the pending-rename's new tag so the form never flashes "New Character".
      let char = analysisResultWithProfiles.characters.get(tab.characterTag);
      if (!char) {
        const pending = pendingTagRenameRef.current;
        if (pending?.oldTag === tab.characterTag) {
          char = analysisResultWithProfiles.characters.get(pending.newTag);
        }
      }
      return <CharacterEditorView character={char} onSave={handleUpdateCharacter}
        existingTags={characterTagsArray}
        projectImages={imagesArray} imageMetadata={imageMetadata}
        initialTag={char ? undefined : tab.initialCharacterTag}
        initialName={char ? undefined : tab.initialCharacterName}
      />;
    }
```

- [ ] **Step 13: Implement `handleCreateCharacterFromSelection` in App.tsx**

In `src/App.tsx`:

1. `sanitizeIdentifier` is already imported from Task 4, Step 7.1 — no new import needed.

2. Add the handler, after `handleCreateVariableFromSelection` (Task 4, Step 7):

```typescript
  const handleCreateCharacterFromSelection = useCallback((selectedText: string) => {
    const rawName = selectedText.trim();
    if (!rawName) return;
    const sanitizedTag = sanitizeIdentifier(rawName);
    handleOpenCharacterEditor(sanitizedTag, { initialTag: sanitizedTag, initialName: rawName });
  }, [handleOpenCharacterEditor]);
```

3. Add `onCreateCharacterFromSelection: handleCreateCharacterFromSelection,` to the `useTabContentRenderer({...})` call, next to the other two `onCreate*FromSelection` entries (added in Tasks 3 and 4):

```typescript
    onCreateFileFromSelection: handleCreateFileFromSelection,
    onCreateVariableFromSelection: handleCreateVariableFromSelection,
    onCreateCharacterFromSelection: handleCreateCharacterFromSelection,
```

- [ ] **Step 14: Typecheck the whole project**

Run: `npx tsc --noEmit`
Expected: No errors. This is the first point where all three `onCreate*FromSelection` props are fully wired end-to-end (App.tsx → useTabContentRenderer → EditorView), so this must be clean.

- [ ] **Step 15: Run the full test suite**

Run: `npx vitest run`
Expected: PASS (all tests, including every file touched across Tasks 1-5)

- [ ] **Step 16: Manual verification in the running app**

Run: `npm run electron:start`

In the running app: open any `.rpy` file in an editor tab, select some text (e.g. a multi-word phrase with a space), right-click, and verify:
- "New File from Selection", "Create Variable from Selection", "Create Character from Selection" all appear, enabled.
- With no selection (click without dragging), right-click again and verify the three items appear greyed out.
- Trigger "New File from Selection" with a space-containing selection → `QuickCreateFileModal` opens pre-filled; confirm creates the file and opens it in a new tab.
- Trigger "Create Variable from Selection" with an already-valid identifier not already in use → variable is added directly (check the Variables panel), no dialog shown.
- Trigger "Create Variable from Selection" with a space-containing selection → right sidebar opens to the Variables tab, "Add New Variable" form pre-filled.
- Trigger "Create Character from Selection" → a new Character Editor tab opens with the tag and display name fields pre-filled from the selection.

- [ ] **Step 17: Commit**

```bash
git add src/types.ts src/hooks/useCharacterManagement.ts src/hooks/useCharacterManagement.test.ts src/components/CharacterEditorView.tsx src/components/CharacterEditorView.test.tsx src/hooks/useTabContentRenderer.tsx src/App.tsx
git commit -m "feat: add Create Character from selection context-menu action"
```

---

## Post-implementation: close the beads

After all five tasks are committed and the manual verification in Task 5 Step 16 passes:

```bash
bd close bmf-vangard-renpy-ide-d1zl bmf-vangard-renpy-ide-a512 bmf-vangard-renpy-ide-zcoh --reason="Implemented per docs/superpowers/plans/2026-07-29-editor-selection-context-menu.md"
```

Then follow the CLAUDE.md Session Completion protocol: run the full test suite once more, `git pull --rebase`, `git push`, and verify `git status` shows up to date with origin.
