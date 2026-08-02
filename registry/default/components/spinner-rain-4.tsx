"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":4,"interval":180,"frames":[[0,5,10,15],[4,9,14,3],[8,13,2,7],[12,1,6,11]]};

type SpinnerRain4Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerRain4({ color = "crimson", ...props }: SpinnerRain4Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
