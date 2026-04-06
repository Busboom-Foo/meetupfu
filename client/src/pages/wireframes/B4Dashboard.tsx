import { Link } from 'react-router-dom';
import { mockRequests } from './mock-data';
import type { RequestStatus } from './mock-data';

const statusColors: Record<RequestStatus, { background: string; color: string; label: string }> = {
  new:            { background: '#e5e7eb', color: '#374151', label: 'New' },
  discussing:     { background: '#fef3c7', color: '#92400e', label: 'Discussing' },
  dates_proposed: { background: '#dbeafe', color: '#1e40af', label: 'Dates Proposed' },
  confirmed:      { background: '#d1fae5', color: '#065f46', label: 'Confirmed' },
  completed:      { background: '#dbeafe', color: '#1e3a8a', label: 'Completed' },
  cancelled:      { background: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
};

export default function B4Dashboard() {
  return (
    <div>
      <h1 style={{ margin: '0 0 24px', fontSize: '28px', fontWeight: 700, color: '#111827' }}>
        My Requests
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {mockRequests.map((req) => {
          const badge = statusColors[req.status] ?? statusColors.new;
          return (
            <div
              key={req.id}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '20px 24px',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#6b7280')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
            >
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontWeight: 700, fontSize: '17px', color: '#111827' }}>
                  {req.className}
                </span>
                <span
                  style={{
                    background: badge.background,
                    color: badge.color,
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '2px 10px',
                    borderRadius: '9999px',
                  }}
                >
                  {badge.label}
                </span>
              </div>

              {/* Details */}
              <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>
                  <strong style={{ color: '#374151' }}>Date:</strong>{' '}
                  {req.confirmedDate ?? 'Pending'}
                </div>
                <div>
                  <strong style={{ color: '#374151' }}>Location:</strong>{' '}
                  {req.locationAddress}
                </div>
              </div>

              {/* Confirmed extras */}
              {req.status === 'confirmed' && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '10px 14px',
                    background: '#f0fdf4',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#065f46',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div>
                    <strong>Registration Link:</strong>{' '}
                    <Link
                      to={req.registrationLink}
                      style={{ color: '#059669', textDecoration: 'underline' }}
                    >
                      Copy link
                    </Link>
                  </div>
                  <div>
                    <strong>{req.registrationCount} registered</strong>
                  </div>
                </div>
              )}

              {/* Footer link */}
              <div style={{ marginTop: '14px' }}>
                <Link
                  to="/b5-detail"
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#ea580c',
                    textDecoration: 'none',
                  }}
                >
                  View Details →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
