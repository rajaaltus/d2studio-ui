"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":4,"interval":160,"frames":[[0,1,4,5],[1,2,5,6],[2,3,6,7],[8,9,12,13],[9,10,13,14],[10,11,14,15]]};

type SpinnerWindFlowProps = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerWindFlow({ color = "violet", ...props }: SpinnerWindFlowProps) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
