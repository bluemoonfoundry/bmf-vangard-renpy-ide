import { describe, it, expect } from 'vitest';
import { generateATLFromTimeline, transformNameFor } from './atlCodeGenerator';
import type { SpriteAnimation } from '@/types';

function anim(overrides: Partial<SpriteAnimation> = {}): SpriteAnimation {
  return {
    id: 'a1',
    spriteId: 'eileen',
    name: 'Entrance',
    duration: 2,
    loop: false,
    tracks: [],
    ...overrides,
  };
}

describe('transformNameFor', () => {
  it('slugifies the animation name and prefixes it with the sprite id', () => {
    expect(transformNameFor(anim({ name: 'Entrance' }))).toBe('eileen_entrance');
    expect(transformNameFor(anim({ name: 'Main Loop!' }))).toBe('eileen_main_loop');
  });

  it('falls back to "animation" for an empty/symbols-only name', () => {
    expect(transformNameFor(anim({ name: '###' }))).toBe('eileen_animation');
  });
});

describe('generateATLFromTimeline', () => {
  it('generates a pass-only transform for an animation with no keyframes', () => {
    expect(generateATLFromTimeline(anim())).toBe('transform eileen_entrance:\n    pass\n');
  });

  it('generates a single-property linear transform matching the plan\'s example shape', () => {
    const a = anim({
      spriteId: 'eileen',
      name: 'Entrance',
      tracks: [
        { property: 'x', keyframes: [
          { id: 'k1', time: 0, value: 0.0, easing: 'linear' },
          { id: 'k2', time: 1, value: 0.5, easing: 'linear' },
        ] },
      ],
    });
    expect(generateATLFromTimeline(a)).toBe(
      'transform eileen_entrance:\n    xcenter 0\n    linear 1 xcenter 0.5\n'
    );
  });

  it('maps x/y to xcenter/ycenter and rotation to rotate', () => {
    const a = anim({
      tracks: [
        { property: 'y', keyframes: [{ id: 'k1', time: 0, value: 0.2, easing: 'linear' }, { id: 'k2', time: 1, value: 0.8, easing: 'easeout' }] },
      ],
    });
    const code = generateATLFromTimeline(a);
    expect(code).toContain('ycenter 0.2');
    expect(code).toContain('easeout 1 ycenter 0.8');
  });

  it('wraps multiple animated tracks in parallel', () => {
    const a = anim({
      tracks: [
        { property: 'x', keyframes: [{ id: 'k1', time: 0, value: 0, easing: 'linear' }, { id: 'k2', time: 1, value: 1, easing: 'linear' }] },
        { property: 'alpha', keyframes: [{ id: 'k3', time: 0, value: 0, easing: 'linear' }, { id: 'k4', time: 1, value: 1, easing: 'linear' }] },
      ],
    });
    const code = generateATLFromTimeline(a);
    expect(code).toContain('parallel:');
    expect(code).toContain('        xcenter 0\n        linear 1 xcenter 1');
    expect(code).toContain('        alpha 0\n        linear 1 alpha 1');
  });

  it('emits a static-only line for a track with exactly one keyframe', () => {
    const a = anim({ tracks: [{ property: 'zoom', keyframes: [{ id: 'k1', time: 0, value: 1.5, easing: 'linear' }] }] });
    expect(generateATLFromTimeline(a)).toBe('transform eileen_entrance:\n    zoom 1.5\n');
  });

  it('sorts keyframes by time regardless of input order', () => {
    const a = anim({
      tracks: [
        { property: 'alpha', keyframes: [
          { id: 'k2', time: 1, value: 1, easing: 'linear' },
          { id: 'k1', time: 0, value: 0, easing: 'linear' },
        ] },
      ],
    });
    expect(generateATLFromTimeline(a)).toBe('transform eileen_entrance:\n    alpha 0\n    linear 1 alpha 1\n');
  });

  it('appends "repeat" when the animation loops', () => {
    const a = anim({
      loop: true,
      tracks: [{ property: 'rotation', keyframes: [{ id: 'k1', time: 0, value: 0, easing: 'linear' }, { id: 'k2', time: 1, value: 360, easing: 'linear' }] }],
    });
    expect(generateATLFromTimeline(a)).toBe('transform eileen_entrance:\n    rotate 0\n    linear 1 rotate 360\n    repeat\n');
  });

  it('handles a 3-keyframe sequence with mixed easing (entrance verification example)', () => {
    const a = anim({
      spriteId: 'eileen',
      name: 'Slide',
      tracks: [
        { property: 'x', keyframes: [
          { id: 'k1', time: 0, value: 0.0, easing: 'linear' },
          { id: 'k2', time: 1, value: 0.5, easing: 'linear' },
          { id: 'k3', time: 2, value: 1.0, easing: 'easeinout_quad' },
        ] },
      ],
    });
    expect(generateATLFromTimeline(a)).toBe(
      'transform eileen_slide:\n    xcenter 0\n    linear 1 xcenter 0.5\n    easeinout_quad 1 xcenter 1\n'
    );
  });
});
