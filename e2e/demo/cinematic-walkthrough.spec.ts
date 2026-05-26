/**
 * Cinematic product demo walkthrough — Ren'Py IDE v1.0.0
 *
 * A single, flowing Playwright session that visits every major feature area.
 * Designed for screen-capture recordings; add a music track afterwards to
 * produce the release trailer.
 *
 * Run with video recording:
 *   npx playwright test -c playwright.demo.config.ts
 *
 * Convert the output .webm to MP4:
 *   ffmpeg -i e2e/demo-recordings/<hash>/video.webm -c:v libx264 demo.mp4
 *
 * The demo project (e2e/fixtures/demo-project) is a five-file visual novel
 * named "Aethoria Chronicles".  It provides characters, branching menus,
 * multiple labels, and intentional missing-image references so every panel
 * has something interesting to display.
 */

import { test as base, _electron as electron } from 'playwright/test';
import type { ElectronApplication, Locator, Page } from 'playwright/test';
import { expect } from 'playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';

// ── Paths ─────────────────────────────────────────────────────────────────────

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const APP_ENTRY  = path.join(__dirname, '..', '..', 'electron.js');
const DEMO_PROJECT = path.join(__dirname, '..', 'fixtures', 'demo-project');

// ── Fixture ───────────────────────────────────────────────────────────────────

type Fixtures = { electronApp: ElectronApplication; window: Page };

/* eslint-disable react-hooks/rules-of-hooks, no-empty-pattern */
const test = base.extend<Fixtures>({
  electronApp: async ({}, use) => {
    const app = await electron.launch({
      args: [APP_ENTRY, '--project', DEMO_PROJECT],
    });
    await use(app);
    await app.evaluate(({ app: a }) => a.exit(0)).catch(() => {});
  },
  window: async ({ electronApp }, use) => {
    const page = await electronApp.firstWindow();
    await page.waitForLoadState('domcontentloaded');
    await use(page);
  },
});
/* eslint-enable react-hooks/rules-of-hooks, no-empty-pattern */

// ── Cinematic helpers ─────────────────────────────────────────────────────────

/** Short breath between beats */
const beat = (p: Page, ms = 750) => p.waitForTimeout(ms);

/** Longer hold — lets the viewer absorb an important frame */
const hold = (p: Page, ms = 1700) => p.waitForTimeout(ms);

/** Smooth arc of the mouse cursor to (x, y) */
const glide = (p: Page, x: number, y: number, steps = 45) =>
  p.mouse.move(x, y, { steps });

/** Centre (x, y) of a locator; safe fallback when element isn't laid out */
async function midpoint(loc: Locator): Promise<[number, number]> {
  const box = await loc.boundingBox();
  return box ? [box.x + box.width / 2, box.y + box.height / 2] : [640, 400];
}

/** Smooth wheel-zoom around a canvas point */
async function smoothZoom(
  p: Page,
  x: number,
  y: number,
  totalDelta: number,
  steps = 14,
) {
  await p.mouse.move(x, y);
  const chunk = totalDelta / steps;
  for (let i = 0; i < steps; i++) {
    await p.mouse.wheel(0, chunk);
    await p.waitForTimeout(28);
  }
}

/** Pan a named canvas using middle-mouse drag */
async function panCanvas(
  p: Page,
  ariaLabel: string,
  dx: number,
  dy: number,
  durationSteps = 55,
) {
  const canvas = p.locator(`[aria-label="${ariaLabel}"]`).first();
  const box = await canvas.boundingBox();
  if (!box) return;
  const ox = box.x + box.width / 2;
  const oy = box.y + box.height / 2;
  await p.mouse.move(ox, oy);
  await p.mouse.down({ button: 'middle' });
  await p.mouse.move(ox + dx, oy + dy, { steps: durationSteps });
  await p.mouse.up({ button: 'middle' });
}

/**
 * Fire-and-forget an optional interaction.
 * If the element isn't present or the action throws, the demo continues.
 */
async function attempt(action: () => Promise<void>): Promise<void> {
  try {
    await action();
  } catch {
    // UI element not present in this run — skip gracefully
  }
}

// ── The walkthrough ───────────────────────────────────────────────────────────

