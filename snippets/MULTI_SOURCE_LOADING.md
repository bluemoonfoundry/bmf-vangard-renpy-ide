# Multi-Source Snippet Loading

## Overview

The snippet system now supports loading snippets from multiple sources with a priority-based merging system. This allows for flexible snippet customization at different levels: built-in, user-global, and project-specific.

## Load Priority

Snippets are loaded and merged in the following order (higher priority overrides lower):

```
1. Built-in (lowest priority)
   └─ snippets/default-snippets.json (bundled with app)

2. User Global (medium priority)
   └─ ~/.vangard-ide/snippets/custom.json

3. Project-Specific (highest priority)
   └─ <project>/.vangard/snippets.json
```

### How Merging Works

- Categories with the **same name** have their snippets **combined**
- Higher priority snippets appear **first** in the merged list
- Categories that only exist in one source are included as-is

**Example:**

```json
// Built-in (snippets/default-snippets.json)
{
  "categories": [
    {
      "name": "Dialogue & Narration",
      "snippets": [
        { "title": "Standard Dialogue", "..." },
        { "title": "Narration", "..." }
      ]
    }
  ]
}

// User Global (~/.vangard-ide/snippets/custom.json)
{
  "categories": [
    {
      "name": "Dialogue & Narration",
      "snippets": [
        { "title": "My Custom Dialogue", "..." }
      ]
    },
    {
      "name": "My Custom Category",
      "snippets": [
        { "title": "Custom Snippet", "..." }
      ]
    }
  ]
}

// Result: "Dialogue & Narration" contains 3 snippets
// - My Custom Dialogue (user)
// - Standard Dialogue (built-in)
// - Narration (built-in)
// Plus the new "My Custom Category" appears
```

## Usage

### 1. Built-in Snippets (Always Available)

These are bundled with the application and cannot be modified directly (unless you edit the source code).

**Location:** `snippets/default-snippets.json`

**Use case:** Default snippets provided by the application

### 2. User Global Snippets (Optional)

Create custom snippets that apply to **all** your projects.

**Location:** `~/.vangard-ide/snippets/custom.json` (on macOS/Linux)
**Location:** `%APPDATA%\vangard-ide\snippets\custom.json` (on Windows)

**Setup:**

1. Create the directory:
   ```bash
   mkdir -p ~/.vangard-ide/snippets
   ```

2. Create `custom.json`:
   ```json
   {
     "version": "1.0",
     "categories": [
       {
         "name": "My Snippets",
         "snippets": [
           {
             "title": "My Snippet",
             "description": "Description of what this does",
             "code": "show protagonist happy"
           }
         ]
       }
     ]
   }
   ```

3. Click "Reload" in the Snippets UI to load your changes

**Use case:** Personal snippets you use across all projects

### 3. Project-Specific Snippets (Optional)

Create snippets that only apply to a **specific project**.

**Location:** `<project-root>/.vangard/snippets.json`

**Setup:**

1. Create the directory in your project:
   ```bash
   mkdir -p .vangard
   ```

2. Create `snippets.json`:
   ```json
   {
     "version": "1.0",
     "categories": [
       {
         "name": "Project Snippets",
         "snippets": [
           {
             "title": "Project-Specific Snippet",
             "description": "Only for this project",
             "code": "# Project-specific code"
           }
         ]
       }
     ]
   }
   ```

3. Click "Reload" in the Snippets UI to load your changes

**Use case:** Project-specific snippets, team conventions, or template code

### 4. Version Control

Add to `.gitignore` if you want personal snippets:
```
.vangard/snippets.json
```

Or commit to share with your team:
```bash
git add .vangard/snippets.json
git commit -m "Add team snippet templates"
```

## Reload Button

The Snippets UI includes a **Reload** button that refreshes snippets from all sources without restarting the application.

**When to use:**
- After editing snippet JSON files
- After pulling project changes that include new snippets
- After adding user global snippets

**How it works:**
1. Click the "Reload" button (refresh icon) in the Snippet Library header
2. The button shows "Loading..." with a spinning icon
3. Snippets are reloaded from all three sources
4. The grid updates with the merged snippets

## JSON File Format

All snippet files use the same format:

```json
{
  "version": "1.0",
  "categories": [
    {
      "name": "Category Name",
      "snippets": [
        {
          "title": "Snippet Title",
          "description": "Brief description of what this snippet does",
          "code": "The actual Ren'Py code (use \\n for newlines)"
        }
      ]
    }
  ]
}
```

### Field Descriptions

- **`version`** (string): Schema version for future compatibility (currently "1.0")
- **`categories`** (array): List of snippet categories
  - **`name`** (string): Display name for the category (used for merging)
  - **`snippets`** (array): List of snippets in this category
    - **`title`** (string): Display name for the snippet
    - **`description`** (string): Brief explanation of what the snippet does
    - **`code`** (string): The Ren'Py code. Use `\n` for newlines in JSON.

### Example

