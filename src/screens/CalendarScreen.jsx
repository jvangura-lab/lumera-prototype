import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import ScreenChrome from '../components/ScreenChrome.jsx';
import { PrimaryButton } from '../components/Button.jsx';
import Calendar from '../components/Calendar.jsx';
import { useBooking, STEPS, BOOKING_TYPES, getActivePractitionerIds } from '../state/BookingContext.jsx';
import { findServiceById, findSeriesById, findPractitionerById } from '../mockData.js';

export default function CalendarScreen() {
  const { state, actions } = useBooking();
  const firstAvailable = state.practitionerId === 'first-available';
  const ids = getActivePractitionerIds(state);

  const [pick, setPick] = useState(() => {
    if (state.appointment) {
      return {
        date: parseISO(state.appointment.dateIso),
        slot: state.appointment.slot,
        practitionerId: state.appointment.practitionerId,
      };
    }
    return null;
  });
  const [formatChangedBanner, setFormatChangedBanner] = useState(false);
  const lastFormat = React.useRef(state.consultFormat);

  useEffect(() => {
    if (lastFormat.current !== state.consultFormat && state.consultFormat) {
      if (lastFormat.current) setFormatChangedBanner(true);
      lastFormat.current = state.consultFormat;
    }
  }, [state.consultFormat]);

  const isConsult =
    state.bookingType === BOOKING_TYPES.CONSULT ||
    (state.bookingType === BOOKING_TYPES.SINGLE && state.returningPatient === false) ||
    (state.bookingType === BOOKING_TYPES.SERIES && state.returningPatient === false);

  let headerTag = '';
  if (isConsult) {
    headerTag = `Consultation • ${state.consultFormat === 'virtual' ? 'Virtual' : 'In-Person'}`;
  } else {
    let svcName = '';
    if (state.bookingType === BOOKING_TYPES.SERIES && state.seriesId) {
      svcName = findSeriesById(state.seriesId)?.name || '';
    } else if (state.serviceId) {
      svcName = findServiceById(state.serviceId)?.name || '';
    }
    headerTag = `Service • ${svcName}`;
  }

  const handleContinue = () => {
    if (!pick) return;
    actions.setAppointment({
      dateIso: format(pick.date, 'yyyy-MM-dd'),
      slot: pick.slot,
      practitionerId: pick.practitionerId,
    });
    if (state.bookingType === BOOKING_TYPES.SERIES && state.returningPatient === false) {
      // After consult is booked, route to series scheduling — we use SERIES_FIRST as the next step
      // so user picks first session date. (Consult is captured in state.appointment.)
      actions.goTo(STEPS.SERIES_FIRST);
    } else if (state.bookingType === BOOKING_TYPES.CONSULT ||
              (state.bookingType === BOOKING_TYPES.SINGLE && state.returningPatient === false)) {
      actions.goTo(STEPS.SAME_DAY);
    } else {
      actions.goTo(STEPS.INTAKE);
    }
  };

  return (
    <ScreenChrome
      eyebrow={headerTag}
      title="Pick your time"
      subtitle={firstAvailable ? 'Tap a slot to see which practitioner you\'ll be matched with.' : 'All times Eastern Time.'}
      footer={<PrimaryButton onClick={handleContinue} disabled={!pick}>Continue</PrimaryButton>}
    >
      {formatChangedBanner && (
        <div className="text-[12px] text-blush-500 bg-blush-100/60 rounded-lg px-3 py-2">
          Format updated — please confirm your time slot.
        </div>
      )}
      <Calendar
        practitionerIds={ids}
        firstAvailableMode={firstAvailable}
        selectedDate={pick?.date || null}
        selectedSlot={pick?.slot}
        selectedSlotPractitioner={pick?.practitionerId}
        onPick={(p) => setPick(p)}
      />
    </ScreenChrome>
  );
}
