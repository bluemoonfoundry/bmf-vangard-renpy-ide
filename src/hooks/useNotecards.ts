/**
 * @file useNotecards.ts
 * @description Custom hook for managing the Notecard Canvas's freeform notecards and links.
 * Unlike useStickyNotes, this is a single board (one array pair), not per-canvas.
 */

import { useCallback } from 'react';
import { useImmer } from 'use-immer';
import { createId } from '@/lib/createId';
import type { Notecard, NotecardLink, Position, AppSettings } from '@/types';
import type { CanvasTransform } from '@/hooks/useCanvasInteraction';

export interface UseNotecardsReturn {
  notecards: Notecard[];
  notecardLinks: NotecardLink[];
  setNotecards: (updater: Notecard[] | ((draft: Notecard[]) => void)) => void;
  setNotecardLinks: (updater: NotecardLink[] | ((draft: NotecardLink[]) => void)) => void;
  addNotecard: (initialPosition?: Position) => void;
  updateNotecard: (id: string, data: Partial<Notecard>) => void;
  deleteNotecard: (id: string) => void;
  addNotecardLink: (fromId: string, toId: string) => void;
  updateNotecardLink: (id: string, data: Partial<NotecardLink>) => void;
  deleteNotecardLink: (id: string) => void;
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
    notecards, notecardLinks, setNotecards, setNotecardLinks,
    addNotecard, updateNotecard, deleteNotecard,
    addNotecardLink, updateNotecardLink, deleteNotecardLink,
  };
}
