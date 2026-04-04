import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockCandidateDates } from './mock-data';

export default function B6Voting() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [kidsCount, setKidsCount] = useState(1);

  function toggleDate(id: string) {
    setSelectedDates((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  if (submitted) {
    return (
      <div style={styles.confirmWrapper}>
        <div style={styles.confirmCard}>
          <div style={styles.checkCircle}>
            <span style={styles.checkMark}>✓</span>
          </div>
          <h2 style={styles.confirmHeading}>Thank you!</h2>
          <p style={styles.confirmText}>
            We'll notify you by email when the date is confirmed.
          </p>
          <Link to="/b4-dashboard" style={styles.backLink}>
            Back to Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.h1}>Vote on Event Dates</h1>

      {/* Class info card */}
      <div style={styles.infoCard}>
        <div style={styles.className}>Hour of Micro:bit</div>
        <div style={styles.location}>Carmel Mountain Ranch Library, San Diego, CA</div>
        <p style={styles.description}>
          Hour of Micro:bit is a gentle introduction to physical computing using the BBC
          Micro:bit, a pocket-sized programmable computer. Students write programs to
          control the Micro:bit's LED display, buttons, sensors, and radio communication
          capabilities, leaving with a concrete understanding of how programming translates
          to real-world actions.
        </p>
      </div>

      {/* Date selection */}
      <h3 style={styles.h3}>Check all dates you can attend:</h3>
      <div style={styles.dateList}>
        {mockCandidateDates.map((candidate) => {
          const checked = selectedDates.has(candidate.id);
          return (
            <label key={candidate.id} style={styles.dateRow(checked)}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleDate(candidate.id)}
                style={styles.checkbox}
              />
              <div style={styles.dateInfo}>
                <span style={styles.dateBold}>{candidate.date}</span>
                <span style={styles.dateDetail}>{candidate.time}</span>
                <span style={styles.dateDetail}>{candidate.location}</span>
              </div>
            </label>
          );
        })}
      </div>

      {/* Registration form */}
      <div style={styles.form}>
        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="reg-name">Name</label>
          <input
            id="reg-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            style={styles.input}
          />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={styles.input}
          />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="reg-kids">Number of kids attending</label>
          <input
            id="reg-kids"
            type="number"
            min={1}
            value={kidsCount}
            onChange={(e) => setKidsCount(Number(e.target.value))}
            style={{ ...styles.input, width: '100px' }}
          />
        </div>

        <button style={styles.submitBtn} onClick={() => setSubmitted(true)}>
          Submit
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    maxWidth: '640px',
    margin: '40px auto',
    padding: '0 24px',
  } as React.CSSProperties,

  h1: {
    fontSize: '26px',
    fontWeight: 700,
    color: '#1a1a1a',
    marginBottom: '20px',
  } as React.CSSProperties,

  infoCard: {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '20px 24px',
    marginBottom: '28px',
  } as React.CSSProperties,

  className: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1a1a1a',
    marginBottom: '4px',
  } as React.CSSProperties,

  location: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '12px',
  } as React.CSSProperties,

  description: {
    fontSize: '14px',
    color: '#374151',
    lineHeight: 1.6,
    margin: 0,
  } as React.CSSProperties,

  h3: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#1a1a1a',
    marginBottom: '12px',
  } as React.CSSProperties,

  dateList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '28px',
  } as React.CSSProperties,

  dateRow: (checked: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    background: checked ? '#fff7ed' : '#fff',
    border: `1px solid ${checked ? '#f97316' : '#e5e7eb'}`,
    borderRadius: '8px',
    padding: '14px 16px',
    cursor: 'pointer',
    transition: 'border-color 0.15s, background 0.15s',
  }),

  checkbox: {
    marginTop: '2px',
    width: '18px',
    height: '18px',
    accentColor: '#f97316',
    flexShrink: 0,
  } as React.CSSProperties,

  dateInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  } as React.CSSProperties,

  dateBold: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#1a1a1a',
  } as React.CSSProperties,

  dateDetail: {
    fontSize: '14px',
    color: '#6b7280',
  } as React.CSSProperties,

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  } as React.CSSProperties,

  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  } as React.CSSProperties,

  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
  } as React.CSSProperties,

  input: {
    fontSize: '15px',
    padding: '9px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    outline: 'none',
    color: '#1a1a1a',
    background: '#fff',
    width: '100%',
    boxSizing: 'border-box',
  } as React.CSSProperties,

  submitBtn: {
    alignSelf: 'flex-start',
    background: '#f97316',
    color: '#fff',
    border: 'none',
    borderRadius: '7px',
    padding: '11px 28px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '4px',
  } as React.CSSProperties,

  confirmWrapper: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    padding: '40px 24px',
  } as React.CSSProperties,

  confirmCard: {
    textAlign: 'center',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '48px 40px',
    maxWidth: '420px',
    width: '100%',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  } as React.CSSProperties,

  checkCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: '#22c55e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  } as React.CSSProperties,

  checkMark: {
    color: '#fff',
    fontSize: '28px',
    fontWeight: 700,
    lineHeight: 1,
  } as React.CSSProperties,

  confirmHeading: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1a1a1a',
    marginBottom: '10px',
  } as React.CSSProperties,

  confirmText: {
    fontSize: '15px',
    color: '#6b7280',
    lineHeight: 1.6,
    marginBottom: '24px',
  } as React.CSSProperties,

  backLink: {
    display: 'inline-block',
    color: '#f97316',
    fontWeight: 600,
    fontSize: '15px',
    textDecoration: 'none',
  } as React.CSSProperties,
};
