/**
 * @file test/setup.ts
 * @description Global test setup for Vitest.
 * Registers jest-dom matchers and provides global mocks
 * for browser/Electron APIs not available in jsdom.
 */

import '@testing-library/jest-dom/vitest';

type GlobalFsTypes = typeof globalThis & {
  FileSystemFileHandle?: typeof FileSystemFileHandle;
  FileSystemDirectoryHandle?: typeof FileSystemDirectoryHandle;
};

// --- Global Browser API Mocks ---

// FileSystemFileHandle and FileSystemDirectoryHandle are not available in jsdom.
// Provide minimal stubs so type references don't throw at runtime.
if (typeof globalThis.FileSystemFileHandle === 'undefined') {
  (globalThis as GlobalFsTypes).FileSystemFileHandle = class FileSystemFileHandle {} as unknown as typeof FileSystemFileHandle;
}
if (typeof globalThis.FileSystemDirectoryHandle === 'undefined') {
  (globalThis as GlobalFsTypes).FileSystemDirectoryHandle = class FileSystemDirectoryHandle {} as unknown as typeof FileSystemDirectoryHandle;
}

// window.electronAPI is undefined by default in tests (browser/jsdom mode).
// Individual tests that need it should import and install the mock from
// test/mocks/electronAPI.ts. We explicitly set it to undefined here to
// match the browser-fallback code path in the app.
Object.defineProperty(window, 'electronAPI', {
  value: undefined,
  writable: true,
  configurable: true,
});

// ResizeObserver is not implemented in jsdom — stub it so canvas components
// that call it during mount don't throw.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Pointer capture APIs are not implemented in jsdom — stub them so canvas
// pointer-down handlers don't throw when tests fire pointer events.
if (!HTMLElement.prototype.setPointerCapture) {
  HTMLElement.prototype.setPointerCapture = function () {};
}
if (!HTMLElement.prototype.releasePointerCapture) {
  HTMLElement.prototype.releasePointerCapture = function () {};
}
if (!HTMLElement.prototype.hasPointerCapture) {
  HTMLElement.prototype.hasPointerCapture = function () { return false; };
}
