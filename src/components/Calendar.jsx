import React, { useMemo, useState, useEffect } from 'react';
import {
  addMonths, eachDayOfInterval, endOfMonth, format, isBefore, isSameDay,
  isSameMonth, startOfDay, startOfMonth, addDays, subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  getPractitionerSlots, getAggregateSlots, dayHasAvailability, formatSlotLabel,
} from '../utils/availability.js';
import { findPractitionerById } from '../mockData.js';

export default function Calendar({
  practitionerIds,           // [string]
  firstAvailableMode = false,
  selectedDate,              // Date | null
  selectedSlot,              // 'HH:MM'
  selectedSlotPractitioner,  // string
  onPick,                    // ({date, slot, practitionerId}) => void
  minDate,                   // Date — earliest selectable
  maxDate,                   // Date — latest selectable
  windowAdjustedNote,        // string
}) {
  const today = startOfDay(new Date());
  const earliest = minDate ? startOfDay(minDate) : today;
  const initialMonth = selectedDate || earliest;
  const [monthAnchor, setMonthAnchor] = useState(startOfMonth(initialMonth));
  const [day, setDay] = useState(selectedDate || null);

  // Auto-advance to next month with availability if current has none
  useEffect(() => {
    let probe = monthAnchor;
    let safety = 0;
    while (safety < 6) {
      const days = eachDayOfInterval({ start: startOfMonth(probe), end: endOfMonth(probe) });
      const any = days.some((d) => {
        if (isBefore(d, earliest)) return false;
        if (maxDate && isBefore(maxDate, d)) return false;
        return dayHasAvailability(d, practitionerIds);
      });
      if (any) {
        if (!isSameMonth(probe, monthAnchor)) setMonthAnchor(probe);
        return;
      }
      probe = addMonths(probe, 1);
      safety++;
    }
  }, [monthAnchor, practitionerIds.join(','), earliest.getTime(), maxDate?.getTime()]);

  const grid = useMemo(() => {
    const start = startOfMonth(monthAnchor);
    const end = endOfMonth(monthAnchor);
    const days = eachDayOfInterval({ start, end });
    const leadingBlanks = start.getDay();
    return { days, leadingBlanks };
  }, [monthAnchor]);

  const slotsForDay = useMemo(() => {
    if (!day) return [];
    if (firstAvailableMode) {
      return getAggregateSlots(practitionerIds, day);
    }
    const pid = practitionerIds[0];
    return getPractitionerSlots(pid, day).map((s) => ({ slot: s, practitionerId: pid }));
  }, [day, practitionerIds.join(','), firstAvailableMode]);

  const goPrev = () => {
    const next = subMonths(monthAnchor, 1);
    if (isBefore(endOfMonth(next), today)) return;
    setMonthAnchor(next);
  };
  const goNext = () => setMonthAnchor(addMonths(monthAnchor, 1));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          className="p-1.5 rounded-lg text-ink-700 hover:bg-cream-100 disabled:opacity-30"
          aria-label="Previous month"
          disabled={isBefore(endOfMonth(subMonths(monthAnchor, 1)), today)}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="font-display text-lg num" style={{ fontWeight: 600 }}>
          {format(monthAnchor, 'MMMM yyyy')}
        </div>
        <button
          type="button"
          onClick={goNext}
          className="p-1.5 rounded-lg text-ink-700 hover:bg-cream-100"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider text-ink-400 num">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: grid.leadingBlanks }).map((_, i) => (
          <div key={`b${i}`} />
        ))}
        {grid.days.map((d) => {
          const past = isBefore(d, earliest) || (maxDate && isBefore(maxDate, d));
          const has = !past && dayHasAvailability(d, practitionerIds);
          const isToday = isSameDay(d, today);
          const isSel = day && isSameDay(d, day);
          const disabled = past || !has;
          return (
            <button
              key={d.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => setDay(d)}
              className={
                'relative aspect-square rounded-lg text-sm num transition flex items-center justify-center ' +
                (isSel
                  ? 'bg-espresso-800 text-cream-100 font-semibold shadow-soft'
                  : disabled
                    ? 'text-ink-400/40 cursor-not-allowed'
                    : isToday
                      ? 'bg-gold-300/30 text-ink-900 font-semibold ring-1 ring-gold-400 hover:bg-gold-300/50'
                      : 'text-ink-900 font-medium hover:bg-cream-200/70')
              }
              aria-pressed={isSel || undefined}
              aria-label={format(d, 'EEEE, MMMM d')}
            >
              {d.getDate()}
              {!isSel && !disabled && !isToday && (
                <span
                  aria-hidden
                  className="absolute bottom-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-accent"
                />
              )}
            </button>
          );
        })}
      </div>

      {windowAdjustedNote && (
        <div className="text-[11px] text-gold-600 bg-gold-300/10 border border-gold-300/40 rounded-md px-2 py-1.5">
          {windowAdjustedNote}
        </div>
      )}

      {day && (
        <div className="pt-2 fade-in-up">
          <div className="text-xs text-ink-500 mb-2">
            {format(day, 'EEEE, MMMM d')} · Available times <span className="num">(ET)</span>
          </div>
          {slotsForDay.length === 0 ? (
            <div className="text-sm text-ink-500">No times available — pick another day.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slotsForDay.map(({ slot, practitionerId }) => {
                const isSel = selectedSlot === slot && isSameDay(day, selectedDate || day) && (!firstAvailableMode || selectedSlotPractitioner === practitionerId);
                const p = findPractitionerById(practitionerId);
                return (
                  <button
                    key={slot + practitionerId}
                    type="button"
                    onClick={() => onPick({ date: day, slot, practitionerId })}
                    className={
                      'rounded-lg px-3 py-2 text-xs num border transition flex flex-col items-start justify-center gap-0.5 min-h-[44px] md:min-h-[40px] ' +
                      (isSel
                        ? 'bg-espresso-800 text-cream-100 border-espresso-800'
                        : 'bg-white border-cream-200 text-ink-700 hover:border-gold-400 hover:bg-cream-50')
                    }
                  >
                    <span className="font-semibold">{formatSlotLabel(slot)}</span>
                    {firstAvailableMode && p && (
                      <span className={'text-[10px] ' + (isSel ? 'text-cream-200/80' : 'text-ink-500')}>
                        with {p.name}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
