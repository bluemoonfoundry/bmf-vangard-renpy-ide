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
      $.screen_statement,
      $.transform_statement,
      $.translate_statement,
      $.style_statement,
      $.camera_statement,
      $.layeredimage_statement,
      $.nvl_statement,
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
    // positional/keyword properties, and an optional indented body. This
    // is a deliberate spec decision — do not split into per-widget rule
    // types even though it would look tidier; the point is that the
    // uniform shape is sufficient to represent every widget.
    // Every screen_language_statement must consume exactly one trailing
    // `_newline` of its own, mirroring the convention "simple" `_statement`s
    // use (see the `_statement` comment above) — this rule sits *outside*
    // `_block`'s pattern (it has no required leading `:'), so unlike
    // `if_statement`/`while_statement`/etc. it can't just delegate to
    // `_block`. The brief's snippet omitted this newline entirely, which
    // left the grammar with no marker between sibling widgets on the same
    // indent level: the external scanner only emits a NEWLINE token when
    // the grammar actually asks for one at that position (see scanner.c),
    // so an unconsumed newline is silently skipped as whitespace and two
    // adjacent widgets (e.g. `text "Welcome"` then `if ...:`) become
    // lexically indistinguishable from one widget with extra properties —
    // a genuine `tree-sitter generate` conflict ("Unresolved conflict...
    // Specify a left or right associativity... Add a conflict"), not a
    // lexer-precedence issue. Requiring the newline (or the block's own
    // internal `_newline` right after `:') removes the ambiguity: the
    // parser always knows where one screen_language_statement ends.
    screen_language_statement: $ => seq(
      field('widget_tag', $.identifier),
      repeat(field('properties', $.property)),
      choice(
        $._newline,
        seq(':', $._newline, $._indent, repeat1($.screen_language_statement), $._dedent),
      ),
    ),

    // A property is either a `name value` keyword pair (e.g. `action
    // Start()`) or a single bare expression (e.g. a widget's positional
    // argument, or — for control-flow tags like `if`/`for` reused inside
    // screen-language — the condition/target itself, e.g. `if
    // persistent.unlocked:`). Both alternatives can start with the exact
    // same identifier-shaped text (`persistent...` vs `action ...`), so
    // this can't be resolved by `expression`'s usual `prec(-1)` alone: at
    // the position right after `if `, plain `identifier` (prec 0, matches
    // just "persistent") would always beat plain `expression` (prec -1,
    // would match the whole "persistent.unlocked") on precedence *before*
    // length is even considered, splitting the dotted attribute access
    // into a bogus name:"persistent" + value:".unlocked" pair instead of
    // one bare expression — the brief's snippet has this bug (verified:
    // it produced exactly that malformed split against the brief's own
    // corpus expectation of a single `(property (expression))`).
    //
    // `_bare_expr_head` fixes this by requiring at least one more
    // *immediately adjacent, no-space* character after the leading word
    // (`repeat1`, not `repeat0`) before it's a valid token at all. That
    // means it can never even compete for cases like `action Start()`
    // (a space follows "action", so the blob simply fails to match there
    // and only plain `identifier` is on offer — alt1 still wins normally),
    // but for `persistent.unlocked` (no space before the continuing `.`)
    // it matches the full 20 characters at the *same* (default, 0)
    // precedence as `identifier`'s 10-character match — a tie that then
    // falls through to tree-sitter's next tiebreaker, longest match, which
    // the blob wins outright. This keeps `action Start()` splitting into
    // name+value (real keyword-argument screen properties always have a
    // separating space) while letting any expression that runs directly
    // into its head word — dotted attributes, calls, subscripts — lex as
    // one opaque expression, matching real Ren'Py semantics: only
    // `if`/`for`/bare-positional tags take a single expression, and they
    // have no notion of a `name` sub-field to split into.
    property: $ => choice(
      seq(field('name', $.identifier), field('value', $.expression)),
      alias($._bare_expr_head, $.expression),
      $.expression,
    ),

    _bare_expr_head: $ => token(seq(
      /[a-zA-Z_][a-zA-Z0-9_]*/,
      repeat1(/[^\n#: \t\r]/),
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
      ':',
      $._newline,
      $._indent,
      repeat1($._atl_statement),
      $._dedent,
    ),

    _atl_statement: $ => choice(
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

    atl_with_statement: $ => seq(
      'with',
      field('warper', $.expression),
      $._newline,
    ),

    atl_block_statement: $ => seq(
      choice('parallel', 'contains', 'choice', 'block', 'repeat'),
      ':',
      $._newline,
      $._indent,
      repeat1($._atl_statement),
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
      ':',
      $._newline,
      $._indent,
      repeat1($.style_property_statement),
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
      ':',
      $._newline,
      $._indent,
      repeat1($.style_property_statement),
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

    string: $ => choice(
      seq('"', repeat(choice(/[^"\\]/, /\\./)), '"'),
      seq("'", repeat(choice(/[^'\\]/, /\\./)), "'"),
    ),
  }
});
