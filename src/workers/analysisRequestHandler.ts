/**
 * @file analysisRequestHandler.ts
 * @description The analysis worker's request logic, kept out of the worker
 * file so it is unit-testable. Runs the regex analysis phases, then builds the
 * cross-file symbol index (nms4.2) as an optional extra on the result.
 *
 * Content-hash caching: if none of the block contents changed since the last
 * run (e.g. the user only moved blocks on the canvas), the cached result is
 * returned immediately without re-running anything.
 *
 * Cancellation (nms4.3): the newest request to arrive supersedes any still in
 * flight. Each request awaits a checkpoint before every phase and before every
 * symbol-index block; the checkpoint yields to the event loop (so a newer
 * request can be delivered) and then throws AnalysisCancelledError if one has
 * arrived. A cancelled request posts nothing and leaves every cache untouched.
 * "Newest" is tracked by a counter private to the handler, never by request
 * id, so ids restarting after a hook remount are harmless. The unchanged-
 * content fast path answers immediately, before any checkpoint.
 */
import { performRenpyAnalysis, performRouteAnalysis } from '@/hooks/useRenpyAnalysis';
import type { AnalysisBlock } from '@/hooks/useRenpyAnalysis';
import type { ProjectSymbolIndex, RenpyAnalysisResult } from '@/types';
import { formatErrorMessage } from '@/lib/formatErrorMessage';
import { performTranslationAnalysis } from '@/lib/renpyTranslationParser';
import { djb2 } from '@/lib/contentHash';
import { workerWarn } from '@/lib/workerLogger';
import { createContributionCache, updateProjectIndex, type ContributionCache } from '@/lib/tree-sitter/projectIndex';
import { AnalysisCancelledError, yieldToEventLoop } from '@/lib/analysisCancellation';
import type { IndexBlock } from '@/lib/tree-sitter/blockContribution';

export interface AnalysisRequest {
  id: number;
  blocks: AnalysisBlock[];
}

export type AnalysisResponse =
  | { id: number; type: 'progress'; phase: string; percent: number }
  | { id: number; result: RenpyAnalysisResult }
  | { id: number; error: string };

export interface AnalysisHandlerDeps {
  updateIndex?: (
    cache: ContributionCache,
    blocks: IndexBlock[],
    deps?: { checkpoint?: () => Promise<void> },
  ) => Promise<ProjectSymbolIndex>;
  warn?: (message: string, error: unknown) => void;
}

interface BlockSignature {
  id: string;
  filePath: string;
  contentHash: number;
}

function computeSignatures(blocks: AnalysisBlock[]): BlockSignature[] {
  return blocks.map((b) => ({ id: b.id, filePath: b.filePath ?? '', contentHash: djb2(b.content) }));
}

function signaturesEqual(a: BlockSignature[], b: BlockSignature[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].id !== b[i].id || a[i].filePath !== b[i].filePath || a[i].contentHash !== b[i].contentHash) return false;
  }
  return true;
}

/**
 * Creates a request handler with its own caches. Phases: regex parsing,
 * route graph, translations, symbol index. A symbol-index failure never
 * affects the regex result: `symbolIndex` is omitted and `indexError` set,
 * with one warning per handler lifetime.
 */
export function createAnalysisRequestHandler(deps: AnalysisHandlerDeps = {}) {
  const updateIndex = deps.updateIndex ?? updateProjectIndex;
  // Not the renderer `logger`: it touches `window`, which a worker lacks (C1).
  const warn = deps.warn ?? workerWarn;
  const contributionCache = createContributionCache();
  let cachedSignatures: BlockSignature[] = [];
  let cachedResult: RenpyAnalysisResult | null = null;
  let warned = false;
  let arrivals = 0;

  return async (request: AnalysisRequest, post: (message: AnalysisResponse) => void): Promise<void> => {
    const { id, blocks } = request;
    const token = ++arrivals;
    const checkpoint = async (): Promise<void> => {
      await yieldToEventLoop();
      if (token !== arrivals) throw new AnalysisCancelledError();
    };
    try {
      const signatures = computeSignatures(blocks);
      if (cachedResult && signaturesEqual(signatures, cachedSignatures)) {
        // Content unchanged (e.g. only canvas positions changed) — skip re-analysis.
        post({ id, result: cachedResult });
        return;
      }

      await checkpoint();
      post({ id, type: 'progress', phase: 'Parsing scripts', percent: 10 });
      const result = performRenpyAnalysis(blocks);

      await checkpoint();
      post({ id, type: 'progress', phase: 'Building route graph', percent: 60 });
      const routeData = performRouteAnalysis(blocks, result.labels, result.jumps);
      result.labelNodes = routeData.labelNodes;
      result.routeLinks = routeData.routeLinks;
      result.identifiedRoutes = routeData.identifiedRoutes;
      result.routesTruncated = routeData.routesTruncated;

      await checkpoint();
      post({ id, type: 'progress', phase: 'Analyzing translations', percent: 80 });
      result.translationData = performTranslationAnalysis(blocks, result.dialogueLines, result.labels);

      await checkpoint();
      post({ id, type: 'progress', phase: 'Indexing symbols', percent: 90 });
      try {
        result.symbolIndex = await updateIndex(
          contributionCache,
          blocks.map((b) => ({ id: b.id, filePath: b.filePath ?? '', content: b.content })),
          { checkpoint },
        );
      } catch (error) {
        if (error instanceof AnalysisCancelledError) throw error;
        result.indexError = formatErrorMessage(error);
        if (!warned) {
          warned = true;
          try {
            warn('Symbol index build failed; regex analysis result is unaffected', error);
          } catch {
            // A failing warning sink must never discard the regex result.
          }
        }
      }

      await checkpoint();
      post({ id, type: 'progress', phase: 'Finalizing', percent: 95 });
      cachedSignatures = signatures;
      cachedResult = result;
      post({ id, result });
    } catch (error) {
      if (error instanceof AnalysisCancelledError) return;
      post({ id, error: formatErrorMessage(error) });
    }
  };
}
