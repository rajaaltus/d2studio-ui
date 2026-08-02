"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"rows":4,"cols":4,"interval":160,"frames":[[15],[10,11,14,15],[5,6,9,10],[0,1,4,5],[0],[],[8,9,12,13],[5,6,8,9,10,12,13],[2,3,5,6,7,9,10],[],[]]};

type SpinnerPro7Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerPro7({ color = "hotpink", ...props }: SpinnerPro7Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
