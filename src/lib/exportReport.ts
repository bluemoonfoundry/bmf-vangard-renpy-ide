/**
 * @file exportReport.ts
 * @description Markdown/CSV serializers for the Diagnostics and Stats panels' "Export" menu.
 * Pure functions only — panels supply already-filtered data and write the result via
 * clipboard (CopyButton) or the fs/dialog IPC namespace.
 */
import type { Block, DiagnosticIssue, DiagnosticsTask } from '@/types';

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function toCsvBlock(header: string[], rows: string[][]): string {
  return [header, ...rows].map(r => r.map(csvEscape).join(',')).join('\n');
}

function fileNameFor(blocks: Block[], blockId?: string): string {
  const block = blocks.find(b => b.id === blockId);
  return block?.filePath ? block.filePath.split(/[\\/]/).pop()! : (blockId ?? '—');
}

// ── Diagnostics: Issues ─────────────────────────────────────────────────────

export function diagnosticIssuesToMarkdown(issues: DiagnosticIssue[], blocks: Block[]): string {
  const lines = [
    '# Diagnostics Report',
    '',
    `Generated ${new Date().toLocaleString()}`,
    `${issues.length} issue${issues.length !== 1 ? 's' : ''}`,
    '',
  ];
  if (issues.length === 0) {
    lines.push('No issues found.');
    return lines.join('\n');
  }
  lines.push('| Severity | Category | Message | Location |', '|---|---|---|---|');
  for (const issue of issues) {
    const fileName = fileNameFor(blocks, issue.blockId);
    const location = issue.line ? `${fileName}:${issue.line}` : fileName;
    lines.push(`| ${issue.severity} | ${issue.category} | ${issue.message.replace(/\|/g, '\\|')} | ${location} |`);
  }
  return lines.join('\n');
}

export function diagnosticIssuesToCSV(issues: DiagnosticIssue[], blocks: Block[]): string {
  const rows = issues.map(issue => {
    const fileName = fileNameFor(blocks, issue.blockId);
    return [issue.severity, issue.category, issue.message, fileName, issue.line ? String(issue.line) : ''];
  });
  return toCsvBlock(['Severity', 'Category', 'Message', 'File', 'Line'], rows);
}

// ── Diagnostics: Tasks ───────────────────────────────────────────────────────

export function diagnosticsTasksToMarkdown(tasks: DiagnosticsTask[], blocks: Block[]): string {
  const lines = [
    '# Diagnostics Tasks',
    '',
    `Generated ${new Date().toLocaleString()}`,
    `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`,
    '',
  ];
  if (tasks.length === 0) {
    lines.push('No tasks.');
    return lines.join('\n');
  }
  for (const task of tasks) {
    const box = task.status === 'completed' ? '[x]' : '[ ]';
    const location = task.blockId
      ? ` (${fileNameFor(blocks, task.blockId)}${task.line ? `:${task.line}` : ''})`
      : '';
    lines.push(`- ${box} ${task.title}${location}`);
    if (task.description) lines.push(`  ${task.description}`);
  }
  return lines.join('\n');
}

export function diagnosticsTasksToCSV(tasks: DiagnosticsTask[], blocks: Block[]): string {
  const rows = tasks.map(task => [
    task.status,
    task.title,
    task.description ?? '',
    task.blockId ? fileNameFor(blocks, task.blockId) : '',
    task.line ? String(task.line) : '',
  ]);
  return toCsvBlock(['Status', 'Title', 'Description', 'File', 'Line'], rows);
}

// ── Stats ────────────────────────────────────────────────────────────────────

export interface StatsCharacterWordCount {
  name: string;
  words: number;
}

export interface StatsAssetIssue {
  name: string;
  type: 'image' | 'audio';
  status: 'missing' | 'orphaned';
}

export interface StatsReportData {
  totalWords: number | null;
  estimatedMinutes: number | null;
  dialogueWords: number | null;
  narrationWords: number | null;
  scriptFiles: number;
  totalCharacters: number;
  speakingCharacters: number | null;
  labelCount: number;
  branchingFiles: number;
  identifiedRoutes: number;
  routesTruncated: boolean;
  unreachableLabels: number;
  complexity: string;
  distinctEndings: number | null;
  shortestPath: number | null;
  longestPath: number | null;
  imageAssets: number;
  imageReferenced: number | null;
  audioAssets: number;
  audioReferenced: number | null;
  scriptErrors: number;
  characterWordCounts: StatsCharacterWordCount[] | null;
  assetIssues: StatsAssetIssue[];
}

function fmtNum(n: number | null): string {
  return n === null ? '—' : n.toLocaleString();
}

