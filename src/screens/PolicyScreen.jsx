import React, { useState } from 'react';
import { Phone, Info } from 'lucide-react';
import ScreenChrome from '../components/ScreenChrome.jsx';
import { PrimaryButton } from '../components/Button.jsx';
import { useBooking, STEPS, BOOKING_TYPES } from '../state/BookingContext.jsx';
import { findPractitionerById, PLACEHOLDERS, FEES } from '../mockData.js';
import { formatPrice } from '../utils/formatting.js';

export default function PolicyScreen() {
  const { state, actions } = useBooking();
  const [ack, setAck] = useState(state.policyAck || false);
  const practitioner = findPractitionerById(state.appointment?.practitionerId || state.practitionerId);
  const isSeries = state.bookingType === BOOKING_TYPES.SERIES;
  const sameDay = state.sameDay === true;
  const isConsult =
    state.bookingType === BOOKING_TYPES.CONSULT ||
    (state.bookingType === BOOKING_TYPES.SINGLE && state.returningPatient === false);
  // Card on file applies to: returning direct, new-patient consult flow (deposit or no), series
  const cardOnFile = !sameDay; // basically all non-deposit-only paths still get a card on file

  const handleContinue = () => {
    if (!ack) return;
    actions.setPolicy(true);
    actions.goTo(STEPS.CHECKOUT);
  };

  return (
    <ScreenChrome
      eyebrow="Policy"
      title="Cancellations & reschedules"
      subtitle="A few things to know before you book."
      footer={<PrimaryButton onClick={handleContinue} disabled={!ack}>Continue</PrimaryButton>}
    >
      <Callout icon={Phone}>
        All cancellations and reschedules must be handled by calling{' '}
        <span className="font-medium">{PLACEHOLDERS.spaPhone}</span> directly. We do not process cancellations through this widget.
      </Callout>

      {sameDay && (
        <Callout icon={Info}>
          Same-day procedure deposit of <span className="num font-medium">{formatPrice(FEES.sameDayDeposit)}</span> is non-refundable. If{' '}
          <span className="font-medium">{practitioner?.name || 'your practitioner'}</span> determines the procedure isn't right for you, your deposit can be applied to any other approved service within 12 months.
        </Callout>
      )}

      {cardOnFile && !isConsult && (
        <Callout icon={Info}>
          Your card will be securely held on file. The med spa will charge for services after your visit per their pricing.
        </Callout>
      )}
      {cardOnFile && isConsult && (
        <Callout icon={Info}>
          Your card will be securely held on file in addition to the consultation fee. The med spa will charge for any services after your visit per their pricing.
        </Callout>
      )}

      {isSeries && (
        <Callout icon={Info}>
          Each individual session in your series must be rescheduled by calling the spa directly. Series pricing is set by the med spa per their package terms.
        </Callout>
      )}

      <label
        className={
          'flex items-start gap-2 rounded-lg border p-3 text-sm cursor-pointer transition ' +
          (ack ? 'border-gold-400 bg-blush-100/60' : 'border-cream-200 bg-white')
        }
      >
        <input type="checkbox" className="mt-0.5" checked={ack} onChange={(e) => setAck(e.target.checked)} />
        <span>I understand and agree to these policies.</span>
      </label>
    </ScreenChrome>
  );
}

function Callout({ icon: Icon, children }) {
  return (
    <div className="flex gap-2 rounded-xl border border-cream-200 bg-cream-50 p-3 text-sm leading-relaxed text-ink-700">
      <Icon className="w-4 h-4 mt-0.5 text-gold-500 flex-shrink-0" />
      <div>{children}</div>
    </div>
  );
}
