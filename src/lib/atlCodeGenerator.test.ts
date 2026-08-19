import { describe, it, expect } from 'vitest';
import { generateATLFromTimeline, transformNameFor } from './atlCodeGenerator';
import type { SpriteAnimation, SpriteTimeline } from '@/types';

function timeline(overrides: Partial<SpriteTimeline> = {}): SpriteTimeline {
  return { id: 't1', name: 'Timeline', properties: [], keyframes: [], duration: 2, loop: false, ...overrides };
}

function anim(overrides: Partial<SpriteAnimation> = {}): SpriteAnimation {
  return { spriteId: 'eileen', combineMode: 'parallel', timelines: [], ...overrides };
}

describe('transformNameFor', () => {
  it('derives the transform name from the sprite id alone', () => {
    expect(transformNameFor('eileen')).toBe('eileen_animation');
    expect(transformNameFor('background')).toBe('background_animation');
  });
});

describe('generateATLFromTimeline', () => {
  it('falls back to a pass-only transform when no timeline has keyframes', () => {
    expect(generateATLFromTimeline(anim({ timelines: [timeline()] }))).toBe('transform eileen_animation:\n    pass\n');
  });

  it('generates a single combined warp line for a single timeline covering multiple properties', () => {
    const t = timeline({
      properties: ['x', 'alpha'],
      keyframes: [
        { id: 'k1', time: 0, values: { x: 0, alpha: 0 }, easing: 'linear' },
        { id: 'k2', time: 1, values: { x: 0.5, alpha: 1 }, easing: 'easein' },
      ],
    });
    expect(generateATLFromTimeline(anim({ timelines: [t] }))).toBe(
      'transform eileen_animation:\n    xcenter 0\n    alpha 0\n    easein 1 xcenter 0.5 alpha 1\n'
    );
  });

  it('emits properties in canonical order (x, y, zoom, alpha, rotation, blur) regardless of the properties array order', () => {
    const t = timeline({
      properties: ['alpha', 'x'],
      keyframes: [
        { id: 'k1', time: 0, values: { alpha: 1, x: 0 }, easing: 'linear' },
        { id: 'k2', time: 1, values: { alpha: 0, x: 1 }, easing: 'linear' },
      ],
    });
    const code = generateATLFromTimeline(anim({ timelines: [t] }));
    expect(code).toContain('xcenter 0\n    alpha 1\n');
    expect(code).toContain('linear 1 xcenter 1 alpha 0\n');
  });

  it('emits a static-only line (no warp) for a timeline with exactly one keyframe', () => {
    const t = timeline({ properties: ['zoom'], keyframes: [{ id: 'k1', time: 0, values: { zoom: 1.5 }, easing: 'linear' }] });
    expect(generateATLFromTimeline(anim({ timelines: [t] }))).toBe('transform eileen_animation:\n    zoom 1.5\n');
  });

  it('sorts keyframes by time regardless of input order', () => {
    const t = timeline({
      properties: ['alpha'],
      keyframes: [
        { id: 'k2', time: 1, values: { alpha: 1 }, easing: 'linear' },
        { id: 'k1', time: 0, values: { alpha: 0 }, easing: 'linear' },
      ],
    });
    expect(generateATLFromTimeline(anim({ timelines: [t] }))).toBe('transform eileen_animation:\n    alpha 0\n    linear 1 alpha 1\n');
  });

  it('appends "repeat" per-timeline when that timeline loops', () => {
    const t = timeline({
      loop: true,
      properties: ['rotation'],
      keyframes: [{ id: 'k1', time: 0, values: { rotation: 0 }, easing: 'linear' }, { id: 'k2', time: 1, values: { rotation: 360 }, easing: 'linear' }],
    });
    expect(generateATLFromTimeline(anim({ timelines: [t] }))).toBe('transform eileen_animation:\n    rotate 0\n    linear 1 rotate 360\n    repeat\n');
  });

  it('wraps two timelines in nested parallel: branches when combineMode is parallel', () => {
    const t1 = timeline({ id: 't1', properties: ['x'], keyframes: [{ id: 'k1', time: 0, values: { x: 0 }, easing: 'linear' }, { id: 'k2', time: 1, values: { x: 1 }, easing: 'linear' }] });
    const t2 = timeline({ id: 't2', properties: ['alpha'], keyframes: [{ id: 'k3', time: 0, values: { alpha: 0 }, easing: 'linear' }, { id: 'k4', time: 1, values: { alpha: 1 }, easing: 'easein' }] });
    const code = generateATLFromTimeline(anim({ combineMode: 'parallel', timelines: [t1, t2] }));
    expect(code).toBe(
      'transform eileen_animation:\n    parallel:\n        xcenter 0\n        linear 1 xcenter 1\n    parallel:\n        alpha 0\n        easein 1 alpha 1\n'
    );
  });

  it('concatenates two timelines directly with no parallel: wrapper when combineMode is sequential', () => {
    const t1 = timeline({ id: 't1', properties: ['alpha'], keyframes: [{ id: 'k1', time: 0, values: { alpha: 0 }, easing: 'linear' }, { id: 'k2', time: 1, values: { alpha: 1 }, easing: 'linear' }] });
    const t2 = timeline({ id: 't2', properties: ['alpha'], keyframes: [{ id: 'k3', time: 0, values: { alpha: 1 }, easing: 'linear' }, { id: 'k4', time: 1, values: { alpha: 0 }, easing: 'easeout' }] });
    const code = generateATLFromTimeline(anim({ combineMode: 'sequential', timelines: [t1, t2] }));
    expect(code).toBe(
      'transform eileen_animation:\n    alpha 0\n    linear 1 alpha 1\n    alpha 1\n    easeout 1 alpha 0\n'
    );
    expect(code).not.toContain('parallel:');
  });

  it('skips timelines with zero keyframes entirely, even alongside animated ones', () => {
    const empty = timeline({ id: 'empty', properties: ['blur'], keyframes: [] });
    const t = timeline({ id: 't1', properties: ['alpha'], keyframes: [{ id: 'k1', time: 0, values: { alpha: 0 }, easing: 'linear' }, { id: 'k2', time: 1, values: { alpha: 1 }, easing: 'linear' }] });
    const code = generateATLFromTimeline(anim({ timelines: [empty, t] }));
    expect(code).toBe('transform eileen_animation:\n    alpha 0\n    linear 1 alpha 1\n');
  });
});
