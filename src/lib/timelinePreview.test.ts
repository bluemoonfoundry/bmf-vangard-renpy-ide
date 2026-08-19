import { describe, it, expect } from 'vitest';
import { interpolateTrack, interpolateAnimation } from './timelinePreview';
import type { KeyframeTrack, SpriteAnimation } from '@/types';

const track: KeyframeTrack = {
  property: 'x',
  keyframes: [
    { id: 'k1', time: 0, value: 0, easing: 'linear' },
    { id: 'k2', time: 1, value: 1, easing: 'linear' },
    { id: 'k3', time: 2, value: 0.5, easing: 'linear' },
  ],
};

describe('interpolateTrack', () => {
  it('returns undefined for an empty track', () => {
    expect(interpolateTrack({ property: 'x', keyframes: [] }, 0.5)).toBeUndefined();
  });

  it('returns the single value for a one-keyframe track at any time', () => {
    const single: KeyframeTrack = { property: 'alpha', keyframes: [{ id: 'k1', time: 1, value: 0.7, easing: 'linear' }] };
    expect(interpolateTrack(single, 0)).toBe(0.7);
    expect(interpolateTrack(single, 5)).toBe(0.7);
  });

  it('holds the first value before the first keyframe', () => {
    expect(interpolateTrack(track, -1)).toBe(0);
  });

  it('holds the last value after the last keyframe', () => {
    expect(interpolateTrack(track, 10)).toBe(0.5);
  });

  it('returns exact keyframe values at their own time', () => {
    expect(interpolateTrack(track, 0)).toBe(0);
    expect(interpolateTrack(track, 1)).toBe(1);
    expect(interpolateTrack(track, 2)).toBe(0.5);
  });

  it('linearly interpolates between two keyframes', () => {
    expect(interpolateTrack(track, 0.5)).toBeCloseTo(0.5, 5);
    expect(interpolateTrack(track, 1.5)).toBeCloseTo(0.75, 5);
  });

  it('applies the arriving keyframe\'s easing, not the departing one', () => {
    const eased: KeyframeTrack = {
      property: 'alpha',
      keyframes: [
        { id: 'k1', time: 0, value: 0, easing: 'linear' },
        { id: 'k2', time: 1, value: 1, easing: 'easein' }, // slow start: below the linear diagonal at t=0.5
      ],
    };
    expect(interpolateTrack(eased, 0.5)).toBeLessThan(0.5);
  });
});

describe('interpolateAnimation', () => {
  const anim: SpriteAnimation = {
    id: 'a1',
    spriteId: 's1',
    name: 'Test',
    duration: 2,
    loop: false,
    tracks: [
      track,
      { property: 'alpha', keyframes: [{ id: 'k1', time: 0, value: 1, easing: 'linear' }] },
      { property: 'zoom', keyframes: [] },
    ],
  };

  it('returns interpolated values for every track that has keyframes', () => {
    const result = interpolateAnimation(anim, 0.5);
    expect(result.x).toBeCloseTo(0.5, 5);
    expect(result.alpha).toBe(1);
  });

  it('omits tracks with no keyframes', () => {
    const result = interpolateAnimation(anim, 0.5);
    expect(result.zoom).toBeUndefined();
  });
});
