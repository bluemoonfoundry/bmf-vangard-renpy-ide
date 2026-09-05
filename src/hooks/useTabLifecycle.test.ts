import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTabLifecycle } from '@/hooks/useTabLifecycle';
import type { ClosedTabEntry, EditorTab } from '@/types';

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
    closedTabsStack: [] as ClosedTabEntry[],
    setClosedTabsStack: vi.fn(),
    poppedOutTabs: new Map<string, { tab: EditorTab; paneId: 'primary' | 'secondary'; index: number }>(),
    setPoppedOutTabs: vi.fn(),
    dirtyBlockIds: new Set<string>(),
    dirtyEditors: new Set<string>(),
    setDirtyBlockIds: vi.fn(),
    setDirtyEditors: vi.fn(),
    untitledFiles: new Map(),
    saveUntitledFile: vi.fn().mockResolvedValue(true),
    discardUntitledFile: vi.fn(),
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

    it('pushes the closed tab onto the closed-tabs stack with its pane and index', () => {
      const setClosedTabsStack = vi.fn();
      const props = makeProps({ setClosedTabsStack });
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleCloseTab('block-1', 'primary'));
      expect(setClosedTabsStack).toHaveBeenCalled();
      const updater = setClosedTabsStack.mock.calls[0][0];
      expect(updater([])).toEqual([{ tab: makeTab('block-1'), paneId: 'primary', index: 1 }]);
    });

    it('does not push untitled tabs onto the closed-tabs stack', () => {
      const props = makeProps({
        openTabs: [makeTab('canvas'), { id: 'untitled-1', type: 'untitled' } as EditorTab],
      });
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleCloseTab('untitled-1', 'primary'));
      expect(props.setClosedTabsStack).not.toHaveBeenCalled();
    });
  });

  describe('handleReopenClosedTab', () => {
    it('does nothing when the stack is empty', () => {
      const props = makeProps({ closedTabsStack: [] });
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleReopenClosedTab());
      expect(props.setOpenTabs).not.toHaveBeenCalled();
      expect(props.setClosedTabsStack).not.toHaveBeenCalled();
    });

    it('reinserts the most recently closed tab at its original index and focuses it', () => {
      const entry: ClosedTabEntry = { tab: makeTab('block-2'), paneId: 'primary', index: 1 };
      const setClosedTabsStack = vi.fn();
      const setOpenTabs = vi.fn();
      const props = makeProps({ closedTabsStack: [entry], setClosedTabsStack, setOpenTabs });
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleReopenClosedTab());

      const popUpdater = setClosedTabsStack.mock.calls[0][0];
      expect(popUpdater([entry])).toEqual([]);

      const insertUpdater = setOpenTabs.mock.calls[0][0];
      expect(insertUpdater(props.openTabs)).toEqual([makeTab('canvas'), makeTab('block-2'), makeTab('block-1')]);
      expect(props.setActiveTabId).toHaveBeenCalledWith('block-2');
      expect(props.setActivePaneId).toHaveBeenCalledWith('primary');
    });

    it('just focuses the tab instead of duplicating it if already reopened elsewhere', () => {
      const entry: ClosedTabEntry = { tab: makeTab('block-1'), paneId: 'primary', index: 1 };
      const props = makeProps({ closedTabsStack: [entry] }); // block-1 is already in openTabs
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleReopenClosedTab());

      expect(props.setOpenTabs).not.toHaveBeenCalled();
      expect(props.setActiveTabId).toHaveBeenCalledWith('block-1');
    });

    it('falls back to the primary pane when the closed tab came from a since-closed split', () => {
      const entry: ClosedTabEntry = { tab: makeTab('sec-tab'), paneId: 'secondary', index: 0 };
      const setOpenTabs = vi.fn();
      const props = makeProps({ closedTabsStack: [entry], splitLayout: 'none', setOpenTabs });
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleReopenClosedTab());

      const insertUpdater = setOpenTabs.mock.calls[0][0];
      expect(insertUpdater(props.openTabs)).toEqual([makeTab('sec-tab'), makeTab('canvas'), makeTab('block-1')]);
      expect(props.setActivePaneId).toHaveBeenCalledWith('primary');
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

  describe('handleTabDragEnd', () => {
    it('pops the tab out when the drag ends with no drop target accepting it', () => {
      const setPoppedOutTabs = vi.fn();
      const props = makeProps({ draggedTabId: 'block-1', setPoppedOutTabs });
      const dragEvent = { dataTransfer: { dropEffect: 'none' } } as unknown as React.DragEvent<HTMLDivElement>;
      const { result } = renderHook(() => useTabLifecycle(props));
      // No dragover ever ran (dropEffect left at its incidental default), so the
      // explicit valid-drop-target flag is still unset -- this should pop out.
      act(() => result.current.handleTabDragEnd(dragEvent, 'block-1', 'primary'));
      expect(setPoppedOutTabs).toHaveBeenCalled();
      expect(props.setDraggedTabId).toHaveBeenCalledWith(null);
    });

    it('does not pop the tab out when a recognized drop target ran its dragover handler', () => {
      const setPoppedOutTabs = vi.fn();
      const props = makeProps({ draggedTabId: 'block-1', setPoppedOutTabs });
      const dragEvent = { preventDefault: vi.fn(), dataTransfer: { dropEffect: 'move' } } as unknown as React.DragEvent<HTMLDivElement>;
      const { result } = renderHook(() => useTabLifecycle(props));
      // Simulate landing on another tab: its dragover handler flips the explicit flag.
      act(() => result.current.handleTabDragOver(dragEvent, 'canvas'));
      act(() => result.current.handleTabDragEnd(dragEvent, 'block-1', 'primary'));
      expect(setPoppedOutTabs).not.toHaveBeenCalled();
      expect(props.setDraggedTabId).toHaveBeenCalledWith(null);
    });

    it('does not pop the tab out when the tab strip itself ran its dragover handler', () => {
      const setPoppedOutTabs = vi.fn();
      const props = makeProps({ draggedTabId: 'block-1', setPoppedOutTabs });
      const dragEvent = { preventDefault: vi.fn(), dataTransfer: { dropEffect: 'move' } } as unknown as React.DragEvent<HTMLDivElement>;
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleTabStripDragOver(dragEvent));
      act(() => result.current.handleTabDragEnd(dragEvent, 'block-1', 'primary'));
      expect(setPoppedOutTabs).not.toHaveBeenCalled();
    });

    it('resets the valid-drop-target flag on the next drag start, so a stale flag cannot suppress a later pop-out', () => {
      const setPoppedOutTabs = vi.fn();
      const props = makeProps({ draggedTabId: 'block-1', setPoppedOutTabs });
      const overEvent = { preventDefault: vi.fn(), dataTransfer: { dropEffect: 'move' } } as unknown as React.DragEvent<HTMLDivElement>;
      const endEvent = { dataTransfer: { dropEffect: 'none' } } as unknown as React.DragEvent<HTMLDivElement>;
      const startEvent = { dataTransfer: { effectAllowed: '', setData: vi.fn() } } as unknown as React.DragEvent<HTMLDivElement>;
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleTabDragOver(overEvent, 'canvas'));
      act(() => result.current.handleTabDragStart(startEvent, 'block-1', 'primary'));
      act(() => result.current.handleTabDragEnd(endEvent, 'block-1', 'primary'));
      expect(setPoppedOutTabs).toHaveBeenCalled();
    });

    it('does nothing when the dragged tab is no longer in the pane (already closed mid-drag)', () => {
      const setPoppedOutTabs = vi.fn();
      const props = makeProps({ draggedTabId: 'gone-tab', setPoppedOutTabs });
      const dragEvent = { dataTransfer: { dropEffect: 'none' } } as unknown as React.DragEvent<HTMLDivElement>;
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleTabDragEnd(dragEvent, 'gone-tab', 'primary'));
      expect(setPoppedOutTabs).not.toHaveBeenCalled();
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

    it('pushes each closed tab onto the closed-tabs stack, skipping untitled tabs', () => {
      const untitledTab: EditorTab = { id: 'untitled-1', type: 'untitled', title: 'Untitled-1' } as EditorTab;
      const setClosedTabsStack = vi.fn();
      const props = makeProps({
        openTabs: [makeTab('canvas'), makeTab('block-1'), untitledTab],
        setClosedTabsStack,
      });
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.processTabCloseRequest([makeTab('block-1'), untitledTab], 'canvas'));
      const updater = setClosedTabsStack.mock.calls[0][0];
      expect(updater([])).toEqual([{ tab: makeTab('block-1'), paneId: 'primary', index: 1 }]);
    });

    it('opens unsaved changes modal when dirtyEditors contains the blockId', () => {
      const props = makeProps({
        openTabs: [makeTab('canvas'), makeTab('block-1')],
        dirtyEditors: new Set(['block-1']),
      });
      const { result } = renderHook(() => useTabLifecycle(props));
      const tabWithBlock: EditorTab = { id: 'block-1', type: 'editor', blockId: 'block-1' } as EditorTab;
      act(() => result.current.processTabCloseRequest([tabWithBlock], 'canvas'));
      expect(props.openUnsavedChangesModal).toHaveBeenCalled();
    });

    it('opens unsaved changes modal for a dirty untitled tab even with no dirty real blocks', () => {
      const untitledTab: EditorTab = { id: 'untitled-1', type: 'untitled', title: 'Untitled-1' } as EditorTab;
      const props = makeProps({
        openTabs: [untitledTab],
        untitledFiles: new Map([['untitled-1', { title: 'Untitled-1', content: 'x', isDirty: true }]]),
      });
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.processTabCloseRequest([untitledTab], 'canvas'));
      expect(props.openUnsavedChangesModal).toHaveBeenCalled();
    });

    it('closes directly when the only untitled tab in the batch is not dirty', () => {
      const untitledTab: EditorTab = { id: 'untitled-1', type: 'untitled', title: 'Untitled-1' } as EditorTab;
      const props = makeProps({
        openTabs: [untitledTab],
        untitledFiles: new Map([['untitled-1', { title: 'Untitled-1', content: '', isDirty: false }]]),
      });
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.processTabCloseRequest([untitledTab], 'canvas'));
      expect(props.openUnsavedChangesModal).not.toHaveBeenCalled();
      expect(props.setOpenTabs).toHaveBeenCalled();
    });

    it('on confirm, saves the dirty untitled tab and closes it once saved', async () => {
      const untitledTab: EditorTab = { id: 'untitled-1', type: 'untitled', title: 'Untitled-1' } as EditorTab;
      const saveUntitledFile = vi.fn().mockResolvedValue(true);
      const setOpenTabs = vi.fn();
      const openUnsavedChangesModal = vi.fn();
      const props = makeProps({
        openTabs: [untitledTab],
        untitledFiles: new Map([['untitled-1', { title: 'Untitled-1', content: 'x', isDirty: true }]]),
        saveUntitledFile, setOpenTabs, openUnsavedChangesModal,
      });
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.processTabCloseRequest([untitledTab], 'canvas'));

      const { onConfirm } = openUnsavedChangesModal.mock.calls[0][0];
      await act(async () => { await onConfirm(); });

      expect(saveUntitledFile).toHaveBeenCalledWith('untitled-1');
      const updater = setOpenTabs.mock.calls[setOpenTabs.mock.calls.length - 1][0] as (prev: EditorTab[]) => EditorTab[];
      expect(updater([untitledTab])).toEqual([]);
    });

    it('on confirm, keeps a dirty untitled tab open if its save dialog was canceled', async () => {
      const untitledTab: EditorTab = { id: 'untitled-1', type: 'untitled', title: 'Untitled-1' } as EditorTab;
      const saveUntitledFile = vi.fn().mockResolvedValue(false);
      const setOpenTabs = vi.fn();
      const openUnsavedChangesModal = vi.fn();
      const props = makeProps({
        openTabs: [untitledTab],
        untitledFiles: new Map([['untitled-1', { title: 'Untitled-1', content: 'x', isDirty: true }]]),
        saveUntitledFile, setOpenTabs, openUnsavedChangesModal,
      });
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.processTabCloseRequest([untitledTab], 'canvas'));

      const { onConfirm } = openUnsavedChangesModal.mock.calls[0][0];
      await act(async () => { await onConfirm(); });

      expect(saveUntitledFile).toHaveBeenCalledWith('untitled-1');
      const updater = setOpenTabs.mock.calls[setOpenTabs.mock.calls.length - 1][0] as (prev: EditorTab[]) => EditorTab[];
      expect(updater([untitledTab])).toEqual([untitledTab]);
    });

    it('on "Don\'t Save", discards the untitled draft and closes the tab', () => {
      const untitledTab: EditorTab = { id: 'untitled-1', type: 'untitled', title: 'Untitled-1' } as EditorTab;
      const discardUntitledFile = vi.fn();
      const setOpenTabs = vi.fn();
      const openUnsavedChangesModal = vi.fn();
      const props = makeProps({
        openTabs: [untitledTab],
        untitledFiles: new Map([['untitled-1', { title: 'Untitled-1', content: 'x', isDirty: true }]]),
        discardUntitledFile, setOpenTabs, openUnsavedChangesModal,
      });
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.processTabCloseRequest([untitledTab], 'canvas'));

      const { onDontSave } = openUnsavedChangesModal.mock.calls[0][0];
      act(() => onDontSave());

      expect(discardUntitledFile).toHaveBeenCalledWith('untitled-1');
      expect(setOpenTabs).toHaveBeenCalled();
    });
  });

  describe('handleCloseOthersRequest', () => {
    it('requests close of all tabs except the given one', () => {
      const props = makeProps({
        openTabs: [makeTab('canvas'), makeTab('block-1'), makeTab('block-2')],
        activeTabId: 'block-2',
      });
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleCloseOthersRequest('block-1'));
      // setOpenTabs should be called (for the close of canvas + block-2)
      expect(props.setOpenTabs).toHaveBeenCalled();
    });
  });

  describe('handleCloseAllRequest', () => {
    it('closes all tabs in the pane', () => {
      const props = makeProps({
        openTabs: [makeTab('canvas'), makeTab('block-1'), makeTab('block-2')],
      });
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleCloseAllRequest('primary'));
      expect(props.setOpenTabs).toHaveBeenCalled();
    });
  });

  describe('handleCloseLeftRequest', () => {
    it('closes tabs to the left of the given tab', () => {
      const props = makeProps({
        openTabs: [makeTab('canvas'), makeTab('block-1'), makeTab('block-2')],
        activeTabId: 'block-2',
      });
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleCloseLeftRequest('block-1'));
      // canvas is to the left of block-1 — should be closed
      expect(props.setOpenTabs).toHaveBeenCalled();
    });

    it('does nothing when tab is not found', () => {
      const props = makeProps();
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleCloseLeftRequest('nonexistent'));
      expect(props.setOpenTabs).not.toHaveBeenCalled();
    });
  });

  describe('handleCloseRightRequest', () => {
    it('closes tabs to the right of the given tab', () => {
      const props = makeProps({
        openTabs: [makeTab('canvas'), makeTab('block-1'), makeTab('block-2')],
        activeTabId: 'canvas',
      });
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleCloseRightRequest('block-1'));
      // block-2 is to the right of block-1 — should be closed
      expect(props.setOpenTabs).toHaveBeenCalled();
    });
  });

  describe('handleMoveToOtherPane', () => {
    it('removes tab from primary pane and adds to secondary', () => {
      const props = makeProps({
        openTabs: [makeTab('canvas'), makeTab('block-1')],
        secondaryOpenTabs: [],
      });
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleMoveToOtherPane('block-1', 'primary'));
      expect(props.setOpenTabs).toHaveBeenCalled();
      expect(props.setSecondaryOpenTabs).toHaveBeenCalled();
    });

    it('removes tab from secondary pane and adds to primary', () => {
      const props = makeProps({
        openTabs: [makeTab('canvas')],
        secondaryOpenTabs: [makeTab('block-1'), makeTab('block-2')],
        secondaryActiveTabId: 'block-1',
      });
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleMoveToOtherPane('block-1', 'secondary'));
      expect(props.setOpenTabs).toHaveBeenCalled();
    });
  });

  describe('handleOpenInSplit', () => {
    it('moves tab from primary to secondary and sets split layout', () => {
      const props = makeProps({
        openTabs: [makeTab('canvas'), makeTab('block-1')],
        splitLayout: 'none',
      });
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleOpenInSplit('block-1', 'right'));
      expect(props.setSplitLayout).toHaveBeenCalledWith('right');
      expect(props.setSecondaryOpenTabs).toHaveBeenCalled();
    });
  });

  describe('handleSwitchTab in secondary pane', () => {
    it('calls setSecondaryActiveTabId when pane is secondary', () => {
      const props = makeProps();
      const { result } = renderHook(() => useTabLifecycle(props));
      act(() => result.current.handleSwitchTab('block-1', 'secondary'));
      expect(props.setSecondaryActiveTabId).toHaveBeenCalledWith('block-1');
    });
  });
});
