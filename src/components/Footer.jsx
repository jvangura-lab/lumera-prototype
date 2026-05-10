import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <div className="px-5 py-3 border-t border-cream-200 text-[11px] text-ink-500 flex items-center justify-between">
      <span>
        Powered by <span className="font-semibold text-ink-700 tracking-wide">RIVR</span>
      </span>
      <span className="flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
        HIPAA-compliant data handling
      </span>
    </div>
  );
}
