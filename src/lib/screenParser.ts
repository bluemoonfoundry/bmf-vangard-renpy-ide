import type { ScreenLayoutComposition, ScreenWidget, ScreenWidgetType } from '@/types';

// Widgets that introduce an indented child block.
const CONTAINER_KEYWORDS = new Set([
  'vbox', 'hbox', 'frame', 'window', 'viewport', 'button', 'if', 'for',
]);

// Widget keyword → ScreenWidgetType (for the ones that map 1-to-1).
const WIDGET_KW_MAP: Record<string, ScreenWidgetType> = {
  vbox: 'vbox', hbox: 'hbox', frame: 'frame', window: 'window',
  viewport: 'viewport', text: 'text', image: 'image', add: 'image',
  textbutton: 'textbutton', button: 'button', imagebutton: 'imagebutton',
  bar: 'bar', input: 'input', 'null': 'null',
  if: 'if', for: 'for',
};

// Properties that map directly to ScreenWidget fields (applied from child property lines).
const SCALAR_PROPS: Record<string, keyof ScreenWidget> = {
  xpos: 'xpos', ypos: 'ypos', xalign: 'xalign', yalign: 'yalign',
  xsize: 'xsize', ysize: 'ysize', style: 'style',
  action: 'action', scrollbars: 'scrollbars', mousewheel: 'mousewheel',
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

/** Set a known ScreenWidget property by field name, coercing value to the right type. */
function setWidgetProp(target: Partial<ScreenWidget>, field: keyof ScreenWidget, raw: string): void {
  if (field === 'xpos' || field === 'ypos' || field === 'xsize' || field === 'ysize') {
    (target as { [k: string]: unknown })[field] = Number(raw);
  } else if (field === 'xalign' || field === 'yalign') {
    (target as { [k: string]: unknown })[field] = parseFloat(raw);
  } else if (field === 'mousewheel') {
    (target as { [k: string]: unknown })[field] = raw === 'True';
  } else {
    (target as { [k: string]: unknown })[field] = raw;
  }
}

/**
 * Parse inline attribute tokens from a widget declaration line.
 * Handles quoted strings, known SCALAR_PROPS, and unquoted first-arg expressions
 * (e.g. gui.main_menu_background, _("Return")).
 */
function parseInlineAttrs(tokens: string[]): Partial<ScreenWidget> {
  const out: Partial<ScreenWidget> = {};
  let i = 0;
  let firstArgConsumed = false;
  while (i < tokens.length) {
    const t = tokens[i];
    // Quoted string → text content
    if (t.startsWith('"') || t.startsWith("'")) {
      const val = t.replace(/^["']|["']$/g, '');
      if (!firstArgConsumed) {
        out.text = val;
        firstArgConsumed = true;
      }
      i++;
      continue;
    }
    // Known property: name + value pair
    const mapped = SCALAR_PROPS[t];
    if (mapped && i + 1 < tokens.length) {
      const raw = tokens[i + 1].replace(/^["']|["']$/g, '');
      setWidgetProp(out, mapped, raw);
      i += 2;
      continue;
    }
    // Unquoted first positional argument (e.g. gui.main_menu_background, _("Return"))
    // — not a known widget keyword or property name, must be an expression value
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

/** Apply a single known SCALAR_PROP child-property line to a widget. */
function applyKnownProp(widget: ScreenWidget, key: string, rawLine: string): void {
  const tokens = tokeniseLine(rawLine.trim());
  const mapped = SCALAR_PROPS[key];
  if (!mapped || tokens.length < 2) return;
  const val = tokens[1].replace(/^["']|["']$/g, '');
  setWidgetProp(widget, mapped, val);
}

/** Simple token splitter respecting quoted strings. */
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
 * Capture the body of an unrecognised block statement as a multi-line raw code string.
 * Returns the captured lines and advances `li` past the block body.
 * The opening line (with colon) is NOT included — pass it separately.
 */
function captureBlock(lines: string[], startLi: number, blockIndent: number): { code: string; nextLi: number } {
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
 * Parse Ren'Py screen code into a ScreenLayoutComposition.
 *
 * Design principles:
 * - Known widget keywords → structured ScreenWidget nodes.
 * - Known scalar properties → applied to the parent widget.
 * - Unrecognised block statements (elif, vpgrid, key, use, etc.) → multi-line 'raw' nodes
 *   that capture the entire block body preserving relative indentation.
 * - Unrecognised single-line statements → single-line 'raw' nodes.
 * - Nothing is silently dropped.
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

    // ── else clause (BEFORE stack pop so we can still find the if) ────────
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
      // No matching if found (else after elif chain) → fall through to raw capture below
      // We must NOT continue here; re-process this line through the normal path.
      // Since `else:` ends with `:`, it'll be caught by the block-capture path.
    }

    // ── Stack pop ─────────────────────────────────────────────────────────
    while (stack.length > 0 && lineIndent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    // ── python block body accumulation ────────────────────────────────────
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

    // ── Tokenise ──────────────────────────────────────────────────────────
    const isBlock = trimmed.endsWith(':');
    const withoutColon = isBlock ? trimmed.slice(0, -1).trim() : trimmed;
    const tokens = tokeniseLine(withoutColon);
    if (tokens.length === 0) { li++; continue; }
    const kw = tokens[0].toLowerCase();

    // ── if widget ─────────────────────────────────────────────────────────
    if (kw === 'if') {
      const condition = tokens.slice(1).join(' ');
      const w: ScreenWidget = { id: uid(), type: 'if', condition, children: [] };
      activeChildren().push(w);
      if (isBlock) stack.push({ widget: w, indent: lineIndent, inElse: false });
      li++;
      continue;
    }

    // ── for widget ────────────────────────────────────────────────────────
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

    // ── known widget keyword ──────────────────────────────────────────────
    const widgetType = WIDGET_KW_MAP[kw];
    if (widgetType) {
      const w: ScreenWidget = { id: uid(), type: widgetType };
      if (CONTAINER_KEYWORDS.has(kw)) w.children = [];
      if (tokens.length > 1) {
        const attrs = parseInlineAttrs(tokens.slice(1));
        if (kw === 'add' || kw === 'image' || kw === 'imagebutton') {
          if (attrs.text !== undefined && attrs.imagePath === undefined) {
            attrs.imagePath = attrs.text;
            delete attrs.text;
          }
        }
        Object.assign(w, attrs);
      }
      activeChildren().push(w);
      if (isBlock) stack.push({ widget: w, indent: lineIndent, inElse: false });
      li++;
      continue;
    }

    // ── known scalar property on current parent ───────────────────────────
    // Only SCALAR_PROP keys are treated as properties; everything else is a
    // raw child node to preserve order and prevent data loss.
    if (SCALAR_PROPS[kw] && stack.length > 0) {
      const top = stack[stack.length - 1];
      if (lineIndent > top.indent) {
        applyKnownProp(top.widget, kw, trimmed);
        li++;
        continue;
      }
    }

    // ── unrecognised block statement → multi-line raw capture ─────────────
    // Captures the opening line plus the entire indented body as one raw node.
    if (isBlock) {
      const { code: bodyCode, nextLi } = captureBlock(lines, li + 1, lineIndent);
      const code = bodyCode ? trimmed + '\n' + bodyCode : trimmed;
      activeChildren().push({ id: uid(), type: 'raw', code });
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
