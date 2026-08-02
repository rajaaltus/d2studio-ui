"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"rows":4,"cols":4,"interval":160,"frames":[[2,4,5,6,9,10,11,13],[0,3,5,6,9,10,12,15],[5,6,9,10],[1,5,6,7,8,9,10,14]]};

type SpinnerPro15Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerPro15({ color = "hotpink", ...props }: SpinnerPro15Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
