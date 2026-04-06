// Shared mock data for all wireframe pages.
// Single source of truth so the same "story" is consistent across screens.

export interface MockClass {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  level: string;
  topics: string[];
  curriculumUrl: string;
  imageUrl: string;
  programs: { name: string; description: string; url: string }[];
}

export interface MockSite {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  type: 'library' | 'school' | 'science_center' | 'other_nonprofit';
  roomCapacity: number;
  hasWifi: boolean;
  powerOutletCount: number;
  hasProjector: boolean;
  accessNotes: string;
}

export interface MockAvailableDate {
  id: string;
  className: string;
  date: string;      // e.g. "Saturday, April 19, 2026"
  time: string;      // e.g. "3:30 PM"
  area: string;      // e.g. "North County"
  full?: boolean;    // true if event is at capacity
}

export interface MockRequestableSlot {
  id: string;
  className: string;
  date: string;
  time: string;
  neighborhood: string;
  siteName: string;
  zip: string;
  lat: number;
  lon: number;
  region: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
}

export interface MockCandidateDate {
  id: string;
  date: string;
  time: string;
  location: string;
}

export type RequestStatus = 'new' | 'discussing' | 'dates_proposed' | 'confirmed' | 'completed' | 'cancelled';
export type EventType = 'private' | 'public';

export interface MockEventRequest {
  id: string;
  classSlug: string;
  className: string;
  requesterName: string;
  requesterEmail: string;
  groupType: string;
  zipCode: string;
  expectedHeadcount: number;
  siteId: string | null;
  locationAddress: string;
  preferredDates: string[];
  status: RequestStatus;
  eventType: EventType;
  confirmedDate: string | null;
  instructorName: string | null;
  registrationCount: number;
  registrationLink: string;
  externalRegistrationUrl: string | null;
}

export interface MockRegistration {
  id: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  children: { name: string; age: number }[];
  role: 'attendee' | 'volunteer';
}

// ── Class Data ───────────────────────────────────────────────

export const mockClass: MockClass = {
  slug: 'hour-of-microbit-meetup',
  title: 'Hour of Micro:bit \u2014 Meetup',
  subtitle: 'Students experiment with LEDs, sensors, and radio communications to see how code controls physical hardware.',
  description:
    'Hour of Micro:bit is a gentle introduction to physical computing using the BBC Micro:bit, a pocket-sized programmable computer. In this short workshop, students write programs to control the Micro:bit\u2019s LED display, buttons, sensors, and radio communication capabilities. The Micro:bit\u2019s approachable interface and immediate physical feedback make it perfect for beginners to understand how code controls hardware. This course serves as both a standalone introduction to microcontrollers and as preparation for our more advanced robotics courses. Students leave with a concrete understanding of how programming translates to real-world actions.',
  level: 'beginner',
  topics: ['microcontrollers', 'electronics', 'programming'],
  curriculumUrl: 'https://league-curriculum.github.io/HourofMicrobit/',
  imageUrl: '/wireframe-assets/microbit.png',
  programs: [
    {
      name: 'Robot Garage',
      description: 'Hands-on electronics, robotics, and fabrication projects for students of any level.',
      url: '/programs/robot-garage-program',
    },
    {
      name: 'Tech Club',
      description: 'Free introductory classes in Python, Java, robotics, and electronics offered at schools, libraries and online',
      url: '/programs/tech-club',
    },
  ],
};

// ── Sites ────────────────────────────────────────────────────

export const mockSites: MockSite[] = [
  {
    id: 'site-1',
    name: 'Carmel Mountain Ranch Library',
    address: '12095 World Trade Dr',
    city: 'San Diego',
    state: 'CA',
    zip: '92128',
    type: 'library',
    roomCapacity: 30,
    hasWifi: true,
    powerOutletCount: 12,
    hasProjector: true,
    accessNotes: 'Community room on 2nd floor. Elevator available. Free parking lot.',
  },
  {
    id: 'site-2',
    name: 'Elementary Institute of Science',
    address: '608 E St',
    city: 'San Diego',
    state: 'CA',
    zip: '92101',
    type: 'science_center',
    roomCapacity: 25,
    hasWifi: true,
    powerOutletCount: 8,
    hasProjector: false,
    accessNotes: 'Main classroom. Street parking only. Enter through front desk.',
  },
  {
    id: 'site-3',
    name: 'Oak Park Elementary',
    address: '2606 54th St',
    city: 'San Diego',
    state: 'CA',
    zip: '92105',
    type: 'school',
    roomCapacity: 35,
    hasWifi: true,
    powerOutletCount: 10,
    hasProjector: true,
    accessNotes: 'Computer lab, Building B. Check in at front office. Parking in staff lot after 3 PM.',
  },
];

