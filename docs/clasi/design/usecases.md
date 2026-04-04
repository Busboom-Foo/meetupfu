# Tech Club Event Request System — Use Cases

**The League of Amazing Programmers**
April 2026

---

## UC-001: Browse Requestable Classes and Check Availability

**Actor:** Requester (parent, teacher, scout leader, group organizer)

**Preconditions:**
- User is on jointheleague.org on a page hosting the Request Discovery Component (A1), either a class page or a "Free Events" listing page.

**Main Flow:**
1. User sees the Request Discovery Component with a zip code input: "Enter your zip code to see available Tech Club events near you."
2. If the user has a recognized requester account (magic link session active), their stored zip code is pre-populated.
3. User enters a zip code and submits.
4. System checks instructor coverage for the area across all requestable classes.
5. If instructors are available, the component expands to show:
   a. Upcoming confirmed events near the zip (with date, class name, location, and "Register" links).
   b. Available date/time slots to request (approximately 5–7 days to 6 weeks out), each row showing class name, date, time, and general area.
6. User can click "Register" on a confirmed event to go to Screen A2 (UC-004), or click "Request This" on an available date to begin the request flow (UC-002).

**Postconditions:**
- User sees either available request dates or is informed no instructors are available in their area.
- User's zip code is stored on their account for future pre-population (if account exists).

**Error / Alternate Flows:**
- **No instructors available in range:** Component shows a message explaining no instructors serve that area for the selected class. Suggests checking back or trying a different class. No date list shown.
- **No confirmed events and no available dates:** Only the "request" prompt is shown; confirmed events section is omitted.

---

## UC-002: Select a Date Window and Begin Request

**Actor:** Requester

**Preconditions:**
- User is on the Request Discovery Component (A1) after entering a zip code and seeing available date windows (UC-001 step 5b).

**Main Flow:**
1. User clicks "Request This" on an available date/time slot row.
2. Component expands with:
   - A "This is a private event" checkbox.
   - An email input field.
   - A "Continue to Request Form →" button.
3. If user checks "This is a private event," a notice appears explaining minimum headcount requirements and eligible group types (school groups, scout troops, youth organizations — not birthday parties).
4. User enters their email address.
5. User clicks "Continue to Request Form →."
6. User is redirected to the event system app (events.jointheleague.org, Screen B1) with class slug, selected date(s), zip code, event type (public/private), and email passed as URL parameters.

**Postconditions:**
- User lands on the Request Intake Form (UC-003) with pre-populated fields.

**Error / Alternate Flows:**
- **User does not enter email:** Validation prevents continuation; email is required.
- **User selects "private event" but is not eligible:** System shows the eligibility note; this is informational, not a hard gate at this step. Eligibility is evaluated at intake.

---

## UC-003: Complete and Submit an Event Request

**Actor:** Requester

**Preconditions:**
- User has arrived at Screen B1 (Request Intake Form) from the discovery component, carrying class slug, date(s), zip, event type, and email as URL parameters.

**Main Flow:**
1. Screen B1 pre-populates: class name (read-only), selected date(s), zip code, event type (public/private), requester email.
2. User fills in the remaining fields:
   - Requester name
   - Group type (dropdown: school, Girl Scout troop, BSA troop, library, other youth group, public)
   - Expected headcount
   - Site selection: searchable dropdown of registered sites near the zip. User can also choose "My location isn't listed" to expand a free-text address field.
   - Site readiness (dropdown: ready to go / needs some setup / not sure)
   - Marketing capability
   - Additional contacts (optional, e.g. school principal email)
   - External registration URL (optional, for hosts with their own signup system)
3. If user selects a registered site, facility details (capacity, WiFi, projector) are shown as read-only context.
4. User clicks "Review & Submit" to proceed to Screen B2.
5. Screen B2 shows a summary review card plus donation encouragement: estimated event cost, explanation of what the donation covers, and a Give Lively link (carrying the request ID parameter for tracking).
6. User clicks "Submit Request."
7. System saves the request in `unverified` status and sends a verification email to the requester's email address.
8. User is redirected to Screen B3 (email verification holding page).

