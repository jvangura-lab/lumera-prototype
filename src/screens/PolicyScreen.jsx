import React, { useState } from 'react';
import ScreenChrome from '../components/ScreenChrome.jsx';
import { PrimaryButton } from '../components/Button.jsx';
import { useBooking, STEPS, BOOKING_TYPES, isSeriesScheduled } from '../state/BookingContext.jsx';
import { findPractitionerById, PLACEHOLDERS, FEES } from '../mockData.js';
import { formatPrice } from '../utils/formatting.js';

export default function PolicyScreen() {
  const { state, actions } = useBooking();
  const [ack, setAck] = useState(state.policyAck || false);
  const isSeries = isSeriesScheduled(state);
  const sameDay = state.sameDay === true;
  const cardOnFile = !sameDay; // sameDay path covers payment via the deposit policy
  const practitioner = findPractitionerById(
    state.appointment?.practitionerId || state.practitionerId
  );

  const handleContinue = () => {
    if (!ack) return;
    actions.setPolicy(true);
    actions.goTo(STEPS.CHECKOUT);
  };

  return (
    <ScreenChrome
      title="Booking policies."
      subtitle="Please review before confirming your booking."
      footer={<PrimaryButton onClick={handleContinue} disabled={!ack}>Continue</PrimaryButton>}
    >
      <div className="divide-y divide-cream-200">
        <Section label="Cancellations & Reschedules">
          All cancellations and reschedules must be handled by calling the spa directly at{' '}
          <span className="font-medium">{PLACEHOLDERS.spaPhone}</span>. Cancellations cannot be
          processed online. Please give at least 24 hours notice when possible.
        </Section>

        <Section label="Privacy & Data">
          Your information is handled in accordance with HIPAA standards and used only for your
          appointment, communication from the spa, and payment processing. We do not share your
          data with third parties.
        </Section>

        {sameDay && (
          <Section label="Same-Day Procedure Deposit">
            Your <span className="num">{formatPrice(FEES.sameDayDeposit)}</span> deposit reserves
            time on the schedule for your procedure. If{' '}
            <span className="font-medium">{practitioner?.name || 'your practitioner'}</span>{' '}
            determines the procedure isn't right for you during your consultation, your deposit is
            non-refundable but transferable to any other approved service within 12 months.
          </Section>
        )}

        {cardOnFile && (
          <Section label="Payment">
            Your card will be securely held on file. The med spa will charge for services after
            your visit per their pricing. Charges may include the booked service plus any add-on
            treatments performed during your visit.
          </Section>
        )}

        {isSeries && (
          <Section label="Session Series">
            Each individual session in your series must be rescheduled by calling the spa directly.
            Series are billed per the spa's package terms — your card on file will be charged
            accordingly. Missed sessions follow the spa's individual cancellation policy.
          </Section>
        )}
      </div>

      <div className="pt-3 mt-2 border-t border-cream-200 space-y-2">
        <label
          className={
            'flex items-start gap-2.5 rounded-lg border p-3 text-sm cursor-pointer transition ' +
            (ack ? 'border-gold-400 bg-blush-100/60' : 'border-cream-200 bg-white')
          }
        >
          <input
            type="checkbox"
            className="mt-0.5"
            checked={ack}
            onChange={(e) => setAck(e.target.checked)}
          />
          <span className="leading-snug">I have read and agree to the policies above.</span>
        </label>
        <p className="text-[11px] text-ink-500 leading-relaxed px-1">
          By continuing, you authorize the med spa to contact you about your appointment and
          process payments per the terms above.
        </p>
      </div>
    </ScreenChrome>
  );
}

function Section({ label, children }) {
  return (
    <div className="py-4 first:pt-1">
      <div className="text-[10px] uppercase tracking-[0.18em] text-gold-600 font-semibold mb-1.5">
        {label}
      </div>
      <p className="text-[14px] text-ink-700 leading-[1.55]">{children}</p>
    </div>
  );
}
