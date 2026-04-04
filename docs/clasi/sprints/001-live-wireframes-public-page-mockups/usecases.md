---
sprint: "001"
status: final
---

# Sprint 001 Use Cases — Live Wireframes: Public Page Mockups

These use cases describe what a **Stakeholder** (product owner, designer, or developer evaluating the wireframes) can do with the deliverables from this sprint. They are wireframe-scoped — the actors are reviewers interacting with static mockups, not end users interacting with a live system.

---

## SUC-001: View Class Page Mockup

**Parent:** UC-001, UC-011

**Actor:** Stakeholder

**Preconditions:**
- The dev server is running (`npm run dev`).
- The stakeholder has a browser open to `localhost:5173`.

**Main Flow:**
1. Stakeholder navigates to `/wireframes/class-page`.
2. The browser renders a full-page reproduction of the jointheleague.org Hour of Micro:bit class page layout, including:
   - The League header and top navigation bar (LeagueHeader component).
   - A hero section with class title, description blurb, and a placeholder image.
   - A main content area with "Course Overview" text.
   - A right-side sidebar with Level, Topics, Curriculum, and "Part of These Programs" metadata.
   - An "Enroll in Community Programs" CTA section.
   - A footer.
3. Two annotated embed points are visible on the page:
   - One in the sidebar/main area labelled with the A1 Request Discovery Component mockup rendered inline.
   - One in the CTA section with the A2 Event Registration Component mockup rendered inline.

**Postconditions:**
- Stakeholder can see the intended integration points for the Astro components within the jointheleague.org layout.

**Acceptance Criteria:**
- [ ] Page renders at `/wireframes/class-page` without errors.
- [ ] All major sections of the reference page layout are present.
- [ ] A1 and A2 component mockups appear at their designated embed points.
- [ ] Page matches the reference screenshot at `docs/initial-design/reference-page-full.png` in structure and section order.

---

## SUC-002: Walk Through the Requester Flow (A1 → B1 → B2 → B3 → B4)

**Parent:** UC-001, UC-002, UC-003

**Actor:** Stakeholder

**Preconditions:**
- Dev server is running.
- Stakeholder is on the class page wireframe (`/wireframes/class-page`).

**Main Flow:**
1. Stakeholder sees the A1 Request Discovery Component showing an expanded list of mock available date slots.
2. Stakeholder clicks "Request This" on a date row.
3. The component expands to show the "private event" checkbox, an email input, and the "Continue to Request Form" button.
4. Stakeholder clicks "Continue to Request Form."
5. Browser navigates to `/wireframes/b1-intake` with the B1 Request Intake Form pre-populated with mock values.
6. Stakeholder clicks "Review & Submit."
7. Browser navigates to `/wireframes/b2-donation` showing the review card and donation section.
8. Stakeholder clicks "Submit Request."
9. Browser navigates to `/wireframes/b3-verification` showing the email check message.
10. Stakeholder clicks a "View Dashboard" link.
11. Browser navigates to `/wireframes/b4-dashboard` showing the mock request list.

**Postconditions:**
- Stakeholder has clicked through the complete requester flow without broken links or render errors.

**Acceptance Criteria:**
- [ ] Each step navigates to the correct next screen.
- [ ] B1 displays pre-populated mock data (class name, date, zip, email).
- [ ] B2 shows a request summary review card.
- [ ] B3 shows the verification holding message.
- [ ] B4 shows at least one mock request card with a status badge.

---

## SUC-003: View Event Registration Component States (A2)

**Parent:** UC-011, UC-027

**Actor:** Stakeholder

**Preconditions:**
- Dev server is running.
- Stakeholder navigates to `/wireframes/a2-registration`.

**Main Flow:**
1. Stakeholder sees the A2 component in "Registration Open" state: event details, remaining capacity indicator, and the guardian/child registration form.
2. Stakeholder uses a state-toggle control to switch to "Registration Full."
3. The component re-renders showing the "Event Full" badge and a waitlist signup form.
4. Stakeholder switches to "No Event Scheduled."
5. The component re-renders showing the "No upcoming event is scheduled" message with a request prompt.

