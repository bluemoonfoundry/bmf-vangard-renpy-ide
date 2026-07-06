import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGoToLabel } from '@/hooks/useGoToLabel';
import { createSampleAnalysisResult } from '@/test/mocks/sampleData';

function makeParams(overrides: Partial<Parameters<typeof useGoToLabel>[0]> = {}) {
  return {
    activeCanvasTabId: 'canvas' as const,
    analysisResult: createSampleAnalysisResult(),
    routeAnalysisResult: { labelNodes: [] as Array<{ label: string; id: string }> },
    closeGoToLabelModal: vi.fn(),
    setCenterOnBlockRequest: vi.fn(),
    setCenterOnRouteNodeRequest: vi.fn(),
    setCenterOnChoiceNodeRequest: vi.fn(),
    ...overrides,
  };
}

describe('useGoToLabel', () => {
  describe('goToLabelItems', () => {
    it('returns label nodes for canvas tab', () => {
      const analysisResult = createSampleAnalysisResult();
      const params = makeParams({ activeCanvasTabId: 'canvas', analysisResult });
      const { result } = renderHook(() => useGoToLabel(params));
      expect(result.current.goToLabelItems.length).toBe(analysisResult.labelNodes.length);
    });

    it('returns route label nodes for route-canvas tab', () => {
      const labelNodes = [{ label: 'scene_a', id: 'node-1' }];
      const params = makeParams({
        activeCanvasTabId: 'route-canvas',
        routeAnalysisResult: { labelNodes },
      });
      const { result } = renderHook(() => useGoToLabel(params));
      expect(result.current.goToLabelItems).toEqual([{ label: 'scene_a', id: 'node-1' }]);
    });

    it('returns route label nodes for choice-canvas tab', () => {
      const labelNodes = [{ label: 'choice_a', id: 'node-2' }];
      const params = makeParams({
        activeCanvasTabId: 'choice-canvas',
        routeAnalysisResult: { labelNodes },
      });
      const { result } = renderHook(() => useGoToLabel(params));
      expect(result.current.goToLabelItems).toEqual([{ label: 'choice_a', id: 'node-2' }]);
    });

    it('returns empty array when activeCanvasTabId is null', () => {
      const params = makeParams({ activeCanvasTabId: null });
      const { result } = renderHook(() => useGoToLabel(params));
      expect(result.current.goToLabelItems).toEqual([]);
    });
  });

  describe('goToLabelCanvasName', () => {
    it('returns "Story" for canvas tab', () => {
      const { result } = renderHook(() => useGoToLabel(makeParams({ activeCanvasTabId: 'canvas' })));
      expect(result.current.goToLabelCanvasName).toBe('Story');
    });

    it('returns "Route" for route-canvas tab', () => {
      const { result } = renderHook(() => useGoToLabel(makeParams({ activeCanvasTabId: 'route-canvas' })));
      expect(result.current.goToLabelCanvasName).toBe('Route');
    });

    it('returns "Choice" for choice-canvas tab', () => {
      const { result } = renderHook(() => useGoToLabel(makeParams({ activeCanvasTabId: 'choice-canvas' })));
      expect(result.current.goToLabelCanvasName).toBe('Choice');
    });

    it('returns empty string when no canvas active', () => {
      const { result } = renderHook(() => useGoToLabel(makeParams({ activeCanvasTabId: null })));
      expect(result.current.goToLabelCanvasName).toBe('');
    });
  });

  describe('handleGoToLabel', () => {
    it('closes modal and sets block center request on canvas tab', () => {
      const params = makeParams({ activeCanvasTabId: 'canvas' });
      const { result } = renderHook(() => useGoToLabel(params));
      result.current.handleGoToLabel('block-123');
      expect(params.closeGoToLabelModal).toHaveBeenCalled();
      expect(params.setCenterOnBlockRequest).toHaveBeenCalledWith(
        expect.objectContaining({ blockId: 'block-123' }),
      );
    });

    it('sets route node request on route-canvas tab', () => {
      const params = makeParams({ activeCanvasTabId: 'route-canvas' });
      const { result } = renderHook(() => useGoToLabel(params));
      result.current.handleGoToLabel('node-abc');
      expect(params.setCenterOnRouteNodeRequest).toHaveBeenCalledWith(
        expect.objectContaining({ nodeId: 'node-abc' }),
      );
    });

    it('sets choice node request on choice-canvas tab', () => {
      const params = makeParams({ activeCanvasTabId: 'choice-canvas' });
      const { result } = renderHook(() => useGoToLabel(params));
      result.current.handleGoToLabel('node-xyz');
      expect(params.setCenterOnChoiceNodeRequest).toHaveBeenCalledWith(
        expect.objectContaining({ nodeId: 'node-xyz' }),
      );
    });
  });
});
