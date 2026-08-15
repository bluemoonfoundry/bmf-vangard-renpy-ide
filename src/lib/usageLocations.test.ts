import { describe, it, expect } from 'vitest';
import { findLabelForLine, groupUsageLocations } from '@/lib/usageLocations';
import { createBlock, createLabelNode } from '@/test/mocks/sampleData';

describe('findLabelForLine', () => {
  it('returns the label whose startLine is at or before the given line', () => {
    const labelNodes = [
      createLabelNode({ id: 'block-1:start', label: 'start', blockId: 'block-1', startLine: 1 }),
      createLabelNode({ id: 'block-1:chapter1', label: 'chapter1', blockId: 'block-1', startLine: 10 }),
    ];
    expect(findLabelForLine('block-1', 5, labelNodes)?.label).toBe('start');
    expect(findLabelForLine('block-1', 12, labelNodes)?.label).toBe('chapter1');
  });

  it('returns undefined when the line is before any label in the block', () => {
    const labelNodes = [createLabelNode({ blockId: 'block-1', startLine: 10 })];
    expect(findLabelForLine('block-1', 5, labelNodes)).toBeUndefined();
  });

  it('ignores labels from other blocks', () => {
    const labelNodes = [createLabelNode({ id: 'block-2:start', label: 'start', blockId: 'block-2', startLine: 1 })];
    expect(findLabelForLine('block-1', 5, labelNodes)).toBeUndefined();
  });
});

describe('groupUsageLocations', () => {
  it('groups multiple occurrences in the same file/label into one row with a count', () => {
    const blocks = [createBlock({ id: 'block-1', filePath: 'game/script.rpy' })];
    const labelNodes = [createLabelNode({ blockId: 'block-1', label: 'start', startLine: 1 })];
    const occurrences = [
      { blockId: 'block-1', line: 2 },
      { blockId: 'block-1', line: 4 },
    ];
    const result = groupUsageLocations(occurrences, blocks, labelNodes);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ fileName: 'script.rpy', label: 'start', firstLine: 2, count: 2 });
  });

  it('assigns label: null for occurrences before the first label', () => {
    const blocks = [createBlock({ id: 'block-1', filePath: 'game/script.rpy' })];
    const labelNodes = [createLabelNode({ blockId: 'block-1', label: 'start', startLine: 10 })];
    const result = groupUsageLocations([{ blockId: 'block-1', line: 2 }], blocks, labelNodes);
    expect(result[0].label).toBeNull();
  });

  it('skips occurrences referencing a block that no longer exists', () => {
    const blocks = [createBlock({ id: 'block-1' })];
    const result = groupUsageLocations([{ blockId: 'stale-block', line: 1 }], blocks, []);
    expect(result).toHaveLength(0);
  });

  it('sorts groups by file name then label', () => {
    const blocks = [
      createBlock({ id: 'block-1', filePath: 'game/b.rpy' }),
      createBlock({ id: 'block-2', filePath: 'game/a.rpy' }),
    ];
    const labelNodes = [
      createLabelNode({ id: 'block-1:z', blockId: 'block-1', label: 'z', startLine: 1 }),
      createLabelNode({ id: 'block-2:a', blockId: 'block-2', label: 'a', startLine: 1 }),
    ];
    const occurrences = [
      { blockId: 'block-1', line: 2 },
      { blockId: 'block-2', line: 2 },
    ];
    const result = groupUsageLocations(occurrences, blocks, labelNodes);
    expect(result.map(r => r.fileName)).toEqual(['a.rpy', 'b.rpy']);
  });
});
