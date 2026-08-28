/**
 * @file Notecard.tsx
 * @description Draggable, resizable, colorable card rendered on NotecardCanvas.
 * Mirrors StickyNote.tsx's structure (six color themes, inline edit, color popover,
 * delete, resize handle) plus a title field and a link-drag connector handle.
 */

import React, { useState, forwardRef } from 'react';
import { marked } from 'marked';
import type { Notecard as NotecardType, NoteColor } from '@/types';

interface NotecardProps {
  card: NotecardType;
  updateCard: (id: string, data: Partial<NotecardType>) => void;
  deleteCard: (id: string) => void;
  isSelected: boolean;
  isDragging: boolean;
  onStartLinkDrag: (cardId: string, clientX: number, clientY: number) => void;
}

const COLORS: Record<NoteColor, { bg: string; header: string; border: string }> = {
  yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/80', header: 'bg-yellow-200 dark:bg-yellow-800/80', border: 'border-yellow-300 dark:border-yellow-700' },
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/80', header: 'bg-blue-200 dark:bg-blue-800/80', border: 'border-blue-300 dark:border-blue-700' },
  green: { bg: 'bg-green-100 dark:bg-green-900/80', header: 'bg-green-200 dark:bg-green-800/80', border: 'border-green-300 dark:border-green-700' },
  pink: { bg: 'bg-pink-100 dark:bg-pink-900/80', header: 'bg-pink-200 dark:bg-pink-800/80', border: 'border-pink-300 dark:border-pink-700' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/80', header: 'bg-purple-200 dark:bg-purple-800/80', border: 'border-purple-300 dark:border-purple-700' },
  red: { bg: 'bg-red-100 dark:bg-red-900/80', header: 'bg-red-200 dark:bg-red-800/80', border: 'border-red-300 dark:border-red-700' },
};

const SWATCH_PREVIEW: Record<NoteColor, string> = {
  yellow: '#fef3c7', blue: '#dbeafe', green: '#dcfce7', pink: '#fce7f3', purple: '#f3e8ff', red: '#fee2e2',
};

const Notecard = React.memo(forwardRef<HTMLDivElement, NotecardProps>(({ card, updateCard, deleteCard, isSelected, isDragging, onStartLinkDrag }, ref) => {
  const styles = COLORS[card.color];
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingBody, setIsEditingBody] = useState(false);
  const [titleDraft, setTitleDraft] = useState(card.title);
  const [bodyDraft, setBodyDraft] = useState(card.content);

  const handleColorChange = (color: NoteColor) => {
    updateCard(card.id, { color });
    setIsColorPickerOpen(false);
  };

  const commitTitle = () => {
    setIsEditingTitle(false);
    if (titleDraft !== card.title) updateCard(card.id, { title: titleDraft });
  };

  const commitBody = () => {
    setIsEditingBody(false);
    if (bodyDraft !== card.content) updateCard(card.id, { content: bodyDraft });
  };

  return (
    <div
      ref={ref}
      data-notecard-id={card.id}
      className={`notecard-wrapper absolute rounded-lg shadow-lg border-2 flex flex-col transition-shadow duration-200 group ${styles.bg} ${styles.border} ${isSelected ? 'ring-2 ring-indigo-500 z-30' : 'z-20'} ${isDragging ? 'shadow-xl opacity-90' : ''}`}
      style={{ left: card.position.x, top: card.position.y, width: card.width, height: card.height }}
    >
      <div className={`drag-handle h-7 ${styles.header} rounded-t-md flex items-center justify-between px-2 cursor-grab flex-shrink-0 group`}>
        <div className="relative flex items-center gap-1 min-w-0">
          <button
            className="w-3 h-3 rounded-full border border-black/10 hover:scale-125 transition-transform flex-shrink-0"
            style={{ backgroundColor: 'currentColor', opacity: 0.5 }}
            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
            title="Change Color"
            aria-label="Change notecard color"
          />
          {isColorPickerOpen && (
            <div className="absolute top-5 left-0 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded p-1 flex gap-1 z-50">
              {(Object.keys(COLORS) as NoteColor[]).map(c => (
                <button
                  key={c}
                  className={`w-4 h-4 rounded-full border border-gray-300 ${c === card.color ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                  style={{ backgroundColor: SWATCH_PREVIEW[c] }}
                  aria-label={c.charAt(0).toUpperCase() + c.slice(1)}
                  onClick={(e) => { e.stopPropagation(); handleColorChange(c); }}
                />
              ))}
            </div>
          )}
          {isEditingTitle ? (
            <input
              autoFocus
              className="bg-transparent text-sm font-semibold min-w-0 flex-1 focus:outline-none"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
              onPointerDown={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className="text-sm font-semibold truncate cursor-text"
              onDoubleClick={(e) => { e.stopPropagation(); setTitleDraft(card.title); setIsEditingTitle(true); }}
            >
              {card.title}
            </span>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); deleteCard(card.id); }}
          className="text-black/30 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
          title="Delete Notecard"
          aria-label="Delete notecard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
      </div>

      {isEditingBody ? (
        <textarea
          autoFocus
          className="w-full h-full bg-transparent p-2 resize-none focus:outline-none text-gray-800 dark:text-gray-100 text-sm leading-relaxed"
          value={bodyDraft}
          onChange={(e) => setBodyDraft(e.target.value)}
          onBlur={commitBody}
          placeholder="Type a note..."
          onPointerDown={(e) => e.stopPropagation()}
        />
      ) : (
        <div
          className="w-full h-full overflow-auto p-2 text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none cursor-text"
          onDoubleClick={(e) => { e.stopPropagation(); setBodyDraft(card.content); setIsEditingBody(true); }}
          onPointerDown={(e) => e.stopPropagation()}
          dangerouslySetInnerHTML={{ __html: card.content ? marked.parse(card.content, { async: false }) as string : '<span class="opacity-40">Double-click to add notes…</span>' }}
        />
      )}

      <div
        className="link-handle absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 rounded-full bg-indigo-500 border-2 border-white dark:border-gray-800 cursor-crosshair opacity-0 group-hover:opacity-100 hover:opacity-100"
        style={{ zIndex: 3 }}
        title="Drag to link to another notecard"
        onPointerDown={(e) => { e.stopPropagation(); onStartLinkDrag(card.id, e.clientX, e.clientY); }}
      />
      <div className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize" style={{ zIndex: 2 }} />
    </div>
  );
}));

Notecard.displayName = 'Notecard';

export default Notecard;
