import React, { useState } from 'react';
import ScreenChrome from '../components/ScreenChrome.jsx';
import SelectCard from '../components/SelectCard.jsx';
import { PrimaryButton } from '../components/Button.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { useBooking, STEPS, BOOKING_TYPES } from '../state/BookingContext.jsx';
import { findServiceById, findSeriesById } from '../mockData.js';

export default function ReturningPatientScreen() {
  const { state, actions } = useBooking();
  const [pending, setPending] = useState(state.returningPatient);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);

  const handleSelect = (val) => {
    if (state.returningPatient !== null && val !== state.returningPatient && hasDownstream(state)) {
      setPendingChange(val);
      setConfirmOpen(true);
      return;
    }
    setPending(val);
    actions.setReturning(val);
  };

  const confirmChange = () => {
    setPending(pendingChange);
    actions.setReturning(pendingChange);
    actions.resetServiceDownstream();
    setConfirmOpen(false);
    setPendingChange(null);
  };

  const handleContinue = () => {
    if (pending === null) return;
    if (state.bookingType === BOOKING_TYPES.SERIES) {
      // Series-with-consult-required path: route consult-style for new patients
      if (pending) {
        actions.goTo(STEPS.PRACTITIONER);
      } else {
        actions.goTo(STEPS.CONSULT_FORMAT);
      }
    } else {
      if (pending) {
        actions.goTo(STEPS.PRACTITIONER);
      } else {
        actions.goTo(STEPS.CONSULT_FORMAT);
      }
    }
  };

  const isSeries = state.bookingType === BOOKING_TYPES.SERIES;
  const headline = isSeries
    ? 'Have you had a consultation with us for this service in the last 12 months?'
    : 'Have you had a consultation with us for this service in the last 12 months?';

  return (
    <ScreenChrome
      eyebrow="A quick check"
      title={headline}
      subtitle="This helps us route you to the right next step. Self-attested — no records will be looked up."
      footer={<PrimaryButton onClick={handleContinue} disabled={pending === null}>Continue</PrimaryButton>}
    >
      <SelectCard
        selected={pending === true}
        onClick={() => handleSelect(true)}
        title="Yes, I'm a returning patient"
        subtitle="We'll skip straight to scheduling."
      />
      <SelectCard
        selected={pending === false}
        onClick={() => handleSelect(false)}
        title="No, I'm new or it's been a while"
        subtitle={isSeries ? 'We\'ll book a consultation first, then your series.' : 'We\'ll book a consultation first.'}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Change your answer?"
        body="Changing this will reset your time selection and practitioner choice. Your contact info will be saved."
        confirmLabel="Yes, change it"
        onConfirm={confirmChange}
        onCancel={() => { setConfirmOpen(false); setPendingChange(null); }}
      />
    </ScreenChrome>
  );
}

function hasDownstream(state) {
  return Boolean(state.practitionerId || state.appointment || state.series || state.consultFormat);
}
