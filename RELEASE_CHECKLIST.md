# Vangard Studio Release Checklist

Use this checklist before tagging any production release (`vX.Y.Z` without `alpha`/`beta`/`rc`).
Copy it into a GitHub issue using the **Release Checklist** issue template so sign-offs are tracked.

---

## 1. Code Quality Gates

- [ ] All commits intended for this release are on `main` (or the release branch)
- [ ] CI is green: **Test & Lint** job passes on the release commit
- [ ] **Coverage Gate** passes (`npm run test:coverage` — thresholds in `vite.config.ts`)
- [ ] **E2E Smoke Suite** passes (5 smoke tests via Playwright)
- [ ] No open P0 or P1 beads issues (`bd list --status=open` filtered by priority)

## 2. Changelog & Versioning

- [ ] `CHANGELOG.md` has an entry for this version (move `[Unreleased]` → `[X.Y.Z]`)
- [ ] `package.json` `"version"` matches the tag being cut
- [ ] `package-lock.json` is in sync (`npm install` produces no diff)

## 3. Installer Smoke Tests (all four platforms — human sign-off required)

Each platform must be verified by a human on real hardware or a VM.

| Platform | Artifact | Checklist |
|---|---|---|
| **Windows** | `renide-Setup-X.Y.Z.exe` | [ ] Installs silently, [ ] App launches, [ ] Opens test project, [ ] Auto-update check fires without crash |
| **macOS ARM** | `renide-X.Y.Z-arm64.dmg` | [ ] DMG mounts, [ ] App launches (Gatekeeper / notarization OK), [ ] Opens test project |
| **macOS Intel** | `renide-X.Y.Z-x64.dmg` | [ ] DMG mounts, [ ] App launches, [ ] Opens test project |
| **Linux AppImage** | `renide-X.Y.Z.AppImage` | [ ] `chmod +x` + run works, [ ] App launches, [ ] Opens test project |
| **Linux deb** | `renide_X.Y.Z_amd64.deb` | [ ] `dpkg -i` installs, [ ] App launches, [ ] Opens test project |

> **Test project**: use `e2e/fixtures/test-project/` — it has two labels and exercises canvas rendering.

> **TODO(#61)**: macOS 15.1+ installed builds have been reported to fail to
> start. `package.json`'s `"mac"` build config currently sets no
> `hardenedRuntime`, `entitlements`/`entitlementsInherit`, or `notarize`
> options — the classic cause of Gatekeeper silently blocking launch on
> recent macOS. Confirm this is (or isn't) still reproducing on a real
> macOS 15.1+ machine before signing off on the macOS rows above; if it
> still reproduces, package.json's mac config needs those settings added.

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
