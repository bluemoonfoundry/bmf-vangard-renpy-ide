import { useCallback } from 'react';
import type { MutableRefObject, Dispatch, SetStateAction } from 'react';
import type { Block, EditorTab } from '@/types';

export interface UseTabOpenersProps {
  blocksRef: MutableRefObject<Block[]>;
  openTabs: EditorTab[];
  secondaryOpenTabs: EditorTab[];
  activePaneId: 'primary' | 'secondary';
  splitLayout: 'none' | 'right' | 'bottom';
  /** Tabs currently detached into their own window -- consulted so re-requesting one
   *  of these focuses its window instead of creating a duplicate tab/editor instance
   *  in the main window. */
  poppedOutTabs: Map<string, { tab: EditorTab; paneId: 'primary' | 'secondary'; index: number }>;
  setOpenTabs: Dispatch<SetStateAction<EditorTab[]>>;
  setSecondaryOpenTabs: Dispatch<SetStateAction<EditorTab[]>>;
  setActiveTabId: Dispatch<SetStateAction<string>>;
  setSecondaryActiveTabId: Dispatch<SetStateAction<string>>;
  setActivePaneId: Dispatch<SetStateAction<'primary' | 'secondary'>>;
}

/** window:popout-tab focuses the existing popout window (rather than creating a
 *  second one) whenever it's called again for a tabId that's already popped out --
 *  see electron.js's 'window:popout-tab' handler. */
function focusPoppedOutTab(tab: EditorTab): void {
  void window.electronAPI?.popoutTab?.(tab.id, tab.type);
}

export interface UseTabOpenersReturn {
  handleOpenEditor: (blockId: string, line?: number) => void;
  handleOpenStaticTab: (type: 'canvas' | 'route-canvas' | 'choice-canvas' | 'notecard-canvas' | 'diagnostics' | 'stats' | 'translations' | 'screen-preview') => void;
  handleOpenRouteCanvasTab: () => void;
  handleOpenChoiceCanvasTab: () => void;
  handleOpenImageEditorTab: (filePath: string) => void;
  handleOpenMarkdownTab: (filePath: string) => void;
  handleOpenAudioEditorInTab: (filePath: string) => void;
  handlePathDoubleClick: (filePath: string) => void;
}

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

