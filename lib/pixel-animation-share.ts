// Share-state encoding for the Pixel Animation playground.
//
// We pack every visible setting into a single JSON object, then base64url
// it into a `?c=` URL param. This keeps the URL self-contained (no server
// state) and short enough that even uploaded SVGs (~1–3 KB) fit well under
// browser URL limits.

import type { SpinnerColor, SpinnerShape } from "@/components/pixel-spinner";
import type { AnimationStyleId } from "@/lib/pixel-animation";
import type { PixelIconAnimation } from "@/components/pixel-animation/pixel-icon";

/** Schema version — bump when fields change in a non-backward-compatible
 * way so older shared URLs can be detected and migrated or rejected. */
export const SHARE_VERSION = 1;

export type ShareConfig = {
  v: number;
  /** SVG markup the user is animating. We serialize the full string so
   * uploaded icons round-trip cleanly. Lucide picks just write the
   * already-rendered SVG. */
  svgName: string;
  svgText: string;
  anim: AnimationStyleId;
  ease: PixelIconAnimation;
  cmode: "preset" | "custom" | "gradient";
  preset?: string;
  color?: SpinnerColor;
  ccolor?: string;
  grad?: { id: string; from: string; to: string; glow: string };
  shape: SpinnerShape;
  grid: number;
  cell: number;
  gap: number;
  speed: number;
  glow: number;
  base: number;
  thr: number;
  stroke: string;
  pdens: number;
};

/** UTF-8-safe base64url encode. `btoa` only handles latin-1, so we widen
 * via TextEncoder before base64ing, then swap to URL-safe alphabet. */
export function encodeShare(cfg: ShareConfig): string {
  const json = JSON.stringify(cfg);
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeShare(s: string): ShareConfig | null {
  try {
    const b64 = s
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      // Re-pad to a multiple of 4 since `=` was stripped on encode.
      .padEnd(Math.ceil(s.length / 4) * 4, "=");
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const json = new TextDecoder().decode(bytes);
    const cfg = JSON.parse(json) as ShareConfig;
    if (typeof cfg !== "object" || cfg === null) return null;
    if (cfg.v !== SHARE_VERSION) return null;
    return cfg;
  } catch {
    return null;
  }
}
