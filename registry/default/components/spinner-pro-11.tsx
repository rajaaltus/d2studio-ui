"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"rows":4,"cols":2,"interval":110,"frames":[[2,3,4,5],[0,1,6,7],[],[2,3,4,5],[0,1,6,7],[],[],[]]};

type SpinnerPro11Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerPro11({ color = "hotpink", ...props }: SpinnerPro11Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
