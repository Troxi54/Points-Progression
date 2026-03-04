import { ChildrenProps } from "@core/types/react";
import { mergeObjects } from "@core/utils/object";
import cn from "@core/utils/tailwind";
import { clamp } from "@core/utils/number";
import { CSSProperties, Fragment } from "react";
import { ProgressBarProps } from "./types";
import progressBarConfig from "./config";

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
  labelParts,
}: Props) {
  const barMode = mode ?? "static";
  const fullBarOptions = mergeObjects(
    progressBarConfig.defaultAnimatedBarOptions,
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
      <p className="z-1">
        {children}
        {labelParts?.map((part, index) => (
          <Fragment key={index}>
            {index > 0 && progressBarConfig.labelSeparator}
            {part}
          </Fragment>
        ))}
      </p>

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
