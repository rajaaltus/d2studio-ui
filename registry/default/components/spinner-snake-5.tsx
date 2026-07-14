"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":5,"interval":70,"frames":[[0],[1],[2],[3],[4],[9],[8],[7],[6],[5],[10],[11],[12],[13],[14],[19],[18],[17],[16],[15],[20],[21],[22],[23],[24]]};

type SpinnerSnake5Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerSnake5({ color = "blue", ...props }: SpinnerSnake5Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
