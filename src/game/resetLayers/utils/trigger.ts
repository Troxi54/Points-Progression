import type { MergedPlayer } from "@game/player/merged/types";
import type { BuiltResetLayerConfig, ResetLayerId } from "../types";
import { arrayLastIndex } from "@core/utils/array";
import { deepCopy, objectEntries } from "@core/utils/object";
import { getCurrentGameTime } from "@core/utils/time";
import { shouldDimensionWork } from "@game/dimensions/utils/check";
import getDefaultMergedPlayer from "@game/player/merged/default";
import {
  assignCachedPlayerForMergedPlayer,
  assignMergedPlayer,
  assignPlayerForMergedPlayer,
} from "@game/player/merged/utils";
import { parseValueGetter } from "@game/player/utils";
import resetLayers from "../data";
import {
  canPerform,
  getResetLayerConfig,
  getResetLayerDimensionContainer,
  getResetLayerPlayerDataProp,
} from "./get";
import { setResetLayerCachedPlayerData, setResetLayerPlayerData } from "./set";

function performResetLayer(
  mergedPlayer: MergedPlayer,
  resetLayerId: ResetLayerId,
  rewardCondition: boolean = true,
  forceReset: boolean = false,
) {
  const data = getResetLayerConfig(resetLayerId);
  const { dimensionId } = data;

  const currentTime = getCurrentGameTime(mergedPlayer);

  const resetLayerDimension = getResetLayerDimensionContainer(
    dimensionId,
  ) as BuiltResetLayerConfig[];
  const index = resetLayerDimension.indexOf(data);

  const defaultMergedPlayer = getDefaultMergedPlayer();

  const result = deepCopy(mergedPlayer, 2) as MergedPlayer;

  const startedDate = getResetLayerPlayerDataProp(
    mergedPlayer,
    resetLayerId,
    "startedDate",
  );

  const resetDuration = startedDate === null ? null : currentTime - startedDate;

  const preventReset = parseValueGetter(data.preventReset, mergedPlayer);
  if (forceReset || !preventReset) {
    for (let i = 0; i <= index; i++) {
      const layerData = resetLayerDimension[i];
      const { id } = layerData;

      const resetLayer = layerData.reset(
        result,
        defaultMergedPlayer,
        currentTime,
        mergedPlayer,
      );

      const notLast = i < index;
      if (notLast) {
        assignPlayerForMergedPlayer(
          resetLayer,
          setResetLayerPlayerData(resetLayer, id, {
            isFirstReset: true,
          }),
        );
      }

      assignMergedPlayer(result, {
        ...resetLayer,
        player: {
          ...resetLayer.player,
          resetLayers: {
            ...result.player.resetLayers,
            ...resetLayer.player?.resetLayers,
          },
        },
      });
    }
  }

  if (rewardCondition) {
    const { reward } = data;
    const rewarded = reward(mergedPlayer, resetDuration);

    assignMergedPlayer(result, rewarded);
  }

  const appliedPlayerProperties = setResetLayerPlayerData(
    result,
    resetLayerId,
    {
      isFirstReset: false,
    },
  );

  assignPlayerForMergedPlayer(result, appliedPlayerProperties);

  const appliedCachedProperties = setResetLayerCachedPlayerData(
    result,
    resetLayerId,
    {
      lastResetDuration:
        startedDate === null ? null : currentTime - startedDate,
    },
  );

  assignCachedPlayerForMergedPlayer(result, appliedCachedProperties);

  return result;
}

export function triggerResetLayer(
  mergedPlayer: MergedPlayer,
  resetLayerId: ResetLayerId,
  forceReset: boolean = true,
) {
  const can = canPerform(mergedPlayer, resetLayerId);
  if (!can && !forceReset) return mergedPlayer;

  return performResetLayer(mergedPlayer, resetLayerId, can, forceReset);
}

export function triggerAllResetLayers(
  mergedPlayer: MergedPlayer,
  result: MergedPlayer,
) {
  for (const [dimensionId, dimensionResetLayers] of objectEntries(
    resetLayers,
  )) {
    const dimensionWorks = shouldDimensionWork(result, dimensionId);
    if (!dimensionWorks) continue;

    for (let i = arrayLastIndex(dimensionResetLayers); i >= 0; i--) {
      const resetLayerData = dimensionResetLayers[i];
      const resetLayerId = resetLayerData.id;

      const autoEnabled = getResetLayerPlayerDataProp(
        mergedPlayer.player,
        resetLayerId,
        "autoEnabled",
      );

      if (!autoEnabled) continue;

      const triggered = triggerResetLayer(mergedPlayer, resetLayerId, false);

      if (triggered) {
        assignMergedPlayer(result, triggered);
        break;
      }
    }
  }
}
