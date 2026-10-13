#include "tree_sitter/parser.h"
#include <string.h>
#include <stdlib.h>

enum TokenType {
  NEWLINE,
  INDENT,
  DEDENT,
};

#define MAX_INDENT_DEPTH 128

typedef struct {
  uint32_t indent_stack[MAX_INDENT_DEPTH];
  uint16_t indent_stack_len;
} Scanner;

void *tree_sitter_renpy_external_scanner_create() {
  Scanner *scanner = calloc(1, sizeof(Scanner));
  scanner->indent_stack[0] = 0;
  scanner->indent_stack_len = 1;
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
  return (unsigned)size;
}

void tree_sitter_renpy_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {
  Scanner *scanner = (Scanner *)payload;
  scanner->indent_stack[0] = 0;
  scanner->indent_stack_len = 1;
  if (length == 0) return;
  size_t size = 0;
  // Read through unsigned char: indent_stack_len can legitimately reach
  // MAX_INDENT_DEPTH (128), which sign-extends to a huge/negative value if
  // read through a (possibly signed) plain `char` first.
  scanner->indent_stack_len = (uint16_t)(unsigned char)buffer[size++];
  memcpy(scanner->indent_stack, &buffer[size], scanner->indent_stack_len * sizeof(uint32_t));
}

static void skip(TSLexer *lexer) { lexer->advance(lexer, true); }

bool tree_sitter_renpy_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
  Scanner *scanner = (Scanner *)payload;

  // NOTE (final-review fix C4): this scanner used to carry a
  // `bracket_depth` counter here, incremented/decremented from
  // `lexer->lookahead` on every scan pass, intended to suppress
  // NEWLINE/INDENT/DEDENT inside a multi-line bracket-continued logical
  // line (e.g. a `define e = Character(...)` call whose arguments are
  // spread across three physical lines).
  // It was removed because it could not work and was actively harmful:
  //
  //  - Tree-sitter only invokes an external scanner at positions where one
  //    of its tokens is a valid next symbol, which for this grammar means
  //    essentially only at line boundaries. The counter therefore almost
  //    never observed the mid-line `(`/`[`/`{` characters it was supposed
  //    to be counting, so multi-line bracket continuation stayed broken
  //    regardless.
  //  - On the rare occasion it *did* fire — a line whose very first
  //    character is a bracket — the early `return false` suppressed a
  //    DEDENT that was genuinely owed, producing a *silent* misparse
  //    (`hasError === false`, wrong tree shape): given `label s:` /
  //    `    return` / blank / `(1)`, the top-level `(1)` was placed inside
  //    `label s`'s body.
  //
  // A correct implementation would have to scan forward through line
  // content on every call (the way tree-sitter-python's scanner tracks its
  // own parenthesis state), which is out of scope here. Multi-line bracket
  // continuation remaining unsupported is an accepted known limitation;
  // silently misplacing statements was not.

  // Only consume real whitespace here (spaces/tabs/CRs/newlines). Comment
  // text is deliberately NOT consumed by the scanner: comments are the
  // grammar's own `comment` token to produce, and skip()-ing over them here
  // would discard them as trivia before the internal tokenizer ever sees
  // them (this exact bug shipped in an earlier draft of this scanner).
  bool saw_newline = false;
  for (;;) {
    if (lexer->lookahead == '\n') {
      saw_newline = true;
      skip(lexer);
    } else if (lexer->lookahead == '\r' || lexer->lookahead == ' ' || lexer->lookahead == '\t') {
      skip(lexer);
    } else {
      break;
    }
  }

  if (lexer->eof(lexer)) {
    // End-of-file always closes out the last logical line before we start
    // popping the indent stack — whether or not a final '\n' is physically
    // present (nms4.8). Editor buffers and many .rpy files end without one;
    // like tree-sitter-python, treat EOF as an implicit line end and
    // synthesize a zero-width NEWLINE, so `label a:\n    return<EOF>` parses
    // the same as with a trailing newline.
    //
    // During error recovery tree-sitter marks every external token valid at
    // once (INDENT/DEDENT/NEWLINE are otherwise never simultaneously valid
    // in this grammar). Don't offer a *zero-width* NEWLINE there: at EOF it
    // could be accepted repeatedly without consuming input.
    bool error_recovery = valid_symbols[NEWLINE] && valid_symbols[INDENT] && valid_symbols[DEDENT];
    if (valid_symbols[NEWLINE] && (saw_newline || !error_recovery)) {
      lexer->result_symbol = NEWLINE;
      return true;
    }
    if (valid_symbols[DEDENT] && scanner->indent_stack_len > 1) {
      scanner->indent_stack_len--;
      lexer->result_symbol = DEDENT;
      return true;
    }
    return false;
  }

  // A line whose first non-blank character is '#' is comment-only — since a
  // Ren'Py/Python-style comment always runs to end of line, there is no
  // ambiguity here: nothing else can appear after '#' on this line. Mirror
  // Python's tokenizer and treat comment-only (and blank) lines as entirely
  // insignificant for indentation tracking: they must never push/pop the
  // indent stack, regardless of what column the '#' happens to sit at. They
  // still get an ordinary NEWLINE so the grammar can parse the `comment` as
  // just another statement at the current depth.
  bool is_comment_line = (lexer->lookahead == '#');

  uint32_t indent_length = lexer->get_column(lexer);
  uint32_t current_indent = scanner->indent_stack[scanner->indent_stack_len - 1];

  // Indent/dedent comparisons are intentionally NOT gated on `saw_newline`
  // being true in *this specific call*. DEDENT tokens are zero-width: when
  // unwinding multiple nested levels on a single logical line (e.g. closing
  // two blocks at once), each DEDENT is emitted from its own scan() call
  // without consuming any further input, so a later call in the same chain
  // will find no fresh newline/whitespace left to skip (`saw_newline` would
  // be false) even though we are still sitting at that same line-start
  // position and more DEDENTs may still be owed. Comparing indent_length to
  // the stack unconditionally (whenever these tokens are valid at all, which
  // the grammar only asks for at line-start positions) lets the parser pop
  // one level per call until the stack matches, exactly mirroring
  // tree-sitter-python's approach.
  if (!is_comment_line) {
    if (indent_length > current_indent && valid_symbols[INDENT]) {
      if (scanner->indent_stack_len < MAX_INDENT_DEPTH) {
        scanner->indent_stack[scanner->indent_stack_len++] = indent_length;
        lexer->result_symbol = INDENT;
        return true;
      }
      // Indent stack exhausted (over MAX_INDENT_DEPTH levels of nesting,
      // pathologically deep for real Ren'Py scripts). Refuse to push
      // further rather than overflowing indent_stack[] into adjacent
      // Scanner fields; the parser will surface this as a parse error
      // instead of scanner state silently corrupting.
    } else if (indent_length < current_indent && valid_symbols[DEDENT]) {
      scanner->indent_stack_len--;
      lexer->result_symbol = DEDENT;
      return true;
    }
  }

  if (saw_newline && valid_symbols[NEWLINE]) {
    lexer->result_symbol = NEWLINE;
    return true;
  }

  return false;
}
