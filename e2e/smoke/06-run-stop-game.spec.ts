import { testWithProject as test, expect } from '../electron-fixture';

test.describe('run and stop game', () => {
  test('clicking Run Project starts the game and Stop Game ends it', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    const runButton = window.getByLabel('Run Project');
    await expect(runButton).toBeEnabled({ timeout: 10_000 });
    await runButton.click();

    // Toolbar swaps the Run button for a Stop button while the fake SDK process is alive.
    const stopButton = window.getByLabel('Stop Game');
    await expect(stopButton).toBeVisible({ timeout: 10_000 });

    await stopButton.click();

    // Killing the process flips the toolbar back to Run Project.
    await expect(window.getByLabel('Run Project')).toBeVisible({ timeout: 10_000 });
  });
});
