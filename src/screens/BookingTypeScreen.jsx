import React, { useState } from 'react';
import ScreenChrome from '../components/ScreenChrome.jsx';
import SelectCard from '../components/SelectCard.jsx';
import { PrimaryButton } from '../components/Button.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { useBooking, STEPS, BOOKING_TYPES } from '../state/BookingContext.jsx';

const OPTIONS = [
  { id: BOOKING_TYPES.CONSULT, title: 'Book a consultation', subtitle: 'Meet with a practitioner to plan your treatment.' },
  { id: BOOKING_TYPES.SINGLE,  title: 'Book a single service', subtitle: 'Already know what you want? Book it directly.' },
  { id: BOOKING_TYPES.SERIES,  title: 'Book a session series', subtitle: 'Schedule a multi-session package in one go.' },
];

export default function BookingTypeScreen() {
  const { state, actions } = useBooking();
  const [pending, setPending] = useState(state.bookingType);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);

  const handleSelect = (id) => {
    if (state.bookingType && id !== state.bookingType && hasDownstreamData(state)) {
      setPendingChange(id);
      setConfirmOpen(true);
      return;
    }
    setPending(id);
    actions.setBookingType(id);
  };

  const confirmChange = () => {
    setPending(pendingChange);
    actions.setBookingType(pendingChange);
    actions.resetBookingTypeDownstream();
    setConfirmOpen(false);
    setPendingChange(null);
  };

  const handleContinue = () => {
    if (!pending) return;
    actions.goTo(STEPS.SERVICE);
  };

  return (
    <ScreenChrome
      eyebrow="Welcome"
      title="How would you like to book?"
      subtitle="Choose the type of visit that fits you best."
      hideBack
      footer={<PrimaryButton onClick={handleContinue} disabled={!pending}>Continue</PrimaryButton>}
    >
      {OPTIONS.map((opt) => (
        <SelectCard
          key={opt.id}
          selected={pending === opt.id}
          onClick={() => handleSelect(opt.id)}
          title={opt.title}
          subtitle={opt.subtitle}
        />
      ))}
      <ConfirmDialog
        open={confirmOpen}
        title="Change booking type?"
        body="Changing this will reset your time selection and practitioner choice. Your contact info will be saved."
        confirmLabel="Yes, change it"
        onConfirm={confirmChange}
        onCancel={() => { setConfirmOpen(false); setPendingChange(null); }}
      />
    </ScreenChrome>
  );
}

function hasDownstreamData(state) {
  return Boolean(
    state.serviceId || state.seriesId || state.practitionerId ||
    state.appointment || state.series || state.consultFormat
  );
}
