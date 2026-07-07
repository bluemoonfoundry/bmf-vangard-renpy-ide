import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Path to the Electron main-process entry point, shared by the e2e fixtures
 *  and docs/capture_screenshots.js so both launch the app the same way. */
export const APP_ENTRY = path.join(__dirname, '..', 'electron.js');

/** Force-exits the Electron process, bypassing the window close event handler
 *  (which intercepts close to check for unsaved changes and hangs teardown). */
export async function forceExit(app) {
  await app.evaluate(({ app: electronApp }) => electronApp.exit(0)).catch(() => {});
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
