import React from 'react';

export default function Banner() {
  return (
    <div className="rounded-t-2xl px-5 py-4 flex items-baseline justify-between bg-espresso-800 text-cream-100">
      <span
        className="font-display text-3xl text-gold-300"
        style={{ fontWeight: 600, letterSpacing: '-0.01em' }}
      >
        Magnolia
      </span>
      <span className="text-[10px] uppercase tracking-[0.18em] text-cream-200/85 font-medium">
        Book Your Visit
      </span>
    </div>
  );
}
