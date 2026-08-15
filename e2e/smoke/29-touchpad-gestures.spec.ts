import { testWithProject as test, expect } from '../electron-fixture';

// Regression coverage for review-hardening risk: "touchpad gestures"
// (bmf-vangard-renpy-ide-6o47.6). StoryCanvas.tsx's handleWheel zooms on every
// wheel event regardless of ctrlKey (no distinct pinch-to-zoom vs. two-finger-pan
// branch); panning is bound to a configurable gesture (default: shift+drag) via
// mouseGestures in Settings. These tests pin that behavior down so a future
// refactor can't silently change it without a test failure, and document the
// default UX for a touchpad user (plain two-finger scroll always zooms; panning
// needs Shift held or a settings change).

/** Reads the live canvas pan/zoom transform applied to the block-layer div
 *  (StoryCanvas.tsx: `transform: translate(x, y) scale(s)`). There's no
 *  data-testid for it, so locate it structurally: the nearest ancestor of a
 *  canvas block whose inline style contains a CSS transform. */
async function readCanvasTransform(window: import('playwright/test').Page) {
  const raw = await window.evaluate(() => {
    const block = document.querySelector('[data-block-id]');
    let el = block?.parentElement ?? null;
    while (el) {
      if (el.style.transform && el.style.transform.includes('scale')) return el.style.transform;
      el = el.parentElement;
    }
    return null;
  });
  expect(raw, 'canvas transform element not found').not.toBeNull();
  const match = raw!.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)\s*scale\(([-\d.]+)\)/);
  expect(match, `unexpected transform format: ${raw}`).not.toBeNull();
  const [, x, y, scale] = match!;
  return { x: parseFloat(x), y: parseFloat(y), scale: parseFloat(scale) };
}

test.describe('touchpad gestures', () => {
  test('a plain two-finger scroll (wheel, no modifier keys) zooms the canvas', async ({ window }) => {
    const block = window.locator('[data-block-id]').first();
    await expect(block).toBeVisible({ timeout: 30_000 });

    const before = await readCanvasTransform(window);

    const canvasRoot = window.getByRole('application', { name: 'Story canvas' });
    const rootBox = await canvasRoot.boundingBox();
    expect(rootBox).not.toBeNull();
    await window.mouse.move(rootBox!.x + rootBox!.width - 40, rootBox!.y + rootBox!.height - 40);
    // Negative deltaY == scrolling "up" == zoom in, per handleWheel's
    // `1 - deltaY * 0.002 * sensitivity * direction` formula.
    await window.mouse.wheel(0, -200);
    await window.mouse.wheel(0, -200);

    const after = await readCanvasTransform(window);
    expect(after.scale).toBeGreaterThan(before.scale);
  });

  test('scrolling further out clamps at the minimum zoom (0.2x) instead of growing unbounded', async ({ window }) => {
    const block = window.locator('[data-block-id]').first();
    await expect(block).toBeVisible({ timeout: 30_000 });

    const box = await block.boundingBox();
    await window.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    // Scroll "down" repeatedly (zoom out) far past the clamp.
    for (let i = 0; i < 40; i++) {
      await window.mouse.wheel(0, 400);
    }

    const after = await readCanvasTransform(window);
    expect(after.scale).toBeCloseTo(0.2, 2);
  });

  test('Shift+drag pans the canvas (default canvasPanGesture) without changing zoom', async ({ window }) => {
    const block = window.locator('[data-block-id]').first();
    await expect(block).toBeVisible({ timeout: 30_000 });

    const before = await readCanvasTransform(window);

    // Drag from a corner of the canvas root, far from any block, so this
    // exercises the canvas pan gesture rather than a block drag.
    const canvasRoot = window.getByRole('application', { name: 'Story canvas' });
    const rootBox = await canvasRoot.boundingBox();
    expect(rootBox).not.toBeNull();
    const startX = rootBox!.x + rootBox!.width - 40;
    const startY = rootBox!.y + rootBox!.height - 40;

    await window.keyboard.down('Shift');
    await window.mouse.move(startX, startY);
    await window.mouse.down();
    await window.mouse.move(startX + 120, startY + 80, { steps: 8 });
    await window.mouse.up();
    await window.keyboard.up('Shift');

    const after = await readCanvasTransform(window);
    expect(after.x).not.toBeCloseTo(before.x, 0);
    expect(after.y).not.toBeCloseTo(before.y, 0);
    expect(after.scale).toBeCloseTo(before.scale, 5);
  });
});
