"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":5,"interval":120,"frames":[[0,5,10,15,20],[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24],[3,8,13,18,23],[2,7,12,17,22],[1,6,11,16,21]]};

type SpinnerColWave5Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerColWave5({ color = "crimson", ...props }: SpinnerColWave5Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
