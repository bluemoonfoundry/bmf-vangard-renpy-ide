#!/usr/bin/env node
/**
 * capture_broll.js
 *
 * Launches the Vangard Studio Electron app with DemoProject and uses Playwright's
 * video recording to capture one continuous b-roll take covering every visual
 * cue in the sizzle reel script (docs/marketing/sizzle-reel-script.md).
 * assemble_reel.js slices it into per-cue segments and stitches them together
 * against the VO track and title cards.
 *
 * Usage:
 *   node docs/capture_broll.js [--project /path] [--out docs/marketing/broll]
 *   node docs/capture_broll.js --clip <id>   # record just one clip, for
 *                                             # testing its setup/selectors --
 *                                             # writes broll-test-<id>.webm
 *                                             # instead of touching the real
 *                                             # broll-master.webm/manifest.json
 *
 * Requirements:
 *   npm install --save-dev playwright
 *
 * Records ONE continuous take: a single Electron launch runs every clip's
 * setup/action/hold back-to-back, and the app closes once at the very end.
 * An earlier version launched a fresh Electron instance per clip; that made
 * every cut in the final video look like the app was reopening, and -- worse
 * -- repeated rapid launches put the machine under enough load that
 * Playwright's video encoder sometimes fell behind wall-clock time badly
 * enough that a clip's recorded setup duration exceeded the real length of
 * its own video. A single continuous recording sidesteps both: cuts are cuts
 * within one take instead of relaunches, and the only heavy load moment
 * ("Preparing your project...") happens once, at the very start, not 18
 * times.
 *
 * Each clip's setup/navigation is still real footage in the recording (a
 * settle time, not literally instant), so this script records where each
 * clip's "settled" state begins and ends on the shared timeline
 * (docs/marketing/broll/manifest.json) -- assemble_reel.js slices segments
 * out of the one recording by those offsets instead of using whole files.
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
const ONLY_CLIP     = getArg('--clip'); // comma-separated ids also accepted

const VIDEO_SIZE = { width: 1920, height: 1080 };

// Floor on how long each clip's settled feature state holds on screen before
// moving to the next one, so quick actions (e.g. panCanvas) don't read as a
// flash-cut in the final video.
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

/** Slow drag of a Scene Composer sprite from its current screen position to an
 *  offset target. Sprites are positioned with native pointer events (see
 *  SceneComposer.tsx's onPointerDown handlers, same canvas convention as
 *  StoryCanvas/RouteCanvas/ChoiceCanvas per CLAUDE.md), so a plain page.mouse
 *  sequence drives it -- no HTML5 drag-and-drop simulation needed. */
async function dragSpriteBy(page, selector, { dx, dy, steps = 20, holdMs = 25 }) {
    const box = await page.locator(selector).first().boundingBox();
    if (!box) throw new Error(`Sprite not found: ${selector}`);
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    for (let i = 1; i <= steps; i++) {
        await page.mouse.move(startX + (dx * i) / steps, startY + (dy * i) / steps);
        await page.waitForTimeout(holdMs);
    }
    await page.mouse.up();
}

