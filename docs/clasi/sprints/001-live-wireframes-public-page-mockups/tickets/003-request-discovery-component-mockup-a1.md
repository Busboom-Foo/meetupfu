---
id: '003'
title: Request Discovery Component mockup (A1)
status: done
use-cases:
- SUC-002
depends-on:
- '001'
github-issue: ''
todo: ''
---

# Request Discovery Component mockup (A1)

## Description

Build `A1RequestDiscovery.tsx` — a mockup of the Request Discovery Component that will eventually be embedded as an Astro component on jointheleague.org class pages. For this wireframe, the component is rendered directly on the class page (`/wireframes/class-page`) and also accessible standalone at `/wireframes/a1`.

The component uses progressive disclosure to show three states in sequence, all driven by local React state (no API calls):

1. **Initial state:** Zip code input with a prompt. In the wireframe, the "Enter" action immediately advances to the expanded state (no actual zip code validation).
2. **Expanded state:** A list of 3–5 mock available date slots from `mock-data.ts`. Each row shows class name, date, time, and general area with a "Request This" button.
3. **Date selected state:** After clicking "Request This," the component expands further to show a "This is a private event" checkbox, an email input, and a "Continue to Request Form" button. Clicking "Continue" navigates to `/wireframes/b1-intake`.

## Acceptance Criteria

- [ ] Component renders at `/wireframes/a1` as a standalone page and is imported/embedded in `ClassPage.tsx`.
- [ ] Initial state shows a zip code input and a submit button or "Enter" trigger.
- [ ] After zip entry (any value), the component transitions to the expanded state showing the mock date list from `mock-data.ts`.
- [ ] Each date row shows class name, date, time, and general area.
- [ ] Clicking "Request This" on a row transitions to the date-selected state for that row.
- [ ] The date-selected state shows: the chosen date (highlighted or restated), a "This is a private event" checkbox, an email input, and a "Continue to Request Form" button.
- [ ] When the "private event" checkbox is checked, an inline notice appears explaining group eligibility requirements.
- [ ] Clicking "Continue to Request Form" navigates to `/wireframes/b1-intake`.
- [ ] All three states render without errors.

## Implementation Plan

### Approach

Use `useState` in `A1RequestDiscovery.tsx` to manage a `step` variable with values `'initial' | 'dates' | 'selected'` and a `selectedDate` value. Each state renders a different sub-section of the component. Transitions happen on button clicks without any async operations.

### Files to Create

- `client/src/pages/wireframes/A1RequestDiscovery.tsx`

### Files to Modify

- `client/src/pages/wireframes/ClassPage.tsx` — Replace the A1 embed point placeholder with `<A1RequestDiscovery />`.
- `client/src/App.tsx` — Ensure `/wireframes/a1` route is registered as a standalone page (wrapping the component in a minimal page shell without WireframeLayout).

### Testing Plan

Visual walkthrough:
- Navigate to `/wireframes/class-page` or `/wireframes/a1`.
- Enter any zip code and confirm the date list appears.
- Click "Request This" and confirm the continuation form appears.
- Check the private event checkbox and confirm the notice appears.
- Click "Continue to Request Form" and confirm navigation to `/wireframes/b1-intake`.

### Documentation Updates

None required.
