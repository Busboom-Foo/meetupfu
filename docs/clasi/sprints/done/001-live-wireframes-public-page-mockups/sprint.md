---
id: "001"
title: "Live Wireframes — Public Page Mockups"
status: planning
branch: sprint/001-live-wireframes-public-page-mockups
use-cases: []
---
<!-- CLASI: Before changing code or making plans, review the SE process in CLAUDE.md -->

# Sprint 001: Live Wireframes — Public Page Mockups

## Goals

Create live, navigable HTML wireframes of the key public-facing screens for the Tech Club Event Request System. These are low-function mockups — static pages served by the existing Express/Vite dev server with hardcoded sample data. No backend logic, no API calls, no database integration. The wireframes serve as a visual specification that stakeholders can click through in a browser.

## Problem

The design documents describe screens in prose and flow diagrams, but stakeholders need to see and interact with the actual pages before committing to full implementation. A clickable wireframe catches layout issues, flow gaps, and UX problems early.

## Solution

Build static React pages within the existing Vite client app that render each key screen with realistic mock data. Pages link to each other to demonstrate navigation flow. Start with a faithful mockup of the existing jointheleague.org class page (Hour of Micro:bit — Meetup) as the reference for the Astro component integration points, then build out the event system screens.

## Success Criteria

- All screens render in the browser via `npm run dev`
- Pages are navigable — links between screens work
- The class page mockup visually matches the reference (docs/initial-design/reference-page-full.png)
- Stakeholder can walk through the requester flow end-to-end by clicking

## Scope

### In Scope

- **Class page mockup** — Faithful reproduction of jointheleague.org/classes/hour-of-microbit-meetup layout, showing where the Request Discovery (A1) and Event Registration (A2) components would embed
- **Screen A1: Request Discovery Component** — Zip code entry, available dates list, private event checkbox, email input, continue button
- **Screen A2: Event Registration Component** — Three states: registration open, full/waitlist, no event scheduled
- **Screen B1: Request Intake Form** — Pre-populated fields, site selector, all form fields from FEAT-2
- **Screen B2: Donation & Confirmation** — Review card, donation encouragement, submit button
- **Screen B3: Email Verification Holding Page** — Check your email message
- **Screen B4: Requester Dashboard** — Request list with status badges
- **Screen B5: Event Detail / Status Page** — Full event details by status
- **Screen B6: Private Event Date Voting** — Date checkboxes, registration fields
- **Left-nav layout shell** for event system app screens (B1–B6)
- Hardcoded mock data (no API calls)
- Navigation links between screens

### Out of Scope

- Backend API endpoints
- Database schema or Prisma models
- Authentication (Pike13, magic link)
- Form submission logic
- External integrations (Meetup, Asana, Pike13, SES)
- Admin and instructor screens
- Mobile-responsive polish (desktop-first wireframes)
- Production styling/branding (wireframe-quality CSS)

## Test Strategy

Lightweight for wireframes: visual inspection and navigation smoke tests. A single Playwright E2E test that visits each page and confirms it renders without errors. No unit tests for static mockup pages.

## Architecture Notes

- All wireframe pages live under `client/src/pages/wireframes/` to keep them isolated from future production code
- Use React Router for navigation between screens
- Mock data in a shared `client/src/pages/wireframes/mock-data.ts` file
- The class page mockup reproduces the jointheleague.org layout as a standalone page (not an actual Astro component — that comes later)
- Left-nav shell component wraps all B-series screens

## GitHub Issues

None yet.

## Definition of Ready

Before tickets can be created, all of the following must be true:

- [ ] Sprint planning documents are complete (sprint.md, use cases, architecture)
- [ ] Architecture review passed
- [ ] Stakeholder has approved the sprint plan

## Tickets

| # | Title | Depends On | Group |
|---|-------|------------|-------|
| 001 | Set up wireframe routing and layout shells | — | 1 |
| 002 | Class page mockup (Hour of Micro:bit) | 001 | 2 |
| 003 | Request Discovery Component mockup (A1) | 001 | 2 |
| 004 | Event Registration Component mockup (A2) | 001 | 2 |
| 005 | Request Intake Form mockup (B1) | 001 | 2 |
| 006 | Donation & Confirmation (B2) and Email Verification (B3) mockups | 001 | 2 |
| 007 | Requester Dashboard (B4) and Event Detail (B5) mockups | 001 | 2 |
| 008 | Private Event Date Voting mockup (B6) | 001 | 2 |
| 009 | Navigation smoke test (Playwright) | 002, 003, 004, 005, 006, 007, 008 | 3 |

**Groups**: Tickets in the same group can execute in parallel.
Groups execute sequentially (1 before 2, etc.).

- **Group 1**: Foundation — routing, layout shells, mock data. Must complete before any page work begins.
- **Group 2**: All wireframe pages and components. Independent of each other, all depend on Group 1. Can run fully in parallel.
- **Group 3**: Playwright smoke test. Runs after all pages are complete.
