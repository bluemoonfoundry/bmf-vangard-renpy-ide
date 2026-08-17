import { describe, it, expect, vi } from 'vitest';
import { isAppImageRuntime, chromeSandboxHelperUsable, shouldDisableSandbox } from './sandboxProbe.js';

describe('isAppImageRuntime', () => {
    it('detects APPIMAGE env var', () => {
        expect(isAppImageRuntime({ APPIMAGE: '/path/to/app.AppImage' }, '/usr/bin/vangard')).toBe(true);
    });

    it('detects APPDIR env var', () => {
        expect(isAppImageRuntime({ APPDIR: '/tmp/.mount_xyz' }, '/usr/bin/vangard')).toBe(true);
    });

    it('detects FUSE mount exec path when env vars are absent (--appimage-extract-and-run)', () => {
        expect(isAppImageRuntime({}, '/tmp/.mount_abc123/vangard')).toBe(true);
    });

    it('returns false for a normal install', () => {
        expect(isAppImageRuntime({}, '/opt/Vangard/vangard')).toBe(false);
    });
});

describe('chromeSandboxHelperUsable', () => {
    it('returns true when the helper is root-owned and setuid', () => {
        const statSync = vi.fn().mockReturnValue({ uid: 0, mode: 0o104755 });
        expect(chromeSandboxHelperUsable('/tmp/.mount_x/vangard', statSync)).toBe(true);
    });

    it('returns false when the helper is not owned by root', () => {
        const statSync = vi.fn().mockReturnValue({ uid: 1000, mode: 0o104755 });
        expect(chromeSandboxHelperUsable('/tmp/.mount_x/vangard', statSync)).toBe(false);
    });

    it('returns false when the setuid bit is missing', () => {
        const statSync = vi.fn().mockReturnValue({ uid: 0, mode: 0o100755 });
        expect(chromeSandboxHelperUsable('/tmp/.mount_x/vangard', statSync)).toBe(false);
    });

    it('returns false when the helper is missing entirely', () => {
        const statSync = vi.fn().mockImplementation(() => {
            throw new Error('ENOENT');
        });
        expect(chromeSandboxHelperUsable('/tmp/.mount_x/vangard', statSync)).toBe(false);
    });
});

describe('shouldDisableSandbox', () => {
    it('never disables the sandbox off Linux', () => {
        const statSync = vi.fn().mockImplementation(() => {
            throw new Error('ENOENT');
        });
        expect(shouldDisableSandbox({
            platform: 'win32',
            env: { APPIMAGE: '/x' },
            execPath: 'C:\\vangard.exe',
            statSync,
        })).toBe(false);
        expect(statSync).not.toHaveBeenCalled();
    });

    it('never disables the sandbox for a plain Linux install (not an AppImage)', () => {
        const statSync = vi.fn().mockReturnValue({ uid: 1000, mode: 0o100755 });
        expect(shouldDisableSandbox({
            platform: 'linux',
            env: {},
            execPath: '/opt/Vangard/vangard',
            statSync,
        })).toBe(false);
        expect(statSync).not.toHaveBeenCalled();
    });

    it('keeps the sandbox enabled on Linux AppImage when the helper is usable', () => {
        const statSync = vi.fn().mockReturnValue({ uid: 0, mode: 0o104755 });
        expect(shouldDisableSandbox({
            platform: 'linux',
            env: { APPIMAGE: '/x/Vangard.AppImage' },
            execPath: '/tmp/.mount_x/vangard',
            statSync,
        })).toBe(false);
    });

    it('falls back to --no-sandbox on Linux AppImage when the helper is unusable', () => {
        const statSync = vi.fn().mockImplementation(() => {
            throw new Error('ENOENT');
        });
        expect(shouldDisableSandbox({
            platform: 'linux',
            env: { APPIMAGE: '/x/Vangard.AppImage' },
            execPath: '/tmp/.mount_x/vangard',
            statSync,
        })).toBe(true);
    });
});
