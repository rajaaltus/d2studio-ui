"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"rows":4,"cols":4,"interval":130,"frames":[[8],[4,8],[0,4,8,12],[0,4,5,8,9,12],[0,4,5,6,8,9,10,12],[0,4,5,6,7,8,9,10,11,12],[0,3,4,5,6,7,8,9,10,11,12,15],[5,6,9,10],[0,3,5,6,9,10,12,15],[0,3,5,6,9,10,12,15],[2,4,5,6,9,10,11,13],[1,5,6,7,8,9,10,14],[0,3,5,6,9,10,12,15]]};

type SpinnerPro1Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerPro1({ color = "blue", ...props }: SpinnerPro1Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
