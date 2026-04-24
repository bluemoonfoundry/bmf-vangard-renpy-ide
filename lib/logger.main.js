import electronLog from 'electron-log';

electronLog.transports.file.level = 'info';
electronLog.transports.file.maxSize = 5 * 1024 * 1024;
electronLog.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}';
electronLog.transports.console.level = process.env.NODE_ENV === 'development' ? 'debug' : false;

export const logger = {
  error(message, error, options) {
    if (error instanceof Error) {
      electronLog.error(message, error.message, error.stack);
    } else {
      electronLog.error(message, error);
    }
    if (options?.showToast) {
      // addToast is injected by the main process window manager
    }
  },

  warn(message, data) {
    electronLog.warn(message, data);
  },

  info(message, data) {
    electronLog.info(message, data);
  },

  debug(message, data) {
    electronLog.debug(message, data);
  },

  getLogPath() {
    return electronLog.transports?.file?.getFile()?.path ?? null;
  }
};

export { electronLog };
