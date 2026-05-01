import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import StickyNoteComponent from './StickyNote';
import CanvasContextMenu from './CanvasContextMenu';
import CanvasToolbox from './CanvasToolbox';
import CanvasNavControls from './CanvasNavControls';
import Minimap from './Minimap';
import CanvasNodeContextMenu from './CanvasNodeContextMenu';
import type { MinimapItem } from './Minimap';
import type { LabelNode, RouteLink, MouseGestureSettings, RenpyAnalysisResult, StickyNote } from '@/types';

// ── World-space layout constants ──────────────────────────────────────────────

const LEFT_CX   = 200;   // center-X of left (parent) column
const CENTER_CX = 500;   // center-X of center node
const PILL_X    = 695;   // left edge of choice pills
const TARGET_CX = 980;   // center-X of right (target) column

const LEFT_W = 220, LEFT_H  = 72;
const CENTER_W = 240, CENTER_H = 100;
const PILL_W = 170, PILL_H = 34;
const TARGET_W = 210, TARGET_H = 68;
const SLOT_H  = 80;   // vertical slot per right-column item
const COL_GAP = 12;   // gap between items in each column
const BASE_Y  = 420;  // world-Y vertical anchor

// ── Panel overlay constants ────────────────────────────────────────────────────
const PANEL_LEFT_X = 40;
const PANEL_LEFT_W = 320;
const PANEL_CENTER_X = 370;
const PANEL_CENTER_W = 260;
const PANEL_RIGHT_X = 640;
const PANEL_RIGHT_W = 520;
const PANEL_Y = 80;
const PANEL_H = 680;

// ── Text constants ─────────────────────────────────────────────────────────────

const LABEL_MAX   = 24;
const SNIPPET_MAX = 34;
const CHOICE_MAX  = 20;
const MAX_BREADCRUMBS = 8; // Limit breadcrumb trail length

const PILL_COLORS = [
  '#4f46e5', '#7c3aed', '#0369a1', '#059669', '#d97706', '#db2777',
] as const;

// ── Utilities ─────────────────────────────────────────────────────────────────

