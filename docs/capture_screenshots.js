#!/usr/bin/env node
/**
 * capture_screenshots.js
 *
 * Launches the Vangard Studio Electron app with the DemoProject and uses Playwright
 * to capture screenshots for the user guide.
 *
 * Usage:
 *   node docs/capture_screenshots.js [--project /path] [--out docs/images]
 *
 * Requirements:
 *   npm install --save-dev playwright
 *
 * The script auto-detects the production app's app-settings.json and injects
 * it via RENIDE_SETTINGS_OVERRIDE so the correct theme and layout are used.
 */

import { _electron as electron } from 'playwright';
import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { APP_ENTRY, forceExit, suppressFirstRunTutorial } from '../e2e/electron-launch.js';

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
const OUT_DIR      = getArg('--out')     ?? path.join(__dirname, 'images');

// ---------------------------------------------------------------------------
// Load production app settings for theme/layout consistency
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
        console.warn(`  Screenshots will use default theme. Run the installed app first to save settings.`);
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
// Wait helpers
// ---------------------------------------------------------------------------

/**
 * Wait for the project to be fully loaded AND initial analysis complete.
 * data-project-ready="true" is set on the root div only when
 * !isLoading && !isInitialAnalysisPending && !!projectRootPath.
 */
async function waitForProjectReady(page) {
    await page.waitForSelector('[data-project-ready="true"]', { timeout: 90000 });
    await page.waitForTimeout(700);
}

/**
 * Wait for app settings to have loaded (theme and layout prefs applied).
 * data-app-ready="true" is set on the root div once appSettingsLoaded is true.
 */
async function waitForAppReady(page) {
    await page.waitForSelector('[data-app-ready="true"]', { timeout: 15000 });
    await page.waitForTimeout(300);
}

// ---------------------------------------------------------------------------
// Navigation helpers
// ---------------------------------------------------------------------------

/** Click a canvas-switcher button in the toolbar by its exact aria-label
 *  (one of "Project Canvas", "Flow Canvas", "Choices Canvas"). */
async function clickCanvasTab(page, ariaLabel) {
    await page.click(`[aria-label="Switch canvas"] button[aria-label="${ariaLabel}"]`);
    await page.waitForTimeout(600);
}

/**
 * Click a Story Elements sidebar tab by its exact aria-label. The sidebar is a
 * single flat tablist — one of Characters, Variables, Screens, Images, Audio,
 * Scene Compositions, Image Maps, Code Snippets, Menu Templates, Color Palette.
 */
async function clickSidebarTab(page, tooltip) {
    await page.click(`[role="tablist"][aria-label="Story Elements"] button[aria-label="${tooltip}"]`);
    await page.waitForTimeout(400);
}

