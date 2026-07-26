import * as React from "react";

import { cn } from "@/lib/utils";

// Ported from the Figma exports (scr.matt.tsx / scr.matt-light.tsx). Both boards
// are the same 110x45 stack — only the surface, the edge, the inner-shadow tint
// and two glow opacities change, so the light theme is a token swap, not a fork.
// Layers are anchored to the top/bottom edge in px so the art survives a resize.
// The rim colours are tokens too, because light doesn't want the dark board's
// saturated violet and magenta — composited normally they paint the whole face
// lilac. Light gets the same two hues near white, so the rim reads as light
// caught on an edge rather than as a colour laid over the chip.
const GLOWS = [
  {
    top: -1,
    opacity: "var(--glow-hi)",
    image: "linear-gradient(90deg,var(--g-1),var(--g-2) 50%,var(--g-3))",
  },
  {
    top: 3,
    opacity: "var(--glow-lo)",
    image: "linear-gradient(90deg,var(--g-3),var(--g-2) 50%,var(--g-1))",
  },
  {
    top: 8.5,
    opacity: "var(--glow-lo)",
    image: "linear-gradient(var(--g-haze),var(--g-haze))",
  },
];

/** Every custom property the button paints with, defined on the button itself —
 *  nothing here is borrowed from the host app's stylesheet, so the component
 *  looks the same in any project that installs it. Exported because the demo's
 *  icon swatches resolve the same ink outside a button. */
export const MATT_THEME = [
  // Matte, both themes: one flat fill, no ramp down the face. Light just sits at
  // the top of the scale where dark sits at the bottom. A gradient with a
  // specular break reads as glass — the finish here comes from the rim and the
  // inner shadow over a flat surface, which is how the dark board draws it.
  // Dark sits 25% up its own scale from the export (L .270 → .338) — the chip
  // was reading as a hole in the page rather than a body on it. Light is
  // untouched; it's already near the top of the scale.
  "[--surf:oklch(0.945_0.001_95)] dark:[--surf:oklch(0.338_0.001_17)]",
  "[--edge-a:oklch(1_0_0)] dark:[--edge-a:oklch(0.537_0.020_35)]",
  "[--edge-b:oklch(0.845_0_90)] dark:[--edge-b:oklch(0.310_0.001_17)]",
  // Same two insets as dark, in grey rather than black and at about half the
  // weight — on a light face the export's 25%/40% blacks stopped reading as
  // depth inside the chip and started reading as a shadow cast under it.
  "[--sh:inset_1px_0_4px_oklch(0.574_0_17/.16),inset_1px_-2px_3.3px_oklch(0.640_0_90/.20)]",
  "dark:[--sh:inset_1px_0_4px_oklch(0_0_0/.25),inset_1px_-2px_3.3px_oklch(0_0_0/.4)]",
  // plus-lighter is what makes the rim holographic on a dark face — it adds
  // toward white. Light can't add toward white on an L .945 face and get
  // anything back, which is why near-white rim paint disappeared there. Light
  // multiplies instead: the same two hues subtract into the face, so the rim
  // reads as colour caught on the edge and the bounce darkens rather than
  // vanishes. Under multiply the gradient's white ends are a no-op, so only the
  // violet and the magenta land — same rim as dark, arrived at the other way.
  "[--glow-blend:multiply] dark:[--glow-blend:plus-lighter]",
  "[--glow-hi:.3] dark:[--glow-hi:.3]",
  "[--glow-lo:.2] dark:[--glow-lo:.3]",
  "[--bounce-blend:multiply] dark:[--bounce-blend:soft-light]",
  "[--bounce-op:.18] dark:[--bounce-op:1]",
  // Both themes run the board's own violet and magenta. The pale versions light
  // used to carry were a workaround for compositing them normally on a bright
  // chip; multiplying means the saturated hues can be shared, so the two
  // finishes are the same rim on the same matte body, lit from opposite ends.
  "[--g-1:oklch(1_0_0)] dark:[--g-1:oklch(1_0_0)]",
  "[--g-2:oklch(0.700_0.170_279)] dark:[--g-2:oklch(0.681_0.171_279)]",
  "[--g-3:oklch(0.730_0.200_322)] dark:[--g-3:oklch(0.738_0.233_322)]",
  "[--g-haze:oklch(0.970_0_90)] dark:[--g-haze:oklch(0.885_0_90)]",
  // Dark keeps the export's four-stop sweep, wide on the mark and two-stop on
  // the wordmark. Light runs the board's three hues — peach → green → cyan, the
  // same gradient on mark and label — but at the dark end of the ramp instead of
  // the export's pastel. The board's #FFE4DC/#C7FFAF/#9DE7FB is near-white ink
  // on a near-white face: about 1.3:1, which no amount of edge work makes
  // readable. At L .47 the same hues clear 4.5:1 on the light surface, so the
  // sweep survives and the label is actually legible.
  "[--ink:linear-gradient(90deg,oklch(0.47_0.11_25),oklch(0.45_0.11_150)_50%,oklch(0.47_0.11_235))]",
  "[--ink-label:var(--ink)]",
  "dark:[--ink:linear-gradient(90deg,oklch(0.954_0.050_85.7),oklch(0.961_0.078_136.1)_38%,oklch(0.937_0.033_36.5)_75%,oklch(0.908_0.070_216.5))]",
  "dark:[--ink-label:linear-gradient(90deg,oklch(0.954_0.050_85.7),oklch(0.908_0.070_216.5))]",
  // The solid the stroked-glyph branch paints with — a mask can't help there, so
  // it takes the sweep's last stop.
  "[--ink-solid:oklch(0.47_0.11_235)] dark:[--ink-solid:oklch(0.908_0.070_216.5)]",
].join(" ");

