/**
 * @file usePopoutSync.ts
 * @description Relay layer for detachable ("popped-out") editor tabs.
 *
 * The main window stays the sole owner of app state (blocks, analysisResult, etc.) --
 * a popped-out tab window is a thin remote view. `useMainWindowPopoutSync` (run in
 * the main window) serializes just the slice of state a popped-out tab needs into an
 * `EditorPopoutSnapshot` and pushes it over IPC whenever that state changes, and
 * answers RPC calls the popout makes back into the *real* handlers (updateBlock,
 * handleSaveBlock, ...) so there is only ever one writer. `usePopoutTabClient` (run
 * in the popout window) is the other end: it holds the latest snapshot and exposes
 * `callHandler` to invoke a named handler in the main window.
 *
 * Only the `editor` tab type is supported for now -- see the "Detachable Editor
 * Tabs" plan for the staged rollout to the remaining tab types.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { AppSettings, Block, EditorTab, JumpLocation, MenuTemplate, PersistedProjectSettings, RenpyAnalysisResult, Theme, UserSnippet } from '@/types';

export interface EditorPopoutSnapshot {
  tabId: string;
  blockId: string;
  block: Block;
  /** Full app theme, for chrome around the editor (see applyTheme in App.tsx). */
  theme: Theme;
  /** Monaco only understands light/dark -- 'system' and per-theme variants are pre-resolved here. */
  editorTheme: 'light' | 'dark';
  editorFontFamily: string;
  editorFontSize: number;
  draftingMode: boolean;
  existingImageTags: string[];
  existingAudioPaths: string[];
  userSnippets: UserSnippet[];
  menuTemplates: MenuTemplate[];
  jumps: JumpLocation[];
  invalidJumps: string[];
  labelNames: string[];
  variableNames: string[];
}

export interface PopoutHandlers {
  updateBlock: (id: string, data: Partial<Block>) => void;
  handleSaveBlock: (blockId: string) => Promise<void>;
  setBlockContent: (id: string, content: string) => void;
  setEditorDirty: (id: string, dirty: boolean) => void;
  handleWarpToLabel: (labelName: string) => void;
  handleCreateFileFromSelection: (blockId: string, selectedText: string) => void | Promise<void>;
  handleCreateVariableFromSelection: (selectedText: string) => void;
  handleCreateCharacterFromSelection: (selectedText: string) => void;
  handleSaveMenuTemplate: (template: MenuTemplate) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  handleOpenEditor: (blockId: string, line?: number) => void;
}

function buildEditorSnapshot(
  tab: EditorTab,
  blocks: Block[],
  analysisResult: RenpyAnalysisResult,
  appSettings: AppSettings,
  projectSettings: PersistedProjectSettings,
  existingImageTags: Set<string>,
  existingAudioPaths: Set<string>,
): EditorPopoutSnapshot | null {
  if (!tab.blockId) return null;
  const block = blocks.find(b => b.id === tab.blockId);
  if (!block) return null;
  return {
    tabId: tab.id,
    blockId: tab.blockId,
    block,
    theme: appSettings.theme,
    editorTheme: appSettings.theme.includes('dark') ? 'dark' : 'light',
    editorFontFamily: appSettings.editorFontFamily,
    editorFontSize: appSettings.editorFontSize,
    draftingMode: projectSettings.draftingMode,
    existingImageTags: Array.from(existingImageTags),
    existingAudioPaths: Array.from(existingAudioPaths),
    userSnippets: appSettings.userSnippets ?? [],
    menuTemplates: appSettings.menuTemplates ?? [],
    jumps: analysisResult.jumps[tab.blockId] ?? [],
    invalidJumps: analysisResult.invalidJumps[tab.blockId] ?? [],
    labelNames: Object.keys(analysisResult.labels),
    variableNames: Array.from(analysisResult.variables.keys()),
  };
}

export interface UseMainWindowPopoutSyncParams {
  poppedOutTabs: Map<string, EditorTab>;
  blocks: Block[];
  analysisResult: RenpyAnalysisResult;
  appSettings: AppSettings;
  projectSettings: PersistedProjectSettings;
  existingImageTags: Set<string>;
  existingAudioPaths: Set<string>;
  onRedock: (tabId: string) => void;
  handlers: PopoutHandlers;
}

