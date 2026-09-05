/**
 * @file useCanvasActiveScope.ts
 * @description Tracks whether a canvas container is the one the user is currently
 * interacting with — either the mouse is hovering it, or focus is somewhere inside
 * it. Canvas-wide keyboard shortcuts (pan/zoom, fit-to-screen) are bound on `window`
 * because a bare hover shouldn't require focusing the canvas first, but that means
 * every mounted canvas instance (e.g. two panes in a split view) sees the same
 * keydown — this scope check is what limits the effect to the one under the pointer
 * or holding focus.
 */

import { useCallback, useEffect, useRef } from 'react';

/**
 * Returns a stable `isActive()` getter: true while the mouse is over `containerRef`,
 * or while `document.activeElement` is inside it.
 */
export function useCanvasActiveScope(containerRef: React.RefObject<HTMLElement | null>): () => boolean {
  const hoveredRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onEnter = () => { hoveredRef.current = true; };
    const onLeave = () => { hoveredRef.current = false; };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [containerRef]);

  return useCallback(() => {
    if (hoveredRef.current) return true;
    const el = containerRef.current;
    return !!el && el.contains(document.activeElement);
  }, [containerRef]);
}
