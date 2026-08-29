import fs from 'fs/promises';
import path from 'path';

/**
 * Resolves filePath to its canonical, symlink/junction-free form.
 *
 * fs.realpath fails if the path doesn't exist yet (e.g. a new file about to
 * be created by fs:writeFile or fs:createDirectory), so on ENOENT we walk up
 * to the nearest existing ancestor, canonicalize *that*, and rejoin the
 * remaining path segments — those segments can't be symlinks since nothing
 * exists there yet.
 */
export async function canonicalize(filePath) {
    const resolved = path.resolve(filePath);
    try {
        return await fs.realpath(resolved);
    } catch {
        const parent = path.dirname(resolved);
        if (parent === resolved) {
            // Reached the filesystem root without finding anything that exists.
            return resolved;
        }
        const canonicalParent = await canonicalize(parent);
        return path.join(canonicalParent, path.basename(resolved));
    }
}

/**
 * Validates that filePath is within projectRoot.
 * Returns null if valid, an error message string if not.
 *
 * Defends against:
 * - Path traversal via `..` segments (path.resolve canonicalizes them)
 * - Null byte injection
 * - Arbitrary host-path access when no project is loaded
 * - Symlink/junction escapes: both filePath and projectRoot are resolved to
 *   their canonical form via fs.realpath before the containment check, so a
 *   symlink or Windows junction inside the project that points outside it
 *   cannot be used to read/write files elsewhere on disk.
 */
export async function validateProjectPath(filePath, projectRoot) {
    if (typeof filePath !== 'string' || filePath.includes('\0')) {
        return 'Invalid path';
    }
    if (!projectRoot || typeof projectRoot !== 'string') {
        return 'No project loaded';
    }

    const [target, root] = await Promise.all([
        canonicalize(filePath),
        canonicalize(projectRoot),
    ]);

    // Windows filesystems are case-insensitive
    if (process.platform === 'win32') {
        const t = target.toLowerCase();
        const r = root.toLowerCase();
        if (t !== r && !t.startsWith(r + path.sep)) {
            return 'Path is outside project root';
        }
    } else {
        if (target !== root && !target.startsWith(root + path.sep)) {
            return 'Path is outside project root';
        }
    }
    return null;
}

/**
 * Validates a URL for use with shell.openExternal.
 * Returns null if valid, an error message string if not.
 *
 * Only allows https: and http: protocols to prevent file:/javascript:/etc. abuse.
 */
export function validateExternalUrl(url) {
    if (typeof url !== 'string') {
        return 'Invalid URL';
    }
    let parsed;
    try {
        parsed = new URL(url);
    } catch {
        return 'Malformed URL';
    }
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        return `Protocol '${parsed.protocol}' is not allowed`;
    }
    return null;
}
