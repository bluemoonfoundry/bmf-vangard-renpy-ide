/**
 * @file TabContextMenu.tsx
 * @description Right-click context menu for editor tabs (~100 lines).
 * Key features: close (tab/others/left/right/all) operations, split-right/split-bottom, and
 * move-to-other-pane actions; actions are conditionally shown based on split layout state.
 * Integration: rendered by `EditorView` tab bar; delegates all actions to `EditorView` callbacks.
 */

import React, { useEffect, useRef } from 'react';
import { useDualPane } from '@/contexts/DualPaneContext';
import { POPOUT_SUPPORTED_TAB_TYPES } from '@/hooks/usePopoutSync';

interface TabContextMenuProps {
  x: number;
  y: number;
  tabId: string;
  paneId: 'primary' | 'secondary';
  /** App-relative path of the tab's underlying file, if it has one (undefined for canvas/punchlist/etc. tabs). */
  filePath?: string;
  /** The tab's EditorTab.type -- gates which actions apply (e.g. "Pop Out" is editor-only for now). */
  tabType?: string;
  onClose: () => void;
  onCloseTab: (tabId: string) => void;
  onCloseOthers: (tabId: string) => void;
  onCloseLeft: (tabId: string) => void;
  onCloseRight: (tabId: string) => void;
  onCloseAll: () => void;
  onSplitRight?: (tabId: string) => void;
  onSplitBottom?: (tabId: string) => void;
  onMoveToOtherPane?: (tabId: string) => void;
  onPopOut?: (tabId: string) => void;
  onRevealInFileManager?: (filePath: string) => void;
  onCopyPath?: (filePath: string) => void;
}

const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const revealLabel = isMac ? 'Reveal in Finder' : 'Reveal in File Explorer';

const TabContextMenu: React.FC<TabContextMenuProps> = ({
  x, y, tabId, paneId, filePath, tabType, onClose,
  onCloseTab, onCloseOthers, onCloseLeft, onCloseRight, onCloseAll,
  onSplitRight, onSplitBottom, onMoveToOtherPane, onPopOut, onRevealInFileManager, onCopyPath,
}) => {
  const { splitLayout } = useDualPane();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  const isProtectedTab = tabId === 'canvas';
  const moveLabel = paneId === 'primary' ? 'Move to Secondary Pane' : 'Move to Primary Pane';

  return (
    <div
      ref={menuRef}
      className="absolute z-[60] bg-white dark:bg-gray-800 rounded-md shadow-2xl border border-gray-200 dark:border-gray-700 w-52"
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-1 space-y-1">
        <button
          onClick={() => handleAction(() => onCloseTab(tabId))}
          disabled={isProtectedTab}
          className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Close
        </button>
        <button
          onClick={() => handleAction(() => onCloseOthers(tabId))}
          className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 rounded"
        >
          Close Others
        </button>
        <button
          onClick={() => handleAction(() => onCloseLeft(tabId))}
          className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 rounded"
        >
          Close to the Left
        </button>
        <button
          onClick={() => handleAction(() => onCloseRight(tabId))}
          className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 rounded"
        >
          Close to the Right
        </button>
        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
        <button
          onClick={() => handleAction(onCloseAll)}
          className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 rounded"
        >
          Close All
        </button>
        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
        {splitLayout === 'none' && !isProtectedTab && (
          <>
            <button
              onClick={() => handleAction(() => onSplitRight?.(tabId))}
              className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 rounded"
            >
              Open in Split Right
            </button>
            <button
              onClick={() => handleAction(() => onSplitBottom?.(tabId))}
              className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 rounded"
            >
              Open in Split Bottom
            </button>
          </>
        )}
        {splitLayout !== 'none' && !isProtectedTab && (
          <button
            onClick={() => handleAction(() => onMoveToOtherPane?.(tabId))}
            className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 rounded"
          >
            {moveLabel}
          </button>
        )}
        {tabType && POPOUT_SUPPORTED_TAB_TYPES.has(tabType) && onPopOut && (
          <>
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            <button
              onClick={() => handleAction(() => onPopOut(tabId))}
              className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 rounded"
            >
              Pop Out to Window
            </button>
          </>
        )}
        {filePath && (
          <>
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            <button
              onClick={() => handleAction(() => onRevealInFileManager?.(filePath))}
              className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 rounded"
            >
              {revealLabel}
            </button>
            <button
              onClick={() => handleAction(() => onCopyPath?.(filePath))}
              className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 rounded"
            >
              Copy Path
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TabContextMenu;
