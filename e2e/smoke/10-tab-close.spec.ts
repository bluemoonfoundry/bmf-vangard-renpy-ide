import { testWithProject as test, expect } from '../electron-fixture';

test.describe('tab close', () => {
  test('closing an editor tab removes it from the tab bar', async ({ window }) => {
    const block = window.locator('[data-block-id]').first();
    await expect(block).toBeVisible({ timeout: 30_000 });

    const closeTabButtons = window.getByLabel('Close tab');
    const initialCount = await closeTabButtons.count();

    // Open an editor tab
    await block.dblclick();
    await expect(closeTabButtons).toHaveCount(initialCount + 1, { timeout: 10_000 });

    // Close the newly opened tab (last close button)
    await closeTabButtons.last().click();
    await expect(closeTabButtons).toHaveCount(initialCount, { timeout: 5_000 });

    // Monaco editor should no longer be visible
    await expect(window.locator('.monaco-editor')).not.toBeVisible({ timeout: 5_000 });
  });
});
