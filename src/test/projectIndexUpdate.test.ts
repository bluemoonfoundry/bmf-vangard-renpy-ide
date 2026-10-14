import { describe, it, expect, vi } from 'vitest';
import { buildBlockContribution, type IndexBlock } from '@/lib/tree-sitter/blockContribution';
import { createContributionCache, updateProjectIndex } from '@/lib/tree-sitter/projectIndex';

const a: IndexBlock = { id: 'a', filePath: 'game/a.rpy', content: 'label a:\n    jump b\n' };
const b: IndexBlock = { id: 'b', filePath: 'game/b.rpy', content: 'label b:\n    return\n' };

describe('updateProjectIndex', () => {
  it('builds every block on the first run and none on an unchanged run', async () => {
    const build = vi.fn(buildBlockContribution);
    const cache = createContributionCache();
    await updateProjectIndex(cache, [a, b], { build });
    expect(build).toHaveBeenCalledTimes(2);
    build.mockClear();
    const index = await updateProjectIndex(cache, [a, b], { build });
    expect(build).not.toHaveBeenCalled();
    expect(index.symbols.get('label:b')!.references).toHaveLength(1);
  });

  it('rebuilds only the block whose content changed', async () => {
    const build = vi.fn(buildBlockContribution);
    const cache = createContributionCache();
    await updateProjectIndex(cache, [a, b], { build });
    build.mockClear();
    const changedB = { ...b, content: 'label b:\n    jump a\n' };
    const index = await updateProjectIndex(cache, [a, changedB], { build });
    expect(build.mock.calls.map(([block]) => block.id)).toEqual(['b']);
    expect(index.symbols.get('label:a')!.references).toHaveLength(1);
  });

  it('rebuilds a block whose file path changed', async () => {
    const build = vi.fn(buildBlockContribution);
    const cache = createContributionCache();
    await updateProjectIndex(cache, [a], { build });
    build.mockClear();
    const index = await updateProjectIndex(cache, [{ ...a, filePath: 'game/renamed.rpy' }], { build });
    expect(build).toHaveBeenCalledTimes(1);
    expect(index.symbols.get('label:a')!.definitions[0].range.filePath).toBe('game/renamed.rpy');
  });

  it('drops the symbols and references of a removed block', async () => {
    const cache = createContributionCache();
    await updateProjectIndex(cache, [a, b]);
    const index = await updateProjectIndex(cache, [a]);
    expect(index.symbols.has('label:b')).toBe(false);
    expect(index.unresolved.map((r) => r.symbolId)).toEqual(['label:b']);
    expect([...cache.byBlockId.keys()]).toEqual(['a']);
  });

  it('gives each overlapping update a result for its own block list', async () => {
    const cache = createContributionCache();
    const [withBoth, withA] = await Promise.all([
      updateProjectIndex(cache, [a, b]),
      updateProjectIndex(cache, [a]),
    ]);
    expect(withBoth.symbols.has('label:b')).toBe(true);
    expect(withA.symbols.has('label:b')).toBe(false);
  });

  it('rejects when the parser cannot initialize, without building or touching the cache', async () => {
    const build = vi.fn(buildBlockContribution);
    const cache = createContributionCache();
    await expect(
      updateProjectIndex(cache, [a], { build, init: () => Promise.reject(new Error('wasm init failed')) }),
    ).rejects.toThrow('wasm init failed');
    expect(build).not.toHaveBeenCalled();
    expect(cache.byBlockId.size).toBe(0);
  });
});
