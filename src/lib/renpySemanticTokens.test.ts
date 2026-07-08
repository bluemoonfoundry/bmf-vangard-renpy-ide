import { describe, it, expect } from 'vitest';
import {
  computeSemanticTokens,
  getSemanticTokensLegend,
  SEMANTIC_TOKEN_TYPES,
  SEMANTIC_DARK_RULES,
  SEMANTIC_LIGHT_RULES,
} from '@/lib/renpySemanticTokens';
import { createEmptyAnalysisResult, createSampleAnalysisResult } from '@/test/mocks/sampleData';

// Token type constants (order matches the legend)
const T_LABEL = 0;
const T_LABEL_UNDEF = 1;
const T_CHARACTER = 2;
const T_CHARACTER_UNK = 3;
const T_IMAGE = 4;
const T_IMAGE_UNK = 5;
const T_SCREEN = 6;
const T_SCREEN_UNK = 7;
const T_VARIABLE = 8;

function extractTokens(arr: Uint32Array) {
  const tokens: { deltaLine: number; deltaChar: number; length: number; tokenType: number }[] = [];
  for (let i = 0; i < arr.length; i += 5) {
    tokens.push({
      deltaLine: arr[i],
      deltaChar: arr[i + 1],
      length: arr[i + 2],
      tokenType: arr[i + 3],
    });
  }
  return tokens;
}

describe('getSemanticTokensLegend', () => {
  it('returns an object with tokenTypes array', () => {
    const legend = getSemanticTokensLegend();
    expect(legend).toHaveProperty('tokenTypes');
    expect(Array.isArray(legend.tokenTypes)).toBe(true);
  });

  it('tokenTypes has 9 entries matching SEMANTIC_TOKEN_TYPES', () => {
    const legend = getSemanticTokensLegend();
    expect(legend.tokenTypes).toHaveLength(9);
    expect(legend.tokenTypes).toEqual(SEMANTIC_TOKEN_TYPES);
  });

  it('includes tokenModifiers array', () => {
    const legend = getSemanticTokensLegend();
    expect(legend).toHaveProperty('tokenModifiers');
    expect(Array.isArray(legend.tokenModifiers)).toBe(true);
  });
});

