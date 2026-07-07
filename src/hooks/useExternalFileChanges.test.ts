import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExternalFileChanges } from '@/hooks/useExternalFileChanges';
import { installElectronAPI } from '@/test/mocks/electronAPI';
import { createBlock } from '@/test/mocks/sampleData';

function makeParams(overrides: Partial<Parameters<typeof useExternalFileChanges>[0]> = {}) {
  const block = createBlock({ id: 'block-1', filePath: 'game/script.rpy' });
  return {
    projectRootPath: '/project',
    blocksRef: { current: [block] },
    dirtyBlockIdsRef: { current: new Set<string>() },
    dirtyEditorsRef: { current: new Set<string>() },
    setBlocks: vi.fn(),
    editorInstances: { current: new Map() },
    ...overrides,
  };
}

describe('useExternalFileChanges', () => {
  beforeEach(() => {
    installElectronAPI();
  });

  it('initializes with empty externallyChangedFiles', () => {
    const { result } = renderHook(() => useExternalFileChanges(makeParams()));
    expect(result.current.externallyChangedFiles).toHaveLength(0);
  });

  it('initializes with empty filesWithDiskConflict', () => {
    const { result } = renderHook(() => useExternalFileChanges(makeParams()));
    expect(result.current.filesWithDiskConflict.size).toBe(0);
  });

  it('handleKeepCurrentFile removes the file from externallyChangedFiles', () => {
    const { result } = renderHook(() => useExternalFileChanges(makeParams()));
    act(() => result.current.setExternallyChangedFiles([
      { relativePath: 'game/script.rpy', absolutePath: '/project/game/script.rpy' },
    ]));
    act(() => result.current.handleKeepCurrentFile('game/script.rpy'));
    expect(result.current.externallyChangedFiles).toHaveLength(0);
  });

  it('handleKeepCurrentFile adds the path to filesWithDiskConflict', () => {
    const { result } = renderHook(() => useExternalFileChanges(makeParams()));
    act(() => result.current.handleKeepCurrentFile('game/script.rpy'));
    expect(result.current.filesWithDiskConflict.has('game/script.rpy')).toBe(true);
  });

  it('setFilesWithDiskConflict allows external clearing', () => {
    const { result } = renderHook(() => useExternalFileChanges(makeParams()));
    act(() => result.current.handleKeepCurrentFile('game/script.rpy'));
    act(() => result.current.setFilesWithDiskConflict(new Set()));
    expect(result.current.filesWithDiskConflict.size).toBe(0);
  });

  it('initializes empty state when projectRootPath is null', () => {
    const { result } = renderHook(() =>
      useExternalFileChanges(makeParams({ projectRootPath: null })),
    );
    expect(result.current.externallyChangedFiles).toHaveLength(0);
    expect(result.current.filesWithDiskConflict.size).toBe(0);
  });
});
