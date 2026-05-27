/**
 * Cinematic product demo walkthrough — Ren'Py IDE v1.0.0
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

const beat = (p: Page, ms = 750) => p.waitForTimeout(ms);
const hold = (p: Page, ms = 1700) => p.waitForTimeout(ms);
const glide = (p: Page, x: number, y: number, steps = 45) =>
  p.mouse.move(x, y, { steps });

async function midpoint(loc: Locator): Promise<[number, number]> {
  const box = await loc.boundingBox();
  return box ? [box.x + box.width / 2, box.y + box.height / 2] : [640, 400];
}

async function smoothZoom(
  p: Page, x: number, y: number, totalDelta: number, steps = 14,
) {
  await p.mouse.move(x, y);
  const chunk = totalDelta / steps;
  for (let i = 0; i < steps; i++) {
    await p.mouse.wheel(0, chunk);
    await p.waitForTimeout(28);
  }
}

async function panCanvas(
  p: Page, ariaLabel: string, dx: number, dy: number, durationSteps = 55,
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
 * Inject cursor, click-ripple, and caption overlays into the renderer.
 *
 * Caption is a full-width dark bar at the bottom of the viewport with large
 * turquoise text — unmistakably a presentation overlay, not part of the app.
 *
 * Control via window.__pwCap(label, body) / window.__pwCapHide().
 */
