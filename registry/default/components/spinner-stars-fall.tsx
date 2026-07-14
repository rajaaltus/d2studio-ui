"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":4,"interval":160,"frames":[[1],[5,3],[9,7,0],[13,11,4,2],[15,8,6],[12,10],[14],[]]};

type SpinnerStarsFallProps = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerStarsFall({ color = "violet", ...props }: SpinnerStarsFallProps) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
