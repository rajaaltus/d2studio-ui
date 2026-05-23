"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Loader2, RotateCcw } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type TargetAndTransition,
} from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TickSlider } from "@/components/cosma/cosmo-morph";
import {
  PixelSpinner,
  type SpinnerAnimation,
  type SpinnerGradient,
  type SpinnerPattern,
  type SpinnerShape,
} from "@/components/pixel-spinner";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Pixel-spinner section for the homepage. Mirrors the particle-morph block:
 * a stand-alone "Loaders worth the wait." CTA, then an interactive demo where
 * the controls (left) re-size and re-time a single centered spinner (right).
 */

type GallerySpinner = {
  name: string;
  pattern: SpinnerPattern;
  gradient: SpinnerGradient;
  /** Glow scalar — multiplies the box-shadow halo blur (0 = no glow). */
  glow: number;
  /** One-shot elastic pop on each cell's activation frame. */
  pop?: boolean;
  /** Cell shape — defaults to a sharp square. */
  shape?: SpinnerShape;
  /** Frame stepping — "pixels" is discrete, "wavy" eases between frames. */
  animation?: SpinnerAnimation;
};

/* Four spinners, one per quadrant — each spec'd by pattern, palette and glow. */
const GALLERY_SPINNERS: GallerySpinner[] = [
  {
    name: "pattern-1",
    pattern: {
      rows: 3,
      cols: 3,
      interval: 200,
      frames: [[0], [4], [8], [5, 7, 8], [4], [2, 6], [0]],
    },
    gradient: { from: "#4facfe", to: "#00f2fe", glow: "#00f2fe" },
    glow: 0,
  },
  {
    name: "tr-bl-sweep-5",
    pattern: {
      rows: 5,
      cols: 5,
      interval: 170,
      frames: [
        [4],
        [3, 9],
        [2, 8, 14],
        [1, 7, 13, 19],
        [0, 6, 12, 18, 24],
        [5, 11, 17, 23],
        [10, 16, 22],
        [15, 21],
        [20],
      ],
    },
    gradient: { from: "#4facfe", to: "#00f2fe", glow: "#00f2fe" },
    glow: 0.25,
    pop: true,
  },
  {
    name: "ember-glow",
    pattern: {
      rows: 3,
      cols: 3,
      interval: 170,
      frames: [
        [4],
        [4],
        [1, 3, 4, 5, 7],
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [1, 3, 4, 5, 7],
        [4],
      ],
    },
    gradient: { from: "#f6d365", to: "#fda085", glow: "#fda085" },
    glow: 0.25,
    pop: true,
  },
  {
    name: "neon-ring",
    pattern: {
      rows: 4,
      cols: 4,
      interval: 140,
      frames: [[], [8, 12, 13], [11, 14, 15], [5, 6], [0, 3], [], [5, 6], []],
    },
    gradient: { from: "#a78bfa", to: "#5b21b6", glow: "#a78bfa" },
    glow: 0.25,
    shape: "circle",
    animation: "wavy",
  },
];

/* Control defaults — shared by the initial state and the reset button.
 * Spinners sit at ~50% scale so they breathe inside their quadrant. */
const DEFAULT_CELL_SIZE = 21;
const DEFAULT_GAP = 8;
const DEFAULT_SPEED = 13;

/* The Speed slider runs slow→fast; map it to a multiplier on each spinner's
 * native frame interval, where 9 ≈ 1× the spec'd speed. */
function speedMultiplier(speed: number): number {
  return (21 - speed) / 12;
}

/* Polka-dot stage texture — a single dot per tile via a radial gradient.
 * Uses the global `--pattern-fg` token so the dots track the theme:
 * black/10% on the light stage, white/10% on the dark stage. */
const DOT_PATTERN: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(ellipse farthest-corner at 6.25px 6.25px, var(--pattern-fg), var(--pattern-fg) 50%, transparent 50%)",
  backgroundSize: "6.25px 6.25px",
};

/* Converging guide lines — the vertical + horizontal cross. */
const GUIDE_LINES = [
  { x1: "50%", y1: "0", x2: "50%", y2: "100%" },
  { x1: "0", y1: "50%", x2: "100%", y2: "50%" },
];

