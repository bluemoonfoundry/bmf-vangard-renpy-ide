/**
 * @file useProjectLoad.ts
 * @description Custom hook owning the loadProject callback — the project-open
 * hydration flow that reads IPC data and fans it out to ~40 state setters.
 * Extracted from useProjectIO to keep the save/reload/refresh concerns separate.
 *
 * LONG-TERM: This hook and the 40-param interface are symptoms of a missing
 * abstraction. The correct fix (tracked in beads issue 7c5) is to introduce a
 * typed `ProjectSnapshot` value object and a `hydrateFromProjectData` pure
 * function so the hydration logic is testable without mocking all these setters.
 */

import { useCallback } from 'react';
import type { Updater } from 'use-immer';
import { migratePunchlistToTasks } from '@/hooks/useDiagnostics';
import { getStoryLayoutVersion } from '@/lib/storyCanvasLayout';
import { getRouteCanvasLayoutVersion } from '@/lib/routeCanvasLayout';
import { isSerializedSceneComposition, isSerializedImageMapComposition } from '@/lib/typeGuards';
import { logger } from '@/lib/logger';
import type {
  Block, Position, FileSystemTreeNode, EditorTab, ProjectImage, RenpyAudio,
  AppSettings, ProjectSettings, SceneComposition, SceneSprite, ImageMapComposition,
  PunchlistMetadata, DiagnosticsTask, IgnoredDiagnosticRule, StickyNote,
  SerializedSprite, SerializedSceneComposition,
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

type ProjectSettingsSlice = Omit<ProjectSettings,
  'openTabs' | 'activeTabId' | 'stickyNotes' | 'characterProfiles' | 'punchlistMetadata' |
  'diagnosticsTasks' | 'ignoredDiagnostics' | 'sceneCompositions' | 'sceneNames' |
  'scannedImagePaths' | 'scannedAudioPaths'>;

type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface UseProjectLoadParams {
  // Refs
  loadCancelRef: React.MutableRefObject<boolean>;
  blocksRef: React.MutableRefObject<Block[]>;
  pendingStoryLayoutRefreshRef: React.MutableRefObject<PendingStoryLayoutRefresh | null>;
  pendingRouteLayoutRefreshRef: React.MutableRefObject<PendingRouteLayoutRefresh | null>;
  pendingAutoCenterRef: React.MutableRefObject<{ story: boolean; route: boolean; choice: boolean }>;

  // Loading overlay state
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingProgress: React.Dispatch<React.SetStateAction<number>>;
  setLoadingMessage: React.Dispatch<React.SetStateAction<string>>;

  // Project root / file tree
  setProjectRootPath: React.Dispatch<React.SetStateAction<string | null>>;
  setFileSystemTree: React.Dispatch<React.SetStateAction<FileSystemTreeNode | null>>;

  // App / project settings
  updateAppSettings: (updater: (draft: AppSettings) => void) => void;
  updateProjectSettings: (updater: (draft: ProjectSettingsSlice) => void) => void;

  // Blocks
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;

  // Assets
  setImages: React.Dispatch<React.SetStateAction<Map<string, ProjectImage>>>;
  setAudios: React.Dispatch<React.SetStateAction<Map<string, RenpyAudio>>>;
  setImageScanDirectories: React.Dispatch<React.SetStateAction<Map<string, FileSystemDirectoryHandle>>>;
  setAudioScanDirectories: React.Dispatch<React.SetStateAction<Map<string, FileSystemDirectoryHandle>>>;
  setIsScanningAssets: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRefreshingImages: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRefreshingAudios: React.Dispatch<React.SetStateAction<boolean>>;
  setImagesLastScanned: React.Dispatch<React.SetStateAction<number | null>>;
  setAudiosLastScanned: React.Dispatch<React.SetStateAction<number | null>>;

  // Sticky notes / character profiles / diagnostics
  setStickyNotes: Updater<StickyNote[]>;
  setRouteStickyNotes: Updater<StickyNote[]>;
  setChoiceStickyNotes: Updater<StickyNote[]>;
  setCharacterProfiles: Updater<Record<string, string>>;
  setPunchlistMetadata: Updater<Record<string, PunchlistMetadata>>;
  setDiagnosticsTasks: Updater<DiagnosticsTask[]>;
  setIgnoredDiagnostics: Updater<IgnoredDiagnosticRule[]>;
  setDismissedImplicitVarHint: React.Dispatch<React.SetStateAction<boolean>>;

  // Scene / imagemap compositions
  setSceneCompositions: Updater<Record<string, SceneComposition>>;
  setSceneNames: Updater<Record<string, string>>;
  setImagemapCompositions: Updater<Record<string, ImageMapComposition>>;

  // Route canvas layout
  setRouteNodeLayoutCache: React.Dispatch<React.SetStateAction<Map<string, Position>>>;

  // Tabs
  setOpenTabs: React.Dispatch<React.SetStateAction<EditorTab[]>>;
  setActiveTabId: React.Dispatch<React.SetStateAction<string>>;
  setSecondaryOpenTabs: React.Dispatch<React.SetStateAction<EditorTab[]>>;
  setSecondaryActiveTabId: React.Dispatch<React.SetStateAction<string>>;
  setSplitLayout: React.Dispatch<React.SetStateAction<'none' | 'right' | 'bottom'>>;
  setSplitPrimarySize: React.Dispatch<React.SetStateAction<number>>;
  setTabs: (tabs: EditorTab[], activeId: string, paneId?: 'primary' | 'secondary') => void;

  // Save state
  setHasUnsavedSettings: React.Dispatch<React.SetStateAction<boolean>>;

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

export interface UseProjectLoadReturn {
  loadProject: (path: string) => Promise<void>;
}

export function useProjectLoad(params: UseProjectLoadParams): UseProjectLoadReturn {
  const {
    loadCancelRef, blocksRef, pendingStoryLayoutRefreshRef, pendingRouteLayoutRefreshRef,
    pendingAutoCenterRef,
    setIsLoading, setLoadingProgress, setLoadingMessage,
    setProjectRootPath, setFileSystemTree,
    updateAppSettings, updateProjectSettings,
    setBlocks,
    setImages, setAudios, setImageScanDirectories, setAudioScanDirectories, setIsScanningAssets,
    setIsRefreshingImages, setIsRefreshingAudios, setImagesLastScanned, setAudiosLastScanned,
    setStickyNotes, setRouteStickyNotes, setChoiceStickyNotes, setCharacterProfiles,
    setPunchlistMetadata, setDiagnosticsTasks, setIgnoredDiagnostics, setDismissedImplicitVarHint,
    setSceneCompositions, setSceneNames, setImagemapCompositions,
    setRouteNodeLayoutCache,
    setOpenTabs, setActiveTabId, setSecondaryOpenTabs, setSecondaryActiveTabId,
    setSplitLayout, setSplitPrimarySize, setTabs,
    setHasUnsavedSettings,
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

  return { loadProject };
}
