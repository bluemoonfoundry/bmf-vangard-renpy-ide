import type {
  LabelNode,
  RouteLink,
  StoryCanvasGroupingMode,
  StoryCanvasLayoutMode,
} from '@/types';
import {
  buildClustersGeneric,
  computeLayeredLayoutGeneric,
  type LayoutConfig,
} from './graphLayout';

const LAYOUT_VERSION = 2;

const ROUTE_CONFIG: LayoutConfig = {
  paddingX: 140,
  paddingY: 70,
  componentSpacing: 220,
  clusterSpacingX: 220,
  clusterSpacingY: 180,
  defaultWidth: 220,
  defaultHeight: 110,
  crossAxisBase: 100,
};

function inferContainerPrefix(node: LabelNode): string | null {
  const container = (node.containerName ?? '').replace(/\.[^.]+$/, '').trim();
  if (!container) return null;

  const base = container.toLowerCase();

  // Named episode/chapter/act/day/part/scene/vol/section/arc variants
  const namedPrefixMatch = base.match(
    /^((?:ep|episode|ch|chapter|act|day|part|scene|vol|section|arc)(?:[_\- ]?\d+))/
  );
  if (namedPrefixMatch) {
    return namedPrefixMatch[1].replace(/[_\- ]/g, '_');
  }

  // route_luna, route_bad, route_<name>
  const routePrefixMatch = base.match(/^(route[_\- ][a-z0-9]+)/);
  if (routePrefixMatch) {
    return routePrefixMatch[1].replace(/[_\- ]/g, '_');
  }

  // Numeric leading prefix: 01_intro, 02_main
  const numericLeadMatch = base.match(/^(\d{1,3})[_\- ]/);
  if (numericLeadMatch) {
    return `n_${numericLeadMatch[1].padStart(2, '0')}`;
  }

  // Generic word+number prefix before a separator
  const genericMatch = base.match(/^([a-z]+[_\- ]?\d+)[_\- ]/);
  if (genericMatch) {
    return genericMatch[1].replace(/[_\- ]/g, '_');
  }

  return base;
}

function computeClusteredLayout(
  nodes: LabelNode[],
  edges: RouteLink[],
  groupingMode: StoryCanvasGroupingMode,
): LabelNode[] {
  const clusters = buildClustersGeneric(nodes, edges, groupingMode, inferContainerPrefix);
  if (clusters.every(cluster => cluster.nodeIds.length === 1)) {
    return computeLayeredLayoutGeneric(nodes, edges, 'lr', ROUTE_CONFIG);
  }

  const nodeById = new Map(nodes.map(node => [node.id, node]));
  const positionedNodes = new Map<string, LabelNode>();
  const clusterNodes: LabelNode[] = [];
  const clusterEdges = new Set<string>();

  clusters.forEach(cluster => {
    const clusterMembers = cluster.nodeIds.map(id => nodeById.get(id)).filter((node): node is LabelNode => !!node);
    const internalEdges = edges.filter(edge => cluster.nodeIds.includes(edge.sourceId) && cluster.nodeIds.includes(edge.targetId));
    const laidOut = computeLayeredLayoutGeneric(clusterMembers, internalEdges, 'lr', ROUTE_CONFIG);

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    laidOut.forEach(node => {
      positionedNodes.set(node.id, node);
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + node.width);
      maxY = Math.max(maxY, node.position.y + node.height);
    });

    clusterNodes.push({
      id: cluster.id,
      label: cluster.id,
      blockId: cluster.id,
      startLine: 1,
      width: Math.max(220, maxX - minX + ROUTE_CONFIG.clusterSpacingX),
      height: Math.max(180, maxY - minY + ROUTE_CONFIG.clusterSpacingY),
      position: { x: 0, y: 0 },
    });
  });

  const clusterByNodeId = new Map<string, string>();
  clusters.forEach(cluster => cluster.nodeIds.forEach(nodeId => clusterByNodeId.set(nodeId, cluster.id)));

  edges.forEach(edge => {
    const sourceCluster = clusterByNodeId.get(edge.sourceId);
    const targetCluster = clusterByNodeId.get(edge.targetId);
    if (!sourceCluster || !targetCluster || sourceCluster === targetCluster) return;
    clusterEdges.add(`${sourceCluster}->${targetCluster}`);
  });

  const laidOutClusters = computeLayeredLayoutGeneric(
    clusterNodes,
    Array.from(clusterEdges).map(id => {
      const [sourceId, targetId] = id.split('->');
      return { id, sourceId, targetId, type: 'jump' as const };
    }),
    'lr',
    ROUTE_CONFIG,
  );

  const clusterLayoutMap = new Map(laidOutClusters.map(node => [node.id, node]));

  return clusters.flatMap(cluster => {
    const clusterLayout = clusterLayoutMap.get(cluster.id);
    const clusterMembers = cluster.nodeIds.map(id => positionedNodes.get(id)).filter((node): node is LabelNode => !!node);
    if (!clusterLayout || clusterMembers.length === 0) return clusterMembers;

    const minX = Math.min(...clusterMembers.map(node => node.position.x));
    const minY = Math.min(...clusterMembers.map(node => node.position.y));

    return clusterMembers.map(node => ({
      ...node,
      position: {
        x: clusterLayout.position.x + (node.position.x - minX) + 40,
        y: clusterLayout.position.y + (node.position.y - minY) + 50,
      },
    }));
  });
}

export function computeRouteCanvasLayout(
  nodes: LabelNode[],
  edges: RouteLink[],
  layoutMode: StoryCanvasLayoutMode,
  groupingMode: StoryCanvasGroupingMode,
): LabelNode[] {
  switch (layoutMode) {
    case 'flow-td':
      return computeLayeredLayoutGeneric(nodes, edges, 'td', ROUTE_CONFIG);
    case 'connected-components':
      return computeLayeredLayoutGeneric(nodes, edges, 'lr', ROUTE_CONFIG);
    case 'clustered-flow':
      return computeClusteredLayout(nodes, edges, groupingMode === 'none' ? 'connected-component' : groupingMode);
    case 'flow-lr':
    default:
      return computeLayeredLayoutGeneric(nodes, edges, 'lr', ROUTE_CONFIG);
  }
}

export function computeRouteCanvasLayoutFingerprint(
  nodes: LabelNode[],
  edges: RouteLink[],
  layoutMode: StoryCanvasLayoutMode,
  groupingMode: StoryCanvasGroupingMode,
): string {
  const nodePart = nodes
    .map(node => `${node.id}:${node.containerName ?? ''}:${node.width}x${node.height}`)
    .sort()
    .join('|');
  const edgePart = edges
    .map(edge => `${edge.sourceId}->${edge.targetId}:${edge.type}`)
    .sort()
    .join('|');
  return `v${LAYOUT_VERSION};mode=${layoutMode};group=${groupingMode};nodes=${nodePart};edges=${edgePart}`;
}

export function getRouteCanvasLayoutVersion(): number {
  return LAYOUT_VERSION;
}
