"use client";

import * as React from "react";
import {
  Heart,
  Pause,
  Play,
  RotateCcw,
  Save,
  Sparkles,
  Star,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SourceShape = "star" | "circle" | "heart";

type Particle = {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
};

const SOURCES: { value: SourceShape; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "star", label: "Star", icon: Star },
  { value: "circle", label: "Circle", icon: Circle },
  { value: "heart", label: "Heart", icon: Heart },
];

function starPoint(t: number, radius: number) {
  // 5-point star outline parametric
  const angle = t * Math.PI * 2;
  const k = Math.floor((t * 10) % 10);
  const r = k % 2 === 0 ? radius : radius * 0.42;
  return {
    x: Math.sin(angle) * r,
    y: -Math.cos(angle) * r,
  };
}

function circlePoint(t: number, radius: number) {
  const angle = t * Math.PI * 2;
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}

function heartPoint(t: number, radius: number) {
  const angle = t * Math.PI * 2;
  const scale = radius / 16;
  const x = 16 * Math.pow(Math.sin(angle), 3);
  const y = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
  return { x: x * scale, y: y * scale };
}

function shapePoint(shape: SourceShape, t: number, radius: number) {
  switch (shape) {
    case "star":
      return starPoint(t, radius);
    case "circle":
      return circlePoint(t, radius);
    case "heart":
      return heartPoint(t, radius);
  }
}

export function CosmaPlayground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const particlesRef = React.useRef<Particle[]>([]);
  const rafRef = React.useRef<number | null>(null);
  const dprRef = React.useRef(1);

  const [shape, setShape] = React.useState<SourceShape>("star");
  const [count, setCount] = React.useState(1200);
  const [size, setSize] = React.useState(1.6);
  const [speed, setSpeed] = React.useState(0.6);
  const [color, setColor] = React.useState("#d946ef");
  const [glow, setGlow] = React.useState(true);
  const [playing, setPlaying] = React.useState(true);
  const [resetKey, setResetKey] = React.useState(0);

  const seedParticles = React.useCallback(
    (width: number, height: number) => {
      const radius = Math.min(width, height) * 0.32;
      const cx = width / 2;
      const cy = height / 2;
      const next: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const t = i / count;
        const { x, y } = shapePoint(shape, t, radius);
        const jitter = (Math.random() - 0.5) * 6;
        const ox = cx + x + jitter;
        const oy = cy + y + jitter;
        next.push({
          ox,
          oy,
          x: ox,
          y: oy,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          r: Math.random() * size + size * 0.4,
          hue: Math.random() * 0.2,
        });
      }
      particlesRef.current = next;
    },
    [shape, count, size],
  );

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    dprRef.current = dpr;
    const resize = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      seedParticles(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    return () => ro.disconnect();
  }, [seedParticles, resetKey]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = dprRef.current;

    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (glow) {
        ctx.shadowBlur = 8 * dpr;
        ctx.shadowColor = color;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.fillStyle = color;

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (playing) {
          // organic drift, gentle pull back to origin
          p.vx += (Math.random() - 0.5) * 0.12 * speed;
          p.vy += (Math.random() - 0.5) * 0.12 * speed;
          p.vx *= 0.92;
          p.vy *= 0.92;
          const dx = p.ox - p.x;
          const dy = p.oy - p.y;
          p.vx += dx * 0.02 * speed;
          p.vy += dy * 0.02 * speed;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        }
        ctx.beginPath();
        ctx.arc(p.x * dpr, p.y * dpr, p.r * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [color, glow, playing, speed]);

  const reset = () => {
    setResetKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Canvas */}
      <div className="relative rounded-2xl border border-border/60 bg-card overflow-hidden">
        <div className="relative h-[420px] sm:h-[520px]">
          <canvas ref={canvasRef} className="block h-full w-full" />
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/80 p-1 backdrop-blur">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause" : "Play"}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label="Reset"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-2xl border border-border/60 bg-card p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Controls
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Presets
            </Button>
            <Button size="sm" className="h-8 gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700">
              <Save className="h-3.5 w-3.5" />
              Save
            </Button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Color */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-9 w-12 cursor-pointer rounded-md border border-border/60 bg-background"
                aria-label="Particle color"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-9 w-full rounded-md border border-border/60 bg-background px-2 font-mono text-xs"
                aria-label="Particle color hex"
              />
            </div>
          </div>

          {/* Source */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Source</label>
            <div className="grid grid-cols-3 gap-1.5 rounded-md border border-border/60 bg-background p-1">
              {SOURCES.map((s) => {
                const Icon = s.icon;
                const active = shape === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => {
                      setShape(s.value);
                      reset();
                    }}
                    className={cn(
                      "inline-flex h-7 items-center justify-center gap-1.5 rounded-sm text-xs font-medium transition-colors",
                      active
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Effects */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Effects</label>
            <button
              type="button"
              onClick={() => setGlow((g) => !g)}
              className={cn(
                "inline-flex h-9 items-center justify-between rounded-md border border-border/60 bg-background px-3 text-xs font-medium transition-colors",
                glow ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                Glow
              </span>
              <span
                className={cn(
                  "inline-flex h-4 w-7 items-center rounded-full px-0.5 transition-colors",
                  glow ? "bg-emerald-500/80 justify-end" : "bg-muted justify-start",
                )}
              >
                <span className="h-3 w-3 rounded-full bg-background" />
              </span>
            </button>
          </div>

          {/* Count */}
          <Slider
            label="Count"
            value={count}
            min={200}
            max={4000}
            step={100}
            onChange={(v) => {
              setCount(v);
              reset();
            }}
            display={count.toString()}
          />

          {/* Size */}
          <Slider
            label="Size"
            value={size}
            min={0.5}
            max={4}
            step={0.1}
            onChange={(v) => {
              setSize(v);
              reset();
            }}
            display={`${size.toFixed(1)}px`}
          />

          {/* Speed */}
          <Slider
            label="Speed"
            value={speed}
            min={0.1}
            max={2}
            step={0.1}
            onChange={setSpeed}
            display={`${speed.toFixed(1)}x`}
          />
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        <span className="font-mono text-[10px] text-foreground/70">{display}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-fuchsia-500"
      />
    </div>
  );
}
