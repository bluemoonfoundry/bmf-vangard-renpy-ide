import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import StickyNoteComponent from './StickyNote';
import CanvasContextMenu from './CanvasContextMenu';
import CanvasToolbox from './CanvasToolbox';
import CanvasNavControls from './CanvasNavControls';
import Minimap from './Minimap';
import CanvasNodeContextMenu from './CanvasNodeContextMenu';
import type { MinimapItem } from './Minimap';
import type { LabelNode, RouteLink, MouseGestureSettings, RenpyAnalysisResult, StickyNote } from '@/types';
import { buildPlayerTree, DEFAULT_MAX_DEPTH } from '@/lib/playerTreeBuilder';
import type { PlayerTreeNode } from '@/lib/playerTreeBuilder';
import { computeTreeLayout, DEFAULT_TREE_LAYOUT_CONFIG } from '@/lib/playerTreeLayout';
import type { NodeRect, TreeLayout } from '@/lib/playerTreeLayout';

// ─── Constants ────────────────────────────────────────────────────────────────

const LABEL_MAX    = 26;
const SNIPPET_MAX  = 38;
const CHOICE_MAX   = 24;
const MAX_DEPTH_CAP = 20;

const PILL_COLORS = [
  { text: 'fill-indigo-700  dark:fill-indigo-300',  arrow: 'stroke-indigo-400  dark:stroke-indigo-500'  },
  { text: 'fill-violet-700  dark:fill-violet-300',  arrow: 'stroke-violet-400  dark:stroke-violet-500'  },
  { text: 'fill-sky-700     dark:fill-sky-300',     arrow: 'stroke-sky-400     dark:stroke-sky-500'     },
  { text: 'fill-emerald-700 dark:fill-emerald-300', arrow: 'stroke-emerald-400 dark:stroke-emerald-500' },
  { text: 'fill-orange-700  dark:fill-orange-300',  arrow: 'stroke-orange-400  dark:stroke-orange-500'  },
  { text: 'fill-pink-700    dark:fill-pink-300',    arrow: 'stroke-pink-400    dark:stroke-pink-500'    },
] as const;

// Extra vertical breathing room so branch-arm text labels fit between rows.
const TREE_CFG = { ...DEFAULT_TREE_LAYOUT_CONFIG, verticalGap: 72 };

