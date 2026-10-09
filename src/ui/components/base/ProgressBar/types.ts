import type { ClassName } from "@core/types/react";
import type { ReactNode } from "react";

export interface AnimatedBarOptions {
  gradientStep: string;
  gradientAngle: string;
  animationDuration: string;
}

export interface ProgressBarProps {
  mode?: "static" | "animated";
  containerClassName?: ClassName;
  progressBarClassName?: ClassName;
  progressFillClassName?: ClassName;
  backgroundClassName?: ClassName;
  animatedBarOptions?: Partial<AnimatedBarOptions>;
  labelParts?: ReactNode[] | null | undefined;
}
