import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NotecardCanvas from '@/components/NotecardCanvas';
import { createNotecard } from '@/test/mocks/sampleData';

const enabledTimeline = { enabled: true, originX: 0, railY: 0, slotSpacing: 260, slotLabels: {} };

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
  timelineSettings: { enabled: false, originX: 0, railY: 0, slotSpacing: 260, slotLabels: {} },
  toggleTimeline: vi.fn(),
  renameTimelineSlot: vi.fn(),
  snapNotecardToTimeline: vi.fn(),
  clearNotecardTimelineSlot: vi.fn(),
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

  it('pans the canvas when Ctrl-dragging on empty surface with no card underneath', () => {
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

  it('selects all notecards on Cmd/Ctrl+A when the canvas container has focus', () => {
    const a = createNotecard({ id: 'a', position: { x: 0, y: 0 } });
    const b = createNotecard({ id: 'b', position: { x: 400, y: 300 } });
    const props = { ...baseProps(), notecards: [a, b] };
    render(<NotecardCanvas {...props} />);
    const container = screen.getByTestId('notecard-canvas-surface').parentElement as HTMLElement;
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
    const container = screen.getByTestId('notecard-canvas-surface').parentElement as HTMLElement;
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
    const container = screen.getByTestId('notecard-canvas-surface').parentElement as HTMLElement;
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
    const container = screen.getByTestId('notecard-canvas-surface').parentElement as HTMLElement;
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

  describe('timeline', () => {
    const clipboardMock = { writeText: vi.fn().mockResolvedValue(undefined) };
    beforeEach(() => {
      clipboardMock.writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(window.navigator, 'clipboard', { value: clipboardMock, configurable: true });
    });

    it('does not render the rail when the timeline is disabled', () => {
      const props = { ...baseProps(), notecards: [createNotecard({ id: 'a' })] };
      const { container } = render(<NotecardCanvas {...props} />);
      expect(container.querySelector('[data-testid^="timeline-slot-"]')).toBeNull();
    });

    it('renders slot tick marks with default "Scene N" labels when the timeline is enabled', () => {
      const props = { ...baseProps(), notecards: [], timelineSettings: enabledTimeline };
      render(<NotecardCanvas {...props} />);
      expect(screen.getByText('Scene 1')).toBeInTheDocument();
    });

    it('clicking the Timeline toggle button calls toggleTimeline', () => {
      const props = baseProps();
      render(<NotecardCanvas {...props} />);
      fireEvent.click(screen.getByTitle('Toggle scene timeline'));
      expect(props.toggleTimeline).toHaveBeenCalled();
    });

    it('renames a slot label on blur after editing', () => {
      const props = { ...baseProps(), notecards: [], timelineSettings: enabledTimeline };
      render(<NotecardCanvas {...props} />);
      fireEvent.click(screen.getByText('Scene 1'));
      const input = screen.getByDisplayValue('Scene 1');
      fireEvent.change(input, { target: { value: 'Opening' } });
      fireEvent.blur(input);
      expect(props.renameTimelineSlot).toHaveBeenCalledWith(0, 'Opening');
    });

    it('snaps a card onto the timeline when its drag ends within the proximity band of the rail', () => {
      // Default card: position (30,0), height 160 -> center y=80 at drag start, within the
      // 90-unit band of railY=0 even with zero vertical movement.
      const card = createNotecard({ id: 'a', position: { x: 30, y: 0 } });
      const props = { ...baseProps(), notecards: [card], timelineSettings: enabledTimeline };
      render(<NotecardCanvas {...props} />);
      const handle = screen.getByTestId('notecard-a').querySelector('.drag-handle') as HTMLElement;
      fireEvent.pointerDown(handle, { clientX: 50, clientY: 50 });
      fireEvent.pointerUp(window, { clientX: 50, clientY: 50 });
      expect(props.snapNotecardToTimeline).toHaveBeenCalledWith('a');
      expect(props.clearNotecardTimelineSlot).not.toHaveBeenCalled();
    });

    it('clears a card\'s timeline slot when its drag ends far from the rail', () => {
      const card = createNotecard({ id: 'a', position: { x: 30, y: 0 }, timelineSlot: 1 });
      const props = { ...baseProps(), notecards: [card], timelineSettings: enabledTimeline };
      render(<NotecardCanvas {...props} />);
      const handle = screen.getByTestId('notecard-a').querySelector('.drag-handle') as HTMLElement;
      fireEvent.pointerDown(handle, { clientX: 50, clientY: 50 });
      fireEvent.pointerUp(window, { clientX: 50, clientY: 500 });
      expect(props.clearNotecardTimelineSlot).toHaveBeenCalledWith('a');
      expect(props.snapNotecardToTimeline).not.toHaveBeenCalled();
    });

    it('does not snap or clear a timeline slot when the timeline is disabled', () => {
      const card = createNotecard({ id: 'a', position: { x: 30, y: 0 } });
      const props = { ...baseProps(), notecards: [card] };
      render(<NotecardCanvas {...props} />);
      const handle = screen.getByTestId('notecard-a').querySelector('.drag-handle') as HTMLElement;
      fireEvent.pointerDown(handle, { clientX: 50, clientY: 50 });
      fireEvent.pointerUp(window, { clientX: 50, clientY: 50 });
      expect(props.snapNotecardToTimeline).not.toHaveBeenCalled();
      expect(props.clearNotecardTimelineSlot).not.toHaveBeenCalled();
    });

    it('does not show "Copy Full Timeline" when no card is on the timeline', () => {
      const props = { ...baseProps(), notecards: [createNotecard({ id: 'a' })], timelineSettings: enabledTimeline };
      render(<NotecardCanvas {...props} />);
      expect(screen.queryByText('Copy Full Timeline')).toBeNull();
    });

    it('copies every occupied slot in order via "Copy Full Timeline"', async () => {
      const a = createNotecard({ id: 'a', title: 'Opening Beat', content: 'It begins.', timelineSlot: 0, position: { x: 0, y: 0 } });
      const b = createNotecard({ id: 'b', title: 'Second Beat', content: 'It continues.', timelineSlot: 1, position: { x: 260, y: 0 } });
      const props = { ...baseProps(), notecards: [a, b], timelineSettings: enabledTimeline };
      render(<NotecardCanvas {...props} />);
      fireEvent.click(screen.getByText('Copy Full Timeline'));
      expect(clipboardMock.writeText).toHaveBeenCalledWith(
        '# Scene 1\n\n# Opening Beat\nIt begins.\n\n# Scene 2\n\n# Second Beat\nIt continues.',
      );
    });

    it('offers "Copy Scene Content" on right-click of a card', () => {
      const card = createNotecard({ id: 'a', title: 'Opening Beat', content: 'It begins.' });
      const props = { ...baseProps(), notecards: [card] };
      render(<NotecardCanvas {...props} />);
      fireEvent.contextMenu(screen.getByTestId('notecard-a'));
      const copyButton = screen.getByText('Copy Scene Content');
      fireEvent.click(copyButton);
      expect(clipboardMock.writeText).toHaveBeenCalledWith('# Opening Beat\nIt begins.');
    });
  });
});
