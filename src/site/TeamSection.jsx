import React from 'react';
import { PRACTITIONERS } from '../mockData.js';

// Curated Unsplash portrait URLs paired to the funnel's practitioners
// (synced names/credentials/specialties per Phase 2 decision 3).
const PORTRAITS = {
  chen:     'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&h=720&q=80',
  martinez: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&h=720&q=80',
  reyes:    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&h=720&q=80',
  park:     'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&h=720&q=80',
  brooks:   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&h=720&q=80',
};

export default function TeamSection() {
  return (
    <section id="team" className="border-b border-[#E2D6C3] bg-bone">
      <div className="mx-auto max-w-site px-6 py-20 md:px-10 md:py-28">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="font-sans text-[11px] uppercase tracking-eyebrow text-accent-strong">
              Your practitioners
            </div>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium tracking-tight text-ink-900 md:text-5xl">
              The team you'll meet.
            </h2>
          </div>
          <p className="max-w-md font-sans text-[15px] leading-relaxed text-ink-700">
            Every member is licensed, insured, and continuously trained. Below are the
            practitioners available for the services in your booking.
          </p>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {PRACTITIONERS.map((p) => (
            <article key={p.id} className="flex flex-col">
              <div className="relative aspect-[5/6] overflow-hidden bg-[#F3ECE0]">
                <img
                  src={PORTRAITS[p.id]}
                  alt={`${p.name}, ${p.credentials}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="mt-5">
                <div className="font-display text-2xl font-medium leading-tight text-ink-900">
                  {p.name}
                </div>
                <div className="mt-1 font-sans text-[12px] uppercase tracking-eyebrow text-accent-strong">
                  {p.credentials}
                </div>
                <p className="mt-3 font-sans text-[15px] leading-relaxed text-ink-700">
                  {p.bio}
                </p>
                <div className="mt-4 font-sans text-[12px] leading-relaxed text-ink-500">
                  <span className="font-sans text-[10px] uppercase tracking-eyebrow text-ink-500">
                    Treats:
                  </span>{' '}
                  {p.specialties.join(' · ')}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
