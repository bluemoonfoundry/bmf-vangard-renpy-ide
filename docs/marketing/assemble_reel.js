#!/usr/bin/env node
/**
 * assemble_reel.js
 *
 * Stitches the b-roll take in docs/marketing/broll/broll-main.mp4 (see
 * capture_broll.js -- one continuous OS-level real-time screen capture
 * covering every clip back to back) and docs/marketing/vo/*.mp3 into a rough
 * assembly cut of the sizzle reel, using vo/timing-summary.json for per-line
 * VO duration and broll/manifest.json for each clip's [start, end] window
 * within that take (plus which file, since a --clip test run's manifest
 * entries point at their own broll-test-*.mp4 instead). This is a DRAFT cut
 * for reviewing pacing, not a final edit -- the intro/divider/outro cards are
 * plain black-background placeholders, not final branding.
 *
 * Usage:
 *   node docs/marketing/assemble_reel.js [--out docs/marketing/assembly] [--music /path/to/track.mp3]
 *
 * Background music (optional): pass --music, or set MUSIC_TRACK (env or
 * docs/marketing/.env). Plays continuously, ducked under every VO line and
 * back up to full "swell" volume in the silent beats (intro lead-in, divider
 * cards, montage, outro tail). Loops if shorter than the draft, trimmed if
 * longer. Skipped entirely if not configured.
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

// position: match VO lines to timeline slots by their index in the script's
// tables (fast, but breaks if a row is inserted/removed/reordered upstream).
// content: match by the script's ID column instead, which survives reordering
// -- see sizzle-reel-script.md's "ID column" note.
const VO_MATCH_MODE = getArg('--vo-match') ?? 'position';
if (!['position', 'content'].includes(VO_MATCH_MODE)) {
    console.error(`--vo-match must be "position" or "content", got "${VO_MATCH_MODE}"`);
    process.exit(1);
}

// Background music is optional and local-only (docs/marketing/music/ is
// gitignored -- licensing for redistribution isn't confirmed). Skipped
// entirely if not configured.
const MUSIC_TRACK_RAW = getArg('--music') ?? process.env.MUSIC_TRACK ?? null;
const MUSIC_TRACK = MUSIC_TRACK_RAW ? path.resolve(ROOT, MUSIC_TRACK_RAW) : null;
const MUSIC_BASE_VOLUME = 0.35; // level under silent beats (intro lead-in, divider cards, montage, outro tail)
// Ducking is done with sidechaincompress (music compressed against the VO
// mix as the trigger) rather than manually toggling volume=enable at each
// VO placement's start/end -- that approach stepped the volume instantly at
// the boundary, which is audible as a click/stutter. Sidechain compression
// has built-in attack/release ramps, so the duck fades smoothly in and out
// and reacts to the real VO envelope (natural mid-line pauses too) instead
// of a fixed window.
const DUCK_THRESHOLD = 0.05; // VO level (linear) above which ducking engages
const DUCK_RATIO = 10; // higher = more aggressive duck once past threshold
const DUCK_ATTACK_MS = 120; // fade-down time when VO starts
const DUCK_RELEASE_MS = 600; // fade-back-up time when VO stops

const WIDTH = 1920;
const HEIGHT = 1080;
const FPS = 30;
const TRANSITION_DURATION = 0.5; // crossfade length between every top-level segment

// ---------------------------------------------------------------------------
// ffmpeg helpers
// ---------------------------------------------------------------------------
/** Decodes the file and reads the last "time=" ffmpeg prints -- the actual
 *  playable length, rather than trusting container metadata (unreliable for
 *  some ffmpeg-written files, "N/A" for others). */
