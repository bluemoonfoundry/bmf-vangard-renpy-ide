#!/usr/bin/env node
/**
 * capture_broll.js
 *
 * Launches the Vangard Studio Electron app with DemoProject and uses Playwright's
 * video recording to capture b-roll clips for the sizzle reel
 * (docs/marketing/sizzle-reel-script.md). One clip per visual cue in the script;
 * the editor stitches them together against the VO track and title cards in post.
 *
 * Usage:
 *   node docs/capture_broll.js [--project /path] [--out docs/marketing/broll] [--clip <id>]
 *
 * Requirements:
 *   npm install --save-dev playwright
 *
 * Each clip launches its own Electron instance (Playwright's recordVideo only
 * finalizes a video when its context/page closes, so clips can't share one long
 * -running app the way capture_screenshots.js shares one for stills).
 */

import { _electron as electron } from 'playwright';
import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { APP_ENTRY, suppressFirstRunTutorial } from '../e2e/electron-launch.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const require = createRequire(import.meta.url);

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const getArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : null;
};

const PROJECT_PATH = getArg('--project') ?? path.join(ROOT, 'DemoProject');
const OUT_DIR       = getArg('--out')     ?? path.join(__dirname, 'marketing', 'broll');
const ONLY_CLIP     = getArg('--clip');

const VIDEO_SIZE = { width: 1920, height: 1080 };

// Floor on how long a page must stay open before closing -- shorter than this
// and Playwright's video encoder can close out with zero frames flushed
// (observed empirically with 2.5-3.5s clips and action-only clips).
const MIN_HOLD_MS = 4000;

// Same stub SDK path as capture_screenshots.js -- points Settings > Ren'Py SDK
// Directory at a real file so checkRenpyPath() passes (it only checks the file
// exists, never runs it). Without this, Warp to Label stays disabled.
const FAKE_RENPY_SDK = path.join(ROOT, 'e2e', 'fixtures', 'fake-renpy-sdk');

// ---------------------------------------------------------------------------
// Load production app settings for theme/layout consistency (same as
// capture_screenshots.js, so b-roll and screenshots visually match).
// ---------------------------------------------------------------------------
function getProductionSettingsPath() {
    const pkg = require(path.join(ROOT, 'package.json'));
    const productName = pkg.build?.productName ?? pkg.name;
    let base;
    switch (process.platform) {
        case 'win32':
            base = process.env.APPDATA ?? path.join(os.homedir(), 'AppData', 'Roaming');
            break;
        case 'darwin':
            base = path.join(os.homedir(), 'Library', 'Application Support');
            break;
        default:
            base = process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), '.config');
    }
    return path.join(base, productName, 'app-settings.json');
}

function loadProductionSettings() {
    const settingsFile = getProductionSettingsPath();
    if (!existsSync(settingsFile)) {
        console.warn(`  Production settings not found at: ${settingsFile}`);
        console.warn(`  Clips will use default theme. Run the installed app first to save settings.`);
        return null;
    }
    try {
        const settings = JSON.parse(readFileSync(settingsFile, 'utf8'));
        console.log(`  Settings loaded from: ${settingsFile} (theme: ${settings.theme ?? 'system'})`);
        return settings;
    } catch (e) {
        console.warn(`  Could not parse production settings: ${e.message}`);
        return null;
    }
}

// ---------------------------------------------------------------------------
// Wait / navigation helpers (same selectors as capture_screenshots.js)
// ---------------------------------------------------------------------------
async function waitForProjectReady(page) {
    await page.waitForSelector('[data-project-ready="true"]', { timeout: 90000 });
    await page.waitForTimeout(700);
}

async function clickCanvasTab(page, ariaLabel) {
    await page.click(`[aria-label="Switch canvas"] button[aria-label="${ariaLabel}"]`);
    await page.waitForTimeout(600);
}

async function clickSidebarTab(page, tooltip) {
    await page.click(`[role="tablist"][aria-label="Story Elements"] button[aria-label="${tooltip}"]`);
    await page.waitForTimeout(400);
}

/** Slow, cinematic mouse drag across the canvas -- used to fake a "pan" since
 *  Playwright has no camera; a real drag moves the canvas the same way a user's
 *  would, which reads better on video than a hard cut mid-clip. */
