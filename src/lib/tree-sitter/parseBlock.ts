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
import Parser, { type Query, type Tree, type SyntaxNode } from 'web-tree-sitter';
import treeSitterRuntimeWasmUrl from 'web-tree-sitter/tree-sitter.wasm?url';
import renpyWasmUrl from '../../../tree-sitter-renpy/renpy.wasm?url';
import pythonWasmUrl from './vendor/tree-sitter-python.wasm?url';
import injectionsQuerySource from '../../../tree-sitter-renpy/queries/injections.scm?raw';
import { extractSymbolTable, type RenpySymbolTable } from '@/lib/tree-sitter/symbolTable';

export interface PythonInjection {
  /** `[startIndex, endIndex]` of the injected span within the original Ren'Py source. */
  range: [number, number];
  /**
   * Parsed Python tree for this span.
   *
   * OWNERSHIP: WASM-heap allocated. The caller of {@link parseBlock} owns
   * it and must free it — call {@link disposeParsedBlock} on the owning
   * `ParsedBlock` rather than deleting injection trees individually.
   */
  tree: Tree;
  kind: 'python-block' | 'dollar-statement' | 'screen-expression';
}

export interface ParsedBlock {
  /**
   * The Ren'Py parse tree.
   *
   * OWNERSHIP: WASM-heap allocated (see {@link disposeParsedBlock}).
   */
  tree: Tree;
  pythonInjections: PythonInjection[];
  /**
   * Symbol table extracted from `tree` (spec Section 6).
   *
   * NOTE: every symbol carries a `node: SyntaxNode` pointing into `tree`,
   * so the table is only valid for as long as `tree` is — reading it after
   * {@link disposeParsedBlock} is a use-after-free.
   */
  symbolTable: RenpySymbolTable;
  parseTimeMs: number;
}

/**
 * Frees every WASM-heap allocation owned by a {@link ParsedBlock}: the
 * Ren'Py tree and each injection's Python tree.
 *
 * `web-tree-sitter`'s `Tree` objects live in the WASM heap and are NOT
 * garbage-collected by the JS engine — `parseBlock()` allocates one Ren'Py
 * tree plus one Python tree per injection on every call, so a caller that
 * parses repeatedly (e.g. on every keystroke-debounced re-analysis) without
 * disposing will grow the WASM heap without bound.
 *
 * Call this once you are done reading the trees (and `symbolTable`, whose
 * `node` references point into `tree`). It is safe to call at most once per
 * `ParsedBlock`; `Tree.delete()` is not idempotent, so do not call twice.
 */
export function disposeParsedBlock(block: ParsedBlock): void {
  for (const injection of block.pythonInjections) {
    injection.tree.delete();
  }
  block.tree.delete();
}

/**
 * Module-level parser/language singletons — initialized once, reused across
 * calls.
 *
 * These are deliberately never `.delete()`d, unlike the per-call `Tree`s that
 * {@link disposeParsedBlock} frees: `Parser`, `Language` and `Query` are all
 * WASM-heap allocated, but exactly one of each is ever created and it stays
 * live for the whole process. Disposing them would only force a re-init on the
 * next `parseBlock()` call.
 */
let renpyParser: Parser | null = null;
let pythonParser: Parser | null = null;
let injectionsQuery: Query | null = null;
let initPromise: Promise<void> | null = null;

/** True under Node (Vitest runs jsdom inside a real Node process). */
function isNode(): boolean {
  return typeof process !== 'undefined' && !!process.versions?.node;
}

/**
 * Fetches a wasm asset in a browser context (renderer or Web Worker).
 *
 * The packaged app loads `dist/index.html` via `loadFile`, so with vite's
 * `base: './'` every asset URL is `file://`. Chromium's `fetch()` rejects the
 * `file:` scheme, so those are read with an arraybuffer XHR, which Electron
 * allows from a `file://` page or worker. Other schemes (the Vite dev server)
 * use `fetch()`. Relative URLs resolve against the current script's location
 * (the worker script, inside a worker).
 */
