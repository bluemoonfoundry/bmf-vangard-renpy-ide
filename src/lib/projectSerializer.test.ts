import { describe, it, expect } from 'vitest';
import { deserializeProjectData } from './projectSerializer';
import type { ProjectLoadResult, Block } from '@/types';
import { createNotecard, createNotecardLink } from '@/test/mocks/sampleData';

function makeResult(overrides: Partial<ProjectLoadResult> = {}): ProjectLoadResult {
  return {
    rootPath: '/proj',
    files: [{ path: 'game/script.rpy', content: 'label start:\n    return\n' }],
    images: [],
    audios: [],
    settings: null,
    tree: { name: 'proj', path: '/proj', children: [] },
    ...overrides,
  };
}

function makeBlock(filePath: string, id = 'b1'): Block {
  return {
    id,
    content: '',
    filePath,
    position: { x: 10, y: 20 },
    width: 300,
    height: 180,
    title: filePath.split('/').pop(),
  };
}

describe('deserializeProjectData', () => {
  it('maps file list to blocks', () => {
    const snap = deserializeProjectData(makeResult(), []);
    expect(snap.blocks).toHaveLength(1);
    expect(snap.blocks[0].filePath).toBe('game/script.rpy');
    expect(snap.blocks[0].content).toBe('label start:\n    return\n');
  });

  it('preserves block ID for an existing file', () => {
    const existing = makeBlock('game/script.rpy', 'existing-id');
    const snap = deserializeProjectData(makeResult(), [existing]);
    expect(snap.blocks[0].id).toBe('existing-id');
  });

  it('assigns a new ID when file path is not in current blocks', () => {
    const snap = deserializeProjectData(makeResult(), []);
    expect(snap.blocks[0].id).toMatch(/^block-/);
  });

  it('preserves position from existing block when no saved layout', () => {
    const existing = makeBlock('game/script.rpy');
    const snap = deserializeProjectData(makeResult(), [existing]);
    expect(snap.blocks[0].position).toEqual({ x: 10, y: 20 });
  });

  it('uses saved layout position over existing block position', () => {
    const existing = makeBlock('game/script.rpy');
    const data = makeResult({
      settings: {
        openTabs: [],
        activeTabId: 'canvas',
        draftingMode: false,
        storyBlockLayouts: {
          'game/script.rpy': { position: { x: 99, y: 77 }, width: 400, height: 250 },
        },
      } as ProjectLoadResult['settings'],
    });
    const snap = deserializeProjectData(data, [existing]);
    expect(snap.blocks[0].position).toEqual({ x: 99, y: 77 });
    expect(snap.blocks[0].width).toBe(400);
  });

  it('creates a default script.rpy block for empty projects', () => {
    const snap = deserializeProjectData(makeResult({ files: [] }), []);
    expect(snap.blocks).toHaveLength(1);
    expect(snap.blocks[0].filePath).toBe('script.rpy');
    expect(snap.defaultScriptBlock).not.toBeNull();
    expect(snap.defaultScriptBlock?.filePath).toBe('script.rpy');
  });

  it('does not set defaultScriptBlock when files are present', () => {
    const snap = deserializeProjectData(makeResult(), []);
    expect(snap.defaultScriptBlock).toBeNull();
  });

  it('builds image map from IPC result', () => {
    const data = makeResult({
      images: [{ path: 'game/images/bg.png', fileName: 'bg.png', dataUrl: 'data:..', lastModified: 0, size: 100 }],
    });
    const snap = deserializeProjectData(data, []);
    expect(snap.images.has('game/images/bg.png')).toBe(true);
    expect(snap.images.get('game/images/bg.png')?.isInProject).toBe(true);
  });

  it('migrates legacy single-scene format to multi-scene keyed map', () => {
    const data = makeResult({
      settings: {
        openTabs: [],
        activeTabId: 'canvas',
        draftingMode: false,
        sceneComposition: {
          background: null,
          sprites: [],
          resolution: { width: 1280, height: 720 },
        },
      } as unknown as ProjectLoadResult['settings'],
    });
    const snap = deserializeProjectData(data, []);
    expect('scene-default' in snap.sceneCompositions).toBe(true);
    expect(snap.sceneNames['scene-default']).toBe('Default Scene');
  });

  it('validates primary tabs — drops editor tabs whose filePath is not in blocks', () => {
    const data = makeResult({
      settings: {
        openTabs: [
          { id: 'canvas', type: 'canvas' },
          { id: 'stale-id', type: 'editor', filePath: 'game/deleted.rpy' },
        ],
        activeTabId: 'canvas',
        draftingMode: false,
      },
    });
    const snap = deserializeProjectData(data, []);
    expect(snap.primaryTabs.every(t => t.type !== 'editor' || t.filePath !== 'game/deleted.rpy')).toBe(true);
  });

  it('re-binds editor tab ID to the loaded block ID', () => {
    const existing = makeBlock('game/script.rpy', 'real-block-id');
    const data = makeResult({
      settings: {
        openTabs: [{ id: 'stale-block-id', type: 'editor', filePath: 'game/script.rpy' }],
        activeTabId: 'stale-block-id',
        draftingMode: false,
      },
    });
    const snap = deserializeProjectData(data, [existing]);
    const editorTab = snap.primaryTabs.find(t => t.type === 'editor');
    expect(editorTab?.id).toBe('real-block-id');
  });

  it('migrates punchlist tab to diagnostics', () => {
    const data = makeResult({
      settings: {
        openTabs: [{ id: 'punchlist', type: 'punchlist' }],
        activeTabId: 'punchlist',
        draftingMode: false,
      },
    });
    const snap = deserializeProjectData(data, []);
    const tab = snap.primaryTabs.find(t => t.id === 'punchlist' || t.id === 'diagnostics');
    expect(tab?.type).toBe('diagnostics');
  });

  it('keeps scene-composer tab when sceneId is present', () => {
    const data = makeResult({
      settings: {
        openTabs: [{ id: 'scene-tab', type: 'scene-composer', sceneId: 'scene-abc' }],
        activeTabId: 'scene-tab',
        draftingMode: false,
      },
    });
    const snap = deserializeProjectData(data, []);
    const tab = snap.primaryTabs.find(t => t.type === 'scene-composer');
    expect(tab?.sceneId).toBe('scene-abc');
  });

  it('drops scene-composer tab when sceneId is absent (no migration path)', () => {
    const data = makeResult({
      settings: {
        openTabs: [{ id: 'scene-tab', type: 'scene-composer' }],
        activeTabId: 'scene-tab',
        draftingMode: false,
      },
    });
    const snap = deserializeProjectData(data, []);
    expect(snap.primaryTabs.find(t => t.type === 'scene-composer')).toBeUndefined();
  });

  it('keeps a notecard-canvas tab (does not need a file/asset reference to stay valid)', () => {
    const data = makeResult({
      settings: {
        openTabs: [{ id: 'notecard-canvas', type: 'notecard-canvas' }],
        activeTabId: 'notecard-canvas',
        draftingMode: false,
      },
    });
    const snap = deserializeProjectData(data, []);
    expect(snap.primaryTabs).toContainEqual({ id: 'notecard-canvas', type: 'notecard-canvas' });
  });

  it('falls back to canvas tab when no settings', () => {
    const snap = deserializeProjectData(makeResult({ settings: null }), []);
    expect(snap.primaryTabs).toEqual([{ id: 'canvas', type: 'canvas' }]);
    expect(snap.primaryActiveTabId).toBe('canvas');
  });

  it('sets pending layout refresh flags from saved fingerprint data', () => {
    const data = makeResult({
      settings: {
        openTabs: [],
        activeTabId: 'canvas',
        draftingMode: false,
        storyBlockLayouts: { 'game/script.rpy': { position: { x: 0, y: 0 }, width: 320, height: 200 } },
        storyCanvasLayoutFingerprint: 'fp-abc',
        storyCanvasLayoutVersion: 3,
        storyCanvasLayoutWasUserAdjusted: true,
      },
    });
    const snap = deserializeProjectData(data, []);
    expect(snap.pendingStoryLayoutRefresh.hasSavedLayouts).toBe(true);
    expect(snap.pendingStoryLayoutRefresh.savedFingerprint).toBe('fp-abc');
    expect(snap.pendingStoryLayoutRefresh.savedVersion).toBe(3);
    expect(snap.pendingStoryLayoutRefresh.savedWasUserAdjusted).toBe(true);
  });

  it('preserves completedMilestones from saved settings', () => {
    const data = makeResult({
      settings: {
        openTabs: [],
        activeTabId: 'canvas',
        draftingMode: false,
        completedMilestones: ['first-block', 'scenes-10'],
      } as ProjectLoadResult['settings'],
    });
    const snap = deserializeProjectData(data, []);
    expect(snap.canvasSettings.completedMilestones).toEqual(['first-block', 'scenes-10']);
  });

  it('defaults completedMilestones to empty array when absent from settings', () => {
    const snap = deserializeProjectData(makeResult(), []);
    expect(snap.canvasSettings.completedMilestones).toEqual([]);
  });

  it('defaults completedMilestones to empty array when settings is null', () => {
    const snap = deserializeProjectData(makeResult({ settings: null }), []);
    expect(snap.canvasSettings.completedMilestones).toEqual([]);
  });

  it('returns empty scan paths when settings has no scanned directories', () => {
    const snap = deserializeProjectData(makeResult(), []);
    expect(snap.imageScanPaths).toEqual([]);
    expect(snap.audioScanPaths).toEqual([]);
  });

  it('passes through scanned paths from settings', () => {
    const data = makeResult({
      settings: {
        openTabs: [],
        activeTabId: 'canvas',
        draftingMode: false,
        scannedImagePaths: ['/external/images'],
        scannedAudioPaths: ['/external/audio'],
      },
    });
    const snap = deserializeProjectData(data, []);
    expect(snap.imageScanPaths).toEqual(['/external/images']);
    expect(snap.audioScanPaths).toEqual(['/external/audio']);
  });

  it('defaults notecards and notecardLinks to empty arrays when absent from settings', () => {
    const data = makeResult();
    const snap = deserializeProjectData(data, []);
    expect(snap.notecards).toEqual([]);
    expect(snap.notecardLinks).toEqual([]);
  });

  it('carries notecards and notecardLinks through when present in settings', () => {
    const card = createNotecard({ id: 'nc-1' });
    const link = createNotecardLink({ id: 'ncl-1', fromId: 'nc-1', toId: 'nc-2' });
    const data = makeResult();
    data.settings = { ...data.settings, notecards: [card], notecardLinks: [link] };
    const snap = deserializeProjectData(data, []);
    expect(snap.notecards).toEqual([card]);
    expect(snap.notecardLinks).toEqual([link]);
  });
});
