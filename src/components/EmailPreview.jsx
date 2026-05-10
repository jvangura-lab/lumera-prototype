import React from 'react';

export default function EmailPreview({ from, to, subject, children }) {
  return (
    <div className="border border-cream-200 rounded-xl bg-white shadow-soft overflow-hidden">
      <div className="px-4 py-2 border-b border-cream-200 bg-cream-50 text-[11px] text-ink-500 space-y-0.5">
        <div><span className="text-ink-400">From:</span> <span className="text-ink-700">{from}</span></div>
        <div><span className="text-ink-400">To:</span> <span className="text-ink-700">{to}</span></div>
        <div><span className="text-ink-400">Subject:</span> <span className="text-ink-900 font-medium">{subject}</span></div>
      </div>
      <div className="p-4 text-sm text-ink-700 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}
