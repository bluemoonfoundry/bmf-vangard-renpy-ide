/**
 * ScreenPreviewTab — singleton tab that shows a read-only ScreenPreview for
 * whichever Ren'Py `screen` block the Monaco cursor is currently inside.
 *
 * Context-sensitive: watches cursor position + active block, walks the parsed
 * RenpyScreen list to find the enclosing screen, then parses the screen code
 * directly from the block content to render a live preview.
 */

import React, { useMemo } from 'react';
import type { RenpyScreen, Block, ProjectImage, ScreenWidget, ScreenLayoutComposition } from '@/types';
import ScreenPreview from '@/components/ScreenPreview';
import { parseScreenCode } from '@/lib/screenParser';

export interface ScreenPreviewTabProps {
  screens: Map<string, RenpyScreen>;
  blocks: Block[];
  /** blockId of the block whose editor last had cursor focus */
  cursorBlockId: string | null;
  /** 1-indexed line within that block */
  cursorLine: number | null;
  /** Project image assets keyed by path — used to resolve image data URLs in the preview */
  projectImages?: Map<string, ProjectImage>;
}

/** Suffix-match: does projectFilePath end with the given relative path? */
function imageMatchesSuffix(img: ProjectImage, rel: string): boolean {
  const norm = (s: string) => s.replace(/\\/g, '/').toLowerCase();
  return norm(img.projectFilePath ?? img.filePath).endsWith('/' + norm(rel));
}

/** Return the best data URL for a relative image path, or undefined. */
function resolveImageUrl(rel: string, images: Map<string, ProjectImage>): string | undefined {
  const norm = rel.replace(/\\/g, '/');
  // Exact key (as-is or with 'game/' prefix)
  const direct = images.get(norm) ?? images.get('game/' + norm);
  if (direct?.dataUrl) return direct.dataUrl;
  // Suffix scan fallback
  for (const img of images.values()) {
    if (imageMatchesSuffix(img, norm) && img.dataUrl) return img.dataUrl;
  }
  return undefined;
}

/** Walk the widget tree and fill in imageDataUrl for image widgets that have a resolvable path. */
function resolveWidgetImages(widgets: ScreenWidget[], images: Map<string, ProjectImage>): ScreenWidget[] {
  return widgets.map(w => {
    const resolved: ScreenWidget = { ...w };
    if ((w.type === 'image') && w.imagePath && !w.imageDataUrl) {
      const url = resolveImageUrl(w.imagePath, images);
      if (url) resolved.imageDataUrl = url;
    }
    if (w.styleProps?.bgImagePath && !w.styleProps.background) {
      const url = resolveImageUrl(w.styleProps.bgImagePath, images);
      if (url) resolved.styleProps = { ...w.styleProps, background: `url(${url}) center/cover no-repeat` };
    }
    if (w.children) resolved.children = resolveWidgetImages(w.children, images);
    return resolved;
  });
}

function withResolvedImages(
  composition: ScreenLayoutComposition,
  images: Map<string, ProjectImage> | undefined,
): ScreenLayoutComposition {
  if (!images || images.size === 0) return composition;
  return { ...composition, widgets: resolveWidgetImages(composition.widgets, images) };
}

export default function ScreenPreviewTab({
  screens,
  blocks,
  cursorBlockId,
  cursorLine,
  projectImages,
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
    const parsed = parseScreenCode(screenLines.join('\n'));
    return withResolvedImages(parsed, projectImages);
  }, [activeScreen, blocks, projectImages]);

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
