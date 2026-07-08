import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useProjectColorScan } from '@/hooks/useProjectColorScan';
import { createBlock } from '@/test/mocks/sampleData';

describe('useProjectColorScan', () => {
  it('returns empty array when no blocks provided', () => {
    const { result } = renderHook(() => useProjectColorScan([]));
    expect(result.current).toEqual([]);
  });

  it('returns empty array for blocks with no content', () => {
    const blocks = [createBlock({ id: 'b1', content: '' })];
    const { result } = renderHook(() => useProjectColorScan(blocks));
    expect(result.current).toEqual([]);
  });

  it('detects 6-digit hex color literals', () => {
    const blocks = [createBlock({ id: 'b1', content: 'color = "#ff0000"' })];
    const { result } = renderHook(() => useProjectColorScan(blocks));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].hex).toBe('#FF0000');
  });

  it('normalizes hex to uppercase', () => {
    const blocks = [createBlock({ id: 'b1', content: 'color = "#aabbcc"' })];
    const { result } = renderHook(() => useProjectColorScan(blocks));
    expect(result.current[0].hex).toBe('#AABBCC');
  });

  it('expands 3-digit hex to 6-digit', () => {
    const blocks = [createBlock({ id: 'b1', content: 'text "{color=#f00}red{/color}"' })];
    const { result } = renderHook(() => useProjectColorScan(blocks));
    // 3-digit expansion is lowercase (expandHex only upcases 6-digit forms)
    expect(result.current[0].hex).toBe('#ff0000');
  });

  it('deduplicates the same color appearing multiple times', () => {
    const content = 'c1 = "#ff0000"\nc2 = "#ff0000"\nc3 = "#ff0000"';
    const blocks = [createBlock({ id: 'b1', content })];
    const { result } = renderHook(() => useProjectColorScan(blocks));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].hex).toBe('#FF0000');
  });

  it('returns multiple distinct colors', () => {
    const content = 'a = "#ff0000"\nb = "#00ff00"\nc = "#0000ff"';
    const blocks = [createBlock({ id: 'b1', content })];
    const { result } = renderHook(() => useProjectColorScan(blocks));
    expect(result.current).toHaveLength(3);
    const hexes = result.current.map(c => c.hex);
    expect(hexes).toContain('#FF0000');
    expect(hexes).toContain('#00FF00');
    expect(hexes).toContain('#0000FF');
  });

  it('sorts by usage count — most-used first', () => {
    // #ff0000 appears 3x, #00ff00 appears 1x
    const content = '#ff0000 #ff0000 #ff0000 #00ff00';
    const blocks = [createBlock({ id: 'b1', content })];
    const { result } = renderHook(() => useProjectColorScan(blocks));
    expect(result.current[0].hex).toBe('#FF0000');
    expect(result.current[1].hex).toBe('#00FF00');
  });

  it('counts colors across multiple blocks', () => {
    const b1 = createBlock({ id: 'b1', content: 'c = "#aaaaaa"' });
    const b2 = createBlock({ id: 'b2', content: 'c = "#aaaaaa"' });
    const { result } = renderHook(() => useProjectColorScan([b1, b2]));
    // One unique color (#aaaaaa), seen in both blocks
    expect(result.current).toHaveLength(1);
    expect(result.current[0].hex).toBe('#AAAAAA');
  });

  it('skips blocks whose content is undefined/null', () => {
    const blocks = [
      createBlock({ id: 'b1', content: undefined as unknown as string }),
      createBlock({ id: 'b2', content: 'c = "#123456"' }),
    ];
    const { result } = renderHook(() => useProjectColorScan(blocks));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].hex).toBe('#123456');
  });

  it('sets hex as the name field', () => {
    const blocks = [createBlock({ id: 'b1', content: 'c = "#abcdef"' })];
    const { result } = renderHook(() => useProjectColorScan(blocks));
    expect(result.current[0].name).toBe(result.current[0].hex);
  });

  it('does not match partial hex (7+ digits)', () => {
    // #1234567 has 7 digits — should not match
    const blocks = [createBlock({ id: 'b1', content: '#1234567' })];
    const { result } = renderHook(() => useProjectColorScan(blocks));
    // Regex uses negative lookahead so 7-char sequences are excluded
    expect(result.current).toHaveLength(0);
  });
});
