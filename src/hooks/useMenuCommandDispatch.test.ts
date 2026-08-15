import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMenuCommandDispatch } from '@/hooks/useMenuCommandDispatch';
import { installElectronAPI } from '@/test/mocks/electronAPI';

function makeHandlers(overrides = {}) {
  return {
    onNewProject: vi.fn(),
    onOpenProject: vi.fn(),
    onOpenRecent: vi.fn(),
    onSaveAll: vi.fn(),
    onRunProject: vi.fn(),
    onOpenStaticTab: vi.fn(),
    onToggleSearch: vi.fn(),
    onOpenSettings: vi.fn(),
    onOpenShortcuts: vi.fn(),
    onOpenAbout: vi.fn(),
    onShowTutorial: vi.fn(),
    onToggleLeftSidebar: vi.fn(),
    onToggleRightSidebar: vi.fn(),
    onExplorerNewFile: vi.fn(),
    onExplorerNewFolder: vi.fn(),
    onExplorerRename: vi.fn(),
    onExplorerDelete: vi.fn(),
    onExplorerRefresh: vi.fn(),
    onOpenScreenshotsFolder: vi.fn(),
    onNewUntitledFile: vi.fn(),
    onCloseTab: vi.fn(),
    ...overrides,
  };
}

describe('useMenuCommandDispatch', () => {
  let api: ReturnType<typeof installElectronAPI>;
  let dispatchCommand: (data: { command: string; type?: string; path?: string }) => void;

  beforeEach(() => {
    api = installElectronAPI();
    // Capture the registered callback so tests can fire commands directly
    api.onMenuCommand.mockImplementation((cb) => {
      dispatchCommand = cb as typeof dispatchCommand;
      return () => {};
    });
  });

  it('registers an onMenuCommand listener on mount', () => {
    renderHook(() => useMenuCommandDispatch(makeHandlers()));
    expect(api.onMenuCommand).toHaveBeenCalled();
  });

  it.each([
    ['new-project', 'onNewProject'],
    ['open-project', 'onOpenProject'],
    ['save-all', 'onSaveAll'],
    ['run-project', 'onRunProject'],
    ['toggle-search', 'onToggleSearch'],
    ['open-settings', 'onOpenSettings'],
    ['open-shortcuts', 'onOpenShortcuts'],
    ['open-about', 'onOpenAbout'],
    ['show-tutorial', 'onShowTutorial'],
    ['toggle-left-sidebar', 'onToggleLeftSidebar'],
    ['toggle-right-sidebar', 'onToggleRightSidebar'],
    ['explorer-new-file', 'onExplorerNewFile'],
    ['explorer-new-folder', 'onExplorerNewFolder'],
    ['explorer-rename', 'onExplorerRename'],
    ['explorer-delete', 'onExplorerDelete'],
    ['explorer-refresh', 'onExplorerRefresh'],
    ['open-screenshots-folder', 'onOpenScreenshotsFolder'],
    ['new-untitled-file', 'onNewUntitledFile'],
    ['close-tab', 'onCloseTab'],
  ] as const)('dispatches command "%s" to handler "%s"', (command, handlerKey) => {
    const handlers = makeHandlers();
    renderHook(() => useMenuCommandDispatch(handlers));
    dispatchCommand({ command });
    expect(handlers[handlerKey]).toHaveBeenCalled();
  });

  it('passes path to onOpenRecent for open-recent command', () => {
    const handlers = makeHandlers();
    renderHook(() => useMenuCommandDispatch(handlers));
    dispatchCommand({ command: 'open-recent', path: '/my/project' });
    expect(handlers.onOpenRecent).toHaveBeenCalledWith('/my/project');
  });

  it('passes type to onOpenStaticTab for open-static-tab command', () => {
    const handlers = makeHandlers();
    renderHook(() => useMenuCommandDispatch(handlers));
    dispatchCommand({ command: 'open-static-tab', type: 'stats' });
    expect(handlers.onOpenStaticTab).toHaveBeenCalledWith('stats');
  });

  it('ignores open-recent when no path is provided', () => {
    const handlers = makeHandlers();
    renderHook(() => useMenuCommandDispatch(handlers));
    dispatchCommand({ command: 'open-recent' });
    expect(handlers.onOpenRecent).not.toHaveBeenCalled();
  });

  it('does not throw for unknown command', () => {
    const handlers = makeHandlers();
    renderHook(() => useMenuCommandDispatch(handlers));
    expect(() => dispatchCommand({ command: 'unknown-command' })).not.toThrow();
  });
});
