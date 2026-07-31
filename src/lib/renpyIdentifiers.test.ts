import { describe, it, expect } from 'vitest';
import {
  STATEMENT_KEYWORDS,
  buildKnownIdentifierSet,
  extractUndefinedVariableReferences,
} from './renpyIdentifiers';
import { createEmptyAnalysisResult, createVariable, createCharacter, createScreen } from '@/test/mocks/sampleData';

describe('buildKnownIdentifierSet', () => {
  it('includes variable names, character tags, screen names, and statement keywords', () => {
    const analysis = createEmptyAnalysisResult({
      variables: new Map([['player_name', createVariable({ name: 'player_name' })]]),
      characters: new Map([['e', createCharacter({ tag: 'e' })]]),
      screens: new Map([['main_menu', createScreen({ name: 'main_menu' })]]),
    });
    const known = buildKnownIdentifierSet(analysis);
    expect(known.has('player_name')).toBe(true);
    expect(known.has('e')).toBe(true);
    expect(known.has('main_menu')).toBe(true);
    expect(known.has('if')).toBe(true); // from STATEMENT_KEYWORDS
    expect(known.has('persistent')).toBe(true); // allowlisted root
  });
});

describe('extractUndefinedVariableReferences', () => {
  const known = new Set(['player_name', ...STATEMENT_KEYWORDS, 'renpy', 'persistent', 'True', 'False', 'None']);

  it('flags an undefined variable used in [interpolation]', () => {
    const refs = extractUndefinedVariableReferences('    "Hello [playre_name]!"\n', known);
    expect(refs).toHaveLength(1);
    expect(refs[0]).toMatchObject({ name: 'playre_name', line: 1 });
  });

  it('does not flag a known variable used in [interpolation]', () => {
    const refs = extractUndefinedVariableReferences('    "Hello [player_name]!"\n', known);
    expect(refs).toHaveLength(0);
  });

  it('flags an undefined variable in an if condition', () => {
    const refs = extractUndefinedVariableReferences('    if has_met_eileen:\n        pass\n', known);
    expect(refs).toHaveLength(1);
    expect(refs[0]).toMatchObject({ name: 'has_met_eileen', line: 1 });
  });

  it('does not flag identifiers inside string literals within a condition', () => {
    const refs = extractUndefinedVariableReferences('    if player_name == "mystery_guest":\n', known);
    expect(refs).toHaveLength(0);
  });

  it('does not flag a function call target', () => {
    const refs = extractUndefinedVariableReferences('    if renpy.seen_label("start"):\n', known);
    expect(refs).toHaveLength(0);
  });

  it('does not flag dotted access off a known root', () => {
    const refs = extractUndefinedVariableReferences('    if persistent.unlocked_gallery:\n', known);
    expect(refs).toHaveLength(0);
  });

  it('does not flag a bare function call target', () => {
    const refs = extractUndefinedVariableReferences('    if some_func():\n', known);
    expect(refs).toHaveLength(0);
  });

  it('reports 0-indexed column positions for interpolation matches', () => {
    const refs = extractUndefinedVariableReferences('"Hi [oops]"', known);
    expect(refs[0].columnStart).toBe(5);
    expect(refs[0].columnEnd).toBe(9);
  });

  it('flags multiple bare identifiers joined by and/or', () => {
    const refs = extractUndefinedVariableReferences('    if flag_one and flag_two:\n', known);
    const names = refs.map(r => r.name).sort();
    expect(names).toEqual(['flag_one', 'flag_two']);
  });

  describe('interpolation false positives (comments, [[ escapes, Python subscripts)', () => {
    it('does not flag a bracketed word inside a comment', () => {
      const refs = extractUndefinedVariableReferences('# [TODO] rework this scene\n', known);
      expect(refs).toHaveLength(0);
    });

    it('does not flag a bracketed word inside an indented comment', () => {
      const refs = extractUndefinedVariableReferences('    # see [WIP] note\n', known);
      expect(refs).toHaveLength(0);
    });

    it('does not flag a Python subscript outside of a string literal', () => {
      const refs = extractUndefinedVariableReferences('$ chosen = inventory[item_key]\n', known);
      expect(refs).toHaveLength(0);
    });

    it('does not flag a [[ escaped literal bracket inside a string', () => {
      const refs = extractUndefinedVariableReferences('    "escaped bracket [[literal]"\n', known);
      expect(refs).toHaveLength(0);
    });

    it('still flags a genuinely undefined variable inside a real string interpolation', () => {
      const refs = extractUndefinedVariableReferences('    "Hello [totally_undefined]!"\n', known);
      expect(refs).toHaveLength(1);
      expect(refs[0]).toMatchObject({ name: 'totally_undefined', line: 1 });
    });
  });
});

describe('allowlisted store globals and underscore-prefixed names', () => {
  const known = buildKnownIdentifierSet(createEmptyAnalysisResult());

  it('does not flag the preferences store global', () => {
    const refs = extractUndefinedVariableReferences('    if preferences.text_cps > 0:\n', known);
    expect(refs).toHaveLength(0);
  });

  it('does not flag the narrator global', () => {
    const refs = extractUndefinedVariableReferences('    if narrator:\n', known);
    expect(refs).toHaveLength(0);
  });

  it('does not flag underscore-prefixed identifiers', () => {
    const refs = extractUndefinedVariableReferences('    if _in_replay:\n', known);
    expect(refs).toHaveLength(0);
  });
});