```json
{
  "version": "1.0",
  "categories": [
    {
      "name": "Dialogue & Narration",
      "snippets": [
        {
          "title": "Protagonist Dialogue",
          "description": "Main character speaking",
          "code": "protagonist \"Your dialogue here\""
        },
        {
          "title": "Multi-line Narration",
          "description": "Multiple lines of narrative text",
          "code": "\"First line of narration.\"\n\"Second line of narration.\"\n\"Third line of narration.\""
        }
      ]
    },
    {
      "name": "My Custom Category",
      "snippets": [
        {
          "title": "Custom Template",
          "description": "Project-specific template",
          "code": "label custom_label:\n    scene bg custom\n    \"Custom content\""
        }
      ]
    }
  ]
}
```

## Error Handling

The snippet loader is **resilient to errors**:

- If a file doesn't exist: Silently skipped (no error shown)
- If JSON is invalid: Error logged to console, file skipped
- If user global fails: Falls back to built-in only
- If project-specific fails: Falls back to built-in + user global
- If everything fails: Falls back to built-in snippets

**Error display:** If snippets fail to load, a red error banner appears above the grid with the error message.

## Hook API

For developers integrating snippet loading into other components:

```typescript
import { useSnippetLoader } from '../hooks/useSnippetLoader';

function MyComponent() {
  const { categories, isLoading, error, reload } = useSnippetLoader({
    projectRootPath: '/path/to/project'  // Optional
  });

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {categories.map(category => (
        <div key={category.name}>
          <h3>{category.name}</h3>
          {category.snippets.map(snippet => (
            <div key={snippet.title}>{snippet.title}</div>
          ))}
        </div>
      ))}
      <button onClick={reload}>Reload</button>
    </div>
  );
}
```

### Hook Interface

```typescript
interface UseSnippetLoaderOptions {
  projectRootPath?: string | null;  // Path to project (for project-specific snippets)
}

interface UseSnippetLoaderResult {
  categories: SnippetCategory[];    // Merged categories from all sources
  isLoading: boolean;                // True while loading snippets
  error: string | null;              // Error message if loading failed
  reload: () => Promise<void>;       // Function to reload snippets
}
```

## Performance

- **Initial load**: ~5-20ms for all sources
- **Reload**: ~5-20ms (files are re-read from disk)
- **Caching**: None (files are read on demand)
- **Memory**: Minimal (only loaded snippets in memory)

## Troubleshooting

### Snippets not appearing after editing

**Solution:** Click the "Reload" button in the Snippet Library

### JSON syntax error

**Check:**
- Valid JSON syntax (use a validator: https://jsonlint.com/)
- Escaped newlines (`\n` not actual newlines in JSON strings)
- Comma placement (no trailing commas)
- Quote types (use double quotes `"` not single quotes `'`)

**Example of invalid JSON:**
```json
{
  "categories": [
    {
      "name": "Test",
      "snippets": [
        {
          "title": 'Invalid',  // ❌ Single quotes
          "code": "line 1      // ❌ Actual newline instead of \n
line 2"
        },
      ]  // ❌ Trailing comma
    }
  ]
}
```

**Correct JSON:**
```json
{
  "categories": [
    {
      "name": "Test",
      "snippets": [
        {
          "title": "Valid",
          "code": "line 1\nline 2"
        }
      ]
    }
  ]
}
```

### File permissions

**macOS/Linux:**
```bash
chmod 644 ~/.vangard-ide/snippets/custom.json
```

**Windows:**
- Right-click file → Properties → Security → Edit
- Ensure your user has Read permissions

## Future Enhancements

Planned features for the snippet system:

1. **File watching**: Auto-reload when snippet files change
2. **Snippet editor UI**: Edit snippets without touching JSON
3. **Import/export**: Share snippet collections
4. **Snippet variables**: Placeholder tokens like `{{name}}`
5. **Snippet validation**: JSON schema validation
6. **Usage analytics**: Track most-used snippets

## Sharing Snippets

### Share with team (project-specific)

1. Create `.vangard/snippets.json` in your project
2. Add team snippets
3. Commit to version control
4. Team members get snippets automatically

### Share with community (user global)

1. Create your `~/.vangard-ide/snippets/custom.json`
2. Export the file
3. Share via GitHub, Discord, forums, etc.
4. Others can download and use it

### Export/Import (manual for now)

**Export:**
```bash
# Copy user global snippets
cp ~/.vangard-ide/snippets/custom.json ~/Desktop/my-snippets.json
```

**Import:**
```bash
# Copy shared snippets to user global
cp ~/Downloads/shared-snippets.json ~/.vangard-ide/snippets/custom.json
```

## Summary

The multi-source snippet loading system provides:

✅ **Flexibility** - Customize at built-in, user, or project level
✅ **Priority** - Higher priority sources override lower ones
✅ **Merging** - Categories combine instead of replacing
✅ **Reload** - Update snippets without restarting
✅ **Resilience** - Graceful fallback on errors
✅ **Simplicity** - Just JSON files, no complex config

Start by creating `~/.vangard-ide/snippets/custom.json` for your personal snippets, or `.vangard/snippets.json` in your project for project-specific snippets!