async function panCanvas(page, { dx = -300, dy = -120, steps = 24, holdMs = 30 } = {}) {
    const viewport = page.viewportSize() ?? VIDEO_SIZE;
    const startX = viewport.width / 2;
    const startY = viewport.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    for (let i = 1; i <= steps; i++) {
        await page.mouse.move(startX + (dx * i) / steps, startY + (dy * i) / steps);
        await page.waitForTimeout(holdMs);
    }
    await page.mouse.up();
}

// ---------------------------------------------------------------------------
// Clip manifest -- one entry per visual cue in sizzle-reel-script.md.
// `time` is the cue's timestamp in the locked script, for reference when
// assembling the final cut; it is not enforced here (clips run to `durationMs`
// regardless, since capture and VO timing are produced independently and
// reconciled in the edit per the script's "Notes for the VO service").
// ---------------------------------------------------------------------------
const CLIPS = [
    {
        id: '01-code-chaos',
        time: '0:00-0:11',
        description: 'Wall of .rpy code / tangled folder tree, then whip toward the canvas',
        durationMs: 11000,
        setup: async (page) => {
            await waitForProjectReady(page);
            await page.getByRole('button', { name: 'Explorer', exact: true }).click();
            await page.keyboard.press('Control+g');
            await page.waitForSelector('[aria-labelledby="goto-modal-title"]', { timeout: 5000 });
            await page.keyboard.type('stage1_arrival');
            await page.waitForTimeout(400);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(600);
            await page.dblclick('[data-block-id]:has-text("stage1_arrival.rpy")');
            await page.waitForSelector('.monaco-editor', { timeout: 8000 });
            // Scroll through the file quickly for a "wall of code" feel.
            for (let i = 0; i < 6; i++) {
                await page.mouse.wheel(0, 400);
                await page.waitForTimeout(350);
            }
        },
    },
    {
        id: '02-project-canvas-reveal',
        time: '0:11-0:16',
        description: 'Logo reveal -> Project Canvas populating with blocks and arrows',
        durationMs: 5000,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Project Canvas');
        },
    },
    {
        id: '03-canvas-tour-project',
        time: '0:16-0:25 (part 1/3)',
        description: 'Pan/zoom across Project Canvas',
        durationMs: 3500,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Project Canvas');
        },
        action: async (page) => panCanvas(page),
    },
    {
        id: '03-canvas-tour-flow',
        time: '0:16-0:25 (part 2/3)',
        description: 'Flow Canvas branching',
        durationMs: 3000,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Flow Canvas');
            await page.waitForTimeout(600);
        },
    },
    {
        id: '03-canvas-tour-choices',
        time: '0:16-0:25 (part 3/3)',
        description: 'Choices Canvas',
        durationMs: 2500,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Choices Canvas');
            await page.waitForTimeout(600);
        },
    },
    {
        id: '04-diagnostics',
        time: '0:25-0:32',
        description: 'Diagnostics catches a broken jump / missing character',
        durationMs: 7000,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Project Canvas');
            await page.click('button[aria-label="Diagnostics"]');
            await page.waitForTimeout(800);
        },
    },
    {
        id: '05-editor-autocomplete',
        time: '0:32-0:39',
        description: "Monaco editor with Ren'Py-smart autocomplete",
        durationMs: 7000,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Project Canvas');
            await page.keyboard.press('Control+g');
            await page.waitForSelector('[aria-labelledby="goto-modal-title"]', { timeout: 5000 });
            await page.keyboard.type('stage1_arrival');
            await page.waitForTimeout(400);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(600);
            await page.dblclick('[data-block-id]:has-text("stage1_arrival.rpy")');
            await page.waitForSelector('.monaco-editor', { timeout: 8000 });
            await page.click('.monaco-editor');
            await page.keyboard.press('Control+End');
            await page.keyboard.type('\n    show ');
            await page.waitForTimeout(600);
        },
    },
    {
        id: '06-scene-composer',
        time: '0:39-0:47',
        description: 'Scene Composer: drag sprite onto stage, code preview updates live',
        durationMs: 8000,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Scene Compositions');
            await page.click('li p.font-semibold:has-text("Garden")');
            await page.waitForSelector('h3:has-text("Layers")', { timeout: 8000 });
            await page.waitForTimeout(800);
        },
    },
    {
        id: '07-warp-to-label',
        time: '0:47-0:53',
        description: 'Warp to Label modal, fuzzy search, game window jumps in',
        durationMs: 6000,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Project Canvas');
            await page.click('button[aria-label="Warp to Label"]');
            await page.waitForSelector('[aria-labelledby="goto-modal-title"]', { timeout: 5000 });
            await page.keyboard.type('stage');
            await page.waitForTimeout(1200);
        },
        teardown: async (page) => {
            await page.keyboard.press('Escape').catch(() => {});
        },
    },
    {
        id: '08-real-renpy-file',
        time: '0:53-1:00',
        description: "Vangard side of the split-screen \"still just Ren'Py\" shot " +
            '(the plain-text-editor side is not automatable -- capture that half ' +
            'separately in VS Code/Notepad and composite in the edit)',
        durationMs: 7000,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Project Canvas');
            await page.keyboard.press('Control+g');
            await page.waitForSelector('[aria-labelledby="goto-modal-title"]', { timeout: 5000 });
            await page.keyboard.type('stage1_arrival');
            await page.waitForTimeout(400);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(600);
            await page.dblclick('[data-block-id]:has-text("stage1_arrival.rpy")');
            await page.waitForSelector('.monaco-editor', { timeout: 8000 });
        },
    },
    {
        id: '09-feature-montage-translation',
        time: '1:00-1:10 (part 1/4)',
        description: 'Translation Dashboard',
        durationMs: 2500,
        setup: async (page) => {
            await waitForProjectReady(page);
            await page.click('button[aria-label="Translation Dashboard"]');
            await page.waitForSelector('button:has-text("Generate Translations")', { timeout: 8000 });
            await page.waitForTimeout(400);
        },
        teardown: async (page) => {
            await page.keyboard.press('Escape').catch(() => {});
        },
    },
    {
        id: '09-feature-montage-snippets',
        time: '1:00-1:10 (part 2/4)',
        description: 'Code Snippets grid',
        durationMs: 2500,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Code Snippets');
        },
    },
    {
        id: '09-feature-montage-menu-constructor',
        time: '1:00-1:10 (part 3/4)',
        description: 'Menu Constructor',
        durationMs: 2500,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Menu Templates');
            await page.click('h2:has-text("Menu Templates") ~ button:has-text("+ New")');
            await page.waitForSelector('[role="dialog"][aria-labelledby="menu-constructor-title"]', { timeout: 8000 });
            await page.waitForTimeout(400);
        },
        teardown: async (page) => {
            await page.click('[role="dialog"][aria-labelledby="menu-constructor-title"] button:has-text("Cancel")').catch(() => {});
        },
    },
    {
        id: '09-feature-montage-drafting-mode',
        time: '1:00-1:10 (part 4/4)',
        description: 'Drafting Mode toggle',
        durationMs: 2500,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Project Canvas');
            const enableButton = page.locator('button[aria-label="Enable Drafting Mode"]');
            if (await enableButton.count() > 0) {
                await enableButton.click();
            }
            await page.waitForSelector('button[aria-label="Disable Drafting Mode"]', { timeout: 5000 });
        },
    },
    // NOTE: 1:10-1:18 (logo + "Free on Itch.io" + GitHub link card) is a title
    // card, not app footage -- built directly in the video editor, no clip here.
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function ensureDir(dir) {
    await fs.mkdir(dir, { recursive: true });
}

