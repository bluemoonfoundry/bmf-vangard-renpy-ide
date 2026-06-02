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
            lines.push(...emitChildProps(depth + 1));
            if (widget.children && widget.children.length > 0) {
                for (const child of widget.children) {
                    lines.push(generateWidget(child, depth + 1, true, indent));
                }
            } else {
                lines.push(`${pad}${indent}pass`);
            }
            break;
        }

        case 'imagebutton': {
            const ibAttrs = [
                widget.imagePath ? `idle ${emitPathArg(widget.imagePath)}` : '',
                widget.action ? `action ${widget.action}` : '',
                ...posAttrs,
            ].filter(Boolean).join(' ');
            lines.push(`${pad}imagebutton${ibAttrs ? ' ' + ibAttrs : ''}`);
            break;
        }

        case 'bar':
            lines.push(`${pad}bar value AnimatedValue(0, 100)${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}`);
            break;

        case 'input':
            lines.push(`${pad}input default ""${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}`);
            break;

        case 'vbox':
        case 'hbox':
        case 'frame':
        case 'window': {
            const containerAttrs = posAttrs.join(' ');
            lines.push(`${pad}${widget.type}${containerAttrs ? ' ' + containerAttrs : ''}:`);
            lines.push(...emitChildProps(depth + 1));
            if (widget.children && widget.children.length > 0) {
                for (const child of widget.children) {
                    lines.push(generateWidget(child, depth + 1, true, indent));
                }
            } else {
                lines.push(`${pad}${indent}pass`);
            }
            break;
        }

        case 'viewport': {
            const containerAttrs = posAttrs.join(' ');
            lines.push(`${pad}viewport${containerAttrs ? ' ' + containerAttrs : ''}:`);
            if (widget.scrollbars) lines.push(`${pad}${indent}scrollbars "${widget.scrollbars}"`);
            if (widget.mousewheel)  lines.push(`${pad}${indent}mousewheel True`);
            lines.push(...emitChildProps(depth + 1));
            if (widget.children && widget.children.length > 0) {
                for (const child of widget.children) {
                    lines.push(generateWidget(child, depth + 1, true, indent));
                }
            } else {
                lines.push(`${pad}${indent}pass`);
            }
            break;
        }

        case 'if': {
            lines.push(`${pad}if ${widget.condition ?? 'True'}:`);
            lines.push(...emitChildProps(depth + 1));
            if (widget.children && widget.children.length > 0) {
                for (const child of widget.children) {
                    lines.push(generateWidget(child, depth + 1, insideContainer, indent));
                }
            } else {
                lines.push(`${pad}${indent}pass`);
            }
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
            if (widget.children && widget.children.length > 0) {
                for (const child of widget.children) {
                    lines.push(generateWidget(child, depth + 1, insideContainer, indent));
                }
            } else {
                lines.push(`${pad}${indent}pass`);
            }
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