// ── Available Dates (for A1 discovery) ───────────────────────

export const mockAvailableDates: MockAvailableDate[] = [
  { id: 'ad-1', className: 'Hour of Micro:bit', date: 'Saturday, April 19, 2026', time: '3:30 PM', area: 'North County' },
  { id: 'ad-2', className: 'Hour of Micro:bit', date: 'Wednesday, April 23, 2026', time: '4:00 PM', area: 'Central San Diego', full: true },
  { id: 'ad-3', className: 'Intro to Python', date: 'Saturday, April 26, 2026', time: '10:00 AM', area: 'North County' },
  { id: 'ad-4', className: 'Hour of Micro:bit', date: 'Saturday, May 3, 2026', time: '2:00 PM', area: 'East County' },
  { id: 'ad-5', className: 'Game Design with Scratch', date: 'Wednesday, May 7, 2026', time: '4:00 PM', area: 'North County' },
];

// ── Requestable Slots (for class page request section) ──────

export const mockRequestableSlots: MockRequestableSlot[] = [
  // Saturday, April 19 — 3 regions
  { id: 'rs-01', className: 'Hour of Micro:bit', date: 'Saturday, April 19, 2026', time: '10:00 AM', neighborhood: 'Rancho Bernardo', siteName: 'Rancho Bernardo Library', zip: '92128', lat: 33.0002, lon: -117.0715, region: 'North County Inland', dayOfWeek: 'Saturday' },
  { id: 'rs-02', className: 'Hour of Micro:bit', date: 'Saturday, April 19, 2026', time: '2:00 PM', neighborhood: 'La Jolla', siteName: 'La Jolla Library', zip: '92037', lat: 32.8422, lon: -117.2617, region: 'Central San Diego', dayOfWeek: 'Saturday' },
  { id: 'rs-03', className: 'Hour of Micro:bit', date: 'Saturday, April 19, 2026', time: '3:30 PM', neighborhood: 'Chula Vista', siteName: 'Chula Vista Civic Center Library', zip: '91910', lat: 32.6243, lon: -117.074, region: 'South Bay', dayOfWeek: 'Saturday' },

  // Wednesday, April 23 — 2 regions
  { id: 'rs-04', className: 'Hour of Micro:bit', date: 'Wednesday, April 23, 2026', time: '4:00 PM', neighborhood: 'Poway', siteName: 'Poway Library', zip: '92064', lat: 32.978, lon: -117.0359, region: 'North County Inland', dayOfWeek: 'Wednesday' },
  { id: 'rs-05', className: 'Hour of Micro:bit', date: 'Wednesday, April 23, 2026', time: '4:00 PM', neighborhood: 'Clairemont', siteName: 'Clairemont Library', zip: '92117', lat: 32.8272, lon: -117.2028, region: 'Central San Diego', dayOfWeek: 'Wednesday' },

  // Saturday, April 26 — 2 regions
  { id: 'rs-06', className: 'Hour of Micro:bit', date: 'Saturday, April 26, 2026', time: '10:00 AM', neighborhood: 'Scripps Ranch', siteName: 'Scripps Ranch Library', zip: '92131', lat: 32.9122, lon: -117.1042, region: 'Central San Diego', dayOfWeek: 'Saturday' },
  { id: 'rs-07', className: 'Hour of Micro:bit', date: 'Saturday, April 26, 2026', time: '1:00 PM', neighborhood: 'El Cajon', siteName: 'El Cajon Library', zip: '92020', lat: 32.7948, lon: -116.9625, region: 'East County', dayOfWeek: 'Saturday' },

  // Tuesday, April 29 — 2 regions
  { id: 'rs-08', className: 'Hour of Micro:bit', date: 'Tuesday, April 29, 2026', time: '4:00 PM', neighborhood: 'Encinitas', siteName: 'Encinitas Library', zip: '92024', lat: 33.0518, lon: -117.2612, region: 'North County Coastal', dayOfWeek: 'Tuesday' },
  { id: 'rs-09', className: 'Hour of Micro:bit', date: 'Tuesday, April 29, 2026', time: '4:00 PM', neighborhood: 'Chula Vista', siteName: 'Chula Vista Civic Center Library', zip: '91910', lat: 32.6243, lon: -117.074, region: 'South Bay', dayOfWeek: 'Tuesday' },

  // Saturday, May 3 — 3 regions
  { id: 'rs-10', className: 'Hour of Micro:bit', date: 'Saturday, May 3, 2026', time: '10:00 AM', neighborhood: 'Rancho Bernardo', siteName: 'RB Community Center', zip: '92127', lat: 33.0245, lon: -117.1069, region: 'North County Inland', dayOfWeek: 'Saturday' },
  { id: 'rs-11', className: 'Hour of Micro:bit', date: 'Saturday, May 3, 2026', time: '2:00 PM', neighborhood: 'Mira Mesa', siteName: 'Mira Mesa Library', zip: '92126', lat: 32.9118, lon: -117.1443, region: 'North County Inland', dayOfWeek: 'Saturday' },
  { id: 'rs-12', className: 'Hour of Micro:bit', date: 'Saturday, May 3, 2026', time: '3:30 PM', neighborhood: 'La Jolla', siteName: 'La Jolla Library', zip: '92037', lat: 32.8422, lon: -117.2617, region: 'Central San Diego', dayOfWeek: 'Saturday' },

  // Wednesday, May 7 — 2 regions
  { id: 'rs-13', className: 'Hour of Micro:bit', date: 'Wednesday, May 7, 2026', time: '4:00 PM', neighborhood: 'Poway', siteName: 'Poway Library', zip: '92064', lat: 32.978, lon: -117.0359, region: 'North County Inland', dayOfWeek: 'Wednesday' },
  { id: 'rs-14', className: 'Hour of Micro:bit', date: 'Wednesday, May 7, 2026', time: '4:00 PM', neighborhood: 'Oceanside', siteName: 'Oceanside Library', zip: '92054', lat: 33.2076, lon: -117.3543, region: 'North County Coastal', dayOfWeek: 'Wednesday' },

  // Thursday, May 8 — 2 regions
  { id: 'rs-15', className: 'Hour of Micro:bit', date: 'Thursday, May 8, 2026', time: '4:00 PM', neighborhood: 'El Cajon', siteName: 'El Cajon Library', zip: '92020', lat: 32.7948, lon: -116.9625, region: 'East County', dayOfWeek: 'Thursday' },
  { id: 'rs-16', className: 'Hour of Micro:bit', date: 'Thursday, May 8, 2026', time: '4:00 PM', neighborhood: 'National City', siteName: 'National City Library', zip: '91950', lat: 32.667, lon: -117.099, region: 'South Bay', dayOfWeek: 'Thursday' },

  // Saturday, May 10 — 2 regions
  { id: 'rs-17', className: 'Hour of Micro:bit', date: 'Saturday, May 10, 2026', time: '10:00 AM', neighborhood: 'Scripps Ranch', siteName: 'Scripps Ranch Library', zip: '92131', lat: 32.9122, lon: -117.1042, region: 'Central San Diego', dayOfWeek: 'Saturday' },
  { id: 'rs-18', className: 'Hour of Micro:bit', date: 'Saturday, May 10, 2026', time: '1:00 PM', neighborhood: 'Carlsbad', siteName: 'Carlsbad Library', zip: '92008', lat: 33.1581, lon: -117.3376, region: 'North County Coastal', dayOfWeek: 'Saturday' },

  // Wednesday, May 14 — 2 regions
  { id: 'rs-19', className: 'Hour of Micro:bit', date: 'Wednesday, May 14, 2026', time: '4:00 PM', neighborhood: 'Rancho Bernardo', siteName: 'Rancho Bernardo Library', zip: '92128', lat: 33.0002, lon: -117.0715, region: 'North County Inland', dayOfWeek: 'Wednesday' },
  { id: 'rs-20', className: 'Hour of Micro:bit', date: 'Wednesday, May 14, 2026', time: '4:00 PM', neighborhood: 'Hillcrest', siteName: 'Mission Hills Library', zip: '92103', lat: 32.7493, lon: -117.1671, region: 'Central San Diego', dayOfWeek: 'Wednesday' },

  // Saturday, May 17 — 3 regions
  { id: 'rs-21', className: 'Hour of Micro:bit', date: 'Saturday, May 17, 2026', time: '10:00 AM', neighborhood: 'Mira Mesa', siteName: 'Mira Mesa Library', zip: '92126', lat: 32.9118, lon: -117.1443, region: 'North County Inland', dayOfWeek: 'Saturday' },
  { id: 'rs-22', className: 'Hour of Micro:bit', date: 'Saturday, May 17, 2026', time: '2:00 PM', neighborhood: 'La Jolla', siteName: 'La Jolla Library', zip: '92037', lat: 32.8422, lon: -117.2617, region: 'Central San Diego', dayOfWeek: 'Saturday' },
  { id: 'rs-23', className: 'Hour of Micro:bit', date: 'Saturday, May 17, 2026', time: '3:30 PM', neighborhood: 'Chula Vista', siteName: 'Chula Vista Civic Center Library', zip: '91910', lat: 32.6243, lon: -117.074, region: 'South Bay', dayOfWeek: 'Saturday' },
];

