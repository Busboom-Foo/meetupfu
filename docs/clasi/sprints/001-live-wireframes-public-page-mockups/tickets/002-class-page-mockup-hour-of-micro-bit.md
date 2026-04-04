---
id: '002'
title: Class page mockup (Hour of Micro:bit)
status: done
use-cases:
- SUC-001
- SUC-002
depends-on:
- '001'
github-issue: ''
todo: ''
---

# Class page mockup (Hour of Micro:bit)

## Description

Reproduce the jointheleague.org class page layout for "Hour of Micro:bit — Meetup" as a static React page at `/wireframes/class-page`. This page is the entry point for the requester flow wireframe and the reference for where the A1 and A2 Astro components will embed on the real site.

The implementation should match the reference screenshot at `docs/initial-design/reference-page-full.png` in section structure and visual hierarchy. Pixel-perfect fidelity is not required — wireframe-quality CSS is acceptable.

The A1RequestDiscovery and A2EventRegistration components (built in tickets 001-03 and 001-04) are rendered inline at their designated embed points. For this ticket, placeholder boxes are sufficient at those embed points; they will be replaced when the component tickets land.

## Acceptance Criteria

- [ ] Page renders at `/wireframes/class-page` without errors.
- [ ] LeagueHeader component appears at the top of the page.
- [ ] Hero section contains the class title ("Hour of Micro:bit — Meetup"), a short description blurb, and a placeholder image area.
- [ ] "Course Overview" section is present with multi-paragraph placeholder text describing the class.
- [ ] Right-side sidebar contains: Level (Beginner), Topics (Microcontrollers, Coding), Curriculum list, and "Part of These Programs" listing Tech Club.
- [ ] "Enroll in Community Programs" CTA section is present below the main content.
- [ ] A visible embed point for the A1 Request Discovery Component exists (renders A1 component if available, otherwise a labeled placeholder box).
- [ ] A visible embed point for the A2 Event Registration Component exists in the CTA section (renders A2 component if available, otherwise a labeled placeholder box).
- [ ] A footer is present at the bottom of the page.
- [ ] Overall page section order matches the reference screenshot at `docs/initial-design/reference-page-full.png`.

## Implementation Plan

### Approach

Build `ClassPage.tsx` as a standalone page component — no WireframeLayout left-nav (this page represents jointheleague.org, not the event app). Use LeagueHeader at the top. Lay out sections in order matching the reference screenshot: header, hero, two-column content area (course overview + sidebar), CTA/embed section, footer.

For embed points: conditionally import A1RequestDiscovery and A2EventRegistration; if the components exist, render them; otherwise render a `<div className="wireframe-embed-point">` with a descriptive label.

### Files to Create

- `client/src/pages/wireframes/ClassPage.tsx`

### Files to Modify

- `client/src/App.tsx` — Ensure `/wireframes/class-page` route points to `ClassPage` (may already be done in ticket 001).

### Testing Plan

Visual comparison against `docs/initial-design/reference-page-full.png`:
- Open the mockup and reference screenshot side by side.
- Verify all major sections are present and in the correct order.
- Confirm that clicking "Continue to Request Form" in the A1 embed point (or placeholder link) navigates to `/wireframes/b1-intake`.

### Documentation Updates

None required.
