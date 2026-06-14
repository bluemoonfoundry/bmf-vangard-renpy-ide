import { describe, it, expect } from 'vitest';
import { parseScreenCode, parseDefineVariables, parseProjectStyles } from './screenParser';
import { generateScreenCode } from './screenCodeGenerator';

describe('screenParser', () => {
  it('parses a simple screen with text and textbutton', () => {
    const code = `screen my_menu():
    vbox xalign 0.5 yalign 0.5:
        text "Hello World"
        textbutton "Start" action Start()`;
    const comp = parseScreenCode(code);
    expect(comp.screenName).toBe('my_menu');
    expect(comp.widgets).toHaveLength(1);
    expect(comp.widgets[0].type).toBe('vbox');
    expect(comp.widgets[0].xalign).toBe(0.5);
    expect(comp.widgets[0].children).toHaveLength(2);
    expect(comp.widgets[0].children![0].type).toBe('text');
    expect(comp.widgets[0].children![0].text).toBe('Hello World');
    expect(comp.widgets[0].children![1].type).toBe('textbutton');
    expect(comp.widgets[0].children![1].text).toBe('Start');
    expect(comp.widgets[0].children![1].action).toBe('Start()');
  });

  it('parses screen header attributes: modal and zorder', () => {
    const code = `screen hud() modal True zorder 5:
    text "HUD"`;
    const comp = parseScreenCode(code);
    expect(comp.screenName).toBe('hud');
    expect(comp.modal).toBe(true);
    expect(comp.zorder).toBe(5);
  });

  it('parses screen without parentheses in header', () => {
    const code = `screen my_screen:
    text "hi"`;
    const comp = parseScreenCode(code);
    expect(comp.screenName).toBe('my_screen');
    expect(comp.parameters).toBeUndefined();
    expect(comp.widgets[0].type).toBe('text');
  });

  it('captures if/else as a single compound raw block', () => {
    const code = `screen test():
    if persistent.flag:
        text "On"
    else:
        text "Off"`;
    const comp = parseScreenCode(code);
    expect(comp.widgets).toHaveLength(1);
    const raw = comp.widgets[0];
    expect(raw.type).toBe('raw');
    expect(raw.code).toContain('if persistent.flag:');
    expect(raw.code).toContain('else:');
    expect(raw.code).toContain('text "On"');
    expect(raw.code).toContain('text "Off"');
  });

  it('captures if/elif/else as a single compound raw block', () => {
    const code = `screen test():
    if scroll == "viewport":
        text "vp"
    elif scroll == "vpgrid":
        text "grid"
    else:
        text "other"`;
    const comp = parseScreenCode(code);
    expect(comp.widgets).toHaveLength(1);
    const raw = comp.widgets[0];
    expect(raw.type).toBe('raw');
    expect(raw.code).toContain('if scroll == "viewport":');
    expect(raw.code).toContain('elif scroll == "vpgrid":');
    expect(raw.code).toContain('else:');
    expect(raw.code).toContain('text "grid"');
  });

  it('captures for loop as a raw block', () => {
    const code = `screen channels():
    vbox:
        for ch in persistent.channels:
            text ch`;
    const comp = parseScreenCode(code);
    const vbox = comp.widgets[0];
    expect(vbox.type).toBe('vbox');
    const raw = vbox.children![0];
    expect(raw.type).toBe('raw');
    expect(raw.code).toContain('for ch in persistent.channels:');
    expect(raw.code).toContain('text ch');
  });

  it('captures showif as a raw block', () => {
    const code = `screen test():
    showif visible:
        text "shown"`;
    const comp = parseScreenCode(code);
    expect(comp.widgets[0].type).toBe('raw');
    expect(comp.widgets[0].code).toContain('showif visible:');
    expect(comp.widgets[0].code).toContain('text "shown"');
  });

  it('captures $ python as a raw node', () => {
    const code = `screen test():
    $ x = 5
    text "hi"`;
    const comp = parseScreenCode(code);
    expect(comp.widgets[0].type).toBe('raw');
    expect(comp.widgets[0].code).toBe('$ x = 5');
    expect(comp.widgets[1].type).toBe('text');
  });

  it('captures python: block as a raw node with header', () => {
    const code = `screen test():
    python:
        x = 1
        y = 2`;
    const comp = parseScreenCode(code);
    expect(comp.widgets[0].type).toBe('raw');
    expect(comp.widgets[0].code).toContain('python:');
    expect(comp.widgets[0].code).toContain('x = 1');
  });

  it('parses style properties (background, xfill) into styleProps, not raw children', () => {
    const code = `screen test():
    frame:
        background "#000"
        xfill True
        text "hi"`;
    const comp = parseScreenCode(code);
    const frame = comp.widgets[0];
    expect(frame.children).toBeDefined();
    // style props are absorbed — no raw children for background / xfill
    const rawCodes = frame.children!
      .filter(c => c.type === 'raw')
      .map(c => c.code);
    expect(rawCodes).not.toContain('background "#000"');
    expect(rawCodes).not.toContain('xfill True');
    // parsed into styleProps
    expect(frame.styleProps?.background).toBe('#000');
    expect(frame.styleProps?.xfill).toBe(true);
    // text child is still a typed widget
    expect(frame.children!.some(c => c.type === 'text')).toBe(true);
  });

  it('emits raw child nodes verbatim in code generation round-trip', () => {
    const code = `screen test():
    frame:
        $ x = 1
        text "hi"`;
    const comp = parseScreenCode(code);
    const generated = generateScreenCode(comp);
    expect(generated).toContain('$ x = 1');
  });

  it('round-trips if/else as raw', () => {
    const code = `screen test():
    if persistent.flag:
        text "On"
    else:
        text "Off"`;
    const comp = parseScreenCode(code);
    const out = generateScreenCode(comp);
    expect(out).toContain('if persistent.flag:');
    expect(out).toContain('else:');
    expect(out).toContain('"On"');
    expect(out).toContain('"Off"');
  });

  it('round-trips for loop as raw', () => {
    const code = `screen test():
    for item in items:
        text item`;
    const comp = parseScreenCode(code);
    const out = generateScreenCode(comp);
    expect(out).toContain('for item in items:');
    expect(out).toContain('text item');
  });

  it('round-trips $ python as raw', () => {
    const code = `screen test():
    $ x = get_value()`;
    const comp = parseScreenCode(code);
    const out = generateScreenCode(comp);
    expect(out).toContain('$ x = get_value()');
  });

  it('parses add keyword as image widget', () => {
    const code = `screen test():
    add "images/bg.png"`;
    const comp = parseScreenCode(code);
    expect(comp.widgets[0].type).toBe('image');
    expect(comp.widgets[0].imagePath).toBe('images/bg.png');
  });

  it('parses screen parameters', () => {
    const code = `screen game_menu(title, scroll=None, yinitial=0.0, spacing=0):
    text "hi"`;
    const comp = parseScreenCode(code);
    expect(comp.screenName).toBe('game_menu');
    expect(comp.parameters).toBe('title, scroll=None, yinitial=0.0, spacing=0');
    expect(generateScreenCode(comp)).toContain('screen game_menu(title, scroll=None, yinitial=0.0, spacing=0):');
  });

  it('parses vpgrid as a structured container with cols property', () => {
    const code = `screen test():
    vpgrid:
        cols 1
        text "a"
        text "b"`;
    const comp = parseScreenCode(code);
    const grid = comp.widgets[0];
    expect(grid.type).toBe('vpgrid');
    expect(grid.cols).toBe(1);
    expect(grid.children?.some(c => c.type === 'text')).toBe(true);
  });

  it('parses grid with positional cols rows', () => {
    const code = `screen test():
    grid 3 2:
        text "a"`;
    const comp = parseScreenCode(code);
    const grid = comp.widgets[0];
    expect(grid.type).toBe('grid');
    expect(grid.cols).toBe(3);
    expect(grid.rows).toBe(2);
    expect(grid.children![0].type).toBe('text');
  });

  it('captures truly unrecognised block statements as multi-line raw nodes', () => {
    const code = `screen test():
    someUnknownWidget:
        prop1 True
        text "a"`;
    const comp = parseScreenCode(code);
    expect(comp.widgets[0].type).toBe('raw');
    expect(comp.widgets[0].code).toContain('someUnknownWidget:');
    expect(comp.widgets[0].code).toContain('prop1 True');
  });

  it('captures unquoted add expression without wrapping in quotes', () => {
    const code = `screen test():
    add gui.main_menu_background`;
    const comp = parseScreenCode(code);
    expect(comp.widgets[0].type).toBe('image');
    expect(comp.widgets[0].imagePath).toBe('gui.main_menu_background');
    const out = generateScreenCode(comp);
    expect(out).toContain('add gui.main_menu_background');
    expect(out).not.toContain('add "gui.main_menu_background"');
  });

  it('emits style as child property for containers', () => {
    const code = `screen test():
    frame:
        style "my_frame"
        text "hi"`;
    const comp = parseScreenCode(code);
    expect(comp.widgets[0].style).toBe('my_frame');
    const out = generateScreenCode(comp);
    expect(out).toMatch(/frame\s*:/);
    expect(out).toContain('    style "my_frame"');
    expect(out).not.toContain('frame style');
  });

  it('does not emit pass when frame has only a style property', () => {
    const code = `screen test():
    frame:
        style "outer_frame"`;
    const comp = parseScreenCode(code);
    const out = generateScreenCode(comp);
    expect(out).toContain('frame:');
    expect(out).toContain('    style "outer_frame"');
    expect(out).not.toContain('pass');
  });

  it('does emit pass when container has no children and no properties', () => {
    const code = `screen test():
    vbox:
        pass`;
    const comp = parseScreenCode(code);
    const out = generateScreenCode(comp);
    expect(out).toContain('pass');
  });

  it('does not emit pass for button with only action', () => {
    const code = `screen test():
    button:
        action Return()`;
    const comp = parseScreenCode(code);
    expect(comp.widgets[0].type).toBe('button');
    expect(comp.widgets[0].action).toBe('Return()');
    const out = generateScreenCode(comp);
    expect(out).toContain('button:');
    expect(out).toContain('action Return()');
    expect(out).not.toContain('pass');
  });

  it('parses on event handler', () => {
    const code = `screen test():
    on "show" action SomeAction()`;
    const comp = parseScreenCode(code);
    expect(comp.widgets[0].type).toBe('on');
    expect(comp.widgets[0].onEvent).toBe('show');
    expect(comp.widgets[0].action).toBe('SomeAction()');
    const out = generateScreenCode(comp);
    expect(out).toContain('on "show" action SomeAction()');
  });

  it('parses default screen variable', () => {
    const code = `screen test():
    default count = 0
    text "hi"`;
    const comp = parseScreenCode(code);
    expect(comp.widgets[0].type).toBe('default');
    expect(comp.widgets[0].defaultVariable).toBe('count');
    expect(comp.widgets[0].defaultValue).toBe('0');
    expect(comp.widgets[1].type).toBe('text');
    const out = generateScreenCode(comp);
    expect(out).toContain('default count = 0');
  });

  it('parses label widget', () => {
    const code = `screen test():
    label "Section Title"`;
    const comp = parseScreenCode(code);
    expect(comp.widgets[0].type).toBe('label');
    expect(comp.widgets[0].text).toBe('Section Title');
    const out = generateScreenCode(comp);
    expect(out).toContain('label "Section Title"');
  });

  it('parses hotspot with area tuple', () => {
    const code = `screen test():
    imagemap:
        hotspot (0, 0, 100, 100) action Jump("label")`;
    const comp = parseScreenCode(code);
    const im = comp.widgets[0];
    expect(im.type).toBe('imagemap');
    const hs = im.children![0];
    expect(hs.type).toBe('hotspot');
    expect(hs.hotspotArea).toBe('(0, 0, 100, 100)');
    expect(hs.action).toBe('Jump("label")');
  });

  it('parses style_prefix into widget.stylePrefix', () => {
    const code = `screen choice(items):
    style_prefix "choice"
    vbox:
        style_prefix "choice"
        for i in items:
            textbutton i.caption action i.action`;
    const comp = parseScreenCode(code);
    // style_prefix at top level is a raw child (no parent in stack)
    // but inside a container it should be set on the widget
    const vbox = comp.widgets.find(w => w.type === 'vbox');
    expect(vbox?.stylePrefix).toBe('choice');
  });
});

