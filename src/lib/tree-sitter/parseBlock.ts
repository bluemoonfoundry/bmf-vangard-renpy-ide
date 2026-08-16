/**
 * @file parseBlock.ts
 * @description Parses a Ren'Py source fragment with `tree-sitter-renpy` and
 * locates embedded Python spans (`$ expr` statements, `python:`/
 * `init python:` block bodies, and screen-language expressions) using the
 * injection query authored in `tree-sitter-renpy/queries/injections.scm`.
 *
 * `web-tree-sitter` does not execute injection queries or `#set!`
 * directives itself (see the header comment in `injections.scm`) — this
 * module is the manual consumer the query file was written for. It runs
 * the query against the parsed tree, groups captures by match (a single
 * pattern instance — e.g. the `[...]+ @injection.content` alternation used
 * for `python_statement`/`init_python_statement` bodies — produces exactly
 * one match containing one capture per top-level statement), and derives
 * one `PythonInjection` per match:
 *
 * - For `python:`/`init python:` bodies there is no single contiguous node
 *   covering "the whole body" (the grammar's shared `_block` rule is
 *   hidden), so the query captures each top-level statement individually
 *   within one match. This module reconstructs one contiguous span by
 *   taking the min-start/max-end across that match's captures, then
 *   dedents the extracted text relative to the first statement's column so
 *   it parses as a standalone Python module (top-level Python statements
 *   must start at column 0; the original text is indented because it's
 *   nested inside a Ren'Py `python:` block).
 * - For every other injection point (`$ expr`, screen-language
 *   `property` expressions, `if`/`elif`/`while`/menu-choice conditions,
 *   ATL property/warper/duration expressions) each match has exactly one
 *   capture, so the same grouping logic naturally yields a single-node
 *   span with no dedent needed (column offset is a no-op for a one-line
 *   fragment sliced starting at its own first non-whitespace character).
 */
import Parser, { Language, Query, Tree, type SyntaxNode } from 'web-tree-sitter';
import renpyWasmUrl from '../../../tree-sitter-renpy/renpy.wasm?url';
import pythonWasmUrl from './vendor/tree-sitter-python.wasm?url';
import injectionsQuerySource from '../../../tree-sitter-renpy/queries/injections.scm?raw';

export interface PythonInjection {
  range: [number, number];
  tree: Tree;
  kind: 'python-block' | 'dollar-statement' | 'screen-expression';
}

export interface ParsedBlock {
  tree: Tree;
  pythonInjections: PythonInjection[];
  parseTimeMs: number;
}

/** Module-level parser/language singletons — initialized once, reused across calls. */
let renpyParser: Parser | null = null;
let pythonParser: Parser | null = null;
let injectionsQuery: Query | null = null;
let initPromise: Promise<void> | null = null;

/**
 * Loads the bytes for a `?url`-imported wasm asset.
 *
 * `web-tree-sitter`'s own `Language.load(string)` picks its loading
 * strategy by checking for a Node `process` global: under Node (this
 * repo's Vitest suite runs `jsdom` inside a real Node process, so the
 * check is true there) it calls `fs.readFileSync(url)` treating the
 * string as a literal filesystem path; otherwise it `fetch()`s it. Vite's
 * `?url` import produces a root-relative path (e.g.
 * `/tree-sitter-renpy/renpy.wasm`) that only resolves correctly against a
 * dev/build server root — under plain Node, a leading `/` resolves
 * against the current drive/filesystem root instead of the project root,
 * so `Language.load(renpyWasmUrl)` fails outside a real Vite server.
 *
 * The packaged app's renderer runs with `nodeIntegration: false` /
 * `contextIsolation: true` (see `electron.js`), so `process` is undefined
 * there and `Language.load` already takes the `fetch()` branch correctly
 * on its own — this helper only needs to special-case the Node/Vitest
 * path, resolving the root-relative URL against `process.cwd()` (the
 * repo root, which is how both `npm test` and CI invoke Vitest) and
 * reading the file directly. `node:fs`/`node:path` are imported
 * dynamically so this module stays safe to bundle for the browser target,
 * where the branch that needs them is never reached.
 */
