import { useCallback } from 'react';
import type { Block, ClipboardState, FileSystemTreeNode } from '@/types';
import { produce } from 'immer';
import { logger } from '@/lib/logger';

// Helper to add a node to the file tree immutably, creating parent directories if needed.
export const addNodeToFileTree = (tree: FileSystemTreeNode, path: string, type: 'file' | 'folder' = 'file'): FileSystemTreeNode => {
    const checkIfExists = (node: FileSystemTreeNode, path: string): boolean => {
        if (node.path === path) return true;
        return !!node.children?.some(child => checkIfExists(child, path));
    };
    if (checkIfExists(tree, path)) return tree;

    return produce(tree, draft => {
        let currentNode = draft;
        const parts = path.split('/');
        parts.forEach((part, index) => {
            if (!currentNode.children) currentNode.children = [];
            let childNode = currentNode.children.find(child => child.name === part);
            if (!childNode) {
                const isLastPart = index === parts.length - 1;
                const isDir = !isLastPart || (isLastPart && type === 'folder');
                childNode = { name: part, path: parts.slice(0, index + 1).join('/'), ...(isDir && { children: [] }) };
                currentNode.children.push(childNode);
                currentNode.children.sort((a, b) => {
                    if (a.children && !b.children) return -1;
                    if (!a.children && b.children) return 1;
                    return a.name.localeCompare(b.name);
                });
            }
            currentNode = childNode;
        });
    });
};

// Helper to remove a node from the file tree immutably.
export const removeNodeFromFileTree = (tree: FileSystemTreeNode | null, path: string): FileSystemTreeNode | null => {
    if (!tree) return null;
    return produce(tree, draft => {
        const parts = path.split('/');
        let currentNode = draft;
        for (let i = 0; i < parts.length - 1; i++) {
            if (!currentNode.children) return;
            const nextNode = currentNode.children.find(child => child.name === parts[i]);
            if (!nextNode) return;
            currentNode = nextNode;
        }
        if (currentNode.children) {
            const index = currentNode.children.findIndex(child => child.name === parts[parts.length - 1]);
            if (index > -1) currentNode.children.splice(index, 1);
        }
    });
};

type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface UseFileSystemManagerParams {
  projectRootPath: string | null;
  setFileSystemTree: React.Dispatch<React.SetStateAction<FileSystemTreeNode | null>>;
  blocks: Block[];
  addBlock: (filePath: string, content: string) => void;
  deleteBlock: (id: string) => void;
  clipboard: ClipboardState;
  setClipboard: React.Dispatch<React.SetStateAction<ClipboardState>>;
  openDeleteConfirmModal: (paths: string[], onConfirm: () => void) => void;
  addToast: (message: string, type?: ToastType) => void;
}

export interface UseFileSystemManagerReturn {
  handleCreateNode: (parentPath: string, name: string, type: 'file' | 'folder') => Promise<void>;
  handleRenameNode: (oldPath: string, newName: string) => Promise<void>;
  handleDeleteNode: (paths: string[]) => void;
  handleMoveNode: (sourcePaths: string[], targetPath: string) => Promise<void>;
  handleCut: (paths: string[]) => void;
  handleCopy: (paths: string[]) => void;
  handlePaste: (targetPath: string) => Promise<void>;
}

/**
 * Hook for file explorer tree CRUD operations (create/rename/delete/move/cut/copy/paste).
 * Performs the IPC calls and reconciles both the file system tree and `.rpy` blocks.
 */
