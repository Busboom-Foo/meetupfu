# Tech Club Event Request System — Full Feature Specification

**The League of Amazing Programmers**
Merged specification — April 2026
Source documents: tech-club-spec-v5.md, FEAT-1 Native Registration, FEAT-2 Public UI Wireframes, FEAT-3 Donation Lifecycle

---

## 1. Overview

### 1.1 Problem

The League currently schedules free Tech Club events manually — contacting libraries, schools, and community centers to arrange locations, then coordinating instructors, equipment, and promotion for each event. This process is time-consuming and doesn't scale. Meanwhile, demand from parents, schools, and youth groups is growing to the point where a self-service request system is viable.

The current approach has additional gaps:
- Public event registration routes entirely through Meetup. Meetup captures guests as a flat count with no distinction between parents and children, so it's impossible to know how many kids are actually attending.
- The League can't collect child-specific information (name, age) or guardian contact details through Meetup.
- Meetup doesn't support a volunteer role — adults who want to help at an event register the same way as attendees.
- The League has no control over the registration form fields or the attendee experience.
- Capacity tracking is unreliable because Meetup guest counts mix adults and children.
- Post-event, there's no mechanism to record who actually showed up.
- Donation encouragement happens only once, at the moment the requester is most focused on completing the form. If they skip it, the system never asks again. The period right after a successful event — when the requester has the most emotional connection to the League's mission — goes unused.

### 1.2 Solution

A web application that lets parents, teachers, and group leaders request Tech Club events for their communities. The system matches requests against instructor availability and geography, creates a structured coordination workflow, handles registration and promotion for confirmed events, tracks attendance, and closes the loop with a post-event donation follow-up.

The registration interface is delivered as an Astro component on the League's existing event pages, which also serves as the entry point for requesting new events. The system tracks registrations from both its own pages and Meetup, maintains a unified capacity count, and provides a post-event attendance reconciliation tool for instructors.

### 1.3 Goals

- Shift event initiation from League outreach to community demand
- Reduce manual coordination work for admins
- Give instructors/volunteers control over their own availability and preferences
- Provide a clear pipeline from request to confirmed event to registration
- Integrate with existing systems (Pike13, Meetup, main website, Asana, email)
- Enable native registration with child-level data for public events
- Maintain unified capacity tracking across native and Meetup registration channels
- Provide post-event attendance reconciliation for accurate reporting
- Increase donation rate through a two-phase donation lifecycle

### 1.4 Non-Goals (v1)

- Payment processing (donations are handled via Give Lively link)
- Replacing Pike13 for paid class enrollment
- Multi-session courses (these involve instructor assignment for a full series and are paid programs — a different workflow)
- Managing the ongoing curriculum or class content (that stays on jointheleague.org)

---

## 2. User Roles

| Role | Who | Capabilities |
|------|-----|-------------|
| Requester | Parent, teacher, scout leader, group organizer | Browse requestable classes. Submit event requests. Provide optional external registration URL. Participate in email coordination. Share registration/interest links. View event status. |
| Instructor | Volunteer or staff member | Log in via Pike13. Set topic preferences and geographic range in app. Signal availability via Pike13 appointments. Get matched to requests. Accept or decline assignments. Participate in email coordination. Complete post-event attendance reconciliation. |
| Site Representative | Library manager, school principal, science center coordinator | Follow tokenized registration link to claim a site. Log in via magic link or optional Google OAuth. View and update site details (address, type, facilities). View upcoming and past events at their site. Automatically added to email threads when their site is selected for an event. Participate in email coordination for events at their site. |
| Admin | Jed, other League staff | All instructor capabilities. View and manage all requests. Configure event parameters (min headcount, etc.). Add/edit external registration URL. Send site registration links. Manage registered sites. Confirm/cancel events. Manage Asana pipeline. Manage follow-up email templates. View donation reporting. |
| Attendee | Kids/families registering for a confirmed event | Click registration link. Vote on dates (if multiple, private events only). Register interest/attendance. Receive iCal invite (private events). Sign up for waitlist (if event full). |

---

## 3. Features

### 3.1 Class Catalog & Request Intake

- Browse requestable Tech Club classes sourced from jointheleague.org
- Request a specific class for your group directly from the class page
- Geographic availability check — enter a zip code, see whether instructors can reach you
- Instructor availability calendar — view open dates for your area and topic, select preferred dates (shown as a list of specific date/time slots approximately 5–7 days to 6 weeks out, not a calendar UI)
- If no instructors are available in range, the system says so and suggests the user check back or try a different class
- "This is a private event" checkbox shown after date selection; if checked, a notice appears explaining minimum headcount requirements and eligible group types (school groups, scout troops, youth organizations — not birthday parties)
- Intake form collecting group details, site information, and marketing capability (see §6.1 for full form spec)
- Optional external registration URL for hosts that have their own registration system
- Donation encouragement with estimated event cost and link to Give Lively (the Give Lively link carries a parameter tying the donation to the event request for tracking)
- Requesters can have multiple concurrent active requests; a rate limit of 10 active requests per requester email prevents spam/abuse

### 3.2 Site Registration

- Admin sends a tokenized registration link to a site representative (library branch manager, school principal, science center coordinator, etc.)
- Site rep follows the link, which validates them as the representative of that site, and fills in site details: name, address, type (school, library, science center, other non-profit), contact info, facility details (room capacity, WiFi, power outlets, projector availability)
- Registered sites appear as selectable options when a requester chooses a location during event intake; requesters can also enter a free-text location that doesn't match a registered site
- When a requester selects a registered site, facility details (capacity, WiFi, projector) are shown as read-only context so the requester can confirm the space is suitable
- When a requester selects a registered site, the site representative is automatically added to the event's email thread — no manual outreach needed to coordinate venue access
- Admin dashboard for managing registered sites: view, edit, deactivate
- If a registration token expires unused, the admin can resend or generate a new link

### 3.3 Instructor/Volunteer Management

