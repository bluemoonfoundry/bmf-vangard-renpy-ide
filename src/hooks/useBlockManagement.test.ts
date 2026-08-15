import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBlockManagement } from '@/hooks/useBlockManagement';
import { createBlock, createAppSettings } from '@/test/mocks/sampleData';
import { installElectronAPI } from '@/test/mocks/electronAPI';
import type { UseBlockManagementParams } from '@/hooks/useBlockManagement';

function makeParams(overrides: Partial<UseBlockManagementParams> = {}): UseBlockManagementParams {
  const block = createBlock();
  return {
    blocks: [block],
    setBlocks: vi.fn(),
    setGroups: vi.fn(),
    setDirtyBlockIds: vi.fn(),
    updateProjectSettings: vi.fn(),
    setHasUnsavedSettings: vi.fn(),
    appSettings: createAppSettings(),
    storyCanvasTransform: { x: 0, y: 0, scale: 1 },
    setCenterOnBlockRequest: vi.fn(),
    setFlashBlockRequest: vi.fn(),
    setSelectedBlockIds: vi.fn(),
    activeTabId: 'canvas',
    setActiveTabId: vi.fn(),
    setOpenTabs: vi.fn(),
    secondaryActiveTabId: '',
    setSecondaryActiveTabId: vi.fn(),
    setSecondaryOpenTabs: vi.fn(),
    setSplitLayout: vi.fn(),
    setActivePaneId: vi.fn(),
    fileSystemTree: null,
    setFileSystemTree: vi.fn(),
    projectRootPath: '/project',
    explorerSelectedPaths: new Set<string>(),
    openCreateBlockModal: vi.fn(),
    openDeleteConfirmModal: vi.fn(),
    addToast: vi.fn(),
    ...overrides,
  };
}

