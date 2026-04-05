import { useState } from 'react';
import { Link } from 'react-router-dom';
import LeagueHeader from './components/LeagueHeader';
import { mockClass } from './mock-data';
import { REGIONS } from './zip-data';
import { scheduledEvents, generatedSlots } from './staff-availability';
import type { ScheduledEvent } from './staff-availability';

const ORANGE = '#ea580c';
const CAL_DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Calendar helpers (same logic as RequestPublic)
const WIREFRAME_TODAY = new Date(2026, 3, 7);

function getUpcomingWeeks(startDate: Date, numWeeks: number) {
  const begin = new Date(startDate);
  begin.setDate(begin.getDate() - begin.getDay()); // align to Sunday
  const weeks: Date[][] = [];
  const cursor = new Date(begin);
  for (let w = 0; w < numWeeks; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function calDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function calFormatDay(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function buildEventCalMap(events: ScheduledEvent[]): Map<string, ScheduledEvent[]> {
  const map = new Map<string, ScheduledEvent[]>();
  for (const evt of events) {
    const parsed = new Date(evt.date.replace(/^[A-Za-z]+, /, ''));
    const key = calDateKey(parsed);
    const arr = map.get(key) ?? [];
    arr.push(evt);
    map.set(key, arr);
  }
  return map;
}

const upcomingWeeks = getUpcomingWeeks(WIREFRAME_TODAY, 5);
const upcomingEventMap = buildEventCalMap(scheduledEvents);
const CONTAINER_MAX = 1000;

// ── Upcoming Events (list + calendar toggle) ─────────────────

function UpcomingEvents() {
  const [view, setView] = useState<'list' | 'calendar'>('list');

  return (
    <div style={styles.eventsSection}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h2 style={{ ...styles.sectionHeading, margin: 0 }}>Upcoming Events</h2>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            style={view === 'list' ? evtStyles.viewBtnActive : evtStyles.viewBtn}
            onClick={() => setView('list')}
          >
            List
          </button>
          <button
            style={view === 'calendar' ? evtStyles.viewBtnActive : evtStyles.viewBtn}
            onClick={() => setView('calendar')}
          >
            Calendar
          </button>
        </div>
      </div>
      <p style={{ ...styles.bodyText, marginBottom: '16px' }}>
        These sessions are already scheduled. Click to register.
      </p>

      {view === 'list' ? (
        <div style={styles.eventsList}>
          {scheduledEvents.map((evt) => (
            <Link key={evt.id} to="/a2-registration" style={styles.eventRowCompact}>
              <span style={styles.eventColRegion}>{evt.region}</span>
              <span style={styles.eventColDate}>{evt.date}</span>
              <span style={styles.eventColTime}>{evt.timeRange}</span>
              <span style={styles.eventAction}>Register &rarr;</span>
            </Link>
          ))}
        </div>
      ) : (
        <div style={evtStyles.calGrid}>
          {CAL_DAY_HEADERS.map((d) => (
            <div key={d} style={evtStyles.calHeader}>{d}</div>
          ))}
          {upcomingWeeks.map((week) =>
            week.map((day) => {
              const key = calDateKey(day);
              const dayEvents = upcomingEventMap.get(key) ?? [];
              const isPast = day < WIREFRAME_TODAY;
              return (
                <div key={key} style={{ ...evtStyles.calCell, ...(isPast ? evtStyles.calCellPast : {}) }}>
                  <div style={evtStyles.calDate}>{calFormatDay(day)}</div>
                  {dayEvents.map((evt) => (
                    <Link key={evt.id} to="/a2-registration" style={evtStyles.calSlot}>
                      <div>{evt.startTime}</div>
                      <div style={evtStyles.calSlotRegion}>{evt.region}</div>
                    </Link>
                  ))}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

const evtStyles: Record<string, React.CSSProperties> = {
  viewBtn: {
    padding: '4px 12px', fontSize: '12px', fontWeight: 500,
    border: '1px solid #d1d5db', borderRadius: '4px',
    background: '#fff', color: '#6b7280', cursor: 'pointer', fontFamily: 'inherit',
  },
  viewBtnActive: {
    padding: '4px 12px', fontSize: '12px', fontWeight: 600,
    border: `1px solid ${ORANGE}`, borderRadius: '4px',
    background: '#fff7ed', color: ORANGE, cursor: 'pointer', fontFamily: 'inherit',
  },
  calGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px',
    background: '#e5e7eb', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden',
  },
  calHeader: {
    background: '#f3f4f6', padding: '6px 4px', fontSize: '11px', fontWeight: 700,
    color: '#6b7280', textAlign: 'center' as const, textTransform: 'uppercase' as const,
  },
  calCell: {
    background: '#fff', padding: '4px', minHeight: '70px',
    display: 'flex', flexDirection: 'column' as const, gap: '2px',
  },
  calCellPast: { background: '#fafafa', opacity: 0.5 },
  calDate: { fontSize: '11px', fontWeight: 600, color: '#9ca3af', marginBottom: '2px' },
  calSlot: {
    display: 'block', width: '100%', padding: '3px 4px', fontSize: '10px', fontWeight: 500,
    color: '#1e40af', background: '#dbeafe', border: '1px solid #bfdbfe', borderRadius: '3px',
    textAlign: 'center' as const, textDecoration: 'none',
  },
  calSlotRegion: {
    fontSize: '8px', fontWeight: 400, color: '#6b7280', marginTop: '1px',
  },
};

// ── Request an Event (interactive component) ─────────────────

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

function RequestAnEvent() {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());
  const [eventType, setEventType] = useState<'public' | 'private'>('public');

  function toggleDay(day: string) {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  }

  const canProceed = selectedRegion !== '' && selectedDays.size > 0;

  const targetPath = eventType === 'public' ? '/request-public' : '/request-private';
  const params = new URLSearchParams();
  if (selectedRegion) params.set('region', selectedRegion);
  if (selectedDays.size > 0) params.set('days', [...selectedDays].join(','));

  return (
    <div style={reqStyles.section}>
      <h2 style={styles.sectionHeading}>Request an Event</h2>
      <p style={{ ...styles.bodyText, marginBottom: '24px' }}>
        Want to bring {mockClass.title.split(' \u2014')[0]} to your community?
        Tell us where and when, and we'll match you with an available instructor.
      </p>

      {/* Region */}
      <div style={reqStyles.fieldGroup}>
        <label style={reqStyles.label}>Part of Town</label>
        <div style={reqStyles.regionGrid}>
          {REGIONS.map((region) => (
            <button
              key={region}
              style={selectedRegion === region ? reqStyles.chipActive : reqStyles.chip}
              onClick={() => setSelectedRegion(region)}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Days of week */}
      <div style={reqStyles.fieldGroup}>
        <label style={reqStyles.label}>Preferred Days</label>
        <div style={reqStyles.dayGrid}>
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day}
              style={selectedDays.has(day) ? reqStyles.chipActive : reqStyles.chip}
              onClick={() => toggleDay(day)}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
        <div style={reqStyles.quickLinks}>
          <button style={reqStyles.quickLink} onClick={() => setSelectedDays(new Set(['Monday','Tuesday','Wednesday','Thursday','Friday']))}>weekdays</button>
          <button style={reqStyles.quickLink} onClick={() => setSelectedDays(new Set(['Saturday','Sunday']))}>weekends</button>
          <button style={reqStyles.quickLink} onClick={() => setSelectedDays(new Set(DAYS_OF_WEEK))}>all</button>
          <button style={reqStyles.quickLink} onClick={() => setSelectedDays(new Set())}>none</button>
        </div>
      </div>

      {/* Event type — radio group */}
      <div style={reqStyles.fieldGroup}>
        <label style={reqStyles.label}>Type of Event</label>
        <div style={reqStyles.typeOptions}>
          <label style={reqStyles.radioLabel}>
            <input
              type="radio"
              name="eventType"
              checked={eventType === 'public'}
              onChange={() => setEventType('public')}
              style={reqStyles.radio}
            />
            <div>
              <div style={reqStyles.radioTitle}>Public</div>
              <div style={reqStyles.radioDesc}>
                Bring a public class to a library, rec center or public youth center
              </div>
            </div>
          </label>
          <label style={reqStyles.radioLabel}>
            <input
              type="radio"
              name="eventType"
              checked={eventType === 'private'}
              onChange={() => setEventType('private')}
              style={reqStyles.radio}
            />
            <div>
              <div style={reqStyles.radioTitle}>Private</div>
              <div style={reqStyles.radioDesc}>
                A private class for your scouting, youth or church group
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* CTA */}
      {canProceed ? (
        <Link to={`${targetPath}?${params.toString()}`} style={reqStyles.ctaButton}>
          Continue &rarr;
        </Link>
      ) : (
        <button style={reqStyles.ctaButtonDisabled} disabled>
          Continue &rarr;
        </button>
      )}
    </div>
  );
}

const reqStyles: Record<string, React.CSSProperties> = {
  section: {
    marginTop: '48px',
    paddingTop: '40px',
    borderTop: '1px solid #e5e7eb',
  },
  fieldGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '8px',
  },
  regionGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  dayGrid: {
    display: 'flex',
    gap: '6px',
  },
  quickLinks: {
    display: 'flex',
    gap: '12px',
    marginTop: '6px',
  },
  quickLink: {
    background: 'none',
    border: 'none',
    padding: 0,
    fontSize: '12px',
    color: '#6b7280',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontFamily: 'inherit',
  },
  chip: {
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: 500,
    border: '1px solid #d1d5db',
    borderRadius: '20px',
    background: '#fff',
    color: '#374151',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  chipActive: {
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: 600,
    border: `1px solid ${ORANGE}`,
    borderRadius: '20px',
    background: '#fff7ed',
    color: ORANGE,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  typeOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '12px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  radio: {
    marginTop: '3px',
    accentColor: ORANGE,
    width: '16px',
    height: '16px',
    flexShrink: 0,
  },
  radioTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#1a1a1a',
  },
  radioDesc: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '2px',
  },
  ctaButton: {
    display: 'inline-block',
    padding: '12px 28px',
    background: ORANGE,
    color: '#fff',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '15px',
    marginTop: '8px',
  },
  ctaButtonDisabled: {
    display: 'inline-block',
    padding: '12px 28px',
    background: '#d1d5db',
    color: '#9ca3af',
    borderRadius: '6px',
    border: 'none',
    fontWeight: 600,
    fontSize: '15px',
    marginTop: '8px',
    cursor: 'not-allowed',
    fontFamily: 'inherit',
  },
};

// ── Main Page ─────────────────────────────────────────────────

export default function ClassPage() {
  return (
    <div style={styles.page}>
      <LeagueHeader />

      <main>
        {/* ── Hero ────────────────────────────────────────── */}
        <section style={styles.hero}>
          <div style={styles.heroInner}>
            <div style={styles.heroText}>
              <h1 style={styles.heroTitle}>{mockClass.title}</h1>
              <p style={styles.heroSubtitle}>{mockClass.subtitle}</p>
            </div>
            <div style={styles.heroImage}>
              <span style={styles.heroImageLabel}>Micro:bit image</span>
            </div>
          </div>
        </section>

        {/* ── Course Overview ──────────────────────────────── */}
        <section style={styles.section}>
          <div style={styles.container}>
            <div style={styles.overviewGrid}>
              {/* Left: description */}
              <div style={styles.overviewMain}>
                <h2 style={styles.sectionHeading}>Course Overview</h2>
                <p style={styles.bodyText}>{mockClass.description}</p>
              </div>

              {/* Right: sidebar */}
              <aside style={styles.sidebar}>
                <div style={styles.sidebarBlock}>
                  <div style={styles.sidebarLabel}>Level</div>
                  <div style={styles.sidebarValue}>{mockClass.level}</div>
                </div>

                <div style={styles.sidebarBlock}>
                  <div style={styles.sidebarLabel}>Topics</div>
                  <ul style={styles.pillList}>
                    {mockClass.topics.map((topic) => (
                      <li key={topic} style={styles.pill}>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={styles.sidebarBlock}>
                  <div style={styles.sidebarLabel}>Curriculum</div>
                  <a href={mockClass.curriculumUrl} style={styles.curriculumLink}>
                    View Curriculum
                  </a>
                </div>
              </aside>
            </div>

            {/* ── Part of These Programs ───────────────────── */}
            <div style={styles.programsSection}>
              <h3 style={styles.programsHeading}>Part of These Programs</h3>
              <div style={styles.programsGrid}>
                {mockClass.programs.map((prog) => (
                  <a key={prog.name} href={prog.url} style={styles.programCard}>
                    <div style={styles.programImagePlaceholder}>
                      <span style={styles.programImageLabel}>{prog.name}</span>
                    </div>
                    <div style={styles.programCardBody}>
                      <h4 style={styles.programCardTitle}>{prog.name}</h4>
                      <p style={styles.programCardDesc}>{prog.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* ── Scheduled Events ─────────────────────────── */}
            <UpcomingEvents />

            {/* ── Request an Event ─────────────────────────── */}
            <RequestAnEvent />
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          {/* Three columns */}
          <div style={styles.footerColumns}>
            {/* Column 1: The LEAGUE */}
            <div style={styles.footerCol}>
              <h3 style={styles.footerColHeading}>The LEAGUE</h3>
              <p style={styles.footerText}>
                We prepare young people for the science and technology careers of the 21st century
                through real coding education, professional mentorship, and project-based learning.
              </p>
              <p style={styles.footerText}>501(c)(3) Tax ID: 20-4744610.</p>
            </div>

            {/* Column 2: Visit & Contact */}
            <div style={styles.footerCol}>
              <h4 style={styles.footerColSubheading}>Visit &amp; Contact</h4>
              <p style={styles.footerText}>
                12625 High Bluff Drive #113, San Diego, CA 92130{' '}
                <a
                  href="https://goo.gl/maps/GUdss2BayCqGmDCLA"
                  style={styles.footerLink}
                >
                  Get directions
                </a>
              </p>
              <p style={styles.footerText}>
                <a href="tel:18582840481" style={styles.footerLink}>
                  (858) 284-0481
                </a>{' '}
                <a href="mailto:info@jointheleague.org" style={styles.footerLink}>
                  info@jointheleague.org
                </a>
              </p>
            </div>

            {/* Column 3: Stay Connected */}
            <div style={styles.footerCol}>
              <h4 style={styles.footerColSubheading}>Stay Connected</h4>
              <ul style={styles.socialList}>
                {[
                  { label: 'Facebook', href: 'https://www.facebook.com/LeagueOfAmazingProgrammers' },
                  { label: 'Twitter', href: 'https://twitter.com/LEAGUEofAmazing' },
                  { label: 'Instagram', href: 'https://www.instagram.com/theleagueofamazingprogrammers/' },
                  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCkUULukaHTW8ljTXKXXGE5A' },
                  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/the-league-of-amazing-programmers' },
                ].map((s) => (
                  <li key={s.label} style={styles.socialItem}>
                    <a href={s.href} style={styles.footerLink}>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer nav */}
          <nav style={styles.footerNav}>
            {[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about/' },
              { label: 'Impact', href: '/about/impact/' },
              { label: 'News', href: '/news/' },
              { label: 'Classes', href: '/classes/' },
              { label: 'Policies', href: '/about/policies/' },
              { label: 'Support', href: '/support/' },
              { label: 'Volunteer', href: '/support/volunteer/' },
              { label: 'Create a Fundraiser', href: '/donate/create-a-fundraiser/' },
              { label: 'Curriculum', href: 'https://curriculum.jointheleague.org/' },
            ].map((link) => (
              <a key={link.label} href={link.href} style={styles.footerNavLink}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <div style={styles.footerCopyright}>
            &copy; 2026 The LEAGUE of Amazing Programmers.
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#1a1a1a',
    background: '#fff',
  },

  // ── Hero ──────────────────────────────────────────────────────
  hero: {
    background: 'linear-gradient(135deg, #fef3e8 0%, #fde8d3 100%)',
    padding: '48px 24px',
  },
  heroInner: {
    maxWidth: CONTAINER_MAX,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#1a1a1a',
    margin: '0 0 16px',
    lineHeight: 1.2,
  },
  heroSubtitle: {
    fontSize: '17px',
    color: '#4b5563',
    margin: 0,
    lineHeight: 1.6,
  },
  heroImage: {
    width: 260,
    height: 180,
    background: '#f0d9c8',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  heroImageLabel: {
    color: '#9a6a4a',
    fontSize: '14px',
    fontStyle: 'italic',
  },

  // ── Generic section wrapper ───────────────────────────────────
  section: {
    padding: '0 24px',
  },
  container: {
    maxWidth: CONTAINER_MAX,
    margin: '0 auto',
    paddingTop: '48px',
    paddingBottom: '48px',
  },

  // ── Course Overview ───────────────────────────────────────────
  overviewGrid: {
    display: 'flex',
    gap: '40px',
    alignItems: 'flex-start',
  },
  overviewMain: {
    flex: 1,
  },
  sectionHeading: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1a1a1a',
    margin: '0 0 16px',
  },
  bodyText: {
    fontSize: '16px',
    color: '#374151',
    lineHeight: 1.7,
    margin: '0 0 12px',
  },
  sidebar: {
    width: 220,
    flexShrink: 0,
    background: '#fafafa',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sidebarBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  sidebarLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  sidebarValue: {
    fontSize: '15px',
    color: '#1a1a1a',
    textTransform: 'capitalize',
  },
  pillList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  pill: {
    background: '#fff7ed',
    color: ORANGE,
    fontSize: '12px',
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: '999px',
    border: '1px solid #fed7aa',
  },
  curriculumLink: {
    color: ORANGE,
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'none',
  },

  // ── Part of These Programs ────────────────────────────────────
  programsSection: {
    marginTop: '48px',
    paddingTop: '40px',
    borderTop: '1px solid #e5e7eb',
  },
  programsHeading: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1a1a1a',
    margin: '0 0 20px',
  },
  programsGrid: {
    display: 'flex',
    gap: '20px',
  },
  programCard: {
    flex: 1,
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
  },
  programImagePlaceholder: {
    height: 120,
    background: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  programImageLabel: {
    fontSize: '13px',
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  programCardBody: {
    padding: '16px',
  },
  programCardTitle: {
    fontSize: '16px',
    fontWeight: 700,
    margin: '0 0 8px',
    color: '#1a1a1a',
  },
  programCardDesc: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
    lineHeight: 1.5,
  },

  // ── Scheduled Events ──────────────────────────────────────────
  eventsSection: {
    marginTop: '48px',
    paddingTop: '40px',
    borderTop: '1px solid #e5e7eb',
  },
  eventsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  eventRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '16px 20px',
    borderBottom: '1px solid #f3f4f6',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'background 0.1s',
  },
  eventDateBlock: {
    width: '120px',
    flexShrink: 0,
  },
  eventDay: {
    fontSize: '13px',
    fontWeight: 600,
    color: ORANGE,
    textTransform: 'uppercase',
  },
  eventFullDate: {
    fontSize: '14px',
    color: '#374151',
    fontWeight: 500,
  },
  eventDetails: {
    flex: 1,
    minWidth: 0,
  },
  eventName: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#1a1a1a',
    marginBottom: '2px',
  },
  eventMeta: {
    fontSize: '14px',
    color: '#6b7280',
  },
  eventRowCompact: {
    display: 'grid',
    gridTemplateColumns: '160px 200px 140px auto',
    alignItems: 'center',
    gap: '8px',
    padding: '7px 0',
    borderBottom: '1px solid #f3f4f6',
    textDecoration: 'none',
    color: 'inherit',
  },
  eventColRegion: {
    fontSize: '13px',
    color: '#6b7280',
  },
  eventColDate: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#1a1a1a',
  },
  eventColTime: {
    fontSize: '13px',
    color: '#374151',
  },
  eventAction: {
    fontSize: '14px',
    fontWeight: 600,
    color: ORANGE,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  eventActionWaitlist: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#6b7280',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  fullBadge: {
    display: 'inline-block',
    marginLeft: '8px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#991b1b',
    background: '#fee2e2',
    padding: '1px 8px',
    borderRadius: '9999px',
    verticalAlign: 'middle',
  },


  // ── Footer ────────────────────────────────────────────────────
  footer: {
    background: '#1a1a1a',
    color: '#d1d5db',
  },
  footerInner: {
    maxWidth: CONTAINER_MAX,
    margin: '0 auto',
    padding: '48px 24px 24px',
  },
  footerColumns: {
    display: 'flex',
    gap: '40px',
    marginBottom: '40px',
  },
  footerCol: {
    flex: 1,
  },
  footerColHeading: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 12px',
  },
  footerColSubheading: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 12px',
  },
  footerText: {
    fontSize: '14px',
    color: '#9ca3af',
    lineHeight: 1.6,
    margin: '0 0 8px',
  },
  footerLink: {
    color: '#d1d5db',
    textDecoration: 'none',
  },
  socialList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  socialItem: {
    fontSize: '14px',
  },
  footerNav: {
    borderTop: '1px solid #374151',
    paddingTop: '24px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px 24px',
    marginBottom: '24px',
  },
  footerNavLink: {
    color: '#9ca3af',
    textDecoration: 'none',
    fontSize: '13px',
  },
  footerCopyright: {
    fontSize: '13px',
    color: '#6b7280',
    borderTop: '1px solid #374151',
    paddingTop: '20px',
  },
};
