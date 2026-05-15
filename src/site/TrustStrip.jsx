import React from 'react';
import { ShieldCheck, Sparkles, Award, Lock } from 'lucide-react';

const CREDENTIALS = [
  { icon: ShieldCheck, label: 'FL Medical Board',          detail: 'Lic. #ME12345' },
  { icon: Sparkles,    label: 'Allergan Black Diamond',    detail: 'Top 1% nationally' },
  { icon: Award,       label: 'Galderma Certified',        detail: 'Injector network' },
  { icon: Lock,        label: 'HIPAA-Compliant',           detail: 'SOC 2 Type II' },
];

export default function TrustStrip() {
  return (
    <section
      aria-label="Credentials and compliance"
      className="border-b border-[#E2D6C3] bg-bone"
    >
      <div className="mx-auto max-w-site px-6 py-8 md:px-10">
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-ink-700">
          {CREDENTIALS.map(({ icon: Icon, label, detail }) => (
            <li key={label} className="flex items-center gap-3">
              <Icon className="h-4 w-4 text-accent-strong" strokeWidth={1.75} aria-hidden />
              <span className="font-sans text-[11px] uppercase tracking-eyebrow text-ink-900">
                {label}
                <span className="ml-1.5 text-ink-500 normal-case tracking-normal">
                  · {detail}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
