/**
 * @file useNotecards.ts
 * @description Custom hook for managing the Notecard Canvas's freeform notecards and links.
 * Unlike useStickyNotes, this is a single board (one array pair), not per-canvas.
 */

import { useCallback } from 'react';
import { useImmer } from 'use-immer';
import { createId } from '@/lib/createId';
import type { Notecard, NotecardLink, NotecardTimelineSettings, Position, AppSettings } from '@/types';
import type { CanvasTransform } from '@/hooks/useCanvasInteraction';

export const DEFAULT_NOTECARD_TIMELINE_SETTINGS: NotecardTimelineSettings = {
  slotLabels: {},
};

/** A slot's display label, falling back to "Scene N" (1-indexed) until the user renames it. */
export function getTimelineSlotLabel(settings: NotecardTimelineSettings, slot: number): string {
  return settings.slotLabels[slot] ?? `Scene ${slot + 1}`;
}

export interface UseNotecardsReturn {
  notecards: Notecard[];
  notecardLinks: NotecardLink[];
  timelineSettings: NotecardTimelineSettings;
  setNotecards: (updater: Notecard[] | ((draft: Notecard[]) => void)) => void;
  setNotecardLinks: (updater: NotecardLink[] | ((draft: NotecardLink[]) => void)) => void;
  setTimelineSettings: (updater: NotecardTimelineSettings | ((draft: NotecardTimelineSettings) => void)) => void;
  addNotecard: (initialPosition?: Position) => void;
  updateNotecard: (id: string, data: Partial<Notecard>) => void;
  deleteNotecard: (id: string) => void;
  deleteNotecards: (ids: string[]) => void;
  restoreNotecards: (cards: Notecard[], links: NotecardLink[]) => void;
  addNotecardLink: (fromId: string, toId: string) => void;
  updateNotecardLink: (id: string, data: Partial<NotecardLink>) => void;
  deleteNotecardLink: (id: string) => void;
  renameTimelineSlot: (slot: number, label: string) => void;
  /** Pins a card into `toSlot` at `toIndex` within that column, renormalizing order in both the
   * destination column and (if the card moved between columns) the source column. Used for
   * initial assignment from Unsorted, cross-column moves, and same-column reorders alike. */
  moveNotecardWithinTimeline: (id: string, toSlot: number, toIndex: number) => void;
  /** Unpins a card from the timeline back to freeform Unsorted space, closing the gap in its
   * former column. `position`, if given, becomes the card's new freeform drop position. */
  unassignNotecardFromTimeline: (id: string, position?: Position) => void;
  insertTimelineSlot: (beforeSlot: number) => void;
  deleteTimelineSlot: (slot: number) => void;
}

export interface UseNotecardsParams {
  appSettings: AppSettings;
  notecardCanvasTransform: CanvasTransform;
  onNotecardChange?: () => void;
}

const DEFAULT_WIDTH = 220;
const DEFAULT_HEIGHT = 160;

