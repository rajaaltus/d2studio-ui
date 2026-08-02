"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":4,"interval":110,"frames":[[0],[1],[2],[3],[7],[11],[15],[14],[13],[12],[8],[4]]};

type SpinnerRing4CwProps = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerRing4Cw({ color = "blue", ...props }: SpinnerRing4CwProps) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
