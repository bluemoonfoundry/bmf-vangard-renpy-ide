import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useNotecards } from '@/hooks/useNotecards';
import { createAppSettings } from '@/test/mocks/sampleData';

const baseParams = () => ({
  appSettings: createAppSettings(),
  notecardCanvasTransform: { x: 0, y: 0, scale: 1 },
});

describe('useNotecards', () => {
  it('adds a notecard at the given position, centered on the click point', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    act(() => result.current.addNotecard({ x: 500, y: 300 }));
    expect(result.current.notecards).toHaveLength(1);
    const card = result.current.notecards[0];
    expect(card.position).toEqual({ x: 500 - card.width / 2, y: 300 - card.height / 2 });
    expect(card.color).toBe('yellow');
    expect(card.title).toBe('New Notecard');
  });

  it('updates a notecard by id', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    act(() => result.current.addNotecard({ x: 0, y: 0 }));
    const id = result.current.notecards[0].id;
    act(() => result.current.updateNotecard(id, { title: 'Renamed', color: 'blue' }));
    expect(result.current.notecards[0].title).toBe('Renamed');
    expect(result.current.notecards[0].color).toBe('blue');
  });

  it('deletes a notecard and any links referencing it', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    act(() => {
      result.current.addNotecard({ x: 0, y: 0 });
      result.current.addNotecard({ x: 100, y: 100 });
    });
    const [a, b] = result.current.notecards;
    act(() => result.current.addNotecardLink(a.id, b.id));
    expect(result.current.notecardLinks).toHaveLength(1);
    act(() => result.current.deleteNotecard(a.id));
    expect(result.current.notecards).toHaveLength(1);
    expect(result.current.notecardLinks).toHaveLength(0);
  });

  it('adds, updates, and deletes a link', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    act(() => {
      result.current.addNotecard({ x: 0, y: 0 });
      result.current.addNotecard({ x: 100, y: 100 });
    });
    const [a, b] = result.current.notecards;
    act(() => result.current.addNotecardLink(a.id, b.id));
    const link = result.current.notecardLinks[0];
    expect(link.fromId).toBe(a.id);
    expect(link.toId).toBe(b.id);
    act(() => result.current.updateNotecardLink(link.id, { label: 'foreshadows' }));
    expect(result.current.notecardLinks[0].label).toBe('foreshadows');
    act(() => result.current.deleteNotecardLink(link.id));
    expect(result.current.notecardLinks).toHaveLength(0);
  });

  it('calls onNotecardChange on every mutation', () => {
    const onNotecardChange = vi.fn();
    const { result } = renderHook(() => useNotecards({ ...baseParams(), onNotecardChange }));
    act(() => result.current.addNotecard({ x: 0, y: 0 }));
    expect(onNotecardChange).toHaveBeenCalledTimes(1);
  });
});
