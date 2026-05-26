import { testWithProject as test, expect } from '../electron-fixture';

test.describe('file tab', () => {
  test('double-clicking a canvas block opens the file in a Monaco editor tab', async ({ window }) => {
    // Wait for canvas and blocks
    const block = window.locator('[data-block-id]').first();
    await expect(block).toBeVisible({ timeout: 30_000 });

    // The default tab bar has one tab (Project Canvas). After opening a file
    // there should be a second tab — tracked by a new Close tab button.
    const closeTabButtons = window.getByLabel('Close tab');
    const initialTabCount = await closeTabButtons.count();

    // Double-click the block to open it in an editor tab
    await block.dblclick();

    // A new editor tab should have been added
    await expect(closeTabButtons).toHaveCount(initialTabCount + 1, { timeout: 10_000 });

    // The Monaco editor should be visible in the new tab
    await expect(window.locator('.monaco-editor').first()).toBeVisible({ timeout: 10_000 });
  });
});
