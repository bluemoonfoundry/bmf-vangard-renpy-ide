/**
 * ScreenLayoutComposerV2 — Figma-style three-panel Ren'Py screen editor.
 *
 * Left panel:  element palette (drag source) + layer hierarchy tree
 * Center panel: scaled game canvas (drop target; root widgets are draggable) + code panel
 * Right panel: property form for the selected element
 */

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { ScreenLayoutComposition, ScreenWidget, ScreenWidgetType } from '@/types';
import { generateScreenCode } from '@/lib/screenCodeGenerator';
import { parseScreenCode } from '@/lib/screenParser';

// ─── Element catalogue ────────────────────────────────────────────────────────

type ElemDef = {
  label: string;
  icon: string;
  colorClass: string;
  color: string;
  isContainer: boolean;
  defaultProps: Partial<Omit<ScreenWidget, 'id' | 'type'>>;
};

const ELEM: Record<ScreenWidgetType, ElemDef> = {
  // Layout containers
  vbox:        { label: 'VBox',       icon: '↕',  colorClass: 'bg-blue-700',    color: '#1d4ed8', isContainer: true,  defaultProps: {} },
  hbox:        { label: 'HBox',       icon: '↔',  colorClass: 'bg-blue-500',    color: '#3b82f6', isContainer: true,  defaultProps: {} },
  fixed:       { label: 'Fixed',      icon: '⊞',  colorClass: 'bg-blue-600',    color: '#2563eb', isContainer: true,  defaultProps: {} },
  frame:       { label: 'Frame',      icon: '▭',  colorClass: 'bg-indigo-600',  color: '#4f46e5', isContainer: true,  defaultProps: { xsize: 450, ysize: 300 } },
  window:      { label: 'Window',     icon: '⬛', colorClass: 'bg-sky-700',     color: '#0369a1', isContainer: true,  defaultProps: { xsize: 800, ysize: 300 } },
  side:        { label: 'Side',       icon: '⊟',  colorClass: 'bg-blue-800',    color: '#1e40af', isContainer: true,  defaultProps: {} },
  viewport:    { label: 'Viewport',   icon: '⤢',  colorClass: 'bg-cyan-700',    color: '#0e7490', isContainer: true,  defaultProps: { xsize: 600, ysize: 400, scrollbars: 'vertical', mousewheel: true } },
  vpgrid:      { label: 'VPGrid',     icon: '⊞',  colorClass: 'bg-cyan-800',    color: '#155e75', isContainer: true,  defaultProps: { cols: 1 } },
  grid:        { label: 'Grid',       icon: '▦',  colorClass: 'bg-sky-800',     color: '#075985', isContainer: true,  defaultProps: { cols: 3, rows: 3 } },
  // Transform & drag
  transform:   { label: 'Transform',  icon: '⟳',  colorClass: 'bg-violet-700',  color: '#6d28d9', isContainer: true,  defaultProps: {} },
  drag:        { label: 'Drag',       icon: '⣿',  colorClass: 'bg-orange-700',  color: '#c2410c', isContainer: true,  defaultProps: {} },
  draggroup:   { label: 'DragGroup',  icon: '⣿⣿', colorClass: 'bg-orange-800',  color: '#9a3412', isContainer: true,  defaultProps: {} },
  // Imagemap
  imagemap:    { label: 'Imagemap',   icon: '🗺',  colorClass: 'bg-emerald-700', color: '#047857', isContainer: true,  defaultProps: {} },
  hotspot:     { label: 'Hotspot',    icon: '⬡',  colorClass: 'bg-green-600',   color: '#16a34a', isContainer: false, defaultProps: {} },
  hotbar:      { label: 'Hotbar',     icon: '⬡▬', colorClass: 'bg-green-700',   color: '#15803d', isContainer: false, defaultProps: {} },
  // Display
  text:        { label: 'Text',       icon: 'T',  colorClass: 'bg-gray-500',    color: '#6b7280', isContainer: false, defaultProps: { text: 'Hello' } },
  label:       { label: 'Label',      icon: 'L',  colorClass: 'bg-gray-600',    color: '#4b5563', isContainer: false, defaultProps: { text: 'Label' } },
  image:       { label: 'Image',      icon: '⬜', colorClass: 'bg-emerald-700', color: '#047857', isContainer: false, defaultProps: {} },
  // Interactive
  textbutton:  { label: 'TextButton', icon: 'TB', colorClass: 'bg-orange-500',  color: '#f97316', isContainer: false, defaultProps: { text: 'Click Me', action: 'Return()' } },
  button:      { label: 'Button',     icon: 'Bt', colorClass: 'bg-orange-700',  color: '#c2410c', isContainer: true,  defaultProps: { xsize: 300, ysize: 54, action: 'Return()' } },
  imagebutton: { label: 'ImgButton',  icon: 'IB', colorClass: 'bg-amber-600',   color: '#d97706', isContainer: false, defaultProps: { xsize: 200, ysize: 150, action: 'Return()' } },
  bar:         { label: 'Bar',        icon: '▬',  colorClass: 'bg-purple-600',  color: '#7c3aed', isContainer: false, defaultProps: { xsize: 450, ysize: 36 } },
  vbar:        { label: 'VBar',       icon: '▮',  colorClass: 'bg-purple-700',  color: '#6d28d9', isContainer: false, defaultProps: { xsize: 36, ysize: 450 } },
  input:       { label: 'Input',      icon: '✎',  colorClass: 'bg-teal-600',    color: '#0d9488', isContainer: false, defaultProps: { text: '' } },
  'null':      { label: 'Null',       icon: '∅',  colorClass: 'bg-gray-600',    color: '#4b5563', isContainer: false, defaultProps: {} },
  // Screen ops
  use:         { label: 'use',        icon: '⤴',  colorClass: 'bg-violet-700',  color: '#6d28d9', isContainer: true,  defaultProps: {} },
  transclude:  { label: 'transclude', icon: '↳',  colorClass: 'bg-indigo-800',  color: '#3730a3', isContainer: false, defaultProps: {} },
  key:         { label: 'key',        icon: '⌨',  colorClass: 'bg-slate-600',   color: '#475569', isContainer: false, defaultProps: {} },
  timer:       { label: 'timer',      icon: '⏱',  colorClass: 'bg-slate-700',   color: '#334155', isContainer: false, defaultProps: {} },
  // Utility
  mousearea:   { label: 'mousearea',  icon: '⬚',  colorClass: 'bg-slate-500',   color: '#64748b', isContainer: false, defaultProps: {} },
  nearrect:    { label: 'nearrect',   icon: '⊡',  colorClass: 'bg-slate-600',   color: '#475569', isContainer: true,  defaultProps: {} },
  dismiss:     { label: 'dismiss',    icon: '✕',  colorClass: 'bg-red-700',     color: '#b91c1c', isContainer: false, defaultProps: { action: 'Return()' } },
  on:          { label: 'on',         icon: '⚡',  colorClass: 'bg-yellow-600',  color: '#ca8a04', isContainer: false, defaultProps: { onEvent: 'show', action: 'NullAction()' } },
  'default':   { label: 'default',    icon: '≔',  colorClass: 'bg-slate-500',   color: '#64748b', isContainer: false, defaultProps: { defaultVariable: 'var', defaultValue: '0' } },
  // Fallback: raw blocks (includes control flow)
  raw:         { label: 'code',       icon: '{}', colorClass: 'bg-zinc-600',    color: '#52525b', isContainer: false, defaultProps: {} },
} as Record<ScreenWidgetType, ElemDef>;

