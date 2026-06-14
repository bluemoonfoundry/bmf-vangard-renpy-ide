import type { ScreenLayoutComposition, ScreenWidget, ScreenWidgetStyleProps, ScreenWidgetType } from '@/types';

// Container keywords: open an indented child block with a colon.
// Control-flow keywords (if, for, showif) are intentionally absent — they are
// captured as compound raw blocks by captureCompoundControlFlow().
const CONTAINER_KEYWORDS = new Set([
  'vbox', 'hbox', 'fixed', 'frame', 'window', 'side',
  'viewport', 'vpgrid', 'grid',
  'button', 'use',
  'transform', 'drag', 'draggroup', 'imagemap', 'nearrect',
]);

// Keyword → ScreenWidgetType for all directly-modelled statements.
const WIDGET_KW_MAP: Record<string, ScreenWidgetType> = {
  // Layout containers
  vbox: 'vbox', hbox: 'hbox', fixed: 'fixed', frame: 'frame',
  window: 'window', side: 'side',
  // Scrollable / grid containers
  viewport: 'viewport', vpgrid: 'vpgrid', grid: 'grid',
  // Transform & drag
  transform: 'transform', drag: 'drag', draggroup: 'draggroup',
  // Imagemap
  imagemap: 'imagemap',
  // Display
  text: 'text', image: 'image', add: 'image', label: 'label',
  // Interactive
  textbutton: 'textbutton', button: 'button', imagebutton: 'imagebutton',
  bar: 'bar', vbar: 'vbar', input: 'input', 'null': 'null',
  // Utility
  mousearea: 'mousearea', nearrect: 'nearrect', dismiss: 'dismiss',
  // Screen ops
  use: 'use', transclude: 'transclude', key: 'key', timer: 'timer',
};

