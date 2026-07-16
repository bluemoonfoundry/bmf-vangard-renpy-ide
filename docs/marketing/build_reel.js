#!/usr/bin/env node
/**
 * build_reel.js
 *
 * Orchestrates the sizzle reel pipeline end to end:
 *   1. generate_vo.js / generate_vo_local.js -- VO audio from
 *                               sizzle-reel-script.md, via --vo-engine
 *                               (default: local -- see that flag below).
 *   2. capture_broll.js     -- one Electron launch + video file per clip
 *                               (broll-<clip-id>.webm) -- see its header
 *                               comment for why each clip gets its own
 *                               recording instead of one continuous take.
 *   3. assemble_reel.js     -- slices + crossfades + cards -> draft cut
 *
 * Usage:
 *   node docs/marketing/build_reel.js [options]
 *
 * Options (space-separated value, not --flag=value, matching the other
 * scripts in this pipeline):
 *   --steps vo,broll,assemble    Which steps to run, comma-separated, in this
 *                                order regardless of how you list them.
 *                                Default: all three.
 *   --vo-engine local|elevenlabs Which VO generator the vo step runs.
 *                                Default: local (generate_vo_local.js,
 *                                Chatterbox TTS on this machine's GPU -- see
 *                                that file's header comment for why: the
 *                                project's ElevenLabs quota ran out
 *                                mid-project). Pass elevenlabs to use the
 *                                original API-based generate_vo.js instead
 *                                (once quota is available again).
 *   --voice <voice_id>          Required if the vo step runs with
 *                                --vo-engine elevenlabs. See
 *                                generate_vo.js --list-voices.
 *   --voice-sample /path        Passed through to generate_vo_local.js
 *                                (--vo-engine local only) -- optional
 *                                reference audio for voice cloning; omit to
 *                                use Chatterbox's built-in voice.
 *   --exaggeration N            Passed through to generate_vo_local.js.
 *   --cfg-weight N               "
 *   --vo-match position|content Passed through to assemble_reel.js. Default
 *                                position (see sizzle-reel-script.md's "ID
 *                                column" note for when to use content).
 *   --skip-if-exists            Skip a step if its main output already
 *                                exists (vo/timing-summary.json,
 *                                broll/manifest.json,
 *                                assembly/sizzle-reel-draft.mp4). Useful when
 *                                you've only changed a downstream step's
 *                                inputs and don't want to redo an expensive
 *                                upstream one (capture-broll takes minutes).
 *   --dry-run                   Preview parsed VO lines without generating
 *                                audio (or spending API credits, on the
 *                                elevenlabs engine); implies --steps=vo and
 *                                skips broll/assemble (there's nothing to
 *                                build without real VO output).
 *   --continue-on-error         Run remaining steps even if one fails.
 *                                Default: stop at the first failure.
 *   --project /path             Passed through to capture_broll.js.
 *   --out /path                 Passed through to assemble_reel.js (still
 *                                defaults to its own docs/marketing/assembly).
 */

import path from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, '..');

const args = process.argv.slice(2);
const getArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : null;
};
const hasFlag = (flag) => args.includes(flag);

const DRY_RUN = hasFlag('--dry-run');
const STEP_ORDER = ['vo', 'broll', 'assemble'];
const requestedSteps = DRY_RUN
    ? ['vo']
    : (getArg('--steps') ?? STEP_ORDER.join(',')).split(',').map(s => s.trim());
const steps = STEP_ORDER.filter(s => requestedSteps.includes(s));

const unknown = requestedSteps.filter(s => !STEP_ORDER.includes(s));
if (unknown.length > 0) {
    console.error(`Unknown step(s) in --steps: ${unknown.join(', ')}. Valid: ${STEP_ORDER.join(', ')}`);
    process.exit(1);
}

const VO_ENGINE = getArg('--vo-engine') ?? 'local';
if (!['local', 'elevenlabs'].includes(VO_ENGINE)) {
    console.error(`--vo-engine must be "local" or "elevenlabs", got "${VO_ENGINE}"`);
    process.exit(1);
}

const VOICE = getArg('--voice');
if (steps.includes('vo') && VO_ENGINE === 'elevenlabs' && !VOICE && !DRY_RUN) {
    console.error('Missing --voice <voice_id> (required for the vo step with --vo-engine elevenlabs). Run generate_vo.js --list-voices to see options.');
    process.exit(1);
}

const VOICE_SAMPLE = getArg('--voice-sample');
const EXAGGERATION = getArg('--exaggeration');
const CFG_WEIGHT = getArg('--cfg-weight');

const VO_MATCH = getArg('--vo-match') ?? 'position';
const PROJECT = getArg('--project');
const OUT = getArg('--out');
const SKIP_IF_EXISTS = hasFlag('--skip-if-exists');
const CONTINUE_ON_ERROR = hasFlag('--continue-on-error');

// Each step's primary output, checked for --skip-if-exists.
const STEP_OUTPUT = {
    vo: path.join(DOCS_DIR, 'marketing', 'vo', 'timing-summary.json'),
    broll: path.join(DOCS_DIR, 'marketing', 'broll', 'manifest.json'),
    assemble: path.join(DOCS_DIR, 'marketing', 'assembly', 'sizzle-reel-draft.mp4'),
};

function buildStepArgs(step) {
    switch (step) {
        case 'vo': {
            if (VO_ENGINE === 'local') {
                const a = [path.join(DOCS_DIR, 'marketing', 'generate_vo_local.js')];
                if (DRY_RUN) { a.push('--dry-run'); return a; }
                if (VOICE_SAMPLE) a.push('--voice-sample', VOICE_SAMPLE);
                if (EXAGGERATION) a.push('--exaggeration', EXAGGERATION);
                if (CFG_WEIGHT) a.push('--cfg-weight', CFG_WEIGHT);
                return a;
            }
            const a = [path.join(DOCS_DIR, 'marketing', 'generate_vo.js')];
            if (DRY_RUN) { a.push('--dry-run'); return a; }
            a.push('--voice', VOICE);
            return a;
        }
        case 'broll': {
            const a = [path.join(DOCS_DIR, 'capture_broll.js')];
            if (PROJECT) a.push('--project', PROJECT);
            return a;
        }
        case 'assemble': {
            const a = [path.join(DOCS_DIR, 'marketing', 'assemble_reel.js'), '--vo-match', VO_MATCH];
            if (OUT) a.push('--out', OUT);
            return a;
        }
        default:
            throw new Error(`Unhandled step: ${step}`);
    }
}

function runStep(step) {
    return new Promise((resolve, reject) => {
        const child = spawn(process.execPath, buildStepArgs(step), { stdio: 'inherit' });
        child.on('exit', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`${step} exited with code ${code}`));
        });
        child.on('error', reject);
    });
}

async function main() {
    console.log(`\nSizzle reel pipeline: ${steps.join(' -> ') || '(no steps selected)'}\n`);

    for (const step of steps) {
        if (SKIP_IF_EXISTS && existsSync(STEP_OUTPUT[step])) {
            console.log(`\n=== ${step}: skipped (${STEP_OUTPUT[step]} already exists) ===`);
            continue;
        }
        console.log(`\n=== ${step} ===`);
        try {
            await runStep(step);
        } catch (err) {
            console.error(`\n${step} failed: ${err.message}`);
            if (!CONTINUE_ON_ERROR) {
                console.error('Stopping (pass --continue-on-error to run remaining steps anyway).');
                process.exit(1);
            }
        }
    }

    console.log('\nDone.');
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
