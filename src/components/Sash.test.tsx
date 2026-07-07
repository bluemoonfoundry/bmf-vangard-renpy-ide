import { vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import Sash from './Sash';

describe('Sash', () => {
  afterEach(() => {
    // Clean up any window listeners left open by tests that fired pointerDown without pointerUp
    fireEvent.pointerUp(window);
  });

  it('renders horizontal sash by default', () => {
    const { container } = render(<Sash onDrag={vi.fn()} />);
    const sash = container.firstChild as HTMLElement;
    expect(sash).toHaveClass('cursor-col-resize');
    expect(sash).not.toHaveClass('cursor-row-resize');
  });

  it('renders vertical sash when direction=vertical', () => {
    const { container } = render(<Sash onDrag={vi.fn()} direction="vertical" />);
    const sash = container.firstChild as HTMLElement;
    expect(sash).toHaveClass('cursor-row-resize');
    expect(sash).not.toHaveClass('cursor-col-resize');
  });

  it('sets pointer capture on pointerdown', () => {
    const { container } = render(<Sash onDrag={vi.fn()} />);
    const sash = container.firstChild as HTMLElement;
    const setPointerCapture = vi.fn();
    sash.setPointerCapture = setPointerCapture;
    sash.releasePointerCapture = vi.fn();

    fireEvent.pointerDown(sash, { pointerId: 42 });

    expect(setPointerCapture).toHaveBeenCalledWith(42);
  });

  it('calls onDrag with movementX on horizontal drag', () => {
    const onDrag = vi.fn();
    const { container } = render(<Sash onDrag={onDrag} />);
    const sash = container.firstChild as HTMLElement;
    sash.setPointerCapture = vi.fn();
    sash.releasePointerCapture = vi.fn();

    fireEvent.pointerDown(sash, { pointerId: 1 });
    fireEvent.pointerMove(window, { movementX: 15, movementY: 8 });

    expect(onDrag).toHaveBeenCalledWith(15);
  });

  it('calls onDrag with movementY on vertical drag', () => {
    const onDrag = vi.fn();
    const { container } = render(<Sash onDrag={onDrag} direction="vertical" />);
    const sash = container.firstChild as HTMLElement;
    sash.setPointerCapture = vi.fn();
    sash.releasePointerCapture = vi.fn();

    fireEvent.pointerDown(sash, { pointerId: 1 });
    fireEvent.pointerMove(window, { movementX: 15, movementY: 8 });

    expect(onDrag).toHaveBeenCalledWith(8);
  });

  it('removes pointermove listener on pointerup so no further drags fire', () => {
    const onDrag = vi.fn();
    const { container } = render(<Sash onDrag={onDrag} />);
    const sash = container.firstChild as HTMLElement;
    sash.setPointerCapture = vi.fn();
    sash.releasePointerCapture = vi.fn();

    fireEvent.pointerDown(sash, { pointerId: 1 });
    fireEvent.pointerUp(window);
    fireEvent.pointerMove(window, { movementX: 20 });

    expect(onDrag).not.toHaveBeenCalled();
  });

  it('releases pointer capture on pointerup', () => {
    const { container } = render(<Sash onDrag={vi.fn()} />);
    const sash = container.firstChild as HTMLElement;
    sash.setPointerCapture = vi.fn();
    const releasePointerCapture = vi.fn();
    sash.releasePointerCapture = releasePointerCapture;

    fireEvent.pointerDown(sash, { pointerId: 7 });
    fireEvent.pointerUp(window);

    expect(releasePointerCapture).toHaveBeenCalledWith(7);
  });

  it('accumulates multiple drag moves', () => {
    const onDrag = vi.fn();
    const { container } = render(<Sash onDrag={onDrag} />);
    const sash = container.firstChild as HTMLElement;
    sash.setPointerCapture = vi.fn();
    sash.releasePointerCapture = vi.fn();

    fireEvent.pointerDown(sash, { pointerId: 1 });
    fireEvent.pointerMove(window, { movementX: 5 });
    fireEvent.pointerMove(window, { movementX: -3 });
    fireEvent.pointerMove(window, { movementX: 10 });

    expect(onDrag).toHaveBeenCalledTimes(3);
    expect(onDrag).toHaveBeenNthCalledWith(1, 5);
    expect(onDrag).toHaveBeenNthCalledWith(2, -3);
    expect(onDrag).toHaveBeenNthCalledWith(3, 10);
  });
});
