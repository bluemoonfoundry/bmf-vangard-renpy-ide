#include "tree_sitter/parser.h"

#if defined(__GNUC__) || defined(__clang__)
#pragma GCC diagnostic ignored "-Wmissing-field-initializers"
#endif

#ifdef _MSC_VER
#pragma optimize("", off)
#elif defined(__clang__)
#pragma clang optimize off
#elif defined(__GNUC__)
#pragma GCC optimize ("O0")
#endif

#define LANGUAGE_VERSION 14
#define STATE_COUNT 992
#define LARGE_STATE_COUNT 17
#define SYMBOL_COUNT 152
#define ALIAS_COUNT 0
#define TOKEN_COUNT 79
#define EXTERNAL_TOKEN_COUNT 4
#define FIELD_COUNT 36
#define MAX_ALIAS_SEQUENCE_LENGTH 11
#define PRODUCTION_ID_COUNT 98

enum ts_symbol_identifiers {
  sym_identifier = 1,
  sym_comment = 2,
  sym_expression = 3,
  anon_sym_COLON = 4,
  sym__dotted_label_name = 5,
  sym__dotted_store_name = 6,
  anon_sym_label = 7,
  anon_sym_hide = 8,
  anon_sym_global = 9,
  anon_sym_LPAREN = 10,
  anon_sym_RPAREN = 11,
  sym__parameter_blob = 12,
  anon_sym_jump = 13,
  anon_sym_expression = 14,
  anon_sym_call = 15,
  anon_sym_from = 16,
  anon_sym_return = 17,
  anon_sym_pass = 18,
  anon_sym_menu = 19,
  anon_sym_set = 20,
  anon_sym_if = 21,
  anon_sym_elif = 22,
  anon_sym_else = 23,
  anon_sym_while = 24,
  anon_sym_for = 25,
  anon_sym_in = 26,
  sym__for_target_blob = 27,
  anon_sym_with = 28,
  anon_sym_python = 29,
  anon_sym_early = 30,
  anon_sym_init = 31,
  aux_sym_init_python_statement_token1 = 32,
  anon_sym_DOLLAR = 33,
  anon_sym_define = 34,
  anon_sym_EQ = 35,
  anon_sym_default = 36,
  anon_sym_image = 37,
  anon_sym_scene = 38,
  anon_sym_at = 39,
  anon_sym_show = 40,
  anon_sym_as = 41,
  sym__at_expr_blob = 42,
  anon_sym_screen = 43,
  anon_sym_nopredict = 44,
  anon_sym_play = 45,
  anon_sym_queue = 46,
  anon_sym_stop = 47,
  anon_sym_voice = 48,
  anon_sym_sustain = 49,
  sym__audio_name = 50,
  sym__audio_list = 51,
  anon_sym_showif = 52,
  sym__screen_string = 53,
  sym__screen_value = 54,
  sym__screen_value_list = 55,
  anon_sym_transform = 56,
  anon_sym_parallel = 57,
  anon_sym_contains = 58,
  anon_sym_choice = 59,
  anon_sym_block = 60,
  anon_sym_repeat = 61,
  anon_sym_pause = 62,
  anon_sym_time = 63,
  anon_sym_translate = 64,
  anon_sym_strings = 65,
  anon_sym_style = 66,
  anon_sym_is = 67,
  anon_sym_take = 68,
  anon_sym_camera = 69,
  anon_sym_layeredimage = 70,
  anon_sym_nvl = 71,
  anon_sym_clear = 72,
  aux_sym_string_token1 = 73,
  aux_sym_string_token2 = 74,
  sym__newline = 75,
  sym__indent = 76,
  sym__dedent = 77,
  sym_python_block = 78,
  sym_source_file = 79,
  sym__statement = 80,
  sym__comment_line = 81,
  sym__block_colon = 82,
  sym__block = 83,
  sym__label_name = 84,
  sym__store_name = 85,
  sym_label_statement = 86,
  sym_parameter_list = 87,
  sym_jump_statement = 88,
  sym_call_statement = 89,
  sym_return_statement = 90,
  sym_pass_statement = 91,
  sym_menu_statement = 92,
  sym_menu_caption = 93,
  sym_menu_set = 94,
  sym_menu_choice = 95,
  sym_if_statement = 96,
  sym_elif_clause = 97,
  sym_else_clause = 98,
  sym_while_statement = 99,
  sym_for_statement = 100,
  sym_say_statement = 101,
  sym_python_statement = 102,
  sym_init_python_statement = 103,
  sym_dollar_statement = 104,
  sym_define_statement = 105,
  sym_default_statement = 106,
  sym_image_statement = 107,
  sym_scene_statement = 108,
  sym_show_statement = 109,
  sym_show_screen_statement = 110,
  sym_hide_screen_statement = 111,
  sym_call_screen_statement = 112,
  sym_hide_statement = 113,
  sym_with_statement = 114,
  sym_play_statement = 115,
  sym_queue_statement = 116,
  sym_stop_statement = 117,
  sym_voice_statement = 118,
  sym__audio_file = 119,
  sym_screen_statement = 120,
  sym_screen_language_statement = 121,
  sym__screen_condition = 122,
  sym__screen_line_end = 123,
  sym__positional_property = 124,
  sym__keyword_property = 125,
  sym_transform_statement = 126,
  sym__atl_block = 127,
  sym__atl_statement = 128,
  sym_atl_transform_property = 129,
  sym_atl_displayable = 130,
  sym_atl_with_statement = 131,
  sym_atl_block_statement = 132,
  sym_atl_time_statement = 133,
  sym_expression_statement = 134,
  sym_unknown_statement = 135,
  sym_translate_statement = 136,
  sym_style_statement = 137,
  sym_style_property_statement = 138,
  sym_camera_statement = 139,
  sym_layeredimage_statement = 140,
  sym_nvl_statement = 141,
  sym_string = 142,
  aux_sym_source_file_repeat1 = 143,
  aux_sym_menu_statement_repeat1 = 144,
  aux_sym_menu_caption_repeat1 = 145,
  aux_sym_if_statement_repeat1 = 146,
  aux_sym_screen_statement_repeat1 = 147,
  aux_sym_screen_language_statement_repeat1 = 148,
  aux_sym_screen_language_statement_repeat2 = 149,
  aux_sym__atl_block_repeat1 = 150,
  aux_sym_style_statement_repeat1 = 151,
};

static const char * const ts_symbol_names[] = {
  [ts_builtin_sym_end] = "end",
  [sym_identifier] = "identifier",
  [sym_comment] = "comment",
  [sym_expression] = "expression",
  [anon_sym_COLON] = ":",
  [sym__dotted_label_name] = "identifier",
  [sym__dotted_store_name] = "identifier",
  [anon_sym_label] = "label",
  [anon_sym_hide] = "hide",
  [anon_sym_global] = "global",
  [anon_sym_LPAREN] = "(",
  [anon_sym_RPAREN] = ")",
  [sym__parameter_blob] = "expression",
  [anon_sym_jump] = "jump",
  [anon_sym_expression] = "expression",
  [anon_sym_call] = "call",
  [anon_sym_from] = "from",
  [anon_sym_return] = "return",
  [anon_sym_pass] = "pass",
  [anon_sym_menu] = "menu",
  [anon_sym_set] = "set",
  [anon_sym_if] = "if",
  [anon_sym_elif] = "elif",
  [anon_sym_else] = "else",
  [anon_sym_while] = "while",
  [anon_sym_for] = "for",
  [anon_sym_in] = "in",
  [sym__for_target_blob] = "expression",
  [anon_sym_with] = "with",
  [anon_sym_python] = "python",
  [anon_sym_early] = "early",
  [anon_sym_init] = "init",
  [aux_sym_init_python_statement_token1] = "expression",
  [anon_sym_DOLLAR] = "$",
  [anon_sym_define] = "define",
  [anon_sym_EQ] = "=",
  [anon_sym_default] = "default",
  [anon_sym_image] = "image",
  [anon_sym_scene] = "scene",
  [anon_sym_at] = "at",
  [anon_sym_show] = "show",
  [anon_sym_as] = "as",
  [sym__at_expr_blob] = "expression",
  [anon_sym_screen] = "screen",
  [anon_sym_nopredict] = "nopredict",
  [anon_sym_play] = "play",
  [anon_sym_queue] = "queue",
  [anon_sym_stop] = "stop",
  [anon_sym_voice] = "voice",
  [anon_sym_sustain] = "sustain",
  [sym__audio_name] = "expression",
  [sym__audio_list] = "expression",
  [anon_sym_showif] = "identifier",
  [sym__screen_string] = "string",
  [sym__screen_value] = "expression",
  [sym__screen_value_list] = "expression",
  [anon_sym_transform] = "transform",
  [anon_sym_parallel] = "parallel",
  [anon_sym_contains] = "contains",
  [anon_sym_choice] = "choice",
  [anon_sym_block] = "block",
  [anon_sym_repeat] = "repeat",
  [anon_sym_pause] = "pause",
  [anon_sym_time] = "time",
  [anon_sym_translate] = "translate",
  [anon_sym_strings] = "strings",
  [anon_sym_style] = "style",
  [anon_sym_is] = "is",
  [anon_sym_take] = "take",
  [anon_sym_camera] = "camera",
  [anon_sym_layeredimage] = "layeredimage",
  [anon_sym_nvl] = "nvl",
  [anon_sym_clear] = "clear",
  [aux_sym_string_token1] = "string_token1",
  [aux_sym_string_token2] = "string_token2",
  [sym__newline] = "_newline",
  [sym__indent] = "_indent",
  [sym__dedent] = "_dedent",
  [sym_python_block] = "python_block",
  [sym_source_file] = "source_file",
  [sym__statement] = "_statement",
  [sym__comment_line] = "_comment_line",
  [sym__block_colon] = "_block_colon",
  [sym__block] = "_block",
  [sym__label_name] = "_label_name",
  [sym__store_name] = "_store_name",
  [sym_label_statement] = "label_statement",
  [sym_parameter_list] = "parameter_list",
  [sym_jump_statement] = "jump_statement",
  [sym_call_statement] = "call_statement",
  [sym_return_statement] = "return_statement",
  [sym_pass_statement] = "pass_statement",
  [sym_menu_statement] = "menu_statement",
  [sym_menu_caption] = "menu_caption",
  [sym_menu_set] = "menu_set",
  [sym_menu_choice] = "menu_choice",
  [sym_if_statement] = "if_statement",
  [sym_elif_clause] = "elif_clause",
  [sym_else_clause] = "else_clause",
  [sym_while_statement] = "while_statement",
  [sym_for_statement] = "for_statement",
  [sym_say_statement] = "say_statement",
  [sym_python_statement] = "python_statement",
  [sym_init_python_statement] = "init_python_statement",
  [sym_dollar_statement] = "dollar_statement",
  [sym_define_statement] = "define_statement",
  [sym_default_statement] = "default_statement",
  [sym_image_statement] = "image_statement",
  [sym_scene_statement] = "scene_statement",
  [sym_show_statement] = "show_statement",
  [sym_show_screen_statement] = "show_screen_statement",
  [sym_hide_screen_statement] = "hide_screen_statement",
  [sym_call_screen_statement] = "call_screen_statement",
  [sym_hide_statement] = "hide_statement",
  [sym_with_statement] = "with_statement",
  [sym_play_statement] = "play_statement",
  [sym_queue_statement] = "queue_statement",
  [sym_stop_statement] = "stop_statement",
  [sym_voice_statement] = "voice_statement",
  [sym__audio_file] = "_audio_file",
  [sym_screen_statement] = "screen_statement",
  [sym_screen_language_statement] = "screen_language_statement",
  [sym__screen_condition] = "property",
  [sym__screen_line_end] = "_screen_line_end",
  [sym__positional_property] = "_positional_property",
  [sym__keyword_property] = "property",
  [sym_transform_statement] = "transform_statement",
  [sym__atl_block] = "_atl_block",
  [sym__atl_statement] = "_atl_statement",
  [sym_atl_transform_property] = "atl_transform_property",
  [sym_atl_displayable] = "atl_displayable",
  [sym_atl_with_statement] = "atl_with_statement",
  [sym_atl_block_statement] = "atl_block_statement",
  [sym_atl_time_statement] = "atl_time_statement",
  [sym_expression_statement] = "expression_statement",
  [sym_unknown_statement] = "unknown_statement",
  [sym_translate_statement] = "translate_statement",
  [sym_style_statement] = "style_statement",
  [sym_style_property_statement] = "style_property_statement",
  [sym_camera_statement] = "camera_statement",
  [sym_layeredimage_statement] = "layeredimage_statement",
  [sym_nvl_statement] = "nvl_statement",
  [sym_string] = "string",
  [aux_sym_source_file_repeat1] = "source_file_repeat1",
  [aux_sym_menu_statement_repeat1] = "menu_statement_repeat1",
  [aux_sym_menu_caption_repeat1] = "menu_caption_repeat1",
  [aux_sym_if_statement_repeat1] = "if_statement_repeat1",
  [aux_sym_screen_statement_repeat1] = "screen_statement_repeat1",
  [aux_sym_screen_language_statement_repeat1] = "screen_language_statement_repeat1",
  [aux_sym_screen_language_statement_repeat2] = "screen_language_statement_repeat2",
  [aux_sym__atl_block_repeat1] = "_atl_block_repeat1",
  [aux_sym_style_statement_repeat1] = "style_statement_repeat1",
};

static const TSSymbol ts_symbol_map[] = {
  [ts_builtin_sym_end] = ts_builtin_sym_end,
  [sym_identifier] = sym_identifier,
  [sym_comment] = sym_comment,
  [sym_expression] = sym_expression,
  [anon_sym_COLON] = anon_sym_COLON,
  [sym__dotted_label_name] = sym_identifier,
  [sym__dotted_store_name] = sym_identifier,
  [anon_sym_label] = anon_sym_label,
  [anon_sym_hide] = anon_sym_hide,
  [anon_sym_global] = anon_sym_global,
  [anon_sym_LPAREN] = anon_sym_LPAREN,
  [anon_sym_RPAREN] = anon_sym_RPAREN,
  [sym__parameter_blob] = sym_expression,
  [anon_sym_jump] = anon_sym_jump,
  [anon_sym_expression] = anon_sym_expression,
  [anon_sym_call] = anon_sym_call,
  [anon_sym_from] = anon_sym_from,
  [anon_sym_return] = anon_sym_return,
  [anon_sym_pass] = anon_sym_pass,
  [anon_sym_menu] = anon_sym_menu,
  [anon_sym_set] = anon_sym_set,
  [anon_sym_if] = anon_sym_if,
  [anon_sym_elif] = anon_sym_elif,
  [anon_sym_else] = anon_sym_else,
  [anon_sym_while] = anon_sym_while,
  [anon_sym_for] = anon_sym_for,
  [anon_sym_in] = anon_sym_in,
  [sym__for_target_blob] = sym_expression,
  [anon_sym_with] = anon_sym_with,
  [anon_sym_python] = anon_sym_python,
  [anon_sym_early] = anon_sym_early,
  [anon_sym_init] = anon_sym_init,
  [aux_sym_init_python_statement_token1] = sym_expression,
  [anon_sym_DOLLAR] = anon_sym_DOLLAR,
  [anon_sym_define] = anon_sym_define,
  [anon_sym_EQ] = anon_sym_EQ,
  [anon_sym_default] = anon_sym_default,
  [anon_sym_image] = anon_sym_image,
  [anon_sym_scene] = anon_sym_scene,
  [anon_sym_at] = anon_sym_at,
  [anon_sym_show] = anon_sym_show,
  [anon_sym_as] = anon_sym_as,
  [sym__at_expr_blob] = sym_expression,
  [anon_sym_screen] = anon_sym_screen,
  [anon_sym_nopredict] = anon_sym_nopredict,
  [anon_sym_play] = anon_sym_play,
  [anon_sym_queue] = anon_sym_queue,
  [anon_sym_stop] = anon_sym_stop,
  [anon_sym_voice] = anon_sym_voice,
  [anon_sym_sustain] = anon_sym_sustain,
  [sym__audio_name] = sym_expression,
  [sym__audio_list] = sym_expression,
  [anon_sym_showif] = sym_identifier,
  [sym__screen_string] = sym_string,
  [sym__screen_value] = sym_expression,
  [sym__screen_value_list] = sym_expression,
  [anon_sym_transform] = anon_sym_transform,
  [anon_sym_parallel] = anon_sym_parallel,
  [anon_sym_contains] = anon_sym_contains,
  [anon_sym_choice] = anon_sym_choice,
  [anon_sym_block] = anon_sym_block,
  [anon_sym_repeat] = anon_sym_repeat,
  [anon_sym_pause] = anon_sym_pause,
  [anon_sym_time] = anon_sym_time,
  [anon_sym_translate] = anon_sym_translate,
  [anon_sym_strings] = anon_sym_strings,
  [anon_sym_style] = anon_sym_style,
  [anon_sym_is] = anon_sym_is,
  [anon_sym_take] = anon_sym_take,
  [anon_sym_camera] = anon_sym_camera,
  [anon_sym_layeredimage] = anon_sym_layeredimage,
  [anon_sym_nvl] = anon_sym_nvl,
  [anon_sym_clear] = anon_sym_clear,
  [aux_sym_string_token1] = aux_sym_string_token1,
  [aux_sym_string_token2] = aux_sym_string_token2,
  [sym__newline] = sym__newline,
  [sym__indent] = sym__indent,
  [sym__dedent] = sym__dedent,
  [sym_python_block] = sym_python_block,
  [sym_source_file] = sym_source_file,
  [sym__statement] = sym__statement,
  [sym__comment_line] = sym__comment_line,
  [sym__block_colon] = sym__block_colon,
  [sym__block] = sym__block,
  [sym__label_name] = sym__label_name,
  [sym__store_name] = sym__store_name,
  [sym_label_statement] = sym_label_statement,
  [sym_parameter_list] = sym_parameter_list,
  [sym_jump_statement] = sym_jump_statement,
  [sym_call_statement] = sym_call_statement,
  [sym_return_statement] = sym_return_statement,
  [sym_pass_statement] = sym_pass_statement,
  [sym_menu_statement] = sym_menu_statement,
  [sym_menu_caption] = sym_menu_caption,
  [sym_menu_set] = sym_menu_set,
  [sym_menu_choice] = sym_menu_choice,
  [sym_if_statement] = sym_if_statement,
  [sym_elif_clause] = sym_elif_clause,
  [sym_else_clause] = sym_else_clause,
  [sym_while_statement] = sym_while_statement,
  [sym_for_statement] = sym_for_statement,
  [sym_say_statement] = sym_say_statement,
  [sym_python_statement] = sym_python_statement,
  [sym_init_python_statement] = sym_init_python_statement,
  [sym_dollar_statement] = sym_dollar_statement,
  [sym_define_statement] = sym_define_statement,
  [sym_default_statement] = sym_default_statement,
  [sym_image_statement] = sym_image_statement,
  [sym_scene_statement] = sym_scene_statement,
  [sym_show_statement] = sym_show_statement,
  [sym_show_screen_statement] = sym_show_screen_statement,
  [sym_hide_screen_statement] = sym_hide_screen_statement,
  [sym_call_screen_statement] = sym_call_screen_statement,
  [sym_hide_statement] = sym_hide_statement,
  [sym_with_statement] = sym_with_statement,
  [sym_play_statement] = sym_play_statement,
  [sym_queue_statement] = sym_queue_statement,
  [sym_stop_statement] = sym_stop_statement,
  [sym_voice_statement] = sym_voice_statement,
  [sym__audio_file] = sym__audio_file,
  [sym_screen_statement] = sym_screen_statement,
  [sym_screen_language_statement] = sym_screen_language_statement,
  [sym__screen_condition] = sym__screen_condition,
  [sym__screen_line_end] = sym__screen_line_end,
  [sym__positional_property] = sym__positional_property,
  [sym__keyword_property] = sym__screen_condition,
  [sym_transform_statement] = sym_transform_statement,
  [sym__atl_block] = sym__atl_block,
  [sym__atl_statement] = sym__atl_statement,
  [sym_atl_transform_property] = sym_atl_transform_property,
  [sym_atl_displayable] = sym_atl_displayable,
  [sym_atl_with_statement] = sym_atl_with_statement,
  [sym_atl_block_statement] = sym_atl_block_statement,
  [sym_atl_time_statement] = sym_atl_time_statement,
  [sym_expression_statement] = sym_expression_statement,
  [sym_unknown_statement] = sym_unknown_statement,
  [sym_translate_statement] = sym_translate_statement,
  [sym_style_statement] = sym_style_statement,
  [sym_style_property_statement] = sym_style_property_statement,
  [sym_camera_statement] = sym_camera_statement,
  [sym_layeredimage_statement] = sym_layeredimage_statement,
  [sym_nvl_statement] = sym_nvl_statement,
  [sym_string] = sym_string,
  [aux_sym_source_file_repeat1] = aux_sym_source_file_repeat1,
  [aux_sym_menu_statement_repeat1] = aux_sym_menu_statement_repeat1,
  [aux_sym_menu_caption_repeat1] = aux_sym_menu_caption_repeat1,
  [aux_sym_if_statement_repeat1] = aux_sym_if_statement_repeat1,
  [aux_sym_screen_statement_repeat1] = aux_sym_screen_statement_repeat1,
  [aux_sym_screen_language_statement_repeat1] = aux_sym_screen_language_statement_repeat1,
  [aux_sym_screen_language_statement_repeat2] = aux_sym_screen_language_statement_repeat2,
  [aux_sym__atl_block_repeat1] = aux_sym__atl_block_repeat1,
  [aux_sym_style_statement_repeat1] = aux_sym_style_statement_repeat1,
};

static const TSSymbolMetadata ts_symbol_metadata[] = {
  [ts_builtin_sym_end] = {
    .visible = false,
    .named = true,
  },
  [sym_identifier] = {
    .visible = true,
    .named = true,
  },
  [sym_comment] = {
    .visible = true,
    .named = true,
  },
  [sym_expression] = {
    .visible = true,
    .named = true,
  },
  [anon_sym_COLON] = {
    .visible = true,
    .named = false,
  },
  [sym__dotted_label_name] = {
    .visible = true,
    .named = true,
  },
  [sym__dotted_store_name] = {
    .visible = true,
    .named = true,
  },
  [anon_sym_label] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_hide] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_global] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_LPAREN] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_RPAREN] = {
    .visible = true,
    .named = false,
  },
  [sym__parameter_blob] = {
    .visible = true,
    .named = true,
  },
  [anon_sym_jump] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_expression] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_call] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_from] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_return] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_pass] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_menu] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_set] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_if] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_elif] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_else] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_while] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_for] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_in] = {
    .visible = true,
    .named = false,
  },
  [sym__for_target_blob] = {
    .visible = true,
    .named = true,
  },
  [anon_sym_with] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_python] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_early] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_init] = {
    .visible = true,
    .named = false,
  },
  [aux_sym_init_python_statement_token1] = {
    .visible = true,
    .named = true,
  },
  [anon_sym_DOLLAR] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_define] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_EQ] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_default] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_image] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_scene] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_at] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_show] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_as] = {
    .visible = true,
    .named = false,
  },
  [sym__at_expr_blob] = {
    .visible = true,
    .named = true,
  },
  [anon_sym_screen] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_nopredict] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_play] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_queue] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_stop] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_voice] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_sustain] = {
    .visible = true,
    .named = false,
  },
  [sym__audio_name] = {
    .visible = true,
    .named = true,
  },
  [sym__audio_list] = {
    .visible = true,
    .named = true,
  },
  [anon_sym_showif] = {
    .visible = true,
    .named = true,
  },
  [sym__screen_string] = {
    .visible = true,
    .named = true,
  },
  [sym__screen_value] = {
    .visible = true,
    .named = true,
  },
  [sym__screen_value_list] = {
    .visible = true,
    .named = true,
  },
  [anon_sym_transform] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_parallel] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_contains] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_choice] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_block] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_repeat] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_pause] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_time] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_translate] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_strings] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_style] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_is] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_take] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_camera] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_layeredimage] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_nvl] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_clear] = {
    .visible = true,
    .named = false,
  },
  [aux_sym_string_token1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_string_token2] = {
    .visible = false,
    .named = false,
  },
  [sym__newline] = {
    .visible = false,
    .named = true,
  },
  [sym__indent] = {
    .visible = false,
    .named = true,
  },
  [sym__dedent] = {
    .visible = false,
    .named = true,
  },
  [sym_python_block] = {
    .visible = true,
    .named = true,
  },
  [sym_source_file] = {
    .visible = true,
    .named = true,
  },
  [sym__statement] = {
    .visible = false,
    .named = true,
  },
  [sym__comment_line] = {
    .visible = false,
    .named = true,
  },
  [sym__block_colon] = {
    .visible = false,
    .named = true,
  },
  [sym__block] = {
    .visible = false,
    .named = true,
  },
  [sym__label_name] = {
    .visible = false,
    .named = true,
  },
  [sym__store_name] = {
    .visible = false,
    .named = true,
  },
  [sym_label_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_parameter_list] = {
    .visible = true,
    .named = true,
  },
  [sym_jump_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_call_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_return_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_pass_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_menu_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_menu_caption] = {
    .visible = true,
    .named = true,
  },
  [sym_menu_set] = {
    .visible = true,
    .named = true,
  },
  [sym_menu_choice] = {
    .visible = true,
    .named = true,
  },
  [sym_if_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_elif_clause] = {
    .visible = true,
    .named = true,
  },
  [sym_else_clause] = {
    .visible = true,
    .named = true,
  },
  [sym_while_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_for_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_say_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_python_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_init_python_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_dollar_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_define_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_default_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_image_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_scene_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_show_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_show_screen_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_hide_screen_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_call_screen_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_hide_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_with_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_play_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_queue_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_stop_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_voice_statement] = {
    .visible = true,
    .named = true,
  },
  [sym__audio_file] = {
    .visible = false,
    .named = true,
  },
  [sym_screen_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_screen_language_statement] = {
    .visible = true,
    .named = true,
  },
  [sym__screen_condition] = {
    .visible = true,
    .named = true,
  },
  [sym__screen_line_end] = {
    .visible = false,
    .named = true,
  },
  [sym__positional_property] = {
    .visible = false,
    .named = true,
  },
  [sym__keyword_property] = {
    .visible = true,
    .named = true,
  },
  [sym_transform_statement] = {
    .visible = true,
    .named = true,
  },
  [sym__atl_block] = {
    .visible = false,
    .named = true,
  },
  [sym__atl_statement] = {
    .visible = false,
    .named = true,
  },
  [sym_atl_transform_property] = {
    .visible = true,
    .named = true,
  },
  [sym_atl_displayable] = {
    .visible = true,
    .named = true,
  },
  [sym_atl_with_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_atl_block_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_atl_time_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_expression_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_unknown_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_translate_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_style_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_style_property_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_camera_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_layeredimage_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_nvl_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_string] = {
    .visible = true,
    .named = true,
  },
  [aux_sym_source_file_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_menu_statement_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_menu_caption_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_if_statement_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_screen_statement_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_screen_language_statement_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_screen_language_statement_repeat2] = {
    .visible = false,
    .named = false,
  },
  [aux_sym__atl_block_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_style_statement_repeat1] = {
    .visible = false,
    .named = false,
  },
};

enum ts_field_identifiers {
  field_arguments = 1,
  field_as_name = 2,
  field_at_expr = 3,
  field_atl = 4,
  field_attributes = 5,
  field_body = 6,
  field_channel = 7,
  field_character = 8,
  field_condition = 9,
  field_displayable = 10,
  field_duration = 11,
  field_expression = 12,
  field_file = 13,
  field_from_label = 14,
  field_image = 15,
  field_iterable = 16,
  field_label = 17,
  field_language = 18,
  field_layer = 19,
  field_name = 20,
  field_options = 21,
  field_parameters = 22,
  field_parent = 23,
  field_priority = 24,
  field_properties = 25,
  field_property = 26,
  field_scope = 27,
  field_store = 28,
  field_take_from = 29,
  field_target = 30,
  field_text = 31,
  field_transition = 32,
  field_value = 33,
  field_variable = 34,
  field_warper = 35,
  field_widget_tag = 36,
};

static const char * const ts_field_names[] = {
  [0] = NULL,
  [field_arguments] = "arguments",
  [field_as_name] = "as_name",
  [field_at_expr] = "at_expr",
  [field_atl] = "atl",
  [field_attributes] = "attributes",
  [field_body] = "body",
  [field_channel] = "channel",
  [field_character] = "character",
  [field_condition] = "condition",
  [field_displayable] = "displayable",
  [field_duration] = "duration",
  [field_expression] = "expression",
  [field_file] = "file",
  [field_from_label] = "from_label",
  [field_image] = "image",
  [field_iterable] = "iterable",
  [field_label] = "label",
  [field_language] = "language",
  [field_layer] = "layer",
  [field_name] = "name",
  [field_options] = "options",
  [field_parameters] = "parameters",
  [field_parent] = "parent",
  [field_priority] = "priority",
  [field_properties] = "properties",
  [field_property] = "property",
  [field_scope] = "scope",
  [field_store] = "store",
  [field_take_from] = "take_from",
  [field_target] = "target",
  [field_text] = "text",
  [field_transition] = "transition",
  [field_value] = "value",
  [field_variable] = "variable",
  [field_warper] = "warper",
  [field_widget_tag] = "widget_tag",
};

static const TSFieldMapSlice ts_field_map_slices[PRODUCTION_ID_COUNT] = {
  [1] = {.index = 0, .length = 1},
  [2] = {.index = 1, .length = 2},
  [3] = {.index = 3, .length = 1},
  [4] = {.index = 4, .length = 3},
  [5] = {.index = 7, .length = 1},
  [6] = {.index = 8, .length = 1},
  [7] = {.index = 9, .length = 1},
  [8] = {.index = 10, .length = 1},
  [9] = {.index = 11, .length = 1},
  [10] = {.index = 12, .length = 1},
  [11] = {.index = 13, .length = 1},
  [12] = {.index = 14, .length = 2},
  [13] = {.index = 16, .length = 2},
  [14] = {.index = 18, .length = 1},
  [15] = {.index = 19, .length = 1},
  [16] = {.index = 20, .length = 1},
  [17] = {.index = 21, .length = 2},
  [18] = {.index = 23, .length = 3},
  [19] = {.index = 26, .length = 2},
  [20] = {.index = 28, .length = 1},
  [21] = {.index = 29, .length = 1},
  [22] = {.index = 30, .length = 1},
  [23] = {.index = 31, .length = 1},
  [24] = {.index = 32, .length = 1},
  [25] = {.index = 33, .length = 2},
  [26] = {.index = 35, .length = 1},
  [27] = {.index = 36, .length = 2},
  [28] = {.index = 38, .length = 2},
  [29] = {.index = 40, .length = 2},
  [30] = {.index = 42, .length = 2},
  [31] = {.index = 44, .length = 4},
  [32] = {.index = 48, .length = 2},
  [33] = {.index = 50, .length = 2},
  [34] = {.index = 52, .length = 2},
  [35] = {.index = 54, .length = 2},
  [36] = {.index = 56, .length = 1},
  [37] = {.index = 57, .length = 1},
  [38] = {.index = 58, .length = 2},
  [39] = {.index = 60, .length = 3},
  [40] = {.index = 63, .length = 2},
  [41] = {.index = 65, .length = 3},
  [42] = {.index = 68, .length = 2},
  [43] = {.index = 70, .length = 3},
  [44] = {.index = 73, .length = 3},
  [45] = {.index = 76, .length = 2},
  [46] = {.index = 78, .length = 2},
  [47] = {.index = 80, .length = 2},
  [48] = {.index = 82, .length = 1},
  [49] = {.index = 83, .length = 1},
  [50] = {.index = 84, .length = 2},
  [51] = {.index = 86, .length = 2},
  [52] = {.index = 88, .length = 3},
  [53] = {.index = 91, .length = 1},
  [54] = {.index = 92, .length = 2},
  [55] = {.index = 94, .length = 3},
  [56] = {.index = 97, .length = 1},
  [57] = {.index = 98, .length = 2},
  [58] = {.index = 100, .length = 1},
  [59] = {.index = 101, .length = 1},
  [60] = {.index = 102, .length = 2},
  [61] = {.index = 104, .length = 2},
  [62] = {.index = 106, .length = 2},
  [63] = {.index = 108, .length = 1},
  [64] = {.index = 109, .length = 1},
  [65] = {.index = 110, .length = 3},
  [66] = {.index = 113, .length = 4},
  [67] = {.index = 117, .length = 3},
  [68] = {.index = 120, .length = 4},
  [69] = {.index = 124, .length = 3},
  [70] = {.index = 127, .length = 4},
  [72] = {.index = 131, .length = 1},
  [73] = {.index = 132, .length = 1},
  [74] = {.index = 133, .length = 3},
  [75] = {.index = 136, .length = 3},
  [76] = {.index = 139, .length = 3},
  [77] = {.index = 142, .length = 2},
  [78] = {.index = 144, .length = 1},
  [79] = {.index = 145, .length = 2},
  [80] = {.index = 147, .length = 2},
  [81] = {.index = 149, .length = 2},
  [82] = {.index = 151, .length = 2},
  [83] = {.index = 153, .length = 2},
  [84] = {.index = 155, .length = 2},
  [85] = {.index = 106, .length = 2},
  [86] = {.index = 157, .length = 2},
  [87] = {.index = 159, .length = 3},
  [88] = {.index = 162, .length = 2},
  [89] = {.index = 164, .length = 4},
  [90] = {.index = 168, .length = 5},
  [91] = {.index = 173, .length = 3},
  [92] = {.index = 176, .length = 2},
  [93] = {.index = 178, .length = 2},
  [94] = {.index = 180, .length = 2},
  [95] = {.index = 182, .length = 3},
  [96] = {.index = 185, .length = 3},
  [97] = {.index = 188, .length = 3},
};

static const TSFieldMapEntry ts_field_map_entries[] = {
  [0] =
    {field_text, 0},
  [1] =
    {field_character, 0},
    {field_text, 1},
  [3] =
    {field_atl, 1},
  [4] =
    {field_attributes, 1},
    {field_character, 0},
    {field_text, 2},
  [7] =
    {field_name, 1},
  [8] =
    {field_image, 1},
  [9] =
    {field_target, 1},
  [10] =
    {field_value, 1},
  [11] =
    {field_condition, 1},
  [12] =
    {field_transition, 1},
  [13] =
    {field_expression, 1},
  [14] =
    {field_atl, 2},
    {field_name, 1},
  [16] =
    {field_atl, 2},
    {field_image, 1},
  [18] =
    {field_channel, 1},
  [19] =
    {field_file, 1},
  [20] =
    {field_layer, 1},
  [21] =
    {field_text, 0},
    {field_transition, 2},
  [23] =
    {field_character, 0},
    {field_text, 1},
    {field_transition, 3},
  [26] =
    {field_name, 1},
    {field_parameters, 2},
  [28] =
    {field_name, 2},
  [29] =
    {field_target, 2},
  [30] =
    {field_store, 2},
  [31] =
    {field_priority, 1},
  [32] =
    {field_transition, 2},
  [33] =
    {field_atl, 3},
    {field_transition, 2},
  [35] =
    {field_at_expr, 2},
  [36] =
    {field_at_expr, 2},
    {field_atl, 3},
  [38] =
    {field_channel, 1},
    {field_file, 2},
  [40] =
    {field_channel, 1},
    {field_options, 2},
  [42] =
    {field_language, 1},
    {field_scope, 2},
  [44] =
    {field_attributes, 1},
    {field_character, 0},
    {field_text, 2},
    {field_transition, 4},
  [48] =
    {field_image, 1},
    {field_transition, 3},
  [50] =
    {field_from_label, 3},
    {field_target, 1},
  [52] =
    {field_arguments, 3},
    {field_name, 2},
  [54] =
    {field_iterable, 3},
    {field_variable, 1},
  [56] =
    {field_store, 3},
  [57] =
    {field_body, 3},
  [58] =
    {field_name, 1},
    {field_value, 3},
  [60] =
    {field_atl, 4},
    {field_image, 1},
    {field_transition, 3},
  [63] =
    {field_at_expr, 3},
    {field_image, 1},
  [65] =
    {field_at_expr, 3},
    {field_atl, 4},
    {field_image, 1},
  [68] =
    {field_as_name, 3},
    {field_image, 1},
  [70] =
    {field_as_name, 3},
    {field_atl, 4},
    {field_image, 1},
  [73] =
    {field_channel, 1},
    {field_file, 2},
    {field_options, 3},
  [76] =
    {field_at_expr, 3},
    {field_layer, 1},
  [78] =
    {field_name, 2},
    {field_transition, 4},
  [80] =
    {field_from_label, 4},
    {field_target, 2},
  [82] =
    {field_body, 4},
  [83] =
    {field_store, 4},
  [84] =
    {field_priority, 1},
    {field_store, 4},
  [86] =
    {field_at_expr, 2},
    {field_transition, 4},
  [88] =
    {field_at_expr, 2},
    {field_atl, 5},
    {field_transition, 4},
  [91] =
    {field_displayable, 0},
  [92] =
    {field_name, 2},
    {field_transition, 5},
  [94] =
    {field_arguments, 3},
    {field_name, 2},
    {field_transition, 5},
  [97] =
    {field_label, 1},
  [98] =
    {field_body, 5},
    {field_store, 2},
  [100] =
    {field_body, 5},
  [101] =
    {field_store, 5},
  [102] =
    {field_priority, 1},
    {field_store, 5},
  [104] =
    {field_body, 5},
    {field_priority, 1},
  [106] =
    {field_property, 0},
    {field_value, 1},
  [108] =
    {field_warper, 1},
  [109] =
    {field_duration, 1},
  [110] =
    {field_at_expr, 3},
    {field_image, 1},
    {field_transition, 5},
  [113] =
    {field_at_expr, 3},
    {field_atl, 6},
    {field_image, 1},
    {field_transition, 5},
  [117] =
    {field_as_name, 5},
    {field_at_expr, 3},
    {field_image, 1},
  [120] =
    {field_as_name, 5},
    {field_at_expr, 3},
    {field_atl, 6},
    {field_image, 1},
  [124] =
    {field_as_name, 3},
    {field_image, 1},
    {field_transition, 5},
  [127] =
    {field_as_name, 3},
    {field_atl, 6},
    {field_image, 1},
    {field_transition, 5},
  [131] =
    {field_widget_tag, 0},
  [132] =
    {field_properties, 0},
  [133] =
    {field_name, 0, .inherited = true},
    {field_properties, 0},
    {field_value, 0, .inherited = true},
  [136] =
    {field_arguments, 3},
    {field_name, 2},
    {field_transition, 6},
  [139] =
    {field_condition, 1},
    {field_condition, 2},
    {field_text, 0},
  [142] =
    {field_body, 6},
    {field_store, 3},
  [144] =
    {field_body, 6},
  [145] =
    {field_body, 6},
    {field_priority, 1},
  [147] =
    {field_priority, 1},
    {field_store, 6},
  [149] =
    {field_name, 0},
    {field_value, 1},
  [151] =
    {field_properties, 1, .inherited = true},
    {field_widget_tag, 0},
  [153] =
    {field_properties, 0, .inherited = true},
    {field_properties, 1, .inherited = true},
  [155] =
    {field_properties, 1},
    {field_widget_tag, 0},
  [157] =
    {field_body, 7},
    {field_store, 4},
  [159] =
    {field_body, 7},
    {field_priority, 1},
    {field_store, 4},
  [162] =
    {field_body, 7},
    {field_priority, 1},
  [164] =
    {field_as_name, 5},
    {field_at_expr, 3},
    {field_image, 1},
    {field_transition, 7},
  [168] =
    {field_as_name, 5},
    {field_at_expr, 3},
    {field_atl, 8},
    {field_image, 1},
    {field_transition, 7},
  [173] =
    {field_properties, 1, .inherited = true},
    {field_properties, 2, .inherited = true},
    {field_widget_tag, 0},
  [176] =
    {field_name, 1},
    {field_parent, 3},
  [178] =
    {field_name, 1},
    {field_take_from, 3},
  [180] =
    {field_body, 8},
    {field_store, 5},
  [182] =
    {field_body, 8},
    {field_priority, 1},
    {field_store, 5},
  [185] =
    {field_body, 9},
    {field_priority, 1},
    {field_store, 6},
  [188] =
    {field_name, 1},
    {field_parent, 3},
    {field_take_from, 5},
};

static const TSSymbol ts_alias_sequences[PRODUCTION_ID_COUNT][MAX_ALIAS_SEQUENCE_LENGTH] = {
  [0] = {0},
  [71] = {
    [0] = sym_expression,
  },
  [73] = {
    [0] = sym__screen_condition,
  },
  [84] = {
    [0] = sym_identifier,
  },
  [85] = {
    [1] = sym_expression,
  },
};

static const uint16_t ts_non_terminal_alias_map[] = {
  sym__positional_property, 2,
    sym__positional_property,
    sym__screen_condition,
  sym_string, 2,
    sym_string,
    sym_expression,
  0,
};

static const TSStateId ts_primary_state_ids[STATE_COUNT] = {
  [0] = 0,
  [1] = 1,
  [2] = 2,
  [3] = 3,
  [4] = 4,
  [5] = 5,
  [6] = 4,
  [7] = 5,
  [8] = 8,
  [9] = 5,
  [10] = 5,
  [11] = 5,
  [12] = 12,
  [13] = 12,
  [14] = 12,
  [15] = 12,
  [16] = 12,
  [17] = 17,
  [18] = 18,
  [19] = 18,
  [20] = 17,
  [21] = 21,
  [22] = 21,
  [23] = 23,
  [24] = 24,
  [25] = 25,
  [26] = 26,
  [27] = 23,
  [28] = 26,
  [29] = 24,
  [30] = 25,
  [31] = 31,
  [32] = 32,
  [33] = 33,
  [34] = 33,
  [35] = 31,
  [36] = 36,
  [37] = 37,
  [38] = 38,
  [39] = 39,
  [40] = 40,
  [41] = 41,
  [42] = 42,
  [43] = 43,
  [44] = 44,
  [45] = 45,
  [46] = 46,
  [47] = 47,
  [48] = 48,
  [49] = 49,
  [50] = 50,
  [51] = 51,
  [52] = 52,
  [53] = 53,
  [54] = 54,
  [55] = 55,
  [56] = 56,
  [57] = 57,
  [58] = 58,
  [59] = 59,
  [60] = 60,
  [61] = 61,
  [62] = 62,
  [63] = 36,
  [64] = 64,
  [65] = 65,
  [66] = 66,
  [67] = 67,
  [68] = 64,
  [69] = 69,
  [70] = 25,
  [71] = 71,
  [72] = 72,
  [73] = 73,
  [74] = 74,
  [75] = 75,
  [76] = 76,
  [77] = 23,
  [78] = 78,
  [79] = 79,
  [80] = 80,
  [81] = 42,
  [82] = 62,
  [83] = 79,
  [84] = 66,
  [85] = 67,
  [86] = 86,
  [87] = 69,
  [88] = 80,
  [89] = 89,
  [90] = 90,
  [91] = 91,
  [92] = 37,
  [93] = 38,
  [94] = 39,
  [95] = 40,
  [96] = 41,
  [97] = 86,
  [98] = 65,
  [99] = 43,
  [100] = 44,
  [101] = 45,
  [102] = 46,
  [103] = 47,
  [104] = 48,
  [105] = 49,
  [106] = 50,
  [107] = 51,
  [108] = 52,
  [109] = 53,
  [110] = 54,
  [111] = 55,
  [112] = 56,
  [113] = 61,
  [114] = 57,
  [115] = 58,
  [116] = 59,
  [117] = 60,
  [118] = 32,
  [119] = 26,
  [120] = 24,
  [121] = 25,
  [122] = 23,
  [123] = 123,
  [124] = 89,
  [125] = 90,
  [126] = 71,
  [127] = 91,
  [128] = 72,
  [129] = 73,
  [130] = 74,
  [131] = 75,
  [132] = 26,
  [133] = 76,
  [134] = 24,
  [135] = 78,
  [136] = 123,
  [137] = 137,
  [138] = 138,
  [139] = 139,
  [140] = 140,
  [141] = 141,
  [142] = 142,
  [143] = 143,
  [144] = 144,
  [145] = 145,
  [146] = 146,
  [147] = 147,
  [148] = 148,
  [149] = 149,
  [150] = 150,
  [151] = 151,
  [152] = 152,
  [153] = 153,
  [154] = 154,
  [155] = 155,
  [156] = 156,
  [157] = 157,
  [158] = 158,
  [159] = 159,
  [160] = 160,
  [161] = 161,
  [162] = 162,
  [163] = 163,
  [164] = 164,
  [165] = 165,
  [166] = 166,
  [167] = 167,
  [168] = 168,
  [169] = 169,
  [170] = 170,
  [171] = 171,
  [172] = 172,
  [173] = 173,
  [174] = 174,
  [175] = 137,
  [176] = 176,
  [177] = 177,
  [178] = 178,
  [179] = 179,
  [180] = 180,
  [181] = 181,
  [182] = 182,
  [183] = 183,
  [184] = 184,
  [185] = 185,
  [186] = 186,
  [187] = 187,
  [188] = 188,
  [189] = 189,
  [190] = 190,
  [191] = 191,
  [192] = 192,
  [193] = 193,
  [194] = 194,
  [195] = 195,
  [196] = 196,
  [197] = 197,
  [198] = 198,
  [199] = 199,
  [200] = 200,
  [201] = 201,
  [202] = 202,
  [203] = 203,
  [204] = 202,
  [205] = 205,
  [206] = 146,
  [207] = 207,
  [208] = 205,
  [209] = 209,
  [210] = 209,
  [211] = 211,
  [212] = 212,
  [213] = 213,
  [214] = 151,
  [215] = 215,
  [216] = 147,
  [217] = 157,
  [218] = 218,
  [219] = 219,
  [220] = 207,
  [221] = 221,
  [222] = 215,
  [223] = 218,
  [224] = 219,
  [225] = 225,
  [226] = 226,
  [227] = 227,
  [228] = 228,
  [229] = 229,
  [230] = 230,
  [231] = 231,
  [232] = 232,
  [233] = 233,
  [234] = 234,
  [235] = 235,
  [236] = 236,
  [237] = 237,
  [238] = 238,
  [239] = 138,
  [240] = 140,
  [241] = 141,
  [242] = 142,
  [243] = 143,
  [244] = 145,
  [245] = 225,
  [246] = 226,
  [247] = 159,
  [248] = 161,
  [249] = 162,
  [250] = 163,
  [251] = 164,
  [252] = 182,
  [253] = 184,
  [254] = 186,
  [255] = 201,
  [256] = 256,
  [257] = 257,
  [258] = 258,
  [259] = 259,
  [260] = 260,
  [261] = 261,
  [262] = 262,
  [263] = 221,
  [264] = 227,
  [265] = 230,
  [266] = 231,
  [267] = 238,
  [268] = 203,
  [269] = 269,
  [270] = 256,
  [271] = 257,
  [272] = 258,
  [273] = 259,
  [274] = 260,
  [275] = 261,
  [276] = 262,
  [277] = 269,
  [278] = 228,
  [279] = 279,
  [280] = 280,
  [281] = 281,
  [282] = 282,
  [283] = 283,
  [284] = 284,
  [285] = 285,
  [286] = 279,
  [287] = 287,
  [288] = 280,
  [289] = 281,
  [290] = 282,
  [291] = 291,
  [292] = 283,
  [293] = 284,
  [294] = 285,
  [295] = 295,
  [296] = 296,
  [297] = 297,
  [298] = 298,
  [299] = 299,
  [300] = 300,
  [301] = 301,
  [302] = 302,
  [303] = 303,
  [304] = 304,
  [305] = 305,
  [306] = 306,
  [307] = 307,
  [308] = 308,
  [309] = 309,
  [310] = 229,
  [311] = 311,
  [312] = 312,
  [313] = 313,
  [314] = 287,
  [315] = 315,
  [316] = 316,
  [317] = 317,
  [318] = 318,
  [319] = 319,
  [320] = 320,
  [321] = 211,
  [322] = 212,
  [323] = 139,
  [324] = 213,
  [325] = 291,
  [326] = 232,
  [327] = 233,
  [328] = 144,
  [329] = 234,
  [330] = 235,
  [331] = 236,
  [332] = 148,
  [333] = 149,
  [334] = 150,
  [335] = 335,
  [336] = 152,
  [337] = 153,
  [338] = 154,
  [339] = 155,
  [340] = 156,
  [341] = 295,
  [342] = 158,
  [343] = 296,
  [344] = 160,
  [345] = 297,
  [346] = 298,
  [347] = 299,
  [348] = 165,
  [349] = 166,
  [350] = 167,
  [351] = 168,
  [352] = 169,
  [353] = 170,
  [354] = 171,
  [355] = 172,
  [356] = 173,
  [357] = 174,
  [358] = 300,
  [359] = 176,
  [360] = 177,
  [361] = 178,
  [362] = 179,
  [363] = 180,
  [364] = 181,
  [365] = 301,
  [366] = 183,
  [367] = 302,
  [368] = 185,
  [369] = 303,
  [370] = 187,
  [371] = 188,
  [372] = 189,
  [373] = 190,
  [374] = 191,
  [375] = 304,
  [376] = 192,
  [377] = 193,
  [378] = 194,
  [379] = 195,
  [380] = 196,
  [381] = 197,
  [382] = 198,
  [383] = 199,
  [384] = 200,
  [385] = 305,
  [386] = 306,
  [387] = 307,
  [388] = 308,
  [389] = 309,
  [390] = 33,
  [391] = 237,
  [392] = 311,
  [393] = 312,
  [394] = 313,
  [395] = 33,
  [396] = 315,
  [397] = 316,
  [398] = 317,
  [399] = 318,
  [400] = 319,
  [401] = 320,
  [402] = 335,
  [403] = 403,
  [404] = 404,
  [405] = 405,
  [406] = 403,
  [407] = 407,
  [408] = 408,
  [409] = 407,
  [410] = 202,
  [411] = 411,
  [412] = 412,
  [413] = 413,
  [414] = 414,
  [415] = 415,
  [416] = 416,
  [417] = 417,
  [418] = 416,
  [419] = 417,
  [420] = 420,
  [421] = 421,
  [422] = 422,
  [423] = 423,
  [424] = 424,
  [425] = 425,
  [426] = 426,
  [427] = 426,
  [428] = 424,
  [429] = 422,
  [430] = 430,
  [431] = 431,
  [432] = 431,
  [433] = 433,
  [434] = 434,
  [435] = 435,
  [436] = 435,
  [437] = 437,
  [438] = 438,
  [439] = 437,
  [440] = 433,
  [441] = 438,
  [442] = 442,
  [443] = 442,
  [444] = 444,
  [445] = 445,
  [446] = 446,
  [447] = 447,
  [448] = 448,
  [449] = 449,
  [450] = 450,
  [451] = 450,
  [452] = 452,
  [453] = 452,
  [454] = 454,
  [455] = 455,
  [456] = 456,
  [457] = 455,
  [458] = 456,
  [459] = 26,
  [460] = 24,
  [461] = 25,
  [462] = 23,
  [463] = 463,
  [464] = 464,
  [465] = 465,
  [466] = 466,
  [467] = 466,
  [468] = 468,
  [469] = 469,
  [470] = 470,
  [471] = 471,
  [472] = 472,
  [473] = 473,
  [474] = 474,
  [475] = 475,
  [476] = 476,
  [477] = 468,
  [478] = 33,
  [479] = 479,
  [480] = 480,
  [481] = 481,
  [482] = 482,
  [483] = 483,
  [484] = 481,
  [485] = 485,
  [486] = 486,
  [487] = 487,
  [488] = 470,
  [489] = 474,
  [490] = 456,
  [491] = 480,
  [492] = 492,
  [493] = 485,
  [494] = 487,
  [495] = 476,
  [496] = 473,
  [497] = 483,
  [498] = 486,
  [499] = 499,
  [500] = 500,
  [501] = 501,
  [502] = 502,
  [503] = 503,
  [504] = 504,
  [505] = 505,
  [506] = 506,
  [507] = 507,
  [508] = 508,
  [509] = 509,
  [510] = 510,
  [511] = 511,
  [512] = 512,
  [513] = 513,
  [514] = 504,
  [515] = 515,
  [516] = 505,
  [517] = 513,
  [518] = 499,
  [519] = 510,
  [520] = 520,
  [521] = 521,
  [522] = 522,
  [523] = 509,
  [524] = 524,
  [525] = 525,
  [526] = 526,
  [527] = 520,
  [528] = 511,
  [529] = 502,
  [530] = 500,
  [531] = 531,
  [532] = 531,
  [533] = 533,
  [534] = 534,
  [535] = 524,
  [536] = 536,
  [537] = 515,
  [538] = 521,
  [539] = 522,
  [540] = 512,
  [541] = 526,
  [542] = 534,
  [543] = 543,
  [544] = 544,
  [545] = 545,
  [546] = 546,
  [547] = 547,
  [548] = 544,
  [549] = 549,
  [550] = 543,
  [551] = 551,
  [552] = 552,
  [553] = 546,
  [554] = 554,
  [555] = 555,
  [556] = 556,
  [557] = 557,
  [558] = 558,
  [559] = 559,
  [560] = 560,
  [561] = 561,
  [562] = 545,
  [563] = 554,
  [564] = 564,
  [565] = 549,
  [566] = 551,
  [567] = 560,
  [568] = 561,
  [569] = 558,
  [570] = 570,
  [571] = 547,
  [572] = 555,
  [573] = 556,
  [574] = 557,
  [575] = 570,
  [576] = 576,
  [577] = 577,
  [578] = 577,
  [579] = 559,
  [580] = 564,
  [581] = 576,
  [582] = 582,
  [583] = 583,
  [584] = 583,
  [585] = 585,
  [586] = 586,
  [587] = 587,
  [588] = 588,
  [589] = 589,
  [590] = 590,
  [591] = 591,
  [592] = 592,
  [593] = 593,
  [594] = 594,
  [595] = 533,
  [596] = 508,
  [597] = 597,
  [598] = 598,
  [599] = 599,
  [600] = 600,
  [601] = 601,
  [602] = 602,
  [603] = 603,
  [604] = 604,
  [605] = 605,
  [606] = 606,
  [607] = 607,
  [608] = 608,
  [609] = 609,
  [610] = 610,
  [611] = 611,
  [612] = 612,
  [613] = 605,
  [614] = 614,
  [615] = 615,
  [616] = 594,
  [617] = 590,
  [618] = 618,
  [619] = 619,
  [620] = 604,
  [621] = 621,
  [622] = 585,
  [623] = 623,
  [624] = 588,
  [625] = 625,
  [626] = 626,
  [627] = 614,
  [628] = 628,
  [629] = 629,
  [630] = 589,
  [631] = 586,
  [632] = 609,
  [633] = 633,
  [634] = 628,
  [635] = 601,
  [636] = 636,
  [637] = 598,
  [638] = 599,
  [639] = 639,
  [640] = 593,
  [641] = 641,
  [642] = 626,
  [643] = 602,
  [644] = 644,
  [645] = 639,
  [646] = 646,
  [647] = 619,
  [648] = 591,
  [649] = 587,
  [650] = 633,
  [651] = 592,
  [652] = 652,
  [653] = 629,
  [654] = 641,
  [655] = 606,
  [656] = 615,
  [657] = 621,
  [658] = 618,
  [659] = 636,
  [660] = 600,
  [661] = 652,
  [662] = 603,
  [663] = 610,
  [664] = 608,
  [665] = 623,
  [666] = 625,
  [667] = 597,
  [668] = 668,
  [669] = 669,
  [670] = 670,
  [671] = 671,
  [672] = 672,
  [673] = 673,
  [674] = 674,
  [675] = 672,
  [676] = 676,
  [677] = 670,
  [678] = 678,
  [679] = 679,
  [680] = 668,
  [681] = 681,
  [682] = 682,
  [683] = 678,
  [684] = 684,
  [685] = 684,
  [686] = 686,
  [687] = 686,
  [688] = 688,
  [689] = 689,
  [690] = 690,
  [691] = 691,
  [692] = 692,
  [693] = 693,
  [694] = 694,
  [695] = 695,
  [696] = 688,
  [697] = 690,
  [698] = 698,
  [699] = 699,
  [700] = 700,
  [701] = 701,
  [702] = 702,
  [703] = 703,
  [704] = 693,
  [705] = 679,
  [706] = 691,
  [707] = 707,
  [708] = 32,
  [709] = 709,
  [710] = 698,
  [711] = 709,
  [712] = 669,
  [713] = 713,
  [714] = 689,
  [715] = 715,
  [716] = 702,
  [717] = 703,
  [718] = 695,
  [719] = 715,
  [720] = 713,
  [721] = 721,
  [722] = 674,
  [723] = 699,
  [724] = 671,
  [725] = 721,
  [726] = 700,
  [727] = 692,
  [728] = 673,
  [729] = 681,
  [730] = 707,
  [731] = 701,
  [732] = 732,
  [733] = 733,
  [734] = 734,
  [735] = 735,
  [736] = 736,
  [737] = 737,
  [738] = 738,
  [739] = 739,
  [740] = 740,
  [741] = 741,
  [742] = 742,
  [743] = 743,
  [744] = 744,
  [745] = 745,
  [746] = 746,
  [747] = 747,
  [748] = 748,
  [749] = 749,
  [750] = 750,
  [751] = 751,
  [752] = 752,
  [753] = 753,
  [754] = 754,
  [755] = 755,
  [756] = 756,
  [757] = 757,
  [758] = 758,
  [759] = 759,
  [760] = 760,
  [761] = 761,
  [762] = 762,
  [763] = 763,
  [764] = 764,
  [765] = 765,
  [766] = 766,
  [767] = 767,
  [768] = 741,
  [769] = 769,
  [770] = 770,
  [771] = 771,
  [772] = 772,
  [773] = 735,
  [774] = 774,
  [775] = 775,
  [776] = 776,
  [777] = 777,
  [778] = 778,
  [779] = 779,
  [780] = 780,
  [781] = 781,
  [782] = 782,
  [783] = 783,
  [784] = 784,
  [785] = 785,
  [786] = 786,
  [787] = 787,
  [788] = 788,
  [789] = 789,
  [790] = 790,
  [791] = 791,
  [792] = 792,
  [793] = 769,
  [794] = 794,
  [795] = 795,
  [796] = 740,
  [797] = 797,
  [798] = 798,
  [799] = 786,
  [800] = 800,
  [801] = 801,
  [802] = 802,
  [803] = 803,
  [804] = 804,
  [805] = 789,
  [806] = 806,
  [807] = 807,
  [808] = 790,
  [809] = 809,
  [810] = 758,
  [811] = 732,
  [812] = 812,
  [813] = 813,
  [814] = 752,
  [815] = 748,
  [816] = 770,
  [817] = 817,
  [818] = 783,
  [819] = 802,
  [820] = 820,
  [821] = 821,
  [822] = 784,
  [823] = 778,
  [824] = 788,
  [825] = 792,
  [826] = 826,
  [827] = 763,
  [828] = 828,
  [829] = 829,
  [830] = 830,
  [831] = 831,
  [832] = 832,
  [833] = 744,
  [834] = 747,
  [835] = 772,
  [836] = 836,
  [837] = 821,
  [838] = 828,
  [839] = 829,
  [840] = 840,
  [841] = 841,
  [842] = 842,
  [843] = 843,
  [844] = 844,
  [845] = 742,
  [846] = 846,
  [847] = 847,
  [848] = 848,
  [849] = 776,
  [850] = 850,
  [851] = 830,
  [852] = 831,
  [853] = 853,
  [854] = 854,
  [855] = 855,
  [856] = 856,
  [857] = 857,
  [858] = 858,
  [859] = 859,
  [860] = 860,
  [861] = 861,
  [862] = 862,
  [863] = 863,
  [864] = 864,
  [865] = 865,
  [866] = 866,
  [867] = 854,
  [868] = 743,
  [869] = 749,
  [870] = 761,
  [871] = 836,
  [872] = 848,
  [873] = 873,
  [874] = 874,
  [875] = 760,
  [876] = 876,
  [877] = 877,
  [878] = 878,
  [879] = 879,
  [880] = 855,
  [881] = 881,
  [882] = 841,
  [883] = 846,
  [884] = 884,
  [885] = 856,
  [886] = 763,
  [887] = 887,
  [888] = 888,
  [889] = 889,
  [890] = 877,
  [891] = 891,
  [892] = 781,
  [893] = 759,
  [894] = 754,
  [895] = 853,
  [896] = 896,
  [897] = 878,
  [898] = 765,
  [899] = 899,
  [900] = 782,
  [901] = 791,
  [902] = 902,
  [903] = 903,
  [904] = 794,
  [905] = 813,
  [906] = 876,
  [907] = 865,
  [908] = 733,
  [909] = 734,
  [910] = 750,
  [911] = 858,
  [912] = 912,
  [913] = 896,
  [914] = 775,
  [915] = 915,
  [916] = 879,
  [917] = 881,
  [918] = 889,
  [919] = 912,
  [920] = 915,
  [921] = 921,
  [922] = 922,
  [923] = 923,
  [924] = 924,
  [925] = 925,
  [926] = 745,
  [927] = 927,
  [928] = 862,
  [929] = 924,
  [930] = 807,
  [931] = 863,
  [932] = 812,
  [933] = 899,
  [934] = 842,
  [935] = 859,
  [936] = 936,
  [937] = 774,
  [938] = 785,
  [939] = 787,
  [940] = 797,
  [941] = 798,
  [942] = 803,
  [943] = 943,
  [944] = 944,
  [945] = 945,
  [946] = 840,
  [947] = 947,
  [948] = 948,
  [949] = 891,
  [950] = 950,
  [951] = 951,
  [952] = 952,
  [953] = 903,
  [954] = 795,
  [955] = 873,
  [956] = 755,
  [957] = 738,
  [958] = 751,
  [959] = 847,
  [960] = 864,
  [961] = 806,
  [962] = 902,
  [963] = 948,
  [964] = 771,
  [965] = 780,
  [966] = 736,
  [967] = 737,
  [968] = 766,
  [969] = 820,
  [970] = 921,
  [971] = 826,
  [972] = 739,
  [973] = 804,
  [974] = 888,
  [975] = 936,
  [976] = 777,
  [977] = 817,
  [978] = 800,
  [979] = 860,
  [980] = 861,
  [981] = 922,
  [982] = 947,
  [983] = 843,
  [984] = 779,
  [985] = 884,
  [986] = 801,
  [987] = 923,
  [988] = 874,
  [989] = 887,
  [990] = 809,
  [991] = 767,
};

static TSCharacterRange sym__at_expr_blob_character_set_2[] = {
  {0, '\t'}, {0x0b, '\f'}, {0x0e, '"'}, {'$', '('}, {'*', '+'}, {'-', '9'}, {';', '\\'}, {'^', '|'},
  {'~', 0x10ffff},
};

static bool ts_lex(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      if (eof) ADVANCE(644);
      ADVANCE_MAP(
        '"', 867,
        '#', 645,
        '$', 676,
        '\'', 870,
        '(', 670,
        ')', 671,
        '-', 661,
        ':', 667,
        '=', 677,
      );
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(0);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(675);
      if (('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(657);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n') ADVANCE(663);
      END_STATE();
    case 1:
      if (lookahead == '\r') SKIP(1);
      if (lookahead == ')') ADVANCE(671);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(672);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '#') ADVANCE(673);
      END_STATE();
    case 2:
      ADVANCE_MAP(
        '!', 488,
        '*', 480,
        '/', 485,
        '<', 517,
        '=', 488,
        '>', 516,
        'a', 499,
        'i', 498,
        'n', 506,
        'o', 509,
        '\t', 2,
        ' ', 2,
        '%', 515,
        '&', 515,
        '+', 515,
        '-', 515,
        '@', 515,
        '^', 515,
        '|', 515,
      );
      END_STATE();
    case 3:
      ADVANCE_MAP(
        '!', 733,
        '"', 27,
        '\'', 363,
        '*', 731,
        '/', 732,
        '<', 742,
        '=', 733,
        '>', 741,
        'a', 735,
        'i', 736,
        'n', 737,
        'o', 738,
        '\t', 3,
        ' ', 3,
        '(', 60,
        '[', 60,
        '{', 60,
        '%', 743,
        '&', 743,
        '+', 743,
        '-', 743,
        '@', 743,
        '^', 743,
        '|', 743,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 4:
      ADVANCE_MAP(
        '!', 267,
        '"', 120,
        '*', 261,
        '/', 264,
        '<', 295,
        '=', 267,
        '>', 294,
        '\\', 548,
        'a', 278,
        'i', 276,
        'n', 285,
        'o', 288,
        '\t', 4,
        ' ', 4,
        '%', 296,
        '&', 296,
        '+', 296,
        '-', 296,
        '@', 296,
        '^', 296,
        '|', 296,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 5:
      ADVANCE_MAP(
        '!', 423,
        '\'', 398,
        '*', 417,
        '/', 420,
        '<', 452,
        '=', 423,
        '>', 451,
        '\\', 549,
        'a', 434,
        'i', 432,
        'n', 441,
        'o', 444,
        '\t', 5,
        ' ', 5,
        '%', 453,
        '&', 453,
        '+', 453,
        '-', 453,
        '@', 453,
        '^', 453,
        '|', 453,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 6:
      ADVANCE_MAP(
        '!', 765,
        '"', 84,
        '\'', 246,
        '*', 763,
        '/', 764,
        '<', 774,
        '=', 765,
        '>', 773,
        '\\', 761,
        'a', 767,
        'i', 768,
        'n', 769,
        'o', 770,
        '\t', 6,
        ' ', 6,
        '(', 109,
        '[', 109,
        '{', 109,
        '#', 306,
        ')', 306,
        ',', 306,
        ':', 306,
        ']', 306,
        '}', 306,
        '%', 775,
        '&', 775,
        '+', 775,
        '-', 775,
        '@', 775,
        '^', 775,
        '|', 775,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(772);
      END_STATE();
    case 7:
      ADVANCE_MAP(
        '!', 794,
        '"', 36,
        '\'', 368,
        '*', 792,
        ',', 178,
        '/', 793,
        '<', 803,
        '=', 794,
        '>', 802,
        'a', 796,
        'i', 797,
        'n', 798,
        'o', 799,
        '\t', 7,
        ' ', 7,
        '(', 171,
        '[', 171,
        '{', 171,
        '%', 804,
        '&', 804,
        '+', 804,
        '-', 804,
        '@', 804,
        '^', 804,
        '|', 804,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 8:
      ADVANCE_MAP(
        '!', 840,
        '"', 38,
        '\'', 369,
        '*', 838,
        ',', 178,
        '/', 839,
        '<', 848,
        '=', 840,
        '>', 847,
        'a', 842,
        'i', 843,
        'n', 844,
        'o', 845,
        '\t', 8,
        ' ', 8,
        '(', 182,
        '[', 182,
        '{', 182,
        '%', 849,
        '&', 849,
        '+', 849,
        '-', 849,
        '@', 849,
        '^', 849,
        '|', 849,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 9:
      ADVANCE_MAP(
        '!', 853,
        '"', 67,
        '\'', 319,
        '*', 851,
        ',', 193,
        '/', 852,
        '<', 861,
        '=', 853,
        '>', 860,
        '\\', 864,
        'a', 855,
        'i', 856,
        'n', 857,
        'o', 858,
        '\t', 9,
        ' ', 9,
        '(', 205,
        '[', 205,
        '{', 205,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
        '%', 862,
        '&', 862,
        '+', 862,
        '-', 862,
        '@', 862,
        '^', 862,
        '|', 862,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(863);
      END_STATE();
    case 10:
      ADVANCE_MAP(
        '!', 808,
        '"', 66,
        '\'', 316,
        '*', 806,
        ',', 193,
        '/', 807,
        '<', 817,
        '=', 808,
        '>', 816,
        '\\', 805,
        'a', 810,
        'i', 811,
        'n', 812,
        'o', 813,
        '\t', 10,
        ' ', 10,
        '(', 199,
        '[', 199,
        '{', 199,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
        '%', 818,
        '&', 818,
        '+', 818,
        '-', 818,
        '@', 818,
        '^', 818,
        '|', 818,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(815);
      END_STATE();
    case 11:
      ADVANCE_MAP(
        '!', 748,
        '"', 71,
        '\'', 387,
        '*', 746,
        '/', 747,
        '<', 757,
        '=', 748,
        '>', 756,
        '\\', 745,
        'a', 750,
        'i', 751,
        'n', 752,
        'o', 753,
        '\t', 11,
        ' ', 11,
        '(', 73,
        '[', 73,
        '{', 73,
        '#', 462,
        ')', 462,
        ',', 462,
        ':', 462,
        ']', 462,
        '}', 462,
        '%', 758,
        '&', 758,
        '+', 758,
        '-', 758,
        '@', 758,
        '^', 758,
        '|', 758,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(755);
      END_STATE();
    case 12:
      ADVANCE_MAP(
        '!', 825,
        '"', 59,
        '\'', 383,
        '*', 823,
        ',', 172,
        '/', 824,
        '<', 833,
        '=', 825,
        '>', 832,
        '\\', 836,
        'a', 827,
        'i', 828,
        'n', 829,
        'o', 830,
        '\t', 12,
        ' ', 12,
        '(', 189,
        '[', 189,
        '{', 189,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
        '%', 834,
        '&', 834,
        '+', 834,
        '-', 834,
        '@', 834,
        '^', 834,
        '|', 834,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(835);
      END_STATE();
    case 13:
      ADVANCE_MAP(
        '!', 780,
        '"', 253,
        '\'', 382,
        '*', 778,
        ',', 172,
        '/', 779,
        '<', 789,
        '=', 780,
        '>', 788,
        '\\', 777,
        'a', 782,
        'i', 783,
        'n', 784,
        'o', 785,
        '\t', 13,
        ' ', 13,
        '(', 175,
        '[', 175,
        '{', 175,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
        '%', 790,
        '&', 790,
        '+', 790,
        '-', 790,
        '@', 790,
        '^', 790,
        '|', 790,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(787);
      END_STATE();
    case 14:
      ADVANCE_MAP(
        '!', 489,
        '*', 481,
        ',', 178,
        '/', 486,
        '<', 525,
        '=', 489,
        '>', 524,
        'a', 502,
        'i', 501,
        'n', 507,
        'o', 510,
        '\t', 14,
        ' ', 14,
        '%', 523,
        '&', 523,
        '+', 523,
        '-', 523,
        '@', 523,
        '^', 523,
        '|', 523,
      );
      END_STATE();
    case 15:
      ADVANCE_MAP(
        '!', 268,
        '"', 120,
        '*', 262,
        ',', 193,
        '/', 265,
        '<', 302,
        '=', 268,
        '>', 301,
        '\\', 548,
        'a', 281,
        'i', 279,
        'n', 286,
        'o', 289,
        '\t', 15,
        ' ', 15,
        '%', 303,
        '&', 303,
        '+', 303,
        '-', 303,
        '@', 303,
        '^', 303,
        '|', 303,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 16:
      ADVANCE_MAP(
        '!', 424,
        '\'', 398,
        '*', 418,
        ',', 172,
        '/', 421,
        '<', 458,
        '=', 424,
        '>', 457,
        '\\', 549,
        'a', 437,
        'i', 435,
        'n', 442,
        'o', 445,
        '\t', 16,
        ' ', 16,
        '%', 459,
        '&', 459,
        '+', 459,
        '-', 459,
        '@', 459,
        '^', 459,
        '|', 459,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 17:
      ADVANCE_MAP(
        '!', 490,
        '*', 482,
        ',', 178,
        '/', 487,
        '<', 522,
        '=', 490,
        '>', 521,
        'a', 505,
        'i', 504,
        'n', 508,
        'o', 511,
        '\t', 17,
        ' ', 17,
        '%', 520,
        '&', 520,
        '+', 520,
        '-', 520,
        '@', 520,
        '^', 520,
        '|', 520,
      );
      END_STATE();
    case 18:
      ADVANCE_MAP(
        '!', 269,
        '"', 120,
        '*', 263,
        ',', 193,
        '/', 266,
        '<', 299,
        '=', 269,
        '>', 298,
        '\\', 548,
        'a', 284,
        'i', 282,
        'n', 287,
        'o', 290,
        '\t', 18,
        ' ', 18,
        '%', 300,
        '&', 300,
        '+', 300,
        '-', 300,
        '@', 300,
        '^', 300,
        '|', 300,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 19:
      ADVANCE_MAP(
        '!', 425,
        '\'', 398,
        '*', 419,
        ',', 172,
        '/', 422,
        '<', 455,
        '=', 425,
        '>', 454,
        '\\', 549,
        'a', 440,
        'i', 438,
        'n', 443,
        'o', 446,
        '\t', 19,
        ' ', 19,
        '%', 456,
        '&', 456,
        '+', 456,
        '-', 456,
        '@', 456,
        '^', 456,
        '|', 456,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 20:
      if (lookahead == '"') ADVANCE(867);
      if (lookahead == '\'') ADVANCE(870);
      if (lookahead == ':') ADVANCE(667);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(20);
      if (('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(657);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(663);
      END_STATE();
    case 21:
      if (lookahead == '"') ADVANCE(867);
      if (lookahead == '\'') ADVANCE(870);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(21);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '"' &&
          lookahead != '#' &&
          lookahead != ':') ADVANCE(663);
      END_STATE();
    case 22:
      if (lookahead == '"') ADVANCE(660);
      if (lookahead == '\'') ADVANCE(664);
      if (lookahead == '.') ADVANCE(662);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(22);
      if (('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(655);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '"' &&
          lookahead != '#' &&
          lookahead != ':') ADVANCE(663);
      END_STATE();
    case 23:
      if (lookahead == '"') ADVANCE(660);
      if (lookahead == '\'') ADVANCE(664);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(23);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '"' &&
          lookahead != '#' &&
          lookahead != ':') ADVANCE(663);
      END_STATE();
    case 24:
      if (lookahead == '"') ADVANCE(660);
      if (lookahead == '\'') ADVANCE(664);
      if (lookahead == '\t' ||
          lookahead == ' ' ||
          lookahead == ':') ADVANCE(24);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(663);
      END_STATE();
    case 25:
      if (lookahead == '"') ADVANCE(28);
      if (lookahead == '\'') ADVANCE(408);
      if (lookahead == ')') ADVANCE(671);
      if (lookahead == ':') ADVANCE(667);
      if (lookahead == 'n') ADVANCE(646);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(25);
      if (lookahead == '(' ||
          lookahead == '[' ||
          lookahead == '{') ADVANCE(60);
      if (('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(648);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '"' &&
          lookahead != '#' &&
          lookahead != ',' &&
          lookahead != ']' &&
          lookahead != '}') ADVANCE(740);
      END_STATE();
    case 26:
      if (lookahead == '"') ADVANCE(60);
      if (lookahead == '\\') ADVANCE(537);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(26);
      END_STATE();
    case 27:
      if (lookahead == '"') ADVANCE(740);
      if (lookahead == '\\') ADVANCE(534);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(27);
      END_STATE();
    case 28:
      if (lookahead == '"') ADVANCE(692);
      if (lookahead == '\\') ADVANCE(632);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(327);
      END_STATE();
    case 29:
      if (lookahead == '"') ADVANCE(819);
      if (lookahead == '\\') ADVANCE(540);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(29);
      END_STATE();
    case 30:
      if (lookahead == '"') ADVANCE(98);
      if (lookahead == '\\') ADVANCE(550);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(30);
      END_STATE();
    case 31:
      if (lookahead == '"') ADVANCE(717);
      if (lookahead == '\'') ADVANCE(772);
      if (lookahead == '\\') ADVANCE(533);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(246);
      END_STATE();
    case 32:
      if (lookahead == '"') ADVANCE(681);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 33:
      ADVANCE_MAP(
        '"', 682,
        '#', 306,
        '\'', 254,
        '\\', 125,
        '(', 133,
        '[', 133,
        '{', 133,
        ')', 772,
        ']', 772,
        '}', 772,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(109);
      END_STATE();
    case 34:
      if (lookahead == '"') ADVANCE(690);
      if (lookahead == '\\') ADVANCE(554);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(247);
      END_STATE();
    case 35:
      if (lookahead == '"') ADVANCE(699);
      if (lookahead == '\\') ADVANCE(563);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(248);
      END_STATE();
    case 36:
      if (lookahead == '"') ADVANCE(801);
      if (lookahead == '\\') ADVANCE(568);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(36);
      END_STATE();
    case 37:
      if (lookahead == '"') ADVANCE(705);
      if (lookahead == '\\') ADVANCE(623);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(331);
      END_STATE();
    case 38:
      if (lookahead == '"') ADVANCE(850);
      if (lookahead == '\\') ADVANCE(577);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(38);
      END_STATE();
    case 39:
      if (lookahead == '"') ADVANCE(820);
      if (lookahead == '\\') ADVANCE(574);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(39);
      END_STATE();
    case 40:
      if (lookahead == '"') ADVANCE(239);
      if (lookahead == '\\') ADVANCE(641);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(40);
      END_STATE();
    case 41:
      if (lookahead == '"') ADVANCE(678);
      if (lookahead == '\\') ADVANCE(613);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(41);
      END_STATE();
    case 42:
      if (lookahead == '"') ADVANCE(868);
      if (lookahead == '\'') ADVANCE(871);
      if (lookahead == '(') ADVANCE(670);
      if (lookahead == '-') ADVANCE(530);
      if (lookahead == ':') ADVANCE(667);
      if (lookahead == '=') ADVANCE(677);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(42);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(675);
      if (('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(657);
      END_STATE();
    case 43:
      if (lookahead == '"') ADVANCE(868);
      if (lookahead == '\'') ADVANCE(871);
      if (lookahead == '(') ADVANCE(670);
      if (lookahead == ':') ADVANCE(667);
      if (lookahead == '=') ADVANCE(677);
      if (lookahead == '[') ADVANCE(239);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(43);
      if (('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(654);
      END_STATE();
    case 44:
      if (lookahead == '"') ADVANCE(868);
      if (lookahead == '\'') ADVANCE(871);
      if (lookahead == '[') ADVANCE(239);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(44);
      if (('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(679);
      END_STATE();
    case 45:
      ADVANCE_MAP(
        '"', 27,
        '\'', 363,
        'n', 737,
        '\t', 45,
        ' ', 45,
        '(', 60,
        '[', 60,
        '{', 60,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 46:
      if (lookahead == '"') ADVANCE(82);
      if (lookahead == '\\') ADVANCE(543);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(46);
      END_STATE();
    case 47:
      ADVANCE_MAP(
        '"', 71,
        '\'', 387,
        '\\', 745,
        'n', 752,
        '\t', 47,
        ' ', 47,
        '(', 73,
        '[', 73,
        '{', 73,
        '#', 462,
        ')', 462,
        ',', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(755);
      END_STATE();
    case 48:
      if (lookahead == '"') ADVANCE(73);
      if (lookahead == '\'') ADVANCE(682);
      if (lookahead == '\\') ADVANCE(542);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(50);
      END_STATE();
    case 49:
      if (lookahead == '"') ADVANCE(73);
      if (lookahead == '\'') ADVANCE(48);
      if (lookahead == '\\') ADVANCE(542);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(50);
      END_STATE();
    case 50:
      if (lookahead == '"') ADVANCE(73);
      if (lookahead == '\'') ADVANCE(49);
      if (lookahead == '\\') ADVANCE(542);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(50);
      END_STATE();
    case 51:
      if (lookahead == '"') ADVANCE(716);
      if (lookahead == '\'') ADVANCE(109);
      if (lookahead == '\\') ADVANCE(539);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(254);
      END_STATE();
    case 52:
      if (lookahead == '"') ADVANCE(144);
      if (lookahead == '\'') ADVANCE(684);
      if (lookahead == '\\') ADVANCE(560);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(54);
      END_STATE();
    case 53:
      if (lookahead == '"') ADVANCE(144);
      if (lookahead == '\'') ADVANCE(52);
      if (lookahead == '\\') ADVANCE(560);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(54);
      END_STATE();
    case 54:
      if (lookahead == '"') ADVANCE(144);
      if (lookahead == '\'') ADVANCE(53);
      if (lookahead == '\\') ADVANCE(560);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(54);
      END_STATE();
    case 55:
      if (lookahead == '"') ADVANCE(694);
      if (lookahead == '\\') ADVANCE(557);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(255);
      END_STATE();
    case 56:
      if (lookahead == '"') ADVANCE(706);
      if (lookahead == '\\') ADVANCE(594);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(250);
      END_STATE();
    case 57:
      if (lookahead == '"') ADVANCE(835);
      if (lookahead == '\'') ADVANCE(686);
      if (lookahead == '\\') ADVANCE(573);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(59);
      END_STATE();
    case 58:
      if (lookahead == '"') ADVANCE(835);
      if (lookahead == '\'') ADVANCE(57);
      if (lookahead == '\\') ADVANCE(573);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(59);
      END_STATE();
    case 59:
      if (lookahead == '"') ADVANCE(835);
      if (lookahead == '\'') ADVANCE(58);
      if (lookahead == '\\') ADVANCE(573);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(59);
      END_STATE();
    case 60:
      ADVANCE_MAP(
        '"', 26,
        '\'', 362,
        '(', 82,
        '[', 82,
        '{', 82,
        ')', 740,
        ']', 740,
        '}', 740,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(60);
      END_STATE();
    case 61:
      if (lookahead == '"') ADVANCE(90);
      if (lookahead == '\\') ADVANCE(545);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(61);
      END_STATE();
    case 62:
      if (lookahead == '"') ADVANCE(721);
      if (lookahead == '\'') ADVANCE(133);
      if (lookahead == '\\') ADVANCE(547);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(259);
      END_STATE();
    case 63:
      ADVANCE_MAP(
        '"', 689,
        '#', 306,
        '\'', 259,
        '\\', 137,
        '(', 141,
        '[', 141,
        '{', 141,
        ')', 109,
        ']', 109,
        '}', 109,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(133);
      END_STATE();
    case 64:
      if (lookahead == '"') ADVANCE(88);
      if (lookahead == '\\') ADVANCE(563);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(248);
      END_STATE();
    case 65:
      if (lookahead == '"') ADVANCE(696);
      if (lookahead == '\\') ADVANCE(561);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(260);
      END_STATE();
    case 66:
      if (lookahead == '"') ADVANCE(762);
      if (lookahead == '\\') ADVANCE(574);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(39);
      END_STATE();
    case 67:
      if (lookahead == '"') ADVANCE(821);
      if (lookahead == '\\') ADVANCE(594);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(250);
      END_STATE();
    case 68:
      if (lookahead == '"') ADVANCE(171);
      if (lookahead == '\\') ADVANCE(571);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(68);
      END_STATE();
    case 69:
      if (lookahead == '"') ADVANCE(755);
      if (lookahead == '\'') ADVANCE(683);
      if (lookahead == '\\') ADVANCE(536);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(71);
      END_STATE();
    case 70:
      if (lookahead == '"') ADVANCE(755);
      if (lookahead == '\'') ADVANCE(69);
      if (lookahead == '\\') ADVANCE(536);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(71);
      END_STATE();
    case 71:
      if (lookahead == '"') ADVANCE(755);
      if (lookahead == '\'') ADVANCE(70);
      if (lookahead == '\\') ADVANCE(536);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(71);
      END_STATE();
    case 72:
      ADVANCE_MAP(
        '"', 50,
        '#', 462,
        '\'', 716,
        '\\', 74,
        '(', 101,
        '[', 101,
        '{', 101,
        ')', 755,
        ']', 755,
        '}', 755,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(73);
      END_STATE();
    case 73:
      ADVANCE_MAP(
        '"', 50,
        '#', 462,
        '\'', 390,
        '\\', 74,
        '(', 101,
        '[', 101,
        '{', 101,
        ')', 755,
        ']', 755,
        '}', 755,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(73);
      END_STATE();
    case 74:
      ADVANCE_MAP(
        '"', 50,
        '#', 462,
        '\'', 412,
        '(', 101,
        '[', 101,
        '{', 101,
        ')', 755,
        ']', 755,
        '}', 755,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(73);
      END_STATE();
    case 75:
      ADVANCE_MAP(
        '"', 50,
        '#', 462,
        '\'', 366,
        '\\', 74,
        '(', 101,
        '[', 101,
        '{', 101,
        ')', 755,
        ']', 755,
        '}', 755,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(73);
      END_STATE();
    case 76:
      if (lookahead == '"') ADVANCE(101);
      if (lookahead == '\'') ADVANCE(689);
      if (lookahead == '\\') ADVANCE(552);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(78);
      END_STATE();
    case 77:
      if (lookahead == '"') ADVANCE(101);
      if (lookahead == '\'') ADVANCE(76);
      if (lookahead == '\\') ADVANCE(552);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(78);
      END_STATE();
    case 78:
      if (lookahead == '"') ADVANCE(101);
      if (lookahead == '\'') ADVANCE(77);
      if (lookahead == '\\') ADVANCE(552);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(78);
      END_STATE();
    case 79:
      if (lookahead == '"') ADVANCE(722);
      if (lookahead == '\'') ADVANCE(141);
      if (lookahead == '\\') ADVANCE(553);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(308);
      END_STATE();
    case 80:
      ADVANCE_MAP(
        '"', 691,
        '#', 306,
        '\'', 308,
        '\\', 147,
        '(', 152,
        '[', 152,
        '{', 152,
        ')', 133,
        ']', 133,
        '}', 133,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(141);
      END_STATE();
    case 81:
      if (lookahead == '"') ADVANCE(704);
      if (lookahead == '\\') ADVANCE(597);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(309);
      END_STATE();
    case 82:
      ADVANCE_MAP(
        '"', 46,
        '\'', 372,
        '(', 90,
        '[', 90,
        '{', 90,
        ')', 60,
        ']', 60,
        '}', 60,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(82);
      END_STATE();
    case 83:
      if (lookahead == '"') ADVANCE(181);
      if (lookahead == '\\') ADVANCE(579);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(83);
      END_STATE();
    case 84:
      if (lookahead == '"') ADVANCE(760);
      if (lookahead == '\\') ADVANCE(540);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(29);
      END_STATE();
    case 85:
      if (lookahead == '"') ADVANCE(31);
      if (lookahead == '\'') ADVANCE(772);
      if (lookahead == '\\') ADVANCE(533);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(246);
      END_STATE();
    case 86:
      if (lookahead == '"') ADVANCE(33);
      if (lookahead == '\\') ADVANCE(554);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(247);
      END_STATE();
    case 87:
      if (lookahead == '"') ADVANCE(718);
      if (lookahead == '\'') ADVANCE(152);
      if (lookahead == '\\') ADVANCE(559);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(310);
      END_STATE();
    case 88:
      ADVANCE_MAP(
        '"', 684,
        '\'', 310,
        '\\', 158,
        ')', 141,
        ']', 141,
        '}', 141,
        '#', 306,
        '(', 306,
        '[', 306,
        '{', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(152);
      END_STATE();
    case 89:
      if (lookahead == '"') ADVANCE(708);
      if (lookahead == '\\') ADVANCE(600);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(311);
      END_STATE();
    case 90:
      ADVANCE_MAP(
        '"', 61,
        '\'', 377,
        '(', 98,
        '[', 98,
        '{', 98,
        ')', 82,
        ']', 82,
        '}', 82,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(90);
      END_STATE();
    case 91:
      if (lookahead == '"') ADVANCE(182);
      if (lookahead == '\\') ADVANCE(582);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(91);
      END_STATE();
    case 92:
      if (lookahead == '"') ADVANCE(719);
      if (lookahead == '\'') ADVANCE(815);
      if (lookahead == '\\') ADVANCE(565);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(316);
      END_STATE();
    case 93:
      if (lookahead == '"') ADVANCE(707);
      if (lookahead == '\\') ADVANCE(603);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(312);
      END_STATE();
    case 94:
      if (lookahead == '"') ADVANCE(186);
      if (lookahead == '\\') ADVANCE(585);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(94);
      END_STATE();
    case 95:
      if (lookahead == '"') ADVANCE(720);
      if (lookahead == '\'') ADVANCE(863);
      if (lookahead == '\\') ADVANCE(567);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(319);
      END_STATE();
    case 96:
      ADVANCE_MAP(
        '"', 693,
        '#', 306,
        '\'', 320,
        '\\', 206,
        '(', 211,
        '[', 211,
        '{', 211,
        ')', 815,
        ']', 815,
        '}', 815,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(199);
      END_STATE();
    case 97:
      if (lookahead == '"') ADVANCE(710);
      if (lookahead == '\\') ADVANCE(606);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(315);
      END_STATE();
    case 98:
      if (lookahead == '"') ADVANCE(30);
      if (lookahead == '\'') ADVANCE(364);
      if (lookahead == ')' ||
          lookahead == ']' ||
          lookahead == '}') ADVANCE(90);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#' &&
          (lookahead < '\'' || ')' < lookahead) &&
          lookahead != '[' &&
          lookahead != '{') ADVANCE(98);
      END_STATE();
    case 99:
      if (lookahead == '"') ADVANCE(187);
      if (lookahead == '\\') ADVANCE(587);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(99);
      END_STATE();
    case 100:
      ADVANCE_MAP(
        '"', 78,
        '#', 462,
        '\'', 721,
        '\\', 102,
        '(', 128,
        '[', 128,
        '{', 128,
        ')', 73,
        ']', 73,
        '}', 73,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(101);
      END_STATE();
    case 101:
      ADVANCE_MAP(
        '"', 78,
        '#', 462,
        '\'', 397,
        '\\', 102,
        '(', 128,
        '[', 128,
        '{', 128,
        ')', 73,
        ']', 73,
        '}', 73,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(101);
      END_STATE();
    case 102:
      ADVANCE_MAP(
        '"', 78,
        '#', 462,
        '\'', 415,
        '(', 128,
        '[', 128,
        '{', 128,
        ')', 73,
        ']', 73,
        '}', 73,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(101);
      END_STATE();
    case 103:
      ADVANCE_MAP(
        '"', 78,
        '#', 462,
        '\'', 374,
        '\\', 102,
        '(', 128,
        '[', 128,
        '{', 128,
        ')', 73,
        ']', 73,
        '}', 73,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(101);
      END_STATE();
    case 104:
      if (lookahead == '"') ADVANCE(128);
      if (lookahead == '\'') ADVANCE(691);
      if (lookahead == '\\') ADVANCE(556);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(106);
      END_STATE();
    case 105:
      if (lookahead == '"') ADVANCE(128);
      if (lookahead == '\'') ADVANCE(104);
      if (lookahead == '\\') ADVANCE(556);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(106);
      END_STATE();
    case 106:
      if (lookahead == '"') ADVANCE(128);
      if (lookahead == '\'') ADVANCE(105);
      if (lookahead == '\\') ADVANCE(556);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(106);
      END_STATE();
    case 107:
      if (lookahead == '"') ADVANCE(723);
      if (lookahead == '\'') ADVANCE(199);
      if (lookahead == '\\') ADVANCE(570);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(320);
      END_STATE();
    case 108:
      if (lookahead == '"') ADVANCE(709);
      if (lookahead == '\\') ADVANCE(609);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(317);
      END_STATE();
    case 109:
      ADVANCE_MAP(
        '"', 86,
        '#', 306,
        '\'', 254,
        '\\', 125,
        '(', 133,
        '[', 133,
        '{', 133,
        ')', 772,
        ']', 772,
        '}', 772,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(109);
      END_STATE();
    case 110:
      if (lookahead == '"') ADVANCE(202);
      if (lookahead == '\\') ADVANCE(592);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(110);
      END_STATE();
    case 111:
      if (lookahead == '"') ADVANCE(51);
      if (lookahead == '\'') ADVANCE(109);
      if (lookahead == '\\') ADVANCE(539);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(254);
      END_STATE();
    case 112:
      if (lookahead == '"') ADVANCE(63);
      if (lookahead == '\\') ADVANCE(557);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(255);
      END_STATE();
    case 113:
      if (lookahead == '"') ADVANCE(725);
      if (lookahead == '\'') ADVANCE(205);
      if (lookahead == '\\') ADVANCE(581);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(322);
      END_STATE();
    case 114:
      ADVANCE_MAP(
        '"', 697,
        '#', 306,
        '\'', 322,
        '\\', 212,
        '(', 217,
        '[', 217,
        '{', 217,
        ')', 863,
        ']', 863,
        '}', 863,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(205);
      END_STATE();
    case 115:
      if (lookahead == '"') ADVANCE(711);
      if (lookahead == '\\') ADVANCE(611);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(321);
      END_STATE();
    case 116:
      ADVANCE_MAP(
        '"', 84,
        '\'', 246,
        '\\', 761,
        'n', 769,
        '\t', 116,
        ' ', 116,
        '(', 109,
        '[', 109,
        '{', 109,
        '#', 306,
        ')', 306,
        ',', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(772);
      END_STATE();
    case 117:
      if (lookahead == '"') ADVANCE(242);
      if (lookahead == '\\') ADVANCE(615);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(117);
      END_STATE();
    case 118:
      if (lookahead == '"') ADVANCE(724);
      if (lookahead == '\'') ADVANCE(211);
      if (lookahead == '\\') ADVANCE(584);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(323);
      END_STATE();
    case 119:
      ADVANCE_MAP(
        '"', 695,
        '#', 306,
        '\'', 323,
        '\\', 219,
        '(', 220,
        '[', 220,
        '{', 220,
        ')', 199,
        ']', 199,
        '}', 199,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(211);
      END_STATE();
    case 120:
      if (lookahead == '"') ADVANCE(32);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 121:
      if (lookahead == '"') ADVANCE(243);
      if (lookahead == '\\') ADVANCE(617);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(121);
      END_STATE();
    case 122:
      if (lookahead == '"') ADVANCE(80);
      if (lookahead == '\\') ADVANCE(561);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(260);
      END_STATE();
    case 123:
      if (lookahead == '"') ADVANCE(727);
      if (lookahead == '\'') ADVANCE(217);
      if (lookahead == '\\') ADVANCE(591);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(324);
      END_STATE();
    case 124:
      ADVANCE_MAP(
        '"', 700,
        '#', 306,
        '\'', 324,
        '\\', 222,
        '(', 227,
        '[', 227,
        '{', 227,
        ')', 205,
        ']', 205,
        '}', 205,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(217);
      END_STATE();
    case 125:
      ADVANCE_MAP(
        '"', 247,
        '#', 306,
        '\'', 254,
        '(', 133,
        '[', 133,
        '{', 133,
        ')', 772,
        ']', 772,
        '}', 772,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(109);
      END_STATE();
    case 126:
      if (lookahead == '"') ADVANCE(244);
      if (lookahead == '\\') ADVANCE(619);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(126);
      END_STATE();
    case 127:
      ADVANCE_MAP(
        '"', 106,
        '#', 462,
        '\'', 722,
        '\\', 129,
        '(', 144,
        '[', 144,
        '{', 144,
        ')', 101,
        ']', 101,
        '}', 101,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(128);
      END_STATE();
    case 128:
      ADVANCE_MAP(
        '"', 106,
        '#', 462,
        '\'', 401,
        '\\', 129,
        '(', 144,
        '[', 144,
        '{', 144,
        ')', 101,
        ']', 101,
        '}', 101,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(128);
      END_STATE();
    case 129:
      ADVANCE_MAP(
        '"', 106,
        '#', 462,
        '\'', 463,
        '(', 144,
        '[', 144,
        '{', 144,
        ')', 101,
        ']', 101,
        '}', 101,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(128);
      END_STATE();
    case 130:
      ADVANCE_MAP(
        '"', 106,
        '#', 462,
        '\'', 378,
        '\\', 129,
        '(', 144,
        '[', 144,
        '{', 144,
        ')', 101,
        ']', 101,
        '}', 101,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(128);
      END_STATE();
    case 131:
      if (lookahead == '"') ADVANCE(726);
      if (lookahead == '\'') ADVANCE(220);
      if (lookahead == '\\') ADVANCE(596);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(325);
      END_STATE();
    case 132:
      ADVANCE_MAP(
        '"', 698,
        '#', 306,
        '\'', 325,
        '\\', 230,
        '(', 313,
        '[', 313,
        '{', 313,
        ')', 211,
        ']', 211,
        '}', 211,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(220);
      END_STATE();
    case 133:
      ADVANCE_MAP(
        '"', 112,
        '#', 306,
        '\'', 259,
        '\\', 137,
        '(', 141,
        '[', 141,
        '{', 141,
        ')', 109,
        ']', 109,
        '}', 109,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(133);
      END_STATE();
    case 134:
      if (lookahead == '"') ADVANCE(62);
      if (lookahead == '\'') ADVANCE(133);
      if (lookahead == '\\') ADVANCE(547);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(259);
      END_STATE();
    case 135:
      if (lookahead == '"') ADVANCE(728);
      if (lookahead == '\'') ADVANCE(227);
      if (lookahead == '\\') ADVANCE(605);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(326);
      END_STATE();
    case 136:
      ADVANCE_MAP(
        '"', 701,
        '#', 306,
        '\'', 326,
        '\\', 233,
        '(', 344,
        '[', 344,
        '{', 344,
        ')', 217,
        ']', 217,
        '}', 217,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(227);
      END_STATE();
    case 137:
      ADVANCE_MAP(
        '"', 255,
        '#', 306,
        '\'', 259,
        '(', 141,
        '[', 141,
        '{', 141,
        ')', 109,
        ']', 109,
        '}', 109,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(133);
      END_STATE();
    case 138:
      if (lookahead == '"') ADVANCE(175);
      if (lookahead == '\'') ADVANCE(693);
      if (lookahead == '\\') ADVANCE(576);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(140);
      END_STATE();
    case 139:
      if (lookahead == '"') ADVANCE(175);
      if (lookahead == '\'') ADVANCE(138);
      if (lookahead == '\\') ADVANCE(576);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(140);
      END_STATE();
    case 140:
      if (lookahead == '"') ADVANCE(175);
      if (lookahead == '\'') ADVANCE(139);
      if (lookahead == '\\') ADVANCE(576);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(140);
      END_STATE();
    case 141:
      ADVANCE_MAP(
        '"', 122,
        '#', 306,
        '\'', 308,
        '\\', 147,
        '(', 152,
        '[', 152,
        '{', 152,
        ')', 133,
        ']', 133,
        '}', 133,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(141);
      END_STATE();
    case 142:
      ADVANCE_MAP(
        '"', 34,
        '#', 306,
        '\'', 254,
        '\\', 125,
        '(', 133,
        '[', 133,
        '{', 133,
        ')', 772,
        ']', 772,
        '}', 772,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(109);
      END_STATE();
    case 143:
      ADVANCE_MAP(
        '"', 54,
        '\'', 718,
        '\\', 145,
        ')', 128,
        ']', 128,
        '}', 128,
        '#', 462,
        '(', 462,
        '[', 462,
        '{', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(144);
      END_STATE();
    case 144:
      ADVANCE_MAP(
        '"', 54,
        '\'', 380,
        '\\', 145,
        ')', 128,
        ']', 128,
        '}', 128,
        '#', 462,
        '(', 462,
        '[', 462,
        '{', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(144);
      END_STATE();
    case 145:
      ADVANCE_MAP(
        '"', 54,
        '\'', 413,
        ')', 128,
        ']', 128,
        '}', 128,
        '#', 462,
        '(', 462,
        '[', 462,
        '{', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(144);
      END_STATE();
    case 146:
      ADVANCE_MAP(
        '"', 54,
        '\'', 367,
        '\\', 145,
        ')', 128,
        ']', 128,
        '}', 128,
        '#', 462,
        '(', 462,
        '[', 462,
        '{', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(144);
      END_STATE();
    case 147:
      ADVANCE_MAP(
        '"', 260,
        '#', 306,
        '\'', 308,
        '(', 152,
        '[', 152,
        '{', 152,
        ')', 133,
        ']', 133,
        '}', 133,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(141);
      END_STATE();
    case 148:
      if (lookahead == '"') ADVANCE(79);
      if (lookahead == '\'') ADVANCE(141);
      if (lookahead == '\\') ADVANCE(553);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(308);
      END_STATE();
    case 149:
      if (lookahead == '"') ADVANCE(189);
      if (lookahead == '\'') ADVANCE(697);
      if (lookahead == '\\') ADVANCE(589);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(151);
      END_STATE();
    case 150:
      if (lookahead == '"') ADVANCE(189);
      if (lookahead == '\'') ADVANCE(149);
      if (lookahead == '\\') ADVANCE(589);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(151);
      END_STATE();
    case 151:
      if (lookahead == '"') ADVANCE(189);
      if (lookahead == '\'') ADVANCE(150);
      if (lookahead == '\\') ADVANCE(589);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(151);
      END_STATE();
    case 152:
      ADVANCE_MAP(
        '"', 64,
        '\'', 310,
        '\\', 158,
        ')', 141,
        ']', 141,
        '}', 141,
        '#', 306,
        '(', 306,
        '[', 306,
        '{', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(152);
      END_STATE();
    case 153:
      if (lookahead == '"') ADVANCE(195);
      if (lookahead == '\'') ADVANCE(695);
      if (lookahead == '\\') ADVANCE(590);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(155);
      END_STATE();
    case 154:
      if (lookahead == '"') ADVANCE(195);
      if (lookahead == '\'') ADVANCE(153);
      if (lookahead == '\\') ADVANCE(590);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(155);
      END_STATE();
    case 155:
      if (lookahead == '"') ADVANCE(195);
      if (lookahead == '\'') ADVANCE(154);
      if (lookahead == '\\') ADVANCE(590);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(155);
      END_STATE();
    case 156:
      ADVANCE_MAP(
        '"', 55,
        '#', 306,
        '\'', 259,
        '\\', 137,
        '(', 141,
        '[', 141,
        '{', 141,
        ')', 109,
        ']', 109,
        '}', 109,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(133);
      END_STATE();
    case 157:
      if (lookahead == '"') ADVANCE(87);
      if (lookahead == '\'') ADVANCE(152);
      if (lookahead == '\\') ADVANCE(559);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(310);
      END_STATE();
    case 158:
      ADVANCE_MAP(
        '"', 248,
        '\'', 310,
        ')', 141,
        ']', 141,
        '}', 141,
        '#', 306,
        '(', 306,
        '[', 306,
        '{', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(152);
      END_STATE();
    case 159:
      if (lookahead == '"') ADVANCE(96);
      if (lookahead == '\\') ADVANCE(597);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(309);
      END_STATE();
    case 160:
      ADVANCE_MAP(
        '"', 65,
        '#', 306,
        '\'', 308,
        '\\', 147,
        '(', 152,
        '[', 152,
        '{', 152,
        ')', 133,
        ']', 133,
        '}', 133,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(141);
      END_STATE();
    case 161:
      ADVANCE_MAP(
        '"', 35,
        '\'', 310,
        '\\', 158,
        ')', 141,
        ']', 141,
        '}', 141,
        '#', 306,
        '(', 306,
        '[', 306,
        '{', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(152);
      END_STATE();
    case 162:
      ADVANCE_MAP(
        '"', 253,
        '\'', 382,
        '\\', 777,
        'n', 784,
        '\t', 162,
        ' ', 162,
        '(', 175,
        '[', 175,
        '{', 175,
        '#', 462,
        ')', 462,
        ',', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(787);
      END_STATE();
    case 163:
      if (lookahead == '"') ADVANCE(208);
      if (lookahead == '\'') ADVANCE(700);
      if (lookahead == '\\') ADVANCE(599);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(165);
      END_STATE();
    case 164:
      if (lookahead == '"') ADVANCE(208);
      if (lookahead == '\'') ADVANCE(163);
      if (lookahead == '\\') ADVANCE(599);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(165);
      END_STATE();
    case 165:
      if (lookahead == '"') ADVANCE(208);
      if (lookahead == '\'') ADVANCE(164);
      if (lookahead == '\\') ADVANCE(599);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(165);
      END_STATE();
    case 166:
      if (lookahead == '"') ADVANCE(37);
      if (lookahead == '\'') ADVANCE(411);
      if (lookahead == ':') ADVANCE(667);
      if (lookahead == 'n') ADVANCE(650);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(166);
      if (lookahead == '(' ||
          lookahead == '[' ||
          lookahead == '{') ADVANCE(171);
      if (('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(652);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '"' &&
          lookahead != '#' &&
          (lookahead < '\'' || ')' < lookahead) &&
          lookahead != ',' &&
          lookahead != ']' &&
          lookahead != '}') ADVANCE(801);
      END_STATE();
    case 167:
      ADVANCE_MAP(
        '"', 36,
        '\'', 368,
        'n', 798,
        '\t', 167,
        ' ', 167,
        '(', 171,
        '[', 171,
        '{', 171,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 168:
      if (lookahead == '"') ADVANCE(214);
      if (lookahead == '\'') ADVANCE(698);
      if (lookahead == '\\') ADVANCE(602);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(170);
      END_STATE();
    case 169:
      if (lookahead == '"') ADVANCE(214);
      if (lookahead == '\'') ADVANCE(168);
      if (lookahead == '\\') ADVANCE(602);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(170);
      END_STATE();
    case 170:
      if (lookahead == '"') ADVANCE(214);
      if (lookahead == '\'') ADVANCE(169);
      if (lookahead == '\\') ADVANCE(602);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(170);
      END_STATE();
    case 171:
      ADVANCE_MAP(
        '"', 68,
        '\'', 379,
        '(', 181,
        '[', 181,
        '{', 181,
        ')', 801,
        ']', 801,
        '}', 801,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(171);
      END_STATE();
    case 172:
      ADVANCE_MAP(
        '"', 59,
        '\'', 383,
        '\\', 836,
        'n', 829,
        '\t', 172,
        ' ', 172,
        '(', 189,
        '[', 189,
        '{', 189,
        '#', 462,
        ')', 462,
        ',', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(835);
      END_STATE();
    case 173:
      if (lookahead == '"') ADVANCE(114);
      if (lookahead == '\\') ADVANCE(600);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(311);
      END_STATE();
    case 174:
      ADVANCE_MAP(
        '"', 140,
        '#', 462,
        '\'', 723,
        '\\', 176,
        '(', 195,
        '[', 195,
        '{', 195,
        ')', 787,
        ']', 787,
        '}', 787,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(175);
      END_STATE();
    case 175:
      ADVANCE_MAP(
        '"', 140,
        '#', 462,
        '\'', 402,
        '\\', 176,
        '(', 195,
        '[', 195,
        '{', 195,
        ')', 787,
        ']', 787,
        '}', 787,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(175);
      END_STATE();
    case 176:
      ADVANCE_MAP(
        '"', 140,
        '#', 462,
        '\'', 464,
        '(', 195,
        '[', 195,
        '{', 195,
        ')', 787,
        ']', 787,
        '}', 787,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(175);
      END_STATE();
    case 177:
      ADVANCE_MAP(
        '"', 140,
        '#', 462,
        '\'', 381,
        '\\', 176,
        '(', 195,
        '[', 195,
        '{', 195,
        ')', 787,
        ']', 787,
        '}', 787,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(175);
      END_STATE();
    case 178:
      ADVANCE_MAP(
        '"', 38,
        '\'', 369,
        'n', 844,
        '\t', 178,
        ' ', 178,
        '(', 182,
        '[', 182,
        '{', 182,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 179:
      if (lookahead == '"') ADVANCE(92);
      if (lookahead == '\'') ADVANCE(815);
      if (lookahead == '\\') ADVANCE(565);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(316);
      END_STATE();
    case 180:
      if (lookahead == '"') ADVANCE(119);
      if (lookahead == '\\') ADVANCE(603);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(312);
      END_STATE();
    case 181:
      ADVANCE_MAP(
        '"', 83,
        '\'', 384,
        '(', 186,
        '[', 186,
        '{', 186,
        ')', 171,
        ']', 171,
        '}', 171,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(181);
      END_STATE();
    case 182:
      ADVANCE_MAP(
        '"', 91,
        '\'', 386,
        '(', 187,
        '[', 187,
        '{', 187,
        ')', 850,
        ']', 850,
        '}', 850,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(182);
      END_STATE();
    case 183:
      if (lookahead == '"') ADVANCE(224);
      if (lookahead == '\'') ADVANCE(701);
      if (lookahead == '\\') ADVANCE(608);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(185);
      END_STATE();
    case 184:
      if (lookahead == '"') ADVANCE(224);
      if (lookahead == '\'') ADVANCE(183);
      if (lookahead == '\\') ADVANCE(608);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(185);
      END_STATE();
    case 185:
      if (lookahead == '"') ADVANCE(224);
      if (lookahead == '\'') ADVANCE(184);
      if (lookahead == '\\') ADVANCE(608);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(185);
      END_STATE();
    case 186:
      ADVANCE_MAP(
        '"', 94,
        '\'', 389,
        '(', 307,
        '[', 307,
        '{', 307,
        ')', 181,
        ']', 181,
        '}', 181,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(186);
      END_STATE();
    case 187:
      ADVANCE_MAP(
        '"', 99,
        '\'', 392,
        '(', 202,
        '[', 202,
        '{', 202,
        ')', 182,
        ']', 182,
        '}', 182,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(187);
      END_STATE();
    case 188:
      ADVANCE_MAP(
        '"', 151,
        '#', 462,
        '\'', 725,
        '\\', 190,
        '(', 208,
        '[', 208,
        '{', 208,
        ')', 835,
        ']', 835,
        '}', 835,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(189);
      END_STATE();
    case 189:
      ADVANCE_MAP(
        '"', 151,
        '#', 462,
        '\'', 403,
        '\\', 190,
        '(', 208,
        '[', 208,
        '{', 208,
        ')', 835,
        ']', 835,
        '}', 835,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(189);
      END_STATE();
    case 190:
      ADVANCE_MAP(
        '"', 151,
        '#', 462,
        '\'', 465,
        '(', 208,
        '[', 208,
        '{', 208,
        ')', 835,
        ']', 835,
        '}', 835,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(189);
      END_STATE();
    case 191:
      ADVANCE_MAP(
        '"', 151,
        '#', 462,
        '\'', 385,
        '\\', 190,
        '(', 208,
        '[', 208,
        '{', 208,
        ')', 835,
        ']', 835,
        '}', 835,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(189);
      END_STATE();
    case 192:
      if (lookahead == '"') ADVANCE(124);
      if (lookahead == '\\') ADVANCE(606);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(315);
      END_STATE();
    case 193:
      ADVANCE_MAP(
        '"', 67,
        '\'', 319,
        '\\', 864,
        'n', 857,
        '\t', 193,
        ' ', 193,
        '(', 205,
        '[', 205,
        '{', 205,
        '#', 306,
        ')', 306,
        ',', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(863);
      END_STATE();
    case 194:
      ADVANCE_MAP(
        '"', 155,
        '#', 462,
        '\'', 724,
        '\\', 196,
        '(', 214,
        '[', 214,
        '{', 214,
        ')', 175,
        ']', 175,
        '}', 175,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(195);
      END_STATE();
    case 195:
      ADVANCE_MAP(
        '"', 155,
        '#', 462,
        '\'', 404,
        '\\', 196,
        '(', 214,
        '[', 214,
        '{', 214,
        ')', 175,
        ']', 175,
        '}', 175,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(195);
      END_STATE();
    case 196:
      ADVANCE_MAP(
        '"', 155,
        '#', 462,
        '\'', 466,
        '(', 214,
        '[', 214,
        '{', 214,
        ')', 175,
        ']', 175,
        '}', 175,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(195);
      END_STATE();
    case 197:
      ADVANCE_MAP(
        '"', 155,
        '#', 462,
        '\'', 388,
        '\\', 196,
        '(', 214,
        '[', 214,
        '{', 214,
        ')', 175,
        ']', 175,
        '}', 175,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(195);
      END_STATE();
    case 198:
      if (lookahead == '"') ADVANCE(132);
      if (lookahead == '\\') ADVANCE(609);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(317);
      END_STATE();
    case 199:
      ADVANCE_MAP(
        '"', 159,
        '#', 306,
        '\'', 320,
        '\\', 206,
        '(', 211,
        '[', 211,
        '{', 211,
        ')', 815,
        ']', 815,
        '}', 815,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(199);
      END_STATE();
    case 200:
      if (lookahead == '"') ADVANCE(95);
      if (lookahead == '\'') ADVANCE(863);
      if (lookahead == '\\') ADVANCE(567);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(319);
      END_STATE();
    case 201:
      ADVANCE_MAP(
        '"', 66,
        '\'', 316,
        '\\', 805,
        'n', 812,
        '\t', 201,
        ' ', 201,
        '(', 199,
        '[', 199,
        '{', 199,
        '#', 306,
        ')', 306,
        ',', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(815);
      END_STATE();
    case 202:
      ADVANCE_MAP(
        '"', 110,
        '\'', 394,
        '(', 339,
        '[', 339,
        '{', 339,
        ')', 187,
        ']', 187,
        '}', 187,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(202);
      END_STATE();
    case 203:
      if (lookahead == '"') ADVANCE(107);
      if (lookahead == '\'') ADVANCE(199);
      if (lookahead == '\\') ADVANCE(570);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(320);
      END_STATE();
    case 204:
      if (lookahead == '"') ADVANCE(136);
      if (lookahead == '\\') ADVANCE(611);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(321);
      END_STATE();
    case 205:
      ADVANCE_MAP(
        '"', 173,
        '#', 306,
        '\'', 322,
        '\\', 212,
        '(', 217,
        '[', 217,
        '{', 217,
        ')', 863,
        ']', 863,
        '}', 863,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(205);
      END_STATE();
    case 206:
      ADVANCE_MAP(
        '"', 309,
        '#', 306,
        '\'', 320,
        '(', 211,
        '[', 211,
        '{', 211,
        ')', 815,
        ']', 815,
        '}', 815,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(199);
      END_STATE();
    case 207:
      ADVANCE_MAP(
        '"', 165,
        '#', 462,
        '\'', 727,
        '\\', 209,
        '(', 224,
        '[', 224,
        '{', 224,
        ')', 189,
        ']', 189,
        '}', 189,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(208);
      END_STATE();
    case 208:
      ADVANCE_MAP(
        '"', 165,
        '#', 462,
        '\'', 405,
        '\\', 209,
        '(', 224,
        '[', 224,
        '{', 224,
        ')', 189,
        ']', 189,
        '}', 189,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(208);
      END_STATE();
    case 209:
      ADVANCE_MAP(
        '"', 165,
        '#', 462,
        '\'', 467,
        '(', 224,
        '[', 224,
        '{', 224,
        ')', 189,
        ']', 189,
        '}', 189,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(208);
      END_STATE();
    case 210:
      ADVANCE_MAP(
        '"', 165,
        '#', 462,
        '\'', 391,
        '\\', 209,
        '(', 224,
        '[', 224,
        '{', 224,
        ')', 189,
        ']', 189,
        '}', 189,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(208);
      END_STATE();
    case 211:
      ADVANCE_MAP(
        '"', 180,
        '#', 306,
        '\'', 323,
        '\\', 219,
        '(', 220,
        '[', 220,
        '{', 220,
        ')', 199,
        ']', 199,
        '}', 199,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(211);
      END_STATE();
    case 212:
      ADVANCE_MAP(
        '"', 311,
        '#', 306,
        '\'', 322,
        '(', 217,
        '[', 217,
        '{', 217,
        ')', 863,
        ']', 863,
        '}', 863,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(205);
      END_STATE();
    case 213:
      ADVANCE_MAP(
        '"', 170,
        '#', 462,
        '\'', 726,
        '\\', 215,
        '(', 341,
        '[', 341,
        '{', 341,
        ')', 195,
        ']', 195,
        '}', 195,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(214);
      END_STATE();
    case 214:
      ADVANCE_MAP(
        '"', 170,
        '#', 462,
        '\'', 406,
        '\\', 215,
        '(', 341,
        '[', 341,
        '{', 341,
        ')', 195,
        ']', 195,
        '}', 195,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(214);
      END_STATE();
    case 215:
      ADVANCE_MAP(
        '"', 170,
        '#', 462,
        '\'', 468,
        '(', 341,
        '[', 341,
        '{', 341,
        ')', 195,
        ']', 195,
        '}', 195,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(214);
      END_STATE();
    case 216:
      ADVANCE_MAP(
        '"', 170,
        '#', 462,
        '\'', 393,
        '\\', 215,
        '(', 341,
        '[', 341,
        '{', 341,
        ')', 195,
        ']', 195,
        '}', 195,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(214);
      END_STATE();
    case 217:
      ADVANCE_MAP(
        '"', 192,
        '#', 306,
        '\'', 324,
        '\\', 222,
        '(', 227,
        '[', 227,
        '{', 227,
        ')', 205,
        ']', 205,
        '}', 205,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(217);
      END_STATE();
    case 218:
      if (lookahead == '"') ADVANCE(113);
      if (lookahead == '\'') ADVANCE(205);
      if (lookahead == '\\') ADVANCE(581);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(322);
      END_STATE();
    case 219:
      ADVANCE_MAP(
        '"', 312,
        '#', 306,
        '\'', 323,
        '(', 220,
        '[', 220,
        '{', 220,
        ')', 199,
        ']', 199,
        '}', 199,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(211);
      END_STATE();
    case 220:
      ADVANCE_MAP(
        '"', 198,
        '#', 306,
        '\'', 325,
        '\\', 230,
        '(', 313,
        '[', 313,
        '{', 313,
        ')', 211,
        ']', 211,
        '}', 211,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(220);
      END_STATE();
    case 221:
      if (lookahead == '"') ADVANCE(118);
      if (lookahead == '\'') ADVANCE(211);
      if (lookahead == '\\') ADVANCE(584);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(323);
      END_STATE();
    case 222:
      ADVANCE_MAP(
        '"', 315,
        '#', 306,
        '\'', 324,
        '(', 227,
        '[', 227,
        '{', 227,
        ')', 205,
        ']', 205,
        '}', 205,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(217);
      END_STATE();
    case 223:
      ADVANCE_MAP(
        '"', 185,
        '#', 462,
        '\'', 728,
        '\\', 225,
        '(', 353,
        '[', 353,
        '{', 353,
        ')', 208,
        ']', 208,
        '}', 208,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(224);
      END_STATE();
    case 224:
      ADVANCE_MAP(
        '"', 185,
        '#', 462,
        '\'', 407,
        '\\', 225,
        '(', 353,
        '[', 353,
        '{', 353,
        ')', 208,
        ']', 208,
        '}', 208,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(224);
      END_STATE();
    case 225:
      ADVANCE_MAP(
        '"', 185,
        '#', 462,
        '\'', 469,
        '(', 353,
        '[', 353,
        '{', 353,
        ')', 208,
        ']', 208,
        '}', 208,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(224);
      END_STATE();
    case 226:
      ADVANCE_MAP(
        '"', 185,
        '#', 462,
        '\'', 395,
        '\\', 225,
        '(', 353,
        '[', 353,
        '{', 353,
        ')', 208,
        ']', 208,
        '}', 208,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(224);
      END_STATE();
    case 227:
      ADVANCE_MAP(
        '"', 204,
        '#', 306,
        '\'', 326,
        '\\', 233,
        '(', 344,
        '[', 344,
        '{', 344,
        ')', 217,
        ']', 217,
        '}', 217,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(227);
      END_STATE();
    case 228:
      ADVANCE_MAP(
        '"', 81,
        '#', 306,
        '\'', 320,
        '\\', 206,
        '(', 211,
        '[', 211,
        '{', 211,
        ')', 815,
        ']', 815,
        '}', 815,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(199);
      END_STATE();
    case 229:
      if (lookahead == '"') ADVANCE(123);
      if (lookahead == '\'') ADVANCE(217);
      if (lookahead == '\\') ADVANCE(591);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(324);
      END_STATE();
    case 230:
      ADVANCE_MAP(
        '"', 317,
        '#', 306,
        '\'', 325,
        '(', 313,
        '[', 313,
        '{', 313,
        ')', 211,
        ']', 211,
        '}', 211,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(220);
      END_STATE();
    case 231:
      if (lookahead == '"') ADVANCE(131);
      if (lookahead == '\'') ADVANCE(220);
      if (lookahead == '\\') ADVANCE(596);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(325);
      END_STATE();
    case 232:
      ADVANCE_MAP(
        '"', 89,
        '#', 306,
        '\'', 322,
        '\\', 212,
        '(', 217,
        '[', 217,
        '{', 217,
        ')', 863,
        ']', 863,
        '}', 863,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(205);
      END_STATE();
    case 233:
      ADVANCE_MAP(
        '"', 321,
        '#', 306,
        '\'', 326,
        '(', 344,
        '[', 344,
        '{', 344,
        ')', 217,
        ']', 217,
        '}', 217,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(227);
      END_STATE();
    case 234:
      ADVANCE_MAP(
        '"', 93,
        '#', 306,
        '\'', 323,
        '\\', 219,
        '(', 220,
        '[', 220,
        '{', 220,
        ')', 199,
        ']', 199,
        '}', 199,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(211);
      END_STATE();
    case 235:
      if (lookahead == '"') ADVANCE(135);
      if (lookahead == '\'') ADVANCE(227);
      if (lookahead == '\\') ADVANCE(605);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(326);
      END_STATE();
    case 236:
      ADVANCE_MAP(
        '"', 97,
        '#', 306,
        '\'', 324,
        '\\', 222,
        '(', 227,
        '[', 227,
        '{', 227,
        ')', 205,
        ']', 205,
        '}', 205,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(217);
      END_STATE();
    case 237:
      ADVANCE_MAP(
        '"', 108,
        '#', 306,
        '\'', 325,
        '\\', 230,
        '(', 313,
        '[', 313,
        '{', 313,
        ')', 211,
        ']', 211,
        '}', 211,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(220);
      END_STATE();
    case 238:
      ADVANCE_MAP(
        '"', 115,
        '#', 306,
        '\'', 326,
        '\\', 233,
        '(', 344,
        '[', 344,
        '{', 344,
        ')', 217,
        ']', 217,
        '}', 217,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(227);
      END_STATE();
    case 239:
      if (lookahead == '"') ADVANCE(40);
      if (lookahead == '\'') ADVANCE(370);
      if (lookahead == ']') ADVANCE(680);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(239);
      END_STATE();
    case 240:
      if (lookahead == '"') ADVANCE(41);
      if (lookahead == '\'') ADVANCE(371);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(240);
      if (lookahead == '(' ||
          lookahead == '[' ||
          lookahead == '{') ADVANCE(242);
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(678);
      END_STATE();
    case 241:
      if (lookahead == '"') ADVANCE(41);
      if (lookahead == '\'') ADVANCE(371);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(241);
      if (lookahead == '(' ||
          lookahead == '[' ||
          lookahead == '{') ADVANCE(242);
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(678);
      END_STATE();
    case 242:
      ADVANCE_MAP(
        '"', 117,
        '\'', 396,
        '(', 243,
        '[', 243,
        '{', 243,
        ')', 678,
        ']', 678,
        '}', 678,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(242);
      END_STATE();
    case 243:
      ADVANCE_MAP(
        '"', 121,
        '\'', 399,
        '(', 244,
        '[', 244,
        '{', 244,
        ')', 242,
        ']', 242,
        '}', 242,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(243);
      END_STATE();
    case 244:
      ADVANCE_MAP(
        '"', 126,
        '\'', 400,
        '(', 351,
        '[', 351,
        '{', 351,
        ')', 243,
        ']', 243,
        '}', 243,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(244);
      END_STATE();
    case 245:
      if (lookahead == '"') ADVANCE(307);
      if (lookahead == '\\') ADVANCE(621);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(245);
      END_STATE();
    case 246:
      if (lookahead == '"') ADVANCE(85);
      if (lookahead == '\'') ADVANCE(772);
      if (lookahead == '\\') ADVANCE(533);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(246);
      END_STATE();
    case 247:
      if (lookahead == '"') ADVANCE(142);
      if (lookahead == '\\') ADVANCE(554);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(247);
      END_STATE();
    case 248:
      if (lookahead == '"') ADVANCE(161);
      if (lookahead == '\\') ADVANCE(563);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(248);
      END_STATE();
    case 249:
      if (lookahead == '"') ADVANCE(713);
      if (lookahead == '\\') ADVANCE(634);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(356);
      END_STATE();
    case 250:
      if (lookahead == '"') ADVANCE(865);
      if (lookahead == '\\') ADVANCE(594);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(250);
      END_STATE();
    case 251:
      if (lookahead == '"') ADVANCE(787);
      if (lookahead == '\'') ADVANCE(685);
      if (lookahead == '\\') ADVANCE(566);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(253);
      END_STATE();
    case 252:
      if (lookahead == '"') ADVANCE(787);
      if (lookahead == '\'') ADVANCE(251);
      if (lookahead == '\\') ADVANCE(566);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(253);
      END_STATE();
    case 253:
      if (lookahead == '"') ADVANCE(787);
      if (lookahead == '\'') ADVANCE(252);
      if (lookahead == '\\') ADVANCE(566);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(253);
      END_STATE();
    case 254:
      if (lookahead == '"') ADVANCE(111);
      if (lookahead == '\'') ADVANCE(109);
      if (lookahead == '\\') ADVANCE(539);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(254);
      END_STATE();
    case 255:
      if (lookahead == '"') ADVANCE(156);
      if (lookahead == '\\') ADVANCE(557);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(255);
      END_STATE();
    case 256:
      if (lookahead == '"') ADVANCE(258);
      if (lookahead == '\\') ADVANCE(634);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(356);
      END_STATE();
    case 257:
      if (lookahead == '"') ADVANCE(729);
      if (lookahead == '\'') ADVANCE(313);
      if (lookahead == '\\') ADVANCE(626);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(357);
      END_STATE();
    case 258:
      ADVANCE_MAP(
        '"', 712,
        '\'', 357,
        '\\', 360,
        ')', 220,
        ']', 220,
        '}', 220,
        '#', 306,
        '(', 306,
        '[', 306,
        '{', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(313);
      END_STATE();
    case 259:
      if (lookahead == '"') ADVANCE(134);
      if (lookahead == '\'') ADVANCE(133);
      if (lookahead == '\\') ADVANCE(547);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(259);
      END_STATE();
    case 260:
      if (lookahead == '"') ADVANCE(160);
      if (lookahead == '\\') ADVANCE(561);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(260);
      END_STATE();
    case 261:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '*') ADVANCE(296);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(116);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 262:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '*') ADVANCE(303);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(201);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 263:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '*') ADVANCE(300);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(193);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 264:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '/') ADVANCE(296);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(116);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 265:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '/') ADVANCE(303);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(201);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 266:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '/') ADVANCE(300);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(193);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 267:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '=') ADVANCE(296);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 268:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '=') ADVANCE(303);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 269:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '=') ADVANCE(300);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 270:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 'd') ADVANCE(296);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 271:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 'd') ADVANCE(303);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 272:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 'd') ADVANCE(300);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 273:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 'i') ADVANCE(277);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(273);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 274:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 'i') ADVANCE(280);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(274);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 275:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 'i') ADVANCE(283);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(275);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 276:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 'n') ADVANCE(296);
      if (lookahead == 's') ADVANCE(296);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 277:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 'n') ADVANCE(296);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 278:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 'n') ADVANCE(270);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 279:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 'n') ADVANCE(303);
      if (lookahead == 's') ADVANCE(303);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 280:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 'n') ADVANCE(303);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 281:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 'n') ADVANCE(271);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 282:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 'n') ADVANCE(300);
      if (lookahead == 's') ADVANCE(300);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 283:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 'n') ADVANCE(300);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 284:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 'n') ADVANCE(272);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 285:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 'o') ADVANCE(291);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 286:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 'o') ADVANCE(292);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 287:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 'o') ADVANCE(293);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 288:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 'r') ADVANCE(296);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 289:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 'r') ADVANCE(303);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 290:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 'r') ADVANCE(300);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 291:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 't') ADVANCE(297);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 292:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 't') ADVANCE(304);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 293:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == 't') ADVANCE(305);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 294:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(116);
      if (lookahead == '=' ||
          lookahead == '>') ADVANCE(296);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 295:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(116);
      if (('<' <= lookahead && lookahead <= '>')) ADVANCE(296);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 296:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(116);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 297:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(273);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 298:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(193);
      if (lookahead == '=' ||
          lookahead == '>') ADVANCE(300);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 299:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(193);
      if (('<' <= lookahead && lookahead <= '>')) ADVANCE(300);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 300:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(193);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 301:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(201);
      if (lookahead == '=' ||
          lookahead == '>') ADVANCE(303);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 302:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(201);
      if (('<' <= lookahead && lookahead <= '>')) ADVANCE(303);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 303:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(201);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 304:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(274);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 305:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(275);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 306:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 307:
      if (lookahead == '"') ADVANCE(245);
      if (lookahead == '\'') ADVANCE(409);
      if (lookahead == ')' ||
          lookahead == ']' ||
          lookahead == '}') ADVANCE(186);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#' &&
          (lookahead < '\'' || ')' < lookahead) &&
          lookahead != '[' &&
          lookahead != '{') ADVANCE(307);
      END_STATE();
    case 308:
      if (lookahead == '"') ADVANCE(148);
      if (lookahead == '\'') ADVANCE(141);
      if (lookahead == '\\') ADVANCE(553);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(308);
      END_STATE();
    case 309:
      if (lookahead == '"') ADVANCE(228);
      if (lookahead == '\\') ADVANCE(597);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(309);
      END_STATE();
    case 310:
      if (lookahead == '"') ADVANCE(157);
      if (lookahead == '\'') ADVANCE(152);
      if (lookahead == '\\') ADVANCE(559);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(310);
      END_STATE();
    case 311:
      if (lookahead == '"') ADVANCE(232);
      if (lookahead == '\\') ADVANCE(600);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(311);
      END_STATE();
    case 312:
      if (lookahead == '"') ADVANCE(234);
      if (lookahead == '\\') ADVANCE(603);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(312);
      END_STATE();
    case 313:
      ADVANCE_MAP(
        '"', 256,
        '\'', 357,
        '\\', 360,
        ')', 220,
        ']', 220,
        '}', 220,
        '#', 306,
        '(', 306,
        '[', 306,
        '{', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(313);
      END_STATE();
    case 314:
      if (lookahead == '"') ADVANCE(257);
      if (lookahead == '\'') ADVANCE(313);
      if (lookahead == '\\') ADVANCE(626);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(357);
      END_STATE();
    case 315:
      if (lookahead == '"') ADVANCE(236);
      if (lookahead == '\\') ADVANCE(606);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(315);
      END_STATE();
    case 316:
      if (lookahead == '"') ADVANCE(179);
      if (lookahead == '\'') ADVANCE(815);
      if (lookahead == '\\') ADVANCE(565);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(316);
      END_STATE();
    case 317:
      if (lookahead == '"') ADVANCE(237);
      if (lookahead == '\\') ADVANCE(609);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(317);
      END_STATE();
    case 318:
      ADVANCE_MAP(
        '"', 249,
        '\'', 357,
        '\\', 360,
        ')', 220,
        ']', 220,
        '}', 220,
        '#', 306,
        '(', 306,
        '[', 306,
        '{', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(313);
      END_STATE();
    case 319:
      if (lookahead == '"') ADVANCE(200);
      if (lookahead == '\'') ADVANCE(863);
      if (lookahead == '\\') ADVANCE(567);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(319);
      END_STATE();
    case 320:
      if (lookahead == '"') ADVANCE(203);
      if (lookahead == '\'') ADVANCE(199);
      if (lookahead == '\\') ADVANCE(570);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(320);
      END_STATE();
    case 321:
      if (lookahead == '"') ADVANCE(238);
      if (lookahead == '\\') ADVANCE(611);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(321);
      END_STATE();
    case 322:
      if (lookahead == '"') ADVANCE(218);
      if (lookahead == '\'') ADVANCE(205);
      if (lookahead == '\\') ADVANCE(581);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(322);
      END_STATE();
    case 323:
      if (lookahead == '"') ADVANCE(221);
      if (lookahead == '\'') ADVANCE(211);
      if (lookahead == '\\') ADVANCE(584);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(323);
      END_STATE();
    case 324:
      if (lookahead == '"') ADVANCE(229);
      if (lookahead == '\'') ADVANCE(217);
      if (lookahead == '\\') ADVANCE(591);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(324);
      END_STATE();
    case 325:
      if (lookahead == '"') ADVANCE(231);
      if (lookahead == '\'') ADVANCE(220);
      if (lookahead == '\\') ADVANCE(596);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(325);
      END_STATE();
    case 326:
      if (lookahead == '"') ADVANCE(235);
      if (lookahead == '\'') ADVANCE(227);
      if (lookahead == '\\') ADVANCE(605);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(326);
      END_STATE();
    case 327:
      if (lookahead == '"') ADVANCE(687);
      if (lookahead == '\\') ADVANCE(632);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(327);
      END_STATE();
    case 328:
      if (lookahead == '"') ADVANCE(687);
      if (lookahead == '\\') ADVANCE(540);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(29);
      END_STATE();
    case 329:
      if (lookahead == '"') ADVANCE(339);
      if (lookahead == '\\') ADVANCE(624);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(329);
      END_STATE();
    case 330:
      if (lookahead == '"') ADVANCE(715);
      if (lookahead == '\\') ADVANCE(637);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(358);
      END_STATE();
    case 331:
      if (lookahead == '"') ADVANCE(702);
      if (lookahead == '\\') ADVANCE(623);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(331);
      END_STATE();
    case 332:
      if (lookahead == '"') ADVANCE(702);
      if (lookahead == '\\') ADVANCE(574);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(39);
      END_STATE();
    case 333:
      if (lookahead == '"') ADVANCE(341);
      if (lookahead == '\'') ADVANCE(712);
      if (lookahead == '\\') ADVANCE(627);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(335);
      END_STATE();
    case 334:
      if (lookahead == '"') ADVANCE(341);
      if (lookahead == '\'') ADVANCE(333);
      if (lookahead == '\\') ADVANCE(627);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(335);
      END_STATE();
    case 335:
      if (lookahead == '"') ADVANCE(341);
      if (lookahead == '\'') ADVANCE(334);
      if (lookahead == '\\') ADVANCE(627);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(335);
      END_STATE();
    case 336:
      if (lookahead == '"') ADVANCE(338);
      if (lookahead == '\\') ADVANCE(637);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(358);
      END_STATE();
    case 337:
      if (lookahead == '"') ADVANCE(730);
      if (lookahead == '\'') ADVANCE(344);
      if (lookahead == '\\') ADVANCE(630);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(359);
      END_STATE();
    case 338:
      ADVANCE_MAP(
        '"', 714,
        '\'', 359,
        '\\', 361,
        ')', 227,
        ']', 227,
        '}', 227,
        '#', 306,
        '(', 306,
        '[', 306,
        '{', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(344);
      END_STATE();
    case 339:
      if (lookahead == '"') ADVANCE(329);
      if (lookahead == '\'') ADVANCE(472);
      if (lookahead == ')' ||
          lookahead == ']' ||
          lookahead == '}') ADVANCE(202);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#' &&
          (lookahead < '\'' || ')' < lookahead) &&
          lookahead != '[' &&
          lookahead != '{') ADVANCE(339);
      END_STATE();
    case 340:
      ADVANCE_MAP(
        '"', 335,
        '\'', 729,
        '\\', 343,
        ')', 214,
        ']', 214,
        '}', 214,
        '#', 462,
        '(', 462,
        '[', 462,
        '{', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(341);
      END_STATE();
    case 341:
      ADVANCE_MAP(
        '"', 335,
        '\'', 416,
        '\\', 343,
        ')', 214,
        ']', 214,
        '}', 214,
        '#', 462,
        '(', 462,
        '[', 462,
        '{', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(341);
      END_STATE();
    case 342:
      ADVANCE_MAP(
        '"', 335,
        '\'', 410,
        '\\', 343,
        ')', 214,
        ']', 214,
        '}', 214,
        '#', 462,
        '(', 462,
        '[', 462,
        '{', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(341);
      END_STATE();
    case 343:
      ADVANCE_MAP(
        '"', 335,
        '\'', 478,
        ')', 214,
        ']', 214,
        '}', 214,
        '#', 462,
        '(', 462,
        '[', 462,
        '{', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(341);
      END_STATE();
    case 344:
      ADVANCE_MAP(
        '"', 336,
        '\'', 359,
        '\\', 361,
        ')', 227,
        ']', 227,
        '}', 227,
        '#', 306,
        '(', 306,
        '[', 306,
        '{', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(344);
      END_STATE();
    case 345:
      if (lookahead == '"') ADVANCE(337);
      if (lookahead == '\'') ADVANCE(344);
      if (lookahead == '\\') ADVANCE(630);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(359);
      END_STATE();
    case 346:
      ADVANCE_MAP(
        '"', 330,
        '\'', 359,
        '\\', 361,
        ')', 227,
        ']', 227,
        '}', 227,
        '#', 306,
        '(', 306,
        '[', 306,
        '{', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(344);
      END_STATE();
    case 347:
      if (lookahead == '"') ADVANCE(351);
      if (lookahead == '\\') ADVANCE(628);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(347);
      END_STATE();
    case 348:
      if (lookahead == '"') ADVANCE(353);
      if (lookahead == '\'') ADVANCE(714);
      if (lookahead == '\\') ADVANCE(631);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(350);
      END_STATE();
    case 349:
      if (lookahead == '"') ADVANCE(353);
      if (lookahead == '\'') ADVANCE(348);
      if (lookahead == '\\') ADVANCE(631);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(350);
      END_STATE();
    case 350:
      if (lookahead == '"') ADVANCE(353);
      if (lookahead == '\'') ADVANCE(349);
      if (lookahead == '\\') ADVANCE(631);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(350);
      END_STATE();
    case 351:
      if (lookahead == '"') ADVANCE(347);
      if (lookahead == '\'') ADVANCE(477);
      if (lookahead == ')' ||
          lookahead == ']' ||
          lookahead == '}') ADVANCE(244);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#' &&
          (lookahead < '\'' || ')' < lookahead) &&
          lookahead != '[' &&
          lookahead != '{') ADVANCE(351);
      END_STATE();
    case 352:
      ADVANCE_MAP(
        '"', 350,
        '\'', 730,
        '\\', 355,
        ')', 224,
        ']', 224,
        '}', 224,
        '#', 462,
        '(', 462,
        '[', 462,
        '{', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(353);
      END_STATE();
    case 353:
      ADVANCE_MAP(
        '"', 350,
        '\'', 476,
        '\\', 355,
        ')', 224,
        ']', 224,
        '}', 224,
        '#', 462,
        '(', 462,
        '[', 462,
        '{', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(353);
      END_STATE();
    case 354:
      ADVANCE_MAP(
        '"', 350,
        '\'', 473,
        '\\', 355,
        ')', 224,
        ']', 224,
        '}', 224,
        '#', 462,
        '(', 462,
        '[', 462,
        '{', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(353);
      END_STATE();
    case 355:
      ADVANCE_MAP(
        '"', 350,
        '\'', 479,
        ')', 224,
        ']', 224,
        '}', 224,
        '#', 462,
        '(', 462,
        '[', 462,
        '{', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(353);
      END_STATE();
    case 356:
      if (lookahead == '"') ADVANCE(318);
      if (lookahead == '\\') ADVANCE(634);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(356);
      END_STATE();
    case 357:
      if (lookahead == '"') ADVANCE(314);
      if (lookahead == '\'') ADVANCE(313);
      if (lookahead == '\\') ADVANCE(626);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(357);
      END_STATE();
    case 358:
      if (lookahead == '"') ADVANCE(346);
      if (lookahead == '\\') ADVANCE(637);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(358);
      END_STATE();
    case 359:
      if (lookahead == '"') ADVANCE(345);
      if (lookahead == '\'') ADVANCE(344);
      if (lookahead == '\\') ADVANCE(630);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(359);
      END_STATE();
    case 360:
      ADVANCE_MAP(
        '"', 356,
        '\'', 357,
        ')', 220,
        ']', 220,
        '}', 220,
        '#', 306,
        '(', 306,
        '[', 306,
        '{', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(313);
      END_STATE();
    case 361:
      ADVANCE_MAP(
        '"', 358,
        '\'', 359,
        ')', 227,
        ']', 227,
        '}', 227,
        '#', 306,
        '(', 306,
        '[', 306,
        '{', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(344);
      END_STATE();
    case 362:
      if (lookahead == '\'') ADVANCE(60);
      if (lookahead == '\\') ADVANCE(538);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(362);
      END_STATE();
    case 363:
      if (lookahead == '\'') ADVANCE(740);
      if (lookahead == '\\') ADVANCE(535);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(363);
      END_STATE();
    case 364:
      if (lookahead == '\'') ADVANCE(98);
      if (lookahead == '\\') ADVANCE(551);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(364);
      END_STATE();
    case 365:
      if (lookahead == '\'') ADVANCE(681);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 366:
      if (lookahead == '\'') ADVANCE(690);
      if (lookahead == '\\') ADVANCE(555);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(412);
      END_STATE();
    case 367:
      if (lookahead == '\'') ADVANCE(699);
      if (lookahead == '\\') ADVANCE(564);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(413);
      END_STATE();
    case 368:
      if (lookahead == '\'') ADVANCE(801);
      if (lookahead == '\\') ADVANCE(569);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(368);
      END_STATE();
    case 369:
      if (lookahead == '\'') ADVANCE(850);
      if (lookahead == '\\') ADVANCE(578);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(369);
      END_STATE();
    case 370:
      if (lookahead == '\'') ADVANCE(239);
      if (lookahead == '\\') ADVANCE(642);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(370);
      END_STATE();
    case 371:
      if (lookahead == '\'') ADVANCE(678);
      if (lookahead == '\\') ADVANCE(614);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(371);
      END_STATE();
    case 372:
      if (lookahead == '\'') ADVANCE(82);
      if (lookahead == '\\') ADVANCE(544);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(372);
      END_STATE();
    case 373:
      if (lookahead == '\'') ADVANCE(759);
      if (lookahead == '\\') ADVANCE(541);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(373);
      END_STATE();
    case 374:
      if (lookahead == '\'') ADVANCE(694);
      if (lookahead == '\\') ADVANCE(558);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(415);
      END_STATE();
    case 375:
      if (lookahead == '\'') ADVANCE(706);
      if (lookahead == '\\') ADVANCE(595);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(414);
      END_STATE();
    case 376:
      if (lookahead == '\'') ADVANCE(791);
      if (lookahead == '\\') ADVANCE(575);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(376);
      END_STATE();
    case 377:
      if (lookahead == '\'') ADVANCE(90);
      if (lookahead == '\\') ADVANCE(546);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(377);
      END_STATE();
    case 378:
      if (lookahead == '\'') ADVANCE(696);
      if (lookahead == '\\') ADVANCE(562);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(463);
      END_STATE();
    case 379:
      if (lookahead == '\'') ADVANCE(171);
      if (lookahead == '\\') ADVANCE(572);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(379);
      END_STATE();
    case 380:
      if (lookahead == '\'') ADVANCE(143);
      if (lookahead == '\\') ADVANCE(564);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(413);
      END_STATE();
    case 381:
      if (lookahead == '\'') ADVANCE(704);
      if (lookahead == '\\') ADVANCE(598);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(464);
      END_STATE();
    case 382:
      if (lookahead == '\'') ADVANCE(776);
      if (lookahead == '\\') ADVANCE(575);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(376);
      END_STATE();
    case 383:
      if (lookahead == '\'') ADVANCE(822);
      if (lookahead == '\\') ADVANCE(595);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(414);
      END_STATE();
    case 384:
      if (lookahead == '\'') ADVANCE(181);
      if (lookahead == '\\') ADVANCE(580);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(384);
      END_STATE();
    case 385:
      if (lookahead == '\'') ADVANCE(708);
      if (lookahead == '\\') ADVANCE(601);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(465);
      END_STATE();
    case 386:
      if (lookahead == '\'') ADVANCE(182);
      if (lookahead == '\\') ADVANCE(583);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(386);
      END_STATE();
    case 387:
      if (lookahead == '\'') ADVANCE(744);
      if (lookahead == '\\') ADVANCE(541);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(373);
      END_STATE();
    case 388:
      if (lookahead == '\'') ADVANCE(707);
      if (lookahead == '\\') ADVANCE(604);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(466);
      END_STATE();
    case 389:
      if (lookahead == '\'') ADVANCE(186);
      if (lookahead == '\\') ADVANCE(586);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(389);
      END_STATE();
    case 390:
      if (lookahead == '\'') ADVANCE(72);
      if (lookahead == '\\') ADVANCE(555);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(412);
      END_STATE();
    case 391:
      if (lookahead == '\'') ADVANCE(710);
      if (lookahead == '\\') ADVANCE(607);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(467);
      END_STATE();
    case 392:
      if (lookahead == '\'') ADVANCE(187);
      if (lookahead == '\\') ADVANCE(588);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(392);
      END_STATE();
    case 393:
      if (lookahead == '\'') ADVANCE(709);
      if (lookahead == '\\') ADVANCE(610);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(468);
      END_STATE();
    case 394:
      if (lookahead == '\'') ADVANCE(202);
      if (lookahead == '\\') ADVANCE(593);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(394);
      END_STATE();
    case 395:
      if (lookahead == '\'') ADVANCE(711);
      if (lookahead == '\\') ADVANCE(612);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(469);
      END_STATE();
    case 396:
      if (lookahead == '\'') ADVANCE(242);
      if (lookahead == '\\') ADVANCE(616);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(396);
      END_STATE();
    case 397:
      if (lookahead == '\'') ADVANCE(100);
      if (lookahead == '\\') ADVANCE(558);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(415);
      END_STATE();
    case 398:
      if (lookahead == '\'') ADVANCE(365);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 399:
      if (lookahead == '\'') ADVANCE(243);
      if (lookahead == '\\') ADVANCE(618);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(399);
      END_STATE();
    case 400:
      if (lookahead == '\'') ADVANCE(244);
      if (lookahead == '\\') ADVANCE(620);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(400);
      END_STATE();
    case 401:
      if (lookahead == '\'') ADVANCE(127);
      if (lookahead == '\\') ADVANCE(562);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(463);
      END_STATE();
    case 402:
      if (lookahead == '\'') ADVANCE(174);
      if (lookahead == '\\') ADVANCE(598);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(464);
      END_STATE();
    case 403:
      if (lookahead == '\'') ADVANCE(188);
      if (lookahead == '\\') ADVANCE(601);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(465);
      END_STATE();
    case 404:
      if (lookahead == '\'') ADVANCE(194);
      if (lookahead == '\\') ADVANCE(604);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(466);
      END_STATE();
    case 405:
      if (lookahead == '\'') ADVANCE(207);
      if (lookahead == '\\') ADVANCE(607);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(467);
      END_STATE();
    case 406:
      if (lookahead == '\'') ADVANCE(213);
      if (lookahead == '\\') ADVANCE(610);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(468);
      END_STATE();
    case 407:
      if (lookahead == '\'') ADVANCE(223);
      if (lookahead == '\\') ADVANCE(612);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(469);
      END_STATE();
    case 408:
      if (lookahead == '\'') ADVANCE(688);
      if (lookahead == '\\') ADVANCE(633);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(470);
      END_STATE();
    case 409:
      if (lookahead == '\'') ADVANCE(307);
      if (lookahead == '\\') ADVANCE(622);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(409);
      END_STATE();
    case 410:
      if (lookahead == '\'') ADVANCE(713);
      if (lookahead == '\\') ADVANCE(635);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(478);
      END_STATE();
    case 411:
      if (lookahead == '\'') ADVANCE(703);
      if (lookahead == '\\') ADVANCE(636);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(474);
      END_STATE();
    case 412:
      if (lookahead == '\'') ADVANCE(75);
      if (lookahead == '\\') ADVANCE(555);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(412);
      END_STATE();
    case 413:
      if (lookahead == '\'') ADVANCE(146);
      if (lookahead == '\\') ADVANCE(564);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(413);
      END_STATE();
    case 414:
      if (lookahead == '\'') ADVANCE(837);
      if (lookahead == '\\') ADVANCE(595);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(414);
      END_STATE();
    case 415:
      if (lookahead == '\'') ADVANCE(103);
      if (lookahead == '\\') ADVANCE(558);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(415);
      END_STATE();
    case 416:
      if (lookahead == '\'') ADVANCE(340);
      if (lookahead == '\\') ADVANCE(635);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(478);
      END_STATE();
    case 417:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '*') ADVANCE(453);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(47);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 418:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '*') ADVANCE(459);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(162);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 419:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '*') ADVANCE(456);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(172);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 420:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '/') ADVANCE(453);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(47);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 421:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '/') ADVANCE(459);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(162);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 422:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '/') ADVANCE(456);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(172);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 423:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '=') ADVANCE(453);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 424:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '=') ADVANCE(459);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 425:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '=') ADVANCE(456);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 426:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 'd') ADVANCE(453);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 427:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 'd') ADVANCE(459);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 428:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 'd') ADVANCE(456);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 429:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 'i') ADVANCE(433);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(429);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 430:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 'i') ADVANCE(436);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(430);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 431:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 'i') ADVANCE(439);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(431);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 432:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 'n') ADVANCE(453);
      if (lookahead == 's') ADVANCE(453);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 433:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 'n') ADVANCE(453);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 434:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 'n') ADVANCE(426);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 435:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 'n') ADVANCE(459);
      if (lookahead == 's') ADVANCE(459);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 436:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 'n') ADVANCE(459);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 437:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 'n') ADVANCE(427);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 438:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 'n') ADVANCE(456);
      if (lookahead == 's') ADVANCE(456);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 439:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 'n') ADVANCE(456);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 440:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 'n') ADVANCE(428);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 441:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 'o') ADVANCE(447);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 442:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 'o') ADVANCE(448);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 443:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 'o') ADVANCE(449);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 444:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 'r') ADVANCE(453);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 445:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 'r') ADVANCE(459);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 446:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 'r') ADVANCE(456);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 447:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 't') ADVANCE(450);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 448:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 't') ADVANCE(460);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 449:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == 't') ADVANCE(461);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 450:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(429);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 451:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(47);
      if (lookahead == '=' ||
          lookahead == '>') ADVANCE(453);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 452:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(47);
      if (('<' <= lookahead && lookahead <= '>')) ADVANCE(453);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 453:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(47);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 454:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(172);
      if (lookahead == '=' ||
          lookahead == '>') ADVANCE(456);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 455:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(172);
      if (('<' <= lookahead && lookahead <= '>')) ADVANCE(456);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 456:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(172);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 457:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(162);
      if (lookahead == '=' ||
          lookahead == '>') ADVANCE(459);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 458:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(162);
      if (('<' <= lookahead && lookahead <= '>')) ADVANCE(459);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 459:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(162);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 460:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(430);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 461:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(431);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 462:
      if (lookahead == '\'') ADVANCE(398);
      if (lookahead == '\\') ADVANCE(549);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 463:
      if (lookahead == '\'') ADVANCE(130);
      if (lookahead == '\\') ADVANCE(562);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(463);
      END_STATE();
    case 464:
      if (lookahead == '\'') ADVANCE(177);
      if (lookahead == '\\') ADVANCE(598);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(464);
      END_STATE();
    case 465:
      if (lookahead == '\'') ADVANCE(191);
      if (lookahead == '\\') ADVANCE(601);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(465);
      END_STATE();
    case 466:
      if (lookahead == '\'') ADVANCE(197);
      if (lookahead == '\\') ADVANCE(604);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(466);
      END_STATE();
    case 467:
      if (lookahead == '\'') ADVANCE(210);
      if (lookahead == '\\') ADVANCE(607);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(467);
      END_STATE();
    case 468:
      if (lookahead == '\'') ADVANCE(216);
      if (lookahead == '\\') ADVANCE(610);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(468);
      END_STATE();
    case 469:
      if (lookahead == '\'') ADVANCE(226);
      if (lookahead == '\\') ADVANCE(612);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(469);
      END_STATE();
    case 470:
      if (lookahead == '\'') ADVANCE(687);
      if (lookahead == '\\') ADVANCE(633);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(470);
      END_STATE();
    case 471:
      if (lookahead == '\'') ADVANCE(687);
      if (lookahead == '\\') ADVANCE(541);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(373);
      END_STATE();
    case 472:
      if (lookahead == '\'') ADVANCE(339);
      if (lookahead == '\\') ADVANCE(625);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(472);
      END_STATE();
    case 473:
      if (lookahead == '\'') ADVANCE(715);
      if (lookahead == '\\') ADVANCE(638);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(479);
      END_STATE();
    case 474:
      if (lookahead == '\'') ADVANCE(702);
      if (lookahead == '\\') ADVANCE(636);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(474);
      END_STATE();
    case 475:
      if (lookahead == '\'') ADVANCE(702);
      if (lookahead == '\\') ADVANCE(575);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(376);
      END_STATE();
    case 476:
      if (lookahead == '\'') ADVANCE(352);
      if (lookahead == '\\') ADVANCE(638);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(479);
      END_STATE();
    case 477:
      if (lookahead == '\'') ADVANCE(351);
      if (lookahead == '\\') ADVANCE(629);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(477);
      END_STATE();
    case 478:
      if (lookahead == '\'') ADVANCE(342);
      if (lookahead == '\\') ADVANCE(635);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(478);
      END_STATE();
    case 479:
      if (lookahead == '\'') ADVANCE(354);
      if (lookahead == '\\') ADVANCE(638);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(479);
      END_STATE();
    case 480:
      if (lookahead == '*') ADVANCE(515);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(45);
      END_STATE();
    case 481:
      if (lookahead == '*') ADVANCE(523);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(167);
      END_STATE();
    case 482:
      if (lookahead == '*') ADVANCE(520);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(178);
      END_STATE();
    case 483:
      if (lookahead == ',') ADVANCE(240);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(483);
      END_STATE();
    case 484:
      if (lookahead == ',') ADVANCE(519);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(484);
      END_STATE();
    case 485:
      if (lookahead == '/') ADVANCE(515);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(45);
      END_STATE();
    case 486:
      if (lookahead == '/') ADVANCE(523);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(167);
      END_STATE();
    case 487:
      if (lookahead == '/') ADVANCE(520);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(178);
      END_STATE();
    case 488:
      if (lookahead == '=') ADVANCE(515);
      END_STATE();
    case 489:
      if (lookahead == '=') ADVANCE(523);
      END_STATE();
    case 490:
      if (lookahead == '=') ADVANCE(520);
      END_STATE();
    case 491:
      if (lookahead == 'd') ADVANCE(515);
      END_STATE();
    case 492:
      if (lookahead == 'd') ADVANCE(523);
      END_STATE();
    case 493:
      if (lookahead == 'd') ADVANCE(520);
      END_STATE();
    case 494:
      if (lookahead == 'i') ADVANCE(497);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(494);
      END_STATE();
    case 495:
      if (lookahead == 'i') ADVANCE(500);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(495);
      END_STATE();
    case 496:
      if (lookahead == 'i') ADVANCE(503);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(496);
      END_STATE();
    case 497:
      if (lookahead == 'n') ADVANCE(515);
      END_STATE();
    case 498:
      if (lookahead == 'n') ADVANCE(515);
      if (lookahead == 's') ADVANCE(515);
      END_STATE();
    case 499:
      if (lookahead == 'n') ADVANCE(491);
      END_STATE();
    case 500:
      if (lookahead == 'n') ADVANCE(523);
      END_STATE();
    case 501:
      if (lookahead == 'n') ADVANCE(523);
      if (lookahead == 's') ADVANCE(523);
      END_STATE();
    case 502:
      if (lookahead == 'n') ADVANCE(492);
      END_STATE();
    case 503:
      if (lookahead == 'n') ADVANCE(520);
      END_STATE();
    case 504:
      if (lookahead == 'n') ADVANCE(520);
      if (lookahead == 's') ADVANCE(520);
      END_STATE();
    case 505:
      if (lookahead == 'n') ADVANCE(493);
      END_STATE();
    case 506:
      if (lookahead == 'o') ADVANCE(512);
      END_STATE();
    case 507:
      if (lookahead == 'o') ADVANCE(513);
      END_STATE();
    case 508:
      if (lookahead == 'o') ADVANCE(514);
      END_STATE();
    case 509:
      if (lookahead == 'r') ADVANCE(515);
      END_STATE();
    case 510:
      if (lookahead == 'r') ADVANCE(523);
      END_STATE();
    case 511:
      if (lookahead == 'r') ADVANCE(520);
      END_STATE();
    case 512:
      if (lookahead == 't') ADVANCE(518);
      END_STATE();
    case 513:
      if (lookahead == 't') ADVANCE(526);
      END_STATE();
    case 514:
      if (lookahead == 't') ADVANCE(527);
      END_STATE();
    case 515:
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(45);
      END_STATE();
    case 516:
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(45);
      if (lookahead == '=' ||
          lookahead == '>') ADVANCE(515);
      END_STATE();
    case 517:
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(45);
      if (('<' <= lookahead && lookahead <= '>')) ADVANCE(515);
      END_STATE();
    case 518:
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(494);
      END_STATE();
    case 519:
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(519);
      if (('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(674);
      END_STATE();
    case 520:
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(178);
      END_STATE();
    case 521:
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(178);
      if (lookahead == '=' ||
          lookahead == '>') ADVANCE(520);
      END_STATE();
    case 522:
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(178);
      if (('<' <= lookahead && lookahead <= '>')) ADVANCE(520);
      END_STATE();
    case 523:
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(167);
      END_STATE();
    case 524:
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(167);
      if (lookahead == '=' ||
          lookahead == '>') ADVANCE(523);
      END_STATE();
    case 525:
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(167);
      if (('<' <= lookahead && lookahead <= '>')) ADVANCE(523);
      END_STATE();
    case 526:
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(495);
      END_STATE();
    case 527:
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(496);
      END_STATE();
    case 528:
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(528);
      if (('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(656);
      END_STATE();
    case 529:
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(529);
      if (('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(674);
      END_STATE();
    case 530:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(675);
      END_STATE();
    case 531:
      if (('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(679);
      END_STATE();
    case 532:
      if (('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(669);
      END_STATE();
    case 533:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(246);
      END_STATE();
    case 534:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(27);
      END_STATE();
    case 535:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(363);
      END_STATE();
    case 536:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(71);
      END_STATE();
    case 537:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(26);
      END_STATE();
    case 538:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(362);
      END_STATE();
    case 539:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(254);
      END_STATE();
    case 540:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(29);
      END_STATE();
    case 541:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(373);
      END_STATE();
    case 542:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(50);
      END_STATE();
    case 543:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(46);
      END_STATE();
    case 544:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(372);
      END_STATE();
    case 545:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(61);
      END_STATE();
    case 546:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(377);
      END_STATE();
    case 547:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(259);
      END_STATE();
    case 548:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 549:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(462);
      END_STATE();
    case 550:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(30);
      END_STATE();
    case 551:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(364);
      END_STATE();
    case 552:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(78);
      END_STATE();
    case 553:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(308);
      END_STATE();
    case 554:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(247);
      END_STATE();
    case 555:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(412);
      END_STATE();
    case 556:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(106);
      END_STATE();
    case 557:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(255);
      END_STATE();
    case 558:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(415);
      END_STATE();
    case 559:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(310);
      END_STATE();
    case 560:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(54);
      END_STATE();
    case 561:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(260);
      END_STATE();
    case 562:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(463);
      END_STATE();
    case 563:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(248);
      END_STATE();
    case 564:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(413);
      END_STATE();
    case 565:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(316);
      END_STATE();
    case 566:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(253);
      END_STATE();
    case 567:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(319);
      END_STATE();
    case 568:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(36);
      END_STATE();
    case 569:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(368);
      END_STATE();
    case 570:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(320);
      END_STATE();
    case 571:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(68);
      END_STATE();
    case 572:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(379);
      END_STATE();
    case 573:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(59);
      END_STATE();
    case 574:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(39);
      END_STATE();
    case 575:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(376);
      END_STATE();
    case 576:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(140);
      END_STATE();
    case 577:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(38);
      END_STATE();
    case 578:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(369);
      END_STATE();
    case 579:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(83);
      END_STATE();
    case 580:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(384);
      END_STATE();
    case 581:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(322);
      END_STATE();
    case 582:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(91);
      END_STATE();
    case 583:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(386);
      END_STATE();
    case 584:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(323);
      END_STATE();
    case 585:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(94);
      END_STATE();
    case 586:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(389);
      END_STATE();
    case 587:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(99);
      END_STATE();
    case 588:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(392);
      END_STATE();
    case 589:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(151);
      END_STATE();
    case 590:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(155);
      END_STATE();
    case 591:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(324);
      END_STATE();
    case 592:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(110);
      END_STATE();
    case 593:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(394);
      END_STATE();
    case 594:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(250);
      END_STATE();
    case 595:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(414);
      END_STATE();
    case 596:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(325);
      END_STATE();
    case 597:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(309);
      END_STATE();
    case 598:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(464);
      END_STATE();
    case 599:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(165);
      END_STATE();
    case 600:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(311);
      END_STATE();
    case 601:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(465);
      END_STATE();
    case 602:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(170);
      END_STATE();
    case 603:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(312);
      END_STATE();
    case 604:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(466);
      END_STATE();
    case 605:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(326);
      END_STATE();
    case 606:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(315);
      END_STATE();
    case 607:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(467);
      END_STATE();
    case 608:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(185);
      END_STATE();
    case 609:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(317);
      END_STATE();
    case 610:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(468);
      END_STATE();
    case 611:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(321);
      END_STATE();
    case 612:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(469);
      END_STATE();
    case 613:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(41);
      END_STATE();
    case 614:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(371);
      END_STATE();
    case 615:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(117);
      END_STATE();
    case 616:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(396);
      END_STATE();
    case 617:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(121);
      END_STATE();
    case 618:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(399);
      END_STATE();
    case 619:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(126);
      END_STATE();
    case 620:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(400);
      END_STATE();
    case 621:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(245);
      END_STATE();
    case 622:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(409);
      END_STATE();
    case 623:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(331);
      END_STATE();
    case 624:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(329);
      END_STATE();
    case 625:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(472);
      END_STATE();
    case 626:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(357);
      END_STATE();
    case 627:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(335);
      END_STATE();
    case 628:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(347);
      END_STATE();
    case 629:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(477);
      END_STATE();
    case 630:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(359);
      END_STATE();
    case 631:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(350);
      END_STATE();
    case 632:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(327);
      END_STATE();
    case 633:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(470);
      END_STATE();
    case 634:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(356);
      END_STATE();
    case 635:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(478);
      END_STATE();
    case 636:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(474);
      END_STATE();
    case 637:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(358);
      END_STATE();
    case 638:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(479);
      END_STATE();
    case 639:
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(868);
      END_STATE();
    case 640:
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(871);
      END_STATE();
    case 641:
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(40);
      END_STATE();
    case 642:
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(370);
      END_STATE();
    case 643:
      if (eof) ADVANCE(644);
      if (lookahead == '"') ADVANCE(867);
      if (lookahead == '#') ADVANCE(645);
      if (lookahead == '$') ADVANCE(676);
      if (lookahead == '\'') ADVANCE(870);
      if (lookahead == ':') ADVANCE(667);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(643);
      if (('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(657);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n') ADVANCE(663);
      END_STATE();
    case 644:
      ACCEPT_TOKEN(ts_builtin_sym_end);
      END_STATE();
    case 645:
      ACCEPT_TOKEN(sym_comment);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(645);
      END_STATE();
    case 646:
      ACCEPT_TOKEN(sym_identifier);
      ADVANCE_MAP(
        '"', 27,
        '\'', 363,
        'o', 647,
        '\t', 2,
        ' ', 2,
        '(', 60,
        '[', 60,
        '{', 60,
      );
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(648);
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 647:
      ACCEPT_TOKEN(sym_identifier);
      ADVANCE_MAP(
        '"', 27,
        '\'', 363,
        't', 649,
        '\t', 2,
        ' ', 2,
        '(', 60,
        '[', 60,
        '{', 60,
      );
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(648);
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 648:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '"') ADVANCE(27);
      if (lookahead == '\'') ADVANCE(363);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(2);
      if (lookahead == '(' ||
          lookahead == '[' ||
          lookahead == '{') ADVANCE(60);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(648);
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 649:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '"') ADVANCE(27);
      if (lookahead == '\'') ADVANCE(363);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(3);
      if (lookahead == '(' ||
          lookahead == '[' ||
          lookahead == '{') ADVANCE(60);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(648);
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 650:
      ACCEPT_TOKEN(sym_identifier);
      ADVANCE_MAP(
        '"', 36,
        '\'', 368,
        ',', 178,
        'o', 651,
        '\t', 14,
        ' ', 14,
        '(', 171,
        '[', 171,
        '{', 171,
      );
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(652);
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 651:
      ACCEPT_TOKEN(sym_identifier);
      ADVANCE_MAP(
        '"', 36,
        '\'', 368,
        ',', 178,
        't', 653,
        '\t', 14,
        ' ', 14,
        '(', 171,
        '[', 171,
        '{', 171,
      );
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(652);
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 652:
      ACCEPT_TOKEN(sym_identifier);
      ADVANCE_MAP(
        '"', 36,
        '\'', 368,
        ',', 178,
        '\t', 14,
        ' ', 14,
        '(', 171,
        '[', 171,
        '{', 171,
      );
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(652);
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 653:
      ACCEPT_TOKEN(sym_identifier);
      ADVANCE_MAP(
        '"', 36,
        '\'', 368,
        ',', 178,
        '\t', 7,
        ' ', 7,
        '(', 171,
        '[', 171,
        '{', 171,
      );
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(652);
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 654:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '.') ADVANCE(531);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(654);
      END_STATE();
    case 655:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '.') ADVANCE(662);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(655);
      END_STATE();
    case 656:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '.') ADVANCE(532);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(656);
      END_STATE();
    case 657:
      ACCEPT_TOKEN(sym_identifier);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(657);
      END_STATE();
    case 658:
      ACCEPT_TOKEN(sym_expression);
      if (lookahead == '\r') ADVANCE(868);
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(867);
      END_STATE();
    case 659:
      ACCEPT_TOKEN(sym_expression);
      if (lookahead == '\r') ADVANCE(871);
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(870);
      END_STATE();
    case 660:
      ACCEPT_TOKEN(sym_expression);
      if (lookahead == '"') ADVANCE(663);
      if (lookahead == '\\') ADVANCE(665);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(660);
      END_STATE();
    case 661:
      ACCEPT_TOKEN(sym_expression);
      if (lookahead == '"') ADVANCE(660);
      if (lookahead == '\'') ADVANCE(664);
      if (lookahead == '\t' ||
          lookahead == ' ' ||
          lookahead == ':') ADVANCE(24);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(675);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(663);
      END_STATE();
    case 662:
      ACCEPT_TOKEN(sym_expression);
      if (lookahead == '"') ADVANCE(660);
      if (lookahead == '\'') ADVANCE(664);
      if (lookahead == '\t' ||
          lookahead == ' ' ||
          lookahead == ':') ADVANCE(24);
      if (('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(668);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(663);
      END_STATE();
    case 663:
      ACCEPT_TOKEN(sym_expression);
      if (lookahead == '"') ADVANCE(660);
      if (lookahead == '\'') ADVANCE(664);
      if (lookahead == '\t' ||
          lookahead == ' ' ||
          lookahead == ':') ADVANCE(24);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(663);
      END_STATE();
    case 664:
      ACCEPT_TOKEN(sym_expression);
      if (lookahead == '\'') ADVANCE(663);
      if (lookahead == '\\') ADVANCE(666);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(664);
      END_STATE();
    case 665:
      ACCEPT_TOKEN(sym_expression);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(660);
      END_STATE();
    case 666:
      ACCEPT_TOKEN(sym_expression);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(664);
      END_STATE();
    case 667:
      ACCEPT_TOKEN(anon_sym_COLON);
      END_STATE();
    case 668:
      ACCEPT_TOKEN(sym__dotted_label_name);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(668);
      END_STATE();
    case 669:
      ACCEPT_TOKEN(sym__dotted_store_name);
      if (lookahead == '.') ADVANCE(532);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(669);
      END_STATE();
    case 670:
      ACCEPT_TOKEN(anon_sym_LPAREN);
      END_STATE();
    case 671:
      ACCEPT_TOKEN(anon_sym_RPAREN);
      END_STATE();
    case 672:
      ACCEPT_TOKEN(sym__parameter_blob);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(672);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '#' &&
          lookahead != ')') ADVANCE(673);
      END_STATE();
    case 673:
      ACCEPT_TOKEN(sym__parameter_blob);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '#' &&
          lookahead != ')') ADVANCE(673);
      END_STATE();
    case 674:
      ACCEPT_TOKEN(sym__for_target_blob);
      if (lookahead == ',') ADVANCE(519);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(484);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(674);
      END_STATE();
    case 675:
      ACCEPT_TOKEN(aux_sym_init_python_statement_token1);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(675);
      END_STATE();
    case 676:
      ACCEPT_TOKEN(anon_sym_DOLLAR);
      END_STATE();
    case 677:
      ACCEPT_TOKEN(anon_sym_EQ);
      END_STATE();
    case 678:
      ACCEPT_TOKEN(sym__at_expr_blob);
      ADVANCE_MAP(
        '"', 41,
        '\'', 371,
        ',', 240,
        '\t', 483,
        ' ', 483,
        '(', 242,
        '[', 242,
        '{', 242,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(678);
      END_STATE();
    case 679:
      ACCEPT_TOKEN(sym__audio_name);
      if (lookahead == '.') ADVANCE(531);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(679);
      END_STATE();
    case 680:
      ACCEPT_TOKEN(sym__audio_list);
      END_STATE();
    case 681:
      ACCEPT_TOKEN(sym__screen_string);
      END_STATE();
    case 682:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(60);
      if (lookahead == '\\') ADVANCE(537);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(26);
      END_STATE();
    case 683:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(740);
      if (lookahead == '\\') ADVANCE(534);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(27);
      END_STATE();
    case 684:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(98);
      if (lookahead == '\\') ADVANCE(550);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(30);
      END_STATE();
    case 685:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(801);
      if (lookahead == '\\') ADVANCE(568);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(36);
      END_STATE();
    case 686:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(850);
      if (lookahead == '\\') ADVANCE(577);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(38);
      END_STATE();
    case 687:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(27);
      if (lookahead == '\'') ADVANCE(363);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(2);
      if (lookahead == '(' ||
          lookahead == '[' ||
          lookahead == '{') ADVANCE(60);
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 688:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(27);
      if (lookahead == '\'') ADVANCE(373);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(2);
      if (lookahead == '(' ||
          lookahead == '[' ||
          lookahead == '{') ADVANCE(60);
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 689:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(82);
      if (lookahead == '\\') ADVANCE(543);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(46);
      END_STATE();
    case 690:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 26,
        '\'', 362,
        '(', 82,
        '[', 82,
        '{', 82,
        ')', 740,
        ']', 740,
        '}', 740,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(60);
      END_STATE();
    case 691:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(90);
      if (lookahead == '\\') ADVANCE(545);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(61);
      END_STATE();
    case 692:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(29);
      if (lookahead == '\'') ADVANCE(363);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(2);
      if (lookahead == '(' ||
          lookahead == '[' ||
          lookahead == '{') ADVANCE(60);
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 693:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(171);
      if (lookahead == '\\') ADVANCE(571);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(68);
      END_STATE();
    case 694:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 46,
        '\'', 372,
        '(', 90,
        '[', 90,
        '{', 90,
        ')', 60,
        ']', 60,
        '}', 60,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(82);
      END_STATE();
    case 695:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(181);
      if (lookahead == '\\') ADVANCE(579);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(83);
      END_STATE();
    case 696:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 61,
        '\'', 377,
        '(', 98,
        '[', 98,
        '{', 98,
        ')', 82,
        ']', 82,
        '}', 82,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(90);
      END_STATE();
    case 697:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(182);
      if (lookahead == '\\') ADVANCE(582);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(91);
      END_STATE();
    case 698:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(186);
      if (lookahead == '\\') ADVANCE(585);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(94);
      END_STATE();
    case 699:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(30);
      if (lookahead == '\'') ADVANCE(364);
      if (lookahead == ')' ||
          lookahead == ']' ||
          lookahead == '}') ADVANCE(90);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#' &&
          (lookahead < '\'' || ')' < lookahead) &&
          lookahead != '[' &&
          lookahead != '{') ADVANCE(98);
      END_STATE();
    case 700:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(187);
      if (lookahead == '\\') ADVANCE(587);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(99);
      END_STATE();
    case 701:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(202);
      if (lookahead == '\\') ADVANCE(592);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(110);
      END_STATE();
    case 702:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 36,
        '\'', 368,
        ',', 178,
        '\t', 14,
        ' ', 14,
        '(', 171,
        '[', 171,
        '{', 171,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 703:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 36,
        '\'', 376,
        ',', 178,
        '\t', 14,
        ' ', 14,
        '(', 171,
        '[', 171,
        '{', 171,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 704:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 68,
        '\'', 379,
        '(', 181,
        '[', 181,
        '{', 181,
        ')', 801,
        ']', 801,
        '}', 801,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(171);
      END_STATE();
    case 705:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 39,
        '\'', 368,
        ',', 178,
        '\t', 14,
        ' ', 14,
        '(', 171,
        '[', 171,
        '{', 171,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 706:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 38,
        '\'', 369,
        ',', 178,
        '\t', 17,
        ' ', 17,
        '(', 182,
        '[', 182,
        '{', 182,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 707:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 83,
        '\'', 384,
        '(', 186,
        '[', 186,
        '{', 186,
        ')', 171,
        ']', 171,
        '}', 171,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(181);
      END_STATE();
    case 708:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 91,
        '\'', 386,
        '(', 187,
        '[', 187,
        '{', 187,
        ')', 850,
        ']', 850,
        '}', 850,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(182);
      END_STATE();
    case 709:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 94,
        '\'', 389,
        '(', 307,
        '[', 307,
        '{', 307,
        ')', 181,
        ']', 181,
        '}', 181,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(186);
      END_STATE();
    case 710:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 99,
        '\'', 392,
        '(', 202,
        '[', 202,
        '{', 202,
        ')', 182,
        ']', 182,
        '}', 182,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(187);
      END_STATE();
    case 711:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 110,
        '\'', 394,
        '(', 339,
        '[', 339,
        '{', 339,
        ')', 187,
        ']', 187,
        '}', 187,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(202);
      END_STATE();
    case 712:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(307);
      if (lookahead == '\\') ADVANCE(621);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(245);
      END_STATE();
    case 713:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(245);
      if (lookahead == '\'') ADVANCE(409);
      if (lookahead == ')' ||
          lookahead == ']' ||
          lookahead == '}') ADVANCE(186);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#' &&
          (lookahead < '\'' || ')' < lookahead) &&
          lookahead != '[' &&
          lookahead != '{') ADVANCE(307);
      END_STATE();
    case 714:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(339);
      if (lookahead == '\\') ADVANCE(624);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(329);
      END_STATE();
    case 715:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(329);
      if (lookahead == '\'') ADVANCE(472);
      if (lookahead == ')' ||
          lookahead == ']' ||
          lookahead == '}') ADVANCE(202);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#' &&
          (lookahead < '\'' || ')' < lookahead) &&
          lookahead != '[' &&
          lookahead != '{') ADVANCE(339);
      END_STATE();
    case 716:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '\'') ADVANCE(60);
      if (lookahead == '\\') ADVANCE(538);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(362);
      END_STATE();
    case 717:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '\'') ADVANCE(740);
      if (lookahead == '\\') ADVANCE(535);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(363);
      END_STATE();
    case 718:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '\'') ADVANCE(98);
      if (lookahead == '\\') ADVANCE(551);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(364);
      END_STATE();
    case 719:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '\'') ADVANCE(801);
      if (lookahead == '\\') ADVANCE(569);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(368);
      END_STATE();
    case 720:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '\'') ADVANCE(850);
      if (lookahead == '\\') ADVANCE(578);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(369);
      END_STATE();
    case 721:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '\'') ADVANCE(82);
      if (lookahead == '\\') ADVANCE(544);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(372);
      END_STATE();
    case 722:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '\'') ADVANCE(90);
      if (lookahead == '\\') ADVANCE(546);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(377);
      END_STATE();
    case 723:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '\'') ADVANCE(171);
      if (lookahead == '\\') ADVANCE(572);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(379);
      END_STATE();
    case 724:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '\'') ADVANCE(181);
      if (lookahead == '\\') ADVANCE(580);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(384);
      END_STATE();
    case 725:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '\'') ADVANCE(182);
      if (lookahead == '\\') ADVANCE(583);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(386);
      END_STATE();
    case 726:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '\'') ADVANCE(186);
      if (lookahead == '\\') ADVANCE(586);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(389);
      END_STATE();
    case 727:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '\'') ADVANCE(187);
      if (lookahead == '\\') ADVANCE(588);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(392);
      END_STATE();
    case 728:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '\'') ADVANCE(202);
      if (lookahead == '\\') ADVANCE(593);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(394);
      END_STATE();
    case 729:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '\'') ADVANCE(307);
      if (lookahead == '\\') ADVANCE(622);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(409);
      END_STATE();
    case 730:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '\'') ADVANCE(339);
      if (lookahead == '\\') ADVANCE(625);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(472);
      END_STATE();
    case 731:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 27,
        '\'', 363,
        '*', 743,
        '\t', 3,
        ' ', 3,
        '(', 60,
        '[', 60,
        '{', 60,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 732:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 27,
        '\'', 363,
        '/', 743,
        '\t', 3,
        ' ', 3,
        '(', 60,
        '[', 60,
        '{', 60,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 733:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 27,
        '\'', 363,
        '=', 743,
        '\t', 2,
        ' ', 2,
        '(', 60,
        '[', 60,
        '{', 60,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 734:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 27,
        '\'', 363,
        'd', 743,
        '\t', 2,
        ' ', 2,
        '(', 60,
        '[', 60,
        '{', 60,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 735:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 27,
        '\'', 363,
        'n', 734,
        '\t', 2,
        ' ', 2,
        '(', 60,
        '[', 60,
        '{', 60,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 736:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 27,
        '\'', 363,
        'n', 743,
        's', 743,
        '\t', 2,
        ' ', 2,
        '(', 60,
        '[', 60,
        '{', 60,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 737:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 27,
        '\'', 363,
        'o', 739,
        '\t', 2,
        ' ', 2,
        '(', 60,
        '[', 60,
        '{', 60,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 738:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 27,
        '\'', 363,
        'r', 743,
        '\t', 2,
        ' ', 2,
        '(', 60,
        '[', 60,
        '{', 60,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 739:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 27,
        '\'', 363,
        't', 743,
        '\t', 2,
        ' ', 2,
        '(', 60,
        '[', 60,
        '{', 60,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 740:
      ACCEPT_TOKEN(sym__screen_value);
      if (lookahead == '"') ADVANCE(27);
      if (lookahead == '\'') ADVANCE(363);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(2);
      if (lookahead == '(' ||
          lookahead == '[' ||
          lookahead == '{') ADVANCE(60);
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 741:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 27,
        '\'', 363,
        '\t', 3,
        ' ', 3,
        '=', 743,
        '>', 743,
        '(', 60,
        '[', 60,
        '{', 60,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 742:
      ACCEPT_TOKEN(sym__screen_value);
      if (lookahead == '"') ADVANCE(27);
      if (lookahead == '\'') ADVANCE(363);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(3);
      if (lookahead == '(' ||
          lookahead == '[' ||
          lookahead == '{') ADVANCE(60);
      if (('<' <= lookahead && lookahead <= '>')) ADVANCE(743);
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 743:
      ACCEPT_TOKEN(sym__screen_value);
      if (lookahead == '"') ADVANCE(27);
      if (lookahead == '\'') ADVANCE(363);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(3);
      if (lookahead == '(' ||
          lookahead == '[' ||
          lookahead == '{') ADVANCE(60);
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(740);
      END_STATE();
    case 744:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 71,
        '\'', 717,
        '\\', 745,
        '\t', 5,
        ' ', 5,
        '(', 73,
        '[', 73,
        '{', 73,
        '#', 462,
        ')', 462,
        ',', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(755);
      END_STATE();
    case 745:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 71,
        '\'', 373,
        '\t', 5,
        ' ', 5,
        '(', 73,
        '[', 73,
        '{', 73,
        '#', 462,
        ')', 462,
        ',', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(755);
      END_STATE();
    case 746:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 71,
        '\'', 387,
        '*', 758,
        '\\', 745,
        '\t', 11,
        ' ', 11,
        '(', 73,
        '[', 73,
        '{', 73,
        '#', 462,
        ')', 462,
        ',', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(755);
      END_STATE();
    case 747:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 71,
        '\'', 387,
        '/', 758,
        '\\', 745,
        '\t', 11,
        ' ', 11,
        '(', 73,
        '[', 73,
        '{', 73,
        '#', 462,
        ')', 462,
        ',', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(755);
      END_STATE();
    case 748:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 71,
        '\'', 387,
        '=', 758,
        '\\', 745,
        '\t', 5,
        ' ', 5,
        '(', 73,
        '[', 73,
        '{', 73,
        '#', 462,
        ')', 462,
        ',', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(755);
      END_STATE();
    case 749:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 71,
        '\'', 387,
        '\\', 745,
        'd', 758,
        '\t', 5,
        ' ', 5,
        '(', 73,
        '[', 73,
        '{', 73,
        '#', 462,
        ')', 462,
        ',', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(755);
      END_STATE();
    case 750:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 71,
        '\'', 387,
        '\\', 745,
        'n', 749,
        '\t', 5,
        ' ', 5,
        '(', 73,
        '[', 73,
        '{', 73,
        '#', 462,
        ')', 462,
        ',', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(755);
      END_STATE();
    case 751:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 71,
        '\'', 387,
        '\\', 745,
        'n', 758,
        's', 758,
        '\t', 5,
        ' ', 5,
        '(', 73,
        '[', 73,
        '{', 73,
        '#', 462,
        ')', 462,
        ',', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(755);
      END_STATE();
    case 752:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 71,
        '\'', 387,
        '\\', 745,
        'o', 754,
        '\t', 5,
        ' ', 5,
        '(', 73,
        '[', 73,
        '{', 73,
        '#', 462,
        ')', 462,
        ',', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(755);
      END_STATE();
    case 753:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 71,
        '\'', 387,
        '\\', 745,
        'r', 758,
        '\t', 5,
        ' ', 5,
        '(', 73,
        '[', 73,
        '{', 73,
        '#', 462,
        ')', 462,
        ',', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(755);
      END_STATE();
    case 754:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 71,
        '\'', 387,
        '\\', 745,
        't', 758,
        '\t', 5,
        ' ', 5,
        '(', 73,
        '[', 73,
        '{', 73,
        '#', 462,
        ')', 462,
        ',', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(755);
      END_STATE();
    case 755:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 71,
        '\'', 387,
        '\\', 745,
        '\t', 5,
        ' ', 5,
        '(', 73,
        '[', 73,
        '{', 73,
        '#', 462,
        ')', 462,
        ',', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(755);
      END_STATE();
    case 756:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 71,
        '\'', 387,
        '\\', 745,
        '\t', 11,
        ' ', 11,
        '=', 758,
        '>', 758,
        '(', 73,
        '[', 73,
        '{', 73,
        '#', 462,
        ')', 462,
        ',', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(755);
      END_STATE();
    case 757:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 71,
        '\'', 387,
        '\\', 745,
        '\t', 11,
        ' ', 11,
        '(', 73,
        '[', 73,
        '{', 73,
      );
      if (('<' <= lookahead && lookahead <= '>')) ADVANCE(758);
      if (lookahead == '#' ||
          lookahead == ')' ||
          lookahead == ',' ||
          lookahead == ':' ||
          lookahead == ']' ||
          lookahead == '}') ADVANCE(462);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(755);
      END_STATE();
    case 758:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 71,
        '\'', 387,
        '\\', 745,
        '\t', 11,
        ' ', 11,
        '(', 73,
        '[', 73,
        '{', 73,
        '#', 462,
        ')', 462,
        ',', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(755);
      END_STATE();
    case 759:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 71,
        '\'', 471,
        '\\', 745,
        '\t', 5,
        ' ', 5,
        '(', 73,
        '[', 73,
        '{', 73,
        '#', 462,
        ')', 462,
        ',', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(755);
      END_STATE();
    case 760:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 683,
        '\'', 246,
        '\\', 761,
        '\t', 4,
        ' ', 4,
        '(', 109,
        '[', 109,
        '{', 109,
        '#', 306,
        ')', 306,
        ',', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(772);
      END_STATE();
    case 761:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 29,
        '\'', 246,
        '\t', 4,
        ' ', 4,
        '(', 109,
        '[', 109,
        '{', 109,
        '#', 306,
        ')', 306,
        ',', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(772);
      END_STATE();
    case 762:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 685,
        '\'', 316,
        ',', 193,
        '\\', 805,
        '\t', 15,
        ' ', 15,
        '(', 199,
        '[', 199,
        '{', 199,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(815);
      END_STATE();
    case 763:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 84,
        '\'', 246,
        '*', 775,
        '\\', 761,
        '\t', 6,
        ' ', 6,
        '(', 109,
        '[', 109,
        '{', 109,
        '#', 306,
        ')', 306,
        ',', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(772);
      END_STATE();
    case 764:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 84,
        '\'', 246,
        '/', 775,
        '\\', 761,
        '\t', 6,
        ' ', 6,
        '(', 109,
        '[', 109,
        '{', 109,
        '#', 306,
        ')', 306,
        ',', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(772);
      END_STATE();
    case 765:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 84,
        '\'', 246,
        '=', 775,
        '\\', 761,
        '\t', 4,
        ' ', 4,
        '(', 109,
        '[', 109,
        '{', 109,
        '#', 306,
        ')', 306,
        ',', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(772);
      END_STATE();
    case 766:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 84,
        '\'', 246,
        '\\', 761,
        'd', 775,
        '\t', 4,
        ' ', 4,
        '(', 109,
        '[', 109,
        '{', 109,
        '#', 306,
        ')', 306,
        ',', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(772);
      END_STATE();
    case 767:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 84,
        '\'', 246,
        '\\', 761,
        'n', 766,
        '\t', 4,
        ' ', 4,
        '(', 109,
        '[', 109,
        '{', 109,
        '#', 306,
        ')', 306,
        ',', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(772);
      END_STATE();
    case 768:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 84,
        '\'', 246,
        '\\', 761,
        'n', 775,
        's', 775,
        '\t', 4,
        ' ', 4,
        '(', 109,
        '[', 109,
        '{', 109,
        '#', 306,
        ')', 306,
        ',', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(772);
      END_STATE();
    case 769:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 84,
        '\'', 246,
        '\\', 761,
        'o', 771,
        '\t', 4,
        ' ', 4,
        '(', 109,
        '[', 109,
        '{', 109,
        '#', 306,
        ')', 306,
        ',', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(772);
      END_STATE();
    case 770:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 84,
        '\'', 246,
        '\\', 761,
        'r', 775,
        '\t', 4,
        ' ', 4,
        '(', 109,
        '[', 109,
        '{', 109,
        '#', 306,
        ')', 306,
        ',', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(772);
      END_STATE();
    case 771:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 84,
        '\'', 246,
        '\\', 761,
        't', 775,
        '\t', 4,
        ' ', 4,
        '(', 109,
        '[', 109,
        '{', 109,
        '#', 306,
        ')', 306,
        ',', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(772);
      END_STATE();
    case 772:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 84,
        '\'', 246,
        '\\', 761,
        '\t', 4,
        ' ', 4,
        '(', 109,
        '[', 109,
        '{', 109,
        '#', 306,
        ')', 306,
        ',', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(772);
      END_STATE();
    case 773:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 84,
        '\'', 246,
        '\\', 761,
        '\t', 6,
        ' ', 6,
        '=', 775,
        '>', 775,
        '(', 109,
        '[', 109,
        '{', 109,
        '#', 306,
        ')', 306,
        ',', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(772);
      END_STATE();
    case 774:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 84,
        '\'', 246,
        '\\', 761,
        '\t', 6,
        ' ', 6,
        '(', 109,
        '[', 109,
        '{', 109,
      );
      if (('<' <= lookahead && lookahead <= '>')) ADVANCE(775);
      if (lookahead == '#' ||
          lookahead == ')' ||
          lookahead == ',' ||
          lookahead == ':' ||
          lookahead == ']' ||
          lookahead == '}') ADVANCE(306);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(772);
      END_STATE();
    case 775:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 84,
        '\'', 246,
        '\\', 761,
        '\t', 6,
        ' ', 6,
        '(', 109,
        '[', 109,
        '{', 109,
        '#', 306,
        ')', 306,
        ',', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(772);
      END_STATE();
    case 776:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 253,
        '\'', 719,
        ',', 172,
        '\\', 777,
        '\t', 16,
        ' ', 16,
        '(', 175,
        '[', 175,
        '{', 175,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(787);
      END_STATE();
    case 777:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 253,
        '\'', 376,
        ',', 172,
        '\t', 16,
        ' ', 16,
        '(', 175,
        '[', 175,
        '{', 175,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(787);
      END_STATE();
    case 778:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 253,
        '\'', 382,
        '*', 790,
        ',', 172,
        '\\', 777,
        '\t', 13,
        ' ', 13,
        '(', 175,
        '[', 175,
        '{', 175,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(787);
      END_STATE();
    case 779:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 253,
        '\'', 382,
        ',', 172,
        '/', 790,
        '\\', 777,
        '\t', 13,
        ' ', 13,
        '(', 175,
        '[', 175,
        '{', 175,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(787);
      END_STATE();
    case 780:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 253,
        '\'', 382,
        ',', 172,
        '=', 790,
        '\\', 777,
        '\t', 16,
        ' ', 16,
        '(', 175,
        '[', 175,
        '{', 175,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(787);
      END_STATE();
    case 781:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 253,
        '\'', 382,
        ',', 172,
        '\\', 777,
        'd', 790,
        '\t', 16,
        ' ', 16,
        '(', 175,
        '[', 175,
        '{', 175,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(787);
      END_STATE();
    case 782:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 253,
        '\'', 382,
        ',', 172,
        '\\', 777,
        'n', 781,
        '\t', 16,
        ' ', 16,
        '(', 175,
        '[', 175,
        '{', 175,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(787);
      END_STATE();
    case 783:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 253,
        '\'', 382,
        ',', 172,
        '\\', 777,
        'n', 790,
        's', 790,
        '\t', 16,
        ' ', 16,
        '(', 175,
        '[', 175,
        '{', 175,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(787);
      END_STATE();
    case 784:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 253,
        '\'', 382,
        ',', 172,
        '\\', 777,
        'o', 786,
        '\t', 16,
        ' ', 16,
        '(', 175,
        '[', 175,
        '{', 175,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(787);
      END_STATE();
    case 785:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 253,
        '\'', 382,
        ',', 172,
        '\\', 777,
        'r', 790,
        '\t', 16,
        ' ', 16,
        '(', 175,
        '[', 175,
        '{', 175,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(787);
      END_STATE();
    case 786:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 253,
        '\'', 382,
        ',', 172,
        '\\', 777,
        't', 790,
        '\t', 16,
        ' ', 16,
        '(', 175,
        '[', 175,
        '{', 175,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(787);
      END_STATE();
    case 787:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 253,
        '\'', 382,
        ',', 172,
        '\\', 777,
        '\t', 16,
        ' ', 16,
        '(', 175,
        '[', 175,
        '{', 175,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(787);
      END_STATE();
    case 788:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 253,
        '\'', 382,
        ',', 172,
        '\\', 777,
        '\t', 13,
        ' ', 13,
        '=', 790,
        '>', 790,
        '(', 175,
        '[', 175,
        '{', 175,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(787);
      END_STATE();
    case 789:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 253,
        '\'', 382,
        ',', 172,
        '\\', 777,
        '\t', 13,
        ' ', 13,
        '(', 175,
        '[', 175,
        '{', 175,
      );
      if (('<' <= lookahead && lookahead <= '>')) ADVANCE(790);
      if (lookahead == '#' ||
          lookahead == ')' ||
          lookahead == ':' ||
          lookahead == ']' ||
          lookahead == '}') ADVANCE(462);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(787);
      END_STATE();
    case 790:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 253,
        '\'', 382,
        ',', 172,
        '\\', 777,
        '\t', 13,
        ' ', 13,
        '(', 175,
        '[', 175,
        '{', 175,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(787);
      END_STATE();
    case 791:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 253,
        '\'', 475,
        ',', 172,
        '\\', 777,
        '\t', 16,
        ' ', 16,
        '(', 175,
        '[', 175,
        '{', 175,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(787);
      END_STATE();
    case 792:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 36,
        '\'', 368,
        '*', 804,
        ',', 178,
        '\t', 7,
        ' ', 7,
        '(', 171,
        '[', 171,
        '{', 171,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 793:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 36,
        '\'', 368,
        ',', 178,
        '/', 804,
        '\t', 7,
        ' ', 7,
        '(', 171,
        '[', 171,
        '{', 171,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 794:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 36,
        '\'', 368,
        ',', 178,
        '=', 804,
        '\t', 14,
        ' ', 14,
        '(', 171,
        '[', 171,
        '{', 171,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 795:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 36,
        '\'', 368,
        ',', 178,
        'd', 804,
        '\t', 14,
        ' ', 14,
        '(', 171,
        '[', 171,
        '{', 171,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 796:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 36,
        '\'', 368,
        ',', 178,
        'n', 795,
        '\t', 14,
        ' ', 14,
        '(', 171,
        '[', 171,
        '{', 171,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 797:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 36,
        '\'', 368,
        ',', 178,
        'n', 804,
        's', 804,
        '\t', 14,
        ' ', 14,
        '(', 171,
        '[', 171,
        '{', 171,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 798:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 36,
        '\'', 368,
        ',', 178,
        'o', 800,
        '\t', 14,
        ' ', 14,
        '(', 171,
        '[', 171,
        '{', 171,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 799:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 36,
        '\'', 368,
        ',', 178,
        'r', 804,
        '\t', 14,
        ' ', 14,
        '(', 171,
        '[', 171,
        '{', 171,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 800:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 36,
        '\'', 368,
        ',', 178,
        't', 804,
        '\t', 14,
        ' ', 14,
        '(', 171,
        '[', 171,
        '{', 171,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 801:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 36,
        '\'', 368,
        ',', 178,
        '\t', 14,
        ' ', 14,
        '(', 171,
        '[', 171,
        '{', 171,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 802:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 36,
        '\'', 368,
        ',', 178,
        '\t', 7,
        ' ', 7,
        '=', 804,
        '>', 804,
        '(', 171,
        '[', 171,
        '{', 171,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 803:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 36,
        '\'', 368,
        ',', 178,
        '\t', 7,
        ' ', 7,
        '(', 171,
        '[', 171,
        '{', 171,
      );
      if (('<' <= lookahead && lookahead <= '>')) ADVANCE(804);
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 804:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 36,
        '\'', 368,
        ',', 178,
        '\t', 7,
        ' ', 7,
        '(', 171,
        '[', 171,
        '{', 171,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 805:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 39,
        '\'', 316,
        ',', 193,
        '\t', 15,
        ' ', 15,
        '(', 199,
        '[', 199,
        '{', 199,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(815);
      END_STATE();
    case 806:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 66,
        '\'', 316,
        '*', 818,
        ',', 193,
        '\\', 805,
        '\t', 10,
        ' ', 10,
        '(', 199,
        '[', 199,
        '{', 199,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(815);
      END_STATE();
    case 807:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 66,
        '\'', 316,
        ',', 193,
        '/', 818,
        '\\', 805,
        '\t', 10,
        ' ', 10,
        '(', 199,
        '[', 199,
        '{', 199,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(815);
      END_STATE();
    case 808:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 66,
        '\'', 316,
        ',', 193,
        '=', 818,
        '\\', 805,
        '\t', 15,
        ' ', 15,
        '(', 199,
        '[', 199,
        '{', 199,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(815);
      END_STATE();
    case 809:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 66,
        '\'', 316,
        ',', 193,
        '\\', 805,
        'd', 818,
        '\t', 15,
        ' ', 15,
        '(', 199,
        '[', 199,
        '{', 199,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(815);
      END_STATE();
    case 810:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 66,
        '\'', 316,
        ',', 193,
        '\\', 805,
        'n', 809,
        '\t', 15,
        ' ', 15,
        '(', 199,
        '[', 199,
        '{', 199,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(815);
      END_STATE();
    case 811:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 66,
        '\'', 316,
        ',', 193,
        '\\', 805,
        'n', 818,
        's', 818,
        '\t', 15,
        ' ', 15,
        '(', 199,
        '[', 199,
        '{', 199,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(815);
      END_STATE();
    case 812:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 66,
        '\'', 316,
        ',', 193,
        '\\', 805,
        'o', 814,
        '\t', 15,
        ' ', 15,
        '(', 199,
        '[', 199,
        '{', 199,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(815);
      END_STATE();
    case 813:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 66,
        '\'', 316,
        ',', 193,
        '\\', 805,
        'r', 818,
        '\t', 15,
        ' ', 15,
        '(', 199,
        '[', 199,
        '{', 199,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(815);
      END_STATE();
    case 814:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 66,
        '\'', 316,
        ',', 193,
        '\\', 805,
        't', 818,
        '\t', 15,
        ' ', 15,
        '(', 199,
        '[', 199,
        '{', 199,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(815);
      END_STATE();
    case 815:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 66,
        '\'', 316,
        ',', 193,
        '\\', 805,
        '\t', 15,
        ' ', 15,
        '(', 199,
        '[', 199,
        '{', 199,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(815);
      END_STATE();
    case 816:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 66,
        '\'', 316,
        ',', 193,
        '\\', 805,
        '\t', 10,
        ' ', 10,
        '=', 818,
        '>', 818,
        '(', 199,
        '[', 199,
        '{', 199,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(815);
      END_STATE();
    case 817:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 66,
        '\'', 316,
        ',', 193,
        '\\', 805,
        '\t', 10,
        ' ', 10,
        '(', 199,
        '[', 199,
        '{', 199,
      );
      if (('<' <= lookahead && lookahead <= '>')) ADVANCE(818);
      if (lookahead == '#' ||
          lookahead == ')' ||
          lookahead == ':' ||
          lookahead == ']' ||
          lookahead == '}') ADVANCE(306);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(815);
      END_STATE();
    case 818:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 66,
        '\'', 316,
        ',', 193,
        '\\', 805,
        '\t', 10,
        ' ', 10,
        '(', 199,
        '[', 199,
        '{', 199,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(815);
      END_STATE();
    case 819:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 328,
        '\'', 246,
        '\\', 761,
        '\t', 4,
        ' ', 4,
        '(', 109,
        '[', 109,
        '{', 109,
        '#', 306,
        ')', 306,
        ',', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(772);
      END_STATE();
    case 820:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 332,
        '\'', 316,
        ',', 193,
        '\\', 805,
        '\t', 15,
        ' ', 15,
        '(', 199,
        '[', 199,
        '{', 199,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(815);
      END_STATE();
    case 821:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 686,
        '\'', 319,
        ',', 193,
        '\\', 864,
        '\t', 18,
        ' ', 18,
        '(', 205,
        '[', 205,
        '{', 205,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(863);
      END_STATE();
    case 822:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 59,
        '\'', 720,
        ',', 172,
        '\\', 836,
        '\t', 19,
        ' ', 19,
        '(', 189,
        '[', 189,
        '{', 189,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(835);
      END_STATE();
    case 823:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 59,
        '\'', 383,
        '*', 834,
        ',', 172,
        '\\', 836,
        '\t', 12,
        ' ', 12,
        '(', 189,
        '[', 189,
        '{', 189,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(835);
      END_STATE();
    case 824:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 59,
        '\'', 383,
        ',', 172,
        '/', 834,
        '\\', 836,
        '\t', 12,
        ' ', 12,
        '(', 189,
        '[', 189,
        '{', 189,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(835);
      END_STATE();
    case 825:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 59,
        '\'', 383,
        ',', 172,
        '=', 834,
        '\\', 836,
        '\t', 19,
        ' ', 19,
        '(', 189,
        '[', 189,
        '{', 189,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(835);
      END_STATE();
    case 826:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 59,
        '\'', 383,
        ',', 172,
        '\\', 836,
        'd', 834,
        '\t', 19,
        ' ', 19,
        '(', 189,
        '[', 189,
        '{', 189,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(835);
      END_STATE();
    case 827:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 59,
        '\'', 383,
        ',', 172,
        '\\', 836,
        'n', 826,
        '\t', 19,
        ' ', 19,
        '(', 189,
        '[', 189,
        '{', 189,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(835);
      END_STATE();
    case 828:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 59,
        '\'', 383,
        ',', 172,
        '\\', 836,
        'n', 834,
        's', 834,
        '\t', 19,
        ' ', 19,
        '(', 189,
        '[', 189,
        '{', 189,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(835);
      END_STATE();
    case 829:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 59,
        '\'', 383,
        ',', 172,
        '\\', 836,
        'o', 831,
        '\t', 19,
        ' ', 19,
        '(', 189,
        '[', 189,
        '{', 189,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(835);
      END_STATE();
    case 830:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 59,
        '\'', 383,
        ',', 172,
        '\\', 836,
        'r', 834,
        '\t', 19,
        ' ', 19,
        '(', 189,
        '[', 189,
        '{', 189,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(835);
      END_STATE();
    case 831:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 59,
        '\'', 383,
        ',', 172,
        '\\', 836,
        't', 834,
        '\t', 19,
        ' ', 19,
        '(', 189,
        '[', 189,
        '{', 189,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(835);
      END_STATE();
    case 832:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 59,
        '\'', 383,
        ',', 172,
        '\\', 836,
        '\t', 12,
        ' ', 12,
        '=', 834,
        '>', 834,
        '(', 189,
        '[', 189,
        '{', 189,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(835);
      END_STATE();
    case 833:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 59,
        '\'', 383,
        ',', 172,
        '\\', 836,
        '\t', 12,
        ' ', 12,
        '(', 189,
        '[', 189,
        '{', 189,
      );
      if (('<' <= lookahead && lookahead <= '>')) ADVANCE(834);
      if (lookahead == '#' ||
          lookahead == ')' ||
          lookahead == ':' ||
          lookahead == ']' ||
          lookahead == '}') ADVANCE(462);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(835);
      END_STATE();
    case 834:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 59,
        '\'', 383,
        ',', 172,
        '\\', 836,
        '\t', 12,
        ' ', 12,
        '(', 189,
        '[', 189,
        '{', 189,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(835);
      END_STATE();
    case 835:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 59,
        '\'', 383,
        ',', 172,
        '\\', 836,
        '\t', 19,
        ' ', 19,
        '(', 189,
        '[', 189,
        '{', 189,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(835);
      END_STATE();
    case 836:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 59,
        '\'', 414,
        ',', 172,
        '\t', 19,
        ' ', 19,
        '(', 189,
        '[', 189,
        '{', 189,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(835);
      END_STATE();
    case 837:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 59,
        '\'', 375,
        ',', 172,
        '\\', 836,
        '\t', 19,
        ' ', 19,
        '(', 189,
        '[', 189,
        '{', 189,
        '#', 462,
        ')', 462,
        ':', 462,
        ']', 462,
        '}', 462,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(835);
      END_STATE();
    case 838:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 38,
        '\'', 369,
        '*', 849,
        ',', 178,
        '\t', 8,
        ' ', 8,
        '(', 182,
        '[', 182,
        '{', 182,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 839:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 38,
        '\'', 369,
        ',', 178,
        '/', 849,
        '\t', 8,
        ' ', 8,
        '(', 182,
        '[', 182,
        '{', 182,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 840:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 38,
        '\'', 369,
        ',', 178,
        '=', 849,
        '\t', 17,
        ' ', 17,
        '(', 182,
        '[', 182,
        '{', 182,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 841:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 38,
        '\'', 369,
        ',', 178,
        'd', 849,
        '\t', 17,
        ' ', 17,
        '(', 182,
        '[', 182,
        '{', 182,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 842:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 38,
        '\'', 369,
        ',', 178,
        'n', 841,
        '\t', 17,
        ' ', 17,
        '(', 182,
        '[', 182,
        '{', 182,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 843:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 38,
        '\'', 369,
        ',', 178,
        'n', 849,
        's', 849,
        '\t', 17,
        ' ', 17,
        '(', 182,
        '[', 182,
        '{', 182,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 844:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 38,
        '\'', 369,
        ',', 178,
        'o', 846,
        '\t', 17,
        ' ', 17,
        '(', 182,
        '[', 182,
        '{', 182,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 845:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 38,
        '\'', 369,
        ',', 178,
        'r', 849,
        '\t', 17,
        ' ', 17,
        '(', 182,
        '[', 182,
        '{', 182,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 846:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 38,
        '\'', 369,
        ',', 178,
        't', 849,
        '\t', 17,
        ' ', 17,
        '(', 182,
        '[', 182,
        '{', 182,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 847:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 38,
        '\'', 369,
        ',', 178,
        '\t', 8,
        ' ', 8,
        '=', 849,
        '>', 849,
        '(', 182,
        '[', 182,
        '{', 182,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 848:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 38,
        '\'', 369,
        ',', 178,
        '\t', 8,
        ' ', 8,
        '(', 182,
        '[', 182,
        '{', 182,
      );
      if (('<' <= lookahead && lookahead <= '>')) ADVANCE(849);
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 849:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 38,
        '\'', 369,
        ',', 178,
        '\t', 8,
        ' ', 8,
        '(', 182,
        '[', 182,
        '{', 182,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 850:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 38,
        '\'', 369,
        ',', 178,
        '\t', 17,
        ' ', 17,
        '(', 182,
        '[', 182,
        '{', 182,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 851:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 67,
        '\'', 319,
        '*', 862,
        ',', 193,
        '\\', 864,
        '\t', 9,
        ' ', 9,
        '(', 205,
        '[', 205,
        '{', 205,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(863);
      END_STATE();
    case 852:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 67,
        '\'', 319,
        ',', 193,
        '/', 862,
        '\\', 864,
        '\t', 9,
        ' ', 9,
        '(', 205,
        '[', 205,
        '{', 205,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(863);
      END_STATE();
    case 853:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 67,
        '\'', 319,
        ',', 193,
        '=', 862,
        '\\', 864,
        '\t', 18,
        ' ', 18,
        '(', 205,
        '[', 205,
        '{', 205,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(863);
      END_STATE();
    case 854:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 67,
        '\'', 319,
        ',', 193,
        '\\', 864,
        'd', 862,
        '\t', 18,
        ' ', 18,
        '(', 205,
        '[', 205,
        '{', 205,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(863);
      END_STATE();
    case 855:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 67,
        '\'', 319,
        ',', 193,
        '\\', 864,
        'n', 854,
        '\t', 18,
        ' ', 18,
        '(', 205,
        '[', 205,
        '{', 205,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(863);
      END_STATE();
    case 856:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 67,
        '\'', 319,
        ',', 193,
        '\\', 864,
        'n', 862,
        's', 862,
        '\t', 18,
        ' ', 18,
        '(', 205,
        '[', 205,
        '{', 205,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(863);
      END_STATE();
    case 857:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 67,
        '\'', 319,
        ',', 193,
        '\\', 864,
        'o', 859,
        '\t', 18,
        ' ', 18,
        '(', 205,
        '[', 205,
        '{', 205,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(863);
      END_STATE();
    case 858:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 67,
        '\'', 319,
        ',', 193,
        '\\', 864,
        'r', 862,
        '\t', 18,
        ' ', 18,
        '(', 205,
        '[', 205,
        '{', 205,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(863);
      END_STATE();
    case 859:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 67,
        '\'', 319,
        ',', 193,
        '\\', 864,
        't', 862,
        '\t', 18,
        ' ', 18,
        '(', 205,
        '[', 205,
        '{', 205,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(863);
      END_STATE();
    case 860:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 67,
        '\'', 319,
        ',', 193,
        '\\', 864,
        '\t', 9,
        ' ', 9,
        '=', 862,
        '>', 862,
        '(', 205,
        '[', 205,
        '{', 205,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(863);
      END_STATE();
    case 861:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 67,
        '\'', 319,
        ',', 193,
        '\\', 864,
        '\t', 9,
        ' ', 9,
        '(', 205,
        '[', 205,
        '{', 205,
      );
      if (('<' <= lookahead && lookahead <= '>')) ADVANCE(862);
      if (lookahead == '#' ||
          lookahead == ')' ||
          lookahead == ':' ||
          lookahead == ']' ||
          lookahead == '}') ADVANCE(306);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(863);
      END_STATE();
    case 862:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 67,
        '\'', 319,
        ',', 193,
        '\\', 864,
        '\t', 9,
        ' ', 9,
        '(', 205,
        '[', 205,
        '{', 205,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(863);
      END_STATE();
    case 863:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 67,
        '\'', 319,
        ',', 193,
        '\\', 864,
        '\t', 18,
        ' ', 18,
        '(', 205,
        '[', 205,
        '{', 205,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(863);
      END_STATE();
    case 864:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 250,
        '\'', 319,
        ',', 193,
        '\t', 18,
        ' ', 18,
        '(', 205,
        '[', 205,
        '{', 205,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(863);
      END_STATE();
    case 865:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 56,
        '\'', 319,
        ',', 193,
        '\\', 864,
        '\t', 18,
        ' ', 18,
        '(', 205,
        '[', 205,
        '{', 205,
        '#', 306,
        ')', 306,
        ':', 306,
        ']', 306,
        '}', 306,
      );
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(863);
      END_STATE();
    case 866:
      ACCEPT_TOKEN(aux_sym_string_token1);
      END_STATE();
    case 867:
      ACCEPT_TOKEN(aux_sym_string_token1);
      if (lookahead == '"') ADVANCE(866);
      if (lookahead == '\\') ADVANCE(658);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(867);
      END_STATE();
    case 868:
      ACCEPT_TOKEN(aux_sym_string_token1);
      if (lookahead == '"') ADVANCE(866);
      if (lookahead == '\\') ADVANCE(639);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(868);
      END_STATE();
    case 869:
      ACCEPT_TOKEN(aux_sym_string_token2);
      END_STATE();
    case 870:
      ACCEPT_TOKEN(aux_sym_string_token2);
      if (lookahead == '\'') ADVANCE(869);
      if (lookahead == '\\') ADVANCE(659);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(870);
      END_STATE();
    case 871:
      ACCEPT_TOKEN(aux_sym_string_token2);
      if (lookahead == '\'') ADVANCE(869);
      if (lookahead == '\\') ADVANCE(640);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(871);
      END_STATE();
    default:
      return false;
  }
}

static bool ts_lex_keywords(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      ADVANCE_MAP(
        'a', 1,
        'b', 2,
        'c', 3,
        'd', 4,
        'e', 5,
        'f', 6,
        'g', 7,
        'h', 8,
        'i', 9,
        'j', 10,
        'l', 11,
        'm', 12,
        'n', 13,
        'p', 14,
        'q', 15,
        'r', 16,
        's', 17,
        't', 18,
        'v', 19,
        'w', 20,
      );
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(0);
      END_STATE();
    case 1:
      if (lookahead == 's') ADVANCE(21);
      if (lookahead == 't') ADVANCE(22);
      END_STATE();
    case 2:
      if (lookahead == 'l') ADVANCE(23);
      END_STATE();
    case 3:
      if (lookahead == 'a') ADVANCE(24);
      if (lookahead == 'h') ADVANCE(25);
      if (lookahead == 'l') ADVANCE(26);
      if (lookahead == 'o') ADVANCE(27);
      END_STATE();
    case 4:
      if (lookahead == 'e') ADVANCE(28);
      END_STATE();
    case 5:
      if (lookahead == 'a') ADVANCE(29);
      if (lookahead == 'l') ADVANCE(30);
      if (lookahead == 'x') ADVANCE(31);
      END_STATE();
    case 6:
      if (lookahead == 'o') ADVANCE(32);
      if (lookahead == 'r') ADVANCE(33);
      END_STATE();
    case 7:
      if (lookahead == 'l') ADVANCE(34);
      END_STATE();
    case 8:
      if (lookahead == 'i') ADVANCE(35);
      END_STATE();
    case 9:
      if (lookahead == 'f') ADVANCE(36);
      if (lookahead == 'm') ADVANCE(37);
      if (lookahead == 'n') ADVANCE(38);
      if (lookahead == 's') ADVANCE(39);
      END_STATE();
    case 10:
      if (lookahead == 'u') ADVANCE(40);
      END_STATE();
    case 11:
      if (lookahead == 'a') ADVANCE(41);
      END_STATE();
    case 12:
      if (lookahead == 'e') ADVANCE(42);
      END_STATE();
    case 13:
      if (lookahead == 'o') ADVANCE(43);
      if (lookahead == 'v') ADVANCE(44);
      END_STATE();
    case 14:
      if (lookahead == 'a') ADVANCE(45);
      if (lookahead == 'l') ADVANCE(46);
      if (lookahead == 'y') ADVANCE(47);
      END_STATE();
    case 15:
      if (lookahead == 'u') ADVANCE(48);
      END_STATE();
    case 16:
      if (lookahead == 'e') ADVANCE(49);
      END_STATE();
    case 17:
      if (lookahead == 'c') ADVANCE(50);
      if (lookahead == 'e') ADVANCE(51);
      if (lookahead == 'h') ADVANCE(52);
      if (lookahead == 't') ADVANCE(53);
      if (lookahead == 'u') ADVANCE(54);
      END_STATE();
    case 18:
      if (lookahead == 'a') ADVANCE(55);
      if (lookahead == 'i') ADVANCE(56);
      if (lookahead == 'r') ADVANCE(57);
      END_STATE();
    case 19:
      if (lookahead == 'o') ADVANCE(58);
      END_STATE();
    case 20:
      if (lookahead == 'h') ADVANCE(59);
      if (lookahead == 'i') ADVANCE(60);
      END_STATE();
    case 21:
      ACCEPT_TOKEN(anon_sym_as);
      END_STATE();
    case 22:
      ACCEPT_TOKEN(anon_sym_at);
      END_STATE();
    case 23:
      if (lookahead == 'o') ADVANCE(61);
      END_STATE();
    case 24:
      if (lookahead == 'l') ADVANCE(62);
      if (lookahead == 'm') ADVANCE(63);
      END_STATE();
    case 25:
      if (lookahead == 'o') ADVANCE(64);
      END_STATE();
    case 26:
      if (lookahead == 'e') ADVANCE(65);
      END_STATE();
    case 27:
      if (lookahead == 'n') ADVANCE(66);
      END_STATE();
    case 28:
      if (lookahead == 'f') ADVANCE(67);
      END_STATE();
    case 29:
      if (lookahead == 'r') ADVANCE(68);
      END_STATE();
    case 30:
      if (lookahead == 'i') ADVANCE(69);
      if (lookahead == 's') ADVANCE(70);
      END_STATE();
    case 31:
      if (lookahead == 'p') ADVANCE(71);
      END_STATE();
    case 32:
      if (lookahead == 'r') ADVANCE(72);
      END_STATE();
    case 33:
      if (lookahead == 'o') ADVANCE(73);
      END_STATE();
    case 34:
      if (lookahead == 'o') ADVANCE(74);
      END_STATE();
    case 35:
      if (lookahead == 'd') ADVANCE(75);
      END_STATE();
    case 36:
      ACCEPT_TOKEN(anon_sym_if);
      END_STATE();
    case 37:
      if (lookahead == 'a') ADVANCE(76);
      END_STATE();
    case 38:
      ACCEPT_TOKEN(anon_sym_in);
      if (lookahead == 'i') ADVANCE(77);
      END_STATE();
    case 39:
      ACCEPT_TOKEN(anon_sym_is);
      END_STATE();
    case 40:
      if (lookahead == 'm') ADVANCE(78);
      END_STATE();
    case 41:
      if (lookahead == 'b') ADVANCE(79);
      if (lookahead == 'y') ADVANCE(80);
      END_STATE();
    case 42:
      if (lookahead == 'n') ADVANCE(81);
      END_STATE();
    case 43:
      if (lookahead == 'p') ADVANCE(82);
      END_STATE();
    case 44:
      if (lookahead == 'l') ADVANCE(83);
      END_STATE();
    case 45:
      if (lookahead == 'r') ADVANCE(84);
      if (lookahead == 's') ADVANCE(85);
      if (lookahead == 'u') ADVANCE(86);
      END_STATE();
    case 46:
      if (lookahead == 'a') ADVANCE(87);
      END_STATE();
    case 47:
      if (lookahead == 't') ADVANCE(88);
      END_STATE();
    case 48:
      if (lookahead == 'e') ADVANCE(89);
      END_STATE();
    case 49:
      if (lookahead == 'p') ADVANCE(90);
      if (lookahead == 't') ADVANCE(91);
      END_STATE();
    case 50:
      if (lookahead == 'e') ADVANCE(92);
      if (lookahead == 'r') ADVANCE(93);
      END_STATE();
    case 51:
      if (lookahead == 't') ADVANCE(94);
      END_STATE();
    case 52:
      if (lookahead == 'o') ADVANCE(95);
      END_STATE();
    case 53:
      if (lookahead == 'o') ADVANCE(96);
      if (lookahead == 'r') ADVANCE(97);
      if (lookahead == 'y') ADVANCE(98);
      END_STATE();
    case 54:
      if (lookahead == 's') ADVANCE(99);
      END_STATE();
    case 55:
      if (lookahead == 'k') ADVANCE(100);
      END_STATE();
    case 56:
      if (lookahead == 'm') ADVANCE(101);
      END_STATE();
    case 57:
      if (lookahead == 'a') ADVANCE(102);
      END_STATE();
    case 58:
      if (lookahead == 'i') ADVANCE(103);
      END_STATE();
    case 59:
      if (lookahead == 'i') ADVANCE(104);
      END_STATE();
    case 60:
      if (lookahead == 't') ADVANCE(105);
      END_STATE();
    case 61:
      if (lookahead == 'c') ADVANCE(106);
      END_STATE();
    case 62:
      if (lookahead == 'l') ADVANCE(107);
      END_STATE();
    case 63:
      if (lookahead == 'e') ADVANCE(108);
      END_STATE();
    case 64:
      if (lookahead == 'i') ADVANCE(109);
      END_STATE();
    case 65:
      if (lookahead == 'a') ADVANCE(110);
      END_STATE();
    case 66:
      if (lookahead == 't') ADVANCE(111);
      END_STATE();
    case 67:
      if (lookahead == 'a') ADVANCE(112);
      if (lookahead == 'i') ADVANCE(113);
      END_STATE();
    case 68:
      if (lookahead == 'l') ADVANCE(114);
      END_STATE();
    case 69:
      if (lookahead == 'f') ADVANCE(115);
      END_STATE();
    case 70:
      if (lookahead == 'e') ADVANCE(116);
      END_STATE();
    case 71:
      if (lookahead == 'r') ADVANCE(117);
      END_STATE();
    case 72:
      ACCEPT_TOKEN(anon_sym_for);
      END_STATE();
    case 73:
      if (lookahead == 'm') ADVANCE(118);
      END_STATE();
    case 74:
      if (lookahead == 'b') ADVANCE(119);
      END_STATE();
    case 75:
      if (lookahead == 'e') ADVANCE(120);
      END_STATE();
    case 76:
      if (lookahead == 'g') ADVANCE(121);
      END_STATE();
    case 77:
      if (lookahead == 't') ADVANCE(122);
      END_STATE();
    case 78:
      if (lookahead == 'p') ADVANCE(123);
      END_STATE();
    case 79:
      if (lookahead == 'e') ADVANCE(124);
      END_STATE();
    case 80:
      if (lookahead == 'e') ADVANCE(125);
      END_STATE();
    case 81:
      if (lookahead == 'u') ADVANCE(126);
      END_STATE();
    case 82:
      if (lookahead == 'r') ADVANCE(127);
      END_STATE();
    case 83:
      ACCEPT_TOKEN(anon_sym_nvl);
      END_STATE();
    case 84:
      if (lookahead == 'a') ADVANCE(128);
      END_STATE();
    case 85:
      if (lookahead == 's') ADVANCE(129);
      END_STATE();
    case 86:
      if (lookahead == 's') ADVANCE(130);
      END_STATE();
    case 87:
      if (lookahead == 'y') ADVANCE(131);
      END_STATE();
    case 88:
      if (lookahead == 'h') ADVANCE(132);
      END_STATE();
    case 89:
      if (lookahead == 'u') ADVANCE(133);
      END_STATE();
    case 90:
      if (lookahead == 'e') ADVANCE(134);
      END_STATE();
    case 91:
      if (lookahead == 'u') ADVANCE(135);
      END_STATE();
    case 92:
      if (lookahead == 'n') ADVANCE(136);
      END_STATE();
    case 93:
      if (lookahead == 'e') ADVANCE(137);
      END_STATE();
    case 94:
      ACCEPT_TOKEN(anon_sym_set);
      END_STATE();
    case 95:
      if (lookahead == 'w') ADVANCE(138);
      END_STATE();
    case 96:
      if (lookahead == 'p') ADVANCE(139);
      END_STATE();
    case 97:
      if (lookahead == 'i') ADVANCE(140);
      END_STATE();
    case 98:
      if (lookahead == 'l') ADVANCE(141);
      END_STATE();
    case 99:
      if (lookahead == 't') ADVANCE(142);
      END_STATE();
    case 100:
      if (lookahead == 'e') ADVANCE(143);
      END_STATE();
    case 101:
      if (lookahead == 'e') ADVANCE(144);
      END_STATE();
    case 102:
      if (lookahead == 'n') ADVANCE(145);
      END_STATE();
    case 103:
      if (lookahead == 'c') ADVANCE(146);
      END_STATE();
    case 104:
      if (lookahead == 'l') ADVANCE(147);
      END_STATE();
    case 105:
      if (lookahead == 'h') ADVANCE(148);
      END_STATE();
    case 106:
      if (lookahead == 'k') ADVANCE(149);
      END_STATE();
    case 107:
      ACCEPT_TOKEN(anon_sym_call);
      END_STATE();
    case 108:
      if (lookahead == 'r') ADVANCE(150);
      END_STATE();
    case 109:
      if (lookahead == 'c') ADVANCE(151);
      END_STATE();
    case 110:
      if (lookahead == 'r') ADVANCE(152);
      END_STATE();
    case 111:
      if (lookahead == 'a') ADVANCE(153);
      END_STATE();
    case 112:
      if (lookahead == 'u') ADVANCE(154);
      END_STATE();
    case 113:
      if (lookahead == 'n') ADVANCE(155);
      END_STATE();
    case 114:
      if (lookahead == 'y') ADVANCE(156);
      END_STATE();
    case 115:
      ACCEPT_TOKEN(anon_sym_elif);
      END_STATE();
    case 116:
      ACCEPT_TOKEN(anon_sym_else);
      END_STATE();
    case 117:
      if (lookahead == 'e') ADVANCE(157);
      END_STATE();
    case 118:
      ACCEPT_TOKEN(anon_sym_from);
      END_STATE();
    case 119:
      if (lookahead == 'a') ADVANCE(158);
      END_STATE();
    case 120:
      ACCEPT_TOKEN(anon_sym_hide);
      END_STATE();
    case 121:
      if (lookahead == 'e') ADVANCE(159);
      END_STATE();
    case 122:
      ACCEPT_TOKEN(anon_sym_init);
      END_STATE();
    case 123:
      ACCEPT_TOKEN(anon_sym_jump);
      END_STATE();
    case 124:
      if (lookahead == 'l') ADVANCE(160);
      END_STATE();
    case 125:
      if (lookahead == 'r') ADVANCE(161);
      END_STATE();
    case 126:
      ACCEPT_TOKEN(anon_sym_menu);
      END_STATE();
    case 127:
      if (lookahead == 'e') ADVANCE(162);
      END_STATE();
    case 128:
      if (lookahead == 'l') ADVANCE(163);
      END_STATE();
    case 129:
      ACCEPT_TOKEN(anon_sym_pass);
      END_STATE();
    case 130:
      if (lookahead == 'e') ADVANCE(164);
      END_STATE();
    case 131:
      ACCEPT_TOKEN(anon_sym_play);
      END_STATE();
    case 132:
      if (lookahead == 'o') ADVANCE(165);
      END_STATE();
    case 133:
      if (lookahead == 'e') ADVANCE(166);
      END_STATE();
    case 134:
      if (lookahead == 'a') ADVANCE(167);
      END_STATE();
    case 135:
      if (lookahead == 'r') ADVANCE(168);
      END_STATE();
    case 136:
      if (lookahead == 'e') ADVANCE(169);
      END_STATE();
    case 137:
      if (lookahead == 'e') ADVANCE(170);
      END_STATE();
    case 138:
      ACCEPT_TOKEN(anon_sym_show);
      if (lookahead == 'i') ADVANCE(171);
      END_STATE();
    case 139:
      ACCEPT_TOKEN(anon_sym_stop);
      END_STATE();
    case 140:
      if (lookahead == 'n') ADVANCE(172);
      END_STATE();
    case 141:
      if (lookahead == 'e') ADVANCE(173);
      END_STATE();
    case 142:
      if (lookahead == 'a') ADVANCE(174);
      END_STATE();
    case 143:
      ACCEPT_TOKEN(anon_sym_take);
      END_STATE();
    case 144:
      ACCEPT_TOKEN(anon_sym_time);
      END_STATE();
    case 145:
      if (lookahead == 's') ADVANCE(175);
      END_STATE();
    case 146:
      if (lookahead == 'e') ADVANCE(176);
      END_STATE();
    case 147:
      if (lookahead == 'e') ADVANCE(177);
      END_STATE();
    case 148:
      ACCEPT_TOKEN(anon_sym_with);
      END_STATE();
    case 149:
      ACCEPT_TOKEN(anon_sym_block);
      END_STATE();
    case 150:
      if (lookahead == 'a') ADVANCE(178);
      END_STATE();
    case 151:
      if (lookahead == 'e') ADVANCE(179);
      END_STATE();
    case 152:
      ACCEPT_TOKEN(anon_sym_clear);
      END_STATE();
    case 153:
      if (lookahead == 'i') ADVANCE(180);
      END_STATE();
    case 154:
      if (lookahead == 'l') ADVANCE(181);
      END_STATE();
    case 155:
      if (lookahead == 'e') ADVANCE(182);
      END_STATE();
    case 156:
      ACCEPT_TOKEN(anon_sym_early);
      END_STATE();
    case 157:
      if (lookahead == 's') ADVANCE(183);
      END_STATE();
    case 158:
      if (lookahead == 'l') ADVANCE(184);
      END_STATE();
    case 159:
      ACCEPT_TOKEN(anon_sym_image);
      END_STATE();
    case 160:
      ACCEPT_TOKEN(anon_sym_label);
      END_STATE();
    case 161:
      if (lookahead == 'e') ADVANCE(185);
      END_STATE();
    case 162:
      if (lookahead == 'd') ADVANCE(186);
      END_STATE();
    case 163:
      if (lookahead == 'l') ADVANCE(187);
      END_STATE();
    case 164:
      ACCEPT_TOKEN(anon_sym_pause);
      END_STATE();
    case 165:
      if (lookahead == 'n') ADVANCE(188);
      END_STATE();
    case 166:
      ACCEPT_TOKEN(anon_sym_queue);
      END_STATE();
    case 167:
      if (lookahead == 't') ADVANCE(189);
      END_STATE();
    case 168:
      if (lookahead == 'n') ADVANCE(190);
      END_STATE();
    case 169:
      ACCEPT_TOKEN(anon_sym_scene);
      END_STATE();
    case 170:
      if (lookahead == 'n') ADVANCE(191);
      END_STATE();
    case 171:
      if (lookahead == 'f') ADVANCE(192);
      END_STATE();
    case 172:
      if (lookahead == 'g') ADVANCE(193);
      END_STATE();
    case 173:
      ACCEPT_TOKEN(anon_sym_style);
      END_STATE();
    case 174:
      if (lookahead == 'i') ADVANCE(194);
      END_STATE();
    case 175:
      if (lookahead == 'f') ADVANCE(195);
      if (lookahead == 'l') ADVANCE(196);
      END_STATE();
    case 176:
      ACCEPT_TOKEN(anon_sym_voice);
      END_STATE();
    case 177:
      ACCEPT_TOKEN(anon_sym_while);
      END_STATE();
    case 178:
      ACCEPT_TOKEN(anon_sym_camera);
      END_STATE();
    case 179:
      ACCEPT_TOKEN(anon_sym_choice);
      END_STATE();
    case 180:
      if (lookahead == 'n') ADVANCE(197);
      END_STATE();
    case 181:
      if (lookahead == 't') ADVANCE(198);
      END_STATE();
    case 182:
      ACCEPT_TOKEN(anon_sym_define);
      END_STATE();
    case 183:
      if (lookahead == 's') ADVANCE(199);
      END_STATE();
    case 184:
      ACCEPT_TOKEN(anon_sym_global);
      END_STATE();
    case 185:
      if (lookahead == 'd') ADVANCE(200);
      END_STATE();
    case 186:
      if (lookahead == 'i') ADVANCE(201);
      END_STATE();
    case 187:
      if (lookahead == 'e') ADVANCE(202);
      END_STATE();
    case 188:
      ACCEPT_TOKEN(anon_sym_python);
      END_STATE();
    case 189:
      ACCEPT_TOKEN(anon_sym_repeat);
      END_STATE();
    case 190:
      ACCEPT_TOKEN(anon_sym_return);
      END_STATE();
    case 191:
      ACCEPT_TOKEN(anon_sym_screen);
      END_STATE();
    case 192:
      ACCEPT_TOKEN(anon_sym_showif);
      END_STATE();
    case 193:
      if (lookahead == 's') ADVANCE(203);
      END_STATE();
    case 194:
      if (lookahead == 'n') ADVANCE(204);
      END_STATE();
    case 195:
      if (lookahead == 'o') ADVANCE(205);
      END_STATE();
    case 196:
      if (lookahead == 'a') ADVANCE(206);
      END_STATE();
    case 197:
      if (lookahead == 's') ADVANCE(207);
      END_STATE();
    case 198:
      ACCEPT_TOKEN(anon_sym_default);
      END_STATE();
    case 199:
      if (lookahead == 'i') ADVANCE(208);
      END_STATE();
    case 200:
      if (lookahead == 'i') ADVANCE(209);
      END_STATE();
    case 201:
      if (lookahead == 'c') ADVANCE(210);
      END_STATE();
    case 202:
      if (lookahead == 'l') ADVANCE(211);
      END_STATE();
    case 203:
      ACCEPT_TOKEN(anon_sym_strings);
      END_STATE();
    case 204:
      ACCEPT_TOKEN(anon_sym_sustain);
      END_STATE();
    case 205:
      if (lookahead == 'r') ADVANCE(212);
      END_STATE();
    case 206:
      if (lookahead == 't') ADVANCE(213);
      END_STATE();
    case 207:
      ACCEPT_TOKEN(anon_sym_contains);
      END_STATE();
    case 208:
      if (lookahead == 'o') ADVANCE(214);
      END_STATE();
    case 209:
      if (lookahead == 'm') ADVANCE(215);
      END_STATE();
    case 210:
      if (lookahead == 't') ADVANCE(216);
      END_STATE();
    case 211:
      ACCEPT_TOKEN(anon_sym_parallel);
      END_STATE();
    case 212:
      if (lookahead == 'm') ADVANCE(217);
      END_STATE();
    case 213:
      if (lookahead == 'e') ADVANCE(218);
      END_STATE();
    case 214:
      if (lookahead == 'n') ADVANCE(219);
      END_STATE();
    case 215:
      if (lookahead == 'a') ADVANCE(220);
      END_STATE();
    case 216:
      ACCEPT_TOKEN(anon_sym_nopredict);
      END_STATE();
    case 217:
      ACCEPT_TOKEN(anon_sym_transform);
      END_STATE();
    case 218:
      ACCEPT_TOKEN(anon_sym_translate);
      END_STATE();
    case 219:
      ACCEPT_TOKEN(anon_sym_expression);
      END_STATE();
    case 220:
      if (lookahead == 'g') ADVANCE(221);
      END_STATE();
    case 221:
      if (lookahead == 'e') ADVANCE(222);
      END_STATE();
    case 222:
      ACCEPT_TOKEN(anon_sym_layeredimage);
      END_STATE();
    default:
      return false;
  }
}

static const TSLexMode ts_lex_modes[STATE_COUNT] = {
  [0] = {.lex_state = 0, .external_lex_state = 1},
  [1] = {.lex_state = 643, .external_lex_state = 2},
  [2] = {.lex_state = 643},
  [3] = {.lex_state = 643},
  [4] = {.lex_state = 643},
  [5] = {.lex_state = 643, .external_lex_state = 3},
  [6] = {.lex_state = 643, .external_lex_state = 3},
  [7] = {.lex_state = 643, .external_lex_state = 3},
  [8] = {.lex_state = 643},
  [9] = {.lex_state = 643, .external_lex_state = 3},
  [10] = {.lex_state = 643, .external_lex_state = 3},
  [11] = {.lex_state = 643, .external_lex_state = 3},
  [12] = {.lex_state = 643},
  [13] = {.lex_state = 643},
  [14] = {.lex_state = 643},
  [15] = {.lex_state = 643},
  [16] = {.lex_state = 643},
  [17] = {.lex_state = 643},
  [18] = {.lex_state = 643},
  [19] = {.lex_state = 643, .external_lex_state = 3},
  [20] = {.lex_state = 643, .external_lex_state = 3},
  [21] = {.lex_state = 643},
  [22] = {.lex_state = 643, .external_lex_state = 3},
  [23] = {.lex_state = 643, .external_lex_state = 4},
  [24] = {.lex_state = 643, .external_lex_state = 2},
  [25] = {.lex_state = 643, .external_lex_state = 2},
  [26] = {.lex_state = 643, .external_lex_state = 2},
  [27] = {.lex_state = 643, .external_lex_state = 5},
  [28] = {.lex_state = 643, .external_lex_state = 6},
  [29] = {.lex_state = 643, .external_lex_state = 6},
  [30] = {.lex_state = 643, .external_lex_state = 6},
  [31] = {.lex_state = 643},
  [32] = {.lex_state = 643, .external_lex_state = 2},
  [33] = {.lex_state = 643, .external_lex_state = 3},
  [34] = {.lex_state = 643},
  [35] = {.lex_state = 643, .external_lex_state = 3},
  [36] = {.lex_state = 643, .external_lex_state = 6},
  [37] = {.lex_state = 643, .external_lex_state = 2},
  [38] = {.lex_state = 643, .external_lex_state = 2},
  [39] = {.lex_state = 643, .external_lex_state = 2},
  [40] = {.lex_state = 643, .external_lex_state = 7},
  [41] = {.lex_state = 643, .external_lex_state = 5},
  [42] = {.lex_state = 643, .external_lex_state = 2},
  [43] = {.lex_state = 643, .external_lex_state = 7},
  [44] = {.lex_state = 643, .external_lex_state = 2},
  [45] = {.lex_state = 643, .external_lex_state = 2},
  [46] = {.lex_state = 643, .external_lex_state = 7},
  [47] = {.lex_state = 643, .external_lex_state = 7},
  [48] = {.lex_state = 643, .external_lex_state = 7},
  [49] = {.lex_state = 643, .external_lex_state = 2},
  [50] = {.lex_state = 643, .external_lex_state = 2},
  [51] = {.lex_state = 643, .external_lex_state = 7},
  [52] = {.lex_state = 643, .external_lex_state = 7},
  [53] = {.lex_state = 643, .external_lex_state = 2},
  [54] = {.lex_state = 643, .external_lex_state = 2},
  [55] = {.lex_state = 643, .external_lex_state = 7},
  [56] = {.lex_state = 643, .external_lex_state = 7},
  [57] = {.lex_state = 643, .external_lex_state = 7},
  [58] = {.lex_state = 643, .external_lex_state = 7},
  [59] = {.lex_state = 643, .external_lex_state = 2},
  [60] = {.lex_state = 643, .external_lex_state = 7},
  [61] = {.lex_state = 643, .external_lex_state = 6},
  [62] = {.lex_state = 643, .external_lex_state = 7},
  [63] = {.lex_state = 643, .external_lex_state = 2},
  [64] = {.lex_state = 643, .external_lex_state = 6},
  [65] = {.lex_state = 643, .external_lex_state = 6},
  [66] = {.lex_state = 643, .external_lex_state = 5},
  [67] = {.lex_state = 643, .external_lex_state = 2},
  [68] = {.lex_state = 643, .external_lex_state = 2},
  [69] = {.lex_state = 643, .external_lex_state = 6},
  [70] = {.lex_state = 643, .external_lex_state = 2},
  [71] = {.lex_state = 643, .external_lex_state = 6},
  [72] = {.lex_state = 643, .external_lex_state = 8},
  [73] = {.lex_state = 643, .external_lex_state = 6},
  [74] = {.lex_state = 643, .external_lex_state = 6},
  [75] = {.lex_state = 643, .external_lex_state = 6},
  [76] = {.lex_state = 643, .external_lex_state = 6},
  [77] = {.lex_state = 643, .external_lex_state = 5},
  [78] = {.lex_state = 643, .external_lex_state = 8},
  [79] = {.lex_state = 643, .external_lex_state = 6},
  [80] = {.lex_state = 643, .external_lex_state = 6},
  [81] = {.lex_state = 643, .external_lex_state = 6},
  [82] = {.lex_state = 643, .external_lex_state = 8},
  [83] = {.lex_state = 643, .external_lex_state = 2},
  [84] = {.lex_state = 643, .external_lex_state = 4},
  [85] = {.lex_state = 643, .external_lex_state = 6},
  [86] = {.lex_state = 643, .external_lex_state = 6},
  [87] = {.lex_state = 643, .external_lex_state = 2},
  [88] = {.lex_state = 643, .external_lex_state = 2},
  [89] = {.lex_state = 643, .external_lex_state = 8},
  [90] = {.lex_state = 643, .external_lex_state = 8},
  [91] = {.lex_state = 643, .external_lex_state = 8},
  [92] = {.lex_state = 643, .external_lex_state = 6},
  [93] = {.lex_state = 643, .external_lex_state = 6},
  [94] = {.lex_state = 643, .external_lex_state = 6},
  [95] = {.lex_state = 643, .external_lex_state = 8},
  [96] = {.lex_state = 643, .external_lex_state = 4},
  [97] = {.lex_state = 643, .external_lex_state = 2},
  [98] = {.lex_state = 643, .external_lex_state = 2},
  [99] = {.lex_state = 643, .external_lex_state = 8},
  [100] = {.lex_state = 643, .external_lex_state = 6},
  [101] = {.lex_state = 643, .external_lex_state = 6},
  [102] = {.lex_state = 643, .external_lex_state = 8},
  [103] = {.lex_state = 643, .external_lex_state = 8},
  [104] = {.lex_state = 643, .external_lex_state = 8},
  [105] = {.lex_state = 643, .external_lex_state = 6},
  [106] = {.lex_state = 643, .external_lex_state = 6},
  [107] = {.lex_state = 643, .external_lex_state = 8},
  [108] = {.lex_state = 643, .external_lex_state = 8},
  [109] = {.lex_state = 643, .external_lex_state = 6},
  [110] = {.lex_state = 643, .external_lex_state = 6},
  [111] = {.lex_state = 643, .external_lex_state = 8},
  [112] = {.lex_state = 643, .external_lex_state = 8},
  [113] = {.lex_state = 643, .external_lex_state = 2},
  [114] = {.lex_state = 643, .external_lex_state = 8},
  [115] = {.lex_state = 643, .external_lex_state = 8},
  [116] = {.lex_state = 643, .external_lex_state = 6},
  [117] = {.lex_state = 643, .external_lex_state = 8},
  [118] = {.lex_state = 643, .external_lex_state = 6},
  [119] = {.lex_state = 643, .external_lex_state = 6},
  [120] = {.lex_state = 643, .external_lex_state = 6},
  [121] = {.lex_state = 643, .external_lex_state = 6},
  [122] = {.lex_state = 643, .external_lex_state = 4},
  [123] = {.lex_state = 643, .external_lex_state = 2},
  [124] = {.lex_state = 643, .external_lex_state = 7},
  [125] = {.lex_state = 643, .external_lex_state = 7},
  [126] = {.lex_state = 643, .external_lex_state = 2},
  [127] = {.lex_state = 643, .external_lex_state = 7},
  [128] = {.lex_state = 643, .external_lex_state = 7},
  [129] = {.lex_state = 643, .external_lex_state = 2},
  [130] = {.lex_state = 643, .external_lex_state = 2},
  [131] = {.lex_state = 643, .external_lex_state = 2},
  [132] = {.lex_state = 643, .external_lex_state = 2},
  [133] = {.lex_state = 643, .external_lex_state = 2},
  [134] = {.lex_state = 643, .external_lex_state = 2},
  [135] = {.lex_state = 643, .external_lex_state = 7},
  [136] = {.lex_state = 643, .external_lex_state = 6},
  [137] = {.lex_state = 643, .external_lex_state = 3},
  [138] = {.lex_state = 643},
  [139] = {.lex_state = 643},
  [140] = {.lex_state = 643},
  [141] = {.lex_state = 643},
  [142] = {.lex_state = 643},
  [143] = {.lex_state = 643},
  [144] = {.lex_state = 643},
  [145] = {.lex_state = 643},
  [146] = {.lex_state = 643},
  [147] = {.lex_state = 643},
  [148] = {.lex_state = 643},
  [149] = {.lex_state = 643},
  [150] = {.lex_state = 643},
  [151] = {.lex_state = 643},
  [152] = {.lex_state = 643},
  [153] = {.lex_state = 643},
  [154] = {.lex_state = 643},
  [155] = {.lex_state = 643},
  [156] = {.lex_state = 643},
  [157] = {.lex_state = 643},
  [158] = {.lex_state = 643},
  [159] = {.lex_state = 643},
  [160] = {.lex_state = 643},
  [161] = {.lex_state = 643},
  [162] = {.lex_state = 643},
  [163] = {.lex_state = 643},
  [164] = {.lex_state = 643},
  [165] = {.lex_state = 643},
  [166] = {.lex_state = 643},
  [167] = {.lex_state = 643},
  [168] = {.lex_state = 643},
  [169] = {.lex_state = 643},
  [170] = {.lex_state = 643},
  [171] = {.lex_state = 643},
  [172] = {.lex_state = 643},
  [173] = {.lex_state = 643},
  [174] = {.lex_state = 643},
  [175] = {.lex_state = 643},
  [176] = {.lex_state = 643},
  [177] = {.lex_state = 643},
  [178] = {.lex_state = 643},
  [179] = {.lex_state = 643},
  [180] = {.lex_state = 643},
  [181] = {.lex_state = 643},
  [182] = {.lex_state = 643},
  [183] = {.lex_state = 643},
  [184] = {.lex_state = 643},
  [185] = {.lex_state = 643},
  [186] = {.lex_state = 643},
  [187] = {.lex_state = 643},
  [188] = {.lex_state = 643},
  [189] = {.lex_state = 643},
  [190] = {.lex_state = 643},
  [191] = {.lex_state = 643},
  [192] = {.lex_state = 643},
  [193] = {.lex_state = 643},
  [194] = {.lex_state = 643},
  [195] = {.lex_state = 643},
  [196] = {.lex_state = 643},
  [197] = {.lex_state = 643},
  [198] = {.lex_state = 643},
  [199] = {.lex_state = 643},
  [200] = {.lex_state = 643},
  [201] = {.lex_state = 643},
  [202] = {.lex_state = 643, .external_lex_state = 3},
  [203] = {.lex_state = 643, .external_lex_state = 3},
  [204] = {.lex_state = 643},
  [205] = {.lex_state = 643},
  [206] = {.lex_state = 643, .external_lex_state = 3},
  [207] = {.lex_state = 643},
  [208] = {.lex_state = 643, .external_lex_state = 3},
  [209] = {.lex_state = 643, .external_lex_state = 3},
  [210] = {.lex_state = 643},
  [211] = {.lex_state = 643, .external_lex_state = 3},
  [212] = {.lex_state = 643, .external_lex_state = 3},
  [213] = {.lex_state = 643, .external_lex_state = 3},
  [214] = {.lex_state = 643, .external_lex_state = 3},
  [215] = {.lex_state = 643},
  [216] = {.lex_state = 643, .external_lex_state = 3},
  [217] = {.lex_state = 643, .external_lex_state = 3},
  [218] = {.lex_state = 643},
  [219] = {.lex_state = 643},
  [220] = {.lex_state = 643, .external_lex_state = 3},
  [221] = {.lex_state = 643},
  [222] = {.lex_state = 643, .external_lex_state = 3},
  [223] = {.lex_state = 643, .external_lex_state = 3},
  [224] = {.lex_state = 643, .external_lex_state = 3},
  [225] = {.lex_state = 643, .external_lex_state = 3},
  [226] = {.lex_state = 643, .external_lex_state = 3},
  [227] = {.lex_state = 643},
  [228] = {.lex_state = 643, .external_lex_state = 3},
  [229] = {.lex_state = 643, .external_lex_state = 3},
  [230] = {.lex_state = 643},
  [231] = {.lex_state = 643},
  [232] = {.lex_state = 643, .external_lex_state = 3},
  [233] = {.lex_state = 643, .external_lex_state = 3},
  [234] = {.lex_state = 643, .external_lex_state = 3},
  [235] = {.lex_state = 643, .external_lex_state = 3},
  [236] = {.lex_state = 643, .external_lex_state = 3},
  [237] = {.lex_state = 643, .external_lex_state = 3},
  [238] = {.lex_state = 643},
  [239] = {.lex_state = 643, .external_lex_state = 3},
  [240] = {.lex_state = 643, .external_lex_state = 3},
  [241] = {.lex_state = 643, .external_lex_state = 3},
  [242] = {.lex_state = 643, .external_lex_state = 3},
  [243] = {.lex_state = 643, .external_lex_state = 3},
  [244] = {.lex_state = 643, .external_lex_state = 3},
  [245] = {.lex_state = 643},
  [246] = {.lex_state = 643},
  [247] = {.lex_state = 643, .external_lex_state = 3},
  [248] = {.lex_state = 643, .external_lex_state = 3},
  [249] = {.lex_state = 643, .external_lex_state = 3},
  [250] = {.lex_state = 643, .external_lex_state = 3},
  [251] = {.lex_state = 643, .external_lex_state = 3},
  [252] = {.lex_state = 643, .external_lex_state = 3},
  [253] = {.lex_state = 643, .external_lex_state = 3},
  [254] = {.lex_state = 643, .external_lex_state = 3},
  [255] = {.lex_state = 643, .external_lex_state = 3},
  [256] = {.lex_state = 643},
  [257] = {.lex_state = 643},
  [258] = {.lex_state = 643},
  [259] = {.lex_state = 643},
  [260] = {.lex_state = 643},
  [261] = {.lex_state = 643},
  [262] = {.lex_state = 643},
  [263] = {.lex_state = 643, .external_lex_state = 3},
  [264] = {.lex_state = 643, .external_lex_state = 3},
  [265] = {.lex_state = 643, .external_lex_state = 3},
  [266] = {.lex_state = 643, .external_lex_state = 3},
  [267] = {.lex_state = 643, .external_lex_state = 3},
  [268] = {.lex_state = 643},
  [269] = {.lex_state = 643},
  [270] = {.lex_state = 643, .external_lex_state = 3},
  [271] = {.lex_state = 643, .external_lex_state = 3},
  [272] = {.lex_state = 643, .external_lex_state = 3},
  [273] = {.lex_state = 643, .external_lex_state = 3},
  [274] = {.lex_state = 643, .external_lex_state = 3},
  [275] = {.lex_state = 643, .external_lex_state = 3},
  [276] = {.lex_state = 643, .external_lex_state = 3},
  [277] = {.lex_state = 643, .external_lex_state = 3},
  [278] = {.lex_state = 643},
  [279] = {.lex_state = 643, .external_lex_state = 3},
  [280] = {.lex_state = 643, .external_lex_state = 3},
  [281] = {.lex_state = 643, .external_lex_state = 3},
  [282] = {.lex_state = 643, .external_lex_state = 3},
  [283] = {.lex_state = 643, .external_lex_state = 3},
  [284] = {.lex_state = 643, .external_lex_state = 3},
  [285] = {.lex_state = 643, .external_lex_state = 3},
  [286] = {.lex_state = 643},
  [287] = {.lex_state = 643, .external_lex_state = 3},
  [288] = {.lex_state = 643},
  [289] = {.lex_state = 643},
  [290] = {.lex_state = 643},
  [291] = {.lex_state = 643, .external_lex_state = 3},
  [292] = {.lex_state = 643},
  [293] = {.lex_state = 643},
  [294] = {.lex_state = 643},
  [295] = {.lex_state = 643, .external_lex_state = 3},
  [296] = {.lex_state = 643, .external_lex_state = 3},
  [297] = {.lex_state = 643, .external_lex_state = 3},
  [298] = {.lex_state = 643, .external_lex_state = 3},
  [299] = {.lex_state = 643, .external_lex_state = 3},
  [300] = {.lex_state = 643, .external_lex_state = 3},
  [301] = {.lex_state = 643, .external_lex_state = 3},
  [302] = {.lex_state = 643, .external_lex_state = 3},
  [303] = {.lex_state = 643, .external_lex_state = 3},
  [304] = {.lex_state = 643, .external_lex_state = 3},
  [305] = {.lex_state = 643, .external_lex_state = 3},
  [306] = {.lex_state = 643, .external_lex_state = 3},
  [307] = {.lex_state = 643, .external_lex_state = 3},
  [308] = {.lex_state = 643, .external_lex_state = 3},
  [309] = {.lex_state = 643, .external_lex_state = 3},
  [310] = {.lex_state = 643},
  [311] = {.lex_state = 643, .external_lex_state = 3},
  [312] = {.lex_state = 643, .external_lex_state = 3},
  [313] = {.lex_state = 643, .external_lex_state = 3},
  [314] = {.lex_state = 643},
  [315] = {.lex_state = 643, .external_lex_state = 3},
  [316] = {.lex_state = 643, .external_lex_state = 3},
  [317] = {.lex_state = 643, .external_lex_state = 3},
  [318] = {.lex_state = 643, .external_lex_state = 3},
  [319] = {.lex_state = 643, .external_lex_state = 3},
  [320] = {.lex_state = 643, .external_lex_state = 3},
  [321] = {.lex_state = 643},
  [322] = {.lex_state = 643},
  [323] = {.lex_state = 643, .external_lex_state = 3},
  [324] = {.lex_state = 643},
  [325] = {.lex_state = 643},
  [326] = {.lex_state = 643},
  [327] = {.lex_state = 643},
  [328] = {.lex_state = 643, .external_lex_state = 3},
  [329] = {.lex_state = 643},
  [330] = {.lex_state = 643},
  [331] = {.lex_state = 643},
  [332] = {.lex_state = 643, .external_lex_state = 3},
  [333] = {.lex_state = 643, .external_lex_state = 3},
  [334] = {.lex_state = 643, .external_lex_state = 3},
  [335] = {.lex_state = 643, .external_lex_state = 3},
  [336] = {.lex_state = 643, .external_lex_state = 3},
  [337] = {.lex_state = 643, .external_lex_state = 3},
  [338] = {.lex_state = 643, .external_lex_state = 3},
  [339] = {.lex_state = 643, .external_lex_state = 3},
  [340] = {.lex_state = 643, .external_lex_state = 3},
  [341] = {.lex_state = 643},
  [342] = {.lex_state = 643, .external_lex_state = 3},
  [343] = {.lex_state = 643},
  [344] = {.lex_state = 643, .external_lex_state = 3},
  [345] = {.lex_state = 643},
  [346] = {.lex_state = 643},
  [347] = {.lex_state = 643},
  [348] = {.lex_state = 643, .external_lex_state = 3},
  [349] = {.lex_state = 643, .external_lex_state = 3},
  [350] = {.lex_state = 643, .external_lex_state = 3},
  [351] = {.lex_state = 643, .external_lex_state = 3},
  [352] = {.lex_state = 643, .external_lex_state = 3},
  [353] = {.lex_state = 643, .external_lex_state = 3},
  [354] = {.lex_state = 643, .external_lex_state = 3},
  [355] = {.lex_state = 643, .external_lex_state = 3},
  [356] = {.lex_state = 643, .external_lex_state = 3},
  [357] = {.lex_state = 643, .external_lex_state = 3},
  [358] = {.lex_state = 643},
  [359] = {.lex_state = 643, .external_lex_state = 3},
  [360] = {.lex_state = 643, .external_lex_state = 3},
  [361] = {.lex_state = 643, .external_lex_state = 3},
  [362] = {.lex_state = 643, .external_lex_state = 3},
  [363] = {.lex_state = 643, .external_lex_state = 3},
  [364] = {.lex_state = 643, .external_lex_state = 3},
  [365] = {.lex_state = 643},
  [366] = {.lex_state = 643, .external_lex_state = 3},
  [367] = {.lex_state = 643},
  [368] = {.lex_state = 643, .external_lex_state = 3},
  [369] = {.lex_state = 643},
  [370] = {.lex_state = 643, .external_lex_state = 3},
  [371] = {.lex_state = 643, .external_lex_state = 3},
  [372] = {.lex_state = 643, .external_lex_state = 3},
  [373] = {.lex_state = 643, .external_lex_state = 3},
  [374] = {.lex_state = 643, .external_lex_state = 3},
  [375] = {.lex_state = 643},
  [376] = {.lex_state = 643, .external_lex_state = 3},
  [377] = {.lex_state = 643, .external_lex_state = 3},
  [378] = {.lex_state = 643, .external_lex_state = 3},
  [379] = {.lex_state = 643, .external_lex_state = 3},
  [380] = {.lex_state = 643, .external_lex_state = 3},
  [381] = {.lex_state = 643, .external_lex_state = 3},
  [382] = {.lex_state = 643, .external_lex_state = 3},
  [383] = {.lex_state = 643, .external_lex_state = 3},
  [384] = {.lex_state = 643, .external_lex_state = 3},
  [385] = {.lex_state = 643},
  [386] = {.lex_state = 643},
  [387] = {.lex_state = 643},
  [388] = {.lex_state = 643},
  [389] = {.lex_state = 643},
  [390] = {.lex_state = 643, .external_lex_state = 3},
  [391] = {.lex_state = 643},
  [392] = {.lex_state = 643},
  [393] = {.lex_state = 643},
  [394] = {.lex_state = 643},
  [395] = {.lex_state = 643},
  [396] = {.lex_state = 643},
  [397] = {.lex_state = 643},
  [398] = {.lex_state = 643},
  [399] = {.lex_state = 643},
  [400] = {.lex_state = 643},
  [401] = {.lex_state = 643},
  [402] = {.lex_state = 643},
  [403] = {.lex_state = 0, .external_lex_state = 3},
  [404] = {.lex_state = 0, .external_lex_state = 3},
  [405] = {.lex_state = 0, .external_lex_state = 3},
  [406] = {.lex_state = 0, .external_lex_state = 3},
  [407] = {.lex_state = 0},
  [408] = {.lex_state = 0},
  [409] = {.lex_state = 0},
  [410] = {.lex_state = 0, .external_lex_state = 3},
  [411] = {.lex_state = 0, .external_lex_state = 3},
  [412] = {.lex_state = 0, .external_lex_state = 3},
  [413] = {.lex_state = 0, .external_lex_state = 3},
  [414] = {.lex_state = 0, .external_lex_state = 3},
  [415] = {.lex_state = 0, .external_lex_state = 3},
  [416] = {.lex_state = 0, .external_lex_state = 3},
  [417] = {.lex_state = 0, .external_lex_state = 3},
  [418] = {.lex_state = 0, .external_lex_state = 3},
  [419] = {.lex_state = 0, .external_lex_state = 3},
  [420] = {.lex_state = 0, .external_lex_state = 3},
  [421] = {.lex_state = 25, .external_lex_state = 2},
  [422] = {.lex_state = 0},
  [423] = {.lex_state = 25, .external_lex_state = 2},
  [424] = {.lex_state = 0, .external_lex_state = 3},
  [425] = {.lex_state = 0, .external_lex_state = 3},
  [426] = {.lex_state = 0, .external_lex_state = 3},
  [427] = {.lex_state = 0, .external_lex_state = 3},
  [428] = {.lex_state = 0, .external_lex_state = 3},
  [429] = {.lex_state = 0},
  [430] = {.lex_state = 0, .external_lex_state = 3},
  [431] = {.lex_state = 0},
  [432] = {.lex_state = 0},
  [433] = {.lex_state = 20, .external_lex_state = 2},
  [434] = {.lex_state = 0},
  [435] = {.lex_state = 20, .external_lex_state = 2},
  [436] = {.lex_state = 20, .external_lex_state = 2},
  [437] = {.lex_state = 0},
  [438] = {.lex_state = 0},
  [439] = {.lex_state = 0},
  [440] = {.lex_state = 20, .external_lex_state = 2},
  [441] = {.lex_state = 0},
  [442] = {.lex_state = 0, .external_lex_state = 2},
  [443] = {.lex_state = 0, .external_lex_state = 2},
  [444] = {.lex_state = 0, .external_lex_state = 3},
  [445] = {.lex_state = 0, .external_lex_state = 3},
  [446] = {.lex_state = 0, .external_lex_state = 3},
  [447] = {.lex_state = 0, .external_lex_state = 3},
  [448] = {.lex_state = 0, .external_lex_state = 3},
  [449] = {.lex_state = 0, .external_lex_state = 3},
  [450] = {.lex_state = 0, .external_lex_state = 2},
  [451] = {.lex_state = 0, .external_lex_state = 2},
  [452] = {.lex_state = 0, .external_lex_state = 2},
  [453] = {.lex_state = 0, .external_lex_state = 2},
  [454] = {.lex_state = 166, .external_lex_state = 2},
  [455] = {.lex_state = 43},
  [456] = {.lex_state = 20, .external_lex_state = 2},
  [457] = {.lex_state = 43},
  [458] = {.lex_state = 0, .external_lex_state = 2},
  [459] = {.lex_state = 0, .external_lex_state = 6},
  [460] = {.lex_state = 0, .external_lex_state = 6},
  [461] = {.lex_state = 0, .external_lex_state = 6},
  [462] = {.lex_state = 0, .external_lex_state = 4},
  [463] = {.lex_state = 0, .external_lex_state = 2},
  [464] = {.lex_state = 25, .external_lex_state = 2},
  [465] = {.lex_state = 0, .external_lex_state = 2},
  [466] = {.lex_state = 42},
  [467] = {.lex_state = 42},
  [468] = {.lex_state = 0, .external_lex_state = 3},
  [469] = {.lex_state = 0, .external_lex_state = 3},
  [470] = {.lex_state = 0, .external_lex_state = 3},
  [471] = {.lex_state = 0, .external_lex_state = 3},
  [472] = {.lex_state = 0, .external_lex_state = 3},
  [473] = {.lex_state = 44},
  [474] = {.lex_state = 0, .external_lex_state = 3},
  [475] = {.lex_state = 0, .external_lex_state = 3},
  [476] = {.lex_state = 44},
  [477] = {.lex_state = 0, .external_lex_state = 3},
  [478] = {.lex_state = 0, .external_lex_state = 3},
  [479] = {.lex_state = 0, .external_lex_state = 3},
  [480] = {.lex_state = 0, .external_lex_state = 3},
  [481] = {.lex_state = 0, .external_lex_state = 2},
  [482] = {.lex_state = 0, .external_lex_state = 3},
  [483] = {.lex_state = 42},
  [484] = {.lex_state = 0, .external_lex_state = 2},
  [485] = {.lex_state = 22},
  [486] = {.lex_state = 0, .external_lex_state = 2},
  [487] = {.lex_state = 0, .external_lex_state = 3},
  [488] = {.lex_state = 0, .external_lex_state = 3},
  [489] = {.lex_state = 0, .external_lex_state = 3},
  [490] = {.lex_state = 42},
  [491] = {.lex_state = 0, .external_lex_state = 3},
  [492] = {.lex_state = 0, .external_lex_state = 3},
  [493] = {.lex_state = 22},
  [494] = {.lex_state = 0, .external_lex_state = 3},
  [495] = {.lex_state = 44},
  [496] = {.lex_state = 44},
  [497] = {.lex_state = 42},
  [498] = {.lex_state = 0, .external_lex_state = 2},
  [499] = {.lex_state = 0, .external_lex_state = 2},
  [500] = {.lex_state = 0},
  [501] = {.lex_state = 25, .external_lex_state = 2},
  [502] = {.lex_state = 0},
  [503] = {.lex_state = 0, .external_lex_state = 2},
  [504] = {.lex_state = 0},
  [505] = {.lex_state = 43},
  [506] = {.lex_state = 0},
  [507] = {.lex_state = 0, .external_lex_state = 2},
  [508] = {.lex_state = 25, .external_lex_state = 2},
  [509] = {.lex_state = 0},
  [510] = {.lex_state = 0},
  [511] = {.lex_state = 0},
  [512] = {.lex_state = 0},
  [513] = {.lex_state = 42, .external_lex_state = 2},
  [514] = {.lex_state = 0},
  [515] = {.lex_state = 0},
  [516] = {.lex_state = 43},
  [517] = {.lex_state = 42, .external_lex_state = 2},
  [518] = {.lex_state = 0, .external_lex_state = 2},
  [519] = {.lex_state = 0},
  [520] = {.lex_state = 0, .external_lex_state = 2},
  [521] = {.lex_state = 0},
  [522] = {.lex_state = 0, .external_lex_state = 2},
  [523] = {.lex_state = 0},
  [524] = {.lex_state = 0, .external_lex_state = 2},
  [525] = {.lex_state = 0},
  [526] = {.lex_state = 0},
  [527] = {.lex_state = 0, .external_lex_state = 2},
  [528] = {.lex_state = 0},
  [529] = {.lex_state = 0},
  [530] = {.lex_state = 0},
  [531] = {.lex_state = 22},
  [532] = {.lex_state = 22},
  [533] = {.lex_state = 25, .external_lex_state = 2},
  [534] = {.lex_state = 42, .external_lex_state = 2},
  [535] = {.lex_state = 0, .external_lex_state = 2},
  [536] = {.lex_state = 166},
  [537] = {.lex_state = 0},
  [538] = {.lex_state = 0},
  [539] = {.lex_state = 0, .external_lex_state = 2},
  [540] = {.lex_state = 0},
  [541] = {.lex_state = 0},
  [542] = {.lex_state = 42, .external_lex_state = 2},
  [543] = {.lex_state = 22},
  [544] = {.lex_state = 0},
  [545] = {.lex_state = 0, .external_lex_state = 2},
  [546] = {.lex_state = 0},
  [547] = {.lex_state = 0, .external_lex_state = 2},
  [548] = {.lex_state = 0},
  [549] = {.lex_state = 0},
  [550] = {.lex_state = 22},
  [551] = {.lex_state = 0, .external_lex_state = 2},
  [552] = {.lex_state = 0, .external_lex_state = 2},
  [553] = {.lex_state = 0},
  [554] = {.lex_state = 0, .external_lex_state = 2},
  [555] = {.lex_state = 0, .external_lex_state = 2},
  [556] = {.lex_state = 0, .external_lex_state = 2},
  [557] = {.lex_state = 0, .external_lex_state = 2},
  [558] = {.lex_state = 43},
  [559] = {.lex_state = 0},
  [560] = {.lex_state = 0, .external_lex_state = 2},
  [561] = {.lex_state = 0, .external_lex_state = 2},
  [562] = {.lex_state = 0, .external_lex_state = 2},
  [563] = {.lex_state = 0, .external_lex_state = 2},
  [564] = {.lex_state = 0, .external_lex_state = 2},
  [565] = {.lex_state = 0},
  [566] = {.lex_state = 0, .external_lex_state = 2},
  [567] = {.lex_state = 0, .external_lex_state = 2},
  [568] = {.lex_state = 0, .external_lex_state = 2},
  [569] = {.lex_state = 43},
  [570] = {.lex_state = 0, .external_lex_state = 2},
  [571] = {.lex_state = 0, .external_lex_state = 2},
  [572] = {.lex_state = 0, .external_lex_state = 2},
  [573] = {.lex_state = 0, .external_lex_state = 2},
  [574] = {.lex_state = 0, .external_lex_state = 2},
  [575] = {.lex_state = 0, .external_lex_state = 2},
  [576] = {.lex_state = 0},
  [577] = {.lex_state = 22},
  [578] = {.lex_state = 22},
  [579] = {.lex_state = 0},
  [580] = {.lex_state = 0, .external_lex_state = 2},
  [581] = {.lex_state = 0},
  [582] = {.lex_state = 21},
  [583] = {.lex_state = 0},
  [584] = {.lex_state = 0},
  [585] = {.lex_state = 0},
  [586] = {.lex_state = 528},
  [587] = {.lex_state = 0},
  [588] = {.lex_state = 528},
  [589] = {.lex_state = 528},
  [590] = {.lex_state = 22},
  [591] = {.lex_state = 0},
  [592] = {.lex_state = 0},
  [593] = {.lex_state = 528},
  [594] = {.lex_state = 0},
  [595] = {.lex_state = 0, .external_lex_state = 2},
  [596] = {.lex_state = 0, .external_lex_state = 2},
  [597] = {.lex_state = 0},
  [598] = {.lex_state = 528},
  [599] = {.lex_state = 528},
  [600] = {.lex_state = 0},
  [601] = {.lex_state = 0},
  [602] = {.lex_state = 0, .external_lex_state = 2},
  [603] = {.lex_state = 528},
  [604] = {.lex_state = 0},
  [605] = {.lex_state = 0},
  [606] = {.lex_state = 22},
  [607] = {.lex_state = 0},
  [608] = {.lex_state = 0},
  [609] = {.lex_state = 0, .external_lex_state = 2},
  [610] = {.lex_state = 528},
  [611] = {.lex_state = 0, .external_lex_state = 3},
  [612] = {.lex_state = 0, .external_lex_state = 3},
  [613] = {.lex_state = 0},
  [614] = {.lex_state = 0},
  [615] = {.lex_state = 0},
  [616] = {.lex_state = 0},
  [617] = {.lex_state = 22},
  [618] = {.lex_state = 0},
  [619] = {.lex_state = 0, .external_lex_state = 2},
  [620] = {.lex_state = 0},
  [621] = {.lex_state = 528},
  [622] = {.lex_state = 0},
  [623] = {.lex_state = 528},
  [624] = {.lex_state = 528},
  [625] = {.lex_state = 0},
  [626] = {.lex_state = 0},
  [627] = {.lex_state = 0},
  [628] = {.lex_state = 0, .external_lex_state = 2},
  [629] = {.lex_state = 528},
  [630] = {.lex_state = 528},
  [631] = {.lex_state = 528},
  [632] = {.lex_state = 0, .external_lex_state = 2},
  [633] = {.lex_state = 0},
  [634] = {.lex_state = 0, .external_lex_state = 2},
  [635] = {.lex_state = 0},
  [636] = {.lex_state = 0},
  [637] = {.lex_state = 528},
  [638] = {.lex_state = 528},
  [639] = {.lex_state = 0},
  [640] = {.lex_state = 528},
  [641] = {.lex_state = 22},
  [642] = {.lex_state = 0},
  [643] = {.lex_state = 0},
  [644] = {.lex_state = 0, .external_lex_state = 2},
  [645] = {.lex_state = 0},
  [646] = {.lex_state = 0, .external_lex_state = 2},
  [647] = {.lex_state = 0, .external_lex_state = 2},
  [648] = {.lex_state = 0},
  [649] = {.lex_state = 0, .external_lex_state = 2},
  [650] = {.lex_state = 0},
  [651] = {.lex_state = 0},
  [652] = {.lex_state = 0},
  [653] = {.lex_state = 528},
  [654] = {.lex_state = 22},
  [655] = {.lex_state = 22},
  [656] = {.lex_state = 0},
  [657] = {.lex_state = 528},
  [658] = {.lex_state = 0},
  [659] = {.lex_state = 0},
  [660] = {.lex_state = 0},
  [661] = {.lex_state = 0},
  [662] = {.lex_state = 528},
  [663] = {.lex_state = 528},
  [664] = {.lex_state = 0},
  [665] = {.lex_state = 528},
  [666] = {.lex_state = 0},
  [667] = {.lex_state = 0},
  [668] = {.lex_state = 0},
  [669] = {.lex_state = 1},
  [670] = {.lex_state = 0},
  [671] = {.lex_state = 0},
  [672] = {.lex_state = 0},
  [673] = {.lex_state = 0},
  [674] = {.lex_state = 0, .external_lex_state = 2},
  [675] = {.lex_state = 0},
  [676] = {.lex_state = 23},
  [677] = {.lex_state = 0},
  [678] = {.lex_state = 23, .external_lex_state = 2},
  [679] = {.lex_state = 0, .external_lex_state = 2},
  [680] = {.lex_state = 0},
  [681] = {.lex_state = 0},
  [682] = {.lex_state = 0, .external_lex_state = 2},
  [683] = {.lex_state = 23, .external_lex_state = 2},
  [684] = {.lex_state = 0, .external_lex_state = 2},
  [685] = {.lex_state = 0, .external_lex_state = 2},
  [686] = {.lex_state = 42},
  [687] = {.lex_state = 42},
  [688] = {.lex_state = 0},
  [689] = {.lex_state = 0, .external_lex_state = 2},
  [690] = {.lex_state = 0},
  [691] = {.lex_state = 0},
  [692] = {.lex_state = 0},
  [693] = {.lex_state = 23, .external_lex_state = 2},
  [694] = {.lex_state = 0},
  [695] = {.lex_state = 0},
  [696] = {.lex_state = 0},
  [697] = {.lex_state = 0},
  [698] = {.lex_state = 0},
  [699] = {.lex_state = 23, .external_lex_state = 2},
  [700] = {.lex_state = 0},
  [701] = {.lex_state = 0, .external_lex_state = 2},
  [702] = {.lex_state = 0},
  [703] = {.lex_state = 0, .external_lex_state = 2},
  [704] = {.lex_state = 23, .external_lex_state = 2},
  [705] = {.lex_state = 0, .external_lex_state = 2},
  [706] = {.lex_state = 0},
  [707] = {.lex_state = 0},
  [708] = {.lex_state = 23, .external_lex_state = 2},
  [709] = {.lex_state = 0, .external_lex_state = 2},
  [710] = {.lex_state = 0},
  [711] = {.lex_state = 0, .external_lex_state = 2},
  [712] = {.lex_state = 1},
  [713] = {.lex_state = 0, .external_lex_state = 2},
  [714] = {.lex_state = 0, .external_lex_state = 2},
  [715] = {.lex_state = 0},
  [716] = {.lex_state = 0},
  [717] = {.lex_state = 0, .external_lex_state = 2},
  [718] = {.lex_state = 0},
  [719] = {.lex_state = 0},
  [720] = {.lex_state = 0, .external_lex_state = 2},
  [721] = {.lex_state = 23, .external_lex_state = 2},
  [722] = {.lex_state = 0, .external_lex_state = 2},
  [723] = {.lex_state = 23, .external_lex_state = 2},
  [724] = {.lex_state = 0},
  [725] = {.lex_state = 23, .external_lex_state = 2},
  [726] = {.lex_state = 0},
  [727] = {.lex_state = 0},
  [728] = {.lex_state = 0},
  [729] = {.lex_state = 0},
  [730] = {.lex_state = 0},
  [731] = {.lex_state = 0, .external_lex_state = 2},
  [732] = {.lex_state = 0, .external_lex_state = 2},
  [733] = {.lex_state = 23},
  [734] = {.lex_state = 241},
  [735] = {.lex_state = 0},
  [736] = {.lex_state = 0, .external_lex_state = 5},
  [737] = {.lex_state = 0, .external_lex_state = 5},
  [738] = {.lex_state = 0},
  [739] = {.lex_state = 0, .external_lex_state = 2},
  [740] = {.lex_state = 23},
  [741] = {.lex_state = 0, .external_lex_state = 2},
  [742] = {.lex_state = 0, .external_lex_state = 2},
  [743] = {.lex_state = 0, .external_lex_state = 2},
  [744] = {.lex_state = 0, .external_lex_state = 2},
  [745] = {.lex_state = 23},
  [746] = {.lex_state = 0, .external_lex_state = 2},
  [747] = {.lex_state = 0, .external_lex_state = 2},
  [748] = {.lex_state = 0, .external_lex_state = 2},
  [749] = {.lex_state = 0, .external_lex_state = 2},
  [750] = {.lex_state = 0},
  [751] = {.lex_state = 0},
  [752] = {.lex_state = 25},
  [753] = {.lex_state = 0, .external_lex_state = 2},
  [754] = {.lex_state = 23},
  [755] = {.lex_state = 529},
  [756] = {.lex_state = 23},
  [757] = {.lex_state = 23},
  [758] = {.lex_state = 0, .external_lex_state = 2},
  [759] = {.lex_state = 23},
  [760] = {.lex_state = 0, .external_lex_state = 2},
  [761] = {.lex_state = 0, .external_lex_state = 2},
  [762] = {.lex_state = 23},
  [763] = {.lex_state = 0, .external_lex_state = 2},
  [764] = {.lex_state = 0, .external_lex_state = 2},
  [765] = {.lex_state = 0},
  [766] = {.lex_state = 0, .external_lex_state = 5},
  [767] = {.lex_state = 0, .external_lex_state = 2},
  [768] = {.lex_state = 0, .external_lex_state = 2},
  [769] = {.lex_state = 23},
  [770] = {.lex_state = 0, .external_lex_state = 2},
  [771] = {.lex_state = 0, .external_lex_state = 5},
  [772] = {.lex_state = 0, .external_lex_state = 2},
  [773] = {.lex_state = 0},
  [774] = {.lex_state = 23},
  [775] = {.lex_state = 23},
  [776] = {.lex_state = 0, .external_lex_state = 2},
  [777] = {.lex_state = 0, .external_lex_state = 2},
  [778] = {.lex_state = 0, .external_lex_state = 2},
  [779] = {.lex_state = 0, .external_lex_state = 2},
  [780] = {.lex_state = 0, .external_lex_state = 5},
  [781] = {.lex_state = 0, .external_lex_state = 2},
  [782] = {.lex_state = 0},
  [783] = {.lex_state = 0},
  [784] = {.lex_state = 0, .external_lex_state = 2},
  [785] = {.lex_state = 23},
  [786] = {.lex_state = 0, .external_lex_state = 2},
  [787] = {.lex_state = 23},
  [788] = {.lex_state = 0, .external_lex_state = 2},
  [789] = {.lex_state = 0, .external_lex_state = 2},
  [790] = {.lex_state = 0, .external_lex_state = 2},
  [791] = {.lex_state = 0},
  [792] = {.lex_state = 0, .external_lex_state = 2},
  [793] = {.lex_state = 23},
  [794] = {.lex_state = 0, .external_lex_state = 2},
  [795] = {.lex_state = 23},
  [796] = {.lex_state = 23},
  [797] = {.lex_state = 23},
  [798] = {.lex_state = 0},
  [799] = {.lex_state = 0, .external_lex_state = 2},
  [800] = {.lex_state = 0, .external_lex_state = 2},
  [801] = {.lex_state = 0},
  [802] = {.lex_state = 23},
  [803] = {.lex_state = 23},
  [804] = {.lex_state = 0, .external_lex_state = 2},
  [805] = {.lex_state = 0, .external_lex_state = 2},
  [806] = {.lex_state = 0, .external_lex_state = 5},
  [807] = {.lex_state = 23},
  [808] = {.lex_state = 0, .external_lex_state = 2},
  [809] = {.lex_state = 0},
  [810] = {.lex_state = 0, .external_lex_state = 2},
  [811] = {.lex_state = 0, .external_lex_state = 2},
  [812] = {.lex_state = 0, .external_lex_state = 2},
  [813] = {.lex_state = 23},
  [814] = {.lex_state = 25},
  [815] = {.lex_state = 0, .external_lex_state = 2},
  [816] = {.lex_state = 0, .external_lex_state = 2},
  [817] = {.lex_state = 0, .external_lex_state = 2},
  [818] = {.lex_state = 0},
  [819] = {.lex_state = 23},
  [820] = {.lex_state = 0, .external_lex_state = 2},
  [821] = {.lex_state = 0, .external_lex_state = 2},
  [822] = {.lex_state = 0, .external_lex_state = 2},
  [823] = {.lex_state = 0, .external_lex_state = 2},
  [824] = {.lex_state = 0, .external_lex_state = 2},
  [825] = {.lex_state = 0, .external_lex_state = 2},
  [826] = {.lex_state = 0, .external_lex_state = 2},
  [827] = {.lex_state = 0, .external_lex_state = 2},
  [828] = {.lex_state = 0, .external_lex_state = 2},
  [829] = {.lex_state = 0, .external_lex_state = 2},
  [830] = {.lex_state = 0, .external_lex_state = 2},
  [831] = {.lex_state = 0, .external_lex_state = 2},
  [832] = {.lex_state = 0},
  [833] = {.lex_state = 0, .external_lex_state = 2},
  [834] = {.lex_state = 0, .external_lex_state = 2},
  [835] = {.lex_state = 0, .external_lex_state = 2},
  [836] = {.lex_state = 0, .external_lex_state = 2},
  [837] = {.lex_state = 0, .external_lex_state = 2},
  [838] = {.lex_state = 0, .external_lex_state = 2},
  [839] = {.lex_state = 0, .external_lex_state = 2},
  [840] = {.lex_state = 23},
  [841] = {.lex_state = 0, .external_lex_state = 2},
  [842] = {.lex_state = 23},
  [843] = {.lex_state = 0, .external_lex_state = 2},
  [844] = {.lex_state = 0, .external_lex_state = 2},
  [845] = {.lex_state = 0, .external_lex_state = 2},
  [846] = {.lex_state = 0, .external_lex_state = 2},
  [847] = {.lex_state = 43},
  [848] = {.lex_state = 0, .external_lex_state = 2},
  [849] = {.lex_state = 0, .external_lex_state = 2},
  [850] = {.lex_state = 0, .external_lex_state = 2},
  [851] = {.lex_state = 0, .external_lex_state = 2},
  [852] = {.lex_state = 0, .external_lex_state = 2},
  [853] = {.lex_state = 23},
  [854] = {.lex_state = 0, .external_lex_state = 2},
  [855] = {.lex_state = 0, .external_lex_state = 2},
  [856] = {.lex_state = 0, .external_lex_state = 2},
  [857] = {.lex_state = 23},
  [858] = {.lex_state = 0, .external_lex_state = 2},
  [859] = {.lex_state = 23},
  [860] = {.lex_state = 0, .external_lex_state = 2},
  [861] = {.lex_state = 0, .external_lex_state = 2},
  [862] = {.lex_state = 23},
  [863] = {.lex_state = 23},
  [864] = {.lex_state = 43},
  [865] = {.lex_state = 0},
  [866] = {.lex_state = 23},
  [867] = {.lex_state = 0, .external_lex_state = 2},
  [868] = {.lex_state = 0, .external_lex_state = 2},
  [869] = {.lex_state = 0, .external_lex_state = 2},
  [870] = {.lex_state = 0, .external_lex_state = 2},
  [871] = {.lex_state = 0, .external_lex_state = 2},
  [872] = {.lex_state = 0, .external_lex_state = 2},
  [873] = {.lex_state = 0, .external_lex_state = 2},
  [874] = {.lex_state = 0},
  [875] = {.lex_state = 0, .external_lex_state = 2},
  [876] = {.lex_state = 0},
  [877] = {.lex_state = 0, .external_lex_state = 2},
  [878] = {.lex_state = 0, .external_lex_state = 2},
  [879] = {.lex_state = 23},
  [880] = {.lex_state = 0, .external_lex_state = 2},
  [881] = {.lex_state = 23},
  [882] = {.lex_state = 0, .external_lex_state = 2},
  [883] = {.lex_state = 0, .external_lex_state = 2},
  [884] = {.lex_state = 0, .external_lex_state = 2},
  [885] = {.lex_state = 0, .external_lex_state = 2},
  [886] = {.lex_state = 0, .external_lex_state = 2},
  [887] = {.lex_state = 0},
  [888] = {.lex_state = 0, .external_lex_state = 2},
  [889] = {.lex_state = 23},
  [890] = {.lex_state = 0, .external_lex_state = 2},
  [891] = {.lex_state = 23},
  [892] = {.lex_state = 0, .external_lex_state = 2},
  [893] = {.lex_state = 23},
  [894] = {.lex_state = 23},
  [895] = {.lex_state = 23},
  [896] = {.lex_state = 23},
  [897] = {.lex_state = 0, .external_lex_state = 2},
  [898] = {.lex_state = 0},
  [899] = {.lex_state = 23},
  [900] = {.lex_state = 0},
  [901] = {.lex_state = 0},
  [902] = {.lex_state = 0, .external_lex_state = 5},
  [903] = {.lex_state = 0},
  [904] = {.lex_state = 0, .external_lex_state = 2},
  [905] = {.lex_state = 23},
  [906] = {.lex_state = 0},
  [907] = {.lex_state = 0},
  [908] = {.lex_state = 23},
  [909] = {.lex_state = 241},
  [910] = {.lex_state = 0},
  [911] = {.lex_state = 0, .external_lex_state = 2},
  [912] = {.lex_state = 23},
  [913] = {.lex_state = 23},
  [914] = {.lex_state = 23},
  [915] = {.lex_state = 241},
  [916] = {.lex_state = 23},
  [917] = {.lex_state = 23},
  [918] = {.lex_state = 23},
  [919] = {.lex_state = 23},
  [920] = {.lex_state = 241},
  [921] = {.lex_state = 23},
  [922] = {.lex_state = 241},
  [923] = {.lex_state = 0},
  [924] = {.lex_state = 23},
  [925] = {.lex_state = 0, .external_lex_state = 5},
  [926] = {.lex_state = 23},
  [927] = {.lex_state = 0, .external_lex_state = 2},
  [928] = {.lex_state = 23},
  [929] = {.lex_state = 23},
  [930] = {.lex_state = 23},
  [931] = {.lex_state = 23},
  [932] = {.lex_state = 0, .external_lex_state = 2},
  [933] = {.lex_state = 23},
  [934] = {.lex_state = 23},
  [935] = {.lex_state = 23},
  [936] = {.lex_state = 0, .external_lex_state = 2},
  [937] = {.lex_state = 23},
  [938] = {.lex_state = 23},
  [939] = {.lex_state = 23},
  [940] = {.lex_state = 23},
  [941] = {.lex_state = 0},
  [942] = {.lex_state = 23},
  [943] = {.lex_state = 0, .external_lex_state = 2},
  [944] = {.lex_state = 0, .external_lex_state = 2},
  [945] = {.lex_state = 0, .external_lex_state = 2},
  [946] = {.lex_state = 23},
  [947] = {.lex_state = 23},
  [948] = {.lex_state = 0, .external_lex_state = 5},
  [949] = {.lex_state = 23},
  [950] = {.lex_state = 0, .external_lex_state = 2},
  [951] = {.lex_state = 0, .external_lex_state = 2},
  [952] = {.lex_state = 0, .external_lex_state = 5},
  [953] = {.lex_state = 0},
  [954] = {.lex_state = 23},
  [955] = {.lex_state = 0, .external_lex_state = 2},
  [956] = {.lex_state = 529},
  [957] = {.lex_state = 0},
  [958] = {.lex_state = 0},
  [959] = {.lex_state = 43},
  [960] = {.lex_state = 43},
  [961] = {.lex_state = 0, .external_lex_state = 5},
  [962] = {.lex_state = 0, .external_lex_state = 5},
  [963] = {.lex_state = 0, .external_lex_state = 5},
  [964] = {.lex_state = 0, .external_lex_state = 5},
  [965] = {.lex_state = 0, .external_lex_state = 5},
  [966] = {.lex_state = 0, .external_lex_state = 5},
  [967] = {.lex_state = 0, .external_lex_state = 5},
  [968] = {.lex_state = 0, .external_lex_state = 5},
  [969] = {.lex_state = 0, .external_lex_state = 2},
  [970] = {.lex_state = 23},
  [971] = {.lex_state = 0, .external_lex_state = 2},
  [972] = {.lex_state = 0, .external_lex_state = 2},
  [973] = {.lex_state = 0, .external_lex_state = 2},
  [974] = {.lex_state = 0, .external_lex_state = 2},
  [975] = {.lex_state = 0, .external_lex_state = 2},
  [976] = {.lex_state = 0, .external_lex_state = 2},
  [977] = {.lex_state = 0, .external_lex_state = 2},
  [978] = {.lex_state = 0, .external_lex_state = 2},
  [979] = {.lex_state = 0, .external_lex_state = 2},
  [980] = {.lex_state = 0, .external_lex_state = 2},
  [981] = {.lex_state = 241},
  [982] = {.lex_state = 23},
  [983] = {.lex_state = 0, .external_lex_state = 2},
  [984] = {.lex_state = 0, .external_lex_state = 2},
  [985] = {.lex_state = 0, .external_lex_state = 2},
  [986] = {.lex_state = 0},
  [987] = {.lex_state = 0},
  [988] = {.lex_state = 0},
  [989] = {.lex_state = 0},
  [990] = {.lex_state = 0},
  [991] = {.lex_state = 0, .external_lex_state = 2},
};

static const uint16_t ts_parse_table[LARGE_STATE_COUNT][SYMBOL_COUNT] = {
  [0] = {
    [ts_builtin_sym_end] = ACTIONS(1),
    [sym_identifier] = ACTIONS(1),
    [sym_comment] = ACTIONS(1),
    [sym_expression] = ACTIONS(1),
    [anon_sym_COLON] = ACTIONS(1),
    [anon_sym_label] = ACTIONS(1),
    [anon_sym_hide] = ACTIONS(1),
    [anon_sym_global] = ACTIONS(1),
    [anon_sym_LPAREN] = ACTIONS(1),
    [anon_sym_RPAREN] = ACTIONS(1),
    [anon_sym_jump] = ACTIONS(1),
    [anon_sym_expression] = ACTIONS(1),
    [anon_sym_call] = ACTIONS(1),
    [anon_sym_from] = ACTIONS(1),
    [anon_sym_return] = ACTIONS(1),
    [anon_sym_pass] = ACTIONS(1),
    [anon_sym_menu] = ACTIONS(1),
    [anon_sym_set] = ACTIONS(1),
    [anon_sym_if] = ACTIONS(1),
    [anon_sym_elif] = ACTIONS(1),
    [anon_sym_else] = ACTIONS(1),
    [anon_sym_while] = ACTIONS(1),
    [anon_sym_for] = ACTIONS(1),
    [anon_sym_in] = ACTIONS(1),
    [anon_sym_with] = ACTIONS(1),
    [anon_sym_python] = ACTIONS(1),
    [anon_sym_early] = ACTIONS(1),
    [anon_sym_init] = ACTIONS(1),
    [aux_sym_init_python_statement_token1] = ACTIONS(1),
    [anon_sym_DOLLAR] = ACTIONS(1),
    [anon_sym_define] = ACTIONS(1),
    [anon_sym_EQ] = ACTIONS(1),
    [anon_sym_default] = ACTIONS(1),
    [anon_sym_image] = ACTIONS(1),
    [anon_sym_scene] = ACTIONS(1),
    [anon_sym_at] = ACTIONS(1),
    [anon_sym_show] = ACTIONS(1),
    [anon_sym_as] = ACTIONS(1),
    [anon_sym_screen] = ACTIONS(1),
    [anon_sym_nopredict] = ACTIONS(1),
    [anon_sym_play] = ACTIONS(1),
    [anon_sym_queue] = ACTIONS(1),
    [anon_sym_stop] = ACTIONS(1),
    [anon_sym_voice] = ACTIONS(1),
    [anon_sym_sustain] = ACTIONS(1),
    [anon_sym_showif] = ACTIONS(1),
    [anon_sym_transform] = ACTIONS(1),
    [anon_sym_parallel] = ACTIONS(1),
    [anon_sym_contains] = ACTIONS(1),
    [anon_sym_choice] = ACTIONS(1),
    [anon_sym_block] = ACTIONS(1),
    [anon_sym_repeat] = ACTIONS(1),
    [anon_sym_pause] = ACTIONS(1),
    [anon_sym_time] = ACTIONS(1),
    [anon_sym_translate] = ACTIONS(1),
    [anon_sym_strings] = ACTIONS(1),
    [anon_sym_style] = ACTIONS(1),
    [anon_sym_is] = ACTIONS(1),
    [anon_sym_take] = ACTIONS(1),
    [anon_sym_camera] = ACTIONS(1),
    [anon_sym_layeredimage] = ACTIONS(1),
    [anon_sym_nvl] = ACTIONS(1),
    [anon_sym_clear] = ACTIONS(1),
    [aux_sym_string_token1] = ACTIONS(1),
    [aux_sym_string_token2] = ACTIONS(1),
    [sym__newline] = ACTIONS(1),
    [sym__indent] = ACTIONS(1),
    [sym__dedent] = ACTIONS(1),
    [sym_python_block] = ACTIONS(1),
  },
  [1] = {
    [sym_source_file] = STATE(832),
    [sym__statement] = STATE(2),
    [sym__comment_line] = STATE(2),
    [sym_label_statement] = STATE(2),
    [sym_jump_statement] = STATE(2),
    [sym_call_statement] = STATE(2),
    [sym_return_statement] = STATE(2),
    [sym_pass_statement] = STATE(2),
    [sym_menu_statement] = STATE(2),
    [sym_if_statement] = STATE(2),
    [sym_while_statement] = STATE(2),
    [sym_for_statement] = STATE(2),
    [sym_say_statement] = STATE(2),
    [sym_python_statement] = STATE(2),
    [sym_init_python_statement] = STATE(2),
    [sym_dollar_statement] = STATE(2),
    [sym_define_statement] = STATE(2),
    [sym_default_statement] = STATE(2),
    [sym_image_statement] = STATE(2),
    [sym_scene_statement] = STATE(2),
    [sym_show_statement] = STATE(2),
    [sym_show_screen_statement] = STATE(2),
    [sym_hide_screen_statement] = STATE(2),
    [sym_call_screen_statement] = STATE(2),
    [sym_hide_statement] = STATE(2),
    [sym_with_statement] = STATE(2),
    [sym_play_statement] = STATE(2),
    [sym_queue_statement] = STATE(2),
    [sym_stop_statement] = STATE(2),
    [sym_voice_statement] = STATE(2),
    [sym_screen_statement] = STATE(2),
    [sym_transform_statement] = STATE(2),
    [sym_expression_statement] = STATE(2),
    [sym_unknown_statement] = STATE(2),
    [sym_translate_statement] = STATE(2),
    [sym_style_statement] = STATE(2),
    [sym_camera_statement] = STATE(2),
    [sym_layeredimage_statement] = STATE(2),
    [sym_nvl_statement] = STATE(2),
    [sym_string] = STATE(113),
    [aux_sym_source_file_repeat1] = STATE(2),
    [ts_builtin_sym_end] = ACTIONS(3),
    [sym_identifier] = ACTIONS(5),
    [sym_comment] = ACTIONS(7),
    [sym_expression] = ACTIONS(9),
    [anon_sym_label] = ACTIONS(11),
    [anon_sym_hide] = ACTIONS(13),
    [anon_sym_jump] = ACTIONS(15),
    [anon_sym_call] = ACTIONS(17),
    [anon_sym_return] = ACTIONS(19),
    [anon_sym_pass] = ACTIONS(21),
    [anon_sym_menu] = ACTIONS(23),
    [anon_sym_if] = ACTIONS(25),
    [anon_sym_while] = ACTIONS(27),
    [anon_sym_for] = ACTIONS(29),
    [anon_sym_with] = ACTIONS(31),
    [anon_sym_python] = ACTIONS(33),
    [anon_sym_init] = ACTIONS(35),
    [anon_sym_DOLLAR] = ACTIONS(37),
    [anon_sym_define] = ACTIONS(39),
    [anon_sym_default] = ACTIONS(41),
    [anon_sym_image] = ACTIONS(43),
    [anon_sym_scene] = ACTIONS(45),
    [anon_sym_show] = ACTIONS(47),
    [anon_sym_screen] = ACTIONS(49),
    [anon_sym_play] = ACTIONS(51),
    [anon_sym_queue] = ACTIONS(53),
    [anon_sym_stop] = ACTIONS(55),
    [anon_sym_voice] = ACTIONS(57),
    [anon_sym_transform] = ACTIONS(59),
    [anon_sym_translate] = ACTIONS(61),
    [anon_sym_style] = ACTIONS(63),
    [anon_sym_camera] = ACTIONS(65),
    [anon_sym_layeredimage] = ACTIONS(67),
    [anon_sym_nvl] = ACTIONS(69),
    [aux_sym_string_token1] = ACTIONS(71),
    [aux_sym_string_token2] = ACTIONS(71),
    [sym__newline] = ACTIONS(73),
  },
  [2] = {
    [sym__statement] = STATE(4),
    [sym__comment_line] = STATE(4),
    [sym_label_statement] = STATE(4),
    [sym_jump_statement] = STATE(4),
    [sym_call_statement] = STATE(4),
    [sym_return_statement] = STATE(4),
    [sym_pass_statement] = STATE(4),
    [sym_menu_statement] = STATE(4),
    [sym_if_statement] = STATE(4),
    [sym_while_statement] = STATE(4),
    [sym_for_statement] = STATE(4),
    [sym_say_statement] = STATE(4),
    [sym_python_statement] = STATE(4),
    [sym_init_python_statement] = STATE(4),
    [sym_dollar_statement] = STATE(4),
    [sym_define_statement] = STATE(4),
    [sym_default_statement] = STATE(4),
    [sym_image_statement] = STATE(4),
    [sym_scene_statement] = STATE(4),
    [sym_show_statement] = STATE(4),
    [sym_show_screen_statement] = STATE(4),
    [sym_hide_screen_statement] = STATE(4),
    [sym_call_screen_statement] = STATE(4),
    [sym_hide_statement] = STATE(4),
    [sym_with_statement] = STATE(4),
    [sym_play_statement] = STATE(4),
    [sym_queue_statement] = STATE(4),
    [sym_stop_statement] = STATE(4),
    [sym_voice_statement] = STATE(4),
    [sym_screen_statement] = STATE(4),
    [sym_transform_statement] = STATE(4),
    [sym_expression_statement] = STATE(4),
    [sym_unknown_statement] = STATE(4),
    [sym_translate_statement] = STATE(4),
    [sym_style_statement] = STATE(4),
    [sym_camera_statement] = STATE(4),
    [sym_layeredimage_statement] = STATE(4),
    [sym_nvl_statement] = STATE(4),
    [sym_string] = STATE(113),
    [aux_sym_source_file_repeat1] = STATE(4),
    [ts_builtin_sym_end] = ACTIONS(75),
    [sym_identifier] = ACTIONS(5),
    [sym_comment] = ACTIONS(7),
    [sym_expression] = ACTIONS(9),
    [anon_sym_label] = ACTIONS(11),
    [anon_sym_hide] = ACTIONS(13),
    [anon_sym_jump] = ACTIONS(15),
    [anon_sym_call] = ACTIONS(17),
    [anon_sym_return] = ACTIONS(19),
    [anon_sym_pass] = ACTIONS(21),
    [anon_sym_menu] = ACTIONS(23),
    [anon_sym_if] = ACTIONS(25),
    [anon_sym_while] = ACTIONS(27),
    [anon_sym_for] = ACTIONS(29),
    [anon_sym_with] = ACTIONS(31),
    [anon_sym_python] = ACTIONS(33),
    [anon_sym_init] = ACTIONS(35),
    [anon_sym_DOLLAR] = ACTIONS(37),
    [anon_sym_define] = ACTIONS(39),
    [anon_sym_default] = ACTIONS(41),
    [anon_sym_image] = ACTIONS(43),
    [anon_sym_scene] = ACTIONS(45),
    [anon_sym_show] = ACTIONS(47),
    [anon_sym_screen] = ACTIONS(49),
    [anon_sym_play] = ACTIONS(51),
    [anon_sym_queue] = ACTIONS(53),
    [anon_sym_stop] = ACTIONS(55),
    [anon_sym_voice] = ACTIONS(57),
    [anon_sym_transform] = ACTIONS(59),
    [anon_sym_translate] = ACTIONS(61),
    [anon_sym_style] = ACTIONS(63),
    [anon_sym_camera] = ACTIONS(65),
    [anon_sym_layeredimage] = ACTIONS(67),
    [anon_sym_nvl] = ACTIONS(69),
    [aux_sym_string_token1] = ACTIONS(71),
    [aux_sym_string_token2] = ACTIONS(71),
  },
  [3] = {
    [sym__statement] = STATE(4),
    [sym__comment_line] = STATE(4),
    [sym_label_statement] = STATE(4),
    [sym_jump_statement] = STATE(4),
    [sym_call_statement] = STATE(4),
    [sym_return_statement] = STATE(4),
    [sym_pass_statement] = STATE(4),
    [sym_menu_statement] = STATE(4),
    [sym_if_statement] = STATE(4),
    [sym_while_statement] = STATE(4),
    [sym_for_statement] = STATE(4),
    [sym_say_statement] = STATE(4),
    [sym_python_statement] = STATE(4),
    [sym_init_python_statement] = STATE(4),
    [sym_dollar_statement] = STATE(4),
    [sym_define_statement] = STATE(4),
    [sym_default_statement] = STATE(4),
    [sym_image_statement] = STATE(4),
    [sym_scene_statement] = STATE(4),
    [sym_show_statement] = STATE(4),
    [sym_show_screen_statement] = STATE(4),
    [sym_hide_screen_statement] = STATE(4),
    [sym_call_screen_statement] = STATE(4),
    [sym_hide_statement] = STATE(4),
    [sym_with_statement] = STATE(4),
    [sym_play_statement] = STATE(4),
    [sym_queue_statement] = STATE(4),
    [sym_stop_statement] = STATE(4),
    [sym_voice_statement] = STATE(4),
    [sym_screen_statement] = STATE(4),
    [sym_transform_statement] = STATE(4),
    [sym_expression_statement] = STATE(4),
    [sym_unknown_statement] = STATE(4),
    [sym_translate_statement] = STATE(4),
    [sym_style_statement] = STATE(4),
    [sym_camera_statement] = STATE(4),
    [sym_layeredimage_statement] = STATE(4),
    [sym_nvl_statement] = STATE(4),
    [sym_string] = STATE(113),
    [aux_sym_source_file_repeat1] = STATE(4),
    [ts_builtin_sym_end] = ACTIONS(77),
    [sym_identifier] = ACTIONS(5),
    [sym_comment] = ACTIONS(7),
    [sym_expression] = ACTIONS(9),
    [anon_sym_label] = ACTIONS(11),
    [anon_sym_hide] = ACTIONS(13),
    [anon_sym_jump] = ACTIONS(15),
    [anon_sym_call] = ACTIONS(17),
    [anon_sym_return] = ACTIONS(19),
    [anon_sym_pass] = ACTIONS(21),
    [anon_sym_menu] = ACTIONS(23),
    [anon_sym_if] = ACTIONS(25),
    [anon_sym_while] = ACTIONS(27),
    [anon_sym_for] = ACTIONS(29),
    [anon_sym_with] = ACTIONS(31),
    [anon_sym_python] = ACTIONS(33),
    [anon_sym_init] = ACTIONS(35),
    [anon_sym_DOLLAR] = ACTIONS(37),
    [anon_sym_define] = ACTIONS(39),
    [anon_sym_default] = ACTIONS(41),
    [anon_sym_image] = ACTIONS(43),
    [anon_sym_scene] = ACTIONS(45),
    [anon_sym_show] = ACTIONS(47),
    [anon_sym_screen] = ACTIONS(49),
    [anon_sym_play] = ACTIONS(51),
    [anon_sym_queue] = ACTIONS(53),
    [anon_sym_stop] = ACTIONS(55),
    [anon_sym_voice] = ACTIONS(57),
    [anon_sym_transform] = ACTIONS(59),
    [anon_sym_translate] = ACTIONS(61),
    [anon_sym_style] = ACTIONS(63),
    [anon_sym_camera] = ACTIONS(65),
    [anon_sym_layeredimage] = ACTIONS(67),
    [anon_sym_nvl] = ACTIONS(69),
    [aux_sym_string_token1] = ACTIONS(71),
    [aux_sym_string_token2] = ACTIONS(71),
  },
  [4] = {
    [sym__statement] = STATE(4),
    [sym__comment_line] = STATE(4),
    [sym_label_statement] = STATE(4),
    [sym_jump_statement] = STATE(4),
    [sym_call_statement] = STATE(4),
    [sym_return_statement] = STATE(4),
    [sym_pass_statement] = STATE(4),
    [sym_menu_statement] = STATE(4),
    [sym_if_statement] = STATE(4),
    [sym_while_statement] = STATE(4),
    [sym_for_statement] = STATE(4),
    [sym_say_statement] = STATE(4),
    [sym_python_statement] = STATE(4),
    [sym_init_python_statement] = STATE(4),
    [sym_dollar_statement] = STATE(4),
    [sym_define_statement] = STATE(4),
    [sym_default_statement] = STATE(4),
    [sym_image_statement] = STATE(4),
    [sym_scene_statement] = STATE(4),
    [sym_show_statement] = STATE(4),
    [sym_show_screen_statement] = STATE(4),
    [sym_hide_screen_statement] = STATE(4),
    [sym_call_screen_statement] = STATE(4),
    [sym_hide_statement] = STATE(4),
    [sym_with_statement] = STATE(4),
    [sym_play_statement] = STATE(4),
    [sym_queue_statement] = STATE(4),
    [sym_stop_statement] = STATE(4),
    [sym_voice_statement] = STATE(4),
    [sym_screen_statement] = STATE(4),
    [sym_transform_statement] = STATE(4),
    [sym_expression_statement] = STATE(4),
    [sym_unknown_statement] = STATE(4),
    [sym_translate_statement] = STATE(4),
    [sym_style_statement] = STATE(4),
    [sym_camera_statement] = STATE(4),
    [sym_layeredimage_statement] = STATE(4),
    [sym_nvl_statement] = STATE(4),
    [sym_string] = STATE(113),
    [aux_sym_source_file_repeat1] = STATE(4),
    [ts_builtin_sym_end] = ACTIONS(79),
    [sym_identifier] = ACTIONS(81),
    [sym_comment] = ACTIONS(84),
    [sym_expression] = ACTIONS(87),
    [anon_sym_label] = ACTIONS(90),
    [anon_sym_hide] = ACTIONS(93),
    [anon_sym_jump] = ACTIONS(96),
    [anon_sym_call] = ACTIONS(99),
    [anon_sym_return] = ACTIONS(102),
    [anon_sym_pass] = ACTIONS(105),
    [anon_sym_menu] = ACTIONS(108),
    [anon_sym_if] = ACTIONS(111),
    [anon_sym_while] = ACTIONS(114),
    [anon_sym_for] = ACTIONS(117),
    [anon_sym_with] = ACTIONS(120),
    [anon_sym_python] = ACTIONS(123),
    [anon_sym_init] = ACTIONS(126),
    [anon_sym_DOLLAR] = ACTIONS(129),
    [anon_sym_define] = ACTIONS(132),
    [anon_sym_default] = ACTIONS(135),
    [anon_sym_image] = ACTIONS(138),
    [anon_sym_scene] = ACTIONS(141),
    [anon_sym_show] = ACTIONS(144),
    [anon_sym_screen] = ACTIONS(147),
    [anon_sym_play] = ACTIONS(150),
    [anon_sym_queue] = ACTIONS(153),
    [anon_sym_stop] = ACTIONS(156),
    [anon_sym_voice] = ACTIONS(159),
    [anon_sym_transform] = ACTIONS(162),
    [anon_sym_translate] = ACTIONS(165),
    [anon_sym_style] = ACTIONS(168),
    [anon_sym_camera] = ACTIONS(171),
    [anon_sym_layeredimage] = ACTIONS(174),
    [anon_sym_nvl] = ACTIONS(177),
    [aux_sym_string_token1] = ACTIONS(180),
    [aux_sym_string_token2] = ACTIONS(180),
  },
  [5] = {
    [sym__statement] = STATE(6),
    [sym__comment_line] = STATE(6),
    [sym_label_statement] = STATE(6),
    [sym_jump_statement] = STATE(6),
    [sym_call_statement] = STATE(6),
    [sym_return_statement] = STATE(6),
    [sym_pass_statement] = STATE(6),
    [sym_menu_statement] = STATE(6),
    [sym_if_statement] = STATE(6),
    [sym_while_statement] = STATE(6),
    [sym_for_statement] = STATE(6),
    [sym_say_statement] = STATE(6),
    [sym_python_statement] = STATE(6),
    [sym_init_python_statement] = STATE(6),
    [sym_dollar_statement] = STATE(6),
    [sym_define_statement] = STATE(6),
    [sym_default_statement] = STATE(6),
    [sym_image_statement] = STATE(6),
    [sym_scene_statement] = STATE(6),
    [sym_show_statement] = STATE(6),
    [sym_show_screen_statement] = STATE(6),
    [sym_hide_screen_statement] = STATE(6),
    [sym_call_screen_statement] = STATE(6),
    [sym_hide_statement] = STATE(6),
    [sym_with_statement] = STATE(6),
    [sym_play_statement] = STATE(6),
    [sym_queue_statement] = STATE(6),
    [sym_stop_statement] = STATE(6),
    [sym_voice_statement] = STATE(6),
    [sym_screen_statement] = STATE(6),
    [sym_transform_statement] = STATE(6),
    [sym_expression_statement] = STATE(6),
    [sym_unknown_statement] = STATE(6),
    [sym_translate_statement] = STATE(6),
    [sym_style_statement] = STATE(6),
    [sym_camera_statement] = STATE(6),
    [sym_layeredimage_statement] = STATE(6),
    [sym_nvl_statement] = STATE(6),
    [sym_string] = STATE(61),
    [aux_sym_source_file_repeat1] = STATE(6),
    [sym_identifier] = ACTIONS(183),
    [sym_comment] = ACTIONS(185),
    [sym_expression] = ACTIONS(187),
    [anon_sym_label] = ACTIONS(189),
    [anon_sym_hide] = ACTIONS(191),
    [anon_sym_jump] = ACTIONS(193),
    [anon_sym_call] = ACTIONS(195),
    [anon_sym_return] = ACTIONS(197),
    [anon_sym_pass] = ACTIONS(199),
    [anon_sym_menu] = ACTIONS(201),
    [anon_sym_if] = ACTIONS(203),
    [anon_sym_while] = ACTIONS(205),
    [anon_sym_for] = ACTIONS(207),
    [anon_sym_with] = ACTIONS(209),
    [anon_sym_python] = ACTIONS(211),
    [anon_sym_init] = ACTIONS(213),
    [anon_sym_DOLLAR] = ACTIONS(215),
    [anon_sym_define] = ACTIONS(217),
    [anon_sym_default] = ACTIONS(219),
    [anon_sym_image] = ACTIONS(221),
    [anon_sym_scene] = ACTIONS(223),
    [anon_sym_show] = ACTIONS(225),
    [anon_sym_screen] = ACTIONS(227),
    [anon_sym_play] = ACTIONS(229),
    [anon_sym_queue] = ACTIONS(231),
    [anon_sym_stop] = ACTIONS(233),
    [anon_sym_voice] = ACTIONS(235),
    [anon_sym_transform] = ACTIONS(237),
    [anon_sym_translate] = ACTIONS(239),
    [anon_sym_style] = ACTIONS(241),
    [anon_sym_camera] = ACTIONS(243),
    [anon_sym_layeredimage] = ACTIONS(245),
    [anon_sym_nvl] = ACTIONS(247),
    [aux_sym_string_token1] = ACTIONS(249),
    [aux_sym_string_token2] = ACTIONS(249),
    [sym__dedent] = ACTIONS(251),
  },
  [6] = {
    [sym__statement] = STATE(6),
    [sym__comment_line] = STATE(6),
    [sym_label_statement] = STATE(6),
    [sym_jump_statement] = STATE(6),
    [sym_call_statement] = STATE(6),
    [sym_return_statement] = STATE(6),
    [sym_pass_statement] = STATE(6),
    [sym_menu_statement] = STATE(6),
    [sym_if_statement] = STATE(6),
    [sym_while_statement] = STATE(6),
    [sym_for_statement] = STATE(6),
    [sym_say_statement] = STATE(6),
    [sym_python_statement] = STATE(6),
    [sym_init_python_statement] = STATE(6),
    [sym_dollar_statement] = STATE(6),
    [sym_define_statement] = STATE(6),
    [sym_default_statement] = STATE(6),
    [sym_image_statement] = STATE(6),
    [sym_scene_statement] = STATE(6),
    [sym_show_statement] = STATE(6),
    [sym_show_screen_statement] = STATE(6),
    [sym_hide_screen_statement] = STATE(6),
    [sym_call_screen_statement] = STATE(6),
    [sym_hide_statement] = STATE(6),
    [sym_with_statement] = STATE(6),
    [sym_play_statement] = STATE(6),
    [sym_queue_statement] = STATE(6),
    [sym_stop_statement] = STATE(6),
    [sym_voice_statement] = STATE(6),
    [sym_screen_statement] = STATE(6),
    [sym_transform_statement] = STATE(6),
    [sym_expression_statement] = STATE(6),
    [sym_unknown_statement] = STATE(6),
    [sym_translate_statement] = STATE(6),
    [sym_style_statement] = STATE(6),
    [sym_camera_statement] = STATE(6),
    [sym_layeredimage_statement] = STATE(6),
    [sym_nvl_statement] = STATE(6),
    [sym_string] = STATE(61),
    [aux_sym_source_file_repeat1] = STATE(6),
    [sym_identifier] = ACTIONS(253),
    [sym_comment] = ACTIONS(256),
    [sym_expression] = ACTIONS(259),
    [anon_sym_label] = ACTIONS(262),
    [anon_sym_hide] = ACTIONS(265),
    [anon_sym_jump] = ACTIONS(268),
    [anon_sym_call] = ACTIONS(271),
    [anon_sym_return] = ACTIONS(274),
    [anon_sym_pass] = ACTIONS(277),
    [anon_sym_menu] = ACTIONS(280),
    [anon_sym_if] = ACTIONS(283),
    [anon_sym_while] = ACTIONS(286),
    [anon_sym_for] = ACTIONS(289),
    [anon_sym_with] = ACTIONS(292),
    [anon_sym_python] = ACTIONS(295),
    [anon_sym_init] = ACTIONS(298),
    [anon_sym_DOLLAR] = ACTIONS(301),
    [anon_sym_define] = ACTIONS(304),
    [anon_sym_default] = ACTIONS(307),
    [anon_sym_image] = ACTIONS(310),
    [anon_sym_scene] = ACTIONS(313),
    [anon_sym_show] = ACTIONS(316),
    [anon_sym_screen] = ACTIONS(319),
    [anon_sym_play] = ACTIONS(322),
    [anon_sym_queue] = ACTIONS(325),
    [anon_sym_stop] = ACTIONS(328),
    [anon_sym_voice] = ACTIONS(331),
    [anon_sym_transform] = ACTIONS(334),
    [anon_sym_translate] = ACTIONS(337),
    [anon_sym_style] = ACTIONS(340),
    [anon_sym_camera] = ACTIONS(343),
    [anon_sym_layeredimage] = ACTIONS(346),
    [anon_sym_nvl] = ACTIONS(349),
    [aux_sym_string_token1] = ACTIONS(352),
    [aux_sym_string_token2] = ACTIONS(352),
    [sym__dedent] = ACTIONS(79),
  },
  [7] = {
    [sym__statement] = STATE(6),
    [sym__comment_line] = STATE(6),
    [sym_label_statement] = STATE(6),
    [sym_jump_statement] = STATE(6),
    [sym_call_statement] = STATE(6),
    [sym_return_statement] = STATE(6),
    [sym_pass_statement] = STATE(6),
    [sym_menu_statement] = STATE(6),
    [sym_if_statement] = STATE(6),
    [sym_while_statement] = STATE(6),
    [sym_for_statement] = STATE(6),
    [sym_say_statement] = STATE(6),
    [sym_python_statement] = STATE(6),
    [sym_init_python_statement] = STATE(6),
    [sym_dollar_statement] = STATE(6),
    [sym_define_statement] = STATE(6),
    [sym_default_statement] = STATE(6),
    [sym_image_statement] = STATE(6),
    [sym_scene_statement] = STATE(6),
    [sym_show_statement] = STATE(6),
    [sym_show_screen_statement] = STATE(6),
    [sym_hide_screen_statement] = STATE(6),
    [sym_call_screen_statement] = STATE(6),
    [sym_hide_statement] = STATE(6),
    [sym_with_statement] = STATE(6),
    [sym_play_statement] = STATE(6),
    [sym_queue_statement] = STATE(6),
    [sym_stop_statement] = STATE(6),
    [sym_voice_statement] = STATE(6),
    [sym_screen_statement] = STATE(6),
    [sym_transform_statement] = STATE(6),
    [sym_expression_statement] = STATE(6),
    [sym_unknown_statement] = STATE(6),
    [sym_translate_statement] = STATE(6),
    [sym_style_statement] = STATE(6),
    [sym_camera_statement] = STATE(6),
    [sym_layeredimage_statement] = STATE(6),
    [sym_nvl_statement] = STATE(6),
    [sym_string] = STATE(61),
    [aux_sym_source_file_repeat1] = STATE(6),
    [sym_identifier] = ACTIONS(183),
    [sym_comment] = ACTIONS(185),
    [sym_expression] = ACTIONS(187),
    [anon_sym_label] = ACTIONS(189),
    [anon_sym_hide] = ACTIONS(191),
    [anon_sym_jump] = ACTIONS(193),
    [anon_sym_call] = ACTIONS(195),
    [anon_sym_return] = ACTIONS(197),
    [anon_sym_pass] = ACTIONS(199),
    [anon_sym_menu] = ACTIONS(201),
    [anon_sym_if] = ACTIONS(203),
    [anon_sym_while] = ACTIONS(205),
    [anon_sym_for] = ACTIONS(207),
    [anon_sym_with] = ACTIONS(209),
    [anon_sym_python] = ACTIONS(211),
    [anon_sym_init] = ACTIONS(213),
    [anon_sym_DOLLAR] = ACTIONS(215),
    [anon_sym_define] = ACTIONS(217),
    [anon_sym_default] = ACTIONS(219),
    [anon_sym_image] = ACTIONS(221),
    [anon_sym_scene] = ACTIONS(223),
    [anon_sym_show] = ACTIONS(225),
    [anon_sym_screen] = ACTIONS(227),
    [anon_sym_play] = ACTIONS(229),
    [anon_sym_queue] = ACTIONS(231),
    [anon_sym_stop] = ACTIONS(233),
    [anon_sym_voice] = ACTIONS(235),
    [anon_sym_transform] = ACTIONS(237),
    [anon_sym_translate] = ACTIONS(239),
    [anon_sym_style] = ACTIONS(241),
    [anon_sym_camera] = ACTIONS(243),
    [anon_sym_layeredimage] = ACTIONS(245),
    [anon_sym_nvl] = ACTIONS(247),
    [aux_sym_string_token1] = ACTIONS(249),
    [aux_sym_string_token2] = ACTIONS(249),
    [sym__dedent] = ACTIONS(355),
  },
  [8] = {
    [sym__statement] = STATE(3),
    [sym__comment_line] = STATE(3),
    [sym_label_statement] = STATE(3),
    [sym_jump_statement] = STATE(3),
    [sym_call_statement] = STATE(3),
    [sym_return_statement] = STATE(3),
    [sym_pass_statement] = STATE(3),
    [sym_menu_statement] = STATE(3),
    [sym_if_statement] = STATE(3),
    [sym_while_statement] = STATE(3),
    [sym_for_statement] = STATE(3),
    [sym_say_statement] = STATE(3),
    [sym_python_statement] = STATE(3),
    [sym_init_python_statement] = STATE(3),
    [sym_dollar_statement] = STATE(3),
    [sym_define_statement] = STATE(3),
    [sym_default_statement] = STATE(3),
    [sym_image_statement] = STATE(3),
    [sym_scene_statement] = STATE(3),
    [sym_show_statement] = STATE(3),
    [sym_show_screen_statement] = STATE(3),
    [sym_hide_screen_statement] = STATE(3),
    [sym_call_screen_statement] = STATE(3),
    [sym_hide_statement] = STATE(3),
    [sym_with_statement] = STATE(3),
    [sym_play_statement] = STATE(3),
    [sym_queue_statement] = STATE(3),
    [sym_stop_statement] = STATE(3),
    [sym_voice_statement] = STATE(3),
    [sym_screen_statement] = STATE(3),
    [sym_transform_statement] = STATE(3),
    [sym_expression_statement] = STATE(3),
    [sym_unknown_statement] = STATE(3),
    [sym_translate_statement] = STATE(3),
    [sym_style_statement] = STATE(3),
    [sym_camera_statement] = STATE(3),
    [sym_layeredimage_statement] = STATE(3),
    [sym_nvl_statement] = STATE(3),
    [sym_string] = STATE(113),
    [aux_sym_source_file_repeat1] = STATE(3),
    [ts_builtin_sym_end] = ACTIONS(75),
    [sym_identifier] = ACTIONS(5),
    [sym_comment] = ACTIONS(7),
    [sym_expression] = ACTIONS(9),
    [anon_sym_label] = ACTIONS(11),
    [anon_sym_hide] = ACTIONS(13),
    [anon_sym_jump] = ACTIONS(15),
    [anon_sym_call] = ACTIONS(17),
    [anon_sym_return] = ACTIONS(19),
    [anon_sym_pass] = ACTIONS(21),
    [anon_sym_menu] = ACTIONS(23),
    [anon_sym_if] = ACTIONS(25),
    [anon_sym_while] = ACTIONS(27),
    [anon_sym_for] = ACTIONS(29),
    [anon_sym_with] = ACTIONS(31),
    [anon_sym_python] = ACTIONS(33),
    [anon_sym_init] = ACTIONS(35),
    [anon_sym_DOLLAR] = ACTIONS(37),
    [anon_sym_define] = ACTIONS(39),
    [anon_sym_default] = ACTIONS(41),
    [anon_sym_image] = ACTIONS(43),
    [anon_sym_scene] = ACTIONS(45),
    [anon_sym_show] = ACTIONS(47),
    [anon_sym_screen] = ACTIONS(49),
    [anon_sym_play] = ACTIONS(51),
    [anon_sym_queue] = ACTIONS(53),
    [anon_sym_stop] = ACTIONS(55),
    [anon_sym_voice] = ACTIONS(57),
    [anon_sym_transform] = ACTIONS(59),
    [anon_sym_translate] = ACTIONS(61),
    [anon_sym_style] = ACTIONS(63),
    [anon_sym_camera] = ACTIONS(65),
    [anon_sym_layeredimage] = ACTIONS(67),
    [anon_sym_nvl] = ACTIONS(69),
    [aux_sym_string_token1] = ACTIONS(71),
    [aux_sym_string_token2] = ACTIONS(71),
  },
  [9] = {
    [sym__statement] = STATE(6),
    [sym__comment_line] = STATE(6),
    [sym_label_statement] = STATE(6),
    [sym_jump_statement] = STATE(6),
    [sym_call_statement] = STATE(6),
    [sym_return_statement] = STATE(6),
    [sym_pass_statement] = STATE(6),
    [sym_menu_statement] = STATE(6),
    [sym_if_statement] = STATE(6),
    [sym_while_statement] = STATE(6),
    [sym_for_statement] = STATE(6),
    [sym_say_statement] = STATE(6),
    [sym_python_statement] = STATE(6),
    [sym_init_python_statement] = STATE(6),
    [sym_dollar_statement] = STATE(6),
    [sym_define_statement] = STATE(6),
    [sym_default_statement] = STATE(6),
    [sym_image_statement] = STATE(6),
    [sym_scene_statement] = STATE(6),
    [sym_show_statement] = STATE(6),
    [sym_show_screen_statement] = STATE(6),
    [sym_hide_screen_statement] = STATE(6),
    [sym_call_screen_statement] = STATE(6),
    [sym_hide_statement] = STATE(6),
    [sym_with_statement] = STATE(6),
    [sym_play_statement] = STATE(6),
    [sym_queue_statement] = STATE(6),
    [sym_stop_statement] = STATE(6),
    [sym_voice_statement] = STATE(6),
    [sym_screen_statement] = STATE(6),
    [sym_transform_statement] = STATE(6),
    [sym_expression_statement] = STATE(6),
    [sym_unknown_statement] = STATE(6),
    [sym_translate_statement] = STATE(6),
    [sym_style_statement] = STATE(6),
    [sym_camera_statement] = STATE(6),
    [sym_layeredimage_statement] = STATE(6),
    [sym_nvl_statement] = STATE(6),
    [sym_string] = STATE(61),
    [aux_sym_source_file_repeat1] = STATE(6),
    [sym_identifier] = ACTIONS(183),
    [sym_comment] = ACTIONS(185),
    [sym_expression] = ACTIONS(187),
    [anon_sym_label] = ACTIONS(189),
    [anon_sym_hide] = ACTIONS(191),
    [anon_sym_jump] = ACTIONS(193),
    [anon_sym_call] = ACTIONS(195),
    [anon_sym_return] = ACTIONS(197),
    [anon_sym_pass] = ACTIONS(199),
    [anon_sym_menu] = ACTIONS(201),
    [anon_sym_if] = ACTIONS(203),
    [anon_sym_while] = ACTIONS(205),
    [anon_sym_for] = ACTIONS(207),
    [anon_sym_with] = ACTIONS(209),
    [anon_sym_python] = ACTIONS(211),
    [anon_sym_init] = ACTIONS(213),
    [anon_sym_DOLLAR] = ACTIONS(215),
    [anon_sym_define] = ACTIONS(217),
    [anon_sym_default] = ACTIONS(219),
    [anon_sym_image] = ACTIONS(221),
    [anon_sym_scene] = ACTIONS(223),
    [anon_sym_show] = ACTIONS(225),
    [anon_sym_screen] = ACTIONS(227),
    [anon_sym_play] = ACTIONS(229),
    [anon_sym_queue] = ACTIONS(231),
    [anon_sym_stop] = ACTIONS(233),
    [anon_sym_voice] = ACTIONS(235),
    [anon_sym_transform] = ACTIONS(237),
    [anon_sym_translate] = ACTIONS(239),
    [anon_sym_style] = ACTIONS(241),
    [anon_sym_camera] = ACTIONS(243),
    [anon_sym_layeredimage] = ACTIONS(245),
    [anon_sym_nvl] = ACTIONS(247),
    [aux_sym_string_token1] = ACTIONS(249),
    [aux_sym_string_token2] = ACTIONS(249),
    [sym__dedent] = ACTIONS(357),
  },
  [10] = {
    [sym__statement] = STATE(6),
    [sym__comment_line] = STATE(6),
    [sym_label_statement] = STATE(6),
    [sym_jump_statement] = STATE(6),
    [sym_call_statement] = STATE(6),
    [sym_return_statement] = STATE(6),
    [sym_pass_statement] = STATE(6),
    [sym_menu_statement] = STATE(6),
    [sym_if_statement] = STATE(6),
    [sym_while_statement] = STATE(6),
    [sym_for_statement] = STATE(6),
    [sym_say_statement] = STATE(6),
    [sym_python_statement] = STATE(6),
    [sym_init_python_statement] = STATE(6),
    [sym_dollar_statement] = STATE(6),
    [sym_define_statement] = STATE(6),
    [sym_default_statement] = STATE(6),
    [sym_image_statement] = STATE(6),
    [sym_scene_statement] = STATE(6),
    [sym_show_statement] = STATE(6),
    [sym_show_screen_statement] = STATE(6),
    [sym_hide_screen_statement] = STATE(6),
    [sym_call_screen_statement] = STATE(6),
    [sym_hide_statement] = STATE(6),
    [sym_with_statement] = STATE(6),
    [sym_play_statement] = STATE(6),
    [sym_queue_statement] = STATE(6),
    [sym_stop_statement] = STATE(6),
    [sym_voice_statement] = STATE(6),
    [sym_screen_statement] = STATE(6),
    [sym_transform_statement] = STATE(6),
    [sym_expression_statement] = STATE(6),
    [sym_unknown_statement] = STATE(6),
    [sym_translate_statement] = STATE(6),
    [sym_style_statement] = STATE(6),
    [sym_camera_statement] = STATE(6),
    [sym_layeredimage_statement] = STATE(6),
    [sym_nvl_statement] = STATE(6),
    [sym_string] = STATE(61),
    [aux_sym_source_file_repeat1] = STATE(6),
    [sym_identifier] = ACTIONS(183),
    [sym_comment] = ACTIONS(185),
    [sym_expression] = ACTIONS(187),
    [anon_sym_label] = ACTIONS(189),
    [anon_sym_hide] = ACTIONS(191),
    [anon_sym_jump] = ACTIONS(193),
    [anon_sym_call] = ACTIONS(195),
    [anon_sym_return] = ACTIONS(197),
    [anon_sym_pass] = ACTIONS(199),
    [anon_sym_menu] = ACTIONS(201),
    [anon_sym_if] = ACTIONS(203),
    [anon_sym_while] = ACTIONS(205),
    [anon_sym_for] = ACTIONS(207),
    [anon_sym_with] = ACTIONS(209),
    [anon_sym_python] = ACTIONS(211),
    [anon_sym_init] = ACTIONS(213),
    [anon_sym_DOLLAR] = ACTIONS(215),
    [anon_sym_define] = ACTIONS(217),
    [anon_sym_default] = ACTIONS(219),
    [anon_sym_image] = ACTIONS(221),
    [anon_sym_scene] = ACTIONS(223),
    [anon_sym_show] = ACTIONS(225),
    [anon_sym_screen] = ACTIONS(227),
    [anon_sym_play] = ACTIONS(229),
    [anon_sym_queue] = ACTIONS(231),
    [anon_sym_stop] = ACTIONS(233),
    [anon_sym_voice] = ACTIONS(235),
    [anon_sym_transform] = ACTIONS(237),
    [anon_sym_translate] = ACTIONS(239),
    [anon_sym_style] = ACTIONS(241),
    [anon_sym_camera] = ACTIONS(243),
    [anon_sym_layeredimage] = ACTIONS(245),
    [anon_sym_nvl] = ACTIONS(247),
    [aux_sym_string_token1] = ACTIONS(249),
    [aux_sym_string_token2] = ACTIONS(249),
    [sym__dedent] = ACTIONS(359),
  },
  [11] = {
    [sym__statement] = STATE(6),
    [sym__comment_line] = STATE(6),
    [sym_label_statement] = STATE(6),
    [sym_jump_statement] = STATE(6),
    [sym_call_statement] = STATE(6),
    [sym_return_statement] = STATE(6),
    [sym_pass_statement] = STATE(6),
    [sym_menu_statement] = STATE(6),
    [sym_if_statement] = STATE(6),
    [sym_while_statement] = STATE(6),
    [sym_for_statement] = STATE(6),
    [sym_say_statement] = STATE(6),
    [sym_python_statement] = STATE(6),
    [sym_init_python_statement] = STATE(6),
    [sym_dollar_statement] = STATE(6),
    [sym_define_statement] = STATE(6),
    [sym_default_statement] = STATE(6),
    [sym_image_statement] = STATE(6),
    [sym_scene_statement] = STATE(6),
    [sym_show_statement] = STATE(6),
    [sym_show_screen_statement] = STATE(6),
    [sym_hide_screen_statement] = STATE(6),
    [sym_call_screen_statement] = STATE(6),
    [sym_hide_statement] = STATE(6),
    [sym_with_statement] = STATE(6),
    [sym_play_statement] = STATE(6),
    [sym_queue_statement] = STATE(6),
    [sym_stop_statement] = STATE(6),
    [sym_voice_statement] = STATE(6),
    [sym_screen_statement] = STATE(6),
    [sym_transform_statement] = STATE(6),
    [sym_expression_statement] = STATE(6),
    [sym_unknown_statement] = STATE(6),
    [sym_translate_statement] = STATE(6),
    [sym_style_statement] = STATE(6),
    [sym_camera_statement] = STATE(6),
    [sym_layeredimage_statement] = STATE(6),
    [sym_nvl_statement] = STATE(6),
    [sym_string] = STATE(61),
    [aux_sym_source_file_repeat1] = STATE(6),
    [sym_identifier] = ACTIONS(183),
    [sym_comment] = ACTIONS(185),
    [sym_expression] = ACTIONS(187),
    [anon_sym_label] = ACTIONS(189),
    [anon_sym_hide] = ACTIONS(191),
    [anon_sym_jump] = ACTIONS(193),
    [anon_sym_call] = ACTIONS(195),
    [anon_sym_return] = ACTIONS(197),
    [anon_sym_pass] = ACTIONS(199),
    [anon_sym_menu] = ACTIONS(201),
    [anon_sym_if] = ACTIONS(203),
    [anon_sym_while] = ACTIONS(205),
    [anon_sym_for] = ACTIONS(207),
    [anon_sym_with] = ACTIONS(209),
    [anon_sym_python] = ACTIONS(211),
    [anon_sym_init] = ACTIONS(213),
    [anon_sym_DOLLAR] = ACTIONS(215),
    [anon_sym_define] = ACTIONS(217),
    [anon_sym_default] = ACTIONS(219),
    [anon_sym_image] = ACTIONS(221),
    [anon_sym_scene] = ACTIONS(223),
    [anon_sym_show] = ACTIONS(225),
    [anon_sym_screen] = ACTIONS(227),
    [anon_sym_play] = ACTIONS(229),
    [anon_sym_queue] = ACTIONS(231),
    [anon_sym_stop] = ACTIONS(233),
    [anon_sym_voice] = ACTIONS(235),
    [anon_sym_transform] = ACTIONS(237),
    [anon_sym_translate] = ACTIONS(239),
    [anon_sym_style] = ACTIONS(241),
    [anon_sym_camera] = ACTIONS(243),
    [anon_sym_layeredimage] = ACTIONS(245),
    [anon_sym_nvl] = ACTIONS(247),
    [aux_sym_string_token1] = ACTIONS(249),
    [aux_sym_string_token2] = ACTIONS(249),
    [sym__dedent] = ACTIONS(361),
  },
  [12] = {
    [sym__statement] = STATE(5),
    [sym__comment_line] = STATE(5),
    [sym_label_statement] = STATE(5),
    [sym_jump_statement] = STATE(5),
    [sym_call_statement] = STATE(5),
    [sym_return_statement] = STATE(5),
    [sym_pass_statement] = STATE(5),
    [sym_menu_statement] = STATE(5),
    [sym_if_statement] = STATE(5),
    [sym_while_statement] = STATE(5),
    [sym_for_statement] = STATE(5),
    [sym_say_statement] = STATE(5),
    [sym_python_statement] = STATE(5),
    [sym_init_python_statement] = STATE(5),
    [sym_dollar_statement] = STATE(5),
    [sym_define_statement] = STATE(5),
    [sym_default_statement] = STATE(5),
    [sym_image_statement] = STATE(5),
    [sym_scene_statement] = STATE(5),
    [sym_show_statement] = STATE(5),
    [sym_show_screen_statement] = STATE(5),
    [sym_hide_screen_statement] = STATE(5),
    [sym_call_screen_statement] = STATE(5),
    [sym_hide_statement] = STATE(5),
    [sym_with_statement] = STATE(5),
    [sym_play_statement] = STATE(5),
    [sym_queue_statement] = STATE(5),
    [sym_stop_statement] = STATE(5),
    [sym_voice_statement] = STATE(5),
    [sym_screen_statement] = STATE(5),
    [sym_transform_statement] = STATE(5),
    [sym_expression_statement] = STATE(5),
    [sym_unknown_statement] = STATE(5),
    [sym_translate_statement] = STATE(5),
    [sym_style_statement] = STATE(5),
    [sym_camera_statement] = STATE(5),
    [sym_layeredimage_statement] = STATE(5),
    [sym_nvl_statement] = STATE(5),
    [sym_string] = STATE(61),
    [aux_sym_source_file_repeat1] = STATE(5),
    [sym_identifier] = ACTIONS(183),
    [sym_comment] = ACTIONS(185),
    [sym_expression] = ACTIONS(187),
    [anon_sym_label] = ACTIONS(189),
    [anon_sym_hide] = ACTIONS(191),
    [anon_sym_jump] = ACTIONS(193),
    [anon_sym_call] = ACTIONS(195),
    [anon_sym_return] = ACTIONS(197),
    [anon_sym_pass] = ACTIONS(199),
    [anon_sym_menu] = ACTIONS(201),
    [anon_sym_if] = ACTIONS(203),
    [anon_sym_while] = ACTIONS(205),
    [anon_sym_for] = ACTIONS(207),
    [anon_sym_with] = ACTIONS(209),
    [anon_sym_python] = ACTIONS(211),
    [anon_sym_init] = ACTIONS(213),
    [anon_sym_DOLLAR] = ACTIONS(215),
    [anon_sym_define] = ACTIONS(217),
    [anon_sym_default] = ACTIONS(219),
    [anon_sym_image] = ACTIONS(221),
    [anon_sym_scene] = ACTIONS(223),
    [anon_sym_show] = ACTIONS(225),
    [anon_sym_screen] = ACTIONS(227),
    [anon_sym_play] = ACTIONS(229),
    [anon_sym_queue] = ACTIONS(231),
    [anon_sym_stop] = ACTIONS(233),
    [anon_sym_voice] = ACTIONS(235),
    [anon_sym_transform] = ACTIONS(237),
    [anon_sym_translate] = ACTIONS(239),
    [anon_sym_style] = ACTIONS(241),
    [anon_sym_camera] = ACTIONS(243),
    [anon_sym_layeredimage] = ACTIONS(245),
    [anon_sym_nvl] = ACTIONS(247),
    [aux_sym_string_token1] = ACTIONS(249),
    [aux_sym_string_token2] = ACTIONS(249),
  },
  [13] = {
    [sym__statement] = STATE(10),
    [sym__comment_line] = STATE(10),
    [sym_label_statement] = STATE(10),
    [sym_jump_statement] = STATE(10),
    [sym_call_statement] = STATE(10),
    [sym_return_statement] = STATE(10),
    [sym_pass_statement] = STATE(10),
    [sym_menu_statement] = STATE(10),
    [sym_if_statement] = STATE(10),
    [sym_while_statement] = STATE(10),
    [sym_for_statement] = STATE(10),
    [sym_say_statement] = STATE(10),
    [sym_python_statement] = STATE(10),
    [sym_init_python_statement] = STATE(10),
    [sym_dollar_statement] = STATE(10),
    [sym_define_statement] = STATE(10),
    [sym_default_statement] = STATE(10),
    [sym_image_statement] = STATE(10),
    [sym_scene_statement] = STATE(10),
    [sym_show_statement] = STATE(10),
    [sym_show_screen_statement] = STATE(10),
    [sym_hide_screen_statement] = STATE(10),
    [sym_call_screen_statement] = STATE(10),
    [sym_hide_statement] = STATE(10),
    [sym_with_statement] = STATE(10),
    [sym_play_statement] = STATE(10),
    [sym_queue_statement] = STATE(10),
    [sym_stop_statement] = STATE(10),
    [sym_voice_statement] = STATE(10),
    [sym_screen_statement] = STATE(10),
    [sym_transform_statement] = STATE(10),
    [sym_expression_statement] = STATE(10),
    [sym_unknown_statement] = STATE(10),
    [sym_translate_statement] = STATE(10),
    [sym_style_statement] = STATE(10),
    [sym_camera_statement] = STATE(10),
    [sym_layeredimage_statement] = STATE(10),
    [sym_nvl_statement] = STATE(10),
    [sym_string] = STATE(61),
    [aux_sym_source_file_repeat1] = STATE(10),
    [sym_identifier] = ACTIONS(183),
    [sym_comment] = ACTIONS(185),
    [sym_expression] = ACTIONS(187),
    [anon_sym_label] = ACTIONS(189),
    [anon_sym_hide] = ACTIONS(191),
    [anon_sym_jump] = ACTIONS(193),
    [anon_sym_call] = ACTIONS(195),
    [anon_sym_return] = ACTIONS(197),
    [anon_sym_pass] = ACTIONS(199),
    [anon_sym_menu] = ACTIONS(201),
    [anon_sym_if] = ACTIONS(203),
    [anon_sym_while] = ACTIONS(205),
    [anon_sym_for] = ACTIONS(207),
    [anon_sym_with] = ACTIONS(209),
    [anon_sym_python] = ACTIONS(211),
    [anon_sym_init] = ACTIONS(213),
    [anon_sym_DOLLAR] = ACTIONS(215),
    [anon_sym_define] = ACTIONS(217),
    [anon_sym_default] = ACTIONS(219),
    [anon_sym_image] = ACTIONS(221),
    [anon_sym_scene] = ACTIONS(223),
    [anon_sym_show] = ACTIONS(225),
    [anon_sym_screen] = ACTIONS(227),
    [anon_sym_play] = ACTIONS(229),
    [anon_sym_queue] = ACTIONS(231),
    [anon_sym_stop] = ACTIONS(233),
    [anon_sym_voice] = ACTIONS(235),
    [anon_sym_transform] = ACTIONS(237),
    [anon_sym_translate] = ACTIONS(239),
    [anon_sym_style] = ACTIONS(241),
    [anon_sym_camera] = ACTIONS(243),
    [anon_sym_layeredimage] = ACTIONS(245),
    [anon_sym_nvl] = ACTIONS(247),
    [aux_sym_string_token1] = ACTIONS(249),
    [aux_sym_string_token2] = ACTIONS(249),
  },
  [14] = {
    [sym__statement] = STATE(11),
    [sym__comment_line] = STATE(11),
    [sym_label_statement] = STATE(11),
    [sym_jump_statement] = STATE(11),
    [sym_call_statement] = STATE(11),
    [sym_return_statement] = STATE(11),
    [sym_pass_statement] = STATE(11),
    [sym_menu_statement] = STATE(11),
    [sym_if_statement] = STATE(11),
    [sym_while_statement] = STATE(11),
    [sym_for_statement] = STATE(11),
    [sym_say_statement] = STATE(11),
    [sym_python_statement] = STATE(11),
    [sym_init_python_statement] = STATE(11),
    [sym_dollar_statement] = STATE(11),
    [sym_define_statement] = STATE(11),
    [sym_default_statement] = STATE(11),
    [sym_image_statement] = STATE(11),
    [sym_scene_statement] = STATE(11),
    [sym_show_statement] = STATE(11),
    [sym_show_screen_statement] = STATE(11),
    [sym_hide_screen_statement] = STATE(11),
    [sym_call_screen_statement] = STATE(11),
    [sym_hide_statement] = STATE(11),
    [sym_with_statement] = STATE(11),
    [sym_play_statement] = STATE(11),
    [sym_queue_statement] = STATE(11),
    [sym_stop_statement] = STATE(11),
    [sym_voice_statement] = STATE(11),
    [sym_screen_statement] = STATE(11),
    [sym_transform_statement] = STATE(11),
    [sym_expression_statement] = STATE(11),
    [sym_unknown_statement] = STATE(11),
    [sym_translate_statement] = STATE(11),
    [sym_style_statement] = STATE(11),
    [sym_camera_statement] = STATE(11),
    [sym_layeredimage_statement] = STATE(11),
    [sym_nvl_statement] = STATE(11),
    [sym_string] = STATE(61),
    [aux_sym_source_file_repeat1] = STATE(11),
    [sym_identifier] = ACTIONS(183),
    [sym_comment] = ACTIONS(185),
    [sym_expression] = ACTIONS(187),
    [anon_sym_label] = ACTIONS(189),
    [anon_sym_hide] = ACTIONS(191),
    [anon_sym_jump] = ACTIONS(193),
    [anon_sym_call] = ACTIONS(195),
    [anon_sym_return] = ACTIONS(197),
    [anon_sym_pass] = ACTIONS(199),
    [anon_sym_menu] = ACTIONS(201),
    [anon_sym_if] = ACTIONS(203),
    [anon_sym_while] = ACTIONS(205),
    [anon_sym_for] = ACTIONS(207),
    [anon_sym_with] = ACTIONS(209),
    [anon_sym_python] = ACTIONS(211),
    [anon_sym_init] = ACTIONS(213),
    [anon_sym_DOLLAR] = ACTIONS(215),
    [anon_sym_define] = ACTIONS(217),
    [anon_sym_default] = ACTIONS(219),
    [anon_sym_image] = ACTIONS(221),
    [anon_sym_scene] = ACTIONS(223),
    [anon_sym_show] = ACTIONS(225),
    [anon_sym_screen] = ACTIONS(227),
    [anon_sym_play] = ACTIONS(229),
    [anon_sym_queue] = ACTIONS(231),
    [anon_sym_stop] = ACTIONS(233),
    [anon_sym_voice] = ACTIONS(235),
    [anon_sym_transform] = ACTIONS(237),
    [anon_sym_translate] = ACTIONS(239),
    [anon_sym_style] = ACTIONS(241),
    [anon_sym_camera] = ACTIONS(243),
    [anon_sym_layeredimage] = ACTIONS(245),
    [anon_sym_nvl] = ACTIONS(247),
    [aux_sym_string_token1] = ACTIONS(249),
    [aux_sym_string_token2] = ACTIONS(249),
  },
  [15] = {
    [sym__statement] = STATE(9),
    [sym__comment_line] = STATE(9),
    [sym_label_statement] = STATE(9),
    [sym_jump_statement] = STATE(9),
    [sym_call_statement] = STATE(9),
    [sym_return_statement] = STATE(9),
    [sym_pass_statement] = STATE(9),
    [sym_menu_statement] = STATE(9),
    [sym_if_statement] = STATE(9),
    [sym_while_statement] = STATE(9),
    [sym_for_statement] = STATE(9),
    [sym_say_statement] = STATE(9),
    [sym_python_statement] = STATE(9),
    [sym_init_python_statement] = STATE(9),
    [sym_dollar_statement] = STATE(9),
    [sym_define_statement] = STATE(9),
    [sym_default_statement] = STATE(9),
    [sym_image_statement] = STATE(9),
    [sym_scene_statement] = STATE(9),
    [sym_show_statement] = STATE(9),
    [sym_show_screen_statement] = STATE(9),
    [sym_hide_screen_statement] = STATE(9),
    [sym_call_screen_statement] = STATE(9),
    [sym_hide_statement] = STATE(9),
    [sym_with_statement] = STATE(9),
    [sym_play_statement] = STATE(9),
    [sym_queue_statement] = STATE(9),
    [sym_stop_statement] = STATE(9),
    [sym_voice_statement] = STATE(9),
    [sym_screen_statement] = STATE(9),
    [sym_transform_statement] = STATE(9),
    [sym_expression_statement] = STATE(9),
    [sym_unknown_statement] = STATE(9),
    [sym_translate_statement] = STATE(9),
    [sym_style_statement] = STATE(9),
    [sym_camera_statement] = STATE(9),
    [sym_layeredimage_statement] = STATE(9),
    [sym_nvl_statement] = STATE(9),
    [sym_string] = STATE(61),
    [aux_sym_source_file_repeat1] = STATE(9),
    [sym_identifier] = ACTIONS(183),
    [sym_comment] = ACTIONS(185),
    [sym_expression] = ACTIONS(187),
    [anon_sym_label] = ACTIONS(189),
    [anon_sym_hide] = ACTIONS(191),
    [anon_sym_jump] = ACTIONS(193),
    [anon_sym_call] = ACTIONS(195),
    [anon_sym_return] = ACTIONS(197),
    [anon_sym_pass] = ACTIONS(199),
    [anon_sym_menu] = ACTIONS(201),
    [anon_sym_if] = ACTIONS(203),
    [anon_sym_while] = ACTIONS(205),
    [anon_sym_for] = ACTIONS(207),
    [anon_sym_with] = ACTIONS(209),
    [anon_sym_python] = ACTIONS(211),
    [anon_sym_init] = ACTIONS(213),
    [anon_sym_DOLLAR] = ACTIONS(215),
    [anon_sym_define] = ACTIONS(217),
    [anon_sym_default] = ACTIONS(219),
    [anon_sym_image] = ACTIONS(221),
    [anon_sym_scene] = ACTIONS(223),
    [anon_sym_show] = ACTIONS(225),
    [anon_sym_screen] = ACTIONS(227),
    [anon_sym_play] = ACTIONS(229),
    [anon_sym_queue] = ACTIONS(231),
    [anon_sym_stop] = ACTIONS(233),
    [anon_sym_voice] = ACTIONS(235),
    [anon_sym_transform] = ACTIONS(237),
    [anon_sym_translate] = ACTIONS(239),
    [anon_sym_style] = ACTIONS(241),
    [anon_sym_camera] = ACTIONS(243),
    [anon_sym_layeredimage] = ACTIONS(245),
    [anon_sym_nvl] = ACTIONS(247),
    [aux_sym_string_token1] = ACTIONS(249),
    [aux_sym_string_token2] = ACTIONS(249),
  },
  [16] = {
    [sym__statement] = STATE(7),
    [sym__comment_line] = STATE(7),
    [sym_label_statement] = STATE(7),
    [sym_jump_statement] = STATE(7),
    [sym_call_statement] = STATE(7),
    [sym_return_statement] = STATE(7),
    [sym_pass_statement] = STATE(7),
    [sym_menu_statement] = STATE(7),
    [sym_if_statement] = STATE(7),
    [sym_while_statement] = STATE(7),
    [sym_for_statement] = STATE(7),
    [sym_say_statement] = STATE(7),
    [sym_python_statement] = STATE(7),
    [sym_init_python_statement] = STATE(7),
    [sym_dollar_statement] = STATE(7),
    [sym_define_statement] = STATE(7),
    [sym_default_statement] = STATE(7),
    [sym_image_statement] = STATE(7),
    [sym_scene_statement] = STATE(7),
    [sym_show_statement] = STATE(7),
    [sym_show_screen_statement] = STATE(7),
    [sym_hide_screen_statement] = STATE(7),
    [sym_call_screen_statement] = STATE(7),
    [sym_hide_statement] = STATE(7),
    [sym_with_statement] = STATE(7),
    [sym_play_statement] = STATE(7),
    [sym_queue_statement] = STATE(7),
    [sym_stop_statement] = STATE(7),
    [sym_voice_statement] = STATE(7),
    [sym_screen_statement] = STATE(7),
    [sym_transform_statement] = STATE(7),
    [sym_expression_statement] = STATE(7),
    [sym_unknown_statement] = STATE(7),
    [sym_translate_statement] = STATE(7),
    [sym_style_statement] = STATE(7),
    [sym_camera_statement] = STATE(7),
    [sym_layeredimage_statement] = STATE(7),
    [sym_nvl_statement] = STATE(7),
    [sym_string] = STATE(61),
    [aux_sym_source_file_repeat1] = STATE(7),
    [sym_identifier] = ACTIONS(183),
    [sym_comment] = ACTIONS(185),
    [sym_expression] = ACTIONS(187),
    [anon_sym_label] = ACTIONS(189),
    [anon_sym_hide] = ACTIONS(191),
    [anon_sym_jump] = ACTIONS(193),
    [anon_sym_call] = ACTIONS(195),
    [anon_sym_return] = ACTIONS(197),
    [anon_sym_pass] = ACTIONS(199),
    [anon_sym_menu] = ACTIONS(201),
    [anon_sym_if] = ACTIONS(203),
    [anon_sym_while] = ACTIONS(205),
    [anon_sym_for] = ACTIONS(207),
    [anon_sym_with] = ACTIONS(209),
    [anon_sym_python] = ACTIONS(211),
    [anon_sym_init] = ACTIONS(213),
    [anon_sym_DOLLAR] = ACTIONS(215),
    [anon_sym_define] = ACTIONS(217),
    [anon_sym_default] = ACTIONS(219),
    [anon_sym_image] = ACTIONS(221),
    [anon_sym_scene] = ACTIONS(223),
    [anon_sym_show] = ACTIONS(225),
    [anon_sym_screen] = ACTIONS(227),
    [anon_sym_play] = ACTIONS(229),
    [anon_sym_queue] = ACTIONS(231),
    [anon_sym_stop] = ACTIONS(233),
    [anon_sym_voice] = ACTIONS(235),
    [anon_sym_transform] = ACTIONS(237),
    [anon_sym_translate] = ACTIONS(239),
    [anon_sym_style] = ACTIONS(241),
    [anon_sym_camera] = ACTIONS(243),
    [anon_sym_layeredimage] = ACTIONS(245),
    [anon_sym_nvl] = ACTIONS(247),
    [aux_sym_string_token1] = ACTIONS(249),
    [aux_sym_string_token2] = ACTIONS(249),
  },
};

static const uint16_t ts_small_parse_table[] = {
  [0] = 6,
    ACTIONS(367), 1,
      anon_sym_elif,
    ACTIONS(369), 1,
      anon_sym_else,
    STATE(294), 1,
      sym_else_clause,
    STATE(21), 2,
      sym_elif_clause,
      aux_sym_if_statement_repeat1,
    ACTIONS(363), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(365), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [54] = 6,
    ACTIONS(367), 1,
      anon_sym_elif,
    ACTIONS(369), 1,
      anon_sym_else,
    STATE(201), 1,
      sym_else_clause,
    STATE(17), 2,
      sym_elif_clause,
      aux_sym_if_statement_repeat1,
    ACTIONS(371), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(373), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [108] = 6,
    ACTIONS(375), 1,
      anon_sym_elif,
    ACTIONS(377), 1,
      anon_sym_else,
    STATE(255), 1,
      sym_else_clause,
    STATE(20), 2,
      sym_elif_clause,
      aux_sym_if_statement_repeat1,
    ACTIONS(371), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(373), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [162] = 6,
    ACTIONS(375), 1,
      anon_sym_elif,
    ACTIONS(377), 1,
      anon_sym_else,
    STATE(285), 1,
      sym_else_clause,
    STATE(22), 2,
      sym_elif_clause,
      aux_sym_if_statement_repeat1,
    ACTIONS(363), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(365), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [216] = 4,
    ACTIONS(383), 1,
      anon_sym_elif,
    STATE(21), 2,
      sym_elif_clause,
      aux_sym_if_statement_repeat1,
    ACTIONS(379), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(381), 32,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_else,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [265] = 4,
    ACTIONS(386), 1,
      anon_sym_elif,
    STATE(22), 2,
      sym_elif_clause,
      aux_sym_if_statement_repeat1,
    ACTIONS(379), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(381), 32,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_else,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [314] = 3,
    ACTIONS(393), 1,
      sym__indent,
    ACTIONS(391), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(389), 33,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_else,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [360] = 3,
    ACTIONS(399), 1,
      sym__newline,
    ACTIONS(395), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(397), 33,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_else,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [406] = 2,
    ACTIONS(401), 6,
      sym__newline,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(403), 33,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_else,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [450] = 3,
    ACTIONS(409), 1,
      sym_comment,
    ACTIONS(405), 5,
      sym__newline,
      ts_builtin_sym_end,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(407), 33,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_else,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [496] = 3,
    ACTIONS(411), 1,
      sym__indent,
    ACTIONS(391), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(389), 33,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_else,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [542] = 3,
    ACTIONS(413), 1,
      sym_comment,
    ACTIONS(405), 5,
      sym__newline,
      sym__dedent,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(407), 33,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_else,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [588] = 3,
    ACTIONS(415), 1,
      sym__newline,
    ACTIONS(395), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(397), 33,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_else,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [634] = 2,
    ACTIONS(401), 6,
      sym__newline,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(403), 33,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_else,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [678] = 2,
    ACTIONS(417), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(419), 33,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_else,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [721] = 2,
    ACTIONS(421), 7,
      sym__newline,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_COLON,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(423), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [764] = 2,
    ACTIONS(427), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(425), 33,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_else,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [807] = 2,
    ACTIONS(427), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(425), 33,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_else,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [850] = 2,
    ACTIONS(417), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(419), 33,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_else,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [893] = 3,
    ACTIONS(433), 1,
      sym__newline,
    ACTIONS(431), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(429), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [937] = 3,
    ACTIONS(439), 1,
      sym__newline,
    ACTIONS(435), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(437), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [981] = 3,
    ACTIONS(445), 1,
      sym__newline,
    ACTIONS(441), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(443), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1025] = 3,
    ACTIONS(451), 1,
      sym__newline,
    ACTIONS(447), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(449), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1069] = 3,
    ACTIONS(453), 1,
      sym_python_block,
    ACTIONS(447), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(449), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1113] = 3,
    ACTIONS(459), 1,
      sym__indent,
    ACTIONS(455), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(457), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1157] = 3,
    ACTIONS(465), 1,
      sym__newline,
    ACTIONS(461), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(463), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1201] = 3,
    ACTIONS(471), 1,
      sym_python_block,
    ACTIONS(467), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(469), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1245] = 3,
    ACTIONS(477), 1,
      sym__newline,
    ACTIONS(473), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(475), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1289] = 3,
    ACTIONS(483), 1,
      sym__newline,
    ACTIONS(479), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(481), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1333] = 3,
    ACTIONS(489), 1,
      sym_python_block,
    ACTIONS(485), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(487), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1377] = 3,
    ACTIONS(495), 1,
      sym_python_block,
    ACTIONS(491), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(493), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1421] = 3,
    ACTIONS(501), 1,
      sym_python_block,
    ACTIONS(497), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(499), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1465] = 3,
    ACTIONS(507), 1,
      sym__newline,
    ACTIONS(503), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(505), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1509] = 3,
    ACTIONS(509), 1,
      sym__newline,
    ACTIONS(497), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(499), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1553] = 3,
    ACTIONS(515), 1,
      sym_python_block,
    ACTIONS(511), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(513), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1597] = 3,
    ACTIONS(521), 1,
      sym_python_block,
    ACTIONS(517), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(519), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1641] = 3,
    ACTIONS(527), 1,
      sym__newline,
    ACTIONS(523), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(525), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1685] = 3,
    ACTIONS(533), 1,
      sym__newline,
    ACTIONS(529), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(531), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1729] = 3,
    ACTIONS(539), 1,
      sym_python_block,
    ACTIONS(535), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(537), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1773] = 3,
    ACTIONS(545), 1,
      sym_python_block,
    ACTIONS(541), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(543), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1817] = 3,
    ACTIONS(551), 1,
      sym_python_block,
    ACTIONS(547), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(549), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1861] = 3,
    ACTIONS(557), 1,
      sym_python_block,
    ACTIONS(553), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(555), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1905] = 3,
    ACTIONS(563), 1,
      sym__newline,
    ACTIONS(559), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(561), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1949] = 3,
    ACTIONS(569), 1,
      sym_python_block,
    ACTIONS(565), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(567), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1993] = 4,
    ACTIONS(575), 1,
      anon_sym_with,
    ACTIONS(578), 1,
      sym__newline,
    ACTIONS(573), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(571), 30,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2039] = 3,
    ACTIONS(580), 1,
      sym_python_block,
    ACTIONS(461), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(463), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2083] = 3,
    ACTIONS(582), 1,
      sym__newline,
    ACTIONS(431), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(429), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2127] = 4,
    ACTIONS(588), 1,
      anon_sym_with,
    ACTIONS(591), 1,
      sym__newline,
    ACTIONS(586), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(584), 30,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2173] = 3,
    ACTIONS(597), 1,
      sym__newline,
    ACTIONS(595), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(593), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2217] = 3,
    ACTIONS(603), 1,
      sym__indent,
    ACTIONS(599), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(601), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2261] = 3,
    ACTIONS(609), 1,
      sym__newline,
    ACTIONS(605), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(607), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2305] = 4,
    ACTIONS(611), 1,
      anon_sym_with,
    ACTIONS(614), 1,
      sym__newline,
    ACTIONS(586), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(584), 30,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2351] = 4,
    ACTIONS(620), 1,
      anon_sym_with,
    ACTIONS(623), 1,
      sym__newline,
    ACTIONS(618), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(616), 30,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2397] = 2,
    ACTIONS(401), 6,
      sym__newline,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(403), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2439] = 3,
    ACTIONS(629), 1,
      sym__newline,
    ACTIONS(627), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(625), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2483] = 3,
    ACTIONS(631), 1,
      sym_python_block,
    ACTIONS(627), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(625), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2527] = 3,
    ACTIONS(637), 1,
      sym__newline,
    ACTIONS(635), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(633), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2571] = 3,
    ACTIONS(643), 1,
      sym__newline,
    ACTIONS(641), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(639), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2615] = 3,
    ACTIONS(649), 1,
      sym__newline,
    ACTIONS(647), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(645), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2659] = 3,
    ACTIONS(655), 1,
      sym__newline,
    ACTIONS(653), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(651), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2703] = 3,
    ACTIONS(657), 1,
      sym__indent,
    ACTIONS(391), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(389), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2747] = 3,
    ACTIONS(663), 1,
      sym_python_block,
    ACTIONS(661), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(659), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2791] = 3,
    ACTIONS(669), 1,
      sym__newline,
    ACTIONS(667), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(665), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2835] = 3,
    ACTIONS(671), 1,
      sym__newline,
    ACTIONS(661), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(659), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2879] = 3,
    ACTIONS(673), 1,
      sym__newline,
    ACTIONS(461), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(463), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2923] = 3,
    ACTIONS(675), 1,
      sym_python_block,
    ACTIONS(461), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(463), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2967] = 3,
    ACTIONS(677), 1,
      sym__newline,
    ACTIONS(667), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(665), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3011] = 3,
    ACTIONS(679), 1,
      sym__indent,
    ACTIONS(599), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(601), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3055] = 3,
    ACTIONS(681), 1,
      sym__newline,
    ACTIONS(605), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(607), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3099] = 3,
    ACTIONS(687), 1,
      sym__newline,
    ACTIONS(685), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(683), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3143] = 4,
    ACTIONS(689), 1,
      anon_sym_with,
    ACTIONS(692), 1,
      sym__newline,
    ACTIONS(618), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(616), 30,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3189] = 3,
    ACTIONS(694), 1,
      sym__newline,
    ACTIONS(661), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(659), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3233] = 3,
    ACTIONS(700), 1,
      sym_python_block,
    ACTIONS(698), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(696), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3277] = 3,
    ACTIONS(706), 1,
      sym_python_block,
    ACTIONS(704), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(702), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3321] = 3,
    ACTIONS(708), 1,
      sym_python_block,
    ACTIONS(441), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(443), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3365] = 3,
    ACTIONS(710), 1,
      sym__newline,
    ACTIONS(435), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(437), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3409] = 3,
    ACTIONS(712), 1,
      sym__newline,
    ACTIONS(441), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(443), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3453] = 3,
    ACTIONS(714), 1,
      sym__newline,
    ACTIONS(447), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(449), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3497] = 3,
    ACTIONS(716), 1,
      sym_python_block,
    ACTIONS(447), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(449), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3541] = 3,
    ACTIONS(718), 1,
      sym__indent,
    ACTIONS(455), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(457), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3585] = 3,
    ACTIONS(720), 1,
      sym__newline,
    ACTIONS(685), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(683), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3629] = 3,
    ACTIONS(722), 1,
      sym__newline,
    ACTIONS(595), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(593), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3673] = 3,
    ACTIONS(724), 1,
      sym_python_block,
    ACTIONS(467), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(469), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3717] = 3,
    ACTIONS(726), 1,
      sym__newline,
    ACTIONS(473), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(475), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3761] = 3,
    ACTIONS(728), 1,
      sym__newline,
    ACTIONS(479), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(481), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3805] = 3,
    ACTIONS(730), 1,
      sym_python_block,
    ACTIONS(485), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(487), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3849] = 3,
    ACTIONS(732), 1,
      sym_python_block,
    ACTIONS(491), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(493), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3893] = 3,
    ACTIONS(734), 1,
      sym_python_block,
    ACTIONS(497), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(499), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3937] = 3,
    ACTIONS(736), 1,
      sym__newline,
    ACTIONS(503), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(505), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3981] = 3,
    ACTIONS(738), 1,
      sym__newline,
    ACTIONS(497), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(499), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4025] = 3,
    ACTIONS(740), 1,
      sym_python_block,
    ACTIONS(511), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(513), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4069] = 3,
    ACTIONS(742), 1,
      sym_python_block,
    ACTIONS(517), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(519), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4113] = 3,
    ACTIONS(744), 1,
      sym__newline,
    ACTIONS(523), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(525), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4157] = 3,
    ACTIONS(746), 1,
      sym__newline,
    ACTIONS(529), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(531), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4201] = 3,
    ACTIONS(748), 1,
      sym_python_block,
    ACTIONS(535), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(537), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4245] = 3,
    ACTIONS(750), 1,
      sym_python_block,
    ACTIONS(541), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(543), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4289] = 4,
    ACTIONS(752), 1,
      anon_sym_with,
    ACTIONS(755), 1,
      sym__newline,
    ACTIONS(573), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(571), 30,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4335] = 3,
    ACTIONS(757), 1,
      sym_python_block,
    ACTIONS(547), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(549), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4379] = 3,
    ACTIONS(759), 1,
      sym_python_block,
    ACTIONS(553), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(555), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4423] = 3,
    ACTIONS(761), 1,
      sym__newline,
    ACTIONS(559), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(561), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4467] = 3,
    ACTIONS(763), 1,
      sym_python_block,
    ACTIONS(565), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(567), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4511] = 2,
    ACTIONS(421), 6,
      sym__newline,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(423), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4553] = 3,
    ACTIONS(765), 1,
      sym_comment,
    ACTIONS(405), 5,
      sym__newline,
      sym__dedent,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(407), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4597] = 3,
    ACTIONS(767), 1,
      sym__newline,
    ACTIONS(395), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(397), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4641] = 2,
    ACTIONS(401), 6,
      sym__newline,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(403), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4683] = 3,
    ACTIONS(769), 1,
      sym__indent,
    ACTIONS(391), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(389), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4727] = 3,
    ACTIONS(775), 1,
      sym__newline,
    ACTIONS(771), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(773), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4771] = 3,
    ACTIONS(777), 1,
      sym_python_block,
    ACTIONS(698), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(696), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4815] = 3,
    ACTIONS(779), 1,
      sym_python_block,
    ACTIONS(704), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(702), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4859] = 3,
    ACTIONS(781), 1,
      sym__newline,
    ACTIONS(627), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(625), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4903] = 3,
    ACTIONS(783), 1,
      sym_python_block,
    ACTIONS(441), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(443), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4947] = 3,
    ACTIONS(785), 1,
      sym_python_block,
    ACTIONS(627), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(625), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4991] = 3,
    ACTIONS(787), 1,
      sym__newline,
    ACTIONS(635), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(633), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5035] = 3,
    ACTIONS(789), 1,
      sym__newline,
    ACTIONS(641), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(639), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5079] = 3,
    ACTIONS(791), 1,
      sym__newline,
    ACTIONS(647), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(645), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5123] = 3,
    ACTIONS(793), 1,
      sym_comment,
    ACTIONS(405), 5,
      sym__newline,
      ts_builtin_sym_end,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(407), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5167] = 3,
    ACTIONS(795), 1,
      sym__newline,
    ACTIONS(653), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(651), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5211] = 3,
    ACTIONS(797), 1,
      sym__newline,
    ACTIONS(395), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(397), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5255] = 3,
    ACTIONS(799), 1,
      sym_python_block,
    ACTIONS(661), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(659), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5299] = 3,
    ACTIONS(801), 1,
      sym__newline,
    ACTIONS(771), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(773), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5343] = 2,
    ACTIONS(805), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(803), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5384] = 2,
    ACTIONS(807), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(809), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5425] = 2,
    ACTIONS(811), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(813), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5466] = 2,
    ACTIONS(815), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(817), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5507] = 2,
    ACTIONS(819), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(821), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5548] = 2,
    ACTIONS(823), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(825), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5589] = 2,
    ACTIONS(827), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(829), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5630] = 2,
    ACTIONS(831), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(833), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5671] = 2,
    ACTIONS(835), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(837), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5712] = 2,
    ACTIONS(839), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(841), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5753] = 2,
    ACTIONS(843), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(845), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5794] = 2,
    ACTIONS(847), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(849), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5835] = 2,
    ACTIONS(851), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(853), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5876] = 2,
    ACTIONS(855), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(857), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5917] = 2,
    ACTIONS(859), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(861), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5958] = 2,
    ACTIONS(863), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(865), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5999] = 2,
    ACTIONS(867), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(869), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6040] = 2,
    ACTIONS(871), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(873), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6081] = 2,
    ACTIONS(875), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(877), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6122] = 2,
    ACTIONS(879), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(881), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6163] = 2,
    ACTIONS(883), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(885), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6204] = 2,
    ACTIONS(887), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(889), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6245] = 2,
    ACTIONS(891), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(893), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6286] = 2,
    ACTIONS(895), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(897), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6327] = 2,
    ACTIONS(899), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(901), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6368] = 2,
    ACTIONS(903), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(905), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6409] = 2,
    ACTIONS(907), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(909), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6450] = 2,
    ACTIONS(911), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(913), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6491] = 2,
    ACTIONS(915), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(917), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6532] = 2,
    ACTIONS(919), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(921), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6573] = 2,
    ACTIONS(923), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(925), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6614] = 2,
    ACTIONS(927), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(929), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6655] = 2,
    ACTIONS(931), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(933), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6696] = 2,
    ACTIONS(935), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(937), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6737] = 2,
    ACTIONS(939), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(941), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6778] = 2,
    ACTIONS(943), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(945), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6819] = 2,
    ACTIONS(947), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(949), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6860] = 2,
    ACTIONS(951), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(953), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6901] = 2,
    ACTIONS(805), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(803), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6942] = 2,
    ACTIONS(955), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(957), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6983] = 2,
    ACTIONS(959), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(961), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7024] = 2,
    ACTIONS(963), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(965), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7065] = 2,
    ACTIONS(967), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(969), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7106] = 2,
    ACTIONS(971), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(973), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7147] = 2,
    ACTIONS(975), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(977), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7188] = 2,
    ACTIONS(979), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(981), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7229] = 2,
    ACTIONS(983), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(985), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7270] = 2,
    ACTIONS(987), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(989), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7311] = 2,
    ACTIONS(991), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(993), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7352] = 2,
    ACTIONS(995), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(997), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7393] = 2,
    ACTIONS(999), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1001), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7434] = 2,
    ACTIONS(1003), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1005), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7475] = 2,
    ACTIONS(1007), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1009), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7516] = 2,
    ACTIONS(1011), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1013), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7557] = 2,
    ACTIONS(1015), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1017), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7598] = 2,
    ACTIONS(1019), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1021), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7639] = 2,
    ACTIONS(1023), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1025), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7680] = 2,
    ACTIONS(1027), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1029), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7721] = 2,
    ACTIONS(1031), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1033), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7762] = 2,
    ACTIONS(1035), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1037), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7803] = 2,
    ACTIONS(1039), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1041), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7844] = 2,
    ACTIONS(1043), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1045), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7885] = 2,
    ACTIONS(1047), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1049), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7926] = 2,
    ACTIONS(1051), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1053), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7967] = 2,
    ACTIONS(363), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(365), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8008] = 2,
    ACTIONS(1057), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1055), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8049] = 2,
    ACTIONS(1061), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1059), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8090] = 2,
    ACTIONS(1057), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1055), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8131] = 2,
    ACTIONS(1063), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1065), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8172] = 2,
    ACTIONS(839), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(841), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8213] = 2,
    ACTIONS(1067), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1069), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8254] = 2,
    ACTIONS(1063), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1065), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8295] = 2,
    ACTIONS(1073), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1071), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8336] = 2,
    ACTIONS(1073), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1071), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8377] = 2,
    ACTIONS(1077), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1075), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8418] = 2,
    ACTIONS(1081), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1079), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8459] = 2,
    ACTIONS(1085), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1083), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8500] = 2,
    ACTIONS(859), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(861), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8541] = 2,
    ACTIONS(1087), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1089), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8582] = 2,
    ACTIONS(843), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(845), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8623] = 2,
    ACTIONS(883), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(885), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8664] = 2,
    ACTIONS(1091), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1093), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8705] = 2,
    ACTIONS(1095), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1097), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8746] = 2,
    ACTIONS(1067), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1069), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8787] = 2,
    ACTIONS(1099), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1101), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8828] = 2,
    ACTIONS(1087), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1089), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8869] = 2,
    ACTIONS(1091), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1093), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8910] = 2,
    ACTIONS(1095), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1097), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8951] = 2,
    ACTIONS(1105), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1103), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8992] = 2,
    ACTIONS(1109), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1107), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9033] = 2,
    ACTIONS(1111), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1113), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9074] = 2,
    ACTIONS(1117), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1115), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9115] = 2,
    ACTIONS(1121), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1119), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9156] = 2,
    ACTIONS(1123), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1125), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9197] = 2,
    ACTIONS(1127), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1129), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9238] = 2,
    ACTIONS(1133), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1131), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9279] = 2,
    ACTIONS(1137), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1135), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9320] = 2,
    ACTIONS(1141), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1139), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9361] = 2,
    ACTIONS(1145), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1143), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9402] = 2,
    ACTIONS(1149), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1147), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9443] = 2,
    ACTIONS(1153), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1151), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9484] = 2,
    ACTIONS(1155), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1157), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9525] = 2,
    ACTIONS(807), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(809), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9566] = 2,
    ACTIONS(815), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(817), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9607] = 2,
    ACTIONS(819), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(821), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9648] = 2,
    ACTIONS(823), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(825), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9689] = 2,
    ACTIONS(827), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(829), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9730] = 2,
    ACTIONS(835), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(837), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9771] = 2,
    ACTIONS(1105), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1103), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9812] = 2,
    ACTIONS(1109), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1107), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9853] = 2,
    ACTIONS(891), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(893), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9894] = 2,
    ACTIONS(899), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(901), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9935] = 2,
    ACTIONS(903), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(905), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9976] = 2,
    ACTIONS(907), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(909), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10017] = 2,
    ACTIONS(911), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(913), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10058] = 2,
    ACTIONS(979), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(981), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10099] = 2,
    ACTIONS(987), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(989), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10140] = 2,
    ACTIONS(995), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(997), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10181] = 2,
    ACTIONS(363), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(365), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10222] = 2,
    ACTIONS(1159), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1161), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10263] = 2,
    ACTIONS(1163), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1165), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10304] = 2,
    ACTIONS(1167), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1169), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10345] = 2,
    ACTIONS(1171), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1173), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10386] = 2,
    ACTIONS(1175), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1177), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10427] = 2,
    ACTIONS(1179), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1181), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10468] = 2,
    ACTIONS(1183), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1185), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10509] = 2,
    ACTIONS(1099), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1101), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10550] = 2,
    ACTIONS(1111), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1113), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10591] = 2,
    ACTIONS(1123), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1125), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10632] = 2,
    ACTIONS(1127), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1129), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10673] = 2,
    ACTIONS(1155), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1157), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10714] = 2,
    ACTIONS(1061), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1059), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10755] = 2,
    ACTIONS(1187), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1189), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10796] = 2,
    ACTIONS(1159), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1161), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10837] = 2,
    ACTIONS(1163), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1165), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10878] = 2,
    ACTIONS(1167), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1169), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10919] = 2,
    ACTIONS(1171), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1173), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10960] = 2,
    ACTIONS(1175), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1177), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11001] = 2,
    ACTIONS(1179), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1181), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11042] = 2,
    ACTIONS(1183), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1185), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11083] = 2,
    ACTIONS(1187), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1189), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11124] = 2,
    ACTIONS(1117), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1115), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11165] = 2,
    ACTIONS(1193), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1191), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11206] = 2,
    ACTIONS(1197), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1195), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11247] = 2,
    ACTIONS(1201), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1199), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11288] = 2,
    ACTIONS(1205), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1203), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11329] = 2,
    ACTIONS(1209), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1207), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11370] = 2,
    ACTIONS(1213), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1211), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11411] = 2,
    ACTIONS(1217), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1215), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11452] = 2,
    ACTIONS(1193), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1191), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11493] = 2,
    ACTIONS(1221), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1219), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11534] = 2,
    ACTIONS(1197), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1195), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11575] = 2,
    ACTIONS(1201), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1199), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11616] = 2,
    ACTIONS(1205), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1203), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11657] = 2,
    ACTIONS(1225), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1223), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11698] = 2,
    ACTIONS(1209), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1207), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11739] = 2,
    ACTIONS(1213), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1211), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11780] = 2,
    ACTIONS(1217), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1215), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11821] = 2,
    ACTIONS(1229), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1227), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11862] = 2,
    ACTIONS(1233), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1231), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11903] = 2,
    ACTIONS(1237), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1235), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11944] = 2,
    ACTIONS(1241), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1239), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11985] = 2,
    ACTIONS(1245), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1243), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12026] = 2,
    ACTIONS(1249), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1247), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12067] = 2,
    ACTIONS(1253), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1251), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12108] = 2,
    ACTIONS(1257), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1255), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12149] = 2,
    ACTIONS(1261), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1259), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12190] = 2,
    ACTIONS(1265), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1263), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12231] = 2,
    ACTIONS(1269), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1267), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12272] = 2,
    ACTIONS(1273), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1271), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12313] = 2,
    ACTIONS(1277), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1275), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12354] = 2,
    ACTIONS(1281), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1279), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12395] = 2,
    ACTIONS(1285), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1283), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12436] = 2,
    ACTIONS(1121), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1119), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12477] = 2,
    ACTIONS(1289), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1287), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12518] = 2,
    ACTIONS(1293), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1291), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12559] = 2,
    ACTIONS(1297), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1295), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12600] = 2,
    ACTIONS(1221), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1219), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12641] = 2,
    ACTIONS(1301), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1299), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12682] = 2,
    ACTIONS(1305), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1303), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12723] = 2,
    ACTIONS(1309), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1307), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12764] = 2,
    ACTIONS(1313), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1311), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12805] = 2,
    ACTIONS(1317), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1315), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12846] = 2,
    ACTIONS(1321), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1319), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12887] = 2,
    ACTIONS(1077), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1075), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12928] = 2,
    ACTIONS(1081), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1079), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [12969] = 2,
    ACTIONS(811), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(813), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13010] = 2,
    ACTIONS(1085), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1083), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13051] = 2,
    ACTIONS(1225), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1223), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13092] = 2,
    ACTIONS(1133), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1131), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13133] = 2,
    ACTIONS(1137), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1135), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13174] = 2,
    ACTIONS(831), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(833), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13215] = 2,
    ACTIONS(1141), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1139), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13256] = 2,
    ACTIONS(1145), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1143), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13297] = 2,
    ACTIONS(1149), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1147), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13338] = 2,
    ACTIONS(847), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(849), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13379] = 2,
    ACTIONS(851), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(853), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13420] = 2,
    ACTIONS(855), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(857), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13461] = 2,
    ACTIONS(1325), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1323), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13502] = 2,
    ACTIONS(863), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(865), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13543] = 2,
    ACTIONS(867), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(869), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13584] = 2,
    ACTIONS(871), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(873), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13625] = 2,
    ACTIONS(875), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(877), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13666] = 2,
    ACTIONS(879), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(881), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13707] = 2,
    ACTIONS(1229), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1227), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13748] = 2,
    ACTIONS(887), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(889), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13789] = 2,
    ACTIONS(1233), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1231), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13830] = 2,
    ACTIONS(895), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(897), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13871] = 2,
    ACTIONS(1237), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1235), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13912] = 2,
    ACTIONS(1241), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1239), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13953] = 2,
    ACTIONS(1245), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1243), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [13994] = 2,
    ACTIONS(915), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(917), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14035] = 2,
    ACTIONS(919), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(921), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14076] = 2,
    ACTIONS(923), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(925), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14117] = 2,
    ACTIONS(927), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(929), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14158] = 2,
    ACTIONS(931), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(933), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14199] = 2,
    ACTIONS(935), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(937), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14240] = 2,
    ACTIONS(939), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(941), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14281] = 2,
    ACTIONS(943), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(945), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14322] = 2,
    ACTIONS(947), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(949), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14363] = 2,
    ACTIONS(951), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(953), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14404] = 2,
    ACTIONS(1249), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1247), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14445] = 2,
    ACTIONS(955), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(957), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14486] = 2,
    ACTIONS(959), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(961), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14527] = 2,
    ACTIONS(963), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(965), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14568] = 2,
    ACTIONS(967), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(969), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14609] = 2,
    ACTIONS(971), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(973), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14650] = 2,
    ACTIONS(975), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(977), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14691] = 2,
    ACTIONS(1253), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1251), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14732] = 2,
    ACTIONS(983), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(985), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14773] = 2,
    ACTIONS(1257), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1255), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14814] = 2,
    ACTIONS(991), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(993), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14855] = 2,
    ACTIONS(1261), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1259), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14896] = 2,
    ACTIONS(999), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1001), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14937] = 2,
    ACTIONS(1003), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1005), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [14978] = 2,
    ACTIONS(1007), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1009), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15019] = 2,
    ACTIONS(1011), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1013), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15060] = 2,
    ACTIONS(1015), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1017), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15101] = 2,
    ACTIONS(1265), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1263), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15142] = 2,
    ACTIONS(1019), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1021), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15183] = 2,
    ACTIONS(1023), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1025), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15224] = 2,
    ACTIONS(1027), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1029), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15265] = 2,
    ACTIONS(1031), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1033), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15306] = 2,
    ACTIONS(1035), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1037), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15347] = 2,
    ACTIONS(1039), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1041), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15388] = 2,
    ACTIONS(1043), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1045), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15429] = 2,
    ACTIONS(1047), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1049), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15470] = 2,
    ACTIONS(1051), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1053), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15511] = 2,
    ACTIONS(1269), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1267), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15552] = 2,
    ACTIONS(1273), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1271), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15593] = 2,
    ACTIONS(1277), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1275), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15634] = 2,
    ACTIONS(1281), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1279), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15675] = 2,
    ACTIONS(1285), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1283), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15716] = 2,
    ACTIONS(427), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(425), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15757] = 2,
    ACTIONS(1153), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1151), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15798] = 2,
    ACTIONS(1289), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1287), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15839] = 2,
    ACTIONS(1293), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1291), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15880] = 2,
    ACTIONS(1297), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1295), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15921] = 2,
    ACTIONS(427), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(425), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [15962] = 2,
    ACTIONS(1301), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1299), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [16003] = 2,
    ACTIONS(1305), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1303), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [16044] = 2,
    ACTIONS(1309), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1307), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [16085] = 2,
    ACTIONS(1313), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1311), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [16126] = 2,
    ACTIONS(1317), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1315), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [16167] = 2,
    ACTIONS(1321), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1319), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [16208] = 2,
    ACTIONS(1325), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1323), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [16249] = 9,
    ACTIONS(1327), 1,
      sym_identifier,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1331), 1,
      anon_sym_with,
    ACTIONS(1337), 1,
      sym__dedent,
    STATE(764), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1335), 2,
      anon_sym_pause,
      anon_sym_time,
    ACTIONS(1333), 5,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
    STATE(405), 8,
      sym__comment_line,
      sym__atl_statement,
      sym_atl_transform_property,
      sym_atl_displayable,
      sym_atl_with_statement,
      sym_atl_block_statement,
      sym_atl_time_statement,
      aux_sym__atl_block_repeat1,
  [16290] = 9,
    ACTIONS(1327), 1,
      sym_identifier,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1331), 1,
      anon_sym_with,
    ACTIONS(1339), 1,
      sym__dedent,
    STATE(764), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1335), 2,
      anon_sym_pause,
      anon_sym_time,
    ACTIONS(1333), 5,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
    STATE(405), 8,
      sym__comment_line,
      sym__atl_statement,
      sym_atl_transform_property,
      sym_atl_displayable,
      sym_atl_with_statement,
      sym_atl_block_statement,
      sym_atl_time_statement,
      aux_sym__atl_block_repeat1,
  [16331] = 9,
    ACTIONS(1341), 1,
      sym_identifier,
    ACTIONS(1344), 1,
      sym_comment,
    ACTIONS(1347), 1,
      anon_sym_with,
    ACTIONS(1359), 1,
      sym__dedent,
    STATE(764), 1,
      sym_string,
    ACTIONS(1353), 2,
      anon_sym_pause,
      anon_sym_time,
    ACTIONS(1356), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1350), 5,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
    STATE(405), 8,
      sym__comment_line,
      sym__atl_statement,
      sym_atl_transform_property,
      sym_atl_displayable,
      sym_atl_with_statement,
      sym_atl_block_statement,
      sym_atl_time_statement,
      aux_sym__atl_block_repeat1,
  [16372] = 9,
    ACTIONS(1327), 1,
      sym_identifier,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1331), 1,
      anon_sym_with,
    ACTIONS(1361), 1,
      sym__dedent,
    STATE(764), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1335), 2,
      anon_sym_pause,
      anon_sym_time,
    ACTIONS(1333), 5,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
    STATE(405), 8,
      sym__comment_line,
      sym__atl_statement,
      sym_atl_transform_property,
      sym_atl_displayable,
      sym_atl_with_statement,
      sym_atl_block_statement,
      sym_atl_time_statement,
      aux_sym__atl_block_repeat1,
  [16413] = 8,
    ACTIONS(1327), 1,
      sym_identifier,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1331), 1,
      anon_sym_with,
    STATE(764), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1335), 2,
      anon_sym_pause,
      anon_sym_time,
    ACTIONS(1333), 5,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
    STATE(403), 8,
      sym__comment_line,
      sym__atl_statement,
      sym_atl_transform_property,
      sym_atl_displayable,
      sym_atl_with_statement,
      sym_atl_block_statement,
      sym_atl_time_statement,
      aux_sym__atl_block_repeat1,
  [16451] = 8,
    ACTIONS(1327), 1,
      sym_identifier,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1331), 1,
      anon_sym_with,
    STATE(764), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1335), 2,
      anon_sym_pause,
      anon_sym_time,
    ACTIONS(1333), 5,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
    STATE(404), 8,
      sym__comment_line,
      sym__atl_statement,
      sym_atl_transform_property,
      sym_atl_displayable,
      sym_atl_with_statement,
      sym_atl_block_statement,
      sym_atl_time_statement,
      aux_sym__atl_block_repeat1,
  [16489] = 8,
    ACTIONS(1327), 1,
      sym_identifier,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1331), 1,
      anon_sym_with,
    STATE(764), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1335), 2,
      anon_sym_pause,
      anon_sym_time,
    ACTIONS(1333), 5,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
    STATE(406), 8,
      sym__comment_line,
      sym__atl_statement,
      sym_atl_transform_property,
      sym_atl_displayable,
      sym_atl_with_statement,
      sym_atl_block_statement,
      sym_atl_time_statement,
      aux_sym__atl_block_repeat1,
  [16527] = 2,
    ACTIONS(1057), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1055), 15,
      sym_identifier,
      anon_sym_set,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_showif,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
      anon_sym_pause,
      anon_sym_time,
  [16551] = 2,
    ACTIONS(1365), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1363), 9,
      sym_identifier,
      anon_sym_with,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
      anon_sym_pause,
      anon_sym_time,
  [16569] = 2,
    ACTIONS(1369), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1367), 9,
      sym_identifier,
      anon_sym_with,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
      anon_sym_pause,
      anon_sym_time,
  [16587] = 2,
    ACTIONS(1373), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1371), 9,
      sym_identifier,
      anon_sym_with,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
      anon_sym_pause,
      anon_sym_time,
  [16605] = 2,
    ACTIONS(1377), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1375), 9,
      sym_identifier,
      anon_sym_with,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
      anon_sym_pause,
      anon_sym_time,
  [16623] = 2,
    ACTIONS(1381), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1379), 9,
      sym_identifier,
      anon_sym_with,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
      anon_sym_pause,
      anon_sym_time,
  [16641] = 7,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1383), 1,
      sym_identifier,
    ACTIONS(1385), 1,
      anon_sym_set,
    ACTIONS(1387), 1,
      sym__dedent,
    STATE(507), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(420), 5,
      sym__comment_line,
      sym_menu_caption,
      sym_menu_set,
      sym_menu_choice,
      aux_sym_menu_statement_repeat1,
  [16668] = 7,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1383), 1,
      sym_identifier,
    ACTIONS(1385), 1,
      anon_sym_set,
    ACTIONS(1389), 1,
      sym__dedent,
    STATE(507), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(420), 5,
      sym__comment_line,
      sym_menu_caption,
      sym_menu_set,
      sym_menu_choice,
      aux_sym_menu_statement_repeat1,
  [16695] = 7,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1383), 1,
      sym_identifier,
    ACTIONS(1385), 1,
      anon_sym_set,
    ACTIONS(1391), 1,
      sym__dedent,
    STATE(507), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(420), 5,
      sym__comment_line,
      sym_menu_caption,
      sym_menu_set,
      sym_menu_choice,
      aux_sym_menu_statement_repeat1,
  [16722] = 7,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1383), 1,
      sym_identifier,
    ACTIONS(1385), 1,
      anon_sym_set,
    ACTIONS(1393), 1,
      sym__dedent,
    STATE(507), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(420), 5,
      sym__comment_line,
      sym_menu_caption,
      sym_menu_set,
      sym_menu_choice,
      aux_sym_menu_statement_repeat1,
  [16749] = 7,
    ACTIONS(1395), 1,
      sym_identifier,
    ACTIONS(1398), 1,
      sym_comment,
    ACTIONS(1401), 1,
      anon_sym_set,
    ACTIONS(1407), 1,
      sym__dedent,
    STATE(507), 1,
      sym_string,
    ACTIONS(1404), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(420), 5,
      sym__comment_line,
      sym_menu_caption,
      sym_menu_set,
      sym_menu_choice,
      aux_sym_menu_statement_repeat1,
  [16776] = 11,
    ACTIONS(1409), 1,
      sym_identifier,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1413), 1,
      sym__screen_string,
    ACTIONS(1415), 1,
      sym__screen_value,
    ACTIONS(1417), 1,
      sym__newline,
    STATE(423), 1,
      aux_sym_screen_language_statement_repeat1,
    STATE(444), 1,
      sym__screen_line_end,
    STATE(463), 1,
      aux_sym_screen_language_statement_repeat2,
    STATE(501), 1,
      sym__positional_property,
    STATE(644), 1,
      sym__keyword_property,
    STATE(753), 1,
      sym__block_colon,
  [16810] = 6,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1383), 1,
      sym_identifier,
    ACTIONS(1385), 1,
      anon_sym_set,
    STATE(507), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(416), 5,
      sym__comment_line,
      sym_menu_caption,
      sym_menu_set,
      sym_menu_choice,
      aux_sym_menu_statement_repeat1,
  [16834] = 11,
    ACTIONS(1409), 1,
      sym_identifier,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1413), 1,
      sym__screen_string,
    ACTIONS(1415), 1,
      sym__screen_value,
    ACTIONS(1419), 1,
      sym__newline,
    STATE(449), 1,
      sym__screen_line_end,
    STATE(464), 1,
      aux_sym_screen_language_statement_repeat1,
    STATE(465), 1,
      aux_sym_screen_language_statement_repeat2,
    STATE(501), 1,
      sym__positional_property,
    STATE(644), 1,
      sym__keyword_property,
    STATE(753), 1,
      sym__block_colon,
  [16868] = 5,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1421), 1,
      sym_identifier,
    ACTIONS(1425), 1,
      sym__dedent,
    STATE(425), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1423), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [16890] = 5,
    ACTIONS(1427), 1,
      sym_identifier,
    ACTIONS(1430), 1,
      sym_comment,
    ACTIONS(1436), 1,
      sym__dedent,
    STATE(425), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1433), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [16912] = 5,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1421), 1,
      sym_identifier,
    ACTIONS(1438), 1,
      sym__dedent,
    STATE(425), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1423), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [16934] = 5,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1421), 1,
      sym_identifier,
    ACTIONS(1440), 1,
      sym__dedent,
    STATE(425), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1423), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [16956] = 5,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1421), 1,
      sym_identifier,
    ACTIONS(1442), 1,
      sym__dedent,
    STATE(425), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1423), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [16978] = 6,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1383), 1,
      sym_identifier,
    ACTIONS(1385), 1,
      anon_sym_set,
    STATE(507), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(418), 5,
      sym__comment_line,
      sym_menu_caption,
      sym_menu_set,
      sym_menu_choice,
      aux_sym_menu_statement_repeat1,
  [17002] = 5,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1421), 1,
      sym_identifier,
    ACTIONS(1444), 1,
      sym__dedent,
    STATE(425), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1423), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [17024] = 6,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1383), 1,
      sym_identifier,
    ACTIONS(1385), 1,
      anon_sym_set,
    STATE(507), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(417), 5,
      sym__comment_line,
      sym_menu_caption,
      sym_menu_set,
      sym_menu_choice,
      aux_sym_menu_statement_repeat1,
  [17048] = 6,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1383), 1,
      sym_identifier,
    ACTIONS(1385), 1,
      anon_sym_set,
    STATE(507), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(419), 5,
      sym__comment_line,
      sym_menu_caption,
      sym_menu_set,
      sym_menu_choice,
      aux_sym_menu_statement_repeat1,
  [17072] = 9,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1446), 1,
      sym_identifier,
    ACTIONS(1448), 1,
      sym_expression,
    ACTIONS(1450), 1,
      sym__newline,
    STATE(68), 1,
      sym_string,
    STATE(134), 1,
      sym__block_colon,
    STATE(146), 1,
      sym__block,
    STATE(436), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [17101] = 4,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1421), 1,
      sym_identifier,
    STATE(430), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1423), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [17120] = 9,
    ACTIONS(1452), 1,
      sym_identifier,
    ACTIONS(1454), 1,
      sym_expression,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    ACTIONS(1458), 1,
      sym__newline,
    STATE(69), 1,
      sym_string,
    STATE(120), 1,
      sym__block_colon,
    STATE(217), 1,
      sym__block,
    STATE(456), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(249), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [17149] = 9,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1452), 1,
      sym_identifier,
    ACTIONS(1460), 1,
      sym_expression,
    ACTIONS(1462), 1,
      sym__newline,
    STATE(87), 1,
      sym_string,
    STATE(134), 1,
      sym__block_colon,
    STATE(157), 1,
      sym__block,
    STATE(456), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [17178] = 4,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1421), 1,
      sym_identifier,
    STATE(424), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1423), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [17197] = 4,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1421), 1,
      sym_identifier,
    STATE(426), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1423), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [17216] = 4,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1421), 1,
      sym_identifier,
    STATE(428), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1423), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [17235] = 9,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    ACTIONS(1464), 1,
      sym_identifier,
    ACTIONS(1466), 1,
      sym_expression,
    ACTIONS(1468), 1,
      sym__newline,
    STATE(64), 1,
      sym_string,
    STATE(120), 1,
      sym__block_colon,
    STATE(206), 1,
      sym__block,
    STATE(435), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(249), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [17264] = 4,
    ACTIONS(1329), 1,
      sym_comment,
    ACTIONS(1421), 1,
      sym_identifier,
    STATE(427), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1423), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [17283] = 9,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1470), 1,
      sym_identifier,
    ACTIONS(1472), 1,
      anon_sym_with,
    ACTIONS(1474), 1,
      anon_sym_at,
    ACTIONS(1476), 1,
      anon_sym_as,
    ACTIONS(1478), 1,
      sym__newline,
    STATE(391), 1,
      sym__atl_block,
    STATE(458), 1,
      aux_sym_menu_caption_repeat1,
    STATE(739), 1,
      sym__block_colon,
  [17311] = 9,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1470), 1,
      sym_identifier,
    ACTIONS(1480), 1,
      anon_sym_with,
    ACTIONS(1482), 1,
      anon_sym_at,
    ACTIONS(1484), 1,
      anon_sym_as,
    ACTIONS(1486), 1,
      sym__newline,
    STATE(237), 1,
      sym__atl_block,
    STATE(458), 1,
      aux_sym_menu_caption_repeat1,
    STATE(972), 1,
      sym__block_colon,
  [17339] = 2,
    ACTIONS(1490), 2,
      sym__dedent,
      sym_comment,
    ACTIONS(1488), 6,
      sym_identifier,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [17352] = 2,
    ACTIONS(1494), 2,
      sym__dedent,
      sym_comment,
    ACTIONS(1492), 6,
      sym_identifier,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [17365] = 2,
    ACTIONS(1498), 2,
      sym__dedent,
      sym_comment,
    ACTIONS(1496), 6,
      sym_identifier,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [17378] = 2,
    ACTIONS(1502), 2,
      sym__dedent,
      sym_comment,
    ACTIONS(1500), 6,
      sym_identifier,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [17391] = 2,
    ACTIONS(1506), 2,
      sym__dedent,
      sym_comment,
    ACTIONS(1504), 6,
      sym_identifier,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [17404] = 2,
    ACTIONS(1498), 2,
      sym__dedent,
      sym_comment,
    ACTIONS(1496), 6,
      sym_identifier,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [17417] = 8,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1470), 1,
      sym_identifier,
    ACTIONS(1508), 1,
      anon_sym_with,
    ACTIONS(1510), 1,
      anon_sym_at,
    ACTIONS(1512), 1,
      sym__newline,
    STATE(330), 1,
      sym__atl_block,
    STATE(458), 1,
      aux_sym_menu_caption_repeat1,
    STATE(739), 1,
      sym__block_colon,
  [17442] = 8,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1470), 1,
      sym_identifier,
    ACTIONS(1514), 1,
      anon_sym_with,
    ACTIONS(1516), 1,
      anon_sym_at,
    ACTIONS(1518), 1,
      sym__newline,
    STATE(235), 1,
      sym__atl_block,
    STATE(458), 1,
      aux_sym_menu_caption_repeat1,
    STATE(972), 1,
      sym__block_colon,
  [17467] = 8,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1520), 1,
      sym_identifier,
    ACTIONS(1522), 1,
      anon_sym_with,
    ACTIONS(1524), 1,
      anon_sym_at,
    ACTIONS(1526), 1,
      sym__newline,
    STATE(212), 1,
      sym__atl_block,
    STATE(451), 1,
      aux_sym_menu_caption_repeat1,
    STATE(972), 1,
      sym__block_colon,
  [17492] = 8,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1528), 1,
      sym_identifier,
    ACTIONS(1530), 1,
      anon_sym_with,
    ACTIONS(1532), 1,
      anon_sym_at,
    ACTIONS(1534), 1,
      sym__newline,
    STATE(322), 1,
      sym__atl_block,
    STATE(450), 1,
      aux_sym_menu_caption_repeat1,
    STATE(739), 1,
      sym__block_colon,
  [17517] = 5,
    ACTIONS(1541), 1,
      sym__screen_string,
    ACTIONS(1544), 1,
      sym__screen_value_list,
    STATE(646), 1,
      sym__positional_property,
    ACTIONS(1536), 2,
      sym_identifier,
      sym__screen_value,
    ACTIONS(1539), 2,
      sym__newline,
      anon_sym_COLON,
  [17535] = 5,
    ACTIONS(1546), 1,
      anon_sym_sustain,
    ACTIONS(1548), 1,
      sym__audio_name,
    ACTIONS(1550), 1,
      sym__audio_list,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(790), 2,
      sym__audio_file,
      sym_string,
  [17553] = 4,
    ACTIONS(1552), 1,
      sym_identifier,
    ACTIONS(1555), 1,
      sym_expression,
    STATE(456), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(1557), 4,
      sym__newline,
      anon_sym_COLON,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [17569] = 5,
    ACTIONS(1559), 1,
      anon_sym_sustain,
    ACTIONS(1561), 1,
      sym__audio_name,
    ACTIONS(1563), 1,
      sym__audio_list,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(808), 2,
      sym__audio_file,
      sym_string,
  [17587] = 4,
    ACTIONS(1565), 1,
      sym_identifier,
    STATE(458), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(1557), 2,
      sym__newline,
      anon_sym_COLON,
    ACTIONS(1555), 3,
      anon_sym_with,
      anon_sym_at,
      anon_sym_as,
  [17603] = 3,
    ACTIONS(1568), 1,
      sym_comment,
    ACTIONS(407), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(405), 4,
      sym__newline,
      sym__dedent,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [17617] = 3,
    ACTIONS(1570), 1,
      sym__newline,
    ACTIONS(397), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(395), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [17631] = 2,
    ACTIONS(403), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(401), 5,
      sym__newline,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [17643] = 3,
    ACTIONS(1572), 1,
      sym__indent,
    ACTIONS(389), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(391), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [17657] = 7,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1574), 1,
      sym_identifier,
    ACTIONS(1576), 1,
      sym__newline,
    STATE(446), 1,
      sym__screen_line_end,
    STATE(503), 1,
      aux_sym_screen_language_statement_repeat2,
    STATE(644), 1,
      sym__keyword_property,
    STATE(753), 1,
      sym__block_colon,
  [17679] = 5,
    ACTIONS(1583), 1,
      sym__screen_string,
    STATE(464), 1,
      aux_sym_screen_language_statement_repeat1,
    STATE(501), 1,
      sym__positional_property,
    ACTIONS(1578), 2,
      sym_identifier,
      sym__screen_value,
    ACTIONS(1581), 2,
      sym__newline,
      anon_sym_COLON,
  [17697] = 7,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1574), 1,
      sym_identifier,
    ACTIONS(1586), 1,
      sym__newline,
    STATE(447), 1,
      sym__screen_line_end,
    STATE(503), 1,
      aux_sym_screen_language_statement_repeat2,
    STATE(644), 1,
      sym__keyword_property,
    STATE(753), 1,
      sym__block_colon,
  [17719] = 6,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    ACTIONS(1590), 1,
      anon_sym_LPAREN,
    STATE(120), 1,
      sym__block_colon,
    STATE(222), 1,
      sym__block,
    STATE(519), 1,
      sym_parameter_list,
    ACTIONS(1588), 2,
      anon_sym_hide,
      anon_sym_global,
  [17739] = 6,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1590), 1,
      anon_sym_LPAREN,
    STATE(134), 1,
      sym__block_colon,
    STATE(215), 1,
      sym__block,
    STATE(510), 1,
      sym_parameter_list,
    ACTIONS(1592), 2,
      anon_sym_hide,
      anon_sym_global,
  [17759] = 4,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1594), 1,
      sym_identifier,
    ACTIONS(1596), 1,
      sym__dedent,
    STATE(469), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [17774] = 4,
    ACTIONS(1598), 1,
      sym_identifier,
    ACTIONS(1601), 1,
      sym_comment,
    ACTIONS(1604), 1,
      sym__dedent,
    STATE(469), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [17789] = 4,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1594), 1,
      sym_identifier,
    ACTIONS(1606), 1,
      sym__dedent,
    STATE(469), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [17804] = 2,
    ACTIONS(1608), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(1610), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [17815] = 2,
    ACTIONS(1612), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(1614), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [17826] = 3,
    ACTIONS(1616), 2,
      sym__audio_name,
      sym__audio_list,
    ACTIONS(1618), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(721), 2,
      sym__audio_file,
      sym_string,
  [17839] = 4,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1594), 1,
      sym_identifier,
    ACTIONS(1620), 1,
      sym__dedent,
    STATE(469), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [17854] = 2,
    ACTIONS(1622), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(1624), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [17865] = 3,
    ACTIONS(1618), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1626), 2,
      sym__audio_name,
      sym__audio_list,
    STATE(699), 2,
      sym__audio_file,
      sym_string,
  [17878] = 4,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1594), 1,
      sym_identifier,
    ACTIONS(1628), 1,
      sym__dedent,
    STATE(469), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [17893] = 2,
    ACTIONS(425), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(427), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [17904] = 2,
    ACTIONS(1630), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(1632), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [17915] = 4,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1594), 1,
      sym_identifier,
    ACTIONS(1634), 1,
      sym__dedent,
    STATE(469), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [17930] = 5,
    ACTIONS(1468), 1,
      sym__newline,
    ACTIONS(1636), 1,
      sym_identifier,
    STATE(64), 1,
      sym_string,
    STATE(509), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(249), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [17947] = 2,
    ACTIONS(1638), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(1640), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [17958] = 6,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1642), 1,
      sym_identifier,
    ACTIONS(1644), 1,
      anon_sym_EQ,
    STATE(233), 1,
      sym__atl_block,
    STATE(490), 1,
      aux_sym_menu_caption_repeat1,
    STATE(972), 1,
      sym__block_colon,
  [17977] = 5,
    ACTIONS(1450), 1,
      sym__newline,
    ACTIONS(1646), 1,
      sym_identifier,
    STATE(68), 1,
      sym_string,
    STATE(523), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [17994] = 5,
    ACTIONS(1650), 1,
      sym__dotted_label_name,
    ACTIONS(1652), 1,
      anon_sym_expression,
    ACTIONS(1654), 1,
      anon_sym_screen,
    STATE(701), 1,
      sym__label_name,
    ACTIONS(1648), 2,
      sym_identifier,
      sym_expression,
  [18011] = 6,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1656), 1,
      anon_sym_with,
    ACTIONS(1658), 1,
      anon_sym_as,
    ACTIONS(1660), 1,
      sym__newline,
    STATE(307), 1,
      sym__atl_block,
    STATE(972), 1,
      sym__block_colon,
  [18030] = 4,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1594), 1,
      sym_identifier,
    ACTIONS(1662), 1,
      sym__dedent,
    STATE(469), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [18045] = 4,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1594), 1,
      sym_identifier,
    ACTIONS(1664), 1,
      sym__dedent,
    STATE(469), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [18060] = 4,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1594), 1,
      sym_identifier,
    ACTIONS(1666), 1,
      sym__dedent,
    STATE(469), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [18075] = 3,
    ACTIONS(1668), 1,
      sym_identifier,
    STATE(490), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(1557), 4,
      anon_sym_COLON,
      anon_sym_EQ,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [18088] = 4,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1594), 1,
      sym_identifier,
    ACTIONS(1671), 1,
      sym__dedent,
    STATE(469), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [18103] = 2,
    ACTIONS(1673), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(1675), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [18114] = 5,
    ACTIONS(1679), 1,
      sym__dotted_label_name,
    ACTIONS(1681), 1,
      anon_sym_expression,
    ACTIONS(1683), 1,
      anon_sym_screen,
    STATE(731), 1,
      sym__label_name,
    ACTIONS(1677), 2,
      sym_identifier,
      sym_expression,
  [18131] = 4,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1594), 1,
      sym_identifier,
    ACTIONS(1685), 1,
      sym__dedent,
    STATE(469), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [18146] = 3,
    ACTIONS(1618), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1687), 2,
      sym__audio_name,
      sym__audio_list,
    STATE(723), 2,
      sym__audio_file,
      sym_string,
  [18159] = 3,
    ACTIONS(1618), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1689), 2,
      sym__audio_name,
      sym__audio_list,
    STATE(725), 2,
      sym__audio_file,
      sym_string,
  [18172] = 6,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1642), 1,
      sym_identifier,
    ACTIONS(1691), 1,
      anon_sym_EQ,
    STATE(327), 1,
      sym__atl_block,
    STATE(490), 1,
      aux_sym_menu_caption_repeat1,
    STATE(739), 1,
      sym__block_colon,
  [18191] = 6,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1693), 1,
      anon_sym_with,
    ACTIONS(1695), 1,
      anon_sym_as,
    ACTIONS(1697), 1,
      sym__newline,
    STATE(387), 1,
      sym__atl_block,
    STATE(739), 1,
      sym__block_colon,
  [18210] = 5,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1699), 1,
      anon_sym_with,
    ACTIONS(1701), 1,
      sym__newline,
    STATE(231), 1,
      sym__atl_block,
    STATE(739), 1,
      sym__block_colon,
  [18226] = 3,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1594), 1,
      sym_identifier,
    STATE(480), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [18238] = 2,
    ACTIONS(1705), 2,
      sym__newline,
      anon_sym_COLON,
    ACTIONS(1703), 3,
      sym_identifier,
      sym__screen_string,
      sym__screen_value,
  [18248] = 5,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    ACTIONS(1707), 1,
      anon_sym_hide,
    ACTIONS(1709), 1,
      anon_sym_in,
    ACTIONS(1711), 1,
      anon_sym_early,
    STATE(36), 1,
      sym__block_colon,
  [18264] = 4,
    ACTIONS(1713), 1,
      sym_identifier,
    STATE(503), 1,
      aux_sym_screen_language_statement_repeat2,
    STATE(644), 1,
      sym__keyword_property,
    ACTIONS(1716), 2,
      sym__newline,
      anon_sym_COLON,
  [18278] = 5,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1718), 1,
      anon_sym_hide,
    ACTIONS(1720), 1,
      anon_sym_in,
    ACTIONS(1722), 1,
      anon_sym_early,
    STATE(129), 1,
      sym__block_colon,
  [18294] = 5,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1590), 1,
      anon_sym_LPAREN,
    STATE(142), 1,
      sym__atl_block,
    STATE(614), 1,
      sym_parameter_list,
    STATE(739), 1,
      sym__block_colon,
  [18310] = 4,
    ACTIONS(1724), 1,
      sym_identifier,
    STATE(525), 1,
      aux_sym_menu_caption_repeat1,
    STATE(844), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [18324] = 5,
    ACTIONS(1726), 1,
      anon_sym_COLON,
    ACTIONS(1728), 1,
      anon_sym_if,
    ACTIONS(1730), 1,
      sym__newline,
    STATE(460), 1,
      sym__block_colon,
    STATE(482), 1,
      sym__block,
  [18340] = 2,
    ACTIONS(1539), 2,
      sym__newline,
      anon_sym_COLON,
    ACTIONS(1732), 3,
      sym_identifier,
      sym__screen_string,
      sym__screen_value,
  [18350] = 4,
    ACTIONS(1642), 1,
      sym_identifier,
    STATE(69), 1,
      sym_string,
    STATE(490), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(249), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [18364] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(134), 1,
      sym__block_colon,
    STATE(163), 1,
      sym__block,
    ACTIONS(1734), 2,
      anon_sym_hide,
      anon_sym_global,
  [18378] = 5,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    ACTIONS(1736), 1,
      anon_sym_hide,
    ACTIONS(1738), 1,
      anon_sym_in,
    ACTIONS(1740), 1,
      anon_sym_early,
    STATE(65), 1,
      sym__block_colon,
  [18394] = 3,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1594), 1,
      sym_identifier,
    STATE(474), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [18406] = 5,
    ACTIONS(1742), 1,
      anon_sym_LPAREN,
    ACTIONS(1744), 1,
      anon_sym_with,
    ACTIONS(1746), 1,
      anon_sym_nopredict,
    ACTIONS(1748), 1,
      sym__newline,
    STATE(634), 1,
      sym_parameter_list,
  [18422] = 5,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    ACTIONS(1750), 1,
      anon_sym_hide,
    ACTIONS(1752), 1,
      anon_sym_in,
    ACTIONS(1754), 1,
      anon_sym_early,
    STATE(73), 1,
      sym__block_colon,
  [18438] = 3,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1594), 1,
      sym_identifier,
    STATE(494), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [18450] = 5,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1590), 1,
      anon_sym_LPAREN,
    STATE(242), 1,
      sym__atl_block,
    STATE(627), 1,
      sym_parameter_list,
    STATE(972), 1,
      sym__block_colon,
  [18466] = 5,
    ACTIONS(1742), 1,
      anon_sym_LPAREN,
    ACTIONS(1756), 1,
      anon_sym_with,
    ACTIONS(1758), 1,
      anon_sym_nopredict,
    ACTIONS(1760), 1,
      sym__newline,
    STATE(628), 1,
      sym_parameter_list,
  [18482] = 5,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1762), 1,
      anon_sym_with,
    ACTIONS(1764), 1,
      sym__newline,
    STATE(266), 1,
      sym__atl_block,
    STATE(972), 1,
      sym__block_colon,
  [18498] = 4,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    STATE(120), 1,
      sym__block_colon,
    STATE(250), 1,
      sym__block,
    ACTIONS(1766), 2,
      anon_sym_hide,
      anon_sym_global,
  [18512] = 5,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1768), 1,
      anon_sym_with,
    ACTIONS(1770), 1,
      sym__newline,
    STATE(301), 1,
      sym__atl_block,
    STATE(972), 1,
      sym__block_colon,
  [18528] = 3,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1594), 1,
      sym_identifier,
    STATE(470), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [18540] = 5,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1772), 1,
      anon_sym_with,
    ACTIONS(1774), 1,
      sym__newline,
    STATE(309), 1,
      sym__atl_block,
    STATE(972), 1,
      sym__block_colon,
  [18556] = 4,
    ACTIONS(1642), 1,
      sym_identifier,
    STATE(87), 1,
      sym_string,
    STATE(490), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [18570] = 5,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1776), 1,
      anon_sym_with,
    ACTIONS(1778), 1,
      sym__newline,
    STATE(356), 1,
      sym__atl_block,
    STATE(972), 1,
      sym__block_colon,
  [18586] = 4,
    ACTIONS(1642), 1,
      sym_identifier,
    STATE(490), 1,
      aux_sym_menu_caption_repeat1,
    STATE(746), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [18600] = 3,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1594), 1,
      sym_identifier,
    STATE(477), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [18612] = 5,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1780), 1,
      anon_sym_with,
    ACTIONS(1782), 1,
      sym__newline,
    STATE(365), 1,
      sym__atl_block,
    STATE(739), 1,
      sym__block_colon,
  [18628] = 5,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1784), 1,
      anon_sym_hide,
    ACTIONS(1786), 1,
      anon_sym_in,
    ACTIONS(1788), 1,
      anon_sym_early,
    STATE(98), 1,
      sym__block_colon,
  [18644] = 5,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1790), 1,
      anon_sym_hide,
    ACTIONS(1792), 1,
      anon_sym_in,
    ACTIONS(1794), 1,
      anon_sym_early,
    STATE(63), 1,
      sym__block_colon,
  [18660] = 3,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1594), 1,
      sym_identifier,
    STATE(491), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [18672] = 4,
    ACTIONS(1798), 1,
      sym__dotted_label_name,
    ACTIONS(1800), 1,
      anon_sym_expression,
    STATE(777), 1,
      sym__label_name,
    ACTIONS(1796), 2,
      sym_identifier,
      sym_expression,
  [18686] = 4,
    ACTIONS(1804), 1,
      sym__dotted_label_name,
    ACTIONS(1806), 1,
      anon_sym_expression,
    STATE(976), 1,
      sym__label_name,
    ACTIONS(1802), 2,
      sym_identifier,
      sym_expression,
  [18700] = 2,
    ACTIONS(1810), 2,
      sym__newline,
      anon_sym_COLON,
    ACTIONS(1808), 3,
      sym_identifier,
      sym__screen_string,
      sym__screen_value,
  [18710] = 5,
    ACTIONS(1742), 1,
      anon_sym_LPAREN,
    ACTIONS(1812), 1,
      anon_sym_with,
    ACTIONS(1814), 1,
      anon_sym_nopredict,
    ACTIONS(1816), 1,
      sym__newline,
    STATE(609), 1,
      sym_parameter_list,
  [18726] = 5,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1818), 1,
      anon_sym_with,
    ACTIONS(1820), 1,
      sym__newline,
    STATE(173), 1,
      sym__atl_block,
    STATE(739), 1,
      sym__block_colon,
  [18742] = 4,
    ACTIONS(1544), 1,
      sym__screen_value_list,
    ACTIONS(1824), 1,
      sym__screen_string,
    STATE(646), 1,
      sym__positional_property,
    ACTIONS(1822), 2,
      sym_identifier,
      sym__screen_value,
  [18756] = 3,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1594), 1,
      sym_identifier,
    STATE(487), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [18768] = 3,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1594), 1,
      sym_identifier,
    STATE(488), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [18780] = 5,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1826), 1,
      anon_sym_with,
    ACTIONS(1828), 1,
      sym__newline,
    STATE(389), 1,
      sym__atl_block,
    STATE(739), 1,
      sym__block_colon,
  [18796] = 3,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1594), 1,
      sym_identifier,
    STATE(489), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [18808] = 3,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1594), 1,
      sym_identifier,
    STATE(468), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [18820] = 5,
    ACTIONS(1742), 1,
      anon_sym_LPAREN,
    ACTIONS(1830), 1,
      anon_sym_with,
    ACTIONS(1832), 1,
      anon_sym_nopredict,
    ACTIONS(1834), 1,
      sym__newline,
    STATE(632), 1,
      sym_parameter_list,
  [18836] = 3,
    ACTIONS(1838), 1,
      sym__dotted_label_name,
    STATE(714), 1,
      sym__label_name,
    ACTIONS(1836), 2,
      sym_identifier,
      sym_expression,
  [18847] = 4,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    ACTIONS(1840), 1,
      anon_sym_hide,
    ACTIONS(1842), 1,
      anon_sym_in,
    STATE(94), 1,
      sym__block_colon,
  [18860] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1844), 1,
      sym__newline,
    STATE(134), 1,
      sym__block_colon,
    STATE(159), 1,
      sym__block,
  [18873] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1846), 1,
      anon_sym_hide,
    ACTIONS(1848), 1,
      anon_sym_in,
    STATE(126), 1,
      sym__block_colon,
  [18886] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1850), 1,
      sym__newline,
    STATE(149), 1,
      sym__atl_block,
    STATE(739), 1,
      sym__block_colon,
  [18899] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1852), 1,
      anon_sym_hide,
    ACTIONS(1854), 1,
      anon_sym_in,
    STATE(39), 1,
      sym__block_colon,
  [18912] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1856), 1,
      anon_sym_hide,
    ACTIONS(1858), 1,
      anon_sym_in,
    STATE(42), 1,
      sym__block_colon,
  [18925] = 3,
    ACTIONS(1862), 1,
      sym__dotted_label_name,
    STATE(689), 1,
      sym__label_name,
    ACTIONS(1860), 2,
      sym_identifier,
      sym_expression,
  [18936] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1864), 1,
      sym__newline,
    STATE(227), 1,
      sym__atl_block,
    STATE(739), 1,
      sym__block_colon,
  [18949] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1866), 1,
      sym__newline,
    STATE(445), 1,
      sym__screen_line_end,
    STATE(753), 1,
      sym__block_colon,
  [18962] = 4,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    ACTIONS(1868), 1,
      anon_sym_hide,
    ACTIONS(1870), 1,
      anon_sym_in,
    STATE(71), 1,
      sym__block_colon,
  [18975] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1872), 1,
      sym__newline,
    STATE(134), 1,
      sym__block_colon,
    STATE(157), 1,
      sym__block,
  [18988] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1874), 1,
      sym__newline,
    STATE(167), 1,
      sym__atl_block,
    STATE(739), 1,
      sym__block_colon,
  [19001] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1876), 1,
      sym__newline,
    STATE(171), 1,
      sym__atl_block,
    STATE(739), 1,
      sym__block_colon,
  [19014] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1878), 1,
      sym__newline,
    STATE(175), 1,
      sym__atl_block,
    STATE(739), 1,
      sym__block_colon,
  [19027] = 4,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    ACTIONS(1590), 1,
      anon_sym_LPAREN,
    STATE(74), 1,
      sym__block_colon,
    STATE(690), 1,
      sym_parameter_list,
  [19040] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1642), 1,
      sym_identifier,
    STATE(490), 1,
      aux_sym_menu_caption_repeat1,
    STATE(975), 1,
      sym__block_colon,
  [19053] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1880), 1,
      sym__newline,
    STATE(347), 1,
      sym__atl_block,
    STATE(739), 1,
      sym__block_colon,
  [19066] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1882), 1,
      sym__newline,
    STATE(385), 1,
      sym__atl_block,
    STATE(739), 1,
      sym__block_colon,
  [19079] = 4,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    ACTIONS(1884), 1,
      sym__newline,
    STATE(120), 1,
      sym__block_colon,
    STATE(247), 1,
      sym__block,
  [19092] = 4,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    ACTIONS(1886), 1,
      sym__newline,
    STATE(120), 1,
      sym__block_colon,
    STATE(217), 1,
      sym__block,
  [19105] = 4,
    ACTIONS(1470), 1,
      sym_identifier,
    ACTIONS(1888), 1,
      anon_sym_with,
    ACTIONS(1890), 1,
      sym__newline,
    STATE(458), 1,
      aux_sym_menu_caption_repeat1,
  [19118] = 4,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    ACTIONS(1892), 1,
      anon_sym_hide,
    ACTIONS(1894), 1,
      anon_sym_in,
    STATE(81), 1,
      sym__block_colon,
  [19131] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1896), 1,
      sym__newline,
    STATE(264), 1,
      sym__atl_block,
    STATE(972), 1,
      sym__block_colon,
  [19144] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1898), 1,
      sym__newline,
    STATE(299), 1,
      sym__atl_block,
    STATE(972), 1,
      sym__block_colon,
  [19157] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1900), 1,
      sym__newline,
    STATE(305), 1,
      sym__atl_block,
    STATE(972), 1,
      sym__block_colon,
  [19170] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1590), 1,
      anon_sym_LPAREN,
    STATE(130), 1,
      sym__block_colon,
    STATE(697), 1,
      sym_parameter_list,
  [19183] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1902), 1,
      sym__newline,
    STATE(194), 1,
      sym__atl_block,
    STATE(739), 1,
      sym__block_colon,
  [19196] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1904), 1,
      sym__newline,
    STATE(333), 1,
      sym__atl_block,
    STATE(972), 1,
      sym__block_colon,
  [19209] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1906), 1,
      sym__newline,
    STATE(350), 1,
      sym__atl_block,
    STATE(972), 1,
      sym__block_colon,
  [19222] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1908), 1,
      sym__newline,
    STATE(354), 1,
      sym__atl_block,
    STATE(972), 1,
      sym__block_colon,
  [19235] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1910), 1,
      sym__newline,
    STATE(137), 1,
      sym__atl_block,
    STATE(972), 1,
      sym__block_colon,
  [19248] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1912), 1,
      sym__newline,
    STATE(378), 1,
      sym__atl_block,
    STATE(972), 1,
      sym__block_colon,
  [19261] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1914), 1,
      anon_sym_is,
    ACTIONS(1916), 1,
      anon_sym_take,
    STATE(888), 1,
      sym__block_colon,
  [19274] = 3,
    ACTIONS(1920), 1,
      sym__dotted_label_name,
    STATE(799), 1,
      sym__label_name,
    ACTIONS(1918), 2,
      sym_identifier,
      sym_expression,
  [19285] = 3,
    ACTIONS(1924), 1,
      sym__dotted_label_name,
    STATE(786), 1,
      sym__label_name,
    ACTIONS(1922), 2,
      sym_identifier,
      sym_expression,
  [19296] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1642), 1,
      sym_identifier,
    STATE(490), 1,
      aux_sym_menu_caption_repeat1,
    STATE(936), 1,
      sym__block_colon,
  [19309] = 4,
    ACTIONS(1470), 1,
      sym_identifier,
    ACTIONS(1926), 1,
      anon_sym_with,
    ACTIONS(1928), 1,
      sym__newline,
    STATE(458), 1,
      aux_sym_menu_caption_repeat1,
  [19322] = 4,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1930), 1,
      anon_sym_is,
    ACTIONS(1932), 1,
      anon_sym_take,
    STATE(974), 1,
      sym__block_colon,
  [19335] = 3,
    ACTIONS(1934), 1,
      sym_expression,
    STATE(951), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [19346] = 3,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    ACTIONS(1936), 1,
      anon_sym_in,
    STATE(80), 1,
      sym__block_colon,
  [19356] = 3,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1938), 1,
      anon_sym_in,
    STATE(88), 1,
      sym__block_colon,
  [19366] = 3,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1858), 1,
      anon_sym_in,
    STATE(42), 1,
      sym__block_colon,
  [19376] = 3,
    ACTIONS(1940), 1,
      sym_identifier,
    ACTIONS(1942), 1,
      sym__dotted_store_name,
    STATE(670), 1,
      sym__store_name,
  [19386] = 1,
    ACTIONS(1944), 3,
      anon_sym_COLON,
      anon_sym_hide,
      anon_sym_global,
  [19392] = 3,
    ACTIONS(1946), 1,
      sym_identifier,
    ACTIONS(1948), 1,
      sym__dotted_store_name,
    STATE(715), 1,
      sym__store_name,
  [19402] = 3,
    ACTIONS(1950), 1,
      sym_identifier,
    ACTIONS(1952), 1,
      sym__dotted_store_name,
    STATE(675), 1,
      sym__store_name,
  [19412] = 3,
    ACTIONS(1954), 1,
      sym_identifier,
    ACTIONS(1956), 1,
      sym__dotted_label_name,
    STATE(467), 1,
      sym__label_name,
  [19422] = 3,
    ACTIONS(1958), 1,
      sym_identifier,
    ACTIONS(1960), 1,
      anon_sym_screen,
    STATE(580), 1,
      aux_sym_menu_caption_repeat1,
  [19432] = 3,
    ACTIONS(1962), 1,
      sym_identifier,
    ACTIONS(1964), 1,
      anon_sym_screen,
    STATE(442), 1,
      aux_sym_menu_caption_repeat1,
  [19442] = 3,
    ACTIONS(1966), 1,
      sym_identifier,
    ACTIONS(1968), 1,
      sym__dotted_store_name,
    STATE(692), 1,
      sym__store_name,
  [19452] = 3,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    STATE(120), 1,
      sym__block_colon,
    STATE(228), 1,
      sym__block,
  [19462] = 1,
    ACTIONS(1810), 3,
      sym__newline,
      sym_identifier,
      anon_sym_COLON,
  [19468] = 1,
    ACTIONS(1539), 3,
      sym__newline,
      sym_identifier,
      anon_sym_COLON,
  [19474] = 3,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    ACTIONS(1870), 1,
      anon_sym_in,
    STATE(71), 1,
      sym__block_colon,
  [19484] = 3,
    ACTIONS(1970), 1,
      sym_identifier,
    ACTIONS(1972), 1,
      sym__dotted_store_name,
    STATE(691), 1,
      sym__store_name,
  [19494] = 3,
    ACTIONS(1974), 1,
      sym_identifier,
    ACTIONS(1976), 1,
      sym__dotted_store_name,
    STATE(696), 1,
      sym__store_name,
  [19504] = 3,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    ACTIONS(1842), 1,
      anon_sym_in,
    STATE(94), 1,
      sym__block_colon,
  [19514] = 3,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1978), 1,
      anon_sym_in,
    STATE(50), 1,
      sym__block_colon,
  [19524] = 1,
    ACTIONS(1980), 3,
      sym__newline,
      anon_sym_with,
      anon_sym_nopredict,
  [19530] = 3,
    ACTIONS(1982), 1,
      sym_identifier,
    ACTIONS(1984), 1,
      sym__dotted_store_name,
    STATE(847), 1,
      sym__store_name,
  [19540] = 3,
    ACTIONS(1986), 1,
      anon_sym_COLON,
    STATE(18), 1,
      sym__block,
    STATE(24), 1,
      sym__block_colon,
  [19550] = 3,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(134), 1,
      sym__block_colon,
    STATE(162), 1,
      sym__block,
  [19560] = 3,
    ACTIONS(1988), 1,
      sym_identifier,
    ACTIONS(1990), 1,
      sym__dotted_label_name,
    STATE(828), 1,
      sym__label_name,
  [19570] = 3,
    ACTIONS(1726), 1,
      anon_sym_COLON,
    STATE(460), 1,
      sym__block_colon,
    STATE(492), 1,
      sym__block,
  [19580] = 3,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1992), 1,
      sym_identifier,
    STATE(826), 1,
      sym__block_colon,
  [19590] = 3,
    ACTIONS(1994), 1,
      anon_sym_with,
    ACTIONS(1996), 1,
      anon_sym_nopredict,
    ACTIONS(1998), 1,
      sym__newline,
  [19600] = 3,
    ACTIONS(2000), 1,
      sym_identifier,
    ACTIONS(2002), 1,
      sym__dotted_store_name,
    STATE(864), 1,
      sym__store_name,
  [19610] = 1,
    ACTIONS(2004), 3,
      sym__dedent,
      sym_comment,
      sym_identifier,
  [19616] = 1,
    ACTIONS(2006), 3,
      sym__dedent,
      sym_comment,
      sym_identifier,
  [19622] = 3,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    STATE(120), 1,
      sym__block_colon,
    STATE(249), 1,
      sym__block,
  [19632] = 3,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(259), 1,
      sym__atl_block,
    STATE(739), 1,
      sym__block_colon,
  [19642] = 3,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(134), 1,
      sym__block_colon,
    STATE(293), 1,
      sym__block,
  [19652] = 3,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(134), 1,
      sym__block_colon,
    STATE(278), 1,
      sym__block,
  [19662] = 3,
    ACTIONS(2008), 1,
      sym_identifier,
    ACTIONS(2010), 1,
      sym__dotted_label_name,
    STATE(466), 1,
      sym__label_name,
  [19672] = 3,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(134), 1,
      sym__block_colon,
    STATE(314), 1,
      sym__block,
  [19682] = 3,
    ACTIONS(2012), 1,
      sym_identifier,
    ACTIONS(2014), 1,
      anon_sym_at,
    ACTIONS(2016), 1,
      sym__newline,
  [19692] = 3,
    ACTIONS(2018), 1,
      anon_sym_COLON,
    STATE(19), 1,
      sym__block,
    STATE(29), 1,
      sym__block_colon,
  [19702] = 3,
    ACTIONS(2020), 1,
      sym_identifier,
    ACTIONS(2022), 1,
      sym__dotted_store_name,
    STATE(700), 1,
      sym__store_name,
  [19712] = 3,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    ACTIONS(1894), 1,
      anon_sym_in,
    STATE(81), 1,
      sym__block_colon,
  [19722] = 3,
    ACTIONS(2024), 1,
      sym_identifier,
    ACTIONS(2026), 1,
      sym__dotted_store_name,
    STATE(716), 1,
      sym__store_name,
  [19732] = 3,
    ACTIONS(2028), 1,
      sym_identifier,
    ACTIONS(2030), 1,
      sym__dotted_store_name,
    STATE(719), 1,
      sym__store_name,
  [19742] = 3,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(2032), 1,
      anon_sym_take,
    STATE(811), 1,
      sym__block_colon,
  [19752] = 3,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    ACTIONS(2034), 1,
      anon_sym_in,
    STATE(93), 1,
      sym__block_colon,
  [19762] = 3,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(273), 1,
      sym__atl_block,
    STATE(972), 1,
      sym__block_colon,
  [19772] = 3,
    ACTIONS(2036), 1,
      anon_sym_with,
    ACTIONS(2038), 1,
      anon_sym_nopredict,
    ACTIONS(2040), 1,
      sym__newline,
  [19782] = 3,
    ACTIONS(2042), 1,
      sym_identifier,
    ACTIONS(2044), 1,
      sym__dotted_store_name,
    STATE(695), 1,
      sym__store_name,
  [19792] = 3,
    ACTIONS(2046), 1,
      sym_identifier,
    ACTIONS(2048), 1,
      sym__dotted_store_name,
    STATE(672), 1,
      sym__store_name,
  [19802] = 3,
    ACTIONS(2050), 1,
      sym_identifier,
    ACTIONS(2052), 1,
      sym__dotted_store_name,
    STATE(677), 1,
      sym__store_name,
  [19812] = 3,
    ACTIONS(2054), 1,
      anon_sym_with,
    ACTIONS(2056), 1,
      anon_sym_nopredict,
    ACTIONS(2058), 1,
      sym__newline,
  [19822] = 3,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(134), 1,
      sym__block_colon,
    STATE(286), 1,
      sym__block,
  [19832] = 3,
    ACTIONS(2060), 1,
      anon_sym_with,
    ACTIONS(2062), 1,
      anon_sym_nopredict,
    ACTIONS(2064), 1,
      sym__newline,
  [19842] = 3,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    ACTIONS(2066), 1,
      anon_sym_in,
    STATE(106), 1,
      sym__block_colon,
  [19852] = 3,
    ACTIONS(2018), 1,
      anon_sym_COLON,
    STATE(29), 1,
      sym__block_colon,
    STATE(35), 1,
      sym__block,
  [19862] = 3,
    ACTIONS(2068), 1,
      sym_identifier,
    ACTIONS(2070), 1,
      sym__dotted_store_name,
    STATE(706), 1,
      sym__store_name,
  [19872] = 3,
    ACTIONS(2072), 1,
      sym_identifier,
    ACTIONS(2074), 1,
      sym__dotted_store_name,
    STATE(688), 1,
      sym__store_name,
  [19882] = 3,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(134), 1,
      sym__block_colon,
    STATE(260), 1,
      sym__block,
  [19892] = 3,
    ACTIONS(2076), 1,
      sym_identifier,
    ACTIONS(2078), 1,
      sym__dotted_store_name,
    STATE(727), 1,
      sym__store_name,
  [19902] = 3,
    ACTIONS(2080), 1,
      sym_identifier,
    ACTIONS(2082), 1,
      sym__dotted_label_name,
    STATE(770), 1,
      sym__label_name,
  [19912] = 3,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(2084), 1,
      anon_sym_in,
    STATE(38), 1,
      sym__block_colon,
  [19922] = 1,
    ACTIONS(1980), 3,
      anon_sym_COLON,
      anon_sym_hide,
      anon_sym_global,
  [19928] = 1,
    ACTIONS(2086), 3,
      sym__newline,
      sym_identifier,
      anon_sym_COLON,
  [19934] = 3,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    STATE(120), 1,
      sym__block_colon,
    STATE(274), 1,
      sym__block,
  [19944] = 1,
    ACTIONS(2088), 3,
      sym__newline,
      sym_identifier,
      anon_sym_COLON,
  [19950] = 3,
    ACTIONS(2090), 1,
      sym_identifier,
    ACTIONS(2092), 1,
      anon_sym_at,
    ACTIONS(2094), 1,
      sym__newline,
  [19960] = 3,
    ACTIONS(2096), 1,
      sym_identifier,
    ACTIONS(2098), 1,
      anon_sym_screen,
    STATE(564), 1,
      aux_sym_menu_caption_repeat1,
  [19970] = 1,
    ACTIONS(1944), 3,
      sym__newline,
      anon_sym_with,
      anon_sym_nopredict,
  [19976] = 3,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    STATE(120), 1,
      sym__block_colon,
    STATE(279), 1,
      sym__block,
  [19986] = 3,
    ACTIONS(2100), 1,
      sym_identifier,
    ACTIONS(2102), 1,
      anon_sym_screen,
    STATE(443), 1,
      aux_sym_menu_caption_repeat1,
  [19996] = 1,
    ACTIONS(2104), 3,
      anon_sym_hide,
      anon_sym_show,
      anon_sym_clear,
  [20002] = 3,
    ACTIONS(2106), 1,
      sym_identifier,
    ACTIONS(2108), 1,
      sym__dotted_store_name,
    STATE(718), 1,
      sym__store_name,
  [20012] = 3,
    ACTIONS(2110), 1,
      sym_identifier,
    ACTIONS(2112), 1,
      sym__dotted_label_name,
    STATE(816), 1,
      sym__label_name,
  [20022] = 3,
    ACTIONS(2114), 1,
      sym_identifier,
    ACTIONS(2116), 1,
      sym__dotted_label_name,
    STATE(838), 1,
      sym__label_name,
  [20032] = 3,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    STATE(120), 1,
      sym__block_colon,
    STATE(284), 1,
      sym__block,
  [20042] = 3,
    ACTIONS(2118), 1,
      sym_identifier,
    ACTIONS(2120), 1,
      sym__dotted_store_name,
    STATE(726), 1,
      sym__store_name,
  [20052] = 3,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    STATE(120), 1,
      sym__block_colon,
    STATE(287), 1,
      sym__block,
  [20062] = 3,
    ACTIONS(1986), 1,
      anon_sym_COLON,
    STATE(24), 1,
      sym__block_colon,
    STATE(31), 1,
      sym__block,
  [20072] = 3,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1854), 1,
      anon_sym_in,
    STATE(39), 1,
      sym__block_colon,
  [20082] = 1,
    ACTIONS(2122), 3,
      anon_sym_hide,
      anon_sym_show,
      anon_sym_clear,
  [20088] = 3,
    ACTIONS(2124), 1,
      sym_identifier,
    ACTIONS(2126), 1,
      sym__dotted_store_name,
    STATE(959), 1,
      sym__store_name,
  [20098] = 3,
    ACTIONS(2128), 1,
      sym_identifier,
    ACTIONS(2130), 1,
      sym__dotted_store_name,
    STATE(960), 1,
      sym__store_name,
  [20108] = 3,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(2132), 1,
      sym_identifier,
    STATE(971), 1,
      sym__block_colon,
  [20118] = 3,
    ACTIONS(2134), 1,
      sym_identifier,
    ACTIONS(2136), 1,
      sym__dotted_store_name,
    STATE(702), 1,
      sym__store_name,
  [20128] = 3,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(2138), 1,
      anon_sym_take,
    STATE(732), 1,
      sym__block_colon,
  [20138] = 3,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    ACTIONS(1848), 1,
      anon_sym_in,
    STATE(126), 1,
      sym__block_colon,
  [20148] = 2,
    ACTIONS(2140), 1,
      sym_identifier,
    STATE(483), 1,
      aux_sym_menu_caption_repeat1,
  [20155] = 2,
    ACTIONS(2142), 1,
      anon_sym_RPAREN,
    ACTIONS(2144), 1,
      sym__parameter_blob,
  [20162] = 2,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(49), 1,
      sym__block_colon,
  [20169] = 2,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(804), 1,
      sym__block_colon,
  [20176] = 2,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    STATE(101), 1,
      sym__block_colon,
  [20183] = 2,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(817), 1,
      sym__block_colon,
  [20190] = 2,
    ACTIONS(2146), 1,
      anon_sym_with,
    ACTIONS(2148), 1,
      sym__newline,
  [20197] = 2,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(45), 1,
      sym__block_colon,
  [20204] = 2,
    ACTIONS(2150), 1,
      sym_expression,
    STATE(552), 1,
      sym__screen_condition,
  [20211] = 2,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    STATE(105), 1,
      sym__block_colon,
  [20218] = 2,
    ACTIONS(2152), 1,
      sym_expression,
    ACTIONS(2154), 1,
      sym__newline,
  [20225] = 2,
    ACTIONS(2156), 1,
      anon_sym_with,
    ACTIONS(2158), 1,
      sym__newline,
  [20232] = 2,
    ACTIONS(2160), 1,
      sym_identifier,
    STATE(497), 1,
      aux_sym_menu_caption_repeat1,
  [20239] = 2,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(800), 1,
      sym__block_colon,
  [20246] = 1,
    ACTIONS(2162), 2,
      sym__newline,
      anon_sym_COLON,
  [20251] = 2,
    ACTIONS(2164), 1,
      sym_expression,
    ACTIONS(2166), 1,
      sym__newline,
  [20258] = 2,
    ACTIONS(2168), 1,
      anon_sym_with,
    ACTIONS(2170), 1,
      sym__newline,
  [20265] = 2,
    ACTIONS(2172), 1,
      anon_sym_with,
    ACTIONS(2174), 1,
      sym__newline,
  [20272] = 2,
    ACTIONS(2176), 1,
      anon_sym_python,
    ACTIONS(2178), 1,
      aux_sym_init_python_statement_token1,
  [20279] = 2,
    ACTIONS(2180), 1,
      anon_sym_python,
    ACTIONS(2182), 1,
      aux_sym_init_python_statement_token1,
  [20286] = 2,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    STATE(110), 1,
      sym__block_colon,
  [20293] = 2,
    ACTIONS(2184), 1,
      anon_sym_from,
    ACTIONS(2186), 1,
      sym__newline,
  [20300] = 2,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    STATE(85), 1,
      sym__block_colon,
  [20307] = 2,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(53), 1,
      sym__block_colon,
  [20314] = 2,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(59), 1,
      sym__block_colon,
  [20321] = 2,
    ACTIONS(2188), 1,
      sym_expression,
    ACTIONS(2190), 1,
      sym__newline,
  [20328] = 2,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(944), 1,
      sym__block_colon,
  [20335] = 2,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    STATE(100), 1,
      sym__block_colon,
  [20342] = 2,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(54), 1,
      sym__block_colon,
  [20349] = 2,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(67), 1,
      sym__block_colon,
  [20356] = 1,
    ACTIONS(2192), 2,
      sym_identifier,
      anon_sym_strings,
  [20361] = 2,
    ACTIONS(2194), 1,
      sym_expression,
    ACTIONS(2196), 1,
      sym__newline,
  [20368] = 2,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    STATE(79), 1,
      sym__block_colon,
  [20375] = 2,
    ACTIONS(2198), 1,
      anon_sym_from,
    ACTIONS(2200), 1,
      sym__newline,
  [20382] = 2,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(123), 1,
      sym__block_colon,
  [20389] = 2,
    ACTIONS(2202), 1,
      anon_sym_with,
    ACTIONS(2204), 1,
      sym__newline,
  [20396] = 2,
    ACTIONS(2206), 1,
      sym_expression,
    ACTIONS(2208), 1,
      sym__newline,
  [20403] = 2,
    ACTIONS(2210), 1,
      anon_sym_with,
    ACTIONS(2212), 1,
      sym__newline,
  [20410] = 2,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    STATE(109), 1,
      sym__block_colon,
  [20417] = 2,
    ACTIONS(2214), 1,
      sym_identifier,
    STATE(579), 1,
      aux_sym_menu_caption_repeat1,
  [20424] = 1,
    ACTIONS(421), 2,
      sym__newline,
      sym_expression,
  [20429] = 2,
    ACTIONS(2216), 1,
      anon_sym_at,
    ACTIONS(2218), 1,
      sym__newline,
  [20436] = 1,
    ACTIONS(2220), 2,
      sym_identifier,
      anon_sym_strings,
  [20441] = 2,
    ACTIONS(2222), 1,
      anon_sym_at,
    ACTIONS(2224), 1,
      sym__newline,
  [20448] = 2,
    ACTIONS(2226), 1,
      anon_sym_RPAREN,
    ACTIONS(2228), 1,
      sym__parameter_blob,
  [20455] = 2,
    ACTIONS(2230), 1,
      anon_sym_with,
    ACTIONS(2232), 1,
      sym__newline,
  [20462] = 2,
    ACTIONS(2234), 1,
      anon_sym_from,
    ACTIONS(2236), 1,
      sym__newline,
  [20469] = 2,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(37), 1,
      sym__block_colon,
  [20476] = 2,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    STATE(136), 1,
      sym__block_colon,
  [20483] = 2,
    ACTIONS(2238), 1,
      anon_sym_with,
    ACTIONS(2240), 1,
      sym__newline,
  [20490] = 2,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(44), 1,
      sym__block_colon,
  [20497] = 2,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    STATE(92), 1,
      sym__block_colon,
  [20504] = 2,
    ACTIONS(2242), 1,
      anon_sym_with,
    ACTIONS(2244), 1,
      sym__newline,
  [20511] = 2,
    ACTIONS(2246), 1,
      sym_expression,
    ACTIONS(2248), 1,
      sym__newline,
  [20518] = 2,
    ACTIONS(2250), 1,
      anon_sym_with,
    ACTIONS(2252), 1,
      sym__newline,
  [20525] = 2,
    ACTIONS(2254), 1,
      sym_expression,
    ACTIONS(2256), 1,
      sym__newline,
  [20532] = 2,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(973), 1,
      sym__block_colon,
  [20539] = 2,
    ACTIONS(2258), 1,
      sym_expression,
    ACTIONS(2260), 1,
      sym__newline,
  [20546] = 2,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(83), 1,
      sym__block_colon,
  [20553] = 2,
    ACTIONS(1456), 1,
      anon_sym_COLON,
    STATE(116), 1,
      sym__block_colon,
  [20560] = 2,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(977), 1,
      sym__block_colon,
  [20567] = 2,
    ACTIONS(1411), 1,
      anon_sym_COLON,
    STATE(978), 1,
      sym__block_colon,
  [20574] = 2,
    ACTIONS(2262), 1,
      sym_identifier,
    STATE(559), 1,
      aux_sym_menu_caption_repeat1,
  [20581] = 2,
    ACTIONS(2264), 1,
      anon_sym_from,
    ACTIONS(2266), 1,
      sym__newline,
  [20588] = 1,
    ACTIONS(2268), 1,
      sym__newline,
  [20592] = 1,
    ACTIONS(2270), 1,
      sym_expression,
  [20596] = 1,
    ACTIONS(2272), 1,
      sym__at_expr_blob,
  [20600] = 1,
    ACTIONS(2274), 1,
      sym_identifier,
  [20604] = 1,
    ACTIONS(2276), 1,
      sym__indent,
  [20608] = 1,
    ACTIONS(2278), 1,
      sym__indent,
  [20612] = 1,
    ACTIONS(2280), 1,
      sym_identifier,
  [20616] = 1,
    ACTIONS(2282), 1,
      sym__newline,
  [20620] = 1,
    ACTIONS(2284), 1,
      sym_expression,
  [20624] = 1,
    ACTIONS(2286), 1,
      sym__newline,
  [20628] = 1,
    ACTIONS(2288), 1,
      sym__newline,
  [20632] = 1,
    ACTIONS(2290), 1,
      sym__newline,
  [20636] = 1,
    ACTIONS(2292), 1,
      sym__newline,
  [20640] = 1,
    ACTIONS(2294), 1,
      sym_expression,
  [20644] = 1,
    ACTIONS(2296), 1,
      sym__newline,
  [20648] = 1,
    ACTIONS(2298), 1,
      sym__newline,
  [20652] = 1,
    ACTIONS(2300), 1,
      sym__newline,
  [20656] = 1,
    ACTIONS(2302), 1,
      sym__newline,
  [20660] = 1,
    ACTIONS(2304), 1,
      sym_identifier,
  [20664] = 1,
    ACTIONS(2306), 1,
      sym_identifier,
  [20668] = 1,
    ACTIONS(2308), 1,
      anon_sym_RPAREN,
  [20672] = 1,
    ACTIONS(2310), 1,
      sym__newline,
  [20676] = 1,
    ACTIONS(2312), 1,
      sym_expression,
  [20680] = 1,
    ACTIONS(2314), 1,
      sym__for_target_blob,
  [20684] = 1,
    ACTIONS(2316), 1,
      sym_expression,
  [20688] = 1,
    ACTIONS(2318), 1,
      sym_expression,
  [20692] = 1,
    ACTIONS(2320), 1,
      sym__newline,
  [20696] = 1,
    ACTIONS(2322), 1,
      sym_expression,
  [20700] = 1,
    ACTIONS(2324), 1,
      sym__newline,
  [20704] = 1,
    ACTIONS(2326), 1,
      sym__newline,
  [20708] = 1,
    ACTIONS(2328), 1,
      sym_expression,
  [20712] = 1,
    ACTIONS(2330), 1,
      sym__newline,
  [20716] = 1,
    ACTIONS(2332), 1,
      sym__newline,
  [20720] = 1,
    ACTIONS(2334), 1,
      sym_identifier,
  [20724] = 1,
    ACTIONS(2336), 1,
      sym__indent,
  [20728] = 1,
    ACTIONS(2338), 1,
      sym__newline,
  [20732] = 1,
    ACTIONS(2340), 1,
      sym__newline,
  [20736] = 1,
    ACTIONS(2342), 1,
      sym_expression,
  [20740] = 1,
    ACTIONS(2344), 1,
      sym__newline,
  [20744] = 1,
    ACTIONS(2346), 1,
      sym__indent,
  [20748] = 1,
    ACTIONS(2348), 1,
      sym__newline,
  [20752] = 1,
    ACTIONS(2350), 1,
      sym_identifier,
  [20756] = 1,
    ACTIONS(2352), 1,
      sym_expression,
  [20760] = 1,
    ACTIONS(2354), 1,
      sym_expression,
  [20764] = 1,
    ACTIONS(2356), 1,
      sym__newline,
  [20768] = 1,
    ACTIONS(2358), 1,
      sym__newline,
  [20772] = 1,
    ACTIONS(2360), 1,
      sym__newline,
  [20776] = 1,
    ACTIONS(2362), 1,
      sym__newline,
  [20780] = 1,
    ACTIONS(2364), 1,
      sym__indent,
  [20784] = 1,
    ACTIONS(2366), 1,
      sym__newline,
  [20788] = 1,
    ACTIONS(2368), 1,
      sym_identifier,
  [20792] = 1,
    ACTIONS(2370), 1,
      anon_sym_python,
  [20796] = 1,
    ACTIONS(2372), 1,
      sym__newline,
  [20800] = 1,
    ACTIONS(2374), 1,
      sym_expression,
  [20804] = 1,
    ACTIONS(2376), 1,
      sym__newline,
  [20808] = 1,
    ACTIONS(2378), 1,
      sym_expression,
  [20812] = 1,
    ACTIONS(2380), 1,
      sym__newline,
  [20816] = 1,
    ACTIONS(2382), 1,
      sym__newline,
  [20820] = 1,
    ACTIONS(2384), 1,
      sym__newline,
  [20824] = 1,
    ACTIONS(2386), 1,
      sym_identifier,
  [20828] = 1,
    ACTIONS(2388), 1,
      sym__newline,
  [20832] = 1,
    ACTIONS(2390), 1,
      sym_expression,
  [20836] = 1,
    ACTIONS(2392), 1,
      sym__newline,
  [20840] = 1,
    ACTIONS(2394), 1,
      sym_expression,
  [20844] = 1,
    ACTIONS(2396), 1,
      sym_expression,
  [20848] = 1,
    ACTIONS(2398), 1,
      sym_expression,
  [20852] = 1,
    ACTIONS(2400), 1,
      sym_identifier,
  [20856] = 1,
    ACTIONS(2402), 1,
      sym__newline,
  [20860] = 1,
    ACTIONS(2404), 1,
      sym__newline,
  [20864] = 1,
    ACTIONS(2406), 1,
      sym_identifier,
  [20868] = 1,
    ACTIONS(2408), 1,
      sym_expression,
  [20872] = 1,
    ACTIONS(2410), 1,
      sym_expression,
  [20876] = 1,
    ACTIONS(2412), 1,
      sym__newline,
  [20880] = 1,
    ACTIONS(2414), 1,
      sym__newline,
  [20884] = 1,
    ACTIONS(2416), 1,
      sym__indent,
  [20888] = 1,
    ACTIONS(2418), 1,
      sym_expression,
  [20892] = 1,
    ACTIONS(2420), 1,
      sym__newline,
  [20896] = 1,
    ACTIONS(2422), 1,
      sym_identifier,
  [20900] = 1,
    ACTIONS(2424), 1,
      sym__newline,
  [20904] = 1,
    ACTIONS(2426), 1,
      sym__newline,
  [20908] = 1,
    ACTIONS(2428), 1,
      sym__newline,
  [20912] = 1,
    ACTIONS(2430), 1,
      sym_expression,
  [20916] = 1,
    ACTIONS(2432), 1,
      anon_sym_RPAREN,
  [20920] = 1,
    ACTIONS(2434), 1,
      sym__newline,
  [20924] = 1,
    ACTIONS(2436), 1,
      sym__newline,
  [20928] = 1,
    ACTIONS(2438), 1,
      sym__newline,
  [20932] = 1,
    ACTIONS(2440), 1,
      anon_sym_python,
  [20936] = 1,
    ACTIONS(2442), 1,
      sym_expression,
  [20940] = 1,
    ACTIONS(2444), 1,
      sym__newline,
  [20944] = 1,
    ACTIONS(2446), 1,
      sym__newline,
  [20948] = 1,
    ACTIONS(2448), 1,
      sym__newline,
  [20952] = 1,
    ACTIONS(2450), 1,
      sym__newline,
  [20956] = 1,
    ACTIONS(2452), 1,
      sym__newline,
  [20960] = 1,
    ACTIONS(2454), 1,
      sym__newline,
  [20964] = 1,
    ACTIONS(2456), 1,
      sym__newline,
  [20968] = 1,
    ACTIONS(2458), 1,
      sym__newline,
  [20972] = 1,
    ACTIONS(2460), 1,
      sym__newline,
  [20976] = 1,
    ACTIONS(2462), 1,
      sym__newline,
  [20980] = 1,
    ACTIONS(2464), 1,
      sym__newline,
  [20984] = 1,
    ACTIONS(2466), 1,
      sym__newline,
  [20988] = 1,
    ACTIONS(2468), 1,
      ts_builtin_sym_end,
  [20992] = 1,
    ACTIONS(2470), 1,
      sym__newline,
  [20996] = 1,
    ACTIONS(2472), 1,
      sym__newline,
  [21000] = 1,
    ACTIONS(2474), 1,
      sym__newline,
  [21004] = 1,
    ACTIONS(2476), 1,
      sym__newline,
  [21008] = 1,
    ACTIONS(2478), 1,
      sym__newline,
  [21012] = 1,
    ACTIONS(2480), 1,
      sym__newline,
  [21016] = 1,
    ACTIONS(2482), 1,
      sym__newline,
  [21020] = 1,
    ACTIONS(2484), 1,
      sym_expression,
  [21024] = 1,
    ACTIONS(2486), 1,
      sym__newline,
  [21028] = 1,
    ACTIONS(2488), 1,
      sym_expression,
  [21032] = 1,
    ACTIONS(2490), 1,
      sym__newline,
  [21036] = 1,
    ACTIONS(2492), 1,
      sym__newline,
  [21040] = 1,
    ACTIONS(2494), 1,
      sym__newline,
  [21044] = 1,
    ACTIONS(2496), 1,
      sym__newline,
  [21048] = 1,
    ACTIONS(2498), 1,
      anon_sym_EQ,
  [21052] = 1,
    ACTIONS(2500), 1,
      sym__newline,
  [21056] = 1,
    ACTIONS(2502), 1,
      sym__newline,
  [21060] = 1,
    ACTIONS(2504), 1,
      sym__newline,
  [21064] = 1,
    ACTIONS(2506), 1,
      sym__newline,
  [21068] = 1,
    ACTIONS(2508), 1,
      sym__newline,
  [21072] = 1,
    ACTIONS(2510), 1,
      sym_expression,
  [21076] = 1,
    ACTIONS(2512), 1,
      sym__newline,
  [21080] = 1,
    ACTIONS(2514), 1,
      sym__newline,
  [21084] = 1,
    ACTIONS(2516), 1,
      sym__newline,
  [21088] = 1,
    ACTIONS(2518), 1,
      sym_expression,
  [21092] = 1,
    ACTIONS(2520), 1,
      sym__newline,
  [21096] = 1,
    ACTIONS(2522), 1,
      sym_expression,
  [21100] = 1,
    ACTIONS(2524), 1,
      sym__newline,
  [21104] = 1,
    ACTIONS(2526), 1,
      sym__newline,
  [21108] = 1,
    ACTIONS(2528), 1,
      sym_expression,
  [21112] = 1,
    ACTIONS(2530), 1,
      sym_expression,
  [21116] = 1,
    ACTIONS(2532), 1,
      anon_sym_EQ,
  [21120] = 1,
    ACTIONS(2534), 1,
      anon_sym_in,
  [21124] = 1,
    ACTIONS(2536), 1,
      sym_expression,
  [21128] = 1,
    ACTIONS(2538), 1,
      sym__newline,
  [21132] = 1,
    ACTIONS(2540), 1,
      sym__newline,
  [21136] = 1,
    ACTIONS(2542), 1,
      sym__newline,
  [21140] = 1,
    ACTIONS(2544), 1,
      sym__newline,
  [21144] = 1,
    ACTIONS(2546), 1,
      sym__newline,
  [21148] = 1,
    ACTIONS(2548), 1,
      sym__newline,
  [21152] = 1,
    ACTIONS(2550), 1,
      sym__newline,
  [21156] = 1,
    ACTIONS(2552), 1,
      sym_identifier,
  [21160] = 1,
    ACTIONS(2554), 1,
      sym__newline,
  [21164] = 1,
    ACTIONS(2556), 1,
      sym_identifier,
  [21168] = 1,
    ACTIONS(2558), 1,
      sym__newline,
  [21172] = 1,
    ACTIONS(2560), 1,
      sym__newline,
  [21176] = 1,
    ACTIONS(2562), 1,
      sym_expression,
  [21180] = 1,
    ACTIONS(2564), 1,
      sym__newline,
  [21184] = 1,
    ACTIONS(2566), 1,
      sym_expression,
  [21188] = 1,
    ACTIONS(2568), 1,
      sym__newline,
  [21192] = 1,
    ACTIONS(2570), 1,
      sym__newline,
  [21196] = 1,
    ACTIONS(2572), 1,
      sym__newline,
  [21200] = 1,
    ACTIONS(2574), 1,
      sym__newline,
  [21204] = 1,
    ACTIONS(2576), 1,
      sym__newline,
  [21208] = 1,
    ACTIONS(2578), 1,
      sym_identifier,
  [21212] = 1,
    ACTIONS(2580), 1,
      sym__newline,
  [21216] = 1,
    ACTIONS(2582), 1,
      sym_expression,
  [21220] = 1,
    ACTIONS(2584), 1,
      sym__newline,
  [21224] = 1,
    ACTIONS(2586), 1,
      sym_expression,
  [21228] = 1,
    ACTIONS(2588), 1,
      sym__newline,
  [21232] = 1,
    ACTIONS(2590), 1,
      sym_expression,
  [21236] = 1,
    ACTIONS(2592), 1,
      sym_expression,
  [21240] = 1,
    ACTIONS(2594), 1,
      sym_expression,
  [21244] = 1,
    ACTIONS(2596), 1,
      sym_expression,
  [21248] = 1,
    ACTIONS(2598), 1,
      sym__newline,
  [21252] = 1,
    ACTIONS(2600), 1,
      sym_identifier,
  [21256] = 1,
    ACTIONS(2602), 1,
      sym_expression,
  [21260] = 1,
    ACTIONS(2604), 1,
      sym_identifier,
  [21264] = 1,
    ACTIONS(2606), 1,
      sym_identifier,
  [21268] = 1,
    ACTIONS(2608), 1,
      sym__indent,
  [21272] = 1,
    ACTIONS(2610), 1,
      sym_identifier,
  [21276] = 1,
    ACTIONS(2612), 1,
      sym__newline,
  [21280] = 1,
    ACTIONS(2614), 1,
      sym_expression,
  [21284] = 1,
    ACTIONS(2616), 1,
      sym_identifier,
  [21288] = 1,
    ACTIONS(2618), 1,
      anon_sym_in,
  [21292] = 1,
    ACTIONS(2620), 1,
      sym_expression,
  [21296] = 1,
    ACTIONS(2622), 1,
      sym__at_expr_blob,
  [21300] = 1,
    ACTIONS(2624), 1,
      sym_identifier,
  [21304] = 1,
    ACTIONS(2626), 1,
      sym__newline,
  [21308] = 1,
    ACTIONS(2628), 1,
      sym_expression,
  [21312] = 1,
    ACTIONS(2630), 1,
      sym_expression,
  [21316] = 1,
    ACTIONS(2632), 1,
      sym_expression,
  [21320] = 1,
    ACTIONS(2634), 1,
      sym__at_expr_blob,
  [21324] = 1,
    ACTIONS(2636), 1,
      sym_expression,
  [21328] = 1,
    ACTIONS(2638), 1,
      sym_expression,
  [21332] = 1,
    ACTIONS(2640), 1,
      sym_expression,
  [21336] = 1,
    ACTIONS(2642), 1,
      sym_expression,
  [21340] = 1,
    ACTIONS(2644), 1,
      sym__at_expr_blob,
  [21344] = 1,
    ACTIONS(2646), 1,
      sym_expression,
  [21348] = 1,
    ACTIONS(2648), 1,
      sym__at_expr_blob,
  [21352] = 1,
    ACTIONS(2650), 1,
      sym_identifier,
  [21356] = 1,
    ACTIONS(2652), 1,
      sym_expression,
  [21360] = 1,
    ACTIONS(2654), 1,
      sym__indent,
  [21364] = 1,
    ACTIONS(2656), 1,
      sym_expression,
  [21368] = 1,
    ACTIONS(2658), 1,
      sym__newline,
  [21372] = 1,
    ACTIONS(2660), 1,
      sym_expression,
  [21376] = 1,
    ACTIONS(2662), 1,
      sym_expression,
  [21380] = 1,
    ACTIONS(2664), 1,
      sym_expression,
  [21384] = 1,
    ACTIONS(2666), 1,
      sym_expression,
  [21388] = 1,
    ACTIONS(2668), 1,
      sym__newline,
  [21392] = 1,
    ACTIONS(2670), 1,
      sym_expression,
  [21396] = 1,
    ACTIONS(2672), 1,
      sym_expression,
  [21400] = 1,
    ACTIONS(2674), 1,
      sym_expression,
  [21404] = 1,
    ACTIONS(2676), 1,
      sym__newline,
  [21408] = 1,
    ACTIONS(2678), 1,
      sym_expression,
  [21412] = 1,
    ACTIONS(2680), 1,
      sym_expression,
  [21416] = 1,
    ACTIONS(2682), 1,
      sym_expression,
  [21420] = 1,
    ACTIONS(2684), 1,
      sym_expression,
  [21424] = 1,
    ACTIONS(2686), 1,
      sym_identifier,
  [21428] = 1,
    ACTIONS(2688), 1,
      sym_expression,
  [21432] = 1,
    ACTIONS(2690), 1,
      sym__newline,
  [21436] = 1,
    ACTIONS(2692), 1,
      sym__newline,
  [21440] = 1,
    ACTIONS(2694), 1,
      sym__newline,
  [21444] = 1,
    ACTIONS(2696), 1,
      sym_expression,
  [21448] = 1,
    ACTIONS(2698), 1,
      sym_expression,
  [21452] = 1,
    ACTIONS(2700), 1,
      sym__indent,
  [21456] = 1,
    ACTIONS(2702), 1,
      sym_expression,
  [21460] = 1,
    ACTIONS(2704), 1,
      sym__newline,
  [21464] = 1,
    ACTIONS(2706), 1,
      sym__newline,
  [21468] = 1,
    ACTIONS(2708), 1,
      sym__indent,
  [21472] = 1,
    ACTIONS(2710), 1,
      sym_identifier,
  [21476] = 1,
    ACTIONS(2712), 1,
      sym_expression,
  [21480] = 1,
    ACTIONS(2714), 1,
      sym__newline,
  [21484] = 1,
    ACTIONS(2716), 1,
      sym__for_target_blob,
  [21488] = 1,
    ACTIONS(2718), 1,
      sym_identifier,
  [21492] = 1,
    ACTIONS(2720), 1,
      sym_identifier,
  [21496] = 1,
    ACTIONS(2722), 1,
      anon_sym_EQ,
  [21500] = 1,
    ACTIONS(2724), 1,
      anon_sym_EQ,
  [21504] = 1,
    ACTIONS(2726), 1,
      sym__indent,
  [21508] = 1,
    ACTIONS(2728), 1,
      sym__indent,
  [21512] = 1,
    ACTIONS(2730), 1,
      sym__indent,
  [21516] = 1,
    ACTIONS(2732), 1,
      sym__indent,
  [21520] = 1,
    ACTIONS(2734), 1,
      sym__indent,
  [21524] = 1,
    ACTIONS(2736), 1,
      sym__indent,
  [21528] = 1,
    ACTIONS(2738), 1,
      sym__indent,
  [21532] = 1,
    ACTIONS(2740), 1,
      sym__indent,
  [21536] = 1,
    ACTIONS(2742), 1,
      sym__newline,
  [21540] = 1,
    ACTIONS(2744), 1,
      sym_expression,
  [21544] = 1,
    ACTIONS(2746), 1,
      sym__newline,
  [21548] = 1,
    ACTIONS(2748), 1,
      sym__newline,
  [21552] = 1,
    ACTIONS(2750), 1,
      sym__newline,
  [21556] = 1,
    ACTIONS(2752), 1,
      sym__newline,
  [21560] = 1,
    ACTIONS(2754), 1,
      sym__newline,
  [21564] = 1,
    ACTIONS(2756), 1,
      sym__newline,
  [21568] = 1,
    ACTIONS(2758), 1,
      sym__newline,
  [21572] = 1,
    ACTIONS(2760), 1,
      sym__newline,
  [21576] = 1,
    ACTIONS(2762), 1,
      sym__newline,
  [21580] = 1,
    ACTIONS(2764), 1,
      sym__newline,
  [21584] = 1,
    ACTIONS(2766), 1,
      sym__at_expr_blob,
  [21588] = 1,
    ACTIONS(2768), 1,
      sym_expression,
  [21592] = 1,
    ACTIONS(2770), 1,
      sym__newline,
  [21596] = 1,
    ACTIONS(2772), 1,
      sym__newline,
  [21600] = 1,
    ACTIONS(2774), 1,
      sym__newline,
  [21604] = 1,
    ACTIONS(2776), 1,
      sym_identifier,
  [21608] = 1,
    ACTIONS(2778), 1,
      sym_identifier,
  [21612] = 1,
    ACTIONS(2780), 1,
      sym_identifier,
  [21616] = 1,
    ACTIONS(2782), 1,
      sym_identifier,
  [21620] = 1,
    ACTIONS(2784), 1,
      sym_identifier,
  [21624] = 1,
    ACTIONS(2786), 1,
      sym__newline,
};

static const uint32_t ts_small_parse_table_map[] = {
  [SMALL_STATE(17)] = 0,
  [SMALL_STATE(18)] = 54,
  [SMALL_STATE(19)] = 108,
  [SMALL_STATE(20)] = 162,
  [SMALL_STATE(21)] = 216,
  [SMALL_STATE(22)] = 265,
  [SMALL_STATE(23)] = 314,
  [SMALL_STATE(24)] = 360,
  [SMALL_STATE(25)] = 406,
  [SMALL_STATE(26)] = 450,
  [SMALL_STATE(27)] = 496,
  [SMALL_STATE(28)] = 542,
  [SMALL_STATE(29)] = 588,
  [SMALL_STATE(30)] = 634,
  [SMALL_STATE(31)] = 678,
  [SMALL_STATE(32)] = 721,
  [SMALL_STATE(33)] = 764,
  [SMALL_STATE(34)] = 807,
  [SMALL_STATE(35)] = 850,
  [SMALL_STATE(36)] = 893,
  [SMALL_STATE(37)] = 937,
  [SMALL_STATE(38)] = 981,
  [SMALL_STATE(39)] = 1025,
  [SMALL_STATE(40)] = 1069,
  [SMALL_STATE(41)] = 1113,
  [SMALL_STATE(42)] = 1157,
  [SMALL_STATE(43)] = 1201,
  [SMALL_STATE(44)] = 1245,
  [SMALL_STATE(45)] = 1289,
  [SMALL_STATE(46)] = 1333,
  [SMALL_STATE(47)] = 1377,
  [SMALL_STATE(48)] = 1421,
  [SMALL_STATE(49)] = 1465,
  [SMALL_STATE(50)] = 1509,
  [SMALL_STATE(51)] = 1553,
  [SMALL_STATE(52)] = 1597,
  [SMALL_STATE(53)] = 1641,
  [SMALL_STATE(54)] = 1685,
  [SMALL_STATE(55)] = 1729,
  [SMALL_STATE(56)] = 1773,
  [SMALL_STATE(57)] = 1817,
  [SMALL_STATE(58)] = 1861,
  [SMALL_STATE(59)] = 1905,
  [SMALL_STATE(60)] = 1949,
  [SMALL_STATE(61)] = 1993,
  [SMALL_STATE(62)] = 2039,
  [SMALL_STATE(63)] = 2083,
  [SMALL_STATE(64)] = 2127,
  [SMALL_STATE(65)] = 2173,
  [SMALL_STATE(66)] = 2217,
  [SMALL_STATE(67)] = 2261,
  [SMALL_STATE(68)] = 2305,
  [SMALL_STATE(69)] = 2351,
  [SMALL_STATE(70)] = 2397,
  [SMALL_STATE(71)] = 2439,
  [SMALL_STATE(72)] = 2483,
  [SMALL_STATE(73)] = 2527,
  [SMALL_STATE(74)] = 2571,
  [SMALL_STATE(75)] = 2615,
  [SMALL_STATE(76)] = 2659,
  [SMALL_STATE(77)] = 2703,
  [SMALL_STATE(78)] = 2747,
  [SMALL_STATE(79)] = 2791,
  [SMALL_STATE(80)] = 2835,
  [SMALL_STATE(81)] = 2879,
  [SMALL_STATE(82)] = 2923,
  [SMALL_STATE(83)] = 2967,
  [SMALL_STATE(84)] = 3011,
  [SMALL_STATE(85)] = 3055,
  [SMALL_STATE(86)] = 3099,
  [SMALL_STATE(87)] = 3143,
  [SMALL_STATE(88)] = 3189,
  [SMALL_STATE(89)] = 3233,
  [SMALL_STATE(90)] = 3277,
  [SMALL_STATE(91)] = 3321,
  [SMALL_STATE(92)] = 3365,
  [SMALL_STATE(93)] = 3409,
  [SMALL_STATE(94)] = 3453,
  [SMALL_STATE(95)] = 3497,
  [SMALL_STATE(96)] = 3541,
  [SMALL_STATE(97)] = 3585,
  [SMALL_STATE(98)] = 3629,
  [SMALL_STATE(99)] = 3673,
  [SMALL_STATE(100)] = 3717,
  [SMALL_STATE(101)] = 3761,
  [SMALL_STATE(102)] = 3805,
  [SMALL_STATE(103)] = 3849,
  [SMALL_STATE(104)] = 3893,
  [SMALL_STATE(105)] = 3937,
  [SMALL_STATE(106)] = 3981,
  [SMALL_STATE(107)] = 4025,
  [SMALL_STATE(108)] = 4069,
  [SMALL_STATE(109)] = 4113,
  [SMALL_STATE(110)] = 4157,
  [SMALL_STATE(111)] = 4201,
  [SMALL_STATE(112)] = 4245,
  [SMALL_STATE(113)] = 4289,
  [SMALL_STATE(114)] = 4335,
  [SMALL_STATE(115)] = 4379,
  [SMALL_STATE(116)] = 4423,
  [SMALL_STATE(117)] = 4467,
  [SMALL_STATE(118)] = 4511,
  [SMALL_STATE(119)] = 4553,
  [SMALL_STATE(120)] = 4597,
  [SMALL_STATE(121)] = 4641,
  [SMALL_STATE(122)] = 4683,
  [SMALL_STATE(123)] = 4727,
  [SMALL_STATE(124)] = 4771,
  [SMALL_STATE(125)] = 4815,
  [SMALL_STATE(126)] = 4859,
  [SMALL_STATE(127)] = 4903,
  [SMALL_STATE(128)] = 4947,
  [SMALL_STATE(129)] = 4991,
  [SMALL_STATE(130)] = 5035,
  [SMALL_STATE(131)] = 5079,
  [SMALL_STATE(132)] = 5123,
  [SMALL_STATE(133)] = 5167,
  [SMALL_STATE(134)] = 5211,
  [SMALL_STATE(135)] = 5255,
  [SMALL_STATE(136)] = 5299,
  [SMALL_STATE(137)] = 5343,
  [SMALL_STATE(138)] = 5384,
  [SMALL_STATE(139)] = 5425,
  [SMALL_STATE(140)] = 5466,
  [SMALL_STATE(141)] = 5507,
  [SMALL_STATE(142)] = 5548,
  [SMALL_STATE(143)] = 5589,
  [SMALL_STATE(144)] = 5630,
  [SMALL_STATE(145)] = 5671,
  [SMALL_STATE(146)] = 5712,
  [SMALL_STATE(147)] = 5753,
  [SMALL_STATE(148)] = 5794,
  [SMALL_STATE(149)] = 5835,
  [SMALL_STATE(150)] = 5876,
  [SMALL_STATE(151)] = 5917,
  [SMALL_STATE(152)] = 5958,
  [SMALL_STATE(153)] = 5999,
  [SMALL_STATE(154)] = 6040,
  [SMALL_STATE(155)] = 6081,
  [SMALL_STATE(156)] = 6122,
  [SMALL_STATE(157)] = 6163,
  [SMALL_STATE(158)] = 6204,
  [SMALL_STATE(159)] = 6245,
  [SMALL_STATE(160)] = 6286,
  [SMALL_STATE(161)] = 6327,
  [SMALL_STATE(162)] = 6368,
  [SMALL_STATE(163)] = 6409,
  [SMALL_STATE(164)] = 6450,
  [SMALL_STATE(165)] = 6491,
  [SMALL_STATE(166)] = 6532,
  [SMALL_STATE(167)] = 6573,
  [SMALL_STATE(168)] = 6614,
  [SMALL_STATE(169)] = 6655,
  [SMALL_STATE(170)] = 6696,
  [SMALL_STATE(171)] = 6737,
  [SMALL_STATE(172)] = 6778,
  [SMALL_STATE(173)] = 6819,
  [SMALL_STATE(174)] = 6860,
  [SMALL_STATE(175)] = 6901,
  [SMALL_STATE(176)] = 6942,
  [SMALL_STATE(177)] = 6983,
  [SMALL_STATE(178)] = 7024,
  [SMALL_STATE(179)] = 7065,
  [SMALL_STATE(180)] = 7106,
  [SMALL_STATE(181)] = 7147,
  [SMALL_STATE(182)] = 7188,
  [SMALL_STATE(183)] = 7229,
  [SMALL_STATE(184)] = 7270,
  [SMALL_STATE(185)] = 7311,
  [SMALL_STATE(186)] = 7352,
  [SMALL_STATE(187)] = 7393,
  [SMALL_STATE(188)] = 7434,
  [SMALL_STATE(189)] = 7475,
  [SMALL_STATE(190)] = 7516,
  [SMALL_STATE(191)] = 7557,
  [SMALL_STATE(192)] = 7598,
  [SMALL_STATE(193)] = 7639,
  [SMALL_STATE(194)] = 7680,
  [SMALL_STATE(195)] = 7721,
  [SMALL_STATE(196)] = 7762,
  [SMALL_STATE(197)] = 7803,
  [SMALL_STATE(198)] = 7844,
  [SMALL_STATE(199)] = 7885,
  [SMALL_STATE(200)] = 7926,
  [SMALL_STATE(201)] = 7967,
  [SMALL_STATE(202)] = 8008,
  [SMALL_STATE(203)] = 8049,
  [SMALL_STATE(204)] = 8090,
  [SMALL_STATE(205)] = 8131,
  [SMALL_STATE(206)] = 8172,
  [SMALL_STATE(207)] = 8213,
  [SMALL_STATE(208)] = 8254,
  [SMALL_STATE(209)] = 8295,
  [SMALL_STATE(210)] = 8336,
  [SMALL_STATE(211)] = 8377,
  [SMALL_STATE(212)] = 8418,
  [SMALL_STATE(213)] = 8459,
  [SMALL_STATE(214)] = 8500,
  [SMALL_STATE(215)] = 8541,
  [SMALL_STATE(216)] = 8582,
  [SMALL_STATE(217)] = 8623,
  [SMALL_STATE(218)] = 8664,
  [SMALL_STATE(219)] = 8705,
  [SMALL_STATE(220)] = 8746,
  [SMALL_STATE(221)] = 8787,
  [SMALL_STATE(222)] = 8828,
  [SMALL_STATE(223)] = 8869,
  [SMALL_STATE(224)] = 8910,
  [SMALL_STATE(225)] = 8951,
  [SMALL_STATE(226)] = 8992,
  [SMALL_STATE(227)] = 9033,
  [SMALL_STATE(228)] = 9074,
  [SMALL_STATE(229)] = 9115,
  [SMALL_STATE(230)] = 9156,
  [SMALL_STATE(231)] = 9197,
  [SMALL_STATE(232)] = 9238,
  [SMALL_STATE(233)] = 9279,
  [SMALL_STATE(234)] = 9320,
  [SMALL_STATE(235)] = 9361,
  [SMALL_STATE(236)] = 9402,
  [SMALL_STATE(237)] = 9443,
  [SMALL_STATE(238)] = 9484,
  [SMALL_STATE(239)] = 9525,
  [SMALL_STATE(240)] = 9566,
  [SMALL_STATE(241)] = 9607,
  [SMALL_STATE(242)] = 9648,
  [SMALL_STATE(243)] = 9689,
  [SMALL_STATE(244)] = 9730,
  [SMALL_STATE(245)] = 9771,
  [SMALL_STATE(246)] = 9812,
  [SMALL_STATE(247)] = 9853,
  [SMALL_STATE(248)] = 9894,
  [SMALL_STATE(249)] = 9935,
  [SMALL_STATE(250)] = 9976,
  [SMALL_STATE(251)] = 10017,
  [SMALL_STATE(252)] = 10058,
  [SMALL_STATE(253)] = 10099,
  [SMALL_STATE(254)] = 10140,
  [SMALL_STATE(255)] = 10181,
  [SMALL_STATE(256)] = 10222,
  [SMALL_STATE(257)] = 10263,
  [SMALL_STATE(258)] = 10304,
  [SMALL_STATE(259)] = 10345,
  [SMALL_STATE(260)] = 10386,
  [SMALL_STATE(261)] = 10427,
  [SMALL_STATE(262)] = 10468,
  [SMALL_STATE(263)] = 10509,
  [SMALL_STATE(264)] = 10550,
  [SMALL_STATE(265)] = 10591,
  [SMALL_STATE(266)] = 10632,
  [SMALL_STATE(267)] = 10673,
  [SMALL_STATE(268)] = 10714,
  [SMALL_STATE(269)] = 10755,
  [SMALL_STATE(270)] = 10796,
  [SMALL_STATE(271)] = 10837,
  [SMALL_STATE(272)] = 10878,
  [SMALL_STATE(273)] = 10919,
  [SMALL_STATE(274)] = 10960,
  [SMALL_STATE(275)] = 11001,
  [SMALL_STATE(276)] = 11042,
  [SMALL_STATE(277)] = 11083,
  [SMALL_STATE(278)] = 11124,
  [SMALL_STATE(279)] = 11165,
  [SMALL_STATE(280)] = 11206,
  [SMALL_STATE(281)] = 11247,
  [SMALL_STATE(282)] = 11288,
  [SMALL_STATE(283)] = 11329,
  [SMALL_STATE(284)] = 11370,
  [SMALL_STATE(285)] = 11411,
  [SMALL_STATE(286)] = 11452,
  [SMALL_STATE(287)] = 11493,
  [SMALL_STATE(288)] = 11534,
  [SMALL_STATE(289)] = 11575,
  [SMALL_STATE(290)] = 11616,
  [SMALL_STATE(291)] = 11657,
  [SMALL_STATE(292)] = 11698,
  [SMALL_STATE(293)] = 11739,
  [SMALL_STATE(294)] = 11780,
  [SMALL_STATE(295)] = 11821,
  [SMALL_STATE(296)] = 11862,
  [SMALL_STATE(297)] = 11903,
  [SMALL_STATE(298)] = 11944,
  [SMALL_STATE(299)] = 11985,
  [SMALL_STATE(300)] = 12026,
  [SMALL_STATE(301)] = 12067,
  [SMALL_STATE(302)] = 12108,
  [SMALL_STATE(303)] = 12149,
  [SMALL_STATE(304)] = 12190,
  [SMALL_STATE(305)] = 12231,
  [SMALL_STATE(306)] = 12272,
  [SMALL_STATE(307)] = 12313,
  [SMALL_STATE(308)] = 12354,
  [SMALL_STATE(309)] = 12395,
  [SMALL_STATE(310)] = 12436,
  [SMALL_STATE(311)] = 12477,
  [SMALL_STATE(312)] = 12518,
  [SMALL_STATE(313)] = 12559,
  [SMALL_STATE(314)] = 12600,
  [SMALL_STATE(315)] = 12641,
  [SMALL_STATE(316)] = 12682,
  [SMALL_STATE(317)] = 12723,
  [SMALL_STATE(318)] = 12764,
  [SMALL_STATE(319)] = 12805,
  [SMALL_STATE(320)] = 12846,
  [SMALL_STATE(321)] = 12887,
  [SMALL_STATE(322)] = 12928,
  [SMALL_STATE(323)] = 12969,
  [SMALL_STATE(324)] = 13010,
  [SMALL_STATE(325)] = 13051,
  [SMALL_STATE(326)] = 13092,
  [SMALL_STATE(327)] = 13133,
  [SMALL_STATE(328)] = 13174,
  [SMALL_STATE(329)] = 13215,
  [SMALL_STATE(330)] = 13256,
  [SMALL_STATE(331)] = 13297,
  [SMALL_STATE(332)] = 13338,
  [SMALL_STATE(333)] = 13379,
  [SMALL_STATE(334)] = 13420,
  [SMALL_STATE(335)] = 13461,
  [SMALL_STATE(336)] = 13502,
  [SMALL_STATE(337)] = 13543,
  [SMALL_STATE(338)] = 13584,
  [SMALL_STATE(339)] = 13625,
  [SMALL_STATE(340)] = 13666,
  [SMALL_STATE(341)] = 13707,
  [SMALL_STATE(342)] = 13748,
  [SMALL_STATE(343)] = 13789,
  [SMALL_STATE(344)] = 13830,
  [SMALL_STATE(345)] = 13871,
  [SMALL_STATE(346)] = 13912,
  [SMALL_STATE(347)] = 13953,
  [SMALL_STATE(348)] = 13994,
  [SMALL_STATE(349)] = 14035,
  [SMALL_STATE(350)] = 14076,
  [SMALL_STATE(351)] = 14117,
  [SMALL_STATE(352)] = 14158,
  [SMALL_STATE(353)] = 14199,
  [SMALL_STATE(354)] = 14240,
  [SMALL_STATE(355)] = 14281,
  [SMALL_STATE(356)] = 14322,
  [SMALL_STATE(357)] = 14363,
  [SMALL_STATE(358)] = 14404,
  [SMALL_STATE(359)] = 14445,
  [SMALL_STATE(360)] = 14486,
  [SMALL_STATE(361)] = 14527,
  [SMALL_STATE(362)] = 14568,
  [SMALL_STATE(363)] = 14609,
  [SMALL_STATE(364)] = 14650,
  [SMALL_STATE(365)] = 14691,
  [SMALL_STATE(366)] = 14732,
  [SMALL_STATE(367)] = 14773,
  [SMALL_STATE(368)] = 14814,
  [SMALL_STATE(369)] = 14855,
  [SMALL_STATE(370)] = 14896,
  [SMALL_STATE(371)] = 14937,
  [SMALL_STATE(372)] = 14978,
  [SMALL_STATE(373)] = 15019,
  [SMALL_STATE(374)] = 15060,
  [SMALL_STATE(375)] = 15101,
  [SMALL_STATE(376)] = 15142,
  [SMALL_STATE(377)] = 15183,
  [SMALL_STATE(378)] = 15224,
  [SMALL_STATE(379)] = 15265,
  [SMALL_STATE(380)] = 15306,
  [SMALL_STATE(381)] = 15347,
  [SMALL_STATE(382)] = 15388,
  [SMALL_STATE(383)] = 15429,
  [SMALL_STATE(384)] = 15470,
  [SMALL_STATE(385)] = 15511,
  [SMALL_STATE(386)] = 15552,
  [SMALL_STATE(387)] = 15593,
  [SMALL_STATE(388)] = 15634,
  [SMALL_STATE(389)] = 15675,
  [SMALL_STATE(390)] = 15716,
  [SMALL_STATE(391)] = 15757,
  [SMALL_STATE(392)] = 15798,
  [SMALL_STATE(393)] = 15839,
  [SMALL_STATE(394)] = 15880,
  [SMALL_STATE(395)] = 15921,
  [SMALL_STATE(396)] = 15962,
  [SMALL_STATE(397)] = 16003,
  [SMALL_STATE(398)] = 16044,
  [SMALL_STATE(399)] = 16085,
  [SMALL_STATE(400)] = 16126,
  [SMALL_STATE(401)] = 16167,
  [SMALL_STATE(402)] = 16208,
  [SMALL_STATE(403)] = 16249,
  [SMALL_STATE(404)] = 16290,
  [SMALL_STATE(405)] = 16331,
  [SMALL_STATE(406)] = 16372,
  [SMALL_STATE(407)] = 16413,
  [SMALL_STATE(408)] = 16451,
  [SMALL_STATE(409)] = 16489,
  [SMALL_STATE(410)] = 16527,
  [SMALL_STATE(411)] = 16551,
  [SMALL_STATE(412)] = 16569,
  [SMALL_STATE(413)] = 16587,
  [SMALL_STATE(414)] = 16605,
  [SMALL_STATE(415)] = 16623,
  [SMALL_STATE(416)] = 16641,
  [SMALL_STATE(417)] = 16668,
  [SMALL_STATE(418)] = 16695,
  [SMALL_STATE(419)] = 16722,
  [SMALL_STATE(420)] = 16749,
  [SMALL_STATE(421)] = 16776,
  [SMALL_STATE(422)] = 16810,
  [SMALL_STATE(423)] = 16834,
  [SMALL_STATE(424)] = 16868,
  [SMALL_STATE(425)] = 16890,
  [SMALL_STATE(426)] = 16912,
  [SMALL_STATE(427)] = 16934,
  [SMALL_STATE(428)] = 16956,
  [SMALL_STATE(429)] = 16978,
  [SMALL_STATE(430)] = 17002,
  [SMALL_STATE(431)] = 17024,
  [SMALL_STATE(432)] = 17048,
  [SMALL_STATE(433)] = 17072,
  [SMALL_STATE(434)] = 17101,
  [SMALL_STATE(435)] = 17120,
  [SMALL_STATE(436)] = 17149,
  [SMALL_STATE(437)] = 17178,
  [SMALL_STATE(438)] = 17197,
  [SMALL_STATE(439)] = 17216,
  [SMALL_STATE(440)] = 17235,
  [SMALL_STATE(441)] = 17264,
  [SMALL_STATE(442)] = 17283,
  [SMALL_STATE(443)] = 17311,
  [SMALL_STATE(444)] = 17339,
  [SMALL_STATE(445)] = 17352,
  [SMALL_STATE(446)] = 17365,
  [SMALL_STATE(447)] = 17378,
  [SMALL_STATE(448)] = 17391,
  [SMALL_STATE(449)] = 17404,
  [SMALL_STATE(450)] = 17417,
  [SMALL_STATE(451)] = 17442,
  [SMALL_STATE(452)] = 17467,
  [SMALL_STATE(453)] = 17492,
  [SMALL_STATE(454)] = 17517,
  [SMALL_STATE(455)] = 17535,
  [SMALL_STATE(456)] = 17553,
  [SMALL_STATE(457)] = 17569,
  [SMALL_STATE(458)] = 17587,
  [SMALL_STATE(459)] = 17603,
  [SMALL_STATE(460)] = 17617,
  [SMALL_STATE(461)] = 17631,
  [SMALL_STATE(462)] = 17643,
  [SMALL_STATE(463)] = 17657,
  [SMALL_STATE(464)] = 17679,
  [SMALL_STATE(465)] = 17697,
  [SMALL_STATE(466)] = 17719,
  [SMALL_STATE(467)] = 17739,
  [SMALL_STATE(468)] = 17759,
  [SMALL_STATE(469)] = 17774,
  [SMALL_STATE(470)] = 17789,
  [SMALL_STATE(471)] = 17804,
  [SMALL_STATE(472)] = 17815,
  [SMALL_STATE(473)] = 17826,
  [SMALL_STATE(474)] = 17839,
  [SMALL_STATE(475)] = 17854,
  [SMALL_STATE(476)] = 17865,
  [SMALL_STATE(477)] = 17878,
  [SMALL_STATE(478)] = 17893,
  [SMALL_STATE(479)] = 17904,
  [SMALL_STATE(480)] = 17915,
  [SMALL_STATE(481)] = 17930,
  [SMALL_STATE(482)] = 17947,
  [SMALL_STATE(483)] = 17958,
  [SMALL_STATE(484)] = 17977,
  [SMALL_STATE(485)] = 17994,
  [SMALL_STATE(486)] = 18011,
  [SMALL_STATE(487)] = 18030,
  [SMALL_STATE(488)] = 18045,
  [SMALL_STATE(489)] = 18060,
  [SMALL_STATE(490)] = 18075,
  [SMALL_STATE(491)] = 18088,
  [SMALL_STATE(492)] = 18103,
  [SMALL_STATE(493)] = 18114,
  [SMALL_STATE(494)] = 18131,
  [SMALL_STATE(495)] = 18146,
  [SMALL_STATE(496)] = 18159,
  [SMALL_STATE(497)] = 18172,
  [SMALL_STATE(498)] = 18191,
  [SMALL_STATE(499)] = 18210,
  [SMALL_STATE(500)] = 18226,
  [SMALL_STATE(501)] = 18238,
  [SMALL_STATE(502)] = 18248,
  [SMALL_STATE(503)] = 18264,
  [SMALL_STATE(504)] = 18278,
  [SMALL_STATE(505)] = 18294,
  [SMALL_STATE(506)] = 18310,
  [SMALL_STATE(507)] = 18324,
  [SMALL_STATE(508)] = 18340,
  [SMALL_STATE(509)] = 18350,
  [SMALL_STATE(510)] = 18364,
  [SMALL_STATE(511)] = 18378,
  [SMALL_STATE(512)] = 18394,
  [SMALL_STATE(513)] = 18406,
  [SMALL_STATE(514)] = 18422,
  [SMALL_STATE(515)] = 18438,
  [SMALL_STATE(516)] = 18450,
  [SMALL_STATE(517)] = 18466,
  [SMALL_STATE(518)] = 18482,
  [SMALL_STATE(519)] = 18498,
  [SMALL_STATE(520)] = 18512,
  [SMALL_STATE(521)] = 18528,
  [SMALL_STATE(522)] = 18540,
  [SMALL_STATE(523)] = 18556,
  [SMALL_STATE(524)] = 18570,
  [SMALL_STATE(525)] = 18586,
  [SMALL_STATE(526)] = 18600,
  [SMALL_STATE(527)] = 18612,
  [SMALL_STATE(528)] = 18628,
  [SMALL_STATE(529)] = 18644,
  [SMALL_STATE(530)] = 18660,
  [SMALL_STATE(531)] = 18672,
  [SMALL_STATE(532)] = 18686,
  [SMALL_STATE(533)] = 18700,
  [SMALL_STATE(534)] = 18710,
  [SMALL_STATE(535)] = 18726,
  [SMALL_STATE(536)] = 18742,
  [SMALL_STATE(537)] = 18756,
  [SMALL_STATE(538)] = 18768,
  [SMALL_STATE(539)] = 18780,
  [SMALL_STATE(540)] = 18796,
  [SMALL_STATE(541)] = 18808,
  [SMALL_STATE(542)] = 18820,
  [SMALL_STATE(543)] = 18836,
  [SMALL_STATE(544)] = 18847,
  [SMALL_STATE(545)] = 18860,
  [SMALL_STATE(546)] = 18873,
  [SMALL_STATE(547)] = 18886,
  [SMALL_STATE(548)] = 18899,
  [SMALL_STATE(549)] = 18912,
  [SMALL_STATE(550)] = 18925,
  [SMALL_STATE(551)] = 18936,
  [SMALL_STATE(552)] = 18949,
  [SMALL_STATE(553)] = 18962,
  [SMALL_STATE(554)] = 18975,
  [SMALL_STATE(555)] = 18988,
  [SMALL_STATE(556)] = 19001,
  [SMALL_STATE(557)] = 19014,
  [SMALL_STATE(558)] = 19027,
  [SMALL_STATE(559)] = 19040,
  [SMALL_STATE(560)] = 19053,
  [SMALL_STATE(561)] = 19066,
  [SMALL_STATE(562)] = 19079,
  [SMALL_STATE(563)] = 19092,
  [SMALL_STATE(564)] = 19105,
  [SMALL_STATE(565)] = 19118,
  [SMALL_STATE(566)] = 19131,
  [SMALL_STATE(567)] = 19144,
  [SMALL_STATE(568)] = 19157,
  [SMALL_STATE(569)] = 19170,
  [SMALL_STATE(570)] = 19183,
  [SMALL_STATE(571)] = 19196,
  [SMALL_STATE(572)] = 19209,
  [SMALL_STATE(573)] = 19222,
  [SMALL_STATE(574)] = 19235,
  [SMALL_STATE(575)] = 19248,
  [SMALL_STATE(576)] = 19261,
  [SMALL_STATE(577)] = 19274,
  [SMALL_STATE(578)] = 19285,
  [SMALL_STATE(579)] = 19296,
  [SMALL_STATE(580)] = 19309,
  [SMALL_STATE(581)] = 19322,
  [SMALL_STATE(582)] = 19335,
  [SMALL_STATE(583)] = 19346,
  [SMALL_STATE(584)] = 19356,
  [SMALL_STATE(585)] = 19366,
  [SMALL_STATE(586)] = 19376,
  [SMALL_STATE(587)] = 19386,
  [SMALL_STATE(588)] = 19392,
  [SMALL_STATE(589)] = 19402,
  [SMALL_STATE(590)] = 19412,
  [SMALL_STATE(591)] = 19422,
  [SMALL_STATE(592)] = 19432,
  [SMALL_STATE(593)] = 19442,
  [SMALL_STATE(594)] = 19452,
  [SMALL_STATE(595)] = 19462,
  [SMALL_STATE(596)] = 19468,
  [SMALL_STATE(597)] = 19474,
  [SMALL_STATE(598)] = 19484,
  [SMALL_STATE(599)] = 19494,
  [SMALL_STATE(600)] = 19504,
  [SMALL_STATE(601)] = 19514,
  [SMALL_STATE(602)] = 19524,
  [SMALL_STATE(603)] = 19530,
  [SMALL_STATE(604)] = 19540,
  [SMALL_STATE(605)] = 19550,
  [SMALL_STATE(606)] = 19560,
  [SMALL_STATE(607)] = 19570,
  [SMALL_STATE(608)] = 19580,
  [SMALL_STATE(609)] = 19590,
  [SMALL_STATE(610)] = 19600,
  [SMALL_STATE(611)] = 19610,
  [SMALL_STATE(612)] = 19616,
  [SMALL_STATE(613)] = 19622,
  [SMALL_STATE(614)] = 19632,
  [SMALL_STATE(615)] = 19642,
  [SMALL_STATE(616)] = 19652,
  [SMALL_STATE(617)] = 19662,
  [SMALL_STATE(618)] = 19672,
  [SMALL_STATE(619)] = 19682,
  [SMALL_STATE(620)] = 19692,
  [SMALL_STATE(621)] = 19702,
  [SMALL_STATE(622)] = 19712,
  [SMALL_STATE(623)] = 19722,
  [SMALL_STATE(624)] = 19732,
  [SMALL_STATE(625)] = 19742,
  [SMALL_STATE(626)] = 19752,
  [SMALL_STATE(627)] = 19762,
  [SMALL_STATE(628)] = 19772,
  [SMALL_STATE(629)] = 19782,
  [SMALL_STATE(630)] = 19792,
  [SMALL_STATE(631)] = 19802,
  [SMALL_STATE(632)] = 19812,
  [SMALL_STATE(633)] = 19822,
  [SMALL_STATE(634)] = 19832,
  [SMALL_STATE(635)] = 19842,
  [SMALL_STATE(636)] = 19852,
  [SMALL_STATE(637)] = 19862,
  [SMALL_STATE(638)] = 19872,
  [SMALL_STATE(639)] = 19882,
  [SMALL_STATE(640)] = 19892,
  [SMALL_STATE(641)] = 19902,
  [SMALL_STATE(642)] = 19912,
  [SMALL_STATE(643)] = 19922,
  [SMALL_STATE(644)] = 19928,
  [SMALL_STATE(645)] = 19934,
  [SMALL_STATE(646)] = 19944,
  [SMALL_STATE(647)] = 19950,
  [SMALL_STATE(648)] = 19960,
  [SMALL_STATE(649)] = 19970,
  [SMALL_STATE(650)] = 19976,
  [SMALL_STATE(651)] = 19986,
  [SMALL_STATE(652)] = 19996,
  [SMALL_STATE(653)] = 20002,
  [SMALL_STATE(654)] = 20012,
  [SMALL_STATE(655)] = 20022,
  [SMALL_STATE(656)] = 20032,
  [SMALL_STATE(657)] = 20042,
  [SMALL_STATE(658)] = 20052,
  [SMALL_STATE(659)] = 20062,
  [SMALL_STATE(660)] = 20072,
  [SMALL_STATE(661)] = 20082,
  [SMALL_STATE(662)] = 20088,
  [SMALL_STATE(663)] = 20098,
  [SMALL_STATE(664)] = 20108,
  [SMALL_STATE(665)] = 20118,
  [SMALL_STATE(666)] = 20128,
  [SMALL_STATE(667)] = 20138,
  [SMALL_STATE(668)] = 20148,
  [SMALL_STATE(669)] = 20155,
  [SMALL_STATE(670)] = 20162,
  [SMALL_STATE(671)] = 20169,
  [SMALL_STATE(672)] = 20176,
  [SMALL_STATE(673)] = 20183,
  [SMALL_STATE(674)] = 20190,
  [SMALL_STATE(675)] = 20197,
  [SMALL_STATE(676)] = 20204,
  [SMALL_STATE(677)] = 20211,
  [SMALL_STATE(678)] = 20218,
  [SMALL_STATE(679)] = 20225,
  [SMALL_STATE(680)] = 20232,
  [SMALL_STATE(681)] = 20239,
  [SMALL_STATE(682)] = 20246,
  [SMALL_STATE(683)] = 20251,
  [SMALL_STATE(684)] = 20258,
  [SMALL_STATE(685)] = 20265,
  [SMALL_STATE(686)] = 20272,
  [SMALL_STATE(687)] = 20279,
  [SMALL_STATE(688)] = 20286,
  [SMALL_STATE(689)] = 20293,
  [SMALL_STATE(690)] = 20300,
  [SMALL_STATE(691)] = 20307,
  [SMALL_STATE(692)] = 20314,
  [SMALL_STATE(693)] = 20321,
  [SMALL_STATE(694)] = 20328,
  [SMALL_STATE(695)] = 20335,
  [SMALL_STATE(696)] = 20342,
  [SMALL_STATE(697)] = 20349,
  [SMALL_STATE(698)] = 20356,
  [SMALL_STATE(699)] = 20361,
  [SMALL_STATE(700)] = 20368,
  [SMALL_STATE(701)] = 20375,
  [SMALL_STATE(702)] = 20382,
  [SMALL_STATE(703)] = 20389,
  [SMALL_STATE(704)] = 20396,
  [SMALL_STATE(705)] = 20403,
  [SMALL_STATE(706)] = 20410,
  [SMALL_STATE(707)] = 20417,
  [SMALL_STATE(708)] = 20424,
  [SMALL_STATE(709)] = 20429,
  [SMALL_STATE(710)] = 20436,
  [SMALL_STATE(711)] = 20441,
  [SMALL_STATE(712)] = 20448,
  [SMALL_STATE(713)] = 20455,
  [SMALL_STATE(714)] = 20462,
  [SMALL_STATE(715)] = 20469,
  [SMALL_STATE(716)] = 20476,
  [SMALL_STATE(717)] = 20483,
  [SMALL_STATE(718)] = 20490,
  [SMALL_STATE(719)] = 20497,
  [SMALL_STATE(720)] = 20504,
  [SMALL_STATE(721)] = 20511,
  [SMALL_STATE(722)] = 20518,
  [SMALL_STATE(723)] = 20525,
  [SMALL_STATE(724)] = 20532,
  [SMALL_STATE(725)] = 20539,
  [SMALL_STATE(726)] = 20546,
  [SMALL_STATE(727)] = 20553,
  [SMALL_STATE(728)] = 20560,
  [SMALL_STATE(729)] = 20567,
  [SMALL_STATE(730)] = 20574,
  [SMALL_STATE(731)] = 20581,
  [SMALL_STATE(732)] = 20588,
  [SMALL_STATE(733)] = 20592,
  [SMALL_STATE(734)] = 20596,
  [SMALL_STATE(735)] = 20600,
  [SMALL_STATE(736)] = 20604,
  [SMALL_STATE(737)] = 20608,
  [SMALL_STATE(738)] = 20612,
  [SMALL_STATE(739)] = 20616,
  [SMALL_STATE(740)] = 20620,
  [SMALL_STATE(741)] = 20624,
  [SMALL_STATE(742)] = 20628,
  [SMALL_STATE(743)] = 20632,
  [SMALL_STATE(744)] = 20636,
  [SMALL_STATE(745)] = 20640,
  [SMALL_STATE(746)] = 20644,
  [SMALL_STATE(747)] = 20648,
  [SMALL_STATE(748)] = 20652,
  [SMALL_STATE(749)] = 20656,
  [SMALL_STATE(750)] = 20660,
  [SMALL_STATE(751)] = 20664,
  [SMALL_STATE(752)] = 20668,
  [SMALL_STATE(753)] = 20672,
  [SMALL_STATE(754)] = 20676,
  [SMALL_STATE(755)] = 20680,
  [SMALL_STATE(756)] = 20684,
  [SMALL_STATE(757)] = 20688,
  [SMALL_STATE(758)] = 20692,
  [SMALL_STATE(759)] = 20696,
  [SMALL_STATE(760)] = 20700,
  [SMALL_STATE(761)] = 20704,
  [SMALL_STATE(762)] = 20708,
  [SMALL_STATE(763)] = 20712,
  [SMALL_STATE(764)] = 20716,
  [SMALL_STATE(765)] = 20720,
  [SMALL_STATE(766)] = 20724,
  [SMALL_STATE(767)] = 20728,
  [SMALL_STATE(768)] = 20732,
  [SMALL_STATE(769)] = 20736,
  [SMALL_STATE(770)] = 20740,
  [SMALL_STATE(771)] = 20744,
  [SMALL_STATE(772)] = 20748,
  [SMALL_STATE(773)] = 20752,
  [SMALL_STATE(774)] = 20756,
  [SMALL_STATE(775)] = 20760,
  [SMALL_STATE(776)] = 20764,
  [SMALL_STATE(777)] = 20768,
  [SMALL_STATE(778)] = 20772,
  [SMALL_STATE(779)] = 20776,
  [SMALL_STATE(780)] = 20780,
  [SMALL_STATE(781)] = 20784,
  [SMALL_STATE(782)] = 20788,
  [SMALL_STATE(783)] = 20792,
  [SMALL_STATE(784)] = 20796,
  [SMALL_STATE(785)] = 20800,
  [SMALL_STATE(786)] = 20804,
  [SMALL_STATE(787)] = 20808,
  [SMALL_STATE(788)] = 20812,
  [SMALL_STATE(789)] = 20816,
  [SMALL_STATE(790)] = 20820,
  [SMALL_STATE(791)] = 20824,
  [SMALL_STATE(792)] = 20828,
  [SMALL_STATE(793)] = 20832,
  [SMALL_STATE(794)] = 20836,
  [SMALL_STATE(795)] = 20840,
  [SMALL_STATE(796)] = 20844,
  [SMALL_STATE(797)] = 20848,
  [SMALL_STATE(798)] = 20852,
  [SMALL_STATE(799)] = 20856,
  [SMALL_STATE(800)] = 20860,
  [SMALL_STATE(801)] = 20864,
  [SMALL_STATE(802)] = 20868,
  [SMALL_STATE(803)] = 20872,
  [SMALL_STATE(804)] = 20876,
  [SMALL_STATE(805)] = 20880,
  [SMALL_STATE(806)] = 20884,
  [SMALL_STATE(807)] = 20888,
  [SMALL_STATE(808)] = 20892,
  [SMALL_STATE(809)] = 20896,
  [SMALL_STATE(810)] = 20900,
  [SMALL_STATE(811)] = 20904,
  [SMALL_STATE(812)] = 20908,
  [SMALL_STATE(813)] = 20912,
  [SMALL_STATE(814)] = 20916,
  [SMALL_STATE(815)] = 20920,
  [SMALL_STATE(816)] = 20924,
  [SMALL_STATE(817)] = 20928,
  [SMALL_STATE(818)] = 20932,
  [SMALL_STATE(819)] = 20936,
  [SMALL_STATE(820)] = 20940,
  [SMALL_STATE(821)] = 20944,
  [SMALL_STATE(822)] = 20948,
  [SMALL_STATE(823)] = 20952,
  [SMALL_STATE(824)] = 20956,
  [SMALL_STATE(825)] = 20960,
  [SMALL_STATE(826)] = 20964,
  [SMALL_STATE(827)] = 20968,
  [SMALL_STATE(828)] = 20972,
  [SMALL_STATE(829)] = 20976,
  [SMALL_STATE(830)] = 20980,
  [SMALL_STATE(831)] = 20984,
  [SMALL_STATE(832)] = 20988,
  [SMALL_STATE(833)] = 20992,
  [SMALL_STATE(834)] = 20996,
  [SMALL_STATE(835)] = 21000,
  [SMALL_STATE(836)] = 21004,
  [SMALL_STATE(837)] = 21008,
  [SMALL_STATE(838)] = 21012,
  [SMALL_STATE(839)] = 21016,
  [SMALL_STATE(840)] = 21020,
  [SMALL_STATE(841)] = 21024,
  [SMALL_STATE(842)] = 21028,
  [SMALL_STATE(843)] = 21032,
  [SMALL_STATE(844)] = 21036,
  [SMALL_STATE(845)] = 21040,
  [SMALL_STATE(846)] = 21044,
  [SMALL_STATE(847)] = 21048,
  [SMALL_STATE(848)] = 21052,
  [SMALL_STATE(849)] = 21056,
  [SMALL_STATE(850)] = 21060,
  [SMALL_STATE(851)] = 21064,
  [SMALL_STATE(852)] = 21068,
  [SMALL_STATE(853)] = 21072,
  [SMALL_STATE(854)] = 21076,
  [SMALL_STATE(855)] = 21080,
  [SMALL_STATE(856)] = 21084,
  [SMALL_STATE(857)] = 21088,
  [SMALL_STATE(858)] = 21092,
  [SMALL_STATE(859)] = 21096,
  [SMALL_STATE(860)] = 21100,
  [SMALL_STATE(861)] = 21104,
  [SMALL_STATE(862)] = 21108,
  [SMALL_STATE(863)] = 21112,
  [SMALL_STATE(864)] = 21116,
  [SMALL_STATE(865)] = 21120,
  [SMALL_STATE(866)] = 21124,
  [SMALL_STATE(867)] = 21128,
  [SMALL_STATE(868)] = 21132,
  [SMALL_STATE(869)] = 21136,
  [SMALL_STATE(870)] = 21140,
  [SMALL_STATE(871)] = 21144,
  [SMALL_STATE(872)] = 21148,
  [SMALL_STATE(873)] = 21152,
  [SMALL_STATE(874)] = 21156,
  [SMALL_STATE(875)] = 21160,
  [SMALL_STATE(876)] = 21164,
  [SMALL_STATE(877)] = 21168,
  [SMALL_STATE(878)] = 21172,
  [SMALL_STATE(879)] = 21176,
  [SMALL_STATE(880)] = 21180,
  [SMALL_STATE(881)] = 21184,
  [SMALL_STATE(882)] = 21188,
  [SMALL_STATE(883)] = 21192,
  [SMALL_STATE(884)] = 21196,
  [SMALL_STATE(885)] = 21200,
  [SMALL_STATE(886)] = 21204,
  [SMALL_STATE(887)] = 21208,
  [SMALL_STATE(888)] = 21212,
  [SMALL_STATE(889)] = 21216,
  [SMALL_STATE(890)] = 21220,
  [SMALL_STATE(891)] = 21224,
  [SMALL_STATE(892)] = 21228,
  [SMALL_STATE(893)] = 21232,
  [SMALL_STATE(894)] = 21236,
  [SMALL_STATE(895)] = 21240,
  [SMALL_STATE(896)] = 21244,
  [SMALL_STATE(897)] = 21248,
  [SMALL_STATE(898)] = 21252,
  [SMALL_STATE(899)] = 21256,
  [SMALL_STATE(900)] = 21260,
  [SMALL_STATE(901)] = 21264,
  [SMALL_STATE(902)] = 21268,
  [SMALL_STATE(903)] = 21272,
  [SMALL_STATE(904)] = 21276,
  [SMALL_STATE(905)] = 21280,
  [SMALL_STATE(906)] = 21284,
  [SMALL_STATE(907)] = 21288,
  [SMALL_STATE(908)] = 21292,
  [SMALL_STATE(909)] = 21296,
  [SMALL_STATE(910)] = 21300,
  [SMALL_STATE(911)] = 21304,
  [SMALL_STATE(912)] = 21308,
  [SMALL_STATE(913)] = 21312,
  [SMALL_STATE(914)] = 21316,
  [SMALL_STATE(915)] = 21320,
  [SMALL_STATE(916)] = 21324,
  [SMALL_STATE(917)] = 21328,
  [SMALL_STATE(918)] = 21332,
  [SMALL_STATE(919)] = 21336,
  [SMALL_STATE(920)] = 21340,
  [SMALL_STATE(921)] = 21344,
  [SMALL_STATE(922)] = 21348,
  [SMALL_STATE(923)] = 21352,
  [SMALL_STATE(924)] = 21356,
  [SMALL_STATE(925)] = 21360,
  [SMALL_STATE(926)] = 21364,
  [SMALL_STATE(927)] = 21368,
  [SMALL_STATE(928)] = 21372,
  [SMALL_STATE(929)] = 21376,
  [SMALL_STATE(930)] = 21380,
  [SMALL_STATE(931)] = 21384,
  [SMALL_STATE(932)] = 21388,
  [SMALL_STATE(933)] = 21392,
  [SMALL_STATE(934)] = 21396,
  [SMALL_STATE(935)] = 21400,
  [SMALL_STATE(936)] = 21404,
  [SMALL_STATE(937)] = 21408,
  [SMALL_STATE(938)] = 21412,
  [SMALL_STATE(939)] = 21416,
  [SMALL_STATE(940)] = 21420,
  [SMALL_STATE(941)] = 21424,
  [SMALL_STATE(942)] = 21428,
  [SMALL_STATE(943)] = 21432,
  [SMALL_STATE(944)] = 21436,
  [SMALL_STATE(945)] = 21440,
  [SMALL_STATE(946)] = 21444,
  [SMALL_STATE(947)] = 21448,
  [SMALL_STATE(948)] = 21452,
  [SMALL_STATE(949)] = 21456,
  [SMALL_STATE(950)] = 21460,
  [SMALL_STATE(951)] = 21464,
  [SMALL_STATE(952)] = 21468,
  [SMALL_STATE(953)] = 21472,
  [SMALL_STATE(954)] = 21476,
  [SMALL_STATE(955)] = 21480,
  [SMALL_STATE(956)] = 21484,
  [SMALL_STATE(957)] = 21488,
  [SMALL_STATE(958)] = 21492,
  [SMALL_STATE(959)] = 21496,
  [SMALL_STATE(960)] = 21500,
  [SMALL_STATE(961)] = 21504,
  [SMALL_STATE(962)] = 21508,
  [SMALL_STATE(963)] = 21512,
  [SMALL_STATE(964)] = 21516,
  [SMALL_STATE(965)] = 21520,
  [SMALL_STATE(966)] = 21524,
  [SMALL_STATE(967)] = 21528,
  [SMALL_STATE(968)] = 21532,
  [SMALL_STATE(969)] = 21536,
  [SMALL_STATE(970)] = 21540,
  [SMALL_STATE(971)] = 21544,
  [SMALL_STATE(972)] = 21548,
  [SMALL_STATE(973)] = 21552,
  [SMALL_STATE(974)] = 21556,
  [SMALL_STATE(975)] = 21560,
  [SMALL_STATE(976)] = 21564,
  [SMALL_STATE(977)] = 21568,
  [SMALL_STATE(978)] = 21572,
  [SMALL_STATE(979)] = 21576,
  [SMALL_STATE(980)] = 21580,
  [SMALL_STATE(981)] = 21584,
  [SMALL_STATE(982)] = 21588,
  [SMALL_STATE(983)] = 21592,
  [SMALL_STATE(984)] = 21596,
  [SMALL_STATE(985)] = 21600,
  [SMALL_STATE(986)] = 21604,
  [SMALL_STATE(987)] = 21608,
  [SMALL_STATE(988)] = 21612,
  [SMALL_STATE(989)] = 21616,
  [SMALL_STATE(990)] = 21620,
  [SMALL_STATE(991)] = 21624,
};

static const TSParseActionEntry ts_parse_actions[] = {
  [0] = {.entry = {.count = 0, .reusable = false}},
  [1] = {.entry = {.count = 1, .reusable = false}}, RECOVER(),
  [3] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_source_file, 0, 0, 0),
  [5] = {.entry = {.count = 1, .reusable = false}}, SHIFT(433),
  [7] = {.entry = {.count = 1, .reusable = true}}, SHIFT(827),
  [9] = {.entry = {.count = 1, .reusable = false}}, SHIFT(484),
  [11] = {.entry = {.count = 1, .reusable = false}}, SHIFT(590),
  [13] = {.entry = {.count = 1, .reusable = false}}, SHIFT(591),
  [15] = {.entry = {.count = 1, .reusable = false}}, SHIFT(532),
  [17] = {.entry = {.count = 1, .reusable = false}}, SHIFT(485),
  [19] = {.entry = {.count = 1, .reusable = false}}, SHIFT(678),
  [21] = {.entry = {.count = 1, .reusable = false}}, SHIFT(741),
  [23] = {.entry = {.count = 1, .reusable = false}}, SHIFT(608),
  [25] = {.entry = {.count = 1, .reusable = false}}, SHIFT(759),
  [27] = {.entry = {.count = 1, .reusable = false}}, SHIFT(793),
  [29] = {.entry = {.count = 1, .reusable = false}}, SHIFT(755),
  [31] = {.entry = {.count = 1, .reusable = false}}, SHIFT(754),
  [33] = {.entry = {.count = 1, .reusable = false}}, SHIFT(528),
  [35] = {.entry = {.count = 1, .reusable = false}}, SHIFT(686),
  [37] = {.entry = {.count = 1, .reusable = true}}, SHIFT(853),
  [39] = {.entry = {.count = 1, .reusable = false}}, SHIFT(603),
  [41] = {.entry = {.count = 1, .reusable = false}}, SHIFT(610),
  [43] = {.entry = {.count = 1, .reusable = false}}, SHIFT(680),
  [45] = {.entry = {.count = 1, .reusable = false}}, SHIFT(453),
  [47] = {.entry = {.count = 1, .reusable = false}}, SHIFT(592),
  [49] = {.entry = {.count = 1, .reusable = false}}, SHIFT(735),
  [51] = {.entry = {.count = 1, .reusable = false}}, SHIFT(738),
  [53] = {.entry = {.count = 1, .reusable = false}}, SHIFT(751),
  [55] = {.entry = {.count = 1, .reusable = false}}, SHIFT(765),
  [57] = {.entry = {.count = 1, .reusable = false}}, SHIFT(457),
  [59] = {.entry = {.count = 1, .reusable = false}}, SHIFT(782),
  [61] = {.entry = {.count = 1, .reusable = false}}, SHIFT(791),
  [63] = {.entry = {.count = 1, .reusable = false}}, SHIFT(801),
  [65] = {.entry = {.count = 1, .reusable = false}}, SHIFT(647),
  [67] = {.entry = {.count = 1, .reusable = false}}, SHIFT(707),
  [69] = {.entry = {.count = 1, .reusable = false}}, SHIFT(661),
  [71] = {.entry = {.count = 1, .reusable = true}}, SHIFT(32),
  [73] = {.entry = {.count = 1, .reusable = true}}, SHIFT(8),
  [75] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_source_file, 1, 0, 0),
  [77] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_source_file, 2, 0, 0),
  [79] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0),
  [81] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(433),
  [84] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(827),
  [87] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(484),
  [90] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(590),
  [93] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(591),
  [96] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(532),
  [99] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(485),
  [102] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(678),
  [105] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(741),
  [108] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(608),
  [111] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(759),
  [114] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(793),
  [117] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(755),
  [120] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(754),
  [123] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(528),
  [126] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(686),
  [129] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(853),
  [132] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(603),
  [135] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(610),
  [138] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(680),
  [141] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(453),
  [144] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(592),
  [147] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(735),
  [150] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(738),
  [153] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(751),
  [156] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(765),
  [159] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(457),
  [162] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(782),
  [165] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(791),
  [168] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(801),
  [171] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(647),
  [174] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(707),
  [177] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(661),
  [180] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(32),
  [183] = {.entry = {.count = 1, .reusable = false}}, SHIFT(440),
  [185] = {.entry = {.count = 1, .reusable = true}}, SHIFT(763),
  [187] = {.entry = {.count = 1, .reusable = false}}, SHIFT(481),
  [189] = {.entry = {.count = 1, .reusable = false}}, SHIFT(617),
  [191] = {.entry = {.count = 1, .reusable = false}}, SHIFT(648),
  [193] = {.entry = {.count = 1, .reusable = false}}, SHIFT(531),
  [195] = {.entry = {.count = 1, .reusable = false}}, SHIFT(493),
  [197] = {.entry = {.count = 1, .reusable = false}}, SHIFT(683),
  [199] = {.entry = {.count = 1, .reusable = false}}, SHIFT(768),
  [201] = {.entry = {.count = 1, .reusable = false}}, SHIFT(664),
  [203] = {.entry = {.count = 1, .reusable = false}}, SHIFT(893),
  [205] = {.entry = {.count = 1, .reusable = false}}, SHIFT(769),
  [207] = {.entry = {.count = 1, .reusable = false}}, SHIFT(956),
  [209] = {.entry = {.count = 1, .reusable = false}}, SHIFT(894),
  [211] = {.entry = {.count = 1, .reusable = false}}, SHIFT(511),
  [213] = {.entry = {.count = 1, .reusable = false}}, SHIFT(687),
  [215] = {.entry = {.count = 1, .reusable = true}}, SHIFT(895),
  [217] = {.entry = {.count = 1, .reusable = false}}, SHIFT(662),
  [219] = {.entry = {.count = 1, .reusable = false}}, SHIFT(663),
  [221] = {.entry = {.count = 1, .reusable = false}}, SHIFT(668),
  [223] = {.entry = {.count = 1, .reusable = false}}, SHIFT(452),
  [225] = {.entry = {.count = 1, .reusable = false}}, SHIFT(651),
  [227] = {.entry = {.count = 1, .reusable = false}}, SHIFT(773),
  [229] = {.entry = {.count = 1, .reusable = false}}, SHIFT(957),
  [231] = {.entry = {.count = 1, .reusable = false}}, SHIFT(958),
  [233] = {.entry = {.count = 1, .reusable = false}}, SHIFT(898),
  [235] = {.entry = {.count = 1, .reusable = false}}, SHIFT(455),
  [237] = {.entry = {.count = 1, .reusable = false}}, SHIFT(900),
  [239] = {.entry = {.count = 1, .reusable = false}}, SHIFT(901),
  [241] = {.entry = {.count = 1, .reusable = false}}, SHIFT(986),
  [243] = {.entry = {.count = 1, .reusable = false}}, SHIFT(619),
  [245] = {.entry = {.count = 1, .reusable = false}}, SHIFT(730),
  [247] = {.entry = {.count = 1, .reusable = false}}, SHIFT(652),
  [249] = {.entry = {.count = 1, .reusable = true}}, SHIFT(118),
  [251] = {.entry = {.count = 1, .reusable = true}}, SHIFT(395),
  [253] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(440),
  [256] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(763),
  [259] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(481),
  [262] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(617),
  [265] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(648),
  [268] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(531),
  [271] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(493),
  [274] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(683),
  [277] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(768),
  [280] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(664),
  [283] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(893),
  [286] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(769),
  [289] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(956),
  [292] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(894),
  [295] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(511),
  [298] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(687),
  [301] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(895),
  [304] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(662),
  [307] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(663),
  [310] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(668),
  [313] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(452),
  [316] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(651),
  [319] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(773),
  [322] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(957),
  [325] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(958),
  [328] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(898),
  [331] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(455),
  [334] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(900),
  [337] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(901),
  [340] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(986),
  [343] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(619),
  [346] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(730),
  [349] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(652),
  [352] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(118),
  [355] = {.entry = {.count = 1, .reusable = true}}, SHIFT(33),
  [357] = {.entry = {.count = 1, .reusable = true}}, SHIFT(478),
  [359] = {.entry = {.count = 1, .reusable = true}}, SHIFT(34),
  [361] = {.entry = {.count = 1, .reusable = true}}, SHIFT(390),
  [363] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_statement, 4, 0, 9),
  [365] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_statement, 4, 0, 9),
  [367] = {.entry = {.count = 1, .reusable = false}}, SHIFT(807),
  [369] = {.entry = {.count = 1, .reusable = false}}, SHIFT(615),
  [371] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_statement, 3, 0, 9),
  [373] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_statement, 3, 0, 9),
  [375] = {.entry = {.count = 1, .reusable = false}}, SHIFT(930),
  [377] = {.entry = {.count = 1, .reusable = false}}, SHIFT(656),
  [379] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_if_statement_repeat1, 2, 0, 0),
  [381] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_if_statement_repeat1, 2, 0, 0),
  [383] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_if_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(807),
  [386] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_if_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(930),
  [389] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym__block, 2, 0, 0),
  [391] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__block, 2, 0, 0),
  [393] = {.entry = {.count = 1, .reusable = true}}, SHIFT(16),
  [395] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__block, 1, 0, 0),
  [397] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym__block, 1, 0, 0),
  [399] = {.entry = {.count = 1, .reusable = true}}, SHIFT(27),
  [401] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__block_colon, 2, 0, 0),
  [403] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym__block_colon, 2, 0, 0),
  [405] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__block_colon, 1, 0, 0),
  [407] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym__block_colon, 1, 0, 0),
  [409] = {.entry = {.count = 1, .reusable = true}}, SHIFT(25),
  [411] = {.entry = {.count = 1, .reusable = true}}, SHIFT(13),
  [413] = {.entry = {.count = 1, .reusable = true}}, SHIFT(30),
  [415] = {.entry = {.count = 1, .reusable = true}}, SHIFT(23),
  [417] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_elif_clause, 3, 0, 9),
  [419] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_elif_clause, 3, 0, 9),
  [421] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_string, 1, 0, 0),
  [423] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_string, 1, 0, 0),
  [425] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym__block, 5, 0, 0),
  [427] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__block, 5, 0, 0),
  [429] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 4, 0, 23),
  [431] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 4, 0, 23),
  [433] = {.entry = {.count = 1, .reusable = true}}, SHIFT(95),
  [435] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 5, 0, 36),
  [437] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 5, 0, 36),
  [439] = {.entry = {.count = 1, .reusable = true}}, SHIFT(46),
  [441] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 5, 0, 0),
  [443] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 5, 0, 0),
  [445] = {.entry = {.count = 1, .reusable = true}}, SHIFT(47),
  [447] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 5, 0, 23),
  [449] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 5, 0, 23),
  [451] = {.entry = {.count = 1, .reusable = true}}, SHIFT(48),
  [453] = {.entry = {.count = 1, .reusable = true}}, SHIFT(911),
  [455] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_screen_statement, 5, 0, 19),
  [457] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_screen_statement, 5, 0, 19),
  [459] = {.entry = {.count = 1, .reusable = true}}, SHIFT(438),
  [461] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 4, 0, 0),
  [463] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 4, 0, 0),
  [465] = {.entry = {.count = 1, .reusable = true}}, SHIFT(127),
  [467] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_python_statement, 6, 0, 36),
  [469] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_python_statement, 6, 0, 36),
  [471] = {.entry = {.count = 1, .reusable = true}}, SHIFT(749),
  [473] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_python_statement, 6, 0, 49),
  [475] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_python_statement, 6, 0, 49),
  [477] = {.entry = {.count = 1, .reusable = true}}, SHIFT(51),
  [479] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 6, 0, 49),
  [481] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 6, 0, 49),
  [483] = {.entry = {.count = 1, .reusable = true}}, SHIFT(52),
  [485] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 6, 0, 36),
  [487] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 6, 0, 36),
  [489] = {.entry = {.count = 1, .reusable = true}}, SHIFT(761),
  [491] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 6, 0, 0),
  [493] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 6, 0, 0),
  [495] = {.entry = {.count = 1, .reusable = true}}, SHIFT(836),
  [497] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 6, 0, 23),
  [499] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 6, 0, 23),
  [501] = {.entry = {.count = 1, .reusable = true}}, SHIFT(848),
  [503] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 6, 0, 50),
  [505] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 6, 0, 50),
  [507] = {.entry = {.count = 1, .reusable = true}}, SHIFT(55),
  [509] = {.entry = {.count = 1, .reusable = true}}, SHIFT(56),
  [511] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_python_statement, 7, 0, 49),
  [513] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_python_statement, 7, 0, 49),
  [515] = {.entry = {.count = 1, .reusable = true}}, SHIFT(760),
  [517] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 7, 0, 49),
  [519] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 7, 0, 49),
  [521] = {.entry = {.count = 1, .reusable = true}}, SHIFT(767),
  [523] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 7, 0, 59),
  [525] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 7, 0, 59),
  [527] = {.entry = {.count = 1, .reusable = true}}, SHIFT(57),
  [529] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 7, 0, 60),
  [531] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 7, 0, 60),
  [533] = {.entry = {.count = 1, .reusable = true}}, SHIFT(58),
  [535] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 7, 0, 50),
  [537] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 7, 0, 50),
  [539] = {.entry = {.count = 1, .reusable = true}}, SHIFT(890),
  [541] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 7, 0, 23),
  [543] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 7, 0, 23),
  [545] = {.entry = {.count = 1, .reusable = true}}, SHIFT(897),
  [547] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 8, 0, 59),
  [549] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 8, 0, 59),
  [551] = {.entry = {.count = 1, .reusable = true}}, SHIFT(841),
  [553] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 8, 0, 60),
  [555] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 8, 0, 60),
  [557] = {.entry = {.count = 1, .reusable = true}}, SHIFT(846),
  [559] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 8, 0, 80),
  [561] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 8, 0, 80),
  [563] = {.entry = {.count = 1, .reusable = true}}, SHIFT(60),
  [565] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 9, 0, 80),
  [567] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 9, 0, 80),
  [569] = {.entry = {.count = 1, .reusable = true}}, SHIFT(985),
  [571] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 1, 0, 1),
  [573] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 1, 0, 1),
  [575] = {.entry = {.count = 2, .reusable = false}}, REDUCE(sym_say_statement, 1, 0, 1), SHIFT(795),
  [578] = {.entry = {.count = 1, .reusable = true}}, SHIFT(214),
  [580] = {.entry = {.count = 1, .reusable = true}}, SHIFT(742),
  [582] = {.entry = {.count = 1, .reusable = true}}, SHIFT(40),
  [584] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 2, 0, 2),
  [586] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 2, 0, 2),
  [588] = {.entry = {.count = 2, .reusable = false}}, REDUCE(sym_say_statement, 2, 0, 2), SHIFT(796),
  [591] = {.entry = {.count = 1, .reusable = true}}, SHIFT(220),
  [593] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_python_statement, 2, 0, 0),
  [595] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_python_statement, 2, 0, 0),
  [597] = {.entry = {.count = 1, .reusable = true}}, SHIFT(72),
  [599] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_screen_statement, 4, 0, 5),
  [601] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_screen_statement, 4, 0, 5),
  [603] = {.entry = {.count = 1, .reusable = true}}, SHIFT(437),
  [605] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_screen_statement, 4, 0, 19),
  [607] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_screen_statement, 4, 0, 19),
  [609] = {.entry = {.count = 1, .reusable = true}}, SHIFT(41),
  [611] = {.entry = {.count = 2, .reusable = false}}, REDUCE(sym_say_statement, 2, 0, 2), SHIFT(740),
  [614] = {.entry = {.count = 1, .reusable = true}}, SHIFT(207),
  [616] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 3, 0, 4),
  [618] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 3, 0, 4),
  [620] = {.entry = {.count = 2, .reusable = false}}, REDUCE(sym_say_statement, 3, 0, 4), SHIFT(813),
  [623] = {.entry = {.count = 1, .reusable = true}}, SHIFT(248),
  [625] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_python_statement, 3, 0, 0),
  [627] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_python_statement, 3, 0, 0),
  [629] = {.entry = {.count = 1, .reusable = true}}, SHIFT(78),
  [631] = {.entry = {.count = 1, .reusable = true}}, SHIFT(820),
  [633] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 3, 0, 0),
  [635] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 3, 0, 0),
  [637] = {.entry = {.count = 1, .reusable = true}}, SHIFT(82),
  [639] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_screen_statement, 3, 0, 5),
  [641] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_screen_statement, 3, 0, 5),
  [643] = {.entry = {.count = 1, .reusable = true}}, SHIFT(84),
  [645] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 3, 1, 17),
  [647] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 3, 1, 17),
  [649] = {.entry = {.count = 1, .reusable = true}}, SHIFT(276),
  [651] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 4, 1, 18),
  [653] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 4, 1, 18),
  [655] = {.entry = {.count = 1, .reusable = true}}, SHIFT(277),
  [657] = {.entry = {.count = 1, .reusable = true}}, SHIFT(12),
  [659] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_python_statement, 4, 0, 0),
  [661] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_python_statement, 4, 0, 0),
  [663] = {.entry = {.count = 1, .reusable = true}}, SHIFT(843),
  [665] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_python_statement, 4, 0, 22),
  [667] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_python_statement, 4, 0, 22),
  [669] = {.entry = {.count = 1, .reusable = true}}, SHIFT(89),
  [671] = {.entry = {.count = 1, .reusable = true}}, SHIFT(90),
  [673] = {.entry = {.count = 1, .reusable = true}}, SHIFT(91),
  [675] = {.entry = {.count = 1, .reusable = true}}, SHIFT(845),
  [677] = {.entry = {.count = 1, .reusable = true}}, SHIFT(124),
  [679] = {.entry = {.count = 1, .reusable = true}}, SHIFT(439),
  [681] = {.entry = {.count = 1, .reusable = true}}, SHIFT(96),
  [683] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 5, 1, 31),
  [685] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 5, 1, 31),
  [687] = {.entry = {.count = 1, .reusable = true}}, SHIFT(315),
  [689] = {.entry = {.count = 2, .reusable = false}}, REDUCE(sym_say_statement, 3, 0, 4), SHIFT(905),
  [692] = {.entry = {.count = 1, .reusable = true}}, SHIFT(161),
  [694] = {.entry = {.count = 1, .reusable = true}}, SHIFT(125),
  [696] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_python_statement, 5, 0, 22),
  [698] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_python_statement, 5, 0, 22),
  [700] = {.entry = {.count = 1, .reusable = true}}, SHIFT(854),
  [702] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_python_statement, 5, 0, 0),
  [704] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_python_statement, 5, 0, 0),
  [706] = {.entry = {.count = 1, .reusable = true}}, SHIFT(855),
  [708] = {.entry = {.count = 1, .reusable = true}}, SHIFT(856),
  [710] = {.entry = {.count = 1, .reusable = true}}, SHIFT(102),
  [712] = {.entry = {.count = 1, .reusable = true}}, SHIFT(103),
  [714] = {.entry = {.count = 1, .reusable = true}}, SHIFT(104),
  [716] = {.entry = {.count = 1, .reusable = true}}, SHIFT(858),
  [718] = {.entry = {.count = 1, .reusable = true}}, SHIFT(441),
  [720] = {.entry = {.count = 1, .reusable = true}}, SHIFT(396),
  [722] = {.entry = {.count = 1, .reusable = true}}, SHIFT(128),
  [724] = {.entry = {.count = 1, .reusable = true}}, SHIFT(869),
  [726] = {.entry = {.count = 1, .reusable = true}}, SHIFT(107),
  [728] = {.entry = {.count = 1, .reusable = true}}, SHIFT(108),
  [730] = {.entry = {.count = 1, .reusable = true}}, SHIFT(870),
  [732] = {.entry = {.count = 1, .reusable = true}}, SHIFT(871),
  [734] = {.entry = {.count = 1, .reusable = true}}, SHIFT(872),
  [736] = {.entry = {.count = 1, .reusable = true}}, SHIFT(111),
  [738] = {.entry = {.count = 1, .reusable = true}}, SHIFT(112),
  [740] = {.entry = {.count = 1, .reusable = true}}, SHIFT(875),
  [742] = {.entry = {.count = 1, .reusable = true}}, SHIFT(991),
  [744] = {.entry = {.count = 1, .reusable = true}}, SHIFT(114),
  [746] = {.entry = {.count = 1, .reusable = true}}, SHIFT(115),
  [748] = {.entry = {.count = 1, .reusable = true}}, SHIFT(877),
  [750] = {.entry = {.count = 1, .reusable = true}}, SHIFT(878),
  [752] = {.entry = {.count = 2, .reusable = false}}, REDUCE(sym_say_statement, 1, 0, 1), SHIFT(954),
  [755] = {.entry = {.count = 1, .reusable = true}}, SHIFT(151),
  [757] = {.entry = {.count = 1, .reusable = true}}, SHIFT(882),
  [759] = {.entry = {.count = 1, .reusable = true}}, SHIFT(883),
  [761] = {.entry = {.count = 1, .reusable = true}}, SHIFT(117),
  [763] = {.entry = {.count = 1, .reusable = true}}, SHIFT(884),
  [765] = {.entry = {.count = 1, .reusable = true}}, SHIFT(121),
  [767] = {.entry = {.count = 1, .reusable = true}}, SHIFT(122),
  [769] = {.entry = {.count = 1, .reusable = true}}, SHIFT(14),
  [771] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_python_statement, 5, 0, 36),
  [773] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_python_statement, 5, 0, 36),
  [775] = {.entry = {.count = 1, .reusable = true}}, SHIFT(43),
  [777] = {.entry = {.count = 1, .reusable = true}}, SHIFT(867),
  [779] = {.entry = {.count = 1, .reusable = true}}, SHIFT(880),
  [781] = {.entry = {.count = 1, .reusable = true}}, SHIFT(135),
  [783] = {.entry = {.count = 1, .reusable = true}}, SHIFT(885),
  [785] = {.entry = {.count = 1, .reusable = true}}, SHIFT(969),
  [787] = {.entry = {.count = 1, .reusable = true}}, SHIFT(62),
  [789] = {.entry = {.count = 1, .reusable = true}}, SHIFT(66),
  [791] = {.entry = {.count = 1, .reusable = true}}, SHIFT(262),
  [793] = {.entry = {.count = 1, .reusable = true}}, SHIFT(70),
  [795] = {.entry = {.count = 1, .reusable = true}}, SHIFT(269),
  [797] = {.entry = {.count = 1, .reusable = true}}, SHIFT(77),
  [799] = {.entry = {.count = 1, .reusable = true}}, SHIFT(983),
  [801] = {.entry = {.count = 1, .reusable = true}}, SHIFT(99),
  [803] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 7, 0, 70),
  [805] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 7, 0, 70),
  [807] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_stop_statement, 3, 0, 14),
  [809] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_stop_statement, 3, 0, 14),
  [811] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_python_statement, 6, 0, 48),
  [813] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_python_statement, 6, 0, 48),
  [815] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_voice_statement, 3, 0, 0),
  [817] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_voice_statement, 3, 0, 0),
  [819] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_voice_statement, 3, 0, 15),
  [821] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_voice_statement, 3, 0, 15),
  [823] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_transform_statement, 3, 0, 5),
  [825] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_transform_statement, 3, 0, 5),
  [827] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_camera_statement, 3, 0, 16),
  [829] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_camera_statement, 3, 0, 16),
  [831] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 6, 0, 48),
  [833] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 6, 0, 48),
  [835] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_nvl_statement, 3, 0, 0),
  [837] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_nvl_statement, 3, 0, 0),
  [839] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_unknown_statement, 2, 0, 0),
  [841] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_unknown_statement, 2, 0, 0),
  [843] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_expression_statement, 3, 0, 0),
  [845] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_expression_statement, 3, 0, 0),
  [847] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 6, 0, 51),
  [849] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 6, 0, 51),
  [851] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 6, 0, 52),
  [853] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 6, 0, 52),
  [855] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__atl_block, 5, 0, 0),
  [857] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym__atl_block, 5, 0, 0),
  [859] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 2, 0, 1),
  [861] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 2, 0, 1),
  [863] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_screen_statement, 6, 0, 34),
  [865] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_screen_statement, 6, 0, 34),
  [867] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_screen_statement, 7, 0, 54),
  [869] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_screen_statement, 7, 0, 54),
  [871] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_screen_statement, 7, 0, 55),
  [873] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_screen_statement, 7, 0, 55),
  [875] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_menu_statement, 7, 0, 56),
  [877] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_menu_statement, 7, 0, 56),
  [879] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_python_statement, 7, 0, 57),
  [881] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_python_statement, 7, 0, 57),
  [883] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_unknown_statement, 3, 0, 0),
  [885] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_unknown_statement, 3, 0, 0),
  [887] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_python_statement, 7, 0, 58),
  [889] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_python_statement, 7, 0, 58),
  [891] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_unknown_statement, 4, 0, 0),
  [893] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_unknown_statement, 4, 0, 0),
  [895] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 7, 0, 58),
  [897] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 7, 0, 58),
  [899] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 4, 0, 4),
  [901] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 4, 0, 4),
  [903] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_label_statement, 4, 0, 5),
  [905] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_label_statement, 4, 0, 5),
  [907] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_label_statement, 4, 0, 19),
  [909] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_label_statement, 4, 0, 19),
  [911] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_hide_screen_statement, 4, 0, 20),
  [913] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_hide_screen_statement, 4, 0, 20),
  [915] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 7, 0, 61),
  [917] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 7, 0, 61),
  [919] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 7, 0, 65),
  [921] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 7, 0, 65),
  [923] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 7, 0, 66),
  [925] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 7, 0, 66),
  [927] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_screen_statement, 7, 0, 54),
  [929] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_screen_statement, 7, 0, 54),
  [931] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_screen_statement, 7, 0, 55),
  [933] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_screen_statement, 7, 0, 55),
  [935] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 7, 0, 65),
  [937] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 7, 0, 65),
  [939] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 7, 0, 66),
  [941] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 7, 0, 66),
  [943] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 7, 0, 67),
  [945] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 7, 0, 67),
  [947] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 7, 0, 68),
  [949] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 7, 0, 68),
  [951] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 7, 0, 69),
  [953] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 7, 0, 69),
  [955] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_screen_statement, 7, 0, 5),
  [957] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_screen_statement, 7, 0, 5),
  [959] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_style_statement, 7, 0, 5),
  [961] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_style_statement, 7, 0, 5),
  [963] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_layeredimage_statement, 7, 0, 5),
  [965] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_layeredimage_statement, 7, 0, 5),
  [967] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_screen_statement, 8, 0, 75),
  [969] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_screen_statement, 8, 0, 75),
  [971] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_python_statement, 8, 0, 77),
  [973] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_python_statement, 8, 0, 77),
  [975] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 8, 0, 77),
  [977] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 8, 0, 77),
  [979] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_jump_statement, 4, 0, 21),
  [981] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_jump_statement, 4, 0, 21),
  [983] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 8, 0, 78),
  [985] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 8, 0, 78),
  [987] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_statement, 4, 0, 21),
  [989] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_statement, 4, 0, 21),
  [991] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 8, 0, 79),
  [993] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 8, 0, 79),
  [995] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_screen_statement, 4, 0, 20),
  [997] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_screen_statement, 4, 0, 20),
  [999] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_screen_statement, 8, 0, 75),
  [1001] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_screen_statement, 8, 0, 75),
  [1003] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_screen_statement, 8, 0, 19),
  [1005] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_screen_statement, 8, 0, 19),
  [1007] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_python_statement, 9, 0, 86),
  [1009] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_python_statement, 9, 0, 86),
  [1011] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 9, 0, 86),
  [1013] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 9, 0, 86),
  [1015] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 9, 0, 87),
  [1017] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 9, 0, 87),
  [1019] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 9, 0, 88),
  [1021] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 9, 0, 88),
  [1023] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 9, 0, 89),
  [1025] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 9, 0, 89),
  [1027] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 9, 0, 90),
  [1029] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 9, 0, 90),
  [1031] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_style_statement, 9, 0, 92),
  [1033] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_style_statement, 9, 0, 92),
  [1035] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_style_statement, 9, 0, 93),
  [1037] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_style_statement, 9, 0, 93),
  [1039] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 10, 0, 94),
  [1041] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 10, 0, 94),
  [1043] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 10, 0, 95),
  [1045] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 10, 0, 95),
  [1047] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 11, 0, 96),
  [1049] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 11, 0, 96),
  [1051] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_style_statement, 11, 0, 97),
  [1053] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_style_statement, 11, 0, 97),
  [1055] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym__comment_line, 2, 0, 0),
  [1057] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__comment_line, 2, 0, 0),
  [1059] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_expression_statement, 2, 0, 0),
  [1061] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_expression_statement, 2, 0, 0),
  [1063] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_return_statement, 2, 0, 0),
  [1065] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_return_statement, 2, 0, 0),
  [1067] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 3, 0, 2),
  [1069] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 3, 0, 2),
  [1071] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_pass_statement, 2, 0, 0),
  [1073] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_pass_statement, 2, 0, 0),
  [1075] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 2, 0, 0),
  [1077] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 2, 0, 0),
  [1079] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 2, 0, 3),
  [1081] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 2, 0, 3),
  [1083] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_camera_statement, 2, 0, 0),
  [1085] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_camera_statement, 2, 0, 0),
  [1087] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_label_statement, 3, 0, 5),
  [1089] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_label_statement, 3, 0, 5),
  [1091] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_hide_statement, 3, 0, 6),
  [1093] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_hide_statement, 3, 0, 6),
  [1095] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_jump_statement, 3, 0, 7),
  [1097] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_jump_statement, 3, 0, 7),
  [1099] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 4, 0, 24),
  [1101] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 4, 0, 24),
  [1103] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_statement, 3, 0, 7),
  [1105] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_statement, 3, 0, 7),
  [1107] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_return_statement, 3, 0, 8),
  [1109] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_return_statement, 3, 0, 8),
  [1111] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 4, 0, 25),
  [1113] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 4, 0, 25),
  [1115] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_while_statement, 3, 0, 9),
  [1117] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_while_statement, 3, 0, 9),
  [1119] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_with_statement, 3, 0, 10),
  [1121] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_with_statement, 3, 0, 10),
  [1123] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 4, 0, 26),
  [1125] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 4, 0, 26),
  [1127] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 4, 0, 27),
  [1129] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 4, 0, 27),
  [1131] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_dollar_statement, 3, 0, 11),
  [1133] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_dollar_statement, 3, 0, 11),
  [1135] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_image_statement, 3, 0, 12),
  [1137] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_image_statement, 3, 0, 12),
  [1139] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 3, 0, 6),
  [1141] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 3, 0, 6),
  [1143] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 3, 0, 13),
  [1145] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 3, 0, 13),
  [1147] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 3, 0, 6),
  [1149] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 3, 0, 6),
  [1151] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 3, 0, 13),
  [1153] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 3, 0, 13),
  [1155] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_screen_statement, 4, 0, 20),
  [1157] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_screen_statement, 4, 0, 20),
  [1159] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_play_statement, 4, 0, 28),
  [1161] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_play_statement, 4, 0, 28),
  [1163] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_queue_statement, 4, 0, 28),
  [1165] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_queue_statement, 4, 0, 28),
  [1167] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_stop_statement, 4, 0, 29),
  [1169] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_stop_statement, 4, 0, 29),
  [1171] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_transform_statement, 4, 0, 19),
  [1173] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_transform_statement, 4, 0, 19),
  [1175] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_translate_statement, 4, 0, 30),
  [1177] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_translate_statement, 4, 0, 30),
  [1179] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_camera_statement, 4, 0, 26),
  [1181] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_camera_statement, 4, 0, 26),
  [1183] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 4, 1, 17),
  [1185] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 4, 1, 17),
  [1187] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 5, 1, 18),
  [1189] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 5, 1, 18),
  [1191] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_label_statement, 5, 0, 19),
  [1193] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_label_statement, 5, 0, 19),
  [1195] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_hide_statement, 5, 0, 32),
  [1197] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_hide_statement, 5, 0, 32),
  [1199] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_statement, 5, 0, 33),
  [1201] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_statement, 5, 0, 33),
  [1203] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_screen_statement, 5, 0, 20),
  [1205] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_screen_statement, 5, 0, 20),
  [1207] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_screen_statement, 5, 0, 34),
  [1209] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_screen_statement, 5, 0, 34),
  [1211] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_else_clause, 2, 0, 0),
  [1213] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_else_clause, 2, 0, 0),
  [1215] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_statement, 5, 0, 9),
  [1217] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_statement, 5, 0, 9),
  [1219] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 5, 0, 35),
  [1221] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 5, 0, 35),
  [1223] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_python_statement, 5, 0, 37),
  [1225] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_python_statement, 5, 0, 37),
  [1227] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_define_statement, 5, 0, 38),
  [1229] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_define_statement, 5, 0, 38),
  [1231] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_default_statement, 5, 0, 38),
  [1233] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_default_statement, 5, 0, 38),
  [1235] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_image_statement, 5, 0, 38),
  [1237] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_image_statement, 5, 0, 38),
  [1239] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 5, 0, 32),
  [1241] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 5, 0, 32),
  [1243] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 5, 0, 39),
  [1245] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 5, 0, 39),
  [1247] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 5, 0, 40),
  [1249] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 5, 0, 40),
  [1251] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 5, 0, 41),
  [1253] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 5, 0, 41),
  [1255] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_screen_statement, 5, 0, 20),
  [1257] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_screen_statement, 5, 0, 20),
  [1259] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_screen_statement, 5, 0, 34),
  [1261] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_screen_statement, 5, 0, 34),
  [1263] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 5, 0, 32),
  [1265] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 5, 0, 32),
  [1267] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 5, 0, 39),
  [1269] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 5, 0, 39),
  [1271] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 5, 0, 40),
  [1273] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 5, 0, 40),
  [1275] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 5, 0, 41),
  [1277] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 5, 0, 41),
  [1279] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 5, 0, 42),
  [1281] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 5, 0, 42),
  [1283] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 5, 0, 43),
  [1285] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 5, 0, 43),
  [1287] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_play_statement, 5, 0, 44),
  [1289] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_play_statement, 5, 0, 44),
  [1291] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_queue_statement, 5, 0, 44),
  [1293] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_queue_statement, 5, 0, 44),
  [1295] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_camera_statement, 5, 0, 45),
  [1297] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_camera_statement, 5, 0, 45),
  [1299] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 6, 1, 31),
  [1301] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 6, 1, 31),
  [1303] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_hide_screen_statement, 6, 0, 46),
  [1305] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_hide_screen_statement, 6, 0, 46),
  [1307] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_statement, 6, 0, 47),
  [1309] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_statement, 6, 0, 47),
  [1311] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_screen_statement, 6, 0, 46),
  [1313] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_screen_statement, 6, 0, 46),
  [1315] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_screen_statement, 6, 0, 34),
  [1317] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_screen_statement, 6, 0, 34),
  [1319] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_menu_statement, 6, 0, 0),
  [1321] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_menu_statement, 6, 0, 0),
  [1323] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_screen_statement, 6, 0, 46),
  [1325] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_screen_statement, 6, 0, 46),
  [1327] = {.entry = {.count = 1, .reusable = false}}, SHIFT(756),
  [1329] = {.entry = {.count = 1, .reusable = true}}, SHIFT(886),
  [1331] = {.entry = {.count = 1, .reusable = false}}, SHIFT(757),
  [1333] = {.entry = {.count = 1, .reusable = false}}, SHIFT(694),
  [1335] = {.entry = {.count = 1, .reusable = false}}, SHIFT(762),
  [1337] = {.entry = {.count = 1, .reusable = true}}, SHIFT(150),
  [1339] = {.entry = {.count = 1, .reusable = true}}, SHIFT(414),
  [1341] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym__atl_block_repeat1, 2, 0, 0), SHIFT_REPEAT(756),
  [1344] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym__atl_block_repeat1, 2, 0, 0), SHIFT_REPEAT(886),
  [1347] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym__atl_block_repeat1, 2, 0, 0), SHIFT_REPEAT(757),
  [1350] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym__atl_block_repeat1, 2, 0, 0), SHIFT_REPEAT(694),
  [1353] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym__atl_block_repeat1, 2, 0, 0), SHIFT_REPEAT(762),
  [1356] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym__atl_block_repeat1, 2, 0, 0), SHIFT_REPEAT(32),
  [1359] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym__atl_block_repeat1, 2, 0, 0),
  [1361] = {.entry = {.count = 1, .reusable = true}}, SHIFT(334),
  [1363] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_atl_time_statement, 3, 0, 64),
  [1365] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_atl_time_statement, 3, 0, 64),
  [1367] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_atl_displayable, 2, 0, 53),
  [1369] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_atl_displayable, 2, 0, 53),
  [1371] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_atl_transform_property, 3, 0, 62),
  [1373] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_atl_transform_property, 3, 0, 62),
  [1375] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_atl_block_statement, 6, 0, 0),
  [1377] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_atl_block_statement, 6, 0, 0),
  [1379] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_atl_with_statement, 3, 0, 63),
  [1381] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_atl_with_statement, 3, 0, 63),
  [1383] = {.entry = {.count = 1, .reusable = false}}, SHIFT(506),
  [1385] = {.entry = {.count = 1, .reusable = false}}, SHIFT(866),
  [1387] = {.entry = {.count = 1, .reusable = true}}, SHIFT(401),
  [1389] = {.entry = {.count = 1, .reusable = true}}, SHIFT(339),
  [1391] = {.entry = {.count = 1, .reusable = true}}, SHIFT(320),
  [1393] = {.entry = {.count = 1, .reusable = true}}, SHIFT(155),
  [1395] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_menu_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(506),
  [1398] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_menu_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(886),
  [1401] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_menu_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(866),
  [1404] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_menu_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(32),
  [1407] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_menu_statement_repeat1, 2, 0, 0),
  [1409] = {.entry = {.count = 1, .reusable = false}}, SHIFT(454),
  [1411] = {.entry = {.count = 1, .reusable = true}}, SHIFT(132),
  [1413] = {.entry = {.count = 1, .reusable = false}}, SHIFT(533),
  [1415] = {.entry = {.count = 1, .reusable = false}}, SHIFT(508),
  [1417] = {.entry = {.count = 1, .reusable = true}}, SHIFT(444),
  [1419] = {.entry = {.count = 1, .reusable = true}}, SHIFT(449),
  [1421] = {.entry = {.count = 1, .reusable = false}}, SHIFT(421),
  [1423] = {.entry = {.count = 1, .reusable = false}}, SHIFT(676),
  [1425] = {.entry = {.count = 1, .reusable = true}}, SHIFT(176),
  [1427] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_screen_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(421),
  [1430] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_screen_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(886),
  [1433] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_screen_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(676),
  [1436] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_screen_statement_repeat1, 2, 0, 0),
  [1438] = {.entry = {.count = 1, .reusable = true}}, SHIFT(188),
  [1440] = {.entry = {.count = 1, .reusable = true}}, SHIFT(371),
  [1442] = {.entry = {.count = 1, .reusable = true}}, SHIFT(359),
  [1444] = {.entry = {.count = 1, .reusable = true}}, SHIFT(448),
  [1446] = {.entry = {.count = 1, .reusable = true}}, SHIFT(436),
  [1448] = {.entry = {.count = 1, .reusable = false}}, SHIFT(554),
  [1450] = {.entry = {.count = 1, .reusable = true}}, SHIFT(268),
  [1452] = {.entry = {.count = 1, .reusable = true}}, SHIFT(456),
  [1454] = {.entry = {.count = 1, .reusable = false}}, SHIFT(562),
  [1456] = {.entry = {.count = 1, .reusable = true}}, SHIFT(119),
  [1458] = {.entry = {.count = 1, .reusable = true}}, SHIFT(217),
  [1460] = {.entry = {.count = 1, .reusable = false}}, SHIFT(545),
  [1462] = {.entry = {.count = 1, .reusable = true}}, SHIFT(157),
  [1464] = {.entry = {.count = 1, .reusable = true}}, SHIFT(435),
  [1466] = {.entry = {.count = 1, .reusable = false}}, SHIFT(563),
  [1468] = {.entry = {.count = 1, .reusable = true}}, SHIFT(203),
  [1470] = {.entry = {.count = 1, .reusable = false}}, SHIFT(458),
  [1472] = {.entry = {.count = 1, .reusable = false}}, SHIFT(970),
  [1474] = {.entry = {.count = 1, .reusable = false}}, SHIFT(981),
  [1476] = {.entry = {.count = 1, .reusable = false}}, SHIFT(987),
  [1478] = {.entry = {.count = 1, .reusable = true}}, SHIFT(331),
  [1480] = {.entry = {.count = 1, .reusable = false}}, SHIFT(921),
  [1482] = {.entry = {.count = 1, .reusable = false}}, SHIFT(922),
  [1484] = {.entry = {.count = 1, .reusable = false}}, SHIFT(923),
  [1486] = {.entry = {.count = 1, .reusable = true}}, SHIFT(236),
  [1488] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_screen_language_statement, 2, 0, 72),
  [1490] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_screen_language_statement, 2, 0, 72),
  [1492] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_screen_language_statement, 3, 0, 84),
  [1494] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_screen_language_statement, 3, 0, 84),
  [1496] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_screen_language_statement, 3, 0, 82),
  [1498] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_screen_language_statement, 3, 0, 82),
  [1500] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_screen_language_statement, 4, 0, 91),
  [1502] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_screen_language_statement, 4, 0, 91),
  [1504] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym__screen_line_end, 5, 0, 0),
  [1506] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__screen_line_end, 5, 0, 0),
  [1508] = {.entry = {.count = 1, .reusable = false}}, SHIFT(912),
  [1510] = {.entry = {.count = 1, .reusable = false}}, SHIFT(915),
  [1512] = {.entry = {.count = 1, .reusable = true}}, SHIFT(329),
  [1514] = {.entry = {.count = 1, .reusable = false}}, SHIFT(919),
  [1516] = {.entry = {.count = 1, .reusable = false}}, SHIFT(920),
  [1518] = {.entry = {.count = 1, .reusable = true}}, SHIFT(234),
  [1520] = {.entry = {.count = 1, .reusable = false}}, SHIFT(451),
  [1522] = {.entry = {.count = 1, .reusable = false}}, SHIFT(908),
  [1524] = {.entry = {.count = 1, .reusable = false}}, SHIFT(909),
  [1526] = {.entry = {.count = 1, .reusable = true}}, SHIFT(211),
  [1528] = {.entry = {.count = 1, .reusable = false}}, SHIFT(450),
  [1530] = {.entry = {.count = 1, .reusable = false}}, SHIFT(733),
  [1532] = {.entry = {.count = 1, .reusable = false}}, SHIFT(734),
  [1534] = {.entry = {.count = 1, .reusable = true}}, SHIFT(321),
  [1536] = {.entry = {.count = 2, .reusable = false}}, REDUCE(sym__positional_property, 1, 0, 71), SHIFT(596),
  [1539] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__positional_property, 1, 0, 71),
  [1541] = {.entry = {.count = 2, .reusable = false}}, REDUCE(sym__positional_property, 1, 0, 71), SHIFT(595),
  [1544] = {.entry = {.count = 1, .reusable = false}}, SHIFT(646),
  [1546] = {.entry = {.count = 1, .reusable = false}}, SHIFT(789),
  [1548] = {.entry = {.count = 1, .reusable = false}}, SHIFT(790),
  [1550] = {.entry = {.count = 1, .reusable = true}}, SHIFT(790),
  [1552] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_menu_caption_repeat1, 2, 0, 0), SHIFT_REPEAT(456),
  [1555] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_menu_caption_repeat1, 2, 0, 0),
  [1557] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_menu_caption_repeat1, 2, 0, 0),
  [1559] = {.entry = {.count = 1, .reusable = false}}, SHIFT(805),
  [1561] = {.entry = {.count = 1, .reusable = false}}, SHIFT(808),
  [1563] = {.entry = {.count = 1, .reusable = true}}, SHIFT(808),
  [1565] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_menu_caption_repeat1, 2, 0, 0), SHIFT_REPEAT(458),
  [1568] = {.entry = {.count = 1, .reusable = true}}, SHIFT(461),
  [1570] = {.entry = {.count = 1, .reusable = true}}, SHIFT(462),
  [1572] = {.entry = {.count = 1, .reusable = true}}, SHIFT(15),
  [1574] = {.entry = {.count = 1, .reusable = true}}, SHIFT(536),
  [1576] = {.entry = {.count = 1, .reusable = true}}, SHIFT(446),
  [1578] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_screen_language_statement_repeat1, 2, 0, 83), SHIFT_REPEAT(508),
  [1581] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_screen_language_statement_repeat1, 2, 0, 83),
  [1583] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_screen_language_statement_repeat1, 2, 0, 83), SHIFT_REPEAT(533),
  [1586] = {.entry = {.count = 1, .reusable = true}}, SHIFT(447),
  [1588] = {.entry = {.count = 1, .reusable = true}}, SHIFT(613),
  [1590] = {.entry = {.count = 1, .reusable = true}}, SHIFT(669),
  [1592] = {.entry = {.count = 1, .reusable = true}}, SHIFT(605),
  [1594] = {.entry = {.count = 1, .reusable = true}}, SHIFT(582),
  [1596] = {.entry = {.count = 1, .reusable = true}}, SHIFT(380),
  [1598] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_style_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(582),
  [1601] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_style_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(763),
  [1604] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_style_statement_repeat1, 2, 0, 0),
  [1606] = {.entry = {.count = 1, .reusable = true}}, SHIFT(178),
  [1608] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_menu_caption, 3, 0, 2),
  [1610] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_menu_caption, 3, 0, 2),
  [1612] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_menu_set, 3, 0, 11),
  [1614] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_menu_set, 3, 0, 11),
  [1616] = {.entry = {.count = 1, .reusable = true}}, SHIFT(721),
  [1618] = {.entry = {.count = 1, .reusable = true}}, SHIFT(708),
  [1620] = {.entry = {.count = 1, .reusable = true}}, SHIFT(195),
  [1622] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_menu_caption, 4, 0, 4),
  [1624] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_menu_caption, 4, 0, 4),
  [1626] = {.entry = {.count = 1, .reusable = true}}, SHIFT(699),
  [1628] = {.entry = {.count = 1, .reusable = true}}, SHIFT(196),
  [1630] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_menu_caption, 2, 0, 1),
  [1632] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_menu_caption, 2, 0, 1),
  [1634] = {.entry = {.count = 1, .reusable = true}}, SHIFT(200),
  [1636] = {.entry = {.count = 1, .reusable = true}}, SHIFT(509),
  [1638] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_menu_choice, 2, 0, 1),
  [1640] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_menu_choice, 2, 0, 1),
  [1642] = {.entry = {.count = 1, .reusable = true}}, SHIFT(490),
  [1644] = {.entry = {.count = 1, .reusable = true}}, SHIFT(918),
  [1646] = {.entry = {.count = 1, .reusable = true}}, SHIFT(523),
  [1648] = {.entry = {.count = 1, .reusable = false}}, SHIFT(701),
  [1650] = {.entry = {.count = 1, .reusable = true}}, SHIFT(701),
  [1652] = {.entry = {.count = 1, .reusable = false}}, SHIFT(550),
  [1654] = {.entry = {.count = 1, .reusable = false}}, SHIFT(876),
  [1656] = {.entry = {.count = 1, .reusable = true}}, SHIFT(940),
  [1658] = {.entry = {.count = 1, .reusable = true}}, SHIFT(941),
  [1660] = {.entry = {.count = 1, .reusable = true}}, SHIFT(306),
  [1662] = {.entry = {.count = 1, .reusable = true}}, SHIFT(360),
  [1664] = {.entry = {.count = 1, .reusable = true}}, SHIFT(361),
  [1666] = {.entry = {.count = 1, .reusable = true}}, SHIFT(379),
  [1668] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_menu_caption_repeat1, 2, 0, 0), SHIFT_REPEAT(490),
  [1671] = {.entry = {.count = 1, .reusable = true}}, SHIFT(384),
  [1673] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_menu_choice, 4, 0, 76),
  [1675] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_menu_choice, 4, 0, 76),
  [1677] = {.entry = {.count = 1, .reusable = false}}, SHIFT(731),
  [1679] = {.entry = {.count = 1, .reusable = true}}, SHIFT(731),
  [1681] = {.entry = {.count = 1, .reusable = false}}, SHIFT(543),
  [1683] = {.entry = {.count = 1, .reusable = false}}, SHIFT(906),
  [1685] = {.entry = {.count = 1, .reusable = true}}, SHIFT(177),
  [1687] = {.entry = {.count = 1, .reusable = true}}, SHIFT(723),
  [1689] = {.entry = {.count = 1, .reusable = true}}, SHIFT(725),
  [1691] = {.entry = {.count = 1, .reusable = true}}, SHIFT(889),
  [1693] = {.entry = {.count = 1, .reusable = true}}, SHIFT(797),
  [1695] = {.entry = {.count = 1, .reusable = true}}, SHIFT(798),
  [1697] = {.entry = {.count = 1, .reusable = true}}, SHIFT(386),
  [1699] = {.entry = {.count = 1, .reusable = true}}, SHIFT(863),
  [1701] = {.entry = {.count = 1, .reusable = true}}, SHIFT(230),
  [1703] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_screen_language_statement_repeat1, 1, 0, 73),
  [1705] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_screen_language_statement_repeat1, 1, 0, 73),
  [1707] = {.entry = {.count = 1, .reusable = true}}, SHIFT(600),
  [1709] = {.entry = {.count = 1, .reusable = true}}, SHIFT(631),
  [1711] = {.entry = {.count = 1, .reusable = true}}, SHIFT(544),
  [1713] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_screen_language_statement_repeat2, 2, 0, 83), SHIFT_REPEAT(536),
  [1716] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_screen_language_statement_repeat2, 2, 0, 83),
  [1718] = {.entry = {.count = 1, .reusable = true}}, SHIFT(585),
  [1720] = {.entry = {.count = 1, .reusable = true}}, SHIFT(588),
  [1722] = {.entry = {.count = 1, .reusable = true}}, SHIFT(549),
  [1724] = {.entry = {.count = 1, .reusable = true}}, SHIFT(525),
  [1726] = {.entry = {.count = 1, .reusable = true}}, SHIFT(459),
  [1728] = {.entry = {.count = 1, .reusable = true}}, SHIFT(857),
  [1730] = {.entry = {.count = 1, .reusable = true}}, SHIFT(479),
  [1732] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym__positional_property, 1, 0, 71),
  [1734] = {.entry = {.count = 1, .reusable = true}}, SHIFT(633),
  [1736] = {.entry = {.count = 1, .reusable = true}}, SHIFT(597),
  [1738] = {.entry = {.count = 1, .reusable = true}}, SHIFT(621),
  [1740] = {.entry = {.count = 1, .reusable = true}}, SHIFT(553),
  [1742] = {.entry = {.count = 1, .reusable = true}}, SHIFT(712),
  [1744] = {.entry = {.count = 1, .reusable = true}}, SHIFT(862),
  [1746] = {.entry = {.count = 1, .reusable = true}}, SHIFT(717),
  [1748] = {.entry = {.count = 1, .reusable = true}}, SHIFT(186),
  [1750] = {.entry = {.count = 1, .reusable = true}}, SHIFT(622),
  [1752] = {.entry = {.count = 1, .reusable = true}}, SHIFT(624),
  [1754] = {.entry = {.count = 1, .reusable = true}}, SHIFT(565),
  [1756] = {.entry = {.count = 1, .reusable = true}}, SHIFT(928),
  [1758] = {.entry = {.count = 1, .reusable = true}}, SHIFT(703),
  [1760] = {.entry = {.count = 1, .reusable = true}}, SHIFT(254),
  [1762] = {.entry = {.count = 1, .reusable = true}}, SHIFT(931),
  [1764] = {.entry = {.count = 1, .reusable = true}}, SHIFT(265),
  [1766] = {.entry = {.count = 1, .reusable = true}}, SHIFT(650),
  [1768] = {.entry = {.count = 1, .reusable = true}}, SHIFT(937),
  [1770] = {.entry = {.count = 1, .reusable = true}}, SHIFT(300),
  [1772] = {.entry = {.count = 1, .reusable = true}}, SHIFT(942),
  [1774] = {.entry = {.count = 1, .reusable = true}}, SHIFT(308),
  [1776] = {.entry = {.count = 1, .reusable = true}}, SHIFT(949),
  [1778] = {.entry = {.count = 1, .reusable = true}}, SHIFT(355),
  [1780] = {.entry = {.count = 1, .reusable = true}}, SHIFT(774),
  [1782] = {.entry = {.count = 1, .reusable = true}}, SHIFT(358),
  [1784] = {.entry = {.count = 1, .reusable = true}}, SHIFT(667),
  [1786] = {.entry = {.count = 1, .reusable = true}}, SHIFT(657),
  [1788] = {.entry = {.count = 1, .reusable = true}}, SHIFT(546),
  [1790] = {.entry = {.count = 1, .reusable = true}}, SHIFT(660),
  [1792] = {.entry = {.count = 1, .reusable = true}}, SHIFT(586),
  [1794] = {.entry = {.count = 1, .reusable = true}}, SHIFT(548),
  [1796] = {.entry = {.count = 1, .reusable = false}}, SHIFT(777),
  [1798] = {.entry = {.count = 1, .reusable = true}}, SHIFT(777),
  [1800] = {.entry = {.count = 1, .reusable = false}}, SHIFT(577),
  [1802] = {.entry = {.count = 1, .reusable = false}}, SHIFT(976),
  [1804] = {.entry = {.count = 1, .reusable = true}}, SHIFT(976),
  [1806] = {.entry = {.count = 1, .reusable = false}}, SHIFT(578),
  [1808] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym__positional_property, 1, 0, 0),
  [1810] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__positional_property, 1, 0, 0),
  [1812] = {.entry = {.count = 1, .reusable = true}}, SHIFT(899),
  [1814] = {.entry = {.count = 1, .reusable = true}}, SHIFT(722),
  [1816] = {.entry = {.count = 1, .reusable = true}}, SHIFT(238),
  [1818] = {.entry = {.count = 1, .reusable = true}}, SHIFT(891),
  [1820] = {.entry = {.count = 1, .reusable = true}}, SHIFT(172),
  [1822] = {.entry = {.count = 1, .reusable = false}}, SHIFT(596),
  [1824] = {.entry = {.count = 1, .reusable = false}}, SHIFT(595),
  [1826] = {.entry = {.count = 1, .reusable = true}}, SHIFT(803),
  [1828] = {.entry = {.count = 1, .reusable = true}}, SHIFT(388),
  [1830] = {.entry = {.count = 1, .reusable = true}}, SHIFT(933),
  [1832] = {.entry = {.count = 1, .reusable = true}}, SHIFT(674),
  [1834] = {.entry = {.count = 1, .reusable = true}}, SHIFT(267),
  [1836] = {.entry = {.count = 1, .reusable = false}}, SHIFT(714),
  [1838] = {.entry = {.count = 1, .reusable = true}}, SHIFT(714),
  [1840] = {.entry = {.count = 1, .reusable = true}}, SHIFT(635),
  [1842] = {.entry = {.count = 1, .reusable = true}}, SHIFT(638),
  [1844] = {.entry = {.count = 1, .reusable = true}}, SHIFT(159),
  [1846] = {.entry = {.count = 1, .reusable = true}}, SHIFT(584),
  [1848] = {.entry = {.count = 1, .reusable = true}}, SHIFT(665),
  [1850] = {.entry = {.count = 1, .reusable = true}}, SHIFT(148),
  [1852] = {.entry = {.count = 1, .reusable = true}}, SHIFT(601),
  [1854] = {.entry = {.count = 1, .reusable = true}}, SHIFT(599),
  [1856] = {.entry = {.count = 1, .reusable = true}}, SHIFT(642),
  [1858] = {.entry = {.count = 1, .reusable = true}}, SHIFT(589),
  [1860] = {.entry = {.count = 1, .reusable = false}}, SHIFT(689),
  [1862] = {.entry = {.count = 1, .reusable = true}}, SHIFT(689),
  [1864] = {.entry = {.count = 1, .reusable = true}}, SHIFT(221),
  [1866] = {.entry = {.count = 1, .reusable = true}}, SHIFT(445),
  [1868] = {.entry = {.count = 1, .reusable = true}}, SHIFT(583),
  [1870] = {.entry = {.count = 1, .reusable = true}}, SHIFT(623),
  [1872] = {.entry = {.count = 1, .reusable = true}}, SHIFT(147),
  [1874] = {.entry = {.count = 1, .reusable = true}}, SHIFT(166),
  [1876] = {.entry = {.count = 1, .reusable = true}}, SHIFT(170),
  [1878] = {.entry = {.count = 1, .reusable = true}}, SHIFT(174),
  [1880] = {.entry = {.count = 1, .reusable = true}}, SHIFT(346),
  [1882] = {.entry = {.count = 1, .reusable = true}}, SHIFT(375),
  [1884] = {.entry = {.count = 1, .reusable = true}}, SHIFT(247),
  [1886] = {.entry = {.count = 1, .reusable = true}}, SHIFT(216),
  [1888] = {.entry = {.count = 1, .reusable = false}}, SHIFT(914),
  [1890] = {.entry = {.count = 1, .reusable = true}}, SHIFT(223),
  [1892] = {.entry = {.count = 1, .reusable = true}}, SHIFT(626),
  [1894] = {.entry = {.count = 1, .reusable = true}}, SHIFT(630),
  [1896] = {.entry = {.count = 1, .reusable = true}}, SHIFT(263),
  [1898] = {.entry = {.count = 1, .reusable = true}}, SHIFT(298),
  [1900] = {.entry = {.count = 1, .reusable = true}}, SHIFT(304),
  [1902] = {.entry = {.count = 1, .reusable = true}}, SHIFT(193),
  [1904] = {.entry = {.count = 1, .reusable = true}}, SHIFT(332),
  [1906] = {.entry = {.count = 1, .reusable = true}}, SHIFT(349),
  [1908] = {.entry = {.count = 1, .reusable = true}}, SHIFT(353),
  [1910] = {.entry = {.count = 1, .reusable = true}}, SHIFT(357),
  [1912] = {.entry = {.count = 1, .reusable = true}}, SHIFT(377),
  [1914] = {.entry = {.count = 1, .reusable = true}}, SHIFT(874),
  [1916] = {.entry = {.count = 1, .reusable = true}}, SHIFT(887),
  [1918] = {.entry = {.count = 1, .reusable = false}}, SHIFT(799),
  [1920] = {.entry = {.count = 1, .reusable = true}}, SHIFT(799),
  [1922] = {.entry = {.count = 1, .reusable = false}}, SHIFT(786),
  [1924] = {.entry = {.count = 1, .reusable = true}}, SHIFT(786),
  [1926] = {.entry = {.count = 1, .reusable = false}}, SHIFT(775),
  [1928] = {.entry = {.count = 1, .reusable = true}}, SHIFT(218),
  [1930] = {.entry = {.count = 1, .reusable = true}}, SHIFT(988),
  [1932] = {.entry = {.count = 1, .reusable = true}}, SHIFT(989),
  [1934] = {.entry = {.count = 1, .reusable = false}}, SHIFT(950),
  [1936] = {.entry = {.count = 1, .reusable = true}}, SHIFT(629),
  [1938] = {.entry = {.count = 1, .reusable = true}}, SHIFT(653),
  [1940] = {.entry = {.count = 1, .reusable = false}}, SHIFT(670),
  [1942] = {.entry = {.count = 1, .reusable = true}}, SHIFT(670),
  [1944] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_parameter_list, 2, 0, 0),
  [1946] = {.entry = {.count = 1, .reusable = false}}, SHIFT(715),
  [1948] = {.entry = {.count = 1, .reusable = true}}, SHIFT(715),
  [1950] = {.entry = {.count = 1, .reusable = false}}, SHIFT(675),
  [1952] = {.entry = {.count = 1, .reusable = true}}, SHIFT(675),
  [1954] = {.entry = {.count = 1, .reusable = false}}, SHIFT(467),
  [1956] = {.entry = {.count = 1, .reusable = true}}, SHIFT(467),
  [1958] = {.entry = {.count = 1, .reusable = false}}, SHIFT(580),
  [1960] = {.entry = {.count = 1, .reusable = false}}, SHIFT(953),
  [1962] = {.entry = {.count = 1, .reusable = false}}, SHIFT(442),
  [1964] = {.entry = {.count = 1, .reusable = false}}, SHIFT(750),
  [1966] = {.entry = {.count = 1, .reusable = false}}, SHIFT(692),
  [1968] = {.entry = {.count = 1, .reusable = true}}, SHIFT(692),
  [1970] = {.entry = {.count = 1, .reusable = false}}, SHIFT(691),
  [1972] = {.entry = {.count = 1, .reusable = true}}, SHIFT(691),
  [1974] = {.entry = {.count = 1, .reusable = false}}, SHIFT(696),
  [1976] = {.entry = {.count = 1, .reusable = true}}, SHIFT(696),
  [1978] = {.entry = {.count = 1, .reusable = true}}, SHIFT(593),
  [1980] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_parameter_list, 3, 0, 0),
  [1982] = {.entry = {.count = 1, .reusable = false}}, SHIFT(847),
  [1984] = {.entry = {.count = 1, .reusable = true}}, SHIFT(847),
  [1986] = {.entry = {.count = 1, .reusable = true}}, SHIFT(26),
  [1988] = {.entry = {.count = 1, .reusable = false}}, SHIFT(828),
  [1990] = {.entry = {.count = 1, .reusable = true}}, SHIFT(828),
  [1992] = {.entry = {.count = 1, .reusable = true}}, SHIFT(671),
  [1994] = {.entry = {.count = 1, .reusable = true}}, SHIFT(787),
  [1996] = {.entry = {.count = 1, .reusable = true}}, SHIFT(684),
  [1998] = {.entry = {.count = 1, .reusable = true}}, SHIFT(369),
  [2000] = {.entry = {.count = 1, .reusable = false}}, SHIFT(864),
  [2002] = {.entry = {.count = 1, .reusable = true}}, SHIFT(864),
  [2004] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_style_property_statement, 3, 0, 62),
  [2006] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_style_property_statement, 3, 0, 85),
  [2008] = {.entry = {.count = 1, .reusable = false}}, SHIFT(466),
  [2010] = {.entry = {.count = 1, .reusable = true}}, SHIFT(466),
  [2012] = {.entry = {.count = 1, .reusable = false}}, SHIFT(711),
  [2014] = {.entry = {.count = 1, .reusable = false}}, SHIFT(913),
  [2016] = {.entry = {.count = 1, .reusable = true}}, SHIFT(213),
  [2018] = {.entry = {.count = 1, .reusable = true}}, SHIFT(28),
  [2020] = {.entry = {.count = 1, .reusable = false}}, SHIFT(700),
  [2022] = {.entry = {.count = 1, .reusable = true}}, SHIFT(700),
  [2024] = {.entry = {.count = 1, .reusable = false}}, SHIFT(716),
  [2026] = {.entry = {.count = 1, .reusable = true}}, SHIFT(716),
  [2028] = {.entry = {.count = 1, .reusable = false}}, SHIFT(719),
  [2030] = {.entry = {.count = 1, .reusable = true}}, SHIFT(719),
  [2032] = {.entry = {.count = 1, .reusable = true}}, SHIFT(809),
  [2034] = {.entry = {.count = 1, .reusable = true}}, SHIFT(637),
  [2036] = {.entry = {.count = 1, .reusable = true}}, SHIFT(935),
  [2038] = {.entry = {.count = 1, .reusable = true}}, SHIFT(679),
  [2040] = {.entry = {.count = 1, .reusable = true}}, SHIFT(283),
  [2042] = {.entry = {.count = 1, .reusable = false}}, SHIFT(695),
  [2044] = {.entry = {.count = 1, .reusable = true}}, SHIFT(695),
  [2046] = {.entry = {.count = 1, .reusable = false}}, SHIFT(672),
  [2048] = {.entry = {.count = 1, .reusable = true}}, SHIFT(672),
  [2050] = {.entry = {.count = 1, .reusable = false}}, SHIFT(677),
  [2052] = {.entry = {.count = 1, .reusable = true}}, SHIFT(677),
  [2054] = {.entry = {.count = 1, .reusable = true}}, SHIFT(939),
  [2056] = {.entry = {.count = 1, .reusable = true}}, SHIFT(685),
  [2058] = {.entry = {.count = 1, .reusable = true}}, SHIFT(303),
  [2060] = {.entry = {.count = 1, .reusable = true}}, SHIFT(859),
  [2062] = {.entry = {.count = 1, .reusable = true}}, SHIFT(705),
  [2064] = {.entry = {.count = 1, .reusable = true}}, SHIFT(292),
  [2066] = {.entry = {.count = 1, .reusable = true}}, SHIFT(640),
  [2068] = {.entry = {.count = 1, .reusable = false}}, SHIFT(706),
  [2070] = {.entry = {.count = 1, .reusable = true}}, SHIFT(706),
  [2072] = {.entry = {.count = 1, .reusable = false}}, SHIFT(688),
  [2074] = {.entry = {.count = 1, .reusable = true}}, SHIFT(688),
  [2076] = {.entry = {.count = 1, .reusable = false}}, SHIFT(727),
  [2078] = {.entry = {.count = 1, .reusable = true}}, SHIFT(727),
  [2080] = {.entry = {.count = 1, .reusable = false}}, SHIFT(770),
  [2082] = {.entry = {.count = 1, .reusable = true}}, SHIFT(770),
  [2084] = {.entry = {.count = 1, .reusable = true}}, SHIFT(598),
  [2086] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_screen_language_statement_repeat2, 1, 0, 74),
  [2088] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__keyword_property, 2, 1, 81),
  [2090] = {.entry = {.count = 1, .reusable = false}}, SHIFT(709),
  [2092] = {.entry = {.count = 1, .reusable = false}}, SHIFT(896),
  [2094] = {.entry = {.count = 1, .reusable = true}}, SHIFT(324),
  [2096] = {.entry = {.count = 1, .reusable = false}}, SHIFT(564),
  [2098] = {.entry = {.count = 1, .reusable = false}}, SHIFT(903),
  [2100] = {.entry = {.count = 1, .reusable = false}}, SHIFT(443),
  [2102] = {.entry = {.count = 1, .reusable = false}}, SHIFT(910),
  [2104] = {.entry = {.count = 1, .reusable = true}}, SHIFT(794),
  [2106] = {.entry = {.count = 1, .reusable = false}}, SHIFT(718),
  [2108] = {.entry = {.count = 1, .reusable = true}}, SHIFT(718),
  [2110] = {.entry = {.count = 1, .reusable = false}}, SHIFT(816),
  [2112] = {.entry = {.count = 1, .reusable = true}}, SHIFT(816),
  [2114] = {.entry = {.count = 1, .reusable = false}}, SHIFT(838),
  [2116] = {.entry = {.count = 1, .reusable = true}}, SHIFT(838),
  [2118] = {.entry = {.count = 1, .reusable = false}}, SHIFT(726),
  [2120] = {.entry = {.count = 1, .reusable = true}}, SHIFT(726),
  [2122] = {.entry = {.count = 1, .reusable = true}}, SHIFT(904),
  [2124] = {.entry = {.count = 1, .reusable = false}}, SHIFT(959),
  [2126] = {.entry = {.count = 1, .reusable = true}}, SHIFT(959),
  [2128] = {.entry = {.count = 1, .reusable = false}}, SHIFT(960),
  [2130] = {.entry = {.count = 1, .reusable = true}}, SHIFT(960),
  [2132] = {.entry = {.count = 1, .reusable = true}}, SHIFT(724),
  [2134] = {.entry = {.count = 1, .reusable = false}}, SHIFT(702),
  [2136] = {.entry = {.count = 1, .reusable = true}}, SHIFT(702),
  [2138] = {.entry = {.count = 1, .reusable = true}}, SHIFT(990),
  [2140] = {.entry = {.count = 1, .reusable = true}}, SHIFT(483),
  [2142] = {.entry = {.count = 1, .reusable = false}}, SHIFT(587),
  [2144] = {.entry = {.count = 1, .reusable = true}}, SHIFT(752),
  [2146] = {.entry = {.count = 1, .reusable = true}}, SHIFT(938),
  [2148] = {.entry = {.count = 1, .reusable = true}}, SHIFT(302),
  [2150] = {.entry = {.count = 1, .reusable = true}}, SHIFT(682),
  [2152] = {.entry = {.count = 1, .reusable = true}}, SHIFT(984),
  [2154] = {.entry = {.count = 1, .reusable = true}}, SHIFT(205),
  [2156] = {.entry = {.count = 1, .reusable = true}}, SHIFT(946),
  [2158] = {.entry = {.count = 1, .reusable = true}}, SHIFT(319),
  [2160] = {.entry = {.count = 1, .reusable = true}}, SHIFT(497),
  [2162] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__screen_condition, 1, 0, 0),
  [2164] = {.entry = {.count = 1, .reusable = true}}, SHIFT(779),
  [2166] = {.entry = {.count = 1, .reusable = true}}, SHIFT(208),
  [2168] = {.entry = {.count = 1, .reusable = true}}, SHIFT(982),
  [2170] = {.entry = {.count = 1, .reusable = true}}, SHIFT(152),
  [2172] = {.entry = {.count = 1, .reusable = true}}, SHIFT(947),
  [2174] = {.entry = {.count = 1, .reusable = true}}, SHIFT(336),
  [2176] = {.entry = {.count = 1, .reusable = true}}, SHIFT(504),
  [2178] = {.entry = {.count = 1, .reusable = true}}, SHIFT(818),
  [2180] = {.entry = {.count = 1, .reusable = true}}, SHIFT(514),
  [2182] = {.entry = {.count = 1, .reusable = true}}, SHIFT(783),
  [2184] = {.entry = {.count = 1, .reusable = true}}, SHIFT(606),
  [2186] = {.entry = {.count = 1, .reusable = true}}, SHIFT(184),
  [2188] = {.entry = {.count = 1, .reusable = true}}, SHIFT(758),
  [2190] = {.entry = {.count = 1, .reusable = true}}, SHIFT(138),
  [2192] = {.entry = {.count = 1, .reusable = false}}, SHIFT(639),
  [2194] = {.entry = {.count = 1, .reusable = true}}, SHIFT(744),
  [2196] = {.entry = {.count = 1, .reusable = true}}, SHIFT(256),
  [2198] = {.entry = {.count = 1, .reusable = true}}, SHIFT(641),
  [2200] = {.entry = {.count = 1, .reusable = true}}, SHIFT(245),
  [2202] = {.entry = {.count = 1, .reusable = true}}, SHIFT(934),
  [2204] = {.entry = {.count = 1, .reusable = true}}, SHIFT(282),
  [2206] = {.entry = {.count = 1, .reusable = true}}, SHIFT(810),
  [2208] = {.entry = {.count = 1, .reusable = true}}, SHIFT(239),
  [2210] = {.entry = {.count = 1, .reusable = true}}, SHIFT(840),
  [2212] = {.entry = {.count = 1, .reusable = true}}, SHIFT(400),
  [2214] = {.entry = {.count = 1, .reusable = true}}, SHIFT(579),
  [2216] = {.entry = {.count = 1, .reusable = true}}, SHIFT(929),
  [2218] = {.entry = {.count = 1, .reusable = true}}, SHIFT(143),
  [2220] = {.entry = {.count = 1, .reusable = false}}, SHIFT(645),
  [2222] = {.entry = {.count = 1, .reusable = true}}, SHIFT(924),
  [2224] = {.entry = {.count = 1, .reusable = true}}, SHIFT(243),
  [2226] = {.entry = {.count = 1, .reusable = false}}, SHIFT(649),
  [2228] = {.entry = {.count = 1, .reusable = true}}, SHIFT(814),
  [2230] = {.entry = {.count = 1, .reusable = true}}, SHIFT(926),
  [2232] = {.entry = {.count = 1, .reusable = true}}, SHIFT(251),
  [2234] = {.entry = {.count = 1, .reusable = true}}, SHIFT(655),
  [2236] = {.entry = {.count = 1, .reusable = true}}, SHIFT(253),
  [2238] = {.entry = {.count = 1, .reusable = true}}, SHIFT(842),
  [2240] = {.entry = {.count = 1, .reusable = true}}, SHIFT(290),
  [2242] = {.entry = {.count = 1, .reusable = true}}, SHIFT(745),
  [2244] = {.entry = {.count = 1, .reusable = true}}, SHIFT(164),
  [2246] = {.entry = {.count = 1, .reusable = true}}, SHIFT(747),
  [2248] = {.entry = {.count = 1, .reusable = true}}, SHIFT(257),
  [2250] = {.entry = {.count = 1, .reusable = true}}, SHIFT(785),
  [2252] = {.entry = {.count = 1, .reusable = true}}, SHIFT(367),
  [2254] = {.entry = {.count = 1, .reusable = true}}, SHIFT(833),
  [2256] = {.entry = {.count = 1, .reusable = true}}, SHIFT(270),
  [2258] = {.entry = {.count = 1, .reusable = true}}, SHIFT(834),
  [2260] = {.entry = {.count = 1, .reusable = true}}, SHIFT(271),
  [2262] = {.entry = {.count = 1, .reusable = true}}, SHIFT(559),
  [2264] = {.entry = {.count = 1, .reusable = true}}, SHIFT(654),
  [2266] = {.entry = {.count = 1, .reusable = true}}, SHIFT(225),
  [2268] = {.entry = {.count = 1, .reusable = true}}, SHIFT(966),
  [2270] = {.entry = {.count = 1, .reusable = true}}, SHIFT(551),
  [2272] = {.entry = {.count = 1, .reusable = true}}, SHIFT(499),
  [2274] = {.entry = {.count = 1, .reusable = true}}, SHIFT(569),
  [2276] = {.entry = {.count = 1, .reusable = true}}, SHIFT(512),
  [2278] = {.entry = {.count = 1, .reusable = true}}, SHIFT(526),
  [2280] = {.entry = {.count = 1, .reusable = true}}, SHIFT(476),
  [2282] = {.entry = {.count = 1, .reusable = true}}, SHIFT(902),
  [2284] = {.entry = {.count = 1, .reusable = true}}, SHIFT(133),
  [2286] = {.entry = {.count = 1, .reusable = true}}, SHIFT(210),
  [2288] = {.entry = {.count = 1, .reusable = true}}, SHIFT(144),
  [2290] = {.entry = {.count = 1, .reusable = true}}, SHIFT(179),
  [2292] = {.entry = {.count = 1, .reusable = true}}, SHIFT(392),
  [2294] = {.entry = {.count = 1, .reusable = true}}, SHIFT(821),
  [2296] = {.entry = {.count = 1, .reusable = true}}, SHIFT(475),
  [2298] = {.entry = {.count = 1, .reusable = true}}, SHIFT(393),
  [2300] = {.entry = {.count = 1, .reusable = true}}, SHIFT(288),
  [2302] = {.entry = {.count = 1, .reusable = true}}, SHIFT(180),
  [2304] = {.entry = {.count = 1, .reusable = true}}, SHIFT(534),
  [2306] = {.entry = {.count = 1, .reusable = true}}, SHIFT(473),
  [2308] = {.entry = {.count = 1, .reusable = true}}, SHIFT(643),
  [2310] = {.entry = {.count = 1, .reusable = true}}, SHIFT(952),
  [2312] = {.entry = {.count = 1, .reusable = true}}, SHIFT(892),
  [2314] = {.entry = {.count = 1, .reusable = true}}, SHIFT(865),
  [2316] = {.entry = {.count = 1, .reusable = true}}, SHIFT(927),
  [2318] = {.entry = {.count = 1, .reusable = true}}, SHIFT(943),
  [2320] = {.entry = {.count = 1, .reusable = true}}, SHIFT(258),
  [2322] = {.entry = {.count = 1, .reusable = true}}, SHIFT(604),
  [2324] = {.entry = {.count = 1, .reusable = true}}, SHIFT(189),
  [2326] = {.entry = {.count = 1, .reusable = true}}, SHIFT(181),
  [2328] = {.entry = {.count = 1, .reusable = true}}, SHIFT(945),
  [2330] = {.entry = {.count = 1, .reusable = true}}, SHIFT(202),
  [2332] = {.entry = {.count = 1, .reusable = true}}, SHIFT(412),
  [2334] = {.entry = {.count = 1, .reusable = true}}, SHIFT(693),
  [2336] = {.entry = {.count = 1, .reusable = true}}, SHIFT(500),
  [2338] = {.entry = {.count = 1, .reusable = true}}, SHIFT(190),
  [2340] = {.entry = {.count = 1, .reusable = true}}, SHIFT(209),
  [2342] = {.entry = {.count = 1, .reusable = true}}, SHIFT(594),
  [2344] = {.entry = {.count = 1, .reusable = true}}, SHIFT(289),
  [2346] = {.entry = {.count = 1, .reusable = true}}, SHIFT(515),
  [2348] = {.entry = {.count = 1, .reusable = true}}, SHIFT(394),
  [2350] = {.entry = {.count = 1, .reusable = true}}, SHIFT(558),
  [2352] = {.entry = {.count = 1, .reusable = true}}, SHIFT(555),
  [2354] = {.entry = {.count = 1, .reusable = true}}, SHIFT(748),
  [2356] = {.entry = {.count = 1, .reusable = true}}, SHIFT(402),
  [2358] = {.entry = {.count = 1, .reusable = true}}, SHIFT(224),
  [2360] = {.entry = {.count = 1, .reusable = true}}, SHIFT(341),
  [2362] = {.entry = {.count = 1, .reusable = true}}, SHIFT(226),
  [2364] = {.entry = {.count = 1, .reusable = true}}, SHIFT(521),
  [2366] = {.entry = {.count = 1, .reusable = true}}, SHIFT(229),
  [2368] = {.entry = {.count = 1, .reusable = true}}, SHIFT(505),
  [2370] = {.entry = {.count = 1, .reusable = true}}, SHIFT(502),
  [2372] = {.entry = {.count = 1, .reusable = true}}, SHIFT(232),
  [2374] = {.entry = {.count = 1, .reusable = true}}, SHIFT(979),
  [2376] = {.entry = {.count = 1, .reusable = true}}, SHIFT(182),
  [2378] = {.entry = {.count = 1, .reusable = true}}, SHIFT(980),
  [2380] = {.entry = {.count = 1, .reusable = true}}, SHIFT(343),
  [2382] = {.entry = {.count = 1, .reusable = true}}, SHIFT(240),
  [2384] = {.entry = {.count = 1, .reusable = true}}, SHIFT(241),
  [2386] = {.entry = {.count = 1, .reusable = true}}, SHIFT(698),
  [2388] = {.entry = {.count = 1, .reusable = true}}, SHIFT(345),
  [2390] = {.entry = {.count = 1, .reusable = true}}, SHIFT(616),
  [2392] = {.entry = {.count = 1, .reusable = true}}, SHIFT(244),
  [2394] = {.entry = {.count = 1, .reusable = true}}, SHIFT(75),
  [2396] = {.entry = {.count = 1, .reusable = true}}, SHIFT(76),
  [2398] = {.entry = {.count = 1, .reusable = true}}, SHIFT(556),
  [2400] = {.entry = {.count = 1, .reusable = true}}, SHIFT(535),
  [2402] = {.entry = {.count = 1, .reusable = true}}, SHIFT(252),
  [2404] = {.entry = {.count = 1, .reusable = true}}, SHIFT(766),
  [2406] = {.entry = {.count = 1, .reusable = true}}, SHIFT(576),
  [2408] = {.entry = {.count = 1, .reusable = true}}, SHIFT(658),
  [2410] = {.entry = {.count = 1, .reusable = true}}, SHIFT(557),
  [2412] = {.entry = {.count = 1, .reusable = true}}, SHIFT(948),
  [2414] = {.entry = {.count = 1, .reusable = true}}, SHIFT(140),
  [2416] = {.entry = {.count = 1, .reusable = true}}, SHIFT(422),
  [2418] = {.entry = {.count = 1, .reusable = true}}, SHIFT(659),
  [2420] = {.entry = {.count = 1, .reusable = true}}, SHIFT(141),
  [2422] = {.entry = {.count = 1, .reusable = true}}, SHIFT(681),
  [2424] = {.entry = {.count = 1, .reusable = true}}, SHIFT(272),
  [2426] = {.entry = {.count = 1, .reusable = true}}, SHIFT(736),
  [2428] = {.entry = {.count = 1, .reusable = true}}, SHIFT(275),
  [2430] = {.entry = {.count = 1, .reusable = true}}, SHIFT(86),
  [2432] = {.entry = {.count = 1, .reusable = true}}, SHIFT(602),
  [2434] = {.entry = {.count = 1, .reusable = true}}, SHIFT(280),
  [2436] = {.entry = {.count = 1, .reusable = true}}, SHIFT(281),
  [2438] = {.entry = {.count = 1, .reusable = true}}, SHIFT(737),
  [2440] = {.entry = {.count = 1, .reusable = true}}, SHIFT(529),
  [2442] = {.entry = {.count = 1, .reusable = true}}, SHIFT(618),
  [2444] = {.entry = {.count = 1, .reusable = true}}, SHIFT(291),
  [2446] = {.entry = {.count = 1, .reusable = true}}, SHIFT(397),
  [2448] = {.entry = {.count = 1, .reusable = true}}, SHIFT(326),
  [2450] = {.entry = {.count = 1, .reusable = true}}, SHIFT(295),
  [2452] = {.entry = {.count = 1, .reusable = true}}, SHIFT(296),
  [2454] = {.entry = {.count = 1, .reusable = true}}, SHIFT(297),
  [2456] = {.entry = {.count = 1, .reusable = true}}, SHIFT(806),
  [2458] = {.entry = {.count = 1, .reusable = true}}, SHIFT(204),
  [2460] = {.entry = {.count = 1, .reusable = true}}, SHIFT(398),
  [2462] = {.entry = {.count = 1, .reusable = true}}, SHIFT(399),
  [2464] = {.entry = {.count = 1, .reusable = true}}, SHIFT(153),
  [2466] = {.entry = {.count = 1, .reusable = true}}, SHIFT(154),
  [2468] = {.entry = {.count = 1, .reusable = true}},  ACCEPT_INPUT(),
  [2470] = {.entry = {.count = 1, .reusable = true}}, SHIFT(311),
  [2472] = {.entry = {.count = 1, .reusable = true}}, SHIFT(312),
  [2474] = {.entry = {.count = 1, .reusable = true}}, SHIFT(313),
  [2476] = {.entry = {.count = 1, .reusable = true}}, SHIFT(183),
  [2478] = {.entry = {.count = 1, .reusable = true}}, SHIFT(316),
  [2480] = {.entry = {.count = 1, .reusable = true}}, SHIFT(317),
  [2482] = {.entry = {.count = 1, .reusable = true}}, SHIFT(318),
  [2484] = {.entry = {.count = 1, .reusable = true}}, SHIFT(743),
  [2486] = {.entry = {.count = 1, .reusable = true}}, SHIFT(197),
  [2488] = {.entry = {.count = 1, .reusable = true}}, SHIFT(830),
  [2490] = {.entry = {.count = 1, .reusable = true}}, SHIFT(323),
  [2492] = {.entry = {.count = 1, .reusable = true}}, SHIFT(471),
  [2494] = {.entry = {.count = 1, .reusable = true}}, SHIFT(328),
  [2496] = {.entry = {.count = 1, .reusable = true}}, SHIFT(198),
  [2498] = {.entry = {.count = 1, .reusable = true}}, SHIFT(879),
  [2500] = {.entry = {.count = 1, .reusable = true}}, SHIFT(185),
  [2502] = {.entry = {.count = 1, .reusable = true}}, SHIFT(335),
  [2504] = {.entry = {.count = 1, .reusable = true}}, SHIFT(472),
  [2506] = {.entry = {.count = 1, .reusable = true}}, SHIFT(337),
  [2508] = {.entry = {.count = 1, .reusable = true}}, SHIFT(338),
  [2510] = {.entry = {.count = 1, .reusable = true}}, SHIFT(822),
  [2512] = {.entry = {.count = 1, .reusable = true}}, SHIFT(340),
  [2514] = {.entry = {.count = 1, .reusable = true}}, SHIFT(342),
  [2516] = {.entry = {.count = 1, .reusable = true}}, SHIFT(344),
  [2518] = {.entry = {.count = 1, .reusable = true}}, SHIFT(607),
  [2520] = {.entry = {.count = 1, .reusable = true}}, SHIFT(348),
  [2522] = {.entry = {.count = 1, .reusable = true}}, SHIFT(831),
  [2524] = {.entry = {.count = 1, .reusable = true}}, SHIFT(351),
  [2526] = {.entry = {.count = 1, .reusable = true}}, SHIFT(352),
  [2528] = {.entry = {.count = 1, .reusable = true}}, SHIFT(829),
  [2530] = {.entry = {.count = 1, .reusable = true}}, SHIFT(547),
  [2532] = {.entry = {.count = 1, .reusable = true}}, SHIFT(881),
  [2534] = {.entry = {.count = 1, .reusable = true}}, SHIFT(819),
  [2536] = {.entry = {.count = 1, .reusable = true}}, SHIFT(850),
  [2538] = {.entry = {.count = 1, .reusable = true}}, SHIFT(156),
  [2540] = {.entry = {.count = 1, .reusable = true}}, SHIFT(362),
  [2542] = {.entry = {.count = 1, .reusable = true}}, SHIFT(363),
  [2544] = {.entry = {.count = 1, .reusable = true}}, SHIFT(364),
  [2546] = {.entry = {.count = 1, .reusable = true}}, SHIFT(366),
  [2548] = {.entry = {.count = 1, .reusable = true}}, SHIFT(368),
  [2550] = {.entry = {.count = 1, .reusable = true}}, SHIFT(370),
  [2552] = {.entry = {.count = 1, .reusable = true}}, SHIFT(625),
  [2554] = {.entry = {.count = 1, .reusable = true}}, SHIFT(372),
  [2556] = {.entry = {.count = 1, .reusable = true}}, SHIFT(513),
  [2558] = {.entry = {.count = 1, .reusable = true}}, SHIFT(374),
  [2560] = {.entry = {.count = 1, .reusable = true}}, SHIFT(376),
  [2562] = {.entry = {.count = 1, .reusable = true}}, SHIFT(778),
  [2564] = {.entry = {.count = 1, .reusable = true}}, SHIFT(158),
  [2566] = {.entry = {.count = 1, .reusable = true}}, SHIFT(788),
  [2568] = {.entry = {.count = 1, .reusable = true}}, SHIFT(381),
  [2570] = {.entry = {.count = 1, .reusable = true}}, SHIFT(382),
  [2572] = {.entry = {.count = 1, .reusable = true}}, SHIFT(383),
  [2574] = {.entry = {.count = 1, .reusable = true}}, SHIFT(160),
  [2576] = {.entry = {.count = 1, .reusable = true}}, SHIFT(410),
  [2578] = {.entry = {.count = 1, .reusable = true}}, SHIFT(673),
  [2580] = {.entry = {.count = 1, .reusable = true}}, SHIFT(771),
  [2582] = {.entry = {.count = 1, .reusable = true}}, SHIFT(792),
  [2584] = {.entry = {.count = 1, .reusable = true}}, SHIFT(191),
  [2586] = {.entry = {.count = 1, .reusable = true}}, SHIFT(570),
  [2588] = {.entry = {.count = 1, .reusable = true}}, SHIFT(310),
  [2590] = {.entry = {.count = 1, .reusable = true}}, SHIFT(620),
  [2592] = {.entry = {.count = 1, .reusable = true}}, SHIFT(781),
  [2594] = {.entry = {.count = 1, .reusable = true}}, SHIFT(784),
  [2596] = {.entry = {.count = 1, .reusable = true}}, SHIFT(932),
  [2598] = {.entry = {.count = 1, .reusable = true}}, SHIFT(192),
  [2600] = {.entry = {.count = 1, .reusable = true}}, SHIFT(704),
  [2602] = {.entry = {.count = 1, .reusable = true}}, SHIFT(776),
  [2604] = {.entry = {.count = 1, .reusable = true}}, SHIFT(516),
  [2606] = {.entry = {.count = 1, .reusable = true}}, SHIFT(710),
  [2608] = {.entry = {.count = 1, .reusable = true}}, SHIFT(407),
  [2610] = {.entry = {.count = 1, .reusable = true}}, SHIFT(713),
  [2612] = {.entry = {.count = 1, .reusable = true}}, SHIFT(145),
  [2614] = {.entry = {.count = 1, .reusable = true}}, SHIFT(97),
  [2616] = {.entry = {.count = 1, .reusable = true}}, SHIFT(517),
  [2618] = {.entry = {.count = 1, .reusable = true}}, SHIFT(802),
  [2620] = {.entry = {.count = 1, .reusable = true}}, SHIFT(566),
  [2622] = {.entry = {.count = 1, .reusable = true}}, SHIFT(518),
  [2624] = {.entry = {.count = 1, .reusable = true}}, SHIFT(542),
  [2626] = {.entry = {.count = 1, .reusable = true}}, SHIFT(165),
  [2628] = {.entry = {.count = 1, .reusable = true}}, SHIFT(560),
  [2630] = {.entry = {.count = 1, .reusable = true}}, SHIFT(812),
  [2632] = {.entry = {.count = 1, .reusable = true}}, SHIFT(815),
  [2634] = {.entry = {.count = 1, .reusable = true}}, SHIFT(527),
  [2636] = {.entry = {.count = 1, .reusable = true}}, SHIFT(823),
  [2638] = {.entry = {.count = 1, .reusable = true}}, SHIFT(824),
  [2640] = {.entry = {.count = 1, .reusable = true}}, SHIFT(825),
  [2642] = {.entry = {.count = 1, .reusable = true}}, SHIFT(567),
  [2644] = {.entry = {.count = 1, .reusable = true}}, SHIFT(520),
  [2646] = {.entry = {.count = 1, .reusable = true}}, SHIFT(568),
  [2648] = {.entry = {.count = 1, .reusable = true}}, SHIFT(486),
  [2650] = {.entry = {.count = 1, .reusable = true}}, SHIFT(522),
  [2652] = {.entry = {.count = 1, .reusable = true}}, SHIFT(835),
  [2654] = {.entry = {.count = 1, .reusable = true}}, SHIFT(408),
  [2656] = {.entry = {.count = 1, .reusable = true}}, SHIFT(837),
  [2658] = {.entry = {.count = 1, .reusable = true}}, SHIFT(413),
  [2660] = {.entry = {.count = 1, .reusable = true}}, SHIFT(839),
  [2662] = {.entry = {.count = 1, .reusable = true}}, SHIFT(772),
  [2664] = {.entry = {.count = 1, .reusable = true}}, SHIFT(636),
  [2666] = {.entry = {.count = 1, .reusable = true}}, SHIFT(571),
  [2668] = {.entry = {.count = 1, .reusable = true}}, SHIFT(261),
  [2670] = {.entry = {.count = 1, .reusable = true}}, SHIFT(849),
  [2672] = {.entry = {.count = 1, .reusable = true}}, SHIFT(851),
  [2674] = {.entry = {.count = 1, .reusable = true}}, SHIFT(852),
  [2676] = {.entry = {.count = 1, .reusable = true}}, SHIFT(780),
  [2678] = {.entry = {.count = 1, .reusable = true}}, SHIFT(572),
  [2680] = {.entry = {.count = 1, .reusable = true}}, SHIFT(860),
  [2682] = {.entry = {.count = 1, .reusable = true}}, SHIFT(861),
  [2684] = {.entry = {.count = 1, .reusable = true}}, SHIFT(573),
  [2686] = {.entry = {.count = 1, .reusable = true}}, SHIFT(524),
  [2688] = {.entry = {.count = 1, .reusable = true}}, SHIFT(574),
  [2690] = {.entry = {.count = 1, .reusable = true}}, SHIFT(415),
  [2692] = {.entry = {.count = 1, .reusable = true}}, SHIFT(925),
  [2694] = {.entry = {.count = 1, .reusable = true}}, SHIFT(411),
  [2696] = {.entry = {.count = 1, .reusable = true}}, SHIFT(868),
  [2698] = {.entry = {.count = 1, .reusable = true}}, SHIFT(873),
  [2700] = {.entry = {.count = 1, .reusable = true}}, SHIFT(432),
  [2702] = {.entry = {.count = 1, .reusable = true}}, SHIFT(575),
  [2704] = {.entry = {.count = 1, .reusable = true}}, SHIFT(611),
  [2706] = {.entry = {.count = 1, .reusable = true}}, SHIFT(612),
  [2708] = {.entry = {.count = 1, .reusable = true}}, SHIFT(434),
  [2710] = {.entry = {.count = 1, .reusable = true}}, SHIFT(720),
  [2712] = {.entry = {.count = 1, .reusable = true}}, SHIFT(131),
  [2714] = {.entry = {.count = 1, .reusable = true}}, SHIFT(187),
  [2716] = {.entry = {.count = 1, .reusable = true}}, SHIFT(907),
  [2718] = {.entry = {.count = 1, .reusable = true}}, SHIFT(495),
  [2720] = {.entry = {.count = 1, .reusable = true}}, SHIFT(496),
  [2722] = {.entry = {.count = 1, .reusable = true}}, SHIFT(916),
  [2724] = {.entry = {.count = 1, .reusable = true}}, SHIFT(917),
  [2726] = {.entry = {.count = 1, .reusable = true}}, SHIFT(429),
  [2728] = {.entry = {.count = 1, .reusable = true}}, SHIFT(409),
  [2730] = {.entry = {.count = 1, .reusable = true}}, SHIFT(431),
  [2732] = {.entry = {.count = 1, .reusable = true}}, SHIFT(537),
  [2734] = {.entry = {.count = 1, .reusable = true}}, SHIFT(538),
  [2736] = {.entry = {.count = 1, .reusable = true}}, SHIFT(540),
  [2738] = {.entry = {.count = 1, .reusable = true}}, SHIFT(541),
  [2740] = {.entry = {.count = 1, .reusable = true}}, SHIFT(530),
  [2742] = {.entry = {.count = 1, .reusable = true}}, SHIFT(325),
  [2744] = {.entry = {.count = 1, .reusable = true}}, SHIFT(561),
  [2746] = {.entry = {.count = 1, .reusable = true}}, SHIFT(961),
  [2748] = {.entry = {.count = 1, .reusable = true}}, SHIFT(962),
  [2750] = {.entry = {.count = 1, .reusable = true}}, SHIFT(963),
  [2752] = {.entry = {.count = 1, .reusable = true}}, SHIFT(964),
  [2754] = {.entry = {.count = 1, .reusable = true}}, SHIFT(965),
  [2756] = {.entry = {.count = 1, .reusable = true}}, SHIFT(219),
  [2758] = {.entry = {.count = 1, .reusable = true}}, SHIFT(967),
  [2760] = {.entry = {.count = 1, .reusable = true}}, SHIFT(968),
  [2762] = {.entry = {.count = 1, .reusable = true}}, SHIFT(168),
  [2764] = {.entry = {.count = 1, .reusable = true}}, SHIFT(169),
  [2766] = {.entry = {.count = 1, .reusable = true}}, SHIFT(498),
  [2768] = {.entry = {.count = 1, .reusable = true}}, SHIFT(955),
  [2770] = {.entry = {.count = 1, .reusable = true}}, SHIFT(139),
  [2772] = {.entry = {.count = 1, .reusable = true}}, SHIFT(246),
  [2774] = {.entry = {.count = 1, .reusable = true}}, SHIFT(199),
  [2776] = {.entry = {.count = 1, .reusable = true}}, SHIFT(581),
  [2778] = {.entry = {.count = 1, .reusable = true}}, SHIFT(539),
  [2780] = {.entry = {.count = 1, .reusable = true}}, SHIFT(666),
  [2782] = {.entry = {.count = 1, .reusable = true}}, SHIFT(728),
  [2784] = {.entry = {.count = 1, .reusable = true}}, SHIFT(729),
  [2786] = {.entry = {.count = 1, .reusable = true}}, SHIFT(373),
};

enum ts_external_scanner_symbol_identifiers {
  ts_external_token__newline = 0,
  ts_external_token__indent = 1,
  ts_external_token__dedent = 2,
  ts_external_token_python_block = 3,
};

static const TSSymbol ts_external_scanner_symbol_map[EXTERNAL_TOKEN_COUNT] = {
  [ts_external_token__newline] = sym__newline,
  [ts_external_token__indent] = sym__indent,
  [ts_external_token__dedent] = sym__dedent,
  [ts_external_token_python_block] = sym_python_block,
};

static const bool ts_external_scanner_states[9][EXTERNAL_TOKEN_COUNT] = {
  [1] = {
    [ts_external_token__newline] = true,
    [ts_external_token__indent] = true,
    [ts_external_token__dedent] = true,
    [ts_external_token_python_block] = true,
  },
  [2] = {
    [ts_external_token__newline] = true,
  },
  [3] = {
    [ts_external_token__dedent] = true,
  },
  [4] = {
    [ts_external_token__indent] = true,
    [ts_external_token__dedent] = true,
  },
  [5] = {
    [ts_external_token__indent] = true,
  },
  [6] = {
    [ts_external_token__newline] = true,
    [ts_external_token__dedent] = true,
  },
  [7] = {
    [ts_external_token_python_block] = true,
  },
  [8] = {
    [ts_external_token__dedent] = true,
    [ts_external_token_python_block] = true,
  },
};

#ifdef __cplusplus
extern "C" {
#endif
void *tree_sitter_renpy_external_scanner_create(void);
void tree_sitter_renpy_external_scanner_destroy(void *);
bool tree_sitter_renpy_external_scanner_scan(void *, TSLexer *, const bool *);
unsigned tree_sitter_renpy_external_scanner_serialize(void *, char *);
void tree_sitter_renpy_external_scanner_deserialize(void *, const char *, unsigned);

#ifdef TREE_SITTER_HIDE_SYMBOLS
#define TS_PUBLIC
#elif defined(_WIN32)
#define TS_PUBLIC __declspec(dllexport)
#else
#define TS_PUBLIC __attribute__((visibility("default")))
#endif

TS_PUBLIC const TSLanguage *tree_sitter_renpy(void) {
  static const TSLanguage language = {
    .version = LANGUAGE_VERSION,
    .symbol_count = SYMBOL_COUNT,
    .alias_count = ALIAS_COUNT,
    .token_count = TOKEN_COUNT,
    .external_token_count = EXTERNAL_TOKEN_COUNT,
    .state_count = STATE_COUNT,
    .large_state_count = LARGE_STATE_COUNT,
    .production_id_count = PRODUCTION_ID_COUNT,
    .field_count = FIELD_COUNT,
    .max_alias_sequence_length = MAX_ALIAS_SEQUENCE_LENGTH,
    .parse_table = &ts_parse_table[0][0],
    .small_parse_table = ts_small_parse_table,
    .small_parse_table_map = ts_small_parse_table_map,
    .parse_actions = ts_parse_actions,
    .symbol_names = ts_symbol_names,
    .field_names = ts_field_names,
    .field_map_slices = ts_field_map_slices,
    .field_map_entries = ts_field_map_entries,
    .symbol_metadata = ts_symbol_metadata,
    .public_symbol_map = ts_symbol_map,
    .alias_map = ts_non_terminal_alias_map,
    .alias_sequences = &ts_alias_sequences[0][0],
    .lex_modes = ts_lex_modes,
    .lex_fn = ts_lex,
    .keyword_lex_fn = ts_lex_keywords,
    .keyword_capture_token = sym_identifier,
    .external_scanner = {
      &ts_external_scanner_states[0][0],
      ts_external_scanner_symbol_map,
      tree_sitter_renpy_external_scanner_create,
      tree_sitter_renpy_external_scanner_destroy,
      tree_sitter_renpy_external_scanner_scan,
      tree_sitter_renpy_external_scanner_serialize,
      tree_sitter_renpy_external_scanner_deserialize,
    },
    .primary_state_ids = ts_primary_state_ids,
  };
  return &language;
}
#ifdef __cplusplus
}
#endif
