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
 *   node docs/capture_broll.js --group main      # everything except the
 *                                                 # feature montage -> broll-main.webm
 *   node docs/capture_broll.js --group montage   # just the montage clips,
 *                                                 # as their own short take
 *                                                 # (see MONTAGE_IDS below
 *                                                 # for why) -> broll-montage.webm
 *   node docs/capture_broll.js --clip <id>   # record just one clip, for
 *                                             # testing its setup/selectors --
 *                                             # writes broll-test-<id>.webm
 *                                             # instead of touching the real
 *                                             # manifest/output files
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
 * (docs/marketing/broll/manifest.json, one entry per clip, each recording
 * which output file it belongs to) -- assemble_reel.js slices segments out
 * of the relevant recording by those offsets instead of using whole files.
 *
 * Run as two separate --group takes (main, then montage) rather than one
 * ungrouped run covering every clip: assemble_reel.js corrects each
 * recording's offsets with a single global scale factor (Playwright's video
 * encoder drifts from wall-clock time under load), and that correction
 * degrades on a long recording where drift isn't perfectly uniform
 * throughout -- confirmed empirically on a ~3min single take, where the
 * error for clips deep into the recording exceeded ten seconds, enough to
 * land on entirely the wrong clip's footage. Splitting into two shorter
 * takes keeps each one's cumulative drift small. An ungrouped run (no
 * --group) still works and produces one broll-master.webm, but only use it
 * for a short CLIPS list where that drift risk doesn't apply.
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
const ONLY_CLIP     = getArg('--clip'); // comma-separated ids also accepted -- ad-hoc test run, doesn't touch the real manifest
const GROUP         = getArg('--group'); // 'main' | 'montage' -- a real, permanent, named capture (see MONTAGE_IDS below)

// The feature montage's clips (see sizzle-reel-script.md's silent montage
// beat) are captured as their own short take instead of being folded into
// the single long main take: a single global scale factor for offset
// correction (see clipWindow in assemble_reel.js) works well for a ~2min
// take, but broke down for a ~3min one -- drift isn't perfectly uniform
// across a long recording, and by the time the montage clips (deep into a
// long take) were reached, the correction was off by over ten seconds,
// enough to land on the wrong clip's footage entirely. A short, separate
// take for the montage keeps its own cumulative drift small.
const MONTAGE_IDS = new Set([
    '16-montage-screens',
    '17-montage-images',
    '18-montage-scene-compositions',
    '19-montage-snippets',
    '20-montage-menu-templates',
    '21-montage-color-palette',
    '22-montage-drafting-mode',
]);
if (GROUP && !['main', 'montage'].includes(GROUP)) {
    console.error(`--group must be "main" or "montage", got "${GROUP}"`);
    process.exit(1);
}

const VIDEO_SIZE = { width: 1920, height: 1080 };

// Floor on how long each clip's settled feature state holds on screen before
// moving to the next one, so quick actions (e.g. panCanvas) don't read as a
// flash-cut in the final video. Montage clips only need ~2.7s in the final
// cut (19s split across 7 clips) and each already adds ~1.8s of flashMarker
// overhead on top, so they get a shorter floor -- the video encoder was
// observed to degrade badly (frames stop being captured at all, not just
// falling behind) once a montage take ran past ~40-50s, and every second of
// hold time here is a second closer to that cliff.
const MIN_HOLD_MS = 4000;
const MIN_HOLD_MS_MONTAGE = 1800;

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

/** Flashes a solid, distinctive full-viewport color over the app for a beat,
 *  then removes it -- burns an unmistakable marker into the recording at
 *  this exact moment. Used between montage clips (see MONTAGE_IDS) instead
 *  of relying on wall-clock-derived offsets to find clip boundaries: a
 *  single global scale factor for wall-clock-to-real-video drift correction
 *  (see assemble_reel.js) turned out to not be precise enough for clips this
 *  short and tightly packed -- confirmed empirically, misaligned by more
 *  than a full clip's width by the 4th of 7 montage clips. Detecting this
 *  marker's real timestamp directly in the decoded video sidesteps that
 *  drift-estimation problem entirely for the segments where it matters most
 *  (the panel-focus vignette + burned-in label make any misalignment here
 *  immediately obvious, unlike a plain b-roll cut). */
