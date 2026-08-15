import { describe, it, expect } from 'vitest';
import {
  computeRouteCanvasLayout,
  computeRouteCanvasLayoutFingerprint,
  getRouteCanvasLayoutVersion,
} from './routeCanvasLayout';
import type { LabelNode, RouteLink } from '@/types';

const createNode = (id: string, containerName: string): LabelNode => ({
  id,
  label: id,
  blockId: containerName,
  containerName,
  startLine: 1,
  position: { x: 0, y: 0 },
  width: 220,
  height: 110,
});

// ── computeRouteCanvasLayout ─────────────────────────────────────────────────

describe('routeCanvasLayout', () => {
  it('changes orientation between left-right and top-down', () => {
    const nodes = [createNode('a', 'ep01_a.rpy'), createNode('b', 'ep01_b.rpy')];
    const links: RouteLink[] = [{ id: 'ab', sourceId: 'a', targetId: 'b', type: 'jump' }];

    const leftRight = computeRouteCanvasLayout(nodes, links, 'flow-lr', 'none');
    const topDown = computeRouteCanvasLayout(nodes, links, 'flow-td', 'none');

    expect(leftRight[1].position.x).toBeGreaterThan(leftRight[0].position.x);
    expect(topDown[1].position.y).toBeGreaterThan(topDown[0].position.y);
  });

  it('returns empty array for empty node list', () => {
    const result = computeRouteCanvasLayout([], [], 'flow-lr', 'none');
    expect(result).toEqual([]);
  });

  it('returns single node with a position for a solo node', () => {
    const nodes = [createNode('solo', 'script.rpy')];
    const result = computeRouteCanvasLayout(nodes, [], 'flow-lr', 'none');
    expect(result).toHaveLength(1);
    expect(result[0].position).toBeDefined();
  });

  it('flow-lr mode places node B to the right of node A', () => {
    const nodes = [createNode('a', 'start.rpy'), createNode('b', 'end.rpy')];
    const links: RouteLink[] = [{ id: 'ab', sourceId: 'a', targetId: 'b', type: 'jump' }];

    const result = computeRouteCanvasLayout(nodes, links, 'flow-lr', 'none');
    const a = result.find(n => n.id === 'a')!;
    const b = result.find(n => n.id === 'b')!;

    expect(b.position.x).toBeGreaterThan(a.position.x);
  });

  it('flow-td mode places node B below node A', () => {
    const nodes = [createNode('a', 'start.rpy'), createNode('b', 'end.rpy')];
    const links: RouteLink[] = [{ id: 'ab', sourceId: 'a', targetId: 'b', type: 'jump' }];

    const result = computeRouteCanvasLayout(nodes, links, 'flow-td', 'none');
    const a = result.find(n => n.id === 'a')!;
    const b = result.find(n => n.id === 'b')!;

    expect(b.position.y).toBeGreaterThan(a.position.y);
  });

  it('connected-components mode handles a disconnected graph', () => {
    // Two pairs with no edges between them
    const nodes = [
      createNode('a', 'script.rpy'),
      createNode('b', 'script.rpy'),
      createNode('c', 'other.rpy'),
      createNode('d', 'other.rpy'),
    ];
    const links: RouteLink[] = [
      { id: 'ab', sourceId: 'a', targetId: 'b', type: 'jump' },
      { id: 'cd', sourceId: 'c', targetId: 'd', type: 'jump' },
    ];

    const result = computeRouteCanvasLayout(nodes, links, 'connected-components', 'none');
    expect(result).toHaveLength(4);
    // All nodes receive positions
    for (const node of result) {
      expect(node.position).toBeDefined();
    }
  });

  it('connected-components mode with no edges still positions all nodes', () => {
    const nodes = [createNode('x', 'x.rpy'), createNode('y', 'y.rpy'), createNode('z', 'z.rpy')];
    const result = computeRouteCanvasLayout(nodes, [], 'connected-components', 'none');
    expect(result).toHaveLength(3);
  });

  it('clustered-flow with filename-prefix grouping clusters episode nodes together', () => {
    const nodes = [
      createNode('intro', 'ep01_intro.rpy'),
      createNode('end', 'ep01_end.rpy'),
      createNode('other', 'ep02_start.rpy'),
    ];
    const links: RouteLink[] = [
      { id: 'ie', sourceId: 'intro', targetId: 'end', type: 'jump' },
      { id: 'eo', sourceId: 'end', targetId: 'other', type: 'jump' },
    ];

    const result = computeRouteCanvasLayout(nodes, links, 'clustered-flow', 'filename-prefix');
    expect(result).toHaveLength(3);

    // ep01 nodes should be close together relative to ep02 node
    const introNode = result.find(n => n.id === 'intro')!;
    const endNode = result.find(n => n.id === 'end')!;
    const otherNode = result.find(n => n.id === 'other')!;

    const intraClusterDistance = Math.abs(introNode.position.y - endNode.position.y);
    const crossClusterDistance = Math.abs(introNode.position.x - otherNode.position.x);

    expect(intraClusterDistance).toBeLessThan(crossClusterDistance);
  });

  it('clustered-flow with connected-component grouping returns all nodes', () => {
    const nodes = [
      createNode('a', 'route_luna.rpy'),
      createNode('b', 'route_luna.rpy'),
      createNode('c', 'route_bad.rpy'),
    ];
    const links: RouteLink[] = [{ id: 'ab', sourceId: 'a', targetId: 'b', type: 'jump' }];

    const result = computeRouteCanvasLayout(nodes, links, 'clustered-flow', 'connected-component');
    expect(result).toHaveLength(3);
  });

  it('clustered-flow with grouping mode "none" falls back to connected-component strategy', () => {
    const nodes = [createNode('a', 'a.rpy'), createNode('b', 'b.rpy')];
    const links: RouteLink[] = [{ id: 'ab', sourceId: 'a', targetId: 'b', type: 'jump' }];

    // Should not throw — 'none' is mapped to 'connected-component' internally
    const result = computeRouteCanvasLayout(nodes, links, 'clustered-flow', 'none');
    expect(result).toHaveLength(2);
  });

  it('unknown/default layout mode falls back to flow-lr', () => {
    const nodes = [createNode('a', 'a.rpy'), createNode('b', 'b.rpy')];
    const links: RouteLink[] = [{ id: 'ab', sourceId: 'a', targetId: 'b', type: 'jump' }];

    // Cast to bypass TS — simulates an unexpected value reaching the switch default
    const result = computeRouteCanvasLayout(
      nodes,
      links,
      'unknown-mode' as 'flow-lr',
      'none',
    );
    const a = result.find(n => n.id === 'a')!;
    const b = result.find(n => n.id === 'b')!;

    expect(b.position.x).toBeGreaterThan(a.position.x);
  });
});

