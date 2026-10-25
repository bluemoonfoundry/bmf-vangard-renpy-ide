import { describe, it, expect } from 'vitest';
import { generateBenchProject, AVOIDED_CONSTRUCTS, BENCH_PRESETS, type BenchPreset } from '@/test/bench/generateBenchProject';
import { loadFixture } from '@/test/bench/benchFixtures';
import { buildBlockContribution } from '@/lib/tree-sitter/blockContribution';

const countLines = (files: { content: string }[]) => files.reduce((n, f) => n + f.content.split('\n').length, 0);

describe('generateBenchProject', () => {
  it('is byte-identical for the same preset and seed', () => {
    const a = generateBenchProject({ preset: 'medium', seed: 43 });
    expect(generateBenchProject({ preset: 'medium', seed: 43 })).toEqual(a);
    expect(generateBenchProject({ preset: 'medium', seed: 44 })).not.toEqual(a);
  });

  it.each(['medium', 'large'] as BenchPreset[])('hits the %s preset sizes', (p) => {
    const files = generateBenchProject({ preset: p });
    expect(files.length).toBe(BENCH_PRESETS[p].files);
    expect(files[0].filePath).toBe('game/bench_000.rpy');
    const lines = countLines(files);
    expect(lines).toBeGreaterThanOrEqual(BENCH_PRESETS[p].targetLines * 0.9);
    expect(lines).toBeLessThanOrEqual(BENCH_PRESETS[p].targetLines * 1.1);
  });

  it('mixes the realistic constructs', () => {
    const all = generateBenchProject({ preset: 'medium' }).map((f) => f.content).join('\n');
    for (const re of [
      /^label \w+:/m, /label \.\w+:/, /\bjump \w+/, /\bcall \w+/, /^\s+menu:/m, /\[\w+\]/,
      /^define \w+ = Character\(/m, /^default \w+ = /m, /^\s+\$ /m, /^init python:/m,
      /^screen \w+\(/m, /^\s+use \w+/m, /^transform \w+:/m, /^translate \w+ /m,
    ]) expect(all).toMatch(re);
  });

  it('crosses files', () => {
    const files = generateBenchProject({ preset: 'medium' });
    const owner = new Map<string, string>();
    for (const f of files) for (const m of f.content.matchAll(/^label (\w+):/gm)) owner.set(m[1], f.filePath);
    const crossing = files.some((f) => [...f.content.matchAll(/\b(?:jump|call) (\w+)/g)]
      .some((m) => owner.has(m[1]) && owner.get(m[1]) !== f.filePath));
    expect(crossing).toBe(true);
  });

  it('parses cleanly at baseline', async () => {
    const files = generateBenchProject({ preset: 'medium' });
    const bad: string[] = [];
    for (const f of files) {
      const c = await buildBlockContribution({ id: f.filePath, filePath: f.filePath, content: f.content });
      if (c.hasError) bad.push(f.filePath);
    }
    expect(bad).toEqual([]);
  }, 120_000);

  it('full-idiom variant includes every avoided construct and parses cleanly after the fixes', async () => {
    const files = generateBenchProject({ preset: 'medium', fullIdioms: true });
    const all = files.map((f) => f.content).join('\n');
    for (const c of AVOIDED_CONSTRUCTS) {
      expect(c.markers.length, c.issue).toBeGreaterThan(0);
      for (const m of c.markers) expect(all, `${c.issue}: ${m}`).toMatch(m);
    }
    expect(files.some((f) => f.content.startsWith('\n'))).toBe(true);
    const bad: string[] = [];
    for (const f of files) {
      const c = await buildBlockContribution({ id: f.filePath, filePath: f.filePath, content: f.content });
      if (c.hasError) bad.push(f.filePath);
    }
    expect(bad).toEqual([]);
  }, 120_000);

  it('small fixture is DemoProject', () => {
    expect(loadFixture('small').length).toBe(7);
  });
});
