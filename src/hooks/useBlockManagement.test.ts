import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBlockManagement } from '@/hooks/useBlockManagement';
import { createBlock, createBlockGroup, createAppSettings } from '@/test/mocks/sampleData';
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
});
