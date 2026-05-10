import React from 'react';
import { PrimaryButton, GhostButton } from './Button.jsx';

export default function ConfirmDialog({ open, title, body, confirmLabel = 'Continue', cancelLabel = 'Cancel', onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-900/40">
      <div className="bg-white rounded-2xl shadow-card max-w-[360px] w-full p-5 fade-in-up">
        <h3 className="font-display text-xl mb-2" style={{ fontWeight: 600 }}>{title}</h3>
        <p className="text-sm text-ink-700 mb-4 leading-relaxed">{body}</p>
        <div className="space-y-2">
          <PrimaryButton onClick={onConfirm}>{confirmLabel}</PrimaryButton>
          <div className="flex justify-center">
            <GhostButton onClick={onCancel}>{cancelLabel}</GhostButton>
          </div>
        </div>
      </div>
    </div>
  );
}
