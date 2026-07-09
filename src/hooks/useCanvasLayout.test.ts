import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCanvasLayout } from '@/hooks/useCanvasLayout';
import { createBlock, createEmptyAnalysisResult, createProjectSettings } from '@/test/mocks/sampleData';
import type { UseCanvasLayoutParams } from '@/hooks/useCanvasLayout';

function makeParams(overrides: Partial<UseCanvasLayoutParams> = {}): UseCanvasLayoutParams {
  const block = createBlock();
  const emptyAnalysis = createEmptyAnalysisResult();
  const projectSettings = createProjectSettings();
  return {
    blocks: [block],
    setBlocks: vi.fn(),
    analysisResult: emptyAnalysis,
    routeAnalysisResult: {
      labelNodes: [],
      routeLinks: [],
      identifiedRoutes: [],
      routesTruncated: false,
    },
    routeNodeLayoutCache: new Map(),
    setRouteNodeLayoutCache: vi.fn(),
    pendingStoryLayoutRefreshRef: { current: null },
    pendingRouteLayoutRefreshRef: { current: null },
    pendingAutoCenterRef: { current: { story: false, route: false, choice: false } },
    projectSettings: projectSettings as Parameters<typeof useCanvasLayout>[0]['projectSettings'],
    updateProjectSettings: vi.fn(),
    setHasUnsavedSettings: vi.fn(),
    addToast: vi.fn(),
    isAnalysisPending: false,
    isInitialAnalysisPending: false,
    setCenterOnBlockRequest: vi.fn(),
    setCenterOnRouteStartRequest: vi.fn(),
    setCenterOnChoiceStartRequest: vi.fn(),
    ...overrides,
  };
}

