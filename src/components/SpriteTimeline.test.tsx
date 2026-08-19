import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SpriteTimeline from './SpriteTimeline';
import type { SpriteAnimation } from '@/types';

const currentValues = { x: 0.5, y: 0.5, zoom: 1, alpha: 1, rotation: 0, blur: 0 };

function anim(overrides: Partial<SpriteAnimation> = {}): SpriteAnimation {
  return { id: 'a1', spriteId: 'eileen', name: 'Entrance', duration: 2, loop: false, tracks: [], ...overrides };
}

describe('SpriteTimeline', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 0, top: 0, right: 200, bottom: 20, width: 200, height: 20, x: 0, y: 0, toJSON: () => {},
    } as DOMRect);
  });
  afterEach(() => vi.restoreAllMocks());

  it('shows an "Add Animation" prompt when the sprite has no animation', async () => {
    const user = userEvent.setup();
    const onCreateAnimation = vi.fn();
    render(
      <SpriteTimeline
        spriteLabel="Eileen"
        animation={null}
        currentValues={currentValues}
        onCreateAnimation={onCreateAnimation}
        onChangeAnimation={() => {}}
        onDeleteAnimation={() => {}}
        onPreviewUpdate={() => {}}
      />
    );
    expect(screen.getByText(/No animation for Eileen yet/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '+ Add Animation' }));
    expect(onCreateAnimation).toHaveBeenCalled();
  });

  it('renders one track row per animatable property', () => {
    render(
      <SpriteTimeline
        spriteLabel="Eileen"
        animation={anim()}
        currentValues={currentValues}
        onCreateAnimation={() => {}}
        onChangeAnimation={() => {}}
        onDeleteAnimation={() => {}}
        onPreviewUpdate={() => {}}
      />
    );
    for (const label of ['X Position', 'Y Position', 'Zoom', 'Alpha', 'Rotation', 'Blur']) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it('updates duration via the duration input', () => {
    const onChangeAnimation = vi.fn();
    render(
      <SpriteTimeline
        spriteLabel="Eileen"
        animation={anim()}
        currentValues={currentValues}
        onCreateAnimation={() => {}}
        onChangeAnimation={onChangeAnimation}
        onDeleteAnimation={() => {}}
        onPreviewUpdate={() => {}}
      />
    );
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '5' } });
    const updater = onChangeAnimation.mock.calls[0][0];
    expect(updater(anim()).duration).toBe(5);
  });

  it('calls onDeleteAnimation when Remove Animation is clicked', async () => {
    const user = userEvent.setup();
    const onDeleteAnimation = vi.fn();
    render(
      <SpriteTimeline
        spriteLabel="Eileen"
        animation={anim()}
        currentValues={currentValues}
        onCreateAnimation={() => {}}
        onChangeAnimation={() => {}}
        onDeleteAnimation={onDeleteAnimation}
        onPreviewUpdate={() => {}}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Remove Animation' }));
    expect(onDeleteAnimation).toHaveBeenCalled();
  });

  it('calls onPreviewUpdate with interpolated values when the playhead is scrubbed', () => {
    const onPreviewUpdate = vi.fn();
    const animation = anim({
      tracks: [{ property: 'alpha', keyframes: [
        { id: 'k1', time: 0, value: 0, easing: 'linear' },
        { id: 'k2', time: 2, value: 1, easing: 'linear' },
      ] }],
    });
    render(
      <SpriteTimeline
        spriteLabel="Eileen"
        animation={animation}
        currentValues={currentValues}
        onCreateAnimation={() => {}}
        onChangeAnimation={() => {}}
        onDeleteAnimation={() => {}}
        onPreviewUpdate={onPreviewUpdate}
      />
    );
    fireEvent.change(screen.getByRole('slider', { name: 'Playhead' }), { target: { value: '1' } });
    expect(onPreviewUpdate).toHaveBeenCalledWith(expect.objectContaining({ alpha: expect.closeTo(0.5, 5) }));
  });

  it('toggles the Play button label when clicked', async () => {
    const user = userEvent.setup();
    render(
      <SpriteTimeline
        spriteLabel="Eileen"
        animation={anim()}
        currentValues={currentValues}
        onCreateAnimation={() => {}}
        onChangeAnimation={() => {}}
        onDeleteAnimation={() => {}}
        onPreviewUpdate={() => {}}
      />
    );
    const playButton = screen.getByRole('button', { name: 'Play' });
    await user.click(playButton);
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Pause' }));
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
  });
});
