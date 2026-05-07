"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
};

export interface PixelTextParticlesProps {
  text: string;
  /** Class names for the visible <h1>. Pass the same styling you'd normally
   * give the heading (font, size, weight, color). */
  className?: string;
  /** Hex color for the particles. Defaults to a soft white that reads well
   * on dark backgrounds. */
  particleColor?: string;
  /** Particles emitted per second. Steady-state count ≈ rate × avg lifetime. */
  emitRate?: number;
}

/** Convert a #RRGGBB to a `r,g,b` string for use in rgba(). */
function hexToRgbTriple(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "255,255,255";
  const v = parseInt(m[1], 16);
  return `${(v >> 16) & 255},${(v >> 8) & 255},${v & 255}`;
}

/** Pre-render the radial-gradient sprite each particle is drawn with. One
 * cached blit per particle is far cheaper than per-particle shadowBlur. */
function buildSprite(color: string): HTMLCanvasElement {
  const size = 64;
  const cv = document.createElement("canvas");
  cv.width = size;
  cv.height = size;
  const ctx = cv.getContext("2d");
  if (!ctx) return cv;
  const rgb = hexToRgbTriple(color);
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(0.4, `rgba(${rgb},0.55)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return cv;
}

/**
 * Renders a heading whose pixels emit drifting glow particles. The text is
 * rasterized once (and on resize) into a hidden canvas to extract a list of
 * pixel positions where the glyphs live; the visible canvas overlay then
 * picks random positions from that list and animates particles upward with
 * gentle sway and fade.
 */
export function PixelTextParticles({
  text,
  className,
  particleColor = "#ffffff",
  emitRate = 28,
}: PixelTextParticlesProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const samplesRef = useRef<Array<{ x: number; y: number }>>([]);
  const particlesRef = useRef<Particle[]>([]);
  const spriteRef = useRef<HTMLCanvasElement | null>(null);
  /** Pixel offset of the h1 inside the wrapper. Particles emit in
   * wrapper-relative coords so they can drift up into the wrapper's
   * padding space. */
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    spriteRef.current = buildSprite(particleColor);
  }, [particleColor]);

  /* ---------- Sample text glyph positions ---------- */

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const h1 = h1Ref.current;
    const canvas = canvasRef.current;
    if (!wrapper || !h1 || !canvas) return;

    const sample = async () => {
      // Wait for web fonts so the rasterized text matches what the user sees.
      try {
        await document.fonts.ready;
      } catch {
        /* not all browsers support this; fall through */
      }

      const wrapperRect = wrapper.getBoundingClientRect();
      const h1Rect = h1.getBoundingClientRect();
      if (h1Rect.width <= 0 || h1Rect.height <= 0) return;

      const dpr = Math.min(2, window.devicePixelRatio || 1);

      // Hidden offscreen canvas matched to the h1's box — used purely to
      // discover which pixels are part of glyphs.
      const off = document.createElement("canvas");
      off.width = Math.ceil(h1Rect.width * dpr);
      off.height = Math.ceil(h1Rect.height * dpr);
      const offCtx = off.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;
      offCtx.scale(dpr, dpr);

      const cs = getComputedStyle(h1);
      offCtx.fillStyle = "#fff";
      offCtx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillText(text, h1Rect.width / 2, h1Rect.height / 2);

      const data = offCtx.getImageData(0, 0, off.width, off.height).data;

      // Stride controls how many sample points we keep. Smaller stride
      // means denser sample = more emission positions, but we cap the
      // emitter independently so it doesn't matter much for cost.
      const stride = 3;
      const positions: Array<{ x: number; y: number }> = [];
      for (let y = 0; y < off.height; y += stride) {
        for (let x = 0; x < off.width; x += stride) {
          const a = data[(y * off.width + x) * 4 + 3];
          if (a > 160) {
            positions.push({ x: x / dpr, y: y / dpr });
          }
        }
      }
      samplesRef.current = positions;

      // Resize the visible canvas to cover the wrapper (which has padding
      // above the h1 so particles have room to drift up).
      offsetRef.current = {
        x: h1Rect.left - wrapperRect.left,
        y: h1Rect.top - wrapperRect.top,
      };
      canvas.width = Math.ceil(wrapperRect.width * dpr);
      canvas.height = Math.ceil(wrapperRect.height * dpr);
      canvas.style.width = `${wrapperRect.width}px`;
      canvas.style.height = `${wrapperRect.height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    sample();
    const ro = new ResizeObserver(() => sample());
    ro.observe(wrapper);
    ro.observe(h1);
    return () => ro.disconnect();
  }, [text]);

  /* ---------- rAF loop: emit + draw ---------- */

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lastEmit = last;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) {
        raf = requestAnimationFrame(tick);
        return;
      }

      // Emit a particle every (1000 / emitRate) ms from a random sampled
      // glyph pixel. We allow short bursts (up to 3 per tick) so the visual
      // density stays even when rAF temporarily slows.
      const samples = samplesRef.current;
      if (samples.length > 0) {
        const interval = 1000 / emitRate;
        let toEmit = Math.floor((now - lastEmit) / interval);
        if (toEmit > 3) toEmit = 3;
        if (toEmit > 0) {
          lastEmit = now;
          const off = offsetRef.current;
          for (let i = 0; i < toEmit; i++) {
            const s = samples[Math.floor(Math.random() * samples.length)];
            particlesRef.current.push({
              x: off.x + s.x,
              y: off.y + s.y,
              vx: (Math.random() - 0.5) * 18,
              vy: -10 - Math.random() * 22,
              age: 0,
              life: 1.1 + Math.random() * 0.9,
              size: 1.4 + Math.random() * 1.6,
            });
          }
        }
      }

      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      ctx.globalCompositeOperation = "lighter";

      const sprite = spriteRef.current;
      const arr = particlesRef.current;
      const next: Particle[] = [];
      for (const p of arr) {
        p.age += dt;
        if (p.age >= p.life) continue;
        // Light damping; cells drift up but don't escape the canvas before
        // their alpha falls to zero.
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const t = p.age / p.life;
        const alpha = (1 - t) * (1 - t);
        const radius = Math.max(0, p.size * 4 * (1 - t * 0.3));

        ctx.globalAlpha = alpha;
        if (sprite) {
          ctx.drawImage(
            sprite,
            p.x - radius,
            p.y - radius,
            radius * 2,
            radius * 2
          );
        }
        next.push(p);
      }
      particlesRef.current = next;
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [emitRate]);

  return (
    <div ref={wrapperRef} className="relative inline-block pt-12 pb-2">
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ mixBlendMode: "screen" }}
      />
      <h1 ref={h1Ref} className={`${className ?? ""} relative`}>
        {text}
      </h1>
    </div>
  );
}
