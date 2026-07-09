# Code Snippets

This directory contains the code snippet definitions used by Vangard Ren'Py IDE.

## Structure

The snippet system consists of:

- **`default-snippets.json`** - Built-in Ren'Py code snippets bundled with the application
- This README for documentation

## Customizing Snippets

Power users can customize the built-in snippets by editing the `default-snippets.json` file directly. This allows you to:

- Add new snippet categories
- Modify existing snippets
- Remove snippets you don't use
- Share custom snippet packs with your team

You don't have to edit JSON by hand to share snippets, though: the Snippet Library
panel has **Select** (pick individual snippets) and **Export Category** actions to save
a pack file, and an **Import Pack...** action that merges a shared pack into your
global `custom.json`.

### File Format

The JSON file follows this structure:

```json
{
  "version": "1.0",
  "categories": [
    {
      "name": "Category Name",
      "snippets": [
        {
          "title": "Snippet Title",
          "description": "What this snippet does",
          "code": "The actual Ren'Py code"
        }
      ]
    }
  ]
}
```

### Fields

- **`version`** (string): Schema version for future compatibility
- **`categories`** (array): List of snippet categories
  - **`name`** (string): Display name for the category
  - **`snippets`** (array): List of snippets in this category
    - **`title`** (string): Display name for the snippet
    - **`description`** (string): Brief explanation of what the snippet does
    - **`code`** (string): The Ren'Py code to be copied. Use `\n` for newlines

### Example

```json
{
  "version": "1.0",
  "categories": [
    {
      "name": "My Custom Snippets",
      "snippets": [
        {
          "title": "Custom Dialogue",
          "description": "A custom character line",
          "code": "protagonist \"This is my custom snippet!\""
        }
      ]
    }
  ]
}
```

## Notes

- Changes to `default-snippets.json` require restarting the application to take effect
- Every snippet file is validated against a schema (`src/lib/snippetSchema.ts`) before use. An invalid `custom.json` or project `snippets.json` is skipped (with a warning shown in the Snippet Library panel) rather than silently emptying the whole list — the other sources still load normally
- User snippets (created via the "+ New Snippet" button) are stored separately in `AppSettings` and are not affected by this file