**Postconditions:**
- Request exists in the database in `unverified` status.
- Verification email has been sent to requester.
- One-hour verification window is active.

**Error / Alternate Flows:**
- **Required fields missing:** Validation on B1 prevents advancing to B2.
- **Rate limit reached:** If the requester's email already has 10 active requests, the system prevents submission and informs the user.

---

## UC-004: Verify Email and Confirm Request

**Actor:** Requester

**Preconditions:**
- Request exists in `unverified` status.
- Requester has received the verification email.
- Verification window has not yet expired (within one hour of submission).

**Main Flow:**
1. Requester clicks the verification link in the email.
2. System validates the token and confirms the request is still within the one-hour window.
3. Request status moves from `unverified` to `new`.
4. System generates a dedicated email address for the request (e.g. `request-4827@events.jointheleague.org`).
5. System creates an Asana task for the request.
6. System sends notification emails to admins and matched instructor(s).
7. If a registered site was selected, the site representative is added to the email thread participants.
8. A requester account is created (or matched, if the email already has an account), keyed to the requester's email.
9. User is redirected to Screen B4 (Requester Dashboard) with a success banner.

**Postconditions:**
- Request is in `new` status with a dedicated email address.
- Asana task exists.
- Requester has an account and is logged in via magic link session.
- Coordination can begin via the email thread.

**Error / Alternate Flows:**
- **Token expired (user clicks link after one hour):** System shows the expiration message: "Your request has expired" with a "Start Over" link. Nothing is created.
- **User is still on B3 when the hour expires:** The page dynamically updates to show "Your request has expired" with a "Start Over" link.
- **Token already used:** Same expiration message shown.

---

## UC-005: View Request Status (Requester Dashboard)

**Actor:** Requester

**Preconditions:**
- Requester has at least one verified request (account exists, keyed to email).

**Main Flow:**
1. Requester clicks a link in a status-update email or navigates to the dashboard from the app.
2. If not authenticated, a magic link email is sent to the requester's address; the requester clicks the link to authenticate.
3. Screen B4 (Requester Dashboard) shows all of the requester's event requests, each with: class name, status badge, date (confirmed date or "pending"), location, and a link to the event detail page.
4. For confirmed events, the dashboard shows a shareable registration link and current registration count.
5. Requester clicks through to Screen B5 (Event Detail / Status Page) for a specific request.
6. Screen B5 shows full details varying by status:
   - All statuses: class name, requested dates, location, group info, event type, status badge, timeline of status changes.
   - Discussing / Dates Proposed: "Coordination is happening via email. Check your email for updates."
   - Confirmed: confirmed date, instructor first name, location details, shareable registration link (and Meetup link for public events), registration count, native vs. Meetup breakdown if applicable.
   - Completed: attendance summary (if reconciliation was done).
   - Cancelled: reason (if provided).

**Postconditions:**
- Requester has viewed the current status of their request(s).

**Error / Alternate Flows:**
- **No requests:** Dashboard shows an empty state with a prompt to request an event.
- **Magic link expired:** User can request a new magic link.

---

## UC-006: Coordinate an Event via Email Thread

**Actor:** Requester, Admin, Instructor, Site Representative (all via email)

**Preconditions:**
- Request is in `new` status or later, with a dedicated email address.
- All relevant parties (requester, admins, matched instructor, site representative if applicable, additional contacts) are participants on the thread.

**Main Flow:**
1. Any participant sends email to the request's dedicated address (e.g. `request-4827@events.jointheleague.org`).
2. Amazon SES receives the message and routes it to the app via SNS/Lambda.
3. The message is stored in the app's database linked to the event request.
4. The AI agent reads the message and extracts: status-relevant information (e.g. confirmed venue and date), action items (e.g. "can you send the flyer template?"), decisions (e.g. "let's go with the Saturday session"), sentiment/risk signals, host registration counts.
5. High-confidence extractions update the Asana task and event request record automatically. Ambiguous content is flagged for admin review.
6. All participants receive the reply as if it were a normal email thread.
7. Admin moves the request through statuses (discussing → dates_proposed → confirmed) via the event app or Asana (bidirectional sync keeps both in sync).

