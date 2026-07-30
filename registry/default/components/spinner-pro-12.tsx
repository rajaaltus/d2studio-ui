"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"rows":4,"cols":2,"interval":160,"frames":[[5,6],[3,4],[1,2],[0],[0,1],[2,3,4],[5,6],[4,7]]};

type SpinnerPro12Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerPro12({ color = "violet", ...props }: SpinnerPro12Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
