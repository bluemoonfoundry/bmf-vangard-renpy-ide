/**
 * @file useProjectIO.ts
 * @description Custom hook for project save, reload, and refresh operations.
 * Owns handleSaveProjectSettings, handleSaveAll, handleReloadFromDisk, and
 * handleRefreshProject. The project-open flow lives in useProjectLoad.
 */

import { useCallback } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { buildSavedStoryBlockLayouts } from '@/lib/storyCanvasLayout';
import { buildProjectSettingsForSave } from '@/lib/projectSerializer';
import { logger } from '@/lib/logger';
import type {
  Block, FileSystemTreeNode, EditorTab, ProjectImage, RenpyAudio,
  PersistedProjectSettings, ProjectSettings, SceneComposition, SceneSprite, ImageMapComposition,
  PunchlistMetadata, DiagnosticsTask, IgnoredDiagnosticRule, StickyNote,
  Notecard, NotecardLink, NotecardTimelineSettings,
  SerializedSprite, SerializedSceneComposition, SerializedImageMapComposition,
  Position, ProjectSettingsMeta,
} from '@/types';
import type { UntitledFileState } from '@/hooks/useUntitledFiles';

// Re-export so App.tsx import of these types from useProjectIO keeps working
export type { PendingStoryLayoutRefresh, PendingRouteLayoutRefresh } from '@/hooks/useProjectLoad';

type ProjectSettingsState = PersistedProjectSettings;

type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface UseProjectIOParams {
  // Refs
  blocksRef: React.MutableRefObject<Block[]>;
  dirtyBlockIdsRef: React.MutableRefObject<Set<string>>;
  dirtyEditorsRef: React.MutableRefObject<Set<string>>;
  editorInstances: React.MutableRefObject<Map<string, monaco.editor.IStandaloneCodeEditor>>;
  /** Set by hydrateFromProjectData; supplies schemaVersion and unknown fields to preserve on save. */
  projectSettingsMetaRef: React.MutableRefObject<ProjectSettingsMeta>;

  // Project root / file tree
  projectRootPath: string | null;
  setFileSystemTree: React.Dispatch<React.SetStateAction<FileSystemTreeNode | null>>;

  // Project settings (read-only for serialization)
  projectSettings: ProjectSettingsState;

  // Blocks
  blocks: Block[];
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;

  // Assets (read for save, write for refresh)
  setImages: React.Dispatch<React.SetStateAction<Map<string, ProjectImage>>>;
  setAudios: React.Dispatch<React.SetStateAction<Map<string, RenpyAudio>>>;
  imageScanDirectories: Map<string, FileSystemDirectoryHandle>;
  audioScanDirectories: Map<string, FileSystemDirectoryHandle>;

  // Data read for serialization in handleSaveProjectSettings
  stickyNotes: StickyNote[];
  routeStickyNotes: StickyNote[];
  choiceStickyNotes: StickyNote[];
  notecards: Notecard[];
  notecardLinks: NotecardLink[];
  notecardTimeline: NotecardTimelineSettings;
  characterProfiles: Record<string, string>;
  characterPortraits: Record<string, string>;
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

  // Untitled draft tracking (Save All also saves dirty untitled drafts)
  untitledFiles: Map<string, UntitledFileState>;
  saveUntitledFile: (tabId: string) => Promise<boolean>;

  addToast: (message: string, type?: ToastType) => void;
}

export interface UseProjectIOReturn {
  /** Returns true on success, false if the write failed (already toasted internally). */
  handleSaveProjectSettings: () => Promise<boolean>;
  /**
   * Returns true only if every dirty source file, project.ide.json, and every
   * dirty untitled file all saved successfully -- i.e. it's genuinely safe to
   * treat the workspace as clean (e.g. to proceed with quitting). Computed
   * synchronously within this call, not derived from dirty-state refs
   * afterward -- those are only synced via a useEffect and can still read
   * stale values immediately after this promise resolves.
   */
  handleSaveAll: () => Promise<boolean>;
  handleReloadFromDisk: (item: { relativePath: string; absolutePath: string }) => Promise<void>;
  handleRefreshProject: () => Promise<void>;
  /** The exact project.ide.json object a save would write now (also used for crash-recovery snapshots). */
  buildSettingsForDisk: () => ProjectSettings;
}

