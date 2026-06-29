import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { BlockType } from '@/components/CreateBlockModal';
import type {
  Block, BlockGroup, Position, EditorTab, FileSystemTreeNode, AppSettings, ProjectSettings,
} from '@/types';
import type { CanvasTransform, CenterOnBlockRequest, FlashBlockRequest } from '@/hooks/useCanvasInteraction';
import { buildNewBlockContent } from '@/lib/blockContent';
import { formatErrorMessage } from '@/lib/formatErrorMessage';
import { logger } from '@/lib/logger';

type ProjectSettingsSlice = Omit<ProjectSettings,
  'openTabs' | 'activeTabId' | 'stickyNotes' | 'characterProfiles' | 'punchlistMetadata' |
  'diagnosticsTasks' | 'ignoredDiagnostics' | 'sceneCompositions' | 'sceneNames' |
  'scannedImagePaths' | 'scannedAudioPaths'>;

export interface UseBlockManagementParams {
  blocks: Block[];
  setBlocks: Dispatch<SetStateAction<Block[]>>;
  setGroups: (f: (draft: BlockGroup[]) => void) => void;
  setDirtyBlockIds: Dispatch<SetStateAction<Set<string>>>;
  updateProjectSettings: (updater: (draft: ProjectSettingsSlice) => void) => void;
  setHasUnsavedSettings: Dispatch<SetStateAction<boolean>>;
  appSettings: AppSettings;
  storyCanvasTransform: CanvasTransform;
  setCenterOnBlockRequest: Dispatch<SetStateAction<CenterOnBlockRequest | null>>;
  setFlashBlockRequest: Dispatch<SetStateAction<FlashBlockRequest | null>>;
  setSelectedBlockIds: Dispatch<SetStateAction<string[]>>;
  activeTabId: string;
  setActiveTabId: Dispatch<SetStateAction<string>>;
  setOpenTabs: Dispatch<SetStateAction<EditorTab[]>>;
  fileSystemTree: FileSystemTreeNode | null;
  setFileSystemTree: Dispatch<SetStateAction<FileSystemTreeNode | null>>;
  projectRootPath: string | null;
  explorerSelectedPaths: Set<string>;
  openCreateBlockModal: (type: BlockType, position?: Position, folderPath?: string) => void;
  openDeleteConfirmModal: (paths: string[], onConfirm: () => void) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export interface UseBlockManagementReturn {
  updateBlock: (id: string, data: Partial<Block>) => void;
  updateGroup: (id: string, data: Partial<BlockGroup>) => void;
  updateBlockPositions: (updates: { id: string; position: Position }[]) => void;
  updateGroupPositions: (updates: { id: string; position: Position }[]) => void;
  addBlock: (filePath: string, content: string, initialPosition?: Position) => string;
  handleCreateBlockConfirm: (name: string, type: BlockType, folderPath: string, initialPosition?: Position) => Promise<void>;
  handleCreateBlockFromCanvas: (type: BlockType, position: Position) => void;
  deleteBlock: (id: string) => void;
  deleteBlockWithFile: (id: string) => Promise<void>;
  getSelectedFolderForNewBlock: () => string;
}

export function useBlockManagement({
  blocks, setBlocks, setGroups, setDirtyBlockIds,
  updateProjectSettings, setHasUnsavedSettings,
  appSettings, storyCanvasTransform,
  setCenterOnBlockRequest, setFlashBlockRequest, setSelectedBlockIds,
  activeTabId, setActiveTabId, setOpenTabs,
  fileSystemTree, setFileSystemTree,
  projectRootPath, explorerSelectedPaths,
  openCreateBlockModal, openDeleteConfirmModal,
  addToast,
}: UseBlockManagementParams): UseBlockManagementReturn {

  const updateBlock = useCallback((id: string, data: Partial<Block>) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
    if (data.content !== undefined) {
      setDirtyBlockIds(prev => new Set(prev).add(id));
    }
    if (data.position || data.width !== undefined || data.height !== undefined || data.color !== undefined) {
      updateProjectSettings(draft => {
        draft.storyCanvasLayoutWasUserAdjusted = true;
      });
      setHasUnsavedSettings(true);
    }
  }, [setBlocks, setDirtyBlockIds, updateProjectSettings, setHasUnsavedSettings]);

