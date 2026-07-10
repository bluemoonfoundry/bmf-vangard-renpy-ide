#!/usr/bin/env node
/**
 * assemble_reel.js
 *
 * Stitches docs/marketing/broll/*.webm and docs/marketing/vo/*.mp3 into a
 * rough assembly cut of the sizzle reel, using vo/timing-summary.json for
 * per-line VO duration. This is a DRAFT cut for reviewing pacing, not a
 * final edit -- it has no music (the script's two silent beats stay silent),
 * no transitions, and the closing "Vangard Studio / Free on Itch.io" card
 * (1:10-1:18, never captured as app footage -- see sizzle-reel-script.md) is
 * a plain placeholder title card, not final branding.
 *
 * Usage:
 *   node docs/marketing/assemble_reel.js [--out docs/marketing/assembly]
 *
 * Requirements:
 *   ffmpeg on PATH, or set FFMPEG_PATH (env or docs/marketing/.env, same
 *   loading mechanism as generate_vo.js).
 */

import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');

for (const envPath of [path.join(__dirname, '.env'), path.join(ROOT, '.env')]) {
    if (existsSync(envPath)) {
        process.loadEnvFile(envPath);
        break;
    }
}

const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';

const args = process.argv.slice(2);
const getArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : null;
};

const BROLL_DIR = path.join(__dirname, 'broll');
const VO_DIR = path.join(__dirname, 'vo');
const OUT_DIR = getArg('--out') ?? path.join(__dirname, 'assembly');
const WORK_DIR = path.join(OUT_DIR, 'segments');

const WIDTH = 1920;
const HEIGHT = 1080;
const FPS = 30;

// ---------------------------------------------------------------------------
// Timeline manifest -- maps each script cue to its captured b-roll clip(s)
// and (if any) VO line. Order matters: this is playback order.
// ---------------------------------------------------------------------------
function buildTimeline(timingByFile) {
    const vo = (filename) => {
        const entry = timingByFile[filename];
        if (!entry) throw new Error(`No timing entry for VO file ${filename} -- rerun generate_vo.js`);
        return { file: path.join(VO_DIR, filename), duration: entry.durationSeconds, text: entry.text };
    };

    return [
        // 0:00-0:03: silent lead-in, first 3s of the same clip vo-01 continues from.
        {
            id: '00-intro-silent',
            sources: [{ file: path.join(BROLL_DIR, '01-code-chaos.webm'), ss: 0 }],
            targetDuration: 3,
            audio: null,
        },
        {
            id: '01-vo',
            sources: [{ file: path.join(BROLL_DIR, '01-code-chaos.webm'), ss: 3 }],
            targetDuration: vo('01-0-03-0-11.mp3').duration,
            audio: vo('01-0-03-0-11.mp3'),
        },
        {
            id: '02-vo',
            sources: [{ file: path.join(BROLL_DIR, '02-project-canvas-reveal.webm'), ss: 0 }],
            targetDuration: vo('02-0-11-0-16.mp3').duration,
            audio: vo('02-0-11-0-16.mp3'),
        },
        {
            id: '03-vo',
            sources: [
                { file: path.join(BROLL_DIR, '03-canvas-tour-project.webm'), ss: 0 },
                { file: path.join(BROLL_DIR, '03-canvas-tour-flow.webm'), ss: 0 },
                { file: path.join(BROLL_DIR, '03-canvas-tour-choices.webm'), ss: 0 },
            ],
            targetDuration: vo('03-0-16-0-25.mp3').duration,
            audio: vo('03-0-16-0-25.mp3'),
        },
        {
            id: '04-vo',
            sources: [{ file: path.join(BROLL_DIR, '04-diagnostics.webm'), ss: 0 }],
            targetDuration: vo('04-0-25-0-32.mp3').duration,
            audio: vo('04-0-25-0-32.mp3'),
        },
        {
            id: '05-vo',
            sources: [{ file: path.join(BROLL_DIR, '05-editor-autocomplete.webm'), ss: 0 }],
            targetDuration: vo('05-0-32-0-39.mp3').duration,
            audio: vo('05-0-32-0-39.mp3'),
        },
        {
            id: '06-vo',
            sources: [{ file: path.join(BROLL_DIR, '06-scene-composer.webm'), ss: 0 }],
            targetDuration: vo('06-0-39-0-47.mp3').duration,
            audio: vo('06-0-39-0-47.mp3'),
        },
        {
            id: '07-vo',
            sources: [{ file: path.join(BROLL_DIR, '07-warp-to-label.webm'), ss: 0 }],
            targetDuration: vo('07-0-47-0-53.mp3').duration,
            audio: vo('07-0-47-0-53.mp3'),
        },
        {
            id: '08-vo',
            sources: [{ file: path.join(BROLL_DIR, '08-real-renpy-file.webm'), ss: 0 }],
            targetDuration: vo('08-0-53-1-00.mp3').duration,
            audio: vo('08-0-53-1-00.mp3'),
        },
        // 1:00-1:10: silent feature montage -- reserved for a music swell per
        // the script; stays silent here since no track has been licensed yet.
        {
            id: '09-montage-silent',
            sources: [
                { file: path.join(BROLL_DIR, '09-feature-montage-translation.webm'), ss: 0 },
                { file: path.join(BROLL_DIR, '09-feature-montage-snippets.webm'), ss: 0 },
                { file: path.join(BROLL_DIR, '09-feature-montage-menu-constructor.webm'), ss: 0 },
                { file: path.join(BROLL_DIR, '09-feature-montage-drafting-mode.webm'), ss: 0 },
            ],
            targetDuration: 10,
            audio: null,
        },
        // 1:10-1:18: closing card -- no app footage exists for this cue (see
        // header comment), so it's a plain placeholder, not final branding.
        {
            id: '10-titlecard',
            sources: null,
            titlecard: true,
            targetDuration: vo('09-1-10-1-18.mp3').duration,
            audio: vo('09-1-10-1-18.mp3'),
        },
    ];
}

