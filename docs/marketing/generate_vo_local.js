#!/usr/bin/env node
/**
 * generate_vo_local.js
 *
 * Same job as generate_vo.js -- turn every VO line in sizzle-reel-script.md
 * into timed audio -- but generated locally with Resemble AI's Chatterbox TTS
 * on this machine's GPU instead of the ElevenLabs API. Added when the
 * project's ElevenLabs account ran out of quota (10000/10000 credits, 2
 * remaining) mid-project; this machine has an idle RTX 4090, which Chatterbox
 * (~24kHz, single ~35s model load, few seconds per line) uses comfortably.
 *
 * Output contract is identical to generate_vo.js on purpose -- same
 * timing-summary.json / cue-sheet.csv shape, same per-line-file-in-OUT_DIR
 * layout (just .wav instead of .mp3) -- so assemble_reel.js and build_reel.js
 * don't need to know or care which engine produced the audio.
 *
 * Usage:
 *   node docs/marketing/generate_vo_local.js [--out docs/marketing/vo]
 *     [--voice-sample /path/to/reference.wav]  # optional voice cloning;
 *                                               # Chatterbox's built-in voice
 *                                               # is used if omitted
 *     [--exaggeration 0.5] [--cfg-weight 0.5] [--seed 0]
 *     [--python /path/to/python]               # override the interpreter;
 *                                               # defaults to the
 *                                               # .venv-chatterbox venv below
 *
 * Setup (one-time, not run by this script -- Chatterbox pins torch/torchaudio
 * versions that would otherwise fight whatever the rest of the machine uses,
 * so it lives in its own venv rather than the global/dev Python):
 *   python -m venv docs/marketing/.venv-chatterbox
 *   docs/marketing/.venv-chatterbox/Scripts/pip install chatterbox-tts
 *   docs/marketing/.venv-chatterbox/Scripts/pip install --force-reinstall \
 *     torch==2.6.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cu124
 *   (the plain `pip install chatterbox-tts` alone pulls a CPU-only torch
 *   wheel even on a CUDA machine -- confirmed empirically -- hence the
 *   separate forced CUDA-wheel reinstall as its own step.)
 *
 * The actual model work happens in chatterbox_generate.py, run once per
 * script invocation (not once per line) since model load is the slow part
 * (~30-35s) -- see that file's header comment.
 */

import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { createInterface } from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const SCRIPT_MD = path.join(__dirname, 'sizzle-reel-script.md');
const VENV_DIR = path.join(__dirname, '.venv-chatterbox');

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const getArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : null;
};
const hasFlag = (flag) => args.includes(flag);

const OUT_DIR = getArg('--out') ?? path.join(__dirname, 'vo');
const VOICE_SAMPLE = getArg('--voice-sample');
const EXAGGERATION = getArg('--exaggeration') ?? '0.5';
const CFG_WEIGHT = getArg('--cfg-weight') ?? '0.5';
const SEED = getArg('--seed');
// Windows venvs put the interpreter under Scripts/, not bin/.
const DEFAULT_PYTHON = path.join(VENV_DIR, process.platform === 'win32' ? 'Scripts' : 'bin', process.platform === 'win32' ? 'python.exe' : 'python');
const PYTHON = getArg('--python') ?? DEFAULT_PYTHON;

// ---------------------------------------------------------------------------
// Script parsing -- identical to generate_vo.js's parseScriptLines/slugifyId,
// duplicated rather than shared since each script in this pipeline is
// self-contained (see capture_broll.js / assemble_reel.js / build_reel.js).
// ---------------------------------------------------------------------------
async function parseScriptLines() {
    const md = await fs.readFile(SCRIPT_MD, 'utf8');
    const lines = md.split('\n');
    const rows = [];
    let inTable = false;
    for (const line of lines) {
        if (line.startsWith('| Time')) { inTable = true; continue; }
        if (inTable && line.startsWith('|---')) continue;
        if (inTable && !line.startsWith('|')) { inTable = false; continue; }
        if (!inTable) continue;

        const cols = line.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
        if (cols.length < 2) continue;
        const [time, id, vo] = cols.length >= 4 ? cols : [cols[0], null, cols[1]];
        if (vo.startsWith('*(silent') || vo === '') continue;
        const text = vo.replace(/^"|"$/g, '');
        rows.push({ time, id: id && id !== '-' ? id : null, text });
    }
    return rows;
}

function slugifyTime(time) {
    return time.replace(/[^0-9]+/g, '-').replace(/^-|-$/g, '');
}

function slugifyId(id, time) {
    return id ? id.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() : slugifyTime(time);
}

