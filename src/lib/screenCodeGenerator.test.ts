import { describe, it, expect } from 'vitest';
import { generateScreenCode } from './screenCodeGenerator';
import type { ScreenLayoutComposition, ScreenWidget, ScreenWidgetType } from '@/types';

// ── helpers ──────────────────────────────────────────────────────────────────

function w(type: ScreenWidgetType, overrides: Partial<ScreenWidget> = {}): ScreenWidget {
  return { id: 'w1', type, ...overrides };
}

function comp(
  screenName: string,
  widgets: ScreenWidget[],
  overrides: Partial<ScreenLayoutComposition> = {},
): ScreenLayoutComposition {
  return { screenName, gameWidth: 1920, gameHeight: 1080, modal: false, zorder: 0, widgets, ...overrides };
}

// ── generateScreenCode: screen declaration ───────────────────────────────────

describe('generateScreenCode', () => {
  it('emits screen declaration with empty parens when no parameters', () => {
    const code = generateScreenCode(comp('main_menu', []));
    expect(code).toMatch(/^screen main_menu\(\):/);
  });

  it('emits screen declaration with parameters when set', () => {
    const code = generateScreenCode(comp('my_screen', [], { parameters: 'title, scroll=None' }));
    expect(code).toMatch(/^screen my_screen\(title, scroll=None\):/);
  });

  it('emits pass when widget list is empty', () => {
    const code = generateScreenCode(comp('empty', []));
    expect(code).toBe('screen empty():\n    pass');
  });

  it('appends modal True when modal is set', () => {
    const code = generateScreenCode(comp('modal_screen', [], { modal: true }));
    expect(code).toContain('modal True');
  });

  it('does not append modal True when modal is false', () => {
    const code = generateScreenCode(comp('normal', []));
    expect(code).not.toContain('modal');
  });

  it('appends zorder when non-zero', () => {
    const code = generateScreenCode(comp('z_screen', [], { zorder: 5 }));
    expect(code).toContain('zorder 5');
  });

  it('does not append zorder when zero', () => {
    const code = generateScreenCode(comp('z_screen', [], { zorder: 0 }));
    expect(code).not.toContain('zorder');
  });

  it('uses custom indent when provided', () => {
    const code = generateScreenCode(comp('s', [w('null')]), '  ');
    expect(code).toBe('screen s():\n  null');
  });
});

// ── simple leaf widgets ───────────────────────────────────────────────────────

