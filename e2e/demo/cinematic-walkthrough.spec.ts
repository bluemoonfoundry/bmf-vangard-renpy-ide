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
 * Uses DemoProject (repo root) — "The Vanishing Artifact", a full 72-file
 * branching VN with 7 backgrounds, 6 character sprites, and 3 pre-built
 * Scene Composer compositions.
 */

import { test as base, _electron as electron } from 'playwright/test';
import type { ElectronApplication, Locator, Page } from 'playwright/test';
import { expect } from 'playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';

// ── Paths ─────────────────────────────────────────────────────────────────────

const __dirname    = path.dirname(fileURLToPath(import.meta.url));
const APP_ENTRY    = path.join(__dirname, '..', '..', 'electron.js');
const DEMO_PROJECT = path.join(__dirname, '..', '..', 'DemoProject');

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
 * Inject a visible cursor dot + click-ripple into the Electron renderer so
 * the mouse is visible in the recorded video.
 *
 * Playwright dispatches real DOM mousemove/mousedown/mouseup events via CDP,
 * so the injected listeners track every move and click faithfully.
 * All injected elements use pointer-events:none — they never block real clicks.
 */
async function setupCursorOverlay(p: Page): Promise<void> {
  await p.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = `
      #pw-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.93);
        border: 2px solid rgba(10, 10, 10, 0.55);
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.30);
        pointer-events: none;
        z-index: 2147483647;
        transform: translate(-50%, -50%);
        transition: width 0.07s ease, height 0.07s ease, background 0.07s ease;
      }
      #pw-cursor.pw-down {
        width: 13px;
        height: 13px;
        background: rgba(255, 210, 0, 0.96);
        border-color: rgba(180, 120, 0, 0.7);
      }
      .pw-ripple {
        position: fixed;
        border-radius: 50%;
        border: 2.5px solid rgba(255, 210, 0, 0.80);
        pointer-events: none;
        z-index: 2147483646;
        transform: translate(-50%, -50%);
        animation: pw-ripple-out 0.55s ease-out forwards;
      }
      @keyframes pw-ripple-out {
        from { width: 14px; height: 14px; opacity: 1; }
        to   { width: 68px; height: 68px; opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    const cursor = document.createElement('div');
    cursor.id = 'pw-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top  = `${e.clientY}px`;
    }, { passive: true, capture: true });

    document.addEventListener('mousedown', (e: MouseEvent) => {
      cursor.classList.add('pw-down');
      const ripple = document.createElement('div');
      ripple.className = 'pw-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top  = `${e.clientY}px`;
      document.body.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    }, { capture: true });

    document.addEventListener('mouseup', () => {
      cursor.classList.remove('pw-down');
    }, { capture: true });
  });
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
  // 10-minute ceiling — actual runtime is ~4-5 minutes
  test.setTimeout(600_000);

  test('Ren\'Py IDE — full feature walkthrough', async ({ window: page }) => {
    const vp   = page.viewportSize() ?? { width: 1280, height: 800 };
    const midX = Math.round(vp.width  / 2);
    const midY = Math.round(vp.height / 2);

    // ─────────────────────────────────────────────────────────────────────────
    // ACT I · The Project Canvas
    // 90 script files materialise as draggable blocks.  A 72-file branching
    // mystery novel — laid out as a left-to-right flow graph.
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT I — project loads and canvas populates', async () => {
      await expect(page.locator('[data-block-id]').first()).toBeVisible({
        timeout: 60_000,
      });
      // Inject cursor overlay so the mouse is visible in the recorded video
      await setupCursorOverlay(page);
      // Let the analysis worker complete its first pass on 72 files
      await hold(page, 3000);
    });

    await test.step('fit all blocks to screen', async () => {
      await attempt(async () => {
        const fitBtn = page.getByLabel('Fit all to screen');
        await fitBtn.waitFor({ state: 'visible', timeout: 5_000 });
        const [fx, fy] = await midpoint(fitBtn);
        await glide(page, fx, fy, 25);
        await beat(page, 600);
        await fitBtn.click();
      });
      await hold(page, 2000);
    });

    await test.step('slow pan across the full canvas', async () => {
      await glide(page, midX, midY, 40);
      await beat(page, 900);
      await panCanvas(page, 'Story canvas', -280, 0);
      await beat(page);
      await panCanvas(page, 'Story canvas', 280, 0);
      await hold(page);
    });

    await test.step('zoom into a cluster of blocks and back out', async () => {
      const block = page.locator('[data-block-id]').first();
      const [bx, by] = await midpoint(block);
      await glide(page, bx, by, 40);
      await beat(page, 700);
      await smoothZoom(page, bx, by, -400, 16); // zoom in
      await hold(page, 1200);
      await smoothZoom(page, bx, by,  400, 16); // zoom back out
      await hold(page);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT II · Monaco Editor — syntax-highlighted Ren'Py code
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

    await test.step('scroll through the code — characters and labels on display', async () => {
      const editor = page.locator('.monaco-editor').first();
      const box = await editor.boundingBox();
      if (box) {
        const ex = box.x + box.width / 2;
        const ey = box.y + 80;
        await glide(page, ex, ey, 30);
        await beat(page, 500);
        for (let i = 0; i < 8; i++) {
          await page.mouse.wheel(0, 80);
          await page.waitForTimeout(120);
        }
        await hold(page, 1200);
        for (let i = 0; i < 8; i++) {
          await page.mouse.wheel(0, -80);
          await page.waitForTimeout(120);
        }
        await beat(page);
      }
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT III · Scene Composer — the Garden scene
    // A pre-built composition: garden background, Maya and Sterling sprites
    // with blur, alpha, and positional effects.  Demonstrates live sprite
    // manipulation; change is undone so the project file stays clean.
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT III — open the Scene Compositions panel', async () => {
      // Tab index 5 in the Story Elements sidebar = "Scene Compositions"
      const sidebar    = page.locator('[role="tablist"][aria-label="Story Elements"]');
      const scenesTab  = sidebar.getByRole('tab', { name: 'Scene Compositions' });
      const [tx, ty]   = await midpoint(scenesTab);
      await glide(page, tx, ty, 25);
      await beat(page, 600);
      await scenesTab.hover();
      await beat(page, 400);
      await scenesTab.click();
      await hold(page, 1000);
    });

    await test.step('click the Garden scene to open the Scene Composer', async () => {
      const gardenEntry = page.getByText('Garden', { exact: true }).first();
      await gardenEntry.waitFor({ state: 'visible', timeout: 5_000 });
      const [gx, gy] = await midpoint(gardenEntry);
      await glide(page, gx, gy, 25);
      await beat(page, 600);
      await gardenEntry.click();
      // Wait for the Scene Composer tab to fully render
      await hold(page, 2500);
    });

    await test.step('tour the Scene Composer — background and two sprites', async () => {
      // The composer renders a scaled preview of the full scene.
      // Garden has: bg garden.png, Maya at ~76% x / ~80% y, Sterling at ~22% x / ~81% y.
      // Find the preview area and sweep across it so the viewer can see the artwork.
      const preview = page.locator('canvas').first();
      const box     = await preview.boundingBox().catch(() => null);
      if (!box) return;

      // Glide across the full width of the preview
      await glide(page, box.x + box.width * 0.15, box.y + box.height * 0.6, 30);
      await beat(page, 600);
      await glide(page, box.x + box.width * 0.85, box.y + box.height * 0.6, 50);
      await hold(page, 1000);
    });

    await test.step('select Maya\'s sprite and drag it', async () => {
      const preview = page.locator('canvas').first();
      const box     = await preview.boundingBox().catch(() => null);
      if (!box) return;

      // Maya (m.png) in the Garden composition: x≈0.759, y≈0.797 of canvas
      const sx = box.x + box.width  * 0.759;
      const sy = box.y + box.height * 0.797;

      await glide(page, sx, sy, 35);
      await beat(page, 700);
      // Click to select
      await page.mouse.click(sx, sy);
      await hold(page, 1200);

      // Drag slightly to the right — shows live repositioning
      await page.mouse.down();
      await page.mouse.move(sx + 55, sy - 20, { steps: 35 });
      await beat(page, 800);
      await page.mouse.up();
      await hold(page, 1000);

      // Hover over the properties panel (right of preview)
      await glide(page, box.x + box.width + 80, box.y + box.height * 0.4, 30);
      await beat(page, 800);
      await glide(page, box.x + box.width + 80, box.y + box.height * 0.6, 20);
      await beat(page, 600);

      // Undo — keeps project.ide.json unchanged
      await page.keyboard.press('Control+Z');
      await beat(page, 600);
    });

    await test.step('browse the other saved scenes (Nascent, Sprite Composer)', async () => {
      // Return focus to the sidebar to show the other scene names
      const sidebar   = page.locator('[role="tablist"][aria-label="Story Elements"]');
      const scenesTab = sidebar.getByRole('tab', { name: 'Scene Compositions' });
      await glide(page, ...(await midpoint(scenesTab)), 20);
      await beat(page, 400);
      await scenesTab.click();
      await hold(page, 1000);
      // Glide down the list so "Nascent" and "Sprite Composer" are visible
      await glide(page, 120, midY - 40, 20);
      await beat(page, 500);
      await glide(page, 120, midY + 60, 20);
      await hold(page);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT IV · Flow Canvas — the narrative graph
    // 80+ label nodes connected by bezier edges; 8 converging story paths.
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT IV — switch to Flow Canvas', async () => {
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

    await test.step('fit and pan the narrative flow graph', async () => {
      await attempt(async () => {
        const fitBtn = page.getByLabel('Fit all to screen');
        await fitBtn.waitFor({ state: 'visible', timeout: 3_000 });
        await fitBtn.click();
        await hold(page, 1500);
      });
      await glide(page, midX, midY, 35);
      await beat(page);
      await panCanvas(page, 'Route canvas', -200, 0);
      await hold(page, 1200);
      await panCanvas(page, 'Route canvas', 200, -40);
      await hold(page, 1200);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT V · Choices Canvas — the player decision tree
    // Four-column layout: parents → labels → choice pills → targets.
    // DemoProject has 50+ branching choices across 8 stages.
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT V — switch to Choices Canvas', async () => {
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

    await test.step('hover over choice pills', async () => {
      await attempt(async () => {
        const pill = page.getByRole('button', { name: /Choice:/i }).first();
        await pill.waitFor({ state: 'visible', timeout: 4_000 });
        const [px, py] = await midpoint(pill);
        await glide(page, px, py, 35);
        await hold(page, 1200);
        // Pan across to reveal more of the tree
        await glide(page, px + 120, py, 30);
        await hold(page, 800);
      });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT VI · Story Elements sidebar
    // Scan through every panel tab — characters, variables, images, snippets.
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT VI — return to Project Canvas', async () => {
      const switcher   = page.locator('[aria-label="Switch canvas"]');
      const projectBtn = switcher.getByRole('button').first();
      const [px, py]   = await midpoint(projectBtn);
      await glide(page, px, py, 30);
      await beat(page, 500);
      await projectBtn.click();
      await expect(page.locator('[aria-label="Story canvas"]')).toBeVisible({
        timeout: 10_000,
      });
      await hold(page);
    });

    await test.step('tour the Story Elements sidebar panels', async () => {
      const sidebar = page.locator('[role="tablist"][aria-label="Story Elements"]');
      const tabs    = sidebar.getByRole('tab');
      const count   = await tabs.count();

      for (let i = 0; i < count; i++) {
        const tab = tabs.nth(i);
        const [tx, ty] = await midpoint(tab);
        await glide(page, tx, ty, 22);
        await beat(page, 350);
        await tab.hover();
        await beat(page, 250);
        await tab.click();
        await hold(page, 1000);
        // Drift cursor into the panel content area
        await glide(page, tx + 90, midY, 20);
        await beat(page, 400);
      }
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT VII · Full-text search
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT VII — open full-text search (Ctrl+Shift+F)', async () => {
      await glide(page, midX, midY, 20);
      await beat(page, 400);
      await page.keyboard.press('Control+Shift+F');
      await hold(page, 1000);
    });

    await test.step('search for "echo" and browse results', async () => {
      await attempt(async () => {
        const input = page.getByPlaceholder(/search/i).first();
        await input.waitFor({ state: 'visible', timeout: 4_000 });
        await input.click();
        await beat(page, 350);
        // "echo" is the name of the supernatural entity in The Vanishing Artifact
        await page.keyboard.type('echo', { delay: 90 });
        await hold(page, 2000);
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
    // ACT VIII · Script Statistics — real metrics from a 72-file project
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT VIII — open Script Statistics panel', async () => {
      const statsBtn = page.getByLabel('Script Statistics');
      const [sx, sy] = await midpoint(statsBtn);
      await glide(page, sx, sy, 25);
      await beat(page, 600);
      await statsBtn.hover();
      await beat(page, 400);
      await statsBtn.click();
      await hold(page, 2200);
      // Drift through the stats content
      await glide(page, midX, midY - 60, 25);
      await beat(page, 500);
      await glide(page, midX, midY + 80, 20);
      await beat(page, 600);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT IX · Diagnostics panel — issues and task board
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT IX — open Diagnostics panel', async () => {
      const diagBtn  = page.getByLabel('Diagnostics');
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
      await glide(page, midX, midY + 60, 25);
      await beat(page, 600);
      await glide(page, midX, midY + 130, 20);
      await beat(page, 500);
      // Switch to Tasks view
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
    // ACT X · Warp to Label — jump execution to any story point
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT X — open Warp to Label modal', async () => {
      const warpBtn  = page.getByLabel('Warp to Label');
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
      const dialog   = page.getByRole('dialog');
      const [dx, dy] = await midpoint(dialog);
      await glide(page, dx, dy - 80, 25);
      await beat(page, 600);
      await glide(page, dx, dy + 80, 25);
      await beat(page, 700);
      await page.keyboard.press('Escape');
      await beat(page, 900);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT XI · Settings — themes, fonts, mouse gestures
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT XI — open Settings', async () => {
      const settingsBtn = page.getByLabel('Settings');
      const [sx, sy]    = await midpoint(settingsBtn);
      await glide(page, sx, sy, 25);
      await beat(page, 600);
      await settingsBtn.hover();
      await beat(page, 400);
      await settingsBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 8_000 });
      await hold(page, 2200);
    });

    await test.step('browse settings panels', async () => {
      const dialog   = page.getByRole('dialog');
      const [dx, dy] = await midpoint(dialog);
      await glide(page, dx, dy - 80, 25);
      await beat(page, 500);
      await glide(page, dx, dy + 80, 25);
      await beat(page, 500);
      await attempt(async () => {
        const nav   = dialog.locator('nav, [role="navigation"]').first();
        const items = nav.getByRole('button');
        const cnt   = await items.count();
        for (let i = 1; i < Math.min(cnt, 3); i++) {
          await items.nth(i).click();
          await beat(page, 700);
        }
      });
      await page.keyboard.press('Escape');
      await beat(page, 900);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT XII · Keyboard Shortcuts reference card
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT XII — show Keyboard Shortcuts reference', async () => {
      const kbBtn    = page.getByLabel('Keyboard Shortcuts');
      const [kx, ky] = await midpoint(kbBtn);
      await glide(page, kx, ky, 25);
      await beat(page, 600);
      await kbBtn.hover();
      await beat(page, 400);
      await kbBtn.click();
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
    // ACT XIII · The Finale — fit to view, cinematic zoom out, curtain close
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT XIII — return to Project Canvas', async () => {
      const switcher   = page.locator('[aria-label="Switch canvas"]');
      const projectBtn = switcher.getByRole('button').first();
      const [px, py]   = await midpoint(projectBtn);
      await glide(page, px, py, 30);
      await beat(page, 500);
      await projectBtn.click();
      await expect(page.locator('[aria-label="Story canvas"]')).toBeVisible({
        timeout: 10_000,
      });
      await hold(page);
    });

    await test.step('fit all 90 blocks to screen', async () => {
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

    await test.step('slow cinematic zoom-out — curtain close', async () => {
      const canvas = page.locator('[aria-label="Story canvas"]').first();
      const box    = await canvas.boundingBox();
      const ox = box ? box.x + box.width  / 2 : midX;
      const oy = box ? box.y + box.height / 2 : midY;
      await glide(page, ox, oy, 30);
      await beat(page, 900);
      // Very gentle wide zoom-out so the full project shrinks into frame
      await smoothZoom(page, ox, oy, 600, 22);
      await hold(page, 3500); // hold on the final frame
    });
  });
});
