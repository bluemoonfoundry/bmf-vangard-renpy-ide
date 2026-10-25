; Language-injection points for `tree-sitter-renpy` (Task 9).
;
; `web-tree-sitter` does not execute `#set!` directives or run injection
; queries automatically (spec Section 4) — this file is data that
; `parseBlock.ts` (Task 11) reads and matches manually against a parsed
; tree to locate Python-injection spans. The `#set!` predicates below
; follow the standard tree-sitter-query convention (matching what
; Neovim/Zed/Helix expect from an `injections.scm`) purely for ecosystem
; portability/documentation; this project's own consumer does not execute
; them via a query engine.
;
; Injection point 1: python:/init python: block bodies (nms4.15). The whole
; body is one opaque `python_block` node under the statement's `body` field
; (the external scanner hands it over as a single token, from the first body
; line's first non-space character to the end of the last non-blank body
; line), so each block is one capture, parsed as one Python module. A comment
; on the header line (`init python: # setup`) is a separate child of the
; statement, outside `body`, and so is not captured. A header with nothing
; under it (`python:` being typed) has no `python_block` and no match.
;
; (Before nms4.15 the body was a hidden `_block` of Ren'Py statements, so
; these patterns listed every statement type a body could hold and relied on
; `injection.combined` to stitch them back together; valid Python such as
; docstrings or `with ... as` produced ERROR nodes there.)
((python_statement body: (python_block) @injection.content)
 (#set! injection.language "python"))

((init_python_statement body: (python_block) @injection.content)
 (#set! injection.language "python"))

; Injection point 2: one-line `$ expr` statements — a single Python
; expression/statement fragment, not a full module.
((dollar_statement expression: (expression) @injection.content)
 (#set! injection.language "python"))

; Injection point 3: screen-action / ATL-property / condition expressions
; — every other opaque `expression` node in the grammar, injected as a
; Python expression fragment (not a full module).
;
; `property` (screen-language widget properties/actions, and the bare
; condition/target expression reused by control-flow tags like `if`/`for`
; inside screen-language) carries its expression either under the `value`
; field (`action SetVariable(...)`) or as an unnamed child (a bare
; expression alternative, e.g. `if persistent.unlocked:` — see grammar.js's
; `property` rule). Omitting `field:` in the pattern below matches an
; `expression` child of `property` regardless of which alternative
; produced it, so one pattern covers both — no separate
; `screen_language_statement`-scoped pattern is needed since `property`
; nodes only ever occur there. A value that is one quoted string is a
; `string` child, not an `expression` (q85r), so it is not injected: it is
; Ren'Py text, whose `[var]` interpolations renpyWalk.ts reads.
((property (expression) @injection.content)
 (#set! injection.language "python"))

; Top-level and screen-language-reused control-flow conditions.
((if_statement condition: (expression) @injection.content)
 (#set! injection.language "python"))

((elif_clause condition: (expression) @injection.content)
 (#set! injection.language "python"))

((while_statement condition: (expression) @injection.content)
 (#set! injection.language "python"))

((menu_choice condition: (expression) @injection.content)
 (#set! injection.language "python"))

; ATL property/warper/duration values.
((atl_transform_property value: (expression) @injection.content)
 (#set! injection.language "python"))

((atl_with_statement warper: (expression) @injection.content)
 (#set! injection.language "python"))

((atl_time_statement duration: (expression) @injection.content)
 (#set! injection.language "python"))
