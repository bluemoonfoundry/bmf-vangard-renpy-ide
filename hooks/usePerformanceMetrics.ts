import { useState, useRef, useEffect, useCallback } from 'react';

export interface MemorySample {
  mb: number;
  ts: number;
}

export interface PerformanceSnapshot {
  lastLoadMs: number | null;
  lastAnalysisMs: number | null;
  lastScanMs: number | null;
  memorySamples: MemorySample[];
}

export interface PerformanceRecorders {
  recordLoad: (ms: number) => void;
  recordAnalysis: (ms: number) => void;
  recordScanStart: () => void;
  recordScanEnd: () => void;
}

const MEMORY_RING_SIZE = 40;
const MEMORY_POLL_MS = 30_000;

function readHeapMb(): number | null {
  const mem = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
  if (!mem) return null;
  return mem.usedJSHeapSize / (1024 * 1024);
}

export function usePerformanceMetrics(): [PerformanceSnapshot, PerformanceRecorders] {
  const [snapshot, setSnapshot] = useState<PerformanceSnapshot>({
    lastLoadMs: null,
    lastAnalysisMs: null,
    lastScanMs: null,
    memorySamples: [],
  });
  const scanStartRef = useRef<number | null>(null);

  useEffect(() => {
    const sample = readHeapMb();
    if (sample !== null) {
      setSnapshot(s => ({
        ...s,
        memorySamples: [{ mb: sample, ts: Date.now() }],
      }));
    }
    const id = setInterval(() => {
      const mb = readHeapMb();
      if (mb === null) return;
      setSnapshot(s => {
        const next = [...s.memorySamples, { mb, ts: Date.now() }];
        if (next.length > MEMORY_RING_SIZE) next.splice(0, next.length - MEMORY_RING_SIZE);
        return { ...s, memorySamples: next };
      });
    }, MEMORY_POLL_MS);
    return () => clearInterval(id);
  }, []);

  const recordLoad = useCallback((ms: number) => {
    setSnapshot(s => ({ ...s, lastLoadMs: ms }));
  }, []);

  const recordAnalysis = useCallback((ms: number) => {
    setSnapshot(s => ({ ...s, lastAnalysisMs: ms }));
  }, []);

  const recordScanStart = useCallback(() => {
    scanStartRef.current = performance.now();
  }, []);

  const recordScanEnd = useCallback(() => {
    if (scanStartRef.current === null) return;
    const ms = performance.now() - scanStartRef.current;
    scanStartRef.current = null;
    setSnapshot(s => ({ ...s, lastScanMs: ms }));
  }, []);

  const recorders: PerformanceRecorders = { recordLoad, recordAnalysis, recordScanStart, recordScanEnd };
  return [snapshot, recorders];
}
