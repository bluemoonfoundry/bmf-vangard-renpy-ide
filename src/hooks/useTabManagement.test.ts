import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTabManagement } from '@/hooks/useTabManagement';
import type { EditorTab } from '@/types';

function makeTab(id: string, type: EditorTab['type'] = 'editor'): EditorTab {
  return { id, type } as EditorTab;
}

describe('useTabManagement', () => {
  it('initializes with a canvas tab in the primary pane', () => {
    const { result } = renderHook(() => useTabManagement());
    expect(result.current.openTabs).toHaveLength(1);
    expect(result.current.openTabs[0].id).toBe('canvas');
    expect(result.current.activeTabId).toBe('canvas');
  });

  it('starts with no secondary tabs', () => {
    const { result } = renderHook(() => useTabManagement());
    expect(result.current.secondaryOpenTabs).toHaveLength(0);
  });

  it('starts with primary pane active', () => {
    const { result } = renderHook(() => useTabManagement());
    expect(result.current.activePaneId).toBe('primary');
  });

  it('starts with no split layout', () => {
    const { result } = renderHook(() => useTabManagement());
    expect(result.current.splitLayout).toBe('none');
  });

  describe('openTab', () => {
    it('adds a new tab to the primary pane', () => {
      const { result } = renderHook(() => useTabManagement());
      act(() => result.current.openTab(makeTab('block-1')));
      expect(result.current.openTabs).toHaveLength(2);
      expect(result.current.activeTabId).toBe('block-1');
    });

    it('switches to existing tab without duplicating it', () => {
      const { result } = renderHook(() => useTabManagement());
      act(() => result.current.openTab(makeTab('block-1')));
      act(() => result.current.openTab(makeTab('block-1')));
      expect(result.current.openTabs).toHaveLength(2);
    });

    it('does not add to secondary pane when splitLayout is none', () => {
      const { result } = renderHook(() => useTabManagement());
      act(() => result.current.openTab(makeTab('block-1'), 'secondary'));
      // splitLayout is none — falls back to primary
      expect(result.current.openTabs).toHaveLength(2);
      expect(result.current.secondaryOpenTabs).toHaveLength(0);
    });
  });

  describe('closeTab', () => {
    it('removes a tab from the primary pane', () => {
      const { result } = renderHook(() => useTabManagement());
      act(() => result.current.openTab(makeTab('block-1')));
      act(() => result.current.closeTab('block-1', 'primary'));
      expect(result.current.openTabs.find(t => t.id === 'block-1')).toBeUndefined();
    });

    it('activates an adjacent tab after closing the active one', () => {
      const { result } = renderHook(() => useTabManagement());
      act(() => result.current.openTab(makeTab('block-1')));
      act(() => result.current.openTab(makeTab('block-2')));
      act(() => result.current.closeTab('block-2', 'primary'));
      expect(result.current.activeTabId).toBe('block-1');
    });
  });

  describe('switchTab', () => {
    it('sets the active tab', () => {
      const { result } = renderHook(() => useTabManagement());
      act(() => result.current.openTab(makeTab('block-1')));
      act(() => result.current.switchTab('canvas', 'primary'));
      expect(result.current.activeTabId).toBe('canvas');
    });
  });

  describe('findTab', () => {
    it('returns null when tab does not exist', () => {
      const { result } = renderHook(() => useTabManagement());
      expect(result.current.findTab('nonexistent')).toBeNull();
    });

    it('finds a tab in the primary pane', () => {
      const { result } = renderHook(() => useTabManagement());
      act(() => result.current.openTab(makeTab('block-1')));
      const found = result.current.findTab('block-1');
      expect(found?.paneId).toBe('primary');
    });
  });

  describe('getActiveTab', () => {
    it('returns the active tab', () => {
      const { result } = renderHook(() => useTabManagement());
      const tab = result.current.getActiveTab();
      expect(tab?.id).toBe('canvas');
    });
  });

  describe('createSplit', () => {
    it('sets split layout to right', () => {
      const { result } = renderHook(() => useTabManagement());
      act(() => result.current.createSplit('right'));
      expect(result.current.splitLayout).toBe('right');
    });

    it('sets split layout to bottom', () => {
      const { result } = renderHook(() => useTabManagement());
      act(() => result.current.createSplit('bottom'));
      expect(result.current.splitLayout).toBe('bottom');
    });
  });

  describe('closeSplit', () => {
    it('resets split layout to none', () => {
      const { result } = renderHook(() => useTabManagement());
      act(() => result.current.createSplit('right'));
      act(() => result.current.closeSplit());
      expect(result.current.splitLayout).toBe('none');
    });
  });

  describe('setSplitSize', () => {
    it('updates splitPrimarySize', () => {
      const { result } = renderHook(() => useTabManagement());
      act(() => result.current.setSplitSize(400));
      expect(result.current.splitPrimarySize).toBe(400);
    });
  });

  describe('updateTab', () => {
    it('updates a tab in the primary pane', () => {
      const { result } = renderHook(() => useTabManagement());
      act(() => result.current.openTab(makeTab('block-1')));
      act(() => result.current.updateTab('block-1', { type: 'canvas' }));
      const tab = result.current.openTabs.find(t => t.id === 'block-1');
      expect(tab?.type).toBe('canvas');
    });
  });

  describe('drag state', () => {
    it('startDrag sets draggedTabId', () => {
      const { result } = renderHook(() => useTabManagement());
      act(() => result.current.startDrag('block-1', 'primary'));
      expect(result.current.draggedTabId).toBe('block-1');
      expect(result.current.dragSourcePaneId).toBe('primary');
    });

    it('endDrag clears draggedTabId', () => {
      const { result } = renderHook(() => useTabManagement());
      act(() => result.current.startDrag('block-1', 'primary'));
      act(() => result.current.endDrag());
      expect(result.current.draggedTabId).toBeNull();
    });
  });
});