export type ProjectSettingsPayloadSource = Pick<UseProjectIOParams,
  'projectSettings' | 'blocks' | 'routeNodeLayoutCache' | 'openTabs' | 'activeTabId' | 'splitLayout' | 'splitPrimarySize'
  | 'secondaryOpenTabs' | 'secondaryActiveTabId' | 'stickyNotes' | 'routeStickyNotes' | 'choiceStickyNotes'
  | 'notecards' | 'notecardLinks' | 'notecardTimeline' | 'characterProfiles' | 'characterPortraits'
  | 'punchlistMetadata' | 'diagnosticsTasks' | 'ignoredDiagnostics' | 'dismissedImplicitVarHint'
  | 'sceneCompositions' | 'sceneNames' | 'imagemapCompositions' | 'imageScanDirectories' | 'audioScanDirectories'>;

/**
 * The project.ide.json payload for the current in-memory state, before the
 * schemaVersion/unknown-field wrapping in buildProjectSettingsForSave. Shared
 * by Save and by crash-recovery snapshots so both always agree on the shape.
 */
export function buildProjectSettingsPayload(src: ProjectSettingsPayloadSource): ProjectSettings {
  // Serialize scenes: map images to just their paths to avoid circular refs and huge files
  const serializeSprite = (s: SceneSprite): SerializedSprite => ({
    ...s,
    image: { filePath: s.image.filePath },
  });

  const serializableScenes: Record<string, SerializedSceneComposition> = {};
  Object.entries(src.sceneCompositions).forEach(([id, sc]) => {
    serializableScenes[id] = {
      background: sc.background ? serializeSprite(sc.background) : null,
      sprites: sc.sprites.map(serializeSprite),
      resolution: sc.resolution,
      animations: sc.animations,
    };
  });

  // Serialize imagemaps: map images to just their paths
  const serializableImagemaps: Record<string, SerializedImageMapComposition> = {};
  Object.entries(src.imagemapCompositions).forEach(([id, im]) => {
    serializableImagemaps[id] = {
      screenName: im.screenName,
      groundImage: im.groundImage ? { filePath: im.groundImage.filePath } : null,
      hoverImage: im.hoverImage ? { filePath: im.hoverImage.filePath } : null,
      hotspots: im.hotspots,
    };
  });

  return {
    ...src.projectSettings,
    storyBlockLayouts: buildSavedStoryBlockLayouts(src.blocks),
    routeNodeLayouts: Object.fromEntries(
      Array.from(src.routeNodeLayoutCache.entries()).map(([id, position]) => [id, { position }]),
    ),
    openTabs: src.openTabs,
    activeTabId: src.activeTabId,
    splitLayout: src.splitLayout,
    splitPrimarySize: src.splitPrimarySize,
    secondaryOpenTabs: src.secondaryOpenTabs,
    secondaryActiveTabId: src.secondaryActiveTabId,
    stickyNotes: Array.from(src.stickyNotes),
    routeStickyNotes: Array.from(src.routeStickyNotes),
    choiceStickyNotes: Array.from(src.choiceStickyNotes),
    notecards: Array.from(src.notecards),
    notecardLinks: Array.from(src.notecardLinks),
    notecardTimeline: src.notecardTimeline,
    characterProfiles: src.characterProfiles,
    characterPortraits: src.characterPortraits,
    punchlistMetadata: src.punchlistMetadata,
    diagnosticsTasks: src.diagnosticsTasks,
    ignoredDiagnostics: src.ignoredDiagnostics,
    dismissedImplicitVariableHint: src.dismissedImplicitVarHint,
    sceneCompositions: serializableScenes,
    sceneNames: src.sceneNames,
    imagemapCompositions: serializableImagemaps,
    scannedImagePaths: Array.from(src.imageScanDirectories.keys()),
    scannedAudioPaths: Array.from(src.audioScanDirectories.keys()),
  };
}

