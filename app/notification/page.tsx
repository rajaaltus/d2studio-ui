"use client";

import { useState } from "react";
import NotificationBento from "@/registry/default/components/notification-bento";
import { cn } from "@/lib/utils";
import "./hover-modes.css";

const HOVER_MODES = [
  { id: "powerup", label: "Power Up" },
  { id: "aurora", label: "Aurora" },
  { id: "combo", label: "Combo" },
] as const;
type HoverMode = (typeof HOVER_MODES)[number]["id"];

export default function NotificationPage() {
  const [mode, setMode] = useState<HoverMode>("combo");
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-neutral-100 p-6 sm:p-10 dark:bg-neutral-950">
      {/* Ambient brand wash behind the bento */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-40"
        style={{
          background:
            "radial-gradient(60% 55% at 28% 32%, rgba(120,92,255,0.20), transparent 60%)," +
            "radial-gradient(55% 55% at 78% 40%, rgba(255,104,58,0.18), transparent 60%)," +
            "radial-gradient(70% 60% at 50% 100%, rgba(220,40,175,0.10), transparent 65%)",
        }}
      />

      <div
        role="radiogroup"
        aria-label="Hover effect"
        className="relative z-10 inline-flex rounded-full border border-black/10 bg-white/70 p-0.5 text-xs font-medium backdrop-blur dark:border-white/10 dark:bg-white/5"
      >
        {HOVER_MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={mode === m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              "rounded-full px-3.5 py-1.5 transition-colors",
              mode === m.id
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div data-hover={mode} className="relative w-full">
        <NotificationBento />
      </div>
    </main>
  );
}
