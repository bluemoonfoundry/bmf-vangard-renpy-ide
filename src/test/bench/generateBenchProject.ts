/**
 * @file generateBenchProject.ts
 * @description Seeded generator of realistic Ren'Py projects for the analysis
 * benchmarks. Output is byte-identical for the same preset and seed. By
 * default it avoids constructs the tree-sitter grammar still mis-parses
 * (see AVOIDED_CONSTRUCTS) so every file parses without errors; `fullIdioms`
 * adds them back.
 */

export type BenchPreset = 'medium' | 'large';

export const BENCH_PRESETS: Record<BenchPreset, { files: number; targetLines: number }> = {
  medium: { files: 50, targetLines: 20_000 },
  large: { files: 300, targetLines: 150_000 },
};

export const DEFAULT_BENCH_SEED = 43;

export interface BenchFile { filePath: string; content: string }
export interface BenchOptions { preset: BenchPreset; seed?: number; fullIdioms?: boolean }

/** Constructs left out of the default output, one per known grammar bug. */
export const AVOIDED_CONSTRUCTS: readonly { issue: string; construct: string }[] = [
  { issue: '3nk7', construct: 'blank line at the start of a file' },
  { issue: 'rsxn', construct: 'comment as the first line of a block body' },
  { issue: 'lssz', construct: 'quoted string containing "#" in define/default/image/$ values, e.g. color="#fff"' },
  { issue: 'aj2e', construct: 'function call in an `at` clause, e.g. at Transform(...)' },
  { issue: 'q85r', construct: '[var] interpolation inside screen-language strings' },
  { issue: 'nms4.14', construct: 'more than one property on a screen line / spaced expressions in screen properties' },
  { issue: 'nms4.15', construct: 'docstrings, `with ... as` and decorators in python blocks' },
];

