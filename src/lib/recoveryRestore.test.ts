import { describe, it, expect, vi } from 'vitest';
import { applyRecoverySnapshot } from '@/lib/recoveryRestore';
import type { RecoveryRestoreDeps } from '@/lib/recoveryRestore';
import type { Block, PendingRecovery, ProjectImage } from '@/types';
import { createBlock } from '@/test/mocks/sampleData';
import { installElectronAPI, createMockElectronAPI } from '@/test/mocks/electronAPI';

function makePending(over: Partial<PendingRecovery> = {}): PendingRecovery {
  return {
    sessionId: '11111111-1111-4111-8111-111111111111',
    projectRoot: '/proj',
    updatedAt: '2026-10-11T20:00:00.000Z',
    files: [
      { relativePath: 'game/script.rpy', content: 'recovered A', status: 'unchanged' },
      { relativePath: 'game/other.rpy', content: 'recovered B', status: 'changed' },
      { relativePath: 'game/gone.rpy', content: 'recovered C', status: 'deleted' },
    ],
    untitled: [{ id: 'u1', title: 'Untitled-1', content: 'draft' }],
    settings: { draftingMode: true, openTabs: [{ id: 'canvas', type: 'canvas' }], activeTabId: 'canvas', stickyNotes: [] },
    settingsStatus: 'unchanged',
    ...over,
  };
}

function makeDeps(blocks: Block[]) {
  const order: string[] = [];
  const setValue = vi.fn();
  const deps: RecoveryRestoreDeps = {
    rootPath: '/proj',
    tree: { name: 'proj', path: '', children: [] },
    blocksRef: { current: blocks },
    editorInstances: { current: new Map([['b1', { getModel: () => ({ getValue: () => 'old', setValue }) }]]) },
    images: new Map<string, ProjectImage>(),
    audios: new Map(),
    setBlocks: vi.fn(() => { order.push('blocks'); }),
    setDirtyBlockIds: vi.fn(),
    setHasUnsavedSettings: vi.fn(),
    createRecoveredUntitledFile: vi.fn(() => 'tab-x'),
    applySettingsSnapshot: vi.fn(() => { order.push('settings'); }),
  };
  return { deps, order, setValue };
}

const blocks = () => [
  createBlock({ id: 'b1', filePath: 'game/script.rpy', content: 'disk A' }),
  createBlock({ id: 'b2', filePath: 'game/other.rpy', content: 'disk B' }),
];

