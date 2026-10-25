/**
 * @file renpyAnalysis.worker.ts
 * @description Web Worker that runs Ren'Py analysis off the main thread.
 * Receives `{ id, blocks }` via postMessage and replies with progress
 * messages and a complete RenpyAnalysisResult (including the optional
 * cross-file symbol index). A newer request cancels one still in flight,
 * which then posts nothing (the renderer only keeps its latest id anyway).
 * All logic lives in analysisRequestHandler.ts.
 */
import { createAnalysisRequestHandler, type AnalysisRequest } from '@/workers/analysisRequestHandler';

const handleRequest = createAnalysisRequestHandler();

self.onmessage = (e: MessageEvent<AnalysisRequest>) => {
  void handleRequest(e.data, (message) => self.postMessage(message));
};