**Postconditions:**
- Email messages are stored in the database.
- Asana task reflects extracted updates.
- Request status advances as coordination progresses.

**Error / Alternate Flows:**
- **AI extraction is ambiguous:** Item is flagged for admin review; no automatic update occurs.
- **Status change in Asana:** Asana webhook propagates the change back to the event app.
- **Participant added late:** Admin can add a participant to the thread (behavior for thread continuity is an open question — see §11 of specification).

---

## UC-007: Accept or Decline Instructor Assignment

**Actor:** Instructor

**Preconditions:**
- A request has been submitted that matches the instructor's topic, geography, and availability.
- Instructor has received an email notification about the match.

**Main Flow:**
1. Instructor receives an email notification asking them to accept or decline the assignment.
2. Instructor clicks accept or decline link in the email (or logs in to the app to respond).
3. **If accepted:** Instructor is added to the request's email thread. The request proceeds with this instructor assigned. The instructor can view the event in the app.
4. **If declined:** System moves to the next matched instructor (if any) and sends them a notification.

**Postconditions:**
- Instructor is assigned to the event (accept) or removed from consideration (decline).
- Event coordination can proceed with the assigned instructor.

**Error / Alternate Flows:**
- **Instructor does not respond:** System sends reminder emails on a configurable schedule. After a configurable timeout, the system moves to the next matched instructor.
- **No other instructors available:** Admin is notified. Situation requires manual handling.

---

## UC-008: Set Up Instructor Profile

**Actor:** Instructor

**Preconditions:**
- Instructor has a Pike13 account and credentials.

**Main Flow:**
1. Instructor logs in to the event app via Pike13 OAuth.
2. On first login, the app presents the profile setup form.
3. Instructor enters: topics they teach (from a list of class slugs from content.json), home zip code, maximum travel time (or an explicit list of service zip codes), and whether they are currently active (taking requests).
4. Instructor saves their profile.
5. Instructor signals availability by creating appointments in Pike13 using Pike13's existing calendar UI. The event app reads these via the Pike13 API.

**Postconditions:**
- Instructor profile is stored in Postgres keyed to their Pike13 user ID.
- Instructor's availability is readable by the matching algorithm via Pike13 API.

**Error / Alternate Flows:**
- **Profile already exists:** Profile setup is skipped; instructor goes directly to their dashboard or my events view.
- **No topics selected:** Instructor is not matched to any requests until topics are set.

---

## UC-009: Send and Complete Site Registration

**Actor:** Admin (sends invitation); Site Representative (completes registration)

**Preconditions:**
- Admin has the site name and the representative's email address.

**Main Flow:**
1. Admin opens the admin dashboard and navigates to Sites.
2. Admin creates a new site registration invitation, entering the site name and representative's email.
3. System generates a tokenized registration URL (single-use, expires in 7 days by default) and sends it to the representative via email.
4. Site representative clicks the link.
5. System validates the token and presents the registration form.
6. Representative fills in: site name, address, type (school, library, science center, other non-profit), representative name and contact info, facility details (room capacity, WiFi availability, power outlet count, projector/screen availability, access restrictions or scheduling notes).
7. Representative submits the form.
8. System creates a site record in `active` status and a site representative account tied to the rep's email address.
9. The site is now selectable in the event request intake form and has a public page with a "Site Manager Login" link.

**Postconditions:**
- Registered site exists in `active` status.
- Site representative account exists, tied to the rep's email.
- Site appears as an option in the event request location picker.

**Error / Alternate Flows:**
- **Token expired:** Admin can resend or generate a new invitation link from the admin dashboard.
- **Representative already has an account:** The existing account is linked to the new site.

---

## UC-010: Log In as Site Representative

**Actor:** Site Representative

