import type { ScreenLayoutComposition, ScreenWidget, ScreenWidgetType } from '@/types';

// Widgets that introduce an indented child block.
const CONTAINER_KEYWORDS = new Set([
  'vbox', 'hbox', 'frame', 'window', 'viewport',
  'button', 'if', 'else', 'for',
]);

// Widget keyword → ScreenWidgetType (for the ones that map 1-to-1).
const WIDGET_KW_MAP: Record<string, ScreenWidgetType> = {
  vbox: 'vbox', hbox: 'hbox', frame: 'frame', window: 'window',
  viewport: 'viewport', text: 'text', image: 'image', add: 'image',
  textbutton: 'textbutton', button: 'button', imagebutton: 'imagebutton',
  bar: 'bar', input: 'input', 'null': 'null',
  if: 'if', for: 'for',
};

// Known scalar properties that map directly to ScreenWidget fields.
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
  /** true when we are currently filling elseChildren */
  inElse: boolean;
}

/**
 * Parse the inline attribute tokens from a widget declaration line.
 * e.g. `textbutton "Click Me" action Return()` → { text: "Click Me", action: "Return()" }
 */
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

function parseInlineAttrs(tokens: string[]): Partial<ScreenWidget> {
  const out: Partial<ScreenWidget> = {};
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    // Quoted string → text content for text/textbutton or imagePath for add/image/imagebutton
    if (t.startsWith('"') || t.startsWith("'")) {
      const val = t.replace(/^["']|["']$/g, '');
      if (out.text === undefined && out.imagePath === undefined) {
        out.text = val;
      }
      i++;
      continue;
    }
    const mapped = SCALAR_PROPS[t];
    if (mapped && i + 1 < tokens.length) {
      const raw = tokens[i + 1].replace(/^["']|["']$/g, '');
      setWidgetProp(out, mapped, raw);
      i += 2;
      continue;
    }
    i++;
  }
  return out;
}

/**
 * Apply a single property line (already known to be a property, not a widget decl)
 * to the target widget, using extraProps as the fallback bucket.
 */
function applyPropLine(widget: ScreenWidget, raw: string): void {
  const trimmed = raw.trim();
  const tokens = tokeniseLine(trimmed);
  if (tokens.length === 0) return;
  const key = tokens[0];

  const mapped = SCALAR_PROPS[key];
  if (mapped && tokens.length >= 2) {
    const val = tokens[1].replace(/^["']|["']$/g, '');
    setWidgetProp(widget, mapped, val);
    return;
  }

  // Unknown attribute → extraProps
  if (!widget.extraProps) widget.extraProps = [];
  widget.extraProps.push(trimmed);
}

/** Simple token splitter: respects quoted strings and collapses whitespace. */
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
 * Parse Ren'Py screen code into a ScreenLayoutComposition.
 *
 * Handles: all container/leaf widgets, if/else, for, python blocks ($), and
 * falls back to 'raw' for unrecognised lines. extraProps captures unrecognised
 * attributes on otherwise-known widgets.
 *
 * The input should be the full screen block text starting at `screen name():`.
 */
export function parseScreenCode(code: string): ScreenLayoutComposition {
  const lines = code.split('\n');

  // ── Screen header ─────────────────────────────────────────────────────────
  let screenName = 'unknown_screen';
  let modal = false;
  let zorder = 0;

  const headerMatch = lines[0]?.match(/^\s*screen\s+(\w+)\s*\([^)]*\)\s*(?:(.*))?:/);
  if (headerMatch) {
    screenName = headerMatch[1];
    const rest = headerMatch[2] ?? '';
    if (/modal\s+True/i.test(rest)) modal = true;
    const zo = rest.match(/zorder\s+(\d+)/);
    if (zo) zorder = parseInt(zo[1], 10);
  }

  // ── Widget tree walk ──────────────────────────────────────────────────────
  const rootWidgets: ScreenWidget[] = [];
  const stack: StackEntry[] = [];

  // Returns the currently active children array (respects if/else branches).
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

  // The body starts at the first indented line after the screen header.
  // Determine body base indent from the second non-blank line.
  let bodyIndent = -1;

  for (let li = 1; li < lines.length; li++) {
    const raw = lines[li];
    const trimmed = raw.trim();

    // Skip blanks and full-line comments
    if (!trimmed || trimmed.startsWith('#')) continue;

    const lineIndent = indentOf(raw);

    // Capture body base indent
    if (bodyIndent === -1) bodyIndent = lineIndent;

    // ── else clause handling (must run BEFORE stack pop) ─────────────────
    // else: appears at the same indent as its if:, which would cause the if
    // to be popped before we can find it. Check first.
    if (trimmed === 'else:') {
      // Find the innermost 'if' at the same indent level
      for (let si = stack.length - 1; si >= 0; si--) {
        if (stack[si].widget.type === 'if' && stack[si].indent === lineIndent) {
          stack[si].inElse = true;
          stack.splice(si + 1);
          break;
        }
      }
      continue;
    }

    // ── Pop stack entries that are no longer in scope ─────────────────────
    while (stack.length > 0 && lineIndent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    // ── python statement ($) ──────────────────────────────────────────────
    if (trimmed.startsWith('$ ')) {
      const w: ScreenWidget = { id: uid(), type: 'python', code: trimmed.slice(2).trim() };
      activeChildren().push(w);
      continue;
    }

    // ── python block ──────────────────────────────────────────────────────
    if (trimmed === 'python:') {
      const w: ScreenWidget = { id: uid(), type: 'python', code: '' };
      activeChildren().push(w);
      stack.push({ widget: w, indent: lineIndent, inElse: false });
      continue;
    }

    // ── pass (empty container body) ───────────────────────────────────────
    if (trimmed === 'pass') continue;

    // ── Tokenise the trimmed line ─────────────────────────────────────────
    // Strip trailing colon (container declaration)
    const isBlock = trimmed.endsWith(':');
    const withoutColon = isBlock ? trimmed.slice(0, -1).trim() : trimmed;
    const tokens = tokeniseLine(withoutColon);
    if (tokens.length === 0) continue;

    const kw = tokens[0].toLowerCase();

    // ── if widget ────────────────────────────────────────────────────────
    if (kw === 'if') {
      const condition = tokens.slice(1).join(' ');
      const w: ScreenWidget = { id: uid(), type: 'if', condition, children: [] };
      activeChildren().push(w);
      if (isBlock) stack.push({ widget: w, indent: lineIndent, inElse: false });
      continue;
    }

    // ── for widget ───────────────────────────────────────────────────────
    if (kw === 'for') {
      // "for VAR in ITERABLE"
      const inIdx = tokens.findIndex(t => t === 'in');
      const forVariable = inIdx > 1 ? tokens.slice(1, inIdx).join(' ') : tokens[1] ?? '';
      const forIterable = inIdx >= 0 ? tokens.slice(inIdx + 1).join(' ') : '';
      const w: ScreenWidget = { id: uid(), type: 'for', forVariable, forIterable, children: [] };
      activeChildren().push(w);
      if (isBlock) stack.push({ widget: w, indent: lineIndent, inElse: false });
      continue;
    }

    // ── known widget keyword ─────────────────────────────────────────────
    const widgetType = WIDGET_KW_MAP[kw];
    if (widgetType) {
      const w: ScreenWidget = { id: uid(), type: widgetType };
      if (CONTAINER_KEYWORDS.has(kw)) w.children = [];

      // Inline attributes on the declaration line (everything after the keyword)
      if (tokens.length > 1) {
        const attrs = parseInlineAttrs(tokens.slice(1));
        // For 'add'/'image', first quoted string is imagePath not text
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
      continue;
    }

    // ── property line on the current parent ──────────────────────────────
    if (stack.length > 0) {
      const top = stack[stack.length - 1];
      // If this line is indented deeper than the parent's declaration, it's a property
      if (lineIndent > top.indent) {
        // For python blocks, accumulate code lines
        if (top.widget.type === 'python') {
          top.widget.code = top.widget.code
            ? top.widget.code + '\n' + trimmed
            : trimmed;
          continue;
        }
        applyPropLine(top.widget, trimmed);
        continue;
      }
    }

    // ── unclassifiable line → raw ─────────────────────────────────────────
    const w: ScreenWidget = { id: uid(), type: 'raw', code: trimmed };
    activeChildren().push(w);
  }

  return {
    screenName,
    gameWidth: 1920,
    gameHeight: 1080,
    modal,
    zorder,
    widgets: rootWidgets,
  };
}