// Logic palette items insert raw nodes with template code.
type LogicTile = { label: string; icon: string; colorClass: string; code: string };
const LOGIC_TILES: LogicTile[] = [
  { label: 'if / else',  icon: '?',  colorClass: 'bg-amber-700', code: 'if True:\n    pass' },
  { label: 'for loop',   icon: '↺',  colorClass: 'bg-yellow-700', code: 'for item in []:\n    pass' },
  { label: 'python',     icon: '$',  colorClass: 'bg-rose-800',   code: '$ None' },
  { label: 'showif',     icon: '👁', colorClass: 'bg-amber-600',  code: 'showif True:\n    pass' },
];

const PALETTE_GROUPS: { label: string; types: ScreenWidgetType[] }[] = [
  { label: 'Layout',      types: ['vbox', 'hbox', 'fixed', 'frame', 'window', 'side', 'viewport', 'vpgrid', 'grid'] },
  { label: 'Display',     types: ['text', 'label', 'image'] },
  { label: 'Interactive', types: ['textbutton', 'button', 'imagebutton'] },
  { label: 'Other',       types: ['bar', 'vbar', 'input', 'null'] },
  { label: 'Screen',      types: ['use', 'transclude', 'key', 'timer'] },
  { label: 'Utility',     types: ['mousearea', 'nearrect', 'dismiss', 'on', 'default'] },
  { label: 'Advanced',    types: ['transform', 'drag', 'draggroup', 'imagemap', 'hotspot', 'hotbar'] },
];

// Keywords found in raw code blocks — used to generate canvas hint icons.
const HINT_KW_MAP: Partial<Record<string, ScreenWidgetType>> = {
  vbox: 'vbox', hbox: 'hbox', fixed: 'fixed', frame: 'frame', window: 'window',
  side: 'side', viewport: 'viewport', vpgrid: 'vpgrid', grid: 'grid',
  text: 'text', label: 'label', image: 'image', add: 'image',
  textbutton: 'textbutton', button: 'button', imagebutton: 'imagebutton',
  bar: 'bar', vbar: 'vbar', input: 'input', null: 'null',
  use: 'use', key: 'key', timer: 'timer',
  mousearea: 'mousearea', nearrect: 'nearrect', dismiss: 'dismiss',
  drag: 'drag', draggroup: 'draggroup', imagemap: 'imagemap',
  hotspot: 'hotspot', hotbar: 'hotbar', transform: 'transform',
};

function extractRawHints(code: string): ScreenWidgetType[] {
  const found: ScreenWidgetType[] = [];
  const seen = new Set<string>();
  for (const line of code.split('\n')) {
    const tok = line.trim().split(/\s+/)[0]?.replace(/:$/, '').toLowerCase();
    if (tok && HINT_KW_MAP[tok] && !seen.has(tok)) {
      seen.add(tok);
      found.push(HINT_KW_MAP[tok]!);
    }
  }
  return found;
}

// Determine display style for the first keyword of a raw block.
function rawBlockStyle(code: string): { icon: string; color: string; colorClass: string } {
  const firstKw = (code.split('\n')[0] ?? '').trim().split(/\s+/)[0]?.replace(/:$/, '').toLowerCase() ?? '';
  if (firstKw === 'if' || firstKw === 'elif' || firstKw === 'else') return { icon: '?', color: '#fbbf24', colorClass: 'bg-amber-700' };
  if (firstKw === 'showif') return { icon: '👁', color: '#fbbf24', colorClass: 'bg-amber-600' };
  if (firstKw === 'for') return { icon: '↺', color: '#fde68a', colorClass: 'bg-yellow-700' };
  if (firstKw === '$' || firstKw === 'python') return { icon: '$', color: '#fda4af', colorClass: 'bg-rose-800' };
  return { icon: '{}', color: '#a1a1aa', colorClass: 'bg-zinc-600' };
}

// ─── Widget tree helpers ──────────────────────────────────────────────────────

let _idSeq = 0;
function genId(): string { return `w_${Date.now()}_${_idSeq++}`; }

function findWidget(list: ScreenWidget[], id: string): ScreenWidget | null {
  for (const w of list) {
    if (w.id === id) return w;
    if (w.children) { const f = findWidget(w.children, id); if (f) return f; }
  }
  return null;
}

function locateWidget(
  list: ScreenWidget[], id: string,
): { arr: ScreenWidget[]; idx: number } | null {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) return { arr: list, idx: i };
    if (list[i].children) {
      const r = locateWidget(list[i].children!, id);
      if (r) return r;
    }
  }
  return null;
}

function cloneTree(w: ScreenWidget[]): ScreenWidget[] {
  return JSON.parse(JSON.stringify(w)) as ScreenWidget[];
}

function makeWidget(type: ScreenWidgetType, gameWidth = 1920): ScreenWidget {
  const def = ELEM[type];
  if (!def) return { id: genId(), type: 'raw', code: '' };
  const u = gameWidth / 1920;
  const props = { ...def.defaultProps };
  if (typeof props.xsize === 'number') props.xsize = Math.round(props.xsize * u);
  if (typeof props.ysize === 'number') props.ysize = Math.round(props.ysize * u);
  return {
    id: genId(),
    type,
    ...props,
    ...(def.isContainer ? { children: [] } : {}),
  };
}

function makeRawWidget(code: string): ScreenWidget {
  return { id: genId(), type: 'raw', code };
}

function insertIntoTree(
  widgets: ScreenWidget[],
  newW: ScreenWidget,
  selectedId: string | null,
  xpos: number,
  ypos: number,
): ScreenWidget[] {
  const clone = cloneTree(widgets);
  if (selectedId) {
    const loc = locateWidget(clone, selectedId);
    if (loc) {
      const sel = loc.arr[loc.idx];
      if (sel.children !== undefined) {
        sel.children.push(newW);
        return clone;
      }
      loc.arr.splice(loc.idx + 1, 0, newW);
      return clone;
    }
  }
  newW.xpos = Math.round(xpos);
  newW.ypos = Math.round(ypos);
  clone.push(newW);
  return clone;
}

function removeFromTree(
  widgets: ScreenWidget[], id: string,
): [ScreenWidget[], ScreenWidget | null] {
  const clone = cloneTree(widgets);
  const loc = locateWidget(clone, id);
  if (!loc) return [clone, null];
  const [removed] = loc.arr.splice(loc.idx, 1);
  return [clone, removed as ScreenWidget];
}

function reorderInTree(
  widgets: ScreenWidget[],
  dragId: string,
  targetId: string,
  pos: 'before' | 'after' | 'inside',
): ScreenWidget[] {
  const [base, dragged] = removeFromTree(widgets, dragId);
  if (!dragged) return widgets;
  const loc = locateWidget(base, targetId);
  if (!loc) return widgets;
  if (pos === 'inside') {
    const t = loc.arr[loc.idx];
    if (!t.children) t.children = [];
    t.children.push(dragged);
  } else {
    loc.arr.splice(loc.idx + (pos === 'after' ? 1 : 0), 0, dragged);
  }
  return base;
}

function patchInTree(
  widgets: ScreenWidget[], id: string, patch: Partial<ScreenWidget>,
): ScreenWidget[] {
  const clone = cloneTree(widgets);
  const w = findWidget(clone, id);
  if (w) Object.assign(w, patch);
  return clone;
}

// ─── Palette panel ────────────────────────────────────────────────────────────

