import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameExecution } from '@/hooks/useGameExecution';
import { installElectronAPI } from '@/test/mocks/electronAPI';

function makeParams(overrides: Partial<Parameters<typeof useGameExecution>[0]> = {}) {
  return {
    projectRootPath: '/project',
    renpyPath: '/renpy-8',
    isRenpyPathValid: true,
    onConfigureRenpy: vi.fn(),
    addToast: vi.fn(),
    cleanupWarpTempFile: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('useGameExecution', () => {
  let api: ReturnType<typeof installElectronAPI>;

  beforeEach(() => {
    api = installElectronAPI();
  });

  it('initializes with isGameRunning=false', () => {
    const { result } = renderHook(() => useGameExecution(makeParams()));
    expect(result.current.isGameRunning).toBe(false);
  });

  it('initializes with screenshotCount=0', () => {
    const { result } = renderHook(() => useGameExecution(makeParams()));
    expect(result.current.screenshotCount).toBe(0);
  });

  it('handleRunGame calls electronAPI.runGame with the configured paths', () => {
    const { result } = renderHook(() => useGameExecution(makeParams()));
    act(() => result.current.handleRunGame());
    expect(api.runGame).toHaveBeenCalledWith('/renpy-8', '/project');
  });

  it('handleRunGame does nothing when projectRootPath is null', () => {
    const { result } = renderHook(() => useGameExecution(makeParams({ projectRootPath: null })));
    act(() => result.current.handleRunGame());
    expect(api.runGame).not.toHaveBeenCalled();
  });

  it('handleRunGame opens the SDK configure prompt instead of running when the Ren\'Py path is invalid', () => {
    const onConfigureRenpy = vi.fn();
    const { result } = renderHook(() => useGameExecution(makeParams({ isRenpyPathValid: false, onConfigureRenpy })));
    act(() => result.current.handleRunGame());
    expect(onConfigureRenpy).toHaveBeenCalledTimes(1);
    expect(api.runGame).not.toHaveBeenCalled();
  });

  it('handleOpenScreenshotsFolder calls electronAPI.openScreenshotsFolder', async () => {
    const openScreenshotsFolder = vi.fn().mockResolvedValue(undefined);
    (window.electronAPI as Record<string, unknown>).openScreenshotsFolder = openScreenshotsFolder;
    const { result } = renderHook(() => useGameExecution(makeParams()));
    await act(async () => result.current.handleOpenScreenshotsFolder());
    expect(openScreenshotsFolder).toHaveBeenCalled();
  });

  it('handleClearScreenshots calls electronAPI.clearScreenshots and adds success toast', async () => {
    const clearScreenshots = vi.fn().mockResolvedValue({ success: true, count: 3 });
    const getScreenshotCount = vi.fn().mockResolvedValue(0);
    (window.electronAPI as Record<string, unknown>).clearScreenshots = clearScreenshots;
    (window.electronAPI as Record<string, unknown>).getScreenshotCount = getScreenshotCount;
    const addToast = vi.fn();
    const { result } = renderHook(() => useGameExecution(makeParams({ addToast })));
    await act(async () => result.current.handleClearScreenshots());
    expect(addToast).toHaveBeenCalledWith(expect.stringContaining('3'), 'success');
  });

  it('sets isGameRunning=true when onGameStarted fires', () => {
    let startedCb: (() => void) | undefined;
    api.onGameStarted.mockImplementation((cb: () => void) => {
      startedCb = cb;
      return () => {};
    });
    const { result } = renderHook(() => useGameExecution(makeParams()));
    act(() => startedCb?.());
    expect(result.current.isGameRunning).toBe(true);
  });

  it('sets isGameRunning=false when onGameStopped fires', () => {
    let startedCb: (() => void) | undefined;
    let stoppedCb: (() => void) | undefined;
    api.onGameStarted.mockImplementation((cb: () => void) => { startedCb = cb; return () => {}; });
    api.onGameStopped.mockImplementation((cb: () => void) => { stoppedCb = cb; return () => {}; });
    const cleanupWarpTempFile = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useGameExecution(makeParams({ cleanupWarpTempFile })));
    act(() => startedCb?.());
    act(() => stoppedCb?.());
    expect(result.current.isGameRunning).toBe(false);
  });

  it('calls addToast with the error message when onGameError fires', () => {
    let errorCb: ((error: string) => void) | undefined;
    api.onGameError.mockImplementation((cb: (error: string) => void) => { errorCb = cb; return () => {}; });
    const addToast = vi.fn();
    const { result } = renderHook(() => useGameExecution(makeParams({ addToast })));
    act(() => errorCb?.('spawn ENOENT'));
    expect(addToast).toHaveBeenCalledWith('spawn ENOENT', 'error');
    expect(result.current.isGameRunning).toBe(false);
  });

  it('sets crashLog when onGameCrashLog fires', () => {
    let crashLogCb: ((tracebackText: string) => void) | undefined;
    api.onGameCrashLog.mockImplementation((cb: (tracebackText: string) => void) => { crashLogCb = cb; return () => {}; });
    const { result } = renderHook(() => useGameExecution(makeParams()));
    expect(result.current.crashLog).toBeNull();
    act(() => crashLogCb?.('Traceback (most recent call last): ...'));
    expect(result.current.crashLog).toBe('Traceback (most recent call last): ...');
  });

  it('dismissCrashLog clears crashLog back to null', () => {
    let crashLogCb: ((tracebackText: string) => void) | undefined;
    api.onGameCrashLog.mockImplementation((cb: (tracebackText: string) => void) => { crashLogCb = cb; return () => {}; });
    const { result } = renderHook(() => useGameExecution(makeParams()));
    act(() => crashLogCb?.('some traceback'));
    expect(result.current.crashLog).toBe('some traceback');
    act(() => result.current.dismissCrashLog());
    expect(result.current.crashLog).toBeNull();
  });
});
