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

// ─── Element catalogue ────────────────────────────────────────────────────────

type ElemDef = {
  label: string;
  icon: string;
  colorClass: string;
  isContainer: boolean;
  defaultProps: Partial<Omit<ScreenWidget, 'id' | 'type'>>;
};

const ELEM: Record<ScreenWidgetType, ElemDef> = {
  vbox:        { label: 'VBox',       icon: '↕',  colorClass: 'bg-blue-700',   isContainer: true,  defaultProps: {} },
  hbox:        { label: 'HBox',       icon: '↔',  colorClass: 'bg-blue-500',   isContainer: true,  defaultProps: {} },
  frame:       { label: 'Frame',      icon: '▭',  colorClass: 'bg-indigo-600', isContainer: true,  defaultProps: { xsize: 140, ysize: 90 } },
  text:        { label: 'Text',       icon: 'T',  colorClass: 'bg-gray-500',   isContainer: false, defaultProps: { text: 'Hello' } },
  image:       { label: 'Image',      icon: '⬜', colorClass: 'bg-emerald-700',isContainer: false, defaultProps: {} },
  textbutton:  { label: 'TextButton', icon: 'TB', colorClass: 'bg-orange-500', isContainer: false, defaultProps: { text: 'Click Me', action: 'Return()' } },
  button:      { label: 'Button',     icon: 'Bt', colorClass: 'bg-orange-700', isContainer: true,  defaultProps: { xsize: 100, ysize: 40, action: 'Return()' } },
  imagebutton: { label: 'ImgButton',  icon: 'IB', colorClass: 'bg-amber-600',  isContainer: false, defaultProps: { action: 'Return()' } },
  bar:         { label: 'Bar',        icon: '▬',  colorClass: 'bg-purple-600', isContainer: false, defaultProps: { xsize: 200, ysize: 20 } },
  input:       { label: 'Input',      icon: '✎',  colorClass: 'bg-teal-600',   isContainer: false, defaultProps: { text: '' } },
  null:        { label: 'Null',       icon: '∅',  colorClass: 'bg-gray-600',   isContainer: false, defaultProps: {} },
};

const PALETTE_GROUPS: { label: string; types: ScreenWidgetType[] }[] = [
  { label: 'Layout',      types: ['vbox', 'hbox', 'frame'] },
  { label: 'Display',     types: ['text', 'image'] },
  { label: 'Interactive', types: ['textbutton', 'button', 'imagebutton'] },
  { label: 'Other',       types: ['bar', 'input', 'null'] },
];

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

function makeWidget(type: ScreenWidgetType): ScreenWidget {
  const def = ELEM[type];
  return {
    id: genId(),
    type,
    ...def.defaultProps,
    ...(def.isContainer ? { children: [] } : {}),
  };
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
  onDragStart, onDragEnd,
}: {
  onDragStart: (type: ScreenWidgetType) => void;
  onDragEnd: () => void;
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
    </div>
  );
}

// ─── Layer tree ───────────────────────────────────────────────────────────────

function LayerNode({
  widget, depth, selectedId, onSelect, layerDragId, setLayerDragId, onReorder,
}: {
  widget: ScreenWidget;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  layerDragId: string | null;
  setLayerDragId: (id: string | null) => void;
  onReorder: (dragId: string, targetId: string, pos: 'before' | 'after' | 'inside') => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [dropHint, setDropHint] = useState<'before' | 'after' | 'inside' | null>(null);
  const d = ELEM[widget.type];
  const isSelected = selectedId === widget.id;

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
        onDragEnd={() => { setLayerDragId(null); setDropHint(null); }}
        onDragOver={e => {
          if (!layerDragId || layerDragId === widget.id) return;
          e.preventDefault();
          e.stopPropagation();
          setDropHint(calcPos(e));
        }}
        onDragLeave={() => setDropHint(null)}
        onDrop={e => {
          e.preventDefault();
          e.stopPropagation();
          const lid = e.dataTransfer.getData('text/x-layer-id');
          if (lid && lid !== widget.id && dropHint) {
            onReorder(lid, widget.id, dropHint);
          }
          setDropHint(null);
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
          className={`w-4 h-4 rounded text-[9px] flex items-center justify-center shrink-0 text-white font-bold ${d.colorClass}`}
        >
          {d.icon}
        </span>
        <span className="text-[11px] truncate leading-tight">
          {d.label}{widget.text ? ` "${widget.text}"` : ''}
        </span>
      </div>
      {d.isContainer && expanded && widget.children?.map(child => (
        <LayerNode
          key={child.id}
          widget={child}
          depth={depth + 1}
          selectedId={selectedId}
          onSelect={onSelect}
          layerDragId={layerDragId}
          setLayerDragId={setLayerDragId}
          onReorder={onReorder}
        />
      ))}
    </div>
  );
}

function LayersPanel({
  widgets, selectedId, onSelect, onReorder,
}: {
  widgets: ScreenWidget[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onReorder: (dragId: string, targetId: string, pos: 'before' | 'after' | 'inside') => void;
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
        />
      ))}
    </div>
  );
}

