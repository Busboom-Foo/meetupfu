---
id: 008
title: Private Event Date Voting mockup (B6)
status: done
use-cases:
- SUC-004
- SUC-006
depends-on:
- '001'
github-issue: ''
todo: ''
---

# Private Event Date Voting mockup (B6)

## Description

Build `B6Voting.tsx` — a mockup of the Private Event Date Voting page at `/wireframes/b6-voting`. This page is accessed via a shareable registration link for private events, letting invitees vote on which candidate dates work for them and register their attendance.

The page shows two states driven by local React state:

1. **Voting state (default):** Class name, general location, a short class description, a list of three mock candidate dates as checkboxes, and a registration form (name, email, number of kids attending) with a "Submit" button.
2. **Confirmation state:** After clicking "Submit," the page transitions to a thank-you message: "Thank you! We'll notify you when the date is confirmed."

The page uses `WireframeLayout` for the left-nav shell.

## Acceptance Criteria

- [ ] Page renders at `/wireframes/b6-voting` wrapped in `WireframeLayout`.
- [ ] Voting state shows: class name ("Hour of Micro:bit"), general location, a 2–3 sentence class description, and three mock candidate dates as labeled checkboxes.
- [ ] The registration form includes: name (text input), email (text input), and "Number of kids attending" (number input).
- [ ] A "Submit" button is present.
- [ ] Clicking "Submit" transitions to the confirmation state.
- [ ] Confirmation state shows the thank-you message.
- [ ] Both states render without errors.

## Implementation Plan

### Approach

`B6Voting.tsx` uses a single `useState` boolean (`submitted`) to toggle between the voting form and the confirmation message. Candidate dates come from `mock-data.ts`. No form validation required.

### Files to Create

- `client/src/pages/wireframes/B6Voting.tsx`

### Files to Modify

- `client/src/App.tsx` — Ensure `/wireframes/b6-voting` route is registered through `WireframeLayout`.
- `client/src/pages/wireframes/mock-data.ts` — Ensure three mock candidate dates are defined (if not already done in ticket 001).

### Testing Plan

Visual walkthrough:
- Navigate to `/wireframes/b6-voting`. Confirm the voting form and all three candidate date checkboxes are present.
- Click "Submit" and confirm the confirmation message appears.
- Confirm the left-nav is visible on both states.

### Documentation Updates

None required.
