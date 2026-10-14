import { describe, it, expect } from 'vitest';
import { createRangeContext, pointAt, rangeFromOffsets, mapInjectionPoint } from '@/lib/tree-sitter/sourceRange';

describe('sourceRange', () => {
  it('converts offsets to 1-based lines and 0-based columns', () => {
    const ctx = createRangeContext('b1', 'game/a.rpy', 'ab\ncd\n');
    expect(pointAt(ctx, 0)).toEqual({ line: 1, column: 0, offset: 0 });
    expect(pointAt(ctx, 4)).toEqual({ line: 2, column: 1, offset: 4 });
    expect(pointAt(ctx, 6)).toEqual({ line: 3, column: 0, offset: 6 });
  });

  it('treats CR as part of the line it ends', () => {
    const ctx = createRangeContext('b1', 'game/a.rpy', 'ab\r\ncd');
    expect(pointAt(ctx, 2)).toEqual({ line: 1, column: 2, offset: 2 });
    expect(pointAt(ctx, 4)).toEqual({ line: 2, column: 0, offset: 4 });
  });

  it('builds a SourceRange carrying block and file', () => {
    const ctx = createRangeContext('b1', 'game/a.rpy', 'ab\ncd\n');
    expect(rangeFromOffsets(ctx, 3, 5)).toEqual({
      blockId: 'b1',
      filePath: 'game/a.rpy',
      start: { line: 2, column: 0, offset: 3 },
      end: { line: 2, column: 2, offset: 5 },
    });
  });

  it('maps injection row 0 relative to the injection start', () => {
    const content = 'label a:\n    $ x = 1\n';
    const ctx = createRangeContext('b1', 'a.rpy', content);
    const start = content.indexOf('x = 1');
    expect(mapInjectionPoint(ctx, start, 0, 0)).toBe(start);
    expect(mapInjectionPoint(ctx, start, 0, 4)).toBe(start + 4);
  });

  it('maps later injection rows by adding back the dedented indentation', () => {
    const content = 'init python:\n    x = 1\n    def f():\n        return y\n';
    const ctx = createRangeContext('b1', 'a.rpy', content);
    const start = content.indexOf('x = 1');
    // Dedented span: "x = 1\ndef f():\n    return y\n" — `y` is row 2, column 11.
    expect(content.slice(mapInjectionPoint(ctx, start, 2, 11), mapInjectionPoint(ctx, start, 2, 12))).toBe('y');
  });

  it('maps later injection rows correctly with CRLF line endings', () => {
    const content = 'init python:\r\n    x = 1\r\n    y = x\r\n';
    const ctx = createRangeContext('b1', 'a.rpy', content);
    const start = content.indexOf('x = 1');
    expect(content.slice(mapInjectionPoint(ctx, start, 1, 4), mapInjectionPoint(ctx, start, 1, 5))).toBe('x');
  });
});
