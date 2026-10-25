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
; NOTE ON NODE SHAPES: the grammar's shared `_block` rule (used by
; `python_statement`/`init_python_statement`) is a *hidden* rule, so it
; produces no node of its own — tree-sitter flattens its contents directly
; onto the parent, and `node-types.json` (static analysis) reports the
; `body` field as landing on the literal `:` token *and* on each
; individual top-level statement inside the block (`"multiple": true`).
; There is therefore no single node whose byte range covers "the entire
; python: body" as one contiguous span; the intent is to capture the full
; ordered set of the block's top-level statement nodes as multiple ranges
; within one match, using `#set! injection.combined` as the standard
; signal (used by e.g. heredoc-body/multi-part-string injections in other
; grammars) that a real injection-aware host should treat those ranges as
; one combined Python parse rather than N separate ones.
;
; VERIFIED DISCREPANCY: although `tree-sitter parse` prints `body:` on
; each of these nodes, a `body: (_)` (or `body: (_)+`) *query* pattern
; matches zero nodes here (checked empirically with `tree-sitter query`
; against a scratch `python:`/`init python:` block) — tree-sitter's field
; lookup table used by the query engine does not resolve fields applied to
; a hidden rule that itself contains a `repeat1`/`choice` (`_block`), even
; though the tree's own per-node field-name resolution (used by `parse`'s
; printer) does. Matching on the field name is therefore not viable here.
; Instead, the patterns below list a direct-child type alternation
; (exactly the grammar's `_statement` alternation, i.e. every concrete
; statement type `_block`'s `repeat1($._statement)` can produce) so the
; body's statement children are matched by type rather than by field —
; this reliably captures the same nodes without depending on the broken
; field lookup, and for `init_python_statement` it also correctly excludes
; the sibling `priority: (expression)` node (which is *not* part of the
; body and must not be treated as Python-injection content), since
; `expression` is not one of the alternated statement types.
; (Final-review fix I4/C1: `unknown_statement` was added to both
; alternations below. It is the node type that colon-opened Python headers
; inside a `python:` block — `def foo(a):`, `class C:`, `try:` — now parse
; as, so omitting it would silently drop those (and their entire indented
; bodies) from the injected Python span.)
;
; Injection point 1: python:/init python: block bodies — the block's
; top-level statements (there is no single whole-body node — see note
; above) are captured together and combined into one Python-module parse.
((python_statement
   [
     (call_statement) (camera_statement) (comment) (default_statement)
     (define_statement) (dollar_statement) (expression_statement)
     (for_statement) (hide_statement) (if_statement) (image_statement)
     (init_python_statement) (jump_statement) (label_statement)
     (layeredimage_statement) (menu_statement) (nvl_statement) (pass_statement)
     (play_statement) (python_statement) (queue_statement)
     (return_statement) (say_statement)
     (scene_statement) (screen_statement) (show_statement)
     (stop_statement) (style_statement) (transform_statement)
     (translate_statement) (unknown_statement) (voice_statement)
     (while_statement) (with_statement)
   ]+ @injection.content)
 (#set! injection.language "python")
 (#set! injection.combined))

((init_python_statement
   [
     (call_statement) (camera_statement) (comment) (default_statement)
     (define_statement) (dollar_statement) (expression_statement)
     (for_statement) (hide_statement) (if_statement) (image_statement)
     (init_python_statement) (jump_statement) (label_statement)
     (layeredimage_statement) (menu_statement) (nvl_statement) (pass_statement)
     (play_statement) (python_statement) (queue_statement)
     (return_statement) (say_statement)
     (scene_statement) (screen_statement) (show_statement)
     (stop_statement) (style_statement) (transform_statement)
     (translate_statement) (unknown_statement) (voice_statement)
     (while_statement) (with_statement)
   ]+ @injection.content)
 (#set! injection.language "python")
 (#set! injection.combined))

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
; nodes only ever occur there.
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
