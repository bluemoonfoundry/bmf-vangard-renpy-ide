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

  it('starts with an empty timeline (no slot labels)', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    expect(result.current.timelineSettings).toEqual(DEFAULT_NOTECARD_TIMELINE_SETTINGS);
  });

  it('renameTimelineSlot sets a custom label, overriding the default "Scene N" fallback', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    expect(getTimelineSlotLabel(result.current.timelineSettings, 2)).toBe('Scene 3');
    act(() => result.current.renameTimelineSlot(2, 'The Confrontation'));
    expect(getTimelineSlotLabel(result.current.timelineSettings, 2)).toBe('The Confrontation');
  });

  it('moveNotecardWithinTimeline pins an Unsorted card into a column at the given index', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    act(() => result.current.addNotecard({ x: 0, y: 0 }));
    const id = result.current.notecards[0].id;
    act(() => result.current.moveNotecardWithinTimeline(id, 2, 0));
    const card = result.current.notecards[0];
    expect(card.timelineSlot).toBe(2);
    expect(card.timelineOrder).toBe(0);
  });

  it('moveNotecardWithinTimeline inserts among existing cards in the destination column and renormalizes their order', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    act(() => {
      result.current.addNotecard({ x: 0, y: 0 });
      result.current.addNotecard({ x: 0, y: 0 });
      result.current.addNotecard({ x: 0, y: 0 });
    });
    const [a, b, c] = result.current.notecards;
    act(() => {
      result.current.moveNotecardWithinTimeline(a.id, 0, 0);
      result.current.moveNotecardWithinTimeline(b.id, 0, 1);
    });
    // Insert c between a and b.
    act(() => result.current.moveNotecardWithinTimeline(c.id, 0, 1));
    const order = Object.fromEntries(result.current.notecards.map(n => [n.id, n.timelineOrder]));
    expect(order[a.id]).toBe(0);
    expect(order[c.id]).toBe(1);
    expect(order[b.id]).toBe(2);
  });

  it('moveNotecardWithinTimeline closes the gap in the source column when moving a card to a different column', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    act(() => {
      result.current.addNotecard({ x: 0, y: 0 });
      result.current.addNotecard({ x: 0, y: 0 });
    });
    const [a, b] = result.current.notecards;
    act(() => {
      result.current.moveNotecardWithinTimeline(a.id, 0, 0);
      result.current.moveNotecardWithinTimeline(b.id, 0, 1);
    });
    act(() => result.current.moveNotecardWithinTimeline(a.id, 1, 0));
    const updated = Object.fromEntries(result.current.notecards.map(n => [n.id, { slot: n.timelineSlot, order: n.timelineOrder }]));
    expect(updated[a.id]).toEqual({ slot: 1, order: 0 });
    expect(updated[b.id]).toEqual({ slot: 0, order: 0 });
  });

  it('unassignNotecardFromTimeline clears the slot assignment, optionally repositioning the card, and closes the gap left behind', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    act(() => {
      result.current.addNotecard({ x: 0, y: 0 });
      result.current.addNotecard({ x: 0, y: 0 });
    });
    const [a, b] = result.current.notecards;
    act(() => {
      result.current.moveNotecardWithinTimeline(a.id, 0, 0);
      result.current.moveNotecardWithinTimeline(b.id, 0, 1);
    });
    act(() => result.current.unassignNotecardFromTimeline(a.id, { x: 42, y: 7 }));
    const updatedA = result.current.notecards.find(n => n.id === a.id)!;
    expect(updatedA.timelineSlot).toBeUndefined();
    expect(updatedA.timelineOrder).toBeUndefined();
    expect(updatedA.position).toEqual({ x: 42, y: 7 });
    const updatedB = result.current.notecards.find(n => n.id === b.id)!;
    expect(updatedB.timelineOrder).toBe(0);
  });

  it('insertTimelineSlot shifts cards at or past the insertion point up by one, leaving earlier cards alone', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    act(() => {
      result.current.addNotecard({ x: 0, y: 0 });
      result.current.addNotecard({ x: 100, y: 0 });
      result.current.addNotecard({ x: 200, y: 0 });
    });
    const [a, b, c] = result.current.notecards;
    act(() => {
      result.current.updateNotecard(a.id, { timelineSlot: 0 });
      result.current.updateNotecard(b.id, { timelineSlot: 1 });
      result.current.updateNotecard(c.id, { timelineSlot: 2 });
    });
    act(() => result.current.insertTimelineSlot(1));
    const bySlot = Object.fromEntries(result.current.notecards.map(n => [n.id, n.timelineSlot]));
    expect(bySlot[a.id]).toBe(0);
    expect(bySlot[b.id]).toBe(2);
    expect(bySlot[c.id]).toBe(3);
  });

  it('insertTimelineSlot shifts existing slot labels to match', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    act(() => {
      result.current.renameTimelineSlot(0, 'Opening');
      result.current.renameTimelineSlot(1, 'Confrontation');
    });
    act(() => result.current.insertTimelineSlot(1));
    expect(getTimelineSlotLabel(result.current.timelineSettings, 0)).toBe('Opening');
    expect(getTimelineSlotLabel(result.current.timelineSettings, 1)).toBe('Scene 2');
    expect(getTimelineSlotLabel(result.current.timelineSettings, 2)).toBe('Confrontation');
  });

  it('deleteTimelineSlot unassigns cards in that slot and shifts later cards down by one', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    act(() => {
      result.current.addNotecard({ x: 0, y: 0 });
      result.current.addNotecard({ x: 100, y: 0 });
      result.current.addNotecard({ x: 200, y: 0 });
    });
    const [a, b, c] = result.current.notecards;
    act(() => {
      result.current.updateNotecard(a.id, { timelineSlot: 0 });
      result.current.updateNotecard(b.id, { timelineSlot: 1 });
      result.current.updateNotecard(c.id, { timelineSlot: 2 });
    });
    act(() => result.current.deleteTimelineSlot(1));
    const bySlot = Object.fromEntries(result.current.notecards.map(n => [n.id, n.timelineSlot]));
    expect(bySlot[a.id]).toBe(0);
    expect(bySlot[b.id]).toBeUndefined();
    expect(bySlot[c.id]).toBe(1);
  });

  it('deleteTimelineSlot drops the deleted slot\'s label and shifts later labels down', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    act(() => {
      result.current.renameTimelineSlot(0, 'Opening');
      result.current.renameTimelineSlot(1, 'Middle');
      result.current.renameTimelineSlot(2, 'Finale');
    });
    act(() => result.current.deleteTimelineSlot(1));
    expect(getTimelineSlotLabel(result.current.timelineSettings, 0)).toBe('Opening');
    expect(getTimelineSlotLabel(result.current.timelineSettings, 1)).toBe('Finale');
  });
});
