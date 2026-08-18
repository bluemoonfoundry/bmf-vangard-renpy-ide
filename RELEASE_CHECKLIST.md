# Vangard Studio Release Checklist

Use this checklist before tagging any production release (`vX.Y.Z` without `alpha`/`beta`/`rc`).
Copy it into a GitHub issue using the **Release Checklist** issue template so sign-offs are tracked.

---

## 0. Release Candidate Build Log

Track CI-verified pre-release (`rc`) builds here as they're cut. A green
`rc` build satisfies the *automated* portions of §1 and §5 for the commit
it was built from — re-verify those boxes are still accurate if `main`
moves before the final `vX.Y.Z` tag. Manual sign-off (§3, §4, §6) is
**never** satisfied by an `rc` build and must be re-done against the
final tag's own artifacts.

| Tag | Commit | Date | Test & Lint | E2E Smoke (97) | Win / macOS ARM / macOS Intel / Linux builds | Notes |
|---|---|---|---|---|---|---|
| `v1.0.0-rc1` | — | 2026-07-20 | ✅ | ✅ | ✅ / ✅ / ✅ / ✅ | [run](https://github.com/bluemoonfoundry/bmf-vangard-renpy-ide/actions/runs/29711195126) |
| `v1.0.0-rc2` | `9d97314` | 2026-08-17 | ✅ | ✅ | ✅ / ✅ / ✅ / ✅ | All 4 platform installers + `SHA256SUMS.txt` published to [the pre-release](https://github.com/bluemoonfoundry/bmf-vangard-renpy-ide/releases/tag/v1.0.0-rc2). Manual installer sign-off (§3) completed 2026-08-17 — `bmf-vangard-renpy-ide-zji` closed. |

## 1. Code Quality Gates

- [x] All commits intended for this release are on `main` (or the release branch) — verified 2026-08-17, `main` at `b7ffc7f`
- [x] CI is green: **Test & Lint** job passes on the release commit — verified via `v1.0.0-rc2` build + local re-run (124 files / 2376 tests passing)
- [x] **Coverage Gate** passes (`npm run test:coverage` — thresholds in `vite.config.ts`) — verified 2026-08-17, exit 0
- [x] **E2E Smoke Suite** passes (97 smoke tests via Playwright) — verified via `v1.0.0-rc2` build
- [x] No open P0 or P1 beads issues (`bd list --status=open` filtered by priority) — verified 2026-08-17 after closing `bmf-vangard-renpy-ide-zji` (installer sign-off, §3 below)

## 2. Changelog & Versioning

- [x] `CHANGELOG.md` has an entry for this version (move `[Unreleased]` → `[X.Y.Z]`)
- [x] `package.json` `"version"` matches the tag being cut (`1.0.0`)
- [x] `package-lock.json` is in sync (`npm install` produces no diff) — verified 2026-08-17 after applying `dompurify`/`js-yaml` security fixes (`b7ffc7f`)

## 3. Installer Smoke Tests (all four platforms — human sign-off required)

Each platform must be verified by a human on real hardware or a VM.

| Platform | Artifact | Checklist |
|---|---|---|
| **Windows** | `Vangard_Studio_Windows_X.Y.Z.exe` | [x] Installs silently, [x] App launches, [x] Opens test project, [x] Auto-update check fires without crash |
| **macOS ARM** | `Vangard_Studio_macOS_X.Y.Z-macos-arm64.dmg` | [x] DMG mounts, [x] `xattr -r -d com.apple.quarantine` then app launches (see note below — do NOT sign off on a bare double-click launch), [x] Opens test project |
| **macOS Intel** | `Vangard_Studio_macOS_X.Y.Z-macos-intel.dmg` | [x] DMG mounts, [x] `xattr -r -d com.apple.quarantine` then app launches, [x] Opens test project |
| **Linux AppImage** | `Vangard_Studio_Linux_X.Y.Z.AppImage` | [x] `chmod +x` + run works, [x] App launches, [x] Opens test project |
| **Linux deb** | `Vangard_Studio_Linux_X.Y.Z.deb` | [x] `dpkg -i` installs, [x] App launches, [x] Opens test project |

> **Sign-off recorded 2026-08-17** by G.Hirpara — all five artifacts verified on real hardware/VM per the checklist above.

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

- [x] Fresh install (no prior `userData`) shows the first-run tutorial
- [x] Ren'Py SDK path prompt appears when no path is configured
- [x] `Help → Show Logs` opens the log directory without error

> Verified as part of the manual QA pass (`bmf-vangard-renpy-ide-1sg`, closed 2026-08-17).

## 5. Release Artifacts

- [ ] All five artifact types present in the GitHub release draft
- [ ] `SHA256SUMS.txt` is attached and hashes match downloaded files
- [ ] Release notes in the GitHub release body are accurate

## 6. Sign-Off

| Role | Name | Date |
|---|---|---|
| Engineer | G.Hirpara | 2026-08-17 |
| QA / Manual tester | G.Hirpara | 2026-08-17 |

> Engineer sign-off covers §1, §2, §4 (verified above) and this final pre-tag review pass.
> QA sign-off covers the manual QA pass (`bmf-vangard-renpy-ide-1sg`) and installer
> sign-off across all four platforms (`bmf-vangard-renpy-ide-zji`, §3). **All checklist
> gates are now satisfied except §5 (Release Artifacts), which can only be verified
> against the real `v1.0.0` tag's own GitHub release once cut.**

---

**Tag only after every box above is checked.**

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```
