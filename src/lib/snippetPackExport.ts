/**
 * @file snippetPackExport.ts
 * @description Writes a set of snippet categories out as a shareable pack file.
 * Uses the `snippets:exportPack` IPC (native save dialog + write) in Electron;
 * falls back to a browser `<a download>` blob when electronAPI isn't present,
 * matching the pattern used by SceneComposer's PNG export.
 */
import type { SnippetCategory, SnippetPackFile } from '@/types';

export interface ExportSnippetPackResult {
  success: boolean;
  canceled?: boolean;
  filePath?: string;
  error?: string;
}

export async function exportSnippetPack(categories: SnippetCategory[], suggestedFileName: string): Promise<ExportSnippetPackResult> {
  const packFile: SnippetPackFile = { version: '1.0', categories };
  const content = JSON.stringify(packFile, null, 2);

  if (window.electronAPI?.exportSnippetPack) {
    return window.electronAPI.exportSnippetPack(suggestedFileName, content);
  }

  try {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = suggestedFileName;
    link.click();
    URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/** Turns an arbitrary label into a safe filename segment, e.g. for a suggested export filename. */
export function sanitizeFileNameSegment(name: string): string {
  return name.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'snippets';
}
