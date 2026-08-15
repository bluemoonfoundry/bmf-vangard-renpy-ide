# AppImage sandbox fallback: residual threat model

## What this is

Chromium (and therefore Electron) normally isolates renderer processes with an
OS-level sandbox enforced by a setuid-root helper binary, `chrome-sandbox`,
shipped next to the app executable. That helper only works if:

1. it is owned by `root` with the setuid bit set (mode `4755`), and
2. the filesystem it's executed from allows `suid` execution.

AppImage breaks condition 2 in most real deployments: the AppImage's FUSE
mount is commonly `nosuid`, and the `--appimage-extract-and-run` fallback
(used when FUSE/libfuse2 isn't available, e.g. current Ubuntu CI images)
extracts to a temp directory that is `nosuid` on a number of distros and CI
runners too. This is an AppImage/Linux packaging limitation, not something
Vangard's own code controls.

## What we do about it

`src/lib/sandboxProbe.js` decides whether to fall back to `--no-sandbox`:

- `isAppImageRuntime()` — true only when running from an AppImage (`APPIMAGE`/
  `APPDIR` env vars, or a `/tmp/.mount_*` exec path for the
  extract-and-run case).
- `chromeSandboxHelperUsable()` — stats the `chrome-sandbox` helper next to
  the running executable and checks it is root-owned with the setuid bit
  set. Any stat failure (missing file, wrong owner, wrong mode) is treated
  as "sandbox unusable."
- `shouldDisableSandbox()` — combines both: `--no-sandbox` is injected **only**
  when running Linux + AppImage + the helper is confirmed unusable. It is
  never applied to Windows, macOS, or Linux `.deb` installs, and it is not
  applied unconditionally to every AppImage launch — if a future AppImage
  runtime does preserve suid, the sandbox stays on.

Unit tests for all three functions live in `src/lib/sandboxProbe.test.ts`,
covering the platform gate, the AppImage-detection gate, and both the
usable/unusable helper-permission branches.

## Residual risk when the fallback is active

When `--no-sandbox` is applied, renderer processes run without Chromium's OS
sandbox. Compensating controls already in place (`electron.js`, main
`BrowserWindow` `webPreferences`):

- `contextIsolation: true` — renderer JS cannot reach Node/Electron internals
  directly.
- `nodeIntegration: false` — no `require`/Node globals exposed to page JS.
- All privileged operations go through the `namespace:action` IPC bridge in
  `preload.js`, which is the only surface exposed to the renderer.
- `src/lib/ipcSecurity.js` canonicalizes and bounds every filesystem IPC call
  to the open project root (path traversal / symlink-escape guard).
- `shell:openExternal` is allowlisted (see `validateExternalUrl` in
  `ipcSecurity.js`).

So a renderer compromise (e.g. via a malicious `.rpy`/project file or a
Monaco/webview bug) cannot directly escape to the host OS even without the
Chromium sandbox — it would still have to find a bug in the IPC surface
itself. This is real defense-in-depth, but it is not equivalent to the
Chromium sandbox; this fallback is accepted only for the AppImage
distribution channel, and only when the setuid helper is confirmed broken.

## Where this is exercised in CI

`.github/workflows/build.yml`'s Linux smoke test explicitly passes
`--appimage-extract-and-run --no-sandbox` because `ubuntu-latest` CI runners
lack `libfuse2` and mount the extraction temp dir `nosuid` — i.e. CI is
exactly the "helper unusable" case this fallback exists for.

## If this needs revisiting

If a future AppImage runtime/CI image reliably preserves suid execution,
`chromeSandboxHelperUsable()` will return `true` there and the sandbox will
stay enabled automatically — no code change needed. If Electron/AppImage
tooling ever ships a non-setuid (user-namespace) sandbox mode, prefer that
over this fallback and update `shouldDisableSandbox()` accordingly.
