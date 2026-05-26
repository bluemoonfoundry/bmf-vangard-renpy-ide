import { testWithProject as test, expect } from '../electron-fixture';

test.describe('diagnostics panel', () => {
  test('clicking the Diagnostics toolbar button opens the diagnostics panel', async ({ window }) => {
    // Wait for the project to finish loading
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    // Open the diagnostics panel via the toolbar
    await window.getByLabel('Diagnostics').click();

    // The panel has Issues and Tasks toggle buttons
    await expect(window.getByRole('button', { name: 'Issues' })).toBeVisible({ timeout: 10_000 });
    await expect(window.getByRole('button', { name: /Tasks/ })).toBeVisible({ timeout: 5_000 });
  });
});
