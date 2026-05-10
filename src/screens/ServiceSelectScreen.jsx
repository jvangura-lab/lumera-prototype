import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import ScreenChrome from '../components/ScreenChrome.jsx';
import { PrimaryButton } from '../components/Button.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { SERVICE_CATEGORIES, SERIES_PACKAGES, findServiceById } from '../mockData.js';
import { formatDuration, formatPrice } from '../utils/formatting.js';
import { useBooking, STEPS, BOOKING_TYPES } from '../state/BookingContext.jsx';

export default function ServiceSelectScreen() {
  const { state, actions } = useBooking();
  if (state.bookingType === BOOKING_TYPES.SERIES) {
    return <SeriesPicker />;
  }
  return <SingleServicePicker />;
}

function SingleServicePicker() {
  const { state, actions } = useBooking();
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [openCats, setOpenCats] = useState(() => {
    const set = new Set();
    if (state.serviceId) {
      const svc = findServiceById(state.serviceId);
      if (svc) set.add(svc.categoryId);
    }
    return set;
  });
  const [pending, setPending] = useState(state.serviceId);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim().toLowerCase()), 150);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = useMemo(() => {
    if (!debounced) return SERVICE_CATEGORIES;
    return SERVICE_CATEGORIES
      .map((c) => ({
        ...c,
        services: c.services.filter(
          (s) =>
            s.name.toLowerCase().includes(debounced) ||
            (s.consultRequired ? 'consultation required' : 'direct booking').includes(debounced)
        ),
      }))
      .filter((c) => c.services.length > 0);
  }, [debounced]);

  const autoExpanded = useMemo(() => {
    if (debounced) return new Set(filtered.map((c) => c.id));
    return openCats;
  }, [debounced, filtered, openCats]);

  const toggleCat = (id) => {
    if (debounced) return;
    setOpenCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelect = (svcId) => {
    if (state.serviceId && state.serviceId !== svcId && hasDownstream(state)) {
      setPendingChange(svcId);
      setConfirmOpen(true);
      return;
    }
    setPending(svcId);
    actions.setService(svcId);
  };

  const confirmChange = () => {
    setPending(pendingChange);
    actions.setService(pendingChange);
    actions.resetServiceDownstream();
    setConfirmOpen(false);
    setPendingChange(null);
  };

  const handleContinue = () => {
    if (!pending) return;
    const svc = findServiceById(pending);
    if (!svc) return;
    if (svc.consultRequired) {
      actions.goTo(STEPS.RETURNING);
    } else {
      actions.goTo(STEPS.PRACTITIONER);
    }
  };

  return (
    <ScreenChrome
      title="Choose a service."
      footer={<PrimaryButton onClick={handleContinue} disabled={!pending}>Continue</PrimaryButton>}
    >
      <div className="sticky top-0 z-10 -mx-5 px-5 py-2 bg-white">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full rounded-lg border border-cream-200 bg-cream-50 text-sm pl-9 pr-9 py-2.5 focus:border-gold-400 outline-none"
            aria-label="Search services"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-ink-500 hover:text-espresso-800"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-sm text-ink-500 py-6 text-center">No services match "{search}".</div>
      )}

      {filtered.map((cat) => {
        const open = autoExpanded.has(cat.id);
        return (
          <div key={cat.id} className="border border-cream-200 rounded-xl overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => toggleCat(cat.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream-50 transition"
              aria-expanded={open}
            >
              <span className="font-display text-lg" style={{ fontWeight: 600 }}>
                {cat.name} <span className="text-ink-400 text-sm num">({cat.services.length})</span>
              </span>
              <ChevronDown className={'w-4 h-4 text-ink-500 transition ' + (open ? 'rotate-180' : '')} />
            </button>
            {open && (
              <div className="border-t border-cream-200 divide-y divide-cream-100">
                {cat.services.map((s) => {
                  const sel = pending === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSelect(s.id)}
                      className={
                        'w-full text-left px-4 py-3 transition ' +
                        (sel ? 'bg-blush-100/60' : 'hover:bg-cream-50')
                      }
                      aria-pressed={sel}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-medium text-sm text-ink-900">{s.name}</div>
                          <div className="text-[11px] text-ink-500 mt-0.5 num">
                            {formatDuration(s.duration)} · {formatPrice(s.price)}
                            {s.consultRequired && (
                              <> · <span className={s.inPersonOnlyConsult ? 'text-blush-500' : 'text-ink-700'}>
                                {s.inPersonOnlyConsult ? 'Consultation required (in-person only)' : 'Consultation required'}
                              </span></>
                            )}
                          </div>
                        </div>
                        <span
                          className={
                            'mt-1 w-4 h-4 rounded-full border-2 flex-shrink-0 ' +
                            (sel ? 'border-gold-500 bg-gold-400' : 'border-cream-300 bg-white')
                          }
                          aria-hidden
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <ConfirmDialog
        open={confirmOpen}
        title="Change service?"
        body="Changing this will reset your time selection and practitioner choice. Your contact info will be saved."
        confirmLabel="Yes, change it"
        onConfirm={confirmChange}
        onCancel={() => { setConfirmOpen(false); setPendingChange(null); }}
      />
    </ScreenChrome>
  );
}

function SeriesPicker() {
  const { state, actions } = useBooking();
  const [pending, setPending] = useState(state.seriesId);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);

  const handleSelect = (id) => {
    if (state.seriesId && state.seriesId !== id && hasDownstream(state)) {
      setPendingChange(id);
      setConfirmOpen(true);
      return;
    }
    setPending(id);
    actions.setSeries(id);
  };

  const confirmChange = () => {
    setPending(pendingChange);
    actions.setSeries(pendingChange);
    actions.resetServiceDownstream();
    setConfirmOpen(false);
    setPendingChange(null);
  };

  const handleContinue = () => {
    if (!pending) return;
    const pkg = SERIES_PACKAGES.find((p) => p.id === pending);
    if (pkg.consultRequired) {
      actions.goTo(STEPS.RETURNING);
    } else {
      actions.goTo(STEPS.PRACTITIONER);
    }
  };

  return (
    <ScreenChrome
      title="Choose a series package."
      footer={<PrimaryButton onClick={handleContinue} disabled={!pending}>Continue</PrimaryButton>}
    >
      {SERIES_PACKAGES.map((p) => {
        const sel = pending === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => handleSelect(p.id)}
            aria-pressed={sel}
            className={
              'w-full text-left rounded-xl border p-4 transition ' +
              (sel
                ? 'border-gold-400 bg-blush-100/60 shadow-soft'
                : 'border-cream-200 bg-white hover:border-blush-300 hover:bg-cream-50')
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-display text-lg leading-tight" style={{ fontWeight: 600 }}>
                  {p.name}
                </div>
                <div className="text-xs text-ink-500 mt-0.5 num">
                  {p.sessions}-Session Package · {p.spacingLabel}
                </div>
                <div className="mt-2 text-sm">
                  <span className="num font-semibold text-espresso-800">{formatPrice(p.totalPrice)}</span>
                  <span className="text-ink-500 num"> · {formatPrice(p.perSessionPrice)}/session</span>
                  <span className="ml-2 text-[11px] num px-1.5 py-0.5 rounded bg-gold-300/30 text-gold-600">save {formatPrice(p.savings)}</span>
                </div>
                {p.consultRequired && (
                  <div className="text-[11px] mt-2 text-ink-700">
                    Consultation required before first session
                  </div>
                )}
              </div>
              <span
                className={
                  'mt-1 w-4 h-4 rounded-full border-2 flex-shrink-0 ' +
                  (sel ? 'border-gold-500 bg-gold-400' : 'border-cream-300 bg-white')
                }
                aria-hidden
              />
            </div>
          </button>
        );
      })}

      <ConfirmDialog
        open={confirmOpen}
        title="Change package?"
        body="Changing this will reset your time selection and practitioner choice. Your contact info will be saved."
        confirmLabel="Yes, change it"
        onConfirm={confirmChange}
        onCancel={() => { setConfirmOpen(false); setPendingChange(null); }}
      />
    </ScreenChrome>
  );
}

function hasDownstream(state) {
  return Boolean(state.practitionerId || state.appointment || state.series);
}
