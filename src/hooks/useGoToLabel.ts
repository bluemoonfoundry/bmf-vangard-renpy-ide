import { useMemo, useCallback } from 'react';
import type { RenpyAnalysisResult } from '@/types';
import type { GoToLabelItem } from '@/components/GoToLabelModal';
import type { CenterOnBlockRequest, CenterOnNodeRequest } from '@/hooks/useCanvasInteraction';

interface UseGoToLabelParams {
  activeCanvasTabId: 'canvas' | 'route-canvas' | 'choice-canvas' | null;
  analysisResult: RenpyAnalysisResult;
  routeAnalysisResult: { labelNodes: Array<{ label: string; id: string }> };
  closeGoToLabelModal: () => void;
  setCenterOnBlockRequest: React.Dispatch<React.SetStateAction<CenterOnBlockRequest | null>>;
  setCenterOnRouteNodeRequest: React.Dispatch<React.SetStateAction<CenterOnNodeRequest | null>>;
  setCenterOnChoiceNodeRequest: React.Dispatch<React.SetStateAction<CenterOnNodeRequest | null>>;
}

export function useGoToLabel({
  activeCanvasTabId,
  analysisResult,
  routeAnalysisResult,
  closeGoToLabelModal,
  setCenterOnBlockRequest,
  setCenterOnRouteNodeRequest,
  setCenterOnChoiceNodeRequest,
}: UseGoToLabelParams) {
  const goToLabelItems = useMemo<GoToLabelItem[]>(() => {
    if (activeCanvasTabId === 'canvas') {
      return analysisResult.labelNodes.map(n => ({ label: n.label, id: n.blockId }));
    }
    if (activeCanvasTabId === 'route-canvas' || activeCanvasTabId === 'choice-canvas') {
      return routeAnalysisResult.labelNodes.map(n => ({ label: n.label, id: n.id }));
    }
    return [];
  }, [activeCanvasTabId, analysisResult.labelNodes, routeAnalysisResult.labelNodes]);

  const goToLabelCanvasName = activeCanvasTabId === 'canvas' ? 'Story'
    : activeCanvasTabId === 'route-canvas' ? 'Route'
    : activeCanvasTabId === 'choice-canvas' ? 'Choice'
    : '';

  const warpLabelItems = useMemo<GoToLabelItem[]>(() => {
    return Object.values(analysisResult.labels)
      .slice()
      .sort((a, b) => a.label.localeCompare(b.label))
      .map(loc => ({ label: loc.label, id: loc.label }));
  }, [analysisResult.labels]);

  const handleGoToLabel = useCallback((id: string) => {
    closeGoToLabelModal();
    if (activeCanvasTabId === 'canvas') {
      setCenterOnBlockRequest({ blockId: id, key: Date.now() });
    } else if (activeCanvasTabId === 'route-canvas') {
      setCenterOnRouteNodeRequest({ nodeId: id, key: Date.now() });
    } else if (activeCanvasTabId === 'choice-canvas') {
      setCenterOnChoiceNodeRequest({ nodeId: id, key: Date.now() });
    }
  }, [activeCanvasTabId, closeGoToLabelModal, setCenterOnBlockRequest, setCenterOnChoiceNodeRequest, setCenterOnRouteNodeRequest]);

  return { goToLabelItems, goToLabelCanvasName, warpLabelItems, handleGoToLabel };
}
