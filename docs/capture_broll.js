#!/usr/bin/env node
/**
 * capture_broll.js
 *
 * Launches the Vangard Studio Electron app with DemoProject, drives it with
 * Playwright, and records each visual cue in the sizzle reel script
 * (docs/marketing/sizzle-reel-script.md) with a real-time OS-level screen
 * capture (ffmpeg's gdigrab) rather than Playwright's own recordVideo.
 * assemble_reel.js stitches the resulting clips together against the VO
 * track and title cards.
 *
 * Usage:
 *   node docs/capture_broll.js [--project /path] [--out docs/marketing/broll]
 *   node docs/capture_broll.js --clip <id>   # record just one clip, for
 *                                             # testing its setup/selectors --
 *                                             # writes broll-test-<id>.mp4
 *                                             # instead of touching the real
 *                                             # manifest/output files
 *
 * Requirements:
 *   npm install --save-dev playwright
 *   ffmpeg on PATH, or set FFMPEG_PATH (env or docs/marketing/.env, same
 *   loading mechanism as assemble_reel.js/generate_vo.js). Windows only --
 *   gdigrab is a Windows-specific ffmpeg input device.
 *
 * Why not Playwright's recordVideo (two designs tried and abandoned):
 *
 *   1. One continuous take covering every clip, with assemble_reel.js
 *      recovering each clip's boundaries from wall-clock timestamps via a
 *      per-file scale factor (real video duration / wall-clock total). This
 *      assumed the encoder fell behind wall-clock time under CPU load, and
 *      that a single scale factor could correct for it -- but confirmed via
 *      direct frame inspection, the drift wasn't uniform (it got markedly
 *      worse right after a CPU-heavy clip like the Translation Dashboard's
 *      virtualized 900+-string table), so the correction missed the real
 *      boundary by more than ten seconds in a ~3min take. A magenta
 *      flashMarker() beat detected in the decoded video patched over this
 *      for the montage specifically (see git history), but the encoder
 *      unreliably dropped marker frames too.
 *
 *   2. One Electron launch + one recordVideo file per clip (this file's
 *      previous version) -- shrinking the recording window to ~5-12s so
 *      there was no long take for drift to accumulate in. Direct measurement
 *      disproved the assumption underneath this too: Playwright's
 *      recordVideo is driven by Chromium's CDP screencast, which only emits
 *      a new frame when the page actually repaints. A static "hold" --
 *      exactly the shot b-roll needs, showing a settled feature state -- can
 *      produce almost no repaints, so the video's real decoded duration came
 *      out 2-3x shorter than the wall-clock time that actually elapsed
 *      (measured: a 4s static hold produced a 2.44s video; a clip with
 *      continuous mouse movement over the same wall-clock span produced a
 *      4.60s video). This isn't a drift that scales linearly with time --
 *      it's content-dependent frame starvation, worst on the very shots that
 *      matter most, so no offset or scale-factor model can correct for it.
 *
 * gdigrab sidesteps both failure modes structurally: it's an OS-level screen
 * grabber, not a page-repaint-driven screencast, so it captures real frames
 * at a fixed real-time rate regardless of what's changing on screen. Each
 * clip's ffmpeg process starts AFTER clip.setup() has already navigated to
 * the settled state (see the main loop below), so the recorded file *is*
 * the clip -- no post-hoc offset/trim math, no manifest start/end fields, no
 * scale factor. assemble_reel.js just uses each file's own real duration.
 *
 * Each clip still gets its own Electron launch (closed before the next
 * clip starts) rather than reusing one window for the whole run: the
 * exported footage never includes the boot screen (capture starts after
 * setup), so cuts read as cuts either way, and a short cooldown between
 * launches (see LAUNCH_COOLDOWN_MS) keeps repeated relaunches from
 * contending with each other for CPU.
 */

import { _electron as electron } from 'playwright';
import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { spawn, execFile } from 'child_process';
import { promisify } from 'util';
import { APP_ENTRY, suppressFirstRunTutorial } from '../e2e/electron-launch.js';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const require = createRequire(import.meta.url);

for (const envPath of [path.join(__dirname, 'marketing', '.env'), path.join(ROOT, '.env')]) {
    if (existsSync(envPath)) {
        process.loadEnvFile(envPath);
        break;
    }
}