// ---------------------------------------------------------------------------
// Screenshot manifest
// ---------------------------------------------------------------------------
const SCREENSHOTS = [
    // --- Welcome screen (no project) — handled separately ---
    { filename: 'welcome-screen.png', welcomeOnly: true },

    // --- Section 2: Getting Started ---
    {
        filename: 'project-opened.png',
        description: 'Main UI immediately after opening a project',
        setup: async (page) => { await waitForProjectReady(page); },
    },

    // --- Section 3: Interface ---
    {
        filename: 'app-layout.png',
        description: 'Full application layout with Project Canvas visible',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Project Canvas');
        },
    },
    {
        filename: 'story-elements-characters.png',
        description: 'Right sidebar — Characters tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Characters');
        },
    },
    {
        filename: 'story-elements-images.png',
        description: 'Right sidebar — Images tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Images');
        },
    },

    // --- Section 4: Core Features ---
    {
        filename: 'code-editor.png',
        description: 'Monaco editor with a Ren\'Py script open',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Project Canvas');
            // DemoProject has 72 files — "Fit all to screen" zooms out so far that
            // blocks (and buttons inside them) shrink to sub-pixel size and become
            // unclickable. Use Go to Label instead: it centers the target block at
            // a readable zoom regardless of project size, then double-click the
            // block itself to open it in the editor.
            await page.keyboard.press('Control+g');
            await page.waitForSelector('[role="dialog"][aria-labelledby="goto-modal-title"]', { timeout: 5000 });
            await page.keyboard.type('stage1_arrival');
            await page.waitForTimeout(400);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(600);
            await page.dblclick('[data-block-id]:has-text("stage1_arrival.rpy")');
            await page.waitForSelector('.monaco-editor', { timeout: 8000 });
            await page.waitForTimeout(600);
        },
    },
    {
        filename: 'story-canvas-basic.png',
        description: 'Project Canvas',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Project Canvas');
        },
    },
    {
        filename: 'route-canvas-basic.png',
        description: 'Flow Canvas',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Flow Canvas');
            await page.waitForTimeout(1000);
        },
    },
    {
        filename: 'choice-canvas-basic.png',
        description: 'Choices Canvas',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Choices Canvas');
            await page.waitForTimeout(1000);
        },
    },
    {
        filename: 'diagnostics-panel-full.png',
        description: 'Diagnostics panel',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Project Canvas');
            await page.click('button[aria-label="Diagnostics"]');
            await page.waitForTimeout(800);
        },
    },
    {
        filename: 'search-panel.png',
        description: 'Global search panel',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Project Canvas');
            // Ctrl+Shift+F is registered as an Electron menu accelerator, not a page
            // keydown listener — Playwright's page.keyboard.press() dispatches a DOM
            // event that doesn't reliably trigger it. Click the left-sidebar "Search"
            // tab directly instead. Uses a locator (not page.click, which silently
            // clicks the first match on an ambiguous selector) since exact button
            // name matching needs strict-mode ambiguity checking to be trustworthy.
            await page.getByRole('button', { name: 'Search', exact: true }).click();
            await page.waitForTimeout(600);
        },
    },
    {
        filename: 'project-statistics.png',
        description: 'Project statistics panel',
        setup: async (page) => {
            await waitForProjectReady(page);
            await page.click('button[aria-label="Script Statistics"]');
            await page.waitForSelector('h1:has-text("Script Statistics")', { timeout: 8000 });
            await page.waitForTimeout(600);
        },
    },
    {
        filename: 'translation-dashboard.png',
        description: 'Translation Dashboard',
        setup: async (page) => {
            await waitForProjectReady(page);
            await page.click('button[aria-label="Translation Dashboard"]');
            await page.waitForSelector('button:has-text("Generate Translations")', { timeout: 8000 });
            await page.waitForTimeout(600);
        },
    },
    {
        filename: 'settings-modal.png',
        description: 'Settings modal — themes and editor preferences',
        setup: async (page) => {
            await waitForProjectReady(page);
            await page.click('button[aria-label="Settings"]');
            await page.waitForSelector('[aria-labelledby="settings-modal-title"]', { timeout: 5000 });
            await page.waitForTimeout(500);
        },
        teardown: async (page) => {
            await page.keyboard.press('Escape');
            await page.waitForSelector('[aria-labelledby="settings-modal-title"]', { state: 'detached', timeout: 5000 });
        },
    },
    {
        filename: 'drafting-mode-toolbar.png',
        description: 'Toolbar with Drafting Mode enabled',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Project Canvas');
            // DemoProject ships with draftingMode: true in project.ide.json, but
            // don't assume that -- toggle on only if it isn't already, and leave
            // state exactly as found either way (no teardown that could diverge
            // from the committed DemoProject settings).
            const enableButton = page.locator('button[aria-label="Enable Drafting Mode"]');
            if (await enableButton.count() > 0) {
                await enableButton.click();
            }
            await page.waitForSelector('button[aria-label="Disable Drafting Mode"]', { timeout: 5000 });
            await page.waitForTimeout(400);
        },
    },
    {
        filename: 'markdown-preview.png',
        description: 'Rendered Markdown preview of a project document',
        setup: async (page) => {
            await waitForProjectReady(page);
            // An earlier capture step switches the left sidebar to the Search
            // tab; the file tree (and DEMO_SUMMARY.md within it) is only
            // rendered under the Explorer tab.
            await page.getByRole('button', { name: 'Explorer', exact: true }).click();
            await page.dblclick('span:text-is("DEMO_SUMMARY.md")');
            await page.waitForSelector('.markdown-body', { timeout: 8000 });
            await page.waitForTimeout(500);
        },
    },

    // --- Section 5: For Writers ---
    {
        filename: 'writer-character-manager.png',
        description: 'Character editor tab for Maya',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Characters');
            // Click the pencil icon for Maya to open her character editor tab
            await page.click(
                'div[title="Drag to insert dialogue · Double-click to edit"]:has-text("Maya") button[aria-label="Edit character"]'
            );
            await page.waitForTimeout(800);
        },
    },
    {
        filename: 'writer-variables.png',
        description: 'Variables tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Variables');
        },
    },
    {
        filename: 'writer-menu-builder.png',
        description: 'Menu Templates tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Menu Templates');
        },
    },
    {
        filename: 'menu-editor-modal.png',
        description: 'Menu editor modal (new menu)',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Menu Templates');
            // Click + New to open the menu constructor modal
            await page.click('h2:has-text("Menu Templates") ~ button:has-text("+ New")');
            await page.waitForSelector('[role="dialog"][aria-labelledby="menu-constructor-title"]', { timeout: 8000 });
            await page.waitForTimeout(600);
        },
        teardown: async (page) => {
            // Dismiss the modal
            await page.click('[role="dialog"][aria-labelledby="menu-constructor-title"] button:has-text("Cancel")');
            await page.waitForSelector('[role="dialog"][aria-labelledby="menu-constructor-title"]', { state: 'detached', timeout: 5000 });
        },
    },

    // --- Section 6: For Artists ---
    {
        filename: 'artist-images-tab.png',
        description: 'Images tab with an image opened',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Images');
            await page.waitForTimeout(600); // let thumbnails load
            // Filter to a single unique match first — the images grid is virtualized
            // (so an unfiltered scroll position can hide the target thumbnail) and a
            // bare `img[alt="h.png"]` selector risks matching an unrelated character
            // avatar elsewhere on the page. Filtering guarantees exactly one match.
            await page.fill('input[placeholder*="Search images by name"]', 'h.png');
            await page.waitForTimeout(400);
            // `> img` (direct-child) matters: a plain `div:has(img[alt=...])` matches
            // every ancestor container too (grid, panel, sidebar), and page.dblclick()
            // silently double-clicks the first (outermost) match instead of erroring,
            // so a loose selector here "succeeds" while clicking the wrong element.
            await page.dblclick('div:has(> img[alt="h.png"])');
            await page.waitForTimeout(800);
        },
    },
    {
        filename: 'artist-audio-tab.png',
        description: 'Audio tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Audio');
        },
    },
    {
        filename: 'artist-scenes-composer.png',
        description: 'Scene Composer tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Scene Compositions');
            // Click the "Garden" scene to open it in the composer
            await page.click('li p.font-semibold:has-text("Garden")');
            // Wait for the SceneComposer tab to render (unique heading in SceneComposer)
            await page.waitForSelector('h3:has-text("Layers")', { timeout: 8000 });
            await page.waitForTimeout(800);
        },
    },
    {
        filename: 'artist-imagemaps-composer.png',
        description: 'Image Maps composer tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Image Maps');
            // Click "Imagemap_1" to open it in the composer
            await page.click('li p.font-semibold:has-text("Imagemap_1")');
            // Wait for ImageMapComposer canvas to render
            await page.waitForSelector('.cursor-crosshair', { timeout: 8000 });
            await page.waitForTimeout(800);
        },
    },
    // NOTE: 'artist-screen-layouts-composer.png' was removed — the Screen Layout
    // Composer flow this relied on (Compose > Screen Layouts > "+ New") no longer
    // exists in the current UI (StoryElementsPanel's sidebar is now a flat tablist
    // with a read-only "Screens" tab; no reachable trigger for a Screen Layout
    // Composer tab was found anywhere in src/). Needs a product decision before
    // this screenshot can be restored.

    // --- Section 7: For Developers ---
    {
        filename: 'dev-snippets-tab.png',
        description: 'Code Snippets tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Code Snippets');
        },
    },
    {
        filename: 'dev-colors-tab.png',
        description: 'Color Palette tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Color Palette');
        },
    },
    {
        filename: 'dev-screens-tab.png',
        description: 'Screens tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Screens');
        },
    },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function ensureDir(dir) {
    await fs.mkdir(dir, { recursive: true });
}

