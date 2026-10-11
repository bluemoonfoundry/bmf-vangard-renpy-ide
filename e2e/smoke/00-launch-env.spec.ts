import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { test, _electron as electron, expect } from 'playwright/test';
import {
  APP_ENTRY,
  STRIPPED_ENV_VARS,
  assertRendererBuilt,
  electronLaunchEnv,
  forceExit,
  launchElectron,
} from '../electron-launch.js';

// Guards the launcher itself (bmf-vangard-renpy-ide-b70a.6.2). Every other spec
// depends on Electron starting under Playwright; when it doesn't, these tests
// fail first with a message that names the cause.

/** Runs `fn` with ELECTRON_RUN_AS_NODE=1 in this worker's env, as it is in
 *  terminals spawned from Electron-based hosts such as VS Code. */
async function withRunAsNode<T>(fn: () => Promise<T>): Promise<T> {
  const previous = process.env.ELECTRON_RUN_AS_NODE;
  process.env.ELECTRON_RUN_AS_NODE = '1';
  try {
    return await fn();
  } finally {
    if (previous === undefined) delete process.env.ELECTRON_RUN_AS_NODE;
    else process.env.ELECTRON_RUN_AS_NODE = previous;
  }
}

test.describe('electron launch environment', () => {
  test('electronLaunchEnv strips ELECTRON_RUN_AS_NODE and keeps caller overrides', async () => {
    await withRunAsNode(async () => {
      const env = electronLaunchEnv({ RENIDE_SETTINGS_OVERRIDE: '{}' });
      for (const name of STRIPPED_ENV_VARS) expect(env[name]).toBeUndefined();
      expect(env.RENIDE_SETTINGS_OVERRIDE).toBe('{}');
      expect(env.PATH ?? env.Path).toBe(process.env.PATH ?? process.env.Path);
    });
  });

  test('the app still launches when the parent shell has ELECTRON_RUN_AS_NODE=1', async () => {
    const app = await withRunAsNode(() => launchElectron(electron, { args: [APP_ENTRY] }));
    try {
      const window = await app.firstWindow();
      await window.waitForLoadState('domcontentloaded');
      expect(await app.evaluate(() => process.env.ELECTRON_RUN_AS_NODE)).toBeUndefined();
    } finally {
      await forceExit(app);
    }
  });

  test('a missing renderer build fails fast with an actionable message', async () => {
    const emptyRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'vangard-e2e-nodist-'));
    try {
      expect(() => assertRendererBuilt(emptyRoot)).toThrow(/Run `npm run build`/);
      expect(() => assertRendererBuilt()).not.toThrow();
    } finally {
      await fs.rm(emptyRoot, { recursive: true, force: true });
    }
  });
});
