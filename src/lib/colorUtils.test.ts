import { describe, it, expect } from 'vitest';
import { RenpyColor, deriveGuiColors, SDK_COLOR_SWATCHES } from '@/lib/colorUtils';

describe('RenpyColor', () => {
  // ── constructor / parsing ──────────────────────────────────────────────────

  it('parses a 6-digit hex color (channels stored as 0-1 floats)', () => {
    const c = new RenpyColor('#ff8800');
    expect(c.r).toBeCloseTo(1.0, 5);
    expect(c.g).toBeCloseTo(136 / 255, 5);
    expect(c.b).toBeCloseTo(0, 5);
    expect(c.a).toBe(1.0);
  });

  it('parses a 3-digit hex color by doubling digits', () => {
    const c = new RenpyColor('#f80');
    expect(c.r).toBeCloseTo(1.0, 5);
    expect(c.g).toBeCloseTo(136 / 255, 5);
    expect(c.b).toBeCloseTo(0, 5);
    expect(c.a).toBe(1.0);
  });

  it('parses an 8-digit hex color including alpha (stored as 0-1 float)', () => {
    const c = new RenpyColor('#ff880080');
    expect(c.r).toBeCloseTo(1.0, 5);
    expect(c.g).toBeCloseTo(136 / 255, 5);
    expect(c.b).toBeCloseTo(0, 5);
    expect(c.a).toBeCloseTo(128 / 255, 5);
  });

  // ── toHex ─────────────────────────────────────────────────────────────────

  it('toHex with alpha returns 8-char hex when alpha < 1', () => {
    // toHex only includes alpha channel when a < 1.0
    const c = new RenpyColor('#ff880080');
    expect(c.toHex()).toMatch(/^#[0-9a-f]{8}$/i);
  });

  it('toHex without alpha returns 6-char hex', () => {
    const c = new RenpyColor('#ff8800');
    const hex = c.toHex(false);
    expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
    expect(hex.toLowerCase()).toBe('#ff8800');
  });

  it('round-trips #ffffff through toHex', () => {
    const c = new RenpyColor('#ffffff');
    expect(c.toHex(false).toLowerCase()).toBe('#ffffff');
  });

  it('round-trips #000000 through toHex', () => {
    const c = new RenpyColor('#000000');
    expect(c.toHex(false).toLowerCase()).toBe('#000000');
  });

  // ── tint ──────────────────────────────────────────────────────────────────

  it('tint(1) returns white', () => {
    const c = new RenpyColor('#000000').tint(1);
    expect(c.toHex(false).toLowerCase()).toBe('#ffffff');
  });

  it('tint(0) returns the original color', () => {
    const hex = '#ff8800';
    const c = new RenpyColor(hex).tint(0);
    expect(c.toHex(false).toLowerCase()).toBe(hex);
  });

  it('tint(0.5) lightens toward white', () => {
    const original = new RenpyColor('#000000');
    const tinted = original.tint(0.5);
    expect(tinted.r).toBeGreaterThan(0);
  });

  // ── shade ─────────────────────────────────────────────────────────────────

  it('shade(1) returns black', () => {
    const c = new RenpyColor('#ffffff').shade(1);
    expect(c.toHex(false).toLowerCase()).toBe('#000000');
  });

  it('shade(0) returns the original color', () => {
    const hex = '#ff8800';
    const c = new RenpyColor(hex).shade(0);
    expect(c.toHex(false).toLowerCase()).toBe(hex);
  });

  // ── replaceOpacity ─────────────────────────────────────────────────────────

  it('replaceOpacity(0) sets alpha to 0', () => {
    const c = new RenpyColor('#ffffff').replaceOpacity(0);
    expect(c.a).toBe(0);
  });

  it('replaceOpacity(1) sets alpha to 1.0 (fully opaque)', () => {
    const c = new RenpyColor('#ffffff').replaceOpacity(1);
    expect(c.a).toBe(1);
  });

  // ── replaceValue ──────────────────────────────────────────────────────────

  it('replaceValue(0) returns black (value=0)', () => {
    const c = new RenpyColor('#ffffff').replaceValue(0);
    expect(c.toHex(false).toLowerCase()).toBe('#000000');
  });

  // ── replaceHSVSaturation ──────────────────────────────────────────────────

  it('replaceHSVSaturation(0) desaturates to gray', () => {
    const original = new RenpyColor('#ff0000');
    const gray = original.replaceHSVSaturation(0);
    // All channels equal for gray
    expect(gray.r).toBe(gray.g);
    expect(gray.g).toBe(gray.b);
  });

  // ── static hsvToRgb ────────────────────────────────────────────────────────

  it('hsvToRgb(0, 1, 1) returns red (values are 0-1 floats in {r,g,b} object)', () => {
    const rgb = RenpyColor.hsvToRgb(0, 1, 1);
    expect(rgb.r).toBeCloseTo(1, 5);
    expect(rgb.g).toBeCloseTo(0, 5);
    expect(rgb.b).toBeCloseTo(0, 5);
  });

  it('hsvToRgb(0, 0, 1) returns white', () => {
    const rgb = RenpyColor.hsvToRgb(0, 0, 1);
    expect(rgb.r).toBeCloseTo(1, 5);
    expect(rgb.g).toBeCloseTo(1, 5);
    expect(rgb.b).toBeCloseTo(1, 5);
  });

  it('hsvToRgb(0, 0, 0) returns black', () => {
    const rgb = RenpyColor.hsvToRgb(0, 0, 0);
    expect(rgb.r).toBeCloseTo(0, 5);
    expect(rgb.g).toBeCloseTo(0, 5);
    expect(rgb.b).toBeCloseTo(0, 5);
  });
});

describe('deriveGuiColors', () => {
  it('returns an object with 14 color keys for dark mode', () => {
    const colors = deriveGuiColors('#3498db', false);
    expect(Object.keys(colors)).toHaveLength(14);
  });

  it('returns an object with 14 color keys for light mode', () => {
    const colors = deriveGuiColors('#3498db', true);
    expect(Object.keys(colors)).toHaveLength(14);
  });

  it('returns hex strings as values', () => {
    const colors = deriveGuiColors('#3498db', false);
    for (const value of Object.values(colors)) {
      expect(value).toMatch(/^#[0-9a-f]{6,8}$/i);
    }
  });

  it('includes expected property names', () => {
    const colors = deriveGuiColors('#3498db', false);
    expect(colors).toHaveProperty('accent_color');
    expect(colors).toHaveProperty('text_color');
    expect(colors).toHaveProperty('selected_color');
  });

  it('produces different results for dark vs light mode', () => {
    const dark = deriveGuiColors('#3498db', false);
    const light = deriveGuiColors('#3498db', true);
    expect(dark.selected_color).not.toBe(light.selected_color);
  });
});

describe('SDK_COLOR_SWATCHES', () => {
  it('has dark and light keys', () => {
    expect(SDK_COLOR_SWATCHES).toHaveProperty('dark');
    expect(SDK_COLOR_SWATCHES).toHaveProperty('light');
  });

  it('dark swatches are 10 hex strings', () => {
    expect(SDK_COLOR_SWATCHES.dark).toHaveLength(10);
    for (const hex of SDK_COLOR_SWATCHES.dark) {
      expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('light swatches are 10 hex strings', () => {
    expect(SDK_COLOR_SWATCHES.light).toHaveLength(10);
    for (const hex of SDK_COLOR_SWATCHES.light) {
      expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});
