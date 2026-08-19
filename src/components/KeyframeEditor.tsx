/**
 * @file KeyframeEditor.tsx
 * @description Modal for precisely editing one `Keyframe`'s time, value, and
 * easing, opened by clicking a keyframe dot in `SpriteTimelineTrack`.
 */
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Keyframe, KeyframeTrack } from '@/types';
import { EASING_OPTIONS } from '@/lib/easingFunctions';
import { useModalAccessibility } from '@/hooks/useModalAccessibility';

interface ValueRange {
  min: number;
  max: number;
  step: number;
}

/** Slider bounds per track property, matching the corresponding `SceneSprite` field's expected range. */
export const VALUE_RANGE_BY_PROPERTY: Record<KeyframeTrack['property'], ValueRange> = {
  x: { min: -1, max: 2, step: 0.01 },
  y: { min: -1, max: 2, step: 0.01 },
  zoom: { min: 0, max: 3, step: 0.05 },
  alpha: { min: 0, max: 1, step: 0.01 },
  rotation: { min: -360, max: 360, step: 1 },
  blur: { min: 0, max: 50, step: 1 },
};

interface KeyframeEditorProps {
  keyframe: Keyframe;
  property: KeyframeTrack['property'];
  duration: number;
  isFirstKeyframe: boolean;
  onSave: (updated: Keyframe) => void;
  onDelete: () => void;
  onClose: () => void;
}

const KeyframeEditor: React.FC<KeyframeEditorProps> = ({ keyframe, property, duration, isFirstKeyframe, onSave, onDelete, onClose }) => {
  const [time, setTime] = useState(keyframe.time);
  const [value, setValue] = useState(keyframe.value);
  const [easing, setEasing] = useState(keyframe.easing);
  const { modalProps, contentRef } = useModalAccessibility({ isOpen: true, onClose, titleId: 'keyframe-editor-title' });
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const range = VALUE_RANGE_BY_PROPERTY[property];

  useEffect(() => {
    setTimeout(() => closeButtonRef.current?.focus(), 50);
  }, []);

  const handleSave = () => {
    onSave({
      ...keyframe,
      time: Math.max(0, Math.min(duration, time)),
      value,
      easing,
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        ref={contentRef}
        {...modalProps}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-sm m-4 flex flex-col border border-gray-200 dark:border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 id="keyframe-editor-title" className="text-lg font-bold text-gray-900 dark:text-gray-100 capitalize">{property} Keyframe</h2>
          <button ref={closeButtonRef} onClick={onClose} aria-label="Close" className="text-secondary hover:text-primary p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <main className="p-4 space-y-4">
          <div>
            <label htmlFor="kf-time" className="flex items-center justify-between text-xs font-medium text-secondary mb-1">
              <span>Time (seconds)</span>
              <span className="font-mono text-primary">{time.toFixed(2)}</span>
            </label>
            <input
              id="kf-time"
              type="range"
              min={0}
              max={duration}
              step={0.05}
              value={time}
              onChange={e => setTime(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="kf-value" className="flex items-center justify-between text-xs font-medium text-secondary mb-1">
              <span className="capitalize">{property}</span>
              <span className="font-mono text-primary">{value}</span>
            </label>
            <input
              id="kf-value"
              type="range"
              min={range.min}
              max={range.max}
              step={range.step}
              value={value}
              onChange={e => setValue(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {!isFirstKeyframe && (
            <div>
              <label htmlFor="kf-easing" className="block text-xs font-medium text-secondary mb-1">Easing (arriving from the previous keyframe)</label>
              <select
                id="kf-easing"
                value={easing}
                onChange={e => setEasing(e.target.value as Keyframe['easing'])}
                className="w-full text-sm rounded-md border border-primary bg-secondary text-primary px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {EASING_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          )}
        </main>

        <footer className="bg-gray-50 dark:bg-gray-700 p-4 rounded-b-lg flex justify-between items-center">
          <button onClick={onDelete} className="px-3 py-2 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded">
            Delete
          </button>
          <div className="space-x-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-sm">
              Save
            </button>
          </div>
        </footer>
      </div>
    </div>,
    document.body
  );
};

export default KeyframeEditor;
