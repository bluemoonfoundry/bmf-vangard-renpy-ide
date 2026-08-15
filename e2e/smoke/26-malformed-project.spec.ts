import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { test as base, _electron as electron, expect } from 'playwright/test';
import { APP_ENTRY, forceExit, suppressFirstRunTutorial } from '../electron-launch.js';

// Regression coverage for review-hardening risk: "malformed projects" (bmf-vangard-renpy-ide-6o47.6).
// Each test launches the app pointed at a project directory that is broken in a
// specific way and asserts the app degrades gracefully (error surfaced or
// existing fallback preserved) instead of crashing or hanging.

/** Generates a fresh, guaranteed-unique scratch directory per test run — never a
 *  fixed path — so a flow bug here can never collide with or clobber a real
 *  project directory on the dev machine (see bd memory
 *  docs-screenshot-wizard-mock-path-collision for why this matters). */
async function makeScratchDir(label: string): Promise<string> {
  const dir = path.join(os.tmpdir(), `vangard-e2e-${label}-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

async function launchWithProject(projectPath: string) {
  const app = await electron.launch({
    args: [APP_ENTRY, '--project', projectPath],
    env: { ...process.env, RENIDE_SETTINGS_OVERRIDE: JSON.stringify({ isLeftSidebarOpen: true, isRightSidebarOpen: true }) },
  });
  await suppressFirstRunTutorial(app);
  const window = await app.firstWindow();
  await window.waitForLoadState('domcontentloaded');
  return { app, window };
}

base.describe('malformed projects', () => {
  base('a --project path that does not exist on disk shows an error, not a crash', async () => {
    const missingDir = path.join(os.tmpdir(), `vangard-e2e-missing-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    // Deliberately never created — loadProject must hit its catch branch.

    const { app, window } = await launchWithProject(missingDir);
    try {
      await expect(window.getByText(/Failed to load project/i)).toBeVisible({ timeout: 15_000 });
      // No canvas blocks should have rendered from a project that was never loaded.
      await expect(window.locator('[data-block-id]')).toHaveCount(0);
    } finally {
      await forceExit(app);
    }
  });

  base('a project with a corrupt project.ide.json still loads via the {} fallback and warns', async () => {
    const dir = await makeScratchDir('corrupt-ide-json');
    try {
      await fs.mkdir(path.join(dir, 'game'), { recursive: true });
      await fs.writeFile(path.join(dir, 'game', 'script.rpy'), 'label start:\n    "hi"\n    return\n', 'utf-8');
      // Not valid JSON — electron.js's project:load JSON.parse must catch this
      // and fall back to {} rather than rejecting the whole project load.
      await fs.writeFile(path.join(dir, 'game', 'project.ide.json'), '{ this is not json ', 'utf-8');

      const { app, window } = await launchWithProject(dir);
      try {
        const block = window.locator('[data-block-id]').first();
        await expect(block).toBeVisible({ timeout: 30_000 });
        // bmf-vangard-renpy-ide-6o47.2: malformed settings must not fail silently --
        // a distinct, actionable toast should surface even though the load succeeds.
        await expect(window.getByText(/Project settings could not be read/i)).toBeVisible({ timeout: 10_000 });
      } finally {
        await forceExit(app);
      }
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  });

  base('a .rpy file containing binary/null-byte garbage does not hang or crash the load', async () => {
    const dir = await makeScratchDir('binary-garbage-rpy');
    try {
      await fs.mkdir(path.join(dir, 'game'), { recursive: true });
      await fs.writeFile(path.join(dir, 'game', 'good.rpy'), 'label start:\n    "hi"\n    return\n', 'utf-8');
      // Raw bytes including nulls and invalid UTF-8 sequences.
      const garbage = Buffer.from([0x00, 0x01, 0xff, 0xfe, 0x00, 0x4c, 0x61, 0x62, 0x65, 0x6c, 0x00, 0xff]);
      await fs.writeFile(path.join(dir, 'game', 'garbage.rpy'), garbage);

      const { app, window } = await launchWithProject(dir);
      try {
        // The well-formed file's block must still render — one bad file must not
        // take down the whole project load.
        await expect(window.locator('[data-block-id]')).not.toHaveCount(0, { timeout: 30_000 });
      } finally {
        await forceExit(app);
      }
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  });
});
