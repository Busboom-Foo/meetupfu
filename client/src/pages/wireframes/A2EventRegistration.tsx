import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockPrimaryRequest } from './mock-data';

type DemoState = 'open' | 'full' | 'none';

interface ChildRow {
  name: string;
  age: string;
}

// ── Event details derived from mock data ─────────────────────
const EVENT_DATE = 'Saturday, April 19, 2026 at 3:30 PM';
const EVENT_LOCATION = 'Carmel Mountain Ranch Library';
const SPOTS_REMAINING = mockPrimaryRequest.expectedHeadcount - mockPrimaryRequest.registrationCount;

// ── Sub-components ────────────────────────────────────────────

function EventHeader() {
  return (
    <div style={styles.eventHeader}>
      <div style={styles.eventTitle}>{mockPrimaryRequest.className}</div>
      <div style={styles.eventMeta}>
        {EVENT_DATE} &mdash; {EVENT_LOCATION}
      </div>
    </div>
  );
}

function RegistrationOpenState() {
  const [guardianName, setGuardianName] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [children, setChildren] = useState<ChildRow[]>([{ name: '', age: '' }]);
  const [volunteer, setVolunteer] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function addChild() {
    setChildren((prev) => [...prev, { name: '', age: '' }]);
  }

  function updateChild(index: number, field: keyof ChildRow, value: string) {
    setChildren((prev) =>
      prev.map((child, i) => (i === index ? { ...child, [field]: value } : child))
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={styles.successBox}>
        <div style={styles.successTitle}>You're registered!</div>
        <div style={styles.successMessage}>
          A confirmation email has been sent to {guardianEmail || 'your email address'}.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.badgeGreen}>{SPOTS_REMAINING} spots remaining</div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Guardian Name</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Full name"
            value={guardianName}
            onChange={(e) => setGuardianName(e.target.value)}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Guardian Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="email@example.com"
            value={guardianEmail}
            onChange={(e) => setGuardianEmail(e.target.value)}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Guardian Phone</label>
          <input
            style={styles.input}
            type="tel"
            placeholder="(555) 000-0000"
            value={guardianPhone}
            onChange={(e) => setGuardianPhone(e.target.value)}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Children Attending</label>
          {children.map((child, i) => (
            <div key={i} style={styles.childRow}>
              <input
                style={{ ...styles.input, flex: 1 }}
                type="text"
                placeholder="Child name"
                value={child.name}
                onChange={(e) => updateChild(i, 'name', e.target.value)}
              />
              <input
                style={{ ...styles.input, width: '80px', flexShrink: 0 }}
                type="number"
                placeholder="Age"
                min={4}
                max={18}
                value={child.age}
                onChange={(e) => updateChild(i, 'age', e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={addChild} style={styles.addChildBtn}>
            + Add another child
          </button>
        </div>

        <div style={styles.checkboxRow}>
          <input
            type="checkbox"
            id="volunteer"
            checked={volunteer}
            onChange={(e) => setVolunteer(e.target.checked)}
            style={{ marginRight: '8px', accentColor: '#ea580c' }}
          />
          <label htmlFor="volunteer" style={styles.checkboxLabel}>
            I'd like to volunteer at this event
          </label>
        </div>

        <button type="submit" style={styles.primaryBtn}>Register</button>
      </form>

      <div style={styles.meetupLink}>
        <a href="#" style={styles.link}>View on Meetup &rarr;</a>
      </div>
    </div>
  );
}

function RegistrationFullState() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div>
      <div style={styles.badgeRed}>Event Full</div>

      {submitted ? (
        <div style={styles.successBox}>
          <div style={styles.successTitle}>You're on the waitlist!</div>
          <div style={styles.successMessage}>
            We'll notify you at {email || 'your email address'} if a spot opens up.
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          <p style={styles.waitlistIntro}>
            This event is full. Join the waitlist and we'll contact you if a spot opens up.
          </p>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Your Name</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Your Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" style={styles.primaryBtn}>Join Waitlist</button>
        </form>
      )}

      <div style={styles.meetupLink}>
        <a href="#" style={styles.link}>View on Meetup &rarr;</a>
      </div>
    </div>
  );
}

function NoEventState() {
  return (
    <div style={styles.noEventBox}>
      <p style={styles.noEventMessage}>
        No upcoming Hour of Micro:bit event is scheduled near you.
      </p>
      <Link to="/class-page" style={styles.requestLink}>
        Request an Event &rarr;
      </Link>
    </div>
  );
}

// ── Demo Toggle ───────────────────────────────────────────────

const DEMO_OPTIONS: { label: string; value: DemoState }[] = [
  { label: 'Open', value: 'open' },
  { label: 'Full', value: 'full' },
  { label: 'No Event', value: 'none' },
];

function DemoToggle({
  active,
  onChange,
}: {
  active: DemoState;
  onChange: (s: DemoState) => void;
}) {
  return (
    <div style={styles.toggleBar}>
      <span style={styles.toggleLabel}>Demo state:</span>
      <div style={styles.toggleGroup}>
        {DEMO_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              ...styles.toggleBtn,
              ...(active === opt.value ? styles.toggleBtnActive : {}),
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────

export default function A2EventRegistration() {
  const [demoState, setDemoState] = useState<DemoState>('open');

  return (
    <div style={styles.page}>
      <DemoToggle active={demoState} onChange={setDemoState} />

      <div style={styles.card}>
        {demoState !== 'none' && <EventHeader />}

        {demoState === 'open' && <RegistrationOpenState />}
        {demoState === 'full' && <RegistrationFullState />}
        {demoState === 'none' && <NoEventState />}
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    maxWidth: '520px',
    margin: '0 auto',
    padding: '32px 24px',
  },

  // Demo toggle
  toggleBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  toggleLabel: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  toggleGroup: {
    display: 'flex',
    gap: '6px',
  },
  toggleBtn: {
    padding: '4px 14px',
    borderRadius: '999px',
    border: '1px solid #d1d5db',
    background: '#fff',
    color: '#374151',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  toggleBtnActive: {
    background: '#ea580c',
    borderColor: '#ea580c',
    color: '#fff',
  },

  // Card
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '28px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },

  // Event header
  eventHeader: {
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #f3f4f6',
  },
  eventTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '4px',
  },
  eventMeta: {
    fontSize: '14px',
    color: '#6b7280',
  },

  // Badges
  badgeGreen: {
    display: 'inline-block',
    background: '#dcfce7',
    color: '#166534',
    fontSize: '13px',
    fontWeight: 600,
    padding: '4px 12px',
    borderRadius: '999px',
    marginBottom: '20px',
  },
  badgeRed: {
    display: 'inline-block',
    background: '#fee2e2',
    color: '#991b1b',
    fontSize: '13px',
    fontWeight: 600,
    padding: '4px 12px',
    borderRadius: '999px',
    marginBottom: '20px',
  },

  // Form
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#111827',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  childRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
  },
  addChildBtn: {
    background: 'none',
    border: 'none',
    color: '#ea580c',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '0',
    textAlign: 'left',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
  },
  primaryBtn: {
    padding: '10px 20px',
    background: '#ea580c',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },

  // Meetup link
  meetupLink: {
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #f3f4f6',
  },
  link: {
    color: '#ea580c',
    fontSize: '14px',
    fontWeight: 500,
    textDecoration: 'none',
  },

  // Waitlist intro
  waitlistIntro: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0',
    lineHeight: 1.5,
  },

  // Success box
  successBox: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    padding: '20px',
  },
  successTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#166534',
    marginBottom: '6px',
  },
  successMessage: {
    fontSize: '14px',
    color: '#15803d',
    lineHeight: 1.5,
  },

  // No event state
  noEventBox: {
    textAlign: 'center',
    padding: '24px 0',
  },
  noEventMessage: {
    fontSize: '15px',
    color: '#6b7280',
    marginBottom: '16px',
    lineHeight: 1.5,
  },
  requestLink: {
    display: 'inline-block',
    color: '#ea580c',
    fontSize: '15px',
    fontWeight: 600,
    textDecoration: 'none',
  },
};