const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';

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
const ONLY_CLIP     = getArg('--clip'); // comma-separated ids also accepted -- ad-hoc test run(s), doesn't touch the real manifest

// The feature montage's clips (see sizzle-reel-script.md's silent montage
// beat) only need to hold ~2.7s each in the final cut (19s split across 7
// clips), so they get a shorter minimum hold than the narrated clips.
const MONTAGE_IDS = new Set([
    '16-montage-screens',
    '17-montage-images',
    '18-montage-scene-compositions',
    '19-montage-snippets',
    '20-montage-menu-templates',
    '21-montage-color-palette',
    '22-montage-drafting-mode',
]);

const VIDEO_SIZE = { width: 1920, height: 1080 };
const FPS = 30;

// Floor on how long each clip's settled feature state holds on screen before
// moving to the next one, so quick actions (e.g. panCanvas) don't read as a
// flash-cut in the final video.
const MIN_HOLD_MS = 4000;
const MIN_HOLD_MS_MONTAGE = 1800;

// Pause after each clip's Electron process closes before the next one
// launches, so the previous process's teardown doesn't contend with the next
// one's boot for CPU.
const LAUNCH_COOLDOWN_MS = 1000;

// gdigrab's window-open/close handshake and ffmpeg's own startup both take a
// beat -- pad both ends of the real capture so the very first/last requested
// frames aren't lost to that latency (better a little extra settled footage
// at each end than missing content; renderClip's tpad already pads the tail
// if a source runs short).
const CAPTURE_STARTUP_MS = 500;
const CAPTURE_SHUTDOWN_MS = 500;

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

/** Clicks through a few Choices Canvas choice pills in sequence to show
 *  progressively walking a route: each pill is a `[data-nav]` element
 *  (ChoiceCanvas.tsx) that re-centers the canvas on the label it targets and
 *  reveals that label's own next choices, so repeated clicks read as
 *  advancing through the story rather than just "here's a canvas". Re-queries
 *  the locator fresh each iteration instead of caching one -- the pill DOM
 *  nodes are replaced, not moved, on every navigation, so a cached locator
 *  would go stale after the first click. Stops early (rather than throwing)
 *  if a route runs out of further choices before `times` clicks. */
async function clickChoicePills(page, times = 2) {
    for (let i = 0; i < times; i++) {
        const pill = page.locator('[aria-label^="Choice:"]:visible').first();
        if (await pill.count() === 0) break;
        await pill.click();
        await page.waitForTimeout(900);
    }
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
        description: 'Pan across Project Canvas to reveal more of the block graph',
        durationMs: 5000,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Project Canvas');
        },
        // Bigger/slower than the other canvases' pans (see panCanvas's
        // defaults) -- this is the very first shot of the reel's app footage,
        // so it needs to travel far enough across the canvas to actually
        // read as "look how much is here", not just a small nudge.
        action: async (page) => panCanvas(page, { dx: -550, dy: -230, steps: 40, holdMs: 35 }),
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
        description: 'Choices Canvas: click through choice pills to walk a route progressively',
        durationMs: 6000,
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Choices Canvas');
            await page.waitForTimeout(600);
            // The canvas opens centered on "start", which just calls into the
            // story and has no menu of its own (no choice pills to click) --
            // jump to a label with a real menu first via the "Jump to Label"
            // search box (same label used by 05-editor-autocomplete /
            // 08-real-renpy-file, for continuity). Flow Canvas has its own
            // identically-placeholdered search input, mounted-but-hidden
            // behind this tab (see CLAUDE.md's Tab Lifecycle note) -- :visible
            // scopes to the active pane's copy.
            await page.locator('input[placeholder="Search labels…"]:visible').fill('stage1_arrival');
            await page.waitForTimeout(300);
            await page.click('button:has-text("stage1_arrival"):visible');
            await page.waitForTimeout(700);
        },
        action: async (page) => clickChoicePills(page, 2),
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