/** The hover ramp, on the transitions.dev vocabulary: one expo-out curve, a
 *  shade quicker on the way in than on the way out, and nothing at all for
 *  anyone who asked the OS for less motion. Both variants ride along so the
 *  same string works on the button (`hover:`) and on its ink (`group-hover:`). */
const HOVER_EASE =
  "transition-[opacity,filter,translate,scale] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:duration-[700ms] group-hover:duration-[700ms] motion-reduce:transition-none";

/** Hover moves the whole chip: the rim glows lift, the ink gains contrast, and
 *  dark brightens the face along with them. Which way "brighter" runs depends on
 *  the theme — dark ink on the light chip pops by going down, light ink on the
 *  dark chip by going up — so it's a token. */
const HOVER_STATE =
  "hover:-translate-y-px hover:saturate-[1.35] hover:[--glow-hi:.45] hover:[--glow-lo:.285] hover:[--ink-bright:.88] dark:hover:brightness-125 dark:hover:[--glow-hi:.32] dark:hover:[--glow-lo:.28] dark:hover:[--ink-bright:1.18]";

/** An outline, not a ring: `ring-*` is a box-shadow, and the inline `boxShadow`
 *  carrying the chip's two insets would overwrite it. */
const FOCUS_RING =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

// shadcn's size scale, with the corner radius stepped to keep the export's
// 10px-on-36px curvature constant across the set.
export const MATT_SIZES = {
  sm: "h-8 gap-1.5 rounded-[9px] px-3",
  default: "h-9 gap-2 rounded-[10px] px-4",
  lg: "h-10 gap-2 rounded-[11px] px-6",
  xl: "h-11 gap-2.5 rounded-[12px] px-8",
} as const;

export type MattSize = keyof typeof MATT_SIZES;

const ICON_BOX: Record<MattSize, string> = {
  sm: "size-3.5",
  default: "size-4",
  lg: "size-4",
  xl: "size-[18px]",
};

// The mark is a mask, not a drawing: the outline stays vector, but the paint is
// the same CSS ink sweep the label uses. Keeps the gradient in one place and
// avoids an <svg defs> id that would collide once two buttons share a page.
export const GITHUB_MARK =
  "M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2076 22.5814 20.278 21.0505 21.7446 19.008C23.2112 16.9656 24 14.5145 24 12C24 5.37 18.63 0 12 0Z";

/** 1 at rest, so the filter is a no-op until hover moves the token. */
const INK_FILTER = "brightness(var(--ink-bright,1))";

