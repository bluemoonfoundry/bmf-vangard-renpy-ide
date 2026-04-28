# Types Reference

This document provides a high-level overview of the major type categories in Vangard Ren'Py IDE and explains how they relate to each other. For detailed property definitions and JSDoc comments, see [`src/types.ts`](../../src/types.ts) directly.

## Purpose

Rather than duplicate type definitions (which creates maintenance burden), this guide explains:
- **Type categories** and their roles in the application
- **Relationships** between types and data flow
- **Architectural patterns** for how types work together
- **Key concepts** that connect multiple types

For specific property names, types, and detailed documentation, always refer to `src/types.ts`.

---

## Type Categories

### 1. Core Canvas Types

These types represent the fundamental building blocks of the visual canvases.

#### Block System
- **`Block`** - Represents a `.rpy` file as a draggable canvas element
- **`BlockGroup`** - Visual grouping container for organizing blocks
- **`Link`** - Connection between blocks (represents jump/call relationships)

**Key Relationship**: Blocks contain Ren'Py code (`content` property) which is parsed by the analysis system to generate Links. The analysis populates `block.title` and `block.color` based on the first label found.

#### Sticky Notes & Tasks
- **`StickyNote`** - Markdown-formatted annotations on canvases (three separate arrays: `stickyNotes`, `routeStickyNotes`, `choiceStickyNotes`)
- **`DiagnosticsTask`** - Task/checklist items that can be promoted from sticky notes
- **`NoteColor`** - Available color options for notes

**Key Relationship**: Sticky notes can be "promoted" to DiagnosticsTask via checkbox, creating a bidirectional link through `task.stickyNoteId`.

### 2. Analysis Types

The analysis system is the data transformation layer that converts raw Ren'Py code into structured data for visualization.

#### Central Result
- **`RenpyAnalysisResult`** - The comprehensive output of `useRenpyAnalysis` hook; contains all extracted data

**Architecture**: App.tsx feeds `blocks[]` (specifically only `{ id, content, filePath }`) through `useRenpyAnalysis`, which returns `RenpyAnalysisResult`. This result drives all three canvases, the diagnostics system, autocomplete, and semantic highlighting.

**Important**: Analysis only receives block content, not position/size/color. This prevents drag operations from triggering expensive re-analysis.

#### Label & Flow Types
- **`LabelLocation`** - Where a label is defined in code (line/column for editor navigation)
- **`JumpLocation`** - Where jump/call statements occur
- **`LabelNode`** - Visual node representing a label on Flow/Choices Canvas
- **`RouteLink`** - Connection between label nodes (can be explicit jump/call or implicit fall-through)
- **`IdentifiedRoute`** - A complete narrative path through the label graph (for color-coding routes)

**Data Flow**:
```
Block.content → Analysis → LabelLocation + JumpLocation
                         → LabelNode[] + RouteLink[] (for Flow/Choices Canvas)
                         → Link[] (for Project Canvas)
```

#### Code Element Types
- **`Character`** - Extracted from `define` statements, includes all Ren'Py Character() parameters
- **`Variable`** - Extracted from `define`/`default` statements
- **`RenpyScreen`** - Extracted screen definitions
- **`DialogueLine`** - Records which character speaks on which line

**Usage Pattern**: These are Maps/Sets within `RenpyAnalysisResult`:
```typescript
analysisResult.characters: Map<tag, Character>
analysisResult.variables: Map<name, Variable>
analysisResult.screens: Map<name, RenpyScreen>
```

### 3. Diagnostics Types

The diagnostics system validates code and tracks issues/tasks.

- **`DiagnosticIssue`** - Individual error/warning/info issue
- **`DiagnosticsResult`** - Aggregated diagnostics with counts
- **`IgnoredDiagnosticRule`** - Suppression rules for specific diagnostics

**Relationship to Analysis**: The `useDiagnostics` hook consumes `RenpyAnalysisResult` and cross-references it with project assets to generate issues (e.g., "missing-image" if an image tag is used but not in `projectImages`).

### 4. Asset Types

Assets represent media files used in the project.

- **`ProjectImage`** - Image asset (can be internal `game/images/` or externally scanned)
- **`ImageMetadata`** - Ren'Py name, tags, subfolder for images
- **`RenpyAudio`** - Audio asset (can be internal `game/audio/` or externally scanned)
- **`AudioMetadata`** - Ren'Py name, tags, subfolder for audio

