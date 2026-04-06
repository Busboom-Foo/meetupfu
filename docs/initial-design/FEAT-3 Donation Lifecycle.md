# Feature: Donation Lifecycle & Post-Event Follow-Up

**Tech Club Event Request System**
Feature Document — April 2026
Base specification: Tech Club Event Request System v0.5
Related features: FEAT-1 Native Registration, FEAT-2 Public UI Wireframes

---

## 1. Summary

Extend the donation touchpoints from a single pre-submission encouragement (spec §3.1 step 6) into a two-phase lifecycle: an initial donation opportunity during the request process, and a post-event follow-up email that thanks the requester, shows what the kids did, and asks again if they haven't donated yet. The system tracks donation status per event request via Give Lively's Zapier integration, recording whether the requester donated and whether that donation came before or after the event.

---

## 2. Problem

The current spec presents donation encouragement once — on the confirmation page right before the requester submits their request. This is the moment the requester is most focused on completing the form, not on giving money. There's no second chance. If they skip the donation link, the system never asks again.

Meanwhile, the period right after a successful event is when the requester has the most emotional connection to the League's mission — they've seen kids light up over code or robots. That's the moment to ask. Right now, there's no mechanism to do that.

---

## 3. Feature Description

### 3.1 Donation Tracking

Each event request tracks the requester's donation status:

- `donation_status`: none, pre_event, post_event
- `donation_amount`: nullable, populated when a donation is matched
- `donation_timestamp`: when the donation was recorded

The system matches donations from Give Lively to event requests by requester email. When a donation comes in from Give Lively with an email that matches an active requester, the system updates the corresponding event request record.

If a requester has multiple active requests, the donation is associated with the most recently confirmed (or, if none are confirmed, the most recently created) request.

### 3.2 Give Lively Integration

Give Lively supports a Zapier integration that triggers when a new donation is received. The event system receives donation notifications via one of two paths:

**Option A: Zapier → Webhook.** A Zap fires on each new Give Lively donation and sends a webhook to the event system with donor email and amount. The event system matches the email to a requester and updates donation status.

**Option B: Give Lively API polling.** The system periodically queries Give Lively's API for recent donations and matches by email. Less real-time but avoids the Zapier dependency.

Either path produces the same result: a donation record linked to an event request. The implementation choice is deferred.

To make matching reliable, the Give Lively donation link presented to requesters should be parameterized with the request ID or the requester's email where Give Lively supports custom fields or URL parameters. This reduces reliance on email matching alone.

### 3.3 Pre-Event Donation Touchpoint

This already exists in the spec (§3.1 step 6, implemented as FEAT-2 Screen B2). No change to the flow — the confirmation/donation page shows estimated event cost and a Give Lively link. The only addition is that the Give Lively link now includes a parameter tying the donation back to the event request, so the system can track it.

### 3.4 Post-Event Follow-Up Email

After an event reaches `completed` status, the system sends a follow-up email to the requester. The timing and content depend on donation status:

**If the requester has NOT donated (`donation_status = none`):**

The email is sent within 48 hours of event completion. Content:

- Thank-you message for organizing the event
- Templated content about what kids typically do in that class (pulled from class description and a per-class follow-up template)
- Placeholder image slots for event photos (templated stock/class-type images for now; actual event photos are a future feature)
- Links to student project examples or class resources where applicable
- A donation ask: estimated cost of the event, what the donation covers (instructor time, equipment, curriculum), and a Give Lively link
- The Give Lively link in this email also carries the request ID parameter for tracking

**If the requester HAS donated (`donation_status = pre_event`):**

The email is sent within 48 hours of event completion. Content:

- Thank-you message for both organizing and donating
- Same templated class content and images
- No donation ask — they already gave
- A softer call-to-action: share the League with others, link to volunteer page, link to upcoming events

### 3.5 Email Templates

Each requestable class has a follow-up email template stored in the system. A template includes:

- Class-specific description of what kids do ("In this session, students built their first Python game..." or "Kids programmed robots to navigate an obstacle course...")
- Placeholder image references (keyed to class slug — initially stock/staged photos, replaced with actual event photos when that feature exists)
- Links to relevant resources (class curriculum page on jointheleague.org, example student projects)

Templates are managed by admins. A default fallback template exists for classes without a custom one.

