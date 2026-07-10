"use client";

import { ArrowUpRight, Check } from "lucide-react";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

const UNREAD = 29;

/* Strong ease-out curve — the built-in easings lack punch. */
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
const METAL_TEXT = "bg-clip-text text-transparent dark:text-white dark:bg-none";
const metalTextStyle = {
  backgroundImage:
    "linear-gradient(180deg, oklch(72% 0.005 17.3) 0%, oklch(45% 0.008 17.3) 100%)",
};

/* One dot sheet for the whole block: 4.95px pitch, sub-pixel dots. */
const DOT_SIZE = "4.95px 4.95px";
const DOT_IMAGE =
  "radial-gradient(circle, rgba(128,128,128,0.5) 0.7px, transparent 0.88px)";
const DOT_MASK = "radial-gradient(circle, #000 0.6px, transparent 0.78px)";

/* Hollow the gray frame out of the center so text sits on a clean field. */
const PATTERN_MASK =
  "radial-gradient(78% 78% at 50% 50%, transparent 32%, #000 82%)";

const BLUE_GLOW =
  "radial-gradient(55% 65% at 20% 22%, rgba(38,96,255,0.5) 0%, transparent 70%)";
const ORANGE_GLOW =
  "radial-gradient(75% 55% at 50% 114%, rgba(255,122,61,0.5) 0%, transparent 72%)";

/* Bezel frame: outer translucent layer with a 6px gap to the inner card. */
const FRAME = "relative rounded-[28px] bg-black/[0.045] p-1.5 dark:bg-white/[0.06]";

/* Undirected organic drift — mostly a slow rise with a slight sideways wander,
   so the smoke reads as real rather than a sweep in one direction. */
const DRIFT = { maskPosition: ["46% 74%", "54% 30%", "46% 74%"] };
const DRIFT_TRANSITION = {
  duration: 20,
  ease: "easeInOut",
  repeat: Infinity,
} as const;

/**
 * Motion's hover gesture, unlike CSS `:hover`, ignores the fake hover events
 * browsers emulate from a tap — so nothing latches on phones and tablets.
 * Returns the state plus the props to spread onto a `motion` element.
 */
function useHover() {
  const [hovered, setHovered] = React.useState(false);
  return {
    hovered,
    hoverProps: {
      "data-hovered": hovered,
      onHoverStart: () => setHovered(true),
      onHoverEnd: () => setHovered(false),
    },
  };
}

/** Drifting holographic fog. Colors and opacity come from CSS (theme-dependent). */
function Smoke({ hovered, className }: { hovered: boolean; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={cn("d2-smoke", className)}
      animate={hovered && !reduce ? DRIFT : {}}
      transition={DRIFT_TRANSITION}
    />
  );
}

/* Colored light that shows THROUGH the dots only: the glow radial is the paint,
   the dot grid is the mask — so the color lands on the dots, not the gaps. */
function glowDotStyle(glow: string): React.CSSProperties {
  return {
    backgroundImage: glow,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    WebkitMaskImage: DOT_MASK,
    maskImage: DOT_MASK,
    WebkitMaskSize: DOT_SIZE,
    maskSize: DOT_SIZE,
  };
}

// ---------------------------------------------------------------------------
// Bell — pure CSS, no SVG. Geometry is expressed in percentages of the original
// 218 x 228 design box, so it scales with the container.
// ---------------------------------------------------------------------------

const BELL_METAL = "#575757 0%, #A4A4A4 50%, #F1F1F1 100%";
const BELL_ARC = "rgba(50,43,43,0.2)";

/* The bell silhouette as percentages of the 218x176 body box — the same beziers
   as the source SVG path. shape() scales with the box; clip-path: path() would not. */
