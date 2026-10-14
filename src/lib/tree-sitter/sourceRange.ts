/**
 * @file sourceRange.ts
 * @description Converts tree-sitter offsets into the symbol index's plain
 * `SourceRange` data, and maps points inside an injected Python tree back to
 * offsets in the original `.rpy` source.
 *
 * Offsets are UTF-16 code units: web-tree-sitter's `startIndex`/`endIndex`
 * for a JS-string parse are already code units, so `content.slice(start, end)`
 * returns the node text.
 */
import type { SyntaxNode } from 'web-tree-sitter';
import type { SourcePoint, SourceRange } from '@/types';

export interface RangeContext {
  blockId: string;
  filePath: string;
  content: string;
  /** Offset of the first character of each line; lineStarts[0] === 0. */
  lineStarts: number[];
}

export function createRangeContext(blockId: string, filePath: string, content: string): RangeContext {
  const lineStarts = [0];
  for (let i = 0; i < content.length; i++) {
    if (content.charCodeAt(i) === 10) lineStarts.push(i + 1);
  }
  return { blockId, filePath, content, lineStarts };
}

/** 0-based index of the line containing `offset` (binary search). */
function lineIndexAt(ctx: RangeContext, offset: number): number {
  let lo = 0;
  let hi = ctx.lineStarts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (ctx.lineStarts[mid] <= offset) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

export function pointAt(ctx: RangeContext, offset: number): SourcePoint {
  const index = lineIndexAt(ctx, offset);
  return { line: index + 1, column: offset - ctx.lineStarts[index], offset };
}

export function rangeFromOffsets(ctx: RangeContext, start: number, end: number): SourceRange {
  return { blockId: ctx.blockId, filePath: ctx.filePath, start: pointAt(ctx, start), end: pointAt(ctx, end) };
}

export function rangeOfNode(ctx: RangeContext, node: SyntaxNode): SourceRange {
  return rangeFromOffsets(ctx, node.startIndex, node.endIndex);
}

/**
 * Maps a (row, column) point inside an injected Python tree back to an offset
 * in the original source. `parseBlock` slices the injection from
 * `injectionStart` and dedents every line after the first by up to the first
 * line's column, stripping spaces only — so row 0 is relative to
 * `injectionStart`, and row n > 0 is relative to that source line's start plus
 * however many leading spaces (at most the dedent column) were stripped.
 */
export function mapInjectionPoint(ctx: RangeContext, injectionStart: number, row: number, column: number): number {
  if (row === 0) return injectionStart + column;
  const firstLine = lineIndexAt(ctx, injectionStart);
  const dedentColumn = injectionStart - ctx.lineStarts[firstLine];
  const lineStart = ctx.lineStarts[firstLine + row];
  let stripped = 0;
  while (stripped < dedentColumn && ctx.content.charCodeAt(lineStart + stripped) === 32) stripped++;
  return lineStart + stripped + column;
}