### 3.6 Donation Reporting

The admin dashboard gains a donation summary view per event:

- Donation status (none / pre / post)
- Amount (if tracked)
- Whether the follow-up email has been sent
- Overall donation rate across all events (what percentage of requesters donate, broken down by pre-event vs. post-event)

This helps the League understand whether the follow-up email is working and adjust the messaging.

---

## 4. Interaction with Existing Spec and Features

### 4.1 Spec References

- The pre-event donation encouragement (§3.1 step 6) is unchanged in flow. The Give Lively link gains a tracking parameter.
- The `completed` status in the event request lifecycle (§3.1) is the trigger for the follow-up email.
- The existing donation_link field on Event Request (§5.5) now needs to support per-request parameterization rather than a static URL.

### 4.2 FEAT-1 Interaction

The attendance reconciliation from FEAT-1 (§3.4) feeds into the `completed` status transition. Once an instructor marks attendance, the event moves to completed, which triggers the follow-up email. If no reconciliation happens, an admin manually marks the event complete, or a time-based trigger fires (e.g. 72 hours after the event date).

### 4.3 FEAT-2 Interaction

FEAT-2's Screen B2 (Donation & Confirmation) is where the pre-event donation touchpoint lives. The Give Lively link on that screen now carries the request ID parameter. Screen B5 (Event Detail) could show donation status to the requester, though this is optional — the requester doesn't necessarily need to see whether the system recorded their donation.

### 4.4 Changes to Data Model

**Modified: Event Request (§5.5)**

Add:

- `donation_status` — enum: none, pre_event, post_event (default: none)
- `donation_amount` — nullable decimal
- `donation_timestamp` — nullable datetime
- `followup_email_sent_at` — nullable datetime

**New: Follow-Up Email Template**

- `template_id`
- `class_slug` — FK to class in content.json (or null for the default template)
- `subject_line`
- `body_template` — markdown or HTML with placeholder tokens for event-specific data (date, location, requester name)
- `image_references[]` — list of image slugs/URLs for the template
- `resource_links[]` — URLs to curriculum pages, student project examples
- `created_at`, `updated_at`

---

## 5. Resolved Decisions

**Donation matching is by email, with request-ID parameter as a secondary signal.** Email is the primary key because it's what Give Lively reliably provides. The request-ID parameter on the Give Lively URL is a belt-and-suspenders measure — if Give Lively passes it back (via URL parameters or custom fields), the system uses it for a direct match. If not, email matching is the fallback.

**Pre-event vs. post-event is determined by event date.** If the donation timestamp is before the confirmed event date, it's `pre_event`. If after, it's `post_event`. If the event hasn't been confirmed yet when the donation comes in, it's `pre_event` by default.

**Follow-up email goes to the requester only, not all attendees.** The requester is the person who organized the event and has the relationship with the League. Attendees (parents who registered kids) are a separate audience with a different communication cadence — that's a future feature.

**Templated content, not per-event content.** Event-specific photos and write-ups require an instructor upload workflow that doesn't exist yet. For now, follow-up emails use class-level templates with staged or stock images. When a photo upload feature is added later, the template system can pull actual event photos.

**48-hour delay on follow-up email.** Gives the instructor time to complete attendance reconciliation (FEAT-1) and gives the requester a beat after the event before receiving the email. Not immediate, not a week later.

---

## 6. Open Questions

**Give Lively custom field support.** Can Give Lively's donation forms accept and return custom URL parameters (like a request ID)? This affects how reliably we can match donations to specific events. Needs investigation during implementation.

**Recurring donors.** If a requester sets up a recurring donation through Give Lively, how should that be tracked? The first donation matches to the event request, but subsequent monthly donations don't map to a specific event. Possibly out of scope — recurring donors are a Give Lively concern, and the event system only needs to know "this person donated."

**Multi-requester events.** If additional contacts (e.g. a school principal) are on the event thread, should they also receive the follow-up email? Or strictly the primary requester?

**Follow-up email for cancelled events.** If an event is cancelled after confirmation, should the system still send a follow-up? Probably not, but the trigger logic needs to distinguish `completed` from `cancelled`.

**Donation amount visibility.** Should the admin dashboard show exact donation amounts, or just the binary donated/not-donated status? Depends on what Give Lively exposes and what the League considers appropriate for staff visibility.
