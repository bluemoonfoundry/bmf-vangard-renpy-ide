import { testWithProject as test, expect } from '../electron-fixture';

test.describe('choices canvas', () => {
  test('switching to Choices Canvas shows the walkthrough debugger container', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.locator('[data-tutorial="canvas-tabs"]').getByLabel('Choices Canvas').click();

    await expect(window.locator('[aria-label="Walkthrough debugger canvas"]')).toBeVisible({ timeout: 15_000 });
  });

  test('Choices Canvas shows the Walkthrough Debugger heading', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.locator('[data-tutorial="canvas-tabs"]').getByLabel('Choices Canvas').click();

    await expect(window.getByText('Walkthrough Debugger').first()).toBeVisible({ timeout: 10_000 });
  });

  test('canvas switcher aria-pressed state reflects active canvas', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    const projectBtn = window.locator('[data-tutorial="canvas-tabs"]').getByLabel('Project Canvas');
    const choicesBtn = window.locator('[data-tutorial="canvas-tabs"]').getByLabel('Choices Canvas');

    await expect(projectBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(choicesBtn).toHaveAttribute('aria-pressed', 'false');

    await choicesBtn.click();
    await expect(choicesBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(projectBtn).toHaveAttribute('aria-pressed', 'false');
  });
});
