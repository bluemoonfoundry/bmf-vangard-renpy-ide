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