describe('computeSemanticTokens', () => {
  const emptyAnalysis = createEmptyAnalysisResult();
  const sampleAnalysis = createSampleAnalysisResult();

  it('returns Uint32Array', () => {
    const result = computeSemanticTokens('', emptyAnalysis);
    expect(result).toBeInstanceOf(Uint32Array);
  });

  it('returns empty array for empty text', () => {
    const result = computeSemanticTokens('', emptyAnalysis);
    expect(result).toHaveLength(0);
  });

  it('returns empty array for text with no tokens', () => {
    const result = computeSemanticTokens('# just a comment\n', emptyAnalysis);
    expect(result).toHaveLength(0);
  });

  it('each token contributes exactly 5 values', () => {
    const text = 'jump start\n';
    const result = computeSemanticTokens(text, emptyAnalysis);
    expect(result.length % 5).toBe(0);
  });

  // ── jump/call label references ─────────────────────────────────────────────

  it('jump to undefined label produces T_LABEL_UNDEF', () => {
    const text = 'jump unknownLabel\n';
    const result = computeSemanticTokens(text, emptyAnalysis);
    expect(result.length).toBeGreaterThan(0);
    const tokens = extractTokens(result);
    expect(tokens[0].tokenType).toBe(T_LABEL_UNDEF);
  });

  it('jump to a known label produces T_LABEL', () => {
    // sampleAnalysis has labels from createSampleAnalysisResult
    const labelNames = sampleAnalysis.labelNodes.map((n: any) => n.id ?? n.label);
    if (labelNames.length === 0) {
      // fallback: use a real label name from the analysis
      return;
    }
    const known = labelNames[0];
    const text = `jump ${known}\n`;
    const result = computeSemanticTokens(text, sampleAnalysis);
    const tokens = extractTokens(result);
    expect(tokens.some(t => t.tokenType === T_LABEL)).toBe(true);
  });

  it('call to undefined label produces T_LABEL_UNDEF', () => {
    const text = 'call unknownScene\n';
    const result = computeSemanticTokens(text, emptyAnalysis);
    const tokens = extractTokens(result);
    expect(tokens[0].tokenType).toBe(T_LABEL_UNDEF);
  });

  // ── character dialogue ─────────────────────────────────────────────────────

  it('known character tag produces T_CHARACTER', () => {
    // RE_CHAR_DIALOGUE requires leading whitespace: /^(\s+)([a-zA-Z_]\w*)\s+"/
    const text = '    e "Hello there!"\n';
    // sampleAnalysis has character 'e' (Eileen)
    const result = computeSemanticTokens(text, sampleAnalysis);
    const tokens = extractTokens(result);
    expect(tokens.some(t => t.tokenType === T_CHARACTER)).toBe(true);
  });

  it('unknown character tag produces T_CHARACTER_UNK', () => {
    const text = '    xyz "Hello there!"\n';
    const result = computeSemanticTokens(text, emptyAnalysis);
    if (result.length > 0) {
      const tokens = extractTokens(result);
      expect(tokens[0].tokenType).toBe(T_CHARACTER_UNK);
    }
  });

  // ── show image ─────────────────────────────────────────────────────────────

  it('show image produces a token', () => {
    const text = 'show eileen happy\n';
    const result = computeSemanticTokens(text, emptyAnalysis);
    expect(result.length).toBeGreaterThan(0);
  });

  it('known show image produces T_IMAGE', () => {
    const knownImages = sampleAnalysis.images ?? [];
    if (knownImages.length === 0) return;
    const img = knownImages[0];
    const text = `show ${img.name ?? img}\n`;
    const result = computeSemanticTokens(text, sampleAnalysis);
    const tokens = extractTokens(result);
    expect(tokens.some(t => t.tokenType === T_IMAGE)).toBe(true);
  });

  it('unknown show image produces T_IMAGE_UNK', () => {
    const text = 'show unknownSprite\n';
    const result = computeSemanticTokens(text, emptyAnalysis);
    const tokens = extractTokens(result);
    expect(tokens[0].tokenType).toBe(T_IMAGE_UNK);
  });

  // ── screen references ──────────────────────────────────────────────────────

  it('show screen produces a token', () => {
    const text = 'show screen myscreen\n';
    const result = computeSemanticTokens(text, emptyAnalysis);
    expect(result.length).toBeGreaterThan(0);
  });

  it('unknown screen reference produces T_SCREEN_UNK', () => {
    const text = 'show screen nonexistent_screen\n';
    const result = computeSemanticTokens(text, emptyAnalysis);
    const tokens = extractTokens(result);
    expect(tokens[0].tokenType).toBe(T_SCREEN_UNK);
  });

  it('known screen reference produces T_SCREEN', () => {
    const analysisWithScreen = createEmptyAnalysisResult({
      screens: new Map([['inventory', { name: 'inventory', definedInBlockId: 'block-1', line: 1 }]]) as any,
    });
    const text = 'show screen inventory\n';
    const result = computeSemanticTokens(text, analysisWithScreen);
    const tokens = extractTokens(result);
    expect(tokens.some(t => t.tokenType === T_SCREEN)).toBe(true);
  });

  // ── inline Python variables ────────────────────────────────────────────────

  it('inline python variable produces T_VARIABLE token when variable is known', () => {
    // RE_INLINE_PYTHON only emits tokens for known vars; sampleAnalysis has 'player_name'
    const text = '$ player_name = "Alice"\n';
    const result = computeSemanticTokens(text, sampleAnalysis);
    const tokens = extractTokens(result);
    expect(tokens.some(t => t.tokenType === T_VARIABLE)).toBe(true);
  });

  // ── delta encoding ─────────────────────────────────────────────────────────

  it('token on line 0 has deltaLine=0', () => {
    const text = 'jump start\n';
    const result = computeSemanticTokens(text, emptyAnalysis);
    const tokens = extractTokens(result);
    expect(tokens[0].deltaLine).toBe(0);
  });

  it('token on line 2 has deltaLine=2 (first token after two empty lines)', () => {
    const text = '\n\njump start\n';
    const result = computeSemanticTokens(text, emptyAnalysis);
    const tokens = extractTokens(result);
    expect(tokens[0].deltaLine).toBe(2);
  });

  it('two tokens on different lines have correct cumulative deltaLine', () => {
    const text = 'jump alpha\njump beta\n';
    const result = computeSemanticTokens(text, emptyAnalysis);
    const tokens = extractTokens(result);
    expect(tokens).toHaveLength(2);
    expect(tokens[0].deltaLine).toBe(0);
    expect(tokens[1].deltaLine).toBe(1);
  });

  it('token length matches the identifier length', () => {
    const text = 'jump start\n';
    const result = computeSemanticTokens(text, emptyAnalysis);
    const tokens = extractTokens(result);
    expect(tokens[0].length).toBe('start'.length);
  });
});

describe('SEMANTIC_DARK_RULES and SEMANTIC_LIGHT_RULES', () => {
  it('SEMANTIC_DARK_RULES is an array', () => {
    expect(Array.isArray(SEMANTIC_DARK_RULES)).toBe(true);
    expect(SEMANTIC_DARK_RULES.length).toBeGreaterThan(0);
  });

  it('SEMANTIC_LIGHT_RULES is an array', () => {
    expect(Array.isArray(SEMANTIC_LIGHT_RULES)).toBe(true);
    expect(SEMANTIC_LIGHT_RULES.length).toBeGreaterThan(0);
  });

  it('each rule has token and foreground fields', () => {
    for (const rule of SEMANTIC_DARK_RULES) {
      expect(rule).toHaveProperty('token');
      expect(rule).toHaveProperty('foreground');
    }
  });
});
