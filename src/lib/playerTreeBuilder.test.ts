import { describe, it, expect } from 'vitest';
import { buildPlayerTree, DEFAULT_MAX_DEPTH } from './playerTreeBuilder';
import type {
  PlayerTreeNode,
  NarrativeNode,
  ConvergenceNode,
  CycleNode,
  TerminalNode,
  ContinuationNode,
} from './playerTreeBuilder';
import type { LabelNode, RouteLink } from '@/types';

// ─── Factories ─────────────────────────────────────────────────────────────────

const n = (id: string, label = id): LabelNode => ({
  id, label, blockId: 'b1', startLine: 1, position: { x: 0, y: 0 }, width: 200, height: 60,
});

const jump = (id: string, sourceId: string, targetId: string): RouteLink => ({
  id, sourceId, targetId, type: 'jump',
});

const impl = (id: string, sourceId: string, targetId: string): RouteLink => ({
  id, sourceId, targetId, type: 'implicit',
});

const callLink = (id: string, sourceId: string, targetId: string): RouteLink => ({
  id, sourceId, targetId, type: 'call',
});

const choice = (
  id: string,
  sourceId: string,
  targetId: string,
  choiceText: string,
  menuLine: number,
  choiceCondition?: string,
): RouteLink => ({ id, sourceId, targetId, type: 'jump', choiceText, menuLine, choiceCondition });

// ─── Type-narrowing helpers ────────────────────────────────────────────────────

function asNarrative(node: PlayerTreeNode): NarrativeNode {
  if (node.type !== 'narrative') throw new Error(`Expected narrative, got "${node.type}" (uid=${node.uid})`);
  return node;
}

function asConvergence(node: PlayerTreeNode): ConvergenceNode {
  if (node.type !== 'convergence') throw new Error(`Expected convergence, got "${node.type}" (uid=${node.uid})`);
  return node;
}

function asCycle(node: PlayerTreeNode): CycleNode {
  if (node.type !== 'cycle') throw new Error(`Expected cycle, got "${node.type}" (uid=${node.uid})`);
  return node;
}

function asTerminal(node: PlayerTreeNode): TerminalNode {
  if (node.type !== 'terminal') throw new Error(`Expected terminal, got "${node.type}" (uid=${node.uid})`);
  return node;
}

function asContinuation(node: PlayerTreeNode): ContinuationNode {
  if (node.type !== 'continuation') throw new Error(`Expected continuation, got "${node.type}" (uid=${node.uid})`);
  return node;
}

