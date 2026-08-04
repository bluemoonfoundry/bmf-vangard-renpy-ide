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
