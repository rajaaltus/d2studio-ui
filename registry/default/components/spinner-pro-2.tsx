"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"rows":4,"cols":4,"interval":120,"frames":[[13,14],[9,10,12,15],[1,2],[0,3,5,6]]};

type SpinnerPro2Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerPro2({ color = "crimson", ...props }: SpinnerPro2Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
