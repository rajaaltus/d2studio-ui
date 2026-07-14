"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":4,"interval":140,"frames":[[12,13,14,15],[8,9,10,11,13,14],[4,5,6,7,9,10],[0,1,2,3,5,6],[0,1,2,3],[]]};

type SpinnerFireRiseProps = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerFireRise({ color = "hotpink", ...props }: SpinnerFireRiseProps) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
