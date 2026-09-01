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
import React, { useEffect, useMemo, useRef } from 'react';
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
import { applyTheme } from '@/App';
import { usePopoutTabClient, fromLightBlocks } from '@/hooks/usePopoutSync';
import { EMPTY_ANALYSIS_RESULT } from '@/hooks/useRenpyAnalysis';
import type { Block, RenpyAnalysisResult } from '@/types';

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

const PopoutTabRoot: React.FC<PopoutTabRootProps> = ({ tabId }) => {
  const { snapshot, callHandler } = usePopoutTabClient(tabId);
  const theme = snapshot?.theme;
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!theme) return;
    const root = window.document.documentElement;
    applyTheme(root, theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme);
  }, [theme]);

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

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
      This tab type can&apos;t be shown in a detached window.
    </div>
  );
};

export default PopoutTabRoot;