// ---------------------------------------------------------------------------
// Run chatterbox_generate.py once for the whole batch, parsing its
// "RESULT: {json}" stdout lines as they arrive; everything else on stdout/
// stderr (model-load logs, per-line timing) is forwarded live so a stalled
// run is visible instead of looking hung.
// ---------------------------------------------------------------------------
async function runChatterbox(jobs) {
    if (!existsSync(PYTHON)) {
        throw new Error(
            `Python interpreter not found at ${PYTHON}. Run the one-time venv setup in this file's ` +
            `header comment, or pass --python /path/to/python.`
        );
    }

    const jobsPath = path.join(os.tmpdir(), `vangard-vo-jobs-${Date.now()}.json`);
    await fs.writeFile(jobsPath, JSON.stringify(jobs, null, 2));

    const pyArgs = [
        path.join(__dirname, 'chatterbox_generate.py'),
        '--jobs', jobsPath,
        '--out', OUT_DIR,
        '--exaggeration', EXAGGERATION,
        '--cfg-weight', CFG_WEIGHT,
    ];
    if (VOICE_SAMPLE) pyArgs.push('--voice-sample', VOICE_SAMPLE);
    if (SEED) pyArgs.push('--seed', SEED);

    const results = new Map(); // id -> { filename, durationSeconds, error }

    await new Promise((resolve, reject) => {
        const proc = spawn(PYTHON, pyArgs, { cwd: ROOT });

        const stdoutRl = createInterface({ input: proc.stdout });
        stdoutRl.on('line', (line) => {
            if (line.startsWith('RESULT: ')) {
                const r = JSON.parse(line.slice('RESULT: '.length));
                results.set(r.id, r);
            } else {
                console.log(line);
            }
        });
        const stderrRl = createInterface({ input: proc.stderr });
        stderrRl.on('line', (line) => console.log(line));

        proc.on('error', reject);
        proc.on('exit', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`chatterbox_generate.py exited with code ${code}`));
        });
    });

    await fs.rm(jobsPath).catch(() => {});
    return results;
}

async function main() {
    if (hasFlag('--dry-run')) {
        const rows = await parseScriptLines();
        console.log(`\nParsed ${rows.length} VO line(s) from ${SCRIPT_MD}:\n`);
        rows.forEach((r, i) => console.log(`  [${String(i + 1).padStart(2, '0')}] ${(r.id ?? '').padEnd(16)} ${r.time.padEnd(12)} "${r.text}"`));
        return;
    }

    const rows = await parseScriptLines();
    if (rows.length === 0) {
        console.error(`No VO lines found in ${SCRIPT_MD}`);
        process.exit(1);
    }

    await fs.mkdir(OUT_DIR, { recursive: true });
    console.log(`\nGenerating ${rows.length} VO line(s) locally with Chatterbox TTS`);
    console.log(`Saving to: ${OUT_DIR}\n`);

    // "id" is the job-matching key (chatterbox_generate.py's RESULT lines
    // don't preserve row order), so rows with no ID (older 3-column script
    // format) fall back to a synthesized one that's unique per row.
    const jobs = rows.map((r, i) => {
        const num = String(i + 1).padStart(2, '0');
        return {
            id: r.id ?? `__row${i}`,
            filename: `${num}-${slugifyId(r.id, r.time)}.wav`,
            text: r.text,
        };
    });

    const results = await runChatterbox(jobs);

    const summary = [];
    let failed = 0;
    for (let i = 0; i < rows.length; i++) {
        const { time, id, text } = rows[i];
        const job = jobs[i];
        const result = results.get(job.id);
        if (!result) {
            failed++;
            summary.push({ time, id, filename: null, durationSeconds: null, text, error: 'No result from chatterbox_generate.py (process may have crashed before reaching this line)' });
        } else if (result.error) {
            failed++;
            summary.push({ time, id, filename: null, durationSeconds: null, text, error: result.error });
        } else {
            summary.push({ time, id, filename: result.filename, durationSeconds: result.durationSeconds, text });
        }
    }

    const summaryPath = path.join(OUT_DIR, 'timing-summary.json');
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));

    // Same plain-text cue sheet as generate_vo.js, for glancing at line
    // order/duration/text while aligning clips by hand in a video editor.
    const cueSheetPath = path.join(OUT_DIR, 'cue-sheet.csv');
    const csvEscape = (s) => `"${String(s).replace(/"/g, '""')}"`;
    const csvRows = [
        ['#', 'id', 'script time', 'duration (s)', 'filename', 'text'].map(csvEscape).join(','),
        ...summary.map((s, i) => [
            String(i + 1).padStart(2, '0'),
            s.id ?? '',
            s.time,
            s.durationSeconds?.toFixed(2) ?? '',
            s.filename ?? '(failed)',
            s.text,
        ].map(csvEscape).join(',')),
    ];
    await fs.writeFile(cueSheetPath, csvRows.join('\n'));

    console.log(`\nTiming summary written to ${summaryPath}`);
    console.log(`Cue sheet written to ${cueSheetPath}`);
    console.log(`Done: ${rows.length - failed} captured, ${failed} failed.`);
    if (failed > 0) process.exit(1);
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
