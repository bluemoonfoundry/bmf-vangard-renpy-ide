import { describe, it, expect, vi, afterEach } from 'vitest';

describe('initParser when the WASM runtime never settles (nms4.18)', () => {
  afterEach(() => {
    vi.doUnmock('web-tree-sitter');
    vi.resetModules();
    vi.useRealTimers();
  });

  it('rejects after the timeout instead of hanging, and keeps failing fast', async () => {
    vi.resetModules();
    const init = vi.fn(() => new Promise<void>(() => {})); // an emscripten abort never settles
    vi.doMock('web-tree-sitter', () => ({ default: { init } }));
    vi.useFakeTimers();

    const { initParser, PARSER_INIT_TIMEOUT_MS } = await import('@/lib/tree-sitter/parseBlock');

    const first = initParser();
    const firstOutcome = expect(first).rejects.toThrow(/did not initialize/);
    await vi.advanceTimersByTimeAsync(PARSER_INIT_TIMEOUT_MS);
    await firstOutcome;

    await expect(initParser()).rejects.toThrow(/did not initialize/);
    expect(init).toHaveBeenCalledTimes(1);
  });
});
