"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":5,"interval":110,"frames":[[0,6],[1,11],[2,16],[3,17],[4,18],[9,13],[14,8],[19,7],[24,6],[23,11],[22,16],[21,17],[20,18],[15,13],[10,8],[5,7]]};

type SpinnerDualRing5Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerDualRing5({ color = "blue", ...props }: SpinnerDualRing5Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
