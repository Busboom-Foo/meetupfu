import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'Programs', href: '#' },
  { label: 'Classes', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Impact', href: '#' },
  { label: 'Support', href: '#' },
  { label: 'Curriculum', href: '#' },
];

export default function LeagueHeader() {
  return (
    <header style={styles.header}>
      {/* Utility bar */}
      <div style={styles.utilityBar}>
        <div style={styles.utilityInner}>
          <span style={styles.utilityLink}>(858) 284-0481</span>
          <span style={styles.utilityLink}>Location &amp; Contact</span>
          <span style={styles.utilityLink}>Client Portal</span>
        </div>
      </div>

      {/* Main nav */}
      <div style={styles.mainNav}>
        <Link to="/class-page" style={styles.logoLink}>
          <div style={styles.logoPlaceholder}>
            <span style={styles.logoText}>The LEAGUE</span>
          </div>
        </Link>

        <nav style={styles.nav}>
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} style={styles.navLink}>
              {link.label}
            </a>
          ))}
        </nav>

        <div style={styles.ctaGroup}>
          <a href="#" style={styles.donateBtn}>Donate</a>
          <a href="#" style={styles.volunteerBtn}>Volunteer</a>
        </div>
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    borderBottom: '1px solid #e5e7eb',
    background: '#fff',
  },
  utilityBar: {
    background: '#fff',
    borderBottom: '1px solid #f3f4f6',
    padding: '6px 24px',
    display: 'flex',
    justifyContent: 'flex-end',
    fontSize: '13px',
    color: '#6b7280',
  },
  utilityInner: {
    display: 'flex',
    gap: '20px',
  },
  utilityLink: {
    cursor: 'pointer',
  },
  mainNav: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 24px',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logoLink: {
    textDecoration: 'none',
  },
  logoPlaceholder: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoText: {
    fontWeight: 700,
    fontSize: '18px',
    color: '#1a1a1a',
    whiteSpace: 'nowrap',
  },
  nav: {
    display: 'flex',
    gap: '20px',
    flex: 1,
  },
  navLink: {
    color: '#374151',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: 500,
  },
  ctaGroup: {
    display: 'flex',
    gap: '10px',
  },
  donateBtn: {
    background: '#ea580c',
    color: '#fff',
    padding: '8px 20px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '14px',
  },
  volunteerBtn: {
    border: '2px solid #1a1a1a',
    color: '#1a1a1a',
    padding: '6px 20px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '14px',
  },
};