export function statsToMarkdown(data: StatsReportData): string {
  const lines: string[] = ['# Script Statistics Report', '', `Generated ${new Date().toLocaleString()}`, ''];

  lines.push('## Writing', '');
  lines.push(`- Total Words: ${fmtNum(data.totalWords)}`);
  lines.push(`- Estimated Playtime: ${data.estimatedMinutes === null ? '—' : `${data.estimatedMinutes} min`}`);
  lines.push(`- Dialogue Words: ${fmtNum(data.dialogueWords)}`);
  lines.push(`- Narration Words: ${fmtNum(data.narrationWords)}`);
  lines.push('');

  lines.push('## Structure', '');
  lines.push(`- Script Files: ${data.scriptFiles.toLocaleString()}`);
  lines.push(`- Characters: ${data.totalCharacters.toLocaleString()}${data.speakingCharacters !== null ? ` (${data.speakingCharacters} speaking)` : ''}`);
  lines.push(`- Labels: ${data.labelCount.toLocaleString()}`);
  lines.push(`- Menus / Branches: ${data.branchingFiles.toLocaleString()}`);
  lines.push(`- Identified Routes: ${data.identifiedRoutes.toLocaleString()}${data.routesTruncated ? '+' : ''}`);
  lines.push(`- Unreachable Labels: ${data.unreachableLabels.toLocaleString()}`);
  lines.push(`- Complexity: ${data.complexity}`);
  lines.push('');

  lines.push('## Endings & Completeness', '');
  lines.push(`- Distinct Endings: ${fmtNum(data.distinctEndings)}`);
  lines.push(`- Shortest Path: ${data.shortestPath === null ? '—' : `${data.shortestPath} steps`}`);
  lines.push(`- Longest Path: ${data.longestPath === null ? '—' : `${data.longestPath} steps`}`);
  lines.push('');

  lines.push('## Assets & Health', '');
  lines.push(`- Image Assets: ${data.imageAssets.toLocaleString()}${data.imageReferenced !== null ? ` (${data.imageReferenced} referenced)` : ''}`);
  lines.push(`- Audio Assets: ${data.audioAssets.toLocaleString()}${data.audioReferenced !== null ? ` (${data.audioReferenced} referenced)` : ''}`);
  lines.push(`- Script Errors: ${data.scriptErrors.toLocaleString()}`);
  lines.push('');

  if (data.characterWordCounts && data.characterWordCounts.length > 0) {
    lines.push('## Word Count by Character', '');
    lines.push('| Character | Words |', '|---|---|');
    data.characterWordCounts.forEach(c => lines.push(`| ${c.name} | ${c.words.toLocaleString()} |`));
    lines.push('');
  }

  if (data.assetIssues.length > 0) {
    lines.push('## Asset Coverage Issues', '');
    lines.push('| Asset | Type | Status |', '|---|---|---|');
    data.assetIssues.forEach(r =>
      lines.push(`| ${r.name} | ${r.type} | ${r.status === 'missing' ? 'Missing from disk' : 'Unreferenced'} |`)
    );
    lines.push('');
  }

  return lines.join('\n');
}

export function statsToCSV(data: StatsReportData): string {
  const metricRows: string[][] = [
    ['Total Words', fmtNum(data.totalWords)],
    ['Estimated Playtime (min)', data.estimatedMinutes === null ? '' : String(data.estimatedMinutes)],
    ['Dialogue Words', fmtNum(data.dialogueWords)],
    ['Narration Words', fmtNum(data.narrationWords)],
    ['Script Files', String(data.scriptFiles)],
    ['Characters', String(data.totalCharacters)],
    ['Speaking Characters', data.speakingCharacters === null ? '' : String(data.speakingCharacters)],
    ['Labels', String(data.labelCount)],
    ['Menus / Branches', String(data.branchingFiles)],
    ['Identified Routes', `${data.identifiedRoutes}${data.routesTruncated ? '+' : ''}`],
    ['Unreachable Labels', String(data.unreachableLabels)],
    ['Complexity', data.complexity],
    ['Distinct Endings', fmtNum(data.distinctEndings)],
    ['Shortest Path (steps)', data.shortestPath === null ? '' : String(data.shortestPath)],
    ['Longest Path (steps)', data.longestPath === null ? '' : String(data.longestPath)],
    ['Image Assets', String(data.imageAssets)],
    ['Images Referenced', data.imageReferenced === null ? '' : String(data.imageReferenced)],
    ['Audio Assets', String(data.audioAssets)],
    ['Audio Referenced', data.audioReferenced === null ? '' : String(data.audioReferenced)],
    ['Script Errors', String(data.scriptErrors)],
  ];

  const blocks: string[] = [toCsvBlock(['Metric', 'Value'], metricRows)];

  if (data.characterWordCounts && data.characterWordCounts.length > 0) {
    blocks.push(toCsvBlock(['Character', 'Words'], data.characterWordCounts.map(c => [c.name, String(c.words)])));
  }

  if (data.assetIssues.length > 0) {
    blocks.push(toCsvBlock(['Asset', 'Type', 'Status'], data.assetIssues.map(r => [r.name, r.type, r.status])));
  }

  return blocks.join('\n\n');
}
