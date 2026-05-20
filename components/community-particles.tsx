"use client";

import * as React from "react";

type ColorMode = "gradient" | "solid";
type MouseMode = "attract" | "repel" | "circle";
type SourceType = "image" | "text" | "shape";

interface SourceImage {
  type: "image";
  url: string;
  scale?: number;
}
interface SourceText {
  type: "text";
  text: string;
  scale?: number;
  fontFamily?: string;
  fontWeight?: string;
}
interface SourceShape {
  type: "shape";
  svg: string;
  scale?: number;
}
type Source = SourceImage | SourceText | SourceShape;

interface Effects {
  glow: boolean;
  glowStrength: number;
  twinkle: boolean;
  twinkleSpeed: number;
  hueCycle: boolean;
  hueSpeed: number;
  trails: boolean;
  trailFade: number;
  constellation: boolean;
  constellationDist: number;
  velocityBoost: boolean;
}

interface ParticleConfig {
  count: number;
  size: number;
  speed: number;
  drift: number;
  colorMode: ColorMode;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  mouseRadius: number;
  mouseForce: number;
  mouseMode: MouseMode;
  effects: Effects;
  source: Source;
  background: string;
}

interface CommunityParticlesProps {
  src?: string;
  className?: string;
  config?: Partial<Omit<ParticleConfig, "effects" | "source">> & {
    effects?: Partial<Effects>;
    source?: Source;
  };
}

const DEFAULT_CONFIG: ParticleConfig = {
  count: 4000,
  size: 1.1,
  speed: 0.55,
  drift: 0.3,
  colorMode: "gradient",
  color: "#a78bfa",
  gradientFrom: "#7c3aed",
  gradientTo: "#ec4899",
  mouseRadius: 53,
  mouseForce: 6,
  mouseMode: "attract",
  effects: {
    glow: false,
    glowStrength: 0.55,
    twinkle: false,
    twinkleSpeed: 1,
    hueCycle: false,
    hueSpeed: 0.15,
    trails: false,
    trailFade: 0.12,
    constellation: false,
    constellationDist: 60,
    velocityBoost: false,
  },
  source: { type: "image", url: "/d2-dark.svg", scale: 0.47 },
  background: "transparent",
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  seed: number;
  restAngle: number;
  restR01: number;
}

