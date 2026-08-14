import fsPromises from 'fs/promises';
import path from 'path';
import { findRegexMatchesInLine } from './regexLineSearch.js';

// Caps chosen to keep a search over a very large project responsive and
// bounded: enough for any realistic single Ren'Py project, small enough to
// guarantee a search can't run away scanning/reading unbounded content.
export const DEFAULT_MAX_FILES = 5000;
export const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function buildSearchRegex(query, { isCaseSensitive = false, isRegex = false, isWholeWord = false } = {}) {
    let flags = 'g';
    if (!isCaseSensitive) flags += 'i';
    let pattern = isRegex ? query : query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (isWholeWord) pattern = `\\b${pattern}\\b`;
    return new RegExp(pattern, flags);
}

/**
 * Recursively searches `.rpy` files under `directory` for `query`.
 * Cancellable via `isCancelled`, bounded via `maxFiles`/`maxFileSize`, and
 * resilient to per-file read failures, which are skipped and recorded in
 * `skipped` rather than aborting the whole search.
 */
export async function searchInDirectory(directory, query, options) {
    const {
        projectPath,
        maxFiles = DEFAULT_MAX_FILES,
        maxFileSize = DEFAULT_MAX_FILE_SIZE,
        isCancelled = () => false,
        onProgress = null,
        readdirFn = (p) => fsPromises.readdir(p, { withFileTypes: true }),
        statFn = (p) => fsPromises.stat(p),
        readFileFn = (p, encoding) => fsPromises.readFile(p, encoding),
    } = options;

    const outcome = { results: [], truncated: false, cancelled: false, skipped: [], regexError: null };

    // Validate the pattern once up front instead of per-file/per-line: an
    // invalid regex can't become valid partway through the walk, so there's
    // no reason to retry (and re-log) it for every file.
    try {
        buildSearchRegex(query, options);
    } catch (err) {
        outcome.regexError = err.message;
        return outcome;
    }

    let filesSearched = 0;

    const walk = async (currentDir) => {
        if (outcome.truncated || outcome.cancelled) return;
        if (isCancelled()) {
            outcome.cancelled = true;
            return;
        }

        let entries;
        try {
            entries = await readdirFn(currentDir);
        } catch (err) {
            outcome.skipped.push({ path: path.relative(projectPath, currentDir).replace(/\\/g, '/'), message: err.message });
            return;
        }

        for (const entry of entries) {
            if (outcome.truncated || outcome.cancelled) return;
            if (isCancelled()) {
                outcome.cancelled = true;
                return;
            }
            if (entry.isSymbolicLink()) continue;

            const fullPath = path.join(currentDir, entry.name);
            const relativePath = path.relative(projectPath, fullPath).replace(/\\/g, '/');

            if (entry.isDirectory()) {
                if (entry.name === '.git' || entry.name === 'node_modules') continue;
                await walk(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.rpy')) {
                filesSearched++;
                if (filesSearched > maxFiles) {
                    outcome.truncated = true;
                    return;
                }
                if (onProgress && filesSearched % 50 === 0) onProgress(filesSearched);

                try {
                    const stats = await statFn(fullPath);
                    if (stats.size > maxFileSize) {
                        outcome.skipped.push({ path: relativePath, message: 'File too large to search' });
                        continue;
                    }
                } catch (err) {
                    outcome.skipped.push({ path: relativePath, message: err.message });
                    continue;
                }

                let content;
                try {
                    content = await readFileFn(fullPath, 'utf-8');
                } catch (err) {
                    outcome.skipped.push({ path: relativePath, message: err.message });
                    continue;
                }

                const lines = content.split('\n');
                const matches = [];
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    // Fresh RegExp per line resets lastIndex, since findRegexMatchesInLine
                    // mutates it while walking zero-width matches (e.g. `/$/g`, `/^/g`).
                    const regex = buildSearchRegex(query, options);
                    for (const lineMatch of findRegexMatchesInLine(line, regex)) {
                        matches.push({ lineNumber: i + 1, lineContent: line, ...lineMatch });
                    }
                }

                if (matches.length > 0) {
                    outcome.results.push({ filePath: relativePath, matches });
                }
            }
        }
    };

    await walk(directory);
    return outcome;
}
