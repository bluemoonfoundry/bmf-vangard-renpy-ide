import { useCallback, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Block, EditorTab, FileSystemTreeNode, Position } from '@/types';

export interface UntitledFileState {
  title: string;
  content: string;
  isDirty: boolean;
}

export interface UseUntitledFilesProps {
  projectRootPath: string | null;
  blocks: Block[];
  addBlock: (filePath: string, content: string, initialPosition?: Position, options?: { markDirty?: boolean }) => string;
  updateBlock: (id: string, data: Partial<Block>) => void;
  setFileSystemTree: Dispatch<SetStateAction<FileSystemTreeNode | null>>;
  addToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  activePaneId: 'primary' | 'secondary';
  splitLayout: 'none' | 'right' | 'bottom';
  setOpenTabs: Dispatch<SetStateAction<EditorTab[]>>;
  setActiveTabId: Dispatch<SetStateAction<string>>;
  setSecondaryOpenTabs: Dispatch<SetStateAction<EditorTab[]>>;
  setSecondaryActiveTabId: Dispatch<SetStateAction<string>>;
  setActivePaneId: Dispatch<SetStateAction<'primary' | 'secondary'>>;
  setSplitLayout: Dispatch<SetStateAction<'none' | 'right' | 'bottom'>>;
}

export interface UseUntitledFilesReturn {
  untitledFiles: Map<string, UntitledFileState>;
  createUntitledFile: () => void;
  updateUntitledContent: (tabId: string, content: string) => void;
  setUntitledDirty: (tabId: string, isDirty: boolean) => void;
  saveUntitledFile: (tabId: string, liveContent?: string) => Promise<void>;
}

/**
 * Converts an absolute path chosen via a native save dialog into a path
 * relative to the project root (e.g. "game/script.rpy"), matching the
 * format Block.filePath uses elsewhere. Only ever called with a path the
 * backend's fs:writeFile guard already accepted, so it's always inside root.
 */
export function toProjectRelativePath(absolutePath: string, projectRoot: string): string {
  const normalize = (p: string) => p.replace(/\\/g, '/').replace(/\/+$/, '');
  const root = normalize(projectRoot);
  const abs = normalize(absolutePath);
  if (abs.toLowerCase() === root.toLowerCase()) return '';
  if (abs.toLowerCase().startsWith(`${root.toLowerCase()}/`)) {
    return abs.slice(root.length + 1);
  }
  return abs;
}

