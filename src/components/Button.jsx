import React from 'react';

// Warm color-shift on hover (250ms) lands the warm-out feeling the brief
// calls for. The active 1px translate doesn't need an explicit transition.
const baseBtn =
  'inline-flex items-center justify-center font-sans text-[13px] font-semibold uppercase tracking-eyebrow ' +
  'rounded-sm focus:outline-none disabled:cursor-not-allowed ' +
  'transition-colors duration-[250ms] ease-out';

export function PrimaryButton({ children, onClick, disabled, type = 'button', loading = false, className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={
        baseBtn +
        ' w-full px-6 py-4 ' +
        'bg-ink-900 text-bone hover:bg-[#3a2e26] active:translate-y-[1px] ' +
        'disabled:bg-[#E7DDCC] disabled:text-ink-500/60 disabled:opacity-70 ' +
        'disabled:hover:bg-[#E7DDCC] ' +
        className
      }
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-bone/30 border-t-bone" />
          Processing…
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export function GhostButton({ children, onClick, type = 'button', className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={
        baseBtn +
        ' px-6 py-4 border border-ink-900 bg-transparent text-ink-900 hover:bg-ink-900 hover:text-bone ' +
        className
      }
    >
      {children}
    </button>
  );
}

export function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-eyebrow text-ink-500 transition-colors duration-[250ms] hover:text-ink-900"
    >
      <span aria-hidden>←</span> Back
    </button>
  );
}
