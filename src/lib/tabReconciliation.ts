import type { EditorTab } from '@/types';

export interface PruneOrphanedTabsResult {
  tabs: EditorTab[];
  changed: boolean;
}

/**
 * Drops 'editor' tabs whose blockId no longer resolves against blockIds.
 * Without this, useTabContentRenderer's blockId-not-found fallback renders such
 * a tab as a blank pane mislabeled "Untitled" instead of closing it.
 */
export function pruneOrphanedEditorTabs(tabs: EditorTab[], blockIds: Set<string>): PruneOrphanedTabsResult {
  const next = tabs.filter(t => !(t.type === 'editor' && !!t.blockId && !blockIds.has(t.blockId)));
  return { tabs: next, changed: next.length !== tabs.length };
}
