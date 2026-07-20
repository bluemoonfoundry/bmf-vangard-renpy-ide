/**
 * @file useSnippetLoader.ts
 * @description Hook for loading code snippets from multiple sources with priority-based merging.
 *
 * Load order (higher priority overrides lower):
 * 1. Built-in snippets: snippets/default-snippets.json (bundled)
 * 2. User global snippets: Electron userData/snippets/custom.json (e.g.
 *    %APPDATA%\vangard-studio\snippets\custom.json on Windows)
 * 3. Project-specific snippets: <project>/.vangard/snippets.json
 *
 * Categories with the same name are merged, with higher priority snippets appearing first.
 */

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { validateSnippetPack } from '@/lib/snippetSchema';
import type { Snippet, SnippetCategory, SnippetPackFile } from '@/types';
import defaultSnippetsData from '../../snippets/default-snippets.json';

interface UseSnippetLoaderOptions {
  projectRootPath?: string | null;
}

interface UseSnippetLoaderResult {
  categories: SnippetCategory[];
  isLoading: boolean;
  error: string | null;
  /** Per-file schema validation problems, e.g. a malformed custom.json. Non-fatal — the offending file is skipped. */
  warnings: string[];
  reload: () => Promise<void>;
}

/**
 * Merges snippet categories from multiple sources.
 * Categories with the same name have their snippets combined.
 * Higher priority sources appear first in the merged list.
 */
function mergeSnippetCategories(...sources: SnippetCategory[][]): SnippetCategory[] {
  const categoryMap = new Map<string, Snippet[]>();

  // Process sources in reverse order (lowest to highest priority)
  for (const categories of sources.reverse()) {
    for (const category of categories) {
      const existing = categoryMap.get(category.name) || [];
      // Prepend new snippets (so higher priority appears first)
      categoryMap.set(category.name, [...category.snippets, ...existing]);
    }
  }

  // Convert map back to array
  return Array.from(categoryMap.entries()).map(([name, snippets]) => ({
    name,
    snippets,
  }));
}

/**
 * Parses and schema-validates raw snippet pack JSON content. Returns null
 * (plus a pushed warning) if the content isn't valid JSON or fails schema
 * validation -- callers fall back to the other snippet sources rather than
 * silently losing all snippets.
 */
function parseAndValidatePack(content: string, sourceLabel: string, warnings: string[]): SnippetCategory[] | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (parseError) {
    const message = parseError instanceof Error ? parseError.message : String(parseError);
    const warning = `${sourceLabel}: invalid JSON (${message})`;
    logger.warn(warning);
    warnings.push(warning);
    return null;
  }

  const result = validateSnippetPack(parsed, sourceLabel);
  if (!result.valid) {
    logger.warn(`Invalid snippet file format: ${sourceLabel}`, result.errors);
    warnings.push(...result.errors);
    return null;
  }

  return (result.data as SnippetPackFile).categories;
}

/**
 * Loads snippet data from a JSON file path. Returns null if the file doesn't exist.
 */
async function loadSnippetsFromFile(filePath: string, warnings: string[]): Promise<SnippetCategory[] | null> {
  try {
    const exists = await window.electronAPI.fileExists(filePath);
    if (!exists) {
      return null;
    }

    const content = await window.electronAPI.readFile(filePath);
    return parseAndValidatePack(content, filePath, warnings);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const warning = `Failed to load snippets from ${filePath}: ${message}`;
    logger.error(warning);
    warnings.push(warning);
    return null;
  }
}

/**
 * Hook to load and merge code snippets from multiple sources.
 *
 * @param options - Configuration options
 * @param options.projectRootPath - Path to the current project root (for project-specific snippets)
 * @returns Merged categories, loading state, error state, and reload function
 */
export function useSnippetLoader(options: UseSnippetLoaderOptions = {}): UseSnippetLoaderResult {
  const { projectRootPath } = options;

  const [categories, setCategories] = useState<SnippetCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const loadSnippets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const collectedWarnings: string[] = [];

    try {
      // 1. Built-in snippets (always available)
      const builtInCategories = (defaultSnippetsData as SnippetPackFile).categories;

      // 2. User global snippets (Electron userData/snippets/custom.json). Read via
      // the dedicated snippets:readUserGlobal IPC (fixed path computed in the main
      // process) rather than the generic project-guarded fs:readFile, since this
      // path is always outside any project root.
      let userGlobalCategories: SnippetCategory[] | null = null;
      try {
        const content = await window.electronAPI.readUserGlobalSnippets?.();
        if (content) {
          userGlobalCategories = parseAndValidatePack(content, 'user global snippets (custom.json)', collectedWarnings);
        }
      } catch (err) {
        logger.warn('Could not load user global snippets:', err);
      }

      // 3. Project-specific snippets (<project>/.vangard/snippets.json)
      let projectCategories: SnippetCategory[] | null = null;
      if (projectRootPath) {
        try {
          const projectSnippetsPath = await window.electronAPI.path.join(
            projectRootPath,
            '.vangard',
            'snippets.json'
          );
          projectCategories = await loadSnippetsFromFile(projectSnippetsPath, collectedWarnings);
        } catch (err) {
          logger.warn('Could not load project snippets:', err);
        }
      }

      // Merge all categories (priority: built-in < user global < project)
      const sources = [
        builtInCategories,
        ...(userGlobalCategories ? [userGlobalCategories] : []),
        ...(projectCategories ? [projectCategories] : []),
      ];

      const merged = mergeSnippetCategories(...sources);
      setCategories(merged);
      setWarnings(collectedWarnings);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load snippets';
      setError(errorMessage);
      logger.error('Snippet loading error:', err);

      // Fallback to built-in snippets on error
      setCategories((defaultSnippetsData as SnippetPackFile).categories);
      setWarnings(collectedWarnings);
    } finally {
      setIsLoading(false);
    }
  }, [projectRootPath]);

  // Load snippets on mount and when project changes
  useEffect(() => {
    loadSnippets();
  }, [loadSnippets]);

  return {
    categories,
    isLoading,
    error,
    warnings,
    reload: loadSnippets,
  };
}
