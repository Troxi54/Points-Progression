import { ChildrenProps, ClassName } from "@/core/types/react";
import { mergeObjects } from "@/core/utils/object";
import cn from "@/core/utils/tailwind";
import { clamp } from "@core/utils/number";
import { CSSProperties } from "react";

export interface AnimatedBarOptions {
  gradientStep: string;
  gradientAngle: string;
  animationDuration: string;
}

const defaultAnimatedBarOptions: AnimatedBarOptions = {
  gradientStep: "200px",
  gradientAngle: "90deg",
  animationDuration: "2s",
};

export type ProgressBarProps = {
  mode?: "static" | "animated";
  progressBarClassName?: ClassName;
  progressFillClassName?: ClassName;
  backgroundClassName?: ClassName;
  animatedBarOptions?: Partial<AnimatedBarOptions>;
};

interface Props extends ProgressBarProps, ChildrenProps {
  progress: number;
}

function ProgressBar({
  progress,
  children,
  mode,
  progressBarClassName,
  progressFillClassName,
  backgroundClassName,
  animatedBarOptions,
}: Props) {
  const barMode = mode ?? "static";
  const fullBarOptions = mergeObjects(
    defaultAnimatedBarOptions,
    animatedBarOptions,
  );
  const bgClassName = backgroundClassName ?? "bg-layer-inner-bg";

  const processedProgress = clamp(progress, 0, 1);

  return (
    <div
      role="progressbar"
      aria-valuenow={processedProgress * 100}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("relative", progressBarClassName, bgClassName)}
    >
      {children}
      {barMode === "static" ? (
        <div
          className={cn("absolute-full origin-left", progressFillClassName)}
          style={{ transform: `scaleX(${processedProgress})` }}
        ></div>
      ) : (
        <div
          className={cn(
            "absolute-full animated-gradient",
            progressFillClassName,
          )}
          style={
            {
              animationDuration: fullBarOptions.animationDuration,
              "--gradient-step": fullBarOptions.gradientStep,
              "--gradient-angle": fullBarOptions.gradientAngle,
            } as CSSProperties
          }
        >
          <div
            className={cn("absolute-full origin-right", bgClassName)}
            style={{ transform: `scaleX(${1 - processedProgress})` }}
          ></div>
        </div>
      )}
    </div>
  );
}

export default ProgressBar;
