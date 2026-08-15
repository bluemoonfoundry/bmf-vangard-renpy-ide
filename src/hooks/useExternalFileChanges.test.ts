import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
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
    addToast: vi.fn(),
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

  it('registers the onFileChangedExternally listener when projectRootPath is set', () => {
    const onFileChangedExternally = vi.fn().mockReturnValue(vi.fn());
    window.electronAPI!.onFileChangedExternally = onFileChangedExternally;
    renderHook(() => useExternalFileChanges(makeParams()));
    expect(onFileChangedExternally).toHaveBeenCalledTimes(1);
  });

  it('does not register a listener when projectRootPath is null', () => {
    const onFileChangedExternally = vi.fn().mockReturnValue(vi.fn());
    window.electronAPI!.onFileChangedExternally = onFileChangedExternally;
    renderHook(() => useExternalFileChanges(makeParams({ projectRootPath: null })));
    expect(onFileChangedExternally).not.toHaveBeenCalled();
  });

  it('unsubscribes the listener on unmount', () => {
    const unsub = vi.fn();
    window.electronAPI!.onFileChangedExternally = vi.fn().mockReturnValue(unsub);
    const { unmount } = renderHook(() => useExternalFileChanges(makeParams()));
    unmount();
    expect(unsub).toHaveBeenCalledTimes(1);
  });

  it('silently reloads content from disk when the block is not dirty', async () => {
    let emit: (data: { relativePath: string; absolutePath: string }) => void = () => {};
    window.electronAPI!.onFileChangedExternally = vi.fn((cb) => {
      emit = cb;
      return vi.fn();
    });
    window.electronAPI!.readFile = vi.fn().mockResolvedValue('new content');
    const setBlocks = vi.fn();
    renderHook(() => useExternalFileChanges(makeParams({ setBlocks })));

    act(() => emit({ relativePath: 'game/script.rpy', absolutePath: '/project/game/script.rpy' }));

    await waitFor(() => expect(setBlocks).toHaveBeenCalled());
    expect(window.electronAPI!.readFile).toHaveBeenCalledWith('/project/game/script.rpy');
  });

  it('updates the editor model when its content differs from the reloaded content', async () => {
    let emit: (data: { relativePath: string; absolutePath: string }) => void = () => {};
    window.electronAPI!.onFileChangedExternally = vi.fn((cb) => {
      emit = cb;
      return vi.fn();
    });
    window.electronAPI!.readFile = vi.fn().mockResolvedValue('new content');
    const setValue = vi.fn();
    const model = { getValue: vi.fn().mockReturnValue('old content'), setValue };
    const editor = { getModel: vi.fn().mockReturnValue(model) };
    const editorInstances = { current: new Map([['block-1', editor as unknown as import('monaco-editor/esm/vs/editor/editor.api').editor.IStandaloneCodeEditor]]) };
    renderHook(() => useExternalFileChanges(makeParams({ editorInstances })));

    act(() => emit({ relativePath: 'game/script.rpy', absolutePath: '/project/game/script.rpy' }));

    await waitFor(() => expect(setValue).toHaveBeenCalledWith('new content'));
  });

  it('leaves the editor model untouched when its content already matches', async () => {
    let emit: (data: { relativePath: string; absolutePath: string }) => void = () => {};
    window.electronAPI!.onFileChangedExternally = vi.fn((cb) => {
      emit = cb;
      return vi.fn();
    });
    window.electronAPI!.readFile = vi.fn().mockResolvedValue('same content');
    const setValue = vi.fn();
    const model = { getValue: vi.fn().mockReturnValue('same content'), setValue };
    const editor = { getModel: vi.fn().mockReturnValue(model) };
    const editorInstances = { current: new Map([['block-1', editor as unknown as import('monaco-editor/esm/vs/editor/editor.api').editor.IStandaloneCodeEditor]]) };
    const setBlocks = vi.fn();
    renderHook(() => useExternalFileChanges(makeParams({ editorInstances, setBlocks })));

    act(() => emit({ relativePath: 'game/script.rpy', absolutePath: '/project/game/script.rpy' }));

    await waitFor(() => expect(setBlocks).toHaveBeenCalled());
    expect(setValue).not.toHaveBeenCalled();
  });

  it('does not touch a block that does not match the changed file', async () => {
    let emit: (data: { relativePath: string; absolutePath: string }) => void = () => {};
    window.electronAPI!.onFileChangedExternally = vi.fn((cb) => {
      emit = cb;
      return vi.fn();
    });
    window.electronAPI!.readFile = vi.fn().mockResolvedValue('new content');
    const setBlocks = vi.fn();
    const { result } = renderHook(() => useExternalFileChanges(makeParams({ setBlocks })));

    act(() => emit({ relativePath: 'game/other.rpy', absolutePath: '/project/game/other.rpy' }));

    expect(setBlocks).not.toHaveBeenCalled();
    expect(result.current.externallyChangedFiles).toHaveLength(0);
  });

  it('queues the file for user decision when the block has unsaved edits', () => {
    let emit: (data: { relativePath: string; absolutePath: string }) => void = () => {};
    window.electronAPI!.onFileChangedExternally = vi.fn((cb) => {
      emit = cb;
      return vi.fn();
    });
    const { result } = renderHook(() =>
      useExternalFileChanges(makeParams({ dirtyBlockIdsRef: { current: new Set(['block-1']) } })),
    );

    act(() => emit({ relativePath: 'game/script.rpy', absolutePath: '/project/game/script.rpy' }));

    expect(result.current.externallyChangedFiles).toEqual([
      { relativePath: 'game/script.rpy', absolutePath: '/project/game/script.rpy' },
    ]);
  });

  it('toasts a warning when the watcher reports an error', () => {
    let emitError: (data: { message: string }) => void = () => {};
    window.electronAPI!.onWatcherError = vi.fn((cb) => {
      emitError = cb;
      return vi.fn();
    });
    const addToast = vi.fn();
    renderHook(() => useExternalFileChanges(makeParams({ addToast })));

    act(() => emitError({ message: 'EACCES' }));

    expect(addToast).toHaveBeenCalledWith(
      expect.stringContaining('Live file change detection'),
      'warning',
    );
  });

  it('does not queue duplicate entries for the same relative path', () => {
    let emit: (data: { relativePath: string; absolutePath: string }) => void = () => {};
    window.electronAPI!.onFileChangedExternally = vi.fn((cb) => {
      emit = cb;
      return vi.fn();
    });
    const { result } = renderHook(() =>
      useExternalFileChanges(makeParams({ dirtyEditorsRef: { current: new Set(['block-1']) } })),
    );

    const data = { relativePath: 'game/script.rpy', absolutePath: '/project/game/script.rpy' };
    act(() => emit(data));
    act(() => emit(data));

    expect(result.current.externallyChangedFiles).toHaveLength(1);
  });
});
