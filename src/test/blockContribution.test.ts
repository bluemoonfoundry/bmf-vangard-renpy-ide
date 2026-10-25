import { describe, it, expect, vi, afterEach } from 'vitest';
import * as parseBlockModule from '@/lib/tree-sitter/parseBlock';
import { buildBlockContribution, resetBlockFailureWarnings } from '@/lib/tree-sitter/blockContribution';
import { djb2 } from '@/lib/contentHash';
import type { BlockContribution, SymbolReference } from '@/types';

const build = (content: string, filePath = 'game/test.rpy') => buildBlockContribution({ id: 'b1', filePath, content });
const text = (content: string, ref: { range: { start: { offset: number }; end: { offset: number } } }) =>
  content.slice(ref.range.start.offset, ref.range.end.offset);
const find = (c: BlockContribution, name: string, refKind: SymbolReference['refKind']) =>
  c.references.find((r) => r.name === name && r.refKind === refKind)!;

afterEach(() => vi.restoreAllMocks());

describe('buildBlockContribution', () => {
  it('combines Ren\'Py and Python results with block metadata', async () => {
    const content = 'label start:\n    $ points += 1\n    jump end\n';
    const c = await build(content);
    expect(c.blockId).toBe('b1');
    expect(c.filePath).toBe('game/test.rpy');
    expect(c.contentHash).toBe(djb2(content));
    expect(c.hasError).toBe(false);
    expect(c.definitions.map((d) => d.symbolId)).toEqual(['label:start']);
    expect(c.references.map((r) => [r.symbolId, r.refKind, r.context])).toEqual([
      ['variable:points', 'write', 'dollar'],
      ['label:end', 'jump', 'statement'],
    ]);
    expect(c.references[0].enclosingLabel).toBe('label:start');
  });

  it('maps Python ranges back to the .rpy source, including later python-block lines', async () => {
    const content = 'init python:\n    x = 1\n    def f():\n        return y\n';
    const c = await build(content);
    const y = find(c, 'y', 'read');
    expect(text(content, y)).toBe('y');
    expect(y.range.start).toEqual({ line: 4, column: 15, offset: content.indexOf('y\n') });
    const f = c.definitions.find((d) => d.symbolId === 'python-function:f')!;
    expect(text(content, { range: f.nameRange })).toBe('f');
    expect(f.defKind).toBe('def');
  });

  it('maps ranges correctly with CRLF line endings', async () => {
    const content = 'init python:\r\n    x = 1\r\n    y = x + z\r\n';
    const c = await build(content);
    const z = find(c, 'z', 'read');
    expect(text(content, z)).toBe('z');
    expect(z.range.start.line).toBe(3);
  });

  it('keeps ranges exact after non-ASCII text on earlier lines and the same line', async () => {
    const content = 'label start:\n    e "héllo 😀 [points]"\n    $ mood = "café" + points_str\n';
    const c = await build(content);
    expect(text(content, find(c, 'points', 'read'))).toBe('points');
    expect(text(content, find(c, 'points_str', 'read'))).toBe('points_str');
    expect(text(content, find(c, 'mood', 'write'))).toBe('mood');
  });

  it('assigns a context to each injection kind', async () => {
    const content = [
      'label a:',
      '    if hp > 0:',
      '        $ hp -= 1',
      '    menu:',
      '        "Go" if brave:',
      '            return',
      'screen s():',
      '    text "x" size font_size',
      'transform t:',
      '    xalign target_x',
      'python:',
      '    total = 1',
      '',
    ].join('\n');
    const c = await build(content);
    const ctx = (name: string) => c.references.find((r) => r.name === name)!.context;
    expect(ctx('hp')).toBe('condition');
    expect(find(c, 'hp', 'write').context).toBe('dollar');
    expect(ctx('brave')).toBe('condition');
    expect(ctx('font_size')).toBe('screen-expression');
    expect(ctx('target_x')).toBe('atl-expression');
    expect(ctx('total')).toBe('python-block');
  });

  it('reads ATL interpolation durations and property values, but not the warper name (nms4.24)', async () => {
    const content = 'transform t:\n    linear slide_time xalign target_x\n    warp my_warper 1.0 zoom z\n';
    const c = await build(content);
    expect(c.hasError).toBe(false);
    expect(c.references.map((r) => [r.symbolId, r.refKind, r.context])).toEqual([
      ['variable:slide_time', 'read', 'atl-expression'],
      ['variable:target_x', 'read', 'atl-expression'],
      ['variable:my_warper', 'read', 'atl-expression'],
      ['variable:z', 'read', 'atl-expression'],
    ]);
  });

  it('reads an ATL repeat count (nms4.19)', async () => {
    const c = await build('transform t:\n    alpha 0.0\n    repeat times\n');
    expect(c.hasError).toBe(false);
    expect(c.references.map((r) => [r.symbolId, r.refKind, r.context])).toEqual([
      ['variable:times', 'read', 'atl-expression'],
    ]);
  });

  it('reads the weight of an ATL choice block (nms4.41)', async () => {
    const c = await build('transform t:\n    choice rare_weight:\n        alpha 0.0\n    choice:\n        alpha 1.0\n');
    expect(c.hasError).toBe(false);
    expect(c.references.map((r) => [r.symbolId, r.refKind, r.context])).toEqual([
      ['variable:rare_weight', 'read', 'atl-expression'],
    ]);
  });

  it('reads the transition of an ATL displayable line (nms4.28)', async () => {
    const c = await build('image anim:\n    "a.png"\n    0.5\n    "b.png" with fade_in\n');
    expect(c.hasError).toBe(false);
    expect(c.references.map((r) => [r.symbolId, r.refKind, r.context])).toEqual([
      ['variable:fade_in', 'read', 'atl-expression'],
    ]);
  });

  it('maps reads on later lines of a multi-line $ value back to the source (nms4.35)', async () => {
    for (const eol of ['\n', '\r\n']) {
      const content = ['label start:', '    $ x = foo(1,', '            bar)', '    return', ''].join(eol);
      const c = await build(content);
      expect(c.hasError).toBe(false);
      const bar = find(c, 'bar', 'read');
      expect(text(content, bar)).toBe('bar');
      expect(bar.range.start).toEqual({ line: 3, column: 12, offset: content.indexOf('bar') });
      expect(bar.context).toBe('dollar');
      expect(find(c, 'x', 'write').range.start.line).toBe(2);
    }
  });

  it('reads a screen-local default value but defines nothing (nms4.32)', async () => {
    const content = 'screen help:\n    default device = preferred_device\n    text "[device]"\n';
    const c = await build(content);
    expect(c.hasError).toBe(false);
    expect(c.definitions.map((d) => d.symbolId)).toEqual(['screen:help']);
    // `device` is screen-local (nms4.31), so its interpolation is not a store read.
    expect(c.references.map((r) => [r.symbolId, r.refKind, r.context])).toEqual([
      ['variable:preferred_device', 'read', 'screen-expression'],
    ]);
  });

  it('walks a `$` line inside a screen body as Python (nms4.37)', async () => {
    const content = 'screen s:\n    for i in items:\n        $ slot = i + bonus\n        text "[slot]"\n';
    const c = await build(content);
    expect(c.hasError).toBe(false);
    // `slot` and `i` are screen-local (nms4.31); only the store names remain.
    expect(c.references.map((r) => [r.symbolId, r.refKind, r.context])).toEqual([
      ['variable:items', 'read', 'screen-expression'],
      ['variable:bonus', 'read', 'dollar'],
    ]);
  });

  describe('screen scope (nms4.31)', () => {
    const refs = (c: BlockContribution) => c.references.map((r) => [r.symbolId, r.refKind]);

    it('does not record screen parameters or for targets as store variables', async () => {
      const content = [
        'screen inv(items, title="Inventory", *rest, **extra):',
        '    text title',
        '    text "[title] [gold]"',
        '    for it in items:',
        '        textbutton it.name action Function(pick, it, rest, extra)',
        '',
      ].join('\n');
      const c = await build(content);
      expect(c.hasError).toBe(false);
      expect(refs(c)).toEqual([['variable:gold', 'read'], ['variable:Function', 'read'], ['variable:pick', 'read']]);
    });

    it('takes every name of a tuple for target', async () => {
      const c = await build('screen s(pairs):\n    for n, (k, v) in enumerate(pairs):\n        text "[n] [k] [v] [caption]"\n');
      expect(c.hasError).toBe(false);
      expect(refs(c)).toEqual([['variable:enumerate', 'read'], ['variable:caption', 'read']]);
    });

    it('keeps `store.` and `persistent.` names global inside a screen', async () => {
      const c = await build('screen s(score):\n    $ store.score = score\n    $ persistent.seen = True\n    text "[persistent.seen]"\n');
      expect(c.hasError).toBe(false);
      expect(refs(c)).toEqual([
        ['variable:score', 'write'],
        ['variable:persistent.seen', 'write'],
        ['variable:persistent.seen', 'read'],
      ]);
    });

    it('does not leak screen-local names out of the screen', async () => {
      const content = [
        'screen a(hp):',
        '    default sel = 0',
        '    text "[hp] [sel]"',
        'screen b():',
        '    text "[hp] [sel]"',
        'label start:',
        '    $ hp = sel',
        '',
      ].join('\n');
      const c = await build(content);
      expect(c.hasError).toBe(false);
      expect(refs(c)).toEqual([
        ['variable:hp', 'read'], ['variable:sel', 'read'],
        ['variable:hp', 'write'], ['variable:sel', 'read'],
      ]);
    });

    it('does not read the name on a screen `tag` line (nms4.47)', async () => {
      const c = await build('screen prefs():\n    tag menu\n    text "[volume]"\n');
      expect(c.hasError).toBe(false);
      expect(refs(c)).toEqual([['variable:volume', 'read']]);
    });

    it('walks a screen `python:` block as Python with screen-local names (nms4.34)', async () => {
      const content = [
        'screen s():',
        '    python:',
        '        """Doc."""',
        '        def label_for(n):',
        '            return prefix + str(n)',
        '        with open(p) as fh:',
        '            total = gold + 1',
        '        store.seen = True',
        '    text "[total] [label_for(1)]"',
        '',
      ].join('\n');
      const c = await build(content);
      expect(c.hasError).toBe(false);
      expect(c.definitions.map((d) => d.symbolId)).toEqual(['screen:s']);
      expect(refs(c)).toEqual([
        ['variable:prefix', 'read'], ['variable:str', 'read'],
        ['variable:open', 'read'], ['variable:p', 'read'],
        ['variable:gold', 'read'], ['variable:seen', 'write'],
      ]);
    });
  });

  describe('named stores (nms4.34)', () => {
    const refs = (c: BlockContribution) => c.references.map((r) => [r.symbolId, r.refKind]);

    it('qualifies definitions and writes in `init python in X:` with the store name', async () => {
      const content = [
        'init python in mystore:',
        '    count = 0',
        '    def bump():',
        '        return count + other',
        '    class Bag:',
        '        pass',
        '    store.flag = len(Bag())',
        '',
      ].join('\n');
      const c = await build(content);
      expect(c.hasError).toBe(false);
      expect(c.definitions.map((d) => [d.symbolId, d.name])).toEqual([
        ['python-function:mystore.bump', 'mystore.bump'],
        ['python-class:mystore.Bag', 'mystore.Bag'],
      ]);
      expect(refs(c)).toEqual([
        ['variable:mystore.count', 'write'],
        ['variable:mystore.count', 'read'],
        ['variable:other', 'read'],
        ['variable:flag', 'write'],
        ['variable:len', 'read'],
        ['variable:mystore.Bag', 'read'],
      ]);
      const count = c.references[0];
      expect(text(content, count)).toBe('count');
    });

    it('treats `python in store:` as the default store', async () => {
      const c = await build('init python in store:\n    def f():\n        pass\n    x = 1\n');
      expect(c.definitions.map((d) => d.symbolId)).toEqual(['python-function:f']);
      expect(refs(c)).toEqual([['variable:x', 'write']]);
    });
  });

  it('reads the expression of a menu set clause (nms4.29)', async () => {
    const content = 'label start:\n    menu:\n        set store.seen\n        "A":\n            pass\n';
    const c = await build(content);
    expect(c.hasError).toBe(false);
    expect(c.references.map((r) => [r.symbolId, r.refKind, r.context])).toEqual([
      ['variable:seen', 'read', 'statement'],
    ]);
    expect(c.references[0].range.start).toEqual({ line: 3, column: 12, offset: content.indexOf('store.seen') });
  });

  it('keeps trailing comments out of injected expressions (nms4.27)', async () => {
    const content = 'label a:\n    $ x = y # note z\nscreen s:\n    text "t" size big # tiny w\ntransform t:\n    alpha level # q\n';
    const c = await build(content);
    expect(c.hasError).toBe(false);
    expect(c.references.map((r) => [r.symbolId, r.refKind])).toEqual([
      ['variable:x', 'write'], ['variable:y', 'read'], ['variable:big', 'read'], ['variable:level', 'read'],
    ]);
  });

  it('maps reads inside a screen value continued onto later lines (nms4.35)', async () => {
    const content = 'screen s:\n    textbutton "Go" action [\n        Hide("a"),\n        Return(choice)]\n';
    const c = await build(content);
    expect(c.hasError).toBe(false);
    const choice = find(c, 'choice', 'read');
    expect(choice.range.start).toEqual({ line: 4, column: 15, offset: content.indexOf('choice') });
    expect(choice.context).toBe('screen-expression');
  });

  it('does not record the screen name in `use` as a variable, but keeps its argument reads', async () => {
    const c = await build('screen a():\n    use item_list(count)\n');
    expect(c.references.map((r) => [r.symbolId, r.refKind])).toEqual([
      ['screen:item_list', 'use'],
      ['variable:count', 'read'],
    ]);
  });

  it('only records def/class definitions from python blocks', async () => {
    const c = await build('label a:\n    $ f = lambda: 1\n');
    expect(c.definitions.map((d) => d.symbolId)).toEqual(['label:a']);
  });

  it('sorts definitions and references by source offset', async () => {
    const c = await build('label a:\n    jump b\n    $ x = 1\n    jump c\n');
    const offsets = c.references.map((r) => r.range.start.offset);
    expect(offsets).toEqual([...offsets].sort((p, q) => p - q));
  });

  it('flags syntax errors but keeps intact statements', async () => {
    const c = await build('label start:\n    jump ok\n    show\n');
    expect(c.hasError).toBe(true);
    expect(c.references.map((r) => r.symbolId)).toContain('label:ok');
  });

  it('returns an empty error contribution and still disposes the tree when extraction throws', async () => {
    const dispose = vi.spyOn(parseBlockModule, 'disposeParsedBlock');
    const realParse = parseBlockModule.parseBlock;
    vi.spyOn(parseBlockModule, 'parseBlock').mockImplementation(async (content: string) => {
      const parsed = await realParse(content);
      Object.defineProperty(parsed.tree, 'rootNode', { get: () => { throw new Error('boom'); } });
      return parsed;
    });
    const c = await build('label start:\n    return\n');
    expect(c).toMatchObject({ blockId: 'b1', hasError: true, definitions: [], references: [], menus: [], pythonBlocks: [] });
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  it('returns an empty error contribution when parsing itself throws', async () => {
    vi.spyOn(parseBlockModule, 'parseBlock').mockRejectedValue(new Error('wasm failed'));
    const c = await build('label start:\n');
    expect(c).toMatchObject({ hasError: true, definitions: [], references: [] });
  });
});

describe('buildBlockContribution final-review fixes', () => {
  const names = (c: BlockContribution) => c.references.map((r) => `${r.refKind}:${r.symbolId}`);

  it('does not walk python bodies as Ren\'Py statements (I1)', async () => {
    const content = [
      'init python:',
      '    def tally(n):',
      '        """Counts [secret] things."""',
      '        for j in range(n):',
      '            if j:',
      '                pass',
      '        while n:',
      '            n -= 1',
      '        return n',
      '',
    ].join('\n');
    const c = await build(content);
    expect(c.references.filter((r) => r.name === 'j' || r.name === 'n')).toEqual([]);
    expect(c.references.filter((r) => r.name === 'secret')).toEqual([]);
    expect(c.references.filter((r) => r.context === 'interpolation' || r.refKind === 'speaker')).toEqual([]);
    expect(c.pythonBlocks).toHaveLength(1);
    expect(c.definitions.map((d) => d.symbolId)).toEqual(['python-function:tally']);
  });

  it('valid Python bodies do not set hasError', async () => {
    const content = [
      'init python:',
      '    def f(p):',
      '        """Doc."""',
      '        with open(p) as fh:',
      '            return fh.read()',
      '',
    ].join('\n');
    const c = await build(content);
    expect(c.hasError).toBe(false);
    expect(c.definitions.map((d) => d.symbolId)).toContain('python-function:f');
  });

  it('reads a condition inside a python body once, not once per nested injection (I1)', async () => {
    const c = await build('init python:\n    if x:\n        y = 1\n    while z:\n        pass\n');
    expect(names(c).filter((n) => n === 'read:variable:x')).toHaveLength(1);
    expect(names(c).filter((n) => n === 'read:variable:z')).toHaveLength(1);
    expect(names(c).filter((n) => n === 'write:variable:y')).toHaveLength(1);
  });

  it('never records Python keywords as names in screen code (I4 mitigation)', async () => {
    const content = [
      'screen pick(items):',
      '    for i in items:',
      '        textbutton title action SetScreenVariable("sel", i)',
      '',
    ].join('\n');
    const c = await build(content);
    const keywordish = c.references.filter((r) => ['in', 'not', 'and', 'or', 'is', 'if', 'else', 'for', 'lambda'].includes(r.name));
    expect(keywordish).toEqual([]);
  });

  it('no reads of screen keywords', async () => {
    const c = await build('screen inv(items):\n    for i in items:\n        textbutton i.name action SetScreenVariable("sel", i)\n');
    expect(c.hasError).toBe(false);
    expect(c.references.filter((r) => ['in', 'action', 'for'].includes(r.name))).toEqual([]);
  });

  it('ignores half-typed labels with a missing or empty name (T4)', async () => {
    const c = await build('label :\n    return\nlabel start:\n    return\n');
    expect(c.definitions.map((d) => d.symbolId)).toEqual(['label:start']);
    expect(c.definitions.every((d) => d.name !== '')).toBe(true);
  });

  it('does not record built-in speakers as character references', async () => {
    const c = await build('label a:\n    extend "more"\n    narrator "n"\n    centered "c"\n    nvl "v"\n    e "hi"\n');
    expect(c.references.filter((r) => r.refKind === 'speaker').map((r) => r.symbolId)).toEqual(['character:e']);
  });

  it('does not record `show text` as an image reference', async () => {
    const c = await build('label a:\n    show text "Hello" at truecenter\n    show eileen happy\n');
    expect(c.references.filter((r) => r.kind === 'image').map((r) => r.symbolId)).toEqual(['image:eileen happy']);
  });
});

describe('buildBlockContribution failure warnings (T6)', () => {
  afterEach(() => resetBlockFailureWarnings());

  it('warns with the file path when parsing throws, and still returns an error contribution', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(parseBlockModule, 'parseBlock').mockRejectedValue(new Error('wasm failed'));
    const c = await build('label start:\n', 'game/broken.rpy');
    expect(c).toMatchObject({ hasError: true, definitions: [], references: [] });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toContain('game/broken.rpy');
  });

  it('warns with the file path when extraction throws', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const realParse = parseBlockModule.parseBlock;
    vi.spyOn(parseBlockModule, 'parseBlock').mockImplementation(async (content: string) => {
      const parsed = await realParse(content);
      Object.defineProperty(parsed.tree, 'rootNode', { get: () => { throw new Error('boom'); } });
      return parsed;
    });
    const c = await build('label start:\n    return\n', 'game/odd.rpy');
    expect(c.hasError).toBe(true);
    expect(String(warn.mock.calls[0][0])).toContain('game/odd.rpy');
  });

  it('throttles warnings when every block fails', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(parseBlockModule, 'parseBlock').mockRejectedValue(new Error('wasm failed'));
    for (let i = 0; i < 20; i++) await build('label start:\n', `game/f${i}.rpy`);
    expect(warn.mock.calls.length).toBeGreaterThan(1);
    expect(warn.mock.calls.length).toBeLessThanOrEqual(6);
  });
});