const BELL_SHAPE = `shape(
  from 98.943% 92.362%,
  curve to 84.537% 57.188% with 91.535% 83.178% / 84.537% 74.503%,
  vline to 42.812%,
  curve to 50% 0% with 84.537% 19.205% / 69.044% 0%,
  curve to 15.463% 42.812% with 30.956% 0% / 15.463% 19.205%,
  vline to 57.188%,
  curve to 1.057% 92.362% with 15.463% 74.503% / 8.466% 83.178%,
  curve to 0.275% 97.238% with 0.025% 93.642% / -0.284% 95.567%,
  curve to 3.609% 100% with 0.834% 98.910% / 2.150% 100%,
  hline to 96.391%,
  curve to 99.725% 97.238% with 97.850% 100% / 99.167% 98.910%,
  curve to 98.943% 92.362% with 100.284% 95.567% / 99.975% 93.642%,
  close
)`;

/** Brushed-metal bell blooming up from its base, with knob and clapper. */
function Bell({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("relative", className)}
      style={{ aspectRatio: "218 / 228", containerType: "size" }}
    >
      {/* Knob — half-disc bulging up over the dome */}
      <div
        className="absolute"
        style={{
          left: "40.367%",
          top: "0.877%",
          width: "19.266%",
          height: "9.211%",
          borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
          backgroundImage: `linear-gradient(180deg, #E0E0E0, ${BELL_ARC})`,
        }}
      />
      {/* Body — one slab clipped to the bell path, lit from the lower left */}
      <div
        className="absolute"
        style={{
          left: 0,
          top: "12.281%",
          width: "100%",
          height: "77.193%",
          clipPath: BELL_SHAPE,
          backgroundImage: `radial-gradient(circle 69.725cqw at 43.119% 100%, ${BELL_METAL})`,
        }}
      />
      {/* Clapper — half-disc hanging below the rim */}
      <div
        className="absolute"
        style={{
          left: "39.450%",
          top: "89.474%",
          width: "21.101%",
          height: "10.088%",
          borderRadius: "0 0 50% 50% / 0 0 100% 100%",
          backgroundImage: `linear-gradient(180deg, ${BELL_ARC}, #E0E0E0)`,
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero card
// ---------------------------------------------------------------------------

/**
 * Ambient backdrop for the hero card: a dot-matrix sheet masked to three
 * ellipses, lit from behind by blurred color discs (blue left, warm right).
 */
function HeroGlow({ light }: { light: boolean }) {
  const dotMask =
    "radial-gradient(52% 44% at 22% 27%, #000 15%, transparent 80%)," +
    "radial-gradient(48% 42% at 70% 45%, #000 15%, transparent 80%)," +
    "radial-gradient(80% 55% at 50% 104%, #000 8%, transparent 72%)";
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        className="absolute rounded-full"
        style={{
          left: "-2%",
          top: "4%",
          width: "51%",
          aspectRatio: "1",
          background: light
            ? "radial-gradient(circle, #4B6EF5 0%, transparent 66%)"
            : "#2660FF",
          filter: "blur(44px)",
          opacity: light ? 0.6 : 0.32,
          mixBlendMode: light ? "multiply" : "plus-lighter",
        }}
      />
      {!light && (
        /* Second blue disc — builds up the blue shade behind the ring */
        <div
          className="absolute rounded-full"
          style={{
            left: "8%",
            top: "16%",
            width: "51%",
            aspectRatio: "1",
            background: "#2660FF",
            filter: "blur(44px)",
            opacity: 0.29,
            mixBlendMode: "plus-lighter",
          }}
        />
      )}
      <div
        className="absolute rounded-full"
        style={{
          left: "50%",
          top: "24%",
          width: "31%",
          aspectRatio: "1",
          background: light
            ? "radial-gradient(circle, #FF7A3D 0%, transparent 66%)"
            : "linear-gradient(135deg, #FF6A00 0%, #EB581E 100%)",
          filter: "blur(40px)",
          opacity: light ? 0.55 : 0.42,
          mixBlendMode: light ? "multiply" : "plus-lighter",
        }}
      />
      {/* Dot matrix — one crisp CSS sheet (no image scaling / moiré), revealed
          only where the lights are, and tinted by them. */}
      <div
        className={cn(
          "d2-hero-dots absolute inset-0 transition-opacity duration-500",
          light ? "opacity-[0.55]" : "opacity-50"
        )}
        style={{
          backgroundImage: `radial-gradient(circle, ${
            light ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.6)"
          } 0.6px, transparent 0.78px)`,
          backgroundSize: DOT_SIZE,
          mixBlendMode: light ? "multiply" : "plus-lighter",
          WebkitMaskImage: dotMask,
          maskImage: dotMask,
        }}
      />
    </div>
  );
}

/** Hero card: bell on a lit dot field. `light` and `dark` are separate looks. */
function HeroCard({ light, className }: { light: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-center overflow-hidden rounded-[20px]",
        light ? "bg-white" : "bg-[#060606]",
        className
      )}
    >
      <HeroGlow light={light} />

      <div className="relative flex aspect-square w-full items-center justify-center">
        {light ? (
          <div
            aria-hidden
            className="absolute aspect-square w-[54%] rounded-full border border-black/[0.06]"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.75) 55%, transparent 100%)",
            }}
          />
        ) : (
          <>
            {/* Halo behind the ring — a blurred annulus masked out of a gradient
                disc. Blur lives on the parent: on one element the mask would
                clip the bleed away. */}
            <div
              aria-hidden
              className="absolute aspect-square w-[54%]"
              style={{ filter: "blur(5px)", mixBlendMode: "plus-lighter" }}
            >
              <div
                className="h-full w-full rounded-full"
                style={{
                  backgroundImage: "linear-gradient(135deg, #086FED, #CF5F1A)",
                  /* stroke r=43.5 w=13 spans 37..50 of a 50-radius disc → inner edge at 74% */
                  mask: "radial-gradient(farthest-side, transparent 74%, #000 74.5%)",
                  WebkitMask:
                    "radial-gradient(farthest-side, transparent 74%, #000 74.5%)",
                }}
              />
            </div>
            {/* Ring — near-black disc with a gradient-stroked rim */}
            <div
              aria-hidden
              className="absolute aspect-square w-[54%] rounded-full border-[1.5px] border-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(#080808, #080808), " +
                  "linear-gradient(135deg, #81B3FF, rgba(125,92,128,0.3) 50%, #EB581E)",
                backgroundOrigin: "padding-box, border-box",
                backgroundClip: "padding-box, border-box",
              }}
            />
          </>
        )}

        <div className={cn("relative", light ? "w-[30%]" : "w-[27%]")}>
          <Bell
            className={cn(
              "h-auto w-full",
              light
                ? "drop-shadow-[0_10px_24px_rgba(90,80,150,0.28)]"
                : "drop-shadow-[0_12px_30px_rgba(40,90,220,0.35)]"
            )}
          />
          <span className="absolute -top-2 -right-3 flex h-8 min-w-8 items-center justify-center rounded-full bg-gradient-to-b from-[#ff5f36] to-[#d1350c] px-1.5 text-sm font-semibold text-white shadow-[0_6px_14px_rgba(209,53,12,0.45)]">
            {UNREAD}
          </span>
        </div>
      </div>

      {/* Fade the texture out under the caption for legibility */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0",
          light
            ? "h-1/3 bg-gradient-to-t from-white via-white/80 to-transparent"
            : "h-1/4 bg-gradient-to-t from-[#060606]/70 to-transparent"
        )}
      />
      <p
        className={cn(
          "relative px-8 pb-9 text-center text-lg leading-snug font-medium",
          light ? "text-[#3f3f4c]" : "text-white/60"
        )}
      >
        Keep up to date with any changes by receiving instant notifications.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Framed card
