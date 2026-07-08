import { describe, it, expect } from 'vitest';
import { isReservedRenpyName } from '@/lib/renpyNames';

describe('isReservedRenpyName', () => {
  // Names that ARE reserved (single-underscore prefix pattern)
  it('returns true for _init', () => {
    expect(isReservedRenpyName('_init')).toBe(true);
  });

  it('returns true for _default', () => {
    expect(isReservedRenpyName('_default')).toBe(true);
  });

  it('returns true for _abc123 (underscore + alphanumeric)', () => {
    expect(isReservedRenpyName('_abc123')).toBe(true);
  });

  it('returns true for __name (double underscore counts as underscore + underscore + chars)', () => {
    // regex: ^_[A-Za-z0-9_]+ — the second _ is within [A-Za-z0-9_]
    expect(isReservedRenpyName('__name')).toBe(true);
  });

  it('returns true for _A (single letter after underscore)', () => {
    expect(isReservedRenpyName('_A')).toBe(true);
  });

  it('returns true for _123 (digits after underscore)', () => {
    expect(isReservedRenpyName('_123')).toBe(true);
  });

  // Names that are NOT reserved
  it('returns false for plain names without underscore prefix', () => {
    expect(isReservedRenpyName('start')).toBe(false);
    expect(isReservedRenpyName('chapter1')).toBe(false);
    expect(isReservedRenpyName('intro_scene')).toBe(false);
  });

  it('returns false for a bare underscore (no chars after it)', () => {
    expect(isReservedRenpyName('_')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isReservedRenpyName('')).toBe(false);
  });

  it('returns false for names starting with a digit', () => {
    expect(isReservedRenpyName('1label')).toBe(false);
  });

  it('returns false for names starting with an uppercase letter', () => {
    expect(isReservedRenpyName('MyLabel')).toBe(false);
  });
});
