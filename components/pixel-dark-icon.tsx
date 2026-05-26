"use client";

import { CSSProperties } from "react";

const MASK = [
  18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 33, 46, 48, 54, 63, 64, 69,
  70, 79, 80, 84, 85, 86, 95, 96, 99, 100, 101, 102, 111, 112, 115, 116, 117,
  118, 119, 127, 128, 131, 132, 133, 134, 135, 136, 143, 144, 147, 148, 149,
  150, 151, 152, 153, 154, 155, 156, 159, 160, 164, 165, 166, 167, 168, 169,
  170, 171, 175, 176, 181, 182, 183, 184, 185, 186, 191, 192, 198, 199, 200,
  201, 207, 209, 222, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236,
  237,
];

const PEAK_FRAMES: number[][] = [
  [33, 184, 185, 186, 199, 200, 201, 232, 233, 234, 235],
  [183, 184, 185, 198, 199, 200, 201, 231, 232, 233, 234],
  [182, 183, 184, 198, 199, 200, 201, 230, 231, 232, 233],
  [181, 182, 183, 198, 199, 200, 229, 230, 231, 232],
  [181, 182, 198, 199, 228, 229, 230, 231, 29, 46],
  [181, 198, 227, 228, 229, 230, 28, 29, 46],
  [226, 227, 228, 229, 27, 28, 29, 46],
  [209, 226, 227, 228, 26, 27, 28, 29],
  [192, 209, 226, 227, 25, 26, 27, 28, 29],
  [159, 176, 192, 209, 226, 24, 25, 26, 27, 28],
  [143, 159, 175, 191, 176, 192, 209, 23, 24, 25, 26, 27],
  [127, 143, 159, 175, 191, 176, 192, 22, 23, 24, 25, 26],
  [127, 143, 159, 175, 191, 21, 22, 23, 24, 25],
  [143, 156, 159, 175, 191, 20, 21, 22, 23, 24],
  [155, 156, 159, 171, 175, 19, 20, 21, 22, 23],
  [154, 155, 156, 170, 171, 186, 18, 19, 20, 21, 22],
  [153, 154, 155, 156, 169, 170, 171, 185, 186, 18, 19, 20, 21],
  [
    136, 152, 153, 154, 155, 156, 168, 169, 170, 171, 185, 186, 18, 19, 20, 33,
  ],
  [135, 136, 151, 152, 153, 168, 169, 170, 171, 184, 185, 186, 18, 19, 33],
  [
    119, 134, 135, 136, 150, 151, 152, 153, 154, 166, 167, 168, 169, 170, 183,
    184, 185, 18, 33,
  ],
  [
    118, 119, 133, 134, 135, 136, 149, 150, 151, 152, 153, 165, 166, 167, 168,
    169, 182, 183, 184,
  ],
  [
    117, 118, 119, 132, 133, 134, 135, 136, 148, 149, 150, 151, 152, 164, 165,
    166, 167, 168, 181, 182, 183,
  ],
  [
    117, 118, 131, 132, 133, 134, 135, 147, 148, 149, 150, 151, 164, 165, 166,
    167, 181, 182,
  ],
  [116, 117, 131, 132, 133, 134, 147, 148, 149, 150, 164, 165, 166, 181, 46],
  [115, 116, 131, 132, 133, 147, 148, 149, 164, 165, 29, 46, 63],
  [115, 131, 132, 144, 147, 148, 160, 164, 28, 29, 46],
  [128, 131, 144, 147, 160, 176, 27, 28, 29, 46],
  [112, 128, 144, 160, 176, 26, 27, 28, 29],
  [112, 128, 144, 160, 176, 25, 26, 27, 28, 29],
  [128, 144, 160, 176, 24, 25, 26, 27, 28],
  [23, 24, 25, 26, 27],
  [22, 23, 24, 25, 26],
  [21, 22, 23, 24, 25, 207],
  [20, 21, 22, 23, 24, 54, 191, 207, 222],
  [19, 20, 21, 22, 23, 191, 207, 222, 237],
  [18, 19, 20, 21, 22, 191, 207, 222, 236, 237],
  [18, 19, 20, 21, 207, 222, 235, 236, 237],
  [18, 19, 20, 33, 222, 234, 235, 236, 237],
  [18, 19, 33, 186, 201, 233, 234, 235, 236, 237],
  [18, 33, 48, 185, 186, 200, 201, 232, 233, 234, 235, 236],
];

const TRAIL = [1.0, 0.7, 0.45, 0.25, 0.15, 0.1, 0.07, 0.05, 0.03, 0.02];
const BASE = 0.42;
const FRAMES = 40;

