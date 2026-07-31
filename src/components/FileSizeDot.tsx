/**
 * @file FileSizeDot.tsx
 * @description Small colored dot indicating a block's line-count severity
 * (yellow/orange/red). Renders nothing at green/Ideal, so small, healthy
 * files stay visually quiet on the graph and in the tab bar.
 */
import React from 'react';
import type { FileSizeThresholds } from '@/types';
import { getFileSizeSeverity, getFileSizeSeverityDotClass } from '@/lib/fileSizeSeverity';

interface FileSizeDotProps {
  lineCount: number;
  thresholds: FileSizeThresholds;
  title?: string;
  className?: string;
}

const FileSizeDot: React.FC<FileSizeDotProps> = ({ lineCount, thresholds, title, className }) => {
  const severity = getFileSizeSeverity(lineCount, thresholds);
  if (severity === 'green') return null;
  return (
    <div
      className={`w-2 h-2 rounded-full flex-shrink-0 ${getFileSizeSeverityDotClass(severity)} ${className ?? ''}`}
      title={title}
      data-testid="file-size-dot"
      data-severity={severity}
    />
  );
};

export default React.memo(FileSizeDot);
