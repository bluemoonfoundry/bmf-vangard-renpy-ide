import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the main-process logger so electron-log is never loaded in jsdom
vi.mock('./logger.main.js', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}));

// Mock fs/promises to intercept readFile/writeFile in integration-style tests
const mockReadFile = vi.fn();
const mockWriteFile = vi.fn();

vi.mock('fs/promises', () => ({
  default: {
    readFile: (...args: unknown[]) => mockReadFile(...args),
    writeFile: (...args: unknown[]) => mockWriteFile(...args),
  },
}));

import {
  slugify,
  sanitizeBuildName,
  generateSaveDirectory,
  updateOptionsRpy,
  updateGuiRpy,
} from '@/lib/templateProcessor';

// ── slugify ──────────────────────────────────────────────────────────────────

describe('slugify', () => {
  it('converts a simple string to lowercase', () => {
    expect(slugify('Hello')).toBe('hello');
  });

  it('replaces spaces with hyphens', () => {
    expect(slugify('My Project')).toBe('my-project');
  });

  it('removes special characters except hyphens', () => {
    expect(slugify('Héllo Wörld!')).toBe('hllo-wrld');
  });

  it('collapses multiple spaces into a single hyphen', () => {
    expect(slugify('foo   bar')).toBe('foo-bar');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  -hello- ')).toBe('hello');
  });

  it('collapses consecutive hyphens', () => {
    expect(slugify('foo--bar')).toBe('foo-bar');
  });

  it('returns empty string for all-special input', () => {
    expect(slugify('!!!###')).toBe('');
  });

  it('handles numbers in the input', () => {
    expect(slugify('Chapter 2')).toBe('chapter-2');
  });

  it('handles already-slugified input unchanged', () => {
    expect(slugify('my-project-name')).toBe('my-project-name');
  });
});

// ── sanitizeBuildName ────────────────────────────────────────────────────────

describe('sanitizeBuildName', () => {
  it('converts spaces to underscores', () => {
    expect(sanitizeBuildName('My Project')).toBe('My_Project');
  });

  it('removes special characters', () => {
    expect(sanitizeBuildName('Game (v2)!')).toBe('Game_v2');
  });

  it('collapses multiple separators into a single underscore', () => {
    expect(sanitizeBuildName('foo  bar')).toBe('foo_bar');
    expect(sanitizeBuildName('foo--bar')).toBe('foo_bar');
  });

  it('trims leading and trailing separators', () => {
    expect(sanitizeBuildName('_MyGame_')).toBe('MyGame');
  });

  it('preserves alphanumeric characters', () => {
    expect(sanitizeBuildName('VangardStudio2025')).toBe('VangardStudio2025');
  });

  it('handles already-clean input unchanged', () => {
    expect(sanitizeBuildName('MyProject')).toBe('MyProject');
  });
});

// ── generateSaveDirectory ────────────────────────────────────────────────────

describe('generateSaveDirectory', () => {
  it('returns a string in the format slug-timestamp', () => {
    const result = generateSaveDirectory('My Project');
    // slug portion
    expect(result.startsWith('my-project-')).toBe(true);
  });

  it('ends with a numeric timestamp', () => {
    const result = generateSaveDirectory('Test Game');
    const parts = result.split('-');
    const timestamp = Number(parts[parts.length - 1]);
    expect(Number.isFinite(timestamp)).toBe(true);
    expect(timestamp).toBeGreaterThan(0);
  });

  it('produces different values on repeated calls (due to timestamp)', async () => {
    const first = generateSaveDirectory('Game');
    await new Promise(r => setTimeout(r, 2)); // ensure clock advances
    const second = generateSaveDirectory('Game');
    expect(first).not.toBe(second);
  });
});

// ── updateOptionsRpy ─────────────────────────────────────────────────────────

describe('updateOptionsRpy', () => {
  beforeEach(() => {
    mockReadFile.mockReset();
    mockWriteFile.mockReset();
  });

  it('replaces config.name with the new project name', async () => {
    const template = `define config.name = _("Old Name")\ndefine config.save_directory = "old-save"\ndefine build.name = "OldName"`;
    mockReadFile.mockResolvedValue(template);
    mockWriteFile.mockResolvedValue(undefined);

    await updateOptionsRpy('/fake/options.rpy', 'New Game', 'new-game-12345');

    const written: string = mockWriteFile.mock.calls[0][1];
    expect(written).toContain('_("New Game")');
  });

  it('replaces config.save_directory with the new save dir', async () => {
    const template = `define config.name = _("Old")\ndefine config.save_directory = "old-save-123"\ndefine build.name = "Old"`;
    mockReadFile.mockResolvedValue(template);
    mockWriteFile.mockResolvedValue(undefined);

    await updateOptionsRpy('/fake/options.rpy', 'New Game', 'new-game-99999');

    const written: string = mockWriteFile.mock.calls[0][1];
    expect(written).toContain('"new-game-99999"');
  });

  it('replaces build.name with a sanitized version of the project name', async () => {
    const template = `define config.name = _("Old")\ndefine config.save_directory = "old"\ndefine build.name = "Old"`;
    mockReadFile.mockResolvedValue(template);
    mockWriteFile.mockResolvedValue(undefined);

    await updateOptionsRpy('/fake/options.rpy', 'My Cool Game', 'my-cool-game-1');

    const written: string = mockWriteFile.mock.calls[0][1];
    expect(written).toContain('"My_Cool_Game"');
  });
});

// ── updateGuiRpy ─────────────────────────────────────────────────────────────

describe('updateGuiRpy', () => {
  beforeEach(() => {
    mockReadFile.mockReset();
    mockWriteFile.mockReset();
  });

  it('replaces gui.init dimensions with the provided width and height', async () => {
    const template = `gui.init(1280, 720)`;
    mockReadFile.mockResolvedValue(template);
    mockWriteFile.mockResolvedValue(undefined);

    await updateGuiRpy('/fake/gui.rpy', 1920, 1080, {});

    const written: string = mockWriteFile.mock.calls[0][1];
    expect(written).toContain('gui.init(1920, 1080)');
  });

  it('replaces a color define with the new hex value', async () => {
    const template = `define gui.accent_color = "#00b8c3"`;
    mockReadFile.mockResolvedValue(template);
    mockWriteFile.mockResolvedValue(undefined);

    await updateGuiRpy('/fake/gui.rpy', 1280, 720, { accent_color: '#ff0000' });

    const written: string = mockWriteFile.mock.calls[0][1];
    expect(written).toContain('"#ff0000"');
  });

  it('writes the updated content back to the same file path', async () => {
    mockReadFile.mockResolvedValue('gui.init(800, 600)');
    mockWriteFile.mockResolvedValue(undefined);

    await updateGuiRpy('/my/gui.rpy', 800, 600, {});

    expect(mockWriteFile).toHaveBeenCalledWith('/my/gui.rpy', expect.any(String), 'utf-8');
  });
});