function hexToRgb(h: string) {
  let hex = h.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  return {
    r: parseInt(hex.slice(0, 2), 16) || 0,
    g: parseInt(hex.slice(2, 4), 16) || 0,
    b: parseInt(hex.slice(4, 6), 16) || 0,
  };
}
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (mx + mn) / 2;
  if (mx !== mn) {
    const d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    if (mx === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return { h, s, l };
}
function hslToRgb(h: number, s: number, l: number) {
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return {
    r: Math.round(f(h + 1 / 3) * 255),
    g: Math.round(f(h) * 255),
    b: Math.round(f(h - 1 / 3) * 255),
  };
}
function shiftHue(hex: string, deg: number) {
  const { r, g, b } = hexToRgb(hex);
  const hsl = rgbToHsl(r, g, b);
  hsl.h = (((hsl.h + deg / 360) % 1) + 1) % 1;
  const o = hslToRgb(hsl.h, hsl.s, hsl.l);
  return `rgb(${o.r},${o.g},${o.b})`;
}

export function CommunityParticles({
  src,
  className,
  config: configOverride,
}: CommunityParticlesProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config: ParticleConfig = {
      ...DEFAULT_CONFIG,
      ...configOverride,
      effects: { ...DEFAULT_CONFIG.effects, ...(configOverride?.effects ?? {}) },
      source:
        configOverride?.source ??
        (src
          ? { type: "image", url: src, scale: 0.47 }
          : DEFAULT_CONFIG.source),
    };

    let particles: Particle[] = [];
    let targets: Array<[number, number]> = [];
    let dpr = 1;
    let W = 0;
    let H = 0;
    let rafId = 0;
    let cancelled = false;
    const mouse = { x: 0, y: 0, active: false };

    const seed = () => {
      particles = targets.map((t, i) => ({
        x: particles[i]?.x ?? Math.random() * W,
        y: particles[i]?.y ?? Math.random() * H,
        vx: 0,
        vy: 0,
        tx: t[0],
        ty: t[1],
        seed: Math.random() * 1000,
        restAngle: Math.random() * Math.PI * 2,
        restR01: Math.sqrt(Math.random()),
      }));
    };

    const sample = () => {
      if (W === 0 || H === 0) return;
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const ox = off.getContext("2d");
      if (!ox) return;
      ox.fillStyle = "#000";

      const finish = () => {
        const data = ox.getImageData(0, 0, W, H).data;
        const cand: Array<[number, number]> = [];
        for (let y = 0; y < H; y += 2)
          for (let x = 0; x < W; x += 2)
            if (data[(y * W + x) * 4 + 3] > 128) cand.push([x, y]);
        targets = cand.length
          ? Array.from(
              { length: config.count },
              () => cand[(Math.random() * cand.length) | 0],
            )
          : Array.from({ length: config.count }, () => [
              Math.random() * W,
              Math.random() * H,
            ]);
        seed();
      };

      const drawImg = (img: HTMLImageElement) => {
        const r = img.width / img.height;
        const s = Math.max(0.1, Math.min(1.5, config.source.scale ?? 0.9));
        let dw = W * s;
        let dh = dw / r;
        if (dh > H * s) {
          dh = H * s;
          dw = dh * r;
        }
        ox.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
        finish();
      };

      if (config.source.type === "text") {
        const scale = Math.max(0.1, Math.min(1.5, config.source.scale ?? 1));
        const fs = Math.max(8, Math.min(W * 0.32, H * 0.6) * scale);
        ox.font = `${config.source.fontWeight ?? "900"} ${fs}px ${config.source.fontFamily ?? "system-ui, sans-serif"}`;
        ox.textAlign = "center";
        ox.textBaseline = "middle";
        ox.fillStyle = "#fff";
        ox.fillText(config.source.text, W / 2, H / 2);
        finish();
      } else if (config.source.type === "shape") {
        const img = new Image();
        const blob = new Blob([config.source.svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        img.onload = () => {
          drawImg(img);
          URL.revokeObjectURL(url);
        };
        img.src = url;
      } else {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => drawImg(img);
        img.src = config.source.url;
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      W = rect.width;
      H = rect.height;
      sample();
    };

    const frame = (now: number) => {
      if (cancelled) return;
      const t = now * 0.001;
      const fx = config.effects;
      const hueShift = fx.hueCycle ? (t * fx.hueSpeed * 360) % 360 : 0;

      if (fx.trails) {
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
        ctx.fillStyle = `rgba(12,12,12,${Math.max(0.02, Math.min(1, fx.trailFade))})`;
        ctx.fillRect(0, 0, W, H);
      } else {
        ctx.clearRect(0, 0, W, H);
      }

      let fill: string | CanvasGradient;
      if (config.colorMode === "gradient") {
        const from = hueShift
          ? shiftHue(config.gradientFrom, hueShift)
          : config.gradientFrom;
        const to = hueShift
          ? shiftHue(config.gradientTo, hueShift)
          : config.gradientTo;
        const g = ctx.createLinearGradient(0, 0, W, H);
        g.addColorStop(0, from);
        g.addColorStop(1, to);
        fill = g;
      } else {
        fill = hueShift ? shiftHue(config.color, hueShift) : config.color;
      }

      const k = 0.02 * config.speed;
      const damp = 0.86;
      const mR2 = config.mouseRadius * config.mouseRadius;
      const depositR = config.mouseRadius * 0.7;
      const magnetK = 0.04 * Math.max(0.2, config.mouseForce / 30);
      const magnetDamp = 0.78;
      const useCircle =
        mouse.active && config.mouseMode === "circle" && config.mouseForce > 0;
      const useImpulse =
        mouse.active &&
        (config.mouseMode === "repel" || config.mouseMode === "attract") &&
        config.mouseForce > 0;
      const impulseSign = config.mouseMode === "attract" ? -1 : 1;

      ctx.globalCompositeOperation = fx.glow ? "lighter" : "source-over";
      ctx.fillStyle = fill;
      const haloSize = config.size * (2.4 + fx.glowStrength * 1.8);
      const haloAlpha = 0.18 + fx.glowStrength * 0.35;
      const perParticle = fx.glow || fx.twinkle || fx.velocityBoost;

      if (!perParticle) ctx.beginPath();
      for (const p of particles) {
        let captured = false;
        if (useCircle) {
          const dxm = mouse.x - p.x;
          const dym = mouse.y - p.y;
          if (dxm * dxm + dym * dym < mR2) captured = true;
        }
        let tx: number, ty: number, sk: number, sd: number;
        if (captured) {
          const r = depositR * p.restR01;
          tx = mouse.x + Math.cos(p.restAngle) * r;
          ty = mouse.y + Math.sin(p.restAngle) * r;
          sk = magnetK;
          sd = magnetDamp;
        } else {
          tx = p.tx;
          ty = p.ty;
          sk = k;
          sd = damp;
        }
        const dx = tx - p.x;
        const dy = ty - p.y;
        p.vx = (p.vx + dx * sk) * sd;
        p.vy = (p.vy + dy * sk) * sd;
        if (useImpulse) {
          const mx = p.x - mouse.x;
          const my = p.y - mouse.y;
          const d2 = mx * mx + my * my;
          if (d2 < mR2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = 1 - d / config.mouseRadius;
            const push = (f * f * config.mouseForce * impulseSign) / d;
            p.vx += mx * push;
            p.vy += my * push;
          }
        }
        p.x += p.vx;
        p.y += p.vy;
        if (!captured && config.drift > 0) {
          const sx = p.tx - p.x;
          const sy = p.ty - p.y;
          if (sx * sx + sy * sy < 4) {
            p.x += Math.sin(t * 2 + p.seed) * config.drift * 0.5;
            p.y += Math.cos(t * 1.7 + p.seed * 0.7) * config.drift * 0.5;
          }
        }

        if (perParticle) {
          let alpha = 1;
          if (fx.twinkle)
            alpha =
              0.45 +
              0.55 * (0.5 + 0.5 * Math.sin(t * 3 * fx.twinkleSpeed + p.seed));
          if (fx.velocityBoost) {
            const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            alpha *= Math.min(1, 0.3 + sp * 0.35);
          }
          if (fx.glow) {
            ctx.globalAlpha = alpha * haloAlpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, haloSize, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, config.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.moveTo(p.x + config.size, p.y);
          ctx.arc(p.x, p.y, config.size, 0, Math.PI * 2);
        }
      }
      if (!perParticle) ctx.fill();
      ctx.globalAlpha = 1;

      if (fx.constellation) {
        ctx.globalCompositeOperation = "source-over";
        const maxD = Math.max(8, fx.constellationDist);
        const maxD2 = maxD * maxD;
        const cell = maxD;
        const cols = Math.ceil(W / cell);
        const grid: Record<number, number[]> = {};
        const max = Math.min(particles.length, 2500);
        for (let i = 0; i < max; i++) {
          const p = particles[i];
          const cx = Math.max(0, Math.min(cols - 1, (p.x / cell) | 0));
          const cy = Math.max(0, (p.y / cell) | 0);
          const key = cy * cols + cx;
          (grid[key] = grid[key] || []).push(i);
        }
        const base =
          config.colorMode === "gradient"
            ? config.gradientTo
            : config.color;
        const rgb = hexToRgb(base);
        ctx.lineWidth = 0.5;
        for (const key in grid) {
          const k2 = Number(key);
          const cy = (k2 / cols) | 0;
          const cx = k2 % cols;
          for (let dy = 0; dy <= 1; dy++) {
            for (let dx = dy === 0 ? 0 : -1; dx <= 1; dx++) {
              const nk = (cy + dy) * cols + (cx + dx);
              const nb = grid[nk];
              if (!nb) continue;
              for (const i of grid[k2]) {
                const p = particles[i];
                for (const j of nb) {
                  if (i >= j) continue;
                  const q = particles[j];
                  const ddx = p.x - q.x;
                  const ddy = p.y - q.y;
                  const d2 = ddx * ddx + ddy * ddy;
                  if (d2 < maxD2) {
                    const a = 1 - d2 / maxD2;
                    ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${a * 0.4})`;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                  }
                }
              }
            }
          }
        }
      }

      ctx.globalCompositeOperation = "source-over";
      rafId = requestAnimationFrame(frame);
    };

    const handleMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    };
    const handleLeave = () => {
      mouse.active = false;
    };

    canvas.addEventListener("pointermove", handleMove);
    canvas.addEventListener("pointerleave", handleLeave);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      observer.disconnect();
      canvas.removeEventListener("pointermove", handleMove);
      canvas.removeEventListener("pointerleave", handleLeave);
    };
  }, [src, configOverride]);

  return (
    <canvas
      ref={canvasRef}
      id="particles"
      className={
        className ??
        "block w-full h-[140px] rounded-xl"
      }
      style={{ background: DEFAULT_CONFIG.background }}
      aria-hidden="true"
    />
  );
}

export default CommunityParticles;
