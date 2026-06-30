import { useState, useCallback, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface UseGameExecutionParams {
  projectRootPath: string | null;
  renpyPath: string;
  addToast: (message: string, type: ToastType) => void;
  cleanupWarpTempFile: () => Promise<void>;
}

export function useGameExecution({
  projectRootPath,
  renpyPath,
  addToast,
  cleanupWarpTempFile,
}: UseGameExecutionParams) {
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [screenshotCount, setScreenshotCount] = useState(0);

  const refreshScreenshotCount = useCallback(async () => {
    if (!window.electronAPI?.getScreenshotCount) return;
    const count = await window.electronAPI.getScreenshotCount();
    setScreenshotCount(count);
  }, []);

  const handleRunGame = useCallback(() => {
    if (!window.electronAPI || !projectRootPath) return;
    window.electronAPI.runGame(renpyPath, projectRootPath);
  }, [renpyPath, projectRootPath]);

  const handleOpenScreenshotsFolder = useCallback(async () => {
    if (!window.electronAPI?.openScreenshotsFolder) return;
    await window.electronAPI.openScreenshotsFolder();
  }, []);

  const handleClearScreenshots = useCallback(async () => {
    if (!window.electronAPI?.clearScreenshots) return;
    const result = await window.electronAPI.clearScreenshots();
    if (result.success) {
      addToast(`Cleared ${result.count} screenshot${result.count !== 1 ? 's' : ''}`, 'success');
      await refreshScreenshotCount();
      window.electronAPI.updateExplorerMenuState?.({ hasScreenshots: false });
    }
  }, [addToast, refreshScreenshotCount]);

  const handleCopyLatestScreenshotPath = useCallback(async () => {
    if (!window.electronAPI?.getLatestScreenshotPath) return;
    const path = await window.electronAPI.getLatestScreenshotPath();
    if (path) {
      await navigator.clipboard.writeText(path);
      addToast('Screenshot path copied to clipboard', 'success');
    }
  }, [addToast]);

  // Refresh screenshot count when project changes
  useEffect(() => {
    if (projectRootPath) {
      void refreshScreenshotCount();
    }
  }, [projectRootPath, refreshScreenshotCount]);

  // Listen for screenshot capture events from main process
  useEffect(() => {
    if (!window.electronAPI?.onScreenshotCaptured) return;
    const removeListener = window.electronAPI.onScreenshotCaptured((data: { filename: string; filepath: string }) => {
      addToast(`Screenshot saved: ${data.filename}`, 'success');
      void refreshScreenshotCount();
    });
    return removeListener;
  }, [addToast, refreshScreenshotCount]);

  // Sync screenshot count to explorer menu state
  useEffect(() => {
    if (window.electronAPI?.updateExplorerMenuState) {
      window.electronAPI.updateExplorerMenuState({ hasScreenshots: screenshotCount > 0 });
    }
  }, [screenshotCount]);

  // Track game running state via IPC events
  useEffect(() => {
    if (!window.electronAPI) return;
    const removeStarted = window.electronAPI.onGameStarted(() => setIsGameRunning(true));
    const removeStopped = window.electronAPI.onGameStopped(() => {
      setIsGameRunning(false);
      void cleanupWarpTempFile();
    });
    const removeError = window.electronAPI.onGameError(() => {
      setIsGameRunning(false);
      void cleanupWarpTempFile();
    });
    return () => { removeStarted(); removeStopped(); removeError(); };
  }, [cleanupWarpTempFile]);

  // Auto-update notifications
  useEffect(() => {
    if (!window.electronAPI?.onUpdateAvailable) return;
    const removeAvailable = window.electronAPI.onUpdateAvailable((version: string) => {
      addToast(`Update v${version} is downloading in the background.`, 'info');
    });
    const removeNotAvailable = window.electronAPI.onUpdateNotAvailable?.(() => {
      addToast('Vangard Studio is up to date.', 'info');
    });
    const removeError = window.electronAPI.onUpdateError?.(() => {
      addToast('Could not check for updates. Check your connection and try again.', 'error');
    });
    const removeDownloaded = window.electronAPI.onUpdateDownloaded((version: string) => {
      addToast(`Update v${version} ready — restart Vangard Studio to install.`, 'success');
    });
    return () => {
      removeAvailable();
      removeNotAvailable?.();
      removeError?.();
      removeDownloaded();
    };
  }, [addToast]);

  return {
    isGameRunning,
    screenshotCount,
    handleRunGame,
    handleOpenScreenshotsFolder,
    handleClearScreenshots,
    handleCopyLatestScreenshotPath,
  };
}
