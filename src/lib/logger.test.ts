import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '@/lib/logger';

// Minimal stub for window.electronAPI that only exposes log and addToast.
function installLogMock() {
  const logFn = vi.fn();
  const addToastFn = vi.fn();
  Object.defineProperty(window, 'electronAPI', {
    value: { log: logFn, addToast: addToastFn },
    writable: true,
    configurable: true,
  });
  return { logFn, addToastFn };
}

function removeLogMock() {
  Object.defineProperty(window, 'electronAPI', {
    value: undefined,
    writable: true,
    configurable: true,
  });
}

describe('logger', () => {
  beforeEach(() => {
    // Silence console output produced when import.meta.env.DEV is true
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    removeLogMock();
  });

  // ── IPC forwarding ─────────────────────────────────────────────────────────

  it('logger.error calls window.electronAPI.log with level "error" and message', () => {
    const { logFn } = installLogMock();
    logger.error('something went wrong');
    expect(logFn).toHaveBeenCalledWith('error', 'something went wrong', undefined);
  });

  it('logger.error with an Error instance forwards message and stack separately', () => {
    const { logFn } = installLogMock();
    const err = new Error('boom');
    logger.error('oops', err);
    expect(logFn).toHaveBeenCalledWith('error', 'oops', err.message, err.stack);
  });

  it('logger.error with non-Error data forwards the data as-is', () => {
    const { logFn } = installLogMock();
    logger.error('bad value', { code: 42 });
    expect(logFn).toHaveBeenCalledWith('error', 'bad value', { code: 42 });
  });

  it('logger.warn calls window.electronAPI.log with level "warn"', () => {
    const { logFn } = installLogMock();
    logger.warn('deprecation notice');
    expect(logFn).toHaveBeenCalledWith('warn', 'deprecation notice', undefined);
  });

  it('logger.warn passes optional data argument', () => {
    const { logFn } = installLogMock();
    logger.warn('check this', { key: 'val' });
    expect(logFn).toHaveBeenCalledWith('warn', 'check this', { key: 'val' });
  });

  it('logger.info calls window.electronAPI.log with level "info"', () => {
    const { logFn } = installLogMock();
    logger.info('project loaded');
    expect(logFn).toHaveBeenCalledWith('info', 'project loaded', undefined);
  });

  it('logger.debug calls window.electronAPI.log with level "debug"', () => {
    const { logFn } = installLogMock();
    logger.debug('rendering node', { id: '1' });
    expect(logFn).toHaveBeenCalledWith('debug', 'rendering node', { id: '1' });
  });

  // ── Toast notifications ────────────────────────────────────────────────────

  it('logger.error with showToast:true calls window.electronAPI.addToast', () => {
    const { addToastFn } = installLogMock();
    logger.error('critical failure', undefined, { showToast: true });
    expect(addToastFn).toHaveBeenCalledWith('critical failure', 'error');
  });

  it('logger.error without showToast does not call addToast', () => {
    const { addToastFn } = installLogMock();
    logger.error('silent error');
    expect(addToastFn).not.toHaveBeenCalled();
  });

  it('logger.error with showToast:false does not call addToast', () => {
    const { addToastFn } = installLogMock();
    logger.error('no toast', undefined, { showToast: false });
    expect(addToastFn).not.toHaveBeenCalled();
  });

  // ── Robustness without electronAPI ────────────────────────────────────────

  it('does not throw when electronAPI is undefined', () => {
    removeLogMock(); // ensure it is undefined
    expect(() => logger.error('no api')).not.toThrow();
    expect(() => logger.warn('no api')).not.toThrow();
    expect(() => logger.info('no api')).not.toThrow();
    expect(() => logger.debug('no api')).not.toThrow();
  });

  // ── getLogPath ─────────────────────────────────────────────────────────────

  it('getLogPath returns null in the renderer process', () => {
    expect(logger.getLogPath()).toBeNull();
  });
});
