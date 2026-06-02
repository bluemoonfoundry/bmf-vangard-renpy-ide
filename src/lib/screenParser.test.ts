import { describe, it, expect } from 'vitest';
import { parseScreenCode } from './screenParser';
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

  it('parses if/else structure', () => {
    const code = `screen test():
    if persistent.flag:
        text "On"
    else:
        text "Off"`;
    const comp = parseScreenCode(code);
    expect(comp.widgets).toHaveLength(1);
    const ifWidget = comp.widgets[0];
    expect(ifWidget.type).toBe('if');
    expect(ifWidget.condition).toBe('persistent.flag');
    expect(ifWidget.children).toHaveLength(1);
    expect(ifWidget.children![0].type).toBe('text');
    expect(ifWidget.elseChildren).toHaveLength(1);
    expect(ifWidget.elseChildren![0].type).toBe('text');
    expect(ifWidget.elseChildren![0].text).toBe('Off');
  });

  it('parses for loop', () => {
    const code = `screen channels():
    vbox:
        for ch in persistent.channels:
            text ch`;
    const comp = parseScreenCode(code);
    const vbox = comp.widgets[0];
    expect(vbox.type).toBe('vbox');
    const forWidget = vbox.children![0];
    expect(forWidget.type).toBe('for');
    expect(forWidget.forVariable).toBe('ch');
    expect(forWidget.forIterable).toBe('persistent.channels');
    expect(forWidget.children![0].type).toBe('text');
  });

  it('parses python $ statement', () => {
    const code = `screen test():
    $ x = 5
    text "hi"`;
    const comp = parseScreenCode(code);
    expect(comp.widgets[0].type).toBe('python');
    expect(comp.widgets[0].code).toBe('x = 5');
    expect(comp.widgets[1].type).toBe('text');
  });

  it('preserves unrecognised attributes in extraProps', () => {
    const code = `screen test():
    frame:
        background "#000"
        xfill True
        text "hi"`;
    const comp = parseScreenCode(code);
    const frame = comp.widgets[0];
    expect(frame.extraProps).toContain('background "#000"');
    expect(frame.extraProps).toContain('xfill True');
  });

  it('emits extraProps verbatim in code generation round-trip', () => {
    const code = `screen test():
    frame:
        background "#000"
        xfill True
        text "hi"`;
    const comp = parseScreenCode(code);
    const generated = generateScreenCode(comp);
    expect(generated).toContain('background "#000"');
    expect(generated).toContain('xfill True');
  });

  it('generates correct code for if/else round-trip', () => {
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

  it('generates correct code for for loop round-trip', () => {
    const code = `screen test():
    for item in items:
        text item`;
    const comp = parseScreenCode(code);
    const out = generateScreenCode(comp);
    expect(out).toContain('for item in items:');
  });

  it('generates $ for single-line python', () => {
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

  it('falls back to raw for unrecognised top-level lines', () => {
    const code = `screen test():
    default volume = 0.5
    text "hi"`;
    const comp = parseScreenCode(code);
    expect(comp.widgets[0].type).toBe('raw');
    expect(comp.widgets[0].code).toBe('default volume = 0.5');
    expect(comp.widgets[1].type).toBe('text');
  });
});
