# Implementation Plan: ATL Preset Library (Option 3) & Timeline Editor (Option 4)

## Context

GitHub issue #38 proposes four approaches for ATL animation support in Vangard Studio. This plan implements **Option 3** (parameterized ATL presets) and **Option 4** (visual timeline editor), building on the app's existing one-way code generation philosophy.

**Why these two options:**
- Current Scene Composer generates static show/scene statements — no animation support exists
- No ATL parser anywhere in codebase (Monaco has syntax highlighting only)
- Snippet infrastructure is mature and proven (search, CRUD, import/export)
- Audio scrubber pattern already exists as reference
- Issue discussion confirmed Option 0 (full parser) is deferred to separate work

**Risk mitigation:** Both options avoid round-trip editing (code → visual), which delayed Screen Composer (#184) by weeks. Template-based generation maintains predictable output.

## Implementation Sequence

### Phase 1: Option 3 (ATL Preset Library) — Weeks 1-2

Build parameterized animation presets as extension of existing snippet system. No new infrastructure — reuse `SnippetManager`, `SnippetGridView`, validation, persistence.

**Why first:** Establishes reusable ATL building blocks that Phase 2 can reference. Lower risk, immediate value.

### Phase 2: Option 4 (Timeline Editor) — Weeks 3-4

Add timeline panel to Scene Composer. Generate ATL from keyframe sequences.

**Why second:** Needs animation vocabulary (easing, duration, properties) that presets establish. Complex UI derisked by existing canvas/scrubber patterns.

---

## Phase 1: ATL Preset Library

### New Types (`src/types.ts`)

```typescript
export interface ATLPresetParameter {
  name: string;
  type: 'duration' | 'easing' | 'repeat' | 'offset' | 'intensity';
  defaultValue: number | string;
  min?: number;
  max?: number;
  step?: number;
  options?: string[]; // for enums like easing
}

export interface ATLPreset extends Snippet {
  category: 'ATL Animations';
  parameters: ATLPresetParameter[];
  atlTemplate: string; // e.g., "linear {duration} alpha {target}"
  tags?: string[]; // "entrance", "exit", "loop", etc.
}
```

### Preset Library (`src/lib/atlPresetLibrary.ts`, ~400 lines)

Hardcoded 15-20 presets:
- **Movement**: Slide In/Out (4 directions), Bounce, Float, Shake
- **Opacity**: Fade In/Out, Dissolve, Ghost
- **Scale**: Pop In/Out, Zoom Pulse, Shrink
- **Rotation**: Spin, Wobble, Flip
- **Combined**: Roll Across, Dramatic Entrance

Template example:
```typescript
{
  title: 'Shake',
  atlTemplate: `parallel:
    linear {duration} xoffset {intensity}
    linear {duration} xoffset -{intensity}
    repeat {repeat_count}`,
  parameters: [
    { name: 'duration', type: 'duration', defaultValue: 0.1, min: 0.05, max: 1.0 },
    { name: 'intensity', type: 'offset', defaultValue: 10, min: 5, max: 50 },
    { name: 'repeat_count', type: 'repeat', defaultValue: 3, min: 1, max: 10 }
  ]
}
```

**Function:** `instantiatePreset(preset, params)` → replaces `{duration}`, `{intensity}` with user values.

### UI Component (`src/components/ATLPresetBrowser.tsx`, ~300 lines)

Reuse patterns from `SnippetGridView`:
- Search bar (fuzzy title/description/tags)
- Category filter chips
- 2-column responsive grid
- Favorite/star toggle (localStorage stats)

**New:** Parameter editor modal
- Sliders for numeric params (duration, intensity, offset)
- Dropdowns for enums (easing: linear/easein/easeout/...)
- Repeat controls (count or "loop")
- Live code preview
- "Insert to Editor" action

### Integration Points

**File:** `snippets/default-snippets.json`
- Add category `"ATL Animations"` with 15-20 presets

**File:** `src/hooks/useSnippetLoader.ts`
- No changes needed — presets load like normal snippets

**File:** `src/lib/renpyCompletionProvider.ts`
- Register presets in Monaco autocomplete (prefix = `atl_shake`, etc.)

**File:** `src/components/StoryElementsPanel.tsx`
- Add "Animations" subtab that renders `<ATLPresetBrowser />` (or keep in Snippets tab with category filter)

### Validation & Testing

**Unit tests** (`src/lib/atlPresetLibrary.test.ts`):
- Template substitution with edge values (0, 1, negatives)
- Parameter validation (min/max clamping)
- Repeat/loop code generation

**Integration tests** (`src/components/ATLPresetBrowser.test.tsx`):
- Parameter editor binding
- Code preview updates
- Insert action calls editor focus

---

## Phase 2: Timeline Editor

### New Data Model (`src/lib/timelineTypes.ts`, ~100 lines)

```typescript
export interface Keyframe {
  id: string;
  time: number; // seconds
  spriteId: string;
  properties: Record<string, number>; // { xpos: 0.5, alpha: 1.0 }
  easing?: 'linear' | 'easein' | 'easeout' | 'easein_quad' | ...;
}

export interface KeyframeTrack {
  spriteId: string;
  property: 'xpos' | 'ypos' | 'zoom' | 'alpha' | 'rotation' | 'blur';
  keyframes: Keyframe[];
  isVisible: boolean; // show/hide in timeline UI
}

export interface SpriteAnimation {
  spriteId: string;
  name: string; // "Entrance", "Main Loop"
  tracks: KeyframeTrack[];
  duration: number;
  loop: boolean;
  loopDelay?: number;
}

export interface SceneAnimation {
  id: string;
  name: string;
  spriteAnimations: SpriteAnimation[];
  totalDuration: number;
}
```

**Extend `SceneComposition`:**
```typescript
export interface SceneComposition {
  // ...existing fields
  animations?: SceneAnimation[];
}
```

### Timeline UI (`src/components/SpriteTimeline.tsx`, ~500 lines)

**Layout:**
```
┌─ Timeline Header ────────────────────────────────┐
│ [Play ▶] Duration: 5.0s  Speed: 1x  [Reset]    │
│ ━━━━━━━━●━━━━━━━━━━━━━━ 2.3s / 5.0s           │ ← scrubber
└──────────────────────────────────────────────────┘
┌─ Sprite Selector ─────────────────────────────┐
│ Selected: "Eileen Happy"  [Edit All Sprites] │
└───────────────────────────────────────────────┘
┌─ Property Tracks ─────────────────────────────┐
│ ☑ xpos    ├─●──────●──────●──┤              │
│ ☑ ypos    ├────●──────●───────┤              │
│ ☑ alpha   ├●──────────────────┤              │
│ ☐ rotation                                    │
│ [+ Add Track]                                 │
└───────────────────────────────────────────────┘
```

**Component breakdown:**
- `SpriteTimelineTrack.tsx` (~300 lines) — single property track with draggable keyframe dots
- `KeyframeEditor.tsx` (~150 lines) — modal for precise time/value/easing input

**Key interactions:**
- Click track ruler → add keyframe at playhead
- Drag keyframe dot → adjust time
- Click keyframe → edit modal (time, value, easing)
- Delete key → remove keyframe
- Play button → `requestAnimationFrame` loop, update sprite properties in preview

### Preview & Playback (`src/lib/timelinePreview.ts`, ~300 lines)

**Interpolation engine:**
```typescript
function interpolate(
  kf1: Keyframe,
  kf2: Keyframe,
  currentTime: number,
  property: string
): number {
  const t = (currentTime - kf1.time) / (kf2.time - kf1.time); // 0-1
  const easedT = applyEasing(t, kf2.easing || 'linear');
  const v1 = kf1.properties[property];
  const v2 = kf2.properties[property];
  return v1 + easedT * (v2 - v1);
}
```

**Easing functions** (`src/lib/easingFunctions.ts`, ~150 lines):
- Implement Ren'Py standard set: `easein`, `easeout`, `easeinout`, `easein_quad`, `easeout_quad`, etc.
- Pure JS, no external lib

**Playback loop:**
```typescript
function startPlayback(animation: SpriteAnimation, onUpdate: (props) => void) {
  const startTime = performance.now();
  
  function tick(now: number) {
    const elapsed = (now - startTime) / 1000; // seconds
    if (elapsed > animation.duration) {
      if (animation.loop) startTime = now;
      else return; // stop
    }
    
    const props = {};
    for (const track of animation.tracks) {
      props[track.property] = interpolateTrack(track, elapsed);
    }
    onUpdate(props);
    requestAnimationFrame(tick);
  }
  
  requestAnimationFrame(tick);
}
```

### Code Generation (`src/lib/atlCodeGenerator.ts`, ~200 lines)

Keyframe sequences → ATL parallel blocks:

```typescript
function generateATLFromTimeline(anim: SpriteAnimation): string {
  let code = `transform ${anim.name.toLowerCase().replace(/\s/g, '_')}:\n`;
  
  // Group keyframes by property for parallel structure
  const tracks = anim.tracks.filter(t => t.keyframes.length >= 2);
  
  if (tracks.length > 1) {
    code += `    parallel:\n`;
    for (const track of tracks) {
      code += generateTrackCode(track, 8); // 8-space indent
    }
  } else {
    code += generateTrackCode(tracks[0], 4);
  }
  
  if (anim.loop) code += `    repeat\n`;
  return code;
}

function generateTrackCode(track: KeyframeTrack, indent: number): string {
  const kfs = track.keyframes.sort((a, b) => a.time - b.time);
  let code = '';
  
  for (let i = 0; i < kfs.length - 1; i++) {
    const duration = kfs[i + 1].time - kfs[i].time;
    const value = kfs[i + 1].properties[track.property];
    const easing = mapEasing(kfs[i + 1].easing || 'linear');
    code += `${' '.repeat(indent)}${easing} ${duration.toFixed(2)} ${track.property} ${value.toFixed(2)}\n`;
  }
  
  return code;
}
```

Output example:
```ren'py
transform entrance_slide:
    parallel:
        linear 0.50 xpos 0.50
        easein 1.00 alpha 1.00
    parallel:
        easeout 1.00 ypos 0.50
```

### Integration with Scene Composer

**File:** `src/components/SceneComposer.tsx`

**Changes:**
1. Add timeline panel below canvas (toggle visibility with button)
2. Pass selected sprite to `<SpriteTimeline selectedSpriteId={...} />`
3. Update `generatedCode` useMemo:
   ```typescript
   const generatedCode = useMemo(() => {
     let code = ''; // existing background + sprite code
     
     if (scene.animations?.length > 0) {
       code += '\n# Animations\n';
       for (const anim of scene.animations) {
         for (const spriteAnim of anim.spriteAnimations) {
           code += generateATLFromTimeline(spriteAnim) + '\n';
         }
       }
     }
     
     return code;
   }, [scene.background, scene.sprites, scene.animations]);
   ```
4. Update `onSceneChange` to include animations in persistence

**File:** `src/types.ts`
- `SerializedSceneComposition` extended with `animations?: SceneAnimation[]`

**File:** `src/lib/projectSerializer.ts`
- Serialize/deserialize animations when saving `sceneCompositions` to `project.ide.json`

### Validation & Testing

**Unit tests:**
- `atlCodeGenerator.test.ts` — keyframe → ATL generation edge cases
- `timelinePreview.test.ts` — interpolation accuracy (linear, easing)
- `easingFunctions.test.ts` — each easing function matches Ren'Py spec

**Integration tests:**
- `SpriteTimeline.test.tsx` — add/delete/drag keyframes
- `SceneComposer.test.tsx` — timeline integration, code generation

**E2E test update** (`e2e/smoke/21-demo-scene-composer.spec.ts`):
- Open Scene Composer
- Add sprite
- Open timeline
- Create 3 keyframes (entrance animation)
- Verify generated ATL code includes transform block

---

## Critical Files to Modify

**Phase 1:**
1. `src/types.ts` — Add `ATLPreset`, `ATLPresetParameter`
2. `src/lib/atlPresetLibrary.ts` (NEW) — Preset definitions
3. `src/components/ATLPresetBrowser.tsx` (NEW) — UI
4. `snippets/default-snippets.json` — Add "ATL Animations" category
5. `src/lib/renpyCompletionProvider.ts` — Register presets in autocomplete

**Phase 2:**
1. `src/lib/timelineTypes.ts` (NEW) — Data model
2. `src/lib/easingFunctions.ts` (NEW) — Easing library
3. `src/lib/timelinePreview.ts` (NEW) — Playback engine
4. `src/lib/atlCodeGenerator.ts` (NEW) — Keyframe → ATL
5. `src/components/SpriteTimeline.tsx` (NEW) — Timeline UI root
6. `src/components/SpriteTimelineTrack.tsx` (NEW) — Property track component
7. `src/components/KeyframeEditor.tsx` (NEW) — Keyframe detail modal
8. `src/components/SceneComposer.tsx` — Integrate timeline panel, update code generation
9. `src/types.ts` — Extend `SceneComposition` with `animations`
10. `src/lib/projectSerializer.ts` — Persist animations

---

## Verification

**After Phase 1:**
1. Open Story Elements → Animations tab
2. Click "Shake" preset
3. Adjust duration slider → code preview updates
4. Click Insert → code appears in editor
5. Run game → sprite shakes

**After Phase 2:**
1. Open Scene Composer
2. Add sprite "Eileen Happy"
3. Click "Timeline" button below canvas
4. Add 3 keyframes on xpos track: (0s: 0.0) → (1s: 0.5) → (2s: 1.0)
5. Set middle keyframe easing to "easeinout"
6. Click Play → sprite slides smoothly
7. Click "Export Code" → verify ATL transform block:
   ```ren'py
   transform eileen_entrance:
       linear 1.00 xpos 0.50
       easeinout 1.00 xpos 1.00
   ```
8. Save scene → reload project → animations persist

---

## Dependencies

**No new external libraries.** All using existing stack:
- React + TypeScript + Tailwind CSS
- `requestAnimationFrame` (Audio scrubber pattern)
- Pointer events (Canvas drag pattern)
- Modal accessibility hooks (`useModalAccessibility`)

---

## Timeline

**Phase 1:** 10-12 work days (2 weeks)
- Days 1-2: Types, preset library, template engine
- Days 3-5: ATLPresetBrowser component
- Days 6-7: Integration with snippets/Monaco
- Days 8-10: Tests, fixtures, polish

**Phase 2:** 12-15 work days (3 weeks)
- Days 1-3: Timeline types, easing functions, playback engine
- Days 4-7: SpriteTimeline components (tracks, scrubber, editor)
- Days 8-10: Integration into SceneComposer
- Days 11-12: Code generation
- Days 13-15: Tests, E2E, documentation

**Total: 22-27 work days (5 weeks)**

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| ATL syntax edge cases | Pre-validate all templates against Ren'Py docs; comprehensive test suite |
| Timeline performance (many keyframes) | `React.memo` on tracks, throttle drag events, memoize interpolation |
| Code generation bugs | Unit test every easing function, compare output with hand-written ATL |
| User confusion (presets vs timeline) | Clear UI separation: Presets tab vs Timeline panel; tooltips |
| Persistence conflicts | Schema versioning, migrations for old `sceneCompositions` |
