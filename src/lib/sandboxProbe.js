import fs from 'fs';
import path from 'path';

/**
 * Detects whether the current process is running from a mounted/extracted
 * AppImage. AppImages set APPIMAGE and APPDIR, and their FUSE mount point
 * lives under /tmp/.mount_*; --appimage-extract-and-run drops the env vars
 * but keeps the exec path, so all three signals are checked.
 */
export function isAppImageRuntime(env = process.env, execPath = process.execPath) {
    return Boolean(env.APPIMAGE || env.APPDIR || /^\/tmp\/\.mount_/.test(execPath));
}

/**
 * Chromium's setuid sandbox helper only works if it is owned by root and has
 * the setuid bit set (mode 4755), AND the filesystem it's mounted on allows
 * suid execution. AppImage's FUSE mount is usually nosuid, and
 * --appimage-extract-and-run's temp extraction directory can be too
 * (notably /tmp on some CI/hardened-distro configs), which silently breaks
 * the sandbox helper regardless of the binary's own permissions.
 *
 * Returns true only when the helper is present, owned by root, and has the
 * setuid bit set — i.e. when it is safe to leave the Chromium sandbox
 * enabled. Any stat failure or permission mismatch is treated as "sandbox
 * unusable" so the caller can fall back to --no-sandbox explicitly.
 */
export function chromeSandboxHelperUsable(execPath = process.execPath, statSync = fs.statSync) {
    const helperPath = path.join(path.dirname(execPath), 'chrome-sandbox');
    try {
        const stats = statSync(helperPath);
        const isSetuidRoot = stats.uid === 0 && (stats.mode & 0o4000) !== 0;
        return isSetuidRoot;
    } catch {
        return false;
    }
}

/**
 * Decides whether to inject --no-sandbox for this launch. Only ever true on
 * Linux AppImage runtimes where the setuid sandbox helper is confirmed
 * unusable — never applied to Windows, macOS, or Linux .deb installs, and
 * never applied silently when the sandbox would actually work.
 */
export function shouldDisableSandbox({
    platform = process.platform,
    env = process.env,
    execPath = process.execPath,
    statSync = fs.statSync,
} = {}) {
    if (platform !== 'linux') return false;
    if (!isAppImageRuntime(env, execPath)) return false;
    return !chromeSandboxHelperUsable(execPath, statSync);
}