**Preconditions:**
- Site representative account exists (created during site registration).

**Main Flow (default — magic link):**
1. Representative navigates to the site's public page in the system.
2. Representative clicks the "Site Manager Login" link.
3. System sends a magic link email to the representative's email address on file.
4. Representative clicks the link in the email (valid for 24 hours by default).
5. Representative is authenticated and can view/edit site details and see upcoming and past events at their site.

**Alternate Flow (Google OAuth):**
1. If the representative has previously linked a Google account to their site rep account, they can click "Sign in with Google" for direct login without waiting for an email.

**Postconditions:**
- Site representative is authenticated.
- Representative can view and update site details and see events at their site.

**Error / Alternate Flows:**
- **Magic link expired:** Representative can request a new magic link by clicking the "Site Manager Login" link again.

---

## UC-011: Register for a Public Event (Native Registration)

**Actor:** Attendee (parent/guardian)

**Preconditions:**
- A public event is confirmed and native registration is enabled.
- The Event Registration Component (Screen A2) is in "Registration open" state.
- The event has remaining capacity (`slots_remaining > 0`).

**Main Flow:**
1. Attendee finds the event via the jointheleague.org class page, Meetup, an email link, or the discovery component.
2. Screen A2 shows event details (date, time, location), remaining capacity indicator, and the registration form.
3. Attendee fills in:
   - Guardian name, email, phone number
   - One or more children: name and age for each
   - Role: attending (default) or volunteering
4. Attendee clicks "Register."
5. System creates a native registration record linked to the event.
6. System recomputes combined capacity and, if necessary, adjusts the Meetup event's RSVP limit via API.
7. Attendee sees a confirmation message with event details and a calendar link.

**Postconditions:**
- Registration record exists in the database with `source = native`.
- Unified capacity count is updated.
- Meetup RSVP limit is adjusted if needed.

**Error / Alternate Flows:**
- **Event is full (slots_remaining = 0):** Screen A2 shows the "Registration full" state with a waitlist signup form. Attendee can submit their name and email to join the waitlist.
- **No event scheduled:** Screen A2 shows the "No event scheduled" state with a prompt to request an event.
- **Volunteer registration:** Volunteer does not list a child. Volunteer does not count toward the event capacity.

---

## UC-012: Vote on Dates for a Private Event

**Actor:** Attendee (invited member of a private group)

**Preconditions:**
- A private event is confirmed or in dates_proposed status.
- The requester has distributed the shareable registration link to their group.
- Voting deadline has not passed.

**Main Flow:**
1. Attendee clicks the shareable registration link.
2. Screen B6 shows: class name, general location, description from content.json, and a list of candidate dates with checkboxes ("Check all dates you can attend").
3. Attendee checks all dates they can attend.
4. Attendee fills in: name, email, number of kids attending.
5. Attendee clicks "Submit."
6. System records the registration with the selected available dates.
7. Attendee sees a thank-you message: "We'll notify you when the date is confirmed."

**Postconditions:**
- Registration record exists linked to the event with the attendee's available dates.
- System may trigger date selection logic if minimum headcount is met.

**Error / Alternate Flows:**
- **Minimum headcount met after this registration:** System auto-selects the date (or flags for admin confirmation) and notifies the requester and admin. (UC-013 handles date finalization.)
- **Voting deadline passed:** Screen B6 shows the confirmed date or a message that voting is closed.

---

## UC-013: Finalize Date for a Private Event

**Actor:** System (automatic) or Admin

**Preconditions:**
- Private event has at least one candidate date with registrations.
- Either a date has met the minimum headcount threshold, or the voting deadline has passed.

**Main Flow:**
1. System evaluates registrations per candidate date when minimum headcount is met:
   - If exactly one date meets the threshold, that date is auto-selected.
   - If multiple dates meet the threshold, the date with the highest registration count is selected (or admin picks via the event app).