async function launchAppRecording(productionSettings, settingsOverride = {}) {
    const env = { ...process.env, ELECTRON_DISABLE_SECURITY_WARNINGS: '1' };
    env.RENIDE_SETTINGS_OVERRIDE = JSON.stringify({
        ...productionSettings,
        renpyPath: FAKE_RENPY_SDK,
        ...settingsOverride,
    });
    const app = await electron.launch({
        args: [APP_ENTRY, '--project', PROJECT_PATH],
        cwd: ROOT,
        env,
        // No recordVideo here -- see this file's header comment for why
        // footage is captured with gdigrab (startScreenCapture below)
        // instead of Playwright's repaint-driven screencast recording.
    });
    await suppressFirstRunTutorial(app);
    return app;
}

/** Returns the fullscreened window's bounds in *virtual-desktop* coordinates
 *  (gdigrab's -offset_x/-offset_y are relative to the virtual desktop's
 *  top-left, which is above/left of the primary monitor on a multi-monitor
 *  setup with monitors arranged left/above it -- getBounds() already
 *  reports in that same space, so no translation needed). */
async function getMainPage(electronApp) {
    const page = await electronApp.firstWindow();
    const bounds = await electronApp.evaluate(({ BrowserWindow }) => {
        const [win] = BrowserWindow.getAllWindows();
        if (!win) return null;
        win.setFullScreen(true);
        return win.getBounds();
    });
    await page.waitForTimeout(800);
    // getBounds() right after setFullScreen() can still report the
    // pre-fullscreen size on some platforms/timing -- re-read once settled.
    const settledBounds = await electronApp.evaluate(({ BrowserWindow }) => {
        const [win] = BrowserWindow.getAllWindows();
        return win ? win.getBounds() : null;
    });
    return { page, bounds: settledBounds ?? bounds };
}

/** Starts a real-time OS-level screen capture via ffmpeg's gdigrab (Windows
 *  desktop capture) to `outPath`, scoped to the fullscreened app window's
 *  bounds (see getMainPage) via gdigrab's offset/size options -- gdigrab's
 *  bare 'desktop' input grabs the entire VIRTUAL desktop spanning every
 *  monitor, which on a multi-monitor machine produced a single oversized
 *  frame (confirmed: 6400x2160 on a 3-monitor dev box) with the app's window
 *  squeezed into one corner once assemble_reel.js's SCALE_PAD fit that whole
 *  frame into 1920x1080 -- nowhere close to the intended fullscreen shot.
 *  Returns the ffmpeg ChildProcess; stop it with stopScreenCapture. */
function startScreenCapture(outPath, bounds) {
    return spawn(FFMPEG, [
        '-y', '-hide_banner', '-loglevel', 'error',
        '-f', 'gdigrab', '-framerate', String(FPS),
        '-offset_x', String(bounds.x), '-offset_y', String(bounds.y),
        '-video_size', `${bounds.width}x${bounds.height}`,
        '-i', 'desktop',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'veryfast', '-crf', '18',
        outPath,
    ], { stdio: ['pipe', 'ignore', 'pipe'] });
}

/** Stops an ffmpeg capture gracefully by writing 'q' to its stdin (the same
 *  keystroke ffmpeg's interactive console handler listens for) so it
 *  finalizes the output file's container/index properly instead of leaving a
 *  truncated one -- killing the process outright risks exactly the kind of
 *  broken/incomplete file this replaced Playwright's recordVideo to avoid. */
async function stopScreenCapture(proc) {
    await new Promise((resolve) => {
        const timer = setTimeout(() => { proc.kill(); resolve(); }, 5000);
        proc.once('exit', () => { clearTimeout(timer); resolve(); });
        proc.stdin.write('q');
    });
}

/** Real decoded duration of a capture, for the per-clip log line -- same
 *  "decode and read the last time= ffmpeg prints" approach as
 *  assemble_reel.js's realDuration, since ffprobe-style container metadata
 *  isn't reliably present either way. */
