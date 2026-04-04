import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockRequestableSlots } from './mock-data';
import { zipData, haversineDistance } from './zip-data';
import type { ZipEntry } from './zip-data';

const ORANGE = '#ea580c';

// ── Dedup helpers for selector lists ────────────────────────

type Slot = typeof mockRequestableSlots[0];

/** Keep one entry per unique date string (first occurrence). */
function deduplicateByDate(slots: Slot[]): Slot[] {
  const seen = new Set<string>();
  return slots.filter((s) => {
    if (seen.has(s.date)) return false;
    seen.add(s.date);
    return true;
  });
}

/** Keep one entry per unique neighborhood (first occurrence). */
function deduplicateByLocation(slots: Slot[]): Slot[] {
  const seen = new Set<string>();
  return slots.filter((s) => {
    if (seen.has(s.neighborhood)) return false;
    seen.add(s.neighborhood);
    return true;
  });
}

// ── Location search helper ──────────────────────────────────

function searchZips(query: string): ZipEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  // Exact zip match
  if (/^\d{3,5}$/.test(q)) {
    return zipData.filter((z) => z.zip.startsWith(q)).slice(0, 8);
  }
  // Name match
  return zipData
    .filter((z) => z.neighborhood.toLowerCase().includes(q))
    // Deduplicate by neighborhood name (keep first/standard)
    .filter((z, i, arr) => arr.findIndex((a) => a.neighborhood === z.neighborhood) === i)
    .slice(0, 8);
}

// ── Slot with computed distance ─────────────────────────────

interface SlotWithDistance {
  slot: typeof mockRequestableSlots[0];
  distance: number;
}

function slotsNear(lat: number, lon: number, maxMiles: number): SlotWithDistance[] {
  return mockRequestableSlots
    .map((slot) => ({
      slot,
      distance: Math.round(haversineDistance(lat, lon, slot.lat, slot.lon)),
    }))
    .filter((s) => s.distance <= maxMiles)
    .sort((a, b) => a.slot.id.localeCompare(b.slot.id)); // chronological
}

// ── Main Component ──────────────────────────────────────────