describe('leaf widgets', () => {
  it('null → "null"', () => {
    expect(generateScreenCode(comp('s', [w('null')]))).toBe('screen s():\n    null');
  });

  it('transclude → "transclude"', () => {
    expect(generateScreenCode(comp('s', [w('transclude')]))).toBe('screen s():\n    transclude');
  });

  it('text with plain string → quoted', () => {
    const code = generateScreenCode(comp('s', [w('text', { text: 'Hello world' })]));
    expect(code).toContain('text "Hello world"');
  });

  it('text with expression (contains dot) → not re-quoted', () => {
    const code = generateScreenCode(comp('s', [w('text', { text: 'player.name' })]));
    expect(code).toContain('text player.name');
  });

  it('text with no text → empty string literal', () => {
    const code = generateScreenCode(comp('s', [w('text')]));
    expect(code).toContain('text ""');
  });

  it('label emits label keyword', () => {
    const code = generateScreenCode(comp('s', [w('label', { text: 'Chapter 1' })]));
    expect(code).toContain('label "Chapter 1"');
  });

  it('image emits add keyword with quoted path', () => {
    const code = generateScreenCode(comp('s', [w('image', { imagePath: 'gui/menu_bg.png' })]));
    expect(code).toContain('add "gui/menu_bg.png"');
  });

  it('image with expression path → not re-quoted', () => {
    const code = generateScreenCode(comp('s', [w('image', { imagePath: 'gui.menu_bg' })]));
    expect(code).toContain('add gui.menu_bg');
  });

  it('bar emits default AnimatedValue when barValue absent', () => {
    const code = generateScreenCode(comp('s', [w('bar')]));
    expect(code).toContain('bar value AnimatedValue(0, 100)');
  });

  it('bar emits explicit barValue', () => {
    const code = generateScreenCode(comp('s', [w('bar', { barValue: "Preference('music volume', 'set')" })]));
    expect(code).toContain("bar value Preference('music volume', 'set')");
  });

  it('vbar emits vbar keyword', () => {
    const code = generateScreenCode(comp('s', [w('vbar')]));
    expect(code).toContain('vbar value AnimatedValue(0, 100)');
  });

  it('input emits input default ""', () => {
    const code = generateScreenCode(comp('s', [w('input')]));
    expect(code).toContain('input default ""');
  });

  it('dismiss with no action → just dismiss', () => {
    const code = generateScreenCode(comp('s', [w('dismiss')]));
    expect(code).toContain('    dismiss');
  });

  it('dismiss with action → dismiss action ...', () => {
    const code = generateScreenCode(comp('s', [w('dismiss', { action: 'Return()' })]));
    expect(code).toContain('dismiss action Return()');
  });

  it('on with event and action', () => {
    const code = generateScreenCode(comp('s', [w('on', { onEvent: 'show', action: 'ShowTransition(dissolve)' })]));
    expect(code).toContain('on "show" action ShowTransition(dissolve)');
  });

  it('default emits variable and value', () => {
    const code = generateScreenCode(comp('s', [w('default', { defaultVariable: 'index', defaultValue: '0' })]));
    expect(code).toContain('default index = 0');
  });

  it('default uses fallback var and 0 when properties absent', () => {
    const code = generateScreenCode(comp('s', [w('default')]));
    expect(code).toContain('default var = 0');
  });

  it('key emits keysym and action', () => {
    const code = generateScreenCode(comp('s', [w('key', { keyBinding: 'game_menu', action: 'ShowMenu("save")' })]));
    expect(code).toContain('key "game_menu" action ShowMenu("save")');
  });

  it('timer emits delay and action', () => {
    const code = generateScreenCode(comp('s', [w('timer', { timerDelay: '0.5', action: 'Return()' })]));
    expect(code).toContain('timer 0.5 action Return()');
  });

  it('timer uses 0 delay when timerDelay absent', () => {
    const code = generateScreenCode(comp('s', [w('timer')]));
    expect(code).toContain('timer 0');
  });

  it('hotspot emits area and action', () => {
    const code = generateScreenCode(comp('s', [w('hotspot', { hotspotArea: '(0, 0, 100, 50)', action: 'Return()' })]));
    expect(code).toContain('hotspot (0, 0, 100, 50) action Return()');
  });

  it('hotbar emits area and value', () => {
    const code = generateScreenCode(comp('s', [w('hotbar', { hotspotArea: '(0, 0, 200, 20)', barValue: 'Preference("music volume")' })]));
    expect(code).toContain('hotbar (0, 0, 200, 20) value Preference("music volume")');
  });
});

// ── positioning attributes ────────────────────────────────────────────────────

describe('positioning attributes', () => {
  it('emits xpos and ypos for top-level widget', () => {
    const code = generateScreenCode(comp('s', [w('text', { text: 'Hi', xpos: 100, ypos: 200 })]));
    expect(code).toContain('xpos 100');
    expect(code).toContain('ypos 200');
  });

  it('emits xalign and yalign for top-level widget', () => {
    const code = generateScreenCode(comp('s', [w('text', { text: 'Hi', xalign: 0.5, yalign: 1.0 })]));
    expect(code).toContain('xalign 0.5');
    expect(code).toContain('yalign 1');
  });

  it('does NOT emit xpos/ypos for widget inside a container', () => {
    const child = w('text', { id: 'c1', text: 'Hi', xpos: 50, ypos: 75 });
    const parent = w('vbox', { id: 'p1', children: [child] });
    const code = generateScreenCode(comp('s', [parent]));
    expect(code).not.toContain('xpos');
    expect(code).not.toContain('ypos');
  });

  it('always emits xsize and ysize even inside a container', () => {
    const child = w('text', { id: 'c1', text: 'Hi', xsize: 300, ysize: 50 });
    const parent = w('vbox', { id: 'p1', children: [child] });
    const code = generateScreenCode(comp('s', [parent]));
    expect(code).toContain('xsize 300');
    expect(code).toContain('ysize 50');
  });
});