**Storage Pattern**: Assets are stored as Maps in App.tsx state:
```typescript
const projectImages = useState(new Map<filePath, ProjectImage>());
const projectAudios = useState(new Map<filePath, RenpyAudio>());
```

**Key Properties**:
- `isInProject`: true if copied to `game/images/` or `game/audio/`
- `projectFilePath`: destination path after copy
- `fileHandle`: File System Access API handle (null in Electron mode)

### 5. Visual Composer Types

These types power the three visual composers.

#### Scene Composer
- **`SceneComposition`** - Complete scene with background + sprites
- **`SceneSprite`** - Individual sprite layer with transforms and effects

**Key Features**: Sprites have visual effects (saturation, brightness, tint, blur, matrix presets) and can use custom shaders (`activeShader`, `shaderUniforms`).

#### ImageMap Composer
- **`ImageMapComposition`** - Clickable imagemap screen
- **`ImageMapHotspot`** - Rectangular hotspot region with action
- **`ImageMapActionType`** - 'jump' or 'call'

**Code Generation**: Composer generates Ren'Py `imagemap` screen code from the composition.

#### Screen Layout Composer
- **`ScreenLayoutComposition`** - Complete screen layout
- **`ScreenWidget`** - Individual UI widget (can nest children)
- **`ScreenWidgetType`** - Available widget types (vbox, hbox, frame, text, button, etc.)

**Code Generation**: Composer generates Ren'Py `screen` code via `screenCodeGenerator.ts`.

### 6. UI State Types

These types manage the editor UI itself.

- **`EditorTab`** - Open tab in the main editor area
- **`Position`** - 2D coordinate (x, y) used throughout for canvas positions
- **`Theme`** - Available UI themes (11 options)
- **`ToastMessage`** - Temporary notification

**Tab Types**:
- Canvas tabs: `canvas`, `route-canvas`, `choice-canvas`
- Content tabs: `editor`, `image`, `audio`, `markdown`
- Tool tabs: `diagnostics`, `stats`, `translations`
- Composer tabs: `scene-composer`, `imagemap-composer`, `screen-layout-composer`

**Tab Lifecycle**: Tabs mount lazily on first activation, then stay mounted-but-hidden to preserve Monaco editor state.

### 7. Settings Types

Settings are split between application-level and project-level.

- **`AppSettings`** - User preferences across all projects (theme, SDK path, recent projects, font)
- **`ProjectSettings`** - Per-project state (tabs, canvas layouts, compositions, sticky notes, tasks)
- **`IdeSettings`** - Combined interface (used in Settings Modal)

**Persistence**:
- `AppSettings` → `userData/app-settings.json` (Electron) or localStorage (web)
- `ProjectSettings` → `.renide/project.json` in project directory
- Block positions → `.renide/project.json` (debounced ~2s)
- Compositions → `.renide/ide-settings.json`

**Mouse Gestures**: `MouseGestureSettings` within AppSettings controls canvas pan/zoom behavior.

### 8. File System Types

These types support the file explorer and IPC operations.

- **`FileSystemTreeNode`** - Hierarchical tree structure
- **`ClipboardState`** - Cut/copy clipboard for file operations

**IPC Types** (data shapes returned by Electron):
- **`ProjectLoadResult`** - Full project load (files, assets, tree, settings)
- **`ProjectFileEntry`** - Single file entry (path + content)
- **`ScannedImageAsset`** / **`ScannedAudioAsset`** - Asset scan results
- **`ScanDirectoryResult`** - Directory scan output

### 9. Search & Translation Types

- **`SearchResult`** / **`SearchMatch`** - Search results from ripgrep
- **`TranslatableString`** / **`TranslatedString`** - Translation extraction
- **`LanguageCoverage`** / **`TranslationFileBreakdown`** - Translation statistics
- **`TranslationAnalysisResult`** - Complete translation analysis

**Integration**: Translation data is part of `RenpyAnalysisResult.translationData`.

### 10. Menu & Snippet Types

- **`MenuTemplate`** - Saved menu structures for reuse
- **`MenuChoice`** - Individual menu choice with action/target/condition
- **`UserSnippet`** - User-defined code snippets

**Storage**: Both persist in `AppSettings` (not ProjectSettings) to share across projects.

---

## Key Architectural Patterns

### The Analysis Pipeline

