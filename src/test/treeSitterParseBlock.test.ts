import { describe, it, expect } from 'vitest';
import { parseBlock, disposeParsedBlock } from '@/lib/tree-sitter/parseBlock';

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

  // Final-review fix I1: `ParsedBlock` must carry the spec's (Section 6)
  // fourth field, `symbolTable`, not just tree/injections/timing.
  it('returns a populated symbolTable as part of ParsedBlock', async () => {
    const result = await parseBlock(
      'define e = Character("Eileen")\nlabel start:\n    jump chapter_one\n'
    );
    expect(Object.keys(result).sort()).toEqual(
      ['parseTimeMs', 'pythonInjections', 'symbolTable', 'tree'],
    );
    expect(result.symbolTable.characters.map((c) => c.name)).toEqual(['e']);
    expect(result.symbolTable.labels.map((l) => l.name)).toEqual(['start']);
  });

  // Final-review fix I2: callers own the WASM-heap trees; `disposeParsedBlock`
  // is the documented way to free the Ren'Py tree plus every injection tree.
  it('disposeParsedBlock frees the renpy tree and every injection tree', async () => {
    const result = await parseBlock('label start:\n    $ points += 1\n    $ trust += 1\n');
    expect(result.pythonInjections.length).toBeGreaterThanOrEqual(2);

    const deleted: string[] = [];
    const spy = (label: string, tree: { delete: () => void }) => {
      const original = tree.delete.bind(tree);
      tree.delete = () => {
        deleted.push(label);
        original();
      };
    };
    spy('renpy', result.tree);
    result.pythonInjections.forEach((inj, i) => spy(`injection-${i}`, inj.tree));

    disposeParsedBlock(result);

    expect(deleted).toContain('renpy');
    expect(deleted.filter((d) => d.startsWith('injection-'))).toHaveLength(
      result.pythonInjections.length,
    );
  });

  // Final-review fix C1: colon-bearing Python values (dicts, lambdas, defs)
  // must survive into the injected Python parse instead of ERRORing.
  it('parses colon-bearing Python inside a python: block and injects it cleanly', async () => {
    const result = await parseBlock(
      'label start:\n    python:\n        d = {"a": 1}\n        f = lambda x: x * 2\n'
    );
    expect(result.tree.rootNode.hasError).toBe(false);
    const blockInjections = result.pythonInjections.filter((i) => i.kind === 'python-block');
    expect(blockInjections).toHaveLength(1);
    expect(blockInjections[0].tree.rootNode.hasError).toBe(false);
  });
});