async function launchApp(productionSettings, extraArgs = []) {
    const env = { ...process.env, ELECTRON_DISABLE_SECURITY_WARNINGS: '1' };
    // Always suppress the legacy-migration modal: it fires on an async main-process
    // check whose timing isn't fixed like the tutorial modal's, so it can pop up at
    // an unpredictable point in a long capture run rather than always up front —
    // and without a saved production app-settings.json (e.g. in CI), nothing else
    // would set this flag.
    env.RENIDE_SETTINGS_OVERRIDE = JSON.stringify({
        ...productionSettings,
        legacyMigrationChecked: true,
    });
    const app = await electron.launch({
        args: [APP_ENTRY, ...extraArgs],
        cwd: ROOT,
        env,
    });
    // Must run before the first window is created — the tutorial modal's
    // mount-time check would otherwise race a page-level init script.
    await suppressFirstRunTutorial(app);
    return app;
}

/** Get the main window and go full screen before taking any snapshots */
async function getMainPage(electronApp) {
    const page = await electronApp.firstWindow();
    // setViewportSize has no effect in Electron; use the BrowserWindow API instead
    await electronApp.evaluate(({ BrowserWindow }) => {
        const [win] = BrowserWindow.getAllWindows();
        if (win) win.setFullScreen(true);
    });
    // Wait for the full-screen transition to complete
    await page.waitForTimeout(800);
    return page;
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
    console.log(`\nSaving screenshots to: ${OUT_DIR}`);
    console.log(`Using project:         ${PROJECT_PATH}`);

    const productionSettings = loadProductionSettings();

    // --- Welcome screen (no project loaded) ---
    const welcomeEntry = SCREENSHOTS.find(s => s.welcomeOnly);
    if (welcomeEntry) {
        console.log(`\n  [welcome] ${welcomeEntry.filename}`);
        const appNoProject = await launchApp(productionSettings);
        const page = await getMainPage(appNoProject);
        await waitForAppReady(page);
        await page.waitForTimeout(600);
        await page.screenshot({ path: path.join(OUT_DIR, welcomeEntry.filename) });
        await forceExit(appNoProject);
        console.log(`    saved.`);
    }

    // --- All other screenshots with a loaded project ---
    console.log('');
    const electronApp = await launchApp(productionSettings, ['--project', PROJECT_PATH]);
    const page = await getMainPage(electronApp);

    let captured = 0;
    let failed = 0;

    for (const entry of SCREENSHOTS) {
        if (entry.welcomeOnly) continue;

        const num = String(captured + failed + 1).padStart(2);
        process.stdout.write(`  [${num}] ${entry.filename.padEnd(40)} `);
        try {
            if (entry.setup) await entry.setup(page);
            await page.screenshot({ path: path.join(OUT_DIR, entry.filename) });
            if (entry.teardown) await entry.teardown(page);
            captured++;
            console.log('ok');
        } catch (err) {
            failed++;
            console.log(`FAILED: ${err.message.split('\n')[0]}`);
        }
    }

    await forceExit(electronApp);

    console.log(`\nDone: ${captured} captured, ${failed} failed.`);
    if (failed > 0) process.exit(1);
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
