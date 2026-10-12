# Tree-sitter Ren'Py Parser Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone `tree-sitter-renpy` grammar package (compiled to WASM) plus an app-side `parseBlock()` API and symbol-table extraction layer, giving the editor a real AST for Ren'Py source instead of the current regex-based analyzer.

**Architecture:** A hand-authored `grammar.js` + external C scanner (for Python-style significant whitespace) defines the Ren'Py language surface with medium-granularity structured statement nodes and opaque expression nodes. Embedded Python (`python:` blocks, `$` statements, screen-action expressions) is parsed via tree-sitter's language-injection mechanism into the official `tree-sitter-python` grammar, resolved manually inside `parseBlock()` since `web-tree-sitter` doesn't drive injections automatically. The compiled `renpy.wasm` is committed to git; `web-tree-sitter` loads both wasm grammars in-renderer via Vite static-asset imports.

**Tech Stack:** `tree-sitter-cli` (grammar authoring/build, devDependency scoped to `tree-sitter-renpy/`), `web-tree-sitter` (WASM runtime, app root dependency), TypeScript, Vitest, Vite (`?url` asset imports).

**Spec:** `docs/superpowers/specs/2026-08-16-tree-sitter-renpy-parser-design.md` — this plan implements that spec's Sections 1–8 for beads issue `bmf-vangard-renpy-ide-qu9i` (sub-project 1 of epic `bmf-vangard-renpy-ide-nms4`). Executors should read the spec once before starting; this plan restates only what's needed to implement each task.

## Global Constraints

- Node granularity: every Ren'Py statement type gets a real named AST node with structured fields; Python-ish expression *internals* stay opaque (`expression` node, raw text handed to injected Python grammar).
- Error recovery: rely on tree-sitter's default `ERROR`/`MISSING` recovery everywhere EXCEPT the hot-path half-typed states named in Task 8, which get explicit permissive grammar rules.
- Parsing model: `parseBlock()` is a stateless, full-reparse-per-call async function. No `tree.edit()`/incremental API in this plan.
- `tree-sitter-renpy/` is a standalone package at repo root, independent of the app's `package.json` (no npm workspaces) — the app consumes only its compiled `renpy.wasm` output, never as a JS import.
- `build:grammar` is a manual-only script — never wired into `predist`/`build`/`dev`/CI. `tree-sitter test` corpus runs are manual/local-only for grammar contributors.
- All app-side TypeScript uses the `@/` import alias (never relative `../` across directories) per this repo's convention.
- Symbol table types (`ParsedBlock`, `PythonInjection`, `RenpySymbolTable`, `BaseSymbol`, and each `*Symbol` interface) must match spec Section 6 verbatim — every task that touches them uses the exact same field names/types.

---

## Task 1: Scaffold `tree-sitter-renpy/` package

**Files:**
- Create: `tree-sitter-renpy/package.json`
- Create: `tree-sitter-renpy/grammar.js`
- Create: `tree-sitter-renpy/tree-sitter.json`
- Create: `tree-sitter-renpy/.gitignore`

**Interfaces:**
- Produces: a `tree-sitter generate`-able package with a `source_file` root rule accepting an empty file. Later tasks extend `grammar.js`'s `rules` object.

- [ ] **Step 1: Create `tree-sitter-renpy/package.json`**

```json
{
  "name": "tree-sitter-renpy",
  "version": "0.1.0",
  "private": true,
  "description": "Tree-sitter grammar for the Ren'Py visual novel scripting language",
  "main": "bindings/node",
  "scripts": {
    "build": "tree-sitter generate && tree-sitter build --wasm",
    "test": "tree-sitter test"
  },
  "devDependencies": {
    "tree-sitter-cli": "^0.24.0"
  }
}
```

- [ ] **Step 2: Create `tree-sitter-renpy/tree-sitter.json`**

```json
{
  "grammars": [
    {
      "name": "renpy",
      "camelcase": "Renpy",
      "scope": "source.renpy",
      "path": ".",
      "file-types": ["rpy"],
      "external-files": ["queries/injections.scm"]
    }
  ]
}
```

- [ ] **Step 3: Create the minimal `tree-sitter-renpy/grammar.js`**

```javascript
module.exports = grammar({
  name: 'renpy',

  rules: {
    source_file: $ => repeat($._statement),

    // Placeholder alternation target — every later task adds a case here.
    _statement: $ => choice(
      $.comment,
    ),

    comment: $ => token(seq('#', /.*/)),
  }
});
```

- [ ] **Step 4: Create `tree-sitter-renpy/.gitignore`**

```
node_modules/
*.log
```

- [ ] **Step 5: Install dependencies and generate the parser**

Run: `cd tree-sitter-renpy && npm install && npx tree-sitter generate`
Expected: succeeds, creates `tree-sitter-renpy/src/parser.c`, `src/grammar.json`, `src/node-types.json`, `bindings/` scaffold (via `tree-sitter generate`'s own binding scaffolding).

- [ ] **Step 6: Verify an empty file and a comment-only file parse cleanly**

Run: `cd tree-sitter-renpy && echo "# hello" | npx tree-sitter parse -`
Expected: prints a clean `(source_file (comment))` tree with no `ERROR` nodes.

- [ ] **Step 7: Commit**

```bash
git add tree-sitter-renpy/package.json tree-sitter-renpy/grammar.js tree-sitter-renpy/tree-sitter.json tree-sitter-renpy/.gitignore tree-sitter-renpy/src tree-sitter-renpy/bindings
git commit -m "feat(tree-sitter-renpy): scaffold grammar package"
```

---

## Task 2: External scanner for indentation (highest-risk piece)

**Files:**
- Create: `tree-sitter-renpy/src/scanner.c`
- Modify: `tree-sitter-renpy/grammar.js` (add `externals`, `extras`, `word`, `conflicts` fields; add `_block` rule)
- Create: `tree-sitter-renpy/test/corpus/indentation.txt`

**Interfaces:**
- Consumes: nothing from earlier tasks beyond the scaffold from Task 1.
- Produces: three external tokens (`_indent`, `_dedent`, `_newline`) and a `_block` rule (`':' _newline _indent _statement+ _dedent`) that every block-taking statement in Tasks 3–7 uses as its body.

Ren'Py, like Python, uses significant whitespace. Tree-sitter external scanners track raw column position across calls and emit synthetic `INDENT`/`DEDENT`/`NEWLINE` tokens the grammar rules consume like any other token. This scanner tracks an indent-stack (mirroring `tree-sitter-python`'s technique) and also tracks bracket depth so a `(`/`[`/`{`-continued logical line (used in multi-line screen-property calls) doesn't emit spurious `NEWLINE`s.

- [ ] **Step 1: Write the external scanner**

