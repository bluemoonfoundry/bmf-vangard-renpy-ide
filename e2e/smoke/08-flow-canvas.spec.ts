import { testWithProject as test, expect } from '../electron-fixture';

test.describe('flow canvas', () => {
  test('switching to Flow canvas renders label nodes for the fixture labels', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.locator('[data-tutorial="canvas-tabs"]').getByLabel('Flow Canvas').click();

    // The fixture has labels start and scene_two — both rendered as label node cards
    await expect(window.locator('[data-label-node-id]').getByText('start').first()).toBeVisible({ timeout: 15_000 });
    await expect(window.locator('[data-label-node-id]').getByText('scene_two').first()).toBeVisible({ timeout: 5_000 });
  });

  test('flow canvas SVG overlay renders at least one edge path', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

    await window.locator('[data-tutorial="canvas-tabs"]').getByLabel('Flow Canvas').click();

    // Wait for nodes to render first, then check that the SVG edge overlay has paths
    await expect(window.locator('[data-label-node-id]').getByText('start').first()).toBeVisible({ timeout: 15_000 });

    // The edges SVG is a position:absolute SVG with pointer-events:none inside the canvas
    const edgePaths = window.locator('[aria-label="Route canvas"] svg path').first();
    await expect(edgePaths).toBeVisible({ timeout: 5_000 });
  });
});
