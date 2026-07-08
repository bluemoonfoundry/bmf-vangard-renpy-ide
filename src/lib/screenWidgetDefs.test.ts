import { describe, it, expect } from 'vitest';
import { ELEM, HINT_KW_MAP, extractRawHints, rawBlockStyle } from '@/lib/screenWidgetDefs';

// ── ELEM registry ──────────────────────────────────────────────────────────

describe('ELEM registry', () => {
  it('contains entries for all layout container types', () => {
    const containers: Array<keyof typeof ELEM> = [
      'vbox', 'hbox', 'fixed', 'frame', 'window', 'side', 'viewport', 'vpgrid', 'grid',
    ];
    for (const type of containers) {
      expect(ELEM[type], `ELEM[${type}]`).toBeDefined();
      expect(ELEM[type].isContainer, `${type}.isContainer`).toBe(true);
    }
  });

  it('marks leaf (non-container) widgets correctly', () => {
    const leaves: Array<keyof typeof ELEM> = [
      'text', 'label', 'image', 'textbutton', 'imagebutton', 'bar', 'vbar',
      'input', 'null', 'dismiss', 'key', 'timer', 'mousearea', 'hotspot', 'hotbar',
    ];
    for (const type of leaves) {
      expect(ELEM[type].isContainer, `${type}.isContainer`).toBe(false);
    }
  });

  it('every entry has required fields: label, icon, colorClass, color', () => {
    for (const [key, def] of Object.entries(ELEM)) {
      expect(typeof def.label, `${key}.label type`).toBe('string');
      expect(def.label.length, `${key}.label length`).toBeGreaterThan(0);
      expect(typeof def.icon, `${key}.icon type`).toBe('string');
      expect(def.icon.length, `${key}.icon length`).toBeGreaterThan(0);
      expect(def.colorClass, `${key}.colorClass`).toBeTruthy();
      expect(def.color, `${key}.color`).toBeTruthy();
    }
  });

  it('color values are hex strings (#rrggbb)', () => {
    for (const [key, def] of Object.entries(ELEM)) {
      expect(def.color, `${key}.color`).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('colorClass values use Tailwind bg- prefix', () => {
    for (const [key, def] of Object.entries(ELEM)) {
      expect(def.colorClass, `${key}.colorClass`).toMatch(/^bg-/);
    }
  });

  it('contains the fallback "raw" entry with code icon', () => {
    expect(ELEM['raw']).toBeDefined();
    expect(ELEM['raw'].icon).toBe('{}');
    expect(ELEM['raw'].isContainer).toBe(false);
  });
});

// ── HINT_KW_MAP ─────────────────────────────────────────────────────────────

describe('HINT_KW_MAP', () => {
  it('maps vbox, hbox, fixed to themselves', () => {
    expect(HINT_KW_MAP['vbox']).toBe('vbox');
    expect(HINT_KW_MAP['hbox']).toBe('hbox');
    expect(HINT_KW_MAP['fixed']).toBe('fixed');
  });

  it('maps "add" keyword to "image" widget type', () => {
    expect(HINT_KW_MAP['add']).toBe('image');
  });

  it('maps interactive widgets: textbutton, button, imagebutton, bar, vbar, input', () => {
    expect(HINT_KW_MAP['textbutton']).toBe('textbutton');
    expect(HINT_KW_MAP['button']).toBe('button');
    expect(HINT_KW_MAP['imagebutton']).toBe('imagebutton');
    expect(HINT_KW_MAP['bar']).toBe('bar');
    expect(HINT_KW_MAP['vbar']).toBe('vbar');
    expect(HINT_KW_MAP['input']).toBe('input');
  });

  it('maps drag, draggroup, imagemap, hotspot, hotbar', () => {
    expect(HINT_KW_MAP['drag']).toBe('drag');
    expect(HINT_KW_MAP['draggroup']).toBe('draggroup');
    expect(HINT_KW_MAP['imagemap']).toBe('imagemap');
    expect(HINT_KW_MAP['hotspot']).toBe('hotspot');
    expect(HINT_KW_MAP['hotbar']).toBe('hotbar');
  });
});

// ── extractRawHints ──────────────────────────────────────────────────────────

describe('extractRawHints', () => {
  it('returns empty array for empty string', () => {
    expect(extractRawHints('')).toEqual([]);
  });

  it('extracts a single widget keyword from one line', () => {
    expect(extractRawHints('vbox:')).toContain('vbox');
  });

  it('extracts multiple distinct widget keywords from multiple lines', () => {
    const code = 'vbox:\n    text "Hello"\n    button action NullAction()';
    const hints = extractRawHints(code);
    expect(hints).toContain('vbox');
    expect(hints).toContain('text');
    expect(hints).toContain('button');
  });

  it('does not duplicate keywords appearing on multiple lines', () => {
    const code = 'vbox:\n    vbox:\n        text "a"';
    const hints = extractRawHints(code);
    const vboxCount = hints.filter(h => h === 'vbox').length;
    expect(vboxCount).toBe(1);
  });

  it('ignores lines with unknown keywords', () => {
    const code = 'unknown_widget:\n    foobar baz';
    expect(extractRawHints(code)).toEqual([]);
  });

  it('maps "add" keyword to "image" type', () => {
    const hints = extractRawHints('add "bg.png"');
    expect(hints).toContain('image');
  });

  it('strips trailing colon when extracting the keyword', () => {
    // "hbox:" should be recognised as hbox, not "hbox:"
    const hints = extractRawHints('hbox:');
    expect(hints).toContain('hbox');
  });

  it('handles indented lines by trimming whitespace', () => {
    const code = '    frame:\n        text "hi"';
    const hints = extractRawHints(code);
    expect(hints).toContain('frame');
    expect(hints).toContain('text');
  });
});

// ── rawBlockStyle ────────────────────────────────────────────────────────────

describe('rawBlockStyle', () => {
  it('returns "?" icon for "if" blocks', () => {
    expect(rawBlockStyle('if flag:')).toMatchObject({ icon: '?' });
  });

  it('returns "?" icon for "elif" blocks', () => {
    expect(rawBlockStyle('elif other_flag:')).toMatchObject({ icon: '?' });
  });

  it('returns "?" icon for "else" blocks', () => {
    expect(rawBlockStyle('else:')).toMatchObject({ icon: '?' });
  });

  it('returns eye icon for "showif" blocks', () => {
    expect(rawBlockStyle('showif condition:')).toMatchObject({ icon: '👁' });
  });

  it('returns loop icon for "for" blocks', () => {
    expect(rawBlockStyle('for i in items:')).toMatchObject({ icon: '↺' });
  });

  it('returns "$" icon for inline Python "$" statement', () => {
    expect(rawBlockStyle('$ x = 1')).toMatchObject({ icon: '$' });
  });

  it('returns "$" icon for "python" blocks', () => {
    expect(rawBlockStyle('python:')).toMatchObject({ icon: '$' });
  });

  it('returns default "{}" icon for unrecognised first keyword', () => {
    expect(rawBlockStyle('jump some_label')).toMatchObject({ icon: '{}' });
  });

  it('returns default "{}" icon for empty string', () => {
    expect(rawBlockStyle('')).toMatchObject({ icon: '{}' });
  });

  it('returns color and colorClass for every branch', () => {
    const results = [
      rawBlockStyle('if x:'),
      rawBlockStyle('showif x:'),
      rawBlockStyle('for x in y:'),
      rawBlockStyle('$ x = 1'),
      rawBlockStyle('python:'),
      rawBlockStyle('jump end'),
    ];
    for (const style of results) {
      expect(style.color).toBeTruthy();
      expect(style.colorClass).toBeTruthy();
    }
  });
});
