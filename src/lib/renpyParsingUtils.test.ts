import { describe, it, expect } from 'vitest';
import { getTripleQuotedLineMask } from '@/lib/renpyTripleQuotes';
import { getLogicalLines } from '@/lib/renpyLogicalLines';
import { isReservedRenpyName } from '@/lib/renpyNames';
import { collectRenpyHasLabelGuards, isJumpGuardedByHasLabel } from '@/lib/renpyLabelGuards';

// ─── renpyTripleQuotes ───────────────────────────────────────────────────────

describe('getTripleQuotedLineMask', () => {
  it('returns all-false for code with no triple-quoted strings', () => {
    const mask = getTripleQuotedLineMask('label start:\n    return\n');
    expect(mask.every(v => !v)).toBe(true);
  });

  it('marks lines inside double-quote triple-quoted blocks as true', () => {
    const code = 'line0\n"""\nline2\n"""\nline4';
    const mask = getTripleQuotedLineMask(code);
    expect(mask[0]).toBe(false);
    expect(mask[1]).toBe(true);  // opening line
    expect(mask[2]).toBe(true);  // inside
    expect(mask[3]).toBe(true);  // closing line
    expect(mask[4]).toBe(false);
  });

  it('marks lines inside single-quote triple-quoted blocks as true', () => {
    const code = "a\n'''\nb\n'''\nc";
    const mask = getTripleQuotedLineMask(code);
    expect(mask[0]).toBe(false);
    expect(mask[1]).toBe(true);
    expect(mask[2]).toBe(true);
    expect(mask[3]).toBe(true);
    expect(mask[4]).toBe(false);
  });

  it('handles triple-quoted string on a single line', () => {
    const code = 'a\n"""inline"""\nb';
    const mask = getTripleQuotedLineMask(code);
    expect(mask[0]).toBe(false);
    expect(mask[1]).toBe(true);
    expect(mask[2]).toBe(false);
  });

  it('ignores mismatched quote type inside a block', () => {
    const code = '"""\ncontains \'\'\' here\n"""';
    const mask = getTripleQuotedLineMask(code);
    expect(mask[0]).toBe(true);
    expect(mask[1]).toBe(true);
    expect(mask[2]).toBe(true);
  });

  it('handles empty string', () => {
    const mask = getTripleQuotedLineMask('');
    expect(mask).toEqual([false]);
  });

  it('handles multiple separate triple-quoted blocks', () => {
    const code = '"""\nblock1\n"""\nmiddle\n"""\nblock2\n"""';
    const mask = getTripleQuotedLineMask(code);
    expect(mask[0]).toBe(true);
    expect(mask[1]).toBe(true);
    expect(mask[2]).toBe(true);
    expect(mask[3]).toBe(false);
    expect(mask[4]).toBe(true);
    expect(mask[5]).toBe(true);
    expect(mask[6]).toBe(true);
  });
});

// ─── renpyLogicalLines ───────────────────────────────────────────────────────

describe('getLogicalLines', () => {
  it('returns single empty-text entry for empty string', () => {
    // ''.split('\n') = [''] — one empty physical line is processed
    const result = getLogicalLines('');
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('');
  });

  it('returns a single logical line for one physical line', () => {
    const result = getLogicalLines('label start:');
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('label start:');
    expect(result[0].startLine).toBe(1);
    expect(result[0].endLine).toBe(1);
  });

  it('splits independent physical lines into separate logical lines', () => {
    const result = getLogicalLines('label start:\n    return');
    expect(result).toHaveLength(2);
    expect(result[0].text).toBe('label start:');
    expect(result[1].text).toBe('    return');
  });

  it('joins lines continued by open parenthesis', () => {
    const code = '$ x = (1 +\n       2)';
    const result = getLogicalLines(code);
    expect(result).toHaveLength(1);
    expect(result[0].startLine).toBe(1);
    expect(result[0].endLine).toBe(2);
  });

  it('joins lines continued by open bracket', () => {
    const code = '$ lst = [1,\n         2]';
    const result = getLogicalLines(code);
    expect(result).toHaveLength(1);
  });

  it('joins lines continued by backslash', () => {
    const code = 'show bg \\\n    at center';
    const result = getLogicalLines(code);
    expect(result).toHaveLength(1);
    expect(result[0].startLine).toBe(1);
    expect(result[0].endLine).toBe(2);
  });

  it('strips trailing comments before determining continuation', () => {
    const code = 'label start:  # This is a comment\n    return';
    const result = getLogicalLines(code);
    expect(result).toHaveLength(2);
  });

  it('does not split on # inside a string', () => {
    const code = '$ color = "#ff0000"  # hex color\n    return';
    const result = getLogicalLines(code);
    expect(result).toHaveLength(2);
  });

  it('returns lines with correct 1-indexed line numbers', () => {
    const code = 'a\nb\nc';
    const result = getLogicalLines(code);
    expect(result[0].startLine).toBe(1);
    expect(result[1].startLine).toBe(2);
    expect(result[2].startLine).toBe(3);
  });

  it('handles nested brackets', () => {
    const code = '$ x = {key: (1 +\n             2)}';
    const result = getLogicalLines(code);
    expect(result).toHaveLength(1);
  });
});

