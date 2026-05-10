import React, { useMemo, useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import ScreenChrome from '../components/ScreenChrome.jsx';
import { PrimaryButton } from '../components/Button.jsx';
import { useBooking, STEPS, BOOKING_TYPES } from '../state/BookingContext.jsx';
import { findServiceById, findSeriesById, FEES } from '../mockData.js';
import { formatPrice, formatCardNumber, formatExpiry } from '../utils/formatting.js';

export default function CheckoutScreen() {
  const { state, actions } = useBooking();
  const scenario = deriveScenario(state);

  const [card, setCard] = useState({ name: '', number: '', exp: '', cvc: '', zip: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!card.name.trim()) e.name = 'Required';
    const digits = card.number.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) e.number = 'Invalid card';
    const exp = card.exp.replace(/\D/g, '');
    if (exp.length !== 4) e.exp = 'MM/YY';
    if (card.cvc.length < 3 || card.cvc.length > 4) e.cvc = '3-4 digits';
    if (card.zip.replace(/\D/g, '').length !== 5) e.zip = '5-digit ZIP';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (loading) return;
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;
    setLoading(true);
    setTimeout(() => {
      const last4 = card.number.replace(/\D/g, '').slice(-4);
      actions.setPayment({
        last4,
        brand: detectBrand(card.number),
        amount: scenario.amountToday,
        paid: scenario.amountToday > 0,
      });
      setLoading(false);
      actions.goTo(STEPS.CONFIRMATION);
    }, 1200);
  };

  return (
    <ScreenChrome
      eyebrow="Secure checkout"
      title={scenario.heading}
      subtitle={scenario.subtitle}
    >
      <OrderSummary state={state} scenario={scenario} />

      <form onSubmit={handleSubmit} className="space-y-3">
        <Field label="Name on card" error={errors.name}>
          <input
            type="text"
            className={inp(errors.name)}
            value={card.name}
            onChange={(e) => setCard({ ...card, name: e.target.value })}
            autoComplete="cc-name"
          />
        </Field>
        <Field label="Card number" error={errors.number}>
          <div className="relative">
            <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              className={inp(errors.number) + ' pl-9 num'}
              value={formatCardNumber(card.number)}
              onChange={(e) => setCard({ ...card, number: e.target.value.replace(/\D/g, '').slice(0, 19) })}
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 1234 1234 1234"
            />
          </div>
        </Field>
        <div className="grid grid-cols-3 gap-2">
          <Field label="Expiry" error={errors.exp}>
            <input
              type="text"
              className={inp(errors.exp) + ' num'}
              value={formatExpiry(card.exp)}
              onChange={(e) => setCard({ ...card, exp: e.target.value.replace(/\D/g, '').slice(0, 4) })}
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
            />
          </Field>
          <Field label="CVC" error={errors.cvc}>
            <input
              type="text"
              className={inp(errors.cvc) + ' num'}
              value={card.cvc}
              onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
            />
          </Field>
          <Field label="ZIP" error={errors.zip}>
            <input
              type="text"
              className={inp(errors.zip) + ' num'}
              value={card.zip.replace(/\D/g, '').slice(0, 5)}
              onChange={(e) => setCard({ ...card, zip: e.target.value })}
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="12345"
            />
          </Field>
        </div>

        <div className="text-[11px] text-ink-500 italic">
          Demo: use card 4242 4242 4242 4242, any future date, any CVC.
        </div>

        <PrimaryButton type="submit" loading={loading}>
          {scenario.buttonLabel}
        </PrimaryButton>
        <div className="text-[11px] text-ink-500 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3" /> Encrypted & PCI-compliant (demo)
        </div>
      </form>
    </ScreenChrome>
  );
}

function detectBrand(number) {
  const d = number.replace(/\D/g, '');
  if (d.startsWith('4')) return 'Visa';
  if (d.startsWith('5')) return 'Mastercard';
  if (d.startsWith('3')) return 'Amex';
  if (d.startsWith('6')) return 'Discover';
  return 'Card';
}

