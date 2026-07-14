"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":5,"interval":130,"frames":[[0],[1,5],[2,6,10],[3,7,11,15],[4,8,12,16,20],[9,13,17,21],[14,18,22],[19,23],[24]]};

type SpinnerDiagWave5Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerDiagWave5({ color = "violet", ...props }: SpinnerDiagWave5Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
