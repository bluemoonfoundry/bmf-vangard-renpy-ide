import DirectedGraph from 'graphology';
import { connectedComponents } from 'graphology-components';
import { topologicalGenerations } from 'graphology-dag';
import type { LabelNode, Position, RouteLink, StoryCanvasGroupingMode } from '@/types';

export interface LayoutNode {
  id: string;
  width: number;
  height: number;
  position: Position;
}

export interface LayoutEdge {
  sourceId: string;
  targetId: string;
}

export interface LayoutCluster {
  id: string;
  nodeIds: string[];
}

export interface LayoutConfig {
  paddingX: number;
  paddingY: number;
  componentSpacing: number;
  clusterSpacingX: number;
  clusterSpacingY: number;
  defaultWidth: number;
  defaultHeight: number;
  /** Y-offset for cross-axis normalisation. Story canvas uses 100, route canvas uses 100. */
  crossAxisBase: number;
}

/**
 * Build a directed graphology graph from nodes and edges,
 * filtering out edges that reference non-existent nodes.
 */
export function buildGraph<N extends LayoutNode, E extends LayoutEdge>(
  nodes: N[],
  edges: E[],
): DirectedGraph {
  const graph = new DirectedGraph();
  const nodeIds = new Set<string>();

  nodes.forEach(node => {
    graph.addNode(node.id);
    nodeIds.add(node.id);
  });

  edges.forEach(edge => {
    if (!nodeIds.has(edge.sourceId) || !nodeIds.has(edge.targetId)) return;
    // Avoid duplicate edges (graphology throws on duplicate directed edge between same pair)
    if (!graph.hasDirectedEdge(edge.sourceId, edge.targetId)) {
      graph.addDirectedEdge(edge.sourceId, edge.targetId);
    }
  });

  return graph;
}

/**
 * Get connected components using graphology-components.
 * Returns arrays of node id arrays, preserving the order of input nodes.
 */
export function getConnectedComponents<N extends LayoutNode, E extends LayoutEdge>(
  nodes: N[],
  edges: E[],
): string[][] {
  const graph = buildGraph(nodes, edges);
  return connectedComponents(graph);
}

/**
 * Compute a Sugiyama-style layered layout for a set of nodes and edges.
 * Handles disconnected components and cyclic graphs.
 */
export function computeLayeredLayoutGeneric<N extends LayoutNode>(
  nodes: N[],
  edges: LayoutEdge[],
  direction: 'lr' | 'td',
  config: LayoutConfig,
): N[] {
  if (nodes.length === 0) return [];

  const { paddingX, paddingY, componentSpacing, defaultWidth, defaultHeight, crossAxisBase } = config;
  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  const graph = buildGraph(nodes, edges);

  // Get connected components using graphology
  const components = connectedComponents(graph);
  const finalPositions = new Map<string, Position>();
  let currentOffsetPrimary = 0;

  components.forEach(componentNodeIds => {
    const componentNodeSet = new Set(componentNodeIds);

    // Try topological generations first; fall back to BFS on cycles
    let layers: string[][];
    try {
      // Build a subgraph for this component for topologicalGenerations
      const subgraph = new DirectedGraph();
      componentNodeIds.forEach(id => subgraph.addNode(id));
      graph.forEachEdge((_edge, _attrs, source, target) => {
        if (componentNodeSet.has(source) && componentNodeSet.has(target)) {
          if (!subgraph.hasDirectedEdge(source, target)) {
            subgraph.addDirectedEdge(source, target);
          }
        }
      });

      layers = topologicalGenerations(subgraph);
    } catch {
      // Cyclic component — fall back to BFS layer assignment
      layers = bfsLayers(componentNodeIds, graph, componentNodeSet);
    }

    let layerPrimary = 0;
    layers.forEach(layer => {
      let maxCrossSize = 0;
      let totalCrossSize = 0;

      layer.forEach(id => {
        const node = nodeMap.get(id);
        if (!node) return;
        const primarySize = direction === 'lr' ? node.width : node.height;
        const crossSize = direction === 'lr' ? node.height : node.width;
        maxCrossSize = Math.max(maxCrossSize, primarySize);
        totalCrossSize += crossSize;
      });

      totalCrossSize += (layer.length - 1) * paddingY;
      let currentCross = -totalCrossSize / 2;

      layer.forEach(id => {
        const node = nodeMap.get(id);
        if (!node) return;

        const primarySize = direction === 'lr' ? node.width : node.height;
        const crossSize = direction === 'lr' ? node.height : node.width;
        const primary = currentOffsetPrimary + layerPrimary + (maxCrossSize - primarySize) / 2;
        const cross = currentCross + crossAxisBase;

        finalPositions.set(id, direction === 'lr'
          ? { x: primary, y: cross }
          : { x: cross, y: primary });

        currentCross += crossSize + paddingY;
      });

      layerPrimary += maxCrossSize + paddingX;
    });

    const componentPrimary = Math.max(layerPrimary - paddingX, direction === 'lr' ? defaultWidth : defaultHeight);
    currentOffsetPrimary += componentPrimary + componentSpacing;
  });

  // Normalise cross-axis positions
  if (finalPositions.size > 0) {
    let minCross = Infinity;
    finalPositions.forEach(position => {
      const cross = direction === 'lr' ? position.y : position.x;
      minCross = Math.min(minCross, cross);
    });
    const shift = crossAxisBase - minCross;
    finalPositions.forEach(position => {
      if (direction === 'lr') position.y += shift;
      else position.x += shift;
    });
  }

  return nodes.map(node => ({
    ...node,
    position: finalPositions.get(node.id) ?? node.position,
  }));
}

