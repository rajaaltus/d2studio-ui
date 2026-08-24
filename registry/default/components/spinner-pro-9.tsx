"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"rows":4,"cols":2,"interval":100,"frames":[[6],[4],[3],[1],[0],[2],[5],[7]]};

type SpinnerPro9Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerPro9({ color = "blue", ...props }: SpinnerPro9Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
