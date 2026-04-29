# Monaco Editor Integration

The IDE embeds Monaco (the VS Code editor engine) with Ren'Py-specific language support built in two layers: a **TextMate tokenizer** for baseline syntax coloring and a **semantic token provider** that overlays live analysis data. Completion, theme, and Go-to-definition support sit alongside these.

All language feature registration is global (per language ID, not per editor instance) and happens once in `handleEditorWillMount` inside `src/components/EditorView.tsx`.

---

## 1. Initialization Sequence

```
Editor component mounts
  │
  ├─ handleEditorWillMount fires (before DOM is ready)
  │   ├─ Register Monarch fallback tokenizer      ← immediate, synchronous
  │   ├─ Register semantic token provider         ← global, once
  │   ├─ Register completion provider             ← global, once
  │   ├─ Define renpy-dark / renpy-light themes   ← global, once
  │   └─ Kick off initTextMate() async            ← non-blocking
  │       └─ Load Oniguruma WASM (/onig.wasm)
  │       └─ Load renpy.tmLanguage.json grammar
  │       └─ Build TextMate registry
  │       └─ createTextMateTokensProvider()
  │       └─ languages.setTokensProvider('renpy', provider)
  │           └─ Existing models re-tokenized
  │
  └─ handleEditorDidMount fires (editor DOM ready)
      └─ Editor ref stored, scroll/cursor state restored
```

The Monarch fallback ensures the editor is not completely unstyled during the async WASM load. Once TextMate is ready, it replaces Monarch and forces re-tokenization of all open models.

---

## 2. TextMate Tokenization (`src/lib/textmateGrammar.ts`)

### Initialization

`initTextMate()` is the entry point. It is idempotent — the first call loads the WASM and builds the registry; subsequent calls return the cached promise immediately:

```typescript
let initPromise: Promise<void> | null = null;

export async function initTextMate(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    // dynamic imports to keep WASM out of the main bundle
    const [oniguruma, vsctm] = await Promise.all([
      import('vscode-oniguruma'),
      import('vscode-textmate'),
    ]);
    await oniguruma.loadWASM(wasmBinary);
    // ... build Registry, load grammar
  })();
  return initPromise;
}
```

`vscode-oniguruma` and `vscode-textmate` are dynamically imported so the WASM binary is excluded from the initial bundle and loaded only when the first editor opens.

### Token bridge

`createTextMateTokensProvider()` returns a `monaco.languages.TokensProvider`. Its `tokenize(line, state)` method runs TextMate's grammar against one line at a time, converts each TextMate scope to a Monaco token type (using the most-specific scope — the last in the scope stack), and returns Monaco's expected `{ tokens, endState }` shape.

### Error handling

- If the grammar file fails to parse: throws `'Failed to load Ren'Py TextMate grammar'`
- If `tokenize()` is called before `initTextMate()` completes: throws `'TextMate not initialised — call initTextMate() first'`
- The caller (`handleEditorWillMount`) catches these and leaves the Monarch fallback in place

---

## 3. Semantic Token Overlay (`src/lib/renpySemanticTokens.ts`)

Semantic tokens run *on top of* TextMate coloring and apply analysis-aware highlighting — distinguishing a known label from an undefined one, a registered character from an unknown dialogue tag, and so on.

### Token legend

Nine token types are defined:

| Token type | Meaning |
|---|---|
| `renpyLabel` | Reference to a label that exists in the project |
| `renpyLabelUndefined` | Reference to a label not found in analysis |
| `renpyCharacter` | Character tag recognized by the character registry |
| `renpyCharacterUnknown` | Dialogue tag not in the character registry |
| `renpyImage` | Image name defined via `image` statement |
| `renpyImageUnknown` | Image name not found in `definedImages` |
| `renpyScreen` | Screen name defined via `screen` statement |
| `renpyScreenUnknown` | Screen name not found in `screens` |
| `renpyVariable` | Variable defined via `default` or `define` |

Theme colors for these types are defined in `SEMANTIC_DARK_RULES` and `SEMANTIC_LIGHT_RULES` arrays exported from this file and merged into the Monaco theme definitions.

### How tokens are computed

`computeSemanticTokens(text, analysis)` is called with the full document text and the current `RenpyAnalysisResult`. It applies a set of regex patterns to scan the document and classify each match as known or unknown by cross-referencing:

- `analysis.labels` — for jump/call targets
- `analysis.characters` — for dialogue character tags
- `analysis.definedImages` — for show/scene/hide image names
- `analysis.screens` — for call screen references
- `analysis.variables` — for `$` variable expressions

Results are sorted by position and delta-encoded as a `Uint32Array` (5 values per token: line delta, column delta, length, token type index, modifier bitmask) — the format Monaco's semantic token API requires.

### Registration and live updates

The provider is registered globally once per language. An `EventEmitter` is used to signal Monaco when analysis changes:

