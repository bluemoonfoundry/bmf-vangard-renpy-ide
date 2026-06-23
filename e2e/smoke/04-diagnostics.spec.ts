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

  test('clicking an issue\'s Open button navigates to the offending file', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.getByLabel('Diagnostics').click();
    await expect(window.getByRole('button', { name: 'Issues' })).toBeVisible({ timeout: 10_000 });

    // The fixture project has a deliberate `jump nonexistent_label` in
    // script.rpy, which surfaces as an "Invalid Jump" issue with a
    // clickable "Open script.rpy:<line>" navigation button.
    const openButton = window.getByLabel(/^Open script\.rpy/);
    await expect(openButton).toBeVisible({ timeout: 10_000 });
    await openButton.click();

    await expect(window.locator('.monaco-editor').first()).toBeVisible({ timeout: 10_000 });
  });
});