function deriveScenario(state) {
  const isSeries = state.bookingType === BOOKING_TYPES.SERIES;
  if (isSeries) {
    return {
      kind: 'series',
      amountToday: 0,
      heading: 'Save card and book your series',
      subtitle: 'No charge today. The med spa will bill for the series per their package terms.',
      buttonLabel: 'Save Card and Book Series',
    };
  }
  const isConsult =
    state.bookingType === BOOKING_TYPES.CONSULT ||
    (state.bookingType === BOOKING_TYPES.SINGLE && state.returningPatient === false);
  if (isConsult) {
    if (state.sameDay) {
      const total = FEES.consultation + FEES.sameDayDeposit;
      return {
        kind: 'consult+sameday',
        amountToday: total,
        heading: `Pay ${formatPrice(total)} and book`,
        subtitle: 'Includes consultation fee and same-day procedure deposit.',
        buttonLabel: `Pay ${formatPrice(total)} and Book`,
      };
    }
    return {
      kind: 'consult',
      amountToday: FEES.consultation,
      heading: `Pay ${formatPrice(FEES.consultation)} and book`,
      subtitle: 'Consultation fee due today. Card will also be saved on file.',
      buttonLabel: `Pay ${formatPrice(FEES.consultation)} and Book`,
    };
  }
  // Direct service or returning-patient direct
  return {
    kind: 'direct',
    amountToday: 0,
    heading: 'Save card on file',
    subtitle: 'No charge today. Your card is held on file; the med spa will bill after your visit.',
    buttonLabel: 'Save Card and Book',
  };
}

function OrderSummary({ state, scenario }) {
  const lines = [];
  if (state.bookingType === BOOKING_TYPES.SERIES && state.seriesId) {
    const pkg = findSeriesById(state.seriesId);
    lines.push({ label: `${pkg.name} Series — ${pkg.sessions} sessions`, value: formatPrice(pkg.totalPrice), muted: true });
    lines.push({ label: `(${formatPrice(pkg.perSessionPrice)}/session, save ${formatPrice(pkg.savings)})`, value: '', tiny: true });
    lines.push({ label: 'Today', value: formatPrice(0) });
  } else if (scenario.kind === 'consult') {
    lines.push({ label: 'Consultation fee', value: formatPrice(FEES.consultation) });
    lines.push({ label: 'Card on file', value: 'No charge today', muted: true });
    lines.push({ label: 'Today', value: formatPrice(FEES.consultation), bold: true });
  } else if (scenario.kind === 'consult+sameday') {
    lines.push({ label: 'Consultation fee', value: formatPrice(FEES.consultation) });
    lines.push({ label: 'Same-day deposit', value: formatPrice(FEES.sameDayDeposit) });
    lines.push({ label: 'Today', value: formatPrice(FEES.consultation + FEES.sameDayDeposit), bold: true });
  } else {
    const svc = state.serviceId ? findServiceById(state.serviceId) : null;
    if (svc) lines.push({ label: svc.name, value: formatPrice(svc.price), muted: true });
    lines.push({ label: 'Today', value: formatPrice(0), bold: true });
    lines.push({ label: 'Card held on file', value: '', muted: true, tiny: true });
  }

  return (
    <div className="rounded-xl border border-cream-200 bg-cream-50 p-3 text-sm">
      <div className="text-[10px] uppercase tracking-[0.16em] text-ink-500 mb-2">Order summary</div>
      <div className="space-y-1.5">
        {lines.map((l, i) => (
          <div
            key={i}
            className={
              'flex items-center justify-between ' +
              (l.bold ? 'font-semibold text-espresso-900 pt-1.5 border-t border-cream-200' : '') +
              (l.muted ? ' text-ink-500' : '') +
              (l.tiny ? ' text-[11px]' : '')
            }
          >
            <span>{l.label}</span>
            <span className="num">{l.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      {label && <label className="block text-xs font-medium text-ink-700 mb-1">{label}</label>}
      {children}
      {error && <div className="text-[11px] text-blush-500 mt-1">{error}</div>}
    </div>
  );
}

function inp(hasError) {
  return (
    'w-full rounded-lg border px-3 py-2 text-sm bg-white outline-none transition ' +
    (hasError ? 'border-blush-400 focus:border-blush-500' : 'border-cream-200 focus:border-gold-400')
  );
}