async function realDuration(file) {
    const { stderr } = await execFileAsync(FFMPEG, ['-i', file, '-f', 'null', '-']).catch(e => e);
    const matches = [...(stderr || '').matchAll(/time=(\d+):(\d+):(\d+\.\d+)/g)];
    if (matches.length === 0) return null;
    const [, h, m, s] = matches[matches.length - 1];
    return Number(h) * 3600 + Number(m) * 60 + Number(s);
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
    if (clips.length === 0) {
        console.error(`No clips matched --clip "${ONLY_CLIP}"`);
        process.exit(1);
    }

    // A --clip run writes its own broll-test-<id>.webm and is for trying out
    // a clip's setup/selectors in isolation -- it shouldn't touch the real
    // manifest at all.
    const isTest = Boolean(onlyIds);

    console.log(`\nRecording ${clips.length} clip(s), one Electron launch each -> ${OUT_DIR}\n`);

    let captured = 0;
    let failed = 0;

    for (let i = 0; i < clips.length; i++) {
        const clip = clips[i];
        const num = String(i + 1).padStart(2);
        process.stdout.write(`  [${num}] ${clip.id.padEnd(34)} (${clip.time}) `);

        const outputFilename = isTest ? `broll-test-${clip.id}.mp4` : `broll-${clip.id}.mp4`;
        const outPath = path.join(OUT_DIR, outputFilename);
        const electronApp = await launchAppRecording(productionSettings);
        let page;
        let captureProc = null;
        let ok = false;

        try {
            const main = await getMainPage(electronApp);
            page = main.page;
            await waitForProjectReady(page);

            // Setup/navigation runs BEFORE capture starts -- the recorded
            // file only ever contains the settled feature state, never the
            // boot screen or tab-switch transition, so no post-hoc trimming
            // is needed downstream.
            if (clip.setup) await clip.setup(page, electronApp);

            captureProc = startScreenCapture(outPath, main.bounds);
            await page.waitForTimeout(CAPTURE_STARTUP_MS);

            const holdStart = Date.now();
            if (clip.action) await clip.action(page, electronApp);
            const elapsed = Date.now() - holdStart;
            const remaining = Math.max(clip.durationMs - elapsed, 0);
            const minHold = MONTAGE_IDS.has(clip.id) ? MIN_HOLD_MS_MONTAGE : MIN_HOLD_MS;
            await page.waitForTimeout(Math.max(remaining, minHold));

            await page.waitForTimeout(CAPTURE_SHUTDOWN_MS);
            await stopScreenCapture(captureProc);
            captureProc = null;

            // Teardown (e.g. closing a modal) doesn't need to be filmed --
            // it runs after capture has already stopped.
            if (clip.teardown) await clip.teardown(page, electronApp);
            ok = true;
        } catch (err) {
            failed++;
            console.log(`FAILED: ${err.message.split('\n')[0]}`);
        } finally {
            if (captureProc) await stopScreenCapture(captureProc).catch(() => {});
            // electron.js's window 'close' handler always intercepts close to
            // ask about unsaved changes, which nothing here answers, so
            // electronApp.close() alone hangs -- forceQuit() bypasses it.
            if (page) {
                await page.evaluate(() => window.electronAPI.forceQuit()).catch(() => {});
                await page.waitForEvent('close', { timeout: 15000 }).catch(() => {});
            }
        }
        await electronApp.close().catch(() => {});

        const savedOk = ok && existsSync(outPath) && (await fs.stat(outPath)).size > 0;
        if (savedOk) {
            captured++;
            const duration = await realDuration(outPath);
            console.log(`ok (${outputFilename}${duration != null ? `, ${duration.toFixed(2)}s` : ''})`);
            if (!isTest) {
                const manifestPath = path.join(OUT_DIR, 'manifest.json');
                const existing = existsSync(manifestPath)
                    ? JSON.parse(await fs.readFile(manifestPath, 'utf8'))
                    : {};
                existing[clip.id] = { file: outputFilename };
                await fs.writeFile(manifestPath, JSON.stringify(existing, null, 2));
            }
        } else if (ok) {
            failed++;
            console.log('FAILED: no video was recorded');
        }

        // See LAUNCH_COOLDOWN_MS's doc comment -- let this process fully exit
        // before the next one launches, except after the very last clip.
        if (i < clips.length - 1) await new Promise(r => setTimeout(r, LAUNCH_COOLDOWN_MS));
    }

    console.log(isTest ? '' : `\nManifest updated at ${path.join(OUT_DIR, 'manifest.json')}`);
    console.log(`Done: ${captured} captured, ${failed} failed.`);
    if (failed > 0) process.exit(1);
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