// ─── Canvas widget renderer ───────────────────────────────────────────────────

type PointerDownFn = (e: React.PointerEvent, id: string) => void;

function CanvasWidget({
  widget, selectedId, onSelect, scale, onPointerDown, isTopLevel,
}: {
  widget: ScreenWidget;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  scale: number;
  onPointerDown?: PointerDownFn;
  isTopLevel: boolean;
}) {
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
    />
  ));

  switch (widget.type) {
    case 'vbox':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, display: 'flex', flexDirection: 'column', gap: 4, padding: 4, minWidth: 40, minHeight: 20, border: '1px dashed #93c5fd55' }}>
          {children}
        </div>
      );
    case 'hbox':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, display: 'flex', flexDirection: 'row', gap: 4, padding: 4, minWidth: 40, minHeight: 20, border: '1px dashed #93c5fd55' }}>
          {children}
        </div>
      );
    case 'frame':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, border: '2px solid #818cf8', borderRadius: 4, padding: 8, minWidth: 60, minHeight: 40 }}>
          {children}
        </div>
      );
    case 'button':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, border: '2px solid #ea580c', borderRadius: 4, minWidth: 40, minHeight: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </div>
      );
    case 'text':
      return (
        <span onClick={click} onPointerDown={ptrDown} style={{ ...base, color: '#e5e7eb', fontSize: 14, whiteSpace: 'nowrap', display: 'inline-block' }}>
          {widget.text || 'text'}
        </span>
      );
    case 'textbutton':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, background: '#c2410c', color: 'white', padding: '4px 12px', borderRadius: 4, fontSize: 13, display: 'inline-block', whiteSpace: 'nowrap' }}>
          {widget.text || 'Button'}
        </div>
      );
    case 'image':
      return widget.imageDataUrl ? (
        <img
          src={widget.imageDataUrl}
          alt={widget.imagePath || 'image'}
          onClick={click}
          onPointerDown={ptrDown}
          style={{ ...base, maxWidth: 200, maxHeight: 150, objectFit: 'contain', display: 'block' }}
        />
      ) : (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, width: widget.xsize ?? 80, height: widget.ysize ?? 60, border: '2px dashed #059669', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6ee7b7', fontSize: 11 }}>
          {widget.imagePath || 'image'}
        </div>
      );
    case 'imagebutton':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, width: widget.xsize ?? 80, height: widget.ysize ?? 50, border: '2px solid #d97706', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', fontSize: 10, background: '#1c1917' }}>
          IB
        </div>
      );
    case 'bar':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, width: widget.xsize ?? 200, height: widget.ysize ?? 20, background: '#3b0764', borderRadius: 4, overflow: 'hidden', position: isTopLevel ? 'absolute' : 'relative' }}>
          <div style={{ left: widget.xpos ?? 0, top: widget.ypos ?? 0, width: '60%', height: '100%', background: '#7c3aed', borderRadius: 4, position: 'absolute' }} />
        </div>
      );
    case 'input':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, padding: '3px 8px', border: '1px solid #0f766e', borderRadius: 4, background: '#042f2e', color: '#99f6e4', fontSize: 13, minWidth: 120, display: 'inline-flex', alignItems: 'center', gap: 1 }}>
          <span>{widget.text || ''}</span>
          <span style={{ opacity: 0.5 }}>|</span>
        </div>
      );
    case 'null':
      return (
        <div onClick={click} onPointerDown={ptrDown} style={{ ...base, width: 20, height: 20, border: '1px dashed #6b7280', opacity: 0.4 }} />
      );
    default:
      return null;
  }
}

// ─── Composer canvas ──────────────────────────────────────────────────────────

