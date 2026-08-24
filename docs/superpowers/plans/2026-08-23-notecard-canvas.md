# Notecard Canvas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fourth canvas tab — "Notecard Canvas" — a Twine-like freeform board where users create, edit, resize, recolor, delete, and directionally link notecards, with its own minimap and local search, persisted in `game/project.ide.json` alongside the existing canvas data.

**Architecture:** Follows the codebase's established per-canvas pattern (no shared base canvas component exists): a new `NotecardCanvas.tsx` owns its own pointer-event interaction state machine and pans/zooms via `useCanvasInteraction`, a new `useNotecards.ts` hook owns `notecards`/`notecardLinks` state via `useImmer`, and persistence reuses the existing `ProjectSettings`/`ProjectSnapshot` round-trip (`useProjectIO.ts` → `game/project.ide.json` → `projectSerializer.ts` → `useProjectLoad.ts`) exactly like `stickyNotes` does today.

**Tech Stack:** React + TypeScript, `use-immer`, native pointer events (no drag libraries), `marked` for markdown rendering, Vitest + Testing Library, Electron IPC (no new IPC needed — reuses existing `fs:writeFile`/project load path).

**Spec:** `docs/superpowers/specs/2026-08-23-notecard-canvas-design.md`

## Global Constraints

- Notecards/links must NEVER be read or written by the analysis worker, diagnostics engine, or `.rpy` file I/O — they are pure IDE scratchpad data.
- Reuse the existing 6-value `NoteColor` enum (`yellow|blue|green|pink|purple|red`) for notecard color — no free hex picker.
- Persist via the existing `game/project.ide.json` round-trip (`ProjectSettings`/`ProjectSnapshot`) — no new sidecar file, no new IPC handlers.
- Follow the `@/` import alias convention; no relative `../` imports.
- All new/updated state mutation goes through `useImmer` drafts, never direct mutation.
- Match existing component conventions: `forwardRef` + `React.memo` for canvas-item components, `.drag-handle` / `.resize-handle` class-based hit detection.

---

## Task 1: Types, `ProjectSettings`/`ProjectSnapshot` plumbing, and sample-data factories

**Files:**
- Modify: `src/types.ts` (add `Notecard`, `NotecardLink`; extend `EditorTab['type']`, `ProjectSettings`, `PersistedProjectSettings` omit-list is unaffected since notecards will NOT be in the persisted-slice omit list the same way stickyNotes is — see Interfaces below; extend `ProjectSnapshot`)
- Modify: `src/lib/projectSerializer.ts` (`deserializeProjectData`, ~line 165–279)
- Modify: `src/test/mocks/sampleData.ts` (add `createNotecard()`, `createNotecardLink()` factories)
- Test: `src/lib/projectSerializer.test.ts` (extend existing round-trip coverage if present, else add a focused case)

**Interfaces:**
- Produces: `Notecard { id: string; title: string; content: string; position: Position; width: number; height: number; color: NoteColor }`
- Produces: `NotecardLink { id: string; fromId: string; toId: string; label?: string }`
- Produces: `EditorTab['type']` gains `'notecard-canvas'`
- Produces: `ProjectSettings.notecards?: Notecard[]`, `ProjectSettings.notecardLinks?: NotecardLink[]`
- Produces: `ProjectSnapshot.notecards: Notecard[]`, `ProjectSnapshot.notecardLinks: NotecardLink[]` (always arrays, defaulted to `[]` like `stickyNotes`)
- Produces (test-only): `createNotecard(overrides?: Partial<Notecard>): Notecard`, `createNotecardLink(overrides?: Partial<NotecardLink>): NotecardLink`

- [ ] **Step 1: Add `Notecard`/`NotecardLink` types to `src/types.ts`**

Add directly below the existing `StickyNote` interface (after line 89):

```ts
/**
 * Represents a freeform notecard on the Notecard Canvas — an unstructured
 * scratchpad element, never parsed or referenced by Ren'Py analysis.
 * @interface Notecard
 */
export interface Notecard {
  id: string;
  title: string;
  content: string;
  position: Position;
  width: number;
  height: number;
  color: NoteColor;
}

/**
 * A directional link between two notecards on the Notecard Canvas.
 * @interface NotecardLink
 */
export interface NotecardLink {
  id: string;
  fromId: string;
  toId: string;
  label?: string;
}
```

- [ ] **Step 2: Extend `EditorTab['type']` union (line 647)**

```ts
type: 'canvas' | 'route-canvas' | 'choice-canvas' | 'notecard-canvas' | 'punchlist' | 'diagnostics' | 'editor' | 'image' | 'audio' | 'character' | 'scene-composer' | 'imagemap-composer' | 'screen-preview' | 'stats' | 'markdown' | 'translations' | 'untitled';
```

- [ ] **Step 3: Extend `ProjectSettings` (after `choiceStickyNotes?: StickyNote[];` at line 1134)**

```ts
  notecards?: Notecard[];
  notecardLinks?: NotecardLink[];
```

- [ ] **Step 4: Extend `ProjectSnapshot` (after `choiceStickyNotes: StickyNote[];` at line 1291)**

```ts
  notecards: Notecard[];
  notecardLinks: NotecardLink[];
```

- [ ] **Step 5: Write the failing test for deserialization defaulting**