// ── textbutton ────────────────────────────────────────────────────────────────

describe('textbutton', () => {
  it('inline form when no style or extraProps', () => {
    const code = generateScreenCode(comp('s', [w('textbutton', { text: 'Start', action: 'Start()' })]));
    const line = code.split('\n')[1];
    expect(line).toBe('    textbutton "Start" action Start()');
    expect(line).not.toContain(':');
  });

  it('block form when style is set', () => {
    const code = generateScreenCode(comp('s', [w('textbutton', { text: 'Save', style: 'save_button' })]));
    expect(code).toContain('textbutton "Save":');
    expect(code).toContain('style "save_button"');
  });

  it('block form when extraProps is non-empty', () => {
    const code = generateScreenCode(comp('s', [w('textbutton', { text: 'X', extraProps: ['sensitive not renpy.seen_label("end")'] })]));
    expect(code).toContain('textbutton "X":');
    expect(code).toContain('sensitive not renpy.seen_label("end")');
  });
});

// ── button ────────────────────────────────────────────────────────────────────

describe('button', () => {
  it('always emits block form', () => {
    const code = generateScreenCode(comp('s', [w('button')]));
    expect(code).toContain('button:');
  });

  it('emits action as child line', () => {
    const code = generateScreenCode(comp('s', [w('button', { action: 'Jump("ch2")' })]));
    expect(code).toContain('        action Jump("ch2")');
  });

  it('emits hovered/unhovered as child lines', () => {
    const code = generateScreenCode(comp('s', [w('button', { hovered: 'SetVariable("hl", True)', unhovered: 'SetVariable("hl", False)' })]));
    expect(code).toContain('hovered SetVariable("hl", True)');
    expect(code).toContain('unhovered SetVariable("hl", False)');
  });

  it('emits pass for empty button', () => {
    const code = generateScreenCode(comp('s', [w('button')]));
    expect(code).toContain('        pass');
  });
});

// ── imagebutton ───────────────────────────────────────────────────────────────

describe('imagebutton', () => {
  it('emits auto attribute when set', () => {
    const code = generateScreenCode(comp('s', [w('imagebutton', { auto: 'gui/button/%s.png' })]));
    expect(code).toContain('auto "gui/button/%s.png"');
  });

  it('emits idle when auto is absent but imagePath is set', () => {
    const code = generateScreenCode(comp('s', [w('imagebutton', { imagePath: 'gui/btn_idle.png' })]));
    expect(code).toContain('idle "gui/btn_idle.png"');
    expect(code).not.toContain('auto');
  });

  it('does not emit idle when auto is set (auto takes priority)', () => {
    const code = generateScreenCode(comp('s', [w('imagebutton', { auto: 'gui/%s.png', imagePath: 'gui/idle.png' })]));
    expect(code).not.toContain('idle');
  });

  it('emits action when set', () => {
    const code = generateScreenCode(comp('s', [w('imagebutton', { action: 'Start()' })]));
    expect(code).toContain('action Start()');
  });
});

// ── mousearea ────────────────────────────────────────────────────────────────

describe('mousearea', () => {
  it('emits mousearea: block with hovered/unhovered', () => {
    const code = generateScreenCode(comp('s', [w('mousearea', {
      hovered: 'ShowLayer("overlay")',
      unhovered: 'HideLayer("overlay")',
    })]));
    expect(code).toContain('mousearea:');
    expect(code).toContain('hovered ShowLayer("overlay")');
    expect(code).toContain('unhovered HideLayer("overlay")');
  });

  it('emits pass for empty mousearea', () => {
    const code = generateScreenCode(comp('s', [w('mousearea')]));
    expect(code).toContain('mousearea:');
    expect(code).toContain('        pass');
  });
});

