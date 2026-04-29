import type { LabelNode, RouteLink } from '@/types';

export const DEFAULT_MAX_DEPTH = 10;
const NUM_COLORS = 6;

// ─── Public Types ──────────────────────────────────────────────────────────────

export type PlayerTreeNode =
  | NarrativeNode
  | ConvergenceNode
  | CycleNode
  | TerminalNode;

/** A label the player reads — may branch into one or more outgoing groups. */
export interface NarrativeNode {
  type: 'narrative';
  uid: string;
  labelId: string;
  label: string;
  outgoing: OutgoingGroup[];
}

/**
 * A group of branches leaving a narrative node.
 * - `menuLine` present  → branches came from a Ren'Py `menu:` statement
 * - `menuLine` absent   → direct flow (jump / call / implicit) from the label body
 */
export interface OutgoingGroup {
  menuLine?: number;
  branches: Branch[];
}

/** One branch within an outgoing group. */
export interface Branch {
  choiceText?: string;
  condition?: string;
  isCall: boolean;
  colorIdx: number;
  node: PlayerTreeNode;
}

/** A label already placed elsewhere in the tree — shown as a reference to avoid re-expansion. */
export interface ConvergenceNode {
  type: 'convergence';
  uid: string;
  labelId: string;
  label: string;
}

/** A back-edge to an ancestor in the current DFS path — indicates a loop in the story. */
export interface CycleNode {
  type: 'cycle';
  uid: string;
  cyclesToLabelId: string;
  cyclesToLabel: string;
}

/** End of a traversal path — no further expansion. */
export interface TerminalNode {
  type: 'terminal';
  uid: string;
  reason: 'no-links' | 'depth-limit' | 'unknown-label';
}

// ─── Main Function ─────────────────────────────────────────────────────────────

/**
 * Builds a player-perspective tree rooted at `entryLabelId`.
 *
 * Two tracking sets drive the traversal:
 * - `ancestors` — the current path from root; a hit here is a back-edge (cycle).
 * - `visited`   — every label placed anywhere in the tree; a hit here (but not in
 *                 ancestors) is a convergence point — return a reference instead of
 *                 re-expanding the subtree.
 */
export function buildPlayerTree(
  labelNodes: LabelNode[],
  routeLinks: RouteLink[],
  entryLabelId: string,
  maxDepth = DEFAULT_MAX_DEPTH,
): PlayerTreeNode {
  const nodeMap = new Map<string, LabelNode>(labelNodes.map(n => [n.id, n]));

  const linksFrom = new Map<string, RouteLink[]>();
  for (const link of routeLinks) {
    const arr = linksFrom.get(link.sourceId) ?? [];
    arr.push(link);
    linksFrom.set(link.sourceId, arr);
  }

  let counter = 0;
  const uid = () => `ptnode-${counter++}`;

  const visited = new Set<string>();
  const ancestors = new Set<string>();

  function dfs(labelId: string, depth: number): PlayerTreeNode {
    if (depth > maxDepth) {
      return { type: 'terminal', uid: uid(), reason: 'depth-limit' };
    }

    if (ancestors.has(labelId)) {
      const n = nodeMap.get(labelId);
      return { type: 'cycle', uid: uid(), cyclesToLabelId: labelId, cyclesToLabel: n?.label ?? labelId };
    }

    if (visited.has(labelId)) {
      const n = nodeMap.get(labelId);
      return { type: 'convergence', uid: uid(), labelId, label: n?.label ?? labelId };
    }

    if (!nodeMap.has(labelId)) {
      return { type: 'terminal', uid: uid(), reason: 'unknown-label' };
    }

    visited.add(labelId);
    ancestors.add(labelId);

    const outgoing = buildGroups(linksFrom.get(labelId) ?? [], depth);

    ancestors.delete(labelId);

    return {
      type: 'narrative',
      uid: uid(),
      labelId,
      label: nodeMap.get(labelId)!.label,
      outgoing,
    };
  }

  function buildGroups(links: RouteLink[], depth: number): OutgoingGroup[] {
    if (links.length === 0) return [];

    const menuMap = new Map<number, RouteLink[]>();
    const direct: RouteLink[] = [];

    for (const link of links) {
      if (link.menuLine !== undefined) {
        const arr = menuMap.get(link.menuLine) ?? [];
        arr.push(link);
        menuMap.set(link.menuLine, arr);
      } else {
        direct.push(link);
      }
    }

    const groups: OutgoingGroup[] = [];

    if (direct.length > 0) {
      groups.push({
        menuLine: undefined,
        branches: direct.map((link, i) => ({
          choiceText: undefined,
          condition: undefined,
          isCall: link.type === 'call',
          colorIdx: i % NUM_COLORS,
          node: dfs(link.targetId, depth + 1),
        })),
      });
    }

    const sortedMenuLines = [...menuMap.keys()].sort((a, b) => a - b);
    for (const menuLine of sortedMenuLines) {
      const menuLinks = menuMap.get(menuLine)!;
      groups.push({
        menuLine,
        branches: menuLinks.map((link, i) => ({
          choiceText: link.choiceText,
          condition: link.choiceCondition,
          isCall: link.type === 'call',
          colorIdx: i % NUM_COLORS,
          node: dfs(link.targetId, depth + 1),
        })),
      });
    }

    return groups;
  }

  return dfs(entryLabelId, 0);
}
