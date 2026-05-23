"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, RotateCcw, Sparkles } from "lucide-react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useVelocity,
  useSpring,
  useTransform,
  type MotionValue,
  type TargetAndTransition,
} from "motion/react";
import { Button } from "@/components/ui/button";

/**
 * Particle-morph section for the homepage. The "Copy. Paste. Ship." CTA stands
 * on its own so nothing competes with it; an interactive demo below pairs the
 * controls (left) with the particle canvas (right), where particles converge
 * into the D2 mark (/cosmo.png). The canvas is transparent so the theme
 * background shows through.
 */

const SRC = "/cosmo.png";
const PARTICLE_COUNT = 4000;
const PARTICLE_RADIUS = 0.6;
const SPEED = 0.55;
const DRIFT = 0.2;
const GLOW_R = PARTICLE_RADIUS * (2.4 + 0.2 * 1.8); // 1.656 (glowStrength 0.20)
const GLOW_ALPHA = 0.18 + 0.2 * 0.35; // 0.25 (glowStrength 0.20)
const TAU = Math.PI * 2;

/* Control defaults — shared by the initial state and the reset button. */
const DEFAULT_IMAGE_SCALE = 0.4;
const DEFAULT_MOUSE_RADIUS = 51;
const DEFAULT_MOUSE_FORCE = 7;

type MouseMode = "repel" | "attract" | "circle";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  seed: number;
  restAngle: number;
  restR01: number;
  color: string;
};

type CanvasConfig = {
  imageScale: number;
  mouseMode: MouseMode;
  mouseRadius: number;
  mouseForce: number;
};

/* ── Particle canvas ─────────────────────────────────────────────────── */

