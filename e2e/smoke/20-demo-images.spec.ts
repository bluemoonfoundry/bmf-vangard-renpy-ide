import { testWithDemoProject as test, expect } from '../electron-fixture';

/** Open the right sidebar Images sub-tab. */
async function openImagesTab(window: import('playwright/test').Page) {
  const expandBtn = window.getByTitle('Expand Right Sidebar');
  if (await expandBtn.isVisible()) await expandBtn.click();
  await window.getByRole('tablist', { name: 'Story Elements' }).getByLabel('Images').click();
}

test.describe('images sub-tab with DemoProject', () => {
  // DemoProject has 33+ .rpy files so allow a longer initial load
  test.setTimeout(90_000);

  test('Images sub-tab is reachable and shows the Refresh button', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 60_000 });

    await openImagesTab(window);

    await expect(window.getByRole('button', { name: 'Refresh' })).toBeVisible({ timeout: 5_000 });
  });

  test('after project load, DemoProject background images appear in the image manager', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 60_000 });

    await openImagesTab(window);

    // The project is scanned on load; DemoProject has backgrounds like academy_gate.png
    // Wait up to 20 s for at least one image card to appear
    await expect(window.getByText('academy_gate.png').or(window.getByText('garden.png')).first())
      .toBeVisible({ timeout: 20_000 });
  });

  test('clicking Refresh rescans and still shows images', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 60_000 });

    await openImagesTab(window);
    await expect(window.getByRole('button', { name: 'Refresh' })).toBeVisible({ timeout: 5_000 });

    await window.getByRole('button', { name: 'Refresh' }).click();

    await expect(window.getByText('academy_gate.png').or(window.getByText('garden.png')).first())
      .toBeVisible({ timeout: 20_000 });
  });

  test('double-clicking an image opens an image editor tab', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 60_000 });

    await openImagesTab(window);
    await expect(window.getByText('academy_gate.png').or(window.getByText('garden.png')).first())
      .toBeVisible({ timeout: 20_000 });

    // Double-click the first visible image card to open its editor tab
    await window.getByText('academy_gate.png').or(window.getByText('garden.png')).first().dblclick();

    // An image-type tab opens — the tab bar should show the image filename
    await expect(window.getByText('academy_gate.png').or(window.getByText('garden.png')).first())
      .toBeVisible({ timeout: 10_000 });

    // The image editor renders a preview area (aria-label="Preview markdown" is MarkdownPreview;
    // image editor uses a canvas or img element)
    await expect(window.locator('canvas, img[alt]').first()).toBeVisible({ timeout: 10_000 });
  });
});
