import { testWithProject as test, expect } from '../electron-fixture';

test.describe('new block modal', () => {
  test('opens when the New Scene toolbar button is clicked', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.getByLabel('New Scene').click();

    await expect(window.getByRole('dialog')).toBeVisible({ timeout: 5_000 });
    await expect(window.getByRole('heading', { name: 'New Scene' })).toBeVisible({ timeout: 5_000 });
  });

  test('shows Story, Screen, and Config block type buttons', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });
    await window.getByLabel('New Scene').click();
    await expect(window.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

    const dialog = window.getByRole('dialog');
    await expect(dialog.getByRole('button', { name: 'Story', exact: true })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Screen', exact: true })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Config', exact: true })).toBeVisible();
  });

  test('shows the name input field', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });
    await window.getByLabel('New Scene').click();
    await expect(window.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

    // The input for the file name (without .rpy) should be auto-focused
    const nameInput = window.locator('input[type="text"]').first();
    await expect(nameInput).toBeVisible();
  });

  test('name input updates the code preview', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });
    await window.getByLabel('New Scene').click();
    await expect(window.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

    const nameInput = window.locator('input[type="text"]').first();
    await nameInput.fill('my_test_scene');

    // Code preview shows the entered label name
    await expect(window.getByText('label my_test_scene:')).toBeVisible();
  });

  test('closes when Escape is pressed', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });
    await window.getByLabel('New Scene').click();
    await expect(window.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

    await window.keyboard.press('Escape');

    await expect(window.getByRole('dialog')).not.toBeVisible({ timeout: 3_000 });
  });

  test('switching block type to Screen updates the preview', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });
    await window.getByLabel('New Scene').click();
    await expect(window.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

    const dialog = window.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Screen', exact: true }).click();

    // After switching to Screen type, the Story-specific 'label …:' preview is gone
    await expect(dialog.getByText(/label \w+:/)).not.toBeVisible({ timeout: 3_000 });
  });
});
