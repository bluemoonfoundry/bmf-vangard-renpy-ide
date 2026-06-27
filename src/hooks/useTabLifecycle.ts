import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { EditorTab } from '@/types';

export interface UseTabLifecycleProps {
  // Tab state
  openTabs: EditorTab[];
  secondaryOpenTabs: EditorTab[];
  activeTabId: string;
  secondaryActiveTabId: string;
  splitLayout: 'none' | 'right' | 'bottom';
  draggedTabId: string | null;
  dragSourcePaneId: 'primary' | 'secondary';
  // Tab setters
  setOpenTabs: Dispatch<SetStateAction<EditorTab[]>>;
  setSecondaryOpenTabs: Dispatch<SetStateAction<EditorTab[]>>;
  setActiveTabId: Dispatch<SetStateAction<string>>;
  setSecondaryActiveTabId: Dispatch<SetStateAction<string>>;
  setActivePaneId: Dispatch<SetStateAction<'primary' | 'secondary'>>;
  setSplitLayout: Dispatch<SetStateAction<'none' | 'right' | 'bottom'>>;
  setSplitPrimarySize: Dispatch<SetStateAction<number>>;
  setDraggedTabId: Dispatch<SetStateAction<string | null>>;
  setDragSourcePaneId: Dispatch<SetStateAction<'primary' | 'secondary'>>;
  // Dirty tracking
  dirtyBlockIds: Set<string>;
  dirtyEditors: Set<string>;
  setDirtyBlockIds: Dispatch<SetStateAction<Set<string>>>;
  setDirtyEditors: Dispatch<SetStateAction<Set<string>>>;
  // Orchestration callbacks
  openUnsavedChangesModal: (opts: {
    title: string;
    message: string;
    confirmText: string;
    dontSaveText: string;
    onConfirm: () => Promise<void>;
    onDontSave: () => void;
    onCancel: () => void;
  }) => void;
  closeUnsavedChangesModal: () => void;
  handleSaveAll: () => Promise<void>;
  setHasUnsavedSettings: Dispatch<SetStateAction<boolean>>;
}

export interface UseTabLifecycleReturn {
  handleCloseTab: (tabId: string, paneId: 'primary' | 'secondary', e?: React.MouseEvent) => void;
  processTabCloseRequest: (tabsToClose: EditorTab[], fallbackTabId: string, paneId?: 'primary' | 'secondary') => void;
  handleCloseOthersRequest: (tabId: string, paneId?: 'primary' | 'secondary') => void;
  handleCloseAllRequest: (paneId?: 'primary' | 'secondary') => void;
  handleCloseLeftRequest: (tabId: string, paneId?: 'primary' | 'secondary') => void;
  handleCloseRightRequest: (tabId: string, paneId?: 'primary' | 'secondary') => void;
  handleSwitchTab: (tabId: string, paneId?: 'primary' | 'secondary') => void;
  handleCreateSplit: (direction: 'right' | 'bottom') => void;
  handleOpenInSplit: (tabId: string, direction: 'right' | 'bottom') => void;
  handleMoveToOtherPane: (tabId: string, fromPaneId: 'primary' | 'secondary') => void;
  handleCloseSecondaryPane: () => void;
  handleClosePrimaryPane: () => void;
  handleTabDragStart: (e: React.DragEvent<HTMLDivElement>, tabId: string, paneId?: 'primary' | 'secondary') => void;
  handleTabDragOver: (e: React.DragEvent<HTMLDivElement>, targetTabId: string) => void;
  handleTabDrop: (e: React.DragEvent<HTMLDivElement>, targetTabId: string | null, targetPaneId: 'primary' | 'secondary') => void;
}

