#!/usr/bin/env node
/**
 * capture_screenshots.js
 *
 * Launches the Ren'IDE Electron app with the DemoProject and uses Playwright
 * to capture screenshots for the user guide.
 *
 * Usage:
 *   node docs/capture_screenshots.js [--project /path] [--out docs/images] [--user-data-dir /path]
 *
 * Requirements:
 *   npm install --save-dev playwright
 *
 * Defaults:
 *   --project      ./DemoProject
 *   --out          docs/images
 *   --user-data-dir  auto-detected from platform + package.json productName
 *                    (points to the packaged app's userData so the correct
 *                     theme and layout settings are used)
 */

import { _electron as electron } from 'playwright';
import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

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

const PROJECT_PATH  = getArg('--project')       ?? path.join(ROOT, 'DemoProject');
const OUT_DIR       = getArg('--out')            ?? path.join(__dirname, 'images');

// Auto-detect the packaged app's userData directory so Playwright uses the
// same theme / layout preferences as when you run the installed app manually.
// The productName from package.json is "Ren'IDE".
function getProductionUserDataDir() {
    const pkg = require(path.join(ROOT, 'package.json'));
    const productName = pkg.build?.productName ?? pkg.name;
    switch (process.platform) {
        case 'win32':
            return path.join(
                process.env.APPDATA ?? path.join(os.homedir(), 'AppData', 'Roaming'),
                productName
            );
        case 'darwin':
            return path.join(os.homedir(), 'Library', 'Application Support', productName);
        default:
            return path.join(
                process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), '.config'),
                productName
            );
    }
}

const USER_DATA_DIR = getArg('--user-data-dir') ?? getProductionUserDataDir();

// ---------------------------------------------------------------------------
// Window constants
// ---------------------------------------------------------------------------
const WIN_WIDTH  = 1440;
const WIN_HEIGHT = 900;

// ---------------------------------------------------------------------------
// Screenshot manifest
// ---------------------------------------------------------------------------

/** Wait for settings to be loaded and both loading/analysis overlays to clear */
async function waitForReady(page) {
    // 1. App settings loaded — theme and sidebar prefs are applied
    await page.waitForSelector('[data-app-ready="true"]', { timeout: 15000 });
    // 2. Project load overlay gone
    await page.waitForSelector('[data-loading]', { state: 'detached', timeout: 45000 });
    // 3. Analysis overlay gone
    await page.waitForSelector('[data-analyzing]', { state: 'detached', timeout: 60000 });
    // 4. Brief stabilisation so canvas layout and animations settle
    await page.waitForTimeout(800);
}

/** Click a toolbar canvas-tab button by partial title text */
async function clickCanvasTab(page, titleFragment) {
    await page.click(`[data-tutorial="canvas-tabs"] button[title*="${titleFragment}"]`);
    await page.waitForTimeout(600);
}

/** Click a right-sidebar tab by visible label */
async function clickSidebarTab(page, label) {
    await page.click(
        `[data-tutorial="story-elements"] [role="tablist"] button:has-text("${label}")`
    );
    await page.waitForTimeout(500);
}

