import { testWithProject as test, expect } from '../electron-fixture';

test.describe('warp flow', () => {
  test('Warp to Label button is enabled when a project and Ren\'Py SDK are loaded', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    // The FAKE_RENPY_SDK makes isRenpyPathValid true, so Warp button should be enabled
    await expect(window.getByLabel('Warp to Label')).not.toBeDisabled({ timeout: 5_000 });
  });

  test('Warp to Label opens the label search modal', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.getByLabel('Warp to Label').click();

    await expect(window.getByRole('dialog')).toBeVisible({ timeout: 5_000 });
  });

  test('warp modal shows fixture labels', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });
    await window.getByLabel('Warp to Label').click();
    await expect(window.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

    const dialog = window.getByRole('dialog');
    await expect(dialog.getByText('start')).toBeVisible({ timeout: 5_000 });
    await expect(dialog.getByText('scene_two')).toBeVisible({ timeout: 5_000 });
  });

  test('selecting a label from the warp modal opens the Warp Variables modal', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });
    await window.getByLabel('Warp to Label').click();
    await expect(window.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

    // Click the 'start' label item
    await window.getByRole('dialog').getByText('start').click();

    // The WarpVariablesModal should appear after label selection
    await expect(window.getByRole('dialog')).toBeVisible({ timeout: 5_000 });
    // It should mention warp or variables
    await expect(window.getByText(/warp|variable|launch/i).first()).toBeVisible({ timeout: 5_000 });
  });

  test('warp modal closes with Escape', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });
    await window.getByLabel('Warp to Label').click();
    await expect(window.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

    await window.keyboard.press('Escape');

    await expect(window.getByRole('dialog')).not.toBeVisible({ timeout: 3_000 });
  });
});
