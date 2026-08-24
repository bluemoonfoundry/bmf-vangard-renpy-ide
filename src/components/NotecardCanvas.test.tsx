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
});
