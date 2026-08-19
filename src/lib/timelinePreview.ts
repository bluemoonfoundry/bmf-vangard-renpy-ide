/**
 * @file timelinePreview.ts
 * @description Interpolates `KeyframeTrack` values at an arbitrary time, and
 * drives an `requestAnimationFrame` playback loop for `SpriteTimeline`'s
 * Play button -- used only for the live canvas preview, never for the
 * generated ATL code (that's `atlCodeGenerator.ts`, driven by the same
 * keyframe data but independent of this interpolation).
 */
import type { KeyframeTrack, SpriteAnimation } from '@/types';
import { applyEasing } from './easingFunctions';

/**
 * Value of `track` at `time` (seconds). Before the first keyframe, holds the
 * first keyframe's value; after the last, holds the last. `undefined` if the
 * track has no keyframes.
 */
export function interpolateTrack(track: KeyframeTrack, time: number): number | undefined {
  const kfs = track.keyframes;
  if (kfs.length === 0) return undefined;
  if (kfs.length === 1 || time <= kfs[0].time) return kfs[0].value;
  if (time >= kfs[kfs.length - 1].time) return kfs[kfs.length - 1].value;

  const next = kfs.findIndex(kf => kf.time > time);
  const prev = kfs[next - 1];
  const curr = kfs[next];
  const span = curr.time - prev.time;
  const t = span <= 0 ? 1 : (time - prev.time) / span;
  const easedT = applyEasing(t, curr.easing);
  return prev.value + easedT * (curr.value - prev.value);
}

/** Every track's value at `time`, keyed by `KeyframeTrack.property`. Tracks with no keyframes are omitted. */
export function interpolateAnimation(anim: SpriteAnimation, time: number): Partial<Record<KeyframeTrack['property'], number>> {
  const result: Partial<Record<KeyframeTrack['property'], number>> = {};
  for (const track of anim.tracks) {
    const value = interpolateTrack(track, time);
    if (value !== undefined) result[track.property] = value;
  }
  return result;
}

export interface PlaybackHandle {
  stop: () => void;
}

/**
 * Starts an `requestAnimationFrame` playback loop over `anim`, calling
 * `onUpdate` with interpolated property values every frame. Loops
 * indefinitely if `anim.loop`, otherwise calls `onEnd` once and stops.
 * Returns a handle whose `stop()` cancels the loop.
 */
export function startPlayback(
  anim: SpriteAnimation,
  onUpdate: (values: Partial<Record<KeyframeTrack['property'], number>>, elapsed: number) => void,
  onEnd?: () => void,
): PlaybackHandle {
  let stopped = false;
  let rafId: number;
  const startTime = performance.now();

  const tick = (now: number) => {
    if (stopped) return;
    let elapsed = (now - startTime) / 1000;

    if (elapsed >= anim.duration) {
      if (anim.loop && anim.duration > 0) {
        elapsed = elapsed % anim.duration;
      } else {
        onUpdate(interpolateAnimation(anim, anim.duration), anim.duration);
        onEnd?.();
        return;
      }
    }

    onUpdate(interpolateAnimation(anim, elapsed), elapsed);
    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);

  return {
    stop: () => {
      stopped = true;
      cancelAnimationFrame(rafId);
    },
  };
}
