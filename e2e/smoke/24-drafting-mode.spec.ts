import { testWithProject as test, expect } from '../electron-fixture';

test.describe('drafting mode', () => {
  test('Drafting Mode toggle button is visible in the toolbar', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await expect(
      window.getByLabel('Enable Drafting Mode').or(window.getByLabel('Disable Drafting Mode')).first()
    ).toBeVisible({ timeout: 5_000 });
  });

  test('clicking the toggle enables Drafting Mode', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    const enableBtn = window.getByLabel('Enable Drafting Mode');
    await expect(enableBtn).toBeVisible({ timeout: 5_000 });

    await enableBtn.click();

    await expect(window.getByLabel('Disable Drafting Mode')).toBeVisible({ timeout: 3_000 });
  });

  test('clicking the toggle again disables Drafting Mode', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    // Enable it
    const enableBtn = window.getByLabel('Enable Drafting Mode');
    if (await enableBtn.isVisible()) await enableBtn.click();
    await expect(window.getByLabel('Disable Drafting Mode')).toBeVisible({ timeout: 3_000 });

    // Disable it
    await window.getByLabel('Disable Drafting Mode').click();

    await expect(window.getByLabel('Enable Drafting Mode')).toBeVisible({ timeout: 3_000 });
  });
});
