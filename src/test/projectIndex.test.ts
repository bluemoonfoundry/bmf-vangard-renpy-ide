import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildBlockContribution } from '@/lib/tree-sitter/blockContribution';
import { resolveProjectIndex } from '@/lib/tree-sitter/projectIndex';
import type { BlockContribution, ProjectSymbolIndex } from '@/types';

const FIXTURE_DIR = join(process.cwd(), 'src', 'test', 'fixtures', 'symbol-index');
const FILES = ['init.rpy', 'script.rpy', 'chapter1.rpy', 'screens.rpy'];

async function fixtureIndex(): Promise<ProjectSymbolIndex> {
  const contributions = new Map<string, BlockContribution>();
  for (const file of FILES) {
    const content = readFileSync(join(FIXTURE_DIR, file), 'utf8');
    contributions.set(file, await buildBlockContribution({ id: file, filePath: `game/${file}`, content }));
  }
  return resolveProjectIndex(contributions);
}

const where = (items: { range: { filePath: string; start: { line: number } } }[]) =>
  items.map((i) => `${i.range.filePath}:${i.range.start.line}`);
const refSummary = (index: ProjectSymbolIndex, id: string) =>
  index.symbols.get(id)!.references.map((r) => `${r.refKind}@${r.range.filePath}:${r.range.start.line}`);

describe('resolveProjectIndex (fixture project)', () => {
  it('resolves a cross-file jump to its label', async () => {
    const index = await fixtureIndex();
    expect(where(index.symbols.get('label:chapter1')!.definitions)).toEqual(['game/chapter1.rpy:1']);
    expect(refSummary(index, 'label:chapter1')).toEqual(['jump@game/script.rpy:8']);
  });

  it('resolves a local label from its own file and via its dotted name from another file', async () => {
    const index = await fixtureIndex();
    expect(where(index.symbols.get('label:start.sub')!.definitions)).toEqual(['game/script.rpy:7']);
    expect(refSummary(index, 'label:start.sub')).toEqual(['call@game/chapter1.rpy:6', 'jump@game/script.rpy:6']);
  });

  it('resolves screens across files via call screen and use', async () => {
    const index = await fixtureIndex();
    expect(refSummary(index, 'screen:inventory')).toEqual(['call-screen@game/chapter1.rpy:7']);
    expect(refSummary(index, 'screen:item_list')).toEqual(['use@game/screens.rpy:2']);
  });

  it('tracks a variable defaulted in one file, written in another and interpolated in a third', async () => {
    const index = await fixtureIndex();
    const points = index.symbols.get('variable:points')!;
    expect(points.definitions.map((d) => [d.defKind, `${d.range.filePath}:${d.range.start.line}`])).toEqual([
      ['default', 'game/init.rpy:3'],
    ]);
    expect(refSummary(index, 'variable:points')).toEqual([
      'write@game/chapter1.rpy:2',
      'write@game/init.rpy:12',
      'read@game/init.rpy:13',
      'read@game/script.rpy:4',
    ]);
  });

  it('promotes the first write of an undeclared variable to an implicit definition', async () => {
    const index = await fixtureIndex();
    const flag = index.symbols.get('variable:flag_seen')!;
    expect(flag.definitions.map((d) => [d.defKind, `${d.range.filePath}:${d.range.start.line}`])).toEqual([
      ['implicit', 'game/script.rpy:5'],
    ]);
    expect(refSummary(index, 'variable:flag_seen')).toEqual(['read@game/chapter1.rpy:5', 'write@game/script.rpy:5']);
  });

  it('resolves calls of a Python function and speakers of a character', async () => {
    const index = await fixtureIndex();
    expect(refSummary(index, 'python-function:award')).toEqual(['read@game/chapter1.rpy:3']);
    expect(index.symbols.get('python-function:award')!.references[0].kind).toBe('python-function');
    expect(refSummary(index, 'character:e')).toEqual(['speaker@game/script.rpy:4']);
  });

  it('resolves image references exactly or by tag', async () => {
    const index = await fixtureIndex();
    expect(refSummary(index, 'image:bg room')).toEqual(['scene@game/script.rpy:2']);
    expect(refSummary(index, 'image:eileen happy')).toEqual(['show@game/chapter1.rpy:4', 'show@game/script.rpy:3']);
    const bySad = index.symbols.get('image:eileen happy')!.references.find((r) => r.range.filePath === 'game/chapter1.rpy')!;
    expect(bySad.name).toBe('eileen sad');
  });

  it('defines the label created by call ... from and dotted defaults', async () => {
    const index = await fixtureIndex();
    expect(index.symbols.has('label:_call_part')).toBe(true);
    expect(index.symbols.get('variable:persistent.seen_intro')!.definitions[0].defKind).toBe('default');
  });

  it('lists unresolved references and duplicate labels', async () => {
    const index = await fixtureIndex();
    expect(index.unresolved.map((r) => r.symbolId)).toEqual(['label:missing_label']);
    expect(index.duplicates).toEqual(['label:intro']);
    expect(where(index.symbols.get('label:intro')!.definitions)).toEqual(['game/chapter1.rpy:11', 'game/script.rpy:9']);
  });

  it('is deterministic regardless of contribution insertion order', async () => {
    const forward = await fixtureIndex();
    const reversed = resolveProjectIndex(new Map([...forward.contributions.entries()].reverse()));
    expect([...reversed.symbols.keys()]).toEqual([...forward.symbols.keys()]);
    expect(reversed.unresolved).toEqual(forward.unresolved);
    expect([...forward.symbols.keys()]).toEqual([...forward.symbols.keys()].sort());
  });

  it('keeps the contributions it was built from', async () => {
    const index = await fixtureIndex();
    expect([...index.contributions.keys()].sort()).toEqual([...FILES].sort());
  });
});

