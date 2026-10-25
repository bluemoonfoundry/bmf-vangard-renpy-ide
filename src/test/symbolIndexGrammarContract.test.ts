import { describe, it, expect } from 'vitest';
import { parseBlock, disposeParsedBlock } from '@/lib/tree-sitter/parseBlock';

async function withTree<T>(source: string, read: (root: import('web-tree-sitter').SyntaxNode) => T): Promise<T> {
  const block = await parseBlock(source);
  try {
    return read(block.tree.rootNode);
  } finally {
    disposeParsedBlock(block);
  }
}

describe('grammar contract relied on by the symbol index', () => {
  it('exposes local and dotted label names as written', async () => {
    const source = 'label start:\n    jump .sub\nlabel .sub:\n    call start.sub\n    return\n';
    await withTree(source, (root) => {
      expect(root.hasError).toBe(false);
      expect(root.descendantsOfType('label_statement').map((n) => n.childForFieldName('name')?.text)).toEqual(['start', '.sub']);
      expect(root.descendantsOfType('jump_statement')[0].childForFieldName('target')?.text).toBe('.sub');
      expect(root.descendantsOfType('call_statement')[0].childForFieldName('target')?.text).toBe('start.sub');
    });
  });

  it('parses show/hide/call screen as dedicated statements with a name field', async () => {
    const source = 'label a:\n    show screen hud\n    hide screen hud\n    call screen inv(1, x=2)\n';
    await withTree(source, (root) => {
      expect(root.hasError).toBe(false);
      const nodes = root.descendantsOfType(['show_screen_statement', 'hide_screen_statement', 'call_screen_statement']);
      expect(nodes.map((n) => [n.type, n.childForFieldName('name')?.text])).toEqual([
        ['show_screen_statement', 'hud'],
        ['hide_screen_statement', 'hud'],
        ['call_screen_statement', 'inv'],
      ]);
    });
  });

  it('exposes dotted define/default names', async () => {
    const source = 'default persistent.seen = False\ndefine config.name = "X"\n';
    await withTree(source, (root) => {
      expect(root.hasError).toBe(false);
      expect(
        root.descendantsOfType(['default_statement', 'define_statement']).map((n) => n.childForFieldName('name')?.text),
      ).toEqual(['persistent.seen', 'config.name']);
    });
  });

  it('a leading CRLF blank line does not error', async () => {
    await withTree('\r\nlabel start:\r\n    "Hi"\r\n', (root) => {
      expect(root.hasError).toBe(false);
    });
  });

  it('expression text stops before a real comment and keeps quoted #', async () => {
    // A trailing comment after define/$ is still a local ERROR (nms4.27,
    // Task 13); the value text must already stop before it and keep the
    // quoted '#'.
    await withTree('define e = Character("E", color="#c8ffc8")  # main\n', (root) => {
      expect(root.descendantsOfType('define_statement')[0].childForFieldName('value')?.text).toBe(
        'Character("E", color="#c8ffc8")',
      );
      expect(root.descendantsOfType('comment').map((n) => n.text)).toEqual(['# main']);
    });
    await withTree('label a:\n    $ c = "#fff"  # x\n', (root) => {
      expect(root.descendantsOfType('dollar_statement')[0].childForFieldName('expression')?.text).toBe('c = "#fff"');
      expect(root.descendantsOfType('comment').map((n) => n.text)).toEqual(['# x']);
    });
    await withTree('screen s():\n    add Solid("#000")\n', (root) => {
      expect(root.hasError).toBe(false);
      expect(root.descendantsOfType('property')[0].text).toBe('Solid("#000")');
    });
    // A half-typed, unterminated quote ends with its line.
    await withTree('define x = "abc # half\ndefine y = 1\n', (root) => {
      expect(root.hasError).toBe(false);
      expect(root.descendantsOfType('define_statement').map((n) => n.childForFieldName('value')?.text)).toEqual([
        '"abc # half',
        '1',
      ]);
    });
  });
});
