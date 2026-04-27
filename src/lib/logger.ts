/**
 * @file logger.ts
 * @description Centralized logging utility using electron-log
 *
 * Log destinations:
 * 1. Console (development only) - Visible in terminal/DevTools
 * 2. File (always) - Persists to disk for bug reports
 * 3. Toast (critical errors) - User-facing notifications
 *
 * Log file locations:
 * - macOS: ~/Library/Logs/renide/main.log
 * - Windows: %USERPROFILE%\AppData\Roaming\renide\logs\main.log
 * - Linux: ~/.config/renide/logs/main.log
 *
 * Usage:
 *   logger.error('Failed to save', err, { showToast: true });
 *   logger.warn('Deprecated feature used');
 *   logger.info('Project loaded successfully');
 *   logger.debug('Detailed debugging info');
 */

// Renderer-process logger — forwards to main process via IPC for file logging
const isDev = import.meta.env.DEV;

const electronLog = {
  error: (...args: unknown[]) => {
    if (isDev) console.error(...args);
    window.electronAPI?.log?.('error', ...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
    window.electronAPI?.log?.('warn', ...args);
  },
  info: (...args: unknown[]) => {
    if (isDev) console.info(...args);
    window.electronAPI?.log?.('info', ...args);
  },
  debug: (...args: unknown[]) => {
    if (isDev) console.debug(...args);
    window.electronAPI?.log?.('debug', ...args);
  },
};

interface LogOptions {
  /** Show a user-facing toast notification */
  showToast?: boolean;
}

/**
 * Centralized logger with multiple destinations
 */
export const logger = {
  /**
   * Log an error (always visible in file, optionally shows toast)
   * @param message - Error description
   * @param error - Optional error object or data
   * @param options - Logging options
   */
  error(message: string, error?: unknown, options?: LogOptions) {
    if (error instanceof Error) {
      electronLog.error(message, error.message, error.stack);
    } else {
      electronLog.error(message, error);
    }

    // Show user-facing toast for critical errors
    if (options?.showToast && typeof window !== 'undefined') {
      window.electronAPI?.addToast?.(message, 'error');
    }
  },

  /**
   * Log a warning (visible in dev console and file)
   * @param message - Warning description
   * @param data - Optional additional data
   */
  warn(message: string, data?: unknown) {
    electronLog.warn(message, data);
  },

  /**
   * Log informational message (visible in dev console and file)
   * @param message - Info message
   * @param data - Optional additional data
   */
  info(message: string, data?: unknown) {
    electronLog.info(message, data);
  },

  /**
   * Log debug information (visible in dev console and file)
   * @param message - Debug message
   * @param data - Optional additional data
   */
  debug(message: string, data?: unknown) {
    electronLog.debug(message, data);
  },

  getLogPath(): string | null {
    return null;
  }
};

// Export for main process to access log path
export { electronLog };
