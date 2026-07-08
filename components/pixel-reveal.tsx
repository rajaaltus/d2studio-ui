"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealCardProps = {
  beforeSrc: string;
  afterSrc: string;
  /** Initial reveal position, 0–100. */
  initial?: number;
  /** Initial reveal block size, in CSS px (tunable live via the Size control). */
  block?: number;
  className?: string;
};

// Diagonal slant of the reveal seam (rise/run). Shared by the pixel sweep and
// the divider so they always line up. Gentle = premium.
// Seam slant (rise/run) when the "Slant" angle option is picked; 0 = straight.
const SLANT_VALUE = 0.35;
// How far the pixel scatter spreads around the seam, in threshold units.
const BAND = 0.08;
// Frontier animation: a cell eases from before→after over this many cell-widths
// as the reveal sweeps past it (squares fade/blend, circles bloom their radius).
const ANIM_CELLS = 2.5;

export function RevealCard({
  beforeSrc,
  afterSrc,
  initial = 50,
  block = 8,
  className,
}: RevealCardProps) {
  const clamped = clamp(initial);
  const [label, setLabel] = useState(Math.round(clamped));

  // Reveal-block controls — tuned live from the options bar under the image.
  const [blockPx, setBlockPx] = useState(block); // square size in CSS px
  const [shape, setShape] = useState<"square" | "circle">("square");
  const [flipped, setFlipped] = useState(false); // swap before/after sides
  const [slant, setSlant] = useState(0); // seam angle: 0 straight, else slanted
  const slantDeg = (Math.atan(slant) * 180) / Math.PI;
  const paramsRef = useRef({ blockPx, shape, flipped, slant });
  paramsRef.current = { blockPx, shape, flipped, slant };
  const needsRebuild = useRef(false); // blockPx/slant changed → recompute the grid
  const needsRedraw = useRef(false); // shape/flip changed → just repaint
  useEffect(() => {
    needsRebuild.current = true;
  }, [blockPx, slant]);
  useEffect(() => {
    needsRedraw.current = true;
  }, [shape, flipped]);

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

    // Grid + per-cell reveal thresholds — rebuilt whenever the block size or the
    // canvas size changes. One fixed jittered set (no active/rest toggle), so the
    // pixelated frontier never snaps or shakes while dragging.
    let cols = 1;
    let rows = 1;
    let thresholds = new Float32Array(0);

    let before: HTMLImageElement | null = null;
    let after: HTMLImageElement | null = null;
    let raf = 0;
    let disposed = false;
    let dpr = 1;
    let W = 0; // device px (canvas backing store)
    let H = 0;
    let lastDrawn = -1; // only repaint when the reveal (or size/images) changed

    // Base composite runs as a single per-pixel pass over these buffers. 32-bit
    // views for fast whole-pixel copies; 8-bit views for the frontier blend band.
    let before32: Uint32Array | null = null; // cover-fit source pixels
    let after32: Uint32Array | null = null;
    let before8: Uint8ClampedArray | null = null;
    let after8: Uint8ClampedArray | null = null;
    let out: ImageData | null = null;
    let out32: Uint32Array | null = null;
    let out8: Uint8ClampedArray | null = null;
    let colOf: Int32Array | null = null; // device-x → block column
    let rowOf: Int32Array | null = null; // device-y → block row
    let prog: Float32Array | null = null; // per-column eased reveal progress 0..1
    let dx2: Float32Array | null = null; // cell-local (x-offset)² for circle mask
    let dy2: Float32Array | null = null; // cell-local (y-offset)² for circle mask

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

    // Recompute the grid from the current block size + canvas size: cell count,
    // per-cell thresholds, device→cell lookups, and cell-local offsets for the
    // circle mask. Independent of the images, so it's cheap to redo on a slider.
    const buildGrid = () => {
      if (!W || !H) return;
      const cssW = W / dpr;
      cols = Math.max(1, Math.round(cssW / paramsRef.current.blockPx));
      rows = cols; // square card → square cells

      thresholds = new Float32Array(cols * rows);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const diag =
            (col + 0.5 + (row - (rows - 1) / 2) * paramsRef.current.slant) / cols;
          const j = frac(Math.sin(col * 12.9898 + row * 78.233) * 43758.5453);
          thresholds[row * cols + col] = diag + (j - 0.5) * BAND;
        }
      }

      const cellW = W / cols;
      const cellH = H / rows;
      colOf = new Int32Array(W);
      dx2 = new Float32Array(W);
      for (let x = 0; x < W; x++) {
        const c = Math.min(cols - 1, (x / W * cols) | 0);
        colOf[x] = c;
        const fx = (x - c * cellW) / cellW - 0.5; // -0.5..0.5 across the cell
        dx2[x] = fx * fx;
      }
      rowOf = new Int32Array(H);
      dy2 = new Float32Array(H);
      for (let y = 0; y < H; y++) {
        const r = Math.min(rows - 1, (y / H * rows) | 0);
        rowOf[y] = r;
        const fy = (y - r * cellH) / cellH - 0.5;
        dy2[y] = fy * fy;
      }
      prog = new Float32Array(W);
      lastDrawn = -1;
    };

    // (Re)build the image pixel buffers. Needs images + a known size.
    const rebuild = () => {
      if (!before || !after || !W || !H) return;
      before32 = toData(before);
      after32 = toData(after);
      before8 = new Uint8ClampedArray(before32.buffer);
      after8 = new Uint8ClampedArray(after32.buffer);
      out = ctx.createImageData(W, H);
      out32 = new Uint32Array(out.data.buffer);
      out8 = out.data;
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
      W = Math.round(w * dpr);
      H = Math.round(h * dpr);
      canvas.width = W;
      canvas.height = H;
      buildGrid();
      rebuild();
    };

    const draw = (reveal: number) => {
      if (!out || !out32 || !out8 || !before32 || !after32 || !before8 || !after8 ||
          !colOf || !rowOf || !prog || !dx2 || !dy2)
        return;
      const circle = paramsRef.current.shape === "circle";
      const band = ANIM_CELLS / cols; // reveal-distance a cell takes to ease in
      // Flip swaps which image is the base (hidden) vs the top (revealed) side.
      const flip = paramsRef.current.flipped;
      const base32 = flip ? after32 : before32;
      const top32 = flip ? before32 : after32;
      const base8 = flip ? after8 : before8;
      const top8 = flip ? before8 : after8;

      // One per-pixel pass. Each cell has an eased 0..1 progress as the seam
      // sweeps past it. Squares blend before→after by that progress; circles
      // grow their revealed disc from the centre. Interior cells sit at 1. The
      // revealed after-pixel is composited over before via the blend LUT.
      let curRow = -1;
      for (let y = 0; y < H; y++) {
        const row = rowOf[y];
        if (row !== curRow) {
          curRow = row;
          const roff = row * cols;
          for (let x = 0; x < W; x++) {
            let t = (reveal - thresholds[roff + colOf[x]]) / band;
            t = t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t); // smoothstep
            prog[x] = t;
          }
        }
        const b = y * W;
        const dyc = dy2[y];
        for (let x = 0; x < W; x++) {
          const p = b + x;
          const t = prog[x];
          if (circle) {
            // disc radius grows with progress: on when inside r = 0.5·t
            const on = t > 0 && dx2[x] + dyc <= 0.25 * t * t;
            out32[p] = on ? top32[p] : base32[p];
          } else if (t >= 1) {
            out32[p] = top32[p];
          } else if (t <= 0) {
            out32[p] = base32[p];
          } else {
            const o = p * 4;
            const inv = 1 - t;
            out8[o] = base8[o] * inv + top8[o] * t;
            out8[o + 1] = base8[o + 1] * inv + top8[o + 1] * t;
            out8[o + 2] = base8[o + 2] * inv + top8[o + 2] * t;
            out8[o + 3] = 255;
          }
        }
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.putImageData(out, 0, 0);
    };

    const tick = () => {
      if (needsRebuild.current) {
        needsRebuild.current = false;
        buildGrid(); // block size changed → regrid (resets lastDrawn, forces paint)
      }
      if (needsRedraw.current) {
        needsRedraw.current = false;
        lastDrawn = -1; // shape changed → repaint with same grid
      }
      dispRef.current += (targetRef.current - dispRef.current) * 0.18; // ease + delay
      if (Math.abs(targetRef.current - dispRef.current) < 0.0005) {
        dispRef.current = targetRef.current;
      }
      // Only repaint when the reveal actually moved — idle-cheap, no jitter.
      if (Math.abs(dispRef.current - lastDrawn) > 0.0005) {
        draw(dispRef.current);
        lastDrawn = dispRef.current;
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
  }, [beforeSrc, afterSrc]);

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
          style={{ left: `${clamped}%`, transform: `translateX(-50%) rotate(${slantDeg}deg)` }}
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
            className="absolute left-1/2 top-1/2"
            style={{ transform: `translate(-50%, -50%) rotate(${-slantDeg}deg)` }}
          >
            <svg width={36} height={46} viewBox="0 0 45 58" fill="none" xmlns="http://www.w3.org/2000/svg">
              <foreignObject x={-1} y={-1} width={46.9111} height={59.9688}>
                <div
                  style={{
                    backdropFilter: "blur(0.5px)",
                    clipPath: "url(#bgblur_0_8078_260_clip_path)",
                    height: "100%",
                    width: "100%",
                  }}
                />
              </foreignObject>
              <g data-figma-bg-blur-radius={1} style={{ mixBlendMode: "overlay" }}>
                <g clipPath="url(#paint0_angular_8078_260_clip_path)" data-figma-skip-parse="true">
                  <g transform="matrix(-2.53378e-09 0.0289831 -0.0224556 -1.96313e-09 22.4555 28.9857)">
                    <foreignObject x={-1044.53} y={-1044.53} width={2089.06} height={2089.06}>
                      <div
                        style={{
                          background:
                            "conic-gradient(from 90deg,rgba(0, 0, 0, 1) 0deg,rgba(255, 254, 254, 1) 360deg)",
                          height: "100%",
                          width: "100%",
                          opacity: 0.4,
                        }}
                      />
                    </foreignObject>
                  </g>
                </g>
                <rect
                  x={44.9111}
                  y={57.9688}
                  width={44.9112}
                  height={57.9662}
                  rx={12}
                  transform="rotate(-180 44.9111 57.9688)"
                  data-figma-gradient-fill='{"type":"GRADIENT_ANGULAR","stops":[{"color":{"r":0.0,"g":0.0,"b":0.0,"a":1.0},"position":0.0},{"color":{"r":1.0,"g":0.99806565046310425,"b":0.99806565046310425,"a":1.0},"position":1.0}],"stopsVar":[{"color":{"r":0.0,"g":0.0,"b":0.0,"a":1.0},"position":0.0},{"color":{"r":1.0,"g":0.99806565046310425,"b":0.99806565046310425,"a":1.0},"position":1.0}],"transform":{"m00":-5.0675657803367358e-06,"m01":-44.911247253417969,"m02":44.911136627197266,"m10":57.966194152832031,"m11":-3.9262658901861869e-06,"m12":0.002555847167968750},"opacity":0.40000000596046448,"blendMode":"NORMAL","visible":true}'
                />
                <rect
                  x={44.4111}
                  y={57.4687}
                  width={43.9112}
                  height={56.9662}
                  rx={11.5}
                  transform="rotate(-180 44.4111 57.4687)"
                  stroke="#656565"
                  strokeOpacity={0.3}
                />
              </g>
              <g filter="url(#filter1_d_8078_260)">
                <rect
                  x={39.0317}
                  y={51.4453}
                  width={33.1539}
                  height={44.8031}
                  rx={8}
                  transform="rotate(-180 39.0317 51.4453)"
                  fill="url(#paint1_linear_8078_260)"
                />
                <rect
                  x={38.5317}
                  y={50.9453}
                  width={32.1539}
                  height={43.8031}
                  rx={7.5}
                  transform="rotate(-180 38.5317 50.9453)"
                  stroke="white"
                  strokeOpacity={0.3}
                />
              </g>
              <path
                d="M15.8104 25.2802C15.886 25.5071 16.0995 25.6605 16.3386 25.6605C16.5776 25.6605 16.79 25.5071 16.8668 25.2802L17.3349 23.8758L18.7393 23.4076C18.9662 23.332 19.1196 23.1196 19.1196 22.8806C19.1196 22.6415 18.9662 22.4291 18.7393 22.3535L17.3349 21.8853L16.8668 20.4809C16.7144 20.0272 15.9638 20.0272 15.8115 20.4809L15.3433 21.8853L13.9389 22.3535C13.712 22.4291 13.5586 22.6415 13.5586 22.8806C13.5586 23.1196 13.712 23.332 13.9389 23.4076L15.3433 23.8758L15.8104 25.2802Z"
                fill="#232323"
              />
              <path
                d="M30.8222 28.8262L25.7793 26.8324L23.7855 21.7895C23.5331 21.1535 22.4867 21.1535 22.2343 21.7895L20.2405 26.8324L15.1976 28.8262C14.8796 28.9519 14.6694 29.2599 14.6694 29.6013C14.6694 29.9426 14.8785 30.2507 15.1976 30.3763L20.2405 32.3701L22.2343 37.413C22.3599 37.731 22.668 37.9401 23.0093 37.9401C23.3507 37.9401 23.6587 37.731 23.7844 37.413L25.7782 32.3701L30.8211 30.3763C31.1391 30.2507 31.3493 29.9426 31.3493 29.6013C31.3493 29.2599 31.1413 28.9519 30.8222 28.8262Z"
                fill="#232323"
              />
              <defs>
                <clipPath id="bgblur_0_8078_260_clip_path" transform="translate(1 1)">
                  <rect
                    x={44.9111}
                    y={57.9688}
                    width={44.9112}
                    height={57.9662}
                    rx={12}
                    transform="rotate(-180 44.9111 57.9688)"
                  />
                </clipPath>
                <clipPath id="paint0_angular_8078_260_clip_path">
                  <rect
                    x={44.9111}
                    y={57.9688}
                    width={44.9112}
                    height={57.9662}
                    rx={12}
                    transform="rotate(-180 44.9111 57.9688)"
                  />
                </clipPath>
                <filter
                  id="filter1_d_8078_260"
                  x={3.87793}
                  y={6.64062}
                  width={37.1538}
                  height={48.8047}
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity={0} result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy={2} />
                  <feGaussianBlur stdDeviation={1} />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_8078_260"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_8078_260"
                    result="shape"
                  />
                </filter>
                <linearGradient
                  id="paint1_linear_8078_260"
                  x1={55.6087}
                  y1={96.2484}
                  x2={55.6087}
                  y2={51.4453}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#F6F6F6" />
                  <stop offset={0.5} stopColor="#EEEEEE" />
                  <stop offset={1} stopColor="#FEFEFE" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Options bar — 24px below the image, tune the reveal blocks */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-neutral-600">
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
            max={40}
            step={1}
            value={blockPx}
            onChange={(e) => setBlockPx(Number(e.target.value))}
            className="cursor-pointer"
            aria-label="Reveal block size in px"
          />
          <span className="tabular-nums">{blockPx}px</span>
        </label>
        <label className="flex items-center gap-2">
          <span>Angle</span>
          <select
            value={slant ? "slant" : "straight"}
            onChange={(e) => setSlant(e.target.value === "slant" ? SLANT_VALUE : 0)}
            className="rounded border border-neutral-300 bg-white px-2 py-1 capitalize"
          >
            <option value="straight">Straight</option>
            <option value="slant">Slant</option>
          </select>
        </label>
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="rounded border border-neutral-300 bg-white px-3 py-1 hover:bg-neutral-50"
        >
          Flip sides
        </button>
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
