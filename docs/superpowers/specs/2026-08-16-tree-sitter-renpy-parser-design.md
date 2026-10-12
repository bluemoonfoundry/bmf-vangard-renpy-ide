# Tree-sitter Ren'Py Parser — Design Spec

- **Epic:** bmf-vangard-renpy-ide-nms4 (replace regex-based Ren'Py language support with a
  real tree-sitter-based parser)
- **This sub-project:** bmf-vangard-renpy-ide-qu9i — sub-project 1 of 3: author a
  tree-sitter grammar for Ren'Py, compile/bundle it as WASM, and produce an AST + symbol
  table API for a single block's content.
- **Sibling sub-projects (NOT in scope here):** bmf-vangard-renpy-ide-r7pn (replace
  `useRenpyAnalysis.ts` internals with this AST as the data source, preserving
  `RenpyAnalysisResult`'s shape), bmf-vangard-renpy-ide-jsp7 (rebuild editor
  completions/hover/semantic-tokens/diagnostics on the AST).
- **Date:** 2026-08-16
- **Status:** Approved design, pending final written self-review and user sign-off on the
  committed file.

## Locked-in decisions (from the epic-level brainstorm, not reopened here)

- Real parser via **tree-sitter**: a custom Ren'Py `grammar.js` compiled to WASM via
  `tree-sitter-cli`.
- Embedded `python:` blocks / `$` statements / screen-language Python expressions are
  parsed via tree-sitter's **language-injection** mechanism into the **official
  `tree-sitter-python`** grammar — not a hand-rolled Python parser.
- Runs in-renderer via `web-tree-sitter` (WASM), wired directly into Monaco's native
  provider APIs — explicitly not a full LSP protocol / `monaco-languageclient` bridge.
- No public `tree-sitter-renpy` grammar exists; this project authors one from scratch.
- Go-to-definition, rename, and formatting providers are deferred for the whole epic's
  first pass.

## 1. Overview & Scope

**Deliverable of this sub-project:** a standalone `tree-sitter-renpy/` grammar package
(publishable-quality) plus a thin `parseBlock(content: string) => Promise<ParsedBlock>`
TypeScript API in the main app that downstream sub-projects 2 and 3 will import. This
sub-project does **not** touch `useRenpyAnalysis.ts`, `EditorView.tsx`, or any Monaco
provider.

**Language surface (v1, full coverage):** label/jump/call/return/menu/if/while/for/python/
init/define/default statements, `screen` with full nested screen-language body (arbitrary
`if`/`for`/`use`/`frame`/`vbox`/`text`/`button`/... nesting), ATL (`transform`/`with`/
animation blocks) as structured sub-nodes, `translate` blocks, `style`/`style_property`
blocks, and the rarer statements (`camera`, `layeredimage`, `nvl`). Python is not
reimplemented — `python:`/`init python`/one-line `$`/screen-action-expression contexts are
parsed via language-injection into the official `tree-sitter-python` grammar.

**Node granularity:** every statement type gets its own real, named AST node with
structured fields (say-statement → character/attributes/text; menu-choice → condition;
ATL block → individual transform statements; screen widgets → typed nodes with property
lists). Expression *internals* (call arguments, Python-ish conditionals) stay as opaque
`expression` nodes whose source text is handed to the injected Python grammar or left as a
string — the Ren'Py grammar does not itself decompose Python expression syntax.

**Error recovery:** default tree-sitter `ERROR`/`MISSING` recovery everywhere, plus
explicit permissive grammar rules for hot-path half-typed states a user sits in while
typing: unterminated `label`/`menu`/`screen`/`if` headers before their body exists,
unterminated string literals, and incomplete say-statements.

**Parsing model:** stateless, full-reparse-per-call. No incremental `tree.edit()` API
surface in this sub-project — that's a caller-side optimization future sub-projects can
layer on.

## 2. Repo & Package Layout

