/**
 * @file editorSelectionActions.ts
 * @description Pure text-sanitizing helpers for turning arbitrary editor
 * selections into valid identifiers or filenames, used by the Monaco
 * "create from selection" context-menu actions in EditorView.
 */

function isDegenerate(s: string): boolean {
  return s.length === 0 || /^_+$/.test(s);
}

// Windows reserved device names (case-insensitive, exact match only — a name
// that merely contains one as a substring, e.g. "CONtroller", is not reserved).
const WINDOWS_RESERVED_NAMES = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;

/**
 * Converts arbitrary text into a valid Ren'Py identifier: letters, digits,
 * underscores (and dots when allowDot is set, for `persistent.` names).
 * Returns '' if nothing usable survives (e.g. a fully symbolic selection).
 */
export function sanitizeIdentifier(text: string, allowDot = false): string {
  const trimmed = text.trim();
  const collapsed = trimmed.replace(/\s+/g, '_');
  const invalidPattern = allowDot ? /[^A-Za-z0-9_.]+/g : /[^A-Za-z0-9_]+/g;
  let result = collapsed.replace(invalidPattern, '_');
  result = result.replace(/_+/g, '_');

  // Only trim leading/trailing underscores if they weren't in the original input.
  // This preserves valid identifiers like '_private_var' and 'trailing_'.
  const hadLeadingUnderscore = trimmed.startsWith('_');
  const hadTrailingUnderscore = trimmed.endsWith('_');

  if (!hadLeadingUnderscore) {
    result = result.replace(/^_+/, '');
  }
  if (!hadTrailingUnderscore) {
    result = result.replace(/_+$/, '');
  }

  if (isDegenerate(result)) return '';
  if (/^[0-9]/.test(result)) result = `_${result}`;
  return result;
}

/**
 * Converts arbitrary text into a filesystem-safe filename (base name,
 * without extension). Filenames allow spaces, so only whitespace runs are
 * collapsed and filesystem-reserved characters are replaced.
 */
export function sanitizeFileName(text: string): string {
  const collapsed = text.trim().replace(/\s+/g, ' ');
  let result = collapsed.replace(/[<>:"/\\|?*]+/g, '_');
  // Windows silently strips trailing dots/spaces from filenames; trim them
  // explicitly so the sanitized name matches what would actually land on disk.
  result = result.replace(/[. ]+$/, '');
  if (isDegenerate(result)) return '';
  if (WINDOWS_RESERVED_NAMES.test(result)) return '';
  return result;
}
