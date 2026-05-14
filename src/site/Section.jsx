import React from 'react';

const TONES = {
  bone:        'bg-bone',
  cream:       'bg-[#F3ECE0]',
  'taupe-cream': 'bg-taupe-cream',
  ink:         'bg-ink-900 text-bone',
};

export default function Section({
  id,
  tone = 'bone',
  className = '',
  innerClassName = '',
  children,
}) {
  const bg = TONES[tone] || TONES.bone;
  return (
    <section id={id} className={`${bg} ${className}`}>
      <div className={`mx-auto w-full max-w-site px-6 md:px-10 ${innerClassName}`}>
        {children}
      </div>
    </section>
  );
}
