#include "tree_sitter/parser.h"
#include <string.h>
#include <stdlib.h>

enum TokenType {
  NEWLINE,
  INDENT,
  DEDENT,
  PYTHON_BLOCK,
  LOGICAL_VALUE,
  LOGICAL_ITEM,
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

// From the start of a comment-only line, skip it and any following blank or
// comment-only lines; return the column of the first line with code on it,
// or 0 if the file ends first (rsxn). Callers must mark_end() beforehand.
static uint32_t next_code_line_column(TSLexer *lexer) {
  for (;;) {
    while (lexer->lookahead != '\n' && !lexer->eof(lexer)) skip(lexer);
    if (lexer->eof(lexer)) return 0;
    skip(lexer);
    while (lexer->lookahead == ' ' || lexer->lookahead == '\t' || lexer->lookahead == '\r') skip(lexer);
    if (lexer->eof(lexer)) return 0;
    if (lexer->lookahead != '\n' && lexer->lookahead != '#') return lexer->get_column(lexer);
  }
}

// --- Opaque python bodies (nms4.15) ---------------------------------------
//
// The body of a `python:` / `init python:` block is one PYTHON_BLOCK token,
// scanned here in a single call without pushing an indent. It keeps no
// scanner state between calls, so serialize/deserialize are unchanged.

// Logical-line state carried from one physical body line to the next. Ren'Py
// (like Python) joins lines inside an open bracket, an open triple-quoted
// string, or after a trailing backslash, whatever their indentation.
typedef struct {
  uint32_t bracket_depth;
  int32_t quote;   // the open string's quote character, or 0
  bool triple;     // the open string is triple-quoted
  bool continued;  // the line ended with a backslash
} PythonLineState;

static bool is_blank_char(int32_t c) { return c == ' ' || c == '\t' || c == '\r'; }

// Consumes one character into the token. With `mark`, a non-blank character
// extends the token over it, so the token ends at the last non-blank
// character of the last line accepted into the body.
static void take(TSLexer *lexer, bool mark) {
  int32_t c = lexer->lookahead;
  lexer->advance(lexer, false);
  if (mark && !is_blank_char(c)) lexer->mark_end(lexer);
}

// After a backslash: consumes a CR, then reports whether the line ends here.
static bool backslash_ends_line(TSLexer *lexer, bool mark) {
  if (lexer->lookahead == '\r') take(lexer, mark);
  return lexer->lookahead == '\n' || lexer->eof(lexer);
}

// How scan_python_line reads a line. LINE_PYTHON: a python body line, whose
// comment is part of the token. LINE_VALUE: a statement's value running to
// the end of its logical line (nms4.35); a comment is consumed but never
// marked, so a trailing one stays outside the token while one inside the
// brackets is covered by the marks after it. LINE_ITEM: like LINE_VALUE, but
// the value ends at a top-level blank, ':', '#' or unmatched closing bracket
// (the end of a screen property value or `at` item), and items may be joined
// by top-level commas.
typedef enum { LINE_PYTHON, LINE_VALUE, LINE_ITEM } LineMode;

// Consumes the rest of one physical line, up to but not including its '\n'
// (or EOF), tracking strings, brackets, a comment and a trailing backslash.
// In LINE_ITEM mode it stops where the item ends instead, and returns true
// when the item ended (mid-line or at the line end with nothing left open).
static bool scan_python_line(TSLexer *lexer, PythonLineState *st, bool mark, LineMode mode) {
  st->continued = false;
  while (!lexer->eof(lexer) && lexer->lookahead != '\n') {
    int32_t c = lexer->lookahead;
    if (mode == LINE_ITEM && !st->quote && st->bracket_depth == 0) {
      if (c == ',' || is_blank_char(c)) {
        // Unmarked look-ahead: only a top-level comma (blanks around it
        // allowed) followed by more text continues the value.
        while (is_blank_char(lexer->lookahead)) take(lexer, false);
        if (lexer->lookahead != ',') return true;
        take(lexer, false);
        while (is_blank_char(lexer->lookahead)) take(lexer, false);
        c = lexer->lookahead;
        if (lexer->eof(lexer) || c == '\n' || c == '#' || c == ':' || c == ',') return true;
        continue;
      }
      if (c == ':' || c == '#' || c == ')' || c == ']' || c == '}') return true;
    }
    if (st->quote) {
      if (c == '\\') {
        take(lexer, mark);
        if (backslash_ends_line(lexer, mark)) {
          // A backslash-newline continues a single-quoted string.
          if (!st->triple) st->continued = true;
        } else {
          take(lexer, mark);  // the escaped character
        }
      } else if (c == st->quote && st->triple) {
        int run = 0;
        while (run < 3 && lexer->lookahead == st->quote) {
          take(lexer, mark);
          run++;
        }
        if (run == 3) st->quote = 0;
      } else {
        if (c == st->quote) st->quote = 0;
        take(lexer, mark);
      }
      continue;
    }
    if (c == '#') {
      while (!lexer->eof(lexer) && lexer->lookahead != '\n') take(lexer, mark && mode == LINE_PYTHON);
      break;
    }
    if (c == '"' || c == '\'') {
      take(lexer, mark);
      if (lexer->lookahead != c) {
        st->quote = c;
        st->triple = false;
      } else {
        take(lexer, mark);
        if (lexer->lookahead == c) {
          take(lexer, mark);
          st->quote = c;
          st->triple = true;
        }
        // Otherwise an empty string, already closed.
      }
      continue;
    }
    if (c == '\\') {
      take(lexer, mark);
      if (backslash_ends_line(lexer, mark)) st->continued = true;
      continue;
    }
    if (c == '(' || c == '[' || c == '{') {
      st->bracket_depth++;
    } else if ((c == ')' || c == ']' || c == '}') && st->bracket_depth > 0) {
      st->bracket_depth--;
    }
    take(lexer, mark);
  }
  // A single-quoted string ends with its line unless a backslash continued it.
  if (st->quote && !st->triple && !st->continued) st->quote = 0;
  return mode == LINE_ITEM && st->bracket_depth == 0 && !st->quote && !st->continued;
}

static bool is_word_char(int32_t c) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c == '_';
}