Add to `src/lib/projectSerializer.test.ts` (create the file with this one case if it doesn't already exist — check first with a read; if it exists, add this `it` block inside the existing `describe('deserializeProjectData'`):

```ts
it('defaults notecards and notecardLinks to empty arrays when absent from settings', async () => {
  const data = buildMinimalProjectLoadResult(); // existing helper in this test file; if absent, construct data.settings = {} inline per existing test patterns
  const snapshot = await deserializeProjectData(data);
  expect(snapshot.notecards).toEqual([]);
  expect(snapshot.notecardLinks).toEqual([]);
});

it('carries notecards and notecardLinks through when present in settings', async () => {
  const card = createNotecard({ id: 'nc-1' });
  const link = createNotecardLink({ id: 'ncl-1', fromId: 'nc-1', toId: 'nc-2' });
  const data = buildMinimalProjectLoadResult();
  data.settings = { ...data.settings, notecards: [card], notecardLinks: [link] };
  const snapshot = await deserializeProjectData(data);
  expect(snapshot.notecards).toEqual([card]);
  expect(snapshot.notecardLinks).toEqual([link]);
});
```

If `buildMinimalProjectLoadResult` doesn't exist in that test file, inspect the existing tests in `src/lib/projectSerializer.test.ts` for whatever minimal-fixture pattern they already use (e.g. a local `baseData` object) and reuse that pattern instead — do not invent a second fixture style.

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test -- projectSerializer`
Expected: FAIL — `notecards`/`notecardLinks` undefined on the snapshot.

- [ ] **Step 7: Add `createNotecard`/`createNotecardLink` factories to `src/test/mocks/sampleData.ts`**

Follow the file's existing factory-function style (look at `createStickyNote` or equivalent in that file for the exact `id` defaulting convention used, e.g. counter or `Date.now()`-based) and add:

```ts
export function createNotecard(overrides: Partial<Notecard> = {}): Notecard {
  return {
    id: `notecard-${Math.random().toString(36).slice(2, 9)}`,
    title: 'New Notecard',
    content: '',
    position: { x: 0, y: 0 },
    width: 220,
    height: 160,
    color: 'yellow',
    ...overrides,
  };
}

export function createNotecardLink(overrides: Partial<NotecardLink> = {}): NotecardLink {
  return {
    id: `notecard-link-${Math.random().toString(36).slice(2, 9)}`,
    fromId: 'notecard-1',
    toId: 'notecard-2',
    ...overrides,
  };
}
```

Add `Notecard, NotecardLink` to this file's existing `import type { ... } from '@/types'` line.

- [ ] **Step 8: Update `deserializeProjectData` in `src/lib/projectSerializer.ts` (in the returned object, after `choiceStickyNotes: data.settings?.choiceStickyNotes ?? [],` at line 267)**

```ts
    notecards: data.settings?.notecards ?? [],
    notecardLinks: data.settings?.notecardLinks ?? [],
```

- [ ] **Step 9: Run test to verify it passes**

Run: `npm test -- projectSerializer`
Expected: PASS

- [ ] **Step 10: Commit**

```bash
git add src/types.ts src/lib/projectSerializer.ts src/lib/projectSerializer.test.ts src/test/mocks/sampleData.ts
git commit -m "feat(notecard-canvas): add Notecard/NotecardLink types and snapshot plumbing"
```

---

## Task 2: `useNotecards` hook (state management)

**Files:**
- Create: `src/hooks/useNotecards.ts`
- Test: `src/hooks/useNotecards.test.ts`

**Interfaces:**
- Consumes: `Notecard`, `NotecardLink`, `Position` from `@/types`; `CanvasTransform` from `@/hooks/useCanvasInteraction`
- Produces:
```ts
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
```
This mirrors `useStickyNotes`'s single-canvas subset (Story Canvas only) exactly, since Notecard Canvas is one board.

- [ ] **Step 1: Write the failing tests**

```ts
// src/hooks/useNotecards.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useNotecards } from '@/hooks/useNotecards';
import { createMockAppSettings } from '@/test/mocks/sampleData'; // use whatever factory useStickyNotes.test.ts already uses for AppSettings — check that file first

const baseParams = () => ({
  appSettings: createMockAppSettings(),
  notecardCanvasTransform: { x: 0, y: 0, scale: 1 },
});

describe('useNotecards', () => {
  it('adds a notecard at the given position, centered on the click point', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    act(() => result.current.addNotecard({ x: 500, y: 300 }));
    expect(result.current.notecards).toHaveLength(1);
    const card = result.current.notecards[0];
    expect(card.position).toEqual({ x: 500 - card.width / 2, y: 300 - card.height / 2 });
    expect(card.color).toBe('yellow');
    expect(card.title).toBe('New Notecard');
  });

  it('updates a notecard by id', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    act(() => result.current.addNotecard({ x: 0, y: 0 }));
    const id = result.current.notecards[0].id;
    act(() => result.current.updateNotecard(id, { title: 'Renamed', color: 'blue' }));
    expect(result.current.notecards[0].title).toBe('Renamed');
    expect(result.current.notecards[0].color).toBe('blue');
  });

  it('deletes a notecard and any links referencing it', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    act(() => {
      result.current.addNotecard({ x: 0, y: 0 });
      result.current.addNotecard({ x: 100, y: 100 });
    });
    const [a, b] = result.current.notecards;
    act(() => result.current.addNotecardLink(a.id, b.id));
    expect(result.current.notecardLinks).toHaveLength(1);
    act(() => result.current.deleteNotecard(a.id));
    expect(result.current.notecards).toHaveLength(1);
    expect(result.current.notecardLinks).toHaveLength(0);
  });

  it('adds, updates, and deletes a link', () => {
    const { result } = renderHook(() => useNotecards(baseParams()));
    act(() => {
      result.current.addNotecard({ x: 0, y: 0 });
      result.current.addNotecard({ x: 100, y: 100 });
    });
    const [a, b] = result.current.notecards;
    act(() => result.current.addNotecardLink(a.id, b.id));
    const link = result.current.notecardLinks[0];
    expect(link.fromId).toBe(a.id);
    expect(link.toId).toBe(b.id);
    act(() => result.current.updateNotecardLink(link.id, { label: 'foreshadows' }));
    expect(result.current.notecardLinks[0].label).toBe('foreshadows');
    act(() => result.current.deleteNotecardLink(link.id));
    expect(result.current.notecardLinks).toHaveLength(0);
  });

  it('calls onNotecardChange on every mutation', () => {
    const onNotecardChange = vi.fn();
    const { result } = renderHook(() => useNotecards({ ...baseParams(), onNotecardChange }));
    act(() => result.current.addNotecard({ x: 0, y: 0 }));
    expect(onNotecardChange).toHaveBeenCalledTimes(1);
  });
});
```

Before writing this, open `src/hooks/useStickyNotes.test.ts` to confirm the exact `AppSettings` mock factory name used there, and use that same one (do not invent `createMockAppSettings` if the real name differs).

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- useNotecards`
Expected: FAIL — `useNotecards` module not found.