// Known scalar property keywords → ScreenWidget field names.
// Lines whose leading keyword is in this map are absorbed as typed properties
// on the parent widget; everything else becomes a raw child node.
const SCALAR_PROPS: Record<string, keyof ScreenWidget> = {
  // Positioning
  xpos: 'xpos', ypos: 'ypos', xalign: 'xalign', yalign: 'yalign',
  // Size — width/height are Ren'Py aliases for xsize/ysize
  xsize: 'xsize', ysize: 'ysize', width: 'xsize', height: 'ysize',
  // Appearance
  style: 'style',
  // Style prefix for children
  style_prefix: 'stylePrefix',
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

// Inline style-property keywords that live as child lines inside a widget block.
const STYLE_PROP_KEYS = new Set([
  'background', 'color', 'text_color', 'size', 'bold', 'italic',
  'xpadding', 'ypadding', 'xfill', 'yfill',
  'xmaximum', 'ymaximum', 'xminimum', 'yminimum',
  'text_align', 'text_halign',
]);

/** Parse the raw right-hand side of a style property line into typed fields. */
function parseStyleValue(key: string, rawRhs: string): Partial<ScreenWidgetStyleProps> {
  const stripped = rawRhs.trim().replace(/^["']|["']$/g, '');
  switch (key) {
    case 'background': {
      if (stripped === 'None') return {};
      if (/^#[0-9a-fA-F]{3,8}$/.test(stripped)) return { background: stripped };
      const solidM = rawRhs.trim().match(/^Solid\s*\(\s*["']?(#[0-9a-fA-F]{3,8})["']?\s*\)/i);
      if (solidM) return { background: solidM[1] };
      const assetM = rawRhs.trim().match(/^(?:Frame|Image)\s*\(\s*["']([^"']+)["']/i);
      if (assetM) return { bgImagePath: assetM[1] };
      return {};
    }
    case 'color':
    case 'text_color':
      if (/^#[0-9a-fA-F]{3,8}$/.test(stripped)) return { color: stripped };
      return {};
    case 'size': {
      const n = parseInt(stripped, 10);
      return isNaN(n) ? {} : { fontSize: n };
    }
    case 'bold':   return { bold: stripped === 'True' };
    case 'italic': return { italic: stripped === 'True' };
    case 'xpadding': { const n = parseInt(stripped, 10); return isNaN(n) ? {} : { xpadding: n }; }
    case 'ypadding': { const n = parseInt(stripped, 10); return isNaN(n) ? {} : { ypadding: n }; }
    case 'xfill':  return { xfill: stripped === 'True' };
    case 'yfill':  return { yfill: stripped === 'True' };
    case 'xmaximum': { const n = parseInt(stripped, 10); return isNaN(n) ? {} : { xmaximum: n }; }
    case 'ymaximum': { const n = parseInt(stripped, 10); return isNaN(n) ? {} : { ymaximum: n }; }
    case 'xminimum': { const n = parseInt(stripped, 10); return isNaN(n) ? {} : { xminimum: n }; }
    case 'yminimum': { const n = parseInt(stripped, 10); return isNaN(n) ? {} : { yminimum: n }; }
    case 'text_align':
    case 'text_halign': {
      if (stripped === 'left')   return { textAlign: 0 };
      if (stripped === 'center') return { textAlign: 0.5 };
      if (stripped === 'right')  return { textAlign: 1 };
      const f = parseFloat(stripped);
      return isNaN(f) ? {} : { textAlign: f };
    }
    default: return {};
  }
}

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
}

function setWidgetProp(target: Partial<ScreenWidget>, field: keyof ScreenWidget, raw: string): void {
  const numFields = new Set<keyof ScreenWidget>(['xpos', 'ypos', 'xsize', 'ysize', 'cols', 'rows']);
  const floatFields = new Set<keyof ScreenWidget>(['xalign', 'yalign']);
  if (numFields.has(field)) {
    (target as Record<string, unknown>)[field] = Number(raw);
  } else if (floatFields.has(field)) {
    (target as Record<string, unknown>)[field] = parseFloat(raw);
  } else if (field === 'mousewheel') {
    (target as Record<string, unknown>)[field] = raw === 'True';
  } else {
    (target as Record<string, unknown>)[field] = raw;
  }
}

function parseInlineAttrs(tokens: string[]): Partial<ScreenWidget> {
  const out: Partial<ScreenWidget> = {};
  let i = 0;
  let firstArgConsumed = false;
  while (i < tokens.length) {
    const t = tokens[i];
    if ((t.startsWith('"') || t.startsWith("'")) && !firstArgConsumed) {
      out.text = t.replace(/^["']|["']$/g, '');
      firstArgConsumed = true;
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

function applyKnownProp(widget: ScreenWidget, key: string, rawLine: string): void {
  const tokens = tokeniseLine(rawLine.trim());
  const mapped = SCALAR_PROPS[key];
  if (!mapped || tokens.length < 2) return;
  const val = tokens[1].replace(/^["']|["']$/g, '');
  setWidgetProp(widget, mapped, val);
}

function tokeniseLine(line: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inStr = false;
  let strChar = '';
  for (const ch of line) {
    if (inStr) {
      current += ch;
      if (ch === strChar) { tokens.push(current); current = ''; inStr = false; }
    } else if ((ch === '"' || ch === "'") && current === '') {
      // Only start a quoted-string token at a token boundary (not inside expressions like Jump("x"))
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
 * Capture a complete control-flow compound starting at startLi.
 * Handles if/elif/else chains, showif/elif/else chains, and for loops.
 * Returns the entire compound as a single raw code string.
 */
function captureCompoundControlFlow(
  lines: string[],
  startLi: number,
  lineIndent: number,
): { code: string; nextLi: number } {
  const parts: string[] = [];
  let li = startLi;

  // Opening clause line (the if/for/showif line itself)
  parts.push(lines[li].trim());
  li++;

  // Opening clause body
  while (li < lines.length) {
    const raw = lines[li];
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith('#')) { li++; continue; }
    if (indentOf(raw) <= lineIndent) break;
    const relIndent = ' '.repeat(indentOf(raw) - lineIndent);
    parts.push(relIndent + trimmed);
    li++;
  }

  // Consume elif / else continuations at the same indent
  while (li < lines.length) {
    let peek = li;
    while (peek < lines.length && !lines[peek].trim()) peek++;
    if (peek >= lines.length) break;

    const peekLine = lines[peek];
    const peekIndent = indentOf(peekLine);
    const peekTrimmed = peekLine.trim();
    const peekKw = peekTrimmed.split(/\s+/)[0];

    if (peekIndent === lineIndent && (peekKw === 'elif' || peekTrimmed === 'else:')) {
      li = peek;
      parts.push(peekTrimmed);
      li++;
      // Clause body
      while (li < lines.length) {
        const raw = lines[li];
        const trimmed = raw.trim();
        if (!trimmed || trimmed.startsWith('#')) { li++; continue; }
        if (indentOf(raw) <= lineIndent) break;
        const relIndent = ' '.repeat(indentOf(raw) - lineIndent);
        parts.push(relIndent + trimmed);
        li++;
      }
    } else {
      break;
    }
  }

  return { code: parts.join('\n'), nextLi: li };
}

function parseUseTarget(tokens: string[]): { useScreen: string; useArgs?: string } {
  const full = tokens.join(' ');
  const parenIdx = full.indexOf('(');
  if (parenIdx < 0) return { useScreen: full.trim() };
  const screenName = full.slice(0, parenIdx).trim();
  const closeIdx = full.lastIndexOf(')');
  const args = closeIdx > parenIdx ? full.slice(parenIdx + 1, closeIdx).trim() : '';
  return { useScreen: screenName, useArgs: args || undefined };
}

export function parseScreenCode(code: string): ScreenLayoutComposition {
  const lines = code.split('\n');

  // ── Screen header ─────────────────────────────────────────────────────────
  let screenName = 'unknown_screen';
  let parameters: string | undefined;
  let modal = false;
  let zorder = 0;

  // Match both `screen name(params):` and `screen name:`
  const headerWithParams = lines[0]?.match(/^\s*screen\s+(\w+)\s*\(([^)]*)\)\s*(?:(.*))?:/);
  const headerNoParams = lines[0]?.match(/^\s*screen\s+(\w+)\s*(?:(.*))?:/);

  if (headerWithParams) {
    screenName = headerWithParams[1];
    const rawParams = headerWithParams[2]?.trim();
    if (rawParams) parameters = rawParams;
    const rest = headerWithParams[3] ?? '';
    if (/modal\s+True/i.test(rest)) modal = true;
    const zo = rest.match(/zorder\s+(\d+)/);
    if (zo) zorder = parseInt(zo[1], 10);
  } else if (headerNoParams) {
    screenName = headerNoParams[1];
    const rest = headerNoParams[2] ?? '';
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

    // ── Stack pop ─────────────────────────────────────────────────────────
    while (stack.length > 0 && lineIndent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    // ── pass ──────────────────────────────────────────────────────────────
    if (trimmed === 'pass') { li++; continue; }

    // ── transclude ────────────────────────────────────────────────────────
    if (trimmed === 'transclude') {
      activeChildren().push({ id: uid(), type: 'transclude' });
      li++;
      continue;
    }

    // ── $ python single-line → raw ────────────────────────────────────────
    if (trimmed.startsWith('$ ')) {
      activeChildren().push({ id: uid(), type: 'raw', code: trimmed });
      li++;
      continue;
    }

    // ── python: block → raw ───────────────────────────────────────────────
    if (trimmed === 'python:') {
      const { code: body, nextLi } = captureBlock(lines, li + 1, lineIndent);
      const indented = body
        ? body.split('\n').map(l => '    ' + l).join('\n')
        : '';
      activeChildren().push({
        id: uid(), type: 'raw',
        code: indented ? `python:\n${indented}` : 'python:',
      });
      li = nextLi;
      continue;
    }

    // ── Tokenise ──────────────────────────────────────────────────────────
    const isBlock = trimmed.endsWith(':');
    const withoutColon = isBlock ? trimmed.slice(0, -1).trim() : trimmed;
    const tokens = tokeniseLine(withoutColon);
    if (tokens.length === 0) { li++; continue; }
    const kw = tokens[0].toLowerCase();

    // ── Control flow → compound raw capture ──────────────────────────────
    if (kw === 'if' || kw === 'showif' || kw === 'for') {
      const { code: compoundCode, nextLi } = captureCompoundControlFlow(lines, li, lineIndent);
      activeChildren().push({ id: uid(), type: 'raw', code: compoundCode });
      li = nextLi;
      continue;
    }

    // ── orphaned elif / else → raw (malformed code) ───────────────────────
    if (kw === 'elif' || trimmed === 'else:') {
      if (isBlock) {
        const { code: bodyCode, nextLi } = captureBlock(lines, li + 1, lineIndent);
        const capturedCode = bodyCode
          ? trimmed + '\n' + bodyCode.split('\n').map(l => '    ' + l).join('\n')
          : trimmed;
        activeChildren().push({ id: uid(), type: 'raw', code: capturedCode });
        li = nextLi;
      } else {
        activeChildren().push({ id: uid(), type: 'raw', code: trimmed });
        li++;
      }
      continue;
    }

    // ── on "event" action ... ─────────────────────────────────────────────
    if (kw === 'on') {
      const eventToken = tokens[1] ?? '';
      const onEvent = eventToken.replace(/^["']|["']$/g, '');
      const attrs = parseInlineAttrs(tokens.slice(2));
      const w: ScreenWidget = { id: uid(), type: 'on', onEvent, action: attrs.action };
      activeChildren().push(w);
      li++;
      continue;
    }

    // ── default varname = value ───────────────────────────────────────────
    if (kw === 'default') {
      const rest = withoutColon.slice(tokens[0].length).trim();
      const eqIdx = rest.indexOf('=');
      const defaultVariable = eqIdx >= 0 ? rest.slice(0, eqIdx).trim() : rest.trim();
      const defaultValue = eqIdx >= 0 ? rest.slice(eqIdx + 1).trim() : '';
      const w: ScreenWidget = { id: uid(), type: 'default', defaultVariable, defaultValue };
      activeChildren().push(w);
      li++;
      continue;
    }

    // ── hotspot / hotbar (x, y, w, h) ────────────────────────────────────
    if (kw === 'hotspot' || kw === 'hotbar') {
      const areaMatch = withoutColon.match(/\([^)]+\)/);
      const hotspotArea = areaMatch ? areaMatch[0] : undefined;
      const afterArea = hotspotArea
        ? withoutColon.slice(withoutColon.indexOf(hotspotArea) + hotspotArea.length).trim()
        : withoutColon.slice(tokens[0].length).trim();
      const attrs = parseInlineAttrs(tokeniseLine(afterArea));
      const wType: ScreenWidgetType = kw === 'hotspot' ? 'hotspot' : 'hotbar';
      const w: ScreenWidget = { id: uid(), type: wType, hotspotArea, ...attrs };
      if (kw === 'hotbar' && attrs.text !== undefined) {
        w.barValue = attrs.text;
        delete w.text;
      }
      activeChildren().push(w);
      if (isBlock) stack.push({ widget: w, indent: lineIndent });
      li++;
      continue;
    }

    // ── use ───────────────────────────────────────────────────────────────
    if (kw === 'use') {
      const { useScreen, useArgs } = parseUseTarget(tokens.slice(1));
      const w: ScreenWidget = { id: uid(), type: 'use', useScreen, useArgs, children: [] };
      activeChildren().push(w);
      if (isBlock) stack.push({ widget: w, indent: lineIndent });
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
      if (isBlock) stack.push({ widget: w, indent: lineIndent });
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
      if (isBlock) stack.push({ widget: w, indent: lineIndent });
      li++;
      continue;
    }

    // ── known widget keyword ──────────────────────────────────────────────
    const widgetType = WIDGET_KW_MAP[kw];
    if (widgetType) {
      const w: ScreenWidget = { id: uid(), type: widgetType };
      if (CONTAINER_KEYWORDS.has(kw)) w.children = [];

      // grid: positional cols rows args
      if (kw === 'grid') {
        if (tokens[1] !== undefined) w.cols = Number(tokens[1]);
        if (tokens[2] !== undefined) w.rows = Number(tokens[2]);
      } else if (tokens.length > 1) {
        const attrs = parseInlineAttrs(tokens.slice(1));
        if ((kw === 'add' || kw === 'image' || kw === 'imagebutton') && attrs.text !== undefined) {
          attrs.imagePath = attrs.text;
          delete attrs.text;
        }
        if (kw === 'side' && attrs.text !== undefined) {
          attrs.sidePositions = attrs.text;
          delete attrs.text;
        }
        if (kw === 'drag' && attrs.text !== undefined) {
          attrs.dragName = attrs.text;
          delete attrs.text;
        }
        Object.assign(w, attrs);
      }

      activeChildren().push(w);
      if (isBlock) stack.push({ widget: w, indent: lineIndent });
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

    // ── align (x, y) shorthand → xalign + yalign ─────────────────────────
    if (kw === 'align' && stack.length > 0) {
      const top = stack[stack.length - 1];
      if (lineIndent > top.indent) {
        const m = trimmed.match(/align\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/);
        if (m) {
          top.widget.xalign = parseFloat(m[1]);
          top.widget.yalign = parseFloat(m[2]);
        }
        li++;
        continue;
      }
    }

    // ── inline style properties (background, color, size, bold …) ─────────
    if (STYLE_PROP_KEYS.has(kw) && stack.length > 0) {
      const top = stack[stack.length - 1];
      if (lineIndent > top.indent) {
        const rhs = tokens.slice(1).join(' ');
        const parsed = parseStyleValue(kw, rhs);
        if (Object.keys(parsed).length > 0) {
          top.widget.styleProps = { ...top.widget.styleProps, ...parsed };
        }
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

// ─── Project-wide style extraction ───────────────────────────────────────────

/**
 * Parse `define name = value` statements from .rpy block contents.
 * Handles string and numeric literals. Does a second pass to resolve
 * single-level cross-references (e.g. `define gui.button_text_size = gui.interface_text_size`).
 */
export function parseDefineVariables(blockContents: string[]): Map<string, string> {
  const vars = new Map<string, string>();
  // First pass: literal values
  for (const content of blockContents) {
    for (const line of content.split('\n')) {
      const m = line.match(/^\s*define\s+([\w.]+)\s*=\s*(?:["']([^"']+)["']|([\d.]+))\s*(?:#.*)?$/);
      if (!m) continue;
      const val = m[2] ?? m[3];
      if (m[1] && val !== undefined) vars.set(m[1], val);
    }
  }
  // Second pass: resolve simple variable references (up to 3 rounds)
  for (let pass = 0; pass < 3; pass++) {
    for (const content of blockContents) {
      for (const line of content.split('\n')) {
        const m = line.match(/^\s*define\s+([\w.]+)\s*=\s*([\w.]+)\s*(?:#.*)?$/);
        if (!m) continue;
        if (!vars.has(m[1]) && vars.has(m[2])) vars.set(m[1], vars.get(m[2])!);
      }
    }
  }
  return vars;
}

/**
 * Resolve a raw token against the variable map.
 * Returns the literal value if the token is a known variable, else the token itself.
 */
function resolveVarToken(token: string, varMap: Map<string, string>): string {
  return varMap.get(token) ?? token;
}

/**
 * Parse a style property value using the variable map for substitution.
 * Wraps parseStyleValue but first resolves variable references in the rhs.
 */
function parseStyleValueWithVars(key: string, rhs: string, varMap: Map<string, string>): Partial<ScreenWidgetStyleProps> {
  // For simple single-token rhs values (variable refs), substitute first
  const rhsTrimmed = rhs.trim();
  // If the rhs doesn't start with a quote, # or function call — it may be a var
  if (!/^["'#]/.test(rhsTrimmed) && !/\(/.test(rhsTrimmed)) {
    const resolved = resolveVarToken(rhsTrimmed, varMap);
    if (resolved !== rhsTrimmed) return parseStyleValue(key, resolved);
  }
  return parseStyleValue(key, rhs);
}

/**
 * Parse all `style name:` blocks from .rpy block contents into a style map.
 * Handles `style name is parent:` inheritance. Uses varMap for variable substitution.
 */
export function parseProjectStyles(
  blockContents: string[],
  varMap: Map<string, string>,
): Map<string, ScreenWidgetStyleProps> {
  // Raw defs: name → { props, parent }
  const rawDefs = new Map<string, { props: ScreenWidgetStyleProps; parent?: string }>();

  function ensureDef(name: string, parent?: string) {
    if (!rawDefs.has(name)) rawDefs.set(name, { props: {} });
    const def = rawDefs.get(name)!;
    if (parent && !def.parent) def.parent = parent;
    return def;
  }

  for (const content of blockContents) {
    const lines = content.split('\n');
    let li = 0;
    while (li < lines.length) {
      const raw = lines[li];
      const trimmed = raw.trim();
      if (!trimmed || trimmed.startsWith('#')) { li++; continue; }

      // Match style declaration: `style name` or `style name is parent` with optional `:`
      const m = trimmed.match(/^style\s+(\w+)(?:\s+is\s+(\w+))?\s*(?:\S.*)?:?\s*(?:#.*)?$/);
      if (!m || !m[1]) { li++; continue; }

      const name = m[1];
      const parent = m[2];
      const hasBody = trimmed.endsWith(':');
      const blockIndent = indentOf(raw);

      ensureDef(name, parent);
      const def = rawDefs.get(name)!;
      li++;

      if (!hasBody) continue;

      // Parse body lines
      while (li < lines.length) {
        const propRaw = lines[li];
        const propTrimmed = propRaw.trim();
        if (!propTrimmed || propTrimmed.startsWith('#')) { li++; continue; }
        if (indentOf(propRaw) <= blockIndent) break;

        const tokens = tokeniseLine(propTrimmed);
        if (tokens.length < 1) { li++; continue; }
        const kw = tokens[0].toLowerCase();

        if (STYLE_PROP_KEYS.has(kw) && tokens.length >= 2) {
          const rhs = tokens.slice(1).join(' ');
          const parsed = parseStyleValueWithVars(kw, rhs, varMap);
          Object.assign(def.props, parsed);
        }
        li++;
      }
    }
  }

  // Resolve inheritance (topological — up to 8 rounds to handle deep chains)
  const resolved = new Map<string, ScreenWidgetStyleProps>();

  function resolve(name: string, visited = new Set<string>()): ScreenWidgetStyleProps {
    if (resolved.has(name)) return resolved.get(name)!;
    if (visited.has(name)) return {};
    visited.add(name);
    const def = rawDefs.get(name);
    if (!def) return {};
    const parentProps = def.parent ? resolve(def.parent, new Set(visited)) : {};
    const merged = { ...parentProps, ...def.props };
    resolved.set(name, merged);
    return merged;
  }

  for (const name of rawDefs.keys()) resolve(name);
  return resolved;
}
