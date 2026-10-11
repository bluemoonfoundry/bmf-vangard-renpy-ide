import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecoverySnapshots, buildRecoveryPayload } from '@/hooks/useRecoverySnapshots';
import type { UseRecoverySnapshotsParams } from '@/hooks/useRecoverySnapshots';
import { installElectronAPI, createMockElectronAPI } from '@/test/mocks/electronAPI';
import { createBlock } from '@/test/mocks/sampleData';
import { logger } from '@/lib/logger';

const SESSION = '11111111-1111-4111-8111-111111111111';

function makeParams(over: Partial<UseRecoverySnapshotsParams> = {}): UseRecoverySnapshotsParams {
  const block = createBlock({ id: 'b1', filePath: 'game/script.rpy', content: 'block content' });
  return {
    enabled: true,
    sessionIdRef: { current: SESSION },
    blocks: [block],
    blocksRef: { current: [block] },
    editorInstances: { current: new Map() },
    dirtyBlockIds: new Set(['b1']),
    dirtyEditors: new Set(),
    untitledFiles: new Map(),
    hasUnsavedSettings: false,
    buildSettingsPayload: () => ({ draftingMode: false, openTabs: [], activeTabId: 'canvas' }),
    ...over,
  };
}

let api: ReturnType<typeof createMockElectronAPI>;

beforeEach(() => {
  vi.useFakeTimers();
  api = createMockElectronAPI();
  installElectronAPI(api);
});

afterEach(() => {
  vi.useRealTimers();
});

const flush = async () => { await act(async () => { await Promise.resolve(); }); };

describe('buildRecoveryPayload', () => {
  it('prefers live editor text, includes dirty untitled drafts, and settings only when unsaved', () => {
    const p = makeParams({
      dirtyEditors: new Set(['b1']),
      dirtyBlockIds: new Set(),
      editorInstances: { current: new Map([['b1', { getValue: () => 'live editor text' }]]) },
      untitledFiles: new Map([
        ['u1', { title: 'Untitled-1', content: 'draft', isDirty: true }],
        ['u2', { title: 'Untitled-2', content: '', isDirty: false }],
      ]),
    });
    expect(buildRecoveryPayload(p)).toEqual({
      files: [{ relativePath: 'game/script.rpy', content: 'live editor text' }],
      untitled: [{ id: 'u1', title: 'Untitled-1', content: 'draft' }],
      settings: null,
    });
    expect(buildRecoveryPayload({ ...p, hasUnsavedSettings: true }).settings).toEqual({ draftingMode: false, openTabs: [], activeTabId: 'canvas' });
  });

  it('skips dirty ids with no file path', () => {
    const noPath = createBlock({ id: 'b2', filePath: undefined });
    const p = makeParams({ blocksRef: { current: [noPath] }, dirtyBlockIds: new Set(['b2']) });
    expect(buildRecoveryPayload(p).files).toEqual([]);
  });
});

