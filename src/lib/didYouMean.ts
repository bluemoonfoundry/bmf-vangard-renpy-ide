/**
 * Computes the Levenshtein edit distance between `a` and `b`, capped at
 * `maxDistance`. Returns undefined once the distance is guaranteed to
 * exceed the cap, letting callers skip full computation for candidates
 * that are obviously unrelated.
 */
function levenshteinDistance(a: string, b: string, maxDistance: number): number | undefined {
  if (Math.abs(a.length - b.length) > maxDistance) return undefined;

  let prev = new Array<number>(b.length + 1);
  let curr = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,       // deletion
        curr[j - 1] + 1,   // insertion
        prev[j - 1] + cost, // substitution
      );
      rowMin = Math.min(rowMin, curr[j]);
    }
    if (rowMin > maxDistance) return undefined; // whole row exceeds cap — no point continuing
    [prev, curr] = [curr, prev];
  }

  return prev[b.length] <= maxDistance ? prev[b.length] : undefined;
}

/**
 * Finds the closest match to `name` among `candidates` by edit distance, for
 * "did you mean X?" diagnostics. Mirrors the well-established heuristic used
 * by compilers (e.g. TypeScript's spelling-suggestion search): allow up to
 * ~40% of the name's length to differ, skip candidates whose length differs
 * too much to plausibly match, and require an exact case-insensitive match
 * for very short candidates (under 3 chars) to avoid noisy false positives
 * like suggesting `if` for a mistyped `id`.
 *
 * @param name - The unresolved identifier as written in the source
 * @param candidates - Known-good identifiers to search (order breaks ties)
 * @returns The closest candidate, or undefined if nothing is close enough
 *
 * @complexity O(n * len(name) * avgLen(candidate)) worst case, but the
 * shrinking maxDistance cap and length-difference prefilter make it fast in
 * practice for the small identifier lists Ren'Py projects produce.
 */
export function findClosestMatch(name: string, candidates: Iterable<string>): string | undefined {
  if (name.length < 2) return undefined;

  const maxDistance = Math.floor(name.length * 0.4) || 1;
  const lowerName = name.toLowerCase();
  let best: string | undefined;
  let bestDistance = maxDistance + 1;

  for (const candidate of candidates) {
    if (candidate === name) continue;
    if (Math.abs(candidate.length - name.length) > maxDistance) continue;
    const lowerCandidate = candidate.toLowerCase();
    if (candidate.length < 3 && lowerCandidate !== lowerName) continue;

    const distance = levenshteinDistance(lowerName, lowerCandidate, bestDistance - 1);
    if (distance === undefined) continue;

    bestDistance = distance;
    best = candidate;
  }

  return best;
}
