import type { ScreenLayoutComposition, ScreenWidget } from '@/types';

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
    if (widget.style) posAttrs.push(`style "${widget.style}"`);

    const isContainer = widget.type === 'vbox' || widget.type === 'hbox' || widget.type === 'frame';
    const hasChildren = isContainer && widget.children && widget.children.length > 0;

    switch (widget.type) {
        case 'null':
            lines.push(`${pad}null`);
            break;

        case 'text':
            lines.push(`${pad}text "${widget.text ?? ''}"${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}`);
            break;

        case 'image':
            lines.push(`${pad}image "${widget.imagePath ?? ''}"${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}`);
            break;

        case 'textbutton':
            lines.push(`${pad}textbutton "${widget.text ?? ''}" action ${widget.action || 'Return()'}${posAttrs.length ? ' ' + posAttrs.join(' ') : ''}`);
            break;

        case 'button': {
            const attrs = widget.action ? `action ${widget.action}` : '';
            const allAttrs = [attrs, ...posAttrs].filter(Boolean).join(' ');
            if (hasChildren) {
                lines.push(`${pad}button${allAttrs ? ' ' + allAttrs : ''}:`);
                for (const child of widget.children!) {
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
        case 'frame': {
            const containerAttrs = posAttrs.join(' ');
            lines.push(`${pad}${widget.type}${containerAttrs ? ' ' + containerAttrs : ''}:`);
            if (hasChildren) {
                for (const child of widget.children!) {
                    lines.push(generateWidget(child, depth + 1, true, indent));
                }
            } else {
                lines.push(`${pad}${indent}pass`);
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
