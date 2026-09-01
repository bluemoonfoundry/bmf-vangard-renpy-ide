/**
 * @file usePopoutSync.ts
 * @description Relay layer for detachable ("popped-out") tabs.
 *
 * The main window stays the sole owner of app state (blocks, analysisResult, etc.) --
 * a popped-out tab window is a thin remote view. `useMainWindowPopoutSync` (run in
 * the main window) serializes just the slice of state a popped-out tab needs into a
 * `PopoutSnapshot` and pushes it over IPC whenever that state changes, and answers
 * RPC calls the popout makes back into the *real* handlers (updateBlock,
 * handleSaveBlock, ...) so there is only ever one writer. `usePopoutTabClient` (run
 * in the popout window) is the other end: it holds the latest snapshot and exposes
 * `callHandler` to invoke a named handler in the main window.
 *
 * Supported tab types: `editor`, `untitled`, `markdown`, `image`, `audio`. The
 * remaining types (the infinite canvases, scene/imagemap composers, and the
 * project-wide dashboards) are deliberately not included yet -- see the "Detachable
 * Editor Tabs" plan's Phase 2 notes for why each was deferred.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  AppSettings, AudioMetadata, Block, EditorTab, ImageMetadata, JumpLocation,
  MenuTemplate, PersistedProjectSettings, ProjectImage, RenpyAnalysisResult,
  RenpyAudio, Theme, UserSnippet,
} from '@/types';
import type { UntitledFileState } from '@/hooks/useUntitledFiles';

/** Tab types that can currently be popped out into their own window. */
export const POPOUT_SUPPORTED_TAB_TYPES: ReadonlySet<string> = new Set<EditorTab['type']>([
  'editor', 'untitled', 'markdown', 'image', 'audio',
]);

interface BaseSnapshot {
  tabId: string;
  /** Full app theme, for chrome around the leaf view (see applyTheme in App.tsx). */
  theme: Theme;
}

export interface EditorPopoutSnapshot extends BaseSnapshot {
  kind: 'editor';
  blockId: string;
  block: Block;
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

export interface UntitledPopoutSnapshot extends BaseSnapshot {
  kind: 'untitled';
  content: string;
  title?: string;
  editorTheme: 'light' | 'dark';
  editorFontFamily: string;
  editorFontSize: number;
  draftingMode: boolean;
  existingImageTags: string[];
  existingAudioPaths: string[];
  userSnippets: UserSnippet[];
  menuTemplates: MenuTemplate[];
  labelNames: string[];
  variableNames: string[];
}

export interface MarkdownPopoutSnapshot extends BaseSnapshot {
  kind: 'markdown';
  filePath: string;
  projectRootPath: string;
  editorTheme: 'light' | 'dark';
}

export interface ImagePopoutSnapshot extends BaseSnapshot {
  kind: 'image';
  image: ProjectImage;
  allImages: ProjectImage[];
  metadata?: ImageMetadata;
}

export interface AudioPopoutSnapshot extends BaseSnapshot {
  kind: 'audio';
  audio: RenpyAudio;
  metadata?: AudioMetadata;
}

export type PopoutSnapshot =
  | EditorPopoutSnapshot
  | UntitledPopoutSnapshot
  | MarkdownPopoutSnapshot
  | ImagePopoutSnapshot
  | AudioPopoutSnapshot;

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
  updateUntitledContent: (tabId: string, content: string) => void;
  setUntitledDirty: (tabId: string, isDirty: boolean) => void;
  saveUntitledFile: (tabId: string, liveContent?: string) => Promise<boolean>;
  handleSaveImageMetadata: (currentFilePath: string, newMeta: ImageMetadata) => Promise<void>;
  handleCopyImageToProject: (sourcePath: string, meta: ImageMetadata) => void | Promise<void>;
  handleSaveAudioMetadata: (currentFilePath: string, newMeta: AudioMetadata) => Promise<void>;
  handleCopyAudioToProject: (sourcePath: string, meta: AudioMetadata) => void | Promise<void>;
}

export interface PopoutSnapshotDeps {
  blocks: Block[];
  analysisResult: RenpyAnalysisResult;
  appSettings: AppSettings;
  projectSettings: PersistedProjectSettings;
  existingImageTags: Set<string>;
  existingAudioPaths: Set<string>;
  images: Map<string, ProjectImage>;
  imageMetadata: Map<string, ImageMetadata>;
  audios: Map<string, RenpyAudio>;
  audioMetadata: Map<string, AudioMetadata>;
  untitledFiles: Map<string, UntitledFileState>;
  projectRootPath: string | null;
}

