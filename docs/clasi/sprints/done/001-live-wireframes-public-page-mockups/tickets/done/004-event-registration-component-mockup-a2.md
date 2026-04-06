---
id: '004'
title: Event Registration Component mockup (A2)
status: done
use-cases:
- SUC-003
depends-on:
- '001'
github-issue: ''
todo: ''
---

# Event Registration Component mockup (A2)

## Description

Build `A2EventRegistration.tsx` — a mockup of the Event Registration Component that will eventually be embedded as an Astro component on individual jointheleague.org class pages. For this wireframe, the component is accessible standalone at `/wireframes/a2-registration` and is embedded on the class page.

The component renders one of three states determined by a demo toggle control at the top of the standalone page (or passed as a prop when embedded):

1. **Registration open:** Event details (date, time, location), a remaining capacity indicator (e.g. "12 spots remaining"), and a registration form with fields for guardian name, guardian email, guardian phone, one or more children (name and age each), and a volunteer checkbox.
2. **Registration full:** Event details with an "Event Full" badge, and a waitlist signup form (name and email fields with a "Join Waitlist" button).
3. **No event scheduled:** A message "No upcoming Hour of Micro:bit event is scheduled near you." with a "Request an Event" link pointing to `/wireframes/a1` or `/wireframes/class-page`.

## Acceptance Criteria

- [ ] Component renders at `/wireframes/a2-registration` as a standalone page.
- [ ] The standalone page includes a clearly labeled state toggle (three buttons or a select) for switching between the three states.
- [ ] "Registration Open" state shows event details, a capacity indicator, and a form with: guardian name, guardian email, guardian phone, at least one child row (name + age), and a "Register" button.
- [ ] Child rows can be added with an "Add another child" button (at least one child row is pre-shown; the button adds another).
- [ ] "Registration Full" state shows an "Event Full" badge, event details, and a waitlist form (name, email, "Join Waitlist" button).
- [ ] "No Event Scheduled" state shows the appropriate message and a link back to the request discovery flow.
- [ ] All three states render without errors.
- [ ] Component is importable and used in `ClassPage.tsx` at the A2 embed point.

## Implementation Plan

### Approach

`A2EventRegistration.tsx` accepts an optional `initialState` prop (`'open' | 'full' | 'none'`, default `'open'`). When rendered standalone at `/wireframes/a2-registration`, the page wraps it with local state for the toggle. When embedded in `ClassPage.tsx`, it is called without the toggle.

Use mock event data from `mock-data.ts` for event details (date, time, location, capacity).

### Files to Create

- `client/src/pages/wireframes/A2EventRegistration.tsx`

### Files to Modify

- `client/src/pages/wireframes/ClassPage.tsx` — Replace the A2 embed point placeholder with `<A2EventRegistration />`.
- `client/src/App.tsx` — Ensure `/wireframes/a2-registration` route is registered.

### Testing Plan

Visual walkthrough:
- Navigate to `/wireframes/a2-registration`.
- Toggle through all three states and confirm the correct content renders for each.
- In "Registration Open," click "Add another child" and confirm a new child row appears.
- In "No Event Scheduled," confirm the "Request an Event" link resolves.

### Documentation Updates

None required.
