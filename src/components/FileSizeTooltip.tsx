/**
 * @file FileSizeTooltip.tsx
 * @description Portal-rendered hover tooltip showing file-size severity
 * detail (line count vs. threshold, status, label/jump counts) for a graph
 * node's size badge.
 */
import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { FileSizeThresholds } from '@/types';
import { getFileSizeSeverity, getFileSizeSeverityLabel, getFileSizeSeverityLimit } from '@/lib/fileSizeSeverity';

interface FileSizeTooltipProps {
  fileName: string;
  lineCount: number;
  thresholds: FileSizeThresholds;
  labelCount: number;
  jumpCount: number;
  children: React.ReactNode;
}

const FileSizeTooltip: React.FC<FileSizeTooltipProps> = ({
  fileName, lineCount, thresholds, labelCount, jumpCount, children,
}) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const anchorRef = useRef<HTMLDivElement>(null);

  const severity = getFileSizeSeverity(lineCount, thresholds);
  const label = getFileSizeSeverityLabel(severity);
  const limit = getFileSizeSeverityLimit(severity, thresholds);

  const handleEnter = () => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: Math.min(rect.left, window.innerWidth - 224) });
    }
    setOpen(true);
  };

  return (
    <div ref={anchorRef} onMouseEnter={handleEnter} onMouseLeave={() => setOpen(false)}>
      {children}
      {open && createPortal(
        <div
          role="tooltip"
          style={{ top: pos.top, left: pos.left }}
          className="fixed z-[9999] w-56 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-2xl px-3 py-2 text-xs text-gray-700 dark:text-gray-300 pointer-events-none"
        >
          <div className="font-semibold text-gray-800 dark:text-gray-100 truncate mb-1">{fileName}</div>
          <div>{lineCount.toLocaleString()} / {limit.toLocaleString()} lines [{label}]</div>
          <div className="mt-1 text-gray-500 dark:text-gray-400">
            {labelCount} label{labelCount !== 1 ? 's' : ''}, {jumpCount} jump{jumpCount !== 1 ? 's' : ''}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default FileSizeTooltip;
