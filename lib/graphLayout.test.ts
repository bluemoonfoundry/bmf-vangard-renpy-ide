import {
  buildGraph,
  getConnectedComponents,
  computeLayeredLayoutGeneric,
  buildClustersGeneric,
  buildRouteGraph,
  type LayoutConfig,
  type LayoutNode,
  type LayoutEdge,
} from './graphLayout';
import type { LabelNode, RouteLink } from '../types';

const CONFIG: LayoutConfig = {
  paddingX: 150,
  paddingY: 50,
  componentSpacing: 200,
  clusterSpacingX: 220,
  clusterSpacingY: 180,
  defaultWidth: 120,
  defaultHeight: 120,
  crossAxisBase: 100,
};

const node = (id: string, w = 120, h = 120): LayoutNode => ({
  id, width: w, height: h, position: { x: 0, y: 0 },
});

const edge = (sourceId: string, targetId: string): LayoutEdge => ({ sourceId, targetId });

describe('buildGraph', () => {
  it('creates a graph with nodes and edges', () => {
    const graph = buildGraph([node('a'), node('b'), node('c')], [edge('a', 'b'), edge('b', 'c')]);
    expect(graph.order).toBe(3);
    expect(graph.size).toBe(2);
  });

  it('filters out edges referencing non-existent nodes', () => {
    const graph = buildGraph([node('a'), node('b')], [edge('a', 'b'), edge('b', 'missing')]);
    expect(graph.size).toBe(1);
  });

  it('handles duplicate edges between the same pair', () => {
    const graph = buildGraph([node('a'), node('b')], [edge('a', 'b'), edge('a', 'b')]);
    expect(graph.size).toBe(1);
  });
});

describe('getConnectedComponents', () => {
  it('identifies separate components', () => {
    const nodes = [node('a'), node('b'), node('c'), node('d')];
    const edges = [edge('a', 'b'), edge('c', 'd')];
    const components = getConnectedComponents(nodes, edges);
    expect(components).toHaveLength(2);
    const flat = components.map(c => c.sort());
    expect(flat).toContainEqual(['a', 'b']);
    expect(flat).toContainEqual(['c', 'd']);
  });

  it('returns single component for fully connected graph', () => {
    const nodes = [node('a'), node('b'), node('c')];
    const edges = [edge('a', 'b'), edge('b', 'c')];
    const components = getConnectedComponents(nodes, edges);
    expect(components).toHaveLength(1);
    expect(components[0].sort()).toEqual(['a', 'b', 'c']);
  });

  it('returns each isolated node as its own component', () => {
    const nodes = [node('a'), node('b'), node('c')];
    const components = getConnectedComponents(nodes, []);
    expect(components).toHaveLength(3);
  });
});

