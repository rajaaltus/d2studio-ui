import * as React from "react";
import { cn } from "@/lib/utils";

/* Bell geometry in the original 218 x 228 design box: the 218x176 body, plus the knob
   above it and the clapper below. cq units keep everything tied to the rendered size. */
const METAL = "#575757 0%, #A4A4A4 50%, #F1F1F1 100%";
const ARC = "rgba(50,43,43,0.2)";

/* The exact bell silhouette, as percentages of the 218x176 body box — same beziers as the
   original SVG path, so the curve is unchanged. shape() scales; clip-path: path() would not. */
const BELL_SHAPE = `shape(
  from 98.943% 92.362%,
  curve to 84.537% 57.188% with 91.535% 83.178% / 84.537% 74.503%,
  vline to 42.812%,
  curve to 50% 0% with 84.537% 19.205% / 69.044% 0%,
  curve to 15.463% 42.812% with 30.956% 0% / 15.463% 19.205%,
  vline to 57.188%,
  curve to 1.057% 92.362% with 15.463% 74.503% / 8.466% 83.178%,
  curve to 0.275% 97.238% with 0.025% 93.642% / -0.284% 95.567%,
  curve to 3.609% 100% with 0.834% 98.910% / 2.150% 100%,
  hline to 96.391%,
  curve to 99.725% 97.238% with 97.850% 100% / 99.167% 98.910%,
  curve to 98.943% 92.362% with 100.284% 95.567% / 99.975% 93.642%,
  close
)`;

/** Bell — brushed-metal body blooming up from the base, with knob and clapper. Pure CSS. */
export function Bell({ className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative", className)}
      style={{ aspectRatio: "218 / 228", containerType: "size", ...style }}
      {...props}
    >
      {/* Knob — half-disc bulging up over the dome */}
      <div
        className="absolute"
        style={{
          left: "40.367%",
          top: "0.877%",
          width: "19.266%",
          height: "9.211%",
          borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
          backgroundImage: `linear-gradient(180deg, #E0E0E0, ${ARC})`,
        }}
      />

      {/* Body — one slab, clipped to the bell path. Radial bloom centred on (94, 176). */}
      <div
        className="absolute"
        style={{
          left: 0,
          top: "12.281%",
          width: "100%",
          height: "77.193%",
          clipPath: BELL_SHAPE,
          backgroundImage: `radial-gradient(circle 69.725cqw at 43.119% 100%, ${METAL})`,
        }}
      />

      {/* Clapper — half-disc hanging below the rim */}
      <div
        className="absolute"
        style={{
          left: "39.450%",
          top: "89.474%",
          width: "21.101%",
          height: "10.088%",
          borderRadius: "0 0 50% 50% / 0 0 100% 100%",
          backgroundImage: `linear-gradient(180deg, ${ARC}, #E0E0E0)`,
        }}
      />
    </div>
  );
}
