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

/**
 * Onboarding cursor for the "Try the effect" panel. A first-time visitor sees
 * a "You"-style collaboration cursor drift in from the right, walk through the
 * three controls (settling them on a tuned preset), hover-orbit the canvas
 * (dispatching real PointerEvents so particles react), and exit right. Plays
 * once per session and bails for reduce-motion or sub-lg viewports.
 */

type Targets = {
  wrapper: React.RefObject<HTMLDivElement | null>;
  imageSlider: React.RefObject<HTMLDivElement | null>;
  radiusSlider: React.RefObject<HTMLDivElement | null>;
  forceSlider: React.RefObject<HTMLDivElement | null>;
  canvas: React.RefObject<HTMLDivElement | null>;
};

type DemoCursorProps = Targets & {
  current: React.MutableRefObject<{
    imageScale: number;
    mouseRadius: number;
    mouseForce: number;
  }>;
  onImageScale: (v: number) => void;
  onMouseRadius: (v: number) => void;
  onMouseForce: (v: number) => void;
  onReset: () => void;
};

const SESSION_KEY = "cosmo-demo-cursor-played-v11";

type CursorMode = "arrow" | "grab";
const TARGET_IMAGE = 0.45;
const TARGET_RADIUS = 54;
const TARGET_FORCE = 8;

// Each slider's value range — used to map a value to a position along its
// track so the cursor can ride the thumb during a drag.
const RANGES = {
  image: { min: 0.2, max: 1.5 },
  radius: { min: 0, max: 240 },
  force: { min: 0, max: 120 },
} as const;

