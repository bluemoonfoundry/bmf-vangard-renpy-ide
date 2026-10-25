import { describe, it, expect, vi } from 'vitest';
import { createAnalysisRequestHandler, type AnalysisResponse } from '@/workers/analysisRequestHandler';
import { performRenpyAnalysis, performRouteAnalysis, type AnalysisBlock } from '@/hooks/useRenpyAnalysis';
import { performTranslationAnalysis } from '@/lib/renpyTranslationParser';
import type { ContributionCache } from '@/lib/tree-sitter/projectIndex';
import type { IndexBlock } from '@/lib/tree-sitter/blockContribution';
import type { ProjectSymbolIndex, RenpyAnalysisResult } from '@/types';

const emptyIndex = (): ProjectSymbolIndex => ({ symbols: new Map(), unresolved: [], duplicates: [], contributions: new Map() });
const fakeUpdateIndex = () => vi.fn(async (_cache: ContributionCache, _blocks: IndexBlock[]) => emptyIndex());

const blocks: AnalysisBlock[] = [
  { id: 'a', filePath: 'game/a.rpy', content: 'define e = Character("Eileen")\nlabel start:\n    e "Hi"\n    jump next\n' },
  { id: 'b', filePath: 'game/b.rpy', content: 'label next:\n    return\n' },
];

/** The regex result the worker produced before nms4.2. */
function regexOnly(input: AnalysisBlock[]): RenpyAnalysisResult {
  const result = performRenpyAnalysis(input);
  const route = performRouteAnalysis(input, result.labels, result.jumps);
  result.labelNodes = route.labelNodes;
  result.routeLinks = route.routeLinks;
  result.identifiedRoutes = route.identifiedRoutes;
  result.routesTruncated = route.routesTruncated;
  result.translationData = performTranslationAnalysis(input, result.dialogueLines, result.labels);
  return result;
}

async function run(handler: ReturnType<typeof createAnalysisRequestHandler>, id: number, input = blocks) {
  const messages: AnalysisResponse[] = [];
  await handler({ id, blocks: input }, (m) => messages.push(m));
  return messages;
}

const finalResult = (messages: AnalysisResponse[]) => {
  const last = messages[messages.length - 1];
  if (!('result' in last)) throw new Error(`expected a result, got ${JSON.stringify(last)}`);
  return last.result;
};

