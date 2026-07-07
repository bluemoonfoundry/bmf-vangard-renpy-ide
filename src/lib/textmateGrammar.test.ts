import { describe, it, expect } from 'vitest';

// textmateGrammar.ts dynamically imports vscode-oniguruma and vscode-textmate
// and fetches a WASM binary, which are unavailable in jsdom. We verify the
// module's contract without actually initialising the TextMate engine.

describe('createTextMateTokensProvider', () => {
  it('throws with a clear message when called before initTextMate()', async () => {
    // Import lazily so the module-level state is fresh in this describe block.
    const { createTextMateTokensProvider } = await import('@/lib/textmateGrammar');
    expect(() => createTextMateTokensProvider()).toThrow(
      'TextMate not initialised — call initTextMate() first',
    );
  });
});

describe('initTextMate', () => {
  it('returns a Promise when called', async () => {
    // We can't await this (requires WASM + grammar files), but we can verify
    // the return type and that it does not throw synchronously.
    const { initTextMate } = await import('@/lib/textmateGrammar');
    const p = initTextMate();
    expect(p).toBeInstanceOf(Promise);
    // Prevent unhandled-rejection noise.
    p.catch(() => {});
  });
});

// ── renpy.tmLanguage.json structure ──────────────────────────────────────────
// Import the grammar JSON directly to validate its structure without needing
// the TextMate/WASM runtime.

import grammarJson from './renpy.tmLanguage.json';

describe('renpy.tmLanguage.json', () => {
  it('has the Ren\'Py scope name', () => {
    expect((grammarJson as { scopeName: string }).scopeName).toBe('source.renpy');
  });

  it('has a non-empty "name" field', () => {
    const name = (grammarJson as { name: string }).name;
    expect(typeof name).toBe('string');
    expect(name.length).toBeGreaterThan(0);
  });

  it('has a "patterns" array with entries', () => {
    const patterns = (grammarJson as { patterns: unknown[] }).patterns;
    expect(Array.isArray(patterns)).toBe(true);
    expect(patterns.length).toBeGreaterThan(0);
  });

  it('has a "repository" object with rule definitions', () => {
    const repo = (grammarJson as { repository: Record<string, unknown> }).repository;
    expect(typeof repo).toBe('object');
    expect(repo).not.toBeNull();
    expect(Object.keys(repo).length).toBeGreaterThan(0);
  });

  it('repository contains a "label-definition" rule', () => {
    const repo = (grammarJson as { repository: Record<string, unknown> }).repository;
    expect(repo['label-definition']).toBeDefined();
  });

  it('repository contains a "comment" rule', () => {
    const repo = (grammarJson as { repository: Record<string, unknown> }).repository;
    expect(repo['comment']).toBeDefined();
  });

  it('declares ".rpy" as a file type', () => {
    const fileTypes = (grammarJson as { fileTypes: string[] }).fileTypes;
    expect(fileTypes).toContain('.rpy');
  });
});
