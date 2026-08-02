"use client";

import {
  animate,
  type AnimationPlaybackControls,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { useCallback, useRef, useState } from "react";
import * as Rdx from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  type BarTheme,
  toOklch,
} from "@/registry/default/components/progress-bar";

export type Variant = "glass" | "fancy";
export type Fill = "beam" | "matrix";
export type Chrome = "full" | "bar" | "plain";
export type Mode = "light" | "dark";

/* ---------- combos ---------- */

/** Three complete looks, not twelve loose colours. Each carries every value the
 *  bar can be tuned with — gradient stops, the solid it falls back to when the
 *  surface is opaque, the label pair, and the opacity that goes with them — so
 *  picking one can't land you on a combination that doesn't read.
 *
 *  Surface, fill and text all ship per mode because the bar follows the page:
 *  on a light page Glass is a translucent wash and Fancy a near-white card, on
 *  a dark one both are near-black. The light ramps are the same hues dropped in
 *  lightness — a ramp that fades out into white on a dark surface fades into
 *  nothing on a light one. Text is measured against the darker light surface
 *  (#cbcbcb page at 22%) and clears 4.5:1 for the label and the 80%-faded
 *  percent both — the near-white card is only easier. */
export const COMBOS = [
  {
    name: "Aurora",
    surface: {
      stops: ["#d7e8ff", "#e9cdff", "#ffefd6"],
      solid: { light: "#fbfcff", dark: "#18181b" },
    },
    fill: {
      mode: "gradient" as const,
      stops: {
        light: ["#8b5cf6", "#06b6d4", "#22c55e", "#c2c6d1"],
        dark: ["#ac82ff", "#67dbff", "#8bff9e", "#e5e5e5"],
      },
      solid: { light: "#8b5cf6", dark: "#ac82ff" },
    },
    text: {
      onDark: { pct: "#bbffd2", label: "#f8f8f8" },
      onLight: { pct: "#0e3a24", label: "#101013" },
    },
  },
  {
    name: "Holo",
    surface: {
      stops: ["#cfeaff", "#dcd2ff", "#ffd9ec"],
      solid: { light: "#fdfaff", dark: "#1b1620" },
    },
    fill: {
      mode: "gradient" as const,
      stops: {
        light: ["#22c5e8", "#a855f7", "#ff5fa2", "#f5b81f"],
        dark: ["#56daff", "#c28aff", "#ff9cc8", "#fff4a3"],
      },
      solid: { light: "#1ba7d1", dark: "#9fd6ef" },
    },
    text: {
      onDark: { pct: "#cfe9ff", label: "#f8f8f8" },
      onLight: { pct: "#123a5c", label: "#101013" },
    },
  },
  {
    name: "Titanium",
    surface: {
      stops: ["#eceef2", "#e2e0ea", "#f3efe9"],
      solid: { light: "#f4f4f6", dark: "#232329" },
    },
    fill: {
      mode: "gradient" as const,
      stops: {
        light: ["#7c8194", "#a3a8b8", "#c6c9d2", "#dcdde2"],
        dark: ["#b9bcc9", "#d7d9e2", "#f0eee9", "#d2d2d8"],
      },
      solid: { light: "#8f93a3", dark: "#d9d9e0" },
    },
    text: {
      onDark: { pct: "#e6e6ea", label: "#ffffff" },
      onLight: { pct: "#2a2a30", label: "#0d0d10" },
    },
  },
  // Three flat fills, for when the bar is reporting rather than performing —
  // one hue, no ramp to read a position out of. Same per-mode discipline: the
  // 600 on a light surface, the 400 on a dark one, since a single colour that
  // reads on white is muddy on near-black and the reverse washes out. `stops`
  // is the same colour twice so the preview chip and the preset match still
  // have a gradient to work with; `mode: "solid"` is what the bar paints from.
  {
    name: "Blue",
    surface: {
      stops: ["#d7e8ff", "#e6f1ff", "#f2f8ff"],
      solid: { light: "#fafcff", dark: "#16181c" },
    },
    fill: {
      mode: "solid" as const,
      stops: {
        light: ["#0b84ff", "#0b84ff"],
        dark: ["#4cb2ff", "#4cb2ff"],
      },
      solid: { light: "#0b84ff", dark: "#4cb2ff" },
    },
    text: {
      onDark: { pct: "#bfdbfe", label: "#f8f8f8" },
      onLight: { pct: "#1e3a8a", label: "#101013" },
    },
  },
  {
    name: "Green",
    surface: {
      stops: ["#d9f5e3", "#e8faee", "#f3fdf6"],
      solid: { light: "#fafffb", dark: "#141a16" },
    },
    fill: {
      mode: "solid" as const,
      stops: {
        light: ["#00c853", "#00c853"],
        dark: ["#5ef08a", "#5ef08a"],
      },
      solid: { light: "#00c853", dark: "#5ef08a" },
    },
    text: {
      onDark: { pct: "#bbf7d0", label: "#f8f8f8" },
      onLight: { pct: "#14532d", label: "#101013" },
    },
  },
  {
    name: "Orange",
    surface: {
      stops: ["#ffe8d6", "#fff1e3", "#fff8f0"],
      solid: { light: "#fffcf9", dark: "#1c1714" },
    },
    fill: {
      mode: "solid" as const,
      stops: {
        light: ["#ff7a00", "#ff7a00"],
        dark: ["#ffa640", "#ffa640"],
      },
      solid: { light: "#ff7a00", dark: "#ffa640" },
    },
    text: {
      onDark: { pct: "#fed7aa", label: "#f8f8f8" },
      onLight: { pct: "#7c2d12", label: "#101013" },
    },
  },
];

