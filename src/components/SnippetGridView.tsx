/**
 * @file SnippetGridView.tsx
 * @description Grid-based snippet browser with search and category filtering.
 * Displays snippets as cards in a responsive grid layout for better discoverability.
 * Features: category filter chips, search (title/description/code/tags), sort
 * (alphabetical/most copied/recently used/favorites first), favorite/star toggle,
 * usage-count badge, tag chips, hover preview tooltip, expandable code preview,
 * copy buttons, "/" keyboard shortcut to focus search, and exporting a full
 * category or a hand-picked selection as a shareable pack file.
 */
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import type { Snippet, SnippetCategory } from '@/types';
import CopyButton from './CopyButton';
import { useSnippetStats, getSnippetStatId } from '@/hooks/useSnippetStats';
import { exportSnippetPack, sanitizeFileNameSegment } from '@/lib/snippetPackExport';

interface SnippetWithCategory extends Snippet {
  category: string;
}

interface SnippetGridViewProps {
  categories: SnippetCategory[];
}

type SortOption = 'alphabetical' | 'mostUsed' | 'recent' | 'favorites';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'alphabetical', label: 'Alphabetical' },
  { value: 'mostUsed', label: 'Most Copied' },
  { value: 'recent', label: 'Recently Used' },
  { value: 'favorites', label: 'Favorites First' },
];