/** Depth-first collect of all UIDs in the tree. */
function collectUids(node: PlayerTreeNode): string[] {
  const uids = [node.uid];
  if (node.type === 'narrative') {
    for (const group of node.outgoing) {
      for (const branch of group.branches) {
        uids.push(...collectUids(branch.node));
      }
    }
  }
  return uids;
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('buildPlayerTree', () => {

  // ── Entry label ──────────────────────────────────────────────────────────────

  it('returns unknown-label terminal when entry label is absent from labelNodes', () => {
    const result = buildPlayerTree([], [], 'missing');
    expect(asTerminal(result).reason).toBe('unknown-label');
  });

  it('returns unknown-label terminal when entry id has no matching node', () => {
    const result = buildPlayerTree([n('A')], [], 'Z');
    expect(asTerminal(result).reason).toBe('unknown-label');
  });

  // ── Isolated / terminal narrative ─────────────────────────────────────────────

  it('returns narrative with empty outgoing for a label with no links', () => {
    const root = asNarrative(buildPlayerTree([n('A')], [], 'A'));
    expect(root.labelId).toBe('A');
    expect(root.outgoing).toHaveLength(0);
  });

  it('exposes label from LabelNode, not the composite id', () => {
    const root = asNarrative(buildPlayerTree([n('b1:start', 'start')], [], 'b1:start'));
    expect(root.label).toBe('start');
    expect(root.labelId).toBe('b1:start');
  });

  // ── Linear chain ──────────────────────────────────────────────────────────────

  it('builds a two-node linear chain A → B', () => {
    const root = asNarrative(buildPlayerTree([n('A'), n('B')], [jump('j1', 'A', 'B')], 'A'));
    const group = root.outgoing[0];
    expect(group.menuLine).toBeUndefined();
    expect(group.branches).toHaveLength(1);
    const b = asNarrative(group.branches[0].node);
    expect(b.labelId).toBe('B');
    expect(b.outgoing).toHaveLength(0);
  });

  it('builds a three-node linear chain A → B → C', () => {
    const nodes = [n('A'), n('B'), n('C')];
    const links = [jump('j1', 'A', 'B'), jump('j2', 'B', 'C')];
    const root = asNarrative(buildPlayerTree(nodes, links, 'A'));
    const b = asNarrative(root.outgoing[0].branches[0].node);
    const c = asNarrative(b.outgoing[0].branches[0].node);
    expect(c.labelId).toBe('C');
    expect(c.outgoing).toHaveLength(0);
  });

  it('follows implicit links in a linear chain', () => {
    const root = asNarrative(buildPlayerTree([n('A'), n('B')], [impl('i1', 'A', 'B')], 'A'));
    expect(asNarrative(root.outgoing[0].branches[0].node).labelId).toBe('B');
  });

  // ── Choice menus ─────────────────────────────────────────────────────────────

  it('builds a two-branch menu', () => {
    const nodes = [n('A'), n('B'), n('C')];
    const links = [choice('c1', 'A', 'B', 'Go left', 5), choice('c2', 'A', 'C', 'Go right', 5)];
    const root = asNarrative(buildPlayerTree(nodes, links, 'A'));
    expect(root.outgoing).toHaveLength(1);
    const group = root.outgoing[0];
    expect(group.menuLine).toBe(5);
    expect(group.branches).toHaveLength(2);
    expect(group.branches[0].choiceText).toBe('Go left');
    expect(group.branches[1].choiceText).toBe('Go right');
  });

  it('preserves condition on a conditional branch', () => {
    const links = [choice('c1', 'A', 'B', 'Secret path', 3, 'unlocked_route')];
    const root = asNarrative(buildPlayerTree([n('A'), n('B')], links, 'A'));
    const branch = root.outgoing[0].branches[0];
    expect(branch.choiceText).toBe('Secret path');
    expect(branch.condition).toBe('unlocked_route');
  });

  it('assigns colorIdx 0, 1, 2 to three branches in order', () => {
    const nodes = [n('A'), n('B'), n('C'), n('D')];
    const links = [
      choice('c1', 'A', 'B', 'One', 1),
      choice('c2', 'A', 'C', 'Two', 1),
      choice('c3', 'A', 'D', 'Three', 1),
    ];
    const root = asNarrative(buildPlayerTree(nodes, links, 'A'));
    const branches = root.outgoing[0].branches;
    expect(branches[0].colorIdx).toBe(0);
    expect(branches[1].colorIdx).toBe(1);
    expect(branches[2].colorIdx).toBe(2);
  });

  it('wraps colorIdx back to 0 after 6 branches', () => {
    const targets = ['B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const nodes = [n('A'), ...targets.map(t => n(t))];
    const links = targets.map((t, i) => choice(`c${i}`, 'A', t, `Choice ${i}`, 1));
    const root = asNarrative(buildPlayerTree(nodes, links, 'A'));
    const branches = root.outgoing[0].branches;
    expect(branches[5].colorIdx).toBe(5);
    expect(branches[6].colorIdx).toBe(0);
  });

  // ── Convergence ───────────────────────────────────────────────────────────────

  it('marks a reconverging label as a convergence node on the second visit', () => {
    //  A ─[choice left]──→ B ──→ D
    //   └─[choice right]─→ C ──→ D  (D is convergence on second visit)
    const nodes = [n('A'), n('B'), n('C'), n('D')];
    const links = [
      choice('c1', 'A', 'B', 'Left', 1),
      choice('c2', 'A', 'C', 'Right', 1),
      jump('j1', 'B', 'D'),
      jump('j2', 'C', 'D'),
    ];
    const root = asNarrative(buildPlayerTree(nodes, links, 'A'));
    const branches = root.outgoing[0].branches;

    const b = asNarrative(branches[0].node);
    expect(asNarrative(b.outgoing[0].branches[0].node).labelId).toBe('D');

    const c = asNarrative(branches[1].node);
    const dRef = asConvergence(c.outgoing[0].branches[0].node);
    expect(dRef.labelId).toBe('D');
    expect(dRef.label).toBe('D');
  });

  it('convergence node carries the human-readable label, not just the id', () => {
    const nodes = [
      n('b1:start', 'start'),
      n('b1:fork_a', 'fork_a'),
      n('b1:shared', 'shared_scene'),
    ];
    const links = [
      choice('c1', 'b1:start', 'b1:fork_a', 'Take the fork', 1),
      choice('c2', 'b1:start', 'b1:shared', 'Skip ahead', 1),
      jump('j1', 'b1:fork_a', 'b1:shared'),
    ];
    // DFS visits shared_scene via fork_a first, then sees it again via Skip ahead
    const root = asNarrative(buildPlayerTree(nodes, links, 'b1:start'));
    const skipBranch = root.outgoing[0].branches[1];
    const ref = asConvergence(skipBranch.node);
    expect(ref.label).toBe('shared_scene');
    expect(ref.labelId).toBe('b1:shared');
  });

  // ── Cycles ────────────────────────────────────────────────────────────────────

  it('detects a two-node cycle A → B → A', () => {
    const nodes = [n('A'), n('B')];
    const links = [jump('j1', 'A', 'B'), jump('j2', 'B', 'A')];
    const root = asNarrative(buildPlayerTree(nodes, links, 'A'));
    const b = asNarrative(root.outgoing[0].branches[0].node);
    const aRef = asCycle(b.outgoing[0].branches[0].node);
    expect(aRef.cyclesToLabelId).toBe('A');
    expect(aRef.cyclesToLabel).toBe('A');
  });

  it('detects a self-loop A → A', () => {
    const root = asNarrative(buildPlayerTree([n('A')], [jump('j1', 'A', 'A')], 'A'));
    const aRef = asCycle(root.outgoing[0].branches[0].node);
    expect(aRef.cyclesToLabelId).toBe('A');
  });

  it('detects a three-node cycle A → B → C → A', () => {
    const nodes = [n('A'), n('B'), n('C')];
    const links = [jump('j1', 'A', 'B'), jump('j2', 'B', 'C'), jump('j3', 'C', 'A')];
    const root = asNarrative(buildPlayerTree(nodes, links, 'A'));
    const b = asNarrative(root.outgoing[0].branches[0].node);
    const c = asNarrative(b.outgoing[0].branches[0].node);
    expect(asCycle(c.outgoing[0].branches[0].node).cyclesToLabelId).toBe('A');
  });

  it('cycle node carries the human-readable label', () => {
    const nodes = [n('b1:loop', 'loop_start'), n('b1:mid', 'middle')];
    const links = [jump('j1', 'b1:loop', 'b1:mid'), jump('j2', 'b1:mid', 'b1:loop')];
    const root = asNarrative(buildPlayerTree(nodes, links, 'b1:loop'));
    const mid = asNarrative(root.outgoing[0].branches[0].node);
    expect(asCycle(mid.outgoing[0].branches[0].node).cyclesToLabel).toBe('loop_start');
  });

  it('does not confuse a convergence with a cycle (sibling branches, shared destination)', () => {
    // B and C are siblings; B visits D first, C sees it as convergence — not a cycle
    const nodes = [n('A'), n('B'), n('C'), n('D')];
    const links = [
      choice('c1', 'A', 'B', 'Via B', 1),
      choice('c2', 'A', 'C', 'Via C', 1),
      jump('j1', 'B', 'D'),
      jump('j2', 'C', 'D'),
    ];
    const root = asNarrative(buildPlayerTree(nodes, links, 'A'));
    const c = asNarrative(root.outgoing[0].branches[1].node);
    const dRef = c.outgoing[0].branches[0].node;
    expect(dRef.type).toBe('convergence');
  });

  // ── Depth limit ───────────────────────────────────────────────────────────────

  it('produces a continuation node for a chain exceeding maxDepth', () => {
    // A → B → C with maxDepth=1; C is at depth 2 → continuation
    const nodes = [n('A'), n('B'), n('C')];
    const links = [jump('j1', 'A', 'B'), jump('j2', 'B', 'C')];
    const root = asNarrative(buildPlayerTree(nodes, links, 'A', 1));
    const b = asNarrative(root.outgoing[0].branches[0].node);
    const cont = asContinuation(b.outgoing[0].branches[0].node);
    expect(cont.labelId).toBe('C');
  });

  it('fully expands a node at exactly maxDepth', () => {
    const nodes = [n('A'), n('B')];
    const links = [jump('j1', 'A', 'B')];
    // B is at depth 1; maxDepth=1 → B is expanded (depth 1 ≤ maxDepth 1)
    const root = asNarrative(buildPlayerTree(nodes, links, 'A', 1));
    const b = asNarrative(root.outgoing[0].branches[0].node);
    expect(b.labelId).toBe('B');
    expect(b.outgoing).toHaveLength(0);
  });

  it('with maxDepth=0 the root is expanded but its child is a continuation node', () => {
    const nodes = [n('A'), n('B')];
    const links = [jump('j1', 'A', 'B')];
    const root = asNarrative(buildPlayerTree(nodes, links, 'A', 0));
    const cont = asContinuation(root.outgoing[0].branches[0].node);
    expect(cont.labelId).toBe('B');
  });

  it('expands a continuation node when its labelId is in expandedLabelIds', () => {
    // A → B → C with maxDepth=1; C would be a continuation, but if expanded it becomes narrative
    const nodes = [n('A'), n('B'), n('C')];
    const links = [jump('j1', 'A', 'B'), jump('j2', 'B', 'C')];
    const root = asNarrative(buildPlayerTree(nodes, links, 'A', 1, new Set(['C'])));
    const b = asNarrative(root.outgoing[0].branches[0].node);
    const c = asNarrative(b.outgoing[0].branches[0].node);
    expect(c.labelId).toBe('C');
    expect(c.outgoing).toHaveLength(0);
  });

  it('DEFAULT_MAX_DEPTH is a positive integer', () => {
    expect(Number.isInteger(DEFAULT_MAX_DEPTH)).toBe(true);
    expect(DEFAULT_MAX_DEPTH).toBeGreaterThan(0);
  });

  // ── Call links ────────────────────────────────────────────────────────────────

  it('marks call-type links with isCall = true', () => {
    const root = asNarrative(buildPlayerTree([n('A'), n('B')], [callLink('c1', 'A', 'B')], 'A'));
    expect(root.outgoing[0].branches[0].isCall).toBe(true);
  });

  it('marks jump-type links with isCall = false', () => {
    const root = asNarrative(buildPlayerTree([n('A'), n('B')], [jump('j1', 'A', 'B')], 'A'));
    expect(root.outgoing[0].branches[0].isCall).toBe(false);
  });

  it('marks implicit-type links with isCall = false', () => {
    const root = asNarrative(buildPlayerTree([n('A'), n('B')], [impl('i1', 'A', 'B')], 'A'));
    expect(root.outgoing[0].branches[0].isCall).toBe(false);
  });

  // ── Multiple sequential menus ─────────────────────────────────────────────────

  it('builds two outgoing groups for two sequential menus in one label', () => {
    const nodes = [n('A'), n('B'), n('C'), n('D'), n('E')];
    const links = [
      choice('c1', 'A', 'B', 'Early left', 10),
      choice('c2', 'A', 'C', 'Early right', 10),
      choice('c3', 'A', 'D', 'Late left', 20),
      choice('c4', 'A', 'E', 'Late right', 20),
    ];
    const root = asNarrative(buildPlayerTree(nodes, links, 'A'));
    expect(root.outgoing).toHaveLength(2);
    expect(root.outgoing[0].menuLine).toBe(10);
    expect(root.outgoing[1].menuLine).toBe(20);
  });

  it('sorts menu outgoing groups by menuLine ascending regardless of link order', () => {
    const nodes = [n('A'), n('B'), n('C')];
    // Links arrive with higher menuLine first
    const links = [
      choice('c1', 'A', 'C', 'Second menu', 50),
      choice('c2', 'A', 'B', 'First menu', 10),
    ];
    const root = asNarrative(buildPlayerTree(nodes, links, 'A'));
    expect(root.outgoing[0].menuLine).toBe(10);
    expect(root.outgoing[1].menuLine).toBe(50);
  });

  // ── Mixed direct + menu outgoing ──────────────────────────────────────────────

  it('separates direct flow and menu choices into distinct outgoing groups', () => {
    const nodes = [n('A'), n('B'), n('C'), n('D')];
    const links = [
      jump('j1', 'A', 'B'),
      choice('c1', 'A', 'C', 'Option 1', 5),
      choice('c2', 'A', 'D', 'Option 2', 5),
    ];
    const root = asNarrative(buildPlayerTree(nodes, links, 'A'));
    expect(root.outgoing).toHaveLength(2);
    expect(root.outgoing[0].menuLine).toBeUndefined();
    expect(root.outgoing[0].branches[0].choiceText).toBeUndefined();
    expect(root.outgoing[1].menuLine).toBe(5);
    expect(root.outgoing[1].branches[0].choiceText).toBe('Option 1');
  });

  it('groups multiple direct-flow links (no menuLine) into a single outgoing group', () => {
    // Unusual but valid: label has two non-menu outgoing links
    const nodes = [n('A'), n('B'), n('C')];
    const links = [jump('j1', 'A', 'B'), jump('j2', 'A', 'C')];
    const root = asNarrative(buildPlayerTree(nodes, links, 'A'));
    expect(root.outgoing).toHaveLength(1);
    expect(root.outgoing[0].menuLine).toBeUndefined();
    expect(root.outgoing[0].branches).toHaveLength(2);
  });

  // ── Unknown jump target ───────────────────────────────────────────────────────

  it('produces unknown-label terminal when a jump targets a label not in labelNodes', () => {
    const nodes = [n('A')];
    const links = [jump('j1', 'A', 'ghost')];
    const root = asNarrative(buildPlayerTree(nodes, links, 'A'));
    expect(asTerminal(root.outgoing[0].branches[0].node).reason).toBe('unknown-label');
  });

  // ── UID uniqueness ────────────────────────────────────────────────────────────

  it('assigns a unique UID to every node in the tree', () => {
    const nodes = [n('A'), n('B'), n('C'), n('D')];
    const links = [
      choice('c1', 'A', 'B', 'Left', 1),
      choice('c2', 'A', 'C', 'Right', 1),
      jump('j1', 'B', 'D'),
      jump('j2', 'C', 'D'),
    ];
    const uids = collectUids(buildPlayerTree(nodes, links, 'A'));
    expect(new Set(uids).size).toBe(uids.length);
  });

  it('UIDs are non-empty strings', () => {
    const root = buildPlayerTree([n('A')], [], 'A');
    expect(typeof root.uid).toBe('string');
    expect(root.uid.length).toBeGreaterThan(0);
  });

  it('separate buildPlayerTree calls produce independent UID sequences', () => {
    const nodes = [n('A')];
    const r1 = buildPlayerTree(nodes, [], 'A');
    const r2 = buildPlayerTree(nodes, [], 'A');
    // Both counters reset to 0 per call — UIDs are the same (counter-based, not random)
    expect(r1.uid).toBe(r2.uid);
  });

  // ── Subtree isolation after backtracking ──────────────────────────────────────

  it('allows a label to appear in two separate subtrees when not in the same DFS path', () => {
    // X appears as child of both B and C — but B and C are in sibling branches of A.
    // After B's subtree is fully processed (X visited, ancestors unwound), X should
    // NOT be treated as a cycle when reached from C's branch. It IS in `visited`, so
    // it becomes a convergence node.
    const nodes = [n('A'), n('B'), n('C'), n('X')];
    const links = [
      choice('c1', 'A', 'B', 'To B', 1),
      choice('c2', 'A', 'C', 'To C', 1),
      jump('j1', 'B', 'X'),
      jump('j2', 'C', 'X'),
    ];
    const root = asNarrative(buildPlayerTree(nodes, links, 'A'));
    const b = asNarrative(root.outgoing[0].branches[0].node);
    const c = asNarrative(root.outgoing[0].branches[1].node);

    // X is fully expanded under B
    expect(asNarrative(b.outgoing[0].branches[0].node).labelId).toBe('X');
    // X is a convergence reference under C — not a cycle
    const xRef = c.outgoing[0].branches[0].node;
    expect(xRef.type).toBe('convergence');
    expect(asConvergence(xRef).labelId).toBe('X');
  });
});
