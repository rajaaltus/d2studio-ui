"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":4,"interval":180,"frames":[[0,5,10,15],[1,4,11,14],[2,7,8,13],[3,6,9,12],[5,6,9,10]]};

type SpinnerBillboardTilesProps = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerBillboardTiles({ color = "crimson", ...props }: SpinnerBillboardTilesProps) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
