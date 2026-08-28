/**
 * @file NotecardCanvas.tsx
 * @description Twine-like freeform scratchpad canvas: pan/zoom, create/select/drag/resize
 * notecards, delete via keyboard, minimap, drag-to-link connectors with an SVG overlay and
 * a click-to-edit label popup. Search wired in a follow-up task via the toolbar slot below.
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
  const containerRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<InteractionState>({ type: 'idle' });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; worldX: number; worldY: number } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isMatch = (card: NotecardType) =>
    !normalizedQuery || card.title.toLowerCase().includes(normalizedQuery) || card.content.toLowerCase().includes(normalizedQuery);

  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setCanvasDimensions({ width: el.clientWidth, height: el.clientHeight });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [linkDraft, setLinkDraft] = useState<{ fromId: string; x: number; y: number } | null>(null);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [labelDraft, setLabelDraft] = useState('');

  const startLinkDrag = useCallback((cardId: string, clientX: number, clientY: number) => {
    if (!surfaceRef.current) return;
    const rect = surfaceRef.current.getBoundingClientRect();
    const world = toWorld(clientX, clientY, rect, transform);
    setLinkDraft({ fromId: cardId, x: world.x, y: world.y });

    const onMove = (e: PointerEvent) => {
      const r = surfaceRef.current;
      if (!r) return;
      const w = toWorld(e.clientX, e.clientY, r.getBoundingClientRect(), transform);
      setLinkDraft(prev => (prev ? { ...prev, x: w.x, y: w.y } : prev));
    };
    const onUp = (e: PointerEvent) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      const target = e.target as HTMLElement | null;
      const targetCardEl = target?.closest('[data-notecard-id]') as HTMLElement | null;
      const toId = targetCardEl?.getAttribute('data-notecard-id');
      setLinkDraft(null);
      if (toId && toId !== cardId) addNotecardLink(cardId, toId);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [transform, addNotecardLink]);

  const cardCenter = useCallback((card: NotecardType) => ({ x: card.position.x + card.width / 2, y: card.position.y + card.height / 2 }), []);
  const cardById = useCallback((id: string) => notecards.find(c => c.id === id), [notecards]);

  const handleSurfaceDoubleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-notecard-id]') || target.closest('[data-notecard-link-id]')) return;
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
    const close = (e: PointerEvent) => {
      if (contextMenuRef.current && contextMenuRef.current.contains(e.target as Node)) return;
      setContextMenu(null);
    };
    window.addEventListener('pointerdown', close);
    return () => window.removeEventListener('pointerdown', close);
  }, [contextMenu]);

  useEffect(() => {
    if (!normalizedQuery) return;
    const first = notecards.find(isMatch);
    if (!first || !canvasDimensions.width || !canvasDimensions.height) return;
    const centerX = first.position.x + first.width / 2;
    const centerY = first.position.y + first.height / 2;
    onTransformChange(t => ({
      ...t,
      x: canvasDimensions.width / 2 - centerX * t.scale,
      y: canvasDimensions.height / 2 - centerY * t.scale,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedQuery]);

  // Each pointerdown handler below defines its own local handlePointerMove/handlePointerUp
  // closures and adds/removes exactly those closures (never a separately-memoized
  // top-level callback). This guarantees add and remove always reference the identical
  // function instance even if transform.scale (or other deps) changes mid-gesture —
  // matching the established pattern in StoryCanvas.tsx. A prior version used top-level
  // useCallbacks for these, which could leak a stale pointermove listener if the memoized
  // identity drifted between pointerdown and pointerup (e.g. a zoom mid-drag).
  const handleCardPointerDown = useCallback((e: React.PointerEvent, card: NotecardType) => {
    const target = e.target as HTMLElement;
    containerRef.current?.focus();

    if (target.closest('.resize-handle')) {
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = card.width;
      const startHeight = card.height;
      interactionRef.current = { type: 'resizing-card', id: card.id, startX, startY, startWidth, startHeight };
      setSelectedId(card.id);

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const dx = (moveEvent.clientX - startX) / transform.scale;
        const dy = (moveEvent.clientY - startY) / transform.scale;
        updateNotecard(card.id, { width: Math.max(140, startWidth + dx), height: Math.max(100, startHeight + dy) });
      };
      const handlePointerUp = () => {
        interactionRef.current = { type: 'idle' };
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return;
    }

    if (target.closest('.link-handle')) return; // handled by Notecard's onStartLinkDrag

    setSelectedId(card.id);
    if (!target.closest('.drag-handle')) return;

    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const originX = card.position.x;
    const originY = card.position.y;
    interactionRef.current = { type: 'dragging-card', id: card.id, startX, startY, originX, originY };
    setDraggingId(card.id);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dx = (moveEvent.clientX - startX) / transform.scale;
      const dy = (moveEvent.clientY - startY) / transform.scale;
      updateNotecard(card.id, { position: { x: originX + dx, y: originY + dy } });
    };
    const handlePointerUp = () => {
      interactionRef.current = { type: 'idle' };
      setDraggingId(null);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, [transform.scale, updateNotecard]);

  const handleSurfacePointerDown = useCallback((e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-notecard-id]') || target.closest('[data-notecard-link-id]')) return;
    containerRef.current?.focus();
    setSelectedId(null);
    const startX = e.clientX;
    const startY = e.clientY;
    const originX = transform.x;
    const originY = transform.y;
    interactionRef.current = { type: 'panning', startX, startY, originX, originY };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      onTransformChange(t => ({ ...t, x: originX + (moveEvent.clientX - startX), y: originY + (moveEvent.clientY - startY) }));
    };
    const handlePointerUp = () => {
      interactionRef.current = { type: 'idle' };
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, [transform.x, transform.y, onTransformChange]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!surfaceRef.current) return;
    e.preventDefault();
    const rect = surfaceRef.current.getBoundingClientRect();
    const pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const sensitivity = 1.0;
    const direction = 1;
    onTransformChange(t => {
      const zoom = 1 - e.deltaY * 0.002 * sensitivity * direction;
      const newScale = Math.max(0.2, Math.min(3, t.scale * zoom));
      const worldX = (pointer.x - t.x) / t.scale;
      const worldY = (pointer.y - t.y) / t.scale;
      const newX = pointer.x - worldX * newScale;
      const newY = pointer.y - worldY * newScale;
      return { x: newX, y: newY, scale: newScale };
    });
  }, [onTransformChange]);

  // Scoped to this instance's own container (not window) so a background/inactive
  // split-pane NotecardCanvas doesn't steal Delete keystrokes meant for the foreground
  // pane. Requires the container to actually hold focus — see the .focus() calls in
  // handleSurfacePointerDown/handleCardPointerDown below.
  const handleContainerKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Delete' && e.key !== 'Backspace') return;
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
    if (selectedId) deleteNotecard(selectedId);
  }, [selectedId, deleteNotecard]);

  const minimapItems: MinimapItem[] = notecards.map(card => ({
    id: card.id, position: card.position, width: card.width, height: card.height, type: 'notecard', color: card.color,
  }));

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="relative w-full h-full overflow-hidden bg-gray-50 dark:bg-gray-900 focus:outline-none"
      onKeyDown={handleContainerKeyDown}
    >
      <div
        ref={surfaceRef}
        data-testid="notecard-canvas-surface"
        className="absolute inset-0"
        onDoubleClick={handleSurfaceDoubleClick}
        onContextMenu={handleSurfaceContextMenu}
        onPointerDown={handleSurfacePointerDown}
        onWheel={handleWheel}
      >
        <div className="absolute inset-0" style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: '0 0' }}>
          <svg className="absolute overflow-visible pointer-events-none" style={{ left: 0, top: 0, width: 1, height: 1 }}>
            <defs>
              <marker id="notecard-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" className="fill-indigo-500" />
              </marker>
            </defs>
            {notecardLinks.map(link => {
              const from = cardById(link.fromId);
              const to = cardById(link.toId);
              if (!from || !to) return null;
              const a = cardCenter(from);
              const b = cardCenter(to);
              const midX = (a.x + b.x) / 2;
              const midY = (a.y + b.y) / 2;
              return (
                <g
                  key={link.id}
                  data-notecard-link-id={link.id}
                  data-testid={`notecard-link-${link.id}`}
                  className="pointer-events-auto cursor-pointer"
                  onDoubleClick={() => { setLabelDraft(link.label ?? ''); setEditingLinkId(link.id); }}
                >
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="stroke-indigo-500" strokeWidth={2} markerEnd="url(#notecard-arrow)" />
                  {link.label && (
                    <text x={midX} y={midY - 6} className="fill-indigo-700 dark:fill-indigo-300 text-xs" textAnchor="middle">{link.label}</text>
                  )}
                </g>
              );
            })}
            {linkDraft && (() => {
              const from = cardById(linkDraft.fromId);
              if (!from) return null;
              const a = cardCenter(from);
              return <line x1={a.x} y1={a.y} x2={linkDraft.x} y2={linkDraft.y} className="stroke-indigo-400" strokeWidth={2} strokeDasharray="4 4" />;
            })()}
          </svg>
          {editingLinkId && (() => {
            const link = notecardLinks.find(l => l.id === editingLinkId);
            if (!link) return null;
            const from = cardById(link.fromId);
            const to = cardById(link.toId);
            if (!from || !to) return null;
            const a = cardCenter(from);
            const b = cardCenter(to);
            return (
              <input
                autoFocus
                className="absolute z-40 text-xs px-1 py-0.5 rounded border border-indigo-400 bg-white dark:bg-gray-800"
                placeholder="Link label…"
                style={{ left: (a.x + b.x) / 2, top: (a.y + b.y) / 2 }}
                value={labelDraft}
                onChange={(e) => setLabelDraft(e.target.value)}
                onBlur={() => { updateNotecardLink(editingLinkId, { label: labelDraft }); setEditingLinkId(null); }}
                onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
              />
            );
          })()}
          {notecards.map(card => (
            <div
              key={card.id}
              data-testid={`notecard-${card.id}`}
              data-notecard-id={card.id}
              className={isMatch(card) ? '' : 'opacity-30 transition-opacity'}
              onPointerDown={(e) => handleCardPointerDown(e, card)}
            >
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
          ref={contextMenuRef}
          className="fixed z-[9999] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg py-1"
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

      <div className="absolute top-4 left-4 z-40">
        <input
          type="text"
          placeholder="Search notecards…"
          className="w-56 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="absolute bottom-4 right-4">
        <Minimap items={minimapItems} transform={transform} canvasDimensions={canvasDimensions} onTransformChange={onTransformChange} />
      </div>
    </div>
  );
};

export default NotecardCanvas;