// ---------------------------------------------------------------------------

/** Bezel + inner card, with the dot frame, colored dot glows and hover smoke. */
function Card({
  className,
  innerClassName,
  glows,
  children,
}: {
  className?: string;
  innerClassName?: string;
  glows?: string[];
  children: React.ReactNode;
}) {
  const { hovered, hoverProps } = useHover();
  return (
    <motion.section variants={rise} className={cn(FRAME, className)}>
      <motion.div
        {...hoverProps}
        className="relative h-full overflow-hidden rounded-[20px] border border-black/[0.05] bg-white shadow-[0_1px_2px_rgba(20,20,40,0.04)] dark:border-white/[0.06] dark:bg-[#060606]"
      >
        {/* Pattern layers sit behind the content so they never clip it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: DOT_IMAGE,
            backgroundSize: DOT_SIZE,
            WebkitMaskImage: PATTERN_MASK,
            maskImage: PATTERN_MASK,
          }}
        />
        {glows?.map((glow) => (
          <div
            key={glow}
            aria-hidden
            className="d2-dots pointer-events-none absolute inset-0 opacity-45"
            style={glowDotStyle(glow)}
          />
        ))}
        <Smoke hovered={hovered} className="absolute inset-0 rounded-[20px]" />
        <div className={cn("relative flex h-full flex-col p-5", innerClassName)}>
          {children}
        </div>
      </motion.div>
    </motion.section>
  );
}

// ---------------------------------------------------------------------------
// Panels
// ---------------------------------------------------------------------------

type IconProps = React.SVGProps<SVGSVGElement>;

/* Filled icons inlined from Iconify (Lets Icons + Phosphor, both MIT).
   currentColor fill → each row picks up its own tint. */
function ChatFill(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3a9 9 0 0 0 0 18h4.5c1.398 0 2.097 0 2.648-.228a3 3 0 0 0 1.624-1.624C21 18.597 21 17.898 21 16.5V12a9 9 0 0 0-9-9m-4 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1m3 4a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1"
      />
    </svg>
  );
}

function RocketFill(props: IconProps) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden {...props}>
      <path d="M101.85 191.14C97.34 201 82.29 224 40 224a8 8 0 0 1-8-8c0-42.29 23-57.34 32.86-61.85a8 8 0 0 1 6.64 14.56c-6.43 2.93-20.62 12.36-23.12 38.91c26.55-2.5 36-16.69 38.91-23.12a8 8 0 1 1 14.56 6.64m122-144a16 16 0 0 0-15-15c-12.58-.75-44.73.4-71.4 27.07L88 108.7a8 8 0 0 1-11.33-11.31l26.56-26.57a4 4 0 0 0-2.82-6.82H74.35A15.9 15.9 0 0 0 63 68.68L28.7 103a16 16 0 0 0 9.07 27.16l38.47 5.37l44.21 44.21l5.37 38.49a15.94 15.94 0 0 0 10.78 12.92a16.1 16.1 0 0 0 5.1.83a15.9 15.9 0 0 0 11.3-4.68l34.32-34.3a16 16 0 0 0 4.68-11.35v-26.06a4 4 0 0 0-6.83-2.82l-26.57 26.56a8 8 0 0 1-11.71-.42a8.2 8.2 0 0 1 .6-11.1l49.27-49.27c26.69-26.68 27.84-58.83 27.09-71.42Z" />
    </svg>
  );
}