/** Small seeded PRNG (mulberry32). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SPEAKERS = ['e', 'b', 'c', 'n'];
const ATTRS = ['happy', 'sad', 'angry', 'smile'];
const VARS = ['trust', 'gold', 'courage', 'clues'];
const NAMES = ['name', 'town', 'rival'];
const WORDS = ['the', 'river', 'lantern', 'quiet', 'window', 'story', 'morning', 'bridge', 'garden', 'letter', 'silver', 'echo'];
const IMAGES = ['bg town', 'bg forest', 'bg room', 'eileen happy', 'eileen sad', 'bob smile'];
const TRANSITIONS = ['dissolve', 'fade', 'moveinleft'];
const SHARED_EVERY = 10;
const LINES_PER_LABEL = 26;

class Rng {
  private next: () => number;
  constructor(seed: number) { this.next = mulberry32(seed); }
  int(n: number): number { return Math.floor(this.next() * n); }
  pick<T>(xs: readonly T[]): T { return xs[this.int(xs.length)]; }
  chance(p: number): boolean { return this.next() < p; }
  sentence(): string {
    const n = 4 + this.int(7);
    return Array.from({ length: n }, () => this.pick(WORDS)).join(' ');
  }
}

const isShared = (i: number) => i % SHARED_EVERY === 0;
const storyLabels = (i: number, count: number) => Array.from({ length: count }, (_, j) => `s${i}_l${j}`);

function sharedFile(i: number, budget: number, rng: Rng, full: boolean): string {
  const out: string[] = [];
  if (full) out.push('');
  out.push(`define e${i} = Character("Eileen ${i}", color="${full ? '#c8ffc8' : 'green'}")`);
  for (const s of SPEAKERS) out.push(`define ${s}_${i} = Character("Speaker ${s}")`);
  let n = 0;
  while (out.length < budget) {
    n++;
    const tag = `${i}_${n}`;
    switch (rng.int(5)) {
      case 0:
        out.push(`default ${rng.pick(VARS)}_${tag} = ${rng.int(10)}`, `default flag_${tag} = False`, '');
        break;
      case 1:
        out.push('init python:',
          `    def helper_${tag}(value, limit=${rng.int(50)}):`,
          ...(full ? ['        """Clamp a value."""'] : []),
          '        if value > limit:', '            return limit', '        return value + 1', '',
          `    store_${tag} = [helper_${tag}(k) for k in range(${2 + rng.int(5)})]`, '');
        if (full) out.push('init python:', '    with open("log.txt") as fh:', `        data_${tag} = fh.read()`, '');
        break;
      case 2:
        out.push(`transform move_${tag}:`, '    xalign 0.0', '    linear 1.0 xalign 1.0', '    pause 0.5',
          `    easein ${(0.5 + rng.int(3)).toFixed(1)} yalign 0.5`, '');
        break;
      case 3:
        out.push(`screen panel_${tag}(title, items):`, '    vbox:', '        xalign 0.5',
          full ? '        text "Total [title]"' : '        text title', '        for item in items:',
          '            textbutton item:', '                action Return(item)',
          ...(full ? ['            textbutton "x" action Return(1) xalign 0.5'] : []), '');
        out.push(`screen hub_${tag}():`, '    frame:', '        vbox:', `            use panel_${tag}("Hub", ["a", "b"])`,
          '            textbutton "Back":', '                action Return()', '');
        break;
      default:
        out.push(`translate french s${i}_l0_${(rng.int(0xffffff) + 0x1000000).toString(16)}:`, '',
          `    e "${rng.sentence()}."`, '');
        break;
    }
  }
  return out.join('\n') + '\n';
}

function storyFile(i: number, budget: number, rng: Rng, full: boolean, labelCounts: number[]): string {
  const count = labelCounts[i];
  const names = storyLabels(i, count);
  // Each label also gets ~6 trailing lines and the last statement overshoots by ~3.
  const perLabel = Math.max(8, Math.floor(budget / count) - 9);
  const out: string[] = [];
  if (full) out.push('');

  // Jump/call target: 40% a label in another story file, otherwise a sibling.
  const target = (j: number): string => {
    if (rng.chance(0.4)) {
      let k = rng.int(labelCounts.length);
      if (isShared(k)) k = (k + 1) % labelCounts.length;
      return storyLabels(k, labelCounts[k])[rng.int(labelCounts[k])];
    }
    return names[(j + 1 + rng.int(count - 1)) % count];
  };

  names.forEach((name, j) => {
    const start = out.length;
    const local = `.alt${j}`;
    out.push(`label ${name}:`);
    if (full) out.push('    # opening comment');
    out.push(`    scene ${rng.pick(IMAGES)}`, `    with ${rng.pick(TRANSITIONS)}`);
    while (out.length - start < perLabel) {
      switch (rng.int(8)) {
        case 0: case 1: case 2:
          out.push(`    ${rng.pick(SPEAKERS)}${rng.chance(0.4) ? ' ' + rng.pick(ATTRS) : ''} "${rng.sentence()}${rng.chance(0.3) ? ' [' + rng.pick(NAMES) + ']' : ''}."`);
          break;
        case 3: {
          const v = rng.pick(VARS);
          out.push('    menu:', `        "${rng.sentence()}":`, `            $ ${v} += 1`, `            ${rng.pick(SPEAKERS)} "${rng.sentence()}."`,
            `        "${rng.sentence()}" if ${v} > ${rng.int(5)}:`, `            jump ${target(j)}`,
            `        "${rng.sentence()}":`, `            call ${target(j)}`);
          break;
        }
        case 4: {
          const v = rng.pick(VARS);
          out.push(`    if ${v} > ${rng.int(8)}:`, `        ${rng.pick(SPEAKERS)} "${rng.sentence()}."`, `    elif ${v} == ${rng.int(8)}:`,
            `        $ ${v} = ${v} - 1`, '    else:', `        ${rng.pick(SPEAKERS)} "${rng.sentence()}."`);
          break;
        }
        case 5:
          out.push(`    show ${rng.pick(IMAGES)}${rng.chance(0.4) ? ' at ' + (full ? 'Transform(zoom=1.5)' : 'left') : ''}`, `    with ${rng.pick(TRANSITIONS)}`);
          break;
        case 6:
          out.push(`    $ ${rng.pick(VARS)} = ${rng.int(100)}`, `    $ renpy.notify("${rng.sentence()}")`);
          break;
        default:
          out.push(`    call ${target(j)}`);
          break;
      }
    }
    out.push(`    jump ${local}`, '');
    out.push(`label ${local}:`, `    ${rng.pick(SPEAKERS)} "${rng.sentence()}."`,
      j + 1 < count ? `    jump ${names[j + 1]}` : '    return', '');
    if (full) out.push(`screen note_${i}_${j}():`, '    text "Hello [name]"', '');
  });
  if (full) out.push(`define col_${i} = "#abc"`);
  return out.join('\n') + '\n';
}

export function generateBenchProject(options: BenchOptions): BenchFile[] {
  const { preset, seed = DEFAULT_BENCH_SEED, fullIdioms = false } = options;
  const { files, targetLines } = BENCH_PRESETS[preset];
  const rng = new Rng(seed);
  const perFile = Math.round(targetLines / files);
  // Label counts are fixed up front so any file can target another file's labels.
  const labelCounts = Array.from({ length: files }, () => Math.max(2, Math.round(perFile / LINES_PER_LABEL)));
  const result: BenchFile[] = [];
  for (let i = 0; i < files; i++) {
    const budget = Math.round(perFile * (0.9 + rng.int(21) / 100));
    const filePath = `game/bench_${String(i).padStart(3, '0')}.rpy`;
    const content = isShared(i) ? sharedFile(i, budget, rng, fullIdioms) : storyFile(i, budget, rng, fullIdioms, labelCounts);
    result.push({ filePath, content });
  }
  return result;
}
