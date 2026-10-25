import { describe, it, expect } from 'vitest';
import { parseBlock } from '@/lib/tree-sitter/parseBlock';
import { extractSymbolTable } from '@/lib/tree-sitter/symbolTable';

describe('extractSymbolTable', () => {
  it('extracts a label with a nested default variable scoped to it', async () => {
    const { tree } = await parseBlock(
      'label start:\n    $ points = 0\n\ndefine e = Character("Eileen")\n'
    );
    const table = extractSymbolTable(tree);

    expect(table.labels).toHaveLength(1);
    expect(table.labels[0].name).toBe('start');
    expect(table.labels[0].kind).toBe('label');

    const pointsVar = table.variables.find((v) => v.name === 'points');
    expect(pointsVar).toBeDefined();
    expect(pointsVar?.declarationType).toBe('implicit');
    expect(pointsVar?.scopeId).toBe(table.labels[0].node.id.toString());

    const eVar = table.characters.find((c) => c.name === 'e');
    expect(eVar).toBeDefined();
    expect(eVar?.scopeId).toBeNull();
  });

  it('extracts screens with their declared name', async () => {
    const { tree } = await parseBlock('screen main_menu():\n    text "Hi"\n');
    const table = extractSymbolTable(tree);
    expect(table.screens).toHaveLength(1);
    expect(table.screens[0].name).toBe('main_menu');
  });

  it('classifies define x = Character(...) as a CharacterSymbol, not a VariableSymbol', async () => {
    const { tree } = await parseBlock('define e = Character("Eileen")\ndefine points_cap = 100\n');
    const table = extractSymbolTable(tree);

    expect(table.characters).toHaveLength(1);
    expect(table.characters[0].name).toBe('e');
    expect(table.characters[0].kind).toBe('character');
    expect(table.characters[0].initialValueExpr).toBe('Character("Eileen")');

    const capVar = table.variables.find((v) => v.name === 'points_cap');
    expect(capVar).toBeDefined();
    expect(capVar?.declarationType).toBe('define');
    expect(capVar?.initialValueExpr).toBe('100');
  });

  it('extracts default-declared variables at top level with null scopeId', async () => {
    const { tree } = await parseBlock('default trust = 0\n');
    const table = extractSymbolTable(tree);
    const trustVar = table.variables.find((v) => v.name === 'trust');
    expect(trustVar).toBeDefined();
    expect(trustVar?.declarationType).toBe('default');
    expect(trustVar?.scopeId).toBeNull();
  });

  it('extracts image statements with multi-word names', async () => {
    const { tree } = await parseBlock('image eileen happy = "eileen_happy.png"\n');
    const table = extractSymbolTable(tree);
    expect(table.images).toHaveLength(1);
    expect(table.images[0].name).toBe('eileen happy');
    expect(table.images[0].initialValueExpr).toBe('"eileen_happy.png"');
  });

  it('extracts menu statements with their choice texts', async () => {
    const { tree } = await parseBlock(
      'menu:\n    "Go left":\n        jump left\n    "Go right":\n        jump right\n'
    );
    const table = extractSymbolTable(tree);
    expect(table.menus).toHaveLength(1);
    expect(table.menus[0].choiceTexts).toEqual(['"Go left"', '"Go right"']);
  });

  it('leaves a menu caption and set out of the choice texts', async () => {
    const { tree } = await parseBlock(
      'menu:\n    set seen\n    e "Where?"\n    "Go left":\n        jump left\n    "Go right":\n        jump right\n'
    );
    const table = extractSymbolTable(tree);
    expect(table.menus).toHaveLength(1);
    expect(table.menus[0].choiceTexts).toEqual(['"Go left"', '"Go right"']);
  });

  it('extracts transform and style statements', async () => {
    const { tree } = await parseBlock(
      'transform my_transform:\n    xalign 0.5\n\nstyle my_style is default:\n    color "#fff"\n'
    );
    const table = extractSymbolTable(tree);
    expect(table.transforms).toHaveLength(1);
    expect(table.transforms[0].name).toBe('my_transform');
    expect(table.styles).toHaveLength(1);
    expect(table.styles[0].name).toBe('my_style');
    expect(table.styles[0].parent).toBe('default');
  });
});
