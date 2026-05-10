import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import ScreenChrome from '../components/ScreenChrome.jsx';
import { PrimaryButton } from '../components/Button.jsx';
import Calendar from '../components/Calendar.jsx';
import { useBooking, STEPS, BOOKING_TYPES, getActivePractitionerIds, isConsultFlow } from '../state/BookingContext.jsx';

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

  const isConsult = isConsultFlow(state);

  const handleContinue = () => {
    if (!pick) return;
    actions.setAppointment({
      dateIso: format(pick.date, 'yyyy-MM-dd'),
      slot: pick.slot,
      practitionerId: pick.practitionerId,
    });
    if (state.bookingType === BOOKING_TYPES.SERIES && isConsult) {
      // Consult booked first; series scheduling next
      actions.goTo(STEPS.SERIES_FIRST);
    } else if (isConsult && state.bookingType !== BOOKING_TYPES.SERIES) {
      actions.goTo(STEPS.SAME_DAY);
    } else {
      actions.goTo(STEPS.INTAKE);
    }
  };

  return (
    <ScreenChrome
      title="Pick a time."
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
