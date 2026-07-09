# Screenshots for the Vangard Studio Docs Site

Screenshots live in `docs/images/` and are served by the VitePress site at the site
root (e.g. `docs/images/welcome-screen.png` -> `/welcome-screen.png`), via the
`publicDir` setting in `website/.vitepress/config.ts`.

They are captured automatically by `docs/capture_screenshots.js` (Playwright driving
a real Electron build against `DemoProject`), either locally via `npm run
capture-screenshots` or through the `Docs Screenshots` GitHub Actions workflow
(`.github/workflows/docs-screenshots.yml`), which opens a PR with the refreshed
images.

## Current inventory

The manifest in `docs/capture_screenshots.js` is the source of truth for what gets
captured and how. As of this writing it produces:

`welcome-screen`, `project-opened`, `app-layout`, `story-elements-characters`,
`story-elements-images`, `code-editor`, `story-canvas-basic`, `route-canvas-basic`,
`choice-canvas-basic`, `diagnostics-panel-full`, `search-panel`,
`project-statistics`, `writer-character-manager`, `writer-variables`,
`writer-menu-builder`, `menu-editor-modal`, `artist-images-tab`, `artist-audio-tab`,
`artist-scenes-composer`, `artist-imagemaps-composer`, `dev-snippets-tab`,
`dev-colors-tab`, `dev-screens-tab`.

The `architecture-*.png` images (`architecture-process`, `architecture-state-hub`,
`architecture-block-lifecycle`, `architecture-analysis-pipeline`) are not part of the
capture script — they are hand-produced diagrams embedded in
`website/architecture/SYSTEM_ARCHITECTURE.md`.

### Resolved: `artist-screen-layouts-composer.png` retired

Product decision: the Screen Layout Composer's "Compose > Screen Layouts > + New" flow
is not being exposed in this release, and the screenshot's removed manifest entry
(see the `NOTE` comment in `docs/capture_screenshots.js`) reflects that it can no
longer be captured. `website/guide/visual-composers.md`,
`website/reference/composer-reference.md`, and other guide pages were rewritten to
describe screens as authored directly in `.rpy` source with a read-only Screen Preview
panel, and the now-orphaned `docs/images/artist-screen-layouts-composer.png` file was
deleted.

### Captured but not currently embedded

`story-elements-images.png`, `writer-menu-builder.png`,
`writer-character-manager.png`, and `menu-editor-modal.png` are captured by the
script but not referenced by any page under `website/` today. Harmless to keep (the
workflow will keep refreshing them), but if the manifest is trimmed for time, these
are the first candidates to drop.

## Adding a new screenshot

1. Add an entry to the `SCREENSHOTS` array in `docs/capture_screenshots.js` with a
   `filename` and a `setup` function that navigates the app into the desired state.
2. Run `npm run capture-screenshots` locally (or dispatch the `Docs Screenshots`
   workflow) to generate the PNG into `docs/images/`.
3. Reference it in the relevant `website/` page with a root-absolute path, e.g.:

   ```markdown
   ![Alt text describing the screenshot](/your-new-filename.png)
   ```

4. Update the inventory list above.
