import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStickyNotes } from '@/hooks/useStickyNotes';
import { createAppSettings } from '@/test/mocks/sampleData';
import type { CanvasTransform } from '@/hooks/useCanvasInteraction';

const defaultTransform: CanvasTransform = { x: 0, y: 0, scale: 1 };

function makeParams(overrides = {}) {
  return {
    appSettings: createAppSettings(),
    storyCanvasTransform: defaultTransform,
    onStickyNoteChange: vi.fn(),
    ...overrides,
  };
}

describe('useStickyNotes', () => {
  it('initializes with empty arrays for all three canvases', () => {
    const { result } = renderHook(() => useStickyNotes(makeParams()));
    expect(result.current.stickyNotes).toHaveLength(0);
    expect(result.current.routeStickyNotes).toHaveLength(0);
    expect(result.current.choiceStickyNotes).toHaveLength(0);
  });

  // ── Story canvas ──────────────────────────────────────────────────────────

  it('addStickyNote adds a note to stickyNotes with yellow color', () => {
    const { result } = renderHook(() => useStickyNotes(makeParams()));
    act(() => result.current.addStickyNote({ x: 100, y: 200 }));
    expect(result.current.stickyNotes).toHaveLength(1);
    expect(result.current.stickyNotes[0].color).toBe('yellow');
  });

  it('addStickyNote centers the note on the given position', () => {
    const { result } = renderHook(() => useStickyNotes(makeParams()));
    act(() => result.current.addStickyNote({ x: 100, y: 200 }));
    const note = result.current.stickyNotes[0];
    // Centering: position = { x: 100 - 200/2, y: 200 - 200/2 }
    expect(note.position.x).toBe(0);
    expect(note.position.y).toBe(100);
  });

  it('addStickyNote without position uses canvas transform to place at center', () => {
    const { result } = renderHook(() => useStickyNotes(makeParams()));
    act(() => result.current.addStickyNote());
    expect(result.current.stickyNotes).toHaveLength(1);
    expect(typeof result.current.stickyNotes[0].position.x).toBe('number');
  });

  it('addStickyNote calls onStickyNoteChange', () => {
    const onStickyNoteChange = vi.fn();
    const { result } = renderHook(() => useStickyNotes(makeParams({ onStickyNoteChange })));
    act(() => result.current.addStickyNote({ x: 0, y: 0 }));
    expect(onStickyNoteChange).toHaveBeenCalled();
  });

  it('updateStickyNote updates the matching note', () => {
    const { result } = renderHook(() => useStickyNotes(makeParams()));
    act(() => result.current.addStickyNote({ x: 0, y: 0 }));
    const id = result.current.stickyNotes[0].id;
    act(() => result.current.updateStickyNote(id, { content: 'Hello', color: 'blue' }));
    expect(result.current.stickyNotes[0].content).toBe('Hello');
    expect(result.current.stickyNotes[0].color).toBe('blue');
  });

  it('updateStickyNote is a no-op for unknown id', () => {
    const { result } = renderHook(() => useStickyNotes(makeParams()));
    act(() => result.current.addStickyNote({ x: 0, y: 0 }));
    act(() => result.current.updateStickyNote('nonexistent', { content: 'nope' }));
    expect(result.current.stickyNotes[0].content).toBe('');
  });

  it('deleteStickyNote removes the matching note', () => {
    const { result } = renderHook(() => useStickyNotes(makeParams()));
    act(() => result.current.addStickyNote({ x: 0, y: 0 }));
    const id = result.current.stickyNotes[0].id;
    act(() => result.current.deleteStickyNote(id));
    expect(result.current.stickyNotes).toHaveLength(0);
  });

  it('deleteStickyNote calls onStickyNoteChange', () => {
    const onStickyNoteChange = vi.fn();
    const { result } = renderHook(() => useStickyNotes(makeParams({ onStickyNoteChange })));
    act(() => result.current.addStickyNote({ x: 0, y: 0 }));
    onStickyNoteChange.mockClear();
    const id = result.current.stickyNotes[0].id;
    act(() => result.current.deleteStickyNote(id));
    expect(onStickyNoteChange).toHaveBeenCalled();
  });

  // ── Route canvas ──────────────────────────────────────────────────────────

  it('addRouteStickyNote adds a note to routeStickyNotes', () => {
    const { result } = renderHook(() => useStickyNotes(makeParams()));
    act(() => result.current.addRouteStickyNote({ x: 50, y: 60 }));
    expect(result.current.routeStickyNotes).toHaveLength(1);
    expect(result.current.routeStickyNotes[0].id).toMatch(/^rnote-/);
  });

  it('addRouteStickyNote without position places at 0,0', () => {
    const { result } = renderHook(() => useStickyNotes(makeParams()));
    act(() => result.current.addRouteStickyNote());
    expect(result.current.routeStickyNotes[0].position).toEqual({ x: 0, y: 0 });
  });

  it('updateRouteStickyNote updates the matching route note', () => {
    const { result } = renderHook(() => useStickyNotes(makeParams()));
    act(() => result.current.addRouteStickyNote({ x: 0, y: 0 }));
    const id = result.current.routeStickyNotes[0].id;
    act(() => result.current.updateRouteStickyNote(id, { content: 'Route note' }));
    expect(result.current.routeStickyNotes[0].content).toBe('Route note');
  });

  it('deleteRouteStickyNote removes the matching route note', () => {
    const { result } = renderHook(() => useStickyNotes(makeParams()));
    act(() => result.current.addRouteStickyNote({ x: 0, y: 0 }));
    const id = result.current.routeStickyNotes[0].id;
    act(() => result.current.deleteRouteStickyNote(id));
    expect(result.current.routeStickyNotes).toHaveLength(0);
  });

  // ── Choice canvas ─────────────────────────────────────────────────────────

  it('addChoiceStickyNote adds a note to choiceStickyNotes', () => {
    const { result } = renderHook(() => useStickyNotes(makeParams()));
    act(() => result.current.addChoiceStickyNote({ x: 10, y: 20 }));
    expect(result.current.choiceStickyNotes).toHaveLength(1);
    expect(result.current.choiceStickyNotes[0].id).toMatch(/^cnote-/);
  });

  it('updateChoiceStickyNote updates the matching choice note', () => {
    const { result } = renderHook(() => useStickyNotes(makeParams()));
    act(() => result.current.addChoiceStickyNote({ x: 0, y: 0 }));
    const id = result.current.choiceStickyNotes[0].id;
    act(() => result.current.updateChoiceStickyNote(id, { color: 'pink' }));
    expect(result.current.choiceStickyNotes[0].color).toBe('pink');
  });

  it('deleteChoiceStickyNote removes the matching choice note', () => {
    const { result } = renderHook(() => useStickyNotes(makeParams()));
    act(() => result.current.addChoiceStickyNote({ x: 0, y: 0 }));
    const id = result.current.choiceStickyNotes[0].id;
    act(() => result.current.deleteChoiceStickyNote(id));
    expect(result.current.choiceStickyNotes).toHaveLength(0);
  });

  // ── clearAllStickyNotes ───────────────────────────────────────────────────

  it('clearAllStickyNotes empties all three canvases', () => {
    const { result } = renderHook(() => useStickyNotes(makeParams()));
    act(() => {
      result.current.addStickyNote({ x: 0, y: 0 });
      result.current.addRouteStickyNote({ x: 0, y: 0 });
      result.current.addChoiceStickyNote({ x: 0, y: 0 });
    });
    act(() => result.current.clearAllStickyNotes());
    expect(result.current.stickyNotes).toHaveLength(0);
    expect(result.current.routeStickyNotes).toHaveLength(0);
    expect(result.current.choiceStickyNotes).toHaveLength(0);
  });
});
