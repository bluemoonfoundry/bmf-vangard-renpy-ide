import type { ScreenWidgetType } from '@/types';

export type ElemDef = {
  label: string;
  icon: string;
  colorClass: string;
  color: string;
  isContainer: boolean;
};

export const ELEM: Record<ScreenWidgetType, ElemDef> = {
  // Layout containers
  vbox:        { label: 'VBox',       icon: '↕',  colorClass: 'bg-blue-700',    color: '#1d4ed8', isContainer: true  },
  hbox:        { label: 'HBox',       icon: '↔',  colorClass: 'bg-blue-500',    color: '#3b82f6', isContainer: true  },
  fixed:       { label: 'Fixed',      icon: '⊞',  colorClass: 'bg-blue-600',    color: '#2563eb', isContainer: true  },
  frame:       { label: 'Frame',      icon: '▭',  colorClass: 'bg-indigo-600',  color: '#4f46e5', isContainer: true  },
  window:      { label: 'Window',     icon: '⬛', colorClass: 'bg-sky-700',     color: '#0369a1', isContainer: true  },
  side:        { label: 'Side',       icon: '⊟',  colorClass: 'bg-blue-800',    color: '#1e40af', isContainer: true  },
  viewport:    { label: 'Viewport',   icon: '⤢',  colorClass: 'bg-cyan-700',    color: '#0e7490', isContainer: true  },
  vpgrid:      { label: 'VPGrid',     icon: '⊞',  colorClass: 'bg-cyan-800',    color: '#155e75', isContainer: true  },
  grid:        { label: 'Grid',       icon: '▦',  colorClass: 'bg-sky-800',     color: '#075985', isContainer: true  },
  // Transform & drag
  transform:   { label: 'Transform',  icon: '⟳',  colorClass: 'bg-violet-700',  color: '#6d28d9', isContainer: true  },
  drag:        { label: 'Drag',       icon: '⣿',  colorClass: 'bg-orange-700',  color: '#c2410c', isContainer: true  },
  draggroup:   { label: 'DragGroup',  icon: '⣿⣿', colorClass: 'bg-orange-800',  color: '#9a3412', isContainer: true  },
  // Imagemap
  imagemap:    { label: 'Imagemap',   icon: '🗺',  colorClass: 'bg-emerald-700', color: '#047857', isContainer: true  },
  hotspot:     { label: 'Hotspot',    icon: '⬡',  colorClass: 'bg-green-600',   color: '#16a34a', isContainer: false },
  hotbar:      { label: 'Hotbar',     icon: '⬡▬', colorClass: 'bg-green-700',   color: '#15803d', isContainer: false },
  // Display
  text:        { label: 'Text',       icon: 'T',  colorClass: 'bg-gray-500',    color: '#6b7280', isContainer: false },
  label:       { label: 'Label',      icon: 'L',  colorClass: 'bg-gray-600',    color: '#4b5563', isContainer: false },
  image:       { label: 'Image',      icon: '⬜', colorClass: 'bg-emerald-700', color: '#047857', isContainer: false },
  // Interactive
  textbutton:  { label: 'TextButton', icon: 'TB', colorClass: 'bg-orange-500',  color: '#f97316', isContainer: false },
  button:      { label: 'Button',     icon: 'Bt', colorClass: 'bg-orange-700',  color: '#c2410c', isContainer: true  },
  imagebutton: { label: 'ImgButton',  icon: 'IB', colorClass: 'bg-amber-600',   color: '#d97706', isContainer: false },
  bar:         { label: 'Bar',        icon: '▬',  colorClass: 'bg-purple-600',  color: '#7c3aed', isContainer: false },
  vbar:        { label: 'VBar',       icon: '▮',  colorClass: 'bg-purple-700',  color: '#6d28d9', isContainer: false },
  input:       { label: 'Input',      icon: '✎',  colorClass: 'bg-teal-600',    color: '#0d9488', isContainer: false },
  'null':      { label: 'Null',       icon: '∅',  colorClass: 'bg-gray-600',    color: '#4b5563', isContainer: false },
  // Screen ops
  use:         { label: 'use',        icon: '⤴',  colorClass: 'bg-violet-700',  color: '#6d28d9', isContainer: true  },
  transclude:  { label: 'transclude', icon: '↳',  colorClass: 'bg-indigo-800',  color: '#3730a3', isContainer: false },
  key:         { label: 'key',        icon: '⌨',  colorClass: 'bg-slate-600',   color: '#475569', isContainer: false },
  timer:       { label: 'timer',      icon: '⏱',  colorClass: 'bg-slate-700',   color: '#334155', isContainer: false },
  // Utility
  mousearea:   { label: 'mousearea',  icon: '⬚',  colorClass: 'bg-slate-500',   color: '#64748b', isContainer: false },
  nearrect:    { label: 'nearrect',   icon: '⊡',  colorClass: 'bg-slate-600',   color: '#475569', isContainer: true  },
  dismiss:     { label: 'dismiss',    icon: '✕',  colorClass: 'bg-red-700',     color: '#b91c1c', isContainer: false },
  on:          { label: 'on',         icon: '⚡',  colorClass: 'bg-yellow-600',  color: '#ca8a04', isContainer: false },
  'default':   { label: 'default',    icon: '≔',  colorClass: 'bg-slate-500',   color: '#64748b', isContainer: false },
  // Fallback: raw blocks (includes control flow)
  raw:         { label: 'code',       icon: '{}', colorClass: 'bg-zinc-600',    color: '#52525b', isContainer: false },
} as Record<ScreenWidgetType, ElemDef>;

export const HINT_KW_MAP: Partial<Record<string, ScreenWidgetType>> = {
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

export function extractRawHints(code: string): ScreenWidgetType[] {
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

export function rawBlockStyle(code: string): { icon: string; color: string; colorClass: string } {
  const firstKw = (code.split('\n')[0] ?? '').trim().split(/\s+/)[0]?.replace(/:$/, '').toLowerCase() ?? '';
  if (firstKw === 'if' || firstKw === 'elif' || firstKw === 'else') return { icon: '?',  color: '#fbbf24', colorClass: 'bg-amber-700' };
  if (firstKw === 'showif') return { icon: '👁', color: '#fbbf24', colorClass: 'bg-amber-600' };
  if (firstKw === 'for')    return { icon: '↺', color: '#fde68a', colorClass: 'bg-yellow-700' };
  if (firstKw === '$' || firstKw === 'python') return { icon: '$', color: '#fda4af', colorClass: 'bg-rose-800' };
  return { icon: '{}', color: '#a1a1aa', colorClass: 'bg-zinc-600' };
}
