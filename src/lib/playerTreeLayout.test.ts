import { describe, it, expect } from 'vitest';
import { computeTreeLayout, DEFAULT_TREE_LAYOUT_CONFIG } from './playerTreeLayout';
import type { NodeRect, TreeLayout, TreeLayoutConfig } from './playerTreeLayout';
import type {
  PlayerTreeNode,
  NarrativeNode,
  OutgoingGroup,
  Branch,
  ConvergenceNode,
  CycleNode,
  TerminalNode,
} from './playerTreeBuilder';

// ─── Tree-construction helpers ────────────────────────────────────────────────
// Direct construction — no dependency on buildPlayerTree keeps layout tests
// isolated from traversal logic.

function br(node: PlayerTreeNode, i = 0): Branch {
  return { choiceText: `c${i}`, condition: undefined, isCall: false, colorIdx: i, node };
}

function menuGroup(menuLine: number, ...children: PlayerTreeNode[]): OutgoingGroup {
  return { menuLine, branches: children.map((n, i) => br(n, i)) };
}

function directGroup(...children: PlayerTreeNode[]): OutgoingGroup {
  return { menuLine: undefined, branches: children.map((n, i) => br(n, i)) };
}

function narrative(uid: string, ...groups: OutgoingGroup[]): NarrativeNode {
  return { type: 'narrative', uid, labelId: uid, label: uid, outgoing: groups };
}

function leaf(uid: string): NarrativeNode {
  return narrative(uid);
}

function conv(uid: string): ConvergenceNode {
  return { type: 'convergence', uid, labelId: `lbl-${uid}`, label: uid };
}

function cyc(uid: string): CycleNode {
  return { type: 'cycle', uid, cyclesToLabelId: `lbl-${uid}`, cyclesToLabel: uid };
}

function term(uid: string): TerminalNode {
  return { type: 'terminal', uid, reason: 'no-links' };
}

// ─── Layout-inspection helpers ────────────────────────────────────────────────

const cfg = DEFAULT_TREE_LAYOUT_CONFIG;

function r(uid: string, layout: TreeLayout): NodeRect {
  const rect = layout.get(uid);
  if (!rect) throw new Error(`No layout entry for uid "${uid}"`);
  return rect;
}

function cx(uid: string, layout: TreeLayout): number {
  const rect = r(uid, layout);
  return rect.x + rect.width / 2;
}

function overlaps(a: NodeRect, b: NodeRect): boolean {
  return (
    a.x < b.x + b.width  && a.x + a.width  > b.x &&
    a.y < b.y + b.height && a.y + a.height > b.y
  );
}

function noOverlap(layout: TreeLayout): boolean {
  const rects = [...layout.values()];
  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      if (overlaps(rects[i], rects[j])) return false;
    }
  }
  return true;
}

function countNodes(node: PlayerTreeNode): number {
  if (node.type !== 'narrative') return 1;
  return (
    1 +
    node.outgoing
      .flatMap(g => g.branches)
      .reduce((sum, b) => sum + countNodes(b.node), 0)
  );
}