// ---------------------------------------------------------------------------
// Clip manifest -- one entry per visual cue in sizzle-reel-script.md's "Core
// tour" / "For Writers" / "For Artists" / "For Developers" / montage sections.
// The v2 script's cold open (0:00-0:18, hook + product-intro VO) plays over a
// black intro card with no app footage at all -- see assemble_reel.js -- so
// there is no clip here for it; app footage starts at the canvas tour.
//
// `time` is the cue's rough timestamp in the script, for reference when
// assembling; it is not enforced here (clips run to `durationMs` regardless).
// ---------------------------------------------------------------------------
const CLIPS = [
    {
        id: '01-canvas-tour-project',
        time: '0:18-0:29 (part 1/3)',
        description: 'Pan/zoom across Project Canvas',
        durationMs: 3500,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Project Canvas');
        },
        action: async (page) => panCanvas(page),
    },
    {
        id: '02-canvas-tour-flow',
        time: '0:18-0:29 (part 2/3)',
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
        time: '0:18-0:29 (part 3/3)',
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
        time: '0:29-0:41',
        description: 'Diagnostics catches a broken jump, then click-through navigates to the source line',
        durationMs: 9000,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Project Canvas');
            await page.click('button[aria-label="Diagnostics"]');
            await page.waitForTimeout(1200);
            // Click the first navigable issue's "Open ..." button (DiagnosticsPanel.tsx)
            // -- demonstrates the "click straight through to the exact line" VO beat.
            // CodeBlock.tsx ("Open in Flow Canvas") and LabelBlock.tsx ("Open in
            // editor") also start with "Open " and stay mounted-but-hidden behind
            // the Diagnostics tab (this app's tab panes don't unmount on switch --
            // see CLAUDE.md's Tab Lifecycle note), so an unscoped locator grabs an
            // off-screen canvas button instead and click() times out on visibility.
            // :visible filters to only the active pane's matches.
            const openButton = page.locator('button[aria-label^="Open "]:visible').first();
            if (await openButton.count() > 0) {
                await openButton.click();
                await page.waitForSelector('.monaco-editor', { timeout: 8000 });
            }
        },
    },
    {
        id: '05-editor-autocomplete',
        time: '0:41-0:49',
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
        time: '0:49-1:04',
        description: 'Scene Composer: swap background, drag a sprite into place, code preview updates live',
        durationMs: 12000,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Scene Compositions');
            await page.click('li p.font-semibold:has-text("Garden")');
            await page.waitForSelector('h3:has-text("Layers")', { timeout: 8000 });
            await page.waitForTimeout(800);
        },
        // Reposition a sprite on the stage -- real pointer-drag, not HTML5
        // dataTransfer drag-and-drop (see dragSpriteBy's doc comment). A literal
        // background *swap* would need to simulate the Images tab's native
        // HTML5 DnD onto the stage, which Playwright can't drive reliably; the
        // VO's "swap in a new background" beat is covered narratively rather
        // than shown literally here.
        action: async (page) => dragSpriteBy(page, '.cursor-move', { dx: 220, dy: -60, steps: 30, holdMs: 30 }),
    },
    {
        id: '07-warp-to-label',
        time: '1:04-1:11',
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
        time: '1:11-1:19',
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
        id: '09-writers-character-manager',
        time: '1:22-1:34 (part 1/2)',
        description: 'Character Manager: edit a character',
        durationMs: 6000,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Characters');
            await page.click(
                'div[title="Drag to insert dialogue · Double-click to edit"]:has-text("Maya") button[aria-label="Edit character"]'
            );
            await page.waitForTimeout(800);
        },
    },
    {
        id: '10-writers-variables',
        time: '1:22-1:34 (part 2/2)',
        description: 'Variables tab',
        durationMs: 5000,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Variables');
        },
    },
    {
        id: '11-artists-image-maps',
        time: '1:37-1:51 (part 1/2)',
        description: 'Image Maps composer with a hotspot drawn',
        durationMs: 6000,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Image Maps');
            await page.click('li p.font-semibold:has-text("Imagemap_1")');
            await page.waitForSelector('.cursor-crosshair', { timeout: 8000 });
            await page.waitForTimeout(600);
        },
    },
    {
        id: '12-artists-audio-editor',
        time: '1:37-1:51 (part 2/2)',
        description: 'Audio Editor View with equalizer animating',
        durationMs: 7000,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Audio');
            await page.waitForTimeout(600);
            await page.dblclick('div[title*="sample-12s.mp3"]');
            await page.waitForSelector('h2:has-text("sample-12s.mp3")', { timeout: 8000 });
            await page.click('button[aria-label="Play"]');
            await page.waitForTimeout(600);
        },
        teardown: async (page) => {
            await page.click('button[aria-label="Pause"]').catch(() => {});
        },
    },
    {
        id: '13-developers-statistics',
        time: '1:54-2:09 (part 1/2)',
        description: 'Script Statistics panel',
        durationMs: 7000,
        setup: async (page) => {
            await waitForProjectReady(page);
            await page.click('button[aria-label="Script Statistics"]');
            await page.waitForSelector('h1:has-text("Script Statistics")', { timeout: 8000 });
            await page.waitForTimeout(600);
        },
    },
    {
        id: '14-developers-search',
        time: '1:54-2:09 (part 2/2)',
        description: 'Global search panel with a query typed',
        durationMs: 6000,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Project Canvas');
            await page.getByRole('button', { name: 'Search', exact: true }).click();
            await page.waitForTimeout(400);
            const searchInput = page.locator('input[type="text"], input[type="search"]').first();
            if (await searchInput.count() > 0) {
                await searchInput.click();
                await page.keyboard.type('stage1');
                const findAll = page.getByRole('button', { name: 'Find All' });
                if (await findAll.count() > 0) await findAll.click();
                await page.waitForTimeout(600);
            }
        },
    },
    {
        id: '15-localization',
        time: '2:09-2:19',
        description: 'Translation Dashboard: language coverage cards, then click Generate Translations',
        durationMs: 8000,
        // DemoProject/game/tl/{spanish,french}/common.rpy seed real (partial)
        // coverage data so this shows actual language cards + a file-breakdown
        // row instead of the empty "no translations yet" state -- see those
        // files' header comments for what's (and isn't) translated.
        setup: async (page) => {
            await waitForProjectReady(page);
            await page.click('button[aria-label="Translation Dashboard"]');
            await page.waitForSelector('button:has-text("spanish")', { timeout: 8000 });
            await page.waitForTimeout(600);
            await page.click('button:has-text("french")');
            await page.waitForTimeout(1000);
        },
        teardown: async (page) => {
            await page.keyboard.press('Escape').catch(() => {});
        },
    },
    {
        id: '16-feature-montage-snippets',
        time: '2:19-2:34 (part 1/3)',
        description: 'Code Snippets grid',
        durationMs: 2500,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Code Snippets');
        },
    },
    {
        id: '17-feature-montage-menu-constructor',
        time: '2:19-2:34 (part 2/3)',
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
        id: '18-feature-montage-drafting-mode',
        time: '2:19-2:34 (part 3/3)',
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
    // NOTE: cold open (0:00-0:18) and the outro (2:34-2:42) are black title
    // cards, not app footage -- built directly by assemble_reel.js, no clip here.
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

/** Renames Playwright's auto-generated video filename (a random hash) and
 *  moves it out of the temp recording directory. */
async function finalizeVideo(page, videoDir, outDir, filename) {
    const video = page.video();
    if (!video) return null;
    const tempPath = await video.path();
    const destPath = path.join(outDir, filename);
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
    console.log(`\nSaving b-roll to: ${OUT_DIR}`);
    console.log(`Using project:    ${PROJECT_PATH}`);

    const productionSettings = loadProductionSettings();
    const onlyIds = ONLY_CLIP ? ONLY_CLIP.split(',').map(s => s.trim()) : null;
    const clips = onlyIds ? CLIPS.filter(c => onlyIds.includes(c.id)) : CLIPS;
    if (onlyIds && clips.length === 0) {
        console.error(`No clip matches --clip "${ONLY_CLIP}"`);
        process.exit(1);
    }

    // A --clip run records only those clips, in their own file
    // (broll-test-<ids>.webm) -- it can't "patch" a clip into the full
    // broll-master.webm recording without re-recording everything after it,
    // so it's for testing a clip's setup/selectors in isolation, not for
    // fixing one clip in place.
    const outputFilename = onlyIds ? `broll-test-${onlyIds.join('_')}.webm` : 'broll-master.webm';
    console.log(`\nRecording ${clips.length} segment(s) in one continuous take -> ${outputFilename}\n`);

    const tempVideoDir = path.join(os.tmpdir(), `vangard-broll-${Date.now()}`);
    const electronApp = await launchAppRecording(productionSettings, tempVideoDir);
    const recordStart = Date.now();

    const manifest = {};
    let captured = 0;
    let failed = 0;
    let page;

    try {
        page = await getMainPage(electronApp);
        await waitForProjectReady(page);

        for (const clip of clips) {
            const num = String(captured + failed + 1).padStart(2);
            process.stdout.write(`  [${num}] ${clip.id.padEnd(34)} (${clip.time}) `);
            try {
                if (clip.setup) await clip.setup(page, electronApp);
                // Everything before this point (window already open, tab
                // switches, dialogs) is real footage in the one continuous
                // recording -- this timestamp marks where the "settled"
                // feature state begins, so assemble_reel.js can start the
                // segment here instead of at the clip's first navigation click.
                const settledStart = (Date.now() - recordStart) / 1000;
                const holdStart = Date.now();
                if (clip.action) await clip.action(page, electronApp);
                const elapsed = Date.now() - holdStart;
                const remaining = Math.max(clip.durationMs - elapsed, 0);
                await page.waitForTimeout(Math.max(remaining, MIN_HOLD_MS));
                if (clip.teardown) await clip.teardown(page, electronApp);
                const segmentEnd = (Date.now() - recordStart) / 1000;

                manifest[clip.id] = {
                    start: Number(settledStart.toFixed(3)),
                    end: Number(segmentEnd.toFixed(3)),
                };
                captured++;
                console.log(`ok (${settledStart.toFixed(2)}s-${segmentEnd.toFixed(2)}s)`);
            } catch (err) {
                failed++;
                console.log(`FAILED: ${err.message.split('\n')[0]}`);
                // A failed setup/teardown can leave a modal open, which would
                // otherwise cascade into every later clip failing too.
                await page.keyboard.press('Escape').catch(() => {});
                await page.keyboard.press('Escape').catch(() => {});
            }
        }
    } finally {
        // See the note on window.electronAPI.forceQuit() below: electron.js's
        // window 'close' handler always intercepts close to ask about unsaved
        // changes, which nothing here answers, so electronApp.close() alone
        // hangs. This is the only close for the whole recording -- it happens
        // once, at the very end, not per clip.
        if (page) {
            await page.evaluate(() => window.electronAPI.forceQuit()).catch(() => {});
            await page.waitForEvent('close', { timeout: 15000 }).catch(() => {});
        }
    }

    const savedPath = page ? await finalizeVideo(page, tempVideoDir, OUT_DIR, outputFilename) : null;
    await electronApp.close().catch(() => {});

    if (savedPath) {
        console.log(`\nRecording saved to ${savedPath}`);
        // A --clip test run's manifest would only have that one clip's offsets
        // in it -- writing it out would wipe the real manifest for every other
        // clip, so only the full run updates manifest.json.
        if (!onlyIds) {
            const manifestPath = path.join(OUT_DIR, 'manifest.json');
            await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
            console.log(`Manifest written to ${manifestPath}`);
        }
    } else {
        console.error('\nNo video was recorded.');
    }
    console.log(`Done: ${captured} captured, ${failed} failed.`);
    if (failed > 0 || !savedPath) process.exit(1);
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
