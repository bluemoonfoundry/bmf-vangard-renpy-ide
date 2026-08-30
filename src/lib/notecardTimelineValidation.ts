/**
 * @file notecardTimelineValidation.ts
 * @description Cross-checks Notecard Canvas directed links against Timeline slot order. Links
 * only render as arrows in the Unsorted pane (a spatial arrow doesn't fit a Kanban column), so
 * once both a link's endpoints are pinned to the timeline this is the only place that
 * relationship stays visible — surfaced as a per-card tooltip warning rather than an arrow.
 */
import type { Notecard, NotecardLink } from '@/types';

/** Card id -> tooltip messages for links whose direction contradicts timeline order. Only
 * links where *both* endpoints have a timelineSlot are checked — a link touching an Unsorted
 * card has nothing to compare against. */
export function getBackwardTimelineLinkWarnings(notecards: Notecard[], notecardLinks: NotecardLink[]): Map<string, string[]> {
  const byId = new Map(notecards.map(c => [c.id, c]));
  const warnings = new Map<string, string[]>();
  const add = (cardId: string, message: string) => {
    const list = warnings.get(cardId) ?? [];
    list.push(message);
    warnings.set(cardId, list);
  };

  for (const link of notecardLinks) {
    const from = byId.get(link.fromId);
    const to = byId.get(link.toId);
    if (!from || !to || from.timelineSlot === undefined || to.timelineSlot === undefined) continue;
    if (from.timelineSlot > to.timelineSlot) {
      add(from.id, `Links to "${to.title}", which is earlier on the timeline.`);
      add(to.id, `Linked from "${from.title}", which is later on the timeline.`);
    }
  }
  return warnings;
}
