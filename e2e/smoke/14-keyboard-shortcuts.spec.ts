import { testWithProject as test, expect } from '../electron-fixture';

test.describe('keyboard shortcuts modal', () => {
  test('opens when the Keyboard Shortcuts toolbar button is clicked', async ({ window }) => {
    await window.getByLabel('Keyboard Shortcuts').click();

    await expect(window.getByRole('dialog')).toBeVisible({ timeout: 5_000 });
    await expect(window.getByRole('heading', { name: 'Keyboard Shortcuts' })).toBeVisible({ timeout: 5_000 });
  });

  test('shows keyboard shortcut entries', async ({ window }) => {
    await window.getByLabel('Keyboard Shortcuts').click();

    // The modal lists shortcuts — Ctrl and Esc are always shown
    await expect(window.getByText('Ctrl').first()).toBeVisible({ timeout: 5_000 });
  });

  test('closes with Escape key', async ({ window }) => {
    await window.getByLabel('Keyboard Shortcuts').click();
    await expect(window.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

    await window.keyboard.press('Escape');

    await expect(window.getByRole('dialog')).not.toBeVisible({ timeout: 3_000 });
  });

  test('closes with the close button', async ({ window }) => {
    await window.getByLabel('Keyboard Shortcuts').click();
    await expect(window.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

    await window.getByRole('dialog').getByLabel('Close').click();

    await expect(window.getByRole('dialog')).not.toBeVisible({ timeout: 3_000 });
  });
});