static bool word_in(const char *word, const char *const *list, size_t n) {
  for (size_t i = 0; i < n; i++) {
    if (strcmp(word, list[i]) == 0) return true;
  }
  return false;
}

// At the start of a line: reports whether the line starts a Ren'Py statement
// that bounds an unclosed string or bracket. Always: a top-level statement
// keyword followed by a space, tab or ':'. When `nested` (the python body
// sits inside a label or other block), also a label-body statement: a
// keyword such as `jump` or `return` followed by a space, tab, ':' or the
// line end; a `$` line; or a say line (a quoted string, optionally after
// space-separated identifiers: `"narration"`, `e "hi"`, `e happy "hi"`).
// Consumes only identifier characters and blanks (into the token, unmarked),
// never a quote or bracket; `*consumed` is the number of characters taken.
static bool starts_renpy_statement(TSLexer *lexer, bool nested, int *consumed) {
  static const char *const keywords[] = {
    "label", "init", "define", "default", "screen", "transform",
    "image", "style", "translate", "python", "menu",
  };
  static const char *const body_keywords[] = {
    "jump", "call", "return", "show", "scene", "hide", "with", "pause",
    "play", "queue", "stop", "voice", "if", "elif", "else", "while",
    "menu", "pass", "window", "nvl",
  };
  *consumed = 0;
  int32_t first = lexer->lookahead;
  if (nested && (first == '$' || first == '"' || first == '\'')) return true;
  char word[12];
  int len = 0;
  while (lexer->lookahead >= 'a' && lexer->lookahead <= 'z' && len < (int)sizeof(word) - 1) {
    word[len++] = (char)lexer->lookahead;
    take(lexer, false);
  }
  word[len] = '\0';
  *consumed = len;
  int32_t next = lexer->lookahead;
  if (len > 0 && (next == ' ' || next == '\t' || next == ':') &&
      word_in(word, keywords, sizeof(keywords) / sizeof(keywords[0]))) {
    return true;
  }
  if (!nested) return false;
  bool line_end = next == '\n' || next == '\r' || lexer->eof(lexer);
  if (len > 0 && (next == ' ' || next == '\t' || next == ':' || line_end) &&
      word_in(word, body_keywords, sizeof(body_keywords) / sizeof(body_keywords[0]))) {
    return true;
  }
  // The say-line shape: identifiers separated by blanks, then a quote.
  if (len == 0 && !(first == '_' || (first >= 'A' && first <= 'Z'))) return false;
  for (;;) {
    while (is_word_char(lexer->lookahead)) {
      take(lexer, false);
      (*consumed)++;
    }
    if (lexer->lookahead != ' ' && lexer->lookahead != '\t') return false;
    while (lexer->lookahead == ' ' || lexer->lookahead == '\t') {
      take(lexer, false);
      (*consumed)++;
    }
    int32_t c = lexer->lookahead;
    if (c == '"' || c == '\'') return true;
    if (!(c == '_' || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'))) return false;
  }
}

// Scans a python body from the first non-blank character after its header's
// NEWLINE. `header_indent` is the header line's indentation (the top of the
// indent stack). The body ends before the first code line indented no
// deeper than the header that does not continue an open logical line.
// Blank lines never end it, and neither do comment-only lines; but a comment
// no deeper than the header is only included when a deeper body line
// follows it, so trailing shallow comments stay outside the token. Returns
// false, having marked nothing, if no line deeper than the header is found
// (`python:` with no body). Callers must mark_end() beforehand.
//
// One deliberate deviation from Ren'Py: a string or bracket left open does
// not run on past a line, no deeper than the header, that starts a Ren'Py
// statement (see starts_renpy_statement). There are two bounds. At any
// depth: a top-level statement keyword (`label`, `define`, `screen`, ...).
// When the header is indented (the body is nested in a label or other
// block): also a label-body statement (`jump`, `return`, `show`, `if`, ...,
// a `$` line, or a say line such as `e "hi"`), since that is what follows a
// nested python body. Lines deeper than the header are never checked, so a
// closed string's continuation lines indented past the header stay in the
// body whatever they contain. When the string or bracket is never closed,
// Ren'Py rejects the file ("not terminated"), so there is no valid reading
// to keep, and this is exactly the half-typed state editor auto-close
// produces while a docstring is being written; without the bound the rest
// of the file (or of the enclosing label) would vanish into the body. The cost: the scanner
// cannot see whether the string is closed later, so a valid multi-line string
// that has a statement-led line at or left of the header's column (`define x`
// at column 0 inside a closed `"""` string) also ends the body there (pinned
// as a known limitation in python-and-vars.txt). A backslash continuation is
// not bounded.
static bool scan_python_block(TSLexer *lexer, uint32_t header_indent) {
  PythonLineState st = {0, 0, false, false};
  bool accepted = false;
  uint32_t column = lexer->get_column(lexer);
  while (!lexer->eof(lexer)) {
    if (lexer->lookahead != '\n') {
      bool open = st.bracket_depth > 0 || st.quote != 0;
      bool joined = open || st.continued;
      bool deeper = joined || column > header_indent;
      if (!deeper && lexer->lookahead != '#') break;
      if (open && !st.continued && column <= header_indent) {
        int consumed = 0;
        if (starts_renpy_statement(lexer, header_indent > 0, &consumed)) break;
        // Only identifier characters and blanks were consumed (no
        // string/bracket state to update), and the line is accepted:
        // extend the token over them.
        if (consumed > 0) lexer->mark_end(lexer);
      }
      scan_python_line(lexer, &st, deeper, LINE_PYTHON);
      if (deeper) accepted = true;
      if (lexer->eof(lexer)) break;
    }
    take(lexer, false);  // the '\n'
    column = 0;
    while (is_blank_char(lexer->lookahead)) {
      take(lexer, false);
      column++;
    }
  }
  return accepted;
}

// --- Values continued onto later lines (nms4.35) ---------------------------
//
// Ren'Py joins physical lines into one logical line while a bracket or a
// triple-quoted string is open (or after a trailing backslash), for every
// statement, not only python bodies: `define d = {` / `    "a": 1,` / `}`.
// The grammar's value tokens are regexes that stop at a line end, so a value
// that continues past its first line is scanned here instead, as one
// LOGICAL_VALUE (the rest of the logical line, as `expression`) or
// LOGICAL_ITEM (one screen property value or `at` list, as `_screen_value`
// and `_at_expr_blob` end) token. The token ends at the last non-blank,
// non-comment character, so a comment after the closing bracket stays
// outside it, and it spans the full multi-line source slice.
//
// Returns false, so the grammar's own one-line tokens take the value, when
// the value fits on its first line, and when a bracket or string is never
// closed: at EOF, or at a line, indented no deeper than the statement
// (`statement_indent`, the top of the indent stack), that starts a Ren'Py
// statement keyword (starts_renpy_statement). Ren'Py rejects such a file,
// and that is the half-typed state of a value being written (`define x = {`
// above `label start:`), so the error stays on that line, as with the
// python body bound. Callers must mark_end() beforehand.
static bool scan_logical_value(TSLexer *lexer, uint32_t statement_indent, LineMode mode) {
  PythonLineState st = {0, 0, false, false};
  // An item that ended on its first line, or a value with nothing left open.
  if (scan_python_line(lexer, &st, true, mode)) return false;
  if (st.bracket_depth == 0 && st.quote == 0 && !st.continued) return false;
  for (;;) {
    bool open = st.bracket_depth > 0 || st.quote != 0;
    if (lexer->eof(lexer)) return false;
    take(lexer, false);  // the '\n'
    uint32_t column = 0;
    while (is_blank_char(lexer->lookahead)) {
      take(lexer, false);
      column++;
    }
    if (lexer->eof(lexer)) return false;
    if (lexer->lookahead == '\n') continue;  // a blank line
    if (open && !st.continued && column <= statement_indent) {
      int consumed = 0;
      if (starts_renpy_statement(lexer, false, &consumed)) return false;
      // Only identifier characters and blanks were consumed: extend the
      // token over them.
      if (consumed > 0) lexer->mark_end(lexer);
    }
    if (scan_python_line(lexer, &st, true, mode)) return true;
    if (st.bracket_depth == 0 && st.quote == 0 && !st.continued) return true;
  }
}

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
  // own parenthesis state). That is what scan_logical_value now does
  // (nms4.35), for the value tokens the grammar marks as able to continue:
  // they are offered mid-line, so a bracket is seen from the value's start.

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

  // A python body (nms4.15). The header's NEWLINE has already moved past the
  // line break, blank lines and indentation, so this is the first body
  // line's first character. Only a line deeper than the header starts a
  // body, or a comment line (comments are invisible to indentation), which
  // needs a look past it. Skipped during error recovery, like the rsxn case
  // below. When no body is found nothing below could match either: a
  // comment line never gets INDENT/DEDENT, INDENT is not valid after a
  // python header, and the header's NEWLINE already took the line break.
  bool in_error_recovery = valid_symbols[NEWLINE] && valid_symbols[INDENT] && valid_symbols[DEDENT];

  // A value continued onto later lines (nms4.35). Values never start a line,
  // so only mid-line. A false return leaves the value to the grammar's own
  // tokens, and nothing below matches mid-line (INDENT/DEDENT are only valid
  // at a line start, NEWLINE needs a line break), so returning is safe.
  if ((valid_symbols[LOGICAL_VALUE] || valid_symbols[LOGICAL_ITEM]) && !in_error_recovery &&
      !saw_newline && !lexer->eof(lexer) && lexer->lookahead != '#') {
    uint32_t statement_indent = scanner->indent_stack[scanner->indent_stack_len - 1];
    LineMode mode = valid_symbols[LOGICAL_VALUE] ? LINE_VALUE : LINE_ITEM;
    lexer->mark_end(lexer);
    if (scan_logical_value(lexer, statement_indent, mode)) {
      lexer->result_symbol = mode == LINE_VALUE ? LOGICAL_VALUE : LOGICAL_ITEM;
      return true;
    }
    return false;
  }

  if (valid_symbols[PYTHON_BLOCK] && !in_error_recovery && !lexer->eof(lexer)) {
    uint32_t header_indent = scanner->indent_stack[scanner->indent_stack_len - 1];
    if (lexer->lookahead == '#' || lexer->get_column(lexer) > header_indent) {
      lexer->mark_end(lexer);
      if (scan_python_block(lexer, header_indent)) {
        lexer->result_symbol = PYTHON_BLOCK;
        return true;
      }
      return false;
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
  // indent stack, regardless of what column the '#' happens to sit at (the
  // one exception, a comment opening a block body, is below). They
  // still get an ordinary NEWLINE so the grammar can parse the `comment` as
  // just another statement at the current depth.
  bool is_comment_line = (lexer->lookahead == '#');

  uint32_t indent_length = lexer->get_column(lexer);
  uint32_t current_indent = scanner->indent_stack[scanner->indent_stack_len - 1];

  // A comment-only line as the *first* line of a block body (rsxn):
  // `label start:` / `    # intro` / `    "Hello"`. The grammar wants an
  // INDENT right after the header's NEWLINE, but the comment line can't
  // supply one under the rule above. Look past this line (and any further
  // blank or comment-only lines) to the first real line: if that line is
  // deeper than the current block, it is the body, so emit a zero-width
  // INDENT at *its* column, as Python's tokenizer would (comment lines are
  // invisible to indentation). The comment itself is left for the grammar
  // to lex as the body's first statement. If the next real line is not
  // deeper (or the file ends), the header has no body and nothing changes.
  // Skipped during error recovery (when every external token is valid at
  // once), so it never changes how an existing error is recovered.
  // INDENT is otherwise valid only right after a block header's NEWLINE, so
  // a deeper comment in the middle of a block is unaffected.
  bool error_recovery = valid_symbols[NEWLINE] && valid_symbols[INDENT] && valid_symbols[DEDENT];
  if (is_comment_line && valid_symbols[INDENT] && !error_recovery &&
      indent_length > current_indent && scanner->indent_stack_len < MAX_INDENT_DEPTH) {
    lexer->mark_end(lexer);
    uint32_t body_indent = next_code_line_column(lexer);
    if (body_indent > current_indent) {
      scanner->indent_stack[scanner->indent_stack_len++] = body_indent;
      lexer->result_symbol = INDENT;
      return true;
    }
    // No body: fall through. mark_end above pinned any token emitted below
    // to end at this line's '#', however far the lookahead advanced.
  }

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
