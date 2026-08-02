export const INSTALL_CMD =
  "npx shadcn@latest add https://d2studio.dev/r/button-matt.json";

export type Config = {
  size: "sm" | "default" | "lg" | "xl";
  label: string;
  /** Name from the demo's icon picker, or null when the icon is hidden. */
  icon: string | null;
};

/** The picker's marks map onto lucide glyphs of the same name, except GitHub —
 *  that one is the component's default and needs no prop at all. An upload is a
 *  data: URL in the demo; in the snippet it's the src the user will ship. */
const iconProp = ({ icon }: Config) =>
  icon === null
    ? "icon={null}"
    : icon === "GitHub"
      ? ""
      : icon === "Custom"
        ? `icon="/icons/your-mark.svg"`
        : `icon={<${icon} />}`;

export function usageSnippet(cfg: Config) {
  const props = [
    cfg.size !== "default" ? `size="${cfg.size}"` : "",
    iconProp(cfg),
  ].filter(Boolean);

  const imports = [`import { MattButton } from "@/components/button-matt";`];
  if (cfg.icon && cfg.icon !== "GitHub" && cfg.icon !== "Custom")
    imports.push(`import { ${cfg.icon} } from "lucide-react";`);

  return [
    ...imports,
    "",
    `<MattButton${props.length ? " " + props.join(" ") : ""}>`,
    `  ${cfg.label}`,
    "</MattButton>",
  ].join("\n");
}

const HEIGHTS = { sm: 32, default: 36, lg: 40, xl: 44 } as const;
const RADII = { sm: 9, default: 10, lg: 11, xl: 12 } as const;
const SIZE_WORDS = {
  sm: "small",
  default: "medium",
  lg: "large",
  xl: "extra large",
} as const;

/** A rebuild-from-scratch brief, not a description of the props — the point is
 *  that pasting it into an agent gets you this exact button without the file. */
export function promptText(cfg: Config) {
  return [
    `Build a React + Tailwind button component called MattButton, matte-dark chip style:`,
    ``,
    `- ${HEIGHTS[cfg.size]}px tall — ${SIZE_WORDS[cfg.size]} (${cfg.size}) on the shadcn size scale — with a ${RADII[cfg.size]}px radius and a small medium-weight label.`,
    `- Surface is a flat matte fill with a 1px gradient border (light top edge fading to a darker bottom), plus an inset shadow so the face reads slightly recessed.`,
    `- Three blurred elliptical glows pinned just under the top edge — white→violet→magenta, then the reverse, then a neutral haze — composited with mix-blend-mode: plus-lighter, so the top rim looks holographic.`,
    `- One soft-light violet blur along the bottom edge for the bounce light.`,
    `- Label and icon are painted with a horizontal gradient — gold → green → coral → teal in dark, and the same sweep held at oklch L .47 in light so it clears 4.5:1 on the pale face — the icon via a CSS mask so the mark takes the sweep too.`,
    `- No shadow under the label or icon; the ink sits flat on the surface.`,
    `- Light and dark themes are the same layers with swapped CSS custom properties. Light also swaps the rim's blend mode: plus-lighter reads as holographic on the dark face but adds nothing on the light one, which multiplies the same two hues into the surface instead.`,
    `- Content: label "${cfg.label}"${
      cfg.icon === null
        ? ", no icon"
        : cfg.icon === "Custom"
          ? ", leading custom mark passed as an image src — masked and fitted, so any source size works"
          : `, leading ${cfg.icon} icon`
    }.`,
    `- The icon box scales with the size (14px / 16px / 16px / 18px); icons are fitted with mask-size: contain, never with intrinsic dimensions.`,
    `- Hover, on one expo-out curve (700ms in, 900ms out, disabled under prefers-reduced-motion): the chip lifts 1px, the rim glows and the ink gain, and dark brightens the face with them.`,
    `- Presses scale to 0.97, focus-visible draws an offset outline (not a ring — the inset box-shadow owns that slot), and all native button props pass through.`,
  ].join("\n");
}