```typescript
// Registration (EditorView.tsx, handleEditorWillMount)
const emitter = new monaco.Emitter<void>();
monaco.languages.registerDocumentSemanticTokensProvider('renpy', {
  onDidChange: emitter.event,
  getLegend: () => getSemanticTokensLegend(),
  provideDocumentSemanticTokens: (model) => {
    const data = computeSemanticTokens(model.getValue(), analysisResultRef.current);
    return { data };
  },
});

// Triggered whenever analysisResult updates (EditorView.tsx)
useEffect(() => {
  semanticTokenEmitter.fire();
}, [analysisResult]);
```

`analysisResultRef` is a ref kept in sync with the `analysisResult` prop, so the provider always reads the latest result without needing to re-register.

---

## 4. Completion Provider (`src/lib/renpyCompletionProvider.ts`)

Completions are context-aware: the provider inspects the current line to determine which category of suggestions to return.

### Trigger characters

Registered with `triggerCharacters: [' ', '$']`. The space trigger enables keyword-context completions (e.g., after `jump ` or `show `); `$` triggers variable completions.

### Completion categories

| Context | Data source | Monaco kind |
|---|---|---|
| After `jump` / `call` | `analysis.labels` | `Function` |
| After `call screen` | `analysis.screens` | `Module` |
| After `show` / `scene` / `hide` | `analysis.definedImages` | `File` |
| After `$` | `analysis.variables` | `Variable` |

### Snapshot pattern

The provider captures a snapshot of `analysisResultRef.current` at the moment a completion is triggered, not a live subscription. This avoids race conditions where analysis updates mid-completion:

```typescript
provideCompletionItems: (model, position) => {
  const data = {
    labels: analysisResultRef.current.labels,
    characters: analysisResultRef.current.characters,
    variables: analysisResultRef.current.variables,
    screens: analysisResultRef.current.screens,
    definedImages: analysisResultRef.current.definedImages,
    userSnippets: userSnippetsRef.current,
  };
  return { suggestions: getRenpyCompletions(model, position, data) };
},
```

User snippets (from `.vangard/snippets.json` and the built-in library) are mixed into the same completion list via `userSnippetsRef`.

---

## 5. Theme Integration

Monaco has its own theme system separate from the app's Tailwind-based theming. Two custom Monaco themes are defined — `renpy-dark` and `renpy-light` — each embedding the semantic token color rules.

The app's 11 themes (`system`, `light`, `dark`, `solarized-light`, `solarized-dark`, `colorful`, `colorful-light`, `neon-dark`, `ocean-dark`, `candy-light`, `forest-light`) collapse to one of two Monaco themes based on whether the resolved theme is light or dark:

```typescript
// EditorView.tsx
<Editor
  theme={editorTheme === 'dark' ? 'renpy-dark' : 'renpy-light'}
  ...
/>
```

`editorTheme` is a `'light' | 'dark'` prop derived by the parent from the active app theme. Monaco theme switching is applied by re-rendering the `Editor` component with the new `theme` prop value.

---

## 6. Extending Language Features

### Adding a new semantic token type

1. Add the type name to `SEMANTIC_TOKEN_TYPES` in `renpySemanticTokens.ts`
2. Add color rules to both `SEMANTIC_DARK_RULES` and `SEMANTIC_LIGHT_RULES`
3. Add a regex scan and lookup in `computeSemanticTokens()`, cross-referencing the appropriate `RenpyAnalysisResult` field
4. No registration changes needed — the legend is read from the array at runtime

### Adding a new completion category

1. Add a new context-detection branch in `getRenpyCompletions()` in `renpyCompletionProvider.ts`
2. Add the data field to `RenpyCompletionData` if a new analysis field is needed
3. Populate the new field from `analysisResultRef.current` in the snapshot in `EditorView.tsx`

### Adding a new language feature (hover, go-to-definition, code lens)

Register it in `handleEditorWillMount` alongside the existing providers:

```typescript
monaco.languages.registerHoverProvider('renpy', {
  provideHover: (model, position) => { ... }
});
```

All Monaco language API registrations are global and take effect for every editor using the `'renpy'` language ID.

---

## 7. Performance Notes

- **WASM is loaded once** — `initTextMate()` is idempotent; the 400–600ms WASM initialization cost is paid only on the first editor open per session.
- **Semantic tokens re-scan on every analysis update** — `computeSemanticTokens()` runs regexes over the full document text each time the emitter fires. For very large files (>5,000 lines), this can be measurable; consider debouncing the emitter fire if it becomes a bottleneck.
- **Completion snapshots are synchronous** — no async work in `provideCompletionItems`; Monaco's UI does not stall.
- **Language providers are global** — registering the same provider twice (e.g., due to React strict-mode double-invocation) would install duplicate providers. The `handleEditorWillMount` guard ensures this only runs once.
