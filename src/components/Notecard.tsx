/**
 * @file Notecard.tsx
 * @description Draggable, resizable, colorable card rendered on NotecardCanvas, styled as a
 * traditional index card (cream paper, red top rule) rather than
 * StickyNote.tsx's solid-color post-it look, so the two canvases read as visually distinct at
 * a glance. The per-note color still exists (picker, persisted field) but shows up as a
 * left-edge tab stripe instead of a full-card color wash.
 */

import React, { useState, forwardRef } from 'react';
import { renderSanitizedMarkdown } from '@/lib/renderSanitizedMarkdown';
import type { Notecard as NotecardType, NoteColor } from '@/types';

interface NotecardProps {
  card: NotecardType;
  updateCard: (id: string, data: Partial<NotecardType>) => void;
  deleteCard: (id: string) => void;
  isSelected: boolean;
  isDragging: boolean;
  onStartLinkDrag: (cardId: string, clientX: number, clientY: number) => void;
}

// Solid, medium-saturation swatches for the left tab stripe and color-picker toggle — needs to
// read clearly as a small accent against the cream/dark paper background in both themes.
const TAB_COLORS: Record<NoteColor, string> = {
  yellow: '#f59e0b', blue: '#3b82f6', green: '#22c55e', pink: '#ec4899', purple: '#a855f7', red: '#ef4444',
};

const PAPER_BG = 'bg-[#fdfbf3] dark:bg-[#2a2823]';

const Notecard = React.memo(forwardRef<HTMLDivElement, NotecardProps>(({ card, updateCard, deleteCard, isSelected, isDragging, onStartLinkDrag }, ref) => {
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
      className={`notecard-wrapper absolute rounded-sm shadow-md border flex flex-col transition-shadow duration-200 group border-[#e2d9bd] dark:border-[#4a4638] ${isSelected ? 'ring-2 ring-indigo-500 z-30' : 'z-20'} ${isDragging ? 'shadow-xl opacity-90' : ''}`}
      style={{ left: card.position.x, top: card.position.y, width: card.width, height: card.height }}
    >
      <div
        className="absolute inset-y-0 left-0 w-1 rounded-l-sm pointer-events-none"
        style={{ backgroundColor: TAB_COLORS[card.color] }}
      />
      <div className={`drag-handle h-7 ${PAPER_BG} rounded-t-sm border-b-2 border-red-400/70 dark:border-red-500/60 flex items-center justify-between pl-3 pr-2 cursor-grab flex-shrink-0 group`}>
        <div className="relative flex items-center gap-1 min-w-0">
          <button
            className="w-3 h-3 rounded-full border border-black/20 hover:scale-125 transition-transform flex-shrink-0"
            style={{ backgroundColor: TAB_COLORS[card.color] }}
            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
            title="Change Color"
            aria-label="Change notecard color"
          />
          {isColorPickerOpen && (
            <div className="absolute top-5 left-0 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded p-1 flex gap-1 z-50">
              {(Object.keys(TAB_COLORS) as NoteColor[]).map(c => (
                <button
                  key={c}
                  className={`w-4 h-4 rounded-full border border-gray-300 ${c === card.color ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                  style={{ backgroundColor: TAB_COLORS[c] }}
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
          className={`w-full h-full ${PAPER_BG} rounded-b-sm pl-3 pr-2 py-2 resize-none focus:outline-none text-gray-800 dark:text-gray-100 text-sm leading-relaxed`}
          value={bodyDraft}
          onChange={(e) => setBodyDraft(e.target.value)}
          onBlur={commitBody}
          placeholder="Type a note..."
          onPointerDown={(e) => e.stopPropagation()}
        />
      ) : (
        <div
          className={`w-full h-full overflow-auto ${PAPER_BG} rounded-b-sm pl-3 pr-2 py-2 text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none cursor-text`}
          onDoubleClick={(e) => { e.stopPropagation(); setBodyDraft(card.content); setIsEditingBody(true); }}
          onPointerDown={(e) => e.stopPropagation()}
          dangerouslySetInnerHTML={{ __html: card.content ? renderSanitizedMarkdown(card.content) : '<span class="opacity-40">Double-click to add notes…</span>' }}
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
