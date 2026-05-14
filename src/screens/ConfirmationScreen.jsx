import React from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarPlus, CheckCircle2, RefreshCw } from 'lucide-react';
import ScreenChrome from '../components/ScreenChrome.jsx';
import { PrimaryButton, GhostButton } from '../components/Button.jsx';
import EmailPreview from '../components/EmailPreview.jsx';
import { useBooking, BOOKING_TYPES, isConsultFlow, isSeriesScheduled } from '../state/BookingContext.jsx';
import { findServiceById, findSeriesById, findPractitionerById, PLACEHOLDERS, FEES } from '../mockData.js';
import { formatPrice } from '../utils/formatting.js';
import { formatSlotLabel } from '../utils/availability.js';
import { buildIcs, downloadIcs, appointmentDateTime, endDateTime } from '../utils/ics.js';

export default function ConfirmationScreen() {
  const { state, actions } = useBooking();
  const isSeries = isSeriesScheduled(state);
  // Series booking type but no sessions scheduled = patient was new and routed to consult-only.
  const isSeriesRoutedToConsult =
    state.bookingType === BOOKING_TYPES.SERIES && !isSeries;
  const sessions = state.series?.sessions || [];
  const apt = state.appointment;
  const practitioner = findPractitionerById(
    isSeries ? sessions[0]?.practitionerId : apt?.practitionerId
  );
  const service = state.serviceId ? findServiceById(state.serviceId) : null;
  const series = state.seriesId ? findSeriesById(state.seriesId) : null;

  const isConsult = isConsultFlow(state);
  const sameDay = state.sameDay === true;
  const payment = state.payment;

  const downloadSingleIcs = () => {
    if (!apt) return;
    const start = appointmentDateTime(apt.dateIso, apt.slot);
    const dur = isConsult ? 30 : (service?.duration || 30);
    const end = endDateTime(start, dur);
    const summary = isConsult
      ? `Consultation${service ? ` — ${service.name}` : ''}`
      : `${service?.name || 'Appointment'}`;
    const ics = buildIcs([
      {
        uid: `lumera-${apt.dateIso}-${apt.slot}@lumera-aesthetics.com`,
        start, end,
        summary,
        description: `Practitioner: ${practitioner?.name}\nFormat: ${state.consultFormat || 'In-Person'}\nLocation: ${PLACEHOLDERS.spaName}`,
        location: PLACEHOLDERS.spaAddress,
      }
    ]);
    downloadIcs('lumera-appointment.ics', ics);
  };

  const downloadSeriesIcs = () => {
    if (sessions.length === 0) return;
    const events = sessions.map((s, i) => {
      const start = appointmentDateTime(s.dateIso, s.slot);
      const end = endDateTime(start, series?.duration || 30);
      return {
        uid: `lumera-series-${state.seriesId}-${i}@lumera-aesthetics.com`,
        start, end,
        summary: `${series.name} — Session ${i + 1} of ${series.sessions}`,
        description: `Practitioner: ${practitioner?.name}\nLocation: ${PLACEHOLDERS.spaName}`,
        location: PLACEHOLDERS.spaAddress,
      };
    });
    if (apt && isConsult) {
      const start = appointmentDateTime(apt.dateIso, apt.slot);
      events.unshift({
        uid: `lumera-series-consult-${state.seriesId}@lumera-aesthetics.com`,
        start,
        end: endDateTime(start, 30),
        summary: `Consultation — ${series.name}`,
        description: `Practitioner: ${practitioner?.name}\nFormat: ${state.consultFormat || 'In-Person'}`,
        location: PLACEHOLDERS.spaAddress,
      });
    }
    const ics = buildIcs(events);
    downloadIcs('lumera-series.ics', ics);
  };

  return (
    <ScreenChrome hideBack>
      <div className="text-center py-2">
        <div className="w-14 h-14 mx-auto rounded-full bg-gold-300/30 flex items-center justify-center mb-3">
          <CheckCircle2 className="w-7 h-7 text-gold-600" strokeWidth={2.5} />
        </div>
        <h1 className="font-display text-3xl text-espresso-900 mb-1" style={{ fontWeight: 600 }}>
          You're booked!
        </h1>
        <p className="text-sm text-ink-500">
          A confirmation has been sent to <span className="text-ink-900">{state.intake.email}</span>.
        </p>
      </div>

      <div className="rounded-xl border border-cream-200 bg-white p-4 space-y-3 fade-in-up">
        {isSeries ? (
          <>
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-gold-600 mb-0.5">Your series</div>
              <div className="font-display text-xl" style={{ fontWeight: 600 }}>
                {series?.name} — {series?.sessions} sessions
              </div>
              <div className="text-xs text-ink-500">with {practitioner?.name}</div>
            </div>
            {isConsult && apt && (
              <div className="rounded-lg bg-cream-50 p-2.5 text-sm">
                <div className="text-[10px] uppercase tracking-[0.14em] text-ink-500 mb-0.5">Consultation first</div>
                <div className="num">
                  {format(parseISO(apt.dateIso), 'EEE, MMM d, yyyy')} · {formatSlotLabel(apt.slot)} <span className="text-ink-400">(ET)</span>
                </div>
                <div className="text-[11px] text-ink-500">{state.consultFormat === 'virtual' ? 'Virtual' : 'In-Person'} · {PLACEHOLDERS.spaName}</div>
              </div>
            )}
            <div className="space-y-1.5">
              {sessions.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-sm border-b border-cream-100 last:border-0 pb-1.5 last:pb-0">
                  <div>
                    <div className="font-medium num">Session {i + 1}</div>
                    <div className="text-[11px] text-ink-500 num">
                      {format(parseISO(s.dateIso), 'EEE, MMM d')} · {formatSlotLabel(s.slot)} <span className="text-ink-400">(ET)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <PaymentSummary state={state} />
          </>
        ) : (
          <>
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-gold-600 mb-0.5">Your visit</div>
              <div className="font-display text-xl" style={{ fontWeight: 600 }}>
                {isConsult
                  ? `Consultation${(isSeriesRoutedToConsult ? ` — ${series?.name}` : (service ? ` — ${service.name}` : ''))}`
                  : service?.name}
              </div>
              <div className="text-xs text-ink-500">with {practitioner?.name}</div>
            </div>
            {apt && (
              <div className="rounded-lg bg-cream-50 p-2.5 text-sm">
                <div className="num">{format(parseISO(apt.dateIso), 'EEEE, MMMM d, yyyy')}</div>
                <div className="num">{formatSlotLabel(apt.slot)} <span className="text-ink-400">(ET)</span></div>
                <div className="text-[11px] text-ink-500 mt-1">
                  {isConsult ? (state.consultFormat === 'virtual' ? 'Virtual' : 'In-Person') : 'In-Person'} · {PLACEHOLDERS.spaName} · {PLACEHOLDERS.spaAddress}
                </div>
              </div>
            )}
            {isSeriesRoutedToConsult && series && (
              <div className="text-[12px] text-gold-600 bg-gold-300/10 rounded-md px-2 py-1.5">
                After your consultation, you can schedule your {series.name} series.
              </div>
            )}
            {sameDay && (
              <div className="text-[12px] text-gold-600 bg-gold-300/10 rounded-md px-2 py-1.5">
                Same-day procedure reserved (deposit paid).
              </div>
            )}
            <PaymentSummary state={state} />
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={isSeries ? downloadSeriesIcs : downloadSingleIcs}
          className="rounded-xl px-3 py-2.5 border border-cream-200 bg-white hover:bg-cream-50 text-sm font-medium text-ink-700 flex items-center justify-center gap-1.5"
        >
          <CalendarPlus className="w-4 h-4" /> Add to Calendar
        </button>
        <button
          type="button"
          onClick={() => actions.resetAll()}
          className="rounded-xl px-3 py-2.5 bg-espresso-800 hover:bg-espresso-700 text-cream-100 text-sm font-medium flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" /> Book another
        </button>
      </div>

      <div className="space-y-3 pt-4">
        <div className="text-[10px] uppercase tracking-[0.16em] text-ink-500">Email previews</div>
        <PatientEmail state={state} />
        <SpaEmail state={state} />
      </div>
    </ScreenChrome>
  );
}

function PaymentSummary({ state }) {
  const payment = state.payment;
  if (!payment) return null;
  return (
    <div className="border-t border-cream-200 pt-2 text-[12px] num text-ink-700">
      {payment.paid
        ? <>Paid <span className="font-semibold">{formatPrice(payment.amount)}</span> on {payment.brand} •••• {payment.last4}</>
        : <>Card on file: {payment.brand} •••• {payment.last4} (no charge today)</>
      }
    </div>
  );
}

function PatientEmail({ state }) {
  const isSeries = isSeriesScheduled(state);
  const isSeriesRoutedToConsult = state.bookingType === BOOKING_TYPES.SERIES && !isSeries;
  const sessions = state.series?.sessions || [];
  const apt = state.appointment;
  const practitioner = findPractitionerById(
    isSeries ? sessions[0]?.practitionerId : apt?.practitionerId
  );
  const service = state.serviceId ? findServiceById(state.serviceId) : null;
  const series = state.seriesId ? findSeriesById(state.seriesId) : null;
  const isConsult = isConsultFlow(state);

  return (
    <EmailPreview
      from={`bookings@${PLACEHOLDERS.spaName.replace(/[\[\]\s]/g, '').toLowerCase() || 'medspa'}.com (${PLACEHOLDERS.spaName})`}
      to={state.intake.email}
      subject={isSeries ? `Your ${series.name} series is booked` : `Your appointment is confirmed`}
    >
      <p>Hi {state.intake.fullName.split(' ')[0] || 'there'},</p>
      {isSeries ? (
        <>
          <p>Your {series.name} series ({series.sessions} sessions) is booked with {practitioner?.name}.</p>
          {isConsult && apt && (
            <p>
              Consultation first:{' '}
              <strong>{format(parseISO(apt.dateIso), 'EEEE, MMM d')} · {formatSlotLabel(apt.slot)} (ET)</strong>{' '}
              ({state.consultFormat === 'virtual' ? 'Virtual' : 'In-Person'}).
            </p>
          )}
          <ul className="list-disc pl-5 space-y-0.5 num">
            {sessions.map((s, i) => (
              <li key={i}>
                Session {i + 1}: {format(parseISO(s.dateIso), 'EEE, MMM d, yyyy')} · {formatSlotLabel(s.slot)} (ET)
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <p>
            Your {isConsult ? 'consultation' : service?.name} with {practitioner?.name} is confirmed for{' '}
            <strong>
              {apt && format(parseISO(apt.dateIso), 'EEEE, MMM d, yyyy')} at {apt && formatSlotLabel(apt.slot)} (ET)
            </strong>.
          </p>
          {isConsult && (
            <p>Format: {state.consultFormat === 'virtual' ? 'Virtual' : 'In-Person'}</p>
          )}
          {state.sameDay && (
            <p>You've reserved a same-day procedure slot. Your $150 deposit is held.</p>
          )}
          {isSeriesRoutedToConsult && series && (
            <p>After your visit, you can schedule your <strong>{series.name}</strong> series ({series.sessions} sessions).</p>
          )}
        </>
      )}
      <p>Location: {PLACEHOLDERS.spaName}, {PLACEHOLDERS.spaAddress}</p>
      {state.payment && (
        <p>
          {state.payment.paid
            ? `Receipt: ${formatPrice(state.payment.amount)} on ${state.payment.brand} •••• ${state.payment.last4}`
            : `Card on file: ${state.payment.brand} •••• ${state.payment.last4}`}
        </p>
      )}
      <p>To cancel or reschedule, please call {PLACEHOLDERS.spaPhone}.</p>
      <p>— {PLACEHOLDERS.spaName}</p>
    </EmailPreview>
  );
}

function SpaEmail({ state }) {
  const isSeries = isSeriesScheduled(state);
  const isSeriesRoutedToConsult = state.bookingType === BOOKING_TYPES.SERIES && !isSeries;
  const sessions = state.series?.sessions || [];
  const apt = state.appointment;
  const practitioner = findPractitionerById(
    isSeries ? sessions[0]?.practitionerId : apt?.practitionerId
  );
  const service = state.serviceId ? findServiceById(state.serviceId) : null;
  const series = state.seriesId ? findSeriesById(state.seriesId) : null;
  return (
    <EmailPreview
      from={`bookings@lumera-aesthetics.com (${PLACEHOLDERS.spaName} Front Desk)`}
      to={`${PLACEHOLDERS.spaName} <front-desk@lumera-aesthetics.com>`}
      subject={isSeries ? `New series booking — ${series.name}` : `New booking — ${state.intake.fullName}`}
    >
      <p><strong>New booking received.</strong></p>
      <p>
        Patient: {state.intake.fullName}<br />
        Email: {state.intake.email}<br />
        Phone: {state.intake.phone}<br />
        DOB: {state.intake.dob}<br />
        Status: {state.intake.newOrReturning}
      </p>
      {state.intake.reason && <p>Reason: {state.intake.reason}</p>}
      {state.intake.medical && <p>Medical: {state.intake.medical}</p>}
      <p>Source: {state.intake.hearAbout}</p>

      {isSeries ? (
        <>
          <p>Series: {series.name} — {series.sessions} sessions with {practitioner?.name}</p>
          <ul className="list-disc pl-5 space-y-0.5 num">
            {sessions.map((s, i) => (
              <li key={i}>{format(parseISO(s.dateIso), 'EEE, MMM d, yyyy')} · {formatSlotLabel(s.slot)} (ET)</li>
            ))}
          </ul>
          {apt && (
            <p>Consultation: {format(parseISO(apt.dateIso), 'EEE, MMM d')} · {formatSlotLabel(apt.slot)} (ET) ({state.consultFormat})</p>
          )}
        </>
      ) : (
        <>
          <p>
            {isSeriesRoutedToConsult ? `Consultation for ${series?.name} series` : `Service: ${service?.name || 'Consultation'}`} with {practitioner?.name}<br />
            When: {apt && format(parseISO(apt.dateIso), 'EEE, MMM d, yyyy')} · {apt && formatSlotLabel(apt.slot)} (ET)
          </p>
          {isSeriesRoutedToConsult && (
            <p>Note: New patient — series scheduling pending consultation outcome.</p>
          )}
        </>
      )}
      {state.sameDay && <p>Same-day procedure: deposit paid (${FEES.sameDayDeposit}).</p>}
      {state.payment && (
        <p>
          Payment: {state.payment.paid
            ? `${formatPrice(state.payment.amount)} captured`
            : 'Card on file (no charge today)'} · {state.payment.brand} •••• {state.payment.last4}
        </p>
      )}
    </EmailPreview>
  );
}
