/**
 * @file PopoutTabRoot.tsx
 * @description Root component for a detached ("popped-out") editor tab window.
 *
 * Mounted instead of <App/> when src/index.tsx sees `?mode=popout` in the URL (see
 * createPopoutWindow() in electron.js). This is intentionally a much smaller React
 * tree than App.tsx: the main window remains the sole owner of app state, and this
 * component is a thin remote view of one tab, fed by usePopoutTabClient's relay
 * (src/hooks/usePopoutSync.ts). Only the 'editor' tab type is supported for now.
 */
import React, { useEffect, useMemo, useRef } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import EditorView from '@/components/EditorView';
import { applyTheme } from '@/App';
import { usePopoutTabClient } from '@/hooks/usePopoutSync';
import { EMPTY_ANALYSIS_RESULT } from '@/hooks/useRenpyAnalysis';
import type { RenpyAnalysisResult } from '@/types';

interface PopoutTabRootProps {
  tabId: string;
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

  const analysisResult: RenpyAnalysisResult | null = useMemo(() => {
    if (!snapshot) return null;
    return {
      ...EMPTY_ANALYSIS_RESULT,
      jumps: { [snapshot.blockId]: snapshot.jumps },
      invalidJumps: { [snapshot.blockId]: snapshot.invalidJumps },
      labels: Object.fromEntries(snapshot.labelNames.map(name => [name, { blockId: '', label: name, line: 0, column: 0, type: 'label' as const }])),
      variables: new Map(snapshot.variableNames.map(name => [name, { name, type: 'implicit' as const, initialValue: '', definedInBlockId: '', line: 0 }])),
    };
  }, [snapshot]);

  const handleRedock = () => {
    window.close();
  };

  if (!snapshot || !analysisResult) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
          {snapshot.block.title || 'Untitled'}
        </span>
        <button
          onClick={handleRedock}
          className="text-xs px-2 py-1 rounded text-gray-600 dark:text-gray-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600"
          title="Move this tab back into the main window"
        >
          Redock
        </button>
      </div>
      <div className="flex-1 min-h-0">
        <EditorView
          block={snapshot.block}
          blocks={[snapshot.block]}
          analysisResult={analysisResult}
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
      </div>
    </div>
  );
};

export default PopoutTabRoot;