  const updateGroup = useCallback((id: string, data: Partial<BlockGroup>) => {
    setGroups(draft => {
      const idx = draft.findIndex(g => g.id === id);
      if (idx !== -1) Object.assign(draft[idx], data);
    });
  }, [setGroups]);

  const updateBlockPositions = useCallback((updates: { id: string; position: Position }[]) => {
    setBlocks(prev => {
      const next = [...prev];
      updates.forEach(u => {
        const idx = next.findIndex(b => b.id === u.id);
        if (idx !== -1) next[idx] = { ...next[idx], position: u.position };
      });
      return next;
    });
    updateProjectSettings(draft => {
      draft.storyCanvasLayoutWasUserAdjusted = true;
    });
    setHasUnsavedSettings(true);
  }, [setBlocks, updateProjectSettings, setHasUnsavedSettings]);

  const updateGroupPositions = useCallback((updates: { id: string; position: Position }[]) => {
    setGroups(draft => {
      updates.forEach(u => {
        const g = draft.find(g => g.id === u.id);
        if (g) g.position = u.position;
      });
    });
    updateProjectSettings(draft => {
      draft.storyCanvasLayoutWasUserAdjusted = true;
    });
    setHasUnsavedSettings(true);
  }, [setGroups, updateProjectSettings, setHasUnsavedSettings]);

  const addBlock = useCallback((filePath: string, content: string, initialPosition?: Position): string => {
    const id = `block-${Date.now()}`;
    const blockWidth = 320;
    const blockHeight = 200;

    let position: Position;

    if (initialPosition) {
      position = initialPosition;
    } else {
      const leftOffset = appSettings.isLeftSidebarOpen ? appSettings.leftSidebarWidth : 0;
      const rightOffset = appSettings.isRightSidebarOpen ? appSettings.rightSidebarWidth : 0;
      const topOffset = 64;

      const visibleWidth = window.innerWidth - leftOffset - rightOffset;
      const visibleHeight = window.innerHeight - topOffset;

      const screenCenterX = leftOffset + (visibleWidth / 2);
      const screenCenterY = topOffset + (visibleHeight / 2);

      const worldCenterX = (screenCenterX - storyCanvasTransform.x) / storyCanvasTransform.scale;
      const worldCenterY = (screenCenterY - storyCanvasTransform.y) / storyCanvasTransform.scale;

      position = {
        x: worldCenterX - (blockWidth / 2),
        y: worldCenterY - (blockHeight / 2),
      };
    }

    const newBlock: Block = {
      id,
      content,
      position,
      width: blockWidth,
      height: blockHeight,
      title: filePath.split('/').pop(),
      filePath,
    };

    setBlocks(prev => [...prev, newBlock]);
    setDirtyBlockIds(prev => new Set(prev).add(id));

    setSelectedBlockIds([id]);
    setFlashBlockRequest({ blockId: id, key: Date.now() });
    setCenterOnBlockRequest({ blockId: id, key: Date.now() });

    if (fileSystemTree && filePath) {
      setFileSystemTree(prev => {
        if (!prev) return null;
        const addToTree = (node: FileSystemTreeNode): FileSystemTreeNode => {
          const parts = filePath.split('/');
          if (parts.length === 1) {
            return { ...node, children: [...(node.children ?? []), { path: filePath, name: parts[0] }] };
          }
          return node;
        };
        return addToTree(prev);
      });
    }
    return id;
  }, [setBlocks, setDirtyBlockIds, fileSystemTree, storyCanvasTransform, appSettings,
      setCenterOnBlockRequest, setFileSystemTree, setFlashBlockRequest, setSelectedBlockIds]);