describe('applyRecoverySnapshot', () => {
  it('restores the selected items as unsaved changes, applying workspace changes first', () => {
    installElectronAPI(createMockElectronAPI());
    const api = window.electronAPI!;
    const { deps, order, setValue } = makeDeps(blocks());
    const result = applyRecoverySnapshot(makePending(), {
      files: ['game/script.rpy', 'game/other.rpy', 'game/gone.rpy'],
      untitled: ['u1'],
      settings: true,
    }, deps);

    expect(result).toEqual({ restored: 5, failures: [] });
    expect(order[0]).toBe('settings');
    expect(deps.setHasUnsavedSettings).toHaveBeenCalledWith(true);

    // apply every setBlocks updater in call order (layout merge, then per-file content)
    const blockUpdaters = (deps.setBlocks as ReturnType<typeof vi.fn>).mock.calls.map(c => c[0] as (b: Block[]) => Block[]);
    const updated = blockUpdaters.reduce((bs, u) => u(bs), blocks());
    expect(updated.find(b => b.id === 'b1')?.content).toBe('recovered A');
    expect(setValue).toHaveBeenCalledWith('recovered A');

    const dirtyUpdaters = (deps.setDirtyBlockIds as ReturnType<typeof vi.fn>).mock.calls.map(c => c[0] as (s: Set<string>) => Set<string>);
    const dirty = dirtyUpdaters.reduce((s, u) => u(s), new Set<string>());
    expect(dirty).toEqual(new Set(['b1', 'b2']));

    expect(deps.createRecoveredUntitledFile).toHaveBeenCalledWith('gone.rpy (recovered)', 'recovered C');
    expect(deps.createRecoveredUntitledFile).toHaveBeenCalledWith('Untitled-1', 'draft');

    // nothing is written to disk
    expect(api.writeFile).not.toHaveBeenCalled();
    expect(api.saveFiles).not.toHaveBeenCalled();
  });

  it('restores only what was selected', () => {
    const { deps } = makeDeps(blocks());
    const result = applyRecoverySnapshot(makePending(), { files: ['game/script.rpy'], untitled: [], settings: false }, deps);
    expect(result.restored).toBe(1);
    expect(deps.applySettingsSnapshot).not.toHaveBeenCalled();
    expect(deps.createRecoveredUntitledFile).not.toHaveBeenCalled();
  });

  it('restores a file whose block no longer exists as an untitled draft', () => {
    const { deps } = makeDeps([]);
    applyRecoverySnapshot(makePending(), { files: ['game/script.rpy'], untitled: [], settings: false }, deps);
    expect(deps.createRecoveredUntitledFile).toHaveBeenCalledWith('script.rpy (recovered)', 'recovered A');
  });

  it('collects per-item failures instead of aborting', () => {
    const { deps } = makeDeps(blocks());
    (deps.applySettingsSnapshot as ReturnType<typeof vi.fn>).mockImplementation(() => { throw new Error('bad settings'); });
    const result = applyRecoverySnapshot(makePending(), { files: ['game/script.rpy'], untitled: [], settings: true }, deps);
    expect(result.restored).toBe(1);
    expect(result.failures).toEqual([{ item: 'Workspace changes', error: 'bad settings' }]);
  });

  it('restores unsaved Project-canvas block layout (position, size, colour) with workspace changes', () => {
    const { deps } = makeDeps(blocks());
    const settings = {
      draftingMode: false, openTabs: [], activeTabId: 'canvas',
      storyBlockLayouts: { 'game/script.rpy': { position: { x: 999, y: 111 }, width: 400, height: 300, color: '#ff0000' } },
    };
    applyRecoverySnapshot(makePending({ settings: settings as never }), { files: [], untitled: [], settings: true }, deps);
    const updaters = (deps.setBlocks as ReturnType<typeof vi.fn>).mock.calls.map(c => c[0] as (b: Block[]) => Block[]);
    const result = updaters.reduce((bs, u) => u(bs), blocks());
    const b1 = result.find(b => b.id === 'b1')!;
    expect(b1.position).toEqual({ x: 999, y: 111 });
    expect([b1.width, b1.height, b1.color]).toEqual([400, 300, '#ff0000']);
    // a block with no saved layout keeps its current geometry, and content is untouched
    expect(result.find(b => b.id === 'b2')).toEqual(blocks()[1]);
    expect(b1.content).toBe('disk A');
  });

  it('relinks restored scene sprites to the live image objects', () => {
    const live: ProjectImage = { filePath: 'game/images/bg.png', fileName: 'bg.png', dataUrl: 'data:live', fileHandle: null, isInProject: false };
    const { deps } = makeDeps(blocks());
    deps.images = new Map([[live.filePath, live]]);
    const settings = {
      draftingMode: false, openTabs: [], activeTabId: 'canvas',
      sceneCompositions: { s1: { background: { id: 'bg', image: { filePath: 'game/images/bg.png' }, x: 0, y: 0, zoom: 1, zIndex: 0, flipH: false, flipV: false, rotation: 0, alpha: 1, blur: 0 }, sprites: [], resolution: { width: 1, height: 1 } } },
    };
    applyRecoverySnapshot(makePending({ settings: settings as never }), { files: [], untitled: [], settings: true }, deps);
    const snap = (deps.applySettingsSnapshot as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(snap.sceneCompositions.s1.background.image).toBe(live);
  });
});
