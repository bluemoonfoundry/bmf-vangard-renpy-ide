/**
 * @file NotecardCanvas.tsx
 * @description Notecard Canvas shell: a permanent top/bottom split between the Timeline pane
 * (a Kanban-style row of scene columns, cards ordered by `timelineOrder`) and the Unsorted pane
 * (the original Twine-like freeform scratchpad: pan/zoom, drag/resize, rubber-band select,
 * drag-to-link connectors, minimap). Both panes are independently scrollable and collapsible via
 * a `Sash` divider, mirroring the app's existing split-pane/sidebar-collapse conventions.
 *
 * Card dragging is owned entirely by this shell (not by either pane) because a drag can cross
 * the pane boundary: picking a card up in Unsorted and dropping it on a Timeline column pins it
 * there; dragging a Timeline card down into Unsorted unpins it. Only gestures that never cross
 * the boundary (panning, rubber-band select, zoom, resize, link-drag) stay local to the Unsorted
 * pane's own pointer handlers.
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Notecard from '@/components/Notecard';
import Minimap, { type MinimapItem } from '@/components/Minimap';
import CopyButton from '@/components/CopyButton';
import Sash from '@/components/Sash';
import { renderSanitizedMarkdown } from '@/lib/renderSanitizedMarkdown';
import type { Notecard as NotecardType, NotecardLink, NotecardTimelineSettings, NoteColor, Position } from '@/types';
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
  renameTimelineSlot: (slot: number, label: string) => void;
  moveNotecardWithinTimeline: (id: string, toSlot: number, toIndex: number) => void;
  unassignNotecardFromTimeline: (id: string, position?: Position) => void;
  insertTimelineSlot: (beforeSlot: number) => void;
  deleteTimelineSlot: (slot: number) => void;
  transform: CanvasTransform;
  onTransformChange: React.Dispatch<React.SetStateAction<CanvasTransform>>;
}

const TAB_COLORS: Record<NoteColor, string> = {
  yellow: '#f59e0b', blue: '#3b82f6', green: '#22c55e', pink: '#ec4899', purple: '#a855f7', red: '#ef4444',
};

const MIN_PANE_SIZE = 120;

type InteractionState =
  | { type: 'idle' }
  | { type: 'panning'; startX: number; startY: number; originX: number; originY: number }
  | { type: 'rubber-band'; startWorld: { x: number; y: number } }
  | { type: 'resizing-card'; id: string; startX: number; startY: number; startWidth: number; startHeight: number };

// Bookkeeping for a card drag that might cross the Unsorted/Timeline boundary. Kept in a ref
// (not state) because it's mutated on every pointermove; the parts that need to trigger a
// re-render (which column is being previewed, whether the source card should hide) are
// mirrored into `timelinePreview`/`dragOverTimeline` state alongside it.
interface CardDragBookkeeping {
  cardId: string;
  width: number;
  height: number;
  originSlot: number | undefined;
  unsortedStartClientX: number;
  unsortedStartClientY: number;
  unsortedOriginX: number;
  unsortedOriginY: number;
}

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

const KanbanCard: React.FC<{
  card: NotecardType;
  isDragging: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  updateCard: (id: string, data: Partial<NotecardType>) => void;
  deleteCard: (id: string) => void;
}> = ({ card, isDragging, onPointerDown, onContextMenu, updateCard, deleteCard }) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingBody, setIsEditingBody] = useState(false);
  const [titleDraft, setTitleDraft] = useState(card.title);
  const [bodyDraft, setBodyDraft] = useState(card.content);

  const commitTitle = () => { setIsEditingTitle(false); if (titleDraft !== card.title) updateCard(card.id, { title: titleDraft }); };
  const commitBody = () => { setIsEditingBody(false); if (bodyDraft !== card.content) updateCard(card.id, { content: bodyDraft }); };

  return (
    <div
      data-kanban-card-id={card.id}
      data-testid={`kanban-card-${card.id}`}
      className={`rounded-sm shadow-sm border flex flex-col bg-[#fdfbf3] dark:bg-[#2a2823] border-[#e2d9bd] dark:border-[#4a4638] flex-shrink-0 group ${isDragging ? 'opacity-40' : ''}`}
      onContextMenu={onContextMenu}
    >
      <div
        className="drag-handle h-6 border-b-2 border-red-400/70 dark:border-red-500/60 flex items-center justify-between pl-1.5 pr-1 cursor-grab flex-shrink-0"
        onPointerDown={onPointerDown}
      >
        <div className="relative flex items-center gap-1 min-w-0">
          <button
            className="w-2.5 h-2.5 rounded-full border border-black/20 flex-shrink-0"
            style={{ backgroundColor: TAB_COLORS[card.color] }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setIsColorPickerOpen(o => !o)}
            title="Change Color"
            aria-label="Change notecard color"
          />
          {isColorPickerOpen && (
            <div className="absolute top-4 left-0 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded p-1 flex gap-1 z-50">
              {(Object.keys(TAB_COLORS) as NoteColor[]).map(c => (
                <button
                  key={c}
                  className={`w-3.5 h-3.5 rounded-full border border-gray-300 ${c === card.color ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                  style={{ backgroundColor: TAB_COLORS[c] }}
                  aria-label={c.charAt(0).toUpperCase() + c.slice(1)}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); updateCard(card.id, { color: c }); setIsColorPickerOpen(false); }}
                />
              ))}
            </div>
          )}
          {isEditingTitle ? (
            <input
              autoFocus
              className="bg-transparent text-xs font-semibold min-w-0 flex-1 focus:outline-none"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
              onPointerDown={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className="text-xs font-semibold truncate cursor-text"
              onDoubleClick={(e) => { e.stopPropagation(); setTitleDraft(card.title); setIsEditingTitle(true); }}
            >
              {card.title}
            </span>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); deleteCard(card.id); }}
          onPointerDown={(e) => e.stopPropagation()}
          className="text-black/30 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
          title="Delete Notecard"
          aria-label="Delete notecard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
      </div>
      {isEditingBody ? (
        <textarea
          autoFocus
          className="w-full bg-transparent px-1.5 py-1 resize-none focus:outline-none text-gray-800 dark:text-gray-100 text-xs leading-snug"
          rows={3}
          value={bodyDraft}
          onChange={(e) => setBodyDraft(e.target.value)}
          onBlur={commitBody}
          placeholder="Type a note..."
          onPointerDown={(e) => e.stopPropagation()}
        />
      ) : (
        <div
          className="px-1.5 py-1 text-xs leading-snug prose prose-xs dark:prose-invert max-w-none cursor-text"
          onDoubleClick={(e) => { e.stopPropagation(); setBodyDraft(card.content); setIsEditingBody(true); }}
          onPointerDown={(e) => e.stopPropagation()}
          dangerouslySetInnerHTML={{ __html: card.content ? renderSanitizedMarkdown(card.content) : '<span class="opacity-40">Double-click to add notes…</span>' }}
        />
      )}
    </div>
  );
};

const NotecardCanvas: React.FC<NotecardCanvasProps> = ({
  notecards, notecardLinks, updateNotecard, deleteNotecard, deleteNotecards, restoreNotecards, addNotecard,
  addNotecardLink, updateNotecardLink, deleteNotecardLink,
  timelineSettings, renameTimelineSlot, moveNotecardWithinTimeline, unassignNotecardFromTimeline,
  insertTimelineSlot, deleteTimelineSlot,
  transform, onTransformChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const timelinePaneRef = useRef<HTMLDivElement>(null);
  const columnRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const interactionRef = useRef<InteractionState>({ type: 'idle' });
  const dragRef = useRef<CardDragBookkeeping | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [rubberBandRect, setRubberBandRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  // Local, single-canvas undo stack for bulk-delete only (this app has no app-wide undo
  // for notecards the way blocks[] does via useHistory — see CLAUDE.md's state table).
  const deletedStackRef = useRef<Array<{ cards: NotecardType[]; links: NotecardLink[] }>>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverTimeline, setDragOverTimeline] = useState(false);
  const [timelinePreview, setTimelinePreview] = useState<{ slot: number; order: string[] } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; worldX: number; worldY: number; cardId?: string; slot?: number } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isMatch = (card: NotecardType) =>
    !normalizedQuery || card.title.toLowerCase().includes(normalizedQuery) || card.content.toLowerCase().includes(normalizedQuery);

  const [isTimelinePaneOpen, setIsTimelinePaneOpen] = useState(true);
  const [isUnsortedPaneOpen, setIsUnsortedPaneOpen] = useState(true);
  const [timelinePaneSize, setTimelinePaneSize] = useState(280);

  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setCanvasDimensions({ width: el.clientWidth, height: el.clientHeight });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [isUnsortedPaneOpen]);

  const [linkDraft, setLinkDraft] = useState<{ fromId: string; x: number; y: number } | null>(null);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [labelDraft, setLabelDraft] = useState('');
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [slotLabelDraft, setSlotLabelDraft] = useState('');

  const unsortedNotecards = notecards.filter(c => c.timelineSlot === undefined);

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
    const first = unsortedNotecards.find(isMatch);
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

  // Which Timeline column (if any) a client-space point falls inside, and the insertion index
  // within that column derived from comparing the point's Y against each existing card's
  // midpoint (excluding the card currently being dragged). Returns null when the point isn't
  // over the Timeline pane at all, or the pane is collapsed.
  const hitTestTimeline = useCallback((clientX: number, clientY: number, draggedCardId: string) => {
    if (!isTimelinePaneOpen || !timelinePaneRef.current) return null;
    const paneRect = timelinePaneRef.current.getBoundingClientRect();
    if (clientX < paneRect.left || clientX > paneRect.right || clientY < paneRect.top || clientY > paneRect.bottom) return null;

    for (const [slotStr, el] of Object.entries(columnRefs.current)) {
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (clientX < r.left || clientX > r.right) continue;
      const slot = Number(slotStr);
      const cardEls = Array.from(el.querySelectorAll<HTMLElement>('[data-kanban-card-id]'))
        .filter(ce => ce.getAttribute('data-kanban-card-id') !== draggedCardId);
      let index = cardEls.length;
      for (let i = 0; i < cardEls.length; i++) {
        const cr = cardEls[i].getBoundingClientRect();
        if (clientY < cr.top + cr.height / 2) { index = i; break; }
      }
      return { slot, index };
    }
    return null;
  }, [isTimelinePaneOpen]);

  // Owns every card drag, wherever it starts. While the pointer stays over the Unsorted pane
  // the card just moves freely (today's behavior, unchanged); once it crosses into the Timeline
  // pane's bounds this switches to building a live insertion preview for whichever column is
  // under the pointer, committed to moveNotecardWithinTimeline/unassignNotecardFromTimeline on
  // release. See the file header comment for why this can't live in either pane individually.
  const beginCardDrag = useCallback((card: NotecardType, e: React.PointerEvent) => {
    e.stopPropagation();
    containerRef.current?.focus();
    setSelectedIds(new Set([card.id]));
    setDraggingId(card.id);

    dragRef.current = {
      cardId: card.id,
      width: card.width,
      height: card.height,
      originSlot: card.timelineSlot,
      unsortedStartClientX: e.clientX,
      unsortedStartClientY: e.clientY,
      unsortedOriginX: card.position.x,
      unsortedOriginY: card.position.y,
    };
    const previewRef = { current: null as { slot: number; order: string[] } | null };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const hover = hitTestTimeline(moveEvent.clientX, moveEvent.clientY, drag.cardId);
      if (hover) {
        setDragOverTimeline(true);
        const destExisting = notecards
          .filter(n => n.timelineSlot === hover.slot && n.id !== drag.cardId)
          .sort((a, b) => (a.timelineOrder ?? 0) - (b.timelineOrder ?? 0))
          .map(n => n.id);
        destExisting.splice(Math.max(0, Math.min(hover.index, destExisting.length)), 0, drag.cardId);
        const preview = { slot: hover.slot, order: destExisting };
        previewRef.current = preview;
        setTimelinePreview(preview);
      } else {
        setDragOverTimeline(false);
        previewRef.current = null;
        setTimelinePreview(null);
        const dx = (moveEvent.clientX - drag.unsortedStartClientX) / transform.scale;
        const dy = (moveEvent.clientY - drag.unsortedStartClientY) / transform.scale;
        updateNotecard(drag.cardId, { position: { x: drag.unsortedOriginX + dx, y: drag.unsortedOriginY + dy } });
      }
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      const drag = dragRef.current;
      setDraggingId(null);
      setDragOverTimeline(false);
      setTimelinePreview(null);
      dragRef.current = null;
      if (!drag) return;

      const preview = previewRef.current;
      if (preview) {
        const idx = preview.order.indexOf(drag.cardId);
        moveNotecardWithinTimeline(drag.cardId, preview.slot, idx === -1 ? preview.order.length : idx);
      } else if (drag.originSlot !== undefined) {
        // Dragged a Timeline card down into Unsorted: unpin it and drop it at this point,
        // in Unsorted-pane world space (falls back to its old freeform x/y if the surface
        // isn't currently measurable, e.g. the Unsorted pane is collapsed).
        const rect = surfaceRef.current?.getBoundingClientRect();
        if (rect) {
          const world = toWorld(upEvent.clientX, upEvent.clientY, rect, transform);
          unassignNotecardFromTimeline(drag.cardId, { x: world.x - drag.width / 2, y: world.y - drag.height / 2 });
        } else {
          unassignNotecardFromTimeline(drag.cardId);
        }
      }
      // else: a plain Unsorted-to-Unsorted drag already committed its position live above.
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, [notecards, transform, updateNotecard, moveNotecardWithinTimeline, unassignNotecardFromTimeline, hitTestTimeline]);

  // Each pointerdown handler below defines its own local handlePointerMove/handlePointerUp
  // closures and adds/removes exactly those closures (never a separately-memoized top-level
  // callback), matching the established pattern in StoryCanvas.tsx.
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

    beginCardDrag(card, e);
  }, [transform.scale, updateNotecard, beginCardDrag]);

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
      const idsInRect = unsortedNotecards.filter(c =>
        c.position.x < rect.x + rect.width &&
        c.position.x + c.width > rect.x &&
        c.position.y < rect.y + rect.height &&
        c.position.y + c.height > rect.y,
      ).map(c => c.id);
      setSelectedIds(prev => upEvent.shiftKey ? new Set([...prev, ...idsInRect]) : new Set(idsInRect));
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, [transform, onTransformChange, unsortedNotecards]);

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
  // pane. Requires the container to actually hold focus — see the .focus() calls above.
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
      setSelectedIds(new Set(unsortedNotecards.map(c => c.id)));
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
  }, [selectedIds, notecards, notecardLinks, unsortedNotecards, deleteNotecards, restoreNotecards]);

  const minimapItems: MinimapItem[] = unsortedNotecards.map(card => ({
    id: card.id, position: card.position, width: card.width, height: card.height, type: 'notecard', color: card.color,
  }));

  const usedSlots = notecards.map(c => c.timelineSlot).filter((s): s is number => s !== undefined);
  const maxSlot = usedSlots.length ? Math.max(...usedSlots) : -1;
  // Always show one empty trailing column past the highest occupied slot, so there's
  // somewhere to drop a card to start a new scene.
  const slots = Array.from({ length: maxSlot + 2 }, (_, i) => i);

  const openCardContextMenu = (e: React.MouseEvent, cardId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, worldX: 0, worldY: 0, cardId });
  };

  return (
    <div
      ref={containerRef}
      data-testid="notecard-canvas-root"
      tabIndex={0}
      className="relative w-full h-full flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 focus:outline-none"
      onKeyDown={handleContainerKeyDown}
    >
      {/* Timeline pane (top) */}
      {isTimelinePaneOpen ? (
        <div ref={timelinePaneRef} data-testid="notecard-timeline-pane" style={{ height: timelinePaneSize, flexShrink: 0 }} className="flex flex-col min-h-0 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-2 py-1 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Timeline</span>
            <div className="flex items-center gap-2">
              {usedSlots.length > 0 && (
                <CopyButton text={formatFullTimeline(notecards, timelineSettings)} label="Copy Full Timeline" size="xs" />
              )}
              <button
                onClick={() => setIsTimelinePaneOpen(false)}
                title="Collapse Timeline"
                aria-label="Collapse Timeline"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
              </button>
            </div>
          </div>
          <div data-testid="notecard-timeline-scroll" className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden flex">
            {slots.map(slot => {
              const isPreviewTarget = timelinePreview?.slot === slot;
              const columnCards: NotecardType[] = isPreviewTarget
                ? (timelinePreview!.order.map(id => cardById(id)).filter((c): c is NotecardType => !!c))
                : notecards
                  .filter(c => c.timelineSlot === slot && c.id !== draggingId)
                  .sort((a, b) => (a.timelineOrder ?? 0) - (b.timelineOrder ?? 0));

              return (
                <div
                  key={slot}
                  ref={el => { columnRefs.current[slot] = el; }}
                  data-testid={`timeline-slot-${slot}`}
                  className="flex-shrink-0 w-56 flex flex-col min-h-0 border-r border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-1 px-1.5 py-1 flex-shrink-0">
                    {editingSlot === slot ? (
                      <input
                        autoFocus
                        className="text-xs px-1 py-0.5 rounded border border-indigo-400 bg-white dark:bg-gray-800 w-full"
                        value={slotLabelDraft}
                        onChange={(e) => setSlotLabelDraft(e.target.value)}
                        onBlur={() => { renameTimelineSlot(slot, slotLabelDraft.trim() || getTimelineSlotLabel(timelineSettings, slot)); setEditingSlot(null); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                      />
                    ) : (
                      <>
                        <button
                          className="flex-1 min-w-0 text-left text-xs font-medium px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 truncate hover:bg-indigo-200 dark:hover:bg-indigo-800"
                          onClick={() => { setSlotLabelDraft(getTimelineSlotLabel(timelineSettings, slot)); setEditingSlot(slot); }}
                          onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setContextMenu({ x: e.clientX, y: e.clientY, worldX: 0, worldY: 0, slot }); }}
                        >
                          {getTimelineSlotLabel(timelineSettings, slot)}
                        </button>
                        {usedSlots.includes(slot) && (
                          <div title="Copy this scene's cards">
                            <CopyButton text={formatSlotContent(notecards, slot)} label="" size="xs" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-1.5 p-1.5">
                    {columnCards.map(card => (
                      <KanbanCard
                        key={card.id}
                        card={card}
                        isDragging={draggingId === card.id}
                        onPointerDown={(e) => beginCardDrag(card, e)}
                        onContextMenu={(e) => openCardContextMenu(e, card.id)}
                        updateCard={updateNotecard}
                        deleteCard={deleteNotecard}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-2 py-1 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400">Timeline (collapsed)</span>
          <button
            onClick={() => setIsTimelinePaneOpen(true)}
            title="Expand Timeline"
            aria-label="Expand Timeline"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </button>
        </div>
      )}

      {isTimelinePaneOpen && isUnsortedPaneOpen && (
        <Sash direction="vertical" onDrag={(delta) => setTimelinePaneSize(prev => Math.max(MIN_PANE_SIZE, prev + delta))} />
      )}

      {/* Unsorted pane (bottom) */}
      {isUnsortedPaneOpen ? (
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex items-center justify-between px-2 py-1 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Unsorted</span>
              <input
                type="text"
                placeholder="Search notecards…"
                className="w-56 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsUnsortedPaneOpen(false)}
              title="Collapse Unsorted"
              aria-label="Collapse Unsorted"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
            </button>
          </div>
          <div
            ref={surfaceRef}
            data-testid="notecard-canvas-surface"
            className="relative flex-1 min-h-0 overflow-hidden"
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
                  if (!from || !to || from.timelineSlot !== undefined || to.timelineSlot !== undefined) return null;
                  const fromCenter = cardCenter(from);
                  const toCenter = cardCenter(to);
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
              {rubberBandRect && <RubberBand rect={rubberBandRect} />}
              {unsortedNotecards.filter(c => !(draggingId === c.id && dragOverTimeline)).map(card => (
                <div
                  key={card.id}
                  data-testid={`notecard-${card.id}`}
                  data-notecard-id={card.id}
                  className={isMatch(card) ? '' : 'opacity-30 transition-opacity'}
                  onPointerDown={(e) => handleCardPointerDown(e, card)}
                  onContextMenu={(e) => openCardContextMenu(e, card.id)}
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
            <div className="absolute bottom-4 right-4">
              <Minimap items={minimapItems} transform={transform} canvasDimensions={canvasDimensions} onTransformChange={onTransformChange} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-2 py-1 flex-shrink-0">
          <span className="text-xs text-gray-500 dark:text-gray-400">Unsorted (collapsed)</span>
          <button
            onClick={() => setIsUnsortedPaneOpen(true)}
            title="Expand Unsorted"
            aria-label="Expand Unsorted"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </button>
        </div>
      )}

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
    </div>
  );
};

export default NotecardCanvas;
