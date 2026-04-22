import { describe, it, expect } from 'vitest';
import {
  isTranslationFile,
  extractLanguageFromPath,
  extractTranslatableStrings,
  extractTranslatedStrings,
  computeLanguageCoverages,
  performTranslationAnalysis,
} from '../lib/renpyTranslationParser';
import type { AnalysisBlock } from '../lib/renpyTranslationParser';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeBlock(overrides: Partial<AnalysisBlock> & { content: string }): AnalysisBlock {
  return {
    id: overrides.id ?? 'block-1',
    filePath: overrides.filePath ?? 'game/script.rpy',
    content: overrides.content,
  };
}

// ---------------------------------------------------------------------------
// isTranslationFile / extractLanguageFromPath
// ---------------------------------------------------------------------------

describe('isTranslationFile', () => {
  it('returns true for paths under /tl/<lang>/', () => {
    expect(isTranslationFile('game/tl/french/script.rpy')).toBe(true);
    expect(isTranslationFile('game/tl/japanese/common.rpy')).toBe(true);
  });

  it('returns false for source paths', () => {
    expect(isTranslationFile('game/script.rpy')).toBe(false);
    expect(isTranslationFile('game/screens.rpy')).toBe(false);
  });

  it('handles backslash paths (Windows)', () => {
    expect(isTranslationFile('game\\tl\\french\\script.rpy')).toBe(true);
  });
});

