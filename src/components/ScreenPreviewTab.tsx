/**
 * ScreenPreviewTab — singleton tab that shows a read-only ScreenPreview for
 * whichever Ren'Py `screen` block the Monaco cursor is currently inside.
 *
 * Context-sensitive: watches cursor position + active block, walks the parsed
 * RenpyScreen list to find the enclosing screen, then parses the screen code
 * directly from the block content to render a live preview.
 */

import React, { useMemo } from 'react';
import type { RenpyScreen, Block } from '@/types';
import ScreenPreview from '@/components/ScreenPreview';
import { parseScreenCode } from '@/lib/screenParser';

export interface ScreenPreviewTabProps {
  screens: Map<string, RenpyScreen>;
  blocks: Block[];
  /** blockId of the block whose editor last had cursor focus */
  cursorBlockId: string | null;
  /** 1-indexed line within that block */
  cursorLine: number | null;
}

export default function ScreenPreviewTab({
  screens,
  blocks,
  cursorBlockId,
  cursorLine,
}: ScreenPreviewTabProps) {
  const activeScreen = useMemo(() => {
    if (!cursorBlockId || cursorLine == null) return null;

    const blockScreens = [...screens.values()]
      .filter(s => s.definedInBlockId === cursorBlockId)
      .sort((a, b) => a.line - b.line);

    if (blockScreens.length === 0) return null;

    const block = blocks.find(b => b.id === cursorBlockId);
    const blockLineCount = block ? block.content.split('\n').length : Infinity;

    for (let i = 0; i < blockScreens.length; i++) {
      const start = blockScreens[i].line;
      const end = i + 1 < blockScreens.length ? blockScreens[i + 1].line - 1 : blockLineCount;
      if (cursorLine >= start && cursorLine <= end) return blockScreens[i];
    }
    return null;
  }, [screens, blocks, cursorBlockId, cursorLine]);

  const composition = useMemo(() => {
    if (!activeScreen) return null;
    const block = blocks.find(b => b.id === activeScreen.definedInBlockId);
    if (!block) return null;
    const lines = block.content.split('\n');
    const startIdx = Math.max(0, activeScreen.line - 1);
    const screenLines: string[] = [lines[startIdx]];
    for (let i = startIdx + 1; i < lines.length; i++) {
      const l = lines[i];
      if (l.trim() === '' || l.trim().startsWith('#')) { screenLines.push(l); continue; }
      if (!/^\s/.test(l)) break;
      screenLines.push(l);
    }
    return parseScreenCode(screenLines.join('\n'));
  }, [activeScreen, blocks]);

  if (!cursorBlockId || cursorLine == null) {
    return <Placeholder message="Open a .rpy file and place your cursor inside a screen block." />;
  }

  if (!activeScreen) {
    return <Placeholder message="Cursor is not inside a screen block." />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-950">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800 text-xs text-gray-400 select-none flex-none">
        <span className="font-mono text-blue-400">screen {activeScreen.name}</span>
        {activeScreen.parameters && (
          <span className="text-gray-500">({activeScreen.parameters})</span>
        )}
      </div>
      {composition ? (
        <ScreenPreview composition={composition} />
      ) : (
        <Placeholder message={`Could not parse screen "${activeScreen.name}".`} />
      )}
    </div>
  );
}

function Placeholder({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500 select-none p-8">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
      <p className="text-sm text-center max-w-xs text-gray-500">{message}</p>
    </div>
  );
}
