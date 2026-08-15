/**
 * Classifies a filesystem/parse error into a category so callers can tell
 * "expected absence" apart from "corruption/access error" instead of
 * collapsing every failure into the same silent default.
 *
 * @param {unknown} err
 * @returns {'missing' | 'permission-denied' | 'corrupted' | 'unknown'}
 */
export function classifyFsReadError(err) {
    if (err instanceof SyntaxError) {
        return 'corrupted';
    }
    const code = err && typeof err === 'object' ? /** @type {{code?: string}} */ (err).code : undefined;
    if (code === 'ENOENT') {
        return 'missing';
    }
    if (code === 'EACCES' || code === 'EPERM') {
        return 'permission-denied';
    }
    return 'unknown';
}