/** Run once in the main window. Owns no state itself -- just relays. */
export function useMainWindowPopoutSync({
  poppedOutTabs, blocks, analysisResult, appSettings, projectSettings,
  existingImageTags, existingAudioPaths, onRedock, handlers,
}: UseMainWindowPopoutSyncParams): void {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  // A brand-new popout window's `onPopoutPropsUpdate` listener (and even the main
  // process's window registry entry) may not be ready yet at the instant this hook's
  // state-push effect below first fires -- window:popout-tab is an async IPC call the
  // caller doesn't await. Keeping the latest inputs in a ref lets the popout pull its
  // own snapshot on mount (see usePopoutTabClient's requestPopoutSnapshot call) without
  // waiting for some *other* state change to trigger the next push.
  const depsRef = useRef({ poppedOutTabs, blocks, analysisResult, appSettings, projectSettings, existingImageTags, existingAudioPaths });
  depsRef.current = { poppedOutTabs, blocks, analysisResult, appSettings, projectSettings, existingImageTags, existingAudioPaths };

  const pushSnapshotForTab = useCallback((tabId: string) => {
    const api = window.electronAPI;
    if (!api?.sendPopoutStateUpdate) return;
    const d = depsRef.current;
    const tab = d.poppedOutTabs.get(tabId);
    if (!tab) return;
    const snapshot = buildEditorSnapshot(tab, d.blocks, d.analysisResult, d.appSettings, d.projectSettings, d.existingImageTags, d.existingAudioPaths);
    if (snapshot) api.sendPopoutStateUpdate(tabId, snapshot);
  }, []);

  useEffect(() => {
    const api = window.electronAPI;
    if (!api?.onPopoutInvokeHandler) return;
    return api.onPopoutInvokeHandler(async ({ requestId, handlerName, args }) => {
      try {
        const fn = handlersRef.current[handlerName as keyof PopoutHandlers] as ((...a: unknown[]) => unknown) | undefined;
        if (!fn) throw new Error(`Unknown popout handler: ${handlerName}`);
        const result = await fn(...args);
        api.replyPopoutHandlerResult?.(requestId, result);
      } catch (err) {
        api.replyPopoutHandlerResult?.(requestId, undefined, err instanceof Error ? err.message : String(err));
      }
    });
  }, []);

  useEffect(() => {
    const api = window.electronAPI;
    if (!api?.onTabRedocked) return;
    return api.onTabRedocked(({ tabId }) => onRedock(tabId));
  }, [onRedock]);

  // A popout pulls its own snapshot right after mounting (it can't rely solely on the
  // push below, which may fire before its listener -- or even the window itself -- exists).
  useEffect(() => {
    const api = window.electronAPI;
    if (!api?.onPopoutSnapshotRequested) return;
    return api.onPopoutSnapshotRequested(({ tabId }) => pushSnapshotForTab(tabId));
  }, [pushSnapshotForTab]);

  useEffect(() => {
    if (poppedOutTabs.size === 0) return;
    for (const tabId of poppedOutTabs.keys()) pushSnapshotForTab(tabId);
  }, [poppedOutTabs, blocks, analysisResult, appSettings, projectSettings, existingImageTags, existingAudioPaths, pushSnapshotForTab]);
}

export interface UsePopoutTabClientReturn {
  snapshot: EditorPopoutSnapshot | null;
  callHandler: <T = unknown>(handlerName: keyof PopoutHandlers, ...args: unknown[]) => Promise<T>;
}

/** Run in the popped-out window's own React tree. */
export function usePopoutTabClient(tabId: string): UsePopoutTabClientReturn {
  const [snapshot, setSnapshot] = useState<EditorPopoutSnapshot | null>(null);

  useEffect(() => {
    const api = window.electronAPI;
    if (!api?.onPopoutPropsUpdate) return;
    const unsubscribe = api.onPopoutPropsUpdate((data) => setSnapshot(data as EditorPopoutSnapshot));
    // Pull an initial snapshot rather than waiting for the main window's next
    // unrelated state change to trigger a push -- see the comment in
    // useMainWindowPopoutSync above.
    api.requestPopoutSnapshot?.(tabId);
    return unsubscribe;
  }, [tabId]);

  const callHandler = useCallback(<T = unknown>(handlerName: keyof PopoutHandlers, ...args: unknown[]): Promise<T> => {
    const api = window.electronAPI;
    if (!api?.callPopoutHandler) return Promise.reject(new Error('electronAPI.callPopoutHandler unavailable'));
    return api.callPopoutHandler(tabId, handlerName, args) as Promise<T>;
  }, [tabId]);

  return { snapshot, callHandler };
}
