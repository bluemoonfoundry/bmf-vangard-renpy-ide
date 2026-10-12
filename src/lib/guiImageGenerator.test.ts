// Runs the real sharp native module (SVG -> PNG) rather than a mock. Guards sharp
// upgrades: electron.js swallows generator failures and falls back to template
// images, so a broken sharp would otherwise go unnoticed.
import { mkdtemp, readdir, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import sharp from 'sharp';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/logger.main.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import { generateGuiImages } from '@/lib/guiImageGenerator.js';

const colors = {
  accent_color: '#cc0066',
  muted_color: '#3d0029',
  hover_muted_color: '#5c003d',
  menu_color: '#102030',
};

async function listFiles(dir: string, prefix = ''): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map((e) =>
    e.isDirectory() ? listFiles(path.join(dir, e.name), `${prefix}${e.name}/`) : [`${prefix}${e.name}`]));
  return nested.flat().sort();
}

async function pixelAt(file: string, x = 0, y = 0) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const i = (y * info.width + x) * info.channels;
  return Array.from(data.subarray(i, i + 4));
}

describe('generateGuiImages', () => {
  let projectDir: string;
  let guiDir: string;

  beforeAll(async () => {
    projectDir = await mkdtemp(path.join(os.tmpdir(), 'gui-images-'));
    guiDir = path.join(projectDir, 'game', 'gui');
    await generateGuiImages(projectDir, colors, 1280, 720);
  }, 30_000);

  afterAll(async () => {
    await rm(projectDir, { recursive: true, force: true });
  });

  it('writes the full set of GUI images', async () => {
    expect(await listFiles(guiDir)).toEqual([
      'bar/bottom.png', 'bar/left.png', 'bar/right.png', 'bar/top.png',
      'button/hover_background.png', 'button/idle_background.png',
      'namebox.png',
      'overlay/confirm.png', 'overlay/game_menu.png', 'overlay/main_menu.png',
      'scrollbar/horizontal_hover_bar.png', 'scrollbar/horizontal_hover_thumb.png',
      'scrollbar/horizontal_idle_bar.png', 'scrollbar/horizontal_idle_thumb.png',
      'scrollbar/vertical_hover_bar.png', 'scrollbar/vertical_hover_thumb.png',
      'scrollbar/vertical_idle_bar.png', 'scrollbar/vertical_idle_thumb.png',
      'slider/horizontal_hover_bar.png', 'slider/horizontal_hover_thumb.png',
      'slider/horizontal_idle_bar.png', 'slider/horizontal_idle_thumb.png',
      'slider/vertical_hover_bar.png', 'slider/vertical_hover_thumb.png',
      'slider/vertical_idle_bar.png', 'slider/vertical_idle_thumb.png',
      'textbox.png',
    ]);
  });

  it('renders PNGs at the expected sizes, scaling textbox and overlays to the resolution', async () => {
    const size = async (rel: string) => {
      const { format, width, height } = await sharp(path.join(guiDir, rel)).metadata();
      return { format, width, height };
    };
    expect(await size('button/idle_background.png')).toEqual({ format: 'png', width: 120, height: 40 });
    expect(await size('bar/left.png')).toEqual({ format: 'png', width: 8, height: 25 });
    expect(await size('slider/horizontal_idle_bar.png')).toEqual({ format: 'png', width: 400, height: 4 });
    expect(await size('textbox.png')).toEqual({ format: 'png', width: 1280, height: 185 });
    expect(await size('overlay/main_menu.png')).toEqual({ format: 'png', width: 1280, height: 720 });
  });

  it('fills images with the derived colors and opacity', async () => {
    expect(await pixelAt(path.join(guiDir, 'bar/left.png'))).toEqual([0xcc, 0x00, 0x66, 255]);
    expect(await pixelAt(path.join(guiDir, 'button/hover_background.png'))).toEqual([0x5c, 0x00, 0x3d, 255]);
    const [r, g, b, a] = await pixelAt(path.join(guiDir, 'textbox.png'), 10, 10);
    // Semi-transparent pixels go through alpha premultiplication, so allow ±1 rounding.
    [[r, 0x10], [g, 0x20], [b, 0x30]].forEach(([got, want]) => expect(Math.abs(got - want)).toBeLessThanOrEqual(1));
    expect(a).toBeGreaterThanOrEqual(215);
    expect(a).toBeLessThanOrEqual(218); // 0.85 opacity
  });
});
