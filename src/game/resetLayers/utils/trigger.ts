import type { MergedPlayer } from "@game/player/merged/types";
import type { ResetLayerId } from "../ids";
import type { BuiltResetLayerConfig } from "../types";
import { arrayLastIndex } from "@core/utils/array";
import { getCurrentGameTime } from "@core/utils/gameTime";
import { objectEntries } from "@core/utils/object";
import { shouldDimensionWork } from "@game/dimensions/utils/check";
import getDefaultMergedPlayer from "@game/player/merged/default";
import { parseValueGetter } from "@game/player/utils";
import { current } from "immer";
import resetLayers from "../data";
import {
  canPerform,
  getResetLayerConfig,
  getResetLayerDimensionContainer,
  getResetLayerPlayerData,
} from "./get";
import { setResetLayerPlayerData } from "./set";

function performResetLayer(
  mergedPlayer: MergedPlayer,
  resetLayerId: ResetLayerId,
  rewardCondition: boolean = true,
  forceReset: boolean = false,
) {
  const { cachedPlayer } = mergedPlayer;

  const data = getResetLayerConfig(resetLayerId);
  const { dimensionId } = data;

  const currentTime = getCurrentGameTime(mergedPlayer);

  const resetLayerDimension = getResetLayerDimensionContainer(
    dimensionId,
  ) as BuiltResetLayerConfig[];
  const index = resetLayerDimension.indexOf(data);

  const { startedDate } = getResetLayerPlayerData(mergedPlayer, resetLayerId);

  const sourceMergedPlayer = current(mergedPlayer);
  const defaultMergedPlayer = getDefaultMergedPlayer();

  const resetDuration = startedDate === null ? null : currentTime - startedDate;

  const preventReset = parseValueGetter(data.preventReset, mergedPlayer);
  if (forceReset || !preventReset) {
    for (let i = 0; i <= index; i++) {
      const layerData = resetLayerDimension[i];
      const { id } = layerData;

      layerData.reset(
        mergedPlayer,
        defaultMergedPlayer,
        currentTime,
        sourceMergedPlayer,
      );

      const notLast = i < index;
      if (notLast) {
        setResetLayerPlayerData(mergedPlayer, id, {
          isFirstReset: true,
        });
      }
    }
  }

  if (rewardCondition) {
    data.reward(sourceMergedPlayer, resetDuration);
  }

  setResetLayerPlayerData(mergedPlayer, resetLayerId, {
    isFirstReset: false,
  });

  cachedPlayer.resetLayers[resetLayerId].lastResetDuration =
    startedDate === null ? null : currentTime - startedDate;
}

export function triggerResetLayer(
  mergedPlayer: MergedPlayer,
  resetLayerId: ResetLayerId,
  forceReset: boolean = true,
): true | undefined {
  const can = canPerform(mergedPlayer, resetLayerId);
  if (!can && !forceReset) return;

  performResetLayer(mergedPlayer, resetLayerId, can, forceReset);

  return true;
}

export function triggerAllResetLayers(mergedPlayer: MergedPlayer) {
  for (const [dimensionId, dimensionResetLayers] of objectEntries(
    resetLayers,
  )) {
    const dimensionWorks = shouldDimensionWork(mergedPlayer, dimensionId);
    if (!dimensionWorks) continue;

    for (let i = arrayLastIndex(dimensionResetLayers); i >= 0; i--) {
      const resetLayerData = dimensionResetLayers[i];
      const resetLayerId = resetLayerData.id;

      const { autoEnabled } = getResetLayerPlayerData(
        mergedPlayer,
        resetLayerId,
      );
      if (!autoEnabled) continue;

      const triggered = triggerResetLayer(mergedPlayer, resetLayerId, false);
      if (triggered) break;
    }
  }
}
