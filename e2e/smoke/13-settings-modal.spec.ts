import { testWithProject as test, expect } from '../electron-fixture';

test.describe('settings modal', () => {
  test('opens when the Settings toolbar button is clicked', async ({ window }) => {
    await window.getByLabel('Settings').click();

    await expect(window.getByRole('dialog')).toBeVisible({ timeout: 5_000 });
  });

  test('contains the theme selector', async ({ window }) => {
    await window.getByLabel('Settings').click();

    await expect(window.locator('#theme-select')).toBeVisible({ timeout: 5_000 });
  });

  test('contains font family and font size inputs', async ({ window }) => {
    await window.getByLabel('Settings').click();

    await expect(window.locator('#font-family')).toBeVisible({ timeout: 5_000 });
    await expect(window.locator('#font-size')).toBeVisible({ timeout: 5_000 });
  });

  test('closes when Escape is pressed', async ({ window }) => {
    await window.getByLabel('Settings').click();
    await expect(window.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

    await window.keyboard.press('Escape');

    await expect(window.getByRole('dialog')).not.toBeVisible({ timeout: 3_000 });
  });

  test('theme change is reflected in the select element', async ({ window }) => {
    await window.getByLabel('Settings').click();
    await expect(window.locator('#theme-select')).toBeVisible({ timeout: 5_000 });

    await window.locator('#theme-select').selectOption('dark');
    await expect(window.locator('#theme-select')).toHaveValue('dark');
  });

  test('font size can be changed', async ({ window }) => {
    await window.getByLabel('Settings').click();
    await expect(window.locator('#font-size')).toBeVisible({ timeout: 5_000 });

    await window.locator('#font-size').fill('16');
    await expect(window.locator('#font-size')).toHaveValue('16');
  });
});
