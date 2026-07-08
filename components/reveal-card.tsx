"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealCardProps = {
  beforeSrc: string;
  afterSrc: string;
  /** Initial reveal position, 0–100. */
  initial?: number;
  /** Number of pixel blocks per side (grid is grid×grid). */
  grid?: number;
  className?: string;
};

// Diagonal slant of the reveal seam (rise/run). Shared by the pixel sweep and
// the divider so they always line up. Gentle = premium.
const SLANT = 0;
const SLANT_DEG = (Math.atan(SLANT) * 180) / Math.PI;
// How far the pixel scatter spreads around the seam, in threshold units.
const BAND = 0.08;
// Smoke frontier: just-revealed cells drift + fade like wisps. Rendered once to
// an offscreen buffer and blurred a single time (cheap), not per-cell.
const SMOKE_BAND = 0.14; // reveal-distance over which a cell's wisp lives
const SMOKE_BLUR = 6; // px, softness of the whole smoke layer
const SMOKE_DRIFT = 34; // px, how far a wisp floats as it fades

// Composite modes offered for the smoke layer, with friendly display names.
const BLEND_MODES: { op: GlobalCompositeOperation; name: string }[] = [
  { op: "screen", name: "Glow" },
  { op: "lighten", name: "Aurora" },
  { op: "overlay", name: "Prism" },
  { op: "soft-light", name: "Dreamy" },
  { op: "color-dodge", name: "Neon" },
  { op: "plus-lighter", name: "Ember" },
  { op: "hue", name: "Tint" },
  { op: "luminosity", name: "Frost" },
  { op: "source-over", name: "Solid" },
];