// ---------------------------------------------------------------------------
// ffmpeg/ffprobe helpers
// ---------------------------------------------------------------------------
/** Playwright's Electron recordVideo output has no duration in its webm
 *  header (ffprobe's format=duration reports "N/A" for every clip this
 *  pipeline produces -- confirmed empirically, not just on short ones), so
 *  probing the container is unreliable. Decode the file instead and read the
 *  last "time=" ffmpeg prints -- that's the actual playable length. */
async function realDuration(file) {
    // ffmpeg exits 0 here even when it logs "File ended prematurely" -- the
    // decode still completes over whatever frames exist, it just can't
    // corroborate them against a (missing) container-level duration.
    const { stderr } = await execFileAsync(FFMPEG, ['-i', file, '-f', 'null', '-']).catch(e => e);
    const matches = [...(stderr || '').matchAll(/time=(\d+):(\d+):(\d+\.\d+)/g)];
    if (matches.length === 0) throw new Error(`Could not determine duration of ${file}`);
    const [, h, m, s] = matches[matches.length - 1];
    return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

async function run(cmdArgs) {
    try {
        await execFileAsync(FFMPEG, ['-y', '-hide_banner', '-loglevel', 'error', ...cmdArgs]);
    } catch (err) {
        throw new Error(`ffmpeg failed: ${err.stderr || err.message}`);
    }
}

const SCALE_PAD = `scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=decrease,pad=${WIDTH}:${HEIGHT}:(ow-iw)/2:(oh-ih)/2,fps=${FPS}`;

/** Renders one source clip, trimmed/padded to exactly `duration` seconds,
 *  normalized to WIDTHxHEIGHT@FPS, video-only. Pads with a frozen last frame
 *  (tpad) if the source runs out before `duration` is reached. */
async function renderClip(source, duration, outPath) {
    const available = (await realDuration(source.file)) - source.ss;
    const shortfall = duration - available;
    const vf = shortfall > 0.05
        ? `${SCALE_PAD},tpad=stop_mode=clone:stop_duration=${shortfall.toFixed(3)}`
        : SCALE_PAD;
    await run([
        '-ss', String(source.ss),
        '-i', source.file,
        '-t', String(duration),
        '-vf', vf,
        '-an',
        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20',
        outPath,
    ]);
}

// drawtext needs an explicit fontfile on this ffmpeg build -- it has no
// fontconfig.conf, so the default fontconfig-based lookup errors out.
const TITLE_CARD_FONT = process.env.TITLE_CARD_FONT || 'C:/Windows/Fonts/segoeui.ttf';

/** Renders a solid-color placeholder card with centered text. */
async function renderTitleCard(duration, outPath) {
    const text = 'Vangard Studio — Free on Itch.io';
    await run([
        '-f', 'lavfi',
        '-i', `color=c=0x111318:s=${WIDTH}x${HEIGHT}:d=${duration}:r=${FPS}`,
        // ffmpeg's filter-option parser treats ':' as a delimiter, which
        // collides with a Windows drive letter (C:/...) -- escape it.
        '-vf', `drawtext=fontfile='${TITLE_CARD_FONT.replace(/:/g, '\\:')}':text='${text}':fontcolor=white:fontsize=64:x=(w-text_w)/2:y=(h-text_h)/2`,
        '-an',
        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20',
        outPath,
    ]);
}

/** Concatenates already-rendered same-format clips via the concat demuxer. */
async function concat(files, outPath) {
    const listPath = `${outPath}.txt`;
    const listContent = files.map(f => `file '${f.replace(/'/g, "'\\''")}'`).join('\n');
    await fs.writeFile(listPath, listContent);
    await run(['-f', 'concat', '-safe', '0', '-i', listPath, '-c', 'copy', outPath]);
    await fs.rm(listPath).catch(() => {});
}

async function main() {
    if (!existsSync(BROLL_DIR) || !existsSync(VO_DIR)) {
        console.error('Missing docs/marketing/broll/ or docs/marketing/vo/ -- run capture-broll and generate-vo first.');
        process.exit(1);
    }

    const timingRaw = JSON.parse(await fs.readFile(path.join(VO_DIR, 'timing-summary.json'), 'utf8'));
    const timingByFile = Object.fromEntries(timingRaw.filter(t => t.filename).map(t => [t.filename, t]));

    await fs.mkdir(WORK_DIR, { recursive: true });
    const timeline = buildTimeline(timingByFile);

    console.log(`\nRendering ${timeline.length} segment(s) to ${WORK_DIR}\n`);

    const renderedVideoSegments = [];
    let cursor = 0;
    const audioPlacements = [];

    for (const segment of timeline) {
        process.stdout.write(`  [${segment.id}] target ${segment.targetDuration.toFixed(2)}s `);

        const segmentVideoPath = path.join(WORK_DIR, `${segment.id}.mp4`);
        if (segment.titlecard) {
            await renderTitleCard(segment.targetDuration, segmentVideoPath);
        } else if (segment.sources.length === 1) {
            await renderClip(segment.sources[0], segment.targetDuration, segmentVideoPath);
        } else {
            const share = segment.targetDuration / segment.sources.length;
            const subPaths = [];
            for (let i = 0; i < segment.sources.length; i++) {
                const subPath = path.join(WORK_DIR, `${segment.id}-${i}.mp4`);
                await renderClip(segment.sources[i], share, subPath);
                subPaths.push(subPath);
            }
            await concat(subPaths, segmentVideoPath);
        }
        renderedVideoSegments.push(segmentVideoPath);

        if (segment.audio) {
            audioPlacements.push({ file: segment.audio.file, startSeconds: cursor });
        }
        cursor += segment.targetDuration;
        console.log('ok');
    }

    const totalDuration = cursor;
    console.log(`\nTotal draft duration: ${totalDuration.toFixed(2)}s\n`);

    // --- Concatenate the picture-locked video track ---
    const videoTrackPath = path.join(OUT_DIR, 'video-track.mp4');
    console.log('Concatenating video track...');
    await concat(renderedVideoSegments, videoTrackPath);

    // --- Build the audio track: silence base + each VO line delayed to its
    //     segment's start time, mixed together. Silent beats stay silent. ---
    const audioTrackPath = path.join(OUT_DIR, 'audio-track.m4a');
    console.log('Building audio track...');
    const ffArgs = ['-f', 'lavfi', '-i', `anullsrc=r=44100:cl=stereo:d=${totalDuration}`];
    for (const p of audioPlacements) ffArgs.push('-i', p.file);
    const delayed = audioPlacements.map((p, i) =>
        `[${i + 1}]adelay=${Math.round(p.startSeconds * 1000)}|${Math.round(p.startSeconds * 1000)}[a${i}]`
    );
    const mixInputs = ['[0]', ...audioPlacements.map((_, i) => `[a${i}]`)].join('');
    const filterComplex = `${delayed.join(';')}${delayed.length ? ';' : ''}${mixInputs}amix=inputs=${audioPlacements.length + 1}:duration=first:dropout_transition=0[aout]`;
    ffArgs.push('-filter_complex', filterComplex, '-map', '[aout]', '-t', String(totalDuration), audioTrackPath);
    await run(ffArgs);

    // --- Mux ---
    const finalPath = path.join(OUT_DIR, 'sizzle-reel-draft.mp4');
    console.log('Muxing final draft...');
    await run(['-i', videoTrackPath, '-i', audioTrackPath, '-c:v', 'copy', '-c:a', 'aac', '-shortest', finalPath]);

    console.log(`\nDraft cut written to: ${finalPath}`);
    console.log('Reminder: silent beats have no music yet, and the closing card is a placeholder -- both need the video editor pass noted in the sizzle reel issue.');
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
