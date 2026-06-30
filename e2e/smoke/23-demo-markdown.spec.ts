import { testWithProject as test, expect } from '../electron-fixture';

// notes.md is at e2e/fixtures/test-project/game/docs/notes.md
// File tree items have title={node.path} (forward-slash paths even on Windows).
// Double-clicking a directory toggles expansion; double-clicking a file opens it.

async function openNotesTab(window: import('playwright/test').Page) {
  await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });

  // game/ starts collapsed — double-click to expand it
  const gameItem = window.locator('[title="game"]');
  await expect(gameItem).toBeVisible({ timeout: 10_000 });
  await gameItem.dblclick();

  // docs/ is now visible — double-click to expand it
  const docsItem = window.locator('[title="game/docs"]');
  await expect(docsItem).toBeVisible({ timeout: 10_000 });
  await docsItem.dblclick();

  // Double-click notes.md to open the markdown preview tab
  const notesItem = window.locator('[title="game/docs/notes.md"]');
  await expect(notesItem).toBeVisible({ timeout: 10_000 });
  await notesItem.dblclick();
}

test.describe('markdown preview tab', () => {
  test('game folder is visible in the file explorer', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });
    await expect(window.locator('[title="game"]')).toBeVisible({ timeout: 10_000 });
  });

  test('docs folder appears after double-clicking game/', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });
    await window.locator('[title="game"]').dblclick();
    await expect(window.locator('[title="game/docs"]')).toBeVisible({ timeout: 10_000 });
  });

  test('notes.md appears after double-clicking docs/', async ({ window }) => {
    await expect(window.locator('[data-block-id]').first()).toBeVisible({ timeout: 30_000 });
    await window.locator('[title="game"]').dblclick();
    await window.locator('[title="game/docs"]').dblclick();
    await expect(window.locator('[title="game/docs/notes.md"]')).toBeVisible({ timeout: 10_000 });
  });

  test('double-clicking notes.md opens a markdown preview tab', async ({ window }) => {
    await openNotesTab(window);

    // Preview / Edit toggle buttons appear once the markdown tab is active
    await expect(
      window.getByLabel('Preview markdown').or(window.getByLabel('Edit markdown')).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test('markdown preview renders the document body', async ({ window }) => {
    await openNotesTab(window);
    await expect(window.locator('.markdown-body')).toBeVisible({ timeout: 10_000 });
  });

  test('markdown tab has Preview and Edit toggle buttons', async ({ window }) => {
    await openNotesTab(window);
    await expect(window.getByLabel('Preview markdown')).toBeVisible({ timeout: 10_000 });
    await expect(window.getByLabel('Edit markdown')).toBeVisible({ timeout: 5_000 });
  });

  test('switching to Edit mode shows a Monaco editor', async ({ window }) => {
    await openNotesTab(window);
    await expect(window.getByLabel('Edit markdown')).toBeVisible({ timeout: 10_000 });
    await window.getByLabel('Edit markdown').click();
    await expect(window.locator('.monaco-editor')).toBeVisible({ timeout: 10_000 });
  });
});
