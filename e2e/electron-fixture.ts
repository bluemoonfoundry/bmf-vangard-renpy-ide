import { test as base, _electron as electron } from 'playwright/test';
import type { ElectronApplication, Page } from 'playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const APP_ENTRY = path.join(__dirname, '..', 'electron.js');
export const FIXTURE_PROJECT = path.join(__dirname, 'fixtures', 'test-project');

type ElectronFixtures = {
  electronApp: ElectronApplication;
  window: Page;
};

/** Force-exits the Electron process, bypassing the window close event handler
 *  (which intercepts close to check for unsaved changes and hangs teardown). */
async function forceExit(app: ElectronApplication): Promise<void> {
  await app.evaluate(({ app: electronApp }) => electronApp.exit(0)).catch(() => {});
}

/** Base fixture — no project loaded. Used for launch/startup tests. */
/* eslint-disable react-hooks/rules-of-hooks, no-empty-pattern */
export const test = base.extend<ElectronFixtures>({
  electronApp: async ({}, use) => {
    const app = await electron.launch({ args: [APP_ENTRY] });
    await use(app);
    await forceExit(app);
  },
  window: async ({ electronApp }, use) => {
    const page = await electronApp.firstWindow();
    await page.waitForLoadState('domcontentloaded');
    await use(page);
  },
});

/** Fixture with the test project pre-loaded via --project CLI arg. */
export const testWithProject = base.extend<ElectronFixtures>({
  electronApp: async ({}, use) => {
    const app = await electron.launch({
      args: [APP_ENTRY, '--project', FIXTURE_PROJECT],
    });
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
