import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSnippetStats, getSnippetStatId } from './useSnippetStats';

describe('useSnippetStats', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns a default entry for an unknown id', () => {
    const { result } = renderHook(() => useSnippetStats());
    expect(result.current.getStat('unknown')).toEqual({ favorite: false, copyCount: 0, lastUsedAt: null });
  });

  it('toggles favorite state', () => {
    const { result } = renderHook(() => useSnippetStats());
    const id = getSnippetStatId('Dialogue', 'Say Hello');

    act(() => result.current.toggleFavorite(id));
    expect(result.current.getStat(id).favorite).toBe(true);

    act(() => result.current.toggleFavorite(id));
    expect(result.current.getStat(id).favorite).toBe(false);
  });

  it('records copy count and lastUsedAt', () => {
    const { result } = renderHook(() => useSnippetStats());
    const id = getSnippetStatId('Dialogue', 'Say Hello');

    act(() => result.current.recordCopy(id));
    act(() => result.current.recordCopy(id));

    const stat = result.current.getStat(id);
    expect(stat.copyCount).toBe(2);
    expect(stat.lastUsedAt).not.toBeNull();
  });

  it('persists stats across hook instances via localStorage', () => {
    const id = getSnippetStatId('Dialogue', 'Say Hello');
    const { result: first } = renderHook(() => useSnippetStats());
    act(() => first.current.toggleFavorite(id));

    const { result: second } = renderHook(() => useSnippetStats());
    expect(second.current.getStat(id).favorite).toBe(true);
  });

  it('tolerates corrupted localStorage content', () => {
    localStorage.setItem('vangard-snippet-stats', 'not json');
    const { result } = renderHook(() => useSnippetStats());
    expect(result.current.getStat('anything')).toEqual({ favorite: false, copyCount: 0, lastUsedAt: null });
  });
});
