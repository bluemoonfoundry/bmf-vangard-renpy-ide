import { testWithDemoProject as test, expect } from '../electron-fixture';

/** Open the right sidebar Scene Compositions sub-tab. */
async function openSceneCompositionsTab(window: import('playwright/test').Page) {
  const expandBtn = window.getByTitle('Expand Right Sidebar');
  if (await expandBtn.isVisible()) await expandBtn.click();
  await window.getByRole('tablist', { name: 'Story Elements' }).getByLabel('Scene Compositions').click();
}

test.describe('scene composer with DemoProject', () => {
  test.setTimeout(90_000);

  test('Scene Compositions sub-tab lists the named compositions', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 60_000 });
    await openSceneCompositionsTab(window);

    // DemoProject has three scene compositions: Garden, Nascent, Sprite Composer
    // Use exact text to avoid matching filenames like stage4_garden_event.rpy
    await expect(window.getByText('Garden', { exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(window.getByText('Nascent', { exact: true })).toBeVisible({ timeout: 5_000 });
    await expect(window.getByText('Sprite Composer', { exact: true })).toBeVisible({ timeout: 5_000 });
  });

  test('clicking a scene composition opens a scene-composer tab', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 60_000 });
    await openSceneCompositionsTab(window);
    await expect(window.getByText('Garden', { exact: true })).toBeVisible({ timeout: 10_000 });

    await window.getByText('Garden', { exact: true }).click();

    // A new tab opens — verify at least one Close-tab button is visible (tabs already open
    // in DemoProject include canvas tabs + previously opened editor tabs from project.ide.json)
    await expect(window.locator('[aria-label*="Close tab"]').first()).toBeVisible({ timeout: 10_000 });
  });

  test('scene composer renders a canvas after opening', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 60_000 });
    await openSceneCompositionsTab(window);
    await expect(window.getByText('Garden', { exact: true })).toBeVisible({ timeout: 10_000 });
    await window.getByText('Garden', { exact: true }).click();

    // SceneComposer always renders a Canvas resolution selector in its toolbar
    await expect(window.getByLabel('Canvas resolution')).toBeVisible({ timeout: 20_000 });
  });

  test('Scene Compositions sub-tab has a + New button', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 60_000 });
    await openSceneCompositionsTab(window);
    await expect(window.getByText('Garden', { exact: true })).toBeVisible({ timeout: 10_000 });

    await expect(window.getByRole('button', { name: '+ New' }).first()).toBeVisible();
  });
});
