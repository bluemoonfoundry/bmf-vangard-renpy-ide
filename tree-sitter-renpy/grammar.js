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

    // "Simple" (non-block-taking) statements consume their own trailing
    // `_newline` explicitly (the external scanner only emits NEWLINE when
    // the grammar asks for it — see scanner.c); block-taking statements
    // terminate via `_block` instead (which owns its own trailing
    // newline/indent/dedent sequence) and don't wrap here.
    _statement: $ => choice(
      seq($.comment, $._newline),
      $.label_statement,
      $.jump_statement,
      $.call_statement,
      $.return_statement,
      $.menu_statement,
      $.if_statement,
      $.while_statement,
      $.for_statement,
    ),

    comment: $ => token(seq('#', /.*/)),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    // Opaque Python-ish expression — content is handed to the injected
    // tree-sitter-python grammar via injections.scm (Task 9), not
    // decomposed here per the spec's Q1-B granularity decision. Excludes
    // ':' as well as '\n'/'#' so it never swallows the trailing colon that
    // introduces a `_block` body (label/if/menu-choice/while/for headers
    // all end in ':' immediately after their expression).
    expression: $ => /[^\n#:]+/,

    // Shared block body used by every block-taking statement: `label foo:`
    // / `if x:` / `menu:` etc.
    _block: $ => seq(
      ':',
      optional(seq($._newline, $._indent, repeat1($._statement), $._dedent)),
    ),

    label_statement: $ => seq(
      'label',
      field('name', $.identifier),
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
    _parameter_blob: $ => /[^\n#)]+/,

    jump_statement: $ => seq(
      'jump',
      optional('expression'),
      field('target', choice($.identifier, $.expression)),
      $._newline,
    ),

    call_statement: $ => seq(
      'call',
      optional('expression'),
      field('target', choice($.identifier, $.expression)),
      optional(seq('from', field('from_label', $.identifier))),
      $._newline,
    ),

    return_statement: $ => seq(
      'return',
      optional(field('value', $.expression)),
      $._newline,
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

    string: $ => choice(
      seq('"', repeat(choice(/[^"\\]/, /\\./)), '"'),
      seq("'", repeat(choice(/[^'\\]/, /\\./)), "'"),
    ),
  }
});
