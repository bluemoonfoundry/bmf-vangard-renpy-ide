import { buildSavedStoryBlockLayouts, computeStoryLayout, computeStoryLayoutFingerprint, getStoryLayoutVersion } from './storyCanvasLayout';
import type { Block, Link } from '@/types';

const createBlock = (id: string, filePath: string): Block => ({
  id,
  filePath,
  content: '',
  position: { x: 0, y: 0 },
  width: 320,
  height: 180,
  title: filePath,
});

describe('storyCanvasLayout', () => {
  it('changes the primary flow direction between left-right and top-down', () => {
    const blocks = [
      createBlock('a', 'game/ep01_start.rpy'),
      createBlock('b', 'game/ep01_branch.rpy'),
      createBlock('c', 'game/ep01_end.rpy'),
    ];
    const links: Link[] = [
      { sourceId: 'a', targetId: 'b', targetLabel: 'b', type: 'jump' },
      { sourceId: 'b', targetId: 'c', targetLabel: 'c', type: 'jump' },
    ];

    const leftRight = computeStoryLayout(blocks, links, 'flow-lr', 'none');
    const topDown = computeStoryLayout(blocks, links, 'flow-td', 'none');

    expect(leftRight[1].position.x).toBeGreaterThan(leftRight[0].position.x);
    expect(topDown[1].position.y).toBeGreaterThan(topDown[0].position.y);
  });

  it('uses filename-prefix grouping when clustered flow is selected', () => {
    const blocks = [
      createBlock('a', 'game/ep01_intro.rpy'),
      createBlock('b', 'game/ep01_route.rpy'),
      createBlock('c', 'game/ep02_intro.rpy'),
    ];
    const links: Link[] = [
      { sourceId: 'a', targetId: 'b', targetLabel: 'b', type: 'jump' },
      { sourceId: 'b', targetId: 'c', targetLabel: 'c', type: 'jump' },
    ];

    const clustered = computeStoryLayout(blocks, links, 'clustered-flow', 'filename-prefix');
    const ep01A = clustered.find(block => block.id === 'a')!;
    const ep01B = clustered.find(block => block.id === 'b')!;
    const ep02 = clustered.find(block => block.id === 'c')!;

    expect(Math.abs(ep01A.position.y - ep01B.position.y)).toBeLessThan(250);
    expect(ep02.position.x).toBeGreaterThan(ep01A.position.x);
  });

  it('changes the fingerprint when graph structure or layout mode changes', () => {
    const blocks = [createBlock('a', 'game/script.rpy'), createBlock('b', 'game/scene.rpy')];
    const noLinks: Link[] = [];
    const oneLink: Link[] = [{ sourceId: 'a', targetId: 'b', targetLabel: 'b', type: 'jump' }];

    const base = computeStoryLayoutFingerprint(blocks, noLinks, 'flow-lr', 'none');
    const changedLinks = computeStoryLayoutFingerprint(blocks, oneLink, 'flow-lr', 'none');
    const changedMode = computeStoryLayoutFingerprint(blocks, noLinks, 'flow-td', 'none');

    expect(changedLinks).not.toBe(base);
    expect(changedMode).not.toBe(base);
  });

  it('produces the same fingerprint across sessions even though block IDs are regenerated on every load', () => {
    // deserializeProjectData mints a fresh `block-${index}-${Date.now()}` id for
    // every block whenever there's no matching in-memory block to reuse an id
    // from (i.e. every fresh app launch / project open). If the fingerprint
    // baked those volatile ids into its link part, it would never match the
    // fingerprint saved in a *previous* session -- falsely flagging "the story
    // graph changed" and marking the project dirty on every single open, even
    // with zero real changes. See bmf-vangard-renpy-ide-6o47 follow-up.
    const sessionOneBlocks = [createBlock('block-0-1000', 'game/script.rpy'), createBlock('block-1-1000', 'game/scene.rpy')];
    const sessionOneLinks: Link[] = [{ sourceId: 'block-0-1000', targetId: 'block-1-1000', targetLabel: 'scene', type: 'jump' }];

    const sessionTwoBlocks = [createBlock('block-0-9999999', 'game/script.rpy'), createBlock('block-1-9999999', 'game/scene.rpy')];
    const sessionTwoLinks: Link[] = [{ sourceId: 'block-0-9999999', targetId: 'block-1-9999999', targetLabel: 'scene', type: 'jump' }];

    const fingerprintOne = computeStoryLayoutFingerprint(sessionOneBlocks, sessionOneLinks, 'flow-lr', 'none');
    const fingerprintTwo = computeStoryLayoutFingerprint(sessionTwoBlocks, sessionTwoLinks, 'flow-lr', 'none');

    expect(fingerprintTwo).toBe(fingerprintOne);
  });

  it('builds saved layouts only for file-backed blocks', () => {
    const blocks = [createBlock('a', 'game/script.rpy'), { ...createBlock('b', 'game/temp.rpy'), filePath: undefined }];

    const savedLayouts = buildSavedStoryBlockLayouts(blocks);

    expect(Object.keys(savedLayouts)).toEqual(['game/script.rpy']);
    expect(savedLayouts['game/script.rpy']?.position).toEqual({ x: 0, y: 0 });
  });

  it('preserves block color in saved layouts', () => {
    const block = { ...createBlock('a', 'game/script.rpy'), color: '#ff0000' };
    const savedLayouts = buildSavedStoryBlockLayouts([block]);
    expect(savedLayouts['game/script.rpy']?.color).toBe('#ff0000');
  });

  it('lays out blocks with connected-components mode', () => {
    const blocks = [
      createBlock('a', 'game/script.rpy'),
      createBlock('b', 'game/scene.rpy'),
    ];
    const links: Link[] = [{ sourceId: 'a', targetId: 'b', targetLabel: 'b', type: 'jump' }];

    const result = computeStoryLayout(blocks, links, 'connected-components', 'none');

    expect(result).toHaveLength(2);
    const a = result.find(b => b.id === 'a')!;
    const bBlock = result.find(b => b.id === 'b')!;
    expect(bBlock.position.x).toBeGreaterThan(a.position.x);
  });

  it('uses connected-component grouping when clustered-flow mode has none grouping', () => {
    const blocks = [
      createBlock('a', 'game/standalone.rpy'),
      createBlock('b', 'game/other.rpy'),
    ];
    const links: Link[] = [{ sourceId: 'a', targetId: 'b', targetLabel: 'b', type: 'jump' }];

    const result = computeStoryLayout(blocks, links, 'clustered-flow', 'none');

    expect(result).toHaveLength(2);
  });

  it('falls back to flat layout when all filename-prefix clusters are singletons', () => {
    // standalone.rpy, other.rpy, third.rpy have no matching prefix pattern
    const blocks = [
      createBlock('a', 'game/standalone.rpy'),
      createBlock('b', 'game/other.rpy'),
      createBlock('c', 'game/third.rpy'),
    ];
    const links: Link[] = [
      { sourceId: 'a', targetId: 'b', targetLabel: 'b', type: 'jump' },
      { sourceId: 'b', targetId: 'c', targetLabel: 'c', type: 'jump' },
    ];

    const clustered = computeStoryLayout(blocks, links, 'clustered-flow', 'filename-prefix');
    const flowLr = computeStoryLayout(blocks, links, 'flow-lr', 'none');

    expect(clustered).toHaveLength(3);
    // singleton fallback produces same positions as flow-lr
    clustered.forEach(block => {
      const lr = flowLr.find(b => b.id === block.id)!;
      expect(block.position).toEqual(lr.position);
    });
  });

  it('groups route-prefixed blocks into the same cluster', () => {
    // route_luna_intro and route_luna_end both extract prefix "route_luna"
    const blocks = [
      createBlock('a', 'game/route_luna_intro.rpy'),
      createBlock('b', 'game/route_luna_end.rpy'),
      createBlock('c', 'game/route_bad_intro.rpy'),
    ];
    const links: Link[] = [{ sourceId: 'a', targetId: 'b', targetLabel: 'b', type: 'jump' }];

    const result = computeStoryLayout(blocks, links, 'clustered-flow', 'filename-prefix');

    expect(result).toHaveLength(3);
    const a = result.find(b => b.id === 'a')!;
    const bBlock = result.find(b => b.id === 'b')!;
    // a and b share the route_luna cluster — should be vertically close
    expect(Math.abs(a.position.y - bBlock.position.y)).toBeLessThan(400);
  });

  it('groups numeric-leading-prefixed blocks into the same cluster', () => {
    // 01_intro and 01_end both extract prefix "n_01"
    const blocks = [
      createBlock('a', 'game/01_intro.rpy'),
      createBlock('b', 'game/01_end.rpy'),
      createBlock('c', 'game/02_start.rpy'),
    ];
    const links: Link[] = [
      { sourceId: 'a', targetId: 'b', targetLabel: 'b', type: 'jump' },
      { sourceId: 'b', targetId: 'c', targetLabel: 'c', type: 'jump' },
    ];

    const result = computeStoryLayout(blocks, links, 'clustered-flow', 'filename-prefix');

    expect(result).toHaveLength(3);
    const a = result.find(b => b.id === 'a')!;
    const bBlock = result.find(b => b.id === 'b')!;
    expect(Math.abs(a.position.y - bBlock.position.y)).toBeLessThan(400);
  });

  it('groups generic word+number prefixed blocks into the same cluster', () => {
    // intro1_scene and intro1_end both extract prefix "intro1"
    const blocks = [
      createBlock('a', 'game/intro1_scene.rpy'),
      createBlock('b', 'game/intro1_end.rpy'),
      createBlock('c', 'game/outro2_start.rpy'),
    ];
    const links: Link[] = [{ sourceId: 'a', targetId: 'b', targetLabel: 'b', type: 'jump' }];

    const result = computeStoryLayout(blocks, links, 'clustered-flow', 'filename-prefix');

    expect(result).toHaveLength(3);
  });

  it('handles empty blocks array across all layout modes', () => {
    expect(computeStoryLayout([], [], 'flow-lr', 'none')).toEqual([]);
    expect(computeStoryLayout([], [], 'flow-td', 'none')).toEqual([]);
    expect(computeStoryLayout([], [], 'connected-components', 'none')).toEqual([]);
    expect(computeStoryLayout([], [], 'clustered-flow', 'filename-prefix')).toEqual([]);
  });

  it('handles a single block', () => {
    const blocks = [createBlock('a', 'game/script.rpy')];
    const result = computeStoryLayout(blocks, [], 'flow-lr', 'none');
    expect(result).toHaveLength(1);
  });

  it('uses block id in fingerprint when filePath is absent', () => {
    const block = { ...createBlock('a', 'game/script.rpy'), filePath: undefined };
    const fp = computeStoryLayoutFingerprint([block], [], 'flow-lr', 'none');
    expect(fp).toContain('a:');
  });
});

describe('getStoryLayoutVersion', () => {
  it('returns a positive integer', () => {
    const version = getStoryLayoutVersion();
    expect(Number.isInteger(version)).toBe(true);
    expect(version).toBeGreaterThan(0);
  });
});
