"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":4,"interval":160,"frames":[[2,5,6,7,8,9,12],[3,4,6,7,9,10,13],[0,4,5,7,10,11,14],[1,4,5,6,8,11,15]]};

type SpinnerSwellRollProps = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerSwellRoll({ color = "crimson", ...props }: SpinnerSwellRollProps) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
