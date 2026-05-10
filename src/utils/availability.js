import { addDays, format, isBefore, isSameDay, startOfDay } from 'date-fns';
import { PRACTITIONERS } from '../mockData.js';

// Deterministic-ish hash used to vary availability per practitioner-day.
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0);
}

const SESSION_SEED_KEY = '__magnolia_session_seed__';
function getSessionSeed() {
  if (typeof window === 'undefined') return 0;
  if (!window[SESSION_SEED_KEY]) {
    try {
      const stored = sessionStorage.getItem('magnolia.seed');
      if (stored) {
        window[SESSION_SEED_KEY] = parseInt(stored, 10) || 1;
      } else {
        const s = Math.floor(Math.random() * 1e9) + 1;
        sessionStorage.setItem('magnolia.seed', String(s));
        window[SESSION_SEED_KEY] = s;
      }
    } catch {
      window[SESSION_SEED_KEY] = 12345;
    }
  }
  return window[SESSION_SEED_KEY];
}

const ALL_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

// Per-practitioner availability "pattern" — different shapes so calendars look distinct.
const PRACTITIONER_PATTERNS = {
  chen:      { workdays: [1, 2, 3, 4, 5], density: 0.55, openSlots: ALL_SLOTS },
  martinez:  { workdays: [1, 3, 5, 6],     density: 0.65, openSlots: ALL_SLOTS.filter((_, i) => i % 2 === 0) },
  reyes:     { workdays: [2, 3, 4, 5, 6],  density: 0.7,  openSlots: ALL_SLOTS },
  park:      { workdays: [1, 2, 4],         density: 0.5,  openSlots: ALL_SLOTS.filter((_, i) => i >= 4) },
  brooks:    { workdays: [1, 2, 3, 5, 6],  density: 0.6,  openSlots: ALL_SLOTS },
};

export function getPractitionerSlots(practitionerId, date) {
  const pattern = PRACTITIONER_PATTERNS[practitionerId];
  if (!pattern) return [];
  const dow = date.getDay();
  if (!pattern.workdays.includes(dow)) return [];

  const seed = getSessionSeed();
  const dayKey = `${practitionerId}-${format(date, 'yyyy-MM-dd')}-${seed}`;
  const dayHash = hash(dayKey);
  // ~30% chance the practitioner is "off" this otherwise-working day
  if ((dayHash % 100) < 15) return [];

  const slots = [];
  pattern.openSlots.forEach((slot, idx) => {
    const slotKey = `${dayKey}-${slot}`;
    const h = hash(slotKey);
    const threshold = pattern.density * 100;
    if ((h % 100) < threshold) {
      slots.push(slot);
    }
  });
  // Filter past times if today
  if (isSameDay(date, new Date())) {
    const now = new Date();
    const cutoff = now.getHours() * 60 + now.getMinutes();
    return slots.filter((s) => {
      const [hh, mm] = s.split(':').map(Number);
      return hh * 60 + mm > cutoff + 30; // require 30min buffer
    });
  }
  return slots;
}

export function hasAnySlots(practitionerId, date) {
  return getPractitionerSlots(practitionerId, date).length > 0;
}

// Aggregated slots across multiple practitioners (for "First available")
export function getAggregateSlots(practitionerIds, date) {
  const out = {};
  practitionerIds.forEach((pid) => {
    getPractitionerSlots(pid, date).forEach((slot) => {
      if (!out[slot]) out[slot] = pid;
    });
  });
  return Object.entries(out)
    .map(([slot, pid]) => ({ slot, practitionerId: pid }))
    .sort((a, b) => a.slot.localeCompare(b.slot));
}

export function dayHasAvailability(date, practitionerIds) {
  if (isBefore(date, startOfDay(new Date()))) return false;
  return practitionerIds.some((pid) => getPractitionerSlots(pid, date).length > 0);
}

// Find first available date within +/- weeks window for a practitioner
export function findNearestAvailableDate(practitionerId, targetDate, windowDays = 14) {
  if (hasAnySlots(practitionerId, targetDate) && !isBefore(targetDate, startOfDay(new Date()))) {
    return { date: targetDate, adjusted: false };
  }
  for (let offset = 1; offset <= windowDays; offset++) {
    for (const dir of [1, -1]) {
      const candidate = addDays(targetDate, offset * dir);
      if (isBefore(candidate, startOfDay(new Date()))) continue;
      if (hasAnySlots(practitionerId, candidate)) {
        return { date: candidate, adjusted: true };
      }
    }
  }
  // Fallback: search forward up to 90 days
  for (let i = windowDays + 1; i <= 90; i++) {
    const c = addDays(targetDate, i);
    if (hasAnySlots(practitionerId, c)) {
      return { date: c, adjusted: true, outsideWindow: true };
    }
  }
  return null;
}

// Find a slot near preferred time
export function preferredSlotOnDate(practitionerId, date, preferredTime) {
  const slots = getPractitionerSlots(practitionerId, date);
  if (slots.length === 0) return null;
  if (preferredTime && slots.includes(preferredTime)) return preferredTime;
  if (preferredTime) {
    // Find nearest by minute distance
    const [ph, pm] = preferredTime.split(':').map(Number);
    const target = ph * 60 + pm;
    let best = slots[0];
    let bestDist = Infinity;
    slots.forEach((s) => {
      const [h, m] = s.split(':').map(Number);
      const d = Math.abs(h * 60 + m - target);
      if (d < bestDist) {
        bestDist = d;
        best = s;
      }
    });
    return best;
  }
  return slots[0];
}

export function formatSlotLabel(slot) {
  if (!slot) return '';
  const [hh, mm] = slot.split(':').map(Number);
  const h12 = ((hh + 11) % 12) + 1;
  const ampm = hh < 12 ? 'AM' : 'PM';
  return `${h12}:${mm.toString().padStart(2, '0')} ${ampm}`;
}

export { PRACTITIONERS };
