import { describe, it, expect } from 'vitest';
import {
  symbolId, qualifyLabel, normalizeVariableName, normalizeDefinitionName, isIgnoredName, PYTHON_IGNORED_NAMES,
} from '@/lib/tree-sitter/symbolNames';

describe('symbolNames', () => {
  it('builds kind-prefixed ids', () => {
    expect(symbolId('label', 'start.sub')).toBe('label:start.sub');
    expect(symbolId('image', 'eileen happy')).toBe('image:eileen happy');
  });

  it('qualifies local labels against the current global label', () => {
    expect(qualifyLabel('.sub', 'start')).toBe('start.sub');
    expect(qualifyLabel('start.sub', 'other')).toBe('start.sub');
    expect(qualifyLabel('plain', 'start')).toBe('plain');
    expect(qualifyLabel('.orphan', null)).toBe('.orphan');
  });

  it('normalizes store and persistent attribute chains', () => {
    expect(normalizeVariableName(['points'])).toEqual({ name: 'points', consumed: 1 });
    expect(normalizeVariableName(['store', 'points'])).toEqual({ name: 'points', consumed: 2 });
    expect(normalizeVariableName(['persistent', 'seen', 'x'])).toEqual({ name: 'persistent.seen', consumed: 2 });
    expect(normalizeVariableName(['store', 'persistent', 'seen'])).toEqual({ name: 'persistent.seen', consumed: 3 });
    expect(normalizeVariableName(['player', 'hp'])).toEqual({ name: 'player', consumed: 1 });
    expect(normalizeVariableName(['persistent'])).toEqual({ name: 'persistent', consumed: 1 });
  });

  it('strips only a leading store. from definition names', () => {
    expect(normalizeDefinitionName('store.points')).toBe('points');
    expect(normalizeDefinitionName('persistent.seen')).toBe('persistent.seen');
    expect(normalizeDefinitionName('config.name')).toBe('config.name');
  });

  it('ignores builtins, Ren\'Py namespaces and underscore names', () => {
    for (const name of ['len', 'True', 'None', 'renpy', 'config', 'store', 'persistent', 'Character', 'SetVariable', 'self']) {
      expect(isIgnoredName(name)).toBe(true);
    }
    expect(isIgnoredName('_last_say_who')).toBe(true);
    expect(isIgnoredName('points')).toBe(false);
    expect(isIgnoredName('persistent.seen')).toBe(false);
    expect(PYTHON_IGNORED_NAMES.has('range')).toBe(true);
  });
});
