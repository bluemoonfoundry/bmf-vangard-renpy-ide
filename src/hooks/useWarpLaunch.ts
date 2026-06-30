import { useState, useRef, useCallback } from 'react';
import type { Block, RenpyAnalysisResult } from '@/types';
import { resolveWarpTarget } from '@/lib/warpTarget';
import {
  buildAfterWarpScript,
  getWarpVariableDrafts,
  hasAfterWarpLabel,
  type WarpVariableDraft,
} from '@/lib/warpAfterWarp';
import { logger } from '@/lib/logger';
import { formatErrorMessage } from '@/lib/formatErrorMessage';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface UseWarpLaunchParams {
  projectRootPath: string | null;
  renpyPath: string;
  blocks: Block[];
  analysisResult: RenpyAnalysisResult;
  addToast: (message: string, type: ToastType) => void;
  closeWarpVariablesModal: () => void;
  closeWarpToLabelModal: () => void;
  openWarpVariablesModal: () => void;
}

export function useWarpLaunch({
  projectRootPath,
  renpyPath,
  blocks,
  analysisResult,
  addToast,
  closeWarpVariablesModal,
  closeWarpToLabelModal,
  openWarpVariablesModal,
}: UseWarpLaunchParams) {
  const [pendingWarpLabelName, setPendingWarpLabelName] = useState<string | null>(null);
  const [pendingWarpTarget, setPendingWarpTarget] = useState<string | null>(null);
  const [pendingWarpVariableDrafts, setPendingWarpVariableDrafts] = useState<WarpVariableDraft[]>([]);
  const warpTempFilePathRef = useRef<string | null>(null);

  const cleanupWarpTempFile = useCallback(async () => {
    if (!window.electronAPI || !projectRootPath) return;

    const tempPath = warpTempFilePathRef.current
      ?? await window.electronAPI.path.join(projectRootPath, 'game', '_ide_after_warp.rpy');

    try {
      if (await window.electronAPI.fileExists(tempPath)) {
        await window.electronAPI.removeEntry(tempPath);
      }
    } catch (error) {
      logger.error('Failed to clean up temporary warp file:', error);
    } finally {
      if (warpTempFilePathRef.current === tempPath) {
        warpTempFilePathRef.current = null;
      }
    }
  }, [projectRootPath]);

  const resetWarpLaunchState = useCallback(() => {
    closeWarpVariablesModal();
    setPendingWarpLabelName(null);
    setPendingWarpTarget(null);
    setPendingWarpVariableDrafts([]);
  }, [closeWarpVariablesModal]);

  const handleConfirmWarpVariables = useCallback(async (variableDrafts: WarpVariableDraft[]) => {
    if (!window.electronAPI || !projectRootPath || !pendingWarpTarget) return;

    const tempPath = await window.electronAPI.path.join(projectRootPath, 'game', '_ide_after_warp.rpy');
    const needsTempFile = variableDrafts.length > 0 || !hasAfterWarpLabel(analysisResult.labels);

    try {
      if (needsTempFile) {
        const script = buildAfterWarpScript(variableDrafts, !hasAfterWarpLabel(analysisResult.labels));
        await cleanupWarpTempFile();

        const writeResult = await window.electronAPI.writeFile(tempPath, script, 'utf-8');
        if (!writeResult.success) {
          throw new Error(writeResult.error || 'Failed to write temporary warp file.');
        }

        warpTempFilePathRef.current = tempPath;
      } else {
        await cleanupWarpTempFile();
      }

      const warpTarget = pendingWarpTarget;
      resetWarpLaunchState();
      window.electronAPI.runGame(renpyPath, projectRootPath, warpTarget);
    } catch (error) {
      logger.error('Failed to launch warped game:', error);
      addToast(`Failed to launch warp: ${formatErrorMessage(error)}`, 'error');
    }
  }, [analysisResult.labels, addToast, renpyPath, cleanupWarpTempFile, pendingWarpTarget, projectRootPath, resetWarpLaunchState]);

  const handleWarpToLabel = useCallback((labelName: string) => {
    if (!window.electronAPI || !projectRootPath) return;

    const warpTarget = resolveWarpTarget(blocks, analysisResult.labels, labelName);
    closeWarpToLabelModal();

    if (!warpTarget) {
      addToast(`Could not resolve warp target for "${labelName}"`, 'warning');
      return;
    }

    setPendingWarpLabelName(labelName);
    setPendingWarpTarget(warpTarget);
    setPendingWarpVariableDrafts(getWarpVariableDrafts(
      analysisResult.variables,
      analysisResult.translationData.translatableStrings,
    ));
    openWarpVariablesModal();
  }, [analysisResult.labels, analysisResult.translationData.translatableStrings, analysisResult.variables, addToast, blocks, projectRootPath, closeWarpToLabelModal, openWarpVariablesModal]);

  return {
    pendingWarpLabelName,
    pendingWarpTarget,
    pendingWarpVariableDrafts,
    cleanupWarpTempFile,
    resetWarpLaunchState,
    handleConfirmWarpVariables,
    handleWarpToLabel,
  };
}
