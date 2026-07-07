/**
 * @file hooks/useFileSystemState.test.ts
 * @description Tests for useFileSystemState — selection, expansion, clipboard, and project close.
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFileSystemState } from '@/hooks/useFileSystemState';

// ============================================================================
// Initial state
// ============================================================================

describe('useFileSystemState — initial state', () => {
  it('starts with null projectRootPath', () => {
    const { result } = renderHook(() => useFileSystemState());
    expect(result.current.projectRootPath).toBeNull();
  });

  it('starts with null fileSystemTree', () => {
    const { result } = renderHook(() => useFileSystemState());
    expect(result.current.fileSystemTree).toBeNull();
  });

  it('starts with empty selection sets', () => {
    const { result } = renderHook(() => useFileSystemState());
    expect(result.current.explorerSelectedPaths.size).toBe(0);
    expect(result.current.explorerLastClickedPath).toBeNull();
  });

  it('starts with empty expansion set', () => {
    const { result } = renderHook(() => useFileSystemState());
    expect(result.current.explorerExpandedPaths.size).toBe(0);
  });

  it('starts with null clipboard', () => {
    const { result } = renderHook(() => useFileSystemState());
    expect(result.current.clipboard).toBeNull();
  });

  it('starts with null explorerExternalAction', () => {
    const { result } = renderHook(() => useFileSystemState());
    expect(result.current.explorerExternalAction).toBeNull();
  });
});

// ============================================================================
// selectPath
// ============================================================================

describe('useFileSystemState — selectPath', () => {
  it('selects a single path and sets lastClicked', () => {
    const { result } = renderHook(() => useFileSystemState());
    act(() => result.current.selectPath('game/script.rpy'));
    expect(result.current.explorerSelectedPaths.has('game/script.rpy')).toBe(true);
    expect(result.current.explorerLastClickedPath).toBe('game/script.rpy');
  });

  it('replaces selection by default (no append)', () => {
    const { result } = renderHook(() => useFileSystemState());
    act(() => result.current.selectPath('game/a.rpy'));
    act(() => result.current.selectPath('game/b.rpy'));
    expect(result.current.explorerSelectedPaths.size).toBe(1);
    expect(result.current.explorerSelectedPaths.has('game/b.rpy')).toBe(true);
  });

  it('appends to selection when append=true', () => {
    const { result } = renderHook(() => useFileSystemState());
    act(() => result.current.selectPath('game/a.rpy'));
    act(() => result.current.selectPath('game/b.rpy', true));
    expect(result.current.explorerSelectedPaths.size).toBe(2);
  });

  it('deselects an already-selected path when append=true', () => {
    const { result } = renderHook(() => useFileSystemState());
    act(() => result.current.selectPath('game/a.rpy'));
    act(() => result.current.selectPath('game/a.rpy', true));
    expect(result.current.explorerSelectedPaths.has('game/a.rpy')).toBe(false);
  });
});

// ============================================================================
// selectPaths
// ============================================================================

describe('useFileSystemState — selectPaths', () => {
  it('selects multiple paths at once', () => {
    const { result } = renderHook(() => useFileSystemState());
    act(() => result.current.selectPaths(['game/a.rpy', 'game/b.rpy']));
    expect(result.current.explorerSelectedPaths.size).toBe(2);
    expect(result.current.explorerLastClickedPath).toBe('game/b.rpy');
  });

  it('accepts empty array without error', () => {
    const { result } = renderHook(() => useFileSystemState());
    act(() => result.current.selectPaths([]));
    expect(result.current.explorerSelectedPaths.size).toBe(0);
    // lastClickedPath not updated when empty
    expect(result.current.explorerLastClickedPath).toBeNull();
  });
});

// ============================================================================
// clearExplorerSelection
// ============================================================================

describe('useFileSystemState — clearExplorerSelection', () => {
  it('clears selection and lastClicked', () => {
    const { result } = renderHook(() => useFileSystemState());
    act(() => result.current.selectPaths(['game/a.rpy', 'game/b.rpy']));
    act(() => result.current.clearExplorerSelection());
    expect(result.current.explorerSelectedPaths.size).toBe(0);
    expect(result.current.explorerLastClickedPath).toBeNull();
  });
});

// ============================================================================
// expandPath / collapsePath / toggleExpansion
// ============================================================================

describe('useFileSystemState — expand/collapse', () => {
  it('expandPath adds a path to expandedPaths', () => {
    const { result } = renderHook(() => useFileSystemState());
    act(() => result.current.expandPath('game/images'));
    expect(result.current.explorerExpandedPaths.has('game/images')).toBe(true);
  });

  it('collapsePath removes a path from expandedPaths', () => {
    const { result } = renderHook(() => useFileSystemState());
    act(() => result.current.expandPath('game/images'));
    act(() => result.current.collapsePath('game/images'));
    expect(result.current.explorerExpandedPaths.has('game/images')).toBe(false);
  });

  it('toggleExpansion expands a collapsed path', () => {
    const { result } = renderHook(() => useFileSystemState());
    act(() => result.current.toggleExpansion('game/images'));
    expect(result.current.explorerExpandedPaths.has('game/images')).toBe(true);
  });

  it('toggleExpansion collapses an expanded path', () => {
    const { result } = renderHook(() => useFileSystemState());
    act(() => result.current.expandPath('game/images'));
    act(() => result.current.toggleExpansion('game/images'));
    expect(result.current.explorerExpandedPaths.has('game/images')).toBe(false);
  });

  it('collapseAll clears all expanded paths', () => {
    const { result } = renderHook(() => useFileSystemState());
    act(() => {
      result.current.expandPath('game/images');
      result.current.expandPath('game/audio');
    });
    act(() => result.current.collapseAll());
    expect(result.current.explorerExpandedPaths.size).toBe(0);
  });
});

// ============================================================================
// triggerNewFile / triggerNewFolder / triggerRename
// ============================================================================

describe('useFileSystemState — external action triggers', () => {
  it('triggerNewFile sets action type to new-file', () => {
    const { result } = renderHook(() => useFileSystemState());
    act(() => result.current.triggerNewFile());
    expect(result.current.explorerExternalAction?.type).toBe('new-file');
    expect(typeof result.current.explorerExternalAction?.key).toBe('number');
  });

  it('triggerNewFolder sets action type to new-folder', () => {
    const { result } = renderHook(() => useFileSystemState());
    act(() => result.current.triggerNewFolder());
    expect(result.current.explorerExternalAction?.type).toBe('new-folder');
  });

  it('triggerRename sets action type to rename', () => {
    const { result } = renderHook(() => useFileSystemState());
    act(() => result.current.triggerRename());
    expect(result.current.explorerExternalAction?.type).toBe('rename');
  });

  it('each trigger increments key to force re-render', () => {
    const { result } = renderHook(() => useFileSystemState());
    act(() => result.current.triggerNewFile());
    const key1 = result.current.explorerExternalAction?.key;
    act(() => result.current.triggerNewFile());
    const key2 = result.current.explorerExternalAction?.key;
    expect(key2).toBeGreaterThanOrEqual(key1!);
  });
});

// ============================================================================
// Clipboard
// ============================================================================

describe('useFileSystemState — clipboard', () => {
  it('copyToClipboard stores paths with copy type', () => {
    const { result } = renderHook(() => useFileSystemState());
    act(() => result.current.copyToClipboard(['game/a.rpy', 'game/b.rpy']));
    expect(result.current.clipboard?.type).toBe('copy');
    expect((result.current.clipboard as { type: string; paths: string[] })?.paths).toEqual(['game/a.rpy', 'game/b.rpy']);
  });

  it('cutToClipboard stores paths with cut type', () => {
    const { result } = renderHook(() => useFileSystemState());
    act(() => result.current.cutToClipboard(['game/a.rpy']));
    expect(result.current.clipboard?.type).toBe('cut');
  });

  it('clearClipboard resets clipboard to null', () => {
    const { result } = renderHook(() => useFileSystemState());
    act(() => result.current.copyToClipboard(['game/a.rpy']));
    act(() => result.current.clearClipboard());
    expect(result.current.clipboard).toBeNull();
  });
});

// ============================================================================
// closeProject
// ============================================================================

describe('useFileSystemState — closeProject', () => {
  it('resets all state to initial values', () => {
    const { result } = renderHook(() => useFileSystemState());
    act(() => {
      result.current.setProjectRootPath('/my/project');
      result.current.selectPath('game/a.rpy');
      result.current.expandPath('game/images');
      result.current.copyToClipboard(['game/a.rpy']);
      result.current.triggerNewFile();
    });
    act(() => result.current.closeProject());
    expect(result.current.projectRootPath).toBeNull();
    expect(result.current.explorerSelectedPaths.size).toBe(0);
    expect(result.current.explorerLastClickedPath).toBeNull();
    expect(result.current.explorerExpandedPaths.size).toBe(0);
    expect(result.current.clipboard).toBeNull();
    expect(result.current.explorerExternalAction).toBeNull();
  });
});
