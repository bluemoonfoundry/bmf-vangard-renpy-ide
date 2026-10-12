// Runs the real project-load worker embedded in electron.js against a temp
// project on disk, to pin down how an unreadable game/project.ide.json is
// handled: it must be reported, backed up, and never touch the .rpy sources.
import { mkdtemp, mkdir, readdir, readFile, rm, writeFile } from 'fs/promises';
import os from 'os';
import path from 'path';
import { Worker } from 'worker_threads';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { ProjectLoadResult } from '@/types';

async function loadWorkerCode(): Promise<string> {
  const source = await readFile(path.resolve(__dirname, '../../electron.js'), 'utf-8');
  const match = source.match(/const PROJECT_LOAD_WORKER_CODE = String\.raw`([\s\S]*?)`;/);
  if (!match) throw new Error('PROJECT_LOAD_WORKER_CODE not found in electron.js');
  return match[1];
}

function runWorker(code: string, rootPath: string): Promise<ProjectLoadResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(code, { eval: true, workerData: { rootPath, readContent: true } });
    worker.on('message', (msg: { type: string; ok?: boolean; data?: ProjectLoadResult; error?: string }) => {
      if (msg.type !== 'result') return;
      void worker.terminate();
      if (msg.ok) resolve(msg.data!);
      else reject(new Error(msg.error));
    });
    worker.on('error', reject);
  });
}

const SCRIPT = 'label start:\n    e "こんにちは"\n    return\n';

describe('project load worker — project.ide.json handling', () => {
  let root: string;
  let code: string;

  beforeEach(async () => {
    code = await loadWorkerCode();
    // Non-ASCII + space in the project name, matching real Windows user paths.
    root = await mkdtemp(path.join(os.tmpdir(), 'vangard ゲーム-'));
    await mkdir(path.join(root, 'game'));
    await writeFile(path.join(root, 'game', 'script.rpy'), SCRIPT, 'utf-8');
  });

  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it('loads valid settings without warnings or backups', async () => {
    await writeFile(path.join(root, 'game', 'project.ide.json'), JSON.stringify({ schemaVersion: 1, draftingMode: true }));
    const result = await runWorker(code, root);
    expect(result.settings).toEqual({ schemaVersion: 1, draftingMode: true });
    expect(result.settingsWarning).toBeUndefined();
    expect((await readdir(path.join(root, 'game'))).filter(f => f.includes('.corrupt-'))).toEqual([]);
  });

  it('stays silent when project.ide.json does not exist', async () => {
    const result = await runWorker(code, root);
    expect(result.settings).toEqual({});
    expect(result.settingsWarning).toBeUndefined();
  });

  it.each([
    ['truncated JSON', '{\n  "draftingMode": false,\n  "activeTabId": "can'],
    ['a JSON array', '[1, 2, 3]'],
    ['JSON null', 'null'],
  ])('backs up %s, reports it as corrupted, and leaves sources untouched', async (_label, contents) => {
    const settingsPath = path.join(root, 'game', 'project.ide.json');
    await writeFile(settingsPath, contents, 'utf-8');

    const result = await runWorker(code, root);

    expect(result.settings).toEqual({});
    expect(result.settingsWarning?.code).toBe('corrupted');
    const backupPath = result.settingsWarning?.backupPath;
    expect(backupPath).toBeDefined();
    expect(path.dirname(backupPath!)).toBe(path.join(root, 'game'));
    expect(await readFile(backupPath!, 'utf-8')).toBe(contents);
    // The original is left in place (the next save replaces it) ...
    expect(await readFile(settingsPath, 'utf-8')).toBe(contents);
    // ... and the .rpy source is read normally and never written.
    expect(result.files).toEqual([{ path: 'game/script.rpy', content: SCRIPT }]);
    expect(await readFile(path.join(root, 'game', 'script.rpy'), 'utf-8')).toBe(SCRIPT);
  });
});