function PalettePanel({
  onDragStart, onDragEnd, onLogicDragStart,
}: {
  onDragStart: (type: ScreenWidgetType) => void;
  onDragEnd: () => void;
  onLogicDragStart: (code: string) => void;
}) {
  return (
    <div className="p-2 overflow-y-auto flex flex-col gap-3">
      {PALETTE_GROUPS.map(g => (
        <section key={g.label}>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-0.5">
            {g.label}
          </p>
          <div className="flex flex-col gap-1">
            {g.types.map(type => {
              const d = ELEM[type];
              return (
                <div
                  key={type}
                  draggable
                  onDragStart={e => {
                    e.dataTransfer.setData('text/x-widget-type', type);
                    e.dataTransfer.effectAllowed = 'copy';
                    onDragStart(type);
                  }}
                  onDragEnd={onDragEnd}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-grab active:cursor-grabbing select-none text-white text-xs font-medium ${d.colorClass} hover:brightness-110 transition-all`}
                >
                  <span className="font-mono w-4 text-center text-[11px] shrink-0">{d.icon}</span>
                  {d.label}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Logic section — inserts raw code template nodes */}
      <section>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-0.5">
          Logic
        </p>
        <div className="flex flex-col gap-1">
          {LOGIC_TILES.map(tile => (
            <div
              key={tile.label}
              draggable
              onDragStart={e => {
                e.dataTransfer.setData('text/x-logic-template', tile.code);
                e.dataTransfer.effectAllowed = 'copy';
                onLogicDragStart(tile.code);
              }}
              onDragEnd={onDragEnd}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-grab active:cursor-grabbing select-none text-white text-xs font-medium ${tile.colorClass} hover:brightness-110 transition-all`}
            >
              <span className="font-mono w-4 text-center text-[11px] shrink-0">{tile.icon}</span>
              {tile.label}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Layer tree ───────────────────────────────────────────────────────────────

function LayerNode({
  widget, depth, selectedId, onSelect, layerDragId, setLayerDragId, onReorder, onImageDrop,
}: {
  widget: ScreenWidget;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  layerDragId: string | null;
  setLayerDragId: (id: string | null) => void;
  onReorder: (dragId: string, targetId: string, pos: 'before' | 'after' | 'inside') => void;
  onImageDrop: (id: string, filePath: string, dataUrl: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [dropHint, setDropHint] = useState<'before' | 'after' | 'inside' | null>(null);
  const [imageDragOver, setImageDragOver] = useState(false);
  const d = ELEM[widget.type] ?? ELEM.raw;
  const isSelected = selectedId === widget.id;
  const acceptsImageDrop = widget.type === 'image';
  const hasChildren = d.isContainer && (widget.children?.length ?? 0) > 0;

  // For raw blocks: show the first line of code as the label.
  const nodeLabel = widget.type === 'raw'
    ? ((widget.code ?? '').split('\n')[0] ?? 'code block').slice(0, 28)
    : d.label + (widget.text ? ` "${widget.text}"` : '');

  const nodeIcon = widget.type === 'raw' ? rawBlockStyle(widget.code ?? '').icon : d.icon;
  const nodeColorClass = widget.type === 'raw' ? rawBlockStyle(widget.code ?? '').colorClass : d.colorClass;

  function calcPos(e: React.DragEvent): 'before' | 'after' | 'inside' {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const rel = (e.clientY - rect.top) / rect.height;
    if (rel < 0.28) return 'before';
    if (rel > 0.72 || !d.isContainer) return 'after';
    return 'inside';
  }

  const rowCls = [
    'flex items-center gap-1.5 py-[3px] pr-2 rounded cursor-pointer select-none',
    isSelected ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700/60',
    dropHint === 'before' ? 'border-t border-blue-400' : '',
    dropHint === 'after'  ? 'border-b border-blue-400' : '',
    dropHint === 'inside' ? 'ring-1 ring-blue-400 ring-inset' : '',
    imageDragOver ? 'ring-1 ring-emerald-400 ring-inset bg-emerald-900/30' : '',
  ].filter(Boolean).join(' ');

  return (
    <div>
      <div
        draggable
        onDragStart={e => {
          e.stopPropagation();
          e.dataTransfer.setData('text/x-layer-id', widget.id);
          e.dataTransfer.effectAllowed = 'move';
          setLayerDragId(widget.id);
        }}
        onDragEnd={() => { setLayerDragId(null); setDropHint(null); setImageDragOver(false); }}
        onDragOver={e => {
          const isLayerDrag = e.dataTransfer.types.includes('text/x-layer-id');
          const isImgDrag = acceptsImageDrop && e.dataTransfer.types.includes('application/renpy-image-path');
          if (!isLayerDrag && !isImgDrag) return;
          e.preventDefault();
          e.stopPropagation();
          if (isImgDrag) {
            setImageDragOver(true);
            setDropHint(null);
          } else {
            setImageDragOver(false);
            setDropHint(layerDragId !== widget.id ? calcPos(e) : null);
          }
        }}
        onDragLeave={() => { setDropHint(null); setImageDragOver(false); }}
        onDrop={e => {
          e.preventDefault();
          e.stopPropagation();
          const filePath = e.dataTransfer.getData('application/renpy-image-path');
          const lid = e.dataTransfer.getData('text/x-layer-id');
          if (filePath && acceptsImageDrop) {
            onImageDrop(widget.id, filePath, e.dataTransfer.getData('application/renpy-image-dataurl'));
          } else if (lid && lid !== widget.id) {
            onReorder(lid, widget.id, calcPos(e));
          }
          setDropHint(null);
          setImageDragOver(false);
          setLayerDragId(null);
        }}
        onClick={e => { e.stopPropagation(); onSelect(widget.id); }}
        style={{ paddingLeft: `${depth * 14 + 6}px` }}
        className={rowCls}
      >
        {d.isContainer ? (
          <button
            onClick={e => { e.stopPropagation(); setExpanded(x => !x); }}
            className="w-3.5 h-3.5 flex items-center justify-center text-[10px] opacity-60 hover:opacity-100 shrink-0"
          >
            {expanded ? '▾' : '▸'}
          </button>
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        <span
          className={`w-4 h-4 rounded text-[9px] flex items-center justify-center shrink-0 text-white font-bold ${nodeColorClass}`}
        >
          {nodeIcon}
        </span>
        <span className="text-[11px] truncate leading-tight">
          {nodeLabel}
          {acceptsImageDrop && widget.imagePath ? (
            <span className="ml-1 opacity-50 font-mono">{widget.imagePath.split('/').pop()}</span>
          ) : null}
        </span>
      </div>
      {d.isContainer && expanded && hasChildren && widget.children?.map(child => (
        <LayerNode
          key={child.id}
          widget={child}
          depth={depth + 1}
          selectedId={selectedId}
          onSelect={onSelect}
          layerDragId={layerDragId}
          setLayerDragId={setLayerDragId}
          onReorder={onReorder}
          onImageDrop={onImageDrop}
        />
      ))}
    </div>
  );
}

function LayersPanel({
  widgets, selectedId, onSelect, onReorder, onImageDrop,
}: {
  widgets: ScreenWidget[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onReorder: (dragId: string, targetId: string, pos: 'before' | 'after' | 'inside') => void;
  onImageDrop: (id: string, filePath: string, dataUrl: string) => void;
}) {
  const [layerDragId, setLayerDragId] = useState<string | null>(null);
  return (
    <div
      className="flex-1 overflow-y-auto py-1"
      onClick={() => onSelect(null)}
    >
      {widgets.length === 0 ? (
        <p className="text-[11px] text-gray-500 px-3 py-2 italic">No elements yet</p>
      ) : widgets.map(w => (
        <LayerNode
          key={w.id}
          widget={w}
          depth={0}
          selectedId={selectedId}
          onSelect={onSelect}
          layerDragId={layerDragId}
          setLayerDragId={setLayerDragId}
          onReorder={onReorder}
          onImageDrop={onImageDrop}
        />
      ))}
    </div>
  );
}

// ─── Canvas widget renderer ───────────────────────────────────────────────────

type PointerDownFn = (e: React.PointerEvent, id: string) => void;

function CanvasWidget({
  widget, selectedId, onSelect, scale, onPointerDown, isTopLevel, onImageDrop, gameWidth,
}: {
  widget: ScreenWidget;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  scale: number;
  onPointerDown?: PointerDownFn;
  isTopLevel: boolean;
  onImageDrop: (id: string, filePath: string, dataUrl: string) => void;
  gameWidth: number;
}) {
  const u = gameWidth / 1920;

  const [imageDragOver, setImageDragOver] = useState(false);
  const isSelected = selectedId === widget.id;

  const selRing: React.CSSProperties = isSelected
    ? { outline: `${Math.ceil(2 / scale)}px solid #3b82f6`, outlineOffset: `${Math.ceil(1 / scale)}px` }
    : {};

  const pos: React.CSSProperties = isTopLevel
    ? { position: 'absolute', left: widget.xpos ?? 0, top: widget.ypos ?? 0 }
    : {};

  const size: React.CSSProperties = {
    ...(widget.xsize != null ? { width: widget.xsize } : {}),
    ...(widget.ysize != null ? { height: widget.ysize } : {}),
  };

  const base: React.CSSProperties = { ...pos, ...size, ...selRing, cursor: isTopLevel ? 'move' : 'pointer' };

  function click(e: React.MouseEvent) { e.stopPropagation(); onSelect(widget.id); }
  function ptrDown(e: React.PointerEvent) {
    if (isTopLevel && onPointerDown) { onPointerDown(e, widget.id); }
  }

  const children = widget.children?.map(child => (
    <CanvasWidget
      key={child.id}
      widget={child}
      selectedId={selectedId}
      onSelect={onSelect}
      scale={scale}
      isTopLevel={false}
      onImageDrop={onImageDrop}
      gameWidth={gameWidth}
    />
  ));

  const r = (n: number) => Math.round(n * u);
  const fs = r(22);
  const fsSm = r(16);
  const br = r(4);
  const gap = r(6);
  const pad = r(8);
  const trackW = r(12);
  const thumbW = r(8);
  const imgW = r(240);
  const imgH = r(180);

  switch (widget.type) {
    case 'vbox':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, display: 'flex', flexDirection: 'column', gap, padding: pad, border: `${Math.max(1, r(1))}px dashed #93c5fd44` }}>
          {children}
        </div>
      );
    case 'hbox':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, display: 'flex', flexDirection: 'row', gap, padding: pad, border: `${Math.max(1, r(1))}px dashed #93c5fd44` }}>
          {children}
        </div>
      );
    case 'frame':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, border: `${Math.max(1, r(2))}px solid #818cf8`, borderRadius: br, padding: r(12) }}>
          {children}
        </div>
      );
    case 'window':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, border: `${Math.max(1, r(2))}px solid #0ea5e9`, borderRadius: r(6), padding: r(12), background: 'rgba(14,165,233,0.06)' }}>
          {children}
        </div>
      );
    case 'viewport': {
      const vpW = widget.xsize ?? r(600);
      const vpH = widget.ysize ?? r(400);
      const hasScrollV = widget.scrollbars === 'vertical' || widget.scrollbars === 'both';
      const hasScrollH = widget.scrollbars === 'horizontal' || widget.scrollbars === 'both';
      return (
        <div onClick={click} onPointerDown={ptrDown}
          style={{ ...base, width: vpW, height: vpH, border: `${Math.max(1, r(2))}px solid #0891b2`, borderRadius: br, overflow: 'hidden', position: isTopLevel ? 'absolute' : 'relative' }}>
          {hasScrollV && (
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: trackW, background: '#164e63', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: thumbW, height: '40%', background: '#0891b2', borderRadius: thumbW / 2 }} />
            </div>
          )}
          {hasScrollH && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: trackW, background: '#164e63', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ height: thumbW, width: '40%', background: '#0891b2', borderRadius: thumbW / 2 }} />
            </div>
          )}
          <div style={{ position: 'absolute', inset: 0, padding: pad, paddingRight: hasScrollV ? trackW + pad : pad, paddingBottom: hasScrollH ? trackW + pad : pad, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap }}>
            {children}
          </div>
        </div>
      );
    }
    case 'button':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, border: `${Math.max(1, r(2))}px solid #ea580c`, borderRadius: br, minWidth: r(80), minHeight: r(54), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </div>
      );
    case 'text':
      return (
        <span onClick={click} onPointerDown={ptrDown} style={{ ...base, color: '#e5e7eb', fontSize: fs, whiteSpace: 'nowrap', display: 'inline-block' }}>
          {widget.text || 'text'}
        </span>
      );
    case 'label':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, color: '#d1d5db', fontSize: fs, padding: `${r(6)}px ${r(12)}px`, border: `${Math.max(1, r(1))}px solid #6b7280`, borderRadius: br, display: 'inline-block', whiteSpace: 'nowrap' }}>
          {widget.text || 'Label'}
        </div>
      );
    case 'textbutton':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, background: '#c2410c', color: 'white', padding: `${r(10)}px ${r(28)}px`, borderRadius: br, fontSize: fs, display: 'inline-block', whiteSpace: 'nowrap' }}>
          {widget.text || 'Button'}
        </div>
      );
    case 'image': {
      const imgDropHandlers = {
        onDragOver: (e: React.DragEvent) => {
          if (!e.dataTransfer.types.includes('application/renpy-image-path')) return;
          e.preventDefault();
          e.stopPropagation();
          setImageDragOver(true);
        },
        onDragLeave: () => setImageDragOver(false),
        onDrop: (e: React.DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          const filePath = e.dataTransfer.getData('application/renpy-image-path');
          if (filePath) onImageDrop(widget.id, filePath, e.dataTransfer.getData('application/renpy-image-dataurl'));
          setImageDragOver(false);
        },
      };
      const imgDropBorder = imageDragOver ? `${Math.max(1, r(2))}px solid #34d399` : undefined;
      if (widget.imageDataUrl) {
        return (
          <img
            src={widget.imageDataUrl}
            alt={widget.imagePath || 'image'}
            onClick={click}
            onPointerDown={ptrDown}
            {...imgDropHandlers}
            style={{ ...base, objectFit: 'contain', display: 'block', ...(imgDropBorder ? { outline: imgDropBorder } : {}) }}
          />
        );
      }
      const imgFallbackW = widget.xsize ?? imgW;
      const imgFallbackH = widget.ysize ?? imgH;
      if (widget.imagePath) {
        return (
          <div onClick={click} onPointerDown={ptrDown} {...imgDropHandlers}
            style={{ ...base, width: imgFallbackW, height: imgFallbackH, border: imgDropBorder ?? `${Math.max(1, r(2))}px dashed #f59e0b`, borderRadius: br, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', fontSize: fsSm, gap: r(4) }}>
            <span style={{ fontSize: r(24) }}>⚠</span>
            <span style={{ maxWidth: r(160), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{widget.imagePath.split('/').pop()}</span>
          </div>
        );
      }
      return (
        <div onClick={click} onPointerDown={ptrDown} {...imgDropHandlers}
          style={{ ...base, width: imgFallbackW, height: imgFallbackH, border: imgDropBorder ?? `${Math.max(1, r(2))}px dashed #059669`, borderRadius: br, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6ee7b7', fontSize: fsSm }}>
          {imageDragOver ? 'Drop image' : 'add image'}
        </div>
      );
    }
    case 'imagebutton':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, width: widget.xsize ?? imgW, height: widget.ysize ?? imgH, border: `${Math.max(1, r(2))}px solid #d97706`, borderRadius: br, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', fontSize: r(18), background: '#1c1917' }}>
          IB
        </div>
      );
    case 'bar':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, width: widget.xsize ?? r(450), height: widget.ysize ?? r(36), background: '#3b0764', borderRadius: r(18), overflow: 'hidden', position: isTopLevel ? 'absolute' : 'relative' }}>
          <div style={{ width: '60%', height: '100%', background: '#7c3aed', borderRadius: r(18) }} />
        </div>
      );
    case 'vbar':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, width: widget.xsize ?? r(36), height: widget.ysize ?? r(450), background: '#3b0764', borderRadius: r(18), overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: isTopLevel ? 'absolute' : 'relative' }}>
          <div style={{ width: '100%', height: '60%', background: '#7c3aed', borderRadius: r(18) }} />
        </div>
      );
    case 'input':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, padding: `${r(8)}px ${r(18)}px`, border: `${Math.max(1, r(1))}px solid #0f766e`, borderRadius: br, background: '#042f2e', color: '#99f6e4', fontSize: fs, minWidth: r(300), display: 'inline-flex', alignItems: 'center', gap: r(2) }}>
          <span>{widget.text || ''}</span>
          <span style={{ opacity: 0.5 }}>|</span>
        </div>
      );
    case 'null':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, width: widget.xsize ?? r(50), height: widget.ysize ?? r(50), border: `${Math.max(1, r(1))}px dashed #6b7280`, opacity: 0.4 }} />
      );
    case 'fixed':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, position: isTopLevel ? 'absolute' : 'relative', minWidth: r(80), minHeight: r(60), border: `${Math.max(1, r(1))}px dashed #60a5fa55` }}>
          {children}
        </div>
      );
    case 'side':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', gap, minWidth: r(120), minHeight: r(90), border: `${Math.max(1, r(1))}px dashed #93c5fd55` }}>
          {widget.sidePositions && (
            <div style={{ gridColumn: '1/-1', fontSize: r(11), color: '#60a5fa', fontFamily: 'monospace', userSelect: 'none', padding: `${r(2)}px` }}>
              side "{widget.sidePositions}"
            </div>
          )}
          {children}
        </div>
      );
    case 'grid': {
      const gridCols = widget.cols ?? 3;
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, display: 'grid', gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap, padding: pad, minWidth: r(120), minHeight: r(90), border: `${Math.max(1, r(2))}px solid #0369a1`, borderRadius: br }}>
          {children}
        </div>
      );
    }
    case 'vpgrid': {
      const vpgCols = widget.cols ?? 1;
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, display: 'grid', gridTemplateColumns: `repeat(${vpgCols}, 1fr)`, gap, padding: pad, minWidth: r(120), minHeight: r(90), border: `${Math.max(1, r(2))}px solid #0891b2`, borderRadius: br, overflow: 'hidden' }}>
          {children}
        </div>
      );
    }
    case 'transform':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, border: `${Math.max(1, r(1))}px dashed #7c3aed55`, borderRadius: br, padding: r(6), minWidth: r(60), minHeight: r(40) }}>
          {children}
        </div>
      );
    case 'drag':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, border: `${Math.max(1, r(2))}px solid #c2410c`, borderRadius: br, padding: r(6), minWidth: r(80), minHeight: r(54), cursor: 'grab' }}>
          {widget.dragName && (
            <div style={{ fontSize: r(11), color: '#fb923c', fontFamily: 'monospace', marginBottom: r(4) }}>⣿ {widget.dragName}</div>
          )}
          {children}
        </div>
      );
    case 'draggroup':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, border: `${Math.max(1, r(2))}px dashed #9a3412`, borderRadius: br, padding: r(8), minWidth: r(120), minHeight: r(80) }}>
          {children}
        </div>
      );
    case 'imagemap':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, border: `${Math.max(1, r(2))}px solid #047857`, borderRadius: br, padding: r(8), minWidth: r(200), minHeight: r(150), background: 'rgba(4,120,87,0.04)' }}>
          <div style={{ fontSize: r(11), color: '#6ee7b7', fontFamily: 'monospace', marginBottom: r(4) }}>🗺 imagemap</div>
          {children}
        </div>
      );
    case 'hotspot':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, border: `${Math.max(1, r(1))}px dashed #16a34a`, borderRadius: br, padding: `${r(4)}px ${r(8)}px`, background: 'rgba(22,163,74,0.08)', fontSize: fsSm, color: '#86efac', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
          ⬡ {widget.hotspotArea ?? '(0,0,0,0)'}
        </div>
      );
    case 'hotbar':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, border: `${Math.max(1, r(1))}px dashed #15803d`, borderRadius: br, padding: `${r(4)}px ${r(8)}px`, background: 'rgba(21,128,61,0.08)', fontSize: fsSm, color: '#86efac', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
          ⬡▬ {widget.hotspotArea ?? '(0,0,0,0)'}
        </div>
      );
    case 'mousearea':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, border: `${Math.max(1, r(1))}px dashed #64748b`, borderRadius: br, minWidth: r(80), minHeight: r(40), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fsSm, color: '#94a3b8', fontFamily: 'monospace' }}>
          mousearea
        </div>
      );
    case 'nearrect':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, border: `${Math.max(1, r(1))}px dashed #475569`, borderRadius: r(8), padding: r(8), minWidth: r(80), minHeight: r(40), background: 'rgba(71,85,105,0.08)' }}>
          <div style={{ fontSize: r(11), color: '#94a3b8', fontFamily: 'monospace', marginBottom: r(4) }}>⊡ nearrect</div>
          {children}
        </div>
      );
    case 'dismiss':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, border: `${Math.max(1, r(1))}px dashed #b91c1c`, borderRadius: br, padding: `${r(6)}px ${r(14)}px`, background: 'rgba(185,28,28,0.08)', fontSize: fsSm, color: '#fca5a5', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
          ✕ dismiss
        </div>
      );
    case 'on':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, border: `${Math.max(1, r(1))}px dashed #ca8a04`, borderRadius: br, padding: `${r(6)}px ${r(14)}px`, background: 'rgba(202,138,4,0.07)', fontSize: r(16), color: '#fde68a', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
          ⚡ on "{widget.onEvent ?? ''}"
        </div>
      );
    case 'default':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, border: `${Math.max(1, r(1))}px dashed #64748b`, borderRadius: br, padding: `${r(6)}px ${r(14)}px`, background: 'rgba(100,116,139,0.07)', fontSize: r(16), color: '#94a3b8', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
          ≔ default {widget.defaultVariable} = {widget.defaultValue}
        </div>
      );
    case 'use':
      return (
        <div onClick={click} onPointerDown={ptrDown}
          style={{ ...base, border: `${Math.max(1, r(2))}px solid #7c3aed`, borderRadius: br, padding: r(10), minWidth: r(100), minHeight: r(40), background: 'rgba(124,58,237,0.06)', display: 'flex', flexDirection: 'column', gap: r(4) }}>
          <div style={{ fontSize: r(13), color: '#a78bfa', fontFamily: 'monospace', userSelect: 'none' }}>
            use {widget.useScreen}{widget.useArgs ? `(${widget.useArgs})` : ''}
          </div>
          {widget.children?.map(child => (
            <CanvasWidget key={child.id} widget={child} selectedId={selectedId} onSelect={onSelect}
              scale={scale} isTopLevel={false} onImageDrop={onImageDrop} gameWidth={gameWidth} />
          ))}
        </div>
      );
    case 'key':
      return (
        <div onClick={click} onPointerDown={ptrDown}
          style={{ ...base, border: `${Math.max(1, r(1))}px dashed #64748b`, borderRadius: br, padding: `${r(6)}px ${r(12)}px`, background: 'rgba(100,116,139,0.07)', fontFamily: 'monospace', fontSize: r(16), color: '#94a3b8', whiteSpace: 'nowrap' }}>
          key "{widget.keyBinding ?? ''}" {widget.action ? `action ${widget.action}` : ''}
        </div>
      );
    case 'timer':
      return (
        <div onClick={click} onPointerDown={ptrDown}
          style={{ ...base, border: `${Math.max(1, r(1))}px dashed #64748b`, borderRadius: br, padding: `${r(6)}px ${r(12)}px`, background: 'rgba(100,116,139,0.07)', fontFamily: 'monospace', fontSize: r(16), color: '#94a3b8', whiteSpace: 'nowrap' }}>
          timer {widget.timerDelay ?? '0'}{widget.action ? ` action ${widget.action}` : ''}
        </div>
      );
    case 'transclude':
      return (
        <div onClick={click} onPointerDown={ptrDown}
          style={{ ...base, border: `${Math.max(1, r(1))}px dashed #4f46e5`, borderRadius: br, padding: `${r(6)}px ${r(16)}px`, background: 'rgba(79,70,229,0.06)', fontFamily: 'monospace', fontSize: r(16), color: '#818cf8', whiteSpace: 'nowrap' }}>
          transclude
        </div>
      );

    case 'raw': {
      // Opaque code tile: header line + preview + widget-type hints
      const rawCode = widget.code ?? '';
      const codeLines = rawCode.split('\n');
      const firstLine = (codeLines[0] ?? '').trim();
      const previewLines = codeLines.slice(1, 4);
      const hints = extractRawHints(rawCode);
      const { icon: rIcon, color: rColor } = rawBlockStyle(rawCode);
      return (
        <div
          onClick={click}
          onPointerDown={ptrDown}
          style={{
            ...base,
            border: `${Math.max(1, r(1))}px dashed #52525b`,
            borderRadius: br,
            background: 'rgba(24,24,27,0.9)',
            minWidth: r(160),
            maxWidth: r(700),
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: r(6), padding: `${r(5)}px ${r(10)}px`, borderBottom: '1px solid #27272a' }}>
            <span style={{ fontSize: r(14), color: rColor, fontWeight: 'bold', fontFamily: 'monospace', flexShrink: 0 }}>{rIcon}</span>
            <span style={{ fontSize: r(13), color: '#a1a1aa', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {firstLine}
            </span>
          </div>
          {/* Code preview (up to 3 body lines) */}
          {previewLines.length > 0 && (
            <pre style={{ padding: `${r(4)}px ${r(10)}px`, fontSize: r(11), color: '#52525b', fontFamily: 'monospace', margin: 0, lineHeight: 1.4, overflow: 'hidden' }}>
              {previewLines.join('\n')}
            </pre>
          )}
          {/* Widget hints */}
          {hints.length > 0 && (
            <div style={{ display: 'flex', gap: r(3), padding: `${r(4)}px ${r(10)}px`, borderTop: '1px solid #27272a', flexWrap: 'wrap' }}>
              {hints.map(h => {
                const hd = ELEM[h];
                return (
                  <span
                    key={h}
                    title={hd?.label ?? h}
                    style={{ fontSize: r(11), color: '#71717a', fontFamily: 'monospace', background: '#27272a', borderRadius: r(3), padding: `${r(1)}px ${r(4)}px` }}
                  >
                    {hd?.icon ?? h}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    default:
      return null;
  }
}

// ─── Composer canvas ──────────────────────────────────────────────────────────

function ComposerCanvas({
  composition, selectedId, onSelect, onDrop, onLogicDrop, onPatchWidget, draggingType, onImageDrop,
}: {
  composition: ScreenLayoutComposition;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDrop: (type: ScreenWidgetType, x: number, y: number) => void;
  onLogicDrop: (code: string, x: number, y: number) => void;
  onPatchWidget: (id: string, patch: Partial<ScreenWidget>) => void;
  draggingType: boolean;
  onImageDrop: (id: string, filePath: string, dataUrl: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [dropActive, setDropActive] = useState(false);

  const onPatchRef = useRef(onPatchWidget);
  useEffect(() => { onPatchRef.current = onPatchWidget; }, [onPatchWidget]);

  const scaleRef = useRef(scale);
  useEffect(() => { scaleRef.current = scale; }, [scale]);

  const widgetsRef = useRef(composition.widgets);
  useEffect(() => { widgetsRef.current = composition.widgets; }, [composition.widgets]);

  useEffect(() => {
    function recalc() {
      if (!containerRef.current) return;
      const cw = containerRef.current.clientWidth - 40;
      const ch = containerRef.current.clientHeight - 40;
      const sw = cw / composition.gameWidth;
      const sh = ch / composition.gameHeight;
      setScale(Math.min(sw, sh, 1));
    }
    recalc();
    const ro = new ResizeObserver(recalc);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [composition.gameWidth, composition.gameHeight]);

  const drag = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

  function handlePointerDown(e: React.PointerEvent, id: string) {
    e.stopPropagation();
    const w = findWidget(widgetsRef.current, id);
    if (!w) return;
    drag.current = { id, startX: e.clientX, startY: e.clientY, origX: w.xpos ?? 0, origY: w.ypos ?? 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    onSelect(id);
  }

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!drag.current) return;
      const s = scaleRef.current;
      const dx = (e.clientX - drag.current.startX) / s;
      const dy = (e.clientY - drag.current.startY) / s;
      onPatchRef.current(drag.current.id, {
        xpos: Math.round(drag.current.origX + dx),
        ypos: Math.round(drag.current.origY + dy),
      });
    }
    function onUp() { drag.current = null; }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  function gameCoords(e: React.DragEvent) {
    if (!gameRef.current) return { x: 0, y: 0 };
    const rect = gameRef.current.getBoundingClientRect();
    return {
      x: Math.round((e.clientX - rect.left) / scaleRef.current),
      y: Math.round((e.clientY - rect.top) / scaleRef.current),
    };
  }

  const border = dropActive && draggingType ? '2px dashed #3b82f6' : '1px solid #3f3f46';

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center bg-gray-950 overflow-hidden"
      onClick={() => onSelect(null)}
    >
      {/* Wrapper sized to the VISUAL dimensions so flex centering works correctly.
          Without this, the 1920×1080 game div occupies its full layout size even after
          transform: scale(), causing the canvas to appear clipped or tiny. */}
      <div style={{
        width: Math.round(composition.gameWidth * scale),
        height: Math.round(composition.gameHeight * scale),
        flexShrink: 0,
        position: 'relative',
      }}>
      <div
        ref={gameRef}
        style={{
          width: composition.gameWidth,
          height: composition.gameHeight,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          position: 'absolute',
          top: 0,
          left: 0,
          background: '#18181b',
          border,
          boxShadow: '0 0 48px rgba(0,0,0,0.9)',
        }}
        onDragOver={e => {
          const isWidget = e.dataTransfer.types.includes('text/x-widget-type');
          const isLogic = e.dataTransfer.types.includes('text/x-logic-template');
          if (!isWidget && !isLogic) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
          setDropActive(true);
        }}
        onDragLeave={() => setDropActive(false)}
        onDrop={e => {
          e.preventDefault();
          setDropActive(false);
          const logicCode = e.dataTransfer.getData('text/x-logic-template');
          if (logicCode) {
            const { x, y } = gameCoords(e);
            onLogicDrop(logicCode, x, y);
            return;
          }
          const type = e.dataTransfer.getData('text/x-widget-type') as ScreenWidgetType;
          if (!type || !ELEM[type]) return;
          const { x, y } = gameCoords(e);
          onDrop(type, x, y);
        }}
      >
        {composition.widgets.map(w => (
          <CanvasWidget
            key={w.id}
            widget={w}
            selectedId={selectedId}
            onSelect={onSelect}
            scale={scale}
            onPointerDown={handlePointerDown}
            isTopLevel
            onImageDrop={onImageDrop}
            gameWidth={composition.gameWidth}
          />
        ))}
      </div>
      </div>
    </div>
  );
}

// ─── Properties panel ─────────────────────────────────────────────────────────

function PropRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1">
      <label className="text-[11px] text-gray-400 w-16 shrink-0">{label}</label>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function NumInput({ value, onChange, placeholder }: { value: number | undefined; onChange: (v: number | undefined) => void; placeholder?: string }) {
  return (
    <input
      type="number"
      value={value ?? ''}
      placeholder={placeholder ?? '—'}
      onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-0.5 text-[12px] text-white focus:outline-none focus:border-blue-500"
    />
  );
}

function StrInput({ value, onChange, placeholder }: { value: string | undefined; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value ?? ''}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-0.5 text-[12px] text-white focus:outline-none focus:border-blue-500"
    />
  );
}

function PropSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-gray-700/60 py-1.5">
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 pb-1">{title}</p>
      {children}
    </div>
  );
}

function PropertiesPanel({
  widget, onUpdate,
}: {
  widget: ScreenWidget | null;
  onUpdate: (patch: Partial<ScreenWidget>) => void;
}) {
  if (!widget) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[12px] text-gray-500 italic text-center px-4">Select an element to edit its properties</p>
      </div>
    );
  }

  const d = ELEM[widget.type] ?? ELEM.raw;

  // Raw blocks: show code source, editable
  if (widget.type === 'raw') {
    const { icon: rIcon, color: rColor, colorClass: rCls } = rawBlockStyle(widget.code ?? '');
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2 border-b border-gray-700">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] text-white font-semibold ${rCls}`}
            style={{ color: rColor }}>
            {rIcon} code block
          </span>
          <p className="text-[10px] text-zinc-400 mt-1.5">Edit the code directly in the source editor.</p>
        </div>
        <div className="px-3 py-2">
          <p className="text-[10px] text-gray-500 mb-1">Source</p>
          <pre className="text-[10px] text-zinc-300 font-mono whitespace-pre-wrap break-all bg-zinc-800 rounded p-2">
            {widget.code ?? ''}
          </pre>
        </div>
        {widget.extraProps && widget.extraProps.length > 0 && (
          <div className="px-3 py-2 border-t border-gray-700/60">
            <p className="text-[10px] text-gray-500 mb-1">Extra attributes</p>
            {widget.extraProps.map((ep, i) => (
              <code key={i} className="block text-[10px] text-gray-400 font-mono">{ep}</code>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-3 py-2 border-b border-gray-700">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] text-white font-semibold ${d.colorClass}`}>
          <span>{d.icon}</span>
          {d.label}
        </span>
      </div>

      <PropSection title="Position">
        <PropRow label="xpos"><NumInput value={widget.xpos} onChange={v => onUpdate({ xpos: v })} placeholder="auto" /></PropRow>
        <PropRow label="ypos"><NumInput value={widget.ypos} onChange={v => onUpdate({ ypos: v })} placeholder="auto" /></PropRow>
        <PropRow label="xalign"><NumInput value={widget.xalign} onChange={v => onUpdate({ xalign: v })} placeholder="0.0–1.0" /></PropRow>
        <PropRow label="yalign"><NumInput value={widget.yalign} onChange={v => onUpdate({ yalign: v })} placeholder="0.0–1.0" /></PropRow>
      </PropSection>

      <PropSection title="Size">
        <PropRow label="xsize"><NumInput value={widget.xsize} onChange={v => onUpdate({ xsize: v })} /></PropRow>
        <PropRow label="ysize"><NumInput value={widget.ysize} onChange={v => onUpdate({ ysize: v })} /></PropRow>
      </PropSection>

      {(widget.type === 'text' || widget.type === 'label' || widget.type === 'textbutton' || widget.type === 'input') && (
        <PropSection title="Content">
          <PropRow label="text"><StrInput value={widget.text} onChange={v => onUpdate({ text: v })} placeholder="label text" /></PropRow>
        </PropSection>
      )}

      {(widget.type === 'textbutton' || widget.type === 'button' || widget.type === 'imagebutton' || widget.type === 'dismiss') && (
        <PropSection title="Interaction">
          <PropRow label="action"><StrInput value={widget.action} onChange={v => onUpdate({ action: v })} placeholder="Return()" /></PropRow>
        </PropSection>
      )}

      {(widget.type === 'image' || widget.type === 'imagebutton') && (
        <PropSection title="Image">
          <PropRow label="path"><StrInput value={widget.imagePath} onChange={v => onUpdate({ imagePath: v })} placeholder="images/..." /></PropRow>
        </PropSection>
      )}

      {widget.type === 'viewport' && (
        <PropSection title="Scroll">
          <PropRow label="scrollbars">
            <select
              value={widget.scrollbars ?? ''}
              onChange={e => onUpdate({ scrollbars: (e.target.value || undefined) as ScreenWidget['scrollbars'] })}
              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-0.5 text-[12px] text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">none</option>
              <option value="vertical">vertical</option>
              <option value="horizontal">horizontal</option>
              <option value="both">both</option>
            </select>
          </PropRow>
          <PropRow label="mousewheel">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={widget.mousewheel ?? false}
                onChange={e => onUpdate({ mousewheel: e.target.checked || undefined })}
                className="accent-blue-500" />
              <span className="text-[12px] text-gray-300">enabled</span>
            </label>
          </PropRow>
        </PropSection>
      )}

      {(widget.type === 'vpgrid' || widget.type === 'grid') && (
        <PropSection title="Grid">
          <PropRow label="cols"><NumInput value={widget.cols} onChange={v => onUpdate({ cols: v })} /></PropRow>
          <PropRow label="rows"><NumInput value={widget.rows} onChange={v => onUpdate({ rows: v })} /></PropRow>
        </PropSection>
      )}

      {widget.type === 'on' && (
        <PropSection title="Event">
          <PropRow label="event"><StrInput value={widget.onEvent} onChange={v => onUpdate({ onEvent: v })} placeholder="show" /></PropRow>
          <PropRow label="action"><StrInput value={widget.action} onChange={v => onUpdate({ action: v })} placeholder="NullAction()" /></PropRow>
        </PropSection>
      )}

      {widget.type === 'default' && (
        <PropSection title="Variable">
          <PropRow label="name"><StrInput value={widget.defaultVariable} onChange={v => onUpdate({ defaultVariable: v })} placeholder="var" /></PropRow>
          <PropRow label="value"><StrInput value={widget.defaultValue} onChange={v => onUpdate({ defaultValue: v })} placeholder="0" /></PropRow>
        </PropSection>
      )}

      {(widget.type === 'hotspot' || widget.type === 'hotbar') && (
        <PropSection title="Area">
          <PropRow label="area"><StrInput value={widget.hotspotArea} onChange={v => onUpdate({ hotspotArea: v })} placeholder="(x, y, w, h)" /></PropRow>
          {widget.type === 'hotspot' && (
            <PropRow label="action"><StrInput value={widget.action} onChange={v => onUpdate({ action: v })} placeholder="Jump(...)" /></PropRow>
          )}
          {widget.type === 'hotbar' && (
            <PropRow label="value"><StrInput value={widget.barValue} onChange={v => onUpdate({ barValue: v })} placeholder="Preference(...)" /></PropRow>
          )}
        </PropSection>
      )}

      {widget.type === 'nearrect' && (
        <PropSection title="Nearrect">
          <PropRow label="focus"><StrInput value={widget.nearrectFocus} onChange={v => onUpdate({ nearrectFocus: v })} placeholder="tooltip" /></PropRow>
          <PropRow label="side"><StrInput value={widget.nearrectSide} onChange={v => onUpdate({ nearrectSide: v })} placeholder="bottom" /></PropRow>
        </PropSection>
      )}

      {widget.type === 'drag' && (
        <PropSection title="Drag">
          <PropRow label="drag_name"><StrInput value={widget.dragName} onChange={v => onUpdate({ dragName: v })} placeholder="slot_1" /></PropRow>
        </PropSection>
      )}

      {widget.type === 'use' && (
        <PropSection title="Screen">
          <PropRow label="screen"><StrInput value={widget.useScreen} onChange={v => onUpdate({ useScreen: v })} placeholder="screen_name" /></PropRow>
          <PropRow label="args"><StrInput value={widget.useArgs} onChange={v => onUpdate({ useArgs: v || undefined })} placeholder="arg=val" /></PropRow>
        </PropSection>
      )}

      {widget.type === 'key' && (
        <PropSection title="Key">
          <PropRow label="keysym"><StrInput value={widget.keyBinding} onChange={v => onUpdate({ keyBinding: v })} placeholder="game_menu" /></PropRow>
          <PropRow label="action"><StrInput value={widget.action} onChange={v => onUpdate({ action: v })} placeholder="ShowMenu(...)" /></PropRow>
        </PropSection>
      )}

      {widget.type === 'timer' && (
        <PropSection title="Timer">
          <PropRow label="delay"><StrInput value={widget.timerDelay} onChange={v => onUpdate({ timerDelay: v })} placeholder="3.0" /></PropRow>
          <PropRow label="action"><StrInput value={widget.action} onChange={v => onUpdate({ action: v })} placeholder="Jump(...)" /></PropRow>
        </PropSection>
      )}

      <PropSection title="Style">
        <PropRow label="style"><StrInput value={widget.style} onChange={v => onUpdate({ style: v })} placeholder="style name" /></PropRow>
      </PropSection>
    </div>
  );
}

// ─── Code panel ──────────────────────────────────────────────────────────────

function CodePanel({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="flex flex-col border-t border-gray-700 bg-gray-950 shrink-0" style={{ height: 180 }}>
      <div className="flex items-center justify-between px-3 py-1 shrink-0 border-b border-gray-700/60">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Generated Code</p>
        <button
          onClick={handleCopy}
          className={[
            'text-[11px] px-2 py-0.5 rounded transition-colors font-medium',
            copied ? 'bg-green-700 text-green-100' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white',
          ].join(' ')}
        >
          {copied ? '✓ Copied' : 'Copy Code'}
        </button>
      </div>
      <pre
        className="flex-1 overflow-auto px-3 py-2 text-[11px] leading-relaxed text-emerald-300 font-mono whitespace-pre"
        style={{ tabSize: 4 }}
      >
        {code}
      </pre>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export interface ScreenLayoutComposerV2Props {
  composition: ScreenLayoutComposition;
  onCompositionChange: Dispatch<SetStateAction<ScreenLayoutComposition>>;
  screenName: string;
  onRenameScreen: (name: string) => void;
  labels: string[];
  isLocked: boolean;
  isActive: boolean;
  onDuplicate: () => void;
  onGoToCode?: () => void;
  /** Raw Ren'Py screen block text — when provided, enables "Load from Code" */
  sourceCode?: string;
  activeEditor: unknown;
}

export default function ScreenLayoutComposerV2({
  composition,
  onCompositionChange,
  screenName,
  onRenameScreen,
  isLocked,
  onDuplicate,
  onGoToCode,
  sourceCode,
}: ScreenLayoutComposerV2Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingType, setDraggingType] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(screenName);

  useEffect(() => { setNameVal(screenName); }, [screenName]);

  function updateWidgets(updater: (ws: ScreenWidget[]) => ScreenWidget[]) {
    onCompositionChange(prev => ({ ...prev, widgets: updater(prev.widgets) }));
  }

  const handleDrop = useCallback((type: ScreenWidgetType, x: number, y: number) => {
    const newW = makeWidget(type, composition.gameWidth);
    updateWidgets(ws => insertIntoTree(ws, newW, selectedId, x, y));
    setSelectedId(newW.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, composition.gameWidth]);

  const handleLogicDrop = useCallback((code: string, x: number, y: number) => {
    const newW = makeRawWidget(code);
    updateWidgets(ws => insertIntoTree(ws, newW, selectedId, x, y));
    setSelectedId(newW.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const handlePatchWidget = useCallback((id: string, patch: Partial<ScreenWidget>) => {
    updateWidgets(ws => patchInTree(ws, id, patch));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReorder = useCallback((
    dragId: string, targetId: string, pos: 'before' | 'after' | 'inside',
  ) => {
    updateWidgets(ws => reorderInTree(ws, dragId, targetId, pos));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageDrop = useCallback((id: string, filePath: string, dataUrl: string) => {
    updateWidgets(ws => patchInTree(ws, id, { imagePath: filePath, imageDataUrl: dataUrl || undefined }));
    setSelectedId(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function commitName() {
    if (nameVal.trim()) onRenameScreen(nameVal.trim());
    setEditingName(false);
  }

  const handleDelete = useCallback(() => {
    if (!selectedId) return;
    updateWidgets(ws => {
      const [next] = removeFromTree(ws, selectedId);
      return next;
    });
    setSelectedId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if ((e.target as HTMLElement).isContentEditable) return;
      handleDelete();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleDelete]);

  const handleLoadFromCode = useCallback(() => {
    if (!sourceCode) return;
    const parsed = parseScreenCode(sourceCode);
    onCompositionChange(prev => ({
      ...parsed,
      gameWidth: prev.gameWidth,
      gameHeight: prev.gameHeight,
    }));
    setSelectedId(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceCode]);

  const selectedWidget = selectedId ? findWidget(composition.widgets, selectedId) : null;
  const generatedCode = useMemo(() => generateScreenCode(composition), [composition]);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white overflow-hidden">

      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-gray-700 shrink-0 bg-gray-800/60">
        {editingName ? (
          <input
            autoFocus
            value={nameVal}
            onChange={e => setNameVal(e.target.value)}
            onBlur={commitName}
            onKeyDown={e => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') setEditingName(false); }}
            className="text-sm font-semibold bg-gray-700 border border-blue-500 rounded px-2 py-0.5 text-white focus:outline-none"
          />
        ) : (
          <button
            disabled={isLocked}
            onClick={() => setEditingName(true)}
            className="text-sm font-semibold hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={isLocked ? 'Screen is defined in code — cannot rename' : 'Click to rename'}
          >
            {screenName}
          </button>
        )}
        {isLocked && (
          <span className="text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/30 px-1.5 py-0.5 rounded">
            locked
          </span>
        )}
        <div className="flex-1" />
        {sourceCode && (
          <button
            onClick={handleLoadFromCode}
            className="text-xs text-amber-400 hover:text-amber-200 px-2 py-1 rounded hover:bg-amber-900/30 transition-colors border border-amber-700/40"
            title="Parse the .rpy screen code and load it into the composer"
          >
            Load from Code
          </button>
        )}
        <button
          onClick={onDuplicate}
          className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors"
        >
          Duplicate
        </button>
        {onGoToCode && (
          <button
            onClick={onGoToCode}
            className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors"
          >
            Go to Code
          </button>
        )}
      </div>

      {/* ── Three-column body ────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: Palette + Layers */}
        <div className="w-44 flex flex-col border-r border-gray-700 shrink-0 overflow-hidden">
          <div className="shrink-0 max-h-[55%] flex flex-col overflow-hidden border-b border-gray-700">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1.5 shrink-0">
              Elements
            </p>
            <div className="overflow-y-auto">
              <PalettePanel
                onDragStart={() => setDraggingType(true)}
                onDragEnd={() => setDraggingType(false)}
                onLogicDragStart={() => setDraggingType(true)}
              />
            </div>
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1.5 shrink-0">
              Layers
            </p>
            <LayersPanel
              widgets={composition.widgets}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onReorder={handleReorder}
              onImageDrop={handleImageDrop}
            />
          </div>
        </div>

        {/* Center: Canvas + Code panel */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <ComposerCanvas
            composition={composition}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDrop={handleDrop}
            onLogicDrop={handleLogicDrop}
            onPatchWidget={handlePatchWidget}
            draggingType={draggingType}
            onImageDrop={handleImageDrop}
          />
          <CodePanel code={generatedCode} />
        </div>

        {/* Right: Properties */}
        <div className="w-52 flex flex-col border-l border-gray-700 shrink-0 overflow-hidden">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1.5 border-b border-gray-700 shrink-0">
            Properties
          </p>
          <PropertiesPanel
            widget={selectedWidget ?? null}
            onUpdate={patch => selectedId && handlePatchWidget(selectedId, patch)}
          />
        </div>

      </div>
    </div>
  );
}
