import { describe, it, expect } from 'vitest';
import { parseBlock, disposeParsedBlock } from '@/lib/tree-sitter/parseBlock';
import { walkPythonTree, type PythonWalkResult } from '@/lib/tree-sitter/pythonWalk';

/** Walks every Python injection in `content`, concatenating results in injection order. */
async function walkPython(content: string, allowDefinitions = true): Promise<PythonWalkResult> {
  const block = await parseBlock(content);
  try {
    const result: PythonWalkResult = { uses: [], defs: [] };
    for (const injection of [...block.pythonInjections].sort((a, b) => a.range[0] - b.range[0])) {
      const r = walkPythonTree(injection.tree.rootNode, { allowDefinitions });
      result.uses.push(...r.uses);
      result.defs.push(...r.defs);
    }
    return result;
  } finally {
    disposeParsedBlock(block);
  }
}

const uses = (r: PythonWalkResult) => r.uses.map((u) => `${u.refKind}:${u.name}`);

describe('walkPythonTree', () => {
  it('records assignment targets as writes and other names as reads', async () => {
    const r = await walkPython('label a:\n    $ total = points + bonus\n');
    expect(uses(r)).toEqual(['read:points', 'read:bonus', 'write:total']);
  });

  it('treats augmented assignment and tuple targets as writes', async () => {
    const r = await walkPython('label a:\n    $ points += 1\n    $ a, (b, c) = 1, (2, 3)\n');
    expect(uses(r)).toEqual(['write:points', 'write:a', 'write:b', 'write:c']);
  });

  it('treats `with ... as` and `except ... as` targets as writes (nms4.34)', async () => {
    const r = await walkPython('init python:\n    with open(p) as fh:\n        data = fh.read()\n    try:\n        pass\n    except KeyError as err:\n        last = err\n');
    expect(uses(r)).toEqual([
      'read:open', 'read:p', 'write:fh', 'read:fh', 'write:data', 'read:KeyError', 'write:err', 'read:err', 'write:last',
    ]);
  });

  it('normalizes store. and persistent. chains and reads only the base of other attributes', async () => {
    const r = await walkPython('label a:\n    $ store.gold = persistent.seen.flag\n    $ player.hp = 3\n');
    expect(uses(r)).toEqual(['read:persistent.seen', 'write:gold', 'read:player']);
  });

  it('skips function parameters and locals but records store reads inside functions', async () => {
    const content = [
      'init python:',
      '    def f(a, b=default_b, *args, **kw):',
      '        y = a + x',
      '        return [i for i in range(y)] + list(map(lambda z: z + q, kw))',
      '',
    ].join('\n');
    const r = await walkPython(content);
    // Builtins are recorded too; resolveProjectIndex drops them when nothing defines them (nms4.13).
    expect(uses(r)).toEqual(['read:default_b', 'read:x', 'read:range', 'read:list', 'read:map', 'read:q']);
    expect(r.defs.map((d) => [d.kind, d.name])).toEqual([['python-function', 'f']]);
  });

  it('records writes inside a function only for names declared global', async () => {
    const r = await walkPython('init python:\n    def award(n):\n        global points\n        points += n\n        local_total = n\n        return points\n');
    expect(uses(r)).toEqual(['write:points', 'read:points']);
  });

  it('records classes, their superclasses, and store reads in class bodies', async () => {
    const r = await walkPython('init python:\n    class Item(Base):\n        weight = default_weight\n');
    expect(r.defs.map((d) => [d.kind, d.name])).toEqual([['python-class', 'Item']]);
    expect(uses(r)).toEqual(['read:Base', 'read:default_weight']);
  });

  it('records calls as reads of the function name and skips keyword argument names', async () => {
    const r = await walkPython('label a:\n    $ award(amount=bonus)\n');
    expect(uses(r)).toEqual(['read:award', 'read:bonus']);
  });

  it('skips imported and underscore names but leaves builtins and Ren\'Py namespaces for resolution', async () => {
    const r = await walkPython('init python:\n    import math\n    from foo import bar as baz\n    x = math.sqrt(len(renpy.random.random())) + baz + _private\n');
    expect(uses(r)).toEqual(['read:len', 'read:renpy', 'write:x']);
  });

  it('does not record definitions when not allowed', async () => {
    const r = await walkPython('init python:\n    def f():\n        return 1\n', false);
    expect(r.defs).toEqual([]);
  });

  it('ignores identifiers inside Python ERROR nodes (screen property lists)', async () => {
    const r = await walkPython('screen s():\n    textbutton "Go" action SetVariable("points", points + 1)\n');
    expect(uses(r)).toEqual(['read:SetVariable', 'read:points']);
  });

  it('reports span-relative points', async () => {
    const r = await walkPython('label a:\n    $ x = y\n');
    const y = r.uses.find((u) => u.name === 'y')!;
    expect(y.start).toEqual({ row: 0, column: 4 });
    expect(y.end).toEqual({ row: 0, column: 5 });
  });
});