// ─── renpyNames ──────────────────────────────────────────────────────────────

describe('isReservedRenpyName', () => {
  it('returns true for names starting with underscore', () => {
    expect(isReservedRenpyName('_internal')).toBe(true);
    expect(isReservedRenpyName('_A')).toBe(true);
    expect(isReservedRenpyName('_label_1')).toBe(true);
  });

  it('returns false for names not starting with underscore', () => {
    expect(isReservedRenpyName('start')).toBe(false);
    expect(isReservedRenpyName('myLabel')).toBe(false);
    expect(isReservedRenpyName('label_1')).toBe(false);
  });

  it('returns false for plain underscore alone', () => {
    expect(isReservedRenpyName('_')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isReservedRenpyName('')).toBe(false);
  });

  it('returns false for names with leading double underscore (not matched by regex)', () => {
    // double underscore starts with single underscore, so IS reserved
    expect(isReservedRenpyName('__dunder')).toBe(true);
  });
});

// ─── renpyLabelGuards ────────────────────────────────────────────────────────

describe('collectRenpyHasLabelGuards', () => {
  it('returns empty array when no guards present', () => {
    const code = 'label start:\n    return\n';
    expect(collectRenpyHasLabelGuards(code)).toEqual([]);
  });

  it('detects a simple has_label guard', () => {
    const code = 'if renpy.has_label("ending_a"):\n    jump ending_a\nlabel main:\n    return\n';
    const guards = collectRenpyHasLabelGuards(code);
    expect(guards).toHaveLength(1);
    expect(guards[0].targetLabel).toBe('ending_a');
    // startLine = index + 1 where index=0 (guard is on line 1)
    expect(guards[0].startLine).toBe(1);
  });

  it('uses single-quoted label names', () => {
    const code = "if renpy.has_label('alt_route'):\n    jump alt_route\n";
    const guards = collectRenpyHasLabelGuards(code);
    expect(guards).toHaveLength(1);
    expect(guards[0].targetLabel).toBe('alt_route');
  });

  it('scope ends when indent returns to guard level', () => {
    const code = 'if renpy.has_label("opt"):\n    jump opt\nlabel after:\n    return\n';
    const guards = collectRenpyHasLabelGuards(code);
    expect(guards[0].endLine).toBeLessThan(4);
  });

  it('handles multiple guards', () => {
    const code = [
      'if renpy.has_label("a"):',
      '    jump a',
      'if renpy.has_label("b"):',
      '    jump b',
      'label main:',
    ].join('\n');
    const guards = collectRenpyHasLabelGuards(code);
    expect(guards).toHaveLength(2);
    const labels = guards.map(g => g.targetLabel).sort();
    expect(labels).toEqual(['a', 'b']);
  });

  it('ignores guards inside triple-quoted strings', () => {
    const code = '"""\nif renpy.has_label("fake"):\n    jump fake\n"""\nlabel start:\n    return\n';
    const guards = collectRenpyHasLabelGuards(code);
    expect(guards).toHaveLength(0);
  });

  it('ignores comment lines', () => {
    const code = '# if renpy.has_label("fake"):\nlabel start:\n    return\n';
    const guards = collectRenpyHasLabelGuards(code);
    expect(guards).toHaveLength(0);
  });

  it('returns empty array for empty string', () => {
    expect(collectRenpyHasLabelGuards('')).toEqual([]);
  });
});

describe('isJumpGuardedByHasLabel', () => {
  it('returns true when line is inside a matching guard scope', () => {
    const code = 'if renpy.has_label("ending_a"):\n    jump ending_a\nlabel main:\n    return\n';
    const guards = collectRenpyHasLabelGuards(code);
    // line 2 is "    jump ending_a" (1-indexed)
    expect(isJumpGuardedByHasLabel(guards, 2, 'ending_a')).toBe(true);
  });

  it('returns false when label name does not match', () => {
    const code = 'if renpy.has_label("ending_a"):\n    jump ending_b\nlabel main:\n    return\n';
    const guards = collectRenpyHasLabelGuards(code);
    expect(isJumpGuardedByHasLabel(guards, 2, 'ending_b')).toBe(false);
  });

  it('returns false when line is outside the guard scope', () => {
    const code = 'if renpy.has_label("a"):\n    jump a\nlabel main:\n    jump a\n';
    const guards = collectRenpyHasLabelGuards(code);
    // line 4 "    jump a" is outside the guard scope
    expect(isJumpGuardedByHasLabel(guards, 4, 'a')).toBe(false);
  });

  it('returns false for empty guards array', () => {
    expect(isJumpGuardedByHasLabel([], 5, 'any')).toBe(false);
  });
});
