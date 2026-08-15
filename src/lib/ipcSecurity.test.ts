import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

import { validateProjectPath, validateExternalUrl } from './ipcSecurity.js';

const ROOT = path.resolve('/test-project');

describe('validateProjectPath', () => {
    it('allows a file directly in the root', async () => {
        expect(await validateProjectPath(path.join(ROOT, 'script.rpy'), ROOT)).toBeNull();
    });

    it('allows a file in a nested subdirectory', async () => {
        expect(await validateProjectPath(path.join(ROOT, 'game', 'sub', 'script.rpy'), ROOT)).toBeNull();
    });

    it('allows the root directory itself', async () => {
        expect(await validateProjectPath(ROOT, ROOT)).toBeNull();
    });

    it('blocks traversal via .. to parent', async () => {
        const traversal = path.join(ROOT, '..', 'evil.rpy');
        expect(await validateProjectPath(traversal, ROOT)).toBeTruthy();
    });

    it('blocks traversal via .. to sibling directory', async () => {
        const traversal = path.join(ROOT, '..', 'other-project', 'script.rpy');
        expect(await validateProjectPath(traversal, ROOT)).toBeTruthy();
    });

    it('blocks a path completely outside the root', async () => {
        expect(await validateProjectPath(path.resolve('/etc/passwd'), ROOT)).toBeTruthy();
    });

    it('blocks a sibling directory that shares the root prefix (no sep confusion)', async () => {
        const sibling = path.join(path.dirname(ROOT), path.basename(ROOT) + '-evil', 'script.rpy');
        expect(await validateProjectPath(sibling, ROOT)).toBeTruthy();
    });

    it('blocks null bytes in path', async () => {
        expect(await validateProjectPath(ROOT + '/script\0.rpy', ROOT)).toBeTruthy();
    });

    it('returns error when projectRoot is null', async () => {
        expect(await validateProjectPath(path.join(ROOT, 'script.rpy'), null)).toBeTruthy();
    });

    it('returns error when projectRoot is empty string', async () => {
        expect(await validateProjectPath(path.join(ROOT, 'script.rpy'), '')).toBeTruthy();
    });

    it('returns error for non-string filePath', async () => {
        expect(await validateProjectPath(null, ROOT)).toBeTruthy();
        expect(await validateProjectPath(123, ROOT)).toBeTruthy();
    });
});

describe('validateProjectPath (Windows platform branch)', () => {
  let saved: PropertyDescriptor | undefined;
  beforeEach(() => {
    saved = Object.getOwnPropertyDescriptor(process, 'platform');
    Object.defineProperty(process, 'platform', { value: 'win32', configurable: true, writable: true });
  });
  afterEach(() => {
    if (saved) Object.defineProperty(process, 'platform', saved);
  });

  it('allows a file within root on Windows', async () => {
    expect(await validateProjectPath(path.join(ROOT, 'script.rpy'), ROOT)).toBeNull();
  });

  it('allows root itself on Windows', async () => {
    expect(await validateProjectPath(ROOT, ROOT)).toBeNull();
  });

  it('blocks a path outside root on Windows', async () => {
    expect(await validateProjectPath(path.resolve('/other/evil.rpy'), ROOT)).toBeTruthy();
  });
});

describe('validateProjectPath (non-Windows platform branch)', () => {
  let saved: PropertyDescriptor | undefined;
  beforeEach(() => {
    saved = Object.getOwnPropertyDescriptor(process, 'platform');
    Object.defineProperty(process, 'platform', { value: 'linux', configurable: true, writable: true });
  });
  afterEach(() => {
    if (saved) Object.defineProperty(process, 'platform', saved);
  });

  it('allows a file within root on Linux', async () => {
    expect(await validateProjectPath(path.join(ROOT, 'script.rpy'), ROOT)).toBeNull();
  });

  it('allows root itself on Linux', async () => {
    expect(await validateProjectPath(ROOT, ROOT)).toBeNull();
  });

  it('blocks a path outside root on Linux', async () => {
    expect(await validateProjectPath(path.resolve('/other/evil.rpy'), ROOT)).toBeTruthy();
  });
});