export default function B1Intake() {
  const navigate = useNavigate();

  // Event type
  const [eventType, setEventType] = useState<'public' | 'private'>('public');

  // Location search
  const [locationQuery, setLocationQuery] = useState('');
  const [resolvedLocation, setResolvedLocation] = useState<{ label: string; lat: number; lon: number } | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Date selection
  const [selectedDateId, setSelectedDateId] = useState('');

  // Contact info
  const [requesterName, setRequesterName] = useState('Maria Santos');
  const [requesterEmail, setRequesterEmail] = useState('maria.santos@email.com');

  // Private-only
  const [privateGroupType, setPrivateGroupType] = useState('');
  const [groupSize, setGroupSize] = useState(15);
  const [maxDistance, setMaxDistance] = useState(20);
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');

  // Additional
  const [siteReadiness, setSiteReadiness] = useState('ready');
  const [promotionHelp, setPromotionHelp] = useState('');
  const [additionalContacts, setAdditionalContacts] = useState('');
  const [externalRegUrl, setExternalRegUrl] = useState('');

  const isPrivate = eventType === 'private';

  // Search suggestions
  const suggestions = useMemo(() => searchZips(locationQuery), [locationQuery]);

  // Available slots near resolved location
  const availableSlots = useMemo(() => {
    if (!resolvedLocation) return [];
    return slotsNear(resolvedLocation.lat, resolvedLocation.lon, maxDistance);
  }, [resolvedLocation, maxDistance]);

  // For public mode: work directly with all slots (no location search needed)
  const selectedSlot = mockRequestableSlots.find((s) => s.id === selectedDateId);

  // Public: dates at selected slot's neighborhood vs others
  const publicSlotsAtSelectedNeighborhood = selectedSlot
    ? mockRequestableSlots.filter((s) => s.neighborhood === selectedSlot.neighborhood)
    : [];
  const publicSlotsAtOtherNeighborhoods = selectedSlot
    ? mockRequestableSlots.filter((s) => s.neighborhood !== selectedSlot.neighborhood)
    : mockRequestableSlots;

  // Public: locations for selected date vs other dates
  const publicLocationsForSelectedDate = selectedSlot
    ? mockRequestableSlots.filter((s) => s.date === selectedSlot.date && s.time === selectedSlot.time)
    : [];
  const publicLocationsForOtherDates = (selectedSlot
    ? mockRequestableSlots.filter((s) => !(s.date === selectedSlot.date && s.time === selectedSlot.time))
    : [...mockRequestableSlots]
  ).sort((a, b) => a.neighborhood.localeCompare(b.neighborhood));

  function handleSelectSuggestion(entry: ZipEntry) {
    setLocationQuery(`${entry.neighborhood} (${entry.zip})`);
    setResolvedLocation({ label: entry.neighborhood, lat: entry.lat, lon: entry.lon });
    setShowSuggestions(false);
    setSelectedDateId(''); // reset date when location changes
  }

  function handleTypeChange(type: 'public' | 'private') {
    setEventType(type);
    setSelectedDateId('');
  }

  function handleLocationInputChange(value: string) {
    setLocationQuery(value);
    setShowSuggestions(true);
    // If user clears the input, clear resolved location
    if (!value.trim()) {
      setResolvedLocation(null);
      setSelectedDateId('');
    }
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>Request an Event</h1>
      <p style={styles.pageSubtitle}>
        Tell us about your group and where you'd like to host the event.
      </p>

      {/* ── Class (read-only) ──────────────────────────────── */}
      <section style={styles.section}>
        <ReadOnlyField label="Class" value="Hour of Micro:bit" />
      </section>

      <Divider />

      {/* ── Event Type ─────────────────────────────────────── */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Event Type</h2>
        <div style={styles.typeToggle}>
          <button
            style={eventType === 'public' ? styles.typeButtonActive : styles.typeButton}
            onClick={() => handleTypeChange('public')}
          >
            Public
          </button>
          <button
            style={eventType === 'private' ? styles.typeButtonActive : styles.typeButton}
            onClick={() => handleTypeChange('private')}
          >
            Private
          </button>
        </div>
        <p style={styles.typeHint}>
          {isPrivate
            ? 'Private events are for organized groups — scout troops, clubs, school classes.'
            : 'Public events are open to anyone and promoted through Meetup.'}
        </p>

        {isPrivate && (
          <div style={{ ...styles.fieldGroup, marginTop: '16px' }}>
            <label style={styles.label} htmlFor="privateGroupType">Group Type</label>
            <select
              id="privateGroupType"
              value={privateGroupType}
              onChange={(e) => setPrivateGroupType(e.target.value)}
              style={styles.select}
            >
              <option value="">— Select group type —</option>
              <option value="scouts">Scouts</option>
              <option value="youth_club">Youth Club</option>
              <option value="public_school">Public School</option>
              <option value="private_school">Private School</option>
            </select>
          </div>
        )}
      </section>

      <Divider />

      {/* ── Date & Location ────────────────────────────────── */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Date & Location</h2>

        {!isPrivate ? (
          /* ── PUBLIC: side-by-side date & location columns shown directly ── */
          <div style={styles.twoCol}>
            {/* Left: Dates */}
            <div style={styles.selectorBox}>
              <div style={styles.selectorLabel}>Date</div>

              {selectedDateId && publicSlotsAtSelectedNeighborhood.length > 0 && (
                <>
                  <div style={styles.subheading}>
                    Dates at {selectedSlot?.neighborhood}
                  </div>
                  {publicSlotsAtSelectedNeighborhood.map((slot) => (
                    <button
                      key={slot.id}
                      style={selectedDateId === slot.id ? styles.optionCompactActive : styles.optionCompact}
                      onClick={() => setSelectedDateId(slot.id)}
                    >
                      {slot.date}, {slot.time}
                    </button>
                  ))}
                </>
              )}

              <div style={styles.subheading}>
                {selectedDateId ? 'Dates at other locations' : 'All available dates'}
              </div>
              {deduplicateByDate(selectedDateId ? publicSlotsAtOtherNeighborhoods : mockRequestableSlots).map((slot) => (
                <button
                  key={slot.id}
                  style={selectedDateId === slot.id ? styles.optionCompactActive : styles.optionCompact}
                  onClick={() => setSelectedDateId(slot.id)}
                >
                  {slot.date}, {slot.time}
                </button>
              ))}
            </div>

            {/* Right: Locations */}
            <div style={styles.selectorBox}>
              <div style={styles.selectorLabel}>Location</div>

              {selectedDateId && (
                <>
                  <div style={styles.subheading}>Locations for this date</div>
                  {publicLocationsForSelectedDate.map((slot) => (
                    <button
                      key={slot.id}
                      style={selectedDateId === slot.id ? styles.optionCompactActive : styles.optionCompact}
                      onClick={() => setSelectedDateId(slot.id)}
                    >
                      {slot.neighborhood} — {slot.siteName}
                    </button>
                  ))}

                  <div style={styles.subheading}>Locations for other dates</div>
                </>
              )}
              {deduplicateByLocation(selectedDateId ? publicLocationsForOtherDates : mockRequestableSlots).map((slot) => (
                <button
                  key={slot.id}
                  style={styles.optionCompact}
                  onClick={() => setSelectedDateId(slot.id)}
                >
                  {slot.neighborhood} — {slot.siteName}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── PRIVATE: zip code, group size, dates, venue name/address ── */
          <>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
              <div style={{ ...styles.fieldGroup, flex: 1, maxWidth: '260px' }}>
                <label style={styles.label}>Your Zip Code</label>
                <div style={styles.searchWrapper}>
                  <input
                    type="text"
                    placeholder="Zip code or neighborhood"
                    value={locationQuery}
                    onChange={(e) => handleLocationInputChange(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    style={styles.input}
                  />
                  {showSuggestions && suggestions.length > 0 && !resolvedLocation && (
                    <div style={styles.suggestions}>
                      {suggestions.map((entry) => (
                        <button
                          key={entry.zip}
                          style={styles.suggestionItem}
                          onClick={() => handleSelectSuggestion(entry)}
                        >
                          <span style={styles.suggestionName}>{entry.neighborhood}</span>
                          <span style={styles.suggestionZip}>{entry.zip}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ ...styles.fieldGroup, width: '120px', flexShrink: 0 }}>
                <label style={styles.label} htmlFor="maxDistance">Max Distance</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    id="maxDistance"
                    type="number"
                    min={5}
                    max={50}
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                    style={{ ...styles.input, width: '70px' }}
                  />
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>mi</span>
                </div>
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="groupSize">Expected Group Size</label>
              <input
                id="groupSize"
                type="number"
                min={1}
                value={groupSize}
                onChange={(e) => setGroupSize(Number(e.target.value))}
                style={{ ...styles.input, width: '120px' }}
              />
            </div>

            {resolvedLocation && (
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Available Dates within {maxDistance} mi of {resolvedLocation.label}</label>
                {availableSlots.length === 0 ? (
                  <p style={styles.noOptions}>
                    No available dates within {maxDistance} miles. Try increasing the distance or a different location.
                  </p>
                ) : (
                  <div style={styles.twoCol}>
                    <div>
                      <div style={styles.subheading}>Weekdays</div>
                      <div style={styles.selectorBox}>
                      {availableSlots
                        .filter(({ slot }) => !slot.date.startsWith('Saturday') && !slot.date.startsWith('Sunday'))
                        .map(({ slot }) => (
                          <button
                            key={slot.id}
                            style={selectedDateId === slot.id ? styles.optionCompactActive : styles.optionCompact}
                            onClick={() => setSelectedDateId(slot.id)}
                          >
                            {slot.date}, {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={styles.subheading}>Weekends</div>
                      <div style={styles.selectorBox}>
                      {availableSlots
                        .filter(({ slot }) => slot.date.startsWith('Saturday') || slot.date.startsWith('Sunday'))
                        .map(({ slot }) => (
                          <button
                            key={slot.id}
                            style={selectedDateId === slot.id ? styles.optionCompactActive : styles.optionCompact}
                            onClick={() => setSelectedDateId(slot.id)}
                          >
                            {slot.date}, {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="venueName">Preferred Venue Name</label>
              <input
                id="venueName"
                type="text"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="e.g. Poway Library, Troop 42 Meeting Hall"
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="venueAddress">Venue Address</label>
              <input
                id="venueAddress"
                type="text"
                value={venueAddress}
                onChange={(e) => setVenueAddress(e.target.value)}
                placeholder="Street address, city, zip"
                style={styles.input}
              />
            </div>
          </>
        )}
      </section>

      <Divider />

      {/* ── Your Information ───────────────────────────────── */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Your Information</h2>

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="requesterName">Name</label>
          <input
            id="requesterName"
            type="text"
            value={requesterName}
            onChange={(e) => setRequesterName(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="requesterEmail">Email</label>
          <input
            id="requesterEmail"
            type="email"
            value={requesterEmail}
            onChange={(e) => setRequesterEmail(e.target.value)}
            style={styles.input}
          />
        </div>
      </section>

      <Divider />

      {/* ── Additional Information ─────────────────────────── */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Additional Information</h2>

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="siteReadiness">Site Readiness</label>
          <select
            id="siteReadiness"
            value={siteReadiness}
            onChange={(e) => setSiteReadiness(e.target.value)}
            style={styles.select}
          >
            <option value="ready">Ready to go</option>
            <option value="needs_setup">Needs some setup</option>
            <option value="not_sure">Not sure</option>
          </select>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="promotionHelp">
            Can you help promote this event?
          </label>
          <input
            id="promotionHelp"
            type="text"
            value={promotionHelp}
            onChange={(e) => setPromotionHelp(e.target.value)}
            placeholder="e.g. school newsletter, troop email list, social media"
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="additionalContacts">
            Additional Contacts <span style={styles.optional}>(optional)</span>
          </label>
          <input
            id="additionalContacts"
            type="text"
            value={additionalContacts}
            onChange={(e) => setAdditionalContacts(e.target.value)}
            placeholder="e.g. school principal email"
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="externalRegUrl">
            External Registration URL <span style={styles.optional}>(optional)</span>
          </label>
          <input
            id="externalRegUrl"
            type="url"
            value={externalRegUrl}
            onChange={(e) => setExternalRegUrl(e.target.value)}
            placeholder="https://"
            style={styles.input}
          />
        </div>
      </section>

      {/* Submit */}
      <div style={styles.submitRow}>
        <button
          style={styles.submitBtn}
          onClick={() => navigate('/b2-donation')}
        >
          Review &amp; Submit &rarr;
        </button>
      </div>
    </div>
  );
}

// ── Helper Components ──────────────────────────────────────────

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div style={roStyles.wrapper}>
      <div style={roStyles.label}>{label}</div>
      <div style={roStyles.value}>{value}</div>
    </div>
  );
}

function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '8px 0' }} />;
}

// ── Styles ─────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: '760px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#1a1a1a',
  },
  pageTitle: { fontSize: '24px', fontWeight: 700, marginBottom: '6px' },
  pageSubtitle: { fontSize: '14px', color: '#6b7280', marginBottom: '28px', lineHeight: 1.5 },
  section: { marginBottom: '24px' },
  sectionTitle: { fontSize: '16px', fontWeight: 600, color: '#374151', marginBottom: '16px', marginTop: '20px' },
  fieldGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' },
  optional: { fontWeight: 400, color: '#9ca3af' },
  input: {
    width: '100%', boxSizing: 'border-box' as const,
    padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px',
    fontSize: '14px', color: '#1a1a1a', background: '#fff', outline: 'none',
  },
  select: {
    width: '100%', boxSizing: 'border-box' as const,
    padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px',
    fontSize: '14px', color: '#1a1a1a', background: '#fff', outline: 'none',
  },

  // Type toggle
  typeToggle: { display: 'flex', gap: '0', marginBottom: '8px' },
  typeButton: {
    padding: '8px 24px', fontSize: '14px', fontWeight: 600,
    border: '1px solid #d1d5db', background: '#fff', color: '#6b7280', cursor: 'pointer',
  },
  typeButtonActive: {
    padding: '8px 24px', fontSize: '14px', fontWeight: 600,
    border: `1px solid ${ORANGE}`, background: ORANGE, color: '#fff', cursor: 'pointer',
  },
  typeHint: { fontSize: '13px', color: '#9ca3af', margin: 0 },

  // Location search
  searchWrapper: { position: 'relative' as const },
  suggestions: {
    position: 'absolute' as const, top: '100%', left: 0, right: 0, zIndex: 10,
    background: '#fff', border: '1px solid #d1d5db', borderTop: 'none',
    borderRadius: '0 0 6px 6px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    maxHeight: '240px', overflowY: 'auto' as const,
  },
  suggestionItem: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    width: '100%', padding: '8px 12px', border: 'none', background: '#fff',
    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' as const,
    borderBottom: '1px solid #f3f4f6',
  },
  suggestionName: { fontSize: '14px', fontWeight: 600, color: '#1a1a1a' },
  suggestionZip: { fontSize: '12px', color: '#9ca3af' },

  // Two-column date/location selector (public mode)
  twoCol: { display: 'flex', gap: '16px', alignItems: 'flex-start' },
  selectorBox: {
    flex: 1, border: '1px solid #e5e7eb', borderRadius: '8px',
    padding: '12px', maxHeight: '400px', overflowY: 'auto' as const,
  },
  selectorLabel: {
    fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '8px',
    textTransform: 'uppercase' as const, letterSpacing: '0.4px',
  },
  subheading: {
    fontSize: '13px', fontWeight: 700, color: '#1e40af', margin: '16px 0 8px',
    padding: '7px 10px', background: '#dbeafe', borderRadius: '5px', borderLeft: '3px solid #3b82f6',
  },
  option: {
    display: 'block', width: '100%', textAlign: 'left' as const,
    padding: '6px 10px', border: '1px solid #f3f4f6', borderRadius: '5px',
    background: '#fff', cursor: 'pointer', marginBottom: '3px', fontFamily: 'inherit',
  },
  optionActive: {
    display: 'block', width: '100%', textAlign: 'left' as const,
    padding: '6px 10px', border: `1px solid ${ORANGE}`, borderRadius: '5px',
    background: '#fff7ed', cursor: 'pointer', marginBottom: '3px', fontFamily: 'inherit',
  },
  optionMuted: {
    display: 'block', width: '100%', textAlign: 'left' as const,
    padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: '5px',
    background: '#f9fafb', cursor: 'pointer', marginBottom: '3px', fontFamily: 'inherit',
  },
  optionMain: { fontSize: '13px', fontWeight: 600, color: '#1a1a1a' },
  optionSub: { fontSize: '12px', color: '#6b7280' },

  // Compact options for private date lists
  optionCompact: {
    display: 'block', width: '100%', textAlign: 'left' as const,
    padding: '6px 10px', border: '1px solid #f3f4f6', borderRadius: '5px',
    background: '#fff', cursor: 'pointer', marginBottom: '3px', fontFamily: 'inherit',
    fontSize: '13px', fontWeight: 500, color: '#1a1a1a',
  },
  optionCompactActive: {
    display: 'block', width: '100%', textAlign: 'left' as const,
    padding: '6px 10px', border: `1px solid ${ORANGE}`, borderRadius: '5px',
    background: '#fff7ed', cursor: 'pointer', marginBottom: '3px', fontFamily: 'inherit',
    fontSize: '13px', fontWeight: 600, color: '#1a1a1a',
  },

  dateList: { display: 'flex', flexDirection: 'column' as const, gap: '3px' },
  noOptions: { fontSize: '13px', color: '#9ca3af', fontStyle: 'italic' as const },

  submitRow: { paddingTop: '8px', paddingBottom: '40px' },
  submitBtn: {
    background: ORANGE, color: '#fff', border: 'none', borderRadius: '8px',
    padding: '12px 28px', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
  },
};

const roStyles: Record<string, React.CSSProperties> = {
  wrapper: {
    background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '6px',
    padding: '10px 14px', display: 'inline-block',
  },
  label: {
    fontSize: '11px', fontWeight: 600, color: '#9ca3af',
    textTransform: 'uppercase' as const, letterSpacing: '0.4px', marginBottom: '4px',
  },
  value: { fontSize: '14px', color: '#374151', fontWeight: 500 },
};