export function useNotecards(params: UseNotecardsParams): UseNotecardsReturn {
  const { appSettings, notecardCanvasTransform, onNotecardChange } = params;

  const [notecards, setNotecards] = useImmer<Notecard[]>([]);
  const [notecardLinks, setNotecardLinks] = useImmer<NotecardLink[]>([]);
  const [timelineSettings, setTimelineSettings] = useImmer<NotecardTimelineSettings>(DEFAULT_NOTECARD_TIMELINE_SETTINGS);

  const addNotecard = useCallback((initialPosition?: Position) => {
    const id = createId('notecard');
    const width = DEFAULT_WIDTH;
    const height = DEFAULT_HEIGHT;

    let position: Position;
    if (initialPosition) {
      position = { x: initialPosition.x - width / 2, y: initialPosition.y - height / 2 };
    } else {
      const leftOffset = appSettings.isLeftSidebarOpen ? appSettings.leftSidebarWidth : 0;
      const rightOffset = appSettings.isRightSidebarOpen ? appSettings.rightSidebarWidth : 0;
      const topOffset = 64;

      const visibleWidth = window.innerWidth - leftOffset - rightOffset;
      const visibleHeight = window.innerHeight - topOffset;

      const screenCenterX = leftOffset + (visibleWidth / 2);
      const screenCenterY = topOffset + (visibleHeight / 2);

      const worldCenterX = (screenCenterX - notecardCanvasTransform.x) / notecardCanvasTransform.scale;
      const worldCenterY = (screenCenterY - notecardCanvasTransform.y) / notecardCanvasTransform.scale;

      position = { x: worldCenterX - width / 2, y: worldCenterY - height / 2 };
    }

    const newCard: Notecard = { id, title: 'New Notecard', content: '', position, width, height, color: 'yellow' };

    setNotecards(draft => {
      draft.push(newCard);
    });

    onNotecardChange?.();
  }, [appSettings, notecardCanvasTransform, setNotecards, onNotecardChange]);

  const updateNotecard = useCallback((id: string, data: Partial<Notecard>) => {
    setNotecards(draft => {
      const idx = draft.findIndex(n => n.id === id);
      if (idx !== -1) Object.assign(draft[idx], data);
    });
    onNotecardChange?.();
  }, [setNotecards, onNotecardChange]);

  const renameTimelineSlot = useCallback((slot: number, label: string) => {
    setTimelineSettings(draft => { draft.slotLabels[slot] = label; });
    onNotecardChange?.();
  }, [setTimelineSettings, onNotecardChange]);

  // Single primitive behind every Timeline-pane drag outcome: assigning an Unsorted card to a
  // column for the first time, moving a card between columns, and reordering within a column
  // are all "splice this card into toSlot's order at toIndex." Renormalizing both the
  // destination column (0..n-1) and, if the card left a different column, the source column,
  // keeps timelineOrder gap-free and never dependent on stale values from either side.
  const moveNotecardWithinTimeline = useCallback((id: string, toSlot: number, toIndex: number) => {
    setNotecards(draft => {
      const card = draft.find(n => n.id === id);
      if (!card) return;
      const fromSlot = card.timelineSlot;
      card.timelineSlot = toSlot;

      const destCards = draft
        .filter(n => n.timelineSlot === toSlot && n.id !== id)
        .sort((a, b) => (a.timelineOrder ?? 0) - (b.timelineOrder ?? 0));
      destCards.splice(Math.max(0, Math.min(toIndex, destCards.length)), 0, card);
      destCards.forEach((n, i) => { n.timelineOrder = i; });

      if (fromSlot !== undefined && fromSlot !== toSlot) {
        draft
          .filter(n => n.timelineSlot === fromSlot)
          .sort((a, b) => (a.timelineOrder ?? 0) - (b.timelineOrder ?? 0))
          .forEach((n, i) => { n.timelineOrder = i; });
      }
    });
    onNotecardChange?.();
  }, [setNotecards, onNotecardChange]);

  const unassignNotecardFromTimeline = useCallback((id: string, position?: Position) => {
    setNotecards(draft => {
      const card = draft.find(n => n.id === id);
      if (!card) return;
      const fromSlot = card.timelineSlot;
      delete card.timelineSlot;
      delete card.timelineOrder;
      if (position) card.position = position;

      if (fromSlot !== undefined) {
        draft
          .filter(n => n.timelineSlot === fromSlot)
          .sort((a, b) => (a.timelineOrder ?? 0) - (b.timelineOrder ?? 0))
          .forEach((n, i) => { n.timelineOrder = i; });
      }
    });
    onNotecardChange?.();
  }, [setNotecards, onNotecardChange]);

  // Makes room for a new slot at `beforeSlot` by shifting every card and label at or past it
  // up by one. The new slot itself starts empty with the default "Scene N" label.
  const insertTimelineSlot = useCallback((beforeSlot: number) => {
    setNotecards(draft => {
      draft.forEach(card => {
        if (card.timelineSlot !== undefined && card.timelineSlot >= beforeSlot) card.timelineSlot += 1;
      });
    });
    setTimelineSettings(draft => {
      const shifted: Record<number, string> = {};
      Object.entries(draft.slotLabels).forEach(([key, label]) => {
        const idx = Number(key);
        shifted[idx >= beforeSlot ? idx + 1 : idx] = label;
      });
      draft.slotLabels = shifted;
    });
    onNotecardChange?.();
  }, [setNotecards, setTimelineSettings, onNotecardChange]);

  // Removes a slot: cards in it are unassigned (not deleted — they become freeform again),
  // and every card/label past it shifts down by one to close the gap.
  const deleteTimelineSlot = useCallback((slot: number) => {
    setNotecards(draft => {
      draft.forEach(card => {
        if (card.timelineSlot === undefined) return;
        if (card.timelineSlot === slot) delete card.timelineSlot;
        else if (card.timelineSlot > slot) card.timelineSlot -= 1;
      });
    });
    setTimelineSettings(draft => {
      const shifted: Record<number, string> = {};
      Object.entries(draft.slotLabels).forEach(([key, label]) => {
        const idx = Number(key);
        if (idx === slot) return;
        shifted[idx > slot ? idx - 1 : idx] = label;
      });
      draft.slotLabels = shifted;
    });
    onNotecardChange?.();
  }, [setNotecards, setTimelineSettings, onNotecardChange]);

  const deleteNotecard = useCallback((id: string) => {
    setNotecards(draft => {
      const idx = draft.findIndex(n => n.id === id);
      if (idx !== -1) draft.splice(idx, 1);
    });
    setNotecardLinks(draft => {
      for (let i = draft.length - 1; i >= 0; i--) {
        if (draft[i].fromId === id || draft[i].toId === id) draft.splice(i, 1);
      }
    });
    onNotecardChange?.();
  }, [setNotecards, setNotecardLinks, onNotecardChange]);

  const deleteNotecards = useCallback((ids: string[]) => {
    const idSet = new Set(ids);
    setNotecards(draft => {
      for (let i = draft.length - 1; i >= 0; i--) {
        if (idSet.has(draft[i].id)) draft.splice(i, 1);
      }
    });
    setNotecardLinks(draft => {
      for (let i = draft.length - 1; i >= 0; i--) {
        if (idSet.has(draft[i].fromId) || idSet.has(draft[i].toId)) draft.splice(i, 1);
      }
    });
    onNotecardChange?.();
  }, [setNotecards, setNotecardLinks, onNotecardChange]);

  // Re-inserts previously-deleted cards/links verbatim (same ids), so link references and
  // undo semantics stay correct. Used to undo deleteNotecards from the Notecard Canvas's
  // own local undo stack — see NotecardCanvas.tsx.
  const restoreNotecards = useCallback((cards: Notecard[], links: NotecardLink[]) => {
    if (cards.length === 0 && links.length === 0) return;
    setNotecards(draft => {
      draft.push(...cards);
    });
    setNotecardLinks(draft => {
      draft.push(...links);
    });
    onNotecardChange?.();
  }, [setNotecards, setNotecardLinks, onNotecardChange]);

  const addNotecardLink = useCallback((fromId: string, toId: string) => {
    if (fromId === toId) return;
    const id = createId('notecard-link');
    setNotecardLinks(draft => {
      draft.push({ id, fromId, toId });
    });
    onNotecardChange?.();
  }, [setNotecardLinks, onNotecardChange]);

  const updateNotecardLink = useCallback((id: string, data: Partial<NotecardLink>) => {
    setNotecardLinks(draft => {
      const idx = draft.findIndex(l => l.id === id);
      if (idx !== -1) Object.assign(draft[idx], data);
    });
    onNotecardChange?.();
  }, [setNotecardLinks, onNotecardChange]);

  const deleteNotecardLink = useCallback((id: string) => {
    setNotecardLinks(draft => {
      const idx = draft.findIndex(l => l.id === id);
      if (idx !== -1) draft.splice(idx, 1);
    });
    onNotecardChange?.();
  }, [setNotecardLinks, onNotecardChange]);

  return {
    notecards, notecardLinks, timelineSettings, setNotecards, setNotecardLinks, setTimelineSettings,
    addNotecard, updateNotecard, deleteNotecard, deleteNotecards, restoreNotecards,
    addNotecardLink, updateNotecardLink, deleteNotecardLink,
    renameTimelineSlot, moveNotecardWithinTimeline, unassignNotecardFromTimeline,
    insertTimelineSlot, deleteTimelineSlot,
  };
}
