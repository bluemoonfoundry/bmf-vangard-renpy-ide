import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

/**
 * Fails when the committed grammar binaries drift from their sources: an
 * edited `grammar.js`/`scanner.c` without a rebuild, a hand-replaced
 * `renpy.wasm`, or a vendored `tree-sitter-python.wasm` that no longer
 * matches its recorded upstream. See `tree-sitter-renpy/scripts/provenance.mjs`.
 */
describe('tree-sitter grammar provenance', () => {
  it('committed wasm files match tree-sitter-renpy/wasm-provenance.json', () => {
    const script = join(process.cwd(), 'tree-sitter-renpy', 'scripts', 'provenance.mjs');
    let output = '';
    try {
      output = execFileSync(process.execPath, [script, 'check'], { encoding: 'utf8', stdio: 'pipe' });
    } catch (err) {
      const e = err as { stderr?: string };
      expect.fail(e.stderr ?? String(err));
    }
    expect(output).toContain('Grammar provenance OK');
  });
});
