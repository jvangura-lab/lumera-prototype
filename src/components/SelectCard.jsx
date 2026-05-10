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
        'group w-full text-left rounded-xl border px-4 py-3 transition relative ' +
        (disabled
          ? 'border-cream-200 bg-cream-50 text-ink-400 cursor-not-allowed '
          : selected
            ? 'border-gold-400 bg-blush-100/60 shadow-soft '
            : 'border-cream-200 bg-white hover:border-blush-300 hover:bg-cream-50 ')
      }
    >
      <div className="flex items-start gap-3">
        <span
          className={
            'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ' +
            (selected ? 'border-gold-500 bg-gold-400 text-espresso-900' : 'border-cream-300 bg-white')
          }
          aria-hidden
        >
          {selected && <Check className="w-3 h-3" strokeWidth={3} />}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="font-display text-lg leading-tight" style={{ fontWeight: 600 }}>
              {title}
            </div>
            {badge && (
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-gold-300/30 text-gold-600 border border-gold-300/50 num">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <div className="text-sm text-ink-500 mt-0.5 leading-snug">{subtitle}</div>}
          {meta && <div className="text-[11px] text-ink-400 mt-1 num">{meta}</div>}
          {children}
        </div>
      </div>
    </button>
  );
}
