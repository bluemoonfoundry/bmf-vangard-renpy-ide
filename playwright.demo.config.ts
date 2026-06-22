/**
 * Playwright config for the cinematic demo recording.
 *
 * Usage:
 *   npx playwright test -c playwright.demo.config.ts
 *
 * Video lands in e2e/demo-recordings/ as a .webm file.
 * Convert to MP4 with ffmpeg if needed:
 *   ffmpeg -i e2e/demo-recordings/<file>.webm -c:v libx264 demo.mp4
 */

import { defineConfig } from 'playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  testDir: path.join(__dirname, 'e2e', 'demo'),
  timeout: 600_000,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
    actionTimeout: 30_000,
    video: 'on',
    screenshot: 'off',
    trace: 'off',
  },
  outputDir: 'e2e/demo-recordings',
});
