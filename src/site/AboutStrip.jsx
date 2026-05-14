import React from 'react';
import { ShieldCheck, Sparkles, Hand } from 'lucide-react';

const ITEMS = [
  {
    Icon: ShieldCheck,
    kicker: 'Board-certified',
    title: 'Medical-led aesthetics',
    body: 'Every treatment is overseen by an MD. Our injectors and laser specialists are licensed, insured, and trained in the latest aesthetic techniques.',
  },
  {
    Icon: Sparkles,
    kicker: 'In-house, end-to-end',
    title: 'Book, confirm, check in here',
    body: 'No third-party schedulers, no email tag. Your booking is live the moment you reserve, with confirmation in your inbox seconds later.',
  },
  {
    Icon: Hand,
    kicker: 'Always concierge',
    title: 'Cancellations and changes by phone',
    body: "Need to move a visit? Call (813) 555-0142 and a member of our front-desk team will handle it personally — same day, no scripts.",
  },
];

export default function AboutStrip() {
  return (
    <section className="border-b border-[#E2D6C3] bg-[#F3ECE0]">
      <div className="mx-auto max-w-site px-6 py-16 md:px-10 md:py-20">
        <div className="font-sans text-[11px] uppercase tracking-eyebrow text-accent-strong">
          Why book here
        </div>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-medium tracking-tight text-ink-900 md:text-4xl">
          Concierge-level care, without the booking friction.
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
          {ITEMS.map(({ Icon, kicker, title, body }) => (
            <div key={kicker} className="flex flex-col">
              <Icon className="h-6 w-6 text-accent-strong" strokeWidth={1.5} />
              <div className="mt-4 font-sans text-[11px] uppercase tracking-eyebrow text-ink-500">
                {kicker}
              </div>
              <div className="mt-1 font-display text-xl font-medium leading-snug text-ink-900">
                {title}
              </div>
              <p className="mt-3 font-sans text-[15px] leading-relaxed text-ink-700">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
