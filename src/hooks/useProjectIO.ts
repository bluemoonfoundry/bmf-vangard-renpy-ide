/**
 * @file useProjectIO.ts
 * @description Custom hook for project-level I/O: loading, saving, and refreshing
 * a Ren'Py project from/to disk. Extracted from App.tsx — owns no state itself,
 * it orchestrates the many state slices that make up a loaded project.
 */

import { useCallback } from 'react';
import type { Updater } from 'use-immer';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { migratePunchlistToTasks } from '@/hooks/useDiagnostics';
import { buildSavedStoryBlockLayouts, getStoryLayoutVersion } from '@/lib/storyCanvasLayout';
import { getRouteCanvasLayoutVersion } from '@/lib/routeCanvasLayout';
import { isSerializedSceneComposition, isSerializedImageMapComposition } from '@/lib/typeGuards';
import { logger } from '@/lib/logger';
import type {
  Block, Position, FileSystemTreeNode, EditorTab, ProjectImage, RenpyAudio,
  AppSettings, ProjectSettings, SceneComposition, SceneSprite, ImageMapComposition,
  PunchlistMetadata, DiagnosticsTask, IgnoredDiagnosticRule, StickyNote,
  SerializedSprite, SerializedSceneComposition, SerializedImageMapComposition,
} from '@/types';

export interface PendingStoryLayoutRefresh {
  hasSavedLayouts: boolean;
  savedFingerprint?: string;
  savedVersion?: number;
  savedWasUserAdjusted: boolean;
}

export interface PendingRouteLayoutRefresh {
  hasSavedLayouts: boolean;
  savedFingerprint?: string;
  savedVersion?: number;
  savedWasUserAdjusted: boolean;
}

type ProjectSettingsState = Omit<ProjectSettings,
  'openTabs' | 'activeTabId' | 'stickyNotes' | 'characterProfiles' | 'punchlistMetadata' |
  'diagnosticsTasks' | 'ignoredDiagnostics' | 'sceneCompositions' | 'sceneNames' |
  'scannedImagePaths' | 'scannedAudioPaths'>;

