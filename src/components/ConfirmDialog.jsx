import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PrimaryButton, GhostButton } from './Button.jsx';
import { dialogBackdropVariants, dialogVariants } from '../motion/variants.js';

export default function ConfirmDialog({ open, title, body, confirmLabel = 'Continue', cancelLabel = 'Cancel', onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={dialogBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-900/40"
          onClick={onCancel}
        >
          <motion.div
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-card max-w-[360px] w-full p-5"
            role="dialog"
            aria-modal="true"
          >
            <h3 className="font-display text-xl mb-2" style={{ fontWeight: 600 }}>{title}</h3>
            <p className="text-sm text-ink-700 mb-4 leading-relaxed">{body}</p>
            <div className="space-y-2">
              <PrimaryButton onClick={onConfirm}>{confirmLabel}</PrimaryButton>
              <div className="flex justify-center">
                <GhostButton onClick={onCancel}>{cancelLabel}</GhostButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
