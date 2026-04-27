# Migration Baseline - src/ Directory Structure

**Date:** 2026-04-27
**Branch:** refactor/migrate-to-src-directory

## Test Results

### Test Suite
- **Total Test Files:** 28 passed
- **Total Tests:** 481 passed
- **Duration:** 5.37s
- **Status:** ✅ All passing

### Build
- **Command:** `npm run build`
- **Status:** ✅ Success
- **Build Time:** 2.68s
- **Output:** dist/ directory

### Test Coverage
- **Overall Coverage:** 9.63% statements
- **Branch Coverage:** 8.91%
- **Function Coverage:** 7.99%
- **Line Coverage:** 10.11%

### Key Coverage by Directory
- **App.tsx:** 0% (5,320 lines)
- **components/:** 6.34%
- **hooks/:** 66.91%
- **contexts/:** 0%

### Known Issues
- Coverage parser warnings for 3 files (EditorView, MenuTemplatePickerModal, MenuConstructorModal) - these use `@/` alias which doesn't exist yet
- Build warning about chunk sizes (expected, not blocking)

## Project Structure (Before Migration)

```
.
├── App.tsx                    (5,320 lines)
├── index.tsx
├── types.ts
├── components/                (79 files)
├── hooks/                     (17 files)
├── lib/                       (29 files)
├── contexts/                  (1 file)
├── test/                      (setup + mocks)
├── electron.js
├── preload.js
├── vite.config.ts
├── tsconfig.json
└── [config files]
```

## Success Criteria

This baseline will be compared against the final state to ensure:
- ✅ Same number of tests passing (481)
- ✅ Coverage maintained or improved
- ✅ Build succeeds
- ✅ No functional regressions

---

**Next Step:** Stage 1 - Create src/ structure and move types.ts
