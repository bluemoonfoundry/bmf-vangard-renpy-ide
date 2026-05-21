import { getLabelAtLine, resolveWarpTarget } from '@/lib/warpTarget';
import { createBlock, createEmptyAnalysisResult } from './mocks/sampleData';

describe('resolveWarpTarget', () => {
  it('maps a label to a game-relative warp target', () => {
    const blocks = [
      createBlock({ id: 'b1', filePath: 'game/script.rpy' }),
    ];
    const analysis = createEmptyAnalysisResult({
      labels: {
        start: { blockId: 'b1', label: 'start', line: 12, column: 7, type: 'label' },
      },
    });

    expect(resolveWarpTarget(blocks, analysis.labels, 'start')).toBe('script.rpy:12');
  });

  it('returns null when the label cannot be resolved', () => {
    const analysis = createEmptyAnalysisResult();
    expect(resolveWarpTarget([], analysis.labels, 'missing')).toBeNull();
  });

  it('finds a label defined on a specific line', () => {
    const analysis = createEmptyAnalysisResult({
      labels: {
        start: { blockId: 'b1', label: 'start', line: 12, column: 7, type: 'label' },
      },
    });

    expect(getLabelAtLine(analysis.labels, 'b1', 12)?.label).toBe('start');
    expect(getLabelAtLine(analysis.labels, 'b1', 99)).toBeNull();
  });

  it('handles file paths without the game/ prefix', () => {
    const blocks = [createBlock({ id: 'b1', filePath: 'script.rpy' })];
    const analysis = createEmptyAnalysisResult({
      labels: {
        start: { blockId: 'b1', label: 'start', line: 5, column: 7, type: 'label' },
      },
    });

    expect(resolveWarpTarget(blocks, analysis.labels, 'start')).toBe('script.rpy:5');
  });

  it('normalizes Windows backslash paths to forward slashes', () => {
    const blocks = [createBlock({ id: 'b1', filePath: 'game\\scenes\\chapter1.rpy' })];
    const analysis = createEmptyAnalysisResult({
      labels: {
        chapter_start: { blockId: 'b1', label: 'chapter_start', line: 3, column: 7, type: 'label' },
      },
    });

    expect(resolveWarpTarget(blocks, analysis.labels, 'chapter_start')).toBe('scenes/chapter1.rpy:3');
  });

  it('returns null when no block matches the label blockId', () => {
    const analysis = createEmptyAnalysisResult({
      labels: {
        start: { blockId: 'ghost-block', label: 'start', line: 1, column: 7, type: 'label' },
      },
    });

    expect(resolveWarpTarget([], analysis.labels, 'start')).toBeNull();
  });

  it('returns null when the file path collapses to empty after stripping game/ prefix', () => {
    const blocks = [createBlock({ id: 'b1', filePath: 'game/' })];
    const analysis = createEmptyAnalysisResult({
      labels: {
        start: { blockId: 'b1', label: 'start', line: 1, column: 7, type: 'label' },
      },
    });

    expect(resolveWarpTarget(blocks, analysis.labels, 'start')).toBeNull();
  });

  it('handles label names with underscores and numbers', () => {
    const blocks = [createBlock({ id: 'b1', filePath: 'game/script.rpy' })];
    const analysis = createEmptyAnalysisResult({
      labels: {
        after_warp_2: { blockId: 'b1', label: 'after_warp_2', line: 42, column: 7, type: 'label' },
      },
    });

    expect(resolveWarpTarget(blocks, analysis.labels, 'after_warp_2')).toBe('script.rpy:42');
  });
});

describe('getLabelAtLine', () => {
  it('returns null when the label map is empty', () => {
    expect(getLabelAtLine({}, 'b1', 1)).toBeNull();
  });

  it('distinguishes labels from different blocks at the same line number', () => {
    const labels = {
      start: { blockId: 'b1', label: 'start', line: 1, column: 7, type: 'label' as const },
      intro: { blockId: 'b2', label: 'intro', line: 1, column: 7, type: 'label' as const },
    };

    expect(getLabelAtLine(labels, 'b1', 1)?.label).toBe('start');
    expect(getLabelAtLine(labels, 'b2', 1)?.label).toBe('intro');
    expect(getLabelAtLine(labels, 'b1', 2)).toBeNull();
  });

  it('returns the first matching label when multiple labels share the same block and line', () => {
    const labels = {
      outer: { blockId: 'b1', label: 'outer', line: 10, column: 0, type: 'label' as const },
      inner: { blockId: 'b1', label: 'inner', line: 20, column: 4, type: 'label' as const },
    };

    expect(getLabelAtLine(labels, 'b1', 10)?.label).toBe('outer');
    expect(getLabelAtLine(labels, 'b1', 20)?.label).toBe('inner');
  });
});
