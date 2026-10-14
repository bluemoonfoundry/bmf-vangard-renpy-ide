/**
 * @file contentHash.ts
 * @description Fast 32-bit djb2 hash used to detect `.rpy` content changes
 * (analysis worker result cache, symbol-index contribution cache). Not
 * cryptographic.
 */

/**
 * Computes a 32-bit djb2 hash of a string.
 * @complexity O(n) where n = string length
 */
export function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash |= 0; // keep 32-bit
  }
  return hash;
}
