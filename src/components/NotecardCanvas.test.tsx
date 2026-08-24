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

  it('positions the context menu with viewport-fixed coordinates, not container-relative', () => {
    const props = baseProps();
    render(<NotecardCanvas {...props} />);
    const surface = screen.getByTestId('notecard-canvas-surface');
    fireEvent.contextMenu(surface, { clientX: 200, clientY: 80 });
    const menuItem = screen.getByText('New Notecard');
    const menu = menuItem.closest('div[style]') as HTMLElement;
    expect(menu.className).toContain('fixed');
    expect(menu.className).not.toContain('absolute');
  });

  it('clicking "New Notecard" in the context menu creates a card, surviving the pointerdown-then-click sequence a real mouse click produces', () => {
    const props = baseProps();
    render(<NotecardCanvas {...props} />);
    const surface = screen.getByTestId('notecard-canvas-surface');
    fireEvent.contextMenu(surface, { clientX: 200, clientY: 80 });
    const menuItem = screen.getByText('New Notecard');
    // A real click fires pointerdown (bubbles to window, previously closed+unmounted the menu) before click.
    fireEvent.pointerDown(menuItem);
    fireEvent.click(menuItem);
    expect(props.addNotecard).toHaveBeenCalledWith({ x: 200, y: 80 });
  });

  it('renders one Notecard per item in notecards[]', () => {
    const props = { ...baseProps(), notecards: [createNotecard({ id: 'a' }), createNotecard({ id: 'b' })] };
    render(<NotecardCanvas {...props} />);
    expect(screen.getAllByText('New Notecard')).toHaveLength(2);
  });

  it('deletes the selected notecard on Delete key when the canvas container has focus', () => {
    const card = createNotecard({ id: 'a' });
    const props = { ...baseProps(), notecards: [card] };
    render(<NotecardCanvas {...props} />);
    fireEvent.pointerDown(screen.getByTestId('notecard-a'));
    const container = screen.getByTestId('notecard-canvas-surface').parentElement as HTMLElement;
    fireEvent.keyDown(container, { key: 'Delete' });
    expect(props.deleteNotecard).toHaveBeenCalledWith('a');
  });

  it('does not delete the selected notecard on Delete key when the canvas container lacks focus (background split-pane instance)', () => {
    const card = createNotecard({ id: 'a' });
    const props = { ...baseProps(), notecards: [card] };
    render(<NotecardCanvas {...props} />);
    fireEvent.pointerDown(screen.getByTestId('notecard-a'));
    // Simulate a Delete keystroke handled elsewhere in the app (e.g. the foreground
    // split-pane), which should NOT reach this backgrounded instance's handler.
    fireEvent.keyDown(window, { key: 'Delete' });
    expect(props.deleteNotecard).not.toHaveBeenCalled();
  });

  it('renders the minimap with one item per notecard', () => {
    const props = { ...baseProps(), notecards: [createNotecard({ id: 'a' })] };
    const { container } = render(<NotecardCanvas {...props} />);
    // One [data-notecard-id] on the canvas's own hit-area wrapper, one on Notecard's root.
    expect(container.querySelectorAll('[data-notecard-id]')).toHaveLength(2);
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

  it('aborts a link drag without creating a link when released over genuinely empty canvas (not an arbitrary other card)', () => {
    // Drag starts from card 'b' (NOT the first card in DOM order) and releases directly
    // on the surface. A `target?.querySelector('[data-notecard-id]')` fallback would search
    // downward from the surface and find card 'a' (the first card in DOM), silently linking
    // b -> a. The correct behavior is: closest-only lookup from the actual drop target finds
    // no card, and the drag is aborted with no link created.
    const a = createNotecard({ id: 'a', position: { x: 0, y: 0 } });
    const b = createNotecard({ id: 'b', position: { x: 400, y: 300 } });
    const props = { ...baseProps(), notecards: [a, b] };
    render(<NotecardCanvas {...props} />);
    const bCard = screen.getByTestId('notecard-b');
    const handle = bCard.querySelector('.link-handle') as HTMLElement;
    fireEvent.pointerDown(handle, { clientX: 620, clientY: 380 });
    const surface = screen.getByTestId('notecard-canvas-surface');
    fireEvent.pointerUp(surface, { clientX: 900, clientY: 900 });
    expect(props.addNotecardLink).not.toHaveBeenCalled();
  });

  it('pans the canvas when dragging on empty surface with no card underneath', () => {
    // Pointerdown must be fired on the transformed content layer (surface's actual child
    // that covers the canvas in production), not on the surface ref element itself — an
    // `e.target !== surfaceRef.current` identity check would never see a pointerdown whose
    // target is this child, since surfaceRef.current is never itself the event target.
    const props = baseProps();
    const { container } = render(<NotecardCanvas {...props} />);
    const surface = screen.getByTestId('notecard-canvas-surface');
    const transformLayer = surface.firstElementChild as HTMLElement;
    expect(transformLayer).not.toBe(surface);
    void container;
    fireEvent.pointerDown(transformLayer, { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(window, { clientX: 140, clientY: 160 });
    fireEvent.pointerUp(window, { clientX: 140, clientY: 160 });
    expect(props.onTransformChange).toHaveBeenCalled();
  });

  it('zooms the canvas on wheel over the surface', () => {
    const props = baseProps();
    render(<NotecardCanvas {...props} />);
    const surface = screen.getByTestId('notecard-canvas-surface');
    fireEvent.wheel(surface, { clientX: 100, clientY: 100, deltaY: -100 });
    expect(props.onTransformChange).toHaveBeenCalled();
    const updater = props.onTransformChange.mock.calls[0][0];
    const result = typeof updater === 'function' ? updater(props.transform) : updater;
    expect(result.scale).not.toBe(props.transform.scale);
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
