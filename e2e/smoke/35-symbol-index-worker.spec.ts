import { testWithProject as test, expect } from '../electron-fixture';

/**
 * nms4.2 merge gate: the cross-file symbol index is built inside the analysis
 * Web Worker, which must load the tree-sitter runtime and grammar wasm files
 * from the packaged (file://) build. Sends one request to the app's own worker
 * and checks the result carries a symbolIndex and no indexError.
 */
const REQUEST_ID = 424_242;

interface Summary {
  error?: string;
  indexError?: string;
  hasSymbolIndex: boolean;
  nextReferences: number;
}

test.describe('symbol index worker', () => {
  test('analysis worker posts a result with a symbol index and no indexError', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await expect.poll(() => window.workers().length, { timeout: 30_000 }).toBeGreaterThan(0);
    const worker = window.workers().find((w) => w.url().includes('renpyAnalysis')) ?? window.workers()[0];

    await worker.evaluate((id) => {
      const scope = self as unknown as {
        postMessage: (message: unknown) => void;
        onmessage: (event: { data: unknown }) => void;
        __e2eMessages: unknown[];
      };
      scope.__e2eMessages = [];
      const original = scope.postMessage.bind(scope);
      // Keep this request's replies away from the app (it ignores unknown ids anyway).
      scope.postMessage = (message: unknown) => {
        if ((message as { id?: number })?.id === id) scope.__e2eMessages.push(message);
        else original(message);
      };
      scope.onmessage({
        data: {
          id,
          blocks: [
            { id: 'e2e-a', filePath: 'game/e2e_a.rpy', content: 'label e2e_start:\n    $ points = 1\n    jump e2e_next\n' },
            { id: 'e2e-b', filePath: 'game/e2e_b.rpy', content: 'label e2e_next:\n    return\n' },
          ],
        },
      });
    }, REQUEST_ID);

    const summary = async (): Promise<Summary | null> =>
      worker.evaluate(() => {
        const messages = (self as unknown as { __e2eMessages: Record<string, unknown>[] }).__e2eMessages;
        const last = messages.find((m) => 'result' in m || 'error' in m);
        if (!last) return null;
        if ('error' in last) return { error: String(last.error), hasSymbolIndex: false, nextReferences: 0 };
        const result = last.result as {
          symbolIndex?: { symbols: Map<string, { references: unknown[] }> };
          indexError?: string;
        };
        return {
          indexError: result.indexError,
          hasSymbolIndex: result.symbolIndex !== undefined,
          nextReferences: result.symbolIndex?.symbols.get('label:e2e_next')?.references.length ?? 0,
        };
      });

    await expect.poll(summary, { timeout: 30_000 }).not.toBeNull();
    const result = await summary();
    await test.info().attach('symbol-index-result', {
      body: JSON.stringify({ worker: worker.url(), result }),
      contentType: 'application/json',
    });
    expect(result, `worker ${worker.url()}`).toEqual({ indexError: undefined, hasSymbolIndex: true, nextReferences: 1 });
  });
});
