import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useImmer } from 'use-immer';
import Toolbar from '@/components/Toolbar';
import FileExplorerPanel from '@/components/FileExplorerPanel';
import SearchPanel from '@/components/SearchPanel';
import StoryElementsPanel from '@/components/StoryElementsPanel';
import SettingsModal from '@/components/SettingsModal';
import ConfirmModal from '@/components/ConfirmModal';
import CreateBlockModal, { BlockType } from '@/components/CreateBlockModal';
import ConfigureRenpyModal from '@/components/ConfigureRenpyModal';
import Toast from '@/components/Toast';
import LoadingOverlay from '@/components/LoadingOverlay';
import AnalysisOverlay from '@/components/AnalysisOverlay';
import WarpVariablesModal from '@/components/WarpVariablesModal';
import { useDiagnostics } from '@/hooks/useDiagnostics';
import { useDebounce } from '@/hooks/useDebounce';
import TabContextMenu from '@/components/TabContextMenu';
import Sash from '@/components/Sash';
import StatusBar from '@/components/StatusBar';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';
import AboutModal from '@/components/AboutModal';
import UserSnippetModal from '@/components/UserSnippetModal';
import NewProjectWizardModal from '@/components/NewProjectWizardModal';
import { MenuConstructorModal } from '@/components/MenuConstructorModal';
import FirstRunTutorial from '@/components/FirstRunTutorial';
import { SearchProvider } from '@/contexts/SearchContext';
import { DualPaneContext } from '@/contexts/DualPaneContext';
import type { DualPaneContextValue } from '@/contexts/DualPaneContext';
import GoToLabelModal, { GoToLabelItem } from '@/components/GoToLabelModal';
import { useRenpyAnalysis, deriveSceneImageNames } from '@/hooks/useRenpyAnalysis';
import { useHistory } from '@/hooks/useHistory';
import { useProjectColorScan } from '@/hooks/useProjectColorScan';
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics';
import { useToasts } from '@/hooks/useToasts';
import { useMilestones } from '@/hooks/useMilestones';
import { useModalState } from '@/hooks/useModalState';
import { useTabManagement } from '@/hooks/useTabManagement';
import { useCanvasInteraction } from '@/hooks/useCanvasInteraction';
import { useAssetManagement } from '@/hooks/useAssetManagement';
import { useDraftingArtifacts } from '@/hooks/useDraftingArtifacts';
import { useCompositionState } from '@/hooks/useCompositionState';
import { useSettingsManagement } from '@/hooks/useSettingsManagement';
import { useFileSystemState } from '@/hooks/useFileSystemState';
import { useStickyNotes } from '@/hooks/useStickyNotes';
import { useProjectIO, type PendingStoryLayoutRefresh, type PendingRouteLayoutRefresh } from '@/hooks/useProjectIO';
import { useFileSystemManager } from '@/hooks/useFileSystemManager';
import { useTabContentRenderer } from '@/hooks/useTabContentRenderer';
import { useCharacterManagement } from '@/hooks/useCharacterManagement';
import { useTabLifecycle } from '@/hooks/useTabLifecycle';
import { useTabOpeners } from '@/hooks/useTabOpeners';
import { formatErrorMessage } from '@/lib/formatErrorMessage';
import {
  computeStoryLayout,
  computeStoryLayoutFingerprint,
  getStoryLayoutVersion,
} from '@/lib/storyCanvasLayout';
import {
  computeRouteCanvasLayout,
  computeRouteCanvasLayoutFingerprint,
  getRouteCanvasLayoutVersion,
} from '@/lib/routeCanvasLayout';
import { resolveWarpTarget } from '@/lib/warpTarget';
import { logger } from '@/lib/logger';
import { UI_TIMING } from '@/lib/constants';
import {
  buildAfterWarpScript,
  getWarpVariableDrafts,
  hasAfterWarpLabel,
  type WarpVariableDraft,
} from '@/lib/warpAfterWarp';
import type {
  Block, BlockGroup, Position, FileSystemTreeNode, EditorTab,
  ToastMessage, Theme, Variable,
  ImageMetadata, AudioMetadata,
  ProjectSettings, PunchlistMetadata, DiagnosticsTask, IgnoredDiagnosticRule,
  StoryCanvasGroupingMode, StoryCanvasLayoutMode, UserSnippet, MenuTemplate
} from '@/types';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';



// --- Main App Component ---

