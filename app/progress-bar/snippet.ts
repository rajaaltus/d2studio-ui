import { MOTIONS } from "@/components/progress-inspector";
import type { BarTheme } from "@/registry/default/components/progress-bar";

export const INSTALL_CMD =
  "npx shadcn@latest add https://ui.d2studio.dev/r/progress-bar.json";

/** JSON → JS object literal. Safe here: no key or value in BarTheme contains a quote or comma. */
const literal = (v: unknown) =>
  JSON.stringify(v)
    .replace(/"([a-zA-Z]\w*)":/g, "$1: ")
    .replace(/,/g, ", ");

/** Emits a usage snippet carrying only the keys the user actually changed. */
export function usageSnippet(
  theme: BarTheme,
  base: BarTheme,
  baseName: string,
  value: number,
  label: string,
  fill: "beam" | "matrix" = "beam",
  chrome: "full" | "bar" | "plain" = "full",
) {
  const changed = (Object.keys(theme) as (keyof BarTheme)[]).filter(
    (k) => JSON.stringify(theme[k]) !== JSON.stringify(base[k]),
  );

  // LIGHT_THEME is the component's default, so an untouched light theme needs
  // neither the import nor the prop.
  const named =
    changed.length || baseName !== "LIGHT_THEME" ? [baseName] : [];

  const props = [`  value={${value}}`];
  if (label !== "Progress..") props.push(`  label="${label}"`);
  if (fill !== "beam") props.push(`  fill="${fill}"`);
  if (chrome !== "full") props.push(`  chrome="${chrome}"`);
  if (changed.length) {
    props.push(
      `  theme={{\n    ...${baseName},\n${changed
        .map((k) => `    ${k}: ${literal(theme[k])},`)
        .join("\n")}\n  }}`,
    );
  } else if (named.length) {
    props.push(`  theme={${baseName}}`);
  }

  // Named imports go on their own lines: inline, `FANCY_DARK_THEME` pushes the
  // import past the width of the code block and the path gets clipped.
  return [
    named.length
      ? `import ProgressBar, {\n${named.map((n) => `  ${n},`).join("\n")}\n} from "@/components/progress-bar";`
      : `import ProgressBar from "@/components/progress-bar";`,
    "",
    "<ProgressBar",
    ...props,
    "/>",
  ].join("\n");
}

/** What each motion preset does beyond travelling — the durations and curves are
 *  read off MOTIONS, only the intent has to be written down. */
const MOTION_NOTE: Record<string, string> = {
  Glide: "width only, nothing dressed",
  Tint: "the fill runs desaturated (saturate .35 / brightness .88) and comes up to full over 0.7s when the last stage lands",
  Flare:
    "on landing the fill lifts brightness and saturation and throws two drop-shadows in its own colour (7px and 18px), rising and falling on a half-sine over 0.9s",
};

/** A paint, written the way CSS would take it. */
const css = (p: BarTheme["fill"], alpha = 1) =>
  p.mode === "solid"
    ? p.solid
    : `linear-gradient(90deg, ${p.stops.join(", ")})${alpha < 1 ? ` at ${Math.round(alpha * 100)}%` : ""}`;

const shadow = (s: BarTheme["drop"]) =>
  `${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color} at ${Math.round(s.opacity * 100)}%`;

/** The one design on screen, written out. Every number is read off what's
 *  actually rendering — the picks, and any colour hand-tuned on top of them —
 *  so the prompt describes this bar rather than the component's whole range. */
export function designPrompt({
  theme,
  variant,
  fill,
  chrome,
  motion,
  mode,
  combo,
  snippet,
}: {
  theme: BarTheme;
  variant: "glass" | "fancy";
  fill: "beam" | "matrix";
  chrome: "full" | "bar" | "plain";
  motion: string;
  mode: "light" | "dark";
  combo: string;
  snippet: string;
}) {
  const plain = chrome === "plain";
  const preset = MOTIONS.find((m) => m.name === motion);

  const surface = plain
    ? "Surface — none. The bar sits straight on the page: no background, no blur, no rim, no shadow."
    : variant === "glass"
      ? `Surface — glass: ${css(theme.surface)} at ${Math.round(theme.surfaceOpacity * 100)}%, backdrop-filter: blur(${theme.backdropBlur}px), 1px inset rim ${theme.stroke.color} at ${Math.round(theme.stroke.opacity * 100)}%, drop shadow ${shadow(theme.drop)}, inner ${shadow(theme.inner)}.`
      : `Surface — opaque card: ${theme.surface.solid}, no backdrop blur, 1px inset hairline ${theme.stroke.color} at ${Math.round(theme.stroke.opacity * 100)}%, drop shadow ${shadow(theme.drop)}, inner ${shadow(theme.inner)}.`;

  const layout = {
    full: "Layout — the readout sits in a gap bracketed by two tick leaders (a 24px rule into a 9px stem, hairline colour, at x=184.8 and x=348.3). Fill starts 16.2px in and runs 158.9px at 100%.",
    bar: "Layout — no tick leaders. Fill starts 16.2px in and runs 222.7px at 100%; the readout is pinned 16.2px off the right end.",
    plain:
      "Layout — no leaders and no pill. A 255px rail runs from the left edge, fully rounded, in the label colour at 14% — the fill paints over it and the readout is pinned to the right edge. The rail is what says how much is left, since there's no surface to do it.",
  }[chrome];

  return [
    "Build a progress bar that matches this exactly.",
    "",
    `Or install the original: ${INSTALL_CMD}`,
    "",
    `Shape — ${plain ? "a 392x48 box, nothing drawn around the contents" : "a 392x48 pill, fully rounded"}, on a ${mode} page.`,
    surface,
    layout,
    `Readout — the percent in brackets, "(83%)", in a mono 12px 6-character right-aligned box, 9.5px gap, then the status label in a 10-character left-aligned box${chrome === "full" ? ", the pair centred in the tick gap" : ""}. Both widths are reserved so nothing re-measures while the value animates. Percent ${theme.text.pct} at 80%, label ${theme.text.label}.`,
    `Fill — ${combo}, ${theme.fill.mode}: ${css(theme.fill)}${theme.fill.mode === "gradient" ? " with stops at 37.4/59.7/75.6/100% and the tail stop faded to 70%" : ""}.`,
    fill === "beam"
      ? "  Drawn as one 6px strip with fully rounded ends, plus the same paint blurred 8px at 14% behind it — the light it throws into the surface."
      : "  Drawn as three rows of 2px dots: a 12px strip masked with radial-gradient(circle at 2px 2px, #000 1px, transparent 1.05px) on a 4px cell, its width snapped to whole cells so the leading column is always a full dot. Square ends, and the unrun rail wears the same mask.",
    preset
      ? `Motion — ${preset.name}: the value travels in two stages, 18% then 100%, with a 0.35s hold between, ${preset.spec.duration}s in total on cubic-bezier(0.65, 0, 0.35, 1) — ${MOTION_NOTE[preset.name]}.`
      : "Motion — none; the bar sits at its value.",
    "",
    "React usage:",
    snippet,
  ].join("\n");
}
