#!/usr/bin/env node
/**
 * generate_vo.js
 *
 * Sends each VO line from docs/marketing/sizzle-reel-script.md to the
 * ElevenLabs text-to-speech API and saves timed audio per line, per the
 * script's "Next steps" checklist item: "Send this script to the VO service,
 * get timed audio back per line."
 *
 * Usage:
 *   node docs/marketing/generate_vo.js --list-voices
 *   node docs/marketing/generate_vo.js --voice <voice_id> [--out docs/marketing/vo] [--model <model_id>]
 *
 * Auth:
 *   Reads ELEVENLABS_API_KEY from the environment, or from a .env file at the
 *   repo root or docs/marketing/.env (both gitignored) via Node's built-in
 *   process.loadEnvFile(). Never hardcode the key in this file.
 */

import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const SCRIPT_MD = path.join(__dirname, 'sizzle-reel-script.md');

for (const envPath of [path.join(__dirname, '.env'), path.join(ROOT, '.env')]) {
    if (existsSync(envPath)) {
        process.loadEnvFile(envPath);
        break;
    }
}

const API_KEY = process.env.ELEVENLABS_API_KEY;
const API_BASE = 'https://api.elevenlabs.io';

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const getArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : null;
};
const hasFlag = (flag) => args.includes(flag);

const LIST_VOICES = hasFlag('--list-voices');
const VOICE_ID    = getArg('--voice');
const OUT_DIR     = getArg('--out') ?? path.join(__dirname, 'vo');
const MODEL_ID    = getArg('--model') ?? 'eleven_multilingual_v2';

function requireApiKey() {
    if (!API_KEY) {
        console.error(
            'ELEVENLABS_API_KEY is not set.\n' +
            'Set it in your shell, or create docs/marketing/.env (gitignored) containing:\n' +
            '  ELEVENLABS_API_KEY=your-key-here'
        );
        process.exit(1);
    }
}

// ---------------------------------------------------------------------------
// List voices -- lets the caller pick a voice_id from their own account
// instead of hardcoding a name that may not exist / may be stale.
// ---------------------------------------------------------------------------
async function listVoices() {
    requireApiKey();
    const res = await fetch(`${API_BASE}/v1/voices`, {
        headers: { 'xi-api-key': API_KEY },
    });
    if (!res.ok) {
        throw new Error(`ElevenLabs /v1/voices failed: ${res.status} ${await res.text()}`);
    }
    const { voices } = await res.json();
    console.log(`\n${voices.length} voice(s) available:\n`);
    for (const v of voices) {
        const desc = v.labels ? Object.values(v.labels).filter(Boolean).join(', ') : '';
        console.log(`  ${v.voice_id}  ${v.name}${desc ? `  (${desc})` : ''}`);
    }
    console.log('\nPass one as: node docs/marketing/generate_vo.js --voice <voice_id>');
}

// ---------------------------------------------------------------------------
// Parse the locked script's VO tables -- extracts one entry per non-silent
// row, across every table in the doc (v2 splits the script into several
// "### Section" tables, one per cue group, not a single table like v1).
// Table format (see sizzle-reel-script.md): either the current
// "| Time | ID | VO (narrator) | On-screen / visual cue |" (4 columns -- ID
// is "-" for silent rows), or the older 3-column format without an ID
// column, for backward compatibility.
// ---------------------------------------------------------------------------
async function parseScriptLines() {
    const md = await fs.readFile(SCRIPT_MD, 'utf8');
    const lines = md.split('\n');
    const rows = [];
    let inTable = false;
    for (const line of lines) {
        if (line.startsWith('| Time')) { inTable = true; continue; }
        if (inTable && line.startsWith('|---')) continue;
        if (inTable && !line.startsWith('|')) { inTable = false; continue; } // this table ended, more may follow
        if (!inTable) continue;

        const cols = line.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
        if (cols.length < 2) continue;
        const [time, id, vo] = cols.length >= 4 ? cols : [cols[0], null, cols[1]];
        if (vo.startsWith('*(silent') || vo === '') continue;
        // Strip the wrapping quotes the script uses around VO lines.
        const text = vo.replace(/^"|"$/g, '');
        rows.push({ time, id: id && id !== '-' ? id : null, text });
    }
    return rows;
}

function slugifyTime(time) {
    return time.replace(/[^0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ---------------------------------------------------------------------------
// Generate one line's audio + alignment via the with-timestamps endpoint,
// which returns character-level timing -- gives us the actual clip duration
// without needing ffmpeg/ffprobe to inspect the saved mp3.
// ---------------------------------------------------------------------------
async function generateLine(voiceId, text) {
    const res = await fetch(
        `${API_BASE}/v1/text-to-speech/${voiceId}/with-timestamps`,
        {
            method: 'POST',
            headers: {
                'xi-api-key': API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                model_id: MODEL_ID,
            }),
        }
    );
    if (!res.ok) {
        throw new Error(`ElevenLabs TTS failed: ${res.status} ${await res.text()}`);
    }
    const { audio_base64, alignment } = await res.json();
    const endTimes = alignment?.character_end_times_seconds ?? [];
    const durationSeconds = endTimes.length ? endTimes[endTimes.length - 1] : null;
    return { audioBuffer: Buffer.from(audio_base64, 'base64'), durationSeconds };
}

async function main() {
    if (LIST_VOICES) {
        await listVoices();
        return;
    }

    if (hasFlag('--dry-run')) {
        const rows = await parseScriptLines();
        console.log(`\nParsed ${rows.length} VO line(s) from ${SCRIPT_MD}:\n`);
        rows.forEach((r, i) => console.log(`  [${String(i + 1).padStart(2, '0')}] ${(r.id ?? '').padEnd(16)} ${r.time.padEnd(12)} "${r.text}"`));
        return;
    }

    if (!VOICE_ID) {
        console.error('Missing --voice <voice_id>. Run with --list-voices to see available voices.');
        process.exit(1);
    }
    requireApiKey();

    const rows = await parseScriptLines();
    if (rows.length === 0) {
        console.error(`No VO lines found in ${SCRIPT_MD}`);
        process.exit(1);
    }

    await fs.mkdir(OUT_DIR, { recursive: true });
    console.log(`\nGenerating ${rows.length} VO line(s) with voice ${VOICE_ID}`);
    console.log(`Saving to: ${OUT_DIR}\n`);

    const summary = [];
    let failed = 0;
    for (let i = 0; i < rows.length; i++) {
        const { time, id, text } = rows[i];
        const num = String(i + 1).padStart(2, '0');
        const filename = `${num}-${slugifyTime(time)}.mp3`;
        process.stdout.write(`  [${num}] ${(id ?? '').padEnd(16)} ${time.padEnd(12)} "${text.slice(0, 40)}${text.length > 40 ? '...' : ''}" `);
        try {
            const { audioBuffer, durationSeconds } = await generateLine(VOICE_ID, text);
            await fs.writeFile(path.join(OUT_DIR, filename), audioBuffer);
            summary.push({ time, id, filename, durationSeconds, text });
            console.log(`ok (${durationSeconds?.toFixed(2) ?? '?'}s) -> ${filename}`);
        } catch (err) {
            failed++;
            summary.push({ time, id, filename: null, durationSeconds: null, text, error: err.message });
            console.log(`FAILED: ${err.message.split('\n')[0]}`);
        }
    }

    const summaryPath = path.join(OUT_DIR, 'timing-summary.json');
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`\nTiming summary written to ${summaryPath}`);
    console.log(`Done: ${rows.length - failed} captured, ${failed} failed.`);
    if (failed > 0) process.exit(1);
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
