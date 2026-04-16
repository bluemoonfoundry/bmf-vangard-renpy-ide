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

## Future Enhancements

Planned features for snippet management:

- User-specific snippet overrides in home directory (`~/.vangard-ide/snippets/`)
- Per-project snippet customization (`.vangard/snippets.json`)
- Reload button in UI to refresh snippets without restarting
- Community snippet packs
- Import/export snippet collections

## Notes

- Changes to `default-snippets.json` require restarting the application to take effect
- Invalid JSON will cause the app to fall back to an empty snippet list
- User snippets (created via the "+ New Snippet" button) are stored separately in project settings and are not affected by this file
