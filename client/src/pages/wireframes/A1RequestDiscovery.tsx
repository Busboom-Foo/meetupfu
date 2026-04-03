import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAvailableDates, MockAvailableDate } from './mock-data';

type State = 'initial' | 'expanded' | 'selected';

export default function A1RequestDiscovery() {
  const navigate = useNavigate();
  const [state, setState] = useState<State>('initial');
  const [zip, setZip] = useState('');
  const [selectedDate, setSelectedDate] = useState<MockAvailableDate | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [email, setEmail] = useState('');

  const cardStyle: React.CSSProperties = {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 28,
    maxWidth: 600,
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 4,
    marginTop: 0,
  };

  const subheadStyle: React.CSSProperties = {
    fontSize: 13,
    color: '#64748b',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    marginBottom: 16,
    marginTop: 0,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    display: 'block',
  };

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    color: '#1e293b',
    outline: 'none',
    width: 160,
  };

  const orangeButton: React.CSSProperties = {
    background: '#ea580c',
    color: '#ffffff',
    border: 'none',
    borderRadius: 6,
    padding: '8px 18px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  };

  // ── State 1: Initial ─────────────────────────────────────────
  if (state === 'initial') {
    return (
      <div style={cardStyle}>
        <p style={subheadStyle}>Tech Club Events</p>
        <p style={headingStyle}>Find events near you</p>
        <p style={{ fontSize: 15, color: '#475569', marginBottom: 20, marginTop: 8 }}>
          Enter your zip code to see available Tech Club events near you.
        </p>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Zip code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            style={inputStyle}
            maxLength={10}
          />
          <button
            style={orangeButton}
            onClick={() => setState('expanded')}
          >
            Search
          </button>
        </div>
      </div>
    );
  }

  // ── State 2: Expanded (date list) ────────────────────────────
  if (state === 'expanded') {
    return (
      <div style={cardStyle}>
        <p style={subheadStyle}>Tech Club Events</p>

        {/* Confirmed events section */}
        <h2 style={{ ...headingStyle, fontSize: 17, marginBottom: 8 }}>
          Upcoming confirmed events
        </h2>
        <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 24, marginTop: 0 }}>
          No confirmed events near this zip code yet.
        </p>

        <div style={{ borderTop: '1px solid #e2e8f0', marginBottom: 20 }} />

        {/* Available dates section */}
        <h2 style={{ ...headingStyle, fontSize: 17, marginBottom: 4 }}>
          Available dates to request
        </h2>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16, marginTop: 4 }}>
          Choose a date below to begin a request for your group.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {mockAvailableDates.map((d, i) => (
            <div key={d.id}>
              {i > 0 && (
                <div style={{ borderTop: '1px solid #f1f5f9' }} />
              )}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 0',
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 2 }}>
                    {d.className}
                  </div>
                  <div style={{ fontSize: 14, color: '#374151', marginBottom: 1 }}>
                    {d.date} &bull; {d.time}
                  </div>
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>
                    {d.area}
                  </div>
                </div>
                <button
                  style={{ ...orangeButton, whiteSpace: 'nowrap' as const, flexShrink: 0 }}
                  onClick={() => {
                    setSelectedDate(d);
                    setState('selected');
                  }}
                >
                  Request This
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── State 3: Date selected ───────────────────────────────────
  return (
    <div style={cardStyle}>
      <p style={subheadStyle}>Tech Club Events</p>

      {/* Selected date highlight */}
      {selectedDate && (
        <div
          style={{
            background: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: 8,
            padding: '14px 18px',
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 13, color: '#c2410c', fontWeight: 600, marginBottom: 4 }}>
            Selected date
          </div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#1e293b', marginBottom: 2 }}>
            {selectedDate.className}
          </div>
          <div style={{ fontSize: 14, color: '#374151' }}>
            {selectedDate.date} &bull; {selectedDate.time}
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
            {selectedDate.area}
          </div>
        </div>
      )}

      {/* Private event checkbox */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            style={{ marginTop: 2, width: 16, height: 16, cursor: 'pointer', flexShrink: 0 }}
          />
          <span style={{ fontSize: 15, color: '#374151', fontWeight: 500 }}>
            This is a private event
          </span>
        </label>
        {isPrivate && (
          <div
            style={{
              marginTop: 10,
              marginLeft: 26,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              padding: '10px 14px',
              fontSize: 13,
              color: '#475569',
              lineHeight: 1.5,
            }}
          >
            Private events are for organized groups (school classes, scout troops, youth
            organizations). A minimum headcount of 10 is required.
          </div>
        )}
      </div>

      {/* Email input */}
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle} htmlFor="a1-email">
          Your email address
        </label>
        <input
          id="a1-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' as const }}
        />
      </div>

      {/* Continue button */}
      <button
        style={{ ...orangeButton, fontSize: 15, padding: '10px 22px' }}
        onClick={() => navigate('/wireframes/b1-intake')}
      >
        Continue to Request Form &rarr;
      </button>

      {/* Back link */}
      <div style={{ marginTop: 16 }}>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: 13,
            cursor: 'pointer',
            padding: 0,
            textDecoration: 'underline',
          }}
          onClick={() => setState('expanded')}
        >
          &larr; Back to dates
        </button>
      </div>
    </div>
  );
}
