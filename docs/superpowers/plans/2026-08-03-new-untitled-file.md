# File Menu: New Untitled File Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "New File" item to the File menu that opens a blank "Untitled-N" editor tab; saving it (Ctrl+S) prompts a native save dialog and converts it into a normal, tracked project file.

**Architecture:** A new hook, `useUntitledFiles`, owns a `Map<tabId, { title, content, isDirty }>` completely separate from `blocks[]`, so an unsaved scratch file never appears on the Project canvas or in analysis/diagnostics before it's saved. A new `EditorTab.type === 'untitled'` branch in `useTabContentRenderer.tsx` renders the existing `EditorView` component against a synthetic in-memory `Block` built from that map — no changes to `EditorView.tsx` itself are needed, since it already falls back gracefully when `block.filePath` is `undefined` (`Breadcrumbs` renders nothing; the Monaco `path` prop falls back to `block.id`). Saving opens `showSaveDialog`, writes the file, then calls the existing `addBlock()` to register it as a real block and swaps the tab from `'untitled'` to `'editor'` in place.

**Tech Stack:** React 18 + TypeScript, Electron IPC (`showSaveDialog`, `writeFile`, `loadProject` — all already exposed via `preload.js`), Vitest + `@testing-library/react` for hook tests.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-03-new-untitled-file-design.md`.
- Untitled tabs are **not** included in `Save All`, "Close Others/All", or the app-quit unsaved-changes prompt — those all key off `dirtyBlockIds`/`dirtyEditors`, which are tied to real `blocks[]`. An untitled tab is protected only by its own explicit Ctrl+S. This is an explicit, approved scope cut (see spec's Non-Goals) — do not attempt to wire untitled tabs into those paths.
- The save dialog defaults into `<projectRoot>/game`, offers `.rpy` and "All Files" filters, and does **not** force an extension onto whatever the user types (per approved brainstorming decision).
- The File menu's "New File" item is enabled only when a project is open (`projectRootPath !== null`), matching the existing Explorer-scoped item's enablement pattern.
- The existing Explorer-scoped "New File" menu item (`id: 'explorer-new-file'`) is relabeled `"New File in Folder"` — its command, behavior, and enablement are otherwise unchanged. This avoids two menu items both reading "New File".
- Use the `@/` import alias everywhere (no relative `../` imports), per CLAUDE.md.
- `useImmer` is not needed here — all new state is a plain `useState<Map<...>>`, matching the pattern of other non-persisted session-only tab state in `App.tsx` (per CLAUDE.md's state table).

---

### Task 1: `useUntitledFiles` hook — creation, content/dirty tracking, and the relative-path helper

**Files:**
- Modify: `src/types.ts` — `EditorTab` interface (`src/types.ts:645-656`): add `'untitled'` to the `type` union, add `title?: string` field.
- Create: `src/hooks/useUntitledFiles.ts`
- Test: `src/hooks/useUntitledFiles.test.ts`

**Interfaces:**
- Consumes: `Block`, `EditorTab`, `FileSystemTreeNode`, `Position` from `@/types`; `addBlock: (filePath: string, content: string, initialPosition?: Position, options?: { markDirty?: boolean }) => string` (existing, from `src/hooks/useBlockManagement.ts:114`); `window.electronAPI.showSaveDialog`, `window.electronAPI.writeFile`, `window.electronAPI.loadProject` (existing, `src/types.ts:1373-1417`).
- Produces (used by Task 2 and Task 4):
  - `export interface UntitledFileState { title: string; content: string; isDirty: boolean; }`
  - `export function toProjectRelativePath(absolutePath: string, projectRoot: string): string`
  - `export interface UseUntitledFilesProps { ... }` (full shape below)
  - `export interface UseUntitledFilesReturn { untitledFiles: Map<string, UntitledFileState>; createUntitledFile: () => void; updateUntitledContent: (tabId: string, content: string) => void; setUntitledDirty: (tabId: string, isDirty: boolean) => void; saveUntitledFile: (tabId: string) => Promise<void>; }`
  - `export function useUntitledFiles(props: UseUntitledFilesProps): UseUntitledFilesReturn`

- [ ] **Step 1: Extend `EditorTab` in `src/types.ts`**

Find (`src/types.ts:645-656`):

```ts
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

Replace with:

```ts
export interface EditorTab {
  id: string;
  type: 'canvas' | 'route-canvas' | 'choice-canvas' | 'punchlist' | 'diagnostics' | 'editor' | 'image' | 'audio' | 'character' | 'scene-composer' | 'imagemap-composer' | 'screen-preview' | 'stats' | 'markdown' | 'translations' | 'untitled';
  blockId?: string;
  filePath?: string;
  characterTag?: string;
  initialCharacterTag?: string;
  initialCharacterName?: string;
  sceneId?: string;
  imagemapId?: string;
  scrollRequest?: { line: number; key: number };
  /** Display title for tab types that don't derive one from `blocks[]` or a file path — currently only 'untitled'. */
  title?: string;
}
```

- [ ] **Step 2: Write the failing test file `src/hooks/useUntitledFiles.test.ts`**

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUntitledFiles, toProjectRelativePath } from '@/hooks/useUntitledFiles';
import type { UseUntitledFilesProps } from '@/hooks/useUntitledFiles';
import { createMockElectronAPI, installElectronAPI, uninstallElectronAPI } from '@/test/mocks/electronAPI';
import type { EditorTab } from '@/types';

function makeProps(overrides: Partial<UseUntitledFilesProps> = {}): UseUntitledFilesProps {
  return {
    projectRootPath: '/project',
    addBlock: vi.fn().mockReturnValue('block-new'),
    setFileSystemTree: vi.fn(),
    addToast: vi.fn(),
    activePaneId: 'primary',
    splitLayout: 'none',
    setOpenTabs: vi.fn(),
    setActiveTabId: vi.fn(),
    setSecondaryOpenTabs: vi.fn(),
    setSecondaryActiveTabId: vi.fn(),
    ...overrides,
  };
}