/** Which preset the bar is painting with. Matched on the stops it actually
 *  renders rather than on what was last picked, so a hand-edited theme reports
 *  Custom — in the trigger and in anything else that has to name the design. */
export const comboOf = (theme: BarTheme, mode: Mode) =>
  COMBOS.find((c) => c.fill.stops[mode].join() === theme.fill.stops.join())
    ?.name ?? "Custom";

/** The one opacity question the bar has, answered rather than sliderised. Glass
 *  in light mode needs the extra 2 points to lift the label off the page;
 *  darker than 16% in dark mode and the surface stops being glass at all.
 *  Fancy is opaque by definition. */
const OPACITY = {
  glass: { light: 0.22, dark: 0.16 },
  fancy: { light: 1, dark: 1 },
};

/* ---------- motion ---------- */

/** Three ways for the bar to reach its value, all of them paced to be watched
 *  rather than to feel responsive - this is a demo of a bar filling, not a
 *  control answering a press, so the whole set runs long and even.
 *
 *  Every width uses one curve: cubic-bezier(0.65, 0, 0.35, 1), a symmetric
 *  ease-in-out whose middle is close enough to linear to read as constant
 *  speed, with just enough softening at the ends that neither the start nor the
 *  stop is a hard edge. A strong ease-out is the opposite of steady - it spends
 *  most of the distance in the first fraction of the time and then crawls.
 *
 *  Glide is the plain read: the width and nothing else. The other two dress the
 *  gradient on a second channel, both with a filter on the fill alone.
 *
 *  Tint keeps transitions.dev's skeleton-reveal semantic - a running state and
 *  a landed one - and drops the blur that snippet reveals with. A 6px strip has
 *  no detail to sharpen, so the blur only ever read as a soft edge; colour has
 *  somewhere to go. The fill runs at 35% saturation and 88% brightness, grey
 *  enough to look unfinished without going monochrome, and comes up to full
 *  over 700ms on CSS `ease-in-out` when the last stage lands.
 *
 *  Flare is a finish. When the last stage lands the fill throws light:
 *  brightness and saturation lift together and two stacked `drop-shadow`s in
 *  the fill's own colour spill past its edges - 18px of falloff from a 6px bar,
 *  which reaches the pill's rim at the fill's left end. `drop-shadow` rather
 *  than `box-shadow` because it follows the painted alpha rather than the box,
 *  so the glow has the fill's rounded ends; two of them because the second is
 *  applied to the first's output, which is what turns a hard ring into a
 *  falloff. It rises and falls on a half-sine over 900ms, which is the shape
 *  that has no moment of arrival in it - it just swells and goes.
 *
 *  Flare's glow stays under 18px for the reason a 6px bar can't take more:
 *  further and it stops reading as light and starts reading as a rendering
 *  fault. */
