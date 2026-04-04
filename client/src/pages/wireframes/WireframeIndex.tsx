import { Link } from 'react-router-dom';

const wireframePages = [
  {
    group: 'jointheleague.org (Astro components)',
    pages: [
      { path: '/class-page', label: 'Class Page — Hour of Micro:bit', screen: 'Reference page mockup' },
      { path: '/a2-registration', label: 'A2: Event Registration Component', screen: 'Standalone view with state toggle' },
    ],
  },
  {
    group: 'Event System App (events.jointheleague.org)',
    pages: [
      { path: '/b1-intake', label: 'B1: Request Intake Form', screen: 'Full intake form with site selector' },
      { path: '/b2-donation', label: 'B2: Donation & Confirmation', screen: 'Review card + donation encouragement' },
      { path: '/b3-verification', label: 'B3: Email Verification', screen: 'Holding page' },
      { path: '/b4-dashboard', label: 'B4: Requester Dashboard', screen: 'Request list with status badges' },
      { path: '/b5-detail', label: 'B5: Event Detail', screen: 'Status-dependent detail with toggle' },
      { path: '/b6-voting', label: 'B6: Private Event Date Voting', screen: 'Date checkboxes + registration' },
    ],
  },
];

export default function WireframeIndex() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Wireframe Index</h1>
      <p style={styles.subtitle}>
        Live mockups of the public-facing screens for the Tech Club Event Request System.
        Click any page to view it.
      </p>

      {wireframePages.map((group) => (
        <div key={group.group} style={styles.group}>
          <h2 style={styles.groupTitle}>{group.group}</h2>
          <div style={styles.cardGrid}>
            {group.pages.map((page) => (
              <Link key={page.path} to={page.path} style={styles.card}>
                <div style={styles.cardLabel}>{page.label}</div>
                <div style={styles.cardScreen}>{page.screen}</div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '0 24px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    marginBottom: '8px',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: '15px',
    color: '#6b7280',
    marginBottom: '32px',
    lineHeight: 1.5,
  },
  group: {
    marginBottom: '32px',
  },
  groupTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#9ca3af',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '12px',
  },
  cardGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  card: {
    display: 'block',
    textDecoration: 'none',
    padding: '14px 18px',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    transition: 'border-color 0.15s',
  },
  cardLabel: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#1a1a1a',
  },
  cardScreen: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '2px',
  },
};