const App: React.FC = () => {
  // --- State: Blocks & Groups (Undo/Redo) ---
  const { state: blocks, setState: setBlocks, undo, redo, canUndo, canRedo } = useHistory<Block[]>([]);
  const [groups, setGroups] = useImmer<BlockGroup[]>([]);
  
  // Use a ref to track blocks for effects that need current blocks without triggering updates
  const blocksRef = useRef(blocks);
  useEffect(() => { blocksRef.current = blocks; }, [blocks]);

  // --- State: File System & Environment ---
  const {
    projectRootPath,
    setProjectRootPath,
    fileSystemTree,
    setFileSystemTree,
    explorerSelectedPaths,
    explorerLastClickedPath,
    setExplorerSelectedPaths,
    setExplorerLastClickedPath,
    explorerExpandedPaths,
    setExplorerExpandedPaths,
    explorerExternalAction,
    setExplorerExternalAction,
    clipboard,
    setClipboard,
    selectPath: _selectPath,
    selectPaths: _selectPaths,
    clearExplorerSelection: _clearExplorerSelection,
    expandPath: _expandPath,
    collapsePath: _collapsePath,
    toggleExpansion: _toggleExpansion,
    expandAll: _expandAll,
    collapseAll: _collapseAll,
    triggerNewFile: _triggerNewFile,
    triggerNewFolder: _triggerNewFolder,
    triggerRename: _triggerRename,
    copyToClipboard: _copyToClipboard,
    cutToClipboard: _cutToClipboard,
    clearClipboard: _clearClipboard,
    closeProject: _closeFileSystemProject,
  } = useFileSystemState();

  // Update window title based on project path
  useEffect(() => {
    if (projectRootPath) {
      document.title = `Ren'IDE (${projectRootPath})`;
    } else {
      document.title = "Ren'IDE";
    }
  }, [projectRootPath]);

  const [directoryHandle] = useState<FileSystemDirectoryHandle | null>(null);

  // --- State: UI & Editor ---
  const {
    openTabs,
    activeTabId,
    setOpenTabs,
    setActiveTabId,
    secondaryOpenTabs,
    secondaryActiveTabId,
    activePaneId,
    setSecondaryOpenTabs,
    setSecondaryActiveTabId,
    setActivePaneId,
    splitLayout,
    splitPrimarySize,
    setSplitLayout,
    setSplitPrimarySize,
    draggedTabId,
    dragSourcePaneId,
    setDraggedTabId,
    setDragSourcePaneId,
    openTab: _openTab,
    closeTab: _closeTab,
    switchTab: _switchTab,
    updateTab: _updateTab,
    closeTabs: _closeTabs,
    setTabs,
    createSplit: _createSplit,
    closeSplit: _closeSplit,
    setSplitSize: _setSplitSize,
    moveTabToPane: _moveTabToPane,
    startDrag: _startTabDrag,
    endDrag: _endTabDrag,
    findTab: _findTab,
    getActiveTab: _getActiveTab,
  } = useTabManagement();

  // Canvas interaction state
  const {
    storyCanvasTransform,
    routeCanvasTransform,
    choiceCanvasTransform,
    setStoryCanvasTransform,
    setRouteCanvasTransform,
    setChoiceCanvasTransform,
    selectedBlockIds,
    selectedGroupIds,
    setSelectedBlockIds,
    setSelectedGroupIds,
    findUsagesHighlightIds,
    hoverHighlightIds,
    setFindUsagesHighlightIds,
    setHoverHighlightIds,
    centerOnBlockRequest,
    centerOnRouteStartRequest,
    centerOnChoiceStartRequest,
    centerOnRouteNodeRequest,
    centerOnChoiceNodeRequest,
    flashBlockRequest,
    setCenterOnBlockRequest,
    setCenterOnRouteStartRequest,
    setCenterOnChoiceStartRequest,
    setCenterOnRouteNodeRequest,
    setCenterOnChoiceNodeRequest,
    setFlashBlockRequest,
    canvasFilters,
    setCanvasFilters,
    centerOnBlock: _centerOnBlock,
    flashBlock: _flashBlock,
    centerOnRouteNode: _centerOnRouteNode,
    centerOnChoiceNode: _centerOnChoiceNode,
    centerOnRouteStart: _centerOnRouteStart,
    centerOnChoiceStart: _centerOnChoiceStart,
    clearSelection: _clearSelection,
    selectBlocks: _selectBlocks,
    selectGroups: _selectGroups,
    toggleBlockSelection: _toggleBlockSelection,
  } = useCanvasInteraction();
  // Punchlist State (kept for migration — not written on save)
  const [punchlistMetadata, setPunchlistMetadata] = useImmer<Record<string, PunchlistMetadata>>({});
  // Diagnostics Tasks State
  const [diagnosticsTasks, setDiagnosticsTasks] = useImmer<DiagnosticsTask[]>([]);
  const [ignoredDiagnostics, setIgnoredDiagnostics] = useImmer<IgnoredDiagnosticRule[]>([]);
  const [dismissedImplicitVarHint, setDismissedImplicitVarHint] = useState(false);

  const [dirtyBlockIds, setDirtyBlockIds] = useState<Set<string>>(new Set());
  const [dirtyEditors, setDirtyEditors] = useState<Set<string>>(new Set()); // Blocks modified in editor but not synced to block state yet
  // Refs mirroring dirty state for callbacks that need current values without re-creating on every change.
  const dirtyBlockIdsRef = useRef(dirtyBlockIds);
  const dirtyEditorsRef = useRef(dirtyEditors);
  useEffect(() => { dirtyBlockIdsRef.current = dirtyBlockIds; }, [dirtyBlockIds]);
  useEffect(() => { dirtyEditorsRef.current = dirtyEditors; }, [dirtyEditors]);
  const [hasUnsavedSettings, setHasUnsavedSettings] = useState(false); // Track project setting changes like sticky notes
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error'>('saved');

  // Composition state (Scene/ImageMap/ScreenLayout composers)
  const {
    sceneCompositions,
    sceneNames,
    setSceneCompositions,
    setSceneNames,
    imagemapCompositions,
    setImagemapCompositions,
    clearAllCompositions: _clearAllCompositions,
    handleCreateScene,
    handleOpenScene,
    handleSceneUpdate,
    handleRenameScene,
    handleDeleteScene,
    handleCreateImageMap,
    handleOpenImageMap,
    handleImageMapUpdate,
    handleRenameImageMap,
    handleDeleteImageMap,
  } = useCompositionState({ activeTabId, setOpenTabs, setActiveTabId, setHasUnsavedSettings });
  const [isScanningAssets, setIsScanningAssets] = useState(false);

  // Toast notifications
  const { toasts, addToast, removeToast } = useToasts();

  // Modal state
  const {
    createBlockModalOpen,
    createBlockModalType,
    createBlockModalPosition,
    createBlockModalFolderPath,
    openCreateBlockModal,
    closeCreateBlockModal,
    deleteConfirmInfo,
    openDeleteConfirmModal,
    closeDeleteConfirmModal,
    unsavedChangesModalInfo,
    openUnsavedChangesModal,
    closeUnsavedChangesModal,
    contextMenuInfo,
    openContextMenu,
    closeContextMenu,
    settingsModalOpen,
    openSettingsModal,
    closeSettingsModal,
    shortcutsModalOpen,
    openShortcutsModal,
    closeShortcutsModal,
    aboutModalOpen,
    openAboutModal,
    closeAboutModal,
    showConfigureRenpyModal,
    closeConfigureRenpyModal,
    wizardModalOpen,
    openWizardModal,
    closeWizardModal,
    showTutorial,
    openTutorial,
    closeTutorial,
    isGoToLabelOpen,
    openGoToLabelModal,
    closeGoToLabelModal,
    isWarpToLabelOpen,
    openWarpToLabelModal,
    closeWarpToLabelModal,
    isWarpVariablesOpen,
    openWarpVariablesModal,
    closeWarpVariablesModal,
    userSnippetModalOpen,
    editingSnippet,
    openUserSnippetModal,
    closeUserSnippetModal,
    menuConstructorModalOpen,
    editingMenuTemplate,
    openMenuConstructorModal,
    closeMenuConstructorModal,
  } = useModalState();

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialAnalysisPending, setIsInitialAnalysisPending] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadCancelRef = useRef(false);
  const [nonRenpyWarningPath, setNonRenpyWarningPath] = useState<string | null>(null);
  const [externallyChangedFiles, setExternallyChangedFiles] = useState<Array<{ relativePath: string; absolutePath: string }>>([]);
  // Tracks files where the user chose "Keep current" after a disk change, so we can warn before overwriting.
  const [filesWithDiskConflict, setFilesWithDiskConflict] = useState<Set<string>>(new Set());
  
  // --- State: Game Execution ---
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [screenshotCount, setScreenshotCount] = useState(0);

  // --- State: Application and Project Settings ---
  const {
    appSettings,
    updateAppSettings,
    appSettingsLoaded,
    setAppSettingsLoaded,
    projectSettings,
    updateProjectSettings,
    characterProfiles,
    setCharacterProfiles,
    isRenpyPathValid,
    setIsRenpyPathValid,
    isGeneratingTranslations,
    setIsGeneratingTranslations,
    updateTheme: _updateTheme,
    updateRenpyPath: _updateRenpyPath,
    updateEditorFont: _updateEditorFont,
    toggleSidebar: _toggleSidebar,
    updateSidebarWidth: _updateSidebarWidth,
    addRecentProject: _addRecentProject,
    removeRecentProject: _removeRecentProject,
    clearRecentProjects: _clearRecentProjects,
    resetAppSettings: _resetAppSettings,
    resetProjectSettings: _resetProjectSettings,
  } = useSettingsManagement();

  // Sticky notes (managed separately from composition state)
  const {
    stickyNotes,
    routeStickyNotes,
    choiceStickyNotes,
    setStickyNotes,
    setRouteStickyNotes,
    setChoiceStickyNotes,
    addStickyNote,
    updateStickyNote,
    deleteStickyNote,
    addRouteStickyNote,
    updateRouteStickyNote,
    deleteRouteStickyNote,
    addChoiceStickyNote,
    updateChoiceStickyNote,
    deleteChoiceStickyNote,
    clearAllStickyNotes: _clearAllStickyNotes,
  } = useStickyNotes({
    appSettings,
    storyCanvasTransform,
    onStickyNoteChange: () => setHasUnsavedSettings(true),
  });

  // --- State: Misc ---
  const [pendingWarpLabelName, setPendingWarpLabelName] = useState<string | null>(null);
  const [pendingWarpTarget, setPendingWarpTarget] = useState<string | null>(null);
  const [pendingWarpVariableDrafts, setPendingWarpVariableDrafts] = useState<WarpVariableDraft[]>([]);
  const [editorCursorPosition, setEditorCursorPosition] = useState<{ line: number; column: number } | null>(null);
  const [editorCursorBlockId, setEditorCursorBlockId] = useState<string | null>(null);
  const warpTempFilePathRef = useRef<string | null>(null);

  // --- State: Flow Canvas (label-level flow graph) ---
  const [routeNodeLayoutCache, setRouteNodeLayoutCache] = useState<Map<string, Position>>(new Map());

  // --- State: Search (panel toggle remains here; query/results live in SearchContext) ---
  const [activeLeftPanel, setActiveLeftPanel] = useState<'explorer' | 'search'>('explorer');

  // --- Analysis ---
  // Debounce block content changes before feeding them into expensive analysis passes.
  // The editor state (`blocks`) updates immediately on every keystroke; analysis only
  // runs after 500 ms of inactivity, preventing main-thread freezes during active typing.
  const debouncedBlocks = useDebounce(blocks, 500);

  // Slim block objects for the analysis worker — position/size are irrelevant to parsing
  // and including them caused re-analysis on every canvas drag.
  const analysisBlocks = useMemo(
    () => debouncedBlocks.map(({ id, content, filePath }) => ({ id, content, filePath })),
    [debouncedBlocks],
  );

  const [perfSnapshot, perfRecorders] = usePerformanceMetrics();

  // Asset management state
  const {
    images,
    imageMetadata,
    imageScanDirectories,
    imagesLastScanned,
    isRefreshingImages,
    setImages,
    setImageMetadata,
    setImageScanDirectories,
    setImagesLastScanned,
    setIsRefreshingImages,
    audios,
    audioMetadata,
    audioScanDirectories,
    audiosLastScanned,
    isRefreshingAudios,
    setAudios,
    setAudioMetadata,
    setAudioScanDirectories,
    setAudiosLastScanned,
    setIsRefreshingAudios,
    addImage: _addImage,
    removeImage: _removeImage,
    updateImageMetadata: _updateImageMetadata,
    addAudio: _addAudio,
    removeAudio: _removeAudio,
    updateAudioMetadata: _updateAudioMetadata,
    clearImages: _clearImages,
    clearAudios: _clearAudios,
    handleAddImageScanDirectory,
    handleRefreshImages,
    handleRemoveImageScanDirectory,
    handleCopyImagesToProjectBulk,
    handleAddAudioScanDirectory,
    handleRefreshAudios,
    handleRemoveAudioScanDirectory,
    handleCopyAudiosToProjectBulk,
  } = useAssetManagement({
    projectRootPath, perfRecorders, setIsScanningAssets, setHasUnsavedSettings, setFileSystemTree, addToast,
  });

  const [analysisResult, isWorkerPending, analysisProgress] = useRenpyAnalysis(analysisBlocks, 0, perfRecorders.recordAnalysis);
  // Pending covers both: the 500ms debounce window AND the worker's async computation
  const isAnalysisPending = blocks !== debouncedBlocks || isWorkerPending;
  const diagnosticsResult = useDiagnostics(debouncedBlocks, analysisResult, images, imageMetadata, audios, audioMetadata, ignoredDiagnostics);

  // Ref that latches to true once the analysis worker starts (isWorkerPending goes true)
  // after a project load. Prevents the overlay from closing during the one-render gap
  // between debouncedBlocks updating (which makes isAnalysisPending briefly false) and
  // the useRenpyAnalysis effect actually posting to the worker.
  const analysisWorkerHasStartedRef = useRef(false);

  useEffect(() => {
    if (!isInitialAnalysisPending) {
      // Reset the latch so the next project load works correctly.
      analysisWorkerHasStartedRef.current = false;
      return;
    }
    if (isWorkerPending) {
      // Worker has started — latch on.
      analysisWorkerHasStartedRef.current = true;
    } else if (analysisWorkerHasStartedRef.current) {
      // Worker was running and is now done — safe to close the overlay.
      setIsInitialAnalysisPending(false);
    }
  }, [isWorkerPending, isInitialAnalysisPending]);

  // Memoized flat arrays — Map.values() iteration is O(n); without this every
  // renderTabContent call recreated 14,000-item arrays on each re-render.
  const imagesArray = useMemo(() => Array.from(images.values()), [images]);

  // Stable array of character tag strings passed to CharacterEditorView.
  // Without this, Array.from() in renderTabContent creates a new reference every
  // render, defeating React.memo on CharacterEditorView.
  const characterTagsArray = useMemo(
    () => Array.from(analysisResult.characters.keys()),
    [analysisResult.characters],
  );
  
  const { notifyFirstSave } = useMilestones({
    blocks,
    analysisResult,
    images,
    projectSettings,
    updateProjectSettings,
    addToast,
  });

  // --- Refs ---
  const editorInstances = useRef<Map<string, monaco.editor.IStandaloneCodeEditor>>(new Map());
  // Lazy-mount sets: a tab's content is only rendered once it has been the active tab at
  // least once. After first activation the content stays mounted (visibility: hidden when
  // inactive) so editor state, scroll positions, etc. are preserved across tab switches
  // without paying the mount cost every time.
  const primaryMountedTabsRef = useRef(new Set<string>());
  const secondaryMountedTabsRef = useRef(new Set<string>());
  const primaryTabBarRef = useRef<HTMLDivElement>(null);
  const secondaryTabBarRef = useRef<HTMLDivElement>(null);
  const pendingStoryLayoutRefreshRef = useRef<PendingStoryLayoutRefresh | null>(null);
  const pendingRouteLayoutRefreshRef = useRef<PendingRouteLayoutRefresh | null>(null);
  const pendingTagRenameRef = useRef<{ oldTag: string; newTag: string } | null>(null);
  const pendingAutoCenterRef = useRef({ story: false, route: false, choice: false });

  // --- Utility Functions ---
  const _getCurrentContext = useCallback(() => {
    // Find the currently active editor tab
    const activeEditorTab = openTabs.find(t => t.id === activeTabId && t.type === 'editor');
    if (activeEditorTab && activeEditorTab.blockId) {
      const editor = editorInstances.current.get(activeEditorTab.blockId);
      if (editor) {
        const model = editor.getModel();
        const position = editor.getPosition();
        if (model && position) {
          return model.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          });
        }
      }
    }
    return '';
  }, [activeTabId, openTabs]);

  const _getCurrentBlockId = useCallback(() => {
    // Find the currently active editor tab
    const activeEditorTab = openTabs.find(t => t.id === activeTabId && t.type === 'editor');
    return activeEditorTab?.blockId || '';
  }, [activeTabId, openTabs]);

  // --- Derived State for Drafting Mode ---
  const existingImageTags = useMemo(() => {
      const tags = new Set<string>();
      // Defined in script (e.g. image eileen = ...)
      analysisResult.definedImages.forEach(img => tags.add(img));
      
      // Defined by files in project or scanned
      imageMetadata.forEach((meta) => {
          const fullTag = `${meta.renpyName} ${meta.tags.join(' ')}`.trim();
          tags.add(fullTag);
      });
      images.forEach((img) => {
          if (!img.projectFilePath && !imageMetadata.has(img.filePath)) {
              tags.add(img.fileName.split('.')[0]);
          }
      });
      return tags;
  }, [analysisResult.definedImages, imageMetadata, images]);

  const existingAudioPaths = useMemo(() => {
      const paths = new Set<string>();
      audios.forEach((audio) => {
          // Normalize to forward slashes
          let p = audio.projectFilePath || audio.filePath;
          p = p.replace(/\\/g, '/');
          
          paths.add(p); // Full path
          if (p.startsWith('game/audio/')) {
              paths.add(p.substring('game/audio/'.length)); // Relative to game/audio
          }
          paths.add(audio.fileName); // Just filename (Ren'Py search)
      });
      
      // Add explicit variable names for audio defined in scripts
      analysisResult.variables.forEach(v => {
          paths.add(v.name);
      });
      
      return paths;
  }, [audios, analysisResult.variables]);

  const allStickyNotes = useMemo(
    () => [...stickyNotes, ...routeStickyNotes, ...choiceStickyNotes],
    [stickyNotes, routeStickyNotes, choiceStickyNotes]
  );

  const analysisLabelKeys = useMemo(
    () => Object.keys(analysisResult.labels),
    [analysisResult.labels]
  );

  const scenesArray = useMemo(
    () => Object.keys(sceneCompositions).map(id => ({ id, name: sceneNames[id] || 'Scene' })),
    [sceneCompositions, sceneNames]
  );

  const imagemapsArray = useMemo(
    () => Object.keys(imagemapCompositions).map(id => ({ id, name: imagemapCompositions[id]?.screenName || 'ImageMap' })),
    [imagemapCompositions]
  );


  const settingsMerged = useMemo(
    () => ({ ...appSettings, ...projectSettings }),
    [appSettings, projectSettings]
  );

  const menuLabels = useMemo(
    () => new Set(Object.keys(analysisResult.labels)),
    [analysisResult.labels]
  );

  const menuVariables = useMemo(
    () => new Set(analysisResult.variables.keys()),
    [analysisResult.variables]
  );

  // --- Project Color Scan ---
  const projectColors = useProjectColorScan(blocks);

  // --- Route View Logic ---
  const handleUpdateRouteNodePositions = useCallback((updates: { id: string, position: Position }[]) => {
      setRouteNodeLayoutCache(prev => {
          const next = new Map(prev);
          updates.forEach(u => next.set(u.id, u.position));
          return next;
      });
      updateProjectSettings(draft => {
          draft.routeCanvasLayoutWasUserAdjusted = true;
      });
      setHasUnsavedSettings(true);
  }, [updateProjectSettings]);

  // Stable callbacks for StoryCanvas — previously inline lambdas that caused the
  // canvas to re-render on every App.tsx state change (e.g. switching any tab).
  const handleClearFindUsages = useCallback(() => setFindUsagesHighlightIds(null), [setFindUsagesHighlightIds]);
  const canvasInteractionEnd = useCallback(() => {}, []);

  // Split into two memos so that dragging route nodes (which updates routeNodeLayoutCache)
  // only reruns the cheap position-override step, not the expensive analysis + layout pass.
  // Route graph data (labelNodes, routeLinks, identifiedRoutes) comes directly from the
  // worker result — calling performRouteAnalysis again here would duplicate the expensive
  // findPaths computation on the main thread and freeze the UI on large projects.
  const routeRaw = useMemo(() => {
      const layoutMode = projectSettings.routeCanvasLayoutMode ?? 'flow-lr';
      const groupingMode = projectSettings.routeCanvasGroupingMode ?? 'none';
      const nodesWithScenes = deriveSceneImageNames(analysisResult.labelNodes, blocks);
      const layoutedNodes = computeRouteCanvasLayout(nodesWithScenes, analysisResult.routeLinks, layoutMode, groupingMode);
      return {
          labelNodes: layoutedNodes,
          routeLinks: analysisResult.routeLinks,
          identifiedRoutes: analysisResult.identifiedRoutes,
          routesTruncated: analysisResult.routesTruncated,
      };
  }, [analysisResult, blocks, projectSettings.routeCanvasGroupingMode, projectSettings.routeCanvasLayoutMode]);

  const routeAnalysisResult = useMemo(() => {
      // Apply user-dragged position overrides on top of the auto-layout result.
      const finalNodes = routeRaw.labelNodes.map(n => {
          const cached = routeNodeLayoutCache.get(n.id);
          return cached ? { ...n, position: cached } : n;
      });
      return { ...routeRaw, labelNodes: finalNodes };
  }, [routeRaw, routeNodeLayoutCache]);


  // --- Sync Explorer with Active Tab ---
  useEffect(() => {
    if (activeTabId === 'canvas' || activeTabId === 'route-canvas' || activeTabId === 'choice-canvas' || activeTabId === 'punchlist') return;

    const activeTab = openTabs.find(t => t.id === activeTabId);
    let filePathToSync: string | undefined;

    if (activeTab) {
        if (activeTab.type === 'editor' && activeTab.blockId) {
            const block = blocks.find(b => b.id === activeTab.blockId);
            filePathToSync = block?.filePath;
        } else if (activeTab.type === 'image' || activeTab.type === 'audio') {
            filePathToSync = activeTab.filePath;
        }
    }

    if (filePathToSync) {
        // 1. Select the file
        setExplorerSelectedPaths(new Set([filePathToSync]));
        setExplorerLastClickedPath(filePathToSync);

        // 2. Expand all parent folders
        const parts = filePathToSync.split('/');
        parts.pop(); // Remove filename
        
        setExplorerExpandedPaths(prev => {
            const newExpanded = new Set(prev);
            let currentPath = '';
            let changed = false;
            
            parts.forEach((part, index) => {
                currentPath += (index > 0 ? '/' : '') + part;
                if (!newExpanded.has(currentPath)) {
                    newExpanded.add(currentPath);
                    changed = true;
                }
            });
            
            return changed ? newExpanded : prev;
        });
    }
  }, [activeTabId, openTabs, blocks, setExplorerExpandedPaths, setExplorerLastClickedPath, setExplorerSelectedPaths]);

  const handleToggleExpandExplorer = useCallback((path: string) => {
      setExplorerExpandedPaths(prev => {
          const newSet = new Set(prev);
          if (newSet.has(path)) newSet.delete(path);
          else newSet.add(path);
          return newSet;
      });
  }, [setExplorerExpandedPaths]);


  // --- Initial Load of App Settings & Theme Management ---
  useEffect(() => {
    // Load app-level settings from Electron main process or fallback to localStorage
    if (window.electronAPI?.getAppSettings) {
      window.electronAPI.getAppSettings().then(savedSettings => {
        if (savedSettings) {
          updateAppSettings(draft => {
              Object.assign(draft, savedSettings);
              if (!draft.editorFontFamily) draft.editorFontFamily = "'Consolas', 'Courier New', monospace";
              if (!draft.editorFontSize) draft.editorFontSize = 14;
          });
        }
      }).catch(err => {
        logger.error('Failed to load app settings:', err);
      }).finally(() => {
        setAppSettingsLoaded(true);
      });
    } else { // Browser fallback
      const savedSettings = localStorage.getItem('renpy-ide-app-settings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          updateAppSettings(draft => { 
              Object.assign(draft, parsed);
              if (!draft.editorFontFamily) draft.editorFontFamily = "'Consolas', 'Courier New', monospace";
              if (!draft.editorFontSize) draft.editorFontSize = 14;
          });
        } catch (e) { logger.error("Failed to load app settings from localStorage", e); }
      }
      setAppSettingsLoaded(true);
    }
  }, [updateAppSettings, setAppSettingsLoaded]);

  // --- CLI --project flag: auto-open a project on startup ---
  // Runs once after app settings have loaded to avoid racing the settings fetch.
  useEffect(() => {
    if (!appSettingsLoaded || !window.electronAPI?.getStartupArgs) return;
    window.electronAPI.getStartupArgs().then(({ projectPath }) => {
      if (projectPath) loadProject(projectPath);
    }).catch(err => logger.error('Failed to read startup args:', err));
  }, [appSettingsLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!appSettingsLoaded) return;

    if (window.electronAPI?.saveAppSettings) {
      window.electronAPI.saveAppSettings(appSettings)
        .then(result => {
            if (!result || !result.success) {
                logger.error('Failed to save app settings:', result?.error);
            }
        })
        .catch(err => logger.error('Failed to save app settings:', err));
    } else {
      localStorage.setItem('renpy-ide-app-settings', JSON.stringify(appSettings));
    }
    
    const root = window.document.documentElement;
    const applyTheme = (theme: Theme) => {
      root.classList.remove(
          'dark',
          'theme-solarized-light',
          'theme-solarized-dark',
          'theme-colorful',
          'theme-colorful-light',
          'theme-neon-dark',
          'theme-ocean-dark',
          'theme-candy-light',
          'theme-forest-light',
          'theme-synthwave'
      );
      
      if (theme === 'dark') root.classList.add('dark');
      if (theme === 'solarized-light') root.classList.add('theme-solarized-light');
      if (theme === 'solarized-dark') root.classList.add('dark', 'theme-solarized-dark');
      if (theme === 'colorful') root.classList.add('dark', 'theme-colorful');
      if (theme === 'colorful-light') root.classList.add('theme-colorful-light');
      
      // New Themes
      if (theme === 'neon-dark') root.classList.add('dark', 'theme-neon-dark');
      if (theme === 'ocean-dark') root.classList.add('dark', 'theme-ocean-dark');
      if (theme === 'candy-light') root.classList.add('theme-candy-light');
      if (theme === 'forest-light') root.classList.add('theme-forest-light');
      if (theme === 'synthwave') root.classList.add('dark', 'theme-synthwave');
    };

    if (appSettings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      applyTheme(systemTheme);
    } else {
      applyTheme(appSettings.theme);
    }
  }, [appSettings, appSettingsLoaded]);

  // --- Check Ren'Py Path Validity ---
  useEffect(() => {
    if (window.electronAPI?.checkRenpyPath && appSettings.renpyPath) {
      window.electronAPI.checkRenpyPath(appSettings.renpyPath).then(setIsRenpyPathValid).catch(() => setIsRenpyPathValid(false));
    } else {
      setIsRenpyPathValid(false);
    }
  }, [appSettings.renpyPath, setIsRenpyPathValid]);

  const buildNewBlockContent = useCallback((name: string, type: BlockType) => {
    switch (type) {
      case 'story':
        return `label ${name}:\n    "Start writing your story here..."\n    return\n`;
      case 'screen':
      case 'config':
        return '';
    }
    return '';
  }, []);

  // Safety timeout: dismiss the analysis overlay if the worker hasn't finished
  // within 30 seconds. Prevents the UI from being permanently locked on very
  // large projects where analysis exceeds reasonable bounds.
  useEffect(() => {
    if (!isInitialAnalysisPending) return;
    const timeout = setTimeout(() => {
      setIsInitialAnalysisPending(false);
      addToast('Analysis took too long and was skipped. Results may be incomplete.', 'warning');
    }, UI_TIMING.ANALYSIS_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [isInitialAnalysisPending, addToast]);

  // --- Block Management ---
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
  }, [setBlocks, updateProjectSettings]);

  const updateGroup = useCallback((id: string, data: Partial<BlockGroup>) => {
    setGroups(draft => {
      const idx = draft.findIndex(g => g.id === id);
      if (idx !== -1) Object.assign(draft[idx], data);
    });
  }, [setGroups]);

  const updateBlockPositions = useCallback((updates: { id: string, position: Position }[]) => {
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
  }, [setBlocks, updateProjectSettings]);

   const updateGroupPositions = useCallback((updates: { id: string, position: Position }[]) => {
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
  }, [setGroups, updateProjectSettings]);


  const addBlock = useCallback((filePath: string, content: string, initialPosition?: Position) => {
    const id = `block-${Date.now()}`;
    const blockWidth = 320;
    const blockHeight = 200;

    let position: Position;

    if (initialPosition) {
        position = initialPosition;
    } else {
        const leftOffset = appSettings.isLeftSidebarOpen ? appSettings.leftSidebarWidth : 0;
        const rightOffset = appSettings.isRightSidebarOpen ? appSettings.rightSidebarWidth : 0;
        const topOffset = 64; // h-16 (header)

        const visibleWidth = window.innerWidth - leftOffset - rightOffset;
        const visibleHeight = window.innerHeight - topOffset;

        const screenCenterX = leftOffset + (visibleWidth / 2);
        const screenCenterY = topOffset + (visibleHeight / 2);

        const worldCenterX = (screenCenterX - storyCanvasTransform.x) / storyCanvasTransform.scale;
        const worldCenterY = (screenCenterY - storyCanvasTransform.y) / storyCanvasTransform.scale;

        position = {
            x: worldCenterX - (blockWidth / 2),
            y: worldCenterY - (blockHeight / 2)
        };
    }

    const newBlock: Block = {
      id,
      content,
      position,
      width: blockWidth,
      height: blockHeight,
      title: filePath.split('/').pop(),
      filePath
    };
    
    setBlocks(prev => [...prev, newBlock]);
    setDirtyBlockIds(prev => new Set(prev).add(id));

    setSelectedBlockIds([id]);
    setFlashBlockRequest({ blockId: id, key: Date.now() });
    // Zoom to the newly created block on Project Canvas
    setCenterOnBlockRequest({ blockId: id, key: Date.now() });

    if (fileSystemTree && filePath) {
        setFileSystemTree(prev => {
            if (!prev) return null;
            return prev;
        });
    }
    return id;
  }, [setBlocks, fileSystemTree, storyCanvasTransform, appSettings, setCenterOnBlockRequest, setFileSystemTree, setFlashBlockRequest, setSelectedBlockIds]);

  const handleCreateBlockConfirm = async (name: string, type: BlockType, folderPath: string, initialPosition?: Position) => {
    const safeName = name.replace(/\.rpy$/, '');
    const fileName = `${safeName}.rpy`;
    const content = buildNewBlockContent(safeName, type);

    if (window.electronAPI && projectRootPath) {
        try {
            const cleanFolderPath = folderPath.endsWith('/') ? folderPath.slice(0, -1) : folderPath;
            const relativePath = cleanFolderPath ? `${cleanFolderPath}/${fileName}` : fileName;
            const fullPath = await window.electronAPI.path.join(projectRootPath!, cleanFolderPath, fileName) as string;
            
            const res = await window.electronAPI.writeFile(fullPath, content);
            if (res.success) {
                addBlock(relativePath, content, initialPosition);
                addToast(`Created ${fileName} in ${cleanFolderPath || 'root'}`, 'success');
                const projData = await window.electronAPI.loadProject(projectRootPath!);
                setFileSystemTree(projData.tree);
            } else {
                const errorMsg = typeof res.error === 'string' ? res.error : 'Unknown error occurred during file creation';
                throw new Error(errorMsg);
            }
        } catch (e) {
            logger.error('File creation error', e);
            const errorMessage = formatErrorMessage(e);
            addToast(`Failed to create file: ${errorMessage}`, 'error');
        }
    } else {
        addBlock(fileName, content, initialPosition);
        addToast(`Created block ${fileName}`, 'success');
    }
  };

  // Sticky note handlers now provided by useStickyNotes hook


  const getSelectedFolderForNewBlock = useCallback(() => {
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

  // Delete block AND its associated file from disk
  const deleteBlockWithFile = useCallback(async (id: string) => {
    const block = blocks.find(b => b.id === id);
    if (!block || !block.filePath || !projectRootPath || !window.electronAPI) {
      // If no file path or no project, just delete the block from state
      deleteBlock(id);
      return;
    }

    // Show confirmation modal
    openDeleteConfirmModal([block.filePath], async () => {
        try {
          // Delete the file from disk
          const fullPath = await window.electronAPI.path.join(projectRootPath, block.filePath) as string;
          await window.electronAPI.removeEntry(fullPath);

          // Remove the block from state
          deleteBlock(id);

          // Reload file system tree
          const projData = await window.electronAPI.loadProject(projectRootPath);
          setFileSystemTree(projData.tree);

          addToast(`Deleted ${block.filePath}`, 'success');
        } catch (err) {
          logger.error('Failed to delete file:', err);
          addToast(`Failed to delete ${block.filePath}`, 'error');
        }
    });
  }, [blocks, projectRootPath, deleteBlock, addToast, openDeleteConfirmModal, setFileSystemTree]);

  // --- Layout ---
  // Ref so applyStoryLayout always reads the latest blocks without needing blocks in its
  // dependency array. Without this, every block position change (drag) recreates the callback,
  // which cascades to handleTidyUp → Toolbar re-render, causing the cursor-hover delay.
  const blocksForLayoutRef = useRef(blocks);
  blocksForLayoutRef.current = blocks;

  const applyStoryLayout = useCallback((
    layoutMode: StoryCanvasLayoutMode,
    groupingMode: StoryCanvasGroupingMode,
    options?: { showToast?: boolean; successMessage?: string; statusMessage?: string; toastType?: ToastMessage['type']; },
  ) => {
    try {
        const links = analysisResult.links;
        const newLayout = computeStoryLayout(blocksForLayoutRef.current, links, layoutMode, groupingMode);
        const layoutFingerprint = computeStoryLayoutFingerprint(newLayout, links, layoutMode, groupingMode);
        setBlocks(newLayout);
        updateProjectSettings(draft => {
            draft.storyCanvasLayoutMode = layoutMode;
            draft.storyCanvasGroupingMode = groupingMode;
            draft.storyCanvasLayoutFingerprint = layoutFingerprint;
            draft.storyCanvasLayoutVersion = getStoryLayoutVersion();
            draft.storyCanvasLayoutWasUserAdjusted = false;
        });
        setHasUnsavedSettings(true);
        if (options?.showToast ?? true) {
            addToast(options?.successMessage ?? 'Layout organized', options?.toastType ?? 'success');
        }
    } catch (e) {
        logger.error("Failed to tidy up layout:", e);
        if (options?.showToast ?? true) {
            addToast('Failed to organize layout', 'error');
        }
    }
  }, [analysisResult.links, setBlocks, addToast, updateProjectSettings]);

  const handleTidyUp = useCallback((showToast = true) => {
    applyStoryLayout(
      projectSettings.storyCanvasLayoutMode ?? 'flow-lr',
      projectSettings.storyCanvasGroupingMode ?? 'none',
      { showToast },
    );
  }, [applyStoryLayout, projectSettings.storyCanvasGroupingMode, projectSettings.storyCanvasLayoutMode]);

  const handleChangeStoryCanvasLayoutMode = useCallback((mode: StoryCanvasLayoutMode) => {
    const currentGroupingMode = projectSettings.storyCanvasGroupingMode ?? 'none';
    // Switching away from clustered-flow makes the active grouping meaningless — reset it.
    const newGroupingMode: StoryCanvasGroupingMode =
      mode !== 'clustered-flow' && currentGroupingMode !== 'none' ? 'none' : currentGroupingMode;

    updateProjectSettings(draft => {
      draft.storyCanvasLayoutMode = mode;
      draft.storyCanvasGroupingMode = newGroupingMode;
    });
    setHasUnsavedSettings(true);
    if (blocks.length > 0 && !isAnalysisPending && !isInitialAnalysisPending) {
      setTimeout(() => {
        applyStoryLayout(mode, newGroupingMode, {
          showToast: false,
          statusMessage: 'Story layout updated.',
        });
      }, 0);
    }
  }, [
    updateProjectSettings,
    blocks.length,
    isAnalysisPending,
    isInitialAnalysisPending,
    projectSettings.storyCanvasGroupingMode,
    applyStoryLayout,
  ]);

  const handleChangeStoryCanvasGroupingMode = useCallback((mode: StoryCanvasGroupingMode) => {
    const currentLayoutMode = projectSettings.storyCanvasLayoutMode ?? 'flow-lr';
    // Grouping only takes effect in clustered-flow; auto-switch when a group is chosen.
    // Clearing grouping while in clustered-flow reverts to flow-lr.
    const newLayoutMode: StoryCanvasLayoutMode =
      mode !== 'none' ? 'clustered-flow'
      : currentLayoutMode === 'clustered-flow' ? 'flow-lr'
      : currentLayoutMode;

    updateProjectSettings(draft => {
      draft.storyCanvasGroupingMode = mode;
      draft.storyCanvasLayoutMode = newLayoutMode;
    });
    setHasUnsavedSettings(true);
    if (blocks.length > 0 && !isAnalysisPending && !isInitialAnalysisPending) {
      setTimeout(() => {
        applyStoryLayout(newLayoutMode, mode, {
          showToast: false,
          statusMessage: 'Story layout updated.',
        });
      }, 0);
    }
  }, [
    updateProjectSettings,
    blocks.length,
    isAnalysisPending,
    isInitialAnalysisPending,
    projectSettings.storyCanvasLayoutMode,
    applyStoryLayout,
  ]);

  const applyRouteLayout = useCallback((
    layoutMode: StoryCanvasLayoutMode,
    groupingMode: StoryCanvasGroupingMode,
    options?: { showToast?: boolean; successMessage?: string; statusMessage?: string; toastType?: ToastMessage['type']; },
  ) => {
    try {
        const sourceNodes = routeAnalysisResult.labelNodes.map(node => ({
            ...node,
            position: routeNodeLayoutCache.get(node.id) ?? node.position,
        }));
        const newLayout = computeRouteCanvasLayout(sourceNodes, routeAnalysisResult.routeLinks, layoutMode, groupingMode);
        const layoutFingerprint = computeRouteCanvasLayoutFingerprint(newLayout, routeAnalysisResult.routeLinks, layoutMode, groupingMode);
        setRouteNodeLayoutCache(new Map(newLayout.map(node => [node.id, node.position])));
        updateProjectSettings(draft => {
            draft.routeCanvasLayoutMode = layoutMode;
            draft.routeCanvasGroupingMode = groupingMode;
            draft.routeCanvasLayoutFingerprint = layoutFingerprint;
            draft.routeCanvasLayoutVersion = getRouteCanvasLayoutVersion();
            draft.routeCanvasLayoutWasUserAdjusted = false;
        });
        setHasUnsavedSettings(true);
        if (options?.showToast ?? true) {
            addToast(options?.successMessage ?? 'Route layout organized', options?.toastType ?? 'success');
        }
    } catch (error) {
        logger.error('Failed to organize route layout:', error);
        if (options?.showToast ?? true) {
            addToast('Failed to organize route layout', 'error');
        }
    }
  }, [routeAnalysisResult.labelNodes, routeAnalysisResult.routeLinks, routeNodeLayoutCache, updateProjectSettings, addToast]);

  const handleChangeRouteCanvasLayoutMode = useCallback((mode: StoryCanvasLayoutMode) => {
    const currentGroupingMode = projectSettings.routeCanvasGroupingMode ?? 'none';
    // Switching away from clustered-flow makes the active grouping meaningless — reset it.
    const newGroupingMode: StoryCanvasGroupingMode =
      mode !== 'clustered-flow' && currentGroupingMode !== 'none' ? 'none' : currentGroupingMode;

    updateProjectSettings(draft => {
      draft.routeCanvasLayoutMode = mode;
      draft.routeCanvasGroupingMode = newGroupingMode;
    });
    setHasUnsavedSettings(true);
    if (routeAnalysisResult.labelNodes.length > 0 && !isAnalysisPending && !isInitialAnalysisPending) {
      setTimeout(() => {
        applyRouteLayout(mode, newGroupingMode, {
          showToast: false,
          statusMessage: 'Route layout updated.',
        });
      }, 0);
    }
  }, [
    updateProjectSettings,
    routeAnalysisResult.labelNodes.length,
    isAnalysisPending,
    isInitialAnalysisPending,
    projectSettings.routeCanvasGroupingMode,
    applyRouteLayout,
  ]);

  const handleChangeRouteCanvasGroupingMode = useCallback((mode: StoryCanvasGroupingMode) => {
    const currentLayoutMode = projectSettings.routeCanvasLayoutMode ?? 'flow-lr';
    // Grouping only takes effect in clustered-flow; auto-switch when a group is chosen.
    // Clearing grouping while in clustered-flow reverts to flow-lr.
    const newLayoutMode: StoryCanvasLayoutMode =
      mode !== 'none' ? 'clustered-flow'
      : currentLayoutMode === 'clustered-flow' ? 'flow-lr'
      : currentLayoutMode;

    updateProjectSettings(draft => {
      draft.routeCanvasGroupingMode = mode;
      draft.routeCanvasLayoutMode = newLayoutMode;
    });
    setHasUnsavedSettings(true);
    if (routeAnalysisResult.labelNodes.length > 0 && !isAnalysisPending && !isInitialAnalysisPending) {
      setTimeout(() => {
        applyRouteLayout(newLayoutMode, mode, {
          showToast: false,
          statusMessage: 'Route layout updated.',
        });
      }, 0);
    }
  }, [
    updateProjectSettings,
    routeAnalysisResult.labelNodes.length,
    isAnalysisPending,
    isInitialAnalysisPending,
    projectSettings.routeCanvasLayoutMode,
    applyRouteLayout,
  ]);

  useEffect(() => {
    const pendingRefresh = pendingStoryLayoutRefreshRef.current;
    if (!pendingRefresh || blocks.length === 0 || isInitialAnalysisPending || isAnalysisPending) {
        return;
    }
    pendingStoryLayoutRefreshRef.current = null;

    const layoutMode = projectSettings.storyCanvasLayoutMode ?? 'flow-lr';
    const groupingMode = projectSettings.storyCanvasGroupingMode ?? 'none';
    const currentFingerprint = computeStoryLayoutFingerprint(blocks, analysisResult.links, layoutMode, groupingMode);
    const savedVersionMatches = pendingRefresh.savedVersion === getStoryLayoutVersion();
    const shouldRefreshLayout =
      !pendingRefresh.hasSavedLayouts ||
      !pendingRefresh.savedFingerprint ||
      !savedVersionMatches ||
      pendingRefresh.savedFingerprint !== currentFingerprint;

    if (shouldRefreshLayout) {
      if (pendingRefresh.hasSavedLayouts && pendingRefresh.savedWasUserAdjusted) {
        updateProjectSettings(draft => {
          draft.storyCanvasLayoutFingerprint = currentFingerprint;
          draft.storyCanvasLayoutVersion = getStoryLayoutVersion();
        });
        setHasUnsavedSettings(true);
        addToast('Story graph changed. Layout preserved; use Redraw to reorganize.', 'info');
      } else {
        applyStoryLayout(layoutMode, groupingMode, {
          showToast: pendingRefresh.hasSavedLayouts,
          successMessage: pendingRefresh.hasSavedLayouts
            ? 'Story layout refreshed for changed graph'
            : 'Story layout generated',
          statusMessage: pendingRefresh.hasSavedLayouts
            ? 'Story layout refreshed.'
            : 'Story layout generated.',
          toastType: 'info',
        });
      }
    }

    if (pendingAutoCenterRef.current.story) {
      pendingAutoCenterRef.current.story = false;
      const startLabelNode = analysisResult.labelNodes.find(n => n.label === 'start');
      if (startLabelNode) {
        setCenterOnBlockRequest({ blockId: startLabelNode.blockId, key: Date.now() });
      }
    }
  }, [
    blocks,
    isInitialAnalysisPending,
    isAnalysisPending,
    projectSettings.storyCanvasGroupingMode,
    projectSettings.storyCanvasLayoutMode,
    analysisResult.links,
    analysisResult.labelNodes,
    applyStoryLayout,
    addToast,
    updateProjectSettings,
    setCenterOnBlockRequest,
  ]);

  useEffect(() => {
    const pendingRefresh = pendingRouteLayoutRefreshRef.current;
    if (!pendingRefresh || isInitialAnalysisPending || isAnalysisPending) {
      return;
    }
    pendingRouteLayoutRefreshRef.current = null;

    const layoutMode = projectSettings.routeCanvasLayoutMode ?? 'flow-lr';
    const groupingMode = projectSettings.routeCanvasGroupingMode ?? 'none';
    const sourceNodes = routeAnalysisResult.labelNodes.map(node => ({
      ...node,
      position: routeNodeLayoutCache.get(node.id) ?? node.position,
    }));
    const currentFingerprint = computeRouteCanvasLayoutFingerprint(sourceNodes, routeAnalysisResult.routeLinks, layoutMode, groupingMode);
    const savedVersionMatches = pendingRefresh.savedVersion === getRouteCanvasLayoutVersion();
    const shouldRefreshLayout =
      !pendingRefresh.hasSavedLayouts ||
      !pendingRefresh.savedFingerprint ||
      !savedVersionMatches ||
      pendingRefresh.savedFingerprint !== currentFingerprint;

    if (shouldRefreshLayout) {
      if (pendingRefresh.hasSavedLayouts && pendingRefresh.savedWasUserAdjusted) {
        updateProjectSettings(draft => {
          draft.routeCanvasLayoutFingerprint = currentFingerprint;
          draft.routeCanvasLayoutVersion = getRouteCanvasLayoutVersion();
        });
        setHasUnsavedSettings(true);
        addToast('Route graph changed. Layout preserved; use Redraw to reorganize.', 'info');
      } else {
        applyRouteLayout(layoutMode, groupingMode, {
          showToast: pendingRefresh.hasSavedLayouts,
          successMessage: pendingRefresh.hasSavedLayouts
            ? 'Route layout refreshed for changed graph'
            : 'Route layout generated',
          statusMessage: pendingRefresh.hasSavedLayouts
            ? 'Route layout refreshed.'
            : 'Route layout generated.',
          toastType: 'info',
        });
      }
    }

    if (pendingAutoCenterRef.current.route) {
      pendingAutoCenterRef.current.route = false;
      setCenterOnRouteStartRequest({ key: Date.now() });
    }
  }, [
    isInitialAnalysisPending,
    isAnalysisPending,
    routeAnalysisResult.labelNodes,
    routeAnalysisResult.routeLinks,
    routeNodeLayoutCache,
    projectSettings.routeCanvasLayoutMode,
    projectSettings.routeCanvasGroupingMode,
    applyRouteLayout,
    addToast,
    updateProjectSettings,
    setCenterOnRouteStartRequest,
  ]);

  // Auto-center Choices Canvas on first project open
  useEffect(() => {
    if (isInitialAnalysisPending || isAnalysisPending) return;
    if (!pendingAutoCenterRef.current.choice) return;
    if (!routeAnalysisResult.labelNodes.some(n => n.label === 'start')) return;
    pendingAutoCenterRef.current.choice = false;
    setCenterOnChoiceStartRequest({ key: Date.now() });
  }, [isInitialAnalysisPending, isAnalysisPending, routeAnalysisResult.labelNodes, setCenterOnChoiceStartRequest]);


  // --- File System Integration ---
  
  const {
      loadProject,
      handleSaveProjectSettings,
      handleSaveAll,
      handleReloadFromDisk,
      handleRefreshProject,
  } = useProjectIO({
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
  });


  const handleCancelLoad = useCallback(() => {
      loadCancelRef.current = true;
      window.electronAPI?.cancelProjectLoad?.();
      // Close the overlay immediately — don't wait for the IPC to reject.
      // The loadProject finally block will also call setIsLoading(false) harmlessly.
      setIsLoading(false);
      setLoadingMessage('');
      setLoadingProgress(0);
      addToast('Project loading cancelled.', 'info');
  }, [addToast]);

  // Checks whether the selected folder looks like a Ren'Py project before loading.
  // If it doesn't (no game/ folder, no .rpy files), shows a confirmation warning first.
  const handleOpenWithRenpyCheck = useCallback(async (path: string) => {
      try {
          if (window.electronAPI?.checkRenpyProject) {
              const check = await window.electronAPI.checkRenpyProject(path);
              if (!check.isRenpyProject) {
                  setNonRenpyWarningPath(path);
                  return;
              }
          }
          await loadProject(path);
      } catch (err) {
          logger.error('Failed to open project:', err);
          addToast('Failed to open project', 'error');
      }
  }, [loadProject, addToast]);

  const handleOpenProjectFolder = useCallback(async () => {
    try {
        if (window.electronAPI) {
            const path = await window.electronAPI.openDirectory();
            if (path) {
                await handleOpenWithRenpyCheck(path);
            }
        } else {
            addToast('Local file system features require the Electron app or a compatible browser with File System Access support.', 'warning');
        }
    } catch (err) {
        logger.error('Failed to open project', err);
        addToast('Failed to open project', 'error');
    }
  }, [handleOpenWithRenpyCheck, addToast]);

  const handleCreateProject = useCallback(() => {
      // Open the new project wizard modal
      openWizardModal();
  }, [openWizardModal]);

  const handleWizardComplete = useCallback(async (projectPath: string) => {
      closeWizardModal();
      try {
          await loadProject(projectPath);
          addToast('Project created successfully', 'success');
      } catch (err) {
          logger.error('Failed to load newly created project', err);
          addToast('Failed to load the newly created project', 'error');
      }
  }, [loadProject, addToast, closeWizardModal]);

  // --- Stable callbacks for ImageEditorView / AudioEditorView tabs ---
  // These are extracted from the inline renderTabContent so React.memo on the
  // tab components can bail out when switching tabs (instead of re-rendering
  // with 14,000 image DOM nodes every time).
  // Saves metadata for an in-project image, moving the file if the subfolder changed.
  // currentFilePath is the metadata-map key: relative "game/images/..." for native project
  // files, or an absolute external path for files copied in the current session.
  const handleSaveImageMetadata = useCallback(async (currentFilePath: string, newMeta: ImageMetadata) => {
      if (!projectRootPath || !window.electronAPI) return;

      const isRelative = currentFilePath.startsWith('game/images');
      const fileName = currentFilePath.split(/[/\\]/).pop()!;
      const newSubfolder = newMeta.projectSubfolder?.trim() || '';
      const newRelPath = newSubfolder ? `game/images/${newSubfolder}/${fileName}` : `game/images/${fileName}`;

      const absCurrentPath = isRelative
          ? await window.electronAPI.path.join(projectRootPath, currentFilePath) as string
          : currentFilePath;
      const absNewPath = await window.electronAPI.path.join(projectRootPath, newRelPath) as string;
      const needsMove = absCurrentPath.replace(/\\/g, '/') !== absNewPath.replace(/\\/g, '/');

      if (needsMove) {
          const absNewDir = await window.electronAPI.path.join(projectRootPath, newSubfolder ? `game/images/${newSubfolder}` : 'game/images') as string;
          await window.electronAPI.createDirectory(absNewDir);
          const res = await window.electronAPI.moveFile(absCurrentPath, absNewPath);
          if (!res.success) throw new Error(res.error || 'Move failed');

          // Find the images-map key (may be the external sourcePath, not the project path)
          const mapKey = isRelative ? currentFilePath
              : ([...images.keys()].find(k => {
                  const v = images.get(k)!;
                  return (v.projectFilePath || v.filePath) === currentFilePath;
              }) ?? currentFilePath);

          setImages(prev => {
              const next = new Map(prev);
              const existing = next.get(mapKey);
              next.delete(mapKey);
              if (existing) next.set(newRelPath, { ...existing, filePath: newRelPath, projectFilePath: undefined });
              return next;
          });
          setImageMetadata(prev => {
              const next = new Map(prev);
              next.delete(currentFilePath);
              next.set(newRelPath, newMeta);
              return next;
          });
          const oldTabId = `img-${mapKey}`;
          const newTabId = `img-${newRelPath}`;
          setOpenTabs(prev => prev.map(t => t.id === oldTabId ? { ...t, id: newTabId, filePath: newRelPath } : t));
          setSecondaryOpenTabs(prev => prev.map(t => t.id === oldTabId ? { ...t, id: newTabId, filePath: newRelPath } : t));
          setActiveTabId(prev => prev === oldTabId ? newTabId : prev);
          setSecondaryActiveTabId(prev => prev === oldTabId ? newTabId : prev);
      } else {
          setImageMetadata(prev => { const next = new Map(prev); next.set(currentFilePath, newMeta); return next; });
      }

      setHasUnsavedSettings(true);
      const freshTree = await window.electronAPI.refreshProjectTree(projectRootPath);
      setFileSystemTree(freshTree);
  }, [projectRootPath, images, setActiveTabId, setFileSystemTree, setImageMetadata, setImages, setOpenTabs, setSecondaryActiveTabId, setSecondaryOpenTabs]);

  const handleCopyImageToProject = useCallback(async (sourcePath: string, meta: ImageMetadata) => {
      try {
          if (window.electronAPI && projectRootPath) {
              const fileName = sourcePath.split('/').pop() || 'image.png';
              const subfolder = meta.projectSubfolder || '';
              const destDir = await window.electronAPI.path.join(projectRootPath, 'game', 'images', subfolder);
              const destPath = await window.electronAPI.path.join(destDir, fileName);
              await window.electronAPI.copyEntry(sourcePath, destPath);
              setImages(prev => {
                  const next = new Map(prev);
                  const existing = next.get(sourcePath);
                  if (existing) {
                      next.set(sourcePath, { ...existing, isInProject: true, projectFilePath: destPath });
                  }
                  return next;
              });
              addToast('Image copied to project', 'success');
              const freshTree = await window.electronAPI.refreshProjectTree(projectRootPath);
              setFileSystemTree(freshTree);
          }
      } catch (err) {
          logger.error('Failed to copy image to project:', err);
          addToast('Failed to copy image to project', 'error');
      }
  }, [projectRootPath, addToast, setFileSystemTree, setImages]);

  // Saves metadata for an in-project audio file, moving it if the subfolder changed.
  const handleSaveAudioMetadata = useCallback(async (currentFilePath: string, newMeta: AudioMetadata) => {
      if (!projectRootPath || !window.electronAPI) return;

      const isRelative = currentFilePath.startsWith('game/audio');
      const fileName = currentFilePath.split(/[/\\]/).pop()!;
      const newSubfolder = newMeta.projectSubfolder?.trim() || '';
      const newRelPath = newSubfolder ? `game/audio/${newSubfolder}/${fileName}` : `game/audio/${fileName}`;

      const absCurrentPath = isRelative
          ? await window.electronAPI.path.join(projectRootPath, currentFilePath) as string
          : currentFilePath;
      const absNewPath = await window.electronAPI.path.join(projectRootPath, newRelPath) as string;
      const needsMove = absCurrentPath.replace(/\\/g, '/') !== absNewPath.replace(/\\/g, '/');

      if (needsMove) {
          const absNewDir = await window.electronAPI.path.join(projectRootPath, newSubfolder ? `game/audio/${newSubfolder}` : 'game/audio') as string;
          await window.electronAPI.createDirectory(absNewDir);
          const res = await window.electronAPI.moveFile(absCurrentPath, absNewPath);
          if (!res.success) throw new Error(res.error || 'Move failed');

          const mapKey = isRelative ? currentFilePath
              : ([...audios.keys()].find(k => {
                  const v = audios.get(k)!;
                  return (v.projectFilePath || v.filePath) === currentFilePath;
              }) ?? currentFilePath);

          setAudios(prev => {
              const next = new Map(prev);
              const existing = next.get(mapKey);
              next.delete(mapKey);
              if (existing) next.set(newRelPath, { ...existing, filePath: newRelPath, projectFilePath: undefined });
              return next;
          });
          setAudioMetadata(prev => {
              const next = new Map(prev);
              next.delete(currentFilePath);
              next.set(newRelPath, newMeta);
              return next;
          });
          const oldTabId = `aud-${mapKey}`;
          const newTabId = `aud-${newRelPath}`;
          setOpenTabs(prev => prev.map(t => t.id === oldTabId ? { ...t, id: newTabId, filePath: newRelPath } : t));
          setSecondaryOpenTabs(prev => prev.map(t => t.id === oldTabId ? { ...t, id: newTabId, filePath: newRelPath } : t));
          setActiveTabId(prev => prev === oldTabId ? newTabId : prev);
          setSecondaryActiveTabId(prev => prev === oldTabId ? newTabId : prev);
      } else {
          setAudioMetadata(prev => { const next = new Map(prev); next.set(currentFilePath, newMeta); return next; });
      }

      setHasUnsavedSettings(true);
      const freshTree = await window.electronAPI.refreshProjectTree(projectRootPath);
      setFileSystemTree(freshTree);
  }, [projectRootPath, audios, setActiveTabId, setAudioMetadata, setAudios, setFileSystemTree, setOpenTabs, setSecondaryActiveTabId, setSecondaryOpenTabs]);

  const handleCopyAudioToProject = useCallback(async (sourcePath: string, meta: AudioMetadata) => {
      try {
          if (window.electronAPI && projectRootPath) {
              const fileName = sourcePath.split('/').pop() || 'audio.ogg';
              const subfolder = meta.projectSubfolder || '';
              const destDir = await window.electronAPI.path.join(projectRootPath, 'game', 'audio', subfolder);
              const destPath = await window.electronAPI.path.join(destDir, fileName);
              await window.electronAPI.copyEntry(sourcePath, destPath);
              setAudios(prev => {
                  const next = new Map(prev);
                  const existing = next.get(sourcePath);
                  if (existing) {
                      next.set(sourcePath, { ...existing, isInProject: true, projectFilePath: destPath });
                  }
                  return next;
              });
              addToast('Audio copied to project', 'success');
              const freshTree = await window.electronAPI.refreshProjectTree(projectRootPath);
              setFileSystemTree(freshTree);
          }
      } catch (err) {
          logger.error('Failed to copy audio to project:', err);
          addToast('Failed to copy audio to project', 'error');
      }
  }, [projectRootPath, addToast, setAudios, setFileSystemTree]);

  // --- Drafting Mode Logic ---
  const { updateDraftingArtifacts, handleToggleDraftingMode } = useDraftingArtifacts({
      projectRootPath, blocks, draftingMode: projectSettings.draftingMode,
      definedImages: analysisResult.definedImages, definedVariables: analysisResult.variables,
      existingImageTags, existingAudioPaths, updateProjectSettings, setHasUnsavedSettings, addToast,
  });

  const syncEditorToStateAndMarkDirty = useCallback((blockId: string, content: string) => {
    // Update block content in React state
    setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, content } : b));
    
    // The editor is gone, so remove it from dirtyEditors...
    setDirtyEditors(prev => {
        const next = new Set(prev);
        next.delete(blockId);
        return next;
    });
    // ...but add it to dirtyBlockIds because it's still not saved to disk.
    setDirtyBlockIds(prev => new Set(prev).add(blockId));
  }, [setBlocks]);

  const handleSaveBlock = useCallback(async (blockId: string) => {
    const editor = editorInstances.current.get(blockId);
    if (!editor) return;

    const contentToSave = editor.getValue();
    const block = blocksRef.current.find(b => b.id === blockId);

    const doSave = async () => {
      try {
        if (window.electronAPI && projectRootPath) {
          const b = blocksRef.current.find(b => b.id === blockId);
          if (b?.filePath) {
            const absPath = await window.electronAPI.path.join(projectRootPath, b.filePath) as string;
            const res = await window.electronAPI.writeFile(absPath, contentToSave);
            if (res.success) {
              addToast(`Saved ${b.title || 'file'}`, 'success');
              setFilesWithDiskConflict(prev => { const next = new Set(prev); next.delete(b.filePath!); return next; });
            } else {
              addToast(`Failed to save: ${String(res.error)}`, 'error');
              return;
            }
          }
        }
        setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, content: contentToSave } : b));
        setDirtyBlockIds(prev => { const next = new Set(prev); next.delete(blockId); return next; });
        setDirtyEditors(prev => { const next = new Set(prev); next.delete(blockId); return next; });
        notifyFirstSave();
        if (projectSettings.draftingMode) updateDraftingArtifacts();
      } catch (err) {
        logger.error('Failed to save block:', err);
        addToast('Failed to save file', 'error');
      }
    };

    if (block?.filePath && filesWithDiskConflict.has(block.filePath)) {
      openUnsavedChangesModal({
        title: 'Overwrite External Changes?',
        message: `"${block.title || block.filePath}" was changed on disk after you last loaded it. Your editor version will overwrite those changes.`,
        confirmText: 'Overwrite and Save',
        dontSaveText: 'Cancel',
        onConfirm: async () => { closeUnsavedChangesModal(); await doSave(); },
        onDontSave: () => closeUnsavedChangesModal(),
        onCancel: () => closeUnsavedChangesModal(),
      });
      return;
    }

    await doSave();
  }, [projectRootPath, projectSettings.draftingMode, addToast, setBlocks, updateDraftingArtifacts, filesWithDiskConflict, notifyFirstSave, openUnsavedChangesModal, closeUnsavedChangesModal]);
  

  const handleKeepCurrentFile = useCallback((relativePath: string) => {
      setExternallyChangedFiles(prev => prev.filter(f => f.relativePath !== relativePath));
      setFilesWithDiskConflict(prev => { const next = new Set(prev); next.add(relativePath); return next; });
  }, []);


  const handleGenerateTranslations = useCallback(async (language: string) => {
    if (!appSettings.renpyPath || !projectRootPath) return;
    setIsGeneratingTranslations(true);
    try {
      const result = await window.electronAPI!.generateTranslations(appSettings.renpyPath, projectRootPath, language);
      if (result.success) {
        addToast(`Translation files generated for "${language}"`, 'success');
        await handleRefreshProject();
      } else {
        const detail = result.error || 'Unknown error';
        logger.error('Generate translations failed:\n', detail);
        // Show first meaningful line in the toast, full output is in the console
        const firstLine = detail.split('\n').find(l => l.trim().length > 0) || detail;
        addToast(`Translation generation failed: ${firstLine}`, 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addToast(`Failed to generate translations: ${msg}`, 'error');
    } finally {
      setIsGeneratingTranslations(false);
    }
  }, [appSettings.renpyPath, projectRootPath, addToast, handleRefreshProject, setIsGeneratingTranslations]);

  const handleNewProjectRequest = useCallback(() => {
    const hasUnsaved = dirtyBlockIds.size > 0 || dirtyEditors.size > 0 || hasUnsavedSettings;
    
    if (hasUnsaved) {
      openUnsavedChangesModal({
        title: 'Unsaved Changes',
        message: 'You have unsaved changes. Do you want to save them before creating a new project?',
        confirmText: 'Save & Create',
        dontSaveText: "Don't Save & Create",
        onConfirm: async () => {
          await handleSaveAll();
          handleCreateProject();
          closeUnsavedChangesModal();
        },
        onDontSave: () => {
          handleCreateProject();
          closeUnsavedChangesModal();
        },
        onCancel: () => {
          closeUnsavedChangesModal();
        }
      });
    } else {
      handleCreateProject();
    }
  }, [dirtyBlockIds, dirtyEditors, hasUnsavedSettings, handleCreateProject, handleSaveAll, openUnsavedChangesModal, closeUnsavedChangesModal]);
  
  // --- Tab Management ---
  const {
    handleOpenEditor,
    handleOpenStaticTab,
    handleOpenRouteCanvasTab,
    handleOpenChoiceCanvasTab,
    handleOpenImageEditorTab,
    handleOpenMarkdownTab,
    handleOpenAudioEditorInTab,
    handlePathDoubleClick,
  } = useTabOpeners({ blocksRef });

  const {
    handleCloseTab,
    processTabCloseRequest,
    handleCloseOthersRequest,
    handleCloseAllRequest,
    handleCloseLeftRequest,
    handleCloseRightRequest,
    handleSwitchTab,
    handleCreateSplit,
    handleOpenInSplit,
    handleMoveToOtherPane,
    handleCloseSecondaryPane,
    handleClosePrimaryPane,
    handleTabDragStart,
    handleTabDragOver,
    handleTabDrop,
  } = useTabLifecycle({
    openTabs, secondaryOpenTabs, activeTabId, secondaryActiveTabId, splitLayout,
    draggedTabId, dragSourcePaneId,
    setOpenTabs, setSecondaryOpenTabs, setActiveTabId, setSecondaryActiveTabId, setActivePaneId,
    setSplitLayout, setSplitPrimarySize, setDraggedTabId, setDragSourcePaneId,
    dirtyBlockIds, dirtyEditors, setDirtyBlockIds, setDirtyEditors,
    openUnsavedChangesModal, closeUnsavedChangesModal,
    handleSaveAll, setHasUnsavedSettings,
  });

  const handleTabContextMenu = useCallback((e: React.MouseEvent, tabId: string, paneId: 'primary' | 'secondary' = 'primary') => {
      e.preventDefault();
      openContextMenu(e.clientX, e.clientY, tabId, paneId);
  }, [openContextMenu]);

  const handleCenterOnBlock = useCallback((target: string) => {
      let blockId = target;
      let block = blocks.find(b => b.id === target);

      // If no block matches ID, try matching path
      if (!block) {
          // Normalize path separators just in case
          const targetPath = target.replace(/\\/g, '/');
          block = blocks.find(b => b.filePath === targetPath);
          if (block) blockId = block.id;
      }

      if (block) {
          // Ensure the block type is visible in filters
          setCanvasFilters(prev => {
              const next = { ...prev };
              let changed = false;
              
              if (analysisResult.screenOnlyBlockIds.has(blockId) && !prev.screens) {
                  next.screens = true;
                  changed = true;
              } else if (analysisResult.configBlockIds.has(blockId) && !prev.config) {
                  next.config = true;
                  changed = true;
              } else if (analysisResult.storyBlockIds.has(blockId) && !prev.story) {
                  next.story = true;
                  changed = true;
              }
              
              return changed ? next : prev;
          });

          setActiveTabId('canvas');
          // Small timeout to ensure canvas is rendered if switching tabs
          setTimeout(() => {
              setCenterOnBlockRequest({ blockId, key: Date.now() });
          }, UI_TIMING.CANVAS_CENTER_DELAY_MS);
      } else {
          // Attempt to find sticky note
          const note = stickyNotes.find(n => n.id === target);
          if (note) {
               // Ensure notes are visible
               if (!canvasFilters.notes) {
                   setCanvasFilters(prev => ({ ...prev, notes: true }));
               }
               setActiveTabId('canvas');
               // Reuse the block center request for notes (requires StoryCanvas update to handle notes, or a separate mechanism)
               // Assuming StoryCanvas is updated to check note IDs too
               setTimeout(() => {
                   setCenterOnBlockRequest({ blockId: target, key: Date.now() });
               }, 50);
               return;
          }

          addToast(`Could not find a block or note for "${target}"`, 'warning');
      }
  }, [blocks, analysisResult, addToast, stickyNotes, canvasFilters.notes, setActiveTabId, setCanvasFilters, setCenterOnBlockRequest]);

  // ── Go-to-label (Ctrl+G) ─────────────────────────────────────────────────────

  const activeCanvasTabId = activeTabId === 'canvas' || activeTabId === 'route-canvas' || activeTabId === 'choice-canvas'
    ? activeTabId : null;

  const goToLabelItems = useMemo<GoToLabelItem[]>(() => {
    if (activeCanvasTabId === 'canvas') {
      return analysisResult.labelNodes.map(n => ({ label: n.label, id: n.blockId }));
    }
    if (activeCanvasTabId === 'route-canvas' || activeCanvasTabId === 'choice-canvas') {
      return routeAnalysisResult.labelNodes.map(n => ({ label: n.label, id: n.id }));
    }
    return [];
  }, [activeCanvasTabId, analysisResult.labelNodes, routeAnalysisResult.labelNodes]);

  const goToLabelCanvasName = activeCanvasTabId === 'canvas' ? 'Story'
    : activeCanvasTabId === 'route-canvas' ? 'Route'
    : activeCanvasTabId === 'choice-canvas' ? 'Choice'
    : '';

  const warpLabelItems = useMemo<GoToLabelItem[]>(() => {
    return Object.values(analysisResult.labels)
      .slice()
      .sort((a, b) => a.label.localeCompare(b.label))
      .map(loc => ({ label: loc.label, id: loc.label }));
  }, [analysisResult.labels]);

  const handleGoToLabel = useCallback((id: string) => {
    closeGoToLabelModal();
    if (activeCanvasTabId === 'canvas') {
      setCenterOnBlockRequest({ blockId: id, key: Date.now() });
    } else if (activeCanvasTabId === 'route-canvas') {
      setCenterOnRouteNodeRequest({ nodeId: id, key: Date.now() });
    } else if (activeCanvasTabId === 'choice-canvas') {
      setCenterOnChoiceNodeRequest({ nodeId: id, key: Date.now() });
    }
  }, [activeCanvasTabId, closeGoToLabelModal, setCenterOnBlockRequest, setCenterOnChoiceNodeRequest, setCenterOnRouteNodeRequest]);

  const handleRunGame = useCallback(() => {
    if (!window.electronAPI || !projectRootPath) return;
    window.electronAPI.runGame(appSettings.renpyPath, projectRootPath);
  }, [appSettings.renpyPath, projectRootPath]);

  const cleanupWarpTempFile = useCallback(async () => {
    if (!window.electronAPI || !projectRootPath) return;

    const tempPath = warpTempFilePathRef.current
      ?? await window.electronAPI.path.join(projectRootPath, 'game', '_ide_after_warp.rpy');

    try {
      if (await window.electronAPI.fileExists(tempPath)) {
        await window.electronAPI.removeEntry(tempPath);
      }
    } catch (error) {
      logger.error('Failed to clean up temporary warp file:', error);
    } finally {
      if (warpTempFilePathRef.current === tempPath) {
        warpTempFilePathRef.current = null;
      }
    }
  }, [projectRootPath]);

  const resetWarpLaunchState = useCallback(() => {
    closeWarpVariablesModal();
    setPendingWarpLabelName(null);
    setPendingWarpTarget(null);
    setPendingWarpVariableDrafts([]);
  }, [closeWarpVariablesModal]);

  const handleConfirmWarpVariables = useCallback(async (variableDrafts: WarpVariableDraft[]) => {
    if (!window.electronAPI || !projectRootPath || !pendingWarpTarget) return;

    const tempPath = await window.electronAPI.path.join(projectRootPath, 'game', '_ide_after_warp.rpy');
    const needsTempFile = variableDrafts.length > 0 || !hasAfterWarpLabel(analysisResult.labels);

    try {
      if (needsTempFile) {
        const script = buildAfterWarpScript(variableDrafts, !hasAfterWarpLabel(analysisResult.labels));
        await cleanupWarpTempFile();

        const writeResult = await window.electronAPI.writeFile(tempPath, script, 'utf-8');
        if (!writeResult.success) {
          throw new Error(writeResult.error || 'Failed to write temporary warp file.');
        }

        warpTempFilePathRef.current = tempPath;
      } else {
        await cleanupWarpTempFile();
      }

      const warpTarget = pendingWarpTarget;
      resetWarpLaunchState();
      window.electronAPI.runGame(appSettings.renpyPath, projectRootPath, warpTarget);
    } catch (error) {
      logger.error('Failed to launch warped game:', error);
      addToast(`Failed to launch warp: ${formatErrorMessage(error)}`, 'error');
    }
  }, [analysisResult.labels, addToast, appSettings.renpyPath, cleanupWarpTempFile, pendingWarpTarget, projectRootPath, resetWarpLaunchState]);

  const handleWarpToLabel = useCallback((labelName: string) => {
    if (!window.electronAPI || !projectRootPath) return;

    const warpTarget = resolveWarpTarget(blocks, analysisResult.labels, labelName);
    closeWarpToLabelModal();

    if (!warpTarget) {
      addToast(`Could not resolve warp target for "${labelName}"`, 'warning');
      return;
    }

    setPendingWarpLabelName(labelName);
    setPendingWarpTarget(warpTarget);
    setPendingWarpVariableDrafts(getWarpVariableDrafts(
      analysisResult.variables,
      analysisResult.translationData.translatableStrings,
    ));
    openWarpVariablesModal();
  }, [analysisResult.labels, analysisResult.translationData.translatableStrings, analysisResult.variables, addToast, blocks, projectRootPath, closeWarpToLabelModal, openWarpVariablesModal]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMetaShortcut = e.ctrlKey || e.metaKey;
      const isG = e.key.toLowerCase() === 'g';
      if (isMetaShortcut && e.shiftKey && isG) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        if (!projectRootPath) return;
        e.preventDefault();
        openWarpToLabelModal();
      } else if (isMetaShortcut && isG) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        if (!activeCanvasTabId) return;
        e.preventDefault();
        if (isGoToLabelOpen) {
          closeGoToLabelModal();
        } else {
          openGoToLabelModal();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        // Close the currently active tab
        const tag = (e.target as HTMLElement).tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        e.preventDefault();
        const currentPaneId = activePaneId;
        const currentTabId = currentPaneId === 'primary' ? activeTabId : secondaryActiveTabId;
        if (currentTabId) {
          handleCloseTab(currentTabId, currentPaneId);
        }
      }
      if (e.key === 'Escape') {
        closeGoToLabelModal();
        closeWarpToLabelModal();
        resetWarpLaunchState();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeCanvasTabId, activePaneId, activeTabId, handleCloseTab, projectRootPath, resetWarpLaunchState, secondaryActiveTabId, closeGoToLabelModal, closeWarpToLabelModal, isGoToLabelOpen, openGoToLabelModal, openWarpToLabelModal]);


  const handleFindUsages = (id: string, type: 'character' | 'variable') => {
      const ids = new Set<string>();
      if (type === 'character') {
          const lines = analysisResult.dialogueLines;
          lines.forEach((dialogues, blockId) => {
              if (dialogues.some(d => d.tag === id)) ids.add(blockId);
          });
      } else {
          const usages = analysisResult.variableUsages.get(id);
          usages?.forEach(u => ids.add(u.blockId));
      }
      
      setFindUsagesHighlightIds(ids);
      setActiveTabId('canvas');
      addToast(`Found usages in ${ids.size} blocks`, 'info');
  };

  const analysisResultWithProfiles = useMemo(() => {
    if (!analysisResult) return analysisResult;
    const newCharacters = new Map(analysisResult.characters);
    newCharacters.forEach((char, tag) => {
        const profile = characterProfiles[tag];
        if (profile !== undefined) {
            newCharacters.set(tag, { ...char, profile });
        }
    });
    return { ...analysisResult, characters: newCharacters };
  }, [analysisResult, characterProfiles]);

  // When a character tag rename is in-flight, wait until analysis has resolved the new
  // tag before updating the open tab.  This avoids the flash of "New Character" form
  // that would occur if we updated characterTag before the analysis re-run completes.
  useEffect(() => {
    const pending = pendingTagRenameRef.current;
    if (!pending) return;
    if (!analysisResult.characters.has(pending.newTag)) return;
    const oldTabId = `char-${pending.oldTag}`;
    const newTabId = `char-${pending.newTag}`;
    setOpenTabs(prev => prev.map(t => t.id === oldTabId ? { ...t, id: newTabId, characterTag: pending.newTag } : t));
    setActiveTabId(prev => prev === oldTabId ? newTabId : prev);
    setSecondaryOpenTabs(prev => prev.map(t => t.id === oldTabId ? { ...t, id: newTabId, characterTag: pending.newTag } : t));
    setSecondaryActiveTabId(prev => prev === oldTabId ? newTabId : prev);
    // Also remove from lazy-mount sets so the new key gets a clean mount
    primaryMountedTabsRef.current.delete(oldTabId);
    secondaryMountedTabsRef.current.delete(oldTabId);
    pendingTagRenameRef.current = null;
  }, [analysisResult.characters, setActiveTabId, setOpenTabs, setSecondaryActiveTabId, setSecondaryOpenTabs]);

  // --- Character Editor ---
  const { handleOpenCharacterEditor, handleUpdateCharacter } = useCharacterManagement({
    blocks, analysisResult, projectRootPath,
    updateBlock, addBlock, setFileSystemTree,
    setCharacterProfiles, setHasUnsavedSettings, addToast,
    pendingTagRenameRef,
    openTabs, secondaryOpenTabs, activePaneId, splitLayout,
    setOpenTabs, setActiveTabId, setSecondaryOpenTabs, setSecondaryActiveTabId, setActivePaneId,
  });

  // --- Search ---
  const handleToggleSearch = useCallback(() => {
    setActiveLeftPanel('search');
    if (!appSettings.isLeftSidebarOpen) {
      updateAppSettings(draft => { draft.isLeftSidebarOpen = true; });
    }
  }, [appSettings.isLeftSidebarOpen, updateAppSettings]);

  // --- Screenshot Handlers ---
  const refreshScreenshotCount = useCallback(async () => {
    if (!window.electronAPI?.getScreenshotCount) return;
    const count = await window.electronAPI.getScreenshotCount();
    setScreenshotCount(count);
  }, []);

  // Note: Screenshot capture is now handled entirely in main process via global shortcut.

  const handleOpenScreenshotsFolder = useCallback(async () => {
    if (!window.electronAPI?.openScreenshotsFolder) return;
    await window.electronAPI.openScreenshotsFolder();
  }, []);

  const handleClearScreenshots = useCallback(async () => {
    if (!window.electronAPI?.clearScreenshots) return;
    const result = await window.electronAPI.clearScreenshots();
    if (result.success) {
      addToast(`Cleared ${result.count} screenshot${result.count !== 1 ? 's' : ''}`, 'success');
      await refreshScreenshotCount();
      window.electronAPI.updateExplorerMenuState?.({ hasScreenshots: false });
    }
  }, [addToast, refreshScreenshotCount]);

  const handleCopyLatestScreenshotPath = useCallback(async () => {
    if (!window.electronAPI?.getLatestScreenshotPath) return;
    const path = await window.electronAPI.getLatestScreenshotPath();
    if (path) {
      await navigator.clipboard.writeText(path);
      addToast('Screenshot path copied to clipboard', 'success');
    }
  }, [addToast]);

  const {
      handleCreateNode, handleRenameNode, handleDeleteNode, handleMoveNode,
      handleCut, handleCopy, handlePaste,
  } = useFileSystemManager({
      projectRootPath, setFileSystemTree, blocks, addBlock, deleteBlock,
      clipboard, setClipboard, openDeleteConfirmModal, addToast,
  });

  // --- User Snippet CRUD ---
  const handleSaveSnippet = (snippet: UserSnippet) => {
      updateAppSettings(draft => {
          if (!draft.userSnippets) draft.userSnippets = [];
          const idx = draft.userSnippets.findIndex(s => s.id === snippet.id);
          if (idx >= 0) {
              draft.userSnippets[idx] = snippet;
          } else {
              draft.userSnippets.push(snippet);
          }
      });
      setHasUnsavedSettings(true);
  };
  const handleDeleteSnippet = (snippetId: string) => {
      updateAppSettings(draft => {
          if (draft.userSnippets) {
              draft.userSnippets = draft.userSnippets.filter(s => s.id !== snippetId);
          }
      });
      setHasUnsavedSettings(true);
  };

  // --- Menu Template CRUD ---
  const handleSaveMenuTemplate = (template: MenuTemplate) => {
      updateAppSettings(draft => {
          if (!draft.menuTemplates) draft.menuTemplates = [];
          const idx = draft.menuTemplates.findIndex(t => t.id === template.id);
          if (idx >= 0) {
              draft.menuTemplates[idx] = { ...template, updatedAt: Date.now() };
          } else {
              draft.menuTemplates.push(template);
          }
      });
      setHasUnsavedSettings(true);
  };

  const handleDeleteMenuTemplate = (templateId: string) => {
      updateAppSettings(draft => {
          if (draft.menuTemplates) {
              draft.menuTemplates = draft.menuTemplates.filter(t => t.id !== templateId);
          }
      });
      setHasUnsavedSettings(true);
  };

  // --- Active Editor Helper ---
  // Returns the currently active editor instance from either primary or secondary panel
  // Prioritizes the currently active pane, then falls back to the other pane
  const getActiveEditor = useCallback(() => {
      // Helper to check a specific panel for an editor
      const getEditorFromPanel = (tabs: EditorTab[], tabId: string) => {
          const editorTab = tabs.find(t => t.id === tabId && t.type === 'editor');
          if (editorTab?.blockId) {
              return editorInstances.current.get(editorTab.blockId) ?? null;
          }
          return null;
      };

      // Check active pane first
      if (activePaneId === 'primary') {
          const editor = getEditorFromPanel(openTabs, activeTabId);
          if (editor) return editor;
          // Fallback to secondary panel
          return getEditorFromPanel(secondaryOpenTabs, secondaryActiveTabId);
      } else {
          const editor = getEditorFromPanel(secondaryOpenTabs, secondaryActiveTabId);
          if (editor) return editor;
          // Fallback to primary panel
          return getEditorFromPanel(openTabs, activeTabId);
      }
  }, [openTabs, activeTabId, secondaryOpenTabs, secondaryActiveTabId, activePaneId]);

  // Legacy alias for color picker (uses same logic)
  const getActiveColorPickerEditor = getActiveEditor;

  const handleInsertColor = useCallback((hex: string) => {
      const editor = getActiveColorPickerEditor();
      if (!editor) { addToast('Open a file in the editor to insert a color.', 'warning'); return; }
      const pos = editor.getPosition();
      if (!pos) return;
      editor.executeEdits('color-picker', [{
          range: new monaco.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column),
          text: hex,
          forceMoveMarkers: true,
      }]);
      editor.focus();
  }, [getActiveColorPickerEditor, addToast]);

  const handleWrapSelectionWithColor = useCallback((hex: string) => {
      const editor = getActiveColorPickerEditor();
      if (!editor) { addToast('Open a file in the editor to wrap text with a color tag.', 'warning'); return; }
      const selection = editor.getSelection();
      if (!selection || selection.isEmpty()) {
          addToast('Select text in the editor first, then click Wrap.', 'info');
          return;
      }
      const selectedText = editor.getModel()?.getValueInRange(selection) ?? '';
      editor.executeEdits('color-picker-wrap', [{
          range: selection,
          text: `{color=${hex}}${selectedText}{/color}`,
          forceMoveMarkers: true,
      }]);
      editor.focus();
  }, [getActiveColorPickerEditor, addToast]);

  const handleCopyColorHex = useCallback((hex: string) => {
      navigator.clipboard.writeText(hex)
          .then(() => addToast(`Copied ${hex}`, 'success'))
          .catch(() => addToast('Failed to copy to clipboard', 'error'));
  }, [addToast]);

  // --- Explorer Selection → File Menu State Sync ---
  useEffect(() => {
    if (!window.electronAPI?.updateExplorerMenuState) return;
    const selectedArr = Array.from(explorerSelectedPaths);
    const hasAnySelection = selectedArr.length > 0;
    const hasSingleSelection = selectedArr.length === 1;
    let hasFolderSelected = false;
    if (hasSingleSelection && fileSystemTree) {
      const findNode = (node: FileSystemTreeNode, path: string): FileSystemTreeNode | null => {
        if (node.path === path) return node;
        if (node.children) {
          for (const child of node.children) {
            const found = findNode(child, path);
            if (found) return found;
          }
        }
        return null;
      };
      const node = findNode(fileSystemTree, selectedArr[0]);
      hasFolderSelected = node !== null && node.children !== undefined;
    }
    window.electronAPI.updateExplorerMenuState({
      canNewFile: hasFolderSelected,
      canNewFolder: hasFolderSelected,
      canRename: hasSingleSelection,
      canDelete: hasAnySelection,
    });
  }, [explorerSelectedPaths, fileSystemTree]);

  // --- Menu Command Handling ---
  useEffect(() => {
        if (!window.electronAPI) return;
        const removeListener = window.electronAPI.onMenuCommand((data: { command: string, type?: 'canvas' | 'route-canvas' | 'punchlist', path?: string }) => {
            if (data.command === 'new-project') handleNewProjectRequest();
            if (data.command === 'open-project') handleOpenProjectFolder();
            if (data.command === 'open-recent' && data.path) handleOpenWithRenpyCheck(data.path);
            if (data.command === 'save-all') handleSaveAll();
            if (data.command === 'run-project' && projectRootPath) window.electronAPI?.runGame(appSettings.renpyPath, projectRootPath);
            if (data.command === 'stop-project') window.electronAPI?.stopGame();
            if (data.command === 'open-static-tab' && data.type) handleOpenStaticTab(data.type as 'canvas' | 'route-canvas' | 'diagnostics' | 'translations' | 'screen-preview');
            if (data.command === 'toggle-search') handleToggleSearch();
            if (data.command === 'open-settings') openSettingsModal();
            if (data.command === 'open-shortcuts') openShortcutsModal();
            if (data.command === 'open-about') openAboutModal();
            if (data.command === 'show-tutorial') openTutorial();
            if (data.command === 'toggle-left-sidebar') updateAppSettings(draft => { draft.isLeftSidebarOpen = !draft.isLeftSidebarOpen; });
            if (data.command === 'toggle-right-sidebar') updateAppSettings(draft => { draft.isRightSidebarOpen = !draft.isRightSidebarOpen; });
            if (data.command === 'explorer-new-file') setExplorerExternalAction({ type: 'new-file', key: Date.now() });
            if (data.command === 'explorer-new-folder') setExplorerExternalAction({ type: 'new-folder', key: Date.now() });
            if (data.command === 'explorer-rename') setExplorerExternalAction({ type: 'rename', key: Date.now() });
            if (data.command === 'explorer-delete') handleDeleteNode(Array.from(explorerSelectedPaths));
            if (data.command === 'explorer-refresh') handleRefreshProject();
            // Note: 'capture-screenshot' command removed - screenshots are now captured
            // entirely in main process via global shortcut for reliability during crashes
            if (data.command === 'open-screenshots-folder') handleOpenScreenshotsFolder();
            if (data.command === 'close-tab') {
                // Close the currently active tab
                const currentPaneId = activePaneId;
                const currentTabId = currentPaneId === 'primary' ? activeTabId : secondaryActiveTabId;
                if (currentTabId) {
                    handleCloseTab(currentTabId, currentPaneId);
                }
            }
        });
        return removeListener;
  }, [handleNewProjectRequest, handleOpenProjectFolder, handleOpenWithRenpyCheck, loadProject, handleSaveAll, projectRootPath, appSettings.renpyPath, handleOpenStaticTab, handleToggleSearch, updateAppSettings, handleDeleteNode, explorerSelectedPaths, handleRefreshProject, handleOpenScreenshotsFolder, handleCloseTab, activePaneId, activeTabId, secondaryActiveTabId, openAboutModal, openSettingsModal, openShortcutsModal, openTutorial, setExplorerExternalAction]);

  // --- Screenshot Count ---
  useEffect(() => {
    if (projectRootPath) {
      void refreshScreenshotCount();
    }
  }, [projectRootPath, refreshScreenshotCount]);

  // Listen for screenshot capture events from main process
  useEffect(() => {
    if (!window.electronAPI?.onScreenshotCaptured) return;
    const removeListener = window.electronAPI.onScreenshotCaptured((data: { filename: string; filepath: string }) => {
      // Show in-app toast (only works if renderer is alive)
      addToast(`Screenshot saved: ${data.filename}`, 'success');
      // Refresh count
      void refreshScreenshotCount();
    });
    return removeListener;
  }, [addToast, refreshScreenshotCount]);

  // Update menu state when screenshot count changes
  useEffect(() => {
    if (window.electronAPI?.updateExplorerMenuState) {
      window.electronAPI.updateExplorerMenuState({ hasScreenshots: screenshotCount > 0 });
    }
  }, [screenshotCount]);

  // --- Game Running State ---
  useEffect(() => {
      if (!window.electronAPI) return;
      const removeStarted = window.electronAPI.onGameStarted(() => setIsGameRunning(true));
      const removeStopped = window.electronAPI.onGameStopped(() => {
        setIsGameRunning(false);
        void cleanupWarpTempFile();
      });
      const removeError = window.electronAPI.onGameError(() => {
        setIsGameRunning(false);
        void cleanupWarpTempFile();
      });
      return () => { removeStarted(); removeStopped(); removeError(); };
  }, [cleanupWarpTempFile]);

  // --- Auto-update notifications ---
  useEffect(() => {
      if (!window.electronAPI?.onUpdateAvailable) return;
      const removeAvailable = window.electronAPI.onUpdateAvailable((version: string) => {
          addToast(`Update v${version} is downloading in the background.`, 'info');
      });
      const removeNotAvailable = window.electronAPI.onUpdateNotAvailable?.(() => {
          addToast("Ren'IDE is up to date.", 'info');
      });
      const removeError = window.electronAPI.onUpdateError?.(() => {
          addToast('Could not check for updates. Check your connection and try again.', 'error');
      });
      const removeDownloaded = window.electronAPI.onUpdateDownloaded((version: string) => {
          addToast(`Update v${version} ready — restart Ren'IDE to install.`, 'success');
      });
      return () => {
          removeAvailable();
          removeNotAvailable?.();
          removeError?.();
          removeDownloaded();
      };
  }, [addToast]);

  // --- External File Change Detection ---
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

  // --- Exit Handling ---
  const hasUnsavedSettingsRef = useRef(hasUnsavedSettings);
  const handleSaveAllRef = useRef(handleSaveAll);
  const handleSaveProjectSettingsRef = useRef(handleSaveProjectSettings);

  useEffect(() => { hasUnsavedSettingsRef.current = hasUnsavedSettings; }, [hasUnsavedSettings]);
  useEffect(() => { handleSaveAllRef.current = handleSaveAll; }, [handleSaveAll]);
  useEffect(() => { handleSaveProjectSettingsRef.current = handleSaveProjectSettings; }, [handleSaveProjectSettings]);

  // Toast for first-time implicit variable detection
  useEffect(() => {
    if (!analysisResult || !projectRootPath) return;

    const implicitVarCount = Array.from(analysisResult.variables.values())
      .filter(v => v.type === 'implicit').length;

    const hasSeenToast = localStorage.getItem(`implicit-var-toast-${projectRootPath}`);

    if (implicitVarCount >= 10 && !hasSeenToast && !dismissedImplicitVarHint) {
      addToast(`${implicitVarCount} implicit variables detected. Check the Variables pane or Diagnostics tab for details.`, 'info');
      localStorage.setItem(`implicit-var-toast-${projectRootPath}`, 'true');
    }
  }, [analysisResult, projectRootPath, dismissedImplicitVarHint, addToast]);

  useEffect(() => {
      if (!window.electronAPI) return;

      const removeCheck = window.electronAPI.onCheckUnsavedChangesBeforeExit(() => {
          const hasUnsaved = dirtyBlockIdsRef.current.size > 0 || dirtyEditorsRef.current.size > 0 || hasUnsavedSettingsRef.current;
          window.electronAPI!.replyUnsavedChangesBeforeExit(hasUnsaved);
      });

      const removeShowModal = window.electronAPI.onShowExitModal(() => {
          openUnsavedChangesModal({
              title: 'Unsaved Changes',
              message: 'You have unsaved changes. Do you want to save them before exiting?',
              confirmText: 'Save & Exit',
              dontSaveText: "Don't Save",
              onConfirm: async () => {
                  try {
                      await handleSaveAllRef.current();
                  } catch (err) {
                      logger.error('Failed to save before exit:', err);
                  }
                  window.electronAPI!.ideStateSavedForQuit();
              },
              onDontSave: () => {
                  window.electronAPI!.ideStateSavedForQuit();
              },
              onCancel: () => {
                  closeUnsavedChangesModal();
              }
          });
      });

      const removeSaveState = window.electronAPI.onSaveIdeStateBeforeQuit(async () => {
          try {
              await handleSaveProjectSettingsRef.current();
          } catch (err) {
              logger.error('Failed to save IDE state before quit:', err);
          }
          window.electronAPI!.ideStateSavedForQuit();
      });

      return () => {
          removeCheck();
          removeShowModal();
          removeSaveState();
      };
  }, [closeUnsavedChangesModal, openUnsavedChangesModal]);

  // --- Memoized callbacks for StoryElementsPanel and related JSX ---

  const handleAddVariable = useCallback(async (v: { name: string; initialValue: string }) => {
    const varContent = `default ${v.name} = ${v.initialValue}\n`;
    const targetFile = 'game/variables.rpy';
    const existing = blocks.find(b => b.filePath === targetFile);
    if (existing) {
      updateBlock(existing.id, { content: existing.content + '\n' + varContent });
      addToast(`Added variable ${v.name} to variables.rpy`, 'success');
    } else if (window.electronAPI && projectRootPath) {
      try {
        const fullPath = await window.electronAPI.path.join(projectRootPath, 'game', 'variables.rpy') as string;
        const res = await window.electronAPI.writeFile(fullPath, varContent);
        if (res.success) {
          addBlock(targetFile, varContent);
          const projData = await window.electronAPI.loadProject(projectRootPath);
          setFileSystemTree(projData.tree);
          addToast(`Created variables.rpy and added variable ${v.name}`, 'success');
        } else {
          const errorMsg = typeof res.error === 'string' ? res.error : 'Unknown error';
          throw new Error(errorMsg);
        }
      } catch (e) {
        addToast(`Failed to create variables.rpy: ${formatErrorMessage(e)}`, 'error');
      }
    } else {
      addBlock(targetFile, varContent);
      addToast(`Added variable ${v.name} to variables.rpy`, 'success');
    }
  }, [blocks, updateBlock, addToast, projectRootPath, addBlock, setFileSystemTree]);

  const handleEditVariable = useCallback((oldName: string, updated: Omit<Variable, 'definedInBlockId' | 'line'>) => {
    const escapeForRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const oldVar = analysisResult.variables.get(oldName);
    if (!oldVar) {
        addToast(`Error: Cannot find definition for variable '${oldName}'.`, 'error');
        return;
    }

    const defBlock = blocks.find(b => b.id === oldVar.definedInBlockId);
    if (!defBlock) {
        addToast(`Error: Cannot find the file containing variable '${oldName}'.`, 'error');
        return;
    }

    // Build regex for the definition line: `default oldName = ...` or `define oldName = ...`
    const defRegex = new RegExp(
        `^(\\s*(?:define|default)\\s+)${escapeForRegex(oldName)}(\\s*=)`,
        'm'
    );

    if (!defRegex.test(defBlock.content)) {
        addToast(`Error: Could not locate the declaration of '${oldName}' in the source file.`, 'error');
        return;
    }

    // Update the definition line: replace name, and if the type changed, replace the keyword too
    const newName = updated.name;
    const newType = updated.type; // 'define' or 'default'
    const newInitialValue = updated.initialValue;

    // Replace the full definition line (keyword + name + = + value)
    const fullDefRegex = new RegExp(
        `^(\\s*)(?:define|default)\\s+${escapeForRegex(oldName)}\\s*=\\s*(.*)$`,
        'm'
    );
    const newDefContent = defBlock.content.replace(fullDefRegex, `$1${newType} ${newName} = ${newInitialValue}`);

    if (oldName !== newName) {
        // Rename all references across all blocks
        const usageRegex = new RegExp(`\\b${escapeForRegex(oldName)}\\b`, 'g');
        let renamedFileCount = 0;

        blocks.forEach(block => {
            const base = block.id === defBlock.id ? newDefContent : block.content;
            const replaced = base.replace(usageRegex, newName);

            if (block.id === defBlock.id) {
                updateBlock(block.id, { content: replaced });
                renamedFileCount++;
            } else if (replaced !== base) {
                updateBlock(block.id, { content: replaced });
                renamedFileCount++;
            }
        });

        addToast(`Renamed "${oldName}" to "${newName}" in ${renamedFileCount} file(s).`, 'success');
    } else {
        // Only type or initial value changed — update just the definition block
        updateBlock(defBlock.id, { content: newDefContent });
        addToast(`Variable "${oldName}" updated.`, 'success');
    }
  }, [analysisResult.variables, blocks, updateBlock, addToast]);

  const handleFindScreenDefinition = useCallback((name: string) => {
    const def = analysisResult.screens.get(name);
    if (def) handleOpenEditor(def.definedInBlockId, def.line);
  }, [analysisResult.screens, handleOpenEditor]);



  const handleHoverHighlightStart = useCallback((key: string, type: 'character' | 'variable') => {
    const ids = new Set<string>();
    if (type === 'character') {
      analysisResult.dialogueLines.forEach((dialogues, blockId) => {
        if (dialogues.some(d => d.tag === key)) ids.add(blockId);
      });
    } else {
      analysisResult.variableUsages.get(key)?.forEach(u => ids.add(u.blockId));
    }
    setHoverHighlightIds(ids);
  }, [analysisResult.dialogueLines, analysisResult.variableUsages, setHoverHighlightIds]);

  const handleHoverHighlightEnd = useCallback(() => setHoverHighlightIds(null), [setHoverHighlightIds]);

  // --- Tab helpers (used by both panes) ---
  const { renderTabContent, renderTabBar } = useTabContentRenderer({
    editorInstances, blocksRef, pendingTagRenameRef,
    blocks, groups, selectedBlockIds, setSelectedBlockIds, selectedGroupIds, setSelectedGroupIds,
    updateBlock, updateGroup, updateBlockPositions, updateGroupPositions, deleteBlockWithFile,
    analysisResult, analysisResultWithProfiles, routeAnalysisResult, diagnosticsResult,
    diagnosticsTasks, setDiagnosticsTasks, ignoredDiagnostics, setIgnoredDiagnostics,
    setHasUnsavedSettings, analysisLabelKeys,
    stickyNotes, updateStickyNote, deleteStickyNote, addStickyNote,
    routeStickyNotes, addRouteStickyNote, updateRouteStickyNote, deleteRouteStickyNote,
    choiceStickyNotes, addChoiceStickyNote, updateChoiceStickyNote, deleteChoiceStickyNote,
    allStickyNotes,
    canvasInteractionEnd, findUsagesHighlightIds, handleClearFindUsages,
    canvasFilters, setCanvasFilters, centerOnBlockRequest, flashBlockRequest, hoverHighlightIds,
    storyCanvasTransform, setStoryCanvasTransform, routeCanvasTransform, setRouteCanvasTransform,
    choiceCanvasTransform, setChoiceCanvasTransform,
    centerOnRouteStartRequest, centerOnChoiceStartRequest, centerOnRouteNodeRequest, centerOnChoiceNodeRequest,
    handleUpdateRouteNodePositions, handleWarpToLabel, handleCenterOnBlock,
    appSettings, projectSettings,
    handleChangeStoryCanvasLayoutMode, handleChangeStoryCanvasGroupingMode,
    handleChangeRouteCanvasLayoutMode, handleChangeRouteCanvasGroupingMode,
    handleCreateBlockFromCanvas,
    images, imagesArray, imageMetadata, audios, audioMetadata,
    handleSaveImageMetadata, handleCopyImageToProject, handleSaveAudioMetadata, handleCopyAudioToProject,
    existingImageTags, existingAudioPaths,
    perfSnapshot, handleGenerateTranslations, isGeneratingTranslations, isRenpyPathValid,
    editorCursorBlockId, editorCursorPosition,
    setBlocks, handleSaveBlock, syncEditorToStateAndMarkDirty,
    setEditorCursorPosition, setEditorCursorBlockId, addToast, handleSaveMenuTemplate,
    characterTagsArray, handleUpdateCharacter,
    sceneCompositions, sceneNames, handleSceneUpdate, handleRenameScene, getActiveEditor,
    imagemapCompositions, handleImageMapUpdate, handleRenameImageMap,
    projectRootPath,
  });
  const focusedTabId = activePaneId === 'secondary' && splitLayout !== 'none'
    ? secondaryActiveTabId
    : activeTabId;
  const activeCanvasType: 'story' | 'route' | 'choice' | null =
    focusedTabId === 'route-canvas' ? 'route' :
    focusedTabId === 'choice-canvas' ? 'choice' :
    focusedTabId === 'canvas' ? 'story' : null;
  const activeCanvasLayoutMode = activeCanvasType === 'route'
    ? (projectSettings.routeCanvasLayoutMode ?? 'flow-lr')
    : (projectSettings.storyCanvasLayoutMode ?? 'flow-lr');
  const activeCanvasGroupingMode = activeCanvasType === 'route'
    ? (projectSettings.routeCanvasGroupingMode ?? 'none')
    : (projectSettings.storyCanvasGroupingMode ?? 'none');
  const handleActiveCanvasTidyUp = () => {
    if (activeCanvasType === 'route') {
      applyRouteLayout(activeCanvasLayoutMode, activeCanvasGroupingMode, { showToast: true });
      return;
    }
    if (activeCanvasType === 'choice') return; // Choice canvas has no tidy-up (auto-layout only)
    handleTidyUp(true);
  };
  const activeCanvasOnAddStickyNote: (() => void) | null =
    activeCanvasType === 'story' ? () => addStickyNote() :
    activeCanvasType === 'route' ? () => addRouteStickyNote() :
    activeCanvasType === 'choice' ? () => addChoiceStickyNote() :
    null;

  const dualPaneContextValue: DualPaneContextValue = {
    openTabs, activeTabId, setOpenTabs, setActiveTabId,
    secondaryOpenTabs, secondaryActiveTabId, setSecondaryOpenTabs, setSecondaryActiveTabId,
    activePaneId, setActivePaneId,
    splitLayout, splitPrimarySize, setSplitLayout, setSplitPrimarySize,
    draggedTabId, dragSourcePaneId, setDraggedTabId, setDragSourcePaneId,
    openTab: _openTab, closeTab: _closeTab, switchTab: _switchTab, updateTab: _updateTab,
    closeTabs: _closeTabs, setTabs,
    createSplit: _createSplit, closeSplit: _closeSplit, setSplitSize: _setSplitSize,
    moveTabToPane: _moveTabToPane,
    startDrag: _startTabDrag, endDrag: _endTabDrag,
    findTab: _findTab, getActiveTab: _getActiveTab,
    dirtyBlockIds, dirtyEditors, setDirtyBlockIds, setDirtyEditors,
    dirtyBlockIdsRef, dirtyEditorsRef,
    handleCloseTab, processTabCloseRequest, handleCloseOthersRequest, handleCloseAllRequest,
    handleCloseLeftRequest, handleCloseRightRequest,
    handleSwitchTab, handleCreateSplit, handleOpenInSplit, handleMoveToOtherPane,
    handleCloseSecondaryPane, handleClosePrimaryPane,
    handleTabDragStart, handleTabDragOver, handleTabDrop,
    handleTabContextMenu,
    handleOpenEditor, handleOpenStaticTab, handleOpenRouteCanvasTab, handleOpenChoiceCanvasTab,
    handleOpenImageEditorTab, handleOpenMarkdownTab, handleOpenAudioEditorInTab, handlePathDoubleClick,
  };

  return (
    <DualPaneContext.Provider value={dualPaneContextValue}>
    <SearchProvider
      blocks={blocks}
      projectRootPath={projectRootPath}
      addToast={addToast}
    >
    <div
      data-app-ready={appSettingsLoaded ? "true" : undefined}
      data-project-ready={(!isLoading && !isInitialAnalysisPending && !!projectRootPath) ? "true" : undefined}
      className={`fixed inset-0 flex flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 ${appSettings.theme}`}>
      <Toolbar
        activeCanvasType={activeCanvasType}
        projectRootPath={projectRootPath}
        hasUnsavedSettings={hasUnsavedSettings}
        saveStatus={saveStatus}
        canUndo={canUndo}
        canRedo={canRedo}
        undo={undo}
        redo={redo}
        hideUndoRedo={openTabs.find(t => t.id === activeTabId)?.type === 'scene-composer'}
        addBlock={() => openCreateBlockModal('story')}
        handleTidyUp={handleActiveCanvasTidyUp}
        handleSave={handleSaveAll}
        onOpenSettings={() => openSettingsModal()}
        onOpenShortcuts={() => openShortcutsModal()}
        onOpenStaticTab={handleOpenStaticTab as (type: 'canvas' | 'route-canvas' | 'choice-canvas' | 'stats' | 'diagnostics' | 'translations' | 'screen-preview') => void}
        diagnosticsErrorCount={diagnosticsResult.errorCount}
        onAddStickyNote={activeCanvasOnAddStickyNote}
        isGameRunning={isGameRunning}
        onRunGame={handleRunGame}
        onWarpToLabel={() => openWarpToLabelModal()}
        onStopGame={() => window.electronAPI?.stopGame()}
        isRenpyPathValid={isRenpyPathValid}
        draftingMode={projectSettings.draftingMode}
        onToggleDraftingMode={handleToggleDraftingMode}
      />
      
      <div className="flex-grow flex overflow-hidden">
        {/* Left Sidebar */}
        {!appSettings.isLeftSidebarOpen && (
          <div className="flex-none w-6 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <button
              onClick={() => updateAppSettings(draft => { draft.isLeftSidebarOpen = true })}
              className="w-6 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
              title="Expand Left Sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.293 14.707a1 1 0 010-1.414L6.586 10 3.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0zm8 0a1 1 0 010-1.414L14.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            </button>
          </div>
        )}
        {appSettings.isLeftSidebarOpen && (
          <div style={{ width: appSettings.leftSidebarWidth }} className="flex-none flex flex-col border-r border-gray-200 dark:border-gray-700">
            <div className="flex-none flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveLeftPanel('explorer')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${activeLeftPanel === 'explorer' ? 'bg-white dark:bg-gray-900 shadow' : 'text-gray-600 dark:text-gray-300'}`}
                >
                  Explorer
                </button>
                <button
                  onClick={() => setActiveLeftPanel('search')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${activeLeftPanel === 'search' ? 'bg-white dark:bg-gray-900 shadow' : 'text-gray-600 dark:text-gray-300'}`}
                >
                  Search
                </button>
              </div>
              <button
                onClick={() => updateAppSettings(draft => { draft.isLeftSidebarOpen = false })}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Collapse Left Sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 14.707a1 1 0 010-1.414L13.414 10l3.293-3.293a1 1 0 00-1.414-1.414l-4 4a1 1 0 000 1.414l4 4a1 1 0 001.414 0zm-8 0a1 1 0 010-1.414L5.414 10l3.293-3.293a1 1 0 00-1.414-1.414l-4 4a1 1 0 000 1.414l4 4a1 1 0 001.414 0z" clipRule="evenodd" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              {activeLeftPanel === 'explorer' ? (
                <FileExplorerPanel
                    tree={fileSystemTree}
                    onFileOpen={handlePathDoubleClick}
                    onCreateNode={handleCreateNode}
                    onRenameNode={handleRenameNode}
                    onDeleteNode={handleDeleteNode}
                    onMoveNode={handleMoveNode}
                    clipboard={clipboard}
                    onCut={handleCut}
                    onCopy={handleCopy}
                    onPaste={handlePaste}
                    onCenterOnBlock={handleCenterOnBlock}
                    onRefresh={handleRefreshProject}
                    selectedPaths={explorerSelectedPaths}
                    setSelectedPaths={setExplorerSelectedPaths}
                    lastClickedPath={explorerLastClickedPath}
                    setLastClickedPath={setExplorerLastClickedPath}
                    expandedPaths={explorerExpandedPaths}
                    onToggleExpand={handleToggleExpandExplorer}
                    externalAction={explorerExternalAction}
                />
             ) : (
                <SearchPanel />
             )}
            </div>
          </div>
        )}
        {appSettings.isLeftSidebarOpen && (
            <Sash onDrag={(delta) => updateAppSettings(d => { d.leftSidebarWidth = Math.max(150, d.leftSidebarWidth + delta) })} />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-gray-900 relative">

          {!projectRootPath ? (
            /* No-project empty state */
            <div className="flex-grow flex items-center justify-center p-8">
              <div className="w-full max-w-md space-y-8 text-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Project Open</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Use the File menu or the buttons below to get started.</p>
                </div>
                {window.electronAPI && (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center" data-tutorial="project-menu">
                    <button
                      onClick={handleCreateProject}
                      className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      New Project
                    </button>
                    <button
                      onClick={handleOpenProjectFolder}
                      className="flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>
                      Open Project
                    </button>
                  </div>
                )}
                {appSettings.recentProjects.length > 0 && (
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700 text-left">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Recent Projects</h3>
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {appSettings.recentProjects.map((p, i) => {
                        const folderName = p.replace(/[/\\]$/, '').split(/[/\\]/).pop();
                        return (
                          <button
                            key={i}
                            onClick={() => handleOpenWithRenpyCheck(p)}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group flex items-center gap-3"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-indigo-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" /><path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" /></svg>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{folderName}</p>
                              <p className="text-xs text-gray-500 truncate">{p}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
            {/* External file change notifications */}
            {externallyChangedFiles.length > 0 && (
              <div className="flex-none border-b border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/30">
                {externallyChangedFiles.map(item => {
                  const fileName = item.relativePath.split('/').pop() ?? item.relativePath;
                  return (
                    <div key={item.relativePath} className="flex items-center gap-2 px-3 py-1.5 text-sm text-yellow-800 dark:text-yellow-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      <span className="font-medium truncate max-w-xs" title={item.relativePath}>{fileName}</span>
                      <span className="text-yellow-700 dark:text-yellow-300">was modified outside the editor.</span>
                      <button
                        onClick={() => handleReloadFromDisk(item)}
                        className="ml-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-yellow-900 dark:text-yellow-100 transition-colors"
                      >
                        Reload
                      </button>
                      <button
                        onClick={() => handleKeepCurrentFile(item.relativePath)}
                        className="px-2 py-0.5 rounded text-xs font-medium text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-800/50 transition-colors"
                      >
                        Keep current
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {/* Panes container — flex-row for right split, flex-col for bottom split */}
            <div className={`flex-grow flex ${splitLayout === 'bottom' ? 'flex-col' : 'flex-row'} overflow-hidden min-h-0`}>

              {/* PRIMARY PANE */}
              <div
                className="flex flex-col min-w-0 min-h-0"
                style={splitLayout === 'right' ? { width: splitPrimarySize, flexShrink: 0 } : splitLayout === 'bottom' ? { height: splitPrimarySize, flexShrink: 0 } : { flex: 1 }}
                onClick={() => activePaneId !== 'primary' && setActivePaneId('primary')}
              >
                {renderTabBar(openTabs, activeTabId, 'primary', primaryTabBarRef)}
                <div className="flex-grow relative overflow-hidden">
                  {openTabs.map(tab => {
                      const isActive = tab.id === activeTabId;
                      if (isActive) primaryMountedTabsRef.current.add(tab.id);
                      return (
                          <div key={tab.id} className="w-full h-full absolute" style={{ visibility: isActive ? 'visible' : 'hidden' }}>
                              {primaryMountedTabsRef.current.has(tab.id) ? renderTabContent(tab) : null}
                          </div>
                      );
                  })}
                </div>
              </div>

              {/* SASH between panes */}
              {splitLayout !== 'none' && (
                <Sash
                  direction={splitLayout === 'right' ? 'horizontal' : 'vertical'}
                  onDrag={(delta) => setSplitPrimarySize(prev => Math.max(200, prev + delta))}
                />
              )}

              {/* SECONDARY PANE */}
              {splitLayout !== 'none' && (
                <div
                  className="flex-1 flex flex-col min-w-0 min-h-0"
                  onClick={() => activePaneId !== 'secondary' && setActivePaneId('secondary')}
                >
                  {renderTabBar(secondaryOpenTabs, secondaryActiveTabId, 'secondary', secondaryTabBarRef)}
                  <div className="flex-grow relative overflow-hidden">
                    {secondaryOpenTabs.map(tab => {
                      const isActive = tab.id === secondaryActiveTabId;
                      if (isActive) secondaryMountedTabsRef.current.add(tab.id);
                      return (
                          <div key={tab.id} className="w-full h-full absolute" style={{ visibility: isActive ? 'visible' : 'hidden' }}>
                              {secondaryMountedTabsRef.current.has(tab.id) ? renderTabContent(tab) : null}
                          </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
            </>
          )}{/* end panes container / empty state */}

          <StatusBar
              isAnalysisPending={isAnalysisPending}
              isScanningAssets={isScanningAssets}
              saveStatus={saveStatus}
              blockCount={blocks.length}
              errorCount={diagnosticsResult.errorCount}
              warningCount={diagnosticsResult.warningCount}
              screenshotCount={screenshotCount}
              onOpenScreenshotsFolder={handleOpenScreenshotsFolder}
              onClearScreenshots={handleClearScreenshots}
              onCopyLatestScreenshotPath={handleCopyLatestScreenshotPath}
          />

        </div>

        {/* Right Sidebar */}
        {appSettings.isRightSidebarOpen && (
            <Sash onDrag={(delta) => updateAppSettings(d => { d.rightSidebarWidth = Math.max(200, d.rightSidebarWidth - delta) })} />
        )}
        {appSettings.isRightSidebarOpen && (
          <div style={{ width: appSettings.rightSidebarWidth }} className="flex-none relative border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <button
              onClick={() => updateAppSettings(draft => { draft.isRightSidebarOpen = false })}
              className="absolute top-3 right-3 z-10 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Collapse Right Sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.293 14.707a1 1 0 010-1.414L6.586 10 3.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0zm8 0a1 1 0 010-1.414L14.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            </button>
            <StoryElementsPanel
                analysisResult={analysisResultWithProfiles}
                onOpenCharacterEditor={handleOpenCharacterEditor}
                onFindCharacterUsages={(tag) => handleFindUsages(tag, 'character')}
                onAddVariable={handleAddVariable}
                onEditVariable={handleEditVariable}
                onFindVariableUsages={(name) => handleFindUsages(name, 'variable')}
                onFindScreenDefinition={handleFindScreenDefinition}
                // Image Props
                projectImages={images}
                imageMetadata={imageMetadata}
                imageScanDirectories={imageScanDirectories}
                onAddImageScanDirectory={handleAddImageScanDirectory}
                onRemoveImageScanDirectory={handleRemoveImageScanDirectory}
                onCopyImagesToProject={handleCopyImagesToProjectBulk}
                onOpenImageEditor={handleOpenImageEditorTab}
                imagesLastScanned={imagesLastScanned}
                isRefreshingImages={isRefreshingImages}
                onRefreshImages={handleRefreshImages}
                
                // Audio Props
                projectAudios={audios}
                audioMetadata={audioMetadata}
                audioScanDirectories={audioScanDirectories}
                onAddAudioScanDirectory={handleAddAudioScanDirectory}
                onRemoveAudioScanDirectory={handleRemoveAudioScanDirectory}
                onCopyAudiosToProject={handleCopyAudiosToProjectBulk}
                onOpenAudioEditor={handleOpenAudioEditorInTab}
                audiosLastScanned={audiosLastScanned}
                isRefreshingAudios={isRefreshingAudios}
                onRefreshAudios={handleRefreshAudios}
                isFileSystemApiSupported={!!window.electronAPI}
                onHoverHighlightStart={handleHoverHighlightStart}
                onHoverHighlightEnd={handleHoverHighlightEnd}
                // Scene Props
                scenes={scenesArray}
                onOpenScene={handleOpenScene}
                onCreateScene={handleCreateScene}
                onDeleteScene={handleDeleteScene}
                // ImageMap Props
                imagemaps={imagemapsArray}
                onOpenImageMap={handleOpenImageMap}
                onCreateImageMap={handleCreateImageMap}
                onDeleteImageMap={handleDeleteImageMap}
                // Snippet Props
                userSnippets={appSettings.userSnippets}
                onCreateSnippet={() => openUserSnippetModal()}
                onEditSnippet={(snippet) => openUserSnippetModal(snippet)}
                onDeleteSnippet={handleDeleteSnippet}
                projectRootPath={projectRootPath}
                // Menu Template Props
                menuTemplates={appSettings.menuTemplates || []}
                onCreateMenuTemplate={() => openMenuConstructorModal()}
                onEditMenuTemplate={(template) => openMenuConstructorModal(template)}
                onDeleteMenuTemplate={handleDeleteMenuTemplate}
                // Color Picker
                onInsertColorAtCursor={handleInsertColor}
                onWrapColorSelection={handleWrapSelectionWithColor}
                onCopyColorHex={handleCopyColorHex}
                projectColors={projectColors}
                // Accordion State Props
                projectSettings={projectSettings as ProjectSettings}
                onUpdateProjectSettings={updateProjectSettings}
                hasProject={!!projectRootPath}
                // Implicit Variable Banner
                dismissedImplicitVarHint={dismissedImplicitVarHint}
                onDismissImplicitVarHint={() => setDismissedImplicitVarHint(true)}
                onOpenDiagnostics={() => handleOpenStaticTab('diagnostics')}
            />
          </div>
        )}
        {!appSettings.isRightSidebarOpen && (
          <div className="flex-none w-6 flex flex-col border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <button
              onClick={() => updateAppSettings(draft => { draft.isRightSidebarOpen = true })}
              className="w-6 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
              title="Expand Right Sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 14.707a1 1 0 010-1.414L13.414 10l3.293-3.293a1 1 0 00-1.414-1.414l-4 4a1 1 0 000 1.414l4 4a1 1 0 001.414 0zm-8 0a1 1 0 010-1.414L5.414 10l3.293-3.293a1 1 0 00-1.414-1.414l-4 4a1 1 0 000 1.414l4 4a1 1 0 001.414 0z" clipRule="evenodd" /></svg>
            </button>
          </div>
        )}
      </div>

      {/* Modals and Overlays */}
      {nonRenpyWarningPath && (
        <ConfirmModal
          title="Folder may not be a Ren'Py project"
          confirmText="Open Anyway"
          confirmClassName="bg-indigo-600 hover:bg-indigo-700"
          onConfirm={() => {
            const path = nonRenpyWarningPath;
            setNonRenpyWarningPath(null);
            loadProject(path);
          }}
          onClose={() => setNonRenpyWarningPath(null)}
        >
          The selected folder doesn't appear to contain a Ren'Py project — no{' '}
          <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">game/</code>{' '}
          folder or <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">.rpy</code>{' '}
          files were found. You can still open it, but it may not work as expected.
        </ConfirmModal>
      )}

      {isLoading && <LoadingOverlay progress={loadingProgress} message={loadingMessage} onCancel={handleCancelLoad} />}
      {isInitialAnalysisPending && !isLoading && <AnalysisOverlay blockCount={blocks.length} progress={analysisProgress} />}
      
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col space-y-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onDismiss={removeToast} />
          </div>
        ))}
      </div>

      <CreateBlockModal
        isOpen={createBlockModalOpen}
        onClose={closeCreateBlockModal}
        onConfirm={(name, type) => handleCreateBlockConfirm(name, type, createBlockModalFolderPath, createBlockModalPosition)}
        defaultPath={createBlockModalFolderPath || getSelectedFolderForNewBlock()}
        initialType={createBlockModalType}
      />

      <ConfigureRenpyModal
        isOpen={showConfigureRenpyModal}
        onClose={() => closeConfigureRenpyModal()}
        onSave={(path) => {
            updateAppSettings(draft => { draft.renpyPath = path; });
            closeConfigureRenpyModal();
            if (projectRootPath && window.electronAPI) {
                window.electronAPI.runGame(path, projectRootPath);
            }
        }}
      />

            {unsavedChangesModalInfo && (
                <ConfirmModal
                    title={unsavedChangesModalInfo.title}
                    onConfirm={unsavedChangesModalInfo.onConfirm}
                    onClose={unsavedChangesModalInfo.onCancel}
                    confirmText={unsavedChangesModalInfo.confirmText}
                    secondaryAction={{
                        onClick: unsavedChangesModalInfo.onDontSave,
                        label: unsavedChangesModalInfo.dontSaveText,
                        className: 'bg-red-600 hover:bg-red-700'
                    }}
                >
                        <div className="space-y-4">
                                <p>{unsavedChangesModalInfo.message}</p>
                        </div>
                </ConfirmModal>
            )}

      {deleteConfirmInfo && (
          <ConfirmModal
            title="Confirm Deletion"
            onConfirm={() => {
                deleteConfirmInfo.onConfirm();
                closeDeleteConfirmModal();
            }}
            onClose={() => closeDeleteConfirmModal()}
            confirmText="Delete"
            confirmClassName="bg-red-600 hover:bg-red-700"
          >
              Are you sure you want to delete {deleteConfirmInfo.paths.length} item(s)? This cannot be undone.
          </ConfirmModal>
      )}

      {contextMenuInfo && createPortal(
          <TabContextMenu
              x={contextMenuInfo.x}
              y={contextMenuInfo.y}
              tabId={contextMenuInfo.tabId}
              paneId={contextMenuInfo.paneId}
              onClose={() => closeContextMenu()}
              onCloseTab={(id) => handleCloseTab(id, contextMenuInfo.paneId)}
              onCloseOthers={(id) => handleCloseOthersRequest(id, contextMenuInfo.paneId)}
              onCloseLeft={(id) => handleCloseLeftRequest(id, contextMenuInfo.paneId)}
              onCloseRight={(id) => handleCloseRightRequest(id, contextMenuInfo.paneId)}
              onCloseAll={() => handleCloseAllRequest(contextMenuInfo.paneId)}
              onSplitRight={(id) => handleOpenInSplit(id, 'right')}
              onSplitBottom={(id) => handleOpenInSplit(id, 'bottom')}
              onMoveToOtherPane={(id) => handleMoveToOtherPane(id, contextMenuInfo.paneId)}
          />,
          document.body
      )}

      <SettingsModal 
        isOpen={settingsModalOpen} 
        onClose={() => closeSettingsModal()}
        settings={settingsMerged}
        onSettingsChange={(key, value) => {
            if (key in appSettings) {
                updateAppSettings(draft => {
                    (draft as Record<string, unknown>)[key] = value;
                });
            } else {
                updateProjectSettings(draft => {
                    (draft as Record<string, unknown>)[key] = value;
                });
                setHasUnsavedSettings(true);
            }
        }}
      />

      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => closeShortcutsModal()}
        mouseGestures={appSettings.mouseGestures}
        onOpenSettings={() => { closeShortcutsModal(); openSettingsModal(); }}
      />

      <UserSnippetModal
        isOpen={userSnippetModalOpen}
        onClose={() => closeUserSnippetModal()}
        onSave={handleSaveSnippet}
        existingSnippet={editingSnippet}
      />

      <MenuConstructorModal
        isOpen={menuConstructorModalOpen}
        onClose={() => closeMenuConstructorModal()}
        onInsert={(code, templateData) => {
          if (templateData) {
            const now = Date.now();
            const template: MenuTemplate = {
              id: editingMenuTemplate?.id || `template-${now}`,
              name: templateData.name,
              description: templateData.description,
              menuStatement: templateData.menuStatement,
              choices: templateData.choices,
              createdAt: editingMenuTemplate?.createdAt || now,
              updatedAt: now,
            };
            handleSaveMenuTemplate(template);
          }
          closeMenuConstructorModal();
        }}
        initialTemplate={editingMenuTemplate || undefined}
        labels={menuLabels}
        variables={menuVariables}
        mode="edit-template"
        activeEditor={getActiveEditor()}
      />

      <NewProjectWizardModal
        isOpen={wizardModalOpen}
        onClose={() => closeWizardModal()}
        onComplete={handleWizardComplete}
        sdkPath={appSettings.renpyPath}
        lastProjectDir={appSettings.lastProjectDir || ''}
        onProjectDirSaved={(dir) => updateAppSettings(draft => { draft.lastProjectDir = dir; })}
      />

      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => closeAboutModal()}
      />
      <GoToLabelModal
        isOpen={isGoToLabelOpen}
        items={goToLabelItems}
        canvasName={goToLabelCanvasName}
        onSelect={handleGoToLabel}
        onClose={() => closeGoToLabelModal()}
      />
      <GoToLabelModal
        isOpen={isWarpToLabelOpen}
        items={warpLabelItems}
        canvasName="Warp"
        title="Warp to Label"
        placeholder="Warp to label…"
        emptyStateText="No labels available"
        onSelect={handleWarpToLabel}
        onClose={() => closeWarpToLabelModal()}
      />
      <WarpVariablesModal
        isOpen={isWarpVariablesOpen}
        defaultVariables={pendingWarpVariableDrafts}
        hasExistingAfterWarp={hasAfterWarpLabel(analysisResult.labels)}
        warpLabelName={pendingWarpLabelName ?? undefined}
        onClose={resetWarpLaunchState}
        onConfirm={handleConfirmWarpVariables}
      />

      <FirstRunTutorial
        forceShow={showTutorial}
        onComplete={() => closeTutorial()}
      />
    </div>
    </SearchProvider>
    </DualPaneContext.Provider>
  );
};

export default App;