```
bmf-vangard-renpy-ide/                  (existing app repo root)
├── tree-sitter-renpy/                  (NEW — standalone grammar package)
│   ├── package.json                    # name: "tree-sitter-renpy", own devDeps: tree-sitter-cli
│   ├── grammar.js                      # the grammar definition
│   ├── src/                            # tree-sitter-cli generated output (parser.c, grammar.json, node-types.json) — committed
│   ├── queries/
│   │   ├── highlights.scm              # optional, not required by this sub-project (TextMate grammar still owns syntax highlighting)
│   │   └── injections.scm              # REQUIRED — declares the Python-injection points (Section 4)
│   ├── bindings/                       # tree-sitter-cli scaffold, ecosystem-standard shape / future publishing
│   ├── test/
│   │   └── corpus/                     # grammar-shape tests (Section 7) — *.txt files, run via `tree-sitter test`
│   ├── tree-sitter.json                # declares injections.scm, external scanner
│   └── renpy.wasm                      # BUILD OUTPUT, committed — compiled via `tree-sitter build --wasm`
│
├── src/
│   └── lib/
│       └── tree-sitter/                (NEW — thin app-side consumer layer)
│           ├── parseBlock.ts           # the parseBlock() API (Section 6)
│           ├── symbolTable.ts          # symbol-table extraction from the AST (Section 6)
│           └── vendor/
│               └── tree-sitter-python.wasm   # official grammar's prebuilt wasm, vendored
│
├── src/test/
│   └── treeSitterRenpy.test.ts         (NEW — Vitest tests, Section 7)
│
├── package.json                        # app root — adds `web-tree-sitter` runtime dep only
```

Key points:
- `tree-sitter-renpy/` is dependency-independent of the app's own `package.json` (this
  repo has no npm workspaces). The app consumes only its **build output** (`renpy.wasm`),
  not the package as a JS import — no `file:`/relative npm dependency edge.
- A new root-level convenience script `build:grammar` runs
  `cd tree-sitter-renpy && npm install && npm run build`, manual-only, NOT wired into
  `predist`/`build`/`dev`/CI. The compiled `renpy.wasm` is committed to git.
- `src/lib/tree-sitter/parseBlock.ts` references `tree-sitter-renpy/renpy.wasm` via a Vite
  asset import so it lands in `dist/` as a static asset at build time (Section 5).
- `tree-sitter-python.wasm` is vendored (checked in) under
  `src/lib/tree-sitter/vendor/`, sourced from the official `tree-sitter-python` npm
  package's prebuilt wasm release.

## 3. Grammar Design

**Top-level structure.** The grammar's root node (`source_file`) is a sequence of
top-level statements. Ren'Py, like Python, is indentation-significant — the grammar needs
an external scanner (same technique `tree-sitter-python`/`tree-sitter-yaml` use) to emit
`INDENT`/`DEDENT`/`NEWLINE` tokens from raw whitespace before the grammar rules see them.
This is the single trickiest piece of the grammar and the primary implementation-risk
area (see Risks).

**Statement node types (illustrative, not exhaustive):**
- `label_statement` — name, optional parameters, optional `hide`/`global` qualifiers, body
- `jump_statement` / `call_statement` — target (static name or `expression` for dynamic
  `jump expression ...`), optional `from` label (call)
- `menu_statement` — optional label name, sequence of `menu_choice` nodes, each with
  `text` (string node), optional `condition` (opaque expression), body
- `say_statement` — optional `character` (identifier or `expression`), optional
  `attributes` list, `text` (string node, decomposed for interpolation `[...]`/`{tag}`
  markup spans)
- `screen_statement` — name, optional parameters, body of `screen_language_statement`
  nodes
- `screen_language_statement` — one shared node shape covering `if`/`for`/`use`/`frame`/
  `vbox`/`hbox`/`button`/`text`/`imagemap`/... (`widget_tag` + `properties` list of
  `property` nodes each with name + opaque expression value) rather than a bespoke node
  type per widget, since Ren'Py screen-language widgets are structurally uniform
- `atl_block` — sequence of `atl_statement` nodes (`atl_transform_property` for
  `xalign 0.5`-style property sets, `atl_with_statement`, `atl_block_statement` for
  `parallel`/`contains`/`choice`/`block`/`repeat`, `atl_time_statement` for `pause`/
  `time`), each with opaque expression values for numeric/interpolation arguments
- `translate_statement` — language, optional identifier/label scope, body (reuses
  say/menu/string node shapes)
- `style_statement` / `style_property_statement` — name, optional `is`/`take` parent
  reference, body of property assignments
- `python_statement` / `init_python_statement` — priority (for `init`), injection point
  wrapping raw text handed to `tree-sitter-python` (Section 4)
- `dollar_statement` — one-line `$ ...` form, same injection treatment
- `image_statement`, `scene_statement`, `show_statement`, `hide_statement`,
  `with_statement`, `define_statement`, `default_statement` — name/tag + opaque
  expression value where applicable
- `camera_statement`, `layeredimage_statement`, `nvl_statement` — modeled structurally
  consistent with their closest analog (e.g. `layeredimage` reuses the property-list shape
  from `style_statement`)