function buildCss(): string {
  const peakSets = PEAK_FRAMES.map((f) => new Set(f));
  const lit = new Set<number>();
  peakSets.forEach((s) => s.forEach((c) => lit.add(c)));

  const fmt = (n: number) => {
    const s = n.toFixed(3);
    return s.replace(/\.?0+$/, "");
  };

  const rules: string[] = [];
  for (const cell of Array.from(lit).sort((a, b) => a - b)) {
    const opacities: number[] = [];
    for (let f = 0; f < FRAMES; f++) {
      let maxOp = BASE;
      for (let k = 0; k < TRAIL.length; k++) {
        const pf = (f - k + FRAMES) % FRAMES;
        if (peakSets[pf].has(cell)) {
          const v = Math.min(1, TRAIL[k]);
          if (v > maxOp) maxOp = v;
        }
      }
      opacities.push(Math.max(BASE, Math.min(1, maxOp)));
    }

    let kf = `@keyframes pdi-c${cell}{`;
    for (let f = 0; f < FRAMES; f++) {
      const startPct = ((f / FRAMES) * 100).toFixed(2);
      const endPct = (((f + 1) / FRAMES) * 100 - 0.001).toFixed(3);
      kf += `${startPct}%,${endPct}%{opacity:${fmt(opacities[f])}}`;
    }
    kf += `100%{opacity:${fmt(opacities[0])}}}`;
    rules.push(kf);
    rules.push(
      `.pdi .pdi-c${cell}{animation:pdi-c${cell} var(--pdi-duration,4s) steps(1,end) infinite}`
    );
  }

  return rules.join("");
}

const CSS_TEXT = buildCss();

const BASE_CSS = `
.pdi{
  --pdi-cell:1px;
  --pdi-gap:1px;
  --pdi-color:#f8fafc;
  --pdi-duration:4s;
  --pdi-peak:1;
  --pdi-base:0.42;
  display:inline-grid;
  grid-template-columns:repeat(16,var(--pdi-cell));
  grid-template-rows:repeat(16,var(--pdi-cell));
  gap:var(--pdi-gap);
  line-height:0;
}
.pdi .pdi-cell{
  width:var(--pdi-cell);
  height:var(--pdi-cell);
  background:linear-gradient(135deg, color-mix(in srgb, var(--pdi-color) 100%, white 12%), color-mix(in srgb, var(--pdi-color) 100%, black 18%));
  box-shadow:
    0 0 0 0 color-mix(in srgb, var(--pdi-color) 75%, transparent),
    0 0 1px 0 color-mix(in srgb, var(--pdi-color) 37%, transparent),
    0 0 2px 0 color-mix(in srgb, var(--pdi-color) 25%, transparent);
  opacity:var(--pdi-base);
}
.pdi .pdi-empty{
  width:var(--pdi-cell);
  height:var(--pdi-cell);
  visibility:hidden;
}
@media (prefers-reduced-motion: reduce){
  .pdi .pdi-cell{animation-play-state:paused !important;}
}
`;

const FULL_CSS = `${BASE_CSS}${CSS_TEXT}`;

const MASK_SET = new Set(MASK);

interface PixelDarkIconProps {
  cell?: number | string;
  gap?: number | string;
  color?: string;
  duration?: string;
  className?: string;
  style?: CSSProperties;
}

export function PixelDarkIcon({
  cell,
  gap,
  color,
  duration,
  className,
  style,
}: PixelDarkIconProps) {
  const cssVars: Record<string, string> = {};
  if (cell !== undefined)
    cssVars["--pdi-cell"] = typeof cell === "number" ? `${cell}px` : cell;
  if (gap !== undefined)
    cssVars["--pdi-gap"] = typeof gap === "number" ? `${gap}px` : gap;
  if (color) cssVars["--pdi-color"] = color;
  if (duration) cssVars["--pdi-duration"] = duration;

  return (
    <>
      <style
        // hoisted by React; safe to render in component output
        // content is from a module-level constant so server/client match
        dangerouslySetInnerHTML={{ __html: FULL_CSS }}
      />
      <span
        className={`pdi${className ? ` ${className}` : ""}`}
        style={{ ...cssVars, ...style } as CSSProperties}
        aria-hidden
      >
        {Array.from({ length: 256 }, (_, i) =>
          MASK_SET.has(i) ? (
            <span key={i} className={`pdi-cell pdi-c${i}`} />
          ) : (
            <span key={i} className="pdi-empty" />
          )
        )}
      </span>
    </>
  );
}
