import type { ScreenLayoutComposition, ScreenWidget } from '@/types';

/**
 * Recursively generates Ren'Py screen language code for a widget and its children.
 *
 * Handles all widget types supported by the Screen Layout Composer:
 * - Simple widgets: text, image, textbutton, imagebutton, bar, input, null
 * - Container widgets: vbox, hbox, frame, button (each recursively renders children)
 *
 * Positioning attributes (xpos/ypos/xalign/yalign) are only rendered for top-level widgets;
 * widgets inside containers inherit layout from their parent container. Style attributes
 * and action callbacks are rendered inline on the widget declaration line.
 *
 * @param widget - The widget to render
 * @param depth - Current indentation depth (number of indent strings)
 * @param insideContainer - Whether this widget is inside a container (suppresses positioning)
 * @param indent - Indentation string (typically 4 spaces)
 * @returns Multi-line Ren'Py screen language code
 *
 * @complexity O(w) time where w = total widget count (recursive tree traversal), O(d) space where d = tree depth
 */
function generateWidget(widget: ScreenWidget, depth: number, insideContainer: boolean, indent: string): string {
    const pad = indent.repeat(depth);
    const lines: string[] = [];

    const posAttrs: string[] = [];
    if (!insideContainer) {
        if (widget.xpos !== undefined) posAttrs.push(`xpos ${widget.xpos}`);
        if (widget.ypos !== undefined) posAttrs.push(`ypos ${widget.ypos}`);
        if (widget.xalign !== undefined) posAttrs.push(`xalign ${widget.xalign}`);
        if (widget.yalign !== undefined) posAttrs.push(`yalign ${widget.yalign}`);
    }
    if (widget.xsize !== undefined) posAttrs.push(`xsize ${widget.xsize}`);
    if (widget.ysize !== undefined) posAttrs.push(`ysize ${widget.ysize}`);
    if (widget.style) posAttrs.push(`style "${widget.style}"`);

    const isContainer = widget.type === 'vbox' || widget.type === 'hbox' || widget.type === 'frame';
    const hasChildren = isContainer && widget.children && widget.children.length > 0;

    // Emit unrecognised attributes verbatim before children (on their own lines).
    function emitExtraProps(atDepth: number): string[] {
        if (!widget.extraProps?.length) return [];
        const p = indent.repeat(atDepth);
        return widget.extraProps.map(ep => `${p}${ep}`);
    }

    switch (widget.type) {
        case 'null':
            lines.push(`${pad}null`);
            break;

        case 'text':
            lines.push(`${pad}text "${widget.text ?? ''}"${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}`);
            break;

        case 'image':
            lines.push(`${pad}add "${widget.imagePath ?? ''}"${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}`);
            break;

        case 'textbutton':
            lines.push(`${pad}textbutton "${widget.text ?? ''}" action ${widget.action || 'Return()'}${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}`);
            break;

        case 'button': {
            const attrs = widget.action ? `action ${widget.action}` : '';
            const allAttrs = [attrs, ...posAttrs].filter(Boolean).join(' ');
            if (widget.children && widget.children.length > 0) {
                lines.push(`${pad}button${allAttrs ? ' ' + allAttrs : ''}:`);
                lines.push(...emitExtraProps(depth + 1));
                for (const child of widget.children) {
                    lines.push(generateWidget(child, depth + 1, true, indent));
                }
            } else {
                lines.push(`${pad}button${allAttrs ? ' ' + allAttrs : ''}`);
            }
            break;
        }

        case 'imagebutton': {
            const ibAttrs = [
                widget.imagePath ? `idle "${widget.imagePath}"` : '',
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
            lines.push(...emitExtraProps(depth + 1));
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
            lines.push(...emitExtraProps(depth + 1));
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
            lines.push(`${pad}${widget.code ?? ''}`);
            break;
        }
    }

    return lines.join('\n');
}

/**
 * Generates complete Ren'Py screen code from a Screen Layout Composition.
 *
 * Produces a fully-formed `screen` block with:
 * - Screen declaration with name and attributes (modal, zorder)
 * - All top-level widgets recursively rendered
 * - `pass` statement if no widgets exist (empty screen)
 *
 * @param comp - The screen layout composition to render
 * @param indent - Indentation string (default: 4 spaces)
 * @returns Multi-line Ren'Py screen code ready to copy/paste into `.rpy` files
 *
 * @example
 * ```typescript
 * const code = generateScreenCode(composition);
 * // screen my_menu():
 * //     vbox:
 * //         text "Hello"
 * //         textbutton "Start" action Start()
 * ```
 *
 * @complexity O(w) time where w = total widget count, O(w) space
 */
export function generateScreenCode(comp: ScreenLayoutComposition, indent = '    '): string {
    const lines: string[] = [];

    const screenAttrs: string[] = [];
    if (comp.modal) screenAttrs.push('modal True');
    if (comp.zorder !== 0) screenAttrs.push(`zorder ${comp.zorder}`);

    lines.push(`screen ${comp.screenName}()${screenAttrs.length ? ' ' + screenAttrs.join(' ') : ''}:`);

    if (comp.widgets.length === 0) {
        lines.push(`${indent}pass`);
    } else {
        for (const widget of comp.widgets) {
            lines.push(generateWidget(widget, 1, false, indent));
        }
    }

    return lines.join('\n');
}