  const handleCreateBlockConfirm = useCallback(async (
    name: string, type: BlockType, folderPath: string, initialPosition?: Position,
  ) => {
    const safeName = name.replace(/\.rpy$/, '');
    const fileName = `${safeName}.rpy`;
    const content = buildNewBlockContent(safeName, type);

    if (window.electronAPI && projectRootPath) {
      try {
        const cleanFolderPath = folderPath.endsWith('/') ? folderPath.slice(0, -1) : folderPath;
        const relativePath = cleanFolderPath ? `${cleanFolderPath}/${fileName}` : fileName;
        const fullPath = await window.electronAPI.path.join(projectRootPath, cleanFolderPath, fileName) as string;

        const res = await window.electronAPI.writeFile(fullPath, content);
        if (res.success) {
          addBlock(relativePath, content, initialPosition);
          addToast(`Created ${fileName} in ${cleanFolderPath || 'root'}`, 'success');
          const projData = await window.electronAPI.loadProject(projectRootPath);
          setFileSystemTree(projData.tree);
        } else {
          const errorMsg = typeof res.error === 'string' ? res.error : 'Unknown error occurred during file creation';
          throw new Error(errorMsg);
        }
      } catch (e) {
        logger.error('File creation error', e);
        addToast(`Failed to create file: ${formatErrorMessage(e)}`, 'error');
      }
    } else {
      addBlock(fileName, content, initialPosition);
      addToast(`Created block ${fileName}`, 'success');
    }
  }, [addBlock, addToast, projectRootPath, setFileSystemTree]);

  const getSelectedFolderForNewBlock = useCallback((): string => {
    if (explorerSelectedPaths.size === 1) {
      const selectedPath = Array.from(explorerSelectedPaths)[0];
      if (!fileSystemTree) return 'game/';
      const findNode = (node: FileSystemTreeNode, targetPath: string): FileSystemTreeNode | null => {
        if (node.path === targetPath) return node;
        if (node.children) {
          for (const child of node.children) {
            const found = findNode(child, targetPath);
            if (found) return found;
          }
        }
        return null;
      };
      const node = findNode(fileSystemTree, selectedPath);
      if (node) {
        if (node.children) {
          return node.path ? (node.path.endsWith('/') ? node.path : node.path + '/') : '';
        } else {
          const parts = node.path.split('/');
          parts.pop();
          return parts.length > 0 ? parts.join('/') + '/' : '';
        }
      }
    }
    return 'game/';
  }, [explorerSelectedPaths, fileSystemTree]);

  const handleCreateBlockFromCanvas = useCallback((type: BlockType, position: Position) => {
    openCreateBlockModal(type, position, getSelectedFolderForNewBlock());
  }, [openCreateBlockModal, getSelectedFolderForNewBlock]);

  const deleteBlock = useCallback((id: string) => {
    setGroups(draft => {
      draft.forEach(g => {
        g.blockIds = g.blockIds.filter(bid => bid !== id);
      });
    });

    setBlocks(prev => prev.filter(b => b.id !== id));
    setOpenTabs(prev => prev.filter(t => t.blockId !== id));
    if (activeTabId === id) setActiveTabId('canvas');
  }, [setBlocks, setGroups, activeTabId, setActiveTabId, setOpenTabs]);

  const deleteBlockWithFile = useCallback(async (id: string) => {
    const block = blocks.find(b => b.id === id);
    if (!block || !block.filePath || !projectRootPath || !window.electronAPI) {
      deleteBlock(id);
      return;
    }

    openDeleteConfirmModal([block.filePath], async () => {
      try {
        const fullPath = await window.electronAPI.path.join(projectRootPath, block.filePath) as string;
        await window.electronAPI.removeEntry(fullPath);

        deleteBlock(id);

        const projData = await window.electronAPI.loadProject(projectRootPath);
        setFileSystemTree(projData.tree);

        addToast(`Deleted ${block.filePath}`, 'success');
      } catch (err) {
        logger.error('Failed to delete file:', err);
        addToast(`Failed to delete ${block.filePath}`, 'error');
      }
    });
  }, [blocks, projectRootPath, deleteBlock, addToast, openDeleteConfirmModal, setFileSystemTree]);

  return {
    updateBlock,
    updateGroup,
    updateBlockPositions,
    updateGroupPositions,
    addBlock,
    handleCreateBlockConfirm,
    handleCreateBlockFromCanvas,
    deleteBlock,
    deleteBlockWithFile,
    getSelectedFolderForNewBlock,
  };
}
