"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":5,"interval":75,"frames":[[0],[1],[2],[3],[4],[9],[14],[19],[24],[23],[22],[21],[20],[15],[10],[5],[6],[7],[8],[13],[18],[17],[16],[11],[12]]};

type SpinnerSpiralIn5Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerSpiralIn5({ color = "crimson", ...props }: SpinnerSpiralIn5Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
