import { describe, it, expect } from 'vitest';
import type { SyntaxNode } from 'web-tree-sitter';
import { parseBlock, disposeParsedBlock } from '@/lib/tree-sitter/parseBlock';

/**
 * The corpus S-expressions show node types but not text, so they can't tell
 * `.sub` from `sub` or `persistent.seen` from `persistent`. These checks pin
 * the leaf text of dotted label names (nms4.10), screen statement names
 * (nms4.11), and dotted define/default names (nms4.12) through the committed
 * renpy.wasm.
 */
async function withRoot<T>(source: string, read: (root: SyntaxNode) => T): Promise<T> {
  const block = await parseBlock(source);
  try {
    return read(block.tree.rootNode);
  } finally {
    disposeParsedBlock(block);
  }
}

const fieldText = (nodes: SyntaxNode[], field: string) => nodes.map((n) => n.childForFieldName(field)?.text);

describe('tree-sitter-renpy name text', () => {
  it('keeps local and dotted label names whole (nms4.10)', async () => {
    const source = 'label start:\n    jump .sub\n    call start.sub from _call_sub\nlabel .sub:\n    return\n';
    await withRoot(source, (root) => {
      expect(root.hasError).toBe(false);
      expect(fieldText(root.descendantsOfType('label_statement'), 'name')).toEqual(['start', '.sub']);
      expect(fieldText(root.descendantsOfType('jump_statement'), 'target')).toEqual(['.sub']);
      const call = root.descendantsOfType('call_statement');
      expect(fieldText(call, 'target')).toEqual(['start.sub']);
      expect(fieldText(call, 'from_label')).toEqual(['_call_sub']);
    });
  });

  it('names the screen in show/hide/call screen statements (nms4.11)', async () => {
    const source = 'label a:\n    show screen hud\n    hide screen hud\n    call screen inv(1, x=2)\n';
    await withRoot(source, (root) => {
      expect(root.hasError).toBe(false);
      const nodes = root.descendantsOfType(['show_screen_statement', 'hide_screen_statement', 'call_screen_statement']);
      expect(nodes.map((n) => [n.type, n.childForFieldName('name')?.text])).toEqual([
        ['show_screen_statement', 'hud'],
        ['hide_screen_statement', 'hud'],
        ['call_screen_statement', 'inv'],
      ]);
      expect(nodes[2].childForFieldName('arguments')?.text).toBe('(1, x=2)');
    });
  });

  it('keeps dotted define/default names whole (nms4.12)', async () => {
    const source = 'default persistent.seen = False\ndefine config.name = "Demo"\ndefine e = Character("E")\n';
    await withRoot(source, (root) => {
      expect(root.hasError).toBe(false);
      expect(fieldText(root.descendantsOfType(['default_statement', 'define_statement']), 'name')).toEqual([
        'persistent.seen',
        'config.name',
        'e',
      ]);
    });
  });
});
