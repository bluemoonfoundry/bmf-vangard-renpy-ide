import { useMemo } from 'react';
import type { Block } from '../types';
import { expandHex } from '../lib/colorPalettes';
import type { PaletteColor } from '../lib/colorPalettes';

/**
 * Scans all block content for hex color literals and returns them as a
 * PaletteColor array, deduplicated (after 3→6 digit normalisation) and
 * sorted most-used first.
 *
 * Matches both 6-digit (#rrggbb) and 3-digit (#rgb) forms. The negative
 * lookahead prevents partial matches inside longer hex strings.
 */
const COLOR_RE = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-fA-F])/g;

export function useProjectColorScan(blocks: Block[]): PaletteColor[] {
    return useMemo(() => {
        const counts = new Map<string, number>();

        for (const block of blocks) {
            if (!block.content) continue;
            // Reset lastIndex between blocks when reusing a global regex
            COLOR_RE.lastIndex = 0;
            for (const match of block.content.matchAll(COLOR_RE)) {
                const hex = expandHex(match[0]);
                counts.set(hex, (counts.get(hex) ?? 0) + 1);
            }
        }

        return Array.from(counts.entries())
            .sort((a, b) => b[1] - a[1])   // most-used first
            .map(([hex]) => ({ hex, name: hex }));
    }, [blocks]);
}
