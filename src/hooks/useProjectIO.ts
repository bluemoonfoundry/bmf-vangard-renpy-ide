/**
 * @file useProjectIO.ts
 * @description Custom hook for project save, reload, and refresh operations.
 * Owns handleSaveProjectSettings, handleSaveAll, handleReloadFromDisk, and
 * handleRefreshProject. The project-open flow lives in useProjectLoad.
 */

import { useCallback } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { buildSavedStoryBlockLayouts } from '@/lib/storyCanvasLayout';
import { logger } from '@/lib/logger';
import type {
  Block, FileSystemTreeNode, EditorTab, ProjectImage, RenpyAudio,
  ProjectSettings, SceneComposition, SceneSprite, ImageMapComposition,
  PunchlistMetadata, DiagnosticsTask, IgnoredDiagnosticRule, StickyNote,
  SerializedSprite, SerializedSceneComposition, SerializedImageMapComposition,
  Position,
} from '@/types';

// Re-export so App.tsx import of these types from useProjectIO keeps working
export type { PendingStoryLayoutRefresh, PendingRouteLayoutRefresh } from '@/hooks/useProjectLoad';

type ProjectSettingsState = Omit<ProjectSettings,
  'openTabs' | 'activeTabId' | 'stickyNotes' | 'characterProfiles' | 'punchlistMetadata' |
  'diagnosticsTasks' | 'ignoredDiagnostics' | 'sceneCompositions' | 'sceneNames' |
  'scannedImagePaths' | 'scannedAudioPaths'>;

type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface UseProjectIOParams {
  // Refs
  blocksRef: React.MutableRefObject<Block[]>;
  dirtyBlockIdsRef: React.MutableRefObject<Set<string>>;
  dirtyEditorsRef: React.MutableRefObject<Set<string>>;
  editorInstances: React.MutableRefObject<Map<string, monaco.editor.IStandaloneCodeEditor>>;

  // Project root / file tree
  projectRootPath: string | null;
  setFileSystemTree: React.Dispatch<React.SetStateAction<FileSystemTreeNode | null>>;

  // Project settings (read-only for serialization)
  projectSettings: ProjectSettingsState;

  // Blocks
  blocks: Block[];
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  directoryHandle: FileSystemDirectoryHandle | null;

  // Assets (read for save, write for refresh)
  setImages: React.Dispatch<React.SetStateAction<Map<string, ProjectImage>>>;
  setAudios: React.Dispatch<React.SetStateAction<Map<string, RenpyAudio>>>;
  imageScanDirectories: Map<string, FileSystemDirectoryHandle>;
  audioScanDirectories: Map<string, FileSystemDirectoryHandle>;

  // Data read for serialization in handleSaveProjectSettings
  stickyNotes: StickyNote[];
  routeStickyNotes: StickyNote[];
  choiceStickyNotes: StickyNote[];
  characterProfiles: Record<string, string>;
  punchlistMetadata: Record<string, PunchlistMetadata>;
  diagnosticsTasks: DiagnosticsTask[];
  ignoredDiagnostics: IgnoredDiagnosticRule[];
  dismissedImplicitVarHint: boolean;
  sceneCompositions: Record<string, SceneComposition>;
  sceneNames: Record<string, string>;
  imagemapCompositions: Record<string, ImageMapComposition>;
  routeNodeLayoutCache: Map<string, Position>;
  openTabs: EditorTab[];
  activeTabId: string;
  secondaryOpenTabs: EditorTab[];
  secondaryActiveTabId: string;
  splitLayout: 'none' | 'right' | 'bottom';
  splitPrimarySize: number;

  // Dirty / save state
  dirtyBlockIds: Set<string>;
  setDirtyBlockIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  dirtyEditors: Set<string>;
  setDirtyEditors: React.Dispatch<React.SetStateAction<Set<string>>>;
  setHasUnsavedSettings: React.Dispatch<React.SetStateAction<boolean>>;
  setSaveStatus: React.Dispatch<React.SetStateAction<'saving' | 'saved' | 'error'>>;
  filesWithDiskConflict: Set<string>;
  setFilesWithDiskConflict: React.Dispatch<React.SetStateAction<Set<string>>>;
  setExternallyChangedFiles: React.Dispatch<React.SetStateAction<Array<{ relativePath: string; absolutePath: string }>>>;
  notifyFirstSave: () => void;
  openUnsavedChangesModal: (info: {
    title: string;
    message: string;
    confirmText: string;
    dontSaveText: string;
    onConfirm: () => void | Promise<void>;
    onDontSave: () => void;
    onCancel: () => void;
  }) => void;
  closeUnsavedChangesModal: () => void;

  // Tabs (used by handleRefreshProject to close removed-file tabs)
  setOpenTabs: React.Dispatch<React.SetStateAction<EditorTab[]>>;

  addToast: (message: string, type?: ToastType) => void;
}

