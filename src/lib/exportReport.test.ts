import { describe, it, expect } from 'vitest';
import {
  diagnosticIssuesToMarkdown,
  diagnosticIssuesToCSV,
  diagnosticsTasksToMarkdown,
  diagnosticsTasksToCSV,
  statsToMarkdown,
  statsToCSV,
  type StatsReportData,
} from '@/lib/exportReport';
import { createBlock } from '@/test/mocks/sampleData';
import type { DiagnosticIssue, DiagnosticsTask } from '@/types';

describe('exportReport', () => {
  const blocks = [createBlock({ id: 'block-1', filePath: 'game/script.rpy' })];

  const issues: DiagnosticIssue[] = [
    { id: 'i1', severity: 'error', category: 'syntax', message: 'Bad syntax', blockId: 'block-1', line: 5 },
    { id: 'i2', severity: 'warning', category: 'unused-character', message: 'Unused | char', blockId: 'unknown-block' },
  ];

  describe('diagnosticIssuesToMarkdown', () => {
    it('renders a table row per issue with resolved file names', () => {
      const md = diagnosticIssuesToMarkdown(issues, blocks);
      expect(md).toContain('# Diagnostics Report');
      expect(md).toContain('2 issues');
      expect(md).toContain('| error | syntax | Bad syntax | script.rpy:5 |');
      // Pipe characters in messages are escaped so they don't break the table.
      expect(md).toContain('Unused \\| char');
      // Unknown blockId falls back to the id itself.
      expect(md).toContain('unknown-block |');
    });

    it('reports no issues found when the list is empty', () => {
      const md = diagnosticIssuesToMarkdown([], blocks);
      expect(md).toContain('No issues found.');
    });
  });

  describe('diagnosticIssuesToCSV', () => {
    it('emits a header row plus one row per issue', () => {
      const csv = diagnosticIssuesToCSV(issues, blocks);
      const rows = csv.split('\n');
      expect(rows[0]).toBe('Severity,Category,Message,File,Line');
      expect(rows[1]).toBe('error,syntax,Bad syntax,script.rpy,5');
    });

    it('quotes fields containing commas or quotes', () => {
      const csv = diagnosticIssuesToCSV(
        [{ id: 'i3', severity: 'info', category: 'syntax', message: 'Say "hi", please', blockId: 'block-1' }],
        blocks
      );
      expect(csv).toContain('"Say ""hi"", please"');
    });
  });

  describe('diagnosticsTasksToMarkdown / CSV', () => {
    const tasks: DiagnosticsTask[] = [
      { id: 't1', title: 'Fix typo', status: 'open', blockId: 'block-1', line: 3, createdAt: 0 },
      { id: 't2', title: 'Polish ending', description: 'Needs VO', status: 'completed', createdAt: 0 },
    ];

    it('renders a checkbox list with location suffix', () => {
      const md = diagnosticsTasksToMarkdown(tasks, blocks);
      expect(md).toContain('- [ ] Fix typo (script.rpy:3)');
      expect(md).toContain('- [x] Polish ending');
      expect(md).toContain('Needs VO');
    });

    it('renders a CSV row per task', () => {
      const csv = diagnosticsTasksToCSV(tasks, blocks);
      const rows = csv.split('\n');
      expect(rows[0]).toBe('Status,Title,Description,File,Line');
      expect(rows[1]).toBe('open,Fix typo,,script.rpy,3');
      expect(rows[2]).toBe('completed,Polish ending,Needs VO,,');
    });
  });

  describe('stats reports', () => {
    const data: StatsReportData = {
      totalWords: 1200,
      estimatedMinutes: 6,
      dialogueWords: 900,
      narrationWords: 300,
      scriptFiles: 4,
      totalCharacters: 3,
      speakingCharacters: 2,
      labelCount: 10,
      branchingFiles: 2,
      identifiedRoutes: 5,
      routesTruncated: false,
      unreachableLabels: 1,
      complexity: 'Branching',
      distinctEndings: 3,
      shortestPath: 4,
      longestPath: 12,
      imageAssets: 8,
      imageReferenced: 6,
      audioAssets: 2,
      audioReferenced: 2,
      scriptErrors: 0,
      characterWordCounts: [{ name: 'Alice', words: 500 }, { name: 'Bob', words: 400 }],
      assetIssues: [{ name: 'bg_forest', type: 'image', status: 'missing' }],
    };

    it('renders markdown sections including character and asset tables', () => {
      const md = statsToMarkdown(data);
      expect(md).toContain('## Writing');
      expect(md).toContain('- Total Words: 1,200');
      expect(md).toContain('| Alice | 500 |');
      expect(md).toContain('| bg_forest | image | Missing from disk |');
    });

    it('falls back to em-dash for null metrics', () => {
      const md = statsToMarkdown({ ...data, totalWords: null, shortestPath: null });
      expect(md).toContain('- Total Words: —');
      expect(md).toContain('- Shortest Path: —');
    });

    it('renders CSV as separate metric/character/asset blocks', () => {
      const csv = statsToCSV(data);
      expect(csv).toContain('Metric,Value');
      // Values containing commas (from toLocaleString) are quoted per CSV rules.
      expect(csv).toContain('Total Words,"1,200"');
      expect(csv).toContain('Character,Words\nAlice,500\nBob,400');
      expect(csv).toContain('Asset,Type,Status\nbg_forest,image,missing');
    });

    it('omits character/asset blocks when empty', () => {
      const csv = statsToCSV({ ...data, characterWordCounts: [], assetIssues: [] });
      expect(csv).not.toContain('Character,Words');
      expect(csv).not.toContain('Asset,Type,Status');
    });
  });
});
