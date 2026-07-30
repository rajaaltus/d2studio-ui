"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"rows":4,"cols":2,"interval":110,"frames":[[0,2,4,6],[0,2,3,4,5,6],[1,3,5,7],[1,2,3,4,5,7]]};

type SpinnerPro3Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerPro3({ color = "hotpink", ...props }: SpinnerPro3Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