async function inlineIndex(files: Record<string, string>): Promise<ProjectSymbolIndex> {
  const contributions = new Map<string, BlockContribution>();
  for (const [file, content] of Object.entries(files)) {
    contributions.set(file, await buildBlockContribution({ id: file, filePath: `game/${file}`, content }));
  }
  return resolveProjectIndex(contributions);
}

// nms4.13: names on PYTHON_IGNORED_NAMES (time, random, id, ...) are often user
// variables. They are dropped only when nothing in the project defines them.
describe('resolveProjectIndex (user variables named like builtins)', () => {
  it('records reads and writes of a defaulted variable whose name is on the ignored list', async () => {
    const index = await inlineIndex({
      'init.rpy': 'default time = "morning"\n',
      'script.rpy': [
        'label start:',
        '    "It is [time]."',
        '    $ time = "night"',
        '    if time == "night":',
        '        "Late."',
        '    return',
        '',
      ].join('\n'),
    });
    const time = index.symbols.get('variable:time')!;
    expect(time.definitions.map((d) => d.defKind)).toEqual(['default']);
    expect(time.references.map((r) => `${r.refKind}:${r.context}@${r.range.start.line}`)).toEqual([
      'read:interpolation@2', 'write:dollar@3', 'read:condition@4',
    ]);
    expect(index.unresolved).toEqual([]);
  });

  it('promotes the first write of an ignored-list name to an implicit definition', async () => {
    const index = await inlineIndex({
      'script.rpy': 'label start:\n    $ random = 3\n    "Rolled [random]."\n    return\n',
    });
    const random = index.symbols.get('variable:random')!;
    expect(random.definitions.map((d) => d.defKind)).toEqual(['implicit']);
    expect(random.references.map((r) => r.refKind)).toEqual(['write', 'read']);
  });

  it('drops builtin and Ren\'Py API reads nothing defines instead of reporting them unresolved', async () => {
    const index = await inlineIndex({
      'script.rpy': 'default items = []\nlabel start:\n    $ n = len(items) + renpy.random.randint(1, 2)\n    return\n',
    });
    expect(index.unresolved).toEqual([]);
    expect(index.symbols.has('variable:len')).toBe(false);
    expect(index.symbols.has('variable:renpy')).toBe(false);
    expect(refSummary(index, 'variable:items')).toEqual(['read@game/script.rpy:3']);
  });

  it('still never records underscore-prefixed names', async () => {
    const index = await inlineIndex({
      'script.rpy': 'default _hidden = 1\nlabel start:\n    $ x = _last_say_who\n    "[_hidden]"\n    return\n',
    });
    const names = [...index.symbols.values()].flatMap((s) => s.references.map((r) => r.name));
    expect(names.filter((n) => n.startsWith('_'))).toEqual([]);
    expect(index.unresolved.filter((r) => r.name.startsWith('_'))).toEqual([]);
  });
});
