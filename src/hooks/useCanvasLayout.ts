import { useRef, useCallback, useEffect } from 'react';
import type React from 'react';
import type { Block, Position, PersistedProjectSettings, RenpyAnalysisResult, LabelNode, RouteLink, IdentifiedRoute } from '@/types';
import type { StoryCanvasLayoutMode, StoryCanvasGroupingMode } from '@/types';
import type { ToastMessage } from '@/types';
import type { PendingStoryLayoutRefresh, PendingRouteLayoutRefresh } from '@/hooks/useProjectIO';
import type { CenterOnBlockRequest, CenterOnStartRequest } from '@/hooks/useCanvasInteraction';
import { computeStoryLayout, computeStoryLayoutFingerprint, getStoryLayoutVersion } from '@/lib/storyCanvasLayout';
import { computeRouteCanvasLayout, computeRouteCanvasLayoutFingerprint, getRouteCanvasLayoutVersion } from '@/lib/routeCanvasLayout';
import { logger } from '@/lib/logger';

type ProjectSettingsSlice = PersistedProjectSettings;

interface RouteAnalysisLike {
  labelNodes: LabelNode[];
  routeLinks: RouteLink[];
  identifiedRoutes: IdentifiedRoute[];
  routesTruncated: boolean;
}

export interface UseCanvasLayoutParams {
  blocks: Block[];
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  analysisResult: RenpyAnalysisResult;
  routeAnalysisResult: RouteAnalysisLike;
  routeNodeLayoutCache: Map<string, Position>;
  setRouteNodeLayoutCache: React.Dispatch<React.SetStateAction<Map<string, Position>>>;
  pendingStoryLayoutRefreshRef: React.MutableRefObject<PendingStoryLayoutRefresh | null>;
  pendingRouteLayoutRefreshRef: React.MutableRefObject<PendingRouteLayoutRefresh | null>;
  pendingAutoCenterRef: React.MutableRefObject<{ story: boolean; route: boolean; choice: boolean }>;
  projectSettings: ProjectSettingsSlice;
  updateProjectSettings: (updater: (draft: ProjectSettingsSlice) => void) => void;
  setHasUnsavedSettings: React.Dispatch<React.SetStateAction<boolean>>;
  addToast: (message: string, type?: ToastMessage['type']) => void;
  isAnalysisPending: boolean;
  isInitialAnalysisPending: boolean;
  setCenterOnBlockRequest: React.Dispatch<React.SetStateAction<CenterOnBlockRequest | null>>;
  setCenterOnRouteStartRequest: React.Dispatch<React.SetStateAction<CenterOnStartRequest | null>>;
  setCenterOnChoiceStartRequest: React.Dispatch<React.SetStateAction<CenterOnStartRequest | null>>;
}

export interface UseCanvasLayoutReturn {
  applyStoryLayout: (
    layoutMode: StoryCanvasLayoutMode,
    groupingMode: StoryCanvasGroupingMode,
    options?: { showToast?: boolean; successMessage?: string; statusMessage?: string; toastType?: ToastMessage['type'] }
  ) => void;
  handleTidyUp: (showToast?: boolean) => void;
  applyRouteLayout: (
    layoutMode: StoryCanvasLayoutMode,
    groupingMode: StoryCanvasGroupingMode,
    options?: { showToast?: boolean; successMessage?: string; statusMessage?: string; toastType?: ToastMessage['type'] }
  ) => void;
  handleChangeStoryCanvasLayoutMode: (mode: StoryCanvasLayoutMode) => void;
  handleChangeStoryCanvasGroupingMode: (mode: StoryCanvasGroupingMode) => void;
  handleChangeRouteCanvasLayoutMode: (mode: StoryCanvasLayoutMode) => void;
  handleChangeRouteCanvasGroupingMode: (mode: StoryCanvasGroupingMode) => void;
}

