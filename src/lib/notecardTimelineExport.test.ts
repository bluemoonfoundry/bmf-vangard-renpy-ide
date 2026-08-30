import { describe, it, expect } from 'vitest';
import { formatCard, formatSlotContent, formatFullTimeline } from '@/lib/notecardTimelineExport';
import { createNotecard } from '@/test/mocks/sampleData';
import { DEFAULT_NOTECARD_TIMELINE_SETTINGS } from '@/hooks/useNotecards';

describe('notecardTimelineExport', () => {
  it('formatCard prefixes content with a "# Title" comment header', () => {
    const card = createNotecard({ title: 'Opening Beat', content: 'It begins.' });
    expect(formatCard(card)).toBe('# Opening Beat\nIt begins.');
  });

  it('formatCard omits the trailing newline when content is empty', () => {
    const card = createNotecard({ title: 'Empty Beat', content: '' });
    expect(formatCard(card)).toBe('# Empty Beat');
  });

  it('formatSlotContent orders cards in the same column by timelineOrder', () => {
    const bottom = createNotecard({ id: 'bottom', title: 'Bottom', content: 'B', timelineSlot: 0, timelineOrder: 1 });
    const top = createNotecard({ id: 'top', title: 'Top', content: 'T', timelineSlot: 0, timelineOrder: 0 });
    const other = createNotecard({ id: 'other', title: 'Other Slot', content: 'X', timelineSlot: 1, timelineOrder: 0 });
    expect(formatSlotContent([bottom, top, other], 0)).toBe('# Top\nT\n\n# Bottom\nB');
  });

  it('formatFullTimeline concatenates only occupied slots, in ascending order, excluding off-timeline cards', () => {
    const a = createNotecard({ id: 'a', title: 'First', content: 'A', timelineSlot: 0, timelineOrder: 0 });
    const b = createNotecard({ id: 'b', title: 'Third', content: 'C', timelineSlot: 2, timelineOrder: 0 });
    const parked = createNotecard({ id: 'parked', title: 'Parking Lot', content: 'P' });
    const result = formatFullTimeline([a, b, parked], DEFAULT_NOTECARD_TIMELINE_SETTINGS);
    expect(result).toBe('# Scene 1\n\n# First\nA\n\n# Scene 3\n\n# Third\nC');
  });
});
