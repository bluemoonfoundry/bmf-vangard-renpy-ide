import type { RenpyAnalysisResult } from '@/types';

// ---------------------------------------------------------------------------
// Ren'Py statement keywords — these should not be treated as undefined names.
// (Moved here from useDiagnostics.ts so both the diagnostics rule and the
// editor marker / stats consumers share one definition.)
// ---------------------------------------------------------------------------
export const STATEMENT_KEYWORDS = new Set([
  'show', 'hide', 'scene', 'play', 'queue', 'stop', 'pause', 'with', 'window',
  'define', 'default', 'init', 'label', 'jump', 'call', 'return', 'if', 'elif',
  'else', 'for', 'while', 'pass', 'menu', 'image', 'transform', 'style', 'screen',
  'python', 'translate', 'nvl', 'voice', 'renpy', 'config', 'gui', 'at', 'as',
  'behind', 'onlayer', 'zorder', 'expression', 'extend', 'camera',
]);

const ALLOWLISTED_ROOTS = [
  'renpy', 'config', 'gui', 'persistent', 'store', 'True', 'False', 'None', '_', '__',
  'preferences', 'narrator', 'main_menu', 'build', 'updater',
];

const PYTHON_LOGIC_WORDS = new Set(['and', 'or', 'not', 'in', 'is', 'True', 'False', 'None']);

export interface UndefinedVariableRef {
  name: string;
  line: number;
  columnStart: number;
  columnEnd: number;
}

export function buildKnownIdentifierSet(analysisResult: RenpyAnalysisResult): Set<string> {
  const known = new Set<string>(STATEMENT_KEYWORDS);
  analysisResult.variables.forEach((_v, name) => known.add(name));
  analysisResult.characters.forEach((_c, tag) => known.add(tag));
  analysisResult.screens.forEach((_s, name) => known.add(name));
  ALLOWLISTED_ROOTS.forEach(r => known.add(r));
  return known;
}

const INTERPOLATION_REGEX = /\[([a-zA-Z_]\w*)(?:!\w+)?\]/g;
const IF_WHILE_REGEX = /^\s*(?:if|elif|while)\s+(.+?):\s*$/;
const BARE_IDENTIFIER_REGEX = /\b[a-zA-Z_]\w*\b/g;

function stripStringLiterals(line: string): string {
  return line
    .replace(/"[^"\\]*(?:\\.[^"\\]*)*"/g, m => ' '.repeat(m.length))
    .replace(/'[^'\\]*(?:\\.[^'\\]*)*'/g, m => ' '.repeat(m.length));
}

const DOUBLE_QUOTED_SPAN_REGEX = /"[^"\\]*(?:\\.[^"\\]*)*"/g;
const SINGLE_QUOTED_SPAN_REGEX = /'[^'\\]*(?:\\.[^'\\]*)*'/g;

/** Returns [start, end) index spans (in `line`) covered by quoted string literals. */
function findQuotedSpans(line: string): Array<[number, number]> {
  const spans: Array<[number, number]> = [];
  DOUBLE_QUOTED_SPAN_REGEX.lastIndex = 0;
  let dm: RegExpExecArray | null;
  while ((dm = DOUBLE_QUOTED_SPAN_REGEX.exec(line)) !== null) {
    spans.push([dm.index, dm.index + dm[0].length]);
  }
  SINGLE_QUOTED_SPAN_REGEX.lastIndex = 0;
  let sm: RegExpExecArray | null;
  while ((sm = SINGLE_QUOTED_SPAN_REGEX.exec(line)) !== null) {
    spans.push([sm.index, sm.index + sm[0].length]);
  }
  return spans;
}

function isWithinSpans(index: number, spans: Array<[number, number]>): boolean {
  return spans.some(([start, end]) => index >= start && index < end);
}

export function extractUndefinedVariableReferences(content: string, knownNames: Set<string>): UndefinedVariableRef[] {
  const refs: UndefinedVariableRef[] = [];
  const lines = content.split('\n');

  lines.forEach((rawLine, index) => {
    const lineNumber = index + 1;

    // Strip trailing comments (matches the '#'-cutoff precedent used elsewhere, e.g. useRenpyAnalysis.ts)
    const commentIndex = rawLine.indexOf('#');
    const scanLine = commentIndex >= 0 ? rawLine.substring(0, commentIndex) : rawLine;
    const quotedSpans = findQuotedSpans(scanLine);

    // --- Interpolation: [varname] / [varname!q] ---
    INTERPOLATION_REGEX.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = INTERPOLATION_REGEX.exec(scanLine)) !== null) {
      const name = m[1];
      if (scanLine[m.index - 1] === '[') continue; // '[[' escape — literal '[', not interpolation
      if (!isWithinSpans(m.index, quotedSpans)) continue; // only expand inside string literals (not Python subscripts)
      if (!knownNames.has(name) && !name.startsWith('_')) {
        const nameStart = m.index + 1; // skip the '['
        refs.push({ name, line: lineNumber, columnStart: nameStart, columnEnd: nameStart + name.length });
      }
    }

    // --- if/elif/while condition ---
    const condMatch = IF_WHILE_REGEX.exec(rawLine);
    if (condMatch) {
      const conditionStart = condMatch.index + rawLine.indexOf(condMatch[1], condMatch.index);
      const strippedCondition = stripStringLiterals(condMatch[1]);
      BARE_IDENTIFIER_REGEX.lastIndex = 0;
      let cm: RegExpExecArray | null;
      while ((cm = BARE_IDENTIFIER_REGEX.exec(strippedCondition)) !== null) {
        const name = cm[0];
        if (PYTHON_LOGIC_WORDS.has(name) || knownNames.has(name) || name.startsWith('_')) continue;

        const precedingChar = strippedCondition[cm.index - 1];
        if (precedingChar === '.') continue; // attribute access, e.g. foo.bar

        const followingChar = strippedCondition[cm.index + name.length];
        if (followingChar === '(') continue; // function/method call

        const nameStart = conditionStart + cm.index;
        refs.push({ name, line: lineNumber, columnStart: nameStart, columnEnd: nameStart + name.length });
      }
    }
  });

  return refs;
}
