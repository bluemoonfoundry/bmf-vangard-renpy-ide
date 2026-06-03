import type { ScreenLayoutComposition, ScreenWidget, ScreenWidgetType } from '@/types';

// Container keywords that open an indented child block.
const CONTAINER_KEYWORDS = new Set([
  'vbox', 'hbox', 'fixed', 'frame', 'window', 'side',
  'viewport', 'vpgrid',
  'button', 'if', 'for', 'showif', 'use',
]);

// Widget keyword → ScreenWidgetType for known, directly-classified statements.
// Keys NOT listed here fall through to SCALAR_PROPS check, then raw capture.
const WIDGET_KW_MAP: Record<string, ScreenWidgetType> = {
  // Layout containers
  vbox: 'vbox', hbox: 'hbox', fixed: 'fixed', frame: 'frame',
  window: 'window', side: 'side',
  // Scrollable containers
  viewport: 'viewport', vpgrid: 'vpgrid',
  // Display
  text: 'text', image: 'image', add: 'image',
  // Interactive
  textbutton: 'textbutton', button: 'button', imagebutton: 'imagebutton',
  bar: 'bar', vbar: 'vbar', input: 'input', 'null': 'null',
};

// Properties that map directly to first-class ScreenWidget fields.
// Only lines whose leading keyword is in this map are treated as property lines;
// everything else becomes a raw child node preserving insertion order.
const SCALAR_PROPS: Record<string, keyof ScreenWidget> = {
  // Positioning
  xpos: 'xpos', ypos: 'ypos', xalign: 'xalign', yalign: 'yalign',
  // Size — width/height are Ren'Py aliases for xsize/ysize
  xsize: 'xsize', ysize: 'ysize', width: 'xsize', height: 'ysize',
  // Appearance
  style: 'style',
  // Interaction
  action: 'action', hovered: 'hovered', unhovered: 'unhovered',
  sensitive: 'sensitive', selected: 'selected',
  // Scroll containers
  scrollbars: 'scrollbars', mousewheel: 'mousewheel',
  // bar / vbar
  value: 'barValue',
  // Grid
  cols: 'cols', rows: 'rows',
  // Layout
  spacing: 'spacing',
  // Accessibility
  alt: 'alt',
  // imagebutton
  auto: 'auto',
};

let _seq = 0;
function uid(): string { return `p_${Date.now()}_${_seq++}`; }

function indentOf(line: string): number {
  let n = 0;
  for (const ch of line) {
    if (ch === ' ') n++;
    else if (ch === '\t') n += 4;
    else break;
  }
  return n;
}

interface StackEntry {
  widget: ScreenWidget;
  indent: number;
  inElse: boolean;
}

/** Set a known ScreenWidget property by field name, coercing value to the correct type. */
function setWidgetProp(target: Partial<ScreenWidget>, field: keyof ScreenWidget, raw: string): void {
  const numFields = new Set<keyof ScreenWidget>([
    'xpos', 'ypos', 'xsize', 'ysize', 'cols', 'rows',
  ]);
  const floatFields = new Set<keyof ScreenWidget>(['xalign', 'yalign']);
  if (numFields.has(field)) {
    (target as { [k: string]: unknown })[field] = Number(raw);
  } else if (floatFields.has(field)) {
    (target as { [k: string]: unknown })[field] = parseFloat(raw);
  } else if (field === 'mousewheel') {
    (target as { [k: string]: unknown })[field] = raw === 'True';
  } else {
    (target as { [k: string]: unknown })[field] = raw;
  }
}

/**
 * Parse inline attribute tokens from a widget declaration line.
 * Handles: quoted strings, SCALAR_PROPS key-value pairs, and unquoted first-arg
 * expressions (e.g. gui.main_menu_background, _("Return")).
 */
