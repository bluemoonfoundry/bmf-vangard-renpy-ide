/**
 * @file hooks/useRenpyAnalysis.hook.test.ts
 * @description Tests for the useRenpyAnalysis hook's pending flag against a fake
 * Web Worker. The pure analysis functions are covered in useRenpyAnalysis.test.ts.
 */

import { renderHook, act } from '@testing-library/react';
import { vi, afterEach } from 'vitest';
import type { AnalysisBlock } from '@/hooks/useRenpyAnalysis';
import type { RenpyAnalysisResult } from '@/types';

type MessageHandler = (e: MessageEvent) => void;

class FakeWorker {
  static instance: FakeWorker | null = null;
  handlers = new Set<MessageHandler>();
  posted: { id: number; blocks: AnalysisBlock[] }[] = [];
  constructor() { FakeWorker.instance = this; }
  addEventListener(_type: string, h: MessageHandler) { this.handlers.add(h); }
  removeEventListener(_type: string, h: MessageHandler) { this.handlers.delete(h); }
  postMessage(msg: { id: number; blocks: AnalysisBlock[] }) { this.posted.push(msg); }
  /** Answer the most recent request with a result tagged by `marker`. */
  respond(marker: string) {
    const { id } = this.posted[this.posted.length - 1];
    const result = { labelNodes: [{ label: marker }] } as unknown as RenpyAnalysisResult;
    [...this.handlers].forEach(h => h({ data: { id, result } } as MessageEvent));
  }
}

async function loadHook() {
  vi.resetModules();
  vi.stubGlobal('Worker', FakeWorker);
  return (await import('@/hooks/useRenpyAnalysis')).useRenpyAnalysis;
}

afterEach(() => {
  vi.unstubAllGlobals();
  FakeWorker.instance = null;
});

describe('useRenpyAnalysis — pending flag', () => {
  it('reports pending in the same render its input changes, before the worker is posted', async () => {
    const useRenpyAnalysis = await loadHook();
    const blocksA: AnalysisBlock[] = [{ id: 'a', content: 'label a:', filePath: 'a.rpy' }];
    const blocksB: AnalysisBlock[] = [{ id: 'b', content: 'label b:', filePath: 'b.rpy' }];

    // Record what every render saw, including renders before effects run.
    const renders: { blocks: AnalysisBlock[]; pending: boolean; marker?: string }[] = [];
    const { rerender } = renderHook(({ blocks }) => {
      const [result, pending] = useRenpyAnalysis(blocks, 0);
      renders.push({ blocks, pending, marker: result.labelNodes[0]?.label });
      return pending;
    }, { initialProps: { blocks: blocksA } });

    act(() => FakeWorker.instance!.respond('A'));
    expect(renders[renders.length - 1]).toMatchObject({ blocks: blocksA, pending: false, marker: 'A' });

    renders.length = 0;
    rerender({ blocks: blocksB });

    // A render that already sees blocksB must not claim the stale result 'A' is settled.
    const staleSettled = renders.filter(r => r.blocks === blocksB && !r.pending && r.marker === 'A');
    expect(staleSettled).toEqual([]);

    act(() => FakeWorker.instance!.respond('B'));
    expect(renders[renders.length - 1]).toMatchObject({ blocks: blocksB, pending: false, marker: 'B' });
  });

  it('is pending on mount until the first result arrives', async () => {
    const useRenpyAnalysis = await loadHook();
    const blocks: AnalysisBlock[] = [{ id: 'a', content: 'label a:', filePath: 'a.rpy' }];
    const seen: boolean[] = [];
    const { result } = renderHook(() => {
      const [, pending] = useRenpyAnalysis(blocks, 0);
      seen.push(pending);
      return pending;
    });

    expect(seen.every(Boolean)).toBe(true);
    act(() => FakeWorker.instance!.respond('A'));
    expect(result.current).toBe(false);
  });

  it('clears pending when the worker reports an error', async () => {
    const useRenpyAnalysis = await loadHook();
    const blocks: AnalysisBlock[] = [{ id: 'a', content: 'label a:', filePath: 'a.rpy' }];
    const { result } = renderHook(() => useRenpyAnalysis(blocks, 0)[1]);

    const worker = FakeWorker.instance!;
    const { id } = worker.posted[worker.posted.length - 1];
    act(() => [...worker.handlers].forEach(h => h({ data: { id, error: 'boom' } } as MessageEvent)));
    expect(result.current).toBe(false);
  });
});
