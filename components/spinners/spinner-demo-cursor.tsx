"use client";

import * as React from "react";
import {
  animate,
  AnimatePresence,
  useMotionValue,
  useReducedMotion,
  useTransform,
  motion,
} from "motion/react";
import {
  ArrowHead,
  GrabHead,
  PillSvg,
} from "@/components/cosmo/cosmo-demo-cursor";

/**
 * Onboarding cursor for the "Try the spinner" panel. Drifts in from the right,
 * walks through Cell size → Gap → Speed (slow then fast), and exits. There is
 * no canvas to hover over here, so the cursor leaves once the speed dial has
 * finished its second pass. Plays once per session and bails for reduce-motion
 * or sub-lg viewports.
 */

type Targets = {
  wrapper: React.RefObject<HTMLDivElement | null>;
  cellSlider: React.RefObject<HTMLDivElement | null>;
  gapSlider: React.RefObject<HTMLDivElement | null>;
  speedSlider: React.RefObject<HTMLDivElement | null>;
};

type SpinnerDemoCursorProps = Targets & {
  current: React.MutableRefObject<{
    cellSize: number;
    gap: number;
    speed: number;
  }>;
  onCellSize: (v: number) => void;
  onGap: (v: number) => void;
  onSpeed: (v: number) => void;
  onReset: () => void;
};

const SESSION_KEY = "spinner-demo-cursor-played-v4";

type CursorMode = "arrow" | "grab";
const TARGET_CELL_SIZE = 32;
const TARGET_GAP = 12;
const TARGET_SPEED_LOW = 6;
const TARGET_SPEED_HIGH = 19;

// Ember palette — keys the cursor's "You" pill and pointer heads to the
// warm ember-glow spinner that anchors this section.
const PILL_COLOR = "#E25822";
const HEAD_COLOR = "#FF8A3D";
const HEAD_DEEP = "#A8421A";

// Avatar stops — cool neon disc against the warm pill so the "You" badge
// reads as eye-catching rather than tonal mush. Cyan center → magenta mid
// → deep indigo edge gives a complementary jolt opposite the ember orange.
const AVATAR_STOPS = [
  { offset: "0%", color: "#5EEAFF" },
  { offset: "55%", color: "#FF49C2" },
  { offset: "100%", color: "#1E0F4A" },
];

// Each slider's value range — used to map a value to a position along its
// track so the cursor can ride the thumb instead of standing still.
const RANGES = {
  cellSize: { min: 6, max: 32 },
  gap: { min: 0, max: 12 },
  speed: { min: 1, max: 20 },
} as const;

