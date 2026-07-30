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

const ALLOWLISTED_ROOTS = ['renpy', 'config', 'gui', 'persistent', 'store', 'True', 'False', 'None', '_', '__'];

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

export function extractUndefinedVariableReferences(content: string, knownNames: Set<string>): UndefinedVariableRef[] {
  const refs: UndefinedVariableRef[] = [];
  const lines = content.split('\n');

  lines.forEach((rawLine, index) => {
    const lineNumber = index + 1;

    // --- Interpolation: [varname] / [varname!q] ---
    INTERPOLATION_REGEX.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = INTERPOLATION_REGEX.exec(rawLine)) !== null) {
      const name = m[1];
      if (!knownNames.has(name)) {
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
        if (PYTHON_LOGIC_WORDS.has(name) || knownNames.has(name)) continue;

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
