import type { MergedPlayer } from "@game/player/merged/types";
import type { ResetLayerId } from "../ids";
import { getCurrentGameTime } from "@core/utils/gameTime";
import { objectAssign } from "@core/utils/object";
import { calculateResetsPerSecond } from "./calculate";
import { getResetLayerConfig, getResetLayerPlayerData } from "./get";
import { setResetLayerPlayerData } from "./set";

export function updateOfflineResetLayer(
  mergedPlayer: MergedPlayer,
  resetLayerId: ResetLayerId,
) {
  if (!getResetLayerConfig(resetLayerId).usesResetsCurrency) return;

  const resetsPerSecond = calculateResetsPerSecond(mergedPlayer, resetLayerId);

  setResetLayerPlayerData(mergedPlayer, resetLayerId, {
    offlineResetsPerSecond: resetsPerSecond,
  });
}

export function updateCachedResetLayer(
  mergedPlayer: MergedPlayer,
  resetLayerId: ResetLayerId,
) {
  const { cachedPlayer } = mergedPlayer;

  const currentData = getResetLayerPlayerData(mergedPlayer, resetLayerId);

  const { startedDate } = currentData;

  const currentTime = getCurrentGameTime(mergedPlayer);
  const currentDuration =
    startedDate === null ? null : currentTime - startedDate;

  const resetsPerSecond = calculateResetsPerSecond(mergedPlayer, resetLayerId);

  objectAssign(cachedPlayer.resetLayers[resetLayerId], {
    duration: currentDuration,
    resetsPerSecond,
  });
}
