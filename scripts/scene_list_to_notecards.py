#!/usr/bin/env python3
"""
Parse a "Master Scene List" markdown file (scenes numbered Season.Episode.Scene[.letter],
e.g. "1.1.1", "1.2.26.a", "2.5.1") and generate one Vangard Studio notecard per scene,
colored by season, laid out in one column per season.

Usage:
    python3 scripts/scene_list_to_notecards.py MasterSceneListv3.md
        Parse only; print a summary (no files touched).

    python3 scripts/scene_list_to_notecards.py MasterSceneListv3.md --project-dir /path/to/project
        Parse and merge the result into <project-dir>/game/project.ide.json.

    python3 scripts/scene_list_to_notecards.py MasterSceneListv3.md --project-dir /path/to/project --dry-run
        Same as above but only prints what would change; does not write.

Merge behavior (safe to re-run):
    - Notecards this script previously created are identified by a stable id
      derived from the scene number (`notecard-scene-<id-with-dashes>`).
    - Re-running updates title/content/color for existing scene cards but keeps
      their current position/width/height (so manual drag/resize survives).
    - New scenes get a freshly laid-out card; scenes removed from the source
      file cause their card to be removed.
    - Any notecard NOT created by this script (manually added in the app) is
      left untouched.
    - The target project.ide.json must already exist (open the project once in
      Vangard Studio to create it). A timestamped .bak copy is written next to
      it before every overwrite.

Season -> color: NoteColor only has 6 values, so with 7 seasons, season 7
reuses season 1's color (yellow) since Vangard Studio has no other option.
"""

import argparse
import json
import re
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

CARD_WIDTH = 220
CARD_HEIGHT = 160
GUTTER = 40
START_X = 40
START_Y = 40

SEASON_COLORS = ['yellow', 'blue', 'green', 'pink', 'purple', 'red']
GENERATED_ID_PREFIX = 'notecard-scene-'

SCENE_RE = re.compile(
    r'^\*\s+\*Scene\s+(?P<id>\d+(?:\.\d+)*(?:\.[a-z])?)\s*'
    r'(?:\((?P<type>[^)]*)\))?\s*:\s*"(?P<title>[^"]*)"\.?\*\s*(?P<rest>.*)$'
)
HEADER_RE = re.compile(r'^(?:\*\s+)?\*\*.*\*\*$')
HR_RE = re.compile(r'^-{3,}$')
BRACKET_LINE_RE = re.compile(r'^\[.*\]$')


class Scene:
    def __init__(self, scene_id, scene_type, title, rest):
        self.id = scene_id
        self.type = scene_type
        self.title = title
        self.content_lines = [rest] if rest else []

    def season(self):
        return int(self.id.split('.')[0])

    def notecard_id(self):
        return GENERATED_ID_PREFIX + self.id.replace('.', '-')

    def notecard_title(self):
        return f"{self.id}: {self.title}"

    def notecard_content(self):
        parts = []
        if self.type:
            parts.append(f"**{self.type}**")
        parts.extend(p for p in self.content_lines if p)
        return "\n\n".join(parts)


def parse_scene_list(text):
    scenes = []
    current = None
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if line.startswith('#') or HR_RE.match(line) or BRACKET_LINE_RE.match(line):
            current = None
            continue

        m = SCENE_RE.match(line)
        if m:
            current = Scene(m.group('id'), m.group('type'), m.group('title'), m.group('rest').strip())
            scenes.append(current)
            continue

        if HEADER_RE.match(line):
            current = None
            continue

        if current is not None:
            current.content_lines.append(line)

    return scenes


def assign_colors(scenes):
    colors = {}
    for scene in scenes:
        season = scene.season()
        if season not in colors:
            colors[season] = SEASON_COLORS[(season - 1) % len(SEASON_COLORS)]
    return colors