describe('extractLanguageFromPath', () => {
  it('extracts the language code', () => {
    expect(extractLanguageFromPath('game/tl/french/script.rpy')).toBe('french');
    expect(extractLanguageFromPath('game/tl/ja_JP/common.rpy')).toBe('ja_JP');
  });

  it('returns null for non-translation paths', () => {
    expect(extractLanguageFromPath('game/script.rpy')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// extractTranslatableStrings
// ---------------------------------------------------------------------------

describe('extractTranslatableStrings', () => {
  it('extracts dialogue lines', () => {
    const block = makeBlock({
      content: 'label start:\n    e "Hello world"\n    return\n',
    });
    const result = extractTranslatableStrings([block], new Map(), {
      start: { blockId: 'block-1' },
    });
    expect(result).toHaveLength(1);
    expect(result[0].sourceText).toBe('Hello world');
    expect(result[0].type).toBe('dialogue');
    expect(result[0].characterTag).toBe('e');
    expect(result[0].labelScope).toBe('start');
  });

  it('extracts narration lines', () => {
    const block = makeBlock({
      content: 'label intro:\n    "Once upon a time..."\n',
    });
    const result = extractTranslatableStrings([block], new Map(), {
      intro: { blockId: 'block-1' },
    });
    expect(result).toHaveLength(1);
    expect(result[0].sourceText).toBe('Once upon a time...');
    expect(result[0].type).toBe('narration');
    expect(result[0].characterTag).toBeNull();
  });

  it('extracts menu choices', () => {
    const block = makeBlock({
      content: 'label choice:\n    menu:\n        "Go left":\n            jump left\n        "Go right":\n            jump right\n',
    });
    const result = extractTranslatableStrings([block], new Map(), {
      choice: { blockId: 'block-1' },
    });
    expect(result).toHaveLength(2);
    expect(result[0].sourceText).toBe('Go left');
    expect(result[0].type).toBe('menu-choice');
    expect(result[1].sourceText).toBe('Go right');
  });

  it('skips translation files', () => {
    const block = makeBlock({
      filePath: 'game/tl/french/script.rpy',
      content: 'label start:\n    e "Bonjour"\n',
    });
    const result = extractTranslatableStrings([block], new Map(), {});
    expect(result).toHaveLength(0);
  });

  it('skips Ren\'Py keyword lines that look like dialogue', () => {
    const block = makeBlock({
      content: 'label start:\n    show eileen happy\n    scene bg room\n    e "Real dialogue"\n',
    });
    const result = extractTranslatableStrings([block], new Map(), {
      start: { blockId: 'block-1' },
    });
    expect(result).toHaveLength(1);
    expect(result[0].sourceText).toBe('Real dialogue');
  });

  it('returns empty for blocks with no translatable content', () => {
    const block = makeBlock({
      content: 'init python:\n    config.screen_width = 1920\n',
    });
    const result = extractTranslatableStrings([block], new Map(), {});
    expect(result).toHaveLength(0);
  });

  it('handles multiple labels in one block', () => {
    const block = makeBlock({
      content: 'label part1:\n    e "Line A"\nlabel part2:\n    e "Line B"\n',
    });
    const result = extractTranslatableStrings([block], new Map(), {
      part1: { blockId: 'block-1' },
      part2: { blockId: 'block-1' },
    });
    expect(result).toHaveLength(2);
    expect(result[0].labelScope).toBe('part1');
    expect(result[1].labelScope).toBe('part2');
  });
});

// ---------------------------------------------------------------------------
// extractTranslatedStrings
// ---------------------------------------------------------------------------

describe('extractTranslatedStrings', () => {
  it('parses translate <lang> <id>: blocks with dialogue', () => {
    const block = makeBlock({
      id: 'tl-block',
      filePath: 'game/tl/french/script.rpy',
      content: 'translate french start_abc123:\n    e "Bonjour le monde"\n',
    });
    const { translatedStrings, detectedLanguages } = extractTranslatedStrings([block]);
    expect(detectedLanguages.has('french')).toBe(true);
    expect(translatedStrings.get('french')).toHaveLength(1);
    expect(translatedStrings.get('french')![0].translatedText).toBe('Bonjour le monde');
    expect(translatedStrings.get('french')![0].id).toBe('start_abc123');
  });

  it('parses translate <lang> <id>: blocks with narration', () => {
    const block = makeBlock({
      id: 'tl-block',
      filePath: 'game/tl/spanish/script.rpy',
      content: 'translate spanish intro_xyz:\n    "Habia una vez..."\n',
    });
    const { translatedStrings } = extractTranslatedStrings([block]);
    expect(translatedStrings.get('spanish')).toHaveLength(1);
    expect(translatedStrings.get('spanish')![0].translatedText).toBe('Habia una vez...');
  });

  it('parses translate <lang> strings: old/new tables', () => {
    const block = makeBlock({
      id: 'tl-block',
      filePath: 'game/tl/german/common.rpy',
      content: 'translate german strings:\n    old "Start"\n    new "Anfang"\n    old "Quit"\n    new "Beenden"\n',
    });
    const { translatedStrings } = extractTranslatedStrings([block]);
    expect(translatedStrings.get('german')).toHaveLength(2);
    expect(translatedStrings.get('german')![0].translatedText).toBe('Anfang');
    expect(translatedStrings.get('german')![1].translatedText).toBe('Beenden');
  });

  it('skips non-translation files', () => {
    const block = makeBlock({
      filePath: 'game/script.rpy',
      content: 'label start:\n    e "Hello"\n',
    });
    const { translatedStrings, detectedLanguages } = extractTranslatedStrings([block]);
    expect(translatedStrings.size).toBe(0);
    expect(detectedLanguages.size).toBe(0);
  });

  it('detects multiple languages', () => {
    const blocks = [
      makeBlock({ id: 'fr', filePath: 'game/tl/french/script.rpy', content: 'translate french id1:\n    e "Bonjour"\n' }),
      makeBlock({ id: 'de', filePath: 'game/tl/german/script.rpy', content: 'translate german id1:\n    e "Hallo"\n' }),
    ];
    const { detectedLanguages } = extractTranslatedStrings(blocks);
    expect(detectedLanguages.size).toBe(2);
    expect(detectedLanguages.has('french')).toBe(true);
    expect(detectedLanguages.has('german')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// computeLanguageCoverages
// ---------------------------------------------------------------------------

describe('computeLanguageCoverages', () => {
  it('computes 100% coverage', () => {
    const source = [
      { id: 'id1', sourceText: 'Hello', blockId: 'b1', filePath: 'game/script.rpy', line: 1, labelScope: null, characterTag: 'e', type: 'dialogue' as const },
    ];
    const translated = new Map([
      ['french', [{ id: 'id1', translatedText: 'Bonjour', blockId: 'tl1', filePath: 'game/tl/french/script.rpy', line: 2, language: 'french' }]],
    ]);
    const coverages = computeLanguageCoverages(source, translated, new Set(['french']));
    expect(coverages).toHaveLength(1);
    expect(coverages[0].completionPercent).toBe(100);
    expect(coverages[0].untranslatedCount).toBe(0);
  });

  it('computes 0% when no translations exist', () => {
    const source = [
      { id: 'id1', sourceText: 'Hello', blockId: 'b1', filePath: 'game/script.rpy', line: 1, labelScope: null, characterTag: 'e', type: 'dialogue' as const },
    ];
    const coverages = computeLanguageCoverages(source, new Map(), new Set(['french']));
    expect(coverages).toHaveLength(1);
    expect(coverages[0].completionPercent).toBe(0);
    expect(coverages[0].untranslatedCount).toBe(1);
  });

  it('computes partial coverage', () => {
    const source = [
      { id: 'id1', sourceText: 'Hello', blockId: 'b1', filePath: 'game/script.rpy', line: 1, labelScope: null, characterTag: 'e', type: 'dialogue' as const },
      { id: 'id2', sourceText: 'Goodbye', blockId: 'b1', filePath: 'game/script.rpy', line: 2, labelScope: null, characterTag: 'e', type: 'dialogue' as const },
    ];
    const translated = new Map([
      ['french', [{ id: 'id1', translatedText: 'Bonjour', blockId: 'tl1', filePath: 'game/tl/french/script.rpy', line: 2, language: 'french' }]],
    ]);
    const coverages = computeLanguageCoverages(source, translated, new Set(['french']));
    expect(coverages[0].completionPercent).toBe(50);
    expect(coverages[0].translatedCount).toBe(1);
    expect(coverages[0].untranslatedCount).toBe(1);
  });

  it('returns empty array when no languages detected', () => {
    const coverages = computeLanguageCoverages([], new Map(), new Set());
    expect(coverages).toHaveLength(0);
  });

  it('detects stale translations (text matches source)', () => {
    const source = [
      { id: 'id1', sourceText: 'Hello', blockId: 'b1', filePath: 'game/script.rpy', line: 1, labelScope: null, characterTag: 'e', type: 'dialogue' as const },
    ];
    const translated = new Map([
      ['french', [{ id: 'id1', translatedText: 'Hello', blockId: 'tl1', filePath: 'game/tl/french/script.rpy', line: 2, language: 'french' }]],
    ]);
    const coverages = computeLanguageCoverages(source, translated, new Set(['french']));
    expect(coverages[0].staleCount).toBe(1);
  });

  it('includes file breakdown', () => {
    const source = [
      { id: 'id1', sourceText: 'Hello', blockId: 'b1', filePath: 'game/script.rpy', line: 1, labelScope: null, characterTag: 'e', type: 'dialogue' as const },
      { id: 'id2', sourceText: 'Bye', blockId: 'b2', filePath: 'game/chapter2.rpy', line: 1, labelScope: null, characterTag: 'e', type: 'dialogue' as const },
    ];
    const translated = new Map([
      ['french', [{ id: 'id1', translatedText: 'Bonjour', blockId: 'tl1', filePath: 'game/tl/french/script.rpy', line: 2, language: 'french' }]],
    ]);
    const coverages = computeLanguageCoverages(source, translated, new Set(['french']));
    expect(coverages[0].fileBreakdown).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// performTranslationAnalysis (integration)
// ---------------------------------------------------------------------------

describe('performTranslationAnalysis', () => {
  it('runs end-to-end with source + translation blocks', () => {
    const blocks: AnalysisBlock[] = [
      makeBlock({
        id: 'src',
        filePath: 'game/script.rpy',
        content: 'label start:\n    e "Hello world"\n    "Narration here"\n',
      }),
      makeBlock({
        id: 'tl-fr',
        filePath: 'game/tl/french/script.rpy',
        content: 'translate french start_abc:\n    e "Bonjour le monde"\n\ntranslate french start_def:\n    "Narration ici"\n',
      }),
    ];
    const labels = { start: { blockId: 'src' } };
    const result = performTranslationAnalysis(blocks, new Map(), labels);

    expect(result.translatableStrings).toHaveLength(2);
    expect(result.detectedLanguages).toEqual(['french']);
    expect(result.languageCoverages).toHaveLength(1);
    expect(result.languageCoverages[0].language).toBe('french');
  });

  it('returns empty data when there are no translatable strings', () => {
    const blocks: AnalysisBlock[] = [
      makeBlock({
        content: 'init python:\n    config.screen_width = 1920\n',
      }),
    ];
    const result = performTranslationAnalysis(blocks, new Map(), {});
    expect(result.translatableStrings).toHaveLength(0);
    expect(result.detectedLanguages).toHaveLength(0);
    expect(result.languageCoverages).toHaveLength(0);
  });

  it('handles source-only (no translation files)', () => {
    const blocks: AnalysisBlock[] = [
      makeBlock({
        content: 'label start:\n    e "Hello"\n',
      }),
    ];
    const result = performTranslationAnalysis(blocks, new Map(), { start: { blockId: 'block-1' } });
    expect(result.translatableStrings).toHaveLength(1);
    expect(result.detectedLanguages).toHaveLength(0);
    expect(result.languageCoverages).toHaveLength(0);
  });

  it('handles translation-only (no source blocks)', () => {
    const blocks: AnalysisBlock[] = [
      makeBlock({
        id: 'tl-fr',
        filePath: 'game/tl/french/script.rpy',
        content: 'translate french start_abc:\n    e "Bonjour"\n',
      }),
    ];
    const result = performTranslationAnalysis(blocks, new Map(), {});
    expect(result.translatableStrings).toHaveLength(0);
    expect(result.detectedLanguages).toEqual(['french']);
    expect(result.languageCoverages).toHaveLength(1);
    expect(result.languageCoverages[0].completionPercent).toBe(0);
  });

  it('builds stringTranslations lookup', () => {
    const blocks: AnalysisBlock[] = [
      makeBlock({
        id: 'src',
        filePath: 'game/script.rpy',
        content: 'label start:\n    e "Hello"\n',
      }),
      makeBlock({
        id: 'tl-fr',
        filePath: 'game/tl/french/script.rpy',
        content: 'translate french myid:\n    e "Bonjour"\n',
      }),
      makeBlock({
        id: 'tl-de',
        filePath: 'game/tl/german/script.rpy',
        content: 'translate german myid:\n    e "Hallo"\n',
      }),
    ];
    const result = performTranslationAnalysis(blocks, new Map(), { start: { blockId: 'src' } });
    expect(result.stringTranslations.has('myid')).toBe(true);
    expect(result.stringTranslations.get('myid')!.size).toBe(2);
  });
});
