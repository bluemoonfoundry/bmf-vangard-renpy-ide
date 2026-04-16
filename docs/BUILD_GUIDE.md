# Building the User Guide

This directory contains the source files for the Ren'IDE User Guide.

## Prerequisites

- **Pandoc 3.x**: Available at `~/Development/pandoc-3.9.0.2-arm64/bin/pandoc`
- **XeLaTeX**: Required only for PDF generation (not needed for HTML)

## Quick Start

### Generate HTML User Guide (for app bundling)

```bash
make html
```

This generates `Ren-IDE_User_Guide.html` which is bundled with the Electron app.

### Generate PDF User Guide

```bash
make pdf
```

This generates `Ren-IDE_User_Guide.pdf` with title page and full formatting.

### Generate Both

```bash
make all
```

## Available Targets

- `make all` - Generate both PDF and HTML (default)
- `make pdf` - Generate final PDF with title page
- `make html` - Generate HTML user guide for bundling
- `make draft` - Generate draft PDF (no title page, quick)
- `make test` - Generate test PDF (minimal options)
- `make clean` - Remove all generated files
- `make help` - Show help message

## Files

### Source Files
- `USER_GUIDE.md` - Main user guide content
- `TITLE_PAGE.md` - Title page for PDF version
- `user-guide.css` - Styles for HTML version

### Generated Files (gitignored)
- `Ren-IDE_User_Guide.html` - Bundled with app
- `Ren-IDE_User_Guide.pdf` - For distribution
- `Ren-IDE_User_Guide_DRAFT.pdf` - Quick draft version
- `test.pdf` - Testing output

## Integration with Build Process

The HTML user guide is automatically generated during the distribution build:

```bash
npm run dist
```

The `predist` script in `package.json` calls `npm run build:docs` which runs `make html`.

## Customization

### HTML Styling

Edit `user-guide.css` to customize the HTML appearance. The CSS includes:
- Responsive layout (max-width: 900px)
- Dark mode support via `prefers-color-scheme`
- Syntax highlighting for code blocks
- Print-friendly styles

### PDF Options

Edit `PANDOC_OPTIONS` in the Makefile to customize PDF generation:
- Margins: `--variable geometry:margin=1in`
- Font size: `--variable fontsize=11pt`
- Line spacing: `--variable linestretch=1.2`
- Document class: `--variable documentclass=report`

## Opening the User Guide in Development

In development mode, the user guide is accessible via:

**Menu**: Help → User Guide

**Path**: `docs/Ren-IDE_User_Guide.html`

In the packaged app, it's located at:

**Windows/Linux**: `resources/docs/Ren-IDE_User_Guide.html`
**macOS**: `Contents/Resources/docs/Ren-IDE_User_Guide.html`

## Troubleshooting

### Pandoc Not Found

If you see "pandoc: command not found", update the `PANDOC` variable in the Makefile:

```makefile
PANDOC?=~/Development/pandoc-3.9.0.2-arm64/bin/pandoc
```

### Images Not Loading in HTML

Ensure `--embed-resources` is used in `HTML_OPTIONS` to embed images directly in the HTML file.

### CSS Not Applied

The CSS file must be in the same directory as the Makefile, or update the path:

```makefile
--css=user-guide.css
```
