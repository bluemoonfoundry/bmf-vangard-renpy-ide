/**
 * @file snippetSchema.ts
 * @description Hand-rolled structural validation for snippet pack JSON files
 * (default-snippets.json, ~/.vangard-ide/snippets/custom.json,
 * <project>/.vangard/snippets.json, and imported/exported community packs).
 * Produces a specific, actionable error message instead of silently treating
 * a malformed file as empty.
 */
import type { Snippet, SnippetCategory, SnippetPackFile } from '@/types';

export interface SnippetValidationResult {
  valid: boolean;
  errors: string[];
  data?: SnippetPackFile;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateSnippet(value: unknown, path: string, errors: string[]): value is Snippet {
  if (!isPlainObject(value)) {
    errors.push(`${path}: expected an object`);
    return false;
  }
  let ok = true;
  if (typeof value.title !== 'string' || value.title.trim() === '') {
    errors.push(`${path}.title: expected a non-empty string`);
    ok = false;
  }
  if (typeof value.description !== 'string') {
    errors.push(`${path}.description: expected a string`);
    ok = false;
  }
  if (typeof value.code !== 'string' || value.code === '') {
    errors.push(`${path}.code: expected a non-empty string`);
    ok = false;
  }
  if (value.tags !== undefined) {
    if (!Array.isArray(value.tags) || !value.tags.every((t) => typeof t === 'string')) {
      errors.push(`${path}.tags: expected an array of strings`);
      ok = false;
    }
  }
  return ok;
}

function validateCategory(value: unknown, path: string, errors: string[]): value is SnippetCategory {
  if (!isPlainObject(value)) {
    errors.push(`${path}: expected an object`);
    return false;
  }
  let ok = true;
  if (typeof value.name !== 'string' || value.name.trim() === '') {
    errors.push(`${path}.name: expected a non-empty string`);
    ok = false;
  }
  if (!Array.isArray(value.snippets)) {
    errors.push(`${path}.snippets: expected an array`);
    ok = false;
  } else {
    value.snippets.forEach((snippet, i) => {
      if (!validateSnippet(snippet, `${path}.snippets[${i}]`, errors)) ok = false;
    });
  }
  return ok;
}

/**
 * Validates the parsed JSON of a snippet pack file.
 * `sourceLabel` (e.g. a file path) is included in error messages for context.
 */
export function validateSnippetPack(data: unknown, sourceLabel: string): SnippetValidationResult {
  const errors: string[] = [];

  if (!isPlainObject(data)) {
    return { valid: false, errors: [`${sourceLabel}: expected a JSON object at the top level`] };
  }
  if (!Array.isArray(data.categories)) {
    return { valid: false, errors: [`${sourceLabel}: "categories" must be an array`] };
  }

  let ok = true;
  data.categories.forEach((category, i) => {
    if (!validateCategory(category, `${sourceLabel}: categories[${i}]`, errors)) ok = false;
  });

  if (!ok) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: {
      version: typeof data.version === 'string' ? data.version : '1.0',
      categories: data.categories as SnippetCategory[],
    },
  };
}