```c
#include "tree_sitter/parser.h"
#include <wctype.h>
#include <string.h>
#include <stdlib.h>

enum TokenType {
  NEWLINE,
  INDENT,
  DEDENT,
};

typedef struct {
  uint32_t indent_stack[128];
  uint16_t indent_stack_len;
  int32_t bracket_depth;
} Scanner;

void *tree_sitter_renpy_external_scanner_create() {
  Scanner *scanner = calloc(1, sizeof(Scanner));
  scanner->indent_stack[0] = 0;
  scanner->indent_stack_len = 1;
  scanner->bracket_depth = 0;
  return scanner;
}

void tree_sitter_renpy_external_scanner_destroy(void *payload) {
  free(payload);
}

unsigned tree_sitter_renpy_external_scanner_serialize(void *payload, char *buffer) {
  Scanner *scanner = (Scanner *)payload;
  size_t size = 0;
  buffer[size++] = (char)scanner->indent_stack_len;
  memcpy(&buffer[size], scanner->indent_stack, scanner->indent_stack_len * sizeof(uint32_t));
  size += scanner->indent_stack_len * sizeof(uint32_t);
  memcpy(&buffer[size], &scanner->bracket_depth, sizeof(int32_t));
  size += sizeof(int32_t);
  return (unsigned)size;
}

void tree_sitter_renpy_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {
  Scanner *scanner = (Scanner *)payload;
  scanner->indent_stack[0] = 0;
  scanner->indent_stack_len = 1;
  scanner->bracket_depth = 0;
  if (length == 0) return;
  size_t size = 0;
  scanner->indent_stack_len = (uint16_t)buffer[size++];
  memcpy(scanner->indent_stack, &buffer[size], scanner->indent_stack_len * sizeof(uint32_t));
  size += scanner->indent_stack_len * sizeof(uint32_t);
  memcpy(&scanner->bracket_depth, &buffer[size], sizeof(int32_t));
}

static void advance(TSLexer *lexer) { lexer->advance(lexer, false); }
static void skip(TSLexer *lexer) { lexer->advance(lexer, true); }

bool tree_sitter_renpy_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
  Scanner *scanner = (Scanner *)payload;

  // Track bracket depth on every scan pass so multi-line ( [ { calls
  // don't trigger NEWLINE/INDENT/DEDENT mid-expression.
  if (lexer->lookahead == '(' || lexer->lookahead == '[' || lexer->lookahead == '{') {
    scanner->bracket_depth++;
  } else if (lexer->lookahead == ')' || lexer->lookahead == ']' || lexer->lookahead == '}') {
    if (scanner->bracket_depth > 0) scanner->bracket_depth--;
  }

  if (scanner->bracket_depth > 0) {
    return false; // let the grammar's normal tokenization handle bracketed content
  }

  bool saw_newline = false;
  for (;;) {
    if (lexer->lookahead == '\n') {
      saw_newline = true;
      skip(lexer);
    } else if (lexer->lookahead == '\r' || lexer->lookahead == ' ' || lexer->lookahead == '\t') {
      skip(lexer);
    } else if (lexer->lookahead == '#') {
      // consume the whole comment line without emitting a token here;
      // the `comment` grammar rule handles it on the next real token pass
      while (lexer->lookahead != '\n' && !lexer->eof(lexer)) skip(lexer);
    } else {
      break;
    }
  }

  if (lexer->eof(lexer)) {
    if (valid_symbols[DEDENT] && scanner->indent_stack_len > 1) {
      scanner->indent_stack_len--;
      lexer->result_symbol = DEDENT;
      return true;
    }
    return false;
  }

  uint32_t indent_length = lexer->get_column(lexer);

  if (saw_newline) {
    uint32_t current_indent = scanner->indent_stack[scanner->indent_stack_len - 1];

    if (indent_length > current_indent && valid_symbols[INDENT]) {
      scanner->indent_stack[scanner->indent_stack_len++] = indent_length;
      lexer->result_symbol = INDENT;
      return true;
    }

    if (indent_length < current_indent && valid_symbols[DEDENT]) {
      scanner->indent_stack_len--;
      lexer->result_symbol = DEDENT;
      return true;
    }

    if (valid_symbols[NEWLINE]) {
      lexer->result_symbol = NEWLINE;
      return true;
    }
  }

  return false;
}
```

- [ ] **Step 2: Wire the scanner into `grammar.js`**

Add to the top-level `grammar({...})` call, alongside the existing `name`/`rules`:

```javascript
module.exports = grammar({
  name: 'renpy',

  externals: $ => [
    $._newline,
    $._indent,
    $._dedent,
  ],

  extras: $ => [
    /[ \t\r]/,
  ],

  word: $ => $.identifier,

  rules: {
    source_file: $ => repeat($._statement),

    _statement: $ => choice(
      $.comment,
    ),

    comment: $ => token(seq('#', /.*/)),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    // Shared block body used by every block-taking statement added in
    // later tasks: `label foo:` / `if x:` / `screen bar():` etc.
    _block: $ => seq(
      ':',
      optional(seq($._newline, $._indent, repeat1($._statement), $._dedent)),
    ),
  }
});
```

Note: `_block` is defined with `optional(...)` around the indented body per the spec's error-recovery requirement (Task 8 hardens this further, but the shape starts permissive from here so later tasks don't need to retrofit it).

- [ ] **Step 3: Write the indentation corpus test**

Create `tree-sitter-renpy/test/corpus/indentation.txt`:

```
==================
Nested indentation with dedent to outer scope
==================

# top level
# nested
# nested twice
# back to nested
# back to top

---

(source_file
  (comment)
  (comment)
  (comment)
  (comment)
  (comment))
```

(This first corpus case only exercises comments since no block-taking statement exists yet — it validates the scanner emits clean tokens without needing `label`/`if` grammar. Tasks 3+ add corpus files that exercise real `INDENT`/`DEDENT` via `label`/`if`/`menu` bodies using this same `_block` rule.)

- [ ] **Step 4: Build and run the corpus test**

Run: `cd tree-sitter-renpy && npx tree-sitter generate && npx tree-sitter test`
Expected: `indentation.txt`'s test passes with 0 `ERROR` nodes.

- [ ] **Step 5: Commit**

```bash
git add tree-sitter-renpy/src/scanner.c tree-sitter-renpy/grammar.js tree-sitter-renpy/test/corpus/indentation.txt tree-sitter-renpy/src/parser.c tree-sitter-renpy/src/grammar.json tree-sitter-renpy/src/node-types.json
git commit -m "feat(tree-sitter-renpy): add external scanner for significant whitespace"
```

---

## Task 3: Core statement grammar, part 1 (label/jump/call/return/menu/if/while/for)

**Files:**
- Modify: `tree-sitter-renpy/grammar.js`
- Create: `tree-sitter-renpy/test/corpus/labels.txt`
- Create: `tree-sitter-renpy/test/corpus/menus.txt`
- Create: `tree-sitter-renpy/test/corpus/control-flow.txt`

**Interfaces:**
- Consumes: `_block`, `identifier`, `_statement`, `_newline`/`_indent`/`_dedent` externals from Task 2.
- Produces: `label_statement`, `jump_statement`, `call_statement`, `return_statement`, `menu_statement`, `menu_choice`, `if_statement`, `while_statement`, `for_statement`, and the shared opaque `expression` node every later task's Python-ish arguments reuse.

- [ ] **Step 1: Add the `expression` opaque node and core statements to `grammar.js`**

Replace the `_statement: $ => choice(...)` alternation and add these rules to the `rules` object:

