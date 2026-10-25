/**
 * @file benchFixtures.ts
 * @description Loads the small/medium/large analysis fixtures for benchmarks:
 * small is the checked-in DemoProject, medium/large are generated.
 */
import fs from 'fs';
import path from 'path';
import type { AnalysisBlock } from '@/hooks/useRenpyAnalysis';
import { generateBenchProject, type BenchFile } from '@/test/bench/generateBenchProject';

export type FixtureSize = 'small' | 'medium' | 'large';

/** Reads `DemoProject/game/*.rpy` (top level only) relative to the cwd. */
function loadSmall(): BenchFile[] {
  const dir = path.join(process.cwd(), 'DemoProject', 'game');
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith('.rpy'))
    .sort()
    .map((name) => ({ filePath: `game/${name}`, content: fs.readFileSync(path.join(dir, name), 'utf8') }));
}

export function loadFixture(size: FixtureSize, opts: { fullIdioms?: boolean } = {}): BenchFile[] {
  if (size === 'small') return loadSmall();
  return generateBenchProject({ preset: size, fullIdioms: opts.fullIdioms });
}

export function toAnalysisBlocks(files: BenchFile[]): AnalysisBlock[] {
  return files.map((f) => ({ id: f.filePath, filePath: f.filePath, content: f.content }));
}