describe('toProjectRelativePath', () => {
  it('strips the project root prefix', () => {
    expect(toProjectRelativePath('/project/game/script.rpy', '/project')).toBe('game/script.rpy');
  });

  it('normalizes backslashes (Windows paths)', () => {
    expect(toProjectRelativePath('C:\\project\\game\\script.rpy', 'C:\\project')).toBe('game/script.rpy');
  });

  it('is case-insensitive on the root prefix match', () => {
    expect(toProjectRelativePath('C:\\Project\\game\\script.rpy', 'c:\\project')).toBe('game/script.rpy');
  });

  it('returns an empty string when the path equals the root', () => {
    expect(toProjectRelativePath('/project', '/project')).toBe('');
  });
});

describe('useUntitledFiles — createUntitledFile', () => {
  it('does nothing and toasts a warning when no project is open', () => {
    const addToast = vi.fn();
    const setOpenTabs = vi.fn();
    const { result } = renderHook(() => useUntitledFiles(makeProps({ projectRootPath: null, addToast, setOpenTabs })));
    act(() => result.current.createUntitledFile());
    expect(setOpenTabs).not.toHaveBeenCalled();
    expect(addToast).toHaveBeenCalledWith(expect.stringContaining('project'), 'warning');
  });

  it('opens a new primary tab titled Untitled-1 with empty content', () => {
    const setOpenTabs = vi.fn();
    const setActiveTabId = vi.fn();
    const { result } = renderHook(() => useUntitledFiles(makeProps({ setOpenTabs, setActiveTabId })));
    act(() => result.current.createUntitledFile());

    const updater = setOpenTabs.mock.calls[0][0] as (prev: EditorTab[]) => EditorTab[];
    const tabs = updater([]);
    expect(tabs[0].type).toBe('untitled');
    expect(tabs[0].title).toBe('Untitled-1');
    expect(setActiveTabId).toHaveBeenCalledWith(tabs[0].id);
    expect(result.current.untitledFiles.get(tabs[0].id)).toEqual({ title: 'Untitled-1', content: '', isDirty: false });
  });

  it('increments the title on each call', () => {
    const setOpenTabs = vi.fn();
    const { result } = renderHook(() => useUntitledFiles(makeProps({ setOpenTabs })));
    act(() => result.current.createUntitledFile());
    act(() => result.current.createUntitledFile());
    const firstTabs = (setOpenTabs.mock.calls[0][0] as (prev: EditorTab[]) => EditorTab[])([]);
    const secondTabs = (setOpenTabs.mock.calls[1][0] as (prev: EditorTab[]) => EditorTab[])(firstTabs);
    expect(firstTabs[0].title).toBe('Untitled-1');
    expect(secondTabs[1].title).toBe('Untitled-2');
  });

  it('opens in the secondary pane when active pane is secondary and split layout is set', () => {
    const setSecondaryOpenTabs = vi.fn();
    const setSecondaryActiveTabId = vi.fn();
    const { result } = renderHook(() =>
      useUntitledFiles(makeProps({ activePaneId: 'secondary', splitLayout: 'right', setSecondaryOpenTabs, setSecondaryActiveTabId }))
    );
    act(() => result.current.createUntitledFile());
    expect(setSecondaryOpenTabs).toHaveBeenCalled();
    expect(setSecondaryActiveTabId).toHaveBeenCalled();
  });
});

describe('useUntitledFiles — updateUntitledContent / setUntitledDirty', () => {
  it('updates content without touching isDirty', () => {
    const setOpenTabs = vi.fn();
    const { result } = renderHook(() => useUntitledFiles(makeProps({ setOpenTabs })));
    act(() => result.current.createUntitledFile());
    const tabId = [...result.current.untitledFiles.keys()][0];

    act(() => result.current.updateUntitledContent(tabId, 'label start:\n'));
    expect(result.current.untitledFiles.get(tabId)).toEqual({ title: 'Untitled-1', content: 'label start:\n', isDirty: false });
  });

  it('sets isDirty independently of content', () => {
    const { result } = renderHook(() => useUntitledFiles(makeProps()));
    act(() => result.current.createUntitledFile());
    const tabId = [...result.current.untitledFiles.keys()][0];

    act(() => result.current.setUntitledDirty(tabId, true));
    expect(result.current.untitledFiles.get(tabId)?.isDirty).toBe(true);

    act(() => result.current.setUntitledDirty(tabId, false));
    expect(result.current.untitledFiles.get(tabId)?.isDirty).toBe(false);
  });
});

