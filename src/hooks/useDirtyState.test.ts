import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDirtyState } from '@/hooks/useDirtyState';

describe('useDirtyState', () => {
  it('initializes with empty dirty sets', () => {
    const { result } = renderHook(() => useDirtyState());
    expect(result.current.dirtyBlockIds.size).toBe(0);
    expect(result.current.dirtyEditors.size).toBe(0);
  });

  it('initializes with hasUnsavedSettings=false', () => {
    const { result } = renderHook(() => useDirtyState());
    expect(result.current.hasUnsavedSettings).toBe(false);
  });

  it('initializes with saveStatus=saved', () => {
    const { result } = renderHook(() => useDirtyState());
    expect(result.current.saveStatus).toBe('saved');
  });

  it('setDirtyBlockIds updates the set', () => {
    const { result } = renderHook(() => useDirtyState());
    act(() => result.current.setDirtyBlockIds(new Set(['block-1', 'block-2'])));
    expect(result.current.dirtyBlockIds.has('block-1')).toBe(true);
    expect(result.current.dirtyBlockIds.size).toBe(2);
  });

  it('setDirtyEditors updates the set', () => {
    const { result } = renderHook(() => useDirtyState());
    act(() => result.current.setDirtyEditors(new Set(['editor-a'])));
    expect(result.current.dirtyEditors.has('editor-a')).toBe(true);
  });

  it('setHasUnsavedSettings updates the flag', () => {
    const { result } = renderHook(() => useDirtyState());
    act(() => result.current.setHasUnsavedSettings(true));
    expect(result.current.hasUnsavedSettings).toBe(true);
  });

  it('setSaveStatus updates the status', () => {
    const { result } = renderHook(() => useDirtyState());
    act(() => result.current.setSaveStatus('saving'));
    expect(result.current.saveStatus).toBe('saving');
    act(() => result.current.setSaveStatus('error'));
    expect(result.current.saveStatus).toBe('error');
  });

  it('refs mirror dirty state', async () => {
    const { result } = renderHook(() => useDirtyState());
    act(() => result.current.setDirtyBlockIds(new Set(['x'])));
    expect(result.current.dirtyBlockIdsRef.current.has('x')).toBe(true);
  });
});
