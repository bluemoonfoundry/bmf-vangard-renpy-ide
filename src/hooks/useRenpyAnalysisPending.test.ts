import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

/**
 * A stand-in Worker that records posted requests and lets the test decide
 * when (and with what) each one is answered.
 */
class FakeWorker {
  static instance: FakeWorker | null = null;
  posted: Array<{ id: number; blocks: unknown[] }> = [];
  private listeners = new Set<(e: MessageEvent) => void>();

  constructor() {
    FakeWorker.instance = this;
  }

  addEventListener(_type: string, fn: (e: MessageEvent) => void) {
    this.listeners.add(fn);
  }

  removeEventListener(_type: string, fn: (e: MessageEvent) => void) {
    this.listeners.delete(fn);
  }

  postMessage(data: { id: number; blocks: unknown[] }) {
    this.posted.push(data);
  }

  respond(id: number, result: unknown) {
    for (const fn of [...this.listeners]) fn({ data: { id, result } } as MessageEvent);
  }
}

const blockA = [{ id: 'a', content: 'label start:\n    return\n', filePath: 'game/a.rpy' }];
const blockB = [{ id: 'b', content: 'label other:\n    return\n', filePath: 'game/b.rpy' }];

describe('useRenpyAnalysis pending state', () => {
  beforeEach(() => {
    vi.resetModules();
    FakeWorker.instance = null;
    vi.stubGlobal('Worker', FakeWorker);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('never reports idle for new input while the result is still from older input (nms4.17)', async () => {
    const { useRenpyAnalysis } = await import('@/hooks/useRenpyAnalysis');
    const renders: Array<{ input: unknown; result: unknown; isPending: boolean }> = [];
    const resultForA = { tag: 'A' };

    const { rerender } = renderHook(({ blocks }) => {
      const [result, isPending] = useRenpyAnalysis(blocks, 0);
      renders.push({ input: blocks, result, isPending });
      return result;
    }, { initialProps: { blocks: blockA } });

    const worker = FakeWorker.instance!;
    act(() => worker.respond(worker.posted[0].id, resultForA));
    expect(renders[renders.length - 1]).toMatchObject({ result: resultForA, isPending: false });

    renders.length = 0;
    rerender({ blocks: blockB });

    // Every render showing input B must be pending until B's result arrives.
    const staleIdle = renders.filter(r => r.input === blockB && r.result === resultForA && !r.isPending);
    expect(staleIdle).toEqual([]);

    const resultForB = { tag: 'B' };
    act(() => worker.respond(worker.posted[1].id, resultForB));
    expect(renders[renders.length - 1]).toMatchObject({ result: resultForB, isPending: false });
  });

  it('ignores a superseded response and stays pending for the latest input', async () => {
    const { useRenpyAnalysis } = await import('@/hooks/useRenpyAnalysis');
    const { result, rerender } = renderHook(({ blocks }) => useRenpyAnalysis(blocks, 0), {
      initialProps: { blocks: blockA },
    });
    const worker = FakeWorker.instance!;
    rerender({ blocks: blockB });

    act(() => worker.respond(worker.posted[0].id, { tag: 'A' }));
    expect(result.current[1]).toBe(true);

    act(() => worker.respond(worker.posted[1].id, { tag: 'B' }));
    expect(result.current[0]).toEqual({ tag: 'B' });
    expect(result.current[1]).toBe(false);
  });
});