describe('useRecoverySnapshots', () => {
  it('writes a snapshot 5 s after the last change, not before', async () => {
    renderHook(() => useRecoverySnapshots(makeParams()));
    await act(async () => { vi.advanceTimersByTime(4999); });
    expect(api.recovery.write).not.toHaveBeenCalled();
    await act(async () => { vi.advanceTimersByTime(1); });
    expect(api.recovery.write).toHaveBeenCalledWith(SESSION, {
      files: [{ relativePath: 'game/script.rpy', content: 'block content' }],
      untitled: [],
      settings: null,
    });
  });

  it('restarts the debounce on each change but still writes within 60 s of continuous edits', async () => {
    const params = makeParams();
    const { rerender } = renderHook((p: UseRecoverySnapshotsParams) => useRecoverySnapshots(p), { initialProps: params });
    for (let i = 0; i < 15; i++) {
      await act(async () => { vi.advanceTimersByTime(4000); });
      const block = createBlock({ id: 'b1', filePath: 'game/script.rpy', content: `edit ${i}` });
      rerender({ ...params, blocks: [block], blocksRef: { current: [block] } });
    }
    expect(api.recovery.write).toHaveBeenCalledTimes(1); // forced by the 60 s cap
  });

  it('reports each successful write via onSnapshotWritten', async () => {
    const onSnapshotWritten = vi.fn();
    renderHook(() => useRecoverySnapshots(makeParams({ onSnapshotWritten })));
    await act(async () => { vi.advanceTimersByTime(5000); });
    await flush();
    expect(onSnapshotWritten).toHaveBeenCalledTimes(1);
  });

  it('does not report a failed or size-skipped write (nothing new is protected)', async () => {
    const onSnapshotWritten = vi.fn();
    const warn = vi.spyOn(logger, 'warn').mockImplementation(() => {});
    api.recovery.write.mockResolvedValueOnce({ success: true, skipped: 'too-large' });
    const params = makeParams({ onSnapshotWritten });
    const { rerender } = renderHook((p: UseRecoverySnapshotsParams) => useRecoverySnapshots(p), { initialProps: params });
    await act(async () => { vi.advanceTimersByTime(5000); });
    await flush();
    api.recovery.write.mockRejectedValueOnce(new Error('EACCES'));
    const block = createBlock({ id: 'b1', filePath: 'game/script.rpy', content: 'again' });
    rerender({ ...params, blocks: [block], blocksRef: { current: [block] } });
    await act(async () => { vi.advanceTimersByTime(5000); });
    await flush();
    expect(api.recovery.write).toHaveBeenCalledTimes(2);
    expect(onSnapshotWritten).not.toHaveBeenCalled();    warn.mockRestore();
  });

  it('does nothing while disabled', async () => {
    renderHook(() => useRecoverySnapshots(makeParams({ enabled: false })));
    await act(async () => { vi.advanceTimersByTime(120_000); });
    expect(api.recovery.write).not.toHaveBeenCalled();
  });

  it('does nothing when nothing is unsaved, and never clears a file it did not write', async () => {
    renderHook(() => useRecoverySnapshots(makeParams({ dirtyBlockIds: new Set() })));
    await act(async () => { vi.advanceTimersByTime(120_000); });
    expect(api.recovery.write).not.toHaveBeenCalled();
    expect(api.recovery.clear).not.toHaveBeenCalled();
  });

  it('clears its own file once everything is saved', async () => {
    const params = makeParams();
    const { rerender } = renderHook((p: UseRecoverySnapshotsParams) => useRecoverySnapshots(p), { initialProps: params });
    await act(async () => { vi.advanceTimersByTime(5000); });
    await flush();
    rerender({ ...params, dirtyBlockIds: new Set() });
    await flush();
    expect(api.recovery.clear).toHaveBeenCalledWith(SESSION);
  });

  it('clears after an in-flight write that finishes once nothing is unsaved', async () => {
    let resolveWrite: (v: { success: boolean }) => void = () => {};
    api.recovery.write.mockImplementation(() => new Promise(r => { resolveWrite = r; }));
    const params = makeParams();
    const { rerender } = renderHook((p: UseRecoverySnapshotsParams) => useRecoverySnapshots(p), { initialProps: params });
    await act(async () => { vi.advanceTimersByTime(5000); });
    rerender({ ...params, dirtyBlockIds: new Set() }); // user saved mid-write
    await act(async () => { resolveWrite({ success: true }); await Promise.resolve(); });
    await flush();
    expect(api.recovery.clear).toHaveBeenCalledWith(SESSION);
  });

  it('never overlaps writes; a change during a write schedules one more pass', async () => {
    let resolveWrite: (v: { success: boolean }) => void = () => {};
    api.recovery.write.mockImplementation(() => new Promise(r => { resolveWrite = r; }));
    const params = makeParams();
    const { rerender } = renderHook((p: UseRecoverySnapshotsParams) => useRecoverySnapshots(p), { initialProps: params });
    await act(async () => { vi.advanceTimersByTime(5000); });
    const block = createBlock({ id: 'b1', filePath: 'game/script.rpy', content: 'newer' });
    rerender({ ...params, blocks: [block], blocksRef: { current: [block] } });
    await act(async () => { vi.advanceTimersByTime(5000); });
    expect(api.recovery.write).toHaveBeenCalledTimes(1);
    await act(async () => { resolveWrite({ success: true }); await Promise.resolve(); });
    await act(async () => { vi.advanceTimersByTime(5000); });
    expect(api.recovery.write).toHaveBeenCalledTimes(2);
    expect(api.recovery.write.mock.calls[1][1]).toMatchObject({ files: [{ content: 'newer' }] });
  });

  it('logs a failing write once per session and never throws', async () => {
    const warn = vi.spyOn(logger, 'warn').mockImplementation(() => {});
    api.recovery.write.mockRejectedValue(new Error('ENOSPC'));
    const params = makeParams();
    const { rerender } = renderHook((p: UseRecoverySnapshotsParams) => useRecoverySnapshots(p), { initialProps: params });
    await act(async () => { vi.advanceTimersByTime(5000); });
    await flush();
    const block = createBlock({ id: 'b1', filePath: 'game/script.rpy', content: 'again' });
    rerender({ ...params, blocks: [block], blocksRef: { current: [block] } });
    await act(async () => { vi.advanceTimersByTime(5000); });
    await flush();
    expect(api.recovery.write).toHaveBeenCalledTimes(2);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it('treats a { success: false } result as a failure (logged, file not considered written)', async () => {
    const warn = vi.spyOn(logger, 'warn').mockImplementation(() => {});
    api.recovery.write.mockResolvedValue({ success: false, error: 'No project is open' });
    const params = makeParams();
    const { rerender } = renderHook((p: UseRecoverySnapshotsParams) => useRecoverySnapshots(p), { initialProps: params });
    await act(async () => { vi.advanceTimersByTime(5000); });
    await flush();
    rerender({ ...params, dirtyBlockIds: new Set() });
    await flush();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(api.recovery.clear).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('starts fresh (no clear of the old file) when the session id changes', async () => {
    const sessionIdRef = { current: SESSION as string | null };
    const params = makeParams({ sessionIdRef });
    const { rerender } = renderHook((p: UseRecoverySnapshotsParams) => useRecoverySnapshots(p), { initialProps: params });
    await act(async () => { vi.advanceTimersByTime(5000); });
    await flush();
    sessionIdRef.current = '22222222-2222-4222-8222-222222222222';
    rerender({ ...params, dirtyBlockIds: new Set() });
    await flush();
    expect(api.recovery.clear).not.toHaveBeenCalled();
  });
});