def build_notecards(scenes, existing_by_id):
    colors = assign_colors(scenes)
    seasons_seen = {}
    notecards = []
    for scene in scenes:
        season = scene.season()
        order = seasons_seen.get(season, 0)
        seasons_seen[season] = order + 1

        nc_id = scene.notecard_id()
        existing = existing_by_id.get(nc_id)
        if existing:
            position = existing.get('position', {'x': START_X, 'y': START_Y})
            width = existing.get('width', CARD_WIDTH)
            height = existing.get('height', CARD_HEIGHT)
        else:
            position = {
                'x': START_X + (season - 1) * (CARD_WIDTH + GUTTER),
                'y': START_Y + order * (CARD_HEIGHT + GUTTER),
            }
            width = CARD_WIDTH
            height = CARD_HEIGHT

        notecards.append({
            'id': nc_id,
            'title': scene.notecard_title(),
            'content': scene.notecard_content(),
            'position': position,
            'width': width,
            'height': height,
            'color': colors[season],
        })
    return notecards


def merge_into_settings(settings, generated_notecards):
    existing_notecards = settings.get('notecards', [])
    manual = [nc for nc in existing_notecards if not nc.get('id', '').startswith(GENERATED_ID_PREFIX)]
    previously_generated_ids = {nc['id'] for nc in existing_notecards if nc.get('id', '').startswith(GENERATED_ID_PREFIX)}
    new_generated_ids = {nc['id'] for nc in generated_notecards}

    added = new_generated_ids - previously_generated_ids
    removed = previously_generated_ids - new_generated_ids
    updated = new_generated_ids & previously_generated_ids

    settings['notecards'] = manual + generated_notecards
    return {'added': len(added), 'removed': len(removed), 'updated': len(updated), 'manual_kept': len(manual)}


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('scene_list', type=Path, help='Path to the Master Scene List markdown file')
    parser.add_argument('--project-dir', type=Path, help='Vangard Studio project root (containing game/project.ide.json)')
    parser.add_argument('--dry-run', action='store_true', help="Don't write; just report what would change")
    args = parser.parse_args()

    text = args.scene_list.read_text(encoding='utf-8')
    scenes = parse_scene_list(text)
    if not scenes:
        print('No scenes found — check the file matches the expected "*   *Scene X.Y.Z (Type): \"Title.\"*" format.', file=sys.stderr)
        sys.exit(1)

    seasons = sorted({scene.season() for scene in scenes})
    print(f"Parsed {len(scenes)} scenes across {len(seasons)} season(s): {seasons}")
    colors = assign_colors(scenes)
    for season in seasons:
        count = sum(1 for s in scenes if s.season() == season)
        print(f"  Season {season}: {count} scene(s) -> {colors[season]}")
    reused = [c for c in SEASON_COLORS if list(colors.values()).count(c) > 1]
    if reused:
        print(f"Note: only {len(SEASON_COLORS)} notecard colors exist, so these are shared across seasons: {sorted(set(reused))}")

    if not args.project_dir:
        print("\nNo --project-dir given: parse-only, nothing written.")
        return

    settings_path = args.project_dir / 'game' / 'project.ide.json'
    if not settings_path.exists():
        print(f"\n{settings_path} does not exist. Open this project once in Vangard Studio to create it, then re-run.", file=sys.stderr)
        sys.exit(1)

    settings = json.loads(settings_path.read_text(encoding='utf-8'))
    existing_by_id = {nc['id']: nc for nc in settings.get('notecards', [])}
    generated_notecards = build_notecards(scenes, existing_by_id)
    stats = merge_into_settings(settings, generated_notecards)

    print(f"\n{settings_path}:")
    print(f"  {stats['added']} card(s) added, {stats['updated']} updated, {stats['removed']} removed, {stats['manual_kept']} manual card(s) untouched.")

    if args.dry_run:
        print("Dry run: not written.")
        return

    backup_path = settings_path.with_suffix(settings_path.suffix + f".bak-{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}")
    shutil.copy2(settings_path, backup_path)
    settings_path.write_text(json.dumps(settings, indent=2), encoding='utf-8')
    print(f"Backup written to {backup_path}")
    print(f"Wrote {settings_path}")


if __name__ == '__main__':
    main()
