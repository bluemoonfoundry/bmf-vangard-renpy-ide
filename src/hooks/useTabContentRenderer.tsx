/**
 * @file useTabContentRenderer.tsx
 * @description Custom hook for rendering editor tab labels, tab content, and the tab bar
 * chrome. Extracted from App.tsx — owns no state itself, it renders whichever canvas /
 * editor / composer view corresponds to the active `EditorTab`.
 */

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import type { Updater } from 'use-immer';
import StoryCanvas from '@/components/StoryCanvas';
import RouteCanvas from '@/components/RouteCanvas';
import ChoiceCanvas from '@/components/ChoiceCanvas';
import DiagnosticsPanel from '@/components/DiagnosticsPanel';
import StatsView from '@/components/StatsView';
import TranslationDashboard from '@/components/TranslationDashboard';
import ScreenPreviewTab from '@/components/ScreenPreviewTab';
import EditorView from '@/components/EditorView';
import ImageEditorView from '@/components/ImageEditorView';
import AudioEditorView from '@/components/AudioEditorView';
import CharacterEditorView from '@/components/CharacterEditorView';
import SceneComposer from '@/components/SceneComposer';
import ImageMapComposer from '@/components/ImageMapComposer';
import MarkdownPreviewView from '@/components/MarkdownPreviewView';
import type { BlockType } from '@/components/CreateBlockModal';
import type { PerformanceSnapshot } from '@/hooks/usePerformanceMetrics';
import type {
  Block, BlockGroup, Position, EditorTab, AppSettings, ProjectSettings,
  ProjectImage, RenpyAudio, ImageMetadata, AudioMetadata, Character,
  SceneComposition, ImageMapComposition, DiagnosticsTask, IgnoredDiagnosticRule,
  StickyNote, RenpyAnalysisResult, DiagnosticsResult, LabelNode, RouteLink,
  IdentifiedRoute, StoryCanvasGroupingMode, StoryCanvasLayoutMode, MenuTemplate,
} from '@/types';

type ProjectSettingsState = Omit<ProjectSettings,
  'openTabs' | 'activeTabId' | 'stickyNotes' | 'characterProfiles' | 'punchlistMetadata' |
  'diagnosticsTasks' | 'ignoredDiagnostics' | 'sceneCompositions' | 'sceneNames' |
  'scannedImagePaths' | 'scannedAudioPaths'>;
import type {
  CanvasFilters, CanvasTransform, CenterOnBlockRequest, FlashBlockRequest,
  CenterOnStartRequest, CenterOnNodeRequest,
} from '@/hooks/useCanvasInteraction';

interface RouteAnalysisResultLike {
  labelNodes: LabelNode[];
  routeLinks: RouteLink[];
  identifiedRoutes: IdentifiedRoute[];
  routesTruncated: boolean;
}

export interface UseTabContentRendererParams {
  // Refs
  editorInstances: React.MutableRefObject<Map<string, monaco.editor.IStandaloneCodeEditor>>;
  blocksRef: React.MutableRefObject<Block[]>;
  pendingTagRenameRef: React.MutableRefObject<{ oldTag: string; newTag: string } | null>;

  // Blocks / groups
  blocks: Block[];
  groups: BlockGroup[];
  selectedBlockIds: string[];
  setSelectedBlockIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedGroupIds: string[];
  setSelectedGroupIds: React.Dispatch<React.SetStateAction<string[]>>;
  updateBlock: (id: string, data: Partial<Block>) => void;
  updateGroup: (id: string, data: Partial<BlockGroup>) => void;
  updateBlockPositions: (updates: { id: string, position: Position }[]) => void;
  updateGroupPositions: (updates: { id: string, position: Position }[]) => void;
  deleteBlockWithFile: (id: string) => Promise<void>;
  dirtyBlockIds: Set<string>;
  dirtyEditors: Set<string>;

