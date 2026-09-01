/**
 * @file PopoutTabRoot.tsx
 * @description Root component for a detached ("popped-out") tab window.
 *
 * Mounted instead of <App/> when src/index.tsx sees `?mode=popout` in the URL (see
 * createPopoutWindow() in electron.js). This is intentionally a much smaller React
 * tree than App.tsx: the main window remains the sole owner of app state, and this
 * component is a thin remote view of one tab, fed by usePopoutTabClient's relay
 * (src/hooks/usePopoutSync.ts). See POPOUT_SUPPORTED_TAB_TYPES for which tab types
 * this currently handles.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import EditorView from '@/components/EditorView';
import ImageEditorView from '@/components/ImageEditorView';
import AudioEditorView from '@/components/AudioEditorView';
import MarkdownPreviewView from '@/components/MarkdownPreviewView';
import CharacterEditorView from '@/components/CharacterEditorView';
import DiagnosticsPanel from '@/components/DiagnosticsPanel';
import TranslationDashboard from '@/components/TranslationDashboard';
import StatsView from '@/components/StatsView';
import ScreenPreviewTab from '@/components/ScreenPreviewTab';
import RouteCanvas from '@/components/RouteCanvas';
import ChoiceCanvas from '@/components/ChoiceCanvas';
import NotecardCanvas from '@/components/NotecardCanvas';
import SceneComposer from '@/components/SceneComposer';
import ImageMapComposer from '@/components/ImageMapComposer';
import { applyTheme } from '@/App';
import { usePopoutTabClient, fromLightBlocks } from '@/hooks/usePopoutSync';
import { EMPTY_ANALYSIS_RESULT } from '@/hooks/useRenpyAnalysis';
import type { CanvasTransform } from '@/hooks/useCanvasInteraction';
import type { Block, ImageMapComposition, RenpyAnalysisResult, SceneComposition } from '@/types';

interface PopoutTabRootProps {
  tabId: string;
}

function PopoutChrome({ title, onBeforeRedock, children }: { title: string; onBeforeRedock?: () => Promise<unknown>; children: React.ReactNode }) {
  const handleRedock = async () => {
    // Flush any pending edit before closing -- onContentChange's 800ms debounce (see
    // EditorView's onDidChangeModelContent) may not have fired yet, and a closed window
    // can't fire it later. Without this, typing and immediately hitting Redock silently
    // drops the last few hundred ms of edits.
    await onBeforeRedock?.();
    window.close();
  };
  return (
    <div className="h-screen w-screen flex flex-col bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{title}</span>
        <button
          onClick={handleRedock}
          className="text-xs px-2 py-1 rounded text-gray-600 dark:text-gray-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600"
          title="Move this tab back into the main window"
        >
          Redock
        </button>
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

/** The canvas components (Route/Choice/etc.) render their own floating settings panels,
 *  legend, and minimap positioned relative to the viewport, assuming they own the whole
 *  window -- wrapping them in PopoutChrome's header bar visually collides with those
 *  (confirmed live: the header's Redock button ended up underneath the canvas's own
 *  "Legend" toggle in the same corner). Render the canvas full-bleed instead, with just
 *  a small floating Redock pill at a high z-index in a corner those panels don't use. */
function PopoutCanvasChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen relative bg-white dark:bg-gray-900">
      {children}
      <button
        onClick={() => window.close()}
        className="absolute bottom-3 left-3 z-[9999] text-xs px-2.5 py-1.5 rounded shadow-lg bg-gray-800/90 text-white hover:bg-indigo-600 dark:bg-gray-700/90 dark:hover:bg-indigo-600"
        title="Move this tab back into the main window"
      >
        Redock
      </button>
    </div>
  );
}

