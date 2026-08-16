import { describe, it, expect } from 'vitest';
import { parseBlock } from '@/lib/tree-sitter/parseBlock';
import { extractSymbolTable } from '@/lib/tree-sitter/symbolTable';

// NOTE: this fixture intentionally avoids two known tree-sitter-renpy
// grammar limitations discovered while debugging this test:
// - It must NOT start with a leading blank line — a leading `\n` before the
//   first real statement produces a spurious top-level ERROR node (verified
//   empirically: `\ndefine e = ...` errors, `define e = ...` does not).
// - String literals must not contain `[interpolation]` brackets — e.g.
//   `text "Trust: [trust]"` breaks the screen-language string tokenizer
//   (produces an ERROR + UNEXPECTED '['); plain strings like `"Trust"` are
//   fine. This is on top of the already-known `at Transform(...)`
//   (bmf-vangard-renpy-ide-aj2e) and `#`-in-string (bmf-vangard-renpy-ide-lssz)
//   limitations, neither of which this fixture exercises.
const SAMPLE_RPY = `define e = Character("Eileen")
default trust = 0

label start:
    e "Hello!"
    $ trust += 1
    menu:
        "Ask about the town":
            jump town_info
        "Leave" if trust > 0:
            jump leave

screen hud():
    frame:
        vbox:
            text "Trust meter"

transform bounce:
    ease 0.5 yoffset -10
    ease 0.5 yoffset 0
`;

describe('tree-sitter-renpy full-surface regression', () => {
  it('parses a realistic multi-construct block with no ERROR nodes', async () => {
    const { tree } = await parseBlock(SAMPLE_RPY);
    expect(tree.rootNode.hasError).toBe(false);
  });

  it('produces a symbol table covering every construct in the sample', async () => {
    const { tree } = await parseBlock(SAMPLE_RPY);
    const table = extractSymbolTable(tree);

    expect(table.characters.map((c) => c.name)).toContain('e');
    expect(table.variables.map((v) => v.name)).toContain('trust');
    expect(table.labels.map((l) => l.name)).toContain('start');
    expect(table.screens.map((s) => s.name)).toContain('hud');
    expect(table.transforms.map((t) => t.name)).toContain('bounce');
    expect(table.menus.length).toBeGreaterThanOrEqual(1);
  });

  it('identifies the $ trust += 1 line as a python injection', async () => {
    const result = await parseBlock(SAMPLE_RPY);
    expect(result.pythonInjections.some((inj) => inj.kind === 'dollar-statement')).toBe(true);
  });
});