**Error-recovery hardening, concretely:** for each of `label_statement`, `menu_statement`,
`screen_statement`, `if_statement`/`while_statement`/`for_statement` headers, the grammar
defines the header (through the trailing `:`) as parseable **without** requiring a
following indented body to exist yet (body is `optional($.block)`, not `$.block`) — so
`label foo:` with nothing after it is a complete, valid (empty-bodied) node, not an
`ERROR`. String literals get a permissive "unterminated at EOF/newline" alternative token
so a string being actively typed still lexes as a (flagged) string node rather than
corrupting the rest of the line's tokenization. Say-statements are structured so a partial
one (character tag typed, `"` opened, no closing quote or colon yet) still resolves to a
`say_statement` with an incomplete/unterminated `text` field rather than falling through
to `ERROR`. Everything else relies on tree-sitter's default GLR error recovery with no
special-casing.

**Comments and triple-quoted strings.** `#` comments are a standard token-level rule.
Triple-quoted strings (`"""`/`'''`, currently hand-rolled in `renpyTripleQuotes.ts` for the
regex analyzer) become a proper multi-line string token in the grammar's lexer — the
grammar subsumes that module's responsibility for AST consumers (the standalone
`renpyTripleQuotes.ts` helper remains as-is for now since sub-projects 2/3 haven't
migrated yet).

## 4. Python-Injection Mechanics

Tree-sitter's language-injection system works via an `injections.scm` query file (the
standard mechanism used by every embedded-language grammar, e.g. how `tree-sitter-html`
injects `tree-sitter-javascript` into `<script>` tags). It doesn't change `grammar.js`
itself; it's a separate query that tags specific node captures as "reparse this span with
a different grammar," consumed by whichever host runs the injection. `web-tree-sitter`
doesn't drive injections automatically — that orchestration is part of this sub-project's
`parseBlock()` layer.

**Injection points** (`tree-sitter-renpy/queries/injections.scm`):
1. `python_statement` / `init_python_statement` body — the full indented block after
   `python:`/`init python:` is injected as `tree-sitter-python`.
2. `dollar_statement` — the expression after `$` is injected as a single-line Python
   expression/statement.
3. Screen-action expressions — arguments to screen properties/actions that are Python call
   expressions (e.g. `action SetVariable(...)`, `if` conditions in screen-language, ATL
   property values that are Python expressions) are captured via the grammar's generic
   `expression` node and injected as `tree-sitter-python`'s `expression` grammar rule
   specifically (not full `module`, since these are expression fragments).

**Mechanics in `parseBlock()`:** after the primary Ren'Py parse produces a tree,
`parseBlock()` runs the injection query against it to find all `expression`/
`python_statement`/`dollar_statement` spans, and for each one invokes a second
`web-tree-sitter` `Parser` instance configured with `tree-sitter-python.wasm` to parse
just that span's text, producing a set of secondary Python subtrees keyed by their byte
range in the original source.

**Symbol table implication:** the injected Python subtrees are **not** walked for symbols
by this sub-project — extracting e.g. "what Python variables does this `SetVariable(...)`
call reference" is a sub-project 3 concern (hover/completion). This sub-project's symbol
table only knows *that* a given AST span is a Python injection and exposes the secondary
tree + byte range: `pythonInjections: PythonInjection[]` (Section 6). $-statement Python
variable extraction is explicitly NOT done in this sub-project.

**Version coupling risk:** the injected grammar is the *official* `tree-sitter-python`,
whose node shapes evolve independently. `parseBlock()`'s Python-injection handling only
depends on generic `Tree`/`Node` APIs (get subtree, get range) — it does not pattern-match
specific `tree-sitter-python` node-type names — so it's resilient to that grammar's
internal node types changing between versions; only consumers that *do* pattern-match
Python node shapes (sub-project 3, eventually) take on that coupling.

## 5. Build & Bundling Pipeline

**Grammar compilation (manual):**
- `tree-sitter-renpy/package.json` script: `"build": "tree-sitter generate && tree-sitter
  build --wasm"`. Requires `tree-sitter-cli` as a devDependency of `tree-sitter-renpy/`
  only. `tree-sitter-cli` ships/downloads a prebuilt wasm toolchain by default so
  contributors editing the grammar don't need a manual emscripten install in the common
  case.
- Root `package.json` convenience script: `"build:grammar": "cd tree-sitter-renpy && npm
  install && npm run build"` — NOT wired into `predist`/`build`/`dev`, so normal
  `npm run build`/`npm run electron:start`/CI never invoke it. `tree-sitter-renpy/renpy.wasm`
  is committed to git as a build artifact.