// ── layout containers ─────────────────────────────────────────────────────────

describe('layout containers', () => {
  it.each(['vbox', 'hbox', 'fixed', 'frame', 'window'] as const)(
    '%s emits block with colon', (type) => {
      const code = generateScreenCode(comp('s', [w(type)]));
      expect(code).toContain(`${type}:`);
    }
  );

  it('empty container emits pass', () => {
    const code = generateScreenCode(comp('s', [w('vbox')]));
    expect(code).toContain('        pass');
  });

  it('container with children emits children indented', () => {
    const child = w('text', { id: 'c1', text: 'Hello' });
    const code = generateScreenCode(comp('s', [w('vbox', { id: 'p1', children: [child] })]));
    expect(code).toContain('    vbox:');
    expect(code).toContain('        text "Hello"');
  });

  it('spacing emitted as child property', () => {
    const code = generateScreenCode(comp('s', [w('vbox', { spacing: '10' })]));
    expect(code).toContain('        spacing 10');
  });

  it('side emits sidePositions string', () => {
    const code = generateScreenCode(comp('s', [w('side', { sidePositions: 'c b' })]));
    expect(code).toContain('side "c b":');
  });

  it('grid emits cols and rows', () => {
    const code = generateScreenCode(comp('s', [w('grid', { cols: 3, rows: 2 })]));
    expect(code).toContain('grid 3 2:');
  });

  it('grid defaults to 1x1 when cols/rows absent', () => {
    const code = generateScreenCode(comp('s', [w('grid')]));
    expect(code).toContain('grid 1 1:');
  });
});

// ── viewport / vpgrid ────────────────────────────────────────────────────────

describe('viewport', () => {
  it('emits scrollbars as quoted string', () => {
    const code = generateScreenCode(comp('s', [w('viewport', { scrollbars: 'vertical' })]));
    expect(code).toContain('scrollbars "vertical"');
  });

  it('emits mousewheel True when set', () => {
    const code = generateScreenCode(comp('s', [w('viewport', { mousewheel: true })]));
    expect(code).toContain('mousewheel True');
  });
});

describe('vpgrid', () => {
  it('emits cols, rows, scrollbars, mousewheel, spacing', () => {
    const code = generateScreenCode(comp('s', [w('vpgrid', {
      cols: 4, rows: 3, scrollbars: 'both', mousewheel: true, spacing: '5',
    })]));
    expect(code).toContain('vpgrid:');
    expect(code).toContain('cols 4');
    expect(code).toContain('rows 3');
    expect(code).toContain('scrollbars "both"');
    expect(code).toContain('mousewheel True');
    expect(code).toContain('spacing 5');
  });
});

// ── use ──────────────────────────────────────────────────────────────────────

describe('use', () => {
  it('emits inline use when no children', () => {
    const code = generateScreenCode(comp('s', [w('use', { useScreen: 'navigation' })]));
    expect(code).toContain('    use navigation');
    expect(code).not.toContain('use navigation:');
  });

  it('emits args in parens', () => {
    const code = generateScreenCode(comp('s', [w('use', { useScreen: 'save_load', useArgs: "screen='save'" })]));
    expect(code).toContain("use save_load(screen='save')");
  });

  it('emits block form when children present', () => {
    const child = w('null', { id: 'c1' });
    const code = generateScreenCode(comp('s', [w('use', { id: 'u1', useScreen: 'nav', children: [child] })]));
    expect(code).toContain('use nav:');
    expect(code).toContain('        null');
  });

  it('falls back to unknown_screen when useScreen is absent', () => {
    const code = generateScreenCode(comp('s', [w('use')]));
    expect(code).toContain('use unknown_screen');
  });
});

// ── raw ──────────────────────────────────────────────────────────────────────

