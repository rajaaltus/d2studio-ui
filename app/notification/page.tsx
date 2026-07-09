"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check } from "lucide-react";
import { ChatFill, EnvelopeFill, RocketFill } from "@/components/icons/activity-icons";
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

/* Premium metallic text: top-lit light→dim gradient clipped to the glyphs. */
const METAL = "text-transparent bg-clip-text";
const metalStyle = {
  backgroundImage:
    "linear-gradient(180deg, oklch(72% 0.005 17.3) 0%, oklch(45% 0.008 17.3) 100%)",
};

/* Dot-matrix texture (same 4.95px sheet as the hero glow). */
const DOT_SIZE = "4.95px 4.95px";
const DOT_IMAGE =
  "radial-gradient(circle, rgba(128,128,128,0.5) 0.7px, transparent 0.88px)";
const DOT_MASK = "radial-gradient(circle, #000 0.6px, transparent 0.78px)";
/* Colored glow uses the same fine dot as the frame — subtle, not chunky. */
const GLOW_MASK = DOT_MASK;

/* Neutral gray dot frame, optionally masked to just the card edges. */
function dotFrame(mask: string | undefined) {
  return {
    backgroundImage: DOT_IMAGE,
    backgroundSize: DOT_SIZE,
    ...(mask ? { WebkitMaskImage: mask, maskImage: mask } : {}),
  };
}

/* Colored light that shows THROUGH the dots only: the glow radial is the paint,
   the dot grid is the mask — so the color lands on the dots, not the gaps. */
function glowDots(glow: string) {
  return {
    backgroundImage: glow,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    WebkitMaskImage: GLOW_MASK,
    maskImage: GLOW_MASK,
    WebkitMaskSize: DOT_SIZE,
    maskSize: DOT_SIZE,
  };
}

const BLUE_GLOW =
  "radial-gradient(55% 65% at 20% 22%, rgba(38,96,255,0.5) 0%, transparent 70%)";
const ORANGE_GLOW =
  "radial-gradient(75% 55% at 50% 114%, rgba(255,122,61,0.5) 0%, transparent 72%)";

/* Hollow the gray frame out of the center so text sits on a clean field. */
const PATTERN_MASK =
  "radial-gradient(78% 78% at 50% 50%, transparent 32%, #000 82%)";

/* Bezel frame: outer translucent layer with a 24px gap to the inner card. */
const FRAME =
  "group relative rounded-[28px] p-1.5 bg-black/[0.045] dark:bg-white/[0.06]";

/** Framed card: bezel + inner content card, hover lift, holographic top edge. */
function Card({
  className,
  innerClassName,
  dotMask = PATTERN_MASK,
  dotGlows,
  children,
}: {
  className?: string;
  innerClassName?: string;
  dotMask?: string;
  dotGlows?: string[];
  children: React.ReactNode;
}) {
  return (
    <motion.section variants={rise} className={cn(FRAME, className)}>
      <div className="group relative h-full overflow-hidden rounded-[20px] border border-black/[0.05] bg-white shadow-[0_1px_2px_rgba(20,20,40,0.04)] dark:border-white/[0.06] dark:bg-[#060606]">
        {/* Masked pattern sits on its own layers so it never clips the content. */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={dotFrame(dotMask)} />
        {dotGlows?.map((glow, i) => (
          <div
            key={i}
            aria-hidden
            className="glow-dots pointer-events-none absolute inset-0 opacity-45 transition-opacity duration-500"
            style={glowDots(glow)}
          />
        ))}
        <div aria-hidden className="hero-smoke absolute inset-0 rounded-[20px]" />
        <div className={cn("relative flex h-full flex-col p-5", innerClassName)}>{children}</div>
      </div>
    </motion.section>
  );
}

const activity = [
  { icon: ChatFill, title: "New comment on Bento layout", meta: "Priya · 2m", tint: "text-violet-500" },
  { icon: RocketFill, title: "Deploy shipped to production", meta: "Vercel · 18m", tint: "text-emerald-500" },
  { icon: EnvelopeFill, title: "3 messages from your team", meta: "Inbox · 1h", tint: "text-sky-500" },
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

      {/* Hover-effect switcher */}
      <div className="relative z-10 inline-flex rounded-full border border-black/10 bg-white/70 p-0.5 text-xs font-medium backdrop-blur dark:border-white/10 dark:bg-white/5">
        {HOVER_MODES.map((m) => (
          <button
            key={m.id}
            type="button"
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

      <motion.div
        data-hover={mode}
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto grid w-full max-w-4xl grid-cols-1 gap-3 lg:grid-cols-3 lg:auto-rows-[256px]"
      >
        {/* 1 — Hero: framed, swaps light/dark by theme */}
        <motion.section variants={rise} className={cn(FRAME, "lg:row-span-2")}>
          <NotificationCard className="h-full w-full rounded-[20px] shadow-none dark:hidden" />
          <NotificationCardDark className="hidden h-full w-full rounded-[20px] dark:flex" />
          <div aria-hidden className="hero-smoke absolute inset-1.5 overflow-hidden rounded-[20px]" />
        </motion.section>

        {/* 2 — Recent activity, wide */}
        <Card className="lg:col-span-2" innerClassName="p-6" dotGlows={[BLUE_GLOW, ORANGE_GLOW]}>
          <div className="mb-2 flex items-baseline justify-between">
            <h3 className={cn("text-[15px] font-semibold dark:text-white", METAL)} style={metalStyle}>Recent activity</h3>
            <span className="text-xs font-medium text-neutral-400">Today</span>
          </div>
          <motion.ul variants={container} className="space-y-0.5">
            {activity.map(({ icon: Icon, title, meta, tint }) => (
              <motion.li
                key={title}
                variants={rise}
                className="flex items-center gap-3 rounded-2xl px-2.5 py-2 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/5"
              >
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-50 shadow-sm dark:bg-neutral-800", tint)}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-800 dark:text-neutral-100">{title}</span>
                <span className="shrink-0 text-xs tabular-nums text-neutral-400">{meta}</span>
              </motion.li>
            ))}
          </motion.ul>
        </Card>

        {/* 3 — Unread stat */}
        <Card
          className="bright-glow"
          innerClassName="justify-center p-6"
          dotGlows={[
            "radial-gradient(75% 80% at 50% 50%, rgba(38,96,255,0.5) 0%, transparent 72%)",
          ]}
        >
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-500">
            <ArrowUpRight className="h-3.5 w-3.5" />
            12% this week
          </div>
          <div
            className={cn("mt-2 text-8xl font-semibold tracking-tight tabular-nums", METAL)}
            style={{
              backgroundImage:
                "linear-gradient(180deg, oklch(18.67% 0 90) 0%, oklch(84.21% 0 90) 100%)",
            }}
          >
            29
          </div>
          <div className="mt-1 text-sm font-medium text-neutral-500 dark:text-neutral-400">Unread notifications</div>
        </Card>

        {/* 4 — Delivery channels */}
        <Card
          className="bright-glow"
          innerClassName="p-6"
          dotGlows={["radial-gradient(80% 80% at 50% 55%, rgba(255,122,61,0.5) 0%, transparent 72%)"]}
        >
          <h3 className={cn("text-[15px] font-semibold dark:text-white", METAL)} style={metalStyle}>Delivery</h3>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">Where you get notified</p>
          <Channels />
        </Card>
      </motion.div>
    </main>
  );
}