async function flashMarker(page) {
    // Force a couple of real paints before waiting -- appendChild alone
    // doesn't guarantee the browser has actually composited a frame with the
    // marker visible before the timer below starts, and if the video
    // encoder's next capture lands before that first paint, the marker can
    // go completely missing (confirmed: it happened to 2 of 6 markers in a
    // 900ms-flash test with no rAF wait, with zero partial/dim frames of it
    // anywhere in the recording -- not a threshold problem, the frame never
    // existed).
    await page.evaluate(() => {
        const div = document.createElement('div');
        div.id = '__broll_marker__';
        div.style.cssText = 'position:fixed;inset:0;background:#ff00ff;z-index:2147483647;';
        document.body.appendChild(div);
        return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
    // 1.5s, not a quick flash -- same video-encoder frame-drop concern as
    // above; longer markers are more expensive (each adds real recording
    // time) but far more certain to survive.
    await page.waitForTimeout(1500);
    await page.evaluate(() => document.getElementById('__broll_marker__')?.remove());
    await page.waitForTimeout(300);
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
        // First montage clip after 15-localization, which leaves the
        // Translation Dashboard open as the main content tab -- reset back
        // to Project Canvas here so the montage doesn't open on that stale,
        // unrelated screen (subsequent montage clips inherit this since the
        // whole take is one continuous session; only sidebar tabs change).
        id: '16-montage-screens',
        time: '2:19-2:34 (part 1/7)',
        description: 'Screens tab (reset to Project Canvas first)',
        durationMs: 2600,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Project Canvas');
            await clickSidebarTab(page, 'Screens');
        },
    },
    {
        id: '17-montage-images',
        time: '2:19-2:34 (part 2/7)',
        description: 'Images tab',
        durationMs: 2600,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Images');
        },
    },
    {
        id: '18-montage-scene-compositions',
        time: '2:19-2:34 (part 3/7)',
        description: 'Scene Compositions tab',
        durationMs: 2600,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Scene Compositions');
        },
    },
    {
        id: '19-montage-snippets',
        time: '2:19-2:34 (part 4/7)',
        description: 'Code Snippets grid',
        durationMs: 2600,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Code Snippets');
        },
    },
    {
        id: '20-montage-menu-templates',
        time: '2:19-2:34 (part 5/7)',
        description: 'Menu Templates tab',
        durationMs: 2600,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Menu Templates');
        },
    },
    {
        id: '21-montage-color-palette',
        time: '2:19-2:34 (part 6/7)',
        description: 'Color Palette tab',
        durationMs: 2600,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Color Palette');
        },
    },
    {
        id: '22-montage-drafting-mode',
        time: '2:19-2:34 (part 7/7)',
        description: 'Drafting Mode toggle',
        durationMs: 2600,
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
    let clips = CLIPS;
    let outputFilename = 'broll-master.webm';
    if (onlyIds) {
        clips = CLIPS.filter(c => onlyIds.includes(c.id));
        // A --clip run records only those clips, in their own file
        // (broll-test-<ids>.webm) -- it can't "patch" a clip into an existing
        // recording without re-recording everything after it, so it's for
        // testing a clip's setup/selectors in isolation, not fixing one clip
        // in place.
        outputFilename = `broll-test-${onlyIds.join('_')}.webm`;
    } else if (GROUP) {
        clips = CLIPS.filter(c => MONTAGE_IDS.has(c.id) === (GROUP === 'montage'));
        outputFilename = `broll-${GROUP}.webm`;
    }
    if (clips.length === 0) {
        console.error(`No clips matched (--clip "${ONLY_CLIP}" / --group "${GROUP}")`);
        process.exit(1);
    }

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

        for (let i = 0; i < clips.length; i++) {
            const clip = clips[i];
            // See flashMarker's doc comment -- assemble_reel.js locates these
            // in the decoded video to find real clip boundaries for the
            // montage instead of trusting wall-clock-derived offsets.
            if (GROUP === 'montage' && i > 0) await flashMarker(page);
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
                const minHold = GROUP === 'montage' ? MIN_HOLD_MS_MONTAGE : MIN_HOLD_MS;
                await page.waitForTimeout(Math.max(remaining, minHold));
                if (clip.teardown) await clip.teardown(page, electronApp);
                const segmentEnd = (Date.now() - recordStart) / 1000;

                manifest[clip.id] = {
                    start: Number(settledStart.toFixed(3)),
                    end: Number(segmentEnd.toFixed(3)),
                    file: outputFilename,
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
        // A --clip test run writes its own broll-test-*.webm and is for
        // trying out a clip's setup/selectors in isolation -- it shouldn't
        // touch the real manifest at all. A --group (or full, ungrouped) run
        // is a real capture: merge its entries into the existing manifest
        // (each entry records which file it belongs to) rather than
        // overwriting entries from a different group's run.
        if (!onlyIds) {
            const manifestPath = path.join(OUT_DIR, 'manifest.json');
            const existing = existsSync(manifestPath)
                ? JSON.parse(await fs.readFile(manifestPath, 'utf8'))
                : {};
            const merged = { ...existing, ...manifest };
            await fs.writeFile(manifestPath, JSON.stringify(merged, null, 2));
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
