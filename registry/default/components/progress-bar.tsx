import { cn } from "@/lib/utils";

/** Fill track spans x=16.158 → 175.042 inside the 392px pill (83% ⇒ 131.87, per the Figma source). */
const TRACK_WIDTH = 158.884;
/** Stop offsets baked into the Figma gradients — only the colours are tunable. */
const SURFACE_OFFSETS = [0, 50, 100];
const FILL_OFFSETS = [37.4, 59.7, 75.6, 100];
/** The reference fades the fill's tail stop to 70%. */
const FILL_ALPHAS = [1, 1, 1, 0.7];

export type Shadow = {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
};

export type BarTheme = {
  surface: { mode: "gradient" | "solid"; solid: string; stops: string[] };
  surfaceOpacity: number;
  fill: { mode: "gradient" | "solid"; solid: string; stops: string[] };
  stroke: { color: string; opacity: number };
  backdropBlur: number;
  drop: Shadow;
  inner: Shadow;
  text: { pct: string; label: string };
};

/** Light mode — the Figma source values, unchanged. */
export const LIGHT_THEME: BarTheme = {
  surface: {
    mode: "gradient",
    solid: "#e3e3e3",
    stops: ["#d7e8ff", "#e9cdff", "#ffefd6"],
  },
  surfaceOpacity: 0.2,
  fill: {
    mode: "gradient",
    solid: "#ac82ff",
    stops: ["#ac82ff", "#67dbff", "#8bff9e", "#e5e5e5"],
  },
  stroke: { color: "#f4f4f4", opacity: 0.6 },
  backdropBlur: 20,
  drop: { x: 0, y: 0, blur: 4, spread: 2, color: "#f3f3f3", opacity: 0.25 },
  inner: { x: 1, y: 1, blur: 10, spread: 0, color: "#fafafa", opacity: 1 },
  text: { pct: "#bbffd2", label: "#f8f8f8" },
};

/** Dark mode — same glass, dialled back so the white rim/glow doesn't blow out. */
export const DARK_THEME: BarTheme = {
  ...LIGHT_THEME,
  surfaceOpacity: 0.14,
  stroke: { color: "#f4f4f4", opacity: 0.32 },
  drop: { x: 0, y: 0, blur: 12, spread: 2, color: "#f3f3f3", opacity: 0.1 },
  inner: { x: 1, y: 1, blur: 10, spread: 0, color: "#fafafa", opacity: 0.5 },
};

/** 6-digit hex → oklch(), so every colour in the rendered CSS stays in one space. */
export function toOklch(hex: string, alpha = 1) {
  const n = parseInt(hex.slice(1), 16);
  const lin = (c: number) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  const [R, G, B] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) =>
    lin(v / 255),
  );
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const b = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const h = ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
  return `oklch(${L.toFixed(3)} ${Math.hypot(a, b).toFixed(3)} ${h.toFixed(1)}${
    alpha < 1 ? ` / ${alpha}` : ""
  })`;
}

const paint = (
  { mode, solid, stops }: BarTheme["surface"],
  offsets: number[],
  alphas: number[],
  scale = 1,
) =>
  mode === "solid"
    ? toOklch(solid, scale)
    : `linear-gradient(90deg, ${stops
        .map((c, i) => `${toOklch(c, alphas[i] * scale)} ${offsets[i]}%`)
        .join(", ")})`;

const shadow = (s: Shadow, inset = false) =>
  `${inset ? "inset " : ""}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${toOklch(s.color, s.opacity)}`;

export default function ProgressBar({
  value = 83,
  label = "Progress..",
  theme = LIGHT_THEME,
  className,
}: {
  value?: number;
  label?: string;
  theme?: BarTheme;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  const hairline = toOklch(theme.stroke.color, theme.stroke.opacity);

  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("relative h-12 w-[392px] rounded-full", className)}
      style={{
        background: paint(
          theme.surface,
          SURFACE_OFFSETS,
          [1, 1, 1],
          theme.surfaceOpacity,
        ),
        backdropFilter: `blur(${theme.backdropBlur}px)`,
        WebkitBackdropFilter: `blur(${theme.backdropBlur}px)`,
        outline: `1px solid ${hairline}`,
        outlineOffset: "-1px",
        boxShadow: `${shadow(theme.drop)}, ${shadow(theme.inner, true)}`,
      }}
    >
      {/* progress fill */}
      <div
        className="absolute top-[21px] left-[16.158px] h-1.5 rounded-[3px]"
        style={{
          width: (TRACK_WIDTH * pct) / 100,
          background: paint(theme.fill, FILL_OFFSETS, FILL_ALPHAS),
        }}
      />

      {/* left leader ──┤ */}
      <div
        className="absolute top-[23.5px] left-[184.807px] h-px w-6"
        style={{ background: hairline }}
      />
      <div
        className="absolute top-[19.5px] left-[209.307px] h-[9px] w-px"
        style={{ background: hairline }}
      />

      {/* label, centred between the ticks */}
      <div className="absolute inset-y-0 right-[59.693px] left-[209.807px] flex items-center justify-center gap-[9.5px] font-mono text-xs whitespace-nowrap">
        <span style={{ color: toOklch(theme.text.pct, 0.8) }}>({pct}%)</span>
        <span style={{ color: toOklch(theme.text.label) }}>{label}</span>
      </div>

      {/* right leader ├── */}
      <div
        className="absolute top-[19.5px] left-[332.307px] h-[9px] w-px"
        style={{ background: hairline }}
      />
      <div
        className="absolute top-[23.5px] left-[332.807px] h-px w-6"
        style={{ background: hairline }}
      />
    </div>
  );
}
