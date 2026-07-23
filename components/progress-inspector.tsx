"use client";

import { animate, motion, useReducedMotion } from "motion/react";
import { useCallback, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { BarTheme } from "@/registry/default/components/progress-bar";

export type Variant = "glass" | "fancy";
export type Mode = "light" | "dark";

/* ---------- combos ---------- */

/** Three complete looks, not twelve loose colours. Each carries every value the
 *  bar can be tuned with — gradient stops, the solid it falls back to when the
 *  surface is opaque, the label pair, and the opacity that goes with them — so
 *  picking one can't land you on a combination that doesn't read.
 *
 *  Text ships in two pairs because the bar's background flips: Glass in light
 *  mode is a translucent wash over a light page, everything else is a dark
 *  surface. `onLight` is measured against that wash (#cbcbcb page at 22%
 *  surface) and clears 4.5:1 for the label and the 80%-faded percent both. */
const COMBOS = [
  {
    name: "Aurora",
    surface: { stops: ["#d7e8ff", "#e9cdff", "#ffefd6"], solid: "#18181b" },
    fill: {
      stops: ["#ac82ff", "#67dbff", "#8bff9e", "#e5e5e5"],
      solid: "#ac82ff",
    },
    text: {
      onDark: { pct: "#bbffd2", label: "#f8f8f8" },
      onLight: { pct: "#0e3a24", label: "#101013" },
    },
  },
  {
    name: "Holo",
    surface: { stops: ["#cfeaff", "#dcd2ff", "#ffd9ec"], solid: "#1b1620" },
    fill: {
      stops: ["#56daff", "#c28aff", "#ff9cc8", "#fff4a3"],
      solid: "#9fd6ef",
    },
    text: {
      onDark: { pct: "#cfe9ff", label: "#f8f8f8" },
      onLight: { pct: "#123a5c", label: "#101013" },
    },
  },
  {
    name: "Titanium",
    surface: { stops: ["#eceef2", "#e2e0ea", "#f3efe9"], solid: "#232329" },
    fill: {
      stops: ["#b9bcc9", "#d7d9e2", "#f0eee9", "#d2d2d8"],
      solid: "#d9d9e0",
    },
    text: {
      onDark: { pct: "#e6e6ea", label: "#ffffff" },
      onLight: { pct: "#2a2a30", label: "#0d0d10" },
    },
  },
];

/** The one opacity question the bar has, answered rather than sliderised. Glass
 *  in light mode needs the extra 2 points to lift the label off the page;
 *  darker than 16% in dark mode and the surface stops being glass at all.
 *  Fancy is opaque by definition. */
const OPACITY = {
  glass: { light: 0.22, dark: 0.16 },
  fancy: { light: 1, dark: 1 },
};

/* ---------- motion ---------- */

/** Three ways for the bar to reach its value, sharing the easing vocabulary of
 *  the dropdown so the page moves in one accent. Glide is the default read,
 *  Snap is for a value that's already known, Spring overshoots by a hair and
 *  settles — the only one with any bounce in it. */
export const MOTIONS = [
  { name: "Glide", spec: { duration: 1.6, ease: [0.22, 1, 0.36, 1] } },
  { name: "Snap", spec: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  {
    name: "Spring",
    spec: { type: "spring", stiffness: 90, damping: 14, mass: 1 },
  },
] as const;

export type MotionName = (typeof MOTIONS)[number]["name"];

/* ---------- primitives ---------- */

/** A preset, drawn. 28px of the actual ramp says more than its name does, so
 *  the name is only there to be read in the menu. */
function Ramp({ stops }: { stops: readonly string[] }) {
  return (
    <span
      className="h-[18px] w-7 shrink-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_0_0_1px_rgba(0,0,0,0.10)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_0_1px_rgba(255,255,255,0.16)]"
      style={{ background: `linear-gradient(90deg, ${stops.join(", ")})` }}
    />
  );
}

// Without this the trigger is just a word and nobody presses it. A filled caret
// is the one mark everyone already reads as "there's another option in here" —
// cheaper than a tooltip and it doesn't move.
const Caret = () => (
  <svg
    aria-hidden
    width="7"
    height="4"
    viewBox="0 0 7 4"
    className="opacity-45 transition-opacity group-hover:opacity-90"
  >
    <path d="M0 0h7L3.5 4z" fill="currentColor" />
  </svg>
);

const GroupLabel = ({ children }: { children: string }) => (
  <span className="pr-0.5 pl-1.5 text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
    {children}
  </span>
);

const Divider = () => <span className="mx-1 h-6 w-px shrink-0 bg-border" />;

// Same spec as the site's bottom dock: h-12, rounded-full, one border and one
// lifted shadow. Shared so the two pills can't drift apart.
const PILL =
  "flex h-12 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-border/60 bg-background px-1.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35),0_4px_12px_-4px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.05)]";

const LIFT =
  "shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35),0_4px_12px_-4px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.05)]";

/** One dropdown, two uses. The panel is a card on the same spec as the pill it
 *  drops out of: `corner-shape: squircle` for Apple's continuous curvature
 *  (Chromium honours it, everything else falls back to the plain radius), and
 *  the transitions.dev menu-dropdown timing — 250ms open / 150ms close on
 *  cubic-bezier(0.22, 1, 0.36, 1), growing from the trigger's corner. */
function Picker({
  label,
  items,
  active,
  onPick,
}: {
  label: string;
  items: { name: string; preview?: string[] }[];
  active: string;
  onPick: (name: string) => void;
}) {
  const current = items.find((i) => i.name === active);
  return (
    <>
      <GroupLabel>{label}</GroupLabel>
      <DropdownMenu>
        <DropdownMenuTrigger className="group inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-xs text-foreground/70 transition-colors hover:bg-muted hover:text-foreground data-[state=open]:bg-muted">
          {current?.preview && <Ramp stops={current.preview} />}
          {active}
          <Caret />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={8}
          className={cn(
            "min-w-[9.5rem] rounded-2xl border-border/60 bg-background p-1.5 [corner-shape:squircle]",
            LIFT,
            "duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] data-[state=closed]:duration-[150ms] data-[state=closed]:zoom-out-[0.99] data-[state=open]:zoom-in-[0.97]",
          )}
        >
          {items.map((i) => (
            <DropdownMenuItem
              key={i.name}
              onSelect={() => onPick(i.name)}
              className="cursor-pointer gap-2 rounded-xl px-2 py-1.5 text-xs [corner-shape:squircle]"
            >
              {i.preview && <Ramp stops={i.preview} />}
              <span className={cn(i.name === active && "font-medium")}>
                {i.name}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

/** Label → value, for picks with only two answers. */
export function Segmented<T>({
  options,
  value,
  onChange,
  className,
}: {
  options: Record<string, T>;
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  const current = JSON.stringify(value);
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Object.entries(options).map(([label, v]) => (
        <button
          key={label}
          onClick={() => onChange(v)}
          className={cn(
            "h-8 cursor-pointer rounded-full px-3 text-sm font-medium transition-colors",
            JSON.stringify(v) === current
              ? "bg-muted text-foreground"
              : "text-foreground/55 hover:bg-muted/60 hover:text-foreground",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/* ---------- run ---------- */

const DONE = "Progress..";
/** Trailing dots as a fixed-width slot: nbsp holds the space a missing dot
 *  would take, so the centred label doesn't shuffle as the ellipsis cycles. */
const ellipsis = (n: number) => `Progress${".".repeat(n)}${" ".repeat(2 - n)}`;

/** One animated number drives all three: the fill's width, the percentage, and
 *  the label's ellipsis — so they can't drift apart. Owns the motion preset too,
 *  since the preset is only ever a property of the run. */
export function useProgressRun(target = 83) {
  const [value, setValue] = useState(target);
  const [label, setLabel] = useState(DONE);
  const [motionName, setMotionName] = useState<MotionName>("Glide");
  const still = useReducedMotion();

  const play = useCallback(() => {
    if (still) {
      setValue(target);
      return;
    }
    const spec = MOTIONS.find((m) => m.name === motionName)!.spec;
    animate(0, target, {
      ...spec,
      onUpdate: (v) => {
        setValue(v);
        // Three cycles over the run: fast enough to read as working, slow
        // enough not to strobe.
        setLabel(ellipsis(Math.floor((v / target) * 9) % 3));
      },
      onComplete: () => setLabel(DONE),
    });
  }, [still, target, motionName]);

  return { value, label, play, motionName, setMotionName };
}

export type Run = ReturnType<typeof useProgressRun>;

/* ---------- bar ---------- */

/** Two floating pills: what the demo is doing on one, what the theme is on the
 *  other. Four controls total — the look, the run, the combo, the motion — and
 *  every one of them is a pick from three or fewer. */
export default function ProgressInspector({
  theme,
  onChange,
  variant,
  onVariantChange,
  mode,
  run,
  className,
}: {
  theme: BarTheme;
  onChange: (t: BarTheme) => void;
  variant: Variant;
  onVariantChange: (v: Variant) => void;
  mode: Mode;
  run?: Run;
  className?: string;
}) {
  const still = useReducedMotion();

  // Glass over the light page is the only place the bar sits on something
  // light; everywhere else the surface is a near-black.
  const onLight = variant === "glass" && mode === "light";

  const applyCombo = (name: string) => {
    const c = COMBOS.find((x) => x.name === name)!;
    onChange({
      ...theme,
      surface: { ...theme.surface, ...c.surface },
      fill: { ...theme.fill, ...c.fill },
      surfaceOpacity: OPACITY[variant][mode],
      text: onLight ? c.text.onLight : c.text.onDark,
    });
  };

  // A hand-edited theme still has to say something honest in the trigger, so
  // the match is on the stops the bar is actually painting with.
  const combo =
    COMBOS.find((c) => c.fill.stops.join() === theme.fill.stops.join())?.name ??
    "Custom";

  // Settles in from just below, the way the dock does — enough to say "these are
  // controls, they arrived" without holding anything up. One pass on mount; the
  // pills are otherwise still, so the colours are the only moving parts.
  return (
    <motion.div
      initial={still ? false : { opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      // One line, always: the pills are a dock, and a dock that reflows to two
      // rows moves the controls out from under the cursor. `w-max` lets the row
      // stay its natural width and overflow a narrower column rather than wrap.
      className={cn("flex w-max items-center justify-center gap-2", className)}
    >
      <div className={PILL}>
        <Segmented
          options={{ Glass: "glass", Fancy: "fancy" } as const}
          value={variant}
          onChange={onVariantChange}
        />
        <Divider />
        {run && (
          <button
            onClick={run.play}
            className="group inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
          >
            <svg
              aria-hidden
              width="8"
              height="9"
              viewBox="0 0 8 9"
              className="opacity-60 transition-opacity group-hover:opacity-100"
            >
              <path d="M0 0l8 4.5L0 9z" fill="currentColor" />
            </svg>
            Animate
          </button>
        )}
      </div>

      <div className={PILL}>
        <Picker
          label="Theme"
          // The fill is the one saturated thing in the component, so it's what
          // the chip previews — the surface reads as grey at 28px either way.
          items={COMBOS.map((c) => ({ name: c.name, preview: c.fill.stops }))}
          active={combo}
          onPick={applyCombo}
        />
        {run && (
          <>
            <Divider />
            <Picker
              label="Motion"
              items={MOTIONS.map((m) => ({ name: m.name }))}
              active={run.motionName}
              onPick={(n) => run.setMotionName(n as MotionName)}
            />
          </>
        )}
      </div>
    </motion.div>
  );
}