function CosmoCanvas({ imageScale, mouseMode, mouseRadius, mouseForce }: CanvasConfig) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const particlesRef = React.useRef<Particle[]>([]);
  const sizeRef = React.useRef({ w: 0, h: 0 });
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const mouseRef = React.useRef({ x: 0, y: 0, active: false });
  const cfgRef = React.useRef<CanvasConfig>({
    imageScale,
    mouseMode,
    mouseRadius,
    mouseForce,
  });

  React.useEffect(() => {
    cfgRef.current = { imageScale, mouseMode, mouseRadius, mouseForce };
  }, [imageScale, mouseMode, mouseRadius, mouseForce]);

  // Steps 1+2: draw the source onto an offscreen canvas at fit-contain
  // imageScale, then sample target positions + per-particle colors.
  const sample = React.useCallback(() => {
    const { w: W, h: H } = sizeRef.current;
    const img = imgRef.current;
    if (W === 0 || H === 0 || !img) return;

    const off = document.createElement("canvas");
    off.width = W;
    off.height = H;
    const offCtx = off.getContext("2d", { willReadFrequently: true });
    if (!offCtx) return;

    const scale = Math.max(0.1, Math.min(1.5, cfgRef.current.imageScale));
    const tW = W * scale;
    const tH = H * scale;
    const ratio = img.naturalWidth / img.naturalHeight;
    let dw = tW;
    let dh = tW / ratio;
    if (dh > tH) {
      dh = tH;
      dw = tH * ratio;
    }
    offCtx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);

    const data = offCtx.getImageData(0, 0, W, H).data;
    const candidates: number[][] = [];
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        if (data[i + 3] > 128) candidates.push([x, y, data[i], data[i + 1], data[i + 2]]);
      }
    }

    const list = particlesRef.current;
    if (list.length !== PARTICLE_COUNT) {
      list.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        list.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: 0,
          vy: 0,
          tx: W / 2,
          ty: H / 2,
          seed: Math.random() * 1000,
          restAngle: Math.random() * TAU,
          restR01: Math.sqrt(Math.random()),
          color: "#00f5a0",
        });
      }
    }

    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      if (candidates.length === 0) {
        p.tx = Math.random() * W;
        p.ty = Math.random() * H;
        p.color = "#00f5a0";
      } else {
        const c = candidates[(Math.random() * candidates.length) | 0];
        p.tx = c[0];
        p.ty = c[1];
        p.color = `rgb(${c[2]},${c[3]},${c[4]})`;
      }
    }
  }, []);

  // Re-sample whenever the image size changes.
  React.useEffect(() => {
    sample();
  }, [imageScale, sample]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w: rect.width, h: rect.height };
      sample();
    };

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      sample();
    };
    img.src = SRC;

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointercancel", onLeave);

    const render = (now: number) => {
      const { w: W, h: H } = sizeRef.current;
      const cfg = cfgRef.current;
      const t = now * 0.001;
      const stiffness = 0.02 * Math.max(0.05, SPEED);
      const damping = 0.86;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      const mActive = mouse.active && cfg.mouseForce > 0 && cfg.mouseRadius > 0;
      const mRad = cfg.mouseRadius;
      const mRad2 = mRad * mRad;
      const mode = cfg.mouseMode;
      const useCircle = mActive && mode === "circle";
      const useImpulse = mActive && (mode === "repel" || mode === "attract");
      const impulseSign = mode === "attract" ? -1 : 1;
      const depositR = mRad * 0.7;
      const magnetK = 0.04 * Math.max(0.2, cfg.mouseForce / 30);
      const magnetDamp = 0.78;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        let captured = false;
        if (useCircle) {
          const mdx = mouse.x - p.x;
          const mdy = mouse.y - p.y;
          if (mdx * mdx + mdy * mdy < mRad2) captured = true;
        }

        let targetX: number;
        let targetY: number;
        let k: number;
        let d: number;
        if (captured) {
          const r = depositR * p.restR01;
          targetX = mouse.x + Math.cos(p.restAngle) * r;
          targetY = mouse.y + Math.sin(p.restAngle) * r;
          k = magnetK;
          d = magnetDamp;
        } else {
          targetX = p.tx;
          targetY = p.ty;
          k = stiffness;
          d = damping;
        }

        p.vx = (p.vx + (targetX - p.x) * k) * d;
        p.vy = (p.vy + (targetY - p.y) * k) * d;

        if (useImpulse) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const md2 = mdx * mdx + mdy * mdy;
          if (md2 < mRad2 && md2 > 0.01) {
            const md = Math.sqrt(md2);
            const falloff = 1 - md / mRad;
            const push = (falloff * falloff * cfg.mouseForce * impulseSign) / md;
            p.vx += mdx * push;
            p.vy += mdy * push;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        if (!captured) {
          const sdx = p.tx - p.x;
          const sdy = p.ty - p.y;
          if (sdx * sdx + sdy * sdy < 4) {
            p.x += Math.sin(t * 2 + p.seed) * DRIFT * 0.5;
            p.y += Math.cos(t * 1.7 + p.seed * 0.7) * DRIFT * 0.5;
          }
        }
      }

      // Transparent clear — the theme background shows through.
      ctx.clearRect(0, 0, W, H);

      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = GLOW_ALPHA;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, GLOW_R, 0, TAU);
        ctx.fill();
      }

      // Solid core — kept on the same additive "lighter" pass as the halo,
      // so dense overlaps bloom. The generator never switches to "source-over".
      ctx.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, TAU);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      img.onload = null;
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointercancel", onLeave);
    };
  }, [sample]);

  return <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />;
}

/* ── Hero + controls ─────────────────────────────────────────────────── */