const RE_CHAR_DLG = /^([a-zA-Z0-9_]+)\s+"([^"]+)"/;
const RE_NARR_DLG = /^"([^"]+)"/;
const RE_SKIP = /^(label|menu|jump|call|return|scene|show|hide|play|stop|pause|window|with|extend|voice|\s*#|$)/;

// ─── Utilities ────────────────────────────────────────────────────────────────

function trunc(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

function buildSnippetMap(
  blocks: { id: string; content: string }[],
  labels: RenpyAnalysisResult['labels'],
  characterTags: Set<string>,
): Map<string, string> {
  const map = new Map<string, string>();
  const byBlock = new Map<string, { label: string; line: number }[]>();
  Object.values(labels).forEach(loc => {
    if (loc.type === 'menu') return;
    const arr = byBlock.get(loc.blockId) ?? [];
    arr.push({ label: loc.label, line: loc.line });
    byBlock.set(loc.blockId, arr);
  });
  blocks.forEach(blk => {
    const sorted = (byBlock.get(blk.id) ?? []).sort((a, b) => a.line - b.line);
    const lines = blk.content.split('\n');
    sorted.forEach((lbl, i) => {
      const start = lbl.line;
      const end = i + 1 < sorted.length ? sorted[i + 1].line - 1 : lines.length;
      for (let j = start; j < end && j < lines.length; j++) {
        const t = (lines[j] ?? '').trim();
        if (RE_SKIP.test(t)) continue;
        const cm = t.match(RE_CHAR_DLG);
        if (cm && characterTags.has(cm[1])) { map.set(`${blk.id}:${lbl.label}`, cm[2]); break; }
        const nm = t.match(RE_NARR_DLG);
        if (nm) { map.set(`${blk.id}:${lbl.label}`, nm[1]); break; }
      }
    });
  });
  return map;
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ChoiceCanvasProps {
  labelNodes: LabelNode[];
  routeLinks: RouteLink[];
  blocks: { id: string; content: string }[];
  analysisResult: RenpyAnalysisResult;
  stickyNotes: StickyNote[];
  onAddStickyNote: (position: { x: number; y: number }) => void;
  updateStickyNote: (id: string, data: Partial<StickyNote>) => void;
  deleteStickyNote: (id: string) => void;
  onOpenEditor: (blockId: string, line: number) => void;
  transform: { x: number; y: number; scale: number };
  onTransformChange: React.Dispatch<React.SetStateAction<{ x: number; y: number; scale: number }>>;
  mouseGestures?: MouseGestureSettings;
  onWarpToLabel: (labelName: string) => void;
  centerOnStartRequest?: { key: number } | null;
  centerOnNodeRequest?: { nodeId: string; key: number } | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

const ChoiceCanvas: React.FC<ChoiceCanvasProps> = ({
  labelNodes: rawLabelNodes,
  routeLinks: rawRouteLinks,
  blocks,
  analysisResult,
  stickyNotes,
  onAddStickyNote,
  updateStickyNote,
  deleteStickyNote,
  onOpenEditor,
  transform,
  onTransformChange,
  mouseGestures,
  onWarpToLabel,
  centerOnStartRequest,
  centerOnNodeRequest,
}) => {
  // ── UI state ──
  const [entryLabelId, setEntryLabelId] = useState<string | null>(null);
  const [maxDepth, setMaxDepth] = useState(DEFAULT_MAX_DEPTH);
  const [collapsedUids, setCollapsedUids] = useState<Set<string>>(new Set());
  const [showSnippets, setShowSnippets] = useState(true);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [canvasContextMenu, setCanvasContextMenu] = useState<{ x: number; y: number; worldPos: { x: number; y: number } } | null>(null);
  const [nodeContextMenu, setNodeContextMenu] = useState<{ x: number; y: number; labelId: string; label: string } | null>(null);
  const [labelSearchQuery, setLabelSearchQuery] = useState('');
  const [showLabelSearchResults, setShowLabelSearchResults] = useState(false);
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });

  const svgRef       = useRef<SVGSVGElement>(null);
  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const announceLiveRef = useRef<HTMLDivElement>(null);
  const istate        = useRef<{ type: 'idle' | 'panning' | 'node'; nodeUid?: string; labelId?: string }>({ type: 'idle' });
  const startClient   = useRef({ x: 0, y: 0 });
  const didMove       = useRef(false);
  const hasFitted     = useRef(false);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickCountRef = useRef(0);

  // ── Filtered inputs ──
  const labelNodes = useMemo(
    () => rawLabelNodes.filter(n => !n.label.startsWith('_')),
    [rawLabelNodes],
  );
  const routeLinks = useMemo(() => {
    const validIds = new Set(labelNodes.map(n => n.id));
    return rawRouteLinks.filter(l => validIds.has(l.sourceId) && validIds.has(l.targetId));
  }, [rawRouteLinks, labelNodes]);

  const labelNodeMap = useMemo(
    () => new Map(labelNodes.map(n => [n.id, n])),
    [labelNodes],
  );

  // ── Snippet extraction ──
  const characterTags = useMemo(
    () => new Set(analysisResult.characters.keys()),
    [analysisResult.characters],
  );
  const snippetMap = useMemo(
    () => buildSnippetMap(blocks, analysisResult.labels, characterTags),
    [blocks, analysisResult.labels, characterTags],
  );

  // ── Entry point selection ──
  const rootLabelIds = useMemo(() => {
    const hasIncoming = new Set(routeLinks.map(l => l.targetId));
    return labelNodes.filter(n => !hasIncoming.has(n.id)).map(n => n.id);
  }, [routeLinks, labelNodes]);

  const effectiveEntryId = useMemo(() => {
    if (entryLabelId && labelNodeMap.has(entryLabelId)) return entryLabelId;
    const startRoot = rootLabelIds.find(id => labelNodeMap.get(id)?.label === 'start');
    return startRoot ?? rootLabelIds[0] ?? labelNodes[0]?.id ?? null;
  }, [entryLabelId, labelNodeMap, rootLabelIds, labelNodes]);

  // ── Tree build + layout ──
  const playerTree = useMemo(() => {
    if (!effectiveEntryId) return null;
    return buildPlayerTree(labelNodes, routeLinks, effectiveEntryId, maxDepth);
  }, [labelNodes, routeLinks, effectiveEntryId, maxDepth]);

  const treeLayout: TreeLayout = useMemo(() => {
    if (!playerTree) return new Map();
    return computeTreeLayout(playerTree, TREE_CFG);
  }, [playerTree]);

  const allRects = useMemo(() => [...treeLayout.values()], [treeLayout]);

  // labelId → first tree uid referencing that label (for external centerOn requests)
  const labelIdToUidMap = useMemo(() => {
    const map = new Map<string, string>();
    function walk(node: PlayerTreeNode): void {
      if (node.type === 'narrative') {
        if (!map.has(node.labelId)) map.set(node.labelId, node.uid);
        for (const group of node.outgoing) {
          for (const branch of group.branches) walk(branch.node);
        }
      }
    }
    if (playerTree) walk(playerTree);
    return map;
  }, [playerTree]);

  // ── Open editor ──
  const openNodeEditor = useCallback((labelId: string) => {
    const n = labelNodeMap.get(labelId);
    if (!n) return;
    onOpenEditor(n.blockId, n.startLine);
  }, [labelNodeMap, onOpenEditor]);

  // ── Fit / center ──
  const fitToScreen = useCallback(() => {
    if (!svgRef.current || allRects.length === 0) return;
    const vp = svgRef.current.getBoundingClientRect();
    const pad = 52;
    const minX = Math.min(...allRects.map(r => r.x));
    const minY = Math.min(...allRects.map(r => r.y));
    const maxX = Math.max(...allRects.map(r => r.x + r.width));
    const maxY = Math.max(...allRects.map(r => r.y + r.height));
    const cw = maxX - minX || 1;
    const ch = maxY - minY || 1;
    const scale = Math.min((vp.width - pad * 2) / cw, (vp.height - pad * 2) / ch, 2);
    onTransformChange({
      x: (vp.width - cw * scale) / 2 - minX * scale,
      y: (vp.height - ch * scale) / 2 - minY * scale,
      scale,
    });
  }, [allRects, onTransformChange]);

  const centerOnTreeNode = useCallback((uid: string) => {
    const rect = treeLayout.get(uid);
    if (!rect || !canvasAreaRef.current) return;
    const { width, height } = canvasAreaRef.current.getBoundingClientRect();
    const ncx = rect.x + rect.width / 2;
    const ncy = rect.y + rect.height / 2;
    onTransformChange(t => {
      const scale = Math.max(t.scale, 1.0);
      return { x: width / 2 - ncx * scale, y: height / 2 - ncy * scale, scale };
    });
  }, [treeLayout, onTransformChange]);

  const centerOnRoot = useCallback(() => {
    if (!playerTree) return;
    centerOnTreeNode(playerTree.uid);
  }, [playerTree, centerOnTreeNode]);

  const centerOnChoiceNode = useCallback((labelId: string) => {
    const uid = labelIdToUidMap.get(labelId);
    if (uid) centerOnTreeNode(uid);
    else if (labelNodeMap.has(labelId)) setEntryLabelId(labelId);
    setShowLabelSearchResults(false);
    setLabelSearchQuery('');
  }, [labelIdToUidMap, centerOnTreeNode, labelNodeMap]);

  // Center on root once on first populated layout
  useEffect(() => {
    if (!hasFitted.current && allRects.length > 0) {
      hasFitted.current = true;
      setTimeout(centerOnRoot, 60);
    }
  }, [allRects, centerOnRoot]);

  const lastCenterStartKey = useRef<number | null>(null);
  useEffect(() => {
    if (!centerOnStartRequest) return;
    if (centerOnStartRequest.key === lastCenterStartKey.current) return;
    lastCenterStartKey.current = centerOnStartRequest.key;
    centerOnRoot();
  }, [centerOnStartRequest, centerOnRoot]);

  const lastCenterNodeKey = useRef<number | null>(null);
  useEffect(() => {
    if (!centerOnNodeRequest) return;
    if (centerOnNodeRequest.key === lastCenterNodeKey.current) return;
    lastCenterNodeKey.current = centerOnNodeRequest.key;
    centerOnChoiceNode(centerOnNodeRequest.nodeId);
  }, [centerOnNodeRequest, centerOnChoiceNode]);

  // ── Label search ──
  const labelSearchResults = useMemo(() => {
    const q = labelSearchQuery.trim().toLowerCase();
    if (!q) return [];
    return labelNodes
      .filter(n => n.label.toLowerCase().includes(q) || (n.containerName ?? '').toLowerCase().includes(q))
      .slice(0, 8);
  }, [labelNodes, labelSearchQuery]);

  // ── Canvas resize observer ──
  useEffect(() => {
    const el = canvasAreaRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setCanvasDimensions({ width, height });
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Wheel zoom ──
  useEffect(() => {
    const el = canvasAreaRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const sens = mouseGestures?.zoomScrollSensitivity ?? 1.0;
      const dir  = mouseGestures?.zoomScrollDirection === 'inverted' ? -1 : 1;
      const delta = -e.deltaY * 0.001 * sens * dir;
      onTransformChange(t => {
        const ns = Math.max(0.05, Math.min(4, t.scale * (1 + delta)));
        const f = ns / t.scale;
        return { x: mx - f * (mx - t.x), y: my - f * (my - t.y), scale: ns };
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onTransformChange, mouseGestures]);

  // ── Pointer: pan + node click ──
  const handlePointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const g = mouseGestures ?? { canvasPanGesture: 'shift-drag' as const, middleMouseAlwaysPans: false, zoomScrollDirection: 'normal' as const, zoomScrollSensitivity: 1 };
    const isMid = (g.canvasPanGesture === 'middle-drag' || g.middleMouseAlwaysPans) && e.button === 1;
    if (e.button !== 0 && !isMid) return;
    if ((e.target as Element).closest('.cc-controls')) return;

    didMove.current = false;
    startClient.current = { x: e.clientX, y: e.clientY };

    const nodeEl = (e.target as Element).closest('[data-ptuid]');
    if (nodeEl) {
      istate.current = {
        type: 'node',
        nodeUid: nodeEl.getAttribute('data-ptuid') ?? '',
        labelId: nodeEl.getAttribute('data-labelid') ?? '',
      };
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    const isPan =
      (g.canvasPanGesture === 'shift-drag' && e.shiftKey && e.button === 0) ||
      (g.canvasPanGesture === 'drag'        && !e.shiftKey && e.button === 0) ||
      isMid;
    if (!isPan) return;
    istate.current = { type: 'panning' };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [mouseGestures]);

  const handlePointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (istate.current.type === 'idle') return;
    if (Math.hypot(e.clientX - startClient.current.x, e.clientY - startClient.current.y) > 4) {
      didMove.current = true;
    }
    if (istate.current.type === 'panning') {
      onTransformChange(t => ({ ...t, x: t.x + e.movementX, y: t.y + e.movementY }));
    }
  }, [onTransformChange]);

  const handlePointerUp = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const collapseEl = (e.target as Element).closest('[data-ptcollapse]');
    if (collapseEl) {
      const uid = collapseEl.getAttribute('data-ptcollapse')!;
      setCollapsedUids(s => { const n = new Set(s); n.has(uid) ? n.delete(uid) : n.add(uid); return n; });
      istate.current = { type: 'idle' };
      if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
      return;
    }

    const s = istate.current;
    if (s.type === 'node' && !didMove.current && s.nodeUid) {
      const uid     = s.nodeUid;
      const labelId = s.labelId ?? '';
      clickCountRef.current += 1;
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => {
        const count = clickCountRef.current;
        clickCountRef.current = 0;
        if (count >= 2) {
          if (labelId) openNodeEditor(labelId);
        } else {
          setSelectedUid(prev => prev === uid ? null : uid);
          setNodeContextMenu(null);
        }
      }, 250);
    } else if (s.type === 'idle' || (s.type === 'panning' && !didMove.current)) {
      setSelectedUid(null);
    }
    istate.current = { type: 'idle' };
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  }, [openNodeEditor]);

  const handleContextMenu = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    if ((e.target as Element).closest('.sticky-note-wrapper, .cc-controls')) return;
    const nodeEl = (e.target as Element).closest('[data-ptuid]');
    if (nodeEl) {
      const labelId = nodeEl.getAttribute('data-labelid') ?? '';
      const label   = nodeEl.getAttribute('data-label') ?? labelId;
      setSelectedUid(nodeEl.getAttribute('data-ptuid'));
      setNodeContextMenu({ x: e.clientX, y: e.clientY, labelId, label });
      return;
    }
    setSelectedUid(null);
    setNodeContextMenu(null);
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCanvasContextMenu({
      x: e.clientX, y: e.clientY,
      worldPos: {
        x: (e.clientX - rect.left - transform.x) / transform.scale,
        y: (e.clientY - rect.top  - transform.y) / transform.scale,
      },
    });
  }, [transform]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
    if (e.key === 'Escape') {
      e.preventDefault();
      setSelectedUid(null);
      if (announceLiveRef.current) announceLiveRef.current.textContent = 'Selection cleared';
    }
  }, []);

  const handleNoteDragStart = useCallback((e: React.PointerEvent<HTMLDivElement>, noteId: string) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button, textarea, input')) return;
    const note = stickyNotes.find(n => n.id === noteId);
    if (!note) return;
    const sx = e.clientX, sy = e.clientY;
    const wx = note.position.x, wy = note.position.y;
    setSelectedNoteIds([noteId]);
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    const onMove = (me: PointerEvent) => {
      updateStickyNote(noteId, { position: { x: wx + (me.clientX - sx) / transform.scale, y: wy + (me.clientY - sy) / transform.scale } });
    };
    const onUp = () => { target.removeEventListener('pointermove', onMove); target.removeEventListener('pointerup', onUp); };
    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerup', onUp);
  }, [stickyNotes, transform.scale, updateStickyNote]);

  // ── Minimap items ──
  const minimapItems = useMemo((): MinimapItem[] =>
    [...treeLayout.entries()].map(([uid, rect]) => ({
      id: uid,
      label: uid,
      blockId: '',
      startLine: 0,
      position: { x: rect.x, y: rect.y },
      width: rect.width,
      height: rect.height,
      type: 'label' as const,
    })),
    [treeLayout],
  );

  // ── Tree rendering walk ──
  const { armElements, nodeElements } = useMemo(() => {
    const arms: React.ReactNode[] = [];
    const nodeEls: React.ReactNode[] = [];
    if (!playerTree) return { armElements: arms, nodeElements: nodeEls };

    function renderArm(
      parentRect: NodeRect,
      childRect: NodeRect,
      node: PlayerTreeNode,
      colorIdx: number,
      isChoice: boolean,
      choiceText: string | undefined,
      condition: string | undefined,
      isCall: boolean,
    ): void {
      const sx = parentRect.x + parentRect.width / 2;
      const sy = parentRect.y + parentRect.height;
      const tx = childRect.x + childRect.width / 2;
      const ty = childRect.y;
      const dy = ty - sy;
      const cp = Math.max(Math.abs(dy) * 0.42, 24);
      const d = `M ${sx} ${sy} C ${sx} ${sy + cp}, ${tx} ${ty - cp}, ${tx} ${ty}`;
      const mx = (sx + tx) / 2;
      const my = sy + dy * 0.38;
      const colors = PILL_COLORS[colorIdx % PILL_COLORS.length];

      arms.push(
        <g key={`arm-${node.uid}`}>
          <path
            d={d}
            className={`fill-none ${isChoice ? colors.arrow : 'stroke-gray-300 dark:stroke-gray-500'}`}
            strokeWidth={1.5}
            markerEnd="url(#pt-arr)"
          />
          {choiceText && (
            <>
              <rect
                x={mx - 66} y={my - 8}
                width={132} height={16}
                rx={4}
                className="fill-white dark:fill-gray-900"
                opacity={0.88}
              />
              <text
                x={mx} y={my}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={9} fontStyle="italic"
                className={colors.text}
              >
                "{trunc(choiceText, CHOICE_MAX)}"
              </text>
            </>
          )}
          {condition && (
            <text
              x={mx} y={my + 14}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={8} fontFamily="ui-monospace, monospace"
              className="fill-amber-700 dark:fill-amber-400"
            >
              if {trunc(condition, 18)}
            </text>
          )}
          {isCall && !choiceText && (
            <text
              x={mx} y={my - 8}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={8}
              className="fill-gray-400 dark:fill-gray-500"
            >
              call
            </text>
          )}
        </g>,
      );
    }

    function walk(node: PlayerTreeNode): void {
      const rect = treeLayout.get(node.uid);
      if (!rect) return;

      if (node.type === 'narrative') {
        const isSelected  = node.uid === selectedUid;
        const isCollapsed = collapsedUids.has(node.uid);
        const nodeCX      = rect.x + rect.width / 2;
        const snippet     = snippetMap.get(node.labelId);
        const showSnip    = showSnippets && !!snippet;

        nodeEls.push(
          <g
            key={node.uid}
            data-ptuid={node.uid}
            data-labelid={node.labelId}
            data-label={node.label}
            tabIndex={0}
            role="button"
            aria-label={`Label: ${node.label}`}
            aria-pressed={isSelected}
            style={{ cursor: 'pointer', outline: 'none' }}
          >
            <rect x={rect.x + 1} y={rect.y + 2} width={rect.width} height={rect.height} rx={8} className="fill-black/[.05] dark:fill-black/20" />
            <rect
              x={rect.x} y={rect.y} width={rect.width} height={rect.height} rx={8}
              className={isSelected
                ? 'fill-indigo-50 dark:fill-indigo-950 stroke-indigo-500 dark:stroke-indigo-400'
                : 'fill-white dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600'}
              strokeWidth={isSelected ? 2 : 1.5}
            />
            <text
              x={nodeCX} y={rect.y + (showSnip ? 22 : rect.height / 2 + 1)}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={11} fontWeight={600} fontFamily="ui-monospace, monospace"
              className="fill-gray-900 dark:fill-gray-100"
            >
              {trunc(node.label, LABEL_MAX)}
            </text>
            {showSnip && snippet && (
              <text
                x={nodeCX} y={rect.y + rect.height - 14}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={9} fontStyle="italic"
                className="fill-gray-400 dark:fill-gray-500"
              >
                "{trunc(snippet, SNIPPET_MAX)}"
              </text>
            )}
            {node.outgoing.length > 0 && (
              <g data-ptcollapse={node.uid} style={{ cursor: 'pointer' }}>
                <circle
                  cx={rect.x + rect.width - 11} cy={rect.y + 11} r={8}
                  className="fill-gray-100 dark:fill-gray-700 stroke-gray-300 dark:stroke-gray-600"
                  strokeWidth={1}
                />
                <text
                  x={rect.x + rect.width - 11} y={rect.y + 11}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={11} fontWeight={700}
                  className="fill-gray-500 dark:fill-gray-400 select-none pointer-events-none"
                >
                  {isCollapsed ? '+' : '−'}
                </text>
              </g>
            )}
            <title>{`${node.label}\nDouble-click to open in editor`}</title>
          </g>,
        );

        if (!isCollapsed) {
          for (const group of node.outgoing) {
            const isChoice = group.menuLine !== undefined;
            for (const branch of group.branches) {
              const childRect = treeLayout.get(branch.node.uid);
              if (childRect) {
                renderArm(rect, childRect, branch.node, branch.colorIdx, isChoice, branch.choiceText, branch.condition, branch.isCall);
              }
              walk(branch.node);
            }
          }
        }
      } else if (node.type === 'convergence') {
        const cx = rect.x + rect.width / 2;
        const cy = rect.y + rect.height / 2;
        nodeEls.push(
          <g key={node.uid}>
            <rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} rx={rect.height / 2}
              className="fill-teal-50 dark:fill-teal-950 stroke-teal-400 dark:stroke-teal-600"
              strokeWidth={1}
            />
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
              fontSize={9} fontFamily="ui-monospace, monospace"
              className="fill-teal-700 dark:fill-teal-300"
            >
              ↩ {trunc(node.label, 22)}
            </text>
          </g>,
        );
      } else if (node.type === 'cycle') {
        const cx = rect.x + rect.width / 2;
        const cy = rect.y + rect.height / 2;
        nodeEls.push(
          <g key={node.uid}>
            <rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} rx={rect.height / 2}
              className="fill-amber-50 dark:fill-amber-950 stroke-amber-400 dark:stroke-amber-600"
              strokeWidth={1}
            />
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
              fontSize={9} fontFamily="ui-monospace, monospace"
              className="fill-amber-700 dark:fill-amber-300"
            >
              ↺ {trunc(node.cyclesToLabel, 22)}
            </text>
          </g>,
        );
      } else if (node.type === 'terminal' && node.reason !== 'depth-limit') {
        const cy = rect.y + rect.height / 2;
        nodeEls.push(
          <rect key={node.uid}
            x={rect.x + rect.width / 4} y={cy - 1}
            width={rect.width / 2} height={2} rx={1}
            className="fill-gray-300 dark:fill-gray-600"
          />,
        );
      }
    }

    walk(playerTree);
    return { armElements: arms, nodeElements: nodeEls };
  }, [playerTree, treeLayout, collapsedUids, showSnippets, selectedUid, snippetMap]);

  const isEmpty = !playerTree || allRects.length === 0;

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="relative w-full h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden select-none">

      {/* ── Toolbar ── */}
      <div className="cc-controls flex-none flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-xs z-10">
        <span className="font-semibold text-gray-600 dark:text-gray-300">Story Tree</span>
        <div className="w-px h-4 bg-gray-200 dark:bg-gray-600 shrink-0" />

        {/* Entry point picker */}
        <label className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <span className="shrink-0">From:</span>
          <select
            value={effectiveEntryId ?? ''}
            onChange={e => setEntryLabelId(e.target.value || null)}
            className="rounded border border-gray-200 dark:border-gray-700 bg-transparent py-0.5 px-1 text-xs text-gray-800 dark:text-gray-200 max-w-[140px]"
          >
            {rootLabelIds.length > 0 && (
              <optgroup label="Story roots">
                {rootLabelIds.map(id => {
                  const n = labelNodeMap.get(id);
                  return <option key={id} value={id}>{n?.label ?? id}</option>;
                })}
              </optgroup>
            )}
            <optgroup label="All labels">
              {labelNodes.map(n => (
                <option key={n.id} value={n.id}>{n.label}</option>
              ))}
            </optgroup>
          </select>
        </label>

        <div className="w-px h-4 bg-gray-200 dark:bg-gray-600 shrink-0" />

        {/* Depth stepper */}
        <label className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <span className="shrink-0">Depth:</span>
          <button
            onClick={() => setMaxDepth(d => Math.max(1, d - 1))}
            className="w-5 h-5 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 leading-none"
            aria-label="Decrease depth"
          >−</button>
          <span className="w-6 text-center font-mono text-gray-800 dark:text-gray-200">{maxDepth}</span>
          <button
            onClick={() => setMaxDepth(d => Math.min(MAX_DEPTH_CAP, d + 1))}
            className="w-5 h-5 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 leading-none"
            aria-label="Increase depth"
          >+</button>
        </label>

        <div className="w-px h-4 bg-gray-200 dark:bg-gray-600 shrink-0" />

        {/* Snippets toggle */}
        <button
          onClick={() => setShowSnippets(v => !v)}
          className={`px-2 py-0.5 rounded border transition-colors ${
            showSnippets
              ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300'
              : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Snippets
        </button>

        {/* Collapse all / expand all */}
        {!isEmpty && (
          <>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-600 shrink-0" />
            <button
              onClick={() => setCollapsedUids(new Set())}
              className="px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Expand all
            </button>
          </>
        )}
      </div>

      {/* ── Canvas ── */}
      <div ref={canvasAreaRef} role="application" aria-label="Story tree canvas" className="flex-1 relative overflow-hidden" onKeyDown={handleKeyDown}>
        <div ref={announceLiveRef} role="status" aria-live="polite" aria-atomic="true" className="sr-only" />

        {/* ── Toolbox (left) ── */}
        <CanvasToolbox label="Story Tree">
          {/* Go to Label */}
          <div className="p-3 flex flex-col gap-1.5">
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Go to Label</h4>
            <input
              value={labelSearchQuery}
              onChange={e => { setLabelSearchQuery(e.target.value); setShowLabelSearchResults(true); }}
              onFocus={() => setShowLabelSearchResults(true)}
              placeholder="Search labels…"
              className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-transparent px-2 py-1.5 text-sm"
            />
            {showLabelSearchResults && labelSearchQuery.trim() && (
              <div className="max-h-44 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700">
                {labelSearchResults.length > 0 ? labelSearchResults.map(n => (
                  <button
                    key={n.id}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => centerOnChoiceNode(n.id)}
                  >
                    <div className="font-mono text-gray-900 dark:text-gray-100">{n.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{n.containerName ?? 'Unknown file'}</div>
                  </button>
                )) : (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">No matching labels.</div>
                )}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Legend</h4>
            <div className="flex items-center gap-2">
              <svg width="22" height="8" aria-hidden="true"><line x1="1" y1="4" x2="15" y2="4" stroke="rgb(129 140 248)" strokeWidth="2" /><polygon points="13,1.5 21,4 13,6.5" fill="rgb(129 140 248)" /></svg>
              Choice branch
            </div>
            <div className="flex items-center gap-2">
              <svg width="22" height="8" aria-hidden="true"><line x1="1" y1="4" x2="15" y2="4" stroke="rgb(209 213 219)" strokeWidth="1.5" /><polygon points="13,1.5 21,4 13,6.5" fill="rgb(209 213 219)" /></svg>
              Direct flow
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[22px] h-3.5 rounded-full bg-teal-50 dark:bg-teal-950 border border-teal-400 dark:border-teal-600 shrink-0" />
              Rejoins path
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[22px] h-3.5 rounded-full bg-amber-50 dark:bg-amber-950 border border-amber-400 dark:border-amber-600 shrink-0" />
              Story loop
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500">
              Click to select · double-click to edit · +/− to collapse
            </div>
          </div>
        </CanvasToolbox>

        {isEmpty ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
            {labelNodes.length === 0
              ? 'No labels found. Open a project to see the story tree.'
              : 'Select an entry point to begin.'}
          </div>
        ) : (
          <svg
            ref={svgRef}
            className="w-full h-full"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onContextMenu={handleContextMenu}
          >
            <defs>
              <marker id="pt-arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M 0 0 L 7 3.5 L 0 7 z" fill="context-stroke" />
              </marker>
            </defs>

            <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
              {armElements}
              {nodeElements}
            </g>
          </svg>
        )}

        {/* ── Sticky notes ── */}
        {stickyNotes.length > 0 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div style={{ position: 'absolute', top: 0, left: 0, transform: `translate(${transform.x}px,${transform.y}px) scale(${transform.scale})`, transformOrigin: '0 0' }}>
              {stickyNotes.map(note => (
                <div key={note.id} style={{ pointerEvents: 'auto' }} onPointerDown={e => handleNoteDragStart(e, note.id)}>
                  <StickyNoteComponent note={note} updateNote={updateStickyNote} deleteNote={deleteStickyNote} isSelected={selectedNoteIds.includes(note.id)} isDragging={false} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Context menus ── */}
        {canvasContextMenu && (
          <CanvasContextMenu
            x={canvasContextMenu.x} y={canvasContextMenu.y}
            onClose={() => setCanvasContextMenu(null)}
            onAddStickyNote={() => onAddStickyNote(canvasContextMenu.worldPos)}
          />
        )}
        {nodeContextMenu && (
          <CanvasNodeContextMenu
            x={nodeContextMenu.x} y={nodeContextMenu.y}
            label={nodeContextMenu.label}
            onClose={() => setNodeContextMenu(null)}
            onOpenEditor={() => openNodeEditor(nodeContextMenu.labelId)}
            onWarpToHere={() => onWarpToLabel(nodeContextMenu.label)}
          />
        )}

        {/* ── Nav + minimap ── */}
        {!isEmpty && (
          <div className="absolute bottom-4 right-4 z-30 flex flex-col items-end gap-1.5" onPointerDown={e => e.stopPropagation()}>
            <CanvasNavControls
              onFit={fitToScreen}
              fitTitle="Fit tree to screen"
              onGoToStart={centerOnRoot}
              hasStart
            />
            <Minimap
              items={minimapItems}
              transform={transform}
              canvasDimensions={canvasDimensions}
              onTransformChange={onTransformChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChoiceCanvas;
