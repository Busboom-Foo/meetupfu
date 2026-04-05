import { useState, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { REGIONS, zipData } from './zip-data';
import { generatedSlots } from './staff-availability';
import type { GeneratedSlot } from './staff-availability';
import { searchVenues } from './venue-data';
import type { Venue } from './venue-data';

const ORANGE = '#ea580c';
const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_INDEX: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
  Thursday: 4, Friday: 5, Saturday: 6,
};

// Wireframe "today" — April 7, 2026
const TODAY = new Date(2026, 3, 7);

function getCalendarWeeks(startDate: Date, numWeeks: number) {
  // Start one week from startDate
  const begin = new Date(startDate);
  begin.setDate(begin.getDate() + 7);
  // Align to Sunday
  begin.setDate(begin.getDate() - begin.getDay());

  const weeks: Date[][] = [];
  const cursor = new Date(begin);
  for (let w = 0; w < numWeeks; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatMonthDay(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

// Build a lookup: dateKey -> slots for that day
function buildSlotMap(slots: GeneratedSlot[]): Map<string, GeneratedSlot[]> {
  const map = new Map<string, GeneratedSlot[]>();
  for (const slot of slots) {
    // Parse the date string back to a Date to get a key
    const parsed = new Date(slot.date.replace(/^[A-Za-z]+, /, ''));
    const key = dateKey(parsed);
    const arr = map.get(key) ?? [];
    arr.push(slot);
    map.set(key, arr);
  }
  return map;
}

export default function RequestPublic() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // Venue authority
  const [hasSiteAuthority, setHasSiteAuthority] = useState<'yes' | 'no' | ''>('');

  // Venue search
  const [venueQuery, setVenueQuery] = useState('');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [showVenueSuggestions, setShowVenueSuggestions] = useState(false);
  const [isNewVenue, setIsNewVenue] = useState(false);
  const [newVenueStreet, setNewVenueStreet] = useState('');
  const [newVenueCity, setNewVenueCity] = useState('');
  const [newVenueZip, setNewVenueZip] = useState('');

  // Region (for "no" path)
  const [region, setRegion] = useState(params.get('region') ?? '');

  // Date selection mode
  const [dateMode, setDateMode] = useState<'specific' | 'flexible' | ''>('');

  // Selected slot IDs (multi-select)
  const [selectedSlotIds, setSelectedSlotIds] = useState<Set<string>>(new Set());

  // Contact
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const venueSuggestions = useMemo(() => searchVenues(venueQuery), [venueQuery]);

  function handleSelectVenue(venue: Venue) {
    setSelectedVenue(venue);
    setVenueQuery(`${venue.name} — ${venue.city}`);
    setShowVenueSuggestions(false);
    setIsNewVenue(false);
    setSelectedSlotIds(new Set());
  }

  function handleNewVenue() {
    setSelectedVenue(null);
    setVenueQuery('');
    setShowVenueSuggestions(false);
    setIsNewVenue(true);
    setSelectedSlotIds(new Set());
  }

  function handleVenueInputChange(value: string) {
    setVenueQuery(value);
    setShowVenueSuggestions(true);
    setIsNewVenue(false);
    if (!value.trim()) { setSelectedVenue(null); setSelectedSlotIds(new Set()); }
  }

  function toggleSlot(id: string) {
    setSelectedSlotIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  // Simulate geocoding: look up zip to find region
  const newVenueRegion = useMemo(() => {
    if (!isNewVenue || !newVenueZip) return '';
    const entry = zipData.find((z) => z.zip === newVenueZip);
    return entry?.region ?? '';
  }, [isNewVenue, newVenueZip]);

  // Effective region
  const effectiveRegion = hasSiteAuthority === 'yes'
    ? (selectedVenue?.region ?? newVenueRegion ?? '')
    : region;
  const venueReady = hasSiteAuthority === 'yes'
    ? (selectedVenue !== null || (isNewVenue && newVenueStreet !== '' && newVenueCity !== '' && newVenueZip !== ''))
    : region !== '';

  // Filter slots by region
  const regionSlots = useMemo(() => {
    if (!effectiveRegion) return [];
    return generatedSlots.filter((slot) => slot.region === effectiveRegion);
  }, [effectiveRegion]);

  const hasInstructors = regionSlots.length > 0;

  // Calendar grid data
  const calendarWeeks = useMemo(() => getCalendarWeeks(TODAY, 5), []);
  const slotMap = useMemo(() => buildSlotMap(regionSlots), [regionSlots]);

  return (
    <div style={s.page}>
      <h1 style={s.title}>Request a Public Event</h1>
      <p style={s.subtitle}>
        Bring a free Hour of Micro:bit class to a library, rec center, or public youth center
        in your area. We'll match you with an instructor.
      </p>

      <Link to="/request-private" style={s.switchLink}>
        Looking for a private event instead? &rarr;
      </Link>

      {/* ── Venue Authority ─────────────────────────────── */}
      <section style={s.section}>
        <h2 style={s.sectionTitle}>About the Venue</h2>
        <p style={s.bodyText}>
          Do you manage or have authority to schedule a site — a library, rec center,
          youth club, or similar space open to the public?
        </p>
        <div style={s.chipRow}>
          <button style={hasSiteAuthority === 'yes' ? s.chipActive : s.chip}
            onClick={() => setHasSiteAuthority('yes')}>
            Yes, I can schedule a venue
          </button>
          <button style={hasSiteAuthority === 'no' ? s.chipActive : s.chip}
            onClick={() => setHasSiteAuthority('no')}>
            No, I need help finding one
          </button>
        </div>
      </section>

      {/* ── YES: Venue Search ───────────────────────────── */}
      {hasSiteAuthority === 'yes' && (
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Describe Your Venue</h2>
          <div style={s.fieldGroup}>
            <label style={s.label}>Search by name, address, city, or zip</label>
            <div style={s.searchWrapper}>
              <input
                type="text"
                placeholder="e.g. Rancho Bernardo Library, Poway, 92128"
                value={venueQuery}
                onChange={(e) => handleVenueInputChange(e.target.value)}
                onFocus={() => setShowVenueSuggestions(true)}
                style={s.input}
              />
              {showVenueSuggestions && !selectedVenue && !isNewVenue && (
                <div style={s.suggestions}>
                  {venueSuggestions.map((v, i) => (
                    <button key={i} style={s.suggestionItem}
                      onClick={() => handleSelectVenue(v)}>
                      <span style={s.suggestionName}>{v.name}</span>
                      <span style={s.suggestionDetail}>{v.address}, {v.city} {v.zip}</span>
                    </button>
                  ))}
                  <button style={s.newVenueItem} onClick={handleNewVenue}>
                    <span style={s.newVenueLabel}>+ New venue not listed here</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          {selectedVenue && (
            <div style={s.venueCard}>
              <div style={s.venueCardName}>{selectedVenue.name}</div>
              <div style={s.venueCardAddr}>{selectedVenue.address}, {selectedVenue.city} {selectedVenue.zip}</div>
              <div style={s.venueCardRegion}>{selectedVenue.region}</div>
            </div>
          )}

          {isNewVenue && (
            <div style={s.newVenueForm}>
              <div style={s.newVenueHeading}>New Venue</div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Street Address</label>
                <input type="text" value={newVenueStreet}
                  onChange={(e) => setNewVenueStreet(e.target.value)}
                  placeholder="123 Main Street" style={s.input} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ ...s.fieldGroup, flex: 1 }}>
                  <label style={s.label}>City</label>
                  <input type="text" value={newVenueCity}
                    onChange={(e) => setNewVenueCity(e.target.value)}
                    placeholder="San Diego" style={s.input} />
                </div>
                <div style={{ ...s.fieldGroup, width: '120px', flexShrink: 0 }}>
                  <label style={s.label}>Zip Code</label>
                  <input type="text" value={newVenueZip} maxLength={5}
                    onChange={(e) => setNewVenueZip(e.target.value)}
                    placeholder="92101" style={s.input} />
                </div>
              </div>
              {newVenueRegion && (
                <div style={s.geocodeResult}>
                  Region: <strong>{newVenueRegion}</strong>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ── NO: Region Selection ─────────────────────────── */}
      {hasSiteAuthority === 'no' && (
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Part of Town</h2>
          <p style={s.bodyText}>
            We'll help find a venue in your area. Select the region that works best for you.
          </p>
          <div style={s.chipRow}>
            {REGIONS.map((r) => (
              <button key={r} style={region === r ? s.chipActive : s.chip}
                onClick={() => { setRegion(r); setSelectedSlotIds(new Set()); }}>
                {r}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Dates ───────────────────────────────────────── */}
      {venueReady && (
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Availability</h2>

          {!hasInstructors ? (
            <div style={s.warning}>
              We have no instructors who serve this area.
            </div>
          ) : (
            <>
              <div style={s.chipRow}>
                <button style={dateMode === 'specific' ? s.chipActive : s.chip}
                  onClick={() => setDateMode('specific')}>
                  Select Specific Dates
                </button>
                <button style={dateMode === 'flexible' ? s.chipActive : s.chip}
                  onClick={() => { setDateMode('flexible'); setSelectedSlotIds(new Set()); }}>
                  Dates are Flexible
                </button>
              </div>

              {dateMode === 'flexible' && (
                <p style={{ ...s.bodyText, marginTop: '12px' }}>
                  We'll work with you to find a date that works for both you and an available instructor.
                </p>
              )}

              {dateMode === 'specific' && (
                <div style={s.calendarWrapper}>
                  <p style={s.calendarHint}>
                    Click available time slots to select them. You may select multiple dates.
                    {selectedSlotIds.size > 0 && (
                      <strong> ({selectedSlotIds.size} selected)</strong>
                    )}
                  </p>

                  {/* Calendar grid */}
                  <div style={s.calendarGrid}>
                    {/* Header row */}
                    {DAY_HEADERS.map((d) => (
                      <div key={d} style={s.calHeaderCell}>{d}</div>
                    ))}

                    {/* Week rows */}
                    {calendarWeeks.map((week) =>
                      week.map((day) => {
                        const key = dateKey(day);
                        const daySlots = slotMap.get(key) ?? [];
                        const isToday = dateKey(TODAY) === key;
                        const isPast = day < TODAY;

                        return (
                          <div key={key} style={{
                            ...s.calCell,
                            ...(isPast ? s.calCellPast : {}),
                          }}>
                            <div style={{
                              ...s.calDate,
                              ...(isToday ? s.calDateToday : {}),
                            }}>
                              {formatMonthDay(day)}
                            </div>
                            {daySlots.map((slot) => (
                              <button
                                key={slot.id}
                                style={selectedSlotIds.has(slot.id) ? s.calSlotActive : s.calSlot}
                                onClick={() => toggleSlot(slot.id)}
                              >
                                {slot.startTime}
                              </button>
                            ))}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* ── Contact ─────────────────────────────────────── */}
      <section style={s.section}>
        <h2 style={s.sectionTitle}>Your Information</h2>
        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor="pub-name">Name</label>
          <input id="pub-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
            style={s.input} placeholder="Your full name" />
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor="pub-email">Email</label>
          <input id="pub-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            style={s.input} placeholder="you@example.com" />
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor="pub-phone">Phone <span style={s.optional}>(optional)</span></label>
          <input id="pub-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
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
  page: { maxWidth: '760px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1a1a1a' },
  title: { fontSize: '24px', fontWeight: 700, marginBottom: '6px' },
  subtitle: { fontSize: '15px', color: '#374151', lineHeight: 1.6, marginBottom: '12px' },
  switchLink: { fontSize: '13px', color: ORANGE, textDecoration: 'none', fontWeight: 600 },
  section: { marginTop: '28px' },
  sectionTitle: {
    fontSize: '16px', fontWeight: 600, color: '#374151', marginBottom: '12px',
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  fieldGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' },
  optional: { fontWeight: 400, color: '#9ca3af' },
  bodyText: { fontSize: '14px', color: '#374151', lineHeight: 1.5, marginBottom: '12px' },
  input: {
    width: '100%', boxSizing: 'border-box' as const,
    padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px',
    fontSize: '14px', color: '#1a1a1a', background: '#fff', outline: 'none',
  },
  chipRow: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
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

  // Venue search
  searchWrapper: { position: 'relative' as const },
  suggestions: {
    position: 'absolute' as const, top: '100%', left: 0, right: 0, zIndex: 10,
    background: '#fff', border: '1px solid #d1d5db', borderTop: 'none',
    borderRadius: '0 0 6px 6px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    maxHeight: '240px', overflowY: 'auto' as const,
  },
  suggestionItem: {
    display: 'flex', flexDirection: 'column' as const, gap: '2px',
    width: '100%', padding: '8px 12px', border: 'none', background: '#fff',
    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' as const,
    borderBottom: '1px solid #f3f4f6',
  },
  suggestionName: { fontSize: '14px', fontWeight: 600, color: '#1a1a1a' },
  suggestionDetail: { fontSize: '12px', color: '#6b7280' },
  venueCard: {
    background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px',
    padding: '12px 16px',
  },
  venueCardName: { fontSize: '15px', fontWeight: 600, color: '#065f46' },
  venueCardAddr: { fontSize: '13px', color: '#374151', marginTop: '2px' },
  venueCardRegion: { fontSize: '12px', color: '#059669', fontWeight: 600, marginTop: '4px' },

  // New venue
  newVenueItem: {
    display: 'block', width: '100%', padding: '10px 12px', border: 'none',
    background: '#f9fafb', cursor: 'pointer', fontFamily: 'inherit',
    textAlign: 'left' as const, borderTop: '1px solid #e5e7eb',
  },
  newVenueLabel: { fontSize: '14px', fontWeight: 600, color: ORANGE },
  newVenueForm: {
    background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px',
    padding: '16px', marginTop: '12px',
  },
  newVenueHeading: {
    fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '12px',
  },
  geocodeResult: {
    fontSize: '13px', color: '#059669', marginTop: '4px',
  },

  // Warning
  warning: {
    background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px',
    padding: '14px 18px', fontSize: '14px', color: '#991b1b', fontWeight: 500,
  },

  // Calendar
  calendarWrapper: { marginTop: '16px' },
  calendarHint: { fontSize: '13px', color: '#6b7280', marginBottom: '12px' },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '1px',
    background: '#e5e7eb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  calHeaderCell: {
    background: '#f3f4f6',
    padding: '6px 4px',
    fontSize: '11px',
    fontWeight: 700,
    color: '#6b7280',
    textAlign: 'center' as const,
    textTransform: 'uppercase' as const,
  },
  calCell: {
    background: '#fff',
    padding: '4px',
    minHeight: '70px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  calCellPast: {
    background: '#fafafa',
    opacity: 0.5,
  },
  calDate: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#9ca3af',
    marginBottom: '2px',
  },
  calDateToday: {
    color: ORANGE,
  },
  calSlot: {
    display: 'block',
    width: '100%',
    padding: '3px 4px',
    fontSize: '10px',
    fontWeight: 500,
    color: '#1e40af',
    background: '#dbeafe',
    border: '1px solid #bfdbfe',
    borderRadius: '3px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'center' as const,
  },
  calSlotActive: {
    display: 'block',
    width: '100%',
    padding: '3px 4px',
    fontSize: '10px',
    fontWeight: 700,
    color: '#fff',
    background: ORANGE,
    border: `1px solid ${ORANGE}`,
    borderRadius: '3px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'center' as const,
  },

  submitBtn: {
    marginTop: '24px', marginBottom: '40px',
    background: ORANGE, color: '#fff', border: 'none', borderRadius: '8px',
    padding: '12px 28px', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
  },
};
