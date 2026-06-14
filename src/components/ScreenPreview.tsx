/**
 * ScreenPreview — Read-only HTML/CSS approximation of a Ren'Py screen.
 *
 * Takes a ScreenLayoutComposition (already parsed) and renders the widget
 * tree scaled to fit the available container at the correct game aspect ratio.
 * No drag, no selection, no property panel — purely visual output.
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { ScreenLayoutComposition, ScreenWidget } from '@/types';
import { ELEM, HINT_KW_MAP, extractRawHints, rawBlockStyle } from '@/lib/screenWidgetDefs';

const ZOOM_STEPS = [0.1, 0.15, 0.2, 0.25, 0.33, 0.4, 0.5, 0.6, 0.75, 1.0, 1.25, 1.5, 2.0];

// ─── Read-only widget renderer ────────────────────────────────────────────────

function PreviewWidget({
  widget,
  isTopLevel,
  gameWidth,
}: {
  widget: ScreenWidget;
  isTopLevel: boolean;
  gameWidth: number;
}) {
  const u = gameWidth / 1920;

  const pos: React.CSSProperties = isTopLevel
    ? { position: 'absolute', left: widget.xpos ?? 0, top: widget.ypos ?? 0 }
    : {};

  const size: React.CSSProperties = {
    ...(widget.xsize != null ? { width: widget.xsize } : {}),
    ...(widget.ysize != null ? { height: widget.ysize } : {}),
  };

  const base: React.CSSProperties = { ...pos, ...size };

  const children = widget.children?.map(child => (
    <PreviewWidget key={child.id} widget={child} isTopLevel={false} gameWidth={gameWidth} />
  ));

  const r = (n: number) => Math.round(n * u);
  const fs    = r(22);
  const fsSm  = r(16);
  const br    = r(4);
  const gap   = r(6);
  const pad   = r(8);
  const trackW = r(12);
  const thumbW = r(8);
  const imgW  = r(240);
  const imgH  = r(180);

  switch (widget.type) {
    case 'vbox':
      return (
        <div style={{ ...base, display: 'flex', flexDirection: 'column', gap, padding: pad, border: `${Math.max(1, r(1))}px dashed #93c5fd44` }}>
          {children}
        </div>
      );
    case 'hbox':
      return (
        <div style={{ ...base, display: 'flex', flexDirection: 'row', gap, padding: pad, border: `${Math.max(1, r(1))}px dashed #93c5fd44` }}>
          {children}
        </div>
      );
    case 'frame':
      return (
        <div style={{ ...base, border: `${Math.max(1, r(2))}px solid #818cf8`, borderRadius: br, padding: r(12) }}>
          {children}
        </div>
      );
    case 'window':
      return (
        <div style={{ ...base, border: `${Math.max(1, r(2))}px solid #0ea5e9`, borderRadius: r(6), padding: r(12), background: 'rgba(14,165,233,0.06)' }}>
          {children}
        </div>
      );
    case 'viewport': {
      const vpW = widget.xsize ?? r(600);
      const vpH = widget.ysize ?? r(400);
      const hasScrollV = widget.scrollbars === 'vertical' || widget.scrollbars === 'both';
      const hasScrollH = widget.scrollbars === 'horizontal' || widget.scrollbars === 'both';
      return (
        <div style={{ ...base, width: vpW, height: vpH, border: `${Math.max(1, r(2))}px solid #0891b2`, borderRadius: br, overflow: 'hidden', position: isTopLevel ? 'absolute' : 'relative' }}>
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
        <div style={{ ...base, border: `${Math.max(1, r(2))}px solid #ea580c`, borderRadius: br, minWidth: r(80), minHeight: r(54), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </div>
      );
    case 'text':
      return (
        <span style={{ ...base, color: '#e5e7eb', fontSize: fs, whiteSpace: 'nowrap', display: 'inline-block' }}>
          {widget.text || 'text'}
        </span>
      );
    case 'label':
      return (
        <div style={{ ...base, color: '#d1d5db', fontSize: fs, padding: `${r(6)}px ${r(12)}px`, border: `${Math.max(1, r(1))}px solid #6b7280`, borderRadius: br, display: 'inline-block', whiteSpace: 'nowrap' }}>
          {widget.text || 'Label'}
        </div>
      );
    case 'textbutton':
      return (
        <div style={{ ...base, background: '#c2410c', color: 'white', padding: `${r(10)}px ${r(28)}px`, borderRadius: br, fontSize: fs, display: 'inline-block', whiteSpace: 'nowrap' }}>
          {widget.text || 'Button'}
        </div>
      );
    case 'image': {
      if (widget.imageDataUrl) {
        return (
          <img
            src={widget.imageDataUrl}
            alt={widget.imagePath || 'image'}
            style={{ ...base, objectFit: 'contain', display: 'block' }}
          />
        );
      }
      const imgFallbackW = widget.xsize ?? imgW;
      const imgFallbackH = widget.ysize ?? imgH;
      if (widget.imagePath) {
        return (
          <div style={{ ...base, width: imgFallbackW, height: imgFallbackH, border: `${Math.max(1, r(2))}px dashed #f59e0b`, borderRadius: br, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', fontSize: fsSm, gap: r(4) }}>
            <span style={{ fontSize: r(24) }}>⚠</span>
            <span style={{ maxWidth: r(160), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{widget.imagePath.split('/').pop()}</span>
          </div>
        );
      }
      return (
        <div style={{ ...base, width: imgFallbackW, height: imgFallbackH, border: `${Math.max(1, r(2))}px dashed #059669`, borderRadius: br, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6ee7b7', fontSize: fsSm }}>
          add image
        </div>
      );
    }
    case 'imagebutton':
      return (
        <div style={{ ...base, width: widget.xsize ?? imgW, height: widget.ysize ?? imgH, border: `${Math.max(1, r(2))}px solid #d97706`, borderRadius: br, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', fontSize: r(18), background: '#1c1917' }}>
          IB
        </div>
      );
    case 'bar':
      return (
        <div style={{ ...base, width: widget.xsize ?? r(450), height: widget.ysize ?? r(36), background: '#3b0764', borderRadius: r(18), overflow: 'hidden', position: isTopLevel ? 'absolute' : 'relative' }}>
          <div style={{ width: '60%', height: '100%', background: '#7c3aed', borderRadius: r(18) }} />
        </div>
      );
    case 'vbar':
      return (
        <div style={{ ...base, width: widget.xsize ?? r(36), height: widget.ysize ?? r(450), background: '#3b0764', borderRadius: r(18), overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: isTopLevel ? 'absolute' : 'relative' }}>
          <div style={{ width: '100%', height: '60%', background: '#7c3aed', borderRadius: r(18) }} />
        </div>
      );
    case 'input':
      return (
        <div style={{ ...base, padding: `${r(8)}px ${r(18)}px`, border: `${Math.max(1, r(1))}px solid #0f766e`, borderRadius: br, background: '#042f2e', color: '#99f6e4', fontSize: fs, minWidth: r(300), display: 'inline-flex', alignItems: 'center', gap: r(2) }}>
          <span>{widget.text || ''}</span>
          <span style={{ opacity: 0.5 }}>|</span>
        </div>
      );
    case 'null':
      return (
        <div style={{ ...base, width: widget.xsize ?? r(50), height: widget.ysize ?? r(50), border: `${Math.max(1, r(1))}px dashed #6b7280`, opacity: 0.4 }} />
      );
    case 'fixed':
      return (
        <div style={{ ...base, position: isTopLevel ? 'absolute' : 'relative', minWidth: r(80), minHeight: r(60), border: `${Math.max(1, r(1))}px dashed #60a5fa55` }}>
          {children}
        </div>
      );
    case 'side':
      return (
        <div style={{ ...base, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', gap, minWidth: r(120), minHeight: r(90), border: `${Math.max(1, r(1))}px dashed #93c5fd55` }}>
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
        <div style={{ ...base, display: 'grid', gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap, padding: pad, minWidth: r(120), minHeight: r(90), border: `${Math.max(1, r(2))}px solid #0369a1`, borderRadius: br }}>
          {children}
        </div>
      );
    }
    case 'vpgrid': {
      const vpgCols = widget.cols ?? 1;
      return (
        <div style={{ ...base, display: 'grid', gridTemplateColumns: `repeat(${vpgCols}, 1fr)`, gap, padding: pad, minWidth: r(120), minHeight: r(90), border: `${Math.max(1, r(2))}px solid #0891b2`, borderRadius: br, overflow: 'hidden' }}>
          {children}
        </div>
      );
    }
    case 'transform':
      return (
        <div style={{ ...base, border: `${Math.max(1, r(1))}px dashed #7c3aed55`, borderRadius: br, padding: r(6), minWidth: r(60), minHeight: r(40) }}>
          {children}
        </div>
      );
    case 'drag':
      return (
        <div style={{ ...base, border: `${Math.max(1, r(2))}px solid #c2410c`, borderRadius: br, padding: r(6), minWidth: r(80), minHeight: r(54) }}>
          {widget.dragName && (
            <div style={{ fontSize: r(11), color: '#fb923c', fontFamily: 'monospace', marginBottom: r(4) }}>⣿ {widget.dragName}</div>
          )}
          {children}
        </div>
      );
    case 'draggroup':
      return (
        <div style={{ ...base, border: `${Math.max(1, r(2))}px dashed #9a3412`, borderRadius: br, padding: r(8), minWidth: r(120), minHeight: r(80) }}>
          {children}
        </div>
      );
    case 'imagemap':
      return (
        <div style={{ ...base, border: `${Math.max(1, r(2))}px solid #047857`, borderRadius: br, padding: r(8), minWidth: r(200), minHeight: r(150), background: 'rgba(4,120,87,0.04)' }}>
          <div style={{ fontSize: r(11), color: '#6ee7b7', fontFamily: 'monospace', marginBottom: r(4) }}>🗺 imagemap</div>
          {children}
        </div>
      );
    case 'hotspot':
      return (
        <div style={{ ...base, border: `${Math.max(1, r(1))}px dashed #16a34a`, borderRadius: br, padding: `${r(4)}px ${r(8)}px`, background: 'rgba(22,163,74,0.08)', fontSize: fsSm, color: '#86efac', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
          ⬡ {widget.hotspotArea ?? '(0,0,0,0)'}
        </div>
      );
    case 'hotbar':
      return (
        <div style={{ ...base, border: `${Math.max(1, r(1))}px dashed #15803d`, borderRadius: br, padding: `${r(4)}px ${r(8)}px`, background: 'rgba(21,128,61,0.08)', fontSize: fsSm, color: '#86efac', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
          ⬡▬ {widget.hotspotArea ?? '(0,0,0,0)'}
        </div>
      );
    case 'mousearea':
      return (
        <div style={{ ...base, border: `${Math.max(1, r(1))}px dashed #64748b`, borderRadius: br, minWidth: r(80), minHeight: r(40), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fsSm, color: '#94a3b8', fontFamily: 'monospace' }}>
          mousearea
        </div>
      );
    case 'nearrect':
      return (
        <div style={{ ...base, border: `${Math.max(1, r(1))}px dashed #475569`, borderRadius: r(8), padding: r(8), minWidth: r(80), minHeight: r(40), background: 'rgba(71,85,105,0.08)' }}>
          <div style={{ fontSize: r(11), color: '#94a3b8', fontFamily: 'monospace', marginBottom: r(4) }}>⊡ nearrect</div>
          {children}
        </div>
      );
    case 'dismiss':
      return (
        <div style={{ ...base, border: `${Math.max(1, r(1))}px dashed #b91c1c`, borderRadius: br, padding: `${r(6)}px ${r(14)}px`, background: 'rgba(185,28,28,0.08)', fontSize: fsSm, color: '#fca5a5', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
          ✕ dismiss
        </div>
      );
    case 'on':
      return (
        <div style={{ ...base, border: `${Math.max(1, r(1))}px dashed #ca8a04`, borderRadius: br, padding: `${r(6)}px ${r(14)}px`, background: 'rgba(202,138,4,0.07)', fontSize: r(16), color: '#fde68a', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
          ⚡ on "{widget.onEvent ?? ''}"
        </div>
      );
    case 'default':
      return (
        <div style={{ ...base, border: `${Math.max(1, r(1))}px dashed #64748b`, borderRadius: br, padding: `${r(6)}px ${r(14)}px`, background: 'rgba(100,116,139,0.07)', fontSize: r(16), color: '#94a3b8', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
          ≔ default {widget.defaultVariable} = {widget.defaultValue}
        </div>
      );
    case 'use':
      return (
        <div style={{ ...base, border: `${Math.max(1, r(2))}px solid #7c3aed`, borderRadius: br, padding: r(10), minWidth: r(100), minHeight: r(40), background: 'rgba(124,58,237,0.06)', display: 'flex', flexDirection: 'column', gap: r(4) }}>
          <div style={{ fontSize: r(13), color: '#a78bfa', fontFamily: 'monospace', userSelect: 'none' }}>
            use {widget.useScreen}{widget.useArgs ? `(${widget.useArgs})` : ''}
          </div>
          {widget.children?.map(child => (
            <PreviewWidget key={child.id} widget={child} isTopLevel={false} gameWidth={gameWidth} />
          ))}
        </div>
      );
    case 'key':
      return (
        <div style={{ ...base, border: `${Math.max(1, r(1))}px dashed #64748b`, borderRadius: br, padding: `${r(6)}px ${r(12)}px`, background: 'rgba(100,116,139,0.07)', fontFamily: 'monospace', fontSize: r(16), color: '#94a3b8', whiteSpace: 'nowrap' }}>
          key "{widget.keyBinding ?? ''}" {widget.action ? `action ${widget.action}` : ''}
        </div>
      );
    case 'timer':
      return (
        <div style={{ ...base, border: `${Math.max(1, r(1))}px dashed #64748b`, borderRadius: br, padding: `${r(6)}px ${r(12)}px`, background: 'rgba(100,116,139,0.07)', fontFamily: 'monospace', fontSize: r(16), color: '#94a3b8', whiteSpace: 'nowrap' }}>
          timer {widget.timerDelay ?? '0'}{widget.action ? ` action ${widget.action}` : ''}
        </div>
      );
    case 'transclude':
      return (
        <div style={{ ...base, border: `${Math.max(1, r(1))}px dashed #4f46e5`, borderRadius: br, padding: `${r(6)}px ${r(16)}px`, background: 'rgba(79,70,229,0.06)', fontFamily: 'monospace', fontSize: r(16), color: '#818cf8', whiteSpace: 'nowrap' }}>
          transclude
        </div>
      );
    case 'raw': {
      const rawCode = widget.code ?? '';
      const codeLines = rawCode.split('\n');
      const firstLine = (codeLines[0] ?? '').trim();
      const previewLines = codeLines.slice(1, 4);
      const hints = extractRawHints(rawCode);
      const { icon: rIcon, color: rColor } = rawBlockStyle(rawCode);
      return (
        <div style={{ ...base, border: `${Math.max(1, r(1))}px dashed #52525b`, borderRadius: br, background: 'rgba(24,24,27,0.9)', minWidth: r(160), maxWidth: r(700), overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: r(6), padding: `${r(5)}px ${r(10)}px`, borderBottom: '1px solid #27272a' }}>
            <span style={{ fontSize: r(14), color: rColor, fontWeight: 'bold', fontFamily: 'monospace', flexShrink: 0 }}>{rIcon}</span>
            <span style={{ fontSize: r(13), color: '#a1a1aa', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {firstLine}
            </span>
          </div>
          {previewLines.length > 0 && (
            <pre style={{ padding: `${r(4)}px ${r(10)}px`, fontSize: r(11), color: '#52525b', fontFamily: 'monospace', margin: 0, lineHeight: 1.4, overflow: 'hidden' }}>
              {previewLines.join('\n')}
            </pre>
          )}
          {hints.length > 0 && (
            <div style={{ display: 'flex', gap: r(3), padding: `${r(4)}px ${r(10)}px`, borderTop: '1px solid #27272a', flexWrap: 'wrap' }}>
              {hints.map(h => {
                const hd = ELEM[h];
                return (
                  <span key={h} title={hd?.label ?? h} style={{ fontSize: r(11), color: '#71717a', fontFamily: 'monospace', background: '#27272a', borderRadius: r(3), padding: `${r(1)}px ${r(4)}px` }}>
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

// ─── ScreenPreview ────────────────────────────────────────────────────────────

export interface ScreenPreviewProps {
  composition: ScreenLayoutComposition;
  className?: string;
}

export default function ScreenPreview({ composition, className }: ScreenPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(0.5);
  // null = "fit to container"; number = manual override
  const [manualScale, setManualScale] = useState<number | null>(null);

  const scale = manualScale ?? fitScale;

  const recalc = useCallback(() => {
    if (!containerRef.current) return;
    const cw = containerRef.current.clientWidth - 64;
    if (cw < 20) return;
    setFitScale(Math.min(cw / composition.gameWidth, 1));
  }, [composition.gameWidth]);

  useEffect(() => {
    recalc();
    const ro = new ResizeObserver(recalc);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', recalc);
    return () => { ro.disconnect(); window.removeEventListener('resize', recalc); };
  }, [recalc]);

  const zoomIn = () => {
    const next = ZOOM_STEPS.find(z => z > scale * 1.001);
    if (next != null) setManualScale(next);
  };
  const zoomOut = () => {
    const next = [...ZOOM_STEPS].reverse().find(z => z < scale * 0.999);
    if (next != null) setManualScale(next);
  };
  const resetFit = () => setManualScale(null);

  const canZoomIn = scale < ZOOM_STEPS[ZOOM_STEPS.length - 1] * 0.999;
  const canZoomOut = scale > ZOOM_STEPS[0] * 1.001;

  return (
    <div className={`flex flex-col${className ? ` ${className}` : ''}`} style={{ flex: 1, minHeight: 0 }}>
      {/* Zoom toolbar */}
      <div className="flex items-center gap-1 px-3 py-1 border-b border-gray-800 bg-gray-950 flex-none select-none">
        <button
          onClick={zoomOut}
          disabled={!canZoomOut}
          title="Zoom out"
          className="px-2 py-0.5 rounded text-gray-400 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-mono leading-none"
        >−</button>
        <button
          onClick={resetFit}
          title="Fit to panel width"
          className={`px-2 py-0.5 rounded text-xs font-mono leading-none min-w-[52px] text-center ${manualScale == null ? 'bg-blue-900 text-blue-300' : 'text-gray-400 hover:bg-gray-800'}`}
        >
          {manualScale == null ? 'fit' : `${Math.round(scale * 100)}%`}
        </button>
        <button
          onClick={zoomIn}
          disabled={!canZoomIn}
          title="Zoom in"
          className="px-2 py-0.5 rounded text-gray-400 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-mono leading-none"
        >+</button>
        <span className="text-xs text-gray-600 ml-1 font-mono">{Math.round(scale * 100)}%</span>
      </div>

      <div
        ref={containerRef}
        className="flex-1 bg-gray-950 overflow-auto"
        style={{ padding: 32 }}
      >
        {/* Wrapper sized to scaled dimensions so scroll area knows content size. */}
        <div style={{
          width: Math.round(composition.gameWidth * scale),
          height: Math.round(composition.gameHeight * scale),
          position: 'relative',
          margin: '0 auto',
        }}>
          <div style={{
            width: composition.gameWidth,
            height: composition.gameHeight,
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
            position: 'absolute',
            top: 0,
            left: 0,
            background: '#18181b',
            overflow: 'hidden',
            border: '4px solid #dc2626',
            boxShadow: '0 0 32px rgba(0,0,0,0.8)',
          }}>
            {composition.widgets.map(w => (
              <PreviewWidget
                key={w.id}
                widget={w}
                isTopLevel
                gameWidth={composition.gameWidth}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-export helpers so consumers can build layer labels / badges if needed.
export { ELEM, rawBlockStyle, extractRawHints };
export type { ElemDef } from '@/lib/screenWidgetDefs';