describe('computeLayeredLayoutGeneric', () => {
  it('returns empty array for empty input', () => {
    expect(computeLayeredLayoutGeneric([], [], 'lr', CONFIG)).toEqual([]);
  });

  it('produces left-to-right ordering for a linear chain', () => {
    const nodes = [node('a'), node('b'), node('c')];
    const edges = [edge('a', 'b'), edge('b', 'c')];
    const result = computeLayeredLayoutGeneric(nodes, edges, 'lr', CONFIG);
    const posA = result.find(n => n.id === 'a')!.position;
    const posB = result.find(n => n.id === 'b')!.position;
    const posC = result.find(n => n.id === 'c')!.position;
    expect(posB.x).toBeGreaterThan(posA.x);
    expect(posC.x).toBeGreaterThan(posB.x);
  });

  it('produces top-to-bottom ordering for a linear chain', () => {
    const nodes = [node('a'), node('b'), node('c')];
    const edges = [edge('a', 'b'), edge('b', 'c')];
    const result = computeLayeredLayoutGeneric(nodes, edges, 'td', CONFIG);
    const posA = result.find(n => n.id === 'a')!.position;
    const posB = result.find(n => n.id === 'b')!.position;
    expect(posB.y).toBeGreaterThan(posA.y);
  });

  it('handles cyclic graphs without crashing', () => {
    const nodes = [node('a'), node('b'), node('c')];
    const edges = [edge('a', 'b'), edge('b', 'c'), edge('c', 'a')];
    const result = computeLayeredLayoutGeneric(nodes, edges, 'lr', CONFIG);
    expect(result).toHaveLength(3);
    result.forEach(n => {
      expect(n.position.x).toBeDefined();
      expect(n.position.y).toBeDefined();
    });
  });

  it('places cycle nodes in distinct layers rather than collapsing them into one column', () => {
    // Simulates a story with a cross-stage backward edge:
    //   root → a → b → c → d (cycle back-edge: d → b)
    // Without progressive cycle-breaking, b/c/d all end up in the final "leftovers"
    // layer at the same X position, causing arrows from 'a' to appear to end in empty space.
    const nodes = [node('root'), node('a'), node('b'), node('c'), node('d')];
    const edges = [
      edge('root', 'a'), edge('a', 'b'), edge('b', 'c'), edge('c', 'd'),
      edge('d', 'b'), // back-edge creating the cycle
    ];
    const result = computeLayeredLayoutGeneric(nodes, edges, 'lr', CONFIG);
    expect(result).toHaveLength(5);

    const pos = Object.fromEntries(result.map(n => [n.id, n.position]));
    // root < a < b should hold — the narrative order is respected up to the cycle entry
    expect(pos['root'].x).toBeLessThan(pos['a'].x);
    expect(pos['a'].x).toBeLessThan(pos['b'].x);
    // b, c, d must be in distinct layers (distinct X positions)
    const xs = [pos['b'].x, pos['c'].x, pos['d'].x];
    expect(new Set(xs).size).toBe(3);
  });

  it('handles a chain with a mid-graph backward edge', () => {
    // Simulates: script → arrival → meet → choice → evening → stage2 → choice (back-edge)
    const nodes = ['script', 'arrival', 'meet', 'choice', 'evening', 'stage2'].map(id => node(id));
    const edges = [
      edge('script', 'arrival'), edge('arrival', 'meet'), edge('meet', 'choice'),
      edge('choice', 'evening'), edge('evening', 'stage2'),
      edge('stage2', 'choice'), // cross-stage back-edge
    ];
    const result = computeLayeredLayoutGeneric(nodes, edges, 'lr', CONFIG);
    expect(result).toHaveLength(6);
    const pos = Object.fromEntries(result.map(n => [n.id, n.position]));
    // Nodes before the cycle entry must be in strictly ascending X order
    expect(pos['script'].x).toBeLessThan(pos['arrival'].x);
    expect(pos['arrival'].x).toBeLessThan(pos['meet'].x);
    // All nodes must have distinct X positions (no two nodes collapsed into one column)
    const allX = Object.values(pos).map(p => p.x);
    expect(new Set(allX).size).toBe(6);
  });

  it('handles disconnected components', () => {
    const nodes = [node('a'), node('b'), node('c'), node('d')];
    const edges = [edge('a', 'b'), edge('c', 'd')];
    const result = computeLayeredLayoutGeneric(nodes, edges, 'lr', CONFIG);
    expect(result).toHaveLength(4);
    result.forEach(n => {
      expect(n.position.x).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('buildClustersGeneric', () => {
  it('returns one cluster per node for none grouping', () => {
    const nodes = [node('a'), node('b')];
    const clusters = buildClustersGeneric(nodes, [], 'none' as never, () => null);
    expect(clusters).toHaveLength(2);
    expect(clusters[0].nodeIds).toEqual(['a']);
    expect(clusters[1].nodeIds).toEqual(['b']);
  });

  it('groups by connected component', () => {
    const nodes = [node('a'), node('b'), node('c')];
    const edges = [edge('a', 'b')];
    const clusters = buildClustersGeneric(nodes, edges, 'connected-component', () => null);
    expect(clusters).toHaveLength(2);
  });

  it('groups by filename prefix', () => {
    const nodes = [node('ep01_a'), node('ep01_b'), node('ep02_a')];
    const prefixExtractor = (n: LayoutNode) => n.id.startsWith('ep01') ? 'ep01' : n.id.startsWith('ep02') ? 'ep02' : null;
    const clusters = buildClustersGeneric(nodes, [], 'filename-prefix', prefixExtractor);
    const ep01 = clusters.find(c => c.id === 'ep01');
    expect(ep01).toBeDefined();
    expect(ep01!.nodeIds.sort()).toEqual(['ep01_a', 'ep01_b']);
  });
});

describe('buildRouteGraph', () => {
  const createLabelNode = (id: string, blockId: string, label: string): LabelNode => ({
    id, label, blockId, startLine: 1, position: { x: 0, y: 0 }, width: 180, height: 40,
  });

  it('identifies start nodes (zero in-degree)', () => {
    const labelNodes = new Map<string, LabelNode>();
    labelNodes.set('b1:start', createLabelNode('b1:start', 'b1', 'start'));
    labelNodes.set('b1:end', createLabelNode('b1:end', 'b1', 'end'));

    const routeLinks: RouteLink[] = [
      { id: 'r1', sourceId: 'b1:start', targetId: 'b1:end', type: 'jump' },
    ];
    const labels = {
      start: { blockId: 'b1', label: 'start', line: 1, column: 1, type: 'label' },
      end: { blockId: 'b1', label: 'end', line: 5, column: 1, type: 'label' },
    };
    const blockLabelInfo = new Map<string, { label: string; startLine: number; endLine: number; hasTerminal: boolean; hasReturn: boolean }[]>();
    blockLabelInfo.set('b1', [
      { label: 'start', startLine: 1, endLine: 4, hasTerminal: true, hasReturn: false },
      { label: 'end', startLine: 5, endLine: 8, hasTerminal: false, hasReturn: false },
    ]);

    const result = buildRouteGraph(labelNodes, routeLinks, labels, blockLabelInfo);
    expect(result.startNodes).toContain('b1:start');
    expect(result.endNodes.has('b1:end')).toBe(true);
  });

  it('returns empty start/end sets for empty input', () => {
    const result = buildRouteGraph(new Map(), [], {}, new Map());
    expect(result.startNodes).toEqual([]);
    expect(result.endNodes.size).toBe(0);
  });
});
