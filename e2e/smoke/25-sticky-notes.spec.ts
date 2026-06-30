import { testWithProject as test, expect } from '../electron-fixture';

test.describe('sticky notes', () => {
  test('Add sticky note button is visible in the toolbar', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await expect(window.getByLabel('Add sticky note')).toBeVisible({ timeout: 5_000 });
  });

  test('clicking Add sticky note adds a sticky note to the Project Canvas', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.getByLabel('Add sticky note').click();

    await expect(window.locator('.sticky-note-wrapper').first()).toBeVisible({ timeout: 5_000 });
  });

  test('sticky note has a delete button', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.getByLabel('Add sticky note').click();
    await expect(window.locator('.sticky-note-wrapper').first()).toBeVisible({ timeout: 5_000 });

    await expect(window.getByLabel('Delete note').first()).toBeVisible({ timeout: 3_000 });
  });

  test('sticky note has a color picker button', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.getByLabel('Add sticky note').click();
    await expect(window.locator('.sticky-note-wrapper').first()).toBeVisible({ timeout: 5_000 });

    await expect(window.getByLabel('Change note color').first()).toBeVisible({ timeout: 3_000 });
  });

  test('adding multiple sticky notes creates multiple wrappers', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.getByLabel('Add sticky note').click();
    await window.getByLabel('Add sticky note').click();

    await expect(window.locator('.sticky-note-wrapper')).toHaveCount(2, { timeout: 5_000 });
  });

  test('switching to Flow Canvas allows adding sticky notes there too', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.locator('[data-tutorial="canvas-tabs"]').getByLabel('Flow Canvas').click();
    await expect(window.locator('[aria-label="Route canvas"]')).toBeVisible({ timeout: 10_000 });

    await window.getByLabel('Add sticky note').click();

    await expect(window.locator('.sticky-note-wrapper').first()).toBeVisible({ timeout: 5_000 });
  });
});
