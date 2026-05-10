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

  return (
    <ScreenChrome
      eyebrow="Same-day option"
      title="Want your procedure done the same day?"
      subtitle={
        practitioner && service
          ? `If ${practitioner.name} approves you for ${service.name} during your consultation, we can perform it the same day. A ${formatPrice(FEES.sameDayDeposit)} deposit secures the slot.`
          : `If your practitioner approves the procedure during your consultation, we can perform it the same day. A ${formatPrice(FEES.sameDayDeposit)} deposit secures the slot.`
      }
      footer={<PrimaryButton onClick={handleContinue} disabled={pending === null || pending === undefined}>Continue</PrimaryButton>}
    >
      <SelectCard
        selected={pending === true}
        onClick={() => handleSelect(true)}
        title={`Yes, reserve same-day procedure (${formatPrice(FEES.sameDayDeposit)} deposit)`}
        subtitle="We'll hold time on the schedule for the procedure right after your consult."
      />
      <SelectCard
        selected={pending === false}
        onClick={() => handleSelect(false)}
        title="No, just the consultation"
        subtitle="You can always book the procedure separately later."
      />
    </ScreenChrome>
  );
}
