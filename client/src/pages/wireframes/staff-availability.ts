// Two datasets:
// 1. Scheduled events — 6 confirmed events per month (shown on class page)
// 2. Instructor availability — weekly recurring slots (shown on request pages)

export interface StaffSlot {
  staffId: string;
  staffName: string;
  region: string;
  day: string;
  start: string;
  end: string;
}

// 7 instructors, 15 total slots:
//   S01 Alex:   4 slots (Central SD × 2, North County Coastal × 2)
//   S02 Jordan: 4 slots (Central SD × 2, East County × 2)
//   S03 Maria:  2 slots (North County Coastal × 2)
//   S04 Sam:    2 slots (North County Inland × 2)
//   S05 Priya:  1 slot  (South Bay)
//   S06 Chris:  1 slot  (East County)
//   S07 Lena:   1 slot  (North County Inland)
export const staffAvailability: StaffSlot[] = [
  { staffId: 'S01', staffName: 'Alex', region: 'Central San Diego', day: 'Saturday', start: '10:00', end: '14:00' },
  { staffId: 'S01', staffName: 'Alex', region: 'Central San Diego', day: 'Wednesday', start: '15:00', end: '17:00' },
  { staffId: 'S01', staffName: 'Alex', region: 'North County Coastal', day: 'Thursday', start: '15:00', end: '17:00' },
  { staffId: 'S01', staffName: 'Alex', region: 'North County Coastal', day: 'Saturday', start: '10:00', end: '14:00' },
  { staffId: 'S02', staffName: 'Jordan', region: 'Central San Diego', day: 'Tuesday', start: '15:00', end: '17:00' },
  { staffId: 'S02', staffName: 'Jordan', region: 'Central San Diego', day: 'Friday', start: '17:00', end: '18:30' },
  { staffId: 'S02', staffName: 'Jordan', region: 'East County', day: 'Saturday', start: '10:00', end: '14:00' },
  { staffId: 'S02', staffName: 'Jordan', region: 'East County', day: 'Thursday', start: '15:00', end: '17:00' },
  { staffId: 'S03', staffName: 'Maria', region: 'North County Coastal', day: 'Saturday', start: '10:00', end: '14:00' },
  { staffId: 'S03', staffName: 'Maria', region: 'North County Coastal', day: 'Wednesday', start: '15:00', end: '17:00' },
  { staffId: 'S04', staffName: 'Sam', region: 'North County Inland', day: 'Saturday', start: '10:00', end: '14:00' },
  { staffId: 'S04', staffName: 'Sam', region: 'North County Inland', day: 'Monday', start: '15:00', end: '17:00' },
  { staffId: 'S05', staffName: 'Priya', region: 'South Bay', day: 'Wednesday', start: '15:00', end: '17:00' },
  { staffId: 'S06', staffName: 'Chris', region: 'East County', day: 'Tuesday', start: '17:00', end: '18:30' },
  { staffId: 'S07', staffName: 'Lena', region: 'North County Inland', day: 'Friday', start: '15:00', end: '17:00' },
];

// ── Helpers ─────────────────────────────────────────────────

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return m === 0 ? `${h12}:00 ${ampm}` : `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function formatDate(d: Date): string {
  const dayName = DAY_NAMES[d.getDay()];
  const month = d.toLocaleString('en-US', { month: 'long' });
  const day = d.getDate();
  const year = d.getFullYear();
  return `${dayName}, ${month} ${day}, ${year}`;
}

// ── Scheduled Events (class page "Upcoming Events") ─────────
// 6 confirmed events per month, spread across regions.

export interface ScheduledEvent {
  id: string;
  className: string;
  date: string;
  timeRange: string;
  startTime: string;
  region: string;
  venue: string;
  dayOfWeek: string;
}

export const scheduledEvents: ScheduledEvent[] = [
  { id: 'ev-01', className: 'Hour of Micro:bit', date: formatDate(new Date(2026, 3, 18)), timeRange: '10:00 AM – 2:00 PM', startTime: '10:00 AM', region: 'Central San Diego', venue: 'La Jolla / Riford Library', dayOfWeek: 'Saturday' },
  { id: 'ev-02', className: 'Hour of Micro:bit', date: formatDate(new Date(2026, 3, 23)), timeRange: '3:00 PM – 5:00 PM', startTime: '3:00 PM', region: 'North County Inland', venue: 'Rancho Bernardo Library', dayOfWeek: 'Wednesday' },
  { id: 'ev-03', className: 'Hour of Micro:bit', date: formatDate(new Date(2026, 3, 26)), timeRange: '10:00 AM – 2:00 PM', startTime: '10:00 AM', region: 'North County Coastal', venue: 'Encinitas Branch', dayOfWeek: 'Saturday' },
  { id: 'ev-04', className: 'Hour of Micro:bit', date: formatDate(new Date(2026, 4, 2)), timeRange: '10:00 AM – 2:00 PM', startTime: '10:00 AM', region: 'South Bay', venue: 'Civic Center Branch', dayOfWeek: 'Saturday' },
  { id: 'ev-05', className: 'Hour of Micro:bit', date: formatDate(new Date(2026, 4, 7)), timeRange: '3:00 PM – 5:00 PM', startTime: '3:00 PM', region: 'East County', venue: 'El Cajon Branch', dayOfWeek: 'Wednesday' },
  { id: 'ev-06', className: 'Hour of Micro:bit', date: formatDate(new Date(2026, 4, 16)), timeRange: '10:00 AM – 2:00 PM', startTime: '10:00 AM', region: 'Central San Diego', venue: 'Scripps Miramar Ranch Library', dayOfWeek: 'Saturday' },
];

// ── Instructor Availability (request pages) ─────────────────
// Generated by projecting weekly recurring slots over 6 weeks.

export interface GeneratedSlot {
  id: string;
  staffId: string;
  region: string;
  dayOfWeek: string;
  date: string;
  timeRange: string;
  startTime: string;
}

const DAY_INDEX: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
  Thursday: 4, Friday: 5, Saturday: 6,
};

function generateSlots(startDate: Date, weeks: number): GeneratedSlot[] {
  const slots: GeneratedSlot[] = [];
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + weeks * 7);

  const cursor = new Date(startDate);
  cursor.setDate(cursor.getDate() - cursor.getDay()); // align to Sunday

  let idCounter = 1;

  while (cursor < endDate) {
    for (const avail of staffAvailability) {
      const targetDay = DAY_INDEX[avail.day];
      const slotDate = new Date(cursor);
      slotDate.setDate(cursor.getDate() + targetDay);

      if (slotDate < startDate || slotDate >= endDate) continue;

      slots.push({
        id: `gs-${String(idCounter++).padStart(3, '0')}`,
        staffId: avail.staffId,
        region: avail.region,
        dayOfWeek: avail.day,
        date: formatDate(slotDate),
        timeRange: `${formatTime(avail.start)} – ${formatTime(avail.end)}`,
        startTime: formatTime(avail.start),
      });
    }
    cursor.setDate(cursor.getDate() + 7);
  }

  return slots;
}

// Start one week from wireframe "today" (April 7), project 6 weeks
const WIREFRAME_START = new Date(2026, 3, 14); // April 14, 2026
export const generatedSlots = generateSlots(WIREFRAME_START, 6);