2. System notifies the requester and admin that a date has been finalized.
3. System sends an iCal invite via email to all registrants who selected the finalized date.
4. System sends a notification to registrants who did not select the finalized date: "The event was scheduled for [date]. We hope to see you at a future event."
5. Event is added to the League's internal Google Calendar.

**Postconditions:**
- Event has a confirmed date.
- All relevant registrants have been notified.
- iCal invites sent to confirmed attendees.
- Event on internal Google Calendar.

**Error / Alternate Flows:**
- **No date meets the minimum headcount by the deadline:** System notifies the requester and admin. Event may be cancelled or rescheduled.
- **Admin selects date manually:** Admin uses the event app to pick the date; system then handles iCal and notifications.

---

## UC-014: Create a Public Event on Meetup

**Actor:** System (automatic upon event confirmation)

**Preconditions:**
- Event request has been confirmed (status = `confirmed`).
- Event type is public.

**Main Flow:**
1. System uses the class's group mapping from groups.json to determine the appropriate Meetup group (e.g. tech-club/robot → the-league-tech-club).
2. System creates a Meetup event via the Meetup API with the event details (title, date, location, description).
3. If the event request has an external registration URL, the Meetup event description includes a prominent hyperlink near the top: "This event requires registration with the host: [Host Registration](url)".
4. The Meetup event description includes a link to the native registration page on jointheleague.org.
5. The Meetup event link is stored on the event request record and displayed to the requester in the event app.
6. The system activates the native registration endpoint for the event.
7. Event is added to the League's internal Google Calendar.

**Postconditions:**
- Meetup event exists and is live on the League's Meetup group.
- Native registration endpoint is active.
- Meetup event link is stored and visible to the requester.
- Event is on the internal Google Calendar.

**Error / Alternate Flows:**
- **No Meetup group mapping for this class:** Admin is notified; Meetup event creation is blocked until mapping is resolved (open question — see §11 of specification).
- **Meetup API error:** System logs the error and notifies admin; event proceeds without a Meetup listing until the issue is resolved.

---

## UC-015: Sync Meetup RSVPs and Update Capacity

**Actor:** System (automated periodic job)

**Preconditions:**
- A public event is confirmed with a Meetup event ID.
- The event date has not yet passed.

**Main Flow:**
1. System periodically queries the Meetup API for RSVP data for the event.
2. For each RSVP, system applies the capacity heuristic:
   - Guest count of 1 → 1 kid
   - Guest count of 2+ → total minus 1 (the adult), remainder are kids
3. System checks for likely duplicates between Meetup RSVPs and native registrations using name matching. Flagged duplicates are not double-counted.
4. System recomputes: `kids_registered_native + kids_estimated_meetup = total_kids`, then `event_capacity - total_kids = slots_remaining`.
5. System updates the Meetup event's RSVP limit: `slots_remaining` in kids, converted back to a Meetup guest limit by adding one estimated adult per remaining kid slot.
6. If `slots_remaining = 0`, the native registration form updates to show the event as full (waitlist mode).

**Postconditions:**
- Unified capacity count is current.
- Meetup RSVP limit is synchronized with remaining capacity.
- Native registration form reflects current availability.

**Error / Alternate Flows:**
- **Meetup API unavailable:** System retries and logs the error; capacity is not updated until the next successful sync.
- **Duplicate flagged:** Duplicate is not double-counted; admin may review flagged duplicates.

---

## UC-016: Send Registration Digest Email

**Actor:** System (automated periodic job)

**Preconditions:**
- Event is confirmed and registration is active (public or private).

**Main Flow:**
1. System generates a registration digest for the event:
   - Native registrations: exact list with guardian names, child counts, and totals.
   - Meetup RSVPs (public events): estimated kid count with the heuristic applied.
   - Combined total and remaining capacity.
2. System sends the digest to the event's dedicated email thread (all participants receive it).
3. If the event has an external registration URL, the digest includes a soft ask for the host to share their own total registration count including League registrations.

**Postconditions:**
- All event thread participants have received the latest registration summary.

**Error / Alternate Flows:**
- **Email send failure:** System retries and logs the error.

---

