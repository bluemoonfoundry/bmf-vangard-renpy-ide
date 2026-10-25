// lssz: pieces of the string-aware opaque `expression` token (see its rule
// below). A quoted string is lexed as one unit, so a '#' (or ':') inside it
// never ends the expression. Escapes (`\"`, `\\`) are honoured; nothing here
// crosses a line end, so an unterminated quote on a half-typed line stops at
// the end of that line.
const EXPR_DQ_STRING = /"([^"\\\r\n]|\\[^\r\n])*"/;
const EXPR_SQ_STRING = /'([^'\\\r\n]|\\[^\r\n])*'/;
// Unterminated forms (no closing quote, optionally a dangling '\'). Only
// valid as the *last* piece of the token: anywhere else the next character
// would be the quote that a terminated reading closes on, and letting it
// reopen a string instead would run the token over a real `# comment`.
const EXPR_DQ_UNTERMINATED = /"([^"\\\r\n]|\\[^\r\n])*\\?/;
const EXPR_SQ_UNTERMINATED = /'([^'\\\r\n]|\\[^\r\n])*\\?/;
// First/last character outside a string: not blank, not ':', not '#'.
const EXPR_EDGE_CHAR = /[^\r\n#:'" \t]/;
// Any other character outside a string: anything but '#' and quotes.
const EXPR_INNER_CHAR = /[^\r\n#'"]/;

// aj2e: pieces of the `at`-clause value (`_at_expr_blob`). Outside brackets
// a value item is any run of characters except blanks, ',', ':', '#',
// quotes and brackets; a quoted string or a bracket group is one piece of
// it. Inside a group anything goes except '#', a quote or a line end (a
// string is one piece there too), and groups nest up to AT_GROUP_DEPTH
// levels: a token is a regular language, so the nesting has to be bounded.
const AT_ITEM_CHAR = /[^\r\n#:'" \t,()\[\]{}]/;
const AT_GROUP_CHAR = /[^\r\n#'"()\[\]{}]/;
const AT_GROUP_DEPTH = 4;
function atGroup(depth) {
  const pieces = [AT_GROUP_CHAR, EXPR_DQ_STRING, EXPR_SQ_STRING];
  if (depth > 1) pieces.push(atGroup(depth - 1));
  return seq(/[(\[{]/, repeat(choice(...pieces)), /[)\]}]/);
}
function atItem() {
  return repeat1(choice(AT_ITEM_CHAR, EXPR_DQ_STRING, EXPR_SQ_STRING, atGroup(AT_GROUP_DEPTH)));
}

// nms4.14: operators that may join items of a screen property value
// (`_screen_value`) with blanks around them. An operator joins only with a
// blank on each side: `100 + offset` is one value, but in `spacing -10` or
// `size +2` the sign belongs to the value after the property name. (Symbol
// operators with no blanks, `a+b`, are plain item characters.) `not` may
// also prefix an item.
const SCREEN_BINARY_OP =
  /[ \t]+(\*\*|\/\/|<<|>>|<=|>=|<>|==|!=|[+\-*\/%@&|^<>]|and|or|in|is|not[ \t]+in|is[ \t]+not)[ \t]+/;
const SCREEN_NOT_PREFIX = /(not[ \t]+)+/;
function screenValue() {
  return seq(
    optional(SCREEN_NOT_PREFIX),
    atItem(),
    repeat(seq(SCREEN_BINARY_OP, optional(SCREEN_NOT_PREFIX), atItem())),
  );
}

// nms4.15: a python header's ':' and its opaque body. See the comment after
// `init_python_statement`'s rule.
function pythonBody($) {
  return seq(
    $._block_colon,
    optional(seq($._newline, optional(seq(field('body', $.python_block), $._newline)))),
  );
}

module.exports = grammar({
  name: 'renpy',

  externals: $ => [
    $._newline,
    $._indent,
    $._dedent,
    // nms4.15: the whole body of a `python:` / `init python:` block, as one
    // opaque token (see `pythonBody` and scanner.c's scan_python_block).
    $.python_block,
  ],

  extras: $ => [
    /[ \t\r]/,
  ],

  word: $ => $.identifier,

  // Task 8 fix (post-review): making `say_statement`'s trailing `$._newline`
  // optional (see the comment on `say_statement` below) made its own
  // optional `with`-clause nullable at the exact point where `'with'` is
  // also a valid FOLLOW token for `say_statement` (any top-level
  // `with_statement` can immediately follow any statement). That's a real,
  // not merely cosmetic, static ambiguity: for input like `eileen "hi" with
  // dissolve\n`, the grammar as written now admits two distinct, fully
  // valid parses — (a) one `say_statement` whose own `with`-clause consumes
  // "with dissolve", or (b) a `say_statement` that ends right after the
  // string (using its now-optional, zero-width newline) followed by a
  // separate top-level `with_statement` that consumes "with dissolve\n".
  // `prec.dynamic` on `say_statement`'s with-clause below picks (a)
  // whenever both are viable, matching real Ren'Py semantics: an inline
  // `with` immediately after a say's string always belongs to that say
  // statement, never to a following statement.
  // A screen line's `action Start()` is reducible either as one `name
  // value` pair or as two positional properties (final-review fix C3 made
  // a lone identifier a valid positional value). That's a genuine LR
  // conflict, not a lexical one, so it must be declared here and let GLR
  // explore both; the `prec.dynamic` on `_keyword_property` then picks the
  // `name value` reading whenever it's viable (see `_keyword_property`).
  conflicts: $ => [
    [$.say_statement],
    [$._positional_property, $._keyword_property],
  ],

  rules: {
    // Blank lines before the first statement (3nk7): the scanner emits NEWLINE for
    // them, but nothing else accepts a NEWLINE at file start. Hidden, so no tree changes.
    source_file: $ => seq(optional($._newline), repeat($._statement)),

    // "Simple" (non-block-taking) statements consume their own trailing
    // `_newline` explicitly (the external scanner only emits NEWLINE when
    // the grammar asks for it — see scanner.c); block-taking statements
    // terminate via `_block` instead (which owns its own trailing
    // newline/indent/dedent sequence) and don't wrap here.
    _statement: $ => choice(
      $._comment_line,
      $.label_statement,
      $.jump_statement,
      $.call_statement,
      $.return_statement,
      $.pass_statement,
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
      $.show_screen_statement,
      $.hide_screen_statement,
      $.call_screen_statement,
      $.with_statement,
      $.play_statement,
      $.queue_statement,
      $.stop_statement,
      $.voice_statement,
      $.screen_statement,
      $.transform_statement,
      $.translate_statement,
      $.style_statement,
      $.camera_statement,
      $.layeredimage_statement,
      $.nvl_statement,
      $.expression_statement,
      // Final-review fix I4: MUST stay last — it is the honest-failure
      // catch-all for keyword-led lines nothing above claims. See its rule
      // definition at the bottom of this file.
      $.unknown_statement,
    ),

    // `[^\r\n]` rather than `.`: `.` matches '\r', which would fold a CRLF
    // line's carriage return into the comment text.
    comment: $ => token(seq('#', /[^\r\n]*/)),

    // A comment-only line inside a block body. Every body (statements, menu
    // choices, screen language, ATL, style and layeredimage properties)
    // accepts it, so a comment never ends a block (nms4.25). Hidden, so the
    // body just gains a `(comment)` child.
    _comment_line: $ => seq($.comment, $._newline),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    // Opaque Python-ish expression — content is handed to the injected
    // tree-sitter-python grammar via injections.scm (Task 9), not
    // decomposed here per the spec's Q1-B granularity decision.
    //
    // Final-review fix C1: this regex used to be `/[^\n#:]+/`, excluding
    // ':' outright so the token could never swallow the trailing colon
    // that introduces a `_block` body (`if x:`, `while x:`, a menu
    // choice's condition, ...). That exclusion was correct for those
    // condition positions but catastrophic for the many *value* positions
    // that reuse this same token (`define`/`default`/`image` values,
    // `$` statements, screen/ATL property values, and — via
    // `expression_statement` — every line inside a `python:` block, the
    // grammar's headline injection point): colons are pervasive in real
    // Python values (`{"a": 1}` dicts, `lambda x: x`, slices `a[1:2]`,
    // annotations), and excluding them turned all of that into ERROR
    // nodes.
    //
    // Rather than fork into two tokens (one colon-excluding for
    // conditions, one colon-permitting for values) — which puts two
    // equal-precedence, heavily-overlapping greedy regexes in direct
    // lexical competition wherever both happen to be valid — the regex
    // now permits ':' *inside* the match but forbids it as the match's
    // final character (`/[^\r\n#]*[^\r\n#: \t]/`). Tree-sitter's lexer takes the
    // longest match that satisfies the pattern, so:
    //   - `if d == {1: 2}:`   -> expression = ` d == {1: 2}`, the block's
    //     ':' is left for `_block`, exactly as before the fix;
    //   - `$ x = {"a": 1}`    -> expression = ` x = {"a": 1}`, previously
    //     an ERROR;
    //   - `f = lambda x: x`   -> the whole value, previously an ERROR.
    // A value that genuinely *ends* in ':' is by construction a
    // block-opening header (`def foo(a):`, `class C:`, `try:`) and is
    // handled by `unknown_statement`'s optional `_block` instead.
    //
    // The one thing this must never do is end on a ':' — that colon is
    // always the grammar's, never the expression's. The final character
    // also may not be whitespace (nms4.7 / a8m8): otherwise `if x: ` (a
    // trailing space) or a CRLF line's `if x:\r` ends on ' '/'\r', so the
    // longest match runs straight past the block colon and swallows it.
    // '\r' is excluded everywhere, like '\n', so CRLF input lexes the same
    // as LF input; trailing blanks are left to `extras`.
    //
    // Explicit `prec(-1, ...)`: this task added `expression_statement` as
    // a last-resort `_statement` fallback (see below) plus `choice($.identifier,
    // $.expression)` for say_statement's character field. Both put this
    // very greedy, unbounded regex in direct lexical competition with
    // narrower tokens — statement keywords (`label`, `jump`, `if`, ...)
    // and `identifier` — at the same starting position. Tree-sitter's
    // default lexical conflict resolution is "longest match wins," and
    // `expression` (which has no notion of word/keyword boundaries) will
    // always match at least as much text as those narrower alternatives,
    // so without an explicit precedence it wins every such contest —
    // swallowing whole keyword-led lines (e.g. `label start:`) into a
    // bogus `expression_statement` and swallowing say_statement's
    // `character` + `attributes` + `text` into one `character: (expression)`
    // token. Giving `expression` *lower* precedence than the grammar's
    // default (0) makes precedence (checked before length) decide these
    // contests instead: identifier/keyword tokens win whenever they also
    // match, and `expression` is only actually chosen when it's the sole
    // viable token at that position — which is every other place it's
    // used in this grammar.
    //
    // The first character must be non-blank too. Leading blanks belong to
    // `extras`; a token that can *start* with a space competes with the
    // extras skip and, with the whitespace-free final class above, made the
    // lexer fold the separating space into the following `identifier`
    // (`label start:` gave name " start").
    //
    // lssz: the token is string-aware. A single- or double-quoted string is
    // one piece of it, so `define e = Character("E", color="#c8ffc8")`,
    // `image black = Solid("#000")` and `$ c = "#fff"  # x` keep their
    // quoted '#' (and quoted ':'), while a '#' outside quotes still ends the
    // token and starts a comment. The edge rules above apply to the
    // characters outside strings; a string may itself be the first or last
    // piece. An unterminated quote is accepted only as the final piece and
    // stops at the end of the line (see the EXPR_* constants at the top).
    // A one-line triple-quoted string (`"""x # y"""`) lexes as `""`, then
    // `"x # y"`, then `""`, so it also keeps its '#'.
    expression: $ => token(prec(-1, choice(
      EXPR_DQ_UNTERMINATED,
      EXPR_SQ_UNTERMINATED,
      seq(
        choice(EXPR_EDGE_CHAR, EXPR_DQ_STRING, EXPR_SQ_STRING),
        optional(seq(
          repeat(choice(EXPR_INNER_CHAR, EXPR_DQ_STRING, EXPR_SQ_STRING)),
          choice(EXPR_EDGE_CHAR, EXPR_DQ_STRING, EXPR_SQ_STRING, EXPR_DQ_UNTERMINATED, EXPR_SQ_UNTERMINATED),
        )),
      ),
    ))),

    // The ':' that opens an indented body, plus an optional trailing comment
    // on the same line (`label start: # note`, `menu: # pick one`,
    // `if x:  # TODO`) — nms4.9. Comments are not `extras` in this grammar,
    // so without this the comment ended the header's line on its own: the
    // header reduced with no body, the comment became a top-level sibling,
    // and the indented body that followed was silently re-parented to the
    // header's parent (hasError === false, wrong tree). The comment node
    // lands as a child of the block-opening statement. Every block-opening
    // ':' in the grammar goes through this rule.
    _block_colon: $ => prec.right(seq(':', optional($.comment))),

    // Shared block body used by every block-taking statement: `label foo:`
    // / `if x:` / `menu:` etc.
    //
    // Task 8 fix: this used to be `seq(':', optional(seq($._newline,
    // $._indent, repeat1($._statement), $._dedent)))` — wrapping the
    // *whole* newline-through-dedent sequence in one `optional(...)`. That
    // looks like it should already handle "header with no body" (the case
    // this task is hardening), but it doesn't: whenever a trailing newline
    // is physically present after the ':' (the overwhelmingly common case —
    // a user who just typed `label foo:` and hit Enter, or any header
    // immediately followed by a sibling statement at the same indent), the
    // external scanner has no choice but to hand that newline to the parser
    // as a real `_newline` token (it's the only external token that can
    // possibly be valid there), which forces entry into the optional's
    // *inner* `seq` before the parser can know whether an `_indent` will
    // actually follow. When it doesn't (no body), `_indent` fails to match
    // and that already-consumed `_newline` has nowhere to go, surfacing as
    // a genuine `ERROR` node — verified empirically: `label start:` followed
    // by another top-level statement at the same indent, or by EOF, produced
    // an `ERROR` for exactly this reason before this fix, even though the
    // brief describes this case as already working.
    //
    // The fix separates "does a trailing newline get consumed" from "does a
    // body follow": the first `choice` arm is the body-present path
    // (newline + indent + statements + dedent, unchanged from before); the
    // second arm handles the body-absent path by consuming an *optional*
    // trailing newline on its own, with no expectation of an indent after
    // it. `optional` (not required) on that second arm's newline also covers
    // a header at the literal end of a buffer with no trailing newline
    // yet — another real half-typed editing state (Monaco doesn't force a
    // final newline while the user is still typing the line).
    _block: $ => seq(
      $._block_colon,
      choice(
        seq($._newline, $._indent, repeat1($._statement), $._dedent),
        optional($._newline),
      ),
    ),

    // nms4.10: Ren'Py local labels. `.sub` is relative to the last global
    // label (`label start:` ... `label .sub:` defines `start.sub`), and
    // `start.sub` names it from anywhere. A dedicated token (aliased to
    // `identifier`, so tree shapes are unchanged for plain names) rather
    // than `seq(identifier, '.', identifier)` keeps the whole name one leaf
    // whose text is the label as written. It requires a '.', so it never
    // competes with `identifier` or keywords for plain names; it outranks
    // the prec(-1) `expression` that `jump`/`call` targets also accept, so
    // `jump .sub` is a label, not an opaque expression.
    _dotted_label_name: $ => token(choice(
      seq('.', /[a-zA-Z_][a-zA-Z0-9_]*/),
      seq(/[a-zA-Z_][a-zA-Z0-9_]*/, '.', /[a-zA-Z_][a-zA-Z0-9_]*/),
    )),
    _label_name: $ => choice($.identifier, alias($._dotted_label_name, $.identifier)),

    // nms4.12: dotted store names on `define`/`default` (`default
    // persistent.seen = False`, `define config.name = ...`,
    // `define gui.text_size = 22`). Same aliasing approach as
    // `_dotted_label_name`: one `identifier` leaf whose text is the full
    // dotted name.
    _dotted_store_name: $ => token(seq(
      /[a-zA-Z_][a-zA-Z0-9_]*/,
      repeat1(seq('.', /[a-zA-Z_][a-zA-Z0-9_]*/)),
    )),
    _store_name: $ => choice($.identifier, alias($._dotted_store_name, $.identifier)),

    label_statement: $ => seq(
      'label',
      field('name', $._label_name),
      optional(field('parameters', $.parameter_list)),
      optional(choice('hide', 'global')),
      $._block,
    ),

    // The parenthesized parameter blob needs a *different* stop set than
    // top-level `expression` (it must stop at the closing ')' rather than
    // at ':', since default values may legitimately contain ':' — e.g.
    // dict/slice literals — but never an unbalanced ')'). It's aliased to
    // `expression` so the tree still reports a single opaque expression
    // node type everywhere, per the spec's Q1-B granularity decision.
    parameter_list: $ => seq('(', optional(alias($._parameter_blob, $.expression)), ')'),
    _parameter_blob: $ => /[^\r\n#)]+/,

    jump_statement: $ => seq(
      'jump',
      optional('expression'),
      field('target', choice($._label_name, $.expression)),
      $._newline,
    ),

    call_statement: $ => seq(
      'call',
      optional('expression'),
      field('target', choice($._label_name, $.expression)),
      optional(seq('from', field('from_label', $._label_name))),
      $._newline,
    ),

    return_statement: $ => seq(
      'return',
      optional(field('value', $.expression)),
      $._newline,
    ),

    // nms4.21: `pass` (a no-op, common as a menu choice body). It used to
    // parse as an expression_statement naming a variable `pass`.
    pass_statement: $ => seq('pass', $._newline),

    menu_statement: $ => seq(
      'menu',
      optional(field('label', $.identifier)),
      $._block_colon,
      $._newline,
      $._indent,
      repeat1(choice($._comment_line, $.menu_choice, $.menu_caption, $.menu_set)),
      $._dedent,
    ),

    // nms4.22: a say-style line with no colon inside a menu is its caption
    // (`"Where?"`, `e "Where?"`), shown while the choices are on screen.
    // A choice always ends in ':' (or `if <cond>:`), so the two are told
    // apart at the end of the string.
    menu_caption: $ => seq(
      optional(seq(
        field('character', $.identifier),
        optional(field('attributes', repeat1($.identifier))),
      )),
      field('text', $.string),
      $._newline,
    ),

    // nms4.22: `set <expr>` names a set of choice texts already picked;
    // those choices are hidden.
    menu_set: $ => seq('set', field('expression', $.expression), $._newline),

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

    // `variable` sits between the `for` and `in` keywords on the same
    // line, so it can't use the flat opaque-expression regex verbatim —
    // that regex has no notion of keyword boundaries and would swallow
    // straight through `in` and consume `iterable` too (tree-sitter's
    // regex engine doesn't support lookahead, so a boundary can't be
    // expressed that way either). For-loop targets are syntactically
    // restricted to (comma-separated) names in both Python and Ren'Py, so
    // a name-list token is both accurate and unambiguous here; `token()`
    // flattens it to a single leaf so it aliases cleanly onto the same
    // opaque `expression` node type used everywhere else.
    for_statement: $ => seq(
      'for',
      field('variable', alias($._for_target_blob, $.expression)),
      'in',
      field('iterable', $.expression),
      $._block,
    ),

    _for_target_blob: $ => token(seq(
      /[a-zA-Z_][a-zA-Z0-9_]*/,
      repeat(seq(/[ \t]*,[ \t]*/, /[a-zA-Z_][a-zA-Z0-9_]*/)),
    )),

    // Character is a single identifier (or dotted/expression-like name);
    // attributes are the remaining identifiers before the string. Nesting
    // `attributes` inside the same `optional(seq(...))` as `character`
    // (rather than two independent top-level `optional`s, as the brief's
    // snippet had them) removes a real grammar ambiguity: with two
    // independent optionals, "eileen happy \"...\"" could parse either as
    // character=eileen/attributes=[happy] *or* as character-absent/
    // attributes=[eileen, happy] — both grammatically valid, which
    // tree-sitter flags as an unresolved conflict. Nested this way,
    // `character` is forced to consume exactly the first identifier
    // whenever the who/attributes clause is present at all, and there's
    // only one way to parse the line.
    // Task 8 fix (post-review): the trailing `$._newline` used to be
    // required, unconditionally. That's fine once a real newline byte
    // exists in the buffer, but it misses the single most common
    // "actively typing" trigger for a live-analysis tool: the user is
    // mid-line, cursor at the very end of the buffer, no `\n` byte typed
    // yet at all (e.g. `eileen "Hello, how are` with nothing after it —
    // not even a line ending). The external scanner's EOF branch only
    // emits a synthetic NEWLINE when `saw_newline` was true in that same
    // scan call (see scanner.c's `if (lexer->eof(lexer))` block); with no
    // `\n` byte present, `saw_newline` is false, no NEWLINE token is ever
    // produced, and a required `$._newline` here can never be satisfied —
    // surfacing as `ERROR` even though the say-statement itself (character,
    // attributes, text) is otherwise fully formed. Making the newline
    // `optional(...)` (mirroring `_block`'s identical fix for the same
    // "end of buffer, no trailing newline yet" case) lets a say-statement
    // at the literal end of a buffer resolve cleanly instead.
    say_statement: $ => seq(
      optional(seq(
        field('character', choice($.identifier, $.expression)),
        optional(field('attributes', repeat1($.identifier))),
      )),
      field('text', $.string),
      optional(prec.dynamic(1, seq('with', field('transition', $.expression)))),
      optional($._newline),
    ),

    // Injection point (Task 9): the body is handed to tree-sitter-python via
    // injections.scm. Ren'Py's header is `python [early] [hide] [in store]:`.
    python_statement: $ => seq(
      'python',
      optional('early'),
      optional('hide'),
      optional(seq('in', field('store', $._store_name))),
      pythonBody($),
    ),

    // `field()` on a bare, unnamed regex produces an invisible child — the
    // tree-sitter S-expression printer only shows *named* nodes, and a
    // raw `/-?[0-9]+/` referenced inline (not via a rule) is anonymous
    // regardless of being field-wrapped (confirmed empirically: with the
    // brief's literal `field('priority', /-?[0-9]+/)`, `init 5 python:`
    // parsed with no error but the priority simply never appeared in the
    // tree). Aliasing it to the shared `$.expression` node type — the
    // same opaque-value convention used for every other value slot in
    // this grammar — makes it a real, visible, named child.
    init_python_statement: $ => seq(
      'init',
      optional(field('priority', alias(/-?[0-9]+/, $.expression))),
      'python',
      optional('early'),
      optional('hide'),
      optional(seq('in', field('store', $._store_name))),
      pythonBody($),
    ),

    // nms4.15: a Python body is opaque. It used to be an ordinary `_block`
    // of Ren'Py statements, so valid Python (docstrings, `with ... as`,
    // decorators, or a name like `queue`/`scene` that is a Ren'Py keyword)
    // produced ERRORs, and an ERROR could end the body early and strip the
    // following label of its own body. Now the external scanner hands the
    // whole body over as one `python_block` token: it runs from the first
    // body line's first non-space character to the end of the last non-blank
    // body line, and the body ends before the first code line indented no
    // deeper than the header unless that line continues an open bracket,
    // triple-quoted string or backslash (Ren'Py joins those into one logical
    // line). Blank and comment-only lines never end it, at any indentation;
    // a comment no deeper than the header is only kept in the token when a
    // deeper body line follows it, so a trailing one stays outside. No indent
    // is pushed, so the token is followed by an ordinary NEWLINE, like a
    // simple statement.
    //
    // The header's own NEWLINE comes first, as for every block header. If no
    // deeper line follows (a half-typed `python:` before more code or at
    // EOF) the scanner emits no `python_block` and the statement just ends.
    // The newline is optional for a buffer that ends on the colon (the
    // scanner synthesizes an EOF NEWLINE, but this mirrors `_block`).
    // `pythonBody` is a JS helper, not a hidden rule, so that `body` sits
    // directly on the statement: the query engine does not resolve a field
    // set inside a hidden rule (see injections.scm), and injections.scm
    // matches `body: (python_block)`.

    // Injection point (Task 9): the expression after `$` is opaque here.
    // Unlike block-taking statements, this is a "simple" statement per the
    // `_statement` comment's convention, so it must consume its own
    // trailing `_newline` explicitly — the brief's snippet omitted this,
    // which left the newline unconsumed (extras only cover space/tab/cr,
    // not '\n') and produced a parse error on the following line.
    dollar_statement: $ => seq('$', field('expression', $.expression), $._newline),

    define_statement: $ => seq(
      'define',
      field('name', $._store_name),
      '=',
      field('value', $.expression),
      $._newline,
    ),

    default_statement: $ => seq(
      'default',
      field('name', $._store_name),
      '=',
      field('value', $.expression),
      $._newline,
    ),

    // `name` is a whitespace-separated run of identifiers (e.g. `eileen
    // happy`); using the shared `$.expression` regex for `value` here is
    // fine because it's preceded by a required '=' token, which the
    // expression regex's stop set doesn't include, so there's no
    // swallowing hazard the way there was for `parameter_list`.
    // nms4.23: or `image logo:` followed by an ATL body, carried in `atl`
    // the same way show/scene carry an inline ATL block.
    image_statement: $ => seq(
      'image',
      field('name', repeat1($.identifier)),
      choice(
        seq('=', field('value', $.expression), $._newline),
        field('atl', $._atl_block),
      ),
    ),

    // `at_expr` is a comma-separated transform list (e.g. `at right` or
    // `at right, appear`; since aj2e also calls, see `_at_expr_blob`), reusing the same narrow-blob
    // technique as `_for_target_blob` above rather than the shared
    // `$.expression` regex. This matters because `at_expr` is *not* the
    // last optional clause in scene/show_statement — `as`/`with` clauses
    // can follow it — and `$.expression`'s stop set (only `#`/`:`/'\n')
    // has no notion of a keyword boundary, so it would greedily swallow
    // straight through " with dissolve" as part of the at-expression
    // (verified: this happened with the brief's literal `$.expression`
    // field before this fix). A comma-list token naturally stops at the
    // first following space that isn't part of a `, name` continuation,
    // which is exactly the boundary we need here.
    // Final-review fix I5: both rules used to end in a bare, required
    // `$._newline`, so an *inline* ATL block attached directly to the
    // statement — `show eileen:` / `    xalign 0.5`, extremely common real
    // Ren'Py that avoids needing a separate named `transform` — produced a
    // whole-statement ERROR. `_atl_block` (shared with
    // `transform_statement`, whose body shape it was factored out of) is
    // now offered as an alternative terminator to the plain newline.
    scene_statement: $ => seq(
      'scene',
      optional(field('image', repeat1($.identifier))),
      optional(seq('at', field('at_expr', alias($._at_expr_blob, $.expression)))),
      optional(seq('with', field('transition', $.expression))),
      choice($._newline, field('atl', $._atl_block)),
    ),

    show_statement: $ => seq(
      'show',
      field('image', repeat1($.identifier)),
      optional(seq('at', field('at_expr', alias($._at_expr_blob, $.expression)))),
      optional(seq('as', field('as_name', $.identifier))),
      optional(seq('with', field('transition', $.expression))),
      choice($._newline, field('atl', $._atl_block)),
    ),

    // aj2e: each comma-separated item may be a call or any other
    // expression without top-level blanks (`at Transform(xzoom=-1.0),
    // right`, `at Transform(matrixcolor=TintMatrix("#f00"))`). Blanks are
    // allowed only around the top-level commas and inside brackets, so the
    // token still ends at the blank before a following `with`/`as` keyword
    // (or `behind`/`onlayer`/`zorder`, which this grammar does not parse
    // yet), at a top-level ':' that opens an inline ATL block (`show e at
    // left:`), at an unquoted '#', and at the end of the line. Strings are
    // one piece, as in `expression` (lssz). Not supported: top-level
    // operators with blanks around them (`at a if c else b`) and brackets
    // nested deeper than AT_GROUP_DEPTH.
    _at_expr_blob: $ => token(seq(
      atItem(),
      repeat(seq(/[ \t]*,[ \t]*/, atItem())),
    )),

    // nms4.11: `show screen` / `hide screen` / `call screen`. Without these,
    // `show screen hud` parsed silently as a show_statement of an image
    // named `screen hud`, and `call screen inv(...)` was an ERROR. `screen`
    // is a keyword (screen_statement), so after `show`/`hide`/`call` the
    // lexer returns it as such and these rules win; `show screen_bg` is
    // still an ordinary identifier. Arguments reuse `parameter_list` (an
    // opaque blob up to the first ')'), so nested parentheses in arguments
    // are not supported, the same limitation label parameters have.
    show_screen_statement: $ => seq(
      'show',
      'screen',
      field('name', $.identifier),
      optional(field('arguments', $.parameter_list)),
      optional('nopredict'),
      optional(seq('with', field('transition', $.expression))),
      $._newline,
    ),

    hide_screen_statement: $ => seq(
      'hide',
      'screen',
      field('name', $.identifier),
      optional(seq('with', field('transition', $.expression))),
      $._newline,
    ),

    call_screen_statement: $ => seq(
      'call',
      'screen',
      field('name', $.identifier),
      optional(field('arguments', $.parameter_list)),
      optional('nopredict'),
      optional(seq('with', field('transition', $.expression))),
      $._newline,
    ),

    hide_statement: $ => seq(
      'hide',
      field('image', repeat1($.identifier)),
      optional(seq('with', field('transition', $.expression))),
      $._newline,
    ),

    with_statement: $ => seq(
      'with',
      field('transition', $.expression),
      $._newline,
    ),

    // nms4.20: audio statements. Before these existed, `play music "a.ogg"`
    // parsed as dialogue spoken by `play` and `stop music` as an
    // unknown_statement. The file is a bounded value (a string, a dotted
    // name, or a bracketed list) rather than the greedy `expression`, which
    // would run on through the option clauses; the clauses (`fadein 1.0`,
    // `loop`, `if_changed`, `volume 0.5`, ...) are kept as one opaque
    // `options` expression.
    play_statement: $ => seq(
      'play',
      field('channel', $.identifier),
      field('file', $._audio_file),
      optional(field('options', $.expression)),
      $._newline,
    ),

    queue_statement: $ => seq(
      'queue',
      field('channel', $.identifier),
      field('file', $._audio_file),
      optional(field('options', $.expression)),
      $._newline,
    ),

    stop_statement: $ => seq(
      'stop',
      field('channel', $.identifier),
      optional(field('options', $.expression)),
      $._newline,
    ),

    // `voice "v.ogg"`, or `voice sustain` (keep the previous line's voice
    // playing).
    voice_statement: $ => seq(
      'voice',
      choice('sustain', field('file', $._audio_file)),
      $._newline,
    ),

    _audio_file: $ => choice(
      $.string,
      alias($._audio_name, $.expression),
      alias($._audio_list, $.expression),
    ),

    // `main_theme`, `audio.theme`.
    _audio_name: $ => token(seq(
      /[a-zA-Z_][a-zA-Z0-9_]*/,
      repeat(seq('.', /[a-zA-Z_][a-zA-Z0-9_]*/)),
    )),

    // `["a.ogg", "b.ogg"]`. String-aware so a '#' inside a quoted file name
    // is not read as a comment.
    _audio_list: $ => token(seq(
      '[',
      repeat(choice(
        /[^\]"'\r\n]/,
        seq('"', repeat(choice(/[^"\\\r\n]/, /\\./)), '"'),
        seq("'", repeat(choice(/[^'\\\r\n]/, /\\./)), "'"),
      )),
      ']',
    )),

    // Task 8: mirrors `_block`'s body-optional fix (see its comment above)
    // rather than delegating to `_block` itself, because a screen's body is
    // `repeat1($.screen_language_statement)` (plus comment lines), not `repeat1($._statement)`.
    // Before this fix, `screen bar():` with no body yet (a very common
    // half-typed editing state — user has just opened the block) produced a
    // whole-statement `ERROR` (verified empirically), not a clean empty
    // `screen_statement`, because the required `$._newline, $._indent, ...`
    // sequence had no fallback for "newline consumed, no indent follows."
    screen_statement: $ => seq(
      'screen',
      field('name', $.identifier),
      optional(field('parameters', $.parameter_list)),
      $._block_colon,
      choice(
        seq($._newline, $._indent, repeat1(choice($._comment_line, $.screen_language_statement)), $._dedent),
        optional($._newline),
      ),
    ),

    // One shared shape for every screen-language widget/control-flow
    // construct (if/for/use/frame/vbox/button/text/imagemap/...) since
    // Ren'Py screen-language is structurally uniform: a tag, optional
    // positional/keyword properties, and an optional indented body. This
    // is a deliberate spec decision — do not split into per-widget rule
    // types even though it would look tidier; the point is that the
    // uniform shape is sufficient to represent every widget.
    //
    // nms4.14: the control-flow tags `if`/`elif`/`for`/`while`/`showif`
    // take one Python expression running up to the block colon (`for i in
    // items:`, `if a and b > 2:`, `for i, x in enumerate(xs):`) instead of
    // a property list. That expression is the line's single `property`
    // (aliased, so it is `(property (expression))` like a positional value
    // and `injections.scm` needs no new pattern), and the tag is aliased to
    // `identifier` so `widget_tag` keeps its node type. Matching the tags
    // as keywords here is what stops `for i in items` splitting into
    // properties `i`, `in`, `items`. `else` takes nothing and stays a plain
    // widget tag.
    screen_language_statement: $ => choice(
      seq(
        field('widget_tag', $.identifier),
        repeat(field('properties', alias($._positional_property, $.property))),
        repeat(field('properties', alias($._keyword_property, $.property))),
        $._screen_line_end,
      ),
      seq(
        field('widget_tag', alias(choice('if', 'elif', 'for', 'while', 'showif'), $.identifier)),
        field('properties', alias($._screen_condition, $.property)),
        $._screen_line_end,
      ),
    ),

    _screen_condition: $ => seq($.expression),

    // Every screen_language_statement must consume exactly one trailing
    // `_newline` of its own, mirroring the convention "simple" `_statement`s
    // use (see the `_statement` comment above) — this rule has no required
    // leading `:`, so unlike `if_statement`/`while_statement`/etc. it can't
    // just delegate to `_block`. Without the newline there is no marker
    // between sibling widgets on the same indent level: the external
    // scanner only emits a NEWLINE token when the grammar asks for one at
    // that position (see scanner.c), so two adjacent widgets (e.g. `text
    // "Welcome"` then `if ...:`) become indistinguishable from one widget
    // with extra properties — a genuine `tree-sitter generate` conflict.
    // Requiring the newline (or the block's own internal `_newline` right
    // after `:`) means the parser always knows where one statement ends.
    _screen_line_end: $ => choice(
      $._newline,
      seq($._block_colon, $._newline, $._indent, repeat1(choice($._comment_line, $.screen_language_statement)), $._dedent),
    ),

    // A screen line's properties are positional values (`text "x"`,
    // `textbutton i.name`, `use other_screen`, `add Solid("#000")`)
    // followed by `name value` keyword pairs (`action Start()`, `size 20`),
    // in that order, as Ren'Py's screen parser reads them. Both kinds are
    // `property` nodes; a keyword pair has `name`/`value` fields and a
    // positional value is a bare `expression` (or, q85r, `string`) child.
    //
    // nms4.14: a value is one Python expression (`_screen_value` below)
    // that ends where the next property name starts or at the end of the
    // line, so `text "x" size 20 xalign 0.5` is three properties and
    // `textbutton i.name action SetScreenVariable("sel", i)` is two. Before
    // this, a value was the greedy `expression` (ran to the end of the
    // line) or `_bare_expr_head` (stopped at the first blank, even inside
    // brackets).
    //
    // Final-review fix C3: a value may be a single word (`use
    // other_screen`, `text some_var`, `size font_size`). `_screen_value`
    // matches a single word too, but `identifier` comes earlier in the
    // grammar and wins that equal-length tie, so the lone `identifier`
    // alternative is what takes it; `_screen_value` wins whenever it
    // matches more (`i.name`, `Start()`, `100 + offset`), being the longer
    // token at the same lexical precedence.
    //
    // `prec.dynamic` on `_keyword_property` is required, not decorative:
    // `color c` can reduce as one keyword pair or as two positional values,
    // and both are complete parses (the conflict is declared in
    // `conflicts`). The pair reading wins whenever it is viable. Keeping
    // positionals before keywords is what makes this pick well: a lone word
    // followed by a pair (`textbutton title action Foo`) has only one
    // reading with a pair in it, where a free mix of the two would tie
    // `(title) (action Foo)` with `(title action) (Foo)`.
    //
    // q85r: a value that is exactly one quoted string (`text "Trust:
    // [trust]"`, `tooltip "Hi [name]"`) is a `string`, like say text, so the
    // symbol index reads its `[var]` interpolations and it is not injected
    // as Python. `_screen_string` (one terminated single, double or triple
    // quoted string on one line) matches the same text as `_screen_value`
    // for such a value and wins that equal-length tie because it is defined
    // first: keep it above `_screen_value`. Do not give it a lexical `prec`
    // instead; that would also beat a *longer* `_screen_value` and split
    // `"a" + b` after `"a"`. A value that only contains a string
    // (`_("Start")`, `"a" + b`, `"a", "b"`) is longer as a `_screen_value`
    // (or `_screen_value_list`), so it stays an `expression`.
    _screen_string: $ => token(choice(
      seq('"""', repeat(seq(optional(/""?/), /[^"\\\r\n]|\\[^\r\n]/)), '"""'),
      seq("'''", repeat(seq(optional(/''?/), /[^'\\\r\n]|\\[^\r\n]/)), "'''"),
      EXPR_DQ_STRING,
      EXPR_SQ_STRING,
    )),

    _positional_property: $ => choice(
      alias($._screen_string, $.string),
      alias($._screen_value, $.expression),
      alias($.identifier, $.expression),
    ),

    _keyword_property: $ => prec.dynamic(1, seq(
      field('name', $.identifier),
      field('value', choice($._positional_property, alias($._screen_value_list, $.expression))),
    )),

    // nms4.14: one screen property value, as Ren'Py's simple_expression
    // reads it: items joined by binary operators, where blanks are allowed
    // around an operator (`100 + offset`, `a and not b`, `x not in s`) and
    // inside brackets and strings, and nowhere else. Each item is built
    // like an `_at_expr_blob` item (aj2e): a run of characters other than
    // blanks, ',', ':', '#', quotes and brackets, with quoted strings and
    // bracket groups (bounded nesting, AT_GROUP_DEPTH) as single pieces —
    // so `[Hide("s"), Return()]` and `SetScreenVariable("sel", i)` are one
    // value and a quoted '#' or ':' never ends it. The token therefore
    // stops at the blank before the next property name, at a top-level ':'
    // (the block colon of `hbox xalign 0.5:`), at an unquoted '#' and at
    // the end of the line. Not supported: conditional expressions (`a if c
    // else b`), top-level commas in a positional value (keyword values take
    // them, see `_screen_value_list`), brackets nested deeper than
    // AT_GROUP_DEPTH, and brackets continued onto the next line. An
    // unbalanced bracket or unterminated string on a half-typed line is an
    // ERROR, as it was before.
    _screen_value: $ => token(screenValue()),

    // A keyword value may also be a top-level comma list (`add "img" at a,
    // b`), as Ren'Py reads keyword values; a positional value may not. The
    // token needs at least one comma, so it never competes with
    // `_screen_value` for a value without one.
    _screen_value_list: $ => token(seq(
      screenValue(),
      repeat1(seq(/[ \t]*,[ \t]*/, screenValue())),
    )),

    // ATL (Animated Transform Language) — used by `transform` statements
    // and by `at`-clause ATL blocks. Structurally similar to
    // screen_language_statement: a small fixed set of ATL-specific
    // keywords (`parallel`/`contains`/`choice`/`block`/`repeat`/`pause`/
    // `time`/`with`) plus arbitrary `name value` property sets, all opaque
    // Python-ish expressions on the value side per the same granularity
    // convention used everywhere else in this grammar. `word: $ =>
    // $.identifier` means these keyword literals win lexical ties against
    // plain `identifier` whenever they match exactly (tree-sitter's
    // keyword-extraction rule), so an ATL property genuinely named e.g.
    // `contains` would be shadowed by the block keyword — an accepted,
    // pre-existing limitation shared with screen-language tags.
    transform_statement: $ => seq(
      'transform',
      field('name', $.identifier),
      optional(field('parameters', $.parameter_list)),
      $._atl_block,
    ),

    // Shared ATL body — factored out of `transform_statement` (unchanged in
    // shape) by final-review fix I5 so `show`/`scene` can take the exact
    // same inline ATL block. Hidden, so it contributes no node of its own
    // and `transform_statement`'s tree shape is byte-for-byte what it was.
    _atl_block: $ => seq(
      $._block_colon,
      $._newline,
      $._indent,
      repeat1(choice($._comment_line, $._atl_statement)),
      $._dedent,
    ),

    _atl_statement: $ => choice(
      $.atl_displayable,
      $.atl_transform_property,
      $.atl_with_statement,
      $.atl_block_statement,
      $.atl_time_statement,
    ),

    // `xalign 0.5`, `zoom 1.2`, `rotate persistent.angle` style property
    // sets — reuses the opaque-expression pattern since ATL property
    // values are Python-ish numeric/interpolated expressions. Like every
    // other "simple" statement in this grammar (see the `_statement`
    // comment's convention, and the `dollar_statement`/
    // `screen_language_statement` bug notes above), this must consume its
    // own trailing `_newline` explicitly — it doesn't delegate to `_block`
    // or otherwise own an indent/dedent pair, so without this the
    // external scanner never emits a NEWLINE here and sibling
    // atl_statements on the next line become lexically unreachable
    // (verified against the brief's snippet, which omitted this and
    // produced ERROR nodes on any transform with more than one property).
    atl_transform_property: $ => seq(
      field('property', $.identifier),
      field('value', $.expression),
      $._newline,
    ),

    // nms4.23: a quoted displayable line (`"logo.png"`, `"eileen happy"`)
    // shows that image, as in `image logo:` bodies and frame-by-frame
    // animations. Only the string form; an unquoted displayable expression
    // would be indistinguishable from a property line here.
    atl_displayable: $ => seq(
      field('displayable', $.string),
      $._newline,
    ),

    atl_with_statement: $ => seq(
      'with',
      field('warper', $.expression),
      $._newline,
    ),

    atl_block_statement: $ => seq(
      choice('parallel', 'contains', 'choice', 'block', 'repeat'),
      $._block_colon,
      $._newline,
      $._indent,
      repeat1(choice($._comment_line, $._atl_statement)),
      $._dedent,
    ),

    atl_time_statement: $ => seq(
      choice('pause', 'time'),
      field('duration', $.expression),
      $._newline,
    ),

    // Fallback so raw Python-ish lines inside `python:`/`init python:`
    // blocks (which this task doesn't decompose — see the injection-point
    // comments above) parse as an opaque line instead of producing an
    // ERROR node. (Since nms4.15 a python body is one opaque `python_block`
    // and never reaches this rule; it still takes bare expression lines
    // elsewhere.)
    //
    // This is *not* simply `seq($.expression, $._newline)` as the brief's
    // snippet had it. A line like `total = points * 2` starts with a bare
    // word that is *lexically indistinguishable*, at the very first
    // token, from the start of a `say_statement` (`eileen happy "..."`)
    // — both are just "identifier-shaped word, then more stuff." No
    // static lexer precedence can route the *same* leading text to
    // `identifier` for one case and to a big greedy `expression` blob for
    // the other, because the choice has to be made before the rest of the
    // line (in particular, whether a string literal ever shows up) is
    // even seen.
    //
    // The fix is to make `expression_statement` share the *same* leading
    // `$.identifier` token as `say_statement` instead of competing
    // against it with a separate token. Once both rules are consuming an
    // identical first token, there's nothing left for the lexer to
    // arbitrate — the ambiguity becomes a normal GLR parser-level fork:
    // both `say_statement` and `expression_statement` stay alive after
    // the leading identifier, and whichever one actually completes
    // (`say_statement` needs a trailing string; `expression_statement`
    // needs the remainder, if any, to fit `$.expression`) survives while
    // the other is pruned. For `total = points * 2`: after `total`, the
    // next character is `=`, which can't start another `identifier` or a
    // `string`, so `say_statement` dead-ends and `expression_statement`
    // wins. For `eileen happy "..."`: `expression_statement`'s optional
    // trailing expression can't accept `happy` (that lexes as another
    // `identifier`, not `expression`, per the same precedence rule), so
    // `expression_statement` dead-ends after just `eileen` while
    // `say_statement` goes on to consume `happy` as an attribute and the
    // quoted string as `text`.
    //
    // The `$.expression`-only alternative covers lines that don't start
    // with an identifier-shaped word at all (e.g. a bare literal or an
    // operator-led continuation) — for those there's no competing
    // `identifier` token to lose to, so plain `$.expression` (at its
    // usual `prec(-1)`, still below every keyword) is unambiguous.
    expression_statement: $ => seq(
      choice(
        seq($.identifier, optional($.expression)),
        $.expression,
      ),
      $._newline,
    ),

    // Final-review fix I4: honest catch-all for a keyword-led line that no
    // other statement rule claims.
    //
    // Before this rule existed, such a line was *silently fabricated* into
    // dialogue: `stop sound` parsed as `(say_statement character:
    // (identifier) attributes: (identifier) text: (string (MISSING
    // "string_token1")))` — tree-sitter's error recovery synthesized a
    // zero-width string so `say_statement` could complete. A downstream
    // symbol-table/diagnostics consumer has no cheap way to tell that
    // phantom dialogue apart from real dialogue, which makes it strictly
    // worse than an honest `ERROR`.
    //
    // Two deliberate shape constraints keep this from stealing parses from
    // rules that *should* win:
    //
    // 1. The repeated middle only accepts `$.identifier`, never
    //    `$.string`. Allowing strings would make `eileen happy "hi"` a
    //    fully valid `unknown_statement` as well as a fully valid
    //    `say_statement` — a real, unresolvable ambiguity. Restricted to
    //    bare words, this rule can never complete on a line containing a
    //    string literal, so every genuine say-statement is still parsed as
    //    one.
    // 2. The `_newline`-terminated branch requires at least *two* bare
    //    words (`repeat1`), so it can't shadow `expression_statement`
    //    (which is `identifier` + optional expression + newline and would
    //    otherwise be a strict subset of this rule). `stop sound` /
    //    `window show` have two words and land here; `total = points * 2`
    //    has one word plus an expression and still lands in
    //    `expression_statement`.
    //
    // The `_block`-terminated branch additionally makes colon-opened
    // Python headers inside `python:` blocks parseable — `def foo(a):`,
    // `class C:`, `try:`, `with open(p) as f:` — which, combined with fix
    // C1's colon-permitting `expression`, is what lets a real `def` with a
    // nested `if` body parse instead of ERRORing. Its indented body is
    // ordinary `_statement`s via `_block`, matching how every other
    // block-taking statement in this grammar handles nesting. (Since
    // nms4.15 python bodies are opaque `python_block`s, so this branch now
    // only takes unknown keyword-led headers in Ren'Py code.)
    unknown_statement: $ => choice(
      seq(
        $.identifier,
        repeat1($.identifier),
        optional($.expression),
        $._newline,
      ),
      seq(
        $.identifier,
        repeat($.identifier),
        optional($.expression),
        $._block,
      ),
    ),

    // `scope` is either an arbitrary namespace identifier (`translate french
    // start_label:`) or the literal keyword `strings` (`translate french
    // strings:`, Ren'Py's syntax for a block of translated string literals
    // rather than translated statements). Reuses `_block`/`_statement` so
    // the body can hold ordinary statements (say_statement, etc.) exactly
    // like every other block-taking statement in this grammar — the
    // brief's corpus expectation of a nested `(say_statement ...)` node
    // falls out of that reuse for free, no special-casing needed.
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
      $._block_colon,
      $._newline,
      $._indent,
      repeat1(choice($._comment_line, $.style_property_statement)),
      $._dedent,
    ),

    // Like every other "simple" statement in this grammar (see the
    // `_statement` comment's convention, and the `dollar_statement`/
    // `atl_transform_property` bug notes above), this must consume its own
    // trailing `_newline` explicitly — it sits inside a `repeat1` between
    // its owning statement's `_indent`/`_dedent` pair rather than
    // delegating to `_block`, so without this the external scanner never
    // emits a NEWLINE here and a second sibling property on the next line
    // becomes lexically unreachable (verified against the brief's snippet,
    // which omitted this and produced an ERROR node on the second property
    // of a multi-property style/layeredimage block).
    //
    // `value` additionally accepts `$.string` (aliased to the shared
    // `$.expression` node type, matching this grammar's opaque-value
    // convention). A bare `field('value', $.expression)` alone is not
    // enough: style/layeredimage property values are frequently quoted
    // string literals (`background "#333"`, image filenames), and the
    // top-level `expression` token's regex (`/[^\n#:]+/`) deliberately
    // *excludes* `#` so it never swallows a trailing comment — but that
    // means it can't consume a color literal like `"#333"` at all (it stops
    // dead after the opening quote), leaving the rest of the line
    // (`#333"`) to be mis-lexed as a comment and produce an ERROR node
    // (verified: this happened with the brief's literal `$.expression`-only
    // field). Trying `$.string` first is unambiguous and safe here since,
    // unlike at the top-level `_statement` position, this field has no
    // competing rule that also wants to consume a leading quote.
    style_property_statement: $ => seq(
      field('property', $.identifier),
      field('value', choice(alias($.string, $.expression), $.expression)),
      $._newline,
    ),

    // "Simple" statement (no block) — consumes its own trailing `_newline`
    // per the same convention as `dollar_statement`/`with_statement`/etc.
    // The brief's snippet omitted this.
    camera_statement: $ => seq(
      'camera',
      optional(field('layer', $.identifier)),
      optional(seq('at', field('at_expr', $.expression))),
      $._newline,
    ),

    // `name` is a whitespace-separated run of identifiers, same convention
    // as `image_statement`'s name field. Reuses `style_property_statement`'s
    // shape for its body per the brief's guidance that layeredimage should
    // be modeled consistent with style (both are `name value` property
    // lists inside an indented block).
    layeredimage_statement: $ => seq(
      'layeredimage',
      field('name', repeat1($.identifier)),
      $._block_colon,
      $._newline,
      $._indent,
      repeat1(choice($._comment_line, $.style_property_statement)),
      $._dedent,
    ),

    // `nvl clear` / `nvl show` / `nvl hide` reuse the exact same literal
    // keyword tokens `show`/`hide` already declared by `show_statement`/
    // `hide_statement` (Task 4). This is *not* a lexer ambiguity: tree-sitter
    // unifies identical string-literal tokens into one shared terminal
    // symbol across the whole grammar, but which *rule* that terminal is
    // allowed to reduce into at any point is still governed by the parser's
    // current state (i.e. what came immediately before). `show_statement`
    // and `hide_statement` only start a statement at the top of
    // `_statement`'s choice; `nvl_statement`'s `show`/`hide` only appear
    // immediately after a preceding `nvl` token. Those are disjoint parser
    // states, so `nvl show` cannot be mistaken for a bare `show_statement`
    // (which requires a following `image` identifier list, not end-of-line)
    // and a bare `show eileen` cannot be mistaken for `nvl_statement` (which
    // requires a preceding `nvl`). `tree-sitter generate` confirms this:
    // no GLR conflict is reported for `show`/`hide` between the two rules.
    // Simple statement — consumes its own trailing `_newline`.
    nvl_statement: $ => seq(
      'nvl',
      choice('clear', 'show', 'hide'),
      $._newline,
    ),

    // Task 8: wrapped in `token(...)` (previously a plain, non-atomic `seq`)
    // and the closing quote made `optional`, with the content class
    // additionally excluding `\n`. Two independent fixes bundled here:
    //
    // 1. Permissive unterminated strings — a string literal being actively
    //    typed in Monaco (opening quote present, closing quote not yet
    //    typed) is a hot-path half-typed editing state. Before this fix the
    //    closing quote was required, so `eileen "Hello, how are` (no closing
    //    `"`) fell through to `ERROR` instead of lexing as an (incomplete)
    //    `string` node — verified empirically. `optional('"')`/`optional("'")`
    //    lets the token still match up to end-of-line/EOF without a closer;
    //    downstream consumers can detect "unterminated" by checking whether
    //    the matched text's last character isn't the opening quote character.
    //    Excluding `\n` from the content class keeps an unterminated string
    //    from swallowing subsequent lines (and their indentation) into one
    //    token — it stops exactly at the line the user is on.
    // 2. `token(...)` makes the whole alternative one atomic lexical token
    //    instead of a normal grammar `seq`. This matters together with fix
    //    1: once the closing quote is optional, an *un*terminated string's
    //    match boundary is ambiguous at the grammar level (nothing stops the
    //    parser from trying to split the content differently token-by-token,
    //    since `repeat(choice(...))` is no longer forced to end at a real
    //    quote). Atomicizing it via `token()` commits the lexer to the
    //    longest single match up front, the same way every other lexical
    //    leaf in this grammar (`comment`, `expression`, etc.) is already
    //    `token()`-wrapped.
    string: $ => choice(
      token(seq('"', repeat(choice(/[^"\\\r\n]/, /\\./)), optional('"'))),
      token(seq("'", repeat(choice(/[^'\\\r\n]/, /\\./)), optional("'"))),
    ),
  }
});
