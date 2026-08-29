import { findClosestMatch } from './didYouMean';

describe('findClosestMatch', () => {
  it('finds a single-character-missing typo', () => {
    expect(findClosestMatch('afection', ['affection', 'action', 'attraction'])).toBe('affection');
  });

  it('finds a transposed-letters typo', () => {
    expect(findClosestMatch('recieve', ['receive', 'trust', 'hub'])).toBe('receive');
  });

  it('returns undefined when nothing is close enough', () => {
    expect(findClosestMatch('xyz_totally_unrelated', ['affection', 'trust', 'hub'])).toBeUndefined();
  });

  it('returns undefined for an empty candidate list', () => {
    expect(findClosestMatch('anything', [])).toBeUndefined();
  });

  it('never suggests the exact same name', () => {
    expect(findClosestMatch('hub', ['hub', 'hub2'])).not.toBe('hub');
  });

  it('picks the closest of multiple plausible candidates', () => {
    // "afection" is distance 1 from "affection", distance 3 from "attraction"
    expect(findClosestMatch('afection', ['attraction', 'affection'])).toBe('affection');
  });

  it('is case-insensitive but returns the candidate in its original casing', () => {
    expect(findClosestMatch('Affection', ['affection'])).toBe('affection');
  });

  it('does not suggest very short candidates unless case-insensitively identical', () => {
    expect(findClosestMatch('ix', ['if', 'id'])).toBeUndefined();
  });

  it('does not match on single-character names', () => {
    expect(findClosestMatch('a', ['b', 'c'])).toBeUndefined();
  });

  it('accepts an arbitrary iterable, not just arrays', () => {
    const set = new Set(['affection', 'trust']);
    expect(findClosestMatch('afection', set)).toBe('affection');
  });
});