export function useUntitledFiles({
  projectRootPath, blocks, addBlock, updateBlock, setFileSystemTree, addToast,
  activePaneId, splitLayout,
  setOpenTabs, setActiveTabId, setSecondaryOpenTabs, setSecondaryActiveTabId,
  setActivePaneId, setSplitLayout,
}: UseUntitledFilesProps): UseUntitledFilesReturn {
  const [untitledFiles, setUntitledFiles] = useState<Map<string, UntitledFileState>>(new Map());
  const counterRef = useRef(0);

  const createUntitledFile = useCallback(() => {
    if (!projectRootPath) {
      addToast('Open a project before creating a new file', 'warning');
      return;
    }
    counterRef.current += 1;
    const title = `Untitled-${counterRef.current}`;
    const tabId = `untitled-${Date.now()}-${counterRef.current}`;

    setUntitledFiles(prev => {
      const next = new Map(prev);
      next.set(tabId, { title, content: '', isDirty: false });
      return next;
    });

    const newTab: EditorTab = { id: tabId, type: 'untitled', title };
    if (activePaneId === 'secondary' && splitLayout !== 'none') {
      setSecondaryOpenTabs(prev => [...prev, newTab]);
      setSecondaryActiveTabId(tabId);
    } else {
      setOpenTabs(prev => [...prev, newTab]);
      setActiveTabId(tabId);
    }
  }, [projectRootPath, addToast, activePaneId, splitLayout, setOpenTabs, setActiveTabId, setSecondaryOpenTabs, setSecondaryActiveTabId]);

  const updateUntitledContent = useCallback((tabId: string, content: string) => {
    setUntitledFiles(prev => {
      const existing = prev.get(tabId);
      if (!existing) return prev;
      const next = new Map(prev);
      next.set(tabId, { ...existing, content });
      return next;
    });
  }, []);

  const setUntitledDirty = useCallback((tabId: string, isDirty: boolean) => {
    setUntitledFiles(prev => {
      const existing = prev.get(tabId);
      if (!existing || existing.isDirty === isDirty) return prev;
      const next = new Map(prev);
      next.set(tabId, { ...existing, isDirty });
      return next;
    });
  }, []);

  const saveUntitledFile = useCallback(async (tabId: string, liveContent?: string) => {
    const draft = untitledFiles.get(tabId);
    if (!draft || !window.electronAPI || !projectRootPath) return;
    const content = liveContent ?? draft.content;

    const defaultPath = `${projectRootPath.replace(/[\\/]+$/, '')}/game`;
    const chosenPath = await window.electronAPI.showSaveDialog({
      title: 'Save File',
      defaultPath,
      filters: [
        { name: "Ren'Py Script", extensions: ['rpy'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });
    if (!chosenPath) return;

    const res = await window.electronAPI.writeFile(chosenPath, content);
    if (!res.success) {
      addToast(`Failed to save file: ${res.error || 'Unknown error'}`, 'error');
      return;
    }

    const relativePath = toProjectRelativePath(chosenPath, projectRootPath);
    const isScript = relativePath.endsWith('.rpy');

    let targetTabId: string | null = null;
    if (isScript) {
      const existingBlock = blocks.find(b => b.filePath === relativePath);
      if (existingBlock) {
        updateBlock(existingBlock.id, { content });
        targetTabId = existingBlock.id;
      } else {
        targetTabId = addBlock(relativePath, content, undefined, { markDirty: false });
      }

      const swapTab = (t: EditorTab): EditorTab =>
        t.id === tabId ? { id: targetTabId!, type: 'editor', blockId: targetTabId! } : t;
      setOpenTabs(prev => prev.map(swapTab));
      setActiveTabId(prev => (prev === tabId ? targetTabId! : prev));
      setSecondaryOpenTabs(prev => prev.map(swapTab));
      setSecondaryActiveTabId(prev => (prev === tabId ? targetTabId! : prev));
    } else {
      // Non-.rpy files aren't collected as blocks on project load (see electron.js),
      // so registering one here would create a block/tab that vanishes on reload.
      // Write succeeded, but just close the tab rather than convert it to a phantom block,
      // picking a fallback active tab the same way useTabLifecycle's handleCloseTab does
      // (the tab that took this one's place, or the one before it, or none).
      setOpenTabs(prev => {
        const closedIdx = prev.findIndex(t => t.id === tabId);
        const next = prev.filter(t => t.id !== tabId);
        if (closedIdx !== -1) {
          const fallback = next[closedIdx] ?? next[closedIdx - 1] ?? next[0];
          setActiveTabId(prevActive => (prevActive === tabId ? (fallback?.id ?? '') : prevActive));
        }
        return next;
      });
      setSecondaryOpenTabs(prev => {
        const closedIdx = prev.findIndex(t => t.id === tabId);
        const next = prev.filter(t => t.id !== tabId);
        if (closedIdx !== -1) {
          if (next.length === 0) {
            setSplitLayout('none');
            setActivePaneId('primary');
            setSecondaryActiveTabId('');
          } else {
            const fallback = next[closedIdx] ?? next[closedIdx - 1] ?? next[0];
            setSecondaryActiveTabId(prevActive => (prevActive === tabId ? (fallback?.id ?? '') : prevActive));
          }
        }
        return next;
      });
    }

    setUntitledFiles(prev => {
      const next = new Map(prev);
      next.delete(tabId);
      return next;
    });

    try {
      const projData = await window.electronAPI.loadProject(projectRootPath);
      setFileSystemTree(projData.tree);
    } catch {
      // Tree refresh is best-effort — the file is already written and tracked as a block.
    }

    addToast(`Saved ${relativePath}`, 'success');
  }, [untitledFiles, projectRootPath, blocks, addBlock, updateBlock, addToast, setFileSystemTree, setOpenTabs, setActiveTabId, setSecondaryOpenTabs, setSecondaryActiveTabId, setActivePaneId, setSplitLayout]);

  return { untitledFiles, createUntitledFile, updateUntitledContent, setUntitledDirty, saveUntitledFile };
}
