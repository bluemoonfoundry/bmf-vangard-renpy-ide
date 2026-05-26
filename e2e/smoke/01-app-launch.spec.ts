import { test, expect } from '../electron-fixture';

test.describe('app launch', () => {
  test('main window loads and shows the no-project landing screen', async ({ window }) => {
    await expect(window.getByText('No Project Open')).toBeVisible({ timeout: 15_000 });
  });

  test('toolbar is rendered with the Settings button', async ({ window }) => {
    await expect(window.getByLabel('Settings')).toBeVisible({ timeout: 15_000 });
  });
});