export function CosmoMorph() {
  const [imageScale, setImageScale] = React.useState(DEFAULT_IMAGE_SCALE);
  const mouseMode: MouseMode = "attract";
  const [mouseRadius, setMouseRadius] = React.useState(DEFAULT_MOUSE_RADIUS);
  const [mouseForce, setMouseForce] = React.useState(DEFAULT_MOUSE_FORCE);

  const resetControls = () => {
    setImageScale(DEFAULT_IMAGE_SCALE);
    setMouseRadius(DEFAULT_MOUSE_RADIUS);
    setMouseForce(DEFAULT_MOUSE_FORCE);
  };

  return (
    <div className="luminous-spinners overflow-hidden bg-background lg:rounded-xl border m-0">
      {/* ── CTA ── Headline + subtitle + primary action stand on their own,
          so nothing competes with the page's top focal point. */}
      <div className="flex flex-col items-center gap-5 px-6 py-16 text-center lg:py-20">
        <h3 className="font-sans text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
          Copy. Paste. Ship.
        </h3>
        <p className="mx-auto max-w-xl text-sm text-muted-foreground md:text-base">
          Production-ready components built on shadcn/ui. No package install,
          no abstraction — just code you own.
        </p>
        <Button className="mt-1 h-11" asChild>
          <Link href="/blocks">
            Browse components <ArrowUpRight />
          </Link>
        </Button>
      </div>

      {/* ── Interactive demo ── A clearly secondary block beneath the CTA:
          controls on the left, particle canvas on the right. */}
      <div className="grid grid-cols-1 border-t border-[var(--ls-border)] lg:grid-cols-2">
        {/* Controls — left */}
        <div className="order-2 flex flex-col justify-center px-6 py-8 lg:order-1 lg:border-r lg:border-[var(--ls-border)] lg:px-10">
          <div className="mx-auto w-full max-w-[21rem] space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[var(--ls-border)] bg-[var(--ls-foreground)]/[0.06]">
                  <Sparkles size={13} className="text-[var(--ls-muted-foreground)]" />
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-foreground)]">
                  Try the effect
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
              <DialSlider
                label="Image size"
                value={imageScale}
                min={0.2}
                max={1.5}
                step={0.01}
                warnAbove={0.45}
                editable
                onChange={setImageScale}
              />
              <TickSlider
                label="Radius"
                value={mouseRadius}
                min={0}
                max={240}
                step={1}
                unit="px"
                onChange={setMouseRadius}
              />
              <TickSlider
                label="Force"
                value={mouseForce}
                min={0}
                max={120}
                step={1}
                onChange={setMouseForce}
              />
            </div>
          </div>
        </div>

        {/* Particle canvas — right. Dark mode uses the site background so the
            panel blends in; light mode keeps a fixed dark backdrop, since the
            particles use additive ("lighter") compositing and only read on dark. */}
        <div className="relative order-1 min-h-[300px] bg-[#0c0c0c] dark:bg-background lg:order-2 lg:min-h-[440px]">
          <CosmoCanvas
            imageScale={imageScale}
            mouseMode={mouseMode}
            mouseRadius={mouseRadius}
            mouseForce={mouseForce}
          />
        </div>
      </div>

      {/* Footer — a quiet link out to the full Cosmo playground. */}
      <div className="flex justify-center border-t border-[var(--ls-border)] px-6 py-5">
        <TryYoursLink />
      </div>
    </div>
  );
}

/* ── "Try yours" link with a spring-in preview ───────────────────────── */

