import crypto from 'crypto';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { test as base, _electron as electron, expect } from 'playwright/test';
import type { ElectronApplication, Page } from 'playwright/test';
import { APP_ENTRY, forceExit, launchElectron, suppressFirstRunTutorial } from '../electron-launch.js';
import { FIXTURE_PROJECT } from '../electron-fixture';

// Coverage for the Save All transaction (bmf-vangard-renpy-ide-b70a.2.2, see
// src/lib/saveTransaction.js) through the real main process: recovery of a
// save interrupted after its commit point runs on project load, before any
// file is read, and project:saveFiles writes a batch atomically inside the
// open project only. Uses a throwaway copy of the fixture project whose path
// contains a space and non-ASCII characters.

type Fixtures = { projectRoot: string; electronApp: ElectronApplication; window: Page };

const NEW_SCRIPT = 'label start:\n    "Recovered from an interrupted save."\n    return\n';

/* eslint-disable react-hooks/rules-of-hooks, no-empty-pattern */
const test = base.extend<Fixtures>({
  projectRoot: async ({}, use) => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'vangard e2e ゲーム-'));
    await fs.cp(FIXTURE_PROJECT, root, { recursive: true });

    // Plant a save that died after its commit point: a committed journal plus
    // a staged temp file that was never renamed over game/script.rpy.
    const txid = crypto.randomUUID();
    const temp = `game/.script.rpy.txn-${txid}`;
    await fs.writeFile(path.join(root, temp), NEW_SCRIPT, 'utf-8');
    await fs.mkdir(path.join(root, '.renide'), { recursive: true });
    await fs.writeFile(path.join(root, '.renide', 'save-journal.json'), JSON.stringify({
      version: 1,
      txid,
      state: 'committed',
      createdAt: new Date().toISOString(),
      entries: [{
        target: 'game/script.rpy',
        temp,
        sha256: crypto.createHash('sha256').update(Buffer.from(NEW_SCRIPT, 'utf-8')).digest('hex'),
      }],
    }));

    await use(root);
    await fs.rm(root, { recursive: true, force: true });
  },
  electronApp: async ({ projectRoot }, use) => {
    const app = await launchElectron(electron, {
      args: [APP_ENTRY, '--project', projectRoot],
      env: { RENIDE_SETTINGS_OVERRIDE: JSON.stringify({ isLeftSidebarOpen: true, isRightSidebarOpen: true }) },
    });
    await suppressFirstRunTutorial(app);
    await use(app);
    await forceExit(app);
  },
  window: async ({ electronApp }, use) => {
    const page = await electronApp.firstWindow();
    await page.waitForLoadState('domcontentloaded');
    await use(page);
  },
});
/* eslint-enable react-hooks/rules-of-hooks, no-empty-pattern */

test.describe('save transaction recovery', () => {
  test('an interrupted, committed save is completed on load before the project is read', async ({ window, projectRoot }) => {
    await expect(window.getByText(/interrupted save from last session was completed/)).toBeVisible({ timeout: 30_000 });

    expect(await fs.readFile(path.join(projectRoot, 'game', 'script.rpy'), 'utf-8')).toBe(NEW_SCRIPT);
    await expect(fs.access(path.join(projectRoot, '.renide', 'save-journal.json'))).rejects.toThrow();
    const leftovers = (await fs.readdir(path.join(projectRoot, 'game'))).filter(f => f.includes('.txn-'));
    expect(leftovers).toEqual([]);

    // The loaded block holds the recovered content, i.e. recovery ran before
    // the files were read rather than after.
    const block = window.locator('[data-block-id]').first();
    await expect(block).toBeVisible({ timeout: 30_000 });
    await block.dblclick();
    const editor = window.locator('.monaco-editor').first();
    await expect(editor).toBeVisible({ timeout: 10_000 });
    await expect(editor).toContainText('Recovered from an interrupted save.');
  });

  test('project:saveFiles writes a batch inside the open project and refuses paths outside it', async ({ window, projectRoot }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    const a = path.join(projectRoot, 'game', 'script.rpy');
    const b = path.join(projectRoot, 'game', '第二章.rpy');
    const ok = await window.evaluate(
      ([pa, pb]) => window.electronAPI!.saveFiles([
        { path: pa, content: 'label start:\n    return\n' },
        { path: pb, content: 'label ch2:\n    return\n' },
      ]),
      [a, b],
    );
    expect(ok.success).toBe(true);
    expect(await fs.readFile(a, 'utf-8')).toBe('label start:\n    return\n');
    expect(await fs.readFile(b, 'utf-8')).toBe('label ch2:\n    return\n');

    const outside = path.join(path.dirname(projectRoot), 'outside-the-project.rpy');
    const denied = await window.evaluate(
      ([pa, po]) => window.electronAPI!.saveFiles([
        { path: pa, content: 'should not be written' },
        { path: po, content: 'nope' },
      ]),
      [a, outside],
    );
    expect(denied.success).toBe(false);
    expect(denied.error).toMatch(/ACCESS_DENIED/);
    // All-or-nothing: the in-project file in the rejected batch is untouched too.
    expect(await fs.readFile(a, 'utf-8')).toBe('label start:\n    return\n');
    await expect(fs.access(outside)).rejects.toThrow();
  });
});
