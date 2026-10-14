/**
 * @file workerLogger.ts
 * @description Warning sink that is safe in every JS context, including a
 * dedicated Web Worker. The renderer `logger` forwards through
 * `window.electronAPI`, and a worker has no `window`, so code that can run in
 * the analysis worker (the symbol index) warns through here instead. Calls
 * never throw.
 */

/** Writes a warning to the console; swallows any failure of the console itself. */
export function workerWarn(message: string, ...details: unknown[]): void {
  try {
    console.warn(message, ...details);
  } catch {
    // A warning must never break the code path that is reporting a failure.
  }
}

/**
 * Returns a warn function that emits at most `limit` warnings over its
 * lifetime, then one final note that further warnings are suppressed.
 * Keeps a systemic failure (every block failing) diagnosable without flooding.
 */
export function createThrottledWarn(
  limit: number,
  sink: (message: string, ...details: unknown[]) => void = workerWarn,
): (message: string, ...details: unknown[]) => void {
  let count = 0;
  return (message, ...details) => {
    if (count > limit) return;
    count++;
    try {
      if (count <= limit) sink(message, ...details);
      else sink(`${message} (further warnings of this kind are suppressed)`, ...details);
    } catch {
      // Never let a warning escape.
    }
  };
}
