import path from 'path';

/**
 * Validates that filePath is within projectRoot.
 * Returns null if valid, an error message string if not.
 *
 * Defends against:
 * - Path traversal via `..` segments (path.resolve canonicalizes them)
 * - Null byte injection
 * - Arbitrary host-path access when no project is loaded
 */
export function validateProjectPath(filePath, projectRoot) {
    if (typeof filePath !== 'string' || filePath.includes('\0')) {
        return 'Invalid path';
    }
    if (!projectRoot || typeof projectRoot !== 'string') {
        return 'No project loaded';
    }
    const resolved = path.resolve(filePath);
    const root = path.resolve(projectRoot);

    // Windows filesystems are case-insensitive
    if (process.platform === 'win32') {
        const r = resolved.toLowerCase();
        const ro = root.toLowerCase();
        if (r !== ro && !r.startsWith(ro + path.sep)) {
            return 'Path is outside project root';
        }
    } else {
        if (resolved !== root && !resolved.startsWith(root + path.sep)) {
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