function buildPopoutSnapshot(tab: EditorTab, deps: PopoutSnapshotDeps): PopoutSnapshot | null {
  const { blocks, analysisResult, appSettings, projectSettings, existingImageTags, existingAudioPaths, images, imageMetadata, audios, audioMetadata, untitledFiles, projectRootPath } = deps;
  const editorTheme: 'light' | 'dark' = appSettings.theme.includes('dark') ? 'dark' : 'light';

  if (tab.type === 'editor' && tab.blockId) {
    const block = blocks.find(b => b.id === tab.blockId);
    if (!block) return null;
    return {
      kind: 'editor', tabId: tab.id, theme: appSettings.theme,
      blockId: tab.blockId, block, editorTheme,
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

  if (tab.type === 'untitled') {
    const draft = untitledFiles.get(tab.id);
    if (!draft) return null;
    return {
      kind: 'untitled', tabId: tab.id, theme: appSettings.theme,
      content: draft.content, title: draft.title, editorTheme,
      editorFontFamily: appSettings.editorFontFamily,
      editorFontSize: appSettings.editorFontSize,
      draftingMode: projectSettings.draftingMode,
      existingImageTags: Array.from(existingImageTags),
      existingAudioPaths: Array.from(existingAudioPaths),
      userSnippets: appSettings.userSnippets ?? [],
      menuTemplates: appSettings.menuTemplates ?? [],
      labelNames: Object.keys(analysisResult.labels),
      variableNames: Array.from(analysisResult.variables.keys()),
    };
  }

  if (tab.type === 'markdown' && tab.filePath && projectRootPath) {
    return { kind: 'markdown', tabId: tab.id, theme: appSettings.theme, filePath: tab.filePath, projectRootPath, editorTheme };
  }

  if (tab.type === 'image' && tab.filePath) {
    const image = images.get(tab.filePath);
    if (!image) return null;
    return {
      kind: 'image', tabId: tab.id, theme: appSettings.theme,
      image, allImages: Array.from(images.values()),
      metadata: imageMetadata.get(image.projectFilePath || image.filePath),
    };
  }

  if (tab.type === 'audio' && tab.filePath) {
    const audio = audios.get(tab.filePath);
    if (!audio) return null;
    return {
      kind: 'audio', tabId: tab.id, theme: appSettings.theme,
      audio, metadata: audioMetadata.get(audio.projectFilePath || audio.filePath),
    };
  }

  return null;
}

export interface UseMainWindowPopoutSyncParams extends PopoutSnapshotDeps {
  poppedOutTabs: Map<string, EditorTab>;
  onRedock: (tabId: string) => void;
  handlers: PopoutHandlers;
}

/** Run once in the main window. Owns no state itself -- just relays. */
export function useMainWindowPopoutSync({
  poppedOutTabs, onRedock, handlers, ...deps
}: UseMainWindowPopoutSyncParams): void {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  // A brand-new popout window's `onPopoutPropsUpdate` listener (and even the main
  // process's window registry entry) may not be ready yet at the instant this hook's
  // state-push effect below first fires -- window:popout-tab is an async IPC call the
  // caller doesn't await. Keeping the latest inputs in a ref lets the popout pull its
  // own snapshot on mount (see usePopoutTabClient's requestPopoutSnapshot call) without
  // waiting for some *other* state change to trigger the next push.
  const depsRef = useRef({ poppedOutTabs, ...deps });
  depsRef.current = { poppedOutTabs, ...deps };

  const pushSnapshotForTab = useCallback((tabId: string) => {
    const api = window.electronAPI;
    if (!api?.sendPopoutStateUpdate) return;
    const d = depsRef.current;
    const tab = d.poppedOutTabs.get(tabId);
    if (!tab) return;
    const snapshot = buildPopoutSnapshot(tab, d);
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
    // deps are spread from `deps` -- list each field so the effect re-fires on the
    // slice of state it actually reads, same as before this was generalized.
  }, [poppedOutTabs, deps.blocks, deps.analysisResult, deps.appSettings, deps.projectSettings, deps.existingImageTags, deps.existingAudioPaths, deps.images, deps.imageMetadata, deps.audios, deps.audioMetadata, deps.untitledFiles, deps.projectRootPath, pushSnapshotForTab]);
}

export interface UsePopoutTabClientReturn {
  snapshot: PopoutSnapshot | null;
  callHandler: <T = unknown>(handlerName: keyof PopoutHandlers, ...args: unknown[]) => Promise<T>;
}

/** Run in the popped-out window's own React tree. */
export function usePopoutTabClient(tabId: string): UsePopoutTabClientReturn {
  const [snapshot, setSnapshot] = useState<PopoutSnapshot | null>(null);

  useEffect(() => {
    const api = window.electronAPI;
    if (!api?.onPopoutPropsUpdate) return;
    const unsubscribe = api.onPopoutPropsUpdate((data) => setSnapshot(data as PopoutSnapshot));
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
