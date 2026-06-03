import type { ScreenLayoutComposition, ScreenWidget } from '@/types';

/**
 * Returns true if the string looks like a Ren'Py expression rather than a
 * plain quoted path (e.g. gui.main_menu_background, _("Return"), some_var).
 * These should be emitted without surrounding quotes.
 */
function isExpression(s: string): boolean {
  // Expressions contain dots, parens, or brackets — typical file paths contain slashes.
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
    const lines: string[] = [];

    // Positioning attrs (inline on declaration line, NOT style which goes as child property).
    const posAttrs: string[] = [];
    if (!insideContainer) {
        if (widget.xpos !== undefined) posAttrs.push(`xpos ${widget.xpos}`);
        if (widget.ypos !== undefined) posAttrs.push(`ypos ${widget.ypos}`);
        if (widget.xalign !== undefined) posAttrs.push(`xalign ${widget.xalign}`);
        if (widget.yalign !== undefined) posAttrs.push(`yalign ${widget.yalign}`);
    }
    if (widget.xsize !== undefined) posAttrs.push(`xsize ${widget.xsize}`);
    if (widget.ysize !== undefined) posAttrs.push(`ysize ${widget.ysize}`);
    // style is NOT in posAttrs — it's emitted as a child property line for containers.

    // Emit style + extraProps as child property lines.
    function emitChildProps(atDepth: number): string[] {
        const p = indent.repeat(atDepth);
        const out: string[] = [];
        if (widget.style) out.push(`${p}style "${widget.style}"`);
        if (widget.extraProps?.length) {
            for (const ep of widget.extraProps) out.push(`${p}${ep}`);
        }
        return out;
    }

    // For raw multi-line code, indent each body line relative to the opening line.
    function emitRawBlock(code: string, openLine: string): string {
        const rawLines = code.split('\n');
        const first = rawLines[0];
        // If the first line IS the opening line (single-line raw), just emit it.
        if (rawLines.length === 1) return `${pad}${first}`;
        // Multi-line: opening line + body indented by one extra level.
        const out = [`${pad}${first}`];
        for (let i = 1; i < rawLines.length; i++) {
            out.push(`${pad}${rawLines[i]}`);
        }
        return out.join('\n');
    }

    switch (widget.type) {
        case 'null':
            lines.push(`${pad}null`);
            break;

        case 'text':
            lines.push(`${pad}text ${emitTextArg(widget.text)}${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}`);
            break;

        case 'image':
            lines.push(`${pad}add ${emitPathArg(widget.imagePath)}${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}`);
            break;

        case 'textbutton': {
            // If the textbutton has style/extraProps it needs a block.
            const tbHasBlock = !!(widget.style || widget.extraProps?.length);
            const tbAttrs = [
                emitTextArg(widget.text),
                widget.action ? `action ${widget.action}` : '',
                ...posAttrs,
            ].filter(Boolean).join(' ');
            if (tbHasBlock) {
                lines.push(`${pad}textbutton ${tbAttrs}:`);
                lines.push(...emitChildProps(depth + 1));
            } else {
                lines.push(`${pad}textbutton ${tbAttrs}`);
            }
            break;
        }

        case 'button': {
            const btnAttrs = [
                widget.action ? `action ${widget.action}` : '',
                ...posAttrs,
            ].filter(Boolean).join(' ');
            lines.push(`${pad}button${btnAttrs ? ' ' + btnAttrs : ''}:`);
            const btnStart = lines.length;
            lines.push(...emitChildProps(depth + 1));
            for (const child of widget.children ?? []) lines.push(generateWidget(child, depth + 1, true, indent));
            if (lines.length === btnStart) lines.push(`${pad}${indent}pass`);
            break;
        }

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

        case 'vbox':
        case 'hbox':
        case 'fixed':
        case 'frame':
        case 'window': {
            const containerAttrs = posAttrs.join(' ');
            lines.push(`${pad}${widget.type}${containerAttrs ? ' ' + containerAttrs : ''}:`);
            const vbStart = lines.length;
            lines.push(...emitChildProps(depth + 1));
            if (widget.spacing !== undefined) lines.push(`${pad}${indent}spacing ${widget.spacing}`);
            for (const child of widget.children ?? []) lines.push(generateWidget(child, depth + 1, true, indent));
            if (lines.length === vbStart) lines.push(`${pad}${indent}pass`);
            break;
        }

        case 'side': {
            const posStr = widget.sidePositions ? ` "${widget.sidePositions}"` : '';
            const sideAttrs = posAttrs.join(' ');
            lines.push(`${pad}side${posStr}${sideAttrs ? ' ' + sideAttrs : ''}:`);
            const sideStart = lines.length;
            lines.push(...emitChildProps(depth + 1));
            for (const child of widget.children ?? []) lines.push(generateWidget(child, depth + 1, true, indent));
            if (lines.length === sideStart) lines.push(`${pad}${indent}pass`);
            break;
        }

        case 'vpgrid': {
            const vpgAttrs = posAttrs.join(' ');
            lines.push(`${pad}vpgrid${vpgAttrs ? ' ' + vpgAttrs : ''}:`);
            const vpgStart = lines.length;
            if (widget.cols !== undefined) lines.push(`${pad}${indent}cols ${widget.cols}`);
            if (widget.rows !== undefined) lines.push(`${pad}${indent}rows ${widget.rows}`);
            if (widget.scrollbars) lines.push(`${pad}${indent}scrollbars "${widget.scrollbars}"`);
            if (widget.mousewheel) lines.push(`${pad}${indent}mousewheel True`);
            if (widget.spacing !== undefined) lines.push(`${pad}${indent}spacing ${widget.spacing}`);
            lines.push(...emitChildProps(depth + 1));
            for (const child of widget.children ?? []) lines.push(generateWidget(child, depth + 1, true, indent));
            if (lines.length === vpgStart) lines.push(`${pad}${indent}pass`);
            break;
        }

        case 'viewport': {
            const vpAttrs = posAttrs.join(' ');
            lines.push(`${pad}viewport${vpAttrs ? ' ' + vpAttrs : ''}:`);
            const vpStart = lines.length;
            if (widget.scrollbars) lines.push(`${pad}${indent}scrollbars "${widget.scrollbars}"`);
            if (widget.mousewheel)  lines.push(`${pad}${indent}mousewheel True`);
            lines.push(...emitChildProps(depth + 1));
            for (const child of widget.children ?? []) lines.push(generateWidget(child, depth + 1, true, indent));
            if (lines.length === vpStart) lines.push(`${pad}${indent}pass`);
            break;
        }

        case 'showif': {
            lines.push(`${pad}showif ${widget.condition ?? 'True'}:`);
            const sfStart = lines.length;
            lines.push(...emitChildProps(depth + 1));
            for (const child of widget.children ?? []) lines.push(generateWidget(child, depth + 1, insideContainer, indent));
            if (lines.length === sfStart) lines.push(`${pad}${indent}pass`);
            break;
        }

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

        case 'key': {
            const binding = widget.keyBinding ? ` ${emitTextArg(widget.keyBinding)}` : '';
            const keyAction = widget.action ? ` action ${widget.action}` : '';
            lines.push(`${pad}key${binding}${keyAction}`);
            break;
        }

        case 'timer': {
            const delay = widget.timerDelay ?? '0';
            const timerAction = widget.action ? ` action ${widget.action}` : '';
            lines.push(`${pad}timer ${delay}${timerAction}`);
            break;
        }

        case 'transclude':
            lines.push(`${pad}transclude`);
            break;

        case 'if': {
            lines.push(`${pad}if ${widget.condition ?? 'True'}:`);
            const ifStart = lines.length;
            lines.push(...emitChildProps(depth + 1));
            for (const child of widget.children ?? []) lines.push(generateWidget(child, depth + 1, insideContainer, indent));
            if (lines.length === ifStart) lines.push(`${pad}${indent}pass`);
            if (widget.elseChildren && widget.elseChildren.length > 0) {
                lines.push(`${pad}else:`);
                for (const child of widget.elseChildren) {
                    lines.push(generateWidget(child, depth + 1, insideContainer, indent));
                }
            }
            break;
        }

        case 'for': {
            lines.push(`${pad}for ${widget.forVariable ?? '_item'} in ${widget.forIterable ?? '[]'}:`);
            const forStart = lines.length;
            for (const child of widget.children ?? []) lines.push(generateWidget(child, depth + 1, insideContainer, indent));
            if (lines.length === forStart) lines.push(`${pad}${indent}pass`);
            break;
        }

        case 'python': {
            const code = widget.code ?? '';
            if (code.includes('\n')) {
                lines.push(`${pad}python:`);
                for (const cl of code.split('\n')) {
                    lines.push(`${pad}${indent}${cl}`);
                }
            } else {
                lines.push(`${pad}$ ${code}`);
            }
            break;
        }

        case 'raw': {
            const code = widget.code ?? '';
            lines.push(emitRawBlock(code, code.split('\n')[0]));
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
    lines.push(`screen ${comp.screenName}(${params})${screenAttrs.length ? ' ' + screenAttrs.join(' ') : ''}:`);

    if (comp.widgets.length === 0) {
        lines.push(`${indent}pass`);
    } else {
        for (const widget of comp.widgets) {
            lines.push(generateWidget(widget, 1, false, indent));
        }
    }

    return lines.join('\n');
}