```javascript
    _statement: $ => choice(
      $.comment,
      $.label_statement,
      $.jump_statement,
      $.call_statement,
      $.return_statement,
      $.menu_statement,
      $.if_statement,
      $.while_statement,
      $.for_statement,
    ),

    // Opaque Python-ish expression — content is handed to the injected
    // tree-sitter-python grammar via injections.scm (Task 9), not
    // decomposed here per the spec's Q1-B granularity decision.
    expression: $ => /[^\n#]+/,

    label_statement: $ => seq(
      'label',
      field('name', $.identifier),
      optional(field('parameters', $.parameter_list)),
      optional(choice('hide', 'global')),
      $._block,
    ),

    parameter_list: $ => seq('(', optional($.expression), ')'),

    jump_statement: $ => seq(
      'jump',
      optional('expression'),
      field('target', choice($.identifier, $.expression)),
    ),

    call_statement: $ => seq(
      'call',
      optional('expression'),
      field('target', choice($.identifier, $.expression)),
      optional(seq('from', field('from_label', $.identifier))),
    ),

    return_statement: $ => seq(
      'return',
      optional(field('value', $.expression)),
    ),

    menu_statement: $ => seq(
      'menu',
      optional(field('label', $.identifier)),
      ':',
      $._newline,
      $._indent,
      repeat1($.menu_choice),
      $._dedent,
    ),

    menu_choice: $ => seq(
      field('text', $.string),
      optional(field('condition', seq('if', $.expression))),
      $._block,
    ),

    if_statement: $ => seq(
      'if',
      field('condition', $.expression),
      $._block,
      repeat($.elif_clause),
      optional($.else_clause),
    ),

    elif_clause: $ => seq('elif', field('condition', $.expression), $._block),
    else_clause: $ => seq('else', $._block),

    while_statement: $ => seq(
      'while',
      field('condition', $.expression),
      $._block,
    ),

    for_statement: $ => seq(
      'for',
      field('variable', $.expression),
      'in',
      field('iterable', $.expression),
      $._block,
    ),

    string: $ => choice(
      seq('"', repeat(choice(/[^"\\]/, /\\./)), '"'),
      seq("'", repeat(choice(/[^'\\]/, /\\./)), "'"),
    ),
```

- [ ] **Step 2: Write `test/corpus/labels.txt`**

```
==================
Simple label with jump
==================

label start:
    jump chapter_one

---

(source_file
  (label_statement
    name: (identifier)
    (jump_statement target: (identifier))))

==================
Label with parameters and return
==================

label ask_name(default_name="Alex"):
    return

---

(source_file
  (label_statement
    name: (identifier)
    parameters: (parameter_list (expression))
    (return_statement)))
```

- [ ] **Step 3: Write `test/corpus/menus.txt`**

```
==================
Menu with two choices and a condition
==================

menu:
    "Go left":
        jump left_path
    "Go right" if has_key:
        jump right_path

---

(source_file
  (menu_statement
    (menu_choice
      text: (string)
      (jump_statement target: (identifier)))
    (menu_choice
      text: (string)
      condition: (expression)
      (jump_statement target: (identifier)))))
```

- [ ] **Step 4: Write `test/corpus/control-flow.txt`**

```
==================
If/elif/else with nested for loop
==================

label check:
    if points > 10:
        for i in range(points):
            call award_point
    elif points > 0:
        jump low_score
    else:
        jump no_score

---

(source_file
  (label_statement
    name: (identifier)
    (if_statement
      condition: (expression)
      (for_statement
        variable: (expression)
        iterable: (expression)
        (call_statement target: (identifier)))
      (elif_clause
        condition: (expression)
        (jump_statement target: (identifier)))
      (else_clause
        (jump_statement target: (identifier))))))
```

- [ ] **Step 5: Run corpus tests**

Run: `cd tree-sitter-renpy && npx tree-sitter generate && npx tree-sitter test`
Expected: `labels.txt`, `menus.txt`, `control-flow.txt`, and `indentation.txt` all pass.

- [ ] **Step 6: Commit**

```bash
git add tree-sitter-renpy/grammar.js tree-sitter-renpy/test/corpus/labels.txt tree-sitter-renpy/test/corpus/menus.txt tree-sitter-renpy/test/corpus/control-flow.txt tree-sitter-renpy/src
git commit -m "feat(tree-sitter-renpy): add core statements (label/jump/call/menu/if/while/for)"
```

---

## Task 4: Core statement grammar, part 2 (say/python/dollar/define/default/image/scene/show/hide/with)

**Files:**
- Modify: `tree-sitter-renpy/grammar.js`
- Create: `tree-sitter-renpy/test/corpus/say-statements.txt`
- Create: `tree-sitter-renpy/test/corpus/python-and-vars.txt`
- Create: `tree-sitter-renpy/test/corpus/image-statements.txt`

**Interfaces:**
- Consumes: `expression`, `string`, `_statement`, `identifier` from Task 3.
- Produces: `say_statement`, `python_statement`, `init_python_statement`, `dollar_statement`, `define_statement`, `default_statement`, `image_statement`, `scene_statement`, `show_statement`, `hide_statement`, `with_statement`. `python_statement`/`init_python_statement`/`dollar_statement` are the injection points Task 9's `injections.scm` targets.

- [ ] **Step 1: Add the statements to `grammar.js`**

Extend the `_statement` choice:

```javascript
    _statement: $ => choice(
      $.comment,
      $.label_statement,
      $.jump_statement,
      $.call_statement,
      $.return_statement,
      $.menu_statement,
      $.if_statement,
      $.while_statement,
      $.for_statement,
      $.say_statement,
      $.python_statement,
      $.init_python_statement,
      $.dollar_statement,
      $.define_statement,
      $.default_statement,
      $.image_statement,
      $.scene_statement,
      $.show_statement,
      $.hide_statement,
      $.with_statement,
    ),
```

Add rules:

```javascript
    say_statement: $ => seq(
      optional(field('character', choice($.identifier, $.expression))),
      optional(field('attributes', repeat1($.identifier))),
      field('text', $.string),
      optional(seq('with', field('transition', $.expression))),
    ),

    // Injection point (Task 9): body text between `python:`/`:` and dedent
    // is opaque here, handed to tree-sitter-python via injections.scm.
    python_statement: $ => seq(
      'python',
      optional(choice('hide', 'early')),
      field('body', $._block),
    ),

    init_python_statement: $ => seq(
      'init',
      optional(field('priority', /-?[0-9]+/)),
      'python',
      field('body', $._block),
    ),

    // Injection point (Task 9): the expression after `$` is opaque here.
    dollar_statement: $ => seq('$', field('expression', $.expression)),

    define_statement: $ => seq(
      'define',
      field('name', $.identifier),
      '=',
      field('value', $.expression),
    ),

    default_statement: $ => seq(
      'default',
      field('name', $.identifier),
      '=',
      field('value', $.expression),
    ),

    image_statement: $ => seq(
      'image',
      field('name', repeat1($.identifier)),
      '=',
      field('value', $.expression),
    ),

    scene_statement: $ => seq(
      'scene',
      optional(field('image', repeat1($.identifier))),
      optional(seq('at', field('at_expr', $.expression))),
      optional(seq('with', field('transition', $.expression))),
    ),

    show_statement: $ => seq(
      'show',
      field('image', repeat1($.identifier)),
      optional(seq('at', field('at_expr', $.expression))),
      optional(seq('as', field('as_name', $.identifier))),
      optional(seq('with', field('transition', $.expression))),
    ),

    hide_statement: $ => seq(
      'hide',
      field('image', repeat1($.identifier)),
      optional(seq('with', field('transition', $.expression))),
    ),

    with_statement: $ => seq(
      'with',
      field('transition', $.expression),
    ),
```

- [ ] **Step 2: Write `test/corpus/say-statements.txt`**

