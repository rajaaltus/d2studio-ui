"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, GitMerge, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import NotificationCard from "@/components/notification-card";
import NotificationCardDark from "@/components/notification-card-dark";
import { cn } from "@/lib/utils";

/* Emil: strong ease-out curve — the built-in easings lack punch. */
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const rise = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

/* Bezel frame: outer translucent layer with a 24px gap to the inner card. */
const FRAME =
  "group relative rounded-[28px] p-2 bg-black/[0.045] dark:bg-white/[0.06]";

/** Framed card: bezel + inner content card, hover lift, holographic top edge. */
function Card({
  className,
  innerClassName,
  interactive = true,
  children,
}: {
  className?: string;
  innerClassName?: string;
  interactive?: boolean;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      variants={rise}
      whileHover={interactive && !reduce ? { y: -4 } : undefined}
      transition={{ duration: 0.2, ease: EASE_OUT }}
      className={cn(FRAME, className)}
    >
      {interactive && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-10 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "var(--d2-blue-gradient)" }}
        />
      )}
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-[20px] border border-black/[0.05] bg-white p-5",
          "shadow-[0_1px_2px_rgba(20,20,40,0.04)] dark:border-white/[0.06] dark:bg-neutral-900",
          innerClassName
        )}
      >
        {children}
      </div>
    </motion.section>
  );
}

const activity = [
  { icon: MessageSquare, title: "New comment on Bento layout", meta: "Priya · 2m", tint: "text-violet-500" },
  { icon: GitMerge, title: "Deploy shipped to production", meta: "Vercel · 18m", tint: "text-emerald-500" },
  { icon: Mail, title: "3 messages from your team", meta: "Inbox · 1h", tint: "text-sky-500" },
];

function Channels() {
  const [on, setOn] = useState({ Push: true, Email: true, SMS: false });
  const reduce = useReducedMotion();
  return (
    <ul className="mt-3 space-y-0.5">
      {(Object.keys(on) as Array<keyof typeof on>).map((label) => (
        <li key={label}>
          <button
            type="button"
            onClick={() => setOn((s) => ({ ...s, [label]: !s[label] }))}
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-black/[0.03] active:scale-[0.99] dark:hover:bg-white/5"
            style={{ transition: "transform 140ms cubic-bezier(0.23,1,0.32,1), background-color 140ms" }}
            aria-pressed={on[label]}
          >
            <span className="flex-1 text-sm font-medium text-neutral-700 dark:text-neutral-200">{label}</span>
            <motion.span
              layout={!reduce}
              transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full",
                on[label] ? "bg-[#f23b3b] text-white" : "bg-neutral-200 text-transparent dark:bg-neutral-700"
              )}
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </motion.span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function NotificationPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-100 p-6 sm:p-10 dark:bg-neutral-950">
      {/* Ambient brand wash — fills the whole section behind the bento */}
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

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto grid w-full max-w-4xl grid-cols-1 gap-5 lg:grid-cols-3 lg:auto-rows-[256px]"
      >
        {/* 1 — Hero: framed, swaps light/dark by theme */}
        <motion.section
          variants={rise}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          className={cn(FRAME, "lg:row-span-2")}
        >
          <NotificationCard className="h-full w-full rounded-[20px] shadow-none dark:hidden" />
          <NotificationCardDark className="hidden h-full w-full rounded-[20px] dark:flex" />
        </motion.section>

        {/* 2 — Recent activity, wide */}
        <Card className="lg:col-span-2" innerClassName="p-6">
          <div className="mb-2 flex items-baseline justify-between">
            <h3 className="text-[15px] font-semibold text-neutral-900 dark:text-white">Recent activity</h3>
            <span className="text-xs font-medium text-neutral-400">Today</span>
          </div>
          <motion.ul variants={container} className="space-y-0.5">
            {activity.map(({ icon: Icon, title, meta, tint }) => (
              <motion.li
                key={title}
                variants={rise}
                className="flex items-center gap-3 rounded-2xl px-2.5 py-2 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/5"
              >
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-50 shadow-sm dark:bg-neutral-800", tint)}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-800 dark:text-neutral-100">{title}</span>
                <span className="shrink-0 text-xs tabular-nums text-neutral-400">{meta}</span>
              </motion.li>
            ))}
          </motion.ul>
        </Card>

        {/* 3 — Unread stat */}
        <Card innerClassName="justify-center p-6">
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-500">
            <ArrowUpRight className="h-3.5 w-3.5" />
            12% this week
          </div>
          <div className="mt-2 text-5xl font-semibold tracking-tight tabular-nums text-neutral-900 dark:text-white">29</div>
          <div className="mt-1 text-sm font-medium text-neutral-500 dark:text-neutral-400">Unread notifications</div>
        </Card>

        {/* 4 — Delivery channels */}
        <Card innerClassName="p-6">
          <h3 className="text-[15px] font-semibold text-neutral-900 dark:text-white">Delivery</h3>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">Where you get notified</p>
          <Channels />
        </Card>
      </motion.div>
    </main>
  );
}
