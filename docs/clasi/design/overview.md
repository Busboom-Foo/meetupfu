# Tech Club Event Request System — Project Overview

**The League of Amazing Programmers**

---

## What It Is

A web application that turns the League's manual Tech Club event scheduling process into a self-service, community-driven workflow. Parents, teachers, and group leaders can request free coding and robotics events for their communities directly from the League's website. The system matches requests against instructor availability, coordinates logistics via structured email threads, handles registration, and closes the loop with donation follow-up after each event.

## Who It's For

- **Requesters** — Parents, teachers, scout leaders, and group organizers who want to bring a free Tech Club class to their community.
- **Attendees** — Families who register their kids for confirmed events (public or private).
- **Instructors** — League volunteers and staff who teach events and manage their own availability.
- **Site Representatives** — Library managers, school principals, and science center coordinators whose venues host events.
- **Admins** — League staff (Jed and others) who oversee the pipeline and manage the system.

## Key Capabilities

**Request Intake.** Requesters browse requestable classes on jointheleague.org, enter a zip code to check instructor coverage, pick from available date windows, and fill out a short intake form. The system handles email verification, email thread creation, and Asana task creation automatically.

**Site Registration.** Venues (libraries, schools, science centers) register as sites through a tokenized invitation link. Registered site representatives are automatically added to the event email thread when their venue is selected for an event.

**Instructor Matching.** The system matches instructors to requests by topic, geography (zip centroid distance), and Pike13 availability. Matched instructors must accept before being assigned; the system sends reminders and escalates to the next match if they don't respond.

**Event Coordination.** Each request gets a dedicated email address. All parties — requester, admins, instructor, site representative, additional contacts — communicate through this thread. An AI agent reads the thread and extracts action items and status updates into Asana. Admins manage the pipeline in Asana with bidirectional sync.

**Registration.** Private events use an in-app shareable link with date voting and minimum headcount gating. Public events use Meetup for discovery plus a native registration form on jointheleague.org (with unified capacity tracking across both channels). Hosts may optionally provide their own external registration URL.

**Attendance Reconciliation.** After an event, instructors mark attendance against the registration list and record walk-in counts. This produces an accurate attendance number for reporting.

**Donation Follow-Up.** Requesters are encouraged to donate at submission time and again after the event. The system tracks donation status via Give Lively and tailors the post-event email based on whether the requester has already given.

## Technology Approach

- **Stack:** Node.js web application hosted at events.jointheleague.org, with Astro components embedded on the main jointheleague.org site.
- **Database:** PostgreSQL for all application data.
- **Auth:** Pike13 OAuth for instructors and admins. Magic link email for requesters and site representatives (optional Google OAuth for site reps). Requesters and attendees access most pages via obscure unguessable URLs sent in email — no account required for basic flows.
- **Email:** Amazon SES for inbound routing (per-request addresses) and outbound (notifications, digests, iCal invites).
- **Integrations:** Pike13 (auth + availability), Meetup API (public event creation + RSVP sync), Asana (task pipeline), Google Calendar (internal calendar + iCal invites), Give Lively (donation tracking via Zapier webhook or API polling), jointheleague.org content.json (class catalog).
- **AI:** A lightweight LLM (Claude Haiku or similar) reads email threads to extract status changes and action items. Read-only — the AI does not send emails.
- **Content:** Class descriptions, age ranges, topics, and equipment needs all come from jointheleague.org's content.json. The app holds no local content.

## What It Is Not

- Not a payment processor — donations go through Give Lively.
- Not a replacement for Pike13 for paid class enrollment.
- Not a multi-session course manager — single Tech Club sessions only.
- Not a content management system — class content lives on jointheleague.org.