describe('analysis request handler', () => {
  it('posts progress phases including symbol indexing, then the result', async () => {
    const messages = await run(createAnalysisRequestHandler(), 1);
    const phases = messages.filter((m) => 'type' in m).map((m) => ('phase' in m ? m.phase : ''));
    expect(phases).toEqual(['Parsing scripts', 'Building route graph', 'Analyzing translations', 'Indexing symbols', 'Finalizing']);
    expect(messages.every((m) => m.id === 1)).toBe(true);
  });

  it('attaches a symbol index without changing the regex result', async () => {
    const result = finalResult(await run(createAnalysisRequestHandler(), 1));
    expect(result.symbolIndex!.symbols.get('label:next')!.references).toHaveLength(1);
    expect(result.indexError).toBeUndefined();
    const { symbolIndex: _index, indexError: _error, ...regexFields } = result;
    expect(regexFields).toEqual(regexOnly(blocks));
  });

  it('produces an index that survives structured cloning (postMessage)', async () => {
    const result = finalResult(await run(createAnalysisRequestHandler(), 1));
    const cloned = structuredClone(result.symbolIndex!);
    expect(cloned).toEqual(result.symbolIndex);
    expect(cloned.symbols).toBeInstanceOf(Map);
  });

  it('still posts the regex result with indexError when indexing fails, warning once', async () => {
    const warn = vi.fn();
    const handler = createAnalysisRequestHandler({ updateIndex: async () => { throw new Error('wasm init failed'); }, warn });
    const first = finalResult(await run(handler, 1));
    expect(first.symbolIndex).toBeUndefined();
    expect(first.indexError).toContain('wasm init failed');
    const { indexError: _error, ...regexFields } = first;
    expect(regexFields).toEqual(regexOnly(blocks));
    await run(handler, 2, [{ ...blocks[0], content: blocks[0].content + '\n' }, blocks[1]]);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('returns the cached result when content is unchanged', async () => {
    const updateIndex = fakeUpdateIndex();
    const handler = createAnalysisRequestHandler({ updateIndex });
    await run(handler, 1);
    const messages = await run(handler, 2);
    expect(messages).toHaveLength(1);
    expect(updateIndex).toHaveBeenCalledTimes(1);
  });

  it('defaults a missing filePath to an empty string for the index', async () => {
    const updateIndex = fakeUpdateIndex();
    await run(createAnalysisRequestHandler({ updateIndex }), 1, [{ id: 'x', content: 'label x:\n    return\n' }]);
    expect(updateIndex.mock.calls[0][1]).toEqual([{ id: 'x', filePath: '', content: 'label x:\n    return\n' }]);
  });

  it('posts the result with indexError under the default warn when there is no window (C1)', async () => {
    vi.stubGlobal('window', undefined);
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const handler = createAnalysisRequestHandler({ updateIndex: async () => { throw new Error('wasm init failed'); } });
      const messages = await run(handler, 1);
      expect(messages.some((m) => 'error' in m)).toBe(false);
      const result = finalResult(messages);
      expect(result.indexError).toContain('wasm init failed');
      expect(consoleWarn).toHaveBeenCalledTimes(1);
    } finally {
      vi.unstubAllGlobals();
      consoleWarn.mockRestore();
    }
  });

  it('never lets a throwing warn discard the regex result (C1)', async () => {
    const handler = createAnalysisRequestHandler({
      updateIndex: async () => { throw new Error('boom'); },
      warn: () => { throw new Error('warn exploded'); },
    });
    const messages = await run(handler, 1);
    expect(messages.some((m) => 'error' in m)).toBe(false);
    expect(finalResult(messages).indexError).toContain('boom');
  });

  it('re-indexes when a block is renamed with unchanged content (I3)', async () => {
    const updateIndex = fakeUpdateIndex();
    const handler = createAnalysisRequestHandler({ updateIndex });
    await run(handler, 1);
    const renamed = [{ ...blocks[0], filePath: 'game/renamed.rpy' }, blocks[1]];
    const messages = await run(handler, 2, renamed);
    expect(messages.length).toBeGreaterThan(1);
    expect(updateIndex).toHaveBeenCalledTimes(2);
    expect(updateIndex.mock.calls[1][1][0].filePath).toBe('game/renamed.rpy');
  });

  describe('cancellation', () => {
    const PHASES = ['Parsing scripts', 'Building route graph', 'Analyzing translations', 'Indexing symbols', 'Finalizing'];
    const phasesOf = (messages: AnalysisResponse[]) => messages.filter((m) => 'type' in m).map((m) => ('phase' in m ? m.phase : ''));
    const withContent = (content: string): AnalysisBlock[] => [{ id: 'a', filePath: 'game/a.rpy', content }];
    const X = withContent('label x:\n    return\n');
    const Y = withContent('label y:\n    return\n');

    /** A fake updateIndex whose calls wait on a per-call gate (open unless provided), then hit the checkpoint. */
    function gatedUpdateIndex(gates: Array<Promise<void> | undefined>) {
      let call = 0;
      return vi.fn(async (_cache: ContributionCache, _blocks: IndexBlock[], deps?: { checkpoint?: () => Promise<void> }) => {
        const gate = gates[call++];
        if (gate) await gate;
        await deps?.checkpoint?.();
        return emptyIndex();
      });
    }

    async function waitFor(predicate: () => boolean) {
      for (let i = 0; i < 1000 && !predicate(); i++) await new Promise((r) => setTimeout(r, 0));
      if (!predicate()) throw new Error('condition never became true');
    }

    it('a stale request that finishes last neither posts nor overwrites the cache', async () => {
      let openA!: () => void;
      const gateA = new Promise<void>((resolve) => { openA = resolve; });
      const warn = vi.fn();
      const handler = createAnalysisRequestHandler({ updateIndex: gatedUpdateIndex([gateA]), warn });

      const aMessages: AnalysisResponse[] = [];
      const aDone = handler({ id: 1, blocks: X }, (m) => aMessages.push(m));
      await waitFor(() => aMessages.some((m) => 'phase' in m && m.phase === 'Indexing symbols'));
      const aCountAtB = aMessages.length;

      const bMessages = await run(handler, 2, Y);
      openA();
      await aDone;

      expect(aMessages.length).toBe(aCountAtB);
      expect(warn).not.toHaveBeenCalled();
      expect('result' in bMessages[bMessages.length - 1]).toBe(true);
      const third = await run(handler, 3, Y);
      expect(third).toHaveLength(1);
      expect('result' in third[0]).toBe(true);
      expect(phasesOf(await run(handler, 4, X))).toEqual(PHASES);
    });

    it('posts nothing at all for a request superseded before it starts', async () => {
      const handler = createAnalysisRequestHandler({ updateIndex: fakeUpdateIndex() });
      const a: AnalysisResponse[] = [];
      const b: AnalysisResponse[] = [];
      const c: AnalysisResponse[] = [];
      await Promise.all([
        handler({ id: 1, blocks: X }, (m) => a.push(m)),
        handler({ id: 2, blocks: Y }, (m) => b.push(m)),
        handler({ id: 3, blocks }, (m) => c.push(m)),
      ]);
      expect(a).toEqual([]);
      expect(b).toEqual([]);
      expect(phasesOf(c)).toEqual(PHASES);
      expect(finalResult(c).labels).toHaveProperty('next');
    });

    it('still completes when ids restart after a remount', async () => {
      const handler = createAnalysisRequestHandler({ updateIndex: fakeUpdateIndex() });
      finalResult(await run(handler, 5, X));
      const messages = await run(handler, 1, Y);
      expect(phasesOf(messages)).toEqual(PHASES);
      expect(finalResult(messages).labels).toHaveProperty('y');
    });
  });
});
