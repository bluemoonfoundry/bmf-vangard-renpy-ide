import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import TimelineRow from './TimelineRow';
import type { AnimatableProperty, SpriteTimeline } from '@/types';

const currentValues = { x: 0.5, y: 0.5, zoom: 1, alpha: 1, rotation: 0, blur: 0, saturation: 1, brightness: 0, contrast: 1, invert: 0 };

function emptyTimeline(): SpriteTimeline {
  return { id: 't1', name: 'bob0', properties: [], keyframes: [], duration: 2, loop: false };
}

function alphaTimeline(): SpriteTimeline {
  return { id: 't1', name: 'bob0', properties: ['alpha'], keyframes: [{ id: 'kf-1', time: 1, values: { alpha: 0.5 }, easing: 'linear' }], duration: 2, loop: false };
}

function renderRow(overrides: Partial<Parameters<typeof TimelineRow>[0]> = {}) {
  const onChangeTimeline = vi.fn();
  const onRemoveTimeline = vi.fn();
  const props = {
    timeline: emptyTimeline(),
    propertiesClaimedBySiblings: [] as AnimatableProperty[],
    combineMode: 'parallel' as const,
    canLoop: true,
    hasStaticTint: false,
    currentValues,
    onChangeTimeline,
    onRemoveTimeline,
    ...overrides,
  };
  return { ...render(<TimelineRow {...props} />), props: { ...props, onChangeTimeline: onChangeTimeline as Mock, onRemoveTimeline: onRemoveTimeline as Mock } };
}

