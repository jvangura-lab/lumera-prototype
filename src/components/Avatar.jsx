import React from 'react';

const ACCENT = {
  blush: 'bg-blush-200 text-espresso-800',
  gold: 'bg-gold-300 text-espresso-900',
  cream: 'bg-cream-200 text-espresso-800',
  espresso: 'bg-espresso-700 text-cream-100',
};

export default function Avatar({ initials, accent = 'blush', size = 'md' }) {
  const dim = size === 'lg' ? 'w-12 h-12 text-base' : 'w-10 h-10 text-sm';
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-semibold ${ACCENT[accent] || ACCENT.blush} flex-shrink-0`}
      aria-hidden
    >
      {initials}
    </div>
  );
}
