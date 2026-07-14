"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":4,"interval":160,"frames":[[0,4,8,12],[1,5,9,13],[2,6,10,14],[3,7,11,15]]};

type SpinnerWave4LrProps = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerWave4Lr({ color = "violet", ...props }: SpinnerWave4LrProps) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
