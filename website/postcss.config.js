// Empty on purpose: without this, Vite walks up to the repo root's
// postcss.config.js (the main Electron app's Tailwind setup) since website/
// doesn't declare its own. That config requires `tailwindcss`, which isn't a
// dependency of website/package.json -- it happens to resolve locally
// because root node_modules is usually already installed, but the docs.yml
// CI workflow only runs `npm ci` inside website/, so the build fails there.
export default {
  plugins: {},
};