export function useTabLifecycle({
  openTabs, secondaryOpenTabs,
  activeTabId, secondaryActiveTabId, splitLayout,
  draggedTabId, dragSourcePaneId,
  setOpenTabs, setSecondaryOpenTabs,
  setActiveTabId, setSecondaryActiveTabId, setActivePaneId,
  setSplitLayout, setSplitPrimarySize,
  setDraggedTabId, setDragSourcePaneId,
  dirtyBlockIds, dirtyEditors, setDirtyBlockIds, setDirtyEditors,
  openUnsavedChangesModal, closeUnsavedChangesModal,
  handleSaveAll, setHasUnsavedSettings,
}: UseTabLifecycleProps): UseTabLifecycleReturn {

  const handleCloseTab = useCallback((tabId: string, paneId: 'primary' | 'secondary', e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (paneId === 'primary') {
      setOpenTabs(prev => {
        const next = prev.filter(t => t.id !== tabId);
        if (activeTabId === tabId) {
          const closedIdx = prev.findIndex(t => t.id === tabId);
          const fallback = next[closedIdx] ?? next[closedIdx - 1] ?? next[0];
          setActiveTabId(fallback?.id ?? '');
        }
        return next;
      });
    } else {
      setSecondaryOpenTabs(prev => {
        const next = prev.filter(t => t.id !== tabId);
        if (next.length === 0) {
          setSplitLayout('none');
          setActivePaneId('primary');
          setSecondaryActiveTabId('');
        } else {
          if (secondaryActiveTabId === tabId) setSecondaryActiveTabId(next[next.length - 1].id);
        }
        return next;
      });
    }
  }, [activeTabId, secondaryActiveTabId, setActivePaneId, setActiveTabId, setOpenTabs, setSecondaryActiveTabId, setSecondaryOpenTabs, setSplitLayout]);

  const processTabCloseRequest = useCallback((tabsToClose: EditorTab[], fallbackTabId: string, paneId: 'primary' | 'secondary' = 'primary') => {
    if (tabsToClose.length === 0) return;

    const hasUnsaved = tabsToClose.some(t => t.blockId && (dirtyBlockIds.has(t.blockId) || dirtyEditors.has(t.blockId)));

    const performClose = () => {
      const idsToClose = new Set(tabsToClose.map(t => t.id));
      if (paneId === 'primary') {
        setOpenTabs(prev => {
          const next = prev.filter(t => !idsToClose.has(t.id));
          if (idsToClose.has(activeTabId)) {
            if (fallbackTabId && !idsToClose.has(fallbackTabId)) {
              setActiveTabId(fallbackTabId);
            } else {
              const closedIdx = prev.findIndex(t => t.id === activeTabId);
              const adjacent = next[closedIdx] ?? next[closedIdx - 1] ?? next[0];
              setActiveTabId(adjacent?.id ?? '');
            }
          }
          return next;
        });
      } else {
        setSecondaryOpenTabs(prev => {
          const next = prev.filter(t => !idsToClose.has(t.id));
          if (next.length === 0) { setSplitLayout('none'); setActivePaneId('primary'); setSecondaryActiveTabId(''); }
          else if (idsToClose.has(secondaryActiveTabId)) setSecondaryActiveTabId(next[0].id);
          return next;
        });
      }
    };

    if (hasUnsaved) {
      openUnsavedChangesModal({
        title: `Close ${tabsToClose.length > 1 ? 'Tabs' : 'Tab'}`,
        message: `You have unsaved changes in ${tabsToClose.length > 1 ? 'some tabs' : 'this tab'}. Do you want to save them before closing?`,
        confirmText: 'Save & Close',
        dontSaveText: "Don't Save & Close",
        onConfirm: async () => {
          await handleSaveAll();
          performClose();
          closeUnsavedChangesModal();
        },
        onDontSave: () => {
          const blockIdsToClean = tabsToClose.map(t => t.blockId).filter(Boolean) as string[];
          setDirtyBlockIds(prev => {
            const next = new Set(prev);
            blockIdsToClean.forEach(id => next.delete(id));
            return next;
          });
          setDirtyEditors(prev => {
            const next = new Set(prev);
            blockIdsToClean.forEach(id => next.delete(id));
            return next;
          });
          performClose();
          closeUnsavedChangesModal();
        },
        onCancel: () => {
          closeUnsavedChangesModal();
        }
      });
    } else {
      performClose();
    }
  }, [dirtyBlockIds, dirtyEditors, activeTabId, secondaryActiveTabId, handleSaveAll, openUnsavedChangesModal, closeUnsavedChangesModal, setActivePaneId, setActiveTabId, setOpenTabs, setSecondaryActiveTabId, setSecondaryOpenTabs, setSplitLayout, setDirtyBlockIds, setDirtyEditors]);

  const handleCloseOthersRequest = useCallback((tabId: string, paneId: 'primary' | 'secondary' = 'primary') => {
    const tabs = paneId === 'primary' ? openTabs : secondaryOpenTabs;
    processTabCloseRequest(tabs.filter(t => t.id !== tabId), tabId, paneId);
  }, [openTabs, secondaryOpenTabs, processTabCloseRequest]);

  const handleCloseAllRequest = useCallback((paneId: 'primary' | 'secondary' = 'primary') => {
    const tabs = paneId === 'primary' ? openTabs : secondaryOpenTabs;
    processTabCloseRequest([...tabs], '', paneId);
  }, [openTabs, secondaryOpenTabs, processTabCloseRequest]);

  const handleCloseLeftRequest = useCallback((tabId: string, paneId: 'primary' | 'secondary' = 'primary') => {
    const tabs = paneId === 'primary' ? openTabs : secondaryOpenTabs;
    const index = tabs.findIndex(t => t.id === tabId);
    if (index === -1) return;
    processTabCloseRequest(tabs.slice(0, index), tabId, paneId);
  }, [openTabs, secondaryOpenTabs, processTabCloseRequest]);

  const handleCloseRightRequest = useCallback((tabId: string, paneId: 'primary' | 'secondary' = 'primary') => {
    const tabs = paneId === 'primary' ? openTabs : secondaryOpenTabs;
    const index = tabs.findIndex(t => t.id === tabId);
    if (index === -1) return;
    processTabCloseRequest(tabs.slice(index + 1), tabId, paneId);
  }, [openTabs, secondaryOpenTabs, processTabCloseRequest]);

  const handleSwitchTab = useCallback((tabId: string, paneId: 'primary' | 'secondary' = 'primary') => {
    if (paneId === 'primary') { setActiveTabId(tabId); setActivePaneId('primary'); }
    else { setSecondaryActiveTabId(tabId); setActivePaneId('secondary'); }
  }, [setActiveTabId, setActivePaneId, setSecondaryActiveTabId]);

  const handleCreateSplit = useCallback((direction: 'right' | 'bottom') => {
    if (splitLayout !== 'none') return;
    const activeTab = openTabs.find(t => t.id === activeTabId);
    if (!activeTab) return;
    const remaining = openTabs.filter(t => t.id !== activeTabId);
    setOpenTabs(remaining);
    if (remaining.length > 0) {
      const fallback = remaining.find(t => t.type === 'canvas') ?? remaining[0];
      setActiveTabId(fallback.id);
    }
    setSecondaryOpenTabs([activeTab]);
    setSecondaryActiveTabId(activeTab.id);
    setSplitLayout(direction);
    setSplitPrimarySize(direction === 'right' ? 600 : 400);
    setActivePaneId('secondary');
  }, [splitLayout, openTabs, activeTabId, setActivePaneId, setActiveTabId, setOpenTabs, setSecondaryActiveTabId, setSecondaryOpenTabs, setSplitLayout, setSplitPrimarySize]);

  const handleOpenInSplit = useCallback((tabId: string, direction: 'right' | 'bottom') => {
    const tab = openTabs.find(t => t.id === tabId);
    if (!tab) return;
    if (splitLayout !== 'none') {
      if (!secondaryOpenTabs.find(t => t.id === tabId)) setSecondaryOpenTabs(prev => [...prev, tab]);
      setSecondaryActiveTabId(tabId);
      setOpenTabs(prev => prev.filter(t => t.id !== tabId));
      if (activeTabId === tabId) setActiveTabId('canvas');
      setActivePaneId('secondary');
      return;
    }
    setOpenTabs(prev => prev.filter(t => t.id !== tabId));
    if (activeTabId === tabId) setActiveTabId('canvas');
    setSecondaryOpenTabs([tab]);
    setSecondaryActiveTabId(tabId);
    setSplitLayout(direction);
    setSplitPrimarySize(direction === 'right' ? 600 : 400);
    setActivePaneId('secondary');
  }, [openTabs, activeTabId, secondaryOpenTabs, splitLayout, setActivePaneId, setActiveTabId, setOpenTabs, setSecondaryActiveTabId, setSecondaryOpenTabs, setSplitLayout, setSplitPrimarySize]);

  const handleMoveToOtherPane = useCallback((tabId: string, fromPaneId: 'primary' | 'secondary') => {
    if (fromPaneId === 'primary') {
      const tab = openTabs.find(t => t.id === tabId);
      if (!tab) return;
      setOpenTabs(prev => prev.filter(t => t.id !== tabId));
      if (activeTabId === tabId) setActiveTabId('canvas');
      if (!secondaryOpenTabs.find(t => t.id === tabId)) setSecondaryOpenTabs(prev => [...prev, tab]);
      setSecondaryActiveTabId(tabId);
      setActivePaneId('secondary');
    } else {
      const tab = secondaryOpenTabs.find(t => t.id === tabId);
      if (!tab) return;
      const newSecondary = secondaryOpenTabs.filter(t => t.id !== tabId);
      if (newSecondary.length === 0) {
        setSecondaryOpenTabs([]);
        setSecondaryActiveTabId('');
        setSplitLayout('none');
        setActivePaneId('primary');
      } else {
        setSecondaryOpenTabs(newSecondary);
        if (secondaryActiveTabId === tabId) setSecondaryActiveTabId(newSecondary[0].id);
      }
      if (!openTabs.find(t => t.id === tabId)) setOpenTabs(prev => [...prev, tab]);
      setActiveTabId(tabId);
      setActivePaneId('primary');
    }
  }, [openTabs, activeTabId, secondaryOpenTabs, secondaryActiveTabId, setActivePaneId, setActiveTabId, setOpenTabs, setSecondaryActiveTabId, setSecondaryOpenTabs, setSplitLayout]);

  const handleCloseSecondaryPane = useCallback(() => {
    if (secondaryOpenTabs.length > 0) {
      setOpenTabs(prev => {
        const existingIds = new Set(prev.map(t => t.id));
        const toAdd = secondaryOpenTabs.filter(t => !existingIds.has(t.id));
        return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
      });
    }
    setSecondaryOpenTabs([]);
    setSecondaryActiveTabId('');
    setSplitLayout('none');
    setActivePaneId('primary');
  }, [secondaryOpenTabs, setActivePaneId, setOpenTabs, setSecondaryActiveTabId, setSecondaryOpenTabs, setSplitLayout]);

  const handleClosePrimaryPane = useCallback(() => {
    const existingIds = new Set(secondaryOpenTabs.map(t => t.id));
    const uniquePrimaryTabs = openTabs.filter(t => !existingIds.has(t.id));
    setOpenTabs([...secondaryOpenTabs, ...uniquePrimaryTabs]);
    setActiveTabId(secondaryActiveTabId || secondaryOpenTabs[0]?.id || 'canvas');
    setSecondaryOpenTabs([]);
    setSecondaryActiveTabId('');
    setSplitLayout('none');
    setActivePaneId('primary');
  }, [openTabs, secondaryOpenTabs, secondaryActiveTabId, setActivePaneId, setActiveTabId, setOpenTabs, setSecondaryActiveTabId, setSecondaryOpenTabs, setSplitLayout]);

  const handleTabDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, tabId: string, paneId: 'primary' | 'secondary' = 'primary') => {
    setDraggedTabId(tabId);
    setDragSourcePaneId(paneId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', tabId);
  }, [setDraggedTabId, setDragSourcePaneId]);

  const handleTabDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, targetTabId: string) => {
    e.preventDefault();
    if (draggedTabId && draggedTabId !== targetTabId) {
      e.dataTransfer.dropEffect = 'move';
    }
  }, [draggedTabId]);

  const handleTabDrop = useCallback((e: React.DragEvent<HTMLDivElement>, targetTabId: string | null, targetPaneId: 'primary' | 'secondary') => {
    e.preventDefault();
    if (!draggedTabId) { setDraggedTabId(null); return; }
    const sourcePaneId = dragSourcePaneId;

    if (sourcePaneId === targetPaneId) {
      if (!targetTabId || draggedTabId === targetTabId) { setDraggedTabId(null); return; }
      const setTabs = targetPaneId === 'primary' ? setOpenTabs : setSecondaryOpenTabs;
      const tabs = targetPaneId === 'primary' ? openTabs : secondaryOpenTabs;
      const fromIndex = tabs.findIndex(t => t.id === draggedTabId);
      const toIndex = tabs.findIndex(t => t.id === targetTabId);
      if (fromIndex !== -1 && toIndex !== -1) {
        setTabs(prev => {
          const next = [...prev];
          const [moved] = next.splice(fromIndex, 1);
          next.splice(toIndex, 0, moved);
          return next;
        });
        setHasUnsavedSettings(true);
      }
      setDraggedTabId(null);
      return;
    }

    const sourceTabs = sourcePaneId === 'primary' ? openTabs : secondaryOpenTabs;
    const targetTabs = targetPaneId === 'primary' ? openTabs : secondaryOpenTabs;
    const tab = sourceTabs.find(t => t.id === draggedTabId);
    if (!tab) { setDraggedTabId(null); return; }

    const newSourceTabs = sourceTabs.filter(t => t.id !== draggedTabId);
    if (sourcePaneId === 'primary') {
      setOpenTabs(newSourceTabs);
      if (activeTabId === draggedTabId) {
        const fallback = newSourceTabs.find(t => t.type === 'canvas') ?? newSourceTabs[0];
        if (fallback) setActiveTabId(fallback.id);
      }
    } else {
      if (newSourceTabs.length === 0) {
        setSecondaryOpenTabs([]);
        setSecondaryActiveTabId('');
        setSplitLayout('none');
        setActivePaneId('primary');
      } else {
        setSecondaryOpenTabs(newSourceTabs);
        if (secondaryActiveTabId === draggedTabId) setSecondaryActiveTabId(newSourceTabs[0].id);
      }
    }

    const insertAt = targetTabId !== null ? targetTabs.findIndex(t => t.id === targetTabId) : -1;
    if (targetPaneId === 'primary') {
      setOpenTabs(prev => {
        const next = [...prev];
        next.splice(insertAt >= 0 ? insertAt : next.length, 0, tab);
        return next;
      });
      setActiveTabId(tab.id);
    } else {
      setSecondaryOpenTabs(prev => {
        const next = [...prev];
        next.splice(insertAt >= 0 ? insertAt : next.length, 0, tab);
        return next;
      });
      setSecondaryActiveTabId(tab.id);
    }

    setActivePaneId(targetPaneId);
    setHasUnsavedSettings(true);
    setDraggedTabId(null);
  }, [draggedTabId, dragSourcePaneId, openTabs, secondaryOpenTabs, activeTabId, secondaryActiveTabId, setOpenTabs, setSecondaryOpenTabs, setActiveTabId, setSecondaryActiveTabId, setSplitLayout, setActivePaneId, setDraggedTabId, setHasUnsavedSettings]);

  return {
    handleCloseTab,
    processTabCloseRequest,
    handleCloseOthersRequest,
    handleCloseAllRequest,
    handleCloseLeftRequest,
    handleCloseRightRequest,
    handleSwitchTab,
    handleCreateSplit,
    handleOpenInSplit,
    handleMoveToOtherPane,
    handleCloseSecondaryPane,
    handleClosePrimaryPane,
    handleTabDragStart,
    handleTabDragOver,
    handleTabDrop,
  };
}
