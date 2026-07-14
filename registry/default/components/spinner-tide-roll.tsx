"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":4,"interval":180,"frames":[[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15],[8,9,10,11],[4,5,6,7]]};

type SpinnerTideRollProps = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerTideRoll({ color = "blue", ...props }: SpinnerTideRollProps) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
