/**
 * @file useSnippetStats.ts
 * @description Tracks per-snippet favorite/usage state (grid view UX: sort by most-used/
 * recently-used, favorite/star toggle) in localStorage. Keyed by category+title since
 * built-in/merged snippets have no stable id. Renderer-local by design -- this is
 * per-machine browsing preference, not project data, so it does not go through the
 * project file IPC or `AppSettings`.
 */
import { useCallback, useState } from 'react';
import { logger } from '@/lib/logger';

export interface SnippetStatEntry {
  favorite: boolean;
  copyCount: number;
  lastUsedAt: number | null;
}

type SnippetStatsMap = Record<string, SnippetStatEntry>;

const STORAGE_KEY = 'vangard-snippet-stats';

export function getSnippetStatId(category: string, title: string): string {
  return `${category}::${title}`;
}

function loadStats(): SnippetStatsMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (err) {
    logger.warn('Failed to load snippet stats from localStorage:', err);
    return {};
  }
}

function saveStats(stats: SnippetStatsMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    logger.warn('Failed to persist snippet stats to localStorage:', err);
  }
}

const emptyEntry: SnippetStatEntry = { favorite: false, copyCount: 0, lastUsedAt: null };

export interface UseSnippetStatsResult {
  getStat: (id: string) => SnippetStatEntry;
  toggleFavorite: (id: string) => void;
  recordCopy: (id: string) => void;
}

export function useSnippetStats(): UseSnippetStatsResult {
  const [stats, setStats] = useState<SnippetStatsMap>(() => loadStats());

  const getStat = useCallback((id: string) => stats[id] ?? emptyEntry, [stats]);

  const toggleFavorite = useCallback((id: string) => {
    setStats((prev) => {
      const current = prev[id] ?? emptyEntry;
      const next = { ...prev, [id]: { ...current, favorite: !current.favorite } };
      saveStats(next);
      return next;
    });
  }, []);

  const recordCopy = useCallback((id: string) => {
    setStats((prev) => {
      const current = prev[id] ?? emptyEntry;
      const next = {
        ...prev,
        [id]: { ...current, copyCount: current.copyCount + 1, lastUsedAt: Date.now() },
      };
      saveStats(next);
      return next;
    });
  }, []);

  return { getStat, toggleFavorite, recordCopy };
}