export function useCanvasLayout({
  blocks, setBlocks,
  analysisResult, routeAnalysisResult,
  routeNodeLayoutCache, setRouteNodeLayoutCache,
  pendingStoryLayoutRefreshRef, pendingRouteLayoutRefreshRef, pendingAutoCenterRef,
  projectSettings, updateProjectSettings, setHasUnsavedSettings, addToast,
  isAnalysisPending, isInitialAnalysisPending,
  setCenterOnBlockRequest, setCenterOnRouteStartRequest, setCenterOnChoiceStartRequest,
}: UseCanvasLayoutParams): UseCanvasLayoutReturn {

  // Stable ref so applyStoryLayout never stales on blocks without tracking drag-position changes
  const blocksForLayoutRef = useRef(blocks);
  blocksForLayoutRef.current = blocks;

  const applyStoryLayout = useCallback((
    layoutMode: StoryCanvasLayoutMode,
    groupingMode: StoryCanvasGroupingMode,
    options?: { showToast?: boolean; successMessage?: string; statusMessage?: string; toastType?: ToastMessage['type'] },
  ) => {
    try {
      const links = analysisResult.links;
      const newLayout = computeStoryLayout(blocksForLayoutRef.current, links, layoutMode, groupingMode);
      const layoutFingerprint = computeStoryLayoutFingerprint(newLayout, links, layoutMode, groupingMode);
      setBlocks(newLayout);
      updateProjectSettings(draft => {
        draft.storyCanvasLayoutMode = layoutMode;
        draft.storyCanvasGroupingMode = groupingMode;
        draft.storyCanvasLayoutFingerprint = layoutFingerprint;
        draft.storyCanvasLayoutVersion = getStoryLayoutVersion();
        draft.storyCanvasLayoutWasUserAdjusted = false;
      });
      setHasUnsavedSettings(true);
      if (options?.showToast ?? true) {
        addToast(options?.successMessage ?? 'Layout organized', options?.toastType ?? 'success');
      }
    } catch (e) {
      logger.error('Failed to tidy up layout:', e);
      if (options?.showToast ?? true) {
        addToast('Failed to organize layout', 'error');
      }
    }
  }, [analysisResult.links, setBlocks, addToast, updateProjectSettings, setHasUnsavedSettings]);

  const handleTidyUp = useCallback((showToast = true) => {
    applyStoryLayout(
      projectSettings.storyCanvasLayoutMode ?? 'flow-lr',
      projectSettings.storyCanvasGroupingMode ?? 'none',
      { showToast },
    );
  }, [applyStoryLayout, projectSettings.storyCanvasGroupingMode, projectSettings.storyCanvasLayoutMode]);

  const handleChangeStoryCanvasLayoutMode = useCallback((mode: StoryCanvasLayoutMode) => {
    const currentGroupingMode = projectSettings.storyCanvasGroupingMode ?? 'none';
    const newGroupingMode: StoryCanvasGroupingMode =
      mode !== 'clustered-flow' && currentGroupingMode !== 'none' ? 'none' : currentGroupingMode;

    updateProjectSettings(draft => {
      draft.storyCanvasLayoutMode = mode;
      draft.storyCanvasGroupingMode = newGroupingMode;
    });
    setHasUnsavedSettings(true);
    if (blocks.length > 0 && !isAnalysisPending && !isInitialAnalysisPending) {
      setTimeout(() => {
        applyStoryLayout(mode, newGroupingMode, { showToast: false, statusMessage: 'Story layout updated.' });
      }, 0);
    }
  }, [
    updateProjectSettings, setHasUnsavedSettings,
    blocks.length, isAnalysisPending, isInitialAnalysisPending,
    projectSettings.storyCanvasGroupingMode,
    applyStoryLayout,
  ]);

  const handleChangeStoryCanvasGroupingMode = useCallback((mode: StoryCanvasGroupingMode) => {
    const currentLayoutMode = projectSettings.storyCanvasLayoutMode ?? 'flow-lr';
    const newLayoutMode: StoryCanvasLayoutMode =
      mode !== 'none' ? 'clustered-flow'
      : currentLayoutMode === 'clustered-flow' ? 'flow-lr'
      : currentLayoutMode;

    updateProjectSettings(draft => {
      draft.storyCanvasGroupingMode = mode;
      draft.storyCanvasLayoutMode = newLayoutMode;
    });
    setHasUnsavedSettings(true);
    if (blocks.length > 0 && !isAnalysisPending && !isInitialAnalysisPending) {
      setTimeout(() => {
        applyStoryLayout(newLayoutMode, mode, { showToast: false, statusMessage: 'Story layout updated.' });
      }, 0);
    }
  }, [
    updateProjectSettings, setHasUnsavedSettings,
    blocks.length, isAnalysisPending, isInitialAnalysisPending,
    projectSettings.storyCanvasLayoutMode,
    applyStoryLayout,
  ]);

  const applyRouteLayout = useCallback((
    layoutMode: StoryCanvasLayoutMode,
    groupingMode: StoryCanvasGroupingMode,
    options?: { showToast?: boolean; successMessage?: string; statusMessage?: string; toastType?: ToastMessage['type'] },
  ) => {
    try {
      const sourceNodes = routeAnalysisResult.labelNodes.map(node => ({
        ...node,
        position: routeNodeLayoutCache.get(node.id) ?? node.position,
      }));
      const newLayout = computeRouteCanvasLayout(sourceNodes, routeAnalysisResult.routeLinks, layoutMode, groupingMode);
      const layoutFingerprint = computeRouteCanvasLayoutFingerprint(newLayout, routeAnalysisResult.routeLinks, layoutMode, groupingMode);
      setRouteNodeLayoutCache(new Map(newLayout.map(node => [node.id, node.position])));
      updateProjectSettings(draft => {
        draft.routeCanvasLayoutMode = layoutMode;
        draft.routeCanvasGroupingMode = groupingMode;
        draft.routeCanvasLayoutFingerprint = layoutFingerprint;
        draft.routeCanvasLayoutVersion = getRouteCanvasLayoutVersion();
        draft.routeCanvasLayoutWasUserAdjusted = false;
      });
      setHasUnsavedSettings(true);
      if (options?.showToast ?? true) {
        addToast(options?.successMessage ?? 'Route layout organized', options?.toastType ?? 'success');
      }
    } catch (error) {
      logger.error('Failed to organize route layout:', error);
      if (options?.showToast ?? true) {
        addToast('Failed to organize route layout', 'error');
      }
    }
  }, [routeAnalysisResult.labelNodes, routeAnalysisResult.routeLinks, routeNodeLayoutCache, setRouteNodeLayoutCache, updateProjectSettings, setHasUnsavedSettings, addToast]);

  const handleChangeRouteCanvasLayoutMode = useCallback((mode: StoryCanvasLayoutMode) => {
    const currentGroupingMode = projectSettings.routeCanvasGroupingMode ?? 'none';
    const newGroupingMode: StoryCanvasGroupingMode =
      mode !== 'clustered-flow' && currentGroupingMode !== 'none' ? 'none' : currentGroupingMode;

    updateProjectSettings(draft => {
      draft.routeCanvasLayoutMode = mode;
      draft.routeCanvasGroupingMode = newGroupingMode;
    });
    setHasUnsavedSettings(true);
    if (routeAnalysisResult.labelNodes.length > 0 && !isAnalysisPending && !isInitialAnalysisPending) {
      setTimeout(() => {
        applyRouteLayout(mode, newGroupingMode, { showToast: false, statusMessage: 'Route layout updated.' });
      }, 0);
    }
  }, [
    updateProjectSettings, setHasUnsavedSettings,
    routeAnalysisResult.labelNodes.length, isAnalysisPending, isInitialAnalysisPending,
    projectSettings.routeCanvasGroupingMode,
    applyRouteLayout,
  ]);

  const handleChangeRouteCanvasGroupingMode = useCallback((mode: StoryCanvasGroupingMode) => {
    const currentLayoutMode = projectSettings.routeCanvasLayoutMode ?? 'flow-lr';
    const newLayoutMode: StoryCanvasLayoutMode =
      mode !== 'none' ? 'clustered-flow'
      : currentLayoutMode === 'clustered-flow' ? 'flow-lr'
      : currentLayoutMode;

    updateProjectSettings(draft => {
      draft.routeCanvasGroupingMode = mode;
      draft.routeCanvasLayoutMode = newLayoutMode;
    });
    setHasUnsavedSettings(true);
    if (routeAnalysisResult.labelNodes.length > 0 && !isAnalysisPending && !isInitialAnalysisPending) {
      setTimeout(() => {
        applyRouteLayout(newLayoutMode, mode, { showToast: false, statusMessage: 'Route layout updated.' });
      }, 0);
    }
  }, [
    updateProjectSettings, setHasUnsavedSettings,
    routeAnalysisResult.labelNodes.length, isAnalysisPending, isInitialAnalysisPending,
    projectSettings.routeCanvasLayoutMode,
    applyRouteLayout,
  ]);

  // Story layout auto-refresh: fires after project load via pendingStoryLayoutRefreshRef
  useEffect(() => {
    const pendingRefresh = pendingStoryLayoutRefreshRef.current;
    if (!pendingRefresh || blocks.length === 0 || isInitialAnalysisPending || isAnalysisPending) return;
    pendingStoryLayoutRefreshRef.current = null;

    const layoutMode = projectSettings.storyCanvasLayoutMode ?? 'flow-lr';
    const groupingMode = projectSettings.storyCanvasGroupingMode ?? 'none';
    const currentFingerprint = computeStoryLayoutFingerprint(blocks, analysisResult.links, layoutMode, groupingMode);
    const savedVersionMatches = pendingRefresh.savedVersion === getStoryLayoutVersion();
    const shouldRefreshLayout =
      !pendingRefresh.hasSavedLayouts ||
      !pendingRefresh.savedFingerprint ||
      !savedVersionMatches ||
      pendingRefresh.savedFingerprint !== currentFingerprint;

    if (shouldRefreshLayout) {
      if (pendingRefresh.hasSavedLayouts && pendingRefresh.savedWasUserAdjusted) {
        updateProjectSettings(draft => {
          draft.storyCanvasLayoutFingerprint = currentFingerprint;
          draft.storyCanvasLayoutVersion = getStoryLayoutVersion();
        });
        setHasUnsavedSettings(true);
        addToast('Story graph changed. Layout preserved; use Redraw to reorganize.', 'info');
      } else {
        applyStoryLayout(layoutMode, groupingMode, {
          showToast: pendingRefresh.hasSavedLayouts,
          successMessage: pendingRefresh.hasSavedLayouts
            ? 'Story layout refreshed for changed graph'
            : 'Story layout generated',
          statusMessage: pendingRefresh.hasSavedLayouts
            ? 'Story layout refreshed.'
            : 'Story layout generated.',
          toastType: 'info',
        });
      }
    }

    if (pendingAutoCenterRef.current.story) {
      pendingAutoCenterRef.current.story = false;
      const startLabelNode = analysisResult.labelNodes.find(n => n.label === 'start');
      if (startLabelNode) {
        setCenterOnBlockRequest({ blockId: startLabelNode.blockId, key: Date.now() });
      }
    }
  }, [
    blocks, isInitialAnalysisPending, isAnalysisPending,
    projectSettings.storyCanvasGroupingMode, projectSettings.storyCanvasLayoutMode,
    analysisResult.links, analysisResult.labelNodes,
    applyStoryLayout, addToast, updateProjectSettings, setHasUnsavedSettings,
    setCenterOnBlockRequest,
    pendingStoryLayoutRefreshRef, pendingAutoCenterRef,
  ]);

  // Route layout auto-refresh: fires after project load via pendingRouteLayoutRefreshRef
  useEffect(() => {
    const pendingRefresh = pendingRouteLayoutRefreshRef.current;
    if (!pendingRefresh || isInitialAnalysisPending || isAnalysisPending) return;
    pendingRouteLayoutRefreshRef.current = null;

    const layoutMode = projectSettings.routeCanvasLayoutMode ?? 'flow-lr';
    const groupingMode = projectSettings.routeCanvasGroupingMode ?? 'none';
    const sourceNodes = routeAnalysisResult.labelNodes.map(node => ({
      ...node,
      position: routeNodeLayoutCache.get(node.id) ?? node.position,
    }));
    const currentFingerprint = computeRouteCanvasLayoutFingerprint(sourceNodes, routeAnalysisResult.routeLinks, layoutMode, groupingMode);
    const savedVersionMatches = pendingRefresh.savedVersion === getRouteCanvasLayoutVersion();
    const shouldRefreshLayout =
      !pendingRefresh.hasSavedLayouts ||
      !pendingRefresh.savedFingerprint ||
      !savedVersionMatches ||
      pendingRefresh.savedFingerprint !== currentFingerprint;

    if (shouldRefreshLayout) {
      if (pendingRefresh.hasSavedLayouts && pendingRefresh.savedWasUserAdjusted) {
        updateProjectSettings(draft => {
          draft.routeCanvasLayoutFingerprint = currentFingerprint;
          draft.routeCanvasLayoutVersion = getRouteCanvasLayoutVersion();
        });
        setHasUnsavedSettings(true);
        addToast('Route graph changed. Layout preserved; use Redraw to reorganize.', 'info');
      } else {
        applyRouteLayout(layoutMode, groupingMode, {
          showToast: pendingRefresh.hasSavedLayouts,
          successMessage: pendingRefresh.hasSavedLayouts
            ? 'Route layout refreshed for changed graph'
            : 'Route layout generated',
          statusMessage: pendingRefresh.hasSavedLayouts
            ? 'Route layout refreshed.'
            : 'Route layout generated.',
          toastType: 'info',
        });
      }
    }

    if (pendingAutoCenterRef.current.route) {
      pendingAutoCenterRef.current.route = false;
      setCenterOnRouteStartRequest({ key: Date.now() });
    }
  }, [
    isInitialAnalysisPending, isAnalysisPending,
    routeAnalysisResult.labelNodes, routeAnalysisResult.routeLinks,
    routeNodeLayoutCache,
    projectSettings.routeCanvasLayoutMode, projectSettings.routeCanvasGroupingMode,
    applyRouteLayout, addToast, updateProjectSettings, setHasUnsavedSettings,
    setCenterOnRouteStartRequest,
    pendingRouteLayoutRefreshRef, pendingAutoCenterRef,
  ]);

  // Auto-center Choices Canvas on first project open
  useEffect(() => {
    if (isInitialAnalysisPending || isAnalysisPending) return;
    if (!pendingAutoCenterRef.current.choice) return;
    if (!routeAnalysisResult.labelNodes.some(n => n.label === 'start')) return;
    pendingAutoCenterRef.current.choice = false;
    setCenterOnChoiceStartRequest({ key: Date.now() });
  }, [isInitialAnalysisPending, isAnalysisPending, routeAnalysisResult.labelNodes, setCenterOnChoiceStartRequest, pendingAutoCenterRef]);

  return {
    applyStoryLayout,
    handleTidyUp,
    applyRouteLayout,
    handleChangeStoryCanvasLayoutMode,
    handleChangeStoryCanvasGroupingMode,
    handleChangeRouteCanvasLayoutMode,
    handleChangeRouteCanvasGroupingMode,
  };
}