```
==================
Character say with attributes and narrator say
==================

label start:
    eileen happy "Hello there!"
    "The room is quiet."

---

(source_file
  (label_statement
    name: (identifier)
    (say_statement
      character: (identifier)
      attributes: (identifier)
      text: (string))
    (say_statement
      text: (string))))
```

- [ ] **Step 3: Write `test/corpus/python-and-vars.txt`**

```
==================
Python block, dollar statement, define and default
==================

define e = Character("Eileen")
default points = 0

label start:
    $ points += 1
    python:
        total = points * 2

---

(source_file
  (define_statement name: (identifier) value: (expression))
  (default_statement name: (identifier) value: (expression))
  (label_statement
    name: (identifier)
    (dollar_statement expression: (expression))
    (python_statement body: (comment))))
```

Note: the expected tree's `python_statement body:` field shape depends on how `_block`'s optional indented body renders when it contains only an opaque assignment line — since `expression`/`_statement` doesn't yet have a generic "any line of Python-looking text" fallback inside `_block`, add a `_statement`-level `expression_statement` fallback so raw Python lines inside `python:` blocks parse instead of erroring:

```javascript
    _statement: $ => choice(
      // ...all statements above...
      $.expression_statement,
    ),

    expression_statement: $ => $.expression,
```

Update the expected tree in `python-and-vars.txt` accordingly: `(python_statement body: (expression_statement (expression)))`.

- [ ] **Step 4: Write `test/corpus/image-statements.txt`**

```
==================
Image, scene, show with transition, hide
==================

image eileen happy = "eileen_happy.png"

label start:
    scene bg room with fade
    show eileen happy at right with dissolve
    hide eileen

---

(source_file
  (image_statement name: (identifier) name: (identifier) value: (expression))
  (label_statement
    name: (identifier)
    (scene_statement image: (identifier) image: (identifier) transition: (expression))
    (show_statement
      image: (identifier)
      image: (identifier)
      at_expr: (expression)
      transition: (expression))
    (hide_statement image: (identifier))))
```

- [ ] **Step 5: Run corpus tests**

Run: `cd tree-sitter-renpy && npx tree-sitter generate && npx tree-sitter test`
Expected: all corpus files pass, including the three new ones.

- [ ] **Step 6: Commit**

```bash
git add tree-sitter-renpy/grammar.js tree-sitter-renpy/test/corpus/say-statements.txt tree-sitter-renpy/test/corpus/python-and-vars.txt tree-sitter-renpy/test/corpus/image-statements.txt tree-sitter-renpy/src
git commit -m "feat(tree-sitter-renpy): add say/python/dollar/define/default/image statements"
```

---

## Task 5: Screen-language grammar

**Files:**
- Modify: `tree-sitter-renpy/grammar.js`
- Create: `tree-sitter-renpy/test/corpus/screens.txt`

**Interfaces:**
- Consumes: `_block`, `expression`, `identifier`, `_statement` from Tasks 3–4.
- Produces: `screen_statement`, `screen_language_statement` (the single shared node shape covering all screen-language widgets per spec Section 3), `property`.

- [ ] **Step 1: Add screen-language rules to `grammar.js`**

Extend `_statement`:

```javascript
      $.screen_statement,
```

Add rules:

```javascript
    screen_statement: $ => seq(
      'screen',
      field('name', $.identifier),
      optional(field('parameters', $.parameter_list)),
      ':',
      $._newline,
      $._indent,
      repeat1($.screen_language_statement),
      $._dedent,
    ),

    // One shared shape for every screen-language widget/control-flow
    // construct (if/for/use/frame/vbox/button/text/imagemap/...) since
    // Ren'Py screen-language is structurally uniform: a tag, optional
    // positional/keyword properties, and an optional indented body.
    screen_language_statement: $ => seq(
      field('widget_tag', $.identifier),
      repeat(field('properties', $.property)),
      optional(seq(':', $._newline, $._indent, repeat1($.screen_language_statement), $._dedent)),
    ),

    property: $ => choice(
      seq(field('name', $.identifier), field('value', $.expression)),
      $.expression,
    ),
```

- [ ] **Step 2: Write `test/corpus/screens.txt`**

```
==================
Screen with nested if and vbox/button widgets
==================

screen main_menu():
    vbox:
        text "Welcome"
        if persistent.unlocked:
            button:
                action Start()
                text "Play"

---

(source_file
  (screen_statement
    name: (identifier)
    parameters: (parameter_list)
    (screen_language_statement
      widget_tag: (identifier)
      (screen_language_statement
        widget_tag: (identifier)
        properties: (property (expression)))
      (screen_language_statement
        widget_tag: (identifier)
        properties: (property (expression))
        (screen_language_statement
          widget_tag: (identifier)
          (screen_language_statement
            widget_tag: (identifier)
            properties: (property name: (identifier) value: (expression)))
          (screen_language_statement
            widget_tag: (identifier)
            properties: (property (expression))))))))
```

- [ ] **Step 3: Run corpus tests**

Run: `cd tree-sitter-renpy && npx tree-sitter generate && npx tree-sitter test`
Expected: `screens.txt` passes alongside all prior corpus files.

- [ ] **Step 4: Commit**

```bash
git add tree-sitter-renpy/grammar.js tree-sitter-renpy/test/corpus/screens.txt tree-sitter-renpy/src
git commit -m "feat(tree-sitter-renpy): add screen-language grammar"
```

---

## Task 6: ATL grammar

**Files:**
- Modify: `tree-sitter-renpy/grammar.js`
- Create: `tree-sitter-renpy/test/corpus/atl.txt`

**Interfaces:**
- Consumes: `_block`, `expression`, `identifier`, `_statement` from Tasks 3–4.
- Produces: `transform_statement`, `atl_block`, `atl_statement` variants (`atl_transform_property`, `atl_with_statement`, `atl_block_statement`, `atl_time_statement`).

- [ ] **Step 1: Add ATL rules to `grammar.js`**

Extend `_statement`:

```javascript
      $.transform_statement,
```

Add rules:

```javascript
    transform_statement: $ => seq(
      'transform',
      field('name', $.identifier),
      optional(field('parameters', $.parameter_list)),
      ':',
      $._newline,
      $._indent,
      repeat1($.atl_statement),
      $._dedent,
    ),

    atl_statement: $ => choice(
      $.atl_transform_property,
      $.atl_with_statement,
      $.atl_block_statement,
      $.atl_time_statement,
    ),

    // `xalign 0.5`, `zoom 1.2`, `rotate 45` style property sets — reuses
    // the opaque-expression pattern since ATL property values are
    // Python-ish numeric/interpolated expressions.
    atl_transform_property: $ => seq(
      field('property', $.identifier),
      field('value', $.expression),
    ),

    atl_with_statement: $ => seq('with', field('warper', $.expression)),

    atl_block_statement: $ => seq(
      choice('parallel', 'contains', 'choice', 'block', 'repeat'),
      ':',
      $._newline,
      $._indent,
      repeat1($.atl_statement),
      $._dedent,
    ),

    atl_time_statement: $ => seq(
      choice('pause', 'time'),
      field('duration', $.expression),
    ),
```

- [ ] **Step 2: Write `test/corpus/atl.txt`**

```
==================
Transform with property sets and a parallel block
==================

transform bounce:
    xalign 0.5
    parallel:
        rotate 45
        pause 1.0

---

(source_file
  (transform_statement
    name: (identifier)
    (atl_transform_property property: (identifier) value: (expression))
    (atl_block_statement
      (atl_transform_property property: (identifier) value: (expression))
      (atl_time_statement duration: (expression)))))
```