const STEADY = [0.65, 0, 0.35, 1] as const;

export const MOTIONS = [
  { name: "Glide", spec: { duration: 2.4, ease: STEADY } },
  {
    name: "Tint",
    spec: { duration: 2, ease: STEADY },
    fx: { duration: 0.7, ease: [0.42, 0, 0.58, 1] },
    filter: (q: number) => {
      const a = 1 - q;
      return `saturate(${(1 - 0.65 * a).toFixed(3)}) brightness(${(1 - 0.12 * a).toFixed(3)})`;
    },
  },
  {
    name: "Flare",
    spec: { duration: 1.6, ease: STEADY },
    fx: { duration: 0.9, ease: "linear" },
    filter: (q: number, glow: string) => {
      // One half-sine: everything here is 0 or 1x at both ends, so the fill
      // sits at its normal colour until the flare starts and returns to it - a
      // flare can't leave a residue, and an interrupted one can't strand a glow.
      const a = Math.sin(Math.PI * q);
      return [
        `brightness(${(1 + 0.4 * a).toFixed(3)})`,
        `saturate(${(1 + a).toFixed(3)})`,
        `drop-shadow(0 0 ${(7 * a).toFixed(2)}px ${toOklch(glow, 0.9 * a)})`,
        `drop-shadow(0 0 ${(18 * a).toFixed(2)}px ${toOklch(glow, 0.55 * a)})`,
      ].join(" ");
    },
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

export const GroupLabel = ({ children }: { children: string }) => (
  <span className="pr-0.5 pl-1.5 text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
    {children}
  </span>
);

export const Divider = () => (
  <span className="mx-1 h-6 w-px shrink-0 bg-border" />
);

// Same spec as the site's bottom dock: h-12, rounded-full, one border and one
// lifted shadow. Shared so the two pills can't drift apart.
export const PILL =
  "flex h-12 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-border/60 bg-background px-1.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35),0_4px_12px_-4px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.05)]";

export const LIFT =
  "shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35),0_4px_12px_-4px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.05)]";

/** One dropdown, two uses. The panel is a card on the same spec as the pill it
 *  drops out of: `corner-shape: squircle` for Apple's continuous curvature
 *  (Chromium honours it, everything else falls back to the plain radius), and
 *  the transitions.dev menu-dropdown transition — 250ms open / 150ms close on
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
        {/* The primitive rather than the shadcn wrapper, so `.t-dropdown` is
            the only thing animating the panel — the wrapper ships its own
            keyframe classes and the two would fight over the same properties. */}
        <Rdx.Portal>
          <Rdx.Content
            data-slot="dropdown-menu-content"
            align="start"
            sideOffset={8}
            className={cn(
              "t-dropdown z-50 min-w-[9.5rem] rounded-2xl border border-border/60 bg-popover p-1.5 text-popover-foreground [corner-shape:squircle]",
              LIFT,
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
          </Rdx.Content>
        </Rdx.Portal>
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

/** The demo's script. A real bar reports whatever its work is doing; this one
 *  has no work, so it says what a bar with work says: a setup step that's over
 *  before you have read it, the long middle, and an end state. `to` is the
 *  share of the target that stage carries, and it doubles as the shape of the
 *  motion - the bar jumps to 18%, holds, then travels the rest. That's what
 *  staged work looks like, and it's the thing one sweep can't say. */
const STAGES = [
  { name: "Init", to: 0.18 },
  { name: "Progress", to: 1 },
] as const;

const DONE = "Done.";
/** Before anything plays, the bar is a still at its value - and a still that
 *  already said "Done." would be claiming a run nobody watched. */
const STILL = "Progress..";
/** The pause between stages: long enough to read the label that just changed,
 *  short enough that the bar doesn't look stalled. Paced with the rest - a
 *  180ms beat inside a two-and-a-half second run reads as a stumble. */
const HOLD = 0.35;
/** Trailing dots as a fixed-width slot: the trailing space holds what a missing
 *  dot would take, so the centred label doesn't shuffle as the dots cycle. */
const dotted = (name: string, p: number) => {
  const n = Math.floor(p * 6) % 3;
  return `${name}${".".repeat(n)}${" ".repeat(2 - n)}`;
};

/** One animated number drives all three: the fill's width, the percentage, and
 *  the label's ellipsis — so they can't drift apart. A preset that dresses the
 *  gradient gets a second number on its own timing, because the point of Flare
 *  is that the glow outlives the travel. Owns the motion preset too, since the
 *  preset is only ever a property of the run.
 *
 *  `play` takes the preset by name rather than reading state: the run is
 *  triggered by picking one, and the pick hasn't landed in state yet. */
export function useProgressRun(still = 83, target = 100) {
  // Two numbers, because they answer different questions: `still` is what the
  // bar shows when nothing has played - the reference frame's 83% - and
  // `target` is where a run ends, which has to be 100 for "Done." to be true.
  const [value, setValue] = useState(still);
  const [label, setLabel] = useState(STILL);
  const [motionName, setMotionName] = useState<MotionName>("Glide");
  // 1 is settled, not 0 - the bar sits at its value until something plays, and
  // an unplayed bar must not render greyed or mid-flare.
  const [fx, setFx] = useState(1);
  const reduced = useReducedMotion();

  // The run travels on a motion value rather than a plain number so there is
  // something to hand back: every animation started here is kept and stopped
  // before the next run begins. Picking presets to compare them is the normal
  // way to use this thing, and without the stop the abandoned run keeps
  // animating to completion off-screen. The token is still needed on top -
  // stopping an animation settles its `finished` promise, so the loop that was
  // awaiting it would otherwise walk on to its next stage.
  const progress = useMotionValue(still);
  const live = useRef<AnimationPlaybackControls[]>([]);
  const runId = useRef(0);

  const play = useCallback(
    async (name: MotionName = motionName) => {
      const preset = MOTIONS.find((m) => m.name === name)!;
      const id = ++runId.current;
      live.current.forEach((c) => c.stop());
      live.current = [];

      if (reduced) {
        progress.set(target);
        setValue(target);
        setLabel(DONE);
        setFx(1);
        return;
      }

      // The preset's duration is the whole run's, not one stage's: each stage
      // takes the share of it that matches the distance it covers, so adding a
      // stage re-cuts the same span instead of making the demo longer.
      const span = preset.spec.duration;
      // 0 is "mid-run" for both dressed presets: Tint sits desaturated there
      // and Flare's half-sine reads 1x, so one line covers holding the fill in
      // its running state until the stages are through with it.
      if ("filter" in preset) setFx(0);
      progress.set(0);

      let from = 0;
      for (let i = 0; i < STAGES.length; i++) {
        const { name: stage, to: share } = STAGES[i];
        const to = target * share;
        // Set before awaiting: through the hold the bar is stopped, and the
        // label it sits under should be the stage it is about to run.
        setLabel(dotted(stage, 0));
        // Subscribed per stage rather than once for the hook: the stage's own
        // bounds are what the label needs, and the subscription ends with it,
        // so a bar at rest isn't paying for a listener that never fires.
        const unwatch = progress.on("change", (v) => {
          setValue(v);
          setLabel(dotted(stage, (v - from) / (to - from)));
        });
        const run = animate(progress, to, {
          ...preset.spec,
          duration: span * ((to - from) / target),
          delay: i ? HOLD : 0,
        });
        live.current.push(run);
        await run.finished;
        unwatch();
        if (runId.current !== id) return;
        from = to;
      }
      setLabel(DONE);
      // Both dressings are finishes - Tint brings the colour up, Flare throws
      // light - so they start when the last stage lands rather than on a delay
      // guessed from the stage timings.
      if ("filter" in preset)
        live.current.push(animate(0, 1, { ...preset.fx, onUpdate: setFx }));
    },
    [reduced, target, motionName, progress],
  );

  const preset = MOTIONS.find((m) => m.name === motionName)!;

  return {
    value,
    label,
    play,
    motionName,
    setMotionName,
    // Takes the colour rather than owning it: the glow is the fill's own light,
    // and only the caller holds the theme. Gradients hand over their `solid`,
    // which is the stop they'd fall back to anyway.
    fillFilter: (glow: string) =>
      "filter" in preset ? preset.filter(fx, glow) : undefined,
  };
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
  fill,
  onFillChange,
  chrome,
  onChromeChange,
  mode,
  run,
  className,
}: {
  theme: BarTheme;
  onChange: (t: BarTheme) => void;
  variant: Variant;
  onVariantChange: (v: Variant) => void;
  fill?: Fill;
  onFillChange?: (f: Fill) => void;
  chrome?: Chrome;
  onChromeChange?: (c: Chrome) => void;
  mode: Mode;
  run?: Run;
  className?: string;
}) {
  const reduced = useReducedMotion();

  // Both looks follow the page now — a wash over it or a card on it — so the
  // page's mode is the only thing that decides which text pair reads.
  const onLight = mode === "light";

  const applyCombo = (name: string) => {
    const c = COMBOS.find((x) => x.name === name)!;
    onChange({
      ...theme,
      surface: {
        ...theme.surface,
        stops: c.surface.stops,
        solid: c.surface.solid[mode],
      },
      fill: {
        mode: c.fill.mode,
        stops: c.fill.stops[mode],
        solid: c.fill.solid[mode],
      },
      surfaceOpacity: OPACITY[variant][mode],
      text: onLight ? c.text.onLight : c.text.onDark,
    });
    // Same reasoning as picking a motion: a colour you can't see run is just a
    // swatch. Replays the motion that's already selected.
    run?.play();
  };

  const combo = comboOf(theme, mode);

  // Settles in from just below, the way the dock does — enough to say "these are
  // controls, they arrived" without holding anything up. One pass on mount; the
  // pills are otherwise still, so the colours are the only moving parts.
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: STEADY }}
      // One line, always: the pills are a dock, and a dock that reflows to two
      // rows moves the controls out from under the cursor. `w-max` lets the row
      // stay its natural width and overflow a narrower column rather than wrap.
      className={cn("flex w-max items-center justify-center gap-2", className)}
    >
      <div className={PILL}>
        {/* Plain sits with the surfaces because that's what it is: no pill at
            all. It's stored as a chrome, so picking it sets the chrome and
            picking a surface takes the bar back out of it. */}
        <Segmented<Variant | "plain">
          options={{ Glass: "glass", Fancy: "fancy", Plain: "plain" } as const}
          value={chrome === "plain" ? "plain" : variant}
          onChange={(v) => {
            if (v === "plain") return onChromeChange?.("plain");
            onVariantChange(v);
            if (chrome === "plain") onChromeChange?.("full");
          }}
        />
        {/* Same pill as the surface pick, because it's the same question asked
            of the other half of the component: what the bar looks like, not what
            it's doing. */}
        {fill && onFillChange && (
          <>
            <Divider />
            <Segmented
              options={{ Beam: "beam", Matrix: "matrix" } as const}
              value={fill}
              onChange={onFillChange}
            />
          </>
        )}
        {/* The third question of the same kind: how much of the component there
            is — Bar drops the tick leaders. Neither reads as picked while Plain
            is, since Plain has no pill for them to trim; clicking one is the
            way back. */}
        {chrome && onChromeChange && (
          <>
            <Divider />
            <Segmented
              options={{ Full: "full", Bar: "bar" } as const}
              value={chrome}
              onChange={onChromeChange}
            />
          </>
        )}
      </div>

      <div className={PILL}>
        <Picker
          label="Theme"
          // The fill is the one saturated thing in the component, so it's what
          // the chip previews — the surface reads as grey at 28px either way.
          items={COMBOS.map((c) => ({
            name: c.name,
            preview: c.fill.stops[mode],
          }))}
          active={combo}
          onPick={applyCombo}
        />
        {run && (
          <>
            <Divider />
            {/* Picking one plays it. A preset you can't see is just a word, and
                a separate Animate button made you press twice to learn what a
                name meant — the pick is the demo. */}
            <Picker
              label="Motion"
              items={MOTIONS.map((m) => ({ name: m.name }))}
              active={run.motionName}
              onPick={(n) => {
                run.setMotionName(n as MotionName);
                run.play(n as MotionName);
              }}
            />
          </>
        )}
      </div>
    </motion.div>
  );
}
