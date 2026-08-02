"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"rows":4,"cols":4,"interval":110,"frames":[[0],[0,15],[1,14],[2,13],[12],[4,11],[5,10],[5,6,9,10],[0,15],[3,12]]};

type SpinnerPro14Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerPro14({ color = "crimson", ...props }: SpinnerPro14Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
