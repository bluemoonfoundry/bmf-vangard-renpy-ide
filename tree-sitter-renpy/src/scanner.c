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
  int32_t bracket_depth;
} Scanner;

void *tree_sitter_renpy_external_scanner_create() {
  Scanner *scanner = calloc(1, sizeof(Scanner));
  scanner->indent_stack[0] = 0;
  scanner->indent_stack_len = 1;
  scanner->bracket_depth = 0;
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
  memcpy(&buffer[size], &scanner->bracket_depth, sizeof(int32_t));
  size += sizeof(int32_t);
  return (unsigned)size;
}

void tree_sitter_renpy_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {
  Scanner *scanner = (Scanner *)payload;
  scanner->indent_stack[0] = 0;
  scanner->indent_stack_len = 1;
  scanner->bracket_depth = 0;
  if (length == 0) return;
  size_t size = 0;
  // Read through unsigned char: indent_stack_len can legitimately reach
  // MAX_INDENT_DEPTH (128), which sign-extends to a huge/negative value if
  // read through a (possibly signed) plain `char` first.
  scanner->indent_stack_len = (uint16_t)(unsigned char)buffer[size++];
  memcpy(scanner->indent_stack, &buffer[size], scanner->indent_stack_len * sizeof(uint32_t));
  size += scanner->indent_stack_len * sizeof(uint32_t);
  memcpy(&scanner->bracket_depth, &buffer[size], sizeof(int32_t));
}

static void skip(TSLexer *lexer) { lexer->advance(lexer, true); }

bool tree_sitter_renpy_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
  Scanner *scanner = (Scanner *)payload;

  // Track bracket depth on every scan pass so multi-line ( [ { calls
  // don't trigger NEWLINE/INDENT/DEDENT mid-expression.
  if (lexer->lookahead == '(' || lexer->lookahead == '[' || lexer->lookahead == '{') {
    scanner->bracket_depth++;
  } else if (lexer->lookahead == ')' || lexer->lookahead == ']' || lexer->lookahead == '}') {
    if (scanner->bracket_depth > 0) scanner->bracket_depth--;
  }

  if (scanner->bracket_depth > 0) {
    return false; // let the grammar's normal tokenization handle bracketed content
  }

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
    // A trailing newline right before end-of-file still needs to close out
    // the last logical line before we start popping the indent stack.
    if (valid_symbols[NEWLINE] && saw_newline) {
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
