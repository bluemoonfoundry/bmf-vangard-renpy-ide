import { test as base, _electron as electron } from 'playwright/test';
import type { ElectronApplication, Page } from 'playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import { APP_ENTRY, forceExit, suppressFirstRunTutorial } from './electron-launch.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const FIXTURE_PROJECT = path.join(__dirname, 'fixtures', 'test-project');
export const DEMO_PROJECT = path.join(__dirname, '..', 'DemoProject');
const FAKE_RENPY_SDK = path.join(__dirname, 'fixtures', 'fake-renpy-sdk');

type ElectronFixtures = {
  electronApp: ElectronApplication;
  window: Page;
};

// Suppress the legacy-migration modal in all test runs — the flag is normally
// persisted to disk after first dismiss, but e2e tests use a fresh userData
// directory on each run so the modal would appear every time.
// Also pin sidebar state so tests don't depend on the developer's saved preferences.
const BASE_SETTINGS_OVERRIDE = JSON.stringify({
  legacyMigrationChecked: true,
  isLeftSidebarOpen: true,
  isRightSidebarOpen: true,
});

/** Base fixture — no project loaded. Used for launch/startup tests. */
/* eslint-disable react-hooks/rules-of-hooks, no-empty-pattern */
export const test = base.extend<ElectronFixtures>({
  electronApp: async ({}, use) => {
    const app = await electron.launch({
      args: [APP_ENTRY],
      env: { ...process.env, RENIDE_SETTINGS_OVERRIDE: BASE_SETTINGS_OVERRIDE },
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

/** Fixture with the minimal test project pre-loaded via --project CLI arg.
 *  Also points renpyPath at a stub SDK so Run/Warp toolbar buttons are
 *  enabled — checkRenpyPath only verifies the executable exists, it never runs it. */
export const testWithProject = base.extend<ElectronFixtures>({
  electronApp: async ({}, use) => {
    const app = await electron.launch({
      args: [APP_ENTRY, '--project', FIXTURE_PROJECT],
      env: {
        ...process.env,
        RENIDE_SETTINGS_OVERRIDE: JSON.stringify({
          renpyPath: FAKE_RENPY_SDK,
          legacyMigrationChecked: true,
          isLeftSidebarOpen: true,
          isRightSidebarOpen: true,
        }),
      },
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

/** Fixture with the full DemoProject pre-loaded. Provides a richer project with
 *  background images, CG art, named scene compositions, imagemap compositions,
 *  and a markdown doc — used for tests that require real assets. */
export const testWithDemoProject = base.extend<ElectronFixtures>({
  electronApp: async ({}, use) => {
    const app = await electron.launch({
      args: [APP_ENTRY, '--project', DEMO_PROJECT],
      env: {
        ...process.env,
        RENIDE_SETTINGS_OVERRIDE: JSON.stringify({
          renpyPath: FAKE_RENPY_SDK,
          legacyMigrationChecked: true,
          isLeftSidebarOpen: true,
          isRightSidebarOpen: true,
        }),
      },
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

export { expect } from 'playwright/test';
