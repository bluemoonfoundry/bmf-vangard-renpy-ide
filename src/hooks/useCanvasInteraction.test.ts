/**
 * @file hooks/useCanvasInteraction.test.ts
 * @description Tests for useCanvasInteraction — canvas state, selection, highlights, and action requests.
 *
 * Note: This hook manages viewport transforms and interaction state but does NOT
 * implement raw pointer-event listeners (those live in StoryCanvas/RouteCanvas components).
 * All state paths are fully testable with renderHook + act.
 * Pointer-capture internals (setPointerCapture, releasePointerCapture) are not tested here
 * since they belong to the component layer.
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCanvasInteraction } from '@/hooks/useCanvasInteraction';

// ============================================================================
// Initial state
// ============================================================================

describe('useCanvasInteraction — initial state', () => {
  it('initialises all three canvas transforms to origin scale 1', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    expect(result.current.storyCanvasTransform).toEqual({ x: 0, y: 0, scale: 1 });
    expect(result.current.routeCanvasTransform).toEqual({ x: 0, y: 0, scale: 1 });
    expect(result.current.choiceCanvasTransform).toEqual({ x: 0, y: 0, scale: 1 });
  });

  it('initialises selection as empty arrays', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    expect(result.current.selectedBlockIds).toEqual([]);
    expect(result.current.selectedGroupIds).toEqual([]);
  });

  it('initialises highlight state as null', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    expect(result.current.findUsagesHighlightIds).toBeNull();
    expect(result.current.hoverHighlightIds).toBeNull();
  });

  it('initialises all request states as null', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    expect(result.current.centerOnBlockRequest).toBeNull();
    expect(result.current.centerOnRouteStartRequest).toBeNull();
    expect(result.current.centerOnChoiceStartRequest).toBeNull();
    expect(result.current.centerOnRouteNodeRequest).toBeNull();
    expect(result.current.centerOnChoiceNodeRequest).toBeNull();
    expect(result.current.flashBlockRequest).toBeNull();
  });

  it('initialises canvas filters with expected defaults', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    expect(result.current.canvasFilters).toEqual({
      story: true,
      screens: true,
      config: false,
      notes: true,
      minimap: true,
    });
  });
});

// ============================================================================
// Transform state
// ============================================================================

describe('useCanvasInteraction — canvas transforms', () => {
  it('setStoryCanvasTransform updates the story transform', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.setStoryCanvasTransform({ x: 100, y: 50, scale: 1.5 }));
    expect(result.current.storyCanvasTransform).toEqual({ x: 100, y: 50, scale: 1.5 });
  });

  it('setRouteCanvasTransform updates the route transform', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.setRouteCanvasTransform({ x: -200, y: 0, scale: 0.75 }));
    expect(result.current.routeCanvasTransform).toEqual({ x: -200, y: 0, scale: 0.75 });
  });

  it('setChoiceCanvasTransform updates the choice transform', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.setChoiceCanvasTransform({ x: 0, y: 300, scale: 2 }));
    expect(result.current.choiceCanvasTransform).toEqual({ x: 0, y: 300, scale: 2 });
  });

  it('transforms are independent — updating one does not affect others', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.setStoryCanvasTransform({ x: 999, y: 999, scale: 3 }));
    expect(result.current.routeCanvasTransform).toEqual({ x: 0, y: 0, scale: 1 });
    expect(result.current.choiceCanvasTransform).toEqual({ x: 0, y: 0, scale: 1 });
  });
});

// ============================================================================
// Selection operations
// ============================================================================

describe('useCanvasInteraction — selectBlocks', () => {
  it('sets selectedBlockIds to the given array', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.selectBlocks(['block-1', 'block-2']));
    expect(result.current.selectedBlockIds).toEqual(['block-1', 'block-2']);
  });

  it('replaces previous selection', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.selectBlocks(['block-1']));
    act(() => result.current.selectBlocks(['block-2', 'block-3']));
    expect(result.current.selectedBlockIds).toEqual(['block-2', 'block-3']);
  });
});

describe('useCanvasInteraction — selectGroups', () => {
  it('sets selectedGroupIds', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.selectGroups(['group-1']));
    expect(result.current.selectedGroupIds).toEqual(['group-1']);
  });
});

describe('useCanvasInteraction — toggleBlockSelection', () => {
  it('adds a block to an empty selection', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.toggleBlockSelection('block-1'));
    expect(result.current.selectedBlockIds).toContain('block-1');
  });

  it('removes a block that is already selected', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.selectBlocks(['block-1', 'block-2']));
    act(() => result.current.toggleBlockSelection('block-1'));
    expect(result.current.selectedBlockIds).not.toContain('block-1');
    expect(result.current.selectedBlockIds).toContain('block-2');
  });

  it('adds a block to a partial selection', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.selectBlocks(['block-1']));
    act(() => result.current.toggleBlockSelection('block-2'));
    expect(result.current.selectedBlockIds).toEqual(['block-1', 'block-2']);
  });
});

describe('useCanvasInteraction — clearSelection', () => {
  it('clears both blockIds and groupIds', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => {
      result.current.selectBlocks(['block-1', 'block-2']);
      result.current.selectGroups(['group-1']);
    });
    act(() => result.current.clearSelection());
    expect(result.current.selectedBlockIds).toEqual([]);
    expect(result.current.selectedGroupIds).toEqual([]);
  });
});

// ============================================================================
// Highlight state
// ============================================================================

describe('useCanvasInteraction — highlight state', () => {
  it('setFindUsagesHighlightIds stores a Set', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.setFindUsagesHighlightIds(new Set(['block-1', 'block-2'])));
    expect(result.current.findUsagesHighlightIds?.has('block-1')).toBe(true);
  });

  it('setHoverHighlightIds stores a Set', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.setHoverHighlightIds(new Set(['block-3'])));
    expect(result.current.hoverHighlightIds?.has('block-3')).toBe(true);
  });

  it('highlight state can be cleared to null', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.setFindUsagesHighlightIds(new Set(['block-1'])));
    act(() => result.current.setFindUsagesHighlightIds(null));
    expect(result.current.findUsagesHighlightIds).toBeNull();
  });
});

// ============================================================================
// Center/flash action requests
// ============================================================================

describe('useCanvasInteraction — centerOnBlock', () => {
  it('sets centerOnBlockRequest with the given blockId and a key', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.centerOnBlock('block-42'));
    expect(result.current.centerOnBlockRequest?.blockId).toBe('block-42');
    expect(typeof result.current.centerOnBlockRequest?.key).toBe('number');
  });

  it('each call produces a new (or equal) key, ensuring React re-render', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.centerOnBlock('block-1'));
    const key1 = result.current.centerOnBlockRequest?.key;
    act(() => result.current.centerOnBlock('block-1'));
    const key2 = result.current.centerOnBlockRequest?.key;
    // key2 >= key1 (Date.now based)
    expect(key2).toBeGreaterThanOrEqual(key1!);
  });
});

describe('useCanvasInteraction — flashBlock', () => {
  it('sets flashBlockRequest with the given blockId', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.flashBlock('block-7'));
    expect(result.current.flashBlockRequest?.blockId).toBe('block-7');
  });
});

describe('useCanvasInteraction — centerOnRouteNode', () => {
  it('sets centerOnRouteNodeRequest with the given nodeId', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.centerOnRouteNode('node-1'));
    expect(result.current.centerOnRouteNodeRequest?.nodeId).toBe('node-1');
  });
});

describe('useCanvasInteraction — centerOnChoiceNode', () => {
  it('sets centerOnChoiceNodeRequest with the given nodeId', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.centerOnChoiceNode('node-5'));
    expect(result.current.centerOnChoiceNodeRequest?.nodeId).toBe('node-5');
  });
});

describe('useCanvasInteraction — centerOnRouteStart', () => {
  it('sets centerOnRouteStartRequest with a key', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.centerOnRouteStart());
    expect(typeof result.current.centerOnRouteStartRequest?.key).toBe('number');
  });
});

describe('useCanvasInteraction — centerOnChoiceStart', () => {
  it('sets centerOnChoiceStartRequest with a key', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.centerOnChoiceStart());
    expect(typeof result.current.centerOnChoiceStartRequest?.key).toBe('number');
  });
});

// ============================================================================
// Canvas filters
// ============================================================================

describe('useCanvasInteraction — canvasFilters', () => {
  it('setCanvasFilters replaces the filter object', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() =>
      result.current.setCanvasFilters({
        story: false,
        screens: false,
        config: true,
        notes: false,
        minimap: false,
      })
    );
    expect(result.current.canvasFilters).toEqual({
      story: false,
      screens: false,
      config: true,
      notes: false,
      minimap: false,
    });
  });

  it('partial update via functional setter preserves other fields', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() =>
      result.current.setCanvasFilters(prev => ({ ...prev, config: true }))
    );
    expect(result.current.canvasFilters.config).toBe(true);
    expect(result.current.canvasFilters.story).toBe(true); // default preserved
  });
});

// ============================================================================
// Direct request setters
// ============================================================================

describe('useCanvasInteraction — direct request setters', () => {
  it('setCenterOnBlockRequest sets null (clears)', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.centerOnBlock('block-1'));
    act(() => result.current.setCenterOnBlockRequest(null));
    expect(result.current.centerOnBlockRequest).toBeNull();
  });

  it('setFlashBlockRequest sets null (clears)', () => {
    const { result } = renderHook(() => useCanvasInteraction());
    act(() => result.current.flashBlock('block-1'));
    act(() => result.current.setFlashBlockRequest(null));
    expect(result.current.flashBlockRequest).toBeNull();
  });
});
