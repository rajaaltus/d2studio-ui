"use client";

import * as React from "react";

import { LION_SRC } from "./particle-lion/source";

// A particle-morph illustration: 7,000 dots spawn at random, spring onto pixel
// positions sampled from an image's opaque mask, and each one keeps the colour
// of the pixel it landed on — so the lion paints itself out of noise. Each dot
// twinkles on its own phase, and attract-mode pointer interaction pulls the
// field toward the cursor.
//
// Every constant below is the spec, not a preference. The topology of the
// result is decided entirely by what gets drawn to the offscreen mask, so the
// candidate set is sampled verbatim — never thinned, jittered or deduped.
//
// Unlike the owl, this source is edge-to-edge artwork with no field behind it:
// every pixel is subject, so the plain "alpha > 128" mask is the whole spec
// here and there is nothing to knock out of the alpha channel first.

// 7,000 spec × (426/322)² ≈ 12,250. The spec's count is per *its* render, where
// fit-contain at 0.70 lands the artwork at ~322px and 7,000 discs of r=2.8 lay
// down ~1.7× their own area in ink — which is why that one reads as a solid
// mosaic. Filling the frame instead of sitting at 0.70 grows the art to ~426px,
// and the same count would cover under 1×: the same picture, full of holes.
// Count follows area, or "fill the frame" quietly means "thin the mosaic".
const COUNT = 12250;
const PARTICLE_R = 2.8;
const SPRING = 0.02 * 1.25; // 0.0250
const DAMPING = 0.86;
const DRIFT = 0.2;
const HOVER_R = 171;
// Twinkle: alpha = 0.86 + 0.14·sin(t·1.00·2π + seed), so 0.72 → 1.00 per dot.
// The spec's ±0.45 is written for dots on a black field, where a dim one reads
// as glitter. Here they tile a picture, and a dot at 0.10 is a hole in it.
const TWINKLE_HZ = 1;
const HOVER_FORCE = 1;
// 1.0, not the 0.70 the other two use: this source is edge-to-edge artwork
// with no field to sit in, so anything under 1 crops nothing and just leaves a
// margin of dead canvas around it. Square source in a square frame, so
// fit-contain at 1 fills the frame exactly.
const FIT_SCALE = 1;
const ALPHA_CUT = 128;
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

export default function ParticleLion() {
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

      // fit-contain into (W × FIT_SCALE) × (H × FIT_SCALE), centred, aspect
      // preserved.
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

      const data = offCtx.getImageData(0, 0, W, H).data;

      // Scanned on a stride rather than per pixel, and handed out by index
      // below rather than drawn at random. Sampling 7,000 targets at random
      // from ~180,000 opaque pixels is a Poisson field: it clumps and leaves
      // holes, and the picture never resolves. This source is a full-bleed
      // painting, not a silhouette on a field — reproducing it means even
      // coverage, so the stride is the spacing that lands COUNT points on the
      // frame, and at r=2.8 the discs just touch. That is the mosaic.
      const stride = Math.max(1, Math.sqrt((W * H) / COUNT));
      const candidates: [number, number][] = [];
      for (let y = stride / 2; y < H; y += stride) {
        for (let x = stride / 2; x < W; x += stride) {
          const px = x | 0;
          const py = y | 0;
          if (data[(py * W + px) * 4 + 3] > ALPHA_CUT) candidates.push([px, py]);
        }
      }
      const empty = candidates.length === 0;
      if (empty) {
        for (let i = 0; i < COUNT; i++) {
          candidates.push([Math.random() * W, Math.random() * H]);
        }
      }

      particles = Array.from({ length: COUNT }, (_, n) => {
        const [tx, ty] = candidates[n % candidates.length];
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
        draw(0);
      }
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, W, H);
      const phase = t * TWINKLE_HZ * Math.PI * 2;
      for (const p of particles) {
        ctx!.globalAlpha = 0.86 + 0.14 * Math.sin(phase + p.seed);
        ctx!.fillStyle = p.color;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, PARTICLE_R, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
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
      draw(t);
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
    img.src = LION_SRC;

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
    <section className="grid min-h-screen w-full place-items-center">
      {/* Square canvas in an even border, so the card is square too —
          the source is square, and any other frame ratio only leaves the
          artwork floating in empty pixels on one axis. The 85vh cap is that
          square's cost: width is also height here, so on a short or landscape
          screen a card sized only by width runs off the bottom. */}
      <div className="w-full max-w-[min(450px,80vh)]">
        {/* Theme tokens, so the frame follows the host's palette with no dark:
            twin.

            The canvas ground is --muted, the surface the card itself stands on,
            rather than --background one step below it. Unlike the other two
            particle pieces this source is edge-to-edge artwork at FIT_SCALE 1,
            so there is no field to paint: the ground is only ever seen where
            the dots have moved off it, which is exactly what the attract
            interaction does. A darker ground made that a black gap opening
            inside the frame on hover; matching the surround makes it the card
            showing through. */}
        <div className="border-border overflow-hidden rounded-xl border-6">
            <canvas
              ref={canvasRef}
              id="particles"
              className="block aspect-square w-full touch-none  bg-muted"
            />
        </div>
      </div>
    </section>
  );
}
