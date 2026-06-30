import { useState, useRef, useEffect, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface UseLoadingStateParams {
  isWorkerPending: boolean;
  addToast: (message: string, type: ToastType) => void;
}

export function useLoadingState({ isWorkerPending, addToast }: UseLoadingStateParams) {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialAnalysisPending, setIsInitialAnalysisPending] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadCancelRef = useRef(false);

  // Latches to true once the analysis worker starts after a project load.
  // Prevents the overlay from closing during the one-render gap between
  // debouncedBlocks updating and the worker actually posting.
  const analysisWorkerHasStartedRef = useRef(false);

  useEffect(() => {
    if (!isInitialAnalysisPending) {
      analysisWorkerHasStartedRef.current = false;
      return;
    }
    if (isWorkerPending) {
      analysisWorkerHasStartedRef.current = true;
    } else if (analysisWorkerHasStartedRef.current) {
      setIsInitialAnalysisPending(false);
    }
  }, [isWorkerPending, isInitialAnalysisPending]);

  const handleCancelLoad = useCallback(() => {
    loadCancelRef.current = true;
    window.electronAPI?.cancelProjectLoad?.();
    setIsLoading(false);
    setLoadingMessage('');
    setLoadingProgress(0);
    addToast('Project loading cancelled.', 'info');
  }, [addToast]);

  return {
    isLoading, setIsLoading,
    isInitialAnalysisPending, setIsInitialAnalysisPending,
    loadingMessage, setLoadingMessage,
    loadingProgress, setLoadingProgress,
    loadCancelRef,
    handleCancelLoad,
  };
}