export function SpinnerMorph() {
  const [cellSize, setCellSize] = React.useState(DEFAULT_CELL_SIZE);
  const [gap, setGap] = React.useState(DEFAULT_GAP);
  const [speed, setSpeed] = React.useState(DEFAULT_SPEED);
  const stageRef = React.useRef<HTMLDivElement>(null);

  const resetControls = () => {
    setCellSize(DEFAULT_CELL_SIZE);
    setGap(DEFAULT_GAP);
    setSpeed(DEFAULT_SPEED);
  };

  /* Parallax dot grid — scroll-linked translate on the dot-pattern layer,
   * giving the static chip a sense of depth as the page moves around it.
   * Scrub-bound so motion tracks scroll directly. Skips under reduced-motion. */
  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;
      const dots = stage.querySelector<HTMLDivElement>("[data-dot-layer]");
      if (!dots) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        dots,
        { yPercent: -22, scale: 1.06 },
        {
          yPercent: 22,
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.25,
          },
        }
      );
    },
    { scope: stageRef }
  );

  const mult = speedMultiplier(speed);
  const centerSpinner = GALLERY_SPINNERS[2]; // ember-glow

  return (
    <div className="luminous-spinners overflow-hidden bg-background lg:rounded-xl border m-0">
      {/* ── CTA ── Headline + subtitle + primary action stand on their own. */}
      <div className="flex flex-col items-center gap-5 px-6 py-16 text-center lg:py-20">
        <h3 className="font-sans text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
          Loaders worth the wait.
        </h3>
        <p className="mx-auto max-w-xl text-sm text-muted-foreground md:text-base">
          Pixel-grid spinners with glow, gradients and shimmer. Tune them live,
          then copy the snippet — no package install.
        </p>
      </div>

      {/* ── Interactive demo ── Controls on the left, spinner gallery right. */}
      <div className="grid grid-cols-1 border-t border-[var(--ls-border)] lg:grid-cols-2">
        {/* Controls — left */}
        <div className="order-2 flex flex-col justify-center px-6 py-8 lg:order-1 lg:border-r lg:border-[var(--ls-border)] lg:px-10">
          <div className="mx-auto w-full max-w-[21rem] space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[var(--ls-border)] bg-[var(--ls-foreground)]/[0.06]">
                  <Loader2 size={13} className="text-[var(--ls-muted-foreground)]" />
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-foreground)]">
                  Try the spinner
                </p>
              </div>
              <button
                type="button"
                onClick={resetControls}
                aria-label="Reset controls"
                title="Reset to defaults"
                className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-muted-foreground)] transition-colors hover:bg-[var(--ls-border)]/40 hover:text-[var(--ls-foreground)]"
              >
                <RotateCcw size={12} />
              </button>
            </div>
            <div className="space-y-2.5">
              <TickSlider
                label="Cell size"
                value={cellSize}
                min={6}
                max={32}
                step={1}
                unit="px"
                editable
                onChange={setCellSize}
              />
              <TickSlider
                label="Gap"
                value={gap}
                min={0}
                max={12}
                step={1}
                unit="px"
                onChange={setGap}
              />
              <TickSlider
                label="Speed"
                value={speed}
                min={1}
                max={20}
                step={1}
                onChange={setSpeed}
              />
            </div>
          </div>
        </div>

        {/* Spinner stage — right. A polka-dot texture and converging guide
            lines sit behind a single centered placeholder. Light mode uses a
            soft #f0f0f0 stage; dark mode keeps the site background. */}
        <div
          ref={stageRef}
          className="relative order-1 min-h-[300px] overflow-hidden bg-[#f0f0f0] lg:order-2 lg:min-h-[440px] dark:bg-background"
        >
          {/* Polka-dot background texture. The layer is oversized vertically
              so the parallax translate never reveals the stage edges. */}
          <div
            aria-hidden="true"
            data-dot-layer
            className="pointer-events-none absolute -inset-y-44 inset-x-0"
            style={DOT_PATTERN}
          />

          {/* Converging chip-pin traces — wide halos in the stage color carve
              clean channels through the dot pattern; a thinner trace painted
              in a subtle contrast color rides down the center of each channel
              so the cross reads as visible chip-pin lines in both themes. */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {GUIDE_LINES.map((l, i) => (
              <line
                key={`halo-${i}`}
                {...l}
                className="text-[#f0f0f0] dark:text-background"
                stroke="currentColor"
                strokeWidth="6"
              />
            ))}
            {GUIDE_LINES.map((l, i) => (
              <line
                key={`trace-${i}`}
                {...l}
                className="text-black/20 dark:text-white/15"
                stroke="currentColor"
                strokeWidth="1.25"
              />
            ))}
          </svg>

          {/* Centered placeholder. The rounded bg-padded wrapper masks the
              guide lines so they stop short of the box — a clean intersect
              effect. The inner box is an app-icon-style squircle canvas: a
              top-lit radial gradient, a hairline top rim highlight and a soft
              drop shadow. It carries `dark` so the spinner's own canvas stays
              dark in both themes, even when the stage around it is light. */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-[48px] bg-[#f0f0f0] p-1 dark:bg-background">
              {/* Outer chip body — the IC package. Light theme renders a
                  brushed-silver chip; dark theme stays as the dark IC. */}
              <div
                className="chip-body relative flex h-[240px] w-[240px] items-center justify-center"
              >
                {/* Four corner mounting dots — like screw heads / vias on a
                    chip package. Inset shadow gives each a recessed feel.
                    Light theme uses lighter studs over the silver body. */}
                {[
                  { top: 18, left: 18 },
                  { top: 18, right: 18 },
                  { bottom: 18, left: 18 },
                  { bottom: 18, right: 18 },
                ].map((pos, i) => (
                  <span
                    key={`stud-${i}`}
                    aria-hidden="true"
                    className="chip-stud pointer-events-none absolute h-2 w-2 rounded-full"
                    style={pos}
                  />
                ))}

                {/* Recessed inner sensor panel — slightly smaller squircle,
                    darker fill, inset shadow to read as inset into the body. */}
                <div
                  className="chip-panel flex h-[176px] w-[176px] items-center justify-center"
                >
                  <PixelSpinner
                    pattern={centerSpinner.pattern}
                    color="violet"
                    gradient={centerSpinner.gradient}
                    glow={centerSpinner.glow}
                    cellSize={cellSize}
                    gap={gap}
                    intervalOverride={Math.max(
                      40,
                      Math.round((centerSpinner.pattern.interval ?? 200) * mult)
                    )}
                    shape={centerSpinner.shape}
                    animation={centerSpinner.animation}
                    effect="none"
                    pop={centerSpinner.pop}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer — a quiet link out to the full spinner playground. */}
      <div className="flex justify-center border-t border-[var(--ls-border)] px-6 py-5">
        <TryYoursLink />
      </div>
    </div>
  );
}

