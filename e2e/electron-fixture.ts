import { test as base, _electron as electron, expect } from 'playwright/test';
import type { ElectronApplication, Locator, Page } from 'playwright/test';
import { fileURLToPath } from 'url';
import { mkdtempSync, rmSync } from 'fs';
import os from 'os';
import path from 'path';
import { APP_ENTRY, forceExit, launchElectron, suppressFirstRunTutorial } from './electron-launch.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const FIXTURE_PROJECT = path.join(__dirname, 'fixtures', 'test-project');
export const DEMO_PROJECT = path.join(__dirname, '..', 'DemoProject');
const FAKE_RENPY_SDK = path.join(__dirname, 'fixtures', 'fake-renpy-sdk');

type ElectronFixtures = {
  electronApp: ElectronApplication;
  window: Page;
};

// Pin sidebar state so tests don't depend on the developer's saved preferences.
const BASE_SETTINGS_OVERRIDE = JSON.stringify({
  isLeftSidebarOpen: true,
  isRightSidebarOpen: true,
});

/** A fresh crash-recovery directory per launch. Tests end with a hard exit
 *  (forceExit), which skips the clean-quit cleanup, so any recovery snapshot a
 *  test wrote (written ~5 s after an unsaved settings change) would otherwise
 *  stay in the shared userData and pop the recovery modal over the next test. */
function withRecoveryDir<T>(run: (recoveryDir: string) => Promise<T>): Promise<T> {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'renide-e2e-recovery-'));
  return run(dir).finally(() => rmSync(dir, { recursive: true, force: true }));
}

/** Base fixture — no project loaded. Used for launch/startup tests. */
/* eslint-disable react-hooks/rules-of-hooks, no-empty-pattern */
export const test = base.extend<ElectronFixtures>({
  electronApp: async ({}, use) => withRecoveryDir(async (recoveryDir) => {
    const app = await launchElectron(electron, {
      args: [APP_ENTRY],
      env: { RENIDE_SETTINGS_OVERRIDE: BASE_SETTINGS_OVERRIDE, RENIDE_RECOVERY_DIR: recoveryDir },
    });
    await suppressFirstRunTutorial(app);
    await use(app);
    await forceExit(app);
  }),
  window: async ({ electronApp }, use) => {
    const page = await electronApp.firstWindow();
    await page.waitForLoadState('domcontentloaded');
    await use(page);
  },
});

/** Fixture with the minimal test project pre-loaded via --project CLI arg.
 *  Also points renpyPath at a stub SDK so Run/Warp toolbar buttons are
 *  enabled — checkRenpyPath only verifies the executable exists, it never runs it. */
export const testWithProject = base.extend<ElectronFixtures>({
  electronApp: async ({}, use) => withRecoveryDir(async (recoveryDir) => {
    const app = await launchElectron(electron, {
      args: [APP_ENTRY, '--project', FIXTURE_PROJECT],
      env: {
        RENIDE_SETTINGS_OVERRIDE: JSON.stringify({
          renpyPath: FAKE_RENPY_SDK,
          isLeftSidebarOpen: true,
          isRightSidebarOpen: true,
        }),
        RENIDE_RECOVERY_DIR: recoveryDir,
      },
    });
    await suppressFirstRunTutorial(app);
    await use(app);
    await forceExit(app);
  }),
  window: async ({ electronApp }, use) => {
    const page = await electronApp.firstWindow();
    await page.waitForLoadState('domcontentloaded');
    await use(page);
  },
});

/** Fixture with the full DemoProject pre-loaded. Provides a richer project with
 *  background images, CG art, named scene compositions, imagemap compositions,
 *  and a markdown doc — used for tests that require real assets. */
export const testWithDemoProject = base.extend<ElectronFixtures>({
  electronApp: async ({}, use) => withRecoveryDir(async (recoveryDir) => {
    const app = await launchElectron(electron, {
      args: [APP_ENTRY, '--project', DEMO_PROJECT],
      env: {
        RENIDE_SETTINGS_OVERRIDE: JSON.stringify({
          renpyPath: FAKE_RENPY_SDK,
          isLeftSidebarOpen: true,
          isRightSidebarOpen: true,
        }),
        RENIDE_RECOVERY_DIR: recoveryDir,
      },
    });
    await suppressFirstRunTutorial(app);
    await use(app);
    await forceExit(app);
  }),
  window: async ({ electronApp }, use) => {
    const page = await electronApp.firstWindow();
    await page.waitForLoadState('domcontentloaded');
    await use(page);
  },
});
/* eslint-enable react-hooks/rules-of-hooks, no-empty-pattern */

/** Opens a Project Canvas block in an editor tab by focusing it and pressing
 *  Enter (StoryCanvas's keyboard open path). Double-clicking hits the block's
 *  centre, which the top-left Canvas Toolbox covers whenever the view hasn't
 *  been centred on the block, so specs that only need an editor use this. */
export async function openBlockInEditor(window: Page, block: Locator = window.locator('[data-block-id]').first()) {
  await expect(block).toBeVisible({ timeout: 30_000 });
  await block.focus();
  await window.keyboard.press('Enter');
}

export { expect };
