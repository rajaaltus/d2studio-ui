"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

export function ConfirmSheet({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  destructive = true,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel, onConfirm]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onCancel}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="luminous-spinners relative w-full max-w-md rounded-t-2xl border-t border-x border-[var(--ls-border)] bg-[var(--ls-card)] p-5 text-[var(--ls-foreground)] shadow-2xl sm:rounded-2xl sm:border"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <h2 className="text-sm font-semibold text-[var(--ls-foreground)]">
              {title}
            </h2>
            {description && (
              <p className="mt-1.5 text-xs text-[var(--ls-muted-foreground)]">
                {description}
              </p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-3 py-1.5 text-xs font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/40"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                autoFocus
                className={
                  "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors " +
                  (destructive
                    ? "border-rose-500/40 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25"
                    : "border-emerald-400/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20")
                }
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
