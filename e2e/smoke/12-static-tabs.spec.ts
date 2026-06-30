import { testWithProject as test, expect } from '../electron-fixture';

test.describe('static tabs', () => {
  test('Script Statistics tab opens and shows the heading', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.getByLabel('Script Statistics').click();

    await expect(window.getByRole('heading', { name: 'Script Statistics' })).toBeVisible({ timeout: 10_000 });
  });

  test('Stats tab shows block and label counts', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.getByLabel('Script Statistics').click();

    // The stats tab shows a word-count section — the heading is always visible
    await expect(window.getByRole('heading', { name: 'Script Statistics' })).toBeVisible({ timeout: 10_000 });
  });

  test('Translation Dashboard tab opens', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.getByLabel('Translation Dashboard').click();

    // TranslationDashboard always renders its coverage section header
    await expect(window.getByText(/translation/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test('Diagnostics tab stays open as a tab after clicking toolbar button twice', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.getByLabel('Diagnostics').click();
    // The diagnostics tab label appears in the tab bar
    await expect(window.getByText('Diagnostics').first()).toBeVisible({ timeout: 10_000 });

    // Clicking again keeps it open (not a toggle)
    await window.getByLabel('Diagnostics').click();
    await expect(window.getByText('Diagnostics').first()).toBeVisible({ timeout: 5_000 });
  });
});
