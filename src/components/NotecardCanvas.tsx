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
import CopyButton from '@/components/CopyButton';
import type { Notecard as NotecardType, NotecardLink, NotecardTimelineSettings } from '@/types';
import type { CanvasTransform } from '@/hooks/useCanvasInteraction';
import { getTimelineSlotLabel } from '@/hooks/useNotecards';
import { formatCard, formatSlotContent, formatFullTimeline } from '@/lib/notecardTimelineExport';

export interface NotecardCanvasProps {
  notecards: NotecardType[];
  notecardLinks: NotecardLink[];
  updateNotecard: (id: string, data: Partial<NotecardType>) => void;
  deleteNotecard: (id: string) => void;
  deleteNotecards: (ids: string[]) => void;
  restoreNotecards: (cards: NotecardType[], links: NotecardLink[]) => void;
  addNotecard: (position?: { x: number; y: number }) => void;
  addNotecardLink: (fromId: string, toId: string) => void;
  updateNotecardLink: (id: string, data: Partial<NotecardLink>) => void;
  deleteNotecardLink: (id: string) => void;
  timelineSettings: NotecardTimelineSettings;
  toggleTimeline: () => void;
  renameTimelineSlot: (slot: number, label: string) => void;
  snapNotecardToTimeline: (id: string) => void;
  clearNotecardTimelineSlot: (id: string) => void;
  insertTimelineSlot: (beforeSlot: number) => void;
  deleteTimelineSlot: (slot: number) => void;
  transform: CanvasTransform;
  onTransformChange: React.Dispatch<React.SetStateAction<CanvasTransform>>;
}

// World-space distance from the rail a card's center must land within, on drag release, to
// snap onto the timeline. Deliberately generous (a card is ~160-220px tall) so a rough drop
// near the line reads as "on the timeline" without demanding pixel precision.
const TIMELINE_SNAP_BAND = 90;

type InteractionState =
  | { type: 'idle' }
  | { type: 'panning'; startX: number; startY: number; originX: number; originY: number }
  | { type: 'rubber-band'; startWorld: { x: number; y: number } }
  | { type: 'dragging-card'; id: string; startX: number; startY: number; originX: number; originY: number }
  | { type: 'resizing-card'; id: string; startX: number; startY: number; startWidth: number; startHeight: number };

const RubberBand: React.FC<{ rect: { x: number; y: number; width: number; height: number } }> = ({ rect }) => (
  <div
    className="absolute border-2 border-indigo-500 bg-indigo-500 bg-opacity-20 pointer-events-none z-40"
    style={{ left: rect.x, top: rect.y, width: rect.width, height: rect.height }}
  />
);

function toWorld(clientX: number, clientY: number, rect: DOMRect, transform: CanvasTransform) {
  return {
    x: (clientX - rect.left - transform.x) / transform.scale,
    y: (clientY - rect.top - transform.y) / transform.scale,
  };
}

