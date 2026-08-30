import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NotecardCanvas from '@/components/NotecardCanvas';
import { createNotecard } from '@/test/mocks/sampleData';

const baseProps = () => ({
  notecards: [],
  notecardLinks: [],
  updateNotecard: vi.fn(),
  deleteNotecard: vi.fn(),
  deleteNotecards: vi.fn(),
  restoreNotecards: vi.fn(),
  addNotecard: vi.fn(),
  addNotecardLink: vi.fn(),
  updateNotecardLink: vi.fn(),
  deleteNotecardLink: vi.fn(),
  timelineSettings: { slotLabels: {} },
  renameTimelineSlot: vi.fn(),
  moveNotecardWithinTimeline: vi.fn(),
  unassignNotecardFromTimeline: vi.fn(),
  insertTimelineSlot: vi.fn(),
  deleteTimelineSlot: vi.fn(),
  transform: { x: 0, y: 0, scale: 1 },
  onTransformChange: vi.fn(),
});

/** Overrides an element's getBoundingClientRect (jsdom returns all-zero rects by default,
 * which is fine for the Unsorted pane's toWorld() math but not for the Timeline pane's
 * pointer-hit-testing, which needs real-looking geometry to resolve a column/index). */
function mockRect(el: Element, rect: { left: number; top: number; right: number; bottom: number }) {
  el.getBoundingClientRect = () => ({
    ...rect,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top,
    x: rect.left,
    y: rect.top,
    toJSON: () => {},
  });
}