export function useProjectIO(params: UseProjectIOParams): UseProjectIOReturn {
  const {
    blocksRef, dirtyBlockIdsRef, dirtyEditorsRef, editorInstances, projectSettingsMetaRef,
    projectRootPath, setFileSystemTree,
    projectSettings,
    blocks, setBlocks,
    setImages, setAudios, imageScanDirectories, audioScanDirectories,
    stickyNotes, routeStickyNotes, choiceStickyNotes, notecards, notecardLinks, notecardTimeline, characterProfiles, characterPortraits,
    punchlistMetadata, diagnosticsTasks, ignoredDiagnostics, dismissedImplicitVarHint,
    sceneCompositions, sceneNames, imagemapCompositions,
    routeNodeLayoutCache,
    openTabs, activeTabId, secondaryOpenTabs, secondaryActiveTabId, splitLayout, splitPrimarySize,
    dirtyBlockIds, setDirtyBlockIds, dirtyEditors, setDirtyEditors,
    setHasUnsavedSettings, setSaveStatus, filesWithDiskConflict, setFilesWithDiskConflict,
    setExternallyChangedFiles, notifyFirstSave, openUnsavedChangesModal, closeUnsavedChangesModal,
    setOpenTabs,
    untitledFiles, saveUntitledFile,
    addToast,
  } = params;

  const buildSettingsForDisk = useCallback((): ProjectSettings => buildProjectSettingsForSave(
    buildProjectSettingsPayload({
      projectSettings, blocks, routeNodeLayoutCache, openTabs, activeTabId, splitLayout, splitPrimarySize,
      secondaryOpenTabs, secondaryActiveTabId, stickyNotes, routeStickyNotes, choiceStickyNotes,
      notecards, notecardLinks, notecardTimeline, characterProfiles, characterPortraits,
      punchlistMetadata, diagnosticsTasks, ignoredDiagnostics, dismissedImplicitVarHint,
      sceneCompositions, sceneNames, imagemapCompositions, imageScanDirectories, audioScanDirectories,
    }),
    projectSettingsMetaRef.current,
  ), [projectSettings, blocks, routeNodeLayoutCache, openTabs, activeTabId, splitLayout, splitPrimarySize, secondaryOpenTabs, secondaryActiveTabId, stickyNotes, routeStickyNotes, choiceStickyNotes, notecards, notecardLinks, notecardTimeline, characterProfiles, characterPortraits, punchlistMetadata, diagnosticsTasks, ignoredDiagnostics, dismissedImplicitVarHint, sceneCompositions, sceneNames, imagemapCompositions, imageScanDirectories, audioScanDirectories, projectSettingsMetaRef]);

  const handleSaveProjectSettings = useCallback(async () => {
    if (!projectRootPath || !window.electronAPI) return;
    try {
      const settingsPath = await window.electronAPI.path.join(projectRootPath as string, 'game/project.ide.json') as string;
      const fileContents = buildSettingsForDisk();
      const res = await window.electronAPI.writeFile(settingsPath, JSON.stringify(fileContents, null, 2));
      if (!res.success) throw new Error(res.error || 'Unknown error saving workspace settings');
      setHasUnsavedSettings(false);
      return true;
    } catch (e) {
      logger.error("Failed to save IDE settings:", e);
      addToast(e instanceof Error ? `Failed to save workspace settings: ${e.message}` : 'Failed to save workspace settings', 'error');
      return false;
    }
  }, [projectRootPath, buildSettingsForDisk, addToast, setHasUnsavedSettings]);

  const handleSaveAll = useCallback(async () => {
    const dirtyIds = new Set([...dirtyBlockIds, ...dirtyEditors]);
    const conflictingPaths = blocks
      .filter(b => dirtyIds.has(b.id) && b.filePath && filesWithDiskConflict.has(b.filePath))
      .map(b => b.filePath!);

    const doSaveAll = async (): Promise<boolean> => {
      setSaveStatus('saving');
      try {
          // Flush any popped-out editor's still-debouncing edit into blocks[] first --
          // otherwise a block being actively typed in a popout window wouldn't be
          // reflected yet, and Save All would silently write stale content for it.
          // blocksRef (not the `blocks` closure captured when this callback was built)
          // is used below so the flushed content is actually picked up.
          await window.electronAPI?.flushAllPopouts?.();
          const currentBlocks = [...blocksRef.current];
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

          if (!projectRootPath) {
               setDirtyBlockIds(new Set());
               setDirtyEditors(new Set());
               setHasUnsavedSettings(false);
               setSaveStatus('saved');
               notifyFirstSave();
               addToast('Changes saved to memory', 'success');
               return true;
          }

          // Step 1: game sources, as one all-or-nothing transaction. If this
          // fails no .rpy file on disk changed and everything stays dirty.
          let sourcesPendingRecovery = false;
          if (window.electronAPI) {
              const files: { path: string; content: string }[] = [];
              for (const blockId of blocksToSave) {
                  const block = currentBlocks.find(b => b.id === blockId);
                  if (block && block.filePath) {
                      const absPath = await window.electronAPI.path.join(projectRootPath!, block.filePath) as string;
                      files.push({ path: absPath, content: block.content });
                  }
              }
              if (files.length > 0) {
                  const res = await window.electronAPI.saveFiles(files);
                  if (!res.success) {
                      throw new Error(`Failed to save ${files.length} script file(s) -- none were changed on disk: ${res.error || 'Unknown error'}`);
                  }
                  sourcesPendingRecovery = res.pendingRecovery === true;
              }
          }

          // The sources are on disk now, so they are clean no matter what
          // happens to the IDE metadata below. Only the ids that were actually
          // saved are cleared -- an edit made while saving stays dirty.
          const withoutSaved = (prev: Set<string>) => {
              const next = new Set(prev);
              blocksToSave.forEach(id => next.delete(id));
              return next;
          };
          setDirtyBlockIds(withoutSaved);
          setDirtyEditors(withoutSaved);

          // Step 2: IDE metadata (project.ide.json), separately. A failure here
          // keeps the settings dirty but must not be reported as a source failure.
          const settingsSaved = window.electronAPI ? await handleSaveProjectSettings() : true;

          const dirtyUntitledIds = [...openTabs, ...secondaryOpenTabs]
            .filter(t => t.type === 'untitled' && untitledFiles.get(t.id)?.isDirty)
            .map(t => t.id);
          let untitledSaveFailed = false;
          for (const tabId of dirtyUntitledIds) {
            const saved = await saveUntitledFile(tabId);
            if (!saved) untitledSaveFailed = true;
          }

          notifyFirstSave();
          if (!settingsSaved) {
              // handleSaveProjectSettings already toasted the underlying error.
              setSaveStatus('error');
              addToast('Script files were saved, but workspace settings were not', 'warning');
              return false;
          }
          setSaveStatus('saved');
          if (sourcesPendingRecovery) {
            addToast('Saved, but some files are still being finalized -- they will be completed automatically on the next save or project load', 'warning');
            return true;
          }
          if (untitledSaveFailed) {
            addToast('Some changes saved — one or more untitled files were not saved', 'warning');
            return false;
          }
          addToast('All changes saved', 'success');
          return true;
      } catch (err) {
          logger.error('Failed to save changes', err);
          setSaveStatus('error');
          addToast(err instanceof Error ? err.message : 'Failed to save changes', 'error');
          return false;
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
      // The actual save happens later, asynchronously, once the user resolves
      // the conflict modal -- there's no result to report synchronously here.
      return false;
    }

    return await doSaveAll();
  }, [blocks, blocksRef, dirtyEditors, dirtyBlockIds, projectRootPath, addToast, setBlocks, handleSaveProjectSettings, filesWithDiskConflict, notifyFirstSave, openUnsavedChangesModal, closeUnsavedChangesModal, editorInstances, setDirtyBlockIds, setDirtyEditors, setHasUnsavedSettings, setSaveStatus, setFilesWithDiskConflict, openTabs, secondaryOpenTabs, untitledFiles, saveUntitledFile]);

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
    buildSettingsForDisk,
  };
}
