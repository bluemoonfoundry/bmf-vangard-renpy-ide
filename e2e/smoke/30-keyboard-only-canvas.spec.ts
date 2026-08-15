import { testWithDemoProject as test, expect } from '../electron-fixture';

// Regression coverage for review-hardening risk: "keyboard-only canvas use"
// (bmf-vangard-renpy-ide-6o47.6). Drives the Project Canvas using only Tab,
// arrow keys, Enter, and Escape — no mouse — per StoryCanvas.tsx's
// handleCanvasKeyDown (spatial arrow-key navigation between blocks, Enter to
// open the focused block, Escape to clear selection). Uses the DemoProject
// fixture (7 blocks) so arrow-key spatial navigation has real neighbors to
// move between.

test.describe('keyboard-only canvas use', () => {
  test('Tab reaches a canvas block and Enter opens it in the editor, all without a mouse', async ({ window }) => {
    const anyBlock = window.locator('[data-block-id]').first();
    await expect(anyBlock).toBeVisible({ timeout: 30_000 });
    // Baseline tab count — the app ships several always-open static tabs
    // (canvas, diagnostics, punch list, ...; see 12-static-tabs.spec.ts), so
    // this is not 0.
    const closeTabButtons = window.getByLabel('Close tab');
    const initialTabCount = await closeTabButtons.count();

    // Tab from the top of the document until a canvas block is focused.
    // The app's toolbar, left/right sidebars, and filter panel all sit earlier
    // in tab order than the canvas blocks, so this needs a generous ceiling.
    let focusedBlockId: string | null = null;
    for (let i = 0; i < 80 && !focusedBlockId; i++) {
      await window.keyboard.press('Tab');
      focusedBlockId = await window.evaluate(() =>
        document.activeElement?.getAttribute('data-block-id') ?? null
      );
    }
    expect(focusedBlockId, 'Tab never reached a canvas block').not.toBeNull();

    await window.keyboard.press('Enter');

    await expect(closeTabButtons).toHaveCount(initialTabCount + 1, { timeout: 10_000 });
    await expect(window.locator('.monaco-editor').first()).toBeVisible({ timeout: 10_000 });
  });

  test('arrow keys move selection spatially between blocks on the canvas', async ({ window }) => {
    const firstBlock = window.locator('[data-block-id]').first();
    await expect(firstBlock).toBeVisible({ timeout: 30_000 });
    await firstBlock.focus();

    const startId = await window.evaluate(() => document.activeElement?.getAttribute('data-block-id') ?? null);
    expect(startId).not.toBeNull();

    // Press every arrow direction — StoryCanvas.tsx's dirMap covers all four —
    // at least one must move focus to a different block (spatial nearest-neighbor).
    let movedId: string | null = null;
    for (const key of ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp']) {
      await window.keyboard.press(key);
      const currentId = await window.evaluate(() => document.activeElement?.getAttribute('data-block-id') ?? null);
      if (currentId && currentId !== startId) {
        movedId = currentId;
        break;
      }
    }
    expect(movedId, 'no arrow key moved focus to a neighboring block').not.toBeNull();

    // The a11y live region (StoryCanvas.tsx's announceLiveRef) should announce
    // the newly focused block for screen-reader users navigating without a mouse.
    await expect(window.locator('[role="status"][aria-live="polite"]')).toContainText(/focused/i, { timeout: 5_000 });
  });

  test('Escape clears the current selection without needing a mouse click elsewhere', async ({ window }) => {
    const firstBlock = window.locator('[data-block-id]').first();
    await expect(firstBlock).toBeVisible({ timeout: 30_000 });
    await firstBlock.focus();
    await window.keyboard.press('ArrowRight');

    await window.keyboard.press('Escape');

    await expect(window.locator('[role="status"][aria-live="polite"]')).toContainText(/selection cleared/i, { timeout: 5_000 });
  });
});