describe('raw', () => {
  it('emits single-line raw code at correct indent', () => {
    const code = generateScreenCode(comp('s', [w('raw', { code: 'if persistent.seen_intro:' })]));
    expect(code).toContain('    if persistent.seen_intro:');
  });

  it('emits multi-line raw code with each line at same depth', () => {
    const code = generateScreenCode(comp('s', [w('raw', { code: 'if flag:\n    pass\nelse:\n    pass' })]));
    expect(code).toContain('    if flag:');
    expect(code).toContain('        pass');
    expect(code).toContain('    else:');
  });

  it('emits empty string for raw with no code', () => {
    const code = generateScreenCode(comp('s', [w('raw')]));
    expect(code.split('\n')[1]).toBe('    ');
  });
});

// ── style / extraProps ────────────────────────────────────────────────────────

describe('style and extraProps', () => {
  it('style emitted as child line for containers', () => {
    const code = generateScreenCode(comp('s', [w('vbox', { style: 'dialogue_box' })]));
    expect(code).toContain('        style "dialogue_box"');
  });

  it('extraProps lines emitted as child lines', () => {
    const code = generateScreenCode(comp('s', [w('vbox', { extraProps: ['at transform_a', 'id "main_vbox"'] })]));
    expect(code).toContain('        at transform_a');
    expect(code).toContain('        id "main_vbox"');
  });
});

// ── drag / draggroup / imagemap / nearrect / transform ──────────────────────

describe('misc containers', () => {
  it('drag emits drag_name', () => {
    const code = generateScreenCode(comp('s', [w('drag', { dragName: 'card' })]));
    expect(code).toContain('drag drag_name "card":');
  });

  it('draggroup emits block', () => {
    const code = generateScreenCode(comp('s', [w('draggroup')]));
    expect(code).toContain('draggroup:');
  });

  it('imagemap emits block', () => {
    const code = generateScreenCode(comp('s', [w('imagemap')]));
    expect(code).toContain('imagemap:');
  });

  it('transform emits block', () => {
    const code = generateScreenCode(comp('s', [w('transform')]));
    expect(code).toContain('transform:');
  });

  it('nearrect emits focus and preferred_side', () => {
    const code = generateScreenCode(comp('s', [w('nearrect', {
      nearrectFocus: 'save_button',
      nearrectSide: 'bottom',
    })]));
    expect(code).toContain('nearrect:');
    expect(code).toContain('focus "save_button"');
    expect(code).toContain('preferred_side "bottom"');
  });
});

// ── nested structure ─────────────────────────────────────────────────────────

describe('nested structure', () => {
  it('generates correctly indented three-level nesting', () => {
    const inner = w('text', { id: 'i', text: 'Deep' });
    const mid = w('hbox', { id: 'm', children: [inner] });
    const outer = w('vbox', { id: 'o', children: [mid] });
    const code = generateScreenCode(comp('s', [outer]));
    const lines = code.split('\n');
    expect(lines[1]).toBe('    vbox:');
    expect(lines[2]).toBe('        hbox:');
    expect(lines[3]).toBe('            text "Deep"');
  });

  it('full screen: modal dialog with textbutton', () => {
    const title = w('text', { id: 't', text: 'Are you sure?' });
    const yes = w('textbutton', { id: 'y', text: 'Yes', action: 'Return(True)' });
    const no  = w('textbutton', { id: 'n', text: 'No',  action: 'Return(False)' });
    const row = w('hbox', { id: 'r', children: [yes, no] });
    const frame = w('frame', { id: 'f', children: [title, row] });
    const code = generateScreenCode(comp('confirm', [frame], { modal: true }));
    expect(code).toContain('screen confirm() modal True:');
    expect(code).toContain('    frame:');
    expect(code).toContain('        text "Are you sure?"');
    expect(code).toContain('        hbox:');
    expect(code).toContain('            textbutton "Yes" action Return(True)');
    expect(code).toContain('            textbutton "No" action Return(False)');
  });
});
