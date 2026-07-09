import { describe, it, expect } from 'vitest';
import { mergeImportedCategories } from './snippetPackMerge';

describe('mergeImportedCategories', () => {
  it('adds a new category that does not exist yet', () => {
    const result = mergeImportedCategories(
      [{ name: 'Existing', snippets: [{ title: 'A', description: '', code: 'a' }] }],
      [{ name: 'New', snippets: [{ title: 'B', description: '', code: 'b' }] }]
    );
    expect(result.map((c) => c.name)).toEqual(['Existing', 'New']);
  });

  it('appends snippets into a matching existing category', () => {
    const result = mergeImportedCategories(
      [{ name: 'Dialogue', snippets: [{ title: 'A', description: '', code: 'a' }] }],
      [{ name: 'Dialogue', snippets: [{ title: 'B', description: '', code: 'b' }] }]
    );
    expect(result).toHaveLength(1);
    expect(result[0].snippets.map((s) => s.title)).toEqual(['A', 'B']);
  });

  it('skips an exact title+code duplicate', () => {
    const result = mergeImportedCategories(
      [{ name: 'Dialogue', snippets: [{ title: 'A', description: 'old', code: 'a' }] }],
      [{ name: 'Dialogue', snippets: [{ title: 'A', description: 'new', code: 'a' }] }]
    );
    expect(result[0].snippets).toHaveLength(1);
    expect(result[0].snippets[0].description).toBe('old');
  });

  it('keeps both snippets when title matches but code differs', () => {
    const result = mergeImportedCategories(
      [{ name: 'Dialogue', snippets: [{ title: 'A', description: '', code: 'a' }] }],
      [{ name: 'Dialogue', snippets: [{ title: 'A', description: '', code: 'a-variant' }] }]
    );
    expect(result[0].snippets).toHaveLength(2);
  });

  it('does not mutate the existing input array', () => {
    const existing = [{ name: 'Dialogue', snippets: [{ title: 'A', description: '', code: 'a' }] }];
    mergeImportedCategories(existing, [{ name: 'Dialogue', snippets: [{ title: 'B', description: '', code: 'b' }] }]);
    expect(existing[0].snippets).toHaveLength(1);
  });

  it('handles an empty existing list', () => {
    const result = mergeImportedCategories([], [{ name: 'New', snippets: [{ title: 'A', description: '', code: 'a' }] }]);
    expect(result).toHaveLength(1);
  });
});
