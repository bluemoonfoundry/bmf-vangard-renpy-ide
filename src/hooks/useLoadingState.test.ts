import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLoadingState } from '@/hooks/useLoadingState';

function setup(isWorkerPending = false) {
  const addToast = vi.fn();
  const hook = renderHook(
    ({ pending }) => useLoadingState({ isWorkerPending: pending, addToast }),
    { initialProps: { pending: isWorkerPending } },
  );
  return { ...hook, addToast };
}

describe('useLoadingState', () => {
  it('initializes with isLoading=false', () => {
    const { result } = setup();
    expect(result.current.isLoading).toBe(false);
  });

  it('initializes with isInitialAnalysisPending=false', () => {
    const { result } = setup();
    expect(result.current.isInitialAnalysisPending).toBe(false);
  });

  it('initializes with empty loadingMessage and zero progress', () => {
    const { result } = setup();
    expect(result.current.loadingMessage).toBe('');
    expect(result.current.loadingProgress).toBe(0);
  });

  it('setIsLoading updates isLoading', () => {
    const { result } = setup();
    act(() => result.current.setIsLoading(true));
    expect(result.current.isLoading).toBe(true);
  });

  it('setLoadingMessage updates loadingMessage', () => {
    const { result } = setup();
    act(() => result.current.setLoadingMessage('Loading project…'));
    expect(result.current.loadingMessage).toBe('Loading project…');
  });

  it('setLoadingProgress updates loadingProgress', () => {
    const { result } = setup();
    act(() => result.current.setLoadingProgress(50));
    expect(result.current.loadingProgress).toBe(50);
  });

  it('handleCancelLoad resets loading state and calls addToast', () => {
    const { result, addToast } = setup();
    act(() => {
      result.current.setIsLoading(true);
      result.current.setLoadingMessage('Working…');
      result.current.setLoadingProgress(30);
    });
    act(() => result.current.handleCancelLoad());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.loadingMessage).toBe('');
    expect(result.current.loadingProgress).toBe(0);
    expect(addToast).toHaveBeenCalledWith('Project loading cancelled.', 'info');
  });

  it('isInitialAnalysisPending clears once worker finishes after starting', () => {
    const { result, rerender } = setup(false);
    act(() => result.current.setIsInitialAnalysisPending(true));
    // Worker starts
    rerender({ pending: true });
    // Worker finishes
    rerender({ pending: false });
    expect(result.current.isInitialAnalysisPending).toBe(false);
  });

  it('isInitialAnalysisPending does not clear if worker never started', () => {
    const { result, rerender } = setup(false);
    act(() => result.current.setIsInitialAnalysisPending(true));
    // Worker never becomes pending — stays pending
    rerender({ pending: false });
    expect(result.current.isInitialAnalysisPending).toBe(true);
  });
});