async function setupOverlays(p: Page): Promise<void> {
  await p.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* ── cursor ── */
      #pw-cursor {
        position: fixed;
        width: 36px; height: 36px;
        border-radius: 50%;
        background: rgba(255, 220, 0, 0.82);
        border: 3px solid rgba(180, 130, 0, 0.75);
        box-shadow: 0 2px 10px rgba(0,0,0,0.40);
        pointer-events: none;
        z-index: 2147483647;
        transform: translate(-50%, -50%);
        transition: width .07s ease, height .07s ease, background .07s ease;
      }
      #pw-cursor.pw-down {
        width: 24px; height: 24px;
        background: rgba(255,160,0,0.95);
        border-color: rgba(180,90,0,0.85);
      }
      /* ── click ripple ── */
      .pw-ripple {
        position: fixed;
        border-radius: 50%;
        border: 3px solid rgba(255,200,0,0.90);
        pointer-events: none;
        z-index: 2147483646;
        transform: translate(-50%,-50%);
        animation: pw-ripple-out 1.1s ease-out forwards;
      }
      @keyframes pw-ripple-out {
        from { width: 24px; height: 24px; opacity: 1; }
        to   { width: 90px; height: 90px; opacity: 0; }
      }
      /* ── caption: full-width turquoise subtitle bar ── */
      #pw-caption {
        position: fixed;
        bottom: 0; left: 0; right: 0;
        padding: 14px 80px 26px;
        background: rgba(0, 6, 18, 0.92);
        border-top: 3px solid rgba(29, 233, 213, 0.45);
        text-align: center;
        pointer-events: none;
        z-index: 2147483640;
        opacity: 0;
        transition: opacity 0.4s ease;
        font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      }
      #pw-caption.pw-vis { opacity: 1; }
      .pw-cap-lbl {
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.30em;
        text-transform: uppercase;
        color: rgba(29, 233, 213, 0.60);
        margin-bottom: 6px;
      }
      .pw-cap-body {
        font-size: 22px;
        font-weight: 500;
        color: #1de9d5;
        text-shadow: 0 0 22px rgba(29,233,213,0.45);
        line-height: 1.35;
      }
    `;
    document.head.appendChild(style);

    // cursor
    const cursor = document.createElement('div');
    cursor.id = 'pw-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top  = `${e.clientY}px`;
    }, { passive: true, capture: true });

    document.addEventListener('mousedown', (e: MouseEvent) => {
      cursor.classList.add('pw-down');
      const r = document.createElement('div');
      r.className = 'pw-ripple';
      r.style.left = `${e.clientX}px`;
      r.style.top  = `${e.clientY}px`;
      document.body.appendChild(r);
      r.addEventListener('animationend', () => r.remove(), { once: true });
    }, { capture: true });

    document.addEventListener('mouseup', () => {
      cursor.classList.remove('pw-down');
    }, { capture: true });

    // caption helpers
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
      void (el as HTMLElement).offsetHeight;
      el.classList.add('pw-vis');
    };

    (window as any).__pwCapHide = () => {
      const el = document.getElementById('pw-caption');
      if (el) el.classList.remove('pw-vis');
    };
  });
}

async function showCaption(p: Page, label: string, body: string): Promise<void> {
  await p.evaluate(
    ([lbl, bod]) => (window as any).__pwCap(lbl, bod),
    [label, body] as [string, string],
  );
}

async function hideCaption(p: Page): Promise<void> {
  await p.evaluate(() => (window as any).__pwCapHide());
}

async function attempt(action: () => Promise<void>): Promise<void> {
  try { await action(); } catch { /* element absent — skip */ }
}

// ── The walkthrough ───────────────────────────────────────────────────────────

test.describe('cinematic demo', () => {
  test.setTimeout(600_000);

  test("Ren'Py IDE — full feature walkthrough", async ({ window: page }) => {
    const vp   = page.viewportSize() ?? { width: 1280, height: 800 };
    const midX = Math.round(vp.width  / 2);
    const midY = Math.round(vp.height / 2);

    // ─────────────────────────────────────────────────────────────────────────
    // ACT I · The Project Canvas
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT I — project loads', async () => {
      await expect(page.locator('[data-block-id]').first()).toBeVisible({
        timeout: 60_000,
      });
      await setupOverlays(page);
      await showCaption(page,
        'Project Canvas',
        'Every script file mapped as a draggable block — your entire story at a glance',
      );
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
        await beat(page, 900);
        await showCaption(page,
          'Project Canvas',
          'One click fits the full project into view — auto-arranged as a narrative flow graph',
        );
      });
      await hold(page, 2000);
    });

    await test.step('slow pan across the full canvas', async () => {
      await showCaption(page,
        'Project Canvas',
        'Pan freely across all blocks spanning every chapter and story stage',
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
      await hideCaption(page);
      const block = page.locator('[data-block-id]').first();
      const [bx, by] = await midpoint(block);
      await glide(page, bx, by, 35);
      await beat(page, 700);
      await block.dblclick();
      await expect(page.locator('.monaco-editor').first()).toBeVisible({
        timeout: 12_000,
      });
      await beat(page, 700);
      await showCaption(page,
        'Monaco Editor',
        'Double-click any block to open it in a full Monaco code editor',
      );
      await hold(page, 2000);
    });

    await test.step('scroll through the code', async () => {
      const editor = page.locator('.monaco-editor').first();
      const box = await editor.boundingBox();
      if (box) {
        const ex = box.x + box.width / 2;
        const ey = box.y + 80;
        await glide(page, ex, ey, 30);
        await beat(page, 500);
        await showCaption(page,
          'Monaco Editor',
          "Ren'Py syntax highlighting, semantic analysis, and live error markers",
        );
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
    // ACT III · Flow Canvas
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT III — switch to Flow Canvas', async () => {
      await hideCaption(page);
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
      await beat(page, 900);
      await showCaption(page,
        'Flow Canvas',
        'Every label becomes a node — trace every narrative path through the story',
      );
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
    // ACT IV · Choices Canvas
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT IV — switch to Choices Canvas', async () => {
      await hideCaption(page);
      const switcher   = page.locator('[aria-label="Switch canvas"]');
      const choicesBtn = switcher.getByRole('button').nth(2);
      const [cx, cy]   = await midpoint(choicesBtn);
      await glide(page, cx, cy, 30);
      await beat(page, 600);
      await choicesBtn.hover();
      await beat(page, 500);
      await choicesBtn.click();
      await expect(
        page.locator('[aria-label="Walkthrough debugger canvas"]'),
      ).toBeVisible({ timeout: 12_000 });
      await beat(page, 900);
      await showCaption(page,
        'Choices Canvas',
        'Player decisions as a four-column tree: labels → choices → targets',
      );
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
    // ACT V · Story Elements sidebar — all panels including Scene Composer
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT V — return to Project Canvas', async () => {
      await hideCaption(page);
      const switcher   = page.locator('[aria-label="Switch canvas"]');
      const projectBtn = switcher.getByRole('button').first();
      await glide(page, ...(await midpoint(projectBtn)), 30);
      await beat(page, 500);
      await projectBtn.click();
      await expect(page.locator('[aria-label="Story canvas"]')).toBeVisible({
        timeout: 10_000,
      });
      await hold(page);
    });

    await test.step('Characters, Variables and Screens panels', async () => {
      const sidebar = page.locator('[role="tablist"][aria-label="Story Elements"]');
      const tabs    = sidebar.getByRole('tab');
      for (let i = 0; i <= 2; i++) {
        const tab = tabs.nth(i);
        const [tx, ty] = await midpoint(tab);
        await glide(page, tx, ty, 22);
        await beat(page, 350);
        await tab.click();
        await beat(page, 500);
        if (i === 0) {
          await showCaption(page,
            'Story Elements',
            'Characters, variables, and screen definitions — all in one sidebar',
          );
        }
        await hold(page, 900);
        await glide(page, tx + 90, midY, 20);
        await beat(page, 400);
      }
    });

    await test.step('Images panel — browse and double-click m.png', async () => {
      const sidebar   = page.locator('[role="tablist"][aria-label="Story Elements"]');
      const imagesTab = sidebar.getByRole('tab', { name: 'Images' });
      const [tx, ty]  = await midpoint(imagesTab);
      await glide(page, tx, ty, 22);
      await beat(page, 400);
      await hideCaption(page);
      await imagesTab.click();
      await beat(page, 700);
      await showCaption(page,
        'Image Manager',
        'Browse, tag, and organise every image in the project',
      );
      await hold(page, 1200);

      await attempt(async () => {
        const mEntry = page.getByText('m.png', { exact: false }).first();
        await mEntry.waitFor({ state: 'visible', timeout: 5_000 });
        const [ix, iy] = await midpoint(mEntry);
        await glide(page, ix, iy, 28);
        await beat(page, 700);
        await hideCaption(page);
        await mEntry.dblclick();
        await beat(page, 1000);
        await showCaption(page,
          'Image Viewer',
          'Double-click any image to open a full-resolution viewer with zoom, pan, and metadata',
        );
        await hold(page, 2000);
        await glide(page, midX - 80, midY, 25);
        await beat(page, 500);
        await glide(page, midX + 80, midY, 25);
        await hold(page, 1000);
      });
    });

    await test.step('Audio panel', async () => {
      const sidebar  = page.locator('[role="tablist"][aria-label="Story Elements"]');
      const audioTab = sidebar.getByRole('tab').nth(4);
      const [tx, ty] = await midpoint(audioTab);
      await glide(page, tx, ty, 22);
      await beat(page, 400);
      await hideCaption(page);
      await audioTab.click();
      await beat(page, 600);
      await showCaption(page,
        'Audio Manager',
        'Browse and preview every audio track in the project',
      );
      await hold(page, 1300);
      await glide(page, tx + 90, midY, 20);
      await beat(page, 400);
    });

    await test.step('Scene Compositions panel — list and open Garden', async () => {
      const sidebar   = page.locator('[role="tablist"][aria-label="Story Elements"]');
      const scenesTab = sidebar.getByRole('tab', { name: 'Scene Compositions' });
      const [tx, ty]  = await midpoint(scenesTab);
      await glide(page, tx, ty, 25);
      await beat(page, 400);
      await hideCaption(page);
      await scenesTab.click();
      await beat(page, 700);
      await showCaption(page,
        'Scene Composer',
        'Visual scene builder — compose backgrounds and sprites with real-time preview',
      );
      await hold(page, 1200);

      // Glide over the composition list to show all three entries
      await glide(page, 120, midY - 60, 20);
      await beat(page, 400);
      await glide(page, 120, midY + 60, 20);
      await beat(page, 400);

      await attempt(async () => {
        const gardenEntry = page.getByText('Garden', { exact: true }).first();
        await gardenEntry.waitFor({ state: 'visible', timeout: 5_000 });
        const [gx, gy] = await midpoint(gardenEntry);
        await glide(page, gx, gy, 25);
        await beat(page, 600);
        await hideCaption(page);
        await gardenEntry.click();
        await beat(page, 1200);
        await showCaption(page,
          'Scene Composer',
          'Background and multiple sprites — each positioned and layered visually',
        );

        const preview = page.locator('canvas').first();
        const box     = await preview.boundingBox().catch(() => null);
        if (!box) return;

        await hold(page, 1800);
        await glide(page, box.x + box.width * 0.15, box.y + box.height * 0.6, 30);
        await beat(page, 600);
        await glide(page, box.x + box.width * 0.85, box.y + box.height * 0.6, 50);
        await hold(page, 1000);

        // Drag Maya's sprite
        await hideCaption(page);
        await beat(page, 300);
        await showCaption(page,
          'Scene Composer',
          'Drag sprites to reposition — scale, flip, and apply colour effects in real time',
        );
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
        await page.keyboard.press('Control+Z');
        await beat(page, 600);
      });
    });

    await test.step('Image Maps panel — open imagemap_1 and select hotspots', async () => {
      const sidebar      = page.locator('[role="tablist"][aria-label="Story Elements"]');
      const imageMapsTab = sidebar.getByRole('tab', { name: 'Image Maps' });
      const [tx, ty]     = await midpoint(imageMapsTab);
      await glide(page, tx, ty, 22);
      await beat(page, 400);
      await hideCaption(page);
      await imageMapsTab.click();
      await beat(page, 700);
      await showCaption(page,
        'Image Maps',
        'Draw clickable hotspot regions over any background image',
      );
      await hold(page, 1000);

      await attempt(async () => {
        const mapEntry = page.getByText('imagemap_1', { exact: false }).first();
        await mapEntry.waitFor({ state: 'visible', timeout: 5_000 });
        const [mx, my] = await midpoint(mapEntry);
        await glide(page, mx, my, 25);
        await beat(page, 600);
        await hideCaption(page);
        await mapEntry.click();
        await beat(page, 1200);
        await showCaption(page,
          'Imagemap Composer',
          'Multiple hotspots — click to select, drag to resize, wire each to a story label',
        );
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
          const cbox   = await canvas.boundingBox();
          if (cbox) {
            const p1x = cbox.x + cbox.width * 0.28;
            const p1y = cbox.y + cbox.height * 0.45;
            await glide(page, p1x, p1y, 30);
            await beat(page, 500);
            await page.mouse.click(p1x, p1y);
            await hold(page, 1300);
            const p2x = cbox.x + cbox.width * 0.62;
            const p2y = cbox.y + cbox.height * 0.55;
            await glide(page, p2x, p2y, 30);
            await beat(page, 500);
            await page.mouse.click(p2x, p2y);
            await hold(page, 1300);
          }
        }
      });
    });

    await test.step('Screen Layouts, Snippets, Menu Templates and Colour Palette', async () => {
      const sidebar = page.locator('[role="tablist"][aria-label="Story Elements"]');
      const tabs    = sidebar.getByRole('tab');
      const count   = await tabs.count();
      let captionShown = false;
      for (let i = 7; i < count; i++) {
        const tab = tabs.nth(i);
        const [tx, ty] = await midpoint(tab);
        await glide(page, tx, ty, 22);
        await beat(page, 350);
        await hideCaption(page);
        await tab.hover();
        await beat(page, 250);
        await tab.click();
        await beat(page, 500);
        if (!captionShown) {
          await showCaption(page,
            'Story Elements',
            'Screen layouts, code snippets, menu templates, and colour palette',
          );
          captionShown = true;
        }
        await hold(page, 900);
        await glide(page, tx + 90, midY, 20);
        await beat(page, 400);
      }
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT VI · Full-text search
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT VI — open full-text search (Ctrl+Shift+F)', async () => {
      await hideCaption(page);
      await glide(page, midX, midY, 20);
      await beat(page, 400);
      await page.keyboard.press('Control+Shift+F');
      await beat(page, 900);
      await showCaption(page,
        'Full-Text Search',
        'Ctrl+Shift+F — search across every .rpy file simultaneously',
      );
      await hold(page, 1000);
    });

    await test.step('search for "echo" and browse results', async () => {
      await attempt(async () => {
        const input = page.getByPlaceholder(/search/i).first();
        await input.waitFor({ state: 'visible', timeout: 4_000 });
        await input.click();
        await beat(page, 350);
        await page.keyboard.type('echo', { delay: 90 });
        await beat(page, 600);
        await showCaption(page,
          'Full-Text Search',
          'Results appear instantly as you type — matched lines across every file',
        );
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
    // ACT VII · Script Statistics
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT VII — open Script Statistics panel', async () => {
      await hideCaption(page);
      const statsBtn = page.getByLabel('Script Statistics');
      const [sx, sy] = await midpoint(statsBtn);
      await glide(page, sx, sy, 25);
      await beat(page, 600);
      await statsBtn.hover();
      await beat(page, 400);
      await statsBtn.click();
      await beat(page, 900);
      await showCaption(page,
        'Script Statistics',
        'Word counts, branching metrics, and asset coverage — powered by live analysis',
      );
      await hold(page, 2200);
      await glide(page, midX, midY - 60, 25);
      await beat(page, 500);
      await glide(page, midX, midY + 80, 20);
      await beat(page, 600);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT VIII · Translation Dashboard
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT VIII — open Translation Dashboard', async () => {
      await hideCaption(page);
      const translBtn = page.getByLabel('Translation Dashboard');
      const [tx, ty]  = await midpoint(translBtn);
      await glide(page, tx, ty, 25);
      await beat(page, 600);
      await translBtn.hover();
      await beat(page, 400);
      await translBtn.click();
      await beat(page, 900);
      await showCaption(page,
        'Translation Dashboard',
        'Track translation coverage and generate language files for every dialogue string',
      );
      await hold(page, 2200);
      await glide(page, midX, midY - 50, 25);
      await beat(page, 500);
      await glide(page, midX, midY + 80, 20);
      await beat(page, 600);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT IX · Diagnostics panel
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT IX — open Diagnostics panel', async () => {
      await hideCaption(page);
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
      await beat(page, 700);
      await showCaption(page,
        'Diagnostics',
        'Live analysis catches invalid label jumps, missing images, and unused variables',
      );
      await hold(page, 2200);
      await glide(page, midX, midY + 60, 25);
      await beat(page, 600);
      await glide(page, midX, midY + 130, 20);
      await beat(page, 500);

      await attempt(async () => {
        const tasksBtn = page.getByRole('button', { name: /Tasks/i });
        const [btx, bty] = await midpoint(tasksBtn);
        await glide(page, btx, bty, 20);
        await beat(page, 400);
        await hideCaption(page);
        await tasksBtn.click();
        await beat(page, 600);
        await showCaption(page,
          'Diagnostics',
          'Task board — create, complete, and track writing tasks alongside your code',
        );
        await hold(page, 1200);
      });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT X · Warp to Label
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT X — open Warp to Label modal', async () => {
      await hideCaption(page);
      const warpBtn  = page.getByLabel('Warp to Label');
      const [wx, wy] = await midpoint(warpBtn);
      await glide(page, wx, wy, 25);
      await beat(page, 600);
      await warpBtn.hover();
      await beat(page, 400);
      await warpBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 8_000 });
      await beat(page, 700);
      await showCaption(page,
        'Warp to Label',
        'Jump game execution to any label instantly — with guided variable setup',
      );
      await hold(page, 1500);
    });

    await test.step('drift through the label list', async () => {
      const dialog   = page.getByRole('dialog');
      const [ddx, ddy] = await midpoint(dialog);
      await glide(page, ddx, ddy - 80, 25);
      await beat(page, 600);
      await glide(page, ddx, ddy + 80, 25);
      await beat(page, 700);
      await page.keyboard.press('Escape');
      await beat(page, 900);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT XI · Settings
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT XI — open Settings', async () => {
      await hideCaption(page);
      const settingsBtn = page.getByLabel('Settings');
      const [sx, sy]    = await midpoint(settingsBtn);
      await glide(page, sx, sy, 25);
      await beat(page, 600);
      await settingsBtn.hover();
      await beat(page, 400);
      await settingsBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 8_000 });
      await beat(page, 700);
      await showCaption(page,
        'Settings',
        'Themes, fonts, sidebar widths, and mouse gestures — fully configurable',
      );
      await hold(page, 2200);
    });

    await test.step('browse settings panels', async () => {
      const dialog   = page.getByRole('dialog');
      const [ddx, ddy] = await midpoint(dialog);
      await glide(page, ddx, ddy - 80, 25);
      await beat(page, 500);
      await glide(page, ddx, ddy + 80, 25);
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
    // ACT XII · Keyboard Shortcuts
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT XII — show Keyboard Shortcuts reference', async () => {
      await hideCaption(page);
      const kbBtn    = page.getByLabel('Keyboard Shortcuts');
      const [kx, ky] = await midpoint(kbBtn);
      await glide(page, kx, ky, 25);
      await beat(page, 600);
      await kbBtn.hover();
      await beat(page, 400);
      await kbBtn.click();
      const dialog = page.getByRole('dialog');
      if (await dialog.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await beat(page, 700);
        await showCaption(page,
          'Keyboard Shortcuts',
          'Every shortcut organised by context — Canvas, Editor, Explorer, and more',
        );
        await hold(page, 2200);
        const [ddx, ddy] = await midpoint(dialog);
        await glide(page, ddx, ddy + 80, 25);
        await beat(page, 700);
        await page.keyboard.press('Escape');
        await beat(page, 900);
      }
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ACT XIII · The Finale
    // ─────────────────────────────────────────────────────────────────────────

    await test.step('ACT XIII — return to Project Canvas', async () => {
      await hideCaption(page);
      const switcher   = page.locator('[aria-label="Switch canvas"]');
      const projectBtn = switcher.getByRole('button').first();
      const [px, py]   = await midpoint(projectBtn);
      await glide(page, px, py, 30);
      await beat(page, 500);
      await projectBtn.click();
      await expect(page.locator('[aria-label="Story canvas"]')).toBeVisible({
        timeout: 10_000,
      });
      await beat(page, 900);
      await showCaption(page,
        'Project Canvas',
        'Back where it all begins — every script file, every story stage, one canvas',
      );
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
        await beat(page, 900);
        await showCaption(page,
          "Vangard Ren'Py IDE",
          'Where your visual novel takes shape',
        );
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
      await hideCaption(page);
      await hold(page, 3500);
    });
  });
});
