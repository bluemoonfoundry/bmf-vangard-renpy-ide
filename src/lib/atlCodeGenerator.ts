/**
 * @file atlCodeGenerator.ts
 * @description Generates one-way ATL `transform` blocks from a `SpriteAnimation`'s
 * keyframe tracks (keyframes -> code only; there is no parser and no
 * round-trip -- see the TODO(#38) note in SceneComposer.tsx). Used by
 * `SceneComposer.tsx` to append transform blocks to its generated scene code
 * and to name the `at <transform>` clause on the animated sprite's `show` line.
 */
import type { KeyframeTrack, SpriteAnimation } from '@/types';

const ATL_PROPERTY_NAME: Record<KeyframeTrack['property'], string> = {
  x: 'xcenter',
  y: 'ycenter',
  zoom: 'zoom',
  alpha: 'alpha',
  rotation: 'rotate',
  blur: 'blur',
};

/** A valid, unique Ren'Py transform name for `anim`, e.g. `eileen_entrance`. */
export function transformNameFor(anim: SpriteAnimation): string {
  const slug = anim.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'animation';
  return `${anim.spriteId}_${slug}`;
}

function formatValue(value: number): string {
  return Number(value.toFixed(3)).toString();
}

/** ATL body lines for one track (its keyframes, in time order), indented by `indent`. */
function generateTrackCode(track: KeyframeTrack, indent: string): string {
  const kfs = [...track.keyframes].sort((a, b) => a.time - b.time);
  if (kfs.length === 0) return '';

  const atlProperty = ATL_PROPERTY_NAME[track.property];
  let code = `${indent}${atlProperty} ${formatValue(kfs[0].value)}\n`;
  for (let i = 1; i < kfs.length; i++) {
    const duration = kfs[i].time - kfs[i - 1].time;
    code += `${indent}${kfs[i].easing} ${formatValue(duration)} ${atlProperty} ${formatValue(kfs[i].value)}\n`;
  }
  return code;
}

/**
 * A full `transform NAME:` block for `anim`. Tracks with fewer than 2
 * keyframes contribute only their static starting value (no `linear`/`ease*`
 * line, since there's nothing to animate to). Multiple animated tracks run
 * in a `parallel:` block so they play simultaneously.
 */
export function generateATLFromTimeline(anim: SpriteAnimation): string {
  const name = transformNameFor(anim);
  const tracksWithKeyframes = anim.tracks.filter(t => t.keyframes.length > 0);

  if (tracksWithKeyframes.length === 0) {
    return `transform ${name}:\n    pass\n`;
  }

  const animatedTracks = tracksWithKeyframes.filter(t => t.keyframes.length >= 2);
  const staticTracks = tracksWithKeyframes.filter(t => t.keyframes.length === 1);

  let body = staticTracks.map(t => generateTrackCode(t, '    ')).join('');

  if (animatedTracks.length > 1) {
    body += '    parallel:\n';
    for (const track of animatedTracks) body += generateTrackCode(track, '        ');
  } else if (animatedTracks.length === 1) {
    body += generateTrackCode(animatedTracks[0], '    ');
  }

  if (anim.loop) body += '    repeat\n';

  return `transform ${name}:\n${body}`;
}