function TryYoursLink() {
  const [hovered, setHovered] = React.useState(false);
  const reduceMotion = useReducedMotion();

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
            className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 w-48"
            style={{ transformOrigin: "bottom center" }}
            initial={popInitial}
            animate={popAnimate}
            exit={popExit}
          >
            {/* A small card springs up into the full-size preview. */}
            <Image
              src="/192.png"
              alt="D2 Cosmo playground preview"
              width={192}
              height={100}
              className="w-full rounded-lg border border-[var(--ls-border)] shadow-2xl dark:border-white/15"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <span>Wanna get?</span>
      <Link
        href="/cosma"
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

/* ── Control primitives (verbatim from the cosmo playground) ─────────── */

export function TickSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  editable,
  warnAbove,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
  editable?: boolean;
  warnAbove?: number;
}) {
  const isWarn = warnAbove !== undefined && value > warnAbove;
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const decimals = step >= 1 ? 0 : step.toString().split(".")[1]?.length ?? 1;
  const display = value.toFixed(decimals);
  const tickCount = 36;

  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(display);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!editing) setDraft(display);
  }, [display, editing]);

  const commit = () => {
    const n = Number(draft);
    if (Number.isFinite(n)) {
      const clamped = Math.min(max, Math.max(min, n));
      onChange(clamped);
      setDraft(clamped.toFixed(decimals));
    } else {
      setDraft(display);
    }
    setEditing(false);
  };

  const pctMV = useMotionValue(pct);
  React.useEffect(() => {
    pctMV.set(pct);
  }, [pct, pctMV]);

  const rawVelocity = useVelocity(pctMV);
  const smoothVelocity = useSpring(rawVelocity, {
    stiffness: 300,
    damping: 18,
    mass: 0.4,
  });

  const indicatorScaleY = useTransform(smoothVelocity, (v) =>
    1 + Math.min(Math.abs(v) / 260, 1) * 0.9
  );

  return (
    <div className="group flex items-center gap-3 rounded-full border border-[var(--ls-border)] bg-[var(--ls-card)] px-3.5 py-2 shadow-[0_1px_2px_-1px_rgba(0,0,0,0.18),0_2px_6px_-3px_rgba(0,0,0,0.18)] transition-shadow hover:shadow-[0_2px_4px_-2px_rgba(0,0,0,0.22),0_4px_10px_-4px_rgba(0,0,0,0.22)]">
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ls-muted-foreground)]">
        {label}
      </span>
      <div className="relative flex-1 h-5">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex h-3 -translate-y-1/2 items-stretch justify-between">
          {Array.from({ length: tickCount }).map((_, i) => (
            <Tick
              key={i}
              index={i}
              tickCount={tickCount}
              pctMV={pctMV}
              velocity={smoothVelocity}
            />
          ))}
        </div>
        <motion.div
          className="pointer-events-none absolute top-1/2 h-4 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-[1px] transition-[background-color,box-shadow] duration-200"
          style={{
            left: `${pct}%`,
            scale: indicatorScaleY,
            transformOrigin: "50% 50%",
            backgroundColor: isWarn ? "oklch(0.78 0.19 60)" : "oklch(0.72 0.24 5)",
            boxShadow: isWarn
              ? "0 0 4px oklch(0.78 0.19 60 / 0.9), 0 0 10px oklch(0.78 0.19 60 / 0.55)"
              : "0 0 4px oklch(0.72 0.24 5 / 0.9), 0 0 10px oklch(0.72 0.24 5 / 0.55)",
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
          aria-label={label}
        />
      </div>
      {editable ? (
        editing ? (
          <div className="flex shrink-0 items-center gap-0.5 rounded border border-white/30 bg-[var(--ls-card)] px-1.5 py-0.5 font-mono text-xs text-[var(--ls-foreground)]">
            <input
              ref={inputRef}
              type="number"
              min={min}
              max={max}
              step={step}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                else if (e.key === "Escape") {
                  setDraft(display);
                  setEditing(false);
                }
              }}
              autoFocus
              className="w-14 bg-transparent text-right tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            {unit && <span className="text-[var(--ls-muted-foreground)]">{unit}</span>}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setDraft(display);
              setEditing(true);
              requestAnimationFrame(() => inputRef.current?.focus());
            }}
            className="shrink-0 cursor-text font-mono text-xs tabular-nums text-[var(--ls-foreground)] hover:underline decoration-dotted underline-offset-2"
            title="Click to edit"
          >
            {display}
            {unit ? <span className="ml-0.5 text-[var(--ls-muted-foreground)]">{unit}</span> : null}
          </button>
        )
      ) : (
        <span className="shrink-0 font-mono text-xs tabular-nums text-[var(--ls-foreground)]">
          {display}
          {unit ? <span className="ml-0.5 text-[var(--ls-muted-foreground)]">{unit}</span> : null}
        </span>
      )}
    </div>
  );
}