- [ ] **Step 3: Run corpus tests**

Run: `cd tree-sitter-renpy && npx tree-sitter generate && npx tree-sitter test`
Expected: `atl.txt` passes alongside all prior corpus files.

- [ ] **Step 4: Commit**

```bash
git add tree-sitter-renpy/grammar.js tree-sitter-renpy/test/corpus/atl.txt tree-sitter-renpy/src
git commit -m "feat(tree-sitter-renpy): add ATL grammar"
```

---

## Task 7: Translate/style/rare statements (camera/layeredimage/nvl)

**Files:**
- Modify: `tree-sitter-renpy/grammar.js`
- Create: `tree-sitter-renpy/test/corpus/translate.txt`
- Create: `tree-sitter-renpy/test/corpus/styles.txt`
- Create: `tree-sitter-renpy/test/corpus/rare-statements.txt`

**Interfaces:**
- Consumes: `_block`, `expression`, `identifier`, `string`, `_statement`, `say_statement`, `menu_statement` from Tasks 3–4.
- Produces: `translate_statement`, `style_statement`, `style_property_statement`, `camera_statement`, `layeredimage_statement`, `nvl_statement`.

- [ ] **Step 1: Add the remaining statements to `grammar.js`**

Extend `_statement`:

```javascript
      $.translate_statement,
      $.style_statement,
      $.camera_statement,
      $.layeredimage_statement,
      $.nvl_statement,
```

Add rules:

```javascript
    translate_statement: $ => seq(
      'translate',
      field('language', $.identifier),
      field('scope', choice($.identifier, 'strings')),
      $._block,
    ),

    style_statement: $ => seq(
      'style',
      field('name', $.identifier),
      optional(seq('is', field('parent', $.identifier))),
      optional(seq('take', field('take_from', $.identifier))),
      ':',
      $._newline,
      $._indent,
      repeat1($.style_property_statement),
      $._dedent,
    ),

    style_property_statement: $ => seq(
      field('property', $.identifier),
      field('value', $.expression),
    ),

    camera_statement: $ => seq(
      'camera',
      optional(field('layer', $.identifier)),
      optional(seq('at', field('at_expr', $.expression))),
    ),

    // Reuses style_property_statement's shape per the spec's guidance
    // that layeredimage should be modeled consistent with style.
    layeredimage_statement: $ => seq(
      'layeredimage',
      field('name', repeat1($.identifier)),
      ':',
      $._newline,
      $._indent,
      repeat1($.style_property_statement),
      $._dedent,
    ),

    nvl_statement: $ => seq(
      'nvl',
      choice('clear', 'show', 'hide'),
    ),
```

- [ ] **Step 2: Write `test/corpus/translate.txt`**

```
==================
Translate block with a say statement inside
==================

translate french start_label:
    eileen "Bonjour!"

---

(source_file
  (translate_statement
    language: (identifier)
    scope: (identifier)
    (say_statement character: (identifier) text: (string))))
```

- [ ] **Step 3: Write `test/corpus/styles.txt`**

```
==================
Style with parent and properties
==================

style my_button is button:
    xpadding 10
    background "#333"

---

(source_file
  (style_statement
    name: (identifier)
    parent: (identifier)
    (style_property_statement property: (identifier) value: (expression))
    (style_property_statement property: (identifier) value: (expression))))
```

- [ ] **Step 4: Write `test/corpus/rare-statements.txt`**

```
==================
Camera, layeredimage, nvl
==================

camera at truecenter

layeredimage eileen:
    always "eileen_base.png"

label start:
    nvl clear

---

(source_file
  (camera_statement at_expr: (expression))
  (layeredimage_statement
    name: (identifier)
    (style_property_statement property: (identifier) value: (expression)))
  (label_statement
    name: (identifier)
    (nvl_statement)))
```

- [ ] **Step 5: Run corpus tests**

Run: `cd tree-sitter-renpy && npx tree-sitter generate && npx tree-sitter test`
Expected: all three new corpus files pass alongside every prior one.

- [ ] **Step 6: Commit**

```bash
git add tree-sitter-renpy/grammar.js tree-sitter-renpy/test/corpus/translate.txt tree-sitter-renpy/test/corpus/styles.txt tree-sitter-renpy/test/corpus/rare-statements.txt tree-sitter-renpy/src
git commit -m "feat(tree-sitter-renpy): add translate/style/camera/layeredimage/nvl statements"
```

---

## Task 8: Error-recovery hardening for hot-path half-typed constructs

**Files:**
- Modify: `tree-sitter-renpy/grammar.js`
- Create: `tree-sitter-renpy/test/corpus/error-recovery.txt`

**Interfaces:**
- Consumes: `label_statement`, `menu_statement`, `screen_statement`, `if_statement`/`while_statement`/`for_statement`, `string`, `say_statement` from Tasks 3–5.
- Produces: no new node types — hardens existing rules so the three hot-path half-typed states from spec Section 3 parse as structured-but-incomplete nodes instead of `ERROR`.

- [ ] **Step 1: Verify header-without-body already recovers cleanly**

`_block` was defined with `optional(...)` around the indented-body portion back in Task 2, so `label foo:` / `if x:` / `screen bar():` with nothing following already parse as complete, empty-bodied nodes. No grammar change needed for this case — Step 4's corpus test asserts it explicitly as a regression guard.

- [ ] **Step 2: Add a permissive unterminated-string token alternative**

Replace the `string` rule with a version whose `token()` wrapping allows an unterminated string (no closing quote before newline/EOF) to still lex as a `string` node rather than falling through to `ERROR`:

```javascript
    string: $ => choice(
      token(seq('"', repeat(choice(/[^"\\\n]/, /\\./)), optional('"'))),
      token(seq("'", repeat(choice(/[^'\\\n]/, /\\./)), optional("'"))),
    ),
```

The trailing `optional('"')`/`optional("'")` is the key change: a string that never closes before the line ends still matches the token (flagged for downstream consumers as unterminated by checking the source text's last character isn't the matching quote), instead of leaving unconsumed input that would surface as `ERROR`.

- [ ] **Step 3: Verify partial say-statements resolve structurally**

Because `say_statement`'s `text` field already uses the now-permissive `string` rule from Step 2, a partially-typed say-statement (`eileen "Hello, how are` with no closing quote) parses as a complete `say_statement` node with an unterminated `text` string, not an `ERROR`. No additional grammar change needed — Step 4's corpus test asserts this explicitly.

- [ ] **Step 4: Write `test/corpus/error-recovery.txt`**

```
==================
Unterminated label header with no body
==================

label start:

---

(source_file
  (label_statement name: (identifier)))

==================
Unterminated string on a say statement being typed
==================

label start:
    eileen "Hello, how are

---

(source_file
  (label_statement
    name: (identifier)
    (say_statement character: (identifier) text: (string))))

==================
Menu header with no choices yet
==================

menu:

---

(source_file
  (ERROR))
```

Note on the third case: `menu_statement` requires `repeat1($.menu_choice)` (at least one choice) per Task 3's grammar, so an empty menu body is expected to still produce an `ERROR` — this is intentionally NOT one of the three hardened hot-path cases named in spec Section 3 (menu, unlike label/screen/if, is rarely typed with zero choices for more than an instant, and hardening it would require making `menu_choice` fully optional, which would make a truly empty `menu:` ambiguous with a malformed one). Document this as an accepted gap rather than silently "fixing" it — if real-world editing feels janky here, revisit in sub-project 3.