  // Analysis results
  analysisResult: RenpyAnalysisResult;
  analysisResultWithProfiles: RenpyAnalysisResult;
  routeAnalysisResult: RouteAnalysisResultLike;
  diagnosticsResult: DiagnosticsResult;
  diagnosticsTasks: DiagnosticsTask[];
  setDiagnosticsTasks: Updater<DiagnosticsTask[]>;
  ignoredDiagnostics: IgnoredDiagnosticRule[];
  setIgnoredDiagnostics: Updater<IgnoredDiagnosticRule[]>;
  setHasUnsavedSettings: React.Dispatch<React.SetStateAction<boolean>>;
  analysisLabelKeys: string[];

  // Sticky notes
  stickyNotes: StickyNote[];
  updateStickyNote: (id: string, data: Partial<StickyNote>) => void;
  deleteStickyNote: (id: string) => void;
  addStickyNote: (initialPosition?: Position) => void;
  routeStickyNotes: StickyNote[];
  addRouteStickyNote: (initialPosition?: Position) => void;
  updateRouteStickyNote: (id: string, data: Partial<StickyNote>) => void;
  deleteRouteStickyNote: (id: string) => void;
  choiceStickyNotes: StickyNote[];
  addChoiceStickyNote: (initialPosition?: Position) => void;
  updateChoiceStickyNote: (id: string, data: Partial<StickyNote>) => void;
  deleteChoiceStickyNote: (id: string) => void;
  allStickyNotes: StickyNote[];

  // Canvas interaction
  canvasInteractionEnd: () => void;
  findUsagesHighlightIds: Set<string> | null;
  handleClearFindUsages: () => void;
  canvasFilters: CanvasFilters;
  setCanvasFilters: React.Dispatch<React.SetStateAction<CanvasFilters>>;
  centerOnBlockRequest: CenterOnBlockRequest | null;
  flashBlockRequest: FlashBlockRequest | null;
  hoverHighlightIds: Set<string> | null;
  storyCanvasTransform: CanvasTransform;
  setStoryCanvasTransform: React.Dispatch<React.SetStateAction<CanvasTransform>>;
  routeCanvasTransform: CanvasTransform;
  setRouteCanvasTransform: React.Dispatch<React.SetStateAction<CanvasTransform>>;
  choiceCanvasTransform: CanvasTransform;
  setChoiceCanvasTransform: React.Dispatch<React.SetStateAction<CanvasTransform>>;
  centerOnRouteStartRequest: CenterOnStartRequest | null;
  centerOnChoiceStartRequest: CenterOnStartRequest | null;
  centerOnRouteNodeRequest: CenterOnNodeRequest | null;
  centerOnChoiceNodeRequest: CenterOnNodeRequest | null;
  handleUpdateRouteNodePositions: (updates: { id: string, position: Position }[]) => void;
  handleWarpToLabel: (labelName: string) => void;
  handleCenterOnBlock: (target: string) => void;

  // App / project settings
  appSettings: AppSettings;
  projectSettings: ProjectSettingsState;
  handleChangeStoryCanvasLayoutMode: (mode: StoryCanvasLayoutMode) => void;
  handleChangeStoryCanvasGroupingMode: (mode: StoryCanvasGroupingMode) => void;
  handleChangeRouteCanvasLayoutMode: (mode: StoryCanvasLayoutMode) => void;
  handleChangeRouteCanvasGroupingMode: (mode: StoryCanvasGroupingMode) => void;

  // Block / canvas actions
  handleOpenEditor: (blockId: string, line?: number) => void;
  handleCreateBlockFromCanvas: (type: BlockType, position: Position) => void;
  handleOpenRouteCanvasTab: () => void;
  handleOpenStaticTab: (type: 'canvas' | 'route-canvas' | 'choice-canvas' | 'diagnostics' | 'stats' | 'translations' | 'screen-preview') => void;

  // Assets
  images: Map<string, ProjectImage>;
  imagesArray: ProjectImage[];
  imageMetadata: Map<string, ImageMetadata>;
  audios: Map<string, RenpyAudio>;
  audioMetadata: Map<string, AudioMetadata>;
  handleSaveImageMetadata: (currentFilePath: string, newMeta: ImageMetadata) => Promise<void>;
  handleCopyImageToProject: (sourcePath: string, meta: ImageMetadata) => Promise<void>;
  handleSaveAudioMetadata: (currentFilePath: string, newMeta: AudioMetadata) => Promise<void>;
  handleCopyAudioToProject: (sourcePath: string, meta: AudioMetadata) => Promise<void>;
  existingImageTags: Set<string>;
  existingAudioPaths: Set<string>;

