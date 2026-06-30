import { useRef, useEffect } from 'react';

export interface MenuCommandHandlers {
  onNewProject: () => void;
  onOpenProject: () => void;
  onOpenRecent: (path: string) => void;
  onSaveAll: () => void;
  onRunProject: () => void;
  onOpenStaticTab: (type: string) => void;
  onToggleSearch: () => void;
  onOpenSettings: () => void;
  onOpenShortcuts: () => void;
  onOpenAbout: () => void;
  onShowTutorial: () => void;
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
  onExplorerNewFile: () => void;
  onExplorerNewFolder: () => void;
  onExplorerRename: () => void;
  onExplorerDelete: () => void;
  onExplorerRefresh: () => void;
  onOpenScreenshotsFolder: () => void;
  onCloseTab: () => void;
}

export function useMenuCommandDispatch(handlers: MenuCommandHandlers) {
  const handlersRef = useRef(handlers);
  // Keep ref in sync without re-registering the IPC listener.
  useEffect(() => { handlersRef.current = handlers; });

  useEffect(() => {
    if (!window.electronAPI) return;
    const removeListener = window.electronAPI.onMenuCommand((data: { command: string; type?: string; path?: string }) => {
      const h = handlersRef.current;
      if (data.command === 'new-project') h.onNewProject();
      if (data.command === 'open-project') h.onOpenProject();
      if (data.command === 'open-recent' && data.path) h.onOpenRecent(data.path);
      if (data.command === 'save-all') h.onSaveAll();
      if (data.command === 'run-project') h.onRunProject();
      if (data.command === 'stop-project') window.electronAPI?.stopGame();
      if (data.command === 'open-static-tab' && data.type) h.onOpenStaticTab(data.type);
      if (data.command === 'toggle-search') h.onToggleSearch();
      if (data.command === 'open-settings') h.onOpenSettings();
      if (data.command === 'open-shortcuts') h.onOpenShortcuts();
      if (data.command === 'open-about') h.onOpenAbout();
      if (data.command === 'show-tutorial') h.onShowTutorial();
      if (data.command === 'toggle-left-sidebar') h.onToggleLeftSidebar();
      if (data.command === 'toggle-right-sidebar') h.onToggleRightSidebar();
      if (data.command === 'explorer-new-file') h.onExplorerNewFile();
      if (data.command === 'explorer-new-folder') h.onExplorerNewFolder();
      if (data.command === 'explorer-rename') h.onExplorerRename();
      if (data.command === 'explorer-delete') h.onExplorerDelete();
      if (data.command === 'explorer-refresh') h.onExplorerRefresh();
      if (data.command === 'open-screenshots-folder') h.onOpenScreenshotsFolder();
      if (data.command === 'close-tab') h.onCloseTab();
    });
    return removeListener;
  }, []);
}