## UC-017: Reconcile Attendance After an Event

**Actor:** Instructor or Admin

**Preconditions:**
- Event date has passed.
- Event is in `confirmed` status (or the instructor/admin has opened the reconciliation view).
- Instructor/admin is authenticated via Pike13 OAuth.

**Main Flow:**
1. Instructor opens the attendance reconciliation view for the event (from the "Attendance" section of the left-nav).
2. View shows all native registrations (guardian + children) and Meetup RSVPs (by name, where available).
3. For each registered child, instructor marks: **showed up** or **no-show**.
4. Instructor enters a count for **additional kids** (walk-ins not on any list).
5. Instructor submits the reconciliation.
6. System computes: `confirmed_attendees = marked_as_showed_up + additional_kids`, `no_shows = marked_as_no_show`, `attendance_rate = confirmed_attendees / total_registered`.
7. Event status transitions to `completed`.
8. The post-event follow-up email is queued (UC-018).

**Postconditions:**
- Attendance reconciliation record exists in the database.
- Event status is `completed`.
- Attendance summary is available on the event detail page.
- Post-event follow-up email is queued.

**Error / Alternate Flows:**
- **Instructor does not complete reconciliation:** Admin can manually mark the event complete, or a time-based trigger fires 72 hours after the event date.
- **Admin completes reconciliation:** Same flow applies; any instructor/admin can submit it.

---

## UC-018: Send Post-Event Follow-Up Email

**Actor:** System (automated, triggered by `completed` status transition)

**Preconditions:**
- Event status has transitioned to `completed`.
- Requester email is on record.
- Event is not cancelled (`completed` events only, not `cancelled`).

**Main Flow:**
1. System waits up to 48 hours after the `completed` status transition.
2. System checks the event request's `donation_status`.
3. **If `donation_status = none`:**
   - System generates a follow-up email using the class-specific follow-up template (or the default fallback if no class-specific template exists).
   - Email content: thank-you for organizing, templated class description, placeholder images, links to student project examples or class resources, donation ask with estimated event cost and a Give Lively link (carrying the request ID parameter for tracking).
4. **If `donation_status = pre_event`:**
   - System generates the follow-up email with: thank-you for organizing and donating, same templated class content and images, no donation ask, softer CTA (share the League with others, link to volunteer page, link to upcoming events).
5. System sends the email to the primary requester only.
6. System records `followup_email_sent_at` on the event request.

**Postconditions:**
- Follow-up email has been sent to the requester.
- `followup_email_sent_at` is set on the event request.

**Error / Alternate Flows:**
- **Event was cancelled:** Follow-up email is not sent. Only `completed` events trigger this flow.
- **Donation recorded after `completed` but before the 48-hour window:** If `donation_status` updates from `none` to `pre_event` within the 48-hour window, the email content reflects the updated status.
- **Email send failure:** System retries and logs the error.

---

## UC-019: Track and Record a Donation

**Actor:** System (automated, triggered by Give Lively notification)

**Preconditions:**
- A donation has been made via Give Lively by a requester.
- Give Lively notification has been received (via Zapier webhook or API polling).

**Main Flow:**
1. System receives a donation notification with donor email and amount.
2. System attempts to match the donation to an event request by requester email.
   - If the Give Lively URL carried a request ID parameter and that parameter is returned, the system uses it for a direct match.
   - Otherwise, the system matches by email: the most recently confirmed request for that email (or, if none confirmed, the most recently created).
3. System determines `donation_status`:
   - If the donation timestamp is before the confirmed event date → `pre_event`.
   - If after the confirmed event date → `post_event`.
   - If the event is not yet confirmed → `pre_event` by default.
4. System updates the event request record: `donation_status`, `donation_amount`, `donation_timestamp`.

**Postconditions:**
- Event request record reflects the requester's donation status.
- If post-event follow-up email has not yet been sent, the 48-hour window may still deliver an updated version (see UC-018).

