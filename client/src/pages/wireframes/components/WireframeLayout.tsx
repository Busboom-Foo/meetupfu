import { NavLink, Outlet } from 'react-router-dom';

const sidebarLinks = [
  { label: 'My Requests', to: '/b4-dashboard' },
  { label: 'Request an Event', to: '/class-page' },
  { label: 'Help / FAQ', to: '#' },
];

export default function WireframeLayout() {
  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <div style={styles.brandBox}>
          <span style={styles.brandText}>Tech Club Events</span>
        </div>
        <nav style={styles.nav}>
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main style={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
  },
  sidebar: {
    width: '240px',
    background: '#1a1a2e',
    color: '#fff',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  brandBox: {
    padding: '20px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  brandText: {
    fontWeight: 700,
    fontSize: '16px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 0',
  },
  navLink: {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 500,
    borderLeft: '3px solid transparent',
    transition: 'all 0.15s',
  },
  navLinkActive: {
    color: '#fff',
    background: 'rgba(255,255,255,0.1)',
    borderLeftColor: '#ea580c',
  },
  content: {
    flex: 1,
    background: '#f9fafb',
    padding: '32px',
    overflowY: 'auto',
  },
};
