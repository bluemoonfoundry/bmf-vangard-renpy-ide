import { testWithDemoProject as test, expect } from '../electron-fixture';

test.describe('imagemap composer with DemoProject', () => {
  test.setTimeout(90_000);

  test('Image Maps sub-tab lists the imagemap composition', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 60_000 });

    const expandBtn = window.getByTitle('Expand Right Sidebar');
    if (await expandBtn.isVisible()) await expandBtn.click();
    await window.getByRole('tablist', { name: 'Story Elements' }).getByLabel('Image Maps').click();

    // DemoProject has one imagemap composition with screen name 'imagemap_1'
    await expect(window.getByText('imagemap_1')).toBeVisible({ timeout: 10_000 });
  });

  test('clicking an imagemap composition opens an imagemap-composer tab', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 60_000 });

    const expandBtn = window.getByTitle('Expand Right Sidebar');
    if (await expandBtn.isVisible()) await expandBtn.click();
    await window.getByRole('tablist', { name: 'Story Elements' }).getByLabel('Image Maps').click();
    await expect(window.getByText('imagemap_1')).toBeVisible({ timeout: 10_000 });

    await window.getByText('imagemap_1').click();

    // A new tab for the imagemap composer should open
    await expect(window.locator('[aria-label*="Close tab"]').first()).toBeVisible({ timeout: 10_000 });
  });

  test('imagemap composer tab content loads after opening', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 60_000 });

    const expandBtn = window.getByTitle('Expand Right Sidebar');
    if (await expandBtn.isVisible()) await expandBtn.click();
    await window.getByRole('tablist', { name: 'Story Elements' }).getByLabel('Image Maps').click();
    await expect(window.getByText('imagemap_1')).toBeVisible({ timeout: 10_000 });
    await window.getByText('imagemap_1').click();

    // Imagemap composer tab opens; at least one Close-tab button is present
    await expect(window.locator('[aria-label*="Close tab"]').first()).toBeVisible({ timeout: 10_000 });
  });

  test('Image Maps sub-tab has a + New button', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 60_000 });

    const expandBtn = window.getByTitle('Expand Right Sidebar');
    if (await expandBtn.isVisible()) await expandBtn.click();
    await window.getByRole('tablist', { name: 'Story Elements' }).getByLabel('Image Maps').click();
    await expect(window.getByText('imagemap_1')).toBeVisible({ timeout: 10_000 });

    await expect(window.getByRole('button', { name: '+ New' }).first()).toBeVisible();
  });
});