export interface UseProjectIOReturn {
  handleSaveProjectSettings: () => Promise<void>;
  handleSaveAll: () => Promise<void>;
  handleReloadFromDisk: (item: { relativePath: string; absolutePath: string }) => Promise<void>;
  handleRefreshProject: () => Promise<void>;
}

export function useProjectIO(params: UseProjectIOParams): UseProjectIOReturn {
  const {
    blocksRef, dirtyBlockIdsRef, dirtyEditorsRef, editorInstances,
    projectRootPath, setFileSystemTree,
    projectSettings,
    blocks, setBlocks, directoryHandle,
    setImages, setAudios, imageScanDirectories, audioScanDirectories,
    stickyNotes, routeStickyNotes, choiceStickyNotes, characterProfiles,
    punchlistMetadata, diagnosticsTasks, ignoredDiagnostics, dismissedImplicitVarHint,
    sceneCompositions, sceneNames, imagemapCompositions,
    routeNodeLayoutCache,
    openTabs, activeTabId, secondaryOpenTabs, secondaryActiveTabId, splitLayout, splitPrimarySize,
    dirtyBlockIds, setDirtyBlockIds, dirtyEditors, setDirtyEditors,
    setHasUnsavedSettings, setSaveStatus, filesWithDiskConflict, setFilesWithDiskConflict,
    setExternallyChangedFiles, notifyFirstSave, openUnsavedChangesModal, closeUnsavedChangesModal,
    setOpenTabs,
    addToast,
  } = params;

  const handleSaveProjectSettings = useCallback(async () => {
    if (!projectRootPath || !window.electronAPI) return;
    try {
      // Serialize scenes: map images to just their paths to avoid circular refs and huge files
      const serializeSprite = (s: SceneSprite): SerializedSprite => ({
          ...s,
          image: { filePath: s.image.filePath }
      });

      const serializableScenes: Record<string, SerializedSceneComposition> = {};
      Object.entries(sceneCompositions).forEach(([id, sc]) => {
          serializableScenes[id] = {
              background: sc.background ? serializeSprite(sc.background) : null,
              sprites: sc.sprites.map(serializeSprite),
              resolution: sc.resolution,
          };
      });

      // Serialize imagemaps: map images to just their paths
      const serializableImagemaps: Record<string, SerializedImageMapComposition> = {};
      Object.entries(imagemapCompositions).forEach(([id, im]) => {
          serializableImagemaps[id] = {
              screenName: im.screenName,
              groundImage: im.groundImage ? { filePath: im.groundImage.filePath } : null,
              hoverImage: im.hoverImage ? { filePath: im.hoverImage.filePath } : null,
              hotspots: im.hotspots
          };
      });

      const settingsToSave: ProjectSettings = {
        ...projectSettings,
        storyBlockLayouts: buildSavedStoryBlockLayouts(blocks),
        routeNodeLayouts: Object.fromEntries(
          Array.from(routeNodeLayoutCache.entries()).map(([id, position]) => [id, { position }]),
        ),
        openTabs,
        activeTabId,
        splitLayout,
        splitPrimarySize,
        secondaryOpenTabs,
        secondaryActiveTabId,
        stickyNotes: Array.from(stickyNotes),
        routeStickyNotes: Array.from(routeStickyNotes),
        choiceStickyNotes: Array.from(choiceStickyNotes),
        characterProfiles,
        punchlistMetadata,
        diagnosticsTasks,
        ignoredDiagnostics,
        dismissedImplicitVariableHint: dismissedImplicitVarHint,
        sceneCompositions: serializableScenes,
        sceneNames,
        imagemapCompositions: serializableImagemaps,
        scannedImagePaths: Array.from(imageScanDirectories.keys()),
        scannedAudioPaths: Array.from(audioScanDirectories.keys()),
      };
      const settingsPath = await window.electronAPI.path.join(projectRootPath as string, 'game/project.ide.json') as string;
      await window.electronAPI.writeFile(settingsPath, JSON.stringify(settingsToSave, null, 2));
      setHasUnsavedSettings(false);
    } catch (e) {
      logger.error("Failed to save IDE settings:", e);
      addToast('Failed to save workspace settings', 'error');
    }
  }, [projectRootPath, projectSettings, blocks, routeNodeLayoutCache, openTabs, activeTabId, splitLayout, splitPrimarySize, secondaryOpenTabs, secondaryActiveTabId, stickyNotes, routeStickyNotes, choiceStickyNotes, characterProfiles, addToast, sceneCompositions, sceneNames, imagemapCompositions, imageScanDirectories, audioScanDirectories, punchlistMetadata, diagnosticsTasks, ignoredDiagnostics, dismissedImplicitVarHint, setHasUnsavedSettings]);

  const handleSaveAll = useCallback(async () => {
    const dirtyIds = new Set([...dirtyBlockIds, ...dirtyEditors]);
    const conflictingPaths = blocks
      .filter(b => dirtyIds.has(b.id) && b.filePath && filesWithDiskConflict.has(b.filePath))
      .map(b => b.filePath!);

    const doSaveAll = async () => {
      setSaveStatus('saving');
      try {
          const currentBlocks = [...blocks];
          const editorUpdates = new Map<string, string>();

          for (const blockId of dirtyEditors) {
               const editor = editorInstances.current.get(blockId);
               if (editor) {
                   const content = editor.getValue();
                   editorUpdates.set(blockId, content);
                   const idx = currentBlocks.findIndex(b => b.id === blockId);
                   if (idx !== -1) {
                       currentBlocks[idx] = { ...currentBlocks[idx], content };
                   }
               }
          }

          if (editorUpdates.size > 0) {
              setBlocks(prev => prev.map(b => {
                  if(editorUpdates.has(b.id)) {
                      return { ...b, content: editorUpdates.get(b.id)! };
                  }
                  return b;
              }));
          }

          const blocksToSave = new Set([...dirtyBlockIds, ...dirtyEditors]);

          if (!projectRootPath && !directoryHandle) {
               setDirtyBlockIds(new Set());
               setDirtyEditors(new Set());
               setHasUnsavedSettings(false);
               setSaveStatus('saved');
               notifyFirstSave();
               addToast('Changes saved to memory', 'success');
               return;
          }

          if (window.electronAPI) {
              for (const blockId of blocksToSave) {
                  const block = currentBlocks.find(b => b.id === blockId);
                  if (block && block.filePath) {
                      const absPath = await window.electronAPI.path.join(projectRootPath!, block.filePath) as string;
                      const res = await window.electronAPI.writeFile(absPath, block.content);
                      if (!res.success) throw new Error((res.error as string) || 'Unknown error saving file');
                  }
              }
              await handleSaveProjectSettings();
          }

          setDirtyBlockIds(new Set());
          setDirtyEditors(new Set());
          setSaveStatus('saved');
          notifyFirstSave();
          addToast('All changes saved', 'success');
      } catch (err) {
          logger.error('Failed to save changes', err);
          setSaveStatus('error');
          addToast('Failed to save changes', 'error');
      }
    };

    if (conflictingPaths.length > 0) {
      const names = conflictingPaths.map(p => p.split('/').pop()).join(', ');
      openUnsavedChangesModal({
        title: 'Overwrite External Changes?',
        message: `${conflictingPaths.length} file(s) were modified on disk: ${names}. Save All will overwrite those changes with your editor versions.`,
        confirmText: 'Save All',
        dontSaveText: 'Cancel',
        onConfirm: async () => {
          closeUnsavedChangesModal();
          setFilesWithDiskConflict(prev => {
            const next = new Set(prev);
            conflictingPaths.forEach(p => next.delete(p));
            return next;
          });
          await doSaveAll();
        },
        onDontSave: () => closeUnsavedChangesModal(),
        onCancel: () => closeUnsavedChangesModal(),
      });
      return;
    }

    await doSaveAll();
  }, [blocks, dirtyEditors, dirtyBlockIds, projectRootPath, directoryHandle, addToast, setBlocks, handleSaveProjectSettings, filesWithDiskConflict, notifyFirstSave, openUnsavedChangesModal, closeUnsavedChangesModal, editorInstances, setDirtyBlockIds, setDirtyEditors, setHasUnsavedSettings, setSaveStatus, setFilesWithDiskConflict]);

  const handleReloadFromDisk = useCallback(async (item: { relativePath: string; absolutePath: string }) => {
      const block = blocks.find(b => b.filePath === item.relativePath);
      if (!block || !window.electronAPI) return;
      try {
          const content = await window.electronAPI.readFile(item.absolutePath);
          setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, content } : b));
          setDirtyBlockIds(prev => { const next = new Set(prev); next.delete(block.id); return next; });
          setDirtyEditors(prev => { const next = new Set(prev); next.delete(block.id); return next; });
          const editor = editorInstances.current.get(block.id);
          if (editor) {
              const model = editor.getModel();
              if (model) model.setValue(content);
          }
          setExternallyChangedFiles(prev => prev.filter(f => f.relativePath !== item.relativePath));
          setFilesWithDiskConflict(prev => { const next = new Set(prev); next.delete(item.relativePath); return next; });
      } catch (err) {
          logger.error('Failed to reload externally changed file', err);
          addToast(`Failed to reload ${item.relativePath}`, 'error');
      }
  }, [blocks, setBlocks, addToast, editorInstances, setDirtyBlockIds, setDirtyEditors, setExternallyChangedFiles, setFilesWithDiskConflict]);

  const handleRefreshProject = useCallback(async () => {
      if (!projectRootPath || !window.electronAPI) return;
      try {
          const freshData = await window.electronAPI.refreshProject(projectRootPath);

          // 1. Update the file system tree
          setFileSystemTree(freshData.tree);

          // 2. Reconcile .rpy blocks
          const freshByPath = new Map(freshData.files.map(f => [f.path, f.content]));
          const currentByPath = new Map(
              blocksRef.current.filter(b => b.filePath).map(b => [b.filePath!, b])
          );

          // Removed files → close tabs and drop blocks
          const removedPaths = new Set(
              [...currentByPath.keys()].filter(p => !freshByPath.has(p))
          );
          if (removedPaths.size > 0) {
              setBlocks(prev => prev.filter(b => !b.filePath || !removedPaths.has(b.filePath)));
              setOpenTabs(prev => prev.filter(t => {
                  if (t.type !== 'editor') return true;
                  const b = blocksRef.current.find(bl => bl.id === t.id);
                  return !b?.filePath || !removedPaths.has(b.filePath);
              }));
          }

          // Changed files → silent update if clean, queue if dirty
          const dirtyIds = new Set([...dirtyBlockIdsRef.current, ...dirtyEditorsRef.current]);
          const silentUpdates: { id: string; content: string }[] = [];
          const toQueue: { relativePath: string; absolutePath: string }[] = [];

          for (const [path, freshContent] of freshByPath) {
              const existing = currentByPath.get(path);
              if (!existing || existing.content === freshContent) continue;
              if (dirtyIds.has(existing.id)) {
                  const absPath = await window.electronAPI.path.join(projectRootPath, path) as string;
                  toQueue.push({ relativePath: path, absolutePath: absPath });
              } else {
                  silentUpdates.push({ id: existing.id, content: freshContent });
              }
          }

          if (silentUpdates.length > 0) {
              setBlocks(prev => prev.map(b => {
                  const u = silentUpdates.find(s => s.id === b.id);
                  if (!u) return b;
                  const editor = editorInstances.current.get(b.id);
                  if (editor) {
                      const model = editor.getModel();
                      if (model && model.getValue() !== u.content) model.setValue(u.content);
                  }
                  return { ...b, content: u.content };
              }));
          }

          for (const item of toQueue) {
              setExternallyChangedFiles(prev =>
                  prev.some(f => f.relativePath === item.relativePath) ? prev : [...prev, item]
              );
          }

          // New files → add blocks below the current layout
          const newFiles = freshData.files.filter(f => !currentByPath.has(f.path));
          if (newFiles.length > 0) {
              const maxY = blocksRef.current.reduce((m, b) => Math.max(m, b.position.y + (b.height ?? 200)), 0);
              setBlocks(prev => [
                  ...prev,
                  ...newFiles.map((f, i) => ({
                      id: `block-${Date.now()}-${i}`,
                      content: f.content,
                      filePath: f.path,
                      position: { x: 50 + (i % 5) * 370, y: maxY + 80 },
                      width: 320,
                      height: 200,
                      title: f.path.split('/').pop(),
                  })),
              ]);
          }

          // 3. Reconcile project images (replace in-project entries with fresh scan)
          setImages(prev => {
              const next = new Map(prev);
              for (const [key, img] of next.entries()) {
                  if (img.isInProject) next.delete(key);
              }
              freshData.images.forEach(img => {
                  next.set(img.path, {
                      filePath: img.path,
                      fileName: img.path.split('/').pop() ?? '',
                      dataUrl: img.dataUrl,
                      fileHandle: null,
                      isInProject: true,
                      lastModified: img.lastModified,
                      size: img.size,
                  });
              });
              return next;
          });

          // 4. Reconcile project audios
          setAudios(prev => {
              const next = new Map(prev);
              for (const [key, aud] of next.entries()) {
                  if (aud.isInProject) next.delete(key);
              }
              freshData.audios.forEach(aud => {
                  next.set(aud.path, {
                      filePath: aud.path,
                      fileName: aud.path.split('/').pop() ?? '',
                      dataUrl: aud.dataUrl,
                      fileHandle: null,
                      isInProject: true,
                      lastModified: aud.lastModified,
                      size: aud.size,
                  });
              });
              return next;
          });

          const summary: string[] = [];
          if (newFiles.length) summary.push(`${newFiles.length} new`);
          if (removedPaths.size) summary.push(`${removedPaths.size} removed`);
          if (silentUpdates.length) summary.push(`${silentUpdates.length} updated`);
          if (toQueue.length) summary.push(`${toQueue.length} conflict(s) need review`);
          addToast(summary.length ? `Refreshed: ${summary.join(', ')}` : 'Project is up to date', 'success');
      } catch (err) {
          logger.error('Failed to refresh project:', err);
          addToast('Failed to refresh project', 'error');
      }
  }, [projectRootPath, addToast, setBlocks, setFileSystemTree, setImages, setAudios, setOpenTabs, blocksRef, dirtyBlockIdsRef, dirtyEditorsRef, editorInstances, setExternallyChangedFiles]);

  return {
    handleSaveProjectSettings,
    handleSaveAll,
    handleReloadFromDisk,
    handleRefreshProject,
  };
}
