import { describe, it, expect } from 'vitest';
import { createId } from '@/lib/createId';

describe('createId', () => {
  it('returns a string that starts with the given prefix followed by a hyphen', () => {
    const id = createId('block');
    expect(id.startsWith('block-')).toBe(true);
  });

  it('returns a non-empty string after the prefix', () => {
    const id = createId('node');
    const suffix = id.slice('node-'.length);
    expect(suffix.length).toBeGreaterThan(0);
  });

  it('produces unique IDs on successive calls', () => {
    const ids = Array.from({ length: 20 }, () => createId('item'));
    const unique = new Set(ids);
    expect(unique.size).toBe(20);
  });

  it('uses the provided prefix verbatim', () => {
    expect(createId('label').startsWith('label-')).toBe(true);
    expect(createId('group').startsWith('group-')).toBe(true);
    expect(createId('sticky-note').startsWith('sticky-note-')).toBe(true);
  });

  it('returns a string of reasonable length (prefix + at least 7 extra chars)', () => {
    const prefix = 'x';
    const id = createId(prefix);
    // prefix + '-' + fallback suffix (at least 7 chars from Math.random)
    expect(id.length).toBeGreaterThanOrEqual(prefix.length + 1 + 7);
  });

  it('IDs with different prefixes do not collide', () => {
    const a = createId('alpha');
    const b = createId('beta');
    expect(a).not.toBe(b);
    expect(a.startsWith('alpha-')).toBe(true);
    expect(b.startsWith('beta-')).toBe(true);
  });
});
