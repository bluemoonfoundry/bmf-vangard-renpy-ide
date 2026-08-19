import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SpriteTimelineTrack from './SpriteTimelineTrack';
import type { KeyframeTrack } from '@/types';

function emptyTrack(): KeyframeTrack {
  return { property: 'alpha', keyframes: [] };
}

function trackWithOne(): KeyframeTrack {
  return { property: 'alpha', keyframes: [{ id: 'kf-1', time: 1, value: 0.5, easing: 'linear' }] };
}

describe('SpriteTimelineTrack', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 0, top: 0, right: 200, bottom: 20, width: 200, height: 20, x: 0, y: 0, toJSON: () => {},
    } as DOMRect);
  });
  afterEach(() => vi.restoreAllMocks());

  it('renders a dot for each existing keyframe', () => {
    render(<SpriteTimelineTrack track={trackWithOne()} duration={2} currentValue={1} onChangeTrack={() => {}} />);
    expect(screen.getByRole('button', { name: /Alpha keyframe at 1.00s/ })).toBeInTheDocument();
  });

  it('adds a keyframe at the clicked time, and opens the editor once the parent feeds the updated track back', async () => {
    const onChangeTrack = vi.fn();
    const { rerender } = render(<SpriteTimelineTrack track={emptyTrack()} duration={2} currentValue={0.75} onChangeTrack={onChangeTrack} />);

    const ruler = screen.getByRole('button', { name: 'Add Alpha keyframe' });
    fireEvent.click(ruler, { clientX: 100 }); // 100/200 * 2s = 1.0s

    expect(onChangeTrack).toHaveBeenCalled();
    const updater = onChangeTrack.mock.calls[0][0];
    const result = updater(emptyTrack());
    expect(result.keyframes).toHaveLength(1);
    expect(result.keyframes[0].time).toBeCloseTo(1.0, 2);
    expect(result.keyframes[0].value).toBe(0.75);

    // Simulate the parent applying the update and passing the new track back down
    rerender(<SpriteTimelineTrack track={result} duration={2} currentValue={0.75} onChangeTrack={onChangeTrack} />);
    expect(await screen.findByRole('heading', { name: /alpha keyframe/i })).toBeInTheDocument();
  });

  it('opens the keyframe editor when a dot is clicked, and deletes on Delete', async () => {
    const user = userEvent.setup();
    const onChangeTrack = vi.fn();
    render(<SpriteTimelineTrack track={trackWithOne()} duration={2} currentValue={1} onChangeTrack={onChangeTrack} />);

    await user.click(screen.getByRole('button', { name: /Alpha keyframe at 1.00s/ }));
    expect(screen.getByRole('heading', { name: /alpha keyframe/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    const updater = onChangeTrack.mock.calls[0][0];
    expect(updater(trackWithOne()).keyframes).toHaveLength(0);
  });

  it('hides the easing selector for the first (only) keyframe', async () => {
    const user = userEvent.setup();
    render(<SpriteTimelineTrack track={trackWithOne()} duration={2} currentValue={1} onChangeTrack={() => {}} />);
    await user.click(screen.getByRole('button', { name: /Alpha keyframe at 1.00s/ }));
    expect(screen.queryByLabelText(/Easing/)).not.toBeInTheDocument();
  });

  it('repositions a keyframe on pointer drag', () => {
    const onChangeTrack = vi.fn();
    render(<SpriteTimelineTrack track={trackWithOne()} duration={2} currentValue={1} onChangeTrack={onChangeTrack} />);

    const dot = screen.getByRole('button', { name: /Alpha keyframe at 1.00s/ });
    Object.defineProperty(dot, 'setPointerCapture', { value: vi.fn() });
    Object.defineProperty(dot, 'hasPointerCapture', { value: vi.fn(() => true) });
    Object.defineProperty(dot, 'releasePointerCapture', { value: vi.fn() });

    fireEvent.pointerDown(dot, { pointerId: 1, clientX: 100 });
    fireEvent.pointerMove(dot, { pointerId: 1, clientX: 150 }); // 150/200 * 2s = 1.5s

    const updater = onChangeTrack.mock.calls.at(-1)![0];
    const result = updater(trackWithOne());
    expect(result.keyframes[0].time).toBeCloseTo(1.5, 2);

    fireEvent.pointerUp(dot, { pointerId: 1 });
  });
});