const PopoutTabRoot: React.FC<PopoutTabRootProps> = ({ tabId }) => {
  const { snapshot, callHandler } = usePopoutTabClient(tabId);
  const theme = snapshot?.theme;
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  // Pan/zoom is intentionally local to this window, not relayed -- see the comment on
  // RouteCanvasPopoutSnapshot in usePopoutSync.ts for why that's safe.
  const [canvasTransform, setCanvasTransform] = useState<CanvasTransform>({ x: 0, y: 0, scale: 1 });
  // SceneComposer's sprite-drag computes its next position as `s.x + dx` -- a delta
  // relative to the *previous prop value* -- rather than a fixed anchor plus total
  // delta (which is what every other continuous-drag component here uses, and is safe
  // to resolve against a possibly-stale relayed snapshot). Resolving that pattern
  // against the snapshot would silently drop/reset intermediate drag frames under IPC
  // lag, so this window owns a local, optimistic copy instead: seeded once from the
  // first snapshot, then updated synchronously on every onSceneChange call (each RPC
  // send just persists whatever the local resolution already produced).
  const [localScene, setLocalScene] = useState<SceneComposition | null>(null);
  const sceneSeededRef = useRef(false);

  useEffect(() => {
    if (!theme) return;
    const root = window.document.documentElement;
    applyTheme(root, theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme);
  }, [theme]);

  useEffect(() => {
    if (snapshot?.kind === 'scene-composer' && !sceneSeededRef.current) {
      setLocalScene(snapshot.scene);
      sceneSeededRef.current = true;
    }
  }, [snapshot]);

  const editorAnalysisResult: RenpyAnalysisResult | null = useMemo(() => {
    if (!snapshot || (snapshot.kind !== 'editor' && snapshot.kind !== 'untitled')) return null;
    const blockId = snapshot.kind === 'editor' ? snapshot.blockId : snapshot.tabId;
    return {
      ...EMPTY_ANALYSIS_RESULT,
      jumps: { [blockId]: snapshot.kind === 'editor' ? snapshot.jumps : [] },
      invalidJumps: { [blockId]: snapshot.kind === 'editor' ? snapshot.invalidJumps : [] },
      labels: Object.fromEntries(snapshot.labelNames.map(name => [name, { blockId: '', label: name, line: 0, column: 0, type: 'label' as const }])),
      variables: new Map(snapshot.variableNames.map(name => [name, { name, type: 'implicit' as const, initialValue: '', definedInBlockId: '', line: 0 }])),
    };
  }, [snapshot]);

  // CharacterEditorView only reads analysisResult.dialogueLines/.labelNodes (see the
  // Phase 2 research notes) -- everything else stays at EMPTY_ANALYSIS_RESULT's defaults.
  const characterAnalysisResult: RenpyAnalysisResult | null = useMemo(() => {
    if (!snapshot || snapshot.kind !== 'character') return null;
    return { ...EMPTY_ANALYSIS_RESULT, dialogueLines: snapshot.dialogueLines, labelNodes: snapshot.labelNodes };
  }, [snapshot]);

  if (!snapshot) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  if (snapshot.kind === 'editor' && editorAnalysisResult) {
    return (
      <PopoutChrome
        title={snapshot.block.title || 'Untitled'}
        onBeforeRedock={() => {
          const liveContent = editorRef.current?.getValue();
          return liveContent !== undefined ? callHandler('setBlockContent', snapshot.blockId, liveContent) : Promise.resolve();
        }}
      >
        <EditorView
          block={snapshot.block}
          blocks={[snapshot.block]}
          analysisResult={editorAnalysisResult}
          onSwitchFocusBlock={(blockId, line) => {
            void callHandler('handleOpenEditor', blockId, line);
            window.electronAPI?.focusMainWindow?.();
          }}
          onSave={(id, content) => { void callHandler('updateBlock', id, { content }); }}
          onTriggerSave={(id) => {
            // The main window's handleSaveBlock reads its own local Monaco instance for
            // this block when one is open there, but there isn't one for a popped-out
            // tab -- it falls back to blocksRef, which setBlockContent below only updates
            // on an 800ms debounce (see EditorView's onDidChangeModelContent). Flush the
            // live value first so save never races that debounce.
            const liveContent = editorRef.current?.getValue();
            const flush = liveContent !== undefined ? callHandler('setBlockContent', id, liveContent) : Promise.resolve();
            void flush.then(() => callHandler('handleSaveBlock', id));
          }}
          onDirtyChange={(id, dirty) => { void callHandler('setEditorDirty', id, dirty); }}
          onContentChange={(id, content) => { void callHandler('setBlockContent', id, content); }}
          editorTheme={snapshot.editorTheme}
          editorFontFamily={snapshot.editorFontFamily}
          editorFontSize={snapshot.editorFontSize}
          addToast={(message, type) => { void callHandler('addToast', message, type); }}
          onEditorMount={(_id, editor) => { editorRef.current = editor; }}
          onEditorUnmount={() => { editorRef.current = null; }}
          onWarpToLabel={(labelName) => { void callHandler('handleWarpToLabel', labelName); }}
          onCreateFileFromSelection={(blockId, selectedText) => { void callHandler('handleCreateFileFromSelection', blockId, selectedText); }}
          onCreateVariableFromSelection={(selectedText) => { void callHandler('handleCreateVariableFromSelection', selectedText); }}
          onCreateCharacterFromSelection={(selectedText) => { void callHandler('handleCreateCharacterFromSelection', selectedText); }}
          draftingMode={snapshot.draftingMode}
          existingImageTags={new Set(snapshot.existingImageTags)}
          existingAudioPaths={new Set(snapshot.existingAudioPaths)}
          userSnippets={snapshot.userSnippets}
          menuTemplates={snapshot.menuTemplates}
          onSaveMenuTemplate={(template) => { void callHandler('handleSaveMenuTemplate', template); }}
        />
      </PopoutChrome>
    );
  }

  if (snapshot.kind === 'untitled' && editorAnalysisResult) {
    const syntheticBlock: Block = { id: snapshot.tabId, content: snapshot.content, position: { x: 0, y: 0 }, width: 320, height: 200, title: snapshot.title };
    return (
      <PopoutChrome
        title={snapshot.title ?? 'Untitled'}
        onBeforeRedock={() => {
          const liveContent = editorRef.current?.getValue();
          return liveContent !== undefined ? callHandler('updateUntitledContent', snapshot.tabId, liveContent) : Promise.resolve();
        }}
      >
        <EditorView
          block={syntheticBlock}
          blocks={[syntheticBlock]}
          analysisResult={editorAnalysisResult}
          onSwitchFocusBlock={(blockId, line) => {
            void callHandler('handleOpenEditor', blockId, line);
            window.electronAPI?.focusMainWindow?.();
          }}
          onSave={(id, content) => { void callHandler('updateUntitledContent', id, content); }}
          onTriggerSave={(id) => {
            const liveContent = editorRef.current?.getValue();
            void callHandler('saveUntitledFile', id, liveContent);
          }}
          onDirtyChange={(id, dirty) => { void callHandler('setUntitledDirty', id, dirty); }}
          onContentChange={(id, content) => { void callHandler('updateUntitledContent', id, content); }}
          editorTheme={snapshot.editorTheme}
          editorFontFamily={snapshot.editorFontFamily}
          editorFontSize={snapshot.editorFontSize}
          addToast={(message, type) => { void callHandler('addToast', message, type); }}
          onEditorMount={(_id, editor) => { editorRef.current = editor; }}
          onEditorUnmount={() => { editorRef.current = null; }}
          onWarpToLabel={(labelName) => { void callHandler('handleWarpToLabel', labelName); }}
          onCreateFileFromSelection={(blockId, selectedText) => { void callHandler('handleCreateFileFromSelection', blockId, selectedText); }}
          onCreateVariableFromSelection={(selectedText) => { void callHandler('handleCreateVariableFromSelection', selectedText); }}
          onCreateCharacterFromSelection={(selectedText) => { void callHandler('handleCreateCharacterFromSelection', selectedText); }}
          draftingMode={snapshot.draftingMode}
          existingImageTags={new Set(snapshot.existingImageTags)}
          existingAudioPaths={new Set(snapshot.existingAudioPaths)}
          userSnippets={snapshot.userSnippets}
          menuTemplates={snapshot.menuTemplates}
          onSaveMenuTemplate={(template) => { void callHandler('handleSaveMenuTemplate', template); }}
        />
      </PopoutChrome>
    );
  }

  if (snapshot.kind === 'markdown') {
    return (
      <PopoutChrome title={snapshot.filePath.split('/').pop() ?? 'Markdown'}>
        <MarkdownPreviewView
          filePath={snapshot.filePath}
          projectRootPath={snapshot.projectRootPath}
          editorTheme={snapshot.editorTheme}
          addToast={(message, type) => { void callHandler('addToast', message, type); }}
        />
      </PopoutChrome>
    );
  }

  if (snapshot.kind === 'image') {
    return (
      <PopoutChrome title={snapshot.image.fileName}>
        <ImageEditorView
          image={snapshot.image}
          allImages={snapshot.allImages}
          metadata={snapshot.metadata}
          onSaveMetadata={(currentFilePath, newMeta) => callHandler<void>('handleSaveImageMetadata', currentFilePath, newMeta)}
          onCopyToProject={(sourcePath, meta) => { void callHandler('handleCopyImageToProject', sourcePath, meta); }}
        />
      </PopoutChrome>
    );
  }

  if (snapshot.kind === 'audio') {
    return (
      <PopoutChrome title={snapshot.audio.fileName}>
        <AudioEditorView
          audio={snapshot.audio}
          metadata={snapshot.metadata}
          onSaveMetadata={(currentFilePath, newMeta) => callHandler<void>('handleSaveAudioMetadata', currentFilePath, newMeta)}
          onCopyToProject={(sourcePath, meta) => { void callHandler('handleCopyAudioToProject', sourcePath, meta); }}
        />
      </PopoutChrome>
    );
  }

  if (snapshot.kind === 'character' && characterAnalysisResult) {
    return (
      <PopoutChrome title={snapshot.character?.name ? `Char: ${snapshot.character.name}` : `Char: ${snapshot.characterTag}`}>
        <CharacterEditorView
          character={snapshot.character}
          onSave={(char, oldTag) => { void callHandler('handleUpdateCharacter', char, oldTag); }}
          existingTags={snapshot.existingTags}
          projectImages={snapshot.projectImages}
          imageMetadata={snapshot.imageMetadata}
          initialTag={snapshot.character ? undefined : snapshot.initialTag}
          initialName={snapshot.character ? undefined : snapshot.initialName}
          analysisResult={characterAnalysisResult}
          blocks={fromLightBlocks(snapshot.blocks)}
          onOpenEditor={(blockId, line) => {
            void callHandler('handleOpenEditor', blockId, line);
            window.electronAPI?.focusMainWindow?.();
          }}
        />
      </PopoutChrome>
    );
  }

  if (snapshot.kind === 'diagnostics') {
    return (
      <PopoutChrome title="Diagnostics">
        <DiagnosticsPanel
          diagnostics={snapshot.diagnostics}
          blocks={fromLightBlocks(snapshot.blocks)}
          stickyNotes={snapshot.stickyNotes}
          tasks={snapshot.tasks}
          ignoredDiagnostics={snapshot.ignoredDiagnostics}
          onUpdateTasks={(updated) => { void callHandler('handleUpdateDiagnosticsTasks', updated); }}
          onUpdateIgnoredDiagnostics={(updated) => { void callHandler('handleUpdateIgnoredDiagnostics', updated); }}
          onOpenBlock={(blockId, line) => {
            void callHandler('handleOpenEditor', blockId, line);
            window.electronAPI?.focusMainWindow?.();
          }}
          onHighlightBlock={(id) => {
            // Centers/reveals the block on the Project Canvas -- only meaningful in the
            // main window, which has the canvas.
            void callHandler('handleCenterOnBlock', id);
            window.electronAPI?.focusMainWindow?.();
          }}
        />
      </PopoutChrome>
    );
  }

  if (snapshot.kind === 'translations') {
    return (
      <PopoutChrome title="Translations">
        <TranslationDashboard
          translationData={snapshot.translationData}
          blocks={fromLightBlocks(snapshot.blocks)}
          onOpenBlock={(blockId, line) => {
            void callHandler('handleOpenEditor', blockId, line);
            window.electronAPI?.focusMainWindow?.();
          }}
          onGenerateTranslations={(language) => callHandler<void>('handleGenerateTranslations', language)}
          isGenerating={snapshot.isGenerating}
          isRenpyPathValid={snapshot.isRenpyPathValid}
          addToast={(message, type) => { void callHandler('addToast', message, type); }}
        />
      </PopoutChrome>
    );
  }

  if (snapshot.kind === 'stats') {
    return (
      <PopoutChrome title="Stats">
        <StatsView
          blocks={snapshot.blocks}
          analysisResult={snapshot.analysisResult}
          routeAnalysisResult={snapshot.routeAnalysisResult}
          projectImages={snapshot.images}
          imageMetadata={snapshot.imageMetadata}
          projectAudios={snapshot.audios}
          diagnosticsErrorCount={snapshot.diagnosticsErrorCount}
          onOpenDiagnostics={() => {
            void callHandler('handleOpenStaticTab', 'diagnostics');
            window.electronAPI?.focusMainWindow?.();
          }}
          onOpenEditor={(blockId, line) => {
            void callHandler('handleOpenEditor', blockId, line);
            window.electronAPI?.focusMainWindow?.();
          }}
          performanceMetrics={snapshot.performanceMetrics}
        />
      </PopoutChrome>
    );
  }

  if (snapshot.kind === 'screen-preview') {
    return (
      <PopoutChrome title="Screen Preview">
        <ScreenPreviewTab
          screens={snapshot.screens}
          blocks={snapshot.blocks}
          cursorBlockId={snapshot.cursorBlockId}
          cursorLine={snapshot.cursorLine}
          projectImages={snapshot.images}
        />
      </PopoutChrome>
    );
  }

  if (snapshot.kind === 'route-canvas') {
    return (
      <PopoutCanvasChrome>
        <RouteCanvas
          labelNodes={snapshot.labelNodes}
          routeLinks={snapshot.routeLinks}
          identifiedRoutes={snapshot.identifiedRoutes}
          routesTruncated={snapshot.routesTruncated}
          stickyNotes={snapshot.stickyNotes}
          projectImages={snapshot.images}
          updateLabelNodePositions={(updates) => { void callHandler('handleUpdateRouteNodePositions', updates); }}
          onAddStickyNote={(position) => { void callHandler('addRouteStickyNote', position); }}
          updateStickyNote={(id, data) => { void callHandler('updateRouteStickyNote', id, data); }}
          deleteStickyNote={(id) => { void callHandler('deleteRouteStickyNote', id); }}
          onOpenEditor={(blockId, line) => {
            void callHandler('handleOpenEditor', blockId, line);
            window.electronAPI?.focusMainWindow?.();
          }}
          transform={canvasTransform}
          onTransformChange={setCanvasTransform}
          mouseGestures={snapshot.mouseGestures}
          layoutMode={snapshot.layoutMode}
          groupingMode={snapshot.groupingMode}
          onChangeLayoutMode={(mode) => { void callHandler('handleChangeRouteCanvasLayoutMode', mode); }}
          onChangeGroupingMode={(mode) => { void callHandler('handleChangeRouteCanvasGroupingMode', mode); }}
          onWarpToLabel={(labelName) => { void callHandler('handleWarpToLabel', labelName); }}
        />
      </PopoutCanvasChrome>
    );
  }

  if (snapshot.kind === 'choice-canvas') {
    return (
      <PopoutCanvasChrome>
        <ChoiceCanvas
          labelNodes={snapshot.labelNodes}
          routeLinks={snapshot.routeLinks}
          blocks={snapshot.blocks}
          analysisResult={snapshot.analysisResult}
          stickyNotes={snapshot.stickyNotes}
          onAddStickyNote={(position) => { void callHandler('addChoiceStickyNote', position); }}
          updateStickyNote={(id, data) => { void callHandler('updateChoiceStickyNote', id, data); }}
          deleteStickyNote={(id) => { void callHandler('deleteChoiceStickyNote', id); }}
          onOpenEditor={(blockId, line) => {
            void callHandler('handleOpenEditor', blockId, line);
            window.electronAPI?.focusMainWindow?.();
          }}
          transform={canvasTransform}
          onTransformChange={setCanvasTransform}
          mouseGestures={snapshot.mouseGestures}
          onWarpToLabel={(labelName) => { void callHandler('handleWarpToLabel', labelName); }}
        />
      </PopoutCanvasChrome>
    );
  }

  if (snapshot.kind === 'notecard-canvas') {
    return (
      <PopoutCanvasChrome>
        <NotecardCanvas
          notecards={snapshot.notecards}
          notecardLinks={snapshot.notecardLinks}
          updateNotecard={(id, data) => { void callHandler('updateNotecard', id, data); }}
          deleteNotecard={(id) => { void callHandler('deleteNotecard', id); }}
          deleteNotecards={(ids) => { void callHandler('deleteNotecards', ids); }}
          restoreNotecards={(cards, links) => { void callHandler('restoreNotecards', cards, links); }}
          addNotecard={(position) => { void callHandler('addNotecard', position); }}
          addNotecardLink={(fromId, toId) => { void callHandler('addNotecardLink', fromId, toId); }}
          updateNotecardLink={(id, data) => { void callHandler('updateNotecardLink', id, data); }}
          deleteNotecardLink={(id) => { void callHandler('deleteNotecardLink', id); }}
          timelineSettings={snapshot.timelineSettings}
          renameTimelineSlot={(slot, label) => { void callHandler('renameNotecardTimelineSlot', slot, label); }}
          moveNotecardWithinTimeline={(id, toSlot, toIndex) => { void callHandler('moveNotecardWithinTimeline', id, toSlot, toIndex); }}
          unassignNotecardFromTimeline={(id, position) => { void callHandler('unassignNotecardFromTimeline', id, position); }}
          insertTimelineSlot={(beforeSlot) => { void callHandler('insertTimelineSlot', beforeSlot); }}
          deleteTimelineSlot={(slot) => { void callHandler('deleteTimelineSlot', slot); }}
          transform={canvasTransform}
          onTransformChange={setCanvasTransform}
        />
      </PopoutCanvasChrome>
    );
  }

  if (snapshot.kind === 'scene-composer') {
    const scene = localScene ?? snapshot.scene;
    return (
      <PopoutChrome title={snapshot.sceneName}>
        <SceneComposer
          images={snapshot.images}
          metadata={snapshot.imageMetadata}
          scene={scene}
          onSceneChange={(value) => {
            setLocalScene(prev => {
              const base = prev ?? scene;
              const next = typeof value === 'function' ? (value as (p: SceneComposition) => SceneComposition)(base) : value;
              void callHandler('handleSceneUpdate', snapshot.sceneId, next);
              return next;
            });
          }}
          sceneName={snapshot.sceneName}
          onRenameScene={(newName) => { void callHandler('handleRenameScene', snapshot.sceneId, newName); }}
          addToast={(message, type) => { void callHandler('addToast', message, type); }}
          activeEditor={null}
        />
      </PopoutChrome>
    );
  }

  if (snapshot.kind === 'imagemap-composer') {
    return (
      <PopoutChrome title={snapshot.imagemap.screenName}>
        <ImageMapComposer
          images={snapshot.images}
          imagemap={snapshot.imagemap}
          onImageMapChange={(value) => {
            const base = snapshot.imagemap;
            const next = typeof value === 'function' ? (value as (p: ImageMapComposition) => ImageMapComposition)(base) : value;
            void callHandler('handleImageMapUpdate', snapshot.imagemapId, next);
          }}
          imagemapName={snapshot.imagemap.screenName}
          onRenameImageMap={(newName) => { void callHandler('handleRenameImageMap', snapshot.imagemapId, newName); }}
          labels={snapshot.labels}
          activeEditor={null}
        />
      </PopoutChrome>
    );
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
      This tab type can&apos;t be shown in a detached window.
    </div>
  );
};

export default PopoutTabRoot;