const SnippetGridView: React.FC<SnippetGridViewProps> = ({ categories }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [expandedSnippet, setExpandedSnippet] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const [hoveredSnippet, setHoveredSnippet] = useState<string | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [exportStatus, setExportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { getStat, toggleFavorite, recordCopy } = useSnippetStats();

  // Flatten all snippets with their category info
  const allSnippets = useMemo<SnippetWithCategory[]>(() => {
    return categories.flatMap(category =>
      category.snippets.map(snippet => ({
        ...snippet,
        category: category.name,
      }))
    );
  }, [categories]);

  // Filter snippets based on search and selected categories
  const filteredSnippets = useMemo(() => {
    let filtered = allSnippets;

    // Apply category filter
    if (selectedCategories.size > 0) {
      filtered = filtered.filter(snippet => selectedCategories.has(snippet.category));
    }

    // Apply search filter across title, description, code, and tags
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(snippet =>
        snippet.title.toLowerCase().includes(query) ||
        snippet.description.toLowerCase().includes(query) ||
        snippet.code.toLowerCase().includes(query) ||
        (snippet.tags?.some(tag => tag.toLowerCase().includes(query)) ?? false)
      );
    }

    return filtered;
  }, [allSnippets, selectedCategories, searchQuery]);

  // Generate unique ID for each snippet (for expansion/favorite/usage tracking)
  const getSnippetId = useCallback((snippet: SnippetWithCategory) => {
    return getSnippetStatId(snippet.category, snippet.title);
  }, []);

  // Sort the filtered snippets for display (does not affect the result count)
  const sortedSnippets = useMemo(() => {
    const sorted = [...filteredSnippets];
    switch (sortBy) {
      case 'mostUsed':
        sorted.sort((a, b) => {
          const diff = getStat(getSnippetId(b)).copyCount - getStat(getSnippetId(a)).copyCount;
          return diff !== 0 ? diff : a.title.localeCompare(b.title);
        });
        break;
      case 'recent':
        sorted.sort((a, b) => {
          const diff = (getStat(getSnippetId(b)).lastUsedAt ?? 0) - (getStat(getSnippetId(a)).lastUsedAt ?? 0);
          return diff !== 0 ? diff : a.title.localeCompare(b.title);
        });
        break;
      case 'favorites':
        sorted.sort((a, b) => {
          const diff = Number(getStat(getSnippetId(b)).favorite) - Number(getStat(getSnippetId(a)).favorite);
          return diff !== 0 ? diff : a.title.localeCompare(b.title);
        });
        break;
      default:
        sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  }, [filteredSnippets, sortBy, getStat, getSnippetId]);

  // Toggle category selection
  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryName)) {
        next.delete(categoryName);
      } else {
        next.add(categoryName);
      }
      return next;
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories(new Set());
    setSearchQuery('');
  };

  const toggleSelectMode = () => {
    setSelectMode(prev => !prev);
    setSelectedIds(new Set());
  };

  const toggleSnippetSelected = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleExportSelected = async () => {
    const selected = allSnippets.filter(s => selectedIds.has(getSnippetId(s)));
    if (selected.length === 0) return;

    // Group the selection back into categories so the exported pack keeps its schema.
    const grouped = new Map<string, Snippet[]>();
    for (const snippet of selected) {
      const { category, ...rest } = snippet;
      const existing = grouped.get(category) ?? [];
      existing.push(rest);
      grouped.set(category, existing);
    }
    const exportCategories: SnippetCategory[] = Array.from(grouped.entries()).map(([name, snippets]) => ({ name, snippets }));

    const result = await exportSnippetPack(exportCategories, `${sanitizeFileNameSegment('vangard-snippets')}.json`);
    if (result.canceled) return;
    setExportStatus(result.success
      ? { type: 'success', message: `Exported ${selected.length} snippet${selected.length === 1 ? '' : 's'}${result.filePath ? ` to ${result.filePath}` : '.'}` }
      : { type: 'error', message: result.error ?? 'Export failed.' });
    if (result.success) {
      setSelectMode(false);
      setSelectedIds(new Set());
    }
  };

  const handleExportCategory = async (category: SnippetCategory) => {
    const result = await exportSnippetPack([category], `${sanitizeFileNameSegment(category.name)}.json`);
    if (result.canceled) return;
    setExportStatus(result.success
      ? { type: 'success', message: `Exported "${category.name}"${result.filePath ? ` to ${result.filePath}` : '.'}` }
      : { type: 'error', message: result.error ?? 'Export failed.' });
  };

  // "/" focuses search from anywhere on the page that isn't already a text input;
  // Escape clears the search box while it's focused.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;

      if (e.key === '/' && !isTyping) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && target === searchInputRef.current && searchQuery) {
        setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search snippets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          title="Press / to search, Esc to clear"
          className="w-full px-3 py-2 pl-9 rounded-md border border-primary bg-secondary text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Category Filter Chips + Sort */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map(category => {
          const isSelected = selectedCategories.has(category.name);
          return (
            <button
              key={category.name}
              onClick={() => toggleCategory(category.name)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                isSelected
                  ? 'bg-accent text-white'
                  : 'bg-tertiary text-secondary hover:bg-primary hover:text-primary border border-primary'
              }`}
            >
              {category.name}
            </button>
          );
        })}
        {(selectedCategories.size > 0 || searchQuery) && (
          <button
            onClick={clearFilters}
            className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            Clear Filters
          </button>
        )}
        {selectedCategories.size === 1 && (
          <button
            onClick={() => {
              const name = [...selectedCategories][0];
              const category = categories.find(c => c.name === name);
              if (category) handleExportCategory(category);
            }}
            className="px-3 py-1 rounded-full text-xs font-medium bg-tertiary text-secondary hover:bg-primary hover:text-primary border border-primary transition-colors"
          >
            Export Category
          </button>
        )}
        <button
          onClick={toggleSelectMode}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            selectMode
              ? 'bg-accent text-white'
              : 'bg-tertiary text-secondary hover:bg-primary hover:text-primary border border-primary'
          }`}
        >
          {selectMode ? 'Cancel Select' : 'Select'}
        </button>
        {selectMode && selectedIds.size > 0 && (
          <button
            onClick={handleExportSelected}
            className="px-3 py-1 rounded-full text-xs font-medium bg-accent text-white hover:bg-accent-hover transition-colors"
          >
            Export Selected ({selectedIds.size})
          </button>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          <label htmlFor="snippet-sort" className="text-xs text-secondary">Sort by:</label>
          <select
            id="snippet-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-xs rounded-md border border-primary bg-secondary text-primary px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-secondary">
        {filteredSnippets.length} {filteredSnippets.length === 1 ? 'snippet' : 'snippets'}
        {(selectedCategories.size > 0 || searchQuery) && ` (filtered from ${allSnippets.length})`}
      </div>

      {exportStatus && (
        <div className={`p-2 rounded text-xs ${
          exportStatus.type === 'success'
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
        }`}>
          {exportStatus.message}
        </div>
      )}

      {/* Snippet Grid */}
      {sortedSnippets.length === 0 ? (
        <div className="text-center py-12 text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto mb-3 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">No snippets found</p>
          <p className="text-xs mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sortedSnippets.map(snippet => {
            const snippetId = getSnippetId(snippet);
            const isExpanded = expandedSnippet === snippetId;
            const isTruncated = snippet.code.length > 60;
            const codePreview = isTruncated ? snippet.code.substring(0, 60) + '...' : snippet.code;
            const stat = getStat(snippetId);

            return (
              <div
                key={snippetId}
                className="p-3 rounded-md bg-secondary border border-primary hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    {selectMode && (
                      <input
                        type="checkbox"
                        checked={selectedIds.has(snippetId)}
                        onChange={() => toggleSnippetSelected(snippetId)}
                        aria-label={`Select ${snippet.title}`}
                        className="mt-1 flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-primary truncate">{snippet.title}</h3>
                      <p className="text-xs text-secondary mt-0.5">{snippet.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center flex-shrink-0 ml-2 gap-1">
                    <button
                      onClick={() => toggleFavorite(snippetId)}
                      aria-label={stat.favorite ? `Unfavorite ${snippet.title}` : `Favorite ${snippet.title}`}
                      title={stat.favorite ? 'Remove from favorites' : 'Add to favorites'}
                      className={`p-0.5 rounded transition-colors ${stat.favorite ? 'text-amber-500' : 'text-secondary hover:text-amber-500'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="h-3.5 w-3.5" fill={stat.favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 2.5l2.35 4.76 5.25.76-3.8 3.7.9 5.23L10 14.6l-4.7 2.35.9-5.23-3.8-3.7 5.25-.76z" />
                      </svg>
                    </button>
                    <CopyButton text={snippet.code} label="" size="xs" onCopy={() => recordCopy(snippetId)} />
                  </div>
                </div>

                {/* Tags */}
                {snippet.tags && snippet.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {snippet.tags.map(tag => (
                      <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-tertiary text-secondary">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Code Preview */}
                <div className="relative flex-1">
                  <div
                    className={`bg-gray-800 dark:bg-gray-900 text-white p-2 rounded text-xs font-mono whitespace-pre-wrap cursor-pointer hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors ${
                      isExpanded ? '' : 'line-clamp-3'
                    }`}
                    onClick={() => setExpandedSnippet(isExpanded ? null : snippetId)}
                    onMouseEnter={() => setHoveredSnippet(snippetId)}
                    onMouseLeave={() => setHoveredSnippet(prev => (prev === snippetId ? null : prev))}
                    title={isExpanded ? 'Click to collapse' : 'Click to expand'}
                  >
                    <code>{isExpanded ? snippet.code : codePreview}</code>
                  </div>

                  {/* Hover preview tooltip: full code, shown only while collapsed and truncated */}
                  {hoveredSnippet === snippetId && !isExpanded && isTruncated && (
                    <div className="absolute z-20 left-0 right-0 top-full mt-1 p-2 rounded-md bg-gray-900 text-white text-xs font-mono whitespace-pre-wrap shadow-lg border border-gray-700 max-h-64 overflow-auto pointer-events-none">
                      <code>{snippet.code}</code>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded">
                      {snippet.category}
                    </span>
                    {stat.copyCount > 0 && (
                      <span className="text-[10px] text-secondary" title={`Copied ${stat.copyCount} time${stat.copyCount === 1 ? '' : 's'}`}>
                        Copied {stat.copyCount}×
                      </span>
                    )}
                  </div>
                  {isTruncated && (
                    <button
                      onClick={() => setExpandedSnippet(isExpanded ? null : snippetId)}
                      className="text-[10px] text-secondary hover:text-accent transition-colors"
                    >
                      {isExpanded ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SnippetGridView;
