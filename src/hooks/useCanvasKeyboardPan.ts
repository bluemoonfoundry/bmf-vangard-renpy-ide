/**
 * @file useCanvasKeyboardPan.ts
 * @description Lets W/A/S/D pan a canvas and Q/E zoom it, with continuous motion
 * while a key is held (like a game camera) rather than one discrete step per press.
 * Scoped to whichever mounted canvas is currently hovered or focus-within, via
 * useCanvasActiveScope, so a split view with two canvases doesn't pan both at once.
 */

import { useEffect, useRef } from 'react';
import { useCanvasActiveScope } from './useCanvasActiveScope';

export interface CanvasTransform {
  x: number;
  y: number;
  scale: number;
}

interface UseCanvasKeyboardPanOptions {
  /** Element whose bounding rect defines the zoom-anchor (viewport center). */
  containerRef: React.RefObject<HTMLElement | null>;
  onTransformChange: React.Dispatch<React.SetStateAction<CanvasTransform>>;
  minScale?: number;
  maxScale?: number;
  /** Set false to disable (e.g. canvas not the active tab). */
  enabled?: boolean;
}

/** Screen pixels/second panned at any zoom level. */
const PAN_SPEED = 700;
/** Fractional scale change per second while Q or E is held. */
const ZOOM_RATE = 1.2;

const PAN_ZOOM_KEYS = new Set(['w', 'a', 's', 'd', 'q', 'e']);

function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable) return true;
  // Chromium backs Monaco's hidden text-input surface with the native EditContext
  // API on some builds, which shows up as a plain, non-contentEditable <div> (class
  // "native-edit-context") rather than a TEXTAREA — so detect Monaco by ancestry
  // instead of relying on the DOM shape of whatever element the browser currently
  // uses for text input.
  return !!el.closest?.('.monaco-editor');
}

/**
 * Binds W/A/S/D (pan) and Q/E (zoom toward viewport center) to a canvas transform.
 * Keys pan/zoom continuously while held, driven by requestAnimationFrame.
 */
export function useCanvasKeyboardPan({
  containerRef,
  onTransformChange,
  minScale = 0.2,
  maxScale = 3,
  enabled = true,
}: UseCanvasKeyboardPanOptions): void {
  const isActive = useCanvasActiveScope(containerRef);
  const pressedKeys = useRef<Set<string>>(new Set());
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const keys = pressedKeys.current;

    const stopLoop = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = null;
    };

    const step = (time: number) => {
      if (keys.size === 0) {
        stopLoop();
        return;
      }
      const last = lastTimeRef.current ?? time;
      const dt = Math.min((time - last) / 1000, 0.1);
      lastTimeRef.current = time;

      const panDelta = PAN_SPEED * dt;
      const dx = (keys.has('a') ? 1 : 0) - (keys.has('d') ? 1 : 0);
      const dy = (keys.has('w') ? 1 : 0) - (keys.has('s') ? 1 : 0);
      const zoomDir = (keys.has('q') ? 1 : 0) - (keys.has('e') ? 1 : 0);

      // Re-checked every frame (not just on keydown) so panning stops the instant
      // the pointer leaves this canvas, and resumes if it re-enters mid-hold.
      if (isActive() && (dx !== 0 || dy !== 0 || zoomDir !== 0)) {
        onTransformChange(t => {
          let { x, y, scale } = t;
          x += dx * panDelta;
          y += dy * panDelta;

          if (zoomDir !== 0) {
            const rect = containerRef.current?.getBoundingClientRect();
            const cx = rect ? rect.width / 2 : 0;
            const cy = rect ? rect.height / 2 : 0;
            const newScale = Math.max(minScale, Math.min(maxScale, scale * Math.pow(1 + ZOOM_RATE, zoomDir * dt)));
            const worldX = (cx - x) / scale;
            const worldY = (cy - y) / scale;
            x = cx - worldX * newScale;
            y = cy - worldY * newScale;
            scale = newScale;
          }

          return { x, y, scale };
        });
      }

      rafRef.current = requestAnimationFrame(step);
    };

    const startLoop = () => {
      if (rafRef.current == null) {
        lastTimeRef.current = null;
        rafRef.current = requestAnimationFrame(step);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (!PAN_ZOOM_KEYS.has(key)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      if (!keys.has(key)) {
        keys.add(key);
        startLoop();
      }
      e.preventDefault();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.delete(e.key.toLowerCase());
    };

    const handleBlur = () => {
      keys.clear();
      stopLoop();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      keys.clear();
      stopLoop();
    };
  }, [enabled, containerRef, onTransformChange, minScale, maxScale, isActive]);
}
