import { useState, useEffect, useRef } from 'react';

const SAMPLE_WINDOW = 60; // frames to average over

export function useCanvasFps(active: boolean): number | null {
  const [fps, setFps] = useState<number | null>(null);
  const frameTimes = useRef<number[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      setFps(null);
      frameTimes.current = [];
      return;
    }

    let last = performance.now();

    const tick = (now: number) => {
      const delta = now - last;
      last = now;

      if (delta > 0) {
        frameTimes.current.push(delta);
        if (frameTimes.current.length > SAMPLE_WINDOW) {
          frameTimes.current.shift();
        }
        if (frameTimes.current.length >= 10) {
          const avg = frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length;
          setFps(Math.round(1000 / avg));
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      frameTimes.current = [];
    };
  }, [active]);

  return fps;
}
