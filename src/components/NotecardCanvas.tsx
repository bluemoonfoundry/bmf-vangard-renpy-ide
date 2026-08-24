/**
 * @file NotecardCanvas.tsx
 * @description Twine-like freeform scratchpad canvas: pan/zoom, create/select/drag/resize
 * notecards, delete via keyboard, minimap. Link-drawing wired in a follow-up task via
 * onStartLinkDrag; search wired in a follow-up task via the toolbar slot below.
 * Structurally mirrors StoryCanvas/RouteCanvas/ChoiceCanvas's self-contained pointer-event
 * state machine — no shared base canvas component exists in this codebase to inherit from.
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Notecard from '@/components/Notecard';
import Minimap, { type MinimapItem } from '@/components/Minimap';
import type { Notecard as NotecardType, NotecardLink } from '@/types';
import type { CanvasTransform } from '@/hooks/useCanvasInteraction';

export interface NotecardCanvasProps {
  notecards: NotecardType[];
  notecardLinks: NotecardLink[];
  updateNotecard: (id: string, data: Partial<NotecardType>) => void;
  deleteNotecard: (id: string) => void;
  addNotecard: (position?: { x: number; y: number }) => void;
  addNotecardLink: (fromId: string, toId: string) => void;
  updateNotecardLink: (id: string, data: Partial<NotecardLink>) => void;
  deleteNotecardLink: (id: string) => void;
  transform: CanvasTransform;
  onTransformChange: React.Dispatch<React.SetStateAction<CanvasTransform>>;
}

type InteractionState =
  | { type: 'idle' }
  | { type: 'panning'; startX: number; startY: number; originX: number; originY: number }
  | { type: 'dragging-card'; id: string; startX: number; startY: number; originX: number; originY: number }
  | { type: 'resizing-card'; id: string; startX: number; startY: number; startWidth: number; startHeight: number };

function toWorld(clientX: number, clientY: number, rect: DOMRect, transform: CanvasTransform) {
  return {
    x: (clientX - rect.left - transform.x) / transform.scale,
    y: (clientY - rect.top - transform.y) / transform.scale,
  };
}

const NotecardCanvas: React.FC<NotecardCanvasProps> = ({
  notecards, notecardLinks, updateNotecard, deleteNotecard, addNotecard,
  addNotecardLink, updateNotecardLink, deleteNotecardLink,
  transform, onTransformChange,
}) => {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<InteractionState>({ type: 'idle' });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; worldX: number; worldY: number } | null>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setCanvasDimensions({ width: el.clientWidth, height: el.clientHeight });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // eslint-disable-next-line no-unused-vars
  const startLinkDrag = useCallback((_cardId: string, _clientX: number, _clientY: number) => {
    // Wired up in the link-drawing task; intentionally a no-op stub until then.
  }, []);

  const handleSurfaceDoubleClick = useCallback((e: React.MouseEvent) => {
    if (!surfaceRef.current) return;
    const rect = surfaceRef.current.getBoundingClientRect();
    const world = toWorld(e.clientX, e.clientY, rect, transform);
    addNotecard(world);
  }, [addNotecard, transform]);

  const handleSurfaceContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!surfaceRef.current) return;
    const rect = surfaceRef.current.getBoundingClientRect();
    const world = toWorld(e.clientX, e.clientY, rect, transform);
    setContextMenu({ x: e.clientX, y: e.clientY, worldX: world.x, worldY: world.y });
  }, [transform]);

  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    window.addEventListener('pointerdown', close);
    return () => window.removeEventListener('pointerdown', close);
  }, [contextMenu]);

  const handleCardPointerDown = useCallback((e: React.PointerEvent, card: NotecardType) => {
    const target = e.target as HTMLElement;
    if (target.closest('.resize-handle')) {
      e.stopPropagation();
      interactionRef.current = { type: 'resizing-card', id: card.id, startX: e.clientX, startY: e.clientY, startWidth: card.width, startHeight: card.height };
      setSelectedId(card.id);
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return;
    }
    if (target.closest('.link-handle')) return; // handled by Notecard's onStartLinkDrag
    setSelectedId(card.id);
    if (!target.closest('.drag-handle')) return;
    e.stopPropagation();
    interactionRef.current = { type: 'dragging-card', id: card.id, startX: e.clientX, startY: e.clientY, originX: card.position.x, originY: card.position.y };
    setSelectedId(card.id);
    setDraggingId(card.id);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transform.scale]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const state = interactionRef.current;
    if (state.type === 'panning') {
      onTransformChange(t => ({ ...t, x: state.originX + (e.clientX - state.startX), y: state.originY + (e.clientY - state.startY) }));
    } else if (state.type === 'dragging-card') {
      const dx = (e.clientX - state.startX) / transform.scale;
      const dy = (e.clientY - state.startY) / transform.scale;
      updateNotecard(state.id, { position: { x: state.originX + dx, y: state.originY + dy } });
    } else if (state.type === 'resizing-card') {
      const dx = (e.clientX - state.startX) / transform.scale;
      const dy = (e.clientY - state.startY) / transform.scale;
      updateNotecard(state.id, { width: Math.max(140, state.startWidth + dx), height: Math.max(100, state.startHeight + dy) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transform.scale, updateNotecard, onTransformChange]);

  const handlePointerUp = useCallback(() => {
    interactionRef.current = { type: 'idle' };
    setDraggingId(null);
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSurfacePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.target !== surfaceRef.current) return;
    setSelectedId(null);
    interactionRef.current = { type: 'panning', startX: e.clientX, startY: e.clientY, originX: transform.x, originY: transform.y };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, [transform.x, transform.y, handlePointerMove, handlePointerUp]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
      if (selectedId) deleteNotecard(selectedId);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedId, deleteNotecard]);

  const minimapItems: MinimapItem[] = notecards.map(card => ({
    id: card.id, position: card.position, width: card.width, height: card.height, type: 'notecard', color: card.color,
  }));

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div
        ref={surfaceRef}
        data-testid="notecard-canvas-surface"
        className="absolute inset-0"
        onDoubleClick={handleSurfaceDoubleClick}
        onContextMenu={handleSurfaceContextMenu}
        onPointerDown={handleSurfacePointerDown}
      >
        <div className="absolute inset-0" style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: '0 0' }}>
          {notecards.map(card => (
            <div key={card.id} data-testid={`notecard-${card.id}`} onPointerDown={(e) => handleCardPointerDown(e, card)}>
              <Notecard
                card={card}
                updateCard={updateNotecard}
                deleteCard={deleteNotecard}
                isSelected={selectedId === card.id}
                isDragging={draggingId === card.id}
                onStartLinkDrag={startLinkDrag}
              />
            </div>
          ))}
        </div>
      </div>

      {contextMenu && (
        <div
          className="absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg py-1"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => { addNotecard({ x: contextMenu.worldX, y: contextMenu.worldY }); setContextMenu(null); }}
          >
            New Notecard
          </button>
        </div>
      )}

      <div className="absolute bottom-4 right-4">
        <Minimap items={minimapItems} transform={transform} canvasDimensions={canvasDimensions} onTransformChange={onTransformChange} />
      </div>
    </div>
  );
};

export default NotecardCanvas;
