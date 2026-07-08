import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useVirtualList } from '@/hooks/useVirtualList';

describe('useVirtualList', () => {
  it('returns all items when list fits within default container height', () => {
    const items = ['a', 'b', 'c'];
    const { result } = renderHook(() => useVirtualList(items, 50));
    // default container height 400, 3 items * 50px = 150 — all visible
    expect(result.current.virtualItems.length).toBe(3);
  });

  it('totalHeight equals items.length * itemHeight', () => {
    const items = [1, 2, 3, 4, 5];
    const { result } = renderHook(() => useVirtualList(items, 30));
    expect(result.current.totalHeight).toBe(150);
  });

  it('returns empty virtualItems and zero totalHeight for empty list', () => {
    const { result } = renderHook(() => useVirtualList([], 40));
    expect(result.current.virtualItems).toEqual([]);
    expect(result.current.totalHeight).toBe(0);
  });

  it('virtualItems have correct offsetTop values', () => {
    const items = ['x', 'y', 'z'];
    const { result } = renderHook(() => useVirtualList(items, 20));
    const offsets = result.current.virtualItems.map(v => v.offsetTop);
    expect(offsets).toEqual([0, 20, 40]);
  });

  it('virtualItems carry the original items', () => {
    const items = ['alpha', 'beta'];
    const { result } = renderHook(() => useVirtualList(items, 100));
    expect(result.current.virtualItems[0].item).toBe('alpha');
    expect(result.current.virtualItems[1].item).toBe('beta');
  });

  it('virtualItems have correct index values', () => {
    const items = ['a', 'b', 'c'];
    const { result } = renderHook(() => useVirtualList(items, 10));
    expect(result.current.virtualItems.map(v => v.index)).toEqual([0, 1, 2]);
  });

  it('handleScroll is a stable function reference', () => {
    const { result, rerender } = renderHook(() => useVirtualList(['a', 'b'], 50));
    const fn1 = result.current.handleScroll;
    rerender();
    expect(result.current.handleScroll).toBe(fn1);
  });

  it('containerRef is initially null', () => {
    const { result } = renderHook(() => useVirtualList(['a'], 50));
    expect(result.current.containerRef.current).toBeNull();
  });
});
