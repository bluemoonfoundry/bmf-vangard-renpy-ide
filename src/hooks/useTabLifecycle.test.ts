import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTabLifecycle } from '@/hooks/useTabLifecycle';
import type { EditorTab } from '@/types';

function makeTab(id: string): EditorTab {
  return { id, type: 'editor' } as EditorTab;
}

function makeProps(overrides: Partial<Parameters<typeof useTabLifecycle>[0]> = {}) {
  return {
    openTabs: [makeTab('canvas'), makeTab('block-1')],
    secondaryOpenTabs: [] as EditorTab[],
    activeTabId: 'block-1',
    secondaryActiveTabId: '',
    splitLayout: 'none' as const,
    draggedTabId: null as string | null,
    dragSourcePaneId: 'primary' as const,
    setOpenTabs: vi.fn(),
    setSecondaryOpenTabs: vi.fn(),
    setActiveTabId: vi.fn(),
    setSecondaryActiveTabId: vi.fn(),
    setActivePaneId: vi.fn(),
    setSplitLayout: vi.fn(),
    setSplitPrimarySize: vi.fn(),
    setDraggedTabId: vi.fn(),
    setDragSourcePaneId: vi.fn(),
    dirtyBlockIds: new Set<string>(),
    dirtyEditors: new Set<string>(),
    setDirtyBlockIds: vi.fn(),
    setDirtyEditors: vi.fn(),
    openUnsavedChangesModal: vi.fn(),
    closeUnsavedChangesModal: vi.fn(),
    handleSaveAll: vi.fn().mockResolvedValue(undefined),
    setHasUnsavedSettings: vi.fn(),
    ...overrides,
  };
}

describe('useTabLifecycle', () => {
  describe('handleCloseTab', () => {
    it('calls setOpenTabs to filter out the closed tab', () => {
      const props = makeProps();
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleCloseTab('block-1', 'primary'));
      expect(props.setOpenTabs).toHaveBeenCalled();
    });

    it('calls setOpenTabs for secondary pane close', () => {
      const props = makeProps({
        secondaryOpenTabs: [makeTab('sec-tab')],
        secondaryActiveTabId: 'sec-tab',
      });
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleCloseTab('sec-tab', 'secondary'));
      expect(props.setSecondaryOpenTabs).toHaveBeenCalled();
    });
  });

  describe('handleSwitchTab', () => {
    it('sets the active tab ID in the primary pane', () => {
      const props = makeProps();
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleSwitchTab('canvas'));
      expect(props.setActiveTabId).toHaveBeenCalledWith('canvas');
    });
  });

  describe('handleCreateSplit', () => {
    it('sets split layout direction', () => {
      const props = makeProps();
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleCreateSplit('right'));
      expect(props.setSplitLayout).toHaveBeenCalledWith('right');
    });
  });

  describe('handleCloseSecondaryPane', () => {
    it('resets split layout to none', () => {
      const props = makeProps({
        splitLayout: 'right',
        secondaryOpenTabs: [makeTab('sec-tab')],
      });
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleCloseSecondaryPane());
      expect(props.setSplitLayout).toHaveBeenCalledWith('none');
    });
  });

  describe('handleTabDragStart', () => {
    it('sets dragged tab ID and source pane', () => {
      const props = makeProps();
      const dragEvent = { dataTransfer: { setData: vi.fn(), effectAllowed: '' } } as unknown as React.DragEvent<HTMLDivElement>;
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleTabDragStart(dragEvent, 'block-1', 'primary'));
      expect(props.setDraggedTabId).toHaveBeenCalledWith('block-1');
      expect(props.setDragSourcePaneId).toHaveBeenCalledWith('primary');
    });
  });

  describe('processTabCloseRequest', () => {
    it('does nothing for empty tab list', () => {
      const props = makeProps();
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.processTabCloseRequest([], 'canvas'));
      expect(props.setOpenTabs).not.toHaveBeenCalled();
    });

    it('opens unsaved changes modal when tab has dirty content', () => {
      const props = makeProps({
        openTabs: [makeTab('canvas'), makeTab('block-1')],
        dirtyBlockIds: new Set(['block-1']),
      });
      const { result } = renderHook(() => useTabLifecycle(props));
      const tabWithBlock: EditorTab = { id: 'block-1', type: 'editor', blockId: 'block-1' } as EditorTab;
      act(() => result.current.processTabCloseRequest([tabWithBlock], 'canvas'));
      expect(props.openUnsavedChangesModal).toHaveBeenCalled();
    });

    it('closes directly when no unsaved changes', () => {
      const props = makeProps();
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.processTabCloseRequest([makeTab('block-1')], 'canvas'));
      expect(props.openUnsavedChangesModal).not.toHaveBeenCalled();
      expect(props.setOpenTabs).toHaveBeenCalled();
    });
  });
});
