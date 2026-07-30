# Diagnostics Reference

### 8.1 Diagnostic Types

| Category | Severity | ID Pattern | Description |
|----------|----------|------------|-------------|
| Invalid Jump/Call | Error | `invalid-jump` | A `jump` or `call` statement targets a label that does not exist in the project. |
| Syntax Error | Error | `syntax` | A parse failure detected by the Ren'Py validator, with file and line number. |
| Missing Image | Warning | `missing-image` | An image tag in a `show` or `scene` statement does not match any image asset or `image` definition. |
| Missing Audio | Warning | `missing-audio` | An audio reference in a `play` or `queue` statement does not match any audio asset or variable. |
| Undefined Character | Warning | `undefined-character` | A tag is used as a dialogue speaker but has no corresponding `define Character(...)` definition. |
| Undefined Screen | Warning | `undefined-screen` | A screen name in a `call screen`, `show screen`, or `hide screen` statement has no matching `screen` definition. |
| Undefined Variable | Warning | `undefined-variable` | A name is used in `[interpolation]` or an `if`/`elif`/`while` condition but has no corresponding `define`/`default` definition. |
| Pickle-Unsafe Variable | Warning | `pickle-unsafe-variable` | A `default` variable stores a lambda or class instance that may not survive Ren'Py's pickle-based save system. |
| Define Mutated | Warning | `define-mutated` | A variable declared with `define` (constant) is reassigned at runtime via `$`. Should likely be `default`. |
| Unused Character | Info | `unused-character` | A character is defined with `define Character(...)` but never speaks a line of dialogue. |
| Unused Variable | Info | `unused-variable` | A story variable is defined but never referenced anywhere in code. Limited to story blocks to avoid false positives on GUI/config variables. |
| Unreachable Label | Info | `unreachable-label` | No `jump` or `call` anywhere in the project targets this label. Conventional entry points (`start`, `quit`, `splashscreen`, `main_menu`, `after_load`, `_`-prefixed) are excluded. |
| Dead-End Label | Info | `dead-end-label` | A label has no outgoing `jump`, `call`, or `return` exit. May be an intentional ending or a missing navigation statement. |
| Implicit Variable | Info | `implicit-variable` | A story variable is set with an implicit (bare `$ var = ...`) definition instead of an explicit `default`/`define` declaration. |

### 8.2 Example Messages

Each diagnostic type produces a message formatted for quick identification:

| Category | Example Message |
|----------|----------------|
| Invalid Jump/Call | `Undefined label "chapter_3"` |
| Syntax Error | (varies by parse failure, includes line and column) |
| Missing Image | `Image "eileen happy" not found in assets or definitions` |
| Missing Audio | `Audio "bgm_theme.ogg" not found in assets or variables` |
| Undefined Character | `Character "narrator_v2" used in dialogue but never defined` |
| Undefined Screen | `Screen "custom_menu" referenced but never defined` |
| Undefined Variable | `Variable "chosen_path" is used but never defined` |
| Pickle-Unsafe Variable | `"my_callback" stores a lambda which may not be pickle-safe -- save files could break` |
| Define Mutated | `"score" is declared with define (constant) but assigned in script -- use default instead` |
| Unused Character | `Character "side_char" (Side Character) is defined but never used in dialogue` |
| Unused Variable | `Variable "temp_flag" is defined but never referenced` |
| Unreachable Label | `Label "secret_ending" is never reached by any jump or call` |
| Dead-End Label | `Label "epilogue" has no jump, call, or return exit -- verify this is an intentional ending` |
| Implicit Variable | `[IMPLICIT_VAR] Variable 'flag' uses implicit definition. Consider using 'default flag = ...' for better compatibility.` |

### 8.3 Panel Features

- **Click to jump**: click any diagnostic to open the file at the relevant line in the editor.
- **Severity filter**: toggle visibility of errors, warnings, and info-level diagnostics independently.
- **Suppression**: click the "Ignore issue" button on a diagnostic to add an ignore rule. Suppressed diagnostics are hidden until the rule is removed. Rules are stored in `game/project.ide.json` under `ignoredDiagnostics`. A rule matches a diagnostic only when category, file path, block ID, line, and message are all exactly equal — there is no partial, pattern, or substring matching.

### 8.4 Canvas Integration

Blocks on the Project Canvas display a colored glow based on the most severe diagnostic they contain:

| Glow Color | Meaning |
|------------|---------|
| Red | Block contains at least one error-level diagnostic. |
| Amber | Block contains warnings but no errors. |
| (none) | Block is clean or contains only info-level diagnostics. |

### 8.5 Toolbar Badge

The diagnostics button in the toolbar shows a red badge with the total error count. The badge is hidden when there are zero errors.

### 8.6 Task Checklist

Tasks are created manually via the "New task..." input, or auto-derived as previews from sticky notes on any canvas — there is no action that converts a diagnostic issue directly into a task. Tasks have two states: `open` and `completed`. The task list appears in the Diagnostics panel and is persisted in `game/project.ide.json` under `diagnosticsTasks`.
