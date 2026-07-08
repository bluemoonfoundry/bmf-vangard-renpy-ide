import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GroupContainer from '@/components/GroupContainer';
import StickyNote from '@/components/StickyNote';
import LabelBlock from '@/components/LabelBlock';
import CodeBlock from '@/components/CodeBlock';
import { createBlock, createBlockGroup, createStickyNote, createEmptyAnalysisResult } from '@/test/mocks/sampleData';
import type { LabelNode } from '@/types';

function makeLabelNode(overrides: Partial<LabelNode> = {}): LabelNode {
  return {
    id: 'block-1:start',
    label: 'start',
    blockId: 'block-1',
    startLine: 1,
    position: { x: 0, y: 0 },
    width: 160,
    height: 60,
    ...overrides,
  };
}

// ─── GroupContainer ───────────────────────────────────────────────────────────

describe('GroupContainer', () => {
  const baseProps = {
    group: createBlockGroup(),
    isSelected: false,
    isDragging: false,
    isDimmed: false,
    updateGroup: vi.fn(),
  };

  it('renders the group title', () => {
    render(<GroupContainer {...baseProps} />);
    expect(screen.getByText('Chapter 1')).toBeTruthy();
  });

  it('applies dimmed opacity when isDimmed is true', () => {
    const { container } = render(<GroupContainer {...baseProps} isDimmed={true} />);
    expect(container.firstChild?.toString()).not.toBe('');
    // Check opacity class is present somewhere
    const el = container.querySelector('.opacity-30');
    expect(el).toBeTruthy();
  });

  it('shows title input on double-click', async () => {
    const user = userEvent.setup();
    render(<GroupContainer {...baseProps} />);
    const titleSpan = screen.getByText('Chapter 1');
    await user.dblClick(titleSpan);
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it('calls updateGroup when title is saved with Enter', async () => {
    const updateGroup = vi.fn();
    const user = userEvent.setup();
    render(<GroupContainer {...baseProps} updateGroup={updateGroup} />);
    await user.dblClick(screen.getByText('Chapter 1'));
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'New Name{Enter}');
    expect(updateGroup).toHaveBeenCalledWith('group-1', { title: 'New Name' });
  });

  it('cancels edit on Escape without calling updateGroup', async () => {
    const updateGroup = vi.fn();
    const user = userEvent.setup();
    render(<GroupContainer {...baseProps} updateGroup={updateGroup} />);
    await user.dblClick(screen.getByText('Chapter 1'));
    await user.keyboard('{Escape}');
    expect(updateGroup).not.toHaveBeenCalled();
  });

  it('falls back to "Untitled Group" when saving empty title', async () => {
    const updateGroup = vi.fn();
    const user = userEvent.setup();
    render(<GroupContainer {...baseProps} updateGroup={updateGroup} />);
    await user.dblClick(screen.getByText('Chapter 1'));
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.keyboard('{Enter}');
    expect(updateGroup).toHaveBeenCalledWith('group-1', { title: 'Untitled Group' });
  });
});

// ─── StickyNote ───────────────────────────────────────────────────────────────

describe('StickyNote', () => {
  const baseProps = {
    note: createStickyNote(),
    updateNote: vi.fn(),
    deleteNote: vi.fn(),
    isSelected: false,
    isDragging: false,
  };

  it('renders the note content', () => {
    render(<StickyNote {...baseProps} />);
    expect(screen.getByDisplayValue('TODO: Add branching here')).toBeTruthy();
  });

  it('calls updateNote when textarea changes', async () => {
    const updateNote = vi.fn();
    const user = userEvent.setup();
    render(<StickyNote {...baseProps} updateNote={updateNote} />);
    const textarea = screen.getByDisplayValue('TODO: Add branching here');
    await user.clear(textarea);
    await user.type(textarea, 'New note');
    expect(updateNote).toHaveBeenCalled();
  });

  it('calls deleteNote when delete button is clicked', async () => {
    const deleteNote = vi.fn();
    const user = userEvent.setup();
    render(<StickyNote {...baseProps} deleteNote={deleteNote} />);
    const deleteBtn = screen.getByRole('button', { name: /delete note/i });
    await user.click(deleteBtn);
    expect(deleteNote).toHaveBeenCalledWith('note-1');
  });

  it('opens color picker when color button is clicked', async () => {
    const user = userEvent.setup();
    render(<StickyNote {...baseProps} />);
    const colorBtn = screen.getByRole('button', { name: /change note color/i });
    await user.click(colorBtn);
    // Color buttons for each color should appear
    expect(screen.getByRole('button', { name: /yellow/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /blue/i })).toBeTruthy();
  });

  it('calls updateNote with new color when color is selected', async () => {
    const updateNote = vi.fn();
    const user = userEvent.setup();
    render(<StickyNote {...baseProps} updateNote={updateNote} />);
    await user.click(screen.getByRole('button', { name: /change note color/i }));
    await user.click(screen.getByRole('button', { name: /blue/i }));
    expect(updateNote).toHaveBeenCalledWith('note-1', { color: 'blue' });
  });
});

// ─── LabelBlock ───────────────────────────────────────────────────────────────

describe('LabelBlock', () => {
  const baseProps = {
    node: makeLabelNode(),
    onOpenEditor: vi.fn(),
    isSelected: false,
    isDragging: false,
  };

  it('renders the label name', () => {
    render(<LabelBlock {...baseProps} />);
    expect(screen.getByText('start')).toBeTruthy();
  });

  it('applies selected border class when isSelected is true', () => {
    const { container } = render(<LabelBlock {...baseProps} isSelected={true} />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/indigo/);
  });

  it('shows entry badge when isEntry is true', () => {
    const { container } = render(<LabelBlock {...baseProps} isEntry={true} />);
    expect(container.innerHTML).toMatch(/entry|Entry/i);
  });

  it('shows unreachable badge when isUnreachable is true', () => {
    const { container } = render(<LabelBlock {...baseProps} isUnreachable={true} />);
    expect(container.innerHTML).toMatch(/unreachable/i);
  });

  it('shows dead-end badge when isDeadEnd is true', () => {
    const { container } = render(<LabelBlock {...baseProps} isDeadEnd={true} />);
    expect(container.innerHTML).toMatch(/dead.end/i);
  });

  it('shows overlay badge when overlayHighlight is hub', () => {
    const { container } = render(<LabelBlock {...baseProps} overlayHighlight="hub" overlayCount={3} />);
    expect(container.innerHTML).toMatch(/3/);
  });

  it('calls onOpenEditor when the node is double-clicked', async () => {
    const onOpenEditor = vi.fn();
    const user = userEvent.setup();
    render(<LabelBlock {...baseProps} onOpenEditor={onOpenEditor} />);
    const el = screen.getByText('start').closest('[aria-label]') as HTMLElement;
    await user.dblClick(el);
    expect(onOpenEditor).toHaveBeenCalled();
  });
});

// ─── CodeBlock ────────────────────────────────────────────────────────────────

describe('CodeBlock', () => {
  const block = createBlock();
  const analysisResult = createEmptyAnalysisResult();

  const baseProps = {
    block,
    analysisResult,
    updateBlock: vi.fn(),
    deleteBlock: vi.fn(),
    onOpenEditor: vi.fn(),
    isSelected: false,
    isDragging: false,
    isRoot: false,
    isLeaf: false,
    isBranching: false,
    isDimmed: false,
    isUsageHighlighted: false,
    isHoverHighlighted: false,
    isDirty: false,
    isScreenBlock: false,
    isConfigBlock: false,
    isFlashing: false,
  };

  it('renders without crashing', () => {
    const { container } = render(<CodeBlock {...baseProps} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('shows the file name as default title', () => {
    const b = createBlock({ title: undefined, filePath: 'game/script.rpy' });
    render(<CodeBlock {...baseProps} block={b} />);
    expect(screen.getByText('script')).toBeTruthy();
  });

  it('shows an explicit title when provided', () => {
    const b = createBlock({ title: 'My Scene' });
    render(<CodeBlock {...baseProps} block={b} />);
    expect(screen.getByText('My Scene')).toBeTruthy();
  });

  it('shows dirty indicator when isDirty is true', () => {
    const { container } = render(<CodeBlock {...baseProps} isDirty={true} />);
    // Dirty state adds a visual indicator — look for the unsaved dot or similar
    expect(container.innerHTML).toMatch(/dirty|unsaved|\*/i);
  });

  it('shows diagnostics error ring when diagnosticSeverity is error', () => {
    const { container } = render(
      <CodeBlock {...baseProps} diagnosticSeverity="error" />,
    );
    expect(container.innerHTML).toMatch(/red|error/i);
  });

  it('shows dimmed style when isDimmed is true', () => {
    const { container } = render(<CodeBlock {...baseProps} isDimmed={true} />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/opacity/);
  });

  it('enters title edit mode on double-click', async () => {
    const user = userEvent.setup();
    render(<CodeBlock {...baseProps} />);
    const titleEl = screen.getByText('start');
    await user.dblClick(titleEl);
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it('calls updateBlock when title is edited and saved', async () => {
    const updateBlock = vi.fn();
    const user = userEvent.setup();
    render(<CodeBlock {...baseProps} updateBlock={updateBlock} />);
    await user.dblClick(screen.getByText('start'));
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'New Title{Enter}');
    expect(updateBlock).toHaveBeenCalledWith('block-1', { title: 'New Title' });
  });

  it('sets title to undefined when saved empty (reverts to filename)', async () => {
    const updateBlock = vi.fn();
    const user = userEvent.setup();
    render(<CodeBlock {...baseProps} updateBlock={updateBlock} />);
    await user.dblClick(screen.getByText('start'));
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.keyboard('{Enter}');
    expect(updateBlock).toHaveBeenCalledWith('block-1', { title: undefined });
  });
});
