"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"rows":4,"cols":4,"interval":130,"frames":[[1,5,6,7,8,9,10,14],[2,4,5,6,9,10,11,13],[0,3,5,6,9,10,12,15],[1,5,6,7,8,9,10,14],[0,3,12,15],[2,4,11,13],[1,7,8,14]]};

type SpinnerPro13Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerPro13({ color = "blue", ...props }: SpinnerPro13Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
