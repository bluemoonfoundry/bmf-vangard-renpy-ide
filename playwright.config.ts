import { defineConfig } from 'playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  testDir: path.join(__dirname, 'e2e'),
  // e2e/demo is the cinematic demo recording, run separately via playwright.demo.config.ts
  testIgnore: '**/demo/**',
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  workers: 1, // Electron instances can't safely run in parallel
  reporter: process.env.CI
    ? [['list'], ['github']]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    actionTimeout: 15_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  outputDir: 'e2e/test-results',
});
