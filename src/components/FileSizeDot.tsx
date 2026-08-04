/**
 * @file FileSizeDot.tsx
 * @description Small colored indicator of a block's line-count severity
 * (yellow/orange/red). Renders nothing at green/Ideal, so small, healthy
 * files stay visually quiet on the graph and in the tab bar.
 *
 * Two variants share the same severity coloring:
 * - 'dot' (default): a filled circle, used on the graph node badge where
 *   there's no risk of confusion with anything else.
 * - 'triangle': a warning-triangle glyph, used in the editor tab bar where
 *   a plain dot would be visually indistinguishable from the unsaved-changes
 *   dot also rendered there.
 */
import React from 'react';
import type { FileSizeThresholds } from '@/types';
import { getFileSizeSeverity, getFileSizeSeverityDotClass, getFileSizeSeverityTextClass } from '@/lib/fileSizeSeverity';

interface FileSizeDotProps {
  lineCount: number;
  thresholds: FileSizeThresholds;
  title?: string;
  className?: string;
  variant?: 'dot' | 'triangle';
}

const FileSizeDot: React.FC<FileSizeDotProps> = ({ lineCount, thresholds, title, className, variant = 'dot' }) => {
  const severity = getFileSizeSeverity(lineCount, thresholds);
  if (severity === 'green') return null;

  if (variant === 'triangle') {
    return (
      <svg
        className={`w-3 h-3 flex-shrink-0 ${getFileSizeSeverityTextClass(severity)} ${className ?? ''}`}
        viewBox="0 0 20 20"
        fill="currentColor"
        data-testid="file-size-dot"
        data-severity={severity}
      >
        {title && <title>{title}</title>}
        <path d="M10 2.5 18.5 17H1.5L10 2.5z" />
        <rect x="9.1" y="8" width="1.8" height="4.5" fill="#1f2937" />
        <rect x="9.1" y="13.2" width="1.8" height="1.8" fill="#1f2937" />
      </svg>
    );
  }

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
