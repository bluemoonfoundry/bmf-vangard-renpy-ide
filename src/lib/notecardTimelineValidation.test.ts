import { describe, it, expect } from 'vitest';
import { getBackwardTimelineLinkWarnings } from '@/lib/notecardTimelineValidation';
import { createNotecard, createNotecardLink } from '@/test/mocks/sampleData';

describe('getBackwardTimelineLinkWarnings', () => {
  it('flags a link whose fromId sits in a later slot than its toId', () => {
    const from = createNotecard({ id: 'from', title: 'Confrontation', timelineSlot: 2 });
    const to = createNotecard({ id: 'to', title: 'Opening', timelineSlot: 0 });
    const link = createNotecardLink({ fromId: 'from', toId: 'to' });
    const warnings = getBackwardTimelineLinkWarnings([from, to], [link]);
    expect(warnings.get('from')).toEqual(['Links to "Opening", which is earlier on the timeline.']);
    expect(warnings.get('to')).toEqual(['Linked from "Confrontation", which is later on the timeline.']);
  });

  it('does not flag a link that points forward in time', () => {
    const from = createNotecard({ id: 'from', timelineSlot: 0 });
    const to = createNotecard({ id: 'to', timelineSlot: 2 });
    const link = createNotecardLink({ fromId: 'from', toId: 'to' });
    const warnings = getBackwardTimelineLinkWarnings([from, to], [link]);
    expect(warnings.size).toBe(0);
  });

  it('does not flag a link between cards in the same slot', () => {
    const from = createNotecard({ id: 'from', timelineSlot: 1 });
    const to = createNotecard({ id: 'to', timelineSlot: 1 });
    const link = createNotecardLink({ fromId: 'from', toId: 'to' });
    const warnings = getBackwardTimelineLinkWarnings([from, to], [link]);
    expect(warnings.size).toBe(0);
  });

  it('does not flag a link where one or both endpoints are not on the timeline', () => {
    const pinned = createNotecard({ id: 'pinned', timelineSlot: 2 });
    const unsorted = createNotecard({ id: 'unsorted' });
    const link = createNotecardLink({ fromId: 'pinned', toId: 'unsorted' });
    const warnings = getBackwardTimelineLinkWarnings([pinned, unsorted], [link]);
    expect(warnings.size).toBe(0);
  });

  it('collects multiple warnings for a card involved in more than one backward link', () => {
    const a = createNotecard({ id: 'a', title: 'A', timelineSlot: 2 });
    const b = createNotecard({ id: 'b', title: 'B', timelineSlot: 0 });
    const c = createNotecard({ id: 'c', title: 'C', timelineSlot: 1 });
    const linkAB = createNotecardLink({ fromId: 'a', toId: 'b' });
    const linkAC = createNotecardLink({ fromId: 'a', toId: 'c' });
    const warnings = getBackwardTimelineLinkWarnings([a, b, c], [linkAB, linkAC]);
    expect(warnings.get('a')).toHaveLength(2);
  });
});