describe('useUntitledFiles — saveUntitledFile', () => {
  let api: ReturnType<typeof createMockElectronAPI>;

  beforeEach(() => {
    api = createMockElectronAPI();
    installElectronAPI(api);
  });

  afterEach(() => {
    uninstallElectronAPI();
  });

  it('does nothing when the save dialog is canceled', async () => {
    api.showSaveDialog.mockResolvedValue(null);
    const addBlock = vi.fn();
    const { result } = renderHook(() => useUntitledFiles(makeProps({ addBlock })));
    act(() => result.current.createUntitledFile());
    const tabId = [...result.current.untitledFiles.keys()][0];

    await act(async () => { await result.current.saveUntitledFile(tabId); });
    expect(addBlock).not.toHaveBeenCalled();
    expect(result.current.untitledFiles.has(tabId)).toBe(true);
  });

  it('toasts an error and keeps the tab open when the write fails', async () => {
    api.showSaveDialog.mockResolvedValue('/project/game/newfile.rpy');
    api.writeFile.mockResolvedValue({ success: false, error: 'disk full' });
    const addToast = vi.fn();
    const addBlock = vi.fn();
    const { result } = renderHook(() => useUntitledFiles(makeProps({ addToast, addBlock })));
    act(() => result.current.createUntitledFile());
    const tabId = [...result.current.untitledFiles.keys()][0];

    await act(async () => { await result.current.saveUntitledFile(tabId); });
    expect(addBlock).not.toHaveBeenCalled();
    expect(addToast).toHaveBeenCalledWith(expect.stringContaining('disk full'), 'error');
    expect(result.current.untitledFiles.has(tabId)).toBe(true);
  });

  it('writes the file, registers a real block, swaps the tab, and drops the draft on success', async () => {
    api.showSaveDialog.mockResolvedValue('/project/game/newfile.rpy');
    api.writeFile.mockResolvedValue({ success: true });
    api.loadProject.mockResolvedValue({
      blocks: [], settings: {}, tree: { name: 'root', path: '/project', children: [] },
    } as unknown as Awaited<ReturnType<typeof api.loadProject>>);
    const addBlock = vi.fn().mockReturnValue('block-new');
    const setOpenTabs = vi.fn();
    const setActiveTabId = vi.fn();
    const setFileSystemTree = vi.fn();
    const addToast = vi.fn();
    const { result } = renderHook(() =>
      useUntitledFiles(makeProps({ addBlock, setOpenTabs, setActiveTabId, setFileSystemTree, addToast }))
    );
    act(() => result.current.createUntitledFile());
    const tabId = [...result.current.untitledFiles.keys()][0];
    act(() => result.current.updateUntitledContent(tabId, 'label start:\n    return\n'));

    await act(async () => { await result.current.saveUntitledFile(tabId); });

    expect(addBlock).toHaveBeenCalledWith('game/newfile.rpy', 'label start:\n    return\n', undefined, { markDirty: false });
    const tabsUpdater = setOpenTabs.mock.calls[setOpenTabs.mock.calls.length - 1][0] as (prev: EditorTab[]) => EditorTab[];
    const swapped = tabsUpdater([{ id: tabId, type: 'untitled', title: 'Untitled-1' }]);
    expect(swapped[0]).toEqual({ id: 'block-new', type: 'editor', blockId: 'block-new' });
    expect(setActiveTabId).toHaveBeenCalled();
    expect(setFileSystemTree).toHaveBeenCalled();
    expect(addToast).toHaveBeenCalledWith(expect.stringContaining('Saved'), 'success');
    expect(result.current.untitledFiles.has(tabId)).toBe(false);
  });
});
```

- [ ] **Step 3: Run the test file to verify it fails**

Run: `npx vitest run src/hooks/useUntitledFiles.test.ts`
Expected: FAIL — `Cannot find module '@/hooks/useUntitledFiles'` (file doesn't exist yet).

- [ ] **Step 4: Create `src/hooks/useUntitledFiles.ts`**

```ts
import { useCallback, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Block, EditorTab, FileSystemTreeNode, Position } from '@/types';

export interface UntitledFileState {
  title: string;
  content: string;
  isDirty: boolean;
}

export interface UseUntitledFilesProps {
  projectRootPath: string | null;
  addBlock: (filePath: string, content: string, initialPosition?: Position, options?: { markDirty?: boolean }) => string;
  setFileSystemTree: Dispatch<SetStateAction<FileSystemTreeNode | null>>;
  addToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  activePaneId: 'primary' | 'secondary';
  splitLayout: 'none' | 'right' | 'bottom';
  setOpenTabs: Dispatch<SetStateAction<EditorTab[]>>;
  setActiveTabId: Dispatch<SetStateAction<string>>;
  setSecondaryOpenTabs: Dispatch<SetStateAction<EditorTab[]>>;
  setSecondaryActiveTabId: Dispatch<SetStateAction<string>>;
}

export interface UseUntitledFilesReturn {
  untitledFiles: Map<string, UntitledFileState>;
  createUntitledFile: () => void;
  updateUntitledContent: (tabId: string, content: string) => void;
  setUntitledDirty: (tabId: string, isDirty: boolean) => void;
  saveUntitledFile: (tabId: string) => Promise<void>;
}

/**
 * Converts an absolute path chosen via a native save dialog into a path
 * relative to the project root (e.g. "game/script.rpy"), matching the
 * format Block.filePath uses elsewhere. Only ever called with a path the
 * backend's fs:writeFile guard already accepted, so it's always inside root.
 */
export function toProjectRelativePath(absolutePath: string, projectRoot: string): string {
  const normalize = (p: string) => p.replace(/\\/g, '/').replace(/\/+$/, '');
  const root = normalize(projectRoot);
  const abs = normalize(absolutePath);
  if (abs.toLowerCase() === root.toLowerCase()) return '';
  if (abs.toLowerCase().startsWith(`${root.toLowerCase()}/`)) {
    return abs.slice(root.length + 1);
  }
  return abs;
}

