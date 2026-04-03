import { useNavigate } from 'react-router-dom';
import { mockPrimaryRequest } from './mock-data';

export default function B3Verification() {
  const navigate = useNavigate();
  const req = mockPrimaryRequest;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Envelope placeholder */}
        <div style={styles.envelopeBox}>
          <div style={styles.envelopeFront}>
            <div style={styles.envelopeFlap} />
          </div>
        </div>

        <h2 style={styles.heading}>Check your email to verify your request.</h2>

        <p style={styles.body}>
          We sent a verification link to{' '}
          <strong>{req.requesterEmail}</strong>. If you don&apos;t see it,
          check your spam folder.
        </p>

        <p style={styles.expiry}>The verification link expires in 1 hour.</p>

        <button
          style={styles.dashboardButton}
          onClick={() => navigate('/wireframes/b4-dashboard')}
        >
          View Dashboard →
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '48px',
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '48px 40px',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
  },
  envelopeBox: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '28px',
  },
  envelopeFront: {
    width: '72px',
    height: '50px',
    border: '2px solid #9ca3af',
    borderRadius: '4px',
    background: '#f9fafb',
    position: 'relative',
    overflow: 'hidden',
  },
  envelopeFlap: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    borderLeft: '36px solid transparent',
    borderRight: '36px solid transparent',
    borderTop: '28px solid #d1d5db',
  },
  heading: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '16px',
    marginTop: 0,
    lineHeight: '1.4',
  },
  body: {
    fontSize: '15px',
    color: '#374151',
    lineHeight: '1.6',
    marginBottom: '12px',
  },
  expiry: {
    fontSize: '13px',
    color: '#9ca3af',
    marginBottom: '32px',
  },
  dashboardButton: {
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
