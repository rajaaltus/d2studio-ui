"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":5,"interval":90,"frames":[[0],[1],[2],[3],[4],[9],[14],[19],[24],[23],[22],[21],[20],[15],[10],[5]]};

type SpinnerOuterRingCw5Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerOuterRingCw5({ color = "hotpink", ...props }: SpinnerOuterRingCw5Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
