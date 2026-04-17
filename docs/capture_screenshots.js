#!/usr/bin/env node
/**
 * capture_screenshots.js
 *
 * Launches the Ren'IDE Electron app with the DemoProject and uses Playwright
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
// Window constants
// ---------------------------------------------------------------------------
const WIN_WIDTH  = 1440;
const WIN_HEIGHT = 900;

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

/** Click a canvas-type button in the toolbar by partial title text */
async function clickCanvasTab(page, titleFragment) {
    await page.click(`[aria-label="Switch canvas"] button[title*="${titleFragment}"]`);
    await page.waitForTimeout(600);
}

/**
 * Navigate the two-level right sidebar.
 * Top categories: Story | Assets | Compose | Tools
 * Sub-tabs per category:
 *   Story   → Characters, Variables, Screens
 *   Assets  → Images, Audio
 *   Compose → Scenes, ImageMaps, Screen Layouts
 *   Tools   → Snippets, Menus, Colors
 */
async function clickSidebarTab(page, category, subTab) {
    // 1. Click the top-level category
    await page.click(`[aria-label="Story Elements categories"] button:has-text("${category}")`);
    await page.waitForTimeout(300);
    // 2. Click the sub-tab (the sub-tablist aria-label is "<Category> sections")
    if (subTab) {
        await page.click(
            `[aria-label="${category} sections"] button:has-text("${subTab}")`
        );
        await page.waitForTimeout(400);
    }
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
        filename: 'story-elements-characters.png',
        description: 'Right sidebar — Characters sub-tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Story', 'Characters');
        },
    },
    {
        filename: 'story-elements-images.png',
        description: 'Right sidebar — Images sub-tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Assets', 'Images');
        },
    },

    // --- Section 4: Core Features ---
    {
        filename: 'story-canvas-basic.png',
        description: 'Story Canvas',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Story Canvas');
        },
    },
    {
        filename: 'route-canvas-basic.png',
        description: 'Route Canvas',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Route Canvas');
            await page.waitForTimeout(1000);
        },
    },
    {
        filename: 'choice-canvas-basic.png',
        description: 'Choice Canvas',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Choice Canvas');
            await page.waitForTimeout(1000);
        },
    },
    {
        filename: 'diagnostics-panel-full.png',
        description: 'Diagnostics panel',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Story Canvas');
            await page.click('button[title*="Diagnostics"]').catch(() =>
                page.click('button:has-text("Diagnostics")')
            );
            await page.waitForTimeout(800);
        },
    },
    {
        filename: 'search-panel.png',
        description: 'Global search panel',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickCanvasTab(page, 'Story Canvas');
            await page.keyboard.press('Control+Shift+F');
            await page.waitForTimeout(600);
        },
    },

    // --- Section 5: For Writers ---
    {
        filename: 'writer-character-manager.png',
        description: 'Characters tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Story', 'Characters');
        },
    },
    {
        filename: 'writer-variables.png',
        description: 'Variables sub-tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Story', 'Variables');
        },
    },
    {
        filename: 'writer-menu-builder.png',
        description: 'Menus sub-tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Tools', 'Menus');
        },
    },

    // --- Section 6: For Artists ---
    {
        filename: 'artist-images-tab.png',
        description: 'Images sub-tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Assets', 'Images');
        },
    },
    {
        filename: 'artist-audio-tab.png',
        description: 'Audio sub-tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Assets', 'Audio');
        },
    },
    {
        filename: 'artist-scenes-composer.png',
        description: 'Scene Composer tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Compose', 'Scenes');
        },
    },
    {
        filename: 'artist-imagemaps-composer.png',
        description: 'ImageMaps composer tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Compose', 'ImageMaps');
        },
    },
    {
        filename: 'artist-screen-layouts-composer.png',
        description: 'Screen Layouts composer tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Compose', 'Screen Layouts');
        },
    },

    // --- Section 7: For Developers ---
    {
        filename: 'dev-snippets-tab.png',
        description: 'Snippets tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Tools', 'Snippets');
        },
    },
    {
        filename: 'dev-colors-tab.png',
        description: 'Colors (color picker) tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Tools', 'Colors');
        },
    },
    {
        filename: 'dev-screens-tab.png',
        description: 'Screens sub-tab',
        setup: async (page) => {
            await waitForProjectReady(page);
            await clickSidebarTab(page, 'Story', 'Screens');
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
    if (productionSettings) {
        env.RENIDE_SETTINGS_OVERRIDE = JSON.stringify(productionSettings);
    }
    return electron.launch({
        args: [path.join(ROOT, 'electron.js'), ...extraArgs],
        cwd: ROOT,
        env,
    });
}

/** Get the main window and resize the BrowserWindow to a fixed known-good size */
async function getMainPage(electronApp) {
    const page = await electronApp.firstWindow();
    // setViewportSize has no effect in Electron; resize via the BrowserWindow API
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
        await appNoProject.close();
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