function parseInlineAttrs(tokens: string[]): Partial<ScreenWidget> {
  const out: Partial<ScreenWidget> = {};
  let i = 0;
  let firstArgConsumed = false;
  while (i < tokens.length) {
    const t = tokens[i];
    // Quoted string → first positional text argument
    if ((t.startsWith('"') || t.startsWith("'")) && !firstArgConsumed) {
      out.text = t.replace(/^["']|["']$/g, '');
      firstArgConsumed = true;
      i++;
      continue;
    }
    // Known property key + value
    const mapped = SCALAR_PROPS[t];
    if (mapped && i + 1 < tokens.length) {
      const raw = tokens[i + 1].replace(/^["']|["']$/g, '');
      setWidgetProp(out, mapped, raw);
      i += 2;
      continue;
    }
    // Unquoted first positional arg (expression like gui.bg, _("Return"), 0.5)
    if (!firstArgConsumed && !SCALAR_PROPS[t] && !WIDGET_KW_MAP[t.toLowerCase()]) {
      out.text = t;
      firstArgConsumed = true;
      i++;
      continue;
    }
    i++;
  }
  return out;
}

/** Apply a SCALAR_PROP child-property line to a widget. */
function applyKnownProp(widget: ScreenWidget, key: string, rawLine: string): void {
  const tokens = tokeniseLine(rawLine.trim());
  const mapped = SCALAR_PROPS[key];
  if (!mapped || tokens.length < 2) return;
  const val = tokens[1].replace(/^["']|["']$/g, '');
  setWidgetProp(widget, mapped, val);
}

/** Token splitter that respects quoted strings. */
function tokeniseLine(line: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inStr = false;
  let strChar = '';
  for (const ch of line) {
    if (inStr) {
      current += ch;
      if (ch === strChar) { tokens.push(current); current = ''; inStr = false; }
    } else if (ch === '"' || ch === "'") {
      current += ch; inStr = true; strChar = ch;
    } else if (ch === ' ' || ch === '\t') {
      if (current) { tokens.push(current); current = ''; }
    } else {
      current += ch;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

/**
 * Lookahead: collect all lines that are indented deeper than `blockIndent`
 * into a single multi-line code string.  Returns the body and the next line index.
 */
function captureBlock(
  lines: string[], startLi: number, blockIndent: number,
): { code: string; nextLi: number } {
  const bodyLines: string[] = [];
  let li = startLi;
  while (li < lines.length) {
    const raw = lines[li];
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith('#')) { li++; continue; }
    if (indentOf(raw) <= blockIndent) break;
    const relIndent = ' '.repeat(indentOf(raw) - blockIndent);
    bodyLines.push(relIndent + trimmed);
    li++;
  }
  return { code: bodyLines.join('\n'), nextLi: li };
}

/**
 * Parse a `use SCREENNAME` or `use SCREENNAME(ARGS)` token list into
 * useScreen + optional useArgs.
 */
function parseUseTarget(tokens: string[]): { useScreen: string; useArgs?: string } {
  // Re-join after the keyword so we can find the paren boundary ourselves.
  const full = tokens.join(' ');
  const parenIdx = full.indexOf('(');
  if (parenIdx < 0) return { useScreen: full.trim() };
  const screenName = full.slice(0, parenIdx).trim();
  const closeIdx = full.lastIndexOf(')');
  const args = closeIdx > parenIdx ? full.slice(parenIdx + 1, closeIdx).trim() : '';
  return { useScreen: screenName, useArgs: args || undefined };
}

/**
 * Parse Ren'Py screen code into a ScreenLayoutComposition.
 *
 * Supported statement types (per Ren'Py Screen Language spec):
 *   Containers: vbox hbox fixed frame window side viewport vpgrid button
 *   Display:    text image/add
 *   Interactive:textbutton imagebutton bar vbar input null
 *   Control:    if/elif/else for showif use transclude key timer
 *   Python:     $ ... / python:
 *   Fallback:   'raw' nodes for anything else (multi-line for block statements)
 */
export function parseScreenCode(code: string): ScreenLayoutComposition {
  const lines = code.split('\n');

  // ── Screen header ─────────────────────────────────────────────────────────
  let screenName = 'unknown_screen';
  let parameters: string | undefined;
  let modal = false;
  let zorder = 0;

  const headerMatch = lines[0]?.match(/^\s*screen\s+(\w+)\s*\(([^)]*)\)\s*(?:(.*))?:/);
  if (headerMatch) {
    screenName = headerMatch[1];
    const rawParams = headerMatch[2]?.trim();
    if (rawParams) parameters = rawParams;
    const rest = headerMatch[3] ?? '';
    if (/modal\s+True/i.test(rest)) modal = true;
    const zo = rest.match(/zorder\s+(\d+)/);
    if (zo) zorder = parseInt(zo[1], 10);
  }

  // ── Widget tree walk ──────────────────────────────────────────────────────
  const rootWidgets: ScreenWidget[] = [];
  const stack: StackEntry[] = [];

  function activeChildren(): ScreenWidget[] {
    if (stack.length === 0) return rootWidgets;
    const top = stack[stack.length - 1];
    if (top.inElse) {
      if (!top.widget.elseChildren) top.widget.elseChildren = [];
      return top.widget.elseChildren;
    }
    if (!top.widget.children) top.widget.children = [];
    return top.widget.children;
  }

  let bodyIndent = -1;
  let li = 1;

  while (li < lines.length) {
    const raw = lines[li];
    const trimmed = raw.trim();

    if (!trimmed || trimmed.startsWith('#')) { li++; continue; }

    const lineIndent = indentOf(raw);
    if (bodyIndent === -1) bodyIndent = lineIndent;

    // ── else clause (BEFORE stack pop) ───────────────────────────────────
    if (trimmed === 'else:') {
      let matched = false;
      for (let si = stack.length - 1; si >= 0; si--) {
        if (stack[si].widget.type === 'if' && stack[si].indent === lineIndent) {
          stack[si].inElse = true;
          stack.splice(si + 1);
          matched = true;
          break;
        }
      }
      li++;
      if (matched) continue;
      // No matching if (e.g. after elif chain) → fall through to raw block capture
    }

    // ── Stack pop ─────────────────────────────────────────────────────────
    while (stack.length > 0 && lineIndent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    // ── python block body ─────────────────────────────────────────────────
    if (stack.length > 0 && stack[stack.length - 1].widget.type === 'python') {
      const top = stack[stack.length - 1];
      top.widget.code = top.widget.code ? top.widget.code + '\n' + trimmed : trimmed;
      li++;
      continue;
    }

    // ── python statement ($) ──────────────────────────────────────────────
    if (trimmed.startsWith('$ ')) {
      activeChildren().push({ id: uid(), type: 'python', code: trimmed.slice(2).trim() });
      li++;
      continue;
    }

    // ── python block ──────────────────────────────────────────────────────
    if (trimmed === 'python:') {
      const w: ScreenWidget = { id: uid(), type: 'python', code: '' };
      activeChildren().push(w);
      stack.push({ widget: w, indent: lineIndent, inElse: false });
      li++;
      continue;
    }

    // ── pass ──────────────────────────────────────────────────────────────
    if (trimmed === 'pass') { li++; continue; }

    // ── transclude ────────────────────────────────────────────────────────
    if (trimmed === 'transclude') {
      activeChildren().push({ id: uid(), type: 'transclude' });
      li++;
      continue;
    }

    // ── Tokenise ──────────────────────────────────────────────────────────
    const isBlock = trimmed.endsWith(':');
    const withoutColon = isBlock ? trimmed.slice(0, -1).trim() : trimmed;
    const tokens = tokeniseLine(withoutColon);
    if (tokens.length === 0) { li++; continue; }
    const kw = tokens[0].toLowerCase();

    // ── if ────────────────────────────────────────────────────────────────
    if (kw === 'if') {
      const condition = tokens.slice(1).join(' ');
      const w: ScreenWidget = { id: uid(), type: 'if', condition, children: [] };
      activeChildren().push(w);
      if (isBlock) stack.push({ widget: w, indent: lineIndent, inElse: false });
      li++;
      continue;
    }

    // ── showif ────────────────────────────────────────────────────────────
    if (kw === 'showif') {
      const condition = tokens.slice(1).join(' ');
      const w: ScreenWidget = { id: uid(), type: 'showif', condition, children: [] };
      activeChildren().push(w);
      if (isBlock) stack.push({ widget: w, indent: lineIndent, inElse: false });
      li++;
      continue;
    }

    // ── for ───────────────────────────────────────────────────────────────
    if (kw === 'for') {
      const inIdx = tokens.findIndex(t => t === 'in');
      const forVariable = inIdx > 1 ? tokens.slice(1, inIdx).join(' ') : tokens[1] ?? '';
      const forIterable = inIdx >= 0 ? tokens.slice(inIdx + 1).join(' ') : '';
      const w: ScreenWidget = { id: uid(), type: 'for', forVariable, forIterable, children: [] };
      activeChildren().push(w);
      if (isBlock) stack.push({ widget: w, indent: lineIndent, inElse: false });
      li++;
      continue;
    }

    // ── use ───────────────────────────────────────────────────────────────
    if (kw === 'use') {
      const { useScreen, useArgs } = parseUseTarget(tokens.slice(1));
      const w: ScreenWidget = { id: uid(), type: 'use', useScreen, useArgs, children: [] };
      activeChildren().push(w);
      if (isBlock) stack.push({ widget: w, indent: lineIndent, inElse: false });
      li++;
      continue;
    }

    // ── key ───────────────────────────────────────────────────────────────
    if (kw === 'key') {
      const attrs = parseInlineAttrs(tokens.slice(1));
      const keyBinding = attrs.text;
      delete attrs.text;
      const w: ScreenWidget = { id: uid(), type: 'key', keyBinding, ...attrs };
      activeChildren().push(w);
      if (isBlock) stack.push({ widget: w, indent: lineIndent, inElse: false });
      li++;
      continue;
    }

    // ── timer ─────────────────────────────────────────────────────────────
    if (kw === 'timer') {
      const attrs = parseInlineAttrs(tokens.slice(1));
      const timerDelay = attrs.text;
      delete attrs.text;
      const w: ScreenWidget = { id: uid(), type: 'timer', timerDelay, ...attrs };
      activeChildren().push(w);
      if (isBlock) stack.push({ widget: w, indent: lineIndent, inElse: false });
      li++;
      continue;
    }

    // ── known widget keyword ──────────────────────────────────────────────
    const widgetType = WIDGET_KW_MAP[kw];
    if (widgetType) {
      const w: ScreenWidget = { id: uid(), type: widgetType };
      if (CONTAINER_KEYWORDS.has(kw)) w.children = [];
      if (tokens.length > 1) {
        const attrs = parseInlineAttrs(tokens.slice(1));
        // Rename first positional arg for specific widget types
        if ((kw === 'add' || kw === 'image' || kw === 'imagebutton') && attrs.text !== undefined) {
          attrs.imagePath = attrs.text;
          delete attrs.text;
        }
        if (kw === 'side' && attrs.text !== undefined) {
          attrs.sidePositions = attrs.text;
          delete attrs.text;
        }
        Object.assign(w, attrs);
      }
      activeChildren().push(w);
      if (isBlock) stack.push({ widget: w, indent: lineIndent, inElse: false });
      li++;
      continue;
    }

    // ── known scalar property on current parent ───────────────────────────
    if (SCALAR_PROPS[kw] && stack.length > 0) {
      const top = stack[stack.length - 1];
      if (lineIndent > top.indent) {
        applyKnownProp(top.widget, kw, trimmed);
        li++;
        continue;
      }
    }

    // ── unrecognised block statement → multi-line raw capture ─────────────
    if (isBlock) {
      const { code: bodyCode, nextLi } = captureBlock(lines, li + 1, lineIndent);
      const capturedCode = bodyCode ? trimmed + '\n' + bodyCode : trimmed;
      activeChildren().push({ id: uid(), type: 'raw', code: capturedCode });
      li = nextLi;
      continue;
    }

    // ── unrecognised single-line statement → raw child ────────────────────
    activeChildren().push({ id: uid(), type: 'raw', code: trimmed });
    li++;
  }

  return {
    screenName,
    parameters,
    gameWidth: 1920,
    gameHeight: 1080,
    modal,
    zorder,
    widgets: rootWidgets,
  };
}
