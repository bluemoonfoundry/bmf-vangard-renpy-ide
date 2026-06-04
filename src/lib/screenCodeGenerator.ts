import type { ScreenLayoutComposition, ScreenWidget } from '@/types';

function isExpression(s: string): boolean {
  return /[.()\[\]]/.test(s) && !s.includes('/') && !s.includes('\\');
}

function emitTextArg(text: string | undefined): string {
  if (!text) return '""';
  return isExpression(text) ? text : `"${text}"`;
}

function emitPathArg(path: string | undefined): string {
  if (!path) return '""';
  return isExpression(path) ? path : `"${path}"`;
}

function generateWidget(widget: ScreenWidget, depth: number, insideContainer: boolean, indent: string): string {
  const pad = indent.repeat(depth);
  const cpad = indent.repeat(depth + 1);
  const lines: string[] = [];

  // Positioning attrs (only on top-level / not inside a flow container).
  const posAttrs: string[] = [];
  if (!insideContainer) {
    if (widget.xpos !== undefined) posAttrs.push(`xpos ${widget.xpos}`);
    if (widget.ypos !== undefined) posAttrs.push(`ypos ${widget.ypos}`);
    if (widget.xalign !== undefined) posAttrs.push(`xalign ${widget.xalign}`);
    if (widget.yalign !== undefined) posAttrs.push(`yalign ${widget.yalign}`);
  }
  if (widget.xsize !== undefined) posAttrs.push(`xsize ${widget.xsize}`);
  if (widget.ysize !== undefined) posAttrs.push(`ysize ${widget.ysize}`);

  // Common child-property lines (style, extraProps).
  function childProps(): string[] {
    const out: string[] = [];
    if (widget.style) out.push(`${cpad}style "${widget.style}"`);
    if (widget.extraProps?.length) {
      for (const ep of widget.extraProps) out.push(`${cpad}${ep}`);
    }
    return out;
  }

  // Generic container body: emit props + children, then pass if empty.
  function containerBody(
    extraLines: string[] = [],
    childInsideContainer = true,
  ): boolean {
    let hadContent = false;
    const cp = childProps();
    if (cp.length) { lines.push(...cp); hadContent = true; }
    for (const el of extraLines) { lines.push(el); hadContent = true; }
    for (const child of widget.children ?? []) {
      lines.push(generateWidget(child, depth + 1, childInsideContainer, indent));
      hadContent = true;
    }
    if (!hadContent) lines.push(`${cpad}pass`);
    return hadContent;
  }

  switch (widget.type) {

    // ── simple leaf nodes ─────────────────────────────────────────────────

    case 'null':
      lines.push(`${pad}null`);
      break;

    case 'transclude':
      lines.push(`${pad}transclude`);
      break;

    case 'text':
      lines.push(`${pad}text ${emitTextArg(widget.text)}${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}`);
      break;

    case 'label':
      lines.push(`${pad}label ${emitTextArg(widget.text)}${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}`);
      break;

    case 'image':
      lines.push(`${pad}add ${emitPathArg(widget.imagePath)}${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}`);
      break;

    case 'imagebutton': {
      const ibAttrs = [
        widget.auto ? `auto ${emitPathArg(widget.auto)}` : '',
        !widget.auto && widget.imagePath ? `idle ${emitPathArg(widget.imagePath)}` : '',
        widget.action ? `action ${widget.action}` : '',
        widget.hovered ? `hovered ${widget.hovered}` : '',
        widget.unhovered ? `unhovered ${widget.unhovered}` : '',
        ...posAttrs,
      ].filter(Boolean).join(' ');
      lines.push(`${pad}imagebutton${ibAttrs ? ' ' + ibAttrs : ''}`);
      break;
    }

    case 'bar':
    case 'vbar': {
      const barV = widget.barValue ?? 'AnimatedValue(0, 100)';
      lines.push(`${pad}${widget.type} value ${barV}${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}`);
      break;
    }

    case 'input':
      lines.push(`${pad}input default ""${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}`);
      break;

    case 'mousearea': {
      lines.push(`${pad}mousearea:`);
      let had = false;
      if (widget.hovered) { lines.push(`${cpad}hovered ${widget.hovered}`); had = true; }
      if (widget.unhovered) { lines.push(`${cpad}unhovered ${widget.unhovered}`); had = true; }
      const cp = childProps();
      if (cp.length) { lines.push(...cp); had = true; }
      if (!had) lines.push(`${cpad}pass`);
      break;
    }

    case 'dismiss': {
      const da = widget.action ? ` action ${widget.action}` : '';
      lines.push(`${pad}dismiss${da}`);
      break;
    }

    case 'on': {
      const ev = widget.onEvent ? ` ${emitTextArg(widget.onEvent)}` : '';
      const oa = widget.action ? ` action ${widget.action}` : '';
      lines.push(`${pad}on${ev}${oa}`);
      break;
    }

    case 'default': {
      const dv = widget.defaultVariable ?? 'var';
      const val = widget.defaultValue ?? '0';
      lines.push(`${pad}default ${dv} = ${val}`);
      break;
    }

    case 'hotspot': {
      const area = widget.hotspotArea ? ` ${widget.hotspotArea}` : '';
      const ha = widget.action ? ` action ${widget.action}` : '';
      lines.push(`${pad}hotspot${area}${ha}`);
      break;
    }

    case 'hotbar': {
      const area = widget.hotspotArea ? ` ${widget.hotspotArea}` : '';
      const hbv = widget.barValue ?? 'AnimatedValue(0, 100)';
      lines.push(`${pad}hotbar${area} value ${hbv}`);
      break;
    }

    case 'key': {
      const binding = widget.keyBinding ? ` ${emitTextArg(widget.keyBinding)}` : '';
      const ka = widget.action ? ` action ${widget.action}` : '';
      lines.push(`${pad}key${binding}${ka}`);
      break;
    }

    case 'timer': {
      const delay = widget.timerDelay ?? '0';
      const ta = widget.action ? ` action ${widget.action}` : '';
      lines.push(`${pad}timer ${delay}${ta}`);
      break;
    }

    // ── textbutton: inline or block if style/extraProps present ───────────

    case 'textbutton': {
      const tbHasBlock = !!(widget.style || widget.extraProps?.length);
      const tbAttrs = [
        emitTextArg(widget.text),
        widget.action ? `action ${widget.action}` : '',
        ...posAttrs,
      ].filter(Boolean).join(' ');
      if (tbHasBlock) {
        lines.push(`${pad}textbutton ${tbAttrs}:`);
        lines.push(...childProps());
      } else {
        lines.push(`${pad}textbutton ${tbAttrs}`);
      }
      break;
    }

    // ── button: always block; action/events as child lines ────────────────

    case 'button': {
      const btnPosAttrs = posAttrs.join(' ');
      lines.push(`${pad}button${btnPosAttrs ? ' ' + btnPosAttrs : ''}:`);
      let hadContent = false;
      // action/events emitted as child property lines (preserves round-trip fidelity)
      if (widget.action) { lines.push(`${cpad}action ${widget.action}`); hadContent = true; }
      if (widget.hovered) { lines.push(`${cpad}hovered ${widget.hovered}`); hadContent = true; }
      if (widget.unhovered) { lines.push(`${cpad}unhovered ${widget.unhovered}`); hadContent = true; }
      const cp = childProps();
      if (cp.length) { lines.push(...cp); hadContent = true; }
      for (const child of widget.children ?? []) {
        lines.push(generateWidget(child, depth + 1, true, indent));
        hadContent = true;
      }
      if (!hadContent) lines.push(`${cpad}pass`);
      break;
    }

    // ── standard layout containers ────────────────────────────────────────

    case 'vbox':
    case 'hbox':
    case 'fixed':
    case 'frame':
    case 'window': {
      lines.push(`${pad}${widget.type}${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}:`);
      const extras: string[] = [];
      if (widget.spacing !== undefined) extras.push(`${cpad}spacing ${widget.spacing}`);
      containerBody(extras);
      break;
    }

    case 'side': {
      const posStr = widget.sidePositions ? ` "${widget.sidePositions}"` : '';
      lines.push(`${pad}side${posStr}${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}:`);
      containerBody();
      break;
    }

    case 'grid': {
      const cols = widget.cols ?? 1;
      const rows = widget.rows ?? 1;
      lines.push(`${pad}grid ${cols} ${rows}${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}:`);
      const extras: string[] = [];
      if (widget.spacing !== undefined) extras.push(`${cpad}spacing ${widget.spacing}`);
      containerBody(extras);
      break;
    }

    case 'viewport': {
      lines.push(`${pad}viewport${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}:`);
      const extras: string[] = [];
      if (widget.scrollbars) extras.push(`${cpad}scrollbars "${widget.scrollbars}"`);
      if (widget.mousewheel) extras.push(`${cpad}mousewheel True`);
      containerBody(extras);
      break;
    }

    case 'vpgrid': {
      lines.push(`${pad}vpgrid${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}:`);
      const extras: string[] = [];
      if (widget.cols !== undefined) extras.push(`${cpad}cols ${widget.cols}`);
      if (widget.rows !== undefined) extras.push(`${cpad}rows ${widget.rows}`);
      if (widget.scrollbars) extras.push(`${cpad}scrollbars "${widget.scrollbars}"`);
      if (widget.mousewheel) extras.push(`${cpad}mousewheel True`);
      if (widget.spacing !== undefined) extras.push(`${cpad}spacing ${widget.spacing}`);
      containerBody(extras);
      break;
    }

    case 'transform': {
      lines.push(`${pad}transform${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}:`);
      containerBody();
      break;
    }

    case 'drag': {
      const dn = widget.dragName ? ` drag_name ${emitTextArg(widget.dragName)}` : '';
      lines.push(`${pad}drag${dn}${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}:`);
      containerBody();
      break;
    }

    case 'draggroup': {
      lines.push(`${pad}draggroup${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}:`);
      containerBody();
      break;
    }

    case 'imagemap': {
      lines.push(`${pad}imagemap${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}:`);
      containerBody();
      break;
    }

    case 'nearrect': {
      lines.push(`${pad}nearrect${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}:`);
      const extras: string[] = [];
      if (widget.nearrectFocus) extras.push(`${cpad}focus ${emitTextArg(widget.nearrectFocus)}`);
      if (widget.nearrectSide) extras.push(`${cpad}preferred_side "${widget.nearrectSide}"`);
      containerBody(extras);
      break;
    }

    // ── use ───────────────────────────────────────────────────────────────

    case 'use': {
      const screenRef = widget.useScreen ?? 'unknown_screen';
      const argsStr = widget.useArgs ? `(${widget.useArgs})` : '';
      const hasBlock = widget.children && widget.children.length > 0;
      if (hasBlock) {
        lines.push(`${pad}use ${screenRef}${argsStr}:`);
        for (const child of widget.children!) {
          lines.push(generateWidget(child, depth + 1, insideContainer, indent));
        }
      } else {
        lines.push(`${pad}use ${screenRef}${argsStr}`);
      }
      break;
    }

    // ── raw: verbatim emit ────────────────────────────────────────────────

    case 'raw': {
      const rawCode = widget.code ?? '';
      const rawLines = rawCode.split('\n');
      if (rawLines.length === 1) {
        lines.push(`${pad}${rawLines[0]}`);
      } else {
        // First line at pad depth, body lines preserve their relative indentation.
        lines.push(`${pad}${rawLines[0]}`);
        for (let i = 1; i < rawLines.length; i++) {
          lines.push(`${pad}${rawLines[i]}`);
        }
      }
      break;
    }
  }

  return lines.join('\n');
}

export function generateScreenCode(comp: ScreenLayoutComposition, indent = '    '): string {
  const lines: string[] = [];

  const screenAttrs: string[] = [];
  if (comp.modal) screenAttrs.push('modal True');
  if (comp.zorder !== 0) screenAttrs.push(`zorder ${comp.zorder}`);

  const params = comp.parameters ?? '';
  const paramStr = params ? `(${params})` : '()';
  lines.push(`screen ${comp.screenName}${paramStr}${screenAttrs.length ? ' ' + screenAttrs.join(' ') : ''}:`);

  if (comp.widgets.length === 0) {
    lines.push(`${indent}pass`);
  } else {
    for (const widget of comp.widgets) {
      lines.push(generateWidget(widget, 1, false, indent));
    }
  }

  return lines.join('\n');
}
