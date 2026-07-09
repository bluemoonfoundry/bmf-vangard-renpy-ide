/**
 * @file snippetPackMerge.ts
 * @description Merges an imported snippet pack's categories into an existing
 * category list (the user's global custom.json), used by the snippet pack
 * import flow in SnippetManager. Matching categories have their snippets
 * appended (skipping exact title+code duplicates); new categories are added.
 */
import type { SnippetCategory } from '@/types';

export function mergeImportedCategories(existing: SnippetCategory[], imported: SnippetCategory[]): SnippetCategory[] {
  const result = existing.map((category) => ({ ...category, snippets: [...category.snippets] }));

  for (const importedCategory of imported) {
    const target = result.find((category) => category.name === importedCategory.name);
    if (target) {
      for (const snippet of importedCategory.snippets) {
        const isDuplicate = target.snippets.some((s) => s.title === snippet.title && s.code === snippet.code);
        if (!isDuplicate) target.snippets.push(snippet);
      }
    } else {
      result.push({ name: importedCategory.name, snippets: [...importedCategory.snippets] });
    }
  }

  return result;
}
