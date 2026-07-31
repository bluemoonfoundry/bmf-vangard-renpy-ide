/**
 * Finds all matches of a global regex within a single line.
 * Manually advances lastIndex on zero-width matches (e.g. `/$/g`, `/^/g`) —
 * without this, RegExp#exec never advances past a zero-width match and loops forever.
 */
export function findRegexMatchesInLine(line, regex) {
  const matches = [];
  let match;
  while ((match = regex.exec(line)) !== null) {
    matches.push({
      startColumn: match.index + 1,
      endColumn: match.index + match[0].length + 1,
    });
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }
  }
  return matches;
}