/**
 * BFS-based layer assignment for cyclic components.
 *
 * Uses progressive cycle-breaking: when the BFS queue empties but unvisited nodes
 * remain (a cycle has stalled progress), we re-seed from the unvisited node with the
 * minimum accumulated in-degree. That node is the best cycle-break point because it
 * has the fewest unprocessed predecessors, so it violates the fewest ordering
 * constraints. This repeats until every node is placed, producing a layout where
 * back-edges are rendered as left-pointing arrows rather than dumping all cycle
 * participants into a single crowded column.
 *
 * Complexity: O(V² + E) worst case (rare deep nesting of cycles);
 *             O(V + E) for typical story graphs with a small number of back-edges.
 */
function bfsLayers(
  componentNodeIds: string[],
  graph: DirectedGraph,
  componentNodeSet: Set<string>,
): string[][] {
  const inDegree = new Map<string, number>();

  componentNodeIds.forEach(id => {
    let degree = 0;
    graph.forEachInEdge(id, (_edge, _attrs, source) => {
      if (componentNodeSet.has(source)) degree++;
    });
    inDegree.set(id, degree);
  });

  const visited = new Set<string>();
  const layers: string[][] = [];
  const queue: string[] = [];

  // Seed with zero in-degree nodes; fall back to first node for pure cycles.
  componentNodeIds.forEach(id => { if ((inDegree.get(id) ?? 0) === 0) queue.push(id); });
  if (queue.length === 0 && componentNodeIds.length > 0) queue.push(componentNodeIds[0]);

  while (visited.size < componentNodeIds.length) {
    // Queue exhausted but unvisited nodes remain — a cycle has stalled the BFS.
    // Break it by seeding from the unvisited node with the minimum in-degree:
    // that node has the most predecessors already placed, so it is the least
    // disruptive cut point in the cycle.
    if (queue.length === 0) {
      let minDeg = Infinity;
      let seed = '';
      for (const id of componentNodeIds) {
        if (visited.has(id)) continue;
        const deg = inDegree.get(id) ?? 0;
        if (deg < minDeg) { minDeg = deg; seed = id; }
      }
      if (seed) queue.push(seed);
    }

    if (queue.length === 0) break; // Defensive: all nodes already visited.

    const layerSize = queue.length;
    const currentLayer: string[] = [];

    for (let i = 0; i < layerSize; i++) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);
      currentLayer.push(current);

      graph.forEachOutEdge(current, (_edge, _attrs, _source, target) => {
        // Skip edges that leave the component or point back to already-placed nodes
        // (back-edges in the cycle); they are still drawn as arrows but ignored for
        // layer assignment.
        if (!componentNodeSet.has(target) || visited.has(target)) return;
        inDegree.set(target, (inDegree.get(target) ?? 1) - 1);
        if ((inDegree.get(target) ?? 0) <= 0) {
          queue.push(target);
        }
      });
    }

    if (currentLayer.length > 0) {
      layers.push(currentLayer);
    }
  }

  return layers;
}

