"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":4,"interval":90,"frames":[[0],[1],[2],[3],[7],[11],[15],[14],[13],[12],[8],[4],[5],[6],[10],[9]]};

type SpinnerVortexInProps = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerVortexIn({ color = "blue", ...props }: SpinnerVortexInProps) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
