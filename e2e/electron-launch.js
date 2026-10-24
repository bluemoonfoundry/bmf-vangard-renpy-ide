import { spawnSync } from 'child_process';
import console from 'console';
import { existsSync } from 'fs';
import path from 'path';
import process from 'process';
import { clearTimeout, setTimeout } from 'timers';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Path to the Electron main-process entry point, shared by the e2e fixtures
 *  and docs/capture_screenshots.js so both launch the app the same way. */
export const APP_ENTRY = path.join(__dirname, '..', 'electron.js');

/** Env vars that must never reach the launched app. ELECTRON_RUN_AS_NODE=1 is
 *  inherited by shells spawned from Electron-based hosts (VS Code, agent
 *  terminals); it makes electron.exe run as plain Node, which rejects
 *  Playwright's Chromium flags ("bad option: --remote-debugging-port=0") and
 *  fails every launch before the app starts. */
export const STRIPPED_ENV_VARS = ['ELECTRON_RUN_AS_NODE'];

/** Returns a copy of process.env (merged with `extra`) safe to pass as the
 *  `env` option of electron.launch(). */
export function electronLaunchEnv(extra = {}) {
  const env = { ...process.env, ...extra };
  for (const name of STRIPPED_ENV_VARS) delete env[name];
  return env;
}

/** electron.js loads the renderer from dist/index.html, so launching without a
 *  build shows a blank window and every spec times out on its first locator.
 *  Fails fast with a message that says what to do instead. */
export function assertRendererBuilt(root = path.join(__dirname, '..')) {
  const indexHtml = path.join(root, 'dist', 'index.html');
  if (!existsSync(indexHtml)) {
    throw new Error(`Renderer build not found at ${indexHtml}. Run \`npm run build\` before launching Electron.`);
  }
}

/** Resolves when Playwright sees each launched app's process close: exited, with
 *  every holder of its stdio pipes gone. */
const appClosed = new WeakMap();

/** Launches the app through Playwright's `_electron` driver with a sanitized
 *  env after checking the renderer build exists. Launcher failures are not
 *  wrapped: when the process exits early Playwright rejects internal promises
 *  nobody awaits, so the test fails with Playwright's own error regardless —
 *  its call log already includes the child's stderr (e.g. "bad option: ..."). */
export async function launchElectron(electron, options = {}) {
  assertRendererBuilt();
  const app = await electron.launch({ ...options, env: electronLaunchEnv(options.env) });
  const closed = new Promise((resolve) => app.once('close', resolve));
  appClosed.set(app, closed);
  return app;
}

/** How long forceExit waits for the process to close before killing its group. */
const FORCE_EXIT_GRACE_MS = 5_000;

function closesWithin(closed, ms) {
  let timer;
  const timeout = new Promise((resolve) => { timer = setTimeout(() => resolve(false), ms); });
  return Promise.race([closed.then(() => true), timeout]).finally(() => clearTimeout(timer));
}

/** Kills the app's whole process tree. Playwright launches Electron as a process
 *  group leader on POSIX, so this also reaches Chromium children that outlive
 *  the main process. */
function killProcessTree(pid) {
  try {
    if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(pid), '/T', '/F']);
    else process.kill(-pid, 'SIGKILL');
  } catch {
    // Already gone.
  }
}

/** Force-exits the Electron process, bypassing the window close event handler
 *  (which intercepts close to check for unsaved changes and hangs teardown).
 *  Returns only once the process has closed: Playwright gracefully closes every
 *  app it still tracks at worker teardown, and that hangs on a half-exited app
 *  (bmf-vangard-renpy-ide-15bf). Safe to call more than once. */
export async function forceExit(app) {
  const closed = appClosed.get(app) ?? new Promise((resolve) => app.once('close', resolve));
  await app.evaluate(({ app: electronApp }) => electronApp.exit(0)).catch(() => {});
  if (await closesWithin(closed, FORCE_EXIT_GRACE_MS)) return;

  const pid = app.process().pid;
  console.warn(`[e2e] Electron pid ${pid} did not close within ${FORCE_EXIT_GRACE_MS}ms of app.exit(); killing its process tree`);
  killProcessTree(pid);
  if (!(await closesWithin(closed, FORCE_EXIT_GRACE_MS))) {
    console.warn(`[e2e] Electron pid ${pid} still not closed after kill`);
  }
}

const TUTORIAL_STORAGE_KEY = 'renpy-ide-tutorial-completed';

/** Suppresses the first-run interactive tutorial modal (src/components/FirstRunTutorial.tsx),
 *  which auto-shows ~1s after mount whenever its localStorage flag is unset — always true for
 *  a fresh e2e/screenshot-capture profile. Must be registered on the app's BrowserContext
 *  *before* the first window is created (electronApp.context().addInitScript(...), not
 *  page.addInitScript(...) after the fact) — by the time firstWindow() resolves, the window
 *  may already be mid-navigation, so a page-level init script can lose the race. */
export async function suppressFirstRunTutorial(app) {
  await app.context().addInitScript((key) => {
    // eslint-disable-next-line no-undef -- runs in the page's browser context, not Node
    window.localStorage.setItem(key, 'true');
  }, TUTORIAL_STORAGE_KEY);
}
