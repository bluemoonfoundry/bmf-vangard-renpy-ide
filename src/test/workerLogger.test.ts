import { describe, it, expect, vi, afterEach } from 'vitest';
import { createThrottledWarn, workerWarn } from '@/lib/workerLogger';

afterEach(() => vi.restoreAllMocks());

describe('workerLogger', () => {
  it('workerWarn writes to console.warn and never throws', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => { throw new Error('console gone'); });
    expect(() => workerWarn('msg', 1)).not.toThrow();
    expect(warn).toHaveBeenCalledWith('msg', 1);
  });

  it('works without a window (dedicated worker)', () => {
    vi.stubGlobal('window', undefined);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      workerWarn('in worker');
      expect(warn).toHaveBeenCalledWith('in worker');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('createThrottledWarn emits `limit` warnings, one suppression note, then nothing', () => {
    const sink = vi.fn();
    const warn = createThrottledWarn(2, sink);
    for (let i = 0; i < 10; i++) warn(`w${i}`);
    expect(sink.mock.calls.map((c) => c[0])).toEqual(['w0', 'w1', 'w2 (further warnings of this kind are suppressed)']);
  });

  it('createThrottledWarn swallows a throwing sink', () => {
    const warn = createThrottledWarn(1, () => { throw new Error('x'); });
    expect(() => warn('a')).not.toThrow();
  });
});
