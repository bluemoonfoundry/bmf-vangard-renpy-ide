import { describe, it, expect } from 'vitest';
import { parseBlock, disposeParsedBlock } from '@/lib/tree-sitter/parseBlock';
import { createRangeContext } from '@/lib/tree-sitter/sourceRange';
import { walkRenpyTree, enclosingLabelFor, type RenpyWalkResult } from '@/lib/tree-sitter/renpyWalk';

async function walk(content: string): Promise<RenpyWalkResult> {
  const block = await parseBlock(content);
  try {
    return walkRenpyTree(block.tree.rootNode, createRangeContext('b1', 'game/test.rpy', content));
  } finally {
    disposeParsedBlock(block);
  }
}

const defs = (r: RenpyWalkResult) => r.definitions.map((d) => [d.symbolId, d.defKind]);
const refs = (r: RenpyWalkResult) => r.references.map((x) => [x.symbolId, x.refKind, x.context]);

describe('walkRenpyTree definitions', () => {
  it('qualifies local labels and tracks the global label in document order', async () => {
    const r = await walk('label start:\n    return\nlabel .sub:\n    return\nlabel start.other:\n    return\nlabel next:\n    return\nlabel .sub:\n    return\n');
    expect(defs(r)).toEqual([
      ['label:start', 'label'], ['label:start.sub', 'label'], ['label:start.other', 'label'],
      ['label:next', 'label'], ['label:next.sub', 'label'],
    ]);
  });

  it('records label name ranges and parameters', async () => {
    const content = 'label greet(name="x"):\n    return\n';
    const r = await walk(content);
    const d = r.definitions[0];
    expect(content.slice(d.nameRange.start.offset, d.nameRange.end.offset)).toBe('greet');
    expect(d.nameRange.start).toEqual({ line: 1, column: 6, offset: 6 });
    expect(d.detail).toBe('(name="x")');
    expect(d.enclosingLabel).toBeNull();
  });

  it('records define/default as variable or character definitions', async () => {
    const r = await walk('define e = Character("Eileen")\ndefine store.speed = 2\ndefault points = 0\ndefault persistent.seen = False\n');
    expect(defs(r)).toEqual([
      ['character:e', 'define'], ['variable:speed', 'define'],
      ['variable:points', 'default'], ['variable:persistent.seen', 'default'],
    ]);
    expect(r.definitions[2].detail).toBe('0');
  });

  it('records screens, transforms, styles and multi-word images', async () => {
    const content = 'screen inv(items):\n    text "x"\ntransform slide:\n    xalign 0.5\nstyle big is say_dialogue:\n    size 40\nimage eileen happy = "e.png"\n';
    const r = await walk(content);
    expect(defs(r)).toEqual([
      ['screen:inv', 'screen'], ['transform:slide', 'transform'], ['style:big', 'style'], ['image:eileen happy', 'image'],
    ]);
    expect(r.definitions[2].detail).toBe('say_dialogue');
    const image = r.definitions[3];
    expect(content.slice(image.nameRange.start.offset, image.nameRange.end.offset)).toBe('eileen happy');
  });

  it('records named menus as labels plus menu info with choices', async () => {
    const r = await walk('label start:\n    menu choose:\n        "Left" if brave:\n            return\n        "Right":\n            return\n');
    expect(defs(r)).toEqual([['label:start', 'label'], ['label:choose', 'menu-label']]);
    expect(r.menus).toHaveLength(1);
    expect(r.menus[0].labelId).toBe('label:choose');
    expect(r.menus[0].enclosingLabel).toBe('label:start');
    expect(r.menus[0].choices.map((c) => [c.text, c.condition])).toEqual([['Left', 'brave'], ['Right', null]]);
  });

  it('records an image defined with an ATL body', async () => {
    const content = 'image logo:\n    "logo.png"\n    alpha 1.0\nimage eileen happy:\n    "e.png"\n';
    const r = await walk(content);
    expect(defs(r)).toEqual([['image:logo', 'image'], ['image:eileen happy', 'image']]);
    const image = r.definitions[1];
    expect(content.slice(image.nameRange.start.offset, image.nameRange.end.offset)).toBe('eileen happy');
  });

  it('does not count a menu caption or set as a choice', async () => {
    const r = await walk('label a:\n    menu:\n        set seen\n        "Where?"\n        "Left":\n            return\n        "Right":\n            pass\n');
    expect(r.menus).toHaveLength(1);
    expect(r.menus[0].choices.map((c) => c.text)).toEqual(['Left', 'Right']);
  });

  it('records the label created by call ... from', async () => {
    const r = await walk('label start:\n    call chapter from _call_chapter\n');
    expect(defs(r)).toContainEqual(['label:_call_chapter', 'label']);
  });

  it('records python blocks with init priority', async () => {
    const r = await walk('init 5 python:\n    x = 1\npython:\n    y = 2\n');
    expect(r.pythonBlocks.map((p) => [p.kind, p.priority])).toEqual([['init-python', 5], ['python', null]]);
  });
});

