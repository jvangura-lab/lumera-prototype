import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import ScreenChrome from '../components/ScreenChrome.jsx';
import { PrimaryButton } from '../components/Button.jsx';
import Calendar from '../components/Calendar.jsx';
import { useBooking, STEPS, getQualifyingPractitioners } from '../state/BookingContext.jsx';
import { findSeriesById } from '../mockData.js';

export default function SeriesFirstScreen() {
  const { state, actions } = useBooking();
  const pkg = findSeriesById(state.seriesId);
  const ids = state.practitionerId === 'first-available'
    ? null
    : [state.practitionerId];

  // Series locks to a single practitioner. If first-available was selected,
  // we still need to lock one for the series. We'll pick from session 1 selection.
  const [pick, setPick] = useState(() => {
    if (state.series?.sessions?.[0]) {
      const s = state.series.sessions[0];
      return { date: parseISO(s.dateIso), slot: s.slot, practitionerId: s.practitionerId };
    }
    return null;
  });

  const firstAvailableMode = state.practitionerId === 'first-available';

  const handleContinue = () => {
    if (!pick) return;
    // Lock practitioner for series
    actions.setPractitioner(pick.practitionerId);
    const sessions = [{
      dateIso: format(pick.date, 'yyyy-MM-dd'),
      slot: pick.slot,
      practitionerId: pick.practitionerId,
      adjusted: false,
    }];
    actions.setSeriesData({ sessions });
    actions.goTo(STEPS.SERIES_SCHEDULE);
  };

  // Determine practitionerIds to feed Calendar
  const calendarIds = firstAvailableMode
    ? getQualifyingPractitioners(state).map((p) => p.id)
    : ids;

  return (
    <ScreenChrome
      title={`Pick session 1 of ${pkg.sessions}.`}
      subtitle={pkg.spacingLabel}
      footer={<PrimaryButton onClick={handleContinue} disabled={!pick}>Continue</PrimaryButton>}
    >
      <Calendar
        practitionerIds={calendarIds}
        firstAvailableMode={firstAvailableMode}
        selectedDate={pick?.date || null}
        selectedSlot={pick?.slot}
        selectedSlotPractitioner={pick?.practitionerId}
        onPick={(p) => setPick(p)}
      />
    </ScreenChrome>
  );
}