function trunc(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

const RE_CHAR_DLG = /^([a-zA-Z0-9_]+)\s+"([^"]+)"/;
const RE_NARR_DLG = /^"([^"]+)"/;
const RE_SKIP = /^(label|menu|jump|call|return|scene|show|hide|play|stop|pause|window|with|extend|voice|\s*#|$)/;

function buildSnippetMap(
  blocks: { id: string; content: string }[],
  labels: RenpyAnalysisResult['labels'],
  routeLinks: RouteLink[],
  charTags: Set<string>,
): Map<string, string> {
  const map = new Map<string, string>();

  // Group labels by block with node IDs
  const byBlock = new Map<string, { nodeId: string; label: string; line: number }[]>();
  Object.entries(labels).forEach(([nodeId, loc]) => {
    if (loc.type === 'menu') return;
    const arr = byBlock.get(loc.blockId) ?? [];
    arr.push({ nodeId, label: loc.label, line: loc.line });
    byBlock.set(loc.blockId, arr);
  });

  // Group menu lines by source label name (not full node ID)
  const menusByNode = new Map<string, number[]>();
  routeLinks.forEach(link => {
    if (link.menuLine !== undefined) {
      // Extract label name from "blockId:labelName" format
      const labelName = link.sourceId.split(':')[1] || link.sourceId;
      const arr = menusByNode.get(labelName) ?? [];
      if (!arr.includes(link.menuLine)) arr.push(link.menuLine);
      menusByNode.set(labelName, arr);
    }
  });

  blocks.forEach(blk => {
    const sorted = (byBlock.get(blk.id) ?? []).sort((a, b) => a.line - b.line);
    const lines = blk.content.split('\n');

    sorted.forEach((lbl, i) => {
      const start = lbl.line;
      const end = i + 1 < sorted.length ? sorted[i + 1].line - 1 : lines.length;
      const menuLines = menusByNode.get(lbl.nodeId);

      let snippet: string | null = null;

      // If this label has menus, try menu-aware snippet extraction
      if (menuLines && menuLines.length > 0) {
        // menuLine is 1-based, so convert to 0-based for array indexing
        const firstMenuLine0 = Math.min(...menuLines) - 1;

        // Priority 1: Menu prompt text (first string after "menu:" that's not a choice)
        // Scan forward from menu line to find prompt
        for (let k = firstMenuLine0 + 1; k < Math.min(firstMenuLine0 + 8, end, lines.length); k++) {
          const promptLine = (lines[k] ?? '').trim();
          if (!promptLine || promptLine.startsWith('#')) continue;
          // Menu prompt is a quoted string without a trailing colon
          const promptMatch = promptLine.match(/^"([^"]+)"$/);
          if (promptMatch) {
            snippet = promptMatch[1];
            break;
          }
          // Stop if we hit a choice (quoted string with colon)
          if (promptLine.match(/^"[^"]*":/)) break;
        }

        // Priority 2: Last say/narration before menu
        if (!snippet) {
          for (let j = firstMenuLine0 - 1; j >= start; j--) {
            const t = (lines[j] ?? '').trim();
            if (!t || t.startsWith('#')) continue; // Skip empty lines and comments
            if (t.startsWith('label') || t === 'menu:' || t.startsWith('menu ')) continue; // Skip label/menu lines
            // Skip other Ren'Py commands
            if (RE_SKIP.test(t)) continue;
            const cm = t.match(RE_CHAR_DLG);
            if (cm && charTags.has(cm[1])) {
              snippet = cm[2];
              break;
            }
            const nm = t.match(RE_NARR_DLG);
            if (nm) {
              snippet = nm[1];
              break;
            }
          }
        }
      }

      // Priority 3 (or fallback): First say/narration after label
      if (!snippet) {
        for (let j = start; j < end && j < lines.length; j++) {
          const t = (lines[j] ?? '').trim();
          if (RE_SKIP.test(t)) continue;
          const cm = t.match(RE_CHAR_DLG);
          if (cm && charTags.has(cm[1])) {
            snippet = cm[2];
            break;
          }
          const nm = t.match(RE_NARR_DLG);
          if (nm) {
            snippet = nm[1];
            break;
          }
        }
      }

      if (snippet) {
        map.set(`${blk.id}:${lbl.label}`, snippet);
      }
    });
  });

  return map;
}

/** Stacks `count` items of height `slotH` with `gap` between, centered on `anchorY`. */
function stackYs(count: number, slotH: number, gap: number, anchorY: number): number[] {
  if (count === 0) return [];
  const total = count * slotH + (count - 1) * gap;
  const top   = anchorY - total / 2;
  return Array.from({ length: count }, (_, i) => top + i * (slotH + gap));
}

// ── Types ─────────────────────────────────────────────────────────────────────

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

interface RightSlot {
  key: string;
  type: 'choice' | 'direct';
  targetId: string;
  targetLabel: string;
  targetSnippet?: string;
  choiceText?: string;
  condition?: string;
  isCall: boolean;
  colorIdx: number;
  slotY: number;
}

interface NeighborhoodLayout {
  centerNode: LabelNode | null;
  centerY: number;
  centerSnippet?: string;
  parents: { nodeId: string; label: string; snippet?: string; y: number }[];
  rightSlots: RightSlot[];
}

// ── Component ─────────────────────────────────────────────────────────────────

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
  const [currentNodeId, setCurrentNodeId]       = useState<string | null>(null);
  const [breadcrumbTrail, setBreadcrumbTrail]   = useState<{ id: string; label: string }[]>([]);
  const [showSnippets, setShowSnippets]         = useState(true);
  const [showPanels, setShowPanels]             = useState(true);
  const [canvasContextMenu, setCanvasContextMenu] = useState<{ x: number; y: number; worldPos: { x: number; y: number } } | null>(null);
  const [nodeContextMenu, setNodeContextMenu]   = useState<{ x: number; y: number; labelId: string; label: string } | null>(null);
  const [labelSearchQuery, setLabelSearchQuery] = useState('');
  const [showLabelSearchResults, setShowLabelSearchResults] = useState(false);
  const [selectedNoteIds, setSelectedNoteIds]   = useState<string[]>([]);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const [isTransitioning, setIsTransitioning]   = useState(false);

  const svgRef        = useRef<SVGSVGElement>(null);
  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const istate        = useRef<{ type: 'idle' | 'panning' }>({ type: 'idle' });
  const startClient   = useRef({ x: 0, y: 0 });
  const didMove       = useRef(false);
  const hasCentered   = useRef(false);
  const lastNodeRef   = useRef<string | null>(null);

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

  // ── Default entry node ──
  const defaultNodeId = useMemo(() => {
    const startNode = labelNodes.find(n => n.label === 'start');
    if (startNode) return startNode.id;
    const menuSources = new Set(rawRouteLinks.filter(l => l.menuLine !== undefined).map(l => l.sourceId));
    const menuNode = labelNodes.find(n => menuSources.has(n.id));
    if (menuNode) return menuNode.id;
    const withOut = new Set(rawRouteLinks.map(l => l.sourceId));
    return labelNodes.find(n => withOut.has(n.id))?.id ?? labelNodes[0]?.id ?? null;
  }, [labelNodes, rawRouteLinks]);

  const effectiveNodeId = (currentNodeId && labelNodeMap.has(currentNodeId))
    ? currentNodeId
    : defaultNodeId;

  // ── Snippets & Menu Lines ──
  const charTags = useMemo(() => new Set(analysisResult.characters.keys()), [analysisResult.characters]);
  const snippetMap = useMemo(
    () => buildSnippetMap(blocks, analysisResult.labels, routeLinks, charTags),
    [blocks, analysisResult.labels, routeLinks, charTags],
  );

  // Map label node IDs to their menu line numbers (for "Open in Editor")
  const menuLinesByNodeId = useMemo(() => {
    const map = new Map<string, number>();
    routeLinks.forEach(link => {
      if (link.menuLine !== undefined && !map.has(link.sourceId)) {
        map.set(link.sourceId, link.menuLine);
      }
    });
    return map;
  }, [routeLinks]);

  // ── Navigate forward (push current to breadcrumb) ──
  const navigateTo = useCallback((targetId: string) => {
    if (!labelNodeMap.has(targetId)) return;
    if (targetId === effectiveNodeId) return;

    setIsTransitioning(true);

    const prevNode = effectiveNodeId ? labelNodeMap.get(effectiveNodeId) : null;
    if (prevNode && effectiveNodeId) {
      setBreadcrumbTrail(prev => {
        const newTrail = [...prev, { id: effectiveNodeId, label: prevNode.label }];
        // Limit breadcrumb trail length
        if (newTrail.length > MAX_BREADCRUMBS) {
          return newTrail.slice(newTrail.length - MAX_BREADCRUMBS);
        }
        return newTrail;
      });
    }
    setCurrentNodeId(targetId);

    // Clear transitioning flag after animation completes
    setTimeout(() => setIsTransitioning(false), 500);
  }, [labelNodeMap, effectiveNodeId]);

  // ── Navigate to a breadcrumb (trim trail) ──
  const navigateToBreadcrumb = useCallback((crumbId: string, sliceAt: number) => {
    setIsTransitioning(true);
    setCurrentNodeId(crumbId);
    setBreadcrumbTrail(prev => prev.slice(0, sliceAt));
    setTimeout(() => setIsTransitioning(false), 500);
  }, []);

  // ── 3-column neighborhood layout ──
  const layout = useMemo((): NeighborhoodLayout => {
    const centerNode = effectiveNodeId ? (labelNodeMap.get(effectiveNodeId) ?? null) : null;
    if (!centerNode) return { centerNode: null, centerY: BASE_Y - CENTER_H / 2, parents: [], rightSlots: [] };

    const id = centerNode.id;
    const centerSnippet = snippetMap.get(`${centerNode.blockId}:${centerNode.label}`);

    // Parents: unique sources with a link to current node
    const parentIds = [...new Set(
      routeLinks.filter(l => l.targetId === id).map(l => l.sourceId),
    )].filter(pid => labelNodeMap.has(pid));

    // Outgoing: group by menuLine
    const outgoing = routeLinks.filter(l => l.sourceId === id);
    const menuMap  = new Map<number, RouteLink[]>();
    const directs: RouteLink[] = [];
    for (const link of outgoing) {
      if (link.menuLine !== undefined) {
        const arr = menuMap.get(link.menuLine) ?? [];
        arr.push(link);
        menuMap.set(link.menuLine, arr);
      } else {
        directs.push(link);
      }
    }

    // Build right slots: menu choices first (sorted by menuLine), then direct jumps
    const slots: Omit<RightSlot, 'slotY'>[] = [];
    let colorCounter = 0;
    const sortedMenuLines = [...menuMap.keys()].sort((a, b) => a - b);
    for (const ml of sortedMenuLines) {
      for (const link of menuMap.get(ml)!) {
        const tgt = labelNodeMap.get(link.targetId);
        slots.push({
          key: link.id,
          type: 'choice',
          targetId: link.targetId,
          targetLabel: tgt?.label ?? link.targetId,
          targetSnippet: tgt ? snippetMap.get(`${tgt.blockId}:${tgt.label}`) : undefined,
          choiceText: link.choiceText,
          condition: link.choiceCondition,
          isCall: link.type === 'call',
          colorIdx: colorCounter++ % PILL_COLORS.length,
        });
      }
    }
    for (const link of directs) {
      const tgt = labelNodeMap.get(link.targetId);
      slots.push({
        key: link.id,
        type: 'direct',
        targetId: link.targetId,
        targetLabel: tgt?.label ?? link.targetId,
        targetSnippet: tgt ? snippetMap.get(`${tgt.blockId}:${tgt.label}`) : undefined,
        isCall: link.type === 'call',
        colorIdx: 0,
      });
    }

    const rightYs   = stackYs(slots.length, SLOT_H, COL_GAP, BASE_Y);
    const rightSlots = slots.map((s, i) => ({ ...s, slotY: rightYs[i] }));

    const parentYs = stackYs(parentIds.length, LEFT_H, COL_GAP, BASE_Y);
    const parents  = parentIds.map((pid, i) => {
      const pn = labelNodeMap.get(pid)!;
      return { nodeId: pid, label: pn.label, snippet: snippetMap.get(`${pn.blockId}:${pn.label}`), y: parentYs[i] };
    });

    return { centerNode, centerY: BASE_Y - CENTER_H / 2, centerSnippet, parents, rightSlots };
  }, [effectiveNodeId, labelNodeMap, routeLinks, snippetMap]);

  // ── Auto-center on node change with smooth animation ──
  const centerOnCurrent = useCallback((smooth = true) => {
    const el = canvasAreaRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();

    if (smooth) {
      // Use requestAnimationFrame for smooth transitions
      const targetX = width  / 2 - CENTER_CX * transform.scale;
      const targetY = height / 2 - BASE_Y   * transform.scale;

      const startX = transform.x;
      const startY = transform.y;
      const duration = 400; // ms
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);

        onTransformChange(t => ({
          ...t,
          x: startX + (targetX - startX) * eased,
          y: startY + (targetY - startY) * eased,
        }));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    } else {
      // Instant centering for initial load
      onTransformChange(t => ({
        ...t,
        x: width  / 2 - CENTER_CX * t.scale,
        y: height / 2 - BASE_Y   * t.scale,
      }));
    }
  }, [onTransformChange, transform.x, transform.y, transform.scale]);

  useEffect(() => {
    const changed = lastNodeRef.current !== effectiveNodeId;
    lastNodeRef.current = effectiveNodeId;
    if (!hasCentered.current) {
      // Initial center: instant
      hasCentered.current = true;
      setTimeout(() => centerOnCurrent(false), 60);
    } else if (changed) {
      // Subsequent navigation: smooth
      setTimeout(() => centerOnCurrent(true), 60);
    }
  }, [effectiveNodeId, centerOnCurrent]);

  // ── External center requests ──
  const lastCenterStartKey = useRef<number | null>(null);
  useEffect(() => {
    if (!centerOnStartRequest || centerOnStartRequest.key === lastCenterStartKey.current) return;
    lastCenterStartKey.current = centerOnStartRequest.key;
    setIsTransitioning(true);
    setCurrentNodeId(defaultNodeId);
    setBreadcrumbTrail([]);
    setTimeout(() => {
      centerOnCurrent(true);
      setTimeout(() => setIsTransitioning(false), 500);
    }, 60);
  }, [centerOnStartRequest, defaultNodeId, centerOnCurrent]);

  const lastCenterNodeKey = useRef<number | null>(null);
  useEffect(() => {
    if (!centerOnNodeRequest || centerOnNodeRequest.key === lastCenterNodeKey.current) return;
    lastCenterNodeKey.current = centerOnNodeRequest.key;
    navigateTo(centerOnNodeRequest.nodeId);
    setLabelSearchQuery('');
    setShowLabelSearchResults(false);
    setTimeout(() => centerOnCurrent(true), 60);
  }, [centerOnNodeRequest, navigateTo, centerOnCurrent]);

  // ── Fit to screen with smooth animation ──
  const fitToScreen = useCallback(() => {
    const el = canvasAreaRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const { parents, rightSlots, centerY } = layout;
    const allYs = [
      centerY, centerY + CENTER_H,
      ...parents.flatMap(p => [p.y, p.y + LEFT_H]),
      ...rightSlots.flatMap(s => [s.slotY, s.slotY + SLOT_H]),
    ];
    if (allYs.length === 0) { centerOnCurrent(true); return; }
    const minX = LEFT_CX - LEFT_W / 2 - 24;
    const maxX = TARGET_CX + TARGET_W / 2 + 24;
    const minY = Math.min(...allYs) - 24;
    const maxY = Math.max(...allYs) + 24;
    const cw   = maxX - minX;
    const ch   = maxY - minY;
    const targetScale = Math.min((width - 32) / cw, (height - 32) / ch, 2.5);
    const targetX = (width  - cw * targetScale) / 2 - minX * targetScale;
    const targetY = (height - ch * targetScale) / 2 - minY * targetScale;

    // Smooth animation
    const startX = transform.x;
    const startY = transform.y;
    const startScale = transform.scale;
    const duration = 400;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      onTransformChange({
        x: startX + (targetX - startX) * eased,
        y: startY + (targetY - startY) * eased,
        scale: startScale + (targetScale - startScale) * eased,
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [layout, centerOnCurrent, onTransformChange, transform.x, transform.y, transform.scale]);

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
      const mx   = e.clientX - rect.left;
      const my   = e.clientY - rect.top;
      const sens = mouseGestures?.zoomScrollSensitivity ?? 1.0;
      const dir  = mouseGestures?.zoomScrollDirection === 'inverted' ? -1 : 1;
      const delta = -e.deltaY * 0.001 * sens * dir;
      onTransformChange(t => {
        const ns = Math.max(0.1, Math.min(4, t.scale * (1 + delta)));
        const f  = ns / t.scale;
        return { x: mx - f * (mx - t.x), y: my - f * (my - t.y), scale: ns };
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onTransformChange, mouseGestures]);

  // ── Pointer events (pan + click detection) ──
  const handlePointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const g = mouseGestures ?? { canvasPanGesture: 'shift-drag' as const, middleMouseAlwaysPans: false, zoomScrollDirection: 'normal' as const, zoomScrollSensitivity: 1 };
    const isMid = (g.canvasPanGesture === 'middle-drag' || g.middleMouseAlwaysPans) && e.button === 1;
    if (e.button !== 0 && !isMid) return;
    if ((e.target as Element).closest('.cc-controls')) return;
    // Don't capture if clicking a navigable element — let pointerUp handle it
    if ((e.target as Element).closest('[data-nav]')) return;
    didMove.current = false;
    startClient.current = { x: e.clientX, y: e.clientY };
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
    const wasPanning = istate.current.type === 'panning';
    istate.current = { type: 'idle' };
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);

    // Only handle navigation on left-click (button 0), not right-click
    if (!wasPanning && !didMove.current && e.button === 0) {
      const navEl = (e.target as Element).closest('[data-nav]');
      if (navEl) {
        navigateTo(navEl.getAttribute('data-nav')!);
        return;
      }
    }

    if (!didMove.current) setCanvasContextMenu(null);
  }, [navigateTo]);

  const handleContextMenu = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    if ((e.target as Element).closest('.sticky-note-wrapper, .cc-controls')) return;
    const nodeEl = (e.target as Element).closest('[data-nodeid]');
    if (nodeEl) {
      const labelId = nodeEl.getAttribute('data-nodeid') ?? '';
      const label   = nodeEl.getAttribute('data-label') ?? labelId;
      setNodeContextMenu({ x: e.clientX, y: e.clientY, labelId, label });
      return;
    }
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

  // ── Open editor ──
  const openNodeEditor = useCallback((labelId: string) => {
    const n = labelNodeMap.get(labelId);
    if (!n) return;

    // If this label has a menu, open at the menu line instead of the label line
    const nodeId = `${n.blockId}:${n.label}`;
    const menuLine = menuLinesByNodeId.get(nodeId);
    const lineToOpen = menuLine !== undefined ? menuLine : n.startLine;

    onOpenEditor(n.blockId, lineToOpen);
  }, [labelNodeMap, menuLinesByNodeId, onOpenEditor]);

  // ── Sticky note drag ──
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
  const minimapItems = useMemo((): MinimapItem[] => {
    const items: MinimapItem[] = [];
    const { centerNode, centerY, parents, rightSlots } = layout;
    if (centerNode) {
      items.push({ id: centerNode.id, position: { x: CENTER_CX - CENTER_W / 2, y: centerY }, width: CENTER_W, height: CENTER_H, type: 'label' as const });
    }
    parents.forEach(p => items.push({ id: p.nodeId, position: { x: LEFT_CX - LEFT_W / 2, y: p.y }, width: LEFT_W, height: LEFT_H, type: 'label' as const }));
    rightSlots.forEach(s => items.push({ id: `${s.key}-tgt`, position: { x: TARGET_CX - TARGET_W / 2, y: s.slotY }, width: TARGET_W, height: TARGET_H, type: 'label' as const }));
    return items;
  }, [layout]);

  // ── SVG rendering ──
  const { armEls, nodeEls } = useMemo(() => {
    const armEls: React.ReactNode[] = [];
    const nodeEls: React.ReactNode[] = [];
    const { centerNode, centerY, centerSnippet, parents, rightSlots } = layout;
    if (!centerNode) return { armEls, nodeEls };

    const cnLeft = CENTER_CX - CENTER_W / 2;
    const cnMidY = centerY + CENTER_H / 2;

    // Animation delay multipliers for staggered entrance
    const fadeInStyle = (delayMs: number) => ({
      animation: isTransitioning ? 'none' : `fadeInNode 300ms ease-out ${delayMs}ms both`,
    });

    // ── Center node ──────────────────────────────────────────────────────────
    nodeEls.push(
      <g key="center" data-nodeid={centerNode.id} data-label={centerNode.label} style={fadeInStyle(0)}>
        <rect x={cnLeft + 2} y={centerY + 2} width={CENTER_W} height={CENTER_H} rx={9} fill="rgba(0,0,0,0.07)" />
        <rect
          x={cnLeft} y={centerY} width={CENTER_W} height={CENTER_H} rx={8}
          className="fill-indigo-50 dark:fill-indigo-950 stroke-indigo-400 dark:stroke-indigo-500"
          strokeWidth={2.5}
        />
        <text
          x={CENTER_CX} y={centerY + (showSnippets && centerSnippet ? 30 : CENTER_H / 2 + 1)}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={12} fontWeight={700} fontFamily="ui-monospace, monospace"
          className="fill-indigo-900 dark:fill-indigo-100 pointer-events-none"
        >
          {trunc(centerNode.label, LABEL_MAX)}
        </text>
        {showSnippets && centerSnippet && (
          <text
            x={CENTER_CX} y={centerY + CENTER_H - 20}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={9} fontStyle="italic"
            className="fill-gray-500 dark:fill-gray-400 pointer-events-none"
          >
            "{trunc(centerSnippet, SNIPPET_MAX)}"
          </text>
        )}
        <title>{centerNode.label}</title>
      </g>,
    );

    // ── Parent nodes (left column) ───────────────────────────────────────────
    parents.forEach((p, idx) => {
      const px  = LEFT_CX - LEFT_W / 2;
      const pMY = p.y + LEFT_H / 2;

      // Bezier: parent right edge → center left edge
      const sx = LEFT_CX + LEFT_W / 2;
      const tx = cnLeft;
      const cp = (tx - sx) * 0.55;
      armEls.push(
        <path key={`arm-in-${p.nodeId}`}
          d={`M ${sx} ${pMY} C ${sx + cp} ${pMY}, ${tx - cp} ${cnMidY}, ${tx} ${cnMidY}`}
          className="fill-none stroke-gray-300 dark:stroke-gray-500"
          strokeWidth={1.5} markerEnd="url(#wdb-arr)"
          style={fadeInStyle(50 + idx * 30)}
        />,
      );

      nodeEls.push(
        <g
          key={`parent-${p.nodeId}`}
          data-nodeid={p.nodeId} data-label={p.label}
          data-nav={p.nodeId}
          role="button" aria-label={`Navigate to parent: ${p.label}`}
          style={{ cursor: 'pointer', ...fadeInStyle(50 + idx * 30) }}
        >
          <rect x={px + 2} y={p.y + 2} width={LEFT_W} height={LEFT_H} rx={7} fill="rgba(0,0,0,0.05)" />
          <rect x={px} y={p.y} width={LEFT_W} height={LEFT_H} rx={7}
            className="fill-white dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600"
            strokeWidth={1.5}
          />
          <text
            x={LEFT_CX} y={p.y + (showSnippets && p.snippet ? 22 : LEFT_H / 2 + 1)}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={10} fontWeight={600} fontFamily="ui-monospace, monospace"
            className="fill-gray-800 dark:fill-gray-200 pointer-events-none"
          >
            {trunc(p.label, LABEL_MAX)}
          </text>
          {showSnippets && p.snippet && (
            <text
              x={LEFT_CX} y={p.y + LEFT_H - 14}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={8} fontStyle="italic"
              className="fill-gray-400 dark:fill-gray-500 pointer-events-none"
            >
              "{trunc(p.snippet, 20)}"
            </text>
          )}
          <title>{`${p.label} — click to navigate`}</title>
        </g>,
      );
    });

    // ── Right column (choice pills + target nodes) ───────────────────────────
    rightSlots.forEach((slot, idx) => {
      const color  = PILL_COLORS[slot.colorIdx % PILL_COLORS.length];
      const tgtX   = TARGET_CX - TARGET_W / 2;
      const rightDelay = 100 + idx * 40;

      if (slot.type === 'choice') {
        const pillY   = slot.slotY + (SLOT_H - PILL_H) / 2;
        const pillMY  = pillY + PILL_H / 2;
        const pillRX  = PILL_X + PILL_W;
        const tCardY  = slot.slotY + (SLOT_H - TARGET_H) / 2;
        const tCardMY = tCardY + TARGET_H / 2;

        // Center → pill
        const cp1 = (PILL_X - (CENTER_CX + CENTER_W / 2)) * 0.55;
        armEls.push(
          <path key={`arm-cpill-${slot.key}`}
            d={`M ${CENTER_CX + CENTER_W / 2} ${cnMidY} C ${CENTER_CX + CENTER_W / 2 + cp1} ${cnMidY}, ${PILL_X - cp1} ${pillMY}, ${PILL_X} ${pillMY}`}
            fill="none" stroke={color} strokeWidth={1.5} opacity={0.75}
            markerEnd="url(#wdb-arr)"
            style={fadeInStyle(rightDelay)}
          />,
        );

        // Pill → target card
        const cp2 = (tgtX - pillRX) * 0.55;
        armEls.push(
          <path key={`arm-ptgt-${slot.key}`}
            d={`M ${pillRX} ${pillMY} C ${pillRX + cp2} ${pillMY}, ${tgtX - cp2} ${tCardMY}, ${tgtX} ${tCardMY}`}
            fill="none" stroke={color} strokeWidth={1} opacity={0.4}
            style={fadeInStyle(rightDelay + 50)}
          />,
        );

        // Choice pill
        nodeEls.push(
          <g key={`pill-${slot.key}`} data-nav={slot.targetId} role="button" aria-label={`Choice: ${slot.choiceText ?? slot.targetLabel}`} style={{ cursor: 'pointer', ...fadeInStyle(rightDelay) }}>
            <rect x={PILL_X} y={pillY} width={PILL_W} height={PILL_H} rx={PILL_H / 2} fill={color} opacity={0.92} />
            {/* Choice text */}
            <text
              x={PILL_X + (slot.condition ? PILL_W * 0.44 : PILL_W / 2)} y={pillMY}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={9} fontWeight={600} fill="#fff"
              style={{ pointerEvents: 'none' }}
            >
              {trunc(slot.choiceText ?? slot.targetLabel, CHOICE_MAX)}
            </text>
            {/* Condition warning badge */}
            {slot.condition && (
              <text
                x={PILL_X + PILL_W - 11} y={pillMY}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={12} fill="#fcd34d"
                style={{ pointerEvents: 'none' }}
              >⚠</text>
            )}
            <title>{slot.condition ? `if ${slot.condition}\n→ ${slot.targetLabel}` : (slot.choiceText ?? slot.targetLabel)}</title>
          </g>,
        );

        // Target mini-card
        nodeEls.push(
          <g key={`tgt-${slot.key}`} data-nodeid={slot.targetId} data-label={slot.targetLabel} data-nav={slot.targetId} role="button" aria-label={`Navigate to: ${slot.targetLabel}`} style={{ cursor: 'pointer', ...fadeInStyle(rightDelay + 50) }}>
            <rect x={tgtX + 2} y={tCardY + 2} width={TARGET_W} height={TARGET_H} rx={7} fill="rgba(0,0,0,0.05)" />
            <rect x={tgtX} y={tCardY} width={TARGET_W} height={TARGET_H} rx={7}
              className="fill-white dark:fill-gray-800"
              stroke={color} strokeWidth={1.5} opacity={0.85}
            />
            <text
              x={TARGET_CX} y={tCardY + (showSnippets && slot.targetSnippet ? 22 : TARGET_H / 2 + 1)}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={10} fontWeight={600} fontFamily="ui-monospace, monospace"
              className="fill-gray-800 dark:fill-gray-200 pointer-events-none"
            >
              {trunc(slot.targetLabel, LABEL_MAX)}
            </text>
            {showSnippets && slot.targetSnippet && (
              <text
                x={TARGET_CX} y={tCardY + TARGET_H - 16}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={8} fontStyle="italic"
                className="fill-gray-400 dark:fill-gray-500 pointer-events-none"
              >
                "{trunc(slot.targetSnippet, 20)}"
              </text>
            )}
            <title>{`${slot.targetLabel} — click to navigate`}</title>
          </g>,
        );

      } else {
        // Direct jump: center → target card only
        const tCardY  = slot.slotY + (SLOT_H - TARGET_H) / 2;
        const tCardMY = tCardY + TARGET_H / 2;
        const sx = CENTER_CX + CENTER_W / 2;
        const cp = (tgtX - sx) * 0.55;
        armEls.push(
          <path key={`arm-direct-${slot.key}`}
            d={`M ${sx} ${cnMidY} C ${sx + cp} ${cnMidY}, ${tgtX - cp} ${tCardMY}, ${tgtX} ${tCardMY}`}
            className="fill-none stroke-gray-400 dark:stroke-gray-500"
            strokeWidth={1.5} markerEnd="url(#wdb-arr)"
            style={fadeInStyle(rightDelay)}
          />,
        );
        nodeEls.push(
          <g key={`direct-${slot.key}`} data-nodeid={slot.targetId} data-label={slot.targetLabel} data-nav={slot.targetId} role="button" aria-label={`Navigate to: ${slot.targetLabel}`} style={{ cursor: 'pointer', ...fadeInStyle(rightDelay) }}>
            <rect x={tgtX + 2} y={tCardY + 2} width={TARGET_W} height={TARGET_H} rx={7} fill="rgba(0,0,0,0.05)" />
            <rect x={tgtX} y={tCardY} width={TARGET_W} height={TARGET_H} rx={7}
              className="fill-white dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600"
              strokeWidth={1.5}
            />
            <text
              x={TARGET_CX} y={tCardY + (showSnippets && slot.targetSnippet ? 22 : TARGET_H / 2 + 1)}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={10} fontWeight={600} fontFamily="ui-monospace, monospace"
              className="fill-gray-800 dark:fill-gray-200 pointer-events-none"
            >
              {trunc(slot.targetLabel, LABEL_MAX)}
            </text>
            {showSnippets && slot.targetSnippet && (
              <text
                x={TARGET_CX} y={tCardY + TARGET_H - 16}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={8} fontStyle="italic"
                className="fill-gray-400 dark:fill-gray-500 pointer-events-none"
              >
                "{trunc(slot.targetSnippet, 20)}"
              </text>
            )}
            {slot.isCall && (
              <text x={TARGET_CX} y={tCardY - 9} textAnchor="middle" fontSize={8} className="fill-gray-400 dark:fill-gray-500 pointer-events-none">call</text>
            )}
            <title>{`${slot.targetLabel} — click to navigate`}</title>
          </g>,
        );
      }
    });

    return { armEls, nodeEls };
  }, [layout, showSnippets, isTransitioning]);

  const isEmpty = !layout.centerNode;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden select-none">

      {/* ── Toolbar ── */}
      <div className="cc-controls flex-none flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-xs z-10">
        <span className="font-semibold text-gray-600 dark:text-gray-300">Walkthrough Debugger</span>
        <div className="w-px h-4 bg-gray-200 dark:bg-gray-600 shrink-0" />

        {/* Current node indicator */}
        {effectiveNodeId && (
          <span className="font-mono text-indigo-600 dark:text-indigo-400 truncate max-w-[160px]">
            {labelNodeMap.get(effectiveNodeId)?.label ?? effectiveNodeId}
          </span>
        )}

        <div className="flex-1" />

        {/* Panel overlay toggle */}
        <button
          onClick={() => setShowPanels(v => !v)}
          className={`px-2 py-0.5 rounded border transition-colors ${
            showPanels
              ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300'
              : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          title="Show/hide panel overlays"
        >
          Panels
        </button>

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
      </div>

      {/* ── Breadcrumb trail ── */}
      {breadcrumbTrail.length > 0 && (
        <div className="cc-controls flex-none flex items-center gap-1 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 border-b border-indigo-200 dark:border-indigo-800 text-xs overflow-x-auto">
          {breadcrumbTrail.length >= MAX_BREADCRUMBS && (
            <span
              className="shrink-0 text-indigo-400 dark:text-indigo-500 font-semibold"
              title="Earlier breadcrumbs truncated"
            >
              …
            </span>
          )}
          {breadcrumbTrail.map((crumb, i) => (
            <React.Fragment key={`${crumb.id}-${i}`}>
              <button
                className="shrink-0 font-mono text-indigo-600 dark:text-indigo-400 hover:underline transition-colors"
                onClick={() => navigateToBreadcrumb(crumb.id, i)}
              >
                {crumb.label}
              </button>
              <span className="text-indigo-300 dark:text-indigo-600 shrink-0">›</span>
            </React.Fragment>
          ))}
          <span className="font-mono font-semibold text-indigo-800 dark:text-indigo-200 shrink-0">
            {labelNodeMap.get(effectiveNodeId ?? '')?.label ?? effectiveNodeId}
          </span>
        </div>
      )}

      {/* ── Canvas ── */}
      <div ref={canvasAreaRef} role="application" aria-label="Walkthrough debugger canvas" className="flex-1 relative overflow-hidden">

        {/* ── Toolbox (left) ── */}
        <CanvasToolbox label="Walkthrough Debugger">
          {/* Go to Label */}
          <div className="p-3 flex flex-col gap-1.5">
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Jump to Label</h4>
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
                    onClick={() => { navigateTo(n.id); setShowLabelSearchResults(false); setLabelSearchQuery(''); }}
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
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Three-Panel Layout</h4>
            <div className="flex items-center gap-2">
              <div className="w-5 h-4 rounded bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 shrink-0" />
              Left: previous nodes
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-4 rounded bg-indigo-100 dark:bg-indigo-900/30 border-2 border-indigo-400 dark:border-indigo-600 shrink-0" />
              Center: current node
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-4 rounded bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 shrink-0" />
              Right: choices &amp; targets
            </div>

            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2 mt-3">Elements</h4>
            <div className="flex items-center gap-2">
              <div className="w-5 h-3.5 rounded-full bg-indigo-600 shrink-0" />
              Choice pill
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-500 text-base leading-none shrink-0">⚠</span>
              Conditional choice (if …)
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500">
              Click any node or pill to navigate · shift-drag to pan · toggle "Panels" to show/hide regions
            </div>
          </div>
        </CanvasToolbox>

        {isEmpty ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
            {labelNodes.length === 0
              ? 'No labels found. Open a project to see the walkthrough.'
              : 'No entry point found.'}
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
              <marker id="wdb-arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M 0 0 L 7 3.5 L 0 7 z" fill="context-stroke" />
              </marker>
            </defs>

            <g
              transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}
              style={{
                transition: isTransitioning ? 'opacity 300ms ease-out' : 'none',
                opacity: isTransitioning ? 0.6 : 1,
              }}
            >
              {/* ── Panel overlays ── */}
              {showPanels && (
                <g opacity={0.4} style={{ transition: 'opacity 300ms ease-in-out' }}>
                  {/* Left panel - Parents */}
                  <rect
                    x={PANEL_LEFT_X} y={PANEL_Y}
                    width={PANEL_LEFT_W} height={PANEL_H}
                    rx={12}
                    className="fill-blue-100 dark:fill-blue-900/30 stroke-blue-300 dark:stroke-blue-700"
                    strokeWidth={2}
                    strokeDasharray="8,6"
                  />
                  <text
                    x={PANEL_LEFT_X + PANEL_LEFT_W / 2} y={PANEL_Y + 30}
                    textAnchor="middle"
                    fontSize={14} fontWeight={600}
                    className="fill-blue-600 dark:fill-blue-400 pointer-events-none"
                    style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  >
                    Previous Nodes
                  </text>

                  {/* Center panel - Current */}
                  <rect
                    x={PANEL_CENTER_X} y={PANEL_Y}
                    width={PANEL_CENTER_W} height={PANEL_H}
                    rx={12}
                    className="fill-indigo-100 dark:fill-indigo-900/30 stroke-indigo-400 dark:stroke-indigo-600"
                    strokeWidth={2.5}
                    strokeDasharray="8,6"
                  />
                  <text
                    x={PANEL_CENTER_X + PANEL_CENTER_W / 2} y={PANEL_Y + 30}
                    textAnchor="middle"
                    fontSize={14} fontWeight={700}
                    className="fill-indigo-700 dark:fill-indigo-300 pointer-events-none"
                    style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  >
                    Current Node
                  </text>

                  {/* Right panel - Choices */}
                  <rect
                    x={PANEL_RIGHT_X} y={PANEL_Y}
                    width={PANEL_RIGHT_W} height={PANEL_H}
                    rx={12}
                    className="fill-purple-100 dark:fill-purple-900/30 stroke-purple-300 dark:stroke-purple-700"
                    strokeWidth={2}
                    strokeDasharray="8,6"
                  />
                  <text
                    x={PANEL_RIGHT_X + PANEL_RIGHT_W / 2} y={PANEL_Y + 30}
                    textAnchor="middle"
                    fontSize={14} fontWeight={600}
                    className="fill-purple-600 dark:fill-purple-400 pointer-events-none"
                    style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  >
                    Choices &amp; Targets
                  </text>
                </g>
              )}

              {armEls}
              {nodeEls}
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
            onSetAsRoot={() => navigateTo(nodeContextMenu.labelId)}
            onWarpToHere={() => onWarpToLabel(nodeContextMenu.label)}
          />
        )}

        {/* ── Nav + minimap ── */}
        {!isEmpty && (
          <div className="absolute bottom-4 right-4 z-30 flex flex-col items-end gap-1.5" onPointerDown={e => e.stopPropagation()}>
            <CanvasNavControls
              onFit={fitToScreen}
              fitTitle="Fit layout to screen"
              onGoToStart={() => {
                setIsTransitioning(true);
                setCurrentNodeId(defaultNodeId);
                setBreadcrumbTrail([]);
                setTimeout(() => {
                  centerOnCurrent(true);
                  setTimeout(() => setIsTransitioning(false), 500);
                }, 60);
              }}
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