async function realDuration(file) {
    // ffmpeg exits 0 here even when it logs "File ended prematurely" -- the
    // decode still completes over whatever frames exist.
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

/** Renders a slice of a b-roll take, trimmed/padded to exactly `duration`
 *  seconds, normalized to WIDTHxHEIGHT@FPS, video-only. Pads with a frozen
 *  last frame (tpad) if the slice runs out before `duration`. */
async function renderClip(sourceFile, ss, available, duration, outPath) {
    const shortfall = duration - available;
    const vf = shortfall > 0.05
        ? `${SCALE_PAD},tpad=stop_mode=clone:stop_duration=${shortfall.toFixed(3)}`
        : SCALE_PAD;
    await run([
        '-ss', String(Math.max(ss, 0)),
        '-i', sourceFile,
        '-t', String(Math.max(duration, 0.1)),
        '-vf', vf,
        '-an',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'veryfast', '-crf', '20',
        outPath,
    ]);
}

// drawtext needs an explicit fontfile on this ffmpeg build -- it has no
// fontconfig.conf, so the default fontconfig-based lookup errors out.
const CARD_FONT = process.env.TITLE_CARD_FONT || 'C:/Windows/Fonts/segoeui.ttf';

// Bounding box of the right-hand Story Elements panel (icon rail + content)
// in the final WIDTHxHEIGHT (1920x1080) frame -- measured from a real
// capture: the app's actual viewport is 3072x1728 CSS px (DPR 1.25 on a 4K
// display), SCALE_PAD downscales that to 1920x1080 (a 0.625 ratio), and the
// panel's boundingBox() in that CSS space was {x:2607.8, y:64, w:464.2,
// h:1664} -> scaled: {x:1630, y:40, w:290, h:1040}. Rounded here with a
// small margin. Re-measure if the app's layout changes.
const PANEL_FOCUS = { x: 1620, y: 35, w: 300, h: 1045 };

// Accent color for the panel-focus outline -- matches the app's own indigo
// accent (e.g. ChoiceCanvas's "text-indigo-800 dark:text-indigo-200"),
// so the highlight reads as part of the UI rather than an edit overlay.
const PANEL_FOCUS_COLOR = '0x6366F1';

/** Renders a slice of the master b-roll take like renderClip, but draws an
 *  outline around the Story Elements panel and burns in a bottom-left label
 *  -- used for the feature-montage tour of sidebar tabs so it's unambiguous
 *  what's being highlighted. An earlier version dimmed/desaturated
 *  everything outside the panel to spotlight it, but that hid the canvas and
 *  code panels the montage is also meant to show reacting to each tab's
 *  interaction (see capture_broll.js's montage clip setups) -- an outline
 *  points at the same panel without hiding anything else in the frame. */
async function renderClipWithFocus(sourceFile, ss, available, duration, outPath, label) {
    const shortfall = duration - available;
    const padFilter = shortfall > 0.05 ? `,tpad=stop_mode=clone:stop_duration=${shortfall.toFixed(3)}` : '';
    const { x, y, w, h } = PANEL_FOCUS;
    const filterComplex =
        `[0:v]${SCALE_PAD}${padFilter}[scaled];` +
        `[scaled]drawbox=x=${x}:y=${y}:w=${w}:h=${h}:color=${PANEL_FOCUS_COLOR}:t=5[boxed];` +
        `[boxed]drawtext=fontfile='${CARD_FONT.replace(/:/g, '\\:')}':text='${label}':fontcolor=white:fontsize=42:x=40:y=h-text_h-40:box=1:boxcolor=black@0.5:boxborderw=12[out]`;
    await run([
        '-ss', String(Math.max(ss, 0)),
        '-i', sourceFile,
        '-t', String(Math.max(duration, 0.1)),
        '-filter_complex', filterComplex,
        '-map', '[out]',
        '-an',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'veryfast', '-crf', '20',
        outPath,
    ]);
}

/** Renders a solid-color card with centered text -- used for the intro,
 *  "For Writers/Artists/Developers" dividers, and the outro. */
async function renderCard(text, duration, outPath, fontSize = 64) {
    await run([
        '-f', 'lavfi',
        '-i', `color=c=0x111318:s=${WIDTH}x${HEIGHT}:d=${duration}:r=${FPS}`,
        // ffmpeg's filter-option parser treats ':' as a delimiter, which
        // collides with a Windows drive letter (C:/...) -- escape it.
        '-vf', `drawtext=fontfile='${CARD_FONT.replace(/:/g, '\\:')}':text='${text}':fontcolor=white:fontsize=${fontSize}:x=(w-text_w)/2:y=(h-text_h)/2`,
        '-an',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'veryfast', '-crf', '20',
        outPath,
    ]);
}

/** Concatenates already-rendered same-format clips via the concat demuxer --
 *  used for hard cuts between sub-clips *within* one top-level segment (e.g.
 *  the three canvas-tour clips). Top-level segments are crossfaded instead;
 *  see concatWithCrossfade. */
async function concat(files, outPath) {
    if (files.length === 1) {
        await fs.copyFile(files[0], outPath);
        return;
    }
    const listPath = `${outPath}.txt`;
    const listContent = files.map(f => `file '${f.replace(/'/g, "'\\''")}'`).join('\n');
    await fs.writeFile(listPath, listContent);
    await run(['-f', 'concat', '-safe', '0', '-i', listPath, '-c', 'copy', outPath]);
    await fs.rm(listPath).catch(() => {});
}

/** Chains top-level segments together with a short crossfade dissolve at
 *  each cut (xfade) instead of a hard cut, per the "transitions between
 *  features" requirement. Returns the merged output's total duration and the
 *  (overlap-adjusted) start time of each input segment on the merged
 *  timeline, so the audio track can be placed to match. */
async function concatWithCrossfade(segmentPaths, durations, transitionDuration, outPath) {
    const startTimes = [0];
    for (let i = 1; i < durations.length; i++) {
        startTimes.push(startTimes[i - 1] + durations[i - 1] - transitionDuration);
    }
    const totalDuration = startTimes[startTimes.length - 1] + durations[durations.length - 1];

    if (segmentPaths.length === 1) {
        await fs.copyFile(segmentPaths[0], outPath);
        return { totalDuration, startTimes };
    }

    const inputs = segmentPaths.flatMap(p => ['-i', p]);
    const filterParts = [];
    let prevLabel = '0:v';
    let cumulative = durations[0];
    for (let i = 1; i < segmentPaths.length; i++) {
        const offset = cumulative - transitionDuration;
        const outLabel = i === segmentPaths.length - 1 ? 'vout' : `v${i}`;
        filterParts.push(`[${prevLabel}][${i}:v]xfade=transition=fade:duration=${transitionDuration}:offset=${offset.toFixed(3)}[${outLabel}]`);
        prevLabel = outLabel;
        cumulative += durations[i] - transitionDuration;
    }
    await run([
        ...inputs,
        '-filter_complex', filterParts.join(';'),
        '-map', '[vout]',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'veryfast', '-crf', '20',
        outPath,
    ]);
    return { totalDuration, startTimes };
}

// ---------------------------------------------------------------------------
// Timeline -- one entry per top-level segment in playback order. `broll`
// segments pull from MASTER_VIDEO via the (scale-corrected) manifest offsets
// for their clipIds; `card` segments are rendered text-on-black. Each
// segment can carry zero or more VO placements, positioned at an offset
// *within* the segment (most have one at offset 0; the intro card holds two
// lines back to back).
// ---------------------------------------------------------------------------
function buildTimeline(vo) {
    return [
        {
            id: 'intro-card',
            kind: 'card',
            text: 'Vangard Studio',
            duration: 3 + vo({ pos: '01', id: 'hook' }).duration + vo({ pos: '02', id: 'product-intro' }).duration,
            audio: [
                { line: vo({ pos: '01', id: 'hook' }), offset: 3 },
                { line: vo({ pos: '02', id: 'product-intro' }), offset: 3 + vo({ pos: '01', id: 'hook' }).duration },
            ],
        },
        {
            id: 'canvas-tour',
            kind: 'broll',
            clipIds: ['01-canvas-tour-project', '02-canvas-tour-flow', '03-canvas-tour-choices'],
            duration: vo({ pos: '03', id: 'canvas-tour' }).duration,
            audio: [{ line: vo({ pos: '03', id: 'canvas-tour' }), offset: 0 }],
        },
        {
            id: 'diagnostics',
            kind: 'broll',
            clipIds: ['04-diagnostics'],
            duration: vo({ pos: '04', id: 'diagnostics' }).duration,
            audio: [{ line: vo({ pos: '04', id: 'diagnostics' }), offset: 0 }],
        },
        {
            id: 'editor',
            kind: 'broll',
            clipIds: ['05-editor-autocomplete'],
            duration: vo({ pos: '05', id: 'editor' }).duration,
            audio: [{ line: vo({ pos: '05', id: 'editor' }), offset: 0 }],
        },
        {
            id: 'scene-composer',
            kind: 'broll',
            clipIds: ['06-scene-composer'],
            duration: vo({ pos: '06', id: 'scene-composer' }).duration,
            audio: [{ line: vo({ pos: '06', id: 'scene-composer' }), offset: 0 }],
        },
        {
            id: 'warp-to-label',
            kind: 'broll',
            clipIds: ['07-warp-to-label'],
            duration: vo({ pos: '07', id: 'warp-to-label' }).duration,
            audio: [{ line: vo({ pos: '07', id: 'warp-to-label' }), offset: 0 }],
        },
        {
            id: 'still-renpy',
            kind: 'broll',
            clipIds: ['08-real-renpy-file'],
            duration: vo({ pos: '08', id: 'still-renpy' }).duration,
            audio: [{ line: vo({ pos: '08', id: 'still-renpy' }), offset: 0 }],
        },
        {
            id: 'divider-writers',
            kind: 'card',
            text: 'For Writers',
            duration: 2.5,
            audio: [],
        },
        {
            id: 'writers',
            kind: 'broll',
            clipIds: ['09-writers-character-manager', '10-writers-variables'],
            duration: vo({ pos: '09', id: 'writers' }).duration,
            audio: [{ line: vo({ pos: '09', id: 'writers' }), offset: 0 }],
        },
        {
            id: 'divider-artists',
            kind: 'card',
            text: 'For Artists',
            duration: 2.5,
            audio: [],
        },
        {
            id: 'artists',
            kind: 'broll',
            clipIds: ['11-artists-image-maps', '12-artists-audio-editor'],
            duration: vo({ pos: '10', id: 'artists' }).duration,
            audio: [{ line: vo({ pos: '10', id: 'artists' }), offset: 0 }],
        },
        {
            id: 'divider-developers',
            kind: 'card',
            text: 'For Developers',
            duration: 2.5,
            audio: [],
        },
        {
            id: 'developers',
            kind: 'broll',
            clipIds: ['13-developers-statistics', '14-developers-search'],
            duration: vo({ pos: '11', id: 'developers' }).duration,
            audio: [{ line: vo({ pos: '11', id: 'developers' }), offset: 0 }],
        },
        {
            id: 'localization',
            kind: 'broll',
            clipIds: ['15-localization'],
            duration: vo({ pos: '12', id: 'localization' }).duration,
            audio: [{ line: vo({ pos: '12', id: 'localization' }), offset: 0 }],
        },
        // Silent feature montage -- reserved for a music swell per the script;
        // stays silent here since no track has been licensed yet. Sweeps the
        // Story Elements tabs not already given a dedicated narrated beat
        // (Characters/Variables/Image Maps/Audio covered earlier). `labels`
        // (parallel to clipIds) triggers the panel-focus vignette + burned-in
        // tab name per sub-clip -- see renderClipWithFocus.
        {
            id: 'montage-silent',
            kind: 'broll',
            clipIds: [
                '16-montage-screens',
                '17-montage-images',
                '18-montage-scene-compositions',
                '19-montage-snippets',
                '20-montage-menu-templates',
                '21-montage-color-palette',
                '22-montage-drafting-mode',
            ],
            // null = no panel-focus treatment (Drafting Mode is a toolbar/
            // canvas toggle, not a Story Elements panel tab -- the sidebar
            // vignette would spotlight the wrong part of the frame for it).
            labels: [
                'Screens',
                'Images',
                'Scene Compositions',
                'Code Snippets',
                'Menu Templates',
                'Color Palette',
                null,
            ],
            duration: 19,
            audio: [],
        },
        {
            id: 'outro-card',
            kind: 'card',
            text: 'Vangard Studio — Free on Itch.io',
            duration: vo({ pos: '13', id: 'outro' }).duration + 2,
            audio: [{ line: vo({ pos: '13', id: 'outro' }), offset: 0 }],
        },
    ];
}

async function main() {
    if (!existsSync(BROLL_DIR) || !existsSync(VO_DIR)) {
        console.error('Missing docs/marketing/broll/ or docs/marketing/vo/ -- run capture-broll and generate-vo first.');
        process.exit(1);
    }

    const manifest = JSON.parse(await fs.readFile(path.join(BROLL_DIR, 'manifest.json'), 'utf8'));
    const timingRaw = JSON.parse(await fs.readFile(path.join(VO_DIR, 'timing-summary.json'), 'utf8'));
    // ref is { pos, id } -- buildTimeline() passes both for every line, and
    // this picks whichever one VO_MATCH_MODE says to trust.
    const vo = (ref) => {
        const entry = VO_MATCH_MODE === 'content'
            ? timingRaw.find(t => t.id === ref.id)
            : timingRaw[Number(ref.pos) - 1];
        if (!entry?.filename) {
            const key = VO_MATCH_MODE === 'content' ? `id "${ref.id}"` : `position ${ref.pos}`;
            const hint = VO_MATCH_MODE === 'content'
                ? ' -- check the script\'s ID column has this row tagged'
                : '';
            throw new Error(`No timing entry for VO line at ${key}${hint} -- rerun generate_vo.js`);
        }
        return { file: path.join(VO_DIR, entry.filename), duration: entry.durationSeconds, text: entry.text };
    };

    // capture_broll.js records each clip's start/end as wall-clock seconds
    // since the shared take's capture began. gdigrab is a real-time OS-level
    // capture (unlike Playwright's recordVideo -- see capture_broll.js's
    // header comment), so these timestamps are trustworthy without the
    // multi-second correction the old Playwright-based design needed. What's
    // left to correct is much smaller: gdigrab's own startup latency before
    // frames actually start landing in the file, which offsets every
    // timestamp by a roughly constant sub-second amount. Correct per source
    // file with a scale factor (real decoded duration / latest wall-clock
    // timestamp among manifest entries pointing at it) rather than a fixed
    // subtraction, since that also self-corrects for the file's own
    // finalization padding.
    const filesUsed = [...new Set(Object.values(manifest).map(m => m.file))];
    console.log(`Measuring real duration of ${filesUsed.length} source file(s) for offset correction...`);
    const scaleFactors = {};
    for (const file of filesUsed) {
        const filePath = path.join(BROLL_DIR, file);
        if (!existsSync(filePath)) throw new Error(`Manifest references ${file}, but it doesn't exist in ${BROLL_DIR} -- rerun capture_broll.js`);
        const real = await realDuration(filePath);
        const wallClockTotal = Math.max(
            ...Object.values(manifest).filter(m => m.file === file).map(m => m.end)
        );
        scaleFactors[file] = real / wallClockTotal;
        console.log(`  ${file}: real ${real.toFixed(2)}s, wall-clock total ${wallClockTotal.toFixed(2)}s, scale factor ${scaleFactors[file].toFixed(3)}`);
    }
    console.log('');

    const clipWindow = (clipId) => {
        const entry = manifest[clipId];
        if (!entry) throw new Error(`No manifest entry for clip "${clipId}" -- rerun capture_broll.js`);
        const scaleFactor = scaleFactors[entry.file];
        return { file: path.join(BROLL_DIR, entry.file), start: entry.start * scaleFactor, end: entry.end * scaleFactor };
    };

    await fs.mkdir(WORK_DIR, { recursive: true });
    const timeline = buildTimeline(vo);

    console.log(`Rendering ${timeline.length} top-level segment(s) to ${WORK_DIR}\n`);

    const segmentPaths = [];
    const segmentDurations = [];

    for (const segment of timeline) {
        process.stdout.write(`  [${segment.id.padEnd(20)}] target ${segment.duration.toFixed(2)}s `);
        const segmentVideoPath = path.join(WORK_DIR, `${segment.id}.mp4`);

        if (segment.kind === 'card') {
            await renderCard(segment.text, segment.duration, segmentVideoPath);
        } else {
            const share = segment.duration / segment.clipIds.length;
            const subPaths = [];
            for (let i = 0; i < segment.clipIds.length; i++) {
                const { file, start, end } = clipWindow(segment.clipIds[i]);
                const available = Math.max(end - start, 0);
                const subPath = path.join(WORK_DIR, `${segment.id}-${i}.mp4`);
                const label = segment.labels?.[i];
                if (label) {
                    await renderClipWithFocus(file, start, available, share, subPath, label);
                } else {
                    await renderClip(file, start, available, share, subPath);
                }
                subPaths.push(subPath);
            }
            await concat(subPaths, segmentVideoPath);
        }

        segmentPaths.push(segmentVideoPath);
        segmentDurations.push(segment.duration);
        console.log('ok');
    }

    // --- Crossfade the picture-locked video track ---
    console.log('\nCrossfading video track...');
    const videoTrackPath = path.join(OUT_DIR, 'video-track.mp4');
    const { totalDuration, startTimes } = await concatWithCrossfade(segmentPaths, segmentDurations, TRANSITION_DURATION, videoTrackPath);
    console.log(`Total draft duration: ${totalDuration.toFixed(2)}s`);

    // --- Build the audio track: silence base + each VO line delayed to its
    //     segment's (overlap-adjusted) start time, mixed together, plus an
    //     optional background music bed ducked under VO. ---
    console.log('Building audio track...');
    const audioPlacements = timeline.flatMap((segment, i) =>
        segment.audio.map(a => ({ file: a.line.file, startSeconds: startTimes[i] + a.offset, duration: a.line.duration }))
    );
    const audioTrackPath = path.join(OUT_DIR, 'audio-track.m4a');
    const ffArgs = ['-f', 'lavfi', '-i', `anullsrc=r=44100:cl=stereo:d=${totalDuration}`];
    for (const p of audioPlacements) ffArgs.push('-i', p.file);
    const delayed = audioPlacements.map((p, i) =>
        `[${i + 1}]adelay=${Math.round(p.startSeconds * 1000)}|${Math.round(p.startSeconds * 1000)}[a${i}]`
    );

    let musicInputIndex = null;
    if (MUSIC_TRACK) {
        if (!existsSync(MUSIC_TRACK)) {
            console.warn(`  Music track not found at ${MUSIC_TRACK} -- continuing without music.`);
        } else {
            musicInputIndex = audioPlacements.length + 1;
            ffArgs.push('-stream_loop', '-1', '-i', MUSIC_TRACK);
        }
    }

    // voMix = silence base + every VO line at its placement (no music yet).
    const voMixLabels = ['[0]', ...audioPlacements.map((_, i) => `[a${i}]`)];
    const voMixFilter = `${voMixLabels.join('')}amix=inputs=${voMixLabels.length}:duration=first:dropout_transition=0:normalize=0[voMix]`;

    let filterComplex;
    if (musicInputIndex !== null) {
        // voMix feeds two independent downstream consumers (the sidechain
        // trigger and the final mix) -- ffmpeg doesn't fan out a labeled
        // stream to multiple filters implicitly, it needs an explicit split,
        // otherwise only one consumer actually receives it (silently; no
        // ffmpeg error) and the other effectively gets nothing.
        const split = `[voMix]asplit=2[voMixOut][voMixTrigger]`;
        // Music at a flat base volume, faded in/out at the very ends; ducked
        // against voMixTrigger as the sidechain signal so it fades down
        // smoothly whenever VO is present and back up (the "swell") when it
        // isn't, reacting to the real VO envelope instead of fixed windows.
        const musicPrep = `[${musicInputIndex}]atrim=0:${totalDuration},asetpts=PTS-STARTPTS,volume=${MUSIC_BASE_VOLUME},afade=t=in:st=0:d=1.5,afade=t=out:st=${Math.max(totalDuration - 2, 0)}:d=2[musicPrep]`;
        const duck = `[musicPrep][voMixTrigger]sidechaincompress=threshold=${DUCK_THRESHOLD}:ratio=${DUCK_RATIO}:attack=${DUCK_ATTACK_MS}:release=${DUCK_RELEASE_MS}:makeup=1[duckedMusic]`;
        filterComplex = `${delayed.join(';')}${delayed.length ? ';' : ''}${voMixFilter};${split};${musicPrep};${duck};[voMixOut][duckedMusic]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[aout]`;
    } else {
        filterComplex = `${delayed.join(';')}${delayed.length ? ';' : ''}${voMixFilter.replace('[voMix]', '[aout]')}`;
    }
    ffArgs.push('-filter_complex', filterComplex, '-map', '[aout]', '-t', String(totalDuration), audioTrackPath);
    await run(ffArgs);

    // --- Mux ---
    console.log('Muxing final draft...');
    const finalPath = path.join(OUT_DIR, 'sizzle-reel-draft.mp4');
    await run(['-i', videoTrackPath, '-i', audioTrackPath, '-c:v', 'copy', '-c:a', 'aac', '-shortest', finalPath]);

    console.log(`\nDraft cut written to: ${finalPath}`);
    console.log(musicInputIndex !== null
        ? 'Reminder: the intro/divider/outro cards are still placeholders -- needs the video editor pass noted in the sizzle reel issue.'
        : 'Reminder: no music track configured (--music or MUSIC_TRACK), and the intro/divider/outro cards are placeholders -- both need the video editor pass noted in the sizzle reel issue.');
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
