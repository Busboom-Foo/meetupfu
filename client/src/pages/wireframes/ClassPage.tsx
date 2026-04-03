import LeagueHeader from './components/LeagueHeader';
import { mockClass } from './mock-data';

const ORANGE = '#ea580c';
const CONTAINER_MAX = 1000;

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

            {/* ── A1 Embed Point ───────────────────────────── */}
            <div style={styles.embedPlaceholder}>
              <span style={styles.embedLabel}>
                Request Discovery Component (A1) — implemented in ticket 003
              </span>
            </div>

            {/* ── Enroll in Community Programs ─────────────── */}
            <div style={styles.enrollSection}>
              <div style={styles.enrollGrid}>
                <div style={styles.enrollText}>
                  <h2 style={styles.sectionHeading}>Enroll in Community Programs</h2>
                  <p style={styles.bodyText}>
                    Our community programs remove financial and geographic barriers to quality
                    computer science education. Through partnerships with schools, libraries, and
                    community centers across San Diego County, we provide free Tech Club workshops,
                    scholarship opportunities, and outreach initiatives that ensure every student
                    has access to programming education regardless of their background or resources.
                  </p>
                </div>
                <div style={styles.enrollAction}>
                  <a
                    href="https://www.meetup.com/the-league-tech-club"
                    style={styles.meetupButton}
                  >
                    Register For Meetup Events
                  </a>
                </div>
              </div>
            </div>

            {/* ── A2 Embed Point ───────────────────────────── */}
            <div style={styles.embedPlaceholder}>
              <span style={styles.embedLabel}>
                Event Registration Component (A2) — implemented in ticket 004
              </span>
            </div>
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

  // ── Embed Placeholders ────────────────────────────────────────
  embedPlaceholder: {
    marginTop: '48px',
    padding: '32px 24px',
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    background: '#f9fafb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  embedLabel: {
    fontSize: '14px',
    color: '#6b7280',
    fontStyle: 'italic',
  },

  // ── Enroll Section ────────────────────────────────────────────
  enrollSection: {
    marginTop: '48px',
    paddingTop: '40px',
    borderTop: '1px solid #e5e7eb',
  },
  enrollGrid: {
    display: 'flex',
    gap: '40px',
    alignItems: 'flex-start',
  },
  enrollText: {
    flex: 1,
  },
  enrollAction: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'flex-start',
    paddingTop: '48px',
  },
  meetupButton: {
    display: 'inline-block',
    background: ORANGE,
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '15px',
    whiteSpace: 'nowrap',
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
