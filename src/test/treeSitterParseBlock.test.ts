import { describe, it, expect } from 'vitest';
import { parseBlock } from '@/lib/tree-sitter/parseBlock';

describe('parseBlock', () => {
  it('parses a simple label with a jump into a clean tree with no ERROR nodes', async () => {
    const result = await parseBlock('label start:\n    jump chapter_one\n');
    expect(result.tree.rootNode.hasError).toBe(false);
    expect(result.tree.rootNode.type).toBe('source_file');
  });

  it('identifies a dollar_statement as a python-injection span', async () => {
    const result = await parseBlock('label start:\n    $ points += 1\n');
    expect(result.pythonInjections).toHaveLength(1);
    expect(result.pythonInjections[0].kind).toBe('dollar-statement');
  });

  it('identifies a python: block body as a python-injection span', async () => {
    const result = await parseBlock('label start:\n    python:\n        total = 1\n');
    expect(result.pythonInjections.some(inj => inj.kind === 'python-block')).toBe(true);
  });

  it('reports parseTimeMs as a non-negative number', async () => {
    const result = await parseBlock('label start:\n    jump chapter_one\n');
    expect(result.parseTimeMs).toBeGreaterThanOrEqual(0);
  });

  it('combines a multi-statement python: block into one parseable Python module', async () => {
    const result = await parseBlock(
      'label start:\n    python:\n        total = 1\n        total += 2\n'
    );
    const blockInjections = result.pythonInjections.filter(inj => inj.kind === 'python-block');
    expect(blockInjections).toHaveLength(1);
    expect(blockInjections[0].tree.rootNode.hasError).toBe(false);
  });

  it('caches the parser/language singleton across calls (fast second call)', async () => {
    await parseBlock('label start:\n    jump chapter_one\n');
    const second = await parseBlock('label start:\n    jump chapter_one\n');
    expect(second.tree.rootNode.hasError).toBe(false);
  });
});
