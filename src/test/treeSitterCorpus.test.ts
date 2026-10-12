import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseBlock, disposeParsedBlock } from '@/lib/tree-sitter/parseBlock';

/**
 * Runs the grammar's own corpus (`tree-sitter-renpy/test/corpus/*.txt`)
 * against the committed `renpy.wasm` through the same `web-tree-sitter`
 * runtime the app uses, so `npm test` catches grammar regressions without a
 * native C toolchain. Mirrors `tree-sitter test`: each case is
 * `===`-header / name / `===`-header / input / `---` / expected S-expression,
 * the line break before the divider is not part of the input, and
 * S-expressions are compared with whitespace normalized.
 */
const CORPUS_DIR = join(process.cwd(), 'tree-sitter-renpy', 'test', 'corpus');

interface CorpusCase {
  name: string;
  input: string;
  expected: string;
}

function parseCorpusFile(text: string): CorpusCase[] {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const isHeader = (line: string) => /^={3,}\S*$/.test(line);
  const isDivider = (line: string) => /^-{3,}\S*$/.test(line);
  const cases: CorpusCase[] = [];
  let i = 0;
  while (i < lines.length) {
    if (!isHeader(lines[i])) {
      i++;
      continue;
    }
    const name = lines[i + 1].trim();
    i += 3; // header, name, header
    const inputLines: string[] = [];
    while (i < lines.length && !isDivider(lines[i])) inputLines.push(lines[i++]);
    i++; // divider
    const expectedLines: string[] = [];
    while (i < lines.length && !isHeader(lines[i])) expectedLines.push(lines[i++]);
    cases.push({
      name,
      // Joining stops before the divider's own line break, which is exactly
      // the one trailing newline `tree-sitter test` drops from the input.
      input: inputLines.join('\n'),
      expected: expectedLines.join('\n'),
    });
  }
  return cases;
}

function normalizeSexp(sexp: string): string {
  return sexp.replace(/\s+/g, ' ').replace(/\s*\)/g, ')').replace(/\(\s*/g, '(').trim();
}

const corpusFiles = readdirSync(CORPUS_DIR).filter((f) => f.endsWith('.txt')).sort();

describe('tree-sitter-renpy corpus (via web-tree-sitter)', () => {
  it('finds corpus files', () => {
    expect(corpusFiles.length).toBeGreaterThan(0);
  });

  for (const file of corpusFiles) {
    describe(file, () => {
      for (const testCase of parseCorpusFile(readFileSync(join(CORPUS_DIR, file), 'utf8'))) {
        it(testCase.name, async () => {
          const block = await parseBlock(testCase.input);
          try {
            expect(normalizeSexp(block.tree.rootNode.toString())).toBe(normalizeSexp(testCase.expected));
          } finally {
            disposeParsedBlock(block);
          }
        });
      }
    });
  }
});