- [ ] **Step 5: Run corpus tests**

Run: `cd tree-sitter-renpy && npx tree-sitter generate && npx tree-sitter test`
Expected: all corpus files pass, including `error-recovery.txt`'s three cases (two clean parses, one expected `ERROR` documented as accepted).

- [ ] **Step 6: Commit**

```bash
git add tree-sitter-renpy/grammar.js tree-sitter-renpy/test/corpus/error-recovery.txt tree-sitter-renpy/src
git commit -m "feat(tree-sitter-renpy): harden error recovery for half-typed labels/strings/say-statements"
```

---

## Task 9: `injections.scm` wiring

**Files:**
- Create: `tree-sitter-renpy/queries/injections.scm`

**Interfaces:**
- Consumes: `python_statement`, `init_python_statement`, `dollar_statement`, `expression` node types from Tasks 4 and 3.
- Produces: the injection query file `parseBlock.ts` (Task 11) reads to find Python-injection spans.

- [ ] **Step 1: Write `tree-sitter-renpy/queries/injections.scm`**

```scheme
; Injection point 1: python:/init python: block bodies.
; The body field is currently rendered as a generic expression_statement
; sequence (Task 4); inject the whole body span as a Python module.
((python_statement body: (_) @injection.content)
 (#set! injection.language "python"))

((init_python_statement body: (_) @injection.content)
 (#set! injection.language "python"))

; Injection point 2: one-line `$ expr` statements — a single Python
; expression/statement, not a full module.
((dollar_statement expression: (expression) @injection.content)
 (#set! injection.language "python")
 (#set! injection.combined))

; Injection point 3: screen-action / ATL-property / condition expressions
; anywhere an opaque `expression` node appears outside a dollar_statement
; (property values, if-conditions, ATL property values) — injected as a
; Python expression fragment, not a full module.
((property value: (expression) @injection.content)
 (#set! injection.language "python"))

((screen_language_statement properties: (property (expression) @injection.content)))

((if_statement condition: (expression) @injection.content)
 (#set! injection.language "python"))

((elif_clause condition: (expression) @injection.content)
 (#set! injection.language "python"))

((atl_transform_property value: (expression) @injection.content)
 (#set! injection.language "python"))
```

Note: `web-tree-sitter` does not execute `#set!` directives or run injection queries automatically (per spec Section 4) — this file is data that `parseBlock.ts` (Task 11) reads via its own small query-matching step, not something tree-sitter itself applies. The `#set!` predicates follow the standard tree-sitter-query convention (matching what Neovim/Zed/Helix expect) so this file stays portable if the grammar is ever consumed by an injection-aware host later, even though this project's own consumer (Task 11) only reads `injection.content` capture ranges and a fixed `kind` mapping, not the `#set!` metadata itself.

- [ ] **Step 2: Verify the query file parses as valid tree-sitter query syntax**

Run: `cd tree-sitter-renpy && npx tree-sitter query queries/injections.scm test/corpus/python-and-vars.txt`

