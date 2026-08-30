/**
 * @file notecardTimelineExport.ts
 * @description Pure functions turning Notecard Canvas timeline slots into pasteable text for
 * dropping scene drafts into a Ren'Py .rpy script. No React/IPC — safe to unit test directly.
 */
import type { Notecard, NotecardTimelineSettings } from '@/types';
import { getTimelineSlotLabel } from '@/hooks/useNotecards';

export function formatCard(card: Notecard): string {
  return card.content ? `# ${card.title}\n${card.content}` : `# ${card.title}`;
}

/** Cards in a single slot, concatenated in top-to-bottom (Y) order — the exported order. */
export function formatSlotContent(notecards: Notecard[], slot: number): string {
  return notecards
    .filter(c => c.timelineSlot === slot)
    .sort((a, b) => a.position.y - b.position.y)
    .map(formatCard)
    .join('\n\n');
}

/** Every occupied slot in order, each with a `# <label>` header, cards within sorted by Y. Cards with no timelineSlot are excluded. */
export function formatFullTimeline(notecards: Notecard[], timelineSettings: NotecardTimelineSettings): string {
  const slots = Array.from(new Set(
    notecards.map(c => c.timelineSlot).filter((s): s is number => s !== undefined),
  )).sort((a, b) => a - b);

  return slots
    .map(slot => `# ${getTimelineSlotLabel(timelineSettings, slot)}\n\n${formatSlotContent(notecards, slot)}`)
    .join('\n\n');
}
