import React, { useEffect, useId, useRef, useState } from 'react';

// Small headless tooltip. Hover/focus shows a popover on desktop;
// tap toggles it on touch devices. No external library.
export default function Tooltip({ label, children, className = '' }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrapperRef = useRef(null);

  // Tap-outside to dismiss on mobile.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDoc);
    return () => document.removeEventListener('pointerdown', onDoc);
  }, [open]);

  return (
    <span
      ref={wrapperRef}
      className={'relative inline-flex ' + className}
    >
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="cursor-help underline decoration-dotted underline-offset-4 decoration-accent-strong/60"
      >
        {children}
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute left-1/2 top-full z-30 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-sm bg-ink-900 px-2.5 py-1.5 font-sans text-[11px] normal-case tracking-normal text-bone shadow-soft"
        >
          {label}
        </span>
      )}
    </span>
  );
}
