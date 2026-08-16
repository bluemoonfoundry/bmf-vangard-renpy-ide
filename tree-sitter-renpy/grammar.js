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

    // Placeholder alternation target — every later task adds a case here.
    _statement: $ => choice(
      // "Simple" (non-block-taking) statements consume their own trailing
      // newline; block-taking statements terminate via `_block` instead
      // (which owns its own trailing newline/dedent) and don't wrap here.
      seq($.comment, $._newline),
      seq($.identifier, $._newline),
      $.block_statement,
    ),

    comment: $ => token(seq('#', /.*/)),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    // Shared block body used by every block-taking statement added in
    // later tasks: `label foo:` / `if x:` / `screen bar():` etc.
    _block: $ => seq(
      ':',
      optional(seq($._newline, $._indent, repeat1($._statement), $._dedent)),
    ),

    // TEMPORARY scaffolding, scoped to this task's indentation corpus tests
    // only: a generic `block:`-headed statement so the corpus can exercise
    // real nested INDENT/DEDENT/NEWLINE sequencing (multi-level dedent,
    // comments at odd columns inside a block, etc.) without pulling in any
    // of Tasks 3-7's real statement grammar (label/if/menu/screen). Bare
    // `seq($.identifier, $._newline)` above is the same kind of scaffolding:
    // a minimal non-comment "leaf" statement, needed because a block's
    // opening `_indent` must be established by real content — comments are
    // deliberately indentation-insignificant (see scanner.c) and can never
    // themselves open a block. Those tasks are expected to add their own
    // block-taking and simple-statement rules built on the same `_block`
    // rule and may remove this scaffolding once real coverage exists.
    block_statement: $ => seq('block', $._block),
  }
});