describe('walkRenpyTree references', () => {
  it('records jumps and calls, qualifying local targets', async () => {
    const r = await walk('label start:\n    jump .sub\n    call other.part\n    jump expression target_var\nlabel .sub:\n    return\n');
    expect(refs(r)).toEqual([
      ['label:start.sub', 'jump', 'statement'],
      ['label:other.part', 'call', 'statement'],
      [null, 'jump-expression', 'statement'],
    ]);
    expect(r.references[0].enclosingLabel).toBe('label:start');
  });

  it('records show/scene/hide image references by full name', async () => {
    const content = 'label a:\n    scene bg room\n    show eileen happy at left\n    hide eileen\n';
    const r = await walk(content);
    expect(refs(r)).toEqual([
      ['image:bg room', 'scene', 'statement'],
      ['image:eileen happy', 'show', 'statement'],
      ['image:eileen', 'hide', 'statement'],
    ]);
    const show = r.references[1];
    expect(content.slice(show.range.start.offset, show.range.end.offset)).toBe('eileen happy');
  });

  it('ends the image name before onlayer/zorder/behind clauses (nms4.30)', async () => {
    const content = 'label a:\n    show e happy onlayer over\n    show e zorder 2 behind bg\n    scene bg room onlayer master\n';
    const r = await walk(content);
    expect(refs(r)).toEqual([
      ['image:e happy', 'show', 'statement'],
      ['image:e', 'show', 'statement'],
      ['image:bg room', 'scene', 'statement'],
    ]);
  });

  it('records screen references from show/hide/call screen and use', async () => {
    const r = await walk('label a:\n    show screen hud\n    hide screen hud\n    call screen inv(1)\nscreen inv(n):\n    use item_list(n)\n');
    expect(refs(r)).toEqual([
      ['screen:hud', 'show-screen', 'statement'],
      ['screen:hud', 'hide-screen', 'statement'],
      ['screen:inv', 'call-screen', 'statement'],
      ['screen:item_list', 'use', 'statement'],
    ]);
  });

  it('records say speakers but not narration', async () => {
    const r = await walk('label a:\n    e "Hi"\n    "Narration."\n');
    expect(refs(r)).toEqual([['character:e', 'speaker', 'statement']]);
  });

  it('records [var] interpolation in say and menu-choice strings, skipping [[ escapes', async () => {
    const content = 'label a:\n    e "You have [points] and [player.hp!t] [[literal] [store.gold] [persistent.seen.x]"\n    menu:\n        "Spend [gold]":\n            return\n';
    const r = await walk(content);
    expect(refs(r)).toEqual([
      ['character:e', 'speaker', 'statement'],
      ['variable:points', 'read', 'interpolation'],
      ['variable:player', 'read', 'interpolation'],
      ['variable:gold', 'read', 'interpolation'],
      ['variable:persistent.seen', 'read', 'interpolation'],
      ['variable:gold', 'read', 'interpolation'],
    ]);
    const points = r.references[1];
    expect(content.slice(points.range.start.offset, points.range.end.offset)).toBe('points');
  });

  it('records interpolation reads in a menu caption', async () => {
    const content = 'label a:\n    menu:\n        e "Where to, [name]?"\n        "Left":\n            return\n';
    const r = await walk(content);
    expect(refs(r)).toEqual([
      ['character:e', 'speaker', 'statement'],
      ['variable:name', 'read', 'interpolation'],
    ]);
    const name = r.references[1];
    expect(content.slice(name.range.start.offset, name.range.end.offset)).toBe('name');
  });

  it('records interpolation reads in screen strings', async () => {
    const content = 'screen s():\n    text "Trust: [trust] / [persistent.max]"\n    textbutton "Go [[literal]" tooltip "Hi [name]" action Return()\n';
    const r = await walk(content);
    expect(refs(r)).toEqual([
      ['variable:trust', 'read', 'interpolation'],
      ['variable:persistent.max', 'read', 'interpolation'],
      ['variable:name', 'read', 'interpolation'],
    ]);
    const trust = r.references[0];
    expect(content.slice(trust.range.start.offset, trust.range.end.offset)).toBe('trust');
  });

  it('records for-loop targets as writes', async () => {
    const r = await walk('for i, item in items:\n    "x"\n');
    expect(refs(r)).toEqual([['variable:i', 'write', 'statement'], ['variable:item', 'write', 'statement']]);
  });

  it('still extracts intact statements from a block with a syntax error', async () => {
    const r = await walk('label start:\n    jump ok\n    show\nlabel later:\n    return\n');
    expect(defs(r)).toEqual([['label:start', 'label'], ['label:later', 'label']]);
    expect(refs(r)).toContainEqual(['label:ok', 'jump', 'statement']);
  });
});

