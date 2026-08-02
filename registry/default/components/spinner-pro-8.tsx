"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"rows":4,"cols":2,"interval":120,"frames":[[0,1],[2,3],[4,5],[6,7],[4,5],[2,3]]};

type SpinnerPro8Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerPro8({ color = "violet", ...props }: SpinnerPro8Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
