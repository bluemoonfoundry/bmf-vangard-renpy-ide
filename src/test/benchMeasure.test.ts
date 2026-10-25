import { describe, it, expect, vi, afterEach } from 'vitest';
import { measure } from '@/test/bench/measure';

describe('measure', () => {
  afterEach(() => vi.restoreAllMocks());

  it('reports median/min/max over runs after warmup', async () => {
    // Only measured runs read the clock (start, end); warmup is untimed.
    const durations = [30, 10, 20];
    const clock: number[] = [];
    let t = 0;
    for (const d of durations) { clock.push(t, t + d); t += 1000; }
    const spy = vi.spyOn(performance, 'now').mockImplementation(() => clock.shift()!);
    const seen: number[] = [];
    const timing = await measure((run) => { seen.push(run); }, { warmup: 2, runs: 3 });
    expect(seen).toHaveLength(5);
    expect(timing).toEqual({ median: 20, min: 10, max: 30, runs: 3 });
    spy.mockRestore();
  });
});