type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface UseProjectIOParams {
  // Refs
  loadCancelRef: React.MutableRefObject<boolean>;
  blocksRef: React.MutableRefObject<Block[]>;
  pendingStoryLayoutRefreshRef: React.MutableRefObject<PendingStoryLayoutRefresh | null>;
  pendingRouteLayoutRefreshRef: React.MutableRefObject<PendingRouteLayoutRefresh | null>;
  pendingAutoCenterRef: React.MutableRefObject<{ story: boolean; route: boolean; choice: boolean }>;
  editorInstances: React.MutableRefObject<Map<string, monaco.editor.IStandaloneCodeEditor>>;
  dirtyBlockIdsRef: React.MutableRefObject<Set<string>>;
  dirtyEditorsRef: React.MutableRefObject<Set<string>>;

  // Loading overlay state
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingProgress: React.Dispatch<React.SetStateAction<number>>;
  setLoadingMessage: React.Dispatch<React.SetStateAction<string>>;

  // Project root / file tree
  projectRootPath: string | null;
  setProjectRootPath: React.Dispatch<React.SetStateAction<string | null>>;
  setFileSystemTree: React.Dispatch<React.SetStateAction<FileSystemTreeNode | null>>;

  // App / project settings
  updateAppSettings: (updater: (draft: AppSettings) => void) => void;
  projectSettings: ProjectSettingsState;
  updateProjectSettings: (updater: (draft: ProjectSettingsState) => void) => void;

  // Blocks
  blocks: Block[];
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  directoryHandle: FileSystemDirectoryHandle | null;

  // Assets
  setImages: React.Dispatch<React.SetStateAction<Map<string, ProjectImage>>>;
  setAudios: React.Dispatch<React.SetStateAction<Map<string, RenpyAudio>>>;
  imageScanDirectories: Map<string, FileSystemDirectoryHandle>;
  setImageScanDirectories: React.Dispatch<React.SetStateAction<Map<string, FileSystemDirectoryHandle>>>;
  audioScanDirectories: Map<string, FileSystemDirectoryHandle>;
  setAudioScanDirectories: React.Dispatch<React.SetStateAction<Map<string, FileSystemDirectoryHandle>>>;
  setIsScanningAssets: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRefreshingImages: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRefreshingAudios: React.Dispatch<React.SetStateAction<boolean>>;
  setImagesLastScanned: React.Dispatch<React.SetStateAction<number | null>>;
  setAudiosLastScanned: React.Dispatch<React.SetStateAction<number | null>>;

  // Sticky notes / character profiles / diagnostics
  stickyNotes: StickyNote[];
  setStickyNotes: Updater<StickyNote[]>;
  routeStickyNotes: StickyNote[];
  setRouteStickyNotes: Updater<StickyNote[]>;
  choiceStickyNotes: StickyNote[];
  setChoiceStickyNotes: Updater<StickyNote[]>;
  characterProfiles: Record<string, string>;
  setCharacterProfiles: Updater<Record<string, string>>;
  punchlistMetadata: Record<string, PunchlistMetadata>;
  setPunchlistMetadata: Updater<Record<string, PunchlistMetadata>>;
  diagnosticsTasks: DiagnosticsTask[];
  setDiagnosticsTasks: Updater<DiagnosticsTask[]>;
  ignoredDiagnostics: IgnoredDiagnosticRule[];
  setIgnoredDiagnostics: Updater<IgnoredDiagnosticRule[]>;
  dismissedImplicitVarHint: boolean;
  setDismissedImplicitVarHint: React.Dispatch<React.SetStateAction<boolean>>;

  // Scene / imagemap compositions
  sceneCompositions: Record<string, SceneComposition>;
  setSceneCompositions: Updater<Record<string, SceneComposition>>;
  sceneNames: Record<string, string>;
  setSceneNames: Updater<Record<string, string>>;
  imagemapCompositions: Record<string, ImageMapComposition>;
  setImagemapCompositions: Updater<Record<string, ImageMapComposition>>;

  // Route canvas layout
  routeNodeLayoutCache: Map<string, Position>;
  setRouteNodeLayoutCache: React.Dispatch<React.SetStateAction<Map<string, Position>>>;

  // Tabs
  openTabs: EditorTab[];
  setOpenTabs: React.Dispatch<React.SetStateAction<EditorTab[]>>;
  activeTabId: string;
  setActiveTabId: React.Dispatch<React.SetStateAction<string>>;
  secondaryOpenTabs: EditorTab[];
  setSecondaryOpenTabs: React.Dispatch<React.SetStateAction<EditorTab[]>>;
  secondaryActiveTabId: string;
  setSecondaryActiveTabId: React.Dispatch<React.SetStateAction<string>>;
  splitLayout: 'none' | 'right' | 'bottom';
  setSplitLayout: React.Dispatch<React.SetStateAction<'none' | 'right' | 'bottom'>>;
  splitPrimarySize: number;
  setSplitPrimarySize: React.Dispatch<React.SetStateAction<number>>;
  setTabs: (tabs: EditorTab[], activeId: string, paneId?: 'primary' | 'secondary') => void;

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

  // Initial analysis / progress
  setIsInitialAnalysisPending: React.Dispatch<React.SetStateAction<boolean>>;

  // Performance metrics
  perfRecorders: {
    recordLoad: (ms: number) => void;
    recordScanStart: () => void;
    recordScanEnd: () => void;
  };

  addToast: (message: string, type?: ToastType) => void;
}

export interface UseProjectIOReturn {
  loadProject: (path: string) => Promise<void>;
  handleSaveProjectSettings: () => Promise<void>;
  handleSaveAll: () => Promise<void>;
  handleReloadFromDisk: (item: { relativePath: string; absolutePath: string }) => Promise<void>;
  handleRefreshProject: () => Promise<void>;
}

