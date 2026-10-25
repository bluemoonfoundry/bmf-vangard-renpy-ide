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
#define STATE_COUNT 804
#define LARGE_STATE_COUNT 17
#define SYMBOL_COUNT 151
#define ALIAS_COUNT 0
#define TOKEN_COUNT 78
#define EXTERNAL_TOKEN_COUNT 3
#define FIELD_COUNT 35
#define MAX_ALIAS_SEQUENCE_LENGTH 11
#define PRODUCTION_ID_COUNT 79

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
  sym_source_file = 78,
  sym__statement = 79,
  sym__comment_line = 80,
  sym__block_colon = 81,
  sym__block = 82,
  sym__label_name = 83,
  sym__store_name = 84,
  sym_label_statement = 85,
  sym_parameter_list = 86,
  sym_jump_statement = 87,
  sym_call_statement = 88,
  sym_return_statement = 89,
  sym_pass_statement = 90,
  sym_menu_statement = 91,
  sym_menu_caption = 92,
  sym_menu_set = 93,
  sym_menu_choice = 94,
  sym_if_statement = 95,
  sym_elif_clause = 96,
  sym_else_clause = 97,
  sym_while_statement = 98,
  sym_for_statement = 99,
  sym_say_statement = 100,
  sym_python_statement = 101,
  sym_init_python_statement = 102,
  sym_dollar_statement = 103,
  sym_define_statement = 104,
  sym_default_statement = 105,
  sym_image_statement = 106,
  sym_scene_statement = 107,
  sym_show_statement = 108,
  sym_show_screen_statement = 109,
  sym_hide_screen_statement = 110,
  sym_call_screen_statement = 111,
  sym_hide_statement = 112,
  sym_with_statement = 113,
  sym_play_statement = 114,
  sym_queue_statement = 115,
  sym_stop_statement = 116,
  sym_voice_statement = 117,
  sym__audio_file = 118,
  sym_screen_statement = 119,
  sym_screen_language_statement = 120,
  sym__screen_condition = 121,
  sym__screen_line_end = 122,
  sym__positional_property = 123,
  sym__keyword_property = 124,
  sym_transform_statement = 125,
  sym__atl_block = 126,
  sym__atl_statement = 127,
  sym_atl_transform_property = 128,
  sym_atl_displayable = 129,
  sym_atl_with_statement = 130,
  sym_atl_block_statement = 131,
  sym_atl_time_statement = 132,
  sym_expression_statement = 133,
  sym_unknown_statement = 134,
  sym_translate_statement = 135,
  sym_style_statement = 136,
  sym_style_property_statement = 137,
  sym_camera_statement = 138,
  sym_layeredimage_statement = 139,
  sym_nvl_statement = 140,
  sym_string = 141,
  aux_sym_source_file_repeat1 = 142,
  aux_sym_menu_statement_repeat1 = 143,
  aux_sym_menu_caption_repeat1 = 144,
  aux_sym_if_statement_repeat1 = 145,
  aux_sym_screen_statement_repeat1 = 146,
  aux_sym_screen_language_statement_repeat1 = 147,
  aux_sym_screen_language_statement_repeat2 = 148,
  aux_sym__atl_block_repeat1 = 149,
  aux_sym_style_statement_repeat1 = 150,
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
  field_take_from = 28,
  field_target = 29,
  field_text = 30,
  field_transition = 31,
  field_value = 32,
  field_variable = 33,
  field_warper = 34,
  field_widget_tag = 35,
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
  [4] = {.index = 4, .length = 1},
  [5] = {.index = 5, .length = 3},
  [6] = {.index = 8, .length = 1},
  [7] = {.index = 9, .length = 1},
  [8] = {.index = 10, .length = 1},
  [9] = {.index = 11, .length = 1},
  [10] = {.index = 12, .length = 1},
  [11] = {.index = 13, .length = 1},
  [12] = {.index = 14, .length = 1},
  [13] = {.index = 15, .length = 1},
  [14] = {.index = 16, .length = 2},
  [15] = {.index = 18, .length = 2},
  [16] = {.index = 20, .length = 1},
  [17] = {.index = 21, .length = 1},
  [18] = {.index = 22, .length = 1},
  [19] = {.index = 23, .length = 2},
  [20] = {.index = 25, .length = 3},
  [21] = {.index = 28, .length = 2},
  [22] = {.index = 30, .length = 1},
  [23] = {.index = 31, .length = 1},
  [24] = {.index = 32, .length = 2},
  [25] = {.index = 34, .length = 1},
  [26] = {.index = 35, .length = 2},
  [27] = {.index = 37, .length = 1},
  [28] = {.index = 38, .length = 2},
  [29] = {.index = 40, .length = 2},
  [30] = {.index = 42, .length = 2},
  [31] = {.index = 44, .length = 2},
  [32] = {.index = 46, .length = 4},
  [33] = {.index = 50, .length = 2},
  [34] = {.index = 52, .length = 2},
  [35] = {.index = 54, .length = 2},
  [36] = {.index = 56, .length = 2},
  [37] = {.index = 58, .length = 2},
  [38] = {.index = 60, .length = 3},
  [39] = {.index = 63, .length = 2},
  [40] = {.index = 65, .length = 3},
  [41] = {.index = 68, .length = 2},
  [42] = {.index = 70, .length = 3},
  [43] = {.index = 73, .length = 3},
  [44] = {.index = 76, .length = 2},
  [45] = {.index = 78, .length = 2},
  [46] = {.index = 80, .length = 2},
  [47] = {.index = 82, .length = 2},
  [48] = {.index = 84, .length = 3},
  [49] = {.index = 87, .length = 1},
  [50] = {.index = 88, .length = 2},
  [51] = {.index = 90, .length = 3},
  [52] = {.index = 93, .length = 1},
  [53] = {.index = 94, .length = 2},
  [54] = {.index = 96, .length = 1},
  [55] = {.index = 97, .length = 1},
  [56] = {.index = 98, .length = 3},
  [57] = {.index = 101, .length = 4},
  [58] = {.index = 105, .length = 3},
  [59] = {.index = 108, .length = 4},
  [60] = {.index = 112, .length = 3},
  [61] = {.index = 115, .length = 4},
  [63] = {.index = 119, .length = 1},
  [64] = {.index = 120, .length = 1},
  [65] = {.index = 121, .length = 3},
  [66] = {.index = 124, .length = 3},
  [67] = {.index = 127, .length = 3},
  [68] = {.index = 130, .length = 2},
  [69] = {.index = 132, .length = 2},
  [70] = {.index = 134, .length = 2},
  [71] = {.index = 136, .length = 2},
  [72] = {.index = 94, .length = 2},
  [73] = {.index = 138, .length = 4},
  [74] = {.index = 142, .length = 5},
  [75] = {.index = 147, .length = 3},
  [76] = {.index = 150, .length = 2},
  [77] = {.index = 152, .length = 2},
  [78] = {.index = 154, .length = 3},
};

static const TSFieldMapEntry ts_field_map_entries[] = {
  [0] =
    {field_text, 0},
  [1] =
    {field_character, 0},
    {field_text, 1},
  [3] =
    {field_body, 1},
  [4] =
    {field_atl, 1},
  [5] =
    {field_attributes, 1},
    {field_character, 0},
    {field_text, 2},
  [8] =
    {field_name, 1},
  [9] =
    {field_image, 1},
  [10] =
    {field_target, 1},
  [11] =
    {field_value, 1},
  [12] =
    {field_condition, 1},
  [13] =
    {field_transition, 1},
  [14] =
    {field_body, 2},
  [15] =
    {field_expression, 1},
  [16] =
    {field_atl, 2},
    {field_name, 1},
  [18] =
    {field_atl, 2},
    {field_image, 1},
  [20] =
    {field_channel, 1},
  [21] =
    {field_file, 1},
  [22] =
    {field_layer, 1},
  [23] =
    {field_text, 0},
    {field_transition, 2},
  [25] =
    {field_character, 0},
    {field_text, 1},
    {field_transition, 3},
  [28] =
    {field_name, 1},
    {field_parameters, 2},
  [30] =
    {field_name, 2},
  [31] =
    {field_target, 2},
  [32] =
    {field_body, 3},
    {field_priority, 1},
  [34] =
    {field_transition, 2},
  [35] =
    {field_atl, 3},
    {field_transition, 2},
  [37] =
    {field_at_expr, 2},
  [38] =
    {field_at_expr, 2},
    {field_atl, 3},
  [40] =
    {field_channel, 1},
    {field_file, 2},
  [42] =
    {field_channel, 1},
    {field_options, 2},
  [44] =
    {field_language, 1},
    {field_scope, 2},
  [46] =
    {field_attributes, 1},
    {field_character, 0},
    {field_text, 2},
    {field_transition, 4},
  [50] =
    {field_image, 1},
    {field_transition, 3},
  [52] =
    {field_from_label, 3},
    {field_target, 1},
  [54] =
    {field_arguments, 3},
    {field_name, 2},
  [56] =
    {field_iterable, 3},
    {field_variable, 1},
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
    {field_at_expr, 2},
    {field_transition, 4},
  [84] =
    {field_at_expr, 2},
    {field_atl, 5},
    {field_transition, 4},
  [87] =
    {field_displayable, 0},
  [88] =
    {field_name, 2},
    {field_transition, 5},
  [90] =
    {field_arguments, 3},
    {field_name, 2},
    {field_transition, 5},
  [93] =
    {field_label, 1},
  [94] =
    {field_property, 0},
    {field_value, 1},
  [96] =
    {field_warper, 1},
  [97] =
    {field_duration, 1},
  [98] =
    {field_at_expr, 3},
    {field_image, 1},
    {field_transition, 5},
  [101] =
    {field_at_expr, 3},
    {field_atl, 6},
    {field_image, 1},
    {field_transition, 5},
  [105] =
    {field_as_name, 5},
    {field_at_expr, 3},
    {field_image, 1},
  [108] =
    {field_as_name, 5},
    {field_at_expr, 3},
    {field_atl, 6},
    {field_image, 1},
  [112] =
    {field_as_name, 3},
    {field_image, 1},
    {field_transition, 5},
  [115] =
    {field_as_name, 3},
    {field_atl, 6},
    {field_image, 1},
    {field_transition, 5},
  [119] =
    {field_widget_tag, 0},
  [120] =
    {field_properties, 0},
  [121] =
    {field_name, 0, .inherited = true},
    {field_properties, 0},
    {field_value, 0, .inherited = true},
  [124] =
    {field_arguments, 3},
    {field_name, 2},
    {field_transition, 6},
  [127] =
    {field_condition, 1},
    {field_condition, 2},
    {field_text, 0},
  [130] =
    {field_name, 0},
    {field_value, 1},
  [132] =
    {field_properties, 1, .inherited = true},
    {field_widget_tag, 0},
  [134] =
    {field_properties, 0, .inherited = true},
    {field_properties, 1, .inherited = true},
  [136] =
    {field_properties, 1},
    {field_widget_tag, 0},
  [138] =
    {field_as_name, 5},
    {field_at_expr, 3},
    {field_image, 1},
    {field_transition, 7},
  [142] =
    {field_as_name, 5},
    {field_at_expr, 3},
    {field_atl, 8},
    {field_image, 1},
    {field_transition, 7},
  [147] =
    {field_properties, 1, .inherited = true},
    {field_properties, 2, .inherited = true},
    {field_widget_tag, 0},
  [150] =
    {field_name, 1},
    {field_parent, 3},
  [152] =
    {field_name, 1},
    {field_take_from, 3},
  [154] =
    {field_name, 1},
    {field_parent, 3},
    {field_take_from, 5},
};

static const TSSymbol ts_alias_sequences[PRODUCTION_ID_COUNT][MAX_ALIAS_SEQUENCE_LENGTH] = {
  [0] = {0},
  [62] = {
    [0] = sym_expression,
  },
  [64] = {
    [0] = sym__screen_condition,
  },
  [71] = {
    [0] = sym_identifier,
  },
  [72] = {
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
  [6] = 6,
  [7] = 5,
  [8] = 6,
  [9] = 6,
  [10] = 6,
  [11] = 6,
  [12] = 12,
  [13] = 12,
  [14] = 12,
  [15] = 12,
  [16] = 12,
  [17] = 17,
  [18] = 18,
  [19] = 17,
  [20] = 18,
  [21] = 21,
  [22] = 21,
  [23] = 23,
  [24] = 24,
  [25] = 25,
  [26] = 26,
  [27] = 23,
  [28] = 25,
  [29] = 26,
  [30] = 24,
  [31] = 31,
  [32] = 32,
  [33] = 32,
  [34] = 34,
  [35] = 34,
  [36] = 26,
  [37] = 23,
  [38] = 38,
  [39] = 38,
  [40] = 40,
  [41] = 41,
  [42] = 42,
  [43] = 43,
  [44] = 43,
  [45] = 45,
  [46] = 42,
  [47] = 31,
  [48] = 48,
  [49] = 23,
  [50] = 24,
  [51] = 25,
  [52] = 48,
  [53] = 53,
  [54] = 54,
  [55] = 40,
  [56] = 54,
  [57] = 26,
  [58] = 24,
  [59] = 25,
  [60] = 45,
  [61] = 61,
  [62] = 61,
  [63] = 53,
  [64] = 41,
  [65] = 65,
  [66] = 66,
  [67] = 67,
  [68] = 68,
  [69] = 69,
  [70] = 70,
  [71] = 71,
  [72] = 72,
  [73] = 73,
  [74] = 74,
  [75] = 75,
  [76] = 76,
  [77] = 77,
  [78] = 78,
  [79] = 79,
  [80] = 80,
  [81] = 81,
  [82] = 82,
  [83] = 83,
  [84] = 84,
  [85] = 85,
  [86] = 86,
  [87] = 87,
  [88] = 88,
  [89] = 89,
  [90] = 90,
  [91] = 91,
  [92] = 92,
  [93] = 65,
  [94] = 94,
  [95] = 95,
  [96] = 96,
  [97] = 97,
  [98] = 98,
  [99] = 99,
  [100] = 100,
  [101] = 101,
  [102] = 102,
  [103] = 103,
  [104] = 104,
  [105] = 105,
  [106] = 106,
  [107] = 107,
  [108] = 108,
  [109] = 109,
  [110] = 110,
  [111] = 111,
  [112] = 112,
  [113] = 113,
  [114] = 114,
  [115] = 115,
  [116] = 116,
  [117] = 117,
  [118] = 118,
  [119] = 119,
  [120] = 120,
  [121] = 121,
  [122] = 122,
  [123] = 32,
  [124] = 124,
  [125] = 125,
  [126] = 126,
  [127] = 127,
  [128] = 128,
  [129] = 129,
  [130] = 130,
  [131] = 131,
  [132] = 132,
  [133] = 133,
  [134] = 134,
  [135] = 135,
  [136] = 136,
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
  [163] = 70,
  [164] = 95,
  [165] = 103,
  [166] = 130,
  [167] = 160,
  [168] = 168,
  [169] = 169,
  [170] = 170,
  [171] = 171,
  [172] = 168,
  [173] = 173,
  [174] = 169,
  [175] = 175,
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
  [190] = 170,
  [191] = 191,
  [192] = 81,
  [193] = 66,
  [194] = 67,
  [195] = 68,
  [196] = 69,
  [197] = 171,
  [198] = 71,
  [199] = 72,
  [200] = 73,
  [201] = 74,
  [202] = 75,
  [203] = 76,
  [204] = 77,
  [205] = 78,
  [206] = 79,
  [207] = 80,
  [208] = 208,
  [209] = 82,
  [210] = 83,
  [211] = 84,
  [212] = 85,
  [213] = 173,
  [214] = 161,
  [215] = 86,
  [216] = 87,
  [217] = 88,
  [218] = 89,
  [219] = 90,
  [220] = 91,
  [221] = 92,
  [222] = 94,
  [223] = 96,
  [224] = 97,
  [225] = 98,
  [226] = 99,
  [227] = 100,
  [228] = 101,
  [229] = 102,
  [230] = 175,
  [231] = 104,
  [232] = 105,
  [233] = 106,
  [234] = 107,
  [235] = 108,
  [236] = 109,
  [237] = 110,
  [238] = 111,
  [239] = 112,
  [240] = 113,
  [241] = 114,
  [242] = 115,
  [243] = 116,
  [244] = 117,
  [245] = 118,
  [246] = 119,
  [247] = 120,
  [248] = 121,
  [249] = 122,
  [250] = 176,
  [251] = 124,
  [252] = 125,
  [253] = 126,
  [254] = 127,
  [255] = 128,
  [256] = 129,
  [257] = 177,
  [258] = 131,
  [259] = 132,
  [260] = 133,
  [261] = 134,
  [262] = 135,
  [263] = 136,
  [264] = 137,
  [265] = 138,
  [266] = 139,
  [267] = 140,
  [268] = 141,
  [269] = 142,
  [270] = 143,
  [271] = 144,
  [272] = 145,
  [273] = 146,
  [274] = 147,
  [275] = 148,
  [276] = 149,
  [277] = 150,
  [278] = 151,
  [279] = 152,
  [280] = 153,
  [281] = 154,
  [282] = 155,
  [283] = 156,
  [284] = 157,
  [285] = 158,
  [286] = 159,
  [287] = 178,
  [288] = 179,
  [289] = 162,
  [290] = 180,
  [291] = 32,
  [292] = 181,
  [293] = 182,
  [294] = 183,
  [295] = 184,
  [296] = 185,
  [297] = 186,
  [298] = 187,
  [299] = 188,
  [300] = 189,
  [301] = 191,
  [302] = 208,
  [303] = 303,
  [304] = 304,
  [305] = 304,
  [306] = 306,
  [307] = 307,
  [308] = 308,
  [309] = 307,
  [310] = 161,
  [311] = 311,
  [312] = 312,
  [313] = 313,
  [314] = 314,
  [315] = 315,
  [316] = 316,
  [317] = 317,
  [318] = 316,
  [319] = 319,
  [320] = 317,
  [321] = 321,
  [322] = 322,
  [323] = 323,
  [324] = 324,
  [325] = 325,
  [326] = 326,
  [327] = 327,
  [328] = 327,
  [329] = 329,
  [330] = 323,
  [331] = 321,
  [332] = 324,
  [333] = 333,
  [334] = 334,
  [335] = 335,
  [336] = 336,
  [337] = 337,
  [338] = 335,
  [339] = 336,
  [340] = 333,
  [341] = 337,
  [342] = 342,
  [343] = 342,
  [344] = 344,
  [345] = 345,
  [346] = 344,
  [347] = 347,
  [348] = 348,
  [349] = 349,
  [350] = 350,
  [351] = 351,
  [352] = 352,
  [353] = 350,
  [354] = 354,
  [355] = 25,
  [356] = 24,
  [357] = 357,
  [358] = 358,
  [359] = 359,
  [360] = 360,
  [361] = 354,
  [362] = 360,
  [363] = 363,
  [364] = 358,
  [365] = 365,
  [366] = 26,
  [367] = 23,
  [368] = 368,
  [369] = 369,
  [370] = 370,
  [371] = 371,
  [372] = 358,
  [373] = 373,
  [374] = 374,
  [375] = 375,
  [376] = 376,
  [377] = 377,
  [378] = 32,
  [379] = 379,
  [380] = 380,
  [381] = 376,
  [382] = 379,
  [383] = 368,
  [384] = 384,
  [385] = 375,
  [386] = 377,
  [387] = 387,
  [388] = 388,
  [389] = 373,
  [390] = 387,
  [391] = 388,
  [392] = 374,
  [393] = 380,
  [394] = 371,
  [395] = 395,
  [396] = 396,
  [397] = 397,
  [398] = 398,
  [399] = 399,
  [400] = 400,
  [401] = 401,
  [402] = 401,
  [403] = 403,
  [404] = 404,
  [405] = 405,
  [406] = 406,
  [407] = 407,
  [408] = 407,
  [409] = 409,
  [410] = 410,
  [411] = 411,
  [412] = 412,
  [413] = 413,
  [414] = 414,
  [415] = 399,
  [416] = 405,
  [417] = 417,
  [418] = 400,
  [419] = 419,
  [420] = 420,
  [421] = 404,
  [422] = 422,
  [423] = 423,
  [424] = 424,
  [425] = 425,
  [426] = 426,
  [427] = 419,
  [428] = 428,
  [429] = 423,
  [430] = 411,
  [431] = 422,
  [432] = 425,
  [433] = 426,
  [434] = 409,
  [435] = 417,
  [436] = 420,
  [437] = 403,
  [438] = 438,
  [439] = 439,
  [440] = 440,
  [441] = 441,
  [442] = 442,
  [443] = 443,
  [444] = 444,
  [445] = 445,
  [446] = 446,
  [447] = 447,
  [448] = 448,
  [449] = 449,
  [450] = 450,
  [451] = 440,
  [452] = 452,
  [453] = 443,
  [454] = 454,
  [455] = 455,
  [456] = 446,
  [457] = 455,
  [458] = 458,
  [459] = 458,
  [460] = 442,
  [461] = 461,
  [462] = 447,
  [463] = 448,
  [464] = 449,
  [465] = 454,
  [466] = 444,
  [467] = 445,
  [468] = 441,
  [469] = 469,
  [470] = 439,
  [471] = 461,
  [472] = 469,
  [473] = 473,
  [474] = 424,
  [475] = 428,
  [476] = 476,
  [477] = 477,
  [478] = 478,
  [479] = 479,
  [480] = 480,
  [481] = 481,
  [482] = 482,
  [483] = 483,
  [484] = 484,
  [485] = 476,
  [486] = 484,
  [487] = 487,
  [488] = 488,
  [489] = 489,
  [490] = 490,
  [491] = 491,
  [492] = 492,
  [493] = 493,
  [494] = 494,
  [495] = 495,
  [496] = 478,
  [497] = 481,
  [498] = 473,
  [499] = 499,
  [500] = 490,
  [501] = 492,
  [502] = 502,
  [503] = 489,
  [504] = 504,
  [505] = 505,
  [506] = 506,
  [507] = 507,
  [508] = 495,
  [509] = 509,
  [510] = 510,
  [511] = 511,
  [512] = 487,
  [513] = 513,
  [514] = 499,
  [515] = 493,
  [516] = 482,
  [517] = 502,
  [518] = 494,
  [519] = 477,
  [520] = 488,
  [521] = 521,
  [522] = 505,
  [523] = 479,
  [524] = 504,
  [525] = 506,
  [526] = 513,
  [527] = 521,
  [528] = 528,
  [529] = 511,
  [530] = 510,
  [531] = 528,
  [532] = 532,
  [533] = 483,
  [534] = 534,
  [535] = 535,
  [536] = 536,
  [537] = 537,
  [538] = 538,
  [539] = 539,
  [540] = 540,
  [541] = 541,
  [542] = 542,
  [543] = 543,
  [544] = 544,
  [545] = 545,
  [546] = 546,
  [547] = 539,
  [548] = 548,
  [549] = 549,
  [550] = 544,
  [551] = 548,
  [552] = 552,
  [553] = 549,
  [554] = 542,
  [555] = 555,
  [556] = 540,
  [557] = 557,
  [558] = 31,
  [559] = 559,
  [560] = 536,
  [561] = 538,
  [562] = 537,
  [563] = 563,
  [564] = 557,
  [565] = 559,
  [566] = 545,
  [567] = 546,
  [568] = 534,
  [569] = 555,
  [570] = 541,
  [571] = 571,
  [572] = 572,
  [573] = 572,
  [574] = 574,
  [575] = 575,
  [576] = 552,
  [577] = 575,
  [578] = 543,
  [579] = 535,
  [580] = 580,
  [581] = 581,
  [582] = 582,
  [583] = 583,
  [584] = 580,
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
  [595] = 595,
  [596] = 596,
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
  [613] = 613,
  [614] = 614,
  [615] = 615,
  [616] = 605,
  [617] = 617,
  [618] = 618,
  [619] = 619,
  [620] = 620,
  [621] = 621,
  [622] = 622,
  [623] = 623,
  [624] = 624,
  [625] = 625,
  [626] = 626,
  [627] = 600,
  [628] = 601,
  [629] = 629,
  [630] = 630,
  [631] = 631,
  [632] = 632,
  [633] = 633,
  [634] = 634,
  [635] = 635,
  [636] = 636,
  [637] = 637,
  [638] = 620,
  [639] = 639,
  [640] = 609,
  [641] = 641,
  [642] = 612,
  [643] = 643,
  [644] = 644,
  [645] = 645,
  [646] = 639,
  [647] = 647,
  [648] = 648,
  [649] = 649,
  [650] = 650,
  [651] = 651,
  [652] = 652,
  [653] = 653,
  [654] = 654,
  [655] = 595,
  [656] = 598,
  [657] = 599,
  [658] = 658,
  [659] = 637,
  [660] = 660,
  [661] = 661,
  [662] = 662,
  [663] = 663,
  [664] = 664,
  [665] = 665,
  [666] = 666,
  [667] = 667,
  [668] = 668,
  [669] = 669,
  [670] = 670,
  [671] = 671,
  [672] = 672,
  [673] = 673,
  [674] = 674,
  [675] = 675,
  [676] = 621,
  [677] = 629,
  [678] = 678,
  [679] = 614,
  [680] = 615,
  [681] = 632,
  [682] = 682,
  [683] = 663,
  [684] = 664,
  [685] = 685,
  [686] = 648,
  [687] = 687,
  [688] = 688,
  [689] = 689,
  [690] = 633,
  [691] = 691,
  [692] = 692,
  [693] = 665,
  [694] = 694,
  [695] = 695,
  [696] = 666,
  [697] = 607,
  [698] = 602,
  [699] = 699,
  [700] = 618,
  [701] = 622,
  [702] = 702,
  [703] = 703,
  [704] = 704,
  [705] = 705,
  [706] = 706,
  [707] = 631,
  [708] = 708,
  [709] = 691,
  [710] = 710,
  [711] = 667,
  [712] = 712,
  [713] = 590,
  [714] = 714,
  [715] = 636,
  [716] = 716,
  [717] = 717,
  [718] = 678,
  [719] = 623,
  [720] = 716,
  [721] = 721,
  [722] = 722,
  [723] = 608,
  [724] = 649,
  [725] = 668,
  [726] = 581,
  [727] = 727,
  [728] = 685,
  [729] = 727,
  [730] = 730,
  [731] = 594,
  [732] = 603,
  [733] = 610,
  [734] = 611,
  [735] = 613,
  [736] = 682,
  [737] = 737,
  [738] = 738,
  [739] = 721,
  [740] = 740,
  [741] = 741,
  [742] = 586,
  [743] = 604,
  [744] = 634,
  [745] = 643,
  [746] = 587,
  [747] = 626,
  [748] = 748,
  [749] = 617,
  [750] = 641,
  [751] = 658,
  [752] = 688,
  [753] = 699,
  [754] = 754,
  [755] = 755,
  [756] = 650,
  [757] = 706,
  [758] = 619,
  [759] = 674,
  [760] = 669,
  [761] = 761,
  [762] = 762,
  [763] = 763,
  [764] = 670,
  [765] = 671,
  [766] = 710,
  [767] = 738,
  [768] = 741,
  [769] = 708,
  [770] = 714,
  [771] = 702,
  [772] = 703,
  [773] = 585,
  [774] = 692,
  [775] = 583,
  [776] = 704,
  [777] = 737,
  [778] = 689,
  [779] = 694,
  [780] = 673,
  [781] = 651,
  [782] = 730,
  [783] = 606,
  [784] = 763,
  [785] = 644,
  [786] = 672,
  [787] = 687,
  [788] = 589,
  [789] = 592,
  [790] = 593,
  [791] = 754,
  [792] = 602,
  [793] = 652,
  [794] = 761,
  [795] = 722,
  [796] = 796,
  [797] = 712,
  [798] = 591,
  [799] = 740,
  [800] = 660,
  [801] = 662,
  [802] = 588,
  [803] = 705,
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
        '"', 37,
        '\'', 369,
        '*', 792,
        ',', 181,
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
        '(', 174,
        '[', 174,
        '{', 174,
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
        '"', 39,
        '\'', 370,
        '*', 838,
        ',', 181,
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
        '(', 186,
        '[', 186,
        '{', 186,
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
        ',', 199,
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
        '(', 206,
        '[', 206,
        '{', 206,
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
        ',', 199,
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
        '(', 201,
        '[', 201,
        '{', 201,
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
        '(', 176,
        '[', 176,
        '{', 176,
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
        ',', 181,
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
        ',', 199,
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
        ',', 181,
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
        ',', 199,
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
      if (lookahead == '"') ADVANCE(166);
      if (lookahead == '\\') ADVANCE(641);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(36);
      END_STATE();
    case 37:
      if (lookahead == '"') ADVANCE(801);
      if (lookahead == '\\') ADVANCE(569);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(37);
      END_STATE();
    case 38:
      if (lookahead == '"') ADVANCE(705);
      if (lookahead == '\\') ADVANCE(623);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(331);
      END_STATE();
    case 39:
      if (lookahead == '"') ADVANCE(850);
      if (lookahead == '\\') ADVANCE(577);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(39);
      END_STATE();
    case 40:
      if (lookahead == '"') ADVANCE(820);
      if (lookahead == '\\') ADVANCE(575);
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
      if (lookahead == '[') ADVANCE(166);
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
      if (lookahead == '[') ADVANCE(166);
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
      if (lookahead == '\\') ADVANCE(595);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(250);
      END_STATE();
    case 57:
      if (lookahead == '"') ADVANCE(835);
      if (lookahead == '\'') ADVANCE(686);
      if (lookahead == '\\') ADVANCE(571);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(59);
      END_STATE();
    case 58:
      if (lookahead == '"') ADVANCE(835);
      if (lookahead == '\'') ADVANCE(57);
      if (lookahead == '\\') ADVANCE(571);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(59);
      END_STATE();
    case 59:
      if (lookahead == '"') ADVANCE(835);
      if (lookahead == '\'') ADVANCE(58);
      if (lookahead == '\\') ADVANCE(571);
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
      if (lookahead == '\\') ADVANCE(575);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(40);
      END_STATE();
    case 67:
      if (lookahead == '"') ADVANCE(821);
      if (lookahead == '\\') ADVANCE(595);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(250);
      END_STATE();
    case 68:
      if (lookahead == '"') ADVANCE(174);
      if (lookahead == '\\') ADVANCE(572);
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
      if (lookahead == '\\') ADVANCE(598);
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
      if (lookahead == '"') ADVANCE(182);
      if (lookahead == '\\') ADVANCE(580);
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
      if (lookahead == '\\') ADVANCE(601);
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
      if (lookahead == '"') ADVANCE(186);
      if (lookahead == '\\') ADVANCE(583);
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
      if (lookahead == '\\') ADVANCE(604);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(312);
      END_STATE();
    case 94:
      if (lookahead == '"') ADVANCE(187);
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
        '\\', 211,
        '(', 212,
        '[', 212,
        '{', 212,
        ')', 815,
        ']', 815,
        '}', 815,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(201);
      END_STATE();
    case 97:
      if (lookahead == '"') ADVANCE(710);
      if (lookahead == '\\') ADVANCE(607);
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
      if (lookahead == '"') ADVANCE(193);
      if (lookahead == '\\') ADVANCE(588);
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
      if (lookahead == '\'') ADVANCE(201);
      if (lookahead == '\\') ADVANCE(568);
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
      if (lookahead == '"') ADVANCE(205);
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
      if (lookahead == '\'') ADVANCE(206);
      if (lookahead == '\\') ADVANCE(579);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(322);
      END_STATE();
    case 114:
      ADVANCE_MAP(
        '"', 697,
        '#', 306,
        '\'', 322,
        '\\', 217,
        '(', 219,
        '[', 219,
        '{', 219,
        ')', 863,
        ']', 863,
        '}', 863,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(206);
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
      if (lookahead == '\'') ADVANCE(212);
      if (lookahead == '\\') ADVANCE(582);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(323);
      END_STATE();
    case 119:
      ADVANCE_MAP(
        '"', 695,
        '#', 306,
        '\'', 323,
        '\\', 220,
        '(', 222,
        '[', 222,
        '{', 222,
        ')', 201,
        ']', 201,
        '}', 201,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(212);
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
      if (lookahead == '\'') ADVANCE(219);
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
        '\\', 227,
        '(', 228,
        '[', 228,
        '{', 228,
        ')', 206,
        ']', 206,
        '}', 206,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(219);
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
      if (lookahead == '\'') ADVANCE(222);
      if (lookahead == '\\') ADVANCE(594);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(325);
      END_STATE();
    case 132:
      ADVANCE_MAP(
        '"', 698,
        '#', 306,
        '\'', 325,
        '\\', 232,
        '(', 313,
        '[', 313,
        '{', 313,
        ')', 212,
        ']', 212,
        '}', 212,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(222);
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
      if (lookahead == '\'') ADVANCE(228);
      if (lookahead == '\\') ADVANCE(603);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(326);
      END_STATE();
    case 136:
      ADVANCE_MAP(
        '"', 701,
        '#', 306,
        '\'', 326,
        '\\', 234,
        '(', 344,
        '[', 344,
        '{', 344,
        ')', 219,
        ']', 219,
        '}', 219,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(228);
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
      if (lookahead == '"') ADVANCE(176);
      if (lookahead == '\'') ADVANCE(693);
      if (lookahead == '\\') ADVANCE(574);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(140);
      END_STATE();
    case 139:
      if (lookahead == '"') ADVANCE(176);
      if (lookahead == '\'') ADVANCE(138);
      if (lookahead == '\\') ADVANCE(574);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(140);
      END_STATE();
    case 140:
      if (lookahead == '"') ADVANCE(176);
      if (lookahead == '\'') ADVANCE(139);
      if (lookahead == '\\') ADVANCE(574);
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
      if (lookahead == '\\') ADVANCE(587);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(151);
      END_STATE();
    case 150:
      if (lookahead == '"') ADVANCE(189);
      if (lookahead == '\'') ADVANCE(149);
      if (lookahead == '\\') ADVANCE(587);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(151);
      END_STATE();
    case 151:
      if (lookahead == '"') ADVANCE(189);
      if (lookahead == '\'') ADVANCE(150);
      if (lookahead == '\\') ADVANCE(587);
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
      if (lookahead == '\\') ADVANCE(598);
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
        '(', 176,
        '[', 176,
        '{', 176,
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
      if (lookahead == '\\') ADVANCE(597);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(165);
      END_STATE();
    case 164:
      if (lookahead == '"') ADVANCE(208);
      if (lookahead == '\'') ADVANCE(163);
      if (lookahead == '\\') ADVANCE(597);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(165);
      END_STATE();
    case 165:
      if (lookahead == '"') ADVANCE(208);
      if (lookahead == '\'') ADVANCE(164);
      if (lookahead == '\\') ADVANCE(597);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(165);
      END_STATE();
    case 166:
      if (lookahead == '"') ADVANCE(36);
      if (lookahead == '\'') ADVANCE(368);
      if (lookahead == ']') ADVANCE(680);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(166);
      END_STATE();
    case 167:
      if (lookahead == '"') ADVANCE(38);
      if (lookahead == '\'') ADVANCE(411);
      if (lookahead == ':') ADVANCE(667);
      if (lookahead == 'n') ADVANCE(650);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(167);
      if (lookahead == '(' ||
          lookahead == '[' ||
          lookahead == '{') ADVANCE(174);
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
    case 168:
      if (lookahead == '"') ADVANCE(214);
      if (lookahead == '\'') ADVANCE(698);
      if (lookahead == '\\') ADVANCE(600);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(170);
      END_STATE();
    case 169:
      if (lookahead == '"') ADVANCE(214);
      if (lookahead == '\'') ADVANCE(168);
      if (lookahead == '\\') ADVANCE(600);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(170);
      END_STATE();
    case 170:
      if (lookahead == '"') ADVANCE(214);
      if (lookahead == '\'') ADVANCE(169);
      if (lookahead == '\\') ADVANCE(600);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(170);
      END_STATE();
    case 171:
      ADVANCE_MAP(
        '"', 37,
        '\'', 369,
        'n', 798,
        '\t', 171,
        ' ', 171,
        '(', 174,
        '[', 174,
        '{', 174,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
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
      if (lookahead == '\\') ADVANCE(601);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(311);
      END_STATE();
    case 174:
      ADVANCE_MAP(
        '"', 68,
        '\'', 379,
        '(', 182,
        '[', 182,
        '{', 182,
        ')', 801,
        ']', 801,
        '}', 801,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(174);
      END_STATE();
    case 175:
      ADVANCE_MAP(
        '"', 140,
        '#', 462,
        '\'', 723,
        '\\', 177,
        '(', 195,
        '[', 195,
        '{', 195,
        ')', 787,
        ']', 787,
        '}', 787,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(176);
      END_STATE();
    case 176:
      ADVANCE_MAP(
        '"', 140,
        '#', 462,
        '\'', 402,
        '\\', 177,
        '(', 195,
        '[', 195,
        '{', 195,
        ')', 787,
        ']', 787,
        '}', 787,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(176);
      END_STATE();
    case 177:
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
          lookahead != '\r') ADVANCE(176);
      END_STATE();
    case 178:
      ADVANCE_MAP(
        '"', 140,
        '#', 462,
        '\'', 381,
        '\\', 177,
        '(', 195,
        '[', 195,
        '{', 195,
        ')', 787,
        ']', 787,
        '}', 787,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(176);
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
      if (lookahead == '\\') ADVANCE(604);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(312);
      END_STATE();
    case 181:
      ADVANCE_MAP(
        '"', 39,
        '\'', 370,
        'n', 844,
        '\t', 181,
        ' ', 181,
        '(', 186,
        '[', 186,
        '{', 186,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 182:
      ADVANCE_MAP(
        '"', 83,
        '\'', 384,
        '(', 187,
        '[', 187,
        '{', 187,
        ')', 174,
        ']', 174,
        '}', 174,
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
      if (lookahead == '\\') ADVANCE(606);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(185);
      END_STATE();
    case 184:
      if (lookahead == '"') ADVANCE(224);
      if (lookahead == '\'') ADVANCE(183);
      if (lookahead == '\\') ADVANCE(606);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(185);
      END_STATE();
    case 185:
      if (lookahead == '"') ADVANCE(224);
      if (lookahead == '\'') ADVANCE(184);
      if (lookahead == '\\') ADVANCE(606);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(185);
      END_STATE();
    case 186:
      ADVANCE_MAP(
        '"', 91,
        '\'', 386,
        '(', 193,
        '[', 193,
        '{', 193,
        ')', 850,
        ']', 850,
        '}', 850,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(186);
      END_STATE();
    case 187:
      ADVANCE_MAP(
        '"', 94,
        '\'', 389,
        '(', 307,
        '[', 307,
        '{', 307,
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
      if (lookahead == '\\') ADVANCE(607);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(315);
      END_STATE();
    case 193:
      ADVANCE_MAP(
        '"', 99,
        '\'', 392,
        '(', 205,
        '[', 205,
        '{', 205,
        ')', 186,
        ']', 186,
        '}', 186,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(193);
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
        ')', 176,
        ']', 176,
        '}', 176,
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
        ')', 176,
        ']', 176,
        '}', 176,
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
        ')', 176,
        ']', 176,
        '}', 176,
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
        ')', 176,
        ']', 176,
        '}', 176,
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
        '"', 67,
        '\'', 319,
        '\\', 864,
        'n', 857,
        '\t', 199,
        ' ', 199,
        '(', 206,
        '[', 206,
        '{', 206,
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
        '"', 159,
        '#', 306,
        '\'', 320,
        '\\', 211,
        '(', 212,
        '[', 212,
        '{', 212,
        ')', 815,
        ']', 815,
        '}', 815,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(201);
      END_STATE();
    case 202:
      ADVANCE_MAP(
        '"', 66,
        '\'', 316,
        '\\', 805,
        'n', 812,
        '\t', 202,
        ' ', 202,
        '(', 201,
        '[', 201,
        '{', 201,
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
    case 203:
      if (lookahead == '"') ADVANCE(107);
      if (lookahead == '\'') ADVANCE(201);
      if (lookahead == '\\') ADVANCE(568);
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
        '"', 110,
        '\'', 394,
        '(', 339,
        '[', 339,
        '{', 339,
        ')', 193,
        ']', 193,
        '}', 193,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(205);
      END_STATE();
    case 206:
      ADVANCE_MAP(
        '"', 173,
        '#', 306,
        '\'', 322,
        '\\', 217,
        '(', 219,
        '[', 219,
        '{', 219,
        ')', 863,
        ']', 863,
        '}', 863,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(206);
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
        '"', 309,
        '#', 306,
        '\'', 320,
        '(', 212,
        '[', 212,
        '{', 212,
        ')', 815,
        ']', 815,
        '}', 815,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(201);
      END_STATE();
    case 212:
      ADVANCE_MAP(
        '"', 180,
        '#', 306,
        '\'', 323,
        '\\', 220,
        '(', 222,
        '[', 222,
        '{', 222,
        ')', 201,
        ']', 201,
        '}', 201,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(212);
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
        '"', 311,
        '#', 306,
        '\'', 322,
        '(', 219,
        '[', 219,
        '{', 219,
        ')', 863,
        ']', 863,
        '}', 863,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(206);
      END_STATE();
    case 218:
      if (lookahead == '"') ADVANCE(113);
      if (lookahead == '\'') ADVANCE(206);
      if (lookahead == '\\') ADVANCE(579);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(322);
      END_STATE();
    case 219:
      ADVANCE_MAP(
        '"', 192,
        '#', 306,
        '\'', 324,
        '\\', 227,
        '(', 228,
        '[', 228,
        '{', 228,
        ')', 206,
        ']', 206,
        '}', 206,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(219);
      END_STATE();
    case 220:
      ADVANCE_MAP(
        '"', 312,
        '#', 306,
        '\'', 323,
        '(', 222,
        '[', 222,
        '{', 222,
        ')', 201,
        ']', 201,
        '}', 201,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(212);
      END_STATE();
    case 221:
      if (lookahead == '"') ADVANCE(118);
      if (lookahead == '\'') ADVANCE(212);
      if (lookahead == '\\') ADVANCE(582);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(323);
      END_STATE();
    case 222:
      ADVANCE_MAP(
        '"', 198,
        '#', 306,
        '\'', 325,
        '\\', 232,
        '(', 313,
        '[', 313,
        '{', 313,
        ')', 212,
        ']', 212,
        '}', 212,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(222);
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
        '"', 315,
        '#', 306,
        '\'', 324,
        '(', 228,
        '[', 228,
        '{', 228,
        ')', 206,
        ']', 206,
        '}', 206,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(219);
      END_STATE();
    case 228:
      ADVANCE_MAP(
        '"', 204,
        '#', 306,
        '\'', 326,
        '\\', 234,
        '(', 344,
        '[', 344,
        '{', 344,
        ')', 219,
        ']', 219,
        '}', 219,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(228);
      END_STATE();
    case 229:
      if (lookahead == '"') ADVANCE(123);
      if (lookahead == '\'') ADVANCE(219);
      if (lookahead == '\\') ADVANCE(591);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(324);
      END_STATE();
    case 230:
      ADVANCE_MAP(
        '"', 81,
        '#', 306,
        '\'', 320,
        '\\', 211,
        '(', 212,
        '[', 212,
        '{', 212,
        ')', 815,
        ']', 815,
        '}', 815,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(201);
      END_STATE();
    case 231:
      if (lookahead == '"') ADVANCE(131);
      if (lookahead == '\'') ADVANCE(222);
      if (lookahead == '\\') ADVANCE(594);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(325);
      END_STATE();
    case 232:
      ADVANCE_MAP(
        '"', 317,
        '#', 306,
        '\'', 325,
        '(', 313,
        '[', 313,
        '{', 313,
        ')', 212,
        ']', 212,
        '}', 212,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(222);
      END_STATE();
    case 233:
      ADVANCE_MAP(
        '"', 89,
        '#', 306,
        '\'', 322,
        '\\', 217,
        '(', 219,
        '[', 219,
        '{', 219,
        ')', 863,
        ']', 863,
        '}', 863,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(206);
      END_STATE();
    case 234:
      ADVANCE_MAP(
        '"', 321,
        '#', 306,
        '\'', 326,
        '(', 344,
        '[', 344,
        '{', 344,
        ')', 219,
        ']', 219,
        '}', 219,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(228);
      END_STATE();
    case 235:
      if (lookahead == '"') ADVANCE(135);
      if (lookahead == '\'') ADVANCE(228);
      if (lookahead == '\\') ADVANCE(603);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(326);
      END_STATE();
    case 236:
      ADVANCE_MAP(
        '"', 93,
        '#', 306,
        '\'', 323,
        '\\', 220,
        '(', 222,
        '[', 222,
        '{', 222,
        ')', 201,
        ']', 201,
        '}', 201,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(212);
      END_STATE();
    case 237:
      ADVANCE_MAP(
        '"', 97,
        '#', 306,
        '\'', 324,
        '\\', 227,
        '(', 228,
        '[', 228,
        '{', 228,
        ')', 206,
        ']', 206,
        '}', 206,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(219);
      END_STATE();
    case 238:
      ADVANCE_MAP(
        '"', 108,
        '#', 306,
        '\'', 325,
        '\\', 232,
        '(', 313,
        '[', 313,
        '{', 313,
        ')', 212,
        ']', 212,
        '}', 212,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(222);
      END_STATE();
    case 239:
      ADVANCE_MAP(
        '"', 115,
        '#', 306,
        '\'', 326,
        '\\', 234,
        '(', 344,
        '[', 344,
        '{', 344,
        ')', 219,
        ']', 219,
        '}', 219,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(228);
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
      if (lookahead == '\\') ADVANCE(595);
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
        ')', 222,
        ']', 222,
        '}', 222,
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
          lookahead == ' ') ADVANCE(202);
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
          lookahead == ' ') ADVANCE(199);
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
          lookahead == ' ') ADVANCE(202);
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
          lookahead == ' ') ADVANCE(199);
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
          lookahead == ' ') ADVANCE(199);
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
          lookahead == ' ') ADVANCE(199);
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
          lookahead == ' ') ADVANCE(199);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(306);
      END_STATE();
    case 301:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead == '\\') ADVANCE(548);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(202);
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
          lookahead == ' ') ADVANCE(202);
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
          lookahead == ' ') ADVANCE(202);
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
          lookahead == '}') ADVANCE(187);
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
      if (lookahead == '"') ADVANCE(230);
      if (lookahead == '\\') ADVANCE(598);
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
      if (lookahead == '"') ADVANCE(233);
      if (lookahead == '\\') ADVANCE(601);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(311);
      END_STATE();
    case 312:
      if (lookahead == '"') ADVANCE(236);
      if (lookahead == '\\') ADVANCE(604);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(312);
      END_STATE();
    case 313:
      ADVANCE_MAP(
        '"', 256,
        '\'', 357,
        '\\', 360,
        ')', 222,
        ']', 222,
        '}', 222,
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
      if (lookahead == '"') ADVANCE(237);
      if (lookahead == '\\') ADVANCE(607);
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
      if (lookahead == '"') ADVANCE(238);
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
        ')', 222,
        ']', 222,
        '}', 222,
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
      if (lookahead == '\'') ADVANCE(201);
      if (lookahead == '\\') ADVANCE(568);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(320);
      END_STATE();
    case 321:
      if (lookahead == '"') ADVANCE(239);
      if (lookahead == '\\') ADVANCE(611);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(321);
      END_STATE();
    case 322:
      if (lookahead == '"') ADVANCE(218);
      if (lookahead == '\'') ADVANCE(206);
      if (lookahead == '\\') ADVANCE(579);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(322);
      END_STATE();
    case 323:
      if (lookahead == '"') ADVANCE(221);
      if (lookahead == '\'') ADVANCE(212);
      if (lookahead == '\\') ADVANCE(582);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(323);
      END_STATE();
    case 324:
      if (lookahead == '"') ADVANCE(229);
      if (lookahead == '\'') ADVANCE(219);
      if (lookahead == '\\') ADVANCE(591);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(324);
      END_STATE();
    case 325:
      if (lookahead == '"') ADVANCE(231);
      if (lookahead == '\'') ADVANCE(222);
      if (lookahead == '\\') ADVANCE(594);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(325);
      END_STATE();
    case 326:
      if (lookahead == '"') ADVANCE(235);
      if (lookahead == '\'') ADVANCE(228);
      if (lookahead == '\\') ADVANCE(603);
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
      if (lookahead == '\\') ADVANCE(575);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(40);
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
        ')', 228,
        ']', 228,
        '}', 228,
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
          lookahead == '}') ADVANCE(205);
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
        ')', 228,
        ']', 228,
        '}', 228,
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
        ')', 228,
        ']', 228,
        '}', 228,
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
        ')', 222,
        ']', 222,
        '}', 222,
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
        ')', 228,
        ']', 228,
        '}', 228,
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
      if (lookahead == '\'') ADVANCE(166);
      if (lookahead == '\\') ADVANCE(642);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(368);
      END_STATE();
    case 369:
      if (lookahead == '\'') ADVANCE(801);
      if (lookahead == '\\') ADVANCE(570);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(369);
      END_STATE();
    case 370:
      if (lookahead == '\'') ADVANCE(850);
      if (lookahead == '\\') ADVANCE(578);
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
      if (lookahead == '\\') ADVANCE(596);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(414);
      END_STATE();
    case 376:
      if (lookahead == '\'') ADVANCE(791);
      if (lookahead == '\\') ADVANCE(576);
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
      if (lookahead == '\'') ADVANCE(174);
      if (lookahead == '\\') ADVANCE(573);
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
      if (lookahead == '\\') ADVANCE(599);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(464);
      END_STATE();
    case 382:
      if (lookahead == '\'') ADVANCE(776);
      if (lookahead == '\\') ADVANCE(576);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(376);
      END_STATE();
    case 383:
      if (lookahead == '\'') ADVANCE(822);
      if (lookahead == '\\') ADVANCE(596);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(414);
      END_STATE();
    case 384:
      if (lookahead == '\'') ADVANCE(182);
      if (lookahead == '\\') ADVANCE(581);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(384);
      END_STATE();
    case 385:
      if (lookahead == '\'') ADVANCE(708);
      if (lookahead == '\\') ADVANCE(602);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(465);
      END_STATE();
    case 386:
      if (lookahead == '\'') ADVANCE(186);
      if (lookahead == '\\') ADVANCE(584);
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
      if (lookahead == '\\') ADVANCE(605);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(466);
      END_STATE();
    case 389:
      if (lookahead == '\'') ADVANCE(187);
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
      if (lookahead == '\\') ADVANCE(608);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(467);
      END_STATE();
    case 392:
      if (lookahead == '\'') ADVANCE(193);
      if (lookahead == '\\') ADVANCE(589);
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
      if (lookahead == '\'') ADVANCE(205);
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
      if (lookahead == '\'') ADVANCE(175);
      if (lookahead == '\\') ADVANCE(599);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(464);
      END_STATE();
    case 403:
      if (lookahead == '\'') ADVANCE(188);
      if (lookahead == '\\') ADVANCE(602);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(465);
      END_STATE();
    case 404:
      if (lookahead == '\'') ADVANCE(194);
      if (lookahead == '\\') ADVANCE(605);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(466);
      END_STATE();
    case 405:
      if (lookahead == '\'') ADVANCE(207);
      if (lookahead == '\\') ADVANCE(608);
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
      if (lookahead == '\\') ADVANCE(596);
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
      if (lookahead == '\'') ADVANCE(178);
      if (lookahead == '\\') ADVANCE(599);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(464);
      END_STATE();
    case 465:
      if (lookahead == '\'') ADVANCE(191);
      if (lookahead == '\\') ADVANCE(602);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(465);
      END_STATE();
    case 466:
      if (lookahead == '\'') ADVANCE(197);
      if (lookahead == '\\') ADVANCE(605);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(466);
      END_STATE();
    case 467:
      if (lookahead == '\'') ADVANCE(210);
      if (lookahead == '\\') ADVANCE(608);
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
      if (lookahead == '\\') ADVANCE(576);
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
          lookahead == ' ') ADVANCE(171);
      END_STATE();
    case 482:
      if (lookahead == '*') ADVANCE(520);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(181);
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
          lookahead == ' ') ADVANCE(171);
      END_STATE();
    case 487:
      if (lookahead == '/') ADVANCE(520);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(181);
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
          lookahead == ' ') ADVANCE(181);
      END_STATE();
    case 521:
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(181);
      if (lookahead == '=' ||
          lookahead == '>') ADVANCE(520);
      END_STATE();
    case 522:
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(181);
      if (('<' <= lookahead && lookahead <= '>')) ADVANCE(520);
      END_STATE();
    case 523:
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(171);
      END_STATE();
    case 524:
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(171);
      if (lookahead == '=' ||
          lookahead == '>') ADVANCE(523);
      END_STATE();
    case 525:
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(171);
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
          lookahead != '\r') ADVANCE(320);
      END_STATE();
    case 569:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(37);
      END_STATE();
    case 570:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(369);
      END_STATE();
    case 571:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(59);
      END_STATE();
    case 572:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(68);
      END_STATE();
    case 573:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(379);
      END_STATE();
    case 574:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(140);
      END_STATE();
    case 575:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(40);
      END_STATE();
    case 576:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(376);
      END_STATE();
    case 577:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(39);
      END_STATE();
    case 578:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(370);
      END_STATE();
    case 579:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(322);
      END_STATE();
    case 580:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(83);
      END_STATE();
    case 581:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(384);
      END_STATE();
    case 582:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(323);
      END_STATE();
    case 583:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(91);
      END_STATE();
    case 584:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(386);
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
          lookahead != '\r') ADVANCE(151);
      END_STATE();
    case 588:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(99);
      END_STATE();
    case 589:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(392);
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
          lookahead != '\r') ADVANCE(325);
      END_STATE();
    case 595:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(250);
      END_STATE();
    case 596:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(414);
      END_STATE();
    case 597:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(165);
      END_STATE();
    case 598:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(309);
      END_STATE();
    case 599:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(464);
      END_STATE();
    case 600:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(170);
      END_STATE();
    case 601:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(311);
      END_STATE();
    case 602:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(465);
      END_STATE();
    case 603:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(326);
      END_STATE();
    case 604:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(312);
      END_STATE();
    case 605:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(466);
      END_STATE();
    case 606:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(185);
      END_STATE();
    case 607:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(315);
      END_STATE();
    case 608:
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(467);
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
          lookahead != '\n') ADVANCE(36);
      END_STATE();
    case 642:
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(368);
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
        '"', 37,
        '\'', 369,
        ',', 181,
        'o', 651,
        '\t', 14,
        ' ', 14,
        '(', 174,
        '[', 174,
        '{', 174,
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
        '"', 37,
        '\'', 369,
        ',', 181,
        't', 653,
        '\t', 14,
        ' ', 14,
        '(', 174,
        '[', 174,
        '{', 174,
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
        '"', 37,
        '\'', 369,
        ',', 181,
        '\t', 14,
        ' ', 14,
        '(', 174,
        '[', 174,
        '{', 174,
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
        '"', 37,
        '\'', 369,
        ',', 181,
        '\t', 7,
        ' ', 7,
        '(', 174,
        '[', 174,
        '{', 174,
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
      if (lookahead == '\\') ADVANCE(569);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(37);
      END_STATE();
    case 686:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(850);
      if (lookahead == '\\') ADVANCE(577);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(39);
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
      if (lookahead == '"') ADVANCE(174);
      if (lookahead == '\\') ADVANCE(572);
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
      if (lookahead == '"') ADVANCE(182);
      if (lookahead == '\\') ADVANCE(580);
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
      if (lookahead == '"') ADVANCE(186);
      if (lookahead == '\\') ADVANCE(583);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(91);
      END_STATE();
    case 698:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(187);
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
      if (lookahead == '"') ADVANCE(193);
      if (lookahead == '\\') ADVANCE(588);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(99);
      END_STATE();
    case 701:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '"') ADVANCE(205);
      if (lookahead == '\\') ADVANCE(592);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(110);
      END_STATE();
    case 702:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 37,
        '\'', 369,
        ',', 181,
        '\t', 14,
        ' ', 14,
        '(', 174,
        '[', 174,
        '{', 174,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 703:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 37,
        '\'', 376,
        ',', 181,
        '\t', 14,
        ' ', 14,
        '(', 174,
        '[', 174,
        '{', 174,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 704:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 68,
        '\'', 379,
        '(', 182,
        '[', 182,
        '{', 182,
        ')', 801,
        ']', 801,
        '}', 801,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(174);
      END_STATE();
    case 705:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 40,
        '\'', 369,
        ',', 181,
        '\t', 14,
        ' ', 14,
        '(', 174,
        '[', 174,
        '{', 174,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 706:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 39,
        '\'', 370,
        ',', 181,
        '\t', 17,
        ' ', 17,
        '(', 186,
        '[', 186,
        '{', 186,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 707:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 83,
        '\'', 384,
        '(', 187,
        '[', 187,
        '{', 187,
        ')', 174,
        ']', 174,
        '}', 174,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(182);
      END_STATE();
    case 708:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 91,
        '\'', 386,
        '(', 193,
        '[', 193,
        '{', 193,
        ')', 850,
        ']', 850,
        '}', 850,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(186);
      END_STATE();
    case 709:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 94,
        '\'', 389,
        '(', 307,
        '[', 307,
        '{', 307,
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
    case 710:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 99,
        '\'', 392,
        '(', 205,
        '[', 205,
        '{', 205,
        ')', 186,
        ']', 186,
        '}', 186,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(193);
      END_STATE();
    case 711:
      ACCEPT_TOKEN(sym__screen_string);
      ADVANCE_MAP(
        '"', 110,
        '\'', 394,
        '(', 339,
        '[', 339,
        '{', 339,
        ')', 193,
        ']', 193,
        '}', 193,
      );
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '"' &&
          lookahead != '#') ADVANCE(205);
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
          lookahead == '}') ADVANCE(187);
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
          lookahead == '}') ADVANCE(205);
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
      if (lookahead == '\\') ADVANCE(570);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(369);
      END_STATE();
    case 720:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '\'') ADVANCE(850);
      if (lookahead == '\\') ADVANCE(578);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(370);
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
      if (lookahead == '\'') ADVANCE(174);
      if (lookahead == '\\') ADVANCE(573);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(379);
      END_STATE();
    case 724:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '\'') ADVANCE(182);
      if (lookahead == '\\') ADVANCE(581);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(384);
      END_STATE();
    case 725:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '\'') ADVANCE(186);
      if (lookahead == '\\') ADVANCE(584);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(386);
      END_STATE();
    case 726:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '\'') ADVANCE(187);
      if (lookahead == '\\') ADVANCE(586);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(389);
      END_STATE();
    case 727:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '\'') ADVANCE(193);
      if (lookahead == '\\') ADVANCE(589);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r') ADVANCE(392);
      END_STATE();
    case 728:
      ACCEPT_TOKEN(sym__screen_string);
      if (lookahead == '\'') ADVANCE(205);
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
        ',', 199,
        '\\', 805,
        '\t', 15,
        ' ', 15,
        '(', 201,
        '[', 201,
        '{', 201,
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
        '(', 176,
        '[', 176,
        '{', 176,
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
        '(', 176,
        '[', 176,
        '{', 176,
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
        '(', 176,
        '[', 176,
        '{', 176,
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
        '(', 176,
        '[', 176,
        '{', 176,
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
        '(', 176,
        '[', 176,
        '{', 176,
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
        '(', 176,
        '[', 176,
        '{', 176,
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
        '(', 176,
        '[', 176,
        '{', 176,
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
        '(', 176,
        '[', 176,
        '{', 176,
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
        '(', 176,
        '[', 176,
        '{', 176,
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
        '(', 176,
        '[', 176,
        '{', 176,
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
        '(', 176,
        '[', 176,
        '{', 176,
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
        '(', 176,
        '[', 176,
        '{', 176,
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
        '(', 176,
        '[', 176,
        '{', 176,
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
        '(', 176,
        '[', 176,
        '{', 176,
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
        '(', 176,
        '[', 176,
        '{', 176,
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
        '(', 176,
        '[', 176,
        '{', 176,
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
        '"', 37,
        '\'', 369,
        '*', 804,
        ',', 181,
        '\t', 7,
        ' ', 7,
        '(', 174,
        '[', 174,
        '{', 174,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 793:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 37,
        '\'', 369,
        ',', 181,
        '/', 804,
        '\t', 7,
        ' ', 7,
        '(', 174,
        '[', 174,
        '{', 174,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 794:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 37,
        '\'', 369,
        ',', 181,
        '=', 804,
        '\t', 14,
        ' ', 14,
        '(', 174,
        '[', 174,
        '{', 174,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 795:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 37,
        '\'', 369,
        ',', 181,
        'd', 804,
        '\t', 14,
        ' ', 14,
        '(', 174,
        '[', 174,
        '{', 174,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 796:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 37,
        '\'', 369,
        ',', 181,
        'n', 795,
        '\t', 14,
        ' ', 14,
        '(', 174,
        '[', 174,
        '{', 174,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 797:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 37,
        '\'', 369,
        ',', 181,
        'n', 804,
        's', 804,
        '\t', 14,
        ' ', 14,
        '(', 174,
        '[', 174,
        '{', 174,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 798:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 37,
        '\'', 369,
        ',', 181,
        'o', 800,
        '\t', 14,
        ' ', 14,
        '(', 174,
        '[', 174,
        '{', 174,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 799:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 37,
        '\'', 369,
        ',', 181,
        'r', 804,
        '\t', 14,
        ' ', 14,
        '(', 174,
        '[', 174,
        '{', 174,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 800:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 37,
        '\'', 369,
        ',', 181,
        't', 804,
        '\t', 14,
        ' ', 14,
        '(', 174,
        '[', 174,
        '{', 174,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 801:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 37,
        '\'', 369,
        ',', 181,
        '\t', 14,
        ' ', 14,
        '(', 174,
        '[', 174,
        '{', 174,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 802:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 37,
        '\'', 369,
        ',', 181,
        '\t', 7,
        ' ', 7,
        '=', 804,
        '>', 804,
        '(', 174,
        '[', 174,
        '{', 174,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 803:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 37,
        '\'', 369,
        ',', 181,
        '\t', 7,
        ' ', 7,
        '(', 174,
        '[', 174,
        '{', 174,
      );
      if (('<' <= lookahead && lookahead <= '>')) ADVANCE(804);
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 804:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 37,
        '\'', 369,
        ',', 181,
        '\t', 7,
        ' ', 7,
        '(', 174,
        '[', 174,
        '{', 174,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(801);
      END_STATE();
    case 805:
      ACCEPT_TOKEN(sym__screen_value);
      ADVANCE_MAP(
        '"', 40,
        '\'', 316,
        ',', 199,
        '\t', 15,
        ' ', 15,
        '(', 201,
        '[', 201,
        '{', 201,
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
        ',', 199,
        '\\', 805,
        '\t', 10,
        ' ', 10,
        '(', 201,
        '[', 201,
        '{', 201,
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
        ',', 199,
        '/', 818,
        '\\', 805,
        '\t', 10,
        ' ', 10,
        '(', 201,
        '[', 201,
        '{', 201,
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
        ',', 199,
        '=', 818,
        '\\', 805,
        '\t', 15,
        ' ', 15,
        '(', 201,
        '[', 201,
        '{', 201,
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
        ',', 199,
        '\\', 805,
        'd', 818,
        '\t', 15,
        ' ', 15,
        '(', 201,
        '[', 201,
        '{', 201,
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
        ',', 199,
        '\\', 805,
        'n', 809,
        '\t', 15,
        ' ', 15,
        '(', 201,
        '[', 201,
        '{', 201,
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
        ',', 199,
        '\\', 805,
        'n', 818,
        's', 818,
        '\t', 15,
        ' ', 15,
        '(', 201,
        '[', 201,
        '{', 201,
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
        ',', 199,
        '\\', 805,
        'o', 814,
        '\t', 15,
        ' ', 15,
        '(', 201,
        '[', 201,
        '{', 201,
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
        ',', 199,
        '\\', 805,
        'r', 818,
        '\t', 15,
        ' ', 15,
        '(', 201,
        '[', 201,
        '{', 201,
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
        ',', 199,
        '\\', 805,
        't', 818,
        '\t', 15,
        ' ', 15,
        '(', 201,
        '[', 201,
        '{', 201,
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
        ',', 199,
        '\\', 805,
        '\t', 15,
        ' ', 15,
        '(', 201,
        '[', 201,
        '{', 201,
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
        ',', 199,
        '\\', 805,
        '\t', 10,
        ' ', 10,
        '=', 818,
        '>', 818,
        '(', 201,
        '[', 201,
        '{', 201,
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
        ',', 199,
        '\\', 805,
        '\t', 10,
        ' ', 10,
        '(', 201,
        '[', 201,
        '{', 201,
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
        ',', 199,
        '\\', 805,
        '\t', 10,
        ' ', 10,
        '(', 201,
        '[', 201,
        '{', 201,
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
        ',', 199,
        '\\', 805,
        '\t', 15,
        ' ', 15,
        '(', 201,
        '[', 201,
        '{', 201,
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
        ',', 199,
        '\\', 864,
        '\t', 18,
        ' ', 18,
        '(', 206,
        '[', 206,
        '{', 206,
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
        '"', 39,
        '\'', 370,
        '*', 849,
        ',', 181,
        '\t', 8,
        ' ', 8,
        '(', 186,
        '[', 186,
        '{', 186,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 839:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 39,
        '\'', 370,
        ',', 181,
        '/', 849,
        '\t', 8,
        ' ', 8,
        '(', 186,
        '[', 186,
        '{', 186,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 840:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 39,
        '\'', 370,
        ',', 181,
        '=', 849,
        '\t', 17,
        ' ', 17,
        '(', 186,
        '[', 186,
        '{', 186,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 841:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 39,
        '\'', 370,
        ',', 181,
        'd', 849,
        '\t', 17,
        ' ', 17,
        '(', 186,
        '[', 186,
        '{', 186,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 842:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 39,
        '\'', 370,
        ',', 181,
        'n', 841,
        '\t', 17,
        ' ', 17,
        '(', 186,
        '[', 186,
        '{', 186,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 843:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 39,
        '\'', 370,
        ',', 181,
        'n', 849,
        's', 849,
        '\t', 17,
        ' ', 17,
        '(', 186,
        '[', 186,
        '{', 186,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 844:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 39,
        '\'', 370,
        ',', 181,
        'o', 846,
        '\t', 17,
        ' ', 17,
        '(', 186,
        '[', 186,
        '{', 186,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 845:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 39,
        '\'', 370,
        ',', 181,
        'r', 849,
        '\t', 17,
        ' ', 17,
        '(', 186,
        '[', 186,
        '{', 186,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 846:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 39,
        '\'', 370,
        ',', 181,
        't', 849,
        '\t', 17,
        ' ', 17,
        '(', 186,
        '[', 186,
        '{', 186,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 847:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 39,
        '\'', 370,
        ',', 181,
        '\t', 8,
        ' ', 8,
        '=', 849,
        '>', 849,
        '(', 186,
        '[', 186,
        '{', 186,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 848:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 39,
        '\'', 370,
        ',', 181,
        '\t', 8,
        ' ', 8,
        '(', 186,
        '[', 186,
        '{', 186,
      );
      if (('<' <= lookahead && lookahead <= '>')) ADVANCE(849);
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 849:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 39,
        '\'', 370,
        ',', 181,
        '\t', 8,
        ' ', 8,
        '(', 186,
        '[', 186,
        '{', 186,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 850:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 39,
        '\'', 370,
        ',', 181,
        '\t', 17,
        ' ', 17,
        '(', 186,
        '[', 186,
        '{', 186,
      );
      if ((!eof && set_contains(sym__at_expr_blob_character_set_2, 9, lookahead))) ADVANCE(850);
      END_STATE();
    case 851:
      ACCEPT_TOKEN(sym__screen_value_list);
      ADVANCE_MAP(
        '"', 67,
        '\'', 319,
        '*', 862,
        ',', 199,
        '\\', 864,
        '\t', 9,
        ' ', 9,
        '(', 206,
        '[', 206,
        '{', 206,
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
        ',', 199,
        '/', 862,
        '\\', 864,
        '\t', 9,
        ' ', 9,
        '(', 206,
        '[', 206,
        '{', 206,
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
        ',', 199,
        '=', 862,
        '\\', 864,
        '\t', 18,
        ' ', 18,
        '(', 206,
        '[', 206,
        '{', 206,
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
        ',', 199,
        '\\', 864,
        'd', 862,
        '\t', 18,
        ' ', 18,
        '(', 206,
        '[', 206,
        '{', 206,
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
        ',', 199,
        '\\', 864,
        'n', 854,
        '\t', 18,
        ' ', 18,
        '(', 206,
        '[', 206,
        '{', 206,
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
        ',', 199,
        '\\', 864,
        'n', 862,
        's', 862,
        '\t', 18,
        ' ', 18,
        '(', 206,
        '[', 206,
        '{', 206,
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
        ',', 199,
        '\\', 864,
        'o', 859,
        '\t', 18,
        ' ', 18,
        '(', 206,
        '[', 206,
        '{', 206,
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
        ',', 199,
        '\\', 864,
        'r', 862,
        '\t', 18,
        ' ', 18,
        '(', 206,
        '[', 206,
        '{', 206,
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
        ',', 199,
        '\\', 864,
        't', 862,
        '\t', 18,
        ' ', 18,
        '(', 206,
        '[', 206,
        '{', 206,
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
        ',', 199,
        '\\', 864,
        '\t', 9,
        ' ', 9,
        '=', 862,
        '>', 862,
        '(', 206,
        '[', 206,
        '{', 206,
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
        ',', 199,
        '\\', 864,
        '\t', 9,
        ' ', 9,
        '(', 206,
        '[', 206,
        '{', 206,
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
        ',', 199,
        '\\', 864,
        '\t', 9,
        ' ', 9,
        '(', 206,
        '[', 206,
        '{', 206,
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
        ',', 199,
        '\\', 864,
        '\t', 18,
        ' ', 18,
        '(', 206,
        '[', 206,
        '{', 206,
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
        ',', 199,
        '\t', 18,
        ' ', 18,
        '(', 206,
        '[', 206,
        '{', 206,
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
        ',', 199,
        '\\', 864,
        '\t', 18,
        ' ', 18,
        '(', 206,
        '[', 206,
        '{', 206,
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
  [5] = {.lex_state = 643},
  [6] = {.lex_state = 643, .external_lex_state = 3},
  [7] = {.lex_state = 643, .external_lex_state = 3},
  [8] = {.lex_state = 643, .external_lex_state = 3},
  [9] = {.lex_state = 643, .external_lex_state = 3},
  [10] = {.lex_state = 643, .external_lex_state = 3},
  [11] = {.lex_state = 643, .external_lex_state = 3},
  [12] = {.lex_state = 643},
  [13] = {.lex_state = 643},
  [14] = {.lex_state = 643},
  [15] = {.lex_state = 643},
  [16] = {.lex_state = 643},
  [17] = {.lex_state = 643},
  [18] = {.lex_state = 643, .external_lex_state = 3},
  [19] = {.lex_state = 643, .external_lex_state = 3},
  [20] = {.lex_state = 643},
  [21] = {.lex_state = 643},
  [22] = {.lex_state = 643, .external_lex_state = 3},
  [23] = {.lex_state = 643, .external_lex_state = 2},
  [24] = {.lex_state = 643, .external_lex_state = 2},
  [25] = {.lex_state = 643, .external_lex_state = 4},
  [26] = {.lex_state = 643, .external_lex_state = 2},
  [27] = {.lex_state = 643, .external_lex_state = 5},
  [28] = {.lex_state = 643, .external_lex_state = 6},
  [29] = {.lex_state = 643, .external_lex_state = 5},
  [30] = {.lex_state = 643, .external_lex_state = 5},
  [31] = {.lex_state = 643, .external_lex_state = 2},
  [32] = {.lex_state = 643, .external_lex_state = 3},
  [33] = {.lex_state = 643},
  [34] = {.lex_state = 643, .external_lex_state = 3},
  [35] = {.lex_state = 643},
  [36] = {.lex_state = 643, .external_lex_state = 5},
  [37] = {.lex_state = 643, .external_lex_state = 2},
  [38] = {.lex_state = 643, .external_lex_state = 5},
  [39] = {.lex_state = 643, .external_lex_state = 2},
  [40] = {.lex_state = 643, .external_lex_state = 6},
  [41] = {.lex_state = 643, .external_lex_state = 5},
  [42] = {.lex_state = 643, .external_lex_state = 5},
  [43] = {.lex_state = 643, .external_lex_state = 4},
  [44] = {.lex_state = 643, .external_lex_state = 6},
  [45] = {.lex_state = 643, .external_lex_state = 5},
  [46] = {.lex_state = 643, .external_lex_state = 2},
  [47] = {.lex_state = 643, .external_lex_state = 5},
  [48] = {.lex_state = 643, .external_lex_state = 2},
  [49] = {.lex_state = 643, .external_lex_state = 5},
  [50] = {.lex_state = 643, .external_lex_state = 5},
  [51] = {.lex_state = 643, .external_lex_state = 6},
  [52] = {.lex_state = 643, .external_lex_state = 5},
  [53] = {.lex_state = 643, .external_lex_state = 5},
  [54] = {.lex_state = 643, .external_lex_state = 2},
  [55] = {.lex_state = 643, .external_lex_state = 4},
  [56] = {.lex_state = 643, .external_lex_state = 5},
  [57] = {.lex_state = 643, .external_lex_state = 2},
  [58] = {.lex_state = 643, .external_lex_state = 2},
  [59] = {.lex_state = 643, .external_lex_state = 4},
  [60] = {.lex_state = 643, .external_lex_state = 2},
  [61] = {.lex_state = 643, .external_lex_state = 5},
  [62] = {.lex_state = 643, .external_lex_state = 2},
  [63] = {.lex_state = 643, .external_lex_state = 2},
  [64] = {.lex_state = 643, .external_lex_state = 2},
  [65] = {.lex_state = 643, .external_lex_state = 3},
  [66] = {.lex_state = 643},
  [67] = {.lex_state = 643},
  [68] = {.lex_state = 643},
  [69] = {.lex_state = 643},
  [70] = {.lex_state = 643},
  [71] = {.lex_state = 643},
  [72] = {.lex_state = 643},
  [73] = {.lex_state = 643},
  [74] = {.lex_state = 643},
  [75] = {.lex_state = 643},
  [76] = {.lex_state = 643},
  [77] = {.lex_state = 643},
  [78] = {.lex_state = 643},
  [79] = {.lex_state = 643},
  [80] = {.lex_state = 643},
  [81] = {.lex_state = 643},
  [82] = {.lex_state = 643},
  [83] = {.lex_state = 643},
  [84] = {.lex_state = 643},
  [85] = {.lex_state = 643},
  [86] = {.lex_state = 643},
  [87] = {.lex_state = 643},
  [88] = {.lex_state = 643},
  [89] = {.lex_state = 643},
  [90] = {.lex_state = 643},
  [91] = {.lex_state = 643},
  [92] = {.lex_state = 643},
  [93] = {.lex_state = 643},
  [94] = {.lex_state = 643},
  [95] = {.lex_state = 643},
  [96] = {.lex_state = 643},
  [97] = {.lex_state = 643},
  [98] = {.lex_state = 643},
  [99] = {.lex_state = 643},
  [100] = {.lex_state = 643},
  [101] = {.lex_state = 643},
  [102] = {.lex_state = 643},
  [103] = {.lex_state = 643},
  [104] = {.lex_state = 643},
  [105] = {.lex_state = 643},
  [106] = {.lex_state = 643},
  [107] = {.lex_state = 643},
  [108] = {.lex_state = 643},
  [109] = {.lex_state = 643},
  [110] = {.lex_state = 643},
  [111] = {.lex_state = 643},
  [112] = {.lex_state = 643},
  [113] = {.lex_state = 643},
  [114] = {.lex_state = 643},
  [115] = {.lex_state = 643},
  [116] = {.lex_state = 643},
  [117] = {.lex_state = 643},
  [118] = {.lex_state = 643},
  [119] = {.lex_state = 643},
  [120] = {.lex_state = 643},
  [121] = {.lex_state = 643},
  [122] = {.lex_state = 643},
  [123] = {.lex_state = 643},
  [124] = {.lex_state = 643},
  [125] = {.lex_state = 643},
  [126] = {.lex_state = 643},
  [127] = {.lex_state = 643},
  [128] = {.lex_state = 643},
  [129] = {.lex_state = 643},
  [130] = {.lex_state = 643},
  [131] = {.lex_state = 643},
  [132] = {.lex_state = 643},
  [133] = {.lex_state = 643},
  [134] = {.lex_state = 643},
  [135] = {.lex_state = 643},
  [136] = {.lex_state = 643},
  [137] = {.lex_state = 643},
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
  [161] = {.lex_state = 643, .external_lex_state = 3},
  [162] = {.lex_state = 643, .external_lex_state = 3},
  [163] = {.lex_state = 643, .external_lex_state = 3},
  [164] = {.lex_state = 643, .external_lex_state = 3},
  [165] = {.lex_state = 643, .external_lex_state = 3},
  [166] = {.lex_state = 643, .external_lex_state = 3},
  [167] = {.lex_state = 643, .external_lex_state = 3},
  [168] = {.lex_state = 643, .external_lex_state = 3},
  [169] = {.lex_state = 643, .external_lex_state = 3},
  [170] = {.lex_state = 643, .external_lex_state = 3},
  [171] = {.lex_state = 643, .external_lex_state = 3},
  [172] = {.lex_state = 643},
  [173] = {.lex_state = 643, .external_lex_state = 3},
  [174] = {.lex_state = 643},
  [175] = {.lex_state = 643, .external_lex_state = 3},
  [176] = {.lex_state = 643, .external_lex_state = 3},
  [177] = {.lex_state = 643, .external_lex_state = 3},
  [178] = {.lex_state = 643, .external_lex_state = 3},
  [179] = {.lex_state = 643, .external_lex_state = 3},
  [180] = {.lex_state = 643, .external_lex_state = 3},
  [181] = {.lex_state = 643, .external_lex_state = 3},
  [182] = {.lex_state = 643, .external_lex_state = 3},
  [183] = {.lex_state = 643, .external_lex_state = 3},
  [184] = {.lex_state = 643, .external_lex_state = 3},
  [185] = {.lex_state = 643, .external_lex_state = 3},
  [186] = {.lex_state = 643, .external_lex_state = 3},
  [187] = {.lex_state = 643, .external_lex_state = 3},
  [188] = {.lex_state = 643, .external_lex_state = 3},
  [189] = {.lex_state = 643, .external_lex_state = 3},
  [190] = {.lex_state = 643},
  [191] = {.lex_state = 643, .external_lex_state = 3},
  [192] = {.lex_state = 643, .external_lex_state = 3},
  [193] = {.lex_state = 643, .external_lex_state = 3},
  [194] = {.lex_state = 643, .external_lex_state = 3},
  [195] = {.lex_state = 643, .external_lex_state = 3},
  [196] = {.lex_state = 643, .external_lex_state = 3},
  [197] = {.lex_state = 643},
  [198] = {.lex_state = 643, .external_lex_state = 3},
  [199] = {.lex_state = 643, .external_lex_state = 3},
  [200] = {.lex_state = 643, .external_lex_state = 3},
  [201] = {.lex_state = 643, .external_lex_state = 3},
  [202] = {.lex_state = 643, .external_lex_state = 3},
  [203] = {.lex_state = 643, .external_lex_state = 3},
  [204] = {.lex_state = 643, .external_lex_state = 3},
  [205] = {.lex_state = 643, .external_lex_state = 3},
  [206] = {.lex_state = 643, .external_lex_state = 3},
  [207] = {.lex_state = 643, .external_lex_state = 3},
  [208] = {.lex_state = 643, .external_lex_state = 3},
  [209] = {.lex_state = 643, .external_lex_state = 3},
  [210] = {.lex_state = 643, .external_lex_state = 3},
  [211] = {.lex_state = 643, .external_lex_state = 3},
  [212] = {.lex_state = 643, .external_lex_state = 3},
  [213] = {.lex_state = 643},
  [214] = {.lex_state = 643},
  [215] = {.lex_state = 643, .external_lex_state = 3},
  [216] = {.lex_state = 643, .external_lex_state = 3},
  [217] = {.lex_state = 643, .external_lex_state = 3},
  [218] = {.lex_state = 643, .external_lex_state = 3},
  [219] = {.lex_state = 643, .external_lex_state = 3},
  [220] = {.lex_state = 643, .external_lex_state = 3},
  [221] = {.lex_state = 643, .external_lex_state = 3},
  [222] = {.lex_state = 643, .external_lex_state = 3},
  [223] = {.lex_state = 643, .external_lex_state = 3},
  [224] = {.lex_state = 643, .external_lex_state = 3},
  [225] = {.lex_state = 643, .external_lex_state = 3},
  [226] = {.lex_state = 643, .external_lex_state = 3},
  [227] = {.lex_state = 643, .external_lex_state = 3},
  [228] = {.lex_state = 643, .external_lex_state = 3},
  [229] = {.lex_state = 643, .external_lex_state = 3},
  [230] = {.lex_state = 643},
  [231] = {.lex_state = 643, .external_lex_state = 3},
  [232] = {.lex_state = 643, .external_lex_state = 3},
  [233] = {.lex_state = 643, .external_lex_state = 3},
  [234] = {.lex_state = 643, .external_lex_state = 3},
  [235] = {.lex_state = 643, .external_lex_state = 3},
  [236] = {.lex_state = 643, .external_lex_state = 3},
  [237] = {.lex_state = 643, .external_lex_state = 3},
  [238] = {.lex_state = 643, .external_lex_state = 3},
  [239] = {.lex_state = 643, .external_lex_state = 3},
  [240] = {.lex_state = 643, .external_lex_state = 3},
  [241] = {.lex_state = 643, .external_lex_state = 3},
  [242] = {.lex_state = 643, .external_lex_state = 3},
  [243] = {.lex_state = 643, .external_lex_state = 3},
  [244] = {.lex_state = 643, .external_lex_state = 3},
  [245] = {.lex_state = 643, .external_lex_state = 3},
  [246] = {.lex_state = 643, .external_lex_state = 3},
  [247] = {.lex_state = 643, .external_lex_state = 3},
  [248] = {.lex_state = 643, .external_lex_state = 3},
  [249] = {.lex_state = 643, .external_lex_state = 3},
  [250] = {.lex_state = 643},
  [251] = {.lex_state = 643, .external_lex_state = 3},
  [252] = {.lex_state = 643, .external_lex_state = 3},
  [253] = {.lex_state = 643, .external_lex_state = 3},
  [254] = {.lex_state = 643, .external_lex_state = 3},
  [255] = {.lex_state = 643, .external_lex_state = 3},
  [256] = {.lex_state = 643, .external_lex_state = 3},
  [257] = {.lex_state = 643},
  [258] = {.lex_state = 643, .external_lex_state = 3},
  [259] = {.lex_state = 643, .external_lex_state = 3},
  [260] = {.lex_state = 643, .external_lex_state = 3},
  [261] = {.lex_state = 643, .external_lex_state = 3},
  [262] = {.lex_state = 643, .external_lex_state = 3},
  [263] = {.lex_state = 643, .external_lex_state = 3},
  [264] = {.lex_state = 643, .external_lex_state = 3},
  [265] = {.lex_state = 643, .external_lex_state = 3},
  [266] = {.lex_state = 643, .external_lex_state = 3},
  [267] = {.lex_state = 643, .external_lex_state = 3},
  [268] = {.lex_state = 643, .external_lex_state = 3},
  [269] = {.lex_state = 643, .external_lex_state = 3},
  [270] = {.lex_state = 643, .external_lex_state = 3},
  [271] = {.lex_state = 643, .external_lex_state = 3},
  [272] = {.lex_state = 643, .external_lex_state = 3},
  [273] = {.lex_state = 643, .external_lex_state = 3},
  [274] = {.lex_state = 643, .external_lex_state = 3},
  [275] = {.lex_state = 643, .external_lex_state = 3},
  [276] = {.lex_state = 643, .external_lex_state = 3},
  [277] = {.lex_state = 643, .external_lex_state = 3},
  [278] = {.lex_state = 643, .external_lex_state = 3},
  [279] = {.lex_state = 643, .external_lex_state = 3},
  [280] = {.lex_state = 643, .external_lex_state = 3},
  [281] = {.lex_state = 643, .external_lex_state = 3},
  [282] = {.lex_state = 643, .external_lex_state = 3},
  [283] = {.lex_state = 643, .external_lex_state = 3},
  [284] = {.lex_state = 643, .external_lex_state = 3},
  [285] = {.lex_state = 643, .external_lex_state = 3},
  [286] = {.lex_state = 643, .external_lex_state = 3},
  [287] = {.lex_state = 643},
  [288] = {.lex_state = 643},
  [289] = {.lex_state = 643},
  [290] = {.lex_state = 643},
  [291] = {.lex_state = 643, .external_lex_state = 3},
  [292] = {.lex_state = 643},
  [293] = {.lex_state = 643},
  [294] = {.lex_state = 643},
  [295] = {.lex_state = 643},
  [296] = {.lex_state = 643},
  [297] = {.lex_state = 643},
  [298] = {.lex_state = 643},
  [299] = {.lex_state = 643},
  [300] = {.lex_state = 643},
  [301] = {.lex_state = 643},
  [302] = {.lex_state = 643},
  [303] = {.lex_state = 0, .external_lex_state = 3},
  [304] = {.lex_state = 0, .external_lex_state = 3},
  [305] = {.lex_state = 0, .external_lex_state = 3},
  [306] = {.lex_state = 0, .external_lex_state = 3},
  [307] = {.lex_state = 0},
  [308] = {.lex_state = 0},
  [309] = {.lex_state = 0},
  [310] = {.lex_state = 0, .external_lex_state = 3},
  [311] = {.lex_state = 0, .external_lex_state = 3},
  [312] = {.lex_state = 0, .external_lex_state = 3},
  [313] = {.lex_state = 0, .external_lex_state = 3},
  [314] = {.lex_state = 0, .external_lex_state = 3},
  [315] = {.lex_state = 0, .external_lex_state = 3},
  [316] = {.lex_state = 0, .external_lex_state = 3},
  [317] = {.lex_state = 0, .external_lex_state = 3},
  [318] = {.lex_state = 0, .external_lex_state = 3},
  [319] = {.lex_state = 0, .external_lex_state = 3},
  [320] = {.lex_state = 0, .external_lex_state = 3},
  [321] = {.lex_state = 0, .external_lex_state = 3},
  [322] = {.lex_state = 25, .external_lex_state = 2},
  [323] = {.lex_state = 0},
  [324] = {.lex_state = 0},
  [325] = {.lex_state = 25, .external_lex_state = 2},
  [326] = {.lex_state = 0, .external_lex_state = 3},
  [327] = {.lex_state = 0, .external_lex_state = 3},
  [328] = {.lex_state = 0, .external_lex_state = 3},
  [329] = {.lex_state = 0, .external_lex_state = 3},
  [330] = {.lex_state = 0},
  [331] = {.lex_state = 0, .external_lex_state = 3},
  [332] = {.lex_state = 0},
  [333] = {.lex_state = 0},
  [334] = {.lex_state = 0},
  [335] = {.lex_state = 20, .external_lex_state = 2},
  [336] = {.lex_state = 20, .external_lex_state = 2},
  [337] = {.lex_state = 0},
  [338] = {.lex_state = 20, .external_lex_state = 2},
  [339] = {.lex_state = 20, .external_lex_state = 2},
  [340] = {.lex_state = 0},
  [341] = {.lex_state = 0},
  [342] = {.lex_state = 0, .external_lex_state = 2},
  [343] = {.lex_state = 0, .external_lex_state = 2},
  [344] = {.lex_state = 0, .external_lex_state = 2},
  [345] = {.lex_state = 0, .external_lex_state = 3},
  [346] = {.lex_state = 0, .external_lex_state = 2},
  [347] = {.lex_state = 0, .external_lex_state = 3},
  [348] = {.lex_state = 0, .external_lex_state = 3},
  [349] = {.lex_state = 0, .external_lex_state = 3},
  [350] = {.lex_state = 0, .external_lex_state = 2},
  [351] = {.lex_state = 0, .external_lex_state = 3},
  [352] = {.lex_state = 0, .external_lex_state = 3},
  [353] = {.lex_state = 0, .external_lex_state = 2},
  [354] = {.lex_state = 43},
  [355] = {.lex_state = 0, .external_lex_state = 6},
  [356] = {.lex_state = 0, .external_lex_state = 5},
  [357] = {.lex_state = 0, .external_lex_state = 2},
  [358] = {.lex_state = 20, .external_lex_state = 2},
  [359] = {.lex_state = 167, .external_lex_state = 2},
  [360] = {.lex_state = 42},
  [361] = {.lex_state = 43},
  [362] = {.lex_state = 42},
  [363] = {.lex_state = 25, .external_lex_state = 2},
  [364] = {.lex_state = 0, .external_lex_state = 2},
  [365] = {.lex_state = 0, .external_lex_state = 2},
  [366] = {.lex_state = 0, .external_lex_state = 5},
  [367] = {.lex_state = 0, .external_lex_state = 5},
  [368] = {.lex_state = 0, .external_lex_state = 2},
  [369] = {.lex_state = 0, .external_lex_state = 3},
  [370] = {.lex_state = 0, .external_lex_state = 3},
  [371] = {.lex_state = 44},
  [372] = {.lex_state = 42},
  [373] = {.lex_state = 0, .external_lex_state = 3},
  [374] = {.lex_state = 22},
  [375] = {.lex_state = 0, .external_lex_state = 3},
  [376] = {.lex_state = 0, .external_lex_state = 2},
  [377] = {.lex_state = 0, .external_lex_state = 3},
  [378] = {.lex_state = 0, .external_lex_state = 3},
  [379] = {.lex_state = 42},
  [380] = {.lex_state = 44},
  [381] = {.lex_state = 0, .external_lex_state = 2},
  [382] = {.lex_state = 42},
  [383] = {.lex_state = 0, .external_lex_state = 2},
  [384] = {.lex_state = 0, .external_lex_state = 3},
  [385] = {.lex_state = 0, .external_lex_state = 3},
  [386] = {.lex_state = 0, .external_lex_state = 3},
  [387] = {.lex_state = 0, .external_lex_state = 3},
  [388] = {.lex_state = 0, .external_lex_state = 3},
  [389] = {.lex_state = 0, .external_lex_state = 3},
  [390] = {.lex_state = 0, .external_lex_state = 3},
  [391] = {.lex_state = 0, .external_lex_state = 3},
  [392] = {.lex_state = 22},
  [393] = {.lex_state = 44},
  [394] = {.lex_state = 44},
  [395] = {.lex_state = 0, .external_lex_state = 3},
  [396] = {.lex_state = 0, .external_lex_state = 3},
  [397] = {.lex_state = 0, .external_lex_state = 3},
  [398] = {.lex_state = 0, .external_lex_state = 3},
  [399] = {.lex_state = 0, .external_lex_state = 2},
  [400] = {.lex_state = 42, .external_lex_state = 2},
  [401] = {.lex_state = 0, .external_lex_state = 2},
  [402] = {.lex_state = 0, .external_lex_state = 2},
  [403] = {.lex_state = 0, .external_lex_state = 2},
  [404] = {.lex_state = 0},
  [405] = {.lex_state = 0},
  [406] = {.lex_state = 25, .external_lex_state = 2},
  [407] = {.lex_state = 0, .external_lex_state = 2},
  [408] = {.lex_state = 0, .external_lex_state = 2},
  [409] = {.lex_state = 0},
  [410] = {.lex_state = 167},
  [411] = {.lex_state = 0},
  [412] = {.lex_state = 0},
  [413] = {.lex_state = 0, .external_lex_state = 2},
  [414] = {.lex_state = 0},
  [415] = {.lex_state = 0, .external_lex_state = 2},
  [416] = {.lex_state = 0},
  [417] = {.lex_state = 42, .external_lex_state = 2},
  [418] = {.lex_state = 42, .external_lex_state = 2},
  [419] = {.lex_state = 22},
  [420] = {.lex_state = 0},
  [421] = {.lex_state = 0},
  [422] = {.lex_state = 43},
  [423] = {.lex_state = 0},
  [424] = {.lex_state = 25, .external_lex_state = 2},
  [425] = {.lex_state = 0},
  [426] = {.lex_state = 0},
  [427] = {.lex_state = 22},
  [428] = {.lex_state = 25, .external_lex_state = 2},
  [429] = {.lex_state = 0},
  [430] = {.lex_state = 0},
  [431] = {.lex_state = 43},
  [432] = {.lex_state = 0},
  [433] = {.lex_state = 0},
  [434] = {.lex_state = 0},
  [435] = {.lex_state = 42, .external_lex_state = 2},
  [436] = {.lex_state = 0},
  [437] = {.lex_state = 0, .external_lex_state = 2},
  [438] = {.lex_state = 0, .external_lex_state = 2},
  [439] = {.lex_state = 0},
  [440] = {.lex_state = 43},
  [441] = {.lex_state = 0, .external_lex_state = 2},
  [442] = {.lex_state = 0, .external_lex_state = 2},
  [443] = {.lex_state = 0, .external_lex_state = 2},
  [444] = {.lex_state = 22},
  [445] = {.lex_state = 22},
  [446] = {.lex_state = 0, .external_lex_state = 2},
  [447] = {.lex_state = 0, .external_lex_state = 2},
  [448] = {.lex_state = 0, .external_lex_state = 2},
  [449] = {.lex_state = 0, .external_lex_state = 2},
  [450] = {.lex_state = 21},
  [451] = {.lex_state = 43},
  [452] = {.lex_state = 0, .external_lex_state = 2},
  [453] = {.lex_state = 0, .external_lex_state = 2},
  [454] = {.lex_state = 0, .external_lex_state = 2},
  [455] = {.lex_state = 0, .external_lex_state = 2},
  [456] = {.lex_state = 0, .external_lex_state = 2},
  [457] = {.lex_state = 0, .external_lex_state = 2},
  [458] = {.lex_state = 0, .external_lex_state = 2},
  [459] = {.lex_state = 0, .external_lex_state = 2},
  [460] = {.lex_state = 0, .external_lex_state = 2},
  [461] = {.lex_state = 0},
  [462] = {.lex_state = 0, .external_lex_state = 2},
  [463] = {.lex_state = 0, .external_lex_state = 2},
  [464] = {.lex_state = 0, .external_lex_state = 2},
  [465] = {.lex_state = 0, .external_lex_state = 2},
  [466] = {.lex_state = 22},
  [467] = {.lex_state = 22},
  [468] = {.lex_state = 0, .external_lex_state = 2},
  [469] = {.lex_state = 0, .external_lex_state = 2},
  [470] = {.lex_state = 0},
  [471] = {.lex_state = 0},
  [472] = {.lex_state = 0, .external_lex_state = 2},
  [473] = {.lex_state = 0, .external_lex_state = 2},
  [474] = {.lex_state = 0, .external_lex_state = 2},
  [475] = {.lex_state = 0, .external_lex_state = 2},
  [476] = {.lex_state = 22},
  [477] = {.lex_state = 22},
  [478] = {.lex_state = 0, .external_lex_state = 2},
  [479] = {.lex_state = 0},
  [480] = {.lex_state = 0, .external_lex_state = 2},
  [481] = {.lex_state = 0},
  [482] = {.lex_state = 0},
  [483] = {.lex_state = 0},
  [484] = {.lex_state = 0, .external_lex_state = 2},
  [485] = {.lex_state = 22},
  [486] = {.lex_state = 0, .external_lex_state = 2},
  [487] = {.lex_state = 0},
  [488] = {.lex_state = 0},
  [489] = {.lex_state = 0},
  [490] = {.lex_state = 0, .external_lex_state = 2},
  [491] = {.lex_state = 0, .external_lex_state = 2},
  [492] = {.lex_state = 0},
  [493] = {.lex_state = 0},
  [494] = {.lex_state = 22},
  [495] = {.lex_state = 0},
  [496] = {.lex_state = 0, .external_lex_state = 2},
  [497] = {.lex_state = 0},
  [498] = {.lex_state = 0, .external_lex_state = 2},
  [499] = {.lex_state = 0},
  [500] = {.lex_state = 0},
  [501] = {.lex_state = 0},
  [502] = {.lex_state = 0},
  [503] = {.lex_state = 0},
  [504] = {.lex_state = 0},
  [505] = {.lex_state = 0, .external_lex_state = 2},
  [506] = {.lex_state = 0},
  [507] = {.lex_state = 0, .external_lex_state = 3},
  [508] = {.lex_state = 0},
  [509] = {.lex_state = 0, .external_lex_state = 3},
  [510] = {.lex_state = 0},
  [511] = {.lex_state = 0},
  [512] = {.lex_state = 0},
  [513] = {.lex_state = 0},
  [514] = {.lex_state = 0},
  [515] = {.lex_state = 0},
  [516] = {.lex_state = 0},
  [517] = {.lex_state = 0},
  [518] = {.lex_state = 22},
  [519] = {.lex_state = 22},
  [520] = {.lex_state = 0},
  [521] = {.lex_state = 528},
  [522] = {.lex_state = 0},
  [523] = {.lex_state = 0},
  [524] = {.lex_state = 0},
  [525] = {.lex_state = 0},
  [526] = {.lex_state = 0},
  [527] = {.lex_state = 528},
  [528] = {.lex_state = 528},
  [529] = {.lex_state = 0},
  [530] = {.lex_state = 0},
  [531] = {.lex_state = 528},
  [532] = {.lex_state = 0},
  [533] = {.lex_state = 0},
  [534] = {.lex_state = 0},
  [535] = {.lex_state = 23, .external_lex_state = 2},
  [536] = {.lex_state = 0, .external_lex_state = 2},
  [537] = {.lex_state = 0, .external_lex_state = 2},
  [538] = {.lex_state = 0, .external_lex_state = 2},
  [539] = {.lex_state = 23, .external_lex_state = 2},
  [540] = {.lex_state = 0},
  [541] = {.lex_state = 0, .external_lex_state = 2},
  [542] = {.lex_state = 42},
  [543] = {.lex_state = 0},
  [544] = {.lex_state = 0},
  [545] = {.lex_state = 23, .external_lex_state = 2},
  [546] = {.lex_state = 23, .external_lex_state = 2},
  [547] = {.lex_state = 23, .external_lex_state = 2},
  [548] = {.lex_state = 0, .external_lex_state = 2},
  [549] = {.lex_state = 0},
  [550] = {.lex_state = 0},
  [551] = {.lex_state = 0, .external_lex_state = 2},
  [552] = {.lex_state = 0},
  [553] = {.lex_state = 0},
  [554] = {.lex_state = 42},
  [555] = {.lex_state = 0, .external_lex_state = 2},
  [556] = {.lex_state = 0},
  [557] = {.lex_state = 0, .external_lex_state = 2},
  [558] = {.lex_state = 23, .external_lex_state = 2},
  [559] = {.lex_state = 1},
  [560] = {.lex_state = 0, .external_lex_state = 2},
  [561] = {.lex_state = 0, .external_lex_state = 2},
  [562] = {.lex_state = 0, .external_lex_state = 2},
  [563] = {.lex_state = 0},
  [564] = {.lex_state = 0, .external_lex_state = 2},
  [565] = {.lex_state = 1},
  [566] = {.lex_state = 23, .external_lex_state = 2},
  [567] = {.lex_state = 23, .external_lex_state = 2},
  [568] = {.lex_state = 0},
  [569] = {.lex_state = 0, .external_lex_state = 2},
  [570] = {.lex_state = 0, .external_lex_state = 2},
  [571] = {.lex_state = 0, .external_lex_state = 2},
  [572] = {.lex_state = 0, .external_lex_state = 2},
  [573] = {.lex_state = 0, .external_lex_state = 2},
  [574] = {.lex_state = 23},
  [575] = {.lex_state = 0},
  [576] = {.lex_state = 0},
  [577] = {.lex_state = 0},
  [578] = {.lex_state = 0},
  [579] = {.lex_state = 23, .external_lex_state = 2},
  [580] = {.lex_state = 0, .external_lex_state = 4},
  [581] = {.lex_state = 23},
  [582] = {.lex_state = 0, .external_lex_state = 2},
  [583] = {.lex_state = 0, .external_lex_state = 4},
  [584] = {.lex_state = 0, .external_lex_state = 4},
  [585] = {.lex_state = 0, .external_lex_state = 4},
  [586] = {.lex_state = 23},
  [587] = {.lex_state = 23},
  [588] = {.lex_state = 0},
  [589] = {.lex_state = 0, .external_lex_state = 2},
  [590] = {.lex_state = 0},
  [591] = {.lex_state = 0},
  [592] = {.lex_state = 0, .external_lex_state = 2},
  [593] = {.lex_state = 0, .external_lex_state = 2},
  [594] = {.lex_state = 23},
  [595] = {.lex_state = 0, .external_lex_state = 2},
  [596] = {.lex_state = 0, .external_lex_state = 2},
  [597] = {.lex_state = 0, .external_lex_state = 2},
  [598] = {.lex_state = 0, .external_lex_state = 2},
  [599] = {.lex_state = 0, .external_lex_state = 2},
  [600] = {.lex_state = 0, .external_lex_state = 2},
  [601] = {.lex_state = 0, .external_lex_state = 2},
  [602] = {.lex_state = 0, .external_lex_state = 2},
  [603] = {.lex_state = 241},
  [604] = {.lex_state = 23},
  [605] = {.lex_state = 0, .external_lex_state = 2},
  [606] = {.lex_state = 0, .external_lex_state = 2},
  [607] = {.lex_state = 0, .external_lex_state = 2},
  [608] = {.lex_state = 23},
  [609] = {.lex_state = 23},
  [610] = {.lex_state = 23},
  [611] = {.lex_state = 241},
  [612] = {.lex_state = 0},
  [613] = {.lex_state = 0},
  [614] = {.lex_state = 0, .external_lex_state = 2},
  [615] = {.lex_state = 0, .external_lex_state = 2},
  [616] = {.lex_state = 0, .external_lex_state = 2},
  [617] = {.lex_state = 23},
  [618] = {.lex_state = 0, .external_lex_state = 2},
  [619] = {.lex_state = 23},
  [620] = {.lex_state = 0, .external_lex_state = 2},
  [621] = {.lex_state = 0},
  [622] = {.lex_state = 0, .external_lex_state = 2},
  [623] = {.lex_state = 0},
  [624] = {.lex_state = 0, .external_lex_state = 2},
  [625] = {.lex_state = 0, .external_lex_state = 4},
  [626] = {.lex_state = 23},
  [627] = {.lex_state = 0, .external_lex_state = 2},
  [628] = {.lex_state = 0, .external_lex_state = 2},
  [629] = {.lex_state = 0, .external_lex_state = 2},
  [630] = {.lex_state = 0, .external_lex_state = 2},
  [631] = {.lex_state = 23},
  [632] = {.lex_state = 0, .external_lex_state = 2},
  [633] = {.lex_state = 23},
  [634] = {.lex_state = 23},
  [635] = {.lex_state = 23},
  [636] = {.lex_state = 0},
  [637] = {.lex_state = 0, .external_lex_state = 2},
  [638] = {.lex_state = 0, .external_lex_state = 2},
  [639] = {.lex_state = 0, .external_lex_state = 2},
  [640] = {.lex_state = 23},
  [641] = {.lex_state = 23},
  [642] = {.lex_state = 0},
  [643] = {.lex_state = 23},
  [644] = {.lex_state = 0, .external_lex_state = 2},
  [645] = {.lex_state = 0, .external_lex_state = 2},
  [646] = {.lex_state = 0, .external_lex_state = 2},
  [647] = {.lex_state = 0, .external_lex_state = 2},
  [648] = {.lex_state = 0, .external_lex_state = 2},
  [649] = {.lex_state = 23},
  [650] = {.lex_state = 25},
  [651] = {.lex_state = 0, .external_lex_state = 2},
  [652] = {.lex_state = 0, .external_lex_state = 2},
  [653] = {.lex_state = 0, .external_lex_state = 2},
  [654] = {.lex_state = 0, .external_lex_state = 2},
  [655] = {.lex_state = 0, .external_lex_state = 2},
  [656] = {.lex_state = 0, .external_lex_state = 2},
  [657] = {.lex_state = 0, .external_lex_state = 2},
  [658] = {.lex_state = 23},
  [659] = {.lex_state = 0, .external_lex_state = 2},
  [660] = {.lex_state = 0},
  [661] = {.lex_state = 23},
  [662] = {.lex_state = 0},
  [663] = {.lex_state = 0, .external_lex_state = 2},
  [664] = {.lex_state = 0, .external_lex_state = 2},
  [665] = {.lex_state = 0, .external_lex_state = 2},
  [666] = {.lex_state = 0, .external_lex_state = 2},
  [667] = {.lex_state = 0, .external_lex_state = 2},
  [668] = {.lex_state = 23},
  [669] = {.lex_state = 0, .external_lex_state = 2},
  [670] = {.lex_state = 0, .external_lex_state = 2},
  [671] = {.lex_state = 0, .external_lex_state = 2},
  [672] = {.lex_state = 0, .external_lex_state = 2},
  [673] = {.lex_state = 0, .external_lex_state = 4},
  [674] = {.lex_state = 23},
  [675] = {.lex_state = 23},
  [676] = {.lex_state = 0},
  [677] = {.lex_state = 0, .external_lex_state = 2},
  [678] = {.lex_state = 0},
  [679] = {.lex_state = 0, .external_lex_state = 2},
  [680] = {.lex_state = 0, .external_lex_state = 2},
  [681] = {.lex_state = 0, .external_lex_state = 2},
  [682] = {.lex_state = 23},
  [683] = {.lex_state = 0, .external_lex_state = 2},
  [684] = {.lex_state = 0, .external_lex_state = 2},
  [685] = {.lex_state = 23},
  [686] = {.lex_state = 0, .external_lex_state = 2},
  [687] = {.lex_state = 0, .external_lex_state = 2},
  [688] = {.lex_state = 23},
  [689] = {.lex_state = 0, .external_lex_state = 4},
  [690] = {.lex_state = 23},
  [691] = {.lex_state = 0, .external_lex_state = 2},
  [692] = {.lex_state = 0, .external_lex_state = 2},
  [693] = {.lex_state = 0, .external_lex_state = 2},
  [694] = {.lex_state = 0, .external_lex_state = 4},
  [695] = {.lex_state = 0},
  [696] = {.lex_state = 0, .external_lex_state = 2},
  [697] = {.lex_state = 0, .external_lex_state = 2},
  [698] = {.lex_state = 0, .external_lex_state = 2},
  [699] = {.lex_state = 0},
  [700] = {.lex_state = 0, .external_lex_state = 2},
  [701] = {.lex_state = 0, .external_lex_state = 2},
  [702] = {.lex_state = 43},
  [703] = {.lex_state = 43},
  [704] = {.lex_state = 0, .external_lex_state = 4},
  [705] = {.lex_state = 23},
  [706] = {.lex_state = 23},
  [707] = {.lex_state = 23},
  [708] = {.lex_state = 0},
  [709] = {.lex_state = 0, .external_lex_state = 2},
  [710] = {.lex_state = 0},
  [711] = {.lex_state = 0, .external_lex_state = 2},
  [712] = {.lex_state = 0},
  [713] = {.lex_state = 0},
  [714] = {.lex_state = 0},
  [715] = {.lex_state = 0},
  [716] = {.lex_state = 23},
  [717] = {.lex_state = 0, .external_lex_state = 2},
  [718] = {.lex_state = 0},
  [719] = {.lex_state = 0},
  [720] = {.lex_state = 23},
  [721] = {.lex_state = 241},
  [722] = {.lex_state = 0},
  [723] = {.lex_state = 23},
  [724] = {.lex_state = 23},
  [725] = {.lex_state = 23},
  [726] = {.lex_state = 23},
  [727] = {.lex_state = 23},
  [728] = {.lex_state = 23},
  [729] = {.lex_state = 23},
  [730] = {.lex_state = 23},
  [731] = {.lex_state = 23},
  [732] = {.lex_state = 241},
  [733] = {.lex_state = 23},
  [734] = {.lex_state = 241},
  [735] = {.lex_state = 0},
  [736] = {.lex_state = 23},
  [737] = {.lex_state = 0, .external_lex_state = 4},
  [738] = {.lex_state = 23},
  [739] = {.lex_state = 241},
  [740] = {.lex_state = 23},
  [741] = {.lex_state = 529},
  [742] = {.lex_state = 23},
  [743] = {.lex_state = 23},
  [744] = {.lex_state = 23},
  [745] = {.lex_state = 23},
  [746] = {.lex_state = 23},
  [747] = {.lex_state = 23},
  [748] = {.lex_state = 23},
  [749] = {.lex_state = 23},
  [750] = {.lex_state = 23},
  [751] = {.lex_state = 23},
  [752] = {.lex_state = 23},
  [753] = {.lex_state = 0},
  [754] = {.lex_state = 23},
  [755] = {.lex_state = 0, .external_lex_state = 4},
  [756] = {.lex_state = 25},
  [757] = {.lex_state = 23},
  [758] = {.lex_state = 23},
  [759] = {.lex_state = 23},
  [760] = {.lex_state = 0, .external_lex_state = 2},
  [761] = {.lex_state = 23},
  [762] = {.lex_state = 23},
  [763] = {.lex_state = 0, .external_lex_state = 2},
  [764] = {.lex_state = 0, .external_lex_state = 2},
  [765] = {.lex_state = 0, .external_lex_state = 2},
  [766] = {.lex_state = 0},
  [767] = {.lex_state = 23},
  [768] = {.lex_state = 529},
  [769] = {.lex_state = 0},
  [770] = {.lex_state = 0},
  [771] = {.lex_state = 43},
  [772] = {.lex_state = 43},
  [773] = {.lex_state = 0, .external_lex_state = 4},
  [774] = {.lex_state = 0, .external_lex_state = 2},
  [775] = {.lex_state = 0, .external_lex_state = 4},
  [776] = {.lex_state = 0, .external_lex_state = 4},
  [777] = {.lex_state = 0, .external_lex_state = 4},
  [778] = {.lex_state = 0, .external_lex_state = 4},
  [779] = {.lex_state = 0, .external_lex_state = 4},
  [780] = {.lex_state = 0, .external_lex_state = 4},
  [781] = {.lex_state = 0, .external_lex_state = 2},
  [782] = {.lex_state = 23},
  [783] = {.lex_state = 0, .external_lex_state = 2},
  [784] = {.lex_state = 0, .external_lex_state = 2},
  [785] = {.lex_state = 0, .external_lex_state = 2},
  [786] = {.lex_state = 0, .external_lex_state = 2},
  [787] = {.lex_state = 0, .external_lex_state = 2},
  [788] = {.lex_state = 0, .external_lex_state = 2},
  [789] = {.lex_state = 0, .external_lex_state = 2},
  [790] = {.lex_state = 0, .external_lex_state = 2},
  [791] = {.lex_state = 23},
  [792] = {.lex_state = 0, .external_lex_state = 2},
  [793] = {.lex_state = 0, .external_lex_state = 2},
  [794] = {.lex_state = 23},
  [795] = {.lex_state = 0},
  [796] = {.lex_state = 0, .external_lex_state = 2},
  [797] = {.lex_state = 0},
  [798] = {.lex_state = 0},
  [799] = {.lex_state = 23},
  [800] = {.lex_state = 0},
  [801] = {.lex_state = 0},
  [802] = {.lex_state = 0},
  [803] = {.lex_state = 23},
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
  },
  [1] = {
    [sym_source_file] = STATE(695),
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
    [sym_string] = STATE(63),
    [aux_sym_source_file_repeat1] = STATE(4),
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
    [sym_string] = STATE(63),
    [aux_sym_source_file_repeat1] = STATE(5),
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
    [sym_string] = STATE(63),
    [aux_sym_source_file_repeat1] = STATE(2),
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
    [sym_string] = STATE(63),
    [aux_sym_source_file_repeat1] = STATE(5),
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
  [5] = {
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
    [sym_string] = STATE(63),
    [aux_sym_source_file_repeat1] = STATE(5),
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
  [6] = {
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
    [sym_string] = STATE(53),
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
    [sym__dedent] = ACTIONS(251),
  },
  [7] = {
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
    [sym_string] = STATE(53),
    [aux_sym_source_file_repeat1] = STATE(7),
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
  [8] = {
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
    [sym_string] = STATE(53),
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
    [sym__dedent] = ACTIONS(355),
  },
  [9] = {
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
    [sym_string] = STATE(53),
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
    [sym__dedent] = ACTIONS(357),
  },
  [10] = {
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
    [sym_string] = STATE(53),
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
    [sym__dedent] = ACTIONS(359),
  },
  [11] = {
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
    [sym_string] = STATE(53),
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
    [sym__dedent] = ACTIONS(361),
  },
  [12] = {
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
    [sym_string] = STATE(53),
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
  [13] = {
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
    [sym_string] = STATE(53),
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
  [14] = {
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
    [sym_string] = STATE(53),
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
    [sym_string] = STATE(53),
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
    [sym__statement] = STATE(8),
    [sym__comment_line] = STATE(8),
    [sym_label_statement] = STATE(8),
    [sym_jump_statement] = STATE(8),
    [sym_call_statement] = STATE(8),
    [sym_return_statement] = STATE(8),
    [sym_pass_statement] = STATE(8),
    [sym_menu_statement] = STATE(8),
    [sym_if_statement] = STATE(8),
    [sym_while_statement] = STATE(8),
    [sym_for_statement] = STATE(8),
    [sym_say_statement] = STATE(8),
    [sym_python_statement] = STATE(8),
    [sym_init_python_statement] = STATE(8),
    [sym_dollar_statement] = STATE(8),
    [sym_define_statement] = STATE(8),
    [sym_default_statement] = STATE(8),
    [sym_image_statement] = STATE(8),
    [sym_scene_statement] = STATE(8),
    [sym_show_statement] = STATE(8),
    [sym_show_screen_statement] = STATE(8),
    [sym_hide_screen_statement] = STATE(8),
    [sym_call_screen_statement] = STATE(8),
    [sym_hide_statement] = STATE(8),
    [sym_with_statement] = STATE(8),
    [sym_play_statement] = STATE(8),
    [sym_queue_statement] = STATE(8),
    [sym_stop_statement] = STATE(8),
    [sym_voice_statement] = STATE(8),
    [sym_screen_statement] = STATE(8),
    [sym_transform_statement] = STATE(8),
    [sym_expression_statement] = STATE(8),
    [sym_unknown_statement] = STATE(8),
    [sym_translate_statement] = STATE(8),
    [sym_style_statement] = STATE(8),
    [sym_camera_statement] = STATE(8),
    [sym_layeredimage_statement] = STATE(8),
    [sym_nvl_statement] = STATE(8),
    [sym_string] = STATE(53),
    [aux_sym_source_file_repeat1] = STATE(8),
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
    STATE(102), 1,
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
    ACTIONS(375), 1,
      anon_sym_elif,
    ACTIONS(377), 1,
      anon_sym_else,
    STATE(206), 1,
      sym_else_clause,
    STATE(19), 2,
      sym_elif_clause,
      aux_sym_if_statement_repeat1,
    ACTIONS(373), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(371), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
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
    STATE(229), 1,
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
  [162] = 6,
    ACTIONS(367), 1,
      anon_sym_elif,
    ACTIONS(369), 1,
      anon_sym_else,
    STATE(79), 1,
      sym_else_clause,
    STATE(17), 2,
      sym_elif_clause,
      aux_sym_if_statement_repeat1,
    ACTIONS(373), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(371), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
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
      sym__newline,
    ACTIONS(389), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(391), 33,
      sym_identifier,
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
  [360] = 2,
    ACTIONS(395), 6,
      sym__newline,
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
  [404] = 3,
    ACTIONS(403), 1,
      sym__indent,
    ACTIONS(399), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(401), 33,
      sym_identifier,
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
      sym__newline,
    ACTIONS(389), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(391), 33,
      sym_identifier,
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
      sym__indent,
    ACTIONS(399), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(401), 33,
      sym_identifier,
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
  [634] = 2,
    ACTIONS(395), 6,
      sym__newline,
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
  [678] = 2,
    ACTIONS(417), 7,
      sym__newline,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_COLON,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(419), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
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
    ACTIONS(423), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(421), 33,
      sym_identifier,
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
  [764] = 2,
    ACTIONS(423), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(421), 33,
      sym_identifier,
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
  [850] = 2,
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
  [893] = 3,
    ACTIONS(429), 1,
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
  [937] = 3,
    ACTIONS(431), 1,
      sym__newline,
    ACTIONS(389), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(391), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
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
    ACTIONS(437), 1,
      sym__newline,
    ACTIONS(435), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(433), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
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
    ACTIONS(439), 1,
      sym__newline,
    ACTIONS(435), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(433), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
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
    ACTIONS(445), 1,
      sym__indent,
    ACTIONS(443), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(441), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
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
    ACTIONS(451), 1,
      sym__newline,
    ACTIONS(449), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(447), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
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
    ACTIONS(457), 1,
      sym__newline,
    ACTIONS(455), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(453), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
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
    ACTIONS(463), 1,
      sym__indent,
    ACTIONS(459), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(461), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
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
    ACTIONS(465), 1,
      sym__indent,
    ACTIONS(459), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(461), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1289] = 4,
    ACTIONS(471), 1,
      anon_sym_with,
    ACTIONS(474), 1,
      sym__newline,
    ACTIONS(469), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(467), 30,
      sym_identifier,
      sym_expression,
      anon_sym_label,
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
  [1335] = 3,
    ACTIONS(476), 1,
      sym__newline,
    ACTIONS(455), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(453), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1379] = 2,
    ACTIONS(417), 6,
      sym__newline,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(419), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
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
    ACTIONS(482), 1,
      sym__newline,
    ACTIONS(478), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(480), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
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
    ACTIONS(484), 1,
      sym__newline,
    ACTIONS(389), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(391), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1509] = 2,
    ACTIONS(395), 6,
      sym__newline,
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
  [1551] = 3,
    ACTIONS(486), 1,
      sym__indent,
    ACTIONS(399), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(401), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1595] = 3,
    ACTIONS(488), 1,
      sym__newline,
    ACTIONS(478), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(480), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1639] = 4,
    ACTIONS(494), 1,
      anon_sym_with,
    ACTIONS(497), 1,
      sym__newline,
    ACTIONS(492), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(490), 30,
      sym_identifier,
      sym_expression,
      anon_sym_label,
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
  [1685] = 3,
    ACTIONS(503), 1,
      sym__newline,
    ACTIONS(499), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(501), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
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
    ACTIONS(505), 1,
      sym__indent,
    ACTIONS(443), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(441), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
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
    ACTIONS(507), 1,
      sym__newline,
    ACTIONS(499), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(501), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
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
    ACTIONS(509), 1,
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
  [1861] = 2,
    ACTIONS(395), 6,
      sym__newline,
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
  [1903] = 3,
    ACTIONS(511), 1,
      sym__indent,
    ACTIONS(399), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(401), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [1947] = 4,
    ACTIONS(513), 1,
      anon_sym_with,
    ACTIONS(516), 1,
      sym__newline,
    ACTIONS(469), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(467), 30,
      sym_identifier,
      sym_expression,
      anon_sym_label,
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
  [1993] = 4,
    ACTIONS(522), 1,
      anon_sym_with,
    ACTIONS(525), 1,
      sym__newline,
    ACTIONS(520), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(518), 30,
      sym_identifier,
      sym_expression,
      anon_sym_label,
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
  [2039] = 4,
    ACTIONS(527), 1,
      anon_sym_with,
    ACTIONS(530), 1,
      sym__newline,
    ACTIONS(520), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(518), 30,
      sym_identifier,
      sym_expression,
      anon_sym_label,
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
  [2085] = 4,
    ACTIONS(532), 1,
      anon_sym_with,
    ACTIONS(535), 1,
      sym__newline,
    ACTIONS(492), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(490), 30,
      sym_identifier,
      sym_expression,
      anon_sym_label,
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
  [2131] = 3,
    ACTIONS(537), 1,
      sym__newline,
    ACTIONS(449), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(447), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2175] = 2,
    ACTIONS(541), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(539), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2216] = 2,
    ACTIONS(543), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(545), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2257] = 2,
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
  [2298] = 2,
    ACTIONS(551), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(553), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2339] = 2,
    ACTIONS(555), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(557), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2380] = 2,
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
  [2421] = 2,
    ACTIONS(563), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(565), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2462] = 2,
    ACTIONS(567), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(569), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2503] = 2,
    ACTIONS(571), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(573), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2544] = 2,
    ACTIONS(575), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(577), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2585] = 2,
    ACTIONS(579), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(581), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2626] = 2,
    ACTIONS(583), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(585), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2667] = 2,
    ACTIONS(587), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(589), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2708] = 2,
    ACTIONS(591), 5,
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
  [2749] = 2,
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
  [2790] = 2,
    ACTIONS(595), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(597), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2831] = 2,
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
  [2872] = 2,
    ACTIONS(603), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(605), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2913] = 2,
    ACTIONS(607), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(609), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2954] = 2,
    ACTIONS(611), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(613), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [2995] = 2,
    ACTIONS(615), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(617), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3036] = 2,
    ACTIONS(619), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(621), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3077] = 2,
    ACTIONS(623), 5,
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
  [3118] = 2,
    ACTIONS(627), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(629), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3159] = 2,
    ACTIONS(631), 5,
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
  [3200] = 2,
    ACTIONS(635), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(637), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3241] = 2,
    ACTIONS(639), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(641), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3282] = 2,
    ACTIONS(643), 5,
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
  [3323] = 2,
    ACTIONS(541), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(539), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3364] = 2,
    ACTIONS(647), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(649), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3405] = 2,
    ACTIONS(651), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(653), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3446] = 2,
    ACTIONS(655), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(657), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3487] = 2,
    ACTIONS(659), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(661), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3528] = 2,
    ACTIONS(663), 5,
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
  [3569] = 2,
    ACTIONS(667), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(669), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3610] = 2,
    ACTIONS(671), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(673), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3651] = 2,
    ACTIONS(675), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(677), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3692] = 2,
    ACTIONS(679), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(681), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3733] = 2,
    ACTIONS(683), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(685), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3774] = 2,
    ACTIONS(687), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(689), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3815] = 2,
    ACTIONS(691), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(693), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3856] = 2,
    ACTIONS(695), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(697), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3897] = 2,
    ACTIONS(699), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(701), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3938] = 2,
    ACTIONS(703), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(705), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [3979] = 2,
    ACTIONS(707), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(709), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4020] = 2,
    ACTIONS(711), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(713), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4061] = 2,
    ACTIONS(715), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(717), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4102] = 2,
    ACTIONS(719), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(721), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4143] = 2,
    ACTIONS(723), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(725), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4184] = 2,
    ACTIONS(727), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(729), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4225] = 2,
    ACTIONS(731), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(733), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4266] = 2,
    ACTIONS(735), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(737), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4307] = 2,
    ACTIONS(739), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(741), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4348] = 2,
    ACTIONS(743), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(745), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4389] = 2,
    ACTIONS(747), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(749), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4430] = 2,
    ACTIONS(751), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(753), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4471] = 2,
    ACTIONS(755), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(757), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4512] = 2,
    ACTIONS(759), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(761), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4553] = 2,
    ACTIONS(423), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(421), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4594] = 2,
    ACTIONS(763), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(765), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4635] = 2,
    ACTIONS(767), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(769), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4676] = 2,
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
  [4717] = 2,
    ACTIONS(775), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(777), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4758] = 2,
    ACTIONS(779), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(781), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4799] = 2,
    ACTIONS(783), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(785), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4840] = 2,
    ACTIONS(787), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(789), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4881] = 2,
    ACTIONS(791), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(793), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4922] = 2,
    ACTIONS(795), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(797), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [4963] = 2,
    ACTIONS(799), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(801), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5004] = 2,
    ACTIONS(803), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(805), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [5045] = 2,
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
  [5086] = 2,
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
  [5127] = 2,
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
  [5168] = 2,
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
  [5209] = 2,
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
  [5250] = 2,
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
  [5291] = 2,
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
  [5332] = 2,
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
  [5373] = 2,
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
  [5414] = 2,
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
  [5455] = 2,
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
  [5496] = 2,
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
  [5537] = 2,
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
  [5578] = 2,
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
  [5619] = 2,
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
  [5660] = 2,
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
  [5701] = 2,
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
  [5742] = 2,
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
  [5783] = 2,
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
  [5824] = 2,
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
  [5865] = 2,
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
  [5906] = 2,
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
  [5947] = 2,
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
  [5988] = 2,
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
  [6029] = 2,
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
  [6070] = 2,
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
  [6111] = 2,
    ACTIONS(913), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(911), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6152] = 2,
    ACTIONS(917), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(915), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6193] = 2,
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
  [6234] = 2,
    ACTIONS(651), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(653), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6275] = 2,
    ACTIONS(683), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(685), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6316] = 2,
    ACTIONS(787), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(789), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6357] = 2,
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
  [6398] = 2,
    ACTIONS(921), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(919), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6439] = 2,
    ACTIONS(925), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(923), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6480] = 2,
    ACTIONS(929), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(927), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6521] = 2,
    ACTIONS(933), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(931), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6562] = 2,
    ACTIONS(921), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(919), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6603] = 2,
    ACTIONS(937), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(935), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6644] = 2,
    ACTIONS(925), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(923), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6685] = 2,
    ACTIONS(941), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(939), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6726] = 2,
    ACTIONS(945), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(943), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6767] = 2,
    ACTIONS(949), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(947), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6808] = 2,
    ACTIONS(953), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(951), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6849] = 2,
    ACTIONS(957), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(955), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6890] = 2,
    ACTIONS(961), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(959), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6931] = 2,
    ACTIONS(965), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(963), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [6972] = 2,
    ACTIONS(969), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(967), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7013] = 2,
    ACTIONS(973), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(971), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7054] = 2,
    ACTIONS(977), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(975), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7095] = 2,
    ACTIONS(981), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(979), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7136] = 2,
    ACTIONS(985), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(983), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7177] = 2,
    ACTIONS(989), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(987), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7218] = 2,
    ACTIONS(993), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(991), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7259] = 2,
    ACTIONS(997), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(995), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7300] = 2,
    ACTIONS(929), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(927), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7341] = 2,
    ACTIONS(1001), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(999), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7382] = 2,
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
  [7423] = 2,
    ACTIONS(543), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(545), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7464] = 2,
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
  [7505] = 2,
    ACTIONS(551), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(553), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7546] = 2,
    ACTIONS(555), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(557), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7587] = 2,
    ACTIONS(933), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(931), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7628] = 2,
    ACTIONS(563), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(565), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7669] = 2,
    ACTIONS(567), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(569), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7710] = 2,
    ACTIONS(571), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(573), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7751] = 2,
    ACTIONS(575), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(577), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7792] = 2,
    ACTIONS(579), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(581), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7833] = 2,
    ACTIONS(583), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(585), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7874] = 2,
    ACTIONS(587), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(589), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [7915] = 2,
    ACTIONS(591), 5,
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
  [7956] = 2,
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
  [7997] = 2,
    ACTIONS(595), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(597), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8038] = 2,
    ACTIONS(1005), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1003), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8079] = 2,
    ACTIONS(603), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(605), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8120] = 2,
    ACTIONS(607), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(609), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8161] = 2,
    ACTIONS(611), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(613), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8202] = 2,
    ACTIONS(615), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(617), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8243] = 2,
    ACTIONS(937), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(935), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8284] = 2,
    ACTIONS(913), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(911), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8325] = 2,
    ACTIONS(619), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(621), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8366] = 2,
    ACTIONS(623), 5,
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
  [8407] = 2,
    ACTIONS(627), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(629), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8448] = 2,
    ACTIONS(631), 5,
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
  [8489] = 2,
    ACTIONS(635), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(637), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8530] = 2,
    ACTIONS(639), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(641), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8571] = 2,
    ACTIONS(643), 5,
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
  [8612] = 2,
    ACTIONS(647), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(649), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8653] = 2,
    ACTIONS(655), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(657), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8694] = 2,
    ACTIONS(659), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(661), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8735] = 2,
    ACTIONS(663), 5,
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
  [8776] = 2,
    ACTIONS(667), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(669), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8817] = 2,
    ACTIONS(671), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(673), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8858] = 2,
    ACTIONS(675), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(677), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8899] = 2,
    ACTIONS(679), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(681), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8940] = 2,
    ACTIONS(941), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(939), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [8981] = 2,
    ACTIONS(687), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(689), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9022] = 2,
    ACTIONS(691), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(693), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9063] = 2,
    ACTIONS(695), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(697), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9104] = 2,
    ACTIONS(699), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(701), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9145] = 2,
    ACTIONS(703), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(705), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9186] = 2,
    ACTIONS(707), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(709), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9227] = 2,
    ACTIONS(711), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(713), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9268] = 2,
    ACTIONS(715), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(717), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9309] = 2,
    ACTIONS(719), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(721), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9350] = 2,
    ACTIONS(723), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(725), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9391] = 2,
    ACTIONS(727), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(729), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9432] = 2,
    ACTIONS(731), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(733), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9473] = 2,
    ACTIONS(735), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(737), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9514] = 2,
    ACTIONS(739), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(741), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9555] = 2,
    ACTIONS(743), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(745), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9596] = 2,
    ACTIONS(747), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(749), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9637] = 2,
    ACTIONS(751), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(753), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9678] = 2,
    ACTIONS(755), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(757), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9719] = 2,
    ACTIONS(759), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(761), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9760] = 2,
    ACTIONS(945), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(943), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9801] = 2,
    ACTIONS(763), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(765), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9842] = 2,
    ACTIONS(767), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(769), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9883] = 2,
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
  [9924] = 2,
    ACTIONS(775), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(777), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [9965] = 2,
    ACTIONS(779), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(781), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10006] = 2,
    ACTIONS(783), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(785), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10047] = 2,
    ACTIONS(949), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(947), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10088] = 2,
    ACTIONS(791), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(793), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10129] = 2,
    ACTIONS(795), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(797), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10170] = 2,
    ACTIONS(799), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(801), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10211] = 2,
    ACTIONS(803), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(805), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [10252] = 2,
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
  [10293] = 2,
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
  [10334] = 2,
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
  [10375] = 2,
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
  [10416] = 2,
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
  [10457] = 2,
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
  [10498] = 2,
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
  [10539] = 2,
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
  [10580] = 2,
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
  [10621] = 2,
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
  [10662] = 2,
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
  [10703] = 2,
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
  [10744] = 2,
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
  [10785] = 2,
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
  [10826] = 2,
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
  [10867] = 2,
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
  [10908] = 2,
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
  [10949] = 2,
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
  [10990] = 2,
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
  [11031] = 2,
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
  [11072] = 2,
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
  [11113] = 2,
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
  [11154] = 2,
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
  [11195] = 2,
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
  [11236] = 2,
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
  [11277] = 2,
    ACTIONS(953), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(951), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11318] = 2,
    ACTIONS(957), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(955), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11359] = 2,
    ACTIONS(917), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(915), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11400] = 2,
    ACTIONS(961), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(959), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11441] = 2,
    ACTIONS(423), 5,
      sym__dedent,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(421), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11482] = 2,
    ACTIONS(965), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(963), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11523] = 2,
    ACTIONS(969), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(967), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11564] = 2,
    ACTIONS(973), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(971), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11605] = 2,
    ACTIONS(977), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(975), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11646] = 2,
    ACTIONS(981), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(979), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11687] = 2,
    ACTIONS(985), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(983), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11728] = 2,
    ACTIONS(989), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(987), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11769] = 2,
    ACTIONS(993), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(991), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11810] = 2,
    ACTIONS(997), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(995), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11851] = 2,
    ACTIONS(1001), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(999), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11892] = 2,
    ACTIONS(1005), 5,
      ts_builtin_sym_end,
      sym_comment,
      anon_sym_DOLLAR,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1003), 31,
      sym_identifier,
      sym_expression,
      anon_sym_label,
      anon_sym_hide,
      anon_sym_jump,
      anon_sym_call,
      anon_sym_return,
      anon_sym_pass,
      anon_sym_menu,
      anon_sym_if,
      anon_sym_while,
      anon_sym_for,
      anon_sym_with,
      anon_sym_python,
      anon_sym_init,
      anon_sym_define,
      anon_sym_default,
      anon_sym_image,
      anon_sym_scene,
      anon_sym_show,
      anon_sym_screen,
      anon_sym_play,
      anon_sym_queue,
      anon_sym_stop,
      anon_sym_voice,
      anon_sym_transform,
      anon_sym_translate,
      anon_sym_style,
      anon_sym_camera,
      anon_sym_layeredimage,
      anon_sym_nvl,
  [11933] = 9,
    ACTIONS(1007), 1,
      sym_identifier,
    ACTIONS(1010), 1,
      sym_comment,
    ACTIONS(1013), 1,
      anon_sym_with,
    ACTIONS(1025), 1,
      sym__dedent,
    STATE(796), 1,
      sym_string,
    ACTIONS(1019), 2,
      anon_sym_pause,
      anon_sym_time,
    ACTIONS(1022), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1016), 5,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
    STATE(303), 8,
      sym__comment_line,
      sym__atl_statement,
      sym_atl_transform_property,
      sym_atl_displayable,
      sym_atl_with_statement,
      sym_atl_block_statement,
      sym_atl_time_statement,
      aux_sym__atl_block_repeat1,
  [11974] = 9,
    ACTIONS(1027), 1,
      sym_identifier,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1031), 1,
      anon_sym_with,
    ACTIONS(1037), 1,
      sym__dedent,
    STATE(796), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1035), 2,
      anon_sym_pause,
      anon_sym_time,
    ACTIONS(1033), 5,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
    STATE(303), 8,
      sym__comment_line,
      sym__atl_statement,
      sym_atl_transform_property,
      sym_atl_displayable,
      sym_atl_with_statement,
      sym_atl_block_statement,
      sym_atl_time_statement,
      aux_sym__atl_block_repeat1,
  [12015] = 9,
    ACTIONS(1027), 1,
      sym_identifier,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1031), 1,
      anon_sym_with,
    ACTIONS(1039), 1,
      sym__dedent,
    STATE(796), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1035), 2,
      anon_sym_pause,
      anon_sym_time,
    ACTIONS(1033), 5,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
    STATE(303), 8,
      sym__comment_line,
      sym__atl_statement,
      sym_atl_transform_property,
      sym_atl_displayable,
      sym_atl_with_statement,
      sym_atl_block_statement,
      sym_atl_time_statement,
      aux_sym__atl_block_repeat1,
  [12056] = 9,
    ACTIONS(1027), 1,
      sym_identifier,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1031), 1,
      anon_sym_with,
    ACTIONS(1041), 1,
      sym__dedent,
    STATE(796), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1035), 2,
      anon_sym_pause,
      anon_sym_time,
    ACTIONS(1033), 5,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
    STATE(303), 8,
      sym__comment_line,
      sym__atl_statement,
      sym_atl_transform_property,
      sym_atl_displayable,
      sym_atl_with_statement,
      sym_atl_block_statement,
      sym_atl_time_statement,
      aux_sym__atl_block_repeat1,
  [12097] = 8,
    ACTIONS(1027), 1,
      sym_identifier,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1031), 1,
      anon_sym_with,
    STATE(796), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1035), 2,
      anon_sym_pause,
      anon_sym_time,
    ACTIONS(1033), 5,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
    STATE(304), 8,
      sym__comment_line,
      sym__atl_statement,
      sym_atl_transform_property,
      sym_atl_displayable,
      sym_atl_with_statement,
      sym_atl_block_statement,
      sym_atl_time_statement,
      aux_sym__atl_block_repeat1,
  [12135] = 8,
    ACTIONS(1027), 1,
      sym_identifier,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1031), 1,
      anon_sym_with,
    STATE(796), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1035), 2,
      anon_sym_pause,
      anon_sym_time,
    ACTIONS(1033), 5,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
    STATE(306), 8,
      sym__comment_line,
      sym__atl_statement,
      sym_atl_transform_property,
      sym_atl_displayable,
      sym_atl_with_statement,
      sym_atl_block_statement,
      sym_atl_time_statement,
      aux_sym__atl_block_repeat1,
  [12173] = 8,
    ACTIONS(1027), 1,
      sym_identifier,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1031), 1,
      anon_sym_with,
    STATE(796), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1035), 2,
      anon_sym_pause,
      anon_sym_time,
    ACTIONS(1033), 5,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
    STATE(305), 8,
      sym__comment_line,
      sym__atl_statement,
      sym_atl_transform_property,
      sym_atl_displayable,
      sym_atl_with_statement,
      sym_atl_block_statement,
      sym_atl_time_statement,
      aux_sym__atl_block_repeat1,
  [12211] = 2,
    ACTIONS(913), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(911), 15,
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
  [12235] = 2,
    ACTIONS(1045), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1043), 9,
      sym_identifier,
      anon_sym_with,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
      anon_sym_pause,
      anon_sym_time,
  [12253] = 2,
    ACTIONS(1049), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1047), 9,
      sym_identifier,
      anon_sym_with,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
      anon_sym_pause,
      anon_sym_time,
  [12271] = 2,
    ACTIONS(1053), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1051), 9,
      sym_identifier,
      anon_sym_with,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
      anon_sym_pause,
      anon_sym_time,
  [12289] = 2,
    ACTIONS(1057), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1055), 9,
      sym_identifier,
      anon_sym_with,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
      anon_sym_pause,
      anon_sym_time,
  [12307] = 2,
    ACTIONS(1061), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1059), 9,
      sym_identifier,
      anon_sym_with,
      anon_sym_parallel,
      anon_sym_contains,
      anon_sym_choice,
      anon_sym_block,
      anon_sym_repeat,
      anon_sym_pause,
      anon_sym_time,
  [12325] = 7,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1063), 1,
      sym_identifier,
    ACTIONS(1065), 1,
      anon_sym_set,
    ACTIONS(1067), 1,
      sym__dedent,
    STATE(438), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(319), 5,
      sym__comment_line,
      sym_menu_caption,
      sym_menu_set,
      sym_menu_choice,
      aux_sym_menu_statement_repeat1,
  [12352] = 7,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1063), 1,
      sym_identifier,
    ACTIONS(1065), 1,
      anon_sym_set,
    ACTIONS(1069), 1,
      sym__dedent,
    STATE(438), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(319), 5,
      sym__comment_line,
      sym_menu_caption,
      sym_menu_set,
      sym_menu_choice,
      aux_sym_menu_statement_repeat1,
  [12379] = 7,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1063), 1,
      sym_identifier,
    ACTIONS(1065), 1,
      anon_sym_set,
    ACTIONS(1071), 1,
      sym__dedent,
    STATE(438), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(319), 5,
      sym__comment_line,
      sym_menu_caption,
      sym_menu_set,
      sym_menu_choice,
      aux_sym_menu_statement_repeat1,
  [12406] = 7,
    ACTIONS(1073), 1,
      sym_identifier,
    ACTIONS(1076), 1,
      sym_comment,
    ACTIONS(1079), 1,
      anon_sym_set,
    ACTIONS(1085), 1,
      sym__dedent,
    STATE(438), 1,
      sym_string,
    ACTIONS(1082), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(319), 5,
      sym__comment_line,
      sym_menu_caption,
      sym_menu_set,
      sym_menu_choice,
      aux_sym_menu_statement_repeat1,
  [12433] = 7,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1063), 1,
      sym_identifier,
    ACTIONS(1065), 1,
      anon_sym_set,
    ACTIONS(1087), 1,
      sym__dedent,
    STATE(438), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(319), 5,
      sym__comment_line,
      sym_menu_caption,
      sym_menu_set,
      sym_menu_choice,
      aux_sym_menu_statement_repeat1,
  [12460] = 5,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1089), 1,
      sym_identifier,
    ACTIONS(1093), 1,
      sym__dedent,
    STATE(326), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1091), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [12482] = 11,
    ACTIONS(1095), 1,
      sym_identifier,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1099), 1,
      sym__screen_string,
    ACTIONS(1101), 1,
      sym__screen_value,
    ACTIONS(1103), 1,
      sym__newline,
    STATE(352), 1,
      sym__screen_line_end,
    STATE(363), 1,
      aux_sym_screen_language_statement_repeat1,
    STATE(365), 1,
      aux_sym_screen_language_statement_repeat2,
    STATE(406), 1,
      sym__positional_property,
    STATE(480), 1,
      sym__keyword_property,
    STATE(582), 1,
      sym__block_colon,
  [12516] = 6,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1063), 1,
      sym_identifier,
    ACTIONS(1065), 1,
      anon_sym_set,
    STATE(438), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(317), 5,
      sym__comment_line,
      sym_menu_caption,
      sym_menu_set,
      sym_menu_choice,
      aux_sym_menu_statement_repeat1,
  [12540] = 6,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1063), 1,
      sym_identifier,
    ACTIONS(1065), 1,
      anon_sym_set,
    STATE(438), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(316), 5,
      sym__comment_line,
      sym_menu_caption,
      sym_menu_set,
      sym_menu_choice,
      aux_sym_menu_statement_repeat1,
  [12564] = 11,
    ACTIONS(1095), 1,
      sym_identifier,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1099), 1,
      sym__screen_string,
    ACTIONS(1101), 1,
      sym__screen_value,
    ACTIONS(1105), 1,
      sym__newline,
    STATE(322), 1,
      aux_sym_screen_language_statement_repeat1,
    STATE(347), 1,
      sym__screen_line_end,
    STATE(357), 1,
      aux_sym_screen_language_statement_repeat2,
    STATE(406), 1,
      sym__positional_property,
    STATE(480), 1,
      sym__keyword_property,
    STATE(582), 1,
      sym__block_colon,
  [12598] = 5,
    ACTIONS(1107), 1,
      sym_identifier,
    ACTIONS(1110), 1,
      sym_comment,
    ACTIONS(1116), 1,
      sym__dedent,
    STATE(326), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1113), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [12620] = 5,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1089), 1,
      sym_identifier,
    ACTIONS(1118), 1,
      sym__dedent,
    STATE(326), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1091), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [12642] = 5,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1089), 1,
      sym_identifier,
    ACTIONS(1120), 1,
      sym__dedent,
    STATE(326), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1091), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [12664] = 5,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1089), 1,
      sym_identifier,
    ACTIONS(1122), 1,
      sym__dedent,
    STATE(326), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1091), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [12686] = 6,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1063), 1,
      sym_identifier,
    ACTIONS(1065), 1,
      anon_sym_set,
    STATE(438), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(320), 5,
      sym__comment_line,
      sym_menu_caption,
      sym_menu_set,
      sym_menu_choice,
      aux_sym_menu_statement_repeat1,
  [12710] = 5,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1089), 1,
      sym_identifier,
    ACTIONS(1124), 1,
      sym__dedent,
    STATE(326), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1091), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [12732] = 6,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1063), 1,
      sym_identifier,
    ACTIONS(1065), 1,
      anon_sym_set,
    STATE(438), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(318), 5,
      sym__comment_line,
      sym_menu_caption,
      sym_menu_set,
      sym_menu_choice,
      aux_sym_menu_statement_repeat1,
  [12756] = 4,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1089), 1,
      sym_identifier,
    STATE(327), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1091), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [12775] = 4,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1089), 1,
      sym_identifier,
    STATE(329), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1091), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [12794] = 9,
    ACTIONS(1126), 1,
      sym_identifier,
    ACTIONS(1128), 1,
      sym_expression,
    ACTIONS(1130), 1,
      anon_sym_COLON,
    ACTIONS(1132), 1,
      sym__newline,
    STATE(45), 1,
      sym_string,
    STATE(49), 1,
      sym__block_colon,
    STATE(171), 1,
      sym__block,
    STATE(358), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(249), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [12823] = 9,
    ACTIONS(1130), 1,
      anon_sym_COLON,
    ACTIONS(1134), 1,
      sym_identifier,
    ACTIONS(1136), 1,
      sym_expression,
    ACTIONS(1138), 1,
      sym__newline,
    STATE(49), 1,
      sym__block_colon,
    STATE(61), 1,
      sym_string,
    STATE(163), 1,
      sym__block,
    STATE(335), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(249), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [12852] = 4,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1089), 1,
      sym_identifier,
    STATE(321), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1091), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [12871] = 9,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1126), 1,
      sym_identifier,
    ACTIONS(1140), 1,
      sym_expression,
    ACTIONS(1142), 1,
      sym__newline,
    STATE(37), 1,
      sym__block_colon,
    STATE(60), 1,
      sym_string,
    STATE(197), 1,
      sym__block,
    STATE(358), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [12900] = 9,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1144), 1,
      sym_identifier,
    ACTIONS(1146), 1,
      sym_expression,
    ACTIONS(1148), 1,
      sym__newline,
    STATE(37), 1,
      sym__block_colon,
    STATE(62), 1,
      sym_string,
    STATE(70), 1,
      sym__block,
    STATE(338), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [12929] = 4,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1089), 1,
      sym_identifier,
    STATE(328), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1091), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [12948] = 4,
    ACTIONS(1029), 1,
      sym_comment,
    ACTIONS(1089), 1,
      sym_identifier,
    STATE(331), 3,
      sym__comment_line,
      sym_screen_language_statement,
      aux_sym_screen_statement_repeat1,
    ACTIONS(1091), 5,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [12967] = 9,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1150), 1,
      sym_identifier,
    ACTIONS(1152), 1,
      anon_sym_with,
    ACTIONS(1154), 1,
      anon_sym_at,
    ACTIONS(1156), 1,
      anon_sym_as,
    ACTIONS(1158), 1,
      sym__newline,
    STATE(300), 1,
      sym__atl_block,
    STATE(364), 1,
      aux_sym_menu_caption_repeat1,
    STATE(763), 1,
      sym__block_colon,
  [12995] = 9,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1150), 1,
      sym_identifier,
    ACTIONS(1160), 1,
      anon_sym_with,
    ACTIONS(1162), 1,
      anon_sym_at,
    ACTIONS(1164), 1,
      anon_sym_as,
    ACTIONS(1166), 1,
      sym__newline,
    STATE(189), 1,
      sym__atl_block,
    STATE(364), 1,
      aux_sym_menu_caption_repeat1,
    STATE(784), 1,
      sym__block_colon,
  [13023] = 8,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1168), 1,
      sym_identifier,
    ACTIONS(1170), 1,
      anon_sym_with,
    ACTIONS(1172), 1,
      anon_sym_at,
    ACTIONS(1174), 1,
      sym__newline,
    STATE(160), 1,
      sym__atl_block,
    STATE(353), 1,
      aux_sym_menu_caption_repeat1,
    STATE(763), 1,
      sym__block_colon,
  [13048] = 2,
    ACTIONS(1178), 2,
      sym__dedent,
      sym_comment,
    ACTIONS(1176), 6,
      sym_identifier,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [13061] = 8,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1180), 1,
      sym_identifier,
    ACTIONS(1182), 1,
      anon_sym_with,
    ACTIONS(1184), 1,
      anon_sym_at,
    ACTIONS(1186), 1,
      sym__newline,
    STATE(167), 1,
      sym__atl_block,
    STATE(350), 1,
      aux_sym_menu_caption_repeat1,
    STATE(784), 1,
      sym__block_colon,
  [13086] = 2,
    ACTIONS(1190), 2,
      sym__dedent,
      sym_comment,
    ACTIONS(1188), 6,
      sym_identifier,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [13099] = 2,
    ACTIONS(1194), 2,
      sym__dedent,
      sym_comment,
    ACTIONS(1192), 6,
      sym_identifier,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [13112] = 2,
    ACTIONS(1198), 2,
      sym__dedent,
      sym_comment,
    ACTIONS(1196), 6,
      sym_identifier,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [13125] = 8,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1150), 1,
      sym_identifier,
    ACTIONS(1200), 1,
      anon_sym_with,
    ACTIONS(1202), 1,
      anon_sym_at,
    ACTIONS(1204), 1,
      sym__newline,
    STATE(187), 1,
      sym__atl_block,
    STATE(364), 1,
      aux_sym_menu_caption_repeat1,
    STATE(784), 1,
      sym__block_colon,
  [13150] = 2,
    ACTIONS(1208), 2,
      sym__dedent,
      sym_comment,
    ACTIONS(1206), 6,
      sym_identifier,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [13163] = 2,
    ACTIONS(1194), 2,
      sym__dedent,
      sym_comment,
    ACTIONS(1192), 6,
      sym_identifier,
      anon_sym_if,
      anon_sym_elif,
      anon_sym_while,
      anon_sym_for,
      anon_sym_showif,
  [13176] = 8,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1150), 1,
      sym_identifier,
    ACTIONS(1210), 1,
      anon_sym_with,
    ACTIONS(1212), 1,
      anon_sym_at,
    ACTIONS(1214), 1,
      sym__newline,
    STATE(298), 1,
      sym__atl_block,
    STATE(364), 1,
      aux_sym_menu_caption_repeat1,
    STATE(763), 1,
      sym__block_colon,
  [13201] = 5,
    ACTIONS(1216), 1,
      anon_sym_sustain,
    ACTIONS(1218), 1,
      sym__audio_name,
    ACTIONS(1220), 1,
      sym__audio_list,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(601), 2,
      sym__audio_file,
      sym_string,
  [13219] = 3,
    ACTIONS(1222), 1,
      sym__indent,
    ACTIONS(401), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(399), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [13233] = 2,
    ACTIONS(397), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(395), 5,
      sym__newline,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [13245] = 7,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1224), 1,
      sym_identifier,
    ACTIONS(1226), 1,
      sym__newline,
    STATE(348), 1,
      sym__screen_line_end,
    STATE(413), 1,
      aux_sym_screen_language_statement_repeat2,
    STATE(480), 1,
      sym__keyword_property,
    STATE(582), 1,
      sym__block_colon,
  [13267] = 4,
    ACTIONS(1228), 1,
      sym_identifier,
    ACTIONS(1231), 1,
      sym_expression,
    STATE(358), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(1233), 4,
      sym__newline,
      anon_sym_COLON,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [13283] = 5,
    ACTIONS(1240), 1,
      sym__screen_string,
    ACTIONS(1243), 1,
      sym__screen_value_list,
    STATE(491), 1,
      sym__positional_property,
    ACTIONS(1235), 2,
      sym_identifier,
      sym__screen_value,
    ACTIONS(1238), 2,
      sym__newline,
      anon_sym_COLON,
  [13301] = 6,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1247), 1,
      anon_sym_LPAREN,
    STATE(37), 1,
      sym__block_colon,
    STATE(230), 1,
      sym__block,
    STATE(405), 1,
      sym_parameter_list,
    ACTIONS(1245), 2,
      anon_sym_hide,
      anon_sym_global,
  [13321] = 5,
    ACTIONS(1249), 1,
      anon_sym_sustain,
    ACTIONS(1251), 1,
      sym__audio_name,
    ACTIONS(1253), 1,
      sym__audio_list,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(628), 2,
      sym__audio_file,
      sym_string,
  [13339] = 6,
    ACTIONS(1130), 1,
      anon_sym_COLON,
    ACTIONS(1247), 1,
      anon_sym_LPAREN,
    STATE(49), 1,
      sym__block_colon,
    STATE(175), 1,
      sym__block,
    STATE(416), 1,
      sym_parameter_list,
    ACTIONS(1255), 2,
      anon_sym_hide,
      anon_sym_global,
  [13359] = 5,
    ACTIONS(1262), 1,
      sym__screen_string,
    STATE(363), 1,
      aux_sym_screen_language_statement_repeat1,
    STATE(406), 1,
      sym__positional_property,
    ACTIONS(1257), 2,
      sym_identifier,
      sym__screen_value,
    ACTIONS(1260), 2,
      sym__newline,
      anon_sym_COLON,
  [13377] = 4,
    ACTIONS(1265), 1,
      sym_identifier,
    STATE(364), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(1233), 2,
      sym__newline,
      anon_sym_COLON,
    ACTIONS(1231), 3,
      anon_sym_with,
      anon_sym_at,
      anon_sym_as,
  [13393] = 7,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1224), 1,
      sym_identifier,
    ACTIONS(1268), 1,
      sym__newline,
    STATE(351), 1,
      sym__screen_line_end,
    STATE(413), 1,
      aux_sym_screen_language_statement_repeat2,
    STATE(480), 1,
      sym__keyword_property,
    STATE(582), 1,
      sym__block_colon,
  [13415] = 3,
    ACTIONS(1270), 1,
      sym_comment,
    ACTIONS(407), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(405), 4,
      sym__newline,
      sym__dedent,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [13429] = 3,
    ACTIONS(1272), 1,
      sym__newline,
    ACTIONS(391), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(389), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [13443] = 6,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1274), 1,
      anon_sym_with,
    ACTIONS(1276), 1,
      anon_sym_as,
    ACTIONS(1278), 1,
      sym__newline,
    STATE(117), 1,
      sym__atl_block,
    STATE(763), 1,
      sym__block_colon,
  [13462] = 2,
    ACTIONS(1280), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(1282), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [13473] = 2,
    ACTIONS(1284), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(1286), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [13484] = 3,
    ACTIONS(1288), 2,
      sym__audio_name,
      sym__audio_list,
    ACTIONS(1290), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    STATE(546), 2,
      sym__audio_file,
      sym_string,
  [13497] = 3,
    ACTIONS(1292), 1,
      sym_identifier,
    STATE(372), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(1233), 4,
      anon_sym_COLON,
      anon_sym_EQ,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [13510] = 4,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1295), 1,
      sym_identifier,
    ACTIONS(1297), 1,
      sym__dedent,
    STATE(397), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [13525] = 5,
    ACTIONS(1301), 1,
      sym__dotted_label_name,
    ACTIONS(1303), 1,
      anon_sym_expression,
    ACTIONS(1305), 1,
      anon_sym_screen,
    STATE(551), 1,
      sym__label_name,
    ACTIONS(1299), 2,
      sym_identifier,
      sym_expression,
  [13542] = 4,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1295), 1,
      sym_identifier,
    ACTIONS(1307), 1,
      sym__dedent,
    STATE(397), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [13557] = 5,
    ACTIONS(1148), 1,
      sym__newline,
    ACTIONS(1309), 1,
      sym_identifier,
    STATE(62), 1,
      sym_string,
    STATE(404), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [13574] = 4,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1295), 1,
      sym_identifier,
    ACTIONS(1311), 1,
      sym__dedent,
    STATE(397), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [13589] = 2,
    ACTIONS(421), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(423), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [13600] = 6,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1313), 1,
      sym_identifier,
    ACTIONS(1315), 1,
      anon_sym_EQ,
    STATE(296), 1,
      sym__atl_block,
    STATE(372), 1,
      aux_sym_menu_caption_repeat1,
    STATE(763), 1,
      sym__block_colon,
  [13619] = 3,
    ACTIONS(1290), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1317), 2,
      sym__audio_name,
      sym__audio_list,
    STATE(545), 2,
      sym__audio_file,
      sym_string,
  [13632] = 5,
    ACTIONS(1138), 1,
      sym__newline,
    ACTIONS(1319), 1,
      sym_identifier,
    STATE(61), 1,
      sym_string,
    STATE(421), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(249), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [13649] = 6,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1313), 1,
      sym_identifier,
    ACTIONS(1321), 1,
      anon_sym_EQ,
    STATE(185), 1,
      sym__atl_block,
    STATE(372), 1,
      aux_sym_menu_caption_repeat1,
    STATE(784), 1,
      sym__block_colon,
  [13668] = 6,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1323), 1,
      anon_sym_with,
    ACTIONS(1325), 1,
      anon_sym_as,
    ACTIONS(1327), 1,
      sym__newline,
    STATE(244), 1,
      sym__atl_block,
    STATE(784), 1,
      sym__block_colon,
  [13687] = 2,
    ACTIONS(1329), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(1331), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [13698] = 4,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1295), 1,
      sym_identifier,
    ACTIONS(1333), 1,
      sym__dedent,
    STATE(397), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [13713] = 4,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1295), 1,
      sym_identifier,
    ACTIONS(1335), 1,
      sym__dedent,
    STATE(397), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [13728] = 4,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1295), 1,
      sym_identifier,
    ACTIONS(1337), 1,
      sym__dedent,
    STATE(397), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [13743] = 4,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1295), 1,
      sym_identifier,
    ACTIONS(1339), 1,
      sym__dedent,
    STATE(397), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [13758] = 4,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1295), 1,
      sym_identifier,
    ACTIONS(1341), 1,
      sym__dedent,
    STATE(397), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [13773] = 4,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1295), 1,
      sym_identifier,
    ACTIONS(1343), 1,
      sym__dedent,
    STATE(397), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [13788] = 4,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1295), 1,
      sym_identifier,
    ACTIONS(1345), 1,
      sym__dedent,
    STATE(397), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [13803] = 5,
    ACTIONS(1349), 1,
      sym__dotted_label_name,
    ACTIONS(1351), 1,
      anon_sym_expression,
    ACTIONS(1353), 1,
      anon_sym_screen,
    STATE(548), 1,
      sym__label_name,
    ACTIONS(1347), 2,
      sym_identifier,
      sym_expression,
  [13820] = 3,
    ACTIONS(1290), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1355), 2,
      sym__audio_name,
      sym__audio_list,
    STATE(566), 2,
      sym__audio_file,
      sym_string,
  [13833] = 3,
    ACTIONS(1290), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
    ACTIONS(1357), 2,
      sym__audio_name,
      sym__audio_list,
    STATE(567), 2,
      sym__audio_file,
      sym_string,
  [13846] = 2,
    ACTIONS(1359), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(1361), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [13857] = 2,
    ACTIONS(1363), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(1365), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [13868] = 4,
    ACTIONS(1367), 1,
      sym_identifier,
    ACTIONS(1370), 1,
      sym_comment,
    ACTIONS(1373), 1,
      sym__dedent,
    STATE(397), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [13883] = 2,
    ACTIONS(1375), 2,
      sym_identifier,
      anon_sym_set,
    ACTIONS(1377), 4,
      sym__dedent,
      sym_comment,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [13894] = 5,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1379), 1,
      anon_sym_with,
    ACTIONS(1381), 1,
      sym__newline,
    STATE(84), 1,
      sym__atl_block,
    STATE(763), 1,
      sym__block_colon,
  [13910] = 5,
    ACTIONS(1383), 1,
      anon_sym_LPAREN,
    ACTIONS(1385), 1,
      anon_sym_with,
    ACTIONS(1387), 1,
      anon_sym_nopredict,
    ACTIONS(1389), 1,
      sym__newline,
    STATE(498), 1,
      sym_parameter_list,
  [13926] = 5,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1391), 1,
      anon_sym_with,
    ACTIONS(1393), 1,
      sym__newline,
    STATE(238), 1,
      sym__atl_block,
    STATE(784), 1,
      sym__block_colon,
  [13942] = 5,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1395), 1,
      anon_sym_with,
    ACTIONS(1397), 1,
      sym__newline,
    STATE(111), 1,
      sym__atl_block,
    STATE(763), 1,
      sym__block_colon,
  [13958] = 5,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1399), 1,
      anon_sym_with,
    ACTIONS(1401), 1,
      sym__newline,
    STATE(246), 1,
      sym__atl_block,
    STATE(784), 1,
      sym__block_colon,
  [13974] = 4,
    ACTIONS(1313), 1,
      sym_identifier,
    STATE(60), 1,
      sym_string,
    STATE(372), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [13988] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    STATE(37), 1,
      sym__block_colon,
    STATE(74), 1,
      sym__block,
    ACTIONS(1403), 2,
      anon_sym_hide,
      anon_sym_global,
  [14002] = 2,
    ACTIONS(1407), 2,
      sym__newline,
      anon_sym_COLON,
    ACTIONS(1405), 3,
      sym_identifier,
      sym__screen_string,
      sym__screen_value,
  [14012] = 5,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1409), 1,
      anon_sym_with,
    ACTIONS(1411), 1,
      sym__newline,
    STATE(146), 1,
      sym__atl_block,
    STATE(763), 1,
      sym__block_colon,
  [14028] = 5,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1413), 1,
      anon_sym_with,
    ACTIONS(1415), 1,
      sym__newline,
    STATE(273), 1,
      sym__atl_block,
    STATE(784), 1,
      sym__block_colon,
  [14044] = 3,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1295), 1,
      sym_identifier,
    STATE(373), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [14056] = 4,
    ACTIONS(1243), 1,
      sym__screen_value_list,
    ACTIONS(1419), 1,
      sym__screen_string,
    STATE(491), 1,
      sym__positional_property,
    ACTIONS(1417), 2,
      sym_identifier,
      sym__screen_value,
  [14070] = 3,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1295), 1,
      sym_identifier,
    STATE(377), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [14082] = 4,
    ACTIONS(1313), 1,
      sym_identifier,
    STATE(372), 1,
      aux_sym_menu_caption_repeat1,
    STATE(717), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [14096] = 4,
    ACTIONS(1421), 1,
      sym_identifier,
    STATE(413), 1,
      aux_sym_screen_language_statement_repeat2,
    STATE(480), 1,
      sym__keyword_property,
    ACTIONS(1424), 2,
      sym__newline,
      anon_sym_COLON,
  [14110] = 4,
    ACTIONS(1426), 1,
      sym_identifier,
    STATE(412), 1,
      aux_sym_menu_caption_repeat1,
    STATE(624), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [14124] = 5,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1428), 1,
      anon_sym_with,
    ACTIONS(1430), 1,
      sym__newline,
    STATE(211), 1,
      sym__atl_block,
    STATE(784), 1,
      sym__block_colon,
  [14140] = 4,
    ACTIONS(1130), 1,
      anon_sym_COLON,
    STATE(49), 1,
      sym__block_colon,
    STATE(201), 1,
      sym__block,
    ACTIONS(1432), 2,
      anon_sym_hide,
      anon_sym_global,
  [14154] = 5,
    ACTIONS(1383), 1,
      anon_sym_LPAREN,
    ACTIONS(1434), 1,
      anon_sym_with,
    ACTIONS(1436), 1,
      anon_sym_nopredict,
    ACTIONS(1438), 1,
      sym__newline,
    STATE(478), 1,
      sym_parameter_list,
  [14170] = 5,
    ACTIONS(1383), 1,
      anon_sym_LPAREN,
    ACTIONS(1440), 1,
      anon_sym_with,
    ACTIONS(1442), 1,
      anon_sym_nopredict,
    ACTIONS(1444), 1,
      sym__newline,
    STATE(473), 1,
      sym_parameter_list,
  [14186] = 4,
    ACTIONS(1448), 1,
      sym__dotted_label_name,
    ACTIONS(1450), 1,
      anon_sym_expression,
    STATE(616), 1,
      sym__label_name,
    ACTIONS(1446), 2,
      sym_identifier,
      sym_expression,
  [14200] = 4,
    ACTIONS(1130), 1,
      anon_sym_COLON,
    STATE(49), 1,
      sym__block_colon,
    STATE(165), 1,
      sym__block,
    ACTIONS(1452), 2,
      anon_sym_hide,
      anon_sym_early,
  [14214] = 4,
    ACTIONS(1313), 1,
      sym_identifier,
    STATE(45), 1,
      sym_string,
    STATE(372), 1,
      aux_sym_menu_caption_repeat1,
    ACTIONS(249), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [14228] = 5,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1247), 1,
      anon_sym_LPAREN,
    STATE(67), 1,
      sym__atl_block,
    STATE(508), 1,
      sym_parameter_list,
    STATE(763), 1,
      sym__block_colon,
  [14244] = 3,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1295), 1,
      sym_identifier,
    STATE(375), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [14256] = 2,
    ACTIONS(1456), 2,
      sym__newline,
      anon_sym_COLON,
    ACTIONS(1454), 3,
      sym_identifier,
      sym__screen_string,
      sym__screen_value,
  [14266] = 3,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1295), 1,
      sym_identifier,
    STATE(390), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [14278] = 3,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1295), 1,
      sym_identifier,
    STATE(391), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [14290] = 4,
    ACTIONS(1460), 1,
      sym__dotted_label_name,
    ACTIONS(1462), 1,
      anon_sym_expression,
    STATE(605), 1,
      sym__label_name,
    ACTIONS(1458), 2,
      sym_identifier,
      sym_expression,
  [14304] = 2,
    ACTIONS(1238), 2,
      sym__newline,
      anon_sym_COLON,
    ACTIONS(1464), 3,
      sym_identifier,
      sym__screen_string,
      sym__screen_value,
  [14314] = 3,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1295), 1,
      sym_identifier,
    STATE(385), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [14326] = 3,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1295), 1,
      sym_identifier,
    STATE(386), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [14338] = 5,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1247), 1,
      anon_sym_LPAREN,
    STATE(194), 1,
      sym__atl_block,
    STATE(495), 1,
      sym_parameter_list,
    STATE(784), 1,
      sym__block_colon,
  [14354] = 3,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1295), 1,
      sym_identifier,
    STATE(387), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [14366] = 3,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1295), 1,
      sym_identifier,
    STATE(388), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [14378] = 3,
    ACTIONS(185), 1,
      sym_comment,
    ACTIONS(1295), 1,
      sym_identifier,
    STATE(389), 3,
      sym__comment_line,
      sym_style_property_statement,
      aux_sym_style_statement_repeat1,
  [14390] = 5,
    ACTIONS(1383), 1,
      anon_sym_LPAREN,
    ACTIONS(1466), 1,
      anon_sym_with,
    ACTIONS(1468), 1,
      anon_sym_nopredict,
    ACTIONS(1470), 1,
      sym__newline,
    STATE(496), 1,
      sym_parameter_list,
  [14406] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    STATE(37), 1,
      sym__block_colon,
    STATE(103), 1,
      sym__block,
    ACTIONS(1472), 2,
      anon_sym_hide,
      anon_sym_early,
  [14420] = 5,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1474), 1,
      anon_sym_with,
    ACTIONS(1476), 1,
      sym__newline,
    STATE(119), 1,
      sym__atl_block,
    STATE(763), 1,
      sym__block_colon,
  [14436] = 5,
    ACTIONS(1478), 1,
      anon_sym_COLON,
    ACTIONS(1480), 1,
      anon_sym_if,
    ACTIONS(1482), 1,
      sym__newline,
    STATE(367), 1,
      sym__block_colon,
    STATE(398), 1,
      sym__block,
  [14452] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1484), 1,
      anon_sym_is,
    ACTIONS(1486), 1,
      anon_sym_take,
    STATE(672), 1,
      sym__block_colon,
  [14465] = 4,
    ACTIONS(1130), 1,
      anon_sym_COLON,
    ACTIONS(1247), 1,
      anon_sym_LPAREN,
    STATE(52), 1,
      sym__block_colon,
    STATE(550), 1,
      sym_parameter_list,
  [14478] = 4,
    ACTIONS(1130), 1,
      anon_sym_COLON,
    ACTIONS(1488), 1,
      sym__newline,
    STATE(49), 1,
      sym__block_colon,
    STATE(198), 1,
      sym__block,
  [14491] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1490), 1,
      sym__newline,
    STATE(132), 1,
      sym__atl_block,
    STATE(763), 1,
      sym__block_colon,
  [14504] = 4,
    ACTIONS(1150), 1,
      sym_identifier,
    ACTIONS(1492), 1,
      anon_sym_with,
    ACTIONS(1494), 1,
      sym__newline,
    STATE(364), 1,
      aux_sym_menu_caption_repeat1,
  [14517] = 3,
    ACTIONS(1498), 1,
      sym__dotted_label_name,
    STATE(659), 1,
      sym__label_name,
    ACTIONS(1496), 2,
      sym_identifier,
      sym_expression,
  [14528] = 3,
    ACTIONS(1502), 1,
      sym__dotted_label_name,
    STATE(538), 1,
      sym__label_name,
    ACTIONS(1500), 2,
      sym_identifier,
      sym_expression,
  [14539] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1504), 1,
      sym__newline,
    STATE(82), 1,
      sym__atl_block,
    STATE(763), 1,
      sym__block_colon,
  [14552] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1506), 1,
      sym__newline,
    STATE(140), 1,
      sym__atl_block,
    STATE(763), 1,
      sym__block_colon,
  [14565] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1508), 1,
      sym__newline,
    STATE(144), 1,
      sym__atl_block,
    STATE(763), 1,
      sym__block_colon,
  [14578] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1510), 1,
      sym__newline,
    STATE(148), 1,
      sym__atl_block,
    STATE(763), 1,
      sym__block_colon,
  [14591] = 3,
    ACTIONS(1512), 1,
      sym_expression,
    STATE(597), 1,
      sym_string,
    ACTIONS(71), 2,
      aux_sym_string_token1,
      aux_sym_string_token2,
  [14602] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1247), 1,
      anon_sym_LPAREN,
    STATE(48), 1,
      sym__block_colon,
    STATE(544), 1,
      sym_parameter_list,
  [14615] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1514), 1,
      sym__newline,
    STATE(349), 1,
      sym__screen_line_end,
    STATE(582), 1,
      sym__block_colon,
  [14628] = 4,
    ACTIONS(1150), 1,
      sym_identifier,
    ACTIONS(1516), 1,
      anon_sym_with,
    ACTIONS(1518), 1,
      sym__newline,
    STATE(364), 1,
      aux_sym_menu_caption_repeat1,
  [14641] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1520), 1,
      sym__newline,
    STATE(156), 1,
      sym__atl_block,
    STATE(763), 1,
      sym__block_colon,
  [14654] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1522), 1,
      sym__newline,
    STATE(109), 1,
      sym__atl_block,
    STATE(763), 1,
      sym__block_colon,
  [14667] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1524), 1,
      sym__newline,
    STATE(209), 1,
      sym__atl_block,
    STATE(784), 1,
      sym__block_colon,
  [14680] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1526), 1,
      sym__newline,
    STATE(236), 1,
      sym__atl_block,
    STATE(784), 1,
      sym__block_colon,
  [14693] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1528), 1,
      sym__newline,
    STATE(242), 1,
      sym__atl_block,
    STATE(784), 1,
      sym__block_colon,
  [14706] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1530), 1,
      sym__newline,
    STATE(115), 1,
      sym__atl_block,
    STATE(763), 1,
      sym__block_colon,
  [14719] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1532), 1,
      sym__newline,
    STATE(259), 1,
      sym__atl_block,
    STATE(784), 1,
      sym__block_colon,
  [14732] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1313), 1,
      sym_identifier,
    STATE(372), 1,
      aux_sym_menu_caption_repeat1,
    STATE(687), 1,
      sym__block_colon,
  [14745] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1534), 1,
      sym__newline,
    STATE(267), 1,
      sym__atl_block,
    STATE(784), 1,
      sym__block_colon,
  [14758] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1536), 1,
      sym__newline,
    STATE(271), 1,
      sym__atl_block,
    STATE(784), 1,
      sym__block_colon,
  [14771] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1538), 1,
      sym__newline,
    STATE(275), 1,
      sym__atl_block,
    STATE(784), 1,
      sym__block_colon,
  [14784] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1540), 1,
      sym__newline,
    STATE(283), 1,
      sym__atl_block,
    STATE(784), 1,
      sym__block_colon,
  [14797] = 3,
    ACTIONS(1544), 1,
      sym__dotted_label_name,
    STATE(637), 1,
      sym__label_name,
    ACTIONS(1542), 2,
      sym_identifier,
      sym_expression,
  [14808] = 3,
    ACTIONS(1548), 1,
      sym__dotted_label_name,
    STATE(561), 1,
      sym__label_name,
    ACTIONS(1546), 2,
      sym_identifier,
      sym_expression,
  [14819] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1550), 1,
      sym__newline,
    STATE(37), 1,
      sym__block_colon,
    STATE(71), 1,
      sym__block,
  [14832] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1552), 1,
      sym__newline,
    STATE(37), 1,
      sym__block_colon,
    STATE(197), 1,
      sym__block,
  [14845] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1554), 1,
      anon_sym_is,
    ACTIONS(1556), 1,
      anon_sym_take,
    STATE(786), 1,
      sym__block_colon,
  [14858] = 4,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1313), 1,
      sym_identifier,
    STATE(372), 1,
      aux_sym_menu_caption_repeat1,
    STATE(787), 1,
      sym__block_colon,
  [14871] = 4,
    ACTIONS(1130), 1,
      anon_sym_COLON,
    ACTIONS(1558), 1,
      sym__newline,
    STATE(49), 1,
      sym__block_colon,
    STATE(171), 1,
      sym__block,
  [14884] = 3,
    ACTIONS(1560), 1,
      anon_sym_with,
    ACTIONS(1562), 1,
      anon_sym_nopredict,
    ACTIONS(1564), 1,
      sym__newline,
  [14894] = 1,
    ACTIONS(1456), 3,
      sym__newline,
      sym_identifier,
      anon_sym_COLON,
  [14900] = 1,
    ACTIONS(1238), 3,
      sym__newline,
      sym_identifier,
      anon_sym_COLON,
  [14906] = 3,
    ACTIONS(1566), 1,
      sym_identifier,
    ACTIONS(1568), 1,
      sym__dotted_label_name,
    STATE(360), 1,
      sym__label_name,
  [14916] = 3,
    ACTIONS(1570), 1,
      sym_identifier,
    ACTIONS(1572), 1,
      sym__dotted_label_name,
    STATE(764), 1,
      sym__label_name,
  [14926] = 3,
    ACTIONS(1574), 1,
      anon_sym_with,
    ACTIONS(1576), 1,
      anon_sym_nopredict,
    ACTIONS(1578), 1,
      sym__newline,
  [14936] = 3,
    ACTIONS(1130), 1,
      anon_sym_COLON,
    STATE(49), 1,
      sym__block_colon,
    STATE(200), 1,
      sym__block,
  [14946] = 1,
    ACTIONS(1580), 3,
      sym__newline,
      sym_identifier,
      anon_sym_COLON,
  [14952] = 3,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    STATE(37), 1,
      sym__block_colon,
    STATE(101), 1,
      sym__block,
  [14962] = 3,
    ACTIONS(1130), 1,
      anon_sym_COLON,
    STATE(49), 1,
      sym__block_colon,
    STATE(219), 1,
      sym__block,
  [14972] = 3,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    STATE(37), 1,
      sym__block_colon,
    STATE(104), 1,
      sym__block,
  [14982] = 3,
    ACTIONS(1582), 1,
      sym_identifier,
    ACTIONS(1584), 1,
      anon_sym_at,
    ACTIONS(1586), 1,
      sym__newline,
  [14992] = 3,
    ACTIONS(1588), 1,
      sym_identifier,
    ACTIONS(1590), 1,
      sym__dotted_label_name,
    STATE(362), 1,
      sym__label_name,
  [15002] = 3,
    ACTIONS(1592), 1,
      sym_identifier,
    ACTIONS(1594), 1,
      anon_sym_at,
    ACTIONS(1596), 1,
      sym__newline,
  [15012] = 3,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1598), 1,
      anon_sym_take,
    STATE(788), 1,
      sym__block_colon,
  [15022] = 3,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    STATE(37), 1,
      sym__block_colon,
    STATE(80), 1,
      sym__block,
  [15032] = 3,
    ACTIONS(1600), 1,
      anon_sym_COLON,
    STATE(18), 1,
      sym__block,
    STATE(27), 1,
      sym__block_colon,
  [15042] = 1,
    ACTIONS(1602), 3,
      sym__newline,
      anon_sym_with,
      anon_sym_nopredict,
  [15048] = 1,
    ACTIONS(1604), 3,
      sym__newline,
      sym_identifier,
      anon_sym_COLON,
  [15054] = 3,
    ACTIONS(1130), 1,
      anon_sym_COLON,
    STATE(49), 1,
      sym__block_colon,
    STATE(223), 1,
      sym__block,
  [15064] = 1,
    ACTIONS(1606), 3,
      anon_sym_hide,
      anon_sym_show,
      anon_sym_clear,
  [15070] = 3,
    ACTIONS(1608), 1,
      sym_identifier,
    ACTIONS(1610), 1,
      sym__dotted_label_name,
    STATE(793), 1,
      sym__label_name,
  [15080] = 3,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    STATE(218), 1,
      sym__atl_block,
    STATE(784), 1,
      sym__block_colon,
  [15090] = 3,
    ACTIONS(1612), 1,
      anon_sym_with,
    ACTIONS(1614), 1,
      anon_sym_nopredict,
    ACTIONS(1616), 1,
      sym__newline,
  [15100] = 3,
    ACTIONS(1130), 1,
      anon_sym_COLON,
    STATE(49), 1,
      sym__block_colon,
    STATE(228), 1,
      sym__block,
  [15110] = 3,
    ACTIONS(1618), 1,
      anon_sym_with,
    ACTIONS(1620), 1,
      anon_sym_nopredict,
    ACTIONS(1622), 1,
      sym__newline,
  [15120] = 3,
    ACTIONS(1624), 1,
      sym_identifier,
    ACTIONS(1626), 1,
      anon_sym_screen,
    STATE(342), 1,
      aux_sym_menu_caption_repeat1,
  [15130] = 1,
    ACTIONS(1602), 3,
      anon_sym_COLON,
      anon_sym_hide,
      anon_sym_global,
  [15136] = 3,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    STATE(37), 1,
      sym__block_colon,
    STATE(96), 1,
      sym__block,
  [15146] = 3,
    ACTIONS(1600), 1,
      anon_sym_COLON,
    STATE(27), 1,
      sym__block_colon,
    STATE(34), 1,
      sym__block,
  [15156] = 3,
    ACTIONS(1628), 1,
      anon_sym_COLON,
    STATE(20), 1,
      sym__block,
    STATE(23), 1,
      sym__block_colon,
  [15166] = 3,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    STATE(37), 1,
      sym__block_colon,
    STATE(290), 1,
      sym__block,
  [15176] = 1,
    ACTIONS(1630), 3,
      sym__newline,
      anon_sym_with,
      anon_sym_nopredict,
  [15182] = 3,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    STATE(37), 1,
      sym__block_colon,
    STATE(293), 1,
      sym__block,
  [15192] = 1,
    ACTIONS(1632), 3,
      sym__dedent,
      sym_comment,
      sym_identifier,
  [15198] = 3,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    STATE(89), 1,
      sym__atl_block,
    STATE(763), 1,
      sym__block_colon,
  [15208] = 1,
    ACTIONS(1634), 3,
      sym__dedent,
      sym_comment,
      sym_identifier,
  [15214] = 3,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    STATE(37), 1,
      sym__block_colon,
    STATE(294), 1,
      sym__block,
  [15224] = 3,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1636), 1,
      sym_identifier,
    STATE(606), 1,
      sym__block_colon,
  [15234] = 3,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1638), 1,
      anon_sym_take,
    STATE(589), 1,
      sym__block_colon,
  [15244] = 3,
    ACTIONS(1640), 1,
      sym_identifier,
    ACTIONS(1642), 1,
      anon_sym_screen,
    STATE(453), 1,
      aux_sym_menu_caption_repeat1,
  [15254] = 3,
    ACTIONS(1644), 1,
      sym_identifier,
    ACTIONS(1646), 1,
      anon_sym_screen,
    STATE(343), 1,
      aux_sym_menu_caption_repeat1,
  [15264] = 1,
    ACTIONS(1648), 3,
      anon_sym_hide,
      anon_sym_show,
      anon_sym_clear,
  [15270] = 3,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    STATE(37), 1,
      sym__block_colon,
    STATE(90), 1,
      sym__block,
  [15280] = 3,
    ACTIONS(1628), 1,
      anon_sym_COLON,
    STATE(23), 1,
      sym__block_colon,
    STATE(35), 1,
      sym__block,
  [15290] = 3,
    ACTIONS(1650), 1,
      sym_identifier,
    ACTIONS(1652), 1,
      sym__dotted_label_name,
    STATE(652), 1,
      sym__label_name,
  [15300] = 3,
    ACTIONS(1654), 1,
      sym_identifier,
    ACTIONS(1656), 1,
      sym__dotted_label_name,
    STATE(670), 1,
      sym__label_name,
  [15310] = 3,
    ACTIONS(1130), 1,
      anon_sym_COLON,
    STATE(49), 1,
      sym__block_colon,
    STATE(207), 1,
      sym__block,
  [15320] = 3,
    ACTIONS(1658), 1,
      sym_identifier,
    ACTIONS(1660), 1,
      sym__dotted_store_name,
    STATE(702), 1,
      sym__store_name,
  [15330] = 1,
    ACTIONS(1630), 3,
      anon_sym_COLON,
      anon_sym_hide,
      anon_sym_global,
  [15336] = 3,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    STATE(37), 1,
      sym__block_colon,
    STATE(73), 1,
      sym__block,
  [15346] = 3,
    ACTIONS(1130), 1,
      anon_sym_COLON,
    STATE(49), 1,
      sym__block_colon,
    STATE(180), 1,
      sym__block,
  [15356] = 3,
    ACTIONS(1130), 1,
      anon_sym_COLON,
    STATE(49), 1,
      sym__block_colon,
    STATE(182), 1,
      sym__block,
  [15366] = 3,
    ACTIONS(1662), 1,
      sym_identifier,
    ACTIONS(1664), 1,
      anon_sym_screen,
    STATE(443), 1,
      aux_sym_menu_caption_repeat1,
  [15376] = 3,
    ACTIONS(1666), 1,
      sym_identifier,
    ACTIONS(1668), 1,
      sym__dotted_store_name,
    STATE(771), 1,
      sym__store_name,
  [15386] = 3,
    ACTIONS(1670), 1,
      sym_identifier,
    ACTIONS(1672), 1,
      sym__dotted_store_name,
    STATE(772), 1,
      sym__store_name,
  [15396] = 3,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    ACTIONS(1674), 1,
      sym_identifier,
    STATE(783), 1,
      sym__block_colon,
  [15406] = 3,
    ACTIONS(1130), 1,
      anon_sym_COLON,
    STATE(49), 1,
      sym__block_colon,
    STATE(183), 1,
      sym__block,
  [15416] = 3,
    ACTIONS(1676), 1,
      sym_identifier,
    ACTIONS(1678), 1,
      sym__dotted_store_name,
    STATE(703), 1,
      sym__store_name,
  [15426] = 3,
    ACTIONS(1478), 1,
      anon_sym_COLON,
    STATE(367), 1,
      sym__block_colon,
    STATE(370), 1,
      sym__block,
  [15436] = 3,
    ACTIONS(1130), 1,
      anon_sym_COLON,
    STATE(49), 1,
      sym__block_colon,
    STATE(231), 1,
      sym__block,
  [15446] = 2,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    STATE(785), 1,
      sym__block_colon,
  [15453] = 2,
    ACTIONS(1680), 1,
      sym_expression,
    ACTIONS(1682), 1,
      sym__newline,
  [15460] = 2,
    ACTIONS(1684), 1,
      anon_sym_with,
    ACTIONS(1686), 1,
      sym__newline,
  [15467] = 2,
    ACTIONS(1688), 1,
      anon_sym_with,
    ACTIONS(1690), 1,
      sym__newline,
  [15474] = 2,
    ACTIONS(1692), 1,
      anon_sym_from,
    ACTIONS(1694), 1,
      sym__newline,
  [15481] = 2,
    ACTIONS(1696), 1,
      sym_expression,
    ACTIONS(1698), 1,
      sym__newline,
  [15488] = 1,
    ACTIONS(1700), 2,
      sym_identifier,
      anon_sym_strings,
  [15493] = 2,
    ACTIONS(1702), 1,
      anon_sym_with,
    ACTIONS(1704), 1,
      sym__newline,
  [15500] = 2,
    ACTIONS(1706), 1,
      anon_sym_python,
    ACTIONS(1708), 1,
      aux_sym_init_python_statement_token1,
  [15507] = 2,
    ACTIONS(1710), 1,
      sym_identifier,
    STATE(461), 1,
      aux_sym_menu_caption_repeat1,
  [15514] = 2,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    STATE(64), 1,
      sym__block_colon,
  [15521] = 2,
    ACTIONS(1712), 1,
      sym_expression,
    ACTIONS(1714), 1,
      sym__newline,
  [15528] = 2,
    ACTIONS(1716), 1,
      sym_expression,
    ACTIONS(1718), 1,
      sym__newline,
  [15535] = 2,
    ACTIONS(1720), 1,
      sym_expression,
    ACTIONS(1722), 1,
      sym__newline,
  [15542] = 2,
    ACTIONS(1724), 1,
      anon_sym_from,
    ACTIONS(1726), 1,
      sym__newline,
  [15549] = 2,
    ACTIONS(1728), 1,
      sym_identifier,
    STATE(379), 1,
      aux_sym_menu_caption_repeat1,
  [15556] = 2,
    ACTIONS(1130), 1,
      anon_sym_COLON,
    STATE(41), 1,
      sym__block_colon,
  [15563] = 2,
    ACTIONS(1730), 1,
      anon_sym_from,
    ACTIONS(1732), 1,
      sym__newline,
  [15570] = 2,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    STATE(592), 1,
      sym__block_colon,
  [15577] = 2,
    ACTIONS(1734), 1,
      sym_identifier,
    STATE(382), 1,
      aux_sym_menu_caption_repeat1,
  [15584] = 2,
    ACTIONS(1736), 1,
      anon_sym_python,
    ACTIONS(1738), 1,
      aux_sym_init_python_statement_token1,
  [15591] = 2,
    ACTIONS(1740), 1,
      anon_sym_with,
    ACTIONS(1742), 1,
      sym__newline,
  [15598] = 1,
    ACTIONS(1744), 2,
      sym_identifier,
      anon_sym_strings,
  [15603] = 2,
    ACTIONS(1746), 1,
      anon_sym_at,
    ACTIONS(1748), 1,
      sym__newline,
  [15610] = 1,
    ACTIONS(417), 2,
      sym__newline,
      sym_expression,
  [15615] = 2,
    ACTIONS(1750), 1,
      anon_sym_RPAREN,
    ACTIONS(1752), 1,
      sym__parameter_blob,
  [15622] = 2,
    ACTIONS(1754), 1,
      anon_sym_with,
    ACTIONS(1756), 1,
      sym__newline,
  [15629] = 2,
    ACTIONS(1758), 1,
      anon_sym_from,
    ACTIONS(1760), 1,
      sym__newline,
  [15636] = 2,
    ACTIONS(1762), 1,
      anon_sym_with,
    ACTIONS(1764), 1,
      sym__newline,
  [15643] = 2,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    STATE(653), 1,
      sym__block_colon,
  [15650] = 2,
    ACTIONS(1766), 1,
      anon_sym_at,
    ACTIONS(1768), 1,
      sym__newline,
  [15657] = 2,
    ACTIONS(1770), 1,
      anon_sym_RPAREN,
    ACTIONS(1772), 1,
      sym__parameter_blob,
  [15664] = 2,
    ACTIONS(1774), 1,
      sym_expression,
    ACTIONS(1776), 1,
      sym__newline,
  [15671] = 2,
    ACTIONS(1778), 1,
      sym_expression,
    ACTIONS(1780), 1,
      sym__newline,
  [15678] = 2,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    STATE(644), 1,
      sym__block_colon,
  [15685] = 2,
    ACTIONS(1782), 1,
      anon_sym_with,
    ACTIONS(1784), 1,
      sym__newline,
  [15692] = 2,
    ACTIONS(1786), 1,
      anon_sym_with,
    ACTIONS(1788), 1,
      sym__newline,
  [15699] = 1,
    ACTIONS(1790), 2,
      sym__newline,
      anon_sym_COLON,
  [15704] = 2,
    ACTIONS(1792), 1,
      anon_sym_with,
    ACTIONS(1794), 1,
      sym__newline,
  [15711] = 2,
    ACTIONS(1796), 1,
      anon_sym_with,
    ACTIONS(1798), 1,
      sym__newline,
  [15718] = 2,
    ACTIONS(1800), 1,
      sym_expression,
    STATE(452), 1,
      sym__screen_condition,
  [15725] = 2,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    STATE(593), 1,
      sym__block_colon,
  [15732] = 2,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    STATE(789), 1,
      sym__block_colon,
  [15739] = 2,
    ACTIONS(1097), 1,
      anon_sym_COLON,
    STATE(790), 1,
      sym__block_colon,
  [15746] = 2,
    ACTIONS(1802), 1,
      sym_identifier,
    STATE(471), 1,
      aux_sym_menu_caption_repeat1,
  [15753] = 2,
    ACTIONS(1804), 1,
      sym_expression,
    ACTIONS(1806), 1,
      sym__newline,
  [15760] = 1,
    ACTIONS(1808), 1,
      sym__indent,
  [15764] = 1,
    ACTIONS(1810), 1,
      sym_expression,
  [15768] = 1,
    ACTIONS(1812), 1,
      sym__newline,
  [15772] = 1,
    ACTIONS(1814), 1,
      sym__indent,
  [15776] = 1,
    ACTIONS(1816), 1,
      sym__indent,
  [15780] = 1,
    ACTIONS(1818), 1,
      sym__indent,
  [15784] = 1,
    ACTIONS(1820), 1,
      sym_expression,
  [15788] = 1,
    ACTIONS(1822), 1,
      sym_expression,
  [15792] = 1,
    ACTIONS(1824), 1,
      sym_identifier,
  [15796] = 1,
    ACTIONS(1826), 1,
      sym__newline,
  [15800] = 1,
    ACTIONS(1828), 1,
      sym_identifier,
  [15804] = 1,
    ACTIONS(1830), 1,
      sym_identifier,
  [15808] = 1,
    ACTIONS(1832), 1,
      sym__newline,
  [15812] = 1,
    ACTIONS(1834), 1,
      sym__newline,
  [15816] = 1,
    ACTIONS(1836), 1,
      sym_expression,
  [15820] = 1,
    ACTIONS(1838), 1,
      sym__newline,
  [15824] = 1,
    ACTIONS(1840), 1,
      sym__newline,
  [15828] = 1,
    ACTIONS(1842), 1,
      sym__newline,
  [15832] = 1,
    ACTIONS(1844), 1,
      sym__newline,
  [15836] = 1,
    ACTIONS(1846), 1,
      sym__newline,
  [15840] = 1,
    ACTIONS(1848), 1,
      sym__newline,
  [15844] = 1,
    ACTIONS(1850), 1,
      sym__newline,
  [15848] = 1,
    ACTIONS(1852), 1,
      sym__newline,
  [15852] = 1,
    ACTIONS(1854), 1,
      sym__at_expr_blob,
  [15856] = 1,
    ACTIONS(1856), 1,
      sym_expression,
  [15860] = 1,
    ACTIONS(1858), 1,
      sym__newline,
  [15864] = 1,
    ACTIONS(1860), 1,
      sym__newline,
  [15868] = 1,
    ACTIONS(1862), 1,
      sym__newline,
  [15872] = 1,
    ACTIONS(1864), 1,
      sym_expression,
  [15876] = 1,
    ACTIONS(1866), 1,
      sym_expression,
  [15880] = 1,
    ACTIONS(1868), 1,
      sym_expression,
  [15884] = 1,
    ACTIONS(1870), 1,
      sym__at_expr_blob,
  [15888] = 1,
    ACTIONS(1872), 1,
      sym_identifier,
  [15892] = 1,
    ACTIONS(1874), 1,
      sym_identifier,
  [15896] = 1,
    ACTIONS(1876), 1,
      sym__newline,
  [15900] = 1,
    ACTIONS(1878), 1,
      sym__newline,
  [15904] = 1,
    ACTIONS(1880), 1,
      sym__newline,
  [15908] = 1,
    ACTIONS(1882), 1,
      sym_expression,
  [15912] = 1,
    ACTIONS(1884), 1,
      sym__newline,
  [15916] = 1,
    ACTIONS(1886), 1,
      sym_expression,
  [15920] = 1,
    ACTIONS(1888), 1,
      sym__newline,
  [15924] = 1,
    ACTIONS(1890), 1,
      anon_sym_python,
  [15928] = 1,
    ACTIONS(1892), 1,
      sym__newline,
  [15932] = 1,
    ACTIONS(1894), 1,
      anon_sym_in,
  [15936] = 1,
    ACTIONS(1896), 1,
      sym__newline,
  [15940] = 1,
    ACTIONS(1898), 1,
      sym__indent,
  [15944] = 1,
    ACTIONS(1900), 1,
      sym_expression,
  [15948] = 1,
    ACTIONS(1902), 1,
      sym__newline,
  [15952] = 1,
    ACTIONS(1904), 1,
      sym__newline,
  [15956] = 1,
    ACTIONS(1906), 1,
      sym__newline,
  [15960] = 1,
    ACTIONS(1908), 1,
      sym__newline,
  [15964] = 1,
    ACTIONS(1910), 1,
      sym_expression,
  [15968] = 1,
    ACTIONS(1912), 1,
      sym__newline,
  [15972] = 1,
    ACTIONS(1914), 1,
      sym_expression,
  [15976] = 1,
    ACTIONS(1916), 1,
      sym_expression,
  [15980] = 1,
    ACTIONS(1918), 1,
      sym_expression,
  [15984] = 1,
    ACTIONS(1920), 1,
      sym_identifier,
  [15988] = 1,
    ACTIONS(1922), 1,
      sym__newline,
  [15992] = 1,
    ACTIONS(1924), 1,
      sym__newline,
  [15996] = 1,
    ACTIONS(1926), 1,
      sym__newline,
  [16000] = 1,
    ACTIONS(1928), 1,
      sym_expression,
  [16004] = 1,
    ACTIONS(1930), 1,
      sym_expression,
  [16008] = 1,
    ACTIONS(1932), 1,
      sym_identifier,
  [16012] = 1,
    ACTIONS(1934), 1,
      sym_expression,
  [16016] = 1,
    ACTIONS(1936), 1,
      sym__newline,
  [16020] = 1,
    ACTIONS(1938), 1,
      sym__newline,
  [16024] = 1,
    ACTIONS(1940), 1,
      sym__newline,
  [16028] = 1,
    ACTIONS(1942), 1,
      sym__newline,
  [16032] = 1,
    ACTIONS(1944), 1,
      sym__newline,
  [16036] = 1,
    ACTIONS(1946), 1,
      sym_expression,
  [16040] = 1,
    ACTIONS(1948), 1,
      anon_sym_RPAREN,
  [16044] = 1,
    ACTIONS(1950), 1,
      sym__newline,
  [16048] = 1,
    ACTIONS(1952), 1,
      sym__newline,
  [16052] = 1,
    ACTIONS(1954), 1,
      sym__newline,
  [16056] = 1,
    ACTIONS(1956), 1,
      sym__newline,
  [16060] = 1,
    ACTIONS(1958), 1,
      sym__newline,
  [16064] = 1,
    ACTIONS(1960), 1,
      sym__newline,
  [16068] = 1,
    ACTIONS(1962), 1,
      sym__newline,
  [16072] = 1,
    ACTIONS(1964), 1,
      sym_expression,
  [16076] = 1,
    ACTIONS(1966), 1,
      sym__newline,
  [16080] = 1,
    ACTIONS(1968), 1,
      sym_identifier,
  [16084] = 1,
    ACTIONS(1970), 1,
      sym_expression,
  [16088] = 1,
    ACTIONS(1972), 1,
      sym_identifier,
  [16092] = 1,
    ACTIONS(1974), 1,
      sym__newline,
  [16096] = 1,
    ACTIONS(1976), 1,
      sym__newline,
  [16100] = 1,
    ACTIONS(1978), 1,
      sym__newline,
  [16104] = 1,
    ACTIONS(1980), 1,
      sym__newline,
  [16108] = 1,
    ACTIONS(1982), 1,
      sym__newline,
  [16112] = 1,
    ACTIONS(1984), 1,
      sym_expression,
  [16116] = 1,
    ACTIONS(1986), 1,
      sym__newline,
  [16120] = 1,
    ACTIONS(1988), 1,
      sym__newline,
  [16124] = 1,
    ACTIONS(1990), 1,
      sym__newline,
  [16128] = 1,
    ACTIONS(1992), 1,
      sym__newline,
  [16132] = 1,
    ACTIONS(1994), 1,
      sym__indent,
  [16136] = 1,
    ACTIONS(1996), 1,
      sym_expression,
  [16140] = 1,
    ACTIONS(1998), 1,
      sym_expression,
  [16144] = 1,
    ACTIONS(2000), 1,
      anon_sym_python,
  [16148] = 1,
    ACTIONS(2002), 1,
      sym__newline,
  [16152] = 1,
    ACTIONS(2004), 1,
      sym_identifier,
  [16156] = 1,
    ACTIONS(2006), 1,
      sym__newline,
  [16160] = 1,
    ACTIONS(2008), 1,
      sym__newline,
  [16164] = 1,
    ACTIONS(2010), 1,
      sym__newline,
  [16168] = 1,
    ACTIONS(2012), 1,
      sym_expression,
  [16172] = 1,
    ACTIONS(2014), 1,
      sym__newline,
  [16176] = 1,
    ACTIONS(2016), 1,
      sym__newline,
  [16180] = 1,
    ACTIONS(2018), 1,
      sym_expression,
  [16184] = 1,
    ACTIONS(2020), 1,
      sym__newline,
  [16188] = 1,
    ACTIONS(2022), 1,
      sym__newline,
  [16192] = 1,
    ACTIONS(2024), 1,
      sym_expression,
  [16196] = 1,
    ACTIONS(2026), 1,
      sym__indent,
  [16200] = 1,
    ACTIONS(2028), 1,
      sym_expression,
  [16204] = 1,
    ACTIONS(2030), 1,
      sym__newline,
  [16208] = 1,
    ACTIONS(2032), 1,
      sym__newline,
  [16212] = 1,
    ACTIONS(2034), 1,
      sym__newline,
  [16216] = 1,
    ACTIONS(2036), 1,
      sym__indent,
  [16220] = 1,
    ACTIONS(2038), 1,
      ts_builtin_sym_end,
  [16224] = 1,
    ACTIONS(2040), 1,
      sym__newline,
  [16228] = 1,
    ACTIONS(2042), 1,
      sym__newline,
  [16232] = 1,
    ACTIONS(2044), 1,
      sym__newline,
  [16236] = 1,
    ACTIONS(2046), 1,
      sym_identifier,
  [16240] = 1,
    ACTIONS(2048), 1,
      sym__newline,
  [16244] = 1,
    ACTIONS(2050), 1,
      sym__newline,
  [16248] = 1,
    ACTIONS(2052), 1,
      anon_sym_EQ,
  [16252] = 1,
    ACTIONS(2054), 1,
      anon_sym_EQ,
  [16256] = 1,
    ACTIONS(2056), 1,
      sym__indent,
  [16260] = 1,
    ACTIONS(2058), 1,
      sym_expression,
  [16264] = 1,
    ACTIONS(2060), 1,
      sym_expression,
  [16268] = 1,
    ACTIONS(2062), 1,
      sym_expression,
  [16272] = 1,
    ACTIONS(2064), 1,
      sym_identifier,
  [16276] = 1,
    ACTIONS(2066), 1,
      sym__newline,
  [16280] = 1,
    ACTIONS(2068), 1,
      sym_identifier,
  [16284] = 1,
    ACTIONS(2070), 1,
      sym__newline,
  [16288] = 1,
    ACTIONS(2072), 1,
      sym_identifier,
  [16292] = 1,
    ACTIONS(2074), 1,
      sym_identifier,
  [16296] = 1,
    ACTIONS(2076), 1,
      sym_identifier,
  [16300] = 1,
    ACTIONS(2078), 1,
      sym_identifier,
  [16304] = 1,
    ACTIONS(2080), 1,
      sym_expression,
  [16308] = 1,
    ACTIONS(2082), 1,
      sym__newline,
  [16312] = 1,
    ACTIONS(2084), 1,
      sym_identifier,
  [16316] = 1,
    ACTIONS(2086), 1,
      anon_sym_in,
  [16320] = 1,
    ACTIONS(2088), 1,
      sym_expression,
  [16324] = 1,
    ACTIONS(2090), 1,
      sym__at_expr_blob,
  [16328] = 1,
    ACTIONS(2092), 1,
      sym_identifier,
  [16332] = 1,
    ACTIONS(2094), 1,
      sym_expression,
  [16336] = 1,
    ACTIONS(2096), 1,
      sym_expression,
  [16340] = 1,
    ACTIONS(2098), 1,
      sym_expression,
  [16344] = 1,
    ACTIONS(2100), 1,
      sym_expression,
  [16348] = 1,
    ACTIONS(2102), 1,
      sym_expression,
  [16352] = 1,
    ACTIONS(2104), 1,
      sym_expression,
  [16356] = 1,
    ACTIONS(2106), 1,
      sym_expression,
  [16360] = 1,
    ACTIONS(2108), 1,
      sym_expression,
  [16364] = 1,
    ACTIONS(2110), 1,
      sym_expression,
  [16368] = 1,
    ACTIONS(2112), 1,
      sym__at_expr_blob,
  [16372] = 1,
    ACTIONS(2114), 1,
      sym_expression,
  [16376] = 1,
    ACTIONS(2116), 1,
      sym__at_expr_blob,
  [16380] = 1,
    ACTIONS(2118), 1,
      sym_identifier,
  [16384] = 1,
    ACTIONS(2120), 1,
      sym_expression,
  [16388] = 1,
    ACTIONS(2122), 1,
      sym__indent,
  [16392] = 1,
    ACTIONS(2124), 1,
      sym_expression,
  [16396] = 1,
    ACTIONS(2126), 1,
      sym__at_expr_blob,
  [16400] = 1,
    ACTIONS(2128), 1,
      sym_expression,
  [16404] = 1,
    ACTIONS(2130), 1,
      sym__for_target_blob,
  [16408] = 1,
    ACTIONS(2132), 1,
      sym_expression,
  [16412] = 1,
    ACTIONS(2134), 1,
      sym_expression,
  [16416] = 1,
    ACTIONS(2136), 1,
      sym_expression,
  [16420] = 1,
    ACTIONS(2138), 1,
      sym_expression,
  [16424] = 1,
    ACTIONS(2140), 1,
      sym_expression,
  [16428] = 1,
    ACTIONS(2142), 1,
      sym_expression,
  [16432] = 1,
    ACTIONS(2144), 1,
      sym_expression,
  [16436] = 1,
    ACTIONS(2146), 1,
      sym_expression,
  [16440] = 1,
    ACTIONS(2148), 1,
      sym_expression,
  [16444] = 1,
    ACTIONS(2150), 1,
      sym_expression,
  [16448] = 1,
    ACTIONS(2152), 1,
      sym_expression,
  [16452] = 1,
    ACTIONS(2154), 1,
      sym_identifier,
  [16456] = 1,
    ACTIONS(2156), 1,
      sym_expression,
  [16460] = 1,
    ACTIONS(2158), 1,
      sym__indent,
  [16464] = 1,
    ACTIONS(2160), 1,
      anon_sym_RPAREN,
  [16468] = 1,
    ACTIONS(2162), 1,
      sym_expression,
  [16472] = 1,
    ACTIONS(2164), 1,
      sym_expression,
  [16476] = 1,
    ACTIONS(2166), 1,
      sym_expression,
  [16480] = 1,
    ACTIONS(2168), 1,
      sym__newline,
  [16484] = 1,
    ACTIONS(2170), 1,
      sym_expression,
  [16488] = 1,
    ACTIONS(2172), 1,
      sym_expression,
  [16492] = 1,
    ACTIONS(2174), 1,
      sym__newline,
  [16496] = 1,
    ACTIONS(2176), 1,
      sym__newline,
  [16500] = 1,
    ACTIONS(2178), 1,
      sym__newline,
  [16504] = 1,
    ACTIONS(2180), 1,
      sym_identifier,
  [16508] = 1,
    ACTIONS(2182), 1,
      sym_expression,
  [16512] = 1,
    ACTIONS(2184), 1,
      sym__for_target_blob,
  [16516] = 1,
    ACTIONS(2186), 1,
      sym_identifier,
  [16520] = 1,
    ACTIONS(2188), 1,
      sym_identifier,
  [16524] = 1,
    ACTIONS(2190), 1,
      anon_sym_EQ,
  [16528] = 1,
    ACTIONS(2192), 1,
      anon_sym_EQ,
  [16532] = 1,
    ACTIONS(2194), 1,
      sym__indent,
  [16536] = 1,
    ACTIONS(2196), 1,
      sym__newline,
  [16540] = 1,
    ACTIONS(2198), 1,
      sym__indent,
  [16544] = 1,
    ACTIONS(2200), 1,
      sym__indent,
  [16548] = 1,
    ACTIONS(2202), 1,
      sym__indent,
  [16552] = 1,
    ACTIONS(2204), 1,
      sym__indent,
  [16556] = 1,
    ACTIONS(2206), 1,
      sym__indent,
  [16560] = 1,
    ACTIONS(2208), 1,
      sym__indent,
  [16564] = 1,
    ACTIONS(2210), 1,
      sym__newline,
  [16568] = 1,
    ACTIONS(2212), 1,
      sym_expression,
  [16572] = 1,
    ACTIONS(2214), 1,
      sym__newline,
  [16576] = 1,
    ACTIONS(2216), 1,
      sym__newline,
  [16580] = 1,
    ACTIONS(2218), 1,
      sym__newline,
  [16584] = 1,
    ACTIONS(2220), 1,
      sym__newline,
  [16588] = 1,
    ACTIONS(2222), 1,
      sym__newline,
  [16592] = 1,
    ACTIONS(2224), 1,
      sym__newline,
  [16596] = 1,
    ACTIONS(2226), 1,
      sym__newline,
  [16600] = 1,
    ACTIONS(2228), 1,
      sym__newline,
  [16604] = 1,
    ACTIONS(2230), 1,
      sym_expression,
  [16608] = 1,
    ACTIONS(2232), 1,
      sym__newline,
  [16612] = 1,
    ACTIONS(2234), 1,
      sym__newline,
  [16616] = 1,
    ACTIONS(2236), 1,
      sym_expression,
  [16620] = 1,
    ACTIONS(2238), 1,
      sym_identifier,
  [16624] = 1,
    ACTIONS(2240), 1,
      sym__newline,
  [16628] = 1,
    ACTIONS(2242), 1,
      sym_identifier,
  [16632] = 1,
    ACTIONS(2244), 1,
      sym_identifier,
  [16636] = 1,
    ACTIONS(2246), 1,
      sym_expression,
  [16640] = 1,
    ACTIONS(2248), 1,
      sym_identifier,
  [16644] = 1,
    ACTIONS(2250), 1,
      sym_identifier,
  [16648] = 1,
    ACTIONS(2252), 1,
      sym_identifier,
  [16652] = 1,
    ACTIONS(2254), 1,
      sym_expression,
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
  [SMALL_STATE(25)] = 404,
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
  [SMALL_STATE(46)] = 1335,
  [SMALL_STATE(47)] = 1379,
  [SMALL_STATE(48)] = 1421,
  [SMALL_STATE(49)] = 1465,
  [SMALL_STATE(50)] = 1509,
  [SMALL_STATE(51)] = 1551,
  [SMALL_STATE(52)] = 1595,
  [SMALL_STATE(53)] = 1639,
  [SMALL_STATE(54)] = 1685,
  [SMALL_STATE(55)] = 1729,
  [SMALL_STATE(56)] = 1773,
  [SMALL_STATE(57)] = 1817,
  [SMALL_STATE(58)] = 1861,
  [SMALL_STATE(59)] = 1903,
  [SMALL_STATE(60)] = 1947,
  [SMALL_STATE(61)] = 1993,
  [SMALL_STATE(62)] = 2039,
  [SMALL_STATE(63)] = 2085,
  [SMALL_STATE(64)] = 2131,
  [SMALL_STATE(65)] = 2175,
  [SMALL_STATE(66)] = 2216,
  [SMALL_STATE(67)] = 2257,
  [SMALL_STATE(68)] = 2298,
  [SMALL_STATE(69)] = 2339,
  [SMALL_STATE(70)] = 2380,
  [SMALL_STATE(71)] = 2421,
  [SMALL_STATE(72)] = 2462,
  [SMALL_STATE(73)] = 2503,
  [SMALL_STATE(74)] = 2544,
  [SMALL_STATE(75)] = 2585,
  [SMALL_STATE(76)] = 2626,
  [SMALL_STATE(77)] = 2667,
  [SMALL_STATE(78)] = 2708,
  [SMALL_STATE(79)] = 2749,
  [SMALL_STATE(80)] = 2790,
  [SMALL_STATE(81)] = 2831,
  [SMALL_STATE(82)] = 2872,
  [SMALL_STATE(83)] = 2913,
  [SMALL_STATE(84)] = 2954,
  [SMALL_STATE(85)] = 2995,
  [SMALL_STATE(86)] = 3036,
  [SMALL_STATE(87)] = 3077,
  [SMALL_STATE(88)] = 3118,
  [SMALL_STATE(89)] = 3159,
  [SMALL_STATE(90)] = 3200,
  [SMALL_STATE(91)] = 3241,
  [SMALL_STATE(92)] = 3282,
  [SMALL_STATE(93)] = 3323,
  [SMALL_STATE(94)] = 3364,
  [SMALL_STATE(95)] = 3405,
  [SMALL_STATE(96)] = 3446,
  [SMALL_STATE(97)] = 3487,
  [SMALL_STATE(98)] = 3528,
  [SMALL_STATE(99)] = 3569,
  [SMALL_STATE(100)] = 3610,
  [SMALL_STATE(101)] = 3651,
  [SMALL_STATE(102)] = 3692,
  [SMALL_STATE(103)] = 3733,
  [SMALL_STATE(104)] = 3774,
  [SMALL_STATE(105)] = 3815,
  [SMALL_STATE(106)] = 3856,
  [SMALL_STATE(107)] = 3897,
  [SMALL_STATE(108)] = 3938,
  [SMALL_STATE(109)] = 3979,
  [SMALL_STATE(110)] = 4020,
  [SMALL_STATE(111)] = 4061,
  [SMALL_STATE(112)] = 4102,
  [SMALL_STATE(113)] = 4143,
  [SMALL_STATE(114)] = 4184,
  [SMALL_STATE(115)] = 4225,
  [SMALL_STATE(116)] = 4266,
  [SMALL_STATE(117)] = 4307,
  [SMALL_STATE(118)] = 4348,
  [SMALL_STATE(119)] = 4389,
  [SMALL_STATE(120)] = 4430,
  [SMALL_STATE(121)] = 4471,
  [SMALL_STATE(122)] = 4512,
  [SMALL_STATE(123)] = 4553,
  [SMALL_STATE(124)] = 4594,
  [SMALL_STATE(125)] = 4635,
  [SMALL_STATE(126)] = 4676,
  [SMALL_STATE(127)] = 4717,
  [SMALL_STATE(128)] = 4758,
  [SMALL_STATE(129)] = 4799,
  [SMALL_STATE(130)] = 4840,
  [SMALL_STATE(131)] = 4881,
  [SMALL_STATE(132)] = 4922,
  [SMALL_STATE(133)] = 4963,
  [SMALL_STATE(134)] = 5004,
  [SMALL_STATE(135)] = 5045,
  [SMALL_STATE(136)] = 5086,
  [SMALL_STATE(137)] = 5127,
  [SMALL_STATE(138)] = 5168,
  [SMALL_STATE(139)] = 5209,
  [SMALL_STATE(140)] = 5250,
  [SMALL_STATE(141)] = 5291,
  [SMALL_STATE(142)] = 5332,
  [SMALL_STATE(143)] = 5373,
  [SMALL_STATE(144)] = 5414,
  [SMALL_STATE(145)] = 5455,
  [SMALL_STATE(146)] = 5496,
  [SMALL_STATE(147)] = 5537,
  [SMALL_STATE(148)] = 5578,
  [SMALL_STATE(149)] = 5619,
  [SMALL_STATE(150)] = 5660,
  [SMALL_STATE(151)] = 5701,
  [SMALL_STATE(152)] = 5742,
  [SMALL_STATE(153)] = 5783,
  [SMALL_STATE(154)] = 5824,
  [SMALL_STATE(155)] = 5865,
  [SMALL_STATE(156)] = 5906,
  [SMALL_STATE(157)] = 5947,
  [SMALL_STATE(158)] = 5988,
  [SMALL_STATE(159)] = 6029,
  [SMALL_STATE(160)] = 6070,
  [SMALL_STATE(161)] = 6111,
  [SMALL_STATE(162)] = 6152,
  [SMALL_STATE(163)] = 6193,
  [SMALL_STATE(164)] = 6234,
  [SMALL_STATE(165)] = 6275,
  [SMALL_STATE(166)] = 6316,
  [SMALL_STATE(167)] = 6357,
  [SMALL_STATE(168)] = 6398,
  [SMALL_STATE(169)] = 6439,
  [SMALL_STATE(170)] = 6480,
  [SMALL_STATE(171)] = 6521,
  [SMALL_STATE(172)] = 6562,
  [SMALL_STATE(173)] = 6603,
  [SMALL_STATE(174)] = 6644,
  [SMALL_STATE(175)] = 6685,
  [SMALL_STATE(176)] = 6726,
  [SMALL_STATE(177)] = 6767,
  [SMALL_STATE(178)] = 6808,
  [SMALL_STATE(179)] = 6849,
  [SMALL_STATE(180)] = 6890,
  [SMALL_STATE(181)] = 6931,
  [SMALL_STATE(182)] = 6972,
  [SMALL_STATE(183)] = 7013,
  [SMALL_STATE(184)] = 7054,
  [SMALL_STATE(185)] = 7095,
  [SMALL_STATE(186)] = 7136,
  [SMALL_STATE(187)] = 7177,
  [SMALL_STATE(188)] = 7218,
  [SMALL_STATE(189)] = 7259,
  [SMALL_STATE(190)] = 7300,
  [SMALL_STATE(191)] = 7341,
  [SMALL_STATE(192)] = 7382,
  [SMALL_STATE(193)] = 7423,
  [SMALL_STATE(194)] = 7464,
  [SMALL_STATE(195)] = 7505,
  [SMALL_STATE(196)] = 7546,
  [SMALL_STATE(197)] = 7587,
  [SMALL_STATE(198)] = 7628,
  [SMALL_STATE(199)] = 7669,
  [SMALL_STATE(200)] = 7710,
  [SMALL_STATE(201)] = 7751,
  [SMALL_STATE(202)] = 7792,
  [SMALL_STATE(203)] = 7833,
  [SMALL_STATE(204)] = 7874,
  [SMALL_STATE(205)] = 7915,
  [SMALL_STATE(206)] = 7956,
  [SMALL_STATE(207)] = 7997,
  [SMALL_STATE(208)] = 8038,
  [SMALL_STATE(209)] = 8079,
  [SMALL_STATE(210)] = 8120,
  [SMALL_STATE(211)] = 8161,
  [SMALL_STATE(212)] = 8202,
  [SMALL_STATE(213)] = 8243,
  [SMALL_STATE(214)] = 8284,
  [SMALL_STATE(215)] = 8325,
  [SMALL_STATE(216)] = 8366,
  [SMALL_STATE(217)] = 8407,
  [SMALL_STATE(218)] = 8448,
  [SMALL_STATE(219)] = 8489,
  [SMALL_STATE(220)] = 8530,
  [SMALL_STATE(221)] = 8571,
  [SMALL_STATE(222)] = 8612,
  [SMALL_STATE(223)] = 8653,
  [SMALL_STATE(224)] = 8694,
  [SMALL_STATE(225)] = 8735,
  [SMALL_STATE(226)] = 8776,
  [SMALL_STATE(227)] = 8817,
  [SMALL_STATE(228)] = 8858,
  [SMALL_STATE(229)] = 8899,
  [SMALL_STATE(230)] = 8940,
  [SMALL_STATE(231)] = 8981,
  [SMALL_STATE(232)] = 9022,
  [SMALL_STATE(233)] = 9063,
  [SMALL_STATE(234)] = 9104,
  [SMALL_STATE(235)] = 9145,
  [SMALL_STATE(236)] = 9186,
  [SMALL_STATE(237)] = 9227,
  [SMALL_STATE(238)] = 9268,
  [SMALL_STATE(239)] = 9309,
  [SMALL_STATE(240)] = 9350,
  [SMALL_STATE(241)] = 9391,
  [SMALL_STATE(242)] = 9432,
  [SMALL_STATE(243)] = 9473,
  [SMALL_STATE(244)] = 9514,
  [SMALL_STATE(245)] = 9555,
  [SMALL_STATE(246)] = 9596,
  [SMALL_STATE(247)] = 9637,
  [SMALL_STATE(248)] = 9678,
  [SMALL_STATE(249)] = 9719,
  [SMALL_STATE(250)] = 9760,
  [SMALL_STATE(251)] = 9801,
  [SMALL_STATE(252)] = 9842,
  [SMALL_STATE(253)] = 9883,
  [SMALL_STATE(254)] = 9924,
  [SMALL_STATE(255)] = 9965,
  [SMALL_STATE(256)] = 10006,
  [SMALL_STATE(257)] = 10047,
  [SMALL_STATE(258)] = 10088,
  [SMALL_STATE(259)] = 10129,
  [SMALL_STATE(260)] = 10170,
  [SMALL_STATE(261)] = 10211,
  [SMALL_STATE(262)] = 10252,
  [SMALL_STATE(263)] = 10293,
  [SMALL_STATE(264)] = 10334,
  [SMALL_STATE(265)] = 10375,
  [SMALL_STATE(266)] = 10416,
  [SMALL_STATE(267)] = 10457,
  [SMALL_STATE(268)] = 10498,
  [SMALL_STATE(269)] = 10539,
  [SMALL_STATE(270)] = 10580,
  [SMALL_STATE(271)] = 10621,
  [SMALL_STATE(272)] = 10662,
  [SMALL_STATE(273)] = 10703,
  [SMALL_STATE(274)] = 10744,
  [SMALL_STATE(275)] = 10785,
  [SMALL_STATE(276)] = 10826,
  [SMALL_STATE(277)] = 10867,
  [SMALL_STATE(278)] = 10908,
  [SMALL_STATE(279)] = 10949,
  [SMALL_STATE(280)] = 10990,
  [SMALL_STATE(281)] = 11031,
  [SMALL_STATE(282)] = 11072,
  [SMALL_STATE(283)] = 11113,
  [SMALL_STATE(284)] = 11154,
  [SMALL_STATE(285)] = 11195,
  [SMALL_STATE(286)] = 11236,
  [SMALL_STATE(287)] = 11277,
  [SMALL_STATE(288)] = 11318,
  [SMALL_STATE(289)] = 11359,
  [SMALL_STATE(290)] = 11400,
  [SMALL_STATE(291)] = 11441,
  [SMALL_STATE(292)] = 11482,
  [SMALL_STATE(293)] = 11523,
  [SMALL_STATE(294)] = 11564,
  [SMALL_STATE(295)] = 11605,
  [SMALL_STATE(296)] = 11646,
  [SMALL_STATE(297)] = 11687,
  [SMALL_STATE(298)] = 11728,
  [SMALL_STATE(299)] = 11769,
  [SMALL_STATE(300)] = 11810,
  [SMALL_STATE(301)] = 11851,
  [SMALL_STATE(302)] = 11892,
  [SMALL_STATE(303)] = 11933,
  [SMALL_STATE(304)] = 11974,
  [SMALL_STATE(305)] = 12015,
  [SMALL_STATE(306)] = 12056,
  [SMALL_STATE(307)] = 12097,
  [SMALL_STATE(308)] = 12135,
  [SMALL_STATE(309)] = 12173,
  [SMALL_STATE(310)] = 12211,
  [SMALL_STATE(311)] = 12235,
  [SMALL_STATE(312)] = 12253,
  [SMALL_STATE(313)] = 12271,
  [SMALL_STATE(314)] = 12289,
  [SMALL_STATE(315)] = 12307,
  [SMALL_STATE(316)] = 12325,
  [SMALL_STATE(317)] = 12352,
  [SMALL_STATE(318)] = 12379,
  [SMALL_STATE(319)] = 12406,
  [SMALL_STATE(320)] = 12433,
  [SMALL_STATE(321)] = 12460,
  [SMALL_STATE(322)] = 12482,
  [SMALL_STATE(323)] = 12516,
  [SMALL_STATE(324)] = 12540,
  [SMALL_STATE(325)] = 12564,
  [SMALL_STATE(326)] = 12598,
  [SMALL_STATE(327)] = 12620,
  [SMALL_STATE(328)] = 12642,
  [SMALL_STATE(329)] = 12664,
  [SMALL_STATE(330)] = 12686,
  [SMALL_STATE(331)] = 12710,
  [SMALL_STATE(332)] = 12732,
  [SMALL_STATE(333)] = 12756,
  [SMALL_STATE(334)] = 12775,
  [SMALL_STATE(335)] = 12794,
  [SMALL_STATE(336)] = 12823,
  [SMALL_STATE(337)] = 12852,
  [SMALL_STATE(338)] = 12871,
  [SMALL_STATE(339)] = 12900,
  [SMALL_STATE(340)] = 12929,
  [SMALL_STATE(341)] = 12948,
  [SMALL_STATE(342)] = 12967,
  [SMALL_STATE(343)] = 12995,
  [SMALL_STATE(344)] = 13023,
  [SMALL_STATE(345)] = 13048,
  [SMALL_STATE(346)] = 13061,
  [SMALL_STATE(347)] = 13086,
  [SMALL_STATE(348)] = 13099,
  [SMALL_STATE(349)] = 13112,
  [SMALL_STATE(350)] = 13125,
  [SMALL_STATE(351)] = 13150,
  [SMALL_STATE(352)] = 13163,
  [SMALL_STATE(353)] = 13176,
  [SMALL_STATE(354)] = 13201,
  [SMALL_STATE(355)] = 13219,
  [SMALL_STATE(356)] = 13233,
  [SMALL_STATE(357)] = 13245,
  [SMALL_STATE(358)] = 13267,
  [SMALL_STATE(359)] = 13283,
  [SMALL_STATE(360)] = 13301,
  [SMALL_STATE(361)] = 13321,
  [SMALL_STATE(362)] = 13339,
  [SMALL_STATE(363)] = 13359,
  [SMALL_STATE(364)] = 13377,
  [SMALL_STATE(365)] = 13393,
  [SMALL_STATE(366)] = 13415,
  [SMALL_STATE(367)] = 13429,
  [SMALL_STATE(368)] = 13443,
  [SMALL_STATE(369)] = 13462,
  [SMALL_STATE(370)] = 13473,
  [SMALL_STATE(371)] = 13484,
  [SMALL_STATE(372)] = 13497,
  [SMALL_STATE(373)] = 13510,
  [SMALL_STATE(374)] = 13525,
  [SMALL_STATE(375)] = 13542,
  [SMALL_STATE(376)] = 13557,
  [SMALL_STATE(377)] = 13574,
  [SMALL_STATE(378)] = 13589,
  [SMALL_STATE(379)] = 13600,
  [SMALL_STATE(380)] = 13619,
  [SMALL_STATE(381)] = 13632,
  [SMALL_STATE(382)] = 13649,
  [SMALL_STATE(383)] = 13668,
  [SMALL_STATE(384)] = 13687,
  [SMALL_STATE(385)] = 13698,
  [SMALL_STATE(386)] = 13713,
  [SMALL_STATE(387)] = 13728,
  [SMALL_STATE(388)] = 13743,
  [SMALL_STATE(389)] = 13758,
  [SMALL_STATE(390)] = 13773,
  [SMALL_STATE(391)] = 13788,
  [SMALL_STATE(392)] = 13803,
  [SMALL_STATE(393)] = 13820,
  [SMALL_STATE(394)] = 13833,
  [SMALL_STATE(395)] = 13846,
  [SMALL_STATE(396)] = 13857,
  [SMALL_STATE(397)] = 13868,
  [SMALL_STATE(398)] = 13883,
  [SMALL_STATE(399)] = 13894,
  [SMALL_STATE(400)] = 13910,
  [SMALL_STATE(401)] = 13926,
  [SMALL_STATE(402)] = 13942,
  [SMALL_STATE(403)] = 13958,
  [SMALL_STATE(404)] = 13974,
  [SMALL_STATE(405)] = 13988,
  [SMALL_STATE(406)] = 14002,
  [SMALL_STATE(407)] = 14012,
  [SMALL_STATE(408)] = 14028,
  [SMALL_STATE(409)] = 14044,
  [SMALL_STATE(410)] = 14056,
  [SMALL_STATE(411)] = 14070,
  [SMALL_STATE(412)] = 14082,
  [SMALL_STATE(413)] = 14096,
  [SMALL_STATE(414)] = 14110,
  [SMALL_STATE(415)] = 14124,
  [SMALL_STATE(416)] = 14140,
  [SMALL_STATE(417)] = 14154,
  [SMALL_STATE(418)] = 14170,
  [SMALL_STATE(419)] = 14186,
  [SMALL_STATE(420)] = 14200,
  [SMALL_STATE(421)] = 14214,
  [SMALL_STATE(422)] = 14228,
  [SMALL_STATE(423)] = 14244,
  [SMALL_STATE(424)] = 14256,
  [SMALL_STATE(425)] = 14266,
  [SMALL_STATE(426)] = 14278,
  [SMALL_STATE(427)] = 14290,
  [SMALL_STATE(428)] = 14304,
  [SMALL_STATE(429)] = 14314,
  [SMALL_STATE(430)] = 14326,
  [SMALL_STATE(431)] = 14338,
  [SMALL_STATE(432)] = 14354,
  [SMALL_STATE(433)] = 14366,
  [SMALL_STATE(434)] = 14378,
  [SMALL_STATE(435)] = 14390,
  [SMALL_STATE(436)] = 14406,
  [SMALL_STATE(437)] = 14420,
  [SMALL_STATE(438)] = 14436,
  [SMALL_STATE(439)] = 14452,
  [SMALL_STATE(440)] = 14465,
  [SMALL_STATE(441)] = 14478,
  [SMALL_STATE(442)] = 14491,
  [SMALL_STATE(443)] = 14504,
  [SMALL_STATE(444)] = 14517,
  [SMALL_STATE(445)] = 14528,
  [SMALL_STATE(446)] = 14539,
  [SMALL_STATE(447)] = 14552,
  [SMALL_STATE(448)] = 14565,
  [SMALL_STATE(449)] = 14578,
  [SMALL_STATE(450)] = 14591,
  [SMALL_STATE(451)] = 14602,
  [SMALL_STATE(452)] = 14615,
  [SMALL_STATE(453)] = 14628,
  [SMALL_STATE(454)] = 14641,
  [SMALL_STATE(455)] = 14654,
  [SMALL_STATE(456)] = 14667,
  [SMALL_STATE(457)] = 14680,
  [SMALL_STATE(458)] = 14693,
  [SMALL_STATE(459)] = 14706,
  [SMALL_STATE(460)] = 14719,
  [SMALL_STATE(461)] = 14732,
  [SMALL_STATE(462)] = 14745,
  [SMALL_STATE(463)] = 14758,
  [SMALL_STATE(464)] = 14771,
  [SMALL_STATE(465)] = 14784,
  [SMALL_STATE(466)] = 14797,
  [SMALL_STATE(467)] = 14808,
  [SMALL_STATE(468)] = 14819,
  [SMALL_STATE(469)] = 14832,
  [SMALL_STATE(470)] = 14845,
  [SMALL_STATE(471)] = 14858,
  [SMALL_STATE(472)] = 14871,
  [SMALL_STATE(473)] = 14884,
  [SMALL_STATE(474)] = 14894,
  [SMALL_STATE(475)] = 14900,
  [SMALL_STATE(476)] = 14906,
  [SMALL_STATE(477)] = 14916,
  [SMALL_STATE(478)] = 14926,
  [SMALL_STATE(479)] = 14936,
  [SMALL_STATE(480)] = 14946,
  [SMALL_STATE(481)] = 14952,
  [SMALL_STATE(482)] = 14962,
  [SMALL_STATE(483)] = 14972,
  [SMALL_STATE(484)] = 14982,
  [SMALL_STATE(485)] = 14992,
  [SMALL_STATE(486)] = 15002,
  [SMALL_STATE(487)] = 15012,
  [SMALL_STATE(488)] = 15022,
  [SMALL_STATE(489)] = 15032,
  [SMALL_STATE(490)] = 15042,
  [SMALL_STATE(491)] = 15048,
  [SMALL_STATE(492)] = 15054,
  [SMALL_STATE(493)] = 15064,
  [SMALL_STATE(494)] = 15070,
  [SMALL_STATE(495)] = 15080,
  [SMALL_STATE(496)] = 15090,
  [SMALL_STATE(497)] = 15100,
  [SMALL_STATE(498)] = 15110,
  [SMALL_STATE(499)] = 15120,
  [SMALL_STATE(500)] = 15130,
  [SMALL_STATE(501)] = 15136,
  [SMALL_STATE(502)] = 15146,
  [SMALL_STATE(503)] = 15156,
  [SMALL_STATE(504)] = 15166,
  [SMALL_STATE(505)] = 15176,
  [SMALL_STATE(506)] = 15182,
  [SMALL_STATE(507)] = 15192,
  [SMALL_STATE(508)] = 15198,
  [SMALL_STATE(509)] = 15208,
  [SMALL_STATE(510)] = 15214,
  [SMALL_STATE(511)] = 15224,
  [SMALL_STATE(512)] = 15234,
  [SMALL_STATE(513)] = 15244,
  [SMALL_STATE(514)] = 15254,
  [SMALL_STATE(515)] = 15264,
  [SMALL_STATE(516)] = 15270,
  [SMALL_STATE(517)] = 15280,
  [SMALL_STATE(518)] = 15290,
  [SMALL_STATE(519)] = 15300,
  [SMALL_STATE(520)] = 15310,
  [SMALL_STATE(521)] = 15320,
  [SMALL_STATE(522)] = 15330,
  [SMALL_STATE(523)] = 15336,
  [SMALL_STATE(524)] = 15346,
  [SMALL_STATE(525)] = 15356,
  [SMALL_STATE(526)] = 15366,
  [SMALL_STATE(527)] = 15376,
  [SMALL_STATE(528)] = 15386,
  [SMALL_STATE(529)] = 15396,
  [SMALL_STATE(530)] = 15406,
  [SMALL_STATE(531)] = 15416,
  [SMALL_STATE(532)] = 15426,
  [SMALL_STATE(533)] = 15436,
  [SMALL_STATE(534)] = 15446,
  [SMALL_STATE(535)] = 15453,
  [SMALL_STATE(536)] = 15460,
  [SMALL_STATE(537)] = 15467,
  [SMALL_STATE(538)] = 15474,
  [SMALL_STATE(539)] = 15481,
  [SMALL_STATE(540)] = 15488,
  [SMALL_STATE(541)] = 15493,
  [SMALL_STATE(542)] = 15500,
  [SMALL_STATE(543)] = 15507,
  [SMALL_STATE(544)] = 15514,
  [SMALL_STATE(545)] = 15521,
  [SMALL_STATE(546)] = 15528,
  [SMALL_STATE(547)] = 15535,
  [SMALL_STATE(548)] = 15542,
  [SMALL_STATE(549)] = 15549,
  [SMALL_STATE(550)] = 15556,
  [SMALL_STATE(551)] = 15563,
  [SMALL_STATE(552)] = 15570,
  [SMALL_STATE(553)] = 15577,
  [SMALL_STATE(554)] = 15584,
  [SMALL_STATE(555)] = 15591,
  [SMALL_STATE(556)] = 15598,
  [SMALL_STATE(557)] = 15603,
  [SMALL_STATE(558)] = 15610,
  [SMALL_STATE(559)] = 15615,
  [SMALL_STATE(560)] = 15622,
  [SMALL_STATE(561)] = 15629,
  [SMALL_STATE(562)] = 15636,
  [SMALL_STATE(563)] = 15643,
  [SMALL_STATE(564)] = 15650,
  [SMALL_STATE(565)] = 15657,
  [SMALL_STATE(566)] = 15664,
  [SMALL_STATE(567)] = 15671,
  [SMALL_STATE(568)] = 15678,
  [SMALL_STATE(569)] = 15685,
  [SMALL_STATE(570)] = 15692,
  [SMALL_STATE(571)] = 15699,
  [SMALL_STATE(572)] = 15704,
  [SMALL_STATE(573)] = 15711,
  [SMALL_STATE(574)] = 15718,
  [SMALL_STATE(575)] = 15725,
  [SMALL_STATE(576)] = 15732,
  [SMALL_STATE(577)] = 15739,
  [SMALL_STATE(578)] = 15746,
  [SMALL_STATE(579)] = 15753,
  [SMALL_STATE(580)] = 15760,
  [SMALL_STATE(581)] = 15764,
  [SMALL_STATE(582)] = 15768,
  [SMALL_STATE(583)] = 15772,
  [SMALL_STATE(584)] = 15776,
  [SMALL_STATE(585)] = 15780,
  [SMALL_STATE(586)] = 15784,
  [SMALL_STATE(587)] = 15788,
  [SMALL_STATE(588)] = 15792,
  [SMALL_STATE(589)] = 15796,
  [SMALL_STATE(590)] = 15800,
  [SMALL_STATE(591)] = 15804,
  [SMALL_STATE(592)] = 15808,
  [SMALL_STATE(593)] = 15812,
  [SMALL_STATE(594)] = 15816,
  [SMALL_STATE(595)] = 15820,
  [SMALL_STATE(596)] = 15824,
  [SMALL_STATE(597)] = 15828,
  [SMALL_STATE(598)] = 15832,
  [SMALL_STATE(599)] = 15836,
  [SMALL_STATE(600)] = 15840,
  [SMALL_STATE(601)] = 15844,
  [SMALL_STATE(602)] = 15848,
  [SMALL_STATE(603)] = 15852,
  [SMALL_STATE(604)] = 15856,
  [SMALL_STATE(605)] = 15860,
  [SMALL_STATE(606)] = 15864,
  [SMALL_STATE(607)] = 15868,
  [SMALL_STATE(608)] = 15872,
  [SMALL_STATE(609)] = 15876,
  [SMALL_STATE(610)] = 15880,
  [SMALL_STATE(611)] = 15884,
  [SMALL_STATE(612)] = 15888,
  [SMALL_STATE(613)] = 15892,
  [SMALL_STATE(614)] = 15896,
  [SMALL_STATE(615)] = 15900,
  [SMALL_STATE(616)] = 15904,
  [SMALL_STATE(617)] = 15908,
  [SMALL_STATE(618)] = 15912,
  [SMALL_STATE(619)] = 15916,
  [SMALL_STATE(620)] = 15920,
  [SMALL_STATE(621)] = 15924,
  [SMALL_STATE(622)] = 15928,
  [SMALL_STATE(623)] = 15932,
  [SMALL_STATE(624)] = 15936,
  [SMALL_STATE(625)] = 15940,
  [SMALL_STATE(626)] = 15944,
  [SMALL_STATE(627)] = 15948,
  [SMALL_STATE(628)] = 15952,
  [SMALL_STATE(629)] = 15956,
  [SMALL_STATE(630)] = 15960,
  [SMALL_STATE(631)] = 15964,
  [SMALL_STATE(632)] = 15968,
  [SMALL_STATE(633)] = 15972,
  [SMALL_STATE(634)] = 15976,
  [SMALL_STATE(635)] = 15980,
  [SMALL_STATE(636)] = 15984,
  [SMALL_STATE(637)] = 15988,
  [SMALL_STATE(638)] = 15992,
  [SMALL_STATE(639)] = 15996,
  [SMALL_STATE(640)] = 16000,
  [SMALL_STATE(641)] = 16004,
  [SMALL_STATE(642)] = 16008,
  [SMALL_STATE(643)] = 16012,
  [SMALL_STATE(644)] = 16016,
  [SMALL_STATE(645)] = 16020,
  [SMALL_STATE(646)] = 16024,
  [SMALL_STATE(647)] = 16028,
  [SMALL_STATE(648)] = 16032,
  [SMALL_STATE(649)] = 16036,
  [SMALL_STATE(650)] = 16040,
  [SMALL_STATE(651)] = 16044,
  [SMALL_STATE(652)] = 16048,
  [SMALL_STATE(653)] = 16052,
  [SMALL_STATE(654)] = 16056,
  [SMALL_STATE(655)] = 16060,
  [SMALL_STATE(656)] = 16064,
  [SMALL_STATE(657)] = 16068,
  [SMALL_STATE(658)] = 16072,
  [SMALL_STATE(659)] = 16076,
  [SMALL_STATE(660)] = 16080,
  [SMALL_STATE(661)] = 16084,
  [SMALL_STATE(662)] = 16088,
  [SMALL_STATE(663)] = 16092,
  [SMALL_STATE(664)] = 16096,
  [SMALL_STATE(665)] = 16100,
  [SMALL_STATE(666)] = 16104,
  [SMALL_STATE(667)] = 16108,
  [SMALL_STATE(668)] = 16112,
  [SMALL_STATE(669)] = 16116,
  [SMALL_STATE(670)] = 16120,
  [SMALL_STATE(671)] = 16124,
  [SMALL_STATE(672)] = 16128,
  [SMALL_STATE(673)] = 16132,
  [SMALL_STATE(674)] = 16136,
  [SMALL_STATE(675)] = 16140,
  [SMALL_STATE(676)] = 16144,
  [SMALL_STATE(677)] = 16148,
  [SMALL_STATE(678)] = 16152,
  [SMALL_STATE(679)] = 16156,
  [SMALL_STATE(680)] = 16160,
  [SMALL_STATE(681)] = 16164,
  [SMALL_STATE(682)] = 16168,
  [SMALL_STATE(683)] = 16172,
  [SMALL_STATE(684)] = 16176,
  [SMALL_STATE(685)] = 16180,
  [SMALL_STATE(686)] = 16184,
  [SMALL_STATE(687)] = 16188,
  [SMALL_STATE(688)] = 16192,
  [SMALL_STATE(689)] = 16196,
  [SMALL_STATE(690)] = 16200,
  [SMALL_STATE(691)] = 16204,
  [SMALL_STATE(692)] = 16208,
  [SMALL_STATE(693)] = 16212,
  [SMALL_STATE(694)] = 16216,
  [SMALL_STATE(695)] = 16220,
  [SMALL_STATE(696)] = 16224,
  [SMALL_STATE(697)] = 16228,
  [SMALL_STATE(698)] = 16232,
  [SMALL_STATE(699)] = 16236,
  [SMALL_STATE(700)] = 16240,
  [SMALL_STATE(701)] = 16244,
  [SMALL_STATE(702)] = 16248,
  [SMALL_STATE(703)] = 16252,
  [SMALL_STATE(704)] = 16256,
  [SMALL_STATE(705)] = 16260,
  [SMALL_STATE(706)] = 16264,
  [SMALL_STATE(707)] = 16268,
  [SMALL_STATE(708)] = 16272,
  [SMALL_STATE(709)] = 16276,
  [SMALL_STATE(710)] = 16280,
  [SMALL_STATE(711)] = 16284,
  [SMALL_STATE(712)] = 16288,
  [SMALL_STATE(713)] = 16292,
  [SMALL_STATE(714)] = 16296,
  [SMALL_STATE(715)] = 16300,
  [SMALL_STATE(716)] = 16304,
  [SMALL_STATE(717)] = 16308,
  [SMALL_STATE(718)] = 16312,
  [SMALL_STATE(719)] = 16316,
  [SMALL_STATE(720)] = 16320,
  [SMALL_STATE(721)] = 16324,
  [SMALL_STATE(722)] = 16328,
  [SMALL_STATE(723)] = 16332,
  [SMALL_STATE(724)] = 16336,
  [SMALL_STATE(725)] = 16340,
  [SMALL_STATE(726)] = 16344,
  [SMALL_STATE(727)] = 16348,
  [SMALL_STATE(728)] = 16352,
  [SMALL_STATE(729)] = 16356,
  [SMALL_STATE(730)] = 16360,
  [SMALL_STATE(731)] = 16364,
  [SMALL_STATE(732)] = 16368,
  [SMALL_STATE(733)] = 16372,
  [SMALL_STATE(734)] = 16376,
  [SMALL_STATE(735)] = 16380,
  [SMALL_STATE(736)] = 16384,
  [SMALL_STATE(737)] = 16388,
  [SMALL_STATE(738)] = 16392,
  [SMALL_STATE(739)] = 16396,
  [SMALL_STATE(740)] = 16400,
  [SMALL_STATE(741)] = 16404,
  [SMALL_STATE(742)] = 16408,
  [SMALL_STATE(743)] = 16412,
  [SMALL_STATE(744)] = 16416,
  [SMALL_STATE(745)] = 16420,
  [SMALL_STATE(746)] = 16424,
  [SMALL_STATE(747)] = 16428,
  [SMALL_STATE(748)] = 16432,
  [SMALL_STATE(749)] = 16436,
  [SMALL_STATE(750)] = 16440,
  [SMALL_STATE(751)] = 16444,
  [SMALL_STATE(752)] = 16448,
  [SMALL_STATE(753)] = 16452,
  [SMALL_STATE(754)] = 16456,
  [SMALL_STATE(755)] = 16460,
  [SMALL_STATE(756)] = 16464,
  [SMALL_STATE(757)] = 16468,
  [SMALL_STATE(758)] = 16472,
  [SMALL_STATE(759)] = 16476,
  [SMALL_STATE(760)] = 16480,
  [SMALL_STATE(761)] = 16484,
  [SMALL_STATE(762)] = 16488,
  [SMALL_STATE(763)] = 16492,
  [SMALL_STATE(764)] = 16496,
  [SMALL_STATE(765)] = 16500,
  [SMALL_STATE(766)] = 16504,
  [SMALL_STATE(767)] = 16508,
  [SMALL_STATE(768)] = 16512,
  [SMALL_STATE(769)] = 16516,
  [SMALL_STATE(770)] = 16520,
  [SMALL_STATE(771)] = 16524,
  [SMALL_STATE(772)] = 16528,
  [SMALL_STATE(773)] = 16532,
  [SMALL_STATE(774)] = 16536,
  [SMALL_STATE(775)] = 16540,
  [SMALL_STATE(776)] = 16544,
  [SMALL_STATE(777)] = 16548,
  [SMALL_STATE(778)] = 16552,
  [SMALL_STATE(779)] = 16556,
  [SMALL_STATE(780)] = 16560,
  [SMALL_STATE(781)] = 16564,
  [SMALL_STATE(782)] = 16568,
  [SMALL_STATE(783)] = 16572,
  [SMALL_STATE(784)] = 16576,
  [SMALL_STATE(785)] = 16580,
  [SMALL_STATE(786)] = 16584,
  [SMALL_STATE(787)] = 16588,
  [SMALL_STATE(788)] = 16592,
  [SMALL_STATE(789)] = 16596,
  [SMALL_STATE(790)] = 16600,
  [SMALL_STATE(791)] = 16604,
  [SMALL_STATE(792)] = 16608,
  [SMALL_STATE(793)] = 16612,
  [SMALL_STATE(794)] = 16616,
  [SMALL_STATE(795)] = 16620,
  [SMALL_STATE(796)] = 16624,
  [SMALL_STATE(797)] = 16628,
  [SMALL_STATE(798)] = 16632,
  [SMALL_STATE(799)] = 16636,
  [SMALL_STATE(800)] = 16640,
  [SMALL_STATE(801)] = 16644,
  [SMALL_STATE(802)] = 16648,
  [SMALL_STATE(803)] = 16652,
};

static const TSParseActionEntry ts_parse_actions[] = {
  [0] = {.entry = {.count = 0, .reusable = false}},
  [1] = {.entry = {.count = 1, .reusable = false}}, RECOVER(),
  [3] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_source_file, 0, 0, 0),
  [5] = {.entry = {.count = 1, .reusable = false}}, SHIFT(339),
  [7] = {.entry = {.count = 1, .reusable = true}}, SHIFT(792),
  [9] = {.entry = {.count = 1, .reusable = false}}, SHIFT(376),
  [11] = {.entry = {.count = 1, .reusable = false}}, SHIFT(476),
  [13] = {.entry = {.count = 1, .reusable = false}}, SHIFT(526),
  [15] = {.entry = {.count = 1, .reusable = false}}, SHIFT(427),
  [17] = {.entry = {.count = 1, .reusable = false}}, SHIFT(374),
  [19] = {.entry = {.count = 1, .reusable = false}}, SHIFT(547),
  [21] = {.entry = {.count = 1, .reusable = false}}, SHIFT(697),
  [23] = {.entry = {.count = 1, .reusable = false}}, SHIFT(511),
  [25] = {.entry = {.count = 1, .reusable = false}}, SHIFT(803),
  [27] = {.entry = {.count = 1, .reusable = false}}, SHIFT(723),
  [29] = {.entry = {.count = 1, .reusable = false}}, SHIFT(741),
  [31] = {.entry = {.count = 1, .reusable = false}}, SHIFT(757),
  [33] = {.entry = {.count = 1, .reusable = false}}, SHIFT(436),
  [35] = {.entry = {.count = 1, .reusable = false}}, SHIFT(554),
  [37] = {.entry = {.count = 1, .reusable = true}}, SHIFT(631),
  [39] = {.entry = {.count = 1, .reusable = false}}, SHIFT(521),
  [41] = {.entry = {.count = 1, .reusable = false}}, SHIFT(531),
  [43] = {.entry = {.count = 1, .reusable = false}}, SHIFT(549),
  [45] = {.entry = {.count = 1, .reusable = false}}, SHIFT(344),
  [47] = {.entry = {.count = 1, .reusable = false}}, SHIFT(499),
  [49] = {.entry = {.count = 1, .reusable = false}}, SHIFT(642),
  [51] = {.entry = {.count = 1, .reusable = false}}, SHIFT(708),
  [53] = {.entry = {.count = 1, .reusable = false}}, SHIFT(714),
  [55] = {.entry = {.count = 1, .reusable = false}}, SHIFT(766),
  [57] = {.entry = {.count = 1, .reusable = false}}, SHIFT(354),
  [59] = {.entry = {.count = 1, .reusable = false}}, SHIFT(797),
  [61] = {.entry = {.count = 1, .reusable = false}}, SHIFT(590),
  [63] = {.entry = {.count = 1, .reusable = false}}, SHIFT(591),
  [65] = {.entry = {.count = 1, .reusable = false}}, SHIFT(484),
  [67] = {.entry = {.count = 1, .reusable = false}}, SHIFT(543),
  [69] = {.entry = {.count = 1, .reusable = false}}, SHIFT(493),
  [71] = {.entry = {.count = 1, .reusable = true}}, SHIFT(31),
  [73] = {.entry = {.count = 1, .reusable = true}}, SHIFT(3),
  [75] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_source_file, 2, 0, 0),
  [77] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_source_file, 1, 0, 0),
  [79] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0),
  [81] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(339),
  [84] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(792),
  [87] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(376),
  [90] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(476),
  [93] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(526),
  [96] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(427),
  [99] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(374),
  [102] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(547),
  [105] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(697),
  [108] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(511),
  [111] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(803),
  [114] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(723),
  [117] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(741),
  [120] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(757),
  [123] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(436),
  [126] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(554),
  [129] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(631),
  [132] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(521),
  [135] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(531),
  [138] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(549),
  [141] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(344),
  [144] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(499),
  [147] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(642),
  [150] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(708),
  [153] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(714),
  [156] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(766),
  [159] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(354),
  [162] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(797),
  [165] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(590),
  [168] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(591),
  [171] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(484),
  [174] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(543),
  [177] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(493),
  [180] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(31),
  [183] = {.entry = {.count = 1, .reusable = false}}, SHIFT(336),
  [185] = {.entry = {.count = 1, .reusable = true}}, SHIFT(602),
  [187] = {.entry = {.count = 1, .reusable = false}}, SHIFT(381),
  [189] = {.entry = {.count = 1, .reusable = false}}, SHIFT(485),
  [191] = {.entry = {.count = 1, .reusable = false}}, SHIFT(513),
  [193] = {.entry = {.count = 1, .reusable = false}}, SHIFT(419),
  [195] = {.entry = {.count = 1, .reusable = false}}, SHIFT(392),
  [197] = {.entry = {.count = 1, .reusable = false}}, SHIFT(539),
  [199] = {.entry = {.count = 1, .reusable = false}}, SHIFT(607),
  [201] = {.entry = {.count = 1, .reusable = false}}, SHIFT(529),
  [203] = {.entry = {.count = 1, .reusable = false}}, SHIFT(705),
  [205] = {.entry = {.count = 1, .reusable = false}}, SHIFT(608),
  [207] = {.entry = {.count = 1, .reusable = false}}, SHIFT(768),
  [209] = {.entry = {.count = 1, .reusable = false}}, SHIFT(706),
  [211] = {.entry = {.count = 1, .reusable = false}}, SHIFT(420),
  [213] = {.entry = {.count = 1, .reusable = false}}, SHIFT(542),
  [215] = {.entry = {.count = 1, .reusable = true}}, SHIFT(707),
  [217] = {.entry = {.count = 1, .reusable = false}}, SHIFT(527),
  [219] = {.entry = {.count = 1, .reusable = false}}, SHIFT(528),
  [221] = {.entry = {.count = 1, .reusable = false}}, SHIFT(553),
  [223] = {.entry = {.count = 1, .reusable = false}}, SHIFT(346),
  [225] = {.entry = {.count = 1, .reusable = false}}, SHIFT(514),
  [227] = {.entry = {.count = 1, .reusable = false}}, SHIFT(612),
  [229] = {.entry = {.count = 1, .reusable = false}}, SHIFT(769),
  [231] = {.entry = {.count = 1, .reusable = false}}, SHIFT(770),
  [233] = {.entry = {.count = 1, .reusable = false}}, SHIFT(710),
  [235] = {.entry = {.count = 1, .reusable = false}}, SHIFT(361),
  [237] = {.entry = {.count = 1, .reusable = false}}, SHIFT(712),
  [239] = {.entry = {.count = 1, .reusable = false}}, SHIFT(713),
  [241] = {.entry = {.count = 1, .reusable = false}}, SHIFT(798),
  [243] = {.entry = {.count = 1, .reusable = false}}, SHIFT(486),
  [245] = {.entry = {.count = 1, .reusable = false}}, SHIFT(578),
  [247] = {.entry = {.count = 1, .reusable = false}}, SHIFT(515),
  [249] = {.entry = {.count = 1, .reusable = true}}, SHIFT(47),
  [251] = {.entry = {.count = 1, .reusable = true}}, SHIFT(123),
  [253] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(336),
  [256] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(602),
  [259] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(381),
  [262] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(485),
  [265] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(513),
  [268] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(419),
  [271] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(392),
  [274] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(539),
  [277] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(607),
  [280] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(529),
  [283] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(705),
  [286] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(608),
  [289] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(768),
  [292] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(706),
  [295] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(420),
  [298] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(542),
  [301] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(707),
  [304] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(527),
  [307] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(528),
  [310] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(553),
  [313] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(346),
  [316] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(514),
  [319] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(612),
  [322] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(769),
  [325] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(770),
  [328] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(710),
  [331] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(361),
  [334] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(712),
  [337] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(713),
  [340] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(798),
  [343] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(486),
  [346] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(578),
  [349] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(515),
  [352] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_file_repeat1, 2, 0, 0), SHIFT_REPEAT(47),
  [355] = {.entry = {.count = 1, .reusable = true}}, SHIFT(33),
  [357] = {.entry = {.count = 1, .reusable = true}}, SHIFT(291),
  [359] = {.entry = {.count = 1, .reusable = true}}, SHIFT(378),
  [361] = {.entry = {.count = 1, .reusable = true}}, SHIFT(32),
  [363] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_statement, 4, 0, 10),
  [365] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_statement, 4, 0, 10),
  [367] = {.entry = {.count = 1, .reusable = false}}, SHIFT(586),
  [369] = {.entry = {.count = 1, .reusable = false}}, SHIFT(481),
  [371] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_statement, 3, 0, 10),
  [373] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_statement, 3, 0, 10),
  [375] = {.entry = {.count = 1, .reusable = false}}, SHIFT(742),
  [377] = {.entry = {.count = 1, .reusable = false}}, SHIFT(497),
  [379] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_if_statement_repeat1, 2, 0, 0),
  [381] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_if_statement_repeat1, 2, 0, 0),
  [383] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_if_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(586),
  [386] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_if_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(742),
  [389] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__block, 1, 0, 0),
  [391] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym__block, 1, 0, 0),
  [393] = {.entry = {.count = 1, .reusable = true}}, SHIFT(25),
  [395] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__block_colon, 2, 0, 0),
  [397] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym__block_colon, 2, 0, 0),
  [399] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__block, 2, 0, 0),
  [401] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym__block, 2, 0, 0),
  [403] = {.entry = {.count = 1, .reusable = true}}, SHIFT(16),
  [405] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__block_colon, 1, 0, 0),
  [407] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym__block_colon, 1, 0, 0),
  [409] = {.entry = {.count = 1, .reusable = true}}, SHIFT(24),
  [411] = {.entry = {.count = 1, .reusable = true}}, SHIFT(28),
  [413] = {.entry = {.count = 1, .reusable = true}}, SHIFT(13),
  [415] = {.entry = {.count = 1, .reusable = true}}, SHIFT(30),
  [417] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_string, 1, 0, 0),
  [419] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_string, 1, 0, 0),
  [421] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym__block, 5, 0, 0),
  [423] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__block, 5, 0, 0),
  [425] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_elif_clause, 3, 0, 10),
  [427] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_elif_clause, 3, 0, 10),
  [429] = {.entry = {.count = 1, .reusable = true}}, SHIFT(50),
  [431] = {.entry = {.count = 1, .reusable = true}}, SHIFT(59),
  [433] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 4, 1, 20),
  [435] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 4, 1, 20),
  [437] = {.entry = {.count = 1, .reusable = true}}, SHIFT(222),
  [439] = {.entry = {.count = 1, .reusable = true}}, SHIFT(94),
  [441] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_screen_statement, 4, 0, 6),
  [443] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_screen_statement, 4, 0, 6),
  [445] = {.entry = {.count = 1, .reusable = true}}, SHIFT(340),
  [447] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_screen_statement, 4, 0, 21),
  [449] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_screen_statement, 4, 0, 21),
  [451] = {.entry = {.count = 1, .reusable = true}}, SHIFT(44),
  [453] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 5, 1, 32),
  [455] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 5, 1, 32),
  [457] = {.entry = {.count = 1, .reusable = true}}, SHIFT(251),
  [459] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_screen_statement, 5, 0, 21),
  [461] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_screen_statement, 5, 0, 21),
  [463] = {.entry = {.count = 1, .reusable = true}}, SHIFT(337),
  [465] = {.entry = {.count = 1, .reusable = true}}, SHIFT(341),
  [467] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 3, 0, 5),
  [469] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 3, 0, 5),
  [471] = {.entry = {.count = 2, .reusable = false}}, REDUCE(sym_say_statement, 3, 0, 5), SHIFT(649),
  [474] = {.entry = {.count = 1, .reusable = true}}, SHIFT(199),
  [476] = {.entry = {.count = 1, .reusable = true}}, SHIFT(124),
  [478] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_screen_statement, 3, 0, 6),
  [480] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_screen_statement, 3, 0, 6),
  [482] = {.entry = {.count = 1, .reusable = true}}, SHIFT(55),
  [484] = {.entry = {.count = 1, .reusable = true}}, SHIFT(51),
  [486] = {.entry = {.count = 1, .reusable = true}}, SHIFT(15),
  [488] = {.entry = {.count = 1, .reusable = true}}, SHIFT(40),
  [490] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 1, 0, 1),
  [492] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 1, 0, 1),
  [494] = {.entry = {.count = 2, .reusable = false}}, REDUCE(sym_say_statement, 1, 0, 1), SHIFT(633),
  [497] = {.entry = {.count = 1, .reusable = true}}, SHIFT(169),
  [499] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 3, 1, 19),
  [501] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 3, 1, 19),
  [503] = {.entry = {.count = 1, .reusable = true}}, SHIFT(92),
  [505] = {.entry = {.count = 1, .reusable = true}}, SHIFT(333),
  [507] = {.entry = {.count = 1, .reusable = true}}, SHIFT(221),
  [509] = {.entry = {.count = 1, .reusable = true}}, SHIFT(58),
  [511] = {.entry = {.count = 1, .reusable = true}}, SHIFT(14),
  [513] = {.entry = {.count = 2, .reusable = false}}, REDUCE(sym_say_statement, 3, 0, 5), SHIFT(724),
  [516] = {.entry = {.count = 1, .reusable = true}}, SHIFT(72),
  [518] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 2, 0, 2),
  [520] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 2, 0, 2),
  [522] = {.entry = {.count = 2, .reusable = false}}, REDUCE(sym_say_statement, 2, 0, 2), SHIFT(634),
  [525] = {.entry = {.count = 1, .reusable = true}}, SHIFT(173),
  [527] = {.entry = {.count = 2, .reusable = false}}, REDUCE(sym_say_statement, 2, 0, 2), SHIFT(744),
  [530] = {.entry = {.count = 1, .reusable = true}}, SHIFT(213),
  [532] = {.entry = {.count = 2, .reusable = false}}, REDUCE(sym_say_statement, 1, 0, 1), SHIFT(690),
  [535] = {.entry = {.count = 1, .reusable = true}}, SHIFT(174),
  [537] = {.entry = {.count = 1, .reusable = true}}, SHIFT(43),
  [539] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_return_statement, 2, 0, 0),
  [541] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_return_statement, 2, 0, 0),
  [543] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_voice_statement, 3, 0, 17),
  [545] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_voice_statement, 3, 0, 17),
  [547] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_transform_statement, 3, 0, 6),
  [549] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_transform_statement, 3, 0, 6),
  [551] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_camera_statement, 3, 0, 18),
  [553] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_camera_statement, 3, 0, 18),
  [555] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_nvl_statement, 3, 0, 0),
  [557] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_nvl_statement, 3, 0, 0),
  [559] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_unknown_statement, 2, 0, 0),
  [561] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_unknown_statement, 2, 0, 0),
  [563] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_unknown_statement, 4, 0, 0),
  [565] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_unknown_statement, 4, 0, 0),
  [567] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 4, 0, 5),
  [569] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 4, 0, 5),
  [571] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_label_statement, 4, 0, 6),
  [573] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_label_statement, 4, 0, 6),
  [575] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_label_statement, 4, 0, 21),
  [577] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_label_statement, 4, 0, 21),
  [579] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_hide_screen_statement, 4, 0, 22),
  [581] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_hide_screen_statement, 4, 0, 22),
  [583] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_jump_statement, 4, 0, 23),
  [585] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_jump_statement, 4, 0, 23),
  [587] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_statement, 4, 0, 23),
  [589] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_statement, 4, 0, 23),
  [591] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_screen_statement, 4, 0, 22),
  [593] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_screen_statement, 4, 0, 22),
  [595] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 4, 0, 24),
  [597] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 4, 0, 24),
  [599] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_voice_statement, 3, 0, 0),
  [601] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_voice_statement, 3, 0, 0),
  [603] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 4, 0, 26),
  [605] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 4, 0, 26),
  [607] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 4, 0, 27),
  [609] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 4, 0, 27),
  [611] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 4, 0, 28),
  [613] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 4, 0, 28),
  [615] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_screen_statement, 4, 0, 22),
  [617] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_screen_statement, 4, 0, 22),
  [619] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_play_statement, 4, 0, 29),
  [621] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_play_statement, 4, 0, 29),
  [623] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_queue_statement, 4, 0, 29),
  [625] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_queue_statement, 4, 0, 29),
  [627] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_stop_statement, 4, 0, 30),
  [629] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_stop_statement, 4, 0, 30),
  [631] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_transform_statement, 4, 0, 21),
  [633] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_transform_statement, 4, 0, 21),
  [635] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_translate_statement, 4, 0, 31),
  [637] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_translate_statement, 4, 0, 31),
  [639] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_camera_statement, 4, 0, 27),
  [641] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_camera_statement, 4, 0, 27),
  [643] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 4, 1, 19),
  [645] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 4, 1, 19),
  [647] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 5, 1, 20),
  [649] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 5, 1, 20),
  [651] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_pass_statement, 2, 0, 0),
  [653] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_pass_statement, 2, 0, 0),
  [655] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_label_statement, 5, 0, 21),
  [657] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_label_statement, 5, 0, 21),
  [659] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_hide_statement, 5, 0, 33),
  [661] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_hide_statement, 5, 0, 33),
  [663] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_statement, 5, 0, 34),
  [665] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_statement, 5, 0, 34),
  [667] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_screen_statement, 5, 0, 22),
  [669] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_screen_statement, 5, 0, 22),
  [671] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_screen_statement, 5, 0, 35),
  [673] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_screen_statement, 5, 0, 35),
  [675] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_else_clause, 2, 0, 0),
  [677] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_else_clause, 2, 0, 0),
  [679] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_statement, 5, 0, 10),
  [681] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_statement, 5, 0, 10),
  [683] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_python_statement, 2, 0, 3),
  [685] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_python_statement, 2, 0, 3),
  [687] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 5, 0, 36),
  [689] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 5, 0, 36),
  [691] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_define_statement, 5, 0, 37),
  [693] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_define_statement, 5, 0, 37),
  [695] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_default_statement, 5, 0, 37),
  [697] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_default_statement, 5, 0, 37),
  [699] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_image_statement, 5, 0, 37),
  [701] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_image_statement, 5, 0, 37),
  [703] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 5, 0, 33),
  [705] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 5, 0, 33),
  [707] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 5, 0, 38),
  [709] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 5, 0, 38),
  [711] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 5, 0, 39),
  [713] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 5, 0, 39),
  [715] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 5, 0, 40),
  [717] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 5, 0, 40),
  [719] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_screen_statement, 5, 0, 22),
  [721] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_screen_statement, 5, 0, 22),
  [723] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_screen_statement, 5, 0, 35),
  [725] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_screen_statement, 5, 0, 35),
  [727] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 5, 0, 33),
  [729] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 5, 0, 33),
  [731] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 5, 0, 38),
  [733] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 5, 0, 38),
  [735] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 5, 0, 39),
  [737] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 5, 0, 39),
  [739] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 5, 0, 40),
  [741] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 5, 0, 40),
  [743] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 5, 0, 41),
  [745] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 5, 0, 41),
  [747] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 5, 0, 42),
  [749] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 5, 0, 42),
  [751] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_play_statement, 5, 0, 43),
  [753] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_play_statement, 5, 0, 43),
  [755] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_queue_statement, 5, 0, 43),
  [757] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_queue_statement, 5, 0, 43),
  [759] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_camera_statement, 5, 0, 44),
  [761] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_camera_statement, 5, 0, 44),
  [763] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 6, 1, 32),
  [765] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 6, 1, 32),
  [767] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_hide_screen_statement, 6, 0, 45),
  [769] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_hide_screen_statement, 6, 0, 45),
  [771] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_statement, 6, 0, 46),
  [773] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_statement, 6, 0, 46),
  [775] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_screen_statement, 6, 0, 45),
  [777] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_screen_statement, 6, 0, 45),
  [779] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_screen_statement, 6, 0, 35),
  [781] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_screen_statement, 6, 0, 35),
  [783] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_menu_statement, 6, 0, 0),
  [785] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_menu_statement, 6, 0, 0),
  [787] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 2, 0, 0),
  [789] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 2, 0, 0),
  [791] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 6, 0, 47),
  [793] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 6, 0, 47),
  [795] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 6, 0, 48),
  [797] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 6, 0, 48),
  [799] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__atl_block, 5, 0, 0),
  [801] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym__atl_block, 5, 0, 0),
  [803] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_screen_statement, 6, 0, 45),
  [805] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_screen_statement, 6, 0, 45),
  [807] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_screen_statement, 6, 0, 35),
  [809] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_screen_statement, 6, 0, 35),
  [811] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_screen_statement, 7, 0, 50),
  [813] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_screen_statement, 7, 0, 50),
  [815] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_screen_statement, 7, 0, 51),
  [817] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_screen_statement, 7, 0, 51),
  [819] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_menu_statement, 7, 0, 52),
  [821] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_menu_statement, 7, 0, 52),
  [823] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 7, 0, 56),
  [825] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 7, 0, 56),
  [827] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 7, 0, 57),
  [829] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 7, 0, 57),
  [831] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_screen_statement, 7, 0, 50),
  [833] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_screen_statement, 7, 0, 50),
  [835] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_screen_statement, 7, 0, 51),
  [837] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_screen_statement, 7, 0, 51),
  [839] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 7, 0, 56),
  [841] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 7, 0, 56),
  [843] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 7, 0, 57),
  [845] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 7, 0, 57),
  [847] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 7, 0, 58),
  [849] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 7, 0, 58),
  [851] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 7, 0, 59),
  [853] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 7, 0, 59),
  [855] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 7, 0, 60),
  [857] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 7, 0, 60),
  [859] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 7, 0, 61),
  [861] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 7, 0, 61),
  [863] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_screen_statement, 7, 0, 6),
  [865] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_screen_statement, 7, 0, 6),
  [867] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_style_statement, 7, 0, 6),
  [869] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_style_statement, 7, 0, 6),
  [871] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_layeredimage_statement, 7, 0, 6),
  [873] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_layeredimage_statement, 7, 0, 6),
  [875] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_screen_statement, 8, 0, 66),
  [877] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_screen_statement, 8, 0, 66),
  [879] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_screen_statement, 8, 0, 66),
  [881] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_screen_statement, 8, 0, 66),
  [883] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_screen_statement, 8, 0, 21),
  [885] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_screen_statement, 8, 0, 21),
  [887] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 9, 0, 73),
  [889] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 9, 0, 73),
  [891] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 9, 0, 74),
  [893] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 9, 0, 74),
  [895] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_style_statement, 9, 0, 76),
  [897] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_style_statement, 9, 0, 76),
  [899] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_style_statement, 9, 0, 77),
  [901] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_style_statement, 9, 0, 77),
  [903] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_style_statement, 11, 0, 78),
  [905] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_style_statement, 11, 0, 78),
  [907] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 2, 0, 4),
  [909] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 2, 0, 4),
  [911] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym__comment_line, 2, 0, 0),
  [913] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__comment_line, 2, 0, 0),
  [915] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_expression_statement, 2, 0, 0),
  [917] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_expression_statement, 2, 0, 0),
  [919] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_camera_statement, 2, 0, 0),
  [921] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_camera_statement, 2, 0, 0),
  [923] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 2, 0, 1),
  [925] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 2, 0, 1),
  [927] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_expression_statement, 3, 0, 0),
  [929] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_expression_statement, 3, 0, 0),
  [931] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_unknown_statement, 3, 0, 0),
  [933] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_unknown_statement, 3, 0, 0),
  [935] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_say_statement, 3, 0, 2),
  [937] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_say_statement, 3, 0, 2),
  [939] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_label_statement, 3, 0, 6),
  [941] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_label_statement, 3, 0, 6),
  [943] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_hide_statement, 3, 0, 7),
  [945] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_hide_statement, 3, 0, 7),
  [947] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_jump_statement, 3, 0, 8),
  [949] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_jump_statement, 3, 0, 8),
  [951] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_call_statement, 3, 0, 8),
  [953] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_call_statement, 3, 0, 8),
  [955] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_return_statement, 3, 0, 9),
  [957] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_return_statement, 3, 0, 9),
  [959] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_while_statement, 3, 0, 10),
  [961] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_while_statement, 3, 0, 10),
  [963] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_with_statement, 3, 0, 11),
  [965] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_with_statement, 3, 0, 11),
  [967] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_python_statement, 3, 0, 12),
  [969] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_python_statement, 3, 0, 12),
  [971] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_init_python_statement, 3, 0, 12),
  [973] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_init_python_statement, 3, 0, 12),
  [975] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_dollar_statement, 3, 0, 13),
  [977] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_dollar_statement, 3, 0, 13),
  [979] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_image_statement, 3, 0, 14),
  [981] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_image_statement, 3, 0, 14),
  [983] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 3, 0, 7),
  [985] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 3, 0, 7),
  [987] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 3, 0, 15),
  [989] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 3, 0, 15),
  [991] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 3, 0, 7),
  [993] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 3, 0, 7),
  [995] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_show_statement, 3, 0, 15),
  [997] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_show_statement, 3, 0, 15),
  [999] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_stop_statement, 3, 0, 16),
  [1001] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_stop_statement, 3, 0, 16),
  [1003] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_scene_statement, 4, 0, 25),
  [1005] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_scene_statement, 4, 0, 25),
  [1007] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym__atl_block_repeat1, 2, 0, 0), SHIFT_REPEAT(661),
  [1010] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym__atl_block_repeat1, 2, 0, 0), SHIFT_REPEAT(698),
  [1013] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym__atl_block_repeat1, 2, 0, 0), SHIFT_REPEAT(675),
  [1016] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym__atl_block_repeat1, 2, 0, 0), SHIFT_REPEAT(563),
  [1019] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym__atl_block_repeat1, 2, 0, 0), SHIFT_REPEAT(762),
  [1022] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym__atl_block_repeat1, 2, 0, 0), SHIFT_REPEAT(31),
  [1025] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym__atl_block_repeat1, 2, 0, 0),
  [1027] = {.entry = {.count = 1, .reusable = false}}, SHIFT(661),
  [1029] = {.entry = {.count = 1, .reusable = true}}, SHIFT(698),
  [1031] = {.entry = {.count = 1, .reusable = false}}, SHIFT(675),
  [1033] = {.entry = {.count = 1, .reusable = false}}, SHIFT(563),
  [1035] = {.entry = {.count = 1, .reusable = false}}, SHIFT(762),
  [1037] = {.entry = {.count = 1, .reusable = true}}, SHIFT(133),
  [1039] = {.entry = {.count = 1, .reusable = true}}, SHIFT(260),
  [1041] = {.entry = {.count = 1, .reusable = true}}, SHIFT(315),
  [1043] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_atl_transform_property, 3, 0, 53),
  [1045] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_atl_transform_property, 3, 0, 53),
  [1047] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_atl_displayable, 2, 0, 49),
  [1049] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_atl_displayable, 2, 0, 49),
  [1051] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_atl_with_statement, 3, 0, 54),
  [1053] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_atl_with_statement, 3, 0, 54),
  [1055] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_atl_time_statement, 3, 0, 55),
  [1057] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_atl_time_statement, 3, 0, 55),
  [1059] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_atl_block_statement, 6, 0, 0),
  [1061] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_atl_block_statement, 6, 0, 0),
  [1063] = {.entry = {.count = 1, .reusable = false}}, SHIFT(414),
  [1065] = {.entry = {.count = 1, .reusable = false}}, SHIFT(748),
  [1067] = {.entry = {.count = 1, .reusable = true}}, SHIFT(138),
  [1069] = {.entry = {.count = 1, .reusable = true}}, SHIFT(129),
  [1071] = {.entry = {.count = 1, .reusable = true}}, SHIFT(265),
  [1073] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_menu_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(414),
  [1076] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_menu_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(698),
  [1079] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_menu_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(748),
  [1082] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_menu_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(31),
  [1085] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_menu_statement_repeat1, 2, 0, 0),
  [1087] = {.entry = {.count = 1, .reusable = true}}, SHIFT(256),
  [1089] = {.entry = {.count = 1, .reusable = false}}, SHIFT(325),
  [1091] = {.entry = {.count = 1, .reusable = false}}, SHIFT(574),
  [1093] = {.entry = {.count = 1, .reusable = true}}, SHIFT(154),
  [1095] = {.entry = {.count = 1, .reusable = false}}, SHIFT(359),
  [1097] = {.entry = {.count = 1, .reusable = true}}, SHIFT(57),
  [1099] = {.entry = {.count = 1, .reusable = false}}, SHIFT(424),
  [1101] = {.entry = {.count = 1, .reusable = false}}, SHIFT(428),
  [1103] = {.entry = {.count = 1, .reusable = true}}, SHIFT(352),
  [1105] = {.entry = {.count = 1, .reusable = true}}, SHIFT(347),
  [1107] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_screen_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(325),
  [1110] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_screen_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(698),
  [1113] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_screen_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(574),
  [1116] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_screen_statement_repeat1, 2, 0, 0),
  [1118] = {.entry = {.count = 1, .reusable = true}}, SHIFT(149),
  [1120] = {.entry = {.count = 1, .reusable = true}}, SHIFT(276),
  [1122] = {.entry = {.count = 1, .reusable = true}}, SHIFT(345),
  [1124] = {.entry = {.count = 1, .reusable = true}}, SHIFT(281),
  [1126] = {.entry = {.count = 1, .reusable = true}}, SHIFT(358),
  [1128] = {.entry = {.count = 1, .reusable = false}}, SHIFT(441),
  [1130] = {.entry = {.count = 1, .reusable = true}}, SHIFT(36),
  [1132] = {.entry = {.count = 1, .reusable = true}}, SHIFT(171),
  [1134] = {.entry = {.count = 1, .reusable = true}}, SHIFT(335),
  [1136] = {.entry = {.count = 1, .reusable = false}}, SHIFT(472),
  [1138] = {.entry = {.count = 1, .reusable = true}}, SHIFT(162),
  [1140] = {.entry = {.count = 1, .reusable = false}}, SHIFT(468),
  [1142] = {.entry = {.count = 1, .reusable = true}}, SHIFT(197),
  [1144] = {.entry = {.count = 1, .reusable = true}}, SHIFT(338),
  [1146] = {.entry = {.count = 1, .reusable = false}}, SHIFT(469),
  [1148] = {.entry = {.count = 1, .reusable = true}}, SHIFT(289),
  [1150] = {.entry = {.count = 1, .reusable = false}}, SHIFT(364),
  [1152] = {.entry = {.count = 1, .reusable = false}}, SHIFT(610),
  [1154] = {.entry = {.count = 1, .reusable = false}}, SHIFT(611),
  [1156] = {.entry = {.count = 1, .reusable = false}}, SHIFT(613),
  [1158] = {.entry = {.count = 1, .reusable = true}}, SHIFT(299),
  [1160] = {.entry = {.count = 1, .reusable = false}}, SHIFT(733),
  [1162] = {.entry = {.count = 1, .reusable = false}}, SHIFT(734),
  [1164] = {.entry = {.count = 1, .reusable = false}}, SHIFT(735),
  [1166] = {.entry = {.count = 1, .reusable = true}}, SHIFT(188),
  [1168] = {.entry = {.count = 1, .reusable = false}}, SHIFT(353),
  [1170] = {.entry = {.count = 1, .reusable = false}}, SHIFT(716),
  [1172] = {.entry = {.count = 1, .reusable = false}}, SHIFT(739),
  [1174] = {.entry = {.count = 1, .reusable = true}}, SHIFT(130),
  [1176] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym__screen_line_end, 5, 0, 0),
  [1178] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__screen_line_end, 5, 0, 0),
  [1180] = {.entry = {.count = 1, .reusable = false}}, SHIFT(350),
  [1182] = {.entry = {.count = 1, .reusable = false}}, SHIFT(720),
  [1184] = {.entry = {.count = 1, .reusable = false}}, SHIFT(721),
  [1186] = {.entry = {.count = 1, .reusable = true}}, SHIFT(166),
  [1188] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_screen_language_statement, 2, 0, 63),
  [1190] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_screen_language_statement, 2, 0, 63),
  [1192] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_screen_language_statement, 3, 0, 69),
  [1194] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_screen_language_statement, 3, 0, 69),
  [1196] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_screen_language_statement, 3, 0, 71),
  [1198] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_screen_language_statement, 3, 0, 71),
  [1200] = {.entry = {.count = 1, .reusable = false}}, SHIFT(731),
  [1202] = {.entry = {.count = 1, .reusable = false}}, SHIFT(732),
  [1204] = {.entry = {.count = 1, .reusable = true}}, SHIFT(186),
  [1206] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_screen_language_statement, 4, 0, 75),
  [1208] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_screen_language_statement, 4, 0, 75),
  [1210] = {.entry = {.count = 1, .reusable = false}}, SHIFT(594),
  [1212] = {.entry = {.count = 1, .reusable = false}}, SHIFT(603),
  [1214] = {.entry = {.count = 1, .reusable = true}}, SHIFT(297),
  [1216] = {.entry = {.count = 1, .reusable = false}}, SHIFT(600),
  [1218] = {.entry = {.count = 1, .reusable = false}}, SHIFT(601),
  [1220] = {.entry = {.count = 1, .reusable = true}}, SHIFT(601),
  [1222] = {.entry = {.count = 1, .reusable = true}}, SHIFT(12),
  [1224] = {.entry = {.count = 1, .reusable = true}}, SHIFT(410),
  [1226] = {.entry = {.count = 1, .reusable = true}}, SHIFT(348),
  [1228] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_menu_caption_repeat1, 2, 0, 0), SHIFT_REPEAT(358),
  [1231] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_menu_caption_repeat1, 2, 0, 0),
  [1233] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_menu_caption_repeat1, 2, 0, 0),
  [1235] = {.entry = {.count = 2, .reusable = false}}, REDUCE(sym__positional_property, 1, 0, 62), SHIFT(475),
  [1238] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__positional_property, 1, 0, 62),
  [1240] = {.entry = {.count = 2, .reusable = false}}, REDUCE(sym__positional_property, 1, 0, 62), SHIFT(474),
  [1243] = {.entry = {.count = 1, .reusable = false}}, SHIFT(491),
  [1245] = {.entry = {.count = 1, .reusable = true}}, SHIFT(523),
  [1247] = {.entry = {.count = 1, .reusable = true}}, SHIFT(565),
  [1249] = {.entry = {.count = 1, .reusable = false}}, SHIFT(627),
  [1251] = {.entry = {.count = 1, .reusable = false}}, SHIFT(628),
  [1253] = {.entry = {.count = 1, .reusable = true}}, SHIFT(628),
  [1255] = {.entry = {.count = 1, .reusable = true}}, SHIFT(479),
  [1257] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_screen_language_statement_repeat1, 2, 0, 70), SHIFT_REPEAT(428),
  [1260] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_screen_language_statement_repeat1, 2, 0, 70),
  [1262] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_screen_language_statement_repeat1, 2, 0, 70), SHIFT_REPEAT(424),
  [1265] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_menu_caption_repeat1, 2, 0, 0), SHIFT_REPEAT(364),
  [1268] = {.entry = {.count = 1, .reusable = true}}, SHIFT(351),
  [1270] = {.entry = {.count = 1, .reusable = true}}, SHIFT(356),
  [1272] = {.entry = {.count = 1, .reusable = true}}, SHIFT(355),
  [1274] = {.entry = {.count = 1, .reusable = true}}, SHIFT(688),
  [1276] = {.entry = {.count = 1, .reusable = true}}, SHIFT(699),
  [1278] = {.entry = {.count = 1, .reusable = true}}, SHIFT(116),
  [1280] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_menu_caption, 4, 0, 5),
  [1282] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_menu_caption, 4, 0, 5),
  [1284] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_menu_choice, 4, 0, 67),
  [1286] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_menu_choice, 4, 0, 67),
  [1288] = {.entry = {.count = 1, .reusable = true}}, SHIFT(546),
  [1290] = {.entry = {.count = 1, .reusable = true}}, SHIFT(558),
  [1292] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_menu_caption_repeat1, 2, 0, 0), SHIFT_REPEAT(372),
  [1295] = {.entry = {.count = 1, .reusable = true}}, SHIFT(450),
  [1297] = {.entry = {.count = 1, .reusable = true}}, SHIFT(159),
  [1299] = {.entry = {.count = 1, .reusable = false}}, SHIFT(551),
  [1301] = {.entry = {.count = 1, .reusable = true}}, SHIFT(551),
  [1303] = {.entry = {.count = 1, .reusable = false}}, SHIFT(445),
  [1305] = {.entry = {.count = 1, .reusable = false}}, SHIFT(678),
  [1307] = {.entry = {.count = 1, .reusable = true}}, SHIFT(150),
  [1309] = {.entry = {.count = 1, .reusable = true}}, SHIFT(404),
  [1311] = {.entry = {.count = 1, .reusable = true}}, SHIFT(151),
  [1313] = {.entry = {.count = 1, .reusable = true}}, SHIFT(372),
  [1315] = {.entry = {.count = 1, .reusable = true}}, SHIFT(782),
  [1317] = {.entry = {.count = 1, .reusable = true}}, SHIFT(545),
  [1319] = {.entry = {.count = 1, .reusable = true}}, SHIFT(421),
  [1321] = {.entry = {.count = 1, .reusable = true}}, SHIFT(730),
  [1323] = {.entry = {.count = 1, .reusable = true}}, SHIFT(752),
  [1325] = {.entry = {.count = 1, .reusable = true}}, SHIFT(753),
  [1327] = {.entry = {.count = 1, .reusable = true}}, SHIFT(243),
  [1329] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_menu_caption, 3, 0, 2),
  [1331] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_menu_caption, 3, 0, 2),
  [1333] = {.entry = {.count = 1, .reusable = true}}, SHIFT(277),
  [1335] = {.entry = {.count = 1, .reusable = true}}, SHIFT(278),
  [1337] = {.entry = {.count = 1, .reusable = true}}, SHIFT(284),
  [1339] = {.entry = {.count = 1, .reusable = true}}, SHIFT(285),
  [1341] = {.entry = {.count = 1, .reusable = true}}, SHIFT(286),
  [1343] = {.entry = {.count = 1, .reusable = true}}, SHIFT(157),
  [1345] = {.entry = {.count = 1, .reusable = true}}, SHIFT(158),
  [1347] = {.entry = {.count = 1, .reusable = false}}, SHIFT(548),
  [1349] = {.entry = {.count = 1, .reusable = true}}, SHIFT(548),
  [1351] = {.entry = {.count = 1, .reusable = false}}, SHIFT(467),
  [1353] = {.entry = {.count = 1, .reusable = false}}, SHIFT(718),
  [1355] = {.entry = {.count = 1, .reusable = true}}, SHIFT(566),
  [1357] = {.entry = {.count = 1, .reusable = true}}, SHIFT(567),
  [1359] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_menu_set, 3, 0, 13),
  [1361] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_menu_set, 3, 0, 13),
  [1363] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_menu_caption, 2, 0, 1),
  [1365] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_menu_caption, 2, 0, 1),
  [1367] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_style_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(450),
  [1370] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_style_statement_repeat1, 2, 0, 0), SHIFT_REPEAT(602),
  [1373] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_style_statement_repeat1, 2, 0, 0),
  [1375] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_menu_choice, 2, 0, 1),
  [1377] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_menu_choice, 2, 0, 1),
  [1379] = {.entry = {.count = 1, .reusable = true}}, SHIFT(604),
  [1381] = {.entry = {.count = 1, .reusable = true}}, SHIFT(83),
  [1383] = {.entry = {.count = 1, .reusable = true}}, SHIFT(559),
  [1385] = {.entry = {.count = 1, .reusable = true}}, SHIFT(745),
  [1387] = {.entry = {.count = 1, .reusable = true}}, SHIFT(573),
  [1389] = {.entry = {.count = 1, .reusable = true}}, SHIFT(212),
  [1391] = {.entry = {.count = 1, .reusable = true}}, SHIFT(749),
  [1393] = {.entry = {.count = 1, .reusable = true}}, SHIFT(237),
  [1395] = {.entry = {.count = 1, .reusable = true}}, SHIFT(617),
  [1397] = {.entry = {.count = 1, .reusable = true}}, SHIFT(110),
  [1399] = {.entry = {.count = 1, .reusable = true}}, SHIFT(754),
  [1401] = {.entry = {.count = 1, .reusable = true}}, SHIFT(245),
  [1403] = {.entry = {.count = 1, .reusable = true}}, SHIFT(501),
  [1405] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_screen_language_statement_repeat1, 1, 0, 64),
  [1407] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_screen_language_statement_repeat1, 1, 0, 64),
  [1409] = {.entry = {.count = 1, .reusable = true}}, SHIFT(794),
  [1411] = {.entry = {.count = 1, .reusable = true}}, SHIFT(145),
  [1413] = {.entry = {.count = 1, .reusable = true}}, SHIFT(761),
  [1415] = {.entry = {.count = 1, .reusable = true}}, SHIFT(272),
  [1417] = {.entry = {.count = 1, .reusable = false}}, SHIFT(475),
  [1419] = {.entry = {.count = 1, .reusable = false}}, SHIFT(474),
  [1421] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_screen_language_statement_repeat2, 2, 0, 70), SHIFT_REPEAT(410),
  [1424] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_screen_language_statement_repeat2, 2, 0, 70),
  [1426] = {.entry = {.count = 1, .reusable = true}}, SHIFT(412),
  [1428] = {.entry = {.count = 1, .reusable = true}}, SHIFT(743),
  [1430] = {.entry = {.count = 1, .reusable = true}}, SHIFT(210),
  [1432] = {.entry = {.count = 1, .reusable = true}}, SHIFT(492),
  [1434] = {.entry = {.count = 1, .reusable = true}}, SHIFT(799),
  [1436] = {.entry = {.count = 1, .reusable = true}}, SHIFT(555),
  [1438] = {.entry = {.count = 1, .reusable = true}}, SHIFT(78),
  [1440] = {.entry = {.count = 1, .reusable = true}}, SHIFT(643),
  [1442] = {.entry = {.count = 1, .reusable = true}}, SHIFT(572),
  [1444] = {.entry = {.count = 1, .reusable = true}}, SHIFT(85),
  [1446] = {.entry = {.count = 1, .reusable = false}}, SHIFT(616),
  [1448] = {.entry = {.count = 1, .reusable = true}}, SHIFT(616),
  [1450] = {.entry = {.count = 1, .reusable = false}}, SHIFT(466),
  [1452] = {.entry = {.count = 1, .reusable = true}}, SHIFT(525),
  [1454] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym__positional_property, 1, 0, 0),
  [1456] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__positional_property, 1, 0, 0),
  [1458] = {.entry = {.count = 1, .reusable = false}}, SHIFT(605),
  [1460] = {.entry = {.count = 1, .reusable = true}}, SHIFT(605),
  [1462] = {.entry = {.count = 1, .reusable = false}}, SHIFT(444),
  [1464] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym__positional_property, 1, 0, 62),
  [1466] = {.entry = {.count = 1, .reusable = true}}, SHIFT(740),
  [1468] = {.entry = {.count = 1, .reusable = true}}, SHIFT(569),
  [1470] = {.entry = {.count = 1, .reusable = true}}, SHIFT(205),
  [1472] = {.entry = {.count = 1, .reusable = true}}, SHIFT(506),
  [1474] = {.entry = {.count = 1, .reusable = true}}, SHIFT(791),
  [1476] = {.entry = {.count = 1, .reusable = true}}, SHIFT(118),
  [1478] = {.entry = {.count = 1, .reusable = true}}, SHIFT(366),
  [1480] = {.entry = {.count = 1, .reusable = true}}, SHIFT(635),
  [1482] = {.entry = {.count = 1, .reusable = true}}, SHIFT(396),
  [1484] = {.entry = {.count = 1, .reusable = true}}, SHIFT(660),
  [1486] = {.entry = {.count = 1, .reusable = true}}, SHIFT(662),
  [1488] = {.entry = {.count = 1, .reusable = true}}, SHIFT(198),
  [1490] = {.entry = {.count = 1, .reusable = true}}, SHIFT(131),
  [1492] = {.entry = {.count = 1, .reusable = false}}, SHIFT(581),
  [1494] = {.entry = {.count = 1, .reusable = true}}, SHIFT(250),
  [1496] = {.entry = {.count = 1, .reusable = false}}, SHIFT(659),
  [1498] = {.entry = {.count = 1, .reusable = true}}, SHIFT(659),
  [1500] = {.entry = {.count = 1, .reusable = false}}, SHIFT(538),
  [1502] = {.entry = {.count = 1, .reusable = true}}, SHIFT(538),
  [1504] = {.entry = {.count = 1, .reusable = true}}, SHIFT(302),
  [1506] = {.entry = {.count = 1, .reusable = true}}, SHIFT(139),
  [1508] = {.entry = {.count = 1, .reusable = true}}, SHIFT(143),
  [1510] = {.entry = {.count = 1, .reusable = true}}, SHIFT(147),
  [1512] = {.entry = {.count = 1, .reusable = false}}, SHIFT(596),
  [1514] = {.entry = {.count = 1, .reusable = true}}, SHIFT(349),
  [1516] = {.entry = {.count = 1, .reusable = false}}, SHIFT(726),
  [1518] = {.entry = {.count = 1, .reusable = true}}, SHIFT(176),
  [1520] = {.entry = {.count = 1, .reusable = true}}, SHIFT(155),
  [1522] = {.entry = {.count = 1, .reusable = true}}, SHIFT(108),
  [1524] = {.entry = {.count = 1, .reusable = true}}, SHIFT(208),
  [1526] = {.entry = {.count = 1, .reusable = true}}, SHIFT(235),
  [1528] = {.entry = {.count = 1, .reusable = true}}, SHIFT(241),
  [1530] = {.entry = {.count = 1, .reusable = true}}, SHIFT(114),
  [1532] = {.entry = {.count = 1, .reusable = true}}, SHIFT(258),
  [1534] = {.entry = {.count = 1, .reusable = true}}, SHIFT(266),
  [1536] = {.entry = {.count = 1, .reusable = true}}, SHIFT(270),
  [1538] = {.entry = {.count = 1, .reusable = true}}, SHIFT(274),
  [1540] = {.entry = {.count = 1, .reusable = true}}, SHIFT(282),
  [1542] = {.entry = {.count = 1, .reusable = false}}, SHIFT(637),
  [1544] = {.entry = {.count = 1, .reusable = true}}, SHIFT(637),
  [1546] = {.entry = {.count = 1, .reusable = false}}, SHIFT(561),
  [1548] = {.entry = {.count = 1, .reusable = true}}, SHIFT(561),
  [1550] = {.entry = {.count = 1, .reusable = true}}, SHIFT(71),
  [1552] = {.entry = {.count = 1, .reusable = true}}, SHIFT(190),
  [1554] = {.entry = {.count = 1, .reusable = true}}, SHIFT(800),
  [1556] = {.entry = {.count = 1, .reusable = true}}, SHIFT(801),
  [1558] = {.entry = {.count = 1, .reusable = true}}, SHIFT(170),
  [1560] = {.entry = {.count = 1, .reusable = true}}, SHIFT(658),
  [1562] = {.entry = {.count = 1, .reusable = true}}, SHIFT(570),
  [1564] = {.entry = {.count = 1, .reusable = true}}, SHIFT(113),
  [1566] = {.entry = {.count = 1, .reusable = false}}, SHIFT(360),
  [1568] = {.entry = {.count = 1, .reusable = true}}, SHIFT(360),
  [1570] = {.entry = {.count = 1, .reusable = false}}, SHIFT(764),
  [1572] = {.entry = {.count = 1, .reusable = true}}, SHIFT(764),
  [1574] = {.entry = {.count = 1, .reusable = true}}, SHIFT(626),
  [1576] = {.entry = {.count = 1, .reusable = true}}, SHIFT(562),
  [1578] = {.entry = {.count = 1, .reusable = true}}, SHIFT(100),
  [1580] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_screen_language_statement_repeat2, 1, 0, 65),
  [1582] = {.entry = {.count = 1, .reusable = false}}, SHIFT(564),
  [1584] = {.entry = {.count = 1, .reusable = false}}, SHIFT(668),
  [1586] = {.entry = {.count = 1, .reusable = true}}, SHIFT(172),
  [1588] = {.entry = {.count = 1, .reusable = false}}, SHIFT(362),
  [1590] = {.entry = {.count = 1, .reusable = true}}, SHIFT(362),
  [1592] = {.entry = {.count = 1, .reusable = false}}, SHIFT(557),
  [1594] = {.entry = {.count = 1, .reusable = false}}, SHIFT(725),
  [1596] = {.entry = {.count = 1, .reusable = true}}, SHIFT(168),
  [1598] = {.entry = {.count = 1, .reusable = true}}, SHIFT(802),
  [1600] = {.entry = {.count = 1, .reusable = true}}, SHIFT(29),
  [1602] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_parameter_list, 2, 0, 0),
  [1604] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__keyword_property, 2, 1, 68),
  [1606] = {.entry = {.count = 1, .reusable = true}}, SHIFT(681),
  [1608] = {.entry = {.count = 1, .reusable = false}}, SHIFT(793),
  [1610] = {.entry = {.count = 1, .reusable = true}}, SHIFT(793),
  [1612] = {.entry = {.count = 1, .reusable = true}}, SHIFT(747),
  [1614] = {.entry = {.count = 1, .reusable = true}}, SHIFT(537),
  [1616] = {.entry = {.count = 1, .reusable = true}}, SHIFT(227),
  [1618] = {.entry = {.count = 1, .reusable = true}}, SHIFT(751),
  [1620] = {.entry = {.count = 1, .reusable = true}}, SHIFT(541),
  [1622] = {.entry = {.count = 1, .reusable = true}}, SHIFT(240),
  [1624] = {.entry = {.count = 1, .reusable = false}}, SHIFT(342),
  [1626] = {.entry = {.count = 1, .reusable = false}}, SHIFT(795),
  [1628] = {.entry = {.count = 1, .reusable = true}}, SHIFT(26),
  [1630] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_parameter_list, 3, 0, 0),
  [1632] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_style_property_statement, 3, 0, 53),
  [1634] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_style_property_statement, 3, 0, 72),
  [1636] = {.entry = {.count = 1, .reusable = true}}, SHIFT(568),
  [1638] = {.entry = {.count = 1, .reusable = true}}, SHIFT(588),
  [1640] = {.entry = {.count = 1, .reusable = false}}, SHIFT(453),
  [1642] = {.entry = {.count = 1, .reusable = false}}, SHIFT(715),
  [1644] = {.entry = {.count = 1, .reusable = false}}, SHIFT(343),
  [1646] = {.entry = {.count = 1, .reusable = false}}, SHIFT(722),
  [1648] = {.entry = {.count = 1, .reusable = true}}, SHIFT(632),
  [1650] = {.entry = {.count = 1, .reusable = false}}, SHIFT(652),
  [1652] = {.entry = {.count = 1, .reusable = true}}, SHIFT(652),
  [1654] = {.entry = {.count = 1, .reusable = false}}, SHIFT(670),
  [1656] = {.entry = {.count = 1, .reusable = true}}, SHIFT(670),
  [1658] = {.entry = {.count = 1, .reusable = false}}, SHIFT(702),
  [1660] = {.entry = {.count = 1, .reusable = true}}, SHIFT(702),
  [1662] = {.entry = {.count = 1, .reusable = false}}, SHIFT(443),
  [1664] = {.entry = {.count = 1, .reusable = false}}, SHIFT(636),
  [1666] = {.entry = {.count = 1, .reusable = false}}, SHIFT(771),
  [1668] = {.entry = {.count = 1, .reusable = true}}, SHIFT(771),
  [1670] = {.entry = {.count = 1, .reusable = false}}, SHIFT(772),
  [1672] = {.entry = {.count = 1, .reusable = true}}, SHIFT(772),
  [1674] = {.entry = {.count = 1, .reusable = true}}, SHIFT(534),
  [1676] = {.entry = {.count = 1, .reusable = false}}, SHIFT(703),
  [1678] = {.entry = {.count = 1, .reusable = true}}, SHIFT(703),
  [1680] = {.entry = {.count = 1, .reusable = true}}, SHIFT(639),
  [1682] = {.entry = {.count = 1, .reusable = true}}, SHIFT(301),
  [1684] = {.entry = {.count = 1, .reusable = true}}, SHIFT(767),
  [1686] = {.entry = {.count = 1, .reusable = true}}, SHIFT(75),
  [1688] = {.entry = {.count = 1, .reusable = true}}, SHIFT(758),
  [1690] = {.entry = {.count = 1, .reusable = true}}, SHIFT(255),
  [1692] = {.entry = {.count = 1, .reusable = true}}, SHIFT(477),
  [1694] = {.entry = {.count = 1, .reusable = true}}, SHIFT(77),
  [1696] = {.entry = {.count = 1, .reusable = true}}, SHIFT(618),
  [1698] = {.entry = {.count = 1, .reusable = true}}, SHIFT(65),
  [1700] = {.entry = {.count = 1, .reusable = false}}, SHIFT(516),
  [1702] = {.entry = {.count = 1, .reusable = true}}, SHIFT(759),
  [1704] = {.entry = {.count = 1, .reusable = true}}, SHIFT(262),
  [1706] = {.entry = {.count = 1, .reusable = true}}, SHIFT(530),
  [1708] = {.entry = {.count = 1, .reusable = true}}, SHIFT(621),
  [1710] = {.entry = {.count = 1, .reusable = true}}, SHIFT(461),
  [1712] = {.entry = {.count = 1, .reusable = true}}, SHIFT(693),
  [1714] = {.entry = {.count = 1, .reusable = true}}, SHIFT(86),
  [1716] = {.entry = {.count = 1, .reusable = true}}, SHIFT(696),
  [1718] = {.entry = {.count = 1, .reusable = true}}, SHIFT(87),
  [1720] = {.entry = {.count = 1, .reusable = true}}, SHIFT(700),
  [1722] = {.entry = {.count = 1, .reusable = true}}, SHIFT(93),
  [1724] = {.entry = {.count = 1, .reusable = true}}, SHIFT(518),
  [1726] = {.entry = {.count = 1, .reusable = true}}, SHIFT(178),
  [1728] = {.entry = {.count = 1, .reusable = true}}, SHIFT(379),
  [1730] = {.entry = {.count = 1, .reusable = true}}, SHIFT(494),
  [1732] = {.entry = {.count = 1, .reusable = true}}, SHIFT(287),
  [1734] = {.entry = {.count = 1, .reusable = true}}, SHIFT(382),
  [1736] = {.entry = {.count = 1, .reusable = true}}, SHIFT(510),
  [1738] = {.entry = {.count = 1, .reusable = true}}, SHIFT(676),
  [1740] = {.entry = {.count = 1, .reusable = true}}, SHIFT(587),
  [1742] = {.entry = {.count = 1, .reusable = true}}, SHIFT(99),
  [1744] = {.entry = {.count = 1, .reusable = false}}, SHIFT(482),
  [1746] = {.entry = {.count = 1, .reusable = true}}, SHIFT(736),
  [1748] = {.entry = {.count = 1, .reusable = true}}, SHIFT(195),
  [1750] = {.entry = {.count = 1, .reusable = false}}, SHIFT(490),
  [1752] = {.entry = {.count = 1, .reusable = true}}, SHIFT(650),
  [1754] = {.entry = {.count = 1, .reusable = true}}, SHIFT(738),
  [1756] = {.entry = {.count = 1, .reusable = true}}, SHIFT(202),
  [1758] = {.entry = {.count = 1, .reusable = true}}, SHIFT(519),
  [1760] = {.entry = {.count = 1, .reusable = true}}, SHIFT(204),
  [1762] = {.entry = {.count = 1, .reusable = true}}, SHIFT(619),
  [1764] = {.entry = {.count = 1, .reusable = true}}, SHIFT(128),
  [1766] = {.entry = {.count = 1, .reusable = true}}, SHIFT(682),
  [1768] = {.entry = {.count = 1, .reusable = true}}, SHIFT(68),
  [1770] = {.entry = {.count = 1, .reusable = false}}, SHIFT(500),
  [1772] = {.entry = {.count = 1, .reusable = true}}, SHIFT(756),
  [1774] = {.entry = {.count = 1, .reusable = true}}, SHIFT(665),
  [1776] = {.entry = {.count = 1, .reusable = true}}, SHIFT(215),
  [1778] = {.entry = {.count = 1, .reusable = true}}, SHIFT(666),
  [1780] = {.entry = {.count = 1, .reusable = true}}, SHIFT(216),
  [1782] = {.entry = {.count = 1, .reusable = true}}, SHIFT(746),
  [1784] = {.entry = {.count = 1, .reusable = true}}, SHIFT(226),
  [1786] = {.entry = {.count = 1, .reusable = true}}, SHIFT(674),
  [1788] = {.entry = {.count = 1, .reusable = true}}, SHIFT(135),
  [1790] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__screen_condition, 1, 0, 0),
  [1792] = {.entry = {.count = 1, .reusable = true}}, SHIFT(641),
  [1794] = {.entry = {.count = 1, .reusable = true}}, SHIFT(112),
  [1796] = {.entry = {.count = 1, .reusable = true}}, SHIFT(750),
  [1798] = {.entry = {.count = 1, .reusable = true}}, SHIFT(239),
  [1800] = {.entry = {.count = 1, .reusable = true}}, SHIFT(571),
  [1802] = {.entry = {.count = 1, .reusable = true}}, SHIFT(471),
  [1804] = {.entry = {.count = 1, .reusable = true}}, SHIFT(646),
  [1806] = {.entry = {.count = 1, .reusable = true}}, SHIFT(191),
  [1808] = {.entry = {.count = 1, .reusable = true}}, SHIFT(309),
  [1810] = {.entry = {.count = 1, .reusable = true}}, SHIFT(781),
  [1812] = {.entry = {.count = 1, .reusable = true}}, SHIFT(625),
  [1814] = {.entry = {.count = 1, .reusable = true}}, SHIFT(324),
  [1816] = {.entry = {.count = 1, .reusable = true}}, SHIFT(307),
  [1818] = {.entry = {.count = 1, .reusable = true}}, SHIFT(323),
  [1820] = {.entry = {.count = 1, .reusable = true}}, SHIFT(517),
  [1822] = {.entry = {.count = 1, .reusable = true}}, SHIFT(614),
  [1824] = {.entry = {.count = 1, .reusable = true}}, SHIFT(575),
  [1826] = {.entry = {.count = 1, .reusable = true}}, SHIFT(689),
  [1828] = {.entry = {.count = 1, .reusable = true}}, SHIFT(540),
  [1830] = {.entry = {.count = 1, .reusable = true}}, SHIFT(439),
  [1832] = {.entry = {.count = 1, .reusable = true}}, SHIFT(694),
  [1834] = {.entry = {.count = 1, .reusable = true}}, SHIFT(673),
  [1836] = {.entry = {.count = 1, .reusable = true}}, SHIFT(455),
  [1838] = {.entry = {.count = 1, .reusable = true}}, SHIFT(105),
  [1840] = {.entry = {.count = 1, .reusable = true}}, SHIFT(507),
  [1842] = {.entry = {.count = 1, .reusable = true}}, SHIFT(509),
  [1844] = {.entry = {.count = 1, .reusable = true}}, SHIFT(106),
  [1846] = {.entry = {.count = 1, .reusable = true}}, SHIFT(107),
  [1848] = {.entry = {.count = 1, .reusable = true}}, SHIFT(81),
  [1850] = {.entry = {.count = 1, .reusable = true}}, SHIFT(66),
  [1852] = {.entry = {.count = 1, .reusable = true}}, SHIFT(161),
  [1854] = {.entry = {.count = 1, .reusable = true}}, SHIFT(402),
  [1856] = {.entry = {.count = 1, .reusable = true}}, SHIFT(442),
  [1858] = {.entry = {.count = 1, .reusable = true}}, SHIFT(257),
  [1860] = {.entry = {.count = 1, .reusable = true}}, SHIFT(585),
  [1862] = {.entry = {.count = 1, .reusable = true}}, SHIFT(164),
  [1864] = {.entry = {.count = 1, .reusable = true}}, SHIFT(524),
  [1866] = {.entry = {.count = 1, .reusable = true}}, SHIFT(483),
  [1868] = {.entry = {.count = 1, .reusable = true}}, SHIFT(459),
  [1870] = {.entry = {.count = 1, .reusable = true}}, SHIFT(368),
  [1872] = {.entry = {.count = 1, .reusable = true}}, SHIFT(440),
  [1874] = {.entry = {.count = 1, .reusable = true}}, SHIFT(437),
  [1876] = {.entry = {.count = 1, .reusable = true}}, SHIFT(136),
  [1878] = {.entry = {.count = 1, .reusable = true}}, SHIFT(137),
  [1880] = {.entry = {.count = 1, .reusable = true}}, SHIFT(177),
  [1882] = {.entry = {.count = 1, .reusable = true}}, SHIFT(447),
  [1884] = {.entry = {.count = 1, .reusable = true}}, SHIFT(179),
  [1886] = {.entry = {.count = 1, .reusable = true}}, SHIFT(709),
  [1888] = {.entry = {.count = 1, .reusable = true}}, SHIFT(181),
  [1890] = {.entry = {.count = 1, .reusable = true}}, SHIFT(520),
  [1892] = {.entry = {.count = 1, .reusable = true}}, SHIFT(184),
  [1894] = {.entry = {.count = 1, .reusable = true}}, SHIFT(609),
  [1896] = {.entry = {.count = 1, .reusable = true}}, SHIFT(384),
  [1898] = {.entry = {.count = 1, .reusable = true}}, SHIFT(334),
  [1900] = {.entry = {.count = 1, .reusable = true}}, SHIFT(615),
  [1902] = {.entry = {.count = 1, .reusable = true}}, SHIFT(192),
  [1904] = {.entry = {.count = 1, .reusable = true}}, SHIFT(193),
  [1906] = {.entry = {.count = 1, .reusable = true}}, SHIFT(134),
  [1908] = {.entry = {.count = 1, .reusable = true}}, SHIFT(395),
  [1910] = {.entry = {.count = 1, .reusable = true}}, SHIFT(701),
  [1912] = {.entry = {.count = 1, .reusable = true}}, SHIFT(196),
  [1914] = {.entry = {.count = 1, .reusable = true}}, SHIFT(56),
  [1916] = {.entry = {.count = 1, .reusable = true}}, SHIFT(38),
  [1918] = {.entry = {.count = 1, .reusable = true}}, SHIFT(532),
  [1920] = {.entry = {.count = 1, .reusable = true}}, SHIFT(536),
  [1922] = {.entry = {.count = 1, .reusable = true}}, SHIFT(203),
  [1924] = {.entry = {.count = 1, .reusable = true}}, SHIFT(292),
  [1926] = {.entry = {.count = 1, .reusable = true}}, SHIFT(88),
  [1928] = {.entry = {.count = 1, .reusable = true}}, SHIFT(533),
  [1930] = {.entry = {.count = 1, .reusable = true}}, SHIFT(663),
  [1932] = {.entry = {.count = 1, .reusable = true}}, SHIFT(451),
  [1934] = {.entry = {.count = 1, .reusable = true}}, SHIFT(629),
  [1936] = {.entry = {.count = 1, .reusable = true}}, SHIFT(583),
  [1938] = {.entry = {.count = 1, .reusable = true}}, SHIFT(311),
  [1940] = {.entry = {.count = 1, .reusable = true}}, SHIFT(217),
  [1942] = {.entry = {.count = 1, .reusable = true}}, SHIFT(313),
  [1944] = {.entry = {.count = 1, .reusable = true}}, SHIFT(220),
  [1946] = {.entry = {.count = 1, .reusable = true}}, SHIFT(42),
  [1948] = {.entry = {.count = 1, .reusable = true}}, SHIFT(505),
  [1950] = {.entry = {.count = 1, .reusable = true}}, SHIFT(224),
  [1952] = {.entry = {.count = 1, .reusable = true}}, SHIFT(225),
  [1954] = {.entry = {.count = 1, .reusable = true}}, SHIFT(755),
  [1956] = {.entry = {.count = 1, .reusable = true}}, SHIFT(314),
  [1958] = {.entry = {.count = 1, .reusable = true}}, SHIFT(232),
  [1960] = {.entry = {.count = 1, .reusable = true}}, SHIFT(233),
  [1962] = {.entry = {.count = 1, .reusable = true}}, SHIFT(234),
  [1964] = {.entry = {.count = 1, .reusable = true}}, SHIFT(664),
  [1966] = {.entry = {.count = 1, .reusable = true}}, SHIFT(76),
  [1968] = {.entry = {.count = 1, .reusable = true}}, SHIFT(512),
  [1970] = {.entry = {.count = 1, .reusable = true}}, SHIFT(645),
  [1972] = {.entry = {.count = 1, .reusable = true}}, SHIFT(552),
  [1974] = {.entry = {.count = 1, .reusable = true}}, SHIFT(141),
  [1976] = {.entry = {.count = 1, .reusable = true}}, SHIFT(142),
  [1978] = {.entry = {.count = 1, .reusable = true}}, SHIFT(247),
  [1980] = {.entry = {.count = 1, .reusable = true}}, SHIFT(248),
  [1982] = {.entry = {.count = 1, .reusable = true}}, SHIFT(249),
  [1984] = {.entry = {.count = 1, .reusable = true}}, SHIFT(686),
  [1986] = {.entry = {.count = 1, .reusable = true}}, SHIFT(252),
  [1988] = {.entry = {.count = 1, .reusable = true}}, SHIFT(253),
  [1990] = {.entry = {.count = 1, .reusable = true}}, SHIFT(254),
  [1992] = {.entry = {.count = 1, .reusable = true}}, SHIFT(704),
  [1994] = {.entry = {.count = 1, .reusable = true}}, SHIFT(409),
  [1996] = {.entry = {.count = 1, .reusable = true}}, SHIFT(774),
  [1998] = {.entry = {.count = 1, .reusable = true}}, SHIFT(647),
  [2000] = {.entry = {.count = 1, .reusable = true}}, SHIFT(488),
  [2002] = {.entry = {.count = 1, .reusable = true}}, SHIFT(261),
  [2004] = {.entry = {.count = 1, .reusable = true}}, SHIFT(417),
  [2006] = {.entry = {.count = 1, .reusable = true}}, SHIFT(263),
  [2008] = {.entry = {.count = 1, .reusable = true}}, SHIFT(264),
  [2010] = {.entry = {.count = 1, .reusable = true}}, SHIFT(69),
  [2012] = {.entry = {.count = 1, .reusable = true}}, SHIFT(711),
  [2014] = {.entry = {.count = 1, .reusable = true}}, SHIFT(268),
  [2016] = {.entry = {.count = 1, .reusable = true}}, SHIFT(269),
  [2018] = {.entry = {.count = 1, .reusable = true}}, SHIFT(595),
  [2020] = {.entry = {.count = 1, .reusable = true}}, SHIFT(91),
  [2022] = {.entry = {.count = 1, .reusable = true}}, SHIFT(737),
  [2024] = {.entry = {.count = 1, .reusable = true}}, SHIFT(448),
  [2026] = {.entry = {.count = 1, .reusable = true}}, SHIFT(425),
  [2028] = {.entry = {.count = 1, .reusable = true}}, SHIFT(54),
  [2030] = {.entry = {.count = 1, .reusable = true}}, SHIFT(279),
  [2032] = {.entry = {.count = 1, .reusable = true}}, SHIFT(280),
  [2034] = {.entry = {.count = 1, .reusable = true}}, SHIFT(120),
  [2036] = {.entry = {.count = 1, .reusable = true}}, SHIFT(426),
  [2038] = {.entry = {.count = 1, .reusable = true}},  ACCEPT_INPUT(),
  [2040] = {.entry = {.count = 1, .reusable = true}}, SHIFT(121),
  [2042] = {.entry = {.count = 1, .reusable = true}}, SHIFT(95),
  [2044] = {.entry = {.count = 1, .reusable = true}}, SHIFT(310),
  [2046] = {.entry = {.count = 1, .reusable = true}}, SHIFT(407),
  [2048] = {.entry = {.count = 1, .reusable = true}}, SHIFT(288),
  [2050] = {.entry = {.count = 1, .reusable = true}}, SHIFT(295),
  [2052] = {.entry = {.count = 1, .reusable = true}}, SHIFT(685),
  [2054] = {.entry = {.count = 1, .reusable = true}}, SHIFT(727),
  [2056] = {.entry = {.count = 1, .reusable = true}}, SHIFT(423),
  [2058] = {.entry = {.count = 1, .reusable = true}}, SHIFT(489),
  [2060] = {.entry = {.count = 1, .reusable = true}}, SHIFT(620),
  [2062] = {.entry = {.count = 1, .reusable = true}}, SHIFT(622),
  [2064] = {.entry = {.count = 1, .reusable = true}}, SHIFT(380),
  [2066] = {.entry = {.count = 1, .reusable = true}}, SHIFT(152),
  [2068] = {.entry = {.count = 1, .reusable = true}}, SHIFT(579),
  [2070] = {.entry = {.count = 1, .reusable = true}}, SHIFT(122),
  [2072] = {.entry = {.count = 1, .reusable = true}}, SHIFT(431),
  [2074] = {.entry = {.count = 1, .reusable = true}}, SHIFT(556),
  [2076] = {.entry = {.count = 1, .reusable = true}}, SHIFT(371),
  [2078] = {.entry = {.count = 1, .reusable = true}}, SHIFT(560),
  [2080] = {.entry = {.count = 1, .reusable = true}}, SHIFT(446),
  [2082] = {.entry = {.count = 1, .reusable = true}}, SHIFT(369),
  [2084] = {.entry = {.count = 1, .reusable = true}}, SHIFT(435),
  [2086] = {.entry = {.count = 1, .reusable = true}}, SHIFT(640),
  [2088] = {.entry = {.count = 1, .reusable = true}}, SHIFT(456),
  [2090] = {.entry = {.count = 1, .reusable = true}}, SHIFT(415),
  [2092] = {.entry = {.count = 1, .reusable = true}}, SHIFT(400),
  [2094] = {.entry = {.count = 1, .reusable = true}}, SHIFT(504),
  [2096] = {.entry = {.count = 1, .reusable = true}}, SHIFT(46),
  [2098] = {.entry = {.count = 1, .reusable = true}}, SHIFT(648),
  [2100] = {.entry = {.count = 1, .reusable = true}}, SHIFT(651),
  [2102] = {.entry = {.count = 1, .reusable = true}}, SHIFT(598),
  [2104] = {.entry = {.count = 1, .reusable = true}}, SHIFT(655),
  [2106] = {.entry = {.count = 1, .reusable = true}}, SHIFT(656),
  [2108] = {.entry = {.count = 1, .reusable = true}}, SHIFT(657),
  [2110] = {.entry = {.count = 1, .reusable = true}}, SHIFT(457),
  [2112] = {.entry = {.count = 1, .reusable = true}}, SHIFT(401),
  [2114] = {.entry = {.count = 1, .reusable = true}}, SHIFT(458),
  [2116] = {.entry = {.count = 1, .reusable = true}}, SHIFT(383),
  [2118] = {.entry = {.count = 1, .reusable = true}}, SHIFT(403),
  [2120] = {.entry = {.count = 1, .reusable = true}}, SHIFT(667),
  [2122] = {.entry = {.count = 1, .reusable = true}}, SHIFT(411),
  [2124] = {.entry = {.count = 1, .reusable = true}}, SHIFT(669),
  [2126] = {.entry = {.count = 1, .reusable = true}}, SHIFT(399),
  [2128] = {.entry = {.count = 1, .reusable = true}}, SHIFT(671),
  [2130] = {.entry = {.count = 1, .reusable = true}}, SHIFT(623),
  [2132] = {.entry = {.count = 1, .reusable = true}}, SHIFT(502),
  [2134] = {.entry = {.count = 1, .reusable = true}}, SHIFT(460),
  [2136] = {.entry = {.count = 1, .reusable = true}}, SHIFT(39),
  [2138] = {.entry = {.count = 1, .reusable = true}}, SHIFT(677),
  [2140] = {.entry = {.count = 1, .reusable = true}}, SHIFT(679),
  [2142] = {.entry = {.count = 1, .reusable = true}}, SHIFT(680),
  [2144] = {.entry = {.count = 1, .reusable = true}}, SHIFT(630),
  [2146] = {.entry = {.count = 1, .reusable = true}}, SHIFT(462),
  [2148] = {.entry = {.count = 1, .reusable = true}}, SHIFT(683),
  [2150] = {.entry = {.count = 1, .reusable = true}}, SHIFT(684),
  [2152] = {.entry = {.count = 1, .reusable = true}}, SHIFT(463),
  [2154] = {.entry = {.count = 1, .reusable = true}}, SHIFT(408),
  [2156] = {.entry = {.count = 1, .reusable = true}}, SHIFT(464),
  [2158] = {.entry = {.count = 1, .reusable = true}}, SHIFT(308),
  [2160] = {.entry = {.count = 1, .reusable = true}}, SHIFT(522),
  [2162] = {.entry = {.count = 1, .reusable = true}}, SHIFT(638),
  [2164] = {.entry = {.count = 1, .reusable = true}}, SHIFT(691),
  [2166] = {.entry = {.count = 1, .reusable = true}}, SHIFT(692),
  [2168] = {.entry = {.count = 1, .reusable = true}}, SHIFT(125),
  [2170] = {.entry = {.count = 1, .reusable = true}}, SHIFT(465),
  [2172] = {.entry = {.count = 1, .reusable = true}}, SHIFT(654),
  [2174] = {.entry = {.count = 1, .reusable = true}}, SHIFT(584),
  [2176] = {.entry = {.count = 1, .reusable = true}}, SHIFT(126),
  [2178] = {.entry = {.count = 1, .reusable = true}}, SHIFT(127),
  [2180] = {.entry = {.count = 1, .reusable = true}}, SHIFT(535),
  [2182] = {.entry = {.count = 1, .reusable = true}}, SHIFT(760),
  [2184] = {.entry = {.count = 1, .reusable = true}}, SHIFT(719),
  [2186] = {.entry = {.count = 1, .reusable = true}}, SHIFT(393),
  [2188] = {.entry = {.count = 1, .reusable = true}}, SHIFT(394),
  [2190] = {.entry = {.count = 1, .reusable = true}}, SHIFT(728),
  [2192] = {.entry = {.count = 1, .reusable = true}}, SHIFT(729),
  [2194] = {.entry = {.count = 1, .reusable = true}}, SHIFT(330),
  [2196] = {.entry = {.count = 1, .reusable = true}}, SHIFT(153),
  [2198] = {.entry = {.count = 1, .reusable = true}}, SHIFT(332),
  [2200] = {.entry = {.count = 1, .reusable = true}}, SHIFT(429),
  [2202] = {.entry = {.count = 1, .reusable = true}}, SHIFT(430),
  [2204] = {.entry = {.count = 1, .reusable = true}}, SHIFT(432),
  [2206] = {.entry = {.count = 1, .reusable = true}}, SHIFT(433),
  [2208] = {.entry = {.count = 1, .reusable = true}}, SHIFT(434),
  [2210] = {.entry = {.count = 1, .reusable = true}}, SHIFT(97),
  [2212] = {.entry = {.count = 1, .reusable = true}}, SHIFT(599),
  [2214] = {.entry = {.count = 1, .reusable = true}}, SHIFT(773),
  [2216] = {.entry = {.count = 1, .reusable = true}}, SHIFT(580),
  [2218] = {.entry = {.count = 1, .reusable = true}}, SHIFT(775),
  [2220] = {.entry = {.count = 1, .reusable = true}}, SHIFT(776),
  [2222] = {.entry = {.count = 1, .reusable = true}}, SHIFT(777),
  [2224] = {.entry = {.count = 1, .reusable = true}}, SHIFT(778),
  [2226] = {.entry = {.count = 1, .reusable = true}}, SHIFT(779),
  [2228] = {.entry = {.count = 1, .reusable = true}}, SHIFT(780),
  [2230] = {.entry = {.count = 1, .reusable = true}}, SHIFT(449),
  [2232] = {.entry = {.count = 1, .reusable = true}}, SHIFT(214),
  [2234] = {.entry = {.count = 1, .reusable = true}}, SHIFT(98),
  [2236] = {.entry = {.count = 1, .reusable = true}}, SHIFT(454),
  [2238] = {.entry = {.count = 1, .reusable = true}}, SHIFT(418),
  [2240] = {.entry = {.count = 1, .reusable = true}}, SHIFT(312),
  [2242] = {.entry = {.count = 1, .reusable = true}}, SHIFT(422),
  [2244] = {.entry = {.count = 1, .reusable = true}}, SHIFT(470),
  [2246] = {.entry = {.count = 1, .reusable = true}}, SHIFT(765),
  [2248] = {.entry = {.count = 1, .reusable = true}}, SHIFT(487),
  [2250] = {.entry = {.count = 1, .reusable = true}}, SHIFT(576),
  [2252] = {.entry = {.count = 1, .reusable = true}}, SHIFT(577),
  [2254] = {.entry = {.count = 1, .reusable = true}}, SHIFT(503),
};

enum ts_external_scanner_symbol_identifiers {
  ts_external_token__newline = 0,
  ts_external_token__indent = 1,
  ts_external_token__dedent = 2,
};

static const TSSymbol ts_external_scanner_symbol_map[EXTERNAL_TOKEN_COUNT] = {
  [ts_external_token__newline] = sym__newline,
  [ts_external_token__indent] = sym__indent,
  [ts_external_token__dedent] = sym__dedent,
};

static const bool ts_external_scanner_states[7][EXTERNAL_TOKEN_COUNT] = {
  [1] = {
    [ts_external_token__newline] = true,
    [ts_external_token__indent] = true,
    [ts_external_token__dedent] = true,
  },
  [2] = {
    [ts_external_token__newline] = true,
  },
  [3] = {
    [ts_external_token__dedent] = true,
  },
  [4] = {
    [ts_external_token__indent] = true,
  },
  [5] = {
    [ts_external_token__newline] = true,
    [ts_external_token__dedent] = true,
  },
  [6] = {
    [ts_external_token__indent] = true,
    [ts_external_token__dedent] = true,
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
