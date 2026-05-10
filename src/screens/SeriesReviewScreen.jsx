import React, { useState } from 'react';
import { format, parseISO, addDays } from 'date-fns';
import { Pencil } from 'lucide-react';
import ScreenChrome from '../components/ScreenChrome.jsx';
import { PrimaryButton } from '../components/Button.jsx';
import Calendar from '../components/Calendar.jsx';
import { useBooking, STEPS } from '../state/BookingContext.jsx';
import { findSeriesById, findPractitionerById } from '../mockData.js';
import { formatSlotLabel } from '../utils/availability.js';
import { formatPrice } from '../utils/formatting.js';

export default function SeriesReviewScreen() {
  const { state, actions } = useBooking();
  const pkg = findSeriesById(state.seriesId);
  const sessions = state.series?.sessions || [];
  const practitioner = findPractitionerById(sessions[0]?.practitionerId);
  const [editIdx, setEditIdx] = useState(null);

  const handleEditPick = ({ date, slot }) => {
    if (editIdx == null) return;
    const dateIso = format(date, 'yyyy-MM-dd');
    const conflict = sessions.some((s, i) => i !== editIdx && s.dateIso === dateIso);
    if (conflict) {
      alert('This date conflicts with another session in your series.');
      return;
    }
    const next = sessions.slice();
    next[editIdx] = { ...next[editIdx], dateIso, slot, adjusted: false };
    actions.setSeriesData({ sessions: next });
    setEditIdx(null);
  };

  const handleContinue = () => {
    actions.goTo(STEPS.INTAKE);
  };

  return (
    <ScreenChrome
      eyebrow="Final review"
      title="Review your series"
      subtitle={`${pkg.sessions} sessions with ${practitioner?.name}. Tap any session to edit before confirming.`}
      footer={<PrimaryButton onClick={handleContinue}>Looks good — continue</PrimaryButton>}
    >
      <div className="rounded-xl border border-cream-200 bg-cream-50 p-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-medium">{pkg.name} Package</span>
          <span className="num font-semibold">{formatPrice(pkg.totalPrice)}</span>
        </div>
        <div className="text-[11px] text-ink-500 num">
          {formatPrice(pkg.perSessionPrice)}/session · save {formatPrice(pkg.savings)}
        </div>
      </div>

      <div className="space-y-2">
        {sessions.map((s, idx) => {
          const date = parseISO(s.dateIso);
          return (
            <div key={idx} className="rounded-xl border border-cream-200 bg-white p-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cream-100 text-espresso-800 flex items-center justify-center flex-shrink-0 num font-semibold">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium num">
                  {format(date, 'EEE, MMM d, yyyy')} · {formatSlotLabel(s.slot)} <span className="text-ink-400">(ET)</span>
                </div>
                <div className="text-[11px] text-ink-500">with {practitioner?.name}</div>
              </div>
              <button
                type="button"
                onClick={() => setEditIdx(idx)}
                className="text-xs font-medium text-gold-600 hover:text-gold-500 flex items-center gap-1"
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
            </div>
          );
        })}
      </div>

      {editIdx != null && (
        <EditDialog
          session={sessions[editIdx]}
          practitionerId={sessions[0].practitionerId}
          onPick={handleEditPick}
          onClose={() => setEditIdx(null)}
        />
      )}
    </ScreenChrome>
  );
}

function EditDialog({ session, practitionerId, onPick, onClose }) {
  const anchor = parseISO(session.suggestedDateIso || session.dateIso);
  const minDate = addDays(anchor, -14);
  const maxDate = addDays(anchor, 14);
  const [pick, setPick] = useState({ date: parseISO(session.dateIso), slot: session.slot, practitionerId });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-espresso-900/40">
      <div className="bg-white rounded-2xl shadow-card max-w-[380px] w-full p-4 fade-in-up">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg" style={{ fontWeight: 600 }}>Edit session</h3>
          <button onClick={onClose} className="text-xs text-ink-500 hover:text-espresso-800">Cancel</button>
        </div>
        <Calendar
          practitionerIds={[practitionerId]}
          selectedDate={pick.date}
          selectedSlot={pick.slot}
          selectedSlotPractitioner={practitionerId}
          minDate={minDate}
          maxDate={maxDate}
          onPick={(p) => setPick(p)}
          windowAdjustedNote={`Adjustable within ±2 weeks of ${format(anchor, 'MMM d')}.`}
        />
        <div className="mt-3">
          <PrimaryButton
            onClick={() => onPick({ date: pick.date, slot: pick.slot })}
            disabled={!pick.slot}
          >
            Use this time
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
