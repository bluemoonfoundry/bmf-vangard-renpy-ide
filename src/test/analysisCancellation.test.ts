import { describe, it, expect, vi, afterEach } from 'vitest';
import { AnalysisCancelledError, yieldToEventLoop } from '@/lib/analysisCancellation';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('AnalysisCancelledError', () => {
  it('is an Error named AnalysisCancelledError', () => {
    const err = new AnalysisCancelledError();
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('AnalysisCancelledError');
  });
});

describe('yieldToEventLoop', () => {
  // MessageChannel vs setTimeout(0) ordering is not specified, so the ordering
  // assertion uses the setTimeout fallback (FIFO among equal-delay timers).
  it('lets a queued macrotask run first (setTimeout fallback)', async () => {
    vi.stubGlobal('MessageChannel', undefined);
    let flag = false;
    setTimeout(() => {
      flag = true;
    }, 0);
    await yieldToEventLoop();
    expect(flag).toBe(true);
  });

  it('resolves via MessageChannel when defined, and closes both ports', async () => {
    const closes: string[] = [];
    class FakeChannel {
      port1: { onmessage: (() => void) | null; close: () => void } = {
        onmessage: null,
        close: () => closes.push('port1'),
      };
      port2 = {
        postMessage: () => {
          setTimeout(() => this.port1.onmessage?.(), 0);
        },
        close: () => closes.push('port2'),
      };
    }
    vi.stubGlobal('MessageChannel', FakeChannel);
    await yieldToEventLoop();
    expect(closes.sort()).toEqual(['port1', 'port2']);
  });

  it('yields to a real MessageChannel without hanging', async () => {
    await expect(yieldToEventLoop()).resolves.toBeUndefined();
  });
});