async function launchAppRecording(productionSettings, videoDir, settingsOverride = {}) {
    const env = { ...process.env, ELECTRON_DISABLE_SECURITY_WARNINGS: '1' };
    env.RENIDE_SETTINGS_OVERRIDE = JSON.stringify({
        ...productionSettings,
        legacyMigrationChecked: true,
        renpyPath: FAKE_RENPY_SDK,
        ...settingsOverride,
    });
    const app = await electron.launch({
        args: [APP_ENTRY, '--project', PROJECT_PATH],
        cwd: ROOT,
        env,
        recordVideo: { dir: videoDir, size: VIDEO_SIZE },
    });
    await suppressFirstRunTutorial(app);
    return app;
}

async function getMainPage(electronApp) {
    const page = await electronApp.firstWindow();
    await electronApp.evaluate(({ BrowserWindow }) => {
        const [win] = BrowserWindow.getAllWindows();
        if (win) win.setFullScreen(true);
    });
    await page.waitForTimeout(800);
    return page;
}

/** Renames Playwright's auto-generated video filename (a random hash) to the
 *  clip's id, and moves it out of the temp per-clip subdirectory. */
async function finalizeVideo(page, videoDir, clipId, outDir) {
    const video = page.video();
    if (!video) return null;
    const tempPath = await video.path();
    const destPath = path.join(outDir, `${clipId}.webm`);
    // fs.rename() fails with EXDEV when the OS temp dir and output dir are on
    // different volumes/drives (common on Windows) -- copy then remove instead.
    await fs.copyFile(tempPath, destPath);
    await fs.rm(videoDir, { recursive: true, force: true }).catch(() => {});
    return destPath;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
    if (!existsSync(PROJECT_PATH)) {
        console.error(`Project not found: ${PROJECT_PATH}`);
        process.exit(1);
    }

    await ensureDir(OUT_DIR);
    console.log(`\nSaving b-roll clips to: ${OUT_DIR}`);
    console.log(`Using project:          ${PROJECT_PATH}`);

    const productionSettings = loadProductionSettings();
    const clips = ONLY_CLIP ? CLIPS.filter(c => c.id === ONLY_CLIP) : CLIPS;
    if (ONLY_CLIP && clips.length === 0) {
        console.error(`No clip matches --clip "${ONLY_CLIP}"`);
        process.exit(1);
    }

    let captured = 0;
    let failed = 0;

    for (const clip of clips) {
        const num = String(captured + failed + 1).padStart(2);
        process.stdout.write(`  [${num}] ${clip.id.padEnd(34)} (${clip.time}) `);

        const tempVideoDir = path.join(os.tmpdir(), `vangard-broll-${clip.id}-${Date.now()}`);
        let electronApp;
        let page;
        try {
            electronApp = await launchAppRecording(productionSettings, tempVideoDir);
            page = await getMainPage(electronApp);

            if (clip.setup) await clip.setup(page, electronApp);
            const holdStart = Date.now();
            if (clip.action) await clip.action(page, electronApp);
            // Playwright's video encoder needs several seconds of open page time
            // to flush any frames at all -- clips that closed sooner than ~4s
            // after launch (short waitForTimeout durations, or an `action` like
            // panCanvas that itself only takes ~1s) came out as 0-byte files in
            // testing. Enforce a floor here rather than on every clip's
            // durationMs, and always wait out the remainder after an action.
            const elapsed = Date.now() - holdStart;
            const remaining = Math.max(clip.durationMs - elapsed, 0);
            await page.waitForTimeout(Math.max(remaining, MIN_HOLD_MS));
            if (clip.teardown) await clip.teardown(page, electronApp);

            // electronApp.close() waits on the window's native 'close' handler
            // (electron.js), which always intercepts close and round-trips
            // through the renderer to ask about unsaved changes -- nothing in
            // this script answers that dialog, so close() hangs indefinitely.
            // window.electronAPI.forceQuit() sends the same IPC the app's own
            // "force quit" path uses (electron.js's `force-quit` handler),
            // which skips the unsaved-changes check and calls app.quit()
            // directly. Waiting for the page's 'close' event (a normal window
            // close, not a process kill) still lets Playwright flush the
            // recorded video before the process exits.
            await page.evaluate(() => window.electronAPI.forceQuit());
            await page.waitForEvent('close', { timeout: 10000 }).catch(() => {});
            const savedPath = await finalizeVideo(page, tempVideoDir, clip.id, OUT_DIR);
            await electronApp.close().catch(() => {});

            const { size } = await fs.stat(savedPath);
            if (size === 0) {
                // Observed intermittently when a launch follows closely behind
                // the previous clip's teardown -- the video encoder occasionally
                // flushes zero frames. Not a setup/selector problem: re-running
                // just this clip id in isolation has always produced a real file.
                failed++;
                console.log(`FAILED: wrote 0-byte video (flaky encoder race -- rerun with --clip ${clip.id})`);
            } else {
                captured++;
                console.log(`ok -> ${path.basename(savedPath)}`);
            }
            // Brief cooldown before the next launch to reduce the same race.
            await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (err) {
            failed++;
            console.log(`FAILED: ${err.message.split('\n')[0]}`);
            if (page) {
                await page.evaluate(() => window.electronAPI.forceQuit()).catch(() => {});
            }
            if (electronApp) {
                await electronApp.close().catch(() => {});
            }
            await fs.rm(tempVideoDir, { recursive: true, force: true }).catch(() => {});
        }
    }

    console.log(`\nDone: ${captured} captured, ${failed} failed.`);
    if (failed > 0) process.exit(1);
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