// ── computeRouteCanvasLayoutFingerprint ──────────────────────────────────────

describe('computeRouteCanvasLayoutFingerprint', () => {
  it('changes fingerprint when route layout settings change', () => {
    const nodes = [createNode('a', 'ep01_a.rpy'), createNode('b', 'ep01_b.rpy')];
    const links: RouteLink[] = [{ id: 'ab', sourceId: 'a', targetId: 'b', type: 'jump' }];

    const base = computeRouteCanvasLayoutFingerprint(nodes, links, 'flow-lr', 'none');
    const changedGrouping = computeRouteCanvasLayoutFingerprint(nodes, links, 'clustered-flow', 'filename-prefix');

    expect(changedGrouping).not.toBe(base);
  });

  it('changes fingerprint when an edge is added', () => {
    const nodes = [createNode('a', 'a.rpy'), createNode('b', 'b.rpy')];
    const noLinks: RouteLink[] = [];
    const oneLink: RouteLink[] = [{ id: 'ab', sourceId: 'a', targetId: 'b', type: 'jump' }];

    const without = computeRouteCanvasLayoutFingerprint(nodes, noLinks, 'flow-lr', 'none');
    const with_ = computeRouteCanvasLayoutFingerprint(nodes, oneLink, 'flow-lr', 'none');

    expect(with_).not.toBe(without);
  });

  it('changes fingerprint when node dimensions change', () => {
    const nodes = [createNode('a', 'a.rpy')];
    const wideNode: LabelNode[] = [{ ...nodes[0], width: 400 }];

    const fp1 = computeRouteCanvasLayoutFingerprint(nodes, [], 'flow-lr', 'none');
    const fp2 = computeRouteCanvasLayoutFingerprint(wideNode, [], 'flow-lr', 'none');

    expect(fp2).not.toBe(fp1);
  });

  it('changes fingerprint when containerName changes', () => {
    const nodeA = createNode('a', 'ep01.rpy');
    const nodeB = createNode('a', 'ep02.rpy'); // same id, different container

    const fp1 = computeRouteCanvasLayoutFingerprint([nodeA], [], 'flow-lr', 'none');
    const fp2 = computeRouteCanvasLayoutFingerprint([nodeB], [], 'flow-lr', 'none');

    expect(fp2).not.toBe(fp1);
  });

  it('fingerprint is stable — same inputs produce the same string', () => {
    const nodes = [createNode('a', 'ep01.rpy'), createNode('b', 'ep02.rpy')];
    const links: RouteLink[] = [{ id: 'ab', sourceId: 'a', targetId: 'b', type: 'call' }];

    const fp1 = computeRouteCanvasLayoutFingerprint(nodes, links, 'flow-td', 'connected-component');
    const fp2 = computeRouteCanvasLayoutFingerprint(nodes, links, 'flow-td', 'connected-component');

    expect(fp1).toBe(fp2);
  });

  it('produces the same fingerprint across sessions even though node/block IDs are regenerated on every load', () => {
    // Production LabelNode ids/blockIds are `${block.id}:${label}` composites,
    // and block.id is re-minted every session (see storyCanvasLayout's
    // equivalent regression test). containerName/label stay stable across
    // sessions -- the fingerprint must key off those, not the raw id, or it
    // falsely reports "the route graph changed" on every project open.
    const makeNode = (blockId: string, label: string, containerName: string): LabelNode => ({
      id: `${blockId}:${label}`, label, blockId, containerName,
      startLine: 1, position: { x: 0, y: 0 }, width: 220, height: 110,
    });

    const sessionOneNodes = [makeNode('block-0-1000', 'start', 'script.rpy'), makeNode('block-1-1000', 'end', 'scene.rpy')];
    const sessionOneLinks: RouteLink[] = [{ id: 'l1', sourceId: 'block-0-1000:start', targetId: 'block-1-1000:end', type: 'jump' }];

    const sessionTwoNodes = [makeNode('block-0-999999', 'start', 'script.rpy'), makeNode('block-1-999999', 'end', 'scene.rpy')];
    const sessionTwoLinks: RouteLink[] = [{ id: 'l1', sourceId: 'block-0-999999:start', targetId: 'block-1-999999:end', type: 'jump' }];

    const fp1 = computeRouteCanvasLayoutFingerprint(sessionOneNodes, sessionOneLinks, 'flow-lr', 'none');
    const fp2 = computeRouteCanvasLayoutFingerprint(sessionTwoNodes, sessionTwoLinks, 'flow-lr', 'none');

    expect(fp2).toBe(fp1);
  });

  it('fingerprint includes the layout version', () => {
    const fp = computeRouteCanvasLayoutFingerprint([], [], 'flow-lr', 'none');
    expect(fp).toMatch(/^v\d+;/);
  });

  it('fingerprint encodes mode and grouping', () => {
    const fp = computeRouteCanvasLayoutFingerprint([], [], 'flow-td', 'filename-prefix');
    expect(fp).toContain('mode=flow-td');
    expect(fp).toContain('group=filename-prefix');
  });

  it('returns empty-node fingerprint for no nodes', () => {
    const fp = computeRouteCanvasLayoutFingerprint([], [], 'flow-lr', 'none');
    expect(fp).toContain('nodes=');
    expect(typeof fp).toBe('string');
  });
});

// ── getRouteCanvasLayoutVersion ───────────────────────────────────────────────

describe('getRouteCanvasLayoutVersion', () => {
  it('returns a positive integer', () => {
    const version = getRouteCanvasLayoutVersion();
    expect(typeof version).toBe('number');
    expect(Number.isInteger(version)).toBe(true);
    expect(version).toBeGreaterThan(0);
  });
});
