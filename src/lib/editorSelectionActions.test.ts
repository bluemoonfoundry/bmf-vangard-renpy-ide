import { describe, it, expect } from 'vitest';
import { sanitizeIdentifier, sanitizeFileName } from '@/lib/editorSelectionActions';

describe('sanitizeIdentifier', () => {
  it('passes through an already-valid identifier unchanged', () => {
    expect(sanitizeIdentifier('valid_name')).toBe('valid_name');
  });

  it('preserves leading underscores in valid identifiers (private naming convention)', () => {
    expect(sanitizeIdentifier('_private_var')).toBe('_private_var');
  });

  it('preserves trailing underscores in valid identifiers', () => {
    expect(sanitizeIdentifier('trailing_')).toBe('trailing_');
  });

  it('replaces spaces with underscores', () => {
    expect(sanitizeIdentifier('the golden sword')).toBe('the_golden_sword');
  });

  it('collapses newlines and multiple spaces into single underscores', () => {
    expect(sanitizeIdentifier('line one\nline   two')).toBe('line_one_line_two');
  });

  it('prefixes a leading digit with an underscore', () => {
    expect(sanitizeIdentifier('123abc')).toBe('_123abc');
  });

  it('strips punctuation', () => {
    expect(sanitizeIdentifier('player: "hi"')).toBe('player_hi');
  });

  it('returns empty string for a fully symbolic selection', () => {
    expect(sanitizeIdentifier('!!!')).toBe('');
  });

  it('returns empty string for whitespace-only selection', () => {
    expect(sanitizeIdentifier('   ')).toBe('');
  });

  it('strips dots by default (allowDot=false)', () => {
    expect(sanitizeIdentifier('persistent.seen_ending')).toBe('persistent_seen_ending');
  });

  it('keeps dots when allowDot=true', () => {
    expect(sanitizeIdentifier('persistent.seen_ending', true)).toBe('persistent.seen_ending');
  });
});

describe('sanitizeFileName', () => {
  it('passes through an already-valid filename unchanged', () => {
    expect(sanitizeFileName('chapter_one')).toBe('chapter_one');
  });

  it('preserves internal spaces (filenames allow spaces)', () => {
    expect(sanitizeFileName('the golden sword')).toBe('the golden sword');
  });

  it('collapses multiple spaces and trims edges', () => {
    expect(sanitizeFileName('  spaced   out  ')).toBe('spaced out');
  });

  it('replaces filesystem-reserved characters with underscores', () => {
    expect(sanitizeFileName('a:b*c')).toBe('a_b_c');
  });

  it('returns empty string for a fully reserved-character selection', () => {
    expect(sanitizeFileName('???')).toBe('');
  });
});
