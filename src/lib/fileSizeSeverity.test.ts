import { describe, it, expect } from 'vitest';
import {
  DEFAULT_FILE_SIZE_THRESHOLDS,
  getLineCount,
  getFileSizeSeverity,
  getFileSizeSeverityLabel,
  getFileSizeSeverityDotClass,
  getFileSizeSeverityTextClass,
  getFileSizeSeverityLimit,
} from '@/lib/fileSizeSeverity';

describe('getLineCount', () => {
  it('counts lines by splitting on newline', () => {
    expect(getLineCount('a\nb\nc')).toBe(3);
  });

  it('counts a single line with no newline as 1', () => {
    expect(getLineCount('just one line')).toBe(1);
  });

  it('counts an empty string as 1', () => {
    expect(getLineCount('')).toBe(1);
  });
});

describe('getFileSizeSeverity', () => {
  const t = DEFAULT_FILE_SIZE_THRESHOLDS;

  it('returns green at 0 lines', () => {
    expect(getFileSizeSeverity(0, t)).toBe('green');
  });

  it('returns green exactly at the healthy boundary (500)', () => {
    expect(getFileSizeSeverity(500, t)).toBe('green');
  });

  it('returns yellow just past the healthy boundary (501)', () => {
    expect(getFileSizeSeverity(501, t)).toBe('yellow');
  });

  it('returns yellow exactly at the warning boundary (1000)', () => {
    expect(getFileSizeSeverity(1000, t)).toBe('yellow');
  });

  it('returns orange just past the warning boundary (1001)', () => {
    expect(getFileSizeSeverity(1001, t)).toBe('orange');
  });

  it('returns orange exactly at the critical boundary (1500)', () => {
    expect(getFileSizeSeverity(1500, t)).toBe('orange');
  });

  it('returns red just past the critical boundary (1501)', () => {
    expect(getFileSizeSeverity(1501, t)).toBe('red');
  });

  it('returns red for very large line counts', () => {
    expect(getFileSizeSeverity(50000, t)).toBe('red');
  });

  it('respects custom thresholds', () => {
    const custom = { healthy: 100, warning: 200, critical: 300 };
    expect(getFileSizeSeverity(100, custom)).toBe('green');
    expect(getFileSizeSeverity(150, custom)).toBe('yellow');
    expect(getFileSizeSeverity(250, custom)).toBe('orange');
    expect(getFileSizeSeverity(301, custom)).toBe('red');
  });
});

describe('getFileSizeSeverityLabel', () => {
  it('maps each severity to its display label', () => {
    expect(getFileSizeSeverityLabel('green')).toBe('Ideal');
    expect(getFileSizeSeverityLabel('yellow')).toBe('Healthy');
    expect(getFileSizeSeverityLabel('orange')).toBe('Warning');
    expect(getFileSizeSeverityLabel('red')).toBe('Critical');
  });
});

describe('getFileSizeSeverityDotClass / getFileSizeSeverityTextClass', () => {
  it('returns a non-empty Tailwind class string for every severity', () => {
    (['green', 'yellow', 'orange', 'red'] as const).forEach((severity) => {
      expect(getFileSizeSeverityDotClass(severity)).toMatch(/bg-/);
      expect(getFileSizeSeverityTextClass(severity)).toMatch(/text-/);
    });
  });
});

describe('getFileSizeSeverityLimit', () => {
  const t = DEFAULT_FILE_SIZE_THRESHOLDS;

  it('shows the healthy threshold for green', () => {
    expect(getFileSizeSeverityLimit('green', t)).toBe(500);
  });

  it('shows the healthy threshold for yellow (the boundary it crossed)', () => {
    expect(getFileSizeSeverityLimit('yellow', t)).toBe(500);
  });

  it('shows the warning threshold for orange (the boundary it crossed)', () => {
    expect(getFileSizeSeverityLimit('orange', t)).toBe(1000);
  });

  it('shows the critical threshold for red (the boundary it crossed)', () => {
    expect(getFileSizeSeverityLimit('red', t)).toBe(1500);
  });
});