- [ ] **Step 3: Implement `src/hooks/useNotecards.ts`**

```ts
/**
 * @file useNotecards.ts
 * @description Custom hook for managing the Notecard Canvas's freeform notecards and links.
 * Unlike useStickyNotes, this is a single board (one array pair), not per-canvas.
 */

import { useCallback } from 'react';
import { useImmer } from 'use-immer';
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
    const id = `notecard-${Date.now()}`;
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
    const id = `notecard-link-${Date.now()}`;
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- useNotecards`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useNotecards.ts src/hooks/useNotecards.test.ts
git commit -m "feat(notecard-canvas): add useNotecards state hook"
```

---

## Task 3: `Notecard` card component

**Files:**
- Create: `src/components/Notecard.tsx`
- Test: `src/components/Notecard.test.tsx`

**Interfaces:**
- Consumes: `Notecard` (aliased `NotecardType`), `NoteColor` from `@/types`
- Produces:
```ts
interface NotecardProps {
  card: NotecardType;
  updateCard: (id: string, data: Partial<NotecardType>) => void;
  deleteCard: (id: string) => void;
  isSelected: boolean;
  isDragging: boolean;
  onStartLinkDrag: (cardId: string, clientX: number, clientY: number) => void;
}
```
Rendered `forwardRef<HTMLDivElement, NotecardProps>`, default export `React.memo(...)`. Markup: `data-notecard-id={card.id}`, `.drag-handle` header (title input, color swatch button + popover, delete button), a markdown/edit toggle body, and a `.resize-handle` corner div (mirrors `StickyNote.tsx` exactly for those two classes) plus a small `.link-handle` connector nub on the right edge for link-dragging.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/Notecard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Notecard from '@/components/Notecard';
import { createNotecard } from '@/test/mocks/sampleData';

describe('Notecard', () => {
  it('renders title and enters edit mode on double-click, saving on blur', () => {
    const card = createNotecard({ title: 'Plot Beat', content: 'She discovers the letter.' });
    const updateCard = vi.fn();
    render(
      <Notecard card={card} updateCard={updateCard} deleteCard={vi.fn()} isSelected={false} isDragging={false} onStartLinkDrag={vi.fn()} />
    );
    expect(screen.getByText('Plot Beat')).toBeInTheDocument();
    fireEvent.doubleClick(screen.getByText('Plot Beat'));
    const titleInput = screen.getByDisplayValue('Plot Beat');
    fireEvent.change(titleInput, { target: { value: 'Renamed Beat' } });
    fireEvent.blur(titleInput);
    expect(updateCard).toHaveBeenCalledWith(card.id, { title: 'Renamed Beat' });
  });

  it('calls deleteCard when the delete button is clicked', () => {
    const card = createNotecard();
    const deleteCard = vi.fn();
    render(
      <Notecard card={card} updateCard={vi.fn()} deleteCard={deleteCard} isSelected={false} isDragging={false} onStartLinkDrag={vi.fn()} />
    );
    fireEvent.click(screen.getByLabelText('Delete notecard'));
    expect(deleteCard).toHaveBeenCalledWith(card.id);
  });

  it('opens the color popover and calls updateCard with the chosen color', () => {
    const card = createNotecard({ color: 'yellow' });
    const updateCard = vi.fn();
    render(
      <Notecard card={card} updateCard={updateCard} deleteCard={vi.fn()} isSelected={false} isDragging={false} onStartLinkDrag={vi.fn()} />
    );
    fireEvent.click(screen.getByLabelText('Change notecard color'));
    fireEvent.click(screen.getByLabelText('Blue'));
    expect(updateCard).toHaveBeenCalledWith(card.id, { color: 'blue' });
  });

  it('renders a resize handle and a link handle', () => {
    const card = createNotecard();
    const { container } = render(
      <Notecard card={card} updateCard={vi.fn()} deleteCard={vi.fn()} isSelected={false} isDragging={false} onStartLinkDrag={vi.fn()} />
    );
    expect(container.querySelector('.resize-handle')).toBeTruthy();
    expect(container.querySelector('.link-handle')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Notecard.test`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/Notecard.tsx`**

```tsx
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
      className={`notecard-wrapper absolute rounded-lg shadow-lg border-2 flex flex-col transition-shadow duration-200 ${styles.bg} ${styles.border} ${isSelected ? 'ring-2 ring-indigo-500 z-30' : 'z-20'} ${isDragging ? 'shadow-xl opacity-90' : ''}`}
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
              onDoubleClick={() => { setTitleDraft(card.title); setIsEditingTitle(true); }}
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
          onDoubleClick={() => { setBodyDraft(card.content); setIsEditingBody(true); }}
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
```

Note: the `.group` class needed for `group-hover:opacity-100` on the link handle must live on the outer wrapper — it already carries `notecard-wrapper` classes; add `group` to that `className` string (`notecard-wrapper absolute rounded-lg shadow-lg border-2 flex flex-col transition-shadow duration-200 group ...`) since the header's own `group` scope does not cover the link handle sitting outside the header. Apply this correction while implementing this step.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Notecard.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/Notecard.tsx src/components/Notecard.test.tsx
git commit -m "feat(notecard-canvas): add Notecard card component"
```

---

## Task 4: Minimap `notecard` item type

