/**
 * @file SpriteTimelineTrack.tsx
 * @description One property row in `SpriteTimeline`: a ruler spanning the
 * animation's duration with a dot per keyframe. Click empty ruler space to
 * add a keyframe at that time; click a dot to open `KeyframeEditor`; drag a
 * dot to reposition it in time (native pointer events, per this repo's
 * canvas convention -- see CLAUDE.md).
 */
import React, { useState, useRef } from 'react';
import type { Keyframe, KeyframeTrack } from '@/types';
import KeyframeEditor, { VALUE_RANGE_BY_PROPERTY } from './KeyframeEditor';
import { createId } from '@/lib/createId';

interface SpriteTimelineTrackProps {
  track: KeyframeTrack;
  duration: number;
  /** Current live value (from the sprite's static property or the current preview), used as the default when adding a new keyframe. */
  currentValue: number;
  onChangeTrack: (updater: (prev: KeyframeTrack) => KeyframeTrack) => void;
}

const PROPERTY_LABEL: Record<KeyframeTrack['property'], string> = {
  x: 'X Position',
  y: 'Y Position',
  zoom: 'Zoom',
  alpha: 'Alpha',
  rotation: 'Rotation',
  blur: 'Blur',
};

const SpriteTimelineTrack: React.FC<SpriteTimelineTrackProps> = ({ track, duration, currentValue, onChangeTrack }) => {
  const [editingKeyframeId, setEditingKeyframeId] = useState<string | null>(null);
  const [draggingKeyframeId, setDraggingKeyframeId] = useState<string | null>(null);
  const rulerRef = useRef<HTMLDivElement>(null);

  const editingKeyframe = track.keyframes.find(kf => kf.id === editingKeyframeId) ?? null;
  const isFirstKeyframe = editingKeyframe ? [...track.keyframes].sort((a, b) => a.time - b.time)[0]?.id === editingKeyframe.id : false;

  const timeFromClientX = (clientX: number): number => {
    const rect = rulerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(fraction * duration * 20) / 20; // snap to 0.05s
  };

  const handleRulerClick = (e: React.MouseEvent) => {
    if (e.target !== rulerRef.current) return; // ignore clicks that landed on a dot
    const time = timeFromClientX(e.clientX);
    const newKeyframe: Keyframe = { id: createId('kf'), time, value: currentValue, easing: 'linear' };
    onChangeTrack(prev => ({ ...prev, keyframes: [...prev.keyframes, newKeyframe] }));
    setEditingKeyframeId(newKeyframe.id);
  };

  const handleDotPointerDown = (e: React.PointerEvent, keyframeId: string) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDraggingKeyframeId(keyframeId);
  };

  const handleDotPointerMove = (e: React.PointerEvent) => {
    if (!draggingKeyframeId) return;
    const time = timeFromClientX(e.clientX);
    onChangeTrack(prev => ({
      ...prev,
      keyframes: prev.keyframes.map(kf => kf.id === draggingKeyframeId ? { ...kf, time } : kf),
    }));
  };

  const handleDotPointerUp = (e: React.PointerEvent) => {
    if (draggingKeyframeId) {
      const target = e.target as HTMLElement;
      if (target.hasPointerCapture(e.pointerId)) target.releasePointerCapture(e.pointerId);
      setDraggingKeyframeId(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="w-20 flex-shrink-0 text-xs font-medium text-secondary">{PROPERTY_LABEL[track.property]}</span>
      <div
        ref={rulerRef}
        role="button"
        aria-label={`Add ${PROPERTY_LABEL[track.property]} keyframe`}
        onClick={handleRulerClick}
        onPointerMove={handleDotPointerMove}
        onPointerUp={handleDotPointerUp}
        className="relative flex-1 h-6 rounded bg-tertiary border border-primary cursor-pointer"
      >
        {track.keyframes.map(kf => (
          <button
            key={kf.id}
            type="button"
            aria-label={`${PROPERTY_LABEL[track.property]} keyframe at ${kf.time.toFixed(2)}s`}
            onPointerDown={(e) => handleDotPointerDown(e, kf.id)}
            onClick={(e) => { e.stopPropagation(); setEditingKeyframeId(kf.id); }}
            style={{ left: `${duration > 0 ? (kf.time / duration) * 100 : 0}%` }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent border-2 border-white dark:border-gray-800 shadow cursor-grab active:cursor-grabbing"
          />
        ))}
      </div>

      {editingKeyframe && (
        <KeyframeEditor
          keyframe={editingKeyframe}
          property={track.property}
          duration={duration}
          isFirstKeyframe={isFirstKeyframe}
          onClose={() => setEditingKeyframeId(null)}
          onSave={(updated) => {
            const range = VALUE_RANGE_BY_PROPERTY[track.property];
            const clampedValue = Math.max(range.min, Math.min(range.max, updated.value));
            onChangeTrack(prev => ({
              ...prev,
              keyframes: prev.keyframes.map(kf => kf.id === updated.id ? { ...updated, value: clampedValue } : kf),
            }));
            setEditingKeyframeId(null);
          }}
          onDelete={() => {
            onChangeTrack(prev => ({ ...prev, keyframes: prev.keyframes.filter(kf => kf.id !== editingKeyframe.id) }));
            setEditingKeyframeId(null);
          }}
        />
      )}
    </div>
  );
};

export default SpriteTimelineTrack;