function parentChildPairs(node: PlayerTreeNode): [string, string][] {
  if (node.type !== 'narrative') return [];
  const pairs: [string, string][] = [];
  for (const group of node.outgoing) {
    for (const branch of group.branches) {
      pairs.push([node.uid, branch.node.uid]);
      pairs.push(...parentChildPairs(branch.node));
    }
  }
  return pairs;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('computeTreeLayout', () => {

  // ── Single-node trees ─────────────────────────────────────────────────────────

  it('places a single narrative leaf at origin with correct dimensions', () => {
    const layout = computeTreeLayout(leaf('A'));
    expect(r('A', layout)).toEqual({ x: 0, y: 0, width: cfg.nodeWidth.narrative, height: cfg.nodeHeight.narrative });
  });

  it('places a single terminal at origin with correct dimensions', () => {
    const layout = computeTreeLayout(term('T'));
    expect(r('T', layout)).toEqual({ x: 0, y: 0, width: cfg.nodeWidth.terminal, height: cfg.nodeHeight.terminal });
  });

  it('places a single convergence node at origin with correct dimensions', () => {
    const layout = computeTreeLayout(conv('V'));
    expect(r('V', layout)).toEqual({ x: 0, y: 0, width: cfg.nodeWidth.convergence, height: cfg.nodeHeight.convergence });
  });

  it('places a single cycle node at origin with correct dimensions', () => {
    const layout = computeTreeLayout(cyc('C'));
    expect(r('C', layout)).toEqual({ x: 0, y: 0, width: cfg.nodeWidth.cycle, height: cfg.nodeHeight.cycle });
  });

  // ── Linear chain ──────────────────────────────────────────────────────────────

  it('places a two-node linear chain with B directly below A', () => {
    //  A → B
    const layout = computeTreeLayout(narrative('A', directGroup(leaf('B'))));
    expect(r('A', layout).y).toBe(0);
    expect(r('B', layout).y).toBe(cfg.nodeHeight.narrative + cfg.verticalGap);
    // Same horizontal center
    expect(cx('A', layout)).toBeCloseTo(cx('B', layout));
  });

  it('stacks three nodes in a linear chain at the expected Y values', () => {
    //  A → B → C
    const vGap = cfg.verticalGap;
    const nh   = cfg.nodeHeight.narrative;
    const layout = computeTreeLayout(
      narrative('A', directGroup(narrative('B', directGroup(leaf('C'))))),
    );
    expect(r('A', layout).y).toBe(0);
    expect(r('B', layout).y).toBe(nh + vGap);
    expect(r('C', layout).y).toBe(2 * (nh + vGap));
  });

  it('centers a parent over a single child whose subtree is wider', () => {
    //  A → B → [C, D]   (B is wider than A)
    const layout = computeTreeLayout(
      narrative('A', directGroup(
        narrative('B', menuGroup(1, leaf('C'), leaf('D'))),
      )),
    );
    // A and B must share the same horizontal center
    expect(cx('A', layout)).toBeCloseTo(cx('B', layout));
  });

  // ── Menu fanout ───────────────────────────────────────────────────────────────

  it('distributes a two-branch menu symmetrically around the parent center', () => {
    //  A → [B, C]
    const layout = computeTreeLayout(narrative('A', menuGroup(1, leaf('B'), leaf('C'))));
    const nw = cfg.nodeWidth.narrative;
    const hg = cfg.horizontalGap;

    // Total child span = nw + hg + nw
    expect(r('B', layout).x).toBe(0);
    expect(r('C', layout).x).toBe(nw + hg);
    // Parent centered over children
    expect(cx('A', layout)).toBeCloseTo((cx('B', layout) + cx('C', layout)) / 2);
  });

  it('places three equal-width branches with the center child directly below the parent', () => {
    //  A → [B, C, D]
    const layout = computeTreeLayout(narrative('A', menuGroup(1, leaf('B'), leaf('C'), leaf('D'))));
    // For odd count with equal widths the middle child is at the same cx as parent
    expect(cx('C', layout)).toBeCloseTo(cx('A', layout));
  });

  it('all same-group siblings share an identical Y value', () => {
    //  A → [B, C, D]
    const layout = computeTreeLayout(narrative('A', menuGroup(1, leaf('B'), leaf('C'), leaf('D'))));
    const yB = r('B', layout).y;
    expect(r('C', layout).y).toBe(yB);
    expect(r('D', layout).y).toBe(yB);
  });

  it('places unequal-width siblings without overlap', () => {
    //  A → [B, C]  where B → [D, E]  (B subtree is wider than C)
    const layout = computeTreeLayout(
      narrative('A', menuGroup(1,
        narrative('B', menuGroup(2, leaf('D'), leaf('E'))),
        leaf('C'),
      )),
    );
    expect(noOverlap(layout)).toBe(true);
  });

  // ── Structural invariants ─────────────────────────────────────────────────────

  it('no two nodes overlap in a two-branch menu tree', () => {
    //  A → [B, C],  B → D
    const layout = computeTreeLayout(
      narrative('A', menuGroup(1,
        narrative('B', directGroup(leaf('D'))),
        leaf('C'),
      )),
    );
    expect(noOverlap(layout)).toBe(true);
  });

  it('no two nodes overlap in a nested three-level tree', () => {
    //  A → [B, C]
    //  B → [D, E]
    //  C → [F, G]
    const layout = computeTreeLayout(
      narrative('A', menuGroup(1,
        narrative('B', menuGroup(2, leaf('D'), leaf('E'))),
        narrative('C', menuGroup(3, leaf('F'), leaf('G'))),
      )),
    );
    expect(noOverlap(layout)).toBe(true);
  });

  it('every child Y is strictly greater than its parent Y', () => {
    //  A → [B, C],  B → D → E
    const root = narrative('A', menuGroup(1,
      narrative('B', directGroup(
        narrative('D', directGroup(leaf('E'))),
      )),
      leaf('C'),
    ));
    const layout = computeTreeLayout(root);
    for (const [parentUid, childUid] of parentChildPairs(root)) {
      expect(r(childUid, layout).y).toBeGreaterThan(r(parentUid, layout).y);
    }
  });

  // ── Sequential outgoing groups ────────────────────────────────────────────────

  it('places second group children below the first group children', () => {
    //  A has two sequential groups: group1 → B, group2 → C
    const layout = computeTreeLayout(
      narrative('A',
        menuGroup(10, leaf('B')),
        menuGroup(20, leaf('C')),
      ),
    );
    expect(r('C', layout).y).toBeGreaterThan(r('B', layout).y);
  });

  it('second group starts below the deepest subtree of the first group', () => {
    //  A: group1 → B → D → E  (deep chain)
    //     group2 → C           (starts after E)
    const root = narrative('A',
      menuGroup(10,
        narrative('B', directGroup(narrative('D', directGroup(leaf('E'))))),
      ),
      menuGroup(20, leaf('C')),
    );
    const layout = computeTreeLayout(root);
    // C must be below the bottom of E
    const eBottom = r('E', layout).y + r('E', layout).height;
    expect(r('C', layout).y).toBeGreaterThan(eBottom);
  });

  // ── Non-narrative leaf types ──────────────────────────────────────────────────

  it('places a convergence reference below its parent like any other child', () => {
    //  A → convergence(V)
    const layout = computeTreeLayout(narrative('A', directGroup(conv('V'))));
    expect(r('V', layout).y).toBeGreaterThan(r('A', layout).y);
    expect(r('V', layout).width).toBe(cfg.nodeWidth.convergence);
    expect(r('V', layout).height).toBe(cfg.nodeHeight.convergence);
  });

  it('places a cycle node below its parent with cycle dimensions', () => {
    //  A → cycle(X)
    const layout = computeTreeLayout(narrative('A', directGroup(cyc('X'))));
    expect(r('X', layout).y).toBeGreaterThan(r('A', layout).y);
    expect(r('X', layout).width).toBe(cfg.nodeWidth.cycle);
  });

  it('places a terminal below its parent', () => {
    const layout = computeTreeLayout(narrative('A', directGroup(term('T'))));
    expect(r('T', layout).y).toBeGreaterThan(r('A', layout).y);
    expect(r('T', layout).width).toBe(cfg.nodeWidth.terminal);
  });

  // ── Layout map coverage ───────────────────────────────────────────────────────

  it('layout map contains exactly one entry per node in the tree', () => {
    const root = narrative('A', menuGroup(1,
      narrative('B', directGroup(leaf('D'), term('T'))),
      conv('V'),
      cyc('X'),
    ));
    const layout = computeTreeLayout(root);
    expect(layout.size).toBe(countNodes(root));
  });

  it('root rect.y is always 0', () => {
    expect(r('A', computeTreeLayout(leaf('A'))).y).toBe(0);
    expect(r('A', computeTreeLayout(term('A'))).y).toBe(0);
  });

  // ── Custom config ──────────────────────────────────────────────────────────────

  it('respects custom node dimensions', () => {
    const custom: TreeLayoutConfig = {
      nodeWidth:  { narrative: 100, convergence: 80, cycle: 80, terminal: 60 },
      nodeHeight: { narrative: 50,  convergence: 20, cycle: 20, terminal: 16 },
      horizontalGap: 10,
      verticalGap:   20,
    };
    const layout = computeTreeLayout(leaf('A'), custom);
    expect(r('A', layout)).toEqual({ x: 0, y: 0, width: 100, height: 50 });
  });

  it('respects custom gaps in a two-branch menu', () => {
    const custom: TreeLayoutConfig = {
      nodeWidth:  { narrative: 100, convergence: 80, cycle: 80, terminal: 60 },
      nodeHeight: { narrative: 50,  convergence: 20, cycle: 20, terminal: 16 },
      horizontalGap: 10,
      verticalGap:   20,
    };
    // gw = 100 + 10 + 100 = 210; subtreeWidth(A) = 210; A center = 105
    const layout = computeTreeLayout(
      narrative('A', menuGroup(1, leaf('B'), leaf('C'))),
      custom,
    );
    // B starts at x=0, C starts at x=110 (100+10)
    expect(r('B', layout).x).toBe(0);
    expect(r('C', layout).x).toBe(110);
    // Children Y = parent.h + vGap = 50 + 20 = 70
    expect(r('B', layout).y).toBe(70);
    expect(r('C', layout).y).toBe(70);
  });
});
