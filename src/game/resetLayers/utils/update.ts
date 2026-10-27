import { mergeObjects } from "@core/utils/object";
import { getCurrentGameTime } from "@core/utils/time";
import type { CachedResetLayer } from "@game/player/cached/types";
import type {
  MergedPlayer,
  PartialMergedPlayer,
} from "@game/player/merged/types";
import { mergePartialPlayer } from "@game/player/merged/utils";
import type {
  ResetLayerPlayerData,
  PartialResetLayerPlayerData,
} from "@game/player/types";
import type { ResetLayerId } from "../types";
import {
  getResetLayerPlayerData,
  getResetLayerCachedPlayerData,
  getResetLayerPropsFromPlayerData,
} from "./get";
import { setResetLayerPlayerData, setResetLayerCachedPlayerData } from "./set";

export function updateResetLayer(
  mergedPlayer: MergedPlayer,
  resetLayerId: ResetLayerId,
): PartialMergedPlayer {
  const currentData = getResetLayerPlayerData(mergedPlayer, resetLayerId);
  const currentCachedData = getResetLayerCachedPlayerData(
    mergedPlayer,
    resetLayerId,
  );

  const { startedDate } = getResetLayerPropsFromPlayerData(currentData, [
    "startedDate",
  ]);
  const { lastResetDuration } = currentCachedData;
  const { cachedPlayer } = mergedPlayer;

  const currentTime = getCurrentGameTime(mergedPlayer);
  const currentDuration =
    startedDate === null ? null : currentTime - startedDate;

  let resetsPerSecond: number;
  const hasValidDuration =
    typeof lastResetDuration === "number" &&
    Number.isFinite(lastResetDuration) &&
    lastResetDuration > 0 &&
    typeof currentDuration === "number" &&
    Number.isFinite(currentDuration);

  const hasValidTimeSpeed =
    Number.isFinite(cachedPlayer.timeSpeed) && cachedPlayer.timeSpeed > 0;

  if (
    !hasValidDuration ||
    !hasValidTimeSpeed ||
    currentDuration > lastResetDuration
  ) {
    resetsPerSecond = 0;
  } else {
    resetsPerSecond = (cachedPlayer.timeSpeed * 1000) / lastResetDuration;
    if (!Number.isFinite(resetsPerSecond) || resetsPerSecond < 0) {
      resetsPerSecond = 0;
    }
  }

  const additionalPlayerData: Partial<ResetLayerPlayerData> = {
    resetsPerSecond,
  };

  const newPlayerData: PartialResetLayerPlayerData = mergeObjects(
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

  const applied = setResetLayerPlayerData(
    mergedPlayer,
    resetLayerId,
    newPlayerData,
  );
  const appliedCached = setResetLayerCachedPlayerData(
    mergedPlayer,
    resetLayerId,
    newCachedData,
  );

  return mergePartialPlayer(applied, appliedCached);
}
