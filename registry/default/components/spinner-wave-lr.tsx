"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":3,"interval":180,"frames":[[0,3,6],[1,4,7],[2,5,8]]};

type SpinnerWaveLrProps = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerWaveLr({ color = "crimson", ...props }: SpinnerWaveLrProps) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
