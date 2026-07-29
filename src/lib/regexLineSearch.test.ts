import { describe, it, expect } from 'vitest';
import { findRegexMatchesInLine } from './regexLineSearch';

describe('findRegexMatchesInLine', () => {
  it('finds all non-overlapping matches of a literal pattern', () => {
    const matches = findRegexMatchesInLine('foo bar foo', /foo/g);
    expect(matches).toEqual([
      { startColumn: 1, endColumn: 4 },
      { startColumn: 9, endColumn: 12 },
    ]);
  });

  it('returns an empty array when there is no match', () => {
    expect(findRegexMatchesInLine('hello world', /xyz/g)).toEqual([]);
  });

  it('terminates immediately for a zero-width pattern like a bare "$" instead of looping forever', () => {
    const start = Date.now();
    const matches = findRegexMatchesInLine('$ variable = 1', /$/g);
    expect(Date.now() - start).toBeLessThan(100);
    expect(matches).toEqual([{ startColumn: 15, endColumn: 15 }]);
  });

  it('terminates for a zero-width pattern anchored at the start of the line', () => {
    const start = Date.now();
    const matches = findRegexMatchesInLine('label start:', /^/g);
    expect(Date.now() - start).toBeLessThan(100);
    expect(matches).toEqual([{ startColumn: 1, endColumn: 1 }]);
  });
});
