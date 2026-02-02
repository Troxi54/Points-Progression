import {
  PartialPlayer,
  PlayerLike,
  ResetLayerPlayerData,
} from "@/game/player/types";
import { CachedPlayerLike } from "@/game/player/cached/types";
import { PartialMergedPlayer } from "@/game/player/merged/types";
import { MergedPlayer } from "@/game/player/merged/types";
import { FullResetLayerData, ResetLayerId } from "../types";
import {
  canPerform,
  getResetLayerCachedPlayerData,
  getResetLayerData,
  getResetLayerDimensionContainer,
  getResetLayerPlayerData,
  getResetLayerPlayerDataProp,
} from "./get";
import { shouldDimensionWork } from "@/game/dimensions/utils/check";
import getDefaultMergedPlayer from "@/game/player/merged/default";
import {
  parseCachedPlayerLike,
  parsePlayerLike,
  parseValueGetter,
} from "@/game/player/utils";
import {
  assignCachedPlayerForMergedPlayer,
  assignMergedPlayer,
  mergePartialPlayer,
} from "@/game/player/merged/utils";
import {
  copyObject,
  deepCopy,
  mergeObjects,
  objectEntries,
} from "@/core/utils/object";
import { getDefaultResetLayerPlayerData } from "@/game/player/default";
import { getDefaultCachedResetLayer } from "@/game/player/cached/default";
import { getCurrentGameTime } from "@/core/utils/time";
import resetLayers from "../data";
import { CachedPlayer, CachedResetLayer } from "@/game/player/cached/types";
import resetLayerConfig from "@/game/resetLayers/config";
import { arrayLastIndex } from "@/core/utils/array";

export function applyResetLayerPlayerData(
  playerLike: PlayerLike,
  resetLayerId: ResetLayerId,
  data: Partial<ResetLayerPlayerData>,
): PartialPlayer {
  const player = parsePlayerLike(playerLike);

  const resetLayerContainer = player.resetLayers;
  const newContainer = resetLayerContainer
    ? copyObject(resetLayerContainer)
    : {};

  let existingData = newContainer[resetLayerId];
  if (!existingData) {
    existingData = newContainer[resetLayerId] =
      getDefaultResetLayerPlayerData();
  }

  const newData = mergeObjects(existingData, data);
  newContainer[resetLayerId] = newData;

  return {
    resetLayers: newContainer,
  };
}

export function applyToggledResetLayerAuto(
  playerLike: PlayerLike,
  resetLayerId: ResetLayerId,
) {
  const player = parsePlayerLike(playerLike);

  return applyResetLayerPlayerData(player, resetLayerId, {
    autoEnabled: !getResetLayerPlayerDataProp(
      player,
      resetLayerId,
      "autoEnabled",
    ),
  });
}

export function applyResetLayerAuto(
  playerLike: PlayerLike,
  resetLayerId: ResetLayerId,
  value: ResetLayerPlayerData["autoEnabled"],
): PartialPlayer | undefined {
  const player = parsePlayerLike(playerLike);

  if (
    getResetLayerPlayerDataProp(player, resetLayerId, "autoEnabled") === value
  )
    return;

  return applyResetLayerPlayerData(player, resetLayerId, {
    autoEnabled: value,
  });
}

export function applyResetLayerCachedPlayerData(
  cachedPlayerLike: CachedPlayerLike,
  resetLayerId: ResetLayerId,
  data: Partial<CachedResetLayer>,
): Partial<CachedPlayer> {
  const cachedPlayer = parseCachedPlayerLike(cachedPlayerLike);

  const resetLayerContainer = cachedPlayer.resetLayers;
  const newContainer = resetLayerContainer
    ? copyObject(resetLayerContainer)
    : {};

  let existingData = newContainer[resetLayerId];
  if (!existingData) {
    existingData = newContainer[resetLayerId] = getDefaultCachedResetLayer();
  }

  const newData = mergeObjects(existingData, data);
  newContainer[resetLayerId] = newData;

  return {
    resetLayers: newContainer,
  };
}

