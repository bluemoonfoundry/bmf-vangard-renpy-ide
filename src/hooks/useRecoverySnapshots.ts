/**
 * @file useRecoverySnapshots.ts
 * @description Periodically snapshots unsaved work to the main process for crash
 * recovery (bmf-vangard-renpy-ide-b70a.2.3). Snapshots only what is unsaved, 5 s
 * after the last change (60 s cap during continuous edits), never overlaps writes,
 * and deletes its session's snapshot once nothing is unsaved. Failures are logged
 * once per session and never surface as toasts -- autosave must not interrupt typing.
 */
import { useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';
import type { Block, ProjectSettings, RecoverySnapshotPayload } from '@/types';
import type { UntitledFileState } from '@/hooks/useUntitledFiles';

export interface UseRecoverySnapshotsParams {
  enabled: boolean;
  sessionIdRef: React.MutableRefObject<string | null>;
  /** Change signal: editor keystrokes reach blocks via onContentChange. */
  blocks: Block[];
  blocksRef: React.MutableRefObject<Block[]>;
  editorInstances: React.MutableRefObject<Map<string, { getValue(): string }>>;
  dirtyBlockIds: Set<string>;
  dirtyEditors: Set<string>;
  untitledFiles: Map<string, UntitledFileState>;
  hasUnsavedSettings: boolean;
  /** Memoised; its identity changes whenever workspace state changes. */
  buildSettingsPayload: () => ProjectSettings;
  debounceMs?: number;
  maxIntervalMs?: number;
  /** Called after each snapshot that actually reached disk (not on failure or a size skip). */
  onSnapshotWritten?: () => void;
}

type PayloadState = Pick<UseRecoverySnapshotsParams,
  'blocksRef' | 'editorInstances' | 'dirtyBlockIds' | 'dirtyEditors' | 'untitledFiles' | 'hasUnsavedSettings' | 'buildSettingsPayload'>;

export function buildRecoveryPayload(state: PayloadState): RecoverySnapshotPayload {
  const ids = new Set([...state.dirtyBlockIds, ...state.dirtyEditors]);
  const files: RecoverySnapshotPayload['files'] = [];
  for (const id of ids) {
    const block = state.blocksRef.current.find(b => b.id === id);
    if (!block?.filePath) continue;
    const live = state.editorInstances.current.get(id)?.getValue();
    files.push({ relativePath: block.filePath, content: live ?? block.content });
  }
  const untitled = [...state.untitledFiles.entries()]
    .filter(([, f]) => f.isDirty)
    .map(([id, f]) => ({ id, title: f.title, content: f.content }));
  return { files, untitled, settings: state.hasUnsavedSettings ? state.buildSettingsPayload() : null };
}

const hasUnsaved = (s: PayloadState) =>
  s.dirtyBlockIds.size > 0 || s.dirtyEditors.size > 0 || s.hasUnsavedSettings
  || [...s.untitledFiles.values()].some(f => f.isDirty);

export function useRecoverySnapshots(params: UseRecoverySnapshotsParams): void {
  const { enabled, blocks, dirtyBlockIds, dirtyEditors, untitledFiles, hasUnsavedSettings, buildSettingsPayload } = params;
  const debounceMs = params.debounceMs ?? 5000;
  const maxIntervalMs = params.maxIntervalMs ?? 60000;

  const latest = useRef(params);
  latest.current = params;

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef(false);
  const rerunAfterFlight = useRef(false);
  const session = useRef<{ id: string | null; wrote: boolean; warned: boolean }>({ id: null, wrote: false, warned: false });

  const clearTimers = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (maxTimer.current) clearTimeout(maxTimer.current);
    debounceTimer.current = null;
    maxTimer.current = null;
  };

  const syncSession = () => {
    const id = latest.current.sessionIdRef.current;
    if (session.current.id !== id) session.current = { id, wrote: false, warned: false };
    return id;
  };

  const clearIfIdle = async () => {
    const id = syncSession();
    if (!id || !session.current.wrote || hasUnsaved(latest.current)) return;
    session.current.wrote = false;
    try {
      await window.electronAPI?.recovery.clear(id);
    } catch (err) {
      logger.warn('Failed to clear recovery snapshot', err);
    }
  };

  const snapshotRef = useRef<() => Promise<void>>(async () => {});
  snapshotRef.current = async () => {
    clearTimers();
    const id = syncSession();
    if (!id || !latest.current.enabled || !window.electronAPI) return;
    if (inFlight.current) { rerunAfterFlight.current = true; return; }
    if (!hasUnsaved(latest.current)) return;

    inFlight.current = true;
    try {
      const result = await window.electronAPI.recovery.write(id, buildRecoveryPayload(latest.current));
      if (!result.success) throw new Error(result.error ?? 'Unknown error');
      if (!result.skipped && session.current.id === id) {
        session.current.wrote = true;
        latest.current.onSnapshotWritten?.();
      }
    } catch (err) {
      if (!session.current.warned) {
        session.current.warned = true;
        logger.warn('Recovery snapshot failed (further failures this session are not logged)', err);
      }
    } finally {
      inFlight.current = false;
    }
    await clearIfIdle(); // the user may have saved while the write was in flight
    if (rerunAfterFlight.current) {
      rerunAfterFlight.current = false;
      debounceTimer.current = setTimeout(() => { void snapshotRef.current(); }, debounceMs);
    }
  };

  useEffect(() => {
    syncSession();
    if (!enabled) { clearTimers(); return; }
    if (!hasUnsaved(latest.current)) {
      clearTimers();
      void clearIfIdle();
      return;
    }
    if (inFlight.current) { rerunAfterFlight.current = true; return; }
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => { void snapshotRef.current(); }, debounceMs);
    if (!maxTimer.current) {
      maxTimer.current = setTimeout(() => { void snapshotRef.current(); }, maxIntervalMs);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- change signals; everything else is read via `latest`
  }, [enabled, blocks, dirtyBlockIds, dirtyEditors, untitledFiles, hasUnsavedSettings, buildSettingsPayload, debounceMs, maxIntervalMs]);

  useEffect(() => clearTimers, []);
}