const NotecardCanvas: React.FC<NotecardCanvasProps> = ({
  notecards, notecardLinks, updateNotecard, deleteNotecard, deleteNotecards, restoreNotecards, addNotecard,
  addNotecardLink, updateNotecardLink, deleteNotecardLink,
  timelineSettings, toggleTimeline, renameTimelineSlot, snapNotecardToTimeline, clearNotecardTimelineSlot,
  insertTimelineSlot, deleteTimelineSlot,
  transform, onTransformChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<InteractionState>({ type: 'idle' });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [rubberBandRect, setRubberBandRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  // Local, single-canvas undo stack for bulk-delete only (this app has no app-wide undo
  // for notecards the way blocks[] does via useHistory — see CLAUDE.md's state table).
  // Each entry is the exact set of cards/links removed by one Delete-key press.
  const deletedStackRef = useRef<Array<{ cards: NotecardType[]; links: NotecardLink[] }>>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; worldX: number; worldY: number; cardId?: string; slot?: number } | null>(null);
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
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [slotLabelDraft, setSlotLabelDraft] = useState('');

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

  // Where a ray from a card's center toward `toward` exits the card's rectangle. Cards paint
  // above the link SVG (positioned boxes stack above static ones), so a line drawn all the way
  // to the target's *center* — including its arrowhead — renders completely hidden underneath
  // the card body. Clipping both ends to the card edges puts the arrow in the visible gap
  // between cards instead.
  const cardEdgePoint = useCallback((card: NotecardType, toward: { x: number; y: number }) => {
    const center = cardCenter(card);
    const dx = toward.x - center.x;
    const dy = toward.y - center.y;
    if (dx === 0 && dy === 0) return center;
    const halfW = card.width / 2;
    const halfH = card.height / 2;
    const scaleX = dx !== 0 ? halfW / Math.abs(dx) : Infinity;
    const scaleY = dy !== 0 ? halfH / Math.abs(dy) : Infinity;
    const t = Math.min(scaleX, scaleY);
    return { x: center.x + dx * t, y: center.y + dy * t };
  }, [cardCenter]);

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
    const cardId = (e.target as HTMLElement).closest('[data-notecard-id]')?.getAttribute('data-notecard-id') ?? undefined;
    setContextMenu({ x: e.clientX, y: e.clientY, worldX: world.x, worldY: world.y, cardId });
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
      setSelectedIds(new Set([card.id]));

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

    setSelectedIds(new Set([card.id]));
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
    const handlePointerUp = (upEvent: PointerEvent) => {
      interactionRef.current = { type: 'idle' };
      setDraggingId(null);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      if (timelineSettings.enabled) {
        const dy = (upEvent.clientY - startY) / transform.scale;
        const finalCenterY = originY + dy + card.height / 2;
        const withinBand = Math.abs(finalCenterY - timelineSettings.railY) <= TIMELINE_SNAP_BAND;
        if (withinBand) snapNotecardToTimeline(card.id);
        else if (card.timelineSlot !== undefined) clearNotecardTimelineSlot(card.id);
      }
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, [transform.scale, updateNotecard, timelineSettings, snapNotecardToTimeline, clearNotecardTimelineSlot]);

  const handleSurfacePointerDown = useCallback((e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-notecard-id]') || target.closest('[data-notecard-link-id]')) return;
    containerRef.current?.focus();

    // Ctrl+drag pans; a plain drag on empty canvas rubber-band selects instead (Cmd/Ctrl+A,
    // Delete, and rubber-band selection all needed a modifier-free gesture free for
    // selecting, so panning moved behind Ctrl).
    if (e.ctrlKey) {
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
      return;
    }

    if (!surfaceRef.current) return;
    const startRect = surfaceRef.current.getBoundingClientRect();
    const startWorld = toWorld(e.clientX, e.clientY, startRect, transform);
    const startClientX = e.clientX;
    const startClientY = e.clientY;
    interactionRef.current = { type: 'rubber-band', startWorld };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const r = surfaceRef.current;
      if (!r) return;
      const currentWorld = toWorld(moveEvent.clientX, moveEvent.clientY, r.getBoundingClientRect(), transform);
      setRubberBandRect({
        x: Math.min(startWorld.x, currentWorld.x),
        y: Math.min(startWorld.y, currentWorld.y),
        width: Math.abs(currentWorld.x - startWorld.x),
        height: Math.abs(currentWorld.y - startWorld.y),
      });
    };
    const handlePointerUp = (upEvent: PointerEvent) => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      interactionRef.current = { type: 'idle' };
      setRubberBandRect(null);

      const distance = Math.hypot(upEvent.clientX - startClientX, upEvent.clientY - startClientY);
      if (distance <= 5) {
        setSelectedIds(new Set());
        return;
      }
      const r = surfaceRef.current;
      if (!r) return;
      const endWorld = toWorld(upEvent.clientX, upEvent.clientY, r.getBoundingClientRect(), transform);
      const rect = {
        x: Math.min(startWorld.x, endWorld.x),
        y: Math.min(startWorld.y, endWorld.y),
        width: Math.abs(endWorld.x - startWorld.x),
        height: Math.abs(endWorld.y - startWorld.y),
      };
      const idsInRect = notecards.filter(c =>
        c.position.x < rect.x + rect.width &&
        c.position.x + c.width > rect.x &&
        c.position.y < rect.y + rect.height &&
        c.position.y + c.height > rect.y,
      ).map(c => c.id);
      setSelectedIds(prev => upEvent.shiftKey ? new Set([...prev, ...idsInRect]) : new Set(idsInRect));
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, [transform, onTransformChange, notecards]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!surfaceRef.current) return;
    // Let the wheel scroll a notecard's own (overflow-auto) content instead of zooming the
    // whole canvas when the pointer is over a card.
    if ((e.target as HTMLElement).closest('[data-notecard-id]')) return;
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
  // split-pane NotecardCanvas doesn't steal these keystrokes meant for the foreground
  // pane. Requires the container to actually hold focus — see the .focus() calls in
  // handleSurfacePointerDown/handleCardPointerDown below.
  const handleContainerKeyDown = useCallback((e: React.KeyboardEvent) => {
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
    const isMetaShortcut = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIds.size > 0) {
      e.preventDefault();
      const deletedCards = notecards.filter(c => selectedIds.has(c.id));
      const deletedLinks = notecardLinks.filter(l => selectedIds.has(l.fromId) || selectedIds.has(l.toId));
      deletedStackRef.current.push({ cards: deletedCards, links: deletedLinks });
      deleteNotecards(Array.from(selectedIds));
      setSelectedIds(new Set());
      return;
    }

    if (isMetaShortcut && key === 'a') {
      e.preventDefault();
      setSelectedIds(new Set(notecards.map(c => c.id)));
      return;
    }

    // Undoes only this canvas's own bulk-deletes (see deletedStackRef above), not the
    // app-wide blocks[] undo stack. Stops propagation so App.tsx's window-level Cmd/Ctrl+Z
    // handler (which only knows about blocks[]) doesn't also fire for the same keystroke.
    // If there's nothing local to undo, we deliberately let it bubble so that handler can run.
    if (isMetaShortcut && key === 'z' && !e.shiftKey) {
      const last = deletedStackRef.current.pop();
      if (last) {
        e.preventDefault();
        e.stopPropagation();
        restoreNotecards(last.cards, last.links);
        setSelectedIds(new Set(last.cards.map(c => c.id)));
      }
    }
  }, [selectedIds, notecards, notecardLinks, deleteNotecards, restoreNotecards]);

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
              <marker id="notecard-arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" className="fill-indigo-500" />
              </marker>
            </defs>
            {notecardLinks.map(link => {
              const from = cardById(link.fromId);
              const to = cardById(link.toId);
              if (!from || !to) return null;
              const fromCenter = cardCenter(from);
              const toCenter = cardCenter(to);
              // Clip to card edges, not centers — the target card renders above this SVG, so
              // an arrowhead aimed at its center would be drawn invisibly underneath it.
              const a = cardEdgePoint(from, toCenter);
              const b = cardEdgePoint(to, fromCenter);
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
              const a = cardEdgePoint(from, linkDraft);
              return <line x1={a.x} y1={a.y} x2={linkDraft.x} y2={linkDraft.y} className="stroke-indigo-400" strokeWidth={2} strokeDasharray="4 4" markerEnd="url(#notecard-arrow)" />;
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
          {timelineSettings.enabled && (() => {
            const usedSlots = notecards.map(c => c.timelineSlot).filter((s): s is number => s !== undefined);
            const minSlot = usedSlots.length ? Math.min(...usedSlots, 0) : 0;
            const maxSlot = usedSlots.length ? Math.max(...usedSlots, 3) : 3;
            const fromSlot = minSlot - 1;
            const toSlot = maxSlot + 2;
            const { originX, railY, slotSpacing } = timelineSettings;
            const slots = Array.from({ length: toSlot - fromSlot + 1 }, (_, i) => fromSlot + i);
            return (
              <>
                <div
                  className="absolute h-0.5 bg-indigo-400 dark:bg-indigo-500 opacity-60 pointer-events-none"
                  style={{ left: originX + fromSlot * slotSpacing, top: railY, width: (toSlot - fromSlot) * slotSpacing }}
                />
                {slots.map(slot => (
                  <div key={slot} className="absolute" style={{ left: originX + slot * slotSpacing, top: railY }} data-testid={`timeline-slot-${slot}`}>
                    <div className="w-0.5 h-5 bg-indigo-400 dark:bg-indigo-500 opacity-70 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute left-0 top-3 -translate-x-1/2">
                      {editingSlot === slot ? (
                        <input
                          autoFocus
                          className="text-xs px-1 py-0.5 rounded border border-indigo-400 bg-white dark:bg-gray-800 w-24 text-center"
                          value={slotLabelDraft}
                          onChange={(e) => setSlotLabelDraft(e.target.value)}
                          onBlur={() => { renameTimelineSlot(slot, slotLabelDraft.trim() || getTimelineSlotLabel(timelineSettings, slot)); setEditingSlot(null); }}
                          onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                          onPointerDown={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            className="text-xs px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 whitespace-nowrap hover:bg-indigo-200 dark:hover:bg-indigo-800"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => { setSlotLabelDraft(getTimelineSlotLabel(timelineSettings, slot)); setEditingSlot(slot); }}
                            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setContextMenu({ x: e.clientX, y: e.clientY, worldX: 0, worldY: 0, slot }); }}
                          >
                            {getTimelineSlotLabel(timelineSettings, slot)}
                          </button>
                          {usedSlots.includes(slot) && (
                            <div onPointerDown={(e) => e.stopPropagation()} title="Copy this slot's cards">
                              <CopyButton text={formatSlotContent(notecards, slot)} label="" size="xs" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            );
          })()}
          {rubberBandRect && <RubberBand rect={rubberBandRect} />}
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
                isSelected={selectedIds.has(card.id)}
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
          {contextMenu.slot !== undefined ? (
            <>
              <button
                className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => { insertTimelineSlot(contextMenu.slot as number); setContextMenu(null); }}
              >
                Insert Scene Before
              </button>
              <button
                className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => { insertTimelineSlot((contextMenu.slot as number) + 1); setContextMenu(null); }}
              >
                Insert Scene After
              </button>
              <button
                className="block w-full text-left px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => { deleteTimelineSlot(contextMenu.slot as number); setContextMenu(null); }}
              >
                Delete This Scene
              </button>
            </>
          ) : contextMenu.cardId ? (() => {
            const card = cardById(contextMenu.cardId as string);
            if (!card) return null;
            return (
              <div className="px-1">
                <CopyButton
                  text={formatCard(card)}
                  label="Copy Scene Content"
                  size="xs"
                  className="w-full justify-start"
                />
              </div>
            );
          })() : (
            <button
              className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => { addNotecard({ x: contextMenu.worldX, y: contextMenu.worldY }); setContextMenu(null); }}
            >
              New Notecard
            </button>
          )}
        </div>
      )}

      <div className="absolute top-4 left-4 z-40 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search notecards…"
          className="w-56 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className={`px-2 py-1 text-xs rounded border shadow backdrop-blur-sm ${timelineSettings.enabled
            ? 'bg-indigo-600 border-indigo-600 text-white'
            : 'bg-white/90 dark:bg-gray-800/90 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`}
          onClick={toggleTimeline}
          title="Toggle scene timeline"
          aria-pressed={timelineSettings.enabled}
        >
          Timeline
        </button>
        {timelineSettings.enabled && notecards.some(c => c.timelineSlot !== undefined) && (
          <CopyButton text={formatFullTimeline(notecards, timelineSettings)} label="Copy Full Timeline" size="xs" />
        )}
      </div>

      <div className="absolute bottom-4 right-4">
        <Minimap items={minimapItems} transform={transform} canvasDimensions={canvasDimensions} onTransformChange={onTransformChange} />
      </div>
    </div>
  );
};

export default NotecardCanvas;
