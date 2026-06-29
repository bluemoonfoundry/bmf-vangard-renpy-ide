import { testWithProject as test, expect } from '../electron-fixture';

test.describe('flow canvas', () => {
  test('switching to Flow canvas renders label nodes for the fixture labels', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    // The Flow canvas button has no aria-label, only a title attribute
    await window.getByTitle(/flow canvas/i).click();

    // The fixture has labels start and scene_two — both rendered as font-mono node cards
    await expect(window.locator('.font-mono').getByText('start').first()).toBeVisible({ timeout: 15_000 });
    await expect(window.locator('.font-mono').getByText('scene_two').first()).toBeVisible({ timeout: 5_000 });
  });

  test('flow canvas SVG overlay renders at least one edge path', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.getByTitle(/flow canvas/i).click();

    // Wait for nodes to render first, then check that the SVG edge overlay has paths
    await expect(window.locator('.font-mono').getByText('start').first()).toBeVisible({ timeout: 15_000 });

    // The edges SVG is a position:absolute SVG with pointer-events:none inside the canvas
    const edgePaths = window.locator('[aria-label="Route canvas"] svg path').first();
    await expect(edgePaths).toBeVisible({ timeout: 5_000 });
  });
});
