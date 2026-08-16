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
      $.expression_statement,
    ),

    comment: $ => token(seq('#', /.*/)),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    // Opaque Python-ish expression — content is handed to the injected
    // tree-sitter-python grammar via injections.scm (Task 9), not
    // decomposed here per the spec's Q1-B granularity decision. Excludes
    // ':' as well as '\n'/'#' so it never swallows the trailing colon that
    // introduces a `_block` body (label/if/menu-choice/while/for headers
    // all end in ':' immediately after their expression).
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
    expression: $ => token(prec(-1, /[^\n#:]+/)),

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
    say_statement: $ => seq(
      optional(seq(
        field('character', choice($.identifier, $.expression)),
        optional(field('attributes', repeat1($.identifier))),
      )),
      field('text', $.string),
      optional(seq('with', field('transition', $.expression))),
      $._newline,
    ),

    // Injection point (Task 9): body text between `python:`/`:` and dedent
    // is opaque here, handed to tree-sitter-python via injections.scm.
    python_statement: $ => seq(
      'python',
      optional(choice('hide', 'early')),
      field('body', $._block),
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
      field('body', $._block),
    ),

    // Injection point (Task 9): the expression after `$` is opaque here.
    // Unlike block-taking statements, this is a "simple" statement per the
    // `_statement` comment's convention, so it must consume its own
    // trailing `_newline` explicitly — the brief's snippet omitted this,
    // which left the newline unconsumed (extras only cover space/tab/cr,
    // not '\n') and produced a parse error on the following line.
    dollar_statement: $ => seq('$', field('expression', $.expression), $._newline),

    define_statement: $ => seq(
      'define',
      field('name', $.identifier),
      '=',
      field('value', $.expression),
      $._newline,
    ),

    default_statement: $ => seq(
      'default',
      field('name', $.identifier),
      '=',
      field('value', $.expression),
      $._newline,
    ),

    // `name` is a whitespace-separated run of identifiers (e.g. `eileen
    // happy`); using the shared `$.expression` regex for `value` here is
    // fine because it's preceded by a required '=' token, which the
    // expression regex's stop set doesn't include, so there's no
    // swallowing hazard the way there was for `parameter_list`.
    image_statement: $ => seq(
      'image',
      field('name', repeat1($.identifier)),
      '=',
      field('value', $.expression),
      $._newline,
    ),

    // `at_expr` is a comma-separated name list (transform names, e.g.
    // `at right` or `at right, appear`), reusing the same narrow-blob
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
    scene_statement: $ => seq(
      'scene',
      optional(field('image', repeat1($.identifier))),
      optional(seq('at', field('at_expr', alias($._at_expr_blob, $.expression)))),
      optional(seq('with', field('transition', $.expression))),
      $._newline,
    ),

    show_statement: $ => seq(
      'show',
      field('image', repeat1($.identifier)),
      optional(seq('at', field('at_expr', alias($._at_expr_blob, $.expression)))),
      optional(seq('as', field('as_name', $.identifier))),
      optional(seq('with', field('transition', $.expression))),
      $._newline,
    ),

    _at_expr_blob: $ => token(seq(
      /[a-zA-Z_][a-zA-Z0-9_]*/,
      repeat(seq(/[ \t]*,[ \t]*/, /[a-zA-Z_][a-zA-Z0-9_]*/)),
    )),

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

    // Fallback so raw Python-ish lines inside `python:`/`init python:`
    // blocks (which this task doesn't decompose — see the injection-point
    // comments above) parse as an opaque line instead of producing an
    // ERROR node.
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

    string: $ => choice(
      seq('"', repeat(choice(/[^"\\]/, /\\./)), '"'),
      seq("'", repeat(choice(/[^'\\]/, /\\./)), "'"),
    ),
  }
});