Expected: no query-syntax errors reported (the command may report zero matches against the corpus *file* itself since `tree-sitter query` expects a source file, not a corpus file — if so, instead run it against a scratch `.rpy` file containing the `python-and-vars.txt` example's source text and confirm it reports 2 matches, one for the `$ points += 1` dollar_statement and one for the `python:` block body).

- [ ] **Step 3: Commit**

```bash
git add tree-sitter-renpy/queries/injections.scm
git commit -m "feat(tree-sitter-renpy): add Python language-injection query"
```

---

## Task 10: Build/bundling pipeline

**Files:**
- Modify: `package.json` (app root)
- Create: `src/lib/tree-sitter/vendor/tree-sitter-python.wasm` (vendored binary)
- Create: `tree-sitter-renpy/renpy.wasm` (build output, committed)

**Interfaces:**
- Consumes: the finished grammar from Tasks 1–9.
- Produces: both `.wasm` files on disk, committed, ready for Task 11's `parseBlock.ts` to import.

- [ ] **Step 1: Add `web-tree-sitter` as an app runtime dependency**

Run: `npm install web-tree-sitter`
Expected: `package.json`'s `dependencies` gains `"web-tree-sitter": "^0.24.0"` (or whatever version `npm install` resolves — pin to the same major version as `tree-sitter-cli` used in `tree-sitter-renpy/package.json` to keep wasm ABI compatible), `package-lock.json` updates.

- [ ] **Step 2: Add the `build:grammar` convenience script**

Modify `package.json`'s `"scripts"` block, adding (do not wire this into `"build"`, `"dev"`, `"pretest"`, or any CI-invoked script):

```json
    "build:grammar": "cd tree-sitter-renpy && npm install && npm run build"
```

- [ ] **Step 3: Build the grammar and commit the wasm artifact**

Run: `npm run build:grammar`
Expected: produces `tree-sitter-renpy/renpy.wasm`.

- [ ] **Step 4: Vendor the official `tree-sitter-python.wasm`**

Run:
```bash
mkdir -p src/lib/tree-sitter/vendor
npm install --no-save tree-sitter-python
cp node_modules/tree-sitter-python/tree-sitter-python.wasm src/lib/tree-sitter/vendor/tree-sitter-python.wasm
```

Expected: `src/lib/tree-sitter/vendor/tree-sitter-python.wasm` exists on disk. (`--no-save` because this is a one-time copy, not an app dependency — the app never imports the `tree-sitter-python` npm package's JS, only its vendored `.wasm` binary, per spec Section 2.)

- [ ] **Step 5: Verify both wasm files load under `web-tree-sitter` in isolation**

Create a throwaway scratch script (not committed) that runs:
```javascript
const Parser = require('web-tree-sitter');
(async () => {
  await Parser.Parser.init();
  const Renpy = await Parser.Language.load('tree-sitter-renpy/renpy.wasm');
  const Python = await Parser.Language.load('src/lib/tree-sitter/vendor/tree-sitter-python.wasm');
  console.log('loaded', Renpy, Python);
})();
```
Run it with `node` from the repo root. Expected: prints both loaded `Language` objects with no errors, confirming the wasm files are valid and ABI-compatible with the installed `web-tree-sitter` version.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tree-sitter-renpy/renpy.wasm src/lib/tree-sitter/vendor/tree-sitter-python.wasm
git commit -m "build: add web-tree-sitter runtime dep, build:grammar script, commit compiled wasm grammars"
```

---

## Task 11: `parseBlock.ts` API

**Files:**
- Create: `src/lib/tree-sitter/parseBlock.ts`
- Test: `src/test/treeSitterParseBlock.test.ts`

**Interfaces:**
- Consumes: `tree-sitter-renpy/renpy.wasm`, `src/lib/tree-sitter/vendor/tree-sitter-python.wasm` from Task 10; `queries/injections.scm` from Task 9.
- Produces: `export async function parseBlock(content: string): Promise<ParsedBlock>`, `export interface ParsedBlock`, `export interface PythonInjection` — the exact shapes from spec Section 6, consumed by `symbolTable.ts` (Task 12) and eventually sub-projects 2/3.

- [ ] **Step 1: Write the failing test**

Create `src/test/treeSitterParseBlock.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { parseBlock } from '@/lib/tree-sitter/parseBlock';

describe('parseBlock', () => {
  it('parses a simple label with a jump into a clean tree with no ERROR nodes', async () => {
    const result = await parseBlock('label start:\n    jump chapter_one\n');
    expect(result.tree.rootNode.hasError).toBe(false);
    expect(result.tree.rootNode.type).toBe('source_file');
  });

  it('identifies a dollar_statement as a python-injection span', async () => {
    const result = await parseBlock('label start:\n    $ points += 1\n');
    expect(result.pythonInjections).toHaveLength(1);
    expect(result.pythonInjections[0].kind).toBe('dollar-statement');
  });

  it('identifies a python: block body as a python-injection span', async () => {
    const result = await parseBlock('label start:\n    python:\n        total = 1\n');
    expect(result.pythonInjections.some(inj => inj.kind === 'python-block')).toBe(true);
  });

  it('reports parseTimeMs as a non-negative number', async () => {
    const result = await parseBlock('label start:\n    jump chapter_one\n');
    expect(result.parseTimeMs).toBeGreaterThanOrEqual(0);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/test/treeSitterParseBlock.test.ts`
Expected: FAIL with "Cannot find module '@/lib/tree-sitter/parseBlock'".

- [ ] **Step 3: Implement `parseBlock.ts`**

```typescript
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

let renpyParser: Parser | null = null;
let pythonParser: Parser | null = null;
let injectionsQuery: Query | null = null;
let initPromise: Promise<void> | null = null;

async function ensureInitialized(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    await Parser.init();
    const [renpyLang, pythonLang] = await Promise.all([
      Language.load(renpyWasmUrl),
      Language.load(pythonWasmUrl),
    ]);
    renpyParser = new Parser();
    renpyParser.setLanguage(renpyLang);
    pythonParser = new Parser();
    pythonParser.setLanguage(pythonLang);
    injectionsQuery = renpyLang.query(injectionsQuerySource);
  })();
  return initPromise;
}

function injectionKindForNode(node: SyntaxNode): PythonInjection['kind'] {
  let current: SyntaxNode | null = node;
  while (current) {
    if (current.type === 'dollar_statement') return 'dollar-statement';
    if (current.type === 'python_statement' || current.type === 'init_python_statement') return 'python-block';
    current = current.parent;
  }
  return 'screen-expression';
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
    for (const capture of match.captures) {
      if (capture.name !== 'injection.content') continue;
      const node = capture.node;
      const spanText = content.slice(node.startIndex, node.endIndex);
      const pythonTree = pythonParser!.parse(spanText);
      if (!pythonTree) continue;
      pythonInjections.push({
        range: [node.startIndex, node.endIndex],
        tree: pythonTree,
        kind: injectionKindForNode(node),
      });
    }
  }

  const parseTimeMs = performance.now() - start;
  return { tree, pythonInjections, parseTimeMs };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- src/test/treeSitterParseBlock.test.ts`
Expected: PASS on all four assertions.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tree-sitter/parseBlock.ts src/test/treeSitterParseBlock.test.ts
git commit -m "feat: add parseBlock() API wiring tree-sitter-renpy + Python injection"
```

---

## Task 12: `symbolTable.ts` extraction layer

**Files:**
- Create: `src/lib/tree-sitter/symbolTable.ts`
- Test: `src/test/treeSitterSymbolTable.test.ts`

**Interfaces:**
- Consumes: `Tree`/`SyntaxNode` from `parseBlock.ts` (Task 11).
- Produces: `export function extractSymbolTable(tree: Tree): RenpySymbolTable` plus every symbol interface from spec Section 6 verbatim, consumed by sub-projects 2/3 later.

- [ ] **Step 1: Write the failing test**

Create `src/test/treeSitterSymbolTable.test.ts`:

```typescript
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

    const pointsVar = table.variables.find(v => v.name === 'points');
    expect(pointsVar).toBeDefined();
    expect(pointsVar?.declarationType).toBe('implicit');
    expect(pointsVar?.scopeId).toBe(table.labels[0].node.id.toString());

    const eVar = table.variables.find(v => v.name === 'e');
    expect(eVar?.declarationType).toBe('define');
    expect(eVar?.scopeId).toBeNull();
  });

  it('extracts screens with their declared name', async () => {
    const { tree } = await parseBlock('screen main_menu():\n    text "Hi"\n');
    const table = extractSymbolTable(tree);
    expect(table.screens).toHaveLength(1);
    expect(table.screens[0].name).toBe('main_menu');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/test/treeSitterSymbolTable.test.ts`
Expected: FAIL with "Cannot find module '@/lib/tree-sitter/symbolTable'".

- [ ] **Step 3: Implement `symbolTable.ts`**

```typescript
import type { Tree, SyntaxNode } from 'web-tree-sitter';

interface BaseSymbol {
  name: string;
  node: SyntaxNode;
  line: number;
  column: number;
  scopeId: string | null;
}

export interface LabelSymbol extends BaseSymbol {
  kind: 'label';
  parameters: string[];
}

export interface CharacterSymbol extends BaseSymbol {
  kind: 'character';
  initialValueExpr: string;
}

export interface ScreenSymbol extends BaseSymbol {
  kind: 'screen';
  parameters: string[];
}

export interface VariableSymbol extends BaseSymbol {
  kind: 'variable';
  declarationType: 'define' | 'default' | 'implicit';
  initialValueExpr: string;
}

export interface ImageSymbol extends BaseSymbol {
  kind: 'image';
  initialValueExpr: string;
}

export interface MenuSymbol extends BaseSymbol {
  kind: 'menu';
  choiceTexts: string[];
}

export interface TransformSymbol extends BaseSymbol {
  kind: 'transform';
}

export interface StyleSymbol extends BaseSymbol {
  kind: 'style';
  parent: string | null;
}

export interface RenpySymbolTable {
  labels: LabelSymbol[];
  characters: CharacterSymbol[];
  screens: ScreenSymbol[];
  variables: VariableSymbol[];
  images: ImageSymbol[];
  menus: MenuSymbol[];
  transforms: TransformSymbol[];
  styles: StyleSymbol[];
}

function enclosingLabelId(node: SyntaxNode): string | null {
  let current: SyntaxNode | null = node.parent;
  while (current) {
    if (current.type === 'label_statement') return current.id.toString();
    current = current.parent;
  }
  return null;
}

function base(node: SyntaxNode, name: string): BaseSymbol {
  return {
    name,
    node,
    line: node.startPosition.row + 1,
    column: node.startPosition.column,
    scopeId: enclosingLabelId(node),
  };
}

function walk(node: SyntaxNode, visit: (n: SyntaxNode) => void) {
  visit(node);
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child) walk(child, visit);
  }
}

export function extractSymbolTable(tree: Tree): RenpySymbolTable {
  const table: RenpySymbolTable = {
    labels: [], characters: [], screens: [], variables: [],
    images: [], menus: [], transforms: [], styles: [],
  };

  walk(tree.rootNode, node => {
    switch (node.type) {
      case 'label_statement': {
        const nameNode = node.childForFieldName('name');
        if (!nameNode) break;
        const parametersNode = node.childForFieldName('parameters');
        table.labels.push({
          ...base(node, nameNode.text),
          kind: 'label',
          parameters: parametersNode ? [parametersNode.text] : [],
        });
        break;
      }
      case 'define_statement':
      case 'default_statement': {
        const nameNode = node.childForFieldName('name');
        const valueNode = node.childForFieldName('value');
        if (!nameNode) break;
        // `define x = Character(...)` is modeled as a CharacterSymbol
        // when the value expression looks like a Character(...) call;
        // otherwise it's a plain VariableSymbol.
        const valueText = valueNode?.text ?? '';
        if (node.type === 'define_statement' && /^Character\s*\(/.test(valueText)) {
          table.characters.push({
            ...base(node, nameNode.text),
            kind: 'character',
            initialValueExpr: valueText,
          });
        } else {
          table.variables.push({
            ...base(node, nameNode.text),
            kind: 'variable',
            declarationType: node.type === 'define_statement' ? 'define' : 'default',
            initialValueExpr: valueText,
          });
        }
        break;
      }
      case 'dollar_statement': {
        const exprNode = node.childForFieldName('expression');
        if (!exprNode) break;
        const match = exprNode.text.match(/^([a-zA-Z_][a-zA-Z0-9_.]*)\s*[+\-*/]?=(?!=)\s*(.+)/);
        if (!match) break;
        table.variables.push({
          ...base(node, match[1]),
          kind: 'variable',
          declarationType: 'implicit',
          initialValueExpr: match[2],
        });
        break;
      }
      case 'screen_statement': {
        const nameNode = node.childForFieldName('name');
        if (!nameNode) break;
        const parametersNode = node.childForFieldName('parameters');
        table.screens.push({
          ...base(node, nameNode.text),
          kind: 'screen',
          parameters: parametersNode ? [parametersNode.text] : [],
        });
        break;
      }
      case 'image_statement': {
        const nameNodes = node.children.filter(c => c.type === 'identifier');
        const valueNode = node.childForFieldName('value');
        if (nameNodes.length === 0) break;
        table.images.push({
          ...base(node, nameNodes.map(n => n.text).join(' ')),
          kind: 'image',
          initialValueExpr: valueNode?.text ?? '',
        });
        break;
      }
      case 'menu_statement': {
        const labelNode = node.childForFieldName('label');
        const choiceTexts = node.children
          .filter(c => c.type === 'menu_choice')
          .map(c => c.childForFieldName('text')?.text ?? '');
        table.menus.push({
          ...base(node, labelNode?.text ?? '<anonymous menu>'),
          kind: 'menu',
          choiceTexts,
        });
        break;
      }
      case 'transform_statement': {
        const nameNode = node.childForFieldName('name');
        if (!nameNode) break;
        table.transforms.push({ ...base(node, nameNode.text), kind: 'transform' });
        break;
      }
      case 'style_statement': {
        const nameNode = node.childForFieldName('name');
        const parentNode = node.childForFieldName('parent');
        if (!nameNode) break;
        table.styles.push({
          ...base(node, nameNode.text),
          kind: 'style',
          parent: parentNode?.text ?? null,
        });
        break;
      }
      default:
        break;
    }
  });

  return table;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- src/test/treeSitterSymbolTable.test.ts`
Expected: PASS on both tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tree-sitter/symbolTable.ts src/test/treeSitterSymbolTable.test.ts
git commit -m "feat: add symbol-table extraction layer over the tree-sitter AST"
```

---

## Task 13: Broader Vitest suite reusing existing fixtures

**Files:**
- Create: `src/test/treeSitterRenpy.test.ts`
- Modify: `src/test/mocks/sampleData.ts` (only if a needed fixture doesn't already exist — see Step 1)

**Interfaces:**
- Consumes: `parseBlock` (Task 11), `extractSymbolTable` (Task 12), existing fixture helpers from `src/test/mocks/sampleData.ts`.
- Produces: a broader regression suite exercising the full grammar surface against realistic multi-construct `.rpy` content, giving sub-project 2 a known-good baseline to compare against later.

- [ ] **Step 1: Check `src/test/mocks/sampleData.ts` for reusable `.rpy` content fixtures**

Run: `grep -n "createBlock\|createSampleAnalysisResult" src/test/mocks/sampleData.ts`

If a fixture there already contains multi-construct sample `.rpy` text (labels + menu + screen + say-statements) reused by `renpyAnalysis.test.ts`, note its exported name for reuse in Step 2 instead of writing new inline fixtures. If none exists in a directly reusable shape, proceed with the inline fixture in Step 2 as written (no modification to `sampleData.ts` needed).

- [ ] **Step 2: Write `src/test/treeSitterRenpy.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { parseBlock } from '@/lib/tree-sitter/parseBlock';
import { extractSymbolTable } from '@/lib/tree-sitter/symbolTable';

const SAMPLE_RPY = `
define e = Character("Eileen")
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
            text "Trust: [trust]"

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

    expect(table.characters.map(c => c.name)).toContain('e');
    expect(table.variables.map(v => v.name)).toContain('trust');
    expect(table.labels.map(l => l.name)).toContain('start');
    expect(table.screens.map(s => s.name)).toContain('hud');
    expect(table.transforms.map(t => t.name)).toContain('bounce');
    expect(table.menus.length).toBeGreaterThanOrEqual(1);
  });

  it('identifies the $ trust += 1 line as a python injection', async () => {
    const result = await parseBlock(SAMPLE_RPY);
    expect(result.pythonInjections.some(inj => inj.kind === 'dollar-statement')).toBe(true);
  });
});
```

- [ ] **Step 3: Run the full test file**

Run: `npm test -- src/test/treeSitterRenpy.test.ts`
Expected: all three tests PASS.

- [ ] **Step 4: Run the entire Vitest suite to confirm no regressions**

Run: `npm test`
Expected: all existing tests still pass (this task adds new files only; it does not touch `useRenpyAnalysis.ts` or any existing consumer, per the spec's explicit out-of-scope boundary).

- [ ] **Step 5: Commit**

```bash
git add src/test/treeSitterRenpy.test.ts
git commit -m "test: add full-surface tree-sitter-renpy regression suite"
```

---

## Self-Review Notes

- **Spec coverage:** Section 1 (scope) → Tasks 1, 11 boundary notes. Section 2 (layout) → Task 1 (package), Task 10 (vendor dir), Task 11/12 (`src/lib/tree-sitter/`). Section 3 (grammar design incl. indentation/error-recovery/triple-quoted note) → Tasks 2–8. Section 4 (injection mechanics) → Task 9, consumed in Task 11. Section 5 (build/bundling) → Task 10. Section 6 (`parseBlock()`/symbol table types) → Tasks 11–12, types copied verbatim. Section 7 (testing split) → corpus tests throughout Tasks 2–8, Vitest in Tasks 11–13. Section 8 (risks/out-of-scope) → explicitly not touched: no `useRenpyAnalysis.ts` changes, no Monaco/`EditorView.tsx` changes, no cross-block resolution, no injected-Python symbol extraction, no CI wiring for corpus tests, anywhere in this plan.
- **Placeholder scan:** no "TBD"/"TODO"/"handle appropriately" strings anywhere above; the one intentionally-still-`ERROR` case (Task 8, empty `menu:`) is explicitly justified rather than left vague.
- **Type consistency:** `ParsedBlock`/`PythonInjection` (Task 11) and `RenpySymbolTable`/`BaseSymbol`/`*Symbol` (Task 12) match spec Section 6's field names and types exactly; `parseBlock()`'s async signature is used consistently in every test (Tasks 11–13) via `await`.