export function useTabOpeners({
  blocksRef,
  openTabs, secondaryOpenTabs, activePaneId, splitLayout, poppedOutTabs,
  setOpenTabs, setSecondaryOpenTabs,
  setActiveTabId, setSecondaryActiveTabId, setActivePaneId,
}: UseTabOpenersProps): UseTabOpenersReturn {

  const handleOpenStaticTab = useCallback((type: 'canvas' | 'route-canvas' | 'choice-canvas' | 'notecard-canvas' | 'diagnostics' | 'stats' | 'translations' | 'screen-preview') => {
    const id = type;
    if (openTabs.find(t => t.id === id)) {
      setActiveTabId(id);
      setActivePaneId('primary');
      return;
    }
    if (secondaryOpenTabs.find(t => t.id === id)) {
      setSecondaryActiveTabId(id);
      setActivePaneId('secondary');
      return;
    }
    const popped = poppedOutTabs.get(id);
    if (popped) { focusPoppedOutTab(popped.tab); return; }
    if (activePaneId === 'secondary' && splitLayout !== 'none') {
      setSecondaryOpenTabs(prev => [...prev, { id, type }]);
      setSecondaryActiveTabId(id);
    } else {
      setOpenTabs(prev => [...prev, { id, type }]);
      setActiveTabId(id);
    }
  }, [openTabs, secondaryOpenTabs, poppedOutTabs, activePaneId, splitLayout,
      setActiveTabId, setActivePaneId, setOpenTabs, setSecondaryActiveTabId, setSecondaryOpenTabs]);

  const handleOpenRouteCanvasTab = useCallback(
    () => handleOpenStaticTab('route-canvas'),
    [handleOpenStaticTab]
  );

  const handleOpenChoiceCanvasTab = useCallback(
    () => handleOpenStaticTab('choice-canvas'),
    [handleOpenStaticTab]
  );

  const handleOpenEditor = useCallback((blockId: string, line?: number) => {
    const block = blocksRef.current.find(b => b.id === blockId);
    if (!block) return;

    if (openTabs.find(t => t.id === blockId)) {
      if (line) setOpenTabs(prev => prev.map(t => t.id === blockId ? { ...t, scrollRequest: { line, key: Date.now() } } : t));
      setActiveTabId(blockId);
      setActivePaneId('primary');
      return;
    }
    if (secondaryOpenTabs.find(t => t.id === blockId)) {
      if (line) setSecondaryOpenTabs(prev => prev.map(t => t.id === blockId ? { ...t, scrollRequest: { line, key: Date.now() } } : t));
      setSecondaryActiveTabId(blockId);
      setActivePaneId('secondary');
      return;
    }
    const popped = poppedOutTabs.get(blockId);
    if (popped) { focusPoppedOutTab(popped.tab); return; }
    const newTab: EditorTab = { id: blockId, type: 'editor', blockId, filePath: block.filePath, scrollRequest: line ? { line, key: Date.now() } : undefined };
    if (activePaneId === 'secondary' && splitLayout !== 'none') {
      setSecondaryOpenTabs(prev => [...prev, newTab]);
      setSecondaryActiveTabId(blockId);
    } else {
      setOpenTabs(prev => [...prev, newTab]);
      setActiveTabId(blockId);
    }
  }, [blocksRef, openTabs, secondaryOpenTabs, poppedOutTabs, activePaneId, splitLayout,
      setActiveTabId, setActivePaneId, setOpenTabs, setSecondaryActiveTabId, setSecondaryOpenTabs]);

  const handleOpenImageEditorTab = useCallback((filePath: string) => {
    const tabId = `img-${filePath}`;
    if (openTabs.find(t => t.id === tabId)) { setActiveTabId(tabId); setActivePaneId('primary'); return; }
    if (secondaryOpenTabs.find(t => t.id === tabId)) { setSecondaryActiveTabId(tabId); setActivePaneId('secondary'); return; }
    const popped = poppedOutTabs.get(tabId);
    if (popped) { focusPoppedOutTab(popped.tab); return; }
    const newTab: EditorTab = { id: tabId, type: 'image', filePath };
    if (activePaneId === 'secondary' && splitLayout !== 'none') {
      setSecondaryOpenTabs(prev => [...prev, newTab]);
      setSecondaryActiveTabId(tabId);
    } else {
      setOpenTabs(prev => [...prev, newTab]);
      setActiveTabId(tabId);
    }
  }, [openTabs, secondaryOpenTabs, poppedOutTabs, activePaneId, splitLayout,
      setActiveTabId, setActivePaneId, setOpenTabs, setSecondaryActiveTabId, setSecondaryOpenTabs]);

  const handleOpenMarkdownTab = useCallback((filePath: string) => {
    const tabId = `md-${filePath}`;
    if (openTabs.find(t => t.id === tabId)) { setActiveTabId(tabId); setActivePaneId('primary'); return; }
    if (secondaryOpenTabs.find(t => t.id === tabId)) { setSecondaryActiveTabId(tabId); setActivePaneId('secondary'); return; }
    const popped = poppedOutTabs.get(tabId);
    if (popped) { focusPoppedOutTab(popped.tab); return; }
    const newTab: EditorTab = { id: tabId, type: 'markdown', filePath };
    if (activePaneId === 'secondary' && splitLayout !== 'none') {
      setSecondaryOpenTabs(prev => [...prev, newTab]);
      setSecondaryActiveTabId(tabId);
    } else {
      setOpenTabs(prev => [...prev, newTab]);
      setActiveTabId(tabId);
    }
  }, [openTabs, secondaryOpenTabs, poppedOutTabs, activePaneId, splitLayout,
      setActiveTabId, setActivePaneId, setOpenTabs, setSecondaryActiveTabId, setSecondaryOpenTabs]);

  const handleOpenAudioEditorInTab = useCallback((filePath: string) => {
    const tabId = `aud-${filePath}`;
    const popped = poppedOutTabs.get(tabId);
    if (popped) { focusPoppedOutTab(popped.tab); return; }
    setOpenTabs(prev => prev.find(t => t.id === tabId) ? prev : [...prev, { id: tabId, type: 'audio' as const, filePath }]);
    setActiveTabId(tabId);
  }, [poppedOutTabs, setActiveTabId, setOpenTabs]);

  const handlePathDoubleClick = useCallback((filePath: string) => {
    const lowerFilePath = filePath.toLowerCase();
    if (lowerFilePath.endsWith('.rpy')) {
      const block = blocksRef.current.find(b => b.filePath === filePath);
      if (block) handleOpenEditor(block.id);
    } else if (IMAGE_EXTENSIONS.some(ext => lowerFilePath.endsWith(ext))) {
      handleOpenImageEditorTab(filePath);
    } else if (lowerFilePath.endsWith('.md')) {
      handleOpenMarkdownTab(filePath);
    }
  }, [blocksRef, handleOpenEditor, handleOpenImageEditorTab, handleOpenMarkdownTab]);

  return {
    handleOpenEditor,
    handleOpenStaticTab,
    handleOpenRouteCanvasTab,
    handleOpenChoiceCanvasTab,
    handleOpenImageEditorTab,
    handleOpenMarkdownTab,
    handleOpenAudioEditorInTab,
    handlePathDoubleClick,
  };
}
