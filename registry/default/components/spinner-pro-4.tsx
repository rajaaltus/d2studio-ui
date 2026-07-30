"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"rows":4,"cols":2,"interval":100,"frames":[[0],[1],[3],[5],[7],[6],[4],[2]]};

type SpinnerPro4Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerPro4({ color = "violet", ...props }: SpinnerPro4Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
