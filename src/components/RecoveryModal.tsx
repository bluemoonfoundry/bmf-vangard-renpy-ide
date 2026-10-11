/**
 * @file RecoveryModal.tsx
 * @description Startup dialog offering to restore unsaved work left by a crash
 * (bmf-vangard-renpy-ide-b70a.2.3). One checkbox per item; files changed or deleted
 * on disk since the snapshot are flagged and unchecked by default. Restore never
 * writes to disk. Esc / backdrop / "Decide later" defer, never discard.
 * Integration: rendered by App.tsx while `pendingRecovery` is set; uses `useModalAccessibility`.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useModalAccessibility } from '@/hooks/useModalAccessibility';
import type { PendingRecovery, RecoveryFileStatus, RecoverySelection } from '@/types';

interface RecoveryModalProps {
  isOpen: boolean;
  pending: PendingRecovery | null;
  onRestore: (selection: RecoverySelection) => void;
  onDiscard: () => void;
  onDecideLater: () => void;
}

const FILE_BADGE: Record<RecoveryFileStatus, { label: string; className: string }> = {
  unchanged: { label: 'unchanged on disk', className: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' },
  changed: { label: 'changed on disk since', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  deleted: { label: 'deleted from disk — restores as an untitled draft', className: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' },
};

function relativeTime(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `${days} days ago`;
}

const RecoveryModal: React.FC<RecoveryModalProps> = ({ isOpen, pending, onRestore, onDiscard, onDecideLater }) => {
  const { modalProps, contentRef } = useModalAccessibility({ isOpen, onClose: onDecideLater, titleId: 'recovery-modal-title' });

  const defaults = useMemo(() => ({
    files: new Set(pending?.files.filter(f => f.status === 'unchanged').map(f => f.relativePath) ?? []),
    untitled: new Set(pending?.untitled.map(u => u.id) ?? []),
    settings: Boolean(pending?.settings) && pending?.settingsStatus !== 'changed',
  }), [pending]);

  const [files, setFiles] = useState(defaults.files);
  const [untitled, setUntitled] = useState(defaults.untitled);
  const [settings, setSettings] = useState(defaults.settings);
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);

  useEffect(() => {
    setFiles(defaults.files);
    setUntitled(defaults.untitled);
    setSettings(defaults.settings);
    setConfirmingDiscard(false);
  }, [defaults]);

  if (!isOpen || !pending) return null;

  const toggle = (set: Set<string>, key: string, update: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key); else next.add(key);
    update(next);
  };

  const nothingSelected = files.size === 0 && untitled.size === 0 && !settings;
  const when = new Date(pending.updatedAt);

  const restore = () => onRestore({
    files: pending.files.map(f => f.relativePath).filter(p => files.has(p)),
    untitled: pending.untitled.map(u => u.id).filter(id => untitled.has(id)),
    settings,
  });

  const rowClass = 'flex items-start gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0';
  const badgeClass = 'ml-2 px-2 py-0.5 rounded text-xs whitespace-nowrap';

  return (
    <div
      data-testid="recovery-backdrop"
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]"
      onClick={onDecideLater}
    >
      <div
        ref={contentRef}
        {...modalProps}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl m-4 flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="recovery-modal-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Recover unsaved work from {relativeTime(pending.updatedAt)}?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Vangard Studio didn&apos;t close normally ({when.toLocaleString()}). Restored items open as unsaved changes —
            nothing is written to disk until you save.
          </p>
        </header>

        <main className="p-4 overflow-y-auto">
          <ul>
            {pending.files.map(f => (
              <li key={f.relativePath} className={rowClass}>
                <label className="flex items-center gap-3 flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={files.has(f.relativePath)}
                    onChange={() => toggle(files, f.relativePath, setFiles)}
                  />
                  <span className="font-mono text-sm text-gray-800 dark:text-gray-200">{f.relativePath}</span>
                </label>
                <span data-badge="file" className={`${badgeClass} ${FILE_BADGE[f.status].className}`}>{FILE_BADGE[f.status].label}</span>
              </li>
            ))}
            {pending.untitled.map(u => (
              <li key={u.id} className={rowClass}>
                <label className="flex items-center gap-3 flex-1 cursor-pointer">
                  <input type="checkbox" checked={untitled.has(u.id)} onChange={() => toggle(untitled, u.id, setUntitled)} />
                  <span className="text-sm text-gray-800 dark:text-gray-200">{u.title}</span>
                </label>
                <span className={`${badgeClass} bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300`}>untitled draft</span>
              </li>
            ))}
            {pending.settings && (
              <li className={rowClass}>
                <label className="flex items-center gap-3 flex-1 cursor-pointer">
                  <input type="checkbox" checked={settings} onChange={() => setSettings(s => !s)} />
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    Workspace changes <span className="text-gray-500 dark:text-gray-400">(notes, notecards, compositions, layout)</span>
                  </span>
                </label>
                {pending.settingsStatus === 'changed' && (
                  <span data-badge="settings" className={`${badgeClass} ${FILE_BADGE.changed.className}`}>changed on disk since</span>
                )}
              </li>
            )}
          </ul>
        </main>

        <footer className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-3">
          {confirmingDiscard ? (
            <>
              <span className="text-sm text-red-700 dark:text-red-400 flex-1">This permanently deletes the recovered work.</span>
              <button
                onClick={() => setConfirmingDiscard(false)}
                className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={onDiscard}
                className="px-4 py-2 text-sm font-bold rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Discard recovered work
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setConfirmingDiscard(true)}
                className="px-4 py-2 text-sm rounded text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                Discard…
              </button>
              <span className="flex-1" />
              <button
                onClick={onDecideLater}
                className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100"
              >
                Decide later
              </button>
              <button
                onClick={restore}
                disabled={nothingSelected}
                className="px-4 py-2 text-sm font-bold rounded bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Restore selected
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
};

export default RecoveryModal;
