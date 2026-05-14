import React, { useId, useRef, useState } from 'react';
import ScreenChrome from '../components/ScreenChrome.jsx';
import { PrimaryButton } from '../components/Button.jsx';
import { useBooking, STEPS, BOOKING_TYPES } from '../state/BookingContext.jsx';
import { HEAR_ABOUT_OPTIONS } from '../mockData.js';
import { formatPhone, isValidEmail, normalizePhone, ageFromDOB } from '../utils/formatting.js';

export default function IntakeScreen() {
  const { state, actions } = useBooking();
  const [intake, setIntake] = useState(state.intake);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const refs = {
    fullName: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    dob: useRef(null),
    newOrReturning: useRef(null),
    hearAbout: useRef(null),
    healthAck: useRef(null),
  };

  // Stable, unique ids for label/for wiring. useId guarantees no collisions.
  const idBase = useId();
  const ids = {
    fullName: `${idBase}-fullName`,
    email: `${idBase}-email`,
    phone: `${idBase}-phone`,
    dob: `${idBase}-dob`,
    newOrReturning: `${idBase}-newOrReturning`,
    reason: `${idBase}-reason`,
    hearAbout: `${idBase}-hearAbout`,
    medical: `${idBase}-medical`,
    healthAck: `${idBase}-healthAck`,
  };

  const requireHealthAck =
    state.bookingType === BOOKING_TYPES.SERIES ||
    state.sameDay === true;

  const validate = (data, fields = null) => {
    const e = {};
    const check = (k) => !fields || fields.includes(k);
    if (check('fullName') && !data.fullName.trim()) e.fullName = 'Required';
    if (check('email')) {
      if (!data.email.trim()) e.email = 'Required';
      else if (!isValidEmail(data.email)) e.email = 'Enter a valid email';
    }
    if (check('phone')) {
      const d = normalizePhone(data.phone);
      if (!d) e.phone = 'Required';
      else if (d.length !== 10) e.phone = 'Enter a 10-digit phone number';
    }
    if (check('dob')) {
      if (!data.dob) e.dob = 'Required';
      else {
        const age = ageFromDOB(data.dob);
        if (age == null) e.dob = 'Enter a valid date';
        else if (age < 18) e.dob = 'Patients must be 18 or older';
      }
    }
    if (check('newOrReturning') && !data.newOrReturning) e.newOrReturning = 'Required';
    if (check('hearAbout') && !data.hearAbout) e.hearAbout = 'Required';
    if (requireHealthAck && check('healthAck') && !data.healthAck) e.healthAck = 'Required';
    return e;
  };

  const onBlur = (field) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(intake, [field]));
  };

  const update = (patch) => {
    const next = { ...intake, ...patch };
    setIntake(next);
    actions.setIntake(patch);
    if (Object.keys(touched).length) {
      const touchedFields = Object.keys(touched).filter((k) => touched[k]);
      setErrors(validate(next, touchedFields));
    }
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const all = validate(intake);
    setErrors(all);
    setTouched({
      fullName: true, email: true, phone: true, dob: true, newOrReturning: true, hearAbout: true, healthAck: true,
    });
    if (Object.keys(all).length === 0) {
      actions.goTo(STEPS.POLICY);
    } else {
      const order = ['fullName', 'email', 'phone', 'dob', 'newOrReturning', 'hearAbout', 'healthAck'];
      const first = order.find((k) => all[k]);
      if (first && refs[first]?.current) {
        refs[first].current.focus();
        refs[first].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <ScreenChrome
      title="Your details."
      subtitle="* required"
    >
      <form onSubmit={handleSubmit} className="space-y-2.5" noValidate>
        <Field id={ids.fullName} label="Full name" required error={touched.fullName && errors.fullName}>
          <input
            ref={refs.fullName}
            id={ids.fullName}
            name="fullName"
            type="text"
            required
            value={intake.fullName}
            onChange={(e) => update({ fullName: e.target.value })}
            onBlur={() => onBlur('fullName')}
            className={inputCls(touched.fullName && errors.fullName)}
            autoComplete="name"
          />
        </Field>

        <Field id={ids.email} label="Email" required error={touched.email && errors.email}>
          <input
            ref={refs.email}
            id={ids.email}
            name="email"
            type="email"
            required
            value={intake.email}
            onChange={(e) => update({ email: e.target.value })}
            onBlur={() => onBlur('email')}
            className={inputCls(touched.email && errors.email)}
            autoComplete="email"
            inputMode="email"
          />
        </Field>

        <Field id={ids.phone} label="Phone" required error={touched.phone && errors.phone}>
          <input
            ref={refs.phone}
            id={ids.phone}
            name="phone"
            type="tel"
            required
            value={formatPhone(intake.phone)}
            onChange={(e) => update({ phone: normalizePhone(e.target.value) })}
            onBlur={() => onBlur('phone')}
            className={inputCls(touched.phone && errors.phone)}
            inputMode="tel"
            autoComplete="tel"
            placeholder="(555) 123-4567"
          />
        </Field>

        <Field id={ids.dob} label="Date of birth" required error={touched.dob && errors.dob} hint="Patients must be 18 or older.">
          <input
            ref={refs.dob}
            id={ids.dob}
            name="dob"
            type="date"
            required
            value={intake.dob}
            onChange={(e) => update({ dob: e.target.value })}
            onBlur={() => onBlur('dob')}
            className={inputCls(touched.dob && errors.dob)}
            autoComplete="bday"
          />
        </Field>

        <Field
          as="fieldset"
          label="New or returning patient"
          required
          error={touched.newOrReturning && errors.newOrReturning}
        >
          <div ref={refs.newOrReturning} className="flex gap-2" role="radiogroup" aria-label="New or returning patient">
            {['New', 'Returning'].map((v) => (
              <label
                key={v}
                className={
                  'flex-1 px-3 py-2 rounded-lg border cursor-pointer text-sm text-center transition ' +
                  (intake.newOrReturning === v
                    ? 'border-gold-400 bg-blush-100/60'
                    : 'border-cream-200 bg-white hover:border-blush-300')
                }
              >
                <input
                  type="radio"
                  name="newOrReturning"
                  value={v}
                  className="sr-only"
                  checked={intake.newOrReturning === v}
                  onChange={() => update({ newOrReturning: v })}
                  onBlur={() => onBlur('newOrReturning')}
                  required
                />
                {v}
              </label>
            ))}
          </div>
        </Field>

        <Field id={ids.reason} label="Reason for visit / goals (optional)">
          <textarea
            id={ids.reason}
            name="reason"
            value={intake.reason}
            onChange={(e) => update({ reason: e.target.value })}
            rows={2}
            className={inputCls(false)}
            autoComplete="off"
          />
        </Field>

        <Field id={ids.hearAbout} label="How did you hear about us?" required error={touched.hearAbout && errors.hearAbout}>
          <select
            ref={refs.hearAbout}
            id={ids.hearAbout}
            name="hearAbout"
            required
            value={intake.hearAbout}
            onChange={(e) => update({ hearAbout: e.target.value })}
            onBlur={() => onBlur('hearAbout')}
            className={inputCls(touched.hearAbout && errors.hearAbout)}
          >
            <option value="">Select…</option>
            {HEAR_ABOUT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>

        <Field id={ids.medical} label="Allergies, medications, or conditions (optional)">
          <textarea
            id={ids.medical}
            name="medical"
            value={intake.medical}
            onChange={(e) => update({ medical: e.target.value })}
            rows={2}
            className={inputCls(false)}
            autoComplete="off"
          />
        </Field>

        {requireHealthAck && (
          <Field error={touched.healthAck && errors.healthAck}>
            <label
              htmlFor={ids.healthAck}
              className={
                'flex items-start gap-2 rounded-lg border p-3 text-sm cursor-pointer transition ' +
                (intake.healthAck ? 'border-gold-400 bg-blush-100/60' : 'border-cream-200 bg-white')
              }
            >
              <input
                ref={refs.healthAck}
                id={ids.healthAck}
                name="healthAck"
                type="checkbox"
                required
                className="mt-0.5"
                checked={intake.healthAck}
                onChange={(e) => update({ healthAck: e.target.checked })}
                onBlur={() => onBlur('healthAck')}
              />
              <span>
                I confirm I have disclosed all relevant health information and understand the procedure-day acknowledgements.
                <span className="text-blush-500"> *</span>
              </span>
            </label>
          </Field>
        )}

        <PrimaryButton
          type="submit"
          disabled={requireHealthAck && !intake.healthAck}
        >
          Continue
        </PrimaryButton>
      </form>
    </ScreenChrome>
  );
}

function Field({ id, as = 'div', label, required, error, hint, children }) {
  const Wrapper = as;
  const LabelTag = as === 'fieldset' ? 'legend' : 'label';
  const labelProps = as === 'fieldset' ? {} : { htmlFor: id };
  return (
    <Wrapper className={as === 'fieldset' ? 'border-0 p-0 m-0' : undefined}>
      {label && (
        <LabelTag
          {...labelProps}
          className="block text-xs font-medium text-ink-700 mb-1"
        >
          {label} {required && <span className="text-blush-500">*</span>}
        </LabelTag>
      )}
      {children}
      {hint && !error && <div className="text-[11px] text-ink-400 mt-1">{hint}</div>}
      {error && <div className="text-[11px] text-blush-500 mt-1">{error}</div>}
    </Wrapper>
  );
}

function inputCls(hasError) {
  return (
    'w-full rounded-lg border px-3 py-2 text-sm bg-white outline-none transition ' +
    (hasError
      ? 'border-blush-400 focus:border-blush-500'
      : 'border-cream-200 focus:border-gold-400')
  );
}
