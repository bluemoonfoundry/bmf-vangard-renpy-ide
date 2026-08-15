# Vangard Studio Support Runbook

This document is for Blue Moon Foundry team members handling post-release support.
For end-user help, point users to the [GitHub Issues](https://github.com/bluemoonfoundry/bmf-vangard-renpy-ide/issues) page.

---

## Log File Locations

Vangard Studio uses [electron-log](https://github.com/megahertz/electron-log). Logs rotate at 5 MB.

| Platform | Log directory |
|---|---|
| **Windows** | `%APPDATA%\vangard-studio\logs\` |
| **macOS** | `~/Library/Logs/vangard-studio/` |
| **Linux** | `~/.config/vangard-studio/logs/` |

The file is named `main.log`. Users can also open it from the app via **Help → Show Logs**.

The `userData` directory (settings, window state, API keys) is one level up from `logs/`:

| Platform | userData path |
|---|---|
| **Windows** | `%APPDATA%\vangard-studio\` |
| **macOS** | `~/Library/Application Support/vangard-studio/` |
| **Linux** | `~/.config/vangard-studio/` |

---

## Collecting a Diagnostics Report from a User

Ask the user to:

1. Reproduce the problem.
2. Open **Help → Show Logs** — this opens the log directory in their file manager.
3. Attach `main.log` to the GitHub issue.
4. Include:
   - OS and version (e.g. Windows 11 22H2, macOS 14.4, Ubuntu 22.04)
   - App version (**Help → About** or title bar)
   - Steps to reproduce
   - Whether it happens on a fresh project or an existing one

For crashes, also ask for the `traceback.txt` from their Ren'Py project folder if the game was running at the time.

---

## Known First-Launch Issues

### Ren'Py path not configured
**Symptom:** "Configure Ren'Py" modal appears on every launch; Run button is disabled.  
**Fix:** User must select their Ren'Py SDK root directory in the modal (the folder containing `renpy.exe` or `renpy.sh`). This is a one-time setup stored in `app-settings.json`.

### macOS "app is damaged" / Gatekeeper block
**Symptom:** macOS refuses to open the app after install. On macOS 15.1+, the usual right-click → Open / System Settings → Open Anyway bypasses may not reliably appear (see [#61](https://github.com/bluemoonfoundry/bmf-vangard-renpy-ide/issues/61)).
**Fix:** Run `xattr -r -d com.apple.quarantine "/Applications/Vangard Studio.app"` in Terminal, then reopen. This is a notarization/quarantine issue — v1.0.0 ships unsigned/unnotarized (no Apple Developer Program membership); this is a known, accepted limitation for this release, not a bug to chase further right now.

### Linux AppImage won't launch (FUSE error)
**Symptom:** `AppImages require FUSE to run` error on modern Ubuntu/Debian.  
**Fix:** `sudo apt install libfuse2` (Ubuntu 22.04+) then retry.

### Blank white window on first launch (Linux)
**Symptom:** App window opens but renderer is blank.  
**Fix:** Usually a GPU sandbox issue. The app already auto-detects and falls back to `--no-sandbox` when the AppImage's `chrome-sandbox` helper can't run (see `docs/security/appimage-sandbox.md`), so this should be rare. If it still happens, try launching manually with `./Vangard_Studio_Linux_*.AppImage --no-sandbox` and document the environment (distro, GPU driver) in the issue.

### Auto-updater silently fails
**Symptom:** No update notification on a version that should prompt one.  
**Check:** Look for `autoUpdater` lines in `main.log`. Common causes: no GitHub release published as `latest`, network proxy blocking GitHub releases CDN, or code-signing mismatch on macOS.

---

## Rollback / Downgrade

There is no automatic rollback. To downgrade:

1. Uninstall the current version (Windows: Add/Remove Programs; macOS: drag to Trash; Linux: `dpkg -r vangard-studio` or delete the AppImage).
2. Download the previous version's installer from the [GitHub Releases](https://github.com/bluemoonfoundry/bmf-vangard-renpy-ide/releases) page.
3. Install normally.

User project data (`game/` directory and `project.ide.json`) is not touched by install/uninstall and does not need to be backed up for a version switch.

User settings (`app-settings.json`) may need to be reset if the schema changed in a major version. Delete the file from the `userData` directory and re-configure on first launch.

---

## Filing Bugs Post-Release

- **Bugs and feature requests:** [GitHub Issues](https://github.com/bluemoonfoundry/bmf-vangard-renpy-ide/issues) — use the Bug Report or Feature Request templates.
- **Security vulnerabilities:** Email `security@bluemoonfoundry.example` (do not open a public issue).
- **Critical P0 issues found post-release:**
  1. Open a beads issue with `--priority=0` on the release branch.
  2. Hotfix on a `hotfix/vX.Y.Z+1` branch.
  3. Run through the [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) (sections 1, 3 for affected platforms, 4, 5).
  4. Tag and publish a patch release.