describe('TimelineRow', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 0, top: 0, right: 200, bottom: 20, width: 200, height: 20, x: 0, y: 0, toJSON: () => {},
    } as DOMRect);
  });
  afterEach(() => vi.restoreAllMocks());

  it('shows a placeholder and no ruler while no properties are selected', () => {
    renderRow();
    expect(screen.getByText('Pick at least one property to start keyframing')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Add keyframe/ })).not.toBeInTheDocument();
  });

  it('renders the timeline name', () => {
    renderRow();
    expect(screen.getByDisplayValue('bob0')).toBeInTheDocument();
  });

  it('renaming calls onChangeTimeline with the new name', () => {
    const { props } = renderRow();
    fireEvent.change(screen.getByDisplayValue('bob0'), { target: { value: 'Entrance' } });
    const updater = props.onChangeTimeline.mock.calls[0][0];
    expect(updater(emptyTimeline()).name).toBe('Entrance');
  });

  it('checking a property adds it and backfills existing keyframes with the current value', () => {
    const { props } = renderRow({ timeline: alphaTimeline() });
    fireEvent.click(screen.getByLabelText('Zoom'));
    const updater = props.onChangeTimeline.mock.calls[0][0];
    const result = updater(alphaTimeline());
    expect(result.properties).toEqual(['alpha', 'zoom']);
    expect(result.keyframes[0].values).toEqual({ alpha: 0.5, zoom: 1 });
  });

  it('unchecking a property removes it and drops its value from existing keyframes', () => {
    const withTwoProps: SpriteTimeline = { ...alphaTimeline(), properties: ['alpha', 'zoom'], keyframes: [{ id: 'kf-1', time: 1, values: { alpha: 0.5, zoom: 2 }, easing: 'linear' }] };
    const { props } = renderRow({ timeline: withTwoProps });
    fireEvent.click(screen.getByLabelText('Zoom'));
    const updater = props.onChangeTimeline.mock.calls[0][0];
    const result = updater(withTwoProps);
    expect(result.properties).toEqual(['alpha']);
    expect(result.keyframes[0].values).toEqual({ alpha: 0.5 });
  });

  it('disables a property claimed by a sibling timeline in parallel mode', () => {
    renderRow({ combineMode: 'parallel', propertiesClaimedBySiblings: ['zoom'] });
    expect(screen.getByLabelText('Zoom')).toBeDisabled();
  });

  it('does not disable any property in sequential mode, even if claimed by a sibling', () => {
    renderRow({ combineMode: 'sequential', propertiesClaimedBySiblings: ['zoom'] });
    expect(screen.getByLabelText('Zoom')).not.toBeDisabled();
  });

  it('does not disable a property already selected by this timeline itself', () => {
    renderRow({ timeline: alphaTimeline(), combineMode: 'parallel', propertiesClaimedBySiblings: ['zoom'] });
    expect(screen.getByLabelText('Alpha')).not.toBeDisabled();
  });

  it('adds a keyframe at the clicked time with the current values, and opens the editor once re-rendered with it', async () => {
    const withOneProp: SpriteTimeline = { ...emptyTimeline(), properties: ['alpha'] };
    const onChangeTimeline = vi.fn();
    const { rerender } = render(
      <TimelineRow timeline={withOneProp} propertiesClaimedBySiblings={[]} combineMode="parallel" canLoop={true} hasStaticTint={false} currentValues={currentValues} onChangeTimeline={onChangeTimeline} onRemoveTimeline={() => {}} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add keyframe' }), { clientX: 100 }); // 100/200 * 2s = 1.0s

    const updater = onChangeTimeline.mock.calls[0][0];
    const result = updater(withOneProp);
    expect(result.keyframes).toHaveLength(1);
    expect(result.keyframes[0].time).toBeCloseTo(1.0, 2);
    expect(result.keyframes[0].values).toEqual({ alpha: 1 });

    rerender(
      <TimelineRow timeline={result} propertiesClaimedBySiblings={[]} combineMode="parallel" canLoop={true} hasStaticTint={false} currentValues={currentValues} onChangeTimeline={onChangeTimeline} onRemoveTimeline={() => {}} />
    );
    expect(await screen.findByRole('heading', { name: 'Keyframe' })).toBeInTheDocument();
  });

  it('opens the keyframe editor when a dot is clicked, and deletes it on Delete after confirming', async () => {
    const user = userEvent.setup();
    const { props } = renderRow({ timeline: alphaTimeline() });

    await user.click(screen.getByRole('button', { name: /keyframe at 1.00s/ }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'Keyframe' })).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Delete' }));
    const confirmDialog = screen.getByRole('heading', { name: 'Delete Keyframe' }).closest('[role="dialog"]') as HTMLElement;
    await user.click(within(confirmDialog).getByRole('button', { name: 'Delete' }));

    const updater = props.onChangeTimeline.mock.calls[0][0];
    expect(updater(alphaTimeline()).keyframes).toHaveLength(0);
  });

  it('repositions a keyframe on pointer drag', () => {
    const { props } = renderRow({ timeline: alphaTimeline() });
    const dot = screen.getByRole('button', { name: /keyframe at 1.00s/ });
    Object.defineProperty(dot, 'setPointerCapture', { value: vi.fn() });
    Object.defineProperty(dot, 'hasPointerCapture', { value: vi.fn(() => true) });
    Object.defineProperty(dot, 'releasePointerCapture', { value: vi.fn() });

    fireEvent.pointerDown(dot, { pointerId: 1, clientX: 100 });
    fireEvent.pointerMove(dot, { pointerId: 1, clientX: 150 }); // 150/200 * 2s = 1.5s

    const updater = props.onChangeTimeline.mock.calls.at(-1)![0];
    expect(updater(alphaTimeline()).keyframes[0].time).toBeCloseTo(1.5, 2);

    fireEvent.pointerUp(dot, { pointerId: 1 });
  });

  it('does not reopen the editor when the click following a drag is the synthetic post-drag click', () => {
    renderRow({ timeline: alphaTimeline() });
    const dot = screen.getByRole('button', { name: /keyframe at 1.00s/ });
    Object.defineProperty(dot, 'setPointerCapture', { value: vi.fn() });
    Object.defineProperty(dot, 'hasPointerCapture', { value: vi.fn(() => true) });
    Object.defineProperty(dot, 'releasePointerCapture', { value: vi.fn() });

    fireEvent.pointerDown(dot, { pointerId: 1, clientX: 100 });
    fireEvent.pointerMove(dot, { pointerId: 1, clientX: 150 }); // actually dragged past the threshold
    fireEvent.pointerUp(dot, { pointerId: 1 });
    fireEvent.click(dot); // the synthetic click browsers fire after a drag's pointerup

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('still opens the editor on a plain click with no preceding drag movement', async () => {
    const user = userEvent.setup();
    renderRow({ timeline: alphaTimeline() });
    await user.click(screen.getByRole('button', { name: /keyframe at 1.00s/ }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('calls onRemoveTimeline when Remove is clicked and confirmed', async () => {
    const user = userEvent.setup();
    const onRemoveTimeline = vi.fn();
    renderRow({ onRemoveTimeline });
    await user.click(screen.getByRole('button', { name: 'Remove' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Remove' }));
    expect(onRemoveTimeline).toHaveBeenCalled();
  });

  it('disables the Loop checkbox when canLoop is false, and enables it when true', () => {
    const { rerender } = renderRow({ canLoop: false });
    expect(screen.getByLabelText('Loop')).toBeDisabled();

    rerender(
      <TimelineRow
        timeline={emptyTimeline()}
        propertiesClaimedBySiblings={[]}
        combineMode="parallel"
        canLoop={true}
        hasStaticTint={false}
        currentValues={currentValues}
        onChangeTimeline={() => {}}
        onRemoveTimeline={() => {}}
      />
    );
    expect(screen.getByLabelText('Loop')).not.toBeDisabled();
  });

  it('shrinking duration below an existing keyframe time clamps that keyframe to the new duration', () => {
    const { props } = renderRow({ timeline: alphaTimeline() }); // keyframe at time=1, duration=2
    fireEvent.change(screen.getByDisplayValue('2'), { target: { value: '0.5' } });
    const updater = props.onChangeTimeline.mock.calls[0][0];
    const result = updater(alphaTimeline());
    expect(result.duration).toBe(0.5);
    expect(result.keyframes[0].time).toBe(0.5);
  });

  it('shrinking duration above all keyframe times leaves their times untouched', () => {
    const { props } = renderRow({ timeline: alphaTimeline() }); // keyframe at time=1, duration=2
    fireEvent.change(screen.getByDisplayValue('2'), { target: { value: '1.5' } });
    const updater = props.onChangeTimeline.mock.calls[0][0];
    const result = updater(alphaTimeline());
    expect(result.duration).toBe(1.5);
    expect(result.keyframes[0].time).toBe(1);
  });

  it('calls onMoveUp/onMoveDown when provided, and omits the buttons when not', async () => {
    const user = userEvent.setup();
    const onMoveUp = vi.fn();
    renderRow({ onMoveUp });
    await user.click(screen.getByRole('button', { name: 'Move up' }));
    expect(onMoveUp).toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Move down' })).not.toBeInTheDocument();
  });

  it('disables the four matrix-factor checkboxes (with a tooltip) when hasStaticTint is true', () => {
    renderRow({ hasStaticTint: true });
    for (const label of ['Saturation', 'Brightness', 'Contrast', 'Invert']) {
      const checkbox = screen.getByLabelText(label);
      expect(checkbox).toBeDisabled();
      expect(checkbox).toHaveAttribute('title', "Disabled: this sprite has a static tint/colorize applied — animating color together with a static tint isn't supported.");
    }
  });

  it('leaves the four matrix-factor checkboxes enabled when hasStaticTint is false', () => {
    renderRow({ hasStaticTint: false });
    for (const label of ['Saturation', 'Brightness', 'Contrast', 'Invert']) {
      expect(screen.getByLabelText(label)).not.toBeDisabled();
    }
  });

  it('does not disable a matrix-factor property already selected by this timeline, even when hasStaticTint is true', () => {
    const withSaturation: SpriteTimeline = { ...emptyTimeline(), properties: ['saturation'] };
    renderRow({ timeline: withSaturation, hasStaticTint: true });
    expect(screen.getByLabelText('Saturation')).not.toBeDisabled();
  });

  it('hasStaticTint disabling is independent of the parallel-mode sibling-conflict disabling', () => {
    renderRow({ combineMode: 'sequential', hasStaticTint: true, propertiesClaimedBySiblings: ['saturation'] });
    // Sequential mode alone would not disable Saturation (sibling rule only applies in parallel), but hasStaticTint still does.
    expect(screen.getByLabelText('Saturation')).toBeDisabled();
  });

  it('leaves simple properties (e.g. Alpha) unaffected by hasStaticTint', () => {
    renderRow({ hasStaticTint: true });
    expect(screen.getByLabelText('Alpha')).not.toBeDisabled();
  });

  it('disables a matrix-factor property when a sibling claims a DIFFERENT matrix-factor property, in parallel mode', () => {
    renderRow({ combineMode: 'parallel', propertiesClaimedBySiblings: ['brightness'] });
    expect(screen.getByLabelText('Saturation')).toBeDisabled();
  });

  it('disables a matrix-factor property when a sibling claims a DIFFERENT matrix-factor property, in sequential mode too (unlike the simple-property sibling rule)', () => {
    renderRow({ combineMode: 'sequential', propertiesClaimedBySiblings: ['brightness'] });
    expect(screen.getByLabelText('Saturation')).toBeDisabled();
  });

  it('does not disable a matrix-factor property already selected by this timeline, even when a sibling claims a different matrix-factor property', () => {
    const withSaturation: SpriteTimeline = { ...emptyTimeline(), properties: ['saturation'] };
    renderRow({ timeline: withSaturation, combineMode: 'parallel', propertiesClaimedBySiblings: ['brightness'] });
    expect(screen.getByLabelText('Saturation')).not.toBeDisabled();
  });

  it('does not disable simple properties when a sibling claims a matrix-factor property', () => {
    renderRow({ combineMode: 'parallel', propertiesClaimedBySiblings: ['brightness'] });
    expect(screen.getByLabelText('Alpha')).not.toBeDisabled();
  });
});