function ComposerCanvas({
  composition, selectedId, onSelect, onDrop, onPatchWidget, draggingPaletteType,
}: {
  composition: ScreenLayoutComposition;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDrop: (type: ScreenWidgetType, x: number, y: number) => void;
  onPatchWidget: (id: string, patch: Partial<ScreenWidget>) => void;
  draggingPaletteType: ScreenWidgetType | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [dropActive, setDropActive] = useState(false);

  // Keep latest callbacks in refs so the window listeners don't go stale
  const onPatchRef = useRef(onPatchWidget);
  useEffect(() => { onPatchRef.current = onPatchWidget; }, [onPatchWidget]);

  const scaleRef = useRef(scale);
  useEffect(() => { scaleRef.current = scale; }, [scale]);

  const widgetsRef = useRef(composition.widgets);
  useEffect(() => { widgetsRef.current = composition.widgets; }, [composition.widgets]);

  // Scale the game canvas to fit the container
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

  // Root-widget pointer drag state
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
  }, []); // intentionally empty — uses refs

  function gameCoords(e: React.DragEvent) {
    if (!gameRef.current) return { x: 0, y: 0 };
    const r = gameRef.current.getBoundingClientRect();
    return {
      x: Math.round((e.clientX - r.left) / scaleRef.current),
      y: Math.round((e.clientY - r.top) / scaleRef.current),
    };
  }

  const border = dropActive && draggingPaletteType
    ? '2px dashed #3b82f6'
    : '1px solid #3f3f46';

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center bg-gray-950 overflow-hidden"
      onClick={() => onSelect(null)}
    >
      <div
        ref={gameRef}
        style={{
          width: composition.gameWidth,
          height: composition.gameHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          position: 'relative',
          background: '#18181b',
          border,
          boxShadow: '0 0 48px rgba(0,0,0,0.9)',
          flexShrink: 0,
        }}
        onDragOver={e => {
          if (!draggingPaletteType) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
          setDropActive(true);
        }}
        onDragLeave={() => setDropActive(false)}
        onDrop={e => {
          e.preventDefault();
          const type = e.dataTransfer.getData('text/x-widget-type') as ScreenWidgetType;
          if (!type || !ELEM[type]) return;
          const { x, y } = gameCoords(e);
          onDrop(type, x, y);
          setDropActive(false);
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
          />
        ))}
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

function NumInput({
  value, onChange, placeholder,
}: {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  placeholder?: string;
}) {
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

function StrInput({
  value, onChange, placeholder,
}: {
  value: string | undefined;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
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

  const d = ELEM[widget.type];

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

      {(widget.type === 'text' || widget.type === 'textbutton' || widget.type === 'input') && (
        <PropSection title="Content">
          <PropRow label="text"><StrInput value={widget.text} onChange={v => onUpdate({ text: v })} placeholder="label text" /></PropRow>
        </PropSection>
      )}

      {(widget.type === 'textbutton' || widget.type === 'button' || widget.type === 'imagebutton') && (
        <PropSection title="Interaction">
          <PropRow label="action"><StrInput value={widget.action} onChange={v => onUpdate({ action: v })} placeholder="Return()" /></PropRow>
        </PropSection>
      )}

      {(widget.type === 'image' || widget.type === 'imagebutton') && (
        <PropSection title="Image">
          <PropRow label="path"><StrInput value={widget.imagePath} onChange={v => onUpdate({ imagePath: v })} placeholder="images/..." /></PropRow>
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
            copied
              ? 'bg-green-700 text-green-100'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white',
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
}: ScreenLayoutComposerV2Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingPaletteType, setDraggingPaletteType] = useState<ScreenWidgetType | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(screenName);

  // Sync nameVal when screenName prop changes
  useEffect(() => { setNameVal(screenName); }, [screenName]);

  function updateWidgets(updater: (ws: ScreenWidget[]) => ScreenWidget[]) {
    onCompositionChange(prev => ({ ...prev, widgets: updater(prev.widgets) }));
  }

  const handleDrop = useCallback((type: ScreenWidgetType, x: number, y: number) => {
    const newW = makeWidget(type);
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

  function commitName() {
    if (nameVal.trim()) onRenameScreen(nameVal.trim());
    setEditingName(false);
  }

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
          {/* Palette */}
          <div className="shrink-0 max-h-[55%] flex flex-col overflow-hidden border-b border-gray-700">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1.5 shrink-0">
              Elements
            </p>
            <div className="overflow-y-auto">
              <PalettePanel
                onDragStart={setDraggingPaletteType}
                onDragEnd={() => setDraggingPaletteType(null)}
              />
            </div>
          </div>
          {/* Layers */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1.5 shrink-0">
              Layers
            </p>
            <LayersPanel
              widgets={composition.widgets}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onReorder={handleReorder}
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
            onPatchWidget={handlePatchWidget}
            draggingPaletteType={draggingPaletteType}
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