export function RevealCard({
  beforeSrc,
  afterSrc,
  initial = 50,
  grid = 32,
  className,
}: RevealCardProps) {
  const clamped = clamp(initial);
  const [label, setLabel] = useState(Math.round(clamped));

  // Smoke look — adjustable from the options bar under the image.
  const [c1, setC1] = useState("#a7f3d0");
  const [c2, setC2] = useState("#bfdbfe");
  const [blend, setBlend] = useState<GlobalCompositeOperation>("screen");
  const [smokeOp, setSmokeOp] = useState(1); // wisp alpha
  const [smokeStr, setSmokeStr] = useState(1); // wisp drift distance
  const [fxOp, setFxOp] = useState(1); // final overlay alpha
  const [fxStr, setFxStr] = useState(1); // overlay blur softness
  const [shape, setShape] = useState<"square" | "circle">("square"); // wisp shape
  const [dotSize, setDotSize] = useState(4); // wisp size in px (2–16)
  // Read the latest values inside the rAF loop without restarting it.
  const optsRef = useRef({ c1, c2, blend, smokeOp, smokeStr, fxOp, fxStr, shape, dotSize });
  optsRef.current = { c1, c2, blend, smokeOp, smokeStr, fxOp, fxStr, shape, dotSize };
  const needsRedraw = useRef(false);
  useEffect(() => {
    needsRedraw.current = true;
  }, [c1, c2, blend, smokeOp, smokeStr, fxOp, fxStr, shape, dotSize]);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const targetRef = useRef(clamped / 100); // 0..1
  const dispRef = useRef(clamped / 100);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    targetRef.current = clamp01((clientX - rect.left) / rect.width);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const el = containerRef.current;
    if (!canvas || !el) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cols = Math.max(1, Math.round(grid));
    const rows = Math.max(1, Math.round(grid));

    // Per-cell reveal threshold: diagonal sweep + a stable random scatter so the
    // seam breaks into pixels instead of a hard edge.
    const thresholds = new Float32Array(cols * rows); // scattered (pixelated)
    const thrClean = new Float32Array(cols * rows); // straight seam, no scatter
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const diag = (col + 0.5 + (row - (rows - 1) / 2) * SLANT) / cols;
        thrClean[row * cols + col] = diag;
        // deterministic pseudo-random jitter per cell
        const j = frac(Math.sin(col * 12.9898 + row * 78.233) * 43758.5453);
        thresholds[row * cols + col] = diag + (j - 0.5) * BAND;
      }
    }

    let before: HTMLImageElement | null = null;
    let after: HTMLImageElement | null = null;
    let raf = 0;
    let disposed = false;
    let dpr = 1;
    let cw = 0; // css px
    let ch = 0;
    let W = 0; // device px (canvas backing store)
    let H = 0;
    let lastDrawn = -1; // only repaint when the reveal (or size/images) changed

    // Base composite runs as a single per-pixel pass over these buffers.
    let before32: Uint32Array | null = null; // cover-fit source pixels
    let after32: Uint32Array | null = null;
    let out: ImageData | null = null;
    let out32: Uint32Array | null = null;
    let colOf: Int32Array | null = null; // device-x → block column
    let rowOf: Int32Array | null = null; // device-y → block row
    let pick: Uint8Array | null = null; // per-row after/before decision

    // Offscreen buffer for the smoke layer — blurred once, then composited.
    const smoke = document.createElement("canvas");
    const sctx = smoke.getContext("2d")!;
    // Scratch canvas used to rasterize each source image at device resolution.
    const tmp = document.createElement("canvas");
    const tctx = tmp.getContext("2d", { willReadFrequently: true })!;

    const toData = (img: HTMLImageElement) => {
      tmp.width = W;
      tmp.height = H;
      const s = cover(img, W, H);
      tctx.clearRect(0, 0, W, H);
      tctx.drawImage(img, s.ox, s.oy, s.sw, s.sh, 0, 0, W, H);
      return new Uint32Array(tctx.getImageData(0, 0, W, H).data.buffer);
    };

    // (Re)build the pixel buffers + block lookups. Needs images + a known size.
    const rebuild = () => {
      if (!before || !after || !W || !H) return;
      before32 = toData(before);
      after32 = toData(after);
      // Before half is monochrome; the revealed (smoke) half keeps full color.
      const b8 = new Uint8Array(before32.buffer);
      for (let i = 0; i < b8.length; i += 4) {
        const g = (b8[i] * 0.299 + b8[i + 1] * 0.587 + b8[i + 2] * 0.114) | 0;
        b8[i] = b8[i + 1] = b8[i + 2] = g;
      }
      out = ctx.createImageData(W, H);
      out32 = new Uint32Array(out.data.buffer);
      colOf = new Int32Array(W);
      for (let x = 0; x < W; x++) colOf[x] = Math.min(cols - 1, (x / W * cols) | 0);
      rowOf = new Int32Array(H);
      for (let y = 0; y < H; y++) rowOf[y] = Math.min(rows - 1, (y / H * rows) | 0);
      pick = new Uint8Array(W);
      lastDrawn = -1;
    };

    const load = (src: string) =>
      new Promise<HTMLImageElement>((res) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => res(img);
        img.src = src;
      });

    Promise.all([load(beforeSrc), load(afterSrc)]).then(([b, a]) => {
      if (disposed) return;
      before = b;
      after = a;
      rebuild();
    });

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = w;
      ch = h;
      W = Math.round(w * dpr);
      H = Math.round(h * dpr);
      canvas.width = W;
      canvas.height = H;
      smoke.width = W;
      smoke.height = H;
      rebuild();
    };

    const draw = (reveal: number, time: number) => {
      if (!out || !out32 || !before32 || !after32 || !colOf || !rowOf || !pick)
        return;
      const tt = time * 0.004; // smoke turbulence clock
      const baseThr = thrClean; // always a clean straight seam (no pixel scatter)

      // Base: one per-pixel pass. Each pixel takes its block's threshold and
      // copies the whole pixel from the after or before buffer (32-bit copy).
      let curRow = -1;
      for (let y = 0; y < H; y++) {
        const row = rowOf[y];
        if (row !== curRow) {
          curRow = row;
          const roff = row * cols;
          for (let x = 0; x < W; x++)
            pick[x] = reveal >= baseThr[roff + colOf[x]] ? 1 : 0;
        }
        const b = y * W;
        for (let x = 0; x < W; x++) {
          const p = b + x;
          out32[p] = pick[x] ? after32[p] : before32[p];
        }
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.putImageData(out, 0, 0);

      // Smoke: each just-revealed cell emits a wisp that drifts up + fades over
      // its SMOKE_BAND lifetime. Drawn to the offscreen buffer, blurred once,
      // then screen-blended onto the frontier.
      const cellW = cw / cols;
      const cellH = ch / rows;
      const drift = SMOKE_DRIFT * optsRef.current.smokeStr; // wisp spread
      const { shape, dotSize } = optsRef.current;
      const half = dotSize / 2;
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sctx.clearRect(0, 0, cw, ch);
      sctx.fillStyle = "#fff"; // recolored by the gradient (source-in) below
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const t = thresholds[row * cols + col];
          const life = (reveal - t) / SMOKE_BAND; // 0 = just born, 1 = gone
          if (life < 0 || life > 1) continue;
          const h = frac(Math.sin(col * 3.71 + row * 9.13) * 2749.13);
          // time-driven swirl so wisps keep moving while dragging
          const sway = Math.sin(tt + col * 0.5 + row * 0.3) * 8;
          const curl = Math.cos(tt * 1.3 + col * 0.4) * 5;
          const cx = col * cellW + cellW / 2 + ((h - 0.5) * drift + sway) * life;
          const cy = row * cellH + cellH / 2 - (drift * (0.6 + h * 0.8) + curl) * life;
          sctx.globalAlpha = (1 - life) * 1.1 * optsRef.current.smokeOp;
          if (shape === "circle") {
            sctx.beginPath();
            sctx.arc(cx, cy, half, 0, Math.PI * 2);
            sctx.fill();
          } else {
            sctx.fillRect(cx - half, cy - half, dotSize, dotSize);
          }
        }
      }
      sctx.globalAlpha = 1;

      // Recolor the wisps with a subtle green→blue gradient, keeping their soft
      // alpha shape (source-in fills only where wisps were drawn).
      sctx.globalCompositeOperation = "source-in";
      const grad = sctx.createLinearGradient(0, 0, cw, ch);
      // Interpolate in OKLCH (canvas gradients otherwise blend in sRGB) by
      // laying down intermediate color-mix stops the browser resolves for us.
      const { c1: g1, c2: g2 } = optsRef.current;
      for (let i = 0; i <= 8; i++) {
        const p = i / 8;
        grad.addColorStop(p, `color-mix(in oklch, ${g1}, ${g2} ${p * 100}%)`);
      }
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, cw, ch);
      sctx.globalCompositeOperation = "source-over";

      ctx.save();
      // Keep smoke on the revealed side only — no bleed onto the mono half.
      ctx.beginPath();
      ctx.rect(0, 0, reveal * W, H);
      ctx.clip();
      ctx.filter = `blur(${SMOKE_BLUR * optsRef.current.fxStr * dpr}px)`;
      ctx.globalCompositeOperation = optsRef.current.blend;
      ctx.globalAlpha = optsRef.current.fxOp;
      ctx.drawImage(smoke, 0, 0);
      ctx.restore();
    };

    const tick = (time: number) => {
      dispRef.current += (targetRef.current - dispRef.current) * 0.18; // ease + delay
      if (Math.abs(targetRef.current - dispRef.current) < 0.0005) {
        dispRef.current = targetRef.current;
      }
      // Redraw every frame while dragging/easing so the smoke keeps swirling;
      // once settled, fall back to the reveal-changed check to stay idle-cheap.
      const active = dragging.current || Math.abs(targetRef.current - dispRef.current) > 0.0005;
      if (active || needsRedraw.current || Math.abs(dispRef.current - lastDrawn) > 0.0005) {
        draw(dispRef.current, time);
        lastDrawn = dispRef.current;
        needsRedraw.current = false;
      }

      if (handleRef.current) handleRef.current.style.left = `${dispRef.current * 100}%`;
      const n = Math.round(dispRef.current * 100);
      setLabel((prev) => (prev === n ? prev : n));

      raf = requestAnimationFrame(tick);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [beforeSrc, afterSrc, grid]);

  return (
    <div className={cn("relative w-full max-w-xl bg-white p-4", className)}>
      {/* Dashed crosshair guides, 8px off the image, extending past the corners */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute -inset-y-6 left-2 border-l border-dashed border-neutral-300" />
        <div className="absolute -inset-y-6 right-2 border-r border-dashed border-neutral-300" />
        <div className="absolute -inset-x-6 top-2 border-t border-dashed border-neutral-300" />
        <div className="absolute -inset-x-6 bottom-2 border-b border-dashed border-neutral-300" />
      </div>

      <div
        ref={containerRef}
        className="relative aspect-square w-full select-none overflow-hidden rounded-2xl touch-none shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_8px_rgba(0,0,0,0.08),0_16px_32px_rgba(0,0,0,0.14)]"
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && setFromClientX(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* Reveal percentage label */}
        <div className="absolute right-2 top-2 z-10 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium tabular-nums text-white">
          {label}%
        </div>

        {/* Handle — slanted to sit exactly on the diagonal seam */}
        <div
          ref={handleRef}
          className="absolute z-10 w-px -inset-y-[8%] bg-gradient-to-b from-white/70 via-white to-white/70 shadow-[0_0_8px_rgba(0,0,0,0.35)]"
          style={{ left: `${clamped}%`, transform: `translateX(-50%) rotate(${SLANT_DEG}deg)` }}
          role="slider"
          aria-label="Reveal position"
          aria-valuenow={label}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") targetRef.current = clamp01(targetRef.current - 0.02);
            if (e.key === "ArrowRight") targetRef.current = clamp01(targetRef.current + 0.02);
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-neutral-700 shadow-[0_2px_10px_rgba(0,0,0,0.25)] ring-1 ring-black/5 backdrop-blur-sm"
            style={{ transform: `translate(-50%, -50%) rotate(${-SLANT_DEG}deg)` }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
              <path d="m9 6 6 6-6 6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Options bar — 24px below the image, tweak the smoke gradient + blend */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-neutral-600">
        <label className="flex items-center gap-2">
          <span>Gradient</span>
          <input
            type="color"
            value={c1}
            onChange={(e) => setC1(e.target.value)}
            className="h-6 w-6 cursor-pointer rounded border border-neutral-300 bg-transparent p-0"
            aria-label="Gradient start color"
          />
          <input
            type="color"
            value={c2}
            onChange={(e) => setC2(e.target.value)}
            className="h-6 w-6 cursor-pointer rounded border border-neutral-300 bg-transparent p-0"
            aria-label="Gradient end color"
          />
        </label>
        <label className="flex items-center gap-2">
          <span>Blend</span>
          <select
            value={blend}
            onChange={(e) => setBlend(e.target.value as GlobalCompositeOperation)}
            className="rounded border border-neutral-300 bg-white px-2 py-1"
          >
            {BLEND_MODES.map((m) => (
              <option key={m.op} value={m.op}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span>Shape</span>
          <select
            value={shape}
            onChange={(e) => setShape(e.target.value as "square" | "circle")}
            className="rounded border border-neutral-300 bg-white px-2 py-1 capitalize"
          >
            <option value="square">Square</option>
            <option value="circle">Circle</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span>Size</span>
          <input
            type="range"
            min={2}
            max={16}
            step={1}
            value={dotSize}
            onChange={(e) => setDotSize(Number(e.target.value))}
            className="cursor-pointer"
            aria-label="Shape size in px"
          />
          <span className="tabular-nums">{dotSize}px</span>
        </label>
        <label className="flex items-center gap-2">
          <span>Smoke opacity</span>
          <input
            type="range"
            min={0}
            max={2}
            step={0.05}
            value={smokeOp}
            onChange={(e) => setSmokeOp(Number(e.target.value))}
            className="cursor-pointer"
            aria-label="Smoke opacity"
          />
        </label>
        <label className="flex items-center gap-2">
          <span>Smoke strength</span>
          <input
            type="range"
            min={0}
            max={3}
            step={0.05}
            value={smokeStr}
            onChange={(e) => setSmokeStr(Number(e.target.value))}
            className="cursor-pointer"
            aria-label="Smoke strength (wisp spread)"
          />
        </label>
        <label className="flex items-center gap-2">
          <span>Effect opacity</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={fxOp}
            onChange={(e) => setFxOp(Number(e.target.value))}
            className="cursor-pointer"
            aria-label="Effect opacity"
          />
        </label>
        <label className="flex items-center gap-2">
          <span>Effect strength</span>
          <input
            type="range"
            min={0}
            max={4}
            step={0.05}
            value={fxStr}
            onChange={(e) => setFxStr(Number(e.target.value))}
            className="cursor-pointer"
            aria-label="Effect strength (blur softness)"
          />
        </label>
      </div>
    </div>
  );
}

// object-fit: cover source rect for an image drawn into cw×ch.
function cover(img: HTMLImageElement, cw: number, ch: number) {
  const scale = Math.max(cw / img.width, ch / img.height);
  const sw = cw / scale;
  const sh = ch / scale;
  return { ox: (img.width - sw) / 2, oy: (img.height - sh) / 2, sw, sh };
}

function frac(n: number) {
  return n - Math.floor(n);
}
function clamp(n: number) {
  return Math.min(100, Math.max(0, n));
}
function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}