describe('parseDefineVariables', () => {
  it('extracts string and numeric literals', () => {
    const content = `
define gui.text_color = '#404040'
define gui.text_size = 33
define gui.main_menu_background = "gui/main_menu.png"
`;
    const vars = parseDefineVariables([content]);
    expect(vars.get('gui.text_color')).toBe('#404040');
    expect(vars.get('gui.text_size')).toBe('33');
    expect(vars.get('gui.main_menu_background')).toBe('gui/main_menu.png');
  });

  it('resolves cross-references in a second pass', () => {
    const content = `
define gui.interface_text_size = 33
define gui.button_text_size = gui.interface_text_size
`;
    const vars = parseDefineVariables([content]);
    expect(vars.get('gui.button_text_size')).toBe('33');
  });
});

describe('parseProjectStyles', () => {
  it('parses a style block with literal properties', () => {
    const content = `
style frame:
    background "#1a1a2e"
    xpadding 20
    ypadding 10
`;
    const vars = new Map<string, string>();
    const styleMap = parseProjectStyles([content], vars);
    expect(styleMap.get('frame')?.background).toBe('#1a1a2e');
    expect(styleMap.get('frame')?.xpadding).toBe(20);
    expect(styleMap.get('frame')?.ypadding).toBe(10);
  });

  it('resolves variable references in style properties', () => {
    const defineContent = `define gui.text_color = '#404040'\ndefine gui.text_size = 33`;
    const styleContent = `
style default:
    color gui.text_color
    size gui.text_size
`;
    const vars = parseDefineVariables([defineContent]);
    const styleMap = parseProjectStyles([styleContent], vars);
    expect(styleMap.get('default')?.color).toBe('#404040');
    expect(styleMap.get('default')?.fontSize).toBe(33);
  });

  it('resolves style inheritance', () => {
    const content = `
style base:
    color "#ffffff"
    size 24
style child is base:
    bold True
`;
    const vars = new Map<string, string>();
    const styleMap = parseProjectStyles([content], vars);
    const child = styleMap.get('child');
    expect(child?.color).toBe('#ffffff');   // inherited
    expect(child?.fontSize).toBe(24);        // inherited
    expect(child?.bold).toBe(true);          // own
  });
});
