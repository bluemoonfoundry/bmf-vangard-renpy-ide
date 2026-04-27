/**
 * @file useSnippetLoader.ts
 * @description Hook for loading code snippets from multiple sources with priority-based merging.
 *
 * Load order (higher priority overrides lower):
 * 1. Built-in snippets: snippets/default-snippets.json (bundled)
 * 2. User global snippets: ~/.vangard-ide/snippets/custom.json
 * 3. Project-specific snippets: <project>/.vangard/snippets.json
 *
 * Categories with the same name are merged, with higher priority snippets appearing first.
 */

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import defaultSnippetsData from '../../snippets/default-snippets.json';

interface Snippet {
  title: string;
  description: string;
  code: string;
}

interface SnippetCategory {
  name: string;
  snippets: Snippet[];
}

interface SnippetData {
  version: string;
  categories: SnippetCategory[];
}

interface UseSnippetLoaderOptions {
  projectRootPath?: string | null;
}

interface UseSnippetLoaderResult {
  categories: SnippetCategory[];
  isLoading: boolean;
  error: string | null;
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
 * Loads snippet data from a JSON file path.
 * Returns null if file doesn't exist or is invalid.
 */
async function loadSnippetsFromFile(filePath: string): Promise<SnippetCategory[] | null> {
  try {
    const exists = await window.electronAPI.fileExists(filePath);
    if (!exists) {
      return null;
    }

    const content = await window.electronAPI.readFile(filePath);
    const data = JSON.parse(content) as SnippetData;

    if (!data.categories || !Array.isArray(data.categories)) {
      logger.warn(`Invalid snippet file format: ${filePath}`);
      return null;
    }

    return data.categories;
  } catch (error) {
    logger.error(`Failed to load snippets from ${filePath}:`, error);
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

  const loadSnippets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Built-in snippets (always available)
      const builtInCategories = (defaultSnippetsData as SnippetData).categories;

      // 2. User global snippets (~/.vangard-ide/snippets/custom.json)
      let userGlobalCategories: SnippetCategory[] | null = null;
      try {
        const userDataPath = await window.electronAPI.getUserDataPath();
        const userGlobalPath = await window.electronAPI.path.join(userDataPath, 'snippets', 'custom.json');
        userGlobalCategories = await loadSnippetsFromFile(userGlobalPath);
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
          projectCategories = await loadSnippetsFromFile(projectSnippetsPath);
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load snippets';
      setError(errorMessage);
      logger.error('Snippet loading error:', err);

      // Fallback to built-in snippets on error
      setCategories((defaultSnippetsData as SnippetData).categories);
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
    reload: loadSnippets,
  };
}
