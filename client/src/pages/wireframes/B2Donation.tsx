import { useNavigate } from 'react-router-dom';
import { mockPrimaryRequest } from './mock-data';

export default function B2Donation() {
  const navigate = useNavigate();
  const req = mockPrimaryRequest;

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>Review &amp; Donate</h1>

      {/* Review Card */}
      <div style={styles.card}>
        <h2 style={styles.cardHeading}>Request Summary</h2>
        <dl style={styles.dl}>
          <div style={styles.dlRow}>
            <dt style={styles.dt}>Class</dt>
            <dd style={styles.dd}>{req.className}</dd>
          </div>
          <div style={styles.dlRow}>
            <dt style={styles.dt}>Date</dt>
            <dd style={styles.dd}>Saturday, April 19, 2026 at 3:30 PM</dd>
          </div>
          <div style={styles.dlRow}>
            <dt style={styles.dt}>Location</dt>
            <dd style={styles.dd}>Carmel Mountain Ranch Library, San Diego, CA</dd>
          </div>
          <div style={styles.dlRow}>
            <dt style={styles.dt}>Group</dt>
            <dd style={styles.dd}>
              {req.groupType}, {req.expectedHeadcount} expected
            </dd>
          </div>
          <div style={styles.dlRow}>
            <dt style={styles.dt}>Event type</dt>
            <dd style={{ ...styles.dd, textTransform: 'capitalize' }}>{req.eventType}</dd>
          </div>
        </dl>
      </div>

      {/* Donation Section */}
      <div style={styles.donationCard}>
        <h2 style={styles.donationHeading}>Support This Event</h2>
        <p style={styles.costLabel}>$500</p>
        <p style={styles.donationBody}>
          Your donation covers instructor time, equipment (Micro:bit kits), curriculum materials,
          and event coordination. Every contribution helps us bring free coding education to more
          kids.
        </p>
        <a href="#" style={styles.donateButton}>
          Donate via Give Lively →
        </a>
      </div>

      {/* Submit */}
      <div style={styles.submitRow}>
        <button
          style={styles.submitButton}
          onClick={() => navigate('/b3-verification')}
        >
          Submit Request
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '24px',
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '24px',
    marginBottom: '20px',
  },
  cardHeading: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '16px',
    marginTop: 0,
  },
  dl: {
    margin: 0,
    padding: 0,
  },
  dlRow: {
    display: 'flex',
    gap: '12px',
    padding: '8px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  dt: {
    width: '110px',
    flexShrink: 0,
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: 500,
  },
  dd: {
    margin: 0,
    fontSize: '14px',
    color: '#111827',
    fontWeight: 500,
  },
  donationCard: {
    background: '#fff7ed',
    border: '1px solid #fed7aa',
    borderRadius: '10px',
    padding: '24px',
    marginBottom: '28px',
  },
  donationHeading: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#111827',
    marginTop: 0,
    marginBottom: '12px',
  },
  costLabel: {
    fontSize: '48px',
    fontWeight: 800,
    color: '#ea580c',
    margin: '0 0 16px 0',
    lineHeight: 1,
  },
  donationBody: {
    fontSize: '14px',
    color: '#374151',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  donateButton: {
    display: 'inline-block',
    padding: '10px 20px',
    border: '2px solid #ea580c',
    borderRadius: '6px',
    color: '#ea580c',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
    background: 'transparent',
  },
  submitRow: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  submitButton: {
    padding: '12px 28px',
    background: '#ea580c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
