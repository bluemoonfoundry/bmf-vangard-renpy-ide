#include "tree_sitter/parser.h"
#include <wctype.h>
#include <string.h>
#include <stdlib.h>

enum TokenType {
  NEWLINE,
  INDENT,
  DEDENT,
};

typedef struct {
  uint32_t indent_stack[128];
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
  scanner->indent_stack_len = (uint16_t)(unsigned char)buffer[size++];
  memcpy(scanner->indent_stack, &buffer[size], scanner->indent_stack_len * sizeof(uint32_t));
  size += scanner->indent_stack_len * sizeof(uint32_t);
  memcpy(&scanner->bracket_depth, &buffer[size], sizeof(int32_t));
}

static void advance(TSLexer *lexer) { lexer->advance(lexer, false); }
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

  uint32_t indent_length = lexer->get_column(lexer);

  if (saw_newline) {
    uint32_t current_indent = scanner->indent_stack[scanner->indent_stack_len - 1];

    if (indent_length > current_indent && valid_symbols[INDENT]) {
      scanner->indent_stack[scanner->indent_stack_len++] = indent_length;
      lexer->result_symbol = INDENT;
      return true;
    }

    if (indent_length < current_indent && valid_symbols[DEDENT]) {
      scanner->indent_stack_len--;
      lexer->result_symbol = DEDENT;
      return true;
    }

    if (valid_symbols[NEWLINE]) {
      lexer->result_symbol = NEWLINE;
      return true;
    }
  }

  return false;
}
