import React from 'react';
import { Check } from 'lucide-react';

export default function SelectCard({ selected, onClick, disabled, title, subtitle, meta, badge, children }) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={
        'group relative w-full rounded-sm border text-left transition-[background-color,border-color,box-shadow] duration-[250ms] ease-out px-5 py-5 md:px-6 md:py-6 ' +
        (disabled
          ? 'cursor-not-allowed border-[#E7DDCC] bg-[#F3ECE0]/50 text-ink-500 '
          : selected
            ? 'border-ink-900 bg-white shadow-soft '
            : 'border-[#E2D6C3] bg-white hover:border-ink-700 hover:bg-[#FBF7EE] ')
      }
    >
      <div className="flex items-start gap-4">
        <span
          className={
            'mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-[200ms] ' +
            (selected
              ? 'border-accent-strong bg-accent-strong text-bone'
              : 'border-ink-300 bg-white')
          }
          aria-hidden
        >
          {selected && <Check className="h-3 w-3" strokeWidth={3.5} />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="font-display text-xl font-medium leading-tight text-ink-900 md:text-2xl">
              {title}
            </div>
            {badge && (
              <span className="num shrink-0 rounded-sm border border-accent/40 bg-accent-soft/60 px-2 py-0.5 text-[10px] uppercase tracking-eyebrow text-accent-strong">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <div className="mt-1.5 font-sans text-sm leading-relaxed text-ink-500 md:text-[15px]">
              {subtitle}
            </div>
          )}
          {meta && (
            <div className="num mt-2 font-sans text-xs text-ink-500">{meta}</div>
          )}
          {children}
        </div>
      </div>
    </button>
  );
}
