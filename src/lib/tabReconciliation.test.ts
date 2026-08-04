import { describe, it, expect } from 'vitest';
import { pruneOrphanedEditorTabs } from '@/lib/tabReconciliation';
import type { EditorTab } from '@/types';

describe('pruneOrphanedEditorTabs', () => {
  it('drops editor tabs whose blockId has no matching block', () => {
    const tabs: EditorTab[] = [
      { id: 'block-1', type: 'editor', blockId: 'block-1' },
      { id: 'block-2', type: 'editor', blockId: 'block-2' },
    ];
    const result = pruneOrphanedEditorTabs(tabs, new Set(['block-1']));
    expect(result.changed).toBe(true);
    expect(result.tabs).toEqual([{ id: 'block-1', type: 'editor', blockId: 'block-1' }]);
  });

  it('leaves non-editor tabs untouched regardless of blockId', () => {
    const tabs: EditorTab[] = [
      { id: 'canvas', type: 'canvas' },
      { id: 'untitled-1', type: 'untitled', title: 'Untitled-1' },
    ];
    const result = pruneOrphanedEditorTabs(tabs, new Set());
    expect(result.changed).toBe(false);
    expect(result.tabs).toEqual(tabs);
  });

  it('reports changed=false and returns an equivalent array when nothing is orphaned', () => {
    const tabs: EditorTab[] = [{ id: 'block-1', type: 'editor', blockId: 'block-1' }];
    const result = pruneOrphanedEditorTabs(tabs, new Set(['block-1']));
    expect(result.changed).toBe(false);
    expect(result.tabs).toEqual(tabs);
  });
});
