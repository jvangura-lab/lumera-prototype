import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import { reducer, initialState, STEPS, BOOKING_TYPES } from './reducer.js';
import { loadState, saveState, clearState } from '../utils/storage.js';
import {
  findServiceById,
  findSeriesById,
  findPractitionerById,
  practitionersForService,
  PRACTITIONERS,
} from '../mockData.js';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const persisted = loadState();
    if (persisted) {
      return { ...init, ...persisted, history: persisted.history || [] };
    }
    return init;
  });

  const initialMount = useRef(true);
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    saveState(state);
  }, [state]);

  // Browser back-button interception
  useEffect(() => {
    if (state.step === STEPS.BOOKING_TYPE || state.step === STEPS.CONFIRMATION) return;
    window.history.pushState({ lumera: true, step: state.step }, '');
    const onPop = () => {
      if (state.history.length > 0) {
        dispatch({ type: 'BACK' });
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [state.step, state.history.length]);

  const value = {
    state,
    dispatch,
    actions: buildActions(state, dispatch),
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

function buildActions(state, dispatch) {
  return {
    goTo: (step) => dispatch({ type: 'GO_TO_STEP', step }),
    back: () => dispatch({ type: 'BACK' }),
    setBookingType: (t) => {
      dispatch({ type: 'SET_BOOKING_TYPE', value: t });
    },
    resetBookingTypeDownstream: () => dispatch({ type: 'RESET_BOOKING_TYPE_DOWNSTREAM' }),
    setService: (id) => dispatch({ type: 'SET_SERVICE', value: id }),
    setSeries: (id) => dispatch({ type: 'SET_SERIES', value: id }),
    resetServiceDownstream: () => dispatch({ type: 'RESET_SERVICE_DOWNSTREAM' }),
    setReturning: (v) => dispatch({ type: 'SET_RETURNING', value: v }),
    setConsultFormat: (v) => dispatch({ type: 'SET_CONSULT_FORMAT', value: v }),
    setPractitioner: (id) => dispatch({ type: 'SET_PRACTITIONER', value: id }),
    resetPractitionerDownstream: () => dispatch({ type: 'RESET_PRACTITIONER_DOWNSTREAM' }),
    setAppointment: (a) => dispatch({ type: 'SET_APPOINTMENT', value: a }),
    setSeriesData: (s) => dispatch({ type: 'SET_SERIES_DATA', value: s }),
    setSameDay: (v) => dispatch({ type: 'SET_SAME_DAY', value: v }),
    setIntake: (patch) => dispatch({ type: 'SET_INTAKE', value: patch }),
    setPolicy: (v) => dispatch({ type: 'SET_POLICY', value: v }),
    setPayment: (p) => dispatch({ type: 'SET_PAYMENT', value: p }),
    resetAll: () => {
      clearState();
      try { sessionStorage.removeItem('lumera.seed'); } catch {}
      try { delete window.__lumera_session_seed__; } catch {}
      dispatch({ type: 'RESET' });
    },
  };
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider');
  return ctx;
}

// ---------- Flow derivation helpers ----------

export function deriveFlow(state) {
  const { bookingType, serviceId, seriesId, returningPatient } = state;
  const service = serviceId ? findServiceById(serviceId) : null;
  const series = seriesId ? findSeriesById(seriesId) : null;

  const path = [STEPS.BOOKING_TYPE];

  if (!bookingType) {
    return {
      path: [
        STEPS.BOOKING_TYPE,
        STEPS.SERVICE,
        STEPS.RETURNING,
        STEPS.CLARIFY,
        STEPS.CONSULT_FORMAT,
        STEPS.PRACTITIONER,
        STEPS.CALENDAR,
        STEPS.SAME_DAY,
        STEPS.INTAKE,
        STEPS.POLICY,
        STEPS.CHECKOUT,
        STEPS.CONFIRMATION,
      ],
      maxLen: 12,
    };
  }

  path.push(STEPS.SERVICE);

  if (bookingType === BOOKING_TYPES.CONSULT) {
    // No returning gate — patient explicitly chose to book a consultation.
    path.push(STEPS.CONSULT_FORMAT, STEPS.PRACTITIONER, STEPS.CALENDAR, STEPS.SAME_DAY);
  } else if (bookingType === BOOKING_TYPES.SINGLE) {
    if (!service) {
      path.push(STEPS.RETURNING, STEPS.CLARIFY, STEPS.CONSULT_FORMAT, STEPS.PRACTITIONER, STEPS.CALENDAR, STEPS.SAME_DAY);
    } else if (!service.consultRequired) {
      // Direct-bookable: no gate, no consult.
      path.push(STEPS.PRACTITIONER, STEPS.CALENDAR);
    } else {
      // Consult-required service.
      path.push(STEPS.RETURNING);
      if (returningPatient === true) {
        path.push(STEPS.PRACTITIONER, STEPS.CALENDAR);
      } else {
        // new (or undecided) → clarifying screen, then consultation flow.
        path.push(STEPS.CLARIFY, STEPS.CONSULT_FORMAT, STEPS.PRACTITIONER, STEPS.CALENDAR, STEPS.SAME_DAY);
      }
    }
  } else if (bookingType === BOOKING_TYPES.SERIES) {
    if (!series) {
      path.push(STEPS.RETURNING, STEPS.PRACTITIONER, STEPS.SERIES_FIRST, STEPS.SERIES_SCHEDULE, STEPS.SERIES_REVIEW);
    } else if (!series.consultRequired) {
      path.push(STEPS.PRACTITIONER, STEPS.SERIES_FIRST, STEPS.SERIES_SCHEDULE, STEPS.SERIES_REVIEW);
    } else {
      path.push(STEPS.RETURNING);
      if (returningPatient === true) {
        path.push(STEPS.PRACTITIONER, STEPS.SERIES_FIRST, STEPS.SERIES_SCHEDULE, STEPS.SERIES_REVIEW);
      } else if (returningPatient === false) {
        // New patient: routed to consult-only flow. The series itself isn't scheduled.
        path.push(STEPS.CLARIFY, STEPS.CONSULT_FORMAT, STEPS.PRACTITIONER, STEPS.CALENDAR);
      } else {
        // Default to series path while user hasn't answered yet.
        path.push(STEPS.PRACTITIONER, STEPS.SERIES_FIRST, STEPS.SERIES_SCHEDULE, STEPS.SERIES_REVIEW);
      }
    }
  }

  path.push(STEPS.INTAKE, STEPS.POLICY, STEPS.CHECKOUT, STEPS.CONFIRMATION);
  return { path, maxLen: path.length };
}

export function isConsultFlow(state) {
  // True when this booking represents a consultation visit (not a direct booking, not a returning-patient skip).
  if (state.bookingType === BOOKING_TYPES.CONSULT) return true;
  if (state.bookingType === BOOKING_TYPES.SINGLE) {
    if (state.returningPatient === true) return false;
    const svc = state.serviceId ? findServiceById(state.serviceId) : null;
    if (!svc || !svc.consultRequired) return false;
    return state.returningPatient === false;
  }
  if (state.bookingType === BOOKING_TYPES.SERIES) {
    const pkg = state.seriesId ? findSeriesById(state.seriesId) : null;
    return !!(pkg && pkg.consultRequired && state.returningPatient === false);
  }
  return false;
}

export function isSeriesScheduled(state) {
  return state.bookingType === BOOKING_TYPES.SERIES && (state.series?.sessions?.length || 0) > 0;
}

export function stepLabel(step) {
  switch (step) {
    case STEPS.BOOKING_TYPE: return 'Type';
    case STEPS.SERVICE: return 'Service';
    case STEPS.RETURNING: return 'Patient';
    case STEPS.CONSULT_FORMAT: return 'Format';
    case STEPS.CLARIFY: return 'Heads-up';
    case STEPS.PRACTITIONER: return 'Provider';
    case STEPS.CALENDAR: return 'Time';
    case STEPS.SERIES_FIRST: return 'Session 1';
    case STEPS.SERIES_SCHEDULE: return 'Schedule';
    case STEPS.SERIES_REVIEW: return 'Review';
    case STEPS.SAME_DAY: return 'Same-day';
    case STEPS.INTAKE: return 'Details';
    case STEPS.POLICY: return 'Policy';
    case STEPS.CHECKOUT: return 'Payment';
    case STEPS.CONFIRMATION: return 'Done';
    default: return '';
  }
}

export function getQualifyingPractitioners(state) {
  const { bookingType, serviceId, seriesId } = state;
  let svcId = serviceId;
  if (bookingType === BOOKING_TYPES.SERIES && seriesId) {
    const s = findSeriesById(seriesId);
    if (s) svcId = s.serviceId;
  }
  if (!svcId) return [];
  return practitionersForService(svcId);
}

export function getActivePractitionerIds(state) {
  const qual = getQualifyingPractitioners(state);
  if (state.practitionerId === 'first-available') return qual.map((p) => p.id);
  if (state.practitionerId) return [state.practitionerId];
  return qual.map((p) => p.id);
}

export function getSelectedPractitioner(state) {
  if (!state.practitionerId) return null;
  if (state.practitionerId === 'first-available') return null;
  return findPractitionerById(state.practitionerId);
}

export { STEPS, BOOKING_TYPES, PRACTITIONERS };
