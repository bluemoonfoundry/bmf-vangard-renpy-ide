/**
 * @file analysis.bench.ts
 * @description Analysis benchmark (nms4.3). Recorded, never enforced: run with
 * `npm run bench` from the repo root (the small fixture reads DemoProject from
 * the cwd). Env: BENCH_LABEL (default "baseline") names
 * bench-results/analysis-<label>.json; BENCH_FULL_IDIOMS=1 uses the
 * full-idiom generated fixtures.
 */
import { describe, it, afterAll } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createAnalysisRequestHandler } from '@/workers/analysisRequestHandler';
import { createContributionCache, updateProjectIndex } from '@/lib/tree-sitter/projectIndex';
import type { IndexBlock } from '@/lib/tree-sitter/blockContribution';
import type { ProjectSymbolIndex } from '@/types';
import { loadFixture, toAnalysisBlocks, type FixtureSize } from '@/test/bench/benchFixtures';
import { measure, type Timing } from '@/test/bench/measure';

const SIZES: FixtureSize[] = ['small', 'medium', 'large'];
const label = process.env.BENCH_LABEL ?? 'baseline';
const fullIdioms = process.env.BENCH_FULL_IDIOMS === '1';
/** Large fixture run counts; reduce here (warmup >= 1, runs >= 3) if a run exceeds ~10 minutes. */
const RUN_COUNTS: Record<FixtureSize, { warmup: number; runs: number }> = {
  small: { warmup: 2, runs: 7 },
  medium: { warmup: 2, runs: 7 },
  large: { warmup: 2, runs: 7 },
};

const emptyIndex = async (): Promise<ProjectSymbolIndex> => ({
  symbols: new Map(), unresolved: [], duplicates: [], contributions: new Map(),
});

interface Row { scenario: string; size: FixtureSize; files: number; lines: number; warmup: number; runs: number; timing: Timing }
const results: Row[] = [];

const noop = () => {};

describe.each(SIZES)('analysis bench (%s)', (size) => {
  const files = loadFixture(size, { fullIdioms });
  const blocks = toAnalysisBlocks(files);
  const indexBlocks: IndexBlock[] = blocks.map((b) => ({ id: b.id, filePath: b.filePath ?? '', content: b.content }));
  const lines = files.reduce((n, f) => n + f.content.split('\n').length, 0);
  const counts = RUN_COUNTS[size];

  const record = (scenario: string, timing: Timing) =>
    results.push({ scenario, size, files: files.length, lines, ...counts, timing });

  it('regex-full', async () => {
    // Fresh handler per run so the content-hash fast path never fires.
    record('regex-full', await measure(async () => {
      await createAnalysisRequestHandler({ updateIndex: emptyIndex })({ id: 1, blocks }, noop);
    }, counts));
  });

  it('index-full', async () => {
    record('index-full', await measure(async () => {
      await updateProjectIndex(createContributionCache(), indexBlocks);
    }, counts));
  });

  it('one-file-edit', async () => {
    const handler = createAnalysisRequestHandler();
    await handler({ id: 0, blocks }, noop); // prime caches
    const mid = Math.floor(blocks.length / 2);
    let content = blocks[mid].content;
    record('one-file-edit', await measure(async (i) => {
      content += `\nlabel bench_edit_${i}:\n    "Edit ${i}."\n`;
      const edited = blocks.map((b, k) => (k === mid ? { ...b, content } : b));
      await handler({ id: i + 1, blocks: edited }, noop);
    }, counts));
  });
});

afterAll(() => {
  if (results.length === 0) return;
  const f = (n: number) => n.toFixed(1);
  const table = [
    '| Scenario | Size | Files | Lines | Median ms | Min ms | Max ms | Runs |',
    '|---|---|---|---|---|---|---|---|',
    ...results.map((r) =>
      `| ${r.scenario} | ${r.size} | ${r.files} | ${r.lines} | ${f(r.timing.median)} | ${f(r.timing.min)} | ${f(r.timing.max)} | ${r.timing.runs} |`),
  ].join('\n');
  // Written straight to fd 1: Vitest swallows console output from file-level hooks.
  fs.writeSync(1, `\nAnalysis benchmark (${label}${fullIdioms ? ', full idioms' : ''})\n${table}\n`);

  let commit = 'unknown';
  try { commit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { /* not a git checkout */ }
  const out = {
    label,
    fullIdioms,
    date: new Date().toISOString(),
    commit,
    node: process.version,
    os: `${os.platform()} ${os.release()}`,
    cpu: os.cpus()[0]?.model ?? 'unknown',
    ramGb: Math.round((os.totalmem() / 1024 ** 3) * 10) / 10,
    results,
  };
  const dir = path.join(process.cwd(), 'bench-results');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `analysis-${label}.json`), JSON.stringify(out, null, 2));
});
