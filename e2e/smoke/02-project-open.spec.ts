import { testWithProject as test, expect } from '../electron-fixture';

test.describe('project open', () => {
  test('canvas renders at least one block after project loads via --project arg', async ({ window }) => {
    await expect(
      window.getByRole('application', { name: 'Story canvas' }),
    ).toBeVisible({ timeout: 30_000 });

    await expect(
      window.locator('[data-block-id]').first(),
    ).toBeVisible({ timeout: 30_000 });
  });

  test('block title matches the fixture filename', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });
    // The fixture only has game/script.rpy — its block title should contain "script.rpy"
    await expect(window.getByText('script.rpy').first()).toBeVisible({ timeout: 5_000 });
  });
});