describe('NotecardCanvas', () => {
  it('calls addNotecard with world-space coordinates on double-click of empty canvas', () => {
    const props = baseProps();
    render(<NotecardCanvas {...props} />);
    const surface = screen.getByTestId('notecard-canvas-surface');
    fireEvent.doubleClick(surface, { clientX: 150, clientY: 120 });
    expect(props.addNotecard).toHaveBeenCalledWith({ x: 150, y: 120 });
  });

  it('does not call addNotecard when double-clicking an existing card to edit it', () => {
    const card = createNotecard({ id: 'a', title: 'Plot Beat' });
    const props = { ...baseProps(), notecards: [card] };
    render(<NotecardCanvas {...props} />);
    fireEvent.doubleClick(screen.getByText('Plot Beat'));
    expect(props.addNotecard).not.toHaveBeenCalled();
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

  it('renders one Notecard per unsorted item in notecards[]', () => {
    const props = { ...baseProps(), notecards: [createNotecard({ id: 'a' }), createNotecard({ id: 'b' })] };
    render(<NotecardCanvas {...props} />);
    expect(screen.getAllByText('New Notecard')).toHaveLength(2);
  });

  it('deletes the selected notecard on Delete key when the canvas container has focus', () => {
    const card = createNotecard({ id: 'a' });
    const props = { ...baseProps(), notecards: [card] };
    render(<NotecardCanvas {...props} />);
    fireEvent.pointerDown(screen.getByTestId('notecard-a'));
    const container = screen.getByTestId('notecard-canvas-root');
    fireEvent.keyDown(container, { key: 'Delete' });
    expect(props.deleteNotecards).toHaveBeenCalledWith(['a']);
  });

  it('does not delete the selected notecard on Delete key when the canvas container lacks focus (background split-pane instance)', () => {
    const card = createNotecard({ id: 'a' });
    const props = { ...baseProps(), notecards: [card] };
    render(<NotecardCanvas {...props} />);
    fireEvent.pointerDown(screen.getByTestId('notecard-a'));
    // Simulate a Delete keystroke handled elsewhere in the app (e.g. the foreground
    // split-pane), which should NOT reach this backgrounded instance's handler.
    fireEvent.keyDown(window, { key: 'Delete' });
    expect(props.deleteNotecards).not.toHaveBeenCalled();
  });

  it('renders the minimap with one item per unsorted notecard', () => {
    const props = { ...baseProps(), notecards: [createNotecard({ id: 'a' })] };
    const { container } = render(<NotecardCanvas {...props} />);
    // One [data-notecard-id] on the canvas's own hit-area wrapper, one on Notecard's root.
    expect(container.querySelectorAll('[data-notecard-id]')).toHaveLength(2);
  });

  it('renders one arrow per notecardLink between two unsorted cards', () => {
    const a = createNotecard({ id: 'a', position: { x: 0, y: 0 } });
    const b = createNotecard({ id: 'b', position: { x: 400, y: 300 } });
    const link = { id: 'l1', fromId: 'a', toId: 'b' };
    const props = { ...baseProps(), notecards: [a, b], notecardLinks: [link] };
    const { container } = render(<NotecardCanvas {...props} />);
    expect(container.querySelectorAll('[data-notecard-link-id]')).toHaveLength(1);
  });

  it('clips the link arrow to the card edges, not centers, so it is not hidden underneath the target card', () => {
    // Cards paint above the link SVG, so a line drawn to the target card's *center* — where
    // the arrowhead marker sits — would render completely invisible underneath the card body.
    const a = createNotecard({ id: 'a', position: { x: 0, y: 0 }, width: 220, height: 160 });
    const b = createNotecard({ id: 'b', position: { x: 400, y: 300 }, width: 220, height: 160 });
    const link = { id: 'l1', fromId: 'a', toId: 'b' };
    const props = { ...baseProps(), notecards: [a, b], notecardLinks: [link] };
    const { container } = render(<NotecardCanvas {...props} />);
    const line = container.querySelector('[data-notecard-link-id="l1"] line') as SVGLineElement;
    const aCenter = { x: 110, y: 80 };
    const bCenter = { x: 510, y: 380 };
    expect(Number(line.getAttribute('x1'))).not.toBeCloseTo(aCenter.x, 0);
    expect(Number(line.getAttribute('y1'))).not.toBeCloseTo(aCenter.y, 0);
    expect(Number(line.getAttribute('x2'))).not.toBeCloseTo(bCenter.x, 0);
    expect(Number(line.getAttribute('y2'))).not.toBeCloseTo(bCenter.y, 0);
    // The clipped start point should sit exactly on card a's bottom edge (y=160).
    expect(Number(line.getAttribute('y1'))).toBeCloseTo(160, 5);
    // The clipped end point should sit exactly on card b's top edge (y=300).
    expect(Number(line.getAttribute('y2'))).toBeCloseTo(300, 5);
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

  it('pans the canvas when Ctrl-dragging on empty surface with no card underneath', () => {
    const props = baseProps();
    render(<NotecardCanvas {...props} />);
    const surface = screen.getByTestId('notecard-canvas-surface');
    const transformLayer = surface.firstElementChild as HTMLElement;
    expect(transformLayer).not.toBe(surface);
    fireEvent.pointerDown(transformLayer, { clientX: 100, clientY: 100, ctrlKey: true });
    fireEvent.pointerMove(window, { clientX: 140, clientY: 160 });
    fireEvent.pointerUp(window, { clientX: 140, clientY: 160 });
    expect(props.onTransformChange).toHaveBeenCalled();
  });

  it('rubber-band selects notecards fully inside the drag rect on a plain (non-Ctrl) empty-canvas drag, without panning', () => {
    const a = createNotecard({ id: 'a', position: { x: 0, y: 0 } });
    const b = createNotecard({ id: 'b', position: { x: 400, y: 300 } });
    const props = { ...baseProps(), notecards: [a, b] };
    render(<NotecardCanvas {...props} />);
    const surface = screen.getByTestId('notecard-canvas-surface');
    const transformLayer = surface.firstElementChild as HTMLElement;
    fireEvent.pointerDown(transformLayer, { clientX: -10, clientY: -10 });
    fireEvent.pointerMove(window, { clientX: 250, clientY: 200 });
    fireEvent.pointerUp(window, { clientX: 250, clientY: 200 });
    expect(props.onTransformChange).not.toHaveBeenCalled();
    // Card 'a' (0,0 220x160) is inside the (-10,-10)-(250,200) rect; card 'b' (400,300) is not.
    expect(screen.getByTestId('notecard-a').querySelector('.notecard-wrapper')?.className).toContain('ring-2');
    expect(screen.getByTestId('notecard-b').querySelector('.notecard-wrapper')?.className).not.toContain('ring-2');
  });

  it('a plain click (no drag) on empty canvas clears the selection', () => {
    const a = createNotecard({ id: 'a', position: { x: 0, y: 0 } });
    const props = { ...baseProps(), notecards: [a] };
    render(<NotecardCanvas {...props} />);
    fireEvent.pointerDown(screen.getByTestId('notecard-a'));
    const surface = screen.getByTestId('notecard-canvas-surface');
    const transformLayer = surface.firstElementChild as HTMLElement;
    fireEvent.pointerDown(transformLayer, { clientX: 900, clientY: 900 });
    fireEvent.pointerUp(window, { clientX: 900, clientY: 900 });
    expect(screen.getByTestId('notecard-a').querySelector('.notecard-wrapper')?.className).not.toContain('ring-2');
  });

  it('selects all unsorted notecards on Cmd/Ctrl+A when the canvas container has focus', () => {
    const a = createNotecard({ id: 'a', position: { x: 0, y: 0 } });
    const b = createNotecard({ id: 'b', position: { x: 400, y: 300 } });
    const props = { ...baseProps(), notecards: [a, b] };
    render(<NotecardCanvas {...props} />);
    const container = screen.getByTestId('notecard-canvas-root');
    fireEvent.keyDown(container, { key: 'a', ctrlKey: true });
    expect(screen.getByTestId('notecard-a').querySelector('.notecard-wrapper')?.className).toContain('ring-2');
    expect(screen.getByTestId('notecard-b').querySelector('.notecard-wrapper')?.className).toContain('ring-2');
  });

  it('deletes every selected notecard (and links touching them) on Delete', () => {
    const a = createNotecard({ id: 'a', position: { x: 0, y: 0 } });
    const b = createNotecard({ id: 'b', position: { x: 400, y: 300 } });
    const link = { id: 'l1', fromId: 'a', toId: 'b' };
    const props = { ...baseProps(), notecards: [a, b], notecardLinks: [link] };
    render(<NotecardCanvas {...props} />);
    const container = screen.getByTestId('notecard-canvas-root');
    fireEvent.keyDown(container, { key: 'a', ctrlKey: true });
    fireEvent.keyDown(container, { key: 'Delete' });
    expect(props.deleteNotecards).toHaveBeenCalledWith(expect.arrayContaining(['a', 'b']));
    expect((props.deleteNotecards as ReturnType<typeof vi.fn>).mock.calls[0][0]).toHaveLength(2);
  });

  it('restores the last bulk-deleted cards and links on Cmd/Ctrl+Z', () => {
    const a = createNotecard({ id: 'a', position: { x: 0, y: 0 } });
    const b = createNotecard({ id: 'b', position: { x: 400, y: 300 } });
    const link = { id: 'l1', fromId: 'a', toId: 'b' };
    const props = { ...baseProps(), notecards: [a, b], notecardLinks: [link] };
    render(<NotecardCanvas {...props} />);
    const container = screen.getByTestId('notecard-canvas-root');
    fireEvent.keyDown(container, { key: 'a', ctrlKey: true });
    fireEvent.keyDown(container, { key: 'Delete' });
    fireEvent.keyDown(container, { key: 'z', ctrlKey: true });
    expect(props.restoreNotecards).toHaveBeenCalledWith(
      expect.arrayContaining([a, b]),
      expect.arrayContaining([link]),
    );
  });

  it('does not intercept Cmd/Ctrl+Z when there is nothing local to undo, letting it bubble to the app-level handler', () => {
    const a = createNotecard({ id: 'a' });
    const props = { ...baseProps(), notecards: [a] };
    render(<NotecardCanvas {...props} />);
    const container = screen.getByTestId('notecard-canvas-root');
    const event = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true, cancelable: true });
    const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');
    container.dispatchEvent(event);
    expect(stopPropagationSpy).not.toHaveBeenCalled();
    expect(props.restoreNotecards).not.toHaveBeenCalled();
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

  it('does not zoom the canvas on wheel over a notecard, letting the card scroll its own content instead', () => {
    const a = createNotecard({ id: 'a', position: { x: 0, y: 0 } });
    const props = { ...baseProps(), notecards: [a] };
    render(<NotecardCanvas {...props} />);
    fireEvent.wheel(screen.getByTestId('notecard-a'), { clientX: 100, clientY: 100, deltaY: -100 });
    expect(props.onTransformChange).not.toHaveBeenCalled();
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

  describe('panes: collapse/expand', () => {
    it('collapses the Timeline pane, hiding its columns, when its collapse chevron is clicked', () => {
      const props = baseProps();
      render(<NotecardCanvas {...props} />);
      expect(screen.getByTestId('timeline-slot-0')).toBeInTheDocument();
      fireEvent.click(screen.getByTitle('Collapse Timeline'));
      expect(screen.queryByTestId('timeline-slot-0')).toBeNull();
      expect(screen.getByText('Timeline (collapsed)')).toBeInTheDocument();
    });

    it('re-expands the Timeline pane from its collapsed strip', () => {
      const props = baseProps();
      render(<NotecardCanvas {...props} />);
      fireEvent.click(screen.getByTitle('Collapse Timeline'));
      fireEvent.click(screen.getByTitle('Expand Timeline'));
      expect(screen.getByTestId('timeline-slot-0')).toBeInTheDocument();
    });

    it('collapses the Unsorted pane, hiding its surface, when its collapse chevron is clicked', () => {
      const props = baseProps();
      render(<NotecardCanvas {...props} />);
      expect(screen.getByTestId('notecard-canvas-surface')).toBeInTheDocument();
      fireEvent.click(screen.getByTitle('Collapse Unsorted'));
      expect(screen.queryByTestId('notecard-canvas-surface')).toBeNull();
      expect(screen.getByText('Unsorted (collapsed)')).toBeInTheDocument();
    });
  });

  describe('timeline columns', () => {
    it('renders one Kanban column with the default "Scene 1" label when the board has no cards yet', () => {
      const props = baseProps();
      render(<NotecardCanvas {...props} />);
      expect(screen.getByTestId('timeline-slot-0')).toBeInTheDocument();
      expect(screen.getByText('Scene 1')).toBeInTheDocument();
    });

    it('renders a trailing empty column past the highest occupied slot', () => {
      const card = createNotecard({ id: 'a', timelineSlot: 0, timelineOrder: 0 });
      const props = { ...baseProps(), notecards: [card] };
      render(<NotecardCanvas {...props} />);
      expect(screen.getByTestId('timeline-slot-0')).toBeInTheDocument();
      expect(screen.getByTestId('timeline-slot-1')).toBeInTheDocument();
      expect(screen.queryByTestId('timeline-slot-2')).toBeNull();
    });

    it('renders cards within a column sorted by timelineOrder, not array order', () => {
      const second = createNotecard({ id: 'second', title: 'Second', timelineSlot: 0, timelineOrder: 1 });
      const first = createNotecard({ id: 'first', title: 'First', timelineSlot: 0, timelineOrder: 0 });
      const props = { ...baseProps(), notecards: [second, first] };
      render(<NotecardCanvas {...props} />);
      const column = screen.getByTestId('timeline-slot-0');
      const titles = Array.from(column.querySelectorAll('[data-kanban-card-id]')).map(el => el.getAttribute('data-kanban-card-id'));
      expect(titles).toEqual(['first', 'second']);
    });

    it('renames a slot label on blur after editing', () => {
      const props = baseProps();
      render(<NotecardCanvas {...props} />);
      fireEvent.click(screen.getByText('Scene 1'));
      const input = screen.getByDisplayValue('Scene 1');
      fireEvent.change(input, { target: { value: 'Opening' } });
      fireEvent.blur(input);
      expect(props.renameTimelineSlot).toHaveBeenCalledWith(0, 'Opening');
    });

    it('offers slot management actions on right-click of a slot label', () => {
      const props = baseProps();
      render(<NotecardCanvas {...props} />);
      fireEvent.contextMenu(screen.getByText('Scene 1'));
      expect(screen.getByText('Insert Scene Before')).toBeInTheDocument();
      expect(screen.getByText('Insert Scene After')).toBeInTheDocument();
      expect(screen.getByText('Delete This Scene')).toBeInTheDocument();
    });

    it('"Insert Scene Before" calls insertTimelineSlot with the clicked slot index', () => {
      const props = baseProps();
      render(<NotecardCanvas {...props} />);
      fireEvent.contextMenu(screen.getByText('Scene 1'));
      fireEvent.click(screen.getByText('Insert Scene Before'));
      expect(props.insertTimelineSlot).toHaveBeenCalledWith(0);
    });

    it('"Insert Scene After" calls insertTimelineSlot with the clicked slot index plus one', () => {
      const props = baseProps();
      render(<NotecardCanvas {...props} />);
      fireEvent.contextMenu(screen.getByText('Scene 1'));
      fireEvent.click(screen.getByText('Insert Scene After'));
      expect(props.insertTimelineSlot).toHaveBeenCalledWith(1);
    });

    it('"Delete This Scene" calls deleteTimelineSlot with the clicked slot index', () => {
      const props = baseProps();
      render(<NotecardCanvas {...props} />);
      fireEvent.contextMenu(screen.getByText('Scene 1'));
      fireEvent.click(screen.getByText('Delete This Scene'));
      expect(props.deleteTimelineSlot).toHaveBeenCalledWith(0);
    });
  });

  describe('clipboard export', () => {
    const clipboardMock = { writeText: vi.fn().mockResolvedValue(undefined) };
    beforeEach(() => {
      clipboardMock.writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(window.navigator, 'clipboard', { value: clipboardMock, configurable: true });
    });

    it('does not show "Copy Full Timeline" when no card is on the timeline', () => {
      const props = { ...baseProps(), notecards: [createNotecard({ id: 'a' })] };
      render(<NotecardCanvas {...props} />);
      expect(screen.queryByText('Copy Full Timeline')).toBeNull();
    });

    it('copies every occupied slot in order via "Copy Full Timeline"', async () => {
      const a = createNotecard({ id: 'a', title: 'Opening Beat', content: 'It begins.', timelineSlot: 0, timelineOrder: 0 });
      const b = createNotecard({ id: 'b', title: 'Second Beat', content: 'It continues.', timelineSlot: 1, timelineOrder: 0 });
      const props = { ...baseProps(), notecards: [a, b] };
      render(<NotecardCanvas {...props} />);
      fireEvent.click(screen.getByText('Copy Full Timeline'));
      expect(clipboardMock.writeText).toHaveBeenCalledWith(
        '# Scene 1\n\n# Opening Beat\nIt begins.\n\n# Scene 2\n\n# Second Beat\nIt continues.',
      );
    });

    it('offers "Copy Scene Content" on right-click of an unsorted card', () => {
      const card = createNotecard({ id: 'a', title: 'Opening Beat', content: 'It begins.' });
      const props = { ...baseProps(), notecards: [card] };
      render(<NotecardCanvas {...props} />);
      fireEvent.contextMenu(screen.getByTestId('notecard-a'));
      fireEvent.click(screen.getByText('Copy Scene Content'));
      expect(clipboardMock.writeText).toHaveBeenCalledWith('# Opening Beat\nIt begins.');
    });

    it('offers "Copy Scene Content" on right-click of a Kanban card', () => {
      const card = createNotecard({ id: 'a', title: 'Opening Beat', content: 'It begins.', timelineSlot: 0, timelineOrder: 0 });
      const props = { ...baseProps(), notecards: [card] };
      render(<NotecardCanvas {...props} />);
      fireEvent.contextMenu(screen.getByTestId('kanban-card-a'));
      fireEvent.click(screen.getByText('Copy Scene Content'));
      expect(clipboardMock.writeText).toHaveBeenCalledWith('# Opening Beat\nIt begins.');
    });
  });

  describe('drag between panes and within a column', () => {
    it('pins an Unsorted card into a Timeline column when dropped there', () => {
      const card = createNotecard({ id: 'a', position: { x: 0, y: 0 } });
      const props = { ...baseProps(), notecards: [card] };
      render(<NotecardCanvas {...props} />);

      mockRect(screen.getByTestId('notecard-timeline-pane'), { left: 0, top: 0, right: 1000, bottom: 300 });
      mockRect(screen.getByTestId('timeline-slot-0'), { left: 0, top: 0, right: 200, bottom: 300 });

      const handle = screen.getByTestId('notecard-a').querySelector('.drag-handle') as HTMLElement;
      fireEvent.pointerDown(handle, { clientX: 50, clientY: 400 });
      fireEvent.pointerMove(window, { clientX: 100, clientY: 100 });
      fireEvent.pointerUp(window, { clientX: 100, clientY: 100 });

      expect(props.moveNotecardWithinTimeline).toHaveBeenCalledWith('a', 0, 0);
    });

    it('unpins a Kanban card and drops it into Unsorted world space when dragged out of the Timeline pane', () => {
      const card = createNotecard({ id: 'a', width: 220, height: 160, timelineSlot: 0, timelineOrder: 0 });
      const props = { ...baseProps(), notecards: [card] };
      render(<NotecardCanvas {...props} />);

      // No rect mocked for the timeline pane, so jsdom's default all-zero rect means the
      // pointer is never "inside" it — every point resolves to "over Unsorted" instead.
      const handle = screen.getByTestId('kanban-card-a').querySelector('.drag-handle') as HTMLElement;
      fireEvent.pointerDown(handle, { clientX: 50, clientY: 50 });
      fireEvent.pointerUp(window, { clientX: 300, clientY: 250 });

      expect(props.unassignNotecardFromTimeline).toHaveBeenCalledWith('a', { x: 300 - 110, y: 250 - 80 });
    });

    it('live-reorders within a column: dropping above an existing card inserts before it', () => {
      const dragged = createNotecard({ id: 'dragged', timelineSlot: 0, timelineOrder: 1 });
      const existing = createNotecard({ id: 'existing', timelineSlot: 0, timelineOrder: 0 });
      const props = { ...baseProps(), notecards: [existing, dragged] };
      render(<NotecardCanvas {...props} />);

      mockRect(screen.getByTestId('notecard-timeline-pane'), { left: 0, top: 0, right: 1000, bottom: 300 });
      mockRect(screen.getByTestId('timeline-slot-0'), { left: 0, top: 0, right: 200, bottom: 300 });
      mockRect(screen.getByTestId('kanban-card-existing'), { left: 0, top: 100, right: 200, bottom: 160 });

      const handle = screen.getByTestId('kanban-card-dragged').querySelector('.drag-handle') as HTMLElement;
      fireEvent.pointerDown(handle, { clientX: 100, clientY: 200 });
      // Above existing's midpoint (130) -> should insert before it, at index 0.
      fireEvent.pointerMove(window, { clientX: 100, clientY: 110 });
      fireEvent.pointerUp(window, { clientX: 100, clientY: 110 });

      expect(props.moveNotecardWithinTimeline).toHaveBeenCalledWith('dragged', 0, 0);
    });

    it('moves a card from one column to another on drop', () => {
      const card = createNotecard({ id: 'a', timelineSlot: 0, timelineOrder: 0 });
      const props = { ...baseProps(), notecards: [card] };
      render(<NotecardCanvas {...props} />);

      mockRect(screen.getByTestId('notecard-timeline-pane'), { left: 0, top: 0, right: 1000, bottom: 300 });
      mockRect(screen.getByTestId('timeline-slot-0'), { left: 0, top: 0, right: 200, bottom: 300 });
      mockRect(screen.getByTestId('timeline-slot-1'), { left: 200, top: 0, right: 400, bottom: 300 });

      const handle = screen.getByTestId('kanban-card-a').querySelector('.drag-handle') as HTMLElement;
      fireEvent.pointerDown(handle, { clientX: 100, clientY: 100 });
      fireEvent.pointerMove(window, { clientX: 300, clientY: 100 });
      fireEvent.pointerUp(window, { clientX: 300, clientY: 100 });

      expect(props.moveNotecardWithinTimeline).toHaveBeenCalledWith('a', 1, 0);
    });
  });
});
