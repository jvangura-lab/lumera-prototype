import React from 'react';

export function PrimaryButton({ children, onClick, disabled, type = 'button', loading = false, className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={
        'w-full rounded-xl px-5 py-3 font-semibold text-sm tracking-wide transition ' +
        'bg-espresso-800 text-cream-100 hover:bg-espresso-700 active:scale-[0.99] ' +
        'disabled:bg-cream-200 disabled:text-ink-400 disabled:cursor-not-allowed ' +
        'shadow-soft ' +
        className
      }
    >
      {loading ? (
        <span className="inline-flex items-center justify-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-cream-200/40 border-t-cream-100 animate-spin" />
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
        'rounded-xl px-4 py-2 text-sm font-medium text-ink-700 hover:text-espresso-800 hover:bg-cream-100 transition ' +
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
      className="text-xs font-medium text-ink-500 hover:text-espresso-800 transition flex items-center gap-1"
    >
      <span aria-hidden>←</span> Back
    </button>
  );
}
