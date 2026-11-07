import type { MergedPlayer } from "@game/player/merged/types";
import type { ResetLayerId } from "../ids";
import { getCurrentGameTime } from "@core/utils/gameTime";
import { getResetLayerCachedPlayerData, getResetLayerPlayerData } from "./get";
import { setResetLayerPlayerData } from "./set";

export function updateResetLayer(
  mergedPlayer: MergedPlayer,
  resetLayerId: ResetLayerId,
) {
  const { player, cachedPlayer } = mergedPlayer;

  const currentData = getResetLayerPlayerData(mergedPlayer, resetLayerId);
  const currentCachedData = getResetLayerCachedPlayerData(
    mergedPlayer,
    resetLayerId,
  );

  const { startedDate } = currentData;
  const { lastResetDuration } = currentCachedData;

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

  setResetLayerPlayerData(player, resetLayerId, {
    resetsPerSecond,
  });

  cachedPlayer.resetLayers[resetLayerId].duration = currentDuration;
}
