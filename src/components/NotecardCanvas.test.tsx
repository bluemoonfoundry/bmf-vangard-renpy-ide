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