export function triggerResetLayer(
  mergedPlayer: MergedPlayer,
  resetLayerId: ResetLayerId,
): MergedPlayer | undefined {
  const data = getResetLayerData(resetLayerId);
  const { dimensionId } = data;

  if (!canPerform(mergedPlayer, resetLayerId)) return;

  const currentTime = getCurrentGameTime(mergedPlayer);

  const resetLayerDimension = getResetLayerDimensionContainer(
    dimensionId,
  ) as FullResetLayerData[];
  const index = resetLayerDimension.indexOf(data);

  if (index < 0) return;

  const defaultMergedPlayer = getDefaultMergedPlayer();

  const result = deepCopy(mergedPlayer, 2) as MergedPlayer;

  const startedDate = getResetLayerPlayerDataProp(
    mergedPlayer,
    resetLayerId,
    "startedDate",
  );

  const resetDuration = startedDate === null ? null : currentTime - startedDate;

  const preventReset = parseValueGetter(data.preventReset, mergedPlayer);
  if (!preventReset) {
    for (let i = 0; i <= index; i++) {
      const layerData = resetLayerDimension[i];

      const resetLayer = layerData.reset(
        result,
        defaultMergedPlayer,
        currentTime,
      );

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

  const { reward } = data;
  const rewarded = reward(mergedPlayer, resetDuration);

  assignMergedPlayer(result, rewarded);

  const appliedCachedProperties = applyResetLayerCachedPlayerData(
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

function getUpdatedResetLayer(
  mergedPlayer: MergedPlayer,
  resetLayerId: ResetLayerId,
): PartialMergedPlayer {
  const currentData = getResetLayerPlayerData(mergedPlayer, resetLayerId);
  const currentCachedData = getResetLayerCachedPlayerData(
    mergedPlayer,
    resetLayerId,
  );

  const { startedDate } = currentData;
  const { lastResetDuration } = currentCachedData;
  const { cachedPlayer } = mergedPlayer;

  const currentTime = getCurrentGameTime(mergedPlayer);
  const currentDuration =
    startedDate === null ? null : currentTime - startedDate;

  let resetsPerSecond: number;
  if (
    lastResetDuration === null ||
    currentDuration === null ||
    currentDuration > lastResetDuration
  ) {
    resetsPerSecond = 0;
  } else {
    resetsPerSecond = (cachedPlayer.timeSpeed * 1000) / lastResetDuration;
  }

  const additionalPlayerData: Partial<ResetLayerPlayerData> = {
    resetsPerSecond,
  };

  const newPlayerData: ResetLayerPlayerData = mergeObjects(
    currentData,
    additionalPlayerData,
  );

  const additionalCachedData: Partial<CachedResetLayer> = {
    duration: currentDuration,
  };

  const newCachedData: CachedResetLayer = mergeObjects(
    currentCachedData,
    additionalCachedData,
  );

  const applied = applyResetLayerPlayerData(
    mergedPlayer,
    resetLayerId,
    newPlayerData,
  );
  const appliedCached = applyResetLayerCachedPlayerData(
    mergedPlayer,
    resetLayerId,
    newCachedData,
  );

  return mergePartialPlayer(applied, appliedCached);
}

function triggerResetLayers(mergedPlayer: MergedPlayer, result: MergedPlayer) {
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

      const triggered = triggerResetLayer(mergedPlayer, resetLayerId);

      if (triggered) {
        assignMergedPlayer(result, triggered);
        break;
      }
    }
  }
}

export function tickAllResetLayers(
  mergedPlayer: MergedPlayer,
  deltaTime: number,
): MergedPlayer {
  const result = deepCopy(mergedPlayer, 2) as MergedPlayer;

  const { cachedPlayer } = result;

  let accumulator = cachedPlayer.resetsAccumulator;
  accumulator += deltaTime;

  const { maxResetsPerSecond } = resetLayerConfig;
  const minResetInterval = 1000 / maxResetsPerSecond;

  let resetsToApply = Math.floor(accumulator / minResetInterval);
  resetsToApply = Math.min(resetsToApply, maxResetsPerSecond);

  for (let i = 0; i < resetsToApply; i++) {
    triggerResetLayers(mergedPlayer, result);
  }

  if (resetsToApply >= maxResetsPerSecond) {
    accumulator = 0;
  } else {
    accumulator -= resetsToApply * minResetInterval;
  }

  for (const dimensionResetLayers of Object.values(resetLayers)) {
    dimensionResetLayers.forEach((resetLayer) => {
      const updated = getUpdatedResetLayer(result, resetLayer.id);
      assignMergedPlayer(result, updated);
    });
  }

  cachedPlayer.resetsAccumulator = accumulator;

  return result;
}