export async function fetchWasmBytes(url: string, base: string = globalThis.location?.href ?? ''): Promise<Uint8Array> {
  const absolute = base ? new URL(url, base).href : url;
  if (absolute.startsWith('file:')) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', absolute);
      xhr.responseType = 'arraybuffer';
      xhr.onload = () => {
        // file: XHRs report status 0 on success.
        if ((xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) && xhr.response && (xhr.response as ArrayBuffer).byteLength > 0) {
          resolve(new Uint8Array(xhr.response as ArrayBuffer));
        } else {
          reject(new Error(`Failed to load wasm asset ${absolute}: status ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error(`Failed to load wasm asset ${absolute}`));
      xhr.send();
    });
  }
  const response = await fetch(absolute);
  if (!response.ok) {
    throw new Error(`Failed to fetch wasm asset ${absolute}: ${response.status}`);
  }
  return new Uint8Array(await response.arrayBuffer());
}

/**
 * Loads the bytes for a `?url`-imported wasm asset.
 *
 * Under Node/Vitest, Vite's `?url` import is a root-relative path (e.g.
 * `/tree-sitter-renpy/renpy.wasm`) that only resolves against a dev/build
 * server root, so it is resolved against `process.cwd()` (the repo root, how
 * both `npm test` and CI invoke Vitest) and read from disk. `node:fs` /
 * `node:path` are imported dynamically so this module stays safe to bundle
 * for the browser, where that branch is never reached.
 */
async function loadWasmBytes(url: string): Promise<Uint8Array> {
  if (isNode()) {
    const [{ readFileSync }, { resolve: resolvePath }] = await Promise.all([
      import('node:fs'),
      import('node:path'),
    ]);
    const relative = url.replace(/^\//, '');
    return new Uint8Array(readFileSync(resolvePath(process.cwd(), relative)));
  }
  return fetchWasmBytes(url);
}

/**
 * Initializes the web-tree-sitter runtime. In a browser context the runtime's
 * own `tree-sitter.wasm` must be located explicitly: emscripten would
 * otherwise look for it next to the (worker) script, where the build emits no
 * such file, and would `fetch()` it, which fails for `file://`. So it is
 * located via the bundled `?url` asset and its bytes are handed over directly.
 * Under Node the runtime finds its wasm in node_modules by itself.
 */
async function initRuntime(): Promise<void> {
  if (isNode()) {
    await Parser.init();
    return;
  }
  const wasmBinary = await fetchWasmBytes(treeSitterRuntimeWasmUrl);
  await Parser.init({ locateFile: () => treeSitterRuntimeWasmUrl, wasmBinary });
}

async function ensureInitialized(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    await initRuntime();
    const [renpyBytes, pythonBytes] = await Promise.all([
      loadWasmBytes(renpyWasmUrl),
      loadWasmBytes(pythonWasmUrl),
    ]);
    // `Parser.Language`, not a named `Language` import: web-tree-sitter is
    // CommonJS and assigns `Parser.Language` only once `Parser.init()` runs,
    // so in the bundled app a named import is captured as undefined.
    const [renpyLang, pythonLang] = await Promise.all([
      Parser.Language.load(renpyBytes),
      Parser.Language.load(pythonBytes),
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
 * Loads the Ren'Py/Python grammars if they aren't loaded yet. `parseBlock`
 * does this itself; callers that must tell an initialization failure apart
 * from a per-block parse failure (the symbol index) await this first.
 */
export function initParser(): Promise<void> {
  return ensureInitialized();
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
  try {
    collectInjections(content, tree, pythonInjections);
    const symbolTable = extractSymbolTable(tree);
    const parseTimeMs = performance.now() - start;
    return { tree, pythonInjections, symbolTable, parseTimeMs };
  } catch (error) {
    // No ParsedBlock reaches the caller, so free what was allocated here.
    disposeParsedBlock({ tree, pythonInjections } as ParsedBlock);
    throw error;
  }
}

/** Parses each injection-query match as Python, appending to `out` as each tree is created. */
function collectInjections(content: string, tree: Tree, out: PythonInjection[]): void {
  const matches = injectionsQuery!.matches(tree.rootNode);

  for (const match of matches) {
    // A comment on the header line itself (`init python: # setup`, nms4.9)
    // is a child of the python statement but not part of its body; left in,
    // it would become `firstNode` and its column would drive `dedent`.
    const captures = match.captures.filter(
      (c) =>
        c.name === 'injection.content' &&
        !(c.node.type === 'comment' && c.node.startPosition.row === c.node.parent?.startPosition.row),
    );
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

    let kind: PythonInjection['kind'];
    try {
      kind = injectionKindForNode(firstNode);
    } catch (error) {
      pythonTree.delete(); // not yet in `out`, so the caller's cleanup can't see it
      throw error;
    }
    out.push({ range: [firstNode.startIndex, lastNode.endIndex], tree: pythonTree, kind });
  }
}