function Tick({
  index,
  tickCount,
  pctMV,
  velocity,
}: {
  index: number;
  tickCount: number;
  pctMV: MotionValue<number>;
  velocity: MotionValue<number>;
}) {
  const tickPct = (index / (tickCount - 1)) * 100;

  const scaleY = useTransform<number, number>(
    [pctMV, velocity] as unknown as MotionValue<number>[],
    (latest) => {
      const [p, v] = latest as unknown as [number, number];
      const dist = Math.abs(tickPct - p);
      const intensity = Math.min(Math.abs(v) / 260, 1);
      const sigma = 8 + intensity * 22;
      const envelope = Math.exp(-(dist * dist) / (2 * sigma * sigma));
      return 1 + envelope * intensity * 2.4;
    }
  );

  const opacity = useTransform(pctMV, (p) => (tickPct <= p ? 0.7 : 0.15));

  return (
    <motion.span
      className="w-px origin-center bg-[var(--ls-foreground)]"
      style={{ scaleY, opacity }}
    />
  );
}

function DialSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  editable,
  warnAbove,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
  editable?: boolean;
  warnAbove?: number;
}) {
  const isWarn = warnAbove !== undefined && value > warnAbove;
  const decimals = step >= 1 ? 0 : step.toString().split(".")[1]?.length ?? 1;
  const display = value.toFixed(decimals);

  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(display);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!editing) setDraft(display);
  }, [display, editing]);

  const commit = () => {
    const n = Number(draft);
    if (Number.isFinite(n)) {
      const clamped = Math.min(max, Math.max(min, n));
      onChange(clamped);
      setDraft(clamped.toFixed(decimals));
    } else {
      setDraft(display);
    }
    setEditing(false);
  };

  const tickSpacing = 5;
  const numSteps = Math.max(1, Math.round((max - min) / step));
  const stripWidth = numSteps * tickSpacing;

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [viewportWidth, setViewportWidth] = React.useState(0);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setViewportWidth(el.clientWidth);
    const ro = new ResizeObserver((entries) => {
      setViewportWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const valueToX = React.useCallback(
    (v: number) => viewportWidth / 2 - ((v - min) / step) * tickSpacing,
    [viewportWidth, min, step]
  );
  const xToValue = React.useCallback(
    (px: number) => min + ((viewportWidth / 2 - px) / tickSpacing) * step,
    [viewportWidth, min, step]
  );

  const x = useMotionValue(0);
  const draggingRef = React.useRef(false);
  const syncingRef = React.useRef(false);
  const lastSentRef = React.useRef(value);

  React.useEffect(() => {
    if (draggingRef.current) return;
    if (viewportWidth === 0) return;
    const target = valueToX(value);
    if (Math.abs(x.get() - target) < 0.5) {
      x.set(target);
      lastSentRef.current = value;
      return;
    }
    syncingRef.current = true;
    const controls = animate(x, target, {
      type: "spring",
      stiffness: 320,
      damping: 32,
      mass: 0.5,
    });
    controls.then(() => {
      syncingRef.current = false;
      lastSentRef.current = value;
    });
    return () => {
      controls.stop();
      syncingRef.current = false;
    };
  }, [value, viewportWidth, valueToX, x]);

  useMotionValueEvent(x, "change", (latest) => {
    if (syncingRef.current) return;
    const v = xToValue(latest);
    const snapped = Math.round((v - min) / step) * step + min;
    const clamped = Math.min(max, Math.max(min, snapped));
    const rounded = Number(clamped.toFixed(decimals));
    if (Math.abs(rounded - lastSentRef.current) >= step / 2) {
      lastSentRef.current = rounded;
      onChange(rounded);
    }
  });

  const rawVelocity = useVelocity(x);
  const smoothVelocity = useSpring(rawVelocity, {
    stiffness: 300,
    damping: 18,
    mass: 0.4,
  });
  const indicatorScaleY = useTransform(smoothVelocity, (v) =>
    1 + Math.min(Math.abs(v) / 1400, 1) * 0.9
  );

  const ready = viewportWidth > 0;
  const leftConstraint = viewportWidth / 2 - stripWidth;
  const rightConstraint = viewportWidth / 2;

  return (
    <div className="group flex items-center gap-3 rounded-full border border-[var(--ls-border)] bg-[var(--ls-card)] px-3.5 py-2 shadow-[0_1px_2px_-1px_rgba(0,0,0,0.18),0_2px_6px_-3px_rgba(0,0,0,0.18)] transition-shadow hover:shadow-[0_2px_4px_-2px_rgba(0,0,0,0.22),0_4px_10px_-4px_rgba(0,0,0,0.22)]">
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ls-muted-foreground)]">
        {label}
      </span>
      <div
        ref={containerRef}
        className="relative flex-1 h-5 cursor-grab overflow-hidden touch-none select-none active:cursor-grabbing"
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        {ready && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 h-3"
            style={{ x, width: stripWidth, left: 0 }}
            drag="x"
            dragConstraints={{ left: leftConstraint, right: rightConstraint }}
            dragElastic={0.06}
            dragMomentum
            dragTransition={{
              power: 0.22,
              timeConstant: 260,
              modifyTarget: (target) => {
                const v = xToValue(target);
                const snapped = Math.round((v - min) / step) * step + min;
                const clamped = Math.min(max, Math.max(min, snapped));
                return valueToX(clamped);
              },
            }}
            onDragStart={() => {
              draggingRef.current = true;
            }}
            onDragEnd={() => {
              draggingRef.current = false;
            }}
          >
            {Array.from({ length: numSteps + 1 }).map((_, i) => {
              const isMajor = i % 10 === 0;
              return (
                <span
                  key={i}
                  className={
                    "absolute top-1/2 w-px -translate-x-1/2 -translate-y-1/2 " +
                    (isMajor
                      ? "h-3 bg-[var(--ls-foreground)]/55"
                      : "h-1.5 bg-[var(--ls-foreground)]/22")
                  }
                  style={{ left: i * tickSpacing }}
                />
              );
            })}
          </motion.div>
        )}

        <motion.div
          className="pointer-events-none absolute top-1/2 left-1/2 h-4 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-[1px] transition-[background-color,box-shadow] duration-200"
          style={{
            scale: indicatorScaleY,
            transformOrigin: "50% 50%",
            backgroundColor: isWarn ? "oklch(0.78 0.19 60)" : "oklch(0.72 0.24 5)",
            boxShadow: isWarn
              ? "0 0 4px oklch(0.78 0.19 60 / 0.9), 0 0 10px oklch(0.78 0.19 60 / 0.55)"
              : "0 0 4px oklch(0.72 0.24 5 / 0.9), 0 0 10px oklch(0.72 0.24 5 / 0.55)",
          }}
        />

        <div className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-[var(--ls-card)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-[var(--ls-card)] to-transparent" />
      </div>
      {editable ? (
        editing ? (
          <div className="flex shrink-0 items-center gap-0.5 rounded border border-white/30 bg-[var(--ls-card)] px-1.5 py-0.5 font-mono text-xs text-[var(--ls-foreground)]">
            <input
              ref={inputRef}
              type="number"
              min={min}
              max={max}
              step={step}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                else if (e.key === "Escape") {
                  setDraft(display);
                  setEditing(false);
                }
              }}
              autoFocus
              className="w-14 bg-transparent text-right tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            {unit && <span className="text-[var(--ls-muted-foreground)]">{unit}</span>}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setDraft(display);
              setEditing(true);
              requestAnimationFrame(() => inputRef.current?.focus());
            }}
            className="shrink-0 cursor-text font-mono text-xs tabular-nums text-[var(--ls-foreground)] hover:underline decoration-dotted underline-offset-2"
            title="Click to edit"
          >
            {display}
            {unit ? <span className="ml-0.5 text-[var(--ls-muted-foreground)]">{unit}</span> : null}
          </button>
        )
      ) : (
        <span className="shrink-0 font-mono text-xs tabular-nums text-[var(--ls-foreground)]">
          {display}
          {unit ? <span className="ml-0.5 text-[var(--ls-muted-foreground)]">{unit}</span> : null}
        </span>
      )}
    </div>
  );
}