export function useFileSystemManager({
  projectRootPath, setFileSystemTree, blocks, addBlock, deleteBlock,
  clipboard, setClipboard, openDeleteConfirmModal, addToast,
}: UseFileSystemManagerParams): UseFileSystemManagerReturn {
  const handleCreateNode = useCallback(async (parentPath: string, name: string, type: 'file' | 'folder') => {
    if (!window.electronAPI || !projectRootPath) return;
    try {
        const fullPath = await window.electronAPI.path.join(projectRootPath, parentPath, name);
        if (type === 'folder') {
            await window.electronAPI.createDirectory(fullPath);
        } else {
            await window.electronAPI.writeFile(fullPath, '');

            // If it's an .rpy file, create a corresponding block
            if (name.toLowerCase().endsWith('.rpy')) {
                const relativePath = parentPath ? `${parentPath}/${name}` : name;
                const content = ''; // Empty content for newly created files
                addBlock(relativePath, content);
                addToast(`Created block for ${name}`, 'success');
            }
        }
        const projData = await window.electronAPI.loadProject(projectRootPath);
        setFileSystemTree(projData.tree);
    } catch (err) {
        logger.error('Failed to create file/folder:', err);
        addToast(`Failed to create ${type}: ${name}`, 'error');
    }
  }, [projectRootPath, addBlock, addToast, setFileSystemTree]);

  const handleRenameNode = useCallback(async (oldPath: string, newName: string) => {
      if (!window.electronAPI || !projectRootPath) return;
      try {
          const fullOldPath = await window.electronAPI.path.join(projectRootPath, oldPath) as string;
          const parentDir = oldPath.split('/').slice(0, -1).join('/');
          const fullNewPath = await window.electronAPI.path.join(projectRootPath, parentDir, newName) as string;
          await window.electronAPI.moveFile(fullOldPath, fullNewPath);
          const projData = await window.electronAPI.loadProject(projectRootPath);
          setFileSystemTree(projData.tree);
      } catch (err) {
          logger.error('Failed to rename:', err);
          addToast('Failed to rename file', 'error');
      }
  }, [projectRootPath, addToast, setFileSystemTree]);

  const handleDeleteNode = useCallback((paths: string[]) => {
      if (!window.electronAPI || !projectRootPath) return;

      // Check if any of the paths are .rpy files that have corresponding blocks
      const rpyFilesToDelete = paths.filter(path => path.toLowerCase().endsWith('.rpy'));
      const blocksToDelete = rpyFilesToDelete.map(rpyPath =>
          blocks.find(block => block.filePath === rpyPath)
      ).filter(Boolean) as Block[];

      // Show confirmation modal
      openDeleteConfirmModal(paths, async () => {
              try {
                  // Delete the files
                  for (const p of paths) {
                      const fullPath = await window.electronAPI!.path.join(projectRootPath, p) as string;
                      await window.electronAPI!.removeEntry(fullPath);
                  }

                  // Remove corresponding blocks for .rpy files
                  blocksToDelete.forEach(block => {
                      if (block) {
                          deleteBlock(block.id);
                          addToast(`Removed block for ${block.filePath}`, 'info');
                      }
                  });

                  const projData = await window.electronAPI!.loadProject(projectRootPath);
                  setFileSystemTree(projData.tree);

                  if (blocksToDelete.length > 0) {
                      addToast(`Deleted ${paths.length} file(s) and removed ${blocksToDelete.length} block(s)`, 'success');
                  } else {
                      addToast(`Deleted ${paths.length} file(s)`, 'success');
                  }
              } catch (err) {
                  logger.error('Failed to delete:', err);
                  addToast('Failed to delete file(s)', 'error');
              }
      });
  }, [projectRootPath, blocks, deleteBlock, addToast, openDeleteConfirmModal, setFileSystemTree]);

  const handleMoveNode = useCallback(async (sourcePaths: string[], targetPath: string) => {
      if (!window.electronAPI || !projectRootPath) return;
      try {
          const fullTargetDir = await window.electronAPI.path.join(projectRootPath, targetPath);
          for (const p of sourcePaths) {
              const fullSource = await window.electronAPI.path.join(projectRootPath, p);
              const fileName = p.split('/').pop() || '';
              const fullDest = await window.electronAPI.path.join(fullTargetDir, fileName);
              await window.electronAPI.moveFile(fullSource, fullDest);
          }
          const projData = await window.electronAPI.loadProject(projectRootPath);
          setFileSystemTree(projData.tree);
      } catch (err) {
          logger.error('Failed to move file(s):', err);
          addToast('Failed to move file(s)', 'error');
      }
  }, [projectRootPath, addToast, setFileSystemTree]);

  const handleCut = useCallback((paths: string[]) => setClipboard({ type: 'cut', paths: new Set(paths) }), [setClipboard]);
  const handleCopy = useCallback((paths: string[]) => setClipboard({ type: 'copy', paths: new Set(paths) }), [setClipboard]);
  const handlePaste = useCallback(async (targetPath: string) => {
      if (!clipboard || !window.electronAPI || !projectRootPath) return;
      try {
          const fullTargetDir = await window.electronAPI.path.join(projectRootPath, targetPath);

          for (const p of clipboard.paths) {
              const fullSource = await window.electronAPI.path.join(projectRootPath, p);
              const fileName = p.split('/').pop() || '';
              const fullDest = await window.electronAPI.path.join(fullTargetDir, fileName);

              if (clipboard.type === 'cut') {
                  await window.electronAPI.moveFile(fullSource, fullDest);
              } else {
                  await window.electronAPI.copyEntry(fullSource, fullDest);
              }
          }

          if (clipboard.type === 'cut') setClipboard(null);
          const projData = await window.electronAPI.loadProject(projectRootPath);
          setFileSystemTree(projData.tree);
      } catch (err) {
          logger.error('Failed to paste:', err);
          addToast('Failed to paste file(s)', 'error');
      }
  }, [clipboard, projectRootPath, addToast, setClipboard, setFileSystemTree]);

  return { handleCreateNode, handleRenameNode, handleDeleteNode, handleMoveNode, handleCut, handleCopy, handlePaste };
}
