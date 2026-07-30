"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"rows":3,"cols":4,"interval":160,"frames":[[0],[5],[8],[3],[6],[11],[5]]};

type SpinnerPro16Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerPro16({ color = "violet", ...props }: SpinnerPro16Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
