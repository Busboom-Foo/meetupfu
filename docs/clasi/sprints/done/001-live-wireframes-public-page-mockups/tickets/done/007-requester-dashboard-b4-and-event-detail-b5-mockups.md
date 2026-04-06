---
id: '007'
title: Requester Dashboard (B4) and Event Detail (B5) mockups
status: done
use-cases:
- SUC-002
- SUC-005
- SUC-006
depends-on:
- '001'
github-issue: ''
todo: ''
---

# Requester Dashboard (B4) and Event Detail (B5) mockups

## Description

Build two pages that together show the post-submission requester experience:

**B4 — Requester Dashboard** (`/wireframes/b4-dashboard`): A list of the requester's mock event requests, each showing class name, status badge, date, location, and a link to the event detail page. At least three mock requests with different statuses should be shown (e.g. "new," "confirmed," "completed").

**B5 — Event Detail / Status Page** (`/wireframes/b5-detail`): Full details for a single mock event request. The page supports four status states (Confirmed, Discussing, Completed, Cancelled) toggled by a demo control. Each state shows the appropriate content variations defined in FEAT-2 §3.2.

Both pages use `WireframeLayout` for the left-nav shell.

## Acceptance Criteria

### B4 — Requester Dashboard

- [x] Page renders at `/wireframes/b4-dashboard` wrapped in `WireframeLayout`.
- [x] At least three mock request cards are shown, each with: class name, status badge (color-coded by status), date (or "Pending"), and location.
- [x] Each card has a "View Details" link pointing to `/wireframes/b5-detail`.
- [x] At least one confirmed request card shows a "Registration Link" (mock shareable URL) and a registration count.

### B5 — Event Detail / Status Page

- [x] Page renders at `/wireframes/b5-detail` wrapped in `WireframeLayout`.
- [x] A demo state toggle (four buttons or a select) is visible, allowing switching between: Confirmed, Discussing, Completed, Cancelled.
- [x] All states show: class name, requested date(s), location, group info, event type, status badge, and a timeline of two or three mock status changes.
- [x] **Confirmed state** additionally shows: confirmed date, instructor first name, location details, a shareable registration link, and a registration count.
- [x] **Discussing state** additionally shows: a note "Coordination is happening via email. Check your email for updates." Registration link is absent.
- [x] **Completed state** additionally shows: an attendance summary section (e.g. "24 kids attended, 3 no-shows").
- [x] **Cancelled state** additionally shows: a cancellation reason (e.g. "Insufficient instructor availability for requested dates.").
- [x] All four states render without errors.

## Implementation Plan

### Approach

`B4Dashboard.tsx` renders a list of mock request records from `mock-data.ts`. Each card is a simple `div` or card component — no separate Card component file needed.

`B5Detail.tsx` uses `useState` to track the current status state (`'confirmed' | 'discussing' | 'completed' | 'cancelled'`). Conditional rendering shows the status-specific content blocks.

### Files to Create

- `client/src/pages/wireframes/B4Dashboard.tsx`
- `client/src/pages/wireframes/B5Detail.tsx`

### Files to Modify

- `client/src/App.tsx` — Ensure `/wireframes/b4-dashboard` and `/wireframes/b5-detail` routes are registered through `WireframeLayout`.
- `client/src/pages/wireframes/mock-data.ts` — Ensure at least three mock request records with varied statuses are defined.

### Testing Plan

Visual walkthrough:
- Navigate to `/wireframes/b4-dashboard`. Confirm three or more request cards appear with status badges.
- Click "View Details" on a card and confirm navigation to `/wireframes/b5-detail`.
- Toggle through all four B5 states and confirm the correct content appears for each.

### Documentation Updates

None required.