/**
 * Build clusters from nodes and edges based on grouping mode.
 * `prefixExtractor` returns a prefix string for a node, or null if it can't be clustered.
 */
export function buildClustersGeneric<N extends LayoutNode>(
  nodes: N[],
  edges: LayoutEdge[],
  groupingMode: StoryCanvasGroupingMode,
  prefixExtractor: (node: N) => string | null,
): LayoutCluster[] {
  if (groupingMode === 'connected-component') {
    return getConnectedComponents(nodes, edges).map((nodeIds, index) => ({
      id: `component-${index}`,
      nodeIds,
    }));
  }

  if (groupingMode === 'filename-prefix') {
    const clusters = new Map<string, string[]>();
    const singletons: string[] = [];

    nodes.forEach(node => {
      const prefix = prefixExtractor(node);
      if (!prefix) {
        singletons.push(node.id);
        return;
      }
      const list = clusters.get(prefix) ?? [];
      list.push(node.id);
      clusters.set(prefix, list);
    });

    const result: LayoutCluster[] = [];
    clusters.forEach((nodeIds, id) => {
      if (nodeIds.length > 1) result.push({ id, nodeIds });
      else singletons.push(nodeIds[0]);
    });
    singletons.forEach((id, index) => result.push({ id: `single-${index}-${id}`, nodeIds: [id] }));
    return result;
  }

  return nodes.map(node => ({ id: node.id, nodeIds: [node.id] }));
}

export interface RouteGraph {
  graph: DirectedGraph;
  startNodes: string[];
  endNodes: Set<string>;
}

interface LabelInfo {
  label: string;
  startLine: number;
  endLine: number;
  hasTerminal: boolean;
  hasReturn: boolean;
}

interface LabelLocation {
  blockId: string;
  label: string;
  line: number;
  type: string;
}

/**
 * Build a graphology DirectedGraph from route analysis data, along with
 * start/end node sets. Provides a clean extension point for future graph
 * analyses (cycle detection, SCC, centrality, etc.).
 */
export function buildRouteGraph(
  labelNodes: Map<string, LabelNode>,
  routeLinks: RouteLink[],
  labels: Record<string, LabelLocation>,
  blockLabelInfo: Map<string, LabelInfo[]>,
): RouteGraph {
  const graph = new DirectedGraph();
  labelNodes.forEach(node => graph.addNode(node.id));
  routeLinks.forEach(link => {
    if (graph.hasNode(link.sourceId) && graph.hasNode(link.targetId)) {
      if (!graph.hasDirectedEdge(link.sourceId, link.targetId)) {
        graph.addDirectedEdge(link.sourceId, link.targetId);
      }
    }
  });

  let startNodes: string[] = [];
  const startLabelLocation = labels['start'];
  if (startLabelLocation && startLabelLocation.type !== 'menu') {
    const startNodeId = `${startLabelLocation.blockId}:start`;
    if (labelNodes.has(startNodeId)) startNodes.push(startNodeId);
  }
  if (startNodes.length === 0) {
    startNodes = Array.from(labelNodes.keys()).filter(nodeId => graph.inDegree(nodeId) === 0);
  }

  const endNodes = new Set<string>();
  blockLabelInfo.forEach((blockLabels, blockId) => {
    blockLabels.forEach(labelInfo => {
      const nodeId = `${blockId}:${labelInfo.label}`;
      const isLeafNode = graph.hasNode(nodeId) && graph.outDegree(nodeId) === 0;
      if (isLeafNode || (labelInfo.hasReturn && !labelInfo.hasTerminal)) endNodes.add(nodeId);
    });
  });

  return { graph, startNodes, endNodes };
}
