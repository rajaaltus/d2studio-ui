"use client";

import * as React from "react";

import { PORTRAIT_SRC } from "./particle-portrait/source";

// A particle-morph illustration: 12,000 dots spawn at random, spring onto pixel
// positions sampled from an image's opaque mask, and each one keeps the colour
// of the pixel it landed on — so the portrait paints itself out of noise.
// Attract-mode pointer interaction pulls the field toward the cursor.
//
// Every constant below is the spec, not a preference. The topology of the
// result is decided entirely by what gets drawn to the offscreen mask, so the
// candidate set is sampled verbatim — never thinned, jittered or deduped.

const COUNT = 12000;
const PARTICLE_R = 2;
const SPRING = 0.02 * 0.75; // 0.0150
const DAMPING = 0.86;
const DRIFT = 0.2;
const HOVER_R = 79;
const HOVER_FORCE = 1;
// 0.70 spec × 1.09 — the portrait sat small in the square frame at the spec
// value, which was written for a taller one.
const FIT_SCALE = 0.764;
const ALPHA_CUT = 128;
// Luminance (0-255) below which a source pixel counts as backdrop, not subject.
const BACKDROP_CUT = 10;
// The 135° CSS gradient. Every particle overrides it with its sampled colour,
// so this only shows if the mask ever yields a pixel without one.
const GRADIENT = ["#00f5a0", "#00d9f5"] as const;

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

export default function ParticlePortrait() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let particles: Particle[] = [];
    let W = 0;
    let H = 0;
    let raf = 0;
    const mouse = { x: 0, y: 0, active: false };

    // Re-run on every resize: W/H are the sampling grid, so the mask and every
    // target are only valid for the size they were read at.
    function build(img: HTMLImageElement) {
      const dpr = window.devicePixelRatio || 1;
      W = canvas!.clientWidth;
      H = canvas!.clientHeight;
      if (W === 0 || H === 0) return;
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const offCtx = off.getContext("2d", { willReadFrequently: true })!;

      // fit-contain into (W × 0.70) × (H × 0.70), centred, aspect preserved.
      const scale = Math.max(0.1, Math.min(1.5, FIT_SCALE));
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

      // The mask is "alpha > 128", which is the whole spec when the source is a
      // cutout PNG. This one is a JPEG on a black field, so every pixel is
      // opaque and the mask would be the drawn rectangle — 12,000 particles
      // spread evenly over it and the figure never resolves. Knocking the true
      // background out of the alpha channel first is what makes the rule mean
      // what it means for a cutout. The cut is deliberately low: the helmet is
      // dark but not black, and it has to survive.
      const data = offCtx.getImageData(0, 0, W, H).data;
      for (let i = 0; i < data.length; i += 4) {
        const lum = data[i] * 0.3 + data[i + 1] * 0.6 + data[i + 2] * 0.1;
        if (lum < BACKDROP_CUT) data[i + 3] = 0;
      }

      const candidates: [number, number][] = [];
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          if (data[(y * W + x) * 4 + 3] > ALPHA_CUT) candidates.push([x, y]);
        }
      }
      const empty = candidates.length === 0;
      if (empty) {
        for (let i = 0; i < COUNT; i++) {
          candidates.push([Math.random() * W, Math.random() * H]);
        }
      }

      particles = Array.from({ length: COUNT }, () => {
        const [tx, ty] = candidates[(Math.random() * candidates.length) | 0];
        const i = ((ty | 0) * W + (tx | 0)) * 4;
        return {
          x: Math.random() * W,
          y: Math.random() * H,
          vx: 0,
          vy: 0,
          tx,
          ty,
          seed: Math.random() * 1000,
          restAngle: Math.random() * Math.PI * 2,
          restR01: Math.sqrt(Math.random()),
          color: empty
            ? GRADIENT[0]
            : `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`,
        };
      });

      if (still) {
        for (const p of particles) {
          p.x = p.tx;
          p.y = p.ty;
        }
        draw();
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      for (const p of particles) {
        ctx!.fillStyle = p.color;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, PARTICLE_R, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function render(now: number) {
      raf = requestAnimationFrame(render);
      const t = now * 0.001;
      for (const p of particles) {
        // 1. spring toward target
        p.vx = (p.vx + (p.tx - p.x) * SPRING) * DAMPING;
        p.vy = (p.vy + (p.ty - p.y) * SPRING) * DAMPING;

        // 2. hover impulse — after the spring, before integration
        let captured = false;
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const md2 = dx * dx + dy * dy;
          if (md2 < HOVER_R * HOVER_R && md2 > 0.01) {
            const md = Math.sqrt(md2);
            const falloff = 1 - md / HOVER_R;
            // Negated: attract, pulling toward the cursor with quadratic falloff.
            const push = (falloff * falloff * HOVER_FORCE * -1) / md;
            p.vx += dx * push;
            p.vy += dy * push;
            captured = true;
          }
        }

        // 3. integrate
        p.x += p.vx;
        p.y += p.vy;

        // 4. idle drift, settled and uncaptured only
        const ox = p.tx - p.x;
        const oy = p.ty - p.y;
        if (!captured && ox * ox + oy * oy < 4) {
          p.x += Math.sin(t * 2 + p.seed) * DRIFT * 0.5;
          p.y += Math.cos(t * 1.7 + p.seed * 0.7) * DRIFT * 0.5;
        }
      }
      draw();
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    let ro: ResizeObserver | undefined;
    img.onload = () => {
      build(img);
      ro = new ResizeObserver(() => build(img));
      ro.observe(canvas);
      if (!still) raf = requestAnimationFrame(render);
    };
    img.src = PORTRAIT_SRC;

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointercancel", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      img.onload = null;
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointercancel", onLeave);
    };
  }, []);

  return (
    <section className="grid min-h-screen w-full place-items-center ">
      {/* A 3:4 portrait frame, not a square: the subject is a standing bust and
          fit-contain is the only sizing path, so a square frame pays for the
          artwork's height in empty pixels either side of it. The label sits
          above the card rather than in it, so the frame is the whole box.
          The 60vh cap is that frame's cost: the card stands a third taller than
          it is wide, so on a short or landscape screen one sized only by width
          runs off the bottom. 60vh leaves room for the label under it. */}
      <div className="w-full max-w-[min(450px,60vh)]">
        {/* The frame is one thick border, not a padded card wrapping a bordered
            inner div: same mount look, half the boxes, and nothing to keep in
            sync between the two radii. Pinned `dark`: the artwork is a dark
            photograph and washes out on a light ground, so the frame and field
            take the host's dark tokens whatever theme the page is in. The
            canvas field is bg-muted, the same grey particle-lion paints on, so
            the particle cards read as one set. */}
        <div className="dark border-border overflow-hidden rounded-xl border-6">
          <canvas
            ref={canvasRef}
            id="particles"
            className="block aspect-[3/4] w-full touch-none bg-muted"
          />
        </div>
      </div>
    </section>
  );
}
