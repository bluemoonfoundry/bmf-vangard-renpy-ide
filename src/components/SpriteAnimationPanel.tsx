/**
 * @file SpriteAnimationPanel.tsx
 * @description Root panel for one sprite's `SpriteAnimation`, opened from
 * the "Timeline" toggle in `SceneComposer`. Renders a combine-mode toggle
 * (hidden until 2+ timelines exist), the list of `TimelineRow`s, an
 * "+ Add Timeline" button, and a single overall play/scrub control that
 * previews the sprite's fully combined animation. The generated ATL itself
 * comes from `atlCodeGenerator.ts`, independent of this preview.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { AnimatableProperty, SpriteAnimation, SpriteTimeline } from '@/types';
import TimelineRow from './TimelineRow';
import { startPlayback, interpolateSpriteAnimation, getTotalDuration, type PlaybackHandle } from '@/lib/timelinePreview';
import { createId } from '@/lib/createId';

interface SpriteAnimationPanelProps {
  spriteLabel: string;
  animation: SpriteAnimation | null;
  /** Current static value of each property on the underlying sprite, used as the default for new/backfilled keyframe values. */
  currentValues: Record<AnimatableProperty, number>;
  /** True disables the four matrix-factor checkboxes on every TimelineRow: the sprite has a static tint/colorize applied. */
  hasStaticTint: boolean;
  onCreateAnimation: () => void;
  onChangeAnimation: (updater: (prev: SpriteAnimation) => SpriteAnimation) => void;
  onDeleteAnimation: () => void;
  /** Called every preview frame with interpolated values, and with `null` when playback stops/resets. */
  onPreviewUpdate: (values: Partial<Record<AnimatableProperty, number>> | null) => void;
}

function createTimeline(spriteLabel: string, index: number): SpriteTimeline {
  return { id: createId('tl'), name: `${spriteLabel}${index}`, properties: [], keyframes: [], duration: 1, loop: false };
}

const SpriteAnimationPanel: React.FC<SpriteAnimationPanelProps> = ({
  spriteLabel, animation, currentValues, hasStaticTint, onCreateAnimation, onChangeAnimation, onDeleteAnimation, onPreviewUpdate,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadTime, setPlayheadTime] = useState(0);
  const playbackRef = useRef<PlaybackHandle | null>(null);

  const stopPlayback = useCallback(() => {
    playbackRef.current?.stop();
    playbackRef.current = null;
    setIsPlaying(false);
  }, []);

  // Stop playback and clear the live preview override whenever the selected sprite's animation changes/unmounts.
  useEffect(() => () => {
    playbackRef.current?.stop();
    playbackRef.current = null;
    setIsPlaying(false);
    setPlayheadTime(0);
    onPreviewUpdate(null);
  }, [animation?.spriteId, onPreviewUpdate]);

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

  const totalDuration = getTotalDuration(animation);

  const hasOverlappingProperties = (() => {
    const seen = new Set<AnimatableProperty>();
    for (const t of animation.timelines) {
      for (const p of t.properties) {
        if (seen.has(p)) return true;
        seen.add(p);
      }
    }
    return false;
  })();

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
    onPreviewUpdate(interpolateSpriteAnimation(animation, time));
  };

  const setCombineMode = (combineMode: SpriteAnimation['combineMode']) => {
    onChangeAnimation(prev => ({ ...prev, combineMode }));
  };

  const handleAddTimeline = () => {
    const newTimeline = createTimeline(spriteLabel, animation.timelines.length);
    onChangeAnimation(prev => ({ ...prev, timelines: [...prev.timelines, newTimeline] }));
  };

  const handleRemoveTimeline = (id: string) => {
    onChangeAnimation(prev => ({ ...prev, timelines: prev.timelines.filter(t => t.id !== id) }));
  };

  const handleChangeTimeline = (id: string, updater: (prev: SpriteTimeline) => SpriteTimeline) => {
    onChangeAnimation(prev => ({ ...prev, timelines: prev.timelines.map(t => t.id === id ? updater(t) : t) }));
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    onChangeAnimation(prev => {
      const timelines = [...prev.timelines];
      const target = index + direction;
      [timelines[index], timelines[target]] = [timelines[target], timelines[index]];
      return { ...prev, timelines };
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-primary">{spriteLabel}</h3>
        <button onClick={onDeleteAnimation} className="text-xs text-red-600 dark:text-red-400 hover:underline">Remove Animation</button>
      </div>

      {animation.timelines.length >= 2 && (
        <div className="flex items-center gap-3 text-xs">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="combine-mode"
              value="parallel"
              checked={animation.combineMode === 'parallel'}
              disabled={hasOverlappingProperties}
              title={hasOverlappingProperties ? 'Cannot switch to Parallel: two or more timelines share a property. Remove the overlap first.' : undefined}
              onChange={() => setCombineMode('parallel')}
            />
            Parallel
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="combine-mode" value="sequential" checked={animation.combineMode === 'sequential'} onChange={() => setCombineMode('sequential')} />
            Sequential
          </label>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handlePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="px-3 py-1.5 rounded bg-accent hover:bg-accent-hover text-white text-sm font-bold w-16"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <span className="text-xs font-mono text-secondary ml-auto">{playheadTime.toFixed(2)}s / {totalDuration.toFixed(2)}s</span>
      </div>

      <input
        type="range"
        min={0}
        max={totalDuration}
        step={0.05}
        value={Math.min(playheadTime, totalDuration)}
        onChange={(e) => handleScrub(Number(e.target.value))}
        aria-label="Playhead"
        className="w-full"
      />

      <div className="space-y-2">
        {animation.timelines.map((timeline, index) => (
          <TimelineRow
            key={timeline.id}
            timeline={timeline}
            combineMode={animation.combineMode}
            canLoop={animation.combineMode === 'parallel' || index === animation.timelines.length - 1}
            propertiesClaimedBySiblings={animation.timelines.filter((_, i) => i !== index).flatMap(t => t.properties)}
            hasStaticTint={hasStaticTint}
            currentValues={currentValues}
            onChangeTimeline={(updater) => handleChangeTimeline(timeline.id, updater)}
            onRemoveTimeline={() => handleRemoveTimeline(timeline.id)}
            onMoveUp={index > 0 ? () => handleMove(index, -1) : undefined}
            onMoveDown={index < animation.timelines.length - 1 ? () => handleMove(index, 1) : undefined}
          />
        ))}
      </div>

      <button onClick={handleAddTimeline} className="w-full px-3 py-1.5 rounded border border-dashed border-primary text-secondary hover:text-primary hover:border-accent text-sm font-bold">
        + Add Timeline
      </button>
    </div>
  );
};

export default SpriteAnimationPanel;