describe('enclosingLabelFor', () => {
  it('returns the innermost label span containing the offset', () => {
    const spans = [{ id: 'label:a', start: 0, end: 100 }, { id: 'label:b', start: 10, end: 20 }];
    expect(enclosingLabelFor(spans, 15)).toBe('label:b');
    expect(enclosingLabelFor(spans, 50)).toBe('label:a');
    expect(enclosingLabelFor(spans, 150)).toBeNull();
  });
});

describe('walkRenpyTree missing names (T4)', () => {
  // The current grammar turns `label :` into an ERROR node, but tree-sitter
  // error recovery can insert a zero-width MISSING name node; such a node must
  // never become a `label:` symbol. A minimal node stand-in exercises that.
  interface FakeNode {
    type: string; text: string; isMissing: boolean; isNamed: boolean; startIndex: number; endIndex: number;
    children: FakeNode[]; namedChildren: FakeNode[]; parent: FakeNode | null;
    childForFieldName: (field: string) => FakeNode | null;
    childrenForFieldName: (field: string) => FakeNode[];
  }
  const node = (type: string, text: string, start: number, fields: Record<string, FakeNode> = {}, missing = false): FakeNode => {
    const children = Object.values(fields);
    const n: FakeNode = {
      type, text, isMissing: missing, isNamed: true, startIndex: start, endIndex: start + text.length,
      children, namedChildren: children, parent: null,
      childForFieldName: (field) => fields[field] ?? null,
      childrenForFieldName: (field) => (fields[field] ? [fields[field]] : []),
    };
    children.forEach((c) => { c.parent = n; });
    return n;
  };

  it('skips label, jump and screen statements whose name node is MISSING or empty', () => {
    const content = 'label :\njump \nscreen :\n';
    const root = node('source_file', content, 0, {
      a: node('label_statement', 'label :', 0, { name: node('identifier', '', 6, {}, true) }),
      b: node('jump_statement', 'jump ', 8, { target: node('identifier', '', 13, {}, true) }),
      c: node('screen_statement', 'screen :', 14, { name: node('identifier', ' ', 21) }),
    });
    const r = walkRenpyTree(root as unknown as Parameters<typeof walkRenpyTree>[0], createRangeContext('b1', 'game/test.rpy', content));
    expect(r.definitions).toEqual([]);
    expect(r.references).toEqual([]);
    expect(r.labelSpans).toEqual([]);
  });
});