**Files:**
- Modify: `src/components/Minimap.tsx`
- Test: `src/components/Minimap.test.tsx` (extend if it exists; else create following this file's existing render-test conventions used for `'note'` items)

**Interfaces:**
- Consumes/Produces: `MinimapItem['type']` gains `'notecard'`; `ITEM_COLORS` gains a `notecard` entry; the existing per-item `NoteColor` remapping (lines 164–171) is extended to also apply when `item.type === 'notecard'`.

- [ ] **Step 1: Write the failing test**

```tsx
// add to src/components/Minimap.test.tsx (create if absent; if creating, mirror the render/prop style of an existing canvas component test file such as Notecard.test.tsx for setup boilerplate)
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Minimap from '@/components/Minimap';

describe('Minimap notecard items', () => {
  it('renders a notecard item using its own NoteColor', () => {
    const { container } = render(
      <Minimap
        items={[{ id: 'nc-1', position: { x: 0, y: 0 }, width: 220, height: 160, type: 'notecard', color: 'blue' }]}
        transform={{ x: 0, y: 0, scale: 1 }}
        canvasDimensions={{ width: 800, height: 600 }}
        onTransformChange={() => {}}
      />
    );
    const dot = container.querySelector('.absolute.rounded-sm') as HTMLElement;
    expect(dot).toBeTruthy();
    expect(dot.style.backgroundColor).toBe('rgba(59, 130, 246, 0.6)');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Minimap`
Expected: FAIL — TypeScript error / `notecard` not assignable to `MinimapItem['type']`, or wrong fallback color at runtime.

- [ ] **Step 3: Extend `Minimap.tsx`**

Line 24, extend the union:

```ts
  type: 'block' | 'group' | 'note' | 'notecard' | 'label' | 'screen' | 'config';
```

Line 39–46, add an entry to `ITEM_COLORS`:

```ts
const ITEM_COLORS: Record<MinimapItem['type'], string> = {
  block: 'rgba(107, 114, 128, 0.7)',
  group: 'rgba(99, 102, 241, 0.4)',
  note: 'rgba(234, 179, 8, 0.6)',
  notecard: 'rgba(234, 179, 8, 0.6)',
  label: 'rgba(147, 197, 253, 0.8)',
  screen: 'rgba(45, 212, 191, 0.7)',
  config: 'rgba(248, 113, 113, 0.7)',
};
```

Line 164, extend the color-remap condition to cover both note-like types:

```ts
          if ((item.type === 'note' || item.type === 'notecard') && item.color) {
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Minimap`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/Minimap.tsx src/components/Minimap.test.tsx
git commit -m "feat(notecard-canvas): extend Minimap with notecard item type"
```

---

## Task 5: `NotecardCanvas` component — pan/zoom, select, drag, resize, minimap

**Files:**
- Create: `src/components/NotecardCanvas.tsx`
- Test: `src/components/NotecardCanvas.test.tsx`

**Interfaces:**
- Consumes: `Notecard`, `NotecardLink` from `@/types`; `Notecard` component (Task 3); `Minimap`, `MinimapItem` (Task 4); `useCanvasInteraction`'s `CanvasTransform` type.
- Produces:
```ts
interface NotecardCanvasProps {
  notecards: Notecard[];
  notecardLinks: NotecardLink[];
  updateNotecard: (id: string, data: Partial<Notecard>) => void;
  deleteNotecard: (id: string) => void;
  addNotecard: (position?: { x: number; y: number }) => void;
  addNotecardLink: (fromId: string, toId: string) => void;
  updateNotecardLink: (id: string, data: Partial<NotecardLink>) => void;
  deleteNotecardLink: (id: string) => void;
  transform: CanvasTransform;
  onTransformChange: React.Dispatch<React.SetStateAction<CanvasTransform>>;
}
```
This task covers everything except link-drawing and search, which are Tasks 6 and 7 (kept separate for reviewable scope). To keep this task compilable and testable on its own, the component includes a no-op-safe stub `startLinkDrag` handler (logs nothing, does nothing) that Task 6 will replace — the component still renders `onStartLinkDrag` wiring into `Notecard` from Task 3, just not yet functional end-to-end.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/NotecardCanvas.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotecardCanvas from '@/components/NotecardCanvas';
import { createNotecard } from '@/test/mocks/sampleData';

const baseProps = () => ({
  notecards: [],
  notecardLinks: [],
  updateNotecard: vi.fn(),
  deleteNotecard: vi.fn(),
  addNotecard: vi.fn(),
  addNotecardLink: vi.fn(),
  updateNotecardLink: vi.fn(),
  deleteNotecardLink: vi.fn(),
  transform: { x: 0, y: 0, scale: 1 },
  onTransformChange: vi.fn(),
});

describe('NotecardCanvas', () => {
  it('calls addNotecard with world-space coordinates on double-click of empty canvas', () => {
    const props = baseProps();
    render(<NotecardCanvas {...props} />);
    const surface = screen.getByTestId('notecard-canvas-surface');
    fireEvent.doubleClick(surface, { clientX: 150, clientY: 120 });
    expect(props.addNotecard).toHaveBeenCalledWith({ x: 150, y: 120 });
  });

  it('shows a context menu with "New Notecard" on right-click of empty canvas, which calls addNotecard', () => {
    const props = baseProps();
    render(<NotecardCanvas {...props} />);
    const surface = screen.getByTestId('notecard-canvas-surface');
    fireEvent.contextMenu(surface, { clientX: 200, clientY: 80 });
    const menuItem = screen.getByText('New Notecard');
    fireEvent.click(menuItem);
    expect(props.addNotecard).toHaveBeenCalledWith({ x: 200, y: 80 });
  });

  it('renders one Notecard per item in notecards[]', () => {
    const props = { ...baseProps(), notecards: [createNotecard({ id: 'a' }), createNotecard({ id: 'b' })] };
    render(<NotecardCanvas {...props} />);
    expect(screen.getAllByText('New Notecard')).toHaveLength(2);
  });

  it('deletes the selected notecard on Delete key', () => {
    const card = createNotecard({ id: 'a' });
    const props = { ...baseProps(), notecards: [card] };
    render(<NotecardCanvas {...props} />);
    fireEvent.pointerDown(screen.getByTestId('notecard-a'));
    fireEvent.keyDown(window, { key: 'Delete' });
    expect(props.deleteNotecard).toHaveBeenCalledWith('a');
  });

  it('renders the minimap with one item per notecard', () => {
    const props = { ...baseProps(), notecards: [createNotecard({ id: 'a' })] };
    const { container } = render(<NotecardCanvas {...props} />);
    expect(container.querySelectorAll('[data-notecard-id]')).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- NotecardCanvas.test`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/NotecardCanvas.tsx`**

```tsx
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- NotecardCanvas.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/NotecardCanvas.tsx src/components/NotecardCanvas.test.tsx
git commit -m "feat(notecard-canvas): add NotecardCanvas with pan/zoom/select/drag/resize/minimap"
```

---

## Task 6: Link drawing (drag-to-connect) and link rendering/labels

**Files:**
- Modify: `src/components/NotecardCanvas.tsx`
- Test: `src/components/NotecardCanvas.test.tsx` (extend)

**Interfaces:**
- Consumes: `notecardLinks`, `addNotecardLink`, `updateNotecardLink`, `deleteNotecardLink` (already props from Task 5)
- Produces: an SVG `<svg>` overlay layer rendering one arrow per `NotecardLink`, a live "drag preview" line while linking, and a click-to-edit label popup.

- [ ] **Step 1: Write the failing tests**

Add to `src/components/NotecardCanvas.test.tsx`:

```tsx
it('renders one arrow per notecardLink', () => {
  const a = createNotecard({ id: 'a', position: { x: 0, y: 0 } });
  const b = createNotecard({ id: 'b', position: { x: 400, y: 300 } });
  const link = { id: 'l1', fromId: 'a', toId: 'b' };
  const props = { ...baseProps(), notecards: [a, b], notecardLinks: [link] };
  const { container } = render(<NotecardCanvas {...props} />);
  expect(container.querySelectorAll('[data-notecard-link-id]')).toHaveLength(1);
});

it('completes a link when dragging from one card link-handle and releasing over another card', () => {
  const a = createNotecard({ id: 'a', position: { x: 0, y: 0 } });
  const b = createNotecard({ id: 'b', position: { x: 400, y: 300 } });
  const props = { ...baseProps(), notecards: [a, b] };
  render(<NotecardCanvas {...props} />);
  const aCard = screen.getByTestId('notecard-a');
  const handle = aCard.querySelector('.link-handle') as HTMLElement;
  fireEvent.pointerDown(handle, { clientX: 220, clientY: 80 });
  const bCard = screen.getByTestId('notecard-b');
  fireEvent.pointerUp(bCard, { clientX: 400, clientY: 300 });
  expect(props.addNotecardLink).toHaveBeenCalledWith('a', 'b');
});

it('opens a label editor on double-click of a link and commits the label', () => {
  const a = createNotecard({ id: 'a', position: { x: 0, y: 0 } });
  const b = createNotecard({ id: 'b', position: { x: 400, y: 300 } });
  const link = { id: 'l1', fromId: 'a', toId: 'b' };
  const props = { ...baseProps(), notecards: [a, b], notecardLinks: [link] };
  render(<NotecardCanvas {...props} />);
  fireEvent.doubleClick(screen.getByTestId('notecard-link-l1'));
  const input = screen.getByPlaceholderText('Link label…');
  fireEvent.change(input, { target: { value: 'foreshadows' } });
  fireEvent.blur(input);
  expect(props.updateNotecardLink).toHaveBeenCalledWith('l1', { label: 'foreshadows' });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- NotecardCanvas.test`
Expected: FAIL — no `[data-notecard-link-id]` elements rendered, `addNotecardLink` not called.

- [ ] **Step 3: Implement link drawing + rendering in `NotecardCanvas.tsx`**

Add new state and a real `startLinkDrag` implementation, replacing the Task 5 stub:

```tsx
// add near other useState hooks
const [linkDraft, setLinkDraft] = useState<{ fromId: string; x: number; y: number } | null>(null);
const [editingLinkId, setEditingLinkId] = useState<string | null>(null);

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
    const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    const targetCardEl = target?.closest('[data-notecard-id]') as HTMLElement | null;
    const toId = targetCardEl?.getAttribute('data-notecard-id');
    setLinkDraft(null);
    if (toId && toId !== cardId) addNotecardLink(cardId, toId);
  };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [transform, addNotecardLink]);
```

Remove the Task 5 stub `startLinkDrag` definition entirely (this replaces it, same name/signature).

Add a card-center helper and the SVG overlay, rendered as a sibling layer inside the transformed content `<div>` (same transform context so world coordinates line up), placed just before the `notecards.map(...)` block:

```tsx
const cardCenter = (card: NotecardType) => ({ x: card.position.x + card.width / 2, y: card.position.y + card.height / 2 });
const cardById = (id: string) => notecards.find(c => c.id === id);

const [labelDraft, setLabelDraft] = useState('');
```

```tsx
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
      <g key={link.id} data-notecard-link-id={link.id} className="pointer-events-auto cursor-pointer" onDoubleClick={() => { setLabelDraft(link.label ?? ''); setEditingLinkId(link.id); }}>
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
```

The SVG's `width: 1, height: 1; overflow: visible` trick lets child shapes use absolute world coordinates without needing a computed viewBox — consistent with how the codebase avoids resizing SVG bounds per-frame elsewhere (verify against any existing route-link SVG in `RouteCanvas.tsx` during implementation; if that file uses a different established idiom for an unbounded coordinate-space SVG overlay, use that idiom instead for consistency).

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- NotecardCanvas.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/NotecardCanvas.tsx src/components/NotecardCanvas.test.tsx
git commit -m "feat(notecard-canvas): add drag-to-link connectors and link labels"
```

---

## Task 7: Local search filter

**Files:**
- Modify: `src/components/NotecardCanvas.tsx`
- Test: `src/components/NotecardCanvas.test.tsx` (extend)

**Interfaces:**
- Purely internal `useState` in `NotecardCanvas` — no new props. A search `<input>` in a small floating toolbar (top-left, matching the minimap's bottom-right anchoring convention) filters by `title`/`content` substring (case-insensitive), dimming non-matches via a CSS class and centering the transform on the first match.

- [ ] **Step 1: Write the failing tests**

Add to `src/components/NotecardCanvas.test.tsx`:

```tsx
it('dims notecards that do not match the search query', () => {
  const a = createNotecard({ id: 'a', title: 'Letter reveal' });
  const b = createNotecard({ id: 'b', title: 'Market scene' });
  const props = { ...baseProps(), notecards: [a, b] };
  render(<NotecardCanvas {...props} />);
  fireEvent.change(screen.getByPlaceholderText('Search notecards…'), { target: { value: 'letter' } });
  expect(screen.getByTestId('notecard-a').className).not.toContain('opacity-30');
  expect(screen.getByTestId('notecard-b').className).toContain('opacity-30');
});

it('clearing the search query removes dimming from all cards', () => {
  const a = createNotecard({ id: 'a', title: 'Letter reveal' });
  const b = createNotecard({ id: 'b', title: 'Market scene' });
  const props = { ...baseProps(), notecards: [a, b] };
  render(<NotecardCanvas {...props} />);
  const input = screen.getByPlaceholderText('Search notecards…');
  fireEvent.change(input, { target: { value: 'letter' } });
  fireEvent.change(input, { target: { value: '' } });
  expect(screen.getByTestId('notecard-a').className).not.toContain('opacity-30');
  expect(screen.getByTestId('notecard-b').className).not.toContain('opacity-30');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- NotecardCanvas.test`
Expected: FAIL — no search input found.

- [ ] **Step 3: Implement search filter in `NotecardCanvas.tsx`**

Add state near the top of the component:

```tsx
const [searchQuery, setSearchQuery] = useState('');
const normalizedQuery = searchQuery.trim().toLowerCase();
const isMatch = (card: NotecardType) =>
  !normalizedQuery || card.title.toLowerCase().includes(normalizedQuery) || card.content.toLowerCase().includes(normalizedQuery);
```

Wrap each rendered card's outer div (from Task 5's `notecards.map`) so its `className` includes dimming, and center on the first match when the query changes:

```tsx
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
```

Update the card wrapper's `className` (from Task 5):

```tsx
<div
  key={card.id}
  data-testid={`notecard-${card.id}`}
  className={isMatch(card) ? '' : 'opacity-30 transition-opacity'}
  onPointerDown={(e) => handleCardPointerDown(e, card)}
>
```

Add the floating search toolbar, sibling to the minimap `<div>`:

```tsx
<div className="absolute top-4 left-4 z-40">
  <input
    type="text"
    placeholder="Search notecards…"
    className="w-56 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- NotecardCanvas.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/NotecardCanvas.tsx src/components/NotecardCanvas.test.tsx
git commit -m "feat(notecard-canvas): add local title/content search with center-on-match"
```

---

## Task 8: Persistence wiring (save/load) and round-trip test

**Files:**
- Modify: `src/hooks/useProjectLoad.ts` (`HydrateSetters`, `hydrateFromProjectData`)
- Modify: `src/hooks/useProjectIO.ts` (`UseProjectIOParams`, `handleSaveProjectSettings`)
- Test: `src/hooks/useProjectIO.test.ts` and/or `src/hooks/useProjectLoad.test.ts` (extend whichever already covers `stickyNotes` round-tripping — inspect both files first to find the existing coverage before choosing where to add)

**Interfaces:**
- Consumes: `notecards`, `notecardLinks`, `setNotecards`, `setNotecardLinks` (from Task 2's `useNotecards`)
- Produces: `notecards`/`notecardLinks` appear in the `ProjectSettings` object written by `handleSaveProjectSettings`, and are restored into state by `hydrateFromProjectData`.

- [ ] **Step 1: Write the failing test**

Locate the existing test that asserts `stickyNotes` is included in `settingsToSave` inside `useProjectIO.test.ts` (search for `stickyNotes` in that file). Add an analogous assertion in the same test case (or a new one following the same setup):

```ts
it('includes notecards and notecardLinks in the saved settings payload', async () => {
  const notecards = [createNotecard({ id: 'nc-1' })];
  const notecardLinks = [createNotecardLink({ id: 'ncl-1', fromId: 'nc-1', toId: 'nc-2' })];
  // reuse this file's existing renderHook/params setup, adding notecards/notecardLinks to the params object
  const { result } = renderHook(() => useProjectIO({ ...baseParams(), notecards, notecardLinks }));
  await act(async () => { await result.current.handleSaveProjectSettings(); });
  const writeFileMock = window.electronAPI!.writeFile as ReturnType<typeof vi.fn>;
  const written = JSON.parse(writeFileMock.mock.calls[0][1] as string);
  expect(written.notecards).toEqual(notecards);
  expect(written.notecardLinks).toEqual(notecardLinks);
});
```

Adapt `baseParams()`/mock setup to whatever helper name this test file already uses — inspect the file first rather than assuming.

Similarly, in `useProjectLoad.test.ts`, find the existing `hydrateFromProjectData` test asserting `setStickyNotes` was called with `snapshot.stickyNotes`, and add:

```ts
it('hydrates notecards and notecardLinks from the snapshot', () => {
  const setNotecards = vi.fn();
  const setNotecardLinks = vi.fn();
  const snapshot = { ...baseSnapshot(), notecards: [createNotecard()], notecardLinks: [createNotecardLink()] };
  hydrateFromProjectData(snapshot, { ...baseSetters(), setNotecards, setNotecardLinks });
  expect(setNotecards).toHaveBeenCalledWith(snapshot.notecards);
  expect(setNotecardLinks).toHaveBeenCalledWith(snapshot.notecardLinks);
});
```

Again, adapt `baseSnapshot()`/`baseSetters()` to this file's real existing fixture helper names.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- useProjectIO` and `npm test -- useProjectLoad`
Expected: FAIL — `notecards`/`notecardLinks` missing from saved payload; `setNotecards`/`setNotecardLinks` not in `HydrateSetters` type / not called.

- [ ] **Step 3: Wire `useProjectLoad.ts`**

Add to `HydrateSetters` (after `setChoiceStickyNotes: Updater<StickyNote[]>;` at line 38):

```ts
  setNotecards: Updater<Notecard[]>;
  setNotecardLinks: Updater<NotecardLink[]>;
```

Add `Notecard, NotecardLink` to the `import type { ... } from '@/types'` block at the top (line 5–10).

Destructure them in `hydrateFromProjectData` (after `setStickyNotes, setRouteStickyNotes, setChoiceStickyNotes, setCharacterProfiles,` at line 71):

```ts
    setNotecards, setNotecardLinks,
```

Call them after `setChoiceStickyNotes(snapshot.choiceStickyNotes);` (line 113):

```ts
  setNotecards(snapshot.notecards);
  setNotecardLinks(snapshot.notecardLinks);
```

- [ ] **Step 4: Wire `useProjectIO.ts`**

Add to `UseProjectIOParams` (after `stickyNotes: StickyNote[]; routeStickyNotes: StickyNote[]; choiceStickyNotes: StickyNote[];` at lines 53–55):

```ts
  notecards: Notecard[];
  notecardLinks: NotecardLink[];
```

Add `Notecard, NotecardLink` to this file's `import type { ... } from '@/types'` block (line 14).

Destructure in `useProjectIO` (after `stickyNotes, routeStickyNotes, choiceStickyNotes, characterProfiles,` at line 127):

```ts
    notecards, notecardLinks,
```

Add to `settingsToSave` (after `choiceStickyNotes: Array.from(choiceStickyNotes),` at line 183):

```ts
        notecards: Array.from(notecards),
        notecardLinks: Array.from(notecardLinks),
```

Add `notecards, notecardLinks` to the `handleSaveProjectSettings` `useCallback` dependency array (line 205).

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- useProjectIO` and `npm test -- useProjectLoad`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useProjectLoad.ts src/hooks/useProjectIO.ts src/hooks/useProjectIO.test.ts src/hooks/useProjectLoad.test.ts
git commit -m "feat(notecard-canvas): wire notecards/notecardLinks into save/load round-trip"
```

---

## Task 9: App-level wiring — tab, toolbar button, minimap/props threading

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/hooks/useTabOpeners.ts`
- Modify: `src/hooks/useTabContentRenderer.tsx`
- Modify: `src/components/Toolbar.tsx`
- Test: `src/components/Toolbar.test.tsx` (extend), `src/hooks/useTabContentRenderer.test.tsx` if it exists (extend; else skip — component-level coverage below is sufficient)

**Interfaces:**
- Consumes: `useNotecards()` (Task 2), `NotecardCanvas` (Tasks 5–7), `handleOpenStaticTab` (existing, extended type)
- Produces: clicking the new toolbar button opens/focuses a `'notecard-canvas'` tab rendering `NotecardCanvas`.

- [ ] **Step 1: Write the failing test**

Add to `src/components/Toolbar.test.tsx`, following the existing pattern for the other two canvas-switcher assertions (see lines 273–297 referenced in this plan's research):

```tsx
it('calls onOpenStaticTab with "notecard-canvas" when Notecard Canvas button is clicked', async () => {
  const props = createDefaultProps(); // use this file's existing prop-factory helper name
  render(<Toolbar {...props} />);
  await userEvent.click(screen.getByLabelText('Notecard Canvas'));
  expect(props.onOpenStaticTab).toHaveBeenCalledWith('notecard-canvas');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Toolbar.test`
Expected: FAIL — no element with label "Notecard Canvas".

- [ ] **Step 3: Extend `useTabOpeners.ts`**

Line 20 and line 38, extend the `handleOpenStaticTab` type union in both the interface and the function signature:

```ts
  handleOpenStaticTab: (type: 'canvas' | 'route-canvas' | 'choice-canvas' | 'notecard-canvas' | 'diagnostics' | 'stats' | 'translations' | 'screen-preview') => void;
```
```ts
  const handleOpenStaticTab = useCallback((type: 'canvas' | 'route-canvas' | 'choice-canvas' | 'notecard-canvas' | 'diagnostics' | 'stats' | 'translations' | 'screen-preview') => {
```

- [ ] **Step 4: Extend `Toolbar.tsx`**

Line 28, extend the prop type the same way:

```ts
  onOpenStaticTab: (type: 'canvas' | 'route-canvas' | 'choice-canvas' | 'notecard-canvas' | 'stats' | 'diagnostics' | 'translations' | 'screen-preview') => void;
```

Line 14, extend `activeCanvasType`:

```ts
  activeCanvasType: 'story' | 'route' | 'choice' | 'notecard' | null;
```

After the "Choices Canvas" button (after line 262, inside the same button group `<div>`), add:

```tsx
          <button
            onClick={() => onOpenStaticTab('notecard-canvas')}
            className={canvasBtn(activeCanvasType === 'notecard')}
            title="Notecard Canvas — freeform scratchpad, not tied to your script"
            aria-label="Notecard Canvas"
            aria-pressed={activeCanvasType === 'notecard'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 3.75h7.5l4.5 4.5v12a1.5 1.5 0 01-1.5 1.5h-10.5a1.5 1.5 0 01-1.5-1.5V5.25a1.5 1.5 0 011.5-1.5zM13.5 3.75v4.5h4.5M8.25 13.5h7.5M8.25 16.5h4.5" />
            </svg>
          </button>
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- Toolbar.test`
Expected: PASS

- [ ] **Step 6: Wire `useTabContentRenderer.tsx`**

Add a label case (after `if (tab.id === 'choice-canvas') return 'Choices Canvas';` at line 276):

```tsx
    if (tab.id === 'notecard-canvas') return 'Notecard Canvas';
```

Add a render branch (after the `choice-canvas` block, i.e. after its closing `}` around line 349), and add the new props this branch needs (`notecards`, `notecardLinks`, `updateNotecard`, `deleteNotecard`, `addNotecard`, `addNotecardLink`, `updateNotecardLink`, `deleteNotecardLink`, `notecardCanvasTransform`, `setNotecardCanvasTransform`) to `UseTabContentRendererParams` and the destructured params list (near line 238–241, alongside the sticky-note props):

```tsx
    if (tab.type === 'notecard-canvas') {
      return <NotecardCanvas
        notecards={notecards} notecardLinks={notecardLinks}
        updateNotecard={updateNotecard} deleteNotecard={deleteNotecard} addNotecard={addNotecard}
        addNotecardLink={addNotecardLink} updateNotecardLink={updateNotecardLink} deleteNotecardLink={deleteNotecardLink}
        transform={notecardCanvasTransform} onTransformChange={setNotecardCanvasTransform}
      />;
    }
```

Add the `import NotecardCanvas from '@/components/NotecardCanvas';` alongside this file's existing `StoryCanvas`/`RouteCanvas`/`ChoiceCanvas` imports.

- [ ] **Step 7: Wire `App.tsx`**

Add a `notecardCanvasTransform` state near the other canvas transforms (alongside `storyCanvasTransform`/`routeCanvasTransform`/`choiceCanvasTransform` — find their declaration and add a sibling `useState<CanvasTransform>({ x: 0, y: 0, scale: 1 })` pair named `notecardCanvasTransform`/`setNotecardCanvasTransform`).

Instantiate `useNotecards` near the existing `useStickyNotes` call (after line 408):

```ts
  const {
    notecards, notecardLinks, setNotecards, setNotecardLinks,
    addNotecard, updateNotecard, deleteNotecard,
    addNotecardLink, updateNotecardLink, deleteNotecardLink,
  } = useNotecards({
    appSettings,
    notecardCanvasTransform,
    onNotecardChange: () => setHasUnsavedSettings(true),
  });
```

Add the import: `import { useNotecards } from '@/hooks/useNotecards';`

Pass `notecards, notecardLinks` into the `useProjectIO({...})` call (Task 8 already added these to its params type — add them to the call site here, alongside `stickyNotes, routeStickyNotes, choiceStickyNotes,` at line 931).

Pass `setNotecards, setNotecardLinks` into the `hydrateSetters: {...}` object inside the `useProjectLoad({...})` call (alongside `setStickyNotes, setRouteStickyNotes, setChoiceStickyNotes,` at line 910).

Pass the new props into the `useTabContentRenderer({...})` call (find it via the earlier grep at line 1769) alongside the existing sticky-note props: `notecards, notecardLinks, updateNotecard, deleteNotecard, addNotecard, addNotecardLink, updateNotecardLink, deleteNotecardLink, notecardCanvasTransform, setNotecardCanvasTransform`.

Extend `activeCanvasType` (line 1816–1819):

```ts
  const activeCanvasType: 'story' | 'route' | 'choice' | 'notecard' | null =
    focusedTabId === 'route-canvas' ? 'route' :
    focusedTabId === 'choice-canvas' ? 'choice' :
    focusedTabId === 'notecard-canvas' ? 'notecard' :
    focusedTabId === 'canvas' ? 'story' : null;
```

`activeCanvasOnAddStickyNote` (lines 1835–1840) needs no change — it already falls through to `null` for any `activeCanvasType` not in `{story, route, choice}`, which correctly disables the "Add Sticky Note" toolbar affordance while on the Notecard Canvas (creation there happens via double-click/context-menu on the canvas itself per this feature's design, not the sticky-note toolbar button).

- [ ] **Step 8: Run the full test suite and typecheck**

Run: `npm test` and `npx tsc --noEmit`
Expected: All tests PASS, zero type errors.

- [ ] **Step 9: Commit**

```bash
git add src/App.tsx src/hooks/useTabOpeners.ts src/hooks/useTabContentRenderer.tsx src/components/Toolbar.tsx src/components/Toolbar.test.tsx
git commit -m "feat(notecard-canvas): wire Notecard Canvas into tabs, toolbar, and App state"
```

---

## Task 10: Manual verification in the running app

**Files:** none (verification only)

- [ ] **Step 1: Launch the app**

Run: `npm run electron:start`

- [ ] **Step 2: Open an existing project and click the new "Notecard Canvas" toolbar button**

Verify the tab opens and shows an empty freeform canvas with a minimap.

- [ ] **Step 3: Exercise the golden path**

- Double-click empty canvas → new notecard appears, editable title/body.
- Right-click empty canvas → "New Notecard" → card appears at cursor.
- Drag a card by its header → moves; resize via corner handle → resizes.
- Change its color via the swatch popover → background updates; minimap dot color updates to match.
- Drag from one card's link handle to another card → arrow appears; double-click the arrow → set a label → label renders on the link.
- Delete a card (button and `Delete` key) → card and any attached links disappear.
- Type in the search box → non-matching cards dim and the view centers on the first match; clear the box → dimming clears.

- [ ] **Step 4: Verify persistence**

Save the project (Ctrl+S / Save All), close and reopen it (or use "Reload from Disk") — confirm all notecards/links/colors/positions/sizes survive the round-trip, and confirm `game/project.ide.json` on disk contains a `notecards`/`notecardLinks` array with the expected data.

- [ ] **Step 5: Verify isolation from Ren'Py**

Confirm no `.rpy` file changed as a result of any notecard operation, and that the Diagnostics panel / analysis worker show no new errors or entries related to notecard content.

- [ ] **Step 6: Report results to the user**

Summarize what was verified and flag anything that didn't behave as expected before considering the feature complete.