describe('useCanvasLayout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── applyStoryLayout ───────────────────────────────────────────────────────

  it('applyStoryLayout calls setBlocks with new layout', () => {
    const setBlocks = vi.fn();
    const { result } = renderHook(() => useCanvasLayout(makeParams({ setBlocks })));
    act(() => result.current.applyStoryLayout('flow-lr', 'none'));
    expect(setBlocks).toHaveBeenCalled();
  });

  it('applyStoryLayout calls updateProjectSettings with layout fingerprint data', () => {
    const updateProjectSettings = vi.fn();
    const { result } = renderHook(() => useCanvasLayout(makeParams({ updateProjectSettings })));
    act(() => result.current.applyStoryLayout('flow-lr', 'none'));
    expect(updateProjectSettings).toHaveBeenCalled();
  });

  it('applyStoryLayout marks settings dirty', () => {
    const setHasUnsavedSettings = vi.fn();
    const { result } = renderHook(() => useCanvasLayout(makeParams({ setHasUnsavedSettings })));
    act(() => result.current.applyStoryLayout('flow-lr', 'none'));
    expect(setHasUnsavedSettings).toHaveBeenCalledWith(true);
  });

  it('applyStoryLayout shows toast by default', () => {
    const addToast = vi.fn();
    const { result } = renderHook(() => useCanvasLayout(makeParams({ addToast })));
    act(() => result.current.applyStoryLayout('flow-lr', 'none'));
    expect(addToast).toHaveBeenCalledWith('Layout organized', 'success');
  });

  it('applyStoryLayout uses custom success message when provided', () => {
    const addToast = vi.fn();
    const { result } = renderHook(() => useCanvasLayout(makeParams({ addToast })));
    act(() => result.current.applyStoryLayout('flow-lr', 'none', { successMessage: 'Done!' }));
    expect(addToast).toHaveBeenCalledWith('Done!', 'success');
  });

  it('applyStoryLayout skips toast when showToast is false', () => {
    const addToast = vi.fn();
    const { result } = renderHook(() => useCanvasLayout(makeParams({ addToast })));
    act(() => result.current.applyStoryLayout('flow-lr', 'none', { showToast: false }));
    expect(addToast).not.toHaveBeenCalled();
  });

  it('applyStoryLayout shows error toast when layout computation throws', () => {
    const setBlocks = vi.fn(() => { throw new Error('layout failed'); });
    const addToast = vi.fn();
    const { result } = renderHook(() => useCanvasLayout(makeParams({ setBlocks, addToast })));
    act(() => result.current.applyStoryLayout('flow-lr', 'none'));
    expect(addToast).toHaveBeenCalledWith('Failed to organize layout', 'error');
  });

  // ── handleTidyUp ──────────────────────────────────────────────────────────

  it('handleTidyUp calls setBlocks (delegates to applyStoryLayout)', () => {
    const setBlocks = vi.fn();
    const { result } = renderHook(() => useCanvasLayout(makeParams({ setBlocks })));
    act(() => result.current.handleTidyUp());
    expect(setBlocks).toHaveBeenCalled();
  });

  it('handleTidyUp suppresses toast when called with false', () => {
    const addToast = vi.fn();
    const { result } = renderHook(() => useCanvasLayout(makeParams({ addToast })));
    act(() => result.current.handleTidyUp(false));
    expect(addToast).not.toHaveBeenCalled();
  });

  // ── handleChangeStoryCanvasLayoutMode ─────────────────────────────────────

  it('handleChangeStoryCanvasLayoutMode calls updateProjectSettings with new mode', () => {
    const updateProjectSettings = vi.fn();
    const { result } = renderHook(() => useCanvasLayout(makeParams({ updateProjectSettings })));
    act(() => result.current.handleChangeStoryCanvasLayoutMode('connected-components'));
    expect(updateProjectSettings).toHaveBeenCalled();
  });

  it('handleChangeStoryCanvasLayoutMode marks settings dirty', () => {
    const setHasUnsavedSettings = vi.fn();
    const { result } = renderHook(() => useCanvasLayout(makeParams({ setHasUnsavedSettings })));
    act(() => result.current.handleChangeStoryCanvasLayoutMode('flow-lr'));
    expect(setHasUnsavedSettings).toHaveBeenCalledWith(true);
  });

  it('handleChangeStoryCanvasLayoutMode resets groupingMode to none when switching away from clustered-flow', () => {
    const updateProjectSettings = vi.fn();
    const projectSettings = createProjectSettings({
      storyCanvasGroupingMode: 'filename-prefix',
    } as any);
    const { result } = renderHook(() =>
      useCanvasLayout(makeParams({ updateProjectSettings, projectSettings: projectSettings as any })),
    );
    act(() => result.current.handleChangeStoryCanvasLayoutMode('flow-lr'));
    // The updater function should set groupingMode to 'none'
    const updater = updateProjectSettings.mock.calls[0][0];
    const draft: any = {};
    updater(draft);
    expect(draft.storyCanvasGroupingMode).toBe('none');
  });

  it('handleChangeStoryCanvasLayoutMode preserves groupingMode when switching to clustered-flow', () => {
    const updateProjectSettings = vi.fn();
    const projectSettings = createProjectSettings({
      storyCanvasGroupingMode: 'filename-prefix',
    } as any);
    const { result } = renderHook(() =>
      useCanvasLayout(makeParams({ updateProjectSettings, projectSettings: projectSettings as any })),
    );
    act(() => result.current.handleChangeStoryCanvasLayoutMode('clustered-flow'));
    const updater = updateProjectSettings.mock.calls[0][0];
    const draft: any = {};
    updater(draft);
    expect(draft.storyCanvasGroupingMode).toBe('filename-prefix');
  });

  it('handleChangeStoryCanvasLayoutMode triggers layout via setTimeout when blocks exist', () => {
    const setBlocks = vi.fn();
    const { result } = renderHook(() =>
      useCanvasLayout(makeParams({ setBlocks, blocks: [createBlock()] })),
    );
    act(() => result.current.handleChangeStoryCanvasLayoutMode('connected-components'));
    expect(setBlocks).not.toHaveBeenCalled(); // not yet
    act(() => vi.runAllTimers());
    expect(setBlocks).toHaveBeenCalled();
  });

  it('handleChangeStoryCanvasLayoutMode skips layout when blocks is empty', () => {
    const setBlocks = vi.fn();
    const { result } = renderHook(() => useCanvasLayout(makeParams({ setBlocks, blocks: [] })));
    act(() => result.current.handleChangeStoryCanvasLayoutMode('connected-components'));
    act(() => vi.runAllTimers());
    expect(setBlocks).not.toHaveBeenCalled();
  });

  // ── handleChangeStoryCanvasGroupingMode ───────────────────────────────────

  it('handleChangeStoryCanvasGroupingMode switches layout mode to clustered-flow when grouping is set', () => {
    const updateProjectSettings = vi.fn();
    const projectSettings = createProjectSettings({
      storyCanvasLayoutMode: 'flow-lr',
    } as any);
    const { result } = renderHook(() =>
      useCanvasLayout(makeParams({ updateProjectSettings, projectSettings: projectSettings as any })),
    );
    act(() => result.current.handleChangeStoryCanvasGroupingMode('filename-prefix'));
    const updater = updateProjectSettings.mock.calls[0][0];
    const draft: any = {};
    updater(draft);
    expect(draft.storyCanvasLayoutMode).toBe('clustered-flow');
  });

  it('handleChangeStoryCanvasGroupingMode resets layout to flow-lr when clearing grouping from clustered-flow', () => {
    const updateProjectSettings = vi.fn();
    const projectSettings = createProjectSettings({
      storyCanvasLayoutMode: 'clustered-flow',
    } as any);
    const { result } = renderHook(() =>
      useCanvasLayout(makeParams({ updateProjectSettings, projectSettings: projectSettings as any })),
    );
    act(() => result.current.handleChangeStoryCanvasGroupingMode('none'));
    const updater = updateProjectSettings.mock.calls[0][0];
    const draft: any = {};
    updater(draft);
    expect(draft.storyCanvasLayoutMode).toBe('flow-lr');
  });

  // ── applyRouteLayout ───────────────────────────────────────────────────────

  it('applyRouteLayout calls setRouteNodeLayoutCache', () => {
    const setRouteNodeLayoutCache = vi.fn();
    const { result } = renderHook(() =>
      useCanvasLayout(makeParams({ setRouteNodeLayoutCache })),
    );
    act(() => result.current.applyRouteLayout('flow-lr', 'none'));
    expect(setRouteNodeLayoutCache).toHaveBeenCalled();
  });

  it('applyRouteLayout shows toast by default', () => {
    const addToast = vi.fn();
    const { result } = renderHook(() => useCanvasLayout(makeParams({ addToast })));
    act(() => result.current.applyRouteLayout('flow-lr', 'none'));
    expect(addToast).toHaveBeenCalledWith('Route layout organized', 'success');
  });

  it('applyRouteLayout skips toast when showToast is false', () => {
    const addToast = vi.fn();
    const { result } = renderHook(() => useCanvasLayout(makeParams({ addToast })));
    act(() => result.current.applyRouteLayout('flow-lr', 'none', { showToast: false }));
    expect(addToast).not.toHaveBeenCalled();
  });

  // ── handleChangeRouteCanvasLayoutMode ─────────────────────────────────────

  it('handleChangeRouteCanvasLayoutMode calls updateProjectSettings', () => {
    const updateProjectSettings = vi.fn();
    const { result } = renderHook(() => useCanvasLayout(makeParams({ updateProjectSettings })));
    act(() => result.current.handleChangeRouteCanvasLayoutMode('connected-components'));
    expect(updateProjectSettings).toHaveBeenCalled();
  });
});
