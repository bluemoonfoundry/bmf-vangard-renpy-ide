import type { PlayerTreeNode } from './playerTreeBuilder';

// ─── Public Types ──────────────────────────────────────────────────────────────

export interface NodeRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** uid → bounding rect for every node in the tree. */
export type TreeLayout = Map<string, NodeRect>;

export interface TreeLayoutConfig {
  /** Pixel width per node type. */
  nodeWidth: Record<PlayerTreeNode['type'], number>;
  /** Pixel height per node type. */
  nodeHeight: Record<PlayerTreeNode['type'], number>;
  /** Horizontal gap between adjacent sibling subtrees within the same group. */
  horizontalGap: number;
  /** Vertical gap between a parent's bottom edge and its children's top edge. */
  verticalGap: number;
}

export const DEFAULT_TREE_LAYOUT_CONFIG: TreeLayoutConfig = {
  nodeWidth:  { narrative: 240, convergence: 200, cycle: 200, terminal: 160, continuation: 200 },
  nodeHeight: { narrative: 92,  convergence: 40,  cycle: 40,  terminal: 32,  continuation: 40  },
  horizontalGap: 32,
  verticalGap:   56,
};

// ─── Main Function ─────────────────────────────────────────────────────────────

/**
 * Computes pixel positions for every node in a player tree.
 *
 * Two-pass algorithm:
 *   1. Post-order (cached): compute the horizontal span each subtree needs.
 *   2. Pre-order (recursive): assign x/y positions top-down, centering each
 *      node over its widest outgoing group.
 *
 * The layout spans x ∈ [0, subtreeWidth(root)]. The root's rect.y is always 0.
 * Subsequent outgoing groups on the same narrative node stack vertically below
 * the deepest child of the preceding group.
 */
export function computeTreeLayout(
  root: PlayerTreeNode,
  config: TreeLayoutConfig = DEFAULT_TREE_LAYOUT_CONFIG,
): TreeLayout {
  const positions: TreeLayout = new Map();
  const widthCache = new Map<string, number>();

  const nw = (n: PlayerTreeNode) => config.nodeWidth[n.type];
  const nh = (n: PlayerTreeNode) => config.nodeHeight[n.type];

  function subtreeWidth(node: PlayerTreeNode): number {
    const hit = widthCache.get(node.uid);
    if (hit !== undefined) return hit;

    let w = nw(node);

    if (node.type === 'narrative') {
      for (const group of node.outgoing) {
        if (group.branches.length === 0) continue;
        const gw =
          group.branches.reduce((sum, b) => sum + subtreeWidth(b.node), 0) +
          (group.branches.length - 1) * config.horizontalGap;
        if (gw > w) w = gw;
      }
    }

    widthCache.set(node.uid, w);
    return w;
  }

  /**
   * Places `node` centered at `centerX`, top edge at `topY`.
   * Returns the bottom Y of the deepest node in the subtree.
   */
  function place(node: PlayerTreeNode, centerX: number, topY: number): number {
    const w = nw(node);
    const h = nh(node);
    positions.set(node.uid, { x: centerX - w / 2, y: topY, width: w, height: h });

    if (node.type !== 'narrative' || node.outgoing.length === 0) {
      return topY + h;
    }

    let rowY = topY + h;

    for (const group of node.outgoing) {
      if (group.branches.length === 0) continue;

      rowY += config.verticalGap;

      const totalW =
        group.branches.reduce((sum, b) => sum + subtreeWidth(b.node), 0) +
        (group.branches.length - 1) * config.horizontalGap;

      let childLeft = centerX - totalW / 2;
      let groupBottom = rowY;

      for (const branch of group.branches) {
        const sw = subtreeWidth(branch.node);
        const childBottom = place(branch.node, childLeft + sw / 2, rowY);
        if (childBottom > groupBottom) groupBottom = childBottom;
        childLeft += sw + config.horizontalGap;
      }

      rowY = groupBottom;
    }

    return rowY;
  }

  place(root, subtreeWidth(root) / 2, 0);
  return positions;
}
