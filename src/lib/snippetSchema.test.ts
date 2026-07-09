import { describe, it, expect } from 'vitest';
import { validateSnippetPack } from './snippetSchema';

describe('validateSnippetPack', () => {
  it('accepts a well-formed pack', () => {
    const result = validateSnippetPack(
      {
        version: '1.0',
        categories: [
          { name: 'Dialogue', snippets: [{ title: 'Say', description: 'desc', code: 'x "hi"' }] },
        ],
      },
      'test.json'
    );
    expect(result.valid).toBe(true);
    expect(result.data?.categories).toHaveLength(1);
  });

  it('defaults a missing version to 1.0', () => {
    const result = validateSnippetPack(
      { categories: [{ name: 'A', snippets: [] }] },
      'test.json'
    );
    expect(result.valid).toBe(true);
    expect(result.data?.version).toBe('1.0');
  });

  it('accepts optional tags on a snippet', () => {
    const result = validateSnippetPack(
      { categories: [{ name: 'A', snippets: [{ title: 'T', description: 'd', code: 'c', tags: ['ui', 'menu'] }] }] },
      'test.json'
    );
    expect(result.valid).toBe(true);
  });

  it('rejects a non-object top level', () => {
    const result = validateSnippetPack([1, 2, 3], 'test.json');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('expected a JSON object');
  });

  it('rejects a missing categories array', () => {
    const result = validateSnippetPack({ version: '1.0' }, 'test.json');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('"categories" must be an array');
  });

  it('rejects a category missing a name', () => {
    const result = validateSnippetPack(
      { categories: [{ snippets: [] }] },
      'test.json'
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('categories[0].name'))).toBe(true);
  });

  it('rejects a category with a non-array snippets field', () => {
    const result = validateSnippetPack(
      { categories: [{ name: 'A', snippets: 'nope' }] },
      'test.json'
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('categories[0].snippets'))).toBe(true);
  });

  it('rejects a snippet missing required fields', () => {
    const result = validateSnippetPack(
      { categories: [{ name: 'A', snippets: [{ title: '' }] }] },
      'test.json'
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('snippets[0].title'))).toBe(true);
    expect(result.errors.some((e) => e.includes('snippets[0].description'))).toBe(true);
    expect(result.errors.some((e) => e.includes('snippets[0].code'))).toBe(true);
  });

  it('rejects a snippet with a malformed tags field', () => {
    const result = validateSnippetPack(
      { categories: [{ name: 'A', snippets: [{ title: 'T', description: 'd', code: 'c', tags: 'not-an-array' }] }] },
      'test.json'
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('snippets[0].tags'))).toBe(true);
  });

  it('reports multiple errors across categories', () => {
    const result = validateSnippetPack(
      {
        categories: [
          { name: 'A', snippets: [{ title: '' }] },
          { snippets: [] },
        ],
      },
      'test.json'
    );
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});
