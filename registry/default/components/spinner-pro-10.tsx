"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"rows":4,"cols":2,"interval":110,"frames":[[0],[2],[4],[6],[1],[3],[5],[7]]};

type SpinnerPro10Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerPro10({ color = "crimson", ...props }: SpinnerPro10Props) {
  return <PixelSpinner pattern={pattern} color={color} animation="wavy" {...props} />;
}