- `test/corpus/` regression check (`tree-sitter test`, run from inside
  `tree-sitter-renpy/`) is a **manual** step for grammar contributors, NOT wired into the
  app's `npm test` or CI (see Risks — accepted gap).

**Runtime loading (in-renderer):**
- `renpy.wasm` and the vendored `tree-sitter-python.wasm` are both imported in
  `parseBlock.ts` using Vite's `?url` asset-import convention (e.g. `import renpyWasmUrl
  from '../../../tree-sitter-renpy/renpy.wasm?url'`), which makes Vite copy them into
  `dist/assets/` with a hashed filename and resolve the import to that final URL — the
  same pattern `monaco-editor`/`@monaco-editor/react` use for their own worker/wasm URLs.
- `parseBlock.ts` lazily initializes two module-level singleton `Parser` instances
  (mirroring the `_analysisWorker` singleton pattern in `useRenpyAnalysis.ts`) on first
  call: `web-tree-sitter`'s `Parser.init()`, then `Language.load(renpyWasmUrl)` and
  `Language.load(pythonWasmUrl)`. Subsequent `parseBlock()` calls reuse the initialized
  parsers.
- No `electron-builder` `extraResources` entry needed — both wasm files flow through
  Vite's normal asset pipeline into `dist/`, and `dist/**/*` is already in `package.json`'s
  `build.files` allowlist.

**Dev server:** works identically — Vite serves `?url` assets from disk in dev mode like
any other static asset.

**Where `web-tree-sitter` comes from:** added as a normal runtime `dependency` in the app
root `package.json` (the WASM runtime, distinct from `tree-sitter-cli`, the compiler,
needed only inside `tree-sitter-renpy/`).

## 6. `parseBlock()` API & Symbol Table

```typescript
export interface ParsedBlock {
  tree: Tree;                    // raw web-tree-sitter Tree — root node is `source_file`
  symbolTable: RenpySymbolTable;
  pythonInjections: PythonInjection[];
  parseTimeMs: number;
}

export interface PythonInjection {
  range: [number, number];       // byte offsets into the block's content string
  tree: Tree;                    // secondary tree-sitter-python Tree for this span
  kind: 'python-block' | 'dollar-statement' | 'screen-expression';
}

export async function parseBlock(content: string): Promise<ParsedBlock>;
```

`async` because `web-tree-sitter`'s `Parser.init()`/`Language.load()` are promise-based
(WASM instantiation) — first call pays that cost, subsequent calls are effectively
synchronous work wrapped in an already-resolved path. This is a deliberate difference from
`performRenpyAnalysis()`'s current synchronous signature; callers in sub-project 2 will
need to account for the async boundary (a migration consideration for that sub-project,
not solved here). No separate `initTreeSitter()` split — `parseBlock()` stays a single
async entry point.

**Symbol table shape** — flat per-kind arrays with an explicit `scopeId` (hybrid of "flat
arrays matching current `RenpyAnalysisResult` shape" and "full scope tree"):

```typescript
export interface RenpySymbolTable {
  labels: LabelSymbol[];
  characters: CharacterSymbol[];
  screens: ScreenSymbol[];
  variables: VariableSymbol[];     // define/default/$ implicit assignments
  images: ImageSymbol[];
  menus: MenuSymbol[];             // menu blocks + their choices
  transforms: TransformSymbol[];   // ATL `transform` statements
  styles: StyleSymbol[];
}

/** Shared shape every symbol kind extends. */
interface BaseSymbol {
  name: string;
  node: SyntaxNode;                // AST node ref — gives callers the exact range for free
  line: number;                    // 1-based, for the existing `file+line` hover convention
  column: number;
  /** Enclosing label's node id, or null if declared at block top-level (outside any label). */
  scopeId: string | null;
}

export interface LabelSymbol extends BaseSymbol {
  kind: 'label';
  parameters: string[];            // raw parameter text, opaque
}