```
Blocks[] (content only)
    ↓
useRenpyAnalysis (via debouncedBlocks)
    ↓
RenpyAnalysisResult
    ↓
├─→ Project Canvas (blocks + links)
├─→ Flow Canvas (labelNodes + routeLinks)
├─→ Choices Canvas (labelNodes + routeLinks with choice pills)
├─→ Diagnostics (useDiagnostics)
├─→ Monaco Autocomplete (renpyCompletionProvider)
└─→ Monaco Semantic Tokens (renpySemanticTokens)
```

### State Hub Pattern

All major state lives in `App.tsx` using `useImmer` or `useState`. There is only one context provider (`SearchContext`). This centralized pattern avoids prop-drilling while maintaining clear data flow.

### Undo/Redo Scope

`useHistory` hook only covers `blocks[]`. It does NOT affect:
- Editor text (Monaco has its own undo)
- Canvas pan/zoom
- Project settings
- Asset operations

### Persistence Strategy

Different data persists to different locations:

| Data | Location | Trigger |
|------|----------|---------|
| Block content | Individual `.rpy` files | Immediate (Ctrl+S) |
| Block positions | `.renide/project.json` | Debounced (~2s) |
| Compositions | `.renide/ide-settings.json` | Manual save |
| App settings | `userData/app-settings.json` | On change |
| API keys | OS keychain (via safeStorage) | On save |

### Canvas Node Identity

Each canvas uses different identity keys:

- **Project Canvas**: `block.id` (UUID)
- **Flow Canvas**: `labelNode.id` (composite: `${blockId}:${labelName}`)
- **Choices Canvas**: Same as Flow Canvas

This explains why Flow/Choices Canvas nodes are recreated when block content changes, but Project Canvas blocks are stable.

---

## Common Usage Patterns

### Creating a New Block

```typescript
// 1. Write file to disk via IPC
await window.electronAPI.writeFile(filePath, content);

// 2. Add to blocks state (triggers useHistory)
setBlocks(draft => {
  draft.push({
    id: createId(),
    content,
    filePath,
    position: { x: 100, y: 100 },
    width: 200,
    height: 150,
  });
});

// 3. Open editor tab
setOpenTabs(draft => {
  draft.push({ id: blockId, type: 'editor', blockId });
});
```

The analysis system automatically:
- Extracts the first label → sets `block.title`
- Generates a color from the title hash → sets `block.color`
- Creates Links, LabelNodes, RouteLinks

### Working with Analysis Results

```typescript
const analysisResult = useRenpyAnalysis(debouncedBlocks);

// Check if label exists
const labelExists = analysisResult.labels['start'] !== undefined;

// Find where a label is defined
const location = analysisResult.labels['start'];
// → { blockId, label, line, column, type: 'label' | 'menu' }

// Get all jumps from a block
const jumps = analysisResult.jumps[blockId] || [];

// Check if block has story content
const isStoryBlock = analysisResult.storyBlockIds.has(blockId);
```

### Promoting a Sticky Note to Task

```typescript
const task: DiagnosticsTask = {
  id: crypto.randomUUID(),
  title: note.content.split('\n')[0], // First line as title
  description: note.content,
  status: 'open',
  stickyNoteId: note.id, // Link back to note
  createdAt: Date.now(),
};

setProjectSettings(draft => {
  draft.diagnosticsTasks = draft.diagnosticsTasks || [];
  draft.diagnosticsTasks.push(task);
});
```

### Rendering a Scene Composition

```typescript
// In Scene Composer View:
composition.sprites
  .sort((a, b) => a.zIndex - b.zIndex) // Layer order
  .map(sprite => (
    <img
      src={sprite.image.dataUrl}
      style={{
        left: `${sprite.x * 100}%`,
        top: `${sprite.y * 100}%`,
        transform: `scale(${sprite.zoom}) rotate(${sprite.rotation}deg)`,
        opacity: sprite.alpha,
        filter: `blur(${sprite.blur}px) saturate(${sprite.saturation || 1})`,
        // ... other visual effects
      }}
    />
  ))
```

---

## Type Evolution Guidelines

When modifying types:

1. **Update JSDoc first** - The JSDoc in `types.ts` is the source of truth
2. **Consider breaking changes** - Many types are persisted to disk (ProjectSettings, AppSettings)
3. **Add migration code** - If changing persisted types, add migration in `App.tsx` load handlers
4. **Update this guide** - Only if relationships or architectural patterns change, not for new properties

---

## See Also

- **[`src/types.ts`](../../src/types.ts)** - Complete type definitions with JSDoc
- **[ARCHITECTURE.md](../ARCHITECTURE.md)** - Overall system architecture
- **[CLAUDE.md](../../CLAUDE.md)** - Project conventions and patterns