export function useProjectIO(params: UseProjectIOParams): UseProjectIOReturn {
  const {
    loadCancelRef, blocksRef, pendingStoryLayoutRefreshRef, pendingRouteLayoutRefreshRef,
    pendingAutoCenterRef, editorInstances, dirtyBlockIdsRef, dirtyEditorsRef,
    setIsLoading, setLoadingProgress, setLoadingMessage,
    projectRootPath, setProjectRootPath, setFileSystemTree,
    updateAppSettings, projectSettings, updateProjectSettings,
    blocks, setBlocks, directoryHandle,
    setImages, setAudios, imageScanDirectories, setImageScanDirectories,
    audioScanDirectories, setAudioScanDirectories, setIsScanningAssets,
    setIsRefreshingImages, setIsRefreshingAudios, setImagesLastScanned, setAudiosLastScanned,
    stickyNotes, setStickyNotes, routeStickyNotes, setRouteStickyNotes,
    choiceStickyNotes, setChoiceStickyNotes, characterProfiles, setCharacterProfiles,
    punchlistMetadata, setPunchlistMetadata, diagnosticsTasks, setDiagnosticsTasks,
    ignoredDiagnostics, setIgnoredDiagnostics, dismissedImplicitVarHint, setDismissedImplicitVarHint,
    sceneCompositions, setSceneCompositions, sceneNames, setSceneNames,
    imagemapCompositions, setImagemapCompositions,
    routeNodeLayoutCache, setRouteNodeLayoutCache,
    openTabs, setOpenTabs, activeTabId, setActiveTabId,
    secondaryOpenTabs, setSecondaryOpenTabs, secondaryActiveTabId, setSecondaryActiveTabId,
    splitLayout, setSplitLayout, splitPrimarySize, setSplitPrimarySize, setTabs,
    dirtyBlockIds, setDirtyBlockIds, dirtyEditors, setDirtyEditors,
    setHasUnsavedSettings, setSaveStatus, filesWithDiskConflict, setFilesWithDiskConflict,
    setExternallyChangedFiles, notifyFirstSave, openUnsavedChangesModal, closeUnsavedChangesModal,
    setIsInitialAnalysisPending, perfRecorders, addToast,
  } = params;

  const loadProject = useCallback(async (path: string) => {
      loadCancelRef.current = false;
      const loadStartTime = performance.now();
      setIsLoading(true);
      setLoadingProgress(5);
      setLoadingMessage('Reading project files...');
      const unsubscribeProgress = window.electronAPI?.onLoadProgress?.((value, message) => {
          setLoadingProgress(value);
          setLoadingMessage(message);
      });
      try {
          const projectData = await window.electronAPI!.loadProject(path);

          // If the user cancelled while the directory was being read, discard results.
          if (loadCancelRef.current) {
              return;
          }

          setLoadingProgress(93);
          setLoadingMessage(`Processing ${projectData.files.length} files and ${projectData.images.length} images...`);

          const savedStoryBlockLayouts = projectData.settings?.storyBlockLayouts ?? {};
          const savedStoryLayoutMode = projectData.settings?.storyCanvasLayoutMode ?? 'flow-lr';
          const savedStoryGroupingMode = projectData.settings?.storyCanvasGroupingMode ?? 'none';
          const savedRouteNodeLayouts = projectData.settings?.routeNodeLayouts ?? {};
          const savedRouteLayoutMode = projectData.settings?.routeCanvasLayoutMode ?? 'flow-lr';
          const savedRouteGroupingMode = projectData.settings?.routeCanvasGroupingMode ?? 'none';

          // Map existing blocks to preserve IDs and positions
          const existingBlocksMap = new Map<string, Block>();
          // Use ref to get current blocks to avoid stale closures and infinite loop dependency
          blocksRef.current.forEach(b => {
              if (b.filePath) existingBlocksMap.set(b.filePath, b);
          });

          const loadedBlocks: Block[] = projectData.files.map((f, index) => {
              const existing = existingBlocksMap.get(f.path);
              const savedLayout = savedStoryBlockLayouts[f.path];
              return {
                  id: existing ? existing.id : `block-${index}-${Date.now()}`,
                  content: f.content,
                  filePath: f.path,
                  position: savedLayout?.position ?? existing?.position ?? { x: (index % 5) * 350, y: Math.floor(index / 5) * 250 },
                  width: savedLayout?.width ?? existing?.width ?? 320,
                  height: savedLayout?.height ?? existing?.height ?? 200,
                  title: f.path.split('/').pop(),
                  color: savedLayout?.color ?? existing?.color ?? undefined
              };
          });
          const blockFilePathMap = new Map(loadedBlocks.map(b => [b.filePath, b]));

          if (loadedBlocks.length === 0) {
             const defaultBlock = {
                 id: `block-${Date.now()}`,
                 content: `label start:\n    "Welcome to your new project!"\n    return\n`,
                 filePath: `script.rpy`,
                 position: { x: 50, y: 50 },
                 width: 320, height: 200, title: 'script.rpy'
             };
             loadedBlocks.push(defaultBlock);
             if (window.electronAPI?.writeFile) {
                 const scriptPath = await window.electronAPI.path.join(projectData.rootPath as string, 'script.rpy') as string;
                 await window.electronAPI.writeFile(scriptPath, defaultBlock.content);
                 if (projectData.tree) {
                     projectData.tree.children = [...(projectData.tree.children || []), { name: 'script.rpy', path: 'script.rpy' }];
                 }
             }
          }

          setProjectRootPath(projectData.rootPath);

          // Update Recent Projects
          updateAppSettings(draft => {
              // Remove if exists to move to top
              const filtered = draft.recentProjects.filter(p => p !== projectData.rootPath);
              draft.recentProjects = [projectData.rootPath, ...filtered].slice(0, 25);
          });

          setBlocks(loadedBlocks);
          pendingStoryLayoutRefreshRef.current = {
              hasSavedLayouts: Object.keys(savedStoryBlockLayouts).length > 0,
              savedFingerprint: projectData.settings?.storyCanvasLayoutFingerprint,
              savedVersion: projectData.settings?.storyCanvasLayoutVersion,
              savedWasUserAdjusted: projectData.settings?.storyCanvasLayoutWasUserAdjusted ?? false,
          };
          pendingRouteLayoutRefreshRef.current = {
              hasSavedLayouts: Object.keys(savedRouteNodeLayouts).length > 0,
              savedFingerprint: projectData.settings?.routeCanvasLayoutFingerprint,
              savedVersion: projectData.settings?.routeCanvasLayoutVersion,
              savedWasUserAdjusted: projectData.settings?.routeCanvasLayoutWasUserAdjusted ?? false,
          };
          pendingAutoCenterRef.current = { story: true, route: true, choice: true };
          setRouteNodeLayoutCache(new Map(
            Object.entries(savedRouteNodeLayouts).map(([id, layout]) => [id, layout.position]),
          ));
          setFileSystemTree(projectData.tree);

          const imgMap = new Map<string, ProjectImage>();
          projectData.images.forEach((img) => {
              imgMap.set(img.path, {
                  ...img,
                  filePath: img.path,
                  fileName: img.path.split('/').pop(),
                  isInProject: true,
                  fileHandle: null
              });
          });
          setImages(imgMap);

          const audioMap = new Map<string, RenpyAudio>();
          projectData.audios.forEach((aud) => {
              audioMap.set(aud.path, {
                  ...aud,
                  filePath: aud.path,
                  fileName: aud.path.split('/').pop(),
                  isInProject: true,
                  fileHandle: null
              });
          });
          setAudios(audioMap);

          setLoadingProgress(96);
          setLoadingMessage('Restoring workspace...');

          if (projectData.settings) {
              updateProjectSettings(draft => {
                  draft.draftingMode = projectData.settings.draftingMode ?? false;
                  draft.storyCanvasLayoutMode = savedStoryLayoutMode;
                  draft.storyCanvasGroupingMode = savedStoryGroupingMode;
                  draft.storyCanvasLayoutFingerprint = projectData.settings.storyCanvasLayoutFingerprint;
                  draft.storyCanvasLayoutVersion = projectData.settings.storyCanvasLayoutVersion ?? getStoryLayoutVersion();
                  draft.storyCanvasLayoutWasUserAdjusted = projectData.settings.storyCanvasLayoutWasUserAdjusted ?? false;
                  draft.storyCanvasHasAutocentered = false;
                  draft.routeCanvasLayoutMode = savedRouteLayoutMode;
                  draft.routeCanvasGroupingMode = savedRouteGroupingMode;
                  draft.routeCanvasLayoutFingerprint = projectData.settings.routeCanvasLayoutFingerprint;
                  draft.routeCanvasLayoutVersion = projectData.settings.routeCanvasLayoutVersion ?? getRouteCanvasLayoutVersion();
                  draft.routeCanvasLayoutWasUserAdjusted = projectData.settings.routeCanvasLayoutWasUserAdjusted ?? false;
                  draft.routeCanvasHasAutocentered = false;
                  draft.choiceCanvasHasAutocentered = false;
              });
              setStickyNotes(projectData.settings.stickyNotes || []);
              setRouteStickyNotes(projectData.settings.routeStickyNotes || []);
              setChoiceStickyNotes(projectData.settings.choiceStickyNotes || []);
              setCharacterProfiles(projectData.settings.characterProfiles || {});
              setPunchlistMetadata(projectData.settings.punchlistMetadata || {});
              // Diagnostics tasks — migrate from old punchlist metadata if needed
              if (projectData.settings.diagnosticsTasks) {
                setDiagnosticsTasks(projectData.settings.diagnosticsTasks);
              } else if (projectData.settings.punchlistMetadata) {
                setDiagnosticsTasks(migratePunchlistToTasks(projectData.settings.punchlistMetadata));
              } else {
                setDiagnosticsTasks([]);
              }
              setIgnoredDiagnostics(projectData.settings.ignoredDiagnostics || []);
              setDismissedImplicitVarHint(projectData.settings.dismissedImplicitVariableHint || false);

              // Load Scene Compositions
              // Helper to link saved paths back to loaded image objects
              const rehydrateSprite = (s: SerializedSprite): SceneSprite => {
                  const path = s.image.filePath;
                  // Try to find the image in the project images map
                  // If not found (e.g. was external), create a placeholder.
                  const img = imgMap.get(path) || {
                      filePath: path,
                      fileName: path.split(/[/\\]/).pop() || 'unknown',
                      isInProject: false,
                      fileHandle: null,
                      dataUrl: ''
                  };
                  return { ...s, image: img };
              };

              const rehydrateScene = (sc: SerializedSceneComposition): SceneComposition => ({
                  background: sc.background ? rehydrateSprite(sc.background) : null,
                  sprites: (sc.sprites || []).map(rehydrateSprite),
                  resolution: sc.resolution,
              });

              if (projectData.settings.sceneCompositions) {
                  const restoredScenes: Record<string, SceneComposition> = {};
                  Object.entries(projectData.settings.sceneCompositions).forEach(([id, sc]) => {
                      if (isSerializedSceneComposition(sc)) {
                          restoredScenes[id] = {
                              background: sc.background ? rehydrateSprite(sc.background) : null,
                              sprites: sc.sprites.map(rehydrateSprite),
                              resolution: sc.resolution,
                          };
                      } else {
                          logger.warn('Skipping malformed scene composition entry', { id, sc });
                      }
                  });
                  setSceneCompositions(restoredScenes);
                  setSceneNames(projectData.settings.sceneNames || {});
              } else {
                  // Migration for legacy single scene (pre-multi-scene format)
                  const settings = projectData.settings as unknown as Record<string, unknown>;
                  const legacyScene = settings.sceneComposition;
                  if (isSerializedSceneComposition(legacyScene)) {
                      const defaultId = 'scene-default';
                      setSceneCompositions({ [defaultId]: rehydrateScene(legacyScene) });
                      setSceneNames({ [defaultId]: 'Default Scene' });
                  } else {
                      setSceneCompositions({});
                      setSceneNames({});
                  }
              }

              // Restore ImageMap Compositions
              if (projectData.settings.imagemapCompositions) {
                  const restoredImagemaps: Record<string, ImageMapComposition> = {};
                  Object.entries(projectData.settings.imagemapCompositions).forEach(([id, im]) => {
                      if (isSerializedImageMapComposition(im)) {
                          const groundImg = im.groundImage ? imgMap.get(im.groundImage.filePath) : null;
                          const hoverImg = im.hoverImage ? imgMap.get(im.hoverImage.filePath) : null;
                          restoredImagemaps[id] = {
                              screenName: im.screenName,
                              groundImage: groundImg || null,
                              hoverImage: hoverImg || null,
                              hotspots: im.hotspots
                          };
                      } else {
                          logger.warn('Skipping malformed imagemap composition entry', { id, im });
                      }
                  });
                  setImagemapCompositions(restoredImagemaps);
              } else {
                  setImagemapCompositions({});
              }

              // Restore Scan Directories
              if (projectData.settings.scannedImagePaths) {
                  const paths = projectData.settings.scannedImagePaths;
                  const map = new Map<string, FileSystemDirectoryHandle>();
                  paths.forEach((p) => map.set(p, null as unknown as FileSystemDirectoryHandle));
                  setImageScanDirectories(map);

                  // Trigger scan
                  if (window.electronAPI) {
                       perfRecorders.recordScanStart();
                       setIsScanningAssets(true);
                       setIsRefreshingImages(true);
                       Promise.all(paths.map((dirPath) =>
                           window.electronAPI!.scanDirectory(dirPath).then(({ images: scanned }) => {
                               setImages(prev => {
                                   const next = new Map(prev);
                                   scanned.forEach((img) => {
                                       if (!next.has(img.path)) {
                                           // Check if this file exists in the project
                                           const fileName = img.path.split('/').pop();
                                           const potentialProjectPath = `game/images/${fileName}`;
                                           const linkedPath = next.has(potentialProjectPath) ? potentialProjectPath : undefined;

                                           // Ensure external images also have filePath set correctly
                                           next.set(img.path, {
                                             ...img,
                                             filePath: img.path,
                                             isInProject: false,
                                             fileHandle: null,
                                             projectFilePath: linkedPath
                                           });
                                       }
                                   });
                                   return next;
                               });
                           })
                       )).finally(() => { perfRecorders.recordScanEnd(); setIsScanningAssets(false); setIsRefreshingImages(false); setImagesLastScanned(Date.now()); });
                  }
              }

              if (projectData.settings.scannedAudioPaths) {
                  const paths = projectData.settings.scannedAudioPaths;
                  const map = new Map<string, FileSystemDirectoryHandle>();
                  paths.forEach((p) => map.set(p, null as unknown as FileSystemDirectoryHandle));
                  setAudioScanDirectories(map);

                  // Trigger scan
                  if (window.electronAPI) {
                       perfRecorders.recordScanStart();
                       setIsScanningAssets(true);
                       setIsRefreshingAudios(true);
                       Promise.all(paths.map((dirPath) =>
                           window.electronAPI!.scanDirectory(dirPath).then(({ audios: scanned }) => {
                               setAudios(prev => {
                                   const next = new Map(prev);
                                   scanned.forEach((aud) => {
                                       if (!next.has(aud.path)) {
                                           // Check if this file exists in the project
                                           const fileName = aud.path.split('/').pop();
                                           const potentialProjectPath = `game/audio/${fileName}`;
                                           const linkedPath = next.has(potentialProjectPath) ? potentialProjectPath : undefined;

                                           // Ensure external audio also have filePath set correctly
                                           next.set(aud.path, {
                                             ...aud,
                                             filePath: aud.path,
                                             isInProject: false,
                                             fileHandle: null,
                                             projectFilePath: linkedPath
                                           });
                                       }
                                   });
                                   return next;
                               });
                           })
                       )).finally(() => { perfRecorders.recordScanEnd(); setIsScanningAssets(false); setIsRefreshingAudios(false); setAudiosLastScanned(Date.now()); });
                  }
              }

              const savedTabs: EditorTab[] = projectData.settings.openTabs ?? [{ id: 'canvas', type: 'canvas' }];

              const validTabs = savedTabs.filter(tab => {
                  if (tab.type === 'editor' && tab.filePath) {
                      return blockFilePathMap.has(tab.filePath);
                  }
                  if (tab.type === 'image' && tab.filePath) {
                      return imgMap.has(tab.filePath);
                  }
                  if (tab.type === 'audio' && tab.filePath) {
                      return audioMap.has(tab.filePath);
                  }
                  if (tab.type === 'character' && tab.characterTag) {
                      return true; // deferred — worker analysis validates at render time
                  }
                  if (tab.type === 'scene-composer' && tab.sceneId) {
                      // We allow opening even if not strictly in state yet (might be migrated)
                      return true;
                  }
                  if (tab.type === 'markdown' && tab.filePath) {
                      return true; // File existence checked on tab render
                  }
                  return tab.type === 'canvas' || tab.type === 'route-canvas' || tab.type === 'choice-canvas' || tab.type === 'punchlist' || tab.type === 'diagnostics' || tab.type === 'stats' || tab.type === 'translations' || tab.type === 'screen-preview';
              });

              const rehydratedTabs = validTabs.map(tab => {
                  if (tab.type === 'editor' && tab.filePath) {
                      const matchingBlock = blockFilePathMap.get(tab.filePath);
                      if (matchingBlock) {
                          return { ...tab, id: matchingBlock.id, blockId: matchingBlock.id };
                      }
                  }
                  // Migrate old punchlist tab to diagnostics
                  if (tab.type === 'punchlist' || tab.id === 'punchlist') {
                      return { ...tab, type: 'diagnostics' as const, id: 'diagnostics' };
                  }
                  // Migrate old single scene tab
                  if (tab.type === 'scene-composer' && !tab.sceneId) {
                      return { ...tab, sceneId: 'scene-default' };
                  }
                  return tab;
              });

              const activeTabIsValid = rehydratedTabs.some(t => t.id === projectData.settings.activeTabId);
              setTabs(rehydratedTabs, activeTabIsValid ? projectData.settings.activeTabId : 'canvas', 'primary');

              // Restore split state
              const savedSplitLayout = projectData.settings.splitLayout ?? 'none';
              const savedSecondary: EditorTab[] = projectData.settings.secondaryOpenTabs ?? [];
              const validSecondary = savedSecondary.filter((tab: EditorTab) => {
                  if (tab.type === 'editor' && tab.filePath) return blockFilePathMap.has(tab.filePath);
                  if (tab.type === 'image' && tab.filePath) return imgMap.has(tab.filePath);
                  if (tab.type === 'audio' && tab.filePath) return audioMap.has(tab.filePath);
                  if (tab.type === 'character' && tab.characterTag) return true;
                  if (tab.type === 'markdown' && tab.filePath) return true;
                  return tab.type === 'canvas' || tab.type === 'route-canvas' || tab.type === 'choice-canvas' || tab.type === 'punchlist' || tab.type === 'diagnostics' || tab.type === 'stats' || tab.type === 'translations' || tab.type === 'scene-composer' || tab.type === 'screen-preview';
              });
              setSplitLayout(validSecondary.length > 0 ? savedSplitLayout : 'none');
              setSplitPrimarySize(projectData.settings.splitPrimarySize ?? 600);
              setSecondaryOpenTabs(validSecondary);
              const savedSecondaryActive = projectData.settings.secondaryActiveTabId ?? '';
              setSecondaryActiveTabId(validSecondary.some((t: EditorTab) => t.id === savedSecondaryActive) ? savedSecondaryActive : validSecondary[0]?.id ?? '');

          } else {
              updateProjectSettings(draft => {
                  draft.draftingMode = false;
                  draft.storyCanvasLayoutMode = 'flow-lr';
                  draft.storyCanvasGroupingMode = 'none';
                  draft.storyCanvasLayoutFingerprint = undefined;
                  draft.storyCanvasLayoutVersion = getStoryLayoutVersion();
                  draft.storyCanvasLayoutWasUserAdjusted = false;
                  draft.routeCanvasLayoutMode = 'flow-lr';
                  draft.routeCanvasGroupingMode = 'none';
                  draft.routeCanvasLayoutFingerprint = undefined;
                  draft.routeCanvasLayoutVersion = getRouteCanvasLayoutVersion();
                  draft.routeCanvasLayoutWasUserAdjusted = false;
              });
              setRouteNodeLayoutCache(new Map());
              setOpenTabs([{ id: 'canvas', type: 'canvas' }]);
              setActiveTabId('canvas');
              setSplitLayout('none');
              setSecondaryOpenTabs([]);
              setSecondaryActiveTabId('');
              setStickyNotes([]);
              setRouteStickyNotes([]);
              setChoiceStickyNotes([]);
              setCharacterProfiles({});
              setPunchlistMetadata({});
              setDiagnosticsTasks([]);
              setIgnoredDiagnostics([]);
              setSceneCompositions({});
              setSceneNames({});
          }

          setLoadingProgress(99);
          setLoadingMessage('Done');
          setIsInitialAnalysisPending(true);
          setHasUnsavedSettings(false);
          perfRecorders.recordLoad(performance.now() - loadStartTime);
          addToast('Project loaded successfully', 'success');
      } catch (err) {
          if (loadCancelRef.current) {
              return;
          }
          logger.error('Failed to load project', err);
          addToast('Failed to load project', 'error');
      } finally {
          unsubscribeProgress?.();
          setIsLoading(false);
          setLoadingMessage('');
          setLoadingProgress(0);
      }
  }, [setBlocks, setImages, setAudios, updateProjectSettings, addToast, setFileSystemTree, setStickyNotes, setRouteStickyNotes, setChoiceStickyNotes, setCharacterProfiles, updateAppSettings, setSceneCompositions, setSceneNames, setPunchlistMetadata, setImagemapCompositions, setDiagnosticsTasks, setIgnoredDiagnostics, perfRecorders, setActiveTabId, setAudioScanDirectories, setAudiosLastScanned, setImageScanDirectories, setImagesLastScanned, setIsRefreshingAudios, setIsRefreshingImages, setOpenTabs, setProjectRootPath, setSecondaryActiveTabId, setSecondaryOpenTabs, setSplitLayout, setSplitPrimarySize, setTabs, setDismissedImplicitVarHint, setIsScanningAssets, setRouteNodeLayoutCache, setIsLoading, setLoadingMessage, setLoadingProgress, setHasUnsavedSettings, setIsInitialAnalysisPending, loadCancelRef, blocksRef, pendingStoryLayoutRefreshRef, pendingRouteLayoutRefreshRef, pendingAutoCenterRef]);

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
    loadProject,
    handleSaveProjectSettings,
    handleSaveAll,
    handleReloadFromDisk,
    handleRefreshProject,
  };
}
