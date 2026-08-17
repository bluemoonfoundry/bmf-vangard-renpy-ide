/**
 * Re-anchors generated multi-line code (e.g. a Menu Constructor `menu:` block) to the
 * indentation of the line it's being inserted at. The first line is left untouched
 * (it's inserted mid-line at the cursor); subsequent non-blank lines have their common
 * leading-whitespace stripped and the cursor's indent prefixed instead, so the block
 * lines up with surrounding code regardless of the generator's own indent width.
 */
export function reindentInsertedCode(code: string, currentIndent: string): string {
  if (!currentIndent) return code;

  const lines = code.split('\n');
  const nonEmpty = lines.slice(1).filter(l => l.trim().length > 0);
  const baseLen = nonEmpty.length > 0
    ? Math.min(...nonEmpty.map(l => (l.match(/^[\t ]*/) ?? [''])[0].length))
    : 0;

  return lines.map((line, idx) => {
    if (idx === 0) return line;
    if (!line.trim()) return line;
    return currentIndent + line.slice(baseLen);
  }).join('\n');
}
