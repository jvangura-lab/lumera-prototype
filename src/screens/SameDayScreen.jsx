import React, { useState } from 'react';
import ScreenChrome from '../components/ScreenChrome.jsx';
import SelectCard from '../components/SelectCard.jsx';
import { PrimaryButton } from '../components/Button.jsx';
import { useBooking, STEPS } from '../state/BookingContext.jsx';
import { findPractitionerById, findServiceById, FEES } from '../mockData.js';
import { formatPrice } from '../utils/formatting.js';

export default function SameDayScreen() {
  const { state, actions } = useBooking();
  const [pending, setPending] = useState(state.sameDay);
  const practitioner = findPractitionerById(state.appointment?.practitionerId || state.practitionerId);
  const service = state.serviceId ? findServiceById(state.serviceId) : null;

  const handleSelect = (v) => {
    setPending(v);
    actions.setSameDay(v);
  };
  const handleContinue = () => {
    if (pending === null || pending === undefined) return;
    actions.goTo(STEPS.INTAKE);
  };

  const subtitle =
    practitioner && service
      ? `If ${practitioner.name} approves, we can perform ${service.name} right after your consult. ${formatPrice(FEES.sameDayDeposit)} deposit secures the slot.`
      : `If approved at your consult, we can perform the procedure right after. ${formatPrice(FEES.sameDayDeposit)} deposit secures the slot.`;

  return (
    <ScreenChrome
      title="Want it done the same day?"
      subtitle={subtitle}
      footer={<PrimaryButton onClick={handleContinue} disabled={pending === null || pending === undefined}>Continue</PrimaryButton>}
    >
      <SelectCard
        selected={pending === true}
        onClick={() => handleSelect(true)}
        title="Yes, reserve same-day procedure"
        subtitle={`${formatPrice(FEES.sameDayDeposit)} deposit`}
      />
      <SelectCard
        selected={pending === false}
        onClick={() => handleSelect(false)}
        title="No, just the consultation"
      />
    </ScreenChrome>
  );
}