// ── Candidate Dates (for B6 voting) ─────────────────────────

export const mockCandidateDates: MockCandidateDate[] = [
  { id: 'cd-1', date: 'Saturday, April 19, 2026', time: '3:30 PM', location: 'Carmel Mountain Ranch Library' },
  { id: 'cd-2', date: 'Wednesday, April 23, 2026', time: '4:00 PM', location: 'Carmel Mountain Ranch Library' },
  { id: 'cd-3', date: 'Saturday, May 3, 2026', time: '2:00 PM', location: 'Carmel Mountain Ranch Library' },
];

// ── Event Requests (for B4 dashboard) ────────────────────────

export const mockRequests: MockEventRequest[] = [
  {
    id: 'req-4827',
    classSlug: 'hour-of-microbit-meetup',
    className: 'Hour of Micro:bit',
    requesterName: 'Maria Santos',
    requesterEmail: 'maria.santos@email.com',
    groupType: 'Girl Scout troop',
    zipCode: '92128',
    expectedHeadcount: 15,
    siteId: 'site-1',
    locationAddress: 'Carmel Mountain Ranch Library, 12095 World Trade Dr, San Diego, CA 92128',
    preferredDates: ['Saturday, April 19, 2026', 'Saturday, May 3, 2026'],
    status: 'confirmed',
    eventType: 'private',
    confirmedDate: 'Saturday, April 19, 2026 at 3:30 PM',
    instructorName: 'Alex',
    registrationCount: 12,
    registrationLink: '/wireframes/b6-voting',
    externalRegistrationUrl: null,
  },
  {
    id: 'req-4831',
    classSlug: 'intro-to-python',
    className: 'Intro to Python',
    requesterName: 'Maria Santos',
    requesterEmail: 'maria.santos@email.com',
    groupType: 'School',
    zipCode: '92128',
    expectedHeadcount: 25,
    siteId: 'site-3',
    locationAddress: 'Oak Park Elementary, 2606 54th St, San Diego, CA 92105',
    preferredDates: ['Saturday, April 26, 2026'],
    status: 'discussing',
    eventType: 'private',
    confirmedDate: null,
    instructorName: null,
    registrationCount: 0,
    registrationLink: '',
    externalRegistrationUrl: null,
  },
  {
    id: 'req-4815',
    classSlug: 'hour-of-microbit-meetup',
    className: 'Hour of Micro:bit',
    requesterName: 'Maria Santos',
    requesterEmail: 'maria.santos@email.com',
    groupType: 'Library',
    zipCode: '92101',
    expectedHeadcount: 20,
    siteId: 'site-2',
    locationAddress: 'Elementary Institute of Science, 608 E St, San Diego, CA 92101',
    preferredDates: ['Saturday, March 8, 2026'],
    status: 'completed',
    eventType: 'public',
    confirmedDate: 'Saturday, March 8, 2026 at 2:00 PM',
    instructorName: 'Jordan',
    registrationCount: 18,
    registrationLink: '',
    externalRegistrationUrl: 'https://eisci.org/events/microbit-march',
  },
];

// Convenience: the "primary" request used by B1, B2, B5 detail views
export const mockPrimaryRequest = mockRequests[0];

// ── Registrations (for A2 and B5) ────────────────────────────

export const mockRegistrations: MockRegistration[] = [
  {
    id: 'reg-1',
    guardianName: 'Lisa Chen',
    guardianEmail: 'lisa.chen@email.com',
    guardianPhone: '(858) 555-0142',
    children: [{ name: 'Emma Chen', age: 10 }, { name: 'Lucas Chen', age: 8 }],
    role: 'attendee',
  },
  {
    id: 'reg-2',
    guardianName: 'David Park',
    guardianEmail: 'david.park@email.com',
    guardianPhone: '(858) 555-0198',
    children: [{ name: 'Sophia Park', age: 11 }],
    role: 'attendee',
  },
  {
    id: 'reg-3',
    guardianName: 'Rachel Kim',
    guardianEmail: 'rachel.kim@email.com',
    guardianPhone: '(858) 555-0265',
    children: [],
    role: 'volunteer',
  },
];
