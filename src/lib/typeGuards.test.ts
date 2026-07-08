import { describe, it, expect } from 'vitest';
import { isSerializedSceneComposition, isSerializedImageMapComposition } from '@/lib/typeGuards';

describe('isSerializedSceneComposition', () => {
  it('returns true for object with sprites array', () => {
    expect(isSerializedSceneComposition({ sprites: [] })).toBe(true);
  });

  it('returns true when sprites is a non-empty array', () => {
    expect(isSerializedSceneComposition({ sprites: [{ id: 'a' }] })).toBe(true);
  });

  it('returns false for null', () => {
    expect(isSerializedSceneComposition(null)).toBe(false);
  });

  it('returns false for non-object', () => {
    expect(isSerializedSceneComposition('string')).toBe(false);
    expect(isSerializedSceneComposition(42)).toBe(false);
  });

  it('returns false when sprites is missing', () => {
    expect(isSerializedSceneComposition({ background: 'bg.png' })).toBe(false);
  });

  it('returns false when sprites is not an array', () => {
    expect(isSerializedSceneComposition({ sprites: 'not-an-array' })).toBe(false);
  });
});

describe('isSerializedImageMapComposition', () => {
  it('returns true for object with screenName string and hotspots array', () => {
    expect(isSerializedImageMapComposition({ screenName: 'main', hotspots: [] })).toBe(true);
  });

  it('returns false for null', () => {
    expect(isSerializedImageMapComposition(null)).toBe(false);
  });

  it('returns false when screenName is missing', () => {
    expect(isSerializedImageMapComposition({ hotspots: [] })).toBe(false);
  });

  it('returns false when screenName is not a string', () => {
    expect(isSerializedImageMapComposition({ screenName: 42, hotspots: [] })).toBe(false);
  });

  it('returns false when hotspots is missing', () => {
    expect(isSerializedImageMapComposition({ screenName: 'main' })).toBe(false);
  });

  it('returns false when hotspots is not an array', () => {
    expect(isSerializedImageMapComposition({ screenName: 'main', hotspots: {} })).toBe(false);
  });

  it('returns false for non-object', () => {
    expect(isSerializedImageMapComposition('text')).toBe(false);
  });
});
