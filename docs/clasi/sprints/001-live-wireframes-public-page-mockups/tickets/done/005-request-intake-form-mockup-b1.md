---
id: '005'
title: Request Intake Form mockup (B1)
status: done
use-cases:
- SUC-002
- SUC-006
depends-on:
- '001'
github-issue: ''
todo: ''
---

# Request Intake Form mockup (B1)

## Description

Build `B1Intake.tsx` — a mockup of the Request Intake Form at `/wireframes/b1-intake`. This is the first page on the event system app (events.jointheleague.org), reached after the user selects a date and enters their email in the A1 discovery component.

The form shows all fields from FEAT-2 §3.2, pre-populated with values from `mock-data.ts` (standing in for URL parameters that the real implementation would receive). The "Review & Submit" button navigates to `/wireframes/b2-donation` — no actual form submission logic is required.

The page uses `WireframeLayout` for the left-nav shell.

## Acceptance Criteria

- [ ] Page renders at `/wireframes/b1-intake` wrapped in `WireframeLayout` with the left-nav visible.
- [ ] The following fields are pre-populated from mock data (read-only or editable): class name (read-only), selected date(s), zip code, event type (public/private), requester email.
- [ ] The following editable form fields are present:
  - [ ] Requester name (text input)
  - [ ] Group type dropdown (options: School, Girl Scout Troop, BSA Troop, Library, Other Youth Group, Public)
  - [ ] Expected headcount (number input)
  - [ ] Site selection: a searchable dropdown listing 3–4 mock registered sites from `mock-data.ts`, plus a "My location isn't listed" option
  - [ ] Site readiness dropdown (Ready to go / Needs some setup / Not sure)
  - [ ] Marketing capability (text input or checkbox)
  - [ ] Additional contacts (optional text input)
  - [ ] External registration URL (optional text input)
- [ ] When a registered site is selected from the dropdown, a read-only "Facility Details" panel appears showing mock capacity, WiFi availability, and projector availability.
- [ ] When "My location isn't listed" is selected, a free-text address field expands below the dropdown.
- [ ] A "Review & Submit" button at the bottom of the form navigates to `/wireframes/b2-donation`.
- [ ] No form validation is required (wireframe only).

## Implementation Plan

### Approach

`B1Intake.tsx` is a form component with local React state tracking the selected site (to show/hide the facility details panel) and whether "My location isn't listed" is selected (to show/hide the free-text address field). No form submission handler — the "Review & Submit" button uses `useNavigate` from react-router-dom to go to `/wireframes/b2-donation`.

Use mock data from `mock-data.ts` for the pre-populated fields and the site dropdown list.

### Files to Create

- `client/src/pages/wireframes/B1Intake.tsx`

### Files to Modify

- `client/src/App.tsx` — Ensure `/wireframes/b1-intake` is routed through `WireframeLayout`.

### Testing Plan

Visual walkthrough:
- Navigate to `/wireframes/b1-intake`.
- Confirm all pre-populated fields are present.
- Select a registered site from the dropdown and confirm the facility details panel appears.
- Select "My location isn't listed" and confirm the free-text address field appears.
- Click "Review & Submit" and confirm navigation to `/wireframes/b2-donation`.

### Documentation Updates

None required.
