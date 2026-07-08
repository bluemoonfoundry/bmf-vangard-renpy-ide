import { describe, it, expect } from 'vitest';
import { buildNewBlockContent } from '@/lib/blockContent';

describe('buildNewBlockContent', () => {
  it('generates a label block for type "story"', () => {
    const content = buildNewBlockContent('start', 'story');
    expect(content).toContain('label start:');
    expect(content).toContain('return');
  });

  it('uses the provided name in the label', () => {
    const content = buildNewBlockContent('chapter1', 'story');
    expect(content).toContain('label chapter1:');
  });

  it('returns empty string for type "screen"', () => {
    expect(buildNewBlockContent('my_screen', 'screen')).toBe('');
  });

  it('returns empty string for type "config"', () => {
    expect(buildNewBlockContent('options', 'config')).toBe('');
  });

  it('story content ends with a newline', () => {
    const content = buildNewBlockContent('start', 'story');
    expect(content.endsWith('\n')).toBe(true);
  });
});