export function MattButton({
  children = "github",
  icon = GITHUB_MARK,
  size = "default",
  className,
  ...props
}: React.ComponentProps<"button"> & {
  /** Path data for a filled mark (takes the ink sweep), an image src, or any
   *  icon node (takes the ink as `currentColor`). `null` hides it; omit for the
   *  GitHub mark. */
  icon?: React.ReactNode;
  size?: MattSize;
}) {
  return (
    <button
      {...props}
      className={cn(
        MATT_THEME,
        MATT_SIZES[size],
        HOVER_EASE,
        HOVER_STATE,
        FOCUS_RING,
        "group relative isolate inline-flex shrink-0 items-center overflow-hidden whitespace-nowrap text-sm font-medium active:scale-[0.97] active:duration-150 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      style={{
        border: "1px solid transparent",
        background:
          "linear-gradient(var(--surf),var(--surf)) padding-box, linear-gradient(180deg,var(--edge-a),var(--edge-b)) border-box",
        boxShadow: "var(--sh)",
      }}
    >
      {/* Hover raises --glow-hi/--glow-lo on the button. The vars snap — custom
          properties don't interpolate without @property — but `opacity` and
          `filter` are the animated properties, and a var change lands on their
          computed value, so the ramp still interpolates. */}
      {GLOWS.map((g) => (
        <span
          key={g.top}
          aria-hidden
          className={`pointer-events-none absolute inset-x-[5px] h-[10px] rounded-[50%] ${HOVER_EASE} [mix-blend-mode:var(--glow-blend)]`}
          style={{
            top: g.top,
            opacity: g.opacity,
            backgroundImage: g.image,
            filter: "blur(6px)",
          }}
        />
      ))}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-[-2.26px] left-2 right-[5px] h-[13.26px] rounded-[6.63px] bg-[oklch(0.634_0.086_287.6)] opacity-[var(--bounce-op)] [mix-blend-mode:var(--bounce-blend)]"
        style={{ filter: "blur(3px)" }}
      />
      {icon ? <MattIcon icon={icon} box={ICON_BOX[size]} /> : null}
      <span
        className={`relative bg-clip-text text-transparent ${HOVER_EASE}`}
        style={{ backgroundImage: "var(--ink-label)", filter: INK_FILTER }}
      >
        {children}
      </span>
    </button>
  );
}

// A string icon is either path data or a URL to an image (a data: URL, or any
// src). Either way it ends up a mask, so a 512px logo and a 24px path land at
// exactly the same size — `contain` does the fitting, nothing is asked of the
// file.
const maskOf = (d: string) =>
  /^(data:|https?:|\/)/.test(d)
    ? `url("${d}")`
    : `url("data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='${d}'/></svg>`,
      )}")`;

/** Two ways an icon can arrive, one look either way. Path data gets masked and
 *  takes the sweep; a node (a lucide glyph, an `<img>`, anything) is sized and
 *  handed the ink as `currentColor`, since a stroked glyph has no alpha to mask.
 *  Exported so a picker can draw the same marks outside a button. */
export function MattIcon({
  icon,
  box = "size-4",
}: {
  icon: React.ReactNode;
  /** The icon box for this button size. Both branches clamp to it. */
  box?: string;
}) {
  if (typeof icon === "string") {
    const mask = maskOf(icon);
    // Two spans, not one: masking happens after filtering, so the filter on the
    // masked element would apply to the gradient's rectangle before the mask
    // cuts it. The filter has to sit on a parent of the mask.
    return (
      <span
        aria-hidden
        className={`relative shrink-0 ${box} ${HOVER_EASE}`}
        style={{ filter: INK_FILTER }}
      >
        <span
          className="block size-full"
          style={{
            backgroundImage: "var(--ink)",
            maskImage: mask,
            WebkitMaskImage: mask,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        />
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className={`relative inline-flex shrink-0 items-center justify-center text-[var(--ink-solid)] [&_svg]:size-full ${box} ${HOVER_EASE}`}
      style={{ filter: INK_FILTER }}
    >
      {icon}
    </span>
  );
}
