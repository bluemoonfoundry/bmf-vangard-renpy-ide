import { describe, it, expect } from 'vitest';
import { reindentInsertedCode } from '@/lib/reindentInsertedCode';

describe('reindentInsertedCode', () => {
  it('returns the code unchanged when there is no target indent', () => {
    const code = 'menu:\n    "Choice A":\n        jump a\n';
    expect(reindentInsertedCode(code, '')).toBe(code);
  });

  it('re-anchors a menu block generated at 4-space indent to an 8-space cursor indent', () => {
    const code = 'menu:\n    "Choice A":\n        jump a\n    "Choice B":\n        jump b\n';
    const result = reindentInsertedCode(code, '        ');
    expect(result).toBe(
      'menu:\n        "Choice A":\n            jump a\n        "Choice B":\n            jump b\n'
    );
  });

  it('re-anchors the outer level to a tab cursor indent, preserving the nested relative indent as literal spaces', () => {
    const code = 'menu:\n    "Choice A":\n        jump a\n';
    const result = reindentInsertedCode(code, '\t');
    // Only the common leading whitespace (4 spaces) is swapped for the cursor's indent;
    // the remaining relative nesting is untouched, so it stays as literal spaces here.
    expect(result).toBe('menu:\n\t"Choice A":\n\t    jump a\n');
  });

  it('leaves the first line untouched since it is inserted mid-line at the cursor', () => {
    const code = 'menu:\n    "Choice A":\n        jump a\n';
    const result = reindentInsertedCode(code, '    ');
    expect(result.split('\n')[0]).toBe('menu:');
  });

  it('preserves blank lines without indenting them', () => {
    const code = 'menu:\n    "Choice A":\n\n        jump a\n';
    const result = reindentInsertedCode(code, '        ');
    const lines = result.split('\n');
    expect(lines[2]).toBe('');
  });

  it('is idempotent when re-applied with the same target indent', () => {
    const code = 'menu:\n    "Choice A":\n        jump a\n';
    const once = reindentInsertedCode(code, '        ');
    const twice = reindentInsertedCode(once, '        ');
    expect(twice).toBe(once);
  });
});
