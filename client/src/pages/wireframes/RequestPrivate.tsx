import { useState, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { REGIONS } from './zip-data';
import { generatedSlots } from './staff-availability';

const ORANGE = '#ea580c';
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const DAY_FULL: Record<string, string> = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
  Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
};
const PRIVATE_TYPES = ['Scouts', 'Youth Club', 'Church Group', 'Public School', 'Private School'] as const;

export default function RequestPrivate() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [region, setRegion] = useState(params.get('region') ?? '');
  const [selectedDays, setSelectedDays] = useState<Set<string>>(() => {
    const d = params.get('days');
    return d ? new Set(d.split(',')) : new Set<string>();
  });
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [privateType, setPrivateType] = useState('');
  const [groupSize, setGroupSize] = useState(15);

  // Contact
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Venue
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');

  function toggleDay(day: string) {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day); else next.add(day);
      return next;
    });
    setSelectedSlotId('');
  }

  const filteredSlots = useMemo(() => {
    return generatedSlots.filter((s) => {
      if (region && s.region !== region) return false;
      if (selectedDays.size > 0 && !selectedDays.has(s.dayOfWeek)) return false;
      return true;
    });
  }, [region, selectedDays]);

  const weekdaySlots = filteredSlots.filter((s) => !['Saturday', 'Sunday'].includes(s.dayOfWeek));
  const weekendSlots = filteredSlots.filter((s) => ['Saturday', 'Sunday'].includes(s.dayOfWeek));

  return (
    <div style={s.page}>
      <h1 style={s.title}>Request a Private Event</h1>
      <p style={s.subtitle}>
        A private Hour of Micro:bit class for your scouting, youth or church group.
        We'll match you with an instructor based on your area and schedule.
      </p>

      <Link to="/request-public" style={s.switchLink}>
        Looking for a public event instead? &rarr;
      </Link>

      {/* Group type */}
      <section style={s.section}>
        <h2 style={s.sectionTitle}>Group Type</h2>
        <div style={s.chipRow}>
          {PRIVATE_TYPES.map((t) => (
            <button key={t} style={privateType === t ? s.chipActive : s.chip}
              onClick={() => setPrivateType(t)}>
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* Filters */}
      <section style={s.section}>
        <h2 style={s.sectionTitle}>When & Where</h2>

        <div style={s.fieldGroup}>
          <label style={s.label}>Region</label>
          <div style={s.chipRow}>
            {REGIONS.map((r) => (
              <button key={r} style={region === r ? s.chipActive : s.chip}
                onClick={() => { setRegion(r); setSelectedSlotId(''); }}>
                {r}
              </button>
            ))}
          </div>
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>Days</label>
          <div style={s.chipRow}>
            {DAYS.map((d) => (
              <button key={d} style={selectedDays.has(DAY_FULL[d]) ? s.chipActive : s.chip}
                onClick={() => toggleDay(DAY_FULL[d])}>
                {d}
              </button>
            ))}
          </div>
          <div style={s.quickLinks}>
            <button style={s.quickLink} onClick={() => { setSelectedDays(new Set(['Monday','Tuesday','Wednesday','Thursday','Friday'])); setSelectedSlotId(''); }}>weekdays</button>
            <button style={s.quickLink} onClick={() => { setSelectedDays(new Set(['Saturday','Sunday'])); setSelectedSlotId(''); }}>weekends</button>
            <button style={s.quickLink} onClick={() => { setSelectedDays(new Set(Object.values(DAY_FULL))); setSelectedSlotId(''); }}>all</button>
            <button style={s.quickLink} onClick={() => { setSelectedDays(new Set()); setSelectedSlotId(''); }}>none</button>
          </div>
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor="priv-groupsize">Expected Group Size</label>
          <input id="priv-groupsize" type="number" min={5} value={groupSize}
            onChange={(e) => setGroupSize(Number(e.target.value))}
            style={{ ...s.input, width: '120px' }} />
        </div>
      </section>

      {/* Available dates — weekday / weekend columns */}
      <section style={s.section}>
        <h2 style={s.sectionTitle}>
          Available Dates
          <span style={s.count}>{filteredSlots.length}</span>
        </h2>
        {filteredSlots.length === 0 ? (
          <p style={s.empty}>No availability for this combination. Try adjusting the region or days.</p>
        ) : (
          <div style={s.twoCol}>
            {weekdaySlots.length > 0 && (
              <div>
                <div style={s.colHeading}>Weekdays</div>
                <div style={s.colBox}>
                  {weekdaySlots.map((slot) => (
                    <button key={slot.id}
                      style={selectedSlotId === slot.id ? s.slotActive : s.slotItem}
                      onClick={() => setSelectedSlotId(slot.id)}>
                      {slot.date}, {slot.timeRange}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {weekendSlots.length > 0 && (
              <div>
                <div style={s.colHeading}>Weekends</div>
                <div style={s.colBox}>
                  {weekendSlots.map((slot) => (
                    <button key={slot.id}
                      style={selectedSlotId === slot.id ? s.slotActive : s.slotItem}
                      onClick={() => setSelectedSlotId(slot.id)}>
                      {slot.date}, {slot.timeRange}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Venue */}
      <section style={s.section}>
        <h2 style={s.sectionTitle}>Your Venue</h2>
        <div style={s.notice}>
          As the requester, you are responsible for providing a suitable site, promoting the
          event to your group, and ensuring a minimum of 10 participants.
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor="priv-venue">Venue Name</label>
          <input id="priv-venue" type="text" value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
            style={s.input} placeholder="e.g. Troop 42 Meeting Hall, Church Rec Room" />
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor="priv-address">Venue Address</label>
          <input id="priv-address" type="text" value={venueAddress}
            onChange={(e) => setVenueAddress(e.target.value)}
            style={s.input} placeholder="Street address, city, zip" />
        </div>
      </section>

      {/* Contact */}
      <section style={s.section}>
        <h2 style={s.sectionTitle}>Your Information</h2>
        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor="priv-name">Name</label>
          <input id="priv-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
            style={s.input} placeholder="Your full name" />
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor="priv-email">Email</label>
          <input id="priv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            style={s.input} placeholder="you@example.com" />
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor="priv-phone">Phone <span style={s.optional}>(optional)</span></label>
          <input id="priv-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            style={s.input} placeholder="(555) 000-0000" />
        </div>
      </section>

      <button style={s.submitBtn} onClick={() => navigate('/b2-donation')}>
        Review &amp; Submit &rarr;
      </button>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { maxWidth: '680px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1a1a1a' },
  title: { fontSize: '24px', fontWeight: 700, marginBottom: '6px' },
  subtitle: { fontSize: '15px', color: '#374151', lineHeight: 1.6, marginBottom: '12px' },
  switchLink: { fontSize: '13px', color: ORANGE, textDecoration: 'none', fontWeight: 600 },
  section: { marginTop: '28px' },
  sectionTitle: {
    fontSize: '16px', fontWeight: 600, color: '#374151', marginBottom: '12px',
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  count: {
    fontSize: '12px', fontWeight: 600, color: '#6b7280', background: '#f3f4f6',
    padding: '2px 8px', borderRadius: '9999px',
  },
  fieldGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' },
  optional: { fontWeight: 400, color: '#9ca3af' },
  input: {
    width: '100%', boxSizing: 'border-box' as const,
    padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px',
    fontSize: '14px', color: '#1a1a1a', background: '#fff', outline: 'none',
  },
  chipRow: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  quickLinks: { display: 'flex', gap: '12px', marginTop: '6px' },
  quickLink: {
    background: 'none', border: 'none', padding: 0, fontSize: '12px',
    color: '#6b7280', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit',
  },
  chip: {
    padding: '6px 14px', fontSize: '13px', fontWeight: 500,
    border: '1px solid #d1d5db', borderRadius: '20px',
    background: '#fff', color: '#374151', cursor: 'pointer', fontFamily: 'inherit',
  },
  chipActive: {
    padding: '6px 14px', fontSize: '13px', fontWeight: 600,
    border: `1px solid ${ORANGE}`, borderRadius: '20px',
    background: '#fff7ed', color: ORANGE, cursor: 'pointer', fontFamily: 'inherit',
  },
  twoCol: { display: 'flex', gap: '16px', alignItems: 'flex-start' },
  colHeading: {
    fontSize: '13px', fontWeight: 700, color: '#1e40af', marginBottom: '6px',
    padding: '6px 10px', background: '#dbeafe', borderRadius: '5px', borderLeft: '3px solid #3b82f6',
  },
  colBox: {
    border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px',
    maxHeight: '300px', overflowY: 'auto' as const, flex: 1,
  },
  slotItem: {
    display: 'block', width: '100%', textAlign: 'left' as const,
    padding: '6px 10px', border: '1px solid #f3f4f6', borderRadius: '5px',
    background: '#fff', cursor: 'pointer', marginBottom: '3px', fontFamily: 'inherit',
    fontSize: '13px', fontWeight: 500, color: '#1a1a1a',
  },
  slotActive: {
    display: 'block', width: '100%', textAlign: 'left' as const,
    padding: '6px 10px', border: `1px solid ${ORANGE}`, borderRadius: '5px',
    background: '#fff7ed', cursor: 'pointer', marginBottom: '3px', fontFamily: 'inherit',
    fontSize: '13px', fontWeight: 600, color: '#1a1a1a',
  },
  empty: { fontSize: '13px', color: '#9ca3af', fontStyle: 'italic' },
  notice: {
    background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px',
    padding: '12px 16px', fontSize: '13px', color: '#92400e', lineHeight: 1.5,
    marginBottom: '16px',
  },
  submitBtn: {
    marginTop: '24px', marginBottom: '40px',
    background: ORANGE, color: '#fff', border: 'none', borderRadius: '8px',
    padding: '12px 28px', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
  },
};
