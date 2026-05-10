import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import ScreenChrome from '../components/ScreenChrome.jsx';
import { PrimaryButton } from '../components/Button.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Avatar from '../components/Avatar.jsx';
import { useBooking, STEPS, BOOKING_TYPES, getQualifyingPractitioners, isConsultFlow } from '../state/BookingContext.jsx';
import { findServiceById, findSeriesById } from '../mockData.js';

export default function PractitionerScreen() {
  const { state, actions } = useBooking();
  const qualifying = getQualifyingPractitioners(state);
  const onlyOne = qualifying.length === 1;

  let serviceName = '';
  if (state.bookingType === BOOKING_TYPES.SERIES && state.seriesId) {
    serviceName = findSeriesById(state.seriesId)?.name || '';
  } else if (state.serviceId) {
    serviceName = findServiceById(state.serviceId)?.name || '';
  }

  const [pending, setPending] = useState(() => {
    if (state.practitionerId) return state.practitionerId;
    if (onlyOne) return qualifying[0].id;
    return null;
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);

  const handleSelect = (id) => {
    if (state.practitionerId && id !== state.practitionerId && state.appointment) {
      setPendingChange(id);
      setConfirmOpen(true);
      return;
    }
    setPending(id);
    actions.setPractitioner(id);
  };

  const confirmChange = () => {
    setPending(pendingChange);
    actions.setPractitioner(pendingChange);
    actions.resetPractitionerDownstream();
    setConfirmOpen(false);
    setPendingChange(null);
  };

  const handleContinue = () => {
    if (!pending) return;
    if (state.bookingType === BOOKING_TYPES.SERIES) {
      const isNewSeriesConsult = isConsultFlow(state);
      if (isNewSeriesConsult) {
        actions.goTo(STEPS.CALENDAR);
      } else {
        actions.goTo(STEPS.SERIES_FIRST);
      }
    } else {
      actions.goTo(STEPS.CALENDAR);
    }
  };

  const title = onlyOne ? 'Confirm your practitioner.' : 'Who would you like to see?';
  const subtitle = onlyOne
    ? `${serviceName} is offered by ${qualifying[0].name}.`
    : 'Pick a practitioner or let us match the soonest opening.';

  return (
    <ScreenChrome
      title={title}
      subtitle={subtitle}
      footer={<PrimaryButton onClick={handleContinue} disabled={!pending}>Continue</PrimaryButton>}
    >
      {!onlyOne && (
        <button
          type="button"
          onClick={() => handleSelect('first-available')}
          aria-pressed={pending === 'first-available'}
          className={
            'w-full text-left rounded-xl border p-3 transition flex items-start gap-3 ' +
            (pending === 'first-available'
              ? 'border-gold-400 bg-blush-100/60 shadow-soft'
              : 'border-cream-200 bg-white hover:border-blush-300 hover:bg-cream-50')
          }
        >
          <div className="w-10 h-10 rounded-full bg-gold-300 text-espresso-900 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="font-display text-lg leading-tight" style={{ fontWeight: 600 }}>First available</div>
            <div className="text-xs text-ink-500 mt-0.5">Soonest opening across practitioners.</div>
          </div>
          <span
            className={
              'mt-1 w-4 h-4 rounded-full border-2 flex-shrink-0 ' +
              (pending === 'first-available' ? 'border-gold-500 bg-gold-400' : 'border-cream-300 bg-white')
            }
            aria-hidden
          />
        </button>
      )}

      {qualifying.map((p) => {
        const sel = pending === p.id;
        const shown = p.specialties.slice(0, 4).join(', ');
        const more = p.specialties.length > 4 ? ' & more' : '';
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => handleSelect(p.id)}
            aria-pressed={sel}
            className={
              'w-full text-left rounded-xl border p-3 transition flex items-start gap-3 ' +
              (sel
                ? 'border-gold-400 bg-blush-100/60 shadow-soft'
                : 'border-cream-200 bg-white hover:border-blush-300 hover:bg-cream-50')
            }
          >
            <Avatar initials={p.initials} accent={p.accent} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="font-display text-base leading-tight" style={{ fontWeight: 600 }}>
                {p.name}, {p.credentials}
              </div>
              <div className="text-[12px] text-ink-700 mt-0.5 leading-snug">{shown}{more}</div>
              <div className="text-[11px] text-ink-500 mt-0.5 italic">{p.bio}</div>
            </div>
            <span
              className={
                'mt-1 w-4 h-4 rounded-full border-2 flex-shrink-0 ' +
                (sel ? 'border-gold-500 bg-gold-400' : 'border-cream-300 bg-white')
              }
              aria-hidden
            />
          </button>
        );
      })}

      <ConfirmDialog
        open={confirmOpen}
        title="Change practitioner?"
        body="Changing this will reset your time selection. Your contact info will be saved."
        confirmLabel="Yes, change it"
        onConfirm={confirmChange}
        onCancel={() => { setConfirmOpen(false); setPendingChange(null); }}
      />
    </ScreenChrome>
  );
}
