import { testWithProject as test, expect } from '../electron-fixture';

test.describe('reopen closed tab', () => {
  test('Ctrl+Shift+T reopens the most recently closed tab and focuses it', async ({ window }) => {
    const block = window.locator('[data-block-id]').first();
    await expect(block).toBeVisible({ timeout: 30_000 });

    const closeTabButtons = window.getByLabel('Close tab');
    const initialCount = await closeTabButtons.count();

    // Open an editor tab
    await block.dblclick();
    await expect(closeTabButtons).toHaveCount(initialCount + 1, { timeout: 10_000 });
    await expect(window.locator('.monaco-editor')).toBeVisible({ timeout: 10_000 });

    // Close it
    await closeTabButtons.last().click();
    await expect(closeTabButtons).toHaveCount(initialCount, { timeout: 5_000 });
    await expect(window.locator('.monaco-editor')).not.toBeVisible({ timeout: 5_000 });

    // Reopen via Ctrl+Shift+T
    await window.keyboard.press('Control+Shift+T');
    await expect(closeTabButtons).toHaveCount(initialCount + 1, { timeout: 5_000 });
    await expect(window.locator('.monaco-editor')).toBeVisible({ timeout: 5_000 });
  });

  test('Ctrl+Shift+T is a no-op when there is nothing to reopen', async ({ window }) => {
    const block = window.locator('[data-block-id]').first();
    await expect(block).toBeVisible({ timeout: 30_000 });

    const closeTabButtons = window.getByLabel('Close tab');
    const initialCount = await closeTabButtons.count();

    await window.keyboard.press('Control+Shift+T');
    // Give any (incorrect) handler a moment to act, then assert nothing changed.
    await window.waitForTimeout(300);
    await expect(closeTabButtons).toHaveCount(initialCount);
  });
});
