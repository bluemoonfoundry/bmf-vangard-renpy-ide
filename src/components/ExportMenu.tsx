/**
 * @file ExportMenu.tsx
 * @description Compact "Export" popover offering clipboard copy (via CopyButton) and
 * save-to-file for a Markdown/CSV report (~90 lines).
 * Integration: used by `DiagnosticsPanel` and `StatsView` to export their current data.
 */
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import CopyButton from '@/components/CopyButton';
import { logger } from '@/lib/logger';

interface ExportMenuProps {
  /** Lazily builds the Markdown report text. Only called while the menu is open. */
  getMarkdown: () => string;
  /** Lazily builds the CSV report text. Only called while the menu is open. */
  getCSV: () => string;
  /** Base file name (no extension) suggested in the save dialog. */
  filenameBase: string;
  label?: string;
  disabled?: boolean;
}

const ExportMenu: React.FC<ExportMenuProps> = ({ getMarkdown, getCSV, filenameBase, label = 'Export', disabled }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [saving, setSaving] = useState<'md' | 'csv' | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleMouseDown = () => setOpen(false);
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [open]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const width = 224;
      setPos({ top: rect.bottom + 4, left: Math.min(rect.left, window.innerWidth - width - 8) });
    }
    setOpen(v => !v);
  };

  async function saveAs(format: 'md' | 'csv') {
    setSaving(format);
    try {
      const filePath = await window.electronAPI.showSaveDialog({
        title: `Export ${label}`,
        defaultPath: `${filenameBase}.${format}`,
        filters: format === 'md'
          ? [{ name: 'Markdown', extensions: ['md'] }]
          : [{ name: 'CSV', extensions: ['csv'] }],
      });
      if (!filePath) return;
      const content = format === 'md' ? getMarkdown() : getCSV();
      const res = await window.electronAPI.writeFile(filePath, content, 'utf8');
      if (!res.success) logger.error('Failed to export report:', res.error);
    } catch (err) {
      logger.error('Failed to export report:', err);
    } finally {
      setSaving(null);
      setOpen(false);
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed flex-none"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M7 10l5 5 5-5M12 15V3" />
        </svg>
        {label}
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && createPortal(
        <div
          style={{ top: pos.top, left: pos.left, width: 224 }}
          className="fixed z-[9999] rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-2xl py-1"
          onMouseDown={e => e.stopPropagation()}
        >
          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            Copy to Clipboard
          </div>
          <div className="px-3 pb-2 flex gap-2">
            <CopyButton text={getMarkdown()} label="Markdown" size="xs" />
            <CopyButton text={getCSV()} label="CSV" size="xs" />
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            Save to File
          </div>
          <button
            type="button"
            onClick={() => saveAs('md')}
            disabled={saving !== null}
            className="w-full flex items-center px-3 py-1.5 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:opacity-50"
          >
            {saving === 'md' ? 'Saving…' : 'Markdown (.md)…'}
          </button>
          <button
            type="button"
            onClick={() => saveAs('csv')}
            disabled={saving !== null}
            className="w-full flex items-center px-3 py-1.5 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:opacity-50"
          >
            {saving === 'csv' ? 'Saving…' : 'CSV (.csv)…'}
          </button>
        </div>,
        document.body
      )}
    </>
  );
};

export default ExportMenu;
