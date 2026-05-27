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
 * Inject the cursor dot, click-ripple, and caption overlay into the renderer.
 *
 * • Cursor: 36 px yellow circle that tracks every mouse move; shrinks and
 *   darkens on mousedown; uses pointer-events:none so real clicks pass through.
 * • Ripple: gold expanding ring on each click, 1.1 s fade-out.
 * • Caption: bottom-centre pill with a cyan label line above white body text.
 *   Controlled via window.__pwCap(label, body) / window.__pwCapHide().
 *
 * All three are injected once; later calls to showCaption() just call
 * window.__pwCap() via page.evaluate(), which is very fast.
 */
async function setupOverlays(p: Page): Promise<void> {
  await p.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* ── cursor ── */
      #pw-cursor {
        position: fixed;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 220, 0, 0.82);
        border: 3px solid rgba(180, 130, 0, 0.75);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.40);
        pointer-events: none;
        z-index: 2147483647;
        transform: translate(-50%, -50%);
        transition: width 0.07s ease, height 0.07s ease, background 0.07s ease;
      }
      #pw-cursor.pw-down {
        width: 24px;
        height: 24px;
        background: rgba(255, 160, 0, 0.95);
        border-color: rgba(180, 90, 0, 0.85);
      }
      /* ── click ripple ── */
      .pw-ripple {
        position: fixed;
        border-radius: 50%;
        border: 3px solid rgba(255, 200, 0, 0.90);
        pointer-events: none;
        z-index: 2147483646;
        transform: translate(-50%, -50%);
        animation: pw-ripple-out 1.1s ease-out forwards;
      }
      @keyframes pw-ripple-out {
        from { width: 24px; height: 24px; opacity: 1; }
        to   { width: 90px; height: 90px; opacity: 0; }
      }
      /* ── caption overlay ── */
      #pw-caption {
        position: fixed;
        bottom: 28px;
        left: 50%;
        transform: translateX(-50%);
        min-width: 300px;
        max-width: 640px;
        background: rgba(6, 10, 24, 0.91);
        border: 1.5px solid rgba(56, 189, 248, 0.35);
        border-top: 3px solid rgba(56, 189, 248, 0.80);
        border-radius: 10px;
        padding: 9px 26px 13px;
        z-index: 2147483640;
        text-align: center;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.35s ease;
        font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
      }
      #pw-caption.pw-vis { opacity: 1; }
      .pw-cap-lbl {
        font-size: 9.5px;
        font-weight: 700;
        color: #38bdf8;
        letter-spacing: 0.17em;
        text-transform: uppercase;
        margin-bottom: 5px;
      }
      .pw-cap-body {
        font-size: 14px;
        font-weight: 400;
        color: rgba(232, 244, 255, 0.96);
        line-height: 1.5;
      }
    `;
    document.head.appendChild(style);

    // ── cursor element ──
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

    // ── caption helpers ──
    (window as any).__pwCap = (label: string, body: string) => {
      let el = document.getElementById('pw-caption');
      if (!el) {
        el = document.createElement('div');
        el.id = 'pw-caption';
        document.body.appendChild(el);
      }
      el.innerHTML =
        `<div class="pw-cap-lbl">${label}</div>` +
        `<div class="pw-cap-body">${body}</div>`;
      el.classList.remove('pw-vis');
      void (el as HTMLElement).offsetHeight; // force reflow so transition fires
      el.classList.add('pw-vis');
    };

    (window as any).__pwCapHide = () => {
      const el = document.getElementById('pw-caption');
      if (el) el.classList.remove('pw-vis');
    };
  });
}

/**
 * Display a step-description caption at the bottom of the screen.
 * `label` is shown in small cyan uppercase above the white `body` text.
 * The caption persists until the next showCaption() or hideCaption() call.
 */
async function showCaption(p: Page, label: string, body: string): Promise<void> {
  await p.evaluate(
    ([lbl, bod]) => (window as any).__pwCap(lbl, bod),
    [label, body] as [string, string],
  );
}

/** Fade the caption out */
async function hideCaption(p: Page): Promise<void> {
  await p.evaluate(() => (window as any).__pwCapHide());
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
  // 10-minute ceiling — actual runtime is ~5-6 minutes
  test.setTimeout(600_000);

  test('Ren\'Py IDE — full feature walkthrough', async ({ window: page }) => {
    const vp   = page.viewportSize() ?? { width: 1280, height: 800 };
    const midX = Math.round(vp.width  / 2);
    const midY = Math.round(vp.height / 2);

    // ─────────────────────────────────────────────────────────────────────────
    // ACT I · The Project Canvas
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT I — project loads and canvas populates', async () => {
      await expect(page.locator('[data-block-id]').first()).toBeVisible({
        timeout: 60_000,
      });
      await setupOverlays(page);
      await showCaption(page,
        'Project Canvas',
        '90 script files mapped as draggable blocks — your entire story at a glance',
      );
      await hold(page, 3000);
    });

    await test.step('fit all blocks to screen', async () => {
      await showCaption(page,
        'Project Canvas',
        'One click fits the full project into view — auto-arranged as a narrative flow graph',
      );
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
      await showCaption(page,
        'Project Canvas',
        'Pan freely across all 90 blocks spanning 8 story stages',
      );
      await glide(page, midX, midY, 40);
      await beat(page, 900);
      await panCanvas(page, 'Story canvas', -280, 0);
      await beat(page);
      await panCanvas(page, 'Story canvas', 280, 0);
      await hold(page);
    });

    await test.step('zoom into a cluster of blocks and back out', async () => {
      await showCaption(page,
        'Project Canvas',
        'Zoom into any cluster to inspect individual script files',
      );
      const block = page.locator('[data-block-id]').first();
      const [bx, by] = await midpoint(block);
      await glide(page, bx, by, 40);
      await beat(page, 700);
      await smoothZoom(page, bx, by, -400, 16);
      await hold(page, 1200);
      await smoothZoom(page, bx, by,  400, 16);
      await hold(page);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT II · Monaco Editor
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT II — double-click a block to open Monaco editor', async () => {
      await showCaption(page,
        'Monaco Editor',
        'Double-click any block to open it in a full Monaco code editor',
      );
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
      await showCaption(page,
        'Monaco Editor',
        'Ren\'Py syntax highlighting, semantic analysis, and live error markers',
      );
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
    // ACT III · Scene Composer
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT III — open the Scene Compositions panel', async () => {
      await showCaption(page,
        'Scene Composer',
        'Visual scene builder — compose backgrounds and sprites with real-time preview',
      );
      const sidebar   = page.locator('[role="tablist"][aria-label="Story Elements"]');
      const scenesTab = sidebar.getByRole('tab', { name: 'Scene Compositions' });
      const [tx, ty]  = await midpoint(scenesTab);
      await glide(page, tx, ty, 25);
      await beat(page, 600);
      await scenesTab.hover();
      await beat(page, 400);
      await scenesTab.click();
      await hold(page, 1000);
    });

    await test.step('click the Garden scene to open the Scene Composer', async () => {
      await showCaption(page,
        'Scene Composer',
        'Click any saved composition to open it for editing',
      );
      const gardenEntry = page.getByText('Garden', { exact: true }).first();
      await gardenEntry.waitFor({ state: 'visible', timeout: 5_000 });
      const [gx, gy] = await midpoint(gardenEntry);
      await glide(page, gx, gy, 25);
      await beat(page, 600);
      await gardenEntry.click();
      await hold(page, 2500);
    });

    await test.step('tour the Scene Composer — background and two sprites', async () => {
      await showCaption(page,
        'Scene Composer',
        'Garden background with Maya and Professor Sterling — positioned and layered visually',
      );
      const preview = page.locator('canvas').first();
      const box     = await preview.boundingBox().catch(() => null);
      if (!box) return;
      await glide(page, box.x + box.width * 0.15, box.y + box.height * 0.6, 30);
      await beat(page, 600);
      await glide(page, box.x + box.width * 0.85, box.y + box.height * 0.6, 50);
      await hold(page, 1000);
    });

    await test.step('select Maya\'s sprite and drag it', async () => {
      await showCaption(page,
        'Scene Composer',
        'Drag sprites to reposition — scale, flip, and apply colour effects in real time',
      );
      const preview = page.locator('canvas').first();
      const box     = await preview.boundingBox().catch(() => null);
      if (!box) return;

      const sx = box.x + box.width  * 0.759;
      const sy = box.y + box.height * 0.797;

      await glide(page, sx, sy, 35);
      await beat(page, 700);
      await page.mouse.click(sx, sy);
      await hold(page, 1200);

      await page.mouse.down();
      await page.mouse.move(sx + 55, sy - 20, { steps: 35 });
      await beat(page, 800);
      await page.mouse.up();
      await hold(page, 1000);

      await glide(page, box.x + box.width + 80, box.y + box.height * 0.4, 30);
      await beat(page, 800);
      await glide(page, box.x + box.width + 80, box.y + box.height * 0.6, 20);
      await beat(page, 600);

      await page.keyboard.press('Control+Z');
      await beat(page, 600);
    });

    await test.step('browse the other saved scenes (Nascent, Sprite Composer)', async () => {
      await showCaption(page,
        'Scene Composer',
        'Three saved compositions ready to open: Garden, Nascent, and Sprite Composer',
      );
      const sidebar   = page.locator('[role="tablist"][aria-label="Story Elements"]');
      const scenesTab = sidebar.getByRole('tab', { name: 'Scene Compositions' });
      await glide(page, ...(await midpoint(scenesTab)), 20);
      await beat(page, 400);
      await scenesTab.click();
      await hold(page, 1000);
      await glide(page, 120, midY - 40, 20);
      await beat(page, 500);
      await glide(page, 120, midY + 60, 20);
      await hold(page);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT IV · Flow Canvas
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT IV — switch to Flow Canvas', async () => {
      await showCaption(page,
        'Flow Canvas',
        'Every label becomes a node — trace all 8 narrative paths through the story',
      );
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
      await showCaption(page,
        'Flow Canvas',
        'Bezier edges show every jump and call relationship between labels',
      );
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
    // ACT V · Choices Canvas
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT V — switch to Choices Canvas', async () => {
      await showCaption(page,
        'Choices Canvas',
        'Player decisions as a four-column tree: labels → choices → targets',
      );
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
      await showCaption(page,
        'Choices Canvas',
        'Click any choice pill to highlight the narrative path it creates',
      );
      await attempt(async () => {
        const pill = page.getByRole('button', { name: /Choice:/i }).first();
        await pill.waitFor({ state: 'visible', timeout: 4_000 });
        const [px, py] = await midpoint(pill);
        await glide(page, px, py, 35);
        await hold(page, 1200);
        await glide(page, px + 120, py, 30);
        await hold(page, 800);
      });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT VI · Story Elements sidebar
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

    await test.step('browse Characters, Variables and Screens panels', async () => {
      await showCaption(page,
        'Story Elements',
        'Characters, variables, and screen definitions — all in one sidebar',
      );
      const sidebar = page.locator('[role="tablist"][aria-label="Story Elements"]');
      const tabs    = sidebar.getByRole('tab');
      for (let i = 0; i <= 2; i++) {
        const tab = tabs.nth(i);
        const [tx, ty] = await midpoint(tab);
        await glide(page, tx, ty, 22);
        await beat(page, 350);
        await tab.hover();
        await beat(page, 250);
        await tab.click();
        await hold(page, 900);
        await glide(page, tx + 90, midY, 20);
        await beat(page, 400);
      }
    });

    await test.step('Images panel — double-click m.png to open the image viewer', async () => {
      await showCaption(page,
        'Image Manager',
        'Browse, tag, and organise every image in the project',
      );
      const sidebar   = page.locator('[role="tablist"][aria-label="Story Elements"]');
      const imagesTab = sidebar.getByRole('tab', { name: 'Images' });
      const [tx, ty]  = await midpoint(imagesTab);
      await glide(page, tx, ty, 22);
      await beat(page, 400);
      await imagesTab.click();
      await hold(page, 1200);

      await attempt(async () => {
        const mEntry = page.getByText('m.png', { exact: false }).first();
        await mEntry.waitFor({ state: 'visible', timeout: 5_000 });
        const [ix, iy] = await midpoint(mEntry);
        await glide(page, ix, iy, 28);
        await beat(page, 700);
        await showCaption(page,
          'Image Viewer',
          'Double-click any image to open a full-resolution viewer with zoom, pan, and metadata editing',
        );
        await mEntry.dblclick();
        await hold(page, 2000);
        await glide(page, midX - 80, midY, 25);
        await beat(page, 500);
        await glide(page, midX + 80, midY, 25);
        await hold(page, 1000);
      });
    });

    await test.step('browse Audio and Scene Compositions panels', async () => {
      await showCaption(page,
        'Story Elements',
        'Audio manager and saved scene compositions',
      );
      const sidebar = page.locator('[role="tablist"][aria-label="Story Elements"]');
      const tabs    = sidebar.getByRole('tab');
      for (let i = 4; i <= 5; i++) {
        const tab = tabs.nth(i);
        const [tx, ty] = await midpoint(tab);
        await glide(page, tx, ty, 22);
        await beat(page, 350);
        await tab.click();
        await hold(page, 800);
        await glide(page, tx + 90, midY, 20);
        await beat(page, 400);
      }
    });

    await test.step('Image Maps panel — open imagemap_1 and select hotspots', async () => {
      await showCaption(page,
        'Image Maps',
        'Draw clickable hotspot regions over any background image',
      );
      const sidebar      = page.locator('[role="tablist"][aria-label="Story Elements"]');
      const imageMapsTab = sidebar.getByRole('tab', { name: 'Image Maps' });
      const [tx, ty]     = await midpoint(imageMapsTab);
      await glide(page, tx, ty, 22);
      await beat(page, 400);
      await imageMapsTab.click();
      await hold(page, 1000);

      await attempt(async () => {
        const mapEntry = page.getByText('imagemap_1', { exact: false }).first();
        await mapEntry.waitFor({ state: 'visible', timeout: 5_000 });
        const [mx, my] = await midpoint(mapEntry);
        await glide(page, mx, my, 25);
        await beat(page, 600);
        await showCaption(page,
          'Imagemap Composer',
          'Five interactive hotspots — click to select, drag to resize, wire each to a story label',
        );
        await mapEntry.click();
        await hold(page, 2500);
      });

      await attempt(async () => {
        const hotspot1 = page
          .locator('[data-hotspot-id], [class*="hotspot"]:not([aria-label])')
          .first();
        if (await hotspot1.isVisible({ timeout: 2_000 }).catch(() => false)) {
          const [h1x, h1y] = await midpoint(hotspot1);
          await glide(page, h1x, h1y, 30);
          await beat(page, 600);
          await hotspot1.click();
          await hold(page, 1300);

          const hotspot2 = page
            .locator('[data-hotspot-id], [class*="hotspot"]:not([aria-label])')
            .nth(1);
          if (await hotspot2.isVisible({ timeout: 1_000 }).catch(() => false)) {
            const [h2x, h2y] = await midpoint(hotspot2);
            await glide(page, h2x, h2y, 30);
            await beat(page, 600);
            await hotspot2.click();
            await hold(page, 1300);
          }
        } else {
          const canvas = page.locator('canvas').last();
          const box    = await canvas.boundingBox();
          if (box) {
            const p1x = box.x + box.width * 0.28;
            const p1y = box.y + box.height * 0.45;
            await glide(page, p1x, p1y, 30);
            await beat(page, 500);
            await page.mouse.click(p1x, p1y);
            await hold(page, 1300);
            const p2x = box.x + box.width * 0.62;
            const p2y = box.y + box.height * 0.55;
            await glide(page, p2x, p2y, 30);
            await beat(page, 500);
            await page.mouse.click(p2x, p2y);
            await hold(page, 1300);
          }
        }
      });
    });

    await test.step('browse Screen Layouts, Snippets, Menu Templates and Colour Palette', async () => {
      await showCaption(page,
        'Story Elements',
        'Screen layouts, code snippets, menu templates, and colour palette',
      );
      const sidebar = page.locator('[role="tablist"][aria-label="Story Elements"]');
      const tabs    = sidebar.getByRole('tab');
      const count   = await tabs.count();
      for (let i = 7; i < count; i++) {
        const tab = tabs.nth(i);
        const [tx, ty] = await midpoint(tab);
        await glide(page, tx, ty, 22);
        await beat(page, 350);
        await tab.hover();
        await beat(page, 250);
        await tab.click();
        await hold(page, 900);
        await glide(page, tx + 90, midY, 20);
        await beat(page, 400);
      }
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT VII · Full-text search
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT VII — open full-text search (Ctrl+Shift+F)', async () => {
      await showCaption(page,
        'Full-Text Search',
        'Ctrl+Shift+F — search across every .rpy file simultaneously',
      );
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
        await showCaption(page,
          'Full-Text Search',
          'Results appear instantly as you type — matched lines across all 72 files',
        );
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
    // ACT VIII · Script Statistics
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT VIII — open Script Statistics panel', async () => {
      await showCaption(page,
        'Script Statistics',
        'Word counts, branching metrics, and asset coverage — powered by live analysis',
      );
      const statsBtn = page.getByLabel('Script Statistics');
      const [sx, sy] = await midpoint(statsBtn);
      await glide(page, sx, sy, 25);
      await beat(page, 600);
      await statsBtn.hover();
      await beat(page, 400);
      await statsBtn.click();
      await hold(page, 2200);
      await glide(page, midX, midY - 60, 25);
      await beat(page, 500);
      await glide(page, midX, midY + 80, 20);
      await beat(page, 600);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT IX · Translation Dashboard
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT IX — open Translation Dashboard', async () => {
      await showCaption(page,
        'Translation Dashboard',
        'Track translation coverage and generate language files for every dialogue string',
      );
      const translBtn  = page.getByLabel('Translation Dashboard');
      const [tx, ty]   = await midpoint(translBtn);
      await glide(page, tx, ty, 25);
      await beat(page, 600);
      await translBtn.hover();
      await beat(page, 400);
      await translBtn.click();
      await hold(page, 2200);
      await glide(page, midX, midY - 50, 25);
      await beat(page, 500);
      await glide(page, midX, midY + 80, 20);
      await beat(page, 600);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT X · Diagnostics panel
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT X — open Diagnostics panel', async () => {
      await showCaption(page,
        'Diagnostics',
        'Live analysis catches invalid label jumps, missing images, and unused variables',
      );
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
      await attempt(async () => {
        await showCaption(page,
          'Diagnostics',
          'Task board — create, complete, and track writing tasks alongside your code',
        );
        const tasksBtn = page.getByRole('button', { name: /Tasks/i });
        const [tx, ty] = await midpoint(tasksBtn);
        await glide(page, tx, ty, 20);
        await beat(page, 400);
        await tasksBtn.click();
        await hold(page, 1200);
      });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT XI · Warp to Label
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT XI — open Warp to Label modal', async () => {
      await showCaption(page,
        'Warp to Label',
        'Jump game execution to any label instantly — with guided variable setup',
      );
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
    // ACT XII · Settings
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT XII — open Settings', async () => {
      await showCaption(page,
        'Settings',
        'Themes, fonts, sidebar widths, and mouse gestures — fully configurable',
      );
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
    // ACT XIII · Keyboard Shortcuts
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT XIII — show Keyboard Shortcuts reference', async () => {
      await showCaption(page,
        'Keyboard Shortcuts',
        'Every shortcut organised by context — Canvas, Editor, Explorer, and more',
      );
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
        const [ddx, ddy] = await midpoint(dialog);
        await glide(page, ddx, ddy + 80, 25);
        await beat(page, 700);
        await page.keyboard.press('Escape');
        await beat(page, 900);
      }
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT XIV · The Finale
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT XIV — return to Project Canvas', async () => {
      await showCaption(page,
        'Project Canvas',
        'Back where it all begins — 90 blocks, 8 story stages, one canvas',
      );
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
      await showCaption(page,
        'Vangard Ren\'Py IDE',
        'Where your visual novel takes shape',
      );
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
      await smoothZoom(page, ox, oy, 600, 22);
      // Fade caption out partway through the zoom for a clean final frame
      await hideCaption(page);
      await hold(page, 3500);
    });
  });
});