// --- Symlink / junction escape coverage ---
// These exercise the real filesystem: a project directory is created under the
// OS temp dir, an "outside" directory is created as a sibling, and a symlink
// (or, on win32, a directory junction) inside the project points at the
// outside directory. Without realpath-based canonicalization, the lexical
// check in validateProjectPath would consider paths through the link "inside"
// the project even though they resolve outside it.
describe('validateProjectPath (symlink/junction escape)', () => {
    let tmpBase: string;
    let projectRoot: string;
    let outsideDir: string;
    let outsideFile: string;
    let symlinkSupported = true;

    beforeAll(async () => {
        tmpBase = await fs.mkdtemp(path.join(os.tmpdir(), 'vangard-symlink-test-'));
        projectRoot = path.join(tmpBase, 'project');
        outsideDir = path.join(tmpBase, 'outside');
        outsideFile = path.join(outsideDir, 'secret.txt');
        await fs.mkdir(projectRoot, { recursive: true });
        await fs.mkdir(outsideDir, { recursive: true });
        await fs.writeFile(outsideFile, 'sensitive');

        try {
            // Directory symlink inside the project pointing outside it.
            const linkType = process.platform === 'win32' ? 'junction' : 'dir';
            await fs.symlink(outsideDir, path.join(projectRoot, 'linked-dir'), linkType);
            // File symlink inside the project pointing outside it.
            await fs.symlink(outsideFile, path.join(projectRoot, 'linked-file.rpy'), 'file');
        } catch {
            // Creating file symlinks on win32 requires elevated privileges/dev mode.
            // Skip the file-symlink assertions in that case rather than failing CI.
            symlinkSupported = false;
        }
    });

    afterAll(async () => {
        await fs.rm(tmpBase, { recursive: true, force: true });
    });

    it('blocks reads through a symlinked/junctioned directory that escapes the project', async () => {
        if (!symlinkSupported) return;
        const escapePath = path.join(projectRoot, 'linked-dir', 'secret.txt');
        expect(await validateProjectPath(escapePath, projectRoot)).toBeTruthy();
    });

    it('blocks a symlinked file that escapes the project', async () => {
        if (!symlinkSupported) return;
        const escapePath = path.join(projectRoot, 'linked-file.rpy');
        expect(await validateProjectPath(escapePath, projectRoot)).toBeTruthy();
    });

    it('allows a genuinely new file being created inside the project (no realpath yet)', async () => {
        const newFile = path.join(projectRoot, 'brand-new-script.rpy');
        expect(await validateProjectPath(newFile, projectRoot)).toBeNull();
    });

    it('allows a genuinely new nested file/dir being created inside the project', async () => {
        const newFile = path.join(projectRoot, 'new-subdir', 'nested', 'script.rpy');
        expect(await validateProjectPath(newFile, projectRoot)).toBeNull();
    });

    it('blocks a new file whose parent is a symlink that escapes the project', async () => {
        if (!symlinkSupported) return;
        const newFileThroughLink = path.join(projectRoot, 'linked-dir', 'not-yet-created.rpy');
        expect(await validateProjectPath(newFileThroughLink, projectRoot)).toBeTruthy();
    });

    it('allows real files inside the project root unaffected by the symlink', async () => {
        const realFile = path.join(projectRoot, 'script.rpy');
        await fs.writeFile(realFile, 'label start:\n');
        expect(await validateProjectPath(realFile, projectRoot)).toBeNull();
    });
});

describe('validateExternalUrl', () => {
    it('allows https URLs', () => {
        expect(validateExternalUrl('https://example.com')).toBeNull();
        expect(validateExternalUrl('https://github.com/user/repo/wiki')).toBeNull();
    });

    it('allows http URLs (e.g. localhost)', () => {
        expect(validateExternalUrl('http://localhost:3000')).toBeNull();
        expect(validateExternalUrl('http://127.0.0.1:8080/docs')).toBeNull();
    });

    it('blocks file: protocol', () => {
        expect(validateExternalUrl('file:///etc/passwd')).toBeTruthy();
        expect(validateExternalUrl('file:///C:/Windows/System32/cmd.exe')).toBeTruthy();
    });

    it('blocks javascript: protocol', () => {
        expect(validateExternalUrl('javascript:alert(1)')).toBeTruthy();
    });

    it('blocks ftp: protocol', () => {
        expect(validateExternalUrl('ftp://example.com/file')).toBeTruthy();
    });

    it('blocks data: protocol', () => {
        expect(validateExternalUrl('data:text/html,<script>alert(1)</script>')).toBeTruthy();
    });

    it('blocks malformed URLs', () => {
        expect(validateExternalUrl('not a url')).toBeTruthy();
        expect(validateExternalUrl('')).toBeTruthy();
    });

    it('blocks non-string input', () => {
        expect(validateExternalUrl(null)).toBeTruthy();
        expect(validateExternalUrl(undefined)).toBeTruthy();
    });
});
