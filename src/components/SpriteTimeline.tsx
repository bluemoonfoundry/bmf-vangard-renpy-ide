/**
 * @file SpriteTimeline.tsx
 * @description Visual keyframe timeline for one sprite's animation, opened
 * from a "Timeline" toggle in `SceneComposer`. Renders a play/scrub header
 * and one `SpriteTimelineTrack` per animatable `SceneSprite` property
 * (x/y/zoom/alpha/rotation/blur). Playback drives `onPreviewUpdate` so the
 * canvas can show the animation live; the generated ATL itself comes from
 * `atlCodeGenerator.ts`, independent of this preview.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { KeyframeTrack, SpriteAnimation } from '@/types';
import SpriteTimelineTrack from './SpriteTimelineTrack';
import { startPlayback, interpolateAnimation, type PlaybackHandle } from '@/lib/timelinePreview';

const TRACK_PROPERTIES: KeyframeTrack['property'][] = ['x', 'y', 'zoom', 'alpha', 'rotation', 'blur'];

interface SpriteTimelineProps {
  spriteLabel: string;
  animation: SpriteAnimation | null;
  /** Current static value of each property on the underlying sprite, used as the default when adding a keyframe. */
  currentValues: Record<KeyframeTrack['property'], number>;
  onCreateAnimation: () => void;
  onChangeAnimation: (updater: (prev: SpriteAnimation) => SpriteAnimation) => void;
  onDeleteAnimation: () => void;
  /** Called every preview frame with interpolated values, and with `null` when playback stops/resets. */
  onPreviewUpdate: (values: Partial<Record<KeyframeTrack['property'], number>> | null) => void;
}

function trackFor(animation: SpriteAnimation, property: KeyframeTrack['property']): KeyframeTrack {
  return animation.tracks.find(t => t.property === property) ?? { property, keyframes: [] };
}

const SpriteTimeline: React.FC<SpriteTimelineProps> = ({
  spriteLabel, animation, currentValues, onCreateAnimation, onChangeAnimation, onDeleteAnimation, onPreviewUpdate,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadTime, setPlayheadTime] = useState(0);
  const playbackRef = useRef<PlaybackHandle | null>(null);

  const stopPlayback = useCallback(() => {
    playbackRef.current?.stop();
    playbackRef.current = null;
    setIsPlaying(false);
  }, []);

  // Stop playback and clear the live preview override whenever the selected animation changes/unmounts.
  useEffect(() => () => { playbackRef.current?.stop(); onPreviewUpdate(null); }, [animation?.id, onPreviewUpdate]);

  if (!animation) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-secondary mb-3">No animation for {spriteLabel} yet.</p>
        <button onClick={onCreateAnimation} className="px-3 py-1.5 rounded bg-accent hover:bg-accent-hover text-white text-sm font-bold">
          + Add Animation
        </button>
      </div>
    );
  }

  const handlePlay = () => {
    if (isPlaying) { stopPlayback(); return; }
    setIsPlaying(true);
    playbackRef.current = startPlayback(
      animation,
      (values, elapsed) => { setPlayheadTime(elapsed); onPreviewUpdate(values); },
      () => { setIsPlaying(false); playbackRef.current = null; }
    );
  };

  const handleScrub = (time: number) => {
    stopPlayback();
    setPlayheadTime(time);
    onPreviewUpdate(interpolateAnimation(animation, time));
  };

  const setDuration = (duration: number) => {
    onChangeAnimation(prev => ({ ...prev, duration: Math.max(0.1, duration) }));
  };

  const setLoop = (loop: boolean) => {
    onChangeAnimation(prev => ({ ...prev, loop }));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-primary">{spriteLabel}: {animation.name}</h3>
        <button onClick={onDeleteAnimation} className="text-xs text-red-600 dark:text-red-400 hover:underline">Remove Animation</button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handlePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="px-3 py-1.5 rounded bg-accent hover:bg-accent-hover text-white text-sm font-bold w-16"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <label className="flex items-center gap-1 text-xs text-secondary">
          Duration
          <input
            type="number"
            min={0.1}
            step={0.1}
            value={animation.duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-16 text-xs rounded border border-primary bg-secondary text-primary px-1 py-0.5"
          />
          s
        </label>
        <label className="flex items-center gap-1 text-xs text-secondary">
          <input type="checkbox" checked={animation.loop} onChange={(e) => setLoop(e.target.checked)} />
          Loop
        </label>
        <span className="text-xs font-mono text-secondary ml-auto">{playheadTime.toFixed(2)}s / {animation.duration.toFixed(2)}s</span>
      </div>

      <input
        type="range"
        min={0}
        max={animation.duration}
        step={0.05}
        value={Math.min(playheadTime, animation.duration)}
        onChange={(e) => handleScrub(Number(e.target.value))}
        aria-label="Playhead"
        className="w-full"
      />

      <div className="space-y-2">
        {TRACK_PROPERTIES.map(property => (
          <SpriteTimelineTrack
            key={property}
            track={trackFor(animation, property)}
            duration={animation.duration}
            currentValue={currentValues[property]}
            onChangeTrack={(updater) => {
              onChangeAnimation(prev => {
                const existing = trackFor(prev, property);
                const updated = updater(existing);
                const hasTrack = prev.tracks.some(t => t.property === property);
                return {
                  ...prev,
                  tracks: hasTrack
                    ? prev.tracks.map(t => t.property === property ? updated : t)
                    : [...prev.tracks, updated],
                };
              });
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SpriteTimeline;
