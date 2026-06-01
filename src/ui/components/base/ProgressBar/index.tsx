import type { ChildrenProps } from "@core/types/react";
import type { CSSProperties } from "react";
import type { ProgressBarProps } from "./types";
import { clamp } from "@core/utils/number";
import { mergeObjects } from "@core/utils/object";
import cn from "@core/utils/tailwind";
import { Fragment } from "react";
import progressBarConfig from "./config";
import Paragraph from "../Paragraph";
import Container from "../Container";

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
    <Container
      role="progressbar"
      aria-valuenow={processedProgress * 100}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("relative", progressBarClassName, bgClassName)}
    >
      <Paragraph className="z-1">
        {children}
        {labelParts?.map((part, index) => (
          <Fragment key={index}>
            {index > 0 && progressBarConfig.labelSeparator}
            {part}
          </Fragment>
        ))}
      </Paragraph>

      {barMode === "static" ? (
        <div
          className={cn("absolute-full origin-left", progressFillClassName)}
          style={{ transform: `scaleX(${processedProgress})` }}
        />
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
          />
        </div>
      )}
    </Container>
  );
}

export default ProgressBar;
