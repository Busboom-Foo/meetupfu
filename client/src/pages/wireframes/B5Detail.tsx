import { useState } from 'react';
import { mockPrimaryRequest, RequestStatus } from './mock-data';

type DemoState = 'confirmed' | 'discussing' | 'completed' | 'cancelled';

const statusColors: Record<DemoState, { background: string; color: string; label: string }> = {
  confirmed:  { background: '#d1fae5', color: '#065f46', label: 'Confirmed' },
  discussing: { background: '#fef3c7', color: '#92400e', label: 'Discussing' },
  completed:  { background: '#dbeafe', color: '#1e3a8a', label: 'Completed' },
  cancelled:  { background: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
};

const demoStates: DemoState[] = ['confirmed', 'discussing', 'completed', 'cancelled'];

export default function B5Detail() {
  const [demoState, setDemoState] = useState<DemoState>('confirmed');
  const req = mockPrimaryRequest;
  const badge = statusColors[demoState];

  const timelineBase = [
    { label: 'Request submitted', date: 'April 10, 2026' },
    { label: 'Coordination started', date: 'April 11, 2026' },
  ];
  const timelineConfirmed = [...timelineBase, { label: 'Event confirmed', date: 'April 14, 2026' }];
  const timelineCompleted = [...timelineBase, { label: 'Event confirmed', date: 'April 14, 2026' }];
  const timeline =
    demoState === 'confirmed' ? timelineConfirmed :
    demoState === 'completed' ? timelineCompleted :
    timelineBase;

  return (
    <div style={{ maxWidth: '720px' }}>
      {/* Demo toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
        {demoStates.map((state) => (
          <button
            key={state}
            onClick={() => setDemoState(state)}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: '1px solid',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              borderColor: demoState === state ? '#ea580c' : '#d1d5db',
              background: demoState === state ? '#ea580c' : '#fff',
              color: demoState === state ? '#fff' : '#374151',
              transition: 'all 0.15s',
            }}
          >
            {state.charAt(0).toUpperCase() + state.slice(1)}
          </button>
        ))}
      </div>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: '#111827' }}>
          Hour of Micro:bit
        </h1>
        <span
          style={{
            background: badge.background,
            color: badge.color,
            fontSize: '12px',
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: '9999px',
          }}
        >
          {badge.label}
        </span>
      </div>
      <p style={{ margin: '0 0 24px', color: '#6b7280', fontSize: '14px' }}>
        Request #{req.id}
      </p>

      {/* Summary card */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px 24px',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, color: '#374151' }}>
          Request Details
        </h2>
        <dl style={{ display: 'grid', gridTemplateColumns: '160px 1fr', rowGap: '10px', columnGap: '16px', margin: 0, fontSize: '14px' }}>
          <dt style={{ color: '#6b7280', fontWeight: 500 }}>Requested dates</dt>
          <dd style={{ margin: 0, color: '#111827' }}>{req.preferredDates.join(', ')}</dd>

          <dt style={{ color: '#6b7280', fontWeight: 500 }}>Location</dt>
          <dd style={{ margin: 0, color: '#111827' }}>{req.locationAddress}</dd>

          <dt style={{ color: '#6b7280', fontWeight: 500 }}>Group</dt>
          <dd style={{ margin: 0, color: '#111827' }}>{req.groupType} — {req.expectedHeadcount} expected</dd>

          <dt style={{ color: '#6b7280', fontWeight: 500 }}>Event type</dt>
          <dd style={{ margin: 0, color: '#111827' }}>
            {req.eventType === 'private' ? 'Private (invite only)' : 'Public'}
          </dd>
        </dl>
      </div>

      {/* State-specific card */}
      {demoState === 'confirmed' && (
        <div
          style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '20px 24px',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, color: '#065f46' }}>
            Event Confirmed
          </h2>
          <dl style={{ display: 'grid', gridTemplateColumns: '160px 1fr', rowGap: '10px', columnGap: '16px', margin: 0, fontSize: '14px' }}>
            <dt style={{ color: '#059669', fontWeight: 500 }}>Date &amp; time</dt>
            <dd style={{ margin: 0, color: '#111827' }}>{req.confirmedDate}</dd>

            <dt style={{ color: '#059669', fontWeight: 500 }}>Instructor</dt>
            <dd style={{ margin: 0, color: '#111827' }}>{req.instructorName}</dd>

            <dt style={{ color: '#059669', fontWeight: 500 }}>Location</dt>
            <dd style={{ margin: 0, color: '#111827' }}>{req.locationAddress}</dd>

            <dt style={{ color: '#059669', fontWeight: 500 }}>Registration link</dt>
            <dd style={{ margin: 0 }}>
              <a href="#" style={{ color: '#059669', textDecoration: 'underline', fontSize: '14px' }}>
                https://techclubleague.org/events/req-4827
              </a>
            </dd>

            <dt style={{ color: '#059669', fontWeight: 500 }}>Registrations</dt>
            <dd style={{ margin: 0, color: '#111827' }}>12 kids registered</dd>
          </dl>
        </div>
      )}

      {demoState === 'discussing' && (
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            padding: '20px 24px',
            marginBottom: '20px',
            fontSize: '14px',
            color: '#92400e',
          }}
        >
          <h2 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 600 }}>
            Coordination in Progress
          </h2>
          <p style={{ margin: 0 }}>
            Coordination is happening via email. Check your email for updates.
          </p>
        </div>
      )}

      {demoState === 'completed' && (
        <div
          style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '20px 24px',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, color: '#1e3a8a' }}>
            Event Completed
          </h2>
          <dl style={{ display: 'grid', gridTemplateColumns: '160px 1fr', rowGap: '10px', columnGap: '16px', margin: 0, fontSize: '14px' }}>
            <dt style={{ color: '#3b82f6', fontWeight: 500 }}>Attendance</dt>
            <dd style={{ margin: 0, color: '#111827' }}>18 kids attended, 2 no-shows, 3 walk-ins</dd>

            <dt style={{ color: '#3b82f6', fontWeight: 500 }}>Completed on</dt>
            <dd style={{ margin: 0, color: '#111827' }}>March 8, 2026</dd>
          </dl>
        </div>
      )}

      {demoState === 'cancelled' && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '20px 24px',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, color: '#991b1b' }}>
            Event Cancelled
          </h2>
          <dl style={{ display: 'grid', gridTemplateColumns: '160px 1fr', rowGap: '10px', columnGap: '16px', margin: 0, fontSize: '14px' }}>
            <dt style={{ color: '#ef4444', fontWeight: 500 }}>Reason</dt>
            <dd style={{ margin: 0, color: '#111827' }}>
              Insufficient instructor availability for requested dates.
            </dd>

            <dt style={{ color: '#ef4444', fontWeight: 500 }}>Cancelled on</dt>
            <dd style={{ margin: 0, color: '#111827' }}>April 12, 2026</dd>
          </dl>
        </div>
      )}

      {/* Timeline */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px 24px',
        }}
      >
        <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, color: '#374151' }}>
          Status History
        </h2>
        <div style={{ position: 'relative', paddingLeft: '20px' }}>
          {/* Vertical line */}
          <div
            style={{
              position: 'absolute',
              left: '6px',
              top: '8px',
              bottom: '8px',
              width: '2px',
              background: '#e5e7eb',
            }}
          />
          {timeline.map((entry, idx) => (
            <div key={idx} style={{ position: 'relative', marginBottom: idx < timeline.length - 1 ? '18px' : 0 }}>
              {/* Dot */}
              <div
                style={{
                  position: 'absolute',
                  left: '-17px',
                  top: '3px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: idx === timeline.length - 1 ? '#ea580c' : '#9ca3af',
                  border: '2px solid #fff',
                  zIndex: 1,
                }}
              />
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                {entry.label}
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                {entry.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
