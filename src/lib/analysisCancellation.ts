/** Thrown by an analysis checkpoint when a newer request has superseded this one. */
export class AnalysisCancelledError extends Error {
  constructor(message = 'Analysis cancelled by a newer request') {
    super(message);
    this.name = 'AnalysisCancelledError';
  }
}

/**
 * Yields to the event loop for one macrotask so queued messages can be
 * delivered. Uses MessageChannel when available (no 4 ms setTimeout clamp);
 * falls back to setTimeout(0).
 */
export function yieldToEventLoop(): Promise<void> {
  if (typeof MessageChannel === 'undefined') {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = () => {
      channel.port1.onmessage = null;
      channel.port1.close();
      channel.port2.close();
      resolve();
    };
    channel.port2.postMessage(null);
  });
}