export function useUntitledFiles({
  projectRootPath, addBlock, setFileSystemTree, addToast,
  activePaneId, splitLayout,
  setOpenTabs, setActiveTabId, setSecondaryOpenTabs, setSecondaryActiveTabId,
}: UseUntitledFilesProps): UseUntitledFilesReturn {
  const [untitledFiles, setUntitledFiles] = useState<Map<string, UntitledFileState>>(new Map());
  const counterRef = useRef(0);

  const createUntitledFile = useCallback(() => {
    if (!projectRootPath) {
      addToast('Open a project before creating a new file', 'warning');
      return;
    }
    counterRef.current += 1;
    const title = `Untitled-${counterRef.current}`;
    const tabId = `untitled-${Date.now()}-${counterRef.current}`;

    setUntitledFiles(prev => {
      const next = new Map(prev);
      next.set(tabId, { title, content: '', isDirty: false });
      return next;
    });

    const newTab: EditorTab = { id: tabId, type: 'untitled', title };
    if (activePaneId === 'secondary' && splitLayout !== 'none') {
      setSecondaryOpenTabs(prev => [...prev, newTab]);
      setSecondaryActiveTabId(tabId);
    } else {
      setOpenTabs(prev => [...prev, newTab]);
      setActiveTabId(tabId);
    }
  }, [projectRootPath, addToast, activePaneId, splitLayout, setOpenTabs, setActiveTabId, setSecondaryOpenTabs, setSecondaryActiveTabId]);

  const updateUntitledContent = useCallback((tabId: string, content: string) => {
    setUntitledFiles(prev => {
      const existing = prev.get(tabId);
      if (!existing) return prev;
      const next = new Map(prev);
      next.set(tabId, { ...existing, content });
      return next;
    });
  }, []);

  const setUntitledDirty = useCallback((tabId: string, isDirty: boolean) => {
    setUntitledFiles(prev => {
      const existing = prev.get(tabId);
      if (!existing || existing.isDirty === isDirty) return prev;
      const next = new Map(prev);
      next.set(tabId, { ...existing, isDirty });
      return next;
    });
  }, []);

  const saveUntitledFile = useCallback(async (tabId: string) => {
    const draft = untitledFiles.get(tabId);
    if (!draft || !window.electronAPI || !projectRootPath) return;

    const defaultPath = `${projectRootPath.replace(/[\\/]+$/, '')}/game`;
    const chosenPath = await window.electronAPI.showSaveDialog({
      title: 'Save File',
      defaultPath,
      filters: [
        { name: "Ren'Py Script", extensions: ['rpy'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });
    if (!chosenPath) return;

    const res = await window.electronAPI.writeFile(chosenPath, draft.content);
    if (!res.success) {
      addToast(`Failed to save file: ${res.error || 'Unknown error'}`, 'error');
      return;
    }

    const relativePath = toProjectRelativePath(chosenPath, projectRootPath);
    const newBlockId = addBlock(relativePath, draft.content, undefined, { markDirty: false });

    const swapTab = (t: EditorTab): EditorTab =>
      t.id === tabId ? { id: newBlockId, type: 'editor', blockId: newBlockId } : t;
    setOpenTabs(prev => prev.map(swapTab));
    setActiveTabId(prev => (prev === tabId ? newBlockId : prev));
    setSecondaryOpenTabs(prev => prev.map(swapTab));
    setSecondaryActiveTabId(prev => (prev === tabId ? newBlockId : prev));

    setUntitledFiles(prev => {
      const next = new Map(prev);
      next.delete(tabId);
      return next;
    });

    try {
      const projData = await window.electronAPI.loadProject(projectRootPath);
      setFileSystemTree(projData.tree);
    } catch {
      // Tree refresh is best-effort — the file is already written and tracked as a block.
    }

    addToast(`Saved ${relativePath}`, 'success');
  }, [untitledFiles, projectRootPath, addBlock, addToast, setFileSystemTree, setOpenTabs, setActiveTabId, setSecondaryOpenTabs, setSecondaryActiveTabId]);

  return { untitledFiles, createUntitledFile, updateUntitledContent, setUntitledDirty, saveUntitledFile };
}
```

Note: `Block` is imported but unused directly in this file (it's part of the public surface consumers build against) — remove the `Block` import from this file's import list since nothing here constructs one; the synthetic `Block` is built in Task 4, in `useTabContentRenderer.tsx`, which already imports `Block`.

- [ ] **Step 5: Run the test file to verify it passes**

Run: `npx vitest run src/hooks/useUntitledFiles.test.ts`
Expected: PASS — all tests green.

- [ ] **Step 6: Typecheck and lint**

Run: `npx tsc --noEmit && npx eslint src/hooks/useUntitledFiles.ts src/hooks/useUntitledFiles.test.ts src/types.ts --quiet`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/types.ts src/hooks/useUntitledFiles.ts src/hooks/useUntitledFiles.test.ts
git commit -m "feat: add useUntitledFiles hook for blank/unsaved editor tabs"
```

---

### Task 2: Wire `useUntitledFiles` into `App.tsx`

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useUntitledFiles`, `UseUntitledFilesReturn` from Task 1 (`@/hooks/useUntitledFiles`); existing `addBlock`, `setFileSystemTree`, `addToast`, `activePaneId`, `splitLayout`, `setOpenTabs`, `setActiveTabId`, `setSecondaryOpenTabs`, `setSecondaryActiveTabId`, `projectRootPath` (all already in scope in `App.tsx`, confirmed at lines 145, 187-219, 844-857).
- Produces (used by Task 3 and Task 4): local App.tsx bindings `untitledFiles`, `createUntitledFile`, `updateUntitledContent`, `setUntitledDirty`, `saveUntitledFile`.

This task has no new test file — `App.tsx` is the app's state hub and is not unit-tested directly anywhere in this codebase (confirmed: no `src/App.test.tsx` exists, and other recently-added App.tsx-level wiring, e.g. the character-tag-collision toast, similarly has no direct App-level test). Correctness for this task is verified by `tsc`/`eslint` plus the full existing test suite staying green (nothing here changes existing behavior), and end-to-end by the manual Electron verification in Task 6.

- [ ] **Step 1: Add the import**

Find (`src/App.tsx`, near line 71):

```ts
import { useCharacterManagement } from '@/hooks/useCharacterManagement';
```

Add directly after it:

```ts
import { useUntitledFiles } from '@/hooks/useUntitledFiles';
```

- [ ] **Step 2: Call the hook**

Find (`src/App.tsx`, lines 1351-1359):

```tsx
  // --- Character Editor ---
  const { handleOpenCharacterEditor, handleUpdateCharacter } = useCharacterManagement({
    blocks, analysisResult, projectRootPath,
    updateBlock, addBlock, setFileSystemTree,
    setCharacterProfiles, setHasUnsavedSettings, addToast,
    pendingTagRenameRef,
    openTabs, secondaryOpenTabs, activePaneId, splitLayout,
    setOpenTabs, setActiveTabId, setSecondaryOpenTabs, setSecondaryActiveTabId, setActivePaneId,
  });
```

Add directly after it:

```tsx

  // --- Untitled (blank) File Tabs ---
  const { untitledFiles, createUntitledFile, updateUntitledContent, setUntitledDirty, saveUntitledFile } = useUntitledFiles({
    projectRootPath, addBlock, setFileSystemTree, addToast,
    activePaneId, splitLayout,
    setOpenTabs, setActiveTabId, setSecondaryOpenTabs, setSecondaryActiveTabId,
  });
```

- [ ] **Step 3: Typecheck and lint**

Run: `npx tsc --noEmit && npx eslint src/App.tsx --quiet`
Expected: no errors. Note: `untitledFiles`/`createUntitledFile`/etc. are unused until Tasks 3-4 wire them up — this project's `@typescript-eslint/no-unused-vars` is configured as `'warn'` (see `eslint.config.js:26`) and `--quiet` suppresses warnings, so this is expected to pass cleanly despite the temporarily-unused bindings.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire useUntitledFiles hook into App.tsx"
```

---

### Task 3: `useMenuCommandDispatch` — dispatch `new-untitled-file`

**Files:**
- Modify: `src/hooks/useMenuCommandDispatch.ts`
- Modify: `src/App.tsx` (wire the new handler into the existing `useMenuCommandDispatch` call)
- Test: `src/hooks/useMenuCommandDispatch.test.ts`

**Interfaces:**
- Consumes: `createUntitledFile` from Task 2 (`App.tsx` local binding).
- Produces: `MenuCommandHandlers.onNewUntitledFile: () => void` (new field), dispatched on IPC command string `'new-untitled-file'`.

- [ ] **Step 1: Write the failing test additions in `src/hooks/useMenuCommandDispatch.test.ts`**

In `makeHandlers()` (around line 6-30), add one line to the returned object, directly after `onOpenScreenshotsFolder: vi.fn(),`:

```ts
    onOpenScreenshotsFolder: vi.fn(),
    onNewUntitledFile: vi.fn(),
    onCloseTab: vi.fn(),
```

In the `it.each` table (around line 50-68), add one row directly after `['open-screenshots-folder', 'onOpenScreenshotsFolder'],`:

```ts
    ['open-screenshots-folder', 'onOpenScreenshotsFolder'],
    ['new-untitled-file', 'onNewUntitledFile'],
    ['close-tab', 'onCloseTab'],
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/hooks/useMenuCommandDispatch.test.ts`
Expected: FAIL — TS error (handler missing from `MenuCommandHandlers`) or the new dispatched-command test case fails because nothing calls `onNewUntitledFile`.

- [ ] **Step 3: Add the handler to `src/hooks/useMenuCommandDispatch.ts`**

Find (`src/hooks/useMenuCommandDispatch.ts:17-23`):

```ts
  onExplorerNewFile: () => void;
  onExplorerNewFolder: () => void;
  onExplorerRename: () => void;
  onExplorerDelete: () => void;
  onExplorerRefresh: () => void;
  onOpenScreenshotsFolder: () => void;
  onCloseTab: () => void;
```

Replace with:

```ts
  onExplorerNewFile: () => void;
  onExplorerNewFolder: () => void;
  onExplorerRename: () => void;
  onExplorerDelete: () => void;
  onExplorerRefresh: () => void;
  onOpenScreenshotsFolder: () => void;
  onNewUntitledFile: () => void;
  onCloseTab: () => void;
```

Find (`src/hooks/useMenuCommandDispatch.ts:54-55`):

```ts
      if (data.command === 'open-screenshots-folder') h.onOpenScreenshotsFolder();
      if (data.command === 'close-tab') h.onCloseTab();
```

Replace with:

```ts
      if (data.command === 'open-screenshots-folder') h.onOpenScreenshotsFolder();
      if (data.command === 'new-untitled-file') h.onNewUntitledFile();
      if (data.command === 'close-tab') h.onCloseTab();
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/hooks/useMenuCommandDispatch.test.ts`
Expected: PASS.

- [ ] **Step 5: Wire `createUntitledFile` into the `useMenuCommandDispatch` call in `App.tsx`**

Find (`src/App.tsx:1577-1578`):

```tsx
    onExplorerRefresh: handleRefreshProject,
    onOpenScreenshotsFolder: handleOpenScreenshotsFolder,
```

Replace with:

```tsx
    onExplorerRefresh: handleRefreshProject,
    onOpenScreenshotsFolder: handleOpenScreenshotsFolder,
    onNewUntitledFile: createUntitledFile,
```

- [ ] **Step 6: Typecheck and lint**

Run: `npx tsc --noEmit && npx eslint src/hooks/useMenuCommandDispatch.ts src/hooks/useMenuCommandDispatch.test.ts src/App.tsx --quiet`
Expected: no errors.

- [ ] **Step 7: Run the full test suite to confirm no regressions**

Run: `npx vitest run`
Expected: all tests pass (test count should be 3 higher than before this task: 1 new row in the `it.each` table plus the two lines above don't add new `it()` blocks by themselves, so expect exactly +1 test versus the baseline).

- [ ] **Step 8: Commit**

```bash
git add src/hooks/useMenuCommandDispatch.ts src/hooks/useMenuCommandDispatch.test.ts src/App.tsx
git commit -m "feat: dispatch new-untitled-file menu command"
```

---

### Task 4: Render untitled tabs in `useTabContentRenderer.tsx`

**Files:**
- Modify: `src/hooks/useTabContentRenderer.tsx`
- Modify: `src/App.tsx` (pass the four new props into the existing `useTabContentRenderer(...)` call)

**Interfaces:**
- Consumes: `UntitledFileState` (type, from Task 1's `@/hooks/useUntitledFiles`); `untitledFiles: Map<string, UntitledFileState>`, `updateUntitledContent`, `setUntitledDirty`, `saveUntitledFile` (from Task 2's `App.tsx` bindings).
- Produces: `useTabContentRenderer`'s existing `getTabLabel`/`renderTabContent`/`renderTabBar` now additionally handle `tab.type === 'untitled'`.

No dedicated test file exists for this hook today (`src/hooks/useTabContentRenderer.tsx` has no `.test.tsx` — it's covered indirectly through component-level and full-suite tests). This task follows that existing precedent: verify via `tsc`/`eslint`, the full test suite staying green, and the manual Electron walkthrough in Task 6.

- [ ] **Step 1: Add the type import**

Find (`src/hooks/useTabContentRenderer.tsx`, near line 33):

```ts
import FileSizeDot from '@/components/FileSizeDot';
```

If that exact line is not present (it may have been removed by an earlier, unrelated change), instead find the block of type-only imports starting `import type {` around line 36 and add the new import as its own line directly above it:

```ts
import type { UntitledFileState } from '@/hooks/useUntitledFiles';
```

- [ ] **Step 2: Add new params to `UseTabContentRendererParams`**

Find (`src/hooks/useTabContentRenderer.tsx`, end of the interface, around line 212-213):

```ts
  // Markdown
  projectRootPath: string | null;
}
```

Replace with:

```ts
  // Markdown
  projectRootPath: string | null;

  // Untitled (unsaved, blank) file tabs
  untitledFiles: Map<string, UntitledFileState>;
  updateUntitledContent: (tabId: string, content: string) => void;
  setUntitledDirty: (tabId: string, isDirty: boolean) => void;
  saveUntitledFile: (tabId: string) => Promise<void>;
}
```

- [ ] **Step 3: Destructure the new params**

Find (`src/hooks/useTabContentRenderer.tsx`, around line 262):

```ts
    imagemapCompositions, handleImageMapUpdate, handleRenameImageMap,
    projectRootPath,
  } = params;
```

Replace with:

```ts
    imagemapCompositions, handleImageMapUpdate, handleRenameImageMap,
    projectRootPath,
    untitledFiles, updateUntitledContent, setUntitledDirty, saveUntitledFile,
  } = params;
```

- [ ] **Step 4: Add the `getTabLabel` branch**

Find (`src/hooks/useTabContentRenderer.tsx`, around line 276):

```ts
    if (tab.type === 'editor') return blocks.find(b => b.id === tab.blockId)?.title || 'Untitled';
```

Replace with:

```ts
    if (tab.type === 'untitled') return tab.title ?? 'Untitled';
    if (tab.type === 'editor') return blocks.find(b => b.id === tab.blockId)?.title || 'Untitled';
```

- [ ] **Step 5: Add the `renderTabContent` branch**

Find the end of the existing `tab.type === 'editor'` block in `renderTabContent` (around lines 385-407):

```tsx
    if (tab.type === 'editor' && tab.blockId) {
      const block = blocks.find(b => b.id === tab.blockId);
      if (block) return <EditorView
        block={block} blocks={blocks} analysisResult={analysisResult} initialScrollRequest={tab.scrollRequest}
        onSwitchFocusBlock={handleOpenEditor} onSave={(id, content) => updateBlock(id, { content })}
        onTriggerSave={handleSaveBlock}
        onDirtyChange={(id, dirty) => { setDirtyEditors(prev => { const next = new Set(prev); if (dirty) { next.add(id); } else { next.delete(id); } return next; }); }}
        onContentChange={(id, content) => { setBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b)); }}
        editorTheme={appSettings.theme.includes('dark') ? 'dark' : 'light'} editorFontFamily={appSettings.editorFontFamily}
        editorFontSize={appSettings.editorFontSize} addToast={addToast}
        onEditorMount={(id, editor) => editorInstances.current.set(id, editor)}
        onEditorUnmount={(id) => { const editor = editorInstances.current.get(id); if (editor) { const block = blocksRef.current.find(b => b.id === id); if (block && editor.getValue() !== block.content) { syncEditorToStateAndMarkDirty(id, editor.getValue()); } } editorInstances.current.delete(id); }}
        onCursorPositionChange={(pos) => { setEditorCursorPosition(pos); if (tab.blockId) setEditorCursorBlockId(tab.blockId); }}
        onWarpToLabel={handleWarpToLabel}
        onCreateFileFromSelection={onCreateFileFromSelection}
        onCreateVariableFromSelection={onCreateVariableFromSelection}
        onCreateCharacterFromSelection={onCreateCharacterFromSelection}
        draftingMode={projectSettings.draftingMode} existingImageTags={existingImageTags} existingAudioPaths={existingAudioPaths}
        userSnippets={appSettings.userSnippets}
        menuTemplates={appSettings.menuTemplates}
        onSaveMenuTemplate={handleSaveMenuTemplate}
      />;
    }
```

Insert directly after that closing `}` (still before the `if (tab.type === 'image' && tab.filePath) {` block):

```tsx
    if (tab.type === 'untitled') {
      const draft = untitledFiles.get(tab.id);
      if (!draft) return null;
      const syntheticBlock: Block = {
        id: tab.id,
        content: draft.content,
        position: { x: 0, y: 0 },
        width: 320,
        height: 200,
        title: draft.title,
      };
      return <EditorView
        block={syntheticBlock} blocks={blocks} analysisResult={analysisResult}
        onSwitchFocusBlock={handleOpenEditor} onSave={(id, content) => updateUntitledContent(id, content)}
        onTriggerSave={saveUntitledFile}
        onDirtyChange={(id, dirty) => setUntitledDirty(id, dirty)}
        onContentChange={(id, content) => updateUntitledContent(id, content)}
        editorTheme={appSettings.theme.includes('dark') ? 'dark' : 'light'} editorFontFamily={appSettings.editorFontFamily}
        editorFontSize={appSettings.editorFontSize} addToast={addToast}
        onEditorMount={(id, editor) => editorInstances.current.set(id, editor)}
        onEditorUnmount={(id) => {
          const editor = editorInstances.current.get(id);
          if (editor) {
            const current = untitledFiles.get(id);
            if (current && editor.getValue() !== current.content) updateUntitledContent(id, editor.getValue());
          }
          editorInstances.current.delete(id);
        }}
        onCursorPositionChange={(pos) => { setEditorCursorPosition(pos); setEditorCursorBlockId(tab.id); }}
        onWarpToLabel={handleWarpToLabel}
        onCreateFileFromSelection={onCreateFileFromSelection}
        onCreateVariableFromSelection={onCreateVariableFromSelection}
        onCreateCharacterFromSelection={onCreateCharacterFromSelection}
        draftingMode={projectSettings.draftingMode} existingImageTags={existingImageTags} existingAudioPaths={existingAudioPaths}
        userSnippets={appSettings.userSnippets}
        menuTemplates={appSettings.menuTemplates}
        onSaveMenuTemplate={handleSaveMenuTemplate}
      />;
    }
```

- [ ] **Step 6: Update the tab-bar dirty dot**

Find (`src/hooks/useTabContentRenderer.tsx`, the tab-bar dirty indicator — search for `bg-blue-500 rounded-full flex-none`):

```tsx
            {tab.blockId && (dirtyBlockIds.has(tab.blockId) || dirtyEditors.has(tab.blockId)) && <div className="w-2 h-2 ml-2 bg-blue-500 rounded-full flex-none" />}
```

Replace with:

```tsx
            {((tab.blockId && (dirtyBlockIds.has(tab.blockId) || dirtyEditors.has(tab.blockId))) || (tab.type === 'untitled' && untitledFiles.get(tab.id)?.isDirty)) && <div className="w-2 h-2 ml-2 bg-blue-500 rounded-full flex-none" />}
```

- [ ] **Step 7: Pass the new props from `App.tsx`**

Find (`src/App.tsx`, the `useTabContentRenderer({...})` call, around line 1741-1743):

```tsx
    imagemapCompositions, handleImageMapUpdate, handleRenameImageMap,
    ...
    projectRootPath,
```

(The exact surrounding lines vary slightly — locate the `useTabContentRenderer({` call from Task 2's step, find its closing `});`, and add the following four lines anywhere inside that object, e.g. directly before the closing `});`):

```tsx
    untitledFiles, updateUntitledContent, setUntitledDirty, saveUntitledFile,
```

- [ ] **Step 8: Typecheck and lint**

Run: `npx tsc --noEmit && npx eslint src/hooks/useTabContentRenderer.tsx src/App.tsx --quiet`
Expected: no errors.

- [ ] **Step 9: Run the full test suite to confirm no regressions**

Run: `npx vitest run`
Expected: all tests pass, same count as after Task 3 (this task adds no new `it()` blocks — it's UI wiring covered by manual verification per this task's note above).

- [ ] **Step 10: Commit**

```bash
git add src/hooks/useTabContentRenderer.tsx src/App.tsx
git commit -m "feat: render untitled editor tabs in the tab bar and content area"
```

---

### Task 5: Menu item, relabel, and enablement wiring

**Files:**
- Modify: `electron.js` — File menu template and `setExplorerMenuState`
- Modify: `src/types.ts` — `updateExplorerMenuState` electronAPI type
- Modify: `src/App.tsx` — the Explorer-selection → File-menu-state sync effect

**Interfaces:**
- Consumes: nothing new from earlier tasks (this task is purely menu/IPC wiring — it dispatches the `new-untitled-file` command that Task 3 already handles).
- Produces: File menu shows "New File" (new item, `id: 'new-untitled-file'`) and "New File in Folder" (relabeled existing item, same `id: 'explorer-new-file'`); both correctly enabled/disabled based on project-open / folder-selection state respectively.

No automated tests — `electron.js` has no test harness in this codebase (confirmed: it's excluded from Vitest's scope, and existing menu-state code like `setExplorerMenuState` has no corresponding test file). Verified by `tsc`/`eslint` for the `.ts`/`.tsx` changes and the manual Electron walkthrough in Task 6.

- [ ] **Step 1: Extend the `updateExplorerMenuState` electronAPI type in `src/types.ts`**

Find (`src/types.ts:1435`):

```ts
          updateExplorerMenuState?: (state: { canNewFile?: boolean; canNewFolder?: boolean; canRename?: boolean; canDelete?: boolean; canRefresh?: boolean; hasScreenshots?: boolean }) => void;
```

Replace with:

```ts
          updateExplorerMenuState?: (state: { canNewFile?: boolean; canNewFolder?: boolean; canRename?: boolean; canDelete?: boolean; canRefresh?: boolean; hasScreenshots?: boolean; canNewUntitledFile?: boolean }) => void;
```

- [ ] **Step 2: Extend the Explorer-selection sync effect in `src/App.tsx`**

Find (`src/App.tsx:1550-1556`):

```tsx
    window.electronAPI.updateExplorerMenuState({
      canNewFile: hasFolderSelected,
      canNewFolder: hasFolderSelected,
      canRename: hasSingleSelection,
      canDelete: hasAnySelection,
    });
  }, [explorerSelectedPaths, fileSystemTree]);
```

Replace with:

```tsx
    window.electronAPI.updateExplorerMenuState({
      canNewFile: hasFolderSelected,
      canNewFolder: hasFolderSelected,
      canRename: hasSingleSelection,
      canDelete: hasAnySelection,
      canNewUntitledFile: projectRootPath !== null,
    });
  }, [explorerSelectedPaths, fileSystemTree, projectRootPath]);
```

- [ ] **Step 3: Relabel the existing Explorer-scoped menu item in `electron.js`**

Find (`electron.js:563-568`):

```js
            {
                id: 'explorer-new-file',
                label: 'New File',
                enabled: false,
                click: (item, focusedWindow) => { if (focusedWindow) focusedWindow.webContents.send('menu-command', { command: 'explorer-new-file' }); }
            },
```

Replace with:

```js
            {
                id: 'explorer-new-file',
                label: 'New File in Folder',
                enabled: false,
                click: (item, focusedWindow) => { if (focusedWindow) focusedWindow.webContents.send('menu-command', { command: 'explorer-new-file' }); }
            },
```

- [ ] **Step 4: Add the new "New File" menu item in `electron.js`**

Find (`electron.js:540-544`):

```js
            {
                label: 'Open Recent',
                submenu: openRecentSubmenu
            },
            { type: 'separator' },
```

Replace with:

```js
            {
                label: 'Open Recent',
                submenu: openRecentSubmenu
            },
            {
                id: 'new-untitled-file',
                label: 'New File',
                accelerator: 'CmdOrCtrl+Alt+N',
                enabled: false,
                click: (item, focusedWindow) => { if (focusedWindow) focusedWindow.webContents.send('menu-command', { command: 'new-untitled-file' }); }
            },
            { type: 'separator' },
```

- [ ] **Step 5: Extend `setExplorerMenuState` in `electron.js`**

Find (`electron.js:1403-1418`):

```js
  function setExplorerMenuState({ canNewFile, canNewFolder, canRename, canDelete, canRefresh, hasScreenshots }) {
    const menu = Menu.getApplicationMenu();
    if (!menu) return;
    const ids = {
      'explorer-new-file': canNewFile,
      'explorer-new-folder': canNewFolder,
      'explorer-rename': canRename,
      'explorer-delete': canDelete,
      'explorer-refresh': canRefresh ?? canNewFile,
      'open-screenshots-folder': hasScreenshots
    };
    for (const [id, enabled] of Object.entries(ids)) {
      const item = menu.getMenuItemById(id);
      if (item && enabled !== undefined) item.enabled = enabled;
    }
  }
```

Replace with:

```js
  function setExplorerMenuState({ canNewFile, canNewFolder, canRename, canDelete, canRefresh, hasScreenshots, canNewUntitledFile }) {
    const menu = Menu.getApplicationMenu();
    if (!menu) return;
    const ids = {
      'explorer-new-file': canNewFile,
      'explorer-new-folder': canNewFolder,
      'explorer-rename': canRename,
      'explorer-delete': canDelete,
      'explorer-refresh': canRefresh ?? canNewFile,
      'open-screenshots-folder': hasScreenshots,
      'new-untitled-file': canNewUntitledFile
    };
    for (const [id, enabled] of Object.entries(ids)) {
      const item = menu.getMenuItemById(id);
      if (item && enabled !== undefined) item.enabled = enabled;
    }
  }
```

- [ ] **Step 6: Typecheck and lint the `.ts`/`.tsx` changes**

Run: `npx tsc --noEmit && npx eslint src/types.ts src/App.tsx --quiet`
Expected: no errors.

- [ ] **Step 7: Run the full test suite to confirm no regressions**

Run: `npx vitest run`
Expected: all tests pass, same count as after Task 4.

- [ ] **Step 8: Commit**

```bash
git add electron.js src/types.ts src/App.tsx
git commit -m "feat: add File > New File menu item and relabel the explorer-scoped one"
```

---

### Task 6: End-to-end verification, fast-follow bead, and final checks

**Files:** none (verification only, plus one beads issue).

- [ ] **Step 1: Full regression pass**

Run: `npx tsc --noEmit && npx eslint . --quiet && npx vitest run`
Expected: zero type errors, zero lint errors, full test suite green (baseline count + 1 new test file's worth of tests from Task 1, +1 test from Task 3's new `it.each` row).

- [ ] **Step 2: Build and launch the real Electron app**

Run: `npm run build`
Expected: build succeeds (matches the existing `npm run build` output shape — bundle-size warnings are pre-existing and unrelated).

Launch the app via Playwright's `_electron` driver (matching the approach already used earlier in this project for manual UI verification — see any prior session's `run_electron_tmp.cjs`-style script): open a project, confirm:
1. With no project open, File → New File is disabled, and File → New File in Folder is disabled.
2. With a project open, File → New File is enabled and creates a tab titled "Untitled-1"; a second click creates "Untitled-2".
3. Typing content into the Untitled-1 tab shows the blue unsaved-changes dot (same dot used by real dirty tabs).
4. Pressing Ctrl+S opens a native save dialog defaulting into the project's `game/` folder.
5. Canceling the dialog leaves the tab open, still showing the unsaved dot.
6. Saving as e.g. `newfile.rpy` converts the tab: the unsaved dot disappears, the file now appears in the Explorer tree under `game/`, and the file is selectable/visible as a node on the Project canvas.
7. File → New File in Folder still behaves exactly as before (unchanged, folder-selection-gated, immediate write).

- [ ] **Step 3: Delete the temporary Electron verification script if one was created**

```bash
rm -f run_electron_tmp.cjs
```

- [ ] **Step 4: File the fast-follow bead for the known Save-All/bulk-close/quit gap**

Run:
```bash
bd create --title="Untitled file tabs are not protected by Save All, bulk-close, or app-quit" --description="Per docs/superpowers/specs/2026-08-03-new-untitled-file-design.md's Non-Goals: an untitled ('Untitled-N') editor tab created via File > New File is tracked entirely outside dirtyBlockIds/dirtyEditors (see useUntitledFiles.ts), so Save All, Close Others/All, and the app-quit unsaved-changes prompt do not know about it and will not protect its content. Today it is only protected by its own explicit Ctrl+S. This was an explicit, approved scope cut for the initial feature (see spec) rather than an oversight -- filing so it isn't lost. Fixing it requires either folding untitled tabs into the existing dirty-Set-based flows (risk: those flows assume a real Block backs every dirty id) or building a parallel confirm-and-save-each-draft flow for quit/bulk-close specifically." --type=task --priority=3
```

- [ ] **Step 5: Final `git status` check**

Run: `git status`
Expected: working tree clean (everything from Tasks 1-5 already committed); only untracked files should be pre-existing ones unrelated to this feature (per this session's starting `git status`, e.g. `DemoProject/.renide/`, `DemoReelProject.osp`, etc. — do not commit those).
