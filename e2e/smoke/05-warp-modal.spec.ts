import { testWithProject as test, expect } from '../electron-fixture';

test.describe('warp to label', () => {
  test('clicking Warp to Label opens the label search modal', async ({ window }) => {
    // Wait for the project to finish loading
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    // Click the Warp to Label toolbar button
    await window.getByLabel('Warp to Label').click();

    // The GoToLabelModal renders as a dialog with role="dialog"
    await expect(window.getByRole('dialog')).toBeVisible({ timeout: 10_000 });
  });

  test('warp modal can be dismissed with Escape', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.getByLabel('Warp to Label').click();
    await expect(window.getByRole('dialog')).toBeVisible({ timeout: 10_000 });

    await window.keyboard.press('Escape');
    await expect(window.getByRole('dialog')).not.toBeVisible({ timeout: 5_000 });
  });
});