**Error / Alternate Flows:**
- **No matching requester email:** Donation is logged but not associated with an event request. Admin can manually associate it.
- **Requester has multiple active requests:** Donation is associated with the most recently confirmed (or most recently created, if none confirmed) request.
- **Recurring donor:** Only the first donation is matched to the event request. Subsequent recurring donations are not associated with specific events.

---

## UC-020: Manage the Admin Pipeline (Admin Dashboard)

**Actor:** Admin

**Preconditions:**
- Admin is authenticated via Pike13 OAuth.

**Main Flow:**
1. Admin opens the admin dashboard.
2. Admin views all event requests (filtered by status, date, instructor, type, etc.).
3. Admin can take the following actions on any request:
   - Change status (discussing → dates_proposed → confirmed → completed / cancelled)
   - Configure per-event parameters: minimum headcount, voting deadline, event capacity
   - Add or edit the external registration URL
   - Add participants to the email thread
   - Send site registration invitation links (UC-009)
   - View and manage registered sites (edit details, deactivate)
   - Confirm or cancel events
   - View the Asana task for the request
4. Admin views donation reporting: per-event donation status (none / pre / post), amount (if tracked), whether follow-up email was sent; overall donation rate across events broken down by pre-event vs. post-event.
5. Admin manages follow-up email templates: create, edit, set per-class or default fallback.

**Postconditions:**
- Changes made by admin are reflected in the event app and synced to Asana where applicable.

**Error / Alternate Flows:**
- **Asana sync failure:** Admin is notified; changes are stored in the event app and retried.

---

## UC-021: Confirm Event and Notify Parties

**Actor:** Admin

**Preconditions:**
- Event request has a date, instructor, and location locked in (via coordination).
- Admin is authenticated.

