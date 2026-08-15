import { useState, useCallback, useEffect } from 'react';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import type { Block } from '@/types';
import { logger } from '@/lib/logger';

interface UseExternalFileChangesParams {
  projectRootPath: string | null;
  blocksRef: React.MutableRefObject<Block[]>;
  dirtyBlockIdsRef: React.MutableRefObject<Set<string>>;
  dirtyEditorsRef: React.MutableRefObject<Set<string>>;
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  editorInstances: React.MutableRefObject<Map<string, monaco.editor.IStandaloneCodeEditor>>;
  addToast?: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export function useExternalFileChanges({
  projectRootPath,
  blocksRef,
  dirtyBlockIdsRef,
  dirtyEditorsRef,
  setBlocks,
  editorInstances,
  addToast,
}: UseExternalFileChangesParams) {
  const [externallyChangedFiles, setExternallyChangedFiles] = useState<Array<{ relativePath: string; absolutePath: string }>>([]);
  const [filesWithDiskConflict, setFilesWithDiskConflict] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!window.electronAPI?.onFileChangedExternally || !projectRootPath) return;
    const unsub = window.electronAPI.onFileChangedExternally((data) => {
      const block = blocksRef.current.find(b => b.filePath === data.relativePath);
      if (!block) return;

      const isDirty = dirtyBlockIdsRef.current.has(block.id) || dirtyEditorsRef.current.has(block.id);
      if (!isDirty) {
        // Not dirty — silently reload from disk
        window.electronAPI!.readFile(data.absolutePath).then((content: string) => {
          setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, content } : b));
          const editor = editorInstances.current.get(block.id);
          if (editor) {
            const model = editor.getModel();
            if (model && model.getValue() !== content) {
              model.setValue(content);
            }
          }
        }).catch(err => logger.error('Failed to reload externally changed file', err));
      } else {
        // Has unsaved edits — queue for user decision
        setExternallyChangedFiles(prev =>
          prev.some(f => f.relativePath === data.relativePath) ? prev : [...prev, data]
        );
      }
    });
    return unsub;
  }, [projectRootPath, setBlocks]);

  useEffect(() => {
    if (!window.electronAPI?.onWatcherError) return;
    const unsub = window.electronAPI.onWatcherError(() => {
      addToast?.('Live file change detection is unavailable for this project — external edits will not auto-sync.', 'warning');
    });
    return unsub;
  }, [addToast]);

  const handleKeepCurrentFile = useCallback((relativePath: string) => {
    setExternallyChangedFiles(prev => prev.filter(f => f.relativePath !== relativePath));
    setFilesWithDiskConflict(prev => { const next = new Set(prev); next.add(relativePath); return next; });
  }, []);

  return {
    externallyChangedFiles,
    setExternallyChangedFiles,
    filesWithDiskConflict,
    setFilesWithDiskConflict,
    handleKeepCurrentFile,
  };
}
