/**
 * @file Minimap.tsx
 * @description Thumbnail-scale overview of all canvas items with interactive viewport panning (~180 lines).
 * Key features: renders blocks, groups, notes, labels, screens, and config nodes as coloured
 * rectangles; dragging the viewport rectangle pans the main canvas transform.
 * Integration: rendered anchored at the bottom-right of `StoryCanvas`, `RouteCanvas`, and
 * `ChoiceCanvas`; reads `MinimapItem[]` and canvas `transform` from the parent canvas.
 *
 * Scale strategy: Math.min(scaleX, scaleY) always fits the ENTIRE graph in the frame —
 * a minimap that hides part of the graph defeats its purpose. Extreme-aspect-ratio
 * projects (e.g. 80 blocks in a horizontal row) end up with very small item boxes at
 * this scale; legibility there comes from the per-item min-size floor below, not from
 * cropping the view to "follow" the viewport (a prior approach that was removed because
 * it clipped out blocks the user hadn't scrolled to yet).
 */
import React, { useRef, useMemo, useCallback } from 'react';
import type { NoteColor } from '@/types';

export interface MinimapItem {
  id: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  type: 'block' | 'group' | 'note' | 'label' | 'screen' | 'config';
  color?: NoteColor;
}

interface MinimapProps {
  items: MinimapItem[];
  transform: { x: number; y: number; scale: number };
  canvasDimensions: { width: number; height: number };
  onTransformChange: React.Dispatch<React.SetStateAction<{ x: number; y: number; scale: number }>>;
}

const MINIMAP_WIDTH = 240;
const MINIMAP_HEIGHT = 180;
const PADDING = 4;

const ITEM_COLORS: Record<MinimapItem['type'], string> = {
  block: 'rgba(107, 114, 128, 0.7)',
  group: 'rgba(99, 102, 241, 0.4)',
  note: 'rgba(234, 179, 8, 0.6)',
  label: 'rgba(147, 197, 253, 0.8)',
  screen: 'rgba(45, 212, 191, 0.7)',
  config: 'rgba(248, 113, 113, 0.7)',
};

const Minimap: React.FC<MinimapProps> = ({ items, transform, canvasDimensions, onTransformChange }) => {
  const minimapRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ isDragging: boolean; startX: number; startY: number; initialPanX: number; initialPanY: number }>({
    isDragging: false, startX: 0, startY: 0, initialPanX: 0, initialPanY: 0,
  });

  // Compute bounds and scale from items only (cheap re-run: only when items change).
  // Groups are excluded from the bounding box — a large group container must not
  // force the scale tiny and push block dots into one corner.
  const { bounds, minimapScale } = useMemo(() => {
    const fallback = { bounds: { minX: 0, minY: 0, width: 0, height: 0 }, minimapScale: 1 };
    if (items.length === 0) return fallback;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    items.forEach(item => {
      if (item.type === 'group') return;
      minX = Math.min(minX, item.position.x);
      minY = Math.min(minY, item.position.y);
      maxX = Math.max(maxX, item.position.x + item.width);
      maxY = Math.max(maxY, item.position.y + item.height);
    });
    if (!isFinite(minX)) return fallback;

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    if (contentWidth <= 0 || contentHeight <= 0) {
      return { bounds: { minX, minY, width: contentWidth, height: contentHeight }, minimapScale: 1 };
    }

    const scale = Math.min(
      (MINIMAP_WIDTH - PADDING * 2) / contentWidth,
      (MINIMAP_HEIGHT - PADDING * 2) / contentHeight,
    );

    return {
      bounds: { minX, minY, width: contentWidth, height: contentHeight },
      minimapScale: scale,
    };
  }, [items]);

  // Pan offset — cheap inline arithmetic, recomputes every render. Always centres
  // the full graph in the fixed frame so every block stays visible.
  const panX = (MINIMAP_WIDTH  - bounds.width  * minimapScale) / 2;
  const panY = (MINIMAP_HEIGHT - bounds.height * minimapScale) / 2;

  const viewportStyle = useMemo<React.CSSProperties>(() => {
    if (!canvasDimensions.width || !canvasDimensions.height) return {};
    const viewWidth  = canvasDimensions.width  / transform.scale;
    const viewHeight = canvasDimensions.height / transform.scale;
    const viewX = -transform.x / transform.scale;
    const viewY = -transform.y / transform.scale;
    return {
      width:  viewWidth  * minimapScale,
      height: viewHeight * minimapScale,
      left: (viewX - bounds.minX) * minimapScale + panX,
      top:  (viewY - bounds.minY) * minimapScale + panY,
      position: 'absolute',
      border: '1.5px solid rgba(79, 70, 229, 0.8)',
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      cursor: 'grab',
      willChange: 'transform, width, height, left, top',
    };
  }, [transform, canvasDimensions, bounds, minimapScale, panX, panY]);

  const handlePan = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!minimapRef.current || !canvasDimensions.width || !canvasDimensions.height) return;
    const rect = minimapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const worldX = (x - panX) / minimapScale + bounds.minX;
    const worldY = (y - panY) / minimapScale + bounds.minY;
    onTransformChange(t => ({
      ...t,
      x: (canvasDimensions.width  / 2) - worldX * t.scale,
      y: (canvasDimensions.height / 2) - worldY * t.scale,
    }));
  }, [onTransformChange, bounds, minimapScale, canvasDimensions, panX, panY]);

  const handleViewportPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    dragState.current = { isDragging: true, startX: e.clientX, startY: e.clientY, initialPanX: transform.x, initialPanY: transform.y };
    target.style.cursor = 'grabbing';

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!dragState.current.isDragging) return;
      const dx = moveEvent.clientX - dragState.current.startX;
      const dy = moveEvent.clientY - dragState.current.startY;
      onTransformChange(t => ({
        ...t,
        x: dragState.current.initialPanX - dx / minimapScale * transform.scale,
        y: dragState.current.initialPanY - dy / minimapScale * transform.scale,
      }));
    };
    const handlePointerUp = () => {
      dragState.current.isDragging = false;
      target.style.cursor = 'grab';
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      target.releasePointerCapture(e.pointerId);
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, [minimapScale, transform.scale, transform.x, transform.y, onTransformChange]);

  return (
    <div
      ref={minimapRef}
      onPointerDown={handlePan}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-lg"
      style={{ width: MINIMAP_WIDTH, height: MINIMAP_HEIGHT }}
    >
      <div className="relative w-full h-full overflow-hidden">
        {items.map(item => {
          let color = ITEM_COLORS[item.type];
          if (item.type === 'note' && item.color) {
            const noteColorMap: Record<NoteColor, string> = {
              yellow: 'rgba(234, 179, 8, 0.6)', blue: 'rgba(59, 130, 246, 0.6)',
              green: 'rgba(34, 197, 94, 0.6)',  pink: 'rgba(236, 72, 153, 0.6)',
              purple: 'rgba(168, 85, 247, 0.6)', red: 'rgba(239, 68, 68, 0.6)',
            };
            color = noteColorMap[item.color] || color;
          }
          return (
            <div
              key={item.id}
              className="absolute rounded-sm"
              style={{
                left:   (item.position.x - bounds.minX) * minimapScale + panX,
                top:    (item.position.y - bounds.minY) * minimapScale + panY,
                width:  Math.max(4, item.width  * minimapScale),
                height: Math.max(3, item.height * minimapScale),
                backgroundColor: color,
              }}
            />
          );
        })}
        <div onPointerDown={handleViewportPointerDown} style={viewportStyle} />
      </div>
    </div>
  );
};

export default Minimap;
