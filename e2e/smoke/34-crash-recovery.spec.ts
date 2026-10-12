import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { _electron as electron, expect, test } from 'playwright/test';
import type { ElectronApplication, Page } from 'playwright/test';
import { APP_ENTRY, forceExit, launchElectron, suppressFirstRunTutorial } from '../electron-launch.js';
import { FIXTURE_PROJECT } from '../electron-fixture';

// Acceptance for bmf-vangard-renpy-ide-b70a.2.3: after a simulated crash (hard
// exit that skips the clean-quit cleanup), the next open offers recovery, which
// can be restored as unsaved changes or discarded intentionally. Snapshots go to
// a throwaway RENIDE_RECOVERY_DIR so the developer's userData is never touched.

let base: string;
let projectRoot: string;
let recoveryDir: string;

async function launch(): Promise<{ app: ElectronApplication; window: Page }> {
  const app = await launchElectron(electron, {
    args: [APP_ENTRY, '--project', projectRoot],
    env: {
      RENIDE_RECOVERY_DIR: recoveryDir,
      RENIDE_SETTINGS_OVERRIDE: JSON.stringify({ isLeftSidebarOpen: true, isRightSidebarOpen: true }),
    },
  });
  await suppressFirstRunTutorial(app);
  const window = await app.firstWindow();
  await window.waitForLoadState('domcontentloaded');
  return { app, window };
}

async function snapshotFiles(): Promise<string[]> {
  const out: string[] = [];
  const dirs = await fs.readdir(recoveryDir).catch(() => [] as string[]);
  for (const d of dirs) {
    for (const f of await fs.readdir(path.join(recoveryDir, d)).catch(() => [] as string[])) {
      if (/^session-.+\.json$/.test(f)) out.push(path.join(recoveryDir, d, f));
    }
  }
  return out;
}

async function typeUnsavedEditAndCrash(marker: string) {
  const { app, window } = await launch();
  const block = window.locator('[data-block-id]').first();
  await expect(block).toBeVisible({ timeout: 30_000 });
  await block.dblclick();
  const editor = window.locator('.monaco-editor').first();
  await expect(editor).toBeVisible({ timeout: 10_000 });
  await editor.click();
  await window.keyboard.press(process.platform === 'darwin' ? 'Meta+End' : 'Control+End');
  await window.keyboard.press('Enter');
  await window.keyboard.type(marker);
  // 800 ms content debounce + 5 s snapshot debounce
  await expect.poll(async () => {
    for (const f of await snapshotFiles()) {
      if ((await fs.readFile(f, 'utf-8')).includes(marker)) return true;
    }
    return false;
  }, { timeout: 20_000 }).toBe(true);
  await forceExit(app); // simulated crash
}

test.describe('crash recovery', () => {
  test.beforeEach(async () => {
    base = await fs.mkdtemp(path.join(os.tmpdir(), 'vangard e2e crash ゲーム-'));
    projectRoot = path.join(base, 'project');
    recoveryDir = path.join(base, 'recovery');
    await fs.cp(FIXTURE_PROJECT, projectRoot, { recursive: true });
  });

  test.afterEach(async () => {
    await fs.rm(base, { recursive: true, force: true });
  });

  test('an unsaved edit survives a crash and is restored as an unsaved change', async () => {
    const marker = `# crash-marker-${Date.now()}`;
    const scriptPath = path.join(projectRoot, 'game', 'script.rpy');
    const onDisk = await fs.readFile(scriptPath, 'utf-8');

    await typeUnsavedEditAndCrash(marker);
    const crashFiles = await snapshotFiles();
    expect(crashFiles).toHaveLength(1);

    const { app, window } = await launch();
    try {
      await expect(window.getByRole('heading', { name: /Recover unsaved work/ })).toBeVisible({ timeout: 30_000 });
      await expect(window.getByRole('checkbox', { name: /game\/script\.rpy/ })).toBeChecked();
      // Opening the editor tab dirtied workspace state too (open tabs live in
      // project.ide.json), so the snapshot also offers workspace changes.
      await expect(window.getByRole('checkbox', { name: /Workspace changes/ })).toBeChecked();
      await window.getByRole('button', { name: 'Restore selected' }).click();
      await expect(window.getByText(/Restored 2 items/)).toBeVisible();

      // The crash snapshot stays until this session's own snapshot (holding the
      // restored work) reaches disk, so a crash right after Restore loses nothing.
      expect(await fs.access(crashFiles[0]).then(() => true, () => false)).toBe(true);
      await expect.poll(async () => {
        const files = await snapshotFiles();
        if (files.includes(crashFiles[0]) || files.length !== 1) return false;
        return (await fs.readFile(files[0], 'utf-8')).includes(marker);
      }, { timeout: 20_000 }).toBe(true);

      const block = window.locator('[data-block-id]').first();
      await block.dblclick();
      await expect(window.locator('.monaco-editor').first()).toContainText(marker);

      // Restored as UNSAVED: disk is untouched until the user saves.
      expect(await fs.readFile(scriptPath, 'utf-8')).toBe(onDisk);
    } finally {
      await forceExit(app);
    }
  });

  test('discarding recovered work deletes it and it is not offered again', async () => {
    await typeUnsavedEditAndCrash(`# discard-marker-${Date.now()}`);

    let { app, window } = await launch();
    await expect(window.getByRole('heading', { name: /Recover unsaved work/ })).toBeVisible({ timeout: 30_000 });
    await window.getByRole('button', { name: 'Discard…' }).click();
    await window.getByRole('button', { name: 'Discard recovered work' }).click();
    await expect(window.getByText('Recovered work discarded')).toBeVisible();
    expect(await snapshotFiles()).toEqual([]);
    await forceExit(app);

    ({ app, window } = await launch());
    try {
      await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });
      await expect(window.getByRole('heading', { name: /Recover unsaved work/ })).toHaveCount(0);
    } finally {
      await forceExit(app);
    }
  });
});