// Outer guard — keeps the heavy motion.div tree (useMotionValue, useTransform,
// nested AnimatePresence) out of the React tree entirely on sub-lg viewports.
// The intro is desktop-only, so mobile shouldn't pay for it at all.
export function DemoCursor(props: DemoCursorProps) {
  const [enabled, setEnabled] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setEnabled(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  if (!enabled) return null;
  return <DemoCursorImpl {...props} />;
}

function DemoCursorImpl({
  wrapper,
  imageSlider,
  radiusSlider,
  forceSlider,
  canvas,
  current,
  onImageScale,
  onMouseRadius,
  onMouseForce,
  onReset,
}: DemoCursorProps) {
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

    // Center of `el` expressed in wrapper-local coords.
    const center = (el: HTMLElement | null) => {
      const wr = wrap.getBoundingClientRect();
      if (!el) return { x: wr.width / 2, y: wr.height / 2 };
      const r = el.getBoundingClientRect();
      return {
        x: r.left - wr.left + r.width / 2,
        y: r.top - wr.top + r.height / 2,
      };
    };

    // Position the cursor where the slider's red indicator actually sits.
    // DialSlider's indicator is fixed at the track center (the strip of ticks
    // scrolls underneath), so the cursor locks to centre and "holds" the
    // pointer in place. TickSlider's indicator slides to `pct%` of the track,
    // so the cursor rides along with it.
    const thumbPoint = (
      slider: React.RefObject<HTMLDivElement | null>,
      range: { min: number; max: number },
      value: number,
    ) => {
      const wr = wrap.getBoundingClientRect();
      const outer = slider.current;
      if (!outer) return { x: wr.width / 2, y: wr.height / 2 };
      const dialTrack = outer.querySelector<HTMLElement>('[role="slider"]');
      const track =
        dialTrack ??
        outer.querySelector<HTMLElement>('input[type="range"]') ??
        outer;
      const r = track.getBoundingClientRect();
      const t = dialTrack
        ? 0.5
        : Math.min(
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
      decimals: number,
    ) => {
      await animate(get(), target, {
        duration,
        ease: "easeInOut",
        onUpdate: (v) => {
          set(decimals === 0 ? Math.round(v) : Number(v.toFixed(decimals)));
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
      // Land on each slider at its current thumb position, not the center —
      // so the grab starts where a real cursor would actually pick up.
      const imgEntry = thumbPoint(
        imageSlider,
        RANGES.image,
        current.current.imageScale,
      );
      const radEntry = thumbPoint(
        radiusSlider,
        RANGES.radius,
        current.current.mouseRadius,
      );
      const forceEntry = thumbPoint(
        forceSlider,
        RANGES.force,
        current.current.mouseForce,
      );
      const canv = center(canvas.current);

      // Start off-screen right, blurred and invisible. The wrapper has
      // overflow-hidden, so positioning past its right edge is enough to
      // clip the cursor cleanly.
      x.set(startX);
      y.set(imgEntry.y);
      blur.set(28);
      opacity.set(0);
      setCursorMode("arrow");
      setVisible(true);

      // 1) Enter — drift in toward the image-size thumb, blur clears.
      await Promise.all([
        animate(opacity, 1, { duration: 0.45, ease: "easeOut" }).finished,
        animate(blur, 0, { duration: 0.55, ease: "easeOut" }).finished,
        animate(x, imgEntry.x, {
          duration: 1.0,
          ease: [0.22, 1, 0.36, 1],
        }).finished,
        animate(y, imgEntry.y, {
          duration: 1.0,
          ease: [0.22, 1, 0.36, 1],
        }).finished,
      ]);
      if (cancelled) return;
      await wait(160);

      // 2) Grab and drag image size — cursor rides the thumb across the track.
      setCursorMode("grab");
      await wait(130);
      await dragSlider(
        imageSlider,
        RANGES.image,
        () => current.current.imageScale,
        onImageScale,
        TARGET_IMAGE,
        0.7,
        2,
      );
      if (cancelled) return;
      await wait(140);

      // 3) Release and travel to the radius thumb.
      setCursorMode("arrow");
      await Promise.all([
        animate(x, radEntry.x, {
          duration: 0.55,
          ease: [0.5, 0, 0.2, 1],
        }).finished,
        animate(y, radEntry.y, {
          duration: 0.55,
          ease: [0.5, 0, 0.2, 1],
        }).finished,
      ]);
      if (cancelled) return;
      await wait(100);

      // 4) Drag radius to target.
      setCursorMode("grab");
      await wait(130);
      await dragSlider(
        radiusSlider,
        RANGES.radius,
        () => current.current.mouseRadius,
        onMouseRadius,
        TARGET_RADIUS,
        0.55,
        0,
      );
      if (cancelled) return;
      await wait(140);

      // 5) Travel to the force thumb.
      setCursorMode("arrow");
      await Promise.all([
        animate(x, forceEntry.x, {
          duration: 0.5,
          ease: [0.5, 0, 0.2, 1],
        }).finished,
        animate(y, forceEntry.y, {
          duration: 0.5,
          ease: [0.5, 0, 0.2, 1],
        }).finished,
      ]);
      if (cancelled) return;
      await wait(100);

      // 6) Drag force to target.
      setCursorMode("grab");
      await wait(130);
      await dragSlider(
        forceSlider,
        RANGES.force,
        () => current.current.mouseForce,
        onMouseForce,
        TARGET_FORCE,
        0.45,
        0,
      );
      if (cancelled) return;
      await wait(180);

      // 7) Cross to the canvas — arrow cursor over the particle field.
      setCursorMode("arrow");
      await Promise.all([
        animate(x, canv.x, { duration: 0.85, ease: [0.5, 0, 0.2, 1] }).finished,
        animate(y, canv.y, { duration: 0.85, ease: [0.5, 0, 0.2, 1] }).finished,
      ]);
      if (cancelled) return;

      // 8) Hover demo — orbit the canvas center while dispatching real
      //    PointerEvents so the particle field actually reacts. Coords are
      //    converted back to clientX/Y for the canvas's local-coord math.
      const canvasEl = canvas.current?.querySelector("canvas") ?? null;
      const wrNow = wrap.getBoundingClientRect();
      const dispatchPointer = (type: string, cx: number, cy: number) => {
        if (!canvasEl) return;
        try {
          canvasEl.dispatchEvent(
            new PointerEvent(type, {
              clientX: wrNow.left + cx,
              clientY: wrNow.top + cy,
              pointerType: "mouse",
              bubbles: true,
            }),
          );
        } catch {
          // PointerEvent constructor may be unavailable; skip hover demo.
        }
      };

      const canvasBox = canvas.current;
      const minSide = canvasBox
        ? Math.min(canvasBox.clientWidth, canvasBox.clientHeight)
        : 320;
      const orbitR = minSide * 0.18;
      const steps = 48;
      for (let i = 0; i <= steps; i++) {
        if (cancelled) break;
        const t = i / steps;
        // One full turn, radius pulses gently so the loop reads as motion
        // rather than a rigid circle.
        const angle = t * Math.PI * 2;
        const r = orbitR * (0.6 + 0.4 * Math.sin(t * Math.PI));
        const cx = canv.x + Math.cos(angle) * r;
        const cy = canv.y + Math.sin(angle) * r;
        x.set(cx);
        y.set(cy);
        dispatchPointer("pointermove", cx, cy);
        await wait(14);
      }
      dispatchPointer("pointerleave", 0, 0);
      if (cancelled) return;
      await wait(140);

      // 9) Exit — blur out toward the right.
      await Promise.all([
        animate(opacity, 0, { duration: 0.5, ease: "easeIn" }).finished,
        animate(blur, 28, { duration: 0.5, ease: "easeIn" }).finished,
        animate(x, wrNow.width + 140, { duration: 0.6, ease: "easeIn" }).finished,
      ]);
      if (cancelled) return;
      setVisible(false);

      // 10) Once the cursor is gone, snap the controls back to their
      //     defaults — same effect as the user hitting the reset button.
      await wait(180);
      if (cancelled) return;
      onReset();
    };

    // Trigger when ~70% of the section is on screen. On viewports too short
    // for that ratio (rare on lg+), we also fire when the visible portion
    // covers 90%+ of the viewport — so the panel still has the spotlight.
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
    canvas,
    current,
    forceSlider,
    imageSlider,
    onImageScale,
    onMouseForce,
    onMouseRadius,
    onReset,
    opacity,
    radiusSlider,
    reduceMotion,
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
      {/* Nudge the head so the pointer tip sits at (x, y). */}
      <div className="relative" style={{ transform: "translate(-2px, 0)" }}>
        <PillSvg />
        {/* Cursor head floats above the pill and morphs between arrow ↔ grab. */}
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
                <ArrowHead />
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
                <GrabHead />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Cursor mark pieces ──────────────────────────────────────────────── */

export type AvatarStop = { offset: string; color: string };

const DEFAULT_AVATAR_STOPS: AvatarStop[] = [
  { offset: "0%", color: "#FFD3B5" },
  { offset: "55%", color: "#9B8CFF" },
  { offset: "100%", color: "#3F2E7A" },
];

export function PillSvg({
  color = "#2B96D8",
  avatarStops = DEFAULT_AVATAR_STOPS,
}: { color?: string; avatarStops?: AvatarStop[] } = {}) {
  // The "You" pill lives in its own SVG so the cursor head above can be
  // swapped/morphed without re-laying-out the label.
  // `useId` keeps the avatar gradient unique per instance so two pills on
  // the page (cosmo + spinner sections) don't share a single <defs> id.
  const reactId = React.useId();
  const gradientId = `demoCursorAvatar-${reactId.replace(/:/g, "")}`;
  return (
    <svg
      width={88}
      height={64}
      viewBox="0 0 88 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x={10} y={23} width={78} height={41} rx={20.5} fill={color} />
      <circle
        cx={32.5}
        cy={43.5}
        r={13.25}
        fill={`url(#${gradientId})`}
        stroke="white"
        strokeWidth={2.5}
      />
      <path
        d="M51.3807 37.3636H53.375L56.4148 42.6534H56.5398L59.5795 37.3636H61.5739L57.3523 44.4318V49H55.6023V44.4318L51.3807 37.3636ZM65.3338 49.1761C64.5156 49.1761 63.8016 48.9886 63.1918 48.6136C62.5819 48.2386 62.1084 47.714 61.7713 47.0398C61.4342 46.3655 61.2656 45.5777 61.2656 44.6761C61.2656 43.7708 61.4342 42.9792 61.7713 42.3011C62.1084 41.6231 62.5819 41.0966 63.1918 40.7216C63.8016 40.3466 64.5156 40.1591 65.3338 40.1591C66.152 40.1591 66.866 40.3466 67.4759 40.7216C68.0857 41.0966 68.5592 41.6231 68.8963 42.3011C69.2334 42.9792 69.402 43.7708 69.402 44.6761C69.402 45.5777 69.2334 46.3655 68.8963 47.0398C68.5592 47.714 68.0857 48.2386 67.4759 48.6136C66.866 48.9886 66.152 49.1761 65.3338 49.1761ZM65.3395 47.75C65.8698 47.75 66.3092 47.6098 66.6577 47.3295C67.0062 47.0492 67.2637 46.6761 67.4304 46.2102C67.6009 45.7443 67.6861 45.2311 67.6861 44.6705C67.6861 44.1136 67.6009 43.6023 67.4304 43.1364C67.2637 42.6667 67.0062 42.2898 66.6577 42.0057C66.3092 41.7216 65.8698 41.5795 65.3395 41.5795C64.8054 41.5795 64.3622 41.7216 64.0099 42.0057C63.6615 42.2898 63.402 42.6667 63.2315 43.1364C63.0649 43.6023 62.9815 44.1136 62.9815 44.6705C62.9815 45.2311 63.0649 45.7443 63.2315 46.2102C63.402 46.6761 63.6615 47.0492 64.0099 47.3295C64.3622 47.6098 64.8054 47.75 65.3395 47.75ZM76.8267 45.3807V40.2727H78.5312V49H76.8608V47.4886H76.7699C76.5691 47.9545 76.2472 48.3428 75.804 48.6534C75.3646 48.9602 74.8172 49.1136 74.1619 49.1136C73.6013 49.1136 73.1051 48.9905 72.6733 48.7443C72.2453 48.4943 71.9081 48.125 71.6619 47.6364C71.4195 47.1477 71.2983 46.5436 71.2983 45.8239V40.2727H72.9972V45.6193C72.9972 46.214 73.1619 46.6875 73.4915 47.0398C73.821 47.392 74.2491 47.5682 74.7756 47.5682C75.0938 47.5682 75.41 47.4886 75.7244 47.3295C76.0426 47.1705 76.3059 46.9299 76.5142 46.608C76.7263 46.286 76.8305 45.8769 76.8267 45.3807Z"
        fill="white"
      />
      <defs>
        {/* Soft radial avatar — caller can override the stops to retune the
            disc for the surrounding pill color. */}
        <radialGradient
          id={gradientId}
          cx="0.32"
          cy="0.28"
          r="0.95"
          gradientUnits="objectBoundingBox"
        >
          {avatarStops.map((stop) => (
            <stop
              key={stop.offset}
              offset={stop.offset}
              stopColor={stop.color}
            />
          ))}
        </radialGradient>
      </defs>
    </svg>
  );
}

export function ArrowHead({
  color = "#0087FF",
  colorDeep = "#4B5BE5",
}: { color?: string; colorDeep?: string } = {}) {
  return (
    <svg
      width={20}
      height={22}
      viewBox="0 0 20 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.4 13.36 L8.6 13.52 L2.6 20 L2.6 0 Z" fill={color} />
      <path d="M17.4 13.36 L8.6 13.52 L2.6 0 Z" fill={colorDeep} />
    </svg>
  );
}

export function GrabHead({
  color = "#0087FF",
}: { color?: string } = {}) {
  // Closed-fist "grabbing" pointer — Lucide's HandGrab knuckles + wrist,
  // filled with the brand accent and outlined in white so it reads against
  // both the dark canvas and the brighter slider rows. Sized so the
  // pinch point sits near (3, 2) — the cursor tip is already nudged by
  // translate(-2px, 0) at the wrapper, so the visual contact lands very
  // close to where the arrow tip was.
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill={color}
      stroke="#FFFFFF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Wrist + palm */}
      <path
        d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0"
      />
      {/* Knuckles, descending */}
      <path d="M18 11.5V9a2 2 0 0 0-2-2 2 2 0 0 0-2 2v1.4" />
      <path d="M14 10V8a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2" />
      <path d="M10 9.9V9a2 2 0 0 0-2-2 2 2 0 0 0-2 2v5" />
      <path d="M6 14a2 2 0 0 0-2-2 2 2 0 0 0-2 2" />
    </svg>
  );
}
