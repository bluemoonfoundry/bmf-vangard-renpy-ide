import { useCallback, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { EditorTab, FileSystemTreeNode, Position } from '@/types';

export interface UntitledFileState {
  title: string;
  content: string;
  isDirty: boolean;
}

export interface UseUntitledFilesProps {
  projectRootPath: string | null;
  addBlock: (filePath: string, content: string, initialPosition?: Position, options?: { markDirty?: boolean }) => string;
  setFileSystemTree: Dispatch<SetStateAction<FileSystemTreeNode | null>>;
  addToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  activePaneId: 'primary' | 'secondary';
  splitLayout: 'none' | 'right' | 'bottom';
  setOpenTabs: Dispatch<SetStateAction<EditorTab[]>>;
  setActiveTabId: Dispatch<SetStateAction<string>>;
  setSecondaryOpenTabs: Dispatch<SetStateAction<EditorTab[]>>;
  setSecondaryActiveTabId: Dispatch<SetStateAction<string>>;
}

export interface UseUntitledFilesReturn {
  untitledFiles: Map<string, UntitledFileState>;
  createUntitledFile: () => void;
  updateUntitledContent: (tabId: string, content: string) => void;
  setUntitledDirty: (tabId: string, isDirty: boolean) => void;
  saveUntitledFile: (tabId: string) => Promise<void>;
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
  projectRootPath, addBlock, setFileSystemTree, addToast,
  activePaneId, splitLayout,
  setOpenTabs, setActiveTabId, setSecondaryOpenTabs, setSecondaryActiveTabId,
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

  const saveUntitledFile = useCallback(async (tabId: string) => {
    const draft = untitledFiles.get(tabId);
    if (!draft || !window.electronAPI || !projectRootPath) return;

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

    const res = await window.electronAPI.writeFile(chosenPath, draft.content);
    if (!res.success) {
      addToast(`Failed to save file: ${res.error || 'Unknown error'}`, 'error');
      return;
    }

    const relativePath = toProjectRelativePath(chosenPath, projectRootPath);
    const newBlockId = addBlock(relativePath, draft.content, undefined, { markDirty: false });

    const swapTab = (t: EditorTab): EditorTab =>
      t.id === tabId ? { id: newBlockId, type: 'editor', blockId: newBlockId } : t;
    setOpenTabs(prev => prev.map(swapTab));
    setActiveTabId(prev => (prev === tabId ? newBlockId : prev));
    setSecondaryOpenTabs(prev => prev.map(swapTab));
    setSecondaryActiveTabId(prev => (prev === tabId ? newBlockId : prev));

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
  }, [untitledFiles, projectRootPath, addBlock, addToast, setFileSystemTree, setOpenTabs, setActiveTabId, setSecondaryOpenTabs, setSecondaryActiveTabId]);

  return { untitledFiles, createUntitledFile, updateUntitledContent, setUntitledDirty, saveUntitledFile };
}