export interface VariableSymbol extends BaseSymbol {
  kind: 'variable';
  declarationType: 'define' | 'default' | 'implicit';  // implicit = one-line `$` assignment
  initialValueExpr: string;        // opaque expression text
}
// CharacterSymbol, ScreenSymbol, ImageSymbol, MenuSymbol, TransformSymbol, StyleSymbol
// follow the same BaseSymbol + kind-specific-fields pattern, each carrying enough
// structured data to match or exceed what the current Character/RenpyScreen/Variable
// types in src/types.ts already hold.
```

**Explicitly out of scope for this symbol table:**
- Cross-block resolution (e.g. does `jump target` resolve to a label in a *different*
  block) — single-block scope only, per the epic's stated boundary; sub-project 2 does
  whole-project merging.
- Usage-location aggregation (`usageLocations.ts`'s job) — this sub-project exposes
  *declaration* sites only.
- Hover's "usage count" requirement (epic background) is satisfied by this symbol table's
  `node`/`line` fields being sufficient input to an `usageLocations.ts`-style aggregator
  later — this sub-project doesn't compute the count itself.

## 7. Testing Strategy

**Grammar-shape tests** (`tree-sitter-renpy/test/corpus/*.txt`): one corpus file per
statement family — `labels.txt`, `menus.txt`, `say-statements.txt`, `screens.txt`,
`atl.txt`, `translate.txt`, `styles.txt`, `error-recovery.txt` (covering the Section 3
hot-path partial-parse cases: unterminated `label foo:`, unterminated string, incomplete
say-statement — asserting these produce the intended non-`ERROR` structured-but-incomplete
nodes). Run via `tree-sitter test` from within `tree-sitter-renpy/`, manual/local-only
(Section 5).

**`parseBlock()`/symbol-table tests** (`src/test/treeSitterRenpy.test.ts`, Vitest):
black-box tests against `parseBlock()`'s public output — given representative `.rpy`
snippets (reusing/adapting fixtures from `src/test/mocks/sampleData.ts` where they overlap
with `renpyAnalysis.test.ts`'s existing cases, so the two analyzers can eventually be
compared on the same inputs by sub-project 2), assert the resulting `RenpySymbolTable`
contains expected labels/characters/screens/variables with correct `line`/`scopeId`/`kind`
fields, and that `pythonInjections` correctly identifies `python:`/`$`/screen-action
spans. Runs as part of normal `npm test` — no toolchain dependency beyond what's already
required (uses the committed `renpy.wasm`, not `tree-sitter-cli`).

**No comparison/parity test against `useRenpyAnalysis.ts` in this sub-project** —
verifying the new AST-based path produces equivalent results to the current regex path for
real project files is sub-project 2's job, not this one's; this sub-project's contract is
the AST/symbol-table shape itself, not behavioral equivalence with the thing it will
eventually replace.

## 8. Risks & Explicit Out-of-Scope

**Risks:**
1. **Indentation-sensitive external scanner is the highest-risk piece.** Ren'Py's
   Python-like significant whitespace requires a hand-written external C scanner (same
   technique as `tree-sitter-python`) — this is the part of grammar authoring most likely
   to blow past estimate, especially combined with the hot-path recovery hardening, which
   interacts with scanner state.
2. **Full-surface-coverage scope** (ATL, full screen-language nesting, translate/style
   blocks, rare statements, all in v1) materially increases grammar size/timeline versus a
   deferred-coverage alternative that was on the table — accepted, not a hidden cost.
3. **Grammar corpus tests are not wired into CI.** A `grammar.js` regression could land
   without `tree-sitter test` having been run, only caught later when sub-project 2/3
   consumers break. Accepted trade-off; a follow-up "run `tree-sitter test` only on
   `tree-sitter-renpy/**` changes" CI job is a reasonable future addition, out of scope for
   this design.
4. **`web-tree-sitter` + official `tree-sitter-python.wasm` version coupling** — vendoring
   a prebuilt `.wasm` means picking up Python-grammar fixes/changes requires a manual
   re-vendor step; no automatic update path is designed here.
5. **First-call async WASM init latency** — `parseBlock()`'s first invocation pays
   `Parser.init()` + two `Language.load()` costs; not measured/budgeted in this design (no
   specific latency target set), flagged for sub-project 3 to validate against real
   editor-responsiveness needs when it integrates.

**Explicitly out of scope for this sub-project (deferred to sub-project 2, 3, or later):**
- Replacing any part of `useRenpyAnalysis.ts`, the analysis worker, or
  `RenpyAnalysisResult`'s shape.
- Any Monaco provider wiring (completions/hover/semantic-tokens/diagnostics) or changes to
  `EditorView.tsx`.
- Cross-block symbol resolution, usage-location aggregation, incremental `tree.edit()`-
  based re-parsing.
- Symbol extraction inside injected Python subtrees.
- Go-to-definition, rename, formatting providers (epic-wide deferral, restated here).
- CI wiring for grammar corpus tests.