- Pike13 OAuth login for instructors and admins
- Instructor profile: topics they teach, home zip, travel range or specific service zip codes
- Availability signaled through Pike13 appointments (instructors use Pike13's existing calendar UI)
- Automatic matching of instructors to requests by topic, geography, and availability
- Instructor consent: matched instructors must accept a request before they're assigned; the system sends reminders if they haven't responded; after a configurable timeout, the system moves on to the next matched instructor
- Pike13 write-back: when an instructor is assigned and the event confirmed, the system writes a booking back to Pike13 so the event appears on the instructor's Pike13 calendar

### 3.4 Equipment Reservation

- Integration with the League's inventory system to check and reserve equipment (robots, micro:bits, laptops, etc.) needed for a class
- Equipment availability is a scheduling constraint — if the gear isn't free on a given date, that date isn't offered
- Equipment is reserved when an event is confirmed

### 3.5 Event Coordination

- Per-request email address for threaded communication between requester, admins, instructor, and other contacts (e.g. school principal)
- AI-powered email extraction: action items, status updates, and decisions pulled from email threads and synced to Asana (read-only — AI does not send emails)
- Asana integration: each request becomes a task with status tracking, custom fields, and pipeline management
- Request status lifecycle: new → discussing → dates_proposed → confirmed → completed/cancelled

### 3.6 Registration & Interest Gathering

- Private events: shareable registration link with date voting ("check all dates you can attend") and minimum headcount threshold
- Public events: automatic Meetup event creation plus native registration via the League's own website (both channels run in parallel — see §3.7 for native registration details)
- Public events with external registration: Meetup description includes a prominent "Host Registration" hyperlink near the top directing attendees to the host's own registration system; the Meetup event description also includes a link to the native registration page on jointheleague.org
- Periodic registration digest emails sent to the event email thread with names, kid counts, and totals — includes a soft request for the host to share their own registration total
- For public events with unified capacity tracking, the digest includes: native registrations (exact count with names), Meetup RSVPs (estimated kid count with heuristic applied), combined total, and remaining capacity
- Date finalization (private events): when a date clears the minimum headcount, it's selected; if multiple clear, highest count wins or admin picks
- iCal invite delivery to confirmed attendees (private events)
- Notifications to registrants who selected a different date than the one confirmed (private events)
- No minimum headcount gate for public events; no date voting — date is finalized during coordination before the Meetup event is created

### 3.7 Native Event Registration (Public Events)

When a public event is confirmed, the system exposes a native registration API for that event. This runs in parallel with Meetup — both channels are active simultaneously.

**Registration form fields:**
- Guardian information: name, email, phone number
- Child information (one or more): name, age
- Role: attending (default) or volunteering

Each registration creates one guardian record linked to one or more child records. The unit of capacity is kids — guardians don't count toward the event cap. Adults who want to volunteer register with the volunteer role; they don't need to list a child; volunteers don't count toward the event cap.

**Unified capacity tracking:**

Each event has a fixed capacity (number of kids). The system computes available slots combining both sources:

- Native registrations: count of children across all registrations
- Meetup RSVPs: the system periodically pulls RSVP data from the Meetup API. For each RSVP: guest count of 1 → 1 kid (assume the person is a parent bringing one child, or a child attending); guest count of 2+ → subtract 1 (the adult), remainder are kids

Combined count formula:
```
kids_registered_native + kids_estimated_meetup = total_kids
event_capacity - total_kids = slots_remaining
```

When `slots_remaining` hits zero, the native registration form shows the event as full and offers a waitlist.

**Meetup capacity coordination:**

The system programmatically adjusts the Meetup event's RSVP limit to stay in sync. After computing `slots_remaining` (in kids), the system converts back to a Meetup guest limit by adding an estimated adult count (one adult per remaining kid slot), then updates the Meetup event via API. This prevents over-registration across channels without manual intervention.

**Duplicate detection:** Best-effort name matching across native registrations and Meetup RSVPs. If a child's name from a native registration matches a Meetup RSVP name, the system flags it as a likely duplicate and doesn't double-count. Meetup's API may not expose emails, so name is the primary matching field.

**Waitlist:** When native registration is full, the system offers a waitlist. This connects to Meetup's waitlist functionality where applicable.

**Volunteer notifications:** Volunteers receive different communications than attending families (different arrival time, role expectations, what to bring). Details of notification templates deferred to implementation.

### 3.8 Attendance Reconciliation

After an event, an instructor or admin can open a reconciliation view for the event. This is a rough-count tool, not a strict check-in system. The instructor fills it out after the event (or during downtime), not at the door.

**Reconciliation view shows:**
- All native registrations (guardian + children)
- Meetup RSVPs (by name, where available from the API)

For each registered child, the instructor marks: showed up or no-show. At the bottom, there's a field for additional kids — a count of children who attended but weren't on any registration list (walk-ins, last-minute additions).

**Output:**
```
confirmed_attendees = marked_as_showed_up + additional_kids
no_shows = marked_as_no_show
attendance_rate = confirmed_attendees / total_registered
```

The reconciliation completing triggers the event's transition to `completed` status (or an admin can manually mark it complete, or a time-based trigger fires 72 hours after the event date).

### 3.9 Donation Lifecycle

Donation encouragement spans two phases:

**Phase 1 — Pre-event (at submission, existing flow):**
On the request confirmation page (Screen B2), the requester sees estimated event cost, an explanation of what the donation covers, and a Give Lively link. The Give Lively link carries a parameter tying the donation to the event request for tracking. This is encouragement, not a gate — there is no payment form in the app.

**Phase 2 — Post-event follow-up email:**
After an event reaches `completed` status, the system sends a follow-up email to the requester within 48 hours.

If the requester has NOT donated (`donation_status = none`):
- Thank-you message for organizing the event
- Templated content about what kids typically do in that class (pulled from class description and a per-class follow-up template)
- Placeholder image slots for event photos (templated stock/class-type images for now; actual event photos are a future feature)
- Links to student project examples or class resources where applicable
- A donation ask: estimated cost of the event, what the donation covers (instructor time, equipment, curriculum), and a Give Lively link (carrying the request ID parameter for tracking)

If the requester HAS donated (`donation_status = pre_event`):
- Thank-you message for both organizing and donating
- Same templated class content and images
- No donation ask — they already gave
- A softer call-to-action: share the League with others, link to volunteer page, link to upcoming events

**Donation tracking:**
Each event request tracks: `donation_status` (none, pre_event, post_event), `donation_amount` (nullable, populated when a donation is matched), `donation_timestamp`.

The system matches donations from Give Lively to event requests by requester email. When a donation comes in with an email matching an active requester, the system updates the corresponding event request record. If a requester has multiple active requests, the donation is associated with the most recently confirmed (or, if none are confirmed, the most recently created) request.

Pre-event vs. post-event is determined by event date: if the donation timestamp is before the confirmed event date, it's `pre_event`; if after, it's `post_event`; if the event hasn't been confirmed yet when the donation comes in, it's `pre_event` by default.

**Give Lively integration:** Two paths:
- Option A (Zapier → Webhook): A Zap fires on each new Give Lively donation and sends a webhook to the event system with donor email and amount.
- Option B (Give Lively API polling): The system periodically queries Give Lively's API for recent donations and matches by email.

Either path produces the same result: a donation record linked to an event request. The implementation choice is deferred.

**Follow-up email goes to the requester only, not all attendees.** The requester is the person who organized the event and has the relationship with the League.

**Follow-up email templates:** Each requestable class has a follow-up email template stored in the system. Templates are managed by admins. A default fallback template exists for classes without a custom one. A template includes: class-specific description of what kids do, placeholder image references (keyed to class slug), links to relevant resources.

**Follow-up email is not sent for cancelled events.** Only `completed` events trigger the follow-up.

### 3.10 Event Types

- **Private:** Closed group (scout troop, school, youth group). Registration via in-app shareable link with date voting. Off Meetup.
- **Public:** Open to anyone. Registration via Meetup plus native registration on jointheleague.org (both channels active). Promoted through League's Meetup group. Host may optionally have their own registration system linked from the Meetup page.
- Both types share the same request and coordination flow; they diverge at registration.

### 3.11 Admin Tools

- Dashboard to view and manage all requests
- Configure per-event parameters (minimum headcount, voting deadline)
- Add or edit external registration URL for public events
- Confirm or cancel events
- Send site registration links to venue representatives; manage registered sites (view, edit, deactivate)
- Asana pipeline management with bidirectional sync (status changes in either system propagate)
- Manage follow-up email templates (per-class and default fallback)
- View donation reporting: status (none / pre / post), amount (if tracked), whether follow-up email was sent, overall donation rate across all events broken down by pre-event vs. post-event

---

## 4. User Flows

### 4.1 Requester Flow: Submit a Request

Entry point: Parent/teacher is on jointheleague.org. They navigate to the Tech Club page or a page listing requestable classes. Each requestable class has a "Request this free class for your group" button.

**Phase 1 — jointheleague.org (Request Discovery Component, Screen A1):**

1. Requester clicks the request button on a class page. The Request Discovery Component is embedded on these pages.
2. Component shows: "Enter your zip code to see available Tech Club events near you." If the user is recognized (has a requester account via magic link session), their stored zip code is pre-populated.
3. Requester enters zip code. System checks instructor coverage for that area and class topic. If no instructors are available in range, the system says so and suggests they check back or try a different class.
4. If instructors are available, component expands to show two sections:
   - **Upcoming confirmed events** (if any exist near that zip): A short list of already-scheduled events with date, class name, location, and a "Register" link.
   - **Available dates to request:** A list of specific date/time slots approximately 5–7 days to 6 weeks out, derived from instructor availability in Pike13. Each row shows class name, date, time, and general area (e.g. "Python — Saturday, April 19, 3:30 PM — North County"). A "Request This" button on each row. No instructor names shown.
5. Requester selects a date window. Component expands further with:
   - A "This is a private event" checkbox. If checked, a notice appears explaining minimum headcount requirements and eligible group types.
   - An email input field.
   - A "Continue to Request Form →" button.
6. On continue, the user is redirected to the event system app (events.jointheleague.org) with selected class, date, zip, event type, and email as URL parameters.

**Phase 2 — Event system app (Request Intake, Screens B1–B3):**

7. Requester arrives at Screen B1 (Request Intake Form). Class name, selected date(s), zip code, event type, and requester email are pre-populated from URL params (email field is pre-filled but editable).
8. Requester completes the form: name, group type, expected headcount, site selection (pick from registered sites or enter a free-text location), site readiness, marketing capability, optional external registration URL, any additional contacts (e.g. school principal email). If a registered site is selected, facility details are shown as read-only context.
9. Requester proceeds to Screen B2 (Donation & Confirmation): summary of the request in a review card, donation section (estimated event cost, explanation, Give Lively link with request ID parameter), "Submit Request" button.
10. On submit: request is saved in `unverified` status and a verification email is sent to the requester's email address. User is redirected to Screen B3. The request has a one-hour verification window.
11. Screen B3: "Check your email to verify your request. We sent a verification link to [email]. If you don't see it, check your spam folder."
12. **If verified within one hour:** request moves to `new` status. System generates a dedicated email address (e.g. `request-4827@events.jointheleague.org`), creates an Asana task, and sends notification emails to admins and matched instructor(s). If a registered site was selected, the site representative is added to the email thread participants. User is redirected to Screen B4 (Requester Dashboard) with a success banner.
13. **If not verified within one hour:** the unverified request is purged from the database. If the requester is still on Screen B3, the page updates to show "Your request has expired" with a "Start Over" link. If the requester clicks the expired verification link later, they see the same expiration message with a link to start over.

### 4.2 Coordination Flow

1. All parties communicate via the dedicated email address. Requester, admins (Jed + others), matched instructor, site representative (if a registered site was selected), and any additional contacts (principal, etc.) are all on the thread.
2. AI agent monitors the email thread and extracts structured information: confirmed dates, location details, action items, status changes. Updates Asana task and event request record accordingly.
3. Admin or the system moves the request through statuses: discussing → dates_proposed → confirmed.
4. Once confirmed: date, instructor, and location are locked in. The event is ready for registration.

### 4.3 Registration Flow: Private Events

1. System generates a shareable registration link for the confirmed event.
2. Requester distributes the link to their group (scout troop, school families, etc.).
3. Attendees click the link and land on Screen B6 (Private Event Date Voting Page) showing: class description, location, date(s), and a registration form.
4. If multiple candidate dates are still open, attendees select all dates they can attend ("check all that work for you").
5. Attendee provides: name, email, number of kids attending.
6. System tracks registrations per date. When a date meets the minimum headcount threshold, that date is auto-selected (or flagged for admin confirmation). The requester and admin are notified.
7. If multiple dates clear the threshold, the date with the highest registration count is selected (or admin picks).
8. Once a date is finalized: all registrants who selected that date receive an iCal invite via email. Registrants who didn't select that date get a notification that a different date was chosen.
9. If no date meets the minimum headcount by a deadline (configured per event), the requester is notified and the event may be cancelled or rescheduled.
10. Event is added to the League's internal Google Calendar.
11. After voting closes or a date is selected, Screen B6 updates to show the confirmed date and whether the voter's date was chosen. If not: "The event was scheduled for [date]. We hope to see you at a future event."

### 4.4 Registration Flow: Public Events

1. Once confirmed, the system creates a Meetup event via the Meetup API, associated with the appropriate Meetup group (e.g. the-league-tech-club).
2. The system also activates its native registration endpoint for the event. The Astro Event Registration Component (Screen A2) on the jointheleague.org class page begins showing the registration form.
3. The Meetup event description includes a link to the native registration page on jointheleague.org, making the League's site the primary registration path while Meetup serves as discovery.
4. If the event request has an external registration URL, the Meetup event description also includes a prominent hyperlink near the top (e.g. "This event requires registration with the host: [Host Registration](url)") before the standard class description and details.
5. The Meetup event link is shared with the requester and displayed in the event app.
6. Registration via native form and RSVPs via Meetup both run in parallel. The system maintains unified capacity tracking (see §3.7).
7. The system periodically syncs RSVP data from Meetup for tracking and capacity adjustment, up until the day of the event.
8. The system sends periodic registration digest emails to the event's dedicated email thread containing registrant names, number of kids, totals, native vs. Meetup breakdown, and remaining capacity. When an external registration link is present, the digest includes a request for the host to share their own total registration count including League registrations.
9. Event is added to the League's internal Google Calendar.

### 4.5 Instructor Flow

1. Instructor logs into the event app via Pike13 OAuth.
2. On first login, they set up their profile: topics they teach, home zip code, maximum travel time or explicit list of service zip codes.
3. Instructor signals availability by creating appointments in Pike13 (using Pike13's existing UI and calendar). The event app reads these via Pike13 API.
4. When a request matches their profile (topic + geography + availability), they receive an email notification asking them to accept or decline the assignment.
5. If the instructor doesn't respond, the system sends reminders. After a configurable timeout, the system moves on to the next matched instructor.
6. Once accepted, the instructor is added to the request's email thread and can view the event in the app.
7. When an event is confirmed, the system writes a booking back to Pike13 so the event appears on the instructor's Pike13 calendar.
8. After the event, the instructor opens the attendance reconciliation view (Screen — instructor/admin scope) and marks each registered child as showed up or no-show, plus a count of walk-ins.

### 4.6 Site Registration Flow

1. Admin creates a site registration invitation from the admin dashboard, entering the site name and the representative's email address.
2. System generates a tokenized registration URL and sends it to the representative via email. The token is single-use and expires after a configurable period (default: 7 days).
3. Site representative clicks the link. The system validates the token and presents a registration form.
4. Representative fills in site details: site name, address, type (school, library, science center, other non-profit), representative's name and contact info, and facility details (room capacity, WiFi availability, power outlet count, projector/screen availability, any access restrictions or scheduling notes).
5. On submission, the system creates a site record in `active` status and a site representative account tied to the rep's email address. The representative is now the registered contact for that site.
6. The site has a public page in the system showing its name, type, and general location. The page includes a "Site Manager Login" link that triggers a magic link email to the representative's address on file.
7. The site appears in the location picker on the event request intake form. When a requester selects it, the representative is automatically added to the event email thread.
8. If the token expires unused, the admin can resend or generate a new link.

### 4.7 Site Representative Access

Site representatives have persistent accounts but access is designed for infrequent use.

- **Default (magic link):** The site's page has a login link. Clicking it sends a magic link email to the representative. The magic link is valid for a configurable period (default: 24 hours) and grants a session.
- **Optional (Google OAuth):** Representatives can optionally link a Google account to their site rep account for direct login without waiting for an email.
- **Once authenticated:** the representative can view and edit their site details (address, facilities, access notes, contact info) and see a list of upcoming and past events at their site.

### 4.8 Matching Algorithm

When a requester enters a zip code and class topic, the system finds candidate instructors:

1. **Filter by topic:** instructor's `topics[]` must include the requested class slug (or a parent topic that covers it).
2. **Filter by geography:** if instructor has explicit `service_zips`, check if the requested zip is in the list. Otherwise, calculate distance from instructor's home zip centroid to requested zip centroid and compare against `max_travel_minutes` (using estimated drive time with some accounting for time of day). *Note: Zip centroid distance is the v1 approach. May upgrade to a routing API later if needed.*
3. **Filter by availability:** query Pike13 for the instructor's available appointment slots within a relevant date range.
4. **Aggregate:** available dates across all matching instructors. Present to requester as a list of specific date/time slots (without instructor names).

### 4.9 Post-Event Flow

1. After an event date passes, an instructor or admin opens the attendance reconciliation view.
2. The instructor marks each registered child as showed up or no-show and records a count of walk-in kids.
3. The system computes final attendance: `confirmed_attendees = marked_as_showed_up + additional_kids`.
4. The event transitions to `completed` status (either via reconciliation completion, manual admin action, or a time-based trigger 72 hours after the event date).
5. Within 48 hours of `completed` status, the system sends the post-event follow-up email to the requester (content depends on `donation_status` — see §3.9).

---

## 5. Screen Inventory & UI

### 5.1 Hosting Model

The public UI spans two host surfaces with a clear handoff point between them.

**Surface 1: jointheleague.org (Astro Components)**

The League's main website is an Astro site. Two distinct Astro components serve the Tech Club system. Neither component carries the event app's navigation chrome — they inherit the jointheleague.org page layout and styling.

**Surface 2: Event System App (events.jointheleague.org)**

The event system is a standalone web app with its own left-side navigation menu. Public-facing pages include: request intake form, email verification holding page, requester dashboard, event detail/status page, private event date voting page, and donation/confirmation page.

**Handoff point:** The user transitions from Surface 1 to Surface 2 when they've selected a class and date window on jointheleague.org and are ready to fill out the full request intake form. The handoff is a redirect carrying the class slug, selected date(s), zip code, event type (public/private), and email as URL parameters.

### 5.2 Screen A1: Request Discovery Component

**Where:** Reusable Astro component embedded on any requestable class page and on dedicated "Free Events" listing pages across jointheleague.org.

**Purpose:** Let a requester find available dates to request a free Tech Club event in their area. Also surface already-confirmed events nearby for direct registration.

**Behavior (progressive disclosure, single page):**

1. **Initial state:** A zip code input field with a prompt: "Enter your zip code to see available Tech Club events near you." If the user is recognized (has a requester account via magic link session), their stored zip code is pre-populated.

2. **After zip entry:** The component expands to show two sections:
   - **Upcoming confirmed events** (if any exist near that zip): A short list of already-scheduled events with date, class name, location, and a "Register" link (goes to the Event Registration Component on the class page, or to Meetup for public events without native registration).
   - **Available dates to request:** A list of specific date/time slots within a rolling window (approximately 5–7 days to 6 weeks out), derived from instructor availability in Pike13. Each row shows the class name, date, time, and general area (e.g. "Python — Saturday, April 19, 3:30 PM — North County"). A "Request This" button on each row selects it. Volume is typically low — weekday afternoons and weekends only — so no pagination or additional filtering is needed.

3. **After selecting a date window:** The component expands further with:
   - A "This is a private event" checkbox. If checked, a notice appears explaining minimum headcount requirements and eligible group types (school groups, scout troops, youth organizations — not birthday parties).
   - An email input field.
   - A "Continue to Request Form →" button.

4. **On continue:** The user is redirected to the event system app (Surface 2) with the selected class, date, zip, event type, and email passed as parameters.

Not shown in this component: class descriptions, age ranges, and topic details. Those are already on the host page provided by jointheleague.org's content. This component is a functional widget, not a content page.

### 5.3 Screen A2: Event Registration Component

**Where:** Embedded on individual class pages on jointheleague.org.

**Purpose:** Let attendees register for a confirmed event, or prompt them to request one if nothing is scheduled.

**States:**

- **Registration open:** Event details (date, time, location), remaining capacity indicator, registration form (guardian name, email, phone; one or more children with name and age; volunteer checkbox). "Register" button. Link to Meetup page if one exists.
- **Registration full:** Event details with "Event Full" badge. Waitlist signup form (name, email). Link to Meetup page.
- **No event scheduled:** Message: "No upcoming [class name] event is scheduled." Prompt to request one, with a link that scrolls to or navigates to the Request Discovery Component (A1) or directly to the request flow.

### 5.4 Screen B1: Request Intake Form

**Where:** Event system app. Linked from the Request Discovery Component (A1) after the user selects a class/date and provides their email.

**Pre-populated from URL params:** Class name (displayed, not editable), selected date(s), zip code, event type (public/private), requester email.

**Form fields:**
- Requester name
- Group type dropdown (school, Girl Scout troop, BSA troop, library, other youth group, public — pre-selected to match event type if private)
- Expected headcount
- Site selection: searchable dropdown of registered sites near the entered zip, plus a "My location isn't listed" option that expands to a free-text address field
- Site readiness (dropdown: ready to go / needs some setup / not sure)
- Marketing capability (can you help promote this event to families?)
- Additional contacts (optional — e.g. school principal email)
- External registration URL (optional — for hosts with their own signup system)

If a registered site is selected, facility details (capacity, WiFi, projector) are shown as read-only context so the requester can confirm the space is suitable.

Bottom of page: "Review & Submit" button leading to Screen B2.

### 5.5 Screen B2: Donation & Confirmation

**Where:** Event system app.

**Purpose:** Encourage a donation and let the requester review and confirm their request.

**Content:**
- Summary of the request (class, date, location, group info) in a review card.
- Donation section: estimated cost to run the event, explanation of what the donation covers, prominent link to Give Lively (carrying the request ID parameter for tracking). This is encouragement, not a gate — there's no payment form in the app.
- "Submit Request" button.
- On submit: request is saved in `unverified` status, verification email is sent, user is redirected to Screen B3.

### 5.6 Screen B3: Email Verification Holding Page

**Where:** Event system app.

**Content:**
- "Check your email to verify your request."
- "We sent a verification link to [email]. If you don't see it, check your spam folder."
- The verification link has a one-hour window.
- **If the user stays on this page and the hour expires:** the page updates to show "Your request has expired" with a "Start Over" link.
- **If the user clicks an expired verification link later:** same expiration message with "Start Over" link.
- **On successful verification (user clicks valid link):** redirected to Screen B4 (requester dashboard) with a success banner.

### 5.7 Screen B4: Requester Dashboard

**Where:** Event system app. Accessible after email verification creates the requester's account.

**Authentication:** Magic link email. The requester's account is keyed to their email. When they visit the dashboard or follow a link in a status-update email, they authenticate via magic link.

**Content:**
- List of the requester's event requests, each showing:
  - Class name
  - Status badge (new → discussing → dates proposed → confirmed → completed / cancelled)
  - Date (confirmed date, or "pending" if not yet set)
  - Location
  - Link to the event detail page (Screen B5)
- For confirmed events: a shareable registration link and current registration count.

Most requesters will have one active request. The dashboard handles multiple, but the common case is a single card.

### 5.8 Screen B5: Event Detail / Status Page

**Where:** Event system app. Linked from the requester dashboard and from status-update emails.

**Content varies by status:**

- **All statuses:** Class name, requested date(s), location, group info, event type, status badge, timeline of status changes.
- **Discussing / Dates Proposed:** Note that coordination is happening via email. "Check your email for updates."
- **Confirmed:** Confirmed date, instructor first name, location details. Shareable registration link (public events: also Meetup link). Registration count. If native registration is enabled: breakdown of native vs. Meetup registrations.
- **Completed:** Attendance summary (if reconciliation was done).
- **Cancelled:** Reason (if provided).

### 5.9 Screen B6: Private Event Date Voting Page

**Where:** Event system app. Linked from the shareable registration link for private events.

**Content:**
- Class name, general location, description pulled from content.json.
- List of candidate dates with checkboxes: "Check all dates you can attend."
- Registration fields: name, email, number of kids attending.
- "Submit" button.
- After voting closes or a date is selected: this page updates to show the confirmed date and whether the voter's date was chosen. If not: "The event was scheduled for [date]. We hope to see you at a future event."

### 5.10 Navigation Structure

**Left-Side Navigation (Event System App)** — adapts by role:

Unauthenticated / Requester:
- My Requests (Screen B4)
- Request an Event (links to jointheleague.org's discovery page, or directly to intake if class is known)
- Help / FAQ

Admin (Pike13 OAuth):
- Dashboard
- All Requests
- Sites
- Instructors
- Equipment
- Settings

Instructor (Pike13 OAuth):
- My Events
- Profile
- Attendance (reconciliation)

**Astro Component Navigation:** The Astro components have no independent navigation. They sit within jointheleague.org's existing page structure. Internal links navigate within the component or redirect to the event system app.

---

## 6. External Systems

### 6.1 Integration Map

| System | Role | Integration |
|--------|------|------------|
| Pike13 | Identity & availability | OAuth for instructor/admin login. API read for instructor availability appointments. API write to book the instructor when assigned to an event, so they see it on their Pike13 calendar. |
| jointheleague.org | Content source & entry point | JSON API provides class catalog (content.json). Class pages link to event request app. Requestable classes flagged in content data. |
| Meetup | Public event promotion | API write to create events for public Tech Club sessions. Event description includes link to native registration page on jointheleague.org and external registration link when provided. RSVP managed by Meetup. API write to update RSVP limit for capacity coordination. Periodic RSVP sync to event app. |
| Amazon SES | Email routing | Inbound routing for per-request email addresses. Outbound for notifications, registration digests, and iCal invites. |
| Asana | Task/pipeline tracking | API to create and update tasks. One project for all requests with custom fields for status, instructor, dates, etc. Bidirectional sync via Asana webhooks. |
| Give Lively | Donations | Outbound link with request ID parameter. Donation notifications received via Zapier webhook or API polling. |
| Google Calendar | Internal event coordination | Private/internal events added to a shared League calendar. Attendees receive iCal invites (private events). |

### 6.2 Email System

Each event request gets a unique email address, e.g. `request-4827@events.jointheleague.org`. This address is the hub for all coordination related to that request.

- **Inbound:** Amazon SES receives mail to this address and routes it to the app via SNS notification or Lambda.
- **Outbound:** The app sends via SES from this address so replies thread correctly.
- **Participants:** Requester, admins, matched instructor(s), site representative (if a registered site was selected), additional contacts (principal, etc.). The requester can add participants (e.g. CC the principal) during the intake form or later.
- **Registration digests:** For public events, the system periodically sends a registration summary to the event email thread with registrant names, kid counts, and totals (including native vs. Meetup breakdown). When an external registration link is present, the digest includes a soft ask for the host to share their total count.
- **Post-event follow-up:** After `completed` status, the system sends a personalized follow-up email to the requester within 48 hours (content varies by donation status — see §3.9).
- **Storage:** All messages are stored in the app's database, linked to the event request.

### 6.3 AI Email Processing

An AI agent reads each inbound message on the thread and extracts:

- Status-relevant information (e.g. "we've confirmed the library for March 22" → update location and date)
- Action items (e.g. "can you send the flyer template?" → create Asana subtask)
- Decisions (e.g. "let's go with the Saturday session" → flag for admin confirmation)
- Sentiment/risk signals (e.g. requester going cold, repeated rescheduling)
- Host registration counts (e.g. host replies with "we have 25 registered total" → update tracking)

The AI does **not** send emails to participants. It only extracts information and updates internal systems (Postgres, Asana). Admin review is required for any status changes the AI flags. Only high-confidence extractions are acted on automatically; ambiguous content is flagged for admin review.

Implementation: lightweight model (Claude Haiku or similar).

### 6.4 Asana Integration

One Asana project holds all event requests. Each request is a task.

| Field | Type | Notes |
|-------|------|-------|
| Requester Name | Text | |
| Class Requested | Text | Class title from content.json |
| Group Type | Dropdown | School, Girl Scouts, BSA, Library, Other, Public |
| Zip Code | Text | |
| Expected Headcount | Number | |
| Status | Dropdown | New, Discussing, Dates Proposed, Confirmed, Completed, Cancelled |
| Instructor | Text | Assigned instructor name |
| Confirmed Date | Date | |
| Location | Text | Venue name and address |
| Event Type | Dropdown | Private, Public |
| External Registration | URL | Host's registration link (if provided) |
| Registration Count | Number | Current registrations (updated by system) |
| Event App Link | URL | Link back to the request in the event app |

Jed manages the pipeline in Asana — moving tasks between statuses, adding notes, assigning follow-ups. The system keeps the task in sync bidirectionally: status changes in Asana propagate back to the event app via Asana webhooks.

### 6.5 Content Integration

The event app does not maintain its own class content. All class information is sourced from jointheleague.org's content.json.

A new `requestable` flag in content.json marks which classes can be requested:
- Classes with the flag appear on the "Request a Tech Club" listing page on jointheleague.org
- Each class page gets a "Request this free class for your group" button linking to the event app
- The event app reads class metadata (title, description, age range, topics, typical duration, equipment needs) from content.json at request time

When a public event is created, the system uses groups.json to map class subgroups to Meetup groups (e.g. tech-club/robot → the-league-tech-club) for event creation.

---

## 7. Data Model

Primary data store is PostgreSQL. Pike13 is the identity provider for instructors and admins. The main website's content.json is the source of truth for class definitions.

### 7.1 Instructor Profile

Stored in Postgres, keyed to Pike13 user ID.

- `pike13_user_id` — from OAuth
- `display_name` — first name or first name + last initial
- `topics[]` — list of class topics they're willing to teach (references class slugs from content.json)
- `home_zip` — their base location
- `max_travel_minutes` — how far they'll drive
- `service_zips[]` — optional explicit list of zip codes they'll serve (overrides radius)
- `active` — whether they're currently taking requests

### 7.2 Instructor Availability

Read from Pike13 API. Instructors create appointments in Pike13 to signal when they're available. The event app reads these and presents them as bookable windows.

- Pulled from Pike13 appointment data
- Matched against request geography and topic
- Displayed to requesters as available date/time slots

### 7.3 Registered Site

Created when a site representative completes the registration form via a tokenized link.

- `site_id`
- `name` — e.g. "Carmel Mountain Ranch Library", "Elementary Institute of Science"
- `address`, `city`, `state`, `zip_code`
- `type` — school, library, science_center, other_nonprofit
- `room_capacity` — approximate number of students the space can hold
- `has_wifi` — boolean
- `power_outlet_count` — approximate
- `has_projector` — boolean
- `access_notes` — free text for scheduling restrictions, entry instructions, parking, etc.
- `status` — active, inactive
- `registration_token` — the initial invitation token (consumed on registration)
- `token_expires_at`
- `representative_id` — FK to Site Representative
- `created_at`, `updated_at`

### 7.4 Site Representative

Created alongside the site record when a representative completes registration.

- `representative_id`
- `name`
- `email` — used for magic link login and event email threads
- `google_oauth_id` — optional, linked if the rep chooses Google login
- `created_at`, `updated_at`

### 7.5 Event Request

Created when a requester submits the intake form.

- `request_id`
- `class_slug` — which class was requested (from content.json)
- `requester_name`, `requester_email`
- `group_type` — school, scout troop (Girl Scout, BSA), library, other youth group, public
- `zip_code`
- `location_address` — may be provided later during coordination
- `registered_site_id` — FK to Registered Site, if a registered site was selected (null for free-text locations)
- `expected_headcount`
- `site_control` — does the requester control the venue?
- `site_readiness` — how much work to get the site ready?
- `marketing_capability` — can the requester help promote?
- `preferred_dates[]` — dates selected from available instructor windows
- `email_address` — the per-request routing address (e.g. request-{id}@events.jointheleague.org)
- `status` — unverified, new, discussing, dates_proposed, confirmed, completed, cancelled
- `event_type` — private or public
- `external_registration_url` — optional URL to the host's own registration system (typically for public events at venues like libraries)
- `min_headcount` — minimum registrations required to run the event (private events)
- `event_capacity` — maximum number of kids (for capacity tracking, primarily public events)
- `native_registration_enabled` — boolean (defaults to true for public events)
- `assigned_instructor_id`
- `confirmed_date`
- `asana_task_id`
- `meetup_event_id` (if public)
- `google_calendar_event_id`
- `donation_link` — Give Lively URL (parameterized with request ID)
- `donation_status` — enum: none, pre_event, post_event (default: none)
- `donation_amount` — nullable decimal
- `donation_timestamp` — nullable datetime
- `followup_email_sent_at` — nullable datetime
- `created_at`, `updated_at`

### 7.6 Native Registration (Public Events)

Created when an attendee registers via the native registration form. Distinct from the private event Registration/Interest model (§7.7).

- `registration_id`
- `request_id` — FK to the parent event request
- `guardian_name`, `guardian_email`, `guardian_phone`
- `role` — attendee (default) or volunteer
- `children[]` — array of child records, each with `name` and `age`
- `source` — native or meetup (for records created from Meetup RSVP sync)
- `checked_in` — null (not yet reconciled), true, false
- `created_at`

### 7.7 Registration / Interest (Private Events)

Created when an attendee clicks the shareable link and registers for a private event.

- `registration_id`
- `request_id` — links to the parent event request
- `attendee_name`, `attendee_email`
- `number_of_kids`
- `available_dates[]` — which of the proposed dates they can attend
- `status` — interested, confirmed, declined
- `created_at`

### 7.8 Attendance Reconciliation

- `reconciliation_id`
- `request_id`
- `reconciled_by` — pike13_user_id of the instructor/admin
- `additional_kids` — count of walk-ins not on any list
- `reconciled_at`

### 7.9 Email Thread

- `email_address` — the per-request address
- `request_id`
- `participants[]` — requester, admin(s), matched instructor(s), site representative (if registered site), additional contacts (e.g. school principal)
- `messages[]` — stored inbound/outbound messages for AI extraction

### 7.10 Follow-Up Email Template

- `template_id`
- `class_slug` — FK to class in content.json (or null for the default fallback template)
- `subject_line`
- `body_template` — markdown or HTML with placeholder tokens for event-specific data (date, location, requester name)
- `image_references[]` — list of image slugs/URLs for the template
- `resource_links[]` — URLs to curriculum pages, student project examples
- `created_at`, `updated_at`

---

## 8. API Sketch

### 8.1 Native Registration API (for Astro Component)

**`GET /api/events/{class_slug}/current`**
Returns the current or next scheduled event for a given class, if any. Used by the Astro component to determine which state to render. Response includes: event status, date, time, location, capacity, slots remaining, Meetup URL (if any), registration open/closed. Returns 404 or empty if no event is scheduled — the component falls back to the "request an event" state.

**`POST /api/events/{request_id}/register`**
Accepts a native registration: guardian info, children, role. Returns the created registration or a capacity error if full.

**`GET /api/events/{request_id}/registrations`**
Authenticated (instructor/admin). Returns all registrations (native + Meetup-sourced) for an event, with check-in status.

**`POST /api/events/{request_id}/reconcile`**
Authenticated (instructor/admin). Accepts attendance marks for each registration and the additional kids count.

---

## 9. Technical Architecture

This is a preliminary architecture. Detailed technical design is a separate document.

- **Web app:** Hosted at events.jointheleague.org. Two Astro components embedded on jointheleague.org surface the public-facing request and registration flows.
- **Database:** PostgreSQL for all app data (instructor profiles, event requests, registrations, email threads, donation tracking, follow-up email templates).
- **Auth:** Pike13 OAuth for instructors and admins only. Requesters and attendees access their requests and registration pages via obscure URLs sent in emails — no accounts required for basic flows. Requesters get a magic-link account (keyed to email) created automatically on email verification, giving them access to the requester dashboard. Site representatives have persistent accounts with magic link email as the default login method and optional Google OAuth for convenience. Staff can see all requests when logged in and can share direct links. Request URLs are unguessable but not authenticated.
- **Email:** Amazon SES for inbound routing (per-request addresses via SNS/Lambda) and outbound (notifications, registration digests, iCal, post-event follow-up).
- **AI processing:** Email content sent to an LLM (Claude Haiku or similar) for extraction. Results written to Postgres and Asana. No autonomous outbound actions.
- **Integrations:** Pike13 API (read availability, auth, write bookings), Meetup API (create events, update RSVP limits, read RSVPs), Asana API (create/update tasks, receive webhooks), Google Calendar API (create events, send invites), jointheleague.org content.json (read class data), Give Lively (Zapier webhook or API polling for donation notifications).
- **Content:** No local content storage. All class descriptions, images, and metadata pulled from content.json at render time or cached with short TTL. Follow-up email templates are stored in the app's database, keyed to class slug.
- **Astro components:** The registration system is a headless API — it returns data, not HTML. The Astro components own all rendering and styling on jointheleague.org. This keeps the look and feel consistent with the rest of the site.

---

## 10. Resolved Decisions

**Pike13 API write-back.** Confirmed: the system will write bookings back to Pike13 when an instructor is assigned, so the event appears on their Pike13 calendar.

**Meetup API access.** Confirmed: we can create events, update RSVP limits, and read RSVPs via the Meetup API.

**Drive time calculation.** Using zip code centroid distances with some accounting for time of day. Simple and sufficient for v1. May upgrade to a routing API later if accuracy becomes a problem.

**AI extraction scope.** Will use a lightweight model (Claude Haiku or similar). The AI's job is to recognize status transitions in email threads and extract action items. Conservative approach: only act on high-confidence extractions, flag ambiguous content for admin review.

**Asana bidirectional sync.** Yes. Status changes in Asana propagate back to the event app via Asana webhooks.

**Date voting deadline.** Configurable per event. The system will have a default (TBD) that admins can override when setting up the event.

**Instructor consent.** Required. When a request matches an instructor, they receive an email and must accept. The system sends reminders on a schedule. After a configurable timeout, the system moves to the next matched instructor.

**Equipment tracking.** The League's inventory system will support equipment reservation via API. This system will check equipment availability when showing dates and reserve equipment when an event is confirmed.

**Multi-session events.** Out of scope. This system handles single-session Tech Club events only.

**Requester accounts.** Requesters get a magic-link account created automatically on email verification. Access is via obscure URLs sent in email plus the dashboard (authenticated via magic link). Staff (logged in via Pike13) can see all requests and share links. Request pages are open but unguessable.

**Site representative accounts.** Site reps get persistent accounts tied to their email address, created during the initial registration flow. Default login is magic link. Optional Google OAuth for reps who want quicker access. No forced account setup beyond the initial registration. Each site has a public page with a login link that triggers the magic link email.

**Public event registration.** No minimum headcount gate for public events. No date voting — the date is finalized during coordination before the Meetup event is created. Meetup RSVP is optional when a host has their own registration system.

**External registration for public events.** Hosts may optionally provide an external registration URL. This link is included prominently at the top of the Meetup event description as a "Host Registration" hyperlink. The field can be provided at intake or added/edited later by an admin.

**Registration digest emails.** The system sends periodic registration summaries to the event email thread for public events, including native vs. Meetup breakdown and a soft ask for hosts to share their own totals.

**Native registration for public events.** Meetup is one of two registration channels — not the sole channel. Native registration runs in parallel, using a headless API consumed by an Astro component on jointheleague.org. The Meetup event description links to the native registration page. The Meetup RSVP limit is programmatically adjusted as native registrations come in.

**Unified capacity model.** Kids are the unit of capacity. Native registrations count exactly. Meetup RSVPs use a heuristic: guest count of 1 = 1 kid; guest count of 2+ = total minus 1 adult. Volunteers don't count against capacity. When capacity hits zero, native registration shows as full and offers a waitlist. The Meetup RSVP limit is adjusted accordingly.

**Two Astro components, not one.** The Request Discovery Component (A1) and the Event Registration Component (A2) are separate. A1 lives on listing pages and is about finding/requesting events. A2 lives on individual class pages and is about registering for confirmed events.

**Available dates shown as a list, not a calendar.** There aren't enough events to justify a calendar UI. A flat list grouped by class, with date and general area, is clearer.

**Private event gate is a checkbox, not a separate flow.** Public and private requests share the same discovery component. Checking "private event" shows additional requirements inline.

**Donation lifecycle — two-phase.** Encouragement at submission (Screen B2) and a post-event follow-up email within 48 hours of completion. Follow-up content varies: no-donor gets a donation ask, pre-event donor gets a thank-you and softer CTA.

**Donation matching by email, with request-ID parameter.** Email is the primary matching key. Request-ID parameter on the Give Lively URL is a secondary signal.

**Pre-event vs. post-event determination.** If donation timestamp is before the confirmed event date → `pre_event`. If after → `post_event`. If event not yet confirmed → `pre_event` by default.

**Follow-up email for requester only.** Not all attendees. Follow-up is not sent for cancelled events.

**Templated follow-up email content.** Class-level templates with staged/stock images for now. Actual event photos are a future feature.

**48-hour delay on follow-up email.** Gives the instructor time to complete attendance reconciliation and gives the requester a beat after the event.

**Attendance reconciliation is post-event, not at-the-door.** A rough-count tool filled out after the event. Completing it triggers the `completed` status transition; fallback is manual admin action or a 72-hour time trigger.

**Waitlist.** When native registration is full, the system offers a waitlist connected to Meetup's waitlist functionality where applicable.

**Duplicate detection.** Best-effort name matching across native registrations and Meetup RSVPs. Likely duplicates are flagged and not double-counted.

**Zip code persists for recognized users.** If the system recognizes the user via their requester account/magic link session, their zip code is pre-populated on future visits.

**Rate limit.** 10 active requests per requester email. No business rule limits multiple concurrent requests, just the rate limit for spam prevention.

**Dashboard access primarily via email links.** The requester dashboard is accessed mainly through links in status-update emails. The jointheleague.org site has an existing "Login to your account" link the event system dashboard is accessible from.

---

## 11. Open Questions

**Instructor reminder cadence.** How frequently should the system remind an unresponsive instructor before moving on? What's the timeout — 24 hours? 48?

**Equipment reservation API.** The inventory system integration is planned but the API contract isn't finalized yet. Needs coordination with inventory system development.

**Meetup group selection logic.** When a public event is created, the mapping from class topic to Meetup group needs to handle edge cases — classes that span multiple subgroups, or new classes that don't have a mapping yet.

**Email thread participant management.** Can participants be added to or removed from the email thread mid-conversation? What happens to thread continuity if someone is added late?

**Donation link customization.** Is the Give Lively link the same for all events, or can it be customized per event (e.g. pre-filled with the estimated cost)?

**Registration digest cadence.** How frequently should registration digests be sent? Weekly until the last week then daily? Fixed interval? Configurable per event?

**RSVP sync frequency.** The system will periodically sync Meetup RSVP data up until the day of the event. Exact polling interval TBD.

**Meetup RSVP heuristic accuracy.** The "subtract one adult" rule is the default. Should the system allow admins to override the estimated kid count for individual Meetup RSVPs if they know the actual breakdown?

**Give Lively custom field support.** Can Give Lively's donation forms accept and return custom URL parameters (like a request ID)? This affects how reliably we can match donations to specific events. Needs investigation during implementation.

**Recurring donors.** If a requester sets up a recurring donation through Give Lively, how should that be tracked? The first donation matches to the event request, but subsequent monthly donations don't map to a specific event.

**Multi-requester events.** If additional contacts (e.g. a school principal) are on the event thread, should they also receive the follow-up email? Or strictly the primary requester?

**Donation amount visibility.** Should the admin dashboard show exact donation amounts, or just the binary donated/not-donated status?

---

## 12. Suggested Phasing

### Phase 1: Request Intake + Coordination

- Requestable class flag in content.json
- Request Discovery Component on jointheleague.org (Screen A1)
- Request intake form and donation/confirmation page on event app (Screens B1, B2)
- Email verification flow (Screen B3) and requester dashboard (Screen B4)
- Instructor profiles in Postgres (topics, geography)
- Pike13 OAuth and availability reading
- Geographic/topic matching (zip centroid) and date display
- Instructor consent flow with reminders
- Per-request email address creation and routing (Amazon SES)
- Site registration: tokenized invitation links, site rep registration form, site representative accounts, magic link login, registered site data model
- Optional Google OAuth for site representatives
- Site selection in request intake form (registered site picker + free-text fallback)
- Automatic addition of site representatives to event email threads
- Asana task creation
- Admin dashboard to view and manage requests

### Phase 2a: Native Registration

- Native registration API for public events
- Event Registration Component on jointheleague.org (Screen A2)
- Unified capacity tracking (native + Meetup heuristic)
- Meetup RSVP limit adjustment via API
- Waitlist when native registration full
- Meetup event description updated with native registration link

### Phase 2b: Private Event Registration + Event Finalization

- Private event registration with date voting (Screen B6)
- Minimum headcount threshold logic
- iCal invite generation and delivery (private events)
- Google Calendar integration
- Public event: Meetup event creation via API (with external registration link support)
- Periodic Meetup RSVP sync
- Registration digest emails to event email thread (including native/Meetup breakdown)
- Pike13 write-back: book instructor when event confirmed

### Phase 2c: Attendance Reconciliation

- Post-event attendance reconciliation view (instructor/admin)
- Confirmed attendees / no-shows / walk-in count
- `completed` status transition from reconciliation

### Phase 3: AI + Automation + Donation Lifecycle

- AI email thread extraction (Haiku)
- Automated Asana updates from email content (including host registration counts)
- Asana bidirectional sync via webhooks
- Give Lively donation tracking (Zapier webhook or API polling)
- Post-event follow-up email (§3.9), varying by donation status
- Follow-up email template management (admin)
- Donation reporting on admin dashboard
- Notification automation (reminders, deadlines, threshold alerts)
- Equipment reservation via inventory system API

### Phase 4: Polish

- Instructor dashboard with event history
- Analytics and reporting
- Donation link customization
- Event photo upload for follow-up emails
- Edge case handling (late participant additions, no-instructor-available workflows)