  // Stats / translations / screen preview
  perfSnapshot: PerformanceSnapshot;
  handleGenerateTranslations: (language: string) => Promise<void>;
  isGeneratingTranslations: boolean;
  isRenpyPathValid: boolean;
  editorCursorBlockId: string | null;
  editorCursorPosition: { line: number; column: number } | null;

  // Editor
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  setDirtyEditors: React.Dispatch<React.SetStateAction<Set<string>>>;
  handleSaveBlock: (blockId: string) => Promise<void>;
  syncEditorToStateAndMarkDirty: (blockId: string, content: string) => void;
  setEditorCursorPosition: React.Dispatch<React.SetStateAction<{ line: number; column: number } | null>>;
  setEditorCursorBlockId: React.Dispatch<React.SetStateAction<string | null>>;
  addToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  handleSaveMenuTemplate: (template: MenuTemplate) => void;

  // Characters
  characterTagsArray: string[];
  handleUpdateCharacter: (char: Character, oldTag?: string) => Promise<void>;

  // Scene / imagemap composers
  sceneCompositions: Record<string, SceneComposition>;
  sceneNames: Record<string, string>;
  handleSceneUpdate: (sceneId: string, value: React.SetStateAction<SceneComposition>) => void;
  handleRenameScene: (sceneId: string, newName: string) => void;
  getActiveEditor: () => monaco.editor.IStandaloneCodeEditor | null;
  imagemapCompositions: Record<string, ImageMapComposition>;
  handleImageMapUpdate: (imagemapId: string, value: React.SetStateAction<ImageMapComposition>) => void;
  handleRenameImageMap: (imagemapId: string, newName: string) => void;

  // Markdown
  projectRootPath: string | null;

  // Tab bar
  splitLayout: 'none' | 'right' | 'bottom';
  activePaneId: 'primary' | 'secondary';
  draggedTabId: string | null;
  handleTabDrop: (e: React.DragEvent<HTMLDivElement>, targetTabId: string | null, targetPaneId: 'primary' | 'secondary') => void;
  handleSwitchTab: (tabId: string, paneId?: 'primary' | 'secondary') => void;
  handleTabDragStart: (e: React.DragEvent<HTMLDivElement>, tabId: string, paneId?: 'primary' | 'secondary') => void;
  handleTabDragOver: (e: React.DragEvent<HTMLDivElement>, targetTabId: string) => void;
  handleTabContextMenu: (e: React.MouseEvent, tabId: string, paneId?: 'primary' | 'secondary') => void;
  handleCloseTab: (tabId: string, paneId: 'primary' | 'secondary', e?: React.MouseEvent) => void;
  handleCreateSplit: (direction: 'right' | 'bottom') => void;
  handleClosePrimaryPane: () => void;
  handleCloseSecondaryPane: () => void;
}

export interface UseTabContentRendererReturn {
  getTabLabel: (tab: EditorTab) => React.ReactNode;
  renderTabContent: (tab: EditorTab) => React.ReactNode;
  renderTabBar: (tabs: EditorTab[], activeId: string, paneId: 'primary' | 'secondary', scrollRef: React.RefObject<HTMLDivElement>) => React.ReactNode;
}

