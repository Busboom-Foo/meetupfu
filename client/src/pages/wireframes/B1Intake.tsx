import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPrimaryRequest, mockSites } from './mock-data';

const NOT_LISTED = '__not_listed__';

export default function B1Intake() {
  const navigate = useNavigate();
  const req = mockPrimaryRequest;

  const [requesterName, setRequesterName] = useState(req.requesterName);
  const [groupType, setGroupType] = useState(req.groupType);
  const [headcount, setHeadcount] = useState<number>(req.expectedHeadcount);
  const [selectedSiteId, setSelectedSiteId] = useState<string>(req.siteId ?? '');
  const [customAddress, setCustomAddress] = useState('');
  const [siteReadiness, setSiteReadiness] = useState('ready');
  const [promotionHelp, setPromotionHelp] = useState('');
  const [additionalContacts, setAdditionalContacts] = useState('');
  const [externalRegUrl, setExternalRegUrl] = useState(req.externalRegistrationUrl ?? '');

  const selectedSite = mockSites.find((s) => s.id === selectedSiteId) ?? null;
  const showFacilityPanel = selectedSiteId !== '' && selectedSiteId !== NOT_LISTED && selectedSite !== null;
  const showCustomAddress = selectedSiteId === NOT_LISTED;

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>Request an Event</h1>
      <p style={styles.pageSubtitle}>
        Tell us about your group and where you'd like to host the event. We'll follow up within a few days.
      </p>

      {/* Section: Event Details (read-only) */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Event Details</h2>
        <div style={styles.readOnlyGrid}>
          <ReadOnlyField label="Class" value="Hour of Micro:bit" />
          <ReadOnlyField label="Selected Date" value="Saturday, April 19, 2026 at 3:30 PM" />
          <ReadOnlyField label="Zip Code" value="92128" />
          <ReadOnlyField label="Event Type" value="Private" />
          <ReadOnlyField label="Requester Email" value="maria.santos@email.com" />
        </div>
      </section>

      <Divider />

      {/* Section: About Your Group */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>About Your Group</h2>

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="requesterName">Your Name</label>
          <input
            id="requesterName"
            type="text"
            value={requesterName}
            onChange={(e) => setRequesterName(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="groupType">Group Type</label>
          <select
            id="groupType"
            value={groupType}
            onChange={(e) => setGroupType(e.target.value)}
            style={styles.select}
          >
            <option value="">— Select —</option>
            <option value="School">School</option>
            <option value="Girl Scout troop">Girl Scout Troop</option>
            <option value="BSA Troop">BSA Troop</option>
            <option value="Library">Library</option>
            <option value="Other Youth Group">Other Youth Group</option>
            <option value="Public">Public</option>
          </select>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="headcount">Expected Headcount</label>
          <input
            id="headcount"
            type="number"
            min={1}
            value={headcount}
            onChange={(e) => setHeadcount(Number(e.target.value))}
            style={{ ...styles.input, width: '120px' }}
          />
        </div>
      </section>

      <Divider />

      {/* Section: Location */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Location</h2>

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="site">Site</label>
          <select
            id="site"
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            style={styles.select}
          >
            <option value="">— Select a site —</option>
            {mockSites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name} — {site.city}
              </option>
            ))}
            <option value={NOT_LISTED}>My location isn't listed</option>
          </select>
        </div>

        {showFacilityPanel && selectedSite && (
          <div style={styles.facilityPanel}>
            <div style={styles.facilityTitle}>Facility Details</div>
            <div style={styles.facilityGrid}>
              <FacilityItem label="Room Capacity" value={String(selectedSite.roomCapacity)} />
              <FacilityItem label="WiFi" value={selectedSite.hasWifi ? 'Yes' : 'No'} />
              <FacilityItem label="Power Outlets" value={String(selectedSite.powerOutletCount)} />
              <FacilityItem label="Projector" value={selectedSite.hasProjector ? 'Yes' : 'No'} />
            </div>
            {selectedSite.accessNotes && (
              <div style={styles.facilityNotes}>
                <span style={styles.facilityNotesLabel}>Access notes: </span>
                {selectedSite.accessNotes}
              </div>
            )}
          </div>
        )}

        {showCustomAddress && (
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="customAddress">Your Location Address</label>
            <textarea
              id="customAddress"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              placeholder="Enter the full address of your location"
              rows={3}
              style={styles.textarea}
            />
          </div>
        )}

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
      </section>

      <Divider />

      {/* Section: Additional Information */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Additional Information</h2>

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

      {/* Submit Button */}
      <div style={styles.submitRow}>
        <button
          style={styles.submitBtn}
          onClick={() => navigate('/wireframes/b2-donation')}
        >
          Review &amp; Submit →
        </button>
      </div>
    </div>
  );
}

// Helper Components

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

function FacilityItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={facilityItemStyles.wrapper}>
      <span style={facilityItemStyles.label}>{label}:</span>
      <span style={facilityItemStyles.value}>{value}</span>
    </div>
  );
}

// Styles

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: '640px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#1a1a1a',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '6px',
  },
  pageSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '28px',
    lineHeight: 1.5,
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '16px',
    marginTop: '20px',
  },
  readOnlyGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  fieldGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '6px',
  },
  optional: {
    fontWeight: 400,
    color: '#9ca3af',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box' as const,
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#1a1a1a',
    background: '#fff',
    outline: 'none',
  },
  select: {
    width: '100%',
    boxSizing: 'border-box' as const,
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#1a1a1a',
    background: '#fff',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    boxSizing: 'border-box' as const,
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#1a1a1a',
    background: '#fff',
    outline: 'none',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
  },
  facilityPanel: {
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
  },
  facilityTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#1d4ed8',
    marginBottom: '12px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  facilityGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginBottom: '10px',
  },
  facilityNotes: {
    fontSize: '13px',
    color: '#374151',
    lineHeight: 1.5,
    borderTop: '1px solid #bfdbfe',
    paddingTop: '10px',
    marginTop: '4px',
  },
  facilityNotesLabel: {
    fontWeight: 600,
  },
  submitRow: {
    paddingTop: '8px',
    paddingBottom: '40px',
  },
  submitBtn: {
    background: '#ea580c',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 28px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

const roStyles: Record<string, React.CSSProperties> = {
  wrapper: {
    background: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    padding: '10px 14px',
  },
  label: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#9ca3af',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.4px',
    marginBottom: '4px',
  },
  value: {
    fontSize: '14px',
    color: '#374151',
    fontWeight: 500,
  },
};

const facilityItemStyles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#374151',
  },
  label: {
    fontWeight: 600,
    color: '#1d4ed8',
  },
  value: {
    color: '#1e3a8a',
  },
};
