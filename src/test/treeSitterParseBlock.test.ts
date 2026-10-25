import { describe, it, expect, vi, afterEach } from 'vitest';
import { parseBlock, disposeParsedBlock } from '@/lib/tree-sitter/parseBlock';
import * as symbolTableModule from '@/lib/tree-sitter/symbolTable';

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

  // nms4.9: a comment after the block colon (`init python: # setup`) is a
  // child of the python statement but not part of its body. It must not
  // become the injection's first node — its column would drive the dedent
  // and flatten the body's nested indentation.
  it('excludes a header-line comment from the python: block injection span', async () => {
    const source = 'init python: # setup\n    def foo(a):\n        return a\n';
    const result = await parseBlock(source);
    try {
      expect(result.tree.rootNode.hasError).toBe(false);
      const blockInjections = result.pythonInjections.filter((i) => i.kind === 'python-block');
      expect(blockInjections).toHaveLength(1);
      expect(blockInjections[0].range[0]).toBe(source.indexOf('def foo'));
      const pythonRoot = blockInjections[0].tree.rootNode;
      expect(pythonRoot.hasError).toBe(false);
      expect(pythonRoot.namedChildren.map((c) => c.type)).toEqual(['function_definition']);
    } finally {
      disposeParsedBlock(result);
    }
  });

  // nms4.14: a screen property value is one Python expression that ends
  // where the next property name starts, and a screen `for`/`if` header is
  // one expression up to the block colon.
  it('screen injections are whole expressions', async () => {
    const source = 'screen inv(items):\n    for i in items:\n        textbutton i.name action SetScreenVariable("sel", i)\n';
    const result = await parseBlock(source);
    try {
      expect(result.tree.rootNode.hasError).toBe(false);
      const texts = result.pythonInjections
        .filter((i) => i.kind === 'screen-expression')
        .sort((a, b) => a.range[0] - b.range[0])
        .map((i) => source.slice(i.range[0], i.range[1]));
      expect(texts).toEqual(['i in items', 'i.name', 'SetScreenVariable("sel", i)']);
    } finally {
      disposeParsedBlock(result);
    }
  });

  it('keeps a signed value with its property and a comma list in a keyword value', async () => {
    const source = 'screen a():\n    hbox spacing -10:\n        text "x" xoffset -10 size 100 + offset\n    add "img" at a, b\n';
    const result = await parseBlock(source);
    try {
      expect(result.tree.rootNode.hasError).toBe(false);
      const texts = result.pythonInjections
        .filter((i) => i.kind === 'screen-expression')
        .sort((a, b) => a.range[0] - b.range[0])
        .map((i) => source.slice(i.range[0], i.range[1]));
      // q85r: the lone strings "x" and "img" are `string` values, not injected as Python.
      expect(texts).toEqual(['-10', '-10', '100 + offset', 'a, b']);
    } finally {
      disposeParsedBlock(result);
    }
  });
});

describe('parseBlock failure cleanup', () => {
  afterEach(() => vi.restoreAllMocks());

  const TWO_INJECTIONS = 'label a:\n    $ x = 1\n    $ y = 2\n';

  /** Prototypes of real Tree / Node instances (web-tree-sitter does not export the classes). */
  async function prototypes() {
    const probe = await parseBlock('label a:\n    $ x = 1\n');
    const treeProto = Object.getPrototypeOf(probe.tree) as { delete: () => void };
    const nodeProto = Object.getPrototypeOf(probe.tree.rootNode) as object;
    disposeParsedBlock(probe);
    return { treeProto, nodeProto };
  }

  it('frees the Ren\'Py tree and the injection tree when injection processing throws part-way', async () => {
    const { treeProto, nodeProto } = await prototypes();
    const del = vi.spyOn(treeProto, 'delete');
    // injectionKindForNode walks `parent` after the injection's Python tree is
    // parsed, so this throws with the Ren'Py tree and one Python tree live.
    vi.spyOn(nodeProto as { parent: unknown }, 'parent', 'get').mockImplementation(() => {
      throw new Error('walk failed');
    });
    await expect(parseBlock(TWO_INJECTIONS)).rejects.toThrow('walk failed');
    expect(del).toHaveBeenCalledTimes(2);
  });

  it('frees every tree when symbol table extraction throws', async () => {
    const { treeProto } = await prototypes();
    const del = vi.spyOn(treeProto, 'delete');
    vi.spyOn(symbolTableModule, 'extractSymbolTable').mockImplementation(() => { throw new Error('extract failed'); });
    await expect(parseBlock(TWO_INJECTIONS)).rejects.toThrow('extract failed');
    expect(del).toHaveBeenCalledTimes(3);
  });
});