export function useTabContentRenderer(params: UseTabContentRendererParams): UseTabContentRendererReturn {
  const {
    editorInstances, blocksRef, pendingTagRenameRef,
    blocks, groups, selectedBlockIds, setSelectedBlockIds, selectedGroupIds, setSelectedGroupIds,
    updateBlock, updateGroup, updateBlockPositions, updateGroupPositions, deleteBlockWithFile,
    dirtyBlockIds, dirtyEditors,
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
    handleOpenEditor, handleCreateBlockFromCanvas, handleOpenRouteCanvasTab, handleOpenStaticTab,
    images, imagesArray, imageMetadata, audios, audioMetadata,
    handleSaveImageMetadata, handleCopyImageToProject, handleSaveAudioMetadata, handleCopyAudioToProject,
    existingImageTags, existingAudioPaths,
    perfSnapshot, handleGenerateTranslations, isGeneratingTranslations, isRenpyPathValid,
    editorCursorBlockId, editorCursorPosition,
    setBlocks, setDirtyEditors, handleSaveBlock, syncEditorToStateAndMarkDirty,
    setEditorCursorPosition, setEditorCursorBlockId, addToast, handleSaveMenuTemplate,
    characterTagsArray, handleUpdateCharacter,
    sceneCompositions, sceneNames, handleSceneUpdate, handleRenameScene, getActiveEditor,
    imagemapCompositions, handleImageMapUpdate, handleRenameImageMap,
    projectRootPath,
    splitLayout, activePaneId, draggedTabId, handleTabDrop, handleSwitchTab, handleTabDragStart,
    handleTabDragOver, handleTabContextMenu, handleCloseTab, handleCreateSplit,
    handleClosePrimaryPane, handleCloseSecondaryPane,
  } = params;

  const getTabLabel = (tab: EditorTab): React.ReactNode => {
    if (tab.id === 'canvas') return 'Project Canvas';
    if (tab.id === 'route-canvas') return 'Flow Canvas';
    if (tab.id === 'choice-canvas') return 'Choices Canvas';
    if (tab.id === 'diagnostics' || tab.id === 'punchlist') return 'Diagnostics';
    if (tab.id === 'stats') return 'Stats';
    if (tab.id === 'translations') return 'Translations';
    if (tab.id === 'screen-preview') return 'Screen Preview';
    if (tab.type === 'scene-composer') return sceneNames[tab.sceneId!] || 'Scene';
    if (tab.type === 'imagemap-composer') return imagemapCompositions[tab.imagemapId!]?.screenName || 'ImageMap';
    if (tab.type === 'character') return `Char: ${tab.characterTag}`;
    if (tab.type === 'editor') return blocks.find(b => b.id === tab.blockId)?.title || 'Untitled';
    if (tab.type === 'markdown') return tab.filePath?.split('/').pop() ?? 'Markdown';
    return tab.filePath?.split('/').pop() ?? 'Untitled';
  };

  const renderTabContent = (tab: EditorTab): React.ReactNode => {
    if (tab.type === 'canvas') {
      return <StoryCanvas
        blocks={blocks} groups={groups} stickyNotes={stickyNotes} analysisResult={analysisResult}
        updateBlock={updateBlock} updateGroup={updateGroup} updateBlockPositions={updateBlockPositions}
        updateGroupPositions={updateGroupPositions} updateStickyNote={updateStickyNote} deleteStickyNote={deleteStickyNote}
        onInteractionEnd={canvasInteractionEnd} deleteBlock={deleteBlockWithFile} onOpenEditor={handleOpenEditor}
        selectedBlockIds={selectedBlockIds} setSelectedBlockIds={setSelectedBlockIds}
        selectedGroupIds={selectedGroupIds} setSelectedGroupIds={setSelectedGroupIds}
        findUsagesHighlightIds={findUsagesHighlightIds} clearFindUsages={handleClearFindUsages}
        canvasFilters={canvasFilters} setCanvasFilters={setCanvasFilters}
        centerOnBlockRequest={centerOnBlockRequest} flashBlockRequest={flashBlockRequest}
        hoverHighlightIds={hoverHighlightIds} transform={storyCanvasTransform} onTransformChange={setStoryCanvasTransform}
        onCreateBlock={handleCreateBlockFromCanvas} onAddStickyNote={addStickyNote} mouseGestures={appSettings.mouseGestures}
        onOpenRouteCanvas={handleOpenRouteCanvasTab}
        layoutMode={projectSettings.storyCanvasLayoutMode ?? 'flow-lr'}
        groupingMode={projectSettings.storyCanvasGroupingMode ?? 'none'}
        onChangeLayoutMode={handleChangeStoryCanvasLayoutMode}
        onChangeGroupingMode={handleChangeStoryCanvasGroupingMode}
        diagnosticsResult={diagnosticsResult}
      />;
    }
    if (tab.type === 'route-canvas') {
      return <RouteCanvas
        labelNodes={routeAnalysisResult.labelNodes} routeLinks={routeAnalysisResult.routeLinks}
        identifiedRoutes={routeAnalysisResult.identifiedRoutes} routesTruncated={routeAnalysisResult.routesTruncated}
        updateLabelNodePositions={handleUpdateRouteNodePositions}
        stickyNotes={routeStickyNotes} onAddStickyNote={addRouteStickyNote}
        updateStickyNote={updateRouteStickyNote} deleteStickyNote={deleteRouteStickyNote}
        onOpenEditor={handleOpenEditor} transform={routeCanvasTransform} onTransformChange={setRouteCanvasTransform}
        mouseGestures={appSettings.mouseGestures}
        layoutMode={projectSettings.routeCanvasLayoutMode ?? 'flow-lr'}
        groupingMode={projectSettings.routeCanvasGroupingMode ?? 'none'}
        onChangeLayoutMode={handleChangeRouteCanvasLayoutMode}
        onChangeGroupingMode={handleChangeRouteCanvasGroupingMode}
        onWarpToLabel={handleWarpToLabel}
        centerOnStartRequest={centerOnRouteStartRequest}
        centerOnNodeRequest={centerOnRouteNodeRequest}
        projectImages={images}
      />;
    }
    if (tab.type === 'choice-canvas') {
      return <ChoiceCanvas
        labelNodes={routeAnalysisResult.labelNodes}
        routeLinks={routeAnalysisResult.routeLinks}
        blocks={blocks}
        analysisResult={analysisResult}
        stickyNotes={choiceStickyNotes} onAddStickyNote={addChoiceStickyNote}
        updateStickyNote={updateChoiceStickyNote} deleteStickyNote={deleteChoiceStickyNote}
        onOpenEditor={handleOpenEditor}
        transform={choiceCanvasTransform}
        onTransformChange={setChoiceCanvasTransform}
        mouseGestures={appSettings.mouseGestures}
        onWarpToLabel={handleWarpToLabel}
        centerOnStartRequest={centerOnChoiceStartRequest}
        centerOnNodeRequest={centerOnChoiceNodeRequest}
      />;
    }
    if (tab.type === 'diagnostics' || tab.type === 'punchlist') {
      return <DiagnosticsPanel
        diagnostics={diagnosticsResult}
        blocks={blocks} stickyNotes={allStickyNotes}
        tasks={diagnosticsTasks}
        ignoredDiagnostics={ignoredDiagnostics}
        onUpdateTasks={(updated) => { setDiagnosticsTasks(updated); setHasUnsavedSettings(true); }}
        onUpdateIgnoredDiagnostics={(updated) => { setIgnoredDiagnostics(updated); setHasUnsavedSettings(true); }}
        onOpenBlock={handleOpenEditor} onHighlightBlock={(id) => handleCenterOnBlock(id)}
      />;
    }
    if (tab.id === 'stats') {
      return <StatsView
        blocks={blocks}
        analysisResult={analysisResult}
        routeAnalysisResult={routeAnalysisResult}
        projectImages={images}
        imageMetadata={imageMetadata}
        projectAudios={audios}
        diagnosticsErrorCount={diagnosticsResult.errorCount}
        onOpenDiagnostics={() => handleOpenStaticTab('diagnostics')}
        performanceMetrics={perfSnapshot}
      />;
    }
    if (tab.id === 'translations') {
      return <TranslationDashboard
        translationData={analysisResult.translationData}
        blocks={blocks}
        onOpenBlock={handleOpenEditor}
        onGenerateTranslations={handleGenerateTranslations}
        isGenerating={isGeneratingTranslations}
        isRenpyPathValid={isRenpyPathValid}
      />;
    }
    if (tab.type === 'screen-preview') {
      return <ScreenPreviewTab
        screens={analysisResult.screens}
        blocks={blocks}
        cursorBlockId={editorCursorBlockId}
        cursorLine={editorCursorPosition?.line ?? null}
        projectImages={images}
      />;
    }
    if (tab.type === 'editor' && tab.blockId) {
      const block = blocks.find(b => b.id === tab.blockId);
      if (block) return <EditorView
        block={block} blocks={blocks} analysisResult={analysisResult} initialScrollRequest={tab.scrollRequest}
        onSwitchFocusBlock={handleOpenEditor} onSave={(id, content) => updateBlock(id, { content })}
        onTriggerSave={handleSaveBlock}
        onDirtyChange={(id, dirty) => { setDirtyEditors(prev => { const next = new Set(prev); if (dirty) { next.add(id); } else { next.delete(id); } return next; }); }}
        onContentChange={(id, content) => { setBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b)); }}
        editorTheme={appSettings.theme.includes('dark') ? 'dark' : 'light'} editorFontFamily={appSettings.editorFontFamily}
        editorFontSize={appSettings.editorFontSize} addToast={addToast}
        onEditorMount={(id, editor) => editorInstances.current.set(id, editor)}
        onEditorUnmount={(id) => { const editor = editorInstances.current.get(id); if (editor) { const block = blocksRef.current.find(b => b.id === id); if (block && editor.getValue() !== block.content) { syncEditorToStateAndMarkDirty(id, editor.getValue()); } } editorInstances.current.delete(id); }}
        onCursorPositionChange={(pos) => { setEditorCursorPosition(pos); if (tab.blockId) setEditorCursorBlockId(tab.blockId); }}
        onWarpToLabel={handleWarpToLabel}
        draftingMode={projectSettings.draftingMode} existingImageTags={existingImageTags} existingAudioPaths={existingAudioPaths}
        userSnippets={appSettings.userSnippets}
        menuTemplates={appSettings.menuTemplates}
        onSaveMenuTemplate={handleSaveMenuTemplate}
      />;
    }
    if (tab.type === 'image' && tab.filePath) {
      const img = images.get(tab.filePath);
      if (img) { const meta = imageMetadata.get(img.projectFilePath || img.filePath); return <ImageEditorView
        image={img} allImages={imagesArray} metadata={meta}
        onSaveMetadata={handleSaveImageMetadata}
        onCopyToProject={handleCopyImageToProject}
      />; }
    }
    if (tab.type === 'audio' && tab.filePath) {
      const aud = audios.get(tab.filePath);
      if (aud) { const meta = audioMetadata.get(aud.projectFilePath || aud.filePath); return <AudioEditorView
        audio={aud} metadata={meta}
        onSaveMetadata={handleSaveAudioMetadata}
        onCopyToProject={handleCopyAudioToProject}
      />; }
    }
    if (tab.type === 'character' && tab.characterTag) {
      // Primary lookup by the tab's characterTag.  During the one-render window between
      // analysis losing the old tag and the deferred useEffect flipping the tab ID, fall
      // back to the pending-rename's new tag so the form never flashes "New Character".
      let char = analysisResultWithProfiles.characters.get(tab.characterTag);
      if (!char) {
        const pending = pendingTagRenameRef.current;
        if (pending?.oldTag === tab.characterTag) {
          char = analysisResultWithProfiles.characters.get(pending.newTag);
        }
      }
      return <CharacterEditorView character={char} onSave={handleUpdateCharacter}
        existingTags={characterTagsArray}
        projectImages={imagesArray} imageMetadata={imageMetadata}
      />;
    }
    if (tab.type === 'scene-composer' && tab.sceneId) {
      const composition = sceneCompositions[tab.sceneId] || { background: null, sprites: [] };
      const name = sceneNames[tab.sceneId] || 'Scene';
      return <SceneComposer
        images={imagesArray} metadata={imageMetadata} scene={composition}
        onSceneChange={(val) => handleSceneUpdate(tab.sceneId!, val)} sceneName={name}
        onRenameScene={(newName) => handleRenameScene(tab.sceneId!, newName)}
        addToast={addToast}
        activeEditor={getActiveEditor()}
      />;
    }
    if (tab.type === 'imagemap-composer' && tab.imagemapId) {
      const composition = imagemapCompositions[tab.imagemapId] || {
        screenName: 'imagemap',
        groundImage: null,
        hoverImage: null,
        hotspots: []
      };
      return <ImageMapComposer
        images={imagesArray}
        imagemap={composition}
        onImageMapChange={(val) => handleImageMapUpdate(tab.imagemapId!, val)}
        imagemapName={composition.screenName}
        onRenameImageMap={(newName) => handleRenameImageMap(tab.imagemapId!, newName)}
        labels={analysisLabelKeys}
        activeEditor={getActiveEditor()}
      />;
    }
    if (tab.type === 'markdown' && tab.filePath) {
      return <MarkdownPreviewView
        filePath={tab.filePath}
        projectRootPath={projectRootPath!}
        editorTheme={appSettings.theme.includes('dark') ? 'dark' : 'light'}
        addToast={addToast}
      />;
    }
    return null;
  };

  const renderTabBar = (tabs: EditorTab[], activeId: string, paneId: 'primary' | 'secondary', scrollRef: React.RefObject<HTMLDivElement>) => (
    <div className={`flex-none flex items-center bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${splitLayout !== 'none' && activePaneId === paneId ? 'border-t-2 border-t-indigo-500' : ''}`}>
      {/* Scrollable tab strip — also a drop target for appending to this pane */}
      <div
        ref={scrollRef}
        className="flex flex-1 overflow-x-auto no-scrollbar min-w-0"
        onDragOver={(e) => { e.preventDefault(); if (draggedTabId) e.dataTransfer.dropEffect = 'move'; }}
        onDrop={(e) => handleTabDrop(e, null, paneId)}
      >
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`flex items-center px-3 py-2 text-sm border-r border-gray-200 dark:border-gray-700 cursor-pointer min-w-[100px] max-w-[200px] flex-none group ${activeId === tab.id ? 'bg-white dark:bg-gray-900 font-semibold' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
            onClick={() => handleSwitchTab(tab.id, paneId)}
            draggable
            onDragStart={(e) => handleTabDragStart(e, tab.id, paneId)}
            onDragOver={(e) => handleTabDragOver(e, tab.id)}
            onDrop={(e) => { e.stopPropagation(); handleTabDrop(e, tab.id, paneId); }}
            onContextMenu={(e) => handleTabContextMenu(e, tab.id, paneId)}
          >
            <span className="truncate flex-grow">{getTabLabel(tab)}</span>
            {(tab.id === 'diagnostics' || tab.id === 'punchlist') && diagnosticsResult.errorCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full min-w-[18px] text-center flex-none">
                {diagnosticsResult.errorCount}
              </span>
            )}
            <button onClick={(e) => handleCloseTab(tab.id, paneId, e)} aria-label="Close tab" className="ml-2 opacity-0 group-hover:opacity-100 hover:text-red-500 rounded-full p-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
            {tab.blockId && (dirtyBlockIds.has(tab.blockId) || dirtyEditors.has(tab.blockId)) && <div className="w-2 h-2 ml-2 bg-blue-500 rounded-full flex-none" />}
          </div>
        ))}
      </div>
      {/* Pinned right actions */}
      <div className="flex items-center flex-none border-l border-gray-200 dark:border-gray-700">
        <button
          onClick={() => scrollRef.current?.scrollBy({ left: -150, behavior: 'smooth' })}
          title="Scroll tabs left"
          className="px-1 py-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button
          onClick={() => scrollRef.current?.scrollBy({ left: 150, behavior: 'smooth' })}
          title="Scroll tabs right"
          className="px-1 py-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {paneId === 'primary' && splitLayout === 'none' && (
          <>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-0.5" />
            <button onClick={() => handleCreateSplit('right')} title="Split Right" className="p-1 rounded text-gray-400 hover:text-indigo-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="6" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="2" width="6" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>
            </button>
            <button onClick={() => handleCreateSplit('bottom')} title="Split Below" className="p-1 rounded text-gray-400 hover:text-indigo-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="12" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="9" width="12" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>
            </button>
          </>
        )}
        {paneId === 'primary' && splitLayout !== 'none' && (
          <>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-0.5" />
            <button onClick={handleClosePrimaryPane} title="Close Pane (moves tabs to other pane)" className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
          </>
        )}
        {paneId === 'secondary' && (
          <>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-0.5" />
            <button onClick={handleCloseSecondaryPane} title="Close Pane (moves tabs to other pane)" className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
          </>
        )}
      </div>
    </div>
  );

  return { getTabLabel, renderTabContent, renderTabBar };
}
