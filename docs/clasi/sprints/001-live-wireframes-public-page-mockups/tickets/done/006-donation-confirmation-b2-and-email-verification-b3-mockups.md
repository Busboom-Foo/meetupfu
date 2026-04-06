---
id: '006'
title: Donation & Confirmation (B2) and Email Verification (B3) mockups
status: done
use-cases:
- SUC-002
depends-on:
- '001'
github-issue: ''
todo: ''
---

# Donation & Confirmation (B2) and Email Verification (B3) mockups

## Description

Build two sequential pages in the request submission flow:

**B2 — Donation & Confirmation** (`/wireframes/b2-donation`): Shows a review card summarizing the mock event request (from `mock-data.ts`), a donation encouragement section with estimated event cost and a placeholder Give Lively link, and a "Submit Request" button that navigates to B3.

**B3 — Email Verification Holding Page** (`/wireframes/b3-verification`): Shows the "check your email" message. A "View Dashboard" link navigates to `/wireframes/b4-dashboard`.

Both pages use `WireframeLayout` for the left-nav shell.

## Acceptance Criteria

### B2 — Donation & Confirmation

- [ ] Page renders at `/wireframes/b2-donation` wrapped in `WireframeLayout`.
- [ ] A review card is present showing: class name, selected date, location, group type, expected headcount, and event type (from mock data).
- [ ] A donation section is present containing: estimated event cost (e.g. "$500"), one or two sentences explaining what the donation covers, and a "Donate via Give Lively" link (the href can be `#` or a real Give Lively URL).
- [ ] A "Submit Request" button is present and navigates to `/wireframes/b3-verification` when clicked.

### B3 — Email Verification Holding Page

- [ ] Page renders at `/wireframes/b3-verification` wrapped in `WireframeLayout`.
- [ ] The page shows the message: "Check your email to verify your request."
- [ ] The page shows: "We sent a verification link to [mock email]. If you don't see it, check your spam folder."
- [ ] A "View Dashboard" link or button navigates to `/wireframes/b4-dashboard`.

## Implementation Plan

### Approach

Two separate files, both simple presentational components that read mock data and use `useNavigate` for button navigation. No state required beyond what React Router provides.

### Files to Create

- `client/src/pages/wireframes/B2Donation.tsx`
- `client/src/pages/wireframes/B3Verification.tsx`

### Files to Modify

- `client/src/App.tsx` — Ensure `/wireframes/b2-donation` and `/wireframes/b3-verification` routes are registered through `WireframeLayout`.

### Testing Plan

Visual walkthrough:
- Navigate to `/wireframes/b2-donation`. Confirm the review card and donation section are present. Click "Submit Request" and confirm navigation to `/wireframes/b3-verification`.
- On B3, confirm the email message is shown. Click "View Dashboard" and confirm navigation to `/wireframes/b4-dashboard`.

### Documentation Updates

None required.