**Postconditions:**
- Stakeholder has seen all three A2 states.

**Acceptance Criteria:**
- [ ] All three states render without errors.
- [ ] "Registration Open" shows the guardian name, email, phone, and child fields.
- [ ] "Registration Full" shows an "Event Full" badge and a waitlist name/email form.
- [ ] "No Event Scheduled" shows a prompt to request an event.
- [ ] The state toggle is clearly labeled and functional.

---

## SUC-004: View Private Event Date Voting (B6)

**Parent:** UC-012

**Actor:** Stakeholder

**Preconditions:**
- Dev server is running.
- Stakeholder navigates to `/wireframes/b6-voting`.

**Main Flow:**
1. Stakeholder sees the B6 page with the left-nav shell visible.
2. The page shows the class name, general location, a short description, and a list of three mock candidate dates as checkboxes.
3. A registration form is visible: name, email, and "number of kids attending" fields.
4. Stakeholder clicks "Submit."
5. The page transitions to the post-vote confirmation state: "We'll notify you when the date is confirmed."

**Postconditions:**
- Stakeholder has seen both the voting form and the post-vote confirmation.

**Acceptance Criteria:**
- [ ] Page renders at `/wireframes/b6-voting`.
- [ ] Three mock candidate dates appear as checkboxes.
- [ ] Submitting shows the thank-you confirmation state.
- [ ] Left-nav is visible and "My Requests" link is present.

---

## SUC-005: View Event Detail Page States (B5)

**Parent:** UC-005

**Actor:** Stakeholder

**Preconditions:**
- Dev server is running.
- Stakeholder navigates to `/wireframes/b5-detail`.

**Main Flow:**
1. Stakeholder sees the B5 page defaulting to "Confirmed" status: class name, confirmed date, instructor first name, location, registration link, and registration count.
2. Stakeholder uses a state-toggle to switch to "Discussing."
3. Page re-renders with an updated status badge and a coordination-in-progress note; registration link is absent.
4. Stakeholder switches to "Completed."
5. Page re-renders showing an attendance summary section.
6. Stakeholder switches to "Cancelled."
7. Page re-renders showing a cancellation reason.

**Postconditions:**
- Stakeholder has seen all four B5 status states.

**Acceptance Criteria:**
- [ ] All four states (Confirmed, Discussing, Completed, Cancelled) render without errors.
- [ ] Status badge updates correctly in each state.
- [ ] Registration link is present only in the Confirmed state.
- [ ] Attendance summary is present only in the Completed state.
- [ ] Cancellation reason is present only in the Cancelled state.

---

## SUC-006: Navigate via Left-Nav Between Event App Screens

**Parent:** UC-005

**Actor:** Stakeholder

**Preconditions:**
- Dev server is running.
- Stakeholder is on any B-series wireframe page (B1–B6).

**Main Flow:**
1. Stakeholder sees the left-nav sidebar with: "My Requests," "Request an Event," and "Help / FAQ."
2. Stakeholder clicks "My Requests."
3. Browser navigates to `/wireframes/b4-dashboard`.
4. Stakeholder clicks "Request an Event" in the left-nav.
5. Browser navigates to `/wireframes/class-page`.
6. Stakeholder uses the left-nav to move between screens; the active link is highlighted on each page.

**Postconditions:**
- Left-nav navigation works consistently across all B-series pages.

**Acceptance Criteria:**
- [ ] Left-nav is present on all B-series pages (B1–B6).
- [ ] "My Requests" links to `/wireframes/b4-dashboard`.
- [ ] "Request an Event" links to `/wireframes/class-page`.
- [ ] The currently active nav item is visually distinguished on each page.
- [ ] No broken links in the left-nav.
