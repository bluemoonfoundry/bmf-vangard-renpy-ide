import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToasts } from '@/hooks/useToasts';

describe('useToasts', () => {
  it('starts with no toasts', () => {
    const { result } = renderHook(() => useToasts());
    expect(result.current.toasts).toEqual([]);
  });

  it('addToast appends a toast with the given message', () => {
    const { result } = renderHook(() => useToasts());
    act(() => result.current.addToast('hello'));
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('hello');
  });

  it('addToast defaults type to info', () => {
    const { result } = renderHook(() => useToasts());
    act(() => result.current.addToast('msg'));
    expect(result.current.toasts[0].type).toBe('info');
  });

  it('addToast accepts explicit type', () => {
    const { result } = renderHook(() => useToasts());
    act(() => result.current.addToast('oops', 'error'));
    expect(result.current.toasts[0].type).toBe('error');
  });

  it('each toast has a unique id', () => {
    const { result } = renderHook(() => useToasts());
    act(() => {
      result.current.addToast('a');
      result.current.addToast('b');
    });
    const ids = result.current.toasts.map(t => t.id);
    expect(new Set(ids).size).toBe(2);
  });

  it('removeToast removes the toast with the given id', () => {
    const { result } = renderHook(() => useToasts());
    act(() => result.current.addToast('to remove'));
    const id = result.current.toasts[0].id;
    act(() => result.current.removeToast(id));
    expect(result.current.toasts).toHaveLength(0);
  });

  it('removeToast does not affect other toasts', () => {
    const { result } = renderHook(() => useToasts());
    act(() => {
      result.current.addToast('a');
      result.current.addToast('b');
    });
    const firstId = result.current.toasts[0].id;
    act(() => result.current.removeToast(firstId));
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('b');
  });

  it('removeToast is a no-op for unknown id', () => {
    const { result } = renderHook(() => useToasts());
    act(() => result.current.addToast('a'));
    act(() => result.current.removeToast('nonexistent'));
    expect(result.current.toasts).toHaveLength(1);
  });
});
