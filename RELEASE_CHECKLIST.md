# Vangard Studio Release Checklist

Use this checklist before tagging any production release (`vX.Y.Z` without `alpha`/`beta`/`rc`).
Copy it into a GitHub issue using the **Release Checklist** issue template so sign-offs are tracked.

---

## 1. Code Quality Gates

- [ ] All commits intended for this release are on `main` (or the release branch)
- [ ] CI is green: **Test & Lint** job passes on the release commit
- [ ] **Coverage Gate** passes (`npm run test:coverage` — thresholds in `vite.config.ts`)
- [ ] **E2E Smoke Suite** passes (97 smoke tests via Playwright)
- [ ] No open P0 or P1 beads issues (`bd list --status=open` filtered by priority)

## 2. Changelog & Versioning

- [ ] `CHANGELOG.md` has an entry for this version (move `[Unreleased]` → `[X.Y.Z]`)
- [ ] `package.json` `"version"` matches the tag being cut
- [ ] `package-lock.json` is in sync (`npm install` produces no diff)

## 3. Installer Smoke Tests (all four platforms — human sign-off required)

Each platform must be verified by a human on real hardware or a VM.

| Platform | Artifact | Checklist |
|---|---|---|
| **Windows** | `Vangard_Studio_Windows_X.Y.Z.exe` | [ ] Installs silently, [ ] App launches, [ ] Opens test project, [ ] Auto-update check fires without crash |
| **macOS ARM** | `Vangard_Studio_macOS_X.Y.Z-macos-arm64.dmg` | [ ] DMG mounts, [ ] `xattr -r -d com.apple.quarantine` then app launches (see note below — do NOT sign off on a bare double-click launch), [ ] Opens test project |
| **macOS Intel** | `Vangard_Studio_macOS_X.Y.Z-macos-intel.dmg` | [ ] DMG mounts, [ ] `xattr -r -d com.apple.quarantine` then app launches, [ ] Opens test project |
| **Linux AppImage** | `Vangard_Studio_Linux_X.Y.Z.AppImage` | [ ] `chmod +x` + run works, [ ] App launches, [ ] Opens test project |
| **Linux deb** | `Vangard_Studio_Linux_X.Y.Z.deb` | [ ] `dpkg -i` installs, [ ] App launches, [ ] Opens test project |

> **Test project**: use `e2e/fixtures/test-project/` — it has two labels and exercises canvas rendering.

> **Decision (2026-07-19, [#61](https://github.com/bluemoonfoundry/bmf-vangard-renpy-ide/issues/61))**:
> v1.0.0 ships macOS builds unsigned and unnotarized — no Apple Developer
> Program membership. This is a confirmed, accepted limitation for this
> release, not an open question. `package.json`'s `"mac"` build config has
> no `hardenedRuntime`, `entitlements`, or `notarize` settings by design for
> now. On macOS 15.1+, a plain double-click launch is expected to fail —
> sign-off must go through the `xattr -r -d com.apple.quarantine
> "/Applications/Vangard Studio.app"` workaround (documented in README.md
> and SUPPORT.md) rather than treating that failure as a release blocker.
> Revisit signing/notarization as a post-1.0 item if an Apple Developer
> account is obtained.

## 4. First-Run Validation

- [ ] Fresh install (no prior `userData`) shows the first-run tutorial
- [ ] Ren'Py SDK path prompt appears when no path is configured
- [ ] `Help → Show Logs` opens the log directory without error

## 5. Release Artifacts

- [ ] All five artifact types present in the GitHub release draft
- [ ] `SHA256SUMS.txt` is attached and hashes match downloaded files
- [ ] Release notes in the GitHub release body are accurate

## 6. Sign-Off

| Role | Name | Date |
|---|---|---|
| Engineer | | |
| QA / Manual tester | | |

---

**Tag only after every box above is checked.**

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```
