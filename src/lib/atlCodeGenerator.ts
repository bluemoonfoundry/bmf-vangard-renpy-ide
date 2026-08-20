/**
 * @file atlCodeGenerator.ts
 * @description Generates one-way ATL `transform` blocks from a sprite's
 * `SpriteAnimation` (keyframes -> code only; there is no parser and no
 * round-trip -- see the TODO(#38) note in SceneComposer.tsx). Used by
 * `SceneComposer.tsx` to append transform blocks to its generated scene code
 * and to name the `at <transform>` clause on the animated sprite's `show` line.
 */
import type { AnimatableProperty, SpriteAnimation, SpriteTimeline } from '@/types';

const ATL_PROPERTY_NAME: Record<AnimatableProperty, string> = {
  x: 'xcenter',
  y: 'ycenter',
  zoom: 'zoom',
  alpha: 'alpha',
  rotation: 'rotate',
  blur: 'blur',
  saturation: 'saturation',
  brightness: 'brightness',
  contrast: 'contrast',
  invert: 'invert',
};

/** Canonical property order for all generated ATL lines, regardless of picker selection order. */
const PROPERTY_ORDER: AnimatableProperty[] = ['x', 'y', 'zoom', 'alpha', 'rotation', 'blur', 'saturation', 'brightness', 'contrast', 'invert'];

/** A valid Ren'Py transform name for the sprite's (single) animation, e.g. `eileen_animation`. */
export function transformNameFor(spriteId: string): string {
  const slug = spriteId.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'sprite';
  return `${slug}_animation`;
}

function formatValue(value: number): string {
  return Number(value.toFixed(3)).toString();
}

/**
 * ATL body lines for one timeline (its keyframes, in time order), indented
 * by `indent`. The first keyframe emits one plain property line per
 * property; each subsequent keyframe emits one combined warp line covering
 * every property in `timeline.properties`, in canonical order. Appends a
 * trailing `repeat` line if the timeline loops.
 */
function generateTimelineCode(timeline: SpriteTimeline, indent: string, honorLoop = true): string {
  const kfs = [...timeline.keyframes].sort((a, b) => a.time - b.time);
  if (kfs.length === 0) return '';

  const orderedProps = PROPERTY_ORDER.filter(p => timeline.properties.includes(p));
  if (orderedProps.length === 0) return '';

  let code = orderedProps.map(p => `${indent}${ATL_PROPERTY_NAME[p]} ${formatValue(kfs[0].values[p] ?? 0)}`).join('\n') + '\n';
  for (let i = 1; i < kfs.length; i++) {
    const duration = kfs[i].time - kfs[i - 1].time;
    const parts = orderedProps.map(p => `${ATL_PROPERTY_NAME[p]} ${formatValue(kfs[i].values[p] ?? 0)}`).join(' ');
    code += `${indent}${kfs[i].easing} ${formatValue(duration)} ${parts}\n`;
  }

  if (timeline.loop && honorLoop) code += `${indent}repeat\n`;

  return code;
}

/**
 * A full `transform NAME:` block for `anim`. Timelines with zero keyframes
 * contribute nothing. In `'parallel'` mode, 2+ timelines with keyframes each
 * become their own nested `parallel:` branch (a single one is emitted
 * directly, no wrapper); in `'sequential'` mode, timelines' blocks are
 * concatenated directly one after another, since that's ATL's own default
 * statement-sequence behavior.
 */
export function generateATLFromTimeline(anim: SpriteAnimation): string {
  const name = transformNameFor(anim.spriteId);
  const active = anim.timelines.filter(t => t.keyframes.length > 0 && t.properties.length > 0);

  if (active.length === 0) {
    return `transform ${name}:\n    pass\n`;
  }

  let body: string;
  if (anim.combineMode === 'parallel') {
    if (active.length > 1) {
      body = active.map(t => `    parallel:\n${generateTimelineCode(t, '        ')}`).join('');
    } else {
      body = generateTimelineCode(active[0], '    ');
    }
  } else {
    body = active.map((t, i) => generateTimelineCode(t, '    ', i === active.length - 1)).join('');
  }

  return `transform ${name}:\n${body}`;
}
