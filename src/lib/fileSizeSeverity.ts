/**
 * @file fileSizeSeverity.ts
 * @description Pure logic for the file-size warning indicator system: maps a
 * line count against user-configurable thresholds to one of four severity
 * zones, shared by the graph node badge, editor tab dot, and status bar.
 */
import type { FileSizeThresholds } from '@/types';

export type FileSizeSeverity = 'green' | 'yellow' | 'orange' | 'red';

export const DEFAULT_FILE_SIZE_THRESHOLDS: FileSizeThresholds = {
  healthy: 500,
  warning: 1000,
  critical: 1500,
};

export function getLineCount(content: string): number {
  return content.split('\n').length;
}

export function getFileSizeSeverity(lineCount: number, thresholds: FileSizeThresholds): FileSizeSeverity {
  if (lineCount <= thresholds.healthy) return 'green';
  if (lineCount <= thresholds.warning) return 'yellow';
  if (lineCount <= thresholds.critical) return 'orange';
  return 'red';
}

type FileSizeSeverityLabel = 'Ideal' | 'Healthy' | 'Warning' | 'Critical';

const SEVERITY_LABELS: Record<FileSizeSeverity, FileSizeSeverityLabel> = {
  green: 'Ideal',
  yellow: 'Healthy',
  orange: 'Warning',
  red: 'Critical',
};

export function getFileSizeSeverityLabel(severity: FileSizeSeverity): FileSizeSeverityLabel {
  return SEVERITY_LABELS[severity];
}

const SEVERITY_DOT_CLASSES: Record<FileSizeSeverity, string> = {
  green: 'bg-green-400 dark:bg-green-500',
  yellow: 'bg-yellow-400 dark:bg-yellow-500',
  orange: 'bg-orange-400 dark:bg-orange-500',
  red: 'bg-red-400 dark:bg-red-500',
};

export function getFileSizeSeverityDotClass(severity: FileSizeSeverity): string {
  return SEVERITY_DOT_CLASSES[severity];
}

const SEVERITY_TEXT_CLASSES: Record<FileSizeSeverity, string> = {
  green: 'text-green-500 dark:text-green-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  orange: 'text-orange-600 dark:text-orange-400',
  red: 'text-red-600 dark:text-red-400',
};

export function getFileSizeSeverityTextClass(severity: FileSizeSeverity): string {
  return SEVERITY_TEXT_CLASSES[severity];
}

/**
 * The threshold value crossed to reach this severity, shown in the
 * "N / limit lines" tooltip — e.g. Warning (orange) shows the healthy/warning
 * boundary (1000) it exceeded, not its own ceiling (1500), so the number
 * reads as "how far past the last safe limit."
 */
export function getFileSizeSeverityLimit(severity: FileSizeSeverity, thresholds: FileSizeThresholds): number {
  switch (severity) {
    case 'green':
    case 'yellow':
      return thresholds.healthy;
    case 'orange':
      return thresholds.warning;
    case 'red':
      return thresholds.critical;
  }
}
