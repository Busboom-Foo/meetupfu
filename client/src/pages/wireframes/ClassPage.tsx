import { useState } from 'react';
import { Link } from 'react-router-dom';
import LeagueHeader from './components/LeagueHeader';
import { mockClass, mockAvailableDates, mockRequestableSlots } from './mock-data';
import { resolveLocation, haversineDistance } from './zip-data';

const ORANGE = '#ea580c';
const CONTAINER_MAX = 1000;

// ── Request an Event (interactive component) ─────────────────

function RequestAnEvent() {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<{
    lat: number; lon: number; label: string;
    nearby: { slot: typeof mockRequestableSlots[0]; distance: number }[];
    farther: { slot: typeof mockRequestableSlots[0]; distance: number }[];
  } | null>(null);
  const [notFound, setNotFound] = useState(false);

  function handleSearch() {
    const resolved = resolveLocation(query);
    if (!resolved) {
      setSearchResult(null);
      setNotFound(true);
      return;
    }
    setNotFound(false);

    const withDistance = mockRequestableSlots.map((slot) => ({
      slot,
      distance: Math.round(haversineDistance(resolved.lat, resolved.lon, slot.lat, slot.lon)),
    }));
    withDistance.sort((a, b) => a.slot.id.localeCompare(b.slot.id)); // sort by date

    setSearchResult({
      lat: resolved.lat,
      lon: resolved.lon,
      label: resolved.label,
      nearby: withDistance.filter((s) => s.distance <= 15),
      farther: withDistance.filter((s) => s.distance > 15 && s.distance <= 30),
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch();
  }

  return (
    <div style={reqStyles.section}>
      <h2 style={styles.sectionHeading}>Request an Event</h2>
      <p style={{ ...styles.bodyText, marginBottom: '20px' }}>
        Want to bring {mockClass.title.split(' \u2014')[0]} to your community? Enter your
        zip code or city to find available dates and locations near you.
      </p>

      <div style={reqStyles.searchRow}>
        <input
          type="text"
          placeholder="Zip code or city name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          style={reqStyles.searchInput}
        />
        <button style={reqStyles.searchButton} onClick={handleSearch}>
          Find Dates
        </button>
      </div>

      {notFound && (
        <p style={reqStyles.notFound}>
          We couldn't find that location in San Diego County. Try a 5-digit zip code or neighborhood name.
        </p>
      )}

      {searchResult && (
        <div style={reqStyles.results}>
          <p style={reqStyles.resultsLabel}>
            Showing availability near <strong>{searchResult.label}</strong>
          </p>

          {searchResult.nearby.length > 0 && (
            <div style={reqStyles.distanceGroup}>
              <h3 style={reqStyles.distanceHeading}>
                Within 15 miles
                <span style={reqStyles.distanceCount}>{searchResult.nearby.length} available</span>
              </h3>
              {searchResult.nearby.map(({ slot, distance }) => (
                <Link key={slot.id} to={`/b1-intake?slot=${slot.id}`} style={reqStyles.slotRow}>
                  <div style={reqStyles.slotDate}>
                    <div style={reqStyles.slotDay}>{slot.date.split(',')[0]}</div>
                    <div style={reqStyles.slotFullDate}>{slot.date.split(', ').slice(1).join(', ')}</div>
                    <div style={reqStyles.slotTime}>{slot.time}</div>
                  </div>
                  <div style={reqStyles.slotLocation}>
                    <div style={reqStyles.slotNeighborhood}>{slot.neighborhood}</div>
                    <div style={reqStyles.slotSite}>{slot.siteName}</div>
                  </div>
                  <div style={reqStyles.slotDistance}>{distance} mi</div>
                  <div style={reqStyles.slotAction}>Select &rarr;</div>
                </Link>
              ))}
            </div>
          )}

          {searchResult.farther.length > 0 && (
            <div style={reqStyles.distanceGroup}>
              <h3 style={reqStyles.distanceHeading}>
                15–30 miles away
                <span style={reqStyles.distanceCount}>{searchResult.farther.length} available</span>
              </h3>
              {searchResult.farther.map(({ slot, distance }) => (
                <Link key={slot.id} to={`/b1-intake?slot=${slot.id}`} style={reqStyles.slotRow}>
                  <div style={reqStyles.slotDate}>
                    <div style={reqStyles.slotDay}>{slot.date.split(',')[0]}</div>
                    <div style={reqStyles.slotFullDate}>{slot.date.split(', ').slice(1).join(', ')}</div>
                    <div style={reqStyles.slotTime}>{slot.time}</div>
                  </div>
                  <div style={reqStyles.slotLocation}>
                    <div style={reqStyles.slotNeighborhood}>{slot.neighborhood}</div>
                    <div style={reqStyles.slotSite}>{slot.siteName}</div>
                  </div>
                  <div style={reqStyles.slotDistance}>{distance} mi</div>
                  <div style={reqStyles.slotAction}>Select &rarr;</div>
                </Link>
              ))}
            </div>
          )}

          {searchResult.nearby.length === 0 && searchResult.farther.length === 0 && (
            <p style={reqStyles.noResults}>
              No available dates within 30 miles. Try a different location or check back later.
            </p>
          )}
        </div>
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
  searchRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '8px',
  },
  searchInput: {
    flex: 1,
    maxWidth: '300px',
    padding: '10px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '15px',
    outline: 'none',
    color: '#1a1a1a',
  },
  searchButton: {
    padding: '10px 20px',
    background: ORANGE,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  notFound: {
    color: '#991b1b',
    fontSize: '14px',
    marginTop: '12px',
  },
  results: {
    marginTop: '24px',
  },
  resultsLabel: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px',
  },
  noResults: {
    fontSize: '14px',
    color: '#6b7280',
    fontStyle: 'italic',
    padding: '20px 0',
  },
  distanceGroup: {
    marginBottom: '28px',
  },
  distanceHeading: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#374151',
    margin: '0 0 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  distanceCount: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#6b7280',
    background: '#f3f4f6',
    padding: '2px 8px',
    borderRadius: '9999px',
  },
  slotRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '14px 16px',
    borderBottom: '1px solid #f3f4f6',
    textDecoration: 'none',
    color: 'inherit',
  },
  slotDate: {
    width: '140px',
    flexShrink: 0,
  },
  slotDay: {
    fontSize: '12px',
    fontWeight: 600,
    color: ORANGE,
    textTransform: 'uppercase',
  },
  slotFullDate: {
    fontSize: '14px',
    color: '#1a1a1a',
    fontWeight: 500,
  },
  slotTime: {
    fontSize: '13px',
    color: '#6b7280',
  },
  slotLocation: {
    flex: 1,
    minWidth: 0,
  },
  slotNeighborhood: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#1a1a1a',
    marginBottom: '1px',
  },
  slotSite: {
    fontSize: '13px',
    color: '#6b7280',
  },
  slotDistance: {
    fontSize: '13px',
    color: '#9ca3af',
    width: '50px',
    textAlign: 'right',
    flexShrink: 0,
  },
  slotAction: {
    fontSize: '14px',
    fontWeight: 600,
    color: ORANGE,
    whiteSpace: 'nowrap',
    flexShrink: 0,
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
            <div style={styles.eventsSection}>
              <h2 style={styles.sectionHeading}>Upcoming Events</h2>
              <p style={{ ...styles.bodyText, marginBottom: '20px' }}>
                These sessions are already scheduled. Click to register.
              </p>
              <div style={styles.eventsList}>
                {mockAvailableDates.map((evt) => (
                  <Link key={evt.id} to="/a2-registration" style={styles.eventRow}>
                    <div style={styles.eventDateBlock}>
                      <div style={styles.eventDay}>{evt.date.split(',')[0]}</div>
                      <div style={styles.eventFullDate}>{evt.date.split(', ').slice(1).join(', ')}</div>
                    </div>
                    <div style={styles.eventDetails}>
                      <div style={styles.eventName}>
                        {evt.className}
                        {evt.full && <span style={styles.fullBadge}>Full</span>}
                      </div>
                      <div style={styles.eventMeta}>{evt.time} &middot; {evt.area}</div>
                    </div>
                    <div style={evt.full ? styles.eventActionWaitlist : styles.eventAction}>
                      {evt.full ? 'Join Waitlist \u2192' : 'Register \u2192'}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

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
