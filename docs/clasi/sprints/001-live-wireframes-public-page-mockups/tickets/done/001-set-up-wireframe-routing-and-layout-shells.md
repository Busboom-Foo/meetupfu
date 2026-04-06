---
id: '001'
title: Set up wireframe routing and layout shells
status: done
use-cases:
- SUC-001
- SUC-002
- SUC-003
- SUC-004
- SUC-005
- SUC-006
depends-on: []
github-issue: ''
todo: ''
---

# Set up wireframe routing and layout shells

## Description

Create the foundational structure for all wireframe pages: the directory, React Router routes, layout components, and shared mock data. All other wireframe tickets depend on this work. No production code is changed except for additive route declarations in `App.tsx`.

## Acceptance Criteria

- [ ] Directory `client/src/pages/wireframes/` exists.
- [ ] `mock-data.ts` is created with hardcoded sample data covering: one class (Hour of Micro:bit), one event request (mock date, zip, group info, email), multiple mock request records for the B4 dashboard with varied status values, three candidate voting dates for B6, and a list of registered sites for the B1 site selector.
- [ ] `components/WireframeLayout.tsx` renders a left-nav sidebar with three links: "My Requests" (`/wireframes/b4-dashboard`), "Request an Event" (`/wireframes/class-page`), "Help / FAQ" (`#`). The active route link is visually highlighted using `NavLink`.
- [ ] `components/LeagueHeader.tsx` renders a simplified reproduction of the jointheleague.org top navigation bar (League logo, primary nav links as static anchors, no interactivity required).
- [ ] `client/src/App.tsx` contains new standalone `<Route>` declarations (not nested under `AppLayout`) for all `/wireframes/*` paths defined in the architecture update.
- [ ] Navigating to `/wireframes/` in the dev server returns a working index page listing links to all wireframe pages.
- [ ] No existing routes or page components are broken.

## Implementation Plan

### Approach

Create the wireframe directory and files bottom-up: mock data first (no dependencies), then layout components (depend only on react-router-dom), then the index page stub, then register routes in App.tsx. Other ticket implementations can proceed in parallel once routes are registered.

### Files to Create

- `client/src/pages/wireframes/mock-data.ts` — TypeScript constants with interfaces for: `MockClass`, `MockEventRequest`, `MockRequestRecord`, `MockCandidateDate`, `MockSite`. Export one instance of each for page consumption.
- `client/src/pages/wireframes/components/WireframeLayout.tsx` — Left-nav shell. Uses `<NavLink>` from react-router-dom. Renders `<Outlet />` as the page content area.
- `client/src/pages/wireframes/components/LeagueHeader.tsx` — Static header. No state, no hooks. Reproduces the visual structure of the jointheleague.org header.
- `client/src/pages/wireframes/WireframeIndex.tsx` — Simple page that lists all wireframe route paths as clickable links for easy navigation during stakeholder review.

### Files to Modify

- `client/src/App.tsx` — Add standalone `<Route path="/wireframes" element={<WireframeLayout />}>` block containing child routes for each wireframe page. Stub imports can point to placeholder components until other tickets deliver the real pages.

### Testing Plan

Visual inspection only (wireframe tickets do not require unit tests):
- Run `npm run dev`, navigate to `http://localhost:5173/wireframes/`.
- Confirm the index page renders and lists all routes.
- Click a B-series link and confirm the WireframeLayout left-nav appears with correct active highlighting.
- Confirm `/` and other existing routes are unaffected.

### Documentation Updates

None required.
