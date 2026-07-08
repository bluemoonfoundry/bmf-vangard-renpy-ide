/**
 * @file SearchContext.tsx
 * @description React Context for project-wide search and replace functionality.
 * Extracts search state from App.tsx to reduce prop drilling to SearchPanel
 * and provide search functionality to other components (e.g., find usages).
 */

import React, { createContext, useState, useCallback, useContext, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { logger } from '@/lib/logger';
import { useImmer } from 'use-immer';
import type { SearchResult, Block } from '@/types';
import { useDualPane } from '@/contexts/DualPaneContext';

interface SearchOptions {
  isCaseSensitive: boolean;
  isWholeWord: boolean;
  isRegex: boolean;
}

interface SearchContextType {
  // Search state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  replaceQuery: string;
  setReplaceQuery: (r: string) => void;
  searchOptions: SearchOptions;
  setSearchOptions: (options: SearchOptions) => void;
  searchResults: SearchResult[];
  isSearching: boolean;

  // Actions
  executeSearch: () => Promise<void>;
  executeReplaceAll: () => void;
  handleResultClick: (filePath: string, lineNumber: number) => void;
}

const SearchContext = createContext<SearchContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
  replaceQuery: '',
  setReplaceQuery: () => {},
  searchOptions: { isCaseSensitive: false, isWholeWord: false, isRegex: false },
  setSearchOptions: () => {},
  searchResults: [],
  isSearching: false,
  executeSearch: async () => {},
  executeReplaceAll: () => {},
  handleResultClick: () => {},
});

export const useSearch = () => useContext(SearchContext);

interface SearchProviderProps {
  children: React.ReactNode;
  blocks: Block[];
  setBlocks: (action: Block[] | ((prev: Block[]) => Block[])) => void;
  setDirtyBlockIds: Dispatch<SetStateAction<Set<string>>>;
  projectRootPath: string | null;
  addToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({
  children,
  blocks,
  setBlocks,
  setDirtyBlockIds,
  projectRootPath,
  addToast,
}) => {
  const { handleOpenEditor } = useDualPane();
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [searchOptions, setSearchOptions] = useImmer<SearchOptions>({
    isCaseSensitive: false,
    isWholeWord: false,
    isRegex: false,
  });
  const [searchResults, setSearchResults] = useImmer<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const executeSearch = useCallback(async () => {
    if (window.electronAPI && projectRootPath) {
      setIsSearching(true);
      try {
        const results = await window.electronAPI.searchInProject({
          projectPath: projectRootPath,
          query: searchQuery,
          ...searchOptions,
        });
        setSearchResults(results);
      } catch (err) {
        logger.error('Search failed:', err);
        addToast('Search failed', 'error');
      } finally {
        setIsSearching(false);
      }
    }
  }, [projectRootPath, searchQuery, searchOptions, addToast, setSearchResults]);

  const buildReplaceRegex = useCallback((query: string, options: SearchOptions): RegExp | null => {
    if (!query) return null;
    let flags = 'g';
    if (!options.isCaseSensitive) flags += 'i';
    let pattern = options.isRegex ? query : query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (options.isWholeWord) pattern = `\\b${pattern}\\b`;
    try {
      return new RegExp(pattern, flags);
    } catch (err) {
      logger.error('Invalid replace pattern:', err);
      return null;
    }
  }, []);

  const executeReplaceAll = useCallback(() => {
    if (!searchQuery || searchResults.length === 0) return;

    const regex = buildReplaceRegex(searchQuery, searchOptions);
    if (!regex) {
      addToast('Invalid search pattern', 'error');
      return;
    }

    const targetPaths = new Set(searchResults.map(r => r.filePath));
    const affectedBlockIds = new Set<string>();
    let totalReplacements = 0;

    blocks.forEach(b => {
      if (!b.filePath || !targetPaths.has(b.filePath)) return;
      const matches = b.content.match(regex);
      if (matches && matches.length > 0) {
        totalReplacements += matches.length;
        affectedBlockIds.add(b.id);
      }
    });

    if (totalReplacements === 0 || affectedBlockIds.size === 0) {
      addToast('No matches found to replace', 'info');
      return;
    }

    const fileCount = affectedBlockIds.size;
    const confirmed = window.confirm(
      `Replace ${totalReplacements} occurrence${totalReplacements === 1 ? '' : 's'} in ${fileCount} file${fileCount === 1 ? '' : 's'}?`
    );
    if (!confirmed) return;

    setBlocks(prev => prev.map(b => (
      affectedBlockIds.has(b.id) ? { ...b, content: b.content.replace(regex, replaceQuery) } : b
    )));
    setDirtyBlockIds(prev => {
      const next = new Set(prev);
      affectedBlockIds.forEach(id => next.add(id));
      return next;
    });

    addToast(
      `Replaced ${totalReplacements} occurrence${totalReplacements === 1 ? '' : 's'} in ${fileCount} file${fileCount === 1 ? '' : 's'}. Save to persist changes.`,
      'success',
    );
    setSearchResults([]);
  }, [searchQuery, searchResults, searchOptions, replaceQuery, blocks, buildReplaceRegex, addToast, setBlocks, setDirtyBlockIds, setSearchResults]);

  const handleResultClick = useCallback((filePath: string, lineNumber: number) => {
    const block = blocks.find(b => b.filePath === filePath);
    if (block) handleOpenEditor(block.id, lineNumber);
  }, [blocks, handleOpenEditor]);

  const value = useMemo(() => ({
    searchQuery,
    setSearchQuery,
    replaceQuery,
    setReplaceQuery,
    searchOptions,
    setSearchOptions,
    searchResults,
    isSearching,
    executeSearch,
    executeReplaceAll,
    handleResultClick,
  }), [searchQuery, replaceQuery, searchOptions, searchResults, isSearching, executeSearch, executeReplaceAll, handleResultClick, setSearchOptions]);

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
