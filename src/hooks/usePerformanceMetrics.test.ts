import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics';

describe('usePerformanceMetrics', () => {
  it('initializes snapshot with null timing values', () => {
    const [snapshot] = renderHook(() => usePerformanceMetrics()).result.current;
    expect(snapshot.lastLoadMs).toBeNull();
    expect(snapshot.lastAnalysisMs).toBeNull();
    expect(snapshot.lastScanMs).toBeNull();
  });

  it('initializes memorySamples as an array', () => {
    const [snapshot] = renderHook(() => usePerformanceMetrics()).result.current;
    expect(Array.isArray(snapshot.memorySamples)).toBe(true);
  });

  it('recordLoad updates lastLoadMs', () => {
    const { result } = renderHook(() => usePerformanceMetrics());
    act(() => result.current[1].recordLoad(42));
    expect(result.current[0].lastLoadMs).toBe(42);
  });

  it('recordAnalysis updates lastAnalysisMs', () => {
    const { result } = renderHook(() => usePerformanceMetrics());
    act(() => result.current[1].recordAnalysis(123));
    expect(result.current[0].lastAnalysisMs).toBe(123);
  });

  it('recordScanEnd updates lastScanMs when recordScanStart was called first', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => usePerformanceMetrics());
    act(() => result.current[1].recordScanStart());
    vi.advanceTimersByTime(50);
    act(() => result.current[1].recordScanEnd());
    expect(result.current[0].lastScanMs).not.toBeNull();
    expect(result.current[0].lastScanMs).toBeGreaterThanOrEqual(0);
    vi.useRealTimers();
  });

  it('recordScanEnd is a no-op when recordScanStart was not called', () => {
    const { result } = renderHook(() => usePerformanceMetrics());
    act(() => result.current[1].recordScanEnd());
    expect(result.current[0].lastScanMs).toBeNull();
  });

  it('returns stable recorder references', () => {
    const { result, rerender } = renderHook(() => usePerformanceMetrics());
    const recorders1 = result.current[1];
    rerender();
    const recorders2 = result.current[1];
    expect(recorders1.recordLoad).toBe(recorders2.recordLoad);
    expect(recorders1.recordAnalysis).toBe(recorders2.recordAnalysis);
  });
});
