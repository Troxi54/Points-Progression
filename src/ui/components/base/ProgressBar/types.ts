import { Nil } from "@core/types/primitives";
import { ClassName } from "@core/types/react";
import { ReactNode } from "react";

export interface AnimatedBarOptions {
  gradientStep: string;
  gradientAngle: string;
  animationDuration: string;
}

export type ProgressBarProps = {
  mode?: "static" | "animated";
  progressBarClassName?: ClassName;
  progressFillClassName?: ClassName;
  backgroundClassName?: ClassName;
  animatedBarOptions?: Partial<AnimatedBarOptions>;
  labelParts?: ReactNode[] | Nil;
};