**Main Flow:**
1. Admin changes event status to `confirmed` via the event app or Asana (bidirectional sync propagates the change).
2. System records: confirmed date, assigned instructor ID.
3. System writes a booking back to Pike13 (the event appears on the instructor's Pike13 calendar).
4. For private events: system generates a shareable registration link and notifies the requester.
5. For public events: system creates a Meetup event (UC-014) and activates native registration (UC-011).
6. Event is added to the League's internal Google Calendar.

**Postconditions:**
- Event is in `confirmed` status.
- Instructor sees the event on their Pike13 calendar.
- Registration channel is live (private: shareable link; public: Meetup + native registration).
- Event is on the internal Google Calendar.

---

## UC-022: Manage Registered Sites (Admin)

**Actor:** Admin

**Preconditions:**
- Admin is authenticated via Pike13 OAuth.

**Main Flow:**
1. Admin navigates to the Sites section of the admin dashboard.
2. Admin can:
   - View all registered sites (name, type, address, status, representative).
   - Edit site details (address, type, facilities).
   - Deactivate a site (removes it from the location picker in new requests; does not affect existing events using that site).
   - Send a new site registration invitation (UC-009) to add a new site.
   - Resend or regenerate a registration invitation link if a previous one expired.

**Postconditions:**
- Site records reflect admin changes.
- Deactivated sites no longer appear in the location picker.

---

## UC-023: View and Update Site Details (Site Representative)

**Actor:** Site Representative

**Preconditions:**
- Site representative is authenticated (via magic link or Google OAuth — UC-010).

**Main Flow:**
1. Representative views their site's details: name, address, type, facility details (room capacity, WiFi, power outlets, projector, access notes).
2. Representative can edit any of these fields and save changes.
3. Representative views a list of upcoming and past events at their site (date, class name, status).

**Postconditions:**
- Site record is updated in the database.
- Updated details are used in future event requests selecting this site.

---

## UC-024: Request an Event for an Unregistered Site

**Actor:** Requester

**Preconditions:**
- Requester is completing the event intake form (Screen B1).
- The desired venue is not listed in the registered sites dropdown.

**Main Flow:**
1. Requester selects "My location isn't listed" in the site selection dropdown.
2. A free-text address field expands.
3. Requester types in the venue address.
4. Requester completes the rest of the intake form and submits as normal (UC-003).
5. The event request is created with `registered_site_id = null` and the free-text address stored as `location_address`.
6. No site representative is automatically added to the email thread; venue coordination happens manually via the email thread.

**Postconditions:**
- Event request exists with a free-text location (no registered site).
- Venue coordination must happen manually.

---

## UC-025: Donate at Submission Time (Pre-Event)

**Actor:** Requester

**Preconditions:**
- Requester has reached Screen B2 (Donation & Confirmation).

**Main Flow:**
1. Screen B2 shows the donation section: estimated cost to run the event, explanation of what the donation covers, and a Give Lively link (carrying the request ID parameter).
2. Requester clicks the Give Lively link and is taken to the Give Lively donation page.
3. Requester completes a donation on Give Lively.
4. Give Lively triggers a Zapier webhook (or is polled) with the donor email and amount.
5. System matches the donation to the event request and sets `donation_status = pre_event`.

**Postconditions:**
- `donation_status` is `pre_event` on the event request.
- When the post-event follow-up email is sent, it uses the "already donated" template.

**Error / Alternate Flows:**
- **Requester skips the donation link:** No donation is recorded. `donation_status` remains `none`. Post-event follow-up email uses the "not yet donated" template with a donation ask.

---

## UC-026: Manage Follow-Up Email Templates (Admin)

**Actor:** Admin

**Preconditions:**
- Admin is authenticated.

**Main Flow:**
1. Admin navigates to Settings or a dedicated Templates section in the admin dashboard.
2. Admin views all follow-up email templates (class-specific and default fallback).
3. Admin can create a new template for a class slug, or edit an existing one.
4. Template fields: class_slug (or null for default), subject line, body template (markdown or HTML with placeholder tokens for date, location, requester name), image references, resource links.
5. Admin saves the template.

**Postconditions:**
- Template is stored and will be used for the next post-event follow-up email for events of that class.

**Error / Alternate Flows:**
- **No class-specific template exists:** The default fallback template is used for all classes without a custom one.

---

## UC-027: Register for Waitlist (Public Event — Full)

**Actor:** Attendee

**Preconditions:**
- Public event is confirmed.
- `slots_remaining = 0` (event is full across both native and Meetup channels).

**Main Flow:**
1. Attendee navigates to the Event Registration Component (Screen A2) for the class page.
2. Screen A2 shows the "Registration full" state with an "Event Full" badge and a waitlist signup form.
3. Attendee enters their name and email and submits the waitlist form.
4. Attendee is confirmed on the waitlist.
5. Meetup's waitlist functionality is connected where applicable.

**Postconditions:**
- Attendee is on the waitlist.
- If capacity opens up (e.g. a native registration cancels or Meetup cap increases), waitlisted attendees can be notified and offered registration.

---

## UC-028: Detect and Handle Duplicate Registrations

**Actor:** System (automated)

**Preconditions:**
- A public event has both native registrations and Meetup RSVPs.
- The periodic RSVP sync is running (UC-015).

**Main Flow:**
1. During RSVP sync, system compares Meetup RSVP names against native registration child names.
2. If a child name from a native registration matches a Meetup RSVP name, the system flags it as a likely duplicate.
3. The duplicate is not double-counted in the unified capacity calculation.
4. Flagged duplicates are available for admin review.

**Postconditions:**
- Capacity count is not artificially inflated by cross-channel duplicates.
- Admin can review flagged duplicates if needed.

---

## UC-029: View Donation Reporting (Admin)

**Actor:** Admin

**Preconditions:**
- Admin is authenticated.
- At least some events have been completed.

**Main Flow:**
1. Admin navigates to the donation reporting section of the admin dashboard.
2. Admin views per-event donation data: donation status (none / pre / post), amount (if tracked), whether the follow-up email was sent.
3. Admin views aggregate metrics: overall donation rate across all events, broken down by pre-event vs. post-event donors.
4. Admin can filter by date range, class, or other attributes.

**Postconditions:**
- Admin has visibility into the effectiveness of the donation lifecycle.
