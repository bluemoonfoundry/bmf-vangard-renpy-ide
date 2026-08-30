import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useNotecards, getTimelineSlotLabel, DEFAULT_NOTECARD_TIMELINE_SETTINGS } from '@/hooks/useNotecards';
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

  it('deletes multiple notecards at once and any links touching them', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    act(() => {
      result.current.addNotecard({ x: 0, y: 0 });
      result.current.addNotecard({ x: 100, y: 100 });
      result.current.addNotecard({ x: 200, y: 200 });
    });
    const [a, b, c] = result.current.notecards;
    act(() => result.current.addNotecardLink(a.id, c.id));
    act(() => result.current.deleteNotecards([a.id, b.id]));
    expect(result.current.notecards).toEqual([c]);
    expect(result.current.notecardLinks).toHaveLength(0);
  });

  it('restores previously-deleted notecards and links verbatim (undo)', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    act(() => {
      result.current.addNotecard({ x: 0, y: 0 });
      result.current.addNotecard({ x: 100, y: 100 });
    });
    const [a, b] = result.current.notecards;
    act(() => result.current.addNotecardLink(a.id, b.id));
    const link = result.current.notecardLinks[0];
    act(() => result.current.deleteNotecards([a.id, b.id]));
    expect(result.current.notecards).toHaveLength(0);
    act(() => result.current.restoreNotecards([a, b], [link]));
    expect(result.current.notecards).toEqual(expect.arrayContaining([a, b]));
    expect(result.current.notecardLinks).toEqual([link]);
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

  it('starts with the timeline disabled, using the default settings', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    expect(result.current.timelineSettings).toEqual(DEFAULT_NOTECARD_TIMELINE_SETTINGS);
  });

  it('toggleTimeline flips enabled on and off', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    act(() => result.current.toggleTimeline());
    expect(result.current.timelineSettings.enabled).toBe(true);
    act(() => result.current.toggleTimeline());
    expect(result.current.timelineSettings.enabled).toBe(false);
  });

  it('renameTimelineSlot sets a custom label, overriding the default "Scene N" fallback', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    expect(getTimelineSlotLabel(result.current.timelineSettings, 2)).toBe('Scene 3');
    act(() => result.current.renameTimelineSlot(2, 'The Confrontation'));
    expect(getTimelineSlotLabel(result.current.timelineSettings, 2)).toBe('The Confrontation');
  });

  it('snapNotecardToTimeline snaps X to the nearest slot center and records the slot index', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    // Default timeline: originX 0, slotSpacing 260. Card centered at x=500 -> nearest slot is
    // round(500/260) = 2, whose center is at x=520.
    act(() => result.current.addNotecard({ x: 500, y: 300 }));
    const id = result.current.notecards[0].id;
    act(() => result.current.snapNotecardToTimeline(id));
    const card = result.current.notecards[0];
    expect(card.timelineSlot).toBe(2);
    expect(card.position.x + card.width / 2).toBe(520);
  });

  it('clearNotecardTimelineSlot removes the slot assignment', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    act(() => result.current.addNotecard({ x: 500, y: 300 }));
    const id = result.current.notecards[0].id;
    act(() => result.current.snapNotecardToTimeline(id));
    expect(result.current.notecards[0].timelineSlot).toBe(2);
    act(() => result.current.clearNotecardTimelineSlot(id));
    expect(result.current.notecards[0].timelineSlot).toBeUndefined();
  });
});