function EnvelopeFill(props: IconProps) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden {...props}>
      <path d="M224 48H32a8 8 0 0 0-8 8v136a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a8 8 0 0 0-8-8M98.71 128L40 181.81V74.19Zm11.84 10.85l12 11.05a8 8 0 0 0 10.82 0l12-11.05l58 53.15H52.57ZM157.29 128L216 74.18v107.64Z" />
    </svg>
  );
}

const activity = [
  { icon: ChatFill, title: "New comment on Bento layout", meta: "Priya · 2m", tint: "text-violet-500" },
  { icon: RocketFill, title: "Deploy shipped to production", meta: "Vercel · 18m", tint: "text-emerald-500" },
  { icon: EnvelopeFill, title: "3 messages from your team", meta: "Inbox · 1h", tint: "text-sky-500" },
];

const CHANNELS = ["Push", "Email", "SMS"] as const;

function Channels() {
  const [on, setOn] = React.useState<Record<string, boolean>>({
    Push: true,
    Email: true,
    SMS: false,
  });
  return (
    <ul className="mt-3 space-y-0.5">
      {CHANNELS.map((label) => (
        <li key={label}>
          <button
            type="button"
            onClick={() => setOn((s) => ({ ...s, [label]: !s[label] }))}
            aria-pressed={on[label]}
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-black/[0.03] active:scale-[0.99] dark:hover:bg-white/5"
          >
            <span className="flex-1 text-sm font-medium text-neutral-700 dark:text-neutral-200">
              {label}
            </span>
            <motion.span
              aria-hidden
              layout
              transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full",
                on[label]
                  ? "bg-[#f23b3b] text-white"
                  : "bg-neutral-200 text-transparent dark:bg-neutral-700"
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

// ---------------------------------------------------------------------------

/** Notification bento: hero bell, recent activity, unread stat, delivery channels. */
export default function NotificationBento({ className }: { className?: string }) {
  const hero = useHover();
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={cn(
          "mx-auto grid w-full max-w-4xl grid-cols-1 gap-3 lg:auto-rows-[256px] lg:grid-cols-3",
          className
        )}
      >
        {/* Hero — light and dark are distinct treatments, swapped by theme */}
        <motion.section variants={rise} {...hero.hoverProps} className={cn(FRAME, "lg:row-span-2")}>
          <HeroCard light className="h-full w-full shadow-none dark:hidden" />
          <HeroCard light={false} className="hidden h-full w-full dark:flex" />
          <Smoke
            hovered={hero.hovered}
            className="absolute inset-1.5 overflow-hidden rounded-[20px]"
          />
        </motion.section>

        {/* Recent activity */}
        <Card className="lg:col-span-2" innerClassName="p-6" glows={[BLUE_GLOW, ORANGE_GLOW]}>
          <div className="mb-2 flex items-baseline justify-between">
            <h3 className={cn("text-[15px] font-semibold", METAL_TEXT)} style={metalTextStyle}>
              Recent activity
            </h3>
            <span className="text-xs font-medium text-neutral-400">Today</span>
          </div>
          <motion.ul variants={container} className="space-y-0.5">
            {activity.map(({ icon: Icon, title, meta, tint }) => (
              <motion.li
                key={title}
                variants={rise}
                className="flex items-center gap-3 rounded-2xl px-2.5 py-2 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/5"
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-50 shadow-sm dark:bg-neutral-800",
                    tint
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-800 dark:text-neutral-100">
                  {title}
                </span>
                <span className="shrink-0 text-xs tabular-nums text-neutral-400">{meta}</span>
              </motion.li>
            ))}
          </motion.ul>
        </Card>

        {/* Unread stat */}
        <Card
          className="d2-bright"
          innerClassName="justify-center p-6"
          glows={["radial-gradient(75% 80% at 50% 50%, rgba(38,96,255,0.5) 0%, transparent 72%)"]}
        >
          <p className="flex items-center gap-1 text-xs font-medium text-emerald-500">
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            12% this week
          </p>
          <p
            className="mt-2 bg-clip-text text-8xl font-semibold tracking-tight text-transparent tabular-nums"
            style={{
              backgroundImage:
                "linear-gradient(180deg, oklch(18.67% 0 90) 0%, oklch(84.21% 0 90) 100%)",
            }}
          >
            {UNREAD}
          </p>
          <p className="mt-1 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Unread notifications
          </p>
        </Card>

        {/* Delivery channels */}
        <Card
          className="d2-bright"
          innerClassName="p-6"
          glows={["radial-gradient(80% 80% at 50% 55%, rgba(255,122,61,0.5) 0%, transparent 72%)"]}
        >
          <h3 className={cn("text-[15px] font-semibold", METAL_TEXT)} style={metalTextStyle}>
            Delivery
          </h3>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            Where you get notified
          </p>
          <Channels />
        </Card>
      </motion.div>
    </MotionConfig>
  );
}