async function loadWasmBytes(url: string): Promise<Uint8Array> {
  if (typeof process !== 'undefined' && process.versions?.node) {
    const [{ readFileSync }, { resolve: resolvePath }] = await Promise.all([
      import('node:fs'),
      import('node:path'),
    ]);
    const relative = url.replace(/^\//, '');
    return new Uint8Array(readFileSync(resolvePath(process.cwd(), relative)));
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch wasm asset ${url}: ${response.status}`);
  }
  return new Uint8Array(await response.arrayBuffer());
}

async function ensureInitialized(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    await Parser.init();
    const [renpyBytes, pythonBytes] = await Promise.all([
      loadWasmBytes(renpyWasmUrl),
      loadWasmBytes(pythonWasmUrl),
    ]);
    const [renpyLang, pythonLang] = await Promise.all([
      Language.load(renpyBytes),
      Language.load(pythonBytes),
    ]);
    renpyParser = new Parser();
    renpyParser.setLanguage(renpyLang);
    pythonParser = new Parser();
    pythonParser.setLanguage(pythonLang);
    injectionsQuery = renpyLang.query(injectionsQuerySource);
  })();
  return initPromise;
}

/**
 * Determines the `PythonInjection.kind` for a captured node by walking up
 * its ancestor chain. `dollar_statement` and `python_statement` /
 * `init_python_statement` are unambiguous; every other injection point in
 * the query (screen-language `property` expressions, control-flow
 * conditions, ATL property/warper/duration expressions) falls back to
 * 'screen-expression'.
 */
function injectionKindForNode(node: SyntaxNode): PythonInjection['kind'] {
  let current: SyntaxNode | null = node;
  while (current) {
    if (current.type === 'dollar_statement') return 'dollar-statement';
    if (current.type === 'python_statement' || current.type === 'init_python_statement') {
      return 'python-block';
    }
    current = current.parent;
  }
  return 'screen-expression';
}

/**
 * Dedents `text` by removing up to `columns` leading whitespace characters
 * from every line after the first (the first line is already sliced
 * starting at its first non-whitespace character, so it has no leading
 * indentation to strip). Lines with less leading whitespace than `columns`
 * (e.g. blank lines) have only the whitespace they actually have removed.
 * This mirrors `textwrap.dedent` for the fixed, known indent width of the
 * captured span's first statement, so a `python:` block body extracted
 * from the middle of a Ren'Py file parses as a valid standalone module.
 */
function dedent(text: string, columns: number): string {
  if (columns <= 0) return text;
  const lines = text.split('\n');
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    let stripCount = 0;
    while (stripCount < columns && stripCount < line.length && line[stripCount] === ' ') {
      stripCount++;
    }
    lines[i] = line.slice(stripCount);
  }
  return lines.join('\n');
}

export async function parseBlock(content: string): Promise<ParsedBlock> {
  await ensureInitialized();
  const start = performance.now();

  const tree = renpyParser!.parse(content);
  if (!tree) {
    throw new Error('tree-sitter-renpy failed to produce a parse tree');
  }

  const pythonInjections: PythonInjection[] = [];
  const matches = injectionsQuery!.matches(tree.rootNode);

  for (const match of matches) {
    const captures = match.captures.filter((c) => c.name === 'injection.content');
    if (captures.length === 0) continue;

    let firstNode = captures[0].node;
    let lastNode = captures[0].node;
    for (const capture of captures) {
      if (capture.node.startIndex < firstNode.startIndex) firstNode = capture.node;
      if (capture.node.endIndex > lastNode.endIndex) lastNode = capture.node;
    }

    const rawSpan = content.slice(firstNode.startIndex, lastNode.endIndex);
    const spanText = dedent(rawSpan, firstNode.startPosition.column);

    const pythonTree = pythonParser!.parse(spanText);
    if (!pythonTree) continue;

    pythonInjections.push({
      range: [firstNode.startIndex, lastNode.endIndex],
      tree: pythonTree,
      kind: injectionKindForNode(firstNode),
    });
  }

  const parseTimeMs = performance.now() - start;
  return { tree, pythonInjections, parseTimeMs };
}