/* ── "Try yours" link with a spring-in spinner preview ───────────────── */

function TryYoursLink() {
  const [hovered, setHovered] = React.useState(false);
  const reduceMotion = useReducedMotion();
  const preview = GALLERY_SPINNERS[3]; // neon-ring

  // Respect the OS "reduce motion" setting: skip the spring/scale and
  // fall back to a plain, fast opacity fade.
  const popInitial: TargetAndTransition = reduceMotion
    ? { opacity: 0, x: "-50%" }
    : { scale: 0.42, opacity: 0, x: "-50%" };
  const popAnimate: TargetAndTransition = reduceMotion
    ? { opacity: 1, x: "-50%", transition: { duration: 0.15 } }
    : {
        scale: 1,
        opacity: 1,
        x: "-50%",
        transition: {
          scale: { type: "spring", stiffness: 440, damping: 25, mass: 1 },
          opacity: { duration: 0.18 },
        },
      };
  const popExit: TargetAndTransition = reduceMotion
    ? { opacity: 0, x: "-50%", transition: { duration: 0.12 } }
    : {
        scale: 0.42,
        opacity: 0,
        x: "-50%",
        transition: { duration: 0.22, ease: "easeIn" },
      };

  return (
    <div className="relative inline-flex items-center gap-1 text-[11px] font-medium text-[var(--ls-muted-foreground)]">
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3"
            style={{ transformOrigin: "bottom center" }}
            initial={popInitial}
            animate={popAnimate}
            exit={popExit}
          >
            {/* A small card springs up with a live spinner inside. */}
            <div className="flex h-24 w-48 items-center justify-center rounded-lg border border-[var(--ls-border)] bg-[#0c0c0c] shadow-2xl dark:border-white/15">
              <PixelSpinner
                pattern={preview.pattern}
                color="violet"
                gradient={{ from: "#e8a8ff", to: "#b85ee5", glow: "#d27aff" }}
                glow={0}
                cellSize={5}
                gap={2}
                shape={preview.shape}
                animation={preview.animation}
                effect="none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <span>Wanna get it free?</span>
      <Link
        href="/spinners"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-4 transition-colors hover:text-[var(--ls-foreground)]"
      >
        Try yours
        <ArrowUpRight size={12} />
      </Link>
    </div>
  );
}
