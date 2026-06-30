import { testWithProject as test, expect } from '../electron-fixture';

test.describe('left sidebar', () => {
  test('Explorer tab is visible by default and shows the project file', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    // The fixture project has script.rpy — it should appear in the file explorer
    await expect(window.getByText('script.rpy')).toBeVisible({ timeout: 10_000 });
  });

  test('can collapse the left sidebar', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.getByTitle('Collapse Left Sidebar').click();

    // After collapse, the explorer content is hidden
    await expect(window.getByTitle('Collapse Left Sidebar')).not.toBeVisible({ timeout: 3_000 });
    await expect(window.getByTitle('Expand Left Sidebar')).toBeVisible({ timeout: 3_000 });
  });

  test('can expand the left sidebar after collapsing', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.getByTitle('Collapse Left Sidebar').click();
    await expect(window.getByTitle('Expand Left Sidebar')).toBeVisible({ timeout: 3_000 });

    await window.getByTitle('Expand Left Sidebar').click();

    await expect(window.getByTitle('Collapse Left Sidebar')).toBeVisible({ timeout: 3_000 });
    await expect(window.getByText('script.rpy')).toBeVisible({ timeout: 5_000 });
  });

  test('switching to the Search tab shows a search input', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.getByRole('button', { name: 'Search' }).click();

    // Search panel renders a text input for the query
    await expect(window.locator('input[placeholder*="earch"]').first()).toBeVisible({ timeout: 5_000 });
  });

  test('searching for text finds matches in the fixture project', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.getByRole('button', { name: 'Search' }).click();
    await expect(window.locator('input[placeholder*="earch"]').first()).toBeVisible({ timeout: 5_000 });

    await window.locator('input[placeholder*="earch"]').first().fill('jump');
    await window.keyboard.press('Enter');

    // The fixture project has 'jump scene_two' and 'jump nonexistent_label'
    await expect(window.getByText('script.rpy').first()).toBeVisible({ timeout: 10_000 });
  });
});
