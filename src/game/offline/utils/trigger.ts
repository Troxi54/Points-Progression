import { getCurrentTime } from "@core/utils/time";
import offlineConfig from "../config";
import { getPlayerState } from "@game/player/store/store";
import { calculateTicksForOfflineTime } from "./calculate";
import { safeNumber } from "@core/utils/number";

export function triggerOfflineProgress(
  currentTime: number = getCurrentTime(),
): void {
  const { player, cachedPlayer, setCachedPlayer, setPlayer } = getPlayerState();

  const { lastTick, unspentOfflineTime } = player;

  let deltaTime = Math.max(currentTime - lastTick, 0);
  if (!isFinite(deltaTime) || deltaTime <= 0) return;

  if (!player.offlineProgressWorks) {
    return setPlayer({
      lastTick: currentTime,
      offlineOffset: player.offlineOffset + deltaTime,
    });
  }

  let startedDate = lastTick - player.offlineOffset;

  if (cachedPlayer.offlineProgress) {
    if (deltaTime < offlineConfig.minimumTime) return;
  }

  if (unspentOfflineTime > 0) {
    deltaTime += unspentOfflineTime;
    startedDate -= unspentOfflineTime;
  }

  if (deltaTime < offlineConfig.minimumTime) return;

  setCachedPlayer({
    offlineProgress: true,
    offlineProgressFullTime: deltaTime,
    offlineProgressTicksOnTrigger: calculateTicksForOfflineTime(deltaTime),
    offlineProgressTicksCompleted: 0,
    offlineProgressSpeed: 1,
    offlineProgressStartedDate: startedDate,
    offlineProgressLastTick: currentTime,
  });
}

export function skipOfflineProgress(): void {
  const { player, cachedPlayer, setMergedPlayer } = getPlayerState();

  const { offlineProgressFullTime, offlineProgressTicksCompleted } =
    cachedPlayer;
  const fullTime = safeNumber(offlineProgressFullTime);

  const ticksOnTrigger = calculateTicksForOfflineTime(fullTime);
  if (!Number.isFinite(ticksOnTrigger) || ticksOnTrigger <= 0) return;

  const completedTicks = safeNumber(offlineProgressTicksCompleted);
  const remainingProgress = 1 - completedTicks / ticksOnTrigger;
  const remainingTime = Math.max(remainingProgress, 0) * fullTime;

  setMergedPlayer({
    player: {
      offlineOffset: player.offlineOffset + remainingTime,
    },
    cachedPlayer: {
      offlineProgress: false,
    },
  });
}
