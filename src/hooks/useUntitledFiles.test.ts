import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUntitledFiles, toProjectRelativePath } from '@/hooks/useUntitledFiles';
import type { UseUntitledFilesProps } from '@/hooks/useUntitledFiles';
import { createMockElectronAPI, installElectronAPI, uninstallElectronAPI } from '@/test/mocks/electronAPI';
import type { Block, EditorTab } from '@/types';

function makeProps(overrides: Partial<UseUntitledFilesProps> = {}): UseUntitledFilesProps {
  return {
    projectRootPath: '/project',
    blocks: [],
    addBlock: vi.fn().mockReturnValue('block-new'),
    updateBlock: vi.fn(),
    setFileSystemTree: vi.fn(),
    addToast: vi.fn(),
    activePaneId: 'primary',
    splitLayout: 'none',
    setOpenTabs: vi.fn(),
    setActiveTabId: vi.fn(),
    setSecondaryOpenTabs: vi.fn(),
    setSecondaryActiveTabId: vi.fn(),
    setActivePaneId: vi.fn(),
    setSplitLayout: vi.fn(),
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

  it('does nothing and resolves false when the save dialog is canceled', async () => {
    api.showSaveDialog.mockResolvedValue(null);
    const addBlock = vi.fn();
    const { result } = renderHook(() => useUntitledFiles(makeProps({ addBlock })));
    act(() => result.current.createUntitledFile());
    const tabId = [...result.current.untitledFiles.keys()][0];

    let saved: boolean | undefined;
    await act(async () => { saved = await result.current.saveUntitledFile(tabId); });
    expect(saved).toBe(false);
    expect(addBlock).not.toHaveBeenCalled();
    expect(result.current.untitledFiles.has(tabId)).toBe(true);
  });

  it('toasts an error, keeps the tab open, and resolves false when the write fails', async () => {
    api.showSaveDialog.mockResolvedValue('/project/game/newfile.rpy');
    api.writeFile.mockResolvedValue({ success: false, error: 'disk full' });
    const addToast = vi.fn();
    const addBlock = vi.fn();
    const { result } = renderHook(() => useUntitledFiles(makeProps({ addToast, addBlock })));
    act(() => result.current.createUntitledFile());
    const tabId = [...result.current.untitledFiles.keys()][0];

    let saved: boolean | undefined;
    await act(async () => { saved = await result.current.saveUntitledFile(tabId); });
    expect(saved).toBe(false);
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

    let saved: boolean | undefined;
    await act(async () => { saved = await result.current.saveUntitledFile(tabId); });

    expect(saved).toBe(true);
    expect(addBlock).toHaveBeenCalledWith('game/newfile.rpy', 'label start:\n    return\n', undefined, { markDirty: false });
    const tabsUpdater = setOpenTabs.mock.calls[setOpenTabs.mock.calls.length - 1][0] as (prev: EditorTab[]) => EditorTab[];
    const swapped = tabsUpdater([{ id: tabId, type: 'untitled', title: 'Untitled-1' }]);
    expect(swapped[0]).toEqual({ id: 'block-new', type: 'editor', blockId: 'block-new' });
    expect(setActiveTabId).toHaveBeenCalled();
    expect(setFileSystemTree).toHaveBeenCalled();
    expect(addToast).toHaveBeenCalledWith(expect.stringContaining('Saved'), 'success');
    expect(result.current.untitledFiles.has(tabId)).toBe(false);
  });

  it('saves the live editor content passed in, not the (possibly stale/debounced) map content', async () => {
    api.showSaveDialog.mockResolvedValue('/project/game/newfile.rpy');
    api.writeFile.mockResolvedValue({ success: true });
    api.loadProject.mockResolvedValue({
      blocks: [], settings: {}, tree: { name: 'root', path: '/project', children: [] },
    } as unknown as Awaited<ReturnType<typeof api.loadProject>>);
    const addBlock = vi.fn().mockReturnValue('block-new');
    const { result } = renderHook(() => useUntitledFiles(makeProps({ addBlock })));
    act(() => result.current.createUntitledFile());
    const tabId = [...result.current.untitledFiles.keys()][0];
    // Deliberately do NOT call updateUntitledContent — simulates content typed
    // within the 800ms EditorView debounce window that hasn't reached the map yet.
    expect(result.current.untitledFiles.get(tabId)?.content).toBe('');

    await act(async () => {
      await result.current.saveUntitledFile(tabId, 'live text that never made it into the map');
    });

    expect(api.writeFile).toHaveBeenCalledWith('/project/game/newfile.rpy', 'live text that never made it into the map');
    expect(addBlock).toHaveBeenCalledWith('game/newfile.rpy', 'live text that never made it into the map', undefined, { markDirty: false });
  });

  it('updates the existing block and swaps to its id instead of creating a duplicate when the filePath already exists', async () => {
    api.showSaveDialog.mockResolvedValue('/project/game/existing.rpy');
    api.writeFile.mockResolvedValue({ success: true });
    api.loadProject.mockResolvedValue({
      blocks: [], settings: {}, tree: { name: 'root', path: '/project', children: [] },
    } as unknown as Awaited<ReturnType<typeof api.loadProject>>);
    const existingBlock = { id: 'block-existing', filePath: 'game/existing.rpy', content: 'old', position: { x: 0, y: 0 }, width: 320, height: 200, title: 'existing' } as Block;
    const addBlock = vi.fn().mockReturnValue('block-new');
    const updateBlock = vi.fn();
    const setOpenTabs = vi.fn();
    const setActiveTabId = vi.fn();
    const { result } = renderHook(() =>
      useUntitledFiles(makeProps({ blocks: [existingBlock], addBlock, updateBlock, setOpenTabs, setActiveTabId }))
    );
    act(() => result.current.createUntitledFile());
    const tabId = [...result.current.untitledFiles.keys()][0];
    act(() => result.current.updateUntitledContent(tabId, 'new content'));

    await act(async () => { await result.current.saveUntitledFile(tabId); });

    expect(updateBlock).toHaveBeenCalledWith('block-existing', { content: 'new content' });
    expect(addBlock).not.toHaveBeenCalled();
    const tabsUpdater = setOpenTabs.mock.calls[setOpenTabs.mock.calls.length - 1][0] as (prev: EditorTab[]) => EditorTab[];
    const swapped = tabsUpdater([{ id: tabId, type: 'untitled', title: 'Untitled-1' }]);
    expect(swapped[0]).toEqual({ id: 'block-existing', type: 'editor', blockId: 'block-existing' });
    expect(setActiveTabId).toHaveBeenCalled();
  });

  it('does not register a block for a non-.rpy save, and closes the tab instead of converting it', async () => {
    api.showSaveDialog.mockResolvedValue('/project/game/notes.txt');
    api.writeFile.mockResolvedValue({ success: true });
    api.loadProject.mockResolvedValue({
      blocks: [], settings: {}, tree: { name: 'root', path: '/project', children: [] },
    } as unknown as Awaited<ReturnType<typeof api.loadProject>>);
    const addBlock = vi.fn().mockReturnValue('block-new');
    const updateBlock = vi.fn();
    const setOpenTabs = vi.fn();
    const setActiveTabId = vi.fn();
    const addToast = vi.fn();
    const { result } = renderHook(() =>
      useUntitledFiles(makeProps({ addBlock, updateBlock, setOpenTabs, setActiveTabId, addToast }))
    );
    act(() => result.current.createUntitledFile());
    const tabId = [...result.current.untitledFiles.keys()][0];
    act(() => result.current.updateUntitledContent(tabId, 'just some notes'));

    await act(async () => { await result.current.saveUntitledFile(tabId); });

    expect(addBlock).not.toHaveBeenCalled();
    expect(updateBlock).not.toHaveBeenCalled();
    const tabsUpdater = setOpenTabs.mock.calls[setOpenTabs.mock.calls.length - 1][0] as (prev: EditorTab[]) => EditorTab[];
    const remaining = tabsUpdater([{ id: tabId, type: 'untitled', title: 'Untitled-1' }]);
    expect(remaining).toEqual([]);
    expect(addToast).toHaveBeenCalledWith(expect.stringContaining('Saved'), 'success');
    expect(result.current.untitledFiles.has(tabId)).toBe(false);
  });

  it('collapses the split when a non-.rpy save empties the secondary pane', async () => {
    api.showSaveDialog.mockResolvedValue('/project/game/notes.txt');
    api.writeFile.mockResolvedValue({ success: true });
    api.loadProject.mockResolvedValue({
      blocks: [], settings: {}, tree: { name: 'root', path: '/project', children: [] },
    } as unknown as Awaited<ReturnType<typeof api.loadProject>>);
    const setSecondaryOpenTabs = vi.fn();
    const setSecondaryActiveTabId = vi.fn();
    const setSplitLayout = vi.fn();
    const setActivePaneId = vi.fn();
    const { result } = renderHook(() =>
      useUntitledFiles(makeProps({
        activePaneId: 'secondary', splitLayout: 'right',
        setSecondaryOpenTabs, setSecondaryActiveTabId, setSplitLayout, setActivePaneId,
      }))
    );
    act(() => result.current.createUntitledFile());
    const tabId = [...result.current.untitledFiles.keys()][0];
    act(() => result.current.updateUntitledContent(tabId, 'just some notes'));

    await act(async () => { await result.current.saveUntitledFile(tabId); });

    const secondaryUpdater = setSecondaryOpenTabs.mock.calls[setSecondaryOpenTabs.mock.calls.length - 1][0] as (prev: EditorTab[]) => EditorTab[];
    const remaining = secondaryUpdater([{ id: tabId, type: 'untitled', title: 'Untitled-1' }]);
    expect(remaining).toEqual([]);
    expect(setSplitLayout).toHaveBeenCalledWith('none');
    expect(setActivePaneId).toHaveBeenCalledWith('primary');
    expect(setSecondaryActiveTabId).toHaveBeenCalledWith('');
  });
});

describe('useUntitledFiles — discardUntitledFile', () => {
  it('removes the draft from untitledFiles without touching tabs or blocks', () => {
    const setOpenTabs = vi.fn();
    const { result } = renderHook(() => useUntitledFiles(makeProps({ setOpenTabs })));
    act(() => result.current.createUntitledFile());
    const tabId = [...result.current.untitledFiles.keys()][0];
    setOpenTabs.mockClear();

    act(() => result.current.discardUntitledFile(tabId));

    expect(result.current.untitledFiles.has(tabId)).toBe(false);
    expect(setOpenTabs).not.toHaveBeenCalled();
  });

  it('is a no-op for an unknown tabId', () => {
    const { result } = renderHook(() => useUntitledFiles(makeProps()));
    act(() => result.current.discardUntitledFile('does-not-exist'));
    expect(result.current.untitledFiles.size).toBe(0);
  });
});
