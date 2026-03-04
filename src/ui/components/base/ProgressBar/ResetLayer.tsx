import { formatCurrencyName } from "@game/currencies/utils/format";
import { getCachedCurrencyProp } from "@game/currencies/utils/get";
import { formatWithPlural } from "@core/format/plural";
import { formatLeftTime } from "@core/format/time";
import { usePlayer } from "@ui/hooks/usePlayer/main";
import { getPlayerState } from "@game/player/store/store";
import { ValueGetter } from "@game/player/types";
import { parseValueGetter } from "@game/player/utils";
import { ResetLayerId } from "@game/resetLayers/types";
import {
  getResetLayerData,
  getResetLayerPlayerDataProps,
  shouldResetLayerProgressBarLock,
} from "@game/resetLayers/utils/get";
import { mergeObjects } from "@core/utils/object";
import { calculateProgress } from "@core/utils/progress";
import { calculateTimeForRequirement } from "@core/utils/time";
import Decimal from "break_eternity.js";
import { ProgressBarProps } from "./types";
import { ReactNode } from "react";
import { Nil } from "@core/types/primitives";
import ProgressBar from ".";
import { isNil } from "@core/utils/nil";
import progressBarConfig from "./config";

interface Props extends Omit<ProgressBarProps, "labelParts"> {
  resetLayerId: ResetLayerId;
  customProgress?: ValueGetter<number, [Decimal]>;
  labelParts?: ValueGetter<ReactNode[] | Nil, [boolean]>;
}

function ResetLayerProgressBar({
  resetLayerId,
  mode,
  progressFillClassName,
  animatedBarOptions,
  labelParts,
  customProgress,
}: Props) {
  const resetLayerData = getResetLayerData(resetLayerId);
  const { currency, goal } = resetLayerData;

  const state = usePlayer(
    (state) => {
      const { mergedPlayer } = state;

      const { everPerformed, resetsPerSecond } = getResetLayerPlayerDataProps(
        state,
        resetLayerId,
        ["everPerformed", "resetsPerSecond"],
      );

      const basicSelection = {
        stableProgressBars: mergedPlayer.player.stableProgressBars,
        currencyValue: mergedPlayer.player[currency],
        currencyPassiveGain: getCachedCurrencyProp(
          state,
          currency,
          "passiveGain",
        ),
        resetsPerSecond,
        everPerformed,
      };

      const additionalSelection = resetLayerData.usePlayer?.(state);

      const fullSelection = mergeObjects(basicSelection, additionalSelection);

      return fullSelection;
    },
    { useFormat: true },
  );

  const { mergedPlayer } = getPlayerState();
  const { currencyValue, everPerformed } = state;

  const isLocked = shouldResetLayerProgressBarLock(mergedPlayer, resetLayerId);

  const calculatedProgress =
    parseValueGetter(customProgress, mergedPlayer, currencyValue) ??
    calculateProgress(currencyValue, goal);
  const progress = isLocked ? 1 : calculatedProgress;

  const timeLeft = calculateTimeForRequirement(
    currencyValue,
    state.currencyPassiveGain,
    goal,
  );

  const currencyName = formatCurrencyName(currency);

  const parsedLabelParts = parseValueGetter(labelParts, mergedPlayer, isLocked);
  const labelPartCondition =
    everPerformed && !isNil(parsedLabelParts) && parsedLabelParts.length > 0;

  return (
    <ProgressBar
      progress={progress}
      mode={mode}
      animatedBarOptions={animatedBarOptions}
      progressFillClassName={progressFillClassName}
      children={
        <>
          Goal: {formatWithPlural(goal, currencyName)} -{" "}
          <span className="text-time">
            {isLocked ? "Ready" : formatLeftTime(timeLeft)}
          </span>
          {labelPartCondition && progressBarConfig.labelSeparator}
        </>
      }
      {...(labelPartCondition && { labelParts: parsedLabelParts })}
    />
  );
}

export default ResetLayerProgressBar;
