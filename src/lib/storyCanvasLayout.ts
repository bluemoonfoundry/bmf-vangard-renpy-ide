import type {
  Block,
  Link,
  SavedStoryBlockLayout,
  StoryCanvasGroupingMode,
  StoryCanvasLayoutMode,
} from '@/types';
import {
  buildClustersGeneric,
  computeLayeredLayoutGeneric,
  type LayoutConfig,
  type LayoutNode,
} from './graphLayout';

const LAYOUT_VERSION = 2;

const STORY_CONFIG: LayoutConfig = {
  paddingX: 150,
  paddingY: 50,
  componentSpacing: 200,
  clusterSpacingX: 220,
  clusterSpacingY: 180,
  defaultWidth: 120,
  defaultHeight: 120,
  crossAxisBase: 100,
};

function inferFilenamePrefix(filePath?: string): string | null {
  if (!filePath) return null;
  const rawBase = filePath.split(/[\\/]/).pop()?.replace(/\.[^.]+$/, '') ?? '';
  if (!rawBase) return null;

  const base = rawBase.toLowerCase();

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

  return null;
}

function computeClusteredLayout(
  blocks: Block[],
  links: Link[],
  groupingMode: StoryCanvasGroupingMode,
): Block[] {
  const clusters = buildClustersGeneric(blocks, links, groupingMode, (block: Block) => inferFilenamePrefix(block.filePath));
  if (clusters.every(cluster => cluster.nodeIds.length === 1)) {
    return computeLayeredLayoutGeneric(blocks, links, 'lr', STORY_CONFIG);
  }

  const blockById = new Map(blocks.map(block => [block.id, block]));
  const positionedBlocks = new Map<string, Block>();
  const clusterNodes: LayoutNode[] = [];
  const clusterEdgesSet = new Set<string>();

  clusters.forEach(cluster => {
    const clusterBlocks = cluster.nodeIds.map(id => blockById.get(id)).filter((block): block is Block => !!block);
    const internalLinks = links.filter(link => cluster.nodeIds.includes(link.sourceId) && cluster.nodeIds.includes(link.targetId));
    const laidOut = computeLayeredLayoutGeneric(clusterBlocks, internalLinks, 'lr', STORY_CONFIG);

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    laidOut.forEach(block => {
      positionedBlocks.set(block.id, block);
      minX = Math.min(minX, block.position.x);
      minY = Math.min(minY, block.position.y);
      maxX = Math.max(maxX, block.position.x + block.width);
      maxY = Math.max(maxY, block.position.y + block.height);
    });

    clusterNodes.push({
      id: cluster.id,
      width: Math.max(200, maxX - minX + STORY_CONFIG.clusterSpacingX),
      height: Math.max(180, maxY - minY + STORY_CONFIG.clusterSpacingY),
      position: { x: 0, y: 0 },
    });
  });

  const clusterByBlockId = new Map<string, string>();
  clusters.forEach(cluster => cluster.nodeIds.forEach(nodeId => clusterByBlockId.set(nodeId, cluster.id)));

  links.forEach(link => {
    const sourceCluster = clusterByBlockId.get(link.sourceId);
    const targetCluster = clusterByBlockId.get(link.targetId);
    if (!sourceCluster || !targetCluster || sourceCluster === targetCluster) return;
    clusterEdgesSet.add(`${sourceCluster}->${targetCluster}`);
  });

  const clusterLayout = computeLayeredLayoutGeneric(
    clusterNodes,
    Array.from(clusterEdgesSet).map(key => {
      const [sourceId, targetId] = key.split('->');
      return { sourceId, targetId };
    }),
    'lr',
    STORY_CONFIG,
  );
  const clusterPositionMap = new Map(clusterLayout.map(cluster => [cluster.id, cluster.position]));

  const result = blocks.map(block => {
    const laidOutBlock = positionedBlocks.get(block.id) ?? block;
    const clusterId = clusterByBlockId.get(block.id);
    const clusterPosition = clusterId ? clusterPositionMap.get(clusterId) : undefined;
    return clusterPosition
      ? {
          ...laidOutBlock,
          position: {
            x: clusterPosition.x + laidOutBlock.position.x,
            y: clusterPosition.y + laidOutBlock.position.y,
          },
        }
      : laidOutBlock;
  });

  return result;
}

export function computeStoryLayout(
  blocks: Block[],
  links: Link[],
  layoutMode: StoryCanvasLayoutMode,
  groupingMode: StoryCanvasGroupingMode,
): Block[] {
  switch (layoutMode) {
    case 'flow-td':
      return computeLayeredLayoutGeneric(blocks, links, 'td', STORY_CONFIG);
    case 'connected-components':
      return computeLayeredLayoutGeneric(blocks, links, 'lr', STORY_CONFIG);
    case 'clustered-flow':
      return computeClusteredLayout(blocks, links, groupingMode === 'none' ? 'connected-component' : groupingMode);
    case 'flow-lr':
    default:
      return computeLayeredLayoutGeneric(blocks, links, 'lr', STORY_CONFIG);
  }
}

export function computeStoryLayoutFingerprint(
  blocks: Block[],
  links: Link[],
  layoutMode: StoryCanvasLayoutMode,
  groupingMode: StoryCanvasGroupingMode,
): string {
  const blockPart = blocks
    .map(block => `${block.filePath ?? block.id}:${block.width}x${block.height}`)
    .sort()
    .join('|');
  const linkPart = links
    .map(link => `${link.sourceId}->${link.targetId}:${link.type ?? 'jump'}`)
    .sort()
    .join('|');
  return `v${LAYOUT_VERSION};mode=${layoutMode};group=${groupingMode};blocks=${blockPart};links=${linkPart}`;
}

export function buildSavedStoryBlockLayouts(blocks: Block[]): Record<string, SavedStoryBlockLayout> {
  const layouts: Record<string, SavedStoryBlockLayout> = {};
  blocks.forEach(block => {
    if (!block.filePath) return;
    layouts[block.filePath] = {
      position: block.position,
      width: block.width,
      height: block.height,
      color: block.color,
    };
  });
  return layouts;
}

export function getStoryLayoutVersion(): number {
  return LAYOUT_VERSION;
}
