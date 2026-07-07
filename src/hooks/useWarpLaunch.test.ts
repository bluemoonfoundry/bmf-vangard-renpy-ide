import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWarpLaunch } from '@/hooks/useWarpLaunch';
import { installElectronAPI, uninstallElectronAPI } from '@/test/mocks/electronAPI';
import { createBlock, createEmptyAnalysisResult } from '@/test/mocks/sampleData';
import type { Block, RenpyAnalysisResult } from '@/types';

function makeParams(overrides: Partial<Parameters<typeof useWarpLaunch>[0]> = {}) {
  return {
    projectRootPath: '/project',
    renpyPath: '/renpy-8',
    blocks: [] as Block[],
    analysisResult: createEmptyAnalysisResult() as RenpyAnalysisResult,
    addToast: vi.fn(),
    closeWarpVariablesModal: vi.fn(),
    closeWarpToLabelModal: vi.fn(),
    openWarpVariablesModal: vi.fn(),
    ...overrides,
  };
}

describe('useWarpLaunch', () => {
  let api: ReturnType<typeof installElectronAPI>;

  beforeEach(() => {
    api = installElectronAPI();
    api.path.join.mockImplementation((...parts: string[]) =>
      Promise.resolve(parts.join('/'))
    );
    api.fileExists.mockResolvedValue(false);
    api.writeFile.mockResolvedValue({ success: true });
  });

  afterEach(() => {
    uninstallElectronAPI();
  });

  describe('initial state', () => {
    it('has pendingWarpLabelName as null', () => {
      const { result } = renderHook(() => useWarpLaunch(makeParams()));
      expect(result.current.pendingWarpLabelName).toBeNull();
    });

    it('has pendingWarpTarget as null', () => {
      const { result } = renderHook(() => useWarpLaunch(makeParams()));
      expect(result.current.pendingWarpTarget).toBeNull();
    });

    it('has pendingWarpVariableDrafts as empty array', () => {
      const { result } = renderHook(() => useWarpLaunch(makeParams()));
      expect(result.current.pendingWarpVariableDrafts).toEqual([]);
    });
  });

  describe('handleWarpToLabel', () => {
    it('does nothing when window.electronAPI is not set', () => {
      uninstallElectronAPI();
      const params = makeParams();
      const { result } = renderHook(() => useWarpLaunch(params));
      act(() => result.current.handleWarpToLabel('start'));
      expect(params.openWarpVariablesModal).not.toHaveBeenCalled();
    });

    it('does nothing when projectRootPath is null', () => {
      const params = makeParams({ projectRootPath: null });
      const { result } = renderHook(() => useWarpLaunch(params));
      act(() => result.current.handleWarpToLabel('start'));
      expect(params.openWarpVariablesModal).not.toHaveBeenCalled();
    });

    it('shows warning toast when label cannot be resolved', () => {
      const params = makeParams({
        blocks: [],
        analysisResult: createEmptyAnalysisResult({ labels: {} }),
      });
      const { result } = renderHook(() => useWarpLaunch(params));
      act(() => result.current.handleWarpToLabel('nonexistent'));
      expect(params.addToast).toHaveBeenCalledWith(
        expect.stringContaining('nonexistent'),
        'warning'
      );
    });

    it('calls closeWarpToLabelModal before resolving', () => {
      const params = makeParams({ blocks: [], analysisResult: createEmptyAnalysisResult() });
      const { result } = renderHook(() => useWarpLaunch(params));
      act(() => result.current.handleWarpToLabel('any'));
      expect(params.closeWarpToLabelModal).toHaveBeenCalled();
    });

    it('opens warp variables modal when label resolves successfully', () => {
      const block = createBlock({ id: 'b1', filePath: 'game/script.rpy' });
      const analysis = createEmptyAnalysisResult({
        labels: { start: { blockId: 'b1', label: 'start', line: 1, column: 7, type: 'label' } },
      });
      const params = makeParams({ blocks: [block], analysisResult: analysis });
      const { result } = renderHook(() => useWarpLaunch(params));
      act(() => result.current.handleWarpToLabel('start'));
      expect(params.openWarpVariablesModal).toHaveBeenCalled();
    });

    it('sets pendingWarpLabelName when label resolves', () => {
      const block = createBlock({ id: 'b1', filePath: 'game/script.rpy' });
      const analysis = createEmptyAnalysisResult({
        labels: { start: { blockId: 'b1', label: 'start', line: 1, column: 7, type: 'label' } },
      });
      const params = makeParams({ blocks: [block], analysisResult: analysis });
      const { result } = renderHook(() => useWarpLaunch(params));
      act(() => result.current.handleWarpToLabel('start'));
      expect(result.current.pendingWarpLabelName).toBe('start');
    });

    it('sets pendingWarpTarget when label resolves', () => {
      const block = createBlock({ id: 'b1', filePath: 'game/script.rpy' });
      const analysis = createEmptyAnalysisResult({
        labels: { start: { blockId: 'b1', label: 'start', line: 1, column: 7, type: 'label' } },
      });
      const params = makeParams({ blocks: [block], analysisResult: analysis });
      const { result } = renderHook(() => useWarpLaunch(params));
      act(() => result.current.handleWarpToLabel('start'));
      // Format: <relative-path>:<line>
      expect(result.current.pendingWarpTarget).toBe('script.rpy:1');
    });
  });

  describe('resetWarpLaunchState', () => {
    it('calls closeWarpVariablesModal', () => {
      const params = makeParams();
      const { result } = renderHook(() => useWarpLaunch(params));
      act(() => result.current.resetWarpLaunchState());
      expect(params.closeWarpVariablesModal).toHaveBeenCalled();
    });

    it('clears pendingWarpLabelName', () => {
      const block = createBlock({ id: 'b1', filePath: 'game/script.rpy' });
      const analysis = createEmptyAnalysisResult({
        labels: { start: { blockId: 'b1', label: 'start', line: 1, column: 7, type: 'label' } },
      });
      const params = makeParams({ blocks: [block], analysisResult: analysis });
      const { result } = renderHook(() => useWarpLaunch(params));

      act(() => result.current.handleWarpToLabel('start'));
      expect(result.current.pendingWarpLabelName).toBe('start');

      act(() => result.current.resetWarpLaunchState());
      expect(result.current.pendingWarpLabelName).toBeNull();
    });

    it('clears pendingWarpTarget', () => {
      const block = createBlock({ id: 'b1', filePath: 'game/script.rpy' });
      const analysis = createEmptyAnalysisResult({
        labels: { start: { blockId: 'b1', label: 'start', line: 1, column: 7, type: 'label' } },
      });
      const params = makeParams({ blocks: [block], analysisResult: analysis });
      const { result } = renderHook(() => useWarpLaunch(params));

      act(() => result.current.handleWarpToLabel('start'));
      act(() => result.current.resetWarpLaunchState());
      expect(result.current.pendingWarpTarget).toBeNull();
    });
  });

  describe('cleanupWarpTempFile', () => {
    it('does nothing when projectRootPath is null', async () => {
      const params = makeParams({ projectRootPath: null });
      const { result } = renderHook(() => useWarpLaunch(params));
      await act(async () => {
        await result.current.cleanupWarpTempFile();
      });
      expect(api.removeEntry).not.toHaveBeenCalled();
    });

    it('does nothing when temp file does not exist', async () => {
      api.fileExists.mockResolvedValue(false);
      const { result } = renderHook(() => useWarpLaunch(makeParams()));
      await act(async () => {
        await result.current.cleanupWarpTempFile();
      });
      expect(api.removeEntry).not.toHaveBeenCalled();
    });

    it('removes temp file when it exists', async () => {
      api.fileExists.mockResolvedValue(true);
      api.removeEntry.mockResolvedValue({ success: true });
      const { result } = renderHook(() => useWarpLaunch(makeParams()));
      await act(async () => {
        await result.current.cleanupWarpTempFile();
      });
      expect(api.removeEntry).toHaveBeenCalled();
    });
  });

  describe('handleConfirmWarpVariables', () => {
    it('does nothing when projectRootPath is null', async () => {
      const params = makeParams({ projectRootPath: null });
      const { result } = renderHook(() => useWarpLaunch(params));
      await act(async () => {
        await result.current.handleConfirmWarpVariables([]);
      });
      expect(api.runGame).not.toHaveBeenCalled();
    });

    it('does nothing when pendingWarpTarget is null', async () => {
      const params = makeParams();
      const { result } = renderHook(() => useWarpLaunch(params));
      // pendingWarpTarget is null by default
      await act(async () => {
        await result.current.handleConfirmWarpVariables([]);
      });
      expect(api.runGame).not.toHaveBeenCalled();
    });

    it('calls runGame with the warp target when no variable drafts', async () => {
      const block = createBlock({ id: 'b1', filePath: 'game/script.rpy' });
      const analysis = createEmptyAnalysisResult({
        labels: { start: { blockId: 'b1', label: 'start', line: 1, column: 7, type: 'label' } },
      });
      const params = makeParams({ blocks: [block], analysisResult: analysis });
      const { result } = renderHook(() => useWarpLaunch(params));

      // First navigate to a label to set pendingWarpTarget
      act(() => result.current.handleWarpToLabel('start'));

      await act(async () => {
        await result.current.handleConfirmWarpVariables([]);
      });
      expect(api.runGame).toHaveBeenCalledWith('/renpy-8', '/project', 'script.rpy:1');
    });
  });
});