test.describe('cinematic demo', () => {
  // The whole walkthrough runs as a single continuous Playwright session.
  // 10-minute ceiling — the actual run is roughly 3-4 minutes.
  test.setTimeout(600_000);

  test('Ren\'Py IDE — full feature walkthrough', async ({ window: page }) => {
    const vp = page.viewportSize() ?? { width: 1280, height: 800 };
    const midX = Math.round(vp.width / 2);
    const midY = Math.round(vp.height / 2);

    // ─────────────────────────────────────────────────────────────────────────
    // ACT I · The Project Canvas
    // Five script files load as draggable blocks on a dark canvas.
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT I — project loads and canvas populates', async () => {
      // Wait generously — analysis worker needs to complete its first pass
      await expect(page.locator('[data-block-id]').first()).toBeVisible({
        timeout: 45_000,
      });
      await hold(page, 2500);
    });

    await test.step('slow pan across the full canvas', async () => {
      await glide(page, midX, midY, 40);
      await beat(page, 900);
      await panCanvas(page, 'Story canvas', -220, 0);
      await beat(page);
      await panCanvas(page, 'Story canvas', 220, 0);
      await hold(page);
    });

    await test.step('zoom into the start block and back out', async () => {
      const startBlock = page.locator('[data-block-id]').first();
      const [bx, by] = await midpoint(startBlock);
      await glide(page, bx, by, 40);
      await beat(page, 700);
      await smoothZoom(page, bx, by, -380, 14); // zoom in
      await hold(page);
      await smoothZoom(page, bx, by,  380, 14); // zoom back out
      await hold(page);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT II · Monaco Editor — syntax highlighted Ren'Py code
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT II — double-click a block to open Monaco editor', async () => {
      const block = page.locator('[data-block-id]').first();
      const [bx, by] = await midpoint(block);
      await glide(page, bx, by, 35);
      await beat(page, 700);
      await block.dblclick();
      await expect(page.locator('.monaco-editor').first()).toBeVisible({
        timeout: 12_000,
      });
      await hold(page, 2000);
    });

    await test.step('scroll through the code — syntax colouring on show', async () => {
      const editor = page.locator('.monaco-editor').first();
      const box = await editor.boundingBox();
      if (box) {
        const ex = box.x + box.width / 2;
        const ey = box.y + 80;
        await glide(page, ex, ey, 30);
        await beat(page, 500);
        for (let i = 0; i < 7; i++) {
          await page.mouse.wheel(0, 85);
          await page.waitForTimeout(120);
        }
        await hold(page, 1200);
        for (let i = 0; i < 7; i++) {
          await page.mouse.wheel(0, -85);
          await page.waitForTimeout(120);
        }
        await beat(page);
      }
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT III · Flow Canvas — the narrative graph
    // Every label becomes a node; jumps become bezier edges.
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT III — switch to Flow Canvas', async () => {
      const switcher = page.locator('[aria-label="Switch canvas"]');
      const flowBtn  = switcher.getByRole('button').nth(1);
      const [fx, fy] = await midpoint(flowBtn);
      await glide(page, fx, fy, 30);
      await beat(page, 600);
      await flowBtn.hover();
      await beat(page, 500);
      await flowBtn.click();
      await expect(page.locator('[aria-label="Route canvas"]')).toBeVisible({
        timeout: 12_000,
      });
      await hold(page, 2200);
    });

    await test.step('explore the narrative flow graph', async () => {
      await glide(page, midX, midY, 35);
      await beat(page);
      await panCanvas(page, 'Route canvas', -180, 0);
      await hold(page, 1200);
      await panCanvas(page, 'Route canvas',  200, -50);
      await hold(page, 1200);
    });

    await attempt(async () => {
      const fitBtn = page.getByLabel('Fit all to screen');
      await fitBtn.waitFor({ state: 'visible', timeout: 3_000 });
      const [fx, fy] = await midpoint(fitBtn);
      await glide(page, fx, fy, 25);
      await beat(page, 500);
      await fitBtn.click();
      await hold(page);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT IV · Choices Canvas — the decision tree
    // Four-column layout: parents → labels → choice pills → targets.
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT IV — switch to Choices Canvas', async () => {
      const switcher   = page.locator('[aria-label="Switch canvas"]');
      const choicesBtn = switcher.getByRole('button').nth(2);
      const [cx2, cy2] = await midpoint(choicesBtn);
      await glide(page, cx2, cy2, 30);
      await beat(page, 600);
      await choicesBtn.hover();
      await beat(page, 500);
      await choicesBtn.click();
      await expect(
        page.locator('[aria-label="Walkthrough debugger canvas"]'),
      ).toBeVisible({ timeout: 12_000 });
      await hold(page, 2500);
    });

    await test.step('hover over a choice pill', async () => {
      await attempt(async () => {
        const pill = page.getByRole('button', { name: /Choice:/i }).first();
        await pill.waitFor({ state: 'visible', timeout: 4_000 });
        const [px, py] = await midpoint(pill);
        await glide(page, px, py, 30);
        await hold(page, 1200);
      });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT V · Story Elements sidebar
    // Characters, variables, snippets — everything a writer needs.
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT V — return to Project Canvas', async () => {
      const switcher  = page.locator('[aria-label="Switch canvas"]');
      const projectBtn = switcher.getByRole('button').first();
      const [px, py]  = await midpoint(projectBtn);
      await glide(page, px, py, 30);
      await beat(page, 500);
      await projectBtn.click();
      await expect(page.locator('[aria-label="Story canvas"]')).toBeVisible({
        timeout: 10_000,
      });
      await hold(page);
    });

    await test.step('open the Characters panel', async () => {
      const sidebar  = page.locator('[role="tablist"][aria-label="Story Elements"]');
      const firstTab = sidebar.getByRole('tab').first();
      const [tx, ty] = await midpoint(firstTab);
      await glide(page, tx, ty, 25);
      await beat(page, 600);
      await firstTab.hover();
      await beat(page, 400);
      await firstTab.click();
      await hold(page, 1500);
      // Drift the cursor down the characters list so the viewer can see it
      await glide(page, tx + 60, midY - 60, 25);
      await beat(page, 600);
      await glide(page, tx + 60, midY + 60, 25);
      await beat(page);
    });

    await test.step('browse through the remaining sidebar panels', async () => {
      const sidebar = page.locator('[role="tablist"][aria-label="Story Elements"]');
      const tabs    = sidebar.getByRole('tab');
      const count   = await tabs.count();

      // Visit each panel tab with a gentle hover-then-click rhythm
      for (let i = 1; i < count; i++) {
        const tab = tabs.nth(i);
        const [tx, ty] = await midpoint(tab);
        await glide(page, tx, ty, 22);
        await beat(page, 400);
        await tab.click();
        await hold(page, 1100);
        // Drift the cursor into the panel content
        await glide(page, tx + 80, midY, 20);
        await beat(page, 500);
      }
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT VI · Full-text search
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT VI — open full-text search (Ctrl+Shift+F)', async () => {
      await glide(page, midX, midY, 20);
      await beat(page, 400);
      await page.keyboard.press('Control+Shift+F');
      await hold(page, 1000);
    });

    await test.step('type a search term and browse results', async () => {
      await attempt(async () => {
        const input = page.getByPlaceholder(/search/i).first();
        await input.waitFor({ state: 'visible', timeout: 4_000 });
        const [ix, iy] = await midpoint(input);
        await glide(page, ix, iy, 20);
        await input.click();
        await beat(page, 350);
        await page.keyboard.type('label', { delay: 85 });
        await hold(page, 1800);
        // Hover over the first visible result
        const result = page
          .locator('[data-result-path], .search-result, [role="listitem"]')
          .first();
        if (await result.isVisible({ timeout: 2_000 }).catch(() => false)) {
          const [rx, ry] = await midpoint(result);
          await glide(page, rx, ry, 20);
          await hold(page, 1000);
        }
      });
      await page.keyboard.press('Escape');
      await hold(page);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT VII · Diagnostics panel — issues & task board
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT VII — open Diagnostics panel', async () => {
      const diagBtn = page.getByLabel('Diagnostics');
      const [dx, dy] = await midpoint(diagBtn);
      await glide(page, dx, dy, 30);
      await beat(page, 600);
      await diagBtn.hover();
      await beat(page, 400);
      await diagBtn.click();
      await expect(page.getByRole('button', { name: 'Issues' })).toBeVisible({
        timeout: 8_000,
      });
      await hold(page, 2200);
    });

    await test.step('pan through the issues list', async () => {
      await glide(page, midX, midY + 60, 25);
      await beat(page, 700);
      await glide(page, midX, midY + 130, 20);
      await beat(page, 600);
      // Switch to the Tasks view
      await attempt(async () => {
        const tasksBtn = page.getByRole('button', { name: /Tasks/i });
        const [tx, ty] = await midpoint(tasksBtn);
        await glide(page, tx, ty, 20);
        await beat(page, 400);
        await tasksBtn.click();
        await hold(page, 1200);
      });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT VIII · Warp to Label — jump execution anywhere in the story
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT VIII — open Warp to Label modal', async () => {
      const warpBtn = page.getByLabel('Warp to Label');
      const [wx, wy] = await midpoint(warpBtn);
      await glide(page, wx, wy, 25);
      await beat(page, 600);
      await warpBtn.hover();
      await beat(page, 400);
      await warpBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 8_000 });
      await hold(page, 1500);
    });

    await test.step('drift through the label list', async () => {
      const dialog = page.getByRole('dialog');
      const [dx, dy] = await midpoint(dialog);
      await glide(page, dx, dy - 70, 25);
      await beat(page, 600);
      await glide(page, dx, dy + 70, 25);
      await beat(page, 700);
      await page.keyboard.press('Escape');
      await beat(page, 900);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT IX · Settings
    // Themes, fonts, mouse gestures — fully configurable.
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT IX — open Settings', async () => {
      const settingsBtn = page.getByLabel('Settings');
      const [sx, sy]   = await midpoint(settingsBtn);
      await glide(page, sx, sy, 25);
      await beat(page, 600);
      await settingsBtn.hover();
      await beat(page, 400);
      await settingsBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 8_000 });
      await hold(page, 2200);
    });

    await test.step('glide through the settings panels', async () => {
      const dialog = page.getByRole('dialog');
      const [dx, dy] = await midpoint(dialog);
      await glide(page, dx, dy - 80, 25);
      await beat(page, 500);
      await glide(page, dx, dy + 80, 25);
      await beat(page, 500);
      // Click a settings section if a sidebar nav is visible
      await attempt(async () => {
        const nav = dialog.locator('nav, [role="navigation"]').first();
        const items = nav.getByRole('button');
        const cnt = await items.count();
        for (let i = 1; i < Math.min(cnt, 3); i++) {
          await items.nth(i).click();
          await beat(page, 700);
        }
      });
      await page.keyboard.press('Escape');
      await beat(page, 900);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT X · Keyboard shortcuts reference
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT X — show Keyboard Shortcuts reference', async () => {
      const shortcutsBtn = page.getByLabel('Keyboard Shortcuts');
      const [kx, ky]    = await midpoint(shortcutsBtn);
      await glide(page, kx, ky, 25);
      await beat(page, 600);
      await shortcutsBtn.hover();
      await beat(page, 400);
      await shortcutsBtn.click();
      const dialog = page.getByRole('dialog');
      if (await dialog.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await hold(page, 2200);
        const [dx, dy] = await midpoint(dialog);
        await glide(page, dx, dy + 80, 25);
        await beat(page, 700);
        await page.keyboard.press('Escape');
        await beat(page, 900);
      }
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT XI · The Finale
    // Return to the project canvas, fit everything to view, slow zoom out.
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT XI — return to Project Canvas', async () => {
      const switcher   = page.locator('[aria-label="Switch canvas"]');
      const projectBtn = switcher.getByRole('button').first();
      const [px, py]  = await midpoint(projectBtn);
      await glide(page, px, py, 30);
      await beat(page, 500);
      await projectBtn.click();
      await expect(page.locator('[aria-label="Story canvas"]')).toBeVisible({
        timeout: 10_000,
      });
      await hold(page);
    });

    await test.step('fit all blocks to screen', async () => {
      await attempt(async () => {
        const fitBtn = page.getByLabel('Fit all to screen');
        await fitBtn.waitFor({ state: 'visible', timeout: 4_000 });
        const [fx, fy] = await midpoint(fitBtn);
        await glide(page, fx, fy, 25);
        await beat(page, 600);
        await fitBtn.click();
      });
      await hold(page, 2200);
    });

    await test.step('cinematic zoom-out — curtain close', async () => {
      const canvas = page.locator('[aria-label="Story canvas"]').first();
      const box    = await canvas.boundingBox();
      const ox = box ? box.x + box.width  / 2 : midX;
      const oy = box ? box.y + box.height / 2 : midY;
      await glide(page, ox, oy, 30);
      await beat(page, 800);
      // Very gentle wide zoom-out — the whole project shrinks into view
      await smoothZoom(page, ox, oy, 550, 20);
      await hold(page, 3000); // hold on the final frame
    });
  });
});
