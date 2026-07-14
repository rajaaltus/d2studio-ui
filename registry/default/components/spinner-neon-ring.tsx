"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":4,"interval":130,"frames":[[0,1,2],[2,3,7],[7,11,15],[15,14,13],[13,12,8],[8,4,0]]};

type SpinnerNeonRingProps = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerNeonRing({ color = "violet", ...props }: SpinnerNeonRingProps) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