const SCREENSHOTS = [
    // --- Section 2: Getting Started ---
    {
        filename: 'welcome-screen.png',
        description: 'Welcome screen before any project is open',
        welcomeOnly: true,
    },
    {
        filename: 'project-opened.png',
        description: 'Main UI immediately after opening a project',
        setup: async (page) => { await waitForReady(page); },
        waitFor: '[data-tutorial="story-canvas"]',
    },

    // --- Section 3: Interface Overview ---
    {
        filename: 'story-elements-characters.png',
        description: 'Right sidebar — Characters tab',
        setup: async (page) => {
            await waitForReady(page);
            await clickSidebarTab(page, 'Characters');
        },
    },
    {
        filename: 'story-elements-images.png',
        description: 'Right sidebar — Images tab',
        setup: async (page) => {
            await waitForReady(page);
            await clickSidebarTab(page, 'Images');
        },
    },

    // --- Section 4: Core Features ---
    {
        filename: 'story-canvas-basic.png',
        description: 'Story Canvas showing project file blocks',
        setup: async (page) => {
            await waitForReady(page);
            await clickCanvasTab(page, 'Story Canvas');
        },
        waitFor: '[data-tutorial="story-canvas"]',
    },
    {
        filename: 'route-canvas-basic.png',
        description: 'Route Canvas — label-level control flow graph',
        setup: async (page) => {
            await waitForReady(page);
            await clickCanvasTab(page, 'Route Canvas');
            await page.waitForTimeout(1000);
        },
    },
    {
        filename: 'choice-canvas-basic.png',
        description: 'Choice Canvas — player-visible choice tree',
        setup: async (page) => {
            await waitForReady(page);
            await clickCanvasTab(page, 'Choice Canvas');
            await page.waitForTimeout(1000);
        },
    },
    {
        filename: 'diagnostics-panel-full.png',
        description: 'Diagnostics panel',
        setup: async (page) => {
            await waitForReady(page);
            await page.click('button[title*="Diagnostics"]');
            await page.waitForTimeout(800);
        },
    },
    {
        filename: 'search-panel.png',
        description: 'Global search panel',
        setup: async (page) => {
            await waitForReady(page);
            // Return to canvas first so search overlays it cleanly
            await clickCanvasTab(page, 'Story Canvas');
            await page.keyboard.press('Control+Shift+F');
            await page.waitForTimeout(600);
        },
    },

    // --- Section 5: For Writers ---
    {
        filename: 'writer-character-manager.png',
        description: 'Characters tab with characters listed',
        setup: async (page) => {
            await waitForReady(page);
            await clickSidebarTab(page, 'Characters');
        },
    },
    {
        filename: 'writer-menu-builder.png',
        description: 'Menu Builder / Menus tab',
        setup: async (page) => {
            await waitForReady(page);
            await clickSidebarTab(page, 'Menus');
        },
    },

    // --- Section 6: For Artists ---
    {
        filename: 'artist-images-tab.png',
        description: 'Image Asset Manager',
        setup: async (page) => {
            await waitForReady(page);
            await clickSidebarTab(page, 'Images');
        },
    },
    {
        filename: 'artist-audio-tab.png',
        description: 'Audio Asset Manager',
        setup: async (page) => {
            await waitForReady(page);
            await clickSidebarTab(page, 'Audio');
        },
    },
    {
        filename: 'artist-composers-tab.png',
        description: 'Composers tab',
        setup: async (page) => {
            await waitForReady(page);
            await clickSidebarTab(page, 'Composers');
        },
    },

    // --- Section 7: For Developers ---
    {
        filename: 'dev-snippets-tab.png',
        description: 'Snippets tab',
        setup: async (page) => {
            await waitForReady(page);
            await clickSidebarTab(page, 'Snippets');
        },
    },
    {
        filename: 'dev-screens-tab.png',
        description: 'Screens tab',
        setup: async (page) => {
            await waitForReady(page);
            await clickSidebarTab(page, 'Screens');
        },
    },
    {
        filename: 'stats-panel.png',
        description: 'Project statistics',
        setup: async (page) => {
            await waitForReady(page);
            // Stats may be in the toolbar or a menu; try toolbar button first
            const statsBtn = page.locator('button[title*="Stats"], button[title*="Statistics"]');
            if (await statsBtn.count() > 0) {
                await statsBtn.first().click();
                await page.waitForTimeout(1000);
            }
        },
    },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function ensureDir(dir) {
    await fs.mkdir(dir, { recursive: true });
}

async function launchApp(extraArgs = []) {
    const electronApp = await electron.launch({
        args: [
            path.join(ROOT, 'electron.js'),
            '--user-data-dir', USER_DATA_DIR,
            ...extraArgs,
        ],
        cwd: ROOT,
        env: {
            ...process.env,
            ELECTRON_DISABLE_SECURITY_WARNINGS: '1',
        },
    });
    return electronApp;
}

/** Get the first window and resize the BrowserWindow to a known good size */
async function getMainPage(electronApp) {
    const page = await electronApp.firstWindow();

    // Resize the actual BrowserWindow — setViewportSize has no effect in Electron
    await electronApp.evaluate(({ BrowserWindow }) => {
        const [win] = BrowserWindow.getAllWindows();
        if (win) {
            win.setContentSize(1440, 900, false);
            win.center();
        }
    });

    return page;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
    if (!existsSync(PROJECT_PATH)) {
        console.error(`Project not found: ${PROJECT_PATH}`);
        console.error('Pass --project /path/to/renpyproject or ensure DemoProject exists.');
        process.exit(1);
    }

    await ensureDir(OUT_DIR);
    console.log(`Saving screenshots to:  ${OUT_DIR}`);
    console.log(`Using project:          ${PROJECT_PATH}`);
    console.log(`Using userData:         ${USER_DATA_DIR}`);
    if (!existsSync(USER_DATA_DIR)) {
        console.warn(`  WARNING: userData dir not found — app will use defaults (theme may differ)`);
    }

    // --- Welcome screen (no project, no user-data-dir needed) ---
    const welcomeEntry = SCREENSHOTS.find(s => s.welcomeOnly);
    if (welcomeEntry) {
        console.log(`\n  [welcome] ${welcomeEntry.filename}`);
        const appNoProject = await launchApp([]);
        const page = await getMainPage(appNoProject);
        // Wait for settings to load so the correct theme is shown
        await page.waitForSelector('[data-app-ready="true"]', { timeout: 15000 });
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(OUT_DIR, welcomeEntry.filename) });
        await appNoProject.close();
        console.log(`    saved.`);
    }

    // --- All other screenshots with a loaded project ---
    const electronApp = await launchApp(['--project', PROJECT_PATH]);
    const page = await getMainPage(electronApp);

    let captured = 0;
    let failed = 0;

    for (const entry of SCREENSHOTS) {
        if (entry.welcomeOnly) continue;

        process.stdout.write(`  [${String(captured + failed + 1).padStart(2)}] ${entry.filename} ... `);
        try {
            if (entry.setup) await entry.setup(page);
            if (entry.waitFor) {
                await page.waitForSelector(entry.waitFor, { timeout: 10000 });
            }

            const outPath = path.join(OUT_DIR, entry.filename);
            await page.screenshot({ path: outPath });
            captured++;
            console.log('ok');
        } catch (err) {
            failed++;
            console.log(`FAILED: ${err.message.split('\n')[0]}`);
        }
    }

    await electronApp.close();

    console.log(`\nDone: ${captured} captured, ${failed} failed.`);
    if (failed > 0) process.exit(1);
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
