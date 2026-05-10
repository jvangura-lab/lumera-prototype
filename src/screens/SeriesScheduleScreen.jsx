import React, { useEffect, useMemo, useState } from 'react';
import { addWeeks, format, parseISO, addDays, differenceInDays } from 'date-fns';
import { Pencil, AlertCircle } from 'lucide-react';
import ScreenChrome from '../components/ScreenChrome.jsx';
import { PrimaryButton } from '../components/Button.jsx';
import Calendar from '../components/Calendar.jsx';
import { useBooking, STEPS } from '../state/BookingContext.jsx';
import { findSeriesById, findPractitionerById } from '../mockData.js';
import { findNearestAvailableDate, preferredSlotOnDate, formatSlotLabel } from '../utils/availability.js';

export default function SeriesScheduleScreen() {
  const { state, actions } = useBooking();
  const pkg = findSeriesById(state.seriesId);
  const sessionOne = state.series?.sessions?.[0];
  const practitionerId = sessionOne?.practitionerId;
  const practitioner = findPractitionerById(practitionerId);

  // Compute auto-suggested sessions 2..N
  const computedSessions = useMemo(() => {
    if (!sessionOne) return [];
    const out = [{ ...sessionOne, suggestedDateIso: sessionOne.dateIso }];
    let cursor = parseISO(sessionOne.dateIso);
    for (let i = 1; i < pkg.sessions; i++) {
      const target = addWeeks(cursor, pkg.spacingWeeks.default);
      const found = findNearestAvailableDate(practitionerId, target, 14);
      const dateUsed = found?.date || target;
      const slot = preferredSlotOnDate(practitionerId, dateUsed, sessionOne.slot) || sessionOne.slot;
      out.push({
        dateIso: format(dateUsed, 'yyyy-MM-dd'),
        slot,
        practitionerId,
        adjusted: !!(found && found.adjusted),
        suggestedDateIso: format(target, 'yyyy-MM-dd'),
      });
      cursor = dateUsed;
    }
    return out;
  }, [sessionOne, pkg.sessions, pkg.spacingWeeks.default, practitionerId]);

  const [sessions, setSessions] = useState(() => {
    if (state.series?.sessions && state.series.sessions.length === pkg.sessions) {
      // re-merge suggested dates from computed for any missing
      return state.series.sessions.map((s, i) => ({
        ...s,
        suggestedDateIso: s.suggestedDateIso || computedSessions[i]?.suggestedDateIso,
      }));
    }
    return computedSessions;
  });

  // If user changed session 1, recompute everything
  useEffect(() => {
    if (state.series?.sessions?.length === pkg.sessions) return;
    setSessions(computedSessions);
  }, []);

  const [editIdx, setEditIdx] = useState(null);

  const handleEditPick = ({ date, slot }) => {
    if (editIdx == null) return;
    const dateIso = format(date, 'yyyy-MM-dd');
    // Conflict check: same date as another session
    const conflict = sessions.some((s, i) => i !== editIdx && s.dateIso === dateIso);
    if (conflict) {
      alert('This date conflicts with another session in your series.');
      return;
    }
    const next = sessions.slice();
    next[editIdx] = {
      ...next[editIdx],
      dateIso,
      slot,
      adjusted: false,
    };
    setSessions(next);
    setEditIdx(null);
  };

  const handleContinue = () => {
    actions.setSeriesData({ sessions });
    actions.goTo(STEPS.SERIES_REVIEW);
  };

  return (
    <ScreenChrome
      eyebrow="Smart Spacing"
      title="Your suggested schedule"
      subtitle={`${pkg.sessions} sessions with ${practitioner?.name || 'your practitioner'}. ${pkg.spacingLabel}. Edit any session within ±2 weeks.`}
      footer={<PrimaryButton onClick={handleContinue}>Looks good — continue</PrimaryButton>}
    >
      <div className="space-y-2">
        {sessions.map((s, idx) => {
          const date = parseISO(s.dateIso);
          const suggested = s.suggestedDateIso ? parseISO(s.suggestedDateIso) : null;
          const outsideWindow = suggested && Math.abs(differenceInDays(date, suggested)) > 14;
          return (
            <div
              key={idx}
              className="rounded-xl border border-cream-200 bg-white p-3 flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-full bg-cream-100 text-espresso-800 flex items-center justify-center flex-shrink-0 num font-semibold">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium num">
                  Session {idx + 1} — {format(date, 'EEE, MMM d')}, {formatSlotLabel(s.slot)}
                </div>
                <div className="text-[11px] text-ink-500 mt-0.5">with {practitioner?.name}</div>
                <div className="flex flex-wrap gap-1.5 mt-1.5 text-[10px]">
                  {s.adjusted && (
                    <span className="px-1.5 py-0.5 rounded bg-gold-300/30 text-gold-600 inline-flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> adjusted
                    </span>
                  )}
                  {outsideWindow && (
                    <span className="px-1.5 py-0.5 rounded bg-blush-100 text-blush-500">outside recommended interval</span>
                  )}
                </div>
              </div>
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => setEditIdx(idx)}
                  className="text-xs font-medium text-gold-600 hover:text-gold-500 flex items-center gap-1"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              )}
            </div>
          );
        })}
      </div>

      {editIdx != null && (
        <EditSessionDialog
          session={sessions[editIdx]}
          practitionerId={practitionerId}
          onPick={handleEditPick}
          onClose={() => setEditIdx(null)}
        />
      )}
    </ScreenChrome>
  );
}

function EditSessionDialog({ session, practitionerId, onPick, onClose }) {
  const suggested = parseISO(session.suggestedDateIso || session.dateIso);
  const minDate = addDays(suggested, -14);
  const maxDate = addDays(suggested, 14);
  const cur = parseISO(session.dateIso);
  const [pick, setPick] = useState({ date: cur, slot: session.slot, practitionerId });

  const note = `Adjustable within ±2 weeks of ${format(suggested, 'MMM d')}.`;

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
          windowAdjustedNote={note}
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
