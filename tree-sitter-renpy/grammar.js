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
    // Each statement here is a "simple" (non-block-taking) statement, so it
    // must consume its own trailing newline; block-taking statements added
    // in later tasks terminate via `_block` instead and won't wrap here.
    _statement: $ => seq(
      choice(
        $.comment,
      ),
      $._newline,
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
