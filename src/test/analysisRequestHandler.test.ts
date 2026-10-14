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
});
