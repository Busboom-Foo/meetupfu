---
id: 009
title: Navigation smoke test (Playwright)
status: done
use-cases:
- SUC-001
- SUC-002
- SUC-003
- SUC-004
- SUC-005
- SUC-006
depends-on:
- '002'
- '003'
- '004'
- '005'
- '006'
- '007'
- 008
github-issue: ''
todo: ''
---

# Navigation smoke test (Playwright)

## Description

Write a single Playwright E2E test file that visits every wireframe page and asserts that each page renders without JavaScript errors or visible error UI. This serves as the automated smoke test for the full wireframe deliverable.

The test does not verify visual fidelity or specific content accuracy — that is done manually during stakeholder review. It only confirms that no page crashes on load and that basic navigation links work.

## Acceptance Criteria

- [ ] A Playwright test file exists at `tests/e2e/wireframes.spec.ts`.
- [ ] The test starts the dev server (or assumes it is already running on `localhost:5173`).
- [ ] The test visits each of the following URLs and asserts no console errors of level `error` occur:
  - [ ] `/wireframes/`
  - [ ] `/wireframes/class-page`
  - [ ] `/wireframes/a1`
  - [ ] `/wireframes/a2-registration`
  - [ ] `/wireframes/b1-intake`
  - [ ] `/wireframes/b2-donation`
  - [ ] `/wireframes/b3-verification`
  - [ ] `/wireframes/b4-dashboard`
  - [ ] `/wireframes/b5-detail`
  - [ ] `/wireframes/b6-voting`
- [ ] The test asserts that each page does not show a React error boundary or "Something went wrong" message.
- [ ] The test passes when run with `npx playwright test tests/e2e/wireframes.spec.ts` against the running dev server.
- [ ] Existing E2E tests (if any) are not broken.

## Implementation Plan

### Approach

The test uses Playwright's `page.goto()` to visit each URL in sequence. After each navigation, it:
1. Waits for the page to be in a stable state (`networkidle` or `domcontentloaded`).
2. Checks the console for error-level messages using `page.on('console', ...)`.
3. Asserts that no element matching a React error boundary selector is visible.

If Playwright is not yet configured in the project, install it and add a basic config targeting `localhost:5173`.

### Files to Create

- `tests/e2e/wireframes.spec.ts`
- `playwright.config.ts` (if not already present) — minimal config targeting `http://localhost:5173`.

### Files to Modify

- `package.json` (root) — Add a `test:e2e` script: `"playwright test"` if not already present.

### Testing Plan

Run `npx playwright test tests/e2e/wireframes.spec.ts` with the dev server running. All page visits should pass. If any page has a render error, the test will surface it before stakeholder review.

### Documentation Updates

None required.