// Outer guard — keeps the heavy motion.div tree (useMotionValue, useTransform,
// nested AnimatePresence) out of the React tree entirely on sub-lg viewports.
// The intro is desktop-only, so mobile shouldn't pay for it at all.
export function SpinnerDemoCursor(props: SpinnerDemoCursorProps) {
  const [enabled, setEnabled] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setEnabled(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  if (!enabled) return null;
  return <SpinnerDemoCursorImpl {...props} />;
}

function SpinnerDemoCursorImpl({
  wrapper,
  cellSlider,
  gapSlider,
  speedSlider,
  current,
  onCellSize,
  onGap,
  onSpeed,
  onReset,
}: SpinnerDemoCursorProps) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = React.useState(false);
  const [cursorMode, setCursorMode] = React.useState<CursorMode>("arrow");

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useMotionValue(0);
  const blur = useMotionValue(28);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  React.useEffect(() => {
    if (reduceMotion) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    const wrap = wrapper.current;
    if (!wrap) return;

    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === "1") return;
    } catch {
      // sessionStorage may be unavailable (private mode, etc.) — proceed.
    }

    let cancelled = false;
    let interactedEarly = false;
    const timeouts: number[] = [];

    const onEarlyInteract = () => {
      interactedEarly = true;
    };
    wrap.addEventListener("pointerdown", onEarlyInteract, { once: true });

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(resolve, ms);
        timeouts.push(id);
      });

    // Position the cursor where the slider thumb for `value` would sit. We
    // measure the inner track (the `role="slider"` element rendered by
    // TickSlider) so the cursor lines up with the live drag surface, not
    // the outer pill that includes the label.
    const thumbPoint = (
      slider: React.RefObject<HTMLDivElement | null>,
      range: { min: number; max: number },
      value: number,
    ) => {
      const wr = wrap.getBoundingClientRect();
      const outer = slider.current;
      if (!outer) return { x: wr.width / 2, y: wr.height / 2 };
      // TickSlider has no `role="slider"`; it uses an overlaid native input.
      const track =
        outer.querySelector<HTMLElement>('[role="slider"]') ??
        outer.querySelector<HTMLElement>('input[type="range"]') ??
        outer;
      const r = track.getBoundingClientRect();
      const t = Math.min(
        1,
        Math.max(0, (value - range.min) / (range.max - range.min)),
      );
      return {
        x: r.left - wr.left + t * r.width,
        y: r.top - wr.top + r.height / 2,
      };
    };

    // Drive a slider from its current value to `target`, moving the cursor
    // along the track in lock-step so it reads as a real drag.
    const dragSlider = async (
      slider: React.RefObject<HTMLDivElement | null>,
      range: { min: number; max: number },
      get: () => number,
      set: (v: number) => void,
      target: number,
      duration: number,
    ) => {
      await animate(get(), target, {
        duration,
        ease: "easeInOut",
        onUpdate: (v) => {
          set(Math.round(v));
          const pt = thumbPoint(slider, range, v);
          x.set(pt.x);
          y.set(pt.y);
        },
      }).finished;
    };

    const run = async () => {
      if (cancelled || interactedEarly) return;
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // ignore
      }

      const wr = wrap.getBoundingClientRect();
      const startX = wr.width + 140;
      // Land on each slider exactly where its current thumb sits, so the
      // grab starts from the same point a real cursor would.
      const cellEntry = thumbPoint(
        cellSlider,
        RANGES.cellSize,
        current.current.cellSize,
      );
      const gapEntry = thumbPoint(
        gapSlider,
        RANGES.gap,
        current.current.gap,
      );
      const speedEntry = thumbPoint(
        speedSlider,
        RANGES.speed,
        current.current.speed,
      );

      x.set(startX);
      y.set(cellEntry.y);
      blur.set(28);
      opacity.set(0);
      setCursorMode("arrow");
      setVisible(true);

      // 1) Enter — drift in toward the Cell size thumb, blur clears.
      await Promise.all([
        animate(opacity, 1, { duration: 0.45, ease: "easeOut" }).finished,
        animate(blur, 0, { duration: 0.55, ease: "easeOut" }).finished,
        animate(x, cellEntry.x, {
          duration: 1.0,
          ease: [0.22, 1, 0.36, 1],
        }).finished,
        animate(y, cellEntry.y, {
          duration: 1.0,
          ease: [0.22, 1, 0.36, 1],
        }).finished,
      ]);
      if (cancelled) return;
      await wait(160);

      // 2) Grab and drag Cell size up to its target — cursor rides the thumb.
      setCursorMode("grab");
      await wait(130);
      await dragSlider(
        cellSlider,
        RANGES.cellSize,
        () => current.current.cellSize,
        onCellSize,
        TARGET_CELL_SIZE,
        0.7,
      );
      if (cancelled) return;
      await wait(140);

      // 3) Release and travel to the Gap thumb.
      setCursorMode("arrow");
      await Promise.all([
        animate(x, gapEntry.x, {
          duration: 0.55,
          ease: [0.5, 0, 0.2, 1],
        }).finished,
        animate(y, gapEntry.y, {
          duration: 0.55,
          ease: [0.5, 0, 0.2, 1],
        }).finished,
      ]);
      if (cancelled) return;
      await wait(100);

      // 4) Drag Gap to target.
      setCursorMode("grab");
      await wait(130);
      await dragSlider(
        gapSlider,
        RANGES.gap,
        () => current.current.gap,
        onGap,
        TARGET_GAP,
        0.55,
      );
      if (cancelled) return;
      await wait(140);

      // 5) Travel to the Speed thumb.
      setCursorMode("arrow");
      await Promise.all([
        animate(x, speedEntry.x, {
          duration: 0.5,
          ease: [0.5, 0, 0.2, 1],
        }).finished,
        animate(y, speedEntry.y, {
          duration: 0.5,
          ease: [0.5, 0, 0.2, 1],
        }).finished,
      ]);
      if (cancelled) return;
      await wait(100);

      // 6) Speed — drag down low first so the spinner visibly slows, then
      //    drag back past the default to showcase the full range. The cursor
      //    moves left then right, just as a real user's hand would.
      setCursorMode("grab");
      await wait(130);
      await dragSlider(
        speedSlider,
        RANGES.speed,
        () => current.current.speed,
        onSpeed,
        TARGET_SPEED_LOW,
        0.55,
      );
      if (cancelled) return;
      await wait(220);
      await dragSlider(
        speedSlider,
        RANGES.speed,
        () => current.current.speed,
        onSpeed,
        TARGET_SPEED_HIGH,
        0.75,
      );
      if (cancelled) return;
      await wait(220);

      // 7) Exit — blur out toward the right. No canvas to orbit here.
      setCursorMode("arrow");
      const wrNow = wrap.getBoundingClientRect();
      await Promise.all([
        animate(opacity, 0, { duration: 0.5, ease: "easeIn" }).finished,
        animate(blur, 28, { duration: 0.5, ease: "easeIn" }).finished,
        animate(x, wrNow.width + 140, { duration: 0.6, ease: "easeIn" }).finished,
      ]);
      if (cancelled) return;
      setVisible(false);

      // 8) Once the cursor is gone, snap the controls back to their
      //    defaults — same effect as the user hitting the reset button.
      await wait(180);
      if (cancelled) return;
      onReset();
    };

    const fireOnce = () => {
      observer.disconnect();
      const id = window.setTimeout(() => {
        if (!cancelled && !interactedEarly) void run();
      }, 500);
      timeouts.push(id);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const viewportH = window.innerHeight || 1;
        const coversViewport =
          entry.intersectionRect.height / viewportH >= 0.9;
        if (entry.intersectionRatio >= 0.7 || coversViewport) {
          fireOnce();
        }
      },
      { threshold: [0, 0.25, 0.5, 0.7, 0.9, 1] },
    );
    observer.observe(wrap);

    return () => {
      cancelled = true;
      observer.disconnect();
      timeouts.forEach((id) => window.clearTimeout(id));
      wrap.removeEventListener("pointerdown", onEarlyInteract);
    };
  }, [
    blur,
    cellSlider,
    current,
    gapSlider,
    onCellSize,
    onGap,
    onReset,
    onSpeed,
    opacity,
    reduceMotion,
    speedSlider,
    wrapper,
    x,
    y,
  ]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-50 will-change-transform"
      style={{
        x,
        y,
        opacity,
        filter,
        display: visible ? "block" : "none",
      }}
    >
      <div className="relative" style={{ transform: "translate(-2px, 0)" }}>
        <PillSvg color={PILL_COLOR} avatarStops={AVATAR_STOPS} />
        <div
          className="absolute left-0 top-0"
          style={{ width: 22, height: 22 }}
        >
          <AnimatePresence initial={false}>
            {cursorMode === "arrow" ? (
              <motion.div
                key="arrow"
                className="absolute left-0 top-0"
                style={{ transformOrigin: "0% 0%" }}
                initial={{ opacity: 0, scale: 0.35, rotate: -35 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.35, rotate: 35 }}
                transition={{
                  scale: { type: "spring", stiffness: 520, damping: 24 },
                  rotate: { type: "spring", stiffness: 520, damping: 24 },
                  opacity: { duration: 0.16 },
                }}
              >
                <ArrowHead color={HEAD_COLOR} colorDeep={HEAD_DEEP} />
              </motion.div>
            ) : (
              <motion.div
                key="grab"
                className="absolute left-0 top-0"
                style={{ transformOrigin: "0% 0%" }}
                initial={{ opacity: 0, scale: 0.35, rotate: 35 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.35, rotate: -35 }}
                transition={{
                  scale: { type: "spring", stiffness: 520, damping: 24 },
                  rotate: { type: "spring", stiffness: 520, damping: 24 },
                  opacity: { duration: 0.16 },
                }}
              >
                <GrabHead color={HEAD_COLOR} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
