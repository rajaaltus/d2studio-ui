"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"rows":4,"cols":4,"interval":110,"frames":[[0],[1,4],[5],[6,9,10],[15],[11,14,15],[7,10,11,13,14,15],[3,6,7,9,10,11,12,13,14,15],[2,3,5,6,7,8,9,10,11,12,13,14,15],[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]]};

type SpinnerPro5Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerPro5({ color = "blue", ...props }: SpinnerPro5Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