describe('useBlockManagement', () => {
  beforeEach(() => {
    installElectronAPI();
  });

  // ── updateBlock ───────────────────────────────────────────────────────────

  it('updateBlock calls setBlocks with updated data', () => {
    const setBlocks = vi.fn();
    const { result } = renderHook(() => useBlockManagement(makeParams({ setBlocks })));
    act(() => result.current.updateBlock('block-1', { title: 'New Title' }));
    expect(setBlocks).toHaveBeenCalled();
  });

  it('updateBlock marks block dirty when content changes', () => {
    const setDirtyBlockIds = vi.fn();
    const { result } = renderHook(() => useBlockManagement(makeParams({ setDirtyBlockIds })));
    act(() => result.current.updateBlock('block-1', { content: 'new content' }));
    expect(setDirtyBlockIds).toHaveBeenCalled();
  });

  it('updateBlock does not mark dirty when only title changes', () => {
    const setDirtyBlockIds = vi.fn();
    const { result } = renderHook(() => useBlockManagement(makeParams({ setDirtyBlockIds })));
    act(() => result.current.updateBlock('block-1', { title: 'New Title' }));
    expect(setDirtyBlockIds).not.toHaveBeenCalled();
  });

  it('updateBlock marks settings dirty when position changes', () => {
    const setHasUnsavedSettings = vi.fn();
    const { result } = renderHook(() => useBlockManagement(makeParams({ setHasUnsavedSettings })));
    act(() => result.current.updateBlock('block-1', { position: { x: 50, y: 50 } }));
    expect(setHasUnsavedSettings).toHaveBeenCalledWith(true);
  });

  // ── updateGroup ───────────────────────────────────────────────────────────

  it('updateGroup calls setGroups with an updater', () => {
    const setGroups = vi.fn();
    const { result } = renderHook(() => useBlockManagement(makeParams({ setGroups })));
    act(() => result.current.updateGroup('group-1', { title: 'Chapter 2' }));
    expect(setGroups).toHaveBeenCalled();
  });

  // ── updateBlockPositions ──────────────────────────────────────────────────

  it('updateBlockPositions calls setBlocks and marks settings dirty', () => {
    const setBlocks = vi.fn();
    const setHasUnsavedSettings = vi.fn();
    const { result } = renderHook(() =>
      useBlockManagement(makeParams({ setBlocks, setHasUnsavedSettings })),
    );
    act(() => result.current.updateBlockPositions([{ id: 'block-1', position: { x: 10, y: 20 } }]));
    expect(setBlocks).toHaveBeenCalled();
    expect(setHasUnsavedSettings).toHaveBeenCalledWith(true);
  });

  // ── updateGroupPositions ──────────────────────────────────────────────────

  it('updateGroupPositions calls setGroups and marks settings dirty', () => {
    const setGroups = vi.fn();
    const setHasUnsavedSettings = vi.fn();
    const { result } = renderHook(() =>
      useBlockManagement(makeParams({ setGroups, setHasUnsavedSettings })),
    );
    act(() => result.current.updateGroupPositions([{ id: 'group-1', position: { x: 5, y: 5 } }]));
    expect(setGroups).toHaveBeenCalled();
    expect(setHasUnsavedSettings).toHaveBeenCalledWith(true);
  });

  // ── addBlock ──────────────────────────────────────────────────────────────

  it('addBlock returns a new block id', () => {
    const { result } = renderHook(() => useBlockManagement(makeParams()));
    let id = '';
    act(() => { id = result.current.addBlock('game/new.rpy', ''); });
    expect(id).toMatch(/^block-/);
  });

  it('addBlock calls setBlocks with the new block', () => {
    const setBlocks = vi.fn();
    const { result } = renderHook(() => useBlockManagement(makeParams({ setBlocks })));
    act(() => result.current.addBlock('game/new.rpy', 'content'));
    expect(setBlocks).toHaveBeenCalled();
  });

  it('addBlock uses given initialPosition', () => {
    const setBlocks = vi.fn();
    const { result } = renderHook(() => useBlockManagement(makeParams({ setBlocks })));
    act(() => result.current.addBlock('game/x.rpy', '', { x: 100, y: 200 }));
    const updater = setBlocks.mock.calls[0][0];
    const newBlocks = updater([]);
    expect(newBlocks[0].position).toEqual({ x: 100, y: 200 });
  });

  it('addBlock selects the new block and requests center', () => {
    const setSelectedBlockIds = vi.fn();
    const setCenterOnBlockRequest = vi.fn();
    const { result } = renderHook(() =>
      useBlockManagement(makeParams({ setSelectedBlockIds, setCenterOnBlockRequest })),
    );
    act(() => result.current.addBlock('game/x.rpy', ''));
    expect(setSelectedBlockIds).toHaveBeenCalled();
    expect(setCenterOnBlockRequest).toHaveBeenCalled();
  });

  it('addBlock marks the new block dirty by default', () => {
    const setDirtyBlockIds = vi.fn();
    const { result } = renderHook(() => useBlockManagement(makeParams({ setDirtyBlockIds })));
    act(() => result.current.addBlock('game/x.rpy', ''));
    expect(setDirtyBlockIds).toHaveBeenCalled();
  });

  it('addBlock does not mark the new block dirty when markDirty is false', () => {
    const setDirtyBlockIds = vi.fn();
    const { result } = renderHook(() => useBlockManagement(makeParams({ setDirtyBlockIds })));
    act(() => result.current.addBlock('game/x.rpy', 'content', undefined, { markDirty: false }));
    expect(setDirtyBlockIds).not.toHaveBeenCalled();
  });

  // ── deleteBlock ───────────────────────────────────────────────────────────

  it('deleteBlock calls setBlocks to filter out the block', () => {
    const setBlocks = vi.fn();
    const { result } = renderHook(() => useBlockManagement(makeParams({ setBlocks })));
    act(() => result.current.deleteBlock('block-1'));
    expect(setBlocks).toHaveBeenCalled();
  });

  it('deleteBlock removes the block from any groups', () => {
    const setGroups = vi.fn();
    const { result } = renderHook(() => useBlockManagement(makeParams({ setGroups })));
    act(() => result.current.deleteBlock('block-1'));
    expect(setGroups).toHaveBeenCalled();
  });

  it('deleteBlock resets activeTabId to canvas when deleting the active tab', () => {
    const setActiveTabId = vi.fn();
    const { result } = renderHook(() =>
      useBlockManagement(makeParams({ activeTabId: 'block-1', setActiveTabId })),
    );
    act(() => result.current.deleteBlock('block-1'));
    expect(setActiveTabId).toHaveBeenCalledWith('canvas');
  });

  it('deleteBlock does not change activeTabId when deleting a non-active block', () => {
    const setActiveTabId = vi.fn();
    const { result } = renderHook(() =>
      useBlockManagement(makeParams({ activeTabId: 'canvas', setActiveTabId })),
    );
    act(() => result.current.deleteBlock('block-1'));
    expect(setActiveTabId).not.toHaveBeenCalled();
  });

  it('deleteBlock prunes the tab from the secondary pane too', () => {
    const setSecondaryOpenTabs = vi.fn();
    const { result } = renderHook(() =>
      useBlockManagement(makeParams({ setSecondaryOpenTabs })),
    );
    act(() => result.current.deleteBlock('block-1'));
    expect(setSecondaryOpenTabs).toHaveBeenCalled();
    const updater = setSecondaryOpenTabs.mock.calls[0][0];
    const next = updater([
      { id: 'block-1', type: 'editor', blockId: 'block-1' },
      { id: 'block-2', type: 'editor', blockId: 'block-2' },
    ]);
    expect(next).toEqual([{ id: 'block-2', type: 'editor', blockId: 'block-2' }]);
  });

  it('deleteBlock collapses the split when the deleted block was the only secondary tab', () => {
    const setSecondaryOpenTabs = vi.fn();
    const setSplitLayout = vi.fn();
    const setActivePaneId = vi.fn();
    const setSecondaryActiveTabId = vi.fn();
    const { result } = renderHook(() =>
      useBlockManagement(makeParams({
        setSecondaryOpenTabs, setSplitLayout, setActivePaneId, setSecondaryActiveTabId,
        secondaryActiveTabId: 'block-1',
      })),
    );
    act(() => result.current.deleteBlock('block-1'));
    const updater = setSecondaryOpenTabs.mock.calls[0][0];
    const next = updater([{ id: 'block-1', type: 'editor', blockId: 'block-1' }]);
    expect(next).toEqual([]);
    expect(setSplitLayout).toHaveBeenCalledWith('none');
    expect(setActivePaneId).toHaveBeenCalledWith('primary');
    expect(setSecondaryActiveTabId).toHaveBeenCalledWith('');
  });

  it('deleteBlock leaves secondary tabs untouched when none reference the deleted block', () => {
    const setSecondaryOpenTabs = vi.fn();
    const { result } = renderHook(() =>
      useBlockManagement(makeParams({ setSecondaryOpenTabs })),
    );
    act(() => result.current.deleteBlock('block-1'));
    const updater = setSecondaryOpenTabs.mock.calls[0][0];
    const prev = [{ id: 'block-2', type: 'editor', blockId: 'block-2' }];
    expect(updater(prev)).toBe(prev);
  });

  // ── deleteBlockWithFile ───────────────────────────────────────────────────

  it('deleteBlockWithFile calls openDeleteConfirmModal when block has a filePath', async () => {
    const openDeleteConfirmModal = vi.fn();
    const { result } = renderHook(() =>
      useBlockManagement(makeParams({ openDeleteConfirmModal })),
    );
    await act(async () => result.current.deleteBlockWithFile('block-1'));
    expect(openDeleteConfirmModal).toHaveBeenCalledWith(
      ['game/script.rpy'],
      expect.any(Function),
    );
  });

  it('deleteBlockWithFile calls deleteBlock directly when block is not found', async () => {
    const setBlocks = vi.fn();
    const { result } = renderHook(() =>
      useBlockManagement(makeParams({ blocks: [], setBlocks })),
    );
    await act(async () => result.current.deleteBlockWithFile('nonexistent'));
    expect(setBlocks).toHaveBeenCalled();
  });

  // ── getSelectedFolderForNewBlock ──────────────────────────────────────────

  it('getSelectedFolderForNewBlock returns "game/" when nothing is selected', () => {
    const { result } = renderHook(() => useBlockManagement(makeParams()));
    expect(result.current.getSelectedFolderForNewBlock()).toBe('game/');
  });

  // ── handleCreateBlockConfirm ──────────────────────────────────────────────

  it('handleCreateBlockConfirm calls addBlock and addToast when no electronAPI', async () => {
    Object.defineProperty(window, 'electronAPI', { value: undefined, configurable: true });
    const setBlocks = vi.fn();
    const addToast = vi.fn();
    const { result } = renderHook(() =>
      useBlockManagement(makeParams({ setBlocks, addToast })),
    );
    await act(async () => result.current.handleCreateBlockConfirm('myScene', 'story', 'game'));
    expect(setBlocks).toHaveBeenCalled();
    expect(addToast).toHaveBeenCalledWith(expect.stringContaining('myScene'), 'success');
    installElectronAPI();
  });

  it('handleCreateBlockConfirm strips .rpy extension from name', async () => {
    Object.defineProperty(window, 'electronAPI', { value: undefined, configurable: true });
    const setBlocks = vi.fn();
    const { result } = renderHook(() => useBlockManagement(makeParams({ setBlocks })));
    await act(async () => result.current.handleCreateBlockConfirm('myScene.rpy', 'story', 'game'));
    const updater = setBlocks.mock.calls[0][0];
    const newBlocks = updater([]);
    expect(newBlocks[0].filePath).toBe('myScene.rpy');
    installElectronAPI();
  });

  // ── handleCreateBlockFromCanvas ───────────────────────────────────────────

  it('handleCreateBlockFromCanvas calls openCreateBlockModal with position', () => {
    const openCreateBlockModal = vi.fn();
    const { result } = renderHook(() =>
      useBlockManagement(makeParams({ openCreateBlockModal })),
    );
    act(() => result.current.handleCreateBlockFromCanvas('story', { x: 10, y: 20 }));
    expect(openCreateBlockModal).toHaveBeenCalledWith('story', { x: 10, y: 20 }, 'game/');
  });

  // ── createGroupFromSelection ──────────────────────────────────────────────

  it('createGroupFromSelection returns null when no blocks match the given ids', () => {
    const { result } = renderHook(() => useBlockManagement(makeParams({ blocks: [] })));
    let id: string | null = 'unset';
    act(() => { id = result.current.createGroupFromSelection(['missing']); });
    expect(id).toBeNull();
  });

  it('createGroupFromSelection pushes a new group bounding the selected blocks', () => {
    const setGroups = vi.fn();
    const block = createBlock();
    const { result } = renderHook(() => useBlockManagement(makeParams({ blocks: [block], setGroups })));
    act(() => { result.current.createGroupFromSelection(['block-1']); });
    expect(setGroups).toHaveBeenCalled();
    const updater = setGroups.mock.calls[0][0];
    const draft: import('@/types').BlockGroup[] = [];
    updater(draft);
    expect(draft).toHaveLength(1);
    expect(draft[0].blockIds).toEqual(['block-1']);
    expect(draft[0].position.x).toBeLessThan(block.position.x);
    expect(draft[0].position.y).toBeLessThan(block.position.y);
    expect(draft[0].width).toBeGreaterThan(block.width);
    expect(draft[0].height).toBeGreaterThan(block.height);
  });

  // ── deleteGroup ───────────────────────────────────────────────────────────

  it('deleteGroup calls setGroups to remove the group', () => {
    const setGroups = vi.fn();
    const { result } = renderHook(() => useBlockManagement(makeParams({ setGroups })));
    act(() => result.current.deleteGroup('group-1'));
    expect(setGroups).toHaveBeenCalled();
    const updater = setGroups.mock.calls[0][0];
    const draft = [{ id: 'group-1', title: 'g', position: { x: 0, y: 0 }, width: 1, height: 1, blockIds: [] }];
    updater(draft);
    expect(draft).toHaveLength(0);
  });

  // ── deleteBlocksWithFile ──────────────────────────────────────────────────

  it('deleteBlocksWithFile opens a single confirm modal listing all file paths', async () => {
    const openDeleteConfirmModal = vi.fn();
    const blocks = [
      createBlock({ id: 'block-1', filePath: 'game/a.rpy' }),
      createBlock({ id: 'block-2', filePath: 'game/b.rpy' }),
    ];
    const { result } = renderHook(() =>
      useBlockManagement(makeParams({ blocks, openDeleteConfirmModal })),
    );
    await act(async () => result.current.deleteBlocksWithFile(['block-1', 'block-2']));
    expect(openDeleteConfirmModal).toHaveBeenCalledWith(
      ['game/a.rpy', 'game/b.rpy'],
      expect.any(Function),
    );
  });

  it('deleteBlocksWithFile deletes blocks without a filePath directly, without a confirm modal', async () => {
    const openDeleteConfirmModal = vi.fn();
    const setBlocks = vi.fn();
    const blocks = [createBlock({ id: 'block-1', filePath: undefined })];
    const { result } = renderHook(() =>
      useBlockManagement(makeParams({ blocks, openDeleteConfirmModal, setBlocks })),
    );
    await act(async () => result.current.deleteBlocksWithFile(['block-1']));
    expect(openDeleteConfirmModal).not.toHaveBeenCalled();
    expect(setBlocks).toHaveBeenCalled();
  });
});
