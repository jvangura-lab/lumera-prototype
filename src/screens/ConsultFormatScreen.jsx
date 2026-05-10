import React, { useState } from 'react';
import ScreenChrome from '../components/ScreenChrome.jsx';
import SelectCard from '../components/SelectCard.jsx';
import { PrimaryButton } from '../components/Button.jsx';
import { useBooking, STEPS, BOOKING_TYPES } from '../state/BookingContext.jsx';
import { findServiceById, findSeriesById } from '../mockData.js';

export default function ConsultFormatScreen() {
  const { state, actions } = useBooking();
  const [pending, setPending] = useState(state.consultFormat);

  let svcName = '';
  let inPersonOnly = false;
  if (state.bookingType === BOOKING_TYPES.SERIES && state.seriesId) {
    const pkg = findSeriesById(state.seriesId);
    const svc = findServiceById(pkg?.serviceId);
    svcName = pkg?.name || '';
    inPersonOnly = svc?.inPersonOnlyConsult || false;
  } else if (state.serviceId) {
    const svc = findServiceById(state.serviceId);
    svcName = svc?.name || '';
    inPersonOnly = svc?.inPersonOnlyConsult || false;
  }

  const handleSelect = (v) => {
    setPending(v);
    actions.setConsultFormat(v);
  };

  const handleContinue = () => {
    if (!pending) return;
    actions.goTo(STEPS.PRACTITIONER);
  };

  return (
    <ScreenChrome
      title="How would you like to meet?"
      footer={<PrimaryButton onClick={handleContinue} disabled={!pending}>Continue</PrimaryButton>}
    >
      <SelectCard
        selected={pending === 'virtual'}
        onClick={inPersonOnly ? undefined : () => handleSelect('virtual')}
        disabled={inPersonOnly}
        title="Virtual Consultation"
        subtitle={inPersonOnly ? 'In-person required for this service.' : 'Meet by secure video — same prep as in-person.'}
      />
      <SelectCard
        selected={pending === 'in-person'}
        onClick={() => handleSelect('in-person')}
        title="In-Person Consultation"
        subtitle="Meet at the spa for an in-person assessment."
      />
    </ScreenChrome>
  );
}
