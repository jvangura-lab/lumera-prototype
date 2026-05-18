import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import {
  useBooking,
  STEPS,
  getSelectedPractitioner,
} from '../state/BookingContext.jsx';
import {
  findServiceById,
  findSeriesById,
  PRACTITIONERS,
  FEES,
} from '../mockData.js';
import { formatPrice, formatDuration } from '../utils/formatting.js';
import { formatSlotLabel } from '../utils/availability.js';
import { summaryPartVariants } from '../motion/variants.js';

// Show the running summary once the user has at least picked a
// practitioner — useful at Calendar, Same-Day, Intake, Policy, and
// Checkout where users second-guess.
const VISIBLE_STEPS = new Set([
  STEPS.PRACTITIONER,
  STEPS.CALENDAR,
  STEPS.SERIES_FIRST,
  STEPS.SERIES_SCHEDULE,
  STEPS.SERIES_REVIEW,
  STEPS.SAME_DAY,
  STEPS.INTAKE,
  STEPS.POLICY,
  STEPS.CHECKOUT,
]);

export default function BookingSummaryBand() {
  const { state } = useBooking();
  if (!VISIBLE_STEPS.has(state.step)) return null;

  const service = state.serviceId ? findServiceById(state.serviceId) : null;
  const series = state.seriesId ? findSeriesById(state.seriesId) : null;
  const practitioner = pickPractitioner(state);
  const apt = state.appointment;

  // Build named parts with stable keys so AnimatePresence can fade-replace
  // a single slot when its value changes without disturbing siblings.
  const parts = [];

  if (series) {
    parts.push({ key: 'name', value: series.name });
    parts.push({ key: 'count', value: `${series.sessions} sessions` });
    parts.push({ key: 'price', value: formatPrice(series.totalPrice) });
  } else if (service) {
    parts.push({ key: 'name', value: service.name });
    parts.push({ key: 'duration', value: formatDuration(service.duration) });
    parts.push({ key: 'price', value: formatPrice(service.price) });
  }

  if (practitioner) parts.push({ key: 'practitioner', value: practitioner.name });

  if (apt?.dateIso && apt?.slot) {
    try {
      const d = parseISO(apt.dateIso);
      parts.push({
        key: 'appointment',
        value: `${format(d, 'EEE MMM d')}, ${formatSlotLabel(apt.slot)}`,
      });
    } catch {
      /* date-fns will throw on bad input; just skip */
    }
  }

  if (parts.length === 0) return null;

  const sameDayDeposit =
    state.sameDay === true ? formatPrice(FEES.sameDayDeposit) : null;

  return (
    <div className="sticky top-[136px] z-20 border-b border-cream-200 bg-bone/85 backdrop-blur">
      <div className="mx-auto flex max-w-site flex-wrap items-center gap-x-3 gap-y-1 px-6 py-2 md:px-10">
        <span className="font-sans text-[10px] uppercase tracking-eyebrow text-accent-strong">
          Booking
        </span>
        <span className="font-sans text-[13px] text-ink-900 num">
          {parts.map((p, i) => (
            <React.Fragment key={p.key}>
              {i > 0 && <span className="mx-2 text-ink-400">·</span>}
              <SummaryPart value={p.value} slotKey={p.key} />
            </React.Fragment>
          ))}
        </span>
        {sameDayDeposit && (
          <span className="font-sans text-[11px] text-ink-500">
            (same-day deposit {sameDayDeposit})
          </span>
        )}
      </div>
    </div>
  );
}

function SummaryPart({ value, slotKey }) {
  return (
    <span className="relative inline-flex">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={`${slotKey}:${value}`}
          variants={summaryPartVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="inline-flex"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function pickPractitioner(state) {
  const p = getSelectedPractitioner(state);
  if (p) return p;
  if (state.practitionerId === 'first-available') {
    return { name: 'First available' };
  }
  // If we have an appointment, prefer the appointment's actual
  // practitioner over any earlier "first-available" selection.
  if (state.appointment?.practitionerId) {
    const match = PRACTITIONERS.find(
      (pp) => pp.id === state.appointment.practitionerId
    );
    if (match) return match;
  }
  return null;
}
