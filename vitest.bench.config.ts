/**
 * @file vitest.bench.config.ts
 * @description Vitest config for the analysis benchmarks (`npm run bench`).
 * Benchmarks are recorded, never enforced: they are not part of `npm test`.
 * Runs in node (no jsdom) so timings exclude DOM overhead; the shared jsdom
 * setup file is dropped because it touches `window`.
 */
import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './vite.config';

export default defineConfig((env) => {
  const merged = mergeConfig(typeof baseConfig === 'function' ? baseConfig(env) : baseConfig, {
    test: { environment: 'node', testTimeout: 600_000, hookTimeout: 600_000 },
  });
  // mergeConfig concatenates arrays, so replace these outright.
  merged.test = { ...merged.test, include: ['src/test/bench/**/*.bench.ts'], setupFiles: [] };
  return merged;
});
