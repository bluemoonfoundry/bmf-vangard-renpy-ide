/**
 * @file measure.ts
 * @description Minimal timing helper for the analysis benchmarks.
 */

export interface Timing { median: number; min: number; max: number; runs: number }

/**
 * Runs `fn` `warmup` times untimed, then `runs` times timed (milliseconds via
 * `performance.now()`). `fn` receives a 0-based call index that is unique
 * across warmup and measured calls, so callers can vary their input per call.
 */
export async function measure(
  fn: (run: number) => Promise<void> | void,
  opts: { warmup?: number; runs?: number } = {},
): Promise<Timing> {
  const warmup = opts.warmup ?? 2;
  const runs = opts.runs ?? 7;
  for (let i = 0; i < warmup; i++) await fn(i);
  const samples: number[] = [];
  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    await fn(warmup + i);
    samples.push(performance.now() - start);
  }
  samples.sort((a, b) => a - b);
  const mid = Math.floor(samples.length / 2);
  const median = samples.length % 2 ? samples[mid] : (samples[mid - 1] + samples[mid]) / 2;
  return { median, min: samples[0], max: samples[samples.length - 1], runs };
}
