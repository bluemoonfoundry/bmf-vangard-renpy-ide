import { describe, it, expect } from 'vitest';
import { djb2 } from '@/lib/contentHash';

describe('djb2', () => {
  it('is deterministic and 32-bit', () => {
    expect(djb2('label start:\n')).toBe(djb2('label start:\n'));
    expect(Number.isInteger(djb2('x'.repeat(10000)))).toBe(true);
    expect(Math.abs(djb2('x'.repeat(10000)))).toBeLessThan(2 ** 31 + 1);
  });

  it('differs for different content', () => {
    expect(djb2('label a:\n')).not.toBe(djb2('label b:\n'));
  });

  it('hashes the empty string to the djb2 seed', () => {
    expect(djb2('')).toBe(5381);
  });
});
